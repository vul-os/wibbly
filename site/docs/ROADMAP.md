# Roadmap

Three phases. The ordering is by risk and by dependency, not by how good each item would look in a
demo.

<style>
.wbf{--a:#C4006B;--am:#8A4B00;--ok:#0F7A3D;--tx:#140F1B;--tx2:#544A61;--ln:#BEB2CD;--sf:#F5F1F9;--pg:#FFFFFF;margin:1.75rem 0}
:root[data-theme="dark"] .wbf{--a:#FF4D9D;--am:#FFB020;--ok:#3FE08A;--tx:#F5F1FA;--tx2:#ADA2BE;--ln:#3A2C52;--sf:#171122;--pg:#0E0A16}
.wbf>.sc{overflow-x:auto;border:1px solid var(--ln);border-radius:10px;background:var(--pg)}
.wbf svg{display:block;height:auto;width:100%;min-width:1180px}
.wbf img{display:block;width:100%;height:auto}
.wbf figcaption{font-size:.82rem;line-height:1.65;color:var(--tx2);margin-top:.65rem}
.wbf figcaption b{color:var(--tx)}
</style>

<figure class="wbf">
<div class="sc">
<svg viewBox="0 0 1180 300" width="1180" role="img" aria-label="The three phases as a dependency chain. Phase 1, the library, has landed, though hand-tracking thresholds are unvalidated against a real camera. Phase 2, the platform, is partly started and is gated on validating multi-person tracking against real people. Phase 3, depth, is partly started — the peer-to-peer transport is built, but RTMO and the Tauri shell are not.">
  <g font-family="ui-monospace, monospace">
    <text x="19.2" y="31.2" font-size="12.6" fill="var(--tx2)" letter-spacing="1.56">ORDERED BY RISK AND DEPENDENCY — NOT BY DEMO VALUE</text>
    <rect x="16.8" y="52.8" width="326.4" height="146.4" rx="9.6" fill="var(--sf)" stroke="var(--ok)" stroke-width="1.68"/>
    <text x="36" y="79.2" font-size="12.6" fill="var(--tx2)" letter-spacing="1.56">PHASE 1</text>
    <text x="36" y="103.2" font-size="16.2" font-weight="700" fill="var(--tx)">The library</text>
    <text x="36" y="127.2" font-size="12.6" fill="var(--ok)" font-weight="700">● LANDED</text>
    <text x="36" y="151.2" font-size="12.6" fill="var(--tx2)">7 of 7 items done · 221 tests</text>
    <text x="36" y="170.4" font-size="12.6" fill="var(--tx2)">unvalidated: hand thresholds vs. real camera</text>
    <text x="36" y="189.6" font-size="12.6" fill="var(--tx2)">not wired: hands into the pipeline</text>
    <rect x="376.8" y="52.8" width="326.4" height="146.4" rx="9.6" fill="var(--sf)" stroke="var(--am)" stroke-width="1.68"/>
    <text x="396" y="79.2" font-size="12.6" fill="var(--tx2)" letter-spacing="1.56">PHASE 2</text>
    <text x="396" y="103.2" font-size="16.2" font-weight="700" fill="var(--tx)">The platform</text>
    <text x="396" y="127.2" font-size="12.6" fill="var(--am)" font-weight="700">◐ PARTLY STARTED</text>
    <text x="396" y="151.2" font-size="12.6" fill="var(--tx2)">tennis on the seams · analytics out</text>
    <text x="396" y="170.4" font-size="12.6" fill="var(--tx2)">gated on: real-people validation</text>
    <text x="396" y="189.6" font-size="12.6" fill="var(--tx2)">soccer, boxing: no code</text>
    <rect x="736.8" y="52.8" width="326.4" height="146.4" rx="9.6" fill="var(--sf)" stroke="var(--am)" stroke-width="1.68" stroke-dasharray="6 6"/>
    <text x="756" y="79.2" font-size="12.6" fill="var(--tx2)" letter-spacing="1.56">PHASE 3</text>
    <text x="756" y="103.2" font-size="16.2" font-weight="700" fill="var(--tx)">Depth</text>
    <text x="756" y="127.2" font-size="12.6" fill="var(--am)" font-weight="700">◐ PARTLY STARTED</text>
    <text x="756" y="151.2" font-size="12.6" fill="var(--tx2)">RTMO on ONNX + WebGPU: not started</text>
    <text x="756" y="170.4" font-size="12.6" fill="var(--tx2)">Tauri shell: not started</text>
    <text x="756" y="189.6" font-size="12.6" fill="var(--tx2)">P2P transport: built, no lobby UI</text>
    <path d="M 348 126 H 372" stroke="var(--ln)" stroke-width="1.92"/>
    <path d="M 708 126 H 732" stroke="var(--ln)" stroke-width="1.92"/>
    <rect x="16.8" y="225.6" width="1146.4" height="55.2" rx="9.6" fill="none" stroke="var(--a)" stroke-width="1.56"/>
    <text x="36" y="248.4" font-size="12.6" font-weight="700" fill="var(--a)" letter-spacing="1.44">THE GATE NOBODY SHOULD SKIP</text>
    <text x="36" y="270" font-size="12.6" fill="var(--tx2)">Validate multi-person tracking against real people and real cameras. It is implemented and unit-tested on fixtures; it has never met a living room.</text>
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
- [x] `HandLandmarkTracker` (MediaPipe) plus `PinchRecognizer` and `PointRecognizer`. Implemented
      and unit-tested, including distance-from-camera and rotation invariance. Two gaps remain:
      thresholds are derived from geometry, not measured against a real hand, since no
      hand-tracking session has yet run against a live camera; and `WibblyInput`'s pipeline does
      not yet compose the hand tracker — it still wires body pose and `SwingRecognizer` only. The
      MediaPipe hand model and Wasm runtime are also not vendored in this repo yet.

221 tests pass across the eleven seam suites. What none of them touch is a camera — see the
validation item at the top of phase 2.

## Phase 2 — the platform

- [x] Tennis ported onto the seams. The game imports `WibblyInput` and names no model anywhere.
- [x] Firebase Analytics removed — SDK gone, dependency out of `package.json`.
- [x] Firebase Hosting removed — `firebase.json`, `.firebaserc` and the deploy workflow are gone.
      `dist/` is static files; [Configuration → Hosting](/projects/wibbly/docs/configuration)
      documents nginx, Caddy and dev-server paths. Nothing hosted is left in the deploy path.
- [ ] **Validate multi-person against real people and real cameras.** The binder and tracker are
      implemented and unit-tested; neither has met a living room. This gates every claim about couch
      multiplayer and should come before new features.
- [ ] 2-player local through one camera — the binder is already multi-player, but tennis reads
      gestures for `player_1` only.
- [x] Static site in the Vulos house style; `src/pages/` has been shrunk to title, first-run setup,
      play and 404.
- [x] A real magnetite link: `@vulos/wibbly-authority` compiles magnetite's reference
      `AuthoritativeGame` to wasm and runs it client-side as a `Topology::SingleRoom` match, with
      no server, stepped once per tennis frame by `src/game/magnetite-authority.js`. *(Does not
      verify gesture input or add anti-cheat — camera gestures stay `InputClass::Attested`, never
      replay-verifiable, regardless of where the authority runs. Refused in demo mode, since the
      demo's CSP blocks wasm compilation.)* An earlier design — signing events to a persistent
      `magnetite dev` node over WebSocket — was retired rather than extended; see
      `packages/wibbly-p2p/README.md`'s "What this used to be." Networked multiplayer is a
      separate, magnetite-free track: peer-to-peer WebRTC via `packages/wibbly-p2p` (renamed from
      `packages/wibbly-magnetite`, which no longer has any magnetite code in it).
- [ ] **Palmworks** — folded into [`games/palmworks`](https://github.com/vul-os/wibbly/tree/main/games/palmworks)
      with its full history and its own build: an industrial factory-building game. **Hands are not
      wired to it.** `HandLandmarkTracker` and the pinch/point recognizers now exist (Phase 1,
      above), but nothing in Palmworks or `WibblyInput` calls them yet.
- [ ] **Soccer** — second reference game. Chosen because a kick is the first gesture that is *not* a
      swing: it is a lower-body gesture, so it exercises the leg keypoints `SwingRecognizer` ignores
      entirely and forces `GestureRecognizer` to be genuinely plural rather than plural in the type
      signature. No code exists.
- [ ] **Boxing** — third reference game. Chosen because it is the first that needs **two independent
      gesture streams from one player** — left and right hand, tracked separately with per-arm
      cooldowns — which directly contradicts the single-dominant-hand model baked into
      `Calibration.handedness` today. Being head-to-head by nature, it is also the natural first test
      of 2-player local play. No code exists.

> Soccer and Boxing are tracked here with a stated rationale so that any "coming soon" surfaced in
> the app points at real backlog items rather than at nothing. Neither is playable, and neither
> should ever be described as such. Palmworks is playable as a standalone game today but has no
> gesture wiring — do not describe it as a wibbly game yet either.

## Phase 3 — depth

- [ ] `RtmoOnnxTracker` on ONNX Runtime Web with WebGPU, benchmarked against MoveNet on our own
      hardware.
- [ ] Tauri shell with `nokhwa` capture and `ort` inference. See
      [Runtime targets](/projects/wibbly/docs/runtime-targets).
- [x] Peer-to-peer networked play — host authority in the browser, guest `GestureEvent`s over a
      `RTCDataChannel`, copy-paste/QR signalling by default with Trystero as an optional
      zero-server alternative, free public STUN. No free TURN, so symmetric-NAT/CGNAT peers
      cannot connect — a stated limitation, not a gap to quietly patch later. See
      [Multiplayer & anti-cheat](/projects/wibbly/docs/multiplayer). The transport
      (`PeerSession`, offer/answer helpers, a link-sized codec) is built and unit-tested in
      `packages/wibbly-p2p` (no magnetite dependency), and tennis wires an optional `PeerSession` in already — off
      unless a host page supplies a transport. **Not true yet:** there is no lobby screen
      anywhere in wibbly, so nothing turns this into a button a visitor can click.

## Open questions

Genuinely open. None of these has been decided.

- ~~**The repo is private.**~~ **Resolved.** The repo is now public and MIT licensed (root `LICENSE`),
  and `packages/wibbly-input` is MIT too. Publishing under `vulos.org/projects/wibbly` is therefore
  no longer gated on a founder call.
- **`navigator.gpu` in WKWebView on macOS 26.** Unresolved in research; needs an empirical test, not
  another citation.
- **Other contributors.** There are several active branches on origin, and the seam refactor deleted
  `poseDetection.js` — shared ground that has now moved under them. Coordinate before they rebase.
- **Hands or body first?** The name says hand gesture; the code does body pose; tennis needs body.
  Palmworks raises the stakes on this — it is a hands-first game folded in, and while a hand
  tracker plus pinch/point recognizers now exist as a library, nothing wires them to drive it yet.
  The flagship input modality has not been decided.
- **No in-browser benchmarks exist** for RTMO or YOLO-pose at any player count. If phase 3 proceeds,
  wibbly measures them itself. There is no number to inherit.
