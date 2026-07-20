# Getting started

wibbly runs as a Vite dev server today. There is no release binary, no Docker image, no installer and
no hosted deployment — those arrive when the input library lands. What follows is the whole of it.

## Requirements

- **Node 20+** and npm.
- **A Chromium-based browser.** Pose estimation runs on the TensorFlow.js WebGL backend; Chrome and
  Edge are what the code has been exercised against. Safari and Firefox are untested rather than
  unsupported — if you try one, report what happened.
- **A webcam**, and a machine with working WebGL.
- **Room.** About two metres of clearance, with your upper body in frame.

## Run it

```bash
git clone https://github.com/vul-os/wibbly
cd wibbly
npm install
npm test        # 86 seam tests — no camera, no GPU, ~2 seconds
npm run dev
```

Open the URL Vite prints — by default `http://localhost:5173`. Grant camera access when the browser
asks. The first load fetches the MoveNet weights over the network; the browser caches them after
that.

```bash
npm run build     # production bundle into dist/
npm run preview   # serve the built bundle locally
```

## Play the tennis demo

1. Open the game from the menu.
2. Stand roughly **two metres** back, upper body fully in frame, with even light on you rather than a
   bright window behind you.
3. **Swing.** The recognizer watches wrist velocity across a short history and fires once per swing,
   gated by a cooldown so one stroke does not register three times. Set your handedness in the camera
   preview — it takes effect on the very next frame.

Three limits are worth knowing before you conclude something is broken.

- **Tennis drives one player.** The tracker returns up to six skeletons and the binder assigns them
  stable ids, but the game reads gestures for `player_1` only. Standing in the right half of the
  frame does not yet get you a second racket.
- **One gesture.** `swing` is the entire vocabulary. There is no serve, no volley classification, no
  pinch and no point — hand tracking is not built.
- **Multi-person is untested in the wild.** The binder is covered by unit tests against fixtures.
  Nobody has verified it against four people in a real room, so expect to find the bugs that
  fixtures do not contain.

## When it does not work

| Symptom | Likely cause |
|---|---|
| No camera preview | Permission denied, or another application holds the device. Check the browser's per-site permissions. |
| Preview shows, nothing swings | You are out of frame, or wrist confidence is under the part-score floor. Step back and improve the lighting. |
| Very laggy | MultiPose costs more than SinglePose did. The adaptive pacer will back the frame rate off; close other WebGL tabs to give it room. |
| Swings fire twice per stroke | Should not happen — a cooldown gates it. If it does, file it with the browser and machine. |
| Backhand and forehand feel swapped | Check the handedness setting in the preview. Handedness flips the sign of the forehand, so getting it wrong inverts both strokes. |
| A second person hijacks the racket | Tennis only listens to `player_1`. Which skeleton holds that id is the binder's call, and claim zones are how you pin it down. |

Every threshold above is an option on a seam rather than a constant in a file. They are listed in
[Configuration](/products/wibbly/docs/configuration).

## Run the tests

```bash
npm test              # from the repo root
npm run typecheck     # tsc --noEmit over the package
```

Seventy-seven tests across five files: the pose tracker, the spatial binder, the swing recognizer,
the adaptive pacer and calibration. They need no camera, no GPU and no display, because every seam
they cover is a pure function over landmark history. That property is the whole reason the refactor
happened — see [Architecture](/products/wibbly/docs/architecture).

What they do not cover is the capture path, the WebGL backend, or anything that requires a human
being. Those still need somebody to stand in front of a webcam.

## Next

- [Architecture](/products/wibbly/docs/architecture) — the four seams and what phase 1 changed.
- [Configuration](/products/wibbly/docs/configuration) — every option on every seam.
