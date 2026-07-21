import { SpatialBinder, type PlayerBinder, type SpatialBinderConfig } from './binder';
import { Calibration } from './calibration';
import { WebcamFrameSource, type FrameSource, type FrameSourceOptions } from './frame-source';
import { AdaptivePacer, type PacerConfig } from './pacer';
import { MoveNetMultiPoseTracker, type MoveNetTrackerConfig, type PoseTracker } from './pose-tracker';
import { SwingRecognizer, type GestureRecognizer } from './recognizers/swing';
import type { BoundPerson, GestureEvent, Person } from './types';

export interface WibblyInputConfig {
  source?: FrameSource;
  tracker?: PoseTracker;
  /**
   * Config for the DEFAULT tracker. Ignored when `tracker` is supplied — you
   * configured that one yourself. This exists so a consumer can point the
   * model at a same-origin copy (`modelUrl`) without having to name
   * MoveNet, which would defeat the seam.
   */
  trackerConfig?: MoveNetTrackerConfig;
  binder?: PlayerBinder;
  recognizers?: GestureRecognizer[];
  calibration?: Calibration;
  pacer?: Partial<PacerConfig>;
  binderConfig?: SpatialBinderConfig;
  frame?: Partial<FrameSourceOptions>;
  /** Called for every gesture any recognizer emits. */
  onGesture?: (event: GestureEvent) => void;
  /** Called once per processed frame with the bound skeletons — for preview rendering. */
  onPeople?: (people: BoundPerson[], tCapture: number) => void;
  onError?: (error: unknown) => void;
}

export interface PipelineStats {
  inferenceMs: number | null;
  targetFps: number;
  processedFrames: number;
  droppedFrames: number;
  peopleLastFrame: number;
}

/**
 * Wires the seams together: FrameSource → PoseTracker → PlayerBinder →
 * GestureRecognizers → callbacks.
 *
 * Every part is swappable; the defaults are the ones §3/§4 specify. Games
 * consume this and never name a model, a runtime, or a vendor.
 */
export class WibblyInput {
  readonly source: FrameSource;
  readonly tracker: PoseTracker;
  readonly binder: PlayerBinder;
  readonly calibration: Calibration;
  readonly pacer: AdaptivePacer;
  recognizers: GestureRecognizer[];

  private unsubscribe: (() => void) | null = null;
  private busy = false;
  private started = false;
  /**
   * Bumped by every start() and every stop() — same pattern as, and for the
   * same reason as, `WebcamFrameSource`'s own `generation` counter (see its
   * doc comment). `start()` here awaits tracker init AND camera acquisition
   * before it does anything observable; without this guard, a `stop()` that
   * lands in either gap is silently overwritten the moment the awaited work
   * resolves — the camera gets opened (or the tracker left initialized)
   * *after* the consumer was told it was off, with nothing left holding a
   * reference to turn it back off. Every await in start() is followed by a
   * cancellation check.
   */
  private generation = 0;
  private processed = 0;
  private dropped = 0;
  private lastPeopleCount = 0;
  private gestureHandlers = new Set<(e: GestureEvent) => void>();
  private peopleHandlers = new Set<(p: BoundPerson[], t: number) => void>();
  private errorHandler?: (e: unknown) => void;
  private frameOpts: Partial<FrameSourceOptions>;

  constructor(config: WibblyInputConfig = {}) {
    this.source = config.source ?? new WebcamFrameSource();
    this.tracker = config.tracker ?? new MoveNetMultiPoseTracker(config.trackerConfig);
    this.calibration = config.calibration ?? new Calibration();
    this.binder = config.binder ?? new SpatialBinder(config.binderConfig);
    this.pacer = new AdaptivePacer(config.pacer);
    this.frameOpts = config.frame ?? {};
    this.recognizers =
      config.recognizers ?? [
        // Handedness is resolved live from Calibration, so a player flipping
        // their setting takes effect on the very next frame. This is what
        // replaces the `isRightHanded = true` hardcode.
        new SwingRecognizer({ handedness: (id) => this.calibration.handednessFor(id) }),
      ];

    if (config.onGesture) this.gestureHandlers.add(config.onGesture);
    if (config.onPeople) this.peopleHandlers.add(config.onPeople);
    this.errorHandler = config.onError;
  }

  onGesture(cb: (event: GestureEvent) => void): () => void {
    this.gestureHandlers.add(cb);
    return () => this.gestureHandlers.delete(cb);
  }

  onPeople(cb: (people: BoundPerson[], tCapture: number) => void): () => void {
    this.peopleHandlers.add(cb);
    return () => this.peopleHandlers.delete(cb);
  }

  get stats(): PipelineStats {
    return {
      inferenceMs: this.pacer.inferenceMs,
      targetFps: this.pacer.targetFps,
      processedFrames: this.processed,
      droppedFrames: this.dropped,
      peopleLastFrame: this.lastPeopleCount,
    };
  }

  /** The backing <video>, if the source exposes one, for consumer-owned preview. */
  get videoElement(): HTMLVideoElement | null {
    const s = this.source as WebcamFrameSource;
    return typeof s.videoElement !== 'undefined' ? s.videoElement : null;
  }

  async start(): Promise<void> {
    if (this.started) return;
    const gen = ++this.generation;
    const cancelled = () => this.generation !== gen;

    await this.tracker.init();
    if (cancelled()) {
      // stop() ran while we were still initializing the tracker. Dispose
      // defensively — stop() already called dispose() once, but init() may
      // have raced past that and finished afterward, leaving a live tracker
      // nothing else will ever clean up.
      this.tracker.dispose();
      return;
    }

    await this.source.start({ width: 640, height: 480, fps: 30, ...this.frameOpts });
    if (cancelled()) {
      // The camera may have JUST been acquired by the await above. This is
      // the exact leak this guard exists for: release it immediately rather
      // than leaving the capture light on with nothing holding a reference.
      this.source.stop();
      this.tracker.dispose();
      return;
    }

    this.unsubscribe = this.source.onFrame((frame, tCapture) => {
      void this.handleFrame(frame, tCapture);
    });
    this.started = true;
  }

  private async handleFrame(frame: Parameters<PoseTracker['estimate']>[0], tCapture: number): Promise<void> {
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();

    // Re-entrancy guard: never queue a second inference behind an unfinished
    // one. Without this a slow device builds an unbounded backlog and input
    // latency grows without bound.
    if (this.busy || !this.pacer.shouldProcess(now)) {
      this.dropped += 1;
      return;
    }

    this.busy = true;
    this.pacer.begin(now);
    const t0 = now;

    try {
      const people: Person[] = await this.tracker.estimate(frame);
      const bound = this.binder.bind(people, tCapture);
      this.lastPeopleCount = bound.length;
      this.processed += 1;

      for (const recognizer of this.recognizers) {
        const events = recognizer.feed(bound, tCapture);
        for (const event of events) {
          for (const handler of this.gestureHandlers) {
            try {
              handler(event);
            } catch (err) {
              this.reportError(err);
            }
          }
        }
      }

      for (const handler of this.peopleHandlers) {
        try {
          handler(bound, tCapture);
        } catch (err) {
          this.reportError(err);
        }
      }
    } catch (err) {
      this.reportError(err);
    } finally {
      const t1 = typeof performance !== 'undefined' ? performance.now() : Date.now();
      this.pacer.record(t1 - t0);
      this.busy = false;
    }
  }

  private reportError(err: unknown): void {
    if (this.errorHandler) this.errorHandler(err);
    else console.error('[wibbly-input]', err);
  }

  stop(): void {
    // Invalidate any start() still in flight FIRST, so its post-await checks
    // see the change no matter which of its two awaits it is currently in.
    this.generation += 1;
    this.unsubscribe?.();
    this.unsubscribe = null;
    this.source.stop();
    this.tracker.dispose();
    this.binder.reset();
    for (const r of this.recognizers) r.reset();
    // Deliberately NOT clearing gestureHandlers/peopleHandlers: those are the
    // caller's own subscriptions (including the constructor's `onGesture`/
    // `onPeople`, which only ever run once), not session state. Wiping them
    // here would silently unsubscribe a consumer on every stop() with no way
    // to tell — and would break the ordinary start() → stop() → start()
    // retry a "Try again" button depends on, since the SAME instance is
    // reused and nothing re-registers the original callback.
    this.started = false;
  }
}
