/**
 * Core value types shared by every Wibbly seam.
 *
 * COORDINATE CONTRACT (load-bearing — read before implementing a seam):
 *   All landmark coordinates are **normalized to [0, 1]** against the source
 *   frame, origin top-left, x increasing to the right in *image* space
 *   (i.e. NOT mirrored — a mirrored preview is a rendering concern).
 *
 *   Trackers divide by the frame dimensions before returning. Every threshold
 *   downstream is therefore resolution-independent, and recognizers can be
 *   tested against synthetic fixtures with no camera and no frame size.
 */

/** Stable, durable identity for a player across frames. Assigned by a PlayerBinder. */
export type PlayerId = string;

export type Handedness = 'left' | 'right';

/** MoveNet COCO-17 keypoint names. Names are *anatomical*: `right_wrist` is the person's right wrist. */
export type KeypointName =
  | 'nose'
  | 'left_eye'
  | 'right_eye'
  | 'left_ear'
  | 'right_ear'
  | 'left_shoulder'
  | 'right_shoulder'
  | 'left_elbow'
  | 'right_elbow'
  | 'left_wrist'
  | 'right_wrist'
  | 'left_hip'
  | 'right_hip'
  | 'left_knee'
  | 'right_knee'
  | 'left_ankle'
  | 'right_ankle';

export interface Landmark {
  name: string;
  /** Normalized [0,1] horizontal position, image space, left-to-right. */
  x: number;
  /** Normalized [0,1] vertical position, image space, top-to-bottom. */
  y: number;
  /** Detection confidence, 0..1. */
  score: number;
  z?: number;
}

export interface BoundingBox {
  xMin: number;
  yMin: number;
  xMax: number;
  yMax: number;
}

/** One detected skeleton in one frame. Carries NO durable identity — see PlayerBinder. */
export interface Person {
  keypoints: Landmark[];
  /** Whole-pose confidence, 0..1. */
  score: number;
  box?: BoundingBox;
  /**
   * Per-frame tracking hint from the underlying model, when it offers one
   * (MoveNet's `enableTracking`). Advisory only — the PlayerBinder is the
   * authority on identity, because model track ids are not durable across
   * a detection dropout.
   */
  trackId?: number;
}

/** A Person that a PlayerBinder has assigned a durable identity to. */
export interface BoundPerson extends Person {
  playerId: PlayerId;
}

export interface Vector2 {
  x: number;
  y: number;
  z?: number;
}

export interface GestureEvent {
  /** Stable across frames — see PlayerBinder. */
  playerId: PlayerId;
  /** 'swing' | 'punch' | 'pinch' | 'point' | custom. */
  kind: string;
  /** 0..1. Games MUST handle low confidence rather than assuming a clean signal. */
  confidence: number;
  vector?: Vector2;
  /** Capture timestamp of the frame that produced this, NOT the detection timestamp. */
  tCapture: number;
  /** Recognizer-specific payload. */
  detail?: Record<string, unknown>;
}

/** Anything a tracker can consume as a frame. */
export type Frame = HTMLVideoElement | HTMLCanvasElement | ImageBitmap | ImageData;

/** Convenience: index a person's keypoints by name. */
export function keypointMap(person: Person): Record<string, Landmark> {
  const map: Record<string, Landmark> = {};
  for (const kp of person.keypoints) map[kp.name] = kp;
  return map;
}

/** Fetch a keypoint by name, or undefined if absent/below `minScore`. */
export function keypoint(
  person: Person,
  name: string,
  minScore = 0,
): Landmark | undefined {
  const kp = person.keypoints.find((k) => k.name === name);
  return kp && kp.score >= minScore ? kp : undefined;
}

/**
 * Torso-weighted centroid, used for frame-to-frame identity matching.
 *
 * Torso keypoints (shoulders + hips) are preferred because they are the most
 * stable part of a skeleton: limbs swing wildly during gameplay and would make
 * a whole-body centroid jitter enough to break nearest-neighbour matching.
 * Falls back to all confident keypoints, then to the raw box.
 */
export function torsoCentroid(person: Person, minScore = 0.3): Vector2 | null {
  const map = keypointMap(person);
  const torsoNames = ['left_shoulder', 'right_shoulder', 'left_hip', 'right_hip'];
  const torso = torsoNames
    .map((n) => map[n])
    .filter((k): k is Landmark => !!k && k.score >= minScore);

  const pool =
    torso.length >= 2
      ? torso
      : person.keypoints.filter((k) => k.score >= minScore);

  if (pool.length > 0) {
    let sx = 0;
    let sy = 0;
    for (const k of pool) {
      sx += k.x;
      sy += k.y;
    }
    return { x: sx / pool.length, y: sy / pool.length };
  }

  if (person.box) {
    return {
      x: (person.box.xMin + person.box.xMax) / 2,
      y: (person.box.yMin + person.box.yMax) / 2,
    };
  }
  return null;
}

export function distance(a: Vector2, b: Vector2): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}
