import type { Frame } from './types';

export interface FrameSourceOptions {
  width: number;
  height: number;
  fps: number;
  /** Media device id to pin a specific camera. Optional. */
  deviceId?: string;
  facingMode?: 'user' | 'environment';
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

    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      throw new Error('WebcamFrameSource: getUserMedia is unavailable in this environment');
    }

    const video: MediaTrackConstraints = {
      width: { ideal: o.width },
      height: { ideal: o.height },
      frameRate: { ideal: o.fps },
      facingMode: o.facingMode,
    };
    if (o.deviceId) video.deviceId = { exact: o.deviceId };

    this.stream = await navigator.mediaDevices.getUserMedia({ video, audio: false });

    const el = document.createElement('video');
    el.playsInline = true;
    el.muted = true;
    el.autoplay = true;
    el.srcObject = this.stream;
    this.video = el;

    await new Promise<void>((resolve, reject) => {
      const onReady = () => {
        el.removeEventListener('loadedmetadata', onReady);
        resolve();
      };
      el.addEventListener('loadedmetadata', onReady);
      el.addEventListener('error', () => reject(new Error('WebcamFrameSource: video element error')), {
        once: true,
      });
    });

    await el.play();
    this.size = { width: el.videoWidth, height: el.videoHeight };
    this.stopped = false;
    this.pump();
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

    // requestVideoFrameCallback gives a true capture timestamp when available.
    const rvfc = (el as HTMLVideoElement & {
      requestVideoFrameCallback?: (cb: (now: number, meta: { captureTime?: number; mediaTime: number }) => void) => number;
      cancelVideoFrameCallback?: (h: number) => void;
    }).requestVideoFrameCallback;

    if (typeof rvfc === 'function') {
      const step = (now: number, meta: { captureTime?: number }) => {
        if (this.stopped) return;
        this.emit(el, meta.captureTime ?? now);
        this.videoFrameHandle = rvfc.call(el, step);
      };
      this.videoFrameHandle = rvfc.call(el, step);
      return;
    }

    const loop = () => {
      if (this.stopped) return;
      if (el.readyState >= 2) this.emit(el, performance.now());
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
    this.stopped = true;
    if (this.rafHandle !== null) {
      cancelAnimationFrame(this.rafHandle);
      this.rafHandle = null;
    }
    if (this.videoFrameHandle !== null && this.video) {
      const cancel = (this.video as HTMLVideoElement & {
        cancelVideoFrameCallback?: (h: number) => void;
      }).cancelVideoFrameCallback;
      if (typeof cancel === 'function') cancel.call(this.video, this.videoFrameHandle);
      this.videoFrameHandle = null;
    }
    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = null;
    if (this.video) {
      this.video.srcObject = null;
      this.video = null;
    }
    this.size = null;
    this.callbacks.clear();
  }
}
