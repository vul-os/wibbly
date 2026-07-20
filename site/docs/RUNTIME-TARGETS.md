# Runtime targets

## v1: browser-first. Non-negotiable.

Zero install is the platform's single biggest asset. A link, a wave, a game.

For seeding a game library from nothing, that distribution property beats anything native provides. A
developer who writes a camera game against wibbly can hand someone a URL; nobody has to approve it,
sign it, or download it. Every other runtime decision on this page is subordinate to keeping that
true.

This is what runs today.

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
- **Only landmarks cross IPC.** Kilobytes at 30 Hz, trivially cheap. This is the inversion that makes
  the whole thing viable: the expensive data never moves.
- **Preview:** a native wgpu surface under a transparent webview, the `tauri-wgpu-cam` pattern.

This phase also unlocks RTMO, which the browser cannot currently reach. See
[Model selection](/products/wibbly/docs/models).

## Open question

`navigator.gpu` in WKWebView on macOS 26 is unresolved in research. It needs an empirical test, not
another citation. If it works, part of the argument above softens for macOS specifically — the Linux
and IPC arguments stand regardless.
