/**
 * Validates and rate-limits messages arriving from the other end of a
 * `PeerTransport`, before `PeerSession` hands them to the game.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * THIS IS THE REAL DEFENSE NOW — not an optimisation mirroring a stricter
 * authority downstream, which is what this package's previous pre-flight gate
 * was (see git history: it mirrored a magnetite server's `PlausibilityGate`
 * and said outright it was not a security boundary). wibbly's multiplayer has
 * no server. The peer on the other end of this `DataChannel` — trusted
 * playmate or not — is untrusted input the moment their message reaches this
 * process, because nothing stops a modified client on their end sending
 * whatever bytes it wants. This gate is what stands between that and the
 * game's sim or renderer.
 *
 * What it defends against: flooding (a firehose of messages), replay and
 * reorder (duplicate or stale sequence numbers), malformed or oversized
 * frames, and — for gesture events specifically — a guest connection claiming
 * a `playerId` that was not assigned to it.
 *
 * What it does NOT and cannot defend against: a fabricated-but-plausible
 * `GestureEvent`. Camera gesture input is `InputClass::Attested` in the sense
 * this codebase has always used that term (see README.md and
 * site/docs/MULTIPLAYER.md's anti-cheat section): a cheater who hand-writes
 * numbers inside human bounds is indistinguishable from a real swing, at any
 * gate, run by anyone. Nothing here signs events to "prove" authorship either
 * — a signature would only establish "this connection sent this", which the
 * `RTCDataChannel` already gives for free (the only peer that can be on the
 * other end is the one this side exchanged SDP with; there is no third party
 * who could inject into an established channel). See README.md for why that
 * makes per-event signing pure overhead in this design, not a gap.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type { GestureEventWire, PeerMessage } from './message';

export interface InboundLimits {
  /** Flood ceiling: accepted messages per second from this one peer. */
  maxMessagesPerSec: number;
  /** Reject a frame outright, before parsing, past this many UTF-16 code units. */
  maxMessageChars: number;
  /** Gesture-only: confidence floor, 0..1. 0 disables the check. */
  minConfidence: number;
  /** Gesture-only: tolerated forward clock skew on `tCapture`, ms. */
  maxFutureSkewMs: number;
  /** Gesture-only: oldest `tCapture` still actionable, ms. */
  maxAgeMs: number;
  /** Gesture-only: if non-empty, only these `kind` values are accepted. */
  acceptedKinds: string[];
  /**
   * Gesture-only: if set, an inbound gesture whose `playerId` is not in this
   * list is rejected as `unauthorized_player`.
   *
   * The wire `playerId` is self-declared by whichever local `PlayerBinder`
   * produced the `GestureEvent` on the sender's machine — it is not otherwise
   * authenticated. Without this check, one guest connection could claim to be
   * a different player, including the host's own. A host sets this per guest
   * connection (each connection gets its own `PeerSession` and its own gate)
   * to whatever `playerId` it assigned that guest out of band.
   */
  expectedPlayerIds: string[] | null;
}

export const DEFAULT_INBOUND_LIMITS: InboundLimits = {
  // Generous enough to cover a state broadcast at up to 120Hz. A host
  // validating gesture traffic from a guest should pass a much lower number
  // here — no human plausibly swings anywhere near this fast; see the gesture
  // fields below for the checks that actually bound *that*.
  maxMessagesPerSec: 120,
  maxMessageChars: 16_384,
  minConfidence: 0,
  maxFutureSkewMs: 5_000,
  maxAgeMs: 10_000,
  acceptedKinds: [],
  expectedPlayerIds: null,
};

export type InboundRejection =
  | 'too_large'
  | 'malformed'
  | 'invalid_gesture'
  | 'unauthorized_player'
  | 'sequence_replayed'
  | 'rate_exceeded';

export interface InboundResult {
  ok: boolean;
  message?: PeerMessage;
  reason?: InboundRejection;
  /** Human-readable detail, for logging. Never shown as an accusation — see module doc. */
  detail?: string;
}

export class InboundGate {
  private readonly limits: InboundLimits;
  private recentMs: number[] = [];
  private highSeq: number | null = null;

  constructor(limits: Partial<InboundLimits> = {}) {
    this.limits = { ...DEFAULT_INBOUND_LIMITS, ...limits };
  }

  get currentLimits(): Readonly<InboundLimits> {
    return this.limits;
  }

  /**
   * Screen one raw frame at wall-clock `nowMs`.
   *
   * Order matters: size → parse → shape → gesture sanity → authorization →
   * sequence → rate. State only advances on acceptance, so a burst of
   * rejected frames cannot push the peer's own legitimate traffic out of the
   * rate window.
   */
  admit(raw: string, nowMs: number): InboundResult {
    const L = this.limits;

    if (typeof raw !== 'string' || raw.length > L.maxMessageChars) {
      return {
        ok: false,
        reason: 'too_large',
        detail: `${raw?.length ?? 0} chars vs limit ${L.maxMessageChars}`,
      };
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      return { ok: false, reason: 'malformed', detail: `invalid JSON: ${describe(err)}` };
    }

    const shapeErr = validateShape(parsed);
    if (shapeErr) return { ok: false, reason: 'malformed', detail: shapeErr };
    const msg = parsed as PeerMessage;

    if (msg.type === 'gesture') {
      const gestureErr = validateGesture(msg.event, nowMs, L);
      if (gestureErr) return { ok: false, reason: 'invalid_gesture', detail: gestureErr };
      if (L.expectedPlayerIds && !L.expectedPlayerIds.includes(msg.event.playerId)) {
        return {
          ok: false,
          reason: 'unauthorized_player',
          detail: `"${msg.event.playerId}" not in [${L.expectedPlayerIds.join(', ')}]`,
        };
      }
    }

    // One counter per connection: a PeerSession is exactly one connection to
    // exactly one peer, so every message it receives — gesture or state —
    // shares a single sequence space.
    if (this.highSeq !== null && msg.seq <= this.highSeq) {
      return { ok: false, reason: 'sequence_replayed', detail: `seq ${msg.seq} <= ${this.highSeq}` };
    }

    this.recentMs = this.recentMs.filter((t) => nowMs - t < 1_000);
    if (this.recentMs.length >= L.maxMessagesPerSec) {
      return {
        ok: false,
        reason: 'rate_exceeded',
        detail: `${this.recentMs.length + 1}/s vs limit ${L.maxMessagesPerSec}`,
      };
    }

    this.recentMs.push(nowMs);
    this.highSeq = msg.seq;
    return { ok: true, message: msg };
  }

  reset(): void {
    this.recentMs = [];
    this.highSeq = null;
  }
}

function validateShape(v: unknown): string | null {
  if (typeof v !== 'object' || v === null || Array.isArray(v)) return 'not an object';
  const o = v as Record<string, unknown>;
  if (o.type !== 'gesture' && o.type !== 'state') return `unknown type ${JSON.stringify(o.type)}`;
  if (typeof o.seq !== 'number' || !Number.isFinite(o.seq) || !Number.isInteger(o.seq) || o.seq < 0) {
    return `seq must be a non-negative integer, got ${JSON.stringify(o.seq)}`;
  }
  if (o.type === 'gesture' && (typeof o.event !== 'object' || o.event === null)) {
    return 'gesture message missing event object';
  }
  return null;
}

function validateGesture(ev: unknown, nowMs: number, L: InboundLimits): string | null {
  const e = ev as Partial<GestureEventWire> | null;
  if (!e || typeof e.playerId !== 'string' || e.playerId.length === 0) return 'missing playerId';
  if (typeof e.kind !== 'string' || e.kind.length === 0) return 'missing kind';
  if (L.acceptedKinds.length > 0 && !L.acceptedKinds.includes(e.kind)) return `unknown kind ${e.kind}`;
  if (
    typeof e.confidence !== 'number' ||
    !Number.isFinite(e.confidence) ||
    e.confidence < 0 ||
    e.confidence > 1 ||
    e.confidence < L.minConfidence
  ) {
    return `implausible confidence ${e.confidence}`;
  }
  if (typeof e.tCapture !== 'number' || !Number.isFinite(e.tCapture)) return 'missing/invalid tCapture';
  if (e.tCapture > nowMs + L.maxFutureSkewMs) return `tCapture ${e.tCapture - nowMs}ms in the future`;
  if (nowMs - e.tCapture > L.maxAgeMs) return `tCapture ${nowMs - e.tCapture}ms stale`;
  if (e.vector !== undefined) {
    const vec = e.vector as { x?: unknown; y?: unknown; z?: unknown };
    if (
      typeof vec !== 'object' ||
      vec === null ||
      typeof vec.x !== 'number' ||
      !Number.isFinite(vec.x) ||
      typeof vec.y !== 'number' ||
      !Number.isFinite(vec.y) ||
      (vec.z !== undefined && (typeof vec.z !== 'number' || !Number.isFinite(vec.z)))
    ) {
      return 'malformed vector';
    }
  }
  if (e.detail !== undefined && (typeof e.detail !== 'object' || e.detail === null || Array.isArray(e.detail))) {
    return 'detail must be a plain object';
  }
  return null;
}

function describe(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}
