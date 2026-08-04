import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { createPlayer } from '../src/game/player';
import { createBall, updateBallPhysics } from '../src/game/ball';
import { createGameState } from '../src/game/game-logic';

/**
 * updateBallPhysics is the per-frame integrator for the one game that plays
 * today: gravity, position integration, a ground bounce, and the
 * out-of-bounds check that ends a point. It had no coverage. These pin the
 * numeric contract (a refactor that flips a sign, drops the delta, or changes
 * the restitution will fail here) and the two early-return branches that keep
 * the ball glued to the server before play starts.
 *
 * clock.elapsedTime = 1 keeps the debug-log branch
 * (floor(elapsedTime*10) % 30 === 0) from firing, so these assert pure physics.
 */
const CLOCK = { elapsedTime: 1 };
const G = 9.8;

function setup() {
  const scene = new THREE.Scene();
  const players = [
    createPlayer(0, 0, Math.PI / 2, 0.63),
    createPlayer(0, 0, -Math.PI / 2, 0.63),
  ];
  const ballGroup = createBall(scene);
  const gameState = createGameState();
  return { players, ballGroup, gameState };
}

describe('updateBallPhysics', () => {
  it('leaves a ball that is neither in play nor waiting to serve untouched', () => {
    const { players, ballGroup, gameState } = setup();
    gameState.ballInPlay = false;
    gameState.waitingToServe = false;
    ballGroup.position.set(1, 2, 3);
    gameState.ballVelocity.set(4, 5, 6);

    updateBallPhysics(ballGroup, gameState, 0.1, CLOCK, players);

    expect(ballGroup.position.toArray()).toEqual([1, 2, 3]);
    expect(gameState.ballVelocity.toArray()).toEqual([4, 5, 6]);
  });

  it('holds the ball at the server while waiting, without applying gravity', () => {
    const { players, ballGroup, gameState } = setup();
    gameState.ballInPlay = false;
    gameState.waitingToServe = true;
    gameState.ballVelocity.set(9, 9, 9);

    updateBallPhysics(ballGroup, gameState, 0.1, CLOCK, players);

    // Serve-hold branch returns early: velocity is never integrated.
    expect(gameState.ballVelocity.toArray()).toEqual([9, 9, 9]);
  });

  it('applies gravity and integrates position for an in-play ball', () => {
    const { players, ballGroup, gameState } = setup();
    gameState.ballInPlay = true;
    gameState.waitingToServe = false;
    ballGroup.position.set(0, 5, 0);
    gameState.ballVelocity.set(2, 0, -1);
    const dt = 0.1;

    updateBallPhysics(ballGroup, gameState, dt, CLOCK, players);

    expect(gameState.ballVelocity.y).toBeCloseTo(-G * dt, 6); // -0.98
    expect(ballGroup.position.x).toBeCloseTo(2 * dt, 6); // 0.2
    expect(ballGroup.position.z).toBeCloseTo(-1 * dt, 6); // -0.1
    expect(ballGroup.position.y).toBeCloseTo(5 + -G * dt * dt, 6); // 4.902
  });

  it('bounces off the ground: clamps y to 0.105 and reflects vy at 0.85 restitution', () => {
    const { players, ballGroup, gameState } = setup();
    gameState.ballInPlay = true;
    gameState.waitingToServe = false;
    ballGroup.position.set(0, 0.11, 0); // just above ground, over centre court
    gameState.ballVelocity.set(0, -5, 0);

    updateBallPhysics(ballGroup, gameState, 0.1, CLOCK, players);

    // vy after gravity = -5.98; step drives y below the floor -> clamp + bounce.
    expect(ballGroup.position.y).toBeCloseTo(0.105, 6);
    expect(gameState.ballVelocity.y).toBeCloseTo(5.98 * 0.85, 4); // 5.083
    expect(gameState.ballInPlay).toBe(true); // centre court -> not a scoring bounce
  });

  it('ends the point (resets) when the ball leaves the court sideways', () => {
    const { players, ballGroup, gameState } = setup();
    gameState.ballInPlay = true;
    gameState.waitingToServe = false;
    gameState.ballApproachId = 3;
    ballGroup.position.set(11.9, 8, 0); // high, so the ground branch stays out of it
    gameState.ballVelocity.set(5, 0, 0); // step -> x = 12.4, past the |x|>12 bound

    updateBallPhysics(ballGroup, gameState, 0.1, CLOCK, players);

    expect(gameState.ballInPlay).toBe(false);
    expect(gameState.waitingToServe).toBe(true);
    expect(gameState.ballVelocity.toArray()).toEqual([0, 0, 0]);
    expect(gameState.ballApproachId).toBe(4);
  });
});
