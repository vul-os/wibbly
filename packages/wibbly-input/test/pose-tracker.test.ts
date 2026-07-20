import { describe, expect, it, vi } from 'vitest';
import {
  MOVENET_MULTIPOSE_LIGHTNING_CDN_URL,
  MOVENET_MULTIPOSE_LIGHTNING_VENDORED_PATH,
  MoveNetMultiPoseTracker,
  normalizePose,
  selectBackend,
} from '../src/pose-tracker';
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

  describe('modelUrl — where the weights come from', () => {
    async function configFor(cfg: object) {
      const createDetector = vi.fn().mockResolvedValue({ estimatePoses: async () => [] });
      await new MoveNetMultiPoseTracker({ createDetector, ...cfg }).init();
      return createDetector.mock.calls[0][1] as Record<string, unknown>;
    }

    it('defaults to the vendored same-origin copy, NOT the TF Hub CDN', async () => {
      const config = await configFor({});
      // `modelUrl` is the package's own key (movenet/types.d.ts), not one
      // invented here. Getting this wrong is silent: an unknown key is simply
      // ignored and the model loads from tfhub.dev anyway.
      expect(config.modelUrl).toBe(MOVENET_MULTIPOSE_LIGHTNING_VENDORED_PATH);
      expect(String(config.modelUrl)).not.toContain('tfhub.dev');
    });

    it('passes an explicit URL through verbatim', async () => {
      const config = await configFor({ modelUrl: 'https://mirror.example/model.json' });
      expect(config.modelUrl).toBe('https://mirror.example/model.json');
    });

    it('opts back into the CDN when asked, for a build with no vendored weights', async () => {
      const config = await configFor({ modelUrl: MOVENET_MULTIPOSE_LIGHTNING_CDN_URL });
      // The package tests this string for `https://tfhub.dev` to decide
      // `fromTFHub`, which is why the constant has to stay exactly this.
      expect(config.modelUrl).toContain('https://tfhub.dev');
    });

    it('omits the key entirely on null, deferring to the package default', async () => {
      const config = await configFor({ modelUrl: null });
      expect(config).not.toHaveProperty('modelUrl');
    });
  });

  describe('selectBackend — CSP-driven backend choice', () => {
    /**
     * The production embed is served under
     * `script-src 'self' 'unsafe-inline'` with no `'wasm-unsafe-eval'`, so the
     * TFJS WASM backend cannot instantiate there. These cases cover the
     * combinations that a browser test on a developer machine never would.
     */
    function fakeTf(available: Record<string, boolean>, initial = 'cpu') {
      let current = initial;
      return {
        ready: async () => {},
        setBackend: async (name: string) => {
          if (!(name in available)) throw new Error(`backend "${name}" is not registered`);
          if (!available[name]) return false;
          current = name;
          return true;
        },
        getBackend: () => current,
      };
    }

    it('takes the preferred backend when it is available', async () => {
      const info = await selectBackend(fakeTf({ webgl: true }), ['webgl']);
      expect(info).toEqual({ backend: 'webgl', preferred: true, cspHostile: false, warning: null });
    });

    it('falls back in order', async () => {
      const info = await selectBackend(fakeTf({ webgpu: false, webgl: true }), ['webgpu', 'webgl']);
      expect(info.backend).toBe('webgl');
      expect(info.preferred).toBe(true);
    });

    it('warns — but does not throw — when it lands on the slow CPU backend', async () => {
      const info = await selectBackend(fakeTf({ webgl: false }, 'cpu'), ['webgl']);
      expect(info.backend).toBe('cpu');
      expect(info.preferred).toBe(false);
      // CPU is legal under the CSP: pure JS, no eval, no wasm. Slow, not broken.
      expect(info.cspHostile).toBe(false);
      expect(info.warning).toMatch(/slow/i);
    });

    it('flags a WASM fallback as CSP-hostile, because the embed forbids it', async () => {
      const info = await selectBackend(fakeTf({ webgl: false }, 'wasm'), ['webgl']);
      expect(info.backend).toBe('wasm');
      expect(info.cspHostile).toBe(true);
      expect(info.warning).toMatch(/wasm-unsafe-eval/);
      expect(info.warning).toMatch(/will not work/i);
    });

    it('survives an unregistered backend name rather than throwing out', async () => {
      const info = await selectBackend(fakeTf({}, 'cpu'), ['webgpu', 'webgl']);
      expect(info.backend).toBe('cpu');
      expect(info.preferred).toBe(false);
      expect(info.warning).toContain('not registered');
    });

    it('defaults to preferring webgl', async () => {
      const tf = fakeTf({ webgl: true });
      const spy = vi.spyOn(tf, 'setBackend');
      await selectBackend(tf);
      expect(spy).toHaveBeenCalledWith('webgl');
    });
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
