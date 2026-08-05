import { useRef, useState } from 'react';
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import type { PlantObjectComponent, PlantObjectProps } from './types';

interface SensorProps extends PlantObjectProps {
  position: [number, number, number];
}

interface SensorPort {
  id: string;
  type: 'electric' | 'liquid' | 'gas';
  label: string;
  offset: [number, number, number];
  direction: [number, number, number];
  required: boolean;
}

const Sensor: PlantObjectComponent<SensorProps, SensorPort> = ({ position, onClick, onDrag, isSelected, isDraggable, gridSnap, gridSize, onPortClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [hoveredPort, setHoveredPort] = useState<string | null>(null);
  const { camera, gl } = useThree();

  // Define connection ports for the sensor
  const connectionPorts: SensorPort[] = [
    {
      id: 'electric_power',
      type: 'electric',
      label: 'Power Input',
      offset: [0.9, 0.4, 0.6],
      direction: [1, 0, 0],
      required: true
    },
    {
      id: 'electric_signal',
      type: 'electric',
      label: 'Signal Output',
      offset: [0.9, 0.4, 0.3],
      direction: [1, 0, 0],
      required: false
    }
  ];

  const snapToGrid = (value: number): number => {
    if (!gridSnap) return value;
    return Math.round(value / gridSize!) * gridSize!;
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

    // Prevent default to avoid text selection. See Boiler.tsx: ThreeEvent
    // never actually has `.preventDefault` (only non-function properties are
    // copied from the native event), so this was already a silent no-op.
    (event as unknown as { preventDefault?: () => void }).preventDefault?.();
  };

  const handlePortClick = (port: SensorPort, event: ThreeEvent<MouseEvent>) => {
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

  const getPortColor = (port: SensorPort): string => {
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
      {/* Grid snap indicators when dragging */}
      {isDragging && gridSnap && (
        <mesh position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.8, 1.2, 16]} />
          <meshBasicMaterial color="#ffeb3b" transparent opacity={0.3} />
        </mesh>
      )}
      
      {/* Invisible larger collision box for easier interaction */}
      <mesh
        onPointerDown={handlePointerDown}
        visible={false}
      >
        <boxGeometry args={[2, 2, 2]} />
      </mesh>
      
      {/* Main Sensor Body */}
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshLambertMaterial color="#9C27B0" />
      </mesh>
      
      {/* Sensor Housing */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.6, 0.6, 0.3, 16]} />
        <meshLambertMaterial color="#7b1fa2" />
      </mesh>
      
      {/* Lens/Window */}
      <mesh position={[0, 0, 0.52]} castShadow>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshLambertMaterial color="#e1bee7" transparent opacity={0.8} />
      </mesh>
      
      {/* Mounting Bracket */}
      <mesh position={[0, -0.7, 0]} castShadow>
        <boxGeometry args={[1.2, 0.2, 0.2]} />
        <meshLambertMaterial color="#666666" />
      </mesh>
      
      {/* Mounting Posts */}
      <mesh position={[-0.5, -1, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.6, 8]} />
        <meshLambertMaterial color="#444444" />
      </mesh>
      
      <mesh position={[0.5, -1, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.6, 8]} />
        <meshLambertMaterial color="#444444" />
      </mesh>
      
      {/* Signal Cable */}
      <mesh position={[0.6, 0, 0.3]} rotation={[0, 0, Math.PI / 4]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.8, 6]} />
        <meshLambertMaterial color="#000000" />
      </mesh>
      
      {/* Status LED */}
      <mesh position={[0, 0.3, 0.45]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.02, 8]} />
        <meshLambertMaterial color="#00ff00" />
      </mesh>
      
      {/* Calibration Access Port */}
      <mesh position={[0, -0.3, 0.45]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.05, 6]} />
        <meshLambertMaterial color="#ffeb3b" />
      </mesh>
      
      {/* Protective Cover */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <coneGeometry args={[0.4, 0.3, 8]} />
        <meshLambertMaterial color="#616161" />
      </mesh>
      
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
              <cylinderGeometry args={[0.08, 0.08, 0.2, 8]} />
              <meshLambertMaterial 
                color={getPortColor(port)} 
                emissive={isHovered ? getPortColor(port) : '#000000'}
                emissiveIntensity={isHovered ? 0.3 : 0}
              />
            </mesh>
            
            {/* Port Type Indicator */}
            <mesh position={[0, 0.2, 0]} scale={[scale, scale, scale]}>
              {port.type === 'electric' && <octahedronGeometry args={[0.05]} />}
              {port.type === 'liquid' && <sphereGeometry args={[0.05, 8, 8]} />}
              {port.type === 'gas' && <coneGeometry args={[0.05, 0.08, 6]} />}
              <meshLambertMaterial 
                color={getPortColor(port)}
                emissive={getPortColor(port)}
                emissiveIntensity={0.5}
              />
            </mesh>
            
            {/* Port Label (when hovered) */}
            {isHovered && (
              <mesh position={[0, 0.4, 0]}>
                <sphereGeometry args={[0.02]} />
                <meshBasicMaterial color="#ffeb3b" />
              </mesh>
            )}
          </group>
        );
      })}
      
      {/* Selection indicator when selected and draggable */}
      {isSelected && isDraggable && (
        <>
          <mesh position={[0, 1.2, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.3, 6]} />
            <meshLambertMaterial color="#ffeb3b" emissive="#ffeb3b" emissiveIntensity={0.3} />
          </mesh>
          
          {/* Grid position indicator */}
          <mesh position={[0, -1.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.5, 0.7, 16]} />
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
              <ringGeometry args={[0.2, 0.25, 16]} />
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
Sensor.connectionPorts = [
  {
    id: 'electric_power',
    type: 'electric',
    label: 'Power Input',
    offset: [0.9, 0.4, 0.6],
    direction: [1, 0, 0],
    required: true
  },
  {
    id: 'electric_signal',
    type: 'electric',
    label: 'Signal Output',
    offset: [0.9, 0.4, 0.3],
    direction: [1, 0, 0],
    required: false
  }
];

export default Sensor; 