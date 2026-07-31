# Getting started (developers)

> Looking to just play the game? You don't need any of this — see [Play](/projects/wibbly/docs/play)
> instead. This page is for running wibbly from source: cloning it, building it, and testing it.

wibbly runs as a Vite dev server. There is no release binary, no Docker image and no installer —
you run it from a clone.

## Requirements

- **Node 20+** and npm.
- **A Chromium-based browser** for manual testing. Pose estimation runs on the TensorFlow.js WebGL
  backend; Chrome and Edge are what the code has been exercised against. Safari and Firefox are
  untested rather than unsupported — if you try one, report what happened.
- **A webcam**, if you want to exercise the camera path rather than the spacebar fallback.

## Run it

```bash
git clone https://github.com/vul-os/wibbly
cd wibbly
npm install
npm test        # 368 tests across four workspaces — no camera, no GPU, a few seconds
npm run dev
```

Open the URL Vite prints — by default `http://localhost:5173`. Grant camera access when the
browser asks, or skip it and use the spacebar. The MoveNet weights are vendored under
`public/models/` and served same-origin (no CDN); the first load reads them from the dev server
and the browser caches them after that. Set `VITE_WIBBLY_MODEL=cdn` only if you deliberately want
the lean build that fetches them from TF Hub instead.

```bash
npm run build     # production bundle into dist/
npm run preview   # serve the built bundle locally
```

See [Play](/projects/wibbly/docs/play) for how to actually play once it's running, and
[Configuration](/projects/wibbly/docs/configuration) for every tunable constant on every seam.

## Run the tests

```bash
npm test              # from the repo root
npm run typecheck     # tsc --noEmit over the TypeScript packages
```

368 tests, real and passing, split four ways: 221 cover the input seams
(`@vulos/wibbly-input`) across eleven files — the frame source, the pose tracker, the spatial
binder, the swing/pinch/point recognizers, the hand tracker, the pipeline, the adaptive pacer and
calibration; 73 cover the peer-to-peer transport (`@vulos/wibbly-p2p`); 10 cover the magnetite
authority link (`@vulos/wibbly-authority`); and 64 cover the app itself (ball physics, player
positioning, game settings, the mode gate, the game catalogue). None of it needs a camera, a GPU or
a display, because every seam it covers is a pure function over data — see
[Architecture](/projects/wibbly/docs/architecture) for why that was the point of the refactor.

What the tests do not cover is the capture path, the WebGL backend, or anything that requires a
human being in front of a webcam. Those still need somebody to stand there — see
[How it works → Multiplayer](/projects/wibbly/docs/multiplayer) for exactly what "unit-tested" does
and doesn't prove about the multi-person path.

## The embeddable demo

```bash
npm run dev:demo       # http://localhost:5173, demo mode
npm run build:demo     # → dist-demo/, a single-surface build for embedding
npm run verify:demo    # builds it, serves it under the real production CSP,
                        # and drives it with Chromium — 26 checks
npm run verify:model   # re-checks the vendored MoveNet weights against their manifest
```

`build:demo` produces a self-contained build for a same-origin iframe embed — no router, no
persistent storage, magnetite disabled, local model only. Full detail on what it does and doesn't
do is in the repo's own `README.md`.

## Screenshots

```bash
npm i -D playwright && npx playwright install chromium
npm run screenshots
```

Runs Playwright against a real build with a synthetic camera stream (a rolling test pattern, not a
person), so no skeleton is drawn and no gesture fires in any shot — nothing here is composited or
staged. Regenerate with `--headed` on a machine with a real camera and a real GPU to see tracking
actually succeed.

## Next

- [Architecture](/projects/wibbly/docs/architecture) — the four seams and what phase 1 changed.
- [Configuration](/projects/wibbly/docs/configuration) — every option on every seam.
- [Roadmap](/projects/wibbly/docs/roadmap) — what's next, and in what order.
