import { describe, expect, it } from 'vitest';
import {
  DEFAULT_SWING_CONFIG,
  SwingRecognizer,
  detectSwing,
  forehandSign,
  sampleArm,
} from '../src/recognizers/swing';
import { bound, makeSwingPath, personWithWrist } from './fixtures';
import type { BoundPerson } from '../src/types';

describe('forehandSign', () => {
  it('maps right-handed forehand to rightward image motion', () => {
    // Player faces the camera, so their right arm appears on the image left;
    // a right-handed forehand therefore reads left-to-right in the raw frame.
    expect(forehandSign('right')).toBe(1);
  });

  it('mirrors the sign for left-handed players', () => {
    expect(forehandSign('left')).toBe(-1);
  });

  it('inverts again when the source frame is mirrored', () => {
    expect(forehandSign('right', true)).toBe(-1);
    expect(forehandSign('left', true)).toBe(1);
  });
});

describe('detectSwing (pure)', () => {
  const rightward = makeSwingPath({ from: { x: 0.3, y: 0.5 }, to: { x: 0.45, y: 0.44 } });
  const leftward = makeSwingPath({ from: { x: 0.45, y: 0.5 }, to: { x: 0.3, y: 0.44 } });

  it('detects a fast rightward swing', () => {
    const r = detectSwing(rightward, 'right');
    expect(r.isSwing).toBe(true);
    expect(r.direction).toBe('right');
    expect(r.horizontalDistance).toBeCloseTo(0.15, 5);
    expect(r.confidence).toBeGreaterThan(0);
    expect(r.confidence).toBeLessThanOrEqual(1);
  });

  it('detects a fast leftward swing', () => {
    const r = detectSwing(leftward, 'right');
    expect(r.isSwing).toBe(true);
    expect(r.direction).toBe('left');
  });

  it('classifies stroke by handedness, not by a hardcoded hand', () => {
    // Same physical motion, opposite meaning for the two players.
    expect(detectSwing(rightward, 'right').stroke).toBe('forehand');
    expect(detectSwing(rightward, 'left').stroke).toBe('backhand');
    expect(detectSwing(leftward, 'left').stroke).toBe('forehand');
    expect(detectSwing(leftward, 'right').stroke).toBe('backhand');
  });

  it('fires for a LEFT-handed player — the branch that was an empty TODO', () => {
    const r = detectSwing(leftward, 'left');
    expect(r.isSwing).toBe(true);
    expect(r.stroke).toBe('forehand');
  });

  it('rejects insufficient history', () => {
    const r = detectSwing(rightward.slice(0, 2), 'right');
    expect(r.isSwing).toBe(false);
    expect(r.reason).toMatch(/history/i);
  });

  it('rejects small horizontal travel', () => {
    const path = makeSwingPath({ from: { x: 0.4, y: 0.5 }, to: { x: 0.41, y: 0.44 } });
    const r = detectSwing(path, 'right');
    expect(r.isSwing).toBe(false);
    expect(r.reason).toMatch(/horizontal/);
  });

  it('rejects a flat drift with no vertical component', () => {
    const path = makeSwingPath({ from: { x: 0.3, y: 0.5 }, to: { x: 0.45, y: 0.5 } });
    const r = detectSwing(path, 'right');
    expect(r.isSwing).toBe(false);
    expect(r.reason).toMatch(/vertical/);
  });

  it('rejects slow motion that covers the same distance', () => {
    const path = makeSwingPath({
      from: { x: 0.3, y: 0.5 },
      to: { x: 0.45, y: 0.44 },
      dt: 3000,
    });
    const r = detectSwing(path, 'right');
    expect(r.isSwing).toBe(false);
    expect(r.reason).toMatch(/speed/);
  });

  it('rejects non-monotonic timestamps rather than dividing by zero', () => {
    const path = makeSwingPath({ from: { x: 0.3, y: 0.5 }, to: { x: 0.45, y: 0.44 }, dt: 0 });
    const r = detectSwing(path, 'right');
    expect(r.isSwing).toBe(false);
    expect(Number.isFinite(r.speed)).toBe(true);
  });

  it('is resolution-independent: thresholds are fractions of the frame', () => {
    // Identical normalized motion must decide identically regardless of the
    // capture resolution it came from — the point of normalizing in the tracker.
    const r = detectSwing(rightward, 'right');
    expect(r.isSwing).toBe(true);
    expect(DEFAULT_SWING_CONFIG.minHorizontal).toBeLessThan(1);
  });

  it('only inspects the configured window, not the whole history', () => {
    const stale = makeSwingPath({ from: { x: 0.0, y: 0.5 }, to: { x: 0.05, y: 0.5 }, samples: 5, dt: 33 });
    const recent = makeSwingPath({
      from: { x: 0.3, y: 0.5 },
      to: { x: 0.45, y: 0.44 },
      startT: 5000,
    });
    const r = detectSwing([...stale, ...recent], 'right', { ...DEFAULT_SWING_CONFIG, windowSize: 3 });
    expect(r.isSwing).toBe(true);
    expect(r.horizontalDistance).toBeCloseTo(0.15, 5);
  });
});

describe('sampleArm', () => {
  it('selects the arm matching the player handedness', () => {
    const person = bound(
      personWithWrist(0.5, 'left', { x: 0.72, y: 0.55 }),
      'player_1',
    );
    const left = sampleArm(person, 'left', 100);
    const right = sampleArm(person, 'right', 100);
    expect(left?.wristX).toBeCloseTo(0.72, 5);
    expect(right?.wristX).not.toBeCloseTo(0.72, 5);
  });

  it('returns null when the arm is not confidently visible', () => {
    const person = bound(
      personWithWrist(0.5, 'right', { x: 0.3, y: 0.5, score: 0.05 }),
      'player_1',
    );
    expect(sampleArm(person, 'right', 100)).toBeNull();
  });
});

/** Drive the stateful recognizer with a moving wrist, no camera involved. */
function feedPath(
  recognizer: SwingRecognizer,
  playerId: string,
  side: 'left' | 'right',
  from: { x: number; y: number },
  to: { x: number; y: number },
  startT: number,
  samples = 3,
  dt = 33,
) {
  const events = [];
  for (let i = 0; i < samples; i++) {
    const f = samples === 1 ? 0 : i / (samples - 1);
    const person: BoundPerson = bound(
      personWithWrist(0.5, side, {
        x: from.x + (to.x - from.x) * f,
        y: from.y + (to.y - from.y) * f,
      }),
      playerId,
    );
    events.push(...recognizer.feed([person], startT + i * dt));
  }
  return events;
}

describe('SwingRecognizer', () => {
  it('emits a swing GestureEvent with a stable playerId', () => {
    const r = new SwingRecognizer({ handedness: 'right' });
    const events = feedPath(r, 'player_1', 'right', { x: 0.3, y: 0.5 }, { x: 0.45, y: 0.44 }, 1000);
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({ playerId: 'player_1', kind: 'swing' });
    expect(events[0].detail?.direction).toBe('right');
    expect(events[0].detail?.stroke).toBe('forehand');
    expect(events[0].confidence).toBeGreaterThan(0);
  });

  it('reports tCapture, not detection time', () => {
    const r = new SwingRecognizer({ handedness: 'right' });
    const events = feedPath(r, 'player_1', 'right', { x: 0.3, y: 0.5 }, { x: 0.45, y: 0.44 }, 7000);
    expect(events[0].tCapture).toBe(7000 + 2 * 33);
  });

  it('honours the cooldown', () => {
    const r = new SwingRecognizer({ handedness: 'right', cooldownMs: 500 });
    const first = feedPath(r, 'player_1', 'right', { x: 0.3, y: 0.5 }, { x: 0.45, y: 0.44 }, 1000);
    expect(first).toHaveLength(1);
    // Immediately repeat the same motion — inside the refractory window.
    const second = feedPath(r, 'player_1', 'right', { x: 0.3, y: 0.5 }, { x: 0.45, y: 0.44 }, 1100);
    expect(second).toHaveLength(0);
    // Well past the cooldown, it fires again.
    const third = feedPath(r, 'player_1', 'right', { x: 0.3, y: 0.5 }, { x: 0.45, y: 0.44 }, 3000);
    expect(third).toHaveLength(1);
  });

  it('tracks players independently — one player\'s cooldown does not gag another', () => {
    const r = new SwingRecognizer({ handedness: 'right' });
    feedPath(r, 'player_1', 'right', { x: 0.3, y: 0.5 }, { x: 0.45, y: 0.44 }, 1000);
    const other = feedPath(r, 'player_2', 'right', { x: 0.3, y: 0.5 }, { x: 0.45, y: 0.44 }, 1050);
    expect(other).toHaveLength(1);
    expect(other[0].playerId).toBe('player_2');
  });

  it('resolves handedness per player from a resolver function', () => {
    const hands: Record<string, 'left' | 'right'> = { player_1: 'right', player_2: 'left' };
    const r = new SwingRecognizer({ handedness: (id) => hands[id] ?? 'right' });

    // player_2 is left-handed: their swinging arm is the LEFT one, so moving
    // only the right wrist must produce nothing for them.
    const rightArmOnly = feedPath(r, 'player_2', 'right', { x: 0.3, y: 0.5 }, { x: 0.45, y: 0.44 }, 1000);
    expect(rightArmOnly).toHaveLength(0);

    const leftArm = feedPath(r, 'player_2', 'left', { x: 0.7, y: 0.5 }, { x: 0.55, y: 0.44 }, 3000);
    expect(leftArm).toHaveLength(1);
    expect(leftArm[0].detail?.handedness).toBe('left');
    expect(leftArm[0].detail?.stroke).toBe('forehand');
  });

  it('picks up a mid-session handedness change', () => {
    let hand: 'left' | 'right' = 'right';
    const r = new SwingRecognizer({ handedness: () => hand });
    expect(feedPath(r, 'p', 'left', { x: 0.7, y: 0.5 }, { x: 0.55, y: 0.44 }, 1000)).toHaveLength(0);
    hand = 'left';
    expect(feedPath(r, 'p', 'left', { x: 0.7, y: 0.5 }, { x: 0.55, y: 0.44 }, 3000)).toHaveLength(1);
  });

  it('ignores frames where the swinging arm is occluded', () => {
    const r = new SwingRecognizer({ handedness: 'right' });
    const person = bound(
      personWithWrist(0.5, 'right', { x: 0.3, y: 0.5, score: 0.01 }),
      'player_1',
    );
    expect(r.feed([person], 1000)).toHaveLength(0);
    expect(r.historyFor('player_1')).toHaveLength(0);
  });

  it('clears history on reset', () => {
    const r = new SwingRecognizer({ handedness: 'right' });
    feedPath(r, 'player_1', 'right', { x: 0.3, y: 0.5 }, { x: 0.35, y: 0.5 }, 1000);
    expect(r.historyFor('player_1').length).toBeGreaterThan(0);
    r.reset('player_1');
    expect(r.historyFor('player_1')).toHaveLength(0);
  });
});
