# Troubleshooting

<style>
.wbf{--a:#C4006B;--am:#8A4B00;--ok:#0F7A3D;--tx:#140F1B;--tx2:#544A61;--ln:#BEB2CD;--sf:#F5F1F9;--pg:#FFFFFF;margin:1.75rem 0}
:root[data-theme="dark"] .wbf{--a:#FF4D9D;--am:#FFB020;--ok:#3FE08A;--tx:#F5F1FA;--tx2:#ADA2BE;--ln:#3A2C52;--sf:#171122;--pg:#0E0A16}
.wbf>.sc{overflow-x:auto;border:1px solid var(--ln);border-radius:10px;background:var(--pg)}
</style>

Every fix below is grounded in an actual number or an actual code path in wibbly — not general
webcam advice. If the tuning constants mentioned here mean nothing to you, that's fine; the fixes
still work. If you want the full list of them, see
[Configuration](/projects/wibbly/docs/configuration).

## "It can't see me"

| Symptom | Why, and what to do |
|---|---|
| No camera preview appears at all | You (or another app) may have blocked the camera. Check your browser's site permissions — the padlock icon in the address bar — and your OS-level camera privacy setting. |
| Preview is on, but nothing swings | The tracker needs your shoulders, elbows and wrists in frame at a real confidence level — every wrist sample below a **0.3** confidence score is thrown away before it can even be considered a swing. Step back to about two metres and make sure your whole upper body is in the picture. |
| Setup says "no one detected" | This is a real, correct answer to what the camera sees, not a bug. Stand where the camera can see your upper body — see [How to play → What you need](/projects/wibbly/docs/how-to-play). |

## "It's dark in my room"

The tracker scores every point it finds, and low light lowers that score — that's exactly the
**0.3** minimum wrist-confidence floor above. In a dim or backlit room, your real wrist positions
can drop below that floor even though you're standing in the right place, and the game will look
like it isn't tracking you at all. Face a light source rather than backing into one — a bright
window *behind* you turns you into a silhouette, which is the single most common cause of "it
can't see me."

## "My camera won't turn on"

Almost always one of three things: another app or browser tab already has the camera open (only
one program can read from most webcams at a time — close Zoom, other camera tabs, etc.);
permission was denied at the browser or OS level (check the address-bar padlock, and your
operating system's camera privacy settings); or it's a genuinely unsupported browser — pose
tracking has been exercised on Chrome and Edge, not Safari or Firefox. None of these lock you out
of playing: every screen that asks for the camera offers **"play with the spacebar"** instead, and
the game doesn't get smaller for taking it.

## "It's laggy"

wibbly doesn't have a fixed frame-rate target — it measures how long pose inference actually takes
on your machine and adapts, aiming to stay between an **8 fps floor** and a **60 fps ceiling**,
using at most half of each frame's time budget for inference (a 0.5 duty cycle) so detection can't
starve rendering and physics. If it's still choppy: close other tabs or apps using your camera or
GPU — that's the most common cause, since it's exactly the inference time the pacer is reacting to.
The game should visibly slow its pacing rather than freeze; if it freezes outright, that's a bug —
see below.

## "It swings when I didn't"

A few different causes, in order of likelihood:

- **A loose motion crossed the real thresholds.** A swing needs real, measured travel — about a
  sixteenth of the frame's width horizontally (6.25%) and roughly 3% of it vertically, at a minimum
  speed — so gestures like adjusting your shirt or reaching for a coffee cup can occasionally cross
  that bar. This is a tuning trade-off, not a random glitch.
- **One stroke registered twice.** There's a built-in half-second cooldown meant to prevent exactly
  this. If you're seeing double-hits faster than that, it's a bug worth reporting — see below.
- **Someone else in frame.** Today's tennis only reads gestures from the first tracked player, so
  if you're not alone in the room, movement from someone else can occasionally be what the tracker
  picked up as "the player."

## Handedness feels swapped

Forehand and backhand mirrored is almost always the handedness setting, not a tracking bug — check
it in the in-game menu (pause any time to reach it) and flip it if it's wrong. It takes effect on
your very next swing.

## Report a real bug

If something above doesn't explain what you're seeing — especially a double-hit inside the
cooldown window, or a freeze rather than a slowdown — the
[GitHub repo](https://github.com/vul-os/wibbly) takes reports.

## I just don't want to use the camera

Every screen offers "play with the spacebar." Take it — the game doesn't get smaller for choosing
it, and nothing about tennis requires a camera to be fully playable.

## Next

- [How to play](/projects/wibbly/docs/how-to-play) — controls, setup, and what to expect on first run.
- [Your camera](/projects/wibbly/docs/privacy) — where your camera frames actually go (nowhere).
- [Configuration](/projects/wibbly/docs/configuration) — every tuning constant mentioned above, with its default and what it costs you to change.
