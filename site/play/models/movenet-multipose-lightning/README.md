# MoveNet MultiPose Lightning — vendored weights

Third-party model files, checked into this repo so the app can be served with
**no external network access at all**. Not written by the wibbly authors.

## What this is

| | |
|---|---|
| Model | MoveNet **MultiPose Lightning**, TF.js graph model |
| Version | `1` (the only published version of the multipose TF.js export) |
| Provenance | `https://tfhub.dev/google/tfjs-model/movenet/multipose/lightning/1` |
| Retrieved via | `https://tfhub.dev/google/tfjs-model/movenet/multipose/lightning/1/model.json?tfjs-format=file` (and the three shards at the same prefix) |
| Retrieved on | 2026-07-20 |
| Copyright | Google LLC |
| Licence | **Apache-2.0** — full text in [`LICENSE`](LICENSE) |
| Converter | TensorFlow.js Converter v3.7.0, `graph-model` format 2.7.0 |

This is the model `MoveNetMultiPoseTracker` already used; vendoring changed
where the bytes come from, not which model runs. See
[`WIBBLY.md` §4](../../../WIBBLY.md) for why MultiPose Lightning was chosen over
the alternatives.

## Files

```
model.json                249,070 bytes   graph topology + weight manifest
group1-shard1of3.bin    4,194,304 bytes
group1-shard2of3.bin    4,194,304 bytes
group1-shard3of3.bin    1,060,230 bytes
                        ─────────────
                        9,697,908 bytes   (~9.3 MiB on disk)
```

The three shards total **9,448,838 bytes**, which is exactly what `model.json`'s
own weight manifest declares — that equality is the integrity check, and it was
verified after download rather than assumed.

SHA-256:

```
7d1875fc5508a0e094de7f4c6a9ab8037680fde8f1c8780da9b09d966983ae7a  model.json
67b47c89fdec3307e0523e7e9854ea762e7e8f332c71e7a255d94eff96b37f7c  group1-shard1of3.bin
44e8bcd60443be39f69c53242324bdf1ef7e19a934816097e00f05792c71baa5  group1-shard2of3.bin
bebbeadc125f787f07948865c88d1a998d9f3fc1f67e1ecaa7e76f8e5fdf8bf0  group1-shard3of3.bin
```

Re-verify at any time with `node scripts/verify-model.mjs`.

## How it is loaded

`MoveNetTrackerConfig.modelUrl` — the package's own key, read off
`@tensorflow-models/pose-detection/dist/movenet/types.d.ts`. The package decides
`fromTFHub` by testing whether the URL contains `https://tfhub.dev`, so a
same-origin URL is loaded as a plain `model.json` + shards, which is what is
here.

Loading from this directory is the **default**. To skip vendoring and pull from
TF Hub at runtime instead (a leaner repo, but an external dependency and a build
that will not work under `default-src 'self'`):

```bash
VITE_WIBBLY_MODEL=cdn npm run build
```

Demo builds reject that setting outright — a demo that reaches the network is
not a demo of an offline-capable game.

## Attribution

MoveNet is published by Google LLC through
[tensorflow/tfjs-models](https://github.com/tensorflow/tfjs-models) under the
Apache License 2.0. The files in this directory are unmodified copies of the
published artefacts. wibbly's own code is MIT (see the repository
[`LICENSE`](../../../LICENSE)); this directory is not.
