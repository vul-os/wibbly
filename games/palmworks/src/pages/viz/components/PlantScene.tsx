import React, { forwardRef, useImperativeHandle, useState, useRef } from 'react';
import type { ThreeEvent } from '@react-three/fiber';
import Boiler from './objects/Boiler';
import ControlUnit from './objects/ControlUnit';
import Valve from './objects/Valve';
import Sensor from './objects/Sensor';
import Pump from './objects/Pump';
import ConveyorBelt from './objects/ConveyorBelt';
import PowerBox from './objects/PowerBox';
import StorageTank from './objects/StorageTank';
import HeatExchanger from './objects/HeatExchanger';
import OilTankControlPanel from './objects/OilTankControlPanel';
import TemperatureSwitch from './objects/TemperatureSwitch';
import PressureSensor from './objects/PressureSensor';
import PressureControlValve from './objects/PressureControlValve';
import MotorStarter from './objects/MotorStarter';
import PressureVessel from './objects/PressureVessel';
import DayTank from './objects/DayTank';
import DistillationColumn from './objects/DistillationColumn';
import MixerAgitator from './objects/MixerAgitator';
import CentrifugalCompressor from './objects/CentrifugalCompressor';
import CoolingTower from './objects/CoolingTower';
import StirredTankReactor from './objects/StirredTankReactor';
import Extruder from './objects/Extruder';
import RackSystem from './objects/RackSystem';
import PipelineSystem from './objects/PipelineSystem';
import WaterSupply from './objects/WaterSupply';
import WaterDrain from './objects/WaterDrain';
import WaterPump from './objects/WaterPump';
import HeatPump from './objects/HeatPump';

import AutoRoutingConnection, { type RoutePort } from './AutoRoutingConnection';
import {
  buildConnection,
  canPortsConnect as canPortsConnectPure,
  getObjectGroundPosition,
  GROUND_LEVEL,
  placementPosition,
  snapToGrid as snapToGridPure,
  type PlantConnection,
  type PlantObject,
  type PlantPort,
  type PortData,
  type Vec3Tuple,
} from './plant-scene-logic';

export type { PlantConnection, PlantObject, PlantPort, PortData, Vec3Tuple };

export interface PlantSceneHandle {
  /**
   * Places a new object of `type`. With no `position`, drops it at a random
   * grid-snapped spot — the original mouse-driven behaviour, unchanged. With
   * an explicit `{x, z}` (world ground coordinates, e.g. a raycast hit from a
   * gesture-driven "pinch to place"), drops it there instead — see
   * PALMWORKS.md §4.2's placement mapping.
   */
  addObject: (type: string, position?: { x: number; z: number }) => void;
  autoLayout: () => void;
  clearAll: () => void;
  setCameraControlsRef: (controlsRef: unknown) => void;
}

interface PlantSceneProps {
  mode: string;
  selectedObjects: number[];
  setSelectedObjects: React.Dispatch<React.SetStateAction<number[]>>;
  gridSnap: boolean;
  gridSize: number;
  showCoordinates: boolean;
  onManualConnectionStateChange?: (state: boolean) => void;
}

const PlantScene = forwardRef<PlantSceneHandle, PlantSceneProps>(({ mode, selectedObjects, setSelectedObjects, gridSnap, gridSize, showCoordinates, onManualConnectionStateChange }, ref) => {
  const [objects, setObjects] = useState<PlantObject[]>([]);
  const [connections, setConnections] = useState<PlantConnection[]>([]);
  const [connectionStart, setConnectionStart] = useState<PortData | null>(null); // Will store { object, port }
  const [editingConnection, setEditingConnection] = useState<number | null>(null);
  const objectIdRef = useRef(0);
  const connectionIdRef = useRef(0);
  const cameraControlsRef = useRef<unknown>(null);

  // Placement/grid-snap/port-compatibility rules live in plant-scene-logic.ts
  // now (pure functions, no React state) — this component only owns the
  // React state transitions around them. See that file's module doc for why:
  // the gesture layer drives the SAME functions directly, off-DOM, and its
  // tests would prove nothing if this component had its own separate copy.
  const snapToGrid = (value: number): number => snapToGridPure(value, gridSnap, gridSize);

  // Verify if two specific ports can be connected
  const canPortsConnect = canPortsConnectPure;

  const handlePortClick = (port: PlantPort, objectPosition: Vec3Tuple, objectId: number, event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();

    const clickedObject = objects.find(obj => obj.id === objectId);
    if (!clickedObject) return;

    const portData: PortData = {
      object: clickedObject,
      port: port,
      position: objectPosition
    };

    // If we have a connection start, try to connect to this port
    if (connectionStart) {
      if (canPortsConnect(connectionStart, portData)) {
        const newConnection: PlantConnection = buildConnection(connectionIdRef.current++, connectionStart, portData);

        setConnections(prev => [...prev, newConnection]);
        console.log(`Connected ${connectionStart.port.type} port: ${connectionStart.port.label} -> ${port.label}`);
      } else {
        console.warn(`Cannot connect ${connectionStart.port.type} port to ${port.type} port`);
      }

      // Clear connection start
      setConnectionStart(null);
      setSelectedObjects([]);
    } else {
      // Start a new connection from this port
      setConnectionStart(portData);
      setSelectedObjects([objectId]);
      console.log(`Selected ${port.type} port: ${port.label}`);
    }
  };

  const handleObjectClick = (objectId: number, event?: ThreeEvent<MouseEvent>) => {
    event?.stopPropagation();
    
    const clickedObject = objects.find(obj => obj.id === objectId);
    if (!clickedObject) return;

    // Handle based on mode
    if (mode === 'delete') {
      // Delete object and its connections
      setConnections(prev => prev.filter(conn => 
        conn.startObjectId !== objectId && conn.endObjectId !== objectId
      ));
      setObjects(prev => prev.filter(obj => obj.id !== objectId));
      setSelectedObjects([]);
      setConnectionStart(null);
    } else {
      // Select mode - just select the object (connections now happen via port clicks)
      if (connectionStart && connectionStart.object.id === objectId) {
        // Clicking same object cancels connection
        setConnectionStart(null);
        setSelectedObjects([]);
      } else {
        // Just select the object
        setSelectedObjects([objectId]);
        // Don't set connectionStart here anymore - only ports do that
      }
    }
  };

  const handleObjectDrag = (objectId: number, newPosition: Vec3Tuple) => {
    if (mode === 'select') {
      const obj = objects.find(o => o.id === objectId);
      if (!obj) return;

      // Apply grid snapping to the new position
      const basePosition: Vec3Tuple = [
        snapToGrid(newPosition[0]),
        GROUND_LEVEL,
        snapToGrid(newPosition[2])
      ];

      const snappedPosition = getObjectGroundPosition(basePosition, obj.type);

      setObjects(prev => prev.map(obj =>
        obj.id === objectId ? { ...obj, position: snappedPosition } : obj
      ));

      // Update connections that involve this object (auto-reroute)
      setConnections(prev => prev.map(conn => {
        if (conn.startObjectId === objectId) {
          return { ...conn, startPosition: snappedPosition };
        } else if (conn.endObjectId === objectId) {
          return { ...conn, endPosition: snappedPosition };
        }
        return conn;
      }));
    }
  };

  const handleConnectionClick = (connectionId: number, event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();

    if (mode === 'delete') {
      setConnections(prev => prev.filter(conn => conn.id !== connectionId));
      setEditingConnection(null);
    } else if (mode === 'select') {
      // Enter edit mode for the connection
      setEditingConnection(connectionId);
      setSelectedObjects([]);
    }
  };

  // Reset states when mode changes
  React.useEffect(() => {
    if (mode === 'delete') {
      setConnectionStart(null);
      setEditingConnection(null);
    }
  }, [mode]);

  const renderObject = (obj: PlantObject) => {
    const isConnecting = Boolean(connectionStart && connectionStart.object.id === obj.id);

    const commonProps = {
      position: obj.position,
      onClick: (e: unknown) => handleObjectClick(obj.id, e as ThreeEvent<MouseEvent>),
      onDrag: (pos: Vec3Tuple) => handleObjectDrag(obj.id, pos),
      onPortClick: (port: unknown, position: Vec3Tuple | undefined, e: unknown) =>
        handlePortClick(port as PlantPort, position ?? obj.position, obj.id, e as ThreeEvent<MouseEvent>),
      isSelected: selectedObjects.includes(obj.id) || isConnecting,
      isDraggable: mode === 'select',
      gridSnap,
      gridSize,
      showCoordinates
    };

    switch (obj.type) {
      case 'boiler':
        return <Boiler key={obj.id} {...commonProps} />;
      case 'controlUnit':
        return <ControlUnit key={obj.id} {...commonProps} />;
      case 'valve':
        return <Valve key={obj.id} {...commonProps} />;
      case 'sensor':
        return <Sensor key={obj.id} {...commonProps} />;
      case 'pump':
        return <Pump key={obj.id} {...commonProps} />;
      case 'conveyorBelt':
        return <ConveyorBelt key={obj.id} {...commonProps} />;
      case 'powerBox':
        return <PowerBox key={obj.id} {...commonProps} />;
      case 'storageTank':
        return <StorageTank key={obj.id} {...commonProps} />;
      case 'heatExchanger':
        return <HeatExchanger key={obj.id} {...commonProps} />;
      case 'oilTankControlPanel':
        return <OilTankControlPanel key={obj.id} {...commonProps} />;
      case 'temperatureSwitch':
        return <TemperatureSwitch key={obj.id} {...commonProps} />;
      case 'pressureSensor':
        return <PressureSensor key={obj.id} {...commonProps} />;
      case 'pressureControlValve':
        return <PressureControlValve key={obj.id} {...commonProps} />;
      case 'motorStarter':
        return <MotorStarter key={obj.id} {...commonProps} />;
      case 'pressureVessel':
        return <PressureVessel key={obj.id} {...commonProps} />;
      case 'dayTank':
        return <DayTank key={obj.id} {...commonProps} />;
      case 'distillationColumn':
        return <DistillationColumn key={obj.id} {...commonProps} />;
      case 'mixerAgitator':
        return <MixerAgitator key={obj.id} {...commonProps} />;
      case 'centrifugalCompressor':
        return <CentrifugalCompressor key={obj.id} {...commonProps} />;
      case 'coolingTower':
        return <CoolingTower key={obj.id} {...commonProps} />;
      case 'stirredTankReactor':
        return <StirredTankReactor key={obj.id} {...commonProps} />;
      case 'extruder':
        return <Extruder key={obj.id} {...commonProps} />;
      case 'rackSystem':
        return <RackSystem key={obj.id} {...commonProps} />;
      case 'pipelineSystem':
        return <PipelineSystem key={obj.id} {...commonProps} />;
      case 'waterSupply':
        return <WaterSupply key={obj.id} {...commonProps} />;
      case 'waterDrain':
        return <WaterDrain key={obj.id} {...commonProps} />;
      case 'waterPump':
        return <WaterPump key={obj.id} {...commonProps} />;
      case 'heatPump':
        return <HeatPump key={obj.id} {...commonProps} />;
      default:
        return null;
    }
  };

  useImperativeHandle(ref, () => ({
    addObject: (type, position) => {
      const id = objectIdRef.current++;

      // With no explicit position (the original mouse behaviour, via the
      // sidebar palette): drop at a random grid-snapped spot. With one (the
      // gesture-driven "pinch to place" path, a ground-plane raycast hit):
      // place there instead — same snap/ground-offset rule either way, via
      // placementPosition (plant-scene-logic.ts).
      const rawX = position ? position.x : (Math.random() - 0.5) * 10;
      const rawZ = position ? position.z : (Math.random() - 0.5) * 10;

      const newObject = {
        id,
        type,
        position: placementPosition(rawX, rawZ, type, gridSnap, gridSize),
        connections: []
      };

      setObjects(prev => [...prev, newObject]);
    },

    autoLayout: () => {
      if (objects.length === 0) return;
      
      const radius = Math.max(3, objects.length * 0.8);
      const angleStep = (Math.PI * 2) / objects.length;
      
      setObjects(prev => prev.map((obj, index) => {
        const angle = index * angleStep;
        const rawX = Math.cos(angle) * radius;
        const rawZ = Math.sin(angle) * radius;
        
        const basePosition: Vec3Tuple = [
          snapToGrid(rawX),
          GROUND_LEVEL,
          snapToGrid(rawZ)
        ];

        return {
          ...obj,
          position: getObjectGroundPosition(basePosition, obj.type)
        };
      }));
    },

    clearAll: () => {
      setObjects([]);
      setConnections([]);
      setConnectionStart(null);
      setEditingConnection(null);
      setSelectedObjects([]);
      if (onManualConnectionStateChange) {
        onManualConnectionStateChange(false);
      }
    },

    setCameraControlsRef: (controlsRef) => {
      cameraControlsRef.current = controlsRef;
    }
  }));

  return (
    <group>
      {/* Render all objects */}
      {objects.map(renderObject)}
      
      {/* Render all auto-routing connections */}
      {connections.map(connection => {
        return (
          <AutoRoutingConnection
            key={connection.id}
            startPosition={connection.startPosition}
            endPosition={connection.endPosition}
            // AutoRoutingConnection only ever reads .offset/.direction off
            // these (see its own RoutePort docstring) - a handful of object
            // families use a different port shape (position + string
            // direction) for their own rendering, so this cast can be
            // wrong for those at runtime; pre-existing cross-shape
            // inconsistency, not introduced or fixed here.
            startPort={connection.startPort as unknown as RoutePort}
            endPort={connection.endPort as unknown as RoutePort}
            type={connection.type}
            objects={objects}
            isEditing={editingConnection === connection.id}
            onClick={(e) => handleConnectionClick(connection.id, e as ThreeEvent<MouseEvent>)}
          />
        );
      })}
      
      {/* Grid position markers for selected objects */}
      {showCoordinates && objects.filter(obj => selectedObjects.includes(obj.id)).map(obj => (
        <group key={`coord-${obj.id}`} position={obj.position}>
          {/* Coordinate display */}
          <mesh position={[0, 4, 0]}>
            <sphereGeometry args={[0.05]} />
            <meshBasicMaterial color="#ffeb3b" />
          </mesh>
          
          {/* Ground projection lines */}
          <mesh position={[0, 2, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 4, 4]} />
            <meshBasicMaterial color="#ffeb3b" transparent opacity={0.3} />
          </mesh>
        </group>
      ))}
      
      {/* Connection start indicator */}
      {connectionStart && (
        <group position={connectionStart.object.position}>
          <mesh position={[0, 3, 0]}>
            <sphereGeometry args={[0.3]} />
            <meshLambertMaterial 
              color={connectionStart.port.type === 'electric' ? '#FF5722' : 
                     connectionStart.port.type === 'liquid' ? '#2196F3' : '#FFC107'} 
              emissive={connectionStart.port.type === 'electric' ? '#FF5722' : 
                        connectionStart.port.type === 'liquid' ? '#2196F3' : '#FFC107'}
              emissiveIntensity={0.5}
              transparent
              opacity={0.8}
            />
          </mesh>
          
          {/* Pulsing effect */}
          <mesh position={[0, 3, 0]}>
            <sphereGeometry args={[0.5]} />
            <meshBasicMaterial 
              color={connectionStart.port.type === 'electric' ? '#FF5722' : 
                     connectionStart.port.type === 'liquid' ? '#2196F3' : '#FFC107'} 
              transparent 
              opacity={0.2}
            />
          </mesh>
          
          {/* Port type indicator */}
          <mesh position={[0, 3.8, 0]}>
            {connectionStart.port.type === 'electric' && <octahedronGeometry args={[0.1]} />}
            {connectionStart.port.type === 'liquid' && <sphereGeometry args={[0.1, 8, 8]} />}
            {connectionStart.port.type === 'gas' && <coneGeometry args={[0.1, 0.15, 6]} />}
            <meshBasicMaterial color="#FFEB3B" />
          </mesh>
        </group>
      )}
      
      {/* Edit connection indicator */}
      {editingConnection && (
        <mesh position={[0, 5, 0]}>
          <sphereGeometry args={[0.1]} />
          <meshLambertMaterial color="#FF9800" emissive="#FF9800" emissiveIntensity={0.5} />
        </mesh>
      )}
    </group>
  );
});

PlantScene.displayName = 'PlantScene';

export default PlantScene; 