# Model selection

Researched 2026-07-20. The models below are **chosen and licence-cleared**. The body model is running
today in its multi-person variant; the hand model is not integrated at all. This page exists so nobody
relitigates the decision from scratch in six months.

<style>
.wbf{--a:#C4006B;--am:#8A4B00;--ok:#0F7A3D;--tx:#140F1B;--tx2:#544A61;--ln:#BEB2CD;--sf:#F5F1F9;--pg:#FFFFFF;margin:1.75rem 0}
:root[data-theme="dark"] .wbf{--a:#FF4D9D;--am:#FFB020;--ok:#3FE08A;--tx:#F5F1FA;--tx2:#ADA2BE;--ln:#3A2C52;--sf:#171122;--pg:#0E0A16}
.wbf>.sc{overflow-x:auto;border:1px solid var(--ln);border-radius:10px;background:var(--pg)}
.wbf svg{display:block;height:auto;width:100%;min-width:900px}
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
<svg viewBox="0 0 900 300" width="900" role="img" aria-label="Illustrative chart, not measured data: relative inference cost against number of people in frame. A top-down architecture's cost rises roughly linearly with each additional person, while MoveNet MultiPose, a bottom-up architecture, stays flat because it detects all people in one pass.">
  <g font-family="ui-monospace, monospace">
    <text x="14" y="24" font-size="10.5" fill="var(--tx2)" letter-spacing="1.3">INFERENCE COST vs PEOPLE IN FRAME — ILLUSTRATIVE, NOT MEASURED</text>
    <line x1="70" y1="40" x2="70" y2="250" stroke="var(--ln)" stroke-width="1.2"/>
    <line x1="70" y1="250" x2="850" y2="250" stroke="var(--ln)" stroke-width="1.2"/>
    <text x="46" y="45" font-size="10.5" fill="var(--tx2)">high</text>
    <text x="46" y="253" font-size="10.5" fill="var(--tx2)">low</text>
    <text x="10" y="150" font-size="10.5" fill="var(--tx2)" transform="rotate(-90 10 150)">relative cost</text>
    <text x="460" y="280" font-size="10.5" fill="var(--tx2)" text-anchor="middle">people in frame</text>
    <g fill="var(--tx2)" font-size="10.5" text-anchor="middle">
      <text x="200" y="266">1</text><text x="330" y="266">2</text><text x="460" y="266">3</text>
      <text x="590" y="266">4</text><text x="720" y="266">5</text><text x="850" y="266">6</text>
    </g>
    <polyline points="200,217 330,184 460,151 590,118 720,85 850,52" fill="none" stroke="var(--a)" stroke-width="2.4"/>
    <g fill="var(--a)">
      <circle cx="200" cy="217" r="3.5"/><circle cx="330" cy="184" r="3.5"/><circle cx="460" cy="151" r="3.5"/>
      <circle cx="590" cy="118" r="3.5"/><circle cx="720" cy="85" r="3.5"/><circle cx="850" cy="52" r="3.5"/>
    </g>
    <text x="588" y="102" font-size="11" font-weight="700" fill="var(--a)">top-down — cost scales per person</text>
    <text x="588" y="116" font-size="10.5" fill="var(--tx2)">e.g. MediaPipe PoseLandmarker</text>
    <polyline points="200,205 330,205 460,205 590,205 720,205 850,205" fill="none" stroke="var(--ok)" stroke-width="2.4"/>
    <g fill="var(--ok)">
      <circle cx="200" cy="205" r="3.5"/><circle cx="330" cy="205" r="3.5"/><circle cx="460" cy="205" r="3.5"/>
      <circle cx="590" cy="205" r="3.5"/><circle cx="720" cy="205" r="3.5"/><circle cx="850" cy="205" r="3.5"/>
    </g>
    <text x="588" y="228" font-size="11" font-weight="700" fill="var(--ok)">bottom-up — MoveNet MultiPose (flat)</text>
    <text x="588" y="242" font-size="10.5" fill="var(--tx2)">this is what ships</text>
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
<svg viewBox="0 0 900 300" width="900" role="img" aria-label="Vendor-published in-browser WebGL frames per second for three MoveNet variants on three devices: MacBook Pro 15 inch, Desktop i9-10900K, and iPhone 12. MultiPose is the slowest of the three variants on every device but remains real-time.">
  <g font-family="ui-monospace, monospace">
    <text x="14" y="22" font-size="10.5" fill="var(--tx2)" letter-spacing="1.3">IN-BROWSER WEBGL FPS — VENDOR-PUBLISHED (tfjs-models README)</text>
    <line x1="60" y1="260" x2="860" y2="260" stroke="var(--ln)" stroke-width="1.2"/>
    <rect x="121" y="52" width="34" height="208" fill="var(--ln)"/>
    <rect x="163" y="106" width="34" height="154" fill="var(--am)"/>
    <rect x="205" y="152" width="34" height="108" fill="var(--a)"/>
    <text x="163" y="286" font-size="10.5" fill="var(--tx)" text-anchor="middle">MacBook Pro 15"</text>
    <text x="138" y="46" font-size="10.5" fill="var(--tx2)" text-anchor="middle">104</text>
    <text x="180" y="100" font-size="10.5" fill="var(--tx2)" text-anchor="middle">77</text>
    <text x="222" y="146" font-size="10.5" font-weight="700" fill="var(--a)" text-anchor="middle">54</text>
    <rect x="391" y="86" width="34" height="174" fill="var(--ln)"/>
    <rect x="433" y="96" width="34" height="164" fill="var(--am)"/>
    <rect x="475" y="136" width="34" height="124" fill="var(--a)"/>
    <text x="433" y="286" font-size="10.5" fill="var(--tx)" text-anchor="middle">Desktop i9-10900K</text>
    <text x="408" y="80" font-size="10.5" fill="var(--tx2)" text-anchor="middle">87</text>
    <text x="450" y="90" font-size="10.5" fill="var(--tx2)" text-anchor="middle">82</text>
    <text x="492" y="130" font-size="10.5" font-weight="700" fill="var(--a)" text-anchor="middle">62</text>
    <rect x="661" y="158" width="34" height="102" fill="var(--ln)"/>
    <rect x="703" y="174" width="34" height="86" fill="var(--am)"/>
    <rect x="745" y="212" width="34" height="48" fill="var(--a)"/>
    <text x="703" y="286" font-size="10.5" fill="var(--tx)" text-anchor="middle">iPhone 12</text>
    <text x="678" y="152" font-size="10.5" fill="var(--tx2)" text-anchor="middle">51</text>
    <text x="720" y="168" font-size="10.5" fill="var(--tx2)" text-anchor="middle">43</text>
    <text x="762" y="206" font-size="10.5" font-weight="700" fill="var(--a)" text-anchor="middle">24</text>
    <g font-size="10.5">
      <rect x="590" y="16" width="10" height="10" fill="var(--ln)"/>
      <text x="604" y="25" fill="var(--tx2)">SinglePose Lightning</text>
      <rect x="590" y="30" width="10" height="10" fill="var(--am)"/>
      <text x="604" y="39" fill="var(--tx2)">SinglePose Thunder</text>
      <rect x="760" y="16" width="10" height="10" fill="var(--a)"/>
      <text x="774" y="25" fill="var(--a)" font-weight="700">MultiPose — ships</text>
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
<svg viewBox="0 0 900 380" width="900" role="img" aria-label="Funnel diagram: nine pose and hand models were researched. Three were eliminated by licence terms — YOLO-pose AGPL-3.0, WiLoR CC BY-NC-ND 4.0, HaMeR research-only. Three more were eliminated by architecture or performance — MediaPipe PoseLandmarker's per-person cost, ViTPose's roughly 1 FPS, MediaPipe Holistic's single-person limit and stale status. Three survive: MoveNet MultiPose, shipped; MediaPipe HandLandmarker, chosen but not integrated; and RTMO, kept as an unproven future upgrade with no browser port yet.">
  <defs>
    <marker id="m-mod-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 z" fill="var(--ln)"/>
    </marker>
  </defs>
  <g font-family="ui-monospace, monospace">
    <rect x="90" y="10" width="720" height="46" rx="8" fill="var(--sf)" stroke="var(--ln)"/>
    <text x="450" y="38" font-size="13" font-weight="700" fill="var(--tx)" text-anchor="middle">9 MODELS RESEARCHED</text>
    <path d="M450 56 V88" stroke="var(--ln)" stroke-width="1.6" marker-end="url(#m-mod-a)"/>
    <text x="470" y="72" font-size="10.5" fill="var(--a)" font-weight="700">eliminated on LICENCE —</text>
    <text x="470" y="86" font-size="10.5" fill="var(--tx2)">YOLO-pose (AGPL-3.0) · WiLoR (CC BY-NC-ND 4.0) · HaMeR (research-only)</text>
    <rect x="150" y="92" width="600" height="46" rx="8" fill="var(--sf)" stroke="var(--ln)"/>
    <text x="450" y="120" font-size="13" font-weight="700" fill="var(--tx)" text-anchor="middle">6 REMAIN</text>
    <path d="M450 138 V170" stroke="var(--ln)" stroke-width="1.6" marker-end="url(#m-mod-a)"/>
    <text x="470" y="154" font-size="10.5" fill="var(--am)" font-weight="700">eliminated on ARCHITECTURE / PERFORMANCE —</text>
    <text x="470" y="168" font-size="10.5" fill="var(--tx2)">PoseLandmarker (top-down cost) · ViTPose (~1 FPS) · Holistic (single-person, stale)</text>
    <rect x="230" y="174" width="440" height="46" rx="8" fill="var(--sf)" stroke="var(--ln)"/>
    <text x="450" y="202" font-size="13" font-weight="700" fill="var(--tx)" text-anchor="middle">3 SURVIVE</text>
    <path d="M450 220 V250" stroke="var(--ln)" stroke-width="1.6" marker-end="url(#m-mod-a)"/>
    <rect x="40" y="256" width="260" height="100" rx="8" fill="none" stroke="var(--ok)" stroke-width="1.4"/>
    <text x="60" y="280" font-size="12" font-weight="700" fill="var(--tx)">MoveNet MultiPose</text>
    <text x="60" y="298" font-size="10.5" fill="var(--ok)" font-weight="700">shipped — this runs today</text>
    <text x="60" y="316" font-size="10.5" fill="var(--tx2)">Apache 2.0, flat cost curve</text>
    <rect x="320" y="256" width="260" height="100" rx="8" fill="none" stroke="var(--am)" stroke-width="1.4"/>
    <text x="340" y="280" font-size="12" font-weight="700" fill="var(--tx)">HandLandmarker</text>
    <text x="340" y="298" font-size="10.5" fill="var(--am)" font-weight="700">chosen, not integrated</text>
    <text x="340" y="316" font-size="10.5" fill="var(--tx2)">Apache 2.0, no tracker built yet</text>
    <rect x="600" y="256" width="260" height="100" rx="8" fill="none" stroke="var(--am)" stroke-width="1.4"/>
    <text x="620" y="280" font-size="12" font-weight="700" fill="var(--tx)">RTMO</text>
    <text x="620" y="298" font-size="10.5" fill="var(--am)" font-weight="700">kept as future upgrade</text>
    <text x="620" y="316" font-size="10.5" fill="var(--tx2)">no browser port, no WebGPU</text>
    <text x="620" y="332" font-size="10.5" fill="var(--tx2)">benchmark — phase 3, unproven</text>
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
