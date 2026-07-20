import {
  distance,
  torsoCentroid,
  type BoundPerson,
  type Person,
  type PlayerId,
  type Vector2,
} from './types';

/**
 * §3.4 seam — which skeleton is which player.
 *
 * MoveNet MultiPose returns up to 6 skeletons per frame with NO stable identity
 * across frames. A binder assigns durable PlayerIds. Per the spec this is the
 * single highest-risk component in the project.
 */
export interface PlayerBinder {
  bind(people: Person[], tNow: number): BoundPerson[];
  reset(): void;
  /** Currently known players, including ones temporarily occluded. */
  readonly activePlayers: PlayerId[];
}

/** A horizontal slice of the frame a player claims — the couch case. */
export interface ClaimZone {
  playerId: PlayerId;
  /** Normalized [0,1] frame-space bounds, inclusive-exclusive. */
  xMin: number;
  xMax: number;
}

export interface SpatialBinderConfig {
  maxPlayers?: number;
  /**
   * Maximum normalized centroid movement between consecutive frames that still
   * counts as "the same person". Too small and a fast-moving player is dropped;
   * too large and two nearby players swap identity.
   */
  matchRadius?: number;
  /**
   * How long a player keeps their id while undetected. Covers occlusion and
   * brief detector dropouts. After this, the id (and its claimed zone) is
   * released and a returning player is treated as new.
   */
  forgetAfterMs?: number;
  /** Poses below this whole-pose score are ignored entirely. */
  minPoseScore?: number;
  /** Min keypoint score used when computing a centroid. */
  minKeypointScore?: number;
  /**
   * Claim zones. When set, a NEWLY seen person claims the free zone containing
   * their centroid. Zones are sticky-on-claim: once a player owns a zone, they
   * keep their id even if they walk out of it, so two players crossing over do
   * not swap identity. Zones matter at claim time and at re-acquisition time,
   * never as a per-frame reassignment.
   */
  claimZones?: ClaimZone[];
  /**
   * When claimZones are configured, whether a person outside every free zone
   * may still be bound to an auto-generated id. Default false — for a couch
   * game you usually want a bystander walking behind the players to be ignored.
   */
  allowUnzonedPlayers?: boolean;
}

interface Track {
  playerId: PlayerId;
  centroid: Vector2;
  /** Smoothed per-frame velocity, used to predict where an occluded player will reappear. */
  velocity: Vector2;
  lastSeenAt: number;
  lastFrameIndex: number;
  zone: ClaimZone | null;
  /** Consecutive frames this track went unmatched. */
  missedFrames: number;
  seenFrames: number;
}

const DEFAULTS = {
  maxPlayers: 4,
  matchRadius: 0.22,
  forgetAfterMs: 1500,
  minPoseScore: 0.2,
  minKeypointScore: 0.3,
  allowUnzonedPlayers: false,
};

/**
 * Default PlayerBinder — greedy nearest-centroid matching with configurable
 * claim zones.
 *
 * Algorithm per frame:
 *   1. Reject low-confidence poses; compute a torso-weighted centroid each.
 *   2. Score every (track, person) pair by distance from the track's
 *      *predicted* position (last centroid + velocity), and accept pairs
 *      greedily in ascending distance order, skipping any pair whose distance
 *      exceeds matchRadius or whose track/person is already claimed.
 *      Greedy-on-sorted-pairs is deliberate: it is O(n·m log nm) with n,m ≤ 6,
 *      and unlike naive per-track nearest it cannot have two tracks fight over
 *      one person.
 *   3. Unmatched people are re-acquired against *stale* tracks (tracks not seen
 *      this frame but not yet forgotten) via zone containment rather than
 *      radius — this is what lets a player leave frame and come back with the
 *      same id, since they may well return far from where they left.
 *   4. Still-unmatched people claim a free zone, or an auto id.
 *   5. Unmatched tracks age; past forgetAfterMs they are dropped and their zone
 *      is freed.
 */
export class SpatialBinder implements PlayerBinder {
  private tracks: Track[] = [];
  private cfg: Required<Omit<SpatialBinderConfig, 'claimZones'>> & { claimZones: ClaimZone[] };
  private frameIndex = 0;
  private nextAutoId = 1;

  constructor(config: SpatialBinderConfig = {}) {
    this.cfg = {
      maxPlayers: config.maxPlayers ?? DEFAULTS.maxPlayers,
      matchRadius: config.matchRadius ?? DEFAULTS.matchRadius,
      forgetAfterMs: config.forgetAfterMs ?? DEFAULTS.forgetAfterMs,
      minPoseScore: config.minPoseScore ?? DEFAULTS.minPoseScore,
      minKeypointScore: config.minKeypointScore ?? DEFAULTS.minKeypointScore,
      allowUnzonedPlayers: config.allowUnzonedPlayers ?? DEFAULTS.allowUnzonedPlayers,
      claimZones: config.claimZones ?? [],
    };
  }

  get activePlayers(): PlayerId[] {
    return this.tracks.map((t) => t.playerId);
  }

  reset(): void {
    this.tracks = [];
    this.frameIndex = 0;
    this.nextAutoId = 1;
  }

  bind(people: Person[], tNow: number): BoundPerson[] {
    this.frameIndex += 1;

    const candidates = people
      .filter((p) => p.score >= this.cfg.minPoseScore)
      .map((person) => ({ person, centroid: torsoCentroid(person, this.cfg.minKeypointScore) }))
      .filter((c): c is { person: Person; centroid: Vector2 } => c.centroid !== null);

    const personTaken = new Array(candidates.length).fill(false);
    const trackTaken = new Set<Track>();
    const results: BoundPerson[] = [];

    // --- 2. greedy nearest-centroid over predicted positions -----------------
    const pairs: Array<{ track: Track; index: number; dist: number }> = [];
    for (const track of this.tracks) {
      const predicted = this.predict(track);
      candidates.forEach((c, index) => {
        pairs.push({ track, index, dist: distance(predicted, c.centroid) });
      });
    }
    pairs.sort((a, b) => a.dist - b.dist);

    for (const pair of pairs) {
      if (pair.dist > this.effectiveRadius(pair.track)) continue;
      if (trackTaken.has(pair.track) || personTaken[pair.index]) continue;
      trackTaken.add(pair.track);
      personTaken[pair.index] = true;
      const c = candidates[pair.index];
      this.updateTrack(pair.track, c.centroid, tNow);
      results.push({ ...c.person, playerId: pair.track.playerId });
    }

    // --- 3. re-acquire returning players by zone ----------------------------
    const staleTracks = this.tracks.filter((t) => !trackTaken.has(t) && t.zone !== null);
    for (const track of staleTracks) {
      const zone = track.zone!;
      const idx = candidates.findIndex(
        (c, i) => !personTaken[i] && inZone(zone, c.centroid.x),
      );
      if (idx === -1) continue;
      trackTaken.add(track);
      personTaken[idx] = true;
      const c = candidates[idx];
      this.updateTrack(track, c.centroid, tNow, /* reacquired */ true);
      results.push({ ...c.person, playerId: track.playerId });
    }

    // --- 4. new players ------------------------------------------------------
    // Left-to-right so zone assignment is deterministic when several people
    // appear on the same frame.
    const fresh = candidates
      .map((c, i) => ({ c, i }))
      .filter(({ i }) => !personTaken[i])
      .sort((a, b) => a.c.centroid.x - b.c.centroid.x);

    for (const { c, i } of fresh) {
      if (this.tracks.length >= this.cfg.maxPlayers) break;
      const zone = this.freeZoneFor(c.centroid.x);
      if (!zone && this.cfg.claimZones.length > 0 && !this.cfg.allowUnzonedPlayers) continue;

      const playerId = zone ? zone.playerId : `player_${this.nextAutoId++}`;
      const track: Track = {
        playerId,
        centroid: c.centroid,
        velocity: { x: 0, y: 0 },
        lastSeenAt: tNow,
        lastFrameIndex: this.frameIndex,
        zone: zone ?? null,
        missedFrames: 0,
        seenFrames: 1,
      };
      this.tracks.push(track);
      personTaken[i] = true;
      results.push({ ...c.person, playerId });
    }

    // --- 5. age and forget ---------------------------------------------------
    for (const track of this.tracks) {
      if (!trackTaken.has(track)) {
        track.missedFrames += 1;
        // Velocity decays while unobserved so prediction does not run away
        // during a long occlusion.
        track.velocity = { x: track.velocity.x * 0.6, y: track.velocity.y * 0.6 };
      }
    }
    this.tracks = this.tracks.filter((t) => tNow - t.lastSeenAt <= this.cfg.forgetAfterMs);

    return results;
  }

  /** Predicted centroid for this frame, from last observation + velocity. */
  private predict(track: Track): Vector2 {
    const steps = Math.max(1, this.frameIndex - track.lastFrameIndex);
    // Cap extrapolation: a long gap should not fling the prediction off-frame.
    const k = Math.min(steps, 3);
    return {
      x: track.centroid.x + track.velocity.x * k,
      y: track.centroid.y + track.velocity.y * k,
    };
  }

  /**
   * Occluded tracks get a widening search radius: the longer we have not seen
   * someone, the further they could plausibly have moved. Capped at 2.5x so it
   * never grows large enough to steal another player's skeleton.
   */
  private effectiveRadius(track: Track): number {
    const growth = 1 + Math.min(track.missedFrames, 6) * 0.25;
    return this.cfg.matchRadius * Math.min(growth, 2.5);
  }

  private updateTrack(track: Track, centroid: Vector2, tNow: number, reacquired = false): void {
    const steps = Math.max(1, this.frameIndex - track.lastFrameIndex);
    const observed = {
      x: (centroid.x - track.centroid.x) / steps,
      y: (centroid.y - track.centroid.y) / steps,
    };
    // A re-acquisition is a teleport, not motion — do not poison velocity with it.
    if (reacquired) {
      track.velocity = { x: 0, y: 0 };
    } else {
      const a = 0.5;
      track.velocity = {
        x: track.velocity.x * (1 - a) + observed.x * a,
        y: track.velocity.y * (1 - a) + observed.y * a,
      };
    }
    track.centroid = centroid;
    track.lastSeenAt = tNow;
    track.lastFrameIndex = this.frameIndex;
    track.missedFrames = 0;
    track.seenFrames += 1;
  }

  private freeZoneFor(x: number): ClaimZone | null {
    const occupied = new Set(this.tracks.map((t) => t.zone?.playerId).filter(Boolean));
    return (
      this.cfg.claimZones.find((z) => !occupied.has(z.playerId) && inZone(z, x)) ?? null
    );
  }
}

function inZone(zone: ClaimZone, x: number): boolean {
  return x >= zone.xMin && x < zone.xMax;
}

/** Convenience: split the frame into N equal vertical claim zones, left to right. */
export function equalClaimZones(count: number, prefix = 'player_'): ClaimZone[] {
  const zones: ClaimZone[] = [];
  for (let i = 0; i < count; i++) {
    zones.push({
      playerId: `${prefix}${i + 1}`,
      xMin: i / count,
      xMax: i === count - 1 ? 1.0001 : (i + 1) / count,
    });
  }
  return zones;
}
