/**
 * `PeerSession` — one host-authority connection to one other wibbly tab.
 *
 * HONESTY, restated here because this is the file a game author opens: this
 * package runs no server, and the host-authority design is not a downgrade
 * from one — see site/docs/MULTIPLAYER.md's anti-cheat section. Camera
 * gesture input cannot be replay-verified by anyone, host tab or rented
 * server alike, so a rented authority buys nothing a host's own browser tab
 * doesn't. Every event carried here is client-attested: rate-limited and
 * sanity-checked (see inbound-gate.ts), never proven to have come from a real
 * arm in front of a real camera.
 *
 * One player's tab holds authority and steps the simulation. That tab (the
 * host) instantiates one `PeerSession` per guest connection, wires
 * `onGestureEvent` into its sim step, and calls `broadcastState` once per
 * tick. A guest instantiates one `PeerSession`, wires `onState` into its
 * renderer, and calls `sendGesture` (or `attach`s a wibbly input pipeline
 * directly) from its own local camera pipeline. This class does not know
 * which side is "host" and which is "guest" — it only moves gesture events
 * and opaque state across a `PeerTransport`, validating everything inbound.
 *
 * This package has no idea tennis, or any other game, exists: `state` is
 * whatever JSON-serializable value the game hands it, opaque all the way
 * through.
 */

import type { GestureEvent } from '@vulos/wibbly-input';
import { InboundGate, type InboundLimits, type InboundRejection } from './inbound-gate';
import { gestureToWire, wireToGesture, type PeerMessage } from './message';
import type { PeerTransport } from './transport';

export type PeerSessionStatus = 'idle' | 'connecting' | 'connected' | 'disconnected' | 'closed';

export type SendFailure =
  | { kind: 'not_connected' }
  | { kind: 'send_failed' }
  | { kind: 'error'; error: unknown };

export type SendResult = { sent: true; seq: number } | ({ sent: false } & SendFailure);

/** Why an inbound message never reached a game callback. */
export type DropReason =
  | ({ kind: 'rejected' } & { reason: InboundRejection; detail?: string })
  | { kind: 'error'; error: unknown };

export interface PeerSessionOptions {
  transport: PeerTransport;
  /** Injectable clock, ms since epoch. Defaults to `Date.now`. */
  now?: () => number;
  /**
   * Inbound validation limits for messages arriving from the peer. Pass
   * `expectedPlayerIds` here when this session is a host's view of one guest
   * connection — see inbound-gate.ts for why that check exists.
   */
  limits?: Partial<InboundLimits>;
  /** Called with every accepted inbound `GestureEvent`. A host wires this into its sim. */
  onGestureEvent?(event: GestureEvent): void;
  /** Called with every accepted inbound state update. A guest wires this into its renderer. */
  onState?(state: unknown): void;
  onStatusChange?(status: PeerSessionStatus): void;
  /** Called for every inbound message the gate rejected, or that threw while handling. Diagnostics only — never an accusation; see inbound-gate.ts. */
  onDrop?(drop: DropReason, raw: string): void;
  onError?(err: unknown): void;
}

export class PeerSession {
  private readonly opts: PeerSessionOptions;
  private readonly now: () => number;
  private readonly gate: InboundGate;
  private readonly transport: PeerTransport;

  private _status: PeerSessionStatus = 'idle';
  private _closed = false;
  private outSeq = 0;

  private _sentGestures = 0;
  private _sentStates = 0;
  private _received = 0;
  private _dropped = 0;

  constructor(opts: PeerSessionOptions) {
    this.opts = opts;
    this.transport = opts.transport;
    this.now = opts.now ?? (() => Date.now());
    this.gate = new InboundGate(opts.limits ?? {});

    this.transport.onOpen(() => this.setStatus('connected'));
    this.transport.onClose(() => {
      // Not necessarily terminal — the caller may reopen a new transport, or
      // (rarely) the same one may reconnect. Either way the game keeps
      // running locally in the meantime; sends just start failing with
      // `not_connected` until status flips back.
      if (!this._closed) this.setStatus('disconnected');
    });
    this.transport.onError((err) => this.opts.onError?.(err));
    this.transport.onMessage((raw) => this.handleMessage(raw));
  }

  get status(): PeerSessionStatus {
    return this._status;
  }

  get isConnected(): boolean {
    return this._status === 'connected' && this.transport.isConnected;
  }

  get stats(): { sentGestures: number; sentStates: number; received: number; dropped: number } {
    return {
      sentGestures: this._sentGestures,
      sentStates: this._sentStates,
      received: this._received,
      dropped: this._dropped,
    };
  }

  /**
   * Connect. Rejects only on a *configuration* failure — a transport that
   * throws from `connect()`. A peer that is simply unreachable is not an
   * error here: the game keeps playing locally and `sendGesture` /
   * `broadcastState` report `not_connected` meanwhile.
   */
  async connect(): Promise<void> {
    if (this._closed) throw new Error('PeerSession is closed; construct a new one');
    this.setStatus('connecting');
    await this.transport.connect();
    // Some transports (and the test fakes) are open synchronously; a real
    // WebRTC one opens later via the onOpen event registered in the
    // constructor. Reflect reality rather than assuming either.
    if (this.transport.isConnected) this.setStatus('connected');
  }

  /**
   * Send a locally captured gesture to the peer. Never throws — a game loop
   * calls this from a recognizer callback and a channel hiccup must not take
   * the frame down with it.
   */
  sendGesture(event: GestureEvent): SendResult {
    return this.sendMessage({ type: 'gesture', seq: this.nextSeq(), event: gestureToWire(event) }, 'gesture');
  }

  /**
   * Broadcast one simulation state snapshot to the peer. `state` must be
   * JSON-serializable; this package does not look inside it. Never throws.
   */
  broadcastState(state: unknown): SendResult {
    return this.sendMessage({ type: 'state', seq: this.nextSeq(), state }, 'state');
  }

  private nextSeq(): number {
    this.outSeq += 1;
    return this.outSeq;
  }

  private sendMessage(msg: PeerMessage, kind: 'gesture' | 'state'): SendResult {
    try {
      if (this._closed || !this.isConnected) return { sent: false, kind: 'not_connected' };
      const frame = JSON.stringify(msg);
      if (!this.transport.send(frame)) return { sent: false, kind: 'send_failed' };
      if (kind === 'gesture') this._sentGestures += 1;
      else this._sentStates += 1;
      return { sent: true, seq: msg.seq };
    } catch (error) {
      this.opts.onError?.(error);
      return { sent: false, kind: 'error', error };
    }
  }

  private handleMessage(raw: string): void {
    try {
      const verdict = this.gate.admit(raw, this.now());
      if (!verdict.ok) {
        this._dropped += 1;
        this.opts.onDrop?.(
          { kind: 'rejected', reason: verdict.reason!, ...(verdict.detail !== undefined ? { detail: verdict.detail } : {}) },
          raw,
        );
        return;
      }
      this._received += 1;
      const msg = verdict.message!;
      if (msg.type === 'gesture') this.opts.onGestureEvent?.(wireToGesture(msg.event));
      else this.opts.onState?.(msg.state);
    } catch (error) {
      this._dropped += 1;
      this.opts.onError?.(error);
      this.opts.onDrop?.({ kind: 'error', error }, raw);
    }
  }

  /**
   * Convenience: stream every locally captured gesture as it happens (guest
   * side). Returns an unsubscribe function.
   */
  attach(input: { onGesture(cb: (ev: GestureEvent) => void): () => void }): () => void {
    return input.onGesture((ev) => {
      this.sendGesture(ev);
    });
  }

  /** Disconnect but keep the session reusable — `connect()` works again with a fresh or reopened transport. */
  disconnect(): void {
    this.transport.disconnect();
    this.setStatus('disconnected');
  }

  /** Permanent teardown. Drops the transport, clears gate state, makes the session unusable. Safe to call twice. */
  close(): void {
    if (this._closed) return;
    this._closed = true;
    try {
      this.transport.disconnect();
    } catch (err) {
      this.opts.onError?.(err);
    }
    this.gate.reset();
    this.setStatus('closed');
  }

  private setStatus(status: PeerSessionStatus): void {
    if (this._status === status) return;
    this._status = status;
    this.opts.onStatusChange?.(status);
  }
}
