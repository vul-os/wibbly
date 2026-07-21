import { describe, expect, it } from 'vitest';
import { HysteresisGate, usableLandmark } from '../src/recognizers/hand-recognizer';

describe('usableLandmark', () => {
  it('rejects a missing landmark', () => {
    expect(usableLandmark(undefined, 0.3)).toBe(false);
  });

  it('rejects a low-confidence landmark', () => {
    expect(usableLandmark({ x: 0.5, y: 0.5, score: 0.1 }, 0.3)).toBe(false);
  });

  it('accepts a confident, in-frame landmark', () => {
    expect(usableLandmark({ x: 0.5, y: 0.5, score: 0.9 }, 0.3)).toBe(true);
  });

  it('rejects a confident landmark that is well outside the frame', () => {
    // High score but geometrically nonsense — the "partially out of frame"
    // hard case: MediaPipe extrapolates rather than declining to answer.
    expect(usableLandmark({ x: 1.4, y: 0.5, score: 0.95 }, 0.3)).toBe(false);
    expect(usableLandmark({ x: -0.5, y: 0.5, score: 0.95 }, 0.3)).toBe(false);
  });

  it('tolerates a landmark right at the frame edge, within the margin', () => {
    expect(usableLandmark({ x: 1.02, y: 0.5, score: 0.9 }, 0.3)).toBe(true);
    expect(usableLandmark({ x: -0.02, y: 0.5, score: 0.9 }, 0.3)).toBe(true);
  });
});

describe('HysteresisGate', () => {
  const makeGate = (enterFrames = 1, maxMissedFrames = 2) =>
    new HysteresisGate<number>(
      (v) => v <= 0.35,
      (v) => v >= 0.5,
      enterFrames,
      maxMissedFrames,
    );

  it('stays idle below the enter frame count and reports nothing', () => {
    const gate = makeGate(3);
    expect(gate.feed(0.1)).toBeNull();
    expect(gate.feed(0.1)).toBeNull();
    expect(gate.isActive).toBe(false);
  });

  it('enters after the configured number of consecutive qualifying frames', () => {
    const gate = makeGate(3);
    expect(gate.feed(0.1)).toBeNull();
    expect(gate.feed(0.1)).toBeNull();
    expect(gate.feed(0.1)).toBe('enter');
    expect(gate.isActive).toBe(true);
  });

  it('resets the enter streak on a single disqualifying frame — debounce', () => {
    const gate = makeGate(3);
    gate.feed(0.1);
    gate.feed(0.1);
    gate.feed(0.9); // breaks the streak
    expect(gate.feed(0.1)).toBeNull(); // streak restarts, does not carry over
    expect(gate.feed(0.1)).toBeNull();
    expect(gate.feed(0.1)).toBe('enter');
  });

  it('holds while the value sits in the hysteresis band — the anti-chatter case', () => {
    const gate = makeGate(1);
    expect(gate.feed(0.1)).toBe('enter');
    // A value between the enter and exit thresholds must neither exit nor
    // re-enter (it is already active) — this is exactly the band a naive
    // single-threshold implementation would oscillate inside.
    for (const v of [0.4, 0.42, 0.38, 0.45, 0.4]) {
      expect(gate.feed(v)).toBe('hold');
    }
    expect(gate.isActive).toBe(true);
  });

  it('rapid boundary-hugging noise does not chatter start/exit', () => {
    const gate = makeGate(1);
    gate.feed(0.1); // enter
    const transitions: Array<string | null> = [];
    // Oscillate just inside the band, never crossing either threshold.
    const noisy = [0.36, 0.48, 0.37, 0.49, 0.36, 0.47, 0.4];
    for (const v of noisy) transitions.push(gate.feed(v));
    expect(transitions.every((t) => t === 'hold')).toBe(true);
    expect(gate.isActive).toBe(true);
  });

  it('exits once the value clears the exit threshold', () => {
    const gate = makeGate(1);
    gate.feed(0.1);
    expect(gate.feed(0.6)).toBe('exit');
    expect(gate.isActive).toBe(false);
  });

  it('can immediately re-enter after a clean exit', () => {
    const gate = makeGate(1);
    gate.feed(0.1);
    gate.feed(0.6); // exit
    expect(gate.feed(0.1)).toBe('enter');
  });

  it('tolerates a brief missing-data gap without exiting (occlusion grace)', () => {
    const gate = makeGate(1, 2);
    gate.feed(0.1); // enter
    expect(gate.feedMissing()).toBeNull();
    expect(gate.feedMissing()).toBeNull();
    expect(gate.isActive).toBe(true); // still within maxMissedFrames
  });

  it('force-exits after too many consecutive missing frames', () => {
    const gate = makeGate(1, 2);
    gate.feed(0.1); // enter
    gate.feedMissing();
    gate.feedMissing();
    expect(gate.feedMissing()).toBe('exit');
    expect(gate.isActive).toBe(false);
  });

  it('a real measurement after a partial missing-gap resets the missed counter', () => {
    const gate = makeGate(1, 2);
    gate.feed(0.1); // enter
    gate.feedMissing();
    gate.feed(0.2); // real data again — resets the grace counter
    gate.feedMissing();
    gate.feedMissing();
    // Only 2 consecutive missed since the last real frame — still within grace.
    expect(gate.isActive).toBe(true);
  });

  it('missing frames while idle do not affect the enter streak state machine', () => {
    const gate = makeGate(2);
    expect(gate.feedMissing()).toBeNull();
    expect(gate.isActive).toBe(false);
    // Still requires a fresh streak of 2 real qualifying frames.
    expect(gate.feed(0.1)).toBeNull();
    expect(gate.feed(0.1)).toBe('enter');
  });

  it('reset() clears active/streak/missed state', () => {
    const gate = makeGate(1, 2);
    gate.feed(0.1); // enter
    gate.feedMissing();
    gate.reset();
    expect(gate.isActive).toBe(false);
    // Behaves exactly like a fresh gate afterward.
    expect(gate.feed(0.1)).toBe('enter');
  });
});
