# @vulos/wibbly-magnetite

The bridge from a wibbly `GestureEvent` (WIBBLY.md §3.3) to a magnetite session
(`magnetite-seams` §3.7 `InputProvider`).

```ts
import { MagnetiteSession } from '@vulos/wibbly-magnetite';

const session = new MagnetiteSession({ url: 'ws://127.0.0.1:9001' });
await session.connect();
wibbly.onGesture((ev) => session.submit(ev));   // fire-and-forget, never throws
// …
session.close();
```

---

## Read this first

**This input is client-attested. It is not verified, not replay-checkable, and
not anti-cheat.**

magnetite's moat is deterministic authoritative simulation: replay a log and you
can *prove* tampering. Camera gesture input cannot participate in that. It is a
nondeterministic sensor reading — the pixels that produced it are gone and were
never authoritative. magnetite classes it `InputClass::Attested` and states
plainly that it is "not replay-verifiable at any point, ever".

Concretely:

- **A signature proves authorship, not truth.** It binds "this key sent this
  event". It says nothing about whether a human body moved. A cheater signs
  their own fabricated events with their own genuine key and verifies every
  time.
- **Passing the plausibility gate means "not obviously impossible".** Nothing
  more. magnetite's own test
  `a_plausible_synthetic_event_is_indistinguishable_from_a_real_one` exists to
  pin that ceiling in code so it cannot be quietly forgotten. This package's
  pre-flight has a parallel test for the same reason.
- **Therefore:** never settle a wager, issue a competitive ranking, or make any
  other consequential decision from this input on the strength of a replay
  proof. `InputClass::is_replay_verifiable()` exists so that call can be made in
  code.

What *is* true and worth stating: **camera frames never leave the device.** Only
recognised gesture events are transmitted. That is a real privacy property. It
is not a security property.

---

## Status: UNVERIFIED against a magnetite ingress route

The wire encoding is verified against real Rust (see below). The *delivery* is
not, because there is nothing upstream to deliver to yet.

magnetite's `ClientNet` enum has exactly three variants — `Hello`, `Follow`,
`InputFrame`. **There is no attested-event variant and no server route that
accepts one.** `AttestedEventInput` is a Rust-side queue with no wire ingress
wired up to it, and `MagnetiteClient`'s public API (`connect`, `disconnect`,
`sendInput`, `onState`, `playerId`, `matchConfig`, `state`) has no method for
sending a frame that is not an `InputFrame`.

So `ATTESTED_FRAME_TYPE` (`"attested_event"`) is **a proposal from wibbly**, not
a shape magnetite agreed to. It follows the existing externally-tagged snake_case
`type` convention so that adding `ClientNet::AttestedEvent { signed }` upstream
would match it. Until that lands, a real magnetite node ignores these frames.

What was actually tested against a live server (`magnetite dev --path
game-template-authoritative --port 9001`, running locally on 2026-07-20):

| | Result |
|---|---|
| WebSocket connect to the node | ✅ opened |
| Node streamed `welcome` / `snapshot` / `delta` | ✅ 148 messages received |
| Session sent a signed attested frame | ✅ `{"sent":true,"seq":1}` |
| Node **ingested** the event | ❌ **no** — no route exists; the frame was ignored |
| Node closed the connection or errored on it | ✅ no — socket stayed open |

**The end-to-end input path is therefore UNVERIFIED AGAINST A LIVE SERVER.** The
bridge connects and transmits; nothing on the other side consumes it yet.

## How the wire shape was confirmed

Not by reading and hoping. A throwaway Rust binary was compiled against
`magnetite-seams` itself, and its output is baked into `test/wire.test.ts` as
golden vectors:

```rust
let id = RawKeypairAuth::from_seed([7u8; 32]);
let ev = AttestedEvent {
    player: id.pubkey(), kind: "swing".into(),
    confidence: 0.725_f32, vector: Some([0.125, -0.0625, 0.0]),
    speed_mps: Some(6.5), t_capture_ms: 1_763_000_000_123, seq: 42,
};
println!("{}", hex::encode(ev.signing_bytes()));
println!("{}", hex::encode(SignedAttestedEvent::sign(&id, ev.clone()).signing_bytes()));
println!("{}", serde_json::to_string(&ev).unwrap());
```

Both signing preimages produced by `src/wire.ts` match those hex strings
byte-for-byte, including the `None` tag bytes for absent `vector`/`speed_mps`.

Stronger still: JSON emitted by `MagnetiteSession` was fed back into that binary,
where it

1. deserialized into a real `SignedAttestedEvent`,
2. passed `SignedAttestedEvent::verify::<RawKeypairAuth>()` — the real Ed25519
   check, and
3. was admitted by a real `PlausibilityGate::default()`.

### The shape

```jsonc
{
  "type": "attested_event",          // ⚠ wibbly's proposal — not in ClientNet
  "signed": {
    "event": {
      "player":       "<64 hex>",    // PubKey has a hand-written hex Serialize
      "kind":         "swing",
      "confidence":   0.8,           // Rust f32
      "vector":       [x, y, z],     // or null — key ALWAYS present
      "speed_mps":    6.4,           // or null — key ALWAYS present
      "t_capture_ms": 1763000000123, // u64, capture time
      "seq":          1              // u64, strictly increasing per player
    },
    "player_key": "<64 hex>",        // must equal event.player
    "sig":        "<128 hex>"        // Ed25519 over the preimage below
  }
}
```

`vector` and `speed_mps` derive no `#[serde(default)]`, so omitting the key
fails to deserialize — `null` is required, not optional.

Signature preimage, exactly as Rust builds it (never from JSON):

```
"magnetite/input/attested/v1"
  ‖ player(32) ‖ u32le(len(kind)) ‖ kind ‖ f32le_bits(confidence)
  ‖ vector ? 0x01 ‖ f32le_bits(x,y,z) : 0x00
  ‖ speed  ? 0x01 ‖ f32le_bits(speed_mps) : 0x00
  ‖ u64le(t_capture_ms) ‖ u64le(seq)
  ‖ player_key(32)                     // yes, the key appears twice
```

**The f32 trap:** Rust reads these floats back as `f32`, so serde rounds to
single precision *before* recomputing the preimage. Signing the JS `f64` would
produce a signature that fails to verify on a value like `0.1`. Every float is
put through `Math.fround` before both signing and serialization.

---

## Signing

Ed25519 via WebCrypto, **zero new dependencies**. Availability is probed at
runtime (Chrome/Edge 137+, Safari 17+, Firefox 129+, Node 20+; absent in
insecure contexts where `crypto.subtle` is not exposed). When it is unavailable
`createEd25519Signer()` returns `null`, the session runs **unsigned**, and
`session.signed` reports `false`.

An unsigned event carries **no authorship binding whatsoever** — anyone able to
write to the socket can claim to be that player, and a relay can edit events in
flight. That is strictly weaker than the signed form, which was itself only ever
proof of authorship. Running unsigned requires an explicit `playerKeyHex`,
because `AttestedEvent.player` is mandatory and there is no sane placeholder.

Persisting an identity needs both the seed and the public key
(`importEd25519Signer`): WebCrypto cannot derive an Ed25519 public key from a
PKCS#8 private key, and adding a JS crypto library to work around that would
break the zero-dependency rule.

---

## The pre-flight is an optimisation, not a boundary

`PreflightGate` mirrors magnetite's `PlausibilityGate` — same limits, same
checks, same evaluation order, so a local rejection names the reason the server
would have named.

It runs in the player's browser, in code the player controls, and can be deleted
by them. **The server gate is the authority.** The pre-flight exists only so an
obviously-bad event does not burn a round trip or crowd the player's own honest
events out of the server's trailing-second rate budget.

It deliberately fails *open*: limits are the server defaults, so a host running
stricter limits will see events it rejects. That is correct — a client-side gate
stricter than the server would silently eat real player input, which is a much
worse failure than a wasted frame.

---

## Assumptions

1. **`speed_mps` is a guess about the room.** A monocular camera with no depth
   and no calibration cannot know how many metres a frame width spans; it
   depends on lens FOV and player distance. `SwingRecognizer` reports speed in
   normalized frame-widths per millisecond, which is dimensionless. The default
   `metresPerFrameWidth: 1.6` is chosen so an ordinary swing lands well inside
   magnetite's 20 m/s human ceiling, **not** because it was measured. Set
   `speedMps: false` to send `null` and decline to make the claim at all.
   Grounding this properly belongs in §3.5 `Calibration`, which already learns a
   reach envelope in normalized units.
2. **`vector` is passed through unscaled.** magnetite documents it only as a
   "direction/magnitude hint in game units"; wibbly's is a normalized
   image-space displacement. A host reading these must know they are normalized,
   not metres. `z` is `0` for 2D recognizers rather than invented.
3. **Sequence numbers never restart on reconnect.** The host's gate keeps a
   per-player high-water mark unless it calls `forget()`, so a restarted counter
   would get every event refused as `SequenceReplayed`. `resetSequence()` exists
   but is only correct after the host has forgotten the player.
4. **`clientTransport` reaches for `client._conn`.** magnetite's client exposes
   no public raw-send. A public `sendRaw` is preferred if a future version adds
   one; otherwise the `ConnectionManager` is used and the adapter throws a clear
   error rather than silently dropping events if neither exists. Delete this
   fallback when an upstream attested path lands.
5. **A pre-flight rejection still consumes a sequence number.** Harmless — the
   server requires sequence numbers to strictly increase, not to be gapless.

## Tests

`npm test --workspace @vulos/wibbly-magnetite` — 63 tests, vitest, node
environment, no camera, no DOM, no live server. The transport is the mocking
seam.
