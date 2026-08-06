/**
 * Synthetic hand fixtures for this game's gesture tests — normalized [0,1]
 * image-space landmark sets, no camera, no MediaPipe, no DOM. Deliberately a
 * small LOCAL port of the same layout `packages/wibbly-input/test/
 * fixtures.ts` uses (that file lives under a sibling package's own `test/`
 * directory, which is not part of its published surface, so it cannot be
 * imported across the package boundary — see wibbly-input's package.json
 * `"files": ["src"]`). Only what this game's tests actually need.
 */

import { HAND_LANDMARK_NAMES, type Hand, type HandLandmarkName, type Handedness } from '@vulos/wibbly-input/hand';

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
}

export type HandOverrides = Partial<Record<HandLandmarkName, HandOverride>>;

export interface HandOptions {
  cx: number;
  cy?: number;
  scale?: number;
  handedness?: Handedness;
  score?: number;
  landmarkScore?: number;
  overrides?: HandOverrides;
}

/** A plausible open, spread hand centred at (cx, cy) — see HAND_LAYOUT above. */
export function makeHand(opts: HandOptions): Hand {
  const { cx, cy = 0.5, scale = 0.15, handedness = 'right', score = 0.9, landmarkScore = 0.9, overrides = {} } = opts;

  const landmarks = HAND_LANDMARK_NAMES.map((name) => {
    const o = overrides[name];
    if (o) return { name, x: o.x, y: o.y, score: o.score ?? landmarkScore };
    const [dx, dy] = HAND_LAYOUT[name];
    return { name, x: cx + dx * scale, y: cy + dy * scale, score: landmarkScore };
  });

  return { landmarks, handedness, score };
}

/** Thumb tip placed exactly on index tip — fingertips-touching pinch, ratio ~0 at any scale. */
export function pinchOverride(cx: number, cy: number, scale: number): HandOverrides {
  const [dx, dy] = HAND_LAYOUT.index_tip;
  return { thumb_tip: { x: cx + dx * scale, y: cy + dy * scale } };
}

/** Folds one non-thumb finger's tip back onto its own mcp joint — a curled finger. */
export function foldFinger(cx: number, cy: number, scale: number, finger: 'index' | 'middle' | 'ring' | 'pinky'): HandOverrides {
  const mcpName = `${finger}_mcp` as HandLandmarkName;
  const tipName = `${finger}_tip` as HandLandmarkName;
  const [dx, dy] = HAND_LAYOUT[mcpName];
  return { [tipName]: { x: cx + dx * scale, y: cy + dy * scale } };
}

/** A hand posed to satisfy detectPoint: index extended, middle/ring/pinky curled. */
export function makePointingHand(opts: HandOptions): Hand {
  const { cx, cy = 0.5, scale = 0.15 } = opts;
  return makeHand({
    ...opts,
    overrides: {
      ...opts.overrides,
      ...foldFinger(cx, cy, scale, 'middle'),
      ...foldFinger(cx, cy, scale, 'ring'),
      ...foldFinger(cx, cy, scale, 'pinky'),
    },
  });
}

export function boundHand(hand: Hand, playerId: string) {
  return { ...hand, playerId };
}
