# Getting started

wibbly runs as a Vite dev server today. There is no release binary, no Docker image, no installer and
no hosted deployment — those arrive when the input library lands. What follows is the whole of it.

<style>
.wbf{--a:#C4006B;--am:#8A4B00;--ok:#0F7A3D;--tx:#140F1B;--tx2:#544A61;--ln:#BEB2CD;--sf:#F5F1F9;--pg:#FFFFFF;margin:1.75rem 0}
:root[data-theme="dark"] .wbf{--a:#FF4D9D;--am:#FFB020;--ok:#3FE08A;--tx:#F5F1FA;--tx2:#ADA2BE;--ln:#3A2C52;--sf:#171122;--pg:#0E0A16}
.wbf>.sc{overflow-x:auto;border:1px solid var(--ln);border-radius:10px;background:var(--pg)}
.wbf svg{display:block;height:auto;width:100%;min-width:620px}
.wbf img{display:block;width:100%;height:auto}
.wbf figcaption{font-size:.82rem;line-height:1.65;color:var(--tx2);margin-top:.65rem}
.wbf figcaption b{color:var(--tx)}
</style>

## Requirements

- **Node 20+** and npm.
- **A Chromium-based browser.** Pose estimation runs on the TensorFlow.js WebGL backend; Chrome and
  Edge are what the code has been exercised against. Safari and Firefox are untested rather than
  unsupported — if you try one, report what happened.
- **A webcam**, and a machine with working WebGL.
- **Room.** About two metres of clearance, with your upper body in frame.

<figure class="wbf">
<div class="sc">
<svg viewBox="0 0 900 260" width="900" role="img" aria-label="A framing guide: stand about two metres back from the camera with your upper body — shoulders, elbows and wrists — inside the frame, and even light on your face rather than a bright window behind you.">
  <g font-family="ui-monospace, monospace">
    <text x="16" y="24" font-size="10" fill="var(--tx2)" letter-spacing="1.3">FRAMING GUIDE — SIDE VIEW</text>
    <rect x="24" y="46" width="26" height="18" rx="3" fill="var(--sf)" stroke="var(--a)" stroke-width="1.4"/>
    <circle cx="37" cy="55" r="5" fill="var(--a)"/>
    <text x="10" y="82" font-size="9" fill="var(--tx2)">camera</text>
    <path d="M60 55 H700" stroke="var(--ln)" stroke-width="1.4" stroke-dasharray="5 5"/>
    <path d="M60 40 V70 M700 40 V70" stroke="var(--ln)" stroke-width="1.2"/>
    <text x="330" y="36" font-size="12" font-weight="700" fill="var(--tx)">≈ 2 metres</text>
    <g transform="translate(700,0)">
      <circle cx="20" cy="90" r="22" fill="none" stroke="var(--tx)" stroke-width="2.2"/>
      <path d="M20 112 V178 M-20 138 H60 M20 178 L-6 230 M20 178 L46 230" transform="translate(0,0)" stroke="var(--tx)" stroke-width="2.2" fill="none"/>
    </g>
    <rect x="686" y="60" width="188" height="150" rx="10" fill="none" stroke="var(--ok)" stroke-width="1.6" stroke-dasharray="4 4"/>
    <text x="694" y="76" font-size="9" fill="var(--ok)" font-weight="700">UPPER BODY IN FRAME</text>
    <text x="694" y="234" font-size="9" fill="var(--tx2)">shoulders · elbows · wrists</text>
    <text x="330" y="250" font-size="10" fill="var(--tx2)">Even light on you — not a bright window behind you.</text>
  </g>
</svg>
</div>
<figcaption>What the setup framing check is actually looking for: <b>about two metres of standing distance</b>, with shoulders, elbows and wrists inside the frame. This is a diagram, not a screenshot — see the honesty note under the setup screenshots below for why.</figcaption>
</figure>

## Run it

```bash
git clone https://github.com/vul-os/wibbly
cd wibbly
npm install
npm test        # 86 seam tests — no camera, no GPU, ~2 seconds
npm run dev
```

Open the URL Vite prints — by default `http://localhost:5173`. Grant camera access when the browser
asks. The MoveNet weights are vendored under `public/models/` and served same-origin (no CDN); the
first load reads them from the dev server and the browser caches them after that. Set
`VITE_WIBBLY_MODEL=cdn` only if you deliberately want the lean build that fetches them from TF Hub.

```bash
npm run build     # production bundle into dist/
npm run preview   # serve the built bundle locally
```

## Play the tennis demo

1. Open the game from the menu. First run walks you through a three-step setup wizard before the
   court appears.

<figure class="wbf">
<div class="sc">
<img src="/products/magnetite/wibbly/shots/setup-intro.png" alt="Setup step 1: what the camera is for and why it stays on-device, shown before the browser&#x27;s camera permission prompt appears." loading="lazy" decoding="async" />
</div>
<figcaption>Step 1 of 3. wibbly explains <b>why</b> it wants the camera before the browser asks permission for it — the pipeline described in <a href="/products/magnetite/wibbly/docs/architecture">Architecture</a> starts here.</figcaption>
</figure>

<figure class="wbf">
<div class="sc">
<img src="/products/magnetite/wibbly/shots/setup-handedness.png" alt="Setup step 2: choosing left- or right-handed play, written to Calibration and keyed to your player id." loading="lazy" decoding="async" />
</div>
<figcaption>Step 2 of 3. Handedness is picked once here and persisted to <code>Calibration</code> — see <a href="/products/magnetite/wibbly/docs/configuration">Configuration</a> for how it flips the swing sign rather than branching the code.</figcaption>
</figure>

<figure class="wbf">
<div class="sc">
<img src="/products/magnetite/wibbly/shots/setup-framing.png" alt="Setup step 3: the live framing check running over the camera preview, verifying standing distance and that the upper body is in frame." loading="lazy" decoding="async" />
</div>
<figcaption>Step 3 of 3, <code>checkFraming()</code> running live. <b>Honesty note:</b> this screenshot was captured in headless Chromium against a synthetic test-pattern camera, not a person — TF.js falls back to its CPU backend under SwiftShader. The preview and the live verdict are real; there is no person in frame, so the check correctly reports that it cannot see one. No skeleton is drawn here because none was detected.</figcaption>
</figure>

2. Stand roughly **two metres** back, upper body fully in frame, with even light on you rather than a
   bright window behind you — the same framing the guide above and step 3 check for.
3. **Swing.** The recognizer watches wrist velocity across a short history and fires once per swing,
   gated by a cooldown so one stroke does not register three times. Set your handedness in the camera
   preview — it takes effect on the very next frame.

<figure class="wbf">
<div class="sc">
<img src="/products/magnetite/wibbly/shots/play.png" alt="Tennis in play: the Three.js court and HUD during a rally." loading="lazy" decoding="async" />
</div>
<figcaption>The tennis court and HUD, mid-rally. <b>Honesty note:</b> also captured against the synthetic test-pattern camera used across these screenshots, so no swing was actually detected in this frame — the racket state and score shown are whatever the demo was in when the screenshot was taken, not a live gesture. Treat this as a UI reference, not proof of a working swing.</figcaption>
</figure>

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
[Configuration](/products/magnetite/wibbly/docs/configuration).

## Run the tests

```bash
npm test              # from the repo root
npm run typecheck     # tsc --noEmit over the package
```

363 tests, of which 221 cover the seams across eleven files: the frame source, the pose tracker,
the spatial binder, the swing/pinch/point recognizers, the hand tracker, the pipeline, the adaptive
pacer and calibration. The rest are the peer transport (73), the magnetite authority (5) and the
app itself (64). They need no camera, no GPU and no display, because every seam they cover is a
pure function over landmark history. That property is the whole reason the refactor
happened — see [Architecture](/products/magnetite/wibbly/docs/architecture).

What they do not cover is the capture path, the WebGL backend, or anything that requires a human
being. Those still need somebody to stand in front of a webcam.

## Next

- [Architecture](/products/magnetite/wibbly/docs/architecture) — the four seams and what phase 1 changed.
- [Configuration](/products/magnetite/wibbly/docs/configuration) — every option on every seam.
