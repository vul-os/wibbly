import { describe, expect, it, vi } from 'vitest';
import { MoveNetMultiPoseTracker, normalizePose } from '../src/pose-tracker';
import type { Frame } from '../src/types';

function fakeFrame(width: number, height: number): Frame {
  return { width, height } as unknown as Frame;
}

function rawPose(x: number, score = 0.9) {
  return {
    score,
    keypoints: [
      { name: 'nose', x, y: 100, score: 0.9 },
      { name: 'right_wrist', x: x + 20, y: 200, score: 0.8 },
    ],
  };
}

describe('normalizePose', () => {
  it('normalizes pixel coordinates to [0,1] against the frame', () => {
    const p = normalizePose(
      { score: 0.9, keypoints: [{ name: 'nose', x: 320, y: 240, score: 0.7 }] },
      640,
      480,
    );
    expect(p.keypoints[0].x).toBeCloseTo(0.5, 6);
    expect(p.keypoints[0].y).toBeCloseTo(0.5, 6);
  });

  it('normalizes the bounding box too', () => {
    const p = normalizePose(
      { score: 0.9, keypoints: [], box: { xMin: 160, yMin: 120, xMax: 480, yMax: 360 } },
      640,
      480,
    );
    expect(p.box).toEqual({ xMin: 0.25, yMin: 0.25, xMax: 0.75, yMax: 0.75 });
  });

  it('carries the model track id through as an advisory hint', () => {
    const p = normalizePose({ score: 0.9, id: 7, keypoints: [] }, 640, 480);
    expect(p.trackId).toBe(7);
  });
});

describe('MoveNetMultiPoseTracker', () => {
  it('requests the MultiPose Lightning model, not SinglePose', async () => {
    const createDetector = vi.fn().mockResolvedValue({ estimatePoses: async () => [] });
    const tracker = new MoveNetMultiPoseTracker({ createDetector });
    await tracker.init();

    const config = createDetector.mock.calls[0][1];
    // Key names verified against the installed package's movenet/types.d.ts
    // and constants.d.ts (MULTIPOSE_LIGHTNING = 'MultiPose.Lightning').
    expect(config.modelType).toBe('MultiPose.Lightning');
    expect(config.enableTracking).toBe(true); // required for smoothing on multipose
    expect(config).toHaveProperty('multiPoseMaxDimension');
    expect(config).toHaveProperty('minPoseScore');
    // Not a real MoveNetModelConfig key — the old code passed it and it was ignored.
    expect(config).not.toHaveProperty('minPartScore');
  });

  it('caps maxPeople at the model ceiling of 6', () => {
    expect(new MoveNetMultiPoseTracker({ maxPeople: 20 }).maxPeople).toBe(6);
    expect(new MoveNetMultiPoseTracker({ maxPeople: 2 }).maxPeople).toBe(2);
  });

  it('advertises body-only capabilities', () => {
    expect(new MoveNetMultiPoseTracker().capabilities).toEqual({
      body: true,
      hands: false,
      face: false,
    });
  });

  it('returns MULTIPLE people — the whole point of the swap', async () => {
    const estimatePoses = vi.fn().mockResolvedValue([rawPose(100), rawPose(300), rawPose(500)]);
    const tracker = new MoveNetMultiPoseTracker({
      createDetector: async () => ({ estimatePoses }),
    });
    await tracker.init();

    const people = await tracker.estimate(fakeFrame(640, 480));
    expect(people).toHaveLength(3);
    // Old behaviour was `poses[0]` — a hard single-person ceiling.
    expect(people.map((p) => p.keypoints[0].x)).toEqual([100 / 640, 300 / 640, 500 / 640]);
  });

  it('passes maxPoses through to estimation', async () => {
    const estimatePoses = vi.fn().mockResolvedValue([]);
    const tracker = new MoveNetMultiPoseTracker({
      maxPeople: 4,
      createDetector: async () => ({ estimatePoses }),
    });
    await tracker.init();
    await tracker.estimate(fakeFrame(640, 480));
    expect(estimatePoses.mock.calls[0][1]).toMatchObject({ maxPoses: 4, flipHorizontal: false });
  });

  it('drops poses below minPoseScore and truncates to maxPeople', async () => {
    const estimatePoses = vi
      .fn()
      .mockResolvedValue([rawPose(100, 0.9), rawPose(200, 0.05), rawPose(300, 0.9), rawPose(400, 0.9)]);
    const tracker = new MoveNetMultiPoseTracker({
      maxPeople: 2,
      minPoseScore: 0.25,
      createDetector: async () => ({ estimatePoses }),
    });
    await tracker.init();
    const people = await tracker.estimate(fakeFrame(640, 480));
    expect(people).toHaveLength(2);
    expect(people.every((p) => p.score >= 0.25)).toBe(true);
  });

  it('returns nothing for a zero-sized frame rather than dividing by zero', async () => {
    const tracker = new MoveNetMultiPoseTracker({
      createDetector: async () => ({ estimatePoses: async () => [rawPose(10)] }),
    });
    await tracker.init();
    expect(await tracker.estimate(fakeFrame(0, 0))).toEqual([]);
  });

  it('throws a clear error if estimate is called before init', async () => {
    const tracker = new MoveNetMultiPoseTracker();
    await expect(tracker.estimate(fakeFrame(640, 480))).rejects.toThrow(/init/);
  });
});
