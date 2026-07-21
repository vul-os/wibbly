# Wibbly — a Camera-Gesture Game Built on Magnetite (Spec + Program Backlog)

> **Status:** ACTIVE. This document is the single source of truth for the Wibbly program. Every
> agent/wave builds against the seams defined here. Do not invent parallel abstractions —
> implement the seams below.
>
> Companion doc: `magnetite/DECENTRALIZATION.md`. Wibbly is a **client** of magnetite's seams,
> not a fork of them, and not a platform in its own right — see §2.

## 0. Vision (one sentence)

**Your camera is the controller. A gesture is an input event like any other. Wibbly is a
camera-gesture game — one built on [magnetite](https://github.com/vul-os/magnetite), the
decentralized, self-hostable Rust games platform — that runs in a browser tab with zero install
and needs no cloud to play or host.**

Magnetite is the platform. Wibbly is what building on it looks like when your controller is a
webcam: one reference game today (tennis), soccer and boxing specified in the backlog, and
[Palmworks](games/palmworks) — an industrial factory-building game — folded into `games/` with its
full history, not yet wired to any gesture. Wibbly is free and dual-licensed **MIT OR Apache-2.0**.
There is no payment path anywhere in it: no wagers, no tournament pools, no revenue share, no ads.
That is not an oversight to fix later — it is the position. See §7's removal note.

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

> **Update, 2026-07-21.** The above is a snapshot at `67482e6`, kept verbatim because it is what
> was true then, not because it is what is true now. Phase 1 has since landed —
> `@vulos/wibbly-input` exists, is unit-tested, and tennis is ported onto it. This document's own
> §8 tracks what has shipped since; the up-to-date, audited-against-the-tree table lives in
> [`README.md`](README.md#status--what-is-actually-built) and should be treated as the current
> source of truth over this section.

## 2. How wibbly relates to magnetite

**Decision: wibbly stays its own repo and consumes magnetite through seams — a client, not a
fork of it, and not a merge candidate.**

The reasoning here has changed since the previous pass, so it is rewritten rather than patched.

**The old case for staying separate has partly expired.** It used to argue that merging would
"blur the property magnetite sells," because camera input is a noisy, nondeterministic,
un-replayable sensor stream — the one input class that cannot be replay-verified. That is still
true as a fact about cameras, but it is no longer the reason to keep two repos: magnetite now
defines `InputClass::{Deterministic, Attested}` and a `PlausibilityGate` in its own code — see
`DECENTRALIZATION.md` §3.7. The boundary between verifiable and attested input is now enforced by
a type that fails closed, not by which repository a file happens to live in. Putting wibbly's
TypeScript inside the magnetite tree would not weaken that boundary; the type does the work
regardless of directory layout.

**Concretely, wibbly now runs a real magnetite simulation, not just a design pointed at one.**
`@vulos/wibbly-authority` loads magnetite's reference `AuthoritativeGame` — the arena-shooter game
template, compiled to `wasm32-unknown-unknown` (`public/magnetite/arena-authority.wasm`, ~247 KB)
— and runs it client-side as a `Topology::SingleRoom` match: the bottom rung of magnetite's own
topology ladder, hosted by the browser tab with no server. `src/game/magnetite-authority.js` steps
it once per tennis frame, fed by that match's own gesture events. This is what makes "wibbly is
built on magnetite" literally true. It changes nothing about camera gestures, which stay
`InputClass::Attested` — nondeterministic and never replay-verifiable — regardless of whether the
authority stepping them sits in a tab or on a rented box; see §6.

An earlier design bridged wibbly's `GestureEvent`s to a persistent magnetite node over a signed
WebSocket wire format (`AttestedEvent`, WebCrypto Ed25519 signing, golden-vector-pinned against the
Rust verifier). That design was retired, not extended: a signature only ever proves *authorship*,
never that a real arm moved in front of a real camera, so a rented server checking the exact same
event stream faces the exact same unverifiable input a host's own tab does. That code (`wire.ts`,
`identity.ts`, the `AttestedEventAdapter`) is deleted — see
`packages/wibbly-p2p/README.md`'s "What this used to be" for the full account. What replaced it
for networked play is peer-to-peer WebRTC with no magnetite node at all (`packages/wibbly-p2p`,
renamed from `packages/wibbly-magnetite` because it no longer has any magnetite code in it) — a
separate track from the wasm authority described above.

**The reason that still holds: staying a separate repo is a conformance test, not a fence.**
Wibbly can only reach magnetite through whatever magnetite decided to publish — its crates, its
`mag_*` sandbox ABI, its game templates — because a repo boundary is the one thing that makes
reaching past that impossible by accident. A game living inside magnetite's own tree could import
an internal type or an unexported helper and nobody would notice until the next refactor broke it.
Wibbly cannot do that by construction. `@vulos/wibbly-authority` is exactly this in practice: it
compiles magnetite's own `game-templates/authoritative` to `wasm32-unknown-unknown` and drives it
through nothing but the `mag_*` exports magnetite chose to expose — no internal type, no
unexported helper. Every place wibbly talks to magnetite is therefore evidence that magnetite's
*published* surface is sufficient for a real consumer — not merely an assertion that it should be.

Against pure standalone: identity, discovery, lobbies, and hosting are already solved in
`magnetite-seams`. Rebuilding them in JavaScript would be a straight waste — and wibbly does not;
see §6 for where wibbly's own multiplayer draws that line even when it isn't leaning on magnetite
at all.

**Therefore:** wibbly consumes magnetite concretely, today, as a client-side authority —
`@vulos/wibbly-authority` runs magnetite's compiled game module in the browser tab with no server,
per §0/§1. Gesture input is, and stays, **client-attested** — never replay-verified — regardless
of who or what is authoritative for a given match, tab or rented box alike. See §6 for why that is
true even in wibbly's own peer-to-peer multiplayer, which involves no magnetite node or code at
all.

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
should ship first. *Status: implemented, unvalidated against real people — see §8.*

**Networked (different cameras) — peer-to-peer, no backend.** This is the settled design, and
nothing below exists in code yet; it is spec, not shipped.

- **Host authority in the browser.** One player's tab runs the authoritative simulation — the
  same role a dedicated server would play, just running on a participant's machine instead of
  infrastructure wibbly operates.
- **Guest → host: GestureEvents over a WebRTC `RTCDataChannel`.** Not video. A guest's tab runs
  its own `FrameSource` → `PoseTracker` → `GestureRecognizer` locally and sends only the resulting
  events — tens of bytes each — to the host.
- **Host → guests: state broadcast back over the same channel(s).** The host is the only
  simulation; everyone else renders what it says happened.
- **Signalling has zero required infrastructure.** WebRTC peers still need to exchange one session
  description each before a `DataChannel` can open, and wibbly does not run a signalling server
  for that. Two options, both workable today:
  - **Copy-paste or QR code.** One player generates a connection blob (or its QR encoding), sends
    it to the other by any channel they already use — chat, a screenshot, reading it aloud — and
    the other pastes it back. Zero infrastructure, works offline-adjacent, and is the default.
  - **Trystero (MIT), optional.** Signals over public BitTorrent trackers or Nostr relays instead
    of copy-paste — smoother, still no server wibbly runs or operates.
- **STUN: free public STUN servers.** Needed for most NAT traversal and free to use; this part
  works for the large majority of home and mobile connections.
- **Honest limitation, stated plainly: WebRTC reveals your IP address to the other peer.** ICE
  candidate exchange — how two browsers find a path to each other at all — surfaces each peer's
  public IP; the STUN server sees it too, for the same reason. This is not a wibbly-specific
  leak, it is what a direct peer connection *is*, same as any two-party WebRTC call. The one
  mitigation is forcing all traffic through a TURN relay, which hides both peers' IPs behind the
  relay's instead — but that needs a TURN server, and as below, wibbly does not provide one for
  free. Nothing here is built yet; this is a disclosure ahead of the design.
- **Honest limitation, stated plainly: there is no free TURN.** A relay is the only thing that
  gets two peers connected when at least one sits behind symmetric NAT or carrier-grade NAT
  (CGNAT) — common on some mobile networks and behind some routers — and running a TURN relay
  costs real bandwidth, which is exactly the infrastructure this design exists to avoid. **Peers
  in that situation will fail to connect, with no workaround, and this doc will not pretend
  otherwise.** Same-network play (same Wi-Fi/LAN) always works, because it needs no NAT traversal
  at all.

**Why an authoritative server buys nothing here.** Magnetite's `InputClass::Attested` — see §2 —
is, by construction, never replay-verifiable: there is no canonical recording of "what the camera
actually saw" to check a claimed `GestureEvent` against, no matter who is doing the checking. A
rented server that received the exact same `GestureEvent` stream would face the exact same
problem the host's browser tab faces: it cannot tell a real swing from a synthesised one that
respects rate limits and plausible velocities. Centralizing authority moves *where* the simulation
runs; it does not move the cheat surface, because the cheat surface is upstream of authority, at
the sensor. This is the argument for running wibbly's own multiplayer host-in-browser rather than
standing up a server for it — not a cost shortcut, a statement that the server would not have
bought anything.

**Anti-cheat boundary — be honest about this, regardless of who is authoritative.** Gesture input
is a nondeterministic sensor stream and **cannot be replay-verified**, on a host browser tab or on
a dedicated server alike. Gesture games therefore run as **client-attested**: whoever is
authoritative simulates over received `GestureEvent`s, and events are rate-limited and
plausibility-checked (human-reachable velocities, cooldowns) — magnetite calls this a
`PlausibilityGate` — but a determined cheater can still synthesise events. Say this plainly rather
than implying a guarantee that does not exist.

**What this is and is not.** *Frames never leaving the device* is a **privacy** property: nobody
downstream, host or guest, ever receives your video. It is not a **security** property — it says
nothing about whether a given `GestureEvent` came from a real arm in front of a real camera, and
nothing here should be read as implying otherwise.

## 7. Removed: developer incentives

This section used to sketch host-earns payouts, non-custodial paid games, tournament entry pools,
and an opt-in ad seam. **All of it is dead**, not softened — wibbly is free and there is no
payment path anywhere in this repo: no wagers, no tournaments with pools, no revenue share, no
ads. Nothing in §0 or §2 depends on any of it existing.

## 8. Backlog

### Phase 1 — the library (blocks everything) — mostly landed
- [x] `packages/wibbly-input` scaffold; `poseDetection.js` moved in, **all DOM injection
      stripped**. Published as `@vulos/wibbly-input`, MIT.
- [x] `MoveNetMultiPoseTracker` — SinglePose replaced; returns `Person[]`.
- [x] `PlayerBinder` + `SpatialBinder` default. *(Highest risk; done early, as intended. Covered
      by unit tests against **synthetic fixtures only** — never validated against two real
      people. Implemented and unvalidated, not working — see the gate under Phase 2.)*
- [x] `SwingRecognizer` extracted as a pure function over landmark history + unit tests.
- [x] Fix handedness — `isRightHanded = true` is gone; handedness is a live per-player sign
      flip, both cases tested.
- [x] Remove the 15fps/every-3rd-frame throttle; `AdaptivePacer` adapts to measured frame time.
- [x] `HandLandmarkTracker` (MediaPipe) + `PinchRecognizer` / `PointRecognizer`. Implemented and
      unit-tested — including distance-from-camera and rotation invariance. **Two gaps remain,
      stated plainly:** the thresholds are derived from geometry, not measured against a real
      hand, since no hand-tracking session has yet run against a live camera; and `WibblyInput`
      (`packages/wibbly-input/src/pipeline.ts`) does not yet compose the hand tracker into the
      running pipeline — it still wires body pose and `SwingRecognizer` only. The MediaPipe hand
      model and Wasm runtime (~25 MB) are also not vendored in this repo; both asset paths are
      injectable with no CDN default, so nothing reaches the network behind anyone's back, but
      hands do not run until someone supplies them.

### Phase 2 — the platform
- [x] Tennis ported onto the seams. Names no model, runtime, or vendor.
- [ ] **Validate multi-person against real people and real cameras.** The tracker and binder are
      implemented and unit-tested on fixtures only; neither has met a living room. This gates
      every claim about couch multiplayer.
- [ ] 2-player local via one camera — the binder already supports two claim zones, but tennis
      still routes gestures for `player_1` only. **Next up.**
- [x] Remove Firebase Analytics. *(Hosting migration off Firebase still open.)*
- [x] Static site in the house style.
- [x] Shrink `src/pages/` — the marketing shell is deleted; the app is now a title
      screen, a first-run camera setup flow, the play surface and a 404.
- [x] A real magnetite link, via `@vulos/wibbly-authority`: magnetite's reference
      `AuthoritativeGame` compiled to wasm, run client-side as a `Topology::SingleRoom` match
      with no server, stepped from the tennis render loop by
      `src/game/magnetite-authority.js`. *(Does not verify gesture input or add anti-cheat —
      that boundary is unchanged, see §6. Refused in demo mode, since the demo's CSP blocks
      wasm compilation.)* The earlier design — a signed wire ingress to a persistent
      `magnetite dev` node (`AttestedEvent`, WebCrypto Ed25519, golden-vector-pinned) — was
      retired; see `packages/wibbly-p2p/README.md`'s "What this used to be." Networked
      multiplayer is a separate, magnetite-free track: peer-to-peer WebRTC via
      `packages/wibbly-p2p` (renamed from `packages/wibbly-magnetite`).
- [ ] **Palmworks** — folded into [`games/palmworks`](games/palmworks) with its full history and
      its own build: an industrial factory-building game. **Hands are not wired to it yet.**
      `HandLandmarkTracker` + `PinchRecognizer`/`PointRecognizer` now exist (Phase 1, above), but
      nothing in Palmworks or `WibblyInput` calls them yet — getting it playable by gesture is
      still open.
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
> work rather than at nothing. Neither exists as code. Palmworks exists as code but not
> as a gesture game yet — see above.

### Phase 3 — depth
- [ ] `RtmoOnnxTracker` (ONNX Runtime Web + WebGPU), benchmarked against MoveNet.
- [ ] Tauri shell w/ `nokhwa` + `ort`.
- [x] **Peer-to-peer networked play** (§6): host authority in the browser, guest `GestureEvent`s
      over a `RTCDataChannel`, copy-paste/QR signalling by default with Trystero as an optional
      zero-server alternative, free public STUN. The transport (`PeerSession`, WebRTC offer/answer
      helpers, a codec that fits a connection description in a link) is built and unit-tested in
      `packages/wibbly-p2p` (no magnetite dependency), and tennis (`src/game/game.jsx`) already wires an optional
      `PeerSession` in — off unless a host page hands in a transport. **What is not true yet, said
      as plainly as the rest:** there is no lobby screen anywhere in wibbly. Nothing turns that
      transport into a button a visitor can click, so this is not "open a link and play with a
      friend" today.

## 9. Open questions

- ~~**Wibbly repo is private.**~~ **Resolved — false as written.** The repo is public at
  [github.com/vul-os/wibbly](https://github.com/vul-os/wibbly), MIT OR Apache-2.0. Publishing
  under `vulos.org/products/magnetite/wibbly` needs no founder call; it already matches how the
  repo is licensed.
- **`navigator.gpu` in WKWebView on macOS 26** — unresolved in research; test empirically.
- **Other contributors** (`declan*`, `IMRAN`, `CAMERA` branches on origin, last known, not
  independently reverified for this pass). The phase-1 refactor already deleted the old
  `poseDetection.js` that those branches may have been built against. If any are still active,
  they need to rebase onto the current history rather than expecting a clean merge.
- **Hands or body first?** The name says "hand gesture," the shipped game does body pose.
  Palmworks raises the stakes on this: it is a hands-first game, and while `HandLandmarkTracker` +
  `PinchRecognizer`/`PointRecognizer` now exist as a library, nothing wires them to drive it yet.
  Still undecided which modality is the flagship one.
- **No in-browser benchmarks exist** for RTMO/YOLO-pose at any player count. If phase 3 proceeds,
  we benchmark it ourselves — there is no number to inherit.
