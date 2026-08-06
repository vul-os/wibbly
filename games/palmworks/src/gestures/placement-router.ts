/**
 * "Pinch to place" needs one thing `virtual-pointer.ts` cannot give it: the
 * sidebar palette is a plain DOM `<button>` with only a `click` handler
 * (`addObject(type)`, at a random spot) — there is no drag concept on a
 * `<button>` to reuse the way object-dragging reuses `objects/Pump.tsx`'s
 * own `mousemove`/`mouseup` machinery. A gesture-driven "pick up this
 * palette item, carry it over the grid, drop it at the pinch position"
 * therefore cannot be expressed as ordinary DOM dispatch — it needs its own
 * small state machine, kept separate from (and running IN FRONT of)
 * `VirtualPointer` so the two never fight over the same `down`/`up` pair.
 *
 * `locate`/`raycastGround`/`onPlace` are injected so this is testable with
 * synthetic fixtures — no DOM, no `<Canvas>`, no camera. The production
 * caller (`use-hand-gesture-input.tsx`) supplies real
 * `document.elementFromPoint` + a `THREE.Raycaster` against the ground
 * plane + `PlantSceneHandle.addObject`.
 */

import type { PointerCommand } from './gesture-controller';

export type LocateResult =
  | { kind: 'palette'; componentType: string }
  | { kind: 'other' };

export interface PlacementRouterCallbacks {
  /** What is under this normalized [0,1] point right now? */
  locate(x: number, y: number): LocateResult;
  /** Normalized [0,1] point -> ground-plane (y=0) world (x, z), or null if the ray does not hit the ground. */
  raycastGround(x: number, y: number): { x: number; z: number } | null;
  onPlace(componentType: string, worldX: number, worldZ: number): void;
}

export class PlacementRouter {
  private pendingType: string | null = null;

  constructor(private readonly cb: PlacementRouterCallbacks) {}

  /** True while an equipment type has been "picked up" and not yet dropped. */
  get pending(): string | null {
    return this.pendingType;
  }

  /**
   * Returns true if this command was a placement pick-up/drag/drop and was
   * fully handled — the caller must NOT also forward it to `VirtualPointer`.
   * Returns false for anything this router has no opinion on, which the
   * caller should dispatch normally (select / port-connect / object-drag).
   */
  route(command: PointerCommand): boolean {
    if (command.type === 'down') {
      if (this.pendingType) return true; // a stray second down while one is already pending — swallow, not a new pick-up
      const hit = this.cb.locate(command.x, command.y);
      if (hit.kind === 'palette') {
        this.pendingType = hit.componentType;
        return true;
      }
      return false;
    }

    if (!this.pendingType) return false; // no placement in progress — nothing for this router to do

    if (command.type === 'move') return true; // swallowed — a future ghost-preview hook would read `pending` + the move position here

    // command.type === 'up'
    const ground = this.cb.raycastGround(command.x, command.y);
    if (ground) this.cb.onPlace(this.pendingType, ground.x, ground.z);
    this.pendingType = null;
    return true;
  }

  reset(): void {
    this.pendingType = null;
  }
}
