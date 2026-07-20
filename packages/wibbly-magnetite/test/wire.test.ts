/**
 * Golden vectors for the wire shape.
 *
 * These are NOT hand-written. Every expected value below was printed by a real
 * Rust program compiled against `magnetite-seams` at
 * `/Users/pc/code/vulos/magnetite/magnetite-seams`, calling
 * `AttestedEvent::signing_bytes()`, `SignedAttestedEvent::signing_bytes()` and
 * `serde_json::to_string()` on the same inputs constructed here. That is what
 * makes "the wire shape matches input.rs" a checked fact rather than a claim.
 *
 * The generating program is reproduced at the bottom of README.md so this can
 * be re-derived after an upstream change.
 */

import { describe, expect, it } from 'vitest';
import {
  ATTESTED_DOMAIN,
  ATTESTED_DOMAIN_BYTES,
  attestedSigningBytes,
  bytesToHex,
  hexToBytes,
  signedAttestedSigningBytes,
  toF32,
  type AttestedEventWire,
} from '../src/wire';

/** `RawKeypairAuth::from_seed([7u8; 32]).pubkey().to_hex()`. */
const PLAYER = 'ea4a6c63e29c520abef5507b132ec5f9954776aebebe7b92421eea691446d22c';

const GOLDEN: AttestedEventWire = {
  player: PLAYER,
  kind: 'swing',
  confidence: toF32(0.725),
  vector: [0.125, -0.0625, 0.0],
  speed_mps: 6.5,
  t_capture_ms: 1_763_000_000_123,
  seq: 42,
};

const GOLDEN_EVENT_BYTES =
  'ea4a6c63e29c520abef5507b132ec5f9954776aebebe7b92421eea691446d22c050000007377696e679a99393f0100' +
  '00003e000080bd00000000010000d0407b1efd7a9a0100002a00000000000000';

const GOLDEN_SIGNED_BYTES =
  '6d61676e65746974652f696e7075742f61747465737465642f7631' +
  GOLDEN_EVENT_BYTES +
  'ea4a6c63e29c520abef5507b132ec5f9954776aebebe7b92421eea691446d22c';

const GOLDEN_NONE_BYTES =
  'ea4a6c63e29c520abef5507b132ec5f9954776aebebe7b92421eea691446d22c050000007377696e679a99393f0000' +
  '7b1efd7a9a0100000100000000000000';

describe('ATTESTED_DOMAIN', () => {
  it('is byte-identical to the Rust constant', () => {
    // `pub const ATTESTED_DOMAIN: &[u8] = b"magnetite/input/attested/v1";`
    expect(ATTESTED_DOMAIN).toBe('magnetite/input/attested/v1');
    expect(bytesToHex(ATTESTED_DOMAIN_BYTES)).toBe(
      '6d61676e65746974652f696e7075742f61747465737465642f7631',
    );
  });
});

describe('attestedSigningBytes', () => {
  it('reproduces AttestedEvent::signing_bytes() byte-for-byte', () => {
    expect(bytesToHex(attestedSigningBytes(GOLDEN))).toBe(GOLDEN_EVENT_BYTES);
  });

  it('reproduces the None tag bytes for absent vector and speed', () => {
    const none: AttestedEventWire = { ...GOLDEN, vector: null, speed_mps: null, seq: 1 };
    expect(bytesToHex(attestedSigningBytes(none))).toBe(GOLDEN_NONE_BYTES);
  });

  it('length-prefixes kind with a u32 little-endian, as push_bytes does', () => {
    const bytes = attestedSigningBytes(GOLDEN);
    // 32 bytes of player key, then the u32 length of "swing".
    expect(Array.from(bytes.slice(32, 36))).toEqual([5, 0, 0, 0]);
    expect(new TextDecoder().decode(bytes.slice(36, 41))).toBe('swing');
  });

  it('changes when any covered field changes', () => {
    const base = bytesToHex(attestedSigningBytes(GOLDEN));
    for (const mutated of [
      { ...GOLDEN, seq: 43 },
      { ...GOLDEN, t_capture_ms: GOLDEN.t_capture_ms + 1 },
      { ...GOLDEN, confidence: toF32(0.726) },
      { ...GOLDEN, kind: 'punch' },
      { ...GOLDEN, speed_mps: 6.6 },
      { ...GOLDEN, vector: [0.125, -0.0625, 0.001] as [number, number, number] },
    ]) {
      expect(bytesToHex(attestedSigningBytes(mutated))).not.toBe(base);
    }
  });
});

describe('signedAttestedSigningBytes', () => {
  it('reproduces SignedAttestedEvent::signing_bytes() byte-for-byte', () => {
    expect(bytesToHex(signedAttestedSigningBytes(GOLDEN, PLAYER))).toBe(GOLDEN_SIGNED_BYTES);
  });

  it('is domain ‖ event bytes ‖ player key — the key appearing twice, as Rust does', () => {
    const out = signedAttestedSigningBytes(GOLDEN, PLAYER);
    expect(bytesToHex(out.slice(0, ATTESTED_DOMAIN_BYTES.length))).toBe(
      bytesToHex(ATTESTED_DOMAIN_BYTES),
    );
    expect(bytesToHex(out.slice(-32))).toBe(PLAYER);
  });
});

describe('toF32', () => {
  it('rounds to single precision so the server recomputes the same preimage', () => {
    // 0.1 is not representable in f32; signing the f64 would make the server's
    // recomputed bytes differ and verification fail.
    expect(toF32(0.1)).not.toBe(0.1);
    expect(toF32(0.1)).toBe(Math.fround(0.1));
    // Values that ARE exact in f32 pass through untouched.
    expect(toF32(0.125)).toBe(0.125);
  });
});

describe('hex helpers', () => {
  it('round-trips', () => {
    expect(bytesToHex(hexToBytes(PLAYER, 32))).toBe(PLAYER);
  });

  it('rejects malformed or wrong-length input rather than truncating', () => {
    expect(() => hexToBytes('zz')).toThrow();
    expect(() => hexToBytes('abc')).toThrow();
    expect(() => hexToBytes('abcd', 32)).toThrow();
  });
});
