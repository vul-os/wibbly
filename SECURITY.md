# Security Policy

wibbly runs camera-driven pose inference entirely in the browser tab that has
it open. No account, no server-side state, no camera frame or video stream is
ever transmitted anywhere — that promise ("frames never leave the device") is
the core premise of the product, not an aspiration, and a violation of it is
a security bug, full stop.

## Reporting a vulnerability

**Please do not open a public issue for security problems.**

- Preferred: [GitHub private vulnerability reporting](https://github.com/vul-os/wibbly/security/advisories/new) on `vul-os/wibbly`.
- Alternatively, email **vulosorg@gmail.com** with `[wibbly security]` in the subject.

Include what you can: affected surface (camera pipeline, demo embed, the
magnetite wasm authority, peer-to-peer transport, the pose model), reproduction
steps, and impact as you understand it. You'll get an acknowledgement within **72 hours** and a status
update at least every **14 days** until resolution. Please give a reasonable
window to ship a fix before public disclosure — we'll credit you in the
release notes unless you'd rather stay anonymous.

## Scope

Especially interested in:

- **Undisclosed network calls.** wibbly's standalone build talks to nothing
  but its own origin by default (the vendored MoveNet model is served
  same-origin; TF Hub's CDN is an explicit opt-in a user must enable). The
  embeddable demo build (`VITE_WIBBLY_MODE=demo`) is stricter still — it runs
  under the production `SelfContainedPageCSP` inside a same-origin iframe on
  `vulos.org`, and `npm run verify:demo` asserts zero external requests.
  Any code path that reaches an external host without the user having
  explicitly opted in (e.g. picking the TF Hub CDN) is a vulnerability, not
  a feature.
- **Camera/media handling.** Any path that retains, uploads, or exfiltrates
  captured frames, or that fails to release the `MediaStream` when tracking
  stops (a prior leak class, since fixed) or when permission is denied.
- **Vendored model integrity.** `public/models/` ships the MoveNet weights
  used by default; `npm run verify:model` checks every shard named in the
  manifest exists and that on-disk size matches what the manifest's tensor
  shapes imply. A bypass of that check, or a supply-chain path that could
  swap the vendored weights for something else, is in scope.
- **The magnetite wasm authority** (`@vulos/wibbly-authority`). Loads a real
  magnetite `AuthoritativeGame`, compiled to `wasm32-unknown-unknown`, and
  instantiates it with an empty import object — the module is expected to
  need no host functions, and instantiation throws loudly if it ever declares
  any. Report anything where that check can be bypassed, where a malformed or
  malicious wasm module could execute beyond the documented `mag_*` exports,
  or where the authority runs in demo mode (it must refuse there — the demo's
  CSP has no `wasm-unsafe-eval`, so this should fail closed, not silently
  degrade). **Out of scope:** the authority not verifying that a gesture
  event came from a real camera. It doesn't, by design — magnetite classes
  camera gestures `InputClass::Attested`, never replay-verifiable, and
  running the simulation client-side changes nothing about that. Reports
  along the lines of "I can fake a swing" are a restatement of the disclosed
  model, not a new finding.
- **The peer-to-peer transport** (`packages/wibbly-p2p`, WebRTC, no magnetite
  dependency, off unless a host page supplies a transport). `InboundGate` is
  the real defense boundary: rate limiting, sequence dedup/reorder rejection,
  gesture field sanity, and `playerId` authorization. Report anything where
  that gate can be bypassed, flooded past its configured limits without
  effect, or where a guest can act as a `playerId` it wasn't assigned.
  **Out of scope:** a guest fabricating plausible gesture data through its
  own authenticated `DataChannel` — the gate authorizes *who* may speak for a
  `playerId`, it does not and cannot verify that a swing was real.
- **Local storage.** Calibration data (handedness, reach envelope, framing)
  is written to `localStorage` and never transmitted. Any path that sends it
  elsewhere is a bug.

Out of scope: the third-party pose model's inference accuracy or bias, and
vulnerabilities in the browser's own `getUserMedia`/WebCrypto implementations.

## Supported versions

Pre-1.0: only the latest release (and `main`) receives fixes.
