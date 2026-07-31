# How to play

<style>
.wbf{--a:#C4006B;--am:#8A4B00;--ok:#0F7A3D;--tx:#140F1B;--tx2:#544A61;--ln:#BEB2CD;--sf:#F5F1F9;--pg:#FFFFFF;margin:1.75rem 0}
:root[data-theme="dark"] .wbf{--a:#FF4D9D;--am:#FFB020;--ok:#3FE08A;--tx:#F5F1FA;--tx2:#ADA2BE;--ln:#3A2C52;--sf:#171122;--pg:#0E0A16}
.wbf>.sc{overflow-x:auto;border:1px solid var(--ln);border-radius:10px;background:var(--pg)}
.wbf svg{display:block;height:auto;width:100%;min-width:900px}
.wbf img{display:block;width:100%;height:auto}
.wbf figcaption{font-size:.82rem;line-height:1.65;color:var(--tx2);margin-top:.65rem}
.wbf figcaption b{color:var(--tx)}
</style>

**wibbly is a tennis game you play by swinging your arm at your webcam.** No controller, no app
store, nothing to install. Open the link, allow the camera (or don't — a spacebar works just as
well), and swing.

<figure class="wbf">
<div class="sc">
<img src="/projects/wibbly/shots/play.png" alt="Tennis in play: the Three.js court and HUD during a rally." loading="lazy" decoding="async" />
</div>
<figcaption>Tennis, mid-rally. Your swing controls the racket.</figcaption>
</figure>

## What you need

- **A laptop or desktop with a webcam.** Built-in is fine.
- **A Chromium browser** — Chrome or Edge. Pose tracking runs on a browser feature these have
  reliably; Safari and Firefox haven't been tried, so if you use one, you're the first report.
- **Room to swing.** About two metres back from the screen, with your upper body — shoulders,
  elbows, wrists — in frame.
- **Even light on you.** A bright window behind you turns you into a silhouette the tracker can't
  read. Face a light source, don't back into one.
- **Nothing to install.** It's a link. Open it, allow the camera, play.

<figure class="wbf">
<div class="sc">
<svg viewBox="0 0 900 260" width="900" role="img" aria-label="A framing guide: stand about two metres back from the camera with your upper body — shoulders, elbows and wrists — inside the frame, and even light on your face rather than a bright window behind you.">
  <g font-family="ui-monospace, monospace">
    <text x="16" y="24" font-size="12.5" fill="var(--tx2)" letter-spacing="1.3">HOW TO STAND — SIDE VIEW</text>
    <rect x="24" y="46" width="26" height="18" rx="3" fill="var(--sf)" stroke="var(--a)" stroke-width="1.4"/>
    <circle cx="37" cy="55" r="5" fill="var(--a)"/>
    <text x="10" y="82" font-size="12.5" fill="var(--tx2)">camera</text>
    <path d="M60 55 H700" stroke="var(--ln)" stroke-width="1.4" stroke-dasharray="5 5"/>
    <path d="M60 40 V70 M700 40 V70" stroke="var(--ln)" stroke-width="1.2"/>
    <text x="330" y="36" font-size="12" font-weight="700" fill="var(--tx)">≈ 2 metres</text>
    <g transform="translate(700,0)">
      <circle cx="20" cy="90" r="22" fill="none" stroke="var(--tx)" stroke-width="2.2"/>
      <path d="M20 112 V178 M-20 138 H60 M20 178 L-6 230 M20 178 L46 230" stroke="var(--tx)" stroke-width="2.2" fill="none"/>
    </g>
    <rect x="686" y="60" width="188" height="150" rx="10" fill="none" stroke="var(--ok)" stroke-width="1.6" stroke-dasharray="4 4"/>
    <text x="694" y="76" font-size="12.5" fill="var(--ok)" font-weight="700">UPPER BODY IN FRAME</text>
    <text x="694" y="234" font-size="12.5" fill="var(--tx2)">shoulders · elbows · wrists</text>
    <text x="330" y="250" font-size="12.5" fill="var(--tx2)">Even light on you — not a bright window behind you.</text>
  </g>
</svg>
</div>
<figcaption>What setup is checking for when it says "step back" or "can't see your arms": distance, and light.</figcaption>
</figure>

## Controls

| Where | Input | Does |
|---|---|---|
| Title screen | `←` / `→` | Move between games |
| Title screen | `Enter` | Start the selected game |
| Title screen | `S` | Open camera setup |
| In tennis | **Swing your arm** | Hit the ball |
| In tennis | `Space` | Hit the ball, no camera needed |
| Setup / any step | **"Skip — play with the spacebar"** | Always offered, even after you say no to the camera |

That's the whole vocabulary today: **one gesture, a swing.** No serve, no volley, no punch, no
kick, no pinch. If a control isn't in the table above, it doesn't exist yet — see
[What's in it today](/projects/wibbly/docs/whats-in-it-today) for the full, honest inventory.

**Saying no to the camera doesn't lock you out.** Every screen that would ask for it offers the
spacebar instead, and the game is fully playable that way — see
[Your camera](/projects/wibbly/docs/privacy) for why the spacebar path exists and what the camera
path costs you if you skip it (nothing except using your arm).

## First run

Opening the game for the first time walks you through three short steps before the court appears.

<figure class="wbf">
<div class="sc">
<img src="/projects/wibbly/shots/setup-intro.png" alt="Setup step 1: what the camera is for and why it stays on-device, shown before the browser&#x27;s camera permission prompt appears." loading="lazy" decoding="async" />
</div>
<figcaption><b>1. Permission.</b> wibbly explains what the camera is for and where the frames go — nowhere — before your browser even asks you to allow it.</figcaption>
</figure>

<figure class="wbf">
<div class="sc">
<img src="/projects/wibbly/shots/setup-handedness.png" alt="Setup step 2: choosing left- or right-handed play." loading="lazy" decoding="async" />
</div>
<figcaption><b>2. Handedness.</b> Pick left or right once. It's remembered, and you can change it any time from the in-game menu.</figcaption>
</figure>

<figure class="wbf">
<div class="sc">
<img src="/projects/wibbly/shots/setup-framing.png" alt="Setup step 3: the live framing check running over the camera preview." loading="lazy" decoding="async" />
</div>
<figcaption><b>3. Framing.</b> A live check confirms it can see your upper body before you're dropped onto the court. <b>Honesty note:</b> this screenshot was captured against a synthetic test camera with nobody standing in front of it, which is why it reads "no one detected" — that's the real check giving a real, correct answer to an empty room, not a broken feature.</figcaption>
</figure>

## In the game

<figure class="wbf">
<div class="sc">
<img src="/projects/wibbly/shots/in-game-menu-camera.png" alt="The in-game menu&#x27;s Camera tab: a real, wired handedness control next to disabled controls for features that don't exist yet." loading="lazy" decoding="async" />
</div>
<figcaption>Pause any time to reach the in-game menu. Handedness is live here — change it mid-game and your very next swing uses it. Anything greyed out is a feature that isn't built yet, shown honestly rather than hidden.</figcaption>
</figure>

## Next

- [What's in it today](/projects/wibbly/docs/whats-in-it-today) — the honest inventory: one game, one player, one gesture, and what's coming.
- [Troubleshooting](/projects/wibbly/docs/troubleshooting) — what to do when it can't see you, when it's laggy, or when it swings by itself.
- [Your camera](/projects/wibbly/docs/privacy) — where your camera frames actually go (nowhere).
