/**
 * Compact encoding for a WebRTC session description (an offer or answer), so
 * it fits in a shareable link or a QR code — the whole point of zero-server
 * signalling (site/docs/MULTIPLAYER.md).
 *
 * An SDP blob with ICE candidates baked in typically runs to a few kilobytes
 * of mostly-repetitive text, which is well past what is comfortable to
 * copy-paste and pushing the practical limit of a scannable QR code. Gzip
 * compresses this kind of repetitive text well, so it is used when available.
 *
 * ── Availability, honestly ───────────────────────────────────────────────
 * `CompressionStream`/`DecompressionStream` (gzip) are widely available in
 * 2026 (Chrome/Edge 80+, Firefox 113+, Safari 16.4+, Node 18+) but this module
 * does not assume that — it checks at each call and falls back to an
 * uncompressed encoding rather than throwing. The two encodings are
 * distinguished by a one-character prefix on the resulting string, so a
 * decoder never has to guess which one produced a given code, and a code
 * produced by one engine decodes correctly on another even if their
 * compression support differs (the fallback path never needs
 * DecompressionStream at all; only a gzip-prefixed code does).
 */

const GZIP_PREFIX = 'g';
const RAW_PREFIX = 'r';

export interface DescriptionLike {
  type: string;
  sdp: string;
}

/**
 * Checked fresh on every call, deliberately not cached: it is a `typeof`
 * check (effectively free), and caching it would mean a page that briefly
 * loses `CompressionStream` — or a test that stubs it out — gets a stale
 * answer for the rest of the session.
 */
function hasCompressionStreams(): boolean {
  return typeof CompressionStream === 'function' && typeof DecompressionStream === 'function';
}

function toBase64Url(bytes: Uint8Array): string {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(s: string): Uint8Array {
  if (!/^[A-Za-z0-9_-]*$/.test(s)) throw new Error('not valid base64url');
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/');
  const pad = b64.length % 4 === 0 ? '' : '='.repeat(4 - (b64.length % 4));
  let bin: string;
  try {
    bin = atob(b64 + pad);
  } catch (err) {
    throw new Error(`not valid base64: ${describe(err)}`);
  }
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function readAll(stream: ReadableStream<Uint8Array>): Promise<Uint8Array> {
  const chunks: Uint8Array[] = [];
  const reader = stream.getReader();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  const total = chunks.reduce((n, c) => n + c.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const c of chunks) {
    out.set(c, offset);
    offset += c.length;
  }
  return out;
}

// write()/close() on the writable side are intentionally not awaited before
// reading — the point is to stream, not buffer. But an invalid gzip payload
// makes DecompressionStream error the *writable* side too, and a rejected
// promise nobody awaits is an unhandled rejection even though the *readable*
// side (awaited via readAll below, and in turn by every caller) reports the
// same failure. `.catch(() => {})` here does not hide the error — it only
// stops it from being reported twice.
async function gzip(bytes: Uint8Array): Promise<Uint8Array> {
  const cs = new CompressionStream('gzip');
  const writer = cs.writable.getWriter();
  void writer.write(bytes as BufferSource).catch(() => {});
  void writer.close().catch(() => {});
  return readAll(cs.readable);
}

async function gunzip(bytes: Uint8Array): Promise<Uint8Array> {
  const ds = new DecompressionStream('gzip');
  const writer = ds.writable.getWriter();
  void writer.write(bytes as BufferSource).catch(() => {});
  void writer.close().catch(() => {});
  return readAll(ds.readable);
}

/** Encode an offer/answer into a compact string for a link or QR code. */
export async function encodeDescription(desc: DescriptionLike): Promise<string> {
  const json = JSON.stringify({ type: desc.type, sdp: desc.sdp });
  const bytes = new TextEncoder().encode(json);
  if (hasCompressionStreams()) {
    try {
      return GZIP_PREFIX + toBase64Url(await gzip(bytes));
    } catch {
      // Fall through to the uncompressed form rather than fail a connection
      // over a compression bug — a longer link is a UX cost, not a break.
    }
  }
  return RAW_PREFIX + toBase64Url(bytes);
}

/**
 * Decode a connection code produced by {@link encodeDescription}.
 *
 * Throws a specific, human-readable error for every way this can be wrong —
 * a mistyped paste, a truncated QR scan, a code from an incompatible future
 * version — rather than returning something that looks like a description
 * and fails confusingly deep inside `RTCPeerConnection.setRemoteDescription`.
 */
export async function decodeDescription(code: string): Promise<DescriptionLike> {
  if (typeof code !== 'string' || code.length < 2) {
    throw new Error('malformed connection code: too short to be valid');
  }
  const prefix = code[0];
  const body = code.slice(1);

  let bytes: Uint8Array;
  try {
    bytes = fromBase64Url(body);
  } catch (err) {
    throw new Error(`malformed connection code: ${describe(err)}`);
  }

  if (prefix === GZIP_PREFIX) {
    if (!hasCompressionStreams()) {
      throw new Error(
        'connection code is gzip-compressed but this engine has no DecompressionStream; ' +
          'cannot decode it here',
      );
    }
    try {
      bytes = await gunzip(bytes);
    } catch (err) {
      throw new Error(`malformed connection code: could not decompress (${describe(err)})`);
    }
  } else if (prefix !== RAW_PREFIX) {
    throw new Error(`malformed connection code: unrecognised format tag ${JSON.stringify(prefix)}`);
  }

  let json: string;
  try {
    json = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    throw new Error('malformed connection code: not valid UTF-8 after decoding');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch (err) {
    throw new Error(`malformed connection code: not valid JSON (${describe(err)})`);
  }

  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    typeof (parsed as { type?: unknown }).type !== 'string' ||
    typeof (parsed as { sdp?: unknown }).sdp !== 'string'
  ) {
    throw new Error('malformed connection code: missing "type" or "sdp"');
  }
  const { type, sdp } = parsed as { type: string; sdp: string };
  if (type !== 'offer' && type !== 'answer') {
    throw new Error(`malformed connection code: type must be "offer" or "answer", got "${type}"`);
  }
  return { type, sdp };
}

function describe(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}
