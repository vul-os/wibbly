# Configuration

There is no config file, no environment variable and no settings UI. wibbly is configured **in code**,
by passing options to the seams when you construct them. That is a deliberate consequence of the
phase-1 refactor: the magic numbers that used to be hardcoded in a 480-line detector are now named,
defaulted and overridable per seam.

Everything below is real and current. Nothing on this page is aspirational.

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
