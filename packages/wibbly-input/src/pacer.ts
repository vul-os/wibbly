/**
 * Adaptive frame pacing.
 *
 * Replaces the old fixed policy in `poseDetection.js`, which did two things at
 * once and both by guesswork: a 1000/15ms minimum interval AND `frameCount %
 * 3` skipping. Compounded, that ceiling was ~5 effective inferences/sec
 * regardless of how fast the machine actually was — a MacBook that can run
 * MultiPose at 54fps was throttled to 5.
 *
 * The policy here instead measures how long inference actually takes and
 * spends a bounded share of wall-clock on it, so a fast machine gets a fast
 * game loop and a slow one degrades gracefully instead of queueing frames it
 * cannot finish.
 */
export interface PacerConfig {
  /** Never exceed this rate even if inference is free. */
  maxFps: number;
  /** Never drop below this rate even if inference is slow; the loop stays responsive. */
  minFps: number;
  /**
   * Fraction of wall-clock time inference may occupy. 0.5 means inference gets
   * at most half the time budget, leaving the rest for rendering and physics —
   * this is the knob that stops pose detection starving the game.
   */
  dutyCycle: number;
  /** EWMA smoothing for measured inference time. Higher = more reactive, noisier. */
  smoothing: number;
}

export const DEFAULT_PACER_CONFIG: PacerConfig = {
  maxFps: 60,
  minFps: 8,
  dutyCycle: 0.5,
  smoothing: 0.2,
};

export class AdaptivePacer {
  private cfg: PacerConfig;
  private ewma: number | null = null;
  private lastRunAt = -Infinity;
  private samples = 0;

  constructor(config: Partial<PacerConfig> = {}) {
    this.cfg = { ...DEFAULT_PACER_CONFIG, ...config };
  }

  /** Smoothed inference time in ms, or null before the first measurement. */
  get inferenceMs(): number | null {
    return this.ewma;
  }

  get sampleCount(): number {
    return this.samples;
  }

  /** Current pacing target in frames per second. */
  get targetFps(): number {
    return 1000 / this.intervalMs;
  }

  /** Minimum gap between inferences, ms. */
  get intervalMs(): number {
    const minInterval = 1000 / this.cfg.maxFps;
    const maxInterval = 1000 / this.cfg.minFps;
    // Before we have data, be optimistic: run at maxFps and let measurement
    // pull us back. Starting pessimistic makes a fast machine feel sluggish for
    // the first second, which is exactly when a player forms an impression.
    if (this.ewma === null) return minInterval;
    const needed = this.ewma / Math.max(0.05, Math.min(1, this.cfg.dutyCycle));
    return clamp(needed, minInterval, maxInterval);
  }

  /** True if enough time has elapsed to run inference on this frame. */
  shouldProcess(now: number): boolean {
    return now - this.lastRunAt >= this.intervalMs;
  }

  /** Call immediately before starting inference. */
  begin(now: number): void {
    this.lastRunAt = now;
  }

  /** Call with the measured inference duration in ms. */
  record(durationMs: number): void {
    if (!(durationMs >= 0) || !Number.isFinite(durationMs)) return;
    this.samples += 1;
    this.ewma =
      this.ewma === null
        ? durationMs
        : this.ewma * (1 - this.cfg.smoothing) + durationMs * this.cfg.smoothing;
  }

  reset(): void {
    this.ewma = null;
    this.lastRunAt = -Infinity;
    this.samples = 0;
  }
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}
