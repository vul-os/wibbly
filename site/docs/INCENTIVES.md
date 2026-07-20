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
