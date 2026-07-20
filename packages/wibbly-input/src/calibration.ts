import { keypointMap, type Handedness, type Person, type PlayerId } from './types';

/** §3.5 seam — per-player setup, persisted locally and keyed to PlayerId. */
export interface PlayerProfile {
  playerId: PlayerId;
  handedness: Handedness;
  /**
   * Reach envelope: observed wrist-to-shoulder distance range, normalized to
   * frame units. Lets a game scale hit windows to the player's actual arm
   * length and distance from the camera rather than assuming one body.
   */
  reach: { min: number; max: number } | null;
  /** Rough torso height in normalized units — a proxy for distance from camera. */
  torsoScale: number | null;
  updatedAt: number;
}

export interface CalibrationWarning {
  code: 'framing' | 'lighting' | 'confidence';
  message: string;
}

/** Minimal storage surface, so tests can run without a browser. */
export interface CalibrationStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export class MemoryStorage implements CalibrationStorage {
  private map = new Map<string, string>();
  getItem(key: string): string | null {
    return this.map.get(key) ?? null;
  }
  setItem(key: string, value: string): void {
    this.map.set(key, value);
  }
  removeItem(key: string): void {
    this.map.delete(key);
  }
}

const STORAGE_KEY = 'wibbly.calibration.v1';

function defaultStorage(): CalibrationStorage {
  try {
    if (typeof localStorage !== 'undefined') {
      // Probe: Safari private mode throws on setItem.
      localStorage.setItem(`${STORAGE_KEY}.probe`, '1');
      localStorage.removeItem(`${STORAGE_KEY}.probe`);
      return localStorage;
    }
  } catch {
    /* fall through to memory */
  }
  return new MemoryStorage();
}

export function emptyProfile(playerId: PlayerId, handedness: Handedness = 'right'): PlayerProfile {
  return { playerId, handedness, reach: null, torsoScale: null, updatedAt: 0 };
}

/**
 * Per-player calibration store. Nothing leaves the device — this is local
 * state, not an account.
 */
export class Calibration {
  private profiles = new Map<PlayerId, PlayerProfile>();
  private storage: CalibrationStorage;
  private key: string;

  constructor(storage?: CalibrationStorage, key = STORAGE_KEY) {
    this.storage = storage ?? defaultStorage();
    this.key = key;
    this.load();
  }

  private load(): void {
    try {
      const raw = this.storage.getItem(this.key);
      if (!raw) return;
      const parsed = JSON.parse(raw) as PlayerProfile[];
      if (!Array.isArray(parsed)) return;
      for (const p of parsed) {
        if (p && typeof p.playerId === 'string' && (p.handedness === 'left' || p.handedness === 'right')) {
          this.profiles.set(p.playerId, {
            playerId: p.playerId,
            handedness: p.handedness,
            reach: p.reach ?? null,
            torsoScale: p.torsoScale ?? null,
            updatedAt: p.updatedAt ?? 0,
          });
        }
      }
    } catch {
      // Corrupt payload must not brick startup — start clean.
      this.profiles.clear();
    }
  }

  private persist(): void {
    try {
      this.storage.setItem(this.key, JSON.stringify([...this.profiles.values()]));
    } catch {
      /* storage full or blocked — calibration degrades to in-memory */
    }
  }

  get(playerId: PlayerId): PlayerProfile {
    return this.profiles.get(playerId) ?? emptyProfile(playerId);
  }

  has(playerId: PlayerId): boolean {
    return this.profiles.has(playerId);
  }

  list(): PlayerProfile[] {
    return [...this.profiles.values()];
  }

  handednessFor(playerId: PlayerId): Handedness {
    return this.get(playerId).handedness;
  }

  setHandedness(playerId: PlayerId, handedness: Handedness): PlayerProfile {
    const profile = { ...this.get(playerId), handedness, updatedAt: Date.now() };
    this.profiles.set(playerId, profile);
    this.persist();
    return profile;
  }

  set(playerId: PlayerId, patch: Partial<Omit<PlayerProfile, 'playerId'>>): PlayerProfile {
    const profile = { ...this.get(playerId), ...patch, playerId, updatedAt: Date.now() };
    this.profiles.set(playerId, profile);
    this.persist();
    return profile;
  }

  clear(playerId?: PlayerId): void {
    if (playerId) this.profiles.delete(playerId);
    else this.profiles.clear();
    this.persist();
  }

  /**
   * Widen the player's reach envelope from an observed pose. Call this during a
   * calibration wave ("stretch both arms out") or continuously during play.
   * Returns the updated profile, or null if the pose was not usable.
   */
  observeReach(playerId: PlayerId, person: Person, minScore = 0.4): PlayerProfile | null {
    const map = keypointMap(person);
    const hand = this.handednessFor(playerId);
    const wrist = map[`${hand}_wrist`];
    const shoulder = map[`${hand}_shoulder`];
    if (!wrist || !shoulder || wrist.score < minScore || shoulder.score < minScore) return null;

    const reachNow = Math.hypot(wrist.x - shoulder.x, wrist.y - shoulder.y);
    const current = this.get(playerId);
    const reach = current.reach
      ? { min: Math.min(current.reach.min, reachNow), max: Math.max(current.reach.max, reachNow) }
      : { min: reachNow, max: reachNow };

    const ls = map['left_shoulder'];
    const rs = map['right_shoulder'];
    const lh = map['left_hip'];
    const rh = map['right_hip'];
    let torsoScale = current.torsoScale;
    if (ls && rs && lh && rh && [ls, rs, lh, rh].every((k) => k.score >= minScore)) {
      const shoulderY = (ls.y + rs.y) / 2;
      const hipY = (lh.y + rh.y) / 2;
      torsoScale = Math.abs(hipY - shoulderY);
    }

    return this.set(playerId, { reach, torsoScale });
  }
}

/**
 * Framing / lighting sanity checks for a calibration screen. Pure — feed it a
 * pose and it tells you what to say to the player.
 */
export function checkFraming(person: Person | null, minScore = 0.3): CalibrationWarning[] {
  const warnings: CalibrationWarning[] = [];
  if (!person) {
    return [{ code: 'framing', message: 'No one detected — step into view of the camera.' }];
  }

  const map = keypointMap(person);
  const required = ['left_shoulder', 'right_shoulder', 'left_hip', 'right_hip'];
  const missing = required.filter((n) => !map[n] || map[n].score < minScore);
  if (missing.length > 0) {
    warnings.push({
      code: 'framing',
      message: 'Step back so your head, shoulders and hips are all in frame.',
    });
  }

  const wrists = ['left_wrist', 'right_wrist'].map((n) => map[n]).filter((k) => k && k.score >= minScore);
  if (wrists.length === 0) {
    warnings.push({ code: 'framing', message: 'Your hands are out of frame — step back or centre yourself.' });
  }

  // Low mean keypoint confidence with a person present usually means poor light.
  const confident = person.keypoints.filter((k) => k.score > 0);
  const mean = confident.length
    ? confident.reduce((s, k) => s + k.score, 0) / confident.length
    : 0;
  if (mean > 0 && mean < 0.35) {
    warnings.push({ code: 'lighting', message: 'Tracking is weak — try turning on more light, facing it.' });
  }

  return warnings;
}
