/**
 * Hand-only entry point — `@vulos/wibbly-input/hand`.
 *
 * Why this exists as a SEPARATE barrel from the package root (`./index.ts`):
 * the root barrel re-exports `pose-tracker.ts` and `recognizers/swing.ts`,
 * both of which import `@tensorflow-models/pose-detection` /
 * `@tensorflow/tfjs` at module scope. A consumer that only wants hands (no
 * body pose) would still pay for those imports being resolvable — fine
 * inside this workspace root, where the app already depends on tfjs for
 * tennis, but a real cost for a standalone consumer like `games/palmworks`
 * that has no use for pose detection at all and does not want tfjs in its
 * own `node_modules`/bundle.
 *
 * Everything exported here is hand/frame-source infrastructure with no
 * dependency on `@tensorflow*` — `hand-tracker.ts` depends only on the
 * peer-installed `@mediapipe/tasks-vision`, loaded lazily via a runtime
 * `import()` inside `HandLandmarkTracker.init()`, not at module scope.
 *
 * `HandInput` (`hand-pipeline.ts`) is the hand-only analogue of
 * `WibblyInput` (`pipeline.ts`) — same FrameSource → Tracker →
 * GestureRecognizer → callbacks shape, minus a `PlayerBinder` (there is no
 * hand equivalent yet — see hand-pipeline.ts's own doc comment).
 */

export * from './types';
export * from './frame-source';
export * from './hand-tracker';
export * from './recognizers/hand-recognizer';
export * from './recognizers/pinch';
export * from './recognizers/point';
export * from './pacer';
export * from './hand-pipeline';
