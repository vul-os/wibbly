import type { TrackerCapabilities } from './pose-tracker';
import type { Frame, Hand, Handedness, Landmark } from './types';
import { HAND_LANDMARK_NAMES } from './types';

/**
 * §3.2 seam, hand half — pixels → 21-point hand skeletons. Same seam family as
 * `PoseTracker` (WIBBLY.md §3.2 explicitly calls out `HandLandmarkTracker` as
 * "composable alongside the body tracker"), deliberately NOT unified into one
 * interface with it: a body tracker and a hand tracker are two different
 * models with two different lifecycles, and `WibblyInput` (pipeline.ts) is
 * free to run zero, one, or both against the same frame.
 */
export interface HandTracker {
  init(): Promise<void>;
  estimate(frame: Frame): Promise<Hand[]>;
  dispose(): void;
  readonly maxHands: number;
  readonly capabilities: TrackerCapabilities;
}

/**
 * Where the MediaPipe HandLandmarker assets come from. TWO independent things
 * need a location, unlike MoveNet which is a single `model.json` + shards:
 *
 *   1. The **Wasm runtime** itself (`vision_wasm_internal.js` + `.wasm`,
 *      ~9MB each for the SIMD and non-SIMD variant — `FilesetResolver` picks
 *      whichever the browser supports). This ships inside the
 *      `@mediapipe/tasks-vision` npm package's own `wasm/` directory; it is
 *      NOT the same thing as the "model".
 *   2. The **model asset** (`hand_landmarker.task`, verified 7,819,105 bytes
 *      at the URL below via a HEAD request on 2026-07-21 — Google does not
 *      publish this size in the docs, so it is stated here as a measured
 *      fact, not a copied claim).
 *
 * Both are vendorable same-origin, following the exact same principle as
 * `pose-tracker.ts`'s `MOVENET_MULTIPOSE_LIGHTNING_VENDORED_PATH`: a page
 * served under `default-src 'self'` cannot reach either of these off a Google
 * CDN, and a build that silently depends on one is not self-contained.
 *
 * `FilesetResolver.forVisionTasks(basePath)`'s own doc is explicit that
 * `basePath` is optional and, if omitted, Wasm files are loaded "from the
 * host's root directory" — i.e. there is NO built-in CDN fallback baked into
 * the package the way MoveNet defaults to TF Hub. Omitting it here is
 * therefore not a safe default; a `modelUrl`/`wasmBase` MUST be supplied
 * (vendored or CDN) or `init()` will 404 against paths that do not exist.
 */
export const HAND_LANDMARKER_TASK_CDN_URL =
  'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/latest/hand_landmarker.task';

export const HAND_LANDMARKER_TASK_VENDORED_PATH = 'models/hand-landmarker/hand_landmarker.task';

/** The npm package's own CDN mirror of its `wasm/` directory, for the CDN opt-in. */
export const TASKS_VISION_WASM_CDN_BASE_URL =
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.17/wasm';

/** Vendored copy: `node_modules/@mediapipe/tasks-vision/wasm/*` copied here verbatim. */
export const TASKS_VISION_WASM_VENDORED_PATH = 'models/hand-landmarker/wasm';

/** Resolve a vendored asset path against the document base — see `pose-tracker.ts`'s `defaultModelUrl`. */
function resolveVendored(path: string): string {
  try {
    if (typeof document !== 'undefined' && document.baseURI) {
      return new URL(path, document.baseURI).href;
    }
  } catch {
    /* fall through */
  }
  return path;
}

export function defaultHandModelUrl(): string {
  return resolveVendored(HAND_LANDMARKER_TASK_VENDORED_PATH);
}

export function defaultHandWasmBase(): string {
  return resolveVendored(TASKS_VISION_WASM_VENDORED_PATH);
}

/**
 * CSP note, load-bearing and DIFFERENT from `pose-tracker.ts`'s: MediaPipe
 * Tasks Vision is a WebAssembly runtime with NO pure-JS fallback of any kind.
 * `PoseTracker.selectBackend` can claim a CSP-safe `cpu` TFJS backend as a
 * last resort specifically BECAUSE TFJS ships one; there is no equivalent
 * here. Both the `CPU` and `GPU` delegate options below select a compute
 * backend *inside* the same Wasm module — the module still has to be
 * `WebAssembly.instantiate`d either way, which needs `'wasm-unsafe-eval'` in
 * `script-src`. A page whose CSP forbids it (the documented production embed
 * CSP: `script-src 'self' 'unsafe-inline'`) cannot run hand tracking AT ALL,
 * on any delegate. This is exported as a value, not left as a comment, so a
 * consumer can gate a "hand tracking unavailable here" message on it rather
 * than discovering it by a silent failure to ever emit a Hand.
 */
export const HAND_TRACKING_REQUIRES_WASM_UNSAFE_EVAL = true;

export interface HandTrackerConfig {
  /** Up to 4 in practice (2 players × 2 hands); the Tasks API itself has no hard ceiling like MoveNet's 6. */
  maxHands?: number;
  minHandDetectionConfidence?: number;
  minHandPresenceConfidence?: number;
  minTrackingConfidence?: number;
  /** `.task` model asset location. undefined -> vendored same-origin copy (`defaultHandModelUrl()`). */
  modelUrl?: string;
  /** Wasm fileset directory. undefined -> vendored same-origin copy (`defaultHandWasmBase()`). */
  wasmBase?: string;
  /**
   * 'GPU' (default) uses WebGL compute inside the Wasm module and is faster;
   * 'CPU' is the safer bet on a machine with no usable GL context. Unlike
   * `selectBackend`'s CSP-driven fallback ladder, this ladder is purely a
   * "does the delegate actually initialise" concern — see
   * `HAND_TRACKING_REQUIRES_WASM_UNSAFE_EVAL` for why CSP is not fixable by
   * choosing a delegate here.
   */
  delegate?: 'CPU' | 'GPU';
  /**
   * Set true if frames fed to this tracker were mirrored (flipped
   * horizontally) BEFORE being handed to the tracker.
   *
   * MediaPipe's hand-landmark model determines left/right handedness
   * assuming a MIRRORED (selfie-view) input image — this is documented
   * upstream (google/mediapipe `docs/solutions/hands.md`: "handedness is
   * determined assuming the input image is mirrored... If it is not the
   * case, please swap the handedness output"). This library's own coordinate
   * contract (types.ts) defaults frames to NOT mirrored, so by default the
   * raw label is the anatomical opposite of the truth and this class swaps it
   * — see `resolveHandedness`. This is the exact same shape of correction as
   * `SwingConfig.mirrored` in recognizers/swing.ts, for the same underlying
   * reason (an unmirrored front camera reverses left/right as the model
   * expects it).
   */
  mirrored?: boolean;
  /** Called once, after init, with which delegate actually initialised. */
  onDelegate?: (info: HandDelegateInfo) => void;
  /**
   * Injectable for tests — defaults to the real `@mediapipe/tasks-vision`.
   * Takes `delegate` FIRST and is called once per rung of the fallback ladder
   * (see `selectHandDelegate`), so a test can make "GPU" reject and "CPU"
   * succeed without touching Wasm, a GPU, or the real package at all.
   */
  createLandmarker?: (
    delegate: 'CPU' | 'GPU',
    modelUrl: string,
    wasmBase: string,
    options: RawHandLandmarkerOptions,
  ) => Promise<RawHandLandmarker>;
}

export interface RawHandLandmarkerOptions {
  numHands: number;
  minHandDetectionConfidence: number;
  minHandPresenceConfidence: number;
  minTrackingConfidence: number;
  delegate: 'CPU' | 'GPU';
}

/** Minimal structural type for the underlying MediaPipe task, so tests can fake it with no Wasm and no GPU. */
export interface RawHandLandmarker {
  detectForVideo(frame: unknown, timestampMs: number): RawHandLandmarkerResult;
  close?(): void;
}

/** Shape of `HandLandmarkerResult` (`@mediapipe/tasks-vision` vision.d.ts) — verified against the installed package. */
export interface RawHandLandmarkerResult {
  /** One inner array of 21 points per detected hand. */
  landmarks: Array<Array<{ x: number; y: number; z?: number; visibility?: number }>>;
  /** One inner array (usually length 1) of classification categories per detected hand. */
  handedness: Array<Array<{ categoryName?: string; score?: number }>>;
}

export interface HandDelegateInfo {
  delegate: 'CPU' | 'GPU';
  requested: 'CPU' | 'GPU';
  fellBack: boolean;
  /** Human-readable, safe to show a user, when a fallback happened. Null otherwise. */
  warning: string | null;
}

const DEFAULT_MAX_HANDS = 2;

/**
 * Try the preferred delegate, then fall back, reporting honestly which one
 * actually initialised. Extracted as its own function — mirroring
 * `pose-tracker.ts`'s `selectBackend` exactly — for the same reason: the
 * fallback rung is the one branch a real browser+GPU test would never
 * naturally exercise, so it needs to be independently testable against a fake
 * `create`.
 *
 * Unlike `selectBackend`, there is no CSP-safe last rung to claim (see
 * `HAND_TRACKING_REQUIRES_WASM_UNSAFE_EVAL`) — this only covers "the
 * preferred delegate failed to INITIALISE" (e.g. GPU requested on a machine
 * with no usable WebGL context), not a CSP failure, which no delegate choice
 * here can fix.
 */
export async function selectHandDelegate(
  create: (delegate: 'CPU' | 'GPU') => Promise<RawHandLandmarker>,
  preferred: 'CPU' | 'GPU' = 'GPU',
): Promise<{ landmarker: RawHandLandmarker; info: HandDelegateInfo }> {
  const ladder: Array<'CPU' | 'GPU'> = preferred === 'CPU' ? ['CPU'] : ['GPU', 'CPU'];
  let lastError: unknown = null;

  for (const delegate of ladder) {
    try {
      const landmarker = await create(delegate);
      const fellBack = delegate !== preferred;
      return {
        landmarker,
        info: {
          delegate,
          requested: preferred,
          fellBack,
          warning: fellBack
            ? `Hand tracking could not start the preferred "${preferred}" delegate and fell back ` +
              `to "${delegate}". It will run, but likely slower.` +
              (lastError ? ` Last error: ${String(lastError)}` : '')
            : null,
        },
      };
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError ?? new Error('HandLandmarkTracker: failed to initialize');
}

/**
 * MediaPipe's raw label assumes a mirrored (selfie-view) frame — see the
 * `mirrored` doc above. Exported so it is independently testable without a
 * tracker, a Wasm module, or a camera.
 */
export function resolveHandedness(rawLabel: string | undefined, mirrored: boolean): Handedness {
  const raw: Handedness = (rawLabel ?? 'Right').toLowerCase().startsWith('l') ? 'left' : 'right';
  if (mirrored) return raw;
  return raw === 'left' ? 'right' : 'left';
}

/**
 * Raw MediaPipe result → `Hand[]`. Pure and exported for testing, mirroring
 * `pose-tracker.ts`'s `normalizePose`.
 *
 * No pixel division happens here (unlike `normalizePose`): MediaPipe's
 * `NormalizedLandmark` is already normalized [0,1] by the SDK against the
 * frame it was given, which is precisely why `HandTracker.estimate` never
 * needs frame dimensions the way `PoseTracker.estimate` does.
 */
export function normalizeHands(
  raw: RawHandLandmarkerResult,
  mirrored: boolean,
  minHandScore = 0,
): Hand[] {
  const hands: Hand[] = [];

  for (let i = 0; i < raw.landmarks.length; i++) {
    const rawPoints = raw.landmarks[i];
    if (!rawPoints || rawPoints.length < HAND_LANDMARK_NAMES.length) continue; // malformed — skip rather than crash

    const category = raw.handedness[i]?.[0];
    const score = category?.score ?? 0;
    if (score < minHandScore) continue;

    const landmarks: Landmark[] = HAND_LANDMARK_NAMES.map((name, idx) => {
      const p = rawPoints[idx];
      // `visibility` is copied through as the per-landmark score for
      // consistency with body Landmarks, but recognizers in this package
      // deliberately do NOT lean on it as the primary "is this hand usable"
      // signal — see the module doc in recognizers/hand-recognizer.ts for
      // why (unverified reliability for this specific task/model).
      return {
        name,
        x: p.x,
        y: p.y,
        score: p.visibility ?? 1,
        ...(p.z !== undefined ? { z: p.z } : {}),
      };
    });

    hands.push({
      landmarks,
      handedness: resolveHandedness(category?.categoryName, mirrored),
      score,
    });
  }

  return hands;
}

/**
 * Default HandTracker — MediaPipe HandLandmarker, VIDEO running mode.
 *
 * Config key names below were read off the installed package's own
 * `vision.d.ts` (`HandLandmarkerOptions`, `BaseOptions`) rather than guessed.
 */
export class HandLandmarkTracker implements HandTracker {
  readonly capabilities: TrackerCapabilities = { body: false, hands: true, face: false };
  readonly maxHands: number;

  private landmarker: RawHandLandmarker | null = null;
  private modelUrl: string;
  private wasmBase: string;
  private mirrored: boolean;
  private preferredDelegate: 'CPU' | 'GPU';
  private onDelegate: HandTrackerConfig['onDelegate'];
  private createLandmarkerFn: HandTrackerConfig['createLandmarker'];
  private cfg: RawHandLandmarkerOptions;

  /** Populated by init(). Null until then. */
  delegateInfo: HandDelegateInfo | null = null;

  /**
   * `detectForVideo` requires strictly increasing timestamps (documented
   * MediaPipe VIDEO-mode behaviour) but `estimate(frame)` intentionally keeps
   * the same single-argument shape as `PoseTracker.estimate` — mirroring that
   * seam exactly rather than adding a timestamp parameter it does not have.
   * `performance.now()` is monotonic but a caller invoking `estimate` twice in
   * the same tick (or a fake timer in a test) could produce two equal or
   * out-of-order values, so this nudges forward rather than trusting the
   * clock outright.
   */
  private lastTimestampMs = -1;

  constructor(config: HandTrackerConfig = {}) {
    this.maxHands = Math.max(1, config.maxHands ?? DEFAULT_MAX_HANDS);
    this.modelUrl = config.modelUrl ?? defaultHandModelUrl();
    this.wasmBase = config.wasmBase ?? defaultHandWasmBase();
    this.mirrored = config.mirrored ?? false;
    this.preferredDelegate = config.delegate ?? 'GPU';
    this.onDelegate = config.onDelegate;
    this.createLandmarkerFn = config.createLandmarker;
    this.cfg = {
      numHands: this.maxHands,
      minHandDetectionConfidence: config.minHandDetectionConfidence ?? 0.5,
      minHandPresenceConfidence: config.minHandPresenceConfidence ?? 0.5,
      minTrackingConfidence: config.minTrackingConfidence ?? 0.5,
      delegate: this.preferredDelegate,
    };
  }

  async init(): Promise<void> {
    if (this.landmarker) return;

    let create: (delegate: 'CPU' | 'GPU') => Promise<RawHandLandmarker>;

    if (this.createLandmarkerFn) {
      const fn = this.createLandmarkerFn;
      create = (delegate) => fn(delegate, this.modelUrl, this.wasmBase, { ...this.cfg, delegate });
    } else {
      // `@vite-ignore`: this package is a peerDependency (see package.json),
      // supplied by whoever bundles the final app — exactly like
      // `@tensorflow-models/pose-detection` above it in pose-tracker.ts.
      // Unlike that one, this repo's own demo build does not (yet) depend on
      // hands, so the bare specifier may not be resolvable in THIS repo's
      // node_modules at bundle time. The `@vite-ignore` hint stops
      // Vite/Rollup from trying to pre-resolve and chunk it at build time,
      // leaving it as a genuine runtime-only import — which is what a
      // peerDependency contract means: resolution happens in the consuming
      // app's own node_modules, not here.
      const { FilesetResolver, HandLandmarker } = await import(
        /* @vite-ignore */ '@mediapipe/tasks-vision'
      );
      // Loaded once, outside the per-delegate retry, so a GPU→CPU fallback
      // does not pay for the Wasm fileset fetch twice.
      const fileset = await FilesetResolver.forVisionTasks(this.wasmBase);

      create = (delegate) =>
        HandLandmarker.createFromOptions(fileset, {
          baseOptions: { modelAssetPath: this.modelUrl, delegate },
          runningMode: 'VIDEO',
          numHands: this.cfg.numHands,
          minHandDetectionConfidence: this.cfg.minHandDetectionConfidence,
          minHandPresenceConfidence: this.cfg.minHandPresenceConfidence,
          minTrackingConfidence: this.cfg.minTrackingConfidence,
        });
    }

    const { landmarker, info } = await selectHandDelegate(create, this.preferredDelegate);
    this.landmarker = landmarker;
    this.delegateInfo = info;
    if (info.warning) console.error('[wibbly-input] %s', info.warning);
    this.onDelegate?.(info);
  }

  /** Returns up to `maxHands` hands. See `Hand` for the coordinate/score contract. */
  async estimate(frame: Frame): Promise<Hand[]> {
    if (!this.landmarker) throw new Error('HandLandmarkTracker: init() not called');

    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const timestampMs = Math.max(now, this.lastTimestampMs + 1);
    this.lastTimestampMs = timestampMs;

    const raw = this.landmarker.detectForVideo(frame, timestampMs);
    return normalizeHands(raw ?? { landmarks: [], handedness: [] }, this.mirrored).slice(
      0,
      this.maxHands,
    );
  }

  dispose(): void {
    this.landmarker?.close?.();
    this.landmarker = null;
    this.lastTimestampMs = -1;
  }
}
