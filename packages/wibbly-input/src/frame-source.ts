import type { Frame } from './types';

export interface FrameSourceOptions {
  width: number;
  height: number;
  fps: number;
  /** Media device id to pin a specific camera. Optional. */
  deviceId?: string;
  facingMode?: 'user' | 'environment';
  /**
   * Non-fatal problems worth telling a human about: a rejected autoplay, a
   * constraint set that had to be loosened, a missing capture-timestamp API.
   *
   * These are conditions where capture still works (or still might) but the
   * experience is degraded, so throwing would be wrong and silence would be
   * worse. Defaults to `console.warn`.
   */
  onWarning?: (message: string) => void;
}

/**
 * §3.1 seam — where pixels come from.
 *
 * Implementations own their capture loop and push frames to subscribers.
 *
 * NON-NEGOTIABLE: a FrameSource NEVER injects DOM into the document. It may
 * create detached elements it needs internally (a <video> is required to hold
 * a MediaStream), but attaching anything to the page — preview, buttons,
 * styling — is the consumer's job. The old `poseDetection.js` appended its own
 * preview div and a "Hide Camera" button to document.body, which is precisely
 * why it could not be used as a library.
 */
export interface FrameSource {
  start(opts: FrameSourceOptions): Promise<void>;
  stop(): void;
  onFrame(cb: (frame: Frame, tCapture: number) => void): () => void;
  /** Actual negotiated frame dimensions once started (may differ from requested). */
  readonly frameSize: { width: number; height: number } | null;
  readonly running: boolean;
}

const DEFAULTS: FrameSourceOptions = {
  width: 640,
  height: 480,
  fps: 30,
  facingMode: 'user',
};

/* ────────────────────────────────────────────────────────────────────────────
 * getUserMedia constraint handling
 *
 * Written feature-first, never browser-first: nothing below branches on a user
 * agent string. The reason it exists at all is that engines disagree about how
 * much of a constraint set they will honour, and the disagreement is not
 * discoverable ahead of time.
 *
 * The rule that keeps this portable is in the spec itself: in a
 * `MediaTrackConstraintSet`, a **bare value or an `ideal` member is advisory** —
 * the UA picks the closest it can and never fails — whereas `exact` (and `min`
 * / `max`) are **required**, and an unsatisfiable required constraint rejects
 * the whole call with `OverconstrainedError`.
 * (W3C Media Capture and Streams, "Constraints" / SelectSettings algorithm:
 *  https://www.w3.org/TR/mediacapture-streams/#constrainable-interface —
 *  see also MDN "Capabilities, constraints, and settings".)
 *
 * So: we ask with `ideal` everywhere we can, and we keep exactly one required
 * constraint — `deviceId: {exact}` — because "pin *this* camera" has no useful
 * approximate meaning; getting a different camera than the one the player
 * chose is worse than failing. When that fails we drop it and ask again.
 *
 * Known-real divergences this ladder absorbs, without naming a browser in code:
 *
 *   • WebKit has an open bug (bugs.webkit.org #176349, still NEW, reproduced on
 *     iOS) where **bare values throw `OverconstrainedError`** even though the
 *     spec says a bare value is advisory. That is the strongest single reason
 *     the rungs below wrap everything in an explicit `{ideal: …}` rather than
 *     passing bare numbers, and the reason a retry ladder must exist at all
 *     instead of trusting "advisory cannot fail".
 *
 *   • iOS cameras offer only **native capture resolutions**, so an unusual
 *     requested size is unsatisfiable there by construction. Resolution has to
 *     be droppable — rung 4.
 *
 *   • Safari **regenerates `deviceId` on every page load**
 *     (bugs.webkit.org #179220), so a deviceId persisted from a previous
 *     session is not merely stale, it is guaranteed to denote nothing. Ours is
 *     the only `exact` constraint, and that is precisely the failure rung 2
 *     recovers from — by letting the UA choose, which is the right answer for
 *     an id that no longer refers to a camera.
 *
 *   • `frameRate` is the constraint most often unsatisfiable on a camera with
 *     fixed modes, so it is dropped first. (The old WebKit bug about frameRate
 *     and resolution being ignored outright, #179994, is RESOLVED — this rung
 *     is about satisfiability, not about that bug.)
 *
 *   • `facingMode` is meaningful on phones and largely meaningless on a desktop
 *     with one fixed webcam. I could not establish from any authoritative
 *     source how desktop Safari treats it — which is exactly why it stays
 *     advisory and survives to rung 4 rather than being special-cased on a
 *     guess.
 *
 *   • Engines differ on *combinations* that are each individually satisfiable,
 *     which no per-key reasoning predicts — hence a genuinely bare
 *     `{video: true}` at the bottom.
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * The progressively-looser constraint sets to try, in order.
 *
 * Pure and exported so the ladder can be asserted against without a camera,
 * a browser, or a permission prompt.
 */
export function cameraConstraintLadder(opts: FrameSourceOptions): MediaTrackConstraints[] {
  const rungs: MediaTrackConstraints[] = [];

  const size: MediaTrackConstraints = {
    width: { ideal: opts.width },
    height: { ideal: opts.height },
  };
  const facing: MediaTrackConstraints = opts.facingMode ? { facingMode: opts.facingMode } : {};

  // Rung 1 — everything we actually want. deviceId is the only `exact`.
  if (opts.deviceId) {
    rungs.push({ deviceId: { exact: opts.deviceId }, ...size, frameRate: { ideal: opts.fps } });
  }
  // Rung 2 — same wishes, but let the UA choose the camera. Reached either
  // because no deviceId was pinned, or because pinning it was refused.
  rungs.push({ ...facing, ...size, frameRate: { ideal: opts.fps } });
  // Rung 3 — drop frame rate: the mode most likely to be unsatisfiable.
  rungs.push({ ...facing, ...size });
  // Rung 4 — drop resolution too. We can scale; we cannot invent a stream.
  rungs.push({ ...facing });
  // Rung 5 — bare truth. If this fails, the failure is real and not our asking.
  rungs.push({});

  // A `{}` rung is only meaningful once, and `{facingMode: undefined}` collapses
  // into `{}` on desktops — dedupe so we never re-ask an identical question.
  const seen = new Set<string>();
  return rungs.filter((r) => {
    const k = JSON.stringify(r);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

/**
 * True for errors that mean "the human said no" or "this origin may not ask".
 *
 * These must NEVER be retried. Retrying a denial re-prompts (or silently
 * re-fails) and, more importantly, delays the moment the app can fall back to
 * the spacebar — which is a fully supported way to play, not a consolation.
 *
 * Matched on `name`, which is the spec-defined, engine-independent identity of
 * a DOMException; `message` text is not stable across engines and is not used.
 * `SecurityError` is included because some engines report a non-secure or
 * permissions-policy-blocked context that way rather than as NotAllowedError.
 */
export function isPermissionDenial(err: unknown): boolean {
  const name = (err as { name?: unknown } | null)?.name;
  return name === 'NotAllowedError' || name === 'SecurityError' || name === 'PermissionDeniedError';
}

/** True for "your constraints cannot be satisfied" — the retryable case. */
export function isOverconstrained(err: unknown): boolean {
  const name = (err as { name?: unknown } | null)?.name;
  return name === 'OverconstrainedError' || name === 'ConstraintNotSatisfiedError';
}

/**
 * Walk {@link cameraConstraintLadder} until a stream is obtained.
 *
 * Injectable `gum` so this is testable without a browser: the retry policy is
 * the part with the bugs in it, and it should not need a webcam to assert.
 *
 * Stops immediately — no further rungs — on a permission denial, so the app's
 * spacebar fallback triggers promptly with the real error rather than after
 * five pointless prompts.
 */
export async function acquireCameraStream(
  gum: (c: MediaStreamConstraints) => Promise<MediaStream>,
  opts: FrameSourceOptions,
  onWarning?: (message: string) => void,
): Promise<MediaStream> {
  const ladder = cameraConstraintLadder(opts);
  let lastError: unknown = null;

  for (let i = 0; i < ladder.length; i++) {
    const video = ladder[i];
    try {
      const stream = await gum({ video: Object.keys(video).length ? video : true, audio: false });
      if (i > 0) {
        onWarning?.(
          `Camera started on a reduced constraint set (attempt ${i + 1} of ${ladder.length}). ` +
            `The requested ${opts.width}x${opts.height}@${opts.fps} was not available; ` +
            `using whatever the device offered instead.`,
        );
      }
      return stream;
    } catch (err) {
      lastError = err;
      // A denial is a final answer. Anything else — overconstrained, a device
      // busy in another tab, a transient hardware error — is worth one more,
      // looser ask, because the next rung asks for strictly less.
      if (isPermissionDenial(err)) throw err;
      if (i === ladder.length - 1) throw err;
    }
  }

  /* c8 ignore next — unreachable: the loop always returns or throws. */
  // `lastError` is caught as `unknown` (TypeScript cannot prove getUserMedia
  // only ever throws Error instances), so only-throw-error correctly flags a
  // bare `throw lastError`. Re-throw it as-is when it genuinely is an Error
  // (preserving its identity/stack — the whole point of this rethrow, not
  // wrapping every camera failure in a fresh Error that hides the real one),
  // and fall back to a synthesized Error only for the non-Error/no-error case.
  throw lastError instanceof Error
    ? lastError
    : new Error('WebcamFrameSource: could not acquire a camera stream');
}

/* ────────────────────────────────────────────────────────────────────────────
 * <video> element setup
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * Configure a detached <video> to hold a camera stream and play unattended.
 *
 * Exported for testing. Every property here is also set as an **attribute**,
 * deliberately:
 *
 *   • `playsinline` — REQUIRED on iOS since iOS 10. Without it an iPhone takes
 *     the video fullscreen on play instead of rendering inline, which does not
 *     degrade the preview so much as hijack the page.
 *     (https://webkit.org/blog/6784/new-video-policies-for-ios/)
 *   • `webkit-playsinline` — the pre-standard spelling, dating to iPhoneOS 4.0
 *     and per WebKit's own write-up needed only during the iOS 10 betas. It is
 *     **not needed in 2026** and I am not pretending otherwise; it is set
 *     because an unknown attribute is inert everywhere, so the cost is zero and
 *     the floor drops for anyone on genuinely ancient WebKit.
 *   • `muted` — autoplay without a user gesture requires no audible audio.
 *     Set as both the IDL property and (via `defaultMuted`) the content
 *     attribute, because the attribute is what reflects into markup state.
 *   • `autoplay` — advisory; we call play() explicitly regardless.
 *
 * A camera MediaStream has no audio track here at all (`audio: false`), which
 * satisfies the autoplay rule on its own. `srcObject`-backed capture is also
 * the *most* privileged case in WebKit's policy — a page already capturing is
 * allowed to play its own self-view — so this should virtually always start.
 * "Virtually always" is why play() is still called explicitly and its rejection
 * still handled.
 */
export function configureVideoElement(el: HTMLVideoElement): void {
  el.playsInline = true;
  el.muted = true;
  el.autoplay = true;
  el.defaultMuted = true;
  try {
    el.setAttribute('playsinline', '');
    el.setAttribute('webkit-playsinline', '');
    el.setAttribute('muted', '');
    el.setAttribute('autoplay', '');
  } catch {
    /* a stub element in a test may not implement setAttribute; properties above suffice */
  }
}

/**
 * Wait until the element knows its dimensions, without deadlocking.
 *
 * Three things make the naive `await once('loadedmetadata')` wrong:
 *
 *  1. **The event may have already fired.** `srcObject` assignment can resolve
 *     metadata synchronously-ish, and a listener added afterwards then waits
 *     forever. So `readyState` is checked FIRST — it is the state, the event is
 *     only the edge.
 *  2. **Some engines do not surface metadata until playback is actually
 *     requested.** If we `await` metadata *before* calling `play()`, and
 *     `play()` is what unblocks metadata, that is a deadlock. The caller
 *     therefore kicks off `play()` before awaiting this.
 *  3. **It may simply never fire.** A timeout that resolves (not rejects) means
 *     a stalled metadata event degrades to "start anyway with the track's
 *     reported size" rather than to a permanently hung start().
 */
export function waitForVideoMetadata(el: HTMLVideoElement, timeoutMs = 5000): Promise<boolean> {
  // HAVE_METADATA. Numeric literal rather than HTMLMediaElement.HAVE_METADATA
  // because that constant is not present on non-DOM globals (tests, workers).
  if (el.readyState >= 1) return Promise.resolve(true);

  return new Promise<boolean>((resolve) => {
    let done = false;
    const finish = (ok: boolean) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      el.removeEventListener('loadedmetadata', onMeta);
      el.removeEventListener('loadeddata', onMeta);
      el.removeEventListener('error', onErr);
      resolve(ok);
    };
    const onMeta = () => finish(true);
    const onErr = () => finish(false);
    const timer = setTimeout(() => finish(false), timeoutMs);

    el.addEventListener('loadedmetadata', onMeta);
    // Belt and braces: engines that are stingy with loadedmetadata on a
    // MediaStream still reach HAVE_CURRENT_DATA, and by then videoWidth is set.
    el.addEventListener('loadeddata', onMeta);
    el.addEventListener('error', onErr);
  });
}

/**
 * Default FrameSource: `getUserMedia` in a browser tab.
 *
 * The internal <video> element is exposed via `videoElement` purely so a
 * consumer can render its own preview (`<video srcObject>` or drawing to a
 * canvas). We hand it over; we never place it.
 */
export class WebcamFrameSource implements FrameSource {
  private video: HTMLVideoElement | null = null;
  private stream: MediaStream | null = null;
  private callbacks = new Set<(frame: Frame, tCapture: number) => void>();
  private rafHandle: number | null = null;
  private videoFrameHandle: number | null = null;
  private stopped = true;
  private size: { width: number; height: number } | null = null;
  private onPauseResume: (() => void) | null = null;
  private warn: (message: string) => void = (m) => console.warn('[wibbly-input] %s', m);
  /**
   * Bumped by every start() and every stop(). An in-flight start() compares it
   * against the value it captured and aborts if it changed — see start().
   */
  private generation = 0;

  get frameSize(): { width: number; height: number } | null {
    return this.size;
  }

  get running(): boolean {
    return !this.stopped;
  }

  /** The detached <video> backing the stream, for consumer-owned preview rendering. */
  get videoElement(): HTMLVideoElement | null {
    return this.video;
  }

  async start(opts: Partial<FrameSourceOptions> = {}): Promise<void> {
    if (!this.stopped) return;
    const o = { ...DEFAULTS, ...opts };
    if (o.onWarning) this.warn = o.onWarning;

    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      throw new Error('WebcamFrameSource: getUserMedia is unavailable in this environment');
    }

    // start() awaits three times (permission, metadata, play). stop() can land
    // in any of those gaps — a player hitting Escape at the prompt is the
    // ordinary case, not an exotic one. Without this token the old code would
    // let a cancelled start() overwrite `stopped` and begin pumping, AND would
    // leak the MediaStream that arrived after stop() had already cleared the
    // field: the camera light stays on with nothing holding a reference to
    // turn it off. Every await below is followed by a generation check.
    const gen = ++this.generation;
    const cancelled = () => this.generation !== gen;

    const stream = await acquireCameraStream(
      (c) => navigator.mediaDevices.getUserMedia(c),
      o,
      (m) => this.warn(m),
    );
    if (cancelled()) {
      stream.getTracks().forEach((t) => t.stop());
      return;
    }
    this.stream = stream;

    const el = document.createElement('video');
    configureVideoElement(el);
    el.srcObject = stream;
    this.video = el;

    // Ordering matters: request playback FIRST, then await metadata. See
    // waitForVideoMetadata note 2 — awaiting metadata before play() can
    // deadlock on engines that only produce metadata once playback starts.
    //
    // A rejected play() is NOT fatal and must not propagate: autoplay policy,
    // a backgrounded tab, or low-power mode can all reject it while the track
    // is perfectly alive. Frames may still arrive, and if they do not, the app
    // is already watching for that. Throwing here would take down a pipeline
    // that has a working camera.
    const playPromise = this.attemptPlay(el);

    const gotMetadata = await waitForVideoMetadata(el);
    if (cancelled()) {
      stream.getTracks().forEach((t) => t.stop());
      return;
    }
    await playPromise;
    if (cancelled()) {
      stream.getTracks().forEach((t) => t.stop());
      return;
    }

    this.size = this.resolveSize(el, stream, gotMetadata);
    this.stopped = false;

    // Reparenting a <video> in the DOM can pause it on some engines, and the
    // consumer is *expected* to reparent this element (that is the whole point
    // of handing it over detached). Resume rather than silently dying.
    const onPause = () => {
      if (this.stopped || this.video !== el) return;
      void this.attemptPlay(el);
    };
    el.addEventListener('pause', onPause);
    this.onPauseResume = () => el.removeEventListener('pause', onPause);

    this.pump();
  }

  /** play(), with its rejection turned into a warning instead of a throw. */
  private async attemptPlay(el: HTMLVideoElement): Promise<void> {
    try {
      // HTMLMediaElement.play() is typed to always return Promise<void> under
      // this project's lib target (DOM) — no environment this codebase
      // actually runs in returns anything else, and no-misused-promises
      // correctly flagged the previous `if (p && typeof p.then ===
      // 'function')` guard as testing an object that TypeScript already
      // knows is unconditionally truthy. Trust the type.
      await el.play();
    } catch (err) {
      const name = (err as { name?: string } | null)?.name ?? 'Error';
      this.warn(
        `Camera video play() was rejected (${name}). The stream is still open and frames may ` +
          `still arrive; if the preview stays black, a user gesture may be required to start ` +
          `playback on this device.`,
      );
    }
  }

  /**
   * Negotiated dimensions, preferring the element and falling back to the
   * track's own reported settings.
   *
   * `videoWidth` is 0 until metadata exists, so on a stalled-metadata start
   * the element cannot answer. `MediaStreamTrack.getSettings()` can, and is
   * long-standardised, but is itself defensive-guarded because a settings
   * object is permitted to omit keys.
   */
  private resolveSize(
    el: HTMLVideoElement,
    stream: MediaStream,
    gotMetadata: boolean,
  ): { width: number; height: number } {
    if (el.videoWidth > 0 && el.videoHeight > 0) {
      return { width: el.videoWidth, height: el.videoHeight };
    }
    const track = stream.getVideoTracks?.()[0];
    const settings = track?.getSettings?.();
    if (settings?.width && settings?.height) {
      if (!gotMetadata) {
        this.warn(
          'Camera metadata did not arrive in time; using the track-reported frame size instead.',
        );
      }
      return { width: settings.width, height: settings.height };
    }
    this.warn('Camera frame size is not yet known; it will be read from frames as they arrive.');
    return { width: 0, height: 0 };
  }

  /**
   * Emit frames as fast as the display/camera offers them. Deliberately NOT
   * throttled here — pacing belongs to the consumer (see AdaptivePacer), so
   * that pacing can react to measured inference cost rather than a guess baked
   * into the capture layer.
   */
  private pump(): void {
    const el = this.video;
    if (!el) return;

    // Guard against two loops running at once. pump() is only called from
    // start(), which is guarded by `stopped`, but a double loop is a silent
    // 2x inference cost and is worth making structurally impossible.
    if (this.rafHandle !== null || this.videoFrameHandle !== null) return;

    // `requestVideoFrameCallback` fires once per *composited video frame* and
    // hands over presentation metadata — including `captureTime`, the closest
    // thing to a true "when the camera saw this" timestamp available to a page.
    //
    // Support is better than its reputation: Chrome 83, Safari 15.4 (which
    // explicitly covered MediaStreamTrack-backed video, i.e. exactly this use),
    // and **Firefox 132** — it became Baseline in October 2024 when Firefox
    // closed the last gap (Bugzilla 1919367). So the rAF path below is not
    // "the Firefox path"; it is the pre-132-Firefox and old-Safari path, and it
    // should be reached rarely.
    //
    // It is still feature-detected on the element rather than assumed, because
    // "rarely" is not "never" and the cost of the check is nil.
    // (W3C spec: https://wicg.github.io/video-rvfc/)
    // Bound at extraction (`?.bind(el)`), not called later via `.call(el,
    // ...)` on a bare extracted reference — the same method reference used
    // twice below (once to arm, once to re-arm inside `step`) is exactly
    // what @typescript-eslint/unbound-method exists to catch, and `.bind`
    // is the fix the rule's own message suggests.
    const rvfc = (
      el as HTMLVideoElement & {
        requestVideoFrameCallback?: (
          cb: (now: number, meta: { captureTime?: number; mediaTime: number }) => void,
        ) => number;
        cancelVideoFrameCallback?: (h: number) => void;
      }
    ).requestVideoFrameCallback?.bind(el);

    if (rvfc) {
      const step = (now: number, meta: { captureTime?: number }) => {
        // Clear the handle before doing anything: it refers to a callback that
        // has already fired, so cancelling it in stop() would be a no-op on a
        // stale id and could mask a genuinely pending one.
        this.videoFrameHandle = null;
        if (this.stopped || this.video !== el) return;
        // `captureTime` is optional in the spec and absent on plenty of
        // sources; `now` (a DOMHighResTimeStamp on the same clock as
        // performance.now) is the correct documented fallback.
        this.emit(el, meta.captureTime ?? now);
        // Re-arm AFTER emitting, and only if still running — emit() runs
        // subscriber code that may call stop().
        if (this.stopped || this.video !== el) return;
        this.videoFrameHandle = rvfc(step);
      };
      this.videoFrameHandle = rvfc(step);
      return;
    }

    this.warn(
      'requestVideoFrameCallback is unavailable; falling back to requestAnimationFrame for ' +
        'capture. Frame timestamps are approximate (arrival time, not capture time).',
    );

    // ── rAF fallback ────────────────────────────────────────────────────────
    // rAF fires on the DISPLAY's cadence, not the camera's. A 30fps camera on a
    // 120Hz display therefore offers each frame ~4 times. Emitting all of them
    // means running pose inference on identical pixels — the single most
    // expensive thing in this pipeline — up to 4x per real frame.
    //
    // `currentTime` advances only when a new frame is presented, so it is the
    // available proxy for "this is actually new". We dedupe on it, but only
    // after confirming it actually moves: if an engine reports a frozen or
    // non-finite currentTime, deduping on it would emit nothing at all, and
    // silently capturing zero frames is far worse than capturing duplicates.
    // So the dedupe is self-disabling.
    let lastMediaTime = -1;
    let sawAdvance = false;
    let staleFrames = 0;

    const loop = () => {
      this.rafHandle = null;
      if (this.stopped || this.video !== el) return;

      // HAVE_CURRENT_DATA — there are pixels to read.
      if (el.readyState >= 2) {
        const t = el.currentTime;
        const usable = typeof t === 'number' && Number.isFinite(t);

        if (usable && t !== lastMediaTime) {
          if (lastMediaTime >= 0) sawAdvance = true;
          lastMediaTime = t;
          staleFrames = 0;
          this.emit(el, performance.now());
        } else if (!usable || !sawAdvance) {
          // Either currentTime is unusable, or it has not yet been observed to
          // move. Emit unconditionally — duplicates cost throughput, silence
          // costs the whole feature.
          this.emit(el, performance.now());
        } else {
          // currentTime is known-good and known-moving, and this tick is a
          // repeat. Skip it. If repeats persist far beyond any plausible
          // display/camera ratio the stream has probably stalled, so let one
          // through periodically rather than going permanently quiet.
          if (++staleFrames >= 30) {
            staleFrames = 0;
            this.emit(el, performance.now());
          }
        }
      }

      if (this.stopped || this.video !== el) return;
      this.rafHandle = requestAnimationFrame(loop);
    };
    this.rafHandle = requestAnimationFrame(loop);
  }

  private emit(frame: Frame, tCapture: number): void {
    for (const cb of this.callbacks) {
      try {
        cb(frame, tCapture);
      } catch (err) {
        // One bad subscriber must not kill the capture loop.
        console.error('[wibbly-input] frame subscriber threw:', err);
      }
    }
  }

  onFrame(cb: (frame: Frame, tCapture: number) => void): () => void {
    this.callbacks.add(cb);
    return () => this.callbacks.delete(cb);
  }

  stop(): void {
    // Invalidate any start() still in flight so it releases the stream it is
    // about to receive rather than installing it behind our back.
    this.generation += 1;
    this.stopped = true;

    if (this.rafHandle !== null) {
      cancelAnimationFrame(this.rafHandle);
      this.rafHandle = null;
    }
    if (this.videoFrameHandle !== null && this.video) {
      // `.bind(this.video)` at extraction, same reasoning as requestVideoFrameCallback above.
      const cancel = (
        this.video as HTMLVideoElement & { cancelVideoFrameCallback?: (h: number) => void }
      ).cancelVideoFrameCallback?.bind(this.video);
      // Paired feature detection: an engine that has requestVideoFrameCallback
      // is required to have the canceller, but we got the handle from a
      // detected function and we refuse to assume its partner.
      if (cancel) cancel(this.videoFrameHandle);
    }
    this.videoFrameHandle = null;

    this.onPauseResume?.();
    this.onPauseResume = null;

    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = null;
    if (this.video) {
      // Pause before detaching the stream: leaving a playing element pointing
      // at a torn-down source is how "video element error" events appear after
      // a clean shutdown.
      try {
        this.video.pause();
      } catch {
        /* not fatal — we are discarding the element anyway */
      }
      this.video.srcObject = null;
      this.video = null;
    }
    this.size = null;
    this.callbacks.clear();
  }
}
