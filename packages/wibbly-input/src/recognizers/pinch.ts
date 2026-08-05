import { handLandmark, type Hand, type Handedness, type PlayerId, type Vector2 } from '../types';
import type { BoundHand, GestureEvent } from '../types';
import { HysteresisGate, handStateKey, usableLandmark, type HandGestureRecognizer } from './hand-recognizer';

/**
 * Pinch: thumb tip to index tip distance, WHY normalized against hand size
 * rather than a raw pixel/normalized-frame threshold — a naive threshold
 * ("pinch if distance < 0.05") silently breaks the moment the player steps
 * back from the camera, because the whole hand — thumb-index gap included —
 * shrinks in frame-normalized units with distance. `handScale` (wrist to
 * middle_mcp, the palm's own rigid length) shrinks by exactly the same factor
 * a step-back applies to the pinch distance, so `distance / handScale` is
 * approximately constant for the same physical pinch regardless of how far
 * the player is standing from the camera or what capture resolution was used.
 */
export interface PinchSample {
  thumbTip: Vector2;
  indexTip: Vector2;
  /** wrist→middle_mcp distance, the per-frame reference "how big is this hand right now". */
  handScale: number;
}

export interface PinchConfig {
  /** ratio (thumb-index distance / handScale) at or below which a pinch BEGINS. */
  enterRatio: number;
  /**
   * ratio at or above which an active pinch RELEASES. Deliberately > enterRatio:
   * the gap between the two is the hysteresis band — see HysteresisGate's doc.
   * Without it, a ratio hovering near one shared threshold (exactly the
   * "rapid pinch chatter" failure mode) fires start/release every frame.
   */
  exitRatio: number;
  /** Consecutive qualifying frames required before the FIRST pinch-start fires — absorbs a single noisy frame. */
  enterFrames: number;
  /** Frames of missing/unusable hand data tolerated before force-releasing an active pinch (brief occlusion grace). */
  maxMissedFrames: number;
  /** Landmarks below this score, or outside the visible frame, are not sampled at all. */
  minLandmarkScore: number;
}

/**
 * These thresholds are a reasoned default, not a ported legacy heuristic (no
 * prior pinch code existed to port, unlike swing.ts's constants) — expect a
 * game to tune `enterRatio`/`exitRatio` against its own art scale. The
 * starting point: an open hand's thumb-index gap is comparable to or larger
 * than the palm length (ratio ~0.7-1.2+); fingertips touching is ratio ~0.
 * 0.35/0.5 sits well inside "clearly touching" vs "clearly not", leaving the
 * 0.35-0.5 band as dead space no ordinary pinch/release should linger in.
 */
export const DEFAULT_PINCH_CONFIG: PinchConfig = {
  enterRatio: 0.35,
  exitRatio: 0.5,
  enterFrames: 2,
  maxMissedFrames: 4,
  minLandmarkScore: 0.3,
};

export interface PinchMeasurement {
  ratio: number;
  distance: number;
  handScale: number;
  midpoint: Vector2;
}

/**
 * Extract the pinch-relevant landmarks for one frame, or null when the hand
 * is not confidently and fully visible. Mirrors `sampleArm` in
 * recognizers/swing.ts: the "extract + validate" half of the pure-function
 * split, kept separate from the "decide" half (`measurePinch`) below.
 */
export function samplePinch(
  hand: Hand,
  minLandmarkScore = DEFAULT_PINCH_CONFIG.minLandmarkScore,
): PinchSample | null {
  const wrist = handLandmark(hand, 'wrist', 0);
  const middleMcp = handLandmark(hand, 'middle_mcp', 0);
  const thumbTip = handLandmark(hand, 'thumb_tip', 0);
  const indexTip = handLandmark(hand, 'index_tip', 0);

  if (
    !usableLandmark(wrist, minLandmarkScore) ||
    !usableLandmark(middleMcp, minLandmarkScore) ||
    !usableLandmark(thumbTip, minLandmarkScore) ||
    !usableLandmark(indexTip, minLandmarkScore)
  ) {
    return null;
  }

  const handScale = Math.hypot(middleMcp!.x - wrist!.x, middleMcp!.y - wrist!.y);
  if (!(handScale > 0)) return null; // degenerate hand box — cannot form a meaningful ratio

  return {
    thumbTip: { x: thumbTip!.x, y: thumbTip!.y },
    indexTip: { x: indexTip!.x, y: indexTip!.y },
    handScale,
  };
}

/** Pure: sample → ratio/distance/midpoint. No state, no camera, no clock. */
export function measurePinch(sample: PinchSample): PinchMeasurement {
  const distance = Math.hypot(
    sample.indexTip.x - sample.thumbTip.x,
    sample.indexTip.y - sample.thumbTip.y,
  );
  return {
    distance,
    handScale: sample.handScale,
    ratio: distance / sample.handScale,
    midpoint: {
      x: (sample.indexTip.x + sample.thumbTip.x) / 2,
      y: (sample.indexTip.y + sample.thumbTip.y) / 2,
    },
  };
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

/** 1 at ratio 0 (fingers touching), 0 at the release boundary — never a flat 1 for a pinch held right at the edge. */
function pinchConfidence(ratio: number, exitRatio: number): number {
  return clamp01(1 - ratio / exitRatio);
}

interface PinchState {
  playerId: PlayerId;
  handedness: Handedness;
  gate: HysteresisGate<number>;
  /** Midpoint at pinch-start, so hold/release events can report drag delta. */
  origin: Vector2 | null;
}

export type PinchRecognizerOptions = Partial<PinchConfig>;

/**
 * Stateful wrapper: one HysteresisGate per (player, hand), so a player's left
 * and right hands — and different players' hands, given distinct playerIds —
 * pinch independently. Emits 'pinch-start' / 'pinch-hold' / 'pinch-release' as
 * `detail.phase` on a single `kind: 'pinch'`, matching WIBBLY.md §3.3's fixed
 * gesture vocabulary (`'pinch'` is one of the named kinds) while still giving
 * palmworks the continuous stream a pinch-DRAG needs: `detail.delta` is the
 * midpoint's displacement since pinch-start, updated every held frame.
 *
 * HONEST LIMITATION: identity here is `(playerId, handedness)`, not a durable
 * per-hand track id — there is no hand equivalent of `SpatialBinder` in this
 * package yet. This is exactly right for one player using both hands (the
 * common palmworks case) and wrong for two UNBOUND people's hands sharing one
 * `playerId` (their left hands would be indistinguishable). A caller with
 * multiple people must assign distinct playerIds per person before this
 * recognizer sees the hands — see `HandGestureRecognizer`'s doc.
 */
export class PinchRecognizer implements HandGestureRecognizer {
  readonly kind = 'pinch';
  private config: PinchConfig;
  private state = new Map<string, PinchState>();

  constructor(options: PinchRecognizerOptions = {}) {
    this.config = { ...DEFAULT_PINCH_CONFIG, ...options };
  }

  /** Read-only: is this (player, hand) currently mid-pinch? Useful for a game's own cursor rendering. */
  isPinching(playerId: PlayerId, handedness: Handedness): boolean {
    return this.state.get(handStateKey(playerId, handedness))?.gate.isActive ?? false;
  }

  feed(hands: BoundHand[], tNow: number): GestureEvent[] {
    const events: GestureEvent[] = [];
    const seen = new Set<string>();

    for (const hand of hands) {
      const key = handStateKey(hand.playerId, hand.handedness);
      seen.add(key);
      const st = this.stateFor(key, hand.playerId, hand.handedness);

      const sample = samplePinch(hand, this.config.minLandmarkScore);
      if (!sample) {
        if (st.gate.feedMissing() === 'exit') {
          events.push(this.emit('release', st, null, tNow));
          st.origin = null;
        }
        continue;
      }

      const m = measurePinch(sample);
      const transition = st.gate.feed(m.ratio);
      if (transition === 'enter') {
        st.origin = m.midpoint;
        events.push(this.emit('start', st, m, tNow));
      } else if (transition === 'hold') {
        events.push(this.emit('hold', st, m, tNow));
      } else if (transition === 'exit') {
        events.push(this.emit('release', st, m, tNow));
        st.origin = null;
      }
    }

    // A hand this player had before, but that the tracker did not return AT
    // ALL this frame, is indistinguishable from one that was merely
    // low-confidence — both mean "we don't currently know where this hand
    // is" — so it gets the same missed-frame grace rather than an instant cut.
    for (const st of this.state.values()) {
      const key = handStateKey(st.playerId, st.handedness);
      if (seen.has(key)) continue;
      if (st.gate.feedMissing() === 'exit') {
        events.push(this.emit('release', st, null, tNow));
        st.origin = null;
      }
    }

    return events;
  }

  private stateFor(key: string, playerId: PlayerId, handedness: Handedness): PinchState {
    let st = this.state.get(key);
    if (!st) {
      st = {
        playerId,
        handedness,
        gate: new HysteresisGate<number>(
          (ratio) => ratio <= this.config.enterRatio,
          (ratio) => ratio >= this.config.exitRatio,
          this.config.enterFrames,
          this.config.maxMissedFrames,
        ),
        origin: null,
      };
      this.state.set(key, st);
    }
    return st;
  }

  private emit(
    phase: 'start' | 'hold' | 'release',
    st: PinchState,
    m: PinchMeasurement | null,
    tNow: number,
  ): GestureEvent {
    const position = m?.midpoint ?? st.origin ?? { x: 0, y: 0 };
    const delta =
      m && st.origin
        ? { x: m.midpoint.x - st.origin.x, y: m.midpoint.y - st.origin.y }
        : { x: 0, y: 0 };

    return {
      playerId: st.playerId,
      kind: this.kind,
      confidence: phase === 'release' || !m ? 0 : pinchConfidence(m.ratio, this.config.exitRatio),
      vector: position,
      tCapture: tNow,
      detail: {
        phase,
        hand: st.handedness,
        ratio: m?.ratio ?? null,
        handScale: m?.handScale ?? null,
        delta,
      },
    };
  }

  reset(playerId?: PlayerId): void {
    if (!playerId) {
      this.state.clear();
      return;
    }
    for (const key of [...this.state.keys()]) {
      if (this.state.get(key)?.playerId === playerId) this.state.delete(key);
    }
  }
}
