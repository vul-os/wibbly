# Wibbly → Camera Gesture Game Platform (Redesign Spec + Program Backlog)

> **Status:** ACTIVE redesign. This document is the single source of truth for the Wibbly
> program. Every agent/wave builds against the seams defined here. Do not invent parallel
> abstractions — implement the seams below.
>
> Companion doc: `magnetite/DECENTRALIZATION.md`. Wibbly is a **client** of magnetite's seams,
> not a fork of them.

## 0. Vision (one sentence)

**Your camera is the controller. A gesture is an input event like any other. Games are portable
objects that run in a browser tab with zero install, and the platform underneath them is
decentralized — no cloud required to play, host, or get paid.**

Wibbly is not a tennis game. Wibbly is the input layer + shell that makes camera-controlled games
cheap to build, plus one reference game (tennis) that proves it.

## 1. Where we are today (grounded audit, 2026-07-20 @ `67482e6`)

~6k lines. React 19 + Vite + Three.js, deployed to Firebase Hosting via GitHub Actions.

| Area | Reality |
|---|---|
| `src/poseDetection.js` (480 ln) | TFJS **MoveNet SinglePose**. Throttled to 15fps target, and additionally processes only every 3rd frame (`skipFrames = 2`). |
| Multi-person | **None.** `processPoses()` hardcodes `poses[0]`. |
| Handedness | **Right-handed only.** `isRightHanded` is fixed `true`; the left-handed branch is an empty `TODO`. |
| Gesture vocabulary | **One gesture: "swing."** Wrist-velocity heuristic over a 5-frame history with a 500ms cooldown. |
| Reusability | **Zero.** The detector `document.body.appendChild()`s its own camera preview `<div>` and a "Hide Camera" `<button>`, and hardcodes inline styles. It cannot be imported as a library. |
| `src/game/` (1.9k ln) | Tennis: ball physics, court GLB, player rig, AI opponent, Wii-Sports-style camera. Genuinely decent. |
| `src/pages/` (2.9k ln) | Marketing shell — `home`, `about`, `game-menu`, `not-found`. More lines than the game. |
| `src/services/firebase.js` | Initialises **Firebase Analytics**. Central tracking, in a product whose thesis is decentralization. |
| Branches | `declan1`, `declan2`, `newdeclan`, `CAMERA`, `IMRAN` on origin. **This is a multi-contributor repo.** |

**Read:** the tennis game is worth keeping. The input layer needs to be rebuilt as a library. The
marketing shell is oversized for one game and should shrink into the house-style static site.

## 2. Merge into magnetite? No.

**Decision: Wibbly stays its own repo and integrates with magnetite through seams.**

Against merging:
- Magnetite is Rust and its thesis is *deterministic authoritative simulation with replay
  verification*. Camera input is a noisy, nondeterministic, un-replayable sensor stream. It is the
  one input class that cannot be replay-verified. Merging blurs the property magnetite sells.
- Magnetite is mid-redesign against `DECENTRALIZATION.md`. Dropping a JS game engine into that
  monorepo pollutes a codebase currently converging on seams.

Against pure standalone:
- Identity, payments, discovery, lobbies, and hosting are all solved in `magnetite-seams`.
  Rebuilding them in JS would be a straight waste.

**Therefore:** Wibbly consumes magnetite as its platform. Magnetite gains an `InputProvider` seam.
Anti-cheat treats gesture input as **client-attested**, not replay-verified — see §6.

## 3. THE SEAMS

All Wibbly seams live in `packages/wibbly-input`. Game code never names a model, a runtime, or a
vendor — it sees only these interfaces. **Every seam ships a working default.**

### 3.1 `FrameSource` — where pixels come from

```ts
interface FrameSource {
  start(opts: { width: number; height: number; fps: number }): Promise<void>;
  stop(): void;
  // Implementations own their own capture loop and push frames to the tracker.
  onFrame(cb: (frame: VideoFrame | HTMLVideoElement) => void): void;
}
```

- **Default:** `WebcamFrameSource` — `getUserMedia` in a browser tab.
- **Native:** `NativeFrameSource` — Rust-side `nokhwa` capture (Tauri, phase 2). Frames never
  cross IPC; see §5.

### 3.2 `PoseTracker` — pixels → skeletons

```ts
interface PoseTracker {
  init(): Promise<void>;
  estimate(frame: Frame): Promise<Person[]>;   // Person[] — plural is the point
  readonly maxPeople: number;
  readonly capabilities: { body: boolean; hands: boolean; face: boolean };
}
```

- **Default:** `MoveNetMultiPoseTracker` (see §4).
- Optional: `HandLandmarkTracker`, composable alongside the body tracker.
- Future: `RtmoOnnxTracker` behind the same interface.

### 3.3 `GestureRecognizer` — skeletons → game events

```ts
interface GestureRecognizer {
  feed(people: Person[], tNow: number): GestureEvent[];
}
type GestureEvent = {
  playerId: PlayerId;          // stable across frames — see §3.4
  kind: string;                // 'swing' | 'punch' | 'pinch' | 'point' | custom
  confidence: number;          // 0..1 — games MUST handle low confidence
  vector?: { x: number; y: number; z?: number };
  tCapture: number;            // capture timestamp, NOT detection timestamp
};
```

The current swing heuristic becomes `SwingRecognizer`, one implementation among many. Recognizers
are pure functions over landmark history — **unit-testable without a camera**, which today's code
is not.

### 3.4 `PlayerBinder` — which skeleton is which player

The hard problem nobody solves in demos. MoveNet MultiPose returns up to 6 people per frame with
**no stable identity across frames**. A binder assigns durable `PlayerId`s.

- **Default:** `SpatialBinder` — greedy nearest-centroid matching frame-to-frame, with a
  configurable "claim zone" per player (left half / right half of frame) for the couch case.
- Must handle: occlusion, a player leaving and returning, two players crossing over.
- **This is the single highest-risk component in the project.** Budget real time for it.

### 3.5 `Calibration`

Per-player setup: handedness (kills the right-handed hardcode), reach envelope, camera framing
check, lighting warning. Persisted locally, keyed to `PlayerId`.

## 4. Model selection (researched 2026-07-20, grounded)

### Chosen: MoveNet MultiPose Lightning (body) + MediaPipe HandLandmarker (hands)

**Body — MoveNet MultiPose Lightning (TF.js, Apache 2.0).** Up to 6 people. TF.js documents that
*person count does not affect inference speed* — flat cost, which is exactly the property a 2–4
player couch game needs. It is the only multi-person model with published **in-browser** FPS:

| Device (WebGL) | SinglePose Lightning | Thunder | **MultiPose** |
|---|---|---|---|
| MacBook Pro 15" | 104 | 77 | **54** |
| Desktop i9-10900K | 87 | 82 | **62** |
| iPhone 12 | 51 | 43 | **24** |

Source: [tfjs-models MoveNet README](https://github.com/tensorflow/tfjs-models/blob/master/pose-detection/src/movenet/README.md). Vendor-published but browser-real.

**Hands — MediaPipe HandLandmarker / GestureRecognizer (Apache 2.0).** 21 landmarks per hand,
multi-hand, first-class web support. The only realistic browser hand option. Vendor-claimed
17.12ms CPU / 12.27ms GPU on a Pixel 6 (mobile, not browser). Its 8 canned gestures are thin for
games — classify from raw landmarks in our own recognizers instead.

### Rejected, with reasons

| Model | Why not |
|---|---|
| **RTMO** (bottom-up, CVPR 2024, Apache 2.0) | Technically the right architecture — 0.677–0.724 COCO AP, 8.9–19.1ms. But those are **V100** numbers, and there is **no browser port and no WebGPU benchmark**. Unproven engineering, not a drop-in. **Kept as the documented phase-3 upgrade behind `PoseTracker`.** |
| **YOLOv8/YOLO11-pose** | One-stage, browser demos exist, but **AGPL-3.0** — compliance requires open-sourcing the entire derivative work. Commercial non-starter without an Enterprise licence. |
| **WiLoR** (best hand model) | **CC BY-NC-ND 4.0** — non-commercial *and* no-derivatives. Unusable. Also depends on Ultralytics (AGPL). |
| **HaMeR** | Research/non-commercial terms; MANO independently restricts commercial use. |
| **MediaPipe PoseLandmarker** | Top-down (cost scales with people). Documented failure: two people within ~75cm at 3.5m drop a detection. Google publishes **no** latency numbers for it. Do not build 4-player on this. |
| **ViTPose** | ~1 FPS on a 2080 Ti. Not real-time. |
| **MediaPipe Holistic** | Single-person only, no published benchmarks, carries a stale "upgraded version coming soon" banner since 2023. Stability risk. |

### Runtime correction (important)

**MediaPipe Tasks Web's "GPU" delegate is WebGL, not WebGPU.** WebGPU for vision tasks is still an
open feature request upstream. If we want WebGPU we are on ONNX Runtime Web, which is
production-viable but more work. The MoveNet numbers above are WebGL.

## 5. Runtime targets

### v1: browser-first. Non-negotiable.

Zero install is the platform's single biggest asset. A link, a wave, a game. For seeding a game
library from nothing that beats anything native provides.

### Why NOT Tauri-with-webview-ML

Researched and rejected as an architecture:

- **No WebGPU on macOS/Linux WebKit.** WebKitGTK has none and per a WebKit developer "nobody is
  working on it." WKWebView on macOS 26 is unconfirmed — **verify `navigator.gpu` empirically
  before betting on it**. Net: CPU-WASM only, 3–5× slower.
- **Linux camera is broken by default.** Distro WebKitGTK ships without WebRTC/media-stream;
  making `getUserMedia` work requires compiling WebKitGTK yourself, X11-only.
- **macOS permission bugs** — double prompts, and cases where the prompt never appears
  (`wry#1195`, `tauri#11951`, both open as of research).
- **You cannot fix it by shipping frames to Rust.** Tauri IPC is JSON-serialized. A 1080p RGBA
  frame is ~8MB; 30fps is ~250MB/s. Measured: 10MB ≈ 200ms on Windows.
- **Signal:** no open-source Tauri app does webcam ML in the webview. The closest (Lazyeat) pairs
  Tauri with a separate Python CV process.

### Phase 2: Tauri as an app shell — YES, with capture and inference in Rust

Tauri is right for the *app*, wrong for the *webview ML*. When it arrives:

- Capture: `nokhwa` (or `crabcamera`) in the Rust core — sidesteps WebKitGTK entirely via V4L2.
- Inference: `ort` (ONNX Runtime) in the Rust core, `compile-static` + `minimal-build`,
  platform execution providers (CoreML / DirectML).
- **Only landmarks cross IPC** — kilobytes at 30Hz, trivially cheap.
- Preview: native wgpu surface under a transparent webview (`tauri-wgpu-cam` pattern).
- This also unlocks RTMO, which the browser cannot reach.

Interim option worth taking first: **daemon + browser UI** (the Jellyfin / IPFS Desktop pattern).
Solves the persistent-node problem, uses the user's real browser so WebGPU and camera Just Work,
and is nearly free once the browser build exists.

## 6. Multiplayer

Two distinct problems; do not conflate them.

**Local (same camera, 2–4 players).** Solved by `PoseTracker.maxPeople` + `PlayerBinder` (§3.4).
MoveNet MultiPose's flat cost curve makes this cheap. This is the differentiated, fun case and
should ship first.

**Networked (different cameras).** Each client runs its own tracker locally and transmits
**GestureEvents, not video**. This is a privacy property worth stating loudly: *camera frames
never leave the device.* Session hosting, discovery, and lobbies come from magnetite.

**Anti-cheat boundary — be honest about this.** Magnetite's replay verification assumes
deterministic input. Gesture input is a nondeterministic sensor stream and **cannot be
replay-verified**. Gesture games therefore run as **client-attested**: the host simulates
authoritatively over received GestureEvents, and events are rate-limited and
plausibility-checked (human-reachable velocities, cooldowns), but a determined cheater can
synthesise events. Document this rather than implying a guarantee we do not have.

## 7. Developer incentives

**Ads are the wrong lever, and we should say why.** Ad SDKs are central tracking brokers, which
contradicts both the decentralization thesis and Vulos's privacy posture. Web-game CPMs are low
and need scale we do not have. And an interstitial in a game where the player is standing up
waving their arms is hostile. Shipping an ad beacon inside a desktop binary is worse still.

The ladder, ordered by fit with what magnetite already has:

1. **Host-earns.** Magnetite already pays capacity providers. A popular gesture game generates
   sessions; devs who also host earn from them.
2. **Non-custodial paid games and cosmetics.** The crypto payment seam exists. A 0%-to-low
   platform cut is a real differentiator against Steam's 30%.
3. **Tournaments with entry pools.** Camera games are inherently spectator-friendly and
   competitive. The pool *is* the prize — no advertiser required.
4. **Bounty/patronage pool** for the first N games shipped against the SDK. The cheapest way to
   seed a library from zero.

If ads are still wanted: an `AdProvider` seam defaulting to `none`, opt-in per game, so no
developer is forced to ship a tracking beacon.

## 8. Backlog

### Phase 1 — the library (blocks everything)
- [ ] `packages/wibbly-input` scaffold; move `poseDetection.js` in, **strip all DOM injection**.
- [ ] `MoveNetMultiPoseTracker` — replace SinglePose; return `Person[]`.
- [ ] `PlayerBinder` + `SpatialBinder` default. Highest risk; do it early.
- [ ] `SwingRecognizer` extracted as a pure function over landmark history + unit tests.
- [ ] Fix handedness — kill `isRightHanded = true`, implement the empty left-handed branch.
- [ ] Remove the 15fps/every-3rd-frame throttle; make it adaptive to measured frame time.
- [ ] `HandLandmarkTracker` (MediaPipe) + `PinchRecognizer` / `PointRecognizer`.

### Phase 2 — the platform
- [ ] Tennis ported onto the seam; 2-player local via one camera.
- [x] Remove Firebase Analytics. *(Hosting migration off Firebase still open.)*
- [x] Static site in the house style.
- [x] Shrink `src/pages/` — the marketing shell is deleted; the app is now a title
      screen, a first-run camera setup flow, the play surface and a 404.
- [x] Magnetite `InputProvider` seam + client-attested anti-cheat path.
- [ ] **Soccer** — second reference game. Proves the SDK generalises beyond tennis,
      and is the first game to need a gesture that is *not* a swing: a kick is a
      lower-body gesture, so it exercises leg keypoints the `SwingRecognizer` ignores
      and forces `GestureRecognizer` to be genuinely plural.
- [ ] **Boxing** — third reference game. The first that needs **two independent
      gesture streams from one player** (left and right hand, tracked separately with
      per-arm cooldowns) rather than one dominant hand, which is the assumption baked
      into `Calibration.handedness` today. Also the natural first test of 2-player
      local, since boxing is head-to-head by nature.

> The title screen (`src/pages/title.jsx`) shows Soccer and Boxing as **Planned** cards
> that cannot be selected. They are listed here so that presentation points at tracked
> work rather than at nothing. Neither exists.

### Phase 3 — depth
- [ ] `RtmoOnnxTracker` (ONNX Runtime Web + WebGPU), benchmarked against MoveNet.
- [ ] Tauri shell w/ `nokhwa` + `ort`.
- [ ] Networked play over magnetite.
- [ ] Incentive rails (§7, items 1–3).

## 9. Open questions

- **Wibbly repo is private.** Publishing under `vulos.org/products/magnetite/wibbly` makes it public-facing.
  Founder call.
- **`navigator.gpu` in WKWebView on macOS 26** — unresolved in research; test empirically.
- **Other contributors** (`declan*`, `IMRAN`, `CAMERA` branches). The seam refactor touches
  `poseDetection.js`, which is shared ground. Coordinate before landing.
- **Hands or body first?** The name says "hand gesture," the code does body pose. Tennis needs
  body. Decide the flagship input modality.
- **No in-browser benchmarks exist** for RTMO/YOLO-pose at any player count. If phase 3 proceeds,
  we benchmark it ourselves — there is no number to inherit.
