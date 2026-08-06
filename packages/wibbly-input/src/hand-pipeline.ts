import { WebcamFrameSource, type FrameSource, type FrameSourceOptions } from './frame-source';
import { HandLandmarkTracker, type HandTracker, type HandTrackerConfig } from './hand-tracker';
import { AdaptivePacer, type PacerConfig } from './pacer';
import type { HandGestureRecognizer } from './recognizers/hand-recognizer';
import { PinchRecognizer } from './recognizers/pinch';
import { PointRecognizer } from './recognizers/point';
import type { BoundHand, GestureEvent, Hand, PlayerId } from './types';

export interface HandInputConfig {
  source?: FrameSource;
  tracker?: HandTracker;
  /** Config for the DEFAULT tracker. Ignored when `tracker` is supplied. */
  trackerConfig?: HandTrackerConfig;
  /**
   * Assigns a stable `PlayerId` to each raw `Hand` a frame produces, turning
   * it into a `BoundHand` the recognizers below can key state on.
   *
   * There is no hand equivalent of `SpatialBinder` in this package yet (see
   * `recognizers/pinch.ts`'s own doc comment) — a real multi-person hand
   * binder is future work, not something this constructor can paper over.
   * The default below is exactly right for the common case this seam ships
   * for today: ONE local player using one or both of their own hands. Both
   * of that player's hands get the same fixed `playerId`; `PinchRecognizer`/
   * `PointRecognizer` already key their own state on `(playerId,
   * handedness)`, so the player's left and right hands are still tracked
   * fully independently — only a SECOND person sharing the same camera would
   * be indistinguishable from the first under this default, and a caller
   * with that requirement must supply its own `assignPlayerId`.
   */
  assignPlayerId?: (hand: Hand, index: number) => PlayerId;
  recognizers?: HandGestureRecognizer[];
  pacer?: Partial<PacerConfig>;
  frame?: Partial<FrameSourceOptions>;
  /** Called for every gesture any recognizer emits. */
  onGesture?: (event: GestureEvent) => void;
  /** Called once per processed frame with the bound hands — for preview rendering. */
  onHands?: (hands: BoundHand[], tCapture: number) => void;
  onError?: (error: unknown) => void;
}

export interface HandPipelineStats {
  inferenceMs: number | null;
  targetFps: number;
  processedFrames: number;
  droppedFrames: number;
  handsLastFrame: number;
}

/** Default `assignPlayerId`: one local player, both hands. */
export const SINGLE_LOCAL_PLAYER: PlayerId = 'player_1';

function defaultAssignPlayerId(): PlayerId {
  return SINGLE_LOCAL_PLAYER;
}

/**
 * Hand-only analogue of `WibblyInput` (pipeline.ts): FrameSource →
 * HandTracker → HandGestureRecognizers → callbacks. Deliberately a SEPARATE
 * class rather than widening `WibblyInput` itself to also carry a
 * `HandTracker` — the two trackers (`PoseTracker`/`HandTracker`) have
 * different result shapes (`Person`/`Hand`) and different recognizer
 * families (`GestureRecognizer`/`HandGestureRecognizer`), and a game that
 * only wants hands (this one) should not have to construct or reason about
 * a `PoseTracker`/`SpatialBinder` it never uses. A game that genuinely wants
 * BOTH body pose and hands running against the same camera constructs one
 * `WibblyInput` and one `HandInput` side by side; nothing here fights that.
 *
 * Camera permission is requested only inside `start()`, exactly like
 * `WibblyInput` — never at construction or import time.
 */
export class HandInput {
  readonly source: FrameSource;
  readonly tracker: HandTracker;
  readonly pacer: AdaptivePacer;
  readonly assignPlayerId: (hand: Hand, index: number) => PlayerId;
  recognizers: HandGestureRecognizer[];

  private unsubscribe: (() => void) | null = null;
  private busy = false;
  private started = false;
  /** Same start()/stop() race guard as `WibblyInput.generation` — see its doc comment. */
  private generation = 0;
  private processed = 0;
  private dropped = 0;
  private lastHandsCount = 0;
  private gestureHandlers = new Set<(e: GestureEvent) => void>();
  private handsHandlers = new Set<(h: BoundHand[], t: number) => void>();
  private errorHandler?: (e: unknown) => void;
  private frameOpts: Partial<FrameSourceOptions>;

  constructor(config: HandInputConfig = {}) {
    this.source = config.source ?? new WebcamFrameSource();
    this.tracker = config.tracker ?? new HandLandmarkTracker(config.trackerConfig);
    this.pacer = new AdaptivePacer(config.pacer);
    this.assignPlayerId = config.assignPlayerId ?? defaultAssignPlayerId;
    this.frameOpts = config.frame ?? {};
    this.recognizers = config.recognizers ?? [new PinchRecognizer(), new PointRecognizer()];

    if (config.onGesture) this.gestureHandlers.add(config.onGesture);
    if (config.onHands) this.handsHandlers.add(config.onHands);
    if (config.onError) this.errorHandler = config.onError;
  }

  onGesture(cb: (event: GestureEvent) => void): () => void {
    this.gestureHandlers.add(cb);
    return () => this.gestureHandlers.delete(cb);
  }

  onHands(cb: (hands: BoundHand[], tCapture: number) => void): () => void {
    this.handsHandlers.add(cb);
    return () => this.handsHandlers.delete(cb);
  }

  get stats(): HandPipelineStats {
    return {
      inferenceMs: this.pacer.inferenceMs,
      targetFps: this.pacer.targetFps,
      processedFrames: this.processed,
      droppedFrames: this.dropped,
      handsLastFrame: this.lastHandsCount,
    };
  }

  /** The backing <video>, if the source exposes one, for consumer-owned preview. */
  get videoElement(): HTMLVideoElement | null {
    const s = this.source as WebcamFrameSource;
    return typeof s.videoElement !== 'undefined' ? s.videoElement : null;
  }

  get running(): boolean {
    return this.started;
  }

  async start(): Promise<void> {
    if (this.started) return;
    const gen = ++this.generation;
    const cancelled = () => this.generation !== gen;

    await this.tracker.init();
    if (cancelled()) {
      this.tracker.dispose();
      return;
    }

    await this.source.start({ width: 640, height: 480, fps: 30, ...this.frameOpts });
    if (cancelled()) {
      this.source.stop();
      this.tracker.dispose();
      return;
    }

    this.unsubscribe = this.source.onFrame((frame, tCapture) => {
      void this.handleFrame(frame, tCapture);
    });
    this.started = true;
  }

  private async handleFrame(frame: Parameters<HandTracker['estimate']>[0], tCapture: number): Promise<void> {
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();

    if (this.busy || !this.pacer.shouldProcess(now)) {
      this.dropped += 1;
      return;
    }

    this.busy = true;
    this.pacer.begin(now);
    const t0 = now;

    try {
      const hands: Hand[] = await this.tracker.estimate(frame);
      const bound: BoundHand[] = hands.map((hand, index) => ({
        ...hand,
        playerId: this.assignPlayerId(hand, index),
      }));
      this.lastHandsCount = bound.length;
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

      for (const handler of this.handsHandlers) {
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
    this.generation += 1;
    this.unsubscribe?.();
    this.unsubscribe = null;
    this.source.stop();
    this.tracker.dispose();
    for (const r of this.recognizers) r.reset();
    // Deliberately NOT clearing gestureHandlers/handsHandlers — same reasoning
    // as WibblyInput.stop(): those are the caller's own subscriptions, not
    // session state, and start()→stop()→start() must not silently unsubscribe
    // a consumer that never re-registered its callback.
    this.started = false;
  }
}
