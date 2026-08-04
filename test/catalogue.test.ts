import { describe, expect, it } from 'vitest';
import { GAMES, PLAYABLE_GAMES } from '../src/components/catalogue';

/**
 * title.jsx's fixture strip and its start() guard both collapse `status` to a
 * straight equality against 'playable' (anything else renders and behaves as
 * planned) — so this data is not just documentation, it is what decides
 * whether a card can launch a game. Neither call site re-validates it, so the
 * guarantee has to live here instead.
 */
describe('game catalogue', () => {
  it('gives every game a status the app actually understands', () => {
    for (const game of GAMES) {
      expect(['playable', 'planned']).toContain(game.status);
    }
  });

  it('gives every game a unique id, since title.jsx keys the fixture strip on it', () => {
    const ids = GAMES.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('gives every playable game a route to navigate to', () => {
    for (const game of GAMES) {
      if (game.status === 'playable') expect(typeof game.path).toBe('string');
    }
  });

  it('keeps PLAYABLE_GAMES in sync with the status field', () => {
    expect(PLAYABLE_GAMES).toEqual(GAMES.filter((g) => g.status === 'playable'));
  });
});
