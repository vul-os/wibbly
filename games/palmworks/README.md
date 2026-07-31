# Palmworks

Build a factory. Place industrial equipment on a grid — boilers, pumps, tanks,
reactors, and 25 more — and route pipes, cables, and gas lines port-to-port
between them. It is not a simulation of chemistry or flow rates; it is a
construction toy with 29 well-modeled pieces of industrial hardware and a
satisfying way of connecting them into something that looks like a real
plant.

For the full story — where this game came from, exactly what is built today,
and the (currently unimplemented) hand-gesture design — see
[`PALMWORKS.md`](PALMWORKS.md) in this same directory. This file is the short
version: what it is, how to run it, and its actual status.

## Status: playable standalone, not reachable from wibbly's title screen

This is a real, independent game, and it runs today — with a real catch:

- **Playable right now, with a mouse.** `cd games/palmworks && npm install &&
  npm run dev`, open the printed localhost URL, and you have a working
  plant-builder: click the sidebar palette to place objects, click ports to
  wire them together, drag to reposition, switch to delete mode to remove.
  No camera, no gestures, no account, no backend, nothing persisted anywhere
  — the plant lives in the tab. `src/App.jsx` runs no auth provider and no
  session, by design (wibbly games have no accounts and no backend at all —
  see `games/README.md`).
- **Not wired into wibbly's title screen.** `src/components/catalogue.js`
  lists palmworks with `status: 'planned'` and no `path`. Wibbly's title
  screen (`src/pages/title.jsx`) treats anything other than
  `status: 'playable'` as a non-clickable card: it renders in the "Planned"
  state, cannot be selected with Enter/click, and has no keyboard focus path
  into the game. You cannot reach palmworks by playing wibbly today — you
  have to run it directly, as its own separate Vite app, the way described
  above.
- **Zero gesture wiring.** There is no camera involvement anywhere in this
  game's current code. `games/palmworks/src` contains no references to
  gestures, hand tracking, or `@vulos/wibbly-input`. It is a fully
  mouse/pointer-driven React Three Fiber app, full stop. A hand-gesture
  control scheme is *designed* in `PALMWORKS.md` §4 (pinch to place, point
  to select, pinch-drag to connect ports) but none of it is implemented —
  no keyboard fallback exists either, which `games/README.md`'s own review
  checklist requires before a game can be submitted.

In short: it's a complete, independent mouse-driven toy you can run on its
own, sitting inside this repo as a card wibbly's title screen currently
refuses to let you click.

## Where this came from

Palmworks was folded in from a deleted repository, `vul-os/palmworks`
(previously `plantvis-mono`), with its full commit history preserved. It
originally shipped as a standalone React + Three.js industrial-plant
visualiser with its own accounts and a Supabase/Firebase backend; that
backend and every account-facing page were stripped before the fold. What's
left is the part that never depended on accounts in the first place: the 3D
scene, the 29-object library, and the port-to-port connection-routing
engine. Original authorship: `exolutionza` and `MichaelNdimande`. See
`PALMWORKS.md` §1–3 for the full account.

## Running it

```bash
cd games/palmworks
npm install
npm run dev       # http://localhost:5173 by default
```

Other scripts, same as any Vite app: `npm run build`, `npm run preview`,
`npm run lint`. This is a fully separate nested project — its own
`package.json`, its own Vite config, its own React 19 + Tailwind + shadcn/ui
+ React Three Fiber toolchain — entirely independent of the top-level
wibbly app's build. Nothing here builds or runs as part of `npm run dev` /
`npm run build` at the repo root.

## What's actually in the scene

- An infinite snap-grid with `OrbitControls` (pan/zoom/rotate).
- 29 parametric industrial objects across four categories (Processing
  Equipment, Storage & Transport, Control Systems, Electrical) — each its
  own component under `src/pages/viz/components/objects/`.
- A searchable, category-first component palette sidebar.
- Two interaction modes (`select` / `delete`), grid-snapped dragging with
  automatic pipe re-routing, and a two-click port-to-port connection flow
  with collision-aware auto-routed pipes.
- Auto-layout (arrange everything in a circle) and clear-all.
- Grid-size and snap controls, plus a coordinate-marker toggle.

Full detail, file-by-file, is in `PALMWORKS.md` §3.

## License

MIT OR Apache-2.0, matching the rest of this repo.
