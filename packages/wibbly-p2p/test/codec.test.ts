/**
 * codec.ts turns an SDP description into a compact string and back. These
 * tests run against this engine's real `CompressionStream`/`DecompressionStream`
 * (Node has them; so does every browser wibbly targets) for the round-trip
 * cases, and stub them out to prove the uncompressed fallback path works too
 * — the same probe-and-degrade pattern this package used for WebCrypto
 * Ed25519 in its previous life.
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { decodeDescription, encodeDescription } from '../src/codec';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('encodeDescription / decodeDescription — round trip', () => {
  it('round-trips a small description', async () => {
    const desc = { type: 'offer', sdp: 'v=0\r\no=- 1 1 IN IP4 127.0.0.1\r\n' };
    const code = await encodeDescription(desc);
    expect(await decodeDescription(code)).toEqual(desc);
  });

  it('round-trips a large, repetitive SDP blob (the realistic case)', async () => {
    const candidateLines = Array.from(
      { length: 40 },
      (_, i) => `a=candidate:${i} 1 udp 2122260223 192.168.1.${i % 255} ${40000 + i} typ host\r\n`,
    ).join('');
    const desc = { type: 'answer', sdp: `v=0\r\n${candidateLines}` };
    const code = await encodeDescription(desc);
    expect(await decodeDescription(code)).toEqual(desc);
  });

  it('compresses when CompressionStream is available — the code is shorter than raw base64 for repetitive SDP', async () => {
    const sdp = 'a=candidate:1 1 udp 2122260223 192.168.1.1 40000 typ host\r\n'.repeat(30);
    const code = await encodeDescription({ type: 'offer', sdp });
    expect(code[0]).toBe('g'); // gzip prefix — this engine has CompressionStream
    expect(code.length).toBeLessThan(sdp.length);
  });

  it('preserves type exactly (offer vs answer)', async () => {
    const offer = await encodeDescription({ type: 'offer', sdp: 'x' });
    const answer = await encodeDescription({ type: 'answer', sdp: 'x' });
    expect((await decodeDescription(offer)).type).toBe('offer');
    expect((await decodeDescription(answer)).type).toBe('answer');
  });
});

describe('encodeDescription / decodeDescription — fallback with no CompressionStream', () => {
  it('falls back to an uncompressed encoding and still round-trips', async () => {
    vi.stubGlobal('CompressionStream', undefined);
    vi.stubGlobal('DecompressionStream', undefined);
    const desc = { type: 'offer', sdp: 'v=0\r\no=- 1 1 IN IP4 127.0.0.1\r\n' };
    const code = await encodeDescription(desc);
    expect(code[0]).toBe('r'); // raw prefix — no compression available
    expect(await decodeDescription(code)).toEqual(desc);
  });

  it('a gzip-prefixed code fails clearly on an engine with no DecompressionStream', async () => {
    const gzipCode = await encodeDescription({ type: 'offer', sdp: 'hello world' });
    expect(gzipCode[0]).toBe('g');

    vi.stubGlobal('DecompressionStream', undefined);
    await expect(decodeDescription(gzipCode)).rejects.toThrow(/DecompressionStream|malformed/);
  });
});

describe('decodeDescription — malformed input', () => {
  it('rejects an empty or too-short code', async () => {
    await expect(decodeDescription('')).rejects.toThrow(/too short/);
    await expect(decodeDescription('g')).rejects.toThrow(/too short/);
  });

  it('rejects an unrecognised format tag', async () => {
    await expect(decodeDescription('zAAAA')).rejects.toThrow(/format tag/);
  });

  it('rejects invalid base64url', async () => {
    await expect(decodeDescription('r not-valid-base64!!!')).rejects.toThrow(/malformed/);
  });

  it('rejects a gzip tag over bytes that are not actually gzip', async () => {
    await expect(decodeDescription('gAAAAAAAAA')).rejects.toThrow(/malformed|decompress/);
  });

  it('rejects raw bytes that are not valid JSON', async () => {
    const code = 'r' + Buffer.from('not json at all').toString('base64url');
    await expect(decodeDescription(code)).rejects.toThrow(/JSON/);
  });

  it('rejects JSON missing type or sdp', async () => {
    const missingSdp = 'r' + Buffer.from(JSON.stringify({ type: 'offer' })).toString('base64url');
    await expect(decodeDescription(missingSdp)).rejects.toThrow(/type.*sdp|sdp.*type/i);

    const missingType = 'r' + Buffer.from(JSON.stringify({ sdp: 'x' })).toString('base64url');
    await expect(decodeDescription(missingType)).rejects.toThrow(/type.*sdp|sdp.*type/i);
  });

  it('rejects a type that is neither offer nor answer', async () => {
    const code = 'r' + Buffer.from(JSON.stringify({ type: 'nonsense', sdp: 'x' })).toString('base64url');
    await expect(decodeDescription(code)).rejects.toThrow(/"offer" or "answer"/);
  });

  it('never throws a raw, non-Error rejection — every failure is a readable message', async () => {
    for (const bad of ['', 'x', 'g!!!', 'r!!!']) {
      await expect(decodeDescription(bad)).rejects.toThrow(Error);
    }
  });
});
