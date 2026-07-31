# Privacy

<style>
.wbf{--a:#C4006B;--am:#8A4B00;--ok:#0F7A3D;--tx:#140F1B;--tx2:#544A61;--ln:#BEB2CD;--sf:#F5F1F9;--pg:#FFFFFF;margin:1.75rem 0}
:root[data-theme="dark"] .wbf{--a:#FF4D9D;--am:#FFB020;--ok:#3FE08A;--tx:#F5F1FA;--tx2:#ADA2BE;--ln:#3A2C52;--sf:#171122;--pg:#0E0A16}
.wbf>.sc{overflow-x:auto;border:1px solid var(--ln);border-radius:10px;background:var(--pg)}
.wbf svg{display:block;height:auto;width:100%;min-width:900px}
.wbf img{display:block;width:100%;height:auto}
.wbf figcaption{font-size:.82rem;line-height:1.65;color:var(--tx2);margin-top:.65rem}
.wbf figcaption b{color:var(--tx)}
</style>

**Nobody sees your camera. Not us, not a server, not the other player if you're ever playing with
one. Your video never leaves your device — full stop.**

That isn't a promise written on a policy page somewhere. It's true because of how the game is
built: there is no code anywhere in wibbly that uploads, streams, records, or saves your camera
feed. Nothing to opt out of, because there was never anything collecting it in the first place.

## What actually happens to a frame

Your camera captures a picture of you thirty times a second. Here's the whole journey of one of
those pictures, start to finish:

1. **Your browser captures it.** It exists, briefly, as pixels in your browser tab.
2. **Software on your machine looks at it** and works out where your shoulders, elbows and wrists
   are — a skeleton, not a picture. This runs on your laptop's own graphics chip, in the tab, with
   no round trip anywhere.
3. **The picture is thrown away.** It was never stored, never written to disk, never buffered for
   later. By the time step 2 finishes, the pixels are gone.
4. **What's left is a swing, or nothing.** If your arm moved like a swing, a tiny message is
   created — smaller than this paragraph — saying "swing, this confident, at this moment." That's
   what your game actually reacts to.

<figure class="wbf">
<div class="sc">
<svg viewBox="0 0 900 300" width="900" role="img" aria-label="Privacy boundary diagram. Inside the device, the camera produces frames, a tracker reduces them to a skeleton, a recognizer reduces that to one small gesture message, and the picture is discarded. Only that small message is ever eligible to leave the device — and even that only happens if you are ever playing with a friend over the network, which is not built yet.">
  <defs>
    <marker id="pv-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 z" fill="var(--ln)"/>
    </marker>
  </defs>
  <g font-family="ui-monospace, monospace">
    <rect x="4" y="26" width="558" height="248" rx="10" fill="var(--sf)" stroke="var(--ln)"/>
    <text x="22" y="50" font-size="12.5" fill="var(--tx2)" letter-spacing="1.6">YOUR DEVICE · YOUR BROWSER TAB</text>

    <rect x="26" y="72" width="112" height="62" rx="7" fill="var(--pg)" stroke="var(--ln)"/>
    <text x="42" y="99" font-size="12" fill="var(--tx)" font-weight="700">Camera</text>
    <text x="42" y="119" font-size="12.5" fill="var(--tx2)">a picture of you</text>

    <rect x="176" y="72" width="120" height="62" rx="7" fill="var(--pg)" stroke="var(--ln)"/>
    <text x="192" y="99" font-size="12" fill="var(--tx)" font-weight="700">Tracker</text>
    <text x="192" y="119" font-size="12.5" fill="var(--tx2)">finds your skeleton</text>

    <rect x="334" y="72" width="128" height="62" rx="7" fill="var(--pg)" stroke="var(--ln)"/>
    <text x="350" y="99" font-size="12" fill="var(--tx)" font-weight="700">Recognizer</text>
    <text x="350" y="119" font-size="12.5" fill="var(--tx2)">was that a swing?</text>

    <g stroke="var(--ln)" stroke-width="1.75" marker-end="url(#pv-ah)" fill="none">
      <path d="M142 103 H170"/>
      <path d="M300 103 H328"/>
    </g>

    <path d="M232 138 V176" stroke="var(--a)" stroke-width="1.75" fill="none" marker-end="url(#pv-ah)" stroke-dasharray="5 4"/>
    <rect x="140" y="180" width="186" height="52" rx="7" fill="var(--sf)" stroke="var(--a)"/>
    <text x="156" y="203" font-size="13" fill="var(--a)" font-weight="700">PICTURE THROWN AWAY</text>
    <text x="156" y="221" font-size="12.5" fill="var(--tx2)">never saved, ever</text>

    <rect x="352" y="164" width="196" height="90" rx="7" fill="var(--pg)" stroke="var(--a)"/>
    <text x="366" y="188" font-size="13" fill="var(--tx)" font-weight="700">"swing" message</text>
    <text x="366" y="208" font-size="12.5" fill="var(--tx2)">who, what, how sure,</text>
    <text x="366" y="224" font-size="12.5" fill="var(--tx2)">when — nothing else</text>
    <path d="M398 138 V158" stroke="var(--ln)" stroke-width="1.75" fill="none" marker-end="url(#pv-ah)"/>

    <path d="M580 16 V288" stroke="var(--a)" stroke-width="1.75" stroke-dasharray="7 6"/>
    <text x="590" y="38" font-size="12.5" fill="var(--a)" font-weight="700" letter-spacing="1.6">THIS LINE IS YOUR DEVICE'S EDGE</text>

    <rect x="590" y="56" width="302" height="92" rx="8" fill="none" stroke="var(--ln)" stroke-dasharray="5 5"/>
    <text x="608" y="82" font-size="12" fill="var(--tx2)" font-weight="700">A friend, someday (not built)</text>
    <text x="608" y="103" font-size="12.5" fill="var(--tx2)">would only ever get: the message</text>
    <text x="608" y="120" font-size="12.5" fill="var(--tx2)">≈ 64 bytes, smaller than this line</text>
    <text x="608" y="139" font-size="12.5" fill="var(--am)" font-weight="700">NO NETWORKED PLAY YET</text>

    <path d="M552 208 H576 Q596 208 596 190 V160" stroke="var(--a)" stroke-width="1.75" fill="none" marker-end="url(#pv-ah)"/>

    <text x="610" y="192" font-size="12.5" fill="var(--tx2)">Never crosses this line, ever:</text>
    <text x="610" y="212" font-size="12.5" fill="var(--a)" font-weight="700">— your camera picture</text>
    <text x="610" y="230" font-size="12.5" fill="var(--a)" font-weight="700">— your skeleton</text>
    <text x="610" y="248" font-size="12.5" fill="var(--a)" font-weight="700">— video of any kind</text>
  </g>
</svg>
</div>
<figcaption>Everything left of the dashed line runs on your machine and never checks in anywhere. Even once playing with a friend exists (it doesn't yet — see <a href="/projects/wibbly/docs/multiplayer">Multiplayer</a>), the only thing that would ever leave your device is that one small message — never your picture.</figcaption>
</figure>

## Why this is a guarantee, not a promise

A privacy policy is a promise a company can break. This is different: **there's simply no code
path that could send your camera anywhere**, the same way a calculator with no antenna can't leak
your sums. You can check this yourself — wibbly is free, open source, and the entire pipeline
described above is public in [`packages/wibbly-input`](https://github.com/vul-os/wibbly/tree/main/packages/wibbly-input).

It's also why wibbly needs no account, no sign-in, and no server to play solo tennis at all. There
is nowhere for your data to go, so nothing was built to send it there.

## What we removed to make that true

An earlier build of this game used to load Google Analytics tracking — standard for most web
apps, and directly at odds with a product whose whole pitch is "nobody's watching." **It's gone.**
No analytics SDK, no tracking pixel, no dependency on it anywhere in the codebase. Same with the
old hosted-deployment path: there's no vendor's cloud in the loop by default — the game is static
files you (or whoever you got the link from) can serve from any web server, with nothing else
required to run it.

## One honest distinction: privacy is not anti-cheat

This page is about who can *see* your camera: nobody. It's not a claim about whether a swing can
be proven genuine to another player — those are different questions with different answers.
Camera input can't currently be cryptographically verified the way a keyboard press can, which
only matters once playing against someone else over the internet exists. The full, honest
explanation of that boundary — and why it's a real limitation, not a corner we're cutting — is in
[How it works → Multiplayer & anti-cheat](/projects/wibbly/docs/multiplayer).

## Next

- [How to play](/projects/wibbly/docs/how-to-play) — how to actually play the game.
- [What's in it today](/projects/wibbly/docs/whats-in-it-today) — the honest inventory of what's built.
- [How it works](/projects/wibbly/docs/architecture) — the technical version of this page, with
  interfaces and data types.
