/**
 * Pure gesture -> virtual-pointer translation.
 *
 * This is the "decide" half of the extract+validate split this whole
 * platform uses (see `packages/wibbly-input/src/recognizers/pinch.ts`'s own
 * doc comment): `HandInput` (extract) hands us real `GestureEvent`s;
 * `GestureController` (decide) turns a `pinch`/`point` stream into an
 * ordinary virtual-mouse command stream — `move` / `down` / `up` — with
 * normalized [0,1] image-space coordinates. Nothing here touches the DOM,
 * Three.js, or React; `virtual-pointer.ts` is the thin adapter that turns
 * these commands into real browser events, and this split is what makes this
 * file testable with synthetic hand fixtures and no jsdom at all.
 *
 * The mapping (mirrors PALMWORKS.md §4's "point supplies the cursor, pinch
 * supplies the click" framing):
 *   - `point` (`start`/`hold`) moves the cursor to the aim ray's origin
 *     (the fingertip position) whenever no pinch is currently held.
 *   - `pinch start` emits `down` at the pinch midpoint and takes over the
 *     cursor from `point` — a real hand's other fingers are not reliably
 *     "index extended, rest curled" mid-pinch, so `point` may drop out here,
 *     and even where it does not, the pinch is the more precise signal for
 *     WHERE the down happened.
 *   - `pinch hold` emits `move` at the current midpoint (this is what a
 *     drag needs: dragging an object, dragging a ghost placement preview,
 *     or dragging a connection from one port to another).
 *   - `pinch release` emits `up`, tagged `tap: true` when the midpoint
 *     barely moved since `start` (using `detail.delta`, which
 *     `PinchRecognizer` already computes) — a tap is a click-equivalent
 *     (select / start-or-complete a port connection); a non-tap release is
 *     drag-completion (drop a placed object, drop a dragged one).
 *
 * Only ONE local player's cursor is driven at a time (whichever hand's pinch
 * is active takes priority over the other hand's `point`) — two-hand
 * compound gestures (the camera-orbit mapping in PALMWORKS.md §4.2) are
 * explicitly out of this pass's scope; that is a documented scope cut, not
 * an oversight.
 */

import type { GestureEvent, Vector2 } from '@vulos/wibbly-input/hand';

export interface PointerMoveCommand {
  type: 'move';
  x: number;
  y: number;
  /** True while a pinch is down and this move is a drag, not a hover. */
  dragging: boolean;
}

export interface PointerDownCommand {
  type: 'down';
  x: number;
  y: number;
}

export interface PointerUpCommand {
  type: 'up';
  x: number;
  y: number;
  /** Barely moved since `down` — a click-equivalent, not a completed drag. */
  tap: boolean;
}

export type PointerCommand = PointerMoveCommand | PointerDownCommand | PointerUpCommand;

export interface GestureControllerConfig {
  /**
   * Normalized-image-space distance (see wibbly-input's coordinate contract)
   * below which a pinch start->release counts as a TAP rather than a drag.
   *
   * NOT an arbitrary "feels about right" number — it has to clear a real
   * geometric floor. `PinchRecognizer`'s own hysteresis band (pinch.ts)
   * means a release-by-separating-fingers ALWAYS moves the measured
   * midpoint by at least `exitRatio * handScale / 2` (half of the
   * thumb-index gap that must open to cross `exitRatio`, since the midpoint
   * sits between them) — at the library's `DEFAULT_PINCH_CONFIG`
   * (`exitRatio: 0.5`) that floor is `0.25 * handScale`, i.e. genuinely
   * unavoidable even for a hand held perfectly still except for the pinch
   * itself opening. `tapThreshold` must sit comfortably above that floor or
   * every real tap would misclassify as a drag; 0.05 clears it with margin
   * for ordinary hand scales (`handScale` around 0.12-0.2 in typical
   * framing) while staying well under a deliberate drag to a different grid
   * cell or a distant port (routinely 0.1+).
   */
  tapThreshold: number;
}

export const DEFAULT_GESTURE_CONTROLLER_CONFIG: GestureControllerConfig = {
  tapThreshold: 0.05,
};

function magnitude(v: Vector2): number {
  return Math.hypot(v.x, v.y);
}

/**
 * Stateful (which hand currently owns the cursor, whether a pinch is
 * mid-drag) but otherwise pure — `feed` takes one `GestureEvent` and returns
 * the `PointerCommand`s it produces (zero, one, or in principle more than
 * one; today always zero or one). No I/O, no DOM, no clock of its own (it
 * trusts `event.tCapture`/phase only).
 */
export class GestureController {
  private config: GestureControllerConfig;
  private pinchDown = false;
  /** Which hand is currently driving the pinch, so a second hand's point/pinch does not steal the cursor mid-drag. */
  private pinchHand: 'left' | 'right' | null = null;

  constructor(config: Partial<GestureControllerConfig> = {}) {
    this.config = { ...DEFAULT_GESTURE_CONTROLLER_CONFIG, ...config };
  }

  feed(event: GestureEvent): PointerCommand[] {
    if (event.kind === 'pinch') return this.feedPinch(event);
    if (event.kind === 'point') return this.feedPoint(event);
    return [];
  }

  private feedPinch(event: GestureEvent): PointerCommand[] {
    const phase = event.detail?.phase as string | undefined;
    const hand = event.detail?.hand as 'left' | 'right' | undefined;
    const pos = event.vector;
    if (!pos) return [];

    if (phase === 'start') {
      this.pinchDown = true;
      this.pinchHand = hand ?? null;
      return [{ type: 'down', x: pos.x, y: pos.y }];
    }

    // A hold/release from a hand that does not own the current pinch is
    // stale (e.g. arrived after the owning hand already released) — ignored
    // rather than corrupting an unrelated drag.
    if (hand !== undefined && this.pinchHand !== null && hand !== this.pinchHand) return [];

    if (phase === 'hold') {
      if (!this.pinchDown) return [];
      return [{ type: 'move', x: pos.x, y: pos.y, dragging: true }];
    }

    if (phase === 'release') {
      if (!this.pinchDown) return [];
      this.pinchDown = false;
      this.pinchHand = null;
      const delta = (event.detail?.delta as Vector2 | undefined) ?? { x: 0, y: 0 };
      const tap = magnitude(delta) < this.config.tapThreshold;
      return [{ type: 'up', x: pos.x, y: pos.y, tap }];
    }

    return [];
  }

  private feedPoint(event: GestureEvent): PointerCommand[] {
    // A pinch in progress owns the cursor — point-driven hover would fight a
    // live drag frame to frame.
    if (this.pinchDown) return [];

    const phase = event.detail?.phase as string | undefined;
    if (phase !== 'start' && phase !== 'hold') return [];

    const origin = event.detail?.origin as Vector2 | undefined;
    if (!origin) return [];

    return [{ type: 'move', x: origin.x, y: origin.y, dragging: false }];
  }

  reset(): void {
    this.pinchDown = false;
    this.pinchHand = null;
  }
}
