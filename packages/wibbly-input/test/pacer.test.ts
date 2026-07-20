import { describe, expect, it } from 'vitest';
import { AdaptivePacer } from '../src/pacer';

describe('AdaptivePacer', () => {
  it('starts optimistic at maxFps before any measurement', () => {
    const p = new AdaptivePacer({ maxFps: 60, minFps: 8 });
    expect(p.inferenceMs).toBeNull();
    expect(p.targetFps).toBeCloseTo(60, 5);
  });

  it('slows down when inference is measured as expensive', () => {
    const p = new AdaptivePacer({ maxFps: 60, minFps: 5, dutyCycle: 0.5, smoothing: 1 });
    p.record(100); // 100ms per inference at 50% duty → 200ms interval → 5fps
    expect(p.intervalMs).toBeCloseTo(200, 5);
    expect(p.targetFps).toBeCloseTo(5, 5);
  });

  it('speeds up when inference is cheap, up to maxFps', () => {
    const p = new AdaptivePacer({ maxFps: 60, minFps: 5, dutyCycle: 0.5, smoothing: 1 });
    p.record(1);
    expect(p.targetFps).toBeCloseTo(60, 5); // clamped, not 500fps
  });

  it('never falls below minFps however slow inference gets', () => {
    const p = new AdaptivePacer({ maxFps: 60, minFps: 8, dutyCycle: 0.5, smoothing: 1 });
    p.record(100000);
    expect(p.targetFps).toBeCloseTo(8, 5);
  });

  it('beats the old fixed policy on a fast machine', () => {
    // The old code capped at 15fps AND processed every 3rd frame → ~5 effective
    // inferences/sec no matter the hardware. MoveNet MultiPose runs ~54fps on a
    // MacBook Pro, i.e. ~18ms/frame.
    const p = new AdaptivePacer({ maxFps: 60, minFps: 8, dutyCycle: 0.5, smoothing: 1 });
    p.record(18);
    expect(p.targetFps).toBeGreaterThan(5);
    expect(p.targetFps).toBeCloseTo(1000 / 36, 5);
  });

  it('smooths noisy measurements rather than chasing each spike', () => {
    const p = new AdaptivePacer({ maxFps: 120, minFps: 1, dutyCycle: 1, smoothing: 0.2 });
    p.record(20);
    const steady = p.inferenceMs!;
    p.record(200); // one-off stall
    expect(p.inferenceMs!).toBeGreaterThan(steady);
    expect(p.inferenceMs!).toBeLessThan(80); // but nowhere near the spike
  });

  it('gates processing by elapsed time', () => {
    const p = new AdaptivePacer({ maxFps: 10, minFps: 1, dutyCycle: 0.5, smoothing: 1 });
    expect(p.shouldProcess(0)).toBe(true);
    p.begin(0);
    p.record(5); // cheap → interval clamps to 100ms (maxFps 10)
    expect(p.shouldProcess(50)).toBe(false);
    expect(p.shouldProcess(100)).toBe(true);
  });

  it('ignores nonsense measurements', () => {
    const p = new AdaptivePacer();
    p.record(NaN);
    p.record(-5);
    p.record(Infinity);
    expect(p.inferenceMs).toBeNull();
    expect(p.sampleCount).toBe(0);
  });

  it('resets to its initial optimistic state', () => {
    const p = new AdaptivePacer({ maxFps: 60 });
    p.record(200);
    p.begin(1000);
    p.reset();
    expect(p.inferenceMs).toBeNull();
    expect(p.targetFps).toBeCloseTo(60, 5);
    expect(p.shouldProcess(0)).toBe(true);
  });
});
