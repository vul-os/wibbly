# Runtime targets

<style>
.wbf{--a:#C4006B;--am:#8A4B00;--ok:#0F7A3D;--tx:#140F1B;--tx2:#544A61;--ln:#BEB2CD;--sf:#F5F1F9;--pg:#FFFFFF;margin:1.75rem 0}
:root[data-theme="dark"] .wbf{--a:#FF4D9D;--am:#FFB020;--ok:#3FE08A;--tx:#F5F1FA;--tx2:#ADA2BE;--ln:#3A2C52;--sf:#171122;--pg:#0E0A16}
.wbf>.sc{overflow-x:auto;border:1px solid var(--ln);border-radius:10px;background:var(--pg)}
.wbf svg{display:block;height:auto;width:100%;min-width:620px}
.wbf img{display:block;width:100%;height:auto}
.wbf figcaption{font-size:.82rem;line-height:1.65;color:var(--tx2);margin-top:.65rem}
.wbf figcaption b{color:var(--tx)}
</style>

## v1: browser-first. Non-negotiable.

Zero install is the platform's single biggest asset. A link, a wave, a game.

For seeding a game library from nothing, that distribution property beats anything native provides. A
developer who writes a camera game against wibbly can hand someone a URL; nobody has to approve it,
sign it, or download it. Every other runtime decision on this page is subordinate to keeping that
true.

This is what runs today.

<figure class="wbf">
<div class="sc">
<svg viewBox="0 0 900 330" width="900" role="img" aria-label="Comparison table of three runtime targets — browser today, daemon plus browser interim, and Tauri native phase 3 — against WebGPU access, camera access, zero-install distribution, whether RTMO becomes reachable, and project status. Browser today is shipped and running now. The other two are design only, not yet built.">
  <g font-family="ui-monospace, monospace" font-size="10">
    <rect x="10" y="10" width="880" height="320" rx="8" fill="none" stroke="var(--ln)"/>
    <line x1="250" y1="10" x2="250" y2="330" stroke="var(--ln)"/>
    <line x1="470" y1="10" x2="470" y2="330" stroke="var(--ln)"/>
    <line x1="690" y1="10" x2="690" y2="330" stroke="var(--ln)"/>
    <line x1="10" y1="58" x2="890" y2="58" stroke="var(--ln)"/>
    <line x1="10" y1="122" x2="890" y2="122" stroke="var(--ln)"/>
    <line x1="10" y1="186" x2="890" y2="186" stroke="var(--ln)"/>
    <line x1="10" y1="250" x2="890" y2="250" stroke="var(--ln)"/>
    <line x1="10" y1="290" x2="890" y2="290" stroke="var(--ln)"/>
    <text x="26" y="38" font-size="11" font-weight="700" fill="var(--tx2)">property</text>
    <text x="266" y="34" font-size="11" font-weight="700" fill="var(--tx)">Browser</text>
    <text x="266" y="50" font-size="9.5" fill="var(--ok)">v1 — shipped</text>
    <text x="486" y="34" font-size="11" font-weight="700" fill="var(--tx)">Daemon + browser</text>
    <text x="486" y="50" font-size="9.5" fill="var(--am)">phase 2 — design only</text>
    <text x="706" y="34" font-size="11" font-weight="700" fill="var(--tx)">Tauri native</text>
    <text x="706" y="50" font-size="9.5" fill="var(--am)">phase 3 — design only</text>
    <text x="26" y="82" fill="var(--tx2)">WebGPU access</text>
    <text x="266" y="78" font-weight="700" fill="var(--am)">partial</text>
    <text x="266" y="94" font-size="9" fill="var(--tx2)">Chrome/Edge; not Safari</text>
    <text x="486" y="78" font-weight="700" fill="var(--am)">partial</text>
    <text x="486" y="94" font-size="9" fill="var(--tx2)">same as browser column</text>
    <text x="706" y="78" font-weight="700" fill="var(--tx2)">n/a</text>
    <text x="706" y="94" font-size="9" fill="var(--tx2)">bypassed — Rust ORT</text>
    <text x="706" y="106" font-size="9" fill="var(--tx2)">CoreML / DirectML EPs</text>
    <text x="26" y="146" fill="var(--tx2)">camera access</text>
    <text x="266" y="142" font-weight="700" fill="var(--ok)">yes</text>
    <text x="266" y="158" font-size="9" fill="var(--tx2)">getUserMedia, just works</text>
    <text x="486" y="142" font-weight="700" fill="var(--ok)">yes</text>
    <text x="486" y="158" font-size="9" fill="var(--tx2)">real browser, same as v1</text>
    <text x="706" y="142" font-weight="700" fill="var(--am)">yes, different path</text>
    <text x="706" y="158" font-size="9" fill="var(--tx2)">nokhwa/V4L2 in Rust core</text>
    <text x="26" y="210" fill="var(--tx2)">zero-install distribution</text>
    <text x="266" y="206" font-weight="700" fill="var(--ok)">yes</text>
    <text x="266" y="222" font-size="9" fill="var(--tx2)">link, wave, game</text>
    <text x="486" y="206" font-weight="700" fill="var(--am)">partial</text>
    <text x="486" y="222" font-size="9" fill="var(--tx2)">background process runs locally</text>
    <text x="706" y="206" font-weight="700" fill="var(--a)">no</text>
    <text x="706" y="222" font-size="9" fill="var(--tx2)">installer required</text>
    <text x="26" y="274" fill="var(--tx2)">unlocks RTMO</text>
    <text x="266" y="270" font-weight="700" fill="var(--a)">no</text>
    <text x="486" y="270" font-weight="700" fill="var(--a)">no</text>
    <text x="706" y="270" font-weight="700" fill="var(--ok)">yes</text>
    <text x="706" y="286" font-size="9" fill="var(--tx2)">ORT Web can't reach it today</text>
    <text x="26" y="314" font-weight="700" fill="var(--tx)">this project</text>
    <text x="266" y="314" font-weight="700" fill="var(--ok)">running</text>
    <text x="486" y="314" font-weight="700" fill="var(--am)">not built</text>
    <text x="706" y="314" font-weight="700" fill="var(--am)">not built</text>
  </g>
</svg>
</div>
<figcaption>Only the first column exists today. <b>Zero-install browser distribution is the property v1 will not trade away</b>, and it is the one thing Tauri native gives up in exchange for RTMO and a different WebGPU story.</figcaption>
</figure>

## Why *not* Tauri with webview ML

Researched and rejected as an architecture — not as a product direction, but as a place to put the
inference. Four independent reasons, any one of which would be sufficient:

- **No WebGPU on macOS/Linux WebKit.** WebKitGTK has none, and per a WebKit developer "nobody is
  working on it." WKWebView on macOS 26 is unconfirmed — **verify `navigator.gpu` empirically before
  betting on it**. Net effect: CPU-WASM only, 3–5× slower than the WebGL path already shipping.
- **Linux camera is broken by default.** Distro WebKitGTK ships without WebRTC/media-stream. Making
  `getUserMedia` work requires compiling WebKitGTK yourself, X11-only. That is not a thing to ask of
  a player.
- **macOS permission bugs.** Double prompts, and cases where the prompt never appears at all
  (`wry#1195`, `tauri#11951` — both open as of research).
- **You cannot fix it by shipping frames to Rust.** Tauri IPC is JSON-serialized. A 1080p RGBA frame
  is about 8 MB; 30 fps is about 250 MB/s. Measured: 10 MB takes roughly 200 ms on Windows.

<figure class="wbf">
<div class="sc">
<svg viewBox="0 0 900 220" width="900" role="img" aria-label="Bar chart, stylized log scale: raw 1080p RGBA video at 30 frames per second needs about 250 megabytes per second of Tauri IPC throughput. The best measured rate, extrapolated from a 10 megabyte transfer taking roughly 200 milliseconds on Windows, is about 50 megabytes per second — already short of what raw video needs. Landmarks-only, the phase 3 design, projects to about 30 kilobytes per second, four orders of magnitude smaller.">
  <g font-family="ui-monospace, monospace">
    <text x="16" y="22" font-size="10" fill="var(--tx2)" letter-spacing="1.3">TAURI IPC THROUGHPUT — STYLIZED LOG SCALE</text>
    <text x="16" y="58" font-size="11" fill="var(--tx)">Raw video @ 30 fps</text>
    <rect x="230" y="47" width="620" height="14" rx="2" fill="var(--a)"/>
    <text x="860" y="58" font-size="11" font-weight="700" fill="var(--a)" text-anchor="end">needs ≈250 MB/s</text>
    <text x="16" y="98" font-size="11" fill="var(--tx)">Measured best case</text>
    <rect x="230" y="87" width="380" height="14" rx="2" fill="var(--am)"/>
    <text x="860" y="98" font-size="11" font-weight="700" fill="var(--am)" text-anchor="end">≈50 MB/s (10 MB / ~200 ms)</text>
    <text x="16" y="138" font-size="11" fill="var(--tx)">Landmarks only</text>
    <rect x="230" y="127" width="30" height="14" rx="2" fill="var(--ok)"/>
    <text x="860" y="138" font-size="11" font-weight="700" fill="var(--ok)" text-anchor="end">≈30 KB/s (projected, phase 3)</text>
    <text x="230" y="168" font-size="9.5" fill="var(--tx2)">Even the best measured rate falls short of what raw video needs — landmarks need four orders</text>
    <text x="230" y="182" font-size="9.5" fill="var(--tx2)">of magnitude less, which is the entire argument for keeping inference in Rust and off the wire.</text>
  </g>
</svg>
</div>
<figcaption>Shipping raw frames across Tauri's JSON-serialized IPC is not merely slow, it is <b>off by orders of magnitude</b>: even the fastest measured transfer can't sustain what 30 fps of 1080p demands, while landmarks-only traffic — the phase 3 design below — sits comfortably under any budget.</figcaption>
</figure>

And the signal that ties it together: **no open-source Tauri app does webcam ML in the webview.** The
closest, Lazyeat, pairs Tauri with a separate Python CV process. When nobody has done a thing, it is
usually worth finding out why before becoming the first.

## Phase 2 interim: daemon plus browser UI

Worth taking before the desktop shell, and nearly free once the browser build exists.

The Jellyfin / IPFS Desktop pattern: a background process for persistence and networking, with the UI
served to the user's **real browser**. It solves the persistent-node problem while letting WebGPU and
the camera just work, because they are running in a browser that has spent a decade getting those
right. It also costs almost nothing to build on top of what already exists.

## Phase 3: Tauri as an app shell — with capture and inference in Rust

Tauri is right for the *app* and wrong for the *webview ML*. When it arrives:

- **Capture:** `nokhwa` — or `crabcamera` — in the Rust core. This sidesteps WebKitGTK entirely by
  going through V4L2.
- **Inference:** `ort` (ONNX Runtime) in the Rust core, built `compile-static` + `minimal-build`, with
  platform execution providers — CoreML on macOS, DirectML on Windows.
- **Only landmarks cross IPC.** Kilobytes at 30 Hz, trivially cheap — see the throughput chart above.
  This is the inversion that makes the whole thing viable: the expensive data never moves.
- **Preview:** a native wgpu surface under a transparent webview, the `tauri-wgpu-cam` pattern.

This phase also unlocks RTMO, which the browser cannot currently reach. See
[Model selection](/products/magnetite/wibbly/docs/models).

## Open question

`navigator.gpu` in WKWebView on macOS 26 is unresolved in research. It needs an empirical test, not
another citation. If it works, part of the argument above softens for macOS specifically — the Linux
and IPC arguments stand regardless.
