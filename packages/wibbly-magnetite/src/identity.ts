/**
 * Ed25519 signing for attested events — WebCrypto only, **zero dependencies**.
 *
 * What a signature here buys, precisely: it binds "the holder of this key sent
 * this event", which stops one player forging events in another player's name
 * and stops a relay editing them in flight. That is authorship.
 *
 * What it does not buy: any evidence that a camera saw anything. A cheater
 * signs their own fabricated events with their own genuine key and verifies
 * perfectly every time. See wire.ts and magnetite's
 * `a_plausible_synthetic_event_is_indistinguishable_from_a_real_one`.
 *
 * ── Availability, honestly ──────────────────────────────────────────────────
 * Ed25519 in WebCrypto is comparatively recent (Chrome/Edge 137+, Safari 17+,
 * Firefox 129+, Node 18+ behind a flag / 20+ unflagged) and is absent in older
 * engines and in insecure (non-HTTPS, non-localhost) contexts where
 * `crypto.subtle` is not exposed at all. {@link createEd25519Signer} therefore
 * **probes at runtime and returns `null`** rather than throwing or silently
 * substituting a weaker algorithm. The session then runs unsigned and says so.
 * We do not add a JS crypto library to paper over this.
 */

import { bytesToHex, hexToBytes } from './wire';

/** Signs the canonical preimage for an attested event. */
export interface AttestedSigner {
  /** 64-char lowercase hex Ed25519 public key — becomes `player` / `player_key`. */
  readonly publicKeyHex: string;
  /** Raw 64-byte Ed25519 signature over `message`. */
  sign(message: Uint8Array): Promise<Uint8Array>;
}

/** Whether this engine can do Ed25519 in WebCrypto right now. Never throws. */
export async function ed25519Available(): Promise<boolean> {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) return false;
  try {
    await subtle.generateKey({ name: 'Ed25519' } as AlgorithmIdentifier, true, ['sign', 'verify']);
    return true;
  } catch {
    return false;
  }
}

/**
 * A signer over a freshly generated keypair, or `null` when Ed25519 is
 * unavailable.
 *
 * A fresh identity every session means the host sees a new player key each
 * time, which is usually not what a game wants. To keep an identity across
 * sessions, persist a {@link generateEd25519Seed} seed *and its public key*
 * with your own storage and use {@link importEd25519Signer} — see the note
 * there for why both halves are needed.
 */
export async function createEd25519Signer(): Promise<AttestedSigner | null> {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) return null;

  try {
    const pair = (await subtle.generateKey({ name: 'Ed25519' } as AlgorithmIdentifier, true, [
      'sign',
      'verify',
    ])) as CryptoKeyPair;
    const publicKeyHex = bytesToHex(await exportRawPublicKey(subtle, pair.publicKey));
    const privateKey = pair.privateKey;
    return {
      publicKeyHex,
      async sign(message: Uint8Array): Promise<Uint8Array> {
        const sig = await subtle.sign(
          { name: 'Ed25519' } as AlgorithmIdentifier,
          privateKey,
          message as BufferSource,
        );
        return new Uint8Array(sig);
      },
    };
  } catch {
    // Any failure — algorithm unsupported, insecure context — degrades to
    // unsigned rather than to a weaker algorithm.
    return null;
  }
}

/**
 * Restore a persisted identity from a seed **and its public key**.
 *
 * WebCrypto cannot derive an Ed25519 public key from a PKCS#8 private key
 * without a userland Ed25519 implementation, and adding one would mean adding a
 * dependency. So persistence requires storing both halves. Returns `null` if
 * Ed25519 is unavailable or either half is malformed.
 */
export async function importEd25519Signer(
  seedHex: string,
  publicKeyHex: string,
): Promise<AttestedSigner | null> {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) return null;
  try {
    const seed = hexToBytes(seedHex, 32);
    hexToBytes(publicKeyHex, 32); // validate shape, fail here not at send time
    const privateKey = await subtle.importKey(
      'pkcs8',
      pkcs8FromSeed(seed) as BufferSource,
      { name: 'Ed25519' } as AlgorithmIdentifier,
      false,
      ['sign'],
    );
    return {
      publicKeyHex: publicKeyHex.toLowerCase(),
      async sign(message: Uint8Array): Promise<Uint8Array> {
        const sig = await subtle.sign(
          { name: 'Ed25519' } as AlgorithmIdentifier,
          privateKey,
          message as BufferSource,
        );
        return new Uint8Array(sig);
      },
    };
  } catch {
    return null;
  }
}

/** A fresh 32-byte seed, hex. Secret key material — store it accordingly. */
export function generateEd25519Seed(): string {
  const seed = new Uint8Array(32);
  globalThis.crypto.getRandomValues(seed);
  return bytesToHex(seed);
}

/**
 * Wrap a raw 32-byte Ed25519 seed in the fixed PKCS#8 DER envelope WebCrypto
 * requires for `importKey('pkcs8', …)`.
 *
 * The prefix is constant for Ed25519 (RFC 8410): SEQUENCE, version 0,
 * AlgorithmIdentifier { 1.3.101.112 }, OCTET STRING wrapping an OCTET STRING of
 * the 32-byte seed. Hand-rolling 16 constant bytes is cheaper and more auditable
 * than taking a DER dependency.
 */
function pkcs8FromSeed(seed: Uint8Array): Uint8Array {
  const prefix = Uint8Array.from([
    0x30, 0x2e, // SEQUENCE, 46 bytes
    0x02, 0x01, 0x00, // INTEGER version = 0
    0x30, 0x05, 0x06, 0x03, 0x2b, 0x65, 0x70, // AlgorithmIdentifier: OID 1.3.101.112 (Ed25519)
    0x04, 0x22, // OCTET STRING, 34 bytes
    0x04, 0x20, // …containing OCTET STRING, 32 bytes
  ]);
  const out = new Uint8Array(prefix.length + 32);
  out.set(prefix, 0);
  out.set(seed, prefix.length);
  return out;
}

/**
 * Export a public key as 32 raw bytes.
 *
 * `exportKey('raw', …)` for Ed25519 is not universally implemented, so fall
 * back to SPKI, whose Ed25519 form is a fixed 12-byte header followed by the
 * key — so the last 32 bytes are the key.
 */
async function exportRawPublicKey(subtle: SubtleCrypto, key: CryptoKey): Promise<Uint8Array> {
  try {
    const raw = new Uint8Array(await subtle.exportKey('raw', key));
    if (raw.length === 32) return raw;
  } catch {
    /* fall through to SPKI */
  }
  const spki = new Uint8Array(await subtle.exportKey('spki', key));
  if (spki.length < 32) throw new Error('unexpected Ed25519 SPKI length');
  return spki.slice(spki.length - 32);
}
