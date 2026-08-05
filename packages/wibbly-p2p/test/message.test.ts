import { describe, expect, it } from 'vitest';
import type { GestureEvent } from '@vulos/wibbly-input';
import { encodePeerMessage, gestureToWire, wireToGesture } from '../src/message';

// `Partial<GestureEvent>`, not used here: this helper is also how tests
// simulate `vector`/`detail` being genuinely ABSENT (see the "omits vector
// and detail entirely" case below), which means explicitly passing `vector:
// undefined` / `detail: undefined` to override the concrete defaults below —
// a real, intentional `| undefined` override on just those two optional
// fields, not a `Partial`'s "key omitted entirely" shape that
// `exactOptionalPropertyTypes` would otherwise reject.
type GestureOverride = Partial<Omit<GestureEvent, 'vector' | 'detail'>> & {
  vector?: GestureEvent['vector'] | undefined;
  detail?: GestureEvent['detail'] | undefined;
};

function gesture(over: GestureOverride = {}): GestureEvent {
  const merged: GestureOverride = {
    playerId: 'player_2',
    kind: 'swing',
    confidence: 0.8,
    vector: { x: 0.125, y: -0.0625 },
    tCapture: 1_763_000_000_123,
    detail: { direction: 'right', stroke: 'forehand', speed: 0.004 },
    ...over,
  };
  // A real GestureEvent never has `vector`/`detail` present-but-undefined —
  // a producer either has one or doesn't include the key at all. `over`
  // passing explicit `undefined` is this test file's way of asking for
  // "absent"; deleting the key here is what actually produces that shape,
  // rather than a `GestureEvent`-typed value that merely claims to.
  if (merged.vector === undefined) delete merged.vector;
  if (merged.detail === undefined) delete merged.detail;
  return merged as GestureEvent;
}

describe('gestureToWire / wireToGesture', () => {
  it('round-trips a full gesture', () => {
    const ev = gesture();
    const wire = gestureToWire(ev);
    expect(wireToGesture(wire)).toEqual(ev);
  });

  it('round-trips a 3D vector, keeping z only when present', () => {
    const withZ = gesture({ vector: { x: 1, y: 2, z: 3 } });
    expect(gestureToWire(withZ).vector).toEqual({ x: 1, y: 2, z: 3 });

    const withoutZ = gesture({ vector: { x: 1, y: 2 } });
    const wire = gestureToWire(withoutZ);
    expect(wire.vector).toEqual({ x: 1, y: 2 });
    expect(wire.vector).not.toHaveProperty('z');
  });

  it('omits vector and detail entirely when absent, rather than sending null', () => {
    const ev = gesture({ vector: undefined, detail: undefined });
    const wire = gestureToWire(ev);
    expect('vector' in wire).toBe(false);
    expect('detail' in wire).toBe(false);
    expect(Object.keys(wireToGesture(wire)).sort()).toEqual(
      ['confidence', 'kind', 'playerId', 'tCapture'].sort(),
    );
  });

  it('is JSON-safe: encoding then parsing reproduces the wire object', () => {
    const wire = gestureToWire(gesture());
    const json = JSON.stringify(wire);
    expect(JSON.parse(json)).toEqual(wire);
  });
});

describe('encodePeerMessage', () => {
  it('produces valid JSON for both message kinds', () => {
    const g = encodePeerMessage({ type: 'gesture', seq: 1, event: gestureToWire(gesture()) });
    expect(JSON.parse(g)).toMatchObject({ type: 'gesture', seq: 1 });

    const s = encodePeerMessage({ type: 'state', seq: 2, state: { ball: { x: 1, y: 2 } } });
    expect(JSON.parse(s)).toEqual({ type: 'state', seq: 2, state: { ball: { x: 1, y: 2 } } });
  });
});
