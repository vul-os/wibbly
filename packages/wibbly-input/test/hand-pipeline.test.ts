import { describe, expect, it } from 'vitest';
import { HandInput, SINGLE_LOCAL_PLAYER } from '../src/hand-pipeline';
import { PinchRecognizer } from '../src/recognizers/pinch';
import { PointRecognizer } from '../src/recognizers/point';
import { makeHand, makePointingHand, pinchOverride } from './fixtures';
import type { FrameSource, FrameSourceOptions } from '../src/frame-source';
import type { HandTracker } from '../src/hand-tracker';
import type { TrackerCapabilities } from '../src/pose-tracker';
import type { Frame, GestureEvent, Hand } from '../src/types';

/** A FrameSource driven by the test rather than by a camera — mirrors pipeline.test.ts's ScriptedFrameSource. */
class ScriptedFrameSource implements FrameSource {
  private cbs = new Set<(f: Frame, t: number) => void>();
  running = false;
  frameSize = { width: 640, height: 480 };
  started: FrameSourceOptions | null = null;
  waitIdle: (() => Promise<void>) | null = null;

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
  async emit(t: number): Promise<void> {
    for (const cb of this.cbs) cb({} as Frame, t);
    if (this.waitIdle) await this.waitIdle();
    else await new Promise((r) => setTimeout(r, 0));
  }
}

/** A HandTracker that returns whatever the test queues — no MediaPipe/Wasm/GPU involved. */
class ScriptedHandTracker implements HandTracker {
  maxHands = 2;
  capabilities: TrackerCapabilities = { body: false, hands: true, face: false };
  next: Hand[] = [];
  initCalls = 0;
  disposed = false;

  async init(): Promise<void> {
    this.initCalls += 1;
  }
  async estimate(): Promise<Hand[]> {
    return this.next;
  }
  dispose(): void {
    this.disposed = true;
  }
}

function harness() {
  const source = new ScriptedFrameSource();
  const tracker = new ScriptedHandTracker();
  const gestures: GestureEvent[] = [];

  const input = new HandInput({
    source,
    tracker,
    // Genuinely unthrottled — same reasoning as pipeline.test.ts's harness().
    pacer: { maxFps: 100000, minFps: 100000, dutyCycle: 1 },
    onGesture: (e) => gestures.push(e),
  });

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

  return { source, tracker, input, gestures };
}

describe('HandInput pipeline', () => {
  it('initialises the tracker and starts the source', async () => {
    const h = harness();
    await h.input.start();
    expect(h.tracker.initCalls).toBe(1);
    expect(h.source.running).toBe(true);
    expect(h.source.started).toMatchObject({ width: 640, height: 480, fps: 30 });
  });

  it('carries a pinch all the way from hand landmarks to a gesture event, tagged with the single local player id', async () => {
    const h = harness();
    await h.input.start();

    // Open hand, not pinching yet.
    h.tracker.next = [makeHand({ cx: 0.5, cy: 0.5, scale: 0.15 })];
    await h.source.emit(1000);

    // Now pinching (fingertips touching) — DEFAULT_PINCH_CONFIG.enterFrames
    // is 2, so this needs to hold for at least two frames.
    h.tracker.next = [
      makeHand({ cx: 0.5, cy: 0.5, scale: 0.15, overrides: pinchOverride(0.5, 0.5, 0.15) }),
    ];
    await h.source.emit(1033);
    await h.source.emit(1066);

    const starts = h.gestures.filter((g) => g.kind === 'pinch' && g.detail?.phase === 'start');
    expect(starts).toHaveLength(1);
    expect(starts[0].playerId).toBe(SINGLE_LOCAL_PLAYER);
  });

  it('tracks both of one local player\'s hands independently by handedness', async () => {
    const h = harness();
    await h.input.start();

    const left = makeHand({ cx: 0.3, cy: 0.5, scale: 0.15, handedness: 'left', overrides: pinchOverride(0.3, 0.5, 0.15) });
    const right = makeHand({ cx: 0.7, cy: 0.5, scale: 0.15, handedness: 'right' }); // open, not pinching

    for (let i = 0; i < 2; i++) {
      h.tracker.next = [left, right];
      await h.source.emit(1000 + i * 33);
    }

    const starts = h.gestures.filter((g) => g.kind === 'pinch' && g.detail?.phase === 'start');
    expect(starts).toHaveLength(1);
    expect(starts[0].detail?.hand).toBe('left');
    // Both hands carry the SAME playerId (one local player) — only
    // `detail.hand` distinguishes them, per HandInputConfig's own doc.
    expect(starts[0].playerId).toBe(SINGLE_LOCAL_PLAYER);
  });

  it('carries a point gesture through with the aim ray in detail.origin/vector', async () => {
    const h = harness();
    await h.input.start();

    for (let i = 0; i < 2; i++) {
      h.tracker.next = [makePointingHand({ cx: 0.5, cy: 0.5, scale: 0.15 })];
      await h.source.emit(1000 + i * 33);
    }

    const starts = h.gestures.filter((g) => g.kind === 'point' && g.detail?.phase === 'start');
    expect(starts).toHaveLength(1);
    expect(starts[0].vector).toBeDefined();
    expect(starts[0].detail?.origin).toBeDefined();
  });

  it('default recognizers are pinch + point, with no pose/body recognizer involved', async () => {
    const h = harness();
    expect(h.input.recognizers.map((r) => r.constructor.name).sort()).toEqual(
      [PinchRecognizer.name, PointRecognizer.name].sort(),
    );
  });

  it('a custom assignPlayerId can distinguish two people sharing one camera', async () => {
    const source = new ScriptedFrameSource();
    const tracker = new ScriptedHandTracker();
    const gestures: GestureEvent[] = [];
    let seen = 0;

    const input = new HandInput({
      source,
      tracker,
      pacer: { maxFps: 100000, minFps: 100000, dutyCycle: 1 },
      // Left half of the frame -> player_1, right half -> player_2. A real
      // multi-person hand binder does not exist in this package yet (see
      // hand-pipeline.ts's doc comment); this is the documented workaround.
      assignPlayerId: (hand) => (hand.landmarks[0].x < 0.5 ? 'player_1' : 'player_2'),
      onGesture: (e) => gestures.push(e),
    });
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

    await input.start();
    for (let i = 0; i < 2; i++) {
      tracker.next = [
        makeHand({ cx: 0.2, cy: 0.5, scale: 0.15, overrides: pinchOverride(0.2, 0.5, 0.15) }),
        makeHand({ cx: 0.8, cy: 0.5, scale: 0.15, overrides: pinchOverride(0.8, 0.5, 0.15) }),
      ];
      await source.emit(1000 + i * 33);
    }

    expect(new Set(gestures.map((g) => g.playerId))).toEqual(new Set(['player_1', 'player_2']));
  });

  it('never opens the camera at construction — only start() touches the source', () => {
    const source = new ScriptedFrameSource();
    const tracker = new ScriptedHandTracker();
    const unstarted = new HandInput({ source, tracker });
    expect(unstarted.running).toBe(false);
    expect(source.started).toBeNull();
    expect(source.running).toBe(false);
    expect(tracker.initCalls).toBe(0);
  });

  it('stop() tears down source, tracker and recognizer state', async () => {
    const h = harness();
    await h.input.start();
    h.tracker.next = [makeHand({ cx: 0.5, cy: 0.5, scale: 0.15, overrides: pinchOverride(0.5, 0.5, 0.15) })];
    await h.source.emit(1000);
    await h.source.emit(1033);

    h.input.stop();
    expect(h.source.running).toBe(false);
    expect(h.tracker.disposed).toBe(true);

    // A fresh start()/emit() after stop() must not resume mid-pinch state
    // from before — reset() on every recognizer is what guarantees that.
    await h.input.start();
    h.tracker.next = [makeHand({ cx: 0.5, cy: 0.5, scale: 0.15, overrides: pinchOverride(0.5, 0.5, 0.15) })];
    const gesturesBefore = h.gestures.length;
    await h.source.emit(2000);
    const holdOrStartAfterRestart = h.gestures
      .slice(gesturesBefore)
      .filter((g) => g.kind === 'pinch' && g.detail?.phase === 'hold');
    expect(holdOrStartAfterRestart).toHaveLength(0); // needs enterFrames=2 again, not already-active
  });

  it('start()/stop() race: never starts the camera if stop() lands while tracker.init() is still pending', async () => {
    const h = harness();
    let releaseInit: (() => void) | null = null;
    h.tracker.init = () =>
      new Promise<void>((resolve) => {
        releaseInit = resolve;
      });

    const startPromise = h.input.start();
    await new Promise((r) => setTimeout(r, 0));

    h.input.stop();
    releaseInit!();
    await startPromise;

    expect(h.source.started).toBeNull();
    expect(h.source.running).toBe(false);
    expect(h.tracker.disposed).toBe(true);
  });

  it('never touches the DOM — this suite runs in the node vitest environment', async () => {
    expect(typeof globalThis.document).toBe('undefined');
    const h = harness();
    await h.input.start();
    h.tracker.next = [boundHandFixture()];
    await h.source.emit(1000);
    await h.source.emit(1033);
    expect(h.gestures.length).toBeGreaterThan(0);
  });
});

function boundHandFixture(): Hand {
  return makeHand({ cx: 0.5, cy: 0.5, scale: 0.15, overrides: pinchOverride(0.5, 0.5, 0.15) });
}
