/**
 * `GestureEvent` (wibbly §3.3) → `AttestedEvent` (magnetite seam §3.7).
 *
 * The mapping is small; the two interesting parts are the timestamp and the
 * speed unit, and both are documented at their fields because both are places
 * where a plausible-looking wrong answer is easy to write.
 */

import type { GestureEvent } from '@vulos/wibbly-input';
import { toF32, type AttestedEventWire } from './wire';

export interface AdapterOptions {
  /**
   * The player's 64-char hex Ed25519 public key — becomes `player`.
   *
   * Required: `AttestedEvent.player` is not optional on the Rust side, and
   * there is no meaningful placeholder. When signing, this must equal the
   * signer's key or `SignedAttestedEvent::verify` fails closed.
   */
  playerKeyHex: string;

  /**
   * Scale for converting a recognizer's normalized-units-per-millisecond speed
   * into the metres/second `speed_mps` expects.
   *
   * ── ASSUMPTION, and an unavoidable one ──────────────────────────────────
   * A monocular camera with no depth and no calibration cannot know how many
   * metres a frame width spans; that depends on lens FOV and how far away the
   * player is standing. `SwingRecognizer` reports speed in normalized frame
   * widths per millisecond, which is dimensionless. Any conversion to m/s is
   * therefore a *guess about the room*, and `speed_mps` is a claim built on it.
   *
   * The default 1.6 m is roughly the horizontal span a 640×480 webcam covers at
   * a typical arm's-length-plus play distance. It is chosen so an ordinary
   * swing lands well inside magnetite's 20 m/s human ceiling rather than to be
   * accurate — it is not measured, and no per-user calibration for it exists
   * yet. §3.5 `Calibration` already learns a reach envelope in normalized units
   * and is the right place to ground this properly later.
   *
   * Set {@link speedMps} to `false` to send `null` instead and decline to make
   * the claim at all, which is the more honest option for a host that treats
   * speed as meaningful.
   */
  metresPerFrameWidth?: number;

  /** Set `false` to always send `speed_mps: null`. Default `true`. */
  speedMps?: boolean;

  /**
   * First sequence number. Sequence must strictly increase per player for the
   * lifetime of the server's view of that player, so a client that reconnects
   * without the server having called `forget()` must keep counting up rather
   * than restart. Defaults to 0, i.e. the first event carries `seq: 1`.
   */
  startSeq?: number;
}

const DEFAULT_METRES_PER_FRAME_WIDTH = 1.6;

/**
 * Stateful adapter. Owns the monotonic sequence counter, which is why it is a
 * class and not a free function.
 */
export class AttestedEventAdapter {
  private seq: number;
  private readonly playerKeyHex: string;
  private readonly metresPerFrameWidth: number;
  private readonly emitSpeed: boolean;

  constructor(opts: AdapterOptions) {
    if (!/^[0-9a-fA-F]{64}$/.test(opts.playerKeyHex)) {
      throw new Error(
        `playerKeyHex must be 64 hex characters (a 32-byte Ed25519 key); got ${opts.playerKeyHex?.length ?? 0} chars`,
      );
    }
    this.playerKeyHex = opts.playerKeyHex.toLowerCase();
    this.metresPerFrameWidth = opts.metresPerFrameWidth ?? DEFAULT_METRES_PER_FRAME_WIDTH;
    this.emitSpeed = opts.speedMps !== false;
    this.seq = opts.startSeq ?? 0;
  }

  /** The sequence number most recently issued. 0 before the first event. */
  get lastSeq(): number {
    return this.seq;
  }

  get player(): string {
    return this.playerKeyHex;
  }

  /**
   * Convert one gesture into one attested event, consuming the next sequence
   * number.
   *
   * Every float is rounded to `f32` first. That is not cosmetic: the server
   * deserializes these into Rust `f32`s and recomputes the signing preimage
   * from the rounded values, so signing the unrounded `f64` would produce a
   * signature that fails to verify on a value like 0.1.
   */
  adapt(ev: GestureEvent): AttestedEventWire {
    this.seq += 1;
    return {
      player: this.playerKeyHex,
      kind: ev.kind,
      confidence: toF32(clamp01(ev.confidence)),
      vector: this.vectorOf(ev),
      speed_mps: this.speedOf(ev),
      // `tCapture` is the timestamp of the FRAME, not of the moment the
      // recognizer decided. wibbly's AdaptivePacer means those routinely differ
      // by tens of milliseconds and by a varying amount, so using detection
      // time would charge the player for our own inference latency, drift the
      // server's cooldown arithmetic (which is computed on t_capture_ms), and
      // inflate the apparent age of every event. GestureEvent carries capture
      // time precisely so this bridge does not have to guess.
      t_capture_ms: Math.round(ev.tCapture),
      seq: this.seq,
    };
  }

  /**
   * Reset the counter. Only correct after the host has forgotten this player
   * (`PlausibilityGate::forget`) — otherwise every reused number is refused as
   * `SequenceReplayed`. A plain reconnect does **not** qualify.
   */
  resetSequence(startSeq = 0): void {
    this.seq = startSeq;
  }

  private vectorOf(ev: GestureEvent): [number, number, number] | null {
    if (!ev.vector) return null;
    // GestureEvent.vector is a normalized image-space displacement (frame
    // widths/heights); AttestedEvent.vector is documented only as a
    // "direction/magnitude hint in game units". We pass it through unscaled and
    // note it: a host reading these must know they are normalized, not metres.
    // z is absent from most 2D recognizers, so it is 0 rather than invented.
    return [toF32(ev.vector.x), toF32(ev.vector.y), toF32(ev.vector.z ?? 0)];
  }

  private speedOf(ev: GestureEvent): number | null {
    if (!this.emitSpeed) return null;
    const raw = ev.detail?.['speed'];
    if (typeof raw !== 'number' || !Number.isFinite(raw) || raw < 0) return null;
    // normalized frame widths per ms → metres per second.
    return toF32(raw * this.metresPerFrameWidth * 1000);
  }
}

function clamp01(v: number): number {
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(1, v));
}
