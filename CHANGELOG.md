# Changelog

All notable changes to wibbly are documented in this file.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

No unreleased changes.

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
  wibbly's canonical home is `vulos.org/products/wibbly`, served from the
  `vulos-cloud` repo; the `wibbly-io` Firebase project is a legacy host kept
  as a manual-only (`workflow_dispatch`) deploy so it can no longer silently
  diverge from the canonical copy by auto-deploying on every push.
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
