# Roadmap

Three phases. The ordering is by risk and by dependency, not by how good each item would look in a
demo.

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
<svg viewBox="0 0 900 250" width="900" role="img" aria-label="The three phases as a dependency chain. Phase 1, the library, is mostly landed with one item outstanding. Phase 2, the platform, is partly started and is gated on validating multi-person tracking against real people. Phase 3, depth, has not been started.">
  <g font-family="ui-monospace, monospace">
    <text x="16" y="26" font-size="10" fill="var(--tx2)" letter-spacing="1.3">ORDERED BY RISK AND DEPENDENCY — NOT BY DEMO VALUE</text>
    <rect x="14" y="44" width="272" height="122" rx="8" fill="var(--sf)" stroke="var(--ok)" stroke-width="1.4"/>
    <text x="30" y="66" font-size="9" fill="var(--tx2)" letter-spacing="1.3">PHASE 1</text>
    <text x="30" y="86" font-size="13.5" font-weight="700" fill="var(--tx)">The library</text>
    <text x="30" y="106" font-size="10" fill="var(--ok)" font-weight="700">● MOSTLY LANDED</text>
    <text x="30" y="126" font-size="9.5" fill="var(--tx2)">6 of 7 items done · 86 tests</text>
    <text x="30" y="142" font-size="9.5" fill="var(--tx2)">outstanding: hand tracking</text>
    <text x="30" y="158" font-size="9.5" fill="var(--tx2)">blocks: everything else</text>
    <rect x="314" y="44" width="272" height="122" rx="8" fill="var(--sf)" stroke="var(--am)" stroke-width="1.4"/>
    <text x="330" y="66" font-size="9" fill="var(--tx2)" letter-spacing="1.3">PHASE 2</text>
    <text x="330" y="86" font-size="13.5" font-weight="700" fill="var(--tx)">The platform</text>
    <text x="330" y="106" font-size="10" fill="var(--am)" font-weight="700">◐ PARTLY STARTED</text>
    <text x="330" y="126" font-size="9.5" fill="var(--tx2)">tennis on the seams · analytics out</text>
    <text x="330" y="142" font-size="9.5" fill="var(--tx2)">gated on: real-people validation</text>
    <text x="330" y="158" font-size="9.5" fill="var(--tx2)">soccer, boxing: no code</text>
    <rect x="614" y="44" width="272" height="122" rx="8" fill="none" stroke="var(--ln)" stroke-width="1.4" stroke-dasharray="5 5"/>
    <text x="630" y="66" font-size="9" fill="var(--tx2)" letter-spacing="1.3">PHASE 3</text>
    <text x="630" y="86" font-size="13.5" font-weight="700" fill="var(--tx)">Depth</text>
    <text x="630" y="106" font-size="10" fill="var(--tx2)" font-weight="700">○ NOT STARTED</text>
    <text x="630" y="126" font-size="9.5" fill="var(--tx2)">RTMO on ONNX + WebGPU</text>
    <text x="630" y="142" font-size="9.5" fill="var(--tx2)">Tauri shell · networked play</text>
    <text x="630" y="158" font-size="9.5" fill="var(--tx2)">incentive rails</text>
    <path d="M290 105 H310" stroke="var(--ln)" stroke-width="1.6"/>
    <path d="M590 105 H610" stroke="var(--ln)" stroke-width="1.6"/>
    <rect x="14" y="188" width="872" height="46" rx="8" fill="none" stroke="var(--a)" stroke-width="1.3"/>
    <text x="30" y="207" font-size="10" font-weight="700" fill="var(--a)" letter-spacing="1.2">THE GATE NOBODY SHOULD SKIP</text>
    <text x="30" y="225" font-size="10" fill="var(--tx2)">Validate multi-person tracking against real people and real cameras. It is implemented and unit-tested on fixtures; it has never met a living room.</text>
  </g>
</svg>
</div>
<figcaption>The highest-risk component — the player binder — was deliberately built <b>first</b>, not deferred. What has not happened is validation: fixtures are not a living room, and that gate sits in front of every claim about couch multiplayer.</figcaption>
</figure>

## Phase 1 — the library (blocks everything)

Nothing else could start until the input layer was importable. **This phase has largely landed.**

- [x] `packages/wibbly-input` scaffold; `poseDetection.js` moved in and **all DOM injection stripped**.
      Published as `@vulos/wibbly-input`, MIT.
- [x] `MoveNetMultiPoseTracker` — SinglePose replaced, `Person[]` returned, `MultiPose.Lightning`
      pinned rather than left to a library default.
- [x] `PlayerBinder` plus the `SpatialBinder` default — nearest-centroid matching, sticky claim zones,
      occlusion timeout. Done early, as intended, because it is the highest risk in the project.
- [x] `SwingRecognizer` extracted as a pure `detectSwing` over landmark history, with unit tests that
      run without a camera.
- [x] Handedness fixed — `isRightHanded = true` is gone, and the empty left-handed branch is replaced
      by a sign flip that both cases test.
- [x] The 15 fps / every-third-frame throttle removed, replaced by `AdaptivePacer` driven by measured
      inference time under a duty-cycle budget.
- [ ] `HandLandmarkTracker` (MediaPipe) plus `PinchRecognizer` and `PointRecognizer`. **Not started.**

Seventy-seven tests pass across the five seam suites. What none of them touch is a camera — see the
validation item at the top of phase 2.

## Phase 2 — the platform

- [x] Tennis ported onto the seams. The game imports `WibblyInput` and names no model anywhere.
- [x] Firebase Analytics removed — SDK gone, dependency out of `package.json`.
- [ ] **Validate multi-person against real people and real cameras.** The binder and tracker are
      implemented and unit-tested; neither has met a living room. This gates every claim about couch
      multiplayer and should come before new features.
- [ ] 2-player local through one camera — the binder is already multi-player, but tennis reads
      gestures for `player_1` only.
- [ ] Migrate hosting off Firebase; the deploy target and GitHub Actions workflow are still there.
- [ ] Static site in the Vulos house style; shrink `src/pages/`, which is still larger than the game
      it markets and still advertises peer-to-peer multiplayer that does not exist.
- [ ] magnetite `InputProvider` seam plus the client-attested anti-cheat path. A
      `packages/wibbly-magnetite` integration is being written, but it has not been proven against a
      live magnetite node — in progress, not available.
- [ ] **Soccer** — second reference game. Chosen because a kick is the first gesture that is *not* a
      swing: it is a lower-body gesture, so it exercises the leg keypoints `SwingRecognizer` ignores
      entirely and forces `GestureRecognizer` to be genuinely plural rather than plural in the type
      signature. No code exists.
- [ ] **Boxing** — third reference game. Chosen because it is the first that needs **two independent
      gesture streams from one player** — left and right hand, tracked separately with per-arm
      cooldowns — which directly contradicts the single-dominant-hand model baked into
      `Calibration.handedness` today. Being head-to-head by nature, it is also the natural first test
      of 2-player local play. No code exists.

> Both games are tracked here with a stated rationale so that any "coming soon" surfaced in the app
> points at real backlog items rather than at nothing. Neither is playable, and neither should ever
> be described as such.

## Phase 3 — depth

- [ ] `RtmoOnnxTracker` on ONNX Runtime Web with WebGPU, benchmarked against MoveNet on our own
      hardware.
- [ ] Tauri shell with `nokhwa` capture and `ort` inference. See
      [Runtime targets](/products/wibbly/docs/runtime-targets).
- [ ] Networked play over magnetite.
- [ ] Incentive rails — rungs 1 to 3 of the
      [ladder](/products/wibbly/docs/incentives).

## Open questions

Genuinely open. None of these has been decided.

- ~~**The repo is private.**~~ **Resolved.** The repo is now public and MIT licensed (root `LICENSE`),
  and `packages/wibbly-input` is MIT too. Publishing under `vulos.org/products/wibbly` is therefore
  no longer gated on a founder call.
- **`navigator.gpu` in WKWebView on macOS 26.** Unresolved in research; needs an empirical test, not
  another citation.
- **Other contributors.** There are several active branches on origin, and the seam refactor deleted
  `poseDetection.js` — shared ground that has now moved under them. Coordinate before they rebase.
- **Hands or body first?** The name says hand gesture; the code does body pose; tennis needs body.
  The flagship input modality has not been decided.
- **No in-browser benchmarks exist** for RTMO or YOLO-pose at any player count. If phase 3 proceeds,
  wibbly measures them itself. There is no number to inherit.
