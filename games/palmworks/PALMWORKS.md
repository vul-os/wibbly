# Palmworks

Build a factory. Do it with your hands.

## 1. What this is, and where it came from

Palmworks is a wibbly game: build an industrial plant — boilers, pumps, tanks,
reactors — on a grid, wire the pipework between them, and watch it stand
there looking like a plant. It is not a simulation of chemistry or flow rates;
it is a construction toy with 29 well-modeled pieces of industrial hardware
and a satisfying, physically-grounded way of connecting them.

This game was **folded in from a deleted repository**, `vul-os/palmworks`
(previously named `plantvis-mono`), with its full commit history preserved.
It was **not** written for wibbly originally — it was a standalone React +
Three.js industrial-plant visualiser with its own accounts and a Supabase/
Firebase backend. That backend and every account-facing page were stripped
before the fold (this repo's games run with no accounts and no backend,
full stop — see `games/README.md`). What's left, and what makes this worth
keeping, is the part that had nothing to do with accounts in the first
place: the 3D scene, the object library, and the connection-routing engine.

**Original authorship, credited**: `exolutionza` and `MichaelNdimande`. The
hand-gesture layer described in this document is new wibbly-side design; the
factory-building game underneath it is theirs.

## 2. The essence

Place industrial equipment on a grid. Route pipes, cables, and gas lines
port-to-port between them. Watch the plant sit there, fully wired, looking
like something a plant engineer would recognize.

The **new twist**, and the entire reason this game belongs in wibbly rather
than as a standalone web app: you do all of it with your hands, in front of a
camera, with no mouse. Reaching out and pinching a pump into place, then
pinch-dragging a line from its outlet to a tank's inlet, is a fundamentally
different feeling than clicking two dropdowns — closer to actually building
something. That feeling is the whole bet this game is making.

## 3. What's built today (verified by reading the code, not assumed)

Everything in this section runs, right now, with a mouse — `cd games/palmworks
&& npm run dev`. There is no camera involvement anywhere in the current code;
`games/palmworks/src` contains zero references to gestures, hand tracking, or
`@vulos/wibbly-input`. It is a fully mouse/pointer-driven React Three Fiber
app today.

- **The scene**: a `Canvas` (`src/pages/viz/index.jsx`) with an infinite
  snap-grid, ground plane, and `OrbitControls` for pan/zoom/rotate of the
  camera. `PlantScene` (`src/pages/viz/components/PlantScene.jsx`) owns the
  actual plant state: an `objects` array and a `connections` array, both
  plain React state, nothing persisted anywhere.
- **29 parametric industrial objects**, each its own component under
  `src/pages/viz/components/objects/`: Boiler, Valve, Pump, ConveyorBelt,
  HeatExchanger, StorageTank, MotorStarter, VariableFrequencyDrive,
  CoolingTower, Extruder, StirredTankReactor, DistillationColumn,
  CentrifugalCompressor, MixerAgitator, PressureVessel, DayTank, RackSystem,
  PipelineSystem, WaterSupply, WaterDrain, WaterPump, HeatPump, ControlUnit,
  Sensor, TemperatureSwitch, PressureSensor, PressureControlValve, PowerBox,
  OilTankControlPanel — organized into four palette categories (Processing
  Equipment, Storage & Transport, Control Systems, Electrical), each with a
  color, icon, description, and search keywords.
- **A component palette sidebar** (`index.jsx`): searchable, category-first,
  collapsible. Clicking a component icon calls `addObject(type)`, which asks
  `PlantScene` (via a ref + `useImperativeHandle`) to spawn that object type
  at a random grid-snapped position.
- **Two interaction modes**, toggled by two buttons top-center: `select` and
  `delete`. In `select` mode, clicking an object selects it and clicking a
  drag-selected object again lets you drag it (grid-snapped, via
  `handleObjectDrag`); dragging an object automatically re-routes any pipes
  attached to it. In `delete` mode, clicking an object removes it and every
  connection touching it.
- **Port-to-port connections** (`handlePortClick` in `PlantScene.jsx`): every
  object exposes typed ports (`electric` / `liquid` / `gas`). Clicking a port
  starts a connection (a pulsing indicator sphere marks the origin); clicking
  a second, type-compatible port on a different object completes it via
  `canPortsConnect`. `AutoRoutingConnection.jsx` then computes a
  collision-aware ground-hugging route between the two ports and renders it
  as an animated flow-shaded pipe. This two-click (not drag) flow is
  important to the hand-mapping design below.
- **Auto-layout and clear-all**: `autoLayout()` arranges all placed objects
  in a circle; `clearAll()` wipes the scene. Both are just buttons today.
- **Grid snap + CAD controls**: grid size (0.5/1.0/2.0/5.0m) and snap on/off,
  in a dropdown, plus a coordinate-marker toggle.

None of this needs gestures to be good. It already is a complete,
if mouse-only, plant-building toy. The rest of this document is about
translating that existing interaction model onto hands — not about
inventing new functionality to justify the camera.

## 4. THE HAND MAPPING

This is the core of this document. Every mapping below is grounded in an
interaction that already exists in the code above, and in the actual
`GestureEvent` shapes the recognizers below emit — nothing here invents a new
low-level primitive.

### 4.1 What a `pinch` and a `point` event actually look like

As of this writing, `packages/wibbly-input` (which this game does not
directly depend on — the shell does, and hands the game plain
`GestureEvent`s per the `games/README.md` contract) has real, reviewed
`PinchRecognizer` and `PointRecognizer` implementations
(`src/recognizers/pinch.ts`, `src/recognizers/point.ts`) built on a real
`HandLandmarkTracker` (`src/hand-tracker.ts`, MediaPipe HandLandmarker).
Their event shape matters a lot for this design, so it's worth being
precise instead of hand-waving "you'll get a pinch event":

- **`pinch`**: `detail.phase` is `'start' | 'hold' | 'release'`. `vector` is
  the thumb-tip/index-tip midpoint, normalized image-space `[0,1]` (same
  coordinate contract as everything else in `wibbly-input`). `detail.delta`
  is the midpoint's displacement **since pinch-start** — updated every held
  frame. `detail.hand` is `'left' | 'right'`. This is not an edge-triggered
  "did a pinch happen" event like `swing` — it is a genuine start/hold/release
  stream, which is exactly the shape a drag gesture needs.
- **`point`**: `detail.phase` is `'start' | 'hold' | 'end'`. `vector` is the
  **aim direction** (a unit vector from the index knuckle toward the
  fingertip) — not a position. `detail.origin` is the fingertip position.
  Together they're a ray (`origin + t * direction`), which is arguably a
  *better* fit for a 3D scene than a flat 2D cursor position would be: it
  can be raycast straight into the Three.js scene the same way a mouse
  click already is (R3F's raycaster takes a ray, not a screen point, under
  the hood).

Both recognizers key state on `(playerId, handedness)`, so one player's left
and right hands are tracked and gated fully independently — which is exactly
what a two-hand game needs.

### 4.2 The mapping, interaction by interaction

| Today (mouse) | Hand equivalent | Why this shape |
|---|---|---|
| Click a palette icon → `addObject(type)` at a random spot | **Pinch to place**: point at a palette icon to highlight it (a ray-cast hover, same as a mouse hover); pinch-start while hovering it "picks it up"; pinch-hold and move drags a ghost preview across the grid (driven by `detail.delta` accumulating from the pinch's `vector`, raycast onto the ground plane each held frame); pinch-release drops the object at the grid-snapped release position | Reuses the pinch start/hold/release stream directly — no new gesture shape needed. This is a strict upgrade over today's mouse click (which drops at a random spot): the hand version chooses *where* |
| Click an object in `select` mode → `setSelectedObjects([id])` | **Point to select**: aim the ray at an object; a `point` `hold` event each frame drives a live hover highlight (raycast → nearest hit → same visual state `PlantScene` already uses for selection-adjacent hover); a quick pinch `start`→`release` (a "tap," not a drag — `detail.delta` stays near zero) while pointing at that object calls the *same* `handleObjectClick(objectId, event)` the mouse path already calls | Point supplies the cursor, pinch supplies the click. This is the same division of labor a mouse already has (move vs. mousedown/up) — no per-gesture bespoke logic in `PlantScene`, just a synthetic click at the ray-hit target |
| Click a port → `handlePortClick` (start), click a compatible port → completes the connection | **Pinch-drag between ports**: pinch-start while pointing at a port (or: pinch-start with the pinch midpoint raycasting onto a port, equivalent) fires the same "start a connection" path as today's first click; the connection-start pulsing indicator already in `PlantScene` stays visible for the whole hold; pinch-release over a second, type-compatible port completes the connection exactly like today's second click; release over anything else (empty space, an incompatible port) cancels, clearing `connectionStart` | This turns today's two *discrete clicks* into one continuous gesture, which is the single biggest feel upgrade gestures buy this game — closes the loop between reaching for a fitting and connecting it, the way an actual pipefitter's hands move |
| Trash-mode toggle button, then click an object | **Point + pinch on the mode button itself**, same as any other on-screen button (see 4.3) | See below — deletion doesn't need its own gesture |
| Drag an object (in `select` mode) | **Pinch-hold + move directly on the object** (not on a port) | Same pinch stream as palette placement and port-dragging — `PlantScene.handleObjectDrag` already takes a raw position and grid-snaps it, so this is a drop-in replacement for the mouse drag handler, not new logic |
| `OrbitControls` mouse-drag (orbit) / scroll (zoom) / right-drag (pan) | **Two-hand pinch drives the camera**: both hands pinch-`hold` simultaneously (the game correlates two concurrent `pinch` events for the same `playerId` where `detail.hand` differs) — the *change* in distance between the two pinch midpoints drives dolly/zoom, the *change* in the angle of the line between them drives orbit rotation | Grounded honestly: there is **no existing per-object scale/rotate feature** in `PlantScene` today (only grid-snapped reposition). So rather than invent a new per-object transform this game doesn't have, two-hand pinch is mapped onto the transform control that *does* already exist and already needs a continuous two-axis input — the camera. This also sidesteps needing any new gesture kind; it's two ordinary `pinch` streams the game composes itself |

### 4.3 A unifying idea, stated plainly

Everything in `index.jsx`'s floating UI — the select/delete mode toggle,
auto-layout, clear-all, the CAD-controls dropdown, the sidebar
collapse/expand chevron, the search box — is an ordinary DOM button today,
reachable by an ordinary mouse click. **Point-as-cursor + pinch-as-click**
covers all of it for free, with no bespoke per-button gesture design, the
same way a real mouse does. The only place this document spends real design
effort is where the *scene itself* is being manipulated (placing, selecting,
connecting, dragging, viewing) — because that's where "hands" genuinely beats
"mouse" on feel, not because the UI chrome needs its own gesture vocabulary.

## 5. What's missing, and what blocks it — say this plainly

The task this document was written under states: *"PinchRecognizer and
PointRecognizer do not exist in `packages/wibbly-input/src/recognizers/`
(only `swing.ts` does). `HandLandmarkTracker` does not exist."* **That
statement is now stale.** As of this pass through the repo (2026-07-21),
`packages/wibbly-input/src` contains real, substantial implementations:
`hand-tracker.ts` (`HandLandmarkTracker`, MediaPipe HandLandmarker, ~400
lines with real delegate fallback and CSP handling), `recognizers/pinch.ts`
(`PinchRecognizer`, ~270 lines), `recognizers/point.ts` (`PointRecognizer`,
~280 lines), and `recognizers/hand-recognizer.ts` (the shared
`HysteresisGate` debounce/hysteresis machinery both recognizers build on).
All four are exported from the package's public `index.ts`. This is a live
repo with other agents working on `packages/` concurrently with this pass —
by the time anyone reads this, some of the gaps below may already be closed.
As of right now, though, here is the honest remaining gap between "the
pieces exist" and "palmworks can actually receive a `pinch`/`point`
`GestureEvent` from the shell":

1. **`WibblyInput` (`pipeline.ts`) does not wire hands at all.** Read the
   actual class: it constructs a `PoseTracker`, a `SpatialBinder`, and a
   `SwingRecognizer` — there is no `HandTracker` config field, no code path
   that calls `HandLandmarkTracker.estimate()`, and no hand recognizer in the
   default `recognizers` list. The pieces exist as importable library code;
   the orchestrator games actually receive events from does not compose them
   yet. This is the single largest blocking item.
2. **No hand-identity binder exists.** `PlayerBinder`/`SpatialBinder` bind
   `Person[]` (body poses) to a durable `playerId`. There is no equivalent
   that turns a raw `Hand[]` into `BoundHand[]` for more than one person —
   `pinch.ts` and `point.ts` both say this outright in their own doc
   comments ("no hand equivalent of `SpatialBinder` in this package yet").
   For a single local player this is a non-issue (assign one fixed
   `playerId` to every detected hand); for two people sharing one camera,
   their hands are currently indistinguishable without something upstream
   assigning distinct player identities first.
3. **The contract docs haven't caught up.** `games/README.md`'s gesture
   table and `WIBBLY.md` §8 both still say `pinch`/`point` are "planned" /
   "not started," and `WIBBLY.md` explicitly says "no hand-related code
   exists anywhere in `packages/wibbly-input` today" — not true as of this
   pass. Whoever finishes the pipeline wiring should update both; this
   document doesn't, since `games/README.md` and `WIBBLY.md` aren't in this
   document's scope (`games/palmworks/**` only).
4. **Untested against a real camera.** `point.ts`'s own comment: the default
   thresholds are "reasoned defaults, not measured against real MediaPipe
   output (no camera/GPU available while building this)." `hand-tracker.ts`
   similarly notes `visibility` reliability for hand landmarks is
   unverified. Expect tuning against a living room, not just fixtures.
5. **No 2D-gesture → 3D-scene raycast seam exists yet.** Both `pinch`'s
   `vector` and `point`'s `origin`/`direction` are normalized image-space
   coordinates (or a ray in that space) — turning that into "which object in
   the R3F canvas is under this ray" needs a real integration: map the
   normalized coordinate into the canvas's screen space (accounting for
   whether the preview is mirrored), construct a `THREE.Raycaster` from the
   camera through that screen point (or directly from `origin`/`direction`
   for `point`, which is nearly already a ray), and intersect it against the
   scene. None of this is hard, but none of it exists today either — it's
   real integration work, not automatic once the shell ships events.
6. **No compound two-hand gesture primitive.** The shell delivers
   independent per-hand `pinch`/`point` events; "two-hand pinch to drive the
   camera" (4.2) requires *this game* to correlate two concurrent `pinch`
   `hold` events sharing a `playerId` with opposite `detail.hand` — that
   correlation logic doesn't exist anywhere yet and would be written inside
   palmworks, not the shell.
7. **No live connection-preview line while dragging.** Today,
   `PlantScene`'s `connectionStart` state only renders a pulsing indicator
   sphere at the origin port while a connection is pending — there is no
   line following the cursor/pinch position before the second endpoint is
   chosen. Pinch-drag-to-connect (4.2) would read much better with one; it's
   a real, if small, addition to `AutoRoutingConnection.jsx` or a sibling
   component, not something that falls out of the gesture mapping for free.
8. **Not wired into the wibbly shell at all**, by explicit instruction of
   the task this document was written under — this section describes what
   that would take without doing it:
   - No `games/palmworks/game.json` exists yet (the format is documented in
     `games/README.md`; `src/components/catalogue.js` already has a
     `palmworks` entry with `status: 'planned'` and no `path`, anticipating
     this).
   - `games/palmworks` is a fully separate nested project — its own
     `package.json`, its own Vite config, its own React 19 + Tailwind +
     shadcn/ui + React Three Fiber toolchain, entirely independent of the
     top-level wibbly app's build. Wiring it in means deciding how a nested
     app gets served/built as part of the top-level app (a routed subpath
     build step, an iframe, a shared workspace/monorepo restructure) — a
     real build-topology decision, not just adding a catalogue entry.
   - The game would need to actually receive `GestureEvent`s from the shell
     per the `games/README.md` contract (props, a subscription, whatever the
     shell's convention is) rather than the standalone app's current
     self-contained `<Canvas>`.
9. **No keyboard fallback exists at all, anywhere in this codebase, today.**
   Verified: zero `onKeyDown`/`onKeyUp`/`addEventListener('keydown', ...)` in
   all of `games/palmworks/src`. `games/README.md` is explicit that this is
   not optional — "Keyboard fallback is not optional — it is how the game
   gets reviewed, tested in CI, and played by someone on a laptop with the
   lid half-closed." See §6 below for the design; it does not exist as code
   yet, matching the honesty this whole section is trying to model.

## 6. Keyboard fallback (design — not yet implemented)

None of this exists in code today. It needs to, before this game can be
submitted per `games/README.md`'s own review checklist ("Does the keyboard
fallback actually work?"). Proposed scheme, designed to mirror the hand
mapping in §4 one-for-one rather than being a second, disconnected control
scheme:

| Key(s) | Action | Mirrors |
|---|---|---|
| `Tab` / `Shift+Tab` | Cycle a focus cursor among placed objects (and, when the palette is open, among palette categories/items) | `point` (a discrete cursor, one target at a time, instead of a continuous ray) |
| Arrow keys | Nudge the focused/selected object one grid cell in that direction; when the palette is open, navigate categories/items | Pinch-drag placement and object dragging, quantized to key-repeat instead of continuous motion |
| `Enter` / `Space` | Activate: place the focused palette item at the current grid cursor, select the focused object, or complete a pending port connection at the focused port | Pinch-release ("tap") |
| `C` | Open/close the component palette and move focus into it | Point at the palette to bring it into reach |
| `P` (while an object or port has focus) | Start a port-to-port connection at the focused port; `Tab`/arrows to the target port; `Enter` completes it; `Escape` cancels | Pinch-start / hold / release on a port |
| `Delete` / `Backspace` | Delete the focused/selected object and its connections | The delete-mode toggle + click, collapsed into one key so deletion doesn't need a modal mode at all |
| `Q` / `E` | Orbit the camera left/right | Two-hand pinch rotation |
| `+` / `-` (or `[` / `]`) | Zoom the camera in/out | Two-hand pinch distance |
| `Escape` | Cancel whatever's pending (a connection in progress, an open palette) and clear the focus cursor | Pinch-release over empty space |

This keymap is deliberately a **complete alternative**, not a degraded one —
every action in §4 has a keyboard equivalent, so a reviewer, a CI run, or a
player with their laptop lid half-closed can build the same plant a
hands-driven session could.

## 7. Honest status table

**Updated 2026-08-07 — the hands are wired in.** Everything below §4's core
mapping (point-to-select, pinch-to-place, pinch-drag/tap-to-connect) is now
real, running code with real tests, not just a design grounded in real event
shapes. What follows is what changed and what is honestly still not there.

| Piece | Status |
|---|---|
| 3D scene, grid, camera controls | **Built.** Mouse-driven, real, works today, unchanged. |
| 29 industrial objects | **Built.** All 29 render, all expose typed ports, unchanged. |
| Port-to-port connection + auto-routing | **Built.** Two-click (now also two-*tap*) flow, collision-aware pipe routing, animated flow shader. `canPortsConnect`/the connection builder were extracted to `plant-scene-logic.ts` (pure functions) so mouse play and the gesture layer share ONE implementation, not two. |
| Component palette, search, categories | **Built.** Palette buttons now also carry `data-component-type` (inert for mouse play) so the gesture layer can recognise a pinch-down over one. |
| Auto-layout, clear-all, grid snap | **Built.**, unchanged. |
| `HandLandmarkTracker` / `PinchRecognizer` / `PointRecognizer` (library) | **Built.** Still not verified against a real camera/GPU (no hardware available while building this either) — the recognizer thresholds remain "reasoned, not measured." |
| `HandInput` — hands wired into a pipeline games actually use | **Built.** `packages/wibbly-input/src/hand-pipeline.ts`, a hand-only analogue of `WibblyInput` (FrameSource -> HandTracker -> PinchRecognizer/PointRecognizer -> callbacks), exported at the new `@vulos/wibbly-input/hand` subpath so a consumer that only wants hands does not pull in `@tensorflow*`. `pipeline.ts` (the body-pose `WibblyInput` tennis uses) is untouched. |
| Multi-person hand identity (hand → `playerId` binder) | **Still not built** as a real binder — `HandInput` defaults to one fixed local `playerId` for both hands (documented, correct for solo play; a second person on the same camera is still indistinguishable, same honest gap as before). |
| 2D-gesture → 3D-raycast integration | **Built, via DOM reuse, not a hand-rolled raycaster.** `virtual-pointer.ts` dispatches real `pointerdown`/`mousemove`/`mouseup`/`click` events at the mapped screen position — the same events a mouse or touchscreen would send — so `PlantScene`'s existing, UNMODIFIED click/drag handlers do the actual hit-testing. `GestureRaycastBridge.tsx` covers the one case DOM reuse can't (a NEW object's ground position for "pinch to place"). |
| Pinch-to-place / point-to-select / pinch-drag(tap)-to-connect in this game's code | **Built.** `GestureController` (pinch/point -> down/move/up), `PlacementRouter` (palette pick-up/drop, since a `<button>` has no drag concept to reuse), `VirtualPointer` (DOM dispatch). 36 tests in `games/palmworks`, plus 10 in `packages/wibbly-input` for `HandInput` itself. |
| Two-hand camera gesture correlation | **Not built.** Out of scope for this pass, same as before — `GestureController` drives a single cursor (whichever hand's pinch is active), not two-hand compound gestures. |
| Live connection-preview line while dragging | **Not built.** Connecting is tap-tap (pinch-tap port A, pinch-tap port B), matching the mouse's own two-click flow exactly, rather than a continuous drag with a preview line — a deliberate scope cut for this pass, not an oversight. |
| Keyboard fallback | **Not built.** Still true. Not needed for "stays playable without a camera," though: this game was ALREADY fully mouse-driven before any of this pass's work, and every gesture wired in this pass is a pure ADDITION alongside the mouse path, never a replacement for it — see §8. |
| Wired into the wibbly shell (`game.json`, catalogue routing, build integration) | **Not built.** `games/palmworks` is still a fully separate nested Vite project with no route in the top-level app's router. The catalogue entry (`src/components/catalogue.ts`) states this plainly and stays `status: 'planned'` for exactly this reason — flipping it would make the title screen's card navigate to nothing. See §5.8; unchanged by this pass by the same explicit-scope reasoning as before. |

## 8. What "pinch-drag to connect" actually means today

§4.2's table described connecting a port as a single continuous pinch-drag
from port to port. What is actually built is **pinch-TAP to connect**: a
quick pinch (down, then up with barely any movement) on port A starts a
pending connection — mechanically identical to the mouse's first click,
same `connectionStart` state, same pulsing indicator — and a second
pinch-tap on a compatible port completes it, or on the same port cancels it.
A real drag-style release IS distinguished from a tap (`PinchRecognizer`'s
own `detail.delta`, thresholded in `GestureController`), but nothing
downstream currently treats a drag differently for ports — only object
placement and object repositioning use the continuous drag. This is an
honest, deliberate narrowing for a first pass, not what §4.2 originally
specified; a continuous drag-to-connect with a live preview line remains a
real, separate piece of future work (see §7's "Live connection-preview
line" row).

Nothing above claims a release date. The factory was always real. As of
this pass, the hands are real too — wired, tested with synthetic hand
fixtures through the actual recognizers (not mocked), and never verified
against a live camera, which remains the one gap no amount of test-writing
in this environment could close.
