# Architecture

wibbly's architecture is four seams. Game code never names a model, a runtime or a vendor — it sees
only these interfaces, and every seam ships a working default.

> **Status.** The seams below are implemented. They live in `packages/wibbly-input` as
> `@vulos/wibbly-input`, MIT licensed like the rest of the repo, with 86 unit tests that run without
> a camera. The tennis game consumes them. The old monolithic `src/poseDetection.js` — which did all
> four jobs at once and injected its own DOM — has been deleted.
>
> What is *not* proven is behaviour in a real room with real people. Every multi-person test in the
> suite runs against **synthetic skeleton fixtures**, so `MoveNetMultiPoseTracker` and `SpatialBinder`
> have never seen two real people. Treat them as implemented and unvalidated — which is a weaker
> claim than working, and a stronger one than planned. See the note at the end of this page.

## The pipeline

<style>
.wbf{--a:#C4006B;--am:#8A4B00;--ok:#0F7A3D;--tx:#140F1B;--tx2:#544A61;--ln:#BEB2CD;--sf:#F5F1F9;--pg:#FFFFFF;margin:1.75rem 0}
:root[data-theme="dark"] .wbf{--a:#FF4D9D;--am:#FFB020;--ok:#3FE08A;--tx:#F5F1FA;--tx2:#ADA2BE;--ln:#3A2C52;--sf:#171122;--pg:#0E0A16}
.wbf>.sc{overflow-x:auto;border:1px solid var(--ln);border-radius:10px;background:var(--pg)}
.wbf svg{display:block;height:auto;width:100%;min-width:620px}
.wbf img{display:block;width:100%;height:auto}
.wbf figcaption{font-size:.82rem;line-height:1.65;color:var(--tx2);margin-top:.65rem}
.wbf figcaption b{color:var(--tx)}
</style>

<figure class="wbf">
<div class="sc">
<svg viewBox="0 0 900 250" width="900" role="img" aria-label="The four seams in order: FrameSource captures frames, PoseTracker turns them into an array of people, PlayerBinder attaches durable player identities, and GestureRecognizer emits GestureEvents to the game. Calibration feeds the recognizer. All of it runs inside the device.">
  <defs>
    <marker id="a-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 z" fill="var(--ln)"/>
    </marker>
  </defs>
  <g font-family="ui-monospace, monospace">
    <rect x="2" y="14" width="896" height="176" rx="10" fill="none" stroke="var(--a)" stroke-width="1.2" stroke-dasharray="6 6" opacity=".6"/>
    <text x="16" y="33" font-size="10" font-weight="700" fill="var(--a)" letter-spacing="1.3">YOUR DEVICE — PIXELS NEVER LEAVE THIS BOX</text>
    <rect x="14" y="48" width="176" height="86" rx="8" fill="var(--sf)" stroke="var(--ln)"/>
    <text x="28" y="69" font-size="9" fill="var(--tx2)" letter-spacing="1.3">SEAM 01</text>
    <text x="28" y="90" font-size="13.5" font-weight="700" fill="var(--tx)">FrameSource</text>
    <text x="28" y="109" font-size="10" fill="var(--tx2)">WebcamFrameSource</text>
    <text x="28" y="125" font-size="10" fill="var(--tx2)">getUserMedia</text>
    <rect x="238" y="48" width="176" height="86" rx="8" fill="var(--sf)" stroke="var(--ln)"/>
    <text x="252" y="69" font-size="9" fill="var(--tx2)" letter-spacing="1.3">SEAM 02</text>
    <text x="252" y="90" font-size="13.5" font-weight="700" fill="var(--tx)">PoseTracker</text>
    <text x="252" y="109" font-size="10" fill="var(--tx2)">MoveNet MultiPose</text>
    <text x="252" y="125" font-size="10" fill="var(--tx2)">→ Person[]</text>
    <rect x="462" y="48" width="176" height="86" rx="8" fill="var(--sf)" stroke="var(--ln)"/>
    <text x="476" y="69" font-size="9" fill="var(--tx2)" letter-spacing="1.3">SEAM 04</text>
    <text x="476" y="90" font-size="13.5" font-weight="700" fill="var(--tx)">PlayerBinder</text>
    <text x="476" y="109" font-size="10" fill="var(--tx2)">SpatialBinder</text>
    <text x="476" y="125" font-size="10" fill="var(--tx2)">→ stable PlayerId</text>
    <rect x="686" y="48" width="196" height="86" rx="8" fill="none" stroke="var(--a)" stroke-width="1.4"/>
    <text x="700" y="69" font-size="9" fill="var(--tx2)" letter-spacing="1.3">SEAM 03</text>
    <text x="700" y="90" font-size="13.5" font-weight="700" fill="var(--tx)">GestureRecognizer</text>
    <text x="700" y="109" font-size="10" fill="var(--tx2)">detectSwing()</text>
    <text x="700" y="125" font-size="10" font-weight="700" fill="var(--a)">→ GestureEvent</text>
    <g stroke="var(--ln)" stroke-width="1.6" marker-end="url(#a-arw)" fill="none">
      <path d="M194 91 H232"/>
      <path d="M418 91 H456"/>
      <path d="M642 91 H680"/>
    </g>
    <text x="196" y="83" font-size="9" fill="var(--tx2)">VideoFrame</text>
    <text x="422" y="83" font-size="9" fill="var(--tx2)">Person[]</text>
    <text x="646" y="83" font-size="9" fill="var(--tx2)">+ id</text>
    <rect x="686" y="156" width="196" height="26" rx="6" fill="var(--sf)" stroke="var(--ln)"/>
    <text x="700" y="173" font-size="10" fill="var(--tx2)">Calibration — handedness, reach</text>
    <path d="M784 154 V140" stroke="var(--ln)" stroke-width="1.6" fill="none" marker-end="url(#a-arw)"/>
    <path d="M882 91 H896 Q900 91 900 99 V210 Q900 218 892 218 H726" stroke="var(--a)" stroke-width="1.6" fill="none" marker-end="url(#a-arw)"/>
    <text x="740" y="214" font-size="11" font-weight="700" fill="var(--a)">game code — the only thing it ever sees</text>
  </g>
</svg>
</div>
<figcaption><b>Pixels enter on the left and never reach the right.</b> What crosses into game code is a <code>GestureEvent</code> of a few dozen bytes. Each seam ships a working default, and each one can be replaced without the game noticing.</figcaption>
</figure>

The shape of that diagram is the whole argument: it is a **reduction**. Every stage throws away
information the next stage does not need, and the thing that survives to the end is too small to be
worth intercepting.

<figure class="wbf">
<div class="sc">
<svg viewBox="0 0 900 200" width="900" role="img" aria-label="Data volume across the pipeline, on a log scale: a camera frame is about 8 megabytes, a landmark set about 1 kilobyte, a bound skeleton about 1 kilobyte plus an id, and a GestureEvent about 64 bytes.">
  <g font-family="ui-monospace, monospace">
    <text x="16" y="26" font-size="10" fill="var(--tx2)" letter-spacing="1.3">VOLUME PER STAGE — LOG SCALE</text>
    <text x="16" y="60" font-size="11" fill="var(--tx)">Camera frame</text>
    <rect x="180" y="49" width="600" height="13" rx="2" fill="var(--a)"/>
    <text x="800" y="60" font-size="11" font-weight="700" fill="var(--tx)">8 MB</text>
    <text x="16" y="94" font-size="11" fill="var(--tx)">Landmark set</text>
    <rect x="180" y="83" width="288" height="13" rx="2" fill="var(--am)"/>
    <text x="800" y="94" font-size="11" font-weight="700" fill="var(--tx)">~1 KB</text>
    <text x="16" y="128" font-size="11" fill="var(--tx)">Bound skeleton</text>
    <rect x="180" y="117" width="276" height="13" rx="2" fill="var(--am)"/>
    <text x="800" y="128" font-size="11" font-weight="700" fill="var(--tx)">~1 KB + id</text>
    <text x="16" y="162" font-size="11" fill="var(--tx)">GestureEvent</text>
    <rect x="180" y="151" width="72" height="13" rx="2" fill="var(--ok)"/>
    <text x="800" y="162" font-size="11" font-weight="700" fill="var(--tx)">≈64 B</text>
    <text x="180" y="186" font-size="9" fill="var(--tx2)">8 MB → 64 B is five orders of magnitude; drawn linearly the last bar would be invisible.</text>
  </g>
</svg>
</div>
<figcaption>The privacy guarantee and the architecture are the <b>same fact</b> seen twice. By the time the pipeline produces something worth transmitting, the pixels are three stages gone.</figcaption>
</figure>

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

A `packages/wibbly-magnetite` integration is being written now. It has **not** been proven against a
live magnetite node, so nothing in wibbly's shipping path talks to magnetite today — treat the
integration as in progress, not available.

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
| Not importable, not testable | `@vulos/wibbly-input`, 86 passing tests |

Every seam existed to dismantle one line of the left column.

## What is still unproven

Say this out loud, because a green suite invites the wrong conclusion. The tests exercise the seams
against **fixtures**, not against cameras. Nobody has yet stood four people in front of a webcam and
confirmed that `SpatialBinder` keeps their ids straight when two of them cross, or that MultiPose
holds up at the back of a living room in poor light. Until that happens, multi-person support is
implemented and unvalidated — which is a real state, distinct from both "planned" and "working".
