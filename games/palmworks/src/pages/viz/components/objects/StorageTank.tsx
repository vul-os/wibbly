import { useRef, useState } from 'react';
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import type { PlantObjectComponent, PlantObjectProps } from './types';

interface StorageTankProps extends PlantObjectProps {
  position: [number, number, number];
}

interface StorageTankPort {
  id: string;
  type: 'electric' | 'liquid' | 'gas';
  label: string;
  offset: [number, number, number];
  direction: [number, number, number];
  required: boolean;
}

const StorageTank: PlantObjectComponent<StorageTankProps, StorageTankPort> = ({ position, onClick, onDrag, isSelected, isDraggable, gridSnap, gridSize, onPortClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [hoveredPort, setHoveredPort] = useState<string | null>(null);
  const [, setDragStartPos] = useState<[number, number, number] | null>(null);
  const { camera, gl } = useThree();

  // Define connection ports for the storage tank
  const connectionPorts: StorageTankPort[] = [
    {
      id: 'liquid_in',
      type: 'liquid',
      label: 'Water Inlet',
      offset: [0, 2.2, 1.0],
      direction: [0, 0, 1],
      required: true
    },
    {
      id: 'liquid_out',
      type: 'liquid',
      label: 'Water Outlet',
      offset: [0, -2.2, -1.0],
      direction: [0, 0, -1],
      required: true
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
      const material = meshRef.current.material as THREE.MeshLambertMaterial;
      if (isSelected) {
        material.emissive.setHex(0x444444);
      } else if (hovered && isDraggable) {
        material.emissive.setHex(0x222222);
      } else {
        material.emissive.setHex(0x000000);
      }
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
    
    const handlePointerMove = (moveEvent: MouseEvent) => {
      if (!onDrag) return;
      
      // Only set dragging to true when we actually move
      if (!hasMovedMouse) {
        hasMovedMouse = true;
        setIsDragging(true);
      }
      
      // Get intersection with ground plane
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
      
      mouse.x = (moveEvent.clientX / gl.domElement.clientWidth) * 2 - 1;
      mouse.y = -(moveEvent.clientY / gl.domElement.clientHeight) * 2 + 1;
      
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
        document.removeEventListener('touchmove', handlePointerMove as EventListener);
        document.removeEventListener('touchend', handlePointerUp as EventListener);
        
        // Trigger click handler
        onClick?.(event);
        return;
      }
      
      setIsDragging(false);
      setDragStartPos(null);
      gl.domElement.style.cursor = isDraggable ? 'grab' : 'auto';
      
      document.removeEventListener('mousemove', handlePointerMove);
      document.removeEventListener('mouseup', handlePointerUp);
      document.removeEventListener('touchmove', handlePointerMove as EventListener);
      document.removeEventListener('touchend', handlePointerUp as EventListener);
    };

    // Add global event listeners for better drag experience
    document.addEventListener('mousemove', handlePointerMove);
    document.addEventListener('mouseup', handlePointerUp);
    document.addEventListener('touchmove', handlePointerMove as EventListener);
    document.addEventListener('touchend', handlePointerUp as EventListener);
    
    // Prevent default to avoid text selection. See Boiler.tsx: ThreeEvent
    // never actually has `.preventDefault` (only non-function properties are
    // copied from the native event), so this was already a silent no-op.
    (event as unknown as { preventDefault?: () => void }).preventDefault?.();
  };

  const handlePortClick = (port: StorageTankPort, event: ThreeEvent<MouseEvent>) => {
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

  const getPortColor = (port: StorageTankPort): string => {
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
          <mesh position={[0, -3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.8, 1.2, 16]} />
            <meshBasicMaterial color="#ffeb3b" transparent opacity={0.3} />
          </mesh>
          
          {/* Show coordinate text overlay */}
          <mesh position={[0, 3.5, 0]}>
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
        <boxGeometry args={[3.5, 5, 3.5]} />
      </mesh>
      
      {/* Main Tank Body - Larger cylinder for storage */}
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[1.5, 1.5, 4, 24]} />
        <meshLambertMaterial color="#607D8B" />
      </mesh>
      
      {/* Top Cap */}
      <mesh position={[0, 2.1, 0]} castShadow>
        <cylinderGeometry args={[1.6, 1.6, 0.2, 24]} />
        <meshLambertMaterial color="#455A64" />
      </mesh>
      
      {/* Bottom Cap */}
      <mesh position={[0, -2.1, 0]} castShadow>
        <cylinderGeometry args={[1.6, 1.6, 0.2, 24]} />
        <meshLambertMaterial color="#455A64" />
      </mesh>
      
      {/* Water Level Indicator */}
      <mesh position={[1.6, 0, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 3, 8]} />
        <meshLambertMaterial color="#2196F3" />
      </mesh>
      
      {/* Water Level Glass */}
      <mesh position={[1.65, 0, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 2.8, 8]} />
        <meshLambertMaterial color="#ffffff" transparent opacity={0.3} />
      </mesh>
      
      {/* Manhole Cover */}
      <mesh position={[0, 2.25, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.1, 16]} />
        <meshLambertMaterial color="#37474F" />
      </mesh>
      
      {/* Tank Support Legs */}
      {[
        [1.2, -2.5, 1.2],
        [-1.2, -2.5, 1.2],
        [1.2, -2.5, -1.2],
        [-1.2, -2.5, -1.2]
      ].map((legPos, i) => (
        <mesh key={`leg-${i}`} position={legPos} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 1, 8]} />
          <meshLambertMaterial color="#37474F" />
        </mesh>
      ))}
      
      {/* Tank Support Base Plates */}
      {[
        [1.2, -3, 1.2],
        [-1.2, -3, 1.2],
        [1.2, -3, -1.2],
        [-1.2, -3, -1.2]
      ].map((platePos, i) => (
        <mesh key={`plate-${i}`} position={platePos} castShadow>
          <cylinderGeometry args={[0.25, 0.25, 0.1, 8]} />
          <meshLambertMaterial color="#37474F" />
        </mesh>
      ))}
      
      {/* Tank Ladder */}
      <mesh position={[-1.7, 0, 0]} castShadow>
        <boxGeometry args={[0.1, 4, 0.05]} />
        <meshLambertMaterial color="#37474F" />
      </mesh>
      
      {/* Ladder Rungs */}
      {[-1.5, -0.5, 0.5, 1.5].map((y, i) => (
        <mesh key={`rung-${i}`} position={[-1.6, y, 0]} castShadow>
          <boxGeometry args={[0.3, 0.05, 0.05]} />
          <meshLambertMaterial color="#37474F" />
        </mesh>
      ))}
      
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
              <cylinderGeometry args={[0.2, 0.2, 0.4, 8]} />
              <meshLambertMaterial 
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
              <meshLambertMaterial color="#666666" />
            </mesh>
            
            {/* Port Type Indicator */}
            <mesh position={[0, 0.35, 0]} scale={[scale, scale, scale]}>
              {port.type === 'electric' && <octahedronGeometry args={[0.1]} />}
              {port.type === 'liquid' && <sphereGeometry args={[0.1, 8, 8]} />}
              {port.type === 'gas' && <coneGeometry args={[0.1, 0.15, 6]} />}
              <meshLambertMaterial 
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
              <mesh position={[0, 0.7, 0]}>
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
          <mesh position={[0, 3, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.3, 6]} />
            <meshLambertMaterial color="#ffeb3b" emissive="#ffeb3b" emissiveIntensity={0.3} />
          </mesh>
          
          {/* Grid position indicator */}
          <mesh position={[0, -3.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.6, 0.8, 16]} />
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
              <ringGeometry args={[0.35, 0.4, 16]} />
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
StorageTank.connectionPorts = [
  {
    id: 'liquid_in',
    type: 'liquid',
    label: 'Water Inlet',
    offset: [0, 2.2, 1.0],
    direction: [0, 0, 1],
    required: true
  },
  {
    id: 'liquid_out',
    type: 'liquid',
    label: 'Water Outlet',
    offset: [0, -2.2, -1.0],
    direction: [0, 0, -1],
    required: true
  }
];

export default StorageTank; 