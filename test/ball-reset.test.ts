import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { createPlayer } from '../src/game/player';
import { createBall, resetBall } from '../src/game/ball';
import { createGameState } from '../src/game/game-logic';

/**
 * resetBall() ends the current point and returns the game to the
 * waiting-to-serve state. Every per-point flag it clears — the swing
 * cooldowns, the per-approach "last attempted ball" ids, the approach
 * counter, and the ball velocity — exists to stop one point's swing state
 * bleeding into the next: a player who already swung at this approach must be
 * allowed to swing next point, and a stale velocity must not launch the ball
 * before anyone serves. These pin that full reset so a future edit can't drop
 * one field silently.
 */
function setup() {
  const scene = new THREE.Scene();
  const player1 = createPlayer(0, 0, Math.PI / 2, 0.63);
  const player2 = createPlayer(0, 0, -Math.PI / 2, 0.63);
  const ballGroup = createBall(scene);
  const gameState = createGameState();
  return { players: [player1, player2], ballGroup, gameState };
}

describe('resetBall', () => {
  it('returns the game to the waiting-to-serve state with zero velocity', () => {
    const { players, ballGroup, gameState } = setup();
    // Dirty the state as if a point were mid-flight.
    gameState.ballInPlay = true;
    gameState.waitingToServe = false;
    gameState.ballVelocity.set(3, 1, -5);

    resetBall(ballGroup, gameState, players);

    expect(gameState.ballInPlay).toBe(false);
    expect(gameState.waitingToServe).toBe(true);
    expect(gameState.ballVelocity.x).toBe(0);
    expect(gameState.ballVelocity.y).toBe(0);
    expect(gameState.ballVelocity.z).toBe(0);
  });

  it('clears every per-point swing flag so state cannot bleed across points', () => {
    const { players, ballGroup, gameState } = setup();
    // Simulate a played-out point: both players swung at approach #7 and are
    // still inside their post-swing cooldowns.
    gameState.ballApproachId = 7;
    gameState.player1LastAttemptedBall = 7;
    gameState.player2LastAttemptedBall = 7;
    gameState.player1SwingCooldown = 180;
    gameState.player2SwingCooldown = 200;

    resetBall(ballGroup, gameState, players);

    // A fresh approach id (so a new swing is allowed next point) and no stale
    // attempts or lingering cooldowns.
    expect(gameState.ballApproachId).toBe(8);
    expect(gameState.player1LastAttemptedBall).toBe(-1);
    expect(gameState.player2LastAttemptedBall).toBe(-1);
    expect(gameState.player1SwingCooldown).toBe(0);
    expect(gameState.player2SwingCooldown).toBe(0);
  });

  it('advances ballApproachId even from the falsy 0 a fresh game starts at', () => {
    const { players, ballGroup, gameState } = setup();
    // createGameState() starts ballApproachId at 0. resetBall's `|| 0` guard
    // must still advance it (0 -> 1), not treat the falsy 0 as "unset".
    expect(gameState.ballApproachId).toBe(0);
    resetBall(ballGroup, gameState, players);
    expect(gameState.ballApproachId).toBe(1);
  });
});
