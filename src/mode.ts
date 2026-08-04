/**
 * Run mode — 'full' or 'demo'.
 *
 * The demo build is the one embedded at `vulos.org/projects/wibbly/play/`
 * inside a same-origin iframe on the marketing site. That surface imposes
 * constraints the normal app does not have, and every one of them is enforced
 * here rather than being left to the discipline of whoever edits a page next:
 *
 *   STRICT CSP     the host page is served under `default-src 'self'`, so any
 *                  external fetch fails outright. The pose model must come
 *                  from this origin, and a peer-to-peer `RTCDataChannel` —
 *                  which would mean this embed silently becoming somebody's
 *                  multiplayer session — cannot open.
 *   IFRAME         no fullscreen, no window.top, no navigation that would
 *                  break the visitor out of the embedding page.
 *   PUBLIC/SHARED  a stranger's calibration must not be waiting for the next
 *                  visitor, so demo mode writes nothing durable.
 *
 * Resolution follows the same shape `resolvePeerTransport()` uses: a runtime
 * override on `window` (so a host page can hand in a single already-negotiated
 * connection without a rebuild) — see that function for why there is no
 * build-time env var counterpart here the way there is for mode/model.
 *
 * Everything below is a pure function of its arguments so it can be tested
 * without a browser — see test/mode.test.js.
 */

export const MODE_FULL = 'full';
export const MODE_DEMO = 'demo';

export type WibblyMode = typeof MODE_FULL | typeof MODE_DEMO;

/** The upstream model host. Named once, refused in demo mode. */
export const MODEL_CDN_URL = 'https://tfhub.dev/google/tfjs-model/movenet/multipose/lightning/1';

/** Path of the vendored copy, relative to the build's base URL. */
export const MODEL_VENDORED_PATH = 'models/movenet-multipose-lightning/model.json';

/** An `import.meta.env`-shaped object — only the keys this module reads. */
export interface WibblyEnv {
  VITE_WIBBLY_MODE?: string;
  VITE_WIBBLY_MODEL?: string;
  BASE_URL?: string;
  [key: string]: unknown;
}

/** A `window`-shaped object — only the runtime overrides this module reads. */
export interface WibblyWindow {
  __WIBBLY_MODE__?: string;
  __WIBBLY_MODEL_URL__?: string;
  __WIBBLY_PEER_TRANSPORT__?: unknown;
  // Index signature: a real `window` (and a test's plain `{}`/`{ ... }` stand-in)
  // legitimately carries many other globals this module never reads. Without
  // this, TypeScript's "weak type" detection (every property above is
  // optional) rejects otherwise-valid callers that share none of these three
  // exact keys.
  [key: string]: unknown;
}

/* ── Mode ─────────────────────────────────────────────────────────────────── */

/**
 * @param env  an import.meta.env-shaped object
 * @param win  a window-shaped object, or null outside a browser
 */
export function resolveMode(env: WibblyEnv = {}, win: WibblyWindow | null = null): WibblyMode {
  const runtime = win?.__WIBBLY_MODE__;
  if (runtime === MODE_DEMO || runtime === MODE_FULL) return runtime;
  return env?.VITE_WIBBLY_MODE === MODE_DEMO ? MODE_DEMO : MODE_FULL;
}

/** Live mode for the running app. */
export function currentMode(): WibblyMode {
  return resolveMode(
    (typeof import.meta !== 'undefined' ? import.meta.env : {}) as WibblyEnv,
    // `window` shares none of WibblyWindow's (all-optional) properties by its
    // own DOM typing, which trips TypeScript's "weak type" detection — hence
    // the cast, not a structural gap in the real object.
    (typeof window !== 'undefined' ? window : null) as WibblyWindow | null,
  );
}

export function isDemo(): boolean {
  return currentMode() === MODE_DEMO;
}

/* ── Model source ─────────────────────────────────────────────────────────── */

/**
 * Where the pose model loads from.
 *
 * The vendored same-origin copy is the DEFAULT, in both modes — that is the
 * whole point of checking the weights in. `VITE_WIBBLY_MODEL=cdn` opts back
 * out for anyone who wants a lean build without ~9.3 MiB of weights in their
 * tree, and `window.__WIBBLY_MODEL_URL__` overrides at runtime.
 *
 * In demo mode the CDN is REFUSED rather than warned about. A demo whose
 * detector silently never initialises because a CSP blocked tfhub.dev is worse
 * than a build that fails loudly at the moment somebody misconfigures it.
 *
 * @param env      import.meta.env-shaped
 * @param win      window-shaped, or null
 * @param baseUrl  the build's base path, e.g. '/' or '/projects/wibbly/play/'
 * @param href     the document URL to resolve relative paths against
 */
export function resolveModelUrl(
  env: WibblyEnv = {},
  win: WibblyWindow | null = null,
  baseUrl = '/',
  href: string | null = null,
): string {
  const mode = resolveMode(env, win);
  const runtime = win?.__WIBBLY_MODEL_URL__;
  const configured = typeof runtime === 'string' && runtime ? runtime : env?.VITE_WIBBLY_MODEL;

  if (configured === 'cdn' || configured === MODEL_CDN_URL) {
    if (mode === MODE_DEMO) {
      throw new Error(
        'wibbly: the demo build must be self-contained, so the TF Hub model CDN is refused. ' +
          'The demo is embedded under a `default-src \'self\'` CSP where that fetch cannot ' +
          'succeed anyway. Drop VITE_WIBBLY_MODEL=cdn, or build the full app instead.',
      );
    }
    return MODEL_CDN_URL;
  }

  // An explicit URL that is neither 'cdn' nor 'local' is honoured as-is.
  if (typeof configured === 'string' && configured && configured !== 'local') {
    return configured;
  }

  const rel = `${baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`}${MODEL_VENDORED_PATH}`;
  if (!href) return rel;
  try {
    return new URL(rel, href).href;
  } catch {
    return rel;
  }
}

/** Live model URL for the running app. */
export function modelUrl(): string {
  const env = (typeof import.meta !== 'undefined' ? import.meta.env : {}) as WibblyEnv;
  return resolveModelUrl(
    env,
    (typeof window !== 'undefined' ? window : null) as WibblyWindow | null,
    env?.BASE_URL || '/',
    typeof location !== 'undefined' ? location.href : null,
  );
}

/* ── Static assets ────────────────────────────────────────────────────────── */

/**
 * Resolve a path under `public/` against the build's base.
 *
 * Hardcoded absolute paths like `/models/court.glb` work at the root and break
 * the moment the app is served from `/projects/wibbly/play/` — the request
 * goes to the site root, 404s, and the game silently falls back to its
 * placeholder geometry. That is exactly the class of bug a sub-path deploy
 * introduces, so asset paths go through here.
 *
 * @param rel      path relative to public/, with no leading slash
 * @param baseUrl  the build's base path
 * @param href     document URL to resolve against
 */
export function resolveAssetUrl(rel: string, baseUrl = '/', href: string | null = null): string {
  const clean = rel.replace(/^\/+/, '');
  const path = `${baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`}${clean}`;
  if (!href) return path;
  try {
    return new URL(path, href).href;
  } catch {
    return path;
  }
}

/** Live asset URL for the running app. */
export function assetUrl(rel: string): string {
  const env = (typeof import.meta !== 'undefined' ? import.meta.env : {}) as WibblyEnv;
  return resolveAssetUrl(
    rel,
    env?.BASE_URL || '/',
    typeof location !== 'undefined' ? location.href : null,
  );
}

/* ── peer session (multiplayer) ──────────────────────────────────────────── */

/**
 * Optional peer-to-peer transport for wibbly's host-authority multiplayer.
 * **OFF unless a host page hands one in, and IMPOSSIBLE in demo mode.**
 *
 * This used to be a build-time `VITE_MAGNETITE_URL` a client could dial —
 * that whole shape is gone along with the WebSocket client it configured.
 * wibbly's multiplayer is peer-to-peer now (`@vulos/wibbly-p2p`'s
 * `PeerSession` over an `RTCDataChannel`; see site/docs/MULTIPLAYER.md), and
 * a `PeerTransport` only exists *after* two browsers have already exchanged
 * an offer/answer out of band — a link, a QR code, a future lobby screen.
 * None of that signalling lives in this file or in the game itself, so there
 * is nothing here to point a build-time env var at. The only way in is a
 * runtime handoff: `window.__WIBBLY_PEER_TRANSPORT__`, set by whatever
 * negotiated that connection before the game mounted.
 *
 * Demo mode returns null unconditionally, BEFORE reading the runtime global.
 * This is not a default that a stray global can flip: the demo is embedded
 * on a page under `default-src 'self'`, and turning a marketing embed into
 * somebody's ad-hoc multiplayer signalling target is exactly the kind of
 * thing that CSP boundary exists to keep out — the demo's own pitch is a
 * self-contained, backend-free experience. `assertNoPeerSession()` below
 * turns that into an assertion, and test/mode.test.js holds it.
 *
 * ── What crosses the wire in the full app, honestly ─────────────────────────
 * GestureEvents, never video — camera frames still never leave the device.
 * But those events are CLIENT-ATTESTED: `InputClass::Attested`, explicitly
 * *not* replay-verifiable, host-in-browser authority or not. Whoever holds
 * authority rate-limits and plausibility-checks inbound events (see
 * wibbly-p2p's `InboundGate`) but nothing proves a `GestureEvent` came
 * from a real arm in front of a real camera — see site/docs/MULTIPLAYER.md.
 * There is deliberately no per-event signing: a signature would only prove
 * "this connection sent this", which the `RTCDataChannel` already gives for
 * free — the only peer that can be on the other end is the one this side
 * exchanged SDP with.
 */
export function resolvePeerTransport(env: WibblyEnv = {}, win: WibblyWindow | null = null): unknown {
  if (resolveMode(env, win) === MODE_DEMO) return null;
  return win?.__WIBBLY_PEER_TRANSPORT__ ?? null;
}

/**
 * Hard gate, called on the path that would construct a `PeerSession`.
 * Throwing here means "a demo build that tries to open a peer connection is
 * a bug that stops the build's own tests, not a runtime surprise for a
 * visitor".
 */
export function assertNoPeerSession(mode: WibblyMode): void {
  if (mode === MODE_DEMO) {
    throw new Error(
      'wibbly: PeerSession must never be constructed in demo mode — ' +
        'the demo is self-contained and opens no peer connections.',
    );
  }
}

/* ── Storage ──────────────────────────────────────────────────────────────── */

/** Every localStorage key this app is capable of writing. */
export const OWNED_STORAGE_KEYS = [
  'wibbly.settings.v1',
  'wibbly.setup.v1',
  'wibbly.calibration.v1',
];

/** Minimal storage surface `clearOwnedStorage` walks — a subset of `Storage`. */
export interface OwnedStorageLike {
  readonly length: number;
  key(index: number): string | null;
  getItem(key: string): string | null;
  removeItem(key: string): void;
}

/**
 * Demo mode is a SHARED, PUBLIC surface. One visitor's handedness must not be
 * sitting there waiting for the next one, so demo mode does not write to
 * localStorage at all — Calibration is handed a MemoryStorage, and settings
 * are held in React state instead of the persistent store.
 *
 * This function is the belt to that pair of braces: it removes anything under
 * our own key prefix. It runs on unload in demo mode, so that even a future
 * edit which accidentally reintroduces a write cannot leave a trace behind.
 * It only ever touches keys this app owns.
 */
export function clearOwnedStorage(store: OwnedStorageLike | null | undefined): number {
  if (!store) return 0;
  let removed = 0;
  try {
    const keys = new Set<string>(OWNED_STORAGE_KEYS);
    // Anything else we may have written under the namespace, e.g. the probes.
    for (let i = 0; i < store.length; i += 1) {
      const k = store.key(i);
      if (typeof k === 'string' && k.startsWith('wibbly.')) keys.add(k);
    }
    for (const k of keys) {
      if (store.getItem(k) !== null) {
        store.removeItem(k);
        removed += 1;
      }
    }
  } catch {
    /* storage blocked — nothing was written either, so nothing to clear */
  }
  return removed;
}
