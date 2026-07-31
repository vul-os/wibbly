# Incoming from the landing rewrite

Notes from the agent that rewrote `site/index.html` and `site/docs.html` (shell only), for the
agent now owning `site/docs/**` and `manifest.json`. Delete this file once absorbed.

## Status of my earlier docs edits (before the scope split)

Before the coordinator split this job, I had already made the following commits/edits to files
that are now yours. Flagging them so you don't get surprised by drift between what's on disk and
what you're about to write:

- Created `site/docs/PLAY.md` — a single combined page (what you need, controls, first run,
  in-game menu, troubleshooting, "what exists today"). **The agreed structure splits this into
  three pages** (how-to-play, whats-in-it-today, troubleshooting) under group "Play" — so this
  file's content maps roughly as: "What you need" + "Controls" + "First run" + "In the game" →
  `how-to-play`; "What exists today, plainly" → `whats-in-it-today`; "When it can't see you" →
  `troubleshooting`. Feel free to split/delete/rewrite it however you see fit — I'm not touching
  `site/docs/**` further.
- Created `site/docs/PRIVACY.md` — plain-language privacy walkthrough with an inline SVG diagram.
  Agreed structure keeps this as its own page, just under a renamed group ("Your camera" instead
  of "Privacy"). Slug `privacy` should still work if you keep it — my landing page links to
  `./docs.html#privacy`.
- Edited `site/docs/manifest.json` — reordered groups to Play → Privacy → How it works → Advanced:
  build it yourself. **Superseded by the agreed structure** (Play → Your camera → How it works →
  Build it yourself, with Play split into three pages). Rewrite freely.
- Edited `site/docs/GETTING-STARTED.md` — trimmed player-facing content out (moved to PLAY.md),
  left dev-only content (clone/build/test), fixed a stale "86 seam tests" → "221" (verified against
  `npm test`, see below), and fixed the total test count.
- Edited `site/docs/ARCHITECTURE.md` — same stale test-count fix, 86 → 221, in two places.

**One fact worth carrying forward, verified by actually running the suite, not by trusting old
prose:** `npm test` at the repo root runs 368 tests total, not 363 as `README.md` currently claims
(221 `@vulos/wibbly-input` + 73 `@vulos/wibbly-p2p` + **10** `@vulos/wibbly-authority`, not 5 as
written + 64 app tests). If README.md still says 363/5 when you get to it, that's stale — the real
authority package has 10 passing tests today.

## Developer content cut from the old landing — where it already lives

The pre-rewrite `site/index.html` (1519 lines) had full sections for the seams/API contracts,
model-selection rationale, runtime-target analysis, the full capability audit table, the gaps list,
a clone-and-run quickstart, and the phase roadmap. **I checked all of it against the existing docs
pages before cutting anything, and none of it needs fresh transcription** — every one of those
sections already exists, in equal or greater detail, in the docs you own:

- Seams / API contracts (`FrameSource`, `PoseTracker`, `GestureRecognizer`, `PlayerBinder`,
  `Calibration`) → already fully covered in `ARCHITECTURE.md`.
- Model selection / rejected models table → already fully covered in `MODELS.md`.
- Runtime targets / why-not-Tauri → already fully covered in `RUNTIME-TARGETS.md`.
- Full capability audit table (the "01 / Status" ledger) → already fully covered in `OVERVIEW.md`'s
  status table.
- The gaps list (multi-person unvalidated, hand tracking not wired, no lobby UI, etc.) → already
  covered across `OVERVIEW.md`, `ROADMAP.md`, and `MULTIPLAYER.md`.
- Clone-and-run quickstart → already covered in `GETTING-STARTED.md`.
- Phase roadmap → already covered in `ROADMAP.md`.

So there is no orphaned content to absorb from the old landing beyond what's in `PLAY.md` /
`PRIVACY.md` above. The new landing (`site/index.html`) now only teases each of these topics in a
sentence or two and links out to the relevant doc — it doesn't duplicate the detail.

## What the new landing links to, so your slugs need to resolve

- `./docs.html#how-to-play` (from the honesty strip)
- `./docs.html#privacy` (from the privacy section)
- `./docs.html` (footer, nav, Vulos band — unanchored, lands on whatever your first page is)

If you land on different slugs than `how-to-play` / `privacy`, ping back or just rename — I'm not
watching this file after I hand it off.
