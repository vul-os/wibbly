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

export interface MoveNetTrackerConfig {
  /** Up to 6 — the model's hard ceiling. */
  maxPeople?: number;
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
  private cfg: Required<Omit<MoveNetTrackerConfig, 'createDetector'>>;
  private createDetectorFn: MoveNetTrackerConfig['createDetector'];

  constructor(config: MoveNetTrackerConfig = {}) {
    this.maxPeople = Math.min(config.maxPeople ?? MOVENET_MAX_PEOPLE, MOVENET_MAX_PEOPLE);
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

    this.detector = (await poseDetection.createDetector(
      poseDetection.SupportedModels.MoveNet,
      this.modelConfig() as never,
    )) as unknown as RawDetector;
  }

  private modelConfig(): Record<string, unknown> {
    return {
      // 'MultiPose.Lightning' — was SinglePose before, which is why multi-player was impossible.
      modelType: 'MultiPose.Lightning',
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
