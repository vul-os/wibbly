# @vulos/wibbly-p2p

Wibbly's peer-to-peer multiplayer: one browser tab holds authority and runs
the simulation, a second tab's browser sends it gesture events over a WebRTC
`DataChannel`, and there is no server anywhere in the path. See
`site/docs/MULTIPLAYER.md` for the full design this package implements.

**Renamed from `@vulos/wibbly-magnetite`.** It began life adapting a wibbly
`GestureEvent` to a magnetite node's `AttestedEvent` wire format over a
WebSocket; that bridge is gone (see "What this used to be" below), the package
became pure WebRTC P2P with no magnetite code at all, and the old name no
longer described what was here. The rename fixes that. **The magnetite
integration now lives in [`@vulos/wibbly-authority`](../wibbly-authority)**,
which runs a real magnetite `AuthoritativeGame` compiled to wasm as a
client-side authority in the tab — the thing "wibbly is built on magnetite"
actually refers to. This package is not part of that path.

```ts
import { createHostOffer, createGuestAnswer, PeerSession } from '@vulos/wibbly-magnetite';

// Host: create an offer, hand `offerCode` to the guest as a link or QR code.
const host = await createHostOffer();
showToGuest(host.offerCode);

// ...guest scans/pastes it, sends back an answer code...
await host.applyAnswer(answerCodeFromGuest);

const hostSession = new PeerSession({
  transport: host.transport,
  limits: { expectedPlayerIds: ['player_2'], maxMessagesPerSec: 20 },
  onGestureEvent: (ev) => sim.applyGuestInput(ev),
});
await hostSession.connect();
setInterval(() => hostSession.broadcastState(sim.snapshot()), 1000 / 30);
```

```ts
// Guest: consume the host's offer code, send back an answer code.
const guest = await createGuestAnswer(offerCodeFromHost);
showToHost(guest.answerCode);

const guestSession = new PeerSession({
  transport: guest.transport,
  onState: (state) => renderer.apply(state),
});
await guestSession.connect();
wibblyInput.onGesture((ev) => guestSession.sendGesture(ev));
```

---

## Read this first

**Camera frames never leave the device.** Only recognised `GestureEvent`s
cross the `DataChannel` — a player id, a string, a float, a vector, a
timestamp: tens of bytes at gesture rate, versus roughly 250 MB/s for raw
1080p video at 30 fps. There is no code path in this package, or anywhere in
wibbly, that would send a frame. That is a real, specific privacy property,
and it is the one this package's whole design optimises for.

**That is not the same claim as "this is anonymous" or "nobody learns
anything about you."** Two separate things are true here, and conflating them
is the mistake this section exists to prevent:

- Video privacy: real, and load-bearing to wibbly's whole design.
- Network-layer privacy: **not provided, and cannot be provided by a direct
  peer connection.** Opening a `DataChannel` at all requires each side to
  exchange ICE candidates — drawn from that device's own local and
  STUN-reflexive network addresses — as part of the offer/answer, even when
  only STUN (never TURN) is used. The peer you connect to learns your IP
  address, and you learn theirs, the same way any other direct WebRTC call,
  P2P game, or plain old direct-connect multiplayer session would disclose
  it. This is a normal property of peer-to-peer networking, not a wibbly
  decision and not a bug — but shipping the "camera frames never leave the
  device" pitch without saying this next to it would be exactly the kind of
  overclaim this repo does not tolerate. See `src/webrtc.ts`'s module doc for
  where this is recorded next to the code that does it.

**Gesture input is still not verifiable, host-authoritative or not.** magnetite
classes camera gesture input `InputClass::Attested`: nondeterministic, and
never replay-checkable, at any point, ever. A signature only ever proved
*authorship* ("this key sent this event"), never *truth* ("a human body
actually moved") — a cheater who hand-writes numbers inside human bounds and
signs them with their own genuine key passes every check that exists, run by
anyone. **That is the actual reason this package runs with no server**, not a
cost-cutting measure dressed up as a principle: a rented authoritative server
receiving the exact same `GestureEvent` stream faces the exact same problem a
host's own browser tab faces, because the cheat surface is upstream of
authority, at the sensor. Centralizing does not move it. See
`site/docs/MULTIPLAYER.md`'s anti-cheat section for the full argument, and
`src/inbound-gate.ts` for what the rate-limit/sanity gate here does and does
not do (rate-limits, dedups, and authorizes which `playerId` a connection may
speak for — it does not, and cannot, verify that a swing was real).

---

## Two honest limitations, not papered over

**There is no free TURN relay.** STUN (used here, free, public) only tells a
peer its own reflexive address; it does not relay traffic. TURN is a relay
server, and running one is exactly the kind of ongoing operational surface
this package's whole zero-backend design exists to avoid — so there isn't
one. Consequences, precisely:

- Same-network play (same Wi-Fi/LAN) always works — no STUN or TURN is
  needed for peers that can already reach each other directly.
- STUN resolves the large majority of home and mobile connections against
  the public internet.
- A peer where **either** side sits behind symmetric NAT or carrier-grade NAT
  (CGNAT) will fail to open a `DataChannel`, with **no workaround** available
  from inside a browser tab. This is a real gap. `webrtc.ts`'s offer/answer
  helpers surface the resulting failure (a connection that never opens, or an
  ICE-gathering timeout) rather than hanging silently, but they cannot fix
  it.

**IP addresses are visible to your opponent.** Covered in full above — repeating
it here because it belongs on the same list as the TURN gap: both are
properties of doing this without a server, stated once, not hidden.

---

## What this used to be, and why it changed

This package began life bridging a wibbly `GestureEvent` to a persistent
**magnetite node** over a WebSocket: `AttestedEventAdapter` mapped a
`GestureEvent` onto magnetite's `AttestedEvent` wire shape byte-for-byte
(confirmed against a real Rust binary compiled against `magnetite-seams`),
`PreflightGate` mirrored the node's `PlausibilityGate`, and `MagnetiteSession`
optionally signed each event with WebCrypto Ed25519 so the node could verify
authorship.

That design assumed an authoritative *server* was worth having. It was
retired because the premise doesn't hold for this input class: see "Read this
first" above. If a host's own browser tab is exactly as authoritative as a
rented server, given camera input's unverifiability, then running a server
buys nothing wibbly's peer-to-peer design doesn't already have, at the cost
of being infrastructure someone has to operate — which contradicts wibbly's
whole position (free, no accounts, no payments, no backend to run). So the
package pivoted to WebRTC host-authority instead of continuing to build out
the node-bridge design.

Concretely, everything that existed only to talk to a magnetite node is gone:

- `adapter.ts` (`AttestedEventAdapter`) — mapped a `GestureEvent` onto
  magnetite's exact Rust wire shape, including `f32` rounding so a signature
  would verify against a server's recomputed preimage. No server, no preimage
  to match.
- `wire.ts`'s magnetite wire shape (`AttestedEventWire`, `ATTESTED_FRAME_TYPE`,
  the byte-for-byte signing preimage) — replaced by `message.ts`'s much
  simpler envelope, which only has to agree with itself (both ends run the
  same code).
- `identity.ts` (WebCrypto Ed25519 signing) — deleted outright, not replaced
  with a different signing scheme. This is a deliberate design decision, not
  an oversight: a signature over an event only ever proved "this connection
  sent this," and a `DataChannel` already gives that for free — the only peer
  that can be on the other end is the one this side exchanged SDP with, and
  there is no third party who could inject into an established channel. See
  `inbound-gate.ts`'s module doc for the fuller argument. What a signature
  never proved — a real arm in front of a real camera — is exactly what
  didn't change, so nothing was lost by dropping it.
- `preflight.ts` (`PreflightGate`) — reborn as `inbound-gate.ts`
  (`InboundGate`), but with a changed premise, not just a changed name: the
  old gate mirrored a stricter server and said outright it was "not a
  security boundary." The new one has no server behind it to defer to — it
  *is* the authority on what a peer's connection may say, so its module doc
  says the opposite: **this is the real defense now.**
- `transport.ts` (`MagnetiteTransport` / `clientTransport`) — the seam's
  shape survives (`connect`/`disconnect`/`send`/`isConnected`/`onOpen`/
  `onClose`/`onError`), with `onMessage` added because a peer connection is
  two-way on one channel where the old design only ever sent. The awkward
  part of the old adapter — reaching into a `_conn` because
  `MagnetiteClient` had no public raw-send — has no equivalent: an
  `RTCDataChannel`'s public API already covers everything this package
  needs.
- `session.ts` (`MagnetiteSession`) — replaced by `PeerSession`, which knows
  nothing about "host" or "guest" as a role; it moves gesture events and
  opaque state across a `PeerTransport` and validates everything inbound.

## Design

- `message.ts` — the wire envelope. Two message kinds: `gesture` (a guest's
  locally captured event, JSON-safe) and `state` (the host's simulation
  state, completely opaque to this package — it must be JSON-serializable
  and nothing more is asked of it). One per-connection sequence number,
  because a fresh `RTCDataChannel` is a fresh connection with nothing to
  persist across it.
- `inbound-gate.ts` — the real defense: rate limiting (flood protection),
  sequence dedup/reorder rejection, gesture field sanity (confidence range,
  timestamp skew, known `kind`s), and `playerId` authorization (a host binds
  each guest connection to the `playerId`(s) it assigned that guest, since
  the wire `playerId` is self-declared and otherwise unauthenticated).
- `codec.ts` — compresses (gzip, when `CompressionStream` is available;
  probed per call, not cached, so a test or an odd runtime can't get a stale
  answer) and base64url-encodes an SDP offer/answer into one string short
  enough for a link or QR code. Distinguishes the two encodings by a
  one-character prefix so decoding never has to guess.
- `webrtc.ts` — `createHostOffer` / `createGuestAnswer`: drives a real
  `RTCPeerConnection` through non-trickle ICE (wait for gathering to
  complete, then bake every candidate into one SDP blob, because there is no
  signalling channel to stream candidates over separately). Free public STUN;
  no TURN, deliberately (see above). Injectable `rtcFactory` so tests run
  with no real WebRTC.
- `transport.ts` — `PeerTransport`, the mocking seam, and
  `dataChannelTransport()` adapting a real (or faked) `RTCDataChannel` to it.
- `session.ts` — `PeerSession`: connect, send (`sendGesture` /
  `broadcastState`), receive (`onGestureEvent` / `onState`), degrade,
  teardown. Does not know tennis, or any other game, exists — `state` is
  whatever JSON-serializable value the game hands it.

Optional upgrade path, not built here: **[Trystero](https://github.com/dmotz/trystero)**
(MIT) can replace copy-paste/QR signalling with room-based matchmaking over
public BitTorrent trackers or Nostr relays — still no server wibbly operates.
Not a dependency of this package today.

## Tests

`npm test --workspace @vulos/wibbly-magnetite` — **70 tests**, vitest, node
environment, no camera, no DOM, no real WebRTC. Every WebRTC-shaped piece is
exercised through an injected fake:

- `message.test.ts` — `GestureEvent` ↔ wire round-tripping, JSON safety.
- `inbound-gate.test.ts` — malformed/oversized frames, flooding, duplicate
  and out-of-order sequence numbers, `playerId` authorization, gesture
  sanity (confidence, timestamp skew, kind allowlist), state messages
  correctly bypassing gesture-only checks.
- `codec.test.ts` — round-trips against this engine's *real*
  `CompressionStream` (Node has one; so does every browser wibbly targets),
  the uncompressed fallback with `CompressionStream` stubbed out, and a wide
  set of malformed connection codes (too short, bad base64, wrong format tag,
  not-actually-gzip bytes, not-JSON, missing fields, wrong `type`).
- `webrtc.test.ts` — offer/answer generation and consumption, ICE-gathering
  wait and timeout, rejecting a malformed or wrong-typed offer/answer code,
  and a fully wired fake host↔guest pair proving data actually flows in both
  directions end to end with zero real network involved.
- `session.test.ts` — status lifecycle, sending and receiving over a pair of
  mock transports wired directly together, a guest sending events for a
  `playerId` that is not theirs (rejected, no crash), flooding (rejected past
  the configured rate, no crash), out-of-order/duplicate sequence numbers
  arriving on the wire, malformed inbound frames, peer disconnect mid-game
  (drops sends while down, resumes cleanly after the channel reopens),
  transport errors reported without tearing the session down, and clean
  teardown.

**What none of this proves, and could not be proven without two real
machines behind real NATs:** that `createHostOffer`/`createGuestAnswer`
actually complete ICE negotiation against live STUN servers, that a
connection actually succeeds across two real home networks, or that the
symmetric-NAT/CGNAT failure mode described above actually manifests the way
this README says it does. The fakes in `webrtc.test.ts` model the
offer/answer/data-channel-handoff *shape* of a real `RTCPeerConnection`
faithfully, but they do not run real ICE, real STUN, or a real network — that
would require two machines on two real networks, one of them plausibly behind
CGNAT, which is outside what this test suite (or any single-machine CI job)
can exercise. Treat the connection-setup code as shape-verified, not
field-verified, until someone runs it between two real devices.
