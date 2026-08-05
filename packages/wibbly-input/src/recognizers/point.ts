import { handLandmark, type Hand, type Handedness, type Landmark, type PlayerId, type Vector2 } from '../types';
import type { BoundHand, GestureEvent } from '../types';
import { HysteresisGate, handStateKey, usableLandmark, type HandGestureRecognizer } from './hand-recognizer';

export interface FingerRatios {
  index: number;
  middle: number;
  ring: number;
  pinky: number;
}

export interface PointConfig {
  /** index extension ratio at or above which the index counts as EXTENDED, to (re)enter pointing. */
  indexEnterRatio: number;
  /** index extension ratio at or below which pointing EXITS. < indexEnterRatio — the hysteresis band. */
  indexExitRatio: number;
  /** extension ratio at or below which a non-index finger counts as CURLED (required to ENTER pointing). */
  curlEnterRatio: number;
  /** extension ratio at or above which a non-index finger is un-curled enough to force pointing to EXIT. > curlEnterRatio. */
  curlExitRatio: number;
  /** Consecutive qualifying frames required before the FIRST point-start fires. */
  enterFrames: number;
  /** Frames of missing/unusable hand data tolerated before force-ending an active point. */
  maxMissedFrames: number;
  /** Landmarks below this score, or outside the visible frame, are not sampled at all. */
  minLandmarkScore: number;
}

/**
 * Reasoned defaults, not measured against real MediaPipe output (no
 * camera/GPU available while building this) — expect to tune against real
 * hands. See the module doc below for why the underlying ratio is
 * rotation-invariant, which is the property that matters more than the exact
 * numbers.
 */
export const DEFAULT_POINT_CONFIG: PointConfig = {
  indexEnterRatio: 1.4,
  indexExitRatio: 1.2,
  curlEnterRatio: 1.15,
  curlExitRatio: 1.35,
  enterFrames: 2,
  maxMissedFrames: 4,
  minLandmarkScore: 0.3,
};

/**
 * Point: index extended, other three fingers curled.
 *
 * "Extended" is measured as distance(tip, wrist) / distance(pip, wrist) for
 * each finger, NOT as a y-coordinate comparison ("tip.y < pip.y"). The
 * y-comparison is the obvious naive approach and it is wrong: it silently
 * assumes the pointing finger is roughly vertical in the frame. Rotate the
 * hand sideways (point at something to your left) or point downward, and a
 * y-only test misclassifies a fully extended finger as curled. Distance from
 * the wrist is a scalar that does not care which way the finger is rotated —
 * a straight finger is always further from the wrist than its own pip joint
 * regardless of hand orientation, only its magnitude changes with hand
 * distance from camera, which the ratio (not the raw distance) cancels out —
 * the same normalization principle as PinchRecognizer's handScale.
 */
export function samplePoint(
  hand: Hand,
  minLandmarkScore = DEFAULT_POINT_CONFIG.minLandmarkScore,
): PointSample | null {
  const wrist = handLandmark(hand, 'wrist', 0);
  const indexMcp = handLandmark(hand, 'index_mcp', 0);
  const indexPip = handLandmark(hand, 'index_pip', 0);
  const indexTip = handLandmark(hand, 'index_tip', 0);
  const middlePip = handLandmark(hand, 'middle_pip', 0);
  const middleTip = handLandmark(hand, 'middle_tip', 0);
  const ringPip = handLandmark(hand, 'ring_pip', 0);
  const ringTip = handLandmark(hand, 'ring_tip', 0);
  const pinkyPip = handLandmark(hand, 'pinky_pip', 0);
  const pinkyTip = handLandmark(hand, 'pinky_tip', 0);

  const required = [
    wrist,
    indexMcp,
    indexPip,
    indexTip,
    middlePip,
    middleTip,
    ringPip,
    ringTip,
    pinkyPip,
    pinkyTip,
  ];
  if (!required.every((lm) => usableLandmark(lm, minLandmarkScore))) return null;

  const toWrist = (p: Landmark) => Math.hypot(p.x - wrist!.x, p.y - wrist!.y);
  const extension = (tip: Landmark, pip: Landmark) => {
    const pipDist = toWrist(pip);
    return pipDist > 0 ? toWrist(tip) / pipDist : 0;
  };

  const ratios: FingerRatios = {
    index: extension(indexTip!, indexPip!),
    middle: extension(middleTip!, middlePip!),
    ring: extension(ringTip!, ringPip!),
    pinky: extension(pinkyTip!, pinkyPip!),
  };

  // Aim direction is index_mcp → index_tip, NOT wrist → index_tip: the base
  // of the finger itself is a more stable aiming axis than the wrist, which
  // can rotate relative to the finger during a natural pointing motion.
  const dx = indexTip!.x - indexMcp!.x;
  const dy = indexTip!.y - indexMcp!.y;
  const dz = (indexTip!.z ?? 0) - (indexMcp!.z ?? 0);
  const hasZ = indexTip!.z !== undefined || indexMcp!.z !== undefined;
  const mag = Math.hypot(dx, dy, dz) || 1; // guard a degenerate zero-length finger read

  return {
    ratios,
    origin: {
      x: indexTip!.x,
      y: indexTip!.y,
      ...(indexTip!.z !== undefined ? { z: indexTip!.z } : {}),
    },
    direction: { x: dx / mag, y: dy / mag, ...(hasZ ? { z: dz / mag } : {}) },
  };
}

export interface PointSample {
  ratios: FingerRatios;
  /** Index fingertip position — the ray's origin. */
  origin: Vector2;
  /** Unit vector from index_mcp toward index_tip — the ray's direction. */
  direction: Vector2;
}

export interface PointDetection {
  isPointing: boolean;
  ratios: FingerRatios;
  reason: string;
}

/**
 * Pure, single-frame classification — no hysteresis, no history. Useful on
 * its own (e.g. testing a single still pose) and used by PointRecognizer as
 * the strict "enter" predicate so the two never silently diverge.
 */
export function detectPoint(ratios: FingerRatios, config: PointConfig = DEFAULT_POINT_CONFIG): PointDetection {
  const indexOk = ratios.index >= config.indexEnterRatio;
  const curledOk =
    ratios.middle <= config.curlEnterRatio &&
    ratios.ring <= config.curlEnterRatio &&
    ratios.pinky <= config.curlEnterRatio;

  return {
    isPointing: indexOk && curledOk,
    ratios,
    reason: indexOk && curledOk ? 'pointing' : !indexOk ? 'index not extended' : 'other fingers not curled',
  };
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

/** Worst-of-margins, mirroring detectSwing's confidence shape: 0 at the threshold boundary, 1 well past it. */
function pointConfidence(ratios: FingerRatios, config: PointConfig): number {
  const indexMargin = ratios.index / config.indexEnterRatio;
  const curlMargins = [ratios.middle, ratios.ring, ratios.pinky].map(
    (r) => config.curlEnterRatio / Math.max(r, 0.01),
  );
  return clamp01(Math.min(indexMargin, ...curlMargins));
}

interface PointState {
  playerId: PlayerId;
  handedness: Handedness;
  gate: HysteresisGate<FingerRatios>;
}

export type PointRecognizerOptions = Partial<PointConfig>;

/**
 * Stateful wrapper: one HysteresisGate per (player, hand) — see the identical
 * limitation note on PinchRecognizer regarding multi-person hand identity.
 * Emits 'point-start' / 'point-hold' / 'point-end' as `detail.phase` on a
 * single `kind: 'point'`. `vector` carries the aim DIRECTION (a unit vector),
 * not a displacement like SwingRecognizer's — `detail.origin` carries the ray
 * origin (fingertip position) so a game can hit-test `origin + t*direction`
 * against its own scene.
 */
export class PointRecognizer implements HandGestureRecognizer {
  readonly kind = 'point';
  private config: PointConfig;
  private state = new Map<string, PointState>();

  constructor(options: PointRecognizerOptions = {}) {
    this.config = { ...DEFAULT_POINT_CONFIG, ...options };
  }

  isPointing(playerId: PlayerId, handedness: Handedness): boolean {
    return this.state.get(handStateKey(playerId, handedness))?.gate.isActive ?? false;
  }

  feed(hands: BoundHand[], tNow: number): GestureEvent[] {
    const events: GestureEvent[] = [];
    const seen = new Set<string>();

    for (const hand of hands) {
      const key = handStateKey(hand.playerId, hand.handedness);
      seen.add(key);
      const st = this.stateFor(key, hand.playerId, hand.handedness);

      const sample = samplePoint(hand, this.config.minLandmarkScore);
      if (!sample) {
        if (st.gate.feedMissing() === 'exit') events.push(this.emit('end', st, null, tNow));
        continue;
      }

      const transition = st.gate.feed(sample.ratios);
      if (transition === 'enter') events.push(this.emit('start', st, sample, tNow));
      else if (transition === 'hold') events.push(this.emit('hold', st, sample, tNow));
      else if (transition === 'exit') events.push(this.emit('end', st, sample, tNow));
    }

    for (const st of this.state.values()) {
      const key = handStateKey(st.playerId, st.handedness);
      if (seen.has(key)) continue;
      if (st.gate.feedMissing() === 'exit') events.push(this.emit('end', st, null, tNow));
    }

    return events;
  }

  private stateFor(key: string, playerId: PlayerId, handedness: Handedness): PointState {
    let st = this.state.get(key);
    if (!st) {
      st = {
        playerId,
        handedness,
        gate: new HysteresisGate<FingerRatios>(
          (r) => detectPoint(r, this.config).isPointing,
          (r) =>
            r.index <= this.config.indexExitRatio ||
            r.middle >= this.config.curlExitRatio ||
            r.ring >= this.config.curlExitRatio ||
            r.pinky >= this.config.curlExitRatio,
          this.config.enterFrames,
          this.config.maxMissedFrames,
        ),
      };
      this.state.set(key, st);
    }
    return st;
  }

  private emit(
    phase: 'start' | 'hold' | 'end',
    st: PointState,
    sample: PointSample | null,
    tNow: number,
  ): GestureEvent {
    return {
      playerId: st.playerId,
      kind: this.kind,
      // 'end' fires on whatever frame FAILED the exit predicate — that frame
      // still has a valid sample, but it is by definition no longer a
      // qualifying point pose, so its ratios must not be reported as if the
      // gesture were still confidently active. Mirrors PinchRecognizer
      // forcing confidence 0 on 'release' for the same reason.
      confidence: sample && phase !== 'end' ? pointConfidence(sample.ratios, this.config) : 0,
      vector: sample?.direction ?? { x: 0, y: 0 },
      tCapture: tNow,
      detail: {
        phase,
        hand: st.handedness,
        origin: sample?.origin ?? null,
        ratios: sample?.ratios ?? null,
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
