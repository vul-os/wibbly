import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as THREE from 'three';
import { createPlayer } from '../src/game/player';
import { createBall, handleBallHit } from '../src/game/ball';
import { createGameState } from '../src/game/game-logic';
import type { GameState } from '../src/game/types';

/**
 * `GestureEvent.confidence` (0..1) is the input contract's explicit
 * reminder that a camera gesture is `InputClass::Attested`, never a clean,
 * certain signal — wibbly-input's own doc comment says games MUST handle
 * low confidence rather than assume one. Tennis used to drop `confidence`
 * on the floor entirely between the gesture callback and `handleBallHit`;
 * every swing, however marginal the detection, produced the exact same
 * full-power hit as a clean one. These cover the fix: a low-confidence
 * swing is scaled down (never off), while every non-gesture caller
 * (spacebar, both AI players in game-logic.js) keeps its old, deterministic
 * full-power behaviour by simply never passing a confidence.
 */
function setup() {
  const scene = new THREE.Scene();
  const player = createPlayer(0, 0, Math.PI / 2, 0.63);
  const ballGroup = createBall(scene);

  // Park the ball exactly on the racket head so every call here is a
  // guaranteed hit, isolating the confidence-power behaviour from the
  // geometric hit-test that gates whether a swing connects at all.
  const racketHead = player.userData.racketGroup.children[0];
  racketHead.updateMatrixWorld(true);
  const worldPos = new THREE.Vector3();
  racketHead.getWorldPosition(worldPos);
  ballGroup.position.copy(worldPos);

  const gameState = createGameState();
  gameState.ballInPlay = true; // bypass the serve branch, exercise the in-play hit branch
  return { player, ballGroup, gameState };
}

function speedOf(gameState: GameState): number {
  return Math.hypot(gameState.ballVelocity.x, gameState.ballVelocity.z);
}

describe('handleBallHit confidence handling', () => {
  beforeEach(() => {
    // baseSpeed/arcHeight both carry +/- randomness; pin it so the power
    // scaling itself — not luck — drives the comparisons below.
    vi.spyOn(Math, 'random').mockReturnValue(0);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('defaults to full power when no confidence is passed (spacebar, both AI players)', () => {
    const full = setup();
    handleBallHit(full.ballGroup, full.gameState, full.player, 0, 'right');

    const explicit = setup();
    handleBallHit(explicit.ballGroup, explicit.gameState, explicit.player, 0, 'right', 1);

    expect(speedOf(full.gameState)).toBeCloseTo(speedOf(explicit.gameState), 10);
  });

  it('scales a marginal gesture down rather than treating it as certain', () => {
    const full = setup();
    handleBallHit(full.ballGroup, full.gameState, full.player, 0, 'right', 1);

    const marginal = setup();
    handleBallHit(marginal.ballGroup, marginal.gameState, marginal.player, 0, 'right', 0.5);

    expect(speedOf(marginal.gameState)).toBeLessThan(speedOf(full.gameState));
    expect(speedOf(marginal.gameState)).toBeGreaterThan(0); // still a real hit, not silently dropped
  });

  it('clamps out-of-range confidence instead of propagating NaN into ball velocity', () => {
    for (const bad of [-5, 2, NaN, Infinity, -Infinity]) {
      const { player, ballGroup, gameState } = setup();
      handleBallHit(ballGroup, gameState, player, 0, 'right', bad);
      expect(Number.isFinite(gameState.ballVelocity.x)).toBe(true);
      expect(Number.isFinite(gameState.ballVelocity.y)).toBe(true);
      expect(Number.isFinite(gameState.ballVelocity.z)).toBe(true);
    }
  });
});
