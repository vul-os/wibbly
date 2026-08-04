import React, { forwardRef, useImperativeHandle, useState, useRef } from 'react';
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

import AutoRoutingConnection from './AutoRoutingConnection';

const PlantScene = forwardRef(({ mode, selectedObjects, setSelectedObjects, gridSnap, gridSize, showCoordinates, onManualConnectionStateChange }, ref) => {
  const [objects, setObjects] = useState([]);
  const [connections, setConnections] = useState([]);
  const [connectionStart, setConnectionStart] = useState(null); // Will store { object, port }
  const [editingConnection, setEditingConnection] = useState(null);
  const objectIdRef = useRef(0);
  const connectionIdRef = useRef(0);
  const cameraControlsRef = useRef();

  const snapToGrid = (value) => {
    if (!gridSnap) return value;
    return Math.round(value / gridSize) * gridSize;
  };

  // Constants for consistent ground level
  const GROUND_LEVEL = 0;

  // Object height offsets to position bottoms on ground level
  const OBJECT_GROUND_OFFSETS = {
    boiler: 1.6,      // Bottom cap extends 1.6 units below center
    pump: 0.8,        // Base plate bottom is 0.8 units below center
    valve: 1.0,       // Valve body base bottom is 1.0 units below center  
    sensor: 0.15,     // Sensor body height 0.3, so bottom is 0.15 below center
    controlUnit: 1.25, // Main cabinet height 2.5, so bottom is 1.25 below center
    conveyorBelt: 0.8, // Simple support legs height, so bottom is 0.8 below center
    powerBox: 0.1, // Base plate extends 0.1 below center, so bottom sits on ground
    storageTank: 3.0, // Tank support base plates are 3 units below center
    heatExchanger: 1.4, // Mounting feet bottom is 1.4 units below center
    oilTankControlPanel: 4.0, // Base platform and support structure bottom is 4 units below center
    temperatureSwitch: 1.3, // Mounting bracket and probe bottom is 1.3 units below center
    pressureSensor: 1.8, // Process connection bottom is 1.8 units below center
    pressureControlValve: 0.9, // Mounting base bottom is 0.9 units below center
    motorStarter: 1.8, // Enclosure feet bottom is 1.8 units below center
    pressureVessel: 2.5, // Vessel center is 2.5 units above support legs and bottom hemisphere
    dayTank: 2.2, // Tank center is 2.2 units above support legs and platform base
    distillationColumn: 4.5, // Column support base is 4.5 units below center with reboiler
    mixerAgitator: 2.5, // Tank center is 2.5 units above support legs and base
    centrifugalCompressor: 2.8, // Compressor center is 2.8 units above skid base platform
    coolingTower: 2.8, // Tower center is 2.8 units above foundation base
    stirredTankReactor: 2.0, // Reactor vessel center is 2.0 units above foundation base
    extruder: 1.8, // Extruder barrel center is 1.8 units above machine base
    rackSystem: 4.0, // Rack structure center is 4.0 units above foundation
    pipelineSystem: 1.2, // Pipeline center is 1.2 units above support foundations
    waterSupply: 1.2, // Water supply system center is 1.2 units above ground level
    waterDrain: 0.8, // Water drain system center is 0.8 units above ground level
    waterPump: 0.6, // Water pump system center is 0.6 units above ground level
    heatPump: 0.8 // Heat pump system center is 0.8 units above ground level
  };

  const getObjectGroundPosition = (basePosition, objectType) => {
    const offset = OBJECT_GROUND_OFFSETS[objectType] || 0;
    return [basePosition[0], GROUND_LEVEL + offset, basePosition[2]];
  };

  // Verify if two specific ports can be connected
  const canPortsConnect = (sourcePortData, targetPortData) => {
    const { port: sourcePort } = sourcePortData;
    const { port: targetPort } = targetPortData;
    
    // Must be same type
    if (sourcePort.type !== targetPort.type) {
      return false;
    }
    
    // Prevent connecting port to itself
    if (sourcePortData.object.id === targetPortData.object.id && sourcePort.id === targetPort.id) {
      return false;
    }
    
    return true;
  };

  const handlePortClick = (port, objectPosition, objectId, event) => {
    event.stopPropagation();
    
    const clickedObject = objects.find(obj => obj.id === objectId);
    if (!clickedObject) return;
    
    const portData = {
      object: clickedObject,
      port: port,
      position: objectPosition
    };

    // If we have a connection start, try to connect to this port
    if (connectionStart) {
      if (canPortsConnect(connectionStart, portData)) {
        const newConnection = {
          id: connectionIdRef.current++,
          startObjectId: connectionStart.object.id,
          endObjectId: objectId,
          startPort: connectionStart.port,
          endPort: port,
          type: port.type,
          startPosition: connectionStart.object.position,
          endPosition: clickedObject.position
        };
        
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

  const handleObjectClick = (objectId, event) => {
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

  const handleObjectDrag = (objectId, newPosition) => {
    if (mode === 'select') {
      const obj = objects.find(o => o.id === objectId);
      if (!obj) return;
      
      // Apply grid snapping to the new position
      const basePosition = [
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

  const handleConnectionClick = (connectionId, event) => {
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

  const renderObject = (obj) => {
    const isConnecting = connectionStart && connectionStart.object.id === obj.id;
    
    const commonProps = {
      position: obj.position,
      onClick: (e) => handleObjectClick(obj.id, e),
      onDrag: (pos) => handleObjectDrag(obj.id, pos),
      onPortClick: (port, position, e) => handlePortClick(port, position, obj.id, e),
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
    addObject: (type) => {
      const id = objectIdRef.current++;
      
      // Generate position with grid snapping
      const rawX = (Math.random() - 0.5) * 10;
      const rawZ = (Math.random() - 0.5) * 10;
      
      const basePosition = [
        snapToGrid(rawX),
        GROUND_LEVEL,
        snapToGrid(rawZ)
      ];
      
      const position = getObjectGroundPosition(basePosition, type);
      
      const newObject = {
        id,
        type,
        position,
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
        
        const basePosition = [
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
            startPort={connection.startPort}
            endPort={connection.endPort}
            type={connection.type}
            objects={objects}
            isEditing={editingConnection === connection.id}
            onClick={(e) => handleConnectionClick(connection.id, e)}
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