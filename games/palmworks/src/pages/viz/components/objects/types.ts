import type { FC } from 'react';

/**
 * Shared prop shape for every plant object component under this directory
 * (Boiler, Valve, Pump, ...). PlantScene.tsx builds one `commonProps` object
 * and spreads it onto whichever object type a given plant object is — every
 * component in this directory destructures some subset of exactly these
 * fields, so one shared type keeps that contract explicit instead of each
 * file re-declaring its own (potentially drifting) copy.
 *
 * `position` is a three-tuple in world units, `[x, y, z]`. Handlers are
 * optional because a component can be rendered read-only (no scene wiring).
 */
export interface PlantObjectProps {
  position?: [number, number, number];
  onClick?: (event: unknown) => void;
  onDrag?: (position: [number, number, number]) => void;
  onPortClick?: (port: unknown, position: [number, number, number] | undefined, event: unknown) => void;
  isSelected?: boolean;
  isDraggable?: boolean;
  gridSnap?: boolean;
  gridSize?: number;
  showCoordinates?: boolean;
}

/**
 * A React function component that also carries a static `connectionPorts`
 * array (each object component's own port catalogue, read by PlantScene when
 * wiring up connections). Plain `React.FC<P>` has no room for a static
 * property, so every object component's const declaration is typed with this
 * instead — see any converted file in this directory for the pattern:
 *
 *   const Boiler: PlantObjectComponent<BoilerProps, PortT> = (props) => {...};
 *   Boiler.connectionPorts = [ ... ];  // unchanged literal, now type-checked
 *   export default Boiler;
 *
 * `PortT` is deliberately left to each file: the real port shapes differ
 * across components (some use `offset` + a `[x,y,z]` `direction`, others use
 * `position` + a `'input' | 'output'` `direction`), so this migration types
 * each file's ports as whatever they actually are rather than forcing every
 * component into one invented shape.
 */
export type PlantObjectComponent<P, PortT = unknown> = FC<P> & {
  connectionPorts?: PortT[];
};
