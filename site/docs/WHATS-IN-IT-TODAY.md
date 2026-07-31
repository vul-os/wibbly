# What's in it today

<style>
.wbf{--a:#C4006B;--am:#8A4B00;--ok:#0F7A3D;--tx:#140F1B;--tx2:#544A61;--ln:#BEB2CD;--sf:#F5F1F9;--pg:#FFFFFF;margin:1.75rem 0}
:root[data-theme="dark"] .wbf{--a:#FF4D9D;--am:#FFB020;--ok:#3FE08A;--tx:#F5F1FA;--tx2:#ADA2BE;--ln:#3A2C52;--sf:#171122;--pg:#0E0A16}
.wbf>.sc{overflow-x:auto;border:1px solid var(--ln);border-radius:10px;background:var(--pg)}
.wbf svg{display:block;height:auto;width:100%;min-width:900px}
.wbf img{display:block;width:100%;height:auto}
.wbf figcaption{font-size:.82rem;line-height:1.65;color:var(--tx2);margin-top:.65rem}
.wbf figcaption b{color:var(--tx)}
</style>

**Right now there's one game: tennis. One player, one gesture — a swing. That's it.** Everything
else you might see mentioned — a second player, soccer, boxing, a factory-building game, playing
with a friend over the internet — is either a card on the title screen that isn't clickable yet,
or isn't in the app at all. This page is the full, honest list, checked against the code rather
than assumed.

<figure class="wbf">
<div class="sc">
<img src="/projects/wibbly/shots/title.png" alt="Tennis is playable today from the title screen; Soccer, Boxing and Palmworks are listed as planned reference games with no code behind them yet, or no gesture wired to them yet." loading="lazy" decoding="async" />
</div>
<figcaption>The title screen, as it looks today. <b>Tennis is real and playable.</b> Everything else on the same screen carries a "Planned" badge and cannot be clicked — a deliberate choice so a "coming soon" always points at a real backlog item, never at nothing.</figcaption>
</figure>

## What's actually playable

- **One game: Tennis.** A real Three.js court, ball physics and an AI opponent. You can play it
  right now.
- **One player.** The camera can technically see up to six people at once, but only the first
  player's swing controls the racket. A second person standing next to you is not player two —
  not yet.
- **One gesture: swing.** That's the entire vocabulary. No serve, no volley, no punch, no kick, no
  pinch.
- **Free.** No account, no sign-in, no wagers, no in-app purchases, no ads. There is no payment
  path anywhere in the app.

## What's on the title screen but not playable

Soccer, Boxing and Palmworks all appear as cards on the title screen today, each wearing a
"Planned" badge instead of "Playable." Selecting one shows a blueprint panel that says plainly:
*"No code exists for this game. It is a tracked backlog item, not a release."* None of the three
can be started.

| Card | What it actually is right now |
|---|---|
| **Soccer** | No code at all. Chosen as the next reference game because kicking is a lower-body gesture the swing detector doesn't touch. |
| **Boxing** | No code at all. Chosen because it needs both hands tracked independently — a punch from each arm, on its own cooldown — which is a step past anything built today. |
| **Palmworks** | Not "no code" — the opposite problem. It's a real, separate factory-building game, and it's playable — just not from here, and not with your camera. |

### Palmworks, specifically

Palmworks is a genuine, working game: place industrial equipment on a grid and route pipework
between it, built with its own routes and its own React app in `games/palmworks`. It runs, it has
a real UI, and you can play it with a mouse and keyboard by building and running it as its own
project. What it is *not*: reachable from wibbly's own title screen (it's listed there, but marked
"Planned," same as Soccer and Boxing), and driven by any gesture. Nothing in Palmworks calls a
camera, a pose tracker, or a gesture recognizer — the plan is pinch-to-place and point-to-select,
and none of that wiring exists yet.

## The gesture library that nothing uses yet

Underneath the one gesture you can actually play with, there's a second, separate gesture system
that's been built and tested but never connected to anything you can click. wibbly can already
recognize a hand **pinch** and a hand **point** — pinpoint hand-landmark tracking, unit-tested
against synthetic geometry. What it cannot do is see either of those in the running game: the
piece of code that wires a camera to a game (`WibblyInput`, the thing Tennis actually uses) only
ever turns on the body tracker and the swing detector by default. The hand tracker exists as a
library; nothing composes it into the pipeline, and no game — not Tennis, not Palmworks — reacts
to a pinch or a point today. Treat "hand gestures" as a finished part sitting in a box, not a
feature you can go find.

## Playing with a friend

There are two different things this could mean, and neither is a button you can press today.

- **On the same couch, one camera, two players.** The underlying tracker can already find up to
  six people in frame and keep their identities straight as they move — that part is built and
  tested. What's missing is the game side: Tennis is wired to read only the first player's swing,
  so even standing a second person in frame does nothing yet.
- **Over the internet, different computers.** The transport for this exists and is wired into
  Tennis in code — but it's switched off by default, and there is no lobby screen, no "invite a
  friend" button, nothing in the UI that turns it on. You cannot start a networked game from the
  app as it stands.

See [How it works → Multiplayer](/projects/wibbly/docs/multiplayer) for the full, honest
breakdown of both, including why a swing can't be proven genuine to another player the way a
keyboard press can.

## Reading "planned" honestly

Every capability across these docs is described as one of three things, never a blend:

- **Shipped / working** — runs today, exercised by hand or by CI against real inputs.
- **Implemented, unvalidated** — built and unit-tested against synthetic fixtures, but never run
  against a real camera or a real room. This is the trap state: a green test suite here proves the
  logic does what was intended, and says nothing about whether it survives your living room.
- **Planned** — written down, tracked, no code yet.

If something on this page or anywhere in these docs ever looks wrong against what you actually
see in the app, trust what you see — these pages are kept in sync with the code, not the other way
around. The full, capability-by-capability version of this table, with test counts and file
references, is in [How it works → Architecture](/projects/wibbly/docs/architecture).

## Next

- [How to play](/projects/wibbly/docs/how-to-play) — what you need and how to actually start.
- [Troubleshooting](/projects/wibbly/docs/troubleshooting) — when it can't see you, or swings on its own.
- [Your camera](/projects/wibbly/docs/privacy) — where your camera frames actually go (nowhere).
