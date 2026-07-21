/**
 * @vulos/wibbly-input — camera gesture input seams for Wibbly.
 *
 * Implements §3 of WIBBLY.md. Game code names only these interfaces: never a
 * model, a runtime, or a vendor. Every seam ships a working default.
 *
 *   §3.1 FrameSource        → WebcamFrameSource
 *   §3.2 PoseTracker        → MoveNetMultiPoseTracker (MoveNet MultiPose Lightning)
 *   §3.2 HandTracker        → HandLandmarkTracker (MediaPipe HandLandmarker)
 *   §3.3 GestureRecognizer  → SwingRecognizer (pure `detectSwing` core)
 *   §3.3 HandGestureRecognizer → PinchRecognizer, PointRecognizer
 *   §3.4 PlayerBinder       → SpatialBinder
 *   §3.5 Calibration        → Calibration (localStorage-backed)
 *
 * Coordinate contract: all landmarks are normalized [0,1], image space,
 * origin top-left. See types.ts.
 */

export * from './types';
export * from './frame-source';
export * from './pose-tracker';
export * from './hand-tracker';
export * from './binder';
export * from './recognizers/swing';
export * from './recognizers/hand-recognizer';
export * from './recognizers/pinch';
export * from './recognizers/point';
export * from './calibration';
export * from './pacer';
export * from './overlay';
export * from './pipeline';
