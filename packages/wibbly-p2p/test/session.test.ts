/**
 * PeerSession tests. No camera, no real WebRTC, no network — `MockTransport`
 * is the whole mocking surface, same role `transport.ts` played for the
 * WebSocket-magnetite design this package used to be.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { GestureEvent } from '@vulos/wibbly-input';
import { PeerSession } from '../src/session';
import type { PeerTransport } from '../src/transport';
import { encodePeerMessage, gestureToWire } from '../src/message';

class MockTransport implements PeerTransport {
  sent: string[] = [];
  connected = false;
  connectCalls = 0;
  disconnectCalls = 0;
  /** The other end of the channel, for tests that want two sessions actually talking. */
  peer: MockTransport | null = null;

  private openCb: (() => void) | null = null;
  private closeCb: (() => void) | null = null;
  private errCb: ((e: unknown) => void) | null = null;
  private msgCb: ((frame: string) => void) | null = null;

  connect(): void {
    this.connectCalls += 1;
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
    this.peer?.deliver(frame);
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
  onMessage(cb: (frame: string) => void): void {
    this.msgCb = cb;
  }
  /** Feed a frame to this session's onMessage handler directly, bypassing send(). */
  deliver(raw: string): void {
    this.msgCb?.(raw);
  }
  /** Simulate the channel dropping under us (no explicit disconnect() call). */
  drop(): void {
    this.connected = false;
    this.closeCb?.();
  }
  /** Simulate the channel reopening (ICE reconnect). */
  reopen(): void {
    this.connected = true;
    this.openCb?.();
  }
  raise(err: unknown): void {
    this.errCb?.(err);
  }
}

/** Two transports wired directly together, as if one RTCDataChannel connected both. */
function pair(): [MockTransport, MockTransport] {
  const a = new MockTransport();
  const b = new MockTransport();
  a.peer = b;
  b.peer = a;
  return [a, b];
}

function gesture(over: Partial<GestureEvent> = {}): GestureEvent {
  return {
    playerId: 'player_2',
    kind: 'swing',
    confidence: 0.8,
    vector: { x: 0.2, y: -0.05 },
    tCapture: 1_000_000,
    ...over,
  };
}

describe('PeerSession — connect and status', () => {
  let t: MockTransport;
  beforeEach(() => {
    t = new MockTransport();
  });

  it('reports status transitions through the lifecycle', async () => {
    const seen: string[] = [];
    const s = new PeerSession({ transport: t, onStatusChange: (st) => seen.push(st) });
    expect(s.status).toBe('idle');
    await s.connect();
    expect(s.status).toBe('connected');
    expect(s.isConnected).toBe(true);
    s.disconnect();
    expect(s.status).toBe('disconnected');
    s.close();
    expect(seen).toEqual(['connecting', 'connected', 'disconnected', 'closed']);
  });

  it('reflects a transport that opens asynchronously rather than assuming either', async () => {
    const asyncTransport: PeerTransport = {
      connect: () => {}, // does not open synchronously
      disconnect: () => {},
      send: () => false,
      isConnected: false,
      onOpen: () => {},
      onClose: () => {},
      onError: () => {},
      onMessage: () => {},
    };
    const s = new PeerSession({ transport: asyncTransport });
    await s.connect();
    expect(s.status).toBe('connecting');
  });
});

describe('PeerSession — sending and receiving, wired peer to peer', () => {
  it('carries a guest gesture to the host sim callback with the exact fields', async () => {
    const [hostT, guestT] = pair();
    const events: GestureEvent[] = [];
    const host = new PeerSession({
      transport: hostT,
      now: () => 1_000_000,
      limits: { expectedPlayerIds: ['player_2'] },
      onGestureEvent: (e) => events.push(e),
    });
    const guest = new PeerSession({ transport: guestT, now: () => 1_000_000 });
    await host.connect();
    await guest.connect();

    const r = guest.sendGesture(gesture());
    expect(r).toEqual({ sent: true, seq: 1 });
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({ playerId: 'player_2', kind: 'swing' });
  });

  it('carries a host state broadcast to the guest renderer callback, opaque', async () => {
    const [hostT, guestT] = pair();
    const states: unknown[] = [];
    const host = new PeerSession({ transport: hostT, now: () => 1_000_000 });
    const guest = new PeerSession({ transport: guestT, now: () => 1_000_000, onState: (s) => states.push(s) });
    await host.connect();
    await guest.connect();

    host.broadcastState({ ball: { x: 1, y: 2 }, score: [0, 0] });
    expect(states).toEqual([{ ball: { x: 1, y: 2 }, score: [0, 0] }]);
  });

  it('assigns strictly increasing sequence numbers across many sends', async () => {
    const [hostT, guestT] = pair();
    const host = new PeerSession({ transport: hostT });
    await host.connect();
    void guestT; // receiving side unused in this test
    const seqs: number[] = [];
    for (let i = 0; i < 25; i++) {
      const r = host.broadcastState({ tick: i });
      if (r.sent) seqs.push(r.seq);
    }
    expect(seqs.length).toBe(25);
    for (let i = 1; i < seqs.length; i++) expect(seqs[i]).toBeGreaterThan(seqs[i - 1]!);
  });

  it('counts sent, received and dropped', async () => {
    const [hostT, guestT] = pair();
    const host = new PeerSession({
      transport: hostT,
      now: () => 1_000_000,
      limits: { expectedPlayerIds: ['player_2'] },
    });
    const guest = new PeerSession({ transport: guestT, now: () => 1_000_000 });
    await host.connect();
    await guest.connect();

    guest.sendGesture(gesture());
    guest.sendGesture(gesture({ playerId: 'not_mine' })); // rejected by the host's gate

    expect(guest.stats.sentGestures).toBe(2);
    expect(host.stats.received).toBe(1);
    expect(host.stats.dropped).toBe(1);
  });
});

describe('PeerSession — a guest sending events for a playerId that is not theirs', () => {
  it('drops the event and never calls onGestureEvent, but does not tear down the session', async () => {
    const [hostT, guestT] = pair();
    const events: GestureEvent[] = [];
    const drops: unknown[] = [];
    const host = new PeerSession({
      transport: hostT,
      now: () => 1_000_000,
      limits: { expectedPlayerIds: ['player_2'] },
      onGestureEvent: (e) => events.push(e),
      onDrop: (d) => drops.push(d),
    });
    const guest = new PeerSession({ transport: guestT, now: () => 1_000_000 });
    await host.connect();
    await guest.connect();

    // The guest's local pipeline is (mis)configured, or a modified client
    // simply lies — either way the host must not attribute this to player_1.
    guest.sendGesture(gesture({ playerId: 'player_1' }));

    expect(events).toHaveLength(0);
    expect(drops).toEqual([{ kind: 'rejected', reason: 'unauthorized_player', detail: expect.any(String) }]);
    expect(host.isConnected).toBe(true);
  });
});

describe('PeerSession — flooding', () => {
  it('drops gesture events past the configured rate ceiling and reports why', async () => {
    const [hostT, guestT] = pair();
    const events: GestureEvent[] = [];
    const drops: unknown[] = [];
    const host = new PeerSession({
      transport: hostT,
      now: () => 1_000_000,
      limits: { maxMessagesPerSec: 2 },
      onGestureEvent: (e) => events.push(e),
      onDrop: (d) => drops.push(d),
    });
    const guest = new PeerSession({ transport: guestT, now: () => 1_000_000 });
    await host.connect();
    await guest.connect();

    for (let i = 0; i < 10; i++) guest.sendGesture(gesture());

    expect(events.length).toBe(2);
    expect(drops.length).toBe(8);
    expect(drops.every((d) => (d as { reason: string }).reason === 'rate_exceeded')).toBe(true);
  });
});

describe('PeerSession — out-of-order and duplicate sequence numbers', () => {
  it('rejects a duplicate seq and an out-of-order seq arriving on the wire', async () => {
    const t = new MockTransport();
    const events: GestureEvent[] = [];
    const drops: unknown[] = [];
    const host = new PeerSession({
      transport: t,
      now: () => 1_000_000,
      onGestureEvent: (e) => events.push(e),
      onDrop: (d) => drops.push(d),
    });
    await host.connect();

    const frame = (seq: number, playerId = 'player_2') =>
      encodePeerMessage({
        type: 'gesture',
        seq,
        event: gestureToWire(gesture({ playerId, tCapture: 1_000_000 })),
      });

    t.deliver(frame(5));
    t.deliver(frame(5)); // duplicate
    t.deliver(frame(3)); // out of order (lower than the high-water mark)
    t.deliver(frame(6)); // fine, above the high-water mark

    expect(events).toHaveLength(2);
    expect(drops).toHaveLength(2);
    expect(drops.every((d) => (d as { reason: string }).reason === 'sequence_replayed')).toBe(true);
  });
});

describe('PeerSession — malformed inbound frames', () => {
  it('drops a non-JSON frame without throwing or tearing down the session', async () => {
    const t = new MockTransport();
    const errs: unknown[] = [];
    const drops: unknown[] = [];
    const s = new PeerSession({ transport: t, onError: (e) => errs.push(e), onDrop: (d) => drops.push(d) });
    await s.connect();

    expect(() => t.deliver('{not json at all')).not.toThrow();
    expect(drops).toEqual([{ kind: 'rejected', reason: 'malformed', detail: expect.any(String) }]);
    expect(errs).toHaveLength(0); // a rejected message is not an error condition
    expect(s.isConnected).toBe(true);
  });
});

describe('PeerSession — peer disconnect mid-game', () => {
  it('degrades to local play when never connected, and never throws', async () => {
    const asyncTransport: PeerTransport = {
      connect: () => {},
      disconnect: () => {},
      send: () => false,
      isConnected: false,
      onOpen: () => {},
      onClose: () => {},
      onError: () => {},
      onMessage: () => {},
    };
    const s = new PeerSession({ transport: asyncTransport });
    await expect(s.connect()).resolves.toBeUndefined();
    expect(s.isConnected).toBe(false);
    const r = s.sendGesture(gesture());
    expect(r).toEqual({ sent: false, kind: 'not_connected' });
  });

  it('drops sends while disconnected, then resumes after the channel reopens', async () => {
    const [hostT, guestT] = pair();
    const host = new PeerSession({ transport: hostT, now: () => 1_000_000 });
    const guest = new PeerSession({ transport: guestT, now: () => 1_000_000 });
    await host.connect();
    await guest.connect();

    expect(guest.sendGesture(gesture()).sent).toBe(true);

    // The guest's connection drops mid-rally.
    guestT.drop();
    expect(guest.status).toBe('disconnected');
    expect(guest.sendGesture(gesture()).sent).toBe(false);

    guestT.reopen();
    expect(guest.status).toBe('connected');
    const after = guest.sendGesture(gesture());
    expect(after.sent).toBe(true);
    expect((after as { seq: number }).seq).toBeGreaterThan(1);
  });

  it('reports transport errors without tearing the session down', async () => {
    const t = new MockTransport();
    const errs: unknown[] = [];
    const s = new PeerSession({ transport: t, onError: (e) => errs.push(e) });
    await s.connect();
    t.raise(new Error('ICE connection failed'));
    expect(errs).toHaveLength(1);
    expect(s.isConnected).toBe(true);
  });

  it('close() disconnects, clears state and is safe to call twice', async () => {
    const t = new MockTransport();
    const s = new PeerSession({ transport: t });
    await s.connect();
    s.close();
    s.close();
    expect(t.disconnectCalls).toBe(1);
    expect(s.status).toBe('closed');
    expect(s.sendGesture(gesture())).toMatchObject({ kind: 'not_connected' });
    await expect(s.connect()).rejects.toThrow(/closed/);
  });

  it('disconnect() leaves the session reusable', async () => {
    const t = new MockTransport();
    const s = new PeerSession({ transport: t });
    await s.connect();
    s.disconnect();
    expect(s.status).toBe('disconnected');
    await s.connect();
    expect(s.status).toBe('connected');
  });

  it('attach() streams gestures and unsubscribes cleanly', async () => {
    const [hostT, guestT] = pair();
    const events: GestureEvent[] = [];
    const host = new PeerSession({
      transport: hostT,
      now: () => 1_000_000,
      onGestureEvent: (e) => events.push(e),
    });
    const guest = new PeerSession({ transport: guestT, now: () => 1_000_000 });
    await host.connect();
    await guest.connect();

    const listeners = new Set<(e: GestureEvent) => void>();
    const input = {
      onGesture(cb: (e: GestureEvent) => void) {
        listeners.add(cb);
        return () => listeners.delete(cb);
      },
    };
    const off = guest.attach(input);
    for (const cb of listeners) cb(gesture());
    await vi.waitFor(() => expect(events).toHaveLength(1));

    off();
    expect(listeners.size).toBe(0);
    for (const cb of listeners) cb(gesture());
    expect(events).toHaveLength(1);
  });
});
