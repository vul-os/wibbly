/**
 * The wire envelope for wibbly's peer-to-peer transport.
 *
 * There is no server and no Rust process on the other end of this connection
 * — the other end is another wibbly tab, running the same code. So unlike
 * this package's previous life (see git history / README "What this used to
 * be"), there is no external wire shape to match byte-for-byte: this format
 * only has to agree with itself.
 *
 * Two message kinds cross a `PeerTransport`:
 *   - `gesture` — a guest's locally captured `GestureEvent`, sent to the host.
 *   - `state`   — the host's simulation state, broadcast to guests. Opaque:
 *     this package does not know what a game's state looks like, only that it
 *     must be JSON-serializable.
 *
 * Both carry a `seq`: a single per-connection counter incremented on every
 * outbound message (gesture or state, whichever this side sends), used by
 * `InboundGate` on the *other* end to reject duplicates and stale reorders.
 * There is no cross-session identity to preserve — a fresh `RTCDataChannel` is
 * a fresh connection, so `seq` simply starts at 1 again. Nothing here needs
 * magnetite's `forget()` dance for a persistent per-player high-water mark.
 */

import type { GestureEvent } from '@vulos/wibbly-input';

/** JSON-safe mirror of `GestureEvent` (WIBBLY.md §3.3) as it crosses the wire. */
export interface GestureEventWire {
  playerId: string;
  kind: string;
  confidence: number;
  vector?: { x: number; y: number; z?: number };
  tCapture: number;
  detail?: Record<string, unknown>;
}

export function gestureToWire(ev: GestureEvent): GestureEventWire {
  const out: GestureEventWire = {
    playerId: ev.playerId,
    kind: ev.kind,
    confidence: ev.confidence,
    tCapture: ev.tCapture,
  };
  if (ev.vector) {
    out.vector =
      ev.vector.z !== undefined
        ? { x: ev.vector.x, y: ev.vector.y, z: ev.vector.z }
        : { x: ev.vector.x, y: ev.vector.y };
  }
  if (ev.detail) out.detail = ev.detail;
  return out;
}

export function wireToGesture(w: GestureEventWire): GestureEvent {
  const out: GestureEvent = {
    playerId: w.playerId,
    kind: w.kind,
    confidence: w.confidence,
    tCapture: w.tCapture,
  };
  if (w.vector) out.vector = w.vector;
  if (w.detail) out.detail = w.detail;
  return out;
}

export interface GestureMessage {
  type: 'gesture';
  /** Per-connection monotonic counter. See module doc. */
  seq: number;
  event: GestureEventWire;
}

export interface StateMessage {
  type: 'state';
  seq: number;
  /** Game-defined, opaque to this package. Must be JSON-serializable. */
  state: unknown;
}

export type PeerMessage = GestureMessage | StateMessage;

/** `JSON.stringify`, named so call sites read as "put this on the wire" rather than a generic serialize. */
export function encodePeerMessage(msg: PeerMessage): string {
  return JSON.stringify(msg);
}
