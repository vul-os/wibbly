import { describe, expect, it } from 'vitest';
import { PinchRecognizer, PointRecognizer, type GestureEvent } from '@vulos/wibbly-input/hand';
import { GestureController } from './gesture-controller';
import { foldFinger, makeHand, makePointingHand, pinchOverride } from './test-hand-fixtures';

const PLAYER = 'player_1';

/** Feeds one Hand through real recognizers and returns whatever GestureEvents they emit this frame. */
function tick(pinch: PinchRecognizer, point: PointRecognizer, hand: ReturnType<typeof makeHand>, t: number): GestureEvent[] {
  const bound = [{ ...hand, playerId: PLAYER }];
  return [...pinch.feed(bound, t), ...point.feed(bound, t)];
}

describe('GestureController — pinch/point -> virtual pointer commands (real recognizers, synthetic hands)', () => {
  it('an open hand pointing (index extended) drives cursor `move` commands, not down/up', () => {
    const pinch = new PinchRecognizer();
    const point = new PointRecognizer();
    const controller = new GestureController();

    const moves: Array<{ x: number; y: number }> = [];
    for (let i = 0; i < 2; i++) {
      const hand = makePointingHand({ cx: 0.4 + i * 0.01, cy: 0.5, scale: 0.15 });
      for (const event of tick(pinch, point, hand, 1000 + i * 33)) {
        for (const cmd of controller.feed(event)) {
          expect(cmd.type).toBe('move');
          if (cmd.type === 'move') moves.push({ x: cmd.x, y: cmd.y });
        }
      }
    }
    expect(moves.length).toBeGreaterThan(0);
  });

  it('a pinch start->hold->release produces down -> move -> up, following the real pinch midpoint', () => {
    const pinch = new PinchRecognizer();
    const point = new PointRecognizer();
    const controller = new GestureController();
    const commands: ReturnType<GestureController['feed']>[number][] = [];

    const cx = 0.5;
    // pinchOverride places thumb_tip exactly on index_tip's own layout
    // position (HAND_LAYOUT.index_tip = [0.5, -2.4] * scale from the hand's
    // (cx, cy)) — the pinch MIDPOINT therefore sits at (cx + 0.075, cy -
    // 0.36) at scale 0.15, not at (cx, cy) itself. Computed once here rather
    // than hand-derived per assertion, so a change to that fixture geometry
    // fails this test loudly instead of silently drifting.
    const [idx, idy] = [0.5, -2.4];
    const scale = 0.15;
    const midpointFor = (hcx: number, hcy: number) => ({ x: hcx + idx * scale, y: hcy + idy * scale });

    // enterFrames=2: two pinching frames to START.
    for (let i = 0; i < 2; i++) {
      const hand = makeHand({ cx, cy: 0.5, scale, overrides: pinchOverride(cx, 0.5, scale) });
      for (const event of tick(pinch, point, hand, 1000 + i * 33)) commands.push(...controller.feed(event));
    }
    // Hold, dragging well past the tap threshold.
    const cxHold = 0.7;
    const holdHand = makeHand({ cx: cxHold, cy: 0.5, scale, overrides: pinchOverride(cxHold, 0.5, scale) });
    for (const event of tick(pinch, point, holdHand, 1100)) commands.push(...controller.feed(event));
    // Release, still held at the dragged-to position.
    for (const event of tick(pinch, point, makeHand({ cx: cxHold, cy: 0.5, scale }), 1133)) {
      commands.push(...controller.feed(event));
    }

    expect(commands.map((c) => c.type)).toEqual(['down', 'move', 'up']);
    const down = commands[0];
    if (down.type !== 'down') throw new Error('expected down');
    const expectedDown = midpointFor(cx, 0.5);
    expect(down.x).toBeCloseTo(expectedDown.x, 5);
    expect(down.y).toBeCloseTo(expectedDown.y, 5);

    const hold = commands[1];
    if (hold.type !== 'move') throw new Error('expected move');
    expect(hold.dragging).toBe(true);

    const up = commands[2];
    if (up.type !== 'up') throw new Error('expected up');
    // Dragged from cx=0.5 to cx=0.7 — unambiguously a drag, not a tap.
    expect(up.tap).toBe(false);
  });

  it('a pinch release with essentially zero midpoint displacement is classified a TAP', () => {
    // Exercises GestureController's OWN classification threshold directly,
    // rather than fighting PinchRecognizer's geometry — a genuine
    // finger-lift-to-release naturally moves the measured midpoint by
    // roughly half the exit-ratio distance (see pinch.ts's hysteresis band),
    // so reproducing an exactly-zero-delta release through the real
    // recognizer needs several missed-frame ticks (occlusion), a different
    // scenario from "the player tapped". Both paths are real: this test
    // proves the tap/non-tap boundary in the controller; the test above
    // proves the full recognizer -> controller wiring for a real drag.
    const controller = new GestureController();

    const down: GestureEvent = {
      playerId: PLAYER,
      kind: 'pinch',
      confidence: 1,
      vector: { x: 0.5, y: 0.5 },
      tCapture: 2000,
      detail: { phase: 'start', hand: 'right' },
    };
    expect(controller.feed(down)).toEqual([{ type: 'down', x: 0.5, y: 0.5 }]);

    const release: GestureEvent = {
      playerId: PLAYER,
      kind: 'pinch',
      confidence: 0,
      vector: { x: 0.501, y: 0.499 },
      tCapture: 2066,
      detail: { phase: 'release', hand: 'right', delta: { x: 0.001, y: -0.001 } },
    };
    const commands = controller.feed(release);
    expect(commands).toHaveLength(1);
    expect(commands[0]).toMatchObject({ type: 'up', tap: true });
  });

  it('point is ignored while a pinch is down — the pinch owns the cursor mid-drag', () => {
    const pinch = new PinchRecognizer();
    const point = new PointRecognizer();
    const controller = new GestureController();

    const cx = 0.5;
    for (let i = 0; i < 2; i++) {
      const hand = makeHand({ cx, cy: 0.5, scale: 0.15, overrides: pinchOverride(cx, 0.5, 0.15) });
      for (const event of tick(pinch, point, hand, 3000 + i * 33)) controller.feed(event);
    }

    // A synthetic 'point start' event arrives (as it would from the OTHER
    // hand) while the pinch is still down — must be dropped, not steal the cursor.
    const pointStart: GestureEvent = {
      playerId: PLAYER,
      kind: 'point',
      confidence: 1,
      tCapture: 3100,
      detail: { phase: 'start', origin: { x: 0.1, y: 0.1 } },
    };
    expect(controller.feed(pointStart)).toEqual([]);
  });

  it('reset() drops in-progress pinch state so a stray release afterward produces nothing', () => {
    const pinch = new PinchRecognizer();
    const point = new PointRecognizer();
    const controller = new GestureController();

    const cx = 0.5;
    for (let i = 0; i < 2; i++) {
      const hand = makeHand({ cx, cy: 0.5, scale: 0.15, overrides: pinchOverride(cx, 0.5, 0.15) });
      for (const event of tick(pinch, point, hand, 4000 + i * 33)) controller.feed(event);
    }
    controller.reset();

    const staleRelease: GestureEvent = {
      playerId: PLAYER,
      kind: 'pinch',
      confidence: 0,
      vector: { x: cx, y: 0.5 },
      tCapture: 4200,
      detail: { phase: 'release', hand: 'right', delta: { x: 0, y: 0 } },
    };
    expect(controller.feed(staleRelease)).toEqual([]);
  });

  it('a curled-finger (non-pointing) hand produces no commands at all', () => {
    const pinch = new PinchRecognizer();
    const point = new PointRecognizer();
    const controller = new GestureController();

    const commands: ReturnType<GestureController['feed']>[number][] = [];
    for (let i = 0; i < 2; i++) {
      // Fist: everything curled, including index — never satisfies detectPoint or the pinch ratio.
      const hand = makeHand({
        cx: 0.5,
        cy: 0.5,
        scale: 0.15,
        overrides: {
          ...foldFinger(0.5, 0.5, 0.15, 'index'),
          ...foldFinger(0.5, 0.5, 0.15, 'middle'),
          ...foldFinger(0.5, 0.5, 0.15, 'ring'),
          ...foldFinger(0.5, 0.5, 0.15, 'pinky'),
        },
      });
      for (const event of tick(pinch, point, hand, 5000 + i * 33)) commands.push(...controller.feed(event));
    }
    expect(commands).toEqual([]);
  });
});
