# Overview

**wibbly is a camera-gesture input layer and game shell for the browser.** Your camera is the
controller, a gesture is an input event like any other, and games are portable objects that run in a
tab with zero install.

wibbly is not a tennis game. wibbly is the input layer plus shell that makes camera-controlled games
cheap to build — plus one reference game, tennis, that proves it.

## Status: early

This section comes first because a good deal of what wibbly intends to be is still a written
specification rather than executing code. Every other page in these docs marks its claims the same
way.

| Capability | State |
|---|---|
| `@vulos/wibbly-input` — four seams + Calibration, importable | **Implemented**, 77 tests green |
| Browser pose tracking (TF.js MoveNet, WebGL) | **Working** |
| Multi-person tracking (`MultiPose.Lightning`, up to 6) | **Implemented**, unit-tested |
| `SpatialBinder` — durable `PlayerId`s, claim zones, occlusion | **Implemented**, unit-tested |
| `swing` gesture as a pure `detectSwing` function | **Implemented**, unit-tested |
| Left- and right-handed play | **Implemented**, unit-tested |
| Adaptive frame pacing | **Implemented**, unit-tested |
| Tennis reference game, running on the seams | **Working** |
| Firebase Analytics | **Removed** — no SDK, no dependency |
| Multi-person play validated with real people | **Not validated** — fixtures are not a living room |
| 2-player tennis | **Next** — the binder is multi-player, the game is not |
| Hand landmarks, pinch, point | **Not started** |
| Networked play, lobbies, payments | **Not started** — no network code at all |
| Tauri desktop shell | **Phase 3** |
| Release build | **Source only** |
| Firebase Hosting | **Still Firebase** — migration queued |

The distinction the table draws twice is worth stating directly: **implemented and unit-tested is not
the same as working.** The multi-person path has 18 binder tests and 11 tracker tests behind it, and
has never been pointed at four people in a room. Unit tests prove that the logic is what we meant;
they say nothing about whether MoveNet holds identity when somebody walks behind the sofa.

The read on the codebase: React 19 + Vite + Three.js, plus a TypeScript package. The tennis game was
always worth keeping. The input layer has now been rebuilt as a library — that was phase 1 and it has
landed. The marketing shell, `src/pages/`, is still larger than the game it markets and still needs
to shrink into this static site.

## The thesis

Three claims, each with a mechanism rather than an adjective.

**Zero install beats native reach.** A link, a wave, a game. No store, no download, no dongle. For
seeding a game library from nothing, that distribution property beats anything a native binary
provides — which is why v1 is browser-first and non-negotiable. See
[Runtime targets](/products/wibbly/docs/runtime-targets).

**Camera frames never leave the device.** Inference runs in your tab because it has to; there is
nowhere fast enough to send frames. The networked design preserves that property by transmitting
`GestureEvent`s — tens of bytes — rather than video. Networked play is not built yet, so treat that
half as a design commitment rather than a shipped feature. The local half is real: the analytics SDK
that used to contradict it has been removed, though hosting is still Firebase.

**Games see interfaces, never vendors.** Game code names no model, no runtime and no vendor. It
consumes four seams, each of which ships a working default. This one is now demonstrable rather than
aspirational — `src/game/game.jsx` imports `WibblyInput`, `SpatialBinder`, `SwingRecognizer` and
`Calibration`, and mentions no model anywhere. See
[Architecture](/products/wibbly/docs/architecture).

## What wibbly is not

- **Not a fork of magnetite.** magnetite is Rust, and its thesis is deterministic authoritative
  simulation with replay verification. Camera input is a noisy, nondeterministic, un-replayable
  sensor stream — the one input class that *cannot* be replay-verified. Merging them would blur the
  property magnetite sells. wibbly consumes magnetite through seams instead, and treats gesture
  input as client-attested. See [Multiplayer & anti-cheat](/products/wibbly/docs/multiplayer).
- **Not ad-supported.** Ad SDKs are central tracking brokers, web-game CPMs need scale wibbly does
  not have, and an interstitial aimed at somebody standing up waving their arms is hostile. See
  [Developer incentives](/products/wibbly/docs/incentives).
- **Not a privacy product.** It is an agency product. Your camera stays yours because of where the
  computation happens, not because of a policy page.

## Where to go next

- [Getting started](/products/wibbly/docs/getting-started) — clone, run, swing.
- [Architecture](/products/wibbly/docs/architecture) — the four seams and the data flow.
- [Model selection](/products/wibbly/docs/models) — the licence and benchmark reasoning.
- [Roadmap](/products/wibbly/docs/roadmap) — three phases and the open questions.
