# Architecture

wibbly's architecture is four seams. Game code never names a model, a runtime or a vendor — it sees
only these interfaces, and every seam ships a working default.

> **Status.** The seams below are implemented. They live in `packages/wibbly-input`, published
> internally as `@vulos/wibbly-input` under Apache-2.0, with 77 unit tests that run without a camera.
> The tennis game consumes them. The old monolithic `src/poseDetection.js` — which did all four jobs
> at once and injected its own DOM — has been deleted. What is *not* proven is behaviour in a real
> room with real people; see the note at the end of this page.

## The pipeline

```
  camera
    │
    ▼
┌─────────────┐   VideoFrame   ┌──────────────┐   Person[]   ┌──────────────┐
│ FrameSource │ ─────────────▶ │ PoseTracker  │ ───────────▶ │ PlayerBinder │
└─────────────┘                └──────────────┘              └──────┬───────┘
                                                        stable PlayerId
                                                                    │
                              ┌──────────────────┐   GestureEvent   ▼
                    game ◀─── │ GestureRecognizer│ ◀────────── (landmarks)
                              └──────────────────┘
                                       ▲
                                 Calibration
                          (handedness, reach envelope)
```

Pixels enter on the left and never reach the right. What crosses into game code is a `GestureEvent`
of a few dozen bytes.

## 1. `FrameSource` — where pixels come from

```ts
interface FrameSource {
  start(opts: { width: number; height: number; fps: number }): Promise<void>;
  stop(): void;
  onFrame(cb: (frame: VideoFrame | HTMLVideoElement) => void): void;
}
```

Implementations own their own capture loop and push frames to the tracker.

- **Default — `WebcamFrameSource`.** `getUserMedia` in a browser tab. It owns its capture loop and
  no longer appends anything to your `document.body`; the preview is a component you place.
- **Phase 3 — `NativeFrameSource`.** Rust-side `nokhwa` capture under Tauri. Frames never cross IPC;
  see [Runtime targets](/products/wibbly/docs/runtime-targets).

## 2. `PoseTracker` — pixels to skeletons

```ts
interface PoseTracker {
  init(): Promise<void>;
  estimate(frame: Frame): Promise<Person[]>;   // Person[] — plural is the point
  readonly maxPeople: number;
  readonly capabilities: { body: boolean; hands: boolean; face: boolean };
}
```

The plural return type is the whole design decision. The old code returned `poses[0]` and discarded
the rest, which is what blocked every multi-player capability downstream.

- **Default — `MoveNetMultiPoseTracker`.** Pins `modelType: 'MultiPose.Lightning'`, returns up to six
  people at flat inference cost, and normalises every landmark to `[0,1]` in image space with the
  origin top-left. See [Model selection](/products/wibbly/docs/models).
- **Optional — `HandLandmarkTracker`.** MediaPipe, composable alongside the body tracker.
- **Future — `RtmoOnnxTracker`.** Same interface, ONNX Runtime Web, phase 3.

## 3. `GestureRecognizer` — skeletons to game events

```ts
interface GestureRecognizer {
  feed(people: Person[], tNow: number): GestureEvent[];
}

type GestureEvent = {
  playerId: PlayerId;          // stable across frames — see §4
  kind: string;                // 'swing' | 'punch' | 'pinch' | 'point' | custom
  confidence: number;          // 0..1 — games MUST handle low confidence
  vector?: { x: number; y: number; z?: number };
  tCapture: number;            // capture timestamp, NOT detection timestamp
};
```

Two fields matter more than they look.

**`confidence` is not decoration.** A camera is a probabilistic sensor. A game that treats a 0.31
swing the same as a 0.94 swing will feel broken in poor lighting, and no amount of tracker work will
fix that for it. Games must handle low confidence.

**`tCapture`, not detection time.** Inference latency varies frame to frame. Stamping an event with
the moment the model finished, rather than the moment the photons arrived, injects that jitter
straight into gameplay.

The old swing heuristic is now `SwingRecognizer`, wrapping a pure `detectSwing` function over
landmark history — one implementation among many, and **unit-testable without a camera**. Twenty-four
of the suite's tests cover it, including the handedness cases that used to be an empty `TODO`.

## 4. `PlayerBinder` — which skeleton is which player

The hard problem demos skip. MoveNet MultiPose returns up to six people per frame with **no stable
identity across frames**. A binder assigns durable `PlayerId`s.

- **Default — `SpatialBinder`.** Greedy nearest-centroid matching over torso centroids frame to
  frame, with a configurable claim zone per player — left half or right half of the frame — and a
  forget timeout so a player who steps out briefly keeps their id.
- Handles occlusion, a player leaving and returning, and two players crossing over, across 18 tests.

**This remains the single highest-risk component in the project**, and passing tests do not retire
that risk. Occlusion and crossover are exactly the cases where synthetic fixtures are most likely to
be kinder than a real room.

## 5. `Calibration`

Per-player setup: handedness — which kills the right-handed hardcode — reach envelope, camera framing
check, and a lighting warning. Persisted locally, keyed to `PlayerId`.

## Relationship to magnetite

wibbly is a **client** of [magnetite](https://github.com/vul-os/magnetite)'s seams, not a fork of
them. Identity, payments, discovery, lobbies and hosting are solved there; rebuilding them in
JavaScript would be a straight waste. magnetite gains an `InputProvider` seam so gesture input has a
defined entry point.

The boundary is anti-cheat. magnetite's replay verification assumes deterministic input; gesture
input is not deterministic and cannot be replay-verified. Gesture games therefore run
**client-attested** — spelled out in [Multiplayer & anti-cheat](/products/wibbly/docs/multiplayer).

No wibbly code talks to magnetite today. The seam is proposed, not merged.

## What phase 1 actually changed

For contrast, the audited state of the deleted `src/poseDetection.js` (~480 lines) and what replaced
each line of it:

| Was | Is |
|---|---|
| MoveNet **SinglePose** (the `modelType` line was commented out) | `MoveNetMultiPoseTracker`, pinned to `MultiPose.Lightning` |
| 15 fps target **and** every-third-frame skip | `AdaptivePacer`, driven by measured frame time |
| `processPoses()` hardcoding `poses[0]` | `Person[]` through `SpatialBinder`, up to six skeletons |
| `isRightHanded = true`, left branch an empty `TODO` | Handedness as a sign flip, both cases tested |
| Swing logic entangled with the camera and the DOM | Pure `detectSwing` over landmark history |
| `document.body.appendChild()` of a preview `<div>` and a "Hide Camera" `<button>` | An overlay component the host places |
| Not importable, not testable | `@vulos/wibbly-input`, 77 passing tests |

Every seam existed to dismantle one line of the left column.

## What is still unproven

Say this out loud, because a green suite invites the wrong conclusion. The tests exercise the seams
against **fixtures**, not against cameras. Nobody has yet stood four people in front of a webcam and
confirmed that `SpatialBinder` keeps their ids straight when two of them cross, or that MultiPose
holds up at the back of a living room in poor light. Until that happens, multi-person support is
implemented and unvalidated — which is a real state, distinct from both "planned" and "working".
