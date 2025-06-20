import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const RemoteTerminalUnit = ({ 
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
  const statusLEDRef = useRef();
  const commLEDRef = useRef();
  const antennaRef = useRef();

  // Professional RTU connection ports - updated positions for larger cabinet
  const connectionPorts = [
    // Digital I/O ports - upper terminal row
    { id: 'digital_in_1', label: 'DI-1', position: [-0.9, 0.5, 1.15], type: 'electric', direction: 'input' },
    { id: 'digital_in_2', label: 'DI-2', position: [-0.7, 0.5, 1.15], type: 'electric', direction: 'input' },
    { id: 'digital_in_3', label: 'DI-3', position: [-0.5, 0.5, 1.15], type: 'electric', direction: 'input' },
    { id: 'digital_in_4', label: 'DI-4', position: [-0.3, 0.5, 1.15], type: 'electric', direction: 'input' },
    
    { id: 'digital_out_1', label: 'DO-1', position: [0.3, 0.5, 1.15], type: 'electric', direction: 'output' },
    { id: 'digital_out_2', label: 'DO-2', position: [0.5, 0.5, 1.15], type: 'electric', direction: 'output' },
    { id: 'digital_out_3', label: 'DO-3', position: [0.7, 0.5, 1.15], type: 'electric', direction: 'output' },
    { id: 'digital_out_4', label: 'DO-4', position: [0.9, 0.5, 1.15], type: 'electric', direction: 'output' },
    
    // Analog I/O ports - lower terminal row
    { id: 'analog_in_1', label: 'AI-1', position: [-0.9, 0.1, 1.15], type: 'electric', direction: 'input' },
    { id: 'analog_in_2', label: 'AI-2', position: [-0.7, 0.1, 1.15], type: 'electric', direction: 'input' },
    { id: 'analog_in_3', label: 'AI-3', position: [-0.5, 0.1, 1.15], type: 'electric', direction: 'input' },
    { id: 'analog_in_4', label: 'AI-4', position: [-0.3, 0.1, 1.15], type: 'electric', direction: 'input' },
    
    { id: 'analog_out_1', label: 'AO-1', position: [0.3, 0.1, 1.15], type: 'electric', direction: 'output' },
    { id: 'analog_out_2', label: 'AO-2', position: [0.5, 0.1, 1.15], type: 'electric', direction: 'output' },
    
    // Communication and power connectors - bottom section
    { id: 'comm_ethernet', label: 'ETH', position: [-0.5, -0.5, 1.15], type: 'electric', direction: 'input' },
    { id: 'comm_serial', label: 'RS485', position: [0, -0.5, 1.15], type: 'electric', direction: 'input' },
    { id: 'power_input', label: 'PWR', position: [0.5, -0.5, 1.15], type: 'electric', direction: 'input' },
    
    // Auxiliary outputs
    { id: 'aux_out_1', label: 'AUX-1', position: [-0.3, -0.5, 1.15], type: 'electric', direction: 'output' },
    { id: 'aux_out_2', label: 'AUX-2', position: [0.3, -0.5, 1.15], type: 'electric', direction: 'output' }
  ];

  useFrame((state) => {
    // Animate status LEDs
    if (statusLEDRef.current) {
      const intensity = 0.8 + Math.sin(state.clock.getElapsedTime() * 2) * 0.2;
      statusLEDRef.current.material.emissiveIntensity = intensity;
    }
    
    if (commLEDRef.current) {
      const blinkRate = 4; // Communication activity blink
      const intensity = Math.sin(state.clock.getElapsedTime() * blinkRate) > 0 ? 0.9 : 0.1;
      commLEDRef.current.material.emissiveIntensity = intensity;
    }
    
    // Gentle antenna rotation for scanning
    if (antennaRef.current) {
      antennaRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.2;
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
      {/* Main RTU Cabinet */}
      <group>
        {/* Main enclosure body */}
        <mesh 
          castShadow 
          receiveShadow
          onPointerDown={handlePointerDown}
          onClick={handleClick}
        >
          <boxGeometry args={[2.2, 3.2, 1.4]} />
          <meshStandardMaterial 
            color={isSelected ? "#4CAF50" : "#2E3440"}
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>

        {/* Front panel with professional finish */}
        <mesh position={[0, 0, 0.71]} castShadow>
          <boxGeometry args={[2.1, 3.1, 0.03]} />
          <meshStandardMaterial 
            color="#3C4043" 
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>

        {/* Beveled edges - top */}
        <mesh position={[0, 1.6, 0.72]} castShadow>
          <boxGeometry args={[2.0, 0.05, 0.01]} />
          <meshStandardMaterial color="#5F6368" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Beveled edges - bottom */}
        <mesh position={[0, -1.6, 0.72]} castShadow>
          <boxGeometry args={[2.0, 0.05, 0.01]} />
          <meshStandardMaterial color="#5F6368" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Professional control panel section */}
        <mesh position={[0, 0.8, 0.72]} castShadow>
          <boxGeometry args={[1.9, 1.2, 0.04]} />
          <meshStandardMaterial 
            color="#4A4A4A" 
            metalness={0.7}
            roughness={0.4}
          />
        </mesh>

        {/* Control panel border */}
        <mesh position={[0, 0.8, 0.73]} castShadow>
          <boxGeometry args={[1.92, 1.22, 0.01]} />
          <meshStandardMaterial color="#6C757D" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Ventilation grilles - professional pattern */}
        {[...Array(8)].map((_, i) => (
          <mesh key={`top-vent-${i}`} position={[-0.7 + i * 0.2, 1.4, 0.72]} castShadow>
            <boxGeometry args={[0.15, 0.03, 0.02]} />
            <meshStandardMaterial color="#1A1A1A" />
          </mesh>
        ))}

        {[...Array(8)].map((_, i) => (
          <mesh key={`bottom-vent-${i}`} position={[-0.7 + i * 0.2, -1.4, 0.72]} castShadow>
            <boxGeometry args={[0.15, 0.03, 0.02]} />
            <meshStandardMaterial color="#1A1A1A" />
          </mesh>
        ))}

        {/* Side cable management system */}
        <mesh position={[-1.11, 0, 0]} castShadow>
          <boxGeometry args={[0.1, 2.0, 1.4]} />
          <meshStandardMaterial color="#2A2A2A" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[1.11, 0, 0]} castShadow>
          <boxGeometry args={[0.1, 2.0, 1.4]} />
          <meshStandardMaterial color="#2A2A2A" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Professional cable entries with strain relief */}
        {[...Array(4)].map((_, i) => (
          <group key={`cable-entry-${i}`}>
            <mesh position={[-1.16, 1.0 - i * 0.6, 0]} rotation={[0, 0, Math.PI/2]} castShadow>
              <cylinderGeometry args={[0.08, 0.08, 0.15, 8]} />
              <meshStandardMaterial color="#1C1C1C" metalness={0.9} />
            </mesh>
            {/* Strain relief boot */}
            <mesh position={[-1.23, 1.0 - i * 0.6, 0]} rotation={[0, 0, Math.PI/2]} castShadow>
              <cylinderGeometry args={[0.12, 0.08, 0.1, 8]} />
              <meshStandardMaterial color="#333333" />
            </mesh>
          </group>
        ))}

        {/* Top antenna mount with professional base */}
        <mesh position={[0.7, 1.61, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.05, 12]} />
          <meshStandardMaterial color="#2E3440" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Professional communication antenna */}
        <group ref={antennaRef} position={[0.7, 1.61, 0]}>
          {/* Antenna connector */}
          <mesh position={[0, 0.08, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.06, 0.1, 12]} />
            <meshStandardMaterial color="#1C1C1C" metalness={0.9} roughness={0.1} />
          </mesh>
          
          {/* Professional antenna rod - telescopic */}
          <mesh position={[0, 0.25, 0]} castShadow>
            <cylinderGeometry args={[0.012, 0.015, 0.3, 8]} />
            <meshStandardMaterial color="#E0E0E0" metalness={0.95} roughness={0.05} />
          </mesh>
          
          {/* Upper antenna section */}
          <mesh position={[0, 0.45, 0]} castShadow>
            <cylinderGeometry args={[0.008, 0.012, 0.25, 8]} />
            <meshStandardMaterial color="#F5F5F5" metalness={0.95} roughness={0.05} />
          </mesh>
          
          {/* Antenna tip with LED indicator */}
          <mesh position={[0, 0.6, 0]} castShadow>
            <sphereGeometry args={[0.025, 12, 12]} />
            <meshStandardMaterial color="#FF3D00" emissive="#FF3D00" emissiveIntensity={0.4} />
          </mesh>
        </group>

        {/* Professional status indicator panel */}
        <mesh position={[-0.6, 1.0, 0.74]} castShadow>
          <boxGeometry args={[0.8, 0.4, 0.02]} />
          <meshStandardMaterial color="#1A1A1A" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Status indicators with professional housing */}
        {/* Power LED */}
        <group>
          <mesh position={[-0.8, 1.1, 0.74]} castShadow>
            <cylinderGeometry args={[0.035, 0.035, 0.02, 16]} />
            <meshStandardMaterial color="#2A2A2A" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh ref={statusLEDRef} position={[-0.8, 1.1, 0.75]} castShadow>
            <cylinderGeometry args={[0.025, 0.025, 0.01, 16]} />
            <meshStandardMaterial 
              color="#4CAF50" 
              emissive="#4CAF50" 
              emissiveIntensity={0.9}
              transparent
              opacity={0.95}
            />
          </mesh>
        </group>

        {/* Communication LED */}
        <group>
          <mesh position={[-0.6, 1.1, 0.74]} castShadow>
            <cylinderGeometry args={[0.035, 0.035, 0.02, 16]} />
            <meshStandardMaterial color="#2A2A2A" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh ref={commLEDRef} position={[-0.6, 1.1, 0.75]} castShadow>
            <cylinderGeometry args={[0.025, 0.025, 0.01, 16]} />
            <meshStandardMaterial 
              color="#2196F3" 
              emissive="#2196F3" 
              emissiveIntensity={0.9}
              transparent
              opacity={0.95}
            />
          </mesh>
        </group>

        {/* Alarm LED */}
        <group>
          <mesh position={[-0.4, 1.1, 0.74]} castShadow>
            <cylinderGeometry args={[0.035, 0.035, 0.02, 16]} />
            <meshStandardMaterial color="#2A2A2A" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[-0.4, 1.1, 0.75]} castShadow>
            <cylinderGeometry args={[0.025, 0.025, 0.01, 16]} />
            <meshStandardMaterial color="#333333" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>

        {/* Professional LCD display */}
        <mesh position={[0.4, 1.0, 0.74]} castShadow>
          <boxGeometry args={[0.7, 0.4, 0.03]} />
          <meshStandardMaterial 
            color="#0A0A0A" 
            emissive="#0D47A1" 
            emissiveIntensity={0.15}
          />
        </mesh>

        {/* Display bezel */}
        <mesh position={[0.4, 1.0, 0.75]} castShadow>
          <boxGeometry args={[0.72, 0.42, 0.01]} />
          <meshStandardMaterial color="#2A2A2A" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Professional display text */}
        <Text
          position={[0.4, 1.12, 0.76]}
          fontSize={0.025}
          color="#00E676"
          fontWeight="bold"
          anchorX="center"
          anchorY="middle"
        >
          RTU-3000 ONLINE
        </Text>
        <Text
          position={[0.4, 1.05, 0.76]}
          fontSize={0.018}
          color="#00E676"
          anchorX="center"
          anchorY="middle"
        >
          IP: 192.168.1.100
        </Text>
        <Text
          position={[0.4, 0.98, 0.76]}
          fontSize={0.015}
          color="#81C784"
          anchorX="center"
          anchorY="middle"
        >
          STATUS: OPERATIONAL
        </Text>
        <Text
          position={[0.4, 0.92, 0.76]}
          fontSize={0.012}
          color="#90CAF9"
          anchorX="center"
          anchorY="middle"
        >
          COMM: MODBUS TCP
        </Text>

        {/* Status indicator labels */}
        <Text
          position={[-0.8, 0.95, 0.76]}
          fontSize={0.015}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
        >
          PWR
        </Text>
        <Text
          position={[-0.6, 0.95, 0.76]}
          fontSize={0.015}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
        >
          COMM
        </Text>
        <Text
          position={[-0.4, 0.95, 0.76]}
          fontSize={0.015}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
        >
          ALARM
        </Text>

        {/* Professional terminal block section */}
        <mesh position={[0, 0.2, 0.73]} castShadow>
          <boxGeometry args={[2.0, 1.0, 0.05]} />
          <meshStandardMaterial 
            color="#2C2C2C" 
            metalness={0.7}
            roughness={0.4}
          />
        </mesh>

        {/* Terminal block rails */}
        <mesh position={[0, 0.6, 0.74]} castShadow>
          <boxGeometry args={[1.9, 0.05, 0.03]} />
          <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, -0.2, 0.74]} castShadow>
          <boxGeometry args={[1.9, 0.05, 0.03]} />
          <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Professional terminal connection points */}
        {connectionPorts.slice(0, 16).map((port, index) => (
          <group key={port.id}>
            {/* Terminal block base */}
            <mesh position={port.position} castShadow>
              <boxGeometry args={[0.08, 0.12, 0.08]} />
              <meshStandardMaterial color="#404040" metalness={0.6} roughness={0.4} />
            </mesh>
            
            {/* Terminal screw */}
            <mesh 
              position={[port.position[0], port.position[1] + 0.05, port.position[2] + 0.02]}
              onClick={(e) => handlePortClick(port, e)}
              castShadow
            >
              <cylinderGeometry args={[0.025, 0.025, 0.03, 6]} />
              <meshStandardMaterial 
                color="#C0C0C0"
                metalness={0.95}
                roughness={0.05}
              />
            </mesh>
            
            {/* Wire connection point */}
            <mesh 
              position={[port.position[0], port.position[1] - 0.03, port.position[2] + 0.02]}
              onClick={(e) => handlePortClick(port, e)}
              castShadow
            >
              <cylinderGeometry args={[0.035, 0.035, 0.04, 8]} />
              <meshStandardMaterial 
                color={
                  port.direction === 'input' ? '#FF7043' : 
                  port.direction === 'output' ? '#29B6F6' : '#66BB6A'
                }
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
            
            {/* Professional port label */}
            <Text
              position={[port.position[0], port.position[1] - 0.15, port.position[2] + 0.05]}
              fontSize={0.018}
              color="#E0E0E0"
              fontWeight="bold"
              anchorX="center"
              anchorY="middle"
            >
              {port.label}
            </Text>
          </group>
        ))}

        {/* Communication and power connector section */}
        <mesh position={[0, -0.5, 0.73]} castShadow>
          <boxGeometry args={[1.8, 0.4, 0.05]} />
          <meshStandardMaterial color="#1A1A1A" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Professional RJ45/Serial/Power connectors */}
        {connectionPorts.slice(16).map((port) => (
          <group key={port.id}>
            <mesh 
              position={port.position}
              onClick={(e) => handlePortClick(port, e)}
              castShadow
            >
              <boxGeometry args={[0.12, 0.08, 0.08]} />
              <meshStandardMaterial 
                color={
                  port.id.includes('power') ? '#D32F2F' :
                  port.id.includes('ethernet') ? '#1976D2' : 
                  port.id.includes('serial') ? '#388E3C' : '#9C27B0'
                }
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
            
            {/* Connector housing */}
            <mesh position={[port.position[0], port.position[1], port.position[2] - 0.05]} castShadow>
              <boxGeometry args={[0.14, 0.1, 0.06]} />
              <meshStandardMaterial color="#2A2A2A" metalness={0.7} roughness={0.3} />
            </mesh>
            
            <Text
              position={[port.position[0], port.position[1] - 0.12, port.position[2] + 0.05]}
              fontSize={0.016}
              color="#E0E0E0"
              fontWeight="bold"
              anchorX="center"
              anchorY="middle"
            >
              {port.label}
            </Text>
          </group>
        ))}

        {/* Professional certification and labeling */}
        <mesh position={[0, -1.0, 0.73]} castShadow>
          <boxGeometry args={[1.8, 0.3, 0.02]} />
          <meshStandardMaterial color="#F5F5F5" metalness={0.1} roughness={0.8} />
        </mesh>

        {/* Certification markings */}
        <Text
          position={[-0.7, -0.95, 0.74]}
          fontSize={0.02}
          color="#000000"
          fontWeight="bold"
          anchorX="center"
          anchorY="middle"
        >
          CE
        </Text>
        <Text
          position={[-0.5, -0.95, 0.74]}
          fontSize={0.02}
          color="#000000"
          fontWeight="bold"
          anchorX="center"
          anchorY="middle"
        >
          UL
        </Text>
        <Text
          position={[-0.3, -0.95, 0.74]}
          fontSize={0.015}
          color="#000000"
          anchorX="center"
          anchorY="middle"
        >
          IP65
        </Text>
        <Text
          position={[0.0, -0.95, 0.74]}
          fontSize={0.012}
          color="#000000"
          anchorX="center"
          anchorY="middle"
        >
          24VDC ±10%
        </Text>
        <Text
          position={[0.4, -0.95, 0.74]}
          fontSize={0.012}
          color="#000000"
          anchorX="center"
          anchorY="middle"
        >
          -40°C to +70°C
        </Text>
        <Text
          position={[0.7, -0.95, 0.74]}
          fontSize={0.01}
          color="#000000"
          anchorX="center"
          anchorY="middle"
        >
          FCC Part 15
        </Text>

        {/* QR Code placeholder */}
        <mesh position={[0.8, -1.05, 0.74]} castShadow>
          <boxGeometry args={[0.15, 0.15, 0.005]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        
        {/* QR Code pattern simulation */}
        {[...Array(6)].map((_, i) => 
          [...Array(6)].map((_, j) => (
            <mesh key={`qr-${i}-${j}`} position={[0.75 + i * 0.02, -1.0 + j * 0.02, 0.741]} castShadow>
              <boxGeometry args={[0.015, 0.015, 0.001]} />
              <meshStandardMaterial color={(i + j) % 2 === 0 ? "#FFFFFF" : "#000000"} />
            </mesh>
          ))
        )}

        {/* Professional DIN rail mounting system */}
        <mesh position={[0, -1.61, -0.5]} castShadow>
          <boxGeometry args={[2.0, 0.08, 0.4]} />
          <meshStandardMaterial color="#FFD700" metalness={0.95} roughness={0.05} />
        </mesh>

        {/* DIN rail clips */}
        <mesh position={[-0.9, -1.61, -0.65]} castShadow>
          <boxGeometry args={[0.1, 0.08, 0.1]} />
          <meshStandardMaterial color="#E0E0E0" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0.9, -1.61, -0.65]} castShadow>
          <boxGeometry args={[0.1, 0.08, 0.1]} />
          <meshStandardMaterial color="#E0E0E0" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Professional mounting brackets */}
        <mesh position={[-1.0, 1.5, -0.65]} castShadow>
          <boxGeometry args={[0.15, 0.15, 0.08]} />
          <meshStandardMaterial color="#2E3440" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[1.0, 1.5, -0.65]} castShadow>
          <boxGeometry args={[0.15, 0.15, 0.08]} />
          <meshStandardMaterial color="#2E3440" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[-1.0, -1.5, -0.65]} castShadow>
          <boxGeometry args={[0.15, 0.15, 0.08]} />
          <meshStandardMaterial color="#2E3440" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[1.0, -1.5, -0.65]} castShadow>
          <boxGeometry args={[0.15, 0.15, 0.08]} />
          <meshStandardMaterial color="#2E3440" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Professional grounding system */}
        <mesh position={[0, -1.61, 0.71]} rotation={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.25, 8]} />
          <meshStandardMaterial color="#4CAF50" metalness={0.8} roughness={0.2} />
        </mesh>
        
        {/* Ground terminal with professional finish */}
        <mesh position={[0, -1.61, 0.85]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.03, 12]} />
          <meshStandardMaterial color="#FFD700" metalness={0.95} roughness={0.05} />
        </mesh>

        {/* Ground symbol */}
        <Text
          position={[0, -1.45, 0.74]}
          fontSize={0.02}
          color="#4CAF50"
          fontWeight="bold"
          anchorX="center"
          anchorY="middle"
        >
          ⏚
        </Text>

        {/* Professional device nameplate */}
        <mesh position={[0, -1.3, 0.73]} castShadow>
          <boxGeometry args={[1.6, 0.25, 0.02]} />
          <meshStandardMaterial color="#E8EAF6" metalness={0.2} roughness={0.8} />
        </mesh>

        {/* Device identification */}
        <Text
          position={[0, -1.22, 0.74]}
          fontSize={0.035}
          color="#1A237E"
          fontWeight="bold"
          anchorX="center"
          anchorY="middle"
        >
          RTU-3000 Pro
        </Text>
        
        <Text
          position={[0, -1.32, 0.74]}
          fontSize={0.02}
          color="#3F51B5"
          fontWeight="bold"
          anchorX="center"
          anchorY="middle"
        >
          Remote Terminal Unit
        </Text>

        <Text
          position={[0, -1.38, 0.74]}
          fontSize={0.015}
          color="#424242"
          anchorX="center"
          anchorY="middle"
        >
          Model: RTU-3000P-24VDC-IO32
        </Text>

        {/* Serial number */}
        <Text
          position={[-0.6, -1.42, 0.74]}
          fontSize={0.012}
          color="#424242"
          anchorX="left"
          anchorY="middle"
        >
          S/N: RTU240100501
        </Text>

        {/* Manufacturing date */}
        <Text
          position={[0.6, -1.42, 0.74]}
          fontSize={0.012}
          color="#424242"
          anchorX="right"
          anchorY="middle"
        >
          MFG: 2024-01
        </Text>
      </group>

      {/* Coordinate display */}
      {showCoordinates && (
        <Text
          position={[0, 3, 0]}
          fontSize={0.2}
          color="yellow"
          anchorX="center"
          anchorY="middle"
        >
          {`(${position[0].toFixed(1)}, ${position[2].toFixed(1)})`}
        </Text>
      )}

      {/* Professional selection indicator */}
      {isSelected && (
        <mesh position={[0, -1.7, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.5, 2.8, 32]} />
          <meshBasicMaterial color="#4CAF50" transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
};

// Static property for accessing connection ports - Professional RTU configuration
RemoteTerminalUnit.connectionPorts = [
  // Digital I/O ports - upper terminal row
  { id: 'digital_in_1', label: 'DI-1', position: [-0.9, 0.5, 1.15], type: 'electric', direction: 'input' },
  { id: 'digital_in_2', label: 'DI-2', position: [-0.7, 0.5, 1.15], type: 'electric', direction: 'input' },
  { id: 'digital_in_3', label: 'DI-3', position: [-0.5, 0.5, 1.15], type: 'electric', direction: 'input' },
  { id: 'digital_in_4', label: 'DI-4', position: [-0.3, 0.5, 1.15], type: 'electric', direction: 'input' },
  
  { id: 'digital_out_1', label: 'DO-1', position: [0.3, 0.5, 1.15], type: 'electric', direction: 'output' },
  { id: 'digital_out_2', label: 'DO-2', position: [0.5, 0.5, 1.15], type: 'electric', direction: 'output' },
  { id: 'digital_out_3', label: 'DO-3', position: [0.7, 0.5, 1.15], type: 'electric', direction: 'output' },
  { id: 'digital_out_4', label: 'DO-4', position: [0.9, 0.5, 1.15], type: 'electric', direction: 'output' },
  
  // Analog I/O ports - lower terminal row
  { id: 'analog_in_1', label: 'AI-1', position: [-0.9, 0.1, 1.15], type: 'electric', direction: 'input' },
  { id: 'analog_in_2', label: 'AI-2', position: [-0.7, 0.1, 1.15], type: 'electric', direction: 'input' },
  { id: 'analog_in_3', label: 'AI-3', position: [-0.5, 0.1, 1.15], type: 'electric', direction: 'input' },
  { id: 'analog_in_4', label: 'AI-4', position: [-0.3, 0.1, 1.15], type: 'electric', direction: 'input' },
  
  { id: 'analog_out_1', label: 'AO-1', position: [0.3, 0.1, 1.15], type: 'electric', direction: 'output' },
  { id: 'analog_out_2', label: 'AO-2', position: [0.5, 0.1, 1.15], type: 'electric', direction: 'output' },
  
  // Communication and power connectors - bottom section
  { id: 'comm_ethernet', label: 'ETH', position: [-0.5, -0.5, 1.15], type: 'electric', direction: 'input' },
  { id: 'comm_serial', label: 'RS485', position: [0, -0.5, 1.15], type: 'electric', direction: 'input' },
  { id: 'power_input', label: 'PWR', position: [0.5, -0.5, 1.15], type: 'electric', direction: 'input' },
  
  // Auxiliary outputs
  { id: 'aux_out_1', label: 'AUX-1', position: [-0.3, -0.5, 1.15], type: 'electric', direction: 'output' },
  { id: 'aux_out_2', label: 'AUX-2', position: [0.3, -0.5, 1.15], type: 'electric', direction: 'output' }
];

export default RemoteTerminalUnit; 