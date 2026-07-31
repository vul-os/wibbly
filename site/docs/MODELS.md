# Model selection

Researched 2026-07-20. The models below are **chosen and licence-cleared**. The body model is running
today in its multi-person variant; the hand model is not integrated at all. This page exists so nobody
relitigates the decision from scratch in six months.

<style>
.wbf{--a:#C4006B;--am:#8A4B00;--ok:#0F7A3D;--tx:#140F1B;--tx2:#544A61;--ln:#BEB2CD;--sf:#F5F1F9;--pg:#FFFFFF;margin:1.75rem 0}
:root[data-theme="dark"] .wbf{--a:#FF4D9D;--am:#FFB020;--ok:#3FE08A;--tx:#F5F1FA;--tx2:#ADA2BE;--ln:#3A2C52;--sf:#171122;--pg:#0E0A16}
.wbf>.sc{overflow-x:auto;border:1px solid var(--ln);border-radius:10px;background:var(--pg)}
.wbf svg{display:block;height:auto;width:100%;min-width:1220px}
.wbf img{display:block;width:100%;height:auto}
.wbf figcaption{font-size:.82rem;line-height:1.65;color:var(--tx2);margin-top:.65rem}
.wbf figcaption b{color:var(--tx)}
</style>

## Chosen

### Body — MoveNet MultiPose Lightning

TF.js, **Apache 2.0**. Up to six people per frame.

TF.js documents that **person count does not affect inference speed** — a flat cost curve, which is
exactly the property a 2–4 player couch game needs. It is also the only multi-person model with
published **in-browser** frame rates, rather than server-GPU numbers quoted at a browser audience:

<figure class="wbf">
<div class="sc">
<svg viewBox="0 0 1080 360" width="1080" role="img" aria-label="Illustrative chart, not measured data: relative inference cost against number of people in frame. A top-down architecture's cost rises roughly linearly with each additional person, while MoveNet MultiPose, a bottom-up architecture, stays flat because it detects all people in one pass.">
  <g font-family="ui-monospace, monospace">
    <text x="16.8" y="28.8" font-size="12.6" fill="var(--tx2)" letter-spacing="1.56">INFERENCE COST vs PEOPLE IN FRAME — ILLUSTRATIVE, NOT MEASURED</text>
    <line x1="84" y1="48" x2="84" y2="300" stroke="var(--ln)" stroke-width="1.44"/>
    <line x1="84" y1="300" x2="1020" y2="300" stroke="var(--ln)" stroke-width="1.44"/>
    <text x="55.2" y="54" font-size="12.6" fill="var(--tx2)">high</text>
    <text x="55.2" y="303.6" font-size="12.6" fill="var(--tx2)">low</text>
    <text x="12" y="180" font-size="12.6" fill="var(--tx2)" transform="rotate(-90 12 180)">relative cost</text>
    <text x="552" y="336" font-size="12.6" fill="var(--tx2)" text-anchor="middle">people in frame</text>
    <g fill="var(--tx2)" font-size="12.6" text-anchor="middle">
      <text x="240" y="319.2">1</text><text x="396" y="319.2">2</text><text x="552" y="319.2">3</text>
      <text x="708" y="319.2">4</text><text x="864" y="319.2">5</text><text x="1020" y="319.2">6</text>
    </g>
    <polyline points="240,260.4 396,220.8 552,181.2 708,141.6 864,102 1020,62.4" fill="none" stroke="var(--a)" stroke-width="2.88"/>
    <g fill="var(--a)">
      <circle cx="240" cy="260.4" r="4.2"/><circle cx="396" cy="220.8" r="4.2"/><circle cx="552" cy="181.2" r="4.2"/>
      <circle cx="708" cy="141.6" r="4.2"/><circle cx="864" cy="102" r="4.2"/><circle cx="1020" cy="62.4" r="4.2"/>
    </g>
    <text x="705.6" y="122.4" font-size="13.2" font-weight="700" fill="var(--a)">top-down — cost scales per person</text>
    <text x="705.6" y="139.2" font-size="12.6" fill="var(--tx2)">e.g. MediaPipe PoseLandmarker</text>
    <polyline points="240,246 396,246 552,246 708,246 864,246 1020,246" fill="none" stroke="var(--ok)" stroke-width="2.88"/>
    <g fill="var(--ok)">
      <circle cx="240" cy="246" r="4.2"/><circle cx="396" cy="246" r="4.2"/><circle cx="552" cy="246" r="4.2"/>
      <circle cx="708" cy="246" r="4.2"/><circle cx="864" cy="246" r="4.2"/><circle cx="1020" cy="246" r="4.2"/>
    </g>
    <text x="705.6" y="273.6" font-size="13.2" font-weight="700" fill="var(--ok)">bottom-up — MoveNet MultiPose (flat)</text>
    <text x="705.6" y="290.4" font-size="12.6" fill="var(--tx2)">this is what ships</text>
  </g>
</svg>
</div>
<figcaption>Qualitative shape, not a benchmark: TF.js documents that MultiPose's cost <b>does not rise with person count</b>, while a top-down model re-runs its crop once per detected person. That single difference is the reason a bottom-up model was the only real candidate for 2–4 player couch play.</figcaption>
</figure>

| Device (WebGL) | SinglePose Lightning | SinglePose Thunder | **MultiPose** |
|---|---|---|---|
| MacBook Pro 15" | 104 | 77 | **54** |
| Desktop i9-10900K | 87 | 82 | **62** |
| iPhone 12 | 51 | 43 | **24** |

Source: the [tfjs-models MoveNet README](https://github.com/tensorflow/tfjs-models/blob/master/pose-detection/src/movenet/README.md).
Vendor-published, but browser-real — which is more than any alternative offers.

<figure class="wbf">
<div class="sc">
<svg viewBox="0 0 1080 360" width="1080" role="img" aria-label="Vendor-published in-browser WebGL frames per second for three MoveNet variants on three devices: MacBook Pro 15 inch, Desktop i9-10900K, and iPhone 12. MultiPose is the slowest of the three variants on every device but remains real-time.">
  <g font-family="ui-monospace, monospace">
    <text x="16.8" y="26.4" font-size="12.6" fill="var(--tx2)" letter-spacing="1.56">IN-BROWSER WEBGL FPS — VENDOR-PUBLISHED (tfjs-models README)</text>
    <line x1="72" y1="312" x2="1032" y2="312" stroke="var(--ln)" stroke-width="1.44"/>
    <rect x="145.2" y="62.4" width="40.8" height="249.6" fill="var(--ln)"/>
    <rect x="195.6" y="127.2" width="40.8" height="184.8" fill="var(--am)"/>
    <rect x="246" y="182.4" width="40.8" height="129.6" fill="var(--a)"/>
    <text x="195.6" y="343.2" font-size="12.6" fill="var(--tx)" text-anchor="middle">MacBook Pro 15"</text>
    <text x="165.6" y="55.2" font-size="12.6" fill="var(--tx2)" text-anchor="middle">104</text>
    <text x="216" y="120" font-size="12.6" fill="var(--tx2)" text-anchor="middle">77</text>
    <text x="266.4" y="175.2" font-size="12.6" font-weight="700" fill="var(--a)" text-anchor="middle">54</text>
    <rect x="469.2" y="103.2" width="40.8" height="208.8" fill="var(--ln)"/>
    <rect x="519.6" y="115.2" width="40.8" height="196.8" fill="var(--am)"/>
    <rect x="570" y="163.2" width="40.8" height="148.8" fill="var(--a)"/>
    <text x="519.6" y="343.2" font-size="12.6" fill="var(--tx)" text-anchor="middle">Desktop i9-10900K</text>
    <text x="489.6" y="96" font-size="12.6" fill="var(--tx2)" text-anchor="middle">87</text>
    <text x="540" y="108" font-size="12.6" fill="var(--tx2)" text-anchor="middle">82</text>
    <text x="590.4" y="156" font-size="12.6" font-weight="700" fill="var(--a)" text-anchor="middle">62</text>
    <rect x="793.2" y="189.6" width="40.8" height="122.4" fill="var(--ln)"/>
    <rect x="843.6" y="208.8" width="40.8" height="103.2" fill="var(--am)"/>
    <rect x="894" y="254.4" width="40.8" height="57.6" fill="var(--a)"/>
    <text x="843.6" y="343.2" font-size="12.6" fill="var(--tx)" text-anchor="middle">iPhone 12</text>
    <text x="813.6" y="182.4" font-size="12.6" fill="var(--tx2)" text-anchor="middle">51</text>
    <text x="864" y="201.6" font-size="12.6" fill="var(--tx2)" text-anchor="middle">43</text>
    <text x="914.4" y="247.2" font-size="12.6" font-weight="700" fill="var(--a)" text-anchor="middle">24</text>
    <g font-size="12.6">
      <rect x="708" y="19.2" width="12" height="12" fill="var(--ln)"/>
      <text x="724.8" y="30" fill="var(--tx2)">SinglePose Lightning</text>
      <rect x="708" y="36" width="12" height="12" fill="var(--am)"/>
      <text x="724.8" y="46.8" fill="var(--tx2)">SinglePose Thunder</text>
      <rect x="912" y="19.2" width="12" height="12" fill="var(--a)"/>
      <text x="928.8" y="30" fill="var(--a)" font-weight="700">MultiPose — ships</text>
    </g>
  </g>
</svg>
</div>
<figcaption>Vendor-published numbers from the <b>tfjs-models</b> README, not measured on this project's own hardware. MultiPose is the slowest variant everywhere, and still real-time everywhere — the trade for tracking up to six people instead of one.</figcaption>
</figure>

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

<figure class="wbf">
<div class="sc">
<svg viewBox="0 0 1220 456" width="1220" role="img" aria-label="Funnel diagram: nine pose and hand models were researched. Three were eliminated by licence terms — YOLO-pose AGPL-3.0, WiLoR CC BY-NC-ND 4.0, HaMeR research-only. Three more were eliminated by architecture or performance — MediaPipe PoseLandmarker's per-person cost, ViTPose's roughly 1 FPS, MediaPipe Holistic's single-person limit and stale status. Three survive: MoveNet MultiPose, shipped; MediaPipe HandLandmarker, chosen but not integrated; and RTMO, kept as an unproven future upgrade with no browser port yet.">
  <defs>
    <marker id="m-mod-a" viewBox="0 0 12 12" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 12 6 L 0 12 z" fill="var(--ln)"/>
    </marker>
  </defs>
  <g font-family="ui-monospace, monospace">
    <rect x="108" y="12" width="864" height="55.2" rx="9.6" fill="var(--sf)" stroke="var(--ln)"/>
    <text x="540" y="45.6" font-size="15.6" font-weight="700" fill="var(--tx)" text-anchor="middle">9 MODELS RESEARCHED</text>
    <path d="M 540 67.2 V 105.6" stroke="var(--ln)" stroke-width="1.92" marker-end="url(#m-mod-a)"/>
    <text x="564" y="86.4" font-size="12.6" fill="var(--a)" font-weight="700">eliminated on LICENCE —</text>
    <text x="564" y="103.2" font-size="12.6" fill="var(--tx2)">YOLO-pose (AGPL-3.0) · WiLoR (CC BY-NC-ND 4.0) · HaMeR (research-only)</text>
    <rect x="180" y="110.4" width="720" height="55.2" rx="9.6" fill="var(--sf)" stroke="var(--ln)"/>
    <text x="540" y="144" font-size="15.6" font-weight="700" fill="var(--tx)" text-anchor="middle">6 REMAIN</text>
    <path d="M 540 165.6 V 204" stroke="var(--ln)" stroke-width="1.92" marker-end="url(#m-mod-a)"/>
    <text x="564" y="184.8" font-size="12.6" fill="var(--am)" font-weight="700">eliminated on ARCHITECTURE / PERFORMANCE —</text>
    <text x="564" y="201.6" font-size="12.6" fill="var(--tx2)">PoseLandmarker (top-down cost) · ViTPose (~1 FPS) · Holistic (single-person, stale)</text>
    <rect x="276" y="208.8" width="528" height="55.2" rx="9.6" fill="var(--sf)" stroke="var(--ln)"/>
    <text x="540" y="242.4" font-size="15.6" font-weight="700" fill="var(--tx)" text-anchor="middle">3 SURVIVE</text>
    <path d="M 540 264 V 300" stroke="var(--ln)" stroke-width="1.92" marker-end="url(#m-mod-a)"/>
    <rect x="48" y="307.2" width="312" height="120" rx="9.6" fill="none" stroke="var(--ok)" stroke-width="1.68"/>
    <text x="72" y="336" font-size="14.4" font-weight="700" fill="var(--tx)">MoveNet MultiPose</text>
    <text x="72" y="357.6" font-size="12.6" fill="var(--ok)" font-weight="700">shipped — this runs today</text>
    <text x="72" y="379.2" font-size="12.6" fill="var(--tx2)">Apache 2.0, flat cost curve</text>
    <rect x="384" y="307.2" width="312" height="120" rx="9.6" fill="none" stroke="var(--am)" stroke-width="1.68"/>
    <text x="408" y="336" font-size="14.4" font-weight="700" fill="var(--tx)">HandLandmarker</text>
    <text x="408" y="357.6" font-size="12.6" fill="var(--am)" font-weight="700">chosen, not integrated</text>
    <text x="408" y="379.2" font-size="12.6" fill="var(--tx2)">Apache 2.0, no tracker built yet</text>
    <rect x="720" y="307.2" width="312" height="120" rx="9.6" fill="none" stroke="var(--am)" stroke-width="1.68"/>
    <text x="744" y="336" font-size="14.4" font-weight="700" fill="var(--tx)">RTMO</text>
    <text x="744" y="357.6" font-size="12.6" fill="var(--am)" font-weight="700">kept as future upgrade</text>
    <text x="744" y="379.2" font-size="12.6" fill="var(--tx2)">no browser port, no WebGPU</text>
    <text x="744" y="398.4" font-size="12.6" fill="var(--tx2)">benchmark — phase 3, unproven</text>
  </g>
</svg>
</div>
<figcaption>Three of nine candidates were knocked out by <b>licence terms alone</b>, before a single benchmark was read. Of what remained, architecture and measured performance cut it to three survivors — and only one of those three is actually running today.</figcaption>
</figure>

## Runtime correction

**MediaPipe Tasks Web's "GPU" delegate is WebGL, not WebGPU.** WebGPU for vision tasks remains an
open upstream feature request. If wibbly wants WebGPU it is on ONNX Runtime Web — production-viable,
but more work. The MoveNet numbers in the table above are WebGL.

## What is not benchmarked

There are **no in-browser benchmarks in existence** for RTMO or YOLO-pose at any player count. If
phase 3 proceeds, wibbly measures them itself; there is no number to inherit. Any future claim about
those models has to come with a measurement taken on this project's own hardware.
