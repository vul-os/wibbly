import type { Frame, Landmark, Person } from './types';

export interface TrackerCapabilities {
  body: boolean;
  hands: boolean;
  face: boolean;
}

/** §3.2 seam — pixels → skeletons. Plural is the point. */
export interface PoseTracker {
  init(): Promise<void>;
  estimate(frame: Frame): Promise<Person[]>;
  dispose(): void;
  readonly maxPeople: number;
  readonly capabilities: TrackerCapabilities;
}

/**
 * Where the MoveNet MultiPose Lightning weights come from.
 *
 * `CDN_URL` is the upstream TF Hub location the package uses when no
 * `modelUrl` is given. It is kept here as a named opt-in, not as the default:
 * a page served under `default-src 'self'` cannot reach it, and a build that
 * silently depends on a third-party host is not self-contained.
 *
 * `VENDORED_PATH` is the copy checked into this repo at
 * `public/models/movenet-multipose-lightning/`, served same-origin.
 */
export const MOVENET_MULTIPOSE_LIGHTNING_CDN_URL =
  'https://tfhub.dev/google/tfjs-model/movenet/multipose/lightning/1';

export const MOVENET_MULTIPOSE_LIGHTNING_VENDORED_PATH =
  'models/movenet-multipose-lightning/model.json';

/**
 * Resolve the vendored model against the document base, so the same code works
 * at `/` and at `/products/wibbly/play/`. Falls back to the bare relative path
 * outside a browser (tests), where nothing loads it anyway.
 */
export function defaultModelUrl(): string {
  try {
    if (typeof document !== 'undefined' && document.baseURI) {
      return new URL(MOVENET_MULTIPOSE_LIGHTNING_VENDORED_PATH, document.baseURI).href;
    }
  } catch {
    /* fall through */
  }
  return MOVENET_MULTIPOSE_LIGHTNING_VENDORED_PATH;
}

/**
 * Backends that cannot run under a CSP without `'wasm-unsafe-eval'` in
 * `script-src`. Landing on one of these in an embedded build means the
 * detector will not work, and saying so beats tracking silently never starting.
 */
export const CSP_HOSTILE_BACKENDS = ['wasm'];

/** What backend selection actually settled on. */
export interface BackendInfo {
  /** The backend TFJS is running on, e.g. 'webgl' | 'cpu' | 'wasm'. */
  backend: string;
  /** True when it is one of the preferred backends. */
  preferred: boolean;
  /**
   * True when this backend is expected to be BLOCKED by the production CSP.
   * A demo landing here is broken in production even if it works locally.
   */
  cspHostile: boolean;
  /** Human-readable, safe to show a user. Null when everything is fine. */
  warning: string | null;
}

export interface MoveNetTrackerConfig {
  /** Up to 6 — the model's hard ceiling. */
  maxPeople?: number;
  /**
   * Where to load the graph model from. This is the package's own
   * `MoveNetModelConfig.modelUrl` key, read off `movenet/types.d.ts` — NOT a
   * name invented here.
   *
   *   undefined  → the vendored same-origin copy (`defaultModelUrl()`). Default.
   *   <a string> → that URL. Pass `MOVENET_MULTIPOSE_LIGHTNING_CDN_URL` to opt
   *                back into TF Hub for a lean build with no vendored weights.
   *   null       → omit the key entirely and let the package pick its own
   *                default, which today is the same TF Hub URL.
   *
   * The package branches on `modelUrl.indexOf('https://tfhub.dev') > -1` to
   * decide `fromTFHub`, so a same-origin URL is loaded as a plain
   * `model.json` + shards, which is exactly what is vendored.
   */
  modelUrl?: string | null;
  /**
   * TFJS backends to try, in order, before falling back to whatever TFJS
   * would have picked on its own. Defaults to `['webgl']`.
   *
   * This is explicit for a Content-Security-Policy reason, not a performance
   * one. The production embed is served under:
   *
   *   script-src 'self' 'unsafe-inline'
   *
   * with no `'wasm-unsafe-eval'` and no `'unsafe-eval'`, so the TFJS **WASM
   * backend cannot instantiate there at all** — `WebAssembly.instantiate` is
   * blocked. Letting TFJS auto-select means the backend that runs depends on
   * what happens to be registered, which is exactly the kind of thing that
   * works in testing and silently does not work in production. WebGL needs no
   * eval of any kind and is the backend this is built for.
   */
  preferredBackends?: string[];
  /**
   * Called once, after backend selection, with what actually happened.
   *
   * A pose tracker that comes up on an unusable backend does not throw — it
   * just never produces a skeleton, which from the outside is indistinguishable
   * from "the game is ignoring me". That is the worst failure mode this
   * component has, so it is reported rather than left to be inferred.
   */
  onBackend?: (info: BackendInfo) => void;
  /** Drop whole poses below this score. */
  minPoseScore?: number;
  /**
   * Multiple of 32, recommended range [128, 512]. Higher = more accurate,
   * slower. 256 is the package default.
   */
  multiPoseMaxDimension?: number;
  /**
   * Temporal keypoint smoothing. NOTE: the package documents that smoothing
   * with multi-pose REQUIRES tracking to be enabled, so we force
   * `enableTracking: true` whenever this is on.
   */
  enableSmoothing?: boolean;
  /** Mirror the input horizontally before inference. */
  flipHorizontal?: boolean;
  /** Injectable for tests — defaults to the real @tensorflow-models/pose-detection. */
  createDetector?: (model: unknown, config: unknown) => Promise<RawDetector>;
}

/** Minimal structural type for the underlying tfjs detector, so tests can fake it. */
export interface RawDetector {
  estimatePoses(
    frame: unknown,
    config?: { maxPoses?: number; flipHorizontal?: boolean },
    timestamp?: number,
  ): Promise<RawPose[]>;
  dispose?(): void;
  reset?(): void;
}

export interface RawPose {
  keypoints: Array<{ name?: string; x: number; y: number; score?: number; z?: number }>;
  score?: number;
  id?: number;
  box?: { xMin: number; yMin: number; xMax: number; yMax: number };
}

const MOVENET_MAX_PEOPLE = 6;

/** Minimal structural type for the bits of the tfjs module used below. */
export interface TfLike {
  ready(): Promise<void>;
  setBackend(name: string): Promise<boolean>;
  getBackend(): string;
}

/**
 * Select a TFJS backend explicitly, in preference order, and report honestly
 * what was actually obtained.
 *
 * Exported and pure-ish so it can be tested against a fake `tf` — the real
 * thing needs a GPU and a browser, which is precisely why the CSP-hostile case
 * would otherwise never be covered by a test.
 */
export async function selectBackend(
  tf: TfLike,
  preferred: string[] = ['webgl'],
  cspHostile: string[] = CSP_HOSTILE_BACKENDS,
): Promise<BackendInfo> {
  let lastError: unknown = null;

  for (const name of preferred) {
    try {
      // setBackend resolves false when the backend is registered but cannot
      // initialise (no GPU, no adapter), and throws when it is not registered
      // at all. Both mean "try the next one".
      if (await tf.setBackend(name)) {
        await tf.ready();
        if (tf.getBackend() === name) {
          return { backend: name, preferred: true, cspHostile: false, warning: null };
        }
      }
    } catch (err) {
      lastError = err;
    }
  }

  // Nothing preferred came up. Let TFJS settle on whatever it can and describe
  // the consequences rather than pretending this is fine.
  await tf.ready();
  const backend = tf.getBackend();
  const hostile = cspHostile.includes(backend);

  const warning = hostile
    ? `Pose tracking fell back to the "${backend}" TFJS backend. That backend needs ` +
      `'wasm-unsafe-eval' in the page's script-src, which the embedded build does NOT have, ` +
      `so tracking will not work here. Preferred: ${preferred.join(', ')}.` +
      (lastError ? ` Last error: ${String(lastError)}` : '')
    : `Pose tracking could not start the preferred backend (${preferred.join(', ')}) and fell ` +
      `back to "${backend}". It will run, but slowly — expect a long startup and low frame ` +
      `rates.` + (lastError ? ` Last error: ${String(lastError)}` : '');

  return { backend, preferred: false, cspHostile: hostile, warning };
}

/**
 * Default PoseTracker — MoveNet **MultiPose Lightning**.
 *
 * Config key names below were read off the installed package's own type
 * declarations (`movenet/types.d.ts`, `movenet/constants.d.ts`) rather than
 * guessed:
 *   modelType: 'MultiPose.Lightning'   (constant MULTIPOSE_LIGHTNING)
 *   minPoseScore, multiPoseMaxDimension, enableTracking, trackerType  — model config
 *   maxPoses, flipHorizontal                                          — estimation config
 *
 * Note there is no `minPartScore` key in MoveNetModelConfig; the old
 * poseDetection.js passed one, and it was silently ignored. Per-keypoint score
 * filtering is done downstream by the recognizers instead.
 */
export class MoveNetMultiPoseTracker implements PoseTracker {
  readonly capabilities: TrackerCapabilities = { body: true, hands: false, face: false };
  readonly maxPeople: number;

  private detector: RawDetector | null = null;
  private cfg: Required<
    Omit<MoveNetTrackerConfig, 'createDetector' | 'modelUrl' | 'preferredBackends' | 'onBackend'>
  >;
  /** null means "omit the key"; a string is passed through verbatim. */
  private modelUrl: string | null;
  private preferredBackends: string[];
  private onBackend: MoveNetTrackerConfig['onBackend'];
  private createDetectorFn: MoveNetTrackerConfig['createDetector'];

  /** Populated by init(). Null until then. */
  backendInfo: BackendInfo | null = null;

  constructor(config: MoveNetTrackerConfig = {}) {
    this.maxPeople = Math.min(config.maxPeople ?? MOVENET_MAX_PEOPLE, MOVENET_MAX_PEOPLE);
    this.modelUrl = config.modelUrl === undefined ? defaultModelUrl() : config.modelUrl;
    this.preferredBackends = config.preferredBackends ?? ['webgl'];
    this.onBackend = config.onBackend;
    this.cfg = {
      maxPeople: this.maxPeople,
      minPoseScore: config.minPoseScore ?? 0.25,
      multiPoseMaxDimension: config.multiPoseMaxDimension ?? 256,
      enableSmoothing: config.enableSmoothing ?? true,
      flipHorizontal: config.flipHorizontal ?? false,
    };
    this.createDetectorFn = config.createDetector;
  }

  async init(): Promise<void> {
    if (this.detector) return;

    if (this.createDetectorFn) {
      this.detector = await this.createDetectorFn('MoveNet', this.modelConfig());
      return;
    }

    const [poseDetection, tf] = await Promise.all([
      import('@tensorflow-models/pose-detection'),
      import('@tensorflow/tfjs'),
    ]);
    await tf.ready();

    // Pick the backend BEFORE creating the detector: createDetector compiles
    // kernels against whatever is current, so switching afterwards means
    // paying for the model load twice.
    this.backendInfo = await selectBackend(tf as unknown as TfLike, this.preferredBackends);
    if (this.backendInfo.warning) {
      // Loud, not swallowed. A tracker on a dead backend produces no skeletons
      // and no errors, which reads as "the game ignores me".
      console.error('[wibbly-input] %s', this.backendInfo.warning);
    }
    this.onBackend?.(this.backendInfo);

    this.detector = (await poseDetection.createDetector(
      poseDetection.SupportedModels.MoveNet,
      this.modelConfig() as never,
    )) as unknown as RawDetector;
  }

  private modelConfig(): Record<string, unknown> {
    return {
      // 'MultiPose.Lightning' — was SinglePose before, which is why multi-player was impossible.
      modelType: 'MultiPose.Lightning',
      // Omitted entirely when null, so the package falls back to its own default.
      ...(this.modelUrl === null ? {} : { modelUrl: this.modelUrl }),
      enableSmoothing: this.cfg.enableSmoothing,
      // Smoothing on multi-pose is only valid with tracking on (package docs).
      enableTracking: true,
      trackerType: 'boundingBox',
      minPoseScore: this.cfg.minPoseScore,
      multiPoseMaxDimension: this.cfg.multiPoseMaxDimension,
    };
  }

  /**
   * Returns up to `maxPeople` skeletons with keypoints NORMALIZED to [0,1]
   * against the frame dimensions — see the coordinate contract in types.ts.
   */
  async estimate(frame: Frame): Promise<Person[]> {
    if (!this.detector) throw new Error('MoveNetMultiPoseTracker: init() not called');

    const { width, height } = frameDimensions(frame);
    if (!width || !height) return [];

    const raw = await this.detector.estimatePoses(frame, {
      maxPoses: this.maxPeople,
      flipHorizontal: this.cfg.flipHorizontal,
    });

    return (raw ?? [])
      .filter((p) => (p.score ?? 1) >= this.cfg.minPoseScore)
      .slice(0, this.maxPeople)
      .map((p) => normalizePose(p, width, height));
  }

  dispose(): void {
    this.detector?.dispose?.();
    this.detector = null;
  }
}

export function frameDimensions(frame: Frame): { width: number; height: number } {
  const v = frame as HTMLVideoElement;
  if (typeof v.videoWidth === 'number' && v.videoWidth > 0) {
    return { width: v.videoWidth, height: v.videoHeight };
  }
  const c = frame as HTMLCanvasElement;
  return { width: c.width ?? 0, height: c.height ?? 0 };
}

export function normalizePose(pose: RawPose, width: number, height: number): Person {
  const keypoints: Landmark[] = pose.keypoints.map((kp, i) => ({
    name: kp.name ?? `kp_${i}`,
    x: kp.x / width,
    y: kp.y / height,
    score: kp.score ?? 0,
    ...(kp.z !== undefined ? { z: kp.z } : {}),
  }));

  const person: Person = {
    keypoints,
    score: pose.score ?? 0,
  };
  if (pose.id !== undefined) person.trackId = pose.id;
  if (pose.box) {
    person.box = {
      xMin: pose.box.xMin / width,
      yMin: pose.box.yMin / height,
      xMax: pose.box.xMax / width,
      yMax: pose.box.yMax / height,
    };
  }
  return person;
}
