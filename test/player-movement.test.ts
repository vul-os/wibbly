import { describe, expect, it } from 'vitest';
import { createPlayer, updatePlayerMovement } from '../src/game/player';
import type { PlayerData } from '../src/game/types';

/**
 * Regression coverage for the frame-rate-dependence bug in
 * updatePlayerMovement: `frameRateMultiplier` used to be `60 * delta`, which
 * goes above 1 (and starts boosting speed) the instant a frame takes longer
 * than 1/60s — i.e. below 60 FPS, not below the 20 FPS the surrounding
 * comments always described. At an ordinary 30 FPS that put the multiplier
 * at 2, so a player covered roughly twice the real-world distance per
 * second than they did at 60 FPS. The fix scales by `delta / effectiveDelta`
 * (the ratio of real time to the clamped integration step), which is 1 for
 * any frame rate at or above the 20 FPS floor and only grows below it.
 *
 * These are plain THREE.Group/Mesh objects with no renderer involved, so
 * they run fine under vitest's node environment.
 */
function runFor(fps: number, seconds: number, isLeftSide = true): number {
  const player = createPlayer(0, 0, Math.PI / 2, 1);
  // Deliberately partial — this test only exercises position integration, so
  // only the fields updatePlayerMovement actually reads on this path are set;
  // the rest of PlayerData's shape is left to its real callers.
  const data = { targetX: 100, targetZ: 0, isLeftSide } as PlayerData;
  const delta = 1 / fps;
  const steps = Math.round(seconds * fps);
  for (let i = 0; i < steps; i++) updatePlayerMovement(player, data, delta);
  return player.position.x;
}

describe('updatePlayerMovement frame-rate independence', () => {
  it('covers essentially the same real-world distance per second at 15-60 FPS', () => {
    const baseline = runFor(60, 2);
    // A real span of frame rates a player might actually see, all at or
    // above the 20 FPS floor where the compensation should be a no-op.
    for (const fps of [45, 30, 24, 20]) {
      const distance = runFor(fps, 2);
      // Generous +-12% band for discretization/easing differences between
      // step sizes — not a loose enough band to let a ~2x regression (the
      // pre-fix bug at 30 FPS) slip through unnoticed.
      expect(distance).toBeGreaterThan(baseline * 0.88);
      expect(distance).toBeLessThan(baseline * 1.12);
    }
  });

  it('still compensates once frame rate actually drops below the 20 FPS floor', () => {
    // Below 20 FPS the effectiveDelta clamp really does engage, so a small
    // amount of catch-up is correct and expected — this just checks it
    // doesn't blow up or reverse direction.
    const baseline = runFor(60, 2);
    const stutter = runFor(10, 2);
    expect(stutter).toBeGreaterThan(0);
    expect(stutter).toBeLessThan(baseline * 1.3);
  });

  it('applies the same fix to the AI opponent (player 2) speed tier', () => {
    const baseline = runFor(60, 2, false);
    const at30fps = runFor(30, 2, false);
    expect(at30fps).toBeGreaterThan(baseline * 0.88);
    expect(at30fps).toBeLessThan(baseline * 1.12);
  });
});
