/**
 * The inbound gate is the actual defense in this design — there is no server
 * behind it re-checking anything. These tests exist to pin exactly what it
 * catches (flooding, replay/reorder, malformed/oversized frames, wrong
 * playerId) and to be equally clear about what it cannot catch: a
 * fabricated-but-plausible GestureEvent. See inbound-gate.ts's module doc.
 */

import { describe, expect, it } from 'vitest';
import { DEFAULT_INBOUND_LIMITS, InboundGate } from '../src/inbound-gate';
import { encodePeerMessage, gestureToWire } from '../src/message';
import type { GestureEvent } from '@vulos/wibbly-input';

function gestureMsg(seq: number, over: Partial<GestureEvent> = {}) {
  const ev: GestureEvent = {
    playerId: 'player_2',
    kind: 'swing',
    confidence: 0.8,
    vector: { x: 0.2, y: -0.1 },
    tCapture: 10_000,
    ...over,
  };
  return encodePeerMessage({ type: 'gesture', seq, event: gestureToWire(ev) });
}

function stateMsg(seq: number, state: unknown = { ball: 1 }) {
  return encodePeerMessage({ type: 'state', seq, state });
}

describe('DEFAULT_INBOUND_LIMITS', () => {
  it('has sane, documented defaults', () => {
    expect(DEFAULT_INBOUND_LIMITS.expectedPlayerIds).toBeNull();
    expect(DEFAULT_INBOUND_LIMITS.acceptedKinds).toEqual([]);
  });
});

describe('InboundGate — happy path', () => {
  it('admits a plausible gesture message', () => {
    const g = new InboundGate();
    const r = g.admit(gestureMsg(1), 10_000);
    expect(r.ok).toBe(true);
    expect(r.message).toMatchObject({ type: 'gesture', seq: 1 });
  });

  it('admits a state message with fully opaque content', () => {
    const g = new InboundGate();
    const r = g.admit(stateMsg(1, { anything: [1, 2, { nested: true }] }), 10_000);
    expect(r.ok).toBe(true);
    expect((r.message as { state: unknown }).state).toEqual({ anything: [1, 2, { nested: true }] });
  });

  it('does not apply gesture-only checks to a state message', () => {
    // If gesture validation somehow ran against a state payload this would
    // reject; it must not, because state is declared opaque.
    const g = new InboundGate({ minConfidence: 0.99, acceptedKinds: ['swing'] });
    expect(g.admit(stateMsg(1, { confidence: -999, kind: 'nonsense' }), 10_000).ok).toBe(true);
  });
});

describe('InboundGate — malformed input', () => {
  it('rejects a frame over the size ceiling before ever parsing it', () => {
    const g = new InboundGate({ maxMessageChars: 10 });
    const r = g.admit('x'.repeat(11), 10_000);
    expect(r).toMatchObject({ ok: false, reason: 'too_large' });
  });

  it('rejects invalid JSON', () => {
    const g = new InboundGate();
    for (const junk of ['{not json', '', 'undefined', '{"type":']) {
      expect(g.admit(junk, 10_000)).toMatchObject({ ok: false, reason: 'malformed' });
    }
  });

  it('rejects valid JSON that is not an object', () => {
    const g = new InboundGate();
    for (const junk of ['42', '"a string"', 'null', '[1,2,3]', 'true']) {
      expect(g.admit(junk, 10_000)).toMatchObject({ ok: false, reason: 'malformed' });
    }
  });

  it('rejects an unknown message type', () => {
    const g = new InboundGate();
    expect(g.admit(JSON.stringify({ type: 'teleport', seq: 1 }), 10_000)).toMatchObject({
      ok: false,
      reason: 'malformed',
    });
  });

  it('rejects a missing or non-integer seq', () => {
    const g = new InboundGate();
    for (const seq of [undefined, 'one', 1.5, -1, NaN, Infinity]) {
      expect(g.admit(JSON.stringify({ type: 'state', seq, state: {} }), 10_000)).toMatchObject({
        ok: false,
        reason: 'malformed',
      });
    }
  });

  it('rejects a gesture message with no event object', () => {
    const g = new InboundGate();
    expect(g.admit(JSON.stringify({ type: 'gesture', seq: 1 }), 10_000)).toMatchObject({
      ok: false,
      reason: 'malformed',
    });
  });
});

describe('InboundGate — gesture sanity', () => {
  it('rejects out-of-range or non-finite confidence', () => {
    const g = new InboundGate();
    for (const confidence of [-0.1, 1.1, NaN, Infinity, 'high' as unknown as number]) {
      expect(g.admit(gestureMsg(1, { confidence }), 10_000)).toMatchObject({
        ok: false,
        reason: 'invalid_gesture',
      });
    }
  });

  it('rejects a timestamp too far in the future or too far in the past', () => {
    const g = new InboundGate({ maxFutureSkewMs: 2_000, maxAgeMs: 5_000 });
    expect(g.admit(gestureMsg(1, { tCapture: 99_000 }), 10_000)).toMatchObject({
      ok: false,
      reason: 'invalid_gesture',
    });
    expect(g.admit(gestureMsg(2, { tCapture: 1_000 }), 10_000_000)).toMatchObject({
      ok: false,
      reason: 'invalid_gesture',
    });
  });

  it('rejects a kind outside an allowlist when one is set', () => {
    const g = new InboundGate({ acceptedKinds: ['swing'] });
    expect(g.admit(gestureMsg(1, { kind: 'teleport' }), 10_000)).toMatchObject({
      reason: 'invalid_gesture',
    });
    expect(g.admit(gestureMsg(2, { kind: 'swing' }), 10_000).ok).toBe(true);
  });

  it('rejects a malformed vector', () => {
    const g = new InboundGate();
    const raw = encodePeerMessage({
      type: 'gesture',
      seq: 1,
      event: { playerId: 'player_2', kind: 'swing', confidence: 0.8, tCapture: 10_000, vector: { x: 'nope' } as unknown as { x: number; y: number } },
    });
    expect(g.admit(raw, 10_000)).toMatchObject({ ok: false, reason: 'invalid_gesture' });
  });

  it('rejects a non-object detail', () => {
    const g = new InboundGate();
    const raw = encodePeerMessage({
      type: 'gesture',
      seq: 1,
      event: { playerId: 'player_2', kind: 'swing', confidence: 0.8, tCapture: 10_000, detail: [1, 2] as unknown as Record<string, unknown> },
    });
    expect(g.admit(raw, 10_000)).toMatchObject({ ok: false, reason: 'invalid_gesture' });
  });
});

describe('InboundGate — playerId authorization', () => {
  it('admits a gesture whose playerId is in the allowlist', () => {
    const g = new InboundGate({ expectedPlayerIds: ['player_2'] });
    expect(g.admit(gestureMsg(1, { playerId: 'player_2' }), 10_000).ok).toBe(true);
  });

  it('rejects a guest claiming a playerId that is not theirs — including the host\'s own', () => {
    const g = new InboundGate({ expectedPlayerIds: ['player_2'] });
    const r = g.admit(gestureMsg(1, { playerId: 'player_1' }), 10_000);
    expect(r).toMatchObject({ ok: false, reason: 'unauthorized_player' });
  });

  it('does not check playerId when no allowlist is configured', () => {
    const g = new InboundGate();
    expect(g.admit(gestureMsg(1, { playerId: 'anyone' }), 10_000).ok).toBe(true);
  });
});

describe('InboundGate — sequence numbers', () => {
  it('rejects a duplicate sequence number', () => {
    const g = new InboundGate();
    expect(g.admit(gestureMsg(5), 10_000).ok).toBe(true);
    expect(g.admit(gestureMsg(5), 10_001)).toMatchObject({ ok: false, reason: 'sequence_replayed' });
  });

  it('rejects an out-of-order (lower) sequence number', () => {
    const g = new InboundGate();
    expect(g.admit(gestureMsg(10), 10_000).ok).toBe(true);
    expect(g.admit(gestureMsg(3), 10_001)).toMatchObject({ ok: false, reason: 'sequence_replayed' });
    // Recovery continues from the high-water mark, not from the rejected value.
    expect(g.admit(gestureMsg(11), 10_002).ok).toBe(true);
  });

  it('shares one sequence space across gesture and state messages on the same connection', () => {
    const g = new InboundGate();
    expect(g.admit(gestureMsg(1), 10_000).ok).toBe(true);
    expect(g.admit(stateMsg(1), 10_001)).toMatchObject({ reason: 'sequence_replayed' });
    expect(g.admit(stateMsg(2), 10_002).ok).toBe(true);
  });

  it('does not advance the high-water mark on a rejected message', () => {
    const g = new InboundGate({ expectedPlayerIds: ['player_2'] });
    expect(g.admit(gestureMsg(1), 10_000).ok).toBe(true);
    // Rejected for playerId, must not consume/advance the sequence state.
    expect(g.admit(gestureMsg(1, { playerId: 'someone_else' }), 10_001)).toMatchObject({
      reason: 'unauthorized_player',
    });
    expect(g.admit(gestureMsg(2), 10_002).ok).toBe(true);
  });
});

describe('InboundGate — flooding', () => {
  it('caps accepted messages per second and recovers as the window slides', () => {
    const g = new InboundGate({ maxMessagesPerSec: 3 });
    for (let seq = 1; seq <= 3; seq++) {
      expect(g.admit(gestureMsg(seq), 10_000 + seq).ok).toBe(true);
    }
    expect(g.admit(gestureMsg(9), 10_010)).toMatchObject({ reason: 'rate_exceeded' });
    // A second past the first accepted message, the window has room again.
    expect(g.admit(gestureMsg(10), 11_001).ok).toBe(true);
  });

  it('does not let a flood of rejected messages consume the honest rate budget', () => {
    const g = new InboundGate({ maxMessagesPerSec: 2 });
    for (let i = 0; i < 20; i++) {
      expect(g.admit(gestureMsg(1, { confidence: 999 }), 10_000).ok).toBe(false);
    }
    expect(g.admit(gestureMsg(1), 10_000).ok).toBe(true);
    expect(g.admit(gestureMsg(2), 10_001).ok).toBe(true);
  });

  it('reset() clears both rate and sequence state', () => {
    const g = new InboundGate({ maxMessagesPerSec: 1 });
    expect(g.admit(gestureMsg(5), 10_000).ok).toBe(true);
    expect(g.admit(gestureMsg(6), 10_001)).toMatchObject({ reason: 'rate_exceeded' });
    g.reset();
    expect(g.admit(gestureMsg(1), 20_000).ok).toBe(true);
  });
});
