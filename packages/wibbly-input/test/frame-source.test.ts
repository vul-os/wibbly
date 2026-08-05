import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  acquireCameraStream,
  cameraConstraintLadder,
  configureVideoElement,
  isOverconstrained,
  isPermissionDenial,
  waitForVideoMetadata,
  WebcamFrameSource,
  type FrameSourceOptions,
} from '../src/frame-source';

/**
 * These cover the parts of camera capture that differ between browser engines
 * and that a developer machine therefore never exercises: the constraint
 * negotiation ladder, permission-denial handling, autoplay rejection, and the
 * requestAnimationFrame capture fallback used where requestVideoFrameCallback
 * does not exist.
 *
 * Everything here runs in node against injected fakes. That is the point: the
 * failure modes below are exactly the ones you cannot reproduce by opening the
 * page in the browser you happen to have.
 */

const OPTS: FrameSourceOptions = { width: 640, height: 480, fps: 30, facingMode: 'user' };

function domError(name: string): Error {
  const e = new Error(name);
  e.name = name;
  return e;
}

/* ── constraint ladder ────────────────────────────────────────────────────── */

describe('cameraConstraintLadder', () => {
  it('never requires an exact width, height or frame rate', () => {
    // `exact` is a REQUIRED constraint: unsatisfiable means the whole
    // getUserMedia call rejects. Dimensions and frame rate must always be
    // advisory so a camera with fixed modes still opens.
    for (const rung of cameraConstraintLadder({ ...OPTS, deviceId: 'cam-1' })) {
      for (const key of ['width', 'height', 'frameRate'] as const) {
        const v = rung[key];
        if (v === undefined) continue;
        expect(v).not.toHaveProperty('exact');
        expect(v).not.toHaveProperty('min');
        expect(v).not.toHaveProperty('max');
        expect(v).toHaveProperty('ideal');
      }
    }
  });

  it('pins the requested device exactly on the first attempt only', () => {
    const ladder = cameraConstraintLadder({ ...OPTS, deviceId: 'cam-1' });
    expect(ladder[0].deviceId).toEqual({ exact: 'cam-1' });
    // "Give me a different camera than the one the player picked" is not a
    // useful approximation, so it is exact — and therefore must be dropped
    // entirely rather than loosened when it fails.
    for (const rung of ladder.slice(1)) expect(rung.deviceId).toBeUndefined();
  });

  it('loosens monotonically: every rung asks for no more than the one before', () => {
    const ladder = cameraConstraintLadder({ ...OPTS, deviceId: 'cam-1' });
    const counts = ladder.map((r) => Object.keys(r).length);
    for (let i = 1; i < counts.length; i++) {
      expect(counts[i]).toBeLessThanOrEqual(counts[i - 1]);
    }
  });

  it('drops frameRate before resolution, and resolution before facingMode', () => {
    const ladder = cameraConstraintLadder(OPTS);
    const hasFps = ladder.map((r) => 'frameRate' in r);
    const hasSize = ladder.map((r) => 'width' in r);
    const hasFacing = ladder.map((r) => 'facingMode' in r);
    // Last rung that still carries each: fps must go first, then size.
    expect(hasFps.lastIndexOf(true)).toBeLessThan(hasSize.lastIndexOf(true));
    expect(hasSize.lastIndexOf(true)).toBeLessThan(hasFacing.lastIndexOf(true));
  });

  it('ends with a completely bare request', () => {
    const ladder = cameraConstraintLadder(OPTS);
    expect(ladder[ladder.length - 1]).toEqual({});
  });

  it('never asks the identical question twice', () => {
    // Without facingMode several rungs collapse into each other; re-prompting
    // with a constraint set that already failed is pure latency.
    const ladder = cameraConstraintLadder({ width: 640, height: 480, fps: 30 });
    const seen = ladder.map((r) => JSON.stringify(r));
    expect(new Set(seen).size).toBe(seen.length);
  });
});

/* ── error classification ─────────────────────────────────────────────────── */

describe('error classification', () => {
  it('treats permission and security failures as final', () => {
    expect(isPermissionDenial(domError('NotAllowedError'))).toBe(true);
    expect(isPermissionDenial(domError('SecurityError'))).toBe(true);
    expect(isPermissionDenial(domError('PermissionDeniedError'))).toBe(true);
  });

  it('does not confuse a constraint failure with a denial', () => {
    expect(isPermissionDenial(domError('OverconstrainedError'))).toBe(false);
    expect(isOverconstrained(domError('OverconstrainedError'))).toBe(true);
    expect(isOverconstrained(domError('NotAllowedError'))).toBe(false);
  });

  it('classifies on name, not on message text', () => {
    // Message strings are not stable across engines and must not be matched.
    const misleading = new Error('Permission denied by the user');
    misleading.name = 'NotFoundError';
    expect(isPermissionDenial(misleading)).toBe(false);
  });

  it('survives non-Error throw values', () => {
    expect(isPermissionDenial(null)).toBe(false);
    expect(isPermissionDenial(undefined)).toBe(false);
    expect(isPermissionDenial('NotAllowedError')).toBe(false);
  });
});

/* ── acquisition ──────────────────────────────────────────────────────────── */

describe('acquireCameraStream', () => {
  const fakeStream = { getTracks: () => [], getVideoTracks: () => [] } as unknown as MediaStream;

  it('takes the first rung when the device can satisfy it', async () => {
    const gum = vi.fn().mockResolvedValue(fakeStream);
    await expect(acquireCameraStream(gum, OPTS)).resolves.toBe(fakeStream);
    expect(gum).toHaveBeenCalledTimes(1);
  });

  it('retries with a looser set after OverconstrainedError', async () => {
    const gum = vi
      .fn()
      .mockRejectedValueOnce(domError('OverconstrainedError'))
      .mockResolvedValue(fakeStream);
    await expect(acquireCameraStream(gum, OPTS)).resolves.toBe(fakeStream);
    expect(gum).toHaveBeenCalledTimes(2);
    // The retry must actually ask for less, not just ask again.
    const first = gum.mock.calls[0][0].video;
    const second = gum.mock.calls[1][0].video;
    expect(Object.keys(second).length).toBeLessThan(Object.keys(first).length);
  });

  it('NEVER retries a permission denial, and surfaces it unchanged', async () => {
    // Retrying a denial delays the spacebar fallback, which is a fully
    // supported way to play — not a consolation prize.
    const denial = domError('NotAllowedError');
    const gum = vi.fn().mockRejectedValue(denial);
    await expect(acquireCameraStream(gum, OPTS)).rejects.toBe(denial);
    expect(gum).toHaveBeenCalledTimes(1);
  });

  it('stops at a denial even when earlier rungs were merely overconstrained', async () => {
    const denial = domError('NotAllowedError');
    const gum = vi
      .fn()
      .mockRejectedValueOnce(domError('OverconstrainedError'))
      .mockRejectedValueOnce(denial);
    await expect(acquireCameraStream(gum, OPTS)).rejects.toBe(denial);
    expect(gum).toHaveBeenCalledTimes(2);
  });

  it('falls all the way to a bare video request before giving up', async () => {
    const gum = vi.fn().mockRejectedValue(domError('OverconstrainedError'));
    await expect(acquireCameraStream(gum, OPTS)).rejects.toThrow();
    const last = gum.mock.calls[gum.mock.calls.length - 1][0];
    // Bare `true`, not `{}` — an empty constraint object is not the same request.
    expect(last).toEqual({ video: true, audio: false });
  });

  it('propagates the final error rather than a synthesised one', async () => {
    const notFound = domError('NotFoundError');
    const gum = vi.fn().mockRejectedValue(notFound);
    await expect(acquireCameraStream(gum, OPTS)).rejects.toBe(notFound);
  });

  it('reports when it had to settle for less, and stays quiet when it did not', async () => {
    const quiet = vi.fn();
    await acquireCameraStream(vi.fn().mockResolvedValue(fakeStream), OPTS, quiet);
    expect(quiet).not.toHaveBeenCalled();

    const loud = vi.fn();
    await acquireCameraStream(
      vi.fn().mockRejectedValueOnce(domError('OverconstrainedError')).mockResolvedValue(fakeStream),
      OPTS,
      loud,
    );
    expect(loud).toHaveBeenCalledTimes(1);
    expect(String(loud.mock.calls[0][0])).toMatch(/reduced constraint set/i);
  });
});

/* ── video element setup ──────────────────────────────────────────────────── */

class FakeVideo extends EventTarget {
  readyState = 0;
  currentTime = 0;
  videoWidth = 0;
  videoHeight = 0;
  srcObject: unknown = null;
  playsInline = false;
  muted = false;
  defaultMuted = false;
  autoplay = false;
  paused = true;
  attributes = new Map<string, string>();
  playCalls = 0;
  playResult: () => Promise<void> = () => Promise.resolve();

  setAttribute(name: string, value: string): void {
    this.attributes.set(name, value);
  }
  play(): Promise<void> {
    this.playCalls += 1;
    this.paused = false;
    return this.playResult();
  }
  pause(): void {
    this.paused = true;
  }
}

function fakeVideo(): HTMLVideoElement {
  return new FakeVideo() as unknown as HTMLVideoElement;
}

describe('configureVideoElement', () => {
  it('sets inline playback and mute as BOTH properties and attributes', () => {
    const el = fakeVideo();
    configureVideoElement(el);
    const f = el as unknown as FakeVideo;

    expect(f.playsInline).toBe(true);
    expect(f.muted).toBe(true);
    expect(f.autoplay).toBe(true);

    // Autoplay gating consults the content attribute in some engines, and the
    // IDL property in others. Setting only one is a coin flip.
    expect(f.attributes.has('playsinline')).toBe(true);
    expect(f.attributes.has('muted')).toBe(true);
    expect(f.attributes.has('autoplay')).toBe(true);
  });

  it('also sets the pre-standard webkit-playsinline spelling', () => {
    const el = fakeVideo();
    configureVideoElement(el);
    // Inert on engines that never had it; the difference between inline and
    // an involuntary fullscreen takeover on old ones.
    expect((el as unknown as FakeVideo).attributes.has('webkit-playsinline')).toBe(true);
  });

  it('does not throw on an element without setAttribute', () => {
    const stub = { playsInline: false, muted: false, autoplay: false, defaultMuted: false };
    expect(() => configureVideoElement(stub as unknown as HTMLVideoElement)).not.toThrow();
    expect(stub.playsInline).toBe(true);
  });
});

describe('waitForVideoMetadata', () => {
  it('returns immediately when metadata is ALREADY there', async () => {
    // The event is an edge; readyState is the state. Adding a listener after
    // the edge has passed waits forever, which is the classic hang.
    const el = fakeVideo();
    (el as unknown as FakeVideo).readyState = 1;
    await expect(waitForVideoMetadata(el, 50)).resolves.toBe(true);
  });

  it('resolves when loadedmetadata arrives', async () => {
    const el = fakeVideo();
    const p = waitForVideoMetadata(el, 1000);
    el.dispatchEvent(new Event('loadedmetadata'));
    await expect(p).resolves.toBe(true);
  });

  it('accepts loadeddata as well, for engines stingy with loadedmetadata', async () => {
    const el = fakeVideo();
    const p = waitForVideoMetadata(el, 1000);
    el.dispatchEvent(new Event('loadeddata'));
    await expect(p).resolves.toBe(true);
  });

  it('resolves false on timeout instead of hanging or throwing', async () => {
    vi.useFakeTimers();
    try {
      const el = fakeVideo();
      const p = waitForVideoMetadata(el, 5000);
      vi.advanceTimersByTime(5001);
      await expect(p).resolves.toBe(false);
    } finally {
      vi.useRealTimers();
    }
  });

  it('resolves false on an element error', async () => {
    const el = fakeVideo();
    const p = waitForVideoMetadata(el, 1000);
    el.dispatchEvent(new Event('error'));
    await expect(p).resolves.toBe(false);
  });

  it('settles exactly once and detaches its listeners', async () => {
    const el = fakeVideo();
    const remove = vi.spyOn(el, 'removeEventListener');
    const p = waitForVideoMetadata(el, 1000);
    el.dispatchEvent(new Event('loadedmetadata'));
    el.dispatchEvent(new Event('error')); // must not flip the result
    await expect(p).resolves.toBe(true);
    expect(remove).toHaveBeenCalledTimes(3); // loadedmetadata, loadeddata, error
  });
});

/* ── WebcamFrameSource against a fake browser ─────────────────────────────── */

describe('WebcamFrameSource', () => {
  let rafQueue: Array<() => void>;
  let rafNext: number;
  let cancelled: Set<number>;
  let video: FakeVideo;
  let tracks: Array<{ stop: () => void; stopped: boolean }>;
  let getUserMedia: ReturnType<typeof vi.fn>;

  function makeTrack() {
    const t = { stopped: false, stop: () => void (t.stopped = true) };
    return t;
  }

  function makeStream() {
    return {
      getTracks: () => tracks,
      getVideoTracks: () => tracks,
    } as unknown as MediaStream;
  }

  /** Run every rAF callback currently queued (one generation, not a spin). */
  function tick() {
    const due = rafQueue;
    rafQueue = [];
    for (const cb of due) cb();
  }

  beforeEach(() => {
    rafQueue = [];
    rafNext = 1;
    cancelled = new Set();
    video = new FakeVideo();
    video.readyState = 2;
    video.videoWidth = 640;
    video.videoHeight = 480;
    tracks = [makeTrack()];
    getUserMedia = vi.fn().mockResolvedValue(makeStream());

    vi.stubGlobal('navigator', { mediaDevices: { getUserMedia } });
    vi.stubGlobal('document', { createElement: () => video });
    vi.stubGlobal('requestAnimationFrame', (cb: () => void) => {
      const id = rafNext++;
      rafQueue.push(() => {
        if (!cancelled.has(id)) cb();
      });
      return id;
    });
    vi.stubGlobal('cancelAnimationFrame', (id: number) => cancelled.add(id));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('starts, negotiates a size, and pumps frames', async () => {
    const src = new WebcamFrameSource();
    const frames: number[] = [];
    src.onFrame((_f, t) => frames.push(t));

    await src.start({ ...OPTS, onWarning: () => {} });
    expect(src.running).toBe(true);
    expect(src.frameSize).toEqual({ width: 640, height: 480 });

    tick();
    expect(frames.length).toBe(1);
    src.stop();
  });

  it('does not let a rejected play() take down the pipeline', async () => {
    // Autoplay policy, a backgrounded tab, or low-power mode can all reject
    // play() while the camera track is perfectly alive.
    video.playResult = () => Promise.reject(domError('NotAllowedError'));
    const warnings: string[] = [];
    const src = new WebcamFrameSource();

    await expect(src.start({ ...OPTS, onWarning: (m) => warnings.push(m) })).resolves.toBeUndefined();
    expect(src.running).toBe(true);
    expect(warnings.some((w) => /play\(\) was rejected/i.test(w))).toBe(true);

    const frames: unknown[] = [];
    src.onFrame((f) => frames.push(f));
    tick();
    expect(frames.length).toBe(1); // capture continues regardless
    src.stop();
  });

  it('requests playback before awaiting metadata', async () => {
    // Some engines will not produce metadata until playback is requested, so
    // awaiting metadata first is a deadlock. Proven by never firing the event:
    // if start() waited on it before calling play(), this would time out.
    video.readyState = 0;

    // Record how many times play() had been called at the exact moment the
    // metadata listener was attached. If start() awaited metadata first, this
    // would be 0 and a real browser with that ordering would hang.
    let playCallsWhenWaitingBegan = -1;
    const realAdd = video.addEventListener.bind(video);
    video.addEventListener = ((type: string, ...rest: unknown[]) => {
      if (type === 'loadedmetadata' && playCallsWhenWaitingBegan < 0) {
        playCallsWhenWaitingBegan = video.playCalls;
      }
      return (realAdd as (...a: unknown[]) => void)(type, ...rest);
    });

    const src = new WebcamFrameSource();
    const started = src.start({ ...OPTS, onWarning: () => {} });

    // Let start() get as far as it can on its own before we supply metadata.
    for (let i = 0; i < 20; i++) await Promise.resolve();
    video.readyState = 1;
    video.dispatchEvent(new Event('loadedmetadata'));
    await started;

    expect(playCallsWhenWaitingBegan).toBe(1);
    src.stop();
  });

  it('falls back to the track size when metadata never arrives', async () => {
    vi.useFakeTimers();
    try {
      video.readyState = 0;
      video.videoWidth = 0;
      video.videoHeight = 0;
      const t = makeTrack() as typeof tracks[number] & { getSettings: () => unknown };
      t.getSettings = () => ({ width: 320, height: 240 });
      tracks = [t];
      getUserMedia.mockResolvedValue(makeStream());

      const warnings: string[] = [];
      const src = new WebcamFrameSource();
      const started = src.start({ ...OPTS, onWarning: (m) => warnings.push(m) });
      await vi.advanceTimersByTimeAsync(6000);
      await started;

      expect(src.frameSize).toEqual({ width: 320, height: 240 });
      expect(warnings.some((w) => /metadata did not arrive/i.test(w))).toBe(true);
      src.stop();
    } finally {
      vi.useRealTimers();
    }
  });

  it('releases the camera when stop() lands while start() is still awaiting', async () => {
    // A player pressing Escape at the permission prompt is the ordinary case.
    // If the stream arriving after stop() is installed anyway, nothing holds a
    // reference to release it and the camera light stays on.
    let resolveGum: (s: MediaStream) => void = () => {};
    getUserMedia.mockReturnValue(new Promise<MediaStream>((r) => (resolveGum = r)));

    const src = new WebcamFrameSource();
    const started = src.start({ ...OPTS, onWarning: () => {} });

    src.stop();
    resolveGum(makeStream());
    await started;

    expect(src.running).toBe(false);
    expect(tracks[0].stopped).toBe(true);
    expect(rafQueue.length).toBe(0); // and no capture loop was left running
  });

  it('stops every track and drops the element on stop()', async () => {
    const src = new WebcamFrameSource();
    tracks = [makeTrack(), makeTrack()];
    getUserMedia.mockResolvedValue(makeStream());
    await src.start({ ...OPTS, onWarning: () => {} });

    src.stop();
    expect(tracks.every((t) => t.stopped)).toBe(true);
    expect(src.videoElement).toBeNull();
    expect(src.frameSize).toBeNull();
    expect(video.paused).toBe(true);
  });

  it('emits nothing more after stop(), even from an already-queued callback', async () => {
    const src = new WebcamFrameSource();
    const frames: unknown[] = [];
    src.onFrame((f) => frames.push(f));
    await src.start({ ...OPTS, onWarning: () => {} });

    tick();
    const before = frames.length;
    src.stop();
    tick();
    tick();
    expect(frames.length).toBe(before);
  });

  it('never schedules two capture loops at once', async () => {
    const src = new WebcamFrameSource();
    src.onFrame(() => {});
    await src.start({ ...OPTS, onWarning: () => {} });

    // start() is idempotent while running, so a second call must not add a loop.
    await src.start({ ...OPTS, onWarning: () => {} });
    expect(rafQueue.length).toBe(1);
    tick();
    expect(rafQueue.length).toBe(1);
    src.stop();
  });

  describe('requestAnimationFrame capture fallback', () => {
    it('warns that timestamps are approximate', async () => {
      const warnings: string[] = [];
      const src = new WebcamFrameSource();
      await src.start({ ...OPTS, onWarning: (m) => warnings.push(m) });
      expect(warnings.some((w) => /requestVideoFrameCallback is unavailable/i.test(w))).toBe(true);
      src.stop();
    });

    it('does not re-run inference on a frame it has already seen', async () => {
      // rAF fires on the display's cadence, not the camera's. A 30fps camera on
      // a 120Hz display offers each frame ~4 times; emitting all of them means
      // paying for pose inference up to 4x per real frame.
      const src = new WebcamFrameSource();
      const frames: unknown[] = [];
      src.onFrame((f) => frames.push(f));
      await src.start({ ...OPTS, onWarning: () => {} });

      video.currentTime = 0;
      tick(); // first sighting
      video.currentTime = 0.033;
      tick(); // genuine advance — now dedupe is armed
      const armed = frames.length;

      tick();
      tick();
      tick(); // same currentTime three times over
      expect(frames.length).toBe(armed);

      video.currentTime = 0.066;
      tick();
      expect(frames.length).toBe(armed + 1);
      src.stop();
    });

    it('keeps emitting when currentTime never moves, rather than going silent', async () => {
      // Deduping on a value that an engine reports as frozen would capture
      // exactly zero frames. Silence is far worse than duplicates, so the
      // dedupe only arms once an advance has actually been observed.
      const src = new WebcamFrameSource();
      const frames: unknown[] = [];
      src.onFrame((f) => frames.push(f));
      await src.start({ ...OPTS, onWarning: () => {} });

      video.currentTime = 0;
      for (let i = 0; i < 10; i++) tick();
      expect(frames.length).toBe(10);
      src.stop();
    });

    it('keeps emitting when currentTime is not a usable number', async () => {
      const src = new WebcamFrameSource();
      const frames: unknown[] = [];
      src.onFrame((f) => frames.push(f));
      await src.start({ ...OPTS, onWarning: () => {} });

      video.currentTime = NaN;
      for (let i = 0; i < 5; i++) tick();
      expect(frames.length).toBe(5);
      src.stop();
    });

    it('waits for decoded pixels before emitting', async () => {
      const src = new WebcamFrameSource();
      const frames: unknown[] = [];
      src.onFrame((f) => frames.push(f));
      await src.start({ ...OPTS, onWarning: () => {} });

      video.readyState = 1; // HAVE_METADATA — dimensions, but nothing to read
      tick();
      tick();
      expect(frames.length).toBe(0);

      video.readyState = 2; // HAVE_CURRENT_DATA
      tick();
      expect(frames.length).toBe(1);
      src.stop();
    });

    it('lets a frame through periodically if the stream appears stalled', async () => {
      const src = new WebcamFrameSource();
      const frames: unknown[] = [];
      src.onFrame((f) => frames.push(f));
      await src.start({ ...OPTS, onWarning: () => {} });

      video.currentTime = 0;
      tick();
      video.currentTime = 0.033;
      tick();
      const armed = frames.length;

      // Far beyond any plausible display-to-camera ratio: going permanently
      // quiet here would look identical to "the game is ignoring me".
      for (let i = 0; i < 30; i++) tick();
      expect(frames.length).toBe(armed + 1);
      src.stop();
    });
  });

  describe('requestVideoFrameCallback path', () => {
    function withRvfc() {
      const pending: Array<(now: number, meta: { captureTime?: number }) => void> = [];
      let next = 1;
      const cancelledIds = new Set<number>();
      (video as unknown as Record<string, unknown>).requestVideoFrameCallback = (
        cb: (now: number, meta: { captureTime?: number }) => void,
      ) => {
        const id = next++;
        pending.push((now, meta) => {
          if (!cancelledIds.has(id)) cb(now, meta);
        });
        return id;
      };
      (video as unknown as Record<string, unknown>).cancelVideoFrameCallback = (id: number) =>
        cancelledIds.add(id);
      return {
        fire(now: number, meta: { captureTime?: number } = {}) {
          const due = pending.splice(0, pending.length);
          for (const cb of due) cb(now, meta);
        },
        get depth() {
          return pending.length;
        },
      };
    }

    it('is preferred over rAF when the element implements it', async () => {
      const rvfc = withRvfc();
      const warnings: string[] = [];
      const src = new WebcamFrameSource();
      await src.start({ ...OPTS, onWarning: (m) => warnings.push(m) });

      expect(rafQueue.length).toBe(0); // no rAF loop at all
      expect(warnings.some((w) => /requestVideoFrameCallback is unavailable/.test(w))).toBe(false);
      expect(rvfc.depth).toBe(1);
      src.stop();
    });

    it('uses captureTime when the source provides one, and now when it does not', async () => {
      const rvfc = withRvfc();
      const src = new WebcamFrameSource();
      const stamps: number[] = [];
      src.onFrame((_f, t) => stamps.push(t));
      await src.start({ ...OPTS, onWarning: () => {} });

      rvfc.fire(1000, { captureTime: 987 });
      rvfc.fire(2000, {}); // captureTime is optional in the spec
      expect(stamps).toEqual([987, 2000]);
      src.stop();
    });

    it('re-arms exactly once per frame', async () => {
      const rvfc = withRvfc();
      const src = new WebcamFrameSource();
      src.onFrame(() => {});
      await src.start({ ...OPTS, onWarning: () => {} });

      for (let i = 0; i < 5; i++) {
        rvfc.fire(i * 16);
        expect(rvfc.depth).toBe(1); // never 0 (stalled) and never 2 (doubled)
      }
      src.stop();
    });

    it('stops re-arming when a subscriber calls stop() mid-frame', async () => {
      const rvfc = withRvfc();
      const src = new WebcamFrameSource();
      src.onFrame(() => src.stop());
      await src.start({ ...OPTS, onWarning: () => {} });

      rvfc.fire(16);
      expect(rvfc.depth).toBe(0);
      expect(src.running).toBe(false);
      src.stop();
    });

    it('emits nothing after stop()', async () => {
      const rvfc = withRvfc();
      const src = new WebcamFrameSource();
      const frames: unknown[] = [];
      src.onFrame((f) => frames.push(f));
      await src.start({ ...OPTS, onWarning: () => {} });

      src.stop();
      rvfc.fire(16);
      expect(frames.length).toBe(0);
    });

    it('does not assume cancelVideoFrameCallback exists just because the requester does', async () => {
      const rvfc = withRvfc();
      delete (video as unknown as Record<string, unknown>).cancelVideoFrameCallback;
      const src = new WebcamFrameSource();
      src.onFrame(() => {});
      await src.start({ ...OPTS, onWarning: () => {} });

      expect(() => src.stop()).not.toThrow();
      rvfc.fire(16);
      expect(src.running).toBe(false);
    });
  });
});
