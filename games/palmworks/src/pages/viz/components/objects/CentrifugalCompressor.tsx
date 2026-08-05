import { useRef, useState } from 'react';
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import type { PlantObjectComponent, PlantObjectProps } from './types';

interface CentrifugalCompressorProps extends PlantObjectProps {
  position: [number, number, number];
}

interface CentrifugalCompressorPort {
  id: string;
  type: 'electric' | 'liquid' | 'gas';
  label: string;
  offset: [number, number, number];
  direction: [number, number, number];
  required: boolean;
}

const CentrifugalCompressor: PlantObjectComponent<CentrifugalCompressorProps, CentrifugalCompressorPort> = ({ position, onClick, onDrag, isSelected, isDraggable, gridSnap, gridSize, onPortClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const fanRef = useRef<THREE.Group>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [hoveredPort, setHoveredPort] = useState<string | null>(null);
  const [, setDragStartPos] = useState<[number, number, number] | null>(null);
  const { camera, gl } = useThree();

  // Define connection ports for the centrifugal compressor
  const connectionPorts: CentrifugalCompressorPort[] = [
    {
      id: 'electric_in',
      type: 'electric',
      label: 'Motor Power Input',
      offset: [0, 1.5, -2.5],
      direction: [0, 0, -1],
      required: true
    },
    {
      id: 'gas_inlet',
      type: 'gas',
      label: 'Gas Suction Inlet',
      offset: [-2.8, 0.5, 0],
      direction: [-1, 0, 0],
      required: true
    },
    {
      id: 'gas_outlet',
      type: 'gas',
      label: 'Compressed Gas Outlet',
      offset: [2.8, 1.2, 0],
      direction: [1, 0, 0],
      required: false
    },
    {
      id: 'cooling_water_in',
      type: 'liquid',
      label: 'Cooling Water Inlet',
      offset: [-1.5, -1.5, 2.0],
      direction: [0, 0, 1],
      required: false
    },
    {
      id: 'cooling_water_out',
      type: 'liquid',
      label: 'Cooling Water Outlet',
      offset: [1.5, -1.5, 2.0],
      direction: [0, 0, 1],
      required: false
    },
    {
      id: 'antisurge_vent',
      type: 'gas',
      label: 'Anti-Surge Vent',
      offset: [0, 2.5, 1.5],
      direction: [0, 1, 0],
      required: false
    },
    {
      id: 'control_air',
      type: 'gas',
      label: 'Instrument Air',
      offset: [-2.0, 2.0, -1.0],
      direction: [-1, 0, 0],
      required: false
    },
    {
      id: 'drain_out',
      type: 'liquid',
      label: 'Condensate Drain',
      offset: [0, -2.5, 0],
      direction: [0, -1, 0],
      required: false
    }
  ];

  // Grid snap size (CAD-like behavior)
  const GRID_SIZE = gridSize || 1.0;

  const snapToGrid = (value: number): number => {
    if (!gridSnap) return value;
    return Math.round(value / GRID_SIZE) * GRID_SIZE;
  };

  useFrame(() => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      if (isSelected) {
        material.emissive.setHex(0x444444);
      } else if (hovered && isDraggable) {
        material.emissive.setHex(0x222222);
      } else {
        material.emissive.setHex(0x000000);
      }
    }
    
    // Rotate impeller when selected (simulating operation)
    if (fanRef.current && isSelected) {
      fanRef.current.rotation.z += 0.1;
    }
    
    // Scale slightly when dragging for better visual feedback
    if (groupRef.current) {
      const targetScale = isDragging ? 1.05 : 1;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15);
    }
  });

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    if (!isDraggable) {
      onClick?.(event);
      return;
    }

    event.stopPropagation();
    let hasMovedMouse = false;
    setDragStartPos(position);
    gl.domElement.style.cursor = 'grabbing';

    const handlePointerMove = (moveEvent: MouseEvent | TouchEvent) => {
      if (!onDrag) return;

      // A TouchEvent carries its coordinates on `.touches[0]`, not on the
      // event itself — reading `.clientX`/`.clientY` straight off the event
      // (as this used to) is always `undefined` for touch input, which is
      // why touch-drag never moved anything.
      const point = 'touches' in moveEvent ? moveEvent.touches[0] : moveEvent;
      if (!point) return;

      // Only set dragging to true when we actually move
      if (!hasMovedMouse) {
        hasMovedMouse = true;
        setIsDragging(true);
      }

      // Get intersection with ground plane
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      mouse.x = (point.clientX / gl.domElement.clientWidth) * 2 - 1;
      mouse.y = -(point.clientY / gl.domElement.clientHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // Intersect with ground plane at y=0
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const intersection = new THREE.Vector3();

      if (raycaster.ray.intersectPlane(plane, intersection)) {
        // Snap to grid for CAD-like behavior
        const snappedX = snapToGrid(intersection.x);
        const snappedZ = snapToGrid(intersection.z);
        const newPosition: [number, number, number] = [snappedX, position[1], snappedZ];
        onDrag(newPosition);
      }
    };

    const handlePointerUp = () => {
      // If no mouse movement occurred, it's a click, not a drag
      if (!hasMovedMouse) {
        setIsDragging(false);
        setDragStartPos(null);
        gl.domElement.style.cursor = isDraggable ? 'grab' : 'auto';

        // Remove event listeners
        document.removeEventListener('mousemove', handlePointerMove);
        document.removeEventListener('mouseup', handlePointerUp);
        document.removeEventListener('touchmove', handlePointerMove);
        document.removeEventListener('touchend', handlePointerUp);

        // Trigger click handler
        onClick?.(event);
        return;
      }

      setIsDragging(false);
      setDragStartPos(null);
      gl.domElement.style.cursor = isDraggable ? 'grab' : 'auto';

      document.removeEventListener('mousemove', handlePointerMove);
      document.removeEventListener('mouseup', handlePointerUp);
      document.removeEventListener('touchmove', handlePointerMove);
      document.removeEventListener('touchend', handlePointerUp);
    };

    // Add global event listeners for better drag experience
    document.addEventListener('mousemove', handlePointerMove);
    document.addEventListener('mouseup', handlePointerUp);
    document.addEventListener('touchmove', handlePointerMove);
    document.addEventListener('touchend', handlePointerUp);

    // Prevent default to avoid text selection
    (event as unknown as { preventDefault?: () => void }).preventDefault?.();
  };

  const handlePortClick = (port: CentrifugalCompressorPort, event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (onPortClick) {
      onPortClick(port, position, event);
    }
  };

  const handlePointerEnter = () => {
    setHovered(true);
    if (isDraggable) {
      gl.domElement.style.cursor = 'grab';
    }
  };

  const handlePointerLeave = () => {
    setHovered(false);
    setHoveredPort(null);
    if (!isDragging) {
      gl.domElement.style.cursor = 'auto';
    }
  };

  const handlePortHover = (portId: string) => {
    setHoveredPort(portId);
    gl.domElement.style.cursor = 'pointer';
  };

  const handlePortLeave = () => {
    setHoveredPort(null);
    gl.domElement.style.cursor = isDraggable ? 'grab' : 'auto';
  };

  const getPortColor = (port: CentrifugalCompressorPort): string => {
    switch (port.type) {
      case 'electric': return '#FF5722';
      case 'liquid': return '#2196F3';
      case 'gas': return '#FFC107';
      default: return '#666666';
    }
  };

  return (
    <group 
      ref={groupRef}
      position={position}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      {/* Grid snap indicators - show snapping points when dragging */}
      {isDragging && gridSnap && (
        <>
          {/* Show grid snap preview */}
          <mesh position={[0, -2.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[2.0, 2.5, 16]} />
            <meshBasicMaterial color="#ffeb3b" transparent opacity={0.3} />
          </mesh>
          
          {/* Show coordinate text overlay */}
          <mesh position={[0, 4, 0]}>
            <sphereGeometry args={[0.05]} />
            <meshBasicMaterial color="#ffeb3b" />
          </mesh>
        </>
      )}
      
      {/* Invisible larger collision box for easier interaction */}
      <mesh
        onPointerDown={handlePointerDown}
        visible={false}
      >
        <boxGeometry args={[6, 5, 5]} />
      </mesh>
      
      {/* Compressor Base/Skid */}
      <mesh position={[0, -2.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[5.5, 0.3, 4.0]} />
        <meshStandardMaterial 
          color="#2C3E50" 
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>
      
      {/* Skid Support Beams */}
      {Array.from({ length: 3 }, (_, i) => (
        <mesh key={i} position={[-2.2 + i * 2.2, -2.6, 0]} castShadow>
          <boxGeometry args={[0.2, 0.2, 4.0]} />
          <meshStandardMaterial 
            color="#34495E" 
            metalness={0.7}
            roughness={0.4}
          />
        </mesh>
      ))}
      
      {/* Main Compressor Casing */}
      <mesh
        ref={meshRef}
        position={[0, 0.5, 0]}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[1.4, 1.4, 2.0, 24]} />
        <meshStandardMaterial 
          color="#BDC3C7" 
          metalness={0.8}
          roughness={0.2}
          envMapIntensity={0.5}
        />
      </mesh>
      
      {/* Compressor Volute (Spiral Casing) */}
      <mesh position={[0.8, 0.5, 0]} castShadow>
        <torusGeometry args={[1.2, 0.4, 8, 20]} />
        <meshStandardMaterial 
          color="#95A5A6" 
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      
      {/* Suction Inlet Bell */}
      <mesh position={[-2.2, 0.5, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <coneGeometry args={[0.8, 1.2, 16]} />
        <meshStandardMaterial 
          color="#85929E" 
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Discharge Volute Extension */}
      <mesh position={[2.2, 1.2, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.6, 0.8, 1.2, 16]} />
        <meshStandardMaterial 
          color="#7F8C8D" 
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>
      
      {/* Impeller Assembly (visible through cutaway) */}
      <group ref={fanRef} position={[0, 0.5, 0]}>
        {/* Central Hub */}
        <mesh castShadow>
          <cylinderGeometry args={[0.3, 0.3, 0.4, 12]} />
          <meshStandardMaterial 
            color="#E74C3C" 
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        
        {/* Impeller Blades */}
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i * Math.PI) / 6;
          const x = Math.cos(angle) * 0.8;
          const z = Math.sin(angle) * 0.8;
          return (
            <mesh 
              key={i} 
              position={[x, 0, z]} 
              rotation={[0, angle + Math.PI / 2, Math.PI / 12]}
              castShadow
            >
              <boxGeometry args={[0.6, 0.15, 0.03]} />
              <meshStandardMaterial 
                color="#C0392B" 
                metalness={0.9}
                roughness={0.1}
              />
            </mesh>
          );
        })}
        
        {/* Blade Shroud */}
        <mesh castShadow>
          <cylinderGeometry args={[1.3, 1.3, 0.05, 24]} />
          <meshStandardMaterial 
            color="#A93226" 
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </group>
      
      {/* Electric Motor */}
      <mesh position={[0, 1.5, -1.8]} castShadow>
        <cylinderGeometry args={[0.8, 0.8, 1.5, 16]} />
        <meshStandardMaterial 
          color="#2C3E50" 
          metalness={0.4}
          roughness={0.7}
        />
      </mesh>
      
      {/* Motor End Caps */}
      <mesh position={[0, 1.5, -2.6]} castShadow>
        <cylinderGeometry args={[0.85, 0.85, 0.2, 16]} />
        <meshStandardMaterial 
          color="#1C2833" 
          metalness={0.5}
          roughness={0.6}
        />
      </mesh>
      <mesh position={[0, 1.5, -1.0]} castShadow>
        <cylinderGeometry args={[0.85, 0.85, 0.2, 16]} />
        <meshStandardMaterial 
          color="#1C2833" 
          metalness={0.5}
          roughness={0.6}
        />
      </mesh>
      
      {/* Motor Cooling Fins */}
      {Array.from({ length: 16 }, (_, i) => {
        const angle = (i * Math.PI) / 8;
        const x = Math.cos(angle) * 0.85;
        const z = -1.8 + Math.sin(angle) * 0.85;
        return (
          <mesh key={i} position={[x, 1.5, z]} castShadow>
            <boxGeometry args={[0.06, 1.2, 0.03]} />
            <meshStandardMaterial 
              color="#34495E" 
              metalness={0.4}
              roughness={0.7}
            />
          </mesh>
        );
      })}
      
      {/* Coupling/Gearbox */}
      <mesh position={[0, 1.0, -0.8]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.6, 12]} />
        <meshStandardMaterial 
          color="#566573" 
          metalness={0.7}
          roughness={0.4}
        />
      </mesh>
      
      {/* Drive Shaft */}
      <mesh position={[0, 0.5, -0.4]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 1.0, 12]} />
        <meshStandardMaterial 
          color="#2C3E50" 
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      
      {/* Intercooler */}
      <mesh position={[1.5, -1.0, 1.5]} castShadow>
        <boxGeometry args={[1.2, 0.8, 0.6]} />
        <meshStandardMaterial 
          color="#5DADE2" 
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>
      
      {/* Intercooler Fins/Tubes */}
      {Array.from({ length: 8 }, (_, i) => (
        <mesh key={i} position={[1.5, -1.0, 1.2 + i * 0.075]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 1.2, 8]} />
          <meshStandardMaterial 
            color="#85C1E9" 
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}
      
      {/* Aftercooler */}
      <mesh position={[-1.5, -1.0, 1.5]} castShadow>
        <boxGeometry args={[1.2, 0.8, 0.6]} />
        <meshStandardMaterial 
          color="#48C9B0" 
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>
      
      {/* Aftercooler Fins/Tubes */}
      {Array.from({ length: 8 }, (_, i) => (
        <mesh key={i} position={[-1.5, -1.0, 1.2 + i * 0.075]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 1.2, 8]} />
          <meshStandardMaterial 
            color="#76D7C4" 
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}
      
      {/* Anti-Surge Valve */}
      <group position={[0, 2.2, 1.2]}>
        {/* Valve Body */}
        <mesh castShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.4, 8]} />
          <meshStandardMaterial 
            color="#E67E22" 
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
        {/* Actuator */}
        <mesh position={[0, 0.4, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.3, 8]} />
          <meshStandardMaterial 
            color="#D68910" 
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>
        {/* Positioner */}
        <mesh position={[0.2, 0.4, 0]} castShadow>
          <boxGeometry args={[0.15, 0.15, 0.1]} />
          <meshStandardMaterial 
            color="#B7950B" 
            metalness={0.1}
            roughness={0.8}
          />
        </mesh>
      </group>
      
      {/* Control Panel/PLC Cabinet */}
      <mesh position={[-2.5, 0.5, -1.8]} castShadow>
        <boxGeometry args={[0.6, 1.2, 0.3]} />
        <meshStandardMaterial 
          color="#2E4053" 
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>
      
      {/* Control Panel Display */}
      <mesh position={[-2.2, 0.8, -1.8]} castShadow>
        <boxGeometry args={[0.3, 0.2, 0.02]} />
        <meshStandardMaterial 
          color="#17202A" 
          metalness={0.1}
          roughness={0.9}
        />
      </mesh>
      
      {/* Control Buttons */}
      {Array.from({ length: 6 }, (_, i) => (
        <mesh key={i} position={[-2.2, 0.4 - i * 0.1, -1.79]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.02, 8]} />
          <meshStandardMaterial 
            color={i < 2 ? "#27AE60" : i < 4 ? "#E74C3C" : "#3498DB"} 
            metalness={0.3}
            roughness={0.7}
          />
        </mesh>
      ))}
      
      {/* Pressure Instruments */}
      {Array.from({ length: 4 }, (_, i) => {
        const positions = [[1.5, 1.8, 0], [-1.5, 1.8, 0], [2.5, 1.8, 0.5], [0, 1.8, 1.5]] as const;
        return (
          <group key={i} position={positions[i]}>
            {/* Gauge Body */}
            <mesh castShadow>
              <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
              <meshStandardMaterial 
                color="#F39C12" 
                metalness={0.2}
                roughness={0.7}
              />
            </mesh>
            {/* Gauge Face */}
            <mesh position={[0, 0.06, 0]} castShadow>
              <cylinderGeometry args={[0.12, 0.12, 0.02, 16]} />
              <meshStandardMaterial 
                color="#FEF9E7" 
                metalness={0.1}
                roughness={0.9}
              />
            </mesh>
            {/* Gauge Needle */}
            <mesh position={[0, 0.07, 0]} rotation={[0, 0, Math.PI / 3]} castShadow>
              <boxGeometry args={[0.08, 0.005, 0.005]} />
              <meshStandardMaterial 
                color="#C0392B" 
                metalness={0.0}
                roughness={0.8}
              />
            </mesh>
          </group>
        );
      })}
      
      {/* Vibration Sensors */}
      {Array.from({ length: 2 }, (_, i) => (
        <mesh key={i} position={[i === 0 ? -0.3 : 0.3, 0.8, 0.8]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.12, 8]} />
          <meshStandardMaterial 
            color="#8E44AD" 
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
      ))}
      
      {/* Foundation Bolts */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i * Math.PI) / 4;
        const x = Math.cos(angle) * 2.5;
        const z = Math.sin(angle) * 1.8;
        return (
          <mesh key={i} position={[x, -2.8, z]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.2, 8]} />
            <meshStandardMaterial 
              color="#5D6D7E" 
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>
        );
      })}
      
      {/* Connection Ports */}
      {connectionPorts.map((port) => {
        const isHovered = hoveredPort === port.id;
        const scale = isHovered ? 1.2 : 1;
        
        return (
          <group key={port.id} position={port.offset}>
            {/* Port Base */}
            <mesh
              scale={[scale, scale, scale]}
              onClick={(e) => handlePortClick(port, e)}
              onPointerEnter={() => handlePortHover(port.id)}
              onPointerLeave={handlePortLeave}
              castShadow
            >
              <cylinderGeometry args={[0.18, 0.18, 0.4, 8]} />
              <meshStandardMaterial 
                color={getPortColor(port)} 
                emissive={isHovered ? getPortColor(port) : '#000000'}
                emissiveIntensity={isHovered ? 0.3 : 0}
              />
            </mesh>
            
            {/* Port Flange */}
            <mesh
              scale={[scale, scale, scale]}
              onClick={(e) => handlePortClick(port, e)}
              onPointerEnter={() => handlePortHover(port.id)}
              onPointerLeave={handlePortLeave}
              castShadow
            >
              <cylinderGeometry args={[0.3, 0.3, 0.08, 8]} />
              <meshStandardMaterial color="#666666" />
            </mesh>
            
            {/* Port Type Indicator */}
            <mesh position={[0, 0.4, 0]} scale={[scale, scale, scale]}>
              {port.type === 'electric' && <octahedronGeometry args={[0.1]} />}
              {port.type === 'liquid' && <sphereGeometry args={[0.1, 8, 8]} />}
              {port.type === 'gas' && <coneGeometry args={[0.1, 0.15, 6]} />}
              <meshStandardMaterial 
                color={getPortColor(port)}
                emissive={getPortColor(port)}
                emissiveIntensity={0.5}
              />
            </mesh>
            
            {/* Port Direction Indicator */}
            <mesh 
              position={[port.direction[0] * 0.5, port.direction[1] * 0.5, port.direction[2] * 0.5]}
              rotation={[
                port.direction[0] !== 0 ? Math.PI / 2 : 0,
                port.direction[2] !== 0 ? Math.PI / 2 : 0,
                0
              ]}
            >
              <coneGeometry args={[0.06, 0.25, 4]} />
              <meshBasicMaterial color={getPortColor(port)} transparent opacity={0.7} />
            </mesh>
            
            {/* Port Label (when hovered) */}
            {isHovered && (
              <mesh position={[0, 0.8, 0]}>
                <sphereGeometry args={[0.04]} />
                <meshBasicMaterial color="#ffeb3b" />
              </mesh>
            )}
          </group>
        );
      })}
      
      {/* Selection indicator when selected and draggable */}
      {isSelected && isDraggable && (
        <>
          <mesh position={[0, 3.5, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.4, 6]} />
            <meshStandardMaterial color="#ffeb3b" emissive="#ffeb3b" emissiveIntensity={0.3} />
          </mesh>
          
          {/* Grid position indicator */}
          <mesh position={[0, -3.0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[2.2, 2.8, 16]} />
            <meshBasicMaterial color="#2196F3" transparent opacity={0.5} />
          </mesh>
        </>
      )}
      
      {/* Show all ports when selected */}
      {isSelected && (
        <>
          {connectionPorts.map((port) => (
            <mesh 
              key={`port-highlight-${port.id}`}
              position={port.offset}
            >
              <ringGeometry args={[0.4, 0.5, 16]} />
              <meshBasicMaterial 
                color={getPortColor(port)} 
                transparent 
                opacity={0.5}
                side={THREE.DoubleSide}
              />
            </mesh>
          ))}
        </>
      )}
    </group>
  );
};

// Export the component with its connection port definitions
CentrifugalCompressor.connectionPorts = [
  {
    id: 'electric_in',
    type: 'electric',
    label: 'Motor Power Input',
    offset: [0, 1.5, -2.5],
    direction: [0, 0, -1],
    required: true
  },
  {
    id: 'gas_inlet',
    type: 'gas',
    label: 'Gas Suction Inlet',
    offset: [-2.8, 0.5, 0],
    direction: [-1, 0, 0],
    required: true
  },
  {
    id: 'gas_outlet',
    type: 'gas',
    label: 'Compressed Gas Outlet',
    offset: [2.8, 1.2, 0],
    direction: [1, 0, 0],
    required: false
  },
  {
    id: 'cooling_water_in',
    type: 'liquid',
    label: 'Cooling Water Inlet',
    offset: [-1.5, -1.5, 2.0],
    direction: [0, 0, 1],
    required: false
  },
  {
    id: 'cooling_water_out',
    type: 'liquid',
    label: 'Cooling Water Outlet',
    offset: [1.5, -1.5, 2.0],
    direction: [0, 0, 1],
    required: false
  },
  {
    id: 'antisurge_vent',
    type: 'gas',
    label: 'Anti-Surge Vent',
    offset: [0, 2.5, 1.5],
    direction: [0, 1, 0],
    required: false
  },
  {
    id: 'control_air',
    type: 'gas',
    label: 'Instrument Air',
    offset: [-2.0, 2.0, -1.0],
    direction: [-1, 0, 0],
    required: false
  },
  {
    id: 'drain_out',
    type: 'liquid',
    label: 'Condensate Drain',
    offset: [0, -2.5, 0],
    direction: [0, -1, 0],
    required: false
  }
];

export default CentrifugalCompressor; 