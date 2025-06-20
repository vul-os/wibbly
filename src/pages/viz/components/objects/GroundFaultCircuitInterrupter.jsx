import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const GroundFaultCircuitInterrupter = ({ 
  position = [0, 0, 0], 
  onClick, 
  onDrag, 
  onPortClick,
  isSelected = false, 
  isDraggable = false,
  gridSnap = false,
  gridSize = 1.0,
  showCoordinates = false
}) => {
  const groupRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [positionStart, setPositionStart] = useState([0, 0, 0]);

  // Animation states
  const powerLEDRef = useRef();
  const faultLEDRef = useRef();

  // GFCI connection ports
  const connectionPorts = [
    // Line side (incoming power)
    { id: 'line_hot', label: 'LINE-H', position: [-0.25, 0.3, 0.35], type: 'electric', direction: 'input' },
    { id: 'line_neutral', label: 'LINE-N', position: [-0.1, 0.3, 0.35], type: 'electric', direction: 'input' },
    { id: 'line_ground', label: 'LINE-G', position: [0.05, 0.3, 0.35], type: 'electric', direction: 'input' },
    
    // Load side (protected output)
    { id: 'load_hot', label: 'LOAD-H', position: [-0.25, -0.3, 0.35], type: 'electric', direction: 'output' },
    { id: 'load_neutral', label: 'LOAD-N', position: [-0.1, -0.3, 0.35], type: 'electric', direction: 'output' },
    { id: 'load_ground', label: 'LOAD-G', position: [0.05, -0.3, 0.35], type: 'electric', direction: 'output' },
    
    // Control signals
    { id: 'trip_signal', label: 'TRIP', position: [0.25, 0.15, 0.35], type: 'electric', direction: 'output' },
    { id: 'status_signal', label: 'STATUS', position: [0.25, -0.15, 0.35], type: 'electric', direction: 'output' }
  ];

  useFrame((state) => {
    // Animate status LEDs
    if (powerLEDRef.current) {
      const intensity = 0.9 + Math.sin(state.clock.getElapsedTime() * 2) * 0.1;
      powerLEDRef.current.material.emissiveIntensity = intensity;
    }
    
    if (faultLEDRef.current) {
      // Fault indication - rapid blinking
      const blinkRate = 6;
      const intensity = Math.sin(state.clock.getElapsedTime() * blinkRate) > 0 ? 0.9 : 0.1;
      faultLEDRef.current.material.emissiveIntensity = intensity;
    }
  });

  const handlePointerDown = (event) => {
    if (!isDraggable) return;
    event.stopPropagation();
    setIsDragging(true);
    setDragStart({ x: event.clientX, y: event.clientY });
    setPositionStart([...position]);
    document.body.style.cursor = 'grabbing';
  };

  const handlePointerUp = (event) => {
    if (isDragging) {
      event.stopPropagation();
      setIsDragging(false);
      document.body.style.cursor = 'default';
    }
  };

  const handlePointerMove = (event) => {
    if (!isDragging || !onDrag) return;
    
    const deltaX = (event.clientX - dragStart.x) * 0.01;
    const deltaZ = (event.clientY - dragStart.y) * 0.01;
    
    const newPosition = [
      positionStart[0] + deltaX,
      positionStart[1],
      positionStart[2] + deltaZ
    ];
    
    onDrag(newPosition);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('pointermove', handlePointerMove);
      document.addEventListener('pointerup', handlePointerUp);
      return () => {
        document.removeEventListener('pointermove', handlePointerMove);
        document.removeEventListener('pointerup', handlePointerUp);
      };
    }
  }, [isDragging, dragStart, positionStart, onDrag]);

  const handleClick = (event) => {
    if (!isDragging && onClick) {
      event.stopPropagation();
      onClick(event);
    }
  };

  const handlePortClick = (port, event) => {
    if (onPortClick) {
      const worldPosition = new THREE.Vector3(...port.position).add(new THREE.Vector3(...position));
      onPortClick(port, [worldPosition.x, worldPosition.y, worldPosition.z], event);
    }
  };

  return (
    <group ref={groupRef} position={position}>
      {/* GFCI Main Unit */}
      <group>
        {/* Main enclosure body */}
        <mesh 
          castShadow 
          receiveShadow
          onPointerDown={handlePointerDown}
          onClick={handleClick}
        >
          <boxGeometry args={[0.8, 1.0, 0.7]} />
          <meshStandardMaterial 
            color={isSelected ? "#4CAF50" : "#E8EAF6"}
            metalness={0.3}
            roughness={0.4}
          />
        </mesh>

        {/* Professional front panel */}
        <mesh position={[0, 0, 0.36]} castShadow>
          <boxGeometry args={[0.78, 0.98, 0.02]} />
          <meshStandardMaterial 
            color="#F5F5F5" 
            metalness={0.4}
            roughness={0.3}
          />
        </mesh>

        {/* GFCI Logo area */}
        <mesh position={[0, 0.35, 0.37]} castShadow>
          <boxGeometry args={[0.6, 0.15, 0.01]} />
          <meshStandardMaterial 
            color="#1565C0" 
            metalness={0.5}
            roughness={0.4}
          />
        </mesh>

        <Text
          position={[0, 0.35, 0.375]}
          fontSize={0.03}
          color="#FFFFFF"
          fontWeight="bold"
          anchorX="center"
          anchorY="middle"
        >
          GFCI
        </Text>

        {/* Status LEDs */}
        <mesh ref={powerLEDRef} position={[-0.15, 0.15, 0.37]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.01, 12]} />
          <meshStandardMaterial 
            color="#4CAF50" 
            emissive="#4CAF50" 
            emissiveIntensity={0.9}
            transparent
            opacity={0.95}
          />
        </mesh>

        <mesh ref={faultLEDRef} position={[0.15, 0.15, 0.37]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.01, 12]} />
          <meshStandardMaterial 
            color="#F44336" 
            emissive="#F44336" 
            emissiveIntensity={0.9}
            transparent
            opacity={0.95}
          />
        </mesh>

        {/* LED labels */}
        <Text
          position={[-0.15, 0.1, 0.37]}
          fontSize={0.012}
          color="#1A237E"
          fontWeight="bold"
          anchorX="center"
          anchorY="middle"
        >
          POWER
        </Text>
        <Text
          position={[0.15, 0.1, 0.37]}
          fontSize={0.012}
          color="#1A237E"
          fontWeight="bold"
          anchorX="center"
          anchorY="middle"
        >
          FAULT
        </Text>

        {/* Test button */}
        <mesh position={[-0.12, -0.05, 0.37]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.02, 12]} />
          <meshStandardMaterial color="#FFA726" metalness={0.6} roughness={0.4} />
        </mesh>

        {/* Reset button */}
        <mesh position={[0.12, -0.05, 0.37]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.02, 12]} />
          <meshStandardMaterial color="#66BB6A" metalness={0.6} roughness={0.4} />
        </mesh>

        {/* Button labels */}
        <Text
          position={[-0.12, -0.12, 0.37]}
          fontSize={0.015}
          color="#1A237E"
          fontWeight="bold"
          anchorX="center"
          anchorY="middle"
        >
          TEST
        </Text>
        <Text
          position={[0.12, -0.12, 0.37]}
          fontSize={0.015}
          color="#1A237E"
          fontWeight="bold"
          anchorX="center"
          anchorY="middle"
        >
          RESET
        </Text>

        {/* Device labeling */}
        <Text
          position={[0, -0.25, 0.37]}
          fontSize={0.02}
          color="#1A237E"
          fontWeight="bold"
          anchorX="center"
          anchorY="middle"
        >
          GROUND FAULT
        </Text>
        <Text
          position={[0, -0.32, 0.37]}
          fontSize={0.018}
          color="#3F51B5"
          fontWeight="bold"
          anchorX="center"
          anchorY="middle"
        >
          CIRCUIT INTERRUPTER
        </Text>

        {/* Connection terminals */}
        {connectionPorts.map((port) => (
          <group key={port.id}>
            <mesh 
              position={port.position}
              onClick={(e) => handlePortClick(port, e)}
              castShadow
            >
              <cylinderGeometry args={[0.02, 0.02, 0.02, 8]} />
              <meshStandardMaterial 
                color="#C0C0C0"
                metalness={0.95}
                roughness={0.05}
              />
            </mesh>
            
            <Text
              position={[port.position[0], port.position[1] - 0.06, port.position[2] + 0.02]}
              fontSize={0.01}
              color="#E0E0E0"
              fontWeight="bold"
              anchorX="center"
              anchorY="middle"
            >
              {port.label}
            </Text>
          </group>
        ))}

        {/* Line/Load separation */}
        <Text
          position={[-0.25, 0.42, 0.37]}
          fontSize={0.015}
          color="#1A237E"
          fontWeight="bold"
          anchorX="center"
          anchorY="middle"
        >
          LINE
        </Text>

        <Text
          position={[-0.25, -0.42, 0.37]}
          fontSize={0.015}
          color="#1A237E"
          fontWeight="bold"
          anchorX="center"
          anchorY="middle"
        >
          LOAD
        </Text>

        {/* Certification markings */}
        <Text
          position={[-0.2, -0.45, 0.37]}
          fontSize={0.01}
          color="#000000"
          fontWeight="bold"
          anchorX="center"
          anchorY="middle"
        >
          UL943
        </Text>
        <Text
          position={[0, -0.45, 0.37]}
          fontSize={0.01}
          color="#000000"
          anchorX="center"
          anchorY="middle"
        >
          20A/120V
        </Text>
        <Text
          position={[0.2, -0.45, 0.37]}
          fontSize={0.01}
          color="#000000"
          anchorX="center"
          anchorY="middle"
        >
          5mA
        </Text>

        {/* Warning symbol */}
        <Text
          position={[0.3, 0, 0.37]}
          fontSize={0.025}
          color="#FF9800"
          fontWeight="bold"
          anchorX="center"
          anchorY="middle"
        >
          ⚠
        </Text>
      </group>

      {/* Coordinate display */}
      {showCoordinates && (
        <Text
          position={[0, 1.2, 0]}
          fontSize={0.2}
          color="yellow"
          anchorX="center"
          anchorY="middle"
        >
          {`(${position[0].toFixed(1)}, ${position[2].toFixed(1)})`}
        </Text>
      )}

      {/* Selection indicator */}
      {isSelected && (
        <mesh position={[0, -0.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.0, 1.3, 32]} />
          <meshBasicMaterial color="#4CAF50" transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
};

// Static property for accessing connection ports
GroundFaultCircuitInterrupter.connectionPorts = [
  // Line side (incoming power)
  { id: 'line_hot', label: 'LINE-H', position: [-0.25, 0.3, 0.35], type: 'electric', direction: 'input' },
  { id: 'line_neutral', label: 'LINE-N', position: [-0.1, 0.3, 0.35], type: 'electric', direction: 'input' },
  { id: 'line_ground', label: 'LINE-G', position: [0.05, 0.3, 0.35], type: 'electric', direction: 'input' },
  
  // Load side (protected output)
  { id: 'load_hot', label: 'LOAD-H', position: [-0.25, -0.3, 0.35], type: 'electric', direction: 'output' },
  { id: 'load_neutral', label: 'LOAD-N', position: [-0.1, -0.3, 0.35], type: 'electric', direction: 'output' },
  { id: 'load_ground', label: 'LOAD-G', position: [0.05, -0.3, 0.35], type: 'electric', direction: 'output' },
  
  // Control signals
  { id: 'trip_signal', label: 'TRIP', position: [0.25, 0.15, 0.35], type: 'electric', direction: 'output' },
  { id: 'status_signal', label: 'STATUS', position: [0.25, -0.15, 0.35], type: 'electric', direction: 'output' }
];

export default GroundFaultCircuitInterrupter; 