import { describe, expect, it } from 'vitest';
import { VirtualPointer, mirrorX } from './virtual-pointer';

describe('mirrorX', () => {
  it('flips normalized x for display — a front camera is not a mirror', () => {
    expect(mirrorX(0)).toBe(1);
    expect(mirrorX(1)).toBe(0);
    expect(mirrorX(0.3)).toBeCloseTo(0.7, 10);
  });
});

/** identity client-point mapping: normalized coords used directly as pixel coords, so assertions can use round numbers. */
function identityMap(x: number, y: number) {
  return { clientX: x, clientY: y };
}

/**
 * jsdom has no real layout engine, so `document.elementFromPoint` always
 * returns `null` — every real browser answers it from actual layout. Tests
 * stub it to whatever the scenario needs, exactly the way a hit-testing
 * result would arrive in production. Typed narrowly (not `any`) so the
 * override itself stays type-checked.
 */
function stubElementFromPoint(getTarget: () => Element | null): void {
  (document as unknown as { elementFromPoint: (x: number, y: number) => Element | null }).elementFromPoint = () =>
    getTarget();
}

describe('VirtualPointer — dispatches real DOM events, mirroring what a real mouse produces', () => {
  it('a TAP (down, then up with tap:true) fires pointerdown, document mouseup, and a click at the release target', () => {
    const target = document.createElement('button');
    const seen: string[] = [];
    target.addEventListener('pointerdown', () => seen.push('pointerdown@target'));
    target.addEventListener('click', () => seen.push('click@target'));
    document.addEventListener('mouseup', () => seen.push('mouseup@document'));

    stubElementFromPoint(() => target);

    const vp = new VirtualPointer({ toClientPoint: identityMap });
    vp.dispatch({ type: 'down', x: 10, y: 10 });
    vp.dispatch({ type: 'up', x: 10, y: 10, tap: true });

    expect(seen).toEqual(['pointerdown@target', 'mouseup@document', 'click@target']);
  });

  it('a DRAG (down, moves, then up with tap:false) fires pointerdown, document mousemove per move, document mouseup, and NO click', () => {
    const target = document.createElement('div');
    const seen: string[] = [];
    target.addEventListener('pointerdown', () => seen.push('pointerdown@target'));
    target.addEventListener('click', () => seen.push('click@target'));
    document.addEventListener('mousemove', () => seen.push('mousemove@document'));
    document.addEventListener('mouseup', () => seen.push('mouseup@document'));

    stubElementFromPoint(() => target);

    const vp = new VirtualPointer({ toClientPoint: identityMap });
    vp.dispatch({ type: 'down', x: 10, y: 10 });
    vp.dispatch({ type: 'move', x: 20, y: 10, dragging: true });
    vp.dispatch({ type: 'move', x: 30, y: 10, dragging: true });
    vp.dispatch({ type: 'up', x: 30, y: 10, tap: false });

    expect(seen).toEqual([
      'pointerdown@target',
      'mousemove@document',
      'mousemove@document',
      'mouseup@document',
      // no click@target
    ]);
    expect(seen).not.toContain('click@target');
  });

  it('a hover-only move (no pinch down) fires pointermove at the hovered element, not document', () => {
    const target = document.createElement('div');
    const moves: number[] = [];
    target.addEventListener('pointermove', (e) => moves.push((e as MouseEvent).clientX));

    stubElementFromPoint(() => target);

    const vp = new VirtualPointer({ toClientPoint: identityMap });
    vp.dispatch({ type: 'move', x: 42, y: 5, dragging: false });

    expect(moves).toEqual([42]);
  });

  it('onHoverTarget fires exactly when the element under the cursor changes', () => {
    const a = document.createElement('div');
    const b = document.createElement('div');
    let current = a;
    stubElementFromPoint(() => current);

    const seen: Array<Element | null> = [];
    const vp = new VirtualPointer({ toClientPoint: identityMap, onHoverTarget: (el) => seen.push(el) });

    vp.dispatch({ type: 'move', x: 1, y: 1, dragging: false }); // a: first sighting, fires
    vp.dispatch({ type: 'move', x: 2, y: 1, dragging: false }); // still a: no fire
    current = b;
    vp.dispatch({ type: 'move', x: 3, y: 1, dragging: false }); // now b: fires

    expect(seen).toEqual([a, b]);
  });

  it('release over empty space (nothing under the point) still ends the drag via document mouseup', () => {
    const target = document.createElement('div');
    let current: Element | null = target;
    stubElementFromPoint(() => current);

    const seen: string[] = [];
    document.addEventListener('mouseup', () => seen.push('mouseup@document'));
    target.addEventListener('click', () => seen.push('click@target'));

    const vp = new VirtualPointer({ toClientPoint: identityMap });
    vp.dispatch({ type: 'down', x: 5, y: 5 });
    current = null; // released over nothing
    vp.dispatch({ type: 'up', x: 999, y: 999, tap: true });

    expect(seen).toEqual(['mouseup@document']); // mouseup still fires; no click target to hit
    expect(vp.isDown).toBe(false);
  });

  it('reset() clears down state', () => {
    const target = document.createElement('div');
    stubElementFromPoint(() => target);

    const vp = new VirtualPointer({ toClientPoint: identityMap });
    vp.dispatch({ type: 'down', x: 1, y: 1 });
    expect(vp.isDown).toBe(true);
    vp.reset();
    expect(vp.isDown).toBe(false);
  });
});
