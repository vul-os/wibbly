# Configuration

There is no config file, no environment variable and no settings UI. wibbly is configured **in code**,
by passing options to the seams when you construct them. That is a deliberate consequence of the
phase-1 refactor: the magic numbers that used to be hardcoded in a 480-line detector are now named,
defaulted and overridable per seam.

<style>
.wbf{--a:#C4006B;--am:#8A4B00;--ok:#0F7A3D;--tx:#140F1B;--tx2:#544A61;--ln:#BEB2CD;--sf:#F5F1F9;--pg:#FFFFFF;margin:1.75rem 0}
:root[data-theme="dark"] .wbf{--a:#FF4D9D;--am:#FFB020;--ok:#3FE08A;--tx:#F5F1FA;--tx2:#ADA2BE;--ln:#3A2C52;--sf:#171122;--pg:#0E0A16}
.wbf>.sc{overflow-x:auto;border:1px solid var(--ln);border-radius:10px;background:var(--pg)}
.wbf svg{display:block;height:auto;width:100%;min-width:620px}
.wbf img{display:block;width:100%;height:auto}
.wbf figcaption{font-size:.82rem;line-height:1.65;color:var(--tx2);margin-top:.65rem}
.wbf figcaption b{color:var(--tx)}
</style>

Everything below is real and current. Nothing on this page is aspirational. The in-game menu exposes
a small, honest subset of it as a UI — the rest is construction-time only, as shown below.

<figure class="wbf">
<div class="sc">
<img src="/products/wibbly/shots/in-game-menu-camera.png" alt="The in-game menu&#x27;s Camera tab: a real, wired handedness control sitting next to greyed-out controls for features that are planned but not built." loading="lazy" decoding="async" />
</div>
<figcaption>The Camera tab. <b>Handedness is the one live control here</b> — it writes straight to <code>Calibration</code>, the same seam covered below. The visibly disabled controls next to it correspond to hand tracking and multi-player camera options, which are planned or unvalidated, never silently working.</figcaption>
</figure>

<figure class="wbf">
<div class="sc">
<img src="/products/wibbly/shots/in-game-menu-settings.png" alt="The in-game menu&#x27;s Settings tab: wired settings alongside visibly disabled ones for features that don&#x27;t exist yet." loading="lazy" decoding="async" />
</div>
<figcaption>The Settings tab follows the same rule as the table on this page: <b>a control is either wired to a real option below, or it is disabled</b> rather than pretending to do something. Nothing in this UI is decorative.</figcaption>
</figure>

## Constructing the pipeline

This is roughly what `src/game/game.jsx` does:

```js
import {
  Calibration, SpatialBinder, SwingRecognizer, WibblyInput, equalClaimZones,
} from '@vulos/wibbly-input';

const wibbly = new WibblyInput({
  calibration,
  binder: new SpatialBinder({
    maxPlayers: 2,
    claimZones: equalClaimZones(2),
    forgetAfterMs: 2000,
  }),
  recognizers: [
    new SwingRecognizer({
      // Live lookup, so flipping handedness applies on the next frame.
      handedness: (playerId) => calibration.handednessFor(playerId),
    }),
  ],
  frame: { width: 640, height: 480, fps: 30 },
  onError: (err) => console.error(err),
});

wibbly.onGesture((event) => { /* … */ });
```

Note what the game does *not* name: no model, no runtime, no vendor. Swapping MoveNet for something
else is a change to one constructor argument.

<figure class="wbf">
<div class="sc">
<svg viewBox="0 0 900 150" width="900" role="img" aria-label="The four seams in the same order as Architecture, each labelled with which section of this configuration page owns its options: FrameSource has the frame block, PoseTracker maps to MoveNetMultiPoseTracker, GestureRecognizer maps to SwingRecognizer, PlayerBinder maps to SpatialBinder, and Calibration is its own section feeding the recognizer.">
  <g font-family="ui-monospace, monospace">
    <text x="16" y="22" font-size="10" fill="var(--tx2)" letter-spacing="1.3">EACH OPTION SECTION BELOW OWNS ONE SEAM</text>
    <rect x="14" y="38" width="164" height="78" rx="8" fill="var(--sf)" stroke="var(--ln)"/>
    <text x="26" y="58" font-size="9" fill="var(--tx2)" letter-spacing="1">SEAM 01</text>
    <text x="26" y="76" font-size="11.5" font-weight="700" fill="var(--tx)">FrameSource</text>
    <text x="26" y="94" font-size="9.5" fill="var(--a)">→ frame block</text>
    <rect x="202" y="38" width="164" height="78" rx="8" fill="var(--sf)" stroke="var(--ln)"/>
    <text x="214" y="58" font-size="9" fill="var(--tx2)" letter-spacing="1">SEAM 02</text>
    <text x="214" y="76" font-size="11.5" font-weight="700" fill="var(--tx)">PoseTracker</text>
    <text x="214" y="94" font-size="9.5" fill="var(--a)">→ MoveNetMultiPoseTracker</text>
    <rect x="390" y="38" width="164" height="78" rx="8" fill="var(--sf)" stroke="var(--ln)"/>
    <text x="402" y="58" font-size="9" fill="var(--tx2)" letter-spacing="1">SEAM 04</text>
    <text x="402" y="76" font-size="11.5" font-weight="700" fill="var(--tx)">PlayerBinder</text>
    <text x="402" y="94" font-size="9.5" fill="var(--a)">→ SpatialBinder</text>
    <rect x="578" y="38" width="164" height="78" rx="8" fill="none" stroke="var(--a)" stroke-width="1.4"/>
    <text x="590" y="58" font-size="9" fill="var(--tx2)" letter-spacing="1">SEAM 03</text>
    <text x="590" y="76" font-size="11.5" font-weight="700" fill="var(--tx)">GestureRecognizer</text>
    <text x="590" y="94" font-size="9.5" fill="var(--a)">→ SwingRecognizer</text>
    <rect x="766" y="38" width="120" height="78" rx="8" fill="var(--sf)" stroke="var(--ln)"/>
    <text x="778" y="58" font-size="9" fill="var(--tx2)" letter-spacing="1">FEEDS 03</text>
    <text x="778" y="76" font-size="11.5" font-weight="700" fill="var(--tx)">Calibration</text>
    <text x="778" y="94" font-size="9.5" fill="var(--a)">→ own section</text>
    <text x="14" y="138" font-size="9.5" fill="var(--tx2)"><tspan fill="var(--am)">AdaptivePacer</tspan> sits across all of it, pacing every seam's call rate — it has its own section below too.</text>
  </g>
</svg>
</div>
<figcaption>Same four seams as <a href="/products/wibbly/docs/architecture">Architecture</a>, relabelled with the option section that configures each one. If you are looking for a specific constant, find its seam here first.</figcaption>
</figure>

## `MoveNetMultiPoseTracker`

| Option | Default | What it does |
|---|---|---|
| `maxPeople` | `6` | Skeletons returned per frame. Six is the model's hard ceiling, and MultiPose's cost does not scale with the count. |
| `minPoseScore` | — | Whole poses below this score are dropped. |
| `multiPoseMaxDimension` | `256` | Inference resolution; a multiple of 32, recommended range 128–512. Higher is more accurate and slower. This is the main accuracy/latency dial. |
| `enableSmoothing` | — | Temporal keypoint smoothing. The model requires tracking for this in multi-pose mode, so the package forces `enableTracking: true` whenever it is on. |
| `flipHorizontal` | — | Mirrors the input before inference. |

`modelType` is not an option — it is pinned to `MultiPose.Lightning`. Leaving it to a library default
is exactly the bug that made wibbly single-person for its whole first life.

## `SpatialBinder`

| Option | What it does |
|---|---|
| `maxPlayers` | Ceiling on simultaneously bound players. |
| `matchRadius` | Maximum normalised centroid movement between consecutive frames that still counts as the same person. Too small drops a fast-moving player; too large lets two nearby players swap identity. |
| `forgetAfterMs` | How long a player keeps their id while undetected. This is the occlusion budget. After it expires, the id and its zone are released and a returning player is treated as new. |
| `minPoseScore` | Poses below this are ignored entirely. |
| `minKeypointScore` | Minimum keypoint score used when computing a centroid. |
| `claimZones` | Regions a *newly seen* person claims by standing in one. Zones are **sticky on claim**: once you own a zone you keep your id even if you walk out of it, so two players crossing over do not swap. Zones matter at claim time and re-acquisition time, never as a per-frame reassignment. |

`equalClaimZones(n)` builds `n` equal vertical strips — left half and right half for the couch case.

## `SwingRecognizer` / `detectSwing`

| Option | Default | What it does |
|---|---|---|
| `minHorizontal` | `0.0625` | Minimum normalised horizontal travel for a swing. |
| `minVertical` | `0.028` | Minimum normalised vertical travel. |
| `minSpeed` | `0.0004` | Minimum normalised speed. |
| `windowSize` | `3` | Frames compared to measure displacement. |
| `historyLength` | `5` | Wrist samples retained. Shorter reacts faster and is noisier. |
| `minSamples` | `3` | Samples required before a swing can fire at all. |
| `cooldownMs` | `500` | Suppresses repeats. Raise it if one stroke registers twice; lower it for faster rallies. |
| `minKeypointScore` | `0.3` | Floor on wrist confidence before a sample enters history. |
| `mirrored` | `false` | Whether the frame is mirrored, which flips the forehand sign. |

`handedness` is not a boolean flag but a lookup — pass a function of `playerId` and calibration
changes apply on the next frame. Handedness is a **sign flip**, not a duplicated branch, which is why
left-handed play cost one function rather than a second code path.

## `AdaptivePacer`

Replaces the old fixed 15 fps target and the every-third-frame skip. Rather than guessing, it measures
inference time and adjusts.

| Option | Default | What it does |
|---|---|---|
| `maxFps` | `60` | Ceiling even when inference is free. |
| `minFps` | `8` | Floor even when inference is slow, so the loop stays responsive. |
| `dutyCycle` | `0.5` | Fraction of wall-clock time inference may occupy. This is the knob that stops pose detection starving rendering and physics. |
| `smoothing` | `0.2` | EWMA smoothing on measured inference time. Higher is more reactive and noisier. |

## `Calibration`

Per-player, `localStorage`-backed, keyed by `PlayerId`: handedness, reach envelope, framing and
lighting checks. It is what makes handedness a runtime setting instead of a constant.

## Hosting

The build deploys to **Firebase Hosting** via a GitHub Actions workflow. Firebase *Analytics* has been
removed — the SDK is gone and the dependency is out of `package.json` — but the hosting target and
workflow remain. Migrating off is queued; see the [roadmap](/products/wibbly/docs/roadmap).
