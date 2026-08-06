/**
 * Pure decision logic extracted from `PlantScene.tsx` — placement, grid
 * snapping and port-compatibility rules, with no React state and no Three.js
 * event objects. `PlantScene.tsx` is the only production caller (it holds the
 * `objects`/`connections` React state and calls these to compute the next
 * value), which keeps mouse play byte-for-byte the same behaviour as before
 * this file existed. It exists as its own module so the gesture layer
 * (`src/gestures/**`) and this module's own tests can drive the SAME
 * placement/connection rules the mouse path uses, without needing a
 * `<Canvas>`, WebGL, or a DOM — see `gesture-e2e.test.ts` for the reason this
 * split matters: a hand-fixture test that only exercised a game-shaped
 * re-implementation of these rules would prove nothing about the real game.
 */

export type Vec3Tuple = [number, number, number];

export interface PlantPort {
  id: string;
  type: string;
  label: string;
  [key: string]: unknown;
}

export interface PlantObject {
  id: number;
  type: string;
  position: Vec3Tuple;
  connections: number[];
}

export interface PortData {
  object: PlantObject;
  port: PlantPort;
  position: Vec3Tuple;
}

export interface PlantConnection {
  id: number;
  startObjectId: number;
  endObjectId: number;
  startPort: PlantPort;
  endPort: PlantPort;
  type: string;
  startPosition: Vec3Tuple;
  endPosition: Vec3Tuple;
}

export const GROUND_LEVEL = 0;

/** Object height offsets so each type's bottom sits on GROUND_LEVEL — unchanged from PlantScene.tsx's original inline copy. */
export const OBJECT_GROUND_OFFSETS: Record<string, number> = {
  boiler: 1.6,
  pump: 0.8,
  valve: 1.0,
  sensor: 0.15,
  controlUnit: 1.25,
  conveyorBelt: 0.8,
  powerBox: 0.1,
  storageTank: 3.0,
  heatExchanger: 1.4,
  oilTankControlPanel: 4.0,
  temperatureSwitch: 1.3,
  pressureSensor: 1.8,
  pressureControlValve: 0.9,
  motorStarter: 1.8,
  pressureVessel: 2.5,
  dayTank: 2.2,
  distillationColumn: 4.5,
  mixerAgitator: 2.5,
  centrifugalCompressor: 2.8,
  coolingTower: 2.8,
  stirredTankReactor: 2.0,
  extruder: 1.8,
  rackSystem: 4.0,
  pipelineSystem: 1.2,
  waterSupply: 1.2,
  waterDrain: 0.8,
  waterPump: 0.6,
  heatPump: 0.8,
};

export function snapToGrid(value: number, gridSnap: boolean, gridSize: number): number {
  if (!gridSnap) return value;
  return Math.round(value / gridSize) * gridSize;
}

export function getObjectGroundPosition(basePosition: Vec3Tuple, objectType: string): Vec3Tuple {
  const offset = OBJECT_GROUND_OFFSETS[objectType] || 0;
  return [basePosition[0], GROUND_LEVEL + offset, basePosition[2]];
}

/**
 * Grid-snapped ground position for a NEW object of `objectType` at raw world
 * (x, z). Shared by the random-drop path (`addObject` with no explicit
 * position, unchanged mouse behaviour) and the gesture-driven "pinch to
 * place" path (an explicit raycast-onto-ground x/z instead of `Math.random()`).
 */
export function placementPosition(
  rawX: number,
  rawZ: number,
  objectType: string,
  gridSnap: boolean,
  gridSize: number,
): Vec3Tuple {
  const basePosition: Vec3Tuple = [
    snapToGrid(rawX, gridSnap, gridSize),
    GROUND_LEVEL,
    snapToGrid(rawZ, gridSnap, gridSize),
  ];
  return getObjectGroundPosition(basePosition, objectType);
}

/** Same two rules PlantScene.tsx's canPortsConnect always enforced: matching type, not the same port on the same object. */
export function canPortsConnect(sourcePortData: PortData, targetPortData: PortData): boolean {
  const { port: sourcePort } = sourcePortData;
  const { port: targetPort } = targetPortData;

  if (sourcePort.type !== targetPort.type) return false;
  if (sourcePortData.object.id === targetPortData.object.id && sourcePort.id === targetPort.id) return false;

  return true;
}

/** Builds the PlantConnection PlantScene.tsx used to construct inline in handlePortClick's "complete" branch. */
export function buildConnection(
  id: number,
  connectionStart: PortData,
  targetPortData: PortData,
): PlantConnection {
  return {
    id,
    startObjectId: connectionStart.object.id,
    endObjectId: targetPortData.object.id,
    startPort: connectionStart.port,
    endPort: targetPortData.port,
    type: targetPortData.port.type,
    startPosition: connectionStart.object.position,
    endPosition: targetPortData.object.position,
  };
}
