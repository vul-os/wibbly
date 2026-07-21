import { describe, expect, it } from 'vitest';
import {
  MODEL_CDN_URL,
  MODEL_VENDORED_PATH,
  MODE_DEMO,
  MODE_FULL,
  OWNED_STORAGE_KEYS,
  assertNoMagnetite,
  clearOwnedStorage,
  resolveMagnetiteConfig,
  resolveMode,
  resolveModelUrl,
} from '../src/mode.js';

/** Minimal localStorage stand-in with the index API clearOwnedStorage walks. */
function fakeStore(initial = {}) {
  const map = new Map(Object.entries(initial));
  return {
    get length() {
      return map.size;
    },
    key: (i) => [...map.keys()][i] ?? null,
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: (k) => map.delete(k),
    _keys: () => [...map.keys()],
  };
}

describe('resolveMode', () => {
  it('defaults to the full app', () => {
    expect(resolveMode({}, null)).toBe(MODE_FULL);
    expect(resolveMode({ VITE_WIBBLY_MODE: '' }, {})).toBe(MODE_FULL);
  });

  it('reads the build-time flag', () => {
    expect(resolveMode({ VITE_WIBBLY_MODE: 'demo' }, null)).toBe(MODE_DEMO);
  });

  it('lets a host page override at runtime, in both directions', () => {
    expect(resolveMode({}, { __WIBBLY_MODE__: 'demo' })).toBe(MODE_DEMO);
    // A demo BUILD can be forced back to full — the override is not one-way.
    expect(resolveMode({ VITE_WIBBLY_MODE: 'demo' }, { __WIBBLY_MODE__: 'full' })).toBe(MODE_FULL);
  });

  it('ignores a junk override rather than guessing', () => {
    expect(resolveMode({ VITE_WIBBLY_MODE: 'demo' }, { __WIBBLY_MODE__: 'nonsense' })).toBe(MODE_DEMO);
  });
});

describe('resolveModelUrl', () => {
  it('prefers the vendored same-origin copy by default', () => {
    const url = resolveModelUrl({}, null, '/', 'https://wibbly.example/');
    expect(url).toBe(`https://wibbly.example/${MODEL_VENDORED_PATH}`);
  });

  it('resolves against the build base, so a sub-path deploy still finds it', () => {
    const url = resolveModelUrl(
      { VITE_WIBBLY_MODE: 'demo' },
      null,
      '/products/magnetite/wibbly/play/',
      'https://vulos.org/products/magnetite/wibbly/play/',
    );
    expect(url).toBe(`https://vulos.org/products/magnetite/wibbly/play/${MODEL_VENDORED_PATH}`);
    expect(url).not.toContain('tfhub.dev');
  });

  it('tolerates a base without a trailing slash', () => {
    const url = resolveModelUrl({}, null, '/products/magnetite/wibbly/play', 'https://vulos.org/');
    expect(url).toBe(`https://vulos.org/products/magnetite/wibbly/play/${MODEL_VENDORED_PATH}`);
  });

  it('allows the CDN as an explicit opt-in for a lean full build', () => {
    expect(resolveModelUrl({ VITE_WIBBLY_MODEL: 'cdn' }, null, '/', 'https://x.example/')).toBe(
      MODEL_CDN_URL,
    );
  });

  it('REFUSES the CDN in demo mode — a demo must be self-contained', () => {
    expect(() =>
      resolveModelUrl({ VITE_WIBBLY_MODE: 'demo', VITE_WIBBLY_MODEL: 'cdn' }, null, '/', 'https://x/'),
    ).toThrow(/self-contained/);

    // Including when the CDN is smuggled in as a literal URL rather than 'cdn'.
    expect(() =>
      resolveModelUrl({ VITE_WIBBLY_MODE: 'demo', VITE_WIBBLY_MODEL: MODEL_CDN_URL }, null, '/', 'https://x/'),
    ).toThrow(/self-contained/);

    // And when a host page tries it at runtime.
    expect(() =>
      resolveModelUrl({ VITE_WIBBLY_MODE: 'demo' }, { __WIBBLY_MODEL_URL__: 'cdn' }, '/', 'https://x/'),
    ).toThrow(/self-contained/);
  });

  it('honours an arbitrary explicit URL', () => {
    expect(resolveModelUrl({ VITE_WIBBLY_MODEL: '/mirror/model.json' }, null, '/', 'https://x.example/')).toBe(
      '/mirror/model.json',
    );
  });
});

describe('magnetite gating', () => {
  const configured = { VITE_MAGNETITE_URL: 'ws://127.0.0.1:9000' };

  it('is off by default in the full app', () => {
    expect(resolveMagnetiteConfig({}, null)).toBeNull();
  });

  it('works in the full app when configured', () => {
    expect(resolveMagnetiteConfig(configured, null)).toEqual({
      url: 'ws://127.0.0.1:9000',
      token: undefined,
    });
  });

  it('is HARD-DISABLED in demo mode, not merely off by default', () => {
    // Build-time config: ignored.
    expect(resolveMagnetiteConfig({ ...configured, VITE_WIBBLY_MODE: 'demo' }, null)).toBeNull();

    // Runtime override from a host page: also ignored. This is the one that
    // matters — the demo is embedded in a page we do not control the source of.
    expect(
      resolveMagnetiteConfig(
        { VITE_WIBBLY_MODE: 'demo' },
        { __WIBBLY_MAGNETITE__: { url: 'wss://evil.example/steal' } },
      ),
    ).toBeNull();

    // Both at once.
    expect(
      resolveMagnetiteConfig(
        { ...configured, VITE_WIBBLY_MODE: 'demo' },
        { __WIBBLY_MAGNETITE__: { url: 'wss://evil.example/steal' } },
      ),
    ).toBeNull();
  });

  it('assertNoMagnetite throws in demo mode and is a no-op otherwise', () => {
    expect(() => assertNoMagnetite(MODE_DEMO)).toThrow(/never be constructed in demo mode/);
    expect(() => assertNoMagnetite(MODE_FULL)).not.toThrow();
  });
});

describe('clearOwnedStorage', () => {
  it('removes every key this app owns', () => {
    const store = fakeStore(Object.fromEntries(OWNED_STORAGE_KEYS.map((k) => [k, '{}'])));
    expect(clearOwnedStorage(store)).toBe(OWNED_STORAGE_KEYS.length);
    expect(store._keys()).toEqual([]);
  });

  it('removes anything else under the wibbly. prefix, including probes', () => {
    const store = fakeStore({ 'wibbly.something.new': 'x', 'wibbly.calibration.v1.probe': '1' });
    clearOwnedStorage(store);
    expect(store._keys()).toEqual([]);
  });

  it('never touches keys belonging to the embedding page', () => {
    const store = fakeStore({
      'wibbly.settings.v1': '{}',
      'vulos.session': 'keep-me',
      theme: 'dark',
    });
    clearOwnedStorage(store);
    expect(store._keys().sort()).toEqual(['theme', 'vulos.session']);
  });

  it('survives storage being absent or blocked', () => {
    expect(clearOwnedStorage(null)).toBe(0);
    const hostile = {
      get length() {
        throw new Error('blocked');
      },
      key: () => null,
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    };
    expect(() => clearOwnedStorage(hostile)).not.toThrow();
  });
});
