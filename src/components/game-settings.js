/**
 * Game settings — the real backing store behind the in-game menu.
 *
 * Deliberately small. Every key here is read by something that actually
 * exists; a setting with no consumer is a lie told with a toggle, so the
 * menu renders those as visibly disabled instead of storing them.
 *
 *   usePoseDetection  → src/game/game.jsx reads gameState.usePoseDetection at
 *                       mount and decides whether to start the camera pipeline.
 *   debug             → gameState.debug, read by game-logic.js and ball.js for
 *                       their diagnostic logging.
 *
 * Handedness is NOT here: it belongs to Calibration (§3.5), is per-player, and
 * has its own persistence keyed to PlayerId.
 */

const STORAGE_KEY = 'wibbly.settings.v1';

export const DEFAULT_SETTINGS = {
  usePoseDetection: true,
  debug: false,
};

/** Keys the game actually consumes. Anything else is dropped on load. */
const KNOWN_KEYS = Object.keys(DEFAULT_SETTINGS);

function storage() {
  try {
    if (typeof localStorage === 'undefined') return null;
    // Safari private mode throws on setItem, so probe rather than assume.
    localStorage.setItem(`${STORAGE_KEY}.probe`, '1');
    localStorage.removeItem(`${STORAGE_KEY}.probe`);
    return localStorage;
  } catch {
    return null;
  }
}

export function loadSettings() {
  const store = storage();
  if (!store) return { ...DEFAULT_SETTINGS };
  try {
    const raw = store.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return { ...DEFAULT_SETTINGS };
    const out = { ...DEFAULT_SETTINGS };
    for (const key of KNOWN_KEYS) {
      if (typeof parsed[key] === typeof DEFAULT_SETTINGS[key]) out[key] = parsed[key];
    }
    return out;
  } catch {
    // A corrupt payload must not brick the title screen.
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings) {
  const store = storage();
  if (!store) return;
  try {
    const out = {};
    for (const key of KNOWN_KEYS) out[key] = settings[key];
    store.setItem(STORAGE_KEY, JSON.stringify(out));
  } catch {
    /* storage full or blocked — settings degrade to in-memory for this session */
  }
}

/* ── First-run setup ───────────────────────────────────────────────────────
   Records that the player has been through the camera explainer once, so the
   title screen knows whether to send them to setup or straight into a match.
   It records that setup was SEEN, not that a camera works — permission can be
   revoked at any time and the game has to cope with that on every run. */

const SETUP_KEY = 'wibbly.setup.v1';

export function setupState() {
  const store = storage();
  if (!store) return { seen: false, outcome: null, at: 0 };
  try {
    const parsed = JSON.parse(store.getItem(SETUP_KEY) || 'null');
    if (!parsed || typeof parsed !== 'object') return { seen: false, outcome: null, at: 0 };
    return {
      seen: parsed.seen === true,
      // 'camera' — the pipeline started; 'keyboard' — the player chose or was
      // forced onto the spacebar fallback.
      outcome: parsed.outcome === 'camera' || parsed.outcome === 'keyboard' ? parsed.outcome : null,
      at: typeof parsed.at === 'number' ? parsed.at : 0,
    };
  } catch {
    return { seen: false, outcome: null, at: 0 };
  }
}

export function recordSetup(outcome) {
  const store = storage();
  if (!store) return;
  try {
    store.setItem(SETUP_KEY, JSON.stringify({ seen: true, outcome, at: Date.now() }));
  } catch {
    /* ignore */
  }
}
