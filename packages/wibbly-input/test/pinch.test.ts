import { describe, expect, it } from 'vitest';
import {
  DEFAULT_PINCH_CONFIG,
  PinchRecognizer,
  measurePinch,
  samplePinch,
} from '../src/recognizers/pinch';
import { boundHand, makeHand, pinchOverride } from './fixtures';
import type { BoundHand } from '../src/types';

describe('samplePinch / measurePinch (pure)', () => {
  it('returns null when the hand is not confidently visible', () => {
    const hand = makeHand({ cx: 0.5, landmarkScore: 0.05 });
    expect(samplePinch(hand)).toBeNull();
  });

  it('returns null when a specific required landmark is low-confidence — not the whole hand', () => {
    const hand = makeHand({
      cx: 0.5,
      overrides: { thumb_tip: { x: 0.5, y: 0.3, score: 0.02 } },
    });
    expect(samplePinch(hand)).toBeNull();
  });

  it('returns null when a required landmark is well outside the frame (partially out of frame)', () => {
    const hand = makeHand({
      cx: 0.5,
      overrides: { index_tip: { x: 1.5, y: 0.3, score: 0.95 } },
    });
    expect(samplePinch(hand)).toBeNull();
  });

  it('an open, spread hand is clearly NOT pinching', () => {
    const hand = makeHand({ cx: 0.5, scale: 0.15 });
    const sample = samplePinch(hand)!;
    expect(sample).not.toBeNull();
    const m = measurePinch(sample);
    expect(m.ratio).toBeGreaterThan(DEFAULT_PINCH_CONFIG.exitRatio);
  });

  it('fingertips touching exactly gives a ratio of zero, regardless of scale', () => {
    const near = makeHand({ cx: 0.5, cy: 0.5, scale: 0.2, overrides: pinchOverride(0.5, 0.5, 0.2) });
    const far = makeHand({ cx: 0.5, cy: 0.5, scale: 0.04, overrides: pinchOverride(0.5, 0.5, 0.04) });

    const mNear = measurePinch(samplePinch(near)!);
    const mFar = measurePinch(samplePinch(far)!);

    expect(mNear.ratio).toBeCloseTo(0, 6);
    expect(mFar.ratio).toBeCloseTo(0, 6);
    // Both raw distances are ALSO exactly zero here (tips coincide exactly) —
    // this fixture isolates "ratio is scale-invariant at zero gap". The
    // "distance from camera" failure mode a naive threshold hits is at a
    // small but NON-zero gap, covered by the next test, where the raw
    // distance genuinely differs between near and far but the ratio does not.
    expect(mNear.distance).toBeCloseTo(0, 6);
    expect(mFar.distance).toBeCloseTo(0, 6);
  });

  it('the SAME physical pinch reads as the same ratio near vs far from the camera', () => {
    // "Physical pinch" here means: thumb tip sits a fixed FRACTION of hand
    // size away from index tip, at two very different hand scales (near vs
    // far from camera). A naive raw-pixel/normalized-distance threshold would
    // treat these as two different gestures; the ratio must not.
    const fractionalGap = (scale: number) => {
      const [ix, iy] = [0.5 + 0.5 * scale, 0.5 - 2.4 * scale]; // index_tip's own layout position
      return { x: ix + 0.1 * scale, y: iy + 0.1 * scale }; // thumb tip offset by a fixed fraction of scale
    };

    const bigScale = 0.2;
    const smallScale = 0.05;
    const bigHand = makeHand({
      cx: 0.5,
      cy: 0.5,
      scale: bigScale,
      overrides: { thumb_tip: { ...fractionalGap(bigScale) } },
    });
    const smallHand = makeHand({
      cx: 0.5,
      cy: 0.5,
      scale: smallScale,
      overrides: { thumb_tip: { ...fractionalGap(smallScale) } },
    });

    const mBig = measurePinch(samplePinch(bigHand)!);
    const mSmall = measurePinch(samplePinch(smallHand)!);

    // The RAW distance is very much NOT the same — this is exactly the naive
    // threshold's failure mode (a fixed pixel/normalized-distance cutoff would
    // call the far hand "pinching" and the near one "not", or vice versa).
    expect(mBig.distance).toBeGreaterThan(mSmall.distance * 2);
    // The RATIO — what this recognizer actually gates on — is scale-invariant.
    expect(mBig.ratio).toBeCloseTo(mSmall.ratio, 5);
  });
});

/** Drive the stateful recognizer with a hand held at a fixed ratio for N frames. */
function feedRatio(
  recognizer: PinchRecognizer,
  playerId: string,
  handedness: 'left' | 'right',
  pinching: boolean,
  startT: number,
  frames = 1,
  dt = 33,
) {
  const events = [];
  for (let i = 0; i < frames; i++) {
    const hand: BoundHand = boundHand(
      makeHand({
        cx: 0.5,
        handedness,
        ...(pinching ? { overrides: pinchOverride(0.5, 0.5, 0.15) } : {}),
      }),
      playerId,
    );
    events.push(...recognizer.feed([hand], startT + i * dt));
  }
  return events;
}

describe('PinchRecognizer', () => {
  it('emits pinch-start after the debounce window, with a stable playerId and kind', () => {
    const r = new PinchRecognizer({ enterFrames: 2 });
    const events = feedRatio(r, 'player_1', 'right', true, 1000, 2);
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({ playerId: 'player_1', kind: 'pinch' });
    expect(events[0].detail?.phase).toBe('start');
    expect(events[0].detail?.hand).toBe('right');
    expect(events[0].confidence).toBeGreaterThan(0);
  });

  it('emits pinch-hold on subsequent held frames, then pinch-release on release', () => {
    const r = new PinchRecognizer({ enterFrames: 1 });
    const start = feedRatio(r, 'player_1', 'right', true, 1000, 1);
    expect(start[0].detail?.phase).toBe('start');

    const hold = feedRatio(r, 'player_1', 'right', true, 1100, 2);
    expect(hold.map((e) => e.detail?.phase)).toEqual(['hold', 'hold']);

    const release = feedRatio(r, 'player_1', 'right', false, 1300, 1);
    expect(release).toHaveLength(1);
    expect(release[0].detail?.phase).toBe('release');
    expect(release[0].confidence).toBe(0);
  });

  it('reports drag delta as the pinch midpoint moves — the pinch-DRAG case', () => {
    const r = new PinchRecognizer({ enterFrames: 1 });
    r.feed(
      [boundHand(makeHand({ cx: 0.4, cy: 0.5, overrides: pinchOverride(0.4, 0.5, 0.15) }), 'p1')],
      1000,
    );
    const held = r.feed(
      [boundHand(makeHand({ cx: 0.6, cy: 0.5, overrides: pinchOverride(0.6, 0.5, 0.15) }), 'p1')],
      1033,
    );
    expect(held).toHaveLength(1);
    const delta = held[0].detail?.delta as { x: number; y: number };
    // The whole hand (and its pinch point) moved +0.2 in x.
    expect(delta.x).toBeCloseTo(0.2, 2);
  });

  it('does not chatter start/release when the ratio hovers in the hysteresis band', () => {
    const r = new PinchRecognizer({ enterFrames: 1, enterRatio: 0.35, exitRatio: 0.5 });
    // Enter cleanly.
    expect(r.feed([boundHand(makeHand({ cx: 0.5, overrides: pinchOverride(0.5, 0.5, 0.15) }), 'p1')], 1000)).toHaveLength(1);

    // Hold the thumb tip at a fixed offset from index tip that lands the
    // ratio inside the 0.35-0.5 band — boundary-hugging noise, not a release.
    const bandOffset = 0.42 * 0.15; // ratio ≈ 0.42 given handScale = scale = 0.15
    const bandHand = () =>
      boundHand(
        makeHand({
          cx: 0.5,
          overrides: { thumb_tip: { x: 0.5 + bandOffset, y: 0.5 - 2.4 * 0.15 } },
        }),
        'p1',
      );
    const events = [];
    for (let i = 0; i < 5; i++) events.push(...r.feed([bandHand()], 1100 + i * 33));
    expect(events.every((e) => e.detail?.phase === 'hold')).toBe(true);
    expect(r.isPinching('p1', 'right')).toBe(true);
  });

  it('tolerates a brief occlusion without releasing, per maxMissedFrames', () => {
    const r = new PinchRecognizer({ enterFrames: 1, maxMissedFrames: 2 });
    r.feed([boundHand(makeHand({ cx: 0.5, overrides: pinchOverride(0.5, 0.5, 0.15) }), 'p1')], 1000);
    expect(r.isPinching('p1', 'right')).toBe(true);

    // Hand vanishes from the tracker's output entirely for 2 frames.
    expect(r.feed([], 1033)).toHaveLength(0);
    expect(r.feed([], 1066)).toHaveLength(0);
    expect(r.isPinching('p1', 'right')).toBe(true); // still within grace

    // A third consecutive miss forces a release.
    const events = r.feed([], 1100);
    expect(events).toHaveLength(1);
    expect(events[0].detail?.phase).toBe('release');
    expect(r.isPinching('p1', 'right')).toBe(false);
  });

  it('tracks left and right hands of the SAME player independently', () => {
    const r = new PinchRecognizer({ enterFrames: 1 });
    const left = boundHand(
      makeHand({ cx: 0.3, handedness: 'left', overrides: pinchOverride(0.3, 0.5, 0.15) }),
      'p1',
    );
    const right = boundHand(makeHand({ cx: 0.7, handedness: 'right' }), 'p1'); // open, not pinching

    const events = r.feed([left, right], 1000);
    expect(events).toHaveLength(1);
    expect(events[0].detail?.hand).toBe('left');
    expect(r.isPinching('p1', 'left')).toBe(true);
    expect(r.isPinching('p1', 'right')).toBe(false);
  });

  it('distinct players do not share pinch state even with the same handedness', () => {
    const r = new PinchRecognizer({ enterFrames: 1 });
    r.feed([boundHand(makeHand({ cx: 0.3, overrides: pinchOverride(0.3, 0.5, 0.15) }), 'p1')], 1000);
    expect(r.isPinching('p1', 'right')).toBe(true);
    expect(r.isPinching('p2', 'right')).toBe(false);
  });

  it('reset(playerId) clears only that player\'s state', () => {
    const r = new PinchRecognizer({ enterFrames: 1 });
    r.feed([boundHand(makeHand({ cx: 0.3, overrides: pinchOverride(0.3, 0.5, 0.15) }), 'p1')], 1000);
    r.feed([boundHand(makeHand({ cx: 0.7, overrides: pinchOverride(0.7, 0.5, 0.15) }), 'p2')], 1000);
    r.reset('p1');
    expect(r.isPinching('p1', 'right')).toBe(false);
    expect(r.isPinching('p2', 'right')).toBe(true);
  });
});
