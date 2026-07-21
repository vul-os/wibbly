# Overview

**wibbly is a camera-gesture game built on [magnetite](https://github.com/vul-os/magnetite)**, the
decentralized, self-hostable Rust games platform. Your camera is the controller, a gesture is an
input event like any other, and the game runs in a tab with zero install.

Magnetite is the platform; wibbly is what building on it looks like when your controller is a
webcam. Concretely, wibbly today is one reference game — tennis — with soccer and boxing specified
in the backlog, and [Palmworks](https://github.com/vul-os/wibbly/tree/main/games/palmworks), an
industrial factory-building game, folded into `games/` with its full history and not yet wired to
any gesture. wibbly is free and dual-licensed **MIT OR Apache-2.0** — there is no payment path
anywhere in it: no wagers, no tournament pools, no revenue share, no ads.

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
<img src="/products/magnetite/wibbly/shots/title.png" alt="Tennis is playable today from the title screen; soccer and boxing are listed as planned reference games with no code behind them yet." loading="lazy" decoding="async" />
</div>
<figcaption>The title screen, as it looks today. <b>Tennis is real and playable</b>; soccer and boxing are named on the same screen but are backlog entries, not games — see the status table below for what that distinction means everywhere else in these docs.</figcaption>
</figure>

## Status: early

This section comes first because a good deal of what wibbly intends to be is still a written
specification rather than executing code. Every other page in these docs marks its claims the same
way — using the three states below.

<figure class="wbf">
<div class="sc">
<svg viewBox="0 0 900 190" width="900" role="img" aria-label="A key to the three-state honesty convention used throughout these docs: a filled dot means shipped and working, a half-filled dot means implemented but only unit-tested on synthetic fixtures and never validated with a camera, and a hollow ring means planned with no code.">
  <g font-family="ui-monospace, monospace">
    <text x="16" y="22" font-size="10" fill="var(--tx2)" letter-spacing="1.3">HOW TO READ THE STATE COLUMN — ONE OF THREE GLYPHS, ALWAYS</text>
    <circle cx="30" cy="52" r="11" fill="var(--ok)"/>
    <text x="56" y="49" font-size="13" font-weight="700" fill="var(--tx)">Shipped / working</text>
    <text x="56" y="65" font-size="10" fill="var(--tx2)">Runs today, exercised by hand or by CI against real inputs.</text>
    <path d="M30 93 A11 11 0 0 1 30 115 Z" fill="var(--am)"/>
    <circle cx="30" cy="104" r="11" fill="none" stroke="var(--am)" stroke-width="1.6"/>
    <text x="56" y="101" font-size="13" font-weight="700" fill="var(--tx)">Implemented, unvalidated</text>
    <text x="56" y="117" font-size="10" fill="var(--tx2)">Unit-tested on synthetic fixtures only — never run against a real camera.</text>
    <circle cx="30" cy="156" r="11" fill="none" stroke="var(--ln)" stroke-width="1.6"/>
    <text x="56" y="153" font-size="13" font-weight="700" fill="var(--tx)">Planned / spec</text>
    <text x="56" y="169" font-size="10" fill="var(--tx2)">Written down, tracked in the backlog. No code exists yet.</text>
  </g>
</svg>
</div>
<figcaption>Three states, not two. <b>The middle one is the trap</b> — a green test suite over synthetic fixtures proves the logic does what was intended, and says nothing about whether it survives a real room. Every capability below is one of these three, never a blend.</figcaption>
</figure>

| Capability | State |
|---|---|
| `@vulos/wibbly-input` — four seams + Calibration, importable | **Implemented**, 86 tests green |
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
| Hand landmarks, pinch, point | **Implemented**, unit-tested — not wired into the pipeline or any game, thresholds unvalidated against a real camera |
| magnetite integration (`packages/wibbly-magnetite`) | **In progress** — unproven against a live node |
| Networked play (peer-to-peer, browser-hosted) | **Transport implemented**, unit-tested, wired into tennis (off by default) — no lobby UI, so nothing turns it into a click-to-play flow |
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

<figure class="wbf">
<div class="sc">
<svg viewBox="0 0 900 170" width="900" role="img" aria-label="Three thesis claims, each paired with its mechanism: zero install is delivered by running in a browser tab, camera-privacy is delivered by on-device inference, and vendor-neutral game code is delivered by the four seams.">
  <g font-family="ui-monospace, monospace">
    <rect x="8" y="16" width="276" height="138" rx="8" fill="var(--sf)" stroke="var(--ln)"/>
    <text x="24" y="42" font-size="12" font-weight="700" fill="var(--a)">Zero install</text>
    <text x="24" y="64" font-size="10" fill="var(--tx2)">beats native reach</text>
    <line x1="24" y1="78" x2="268" y2="78" stroke="var(--ln)"/>
    <text x="24" y="98" font-size="9" fill="var(--tx2)" letter-spacing="1">MECHANISM</text>
    <text x="24" y="118" font-size="11" fill="var(--tx)">Runs in a browser tab —</text>
    <text x="24" y="136" font-size="11" fill="var(--tx)">a link, a wave, a game.</text>
    <rect x="312" y="16" width="276" height="138" rx="8" fill="var(--sf)" stroke="var(--ln)"/>
    <text x="328" y="42" font-size="12" font-weight="700" fill="var(--a)">Frames never leave</text>
    <text x="328" y="64" font-size="10" fill="var(--tx2)">the device</text>
    <line x1="328" y1="78" x2="572" y2="78" stroke="var(--ln)"/>
    <text x="328" y="98" font-size="9" fill="var(--tx2)" letter-spacing="1">MECHANISM</text>
    <text x="328" y="118" font-size="11" fill="var(--tx)">Inference runs in-tab;</text>
    <text x="328" y="136" font-size="11" fill="var(--tx)">only GestureEvents cross.</text>
    <rect x="616" y="16" width="276" height="138" rx="8" fill="none" stroke="var(--a)" stroke-width="1.4"/>
    <text x="632" y="42" font-size="12" font-weight="700" fill="var(--a)">Games see interfaces,</text>
    <text x="632" y="64" font-size="10" fill="var(--tx2)">never vendors</text>
    <line x1="632" y1="78" x2="876" y2="78" stroke="var(--ln)"/>
    <text x="632" y="98" font-size="9" fill="var(--tx2)" letter-spacing="1">MECHANISM</text>
    <text x="632" y="118" font-size="11" fill="var(--tx)">Four seams, each with a</text>
    <text x="632" y="136" font-size="11" fill="var(--tx)">working default. See below.</text>
  </g>
</svg>
</div>
<figcaption>Each claim is backed by a specific mechanism, not an adjective — the prose below spells out what is shipped versus committed for each one.</figcaption>
</figure>

**Zero install beats native reach.** A link, a wave, a game. No store, no download, no dongle. For
seeding a game library from nothing, that distribution property beats anything a native binary
provides — which is why v1 is browser-first and non-negotiable. See
[Runtime targets](/products/magnetite/wibbly/docs/runtime-targets).

**Camera frames never leave the device.** Inference runs in your tab because it has to; there is
nowhere fast enough to send frames. The networked design — peer-to-peer, one player's browser
authoritative, no backend — preserves that property by transmitting `GestureEvent`s — tens of
bytes — rather than video. Networked play is not built yet, so treat that half as a design
commitment rather than a shipped feature. The local half is real: the analytics SDK that used to
contradict it has been removed, though hosting is still Firebase.

**Games see interfaces, never vendors.** Game code names no model, no runtime and no vendor. It
consumes four seams, each of which ships a working default. This one is now demonstrable rather than
aspirational — `src/game/game.jsx` imports `WibblyInput`, `SpatialBinder`, `SwingRecognizer` and
`Calibration`, and mentions no model anywhere. See
[Architecture](/products/magnetite/wibbly/docs/architecture).

## What wibbly is not

- **Not a platform.** magnetite is the platform — a decentralized, self-hostable Rust games
  runtime. wibbly is a game (a small suite of them) that consumes it. Calling wibbly "the input
  layer and shell" made one game look like infrastructure it isn't.
- **Not a fork of magnetite, and not a merge candidate.** magnetite is Rust; its thesis is
  deterministic authoritative simulation with replay verification, and camera input is a noisy,
  nondeterministic sensor stream that cannot be replay-verified. That used to be the argument for
  keeping two repos, but it has partly expired: magnetite now enforces the verifiable/attested
  boundary itself, in code, with `InputClass::{Deterministic, Attested}` and a `PlausibilityGate` —
  see [Multiplayer & anti-cheat](/products/magnetite/wibbly/docs/multiplayer). The reason two repos
  still make sense is different: staying separate is a **conformance test**. wibbly can only reach
  magnetite through whatever magnetite chose to publish, because a repo boundary is the one thing
  that makes reaching past that impossible by accident.
- **Not monetized, in any form.** No wagers, no tournament pools, no revenue share, no host-earns
  split, no ads. wibbly is free and dual-licensed **MIT OR Apache-2.0**. This was previously a
  backlog item (an incentive ladder); it has since been deleted outright rather than deprioritized.
- **Not a privacy product.** It is an agency product. Your camera stays yours because of where the
  computation happens, not because of a policy page. That is a privacy property, not a security
  one — it says nothing about whether a gesture can be verified, only about who gets to see the
  camera feed it came from.

## Where to go next

- [Getting started](/products/magnetite/wibbly/docs/getting-started) — clone, run, swing.
- [Architecture](/products/magnetite/wibbly/docs/architecture) — the four seams and the data flow.
- [Model selection](/products/magnetite/wibbly/docs/models) — the licence and benchmark reasoning.
- [Roadmap](/products/magnetite/wibbly/docs/roadmap) — three phases and the open questions.
