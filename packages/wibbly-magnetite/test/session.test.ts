/**
 * Session tests. No camera, no live server, no DOM — the transport is mocked,
 * which is the whole reason `MagnetiteTransport` is a seam.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { GestureEvent } from '@vulos/wibbly-input';
import { MagnetiteSession } from '../src/session';
import { clientTransport, type MagnetiteTransport } from '../src/transport';
import {
  ATTESTED_FRAME_TYPE,
  signedAttestedSigningBytes,
  hexToBytes,
  type AttestedFrameSigned,
  type AttestedFrameUnsigned,
} from '../src/wire';
import { createEd25519Signer, ed25519Available } from '../src/identity';

const PLAYER = 'ea4a6c63e29c520abef5507b132ec5f9954776aebebe7b92421eea691446d22c';

class MockTransport implements MagnetiteTransport {
  sent: string[] = [];
  connected = false;
  connectCalls = 0;
  disconnectCalls = 0;
  private openCb: (() => void) | null = null;
  private closeCb: (() => void) | null = null;
  private errCb: ((e: unknown) => void) | null = null;
  /** When false, connect() leaves the socket down — an unreachable node. */
  constructor(private readonly reachable = true) {}

  connect(): void {
    this.connectCalls += 1;
    if (!this.reachable) return;
    this.connected = true;
    this.openCb?.();
  }
  disconnect(): void {
    this.disconnectCalls += 1;
    this.connected = false;
    this.closeCb?.();
  }
  send(frame: string): boolean {
    if (!this.connected) return false;
    this.sent.push(frame);
    return true;
  }
  get isConnected(): boolean {
    return this.connected;
  }
  onOpen(cb: () => void): void {
    this.openCb = cb;
  }
  onClose(cb: () => void): void {
    this.closeCb = cb;
  }
  onError(cb: (e: unknown) => void): void {
    this.errCb = cb;
  }
  /** Simulate the socket dropping under us (no explicit disconnect). */
  drop(): void {
    this.connected = false;
    this.closeCb?.();
  }
  /** Simulate autoReconnect succeeding. */
  reopen(): void {
    this.connected = true;
    this.openCb?.();
  }
  raise(err: unknown): void {
    this.errCb?.(err);
  }
}

function gesture(over: Partial<GestureEvent> = {}): GestureEvent {
  return {
    playerId: 'player_1',
    kind: 'swing',
    confidence: 0.8,
    vector: { x: 0.2, y: -0.05 },
    tCapture: 1_000_000,
    detail: { speed: 0.004 },
    ...over,
  };
}

/** Unsigned session so tests do not depend on WebCrypto Ed25519 being present. */
function makeSession(t: MockTransport, over = {}) {
  return new MagnetiteSession({
    url: 'ws://127.0.0.1:9001',
    transport: t,
    signer: false,
    playerKeyHex: PLAYER,
    now: () => 1_000_000,
    ...over,
  });
}

describe('MagnetiteSession — connect and status', () => {
  let t: MockTransport;
  beforeEach(() => {
    t = new MockTransport();
  });

  it('reports status transitions through the lifecycle', async () => {
    const seen: string[] = [];
    const s = makeSession(t, { onStatusChange: (st: string) => seen.push(st) });
    expect(s.status).toBe('idle');
    await s.connect();
    expect(s.status).toBe('connected');
    expect(s.isConnected).toBe(true);
    s.disconnect();
    expect(s.status).toBe('disconnected');
    s.close();
    expect(seen).toEqual(['connecting', 'connected', 'disconnected', 'closed']);
  });

  it('is idempotent — a second connect does not open a second socket', async () => {
    const s = makeSession(t);
    await Promise.all([s.connect(), s.connect()]);
    await s.connect();
    expect(t.connectCalls).toBe(1);
  });

  it('derives the player key from the signer when one is present', async () => {
    if (!(await ed25519Available())) return; // honestly skipped, not faked
    const signer = await createEd25519Signer();
    const s = new MagnetiteSession({ url: 'ws://x', transport: t, signer: signer! });
    await s.connect();
    expect(s.playerKeyHex).toBe(signer!.publicKeyHex);
    expect(s.signed).toBe(true);
    s.close();
  });

  it('refuses to connect with no key at all rather than inventing one', async () => {
    const s = new MagnetiteSession({ url: 'ws://x', transport: t, signer: false });
    await expect(s.connect()).rejects.toThrow(/no player key/);
    expect(s.status).toBe('idle');
  });

  it('says plainly when it is running unsigned', async () => {
    const s = makeSession(t);
    await s.connect();
    expect(s.signed).toBe(false);
  });
});

describe('MagnetiteSession — sending', () => {
  let t: MockTransport;
  beforeEach(() => {
    t = new MockTransport();
  });

  it('sends an unsigned attested frame with the exact wire field names', async () => {
    const s = makeSession(t);
    await s.connect();
    const r = await s.submit(gesture());
    expect(r).toEqual({ sent: true, seq: 1 });

    const frame = JSON.parse(t.sent[0]!) as AttestedFrameUnsigned;
    expect(frame.type).toBe(ATTESTED_FRAME_TYPE);
    expect(Object.keys(frame.event).sort()).toEqual(
      ['confidence', 'kind', 'player', 'seq', 'speed_mps', 't_capture_ms', 'vector'].sort(),
    );
    expect(frame.event.player).toBe(PLAYER);
    expect(frame.event.t_capture_ms).toBe(1_000_000);
  });

  it('signs with Ed25519 when available, and the signature verifies', async () => {
    if (!(await ed25519Available())) return;
    const signer = await createEd25519Signer();
    const s = new MagnetiteSession({
      url: 'ws://x',
      transport: t,
      signer: signer!,
      now: () => 1_000_000,
    });
    await s.connect();
    expect((await s.submit(gesture())).sent).toBe(true);

    const frame = JSON.parse(t.sent[0]!) as AttestedFrameSigned;
    expect(frame.signed.player_key).toBe(signer!.publicKeyHex);
    expect(frame.signed.event.player).toBe(signer!.publicKeyHex);
    expect(frame.signed.sig).toMatch(/^[0-9a-f]{128}$/);

    // Verify the signature the way magnetite would: over
    // ATTESTED_DOMAIN ‖ event.signing_bytes() ‖ player_key.
    const key = await crypto.subtle.importKey(
      'raw',
      hexToBytes(frame.signed.player_key, 32) as BufferSource,
      { name: 'Ed25519' } as AlgorithmIdentifier,
      false,
      ['verify'],
    );
    const ok = await crypto.subtle.verify(
      { name: 'Ed25519' } as AlgorithmIdentifier,
      key,
      hexToBytes(frame.signed.sig, 64) as BufferSource,
      signedAttestedSigningBytes(frame.signed.event, frame.signed.player_key) as BufferSource,
    );
    // A passing signature proves AUTHORSHIP ONLY — that this key sent this. It
    // is not evidence that a camera saw anything.
    expect(ok).toBe(true);
    s.close();
  });

  it('assigns strictly increasing sequence numbers across many sends', async () => {
    const s = makeSession(t, { limits: { cooldownMs: 0, maxEventsPerSec: 1000 } });
    await s.connect();
    const seqs: number[] = [];
    for (let i = 0; i < 25; i++) {
      const r = await s.submit(gesture({ tCapture: 1_000_000 - 25 + i }));
      if (r.sent) seqs.push(r.seq);
    }
    expect(seqs.length).toBe(25);
    for (let i = 1; i < seqs.length; i++) expect(seqs[i]).toBeGreaterThan(seqs[i - 1]!);
  });

  it('drops locally on pre-flight failure without touching the wire', async () => {
    const drops: unknown[] = [];
    const s = makeSession(t, { onDrop: (f: unknown) => drops.push(f) });
    await s.connect();

    // Below the 0.35 confidence floor.
    const r = await s.submit(gesture({ confidence: 0.1 }));
    expect(r).toMatchObject({ sent: false, kind: 'preflight', reason: 'implausible_confidence' });
    expect(t.sent).toHaveLength(0);
    expect(drops).toHaveLength(1);
  });

  it('drops a same-kind gesture inside the cooldown rather than spending rate budget', async () => {
    const s = makeSession(t);
    await s.connect();
    expect((await s.submit(gesture({ tCapture: 1_000_000 }))).sent).toBe(true);
    // Default cooldown is 100ms; 40ms later is refused.
    expect(await s.submit(gesture({ tCapture: 1_000_040 }))).toMatchObject({ reason: 'cooldown' });
    expect(t.sent).toHaveLength(1);
  });

  it('drops an implausibly fast swing', async () => {
    const s = makeSession(t);
    await s.connect();
    // 0.2 frame-widths/ms × 1.6 m × 1000 = 320 m/s, far past the 20 m/s ceiling.
    expect(await s.submit(gesture({ detail: { speed: 0.2 } }))).toMatchObject({
      reason: 'speed_unreachable',
    });
    expect(t.sent).toHaveLength(0);
  });

  it('enforces the rate ceiling locally', async () => {
    const s = makeSession(t, { limits: { maxEventsPerSec: 2, cooldownMs: 0 } });
    await s.connect();
    expect((await s.submit(gesture({ tCapture: 999_990 }))).sent).toBe(true);
    expect((await s.submit(gesture({ tCapture: 999_991 }))).sent).toBe(true);
    expect(await s.submit(gesture({ tCapture: 999_992 }))).toMatchObject({
      reason: 'rate_exceeded',
    });
    expect(t.sent).toHaveLength(2);
  });

  it('counts what it sent and what it dropped', async () => {
    const s = makeSession(t);
    await s.connect();
    await s.submit(gesture());
    await s.submit(gesture({ confidence: 0.01 }));
    expect(s.stats.sent).toBe(1);
    expect(s.stats.dropped).toBe(1);
  });
});

describe('MagnetiteSession — degradation and teardown', () => {
  it('degrades to local play when the node is unreachable, and never throws', async () => {
    const t = new MockTransport(false);
    const s = makeSession(t);
    await expect(s.connect()).resolves.toBeUndefined();
    expect(s.isConnected).toBe(false);
    const r = await s.submit(gesture());
    expect(r).toEqual({ sent: false, kind: 'not_connected' });
    // The game keeps running: nothing threw, nothing was queued.
    expect(t.sent).toHaveLength(0);
  });

  it('drops events while the socket is down, then resumes after reconnect', async () => {
    const t = new MockTransport();
    const s = makeSession(t, { limits: { cooldownMs: 0 } });
    await s.connect();
    expect((await s.submit(gesture({ tCapture: 999_990 }))).sent).toBe(true);

    t.drop();
    expect(s.status).toBe('disconnected');
    expect(await s.submit(gesture({ tCapture: 999_991 }))).toMatchObject({ kind: 'not_connected' });

    t.reopen();
    expect(s.status).toBe('connected');
    const after = await s.submit(gesture({ tCapture: 999_992 }));
    expect(after.sent).toBe(true);
    // Sequence keeps climbing across the reconnect: the host still holds our
    // high-water mark unless it called forget(), so restarting would be refused.
    expect((after as { seq: number }).seq).toBeGreaterThan(1);
  });

  it('reports transport errors without tearing the session down', async () => {
    const t = new MockTransport();
    const errs: unknown[] = [];
    const s = makeSession(t, { onError: (e: unknown) => errs.push(e) });
    await s.connect();
    t.raise(new Error('socket wobble'));
    expect(errs).toHaveLength(1);
    expect(s.isConnected).toBe(true);
  });

  it('close() disconnects, clears state and is safe to call twice', async () => {
    const t = new MockTransport();
    const s = makeSession(t);
    await s.connect();
    await s.submit(gesture());
    s.close();
    s.close();
    expect(t.disconnectCalls).toBe(1);
    expect(s.status).toBe('closed');
    expect(s.playerKeyHex).toBeNull();
    expect(await s.submit(gesture())).toMatchObject({ kind: 'not_connected' });
    await expect(s.connect()).rejects.toThrow(/closed/);
  });

  it('disconnect() leaves the session reusable', async () => {
    const t = new MockTransport();
    const s = makeSession(t);
    await s.connect();
    s.disconnect();
    expect(s.status).toBe('disconnected');
    await s.connect();
    expect(s.status).toBe('connected');
  });

  it('attach() streams gestures and unsubscribes cleanly', async () => {
    const t = new MockTransport();
    const s = makeSession(t, { limits: { cooldownMs: 0 } });
    await s.connect();

    const listeners = new Set<(e: GestureEvent) => void>();
    const input = {
      onGesture(cb: (e: GestureEvent) => void) {
        listeners.add(cb);
        return () => listeners.delete(cb);
      },
    };
    const off = s.attach(input);
    for (const cb of listeners) cb(gesture({ tCapture: 999_990 }));
    await vi.waitFor(() => expect(t.sent).toHaveLength(1));

    off();
    expect(listeners.size).toBe(0);
    for (const cb of listeners) cb(gesture({ tCapture: 999_991 }));
    expect(t.sent).toHaveLength(1);
  });
});

describe('clientTransport', () => {
  it('prefers a public sendRaw if a future magnetite adds one', () => {
    const sendRaw = vi.fn(() => true);
    const tr = clientTransport({ connect: () => {}, disconnect: () => {}, sendRaw });
    expect(tr.send('{}')).toBe(true);
    expect(sendRaw).toHaveBeenCalledWith('{}');
  });

  it('falls back to the ConnectionManager, and refuses to send while closed', () => {
    const conn = { send: vi.fn(), isConnected: false, onOpen: null, onClose: null, onError: null };
    const tr = clientTransport({ connect: () => {}, disconnect: () => {}, _conn: conn });
    expect(tr.send('{}')).toBe(false);
    expect(conn.send).not.toHaveBeenCalled();
    conn.isConnected = true;
    expect(tr.send('{}')).toBe(true);
    expect(conn.send).toHaveBeenCalledWith('{}');
  });

  it('fails loudly, not silently, when the client offers no way to send', () => {
    const tr = clientTransport({ connect: () => {}, disconnect: () => {} });
    expect(() => tr.send('{}')).toThrow(/cannot send attested events/);
  });

  it('forwards connect and disconnect to the client', () => {
    const connect = vi.fn();
    const disconnect = vi.fn();
    const tr = clientTransport({ connect, disconnect });
    tr.connect();
    tr.disconnect();
    expect(connect).toHaveBeenCalledOnce();
    expect(disconnect).toHaveBeenCalledOnce();
  });
});
