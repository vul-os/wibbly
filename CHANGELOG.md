# Changelog

All notable changes to wibbly are documented in this file.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added

- **A full PNG icon set, rendered from `brand/logo.svg`.** `brand/icons/` now has 16/32/48/64/
  96/128/180/192/256/512/1024px renders, 192px and 512px maskable variants (mark inset to the
  80% safe zone), an opaque apple-touch-icon, and a multi-resolution `favicon.ico` — all
  rendered from the one approved drawing, not redrawn by hand, then copied outward into `site/`
  and `public/` and wired into the web manifests. wibbly previously shipped no PNG icons at
  all; its manifest declared `"icons": []` — an installable PWA with no installable icon.
- **`@vulos/wibbly-authority` — a real magnetite authority, running client-side.** Loads
  magnetite's reference `AuthoritativeGame` (`game-templates/authoritative`), compiled to
  `wasm32-unknown-unknown` (`public/magnetite/arena-authority.wasm`, ~275 KB), and drives it
  through the `mag_*` sandbox ABI as a `Topology::SingleRoom` match — the bottom rung of
  magnetite's own topology ladder, hosted by the browser tab with no server.
  `src/game/magnetite-authority.js` steps it once per tennis frame, fed by the match's own
  gesture events. This is what makes "wibbly is built on magnetite" literally true, replacing
  the earlier signed-wire-to-a-live-node design (see Changed, below). It does not verify
  gesture input or add anti-cheat — camera gestures stay `InputClass::Attested`, never
  replay-verifiable, regardless of where the authority runs — and it is refused in demo mode,
  since the demo's `default-src 'self'` CSP has no `wasm-unsafe-eval` and blocks wasm
  compilation (`verify:demo` stays 26/26). 10 unit tests.

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
- **`site/index.html` rewritten player-first: Play and Privacy lead, build docs last.** The old
  landing led with seams/API contracts, model-selection rationale and a phase roadmap — content
  a player never asked for. None of it was deleted: every section that used to live on the
  landing already exists, in equal or greater detail, in `site/docs/`. The new landing teases
  each topic in a sentence and links out.
- **`site/docs/` regrouped and split for players first, developers last.** The old two-page
  `OVERVIEW.md` / `PLAY.md` pair is gone. In its place: **Play** (`how-to-play`,
  `whats-in-it-today`, `troubleshooting`), **Your camera** (`privacy`), **How it works**
  (`architecture`, `models`, `multiplayer`), **Build it yourself** (`getting-started`,
  `configuration`, `runtime-targets`, `roadmap`) — group order now matches what a player needs
  before what a contributor needs.
- **`README.md` restructured to lead with the player, not the seams.** The old `## Overview`
  opened with `InputClass::Attested` and `Topology::SingleRoom` before a reader had been told
  what the thing does. It is now `## What is wibbly?` (a plain paragraph: swing your arm, play
  tennis, nothing leaves your device) followed by a new `## Part of VulOS` section (the required
  suite banner + standalone promise) and a new `## Features` section. The architecture detail
  that used to open the README moved to `## How it works` (renamed from `## Architecture — the
  seams`), where a reader who wants it can still find all of it. `## Quick start` is now
  `## Quick start (standalone)`; new `## Configuration`, `## Development` and `## Contributing`
  sections were added, none of which previously existed. The status table, the honest-limits
  blockquote at the top, and every fact in both survive unchanged.

### Fixed

- **`README.md`'s test count was stale: it said 363/5, the suite runs 368/10.** Verified by
  actually running `npm test`: 221 `@vulos/wibbly-input` + 73 `@vulos/wibbly-p2p` + **10**
  `@vulos/wibbly-authority` (not 5) + 64 app tests = **368**, not 363.
- **`README.md`'s demo-mode status row said `vulos.org/projects/wibbly/play/`; every other
  mention in the same file, `package.json`'s `build:demo` script, and `scripts/verify-demo.mjs`'s
  `PREFIX` all say `/products/wibbly/play/`.** One line disagreed with the other nine. Fixed to
  `/products/wibbly/play/`, and `docs/screenshots/README.md`'s note on the demo screenshots
  (which said `/products/magnetite/wibbly/play/`, matching neither) was fixed the same way.
- **README's "zero external network requests" file list from `verify:demo` was missing three
  files.** Running the check fresh shows the vendored fonts (`instrument-sans-*.woff2`,
  `jetbrains-mono-*.woff2`, `archivo-*.woff2`) as same-origin requests the demo now makes; the
  README's list, written before fonts were vendored, only had the JS/CSS/model/GLB entries.
  Still zero external requests — the check output is unchanged — only the README's transcription
  of it was stale.
- **`WIBBLY.md` and `games/README.md` disagreed on the hand-tracker asset size** (`~25 MB` in
  both, `~40 MiB` in `README.md`). Measured directly: the `.task` model is 7.46 MiB and
  `scripts/vendor-hand-assets.mjs` copies all six `@mediapipe/tasks-vision` wasm variants, ~32.2
  MiB — 39.65 MiB total, matching `README.md`'s figure. `WIBBLY.md` corrected to `~40 MiB`;
  `games/README.md` is out of this pass's scope (owned by the games/ agent) and still says
  `~25 MB` — flagged, not changed here.
- **`WIBBLY.md`'s title-screen note only accounted for two of the four cards.** It said the title
  screen "shows Soccer and Boxing as Planned cards" — true, but `src/components/catalogue.js` has
  had a fourth entry, Palmworks (`status: 'planned'`), since the catalogue was written. Palmworks
  is a real, independently-buildable app, unlike Soccer/Boxing which are no code at all — the note
  now says so, and `README.md`'s status table gained a dedicated Palmworks row making the same
  distinction.

- **`npm run verify:demo` was red on `main`, and had been since the demo slug moved.**
  `build:demo` bases the bundle at `/products/wibbly/play/`, but `scripts/verify-demo.mjs`
  still served `dist-demo/` under `/products/magnetite/wibbly/play/` and 404s everything
  outside its mount point — so every hashed asset 404'd, the page never booted, and the run
  died on a Playwright timeout after 2 checks. It failed loudly rather than silently, but it
  named the wrong cause and covered almost nothing, while the README, the site and the docs
  all cited "26/26 checks" as evidence. `PREFIX` now matches the build base, and two guards
  stop the pair drifting again: the script reads the built `index.html` and refuses to start
  if any absolute asset URL falls outside `PREFIX` (naming both values), and the verdict now
  asserts a coverage count — 26 checks must actually have run, because "all checks passed" is
  worthless when the number of checks can quietly fall to two. Verified: 26/26.

- **The spacebar-fallback check was measuring a log that had been silenced.** It counted
  `console` lines matching `Handling swing`, but that call was routed through the opt-in
  `debugLog` (off by default for real players). Once the page booted again, the check read
  0 swings while the game was in fact swinging — the *next* check, which only fires after six
  real swings, passed. It now loads the demo with `?debug=1`, the documented opt-in.

### Removed

- **Firebase Hosting — the last hosted third-party service in this repo.** `firebase.json`
  (which pointed Firebase Hosting at `dist/` with an SPA rewrite), `.firebaserc` (the
  `wibbly-io` project id) and `.github/workflows/firebase-hosting-merge.yml` are deleted. No
  vendor replaced it: `dist/` is static files, and `README.md`'s new **Deploying it** section
  plus `site/docs/CONFIGURATION.md`'s **Hosting** section give the self-host path — nginx,
  Caddy, `npm run preview`, and the only two things the bundle asks of a server (SPA fallback,
  `application/wasm`). Optional exposure beyond a LAN is an [Ephor](https://github.com/vul-os/ephor)
  instance you run; wibbly contains no code that knows about Ephor. Firebase *Analytics* was
  already gone (0.1.0); this removes the deploy path too, so nothing hosted remains. The only
  surviving mentions of Firebase are this changelog and `WIBBLY.md` §1's dated audit snapshot,
  both of which are records of what was true then.

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
- **Demo-bundle verification** (`npm run verify:demo`) — Playwright (chromium)
  drives the built `dist-demo/` under the real production CSP at its deploy
  sub-path and asserts the bundle is self-contained: zero external requests,
  no 4xx, the vendored model fetched locally, no storage or cookies left
  behind, and the spacebar fallback still playable with the camera refused.
  Plus 18 app-shell unit tests (`test/mode.test.js`). *(Corrected 2026-07-28:
  this entry previously described a "browser end-to-end test suite" with a
  mocked backend and a boot guard over "ThemePicker, Login, IDE analogue"
  surfaces. wibbly has no backend and has never had any of those three
  surfaces — the text was imported from another project's changelog and
  described software that does not exist here. What did land is the above.)*
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
