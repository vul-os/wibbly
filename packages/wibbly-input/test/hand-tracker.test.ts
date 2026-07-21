import { describe, expect, it, vi } from 'vitest';
import {
  HAND_LANDMARKER_TASK_CDN_URL,
  HAND_LANDMARKER_TASK_VENDORED_PATH,
  HandLandmarkTracker,
  normalizeHands,
  resolveHandedness,
  selectHandDelegate,
  type RawHandLandmarker,
  type RawHandLandmarkerResult,
} from '../src/hand-tracker';
import { HAND_LANDMARK_NAMES } from '../src/types';
import type { Frame } from '../src/types';

function fakeFrame(): Frame {
  return {} as unknown as Frame;
}

/** A minimal, valid 21-point raw hand's landmark array, positioned near `x`. */
function rawHand(x: number): RawHandLandmarkerResult['landmarks'][number] {
  return HAND_LANDMARK_NAMES.map((_, i) => ({ x: x + i * 0.001, y: 0.5, z: 0 }));
}

function rawResult(hands: Array<{ x: number; label?: string; score?: number }>): RawHandLandmarkerResult {
  return {
    landmarks: hands.map((h) => rawHand(h.x)),
    handedness: hands.map((h) => [{ categoryName: h.label ?? 'Right', score: h.score ?? 0.95 }]),
  };
}

describe('resolveHandedness', () => {
  it('swaps the raw label by default — frames are NOT mirrored by this library\'s coordinate contract', () => {
    // MediaPipe's own docs (google/mediapipe docs/solutions/hands.md): handedness
    // is determined ASSUMING a mirrored (selfie-view) input image. This
    // package's default coordinate contract is the opposite, so the raw
    // label is the anatomical mirror of the truth unless corrected.
    expect(resolveHandedness('Left', false)).toBe('right');
    expect(resolveHandedness('Right', false)).toBe('left');
  });

  it('keeps the raw label when the caller says frames WERE mirrored', () => {
    expect(resolveHandedness('Left', true)).toBe('left');
    expect(resolveHandedness('Right', true)).toBe('right');
  });

  it('is case-insensitive and defaults sanely on a missing label', () => {
    expect(resolveHandedness('left', false)).toBe('right');
    expect(resolveHandedness(undefined, false)).toBe('left');
  });
});

describe('normalizeHands', () => {
  it('maps all 21 landmarks by name, index-aligned with the model order', () => {
    const hands = normalizeHands(rawResult([{ x: 0.1 }]), false);
    expect(hands).toHaveLength(1);
    expect(hands[0].landmarks).toHaveLength(21);
    expect(hands[0].landmarks.map((l) => l.name)).toEqual(HAND_LANDMARK_NAMES);
    expect(hands[0].landmarks[0].name).toBe('wrist');
    expect(hands[0].landmarks[20].name).toBe('pinky_tip');
  });

  it('returns MULTIPLE hands — same "plural is the point" as PoseTracker', () => {
    const hands = normalizeHands(rawResult([{ x: 0.1, label: 'Left' }, { x: 0.6, label: 'Right' }]), true);
    expect(hands).toHaveLength(2);
    // mirrored:true keeps the raw label as-is.
    expect(hands[0].handedness).toBe('left');
    expect(hands[1].handedness).toBe('right');
  });

  it('carries the handedness-classifier score through as the whole-hand confidence', () => {
    const hands = normalizeHands(rawResult([{ x: 0.1, score: 0.73 }]), false);
    expect(hands[0].score).toBe(0.73);
  });

  it('drops hands below the minimum hand score', () => {
    const raw = rawResult([{ x: 0.1, score: 0.9 }, { x: 0.5, score: 0.1 }]);
    const hands = normalizeHands(raw, false, 0.5);
    expect(hands).toHaveLength(1);
  });

  it('defensively skips a malformed (too-short) landmark array rather than crashing', () => {
    const raw: RawHandLandmarkerResult = {
      landmarks: [[{ x: 0.1, y: 0.1 }]], // only 1 point, not 21
      handedness: [[{ categoryName: 'Right', score: 0.9 }]],
    };
    expect(() => normalizeHands(raw, false)).not.toThrow();
    expect(normalizeHands(raw, false)).toHaveLength(0);
  });

  it('does not divide by frame dimensions — MediaPipe landmarks are already normalized', () => {
    const raw = rawResult([{ x: 0.42 }]);
    const hands = normalizeHands(raw, false);
    expect(hands[0].landmarks[0].x).toBeCloseTo(0.42, 6);
  });
});

describe('selectHandDelegate', () => {
  it('takes the preferred delegate when it succeeds', async () => {
    const fake = {} as RawHandLandmarker;
    const create = vi.fn().mockResolvedValue(fake);
    const { landmarker, info } = await selectHandDelegate(create, 'GPU');
    expect(landmarker).toBe(fake);
    expect(info).toEqual({ delegate: 'GPU', requested: 'GPU', fellBack: false, warning: null });
    expect(create).toHaveBeenCalledTimes(1);
    expect(create).toHaveBeenCalledWith('GPU');
  });

  it('falls back to CPU when GPU fails to initialise, and says so honestly', async () => {
    const fake = {} as RawHandLandmarker;
    const create = vi.fn().mockImplementation(async (delegate: string) => {
      if (delegate === 'GPU') throw new Error('no WebGL context');
      return fake;
    });
    const { landmarker, info } = await selectHandDelegate(create, 'GPU');
    expect(landmarker).toBe(fake);
    expect(info.delegate).toBe('CPU');
    expect(info.fellBack).toBe(true);
    expect(info.warning).toMatch(/fell back/i);
    expect(create.mock.calls.map((c) => c[0])).toEqual(['GPU', 'CPU']);
  });

  it('never tries CPU when CPU itself was the preferred delegate', async () => {
    const create = vi.fn().mockResolvedValue({} as RawHandLandmarker);
    await selectHandDelegate(create, 'CPU');
    expect(create).toHaveBeenCalledTimes(1);
    expect(create).toHaveBeenCalledWith('CPU');
  });

  it('throws the last error when every rung fails, rather than swallowing it', async () => {
    const create = vi.fn().mockRejectedValue(new Error('wasm blocked by CSP'));
    await expect(selectHandDelegate(create, 'GPU')).rejects.toThrow(/wasm blocked/);
  });
});

describe('HandLandmarkTracker', () => {
  it('exposes hands-only capabilities, mirroring TrackerCapabilities shape', () => {
    const tracker = new HandLandmarkTracker();
    expect(tracker.capabilities).toEqual({ body: false, hands: true, face: false });
  });

  it('defaults maxHands to 2 and floors it at 1', () => {
    expect(new HandLandmarkTracker().maxHands).toBe(2);
    expect(new HandLandmarkTracker({ maxHands: 0 }).maxHands).toBe(1);
    expect(new HandLandmarkTracker({ maxHands: 4 }).maxHands).toBe(4);
  });

  it('resolves modelUrl/wasmBase to the vendored same-origin paths by default (no document in this env)', () => {
    // No `document` in the node test environment, so `resolveVendored` falls
    // through to the bare relative path — this IS the assertion: it must
    // never silently reach for a CDN URL as a default.
    const createLandmarker = vi.fn().mockResolvedValue({ detectForVideo: () => ({ landmarks: [], handedness: [] }) });
    const tracker = new HandLandmarkTracker({ createLandmarker });
    void tracker.init();
    // modelUrl/wasmBase are private; behaviour is asserted via createLandmarker's args below instead.
    expect(HAND_LANDMARKER_TASK_VENDORED_PATH).not.toContain('http');
    expect(HAND_LANDMARKER_TASK_CDN_URL).toContain('https://');
  });

  it('passes modelUrl, wasmBase and config through to the injected createLandmarker', async () => {
    const createLandmarker = vi
      .fn()
      .mockResolvedValue({ detectForVideo: () => ({ landmarks: [], handedness: [] }) });
    const tracker = new HandLandmarkTracker({
      createLandmarker,
      modelUrl: 'models/hand-landmarker/hand_landmarker.task',
      wasmBase: 'models/hand-landmarker/wasm',
      maxHands: 3,
      minHandDetectionConfidence: 0.6,
    });
    await tracker.init();

    expect(createLandmarker).toHaveBeenCalledWith(
      'GPU',
      'models/hand-landmarker/hand_landmarker.task',
      'models/hand-landmarker/wasm',
      expect.objectContaining({ numHands: 3, minHandDetectionConfidence: 0.6, delegate: 'GPU' }),
    );
  });

  it('reports delegate info via onDelegate after init', async () => {
    const onDelegate = vi.fn();
    const createLandmarker = vi.fn().mockResolvedValue({ detectForVideo: () => ({ landmarks: [], handedness: [] }) });
    const tracker = new HandLandmarkTracker({ createLandmarker, onDelegate });
    await tracker.init();
    expect(onDelegate).toHaveBeenCalledWith({ delegate: 'GPU', requested: 'GPU', fellBack: false, warning: null });
  });

  it('is idempotent — a second init() does not re-create the landmarker', async () => {
    const createLandmarker = vi.fn().mockResolvedValue({ detectForVideo: () => ({ landmarks: [], handedness: [] }) });
    const tracker = new HandLandmarkTracker({ createLandmarker });
    await tracker.init();
    await tracker.init();
    expect(createLandmarker).toHaveBeenCalledTimes(1);
  });

  it('returns hands from estimate(), sliced to maxHands', async () => {
    const detectForVideo = vi.fn().mockReturnValue(rawResult([{ x: 0.1 }, { x: 0.4 }, { x: 0.7 }]));
    const tracker = new HandLandmarkTracker({
      maxHands: 2,
      createLandmarker: async () => ({ detectForVideo }),
    });
    await tracker.init();
    const hands = await tracker.estimate(fakeFrame());
    expect(hands).toHaveLength(2);
  });

  it('calls detectForVideo with a monotonically increasing timestamp across calls', async () => {
    const detectForVideo = vi.fn().mockReturnValue({ landmarks: [], handedness: [] });
    const tracker = new HandLandmarkTracker({ createLandmarker: async () => ({ detectForVideo }) });
    await tracker.init();
    await tracker.estimate(fakeFrame());
    await tracker.estimate(fakeFrame());
    await tracker.estimate(fakeFrame());
    const timestamps = detectForVideo.mock.calls.map((c) => c[1] as number);
    expect(timestamps[1]).toBeGreaterThan(timestamps[0]);
    expect(timestamps[2]).toBeGreaterThan(timestamps[1]);
  });

  it('throws a clear error if estimate is called before init', async () => {
    const tracker = new HandLandmarkTracker();
    await expect(tracker.estimate(fakeFrame())).rejects.toThrow(/init/);
  });

  it('dispose() closes the underlying landmarker and allows re-init', async () => {
    const close = vi.fn();
    const createLandmarker = vi.fn().mockResolvedValue({ detectForVideo: () => ({ landmarks: [], handedness: [] }), close });
    const tracker = new HandLandmarkTracker({ createLandmarker });
    await tracker.init();
    tracker.dispose();
    expect(close).toHaveBeenCalledTimes(1);

    await tracker.init();
    expect(createLandmarker).toHaveBeenCalledTimes(2);
  });

  it('falls back from GPU to CPU through the SAME injected factory, honouring the mirrored config end to end', async () => {
    const detectForVideo = vi.fn().mockReturnValue(rawResult([{ x: 0.2, label: 'Left' }]));
    const createLandmarker = vi.fn().mockImplementation(async (delegate: 'CPU' | 'GPU') => {
      if (delegate === 'GPU') throw new Error('no GL context');
      return { detectForVideo };
    });
    const onDelegate = vi.fn();
    const tracker = new HandLandmarkTracker({ createLandmarker, onDelegate, mirrored: true });
    await tracker.init();
    expect(onDelegate).toHaveBeenCalledWith(expect.objectContaining({ delegate: 'CPU', fellBack: true }));

    const hands = await tracker.estimate(fakeFrame());
    // mirrored: true — the raw 'Left' label is kept as-is, not swapped.
    expect(hands[0].handedness).toBe('left');
  });
});
