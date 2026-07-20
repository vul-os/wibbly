/**
 * `MagnetiteSession` — connect, stream gesture events, degrade, tear down.
 *
 * HONESTY, restated here because this is the file a game author opens: every
 * event this session sends is **client-attested**. It is not verified, not
 * replay-checkable, and not anti-cheat. A determined cheater can synthesise
 * events that are indistinguishable from real ones — magnetite pins that
 * ceiling in its own test suite. The server remains the authority; this is a
 * client that makes claims to it.
 */

import type { GestureEvent } from '@vulos/wibbly-input';
import { AttestedEventAdapter, type AdapterOptions } from './adapter';
import { createEd25519Signer, type AttestedSigner } from './identity';
import { PreflightGate, type PreflightLimits, type PreflightRejection } from './preflight';
import { clientTransport, type MagnetiteClientLike, type MagnetiteTransport } from './transport';
import {
  ATTESTED_FRAME_TYPE,
  bytesToHex,
  signedAttestedSigningBytes,
  type AttestedFrame,
} from './wire';

export type SessionStatus = 'idle' | 'connecting' | 'connected' | 'disconnected' | 'closed';

/** Why a submitted gesture did not reach the wire. */
export type SubmitFailure =
  | { kind: 'not_connected' }
  | { kind: 'preflight'; reason: PreflightRejection; detail?: string }
  | { kind: 'send_failed' }
  | { kind: 'error'; error: unknown };

export type SubmitResult = { sent: true; seq: number } | ({ sent: false } & SubmitFailure);

export interface MagnetiteSessionOptions {
  /** WebSocket URL of a magnetite node, e.g. `ws://127.0.0.1:9001`. */
  url: string;
  token?: string;
  /** Passed to `createClient`. Default true. */
  autoReconnect?: boolean;

  /**
   * Builds the underlying client. Defaults to a dynamic import of
   * {@link MagnetiteSessionOptions.clientModule} — magnetite-web-client is not
   * on a registry, so the specifier is the integrator's to choose.
   */
  clientFactory?: (opts: {
    url: string;
    token?: string;
    autoReconnect: boolean;
  }) => MagnetiteClientLike | Promise<MagnetiteClientLike>;

  /** Module specifier exporting `createClient`. Default `@magnetite/web-client`. */
  clientModule?: string;

  /** Bypass the client entirely — the seam tests use this. */
  transport?: MagnetiteTransport;

  /**
   * Signer for attested events.
   *   - omitted → try WebCrypto Ed25519, fall back to unsigned;
   *   - a signer → use it;
   *   - `false`  → do not sign, deliberately.
   * When unsigned, {@link signed} is false and events carry no authorship
   * binding whatsoever.
   */
  signer?: AttestedSigner | false;

  /**
   * Player public key, hex. Required only when running unsigned — with a signer
   * it is taken from the signer, and must be, or the host's `verify()` refuses
   * the event for naming a different player than the signing key.
   */
  playerKeyHex?: string;

  /** Adapter tuning (speed scale, whether to claim a speed at all). */
  adapter?: Omit<AdapterOptions, 'playerKeyHex'>;

  /** Overrides for the local pre-flight. See preflight.ts on why it is not a defence. */
  limits?: Partial<PreflightLimits>;

  /** Injectable clock, ms since epoch. Defaults to `Date.now`. */
  now?: () => number;

  onStatusChange?: (status: SessionStatus) => void;
  /** Called for every dropped event. Diagnostics only — never an accusation. */
  onDrop?: (failure: SubmitFailure, event: GestureEvent) => void;
  onError?: (err: unknown) => void;
}

export class MagnetiteSession {
  private readonly opts: MagnetiteSessionOptions;
  private readonly now: () => number;
  private readonly gate: PreflightGate;

  private transport: MagnetiteTransport | null = null;
  private adapter: AttestedEventAdapter | null = null;
  private signer: AttestedSigner | null = null;
  private _status: SessionStatus = 'idle';
  private _closed = false;
  /** Guards against a second connect() racing the first. */
  private connecting: Promise<void> | null = null;

  private _sent = 0;
  private _dropped = 0;

  constructor(opts: MagnetiteSessionOptions) {
    this.opts = opts;
    this.now = opts.now ?? (() => Date.now());
    this.gate = new PreflightGate(opts.limits ?? {});
  }

  get status(): SessionStatus {
    return this._status;
  }

  /** True once connected and able to send. */
  get isConnected(): boolean {
    return this._status === 'connected' && !!this.transport?.isConnected;
  }

  /**
   * Whether events are being signed. **False means events carry no authorship
   * binding at all** — anyone able to write to the socket could claim to be this
   * player. Surface this rather than hiding it.
   */
  get signed(): boolean {
    return this.signer !== null;
  }

  /** The player key events are attributed to, or null before connect. */
  get playerKeyHex(): string | null {
    return this.adapter?.player ?? null;
  }

  get stats(): { sent: number; dropped: number; lastSeq: number } {
    return { sent: this._sent, dropped: this._dropped, lastSeq: this.adapter?.lastSeq ?? 0 };
  }

  /**
   * Connect. Idempotent, and safe to call while a connect is in flight.
   *
   * Rejects only on a *configuration* failure (no usable player key, no
   * transport). A node that is simply unreachable is not an error here — the
   * transport reconnects in the background and {@link submit} reports
   * `not_connected` meanwhile, which is what lets the game keep playing locally.
   */
  async connect(): Promise<void> {
    if (this._closed) throw new Error('MagnetiteSession is closed; construct a new one');
    if (this._status === 'connected' || this._status === 'connecting') {
      return this.connecting ?? Promise.resolve();
    }
    this.connecting = this.doConnect();
    try {
      await this.connecting;
    } finally {
      this.connecting = null;
    }
  }

  private async doConnect(): Promise<void> {
    this.setStatus('connecting');

    // Identity first: without a player key there is no event to send, so
    // failing here is better than failing on the first swing.
    if (!this.signer && this.opts.signer !== false) {
      this.signer = this.opts.signer ?? (await createEd25519Signer());
    }
    if (!this.adapter) {
      const key = this.signer?.publicKeyHex ?? this.opts.playerKeyHex;
      if (!key) {
        this.setStatus('idle');
        throw new Error(
          'no player key: Ed25519 is unavailable in this engine and no `playerKeyHex` was ' +
            'provided. AttestedEvent.player is required, so events cannot be built. ' +
            'Supply playerKeyHex to run unsigned (events will carry no authorship binding).',
        );
      }
      this.adapter = new AttestedEventAdapter({ ...(this.opts.adapter ?? {}), playerKeyHex: key });
    }

    if (!this.transport) {
      this.transport = this.opts.transport ?? clientTransport(await this.buildClient());
      // NOTE: these are set on the ConnectionManager, which magnetite's own
      // client does not use — it registers message handlers instead. If that
      // changes upstream we would be clobbering its handlers.
      this.transport.onOpen(() => this.setStatus('connected'));
      this.transport.onClose(() => {
        // Not terminal: autoReconnect brings the socket back and onOpen fires
        // again. Until then the game plays locally.
        if (!this._closed) this.setStatus('disconnected');
      });
      this.transport.onError((err) => this.opts.onError?.(err));
    }

    await this.transport.connect();
    // Some transports (and the mock) are open synchronously; others fire
    // onOpen later. Reflect reality rather than assuming either.
    if (this.transport.isConnected) this.setStatus('connected');
  }

  private async buildClient(): Promise<MagnetiteClientLike> {
    const args = {
      url: this.opts.url,
      ...(this.opts.token !== undefined ? { token: this.opts.token } : {}),
      autoReconnect: this.opts.autoReconnect !== false,
    };
    if (this.opts.clientFactory) return this.opts.clientFactory(args);

    const specifier = this.opts.clientModule ?? '@magnetite/web-client';
    const mod = (await import(/* @vite-ignore */ specifier)) as {
      createClient?: (o: unknown) => MagnetiteClientLike;
    };
    if (typeof mod.createClient !== 'function') {
      throw new Error(`module "${specifier}" does not export createClient`);
    }
    return mod.createClient(args);
  }

  /**
   * Adapt, pre-flight, sign and send one gesture.
   *
   * Never throws: a game loop calls this from a recognizer callback and a
   * network hiccup must not take the frame down with it. Failures are returned
   * and reported to `onDrop`.
   *
   * Note the ordering: a gesture rejected by the local pre-flight **still
   * consumes a sequence number**, because the adapter allocates one when it
   * builds the event. That is deliberate and harmless — the server requires
   * sequence numbers to strictly increase, not to be gapless.
   */
  async submit(event: GestureEvent): Promise<SubmitResult> {
    try {
      if (this._closed || !this.adapter || !this.transport) {
        return this.drop({ kind: 'not_connected' }, event);
      }
      if (!this.isConnected) return this.drop({ kind: 'not_connected' }, event);

      const wire = this.adapter.adapt(event);

      // Client-side pre-flight. AN OPTIMISATION, NOT A SECURITY BOUNDARY: it
      // runs in code the player controls and can be deleted by them. It exists
      // so an obviously-bad event does not spend the player's server-side rate
      // budget or a round trip. The server's PlausibilityGate re-checks all of
      // it and is the only authority.
      const verdict = this.gate.admit(wire, this.now());
      if (!verdict.ok) {
        return this.drop(
          {
            kind: 'preflight',
            reason: verdict.reason!,
            ...(verdict.detail !== undefined ? { detail: verdict.detail } : {}),
          },
          event,
        );
      }

      let frame: AttestedFrame;
      if (this.signer) {
        const preimage = signedAttestedSigningBytes(wire, this.signer.publicKeyHex);
        const sig = await this.signer.sign(preimage);
        frame = {
          type: ATTESTED_FRAME_TYPE,
          signed: { event: wire, player_key: this.signer.publicKeyHex, sig: bytesToHex(sig) },
        };
      } else {
        frame = { type: ATTESTED_FRAME_TYPE, event: wire };
      }

      // Re-check liveness: signing is async, so the socket may have dropped.
      if (!this.transport.isConnected) return this.drop({ kind: 'not_connected' }, event);
      if (!this.transport.send(JSON.stringify(frame))) {
        return this.drop({ kind: 'send_failed' }, event);
      }
      this._sent += 1;
      return { sent: true, seq: wire.seq };
    } catch (error) {
      this.opts.onError?.(error);
      return this.drop({ kind: 'error', error }, event);
    }
  }

  /**
   * Convenience: stream every gesture from a wibbly input pipeline.
   * Returns an unsubscribe function.
   */
  attach(input: { onGesture(cb: (ev: GestureEvent) => void): () => void }): () => void {
    return input.onGesture((ev) => {
      void this.submit(ev);
    });
  }

  /**
   * Disconnect but keep the session reusable — `connect()` works again and the
   * sequence counter deliberately keeps climbing, because the host's
   * `PlausibilityGate` still holds this player's high-water mark unless it
   * called `forget()`. Restarting the count would get every event refused as
   * `SequenceReplayed`.
   */
  disconnect(): void {
    this.transport?.disconnect();
    this.setStatus('disconnected');
  }

  /**
   * Permanent teardown. Drops the transport, clears pre-flight state and makes
   * the session unusable. Safe to call twice.
   */
  close(): void {
    if (this._closed) return;
    this._closed = true;
    try {
      this.transport?.disconnect();
    } catch (err) {
      this.opts.onError?.(err);
    }
    this.transport = null;
    this.adapter = null;
    this.signer = null;
    this.gate.reset();
    this.setStatus('closed');
  }

  private drop(failure: SubmitFailure, event: GestureEvent): SubmitResult {
    this._dropped += 1;
    this.opts.onDrop?.(failure, event);
    return { sent: false, ...failure };
  }

  private setStatus(status: SessionStatus): void {
    if (this._status === status) return;
    this._status = status;
    this.opts.onStatusChange?.(status);
  }
}
