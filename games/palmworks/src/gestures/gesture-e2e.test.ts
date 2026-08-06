/**
 * End-to-end proof: synthetic HAND fixtures, fed through the REAL
 * MediaPipe-shaped recognizers (`PinchRecognizer`/`PointRecognizer` from
 * `@vulos/wibbly-input/hand`, unmocked) and the REAL `GestureController` +
 * `PlacementRouter` + `plant-scene-logic.ts` this game ships, produce REAL
 * game-state changes: an object gets placed on the grid, a port gets
 * selected (a pending connection starts), and a connection gets created
 * between two named ports.
 *
 * WHAT IS REAL vs WHAT IS FAKED, STATED PLAINLY (per this pass's own
 * verification requirement — a claim of full coverage here would be false):
 *
 *   REAL: hand landmark fixtures -> PinchRecognizer/PointRecognizer (the
 *   actual MediaPipe-consuming recognizers) -> GestureController (this
 *   game's pinch/point -> down/move/up translation) -> PlacementRouter
 *   (palette pick-up/drop routing) -> plant-scene-logic.ts's
 *   placementPosition/canPortsConnect/buildConnection (the exact functions
 *   PlantScene.tsx imports and calls for mouse play too, see that file).
 *
 *   FAKED: "what is under the cursor at this screen position" — in
 *   production that answer comes from `document.elementFromPoint` plus
 *   React Three Fiber's own WebGL raycaster (see `virtual-pointer.ts`'s
 *   module doc), neither of which a headless vitest/jsdom run can exercise
 *   (jsdom has no layout engine and no WebGL). `virtual-pointer.test.ts`
 *   separately proves the DOM EVENT SEQUENCE that hit-test would trigger
 *   (pointerdown/mousemove/mouseup/click, tap vs drag) against generic DOM
 *   elements. What THIS file cannot prove, and does not claim to: that a
 *   real R3F raycaster, in a real browser, hits the exact meshes these
 *   fixtures expect. That link is real code (unchanged PlantScene/object
 *   components), not stubbed — but it is unverified by automated test here,
 *   same honest gap PALMWORKS.md §5 already flagged for the recognizer
 *   thresholds themselves ("no camera/GPU available while building this").
 */

import { describe, expect, it } from 'vitest';
import { PinchRecognizer, PointRecognizer, type GestureEvent } from '@vulos/wibbly-input/hand';
import { GestureController, type PointerCommand } from './gesture-controller';
import { PlacementRouter, type LocateResult } from './placement-router';
import { makeHand, pinchOverride, pinchReleaseOverride } from './test-hand-fixtures';
import {
  buildConnection,
  canPortsConnect,
  placementPosition,
  type PlantConnection,
  type PlantObject,
  type PortData,
} from '../pages/viz/components/plant-scene-logic';

const PLAYER = 'player_1';

/** Feeds one Hand through the real recognizers for one frame. */
function tick(pinch: PinchRecognizer, point: PointRecognizer, hand: ReturnType<typeof makeHand>, t: number): GestureEvent[] {
  const bound = [{ ...hand, playerId: PLAYER }];
  return [...pinch.feed(bound, t), ...point.feed(bound, t)];
}

/** Drives a full pinch start(x2 frames)->hold->release sequence at the given path, through the real recognizers + GestureController, returning every PointerCommand produced. */
function drivePinch(
  controller: GestureController,
  path: Array<{ cx: number; cy: number }>,
  startT = 1000,
): PointerCommand[] {
  const pinch = new PinchRecognizer();
  const point = new PointRecognizer();
  const commands: PointerCommand[] = [];
  const scale = 0.15;

  // enterFrames=2: hold the FIRST path point for two frames to cross the
  // pinch-start hysteresis, then walk the rest of the path one frame each.
  const frames = [path[0], path[0], ...path.slice(1)];
  frames.forEach((p, i) => {
    const hand = makeHand({ cx: p.cx, cy: p.cy, scale, overrides: pinchOverride(p.cx, p.cy, scale) });
    for (const event of tick(pinch, point, hand, startT + i * 33)) commands.push(...controller.feed(event));
  });
  // Release: fingers separate just past PinchRecognizer's exit boundary at
  // the final path position — see pinchReleaseOverride's own doc for why
  // this (not a fully-open resting hand) is the realistic release pose.
  const last = path[path.length - 1];
  const releaseHand = makeHand({ cx: last.cx, cy: last.cy, scale, overrides: pinchReleaseOverride(last.cx, last.cy, scale) });
  for (const event of tick(pinch, point, releaseHand, startT + frames.length * 33)) {
    commands.push(...controller.feed(event));
  }

  return commands;
}

describe('gesture-e2e: pinch to place a real object on the grid', () => {
  it('a pinch that starts over the palette and releases over the grid places the object at the raycast-hit, grid-snapped position', () => {
    const controller = new GestureController();
    const objects: PlantObject[] = [];
    let objectIdCounter = 0;
    const GRID_SNAP = true;
    const GRID_SIZE = 1;

    const router = new PlacementRouter({
      // Mirrors use-hand-gesture-input.ts's locateFromDom: "left strip of
      // the screen" is the palette in this fake, matching the real
      // sidebar's actual on-screen position (left edge).
      locate: (x): LocateResult => (x < 0.2 ? { kind: 'palette', componentType: 'pump' } : { kind: 'other' }),
      // Mirrors GestureRaycastBridge's real ground-plane raycast with a
      // simple deterministic mapping instead of an actual THREE.Camera —
      // the geometry of screen->world is R3F/Three's, already exercised by
      // that component; what matters here is that PlacementRouter calls it
      // with the RIGHT release coordinates and does the RIGHT thing with
      // the result.
      raycastGround: (x, y) => ({ x: x * 20 - 10, z: y * 20 - 10 }),
      onPlace: (componentType, worldX, worldZ) => {
        // The exact body of PlantScene's addObject imperative handle (see
        // PlantScene.tsx) — real plant-scene-logic.placementPosition, not a
        // re-implementation.
        objects.push({
          id: objectIdCounter++,
          type: componentType,
          position: placementPosition(worldX, worldZ, componentType, GRID_SNAP, GRID_SIZE),
          connections: [],
        });
      },
    });

    // Pinch starts inside the palette (x=0.05) and drags to a grid spot,
    // walking through several real hand-tracking frames — a real drag, not
    // an instantaneous teleport. cy stays >= 0.5 throughout: the fixture
    // hand's fingers extend UPWARD (negative y) from the wrist by up to
    // 2.4x scale (see test-hand-fixtures.ts's HAND_LAYOUT), so a small cy
    // combined with cx near the left edge pushes index_tip/thumb_tip
    // outside the [-0.05, 1.05] in-frame margin and samplePinch legitimately
    // returns null — the same real constraint a player's hand leaving frame
    // would hit, not a fixture bug to route around.
    const path = [
      { cx: 0.05, cy: 0.5 },
      { cx: 0.3, cy: 0.5 },
      { cx: 0.6, cy: 0.5 },
      { cx: 0.62, cy: 0.53 }, // release point
    ];
    const commands = drivePinch(controller, path, 1000);
    // drivePinch holds path[0] for 2 frames (crossing PinchRecognizer's
    // enterFrames=2 hysteresis) before walking the rest of `path` one frame
    // each, then releases — 1 down, (path.length - 1) holds as `move`, 1 up.
    expect(commands.map((c) => c.type)).toEqual(['down', 'move', 'move', 'move', 'up']);

    for (const command of commands) router.route(command);

    expect(objects).toHaveLength(1);
    expect(objects[0].type).toBe('pump');
    // The 'up' command's (x, y) is the REAL PinchRecognizer's measured
    // midpoint for the release frame's actual landmarks (thumb just past
    // the exit boundary — see pinchReleaseOverride) — not simply the
    // fixture's raw (cx, cy). raycastGround(0.695, 0.21125) = (3.9, -5.775)
    // -> grid-snapped to (4, -6), then pump's own ground offset (0.8)
    // applied on Y.
    expect(objects[0].position).toEqual([4, 0.8, -6]);
  });

  it('a pinch that never touches the palette places nothing — PlacementRouter only fires from a real palette pick-up', () => {
    const controller = new GestureController();
    const placed: unknown[] = [];
    const router = new PlacementRouter({
      locate: (): LocateResult => ({ kind: 'other' }),
      raycastGround: () => ({ x: 0, z: 0 }),
      onPlace: (...args) => placed.push(args),
    });

    const commands = drivePinch(controller, [{ cx: 0.5, cy: 0.5 }, { cx: 0.55, cy: 0.5 }], 2000);
    for (const command of commands) router.route(command);

    expect(placed).toEqual([]);
  });
});

describe('gesture-e2e: pinch-tap a port, then pinch-tap a second port, to create a real connection', () => {
  /**
   * Mirrors what a real browser's R3F raycast would resolve a screen point
   * to — see this file's module doc for exactly what is real vs faked here.
   * Two ports, on two different objects, both `liquid` — a real,
   * compatible pair (mirroring objects/Pump.tsx's actual
   * 'liquid_suction'/'liquid_discharge' port ids and objects/StorageTank's
   * inlet, in shape and type, not copy-pasted from those files).
   */
  function resolvePortAt(x: number): PortData | null {
    if (x < 0.3) {
      return {
        object: { id: 1, type: 'pump', position: [0, 0.8, 0], connections: [] },
        port: { id: 'liquid_discharge', type: 'liquid', label: 'Discharge Outlet' },
        position: [0, 0.8, 0],
      };
    }
    if (x > 0.7) {
      return {
        object: { id: 2, type: 'storageTank', position: [5, 3, 5], connections: [] },
        port: { id: 'liquid_inlet', type: 'liquid', label: 'Tank Inlet' },
        position: [5, 3, 5],
      };
    }
    return null;
  }

  it('tap port A -> a connection is PENDING (port selected); tap port B -> a real connection is created between the two NAMED ports', () => {
    const controller = new GestureController();
    let connectionStart: PortData | null = null;
    const connections: PlantConnection[] = [];
    let connectionIdCounter = 0;

    // A minimal stand-in for PlantScene's own handlePortClick — same two
    // branches, same real canPortsConnect/buildConnection calls PlantScene
    // itself uses (see PlantScene.tsx's handlePortClick after this pass's
    // refactor). The DOM/R3F dispatch that would call this in production is
    // proven separately in virtual-pointer.test.ts (see module doc).
    function onPortTap(portData: PortData): void {
      if (connectionStart) {
        if (canPortsConnect(connectionStart, portData)) {
          connections.push(buildConnection(connectionIdCounter++, connectionStart, portData));
        }
        connectionStart = null;
      } else {
        connectionStart = portData;
      }
    }

    // --- Tap #1: a quick pinch over port A (x=0.1, well inside the "port A" zone). ---
    const tapA = drivePinch(controller, [{ cx: 0.1, cy: 0.5 }], 1000);
    expect(tapA.map((c) => c.type)).toEqual(['down', 'up']);
    const upA = tapA[1];
    if (upA.type !== 'up') throw new Error('expected up');
    expect(upA.tap).toBe(true);

    const hitA = resolvePortAt(upA.x);
    expect(hitA).not.toBeNull();
    if (hitA) onPortTap(hitA);

    // Real state change #1: a port is SELECTED — a connection is pending.
    expect(connectionStart).not.toBeNull();
    expect((connectionStart as unknown as PortData).port.id).toBe('liquid_discharge');
    expect(connections).toHaveLength(0);

    // --- Tap #2: a quick pinch over port B (x=0.9, the "port B" zone). ---
    const tapB = drivePinch(controller, [{ cx: 0.9, cy: 0.5 }], 3000);
    expect(tapB.map((c) => c.type)).toEqual(['down', 'up']);
    const upB = tapB[1];
    if (upB.type !== 'up') throw new Error('expected up');
    expect(upB.tap).toBe(true);

    const hitB = resolvePortAt(upB.x);
    expect(hitB).not.toBeNull();
    if (hitB) onPortTap(hitB);

    // Real state change #2: a real connection now exists between the two
    // NAMED ports, and the pending selection is cleared.
    expect(connectionStart).toBeNull();
    expect(connections).toHaveLength(1);
    expect(connections[0].startPort.id).toBe('liquid_discharge');
    expect(connections[0].endPort.id).toBe('liquid_inlet');
    expect(connections[0].startObjectId).toBe(1);
    expect(connections[0].endObjectId).toBe(2);
    expect(connections[0].type).toBe('liquid');
  });

  it('tapping the SAME port twice does not connect it to itself — canPortsConnect is the real one, not a stub that always says yes', () => {
    const controller = new GestureController();
    let connectionStart: PortData | null = null;
    const connections: PlantConnection[] = [];

    function onPortTap(portData: PortData): void {
      if (connectionStart) {
        if (canPortsConnect(connectionStart, portData)) {
          connections.push(buildConnection(connections.length, connectionStart, portData));
        }
        connectionStart = null;
      } else {
        connectionStart = portData;
      }
    }

    const tap1 = drivePinch(controller, [{ cx: 0.1, cy: 0.5 }], 1000);
    const up1 = tap1[1];
    if (up1.type === 'up') {
      const hit = resolvePortAt(up1.x);
      if (hit) onPortTap(hit);
    }

    const tap2 = drivePinch(controller, [{ cx: 0.1, cy: 0.5 }], 3000);
    const up2 = tap2[1];
    if (up2.type === 'up') {
      const hit = resolvePortAt(up2.x);
      if (hit) onPortTap(hit);
    }

    expect(connections).toHaveLength(0);
    expect(connectionStart).toBeNull(); // still cleared — a same-port tap cancels the pending connection rather than looping
  });
});
