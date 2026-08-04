import { afterEach, describe, expect, it } from 'vitest';
import {
  DEFAULT_SETTINGS,
  loadSettings,
  recordSetup,
  saveSettings,
  setupState,
  type GameSettings,
  type SettingsStorage,
} from '../src/components/game-settings';

/**
 * `globalThis.localStorage` is typed as a required `Storage` — deliberately
 * NOT intersected with `typeof globalThis` (that would keep the property
 * required, since intersecting a required member with an optional one of the
 * same name stays required) — so the tests below can `delete` it to simulate
 * an environment with no localStorage at all.
 */
interface NullableGlobalStorage {
  localStorage?: Storage;
}

/**
 * A localStorage stand-in with a real Map behind it, so setItem/getItem round
 * trip the way the browser's does. game-settings.js probes with a throwaway
 * key before trusting a store (Safari private mode lets you construct
 * localStorage but throws on the first write), so every fake here needs a
 * working setItem/removeItem even when it is there to make getItem lie.
 *
 * Cast to `Storage` at the call site: this fake deliberately implements only
 * the subset (`SettingsStorage`) game-settings.ts actually reads, not the
 * full `Storage` interface (`length`, `key`, `clear`).
 */
function fakeStorage(): SettingsStorage {
  const map = new Map<string, string>();
  return {
    getItem: (k: string) => (map.has(k) ? map.get(k)! : null),
    setItem: (k: string, v: string) => {
      map.set(k, String(v));
    },
    removeItem: (k: string) => {
      map.delete(k);
    },
  };
}

/** Models both a full quota and Safari private mode: every call throws. */
function blockedStorage(): SettingsStorage {
  return {
    getItem: () => {
      throw new Error('blocked');
    },
    setItem: () => {
      throw new Error('blocked');
    },
    removeItem: () => {
      throw new Error('blocked');
    },
  };
}

describe('game-settings localStorage hardening', () => {
  const hadLocalStorage = 'localStorage' in globalThis;
  const original = globalThis.localStorage;

  afterEach(() => {
    if (hadLocalStorage) globalThis.localStorage = original;
    else delete (globalThis as NullableGlobalStorage).localStorage;
  });

  describe('loadSettings', () => {
    it('returns the defaults when nothing is stored', () => {
      globalThis.localStorage = fakeStorage() as unknown as Storage;
      expect(loadSettings()).toEqual(DEFAULT_SETTINGS);
    });

    it('returns the defaults when localStorage is entirely unavailable', () => {
      delete (globalThis as NullableGlobalStorage).localStorage;
      expect(loadSettings()).toEqual(DEFAULT_SETTINGS);
    });

    it('does not brick the title screen on malformed JSON', () => {
      const store = fakeStorage();
      store.setItem('wibbly.settings.v1', '{not json');
      globalThis.localStorage = store as unknown as Storage;
      expect(loadSettings()).toEqual(DEFAULT_SETTINGS);
    });

    it('does not brick the title screen on a JSON value that is not an object', () => {
      const store = fakeStorage();
      globalThis.localStorage = store as unknown as Storage;

      store.setItem('wibbly.settings.v1', '"just a string"');
      expect(loadSettings()).toEqual(DEFAULT_SETTINGS);

      store.setItem('wibbly.settings.v1', '42');
      expect(loadSettings()).toEqual(DEFAULT_SETTINGS);

      store.setItem('wibbly.settings.v1', 'null');
      expect(loadSettings()).toEqual(DEFAULT_SETTINGS);
    });

    it('drops unknown keys and wrongly-typed keys — schema drift from an older or newer build', () => {
      const store = fakeStorage();
      store.setItem(
        'wibbly.settings.v1',
        JSON.stringify({
          usePoseDetection: 'yes', // wrong type: a string, not a boolean
          debug: true,
          difficulty: 'hard', // a key this build has never written
        }),
      );
      globalThis.localStorage = store as unknown as Storage;
      expect(loadSettings()).toEqual({ usePoseDetection: true, debug: true });
    });

    it('falls back to defaults when storage is blocked entirely (Safari private mode)', () => {
      globalThis.localStorage = blockedStorage() as unknown as Storage;
      expect(loadSettings()).toEqual(DEFAULT_SETTINGS);
    });
  });

  describe('saveSettings', () => {
    it('round-trips through loadSettings', () => {
      globalThis.localStorage = fakeStorage() as unknown as Storage;
      saveSettings({ usePoseDetection: false, debug: true });
      expect(loadSettings()).toEqual({ usePoseDetection: false, debug: true });
    });

    it('only ever writes the keys the game reads, even when handed extra ones', () => {
      const store = fakeStorage();
      globalThis.localStorage = store as unknown as Storage;
      // A deliberately excess-propertied settings object — saveSettings takes
      // GameSettings, but the point of this test is that it drops whatever
      // else a caller (or an old/new build's schema) hands it, so the extra
      // key can only be smuggled in past the type checker with a cast.
      const withExtra = { usePoseDetection: false, debug: true, somethingElse: 'x' };
      saveSettings(withExtra as GameSettings);
      expect(JSON.parse(store.getItem('wibbly.settings.v1')!)).toEqual({
        usePoseDetection: false,
        debug: true,
      });
    });

    it('degrades to in-memory rather than throwing when the quota is exceeded', () => {
      globalThis.localStorage = blockedStorage() as unknown as Storage;
      expect(() => saveSettings({ usePoseDetection: false, debug: true })).not.toThrow();
    });
  });

  describe('setupState / recordSetup', () => {
    it('starts unseen', () => {
      globalThis.localStorage = fakeStorage() as unknown as Storage;
      expect(setupState()).toEqual({ seen: false, outcome: null, at: 0 });
    });

    it('records the outcome and reads it back', () => {
      globalThis.localStorage = fakeStorage() as unknown as Storage;
      recordSetup('camera');
      const state = setupState();
      expect(state.seen).toBe(true);
      expect(state.outcome).toBe('camera');
      expect(typeof state.at).toBe('number');
    });

    it('rejects an outcome value it does not recognise rather than trusting it', () => {
      const store = fakeStorage();
      store.setItem('wibbly.setup.v1', JSON.stringify({ seen: true, outcome: 'nonsense', at: 1 }));
      globalThis.localStorage = store as unknown as Storage;
      expect(setupState().outcome).toBeNull();
    });

    it('does not brick the title screen on malformed JSON', () => {
      const store = fakeStorage();
      store.setItem('wibbly.setup.v1', '{broken');
      globalThis.localStorage = store as unknown as Storage;
      expect(setupState()).toEqual({ seen: false, outcome: null, at: 0 });
    });

    it('recordSetup degrades silently when storage is blocked', () => {
      globalThis.localStorage = blockedStorage() as unknown as Storage;
      expect(() => recordSetup('keyboard')).not.toThrow();
    });
  });
});
