# Model selection

Researched 2026-07-20. The models below are **chosen and licence-cleared**. The body model is running
today in its multi-person variant; the hand model is not integrated at all. This page exists so nobody
relitigates the decision from scratch in six months.

## Chosen

### Body — MoveNet MultiPose Lightning

TF.js, **Apache 2.0**. Up to six people per frame.

TF.js documents that **person count does not affect inference speed** — a flat cost curve, which is
exactly the property a 2–4 player couch game needs. It is also the only multi-person model with
published **in-browser** frame rates, rather than server-GPU numbers quoted at a browser audience:

| Device (WebGL) | SinglePose Lightning | SinglePose Thunder | **MultiPose** |
|---|---|---|---|
| MacBook Pro 15" | 104 | 77 | **54** |
| Desktop i9-10900K | 87 | 82 | **62** |
| iPhone 12 | 51 | 43 | **24** |

Source: the [tfjs-models MoveNet README](https://github.com/tensorflow/tfjs-models/blob/master/pose-detection/src/movenet/README.md).
Vendor-published, but browser-real — which is more than any alternative offers.

> **This is what runs now.** `MoveNetMultiPoseTracker` pins `modelType: 'MultiPose.Lightning'` rather
> than inheriting a library default — the earlier code left that option commented out, silently got
> SinglePose, and was therefore structurally incapable of multi-player. The tracker is covered by 11
> unit tests. It has not been benchmarked on this project's own hardware, so the table above remains
> the vendor's numbers rather than ours.

### Hands — MediaPipe HandLandmarker

**Apache 2.0**. Twenty-one landmarks per hand, multi-hand, first-class web support. Realistically the
only browser hand option.

Vendor-claimed 17.12 ms CPU / 12.27 ms GPU on a Pixel 6 — mobile numbers, not browser numbers, so
treat them as an order of magnitude rather than a promise. Its eight canned gestures are thin for
games; wibbly classifies from raw landmarks in its own recognizers instead.

**Nothing hand-related is implemented.** No tracker, no pinch, no point.

## Rejected, with reasons

| Model | Why not |
|---|---|
| **RTMO** (bottom-up, CVPR 2024, Apache 2.0) | Technically the right architecture — 0.677–0.724 COCO AP at 8.9–19.1 ms. But those are **V100** numbers, and there is **no browser port and no WebGPU benchmark**. Unproven engineering, not a drop-in. Kept as the documented phase-3 upgrade behind `PoseTracker`. |
| **YOLOv8 / YOLO11-pose** | One-stage, browser demos exist, but **AGPL-3.0** — compliance requires open-sourcing the entire derivative work. A commercial non-starter without an Enterprise licence. |
| **WiLoR** (best hand model) | **CC BY-NC-ND 4.0** — non-commercial *and* no-derivatives. Unusable. It also depends on Ultralytics, which is AGPL. |
| **HaMeR** | Research / non-commercial terms; MANO independently restricts commercial use. |
| **MediaPipe PoseLandmarker** | Top-down, so cost scales with the number of people. Documented failure mode: two people within ~75 cm at 3.5 m drop a detection. Google publishes **no** latency numbers for it. Do not build 4-player on this. |
| **ViTPose** | About 1 FPS on a 2080 Ti. Not real-time by any definition that matters here. |
| **MediaPipe Holistic** | Single-person only, no published benchmarks, and it has carried a stale "upgraded version coming soon" banner since 2023. Stability risk. |

Note the pattern: three of the seven were rejected on **licence**, not on accuracy. In a codebase
that intends to be shipped commercially and self-hosted by strangers, licence is a hard gate applied
before benchmarks are even read.

## Runtime correction

**MediaPipe Tasks Web's "GPU" delegate is WebGL, not WebGPU.** WebGPU for vision tasks remains an
open upstream feature request. If wibbly wants WebGPU it is on ONNX Runtime Web — production-viable,
but more work. The MoveNet numbers in the table above are WebGL.

## What is not benchmarked

There are **no in-browser benchmarks in existence** for RTMO or YOLO-pose at any player count. If
phase 3 proceeds, wibbly measures them itself; there is no number to inherit. Any future claim about
those models has to come with a measurement taken on this project's own hardware.
