# Multiplayer & anti-cheat

> **Status, split two ways.** The *local* half is implemented: the tracker returns up to six
> skeletons and `SpatialBinder` gives them durable ids, under 29 unit tests — but nothing has been
> validated against real people in a real room, and tennis still drives one player. The *networked*
> half does not exist: there is no client, no transport and no session code in wibbly at all. The
> anti-cheat section is written down before it is built, deliberately, so the boundary is agreed
> rather than discovered.

There are two distinct problems here. Conflating them is the usual mistake.

<style>
.wbf{--a:#C4006B;--am:#8A4B00;--ok:#0F7A3D;--tx:#140F1B;--tx2:#544A61;--ln:#BEB2CD;--sf:#F5F1F9;--pg:#FFFFFF;margin:1.75rem 0}
:root[data-theme="dark"] .wbf{--a:#FF4D9D;--am:#FFB020;--ok:#3FE08A;--tx:#F5F1FA;--tx2:#ADA2BE;--ln:#3A2C52;--sf:#171122;--pg:#0E0A16}
.wbf>.sc{overflow-x:auto;border:1px solid var(--ln);border-radius:10px;background:var(--pg)}
.wbf svg{display:block;height:auto;width:100%;min-width:620px}
.wbf img{display:block;width:100%;height:auto}
.wbf figcaption{font-size:.82rem;line-height:1.65;color:var(--tx2);margin-top:.65rem}
.wbf figcaption b{color:var(--tx)}
</style>

## Local — same camera, 2–4 players

The differentiated, fun case, and the one that ships first. The input layer for it now exists.

It falls out of two things: `PoseTracker.maxPeople` returning up to six people, and `PlayerBinder`
giving those skeletons durable identity. MoveNet MultiPose makes it cheap because its cost curve is
flat — a fourth player in frame costs the same inference time as the first. See
[Model selection](/products/wibbly/docs/models).

What makes it hard is not the model, it is the binding. A frame gives you six anonymous skeletons; a
game needs to know that the skeleton on the left is still player one after they ducked behind player
two. `SpatialBinder` does greedy nearest-centroid matching over torso centroids, with a per-player
claim zone and a forget timeout for occlusion. Claim zones are **sticky**: once you own one you keep
your id even after walking out of it, which is what stops two players swapping identity when they
cross.

Two honest caveats. First, the binder has 18 passing tests and zero minutes in front of a real camera
— occlusion and crossover are precisely where fixtures flatter an implementation. Second, the tennis
game is configured with two claim zones but reads gestures for `player_1` only, so a second person
cannot actually play yet. Wiring that up is the next task.

## Networked — different cameras

Each client runs its own tracker locally and transmits **`GestureEvent`s, not video**.

This is a privacy property worth stating loudly and precisely: *camera frames never leave the
device*. Not because of a policy, but because there is no code path that would send them, and no
latency budget that would tolerate one. A gesture event is a player id, a string, a float, a vector
and a timestamp — tens of bytes at gesture rate, versus roughly 250 MB/s for raw 1080p at 30 fps.

<figure class="wbf">
<div class="sc">
<svg viewBox="0 0 900 260" width="900" role="img" aria-label="On-device pipeline: camera captures a frame, MoveNet turns it into landmarks, the frame is discarded, and a recognizer emits a GestureEvent of about 64 bytes. Only that event is eligible to cross the network boundary. On the other side of the boundary is a dashed box labelled NOT BUILT, because no client, transport or session code exists in wibbly today.">
  <defs>
    <marker id="m-mp-1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 z" fill="var(--ln)"/>
    </marker>
    <marker id="m-mp-2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 z" fill="var(--am)"/>
    </marker>
  </defs>
  <g font-family="ui-monospace, monospace">
    <rect x="8" y="16" width="572" height="200" rx="10" fill="none" stroke="var(--a)" stroke-width="1.2" stroke-dasharray="6 6" opacity=".6"/>
    <text x="20" y="34" font-size="10" font-weight="700" fill="var(--a)" letter-spacing="1.3">YOUR DEVICE — IMPLEMENTED, SHIPPED</text>
    <rect x="26" y="70" width="140" height="70" rx="8" fill="var(--sf)" stroke="var(--ln)"/>
    <text x="40" y="92" font-size="11" font-weight="700" fill="var(--tx)">Camera</text>
    <text x="40" y="110" font-size="9.5" fill="var(--tx2)">getUserMedia</text>
    <text x="40" y="124" font-size="9.5" fill="var(--tx2)">frame ~8 MB</text>
    <rect x="200" y="70" width="150" height="70" rx="8" fill="var(--sf)" stroke="var(--ln)"/>
    <text x="214" y="92" font-size="11" font-weight="700" fill="var(--tx)">MoveNet</text>
    <text x="214" y="110" font-size="9.5" fill="var(--tx2)">MultiPose tracker</text>
    <text x="214" y="124" font-size="9.5" fill="var(--tx2)">→ Person[]</text>
    <rect x="200" y="150" width="150" height="30" rx="6" fill="none" stroke="var(--ln)" stroke-dasharray="4 4"/>
    <text x="214" y="169" font-size="9.5" fill="var(--tx2)">frame discarded here</text>
    <path d="M275 140 V148" stroke="var(--ln)" stroke-width="1.4" marker-end="url(#m-mp-1)"/>
    <rect x="374" y="70" width="150" height="70" rx="8" fill="none" stroke="var(--a)" stroke-width="1.4"/>
    <text x="388" y="92" font-size="11" font-weight="700" fill="var(--tx)">Recognizer</text>
    <text x="388" y="110" font-size="9.5" fill="var(--tx2)">detectSwing()</text>
    <text x="388" y="124" font-size="9.5" font-weight="700" fill="var(--a)">→ GestureEvent</text>
    <g stroke="var(--ln)" stroke-width="1.6" fill="none" marker-end="url(#m-mp-1)">
      <path d="M166 105 H196"/>
      <path d="M350 105 H370"/>
    </g>
    <line x1="595" y1="12" x2="595" y2="230" stroke="var(--tx2)" stroke-width="1.4" stroke-dasharray="3 5"/>
    <text x="595" y="10" font-size="9" fill="var(--tx2)" text-anchor="middle" letter-spacing="1.2">NETWORK BOUNDARY</text>
    <path d="M524 105 H605" stroke="var(--am)" stroke-width="1.8" fill="none" stroke-dasharray="5 4" marker-end="url(#m-mp-2)"/>
    <text x="524" y="94" font-size="9.5" font-weight="700" fill="var(--am)">GestureEvent ≈64 B</text>
    <text x="524" y="150" font-size="9" fill="var(--tx2)">the only thing eligible to cross</text>
    <rect x="620" y="46" width="270" height="128" rx="10" fill="none" stroke="var(--am)" stroke-width="1.4" stroke-dasharray="6 6"/>
    <text x="640" y="76" font-size="13" font-weight="700" fill="var(--am)">NOT BUILT</text>
    <text x="640" y="98" font-size="10" fill="var(--tx2)">no client</text>
    <text x="640" y="116" font-size="10" fill="var(--tx2)">no transport</text>
    <text x="640" y="134" font-size="10" fill="var(--tx2)">no session code</text>
    <text x="640" y="156" font-size="9.5" fill="var(--tx2)">this side of the line does not exist yet</text>
  </g>
</svg>
</div>
<figcaption><b>Camera frames never leave the device</b> — not as policy, but because nothing downstream of the discard point can send them. The dashed amber arrow is the only thing that could cross today's boundary, and there is nowhere on the other side for it to go: <b>no networked play exists.</b></figcaption>
</figure>

Session hosting, discovery and lobbies come from [magnetite](https://github.com/vul-os/magnetite)
through an `InputProvider` seam. That seam has not been added to magnetite, and no wibbly code talks
to magnetite today.

## The anti-cheat boundary — be honest about this

magnetite's replay verification assumes **deterministic input**: given the same inputs, the same
simulation produces the same result, so a replay can be re-executed and checked. That is the property
magnetite sells.

**Gesture input is a nondeterministic sensor stream and cannot be replay-verified.** Two runs of the
same model over the same camera will not necessarily agree, and there is no canonical "input" to
replay in the first place — only what one client's tracker happened to report.

So gesture games run **client-attested**:

- The host simulates authoritatively over the `GestureEvent`s it receives.
- Events are **rate-limited** — you cannot swing forty times a second.
- Events are **plausibility-checked** — human-reachable velocities, respected cooldowns, positions
  inside a calibrated reach envelope.
- **A determined cheater can still synthesise events.** Nothing in the pipeline proves that a
  `GestureEvent` came from a real arm in front of a real camera.

That last bullet is the point of this page. It is documented rather than implied away, because a
guarantee wibbly cannot keep is worse than an honest limit. Competitive formats that need stronger
assurance need a different input class — or a referee, or in-person play, which camera games are
unusually well suited to anyway.

<figure class="wbf">
<div class="sc">
<svg viewBox="0 0 900 300" width="900" role="img" aria-label="Anti-cheat design, not yet implemented: a camera feeds a client-side tracker and recognizer, producing a GestureEvent that passes through a rate-limit and plausibility-check gate before a host simulates authoritatively. A second, dashed path shows synthesized events entering the same gate directly, labelled as indistinguishable from real input once past the camera — the gate narrows but does not close this gap.">
  <defs>
    <marker id="m-mp-3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 z" fill="var(--ln)"/>
    </marker>
    <marker id="m-mp-4" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 z" fill="var(--am)"/>
    </marker>
  </defs>
  <g font-family="ui-monospace, monospace">
    <text x="14" y="20" font-size="10" font-weight="700" fill="var(--am)" letter-spacing="1.3">DESIGN — no networked play exists yet</text>
    <rect x="14" y="40" width="140" height="60" rx="8" fill="var(--sf)" stroke="var(--ln)"/>
    <text x="26" y="62" font-size="11" font-weight="700" fill="var(--tx)">Camera</text>
    <text x="26" y="80" font-size="9.5" fill="var(--tx2)">nondeterministic</text>
    <text x="26" y="92" font-size="9.5" fill="var(--tx2)">sensor stream</text>
    <rect x="188" y="40" width="150" height="60" rx="8" fill="var(--sf)" stroke="var(--ln)"/>
    <text x="200" y="62" font-size="11" font-weight="700" fill="var(--tx)">Client tracker</text>
    <text x="200" y="80" font-size="9.5" fill="var(--tx2)">+ recognizer</text>
    <text x="200" y="92" font-size="9.5" fill="var(--tx2)">on-device only</text>
    <rect x="372" y="40" width="120" height="60" rx="8" fill="none" stroke="var(--a)" stroke-width="1.4"/>
    <text x="384" y="66" font-size="11" font-weight="700" fill="var(--a)">GestureEvent</text>
    <text x="384" y="84" font-size="9.5" fill="var(--tx2)">rate + shape</text>
    <rect x="526" y="30" width="220" height="90" rx="8" fill="var(--sf)" stroke="var(--ln)" stroke-width="1.4"/>
    <text x="540" y="52" font-size="10.5" font-weight="700" fill="var(--tx)">Rate-limit +</text>
    <text x="540" y="68" font-size="10.5" font-weight="700" fill="var(--tx)">plausibility check</text>
    <text x="540" y="86" font-size="9" fill="var(--tx2)">velocity · cooldown ·</text>
    <text x="540" y="98" font-size="9" fill="var(--tx2)">reach envelope</text>
    <rect x="780" y="40" width="110" height="60" rx="8" fill="var(--sf)" stroke="var(--ok)" stroke-width="1.4"/>
    <text x="792" y="62" font-size="10.5" font-weight="700" fill="var(--tx)">Host</text>
    <text x="792" y="78" font-size="9.5" fill="var(--tx2)">simulates</text>
    <text x="792" y="92" font-size="9.5" fill="var(--tx2)">authoritatively</text>
    <g stroke="var(--ln)" stroke-width="1.6" fill="none" marker-end="url(#m-mp-3)">
      <path d="M154 70 H184"/>
      <path d="M338 70 H368"/>
      <path d="M492 70 H522"/>
      <path d="M746 75 H776"/>
    </g>
    <rect x="372" y="200" width="200" height="50" rx="8" fill="none" stroke="var(--am)" stroke-width="1.4" stroke-dasharray="5 5"/>
    <text x="386" y="222" font-size="10.5" font-weight="700" fill="var(--am)">synthesized events</text>
    <text x="386" y="240" font-size="9.5" fill="var(--tx2)">(a determined cheater)</text>
    <path d="M472 198 V122" stroke="var(--am)" stroke-width="1.8" fill="none" stroke-dasharray="5 4" marker-end="url(#m-mp-4)"/>
    <text x="482" y="170" font-size="9.5" font-weight="700" fill="var(--am)">indistinguishable from</text>
    <text x="482" y="184" font-size="9.5" font-weight="700" fill="var(--am)">real input at this gate</text>
  </g>
</svg>
</div>
<figcaption><b>The gate narrows the cheat surface; it does not close it.</b> Gesture input is a nondeterministic sensor stream, so there is no canonical input to replay-verify — a synthesised event that respects rate limits and plausible velocities is indistinguishable from a real swing. This is an honest limit, documented before any network code is written.</figcaption>
</figure>
