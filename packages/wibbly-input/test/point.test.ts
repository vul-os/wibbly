import { describe, expect, it } from 'vitest';
import {
  DEFAULT_POINT_CONFIG,
  PointRecognizer,
  detectPoint,
  samplePoint,
} from '../src/recognizers/point';
import { boundHand, foldFinger, makeHand, makePointingHand } from './fixtures';
import type { BoundHand } from '../src/types';

describe('samplePoint (pure)', () => {
  it('returns null when the hand is not confidently visible', () => {
    const hand = makeHand({ cx: 0.5, landmarkScore: 0.05 });
    expect(samplePoint(hand)).toBeNull();
  });

  it('returns null when a required landmark is out of frame', () => {
    const hand = makeHand({ cx: 0.5, overrides: { index_tip: { x: 1.6, y: 0.3, score: 0.95 } } });
    expect(samplePoint(hand)).toBeNull();
  });

  it('an open, spread hand has every finger "extended" — not a point pose', () => {
    const hand = makeHand({ cx: 0.5 });
    const sample = samplePoint(hand)!;
    expect(sample).not.toBeNull();
    expect(detectPoint(sample.ratios).isPointing).toBe(false);
    expect(detectPoint(sample.ratios).reason).toMatch(/other fingers/i);
  });

  it('a fist (every finger curled, including index) is not a point pose either', () => {
    const hand = makeHand({
      cx: 0.5,
      overrides: {
        ...foldFinger(0.5, 0.5, 0.15, 'index'),
        ...foldFinger(0.5, 0.5, 0.15, 'middle'),
        ...foldFinger(0.5, 0.5, 0.15, 'ring'),
        ...foldFinger(0.5, 0.5, 0.15, 'pinky'),
      },
    });
    const sample = samplePoint(hand)!;
    expect(detectPoint(sample.ratios).isPointing).toBe(false);
    expect(detectPoint(sample.ratios).reason).toMatch(/index/i);
  });

  it('index extended + others curled IS a point pose', () => {
    const hand = makePointingHand({ cx: 0.5 });
    const sample = samplePoint(hand)!;
    expect(detectPoint(sample.ratios).isPointing).toBe(true);
  });

  it('is rotation-invariant: the SAME pose classifies as pointing whichever way the hand is rotated in frame', () => {
    // Build a pointing hand, then rotate every landmark 90° around the wrist —
    // a y-coordinate-based "is the tip above the pip" heuristic would break
    // here (the finger is now sideways); the distance-ratio one must not.
    const hand = makePointingHand({ cx: 0.5, cy: 0.5 });
    const wrist = hand.landmarks.find((l) => l.name === 'wrist')!;
    const rotated = {
      ...hand,
      landmarks: hand.landmarks.map((l) => {
        const dx = l.x - wrist.x;
        const dy = l.y - wrist.y;
        // 90° rotation: (dx, dy) -> (-dy, dx)
        return { ...l, x: wrist.x + -dy, y: wrist.y + dx };
      }),
    };
    const sample = samplePoint(rotated)!;
    expect(sample).not.toBeNull();
    expect(detectPoint(sample.ratios).isPointing).toBe(true);
  });

  it('produces a unit-length direction vector aimed from index_mcp toward index_tip', () => {
    const hand = makePointingHand({ cx: 0.5 });
    const sample = samplePoint(hand)!;
    const mag = Math.hypot(sample.direction.x, sample.direction.y, sample.direction.z ?? 0);
    expect(mag).toBeCloseTo(1, 5);
    // This fixture's index finger points "up" (negative y) and slightly right.
    expect(sample.direction.y).toBeLessThan(0);
  });
});

function feedPose(
  recognizer: PointRecognizer,
  playerId: string,
  handedness: 'left' | 'right',
  pointing: boolean,
  startT: number,
  frames = 1,
  dt = 33,
) {
  const events = [];
  for (let i = 0; i < frames; i++) {
    const hand: BoundHand = boundHand(
      pointing ? makePointingHand({ cx: 0.5, handedness }) : makeHand({ cx: 0.5, handedness }),
      playerId,
    );
    events.push(...recognizer.feed([hand], startT + i * dt));
  }
  return events;
}

describe('PointRecognizer', () => {
  it('emits point-start after debounce, carrying a ray origin + direction', () => {
    const r = new PointRecognizer({ enterFrames: 2 });
    const events = feedPose(r, 'player_1', 'right', true, 1000, 2);
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({ playerId: 'player_1', kind: 'point' });
    expect(events[0].detail?.phase).toBe('start');
    expect(events[0].vector).toBeDefined();
    expect(events[0].detail?.origin).toBeDefined();
  });

  it('emits point-hold while held, point-end when the finger curls back', () => {
    const r = new PointRecognizer({ enterFrames: 1 });
    const start = feedPose(r, 'player_1', 'right', true, 1000, 1);
    expect(start[0].detail?.phase).toBe('start');

    const hold = feedPose(r, 'player_1', 'right', true, 1100, 2);
    expect(hold.map((e) => e.detail?.phase)).toEqual(['hold', 'hold']);

    const end = feedPose(r, 'player_1', 'right', false, 1300, 1);
    expect(end).toHaveLength(1);
    expect(end[0].detail?.phase).toBe('end');
    expect(end[0].confidence).toBe(0);
  });

  it('does not chatter start/end for a pose right at the curl/extension boundary', () => {
    const r = new PointRecognizer({ enterFrames: 1 });
    expect(
      r.feed([boundHand(makePointingHand({ cx: 0.5 }), 'p1')], 1000),
    ).toHaveLength(1);

    // Fold middle/ring/pinky to a ratio that sits inside the curl hysteresis
    // band (between curlEnterRatio and curlExitRatio) rather than fully open
    // or fully curled — boundary noise, not a real change of pose.
    const bandRatioHand = () => {
      const hand = makeHand({ cx: 0.5 });
      const mid = 0.5 * (DEFAULT_POINT_CONFIG.curlEnterRatio + DEFAULT_POINT_CONFIG.curlExitRatio);
      // Place each non-index tip at `mid` × (its pip's distance from wrist),
      // along the pip's own direction from the wrist — an in-band extension.
      const wrist = hand.landmarks.find((l) => l.name === 'wrist')!;
      const withRatio = (finger: 'middle' | 'ring' | 'pinky') => {
        const pip = hand.landmarks.find((l) => l.name === `${finger}_pip`)!;
        const dx = pip.x - wrist.x;
        const dy = pip.y - wrist.y;
        return { [`${finger}_tip`]: { x: wrist.x + dx * mid, y: wrist.y + dy * mid } };
      };
      return boundHand(
        makeHand({
          cx: 0.5,
          overrides: { ...withRatio('middle'), ...withRatio('ring'), ...withRatio('pinky') },
        }),
        'p1',
      );
    };

    const events = [];
    for (let i = 0; i < 5; i++) events.push(...r.feed([bandRatioHand()], 1100 + i * 33));
    expect(events.every((e) => e.detail?.phase === 'hold')).toBe(true);
    expect(r.isPointing('p1', 'right')).toBe(true);
  });

  it('tolerates a brief occlusion without ending, per maxMissedFrames', () => {
    const r = new PointRecognizer({ enterFrames: 1, maxMissedFrames: 2 });
    r.feed([boundHand(makePointingHand({ cx: 0.5 }), 'p1')], 1000);
    expect(r.isPointing('p1', 'right')).toBe(true);

    expect(r.feed([], 1033)).toHaveLength(0);
    expect(r.feed([], 1066)).toHaveLength(0);
    expect(r.isPointing('p1', 'right')).toBe(true);

    const events = r.feed([], 1100);
    expect(events).toHaveLength(1);
    expect(events[0].detail?.phase).toBe('end');
    expect(r.isPointing('p1', 'right')).toBe(false);
  });

  it('tracks left and right hands of the same player independently', () => {
    const r = new PointRecognizer({ enterFrames: 1 });
    const left = boundHand(makePointingHand({ cx: 0.3, handedness: 'left' }), 'p1');
    const right = boundHand(makeHand({ cx: 0.7, handedness: 'right' }), 'p1'); // open hand, not pointing

    const events = r.feed([left, right], 1000);
    expect(events).toHaveLength(1);
    expect(events[0].detail?.hand).toBe('left');
    expect(r.isPointing('p1', 'left')).toBe(true);
    expect(r.isPointing('p1', 'right')).toBe(false);
  });

  it('reset(playerId) clears only that player\'s state', () => {
    const r = new PointRecognizer({ enterFrames: 1 });
    r.feed([boundHand(makePointingHand({ cx: 0.3 }), 'p1')], 1000);
    r.feed([boundHand(makePointingHand({ cx: 0.7 }), 'p2')], 1000);
    r.reset('p1');
    expect(r.isPointing('p1', 'right')).toBe(false);
    expect(r.isPointing('p2', 'right')).toBe(true);
  });
});
