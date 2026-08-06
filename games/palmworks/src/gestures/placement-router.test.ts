import { describe, expect, it } from 'vitest';
import { PlacementRouter, type LocateResult } from './placement-router';

function harness(locateResult: LocateResult, groundHit: { x: number; z: number } | null) {
  const placed: Array<{ type: string; x: number; z: number }> = [];
  const router = new PlacementRouter({
    locate: () => locateResult,
    raycastGround: () => groundHit,
    onPlace: (componentType, worldX, worldZ) => placed.push({ type: componentType, x: worldX, z: worldZ }),
  });
  return { router, placed };
}

describe('PlacementRouter — pick up a palette item, carry it, drop it on the grid', () => {
  it('a down over a palette item is consumed (picked up), NOT forwarded to the virtual pointer', () => {
    const { router } = harness({ kind: 'palette', componentType: 'pump' }, { x: 0, z: 0 });
    const consumed = router.route({ type: 'down', x: 0.1, y: 0.1 });
    expect(consumed).toBe(true);
    expect(router.pending).toBe('pump');
  });

  it('a down anywhere else is NOT consumed — normal select/connect/drag should proceed', () => {
    const { router } = harness({ kind: 'other' }, null);
    const consumed = router.route({ type: 'down', x: 0.5, y: 0.5 });
    expect(consumed).toBe(false);
    expect(router.pending).toBeNull();
  });

  it('moves while a placement is pending are consumed (swallowed, no ghost preview yet) rather than forwarded', () => {
    const { router } = harness({ kind: 'palette', componentType: 'boiler' }, { x: 0, z: 0 });
    router.route({ type: 'down', x: 0.05, y: 0.05 });
    const consumed = router.route({ type: 'move', x: 0.4, y: 0.4, dragging: true });
    expect(consumed).toBe(true);
  });

  it('an up while a placement is pending calls onPlace with the raycast ground position and clears pending', () => {
    const { router, placed } = harness({ kind: 'palette', componentType: 'storageTank' }, { x: 3.5, z: -2 });
    router.route({ type: 'down', x: 0.05, y: 0.05 });
    router.route({ type: 'move', x: 0.4, y: 0.4, dragging: true });
    const consumed = router.route({ type: 'up', x: 0.4, y: 0.4, tap: false });

    expect(consumed).toBe(true);
    expect(placed).toEqual([{ type: 'storageTank', x: 3.5, z: -2 }]);
    expect(router.pending).toBeNull();
  });

  it('an up that misses the ground (no plane intersection) still clears pending, without placing anything', () => {
    const { router, placed } = harness({ kind: 'palette', componentType: 'valve' }, null);
    router.route({ type: 'down', x: 0.05, y: 0.05 });
    router.route({ type: 'up', x: 0.9, y: 0.9, tap: true });

    expect(placed).toEqual([]);
    expect(router.pending).toBeNull();
  });

  it('a QUICK tap on a palette item (down, up with barely any movement) still places it — placement does not require a drag', () => {
    const { router, placed } = harness({ kind: 'palette', componentType: 'sensor' }, { x: 1, z: 1 });
    router.route({ type: 'down', x: 0.05, y: 0.05 });
    const consumed = router.route({ type: 'up', x: 0.06, y: 0.05, tap: true });

    expect(consumed).toBe(true);
    expect(placed).toEqual([{ type: 'sensor', x: 1, z: 1 }]);
  });

  it('an up with nothing pending is not consumed', () => {
    const { router } = harness({ kind: 'other' }, { x: 0, z: 0 });
    const consumed = router.route({ type: 'up', x: 0.5, y: 0.5, tap: true });
    expect(consumed).toBe(false);
  });

  it('reset() drops a pending pick-up', () => {
    const { router, placed } = harness({ kind: 'palette', componentType: 'pump' }, { x: 0, z: 0 });
    router.route({ type: 'down', x: 0.05, y: 0.05 });
    router.reset();
    router.route({ type: 'up', x: 0.05, y: 0.05, tap: true });
    expect(placed).toEqual([]); // reset before the drop -> nothing placed
  });
});
