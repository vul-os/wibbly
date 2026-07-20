import { describe, expect, it } from 'vitest';
import type { GestureEvent } from '@vulos/wibbly-input';
import { AttestedEventAdapter } from '../src/adapter';
import { toF32 } from '../src/wire';

const PLAYER = 'ea4a6c63e29c520abef5507b132ec5f9954776aebebe7b92421eea691446d22c';

function gesture(over: Partial<GestureEvent> = {}): GestureEvent {
  return {
    playerId: 'player_1',
    kind: 'swing',
    confidence: 0.8,
    vector: { x: 0.125, y: -0.0625 },
    tCapture: 1_763_000_000_123,
    detail: { direction: 'right', stroke: 'forehand', speed: 0.004 },
    ...over,
  };
}

describe('AttestedEventAdapter — mapping', () => {
  it('produces every field magnetite requires, with the key present even when null', () => {
    const a = new AttestedEventAdapter({ playerKeyHex: PLAYER });
    const ev = a.adapt(gesture());

    // Rust derives no #[serde(default)], so an absent key fails to deserialize.
    expect(Object.keys(ev).sort()).toEqual(
      ['confidence', 'kind', 'player', 'seq', 'speed_mps', 't_capture_ms', 'vector'].sort(),
    );
    expect(ev.player).toBe(PLAYER);
    expect(ev.kind).toBe('swing');
    expect(ev.vector).toEqual([0.125, -0.0625, 0]);
  });

  it('carries kind through verbatim — the host allowlists on it', () => {
    const a = new AttestedEventAdapter({ playerKeyHex: PLAYER });
    expect(a.adapt(gesture({ kind: 'punch' })).kind).toBe('punch');
  });

  it('uses tCapture, not detection time', () => {
    const a = new AttestedEventAdapter({ playerKeyHex: PLAYER });
    // The pacer means detection happens well after capture; only capture is
    // carried on the GestureEvent, and only capture may be sent.
    expect(a.adapt(gesture({ tCapture: 1_700_000_000_001 })).t_capture_ms).toBe(1_700_000_000_001);
  });

  it('rounds a fractional capture timestamp — t_capture_ms is a u64', () => {
    const a = new AttestedEventAdapter({ playerKeyHex: PLAYER });
    expect(a.adapt(gesture({ tCapture: 1_763_000_000_123.7 })).t_capture_ms).toBe(1_763_000_000_124);
  });

  it('rounds every float to f32 so the server recomputes the same preimage', () => {
    const a = new AttestedEventAdapter({ playerKeyHex: PLAYER });
    const ev = a.adapt(gesture({ confidence: 0.1, vector: { x: 0.1, y: 0.2, z: 0.3 } }));
    expect(ev.confidence).toBe(toF32(0.1));
    expect(ev.vector).toEqual([toF32(0.1), toF32(0.2), toF32(0.3)]);
    expect(ev.speed_mps).toBe(toF32(ev.speed_mps!));
  });

  it('clamps confidence into 0..=1 — the gate refuses anything outside it', () => {
    const a = new AttestedEventAdapter({ playerKeyHex: PLAYER });
    expect(a.adapt(gesture({ confidence: 1.5 })).confidence).toBe(1);
    expect(a.adapt(gesture({ confidence: -3 })).confidence).toBe(0);
    expect(a.adapt(gesture({ confidence: NaN })).confidence).toBe(0);
  });

  it('sends vector null when the gesture has none, rather than inventing zeroes', () => {
    const a = new AttestedEventAdapter({ playerKeyHex: PLAYER });
    const ev = a.adapt(gesture({ vector: undefined }));
    expect(ev.vector).toBeNull();
  });

  it('converts normalized speed to m/s via the documented frame-width assumption', () => {
    const a = new AttestedEventAdapter({ playerKeyHex: PLAYER, metresPerFrameWidth: 2 });
    // 0.004 frame-widths/ms × 2 m/frame-width × 1000 ms/s = 8 m/s
    expect(a.adapt(gesture({ detail: { speed: 0.004 } })).speed_mps).toBeCloseTo(8, 5);
  });

  it('declines to claim a speed when asked not to, or when there is none to report', () => {
    const off = new AttestedEventAdapter({ playerKeyHex: PLAYER, speedMps: false });
    expect(off.adapt(gesture()).speed_mps).toBeNull();

    const on = new AttestedEventAdapter({ playerKeyHex: PLAYER });
    expect(on.adapt(gesture({ detail: {} })).speed_mps).toBeNull();
    expect(on.adapt(gesture({ detail: undefined })).speed_mps).toBeNull();
    expect(on.adapt(gesture({ detail: { speed: 'fast' } })).speed_mps).toBeNull();
    expect(on.adapt(gesture({ detail: { speed: Infinity } })).speed_mps).toBeNull();
  });

  it('refuses a malformed player key at construction, not at send time', () => {
    expect(() => new AttestedEventAdapter({ playerKeyHex: 'nope' })).toThrow(/64 hex/);
    expect(() => new AttestedEventAdapter({ playerKeyHex: PLAYER.slice(0, 62) })).toThrow();
  });

  it('lowercases the player key to match Rust hex encoding', () => {
    const a = new AttestedEventAdapter({ playerKeyHex: PLAYER.toUpperCase() });
    expect(a.adapt(gesture()).player).toBe(PLAYER);
  });
});

describe('AttestedEventAdapter — sequence numbers', () => {
  it('starts at 1 and increases strictly', () => {
    const a = new AttestedEventAdapter({ playerKeyHex: PLAYER });
    const seqs = Array.from({ length: 50 }, () => a.adapt(gesture()).seq);
    expect(seqs[0]).toBe(1);
    for (let i = 1; i < seqs.length; i++) expect(seqs[i]).toBeGreaterThan(seqs[i - 1]!);
    expect(a.lastSeq).toBe(50);
  });

  it('never repeats a number regardless of timestamp ordering', () => {
    const a = new AttestedEventAdapter({ playerKeyHex: PLAYER });
    const seqs = new Set(
      [5, 1, 9, 2, 2, 7].map((t) => a.adapt(gesture({ tCapture: 1_763_000_000_000 + t })).seq),
    );
    expect(seqs.size).toBe(6);
  });

  it('can resume from a persisted high-water mark', () => {
    const a = new AttestedEventAdapter({ playerKeyHex: PLAYER, startSeq: 900 });
    expect(a.adapt(gesture()).seq).toBe(901);
  });

  it('resetSequence exists but is documented as reconnect-unsafe', () => {
    const a = new AttestedEventAdapter({ playerKeyHex: PLAYER });
    a.adapt(gesture());
    a.adapt(gesture());
    a.resetSequence();
    // Correct only after the host called PlausibilityGate::forget for us;
    // otherwise the server refuses these as SequenceReplayed.
    expect(a.adapt(gesture()).seq).toBe(1);
  });
});
