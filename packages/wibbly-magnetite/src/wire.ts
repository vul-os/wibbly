/**
 * The wire shape of magnetite's `InputClass::Attested` events, mirrored in TS.
 *
 * SOURCE OF TRUTH: `magnetite/magnetite-seams/src/input.rs` (seam §3.7) and
 * `magnetite/magnetite-seams/src/identity.rs`. Every field name, type and byte
 * of the signing preimage below was read off those files, not guessed. If they
 * change, this file is wrong until it is changed too.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * HONESTY — read before using anything here
 *
 * These are **client-attested** events. The client asserts what its camera saw;
 * nobody can check it. They are `InputClass::Attested`, which magnetite defines
 * as *never* replay-verifiable, at any point, ever. A signature over one of
 * these proves **authorship** ("this key sent this"), never **truth** ("a human
 * body actually moved"). magnetite's own test
 * `a_plausible_synthetic_event_is_indistinguishable_from_a_real_one` pins that
 * ceiling in code: a cheater who hand-writes numbers inside human bounds and
 * signs them with their own genuine key passes every check that exists.
 *
 * Nothing in this package is security, verification, or anti-cheat. Do not
 * describe it as any of those.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ---------------------------------------------------------------------------
// serde shapes
// ---------------------------------------------------------------------------

/**
 * `magnetite_seams::input::AttestedEvent` as serde_json emits it.
 *
 * Rust derives plain `Serialize`/`Deserialize` with no rename or `default`
 * attributes, so:
 *   - field names are exactly the Rust identifiers (already snake_case);
 *   - `Option<T>` becomes `null`, and because there is **no `#[serde(default)]`**
 *     the key must still be PRESENT. `vector` and `speed_mps` are therefore
 *     always emitted, as `null` when absent — omitting them fails to deserialize.
 *   - `PubKey` is `[u8; 32]` with a hand-written `Serialize` that emits
 *     lowercase hex (identity.rs) — a 64-char string, NOT an array.
 */
export interface AttestedEventWire {
  /** 64-char lowercase hex Ed25519 public key. Whose event this *claims* to be. */
  player: string;
  /** Game-defined kind: `"swing"`, `"punch"`, … Rust `String`. */
  kind: string;
  /** Rust `f32`, 0.0..=1.0. Client-supplied, so a high value is not evidence. */
  confidence: number;
  /** Rust `Option<[f32; 3]>` — a 3-element array or `null`. Key always present. */
  vector: [number, number, number] | null;
  /** Rust `Option<f32>` metres/second, or `null`. Key always present. */
  speed_mps: number | null;
  /** Rust `u64`. CAPTURE time in unix ms — not detection time. */
  t_capture_ms: number;
  /** Rust `u64`. Per-player monotonic; the gate refuses non-increasing values. */
  seq: number;
}

/**
 * `magnetite_seams::input::SignedAttestedEvent` as serde_json emits it.
 *
 * `sig` is `[u8; 64]` with a hand-written hex `Serialize` — a 128-char string.
 */
export interface SignedAttestedEventWire {
  event: AttestedEventWire;
  /** Must equal `event.player`; `verify()` fails closed otherwise. */
  player_key: string;
  /** 128-char lowercase hex Ed25519 signature over {@link signedAttestedSigningBytes}. */
  sig: string;
}

// ---------------------------------------------------------------------------
// Domain separation
// ---------------------------------------------------------------------------

/**
 * `magnetite_seams::input::ATTESTED_DOMAIN` — `b"magnetite/input/attested/v1"`.
 *
 * Kept as the literal string plus a byte view so a test can assert both without
 * re-deriving one from the other.
 */
export const ATTESTED_DOMAIN = 'magnetite/input/attested/v1';

/** ASCII bytes of {@link ATTESTED_DOMAIN}. */
export const ATTESTED_DOMAIN_BYTES: Uint8Array = new TextEncoder().encode(ATTESTED_DOMAIN);

// ---------------------------------------------------------------------------
// Canonical signing bytes
// ---------------------------------------------------------------------------

/** Growable little-endian byte writer. Enough for this file; no dependency. */
class ByteWriter {
  private buf: number[] = [];

  bytes(b: Uint8Array): this {
    for (const x of b) this.buf.push(x);
    return this;
  }

  u8(v: number): this {
    this.buf.push(v & 0xff);
    return this;
  }

  /** `(len as u32).to_le_bytes()` then the bytes — magnetite's `push_bytes`. */
  lengthPrefixed(b: Uint8Array): this {
    const len = new Uint8Array(4);
    new DataView(len.buffer).setUint32(0, b.length, true);
    return this.bytes(len).bytes(b);
  }

  /** `f32::to_bits().to_le_bytes()` — the IEEE-754 bit pattern, little-endian. */
  f32bits(v: number): this {
    const out = new Uint8Array(4);
    new DataView(out.buffer).setFloat32(0, v, true);
    return this.bytes(out);
  }

  /** `u64::to_le_bytes()`. Values must be ≤ 2^53-1 (unix ms and seq both are). */
  u64(v: number): this {
    const out = new Uint8Array(8);
    new DataView(out.buffer).setBigUint64(0, BigInt(Math.trunc(v)), true);
    return this.bytes(out);
  }

  finish(): Uint8Array {
    return Uint8Array.from(this.buf);
  }
}

/**
 * `AttestedEvent::signing_bytes()`, byte-for-byte.
 *
 * Rust builds this field-by-field rather than from JSON so two peers on
 * different serde versions still agree. This is that same construction:
 *
 *   player (32 raw bytes)
 *   ‖ u32le(len(kind)) ‖ kind utf-8
 *   ‖ f32le_bits(confidence)
 *   ‖ vector: Some → 0x01 ‖ f32le_bits(x) ‖ f32le_bits(y) ‖ f32le_bits(z)
 *             None → 0x00
 *   ‖ speed:  Some → 0x01 ‖ f32le_bits(speed_mps)
 *             None → 0x00
 *   ‖ u64le(t_capture_ms)
 *   ‖ u64le(seq)
 *
 * NOTE the float trap: Rust reads these back as `f32`, so serde rounds whatever
 * JSON number arrives to single precision *before* recomputing these bytes. If
 * we signed the f64 value the recomputed preimage would differ and verification
 * would fail. {@link toF32} exists for that, and the adapter applies it to every
 * float before both signing and serialization.
 */
export function attestedSigningBytes(ev: AttestedEventWire): Uint8Array {
  const w = new ByteWriter();
  w.bytes(hexToBytes(ev.player, 32));
  w.lengthPrefixed(new TextEncoder().encode(ev.kind));
  w.f32bits(ev.confidence);
  if (ev.vector === null) {
    w.u8(0);
  } else {
    w.u8(1);
    for (const c of ev.vector) w.f32bits(c);
  }
  if (ev.speed_mps === null) {
    w.u8(0);
  } else {
    w.u8(1);
    w.f32bits(ev.speed_mps);
  }
  w.u64(ev.t_capture_ms);
  w.u64(ev.seq);
  return w.finish();
}

/**
 * `SignedAttestedEvent::payload()`, byte-for-byte — what `sig` actually covers.
 *
 *   ATTESTED_DOMAIN ‖ event.signing_bytes() ‖ player_key (32 raw bytes)
 *
 * The player key appears twice (once inside the event preimage, once appended).
 * That is what Rust does; do not "fix" it.
 */
export function signedAttestedSigningBytes(
  ev: AttestedEventWire,
  playerKeyHex: string,
): Uint8Array {
  const body = attestedSigningBytes(ev);
  const key = hexToBytes(playerKeyHex, 32);
  const out = new Uint8Array(ATTESTED_DOMAIN_BYTES.length + body.length + key.length);
  out.set(ATTESTED_DOMAIN_BYTES, 0);
  out.set(body, ATTESTED_DOMAIN_BYTES.length);
  out.set(key, ATTESTED_DOMAIN_BYTES.length + body.length);
  return out;
}

// ---------------------------------------------------------------------------
// Client → server envelope
// ---------------------------------------------------------------------------

/**
 * ⚠ **UNRATIFIED.** magnetite's `ClientNet` enum (magnetite-sdk protocol, used
 * by `magnetite-runtime/src/server.rs`) has exactly three variants today:
 * `Hello`, `Follow` and `InputFrame`. **There is no attested-event variant, and
 * no server route that would accept one.** `AttestedEventInput` is a Rust-side
 * queue with no wire ingress wired up to it.
 *
 * So this envelope is a *proposal from wibbly*, not a shape magnetite agreed to.
 * It follows the same convention as the frames that do exist — an externally
 * tagged `"type"` in snake_case — so that adding
 * `ClientNet::AttestedEvent { signed }` upstream would match it. Until that
 * lands, a real magnetite server will ignore or reject these frames.
 */
export const ATTESTED_FRAME_TYPE = 'attested_event';

/** Signed variant. `signed` deserializes directly as a `SignedAttestedEvent`. */
export interface AttestedFrameSigned {
  type: typeof ATTESTED_FRAME_TYPE;
  signed: SignedAttestedEventWire;
}

/**
 * Unsigned variant — used when no Ed25519 signer is available.
 *
 * An unsigned event carries **no authorship binding at all**: anyone able to
 * write to the socket can claim to be this player, and a relay can edit the
 * event in flight. It is strictly weaker than the signed form, which was itself
 * only ever proof of authorship. A host should treat this as untrusted input
 * from an unauthenticated source and may reasonably refuse it outright.
 */
export interface AttestedFrameUnsigned {
  type: typeof ATTESTED_FRAME_TYPE;
  event: AttestedEventWire;
}

export type AttestedFrame = AttestedFrameSigned | AttestedFrameUnsigned;

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

/**
 * Round to `f32` precision.
 *
 * Load-bearing: Rust types `confidence`, `vector` and `speed_mps` as `f32`, so
 * the server's recomputed signing preimage uses the single-precision value. We
 * must sign and send the same one.
 */
export function toF32(v: number): number {
  return Math.fround(v);
}

export function bytesToHex(b: Uint8Array): string {
  let s = '';
  for (const x of b) s += x.toString(16).padStart(2, '0');
  return s;
}

/** Parse lowercase-or-uppercase hex; throws if malformed or the wrong length. */
export function hexToBytes(hex: string, expectedLen?: number): Uint8Array {
  if (typeof hex !== 'string' || hex.length % 2 !== 0 || !/^[0-9a-fA-F]*$/.test(hex)) {
    throw new Error(`not hex: ${JSON.stringify(hex)}`);
  }
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  if (expectedLen !== undefined && out.length !== expectedLen) {
    throw new Error(`expected ${expectedLen} bytes of hex, got ${out.length}`);
  }
  return out;
}
