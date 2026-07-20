# Roadmap

Three phases. The ordering is by risk and by dependency, not by how good each item would look in a
demo.

## Phase 1 — the library (blocks everything)

Nothing else could start until the input layer was importable. **This phase has largely landed.**

- [x] `packages/wibbly-input` scaffold; `poseDetection.js` moved in and **all DOM injection stripped**.
      Published internally as `@vulos/wibbly-input`, Apache-2.0.
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
- [ ] magnetite `InputProvider` seam plus the client-attested anti-cheat path.
- [ ] A second reference game — the only real proof that the SDK generalises beyond tennis.

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

- **The repo is private.** Publishing under `vulos.org/products/wibbly` makes it public-facing.
  Founder call.
- **`navigator.gpu` in WKWebView on macOS 26.** Unresolved in research; needs an empirical test, not
  another citation.
- **Other contributors.** There are several active branches on origin, and the seam refactor deleted
  `poseDetection.js` — shared ground that has now moved under them. Coordinate before they rebase.
- **Hands or body first?** The name says hand gesture; the code does body pose; tennis needs body.
  The flagship input modality has not been decided.
- **No in-browser benchmarks exist** for RTMO or YOLO-pose at any player count. If phase 3 proceeds,
  wibbly measures them itself. There is no number to inherit.
