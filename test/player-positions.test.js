import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  createGameState,
  createPlayerData,
  updatePlayerPositions,
} from '../src/game/game-logic.js';

// updatePlayerPositions drifts the two AI players to fresh idle spots every
// 5–8 seconds, but ONLY while the ball is out of play and neither player is
// returning to centre — otherwise it would fight the ball-tracking logic. It
// must also keep each player on its own half of the court. This pins that
// contract (it's the last untested game-logic function).
const clockAt = (t) => ({ getElapsedTime: () => t });

afterEach(() => vi.restoreAllMocks());

describe('updatePlayerPositions', () => {
  it('moves both players to fresh idle spots when idle and the interval has elapsed', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0); // gate = 5s; targets land on the range floor
    const gs = createGameState();
    const pd = createPlayerData();
    updatePlayerPositions(gs, pd, clockAt(100)); // timeSinceLastMove = 100 > 5

    expect(pd[0].targetX).toBe(-8);
    expect(pd[0].targetZ).toBe(-2);
    expect(pd[1].targetX).toBe(6);
    expect(pd[1].targetZ).toBe(-2);
    expect(gs.lastMoveTime).toBe(100);
  });

  it('keeps P1 on the left half and P2 on the right half for any random draw', () => {
    const gs = createGameState();
    const pd = createPlayerData();
    for (let i = 0; i < 300; i++) {
      gs.lastMoveTime = 0; // force the gate every iteration
      updatePlayerPositions(gs, pd, clockAt(100));
      expect(pd[0].targetX).toBeGreaterThanOrEqual(-8);
      expect(pd[0].targetX).toBeLessThanOrEqual(-6);
      expect(pd[0].targetZ).toBeGreaterThanOrEqual(-2);
      expect(pd[0].targetZ).toBeLessThanOrEqual(2);
      expect(pd[1].targetX).toBeGreaterThanOrEqual(6);
      expect(pd[1].targetX).toBeLessThanOrEqual(8);
      expect(pd[1].targetZ).toBeGreaterThanOrEqual(-2);
      expect(pd[1].targetZ).toBeLessThanOrEqual(2);
    }
  });

  it('does not move while the ball is in play', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const gs = createGameState();
    gs.ballInPlay = true;
    const pd = createPlayerData();
    updatePlayerPositions(gs, pd, clockAt(100));
    expect(pd[0].targetX).toBe(-6.0); // createPlayerData default, untouched
    expect(pd[1].targetX).toBe(6.5);
    expect(gs.lastMoveTime).toBe(0);
  });

  it('does not move while a player is returning to centre', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const gs = createGameState();
    gs.returnToCenter.player1 = true;
    const pd = createPlayerData();
    updatePlayerPositions(gs, pd, clockAt(100));
    expect(pd[0].targetX).toBe(-6.0);
    expect(gs.lastMoveTime).toBe(0);
  });

  it('does not move before the interval has elapsed', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0); // gate = 5s
    const gs = createGameState();
    gs.lastMoveTime = 98;
    const pd = createPlayerData();
    updatePlayerPositions(gs, pd, clockAt(100)); // timeSinceLastMove = 2 < 5
    expect(pd[0].targetX).toBe(-6.0);
    expect(gs.lastMoveTime).toBe(98);
  });
});
