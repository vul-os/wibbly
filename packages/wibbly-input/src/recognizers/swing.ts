import {
  keypointMap,
  type BoundPerson,
  type GestureEvent,
  type Handedness,
  type PlayerId,
} from '../types';

/**
 * §3.3 seam — skeletons → game events.
 *
 * Deviation from the spec sketch, deliberate: `feed` takes `BoundPerson[]`, not
 * `Person[]`. A GestureEvent must carry a stable `playerId`, and a raw `Person`
 * has no identity — so the binder (§3.4) necessarily runs before the recognizer.
 */
export interface GestureRecognizer {
  feed(people: BoundPerson[], tNow: number): GestureEvent[];
  reset(playerId?: PlayerId): void;
}

/** One frame of arm state for one player. All coordinates normalized [0,1]. */
export interface WristSample {
  wristX: number;
  wristY: number;
  elbowX: number;
  elbowY: number;
  shoulderX: number;
  shoulderY: number;
  /** Capture timestamp, ms. */
  t: number;
}

export interface SwingConfig {
  /**
   * Minimum horizontal travel, as a fraction of frame width.
   * Default 0.0625 — the original heuristic's 30px at its 480px capture width.
   */
  minHorizontal: number;
  /** Minimum vertical travel, fraction of frame height. Original: 10px of 360. */
  minVertical: number;
  /** Minimum speed in normalized units per millisecond. Original: 0.2px/ms of 480. */
  minSpeed: number;
  /** Samples inspected for the displacement measurement. */
  windowSize: number;
  /** Samples retained per player. */
  historyLength: number;
  /** Minimum samples before a swing can fire. */
  minSamples: number;
  /** Refractory period after a fired swing, ms. */
  cooldownMs: number;
  /** Keypoints below this score are not sampled at all. */
  minKeypointScore: number;
  /**
   * Set true if the frames fed to the tracker were horizontally mirrored
   * (tracker `flipHorizontal`). Flips the image-space sign convention so
   * forehand/backhand classification stays correct.
   */
  mirrored: boolean;
}

export const DEFAULT_SWING_CONFIG: SwingConfig = {
  minHorizontal: 0.0625,
  minVertical: 0.028,
  minSpeed: 0.0004,
  windowSize: 3,
  historyLength: 5,
  minSamples: 3,
  cooldownMs: 500,
  minKeypointScore: 0.3,
  mirrored: false,
};

/** Image-space direction of travel. This is what the tennis game's ball physics consumes. */
export type SwingDirection = 'left' | 'right';
/** Handedness-relative stroke type. This is the meaningful one for gameplay symmetry. */
export type SwingStroke = 'forehand' | 'backhand';

export interface SwingDetection {
  isSwing: boolean;
  /** Horizontal displacement over the window, normalized, signed (+ = rightward in image space). */
  horizontalDistance: number;
  verticalDistance: number;
  /** Normalized units per ms. */
  speed: number;
  direction: SwingDirection;
  stroke: SwingStroke;
  /** 0..1, how far past threshold the motion was. */
  confidence: number;
  reason: string;
}

/**
 * Image-space sign of a forehand for a given handedness.
 *
 * A player faces the camera, so their limbs appear mirrored in the raw image:
 * a right-handed player's right hand is on the LEFT of an unmirrored frame. A
 * right-handed forehand sweeps from the player's right across their body to
 * their left, which in unmirrored image space reads left→right, i.e. dx > 0.
 * A left-handed forehand is the exact mirror: dx < 0.
 *
 * This is the fix for the old `isRightHanded = true` hardcode and its empty
 * left-handed TODO branch — handedness is a sign flip, not a duplicated branch.
 */
export function forehandSign(handedness: Handedness, mirrored = false): 1 | -1 {
  const base = handedness === 'right' ? 1 : -1;
  return (mirrored ? -base : base) as 1 | -1;
}

/**
 * PURE swing detection over a landmark history. No camera, no clock, no DOM,
 * no instance state — this is what makes the heuristic unit-testable, which the
 * original `detectRightHandedSwing()` method was not.
 *
 * Ported from `PoseDetector.detectRightHandedSwing()` with three changes:
 *   - coordinates are normalized, so thresholds are resolution-independent;
 *   - handedness drives forehand/backhand classification instead of being
 *     hardcoded to right;
 *   - a confidence score is produced, because GestureEvent requires one.
 */
export function detectSwing(
  history: readonly WristSample[],
  handedness: Handedness,
  config: SwingConfig = DEFAULT_SWING_CONFIG,
): SwingDetection {
  const idle = (reason: string): SwingDetection => ({
    isSwing: false,
    horizontalDistance: 0,
    verticalDistance: 0,
    speed: 0,
    direction: 'right',
    stroke: 'forehand',
    confidence: 0,
    reason,
  });

  if (history.length < config.minSamples) return idle('Not enough history');

  const window = history.slice(-config.windowSize);
  const oldest = window[0];
  const newest = window[window.length - 1];

  const horizontalDistance = newest.wristX - oldest.wristX;
  const verticalDistance = newest.wristY - oldest.wristY;
  const dt = newest.t - oldest.t;
  if (dt <= 0) return idle('Non-monotonic timestamps');

  const travel = Math.hypot(horizontalDistance, verticalDistance);
  const speed = travel / dt;

  const direction: SwingDirection = horizontalDistance >= 0 ? 'right' : 'left';
  const sign = forehandSign(handedness, config.mirrored);
  const stroke: SwingStroke = Math.sign(horizontalDistance) === sign ? 'forehand' : 'backhand';

  const horizontalOk = Math.abs(horizontalDistance) >= config.minHorizontal;
  const verticalOk = Math.abs(verticalDistance) >= config.minVertical;
  const speedOk = speed >= config.minSpeed;
  const isSwing = horizontalOk && verticalOk && speedOk;

  // Confidence: how far past threshold, worst-of the three gates, capped.
  const ratios = [
    Math.abs(horizontalDistance) / config.minHorizontal,
    Math.abs(verticalDistance) / config.minVertical,
    speed / config.minSpeed,
  ];
  const confidence = isSwing ? Math.min(1, Math.min(...ratios) / 2) : 0;

  return {
    isSwing,
    horizontalDistance,
    verticalDistance,
    speed,
    direction,
    stroke,
    confidence,
    reason: isSwing
      ? `${stroke} swing (${direction})`
      : `Not a swing: ${[
          horizontalOk ? null : 'horizontal',
          verticalOk ? null : 'vertical',
          speedOk ? null : 'speed',
        ]
          .filter(Boolean)
          .join('+')} below threshold`,
  };
}

/**
 * Extract the swinging-arm sample for a player, or null when the arm is not
 * confidently visible.
 */
export function sampleArm(
  person: BoundPerson,
  handedness: Handedness,
  t: number,
  minKeypointScore = DEFAULT_SWING_CONFIG.minKeypointScore,
): WristSample | null {
  const map = keypointMap(person);
  const wrist = map[`${handedness}_wrist`];
  const elbow = map[`${handedness}_elbow`];
  const shoulder = map[`${handedness}_shoulder`];

  if (
    !wrist ||
    !elbow ||
    !shoulder ||
    wrist.score < minKeypointScore ||
    elbow.score < minKeypointScore ||
    shoulder.score < minKeypointScore
  ) {
    return null;
  }

  return {
    wristX: wrist.x,
    wristY: wrist.y,
    elbowX: elbow.x,
    elbowY: elbow.y,
    shoulderX: shoulder.x,
    shoulderY: shoulder.y,
    t,
  };
}

export type HandednessResolver = Handedness | ((playerId: PlayerId) => Handedness);

export interface SwingRecognizerOptions extends Partial<SwingConfig> {
  /**
   * Per-player handedness. Pass a function to read live from Calibration so a
   * player switching hands mid-session takes effect immediately.
   */
  handedness?: HandednessResolver;
}

interface PlayerState {
  history: WristSample[];
  cooldownUntil: number;
}

/** Stateful wrapper: keeps per-player history and cooldown, delegates the decision to `detectSwing`. */
export class SwingRecognizer implements GestureRecognizer {
  readonly kind = 'swing';
  private config: SwingConfig;
  private handedness: HandednessResolver;
  private state = new Map<PlayerId, PlayerState>();

  constructor(options: SwingRecognizerOptions = {}) {
    const { handedness, ...cfg } = options;
    this.config = { ...DEFAULT_SWING_CONFIG, ...cfg };
    this.handedness = handedness ?? 'right';
  }

  handednessFor(playerId: PlayerId): Handedness {
    return typeof this.handedness === 'function' ? this.handedness(playerId) : this.handedness;
  }

  setHandedness(resolver: HandednessResolver): void {
    this.handedness = resolver;
  }

  /** Read-only view of a player's history — useful for drawing a swing trail. */
  historyFor(playerId: PlayerId): readonly WristSample[] {
    return this.state.get(playerId)?.history ?? [];
  }

  feed(people: BoundPerson[], tNow: number): GestureEvent[] {
    const events: GestureEvent[] = [];

    for (const person of people) {
      const hand = this.handednessFor(person.playerId);
      const sample = sampleArm(person, hand, tNow, this.config.minKeypointScore);
      if (!sample) continue;

      let st = this.state.get(person.playerId);
      if (!st) {
        st = { history: [], cooldownUntil: 0 };
        this.state.set(person.playerId, st);
      }

      st.history.push(sample);
      if (st.history.length > this.config.historyLength) st.history.shift();

      if (tNow < st.cooldownUntil) continue;

      const result = detectSwing(st.history, hand, this.config);
      if (!result.isSwing) continue;

      st.cooldownUntil = tNow + this.config.cooldownMs;
      // Clear history so the tail of one swing cannot immediately retrigger.
      st.history = [sample];

      events.push({
        playerId: person.playerId,
        kind: this.kind,
        confidence: result.confidence,
        vector: { x: result.horizontalDistance, y: result.verticalDistance },
        tCapture: sample.t,
        detail: {
          direction: result.direction,
          stroke: result.stroke,
          speed: result.speed,
          handedness: hand,
        },
      });
    }

    return events;
  }

  reset(playerId?: PlayerId): void {
    if (playerId) this.state.delete(playerId);
    else this.state.clear();
  }
}
