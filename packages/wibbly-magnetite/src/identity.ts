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
 *
 * The floor is set by Chrome/Edge, and it is recent: Ed25519 sat behind the
 * `WebCryptoEd25519` flag (experimental-web-platform-features) until **137**,
 * May 2025, held back over small-order-point handling — while Safari had it in
 * 17 (Sep 2023) and Firefox in 129/130 (Aug 2024). So the browser most likely
 * to lack this is not the one folklore would predict, which is the whole
 * argument for detecting instead of assuming.
 *
 * ── Why availability is probed by USE, not by capability ────────────────────
 * `generateKey` resolving does not establish that `sign` works. They are
 * separately implemented, and a probe that stops at key generation is a probe
 * that can return `true` on an engine which cannot sign.
 *
 * This is defence against a *class* of failure rather than a specific engine
 * known to exhibit it — I could not find a documented engine that generates
 * Ed25519 keys but rejects Ed25519 `sign`. The reason to probe anyway is the
 * cost asymmetry: the probe is one signature at startup, whereas the failure it
 * catches surfaces on the player's FIRST SWING, as a dropped event, mid-rally,
 * once per swing, forever — with no way left to report it as a degradation
 * because the session has already committed to being signed.
 *
 * ── Signatures are NOT byte-stable across engines ───────────────────────────
 * RFC 8032 Ed25519 is deterministic, but **Safari deliberately randomises
 * signatures** (per draft-irtf-cfrg-det-sigs-with-noise). Signing the same
 * bytes with the same key twice yields two different valid signatures there.
 *
 * That is fine for what this module is for — verification is unaffected, and
 * the host only ever verifies. It is NOT fine for anything that treats a
 * signature as an identifier: content addressing, dedup keys, replay detection
 * keyed on `sig`, or a test fixture with a hardcoded signature would all pass
 * on Chrome and Firefox and fail on Safari. Nothing here does that, and nothing
 * downstream should start.
 *
 * So both functions here run a **full round trip** (generate → export → sign)
 * before returning a signer, and return `null` if any step fails. A signer that
 * this module hands back has demonstrably signed something already.
 *
 * ── Unsigned is a supported state, not a failure ────────────────────────────
 * Degrading to unsigned is legitimate — but it must never be quiet, because an
 * unsigned event carries NO authorship binding whatsoever (see wire.ts). Every
 * `null` returned below is reported through {@link onIdentityDegraded}, which
 * defaults to a console warning, and the reason is stated. `MagnetiteSession`
 * separately exposes `.signed`. Nothing here upgrades, downgrades, or relabels
 * what a signature means.
 */

import { bytesToHex, hexToBytes } from './wire';

/**
 * Where "we could not sign" gets reported.
 *
 * Defaults to a console warning. Replace it to route into your own telemetry
 * or UI — but replacing it with a no-op means shipping silently unsigned, which
 * is exactly the outcome this module exists to prevent.
 */
export let onIdentityDegraded: (reason: string) => void = (reason) => {
  console.warn(
    '[wibbly-magnetite] Ed25519 signing unavailable — events will be sent UNSIGNED and carry ' +
      'no authorship binding. Reason: %s',
    reason,
  );
};

/** Override the degradation reporter. Pass nothing to restore the default. */
export function setIdentityDegradedReporter(fn?: (reason: string) => void): void {
  onIdentityDegraded =
    fn ??
    ((reason) =>
      console.warn(
        '[wibbly-magnetite] Ed25519 signing unavailable — events will be sent UNSIGNED and ' +
          'carry no authorship binding. Reason: %s',
        reason,
      ));
}

/** Compact, non-throwing description of a caught value, for the reason string. */
function describe(err: unknown): string {
  if (err instanceof Error) return `${err.name}: ${err.message}`;
  return String(err);
}

/**
 * Prove a private key can actually produce a signature of the right shape.
 *
 * Ed25519 signatures are fixed at 64 bytes (RFC 8032), so a wrong length means
 * the engine did something other than what we asked — treat it as unusable
 * rather than emitting a signature that will fail verification at the host.
 */
async function proveCanSign(subtle: SubtleCrypto, privateKey: CryptoKey): Promise<void> {
  const probe = new Uint8Array([0x77, 0x69, 0x62, 0x62, 0x6c, 0x79]); // "wibbly"
  const sig = await subtle.sign(
    { name: 'Ed25519' } as AlgorithmIdentifier,
    privateKey,
    probe as BufferSource,
  );
  if (sig.byteLength !== 64) {
    throw new Error(`Ed25519 signature was ${sig.byteLength} bytes, expected 64`);
  }
}

/** Signs the canonical preimage for an attested event. */
export interface AttestedSigner {
  /** 64-char lowercase hex Ed25519 public key — becomes `player` / `player_key`. */
  readonly publicKeyHex: string;
  /** Raw 64-byte Ed25519 signature over `message`. */
  sign(message: Uint8Array): Promise<Uint8Array>;
}

/**
 * Whether this engine can do Ed25519 in WebCrypto right now. Never throws.
 *
 * Answers by doing the whole job — generate, export the public key, sign — not
 * by asking whether `generateKey` resolves. See the module note: those steps
 * fail independently on real engines, so a narrower probe returns `true` on
 * engines where signing does not work.
 */
export async function ed25519Available(): Promise<boolean> {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) return false;
  try {
    const pair = (await subtle.generateKey({ name: 'Ed25519' } as AlgorithmIdentifier, true, [
      'sign',
      'verify',
    ])) as CryptoKeyPair;
    await exportRawPublicKey(subtle, pair.publicKey);
    await proveCanSign(subtle, pair.privateKey);
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
  if (!subtle) {
    onIdentityDegraded(
      'crypto.subtle is not exposed. WebCrypto is restricted to secure contexts, so this is ' +
        'the expected result on a plain-http origin that is not localhost.',
    );
    return null;
  }

  try {
    const pair = (await subtle.generateKey({ name: 'Ed25519' } as AlgorithmIdentifier, true, [
      'sign',
      'verify',
    ])) as CryptoKeyPair;
    const publicKeyHex = bytesToHex(await exportRawPublicKey(subtle, pair.publicKey));
    const privateKey = pair.privateKey;

    // Sign something now, while we can still report it. A keypair that
    // generates but cannot sign would otherwise fail on the first swing.
    await proveCanSign(subtle, privateKey);

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
  } catch (err) {
    // Any failure — algorithm unsupported, raw export unimplemented, signing
    // rejected, insecure context — degrades to unsigned rather than to a
    // weaker algorithm. Reported, never swallowed.
    onIdentityDegraded(describe(err));
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
  if (!subtle) {
    onIdentityDegraded('crypto.subtle is not exposed (insecure context?); cannot restore identity.');
    return null;
  }
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

    // Same reasoning as createEd25519Signer: importKey resolving does not
    // establish that sign works. `pkcs8` import and `sign` are separate
    // implementations and can diverge.
    await proveCanSign(subtle, privateKey);

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
  } catch (err) {
    onIdentityDegraded(describe(err));
    return null;
  }
}

/**
 * A fresh 32-byte seed, hex. Secret key material — store it accordingly.
 *
 * Throws rather than degrading, and that is deliberate: there is no honest
 * fallback for a CSPRNG. `Math.random` is not one, and returning a predictable
 * seed would produce an identity that *looks* real. `crypto.getRandomValues` is
 * available far more widely than `crypto.subtle` — notably it is NOT restricted
 * to secure contexts — so this failing at all means something is very wrong.
 */
export function generateEd25519Seed(): string {
  const getRandomValues = globalThis.crypto?.getRandomValues;
  if (typeof getRandomValues !== 'function') {
    throw new Error(
      'crypto.getRandomValues is unavailable; refusing to generate key material without a CSPRNG',
    );
  }
  const seed = new Uint8Array(32);
  getRandomValues.call(globalThis.crypto, seed);
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
 * `exportKey('raw', publicKey)` for Ed25519 is, as far as I could establish,
 * supported by every engine that implements Ed25519 at all — the SPKI path
 * below is therefore **not known to be needed by any shipping browser**, and
 * this comment previously implied otherwise. It is kept because it is four
 * lines and turns a hypothetical hard failure into a working key, not because
 * a specific engine requires it.
 *
 * (Raw export of a PRIVATE key throws everywhere, by spec, with different error
 * names per engine — which is why persistence uses `pkcs8` and never branches
 * on an error name.)
 *
 * SPKI for Ed25519 is a fixed 12-byte header followed by the key, so the last
 * 32 bytes are the key.
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
