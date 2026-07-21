# Games

Every wibbly game lives in this directory, one folder per game. Tennis is the
exception for now — it still sits in `src/game/` because it predates this
layout. It will move.

> ## Status: this is the submission process, not a loader.
>
> Games in here are built and shipped **with the app** today. The plan is a
> manifest of content-addressed modules fetched at runtime, so adding a game
> stops requiring an app deploy. That is not built. Nothing below depends on
> it — submit a game the same way either way — but do not read "games are
> loaded from a list" as a thing that happens now.

---

## What a game is

A wibbly game receives **gestures** and draws **pixels**. That is the whole
contract.

It does not open a camera. The shell owns the camera, runs pose and hand
inference, and hands your game a `GestureEvent`. This is not a courtesy — it
is the security boundary that lets a stranger's game run on someone's machine
without asking them to trust the stranger. A game that wants camera access is
a game we cannot accept.

```ts
interface GestureEvent {
  playerId: PlayerId;   // stable across frames
  kind: string;         // 'swing' | 'pinch' | 'point' | 'punch' | …
  confidence: number;   // 0..1 — you MUST handle low confidence
  vector?: Vector2;
  tCapture: number;     // capture time of the frame, not detection time
  detail?: Record<string, unknown>;
}
```

Full definition: [`packages/wibbly-input/src/types.ts`](../packages/wibbly-input/src/types.ts).

Your game also never knows **where** a gesture came from. Local camera, second
player on the same camera, or a peer across the internet — all of them arrive
as a `GestureEvent` with a different `playerId`. Write for one player and
multiplayer mostly falls out.

### What a game may not do

| | Why |
|---|---|
| Open a camera or microphone | The shell owns capture. Frames never reach game code. |
| Make network requests | A submitted game is reviewed once; a game that can phone home isn't. |
| Read or write storage | Ask the shell to persist for you. |
| Touch the DOM outside its own surface | It is not your page. |

These are enforced by the runtime, not by trust. Do not design around evading
them.

---

## Available gestures

Only build against gestures that exist. `confidence` is real — a recogniser
fires on a noisy sensor reading, and your game has to survive a bad one.

| Gesture | Source | Status |
|---|---|---|
| `swing` | body pose (MoveNet) | **built** — `packages/wibbly-input/src/recognizers/swing.ts` |
| `pinch` | hands (MediaPipe) | planned |
| `point` | hands (MediaPipe) | planned |
| `punch` | body pose, per-arm | planned |
| `kick` | body pose, lower body | planned |

Need a gesture that isn't listed? Propose it as a recogniser PR against
`packages/wibbly-input` **first**, separately from your game. Recognisers are
shared infrastructure and get reviewed harder than games do.

Every game must also be playable **without a camera**. Keyboard fallback is not
optional — it is how the game gets reviewed, tested in CI, and played by
someone on a laptop with the lid half-closed.

---

## Submitting a game

1. Fork the repo and create `games/<your-slug>/`.
2. Add a `game.json` (below).
3. Open a PR. One game per PR.

```json
{
  "id": "palmworks",
  "name": "Palmworks",
  "blurb": "One line. Shown on the card.",
  "detail": "Two or three sentences. What you do and what it feels like.",
  "gestures": ["pinch", "point"],
  "art": "palmworks",
  "license": "MIT OR Apache-2.0"
}
```

### What reviewers check

Reviewers are looking at your **game logic**. The runtime already guarantees
your game cannot reach a camera, a network or a disk, so nobody has to read
your code hunting for a backdoor. What they will ask:

- Does it run, and does it stop running when you leave it?
- Does it handle `confidence` below 1.0 without falling apart?
- Does the keyboard fallback actually work?
- Is it playable by someone standing two metres from a laptop?
- Are the assets yours, or licensed so they can be redistributed?
- Does it degrade when a gesture is missed, rather than deadlocking?

### What gets a PR closed

- Requesting camera, network or storage access.
- Assets you do not have the right to redistribute.
- A game that only works at one body size, one skin tone, one lighting
  condition, or one handedness. Test left-handed. `Calibration` exists.
- Anything that requires the player to stand somewhere unsafe.

### Licensing

Contributions are dual-licensed **MIT OR Apache-2.0**, matching the repo. If
your assets carry a different licence, say so in `game.json` and in the PR —
some licences we cannot take at all. `WIBBLY.md` §4 has the reasoning on why
model and asset licences get scrutinised here.

---

## Local development

```bash
npm install
npm run dev
```

Your game appears on the title screen once it is in `src/components/catalogue.js`.
Add the entry in the same PR.
