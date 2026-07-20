# Developer incentives

> **Nothing here is built.** No payment path, no host-earns split, no tournament code exists in
> wibbly. This is the position, written down so the first monetisation decision is not made under
> deadline pressure.

A platform that wants third-party games has to answer one question: why would anybody build one? The
usual answer is ads. That answer is wrong here, and it is worth saying why rather than just declining.

## Why not ads

**Ad SDKs are central tracking brokers.** Integrating one contradicts the decentralization thesis and
Vulos's privacy posture in the same stroke — the whole argument for local inference collapses if the
page ships a beacon.

**The economics do not work at this scale.** Web-game CPMs are low and need volume wibbly does not
have and will not have soon.

**The format is hostile.** An interstitial in a game where the player is standing up, arms out, mid
rally, is not an interruption — it is an insult.

**In a binary it is worse.** Shipping an ad beacon inside a desktop application people installed
themselves is a different and larger breach of trust than a web page doing it.

## The ladder

Ordered by fit with what magnetite already has, so the cheapest rungs come first.

<style>
.wbf{--a:#C4006B;--am:#8A4B00;--ok:#0F7A3D;--tx:#140F1B;--tx2:#544A61;--ln:#BEB2CD;--sf:#F5F1F9;--pg:#FFFFFF;margin:1.75rem 0}
:root[data-theme="dark"] .wbf{--a:#FF4D9D;--am:#FFB020;--ok:#3FE08A;--tx:#F5F1FA;--tx2:#ADA2BE;--ln:#3A2C52;--sf:#171122;--pg:#0E0A16}
.wbf>.sc{overflow-x:auto;border:1px solid var(--ln);border-radius:10px;background:var(--pg)}
.wbf svg{display:block;height:auto;width:100%;min-width:620px}
.wbf img{display:block;width:100%;height:auto}
.wbf figcaption{font-size:.82rem;line-height:1.65;color:var(--tx2);margin-top:.65rem}
.wbf figcaption b{color:var(--tx)}
</style>

<figure class="wbf">
<div class="sc">
<svg viewBox="0 0 900 268" width="900" role="img" aria-label="The four-rung incentive ladder, drawn as ascending steps. Rung one is host-earns, which needs no new machinery. Rung two is non-custodial paid games and cosmetics. Rung three is tournaments with entry pools. Rung four is a bounty or patronage pool. None of the four is built.">
  <g font-family="ui-monospace, monospace">
    <text x="16" y="26" font-size="10" fill="var(--tx2)" letter-spacing="1.3">CHEAPEST RUNG FIRST — NONE OF THE FOUR IS BUILT</text>
    <rect x="14" y="196" width="206" height="48" rx="7" fill="var(--sf)" stroke="var(--ln)"/>
    <text x="30" y="216" font-size="11.5" font-weight="700" fill="var(--tx)">1 · Host-earns</text>
    <text x="30" y="233" font-size="9.5" fill="var(--tx2)">no new economic machinery</text>
    <rect x="236" y="146" width="206" height="48" rx="7" fill="var(--sf)" stroke="var(--ln)"/>
    <text x="252" y="166" font-size="11.5" font-weight="700" fill="var(--tx)">2 · Paid games</text>
    <text x="252" y="183" font-size="9.5" fill="var(--tx2)">non-custodial, low platform cut</text>
    <rect x="458" y="96" width="206" height="48" rx="7" fill="var(--sf)" stroke="var(--ln)"/>
    <text x="474" y="116" font-size="11.5" font-weight="700" fill="var(--tx)">3 · Tournaments</text>
    <text x="474" y="133" font-size="9.5" fill="var(--tx2)">the pool is the prize</text>
    <rect x="680" y="46" width="206" height="48" rx="7" fill="var(--sf)" stroke="var(--ln)"/>
    <text x="696" y="66" font-size="11.5" font-weight="700" fill="var(--tx)">4 · Bounty pool</text>
    <text x="696" y="83" font-size="9.5" fill="var(--tx2)">works before there is an audience</text>
    <g stroke="var(--ln)" stroke-width="1.5" fill="none">
      <path d="M220 208 H236"/>
      <path d="M442 158 H458"/>
      <path d="M664 108 H680"/>
    </g>
    <path d="M14 258 H886" stroke="var(--a)" stroke-width="1.3" stroke-dasharray="5 5"/>
    <text x="14" y="253" font-size="9.5" fill="var(--a)" font-weight="700">ADS SIT BELOW THIS LINE — DECLINED BY DEFAULT, AVAILABLE ONLY AS AN OPT-IN AdProvider SEAM</text>
  </g>
</svg>
</div>
<figcaption>Rungs 1 and 2 reuse payment machinery magnetite already has, which is why they come first. Rung 3 carries a real constraint: gesture input is <b>client-attested</b>, so high-stakes formats need a referee or in-person play. <b>No payment path, host-earns split or tournament code exists in wibbly today.</b></figcaption>
</figure>

1. **Host-earns.** magnetite already pays capacity providers. A popular gesture game generates
   sessions; a developer who also hosts earns from them. This requires no new economic machinery at
   all — only the `InputProvider` seam that gesture games need anyway.
2. **Non-custodial paid games and cosmetics.** The crypto payment seam exists in magnetite. A
   zero-to-low platform cut is a real differentiator against a 30% store, and non-custodial means
   wibbly never holds anyone's money.
3. **Tournaments with entry pools.** Camera games are inherently spectator-friendly and competitive —
   watching someone play is legible in a way watching someone hold a controller is not. The pool *is*
   the prize; no advertiser is required. Note the constraint from
   [Multiplayer & anti-cheat](/products/wibbly/docs/multiplayer): gesture input is client-attested,
   so high-stakes formats need a referee or in-person play.
4. **Bounty / patronage pool** for the first N games shipped against the SDK. The cheapest way to
   seed a library from zero, and the only rung that works before there is an audience.

## If ads are wanted anyway

Then an `AdProvider` seam, defaulting to `none`, opt-in per game. No developer should be forced to
ship a tracking beacon because the platform decided for them. That is the whole design: the default
is the position, and the seam is the escape hatch.
