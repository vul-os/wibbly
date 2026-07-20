import type { BoundPerson, Landmark, Person } from '../src/types';
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
