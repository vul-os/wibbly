import { describe, expect, it } from 'vitest';
import { calculateOptimalPosition, type HasXYZPosition, type HasXZPosition } from '../games/tennis/player';
import { createGameState } from '../games/tennis/game-logic';
import type { GameState } from '../games/tennis/types';

// calculateOptimalPosition is the AI's positioning brain: it predicts where the
// ball will be at racket height and returns where that player should stand to
// intercept it. It is pure (no time, no randomness), and it must NEVER put a
// player off-court or onto the opponent's half — player 1 stays left, player 2
// stays right, Z stays in bounds — regardless of how wild the ball state is.
// calculateOptimalPosition only reads .position on the player/ball, so plain
// stubs suffice.
const ball = (x: number, y: number, z: number): HasXYZPosition => ({ position: { x, y, z } });
const player = (x: number, z: number): HasXZPosition => ({ position: { x, z } });

function inPlay(vx: number, vy: number, vz: number): GameState {
  const gs = createGameState();
  gs.ballInPlay = true;
  gs.ballVelocity.set(vx, vy, vz);
  return gs;
}

// A spread of ball states, deliberately including off-court and extreme values.
const BALLS: Array<[number, number, number]> = [
  [0, 2, 0], [10, 5, 3], [-15, 0.2, -8], [8, 10, 7], [-3, 1.3, 0], [0, 0.1, 4.9],
];
const VELS: Array<[number, number, number]> = [
  [0, 0, 0], [-5, 3, 2], [8, -4, -3], [-12, 0, 9], [6, 6, -6], [0, -20, 0],
];

describe('calculateOptimalPosition', () => {
  it('returns the player’s own position when the ball is not in play', () => {
    const gs = createGameState(); // ballInPlay is false by default
    expect(calculateOptimalPosition(player(-5, 1), ball(0, 2, 0), gs, 0)).toEqual({ x: -5, z: 1 });
    expect(calculateOptimalPosition(player(6, -2), ball(0, 2, 0), gs, 1)).toEqual({ x: 6, z: -2 });
  });

  it('keeps player 1 on the left half and in bounds for any ball state', () => {
    const p = player(-6, 0);
    for (const b of BALLS) {
      for (const v of VELS) {
        const pos = calculateOptimalPosition(p, ball(...b), inPlay(...v), 0);
        expect(Number.isFinite(pos.x) && Number.isFinite(pos.z)).toBe(true);
        expect(pos.x).toBeGreaterThanOrEqual(-9);
        expect(pos.x).toBeLessThanOrEqual(-2);
        expect(pos.z).toBeGreaterThanOrEqual(-4.5);
        expect(pos.z).toBeLessThanOrEqual(4.5);
      }
    }
  });

  it('keeps player 2 on the right half and in bounds for any ball state', () => {
    const p = player(6, 0);
    for (const b of BALLS) {
      for (const v of VELS) {
        const pos = calculateOptimalPosition(p, ball(...b), inPlay(...v), 1);
        expect(Number.isFinite(pos.x) && Number.isFinite(pos.z)).toBe(true);
        expect(pos.x).toBeGreaterThanOrEqual(2);
        expect(pos.x).toBeLessThanOrEqual(9);
        expect(pos.z).toBeGreaterThanOrEqual(-4.5);
        expect(pos.z).toBeLessThanOrEqual(4.5);
      }
    }
  });

  it('is pure — identical inputs give identical output', () => {
    const args: [HasXZPosition, HasXYZPosition, GameState, number] = [
      player(-6, 0),
      ball(-2, 2, 1),
      inPlay(-3, -1, 2),
      0,
    ];
    expect(calculateOptimalPosition(...args)).toEqual(calculateOptimalPosition(...args));
  });

  it('tracks a ball moving toward player 1 (target shifts toward the incoming ball)', () => {
    // Ball on P1's side heading further left. The optimal spot should be left of
    // (or at) a spot chosen for a ball sitting still at centre — i.e. it moves to
    // meet the incoming ball, still clamped to the left half.
    const still = calculateOptimalPosition(player(-6, 0), ball(0, 1.3, 0), inPlay(0, 0, 0), 0);
    const incoming = calculateOptimalPosition(player(-6, 0), ball(-2, 2, 0), inPlay(-4, -1, 0), 0);
    expect(incoming.x).toBeLessThanOrEqual(still.x + 1e-9); // not further right than the resting choice
    expect(incoming.x).toBeGreaterThanOrEqual(-9);
  });
});
