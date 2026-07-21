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

/**
 * MediaPipe HandLandmarker's 21-point topology, in the model's own index order
 * (0=wrist .. 20=pinky_tip). Names are lowercase-joint form rather than the
 * model's SHOUTING_CASE (`INDEX_FINGER_TIP`) to match the rest of this file's
 * naming (`KeypointName`), and shortened (`index_tip` not
 * `index_finger_tip`) since within a hand "index" is unambiguous.
 */
export type HandLandmarkName =
  | 'wrist'
  | 'thumb_cmc'
  | 'thumb_mcp'
  | 'thumb_ip'
  | 'thumb_tip'
  | 'index_mcp'
  | 'index_pip'
  | 'index_dip'
  | 'index_tip'
  | 'middle_mcp'
  | 'middle_pip'
  | 'middle_dip'
  | 'middle_tip'
  | 'ring_mcp'
  | 'ring_pip'
  | 'ring_dip'
  | 'ring_tip'
  | 'pinky_mcp'
  | 'pinky_pip'
  | 'pinky_dip'
  | 'pinky_tip';

/** Index-aligned with the model's own landmark order — see HandTracker.normalizeHands. */
export const HAND_LANDMARK_NAMES: readonly HandLandmarkName[] = [
  'wrist',
  'thumb_cmc',
  'thumb_mcp',
  'thumb_ip',
  'thumb_tip',
  'index_mcp',
  'index_pip',
  'index_dip',
  'index_tip',
  'middle_mcp',
  'middle_pip',
  'middle_dip',
  'middle_tip',
  'ring_mcp',
  'ring_pip',
  'ring_dip',
  'ring_tip',
  'pinky_mcp',
  'pinky_pip',
  'pinky_dip',
  'pinky_tip',
];

/**
 * One detected hand in one frame. Carries NO durable identity — same
 * no-durable-identity contract as `Person`; see `BoundHand`.
 *
 * Coordinates follow the same contract as body `Landmark`s: normalized [0,1],
 * image space, NOT mirrored. Unlike MoveNet, MediaPipe's `NormalizedLandmark`
 * is already normalized by the SDK itself (no pixel-dividing step is needed
 * here) — see `normalizeHands` in hand-tracker.ts. One real behavioural
 * difference from body landmarks: MediaPipe will happily return x/y OUTSIDE
 * [0,1] for a hand that is only partially in frame (it extrapolates the
 * occluded joints from the visible ones rather than refusing to answer). Use
 * `landmarkInFrame` to detect this rather than trusting `score` alone — see
 * its doc comment for why.
 */
export interface Hand {
  /** Always length 21, index-aligned with HAND_LANDMARK_NAMES. */
  landmarks: Landmark[];
  handedness: Handedness;
  /**
   * Whole-hand confidence, 0..1 — MediaPipe's handedness-classifier score,
   * which is downstream of hand detection so a low score also means "this
   * might not really be a hand." There is no separate per-hand detection
   * score in the Tasks API to prefer over it.
   */
  score: number;
}

/** A Hand that some binder has assigned a durable identity to. */
export interface BoundHand extends Hand {
  playerId: PlayerId;
}

/** Convenience: index a hand's landmarks by name. Mirrors `keypointMap`. */
export function handLandmarkMap(hand: Hand): Record<string, Landmark> {
  const map: Record<string, Landmark> = {};
  for (const lm of hand.landmarks) map[lm.name] = lm;
  return map;
}

/** Fetch a hand landmark by name, or undefined if absent/below `minScore`. Mirrors `keypoint`. */
export function handLandmark(
  hand: Hand,
  name: HandLandmarkName,
  minScore = 0,
): Landmark | undefined {
  const lm = hand.landmarks.find((k) => k.name === name);
  return lm && lm.score >= minScore ? lm : undefined;
}

/**
 * True if a landmark is plausibly still IN the visible frame.
 *
 * Why this exists rather than trusting `score`/`visibility` alone: MediaPipe's
 * hand model extrapolates joints for a partially-occluded or partially-off-
 * screen hand instead of declining to answer, and in practice does not always
 * mark the extrapolated points with a depressed `visibility` — a hand with its
 * wrist just past the frame edge can come back with in-range confidence
 * scores on every landmark, INCLUDING ones that are geometrically nonsense
 * (x well outside [0,1]). A small margin is allowed rather than a hard [0,1]
 * clip, because a landmark sitting exactly at the frame edge is legitimate and
 * common (that's the whole point of "partially out of frame" being a
 * near-boundary case, not a far-outside one).
 */
export function landmarkInFrame(lm: { x: number; y: number }, margin = 0.05): boolean {
  return lm.x >= -margin && lm.x <= 1 + margin && lm.y >= -margin && lm.y <= 1 + margin;
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
