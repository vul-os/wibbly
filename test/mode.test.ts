import { describe, expect, it } from 'vitest';
import {
  MODEL_CDN_URL,
  MODEL_VENDORED_PATH,
  MODE_DEMO,
  MODE_FULL,
  OWNED_STORAGE_KEYS,
  assertNoPeerSession,
  clearOwnedStorage,
  resolvePeerTransport,
  resolveMode,
  resolveModelUrl,
  type OwnedStorageLike,
} from '../src/mode';

/** Minimal localStorage stand-in with the index API clearOwnedStorage walks. */
function fakeStore(
  initial: Record<string, string> = {},
): OwnedStorageLike & { setItem(key: string, value: unknown): void; _keys(): string[] } {
  const map = new Map<string, string>(Object.entries(initial));
  return {
    get length() {
      return map.size;
    },
    key: (i: number) => [...map.keys()][i] ?? null,
    getItem: (k: string) => (map.has(k) ? map.get(k)! : null),
    setItem: (k: string, v: unknown) => {
      map.set(k, String(v));
    },
    removeItem: (k: string) => {
      map.delete(k);
    },
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

describe('peer transport gating', () => {
  // A stand-in for a real PeerTransport — resolvePeerTransport only ever
  // passes this through unexamined, so any object identity works for
  // asserting it came back (or didn't).
  const fakeTransport = { connect() {}, send: () => true };

  it('is off by default in the full app', () => {
    expect(resolvePeerTransport({}, null)).toBeNull();
    expect(resolvePeerTransport({}, {})).toBeNull();
  });

  it('hands back a runtime-provided transport in the full app', () => {
    expect(resolvePeerTransport({}, { __WIBBLY_PEER_TRANSPORT__: fakeTransport })).toBe(
      fakeTransport,
    );
  });

  it('is HARD-DISABLED in demo mode, not merely off by default', () => {
    // Build-time mode flag: the runtime transport is ignored even though
    // it's present, because demo mode is checked before the transport is
    // ever read.
    expect(
      resolvePeerTransport(
        { VITE_WIBBLY_MODE: 'demo' },
        { __WIBBLY_PEER_TRANSPORT__: fakeTransport },
      ),
    ).toBeNull();

    // Runtime mode override from a host page: same result. This is the one
    // that matters — the demo is embedded in a page we do not control the
    // source of.
    expect(
      resolvePeerTransport(
        {},
        { __WIBBLY_MODE__: 'demo', __WIBBLY_PEER_TRANSPORT__: fakeTransport },
      ),
    ).toBeNull();

    // Both at once.
    expect(
      resolvePeerTransport(
        { VITE_WIBBLY_MODE: 'demo' },
        { __WIBBLY_MODE__: 'demo', __WIBBLY_PEER_TRANSPORT__: fakeTransport },
      ),
    ).toBeNull();
  });

  it('assertNoPeerSession throws in demo mode and is a no-op otherwise', () => {
    expect(() => assertNoPeerSession(MODE_DEMO)).toThrow(/never be constructed in demo mode/);
    expect(() => assertNoPeerSession(MODE_FULL)).not.toThrow();
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
    const hostile: OwnedStorageLike = {
      get length(): number {
        throw new Error('blocked');
      },
      key: () => null,
      getItem: () => null,
      removeItem: () => {},
    };
    expect(() => clearOwnedStorage(hostile)).not.toThrow();
  });
});
