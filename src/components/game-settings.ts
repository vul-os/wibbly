/**
 * Game settings — the real backing store behind the in-game menu.
 *
 * Deliberately small. Every key here is read by something that actually
 * exists; a setting with no consumer is a lie told with a toggle, so the
 * menu renders those as visibly disabled instead of storing them.
 *
 *   usePoseDetection  → games/tennis/game.jsx reads gameState.usePoseDetection at
 *                       mount and decides whether to start the camera pipeline.
 *   debug             → gameState.debug, read by game-logic.js and ball.js for
 *                       their diagnostic logging.
 *
 * Handedness is NOT here: it belongs to Calibration (§3.5), is per-player, and
 * has its own persistence keyed to PlayerId.
 */

const STORAGE_KEY = 'wibbly.settings.v1';

export interface GameSettings {
  usePoseDetection: boolean;
  debug: boolean;
}

export const DEFAULT_SETTINGS: GameSettings = {
  usePoseDetection: true,
  debug: false,
};

/** Keys the game actually consumes. Anything else is dropped on load. */
const KNOWN_KEYS = Object.keys(DEFAULT_SETTINGS) as Array<keyof GameSettings>;

/** Minimal storage surface actually used here — mirrors wibbly-input's CalibrationStorage. */
export interface SettingsStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

function storage(): SettingsStorage | null {
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

export function loadSettings(): GameSettings {
  const store = storage();
  if (!store) return { ...DEFAULT_SETTINGS };
  try {
    const raw = store.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return { ...DEFAULT_SETTINGS };
    const parsedRecord = parsed as Record<string, unknown>;
    const out = { ...DEFAULT_SETTINGS };
    for (const key of KNOWN_KEYS) {
      if (typeof parsedRecord[key] === typeof DEFAULT_SETTINGS[key]) {
        out[key] = parsedRecord[key] as never;
      }
    }
    return out;
  } catch {
    // A corrupt payload must not brick the title screen.
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings: GameSettings): void {
  const store = storage();
  if (!store) return;
  try {
    const out = {} as GameSettings;
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

export type SetupOutcome = 'camera' | 'keyboard' | null;

export interface SetupState {
  seen: boolean;
  outcome: SetupOutcome;
  at: number;
}

export function setupState(): SetupState {
  const store = storage();
  if (!store) return { seen: false, outcome: null, at: 0 };
  try {
    const parsed: unknown = JSON.parse(store.getItem(SETUP_KEY) || 'null');
    if (!parsed || typeof parsed !== 'object') return { seen: false, outcome: null, at: 0 };
    const parsedRecord = parsed as Record<string, unknown>;
    return {
      seen: parsedRecord.seen === true,
      // 'camera' — the pipeline started; 'keyboard' — the player chose or was
      // forced onto the spacebar fallback.
      outcome:
        parsedRecord.outcome === 'camera' || parsedRecord.outcome === 'keyboard'
          ? parsedRecord.outcome
          : null,
      at: typeof parsedRecord.at === 'number' ? parsedRecord.at : 0,
    };
  } catch {
    return { seen: false, outcome: null, at: 0 };
  }
}

export function recordSetup(outcome: SetupOutcome): void {
  const store = storage();
  if (!store) return;
  try {
    store.setItem(SETUP_KEY, JSON.stringify({ seen: true, outcome, at: Date.now() }));
  } catch {
    /* ignore */
  }
}
