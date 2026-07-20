import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  createEd25519Signer,
  ed25519Available,
  generateEd25519Seed,
  importEd25519Signer,
  setIdentityDegradedReporter,
} from '../src/identity';

/**
 * Ed25519 in WebCrypto is three separately-implemented operations —
 * generateKey, sign, and export of the public key — and this module refuses to
 * hand back a signer unless all three demonstrably work.
 *
 * These tests drive `crypto.subtle` fakes that fail at each point
 * independently. That is the only way to cover them: the machine running this
 * suite either supports Ed25519 fully or not at all, so it exercises exactly
 * one path and leaves every degradation branch untested.
 *
 * To be clear about what is and is not evidenced: no shipping browser is known
 * to generate Ed25519 keys and then fail to sign with them. These branches
 * guard a plausible failure shape, not an observed one. What IS observed is
 * that the support floor is recent and uneven (Chrome 137 / May 2025, Safari 17,
 * Firefox 129) — so the unsupported path is live, and it must degrade loudly.
 */

afterEach(() => {
  vi.unstubAllGlobals();
  setIdentityDegradedReporter();
});

/** Capture what got reported while `fn` runs. */
async function reported<T>(fn: () => Promise<T>): Promise<{ result: T; reasons: string[] }> {
  const reasons: string[] = [];
  setIdentityDegradedReporter((r) => reasons.push(r));
  const result = await fn();
  setIdentityDegradedReporter();
  return { result, reasons };
}

const FAKE_PUBLIC = new Uint8Array(32).fill(7);

/**
 * A `crypto.subtle` stand-in whose three interesting operations fail
 * independently. Defaults to a fully working engine.
 */
function fakeSubtle(
  over: {
    generateKey?: () => Promise<unknown>;
    sign?: () => Promise<ArrayBuffer>;
    exportKey?: (format: string) => Promise<ArrayBuffer>;
    importKey?: () => Promise<unknown>;
  } = {},
) {
  return {
    generateKey:
      over.generateKey ?? (async () => ({ publicKey: {}, privateKey: {} })),
    sign: over.sign ?? (async () => new Uint8Array(64).buffer),
    exportKey:
      over.exportKey ??
      (async (format: string) => {
        if (format === 'raw') return FAKE_PUBLIC.buffer.slice(0);
        throw new Error('unsupported format');
      }),
    importKey: over.importKey ?? (async () => ({})),
  };
}

function stubCrypto(subtle: unknown) {
  vi.stubGlobal('crypto', {
    subtle,
    getRandomValues: (a: Uint8Array) => a,
  });
}

/* ── the partial-failure case, which is the whole point ───────────────────── */

describe('createEd25519Signer — partial WebCrypto support', () => {
  it('returns null when generateKey succeeds but sign throws', async () => {
    // The dangerous case: without a startup probe this signer is accepted and
    // fails on the player's FIRST SWING, once per swing, mid-rally, forever.
    stubCrypto(
      fakeSubtle({
        sign: async () => {
          throw new Error('NotSupportedError');
        },
      }),
    );
    const { result, reasons } = await reported(() => createEd25519Signer());
    expect(result).toBeNull();
    expect(reasons).toHaveLength(1);
    expect(reasons[0]).toMatch(/NotSupportedError/);
  });

  it('returns null when the engine produces a wrong-length signature', async () => {
    // Ed25519 signatures are fixed at 64 bytes (RFC 8032). Anything else would
    // be emitted and then fail verification at the host, which reads as a
    // cheating client rather than as a broken browser.
    stubCrypto(fakeSubtle({ sign: async () => new Uint8Array(32).buffer }));
    const { result, reasons } = await reported(() => createEd25519Signer());
    expect(result).toBeNull();
    expect(reasons[0]).toMatch(/32 bytes, expected 64/);
  });

  it('returns null when the public key cannot be exported at all', async () => {
    stubCrypto(
      fakeSubtle({
        exportKey: async () => {
          throw new Error('NotSupportedError: OKP export');
        },
      }),
    );
    const { result } = await reported(() => createEd25519Signer());
    expect(result).toBeNull();
  });

  it('falls back to SPKI when raw export of the public key is unimplemented', async () => {
    // No shipping engine is known to need this — raw export of an Ed25519
    // PUBLIC key appears universal. The fallback exists so that an engine which
    // refused 'raw' would still yield a working signer instead of a null one,
    // and this test is what stops the untrodden path from rotting.
    // SPKI for Ed25519 is a fixed 12-byte header plus the key.
    const spki = new Uint8Array(44);
    spki.set(FAKE_PUBLIC, 12);
    stubCrypto(
      fakeSubtle({
        exportKey: async (format: string) => {
          if (format === 'raw') throw new Error('raw is not supported for this key');
          return spki.buffer.slice(0);
        },
      }),
    );
    const { result, reasons } = await reported(() => createEd25519Signer());
    expect(result).not.toBeNull();
    expect(result!.publicKeyHex).toBe('07'.repeat(32));
    expect(reasons).toHaveLength(0); // this is a supported path, not a degradation
  });

  it('rejects a raw export of the wrong length rather than trusting it', async () => {
    stubCrypto(fakeSubtle({ exportKey: async () => new Uint8Array(16).buffer }));
    const { result } = await reported(() => createEd25519Signer());
    expect(result).toBeNull();
  });
});

/* ── unavailability is reported, never silent ─────────────────────────────── */

describe('createEd25519Signer — degradation is announced', () => {
  it('reports when crypto.subtle is absent, naming the likely cause', async () => {
    vi.stubGlobal('crypto', { getRandomValues: (a: Uint8Array) => a });
    const { result, reasons } = await reported(() => createEd25519Signer());
    expect(result).toBeNull();
    expect(reasons).toHaveLength(1);
    expect(reasons[0]).toMatch(/secure context/i);
  });

  it('reports when the algorithm itself is unsupported', async () => {
    stubCrypto(
      fakeSubtle({
        generateKey: async () => {
          throw new Error('NotSupportedError: Ed25519');
        },
      }),
    );
    const { result, reasons } = await reported(() => createEd25519Signer());
    expect(result).toBeNull();
    expect(reasons[0]).toMatch(/Ed25519/);
  });

  it('warns on the console by default, so a silent unsigned session is impossible', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      stubCrypto(
        fakeSubtle({
          generateKey: async () => {
            throw new Error('nope');
          },
        }),
      );
      expect(await createEd25519Signer()).toBeNull();
      expect(warn).toHaveBeenCalledTimes(1);
      // An unsigned event carries no authorship binding; the default message
      // must say so rather than implying a lesser degree of security.
      expect(String(warn.mock.calls[0][0])).toMatch(/UNSIGNED/);
      expect(String(warn.mock.calls[0][0])).toMatch(/no authorship binding/i);
    } finally {
      warn.mockRestore();
    }
  });

  it('says nothing when signing works', async () => {
    stubCrypto(fakeSubtle());
    const { result, reasons } = await reported(() => createEd25519Signer());
    expect(result).not.toBeNull();
    expect(reasons).toHaveLength(0);
  });
});

/* ── ed25519Available agrees with createEd25519Signer ─────────────────────── */

describe('ed25519Available', () => {
  it('is false when sign is broken, even though generateKey works', async () => {
    stubCrypto(
      fakeSubtle({
        sign: async () => {
          throw new Error('no');
        },
      }),
    );
    expect(await ed25519Available()).toBe(false);
  });

  it('is false when the public key cannot be exported', async () => {
    stubCrypto(
      fakeSubtle({
        exportKey: async () => {
          throw new Error('no');
        },
      }),
    );
    expect(await ed25519Available()).toBe(false);
  });

  it('is false without crypto.subtle, and never throws', async () => {
    vi.stubGlobal('crypto', {});
    await expect(ed25519Available()).resolves.toBe(false);
  });

  it('never disagrees with whether a signer can actually be built', async () => {
    // If these two ever diverge, callers gating on the cheap check ship a
    // session that cannot sign.
    const engines = [
      fakeSubtle(),
      fakeSubtle({ sign: async () => new Uint8Array(1).buffer }),
      fakeSubtle({
        generateKey: async () => {
          throw new Error('x');
        },
      }),
    ];
    for (const subtle of engines) {
      stubCrypto(subtle);
      const available = await ed25519Available();
      setIdentityDegradedReporter(() => {});
      const signer = await createEd25519Signer();
      setIdentityDegradedReporter();
      expect(available).toBe(signer !== null);
    }
  });
});

/* ── import path ──────────────────────────────────────────────────────────── */

describe('importEd25519Signer', () => {
  const SEED = 'ab'.repeat(32);
  const PUB = 'cd'.repeat(32);

  it('probes signing on import too', async () => {
    // importKey resolving does not establish that sign works — they are
    // separate implementations and can diverge.
    stubCrypto(
      fakeSubtle({
        sign: async () => {
          throw new Error('OperationError');
        },
      }),
    );
    const { result, reasons } = await reported(() => importEd25519Signer(SEED, PUB));
    expect(result).toBeNull();
    expect(reasons[0]).toMatch(/OperationError/);
  });

  it('rejects malformed halves at import, not at send time', async () => {
    stubCrypto(fakeSubtle());
    const { result } = await reported(() => importEd25519Signer('zz', PUB));
    expect(result).toBeNull();
    const short = await reported(() => importEd25519Signer(SEED, 'cd'));
    expect(short.result).toBeNull();
  });

  it('reports when subtle is missing', async () => {
    vi.stubGlobal('crypto', {});
    const { result, reasons } = await reported(() => importEd25519Signer(SEED, PUB));
    expect(result).toBeNull();
    expect(reasons).toHaveLength(1);
  });

  it('lowercases the supplied public key', async () => {
    stubCrypto(fakeSubtle());
    const signer = await importEd25519Signer(SEED, 'CD'.repeat(32));
    expect(signer!.publicKeyHex).toBe(PUB);
  });
});

/* ── seed generation refuses to fake it ───────────────────────────────────── */

describe('generateEd25519Seed', () => {
  it('produces 32 bytes of hex', async () => {
    const seed = generateEd25519Seed();
    expect(seed).toMatch(/^[0-9a-f]{64}$/);
  });

  it('throws rather than degrading when there is no CSPRNG', () => {
    // There is no honest fallback for a CSPRNG. A predictable seed would
    // produce an identity that merely looks real.
    vi.stubGlobal('crypto', {});
    expect(() => generateEd25519Seed()).toThrow(/getRandomValues/);
  });
});

/* ── and on an engine that really does support it ─────────────────────────── */

describe('against this engine\'s real WebCrypto', () => {
  it('either signs verifiably or reports that it cannot', async () => {
    // No stubs: whichever branch this runtime takes must be internally
    // consistent and honest about it.
    const reasons: string[] = [];
    setIdentityDegradedReporter((r) => reasons.push(r));
    const signer = await createEd25519Signer();
    setIdentityDegradedReporter();

    if (!signer) {
      expect(reasons).toHaveLength(1);
      expect(await ed25519Available()).toBe(false);
      return;
    }

    expect(reasons).toHaveLength(0);
    expect(signer.publicKeyHex).toMatch(/^[0-9a-f]{64}$/);

    const message = new TextEncoder().encode('a swing happened');
    const sig = await signer.sign(message);
    expect(sig).toBeInstanceOf(Uint8Array);
    expect(sig.length).toBe(64);

    // And it must actually verify against the exported public key — a
    // signature that does not verify is worse than no signature.
    const key = await crypto.subtle.importKey(
      'raw',
      Uint8Array.from(
        signer.publicKeyHex.match(/../g)!.map((h) => parseInt(h, 16)),
      ) as BufferSource,
      { name: 'Ed25519' } as AlgorithmIdentifier,
      false,
      ['verify'],
    );
    await expect(
      crypto.subtle.verify(
        { name: 'Ed25519' } as AlgorithmIdentifier,
        key,
        sig as BufferSource,
        message as BufferSource,
      ),
    ).resolves.toBe(true);
  });
});
