import { describe, expect, it } from 'vitest';
import { SpatialBinder, equalClaimZones } from '../src/binder';
import { makePerson } from './fixtures';
import type { Person } from '../src/types';

const FRAME_MS = 33;

/** Run a sequence of frames through a binder, returning playerIds per frame. */
function run(binder: SpatialBinder, frames: Person[][], startT = 1000): string[][] {
  return frames.map((people, i) => binder.bind(people, startT + i * FRAME_MS).map((p) => p.playerId));
}

describe('SpatialBinder — identity across frames', () => {
  it('gives one person a stable id over many frames of drift', () => {
    const binder = new SpatialBinder();
    const frames = Array.from({ length: 30 }, (_, i) => [makePerson({ cx: 0.3 + i * 0.005 })]);
    const ids = run(binder, frames);
    const flat = ids.flat();
    expect(flat).toHaveLength(30);
    expect(new Set(flat).size).toBe(1);
  });

  it('keeps two people distinct and stable', () => {
    const binder = new SpatialBinder();
    const frames = Array.from({ length: 20 }, (_, i) => [
      makePerson({ cx: 0.25 + i * 0.002 }),
      makePerson({ cx: 0.75 - i * 0.002 }),
    ]);
    const ids = run(binder, frames);
    const first = ids[0];
    expect(new Set(first).size).toBe(2);
    for (const frame of ids) {
      expect(new Set(frame)).toEqual(new Set(first));
    }
  });

  it('does not let one track claim two people', () => {
    const binder = new SpatialBinder();
    binder.bind([makePerson({ cx: 0.5 })], 1000);
    // Two people appear very close to the single existing track. Greedy
    // matching over sorted pairs must give the track to exactly one of them.
    const out = binder.bind([makePerson({ cx: 0.48 }), makePerson({ cx: 0.52 })], 1033);
    expect(out).toHaveLength(2);
    expect(new Set(out.map((p) => p.playerId)).size).toBe(2);
  });

  it('assigns a new id to a genuinely new person', () => {
    const binder = new SpatialBinder();
    const a = binder.bind([makePerson({ cx: 0.3 })], 1000);
    const b = binder.bind([makePerson({ cx: 0.3 }), makePerson({ cx: 0.8 })], 1033);
    expect(b).toHaveLength(2);
    expect(b.some((p) => p.playerId === a[0].playerId)).toBe(true);
  });

  it('ignores poses below the score floor', () => {
    const binder = new SpatialBinder({ minPoseScore: 0.4 });
    const out = binder.bind([makePerson({ cx: 0.5, score: 0.1 })], 1000);
    expect(out).toHaveLength(0);
  });

  it('respects maxPlayers', () => {
    const binder = new SpatialBinder({ maxPlayers: 2 });
    const out = binder.bind(
      [makePerson({ cx: 0.2 }), makePerson({ cx: 0.5 }), makePerson({ cx: 0.8 })],
      1000,
    );
    expect(out).toHaveLength(2);
  });
});

describe('SpatialBinder — occlusion', () => {
  it('keeps the id through a short dropout', () => {
    const binder = new SpatialBinder({ forgetAfterMs: 1500 });
    const before = binder.bind([makePerson({ cx: 0.4 })], 1000);
    // Detector loses them for 5 frames (~165ms).
    for (let i = 1; i <= 5; i++) binder.bind([], 1000 + i * FRAME_MS);
    const after = binder.bind([makePerson({ cx: 0.42 })], 1000 + 6 * FRAME_MS);

    expect(after).toHaveLength(1);
    expect(after[0].playerId).toBe(before[0].playerId);
  });

  it('forgets a player who is gone longer than forgetAfterMs', () => {
    const binder = new SpatialBinder({ forgetAfterMs: 500 });
    const before = binder.bind([makePerson({ cx: 0.4 })], 1000);
    binder.bind([], 2000);
    const after = binder.bind([makePerson({ cx: 0.4 })], 2100);
    expect(after[0].playerId).not.toBe(before[0].playerId);
  });

  it('holds identity when only one of two players is occluded', () => {
    const binder = new SpatialBinder();
    const f1 = binder.bind([makePerson({ cx: 0.25 }), makePerson({ cx: 0.75 })], 1000);
    const left = f1.find((p) => p.keypoints[0].x < 0.5)!.playerId;

    // Right player vanishes behind furniture for a few frames.
    for (let i = 1; i <= 4; i++) binder.bind([makePerson({ cx: 0.25 })], 1000 + i * FRAME_MS);
    const f2 = binder.bind([makePerson({ cx: 0.25 }), makePerson({ cx: 0.75 })], 1000 + 5 * FRAME_MS);

    expect(f2).toHaveLength(2);
    expect(f2.map((p) => p.playerId)).toContain(left);
    expect(new Set(f2.map((p) => p.playerId)).size).toBe(2);
  });
});

describe('SpatialBinder — claim zones', () => {
  const zones = equalClaimZones(2);

  it('splits the frame into left/right zones', () => {
    expect(zones).toHaveLength(2);
    expect(zones[0]).toMatchObject({ playerId: 'player_1', xMin: 0 });
    expect(zones[1].playerId).toBe('player_2');
  });

  it('assigns ids by zone regardless of detection order', () => {
    const binder = new SpatialBinder({ claimZones: zones });
    // Right-hand person listed FIRST — order must not decide identity.
    const out = binder.bind([makePerson({ cx: 0.8 }), makePerson({ cx: 0.2 })], 1000);
    const byX = out.sort((a, b) => a.keypoints[0].x - b.keypoints[0].x);
    expect(byX[0].playerId).toBe('player_1');
    expect(byX[1].playerId).toBe('player_2');
  });

  it('ignores a bystander when no free zone contains them', () => {
    const binder = new SpatialBinder({ claimZones: zones });
    binder.bind([makePerson({ cx: 0.2 }), makePerson({ cx: 0.8 })], 1000);
    // A third person walks through; both zones are already claimed.
    const out = binder.bind(
      [makePerson({ cx: 0.2 }), makePerson({ cx: 0.8 }), makePerson({ cx: 0.5 })],
      1033,
    );
    expect(out).toHaveLength(2);
    expect(new Set(out.map((p) => p.playerId))).toEqual(new Set(['player_1', 'player_2']));
  });

  it('allows unzoned players when explicitly configured', () => {
    const binder = new SpatialBinder({ claimZones: zones, allowUnzonedPlayers: true, maxPlayers: 4 });
    binder.bind([makePerson({ cx: 0.2 }), makePerson({ cx: 0.8 })], 1000);
    const out = binder.bind(
      [makePerson({ cx: 0.2 }), makePerson({ cx: 0.8 }), makePerson({ cx: 0.5 })],
      1033,
    );
    expect(out).toHaveLength(3);
  });

  it('re-acquires a returning player into their old zone', () => {
    const binder = new SpatialBinder({ claimZones: zones, forgetAfterMs: 2000 });
    const f1 = binder.bind([makePerson({ cx: 0.2 }), makePerson({ cx: 0.8 })], 1000);
    const leftId = f1.find((p) => p.keypoints[0].x < 0.5)!.playerId;

    // Left player walks out of frame entirely for ~10 frames...
    for (let i = 1; i <= 10; i++) binder.bind([makePerson({ cx: 0.8 })], 1000 + i * FRAME_MS);
    // ...and returns at a DIFFERENT spot in their zone, too far for radius
    // matching. Zone re-acquisition is what recovers their id.
    const back = binder.bind(
      [makePerson({ cx: 0.05 }), makePerson({ cx: 0.8 })],
      1000 + 11 * FRAME_MS,
    );

    const returned = back.find((p) => p.keypoints[0].x < 0.5);
    expect(returned?.playerId).toBe(leftId);
  });
});

describe('SpatialBinder — crossing over', () => {
  it('follows motion rather than snapping ids back to their claim zone', () => {
    // The failure mode this guards: zones treated as per-frame authority would
    // swap both players' ids the moment they walk past each other.
    const binder = new SpatialBinder({ claimZones: equalClaimZones(2), forgetAfterMs: 2000 });

    const steps = 24;
    let firstIds: string[] = [];
    let lastIds: string[] = [];

    for (let i = 0; i <= steps; i++) {
      const f = i / steps;
      // A starts left and walks right; B starts right and walks left.
      const a = makePerson({ cx: 0.2 + f * 0.6, cy: 0.5 });
      const b = makePerson({ cx: 0.8 - f * 0.6, cy: 0.55 });
      const out = binder.bind([a, b], 1000 + i * FRAME_MS);
      const ids = out.map((p) => `${p.playerId}@${p.keypoints[0].x.toFixed(3)}`);
      if (i === 0) firstIds = ids;
      if (i === steps) lastIds = ids;
      expect(new Set(out.map((p) => p.playerId)).size).toBe(2);
    }

    const startLeft = firstIds.find((s) => parseFloat(s.split('@')[1]) < 0.5)!.split('@')[0];
    // The player who began on the left ends on the right, still themselves.
    const endRight = lastIds.find((s) => parseFloat(s.split('@')[1]) > 0.5)!.split('@')[0];
    expect(endRight).toBe(startLeft);
  });

  it('never emits duplicate ids in a single frame across a long noisy session', () => {
    const binder = new SpatialBinder({ maxPlayers: 4 });
    let t = 1000;
    for (let i = 0; i < 200; i++) {
      const n = 1 + (i % 3);
      const people = Array.from({ length: n }, (_, k) =>
        makePerson({ cx: 0.15 + k * 0.3 + Math.sin(i / 7 + k) * 0.02 }),
      );
      const out = binder.bind(people, t);
      expect(new Set(out.map((p) => p.playerId)).size).toBe(out.length);
      t += FRAME_MS;
    }
  });
});

describe('SpatialBinder — lifecycle', () => {
  it('reports active players including occluded ones', () => {
    const binder = new SpatialBinder({ forgetAfterMs: 1000 });
    binder.bind([makePerson({ cx: 0.3 })], 1000);
    expect(binder.activePlayers).toHaveLength(1);
    binder.bind([], 1100);
    expect(binder.activePlayers).toHaveLength(1);
    binder.bind([], 2500);
    expect(binder.activePlayers).toHaveLength(0);
  });

  it('reset clears all state and id allocation', () => {
    const binder = new SpatialBinder();
    const a = binder.bind([makePerson({ cx: 0.3 })], 1000);
    binder.reset();
    const b = binder.bind([makePerson({ cx: 0.9 })], 5000);
    expect(binder.activePlayers).toHaveLength(1);
    expect(b[0].playerId).toBe(a[0].playerId); // id counter restarts
  });
});
