import { describe, expect, it } from 'vitest';
import {
  buildConnection,
  canPortsConnect,
  getObjectGroundPosition,
  GROUND_LEVEL,
  placementPosition,
  snapToGrid,
  type PlantObject,
  type PlantPort,
  type PortData,
} from './plant-scene-logic';

describe('snapToGrid', () => {
  it('passes values through unchanged when gridSnap is off', () => {
    expect(snapToGrid(3.14159, false, 1)).toBeCloseTo(3.14159, 10);
  });

  it('rounds to the nearest multiple of gridSize when gridSnap is on', () => {
    expect(snapToGrid(3.4, true, 1)).toBe(3);
    expect(snapToGrid(3.6, true, 1)).toBe(4);
    expect(snapToGrid(4.9, true, 2)).toBe(4);
    expect(snapToGrid(5.1, true, 2)).toBe(6);
  });
});

describe('getObjectGroundPosition / placementPosition', () => {
  it('adds the object type\'s ground offset so its bottom sits at GROUND_LEVEL', () => {
    const pos = getObjectGroundPosition([2, 999, -3], 'pump'); // pump offset 0.8
    expect(pos).toEqual([2, GROUND_LEVEL + 0.8, -3]);
  });

  it('unknown object types default to zero ground offset rather than throwing', () => {
    const pos = getObjectGroundPosition([0, 0, 0], 'not-a-real-type');
    expect(pos).toEqual([0, GROUND_LEVEL, 0]);
  });

  it('placementPosition combines grid-snapping and ground-offset in one call — this is what "pinch to place" drives', () => {
    const pos = placementPosition(3.4, -1.9, 'boiler', true, 1); // boiler offset 1.6
    expect(pos).toEqual([3, GROUND_LEVEL + 1.6, -2]);
  });

  it('placementPosition with gridSnap off keeps the raw raycast-hit coordinates', () => {
    const pos = placementPosition(3.456, -1.987, 'sensor', false, 1); // sensor offset 0.15
    expect(pos[0]).toBeCloseTo(3.456, 10);
    expect(pos[2]).toBeCloseTo(-1.987, 10);
    expect(pos[1]).toBe(GROUND_LEVEL + 0.15);
  });
});

function object(id: number, type: string): PlantObject {
  return { id, type, position: [0, 0, 0], connections: [] };
}

function port(id: string, type: string, label = id): PlantPort {
  return { id, type, label };
}

describe('canPortsConnect', () => {
  it('allows two same-type ports on different objects', () => {
    const a: PortData = { object: object(1, 'pump'), port: port('liquid_discharge', 'liquid'), position: [0, 0, 0] };
    const b: PortData = { object: object(2, 'storageTank'), port: port('liquid_inlet', 'liquid'), position: [0, 0, 0] };
    expect(canPortsConnect(a, b)).toBe(true);
  });

  it('rejects two different-type ports (e.g. liquid -> electric)', () => {
    const a: PortData = { object: object(1, 'pump'), port: port('liquid_discharge', 'liquid'), position: [0, 0, 0] };
    const b: PortData = { object: object(2, 'powerBox'), port: port('electric_power', 'electric'), position: [0, 0, 0] };
    expect(canPortsConnect(a, b)).toBe(false);
  });

  it('rejects a port connecting to itself (same object, same port id)', () => {
    const a: PortData = { object: object(1, 'pump'), port: port('liquid_discharge', 'liquid'), position: [0, 0, 0] };
    expect(canPortsConnect(a, a)).toBe(false);
  });

  it('allows two different ports on the SAME object, as long as types match', () => {
    const a: PortData = { object: object(1, 'pump'), port: port('liquid_suction', 'liquid'), position: [0, 0, 0] };
    const b: PortData = { object: object(1, 'pump'), port: port('liquid_discharge', 'liquid'), position: [0, 0, 0] };
    expect(canPortsConnect(a, b)).toBe(true);
  });
});

describe('buildConnection', () => {
  it('builds a PlantConnection carrying both named ports and both endpoint object ids', () => {
    const start: PortData = {
      object: { id: 5, type: 'pump', position: [1, 0.8, 2], connections: [] },
      port: port('liquid_discharge', 'liquid', 'Discharge Outlet'),
      position: [1, 0.8, 2],
    };
    const end: PortData = {
      object: { id: 9, type: 'storageTank', position: [7, 3, -1], connections: [] },
      port: port('liquid_inlet', 'liquid', 'Tank Inlet'),
      position: [7, 3, -1],
    };

    const conn = buildConnection(42, start, end);

    expect(conn).toEqual({
      id: 42,
      startObjectId: 5,
      endObjectId: 9,
      startPort: port('liquid_discharge', 'liquid', 'Discharge Outlet'),
      endPort: port('liquid_inlet', 'liquid', 'Tank Inlet'),
      type: 'liquid',
      startPosition: [1, 0.8, 2],
      endPosition: [7, 3, -1],
    });
  });
});
