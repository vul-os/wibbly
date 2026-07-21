# @vulos/wibbly-input

Camera-gesture input seams for Wibbly. Turns camera frames into `GestureEvent`s.
Game code names only the interfaces below — never a model, a runtime, or a
vendor. Every seam ships a working default. See `WIBBLY.md` (repo root) §3 for
the full spec this package implements.

No magnetite dependency. No DOM injection (an implementation may create a
detached `<video>` it needs internally, but attaching anything to the page —
preview, buttons, styling — is the consumer's job). Zero external network
requests until a consumer actually starts a tracker.

## Seams

| # | Seam | Default implementation | File |
|---|---|---|---|
| 3.1 | `FrameSource` | `WebcamFrameSource` | `src/frame-source.ts` |
| 3.2 | `PoseTracker` (body) | `MoveNetMultiPoseTracker` | `src/pose-tracker.ts` |
| 3.2 | `HandTracker` (hands) | `HandLandmarkTracker` | `src/hand-tracker.ts` |
| 3.3 | `GestureRecognizer` (body) | `SwingRecognizer` | `src/recognizers/swing.ts` |
| 3.3 | `HandGestureRecognizer` (hands) | `PinchRecognizer`, `PointRecognizer` | `src/recognizers/pinch.ts`, `src/recognizers/point.ts` |
| 3.4 | `PlayerBinder` | `SpatialBinder` | `src/binder.ts` |
| 3.5 | `Calibration` | `Calibration` (localStorage-backed) | `src/calibration.ts` |
| — | Pipeline | `WibblyInput` wires all of the above | `src/pipeline.ts` |

Coordinate contract (load-bearing, read `src/types.ts` before implementing a
seam): every landmark is normalized `[0,1]` against the source frame, origin
top-left, image space (NOT mirrored — a mirrored preview is a rendering
concern). This is what makes every recognizer in this package unit-testable
against synthetic fixtures with no camera, no GPU, and no model — see `test/`.

## Body vs. hands: two different trackers, one pipeline

`PoseTracker` and `HandTracker` are deliberately separate interfaces, not one
unified tracker. They are two different models with two different lifecycles
(MoveNet MultiPose Lightning for bodies, MediaPipe HandLandmarker for hands),
and a consumer is free to run zero, one, or both against the same frame.
`GestureRecognizer` (body) and `HandGestureRecognizer` (hands) are similarly
separate: forcing `Person` and `Hand` skeletons through one signature would
mean either union-typing every recognizer or smuggling one skeleton kind
through as a fake of the other.

### Hands: identity is `(playerId, handedness)`, not a durable per-hand track id

There is no hand equivalent of `SpatialBinder` in this package yet. Pinch and
Point key their internal state by `(playerId, handedness)`. This is exactly
right for one player using both hands (the common case this was built for —
palmworks' "build a factory with your hands") and wrong for two **unbound**
people's hands sharing one `playerId` (their left hands would be
indistinguishable). A caller with multiple people must assign distinct
`playerId`s per person — e.g. from `PlayerBinder` output correlated to a
wrist's proximity to a bound body — before handing hands to these recognizers.

## What a consumer must vendor

This package makes **zero** network requests on its own. Trackers require an
explicit asset location (`modelUrl`, and for hands also `wasmBase`) — there is
no silent default that reaches for a CDN, only a named opt-in constant. Vendor
same-origin under CSP `default-src 'self'`, or opt into the CDN URLs below.

### Body: MoveNet MultiPose Lightning (already vendored in this repo)

One file, `model.json` + weight shards, under
`public/models/movenet-multipose-lightning/`. Package: `@tensorflow/tfjs` +
`@tensorflow-models/pose-detection` (peer dependencies), Apache 2.0.

### Hands: MediaPipe HandLandmarker (NOT yet vendored anywhere in this repo)

Two independent things need a location:

1. **The model asset** — `hand_landmarker.task`.
   URL: `HAND_LANDMARKER_TASK_CDN_URL` (`hand-tracker.ts`) —
   `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/latest/hand_landmarker.task`.
   **Size verified by this package via a live HEAD request on 2026-07-21:
   exactly 7,819,105 bytes (~7.46 MiB).** Google does not publish this number
   in its docs; it is stated here as a measured fact.
2. **The Wasm runtime** itself, shipped inside the `@mediapipe/tasks-vision`
   npm package's own `wasm/` directory (NOT the model — this is the engine
   that runs it): `vision_wasm_internal.js` + `.wasm` (~9.07 MiB) and the
   `_nosimd_` variant (~8.94 MiB) — `FilesetResolver` picks whichever the
   browser supports at runtime. Total on disk: **~18 MB** for both variants.
   License: Apache 2.0 (`@mediapipe/tasks-vision`'s own `package.json`).

To vendor same-origin: copy `hand_landmarker.task` and
`node_modules/@mediapipe/tasks-vision/wasm/*` into your served assets (e.g.
`public/models/hand-landmarker/...`, mirroring the MoveNet layout) and pass
`modelUrl`/`wasmBase` pointing at them. `HandTrackerConfig`'s doc comments
spell out every rung. **This repo's own demo build does not do this yet** —
`HandLandmarkTracker` is fully tree-shaken out of `dist/` today because
nothing in the demo app calls it; the moment a consumer does, these ~25 MB of
assets need a real vendoring location, which is a real operational cost worth
planning for (an order of magnitude more than MoveNet Lightning's weights).

`FilesetResolver.forVisionTasks(basePath)`'s own doc is explicit that
`basePath` is optional and, if omitted, Wasm files load "from the host's root
directory" — there is **no CDN fallback** baked into the package the way
MoveNet defaults to TF Hub. Passing neither `modelUrl` nor `wasmBase` is not a
safe default in a build with no vendored copy; `init()` will 404.

## The CSP caveat that is different for hands than for bodies

`PoseTracker`'s `selectBackend` can claim a CSP-safe pure-JS `cpu` TFJS backend
as a genuine last resort (see `pose-tracker.ts`). **There is no equivalent for
hands.** MediaPipe Tasks Vision is a WebAssembly runtime with no pure-JS
fallback of any kind — both the `CPU` and `GPU` delegate options select a
compute backend *inside* the same Wasm module, which still has to be
`WebAssembly.instantiate`d either way. A CSP that forbids `'wasm-unsafe-eval'`
in `script-src` (the documented production embed CSP:
`script-src 'self' 'unsafe-inline'`) blocks hand tracking **entirely, on any
delegate**. This is exported as `HAND_TRACKING_REQUIRES_WASM_UNSAFE_EVAL`
(`hand-tracker.ts`) so a consumer can gate a "hand tracking unavailable here"
message on it rather than discovering it via a silent failure to ever emit a
`Hand`.

## Licensing (per WIBBLY.md §4, researched 2026-07-20)

Both the body and hand models used here are Apache 2.0. WIBBLY.md's model
research explicitly **rejected** WiLoR (CC BY-NC-ND — non-commercial AND
no-derivatives) and HaMeR (non-commercial terms; MANO restricts commercial use
independently) for hand tracking. This package must never gain a dependency on
either.

## Testing

`npm run test --workspace @vulos/wibbly-input` — every test runs with **no
camera, no network, no GPU**. Trackers are driven through an injectable
detector/landmarker (`createDetector` / `createLandmarker` config options);
recognizers are pure functions over synthetic landmark fixtures
(`test/fixtures.ts`).

## Honesty notes — things this package could NOT verify without real hardware

- **MediaPipe's per-landmark `visibility` field reliability for hands is
  unverified.** No GPU/browser was available while building this. Hand
  recognizers therefore do not lean on `visibility` as the primary "is this
  landmark usable" signal — they combine it with `landmarkInFrame` (an
  in-bounds check), and default to treating an out-of-range landmark as
  unusable regardless of its reported score. See `recognizers/hand-recognizer.ts`.
- **Pinch/Point threshold constants** (`DEFAULT_PINCH_CONFIG`,
  `DEFAULT_POINT_CONFIG`) are reasoned defaults grounded in hand-topology
  geometry, not measured against real MediaPipe output on a real hand. Expect
  to tune them per game.
- **The mirrored-handedness correction is verified against MediaPipe's own
  upstream docs** (`google/mediapipe` `docs/solutions/hands.md`: "handedness
  is determined assuming the input image is mirrored... If it is not the
  case, please swap the handedness output"), not against a live run of the
  Tasks HandLandmarker specifically — the Tasks-specific docs page does not
  restate the convention independently, so this is inherited, not
  independently reconfirmed.
- **`detectForVideo`'s strictly-increasing-timestamp requirement** is
  documented MediaPipe VIDEO-mode behaviour; `HandLandmarkTracker` guards
  against it defensively (`estimate()`'s monotonic nudge), but the guard's
  necessity was not exercised against the real Wasm runtime.
