import { describe, expect, it } from 'vitest';
import { WibblyInput } from '../src/pipeline';
import { SpatialBinder, equalClaimZones } from '../src/binder';
import { SwingRecognizer } from '../src/recognizers/swing';
import { Calibration, MemoryStorage } from '../src/calibration';
import { personWithWrist } from './fixtures';
import type { FrameSource, FrameSourceOptions } from '../src/frame-source';
import type { PoseTracker } from '../src/pose-tracker';
import type { Frame, Person } from '../src/types';

/** A FrameSource driven by the test rather than by a camera. */
class ScriptedFrameSource implements FrameSource {
  private cbs = new Set<(f: Frame, t: number) => void>();
  running = false;
  frameSize = { width: 640, height: 480 };
  started: FrameSourceOptions | null = null;

  async start(opts: FrameSourceOptions): Promise<void> {
    this.started = opts;
    this.running = true;
  }
  stop(): void {
    this.running = false;
    this.cbs.clear();
  }
  onFrame(cb: (f: Frame, t: number) => void): () => void {
    this.cbs.add(cb);
    return () => this.cbs.delete(cb);
  }
  /**
   * Emit a frame and wait until the pipeline has actually finished with it.
   *
   * A single macrotask tick is NOT enough: the pipeline's re-entrancy guard
   * drops any frame that arrives while inference is still outstanding, so a
   * racy harness silently loses frames and the recognizer never accumulates
   * enough history. `waitIdle` is supplied by the harness.
   */
  waitIdle: (() => Promise<void>) | null = null;

  async emit(t: number): Promise<void> {
    for (const cb of this.cbs) cb({} as Frame, t);
    if (this.waitIdle) await this.waitIdle();
    else await new Promise((r) => setTimeout(r, 0));
  }
}

/** A PoseTracker that returns whatever the test queues, no model involved. */
class ScriptedTracker implements PoseTracker {
  maxPeople = 6;
  capabilities = { body: true, hands: false, face: false };
  next: Person[] = [];
  initCalls = 0;
  disposed = false;

  async init(): Promise<void> {
    this.initCalls += 1;
  }
  async estimate(): Promise<Person[]> {
    return this.next;
  }
  dispose(): void {
    this.disposed = true;
  }
}

function harness() {
  const source = new ScriptedFrameSource();
  const tracker = new ScriptedTracker();
  const calibration = new Calibration(new MemoryStorage());
  const gestures: Array<{ playerId: string; kind: string; detail?: Record<string, unknown> }> = [];

  const input = new WibblyInput({
    source,
    tracker,
    calibration,
    binder: new SpatialBinder({ maxPlayers: 2, claimZones: equalClaimZones(2) }),
    recognizers: [
      new SwingRecognizer({ handedness: (id) => calibration.handednessFor(id) }),
    ],
    // Genuinely unthrottled: min and max are pinned together so the clamp
    // leaves no room for the measured-inference term to widen the interval.
    // (With minFps: 1 the pacer legitimately paced frames out during the test,
    // which is the pacer working, not a bug — but it makes cadence the test's
    // variable rather than the thing under test.)
    pacer: { maxFps: 100000, minFps: 100000, dutyCycle: 1 },
    onGesture: (e) => gestures.push(e),
  });

  // Wait until the frame just emitted has been fully processed (or provably
  // dropped), so frame delivery in tests is deterministic.
  let seen = 0;
  source.waitIdle = async () => {
    for (let i = 0; i < 50; i++) {
      await new Promise((r) => setTimeout(r, 0));
      const done = input.stats.processedFrames + input.stats.droppedFrames;
      if (done > seen) {
        seen = done;
        return;
      }
    }
  };

  return { source, tracker, calibration, input, gestures };
}

/** Sweep a wrist across the frame over N frames, driving the whole pipeline. */
async function sweep(
  h: ReturnType<typeof harness>,
  cx: number,
  side: 'left' | 'right',
  from: { x: number; y: number },
  to: { x: number; y: number },
  startT: number,
  samples = 3,
) {
  for (let i = 0; i < samples; i++) {
    const f = samples === 1 ? 0 : i / (samples - 1);
    h.tracker.next = [
      personWithWrist(cx, side, {
        x: from.x + (to.x - from.x) * f,
        y: from.y + (to.y - from.y) * f,
      }),
    ];
    await h.source.emit(startT + i * 33);
  }
}

describe('WibblyInput pipeline', () => {
  it('initialises the tracker and starts the source', async () => {
    const h = harness();
    await h.input.start();
    expect(h.tracker.initCalls).toBe(1);
    expect(h.source.running).toBe(true);
    expect(h.source.started).toMatchObject({ width: 640, height: 480, fps: 30 });
  });

  it('carries a swing all the way from skeletons to a gesture event', async () => {
    const h = harness();
    await h.input.start();
    // Left half of the frame → claims player_1.
    await sweep(h, 0.25, 'right', { x: 0.15, y: 0.5 }, { x: 0.32, y: 0.44 }, 1000);

    expect(h.gestures).toHaveLength(1);
    expect(h.gestures[0]).toMatchObject({ playerId: 'player_1', kind: 'swing' });
    expect(h.gestures[0].detail?.stroke).toBe('forehand');
  });

  it('routes two players on one camera to distinct stable ids', async () => {
    const h = harness();
    await h.input.start();

    for (let i = 0; i < 3; i++) {
      const f = i / 2;
      h.tracker.next = [
        // player_1 on the left, swinging.
        personWithWrist(0.25, 'right', { x: 0.15 + f * 0.17, y: 0.5 - f * 0.06 }),
        // player_2 on the right, standing still.
        personWithWrist(0.75, 'right', { x: 0.68, y: 0.5 }),
      ];
      await h.source.emit(1000 + i * 33);
    }

    expect(h.gestures.map((g) => g.playerId)).toEqual(['player_1']);
  });

  it('applies per-player handedness from Calibration', async () => {
    const h = harness();
    await h.input.start();
    h.calibration.setHandedness('player_1', 'left');

    // Right arm moving does nothing for a left-handed player.
    await sweep(h, 0.25, 'right', { x: 0.15, y: 0.5 }, { x: 0.32, y: 0.44 }, 1000);
    expect(h.gestures).toHaveLength(0);

    // Their left arm does, and reads as a forehand.
    await sweep(h, 0.25, 'left', { x: 0.35, y: 0.5 }, { x: 0.18, y: 0.44 }, 5000);
    expect(h.gestures).toHaveLength(1);
    expect(h.gestures[0].detail?.stroke).toBe('forehand');
  });

  it('reports pacing stats measured from real inference timing', async () => {
    const h = harness();
    await h.input.start();
    await sweep(h, 0.25, 'right', { x: 0.15, y: 0.5 }, { x: 0.32, y: 0.44 }, 1000);
    const stats = h.input.stats;
    expect(stats.processedFrames).toBeGreaterThan(0);
    expect(stats.inferenceMs).not.toBeNull();
    expect(stats.peopleLastFrame).toBe(1);
  });

  it('drops frames instead of queueing when inference is still running', async () => {
    const h = harness();
    const releases: Array<() => void> = [];
    h.tracker.estimate = () =>
      new Promise<Person[]>((resolve) => {
        releases.push(() => resolve([]));
      });

    await h.input.start();
    // Three frames arrive while the first inference is still outstanding.
    for (const n of [1, 2, 3]) await h.source.emit(1000 + n * 10);
    expect(h.input.stats.droppedFrames).toBeGreaterThanOrEqual(2);
    for (const release of releases) release();
  });

  it('surfaces tracker failures to onError without killing the pipeline', async () => {
    const errors: unknown[] = [];
    const source = new ScriptedFrameSource();
    const tracker = new ScriptedTracker();
    const input = new WibblyInput({
      source,
      tracker,
      calibration: new Calibration(new MemoryStorage()),
      pacer: { maxFps: 100000, minFps: 100000, dutyCycle: 1 },
      onError: (e) => errors.push(e),
    });
    await input.start();

    tracker.estimate = async () => {
      throw new Error('inference exploded');
    };
    await source.emit(1000);
    expect(errors).toHaveLength(1);

    // Still alive: a good frame afterwards is processed normally.
    tracker.estimate = async () => [];
    await source.emit(1100);
    expect(input.stats.processedFrames).toBe(1);
  });

  it('stop() tears down source, tracker and binder state', async () => {
    const h = harness();
    await h.input.start();
    await sweep(h, 0.25, 'right', { x: 0.15, y: 0.5 }, { x: 0.32, y: 0.44 }, 1000);
    h.input.stop();

    expect(h.source.running).toBe(false);
    expect(h.tracker.disposed).toBe(true);
    expect(h.input.binder.activePlayers).toHaveLength(0);
  });

  it('never touches the DOM — the whole point of the rewrite', async () => {
    // This suite runs in the `node` vitest environment with no document at all.
    // If any seam reached for document.body the way the old PoseDetector did,
    // these tests could not have run.
    expect(typeof globalThis.document).toBe('undefined');
    const h = harness();
    await h.input.start();
    await sweep(h, 0.25, 'right', { x: 0.15, y: 0.5 }, { x: 0.32, y: 0.44 }, 1000);
    expect(h.gestures).toHaveLength(1);
  });
});
