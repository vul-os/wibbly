# Architecture

wibbly's architecture is four seams. Game code never names a model, a runtime or a vendor — it sees
only these interfaces, and every seam ships a working default.

> **Status.** The seams below are implemented. They live in `packages/wibbly-input` as
> `@vulos/wibbly-input`, MIT licensed like the rest of the repo, with 221 unit tests that run without
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
.wbf svg{display:block;height:auto;width:100%;min-width:1220px}
.wbf img{display:block;width:100%;height:auto}
.wbf figcaption{font-size:.82rem;line-height:1.65;color:var(--tx2);margin-top:.65rem}
.wbf figcaption b{color:var(--tx)}
</style>

<figure class="wbf">
<div class="sc">
<svg viewBox="0 0 1220 300" width="1220" role="img" aria-label="The four seams in order: FrameSource captures frames, PoseTracker turns them into an array of people, PlayerBinder attaches durable player identities, and GestureRecognizer emits GestureEvents to the game. Calibration feeds the recognizer. All of it runs inside the device.">
  <defs>
    <marker id="a-arw" viewBox="0 0 12 12" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 12 6 L 0 12 z" fill="var(--ln)"/>
    </marker>
  </defs>
  <g font-family="ui-monospace, monospace">
    <rect x="2.4" y="16.8" width="1075.2" height="211.2" rx="12" fill="none" stroke="var(--a)" stroke-width="1.44" stroke-dasharray="7.2 7.2" opacity=".6"/>
    <text x="19.2" y="39.6" font-size="12.6" font-weight="700" fill="var(--a)" letter-spacing="1.56">YOUR DEVICE — PIXELS NEVER LEAVE THIS BOX</text>
    <rect x="16.8" y="57.6" width="211.2" height="103.2" rx="9.6" fill="var(--sf)" stroke="var(--ln)"/>
    <text x="33.6" y="82.8" font-size="12.6" fill="var(--tx2)" letter-spacing="1.56">SEAM 01</text>
    <text x="33.6" y="108" font-size="16.2" font-weight="700" fill="var(--tx)">FrameSource</text>
    <text x="33.6" y="130.8" font-size="12.6" fill="var(--tx2)">WebcamFrameSource</text>
    <text x="33.6" y="150" font-size="12.6" fill="var(--tx2)">getUserMedia</text>
    <rect x="285.6" y="57.6" width="211.2" height="103.2" rx="9.6" fill="var(--sf)" stroke="var(--ln)"/>
    <text x="302.4" y="82.8" font-size="12.6" fill="var(--tx2)" letter-spacing="1.56">SEAM 02</text>
    <text x="302.4" y="108" font-size="16.2" font-weight="700" fill="var(--tx)">PoseTracker</text>
    <text x="302.4" y="130.8" font-size="12.6" fill="var(--tx2)">MoveNet MultiPose</text>
    <text x="302.4" y="150" font-size="12.6" fill="var(--tx2)">→ Person[]</text>
    <rect x="554.4" y="57.6" width="211.2" height="103.2" rx="9.6" fill="var(--sf)" stroke="var(--ln)"/>
    <text x="571.2" y="82.8" font-size="12.6" fill="var(--tx2)" letter-spacing="1.56">SEAM 04</text>
    <text x="571.2" y="108" font-size="16.2" font-weight="700" fill="var(--tx)">PlayerBinder</text>
    <text x="571.2" y="130.8" font-size="12.6" fill="var(--tx2)">SpatialBinder</text>
    <text x="571.2" y="150" font-size="12.6" fill="var(--tx2)">→ stable PlayerId</text>
    <rect x="823.2" y="57.6" width="235.2" height="103.2" rx="9.6" fill="none" stroke="var(--a)" stroke-width="1.68"/>
    <text x="840" y="82.8" font-size="12.6" fill="var(--tx2)" letter-spacing="1.56">SEAM 03</text>
    <text x="840" y="108" font-size="16.2" font-weight="700" fill="var(--tx)">GestureRecognizer</text>
    <text x="840" y="130.8" font-size="12.6" fill="var(--tx2)">detectSwing()</text>
    <text x="840" y="150" font-size="12.6" font-weight="700" fill="var(--a)">→ GestureEvent</text>
    <g stroke="var(--ln)" stroke-width="1.92" marker-end="url(#a-arw)" fill="none">
      <path d="M 232.8 109.2 H 278.4"/>
      <path d="M 501.6 109.2 H 547.2"/>
      <path d="M 770.4 109.2 H 816"/>
    </g>
    <text x="235.2" y="99.6" font-size="12.6" fill="var(--tx2)">VideoFrame</text>
    <text x="506.4" y="99.6" font-size="12.6" fill="var(--tx2)">Person[]</text>
    <text x="775.2" y="99.6" font-size="12.6" fill="var(--tx2)">+ id</text>
    <rect x="823.2" y="187.2" width="235.2" height="31.2" rx="7.2" fill="var(--sf)" stroke="var(--ln)"/>
    <text x="840" y="207.6" font-size="12.6" fill="var(--tx2)">Calibration — handedness, reach</text>
    <path d="M 940.8 184.8 V 168" stroke="var(--ln)" stroke-width="1.92" fill="none" marker-end="url(#a-arw)"/>
    <path d="M 1058.4 109.2 H 1075.2 Q 1080 109.2 1080 118.8 V 252 Q 1080 261.6 1070.4 261.6 H 871.2" stroke="var(--a)" stroke-width="1.92" fill="none" marker-end="url(#a-arw)"/>
    <text x="888" y="256.8" font-size="13.2" font-weight="700" fill="var(--a)">game code — the only thing it ever sees</text>
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
<svg viewBox="0 0 1080 240" width="1080" role="img" aria-label="Data volume across the pipeline, on a log scale: a camera frame is about 8 megabytes, a landmark set about 1 kilobyte, a bound skeleton about 1 kilobyte plus an id, and a GestureEvent about 64 bytes.">
  <g font-family="ui-monospace, monospace">
    <text x="19.2" y="31.2" font-size="12.6" fill="var(--tx2)" letter-spacing="1.56">VOLUME PER STAGE — LOG SCALE</text>
    <text x="19.2" y="72" font-size="13.2" fill="var(--tx)">Camera frame</text>
    <rect x="216" y="58.8" width="720" height="15.6" rx="2.4" fill="var(--a)"/>
    <text x="960" y="72" font-size="13.2" font-weight="700" fill="var(--tx)">8 MB</text>
    <text x="19.2" y="112.8" font-size="13.2" fill="var(--tx)">Landmark set</text>
    <rect x="216" y="99.6" width="345.6" height="15.6" rx="2.4" fill="var(--am)"/>
    <text x="960" y="112.8" font-size="13.2" font-weight="700" fill="var(--tx)">~1 KB</text>
    <text x="19.2" y="153.6" font-size="13.2" fill="var(--tx)">Bound skeleton</text>
    <rect x="216" y="140.4" width="331.2" height="15.6" rx="2.4" fill="var(--am)"/>
    <text x="960" y="153.6" font-size="13.2" font-weight="700" fill="var(--tx)">~1 KB + id</text>
    <text x="19.2" y="194.4" font-size="13.2" fill="var(--tx)">GestureEvent</text>
    <rect x="216" y="181.2" width="86.4" height="15.6" rx="2.4" fill="var(--ok)"/>
    <text x="960" y="194.4" font-size="13.2" font-weight="700" fill="var(--tx)">≈64 B</text>
    <text x="216" y="223.2" font-size="12.6" fill="var(--tx2)">8 MB → 64 B is five orders of magnitude; drawn linearly the last bar would be invisible.</text>
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
  see [Runtime targets](/projects/wibbly/docs/runtime-targets).

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
  origin top-left. See [Model selection](/projects/wibbly/docs/models).
- **Optional — `HandLandmarkTracker`.** MediaPipe, composable alongside the body tracker. Built and
  unit-tested as a standalone tracker, but `WibblyInput`'s pipeline does not compose it yet — it
  still wires body pose and `SwingRecognizer` only.
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

## Every capability, one of three states

Every claim in these docs is one of three states, never a blend — this is the full,
capability-by-capability table for developers; the player-language version of the same honesty is
[What's in it today](/projects/wibbly/docs/whats-in-it-today).

<figure class="wbf">
<div class="sc">
<svg viewBox="0 0 1080 228" width="1080" role="img" aria-label="A key to the three-state honesty convention used throughout these docs: a filled dot means shipped and working, a half-filled dot means implemented but only unit-tested on synthetic fixtures and never validated with a camera, and a hollow ring means planned with no code.">
  <g font-family="ui-monospace, monospace">
    <text x="19.2" y="26.4" font-size="12.6" fill="var(--tx2)" letter-spacing="1.56">HOW TO READ THE STATE COLUMN — ONE OF THREE GLYPHS, ALWAYS</text>
    <circle cx="36" cy="62.4" r="13.2" fill="var(--ok)"/>
    <text x="67.2" y="58.8" font-size="15.6" font-weight="700" fill="var(--tx)">Shipped / working</text>
    <text x="67.2" y="78" font-size="12.6" fill="var(--tx2)">Runs today, exercised by hand or by CI against real inputs.</text>
    <path d="M36 111.6 A13.2 13.2 0 0 1 36 138 Z" fill="var(--am)"/>
    <circle cx="36" cy="124.8" r="13.2" fill="none" stroke="var(--am)" stroke-width="1.92"/>
    <text x="67.2" y="121.2" font-size="15.6" font-weight="700" fill="var(--tx)">Implemented, unvalidated</text>
    <text x="67.2" y="140.4" font-size="12.6" fill="var(--tx2)">Unit-tested on synthetic fixtures only — never run against a real camera.</text>
    <circle cx="36" cy="187.2" r="13.2" fill="none" stroke="var(--ln)" stroke-width="1.92"/>
    <text x="67.2" y="183.6" font-size="15.6" font-weight="700" fill="var(--tx)">Planned / spec</text>
    <text x="67.2" y="202.8" font-size="12.6" fill="var(--tx2)">Written down, tracked in the backlog. No code exists yet.</text>
  </g>
</svg>
</div>
<figcaption>Three states, not two. <b>The middle one is the trap</b> — a green test suite over synthetic fixtures proves the logic does what was intended, and says nothing about whether it survives a real room.</figcaption>
</figure>

| Capability | State |
|---|---|
| `@vulos/wibbly-input` — four seams + Calibration, importable | **Implemented**, 221 tests green |
| Browser pose tracking (TF.js MoveNet, WebGL) | **Working** |
| Multi-person tracking (`MultiPose.Lightning`, up to 6) | **Implemented**, synthetic fixtures only |
| `SpatialBinder` — durable `PlayerId`s, claim zones, occlusion | **Implemented**, synthetic fixtures only |
| `swing` gesture as a pure `detectSwing` function | **Implemented**, unit-tested |
| Left- and right-handed play | **Implemented**, unit-tested |
| Adaptive frame pacing | **Implemented**, unit-tested |
| Tennis reference game, running on the seams | **Working** |
| Firebase Analytics | **Removed** — no SDK, no dependency |
| Multi-person play validated with real people | **Not validated** — fixtures are not a living room |
| 2-player tennis | **Next** — the binder is multi-player, the game is not |
| Soccer, Boxing reference games | **Planned** — tracked backlog, no code |
| Palmworks (`games/palmworks`) | **Playable standalone**, mouse/keyboard — but listed "Planned" on wibbly's own title screen and driven by no gesture |
| Hand landmarks, pinch, point | **Implemented**, unit-tested — not wired into the pipeline or any game, thresholds unvalidated against a real camera |
| magnetite integration (`@vulos/wibbly-authority`) | **Built, running** — a real magnetite `AuthoritativeGame` compiled to wasm, run client-side; refused in demo mode |
| Networked play (peer-to-peer, browser-hosted) | **Transport implemented**, unit-tested, wired into tennis (off by default) — no lobby UI, so nothing turns it into a click-to-play flow |
| Tauri desktop shell | **Phase 3** |
| Release build | **Source only** |
| Hosting | **Self-hosted, no service** — `dist/` is static files; any static server works. No Firebase, no CDN account, nothing hosted in the deploy path |

The distinction this table draws twice is worth stating directly: **implemented and unit-tested is
not the same as working.** The multi-person path has 18 binder tests and 29 tracker tests behind
it, and has never been pointed at four people in a room. Unit tests prove that the logic is what
we meant; they say nothing about whether MoveNet holds identity when somebody walks behind the
sofa.

wibbly is also **not monetized, in any form** — no wagers, no tournament pools, no revenue share,
no host-earns split, no ads. It's free and dual-licensed **MIT OR Apache-2.0**. That was previously
a backlog item; it has since been deleted outright rather than deprioritized.

## Relationship to magnetite

wibbly is a **client** of [magnetite](https://github.com/vul-os/magnetite), not a fork of it, and
not a platform in its own right — magnetite is the platform. Identity, discovery, lobbies and
hosting are solved there; rebuilding them in JavaScript would be a straight waste.

Staying a separate repo used to be argued on anti-cheat grounds: magnetite's replay verification
assumes deterministic input, and gesture input cannot be replay-verified, so merging would "blur
the property magnetite sells." That argument has expired — magnetite now enforces the boundary
itself, in code, with `InputClass::{Deterministic, Attested}` and a `PlausibilityGate`, so the line
between verifiable and attested input no longer depends on which repository a file lives in. What
still justifies two repos is different: it is a **conformance test**. wibbly can only reach
magnetite through whatever magnetite decided to publish — its crates, its `mag_*` sandbox ABI, its
game templates — because a repo boundary is the one thing that makes reaching past that
impossible by accident. Gesture games still run **client-attested**, on a host browser tab or a
dedicated server alike — spelled out in
[Multiplayer & anti-cheat](/projects/wibbly/docs/multiplayer).

**`@vulos/wibbly-authority` is that conformance test, made concrete.** It loads a real magnetite
`AuthoritativeGame` — the reference arena-shooter template, compiled to `wasm32-unknown-unknown`
(`public/magnetite/arena-authority.wasm`, ~275 KB) — and runs it in the browser tab through nothing
but the `mag_*` exports magnetite chose to expose, as a `Topology::SingleRoom` match: the bottom
rung of magnetite's own topology ladder, hosted client-side with no server.
`src/game/magnetite-authority.js` steps it once per tennis frame, fed by that match's own gesture
events. This is the thing "wibbly is built on magnetite" now concretely refers to. It changes
nothing about the anti-cheat boundary above: the wasm module advances state deterministically
*given its inputs*, but those inputs are still an unverifiable camera gesture stream, whether the
authority stepping them lives in this tab or on a rented box. The authority is refused in demo
mode — the demo's CSP has no `wasm-unsafe-eval`, so wasm compilation would fail there anyway.

An earlier design bridged wibbly's `GestureEvent`s to a persistent `magnetite dev` node over a
signed WebSocket wire format (`AttestedEvent`, WebCrypto Ed25519 signing). That was retired, not
extended — a signature only ever proves *authorship*, never that a real arm moved in front of a
real camera, so a rented server checking the same event stream faces the same unverifiable input a
tab does. That code is deleted; see `packages/wibbly-p2p/README.md`'s "What this used to be." What
wibbly's own peer-to-peer multiplayer uses instead (see Multiplayer) is WebRTC with **no magnetite
node or code involved at all** — a separate track from the wasm authority described above.

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
| Not importable, not testable | `@vulos/wibbly-input`, 221 passing tests |

Every seam existed to dismantle one line of the left column.

## What is still unproven

Say this out loud, because a green suite invites the wrong conclusion. The tests exercise the seams
against **fixtures**, not against cameras. Nobody has yet stood four people in front of a webcam and
confirmed that `SpatialBinder` keeps their ids straight when two of them cross, or that MultiPose
holds up at the back of a living room in poor light. Until that happens, multi-person support is
implemented and unvalidated — which is a real state, distinct from both "planned" and "working".
