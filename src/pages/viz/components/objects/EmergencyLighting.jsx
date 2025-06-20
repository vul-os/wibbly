import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const EmergencyLighting = ({ 
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
  const chargeLEDRef = useRef();
  const leftLightRef = useRef();
  const rightLightRef = useRef();

  // Emergency lighting connection ports
  const connectionPorts = [
    // Power connections
    { id: 'ac_power_l', label: 'AC-L', position: [0.3, -0.15, 0.25], type: 'electric', direction: 'input' },
    { id: 'ac_power_n', label: 'AC-N', position: [0.4, -0.15, 0.25], type: 'electric', direction: 'input' },
    { id: 'ac_power_gnd', label: 'GND', position: [0.5, -0.15, 0.25], type: 'electric', direction: 'input' },
    
    // Control connections
    { id: 'remote_test', label: 'TEST', position: [-0.3, -0.15, 0.25], type: 'electric', direction: 'input' },
    { id: 'status_out', label: 'STATUS', position: [-0.4, -0.15, 0.25], type: 'electric', direction: 'output' },
    { id: 'em_network', label: 'EM-NET', position: [0, -0.15, 0.25], type: 'electric', direction: 'input' }
  ];

  useFrame((state) => {
    // Animate status LEDs
    if (powerLEDRef.current) {
      const intensity = 0.9 + Math.sin(state.clock.getElapsedTime() * 1.5) * 0.1;
      powerLEDRef.current.material.emissiveIntensity = intensity;
    }
    
    if (chargeLEDRef.current) {
      const intensity = 0.7 + Math.sin(state.clock.getElapsedTime() * 0.8) * 0.3;
      chargeLEDRef.current.material.emissiveIntensity = intensity;
    }

    // Emergency light beams animation
    if (leftLightRef.current && rightLightRef.current) {
      const flickerIntensity = 0.95 + Math.sin(state.clock.getElapsedTime() * 12) * 0.05;
      leftLightRef.current.material.emissiveIntensity = flickerIntensity;
      rightLightRef.current.material.emissiveIntensity = flickerIntensity;
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
      {/* Emergency Lighting Unit */}
      <group>
        {/* Main housing body */}
        <mesh 
          castShadow 
          receiveShadow
          onPointerDown={handlePointerDown}
          onClick={handleClick}
        >
          <boxGeometry args={[1.2, 0.4, 0.5]} />
          <meshStandardMaterial 
            color={isSelected ? "#4CAF50" : "#E8EAF6"}
            metalness={0.3}
            roughness={0.4}
          />
        </mesh>

        {/* Professional front bezel */}
        <mesh position={[0, 0, 0.26]} castShadow>
          <boxGeometry args={[1.18, 0.38, 0.02]} />
          <meshStandardMaterial 
            color="#F5F5F5" 
            metalness={0.4}
            roughness={0.3}
          />
        </mesh>

        {/* Left light head */}
        <group position={[-0.35, 0, 0.27]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.12, 12]} />
            <meshStandardMaterial color="#2A2A2A" metalness={0.8} roughness={0.2} />
          </mesh>
          
          <mesh ref={leftLightRef} position={[0, 0, 0.061]} castShadow>
            <cylinderGeometry args={[0.07, 0.07, 0.01, 12]} />
            <meshStandardMaterial 
              color="#FFFFFF" 
              emissive="#FFFFFF" 
              emissiveIntensity={0.9}
              transparent
              opacity={0.9}
            />
          </mesh>
        </group>

        {/* Right light head */}
        <group position={[0.35, 0, 0.27]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.12, 12]} />
            <meshStandardMaterial color="#2A2A2A" metalness={0.8} roughness={0.2} />
          </mesh>
          
          <mesh ref={rightLightRef} position={[0, 0, 0.061]} castShadow>
            <cylinderGeometry args={[0.07, 0.07, 0.01, 12]} />
            <meshStandardMaterial 
              color="#FFFFFF" 
              emissive="#FFFFFF" 
              emissiveIntensity={0.9}
              transparent
              opacity={0.9}
            />
          </mesh>
        </group>

        {/* Status indicator panel */}
        <mesh position={[0, 0.12, 0.27]} castShadow>
          <boxGeometry args={[0.6, 0.15, 0.02]} />
          <meshStandardMaterial color="#2A2A2A" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Power LED - Green */}
        <mesh ref={powerLEDRef} position={[-0.15, 0.15, 0.28]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.01, 12]} />
          <meshStandardMaterial 
            color="#4CAF50" 
            emissive="#4CAF50" 
            emissiveIntensity={0.9}
            transparent
            opacity={0.95}
          />
        </mesh>

        {/* Charge LED - Orange */}
        <mesh ref={chargeLEDRef} position={[0.15, 0.15, 0.28]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.01, 12]} />
          <meshStandardMaterial 
            color="#FF9800" 
            emissive="#FF9800" 
            emissiveIntensity={0.7}
            transparent
            opacity={0.95}
          />
        </mesh>

        {/* LED labels */}
        <Text
          position={[-0.15, 0.09, 0.28]}
          fontSize={0.015}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
        >
          PWR
        </Text>
        <Text
          position={[0.15, 0.09, 0.28]}
          fontSize={0.015}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
        >
          CHG
        </Text>

        {/* Test button */}
        <mesh position={[0, -0.12, 0.27]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.02, 12]} />
          <meshStandardMaterial color="#D32F2F" metalness={0.6} roughness={0.4} />
        </mesh>

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
              position={[port.position[0], port.position[1] - 0.08, port.position[2] + 0.02]}
              fontSize={0.012}
              color="#E0E0E0"
              fontWeight="bold"
              anchorX="center"
              anchorY="middle"
            >
              {port.label}
            </Text>
          </group>
        ))}

        {/* Professional labeling */}
        <Text
          position={[0, -0.02, 0.275]}
          fontSize={0.025}
          color="#1A237E"
          fontWeight="bold"
          anchorX="center"
          anchorY="middle"
        >
          EMERGENCY
        </Text>
        
        <Text
          position={[0, -0.08, 0.275]}
          fontSize={0.02}
          color="#3F51B5"
          fontWeight="bold"
          anchorX="center"
          anchorY="middle"
        >
          LED LIGHTING
        </Text>

        {/* Emergency symbol */}
        <Text
          position={[0.45, 0, 0.28]}
          fontSize={0.04}
          color="#D32F2F"
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
          position={[0, 1, 0]}
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
        <mesh position={[0, -0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.5, 1.8, 32]} />
          <meshBasicMaterial color="#4CAF50" transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
};

// Static property for accessing connection ports
EmergencyLighting.connectionPorts = [
  // Power connections
  { id: 'ac_power_l', label: 'AC-L', position: [0.3, -0.15, 0.25], type: 'electric', direction: 'input' },
  { id: 'ac_power_n', label: 'AC-N', position: [0.4, -0.15, 0.25], type: 'electric', direction: 'input' },
  { id: 'ac_power_gnd', label: 'GND', position: [0.5, -0.15, 0.25], type: 'electric', direction: 'input' },
  
  // Control connections
  { id: 'remote_test', label: 'TEST', position: [-0.3, -0.15, 0.25], type: 'electric', direction: 'input' },
  { id: 'status_out', label: 'STATUS', position: [-0.4, -0.15, 0.25], type: 'electric', direction: 'output' },
  { id: 'em_network', label: 'EM-NET', position: [0, -0.15, 0.25], type: 'electric', direction: 'input' }
];

export default EmergencyLighting; 