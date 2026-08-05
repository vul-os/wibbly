import { HAND_LANDMARK_NAMES, type BoundHand, type BoundPerson, type Hand, type HandLandmarkName, type Handedness, type Landmark, type Person } from '../src/types';
import type { WristSample } from '../src/recognizers/swing';

/**
 * Synthetic skeleton fixtures. Everything here is normalized [0,1] image space
 * so the whole test suite runs with no camera, no DOM and no model.
 */

const KEYPOINT_NAMES = [
  'nose',
  'left_eye',
  'right_eye',
  'left_ear',
  'right_ear',
  'left_shoulder',
  'right_shoulder',
  'left_elbow',
  'right_elbow',
  'left_wrist',
  'right_wrist',
  'left_hip',
  'right_hip',
  'left_knee',
  'right_knee',
  'left_ankle',
  'right_ankle',
] as const;

export interface PersonOptions {
  /** Horizontal centre of the body, normalized. */
  cx: number;
  /** Vertical centre (roughly the torso), normalized. */
  cy?: number;
  /** Body half-width, normalized. */
  scale?: number;
  score?: number;
  keypointScore?: number;
  /** Absolute overrides for specific keypoints. */
  overrides?: Partial<Record<(typeof KEYPOINT_NAMES)[number], { x: number; y: number; score?: number }>>;
}

/** A plausible standing skeleton centred at (cx, cy). */
export function makePerson(opts: PersonOptions): Person {
  const { cx, cy = 0.5, scale = 0.08, score = 0.8, keypointScore = 0.9, overrides = {} } = opts;

  const layout: Record<(typeof KEYPOINT_NAMES)[number], [number, number]> = {
    nose: [0, -2.6],
    left_eye: [0.3, -2.8],
    right_eye: [-0.3, -2.8],
    left_ear: [0.6, -2.7],
    right_ear: [-0.6, -2.7],
    left_shoulder: [1, -1.6],
    right_shoulder: [-1, -1.6],
    left_elbow: [1.5, -0.6],
    right_elbow: [-1.5, -0.6],
    left_wrist: [1.8, 0.2],
    right_wrist: [-1.8, 0.2],
    left_hip: [0.7, 0.6],
    right_hip: [-0.7, 0.6],
    left_knee: [0.7, 2.0],
    right_knee: [-0.7, 2.0],
    left_ankle: [0.7, 3.4],
    right_ankle: [-0.7, 3.4],
  };

  const keypoints: Landmark[] = KEYPOINT_NAMES.map((name) => {
    const o = overrides[name];
    if (o) return { name, x: o.x, y: o.y, score: o.score ?? keypointScore };
    const [dx, dy] = layout[name];
    return { name, x: cx + dx * scale, y: cy + dy * scale, score: keypointScore };
  });

  return { keypoints, score };
}

export function bound(person: Person, playerId: string): BoundPerson {
  return { ...person, playerId };
}

/** A person whose named wrist sits at an explicit position. */
export function personWithWrist(
  cx: number,
  side: 'left' | 'right',
  wrist: { x: number; y: number; score?: number },
  extra: Partial<PersonOptions> = {},
): Person {
  return makePerson({
    cx,
    ...extra,
    overrides: { ...(extra.overrides ?? {}), [`${side}_wrist`]: wrist },
  });
}

export interface SwingPathOptions {
  from: { x: number; y: number };
  to: { x: number; y: number };
  samples?: number;
  startT?: number;
  /** ms between samples. */
  dt?: number;
}

/** A straight-line wrist path, for driving `detectSwing` deterministically. */
export function makeSwingPath(opts: SwingPathOptions): WristSample[] {
  const { from, to, samples = 3, startT = 1000, dt = 33 } = opts;
  const out: WristSample[] = [];
  for (let i = 0; i < samples; i++) {
    const f = samples === 1 ? 0 : i / (samples - 1);
    out.push({
      wristX: from.x + (to.x - from.x) * f,
      wristY: from.y + (to.y - from.y) * f,
      elbowX: from.x + (to.x - from.x) * f - 0.03,
      elbowY: from.y + (to.y - from.y) * f + 0.05,
      shoulderX: 0.5,
      shoulderY: 0.4,
      t: startT + i * dt,
    });
  }
  return out;
}

/* ────────────────────────────────────────────────────────────────────────────
 * Hand fixtures
 *
 * A schematic (not biometric) 21-point open-hand layout, palm toward the
 * camera, fingers up. `middle_mcp` sits at exactly `(0, -1) * scale` from the
 * wrist so `handScale` (wrist→middle_mcp, see pinch.ts) equals `scale`
 * exactly — that is what makes the ratio math below land on round,
 * hand-verified numbers instead of requiring the tests to reverse-engineer
 * whatever a layout produces.
 *
 * The specific offsets were chosen (and hand-checked against
 * DEFAULT_PINCH_CONFIG / DEFAULT_POINT_CONFIG) so that, unmodified, this is
 * an OPEN hand: no two fingertips touch (not pinching) and every finger is
 * extended (not curled — see `foldFinger` below to produce a curled one).
 * ──────────────────────────────────────────────────────────────────────────── */

const HAND_LAYOUT: Record<HandLandmarkName, [number, number]> = {
  wrist: [0, 0],
  thumb_cmc: [0.3, -0.1],
  thumb_mcp: [0.5, -0.25],
  thumb_ip: [0.65, -0.45],
  thumb_tip: [0.75, -0.65],
  index_mcp: [0.35, -1.0],
  index_pip: [0.4, -1.55],
  index_dip: [0.47, -2.0],
  index_tip: [0.5, -2.4],
  middle_mcp: [0, -1.0],
  middle_pip: [0, -1.6],
  middle_dip: [0, -2.0],
  middle_tip: [0, -2.3],
  ring_mcp: [-0.35, -0.95],
  ring_pip: [-0.38, -1.5],
  ring_dip: [-0.4, -1.8],
  ring_tip: [-0.45, -2.2],
  pinky_mcp: [-0.65, -0.85],
  pinky_pip: [-0.68, -1.25],
  pinky_dip: [-0.7, -1.55],
  pinky_tip: [-0.75, -1.85],
};

export interface HandOverride {
  x: number;
  y: number;
  score?: number;
  z?: number;
}

/**
 * Named separately from `HandOptions['overrides']` so the fixture builders
 * below (`pinchOverride`, `foldFinger`) can declare a return type that's
 * always a concrete object — never `| undefined` — which is what they
 * actually return. `HandOptions['overrides']` itself stays optional
 * (indexed access on an optional property includes `undefined`), but under
 * `exactOptionalPropertyTypes` a builder that returns `X | undefined` can't
 * be spread into an `{ overrides: ... }` literal passed to `makeHand`, even
 * when it never actually returns undefined.
 */
export type HandOverrides = Partial<Record<HandLandmarkName, HandOverride>>;

export interface HandOptions {
  /** Wrist x, normalized. */
  cx: number;
  /** Wrist y, normalized. */
  cy?: number;
  /** Hand scale — equals `handScale` (wrist→middle_mcp distance) exactly. */
  scale?: number;
  handedness?: Handedness;
  /** Whole-hand confidence (mirrors MediaPipe's handedness-classifier score). */
  score?: number;
  /** Per-landmark score/visibility for every landmark not explicitly overridden. */
  landmarkScore?: number;
  /** Absolute-position overrides for specific landmarks. */
  overrides?: HandOverrides;
}

/** A plausible open, spread hand centred at (cx, cy). See the module doc above for the geometry. */
export function makeHand(opts: HandOptions): Hand {
  const {
    cx,
    cy = 0.5,
    scale = 0.15,
    handedness = 'right',
    score = 0.9,
    landmarkScore = 0.9,
    overrides = {},
  } = opts;

  const landmarks: Landmark[] = HAND_LANDMARK_NAMES.map((name) => {
    const o = overrides[name];
    if (o) return { name, x: o.x, y: o.y, score: o.score ?? landmarkScore, ...(o.z !== undefined ? { z: o.z } : {}) };
    const [dx, dy] = HAND_LAYOUT[name];
    return { name, x: cx + dx * scale, y: cy + dy * scale, score: landmarkScore };
  });

  return { landmarks, handedness, score };
}

export function boundHand(hand: Hand, playerId: string): BoundHand {
  return { ...hand, playerId };
}

/**
 * Override that places `thumb_tip` exactly on top of `index_tip` — a
 * fingertips-touching pinch, ratio ≈ 0 regardless of `scale` (the whole point
 * of normalizing by hand size: this is a "clearly pinching" fixture at ANY
 * distance from camera).
 */
export function pinchOverride(cx: number, cy: number, scale: number): HandOverrides {
  const [dx, dy] = HAND_LAYOUT.index_tip;
  return { thumb_tip: { x: cx + dx * scale, y: cy + dy * scale } };
}

/**
 * Override that folds one non-thumb finger's tip back onto its own mcp joint
 * — a fully curled finger (ratio well under `curlEnterRatio`). Used to turn
 * the default open-hand fixture into a "pointing fist" for PointRecognizer
 * tests: fold middle+ring+pinky, leave index alone.
 */
export function foldFinger(
  cx: number,
  cy: number,
  scale: number,
  finger: 'thumb' | 'index' | 'middle' | 'ring' | 'pinky',
): HandOverrides {
  const mcpName = `${finger}_mcp` as HandLandmarkName;
  const tipName = `${finger}_tip` as HandLandmarkName;
  const [dx, dy] = HAND_LAYOUT[mcpName];
  return { [tipName]: { x: cx + dx * scale, y: cy + dy * scale } };
}

/** A hand posed to satisfy `detectPoint`: index extended, middle/ring/pinky curled. */
export function makePointingHand(opts: Omit<HandOptions, 'overrides'> = { cx: 0.5 }): Hand {
  const { cx, cy = 0.5, scale = 0.15 } = opts;
  return makeHand({
    ...opts,
    overrides: {
      ...foldFinger(cx, cy, scale, 'middle'),
      ...foldFinger(cx, cy, scale, 'ring'),
      ...foldFinger(cx, cy, scale, 'pinky'),
    },
  });
}
