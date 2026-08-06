/**
 * The DOM adapter: turns `GestureController`'s `PointerCommand`s into real
 * browser events, dispatched at real viewport coordinates — a virtual mouse.
 *
 * WHY DOM DISPATCH, NOT A HAND-ROLLED RAYCASTER: this game's whole
 * mouse-driven interaction surface (object select/delete, port-to-port
 * connection start/complete, object drag) is wired through ordinary React
 * Three Fiber event props (`onPointerDown`, `onClick`, plus each object
 * component's own `document`-level `mousemove`/`mouseup` drag listeners —
 * see `objects/Pump.tsx`'s `handlePointerDown`) and ordinary DOM `<button>`
 * `onClick`s (the sidebar palette). Reusing that surface — instead of a
 * second, gesture-only reimplementation of hit-testing and drag — means
 * dispatching the exact same kind of events a real mouse or touchscreen
 * would, at the exact coordinates the gesture maps to. This is the standard
 * way non-mouse input (touch, stylus, VR controllers) drives an existing
 * pointer-based UI without it being rewritten for every input device.
 *
 * The event SEQUENCE below was read directly off `objects/Pump.tsx` (every
 * one of the 29 object components follows the identical pattern —
 * `handlePointerDown` on an invisible collision mesh, which either
 * immediately forwards `onClick` (non-draggable mode) or arms `document`-
 * level `mousemove`/`mouseup` listeners and decides click-vs-drag itself
 * from whether the pointer actually moved) and off `PlantScene.tsx`'s ports
 * (`onClick` only, no drag — the "two discrete clicks" connection flow
 * documented in PALMWORKS.md §3):
 *
 *   TAP   (down, then up with ~no movement — a select/click/port-tap):
 *     1. `pointerdown` at the down position, on whatever's actually there
 *        (`document.elementFromPoint`) — arms an object's own drag listeners.
 *     2. `mouseup` dispatched on `document` — reaches those listeners
 *        directly (`document` IS the target); with no intervening
 *        `mousemove`, the object's own logic classifies this as a click and
 *        calls its `onClick` prop itself. This is what makes a tap on an
 *        OBJECT (not a port) work with zero extra dispatch.
 *     3. `click` at the up position — ports and the sidebar palette have
 *        `onClick` with no drag machinery at all; only a real `click` event
 *        reaches them. No-op on an object mesh (it never registers a
 *        `click` listener — see above), so this is safe to always send.
 *
 *   DRAG  (down, then up with real movement — dragging an already-placed
 *          object, or drag-connecting one port toward another):
 *     1. `pointerdown` at the down position, same as above.
 *     2. `mousemove` dispatched on `document` for every intermediate `move`
 *        command — reaches the object's own drag listener directly.
 *     3. `mouseup` dispatched on `document` at the final position, WITHOUT a
 *        trailing `click` — the object's own logic has already seen
 *        movement and will not treat this as a click; dispatching a `click`
 *        here too could spuriously hit whatever the drop happened to land
 *        on (e.g. a port under the drop point).
 *
 * Deliberately real `MouseEvent`/`PointerEvent` construction, not a
 * hand-rolled fake — `elementFromPoint` and every framework's event system
 * (React's synthetic events included) key off the real constructors.
 */

import type { PointerCommand } from './gesture-controller';

export interface VirtualPointerOptions {
  /** Maps normalized [0,1] image-space coordinates to viewport client coordinates. */
  toClientPoint(x: number, y: number): { clientX: number; clientY: number };
  /** Injectable for tests; defaults to the real DOM. */
  root?: Document;
  /** Called with the element under the cursor whenever it changes — for a game-drawn cursor/hover affordance. Optional. */
  onHoverTarget?: (el: Element | null) => void;
}

/**
 * Mirrors a normalized image-space x coordinate for display.
 *
 * `wibbly-input`'s coordinate contract (types.ts) is deliberately
 * NOT mirrored — raw camera/image space, x increasing left-to-right as the
 * camera itself sees it. A front-facing camera pointed at the player is
 * NOT a mirror: moving your right hand to your right moves it toward the
 * LEFT side of that raw frame. Every camera-gesture UI mirrors the display
 * so the player's intuitive "move right, cursor moves right" holds — this is
 * exactly the "mirrored preview is a rendering concern" the coordinate
 * contract's own doc comment defers to the consumer. Exported and pure so
 * it is testable without a DOM.
 */
export function mirrorX(x: number): number {
  return 1 - x;
}

/**
 * jsdom (the test environment `vitest.config.ts` runs this suite under) has
 * never implemented the Pointer Events constructor — every real browser
 * this game actually ships to has — so `pointerdown`/`pointermove`
 * dispatch falls back to `MouseEvent` when `PointerEvent` is undefined.
 * DOM event dispatch matches listeners by the event's `type` STRING
 * (`addEventListener('pointerdown', ...)`), not by which constructor built
 * it, so a `MouseEvent` typed `'pointerdown'` still reaches the same
 * `onPointerDown` R3F prop / native listener a real `PointerEvent` would;
 * only pointer-specific fields (`pointerId`, `pointerType`) are absent,
 * which nothing this game reads off the event actually needs.
 */
const PointerEventCtor: typeof PointerEvent | typeof MouseEvent =
  typeof PointerEvent !== 'undefined' ? PointerEvent : MouseEvent;

function dispatchAt(
  Ctor: typeof PointerEvent | typeof MouseEvent,
  type: string,
  clientX: number,
  clientY: number,
  target: Element | Document,
): void {
  // `view` is deliberately omitted: it is optional on UIEventInit, nothing
  // in this game's event handlers reads it, and jsdom's `MouseEvent`
  // constructor rejects `document.defaultView` in some environments
  // (`member view is not of type Window`) even though it is the DOM-correct
  // value in a real browser — one more real-vs-jsdom Pointer/Mouse Events
  // gap alongside `PointerEventCtor`'s fallback above.
  const event = new Ctor(type, { bubbles: true, cancelable: true, clientX, clientY });
  target.dispatchEvent(event);
}

/**
 * Stateful (tracks whether a pointer is currently "down" and where, so
 * `move`/`up` know whether to treat this as a drag) but does no gesture
 * recognition of its own — see `GestureController` for that half.
 */
export class VirtualPointer {
  private opts: VirtualPointerOptions;
  private root: Document;
  private downTarget: Element | null = null;
  private lastHoverTarget: Element | null = null;

  constructor(opts: VirtualPointerOptions) {
    this.opts = opts;
    this.root = opts.root ?? document;
  }

  dispatch(command: PointerCommand): void {
    const { clientX, clientY } = this.opts.toClientPoint(command.x, command.y);
    const target = this.root.elementFromPoint?.(clientX, clientY) ?? null;

    if (target !== this.lastHoverTarget) {
      this.lastHoverTarget = target;
      this.opts.onHoverTarget?.(target);
    }

    if (command.type === 'move') {
      if (command.dragging) {
        // Reaches the object's own document-level drag listener directly.
        dispatchAt(MouseEvent, 'mousemove', clientX, clientY, this.root);
      } else if (target) {
        // Hover-only: lets R3F's own onPointerOver/onPointerMove-driven
        // affordances (port highlight colour, etc.) update live, the same
        // way they would under a real mouse moving with no button held.
        dispatchAt(PointerEventCtor, 'pointermove', clientX, clientY, target);
      }
      return;
    }

    if (command.type === 'down') {
      if (!target) return;
      this.downTarget = target;
      dispatchAt(PointerEventCtor, 'pointerdown', clientX, clientY, target);
      return;
    }

    if (command.type === 'up') {
      // mouseup on `document` unconditionally: an object's own drag
      // listener is registered there (see this file's module doc), and
      // must hear it regardless of what is or is not under the release
      // point — that is exactly the "release over empty space still ends
      // the drag" case a real mouseup gives for free.
      dispatchAt(MouseEvent, 'mouseup', clientX, clientY, this.root);

      if (command.tap && target) {
        dispatchAt(MouseEvent, 'click', clientX, clientY, target);
      }
      this.downTarget = null;
    }
  }

  /** True while a `down` has been dispatched with no matching `up` yet. */
  get isDown(): boolean {
    return this.downTarget !== null;
  }

  reset(): void {
    this.downTarget = null;
    this.lastHoverTarget = null;
  }
}
