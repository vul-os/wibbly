# Changelog

All notable changes to wibbly are documented in this file.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added

- **`@vulos/wibbly-authority` — a real magnetite authority, running client-side.** Loads
  magnetite's reference `AuthoritativeGame` (`game-templates/authoritative`), compiled to
  `wasm32-unknown-unknown` (`public/magnetite/arena-authority.wasm`, ~247 KB), and drives it
  through the `mag_*` sandbox ABI as a `Topology::SingleRoom` match — the bottom rung of
  magnetite's own topology ladder, hosted by the browser tab with no server.
  `src/game/magnetite-authority.js` steps it once per tennis frame, fed by the match's own
  gesture events. This is what makes "wibbly is built on magnetite" literally true, replacing
  the earlier signed-wire-to-a-live-node design (see Changed, below). It does not verify
  gesture input or add anti-cheat — camera gestures stay `InputClass::Attested`, never
  replay-verifiable, regardless of where the authority runs — and it is refused in demo mode,
  since the demo's `default-src 'self'` CSP has no `wasm-unsafe-eval` and blocks wasm
  compilation (`verify:demo` stays 26/26). 5 unit tests.

### Changed

- **`packages/wibbly-magnetite` renamed to `@vulos/wibbly-p2p`.** The package is pure WebRTC
  peer-to-peer with **no magnetite dependency** — it began life bridging `GestureEvent`s to a
  live magnetite node (see Removed, below), but after that bridge was retired the package had
  no magnetite code left in it, so the old name no longer described what was here. See
  `packages/wibbly-p2p/README.md`'s "What this used to be" for the full account of what changed
  and why.
- **Docs corrected to match the mechanism above.** `README.md`, `WIBBLY.md`, `site/docs/ARCHITECTURE.md`,
  `site/docs/MULTIPLAYER.md`, `site/docs/OVERVIEW.md`, `site/docs/ROADMAP.md`, and
  `site/landing.html` no longer describe signed `AttestedEvent`s reaching a live `magnetite dev`
  node and coming back `attested_ack` — that mechanism is gone (see Removed, below). They now
  describe the wasm authority above, and state plainly that wibbly's own networked multiplayer
  (`packages/wibbly-p2p`) is a separate, magnetite-free track.
- **Documentation reframed: wibbly is a game, not a platform.** `WIBBLY.md`, `site/docs/`, and
  `site/landing.html` no longer describe wibbly as "the input layer and shell" for camera-controlled
  games in general — that framing made one game look like infrastructure it isn't. wibbly is now
  consistently described as a camera-gesture game (tennis today; soccer, boxing and the folded-in
  [Palmworks](games/palmworks) in the backlog) built on [magnetite](https://github.com/vul-os/magnetite),
  which is the actual platform.
- **§2 of `WIBBLY.md` rewritten as "How wibbly relates to magnetite."** The old argument for staying
  a separate repo — that merging would "blur the property magnetite sells" because gesture input
  can't be replay-verified — no longer holds: magnetite now enforces the verifiable/attested
  boundary itself, in code (`InputClass::{Deterministic, Attested}`, `PlausibilityGate`, the signed
  wire ingress). The reason that still holds is reframed: staying separate is a conformance test —
  wibbly can only reach magnetite through its published surface, by construction.
- **Multiplayer design rewritten as peer-to-peer, no backend.** `WIBBLY.md` §6, `site/docs/MULTIPLAYER.md`,
  and the corresponding sections of `site/landing.html` now specify host authority in one player's
  browser tab, guest `GestureEvent`s over a WebRTC `RTCDataChannel`, and zero-infrastructure
  signalling (copy-paste/QR by default, optional Trystero over public BitTorrent trackers/Nostr).
  Free public STUN is used for NAT traversal; there is **no free TURN**, so peers behind symmetric
  NAT or CGNAT cannot connect, with no workaround — stated plainly rather than glossed over.
  Same-network play is unaffected. The accompanying rationale: gesture input is
  `InputClass::Attested` and can never be replay-verified, so a rented authoritative server would
  not buy back anything a host's own browser tab doesn't already have — the cheat surface sits
  upstream, at the sensor, regardless of who is authoritative.
- **Corrected the privacy/security distinction throughout.** Frames never leaving the device is
  called out explicitly as a **privacy** property, not a **security** one — it says nothing about
  whether a `GestureEvent` came from a real arm in front of a real camera, and no page should be
  read as implying gesture input provides anti-cheat or verification.
- **Corrected stale claims:** the repo has been public and MIT OR Apache-2.0 licensed for a while;
  `WIBBLY.md` §9 and `site/docs/ROADMAP.md` no longer carry that as an open question. `WIBBLY.md`
  §8 and the docs backlog now mark what phase 1 actually shipped, and add
  [Palmworks](games/palmworks) — folded in with its full history, not yet wired to any gesture.
  A later entry below covers `HandLandmarkTracker`/`PinchRecognizer`/`PointRecognizer` landing
  after this reframe was drafted — the docs were updated again to match rather than left stale.

### Removed

- **The signed-wire-to-a-live-node magnetite bridge.** `packages/wibbly-magnetite`'s
  `AttestedEventAdapter` (mapped a `GestureEvent` onto magnetite's exact `AttestedEvent` Rust
  wire shape, `f32` rounding included), `wire.ts` (the wire shape itself, `ATTESTED_FRAME_TYPE`,
  the byte-for-byte signing preimage, pinned against magnetite's verifier by golden vectors),
  and `identity.ts` (WebCrypto Ed25519 signing) are deleted outright, not replaced with a
  different signing scheme. A signature over a `GestureEvent` only ever proved *authorship*,
  never that a real arm moved in front of a real camera, so a rented server checking the same
  event stream faced the same unverifiable input a host's own browser tab does — retired
  because the premise didn't hold, not because it stopped working. See
  `packages/wibbly-p2p/README.md`'s "What this used to be" for the full account, and Added,
  above, for what wibbly's real magnetite link is now.
- **`site/docs/INCENTIVES.md` deleted, and `WIBBLY.md` §7 rewritten to a removal note.** Wibbly is
  free. There is no payment path anywhere in this repo: no host-earns split, no non-custodial paid
  games, no tournament entry pools, no `AdProvider` seam. This is not a deprioritization — the
  content was deleted, not softened. `site/docs/manifest.json` and every internal link to the
  incentives page have been removed accordingly.

---

## [0.1.0] - 2026-07-21

First versioned release. wibbly is the input layer and shell for
camera-controlled browser games — a webcam is a controller, a `GestureEvent`
is an input event like a keypress, and a game never names a model, a runtime,
or a vendor to receive one. Pose inference runs locally in the browser tab;
frames never leave the device. This release is honest about scope: one game
(tennis), one gesture (swing), one player fully wired, driven by a real,
unit-tested input library.

### Added

- **`@vulos/wibbly-input` library** — `FrameSource` → `WebcamFrameSource`
  (owns its own `getUserMedia` capture loop, with a five-rung constraint
  loosening ladder on `OverconstrainedError`); `PoseTracker` →
  `MoveNetMultiPoseTracker` (TensorFlow.js MoveNet MultiPose Lightning,
  returns `Person[]`, injectable detector for camera-free tests);
  `GestureRecognizer` → `SwingRecognizer` (pure `detectSwing()` over
  wrist-velocity history); `PlayerBinder` → `SpatialBinder` (greedy
  nearest-centroid binding with claim zones, tested against synthetic
  fixtures only — not yet against two real people); `Calibration`
  (per-player handedness, reach envelope, framing checks, localStorage-backed).
  Zero DOM injection; 150 unit tests run without a camera.
- **`@vulos/wibbly-magnetite` bridge** — maps a `GestureEvent` onto
  magnetite's §3.7 `InputProvider` seam as a client-attested `AttestedEvent`
  (Ed25519 signing via WebCrypto, session lifecycle, client-side pre-flight).
  Proven end-to-end against a live `magnetite dev` node running a real wasm
  game: a signed event returns `attested_ack`, a tampered one is rejected
  with "signature does not verify", an unsigned one with "missing field
  'signed'". The wire format is pinned to magnetite's Rust verifier by golden
  vectors. Off by default — local play needs no server. 83 unit tests.
  Explicitly documented as authorship-only, never anti-cheat: a client that
  signs fabricated-but-plausible numbers with its own genuine key passes
  every check that exists, by magnetite's own design.
- **Tennis reference game** — Three.js court, ball physics, AI opponent,
  built on the input seams above rather than hand-rolled camera code.
- **Adaptive frame pacing** — replaces a fixed 15fps / every-3rd-frame
  throttle with a measured duty cycle.
- **Left-handed play** — handedness is a live per-player lookup, not a
  hardcoded assumption.
- **Vendored pose model** — MoveNet MultiPose Lightning shipped in
  `public/models/` (~9.3 MiB) and served same-origin, byte-verified against
  its own weight manifest by `npm run verify:model`. The TF Hub CDN is an
  explicit opt-in, not the default.
- **Demo mode** (`VITE_WIBBLY_MODE=demo`) — a separate single-surface build
  for embedding at `vulos.org/products/wibbly/play/`: instant start, no
  router, no persistent storage, magnetite hard-disabled, local model only.
  Verified under the real production CSP by `npm run verify:demo` — 26/26
  checks, zero external network requests.
  `build:demo` outputs to `dist-demo/`, based at `/products/wibbly/play/`,
  independent from the standalone `build` (`dist/`, based at `/`).
  wibbly's canonical home is `vulos.org/products/wibbly`, collected verbatim
  from this repo's `site/` into the public marketing site; the `wibbly-io`
  Firebase project is a legacy host kept as a manual-only
  (`workflow_dispatch`) deploy so it can no longer silently diverge from the
  canonical copy by auto-deploying on every push.
- **Browser end-to-end test suite** — Playwright (chromium) drives the
  production build (`vite preview`) with the backend mocked in-browser: a
  boot guard across all gated top-level surfaces (ThemePicker, Login, IDE
  analogue), plus core flows. 18 additional app-shell tests (`test/mode.test.js`).
- **Title screen, setup flow, in-game menu** — four real surfaces (title,
  first-run setup, play, 404); Soccer and Boxing appear on the title screen
  as non-selectable *Planned* items linking to the backlog, not fake content.
- **Third-party notices** and a `LICENSE` (MIT).
- **Screenshot suite** (`npm run screenshots`) against a real production
  build with a synthetic camera device, so nothing in the README gallery is
  staged or composited.

### Changed

- **Public tunnel / broadcast-graphics UI redesign** — night-court visual
  language (registration brackets, honest disabled-vs-unbuilt states,
  broadcast-style camera inset), typography unified with the marketing site,
  and researched (untested) Firefox/Safari support alongside the previously
  Chrome-only path.

### Removed

- **Firebase Analytics** — the central tracking beacon is deleted, not
  replaced.

### Known gaps (tracked in [`WIBBLY.md`](WIBBLY.md), not hidden)

- Multi-player on one camera is partial: the binder handles two players but
  tennis still routes only `player_1` to the racket, and it is untested with
  two humans.
- Gesture vocabulary is swing-only; no punch, pinch, or point.
- Hand tracking (MediaPipe HandLandmarker) is not built.
- Only one game exists, so "generalises beyond tennis" is unproven.
- Networked play has no transport, lobby, or session code; gesture events
  accepted over the magnetite bridge land in a queue that nothing drains yet
  — no game on either side consumes them.
- No Tauri native shell yet (researched, specified, no Rust in this repo).
- No RTMO/ONNX/WebGPU tracker to benchmark against.
