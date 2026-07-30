# Multiplayer & anti-cheat

> **Status, split two ways.** The *local* half is implemented: the tracker returns up to six
> skeletons and `SpatialBinder` gives them durable ids, under 29 unit tests — but nothing has been
> validated against real people in a real room, and tennis still drives one player. The *networked*
> half does not exist as code at all: no client, no transport, no signalling. What follows is the
> settled design — peer-to-peer, no backend wibbly runs — written down before it is built, so the
> boundary and its real limitations (no free TURN, and a peer sees your IP address by design) are
> agreed rather than discovered later.

There are two distinct problems here. Conflating them is the usual mistake.

<style>
.wbf{--a:#C4006B;--am:#8A4B00;--ok:#0F7A3D;--tx:#140F1B;--tx2:#544A61;--ln:#BEB2CD;--sf:#F5F1F9;--pg:#FFFFFF;margin:1.75rem 0}
:root[data-theme="dark"] .wbf{--a:#FF4D9D;--am:#FFB020;--ok:#3FE08A;--tx:#F5F1FA;--tx2:#ADA2BE;--ln:#3A2C52;--sf:#171122;--pg:#0E0A16}
.wbf>.sc{overflow-x:auto;border:1px solid var(--ln);border-radius:10px;background:var(--pg)}
.wbf svg{display:block;height:auto;width:100%;min-width:900px}
.wbf img{display:block;width:100%;height:auto}
.wbf figcaption{font-size:.82rem;line-height:1.65;color:var(--tx2);margin-top:.65rem}
.wbf figcaption b{color:var(--tx)}
</style>

## Local — same camera, 2–4 players

The differentiated, fun case, and the one that ships first. The input layer for it now exists.

It falls out of two things: `PoseTracker.maxPeople` returning up to six people, and `PlayerBinder`
giving those skeletons durable identity. MoveNet MultiPose makes it cheap because its cost curve is
flat — a fourth player in frame costs the same inference time as the first. See
[Model selection](/projects/wibbly/docs/models).

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

## Networked — different browsers, peer-to-peer, no backend

Each client runs its own tracker locally and transmits **`GestureEvent`s, not video**.

This is a privacy property worth stating loudly and precisely: *camera frames never leave the
device*. Not because of a policy, but because there is no code path that would send them, and no
latency budget that would tolerate one. A gesture event is a player id, a string, a float, a vector
and a timestamp — tens of bytes at gesture rate, versus roughly 250 MB/s for raw 1080p at 30 fps.

**The design, in full, is this:**

- **Host authority in the browser.** One player's tab is the authoritative simulation — the same
  role a dedicated server plays elsewhere, running instead on a participant's own machine.
- **Guest → host over a WebRTC `RTCDataChannel`.** A guest's tab runs its own `FrameSource` →
  `PoseTracker` → `GestureRecognizer` and sends only the resulting `GestureEvent`s to the host.
- **Host → guests, same channel.** The host broadcasts the resulting state back; guests render it.
- **Signalling costs nothing to run.** WebRTC peers still need to exchange one connection
  description each before a `DataChannel` opens, and wibbly runs no server to broker that exchange.
  Default: **copy-paste or a QR code** — one player generates a connection blob, sends it to the
  other by whatever channel they already have open, the other pastes it back. Optional:
  **[Trystero](https://github.com/dmotz/trystero)** (MIT), which signals over public BitTorrent
  trackers or Nostr relays instead of copy-paste — smoother, and still no server wibbly operates.
- **STUN is free and does most of the work.** Public STUN servers handle NAT traversal for the
  large majority of home and mobile connections at no cost.
- **WebRTC reveals your IP address to the other peer — plainly, by design.** ICE candidate
  exchange is how two browsers find a path to each other at all, and the candidates it gathers
  include your public IP. The STUN server sees it for the same reason, and so does the other
  player — the same as on any two-party WebRTC call, video chat included. This is not a
  wibbly-specific leak; it is what a direct peer connection *is*. The one mitigation is forcing
  all traffic through a TURN relay, which hides both peers' IPs behind the relay's instead — but
  that needs a TURN server to run, and, as above, wibbly does not provide one for free. Nothing
  here is built yet, so this is a disclosure ahead of the design, not a description of shipped
  behaviour.

<figure class="wbf">
<div class="sc">
<svg viewBox="0 0 900 300" width="900" role="img" aria-label="Peer-to-peer multiplayer design: two browser tabs, host and guest, each running a local camera pipeline that produces GestureEvents. A WebRTC DataChannel carries guest events to the host and host state back, opened after a one-time signalling exchange via copy-paste, QR code, or Trystero over public trackers. Free public STUN servers handle most NAT traversal. A separate warning box states that there is no free TURN relay, so peers behind symmetric NAT or carrier-grade NAT cannot connect, with no workaround, while same-network play always works.">
  <defs>
    <marker id="m-p2p-1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 z" fill="var(--ln)"/>
    </marker>
    <marker id="m-p2p-2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 z" fill="var(--a)"/>
    </marker>
  </defs>
  <g font-family="ui-monospace, monospace">
    <text x="14" y="20" font-size="10.5" font-weight="700" fill="var(--am)" letter-spacing="1.3">DESIGN — no networked play exists yet, this is the spec</text>

    <rect x="8" y="34" width="270" height="150" rx="10" fill="var(--sf)" stroke="var(--ln)" stroke-width="1.2"/>
    <text x="22" y="56" font-size="10.5" font-weight="700" fill="var(--tx)">HOST — authoritative</text>
    <text x="22" y="76" font-size="10.5" fill="var(--tx2)">Camera → tracker → recognizer</text>
    <text x="22" y="92" font-size="10.5" fill="var(--tx2)">runs the simulation</text>
    <text x="22" y="108" font-size="10.5" fill="var(--tx2)">applies its own +</text>
    <text x="22" y="122" font-size="10.5" fill="var(--tx2)">received GestureEvents</text>
    <text x="22" y="146" font-size="10.5" fill="var(--tx2)">broadcasts state back</text>
    <text x="22" y="160" font-size="10.5" fill="var(--tx2)">over the same channel</text>

    <rect x="622" y="34" width="270" height="150" rx="10" fill="var(--sf)" stroke="var(--ln)" stroke-width="1.2"/>
    <text x="636" y="56" font-size="10.5" font-weight="700" fill="var(--tx)">GUEST — renders only</text>
    <text x="636" y="76" font-size="10.5" fill="var(--tx2)">Camera → tracker → recognizer</text>
    <text x="636" y="92" font-size="10.5" fill="var(--tx2)">sends only GestureEvents</text>
    <text x="636" y="108" font-size="10.5" fill="var(--tx2)">— never video</text>
    <text x="636" y="132" font-size="10.5" fill="var(--tx2)">receives state from host,</text>
    <text x="636" y="146" font-size="10.5" fill="var(--tx2)">does not simulate itself</text>

    <rect x="322" y="52" width="256" height="56" rx="8" fill="none" stroke="var(--a)" stroke-width="1.4"/>
    <text x="336" y="74" font-size="11" font-weight="700" fill="var(--a)">RTCDataChannel</text>
    <text x="336" y="92" font-size="10.5" fill="var(--tx2)">GestureEvent ↔ state, ≈64 B/event</text>
    <path d="M278 76 H318" stroke="var(--a)" stroke-width="1.8" fill="none" marker-end="url(#m-p2p-2)"/>
    <path d="M582 76 H618" stroke="var(--a)" stroke-width="1.8" fill="none" marker-end="url(#m-p2p-2)"/>

    <rect x="322" y="122" width="256" height="62" rx="8" fill="var(--sf)" stroke="var(--ln)" stroke-dasharray="4 4"/>
    <text x="336" y="142" font-size="10.5" font-weight="700" fill="var(--tx2)">Signalling, once, to open it —</text>
    <text x="336" y="158" font-size="10.5" fill="var(--tx2)">copy-paste / QR (default) or</text>
    <text x="336" y="172" font-size="10.5" fill="var(--tx2)">Trystero (public trackers) — no server run</text>

    <rect x="150" y="204" width="600" height="34" rx="7" fill="var(--sf)" stroke="var(--ok)" stroke-width="1.3"/>
    <text x="450" y="226" font-size="10.5" font-weight="700" fill="var(--ok)" text-anchor="middle">FREE PUBLIC STUN — resolves most NAT traversal</text>

    <rect x="150" y="248" width="600" height="44" rx="7" fill="var(--am)" fill-opacity="0.08" stroke="var(--am)" stroke-width="1.4" stroke-dasharray="5 5"/>
    <text x="450" y="268" font-size="10.5" font-weight="700" fill="var(--am)" text-anchor="middle">NO FREE TURN — symmetric NAT / CGNAT peers cannot connect, no workaround</text>
    <text x="450" y="284" font-size="10.5" fill="var(--tx2)" text-anchor="middle">Same-network (same Wi-Fi/LAN) play is unaffected and always works</text>
  </g>
</svg>
</div>
<figcaption><b>Host authority sits in a browser tab, not a server.</b> A guest's `GestureEvent`s cross a `DataChannel` opened by a one-time, zero-infrastructure signalling exchange. Free STUN resolves most NAT situations; there is no free TURN, so the one honest gap — symmetric NAT or CGNAT on either side — has no workaround today.</figcaption>
</figure>

**Why this doesn't need a server, or a magnetite node, to be "real" multiplayer.** A rented,
always-on authoritative server was the earlier design here — signing `GestureEvent`s to a
persistent `magnetite dev` node over a WebSocket — and it was retired rather than built out,
because a rented server does not do anything for anti-cheat that a host's own browser tab doesn't:
see the next section for why. This peer-to-peer design (`packages/wibbly-p2p`) has **no magnetite
dependency at all** and needs none. It is a separate track from `@vulos/wibbly-authority` — the
real magnetite link, which runs a compiled magnetite game module client-side for solo tennis (see
[Architecture](/projects/wibbly/docs/architecture)) and has nothing to do with hosting a
second player's connection.

## The anti-cheat boundary — be honest about this

magnetite's replay verification assumes **deterministic input**: given the same inputs, the same
simulation produces the same result, so a replay can be re-executed and checked. That is the property
magnetite sells.

**Gesture input is a nondeterministic sensor stream and cannot be replay-verified.** Two runs of the
same model over the same camera will not necessarily agree, and there is no canonical "input" to
replay in the first place — only what one client's tracker happened to report.

**This is why a rented, authoritative server buys nothing here.** A dedicated server receiving the
exact same `GestureEvent` stream faces the exact same problem a host's browser tab faces: neither
has a canonical recording of "what the camera actually saw" to check a claimed event against.
Centralizing authority moves *where* the simulation runs; it does not move the cheat surface,
because the cheat surface is upstream of authority, at the sensor. That is the argument for
running wibbly's own multiplayer host-in-browser (previous section) rather than standing up a
server for it — the server would not have bought anything.

So gesture games run **client-attested**, whoever is authoritative:

- Whoever holds authority — a host's browser tab, or in principle a dedicated server — simulates
  over the `GestureEvent`s it receives.
- Events are **rate-limited** — you cannot swing forty times a second.
- Events are **plausibility-checked** — human-reachable velocities, respected cooldowns, positions
  inside a calibrated reach envelope. Magnetite calls this a `PlausibilityGate`.
- **A determined cheater can still synthesise events.** Nothing in the pipeline proves that a
  `GestureEvent` came from a real arm in front of a real camera.

That last bullet is the point of this page. It is documented rather than implied away, because a
guarantee wibbly cannot keep is worse than an honest limit. Competitive formats that need stronger
assurance need a different input class — or a referee, or in-person play, which camera games are
unusually well suited to anyway.

**One more distinction worth being precise about.** *Frames never leaving the device* is a
**privacy** property — nobody downstream, host or guest, ever receives your video. It is not a
**security** property: it says nothing about whether a given `GestureEvent` came from a real arm
in front of a real camera. Nothing on this page should be read as claiming gesture input provides
anti-cheat or verification of any kind — it provides privacy, and only privacy.

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
    <text x="14" y="20" font-size="10.5" font-weight="700" fill="var(--am)" letter-spacing="1.3">DESIGN — no networked play exists yet</text>
    <rect x="14" y="40" width="140" height="60" rx="8" fill="var(--sf)" stroke="var(--ln)"/>
    <text x="26" y="62" font-size="11" font-weight="700" fill="var(--tx)">Camera</text>
    <text x="26" y="80" font-size="10.5" fill="var(--tx2)">nondeterministic</text>
    <text x="26" y="92" font-size="10.5" fill="var(--tx2)">sensor stream</text>
    <rect x="188" y="40" width="150" height="60" rx="8" fill="var(--sf)" stroke="var(--ln)"/>
    <text x="200" y="62" font-size="11" font-weight="700" fill="var(--tx)">Client tracker</text>
    <text x="200" y="80" font-size="10.5" fill="var(--tx2)">+ recognizer</text>
    <text x="200" y="92" font-size="10.5" fill="var(--tx2)">on-device only</text>
    <rect x="372" y="40" width="120" height="60" rx="8" fill="none" stroke="var(--a)" stroke-width="1.4"/>
    <text x="384" y="66" font-size="11" font-weight="700" fill="var(--a)">GestureEvent</text>
    <text x="384" y="84" font-size="10.5" fill="var(--tx2)">rate + shape</text>
    <rect x="526" y="30" width="220" height="90" rx="8" fill="var(--sf)" stroke="var(--ln)" stroke-width="1.4"/>
    <text x="540" y="52" font-size="10.5" font-weight="700" fill="var(--tx)">Rate-limit +</text>
    <text x="540" y="68" font-size="10.5" font-weight="700" fill="var(--tx)">plausibility check</text>
    <text x="540" y="86" font-size="10.5" fill="var(--tx2)">velocity · cooldown ·</text>
    <text x="540" y="98" font-size="10.5" fill="var(--tx2)">reach envelope</text>
    <rect x="780" y="40" width="110" height="60" rx="8" fill="var(--sf)" stroke="var(--ok)" stroke-width="1.4"/>
    <text x="792" y="62" font-size="10.5" font-weight="700" fill="var(--tx)">Host</text>
    <text x="792" y="78" font-size="10.5" fill="var(--tx2)">simulates</text>
    <text x="792" y="92" font-size="10.5" fill="var(--tx2)">authoritatively</text>
    <g stroke="var(--ln)" stroke-width="1.6" fill="none" marker-end="url(#m-mp-3)">
      <path d="M154 70 H184"/>
      <path d="M338 70 H368"/>
      <path d="M492 70 H522"/>
      <path d="M746 75 H776"/>
    </g>
    <rect x="372" y="200" width="200" height="50" rx="8" fill="none" stroke="var(--am)" stroke-width="1.4" stroke-dasharray="5 5"/>
    <text x="386" y="222" font-size="10.5" font-weight="700" fill="var(--am)">synthesized events</text>
    <text x="386" y="240" font-size="10.5" fill="var(--tx2)">(a determined cheater)</text>
    <path d="M472 198 V122" stroke="var(--am)" stroke-width="1.8" fill="none" stroke-dasharray="5 4" marker-end="url(#m-mp-4)"/>
    <text x="482" y="170" font-size="10.5" font-weight="700" fill="var(--am)">indistinguishable from</text>
    <text x="482" y="184" font-size="10.5" font-weight="700" fill="var(--am)">real input at this gate</text>
  </g>
</svg>
</div>
<figcaption><b>The gate narrows the cheat surface; it does not close it.</b> Gesture input is a nondeterministic sensor stream, so there is no canonical input to replay-verify — a synthesised event that respects rate limits and plausible velocities is indistinguishable from a real swing. This is an honest limit, documented before any network code is written.</figcaption>
</figure>
