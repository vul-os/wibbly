import { useRef, useState } from 'react';
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import type { PlantObjectComponent, PlantObjectProps } from './types';

interface ConveyorBeltProps extends PlantObjectProps {
  position: [number, number, number];
}

interface ConveyorBeltPort {
  id: string;
  type: 'electric' | 'liquid' | 'gas';
  label: string;
  offset: [number, number, number];
  direction: [number, number, number];
  required: boolean;
}

const ConveyorBelt: PlantObjectComponent<ConveyorBeltProps, ConveyorBeltPort> = ({ position, onClick, onDrag, isSelected, isDraggable, gridSnap, gridSize, onPortClick }) => {
  const meshRef = useRef<THREE.Group>(null);
  const groupRef = useRef<THREE.Group>(null);
  const beltMaterialRef = useRef<THREE.MeshLambertMaterial>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [hoveredPort, setHoveredPort] = useState<string | null>(null);
  const [, setDragStartPos] = useState<[number, number, number] | null>(null);
  const { camera, gl } = useThree();

  // Define connection ports for the conveyor belt
  const connectionPorts: ConveyorBeltPort[] = [
    {
      id: 'electric_in',
      type: 'electric',
      label: 'Power Input',
      offset: [3.2, 0.6, -1.2],
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

  // Create conveyor belt texture
  const createConveyorTexture = (): THREE.CanvasTexture => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    // Base belt color - dark gray/black
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Create red diagonal arrows (chevron pattern)
    ctx.strokeStyle = '#F44336'; // Red color
    ctx.lineWidth = 20;
    ctx.beginPath();
    
    // Draw multiple diagonal lines to create arrow pattern
    for (let i = 0; i < canvas.width; i += 60) {
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 40, canvas.height);
    }
    ctx.stroke();
    
    // Add belt texture details
    ctx.fillStyle = '#333333';
    for (let i = 0; i < canvas.width; i += 30) {
      ctx.fillRect(i, 0, 4, canvas.height);
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(8, 2);
    
    return texture;
  };

  useFrame((state) => {
    if (meshRef.current) {
      // `children` are plain `Object3D`s; only some are `Mesh`es with a
      // (possibly emissive) material, hence the cast + duck-typed guard
      // rather than assuming every child qualifies.
      if (isSelected) {
        meshRef.current.children.forEach((child) => {
          const material = (child as THREE.Mesh).material as THREE.MeshLambertMaterial | undefined;
          if (material && material.emissive) {
            material.emissive.setHex(0x444444);
          }
        });
      } else if (hovered && isDraggable) {
        meshRef.current.children.forEach((child) => {
          const material = (child as THREE.Mesh).material as THREE.MeshLambertMaterial | undefined;
          if (material && material.emissive) {
            material.emissive.setHex(0x222222);
          }
        });
      } else {
        meshRef.current.children.forEach((child) => {
          const material = (child as THREE.Mesh).material as THREE.MeshLambertMaterial | undefined;
          if (material && material.emissive) {
            material.emissive.setHex(0x000000);
          }
        });
      }
    }
    
    // Animate belt texture when running (always running when component exists)
    if (beltMaterialRef.current && beltMaterialRef.current.map) {
      const time = state.clock.elapsedTime;
      beltMaterialRef.current.map.offset.x = time * 0.8; // Faster movement like the example
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
    
    // Prevent default to avoid text selection. See Boiler.tsx: ThreeEvent
    // never actually has `.preventDefault` (only non-function properties are
    // copied from the native event), so this was already a silent no-op.
    (event as unknown as { preventDefault?: () => void }).preventDefault?.();
  };

  const handlePortClick = (port: ConveyorBeltPort, event: ThreeEvent<MouseEvent>) => {
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

  const getPortColor = (port: ConveyorBeltPort): string => {
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
          <mesh position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[2.0, 2.5, 16]} />
            <meshBasicMaterial color="#ffeb3b" transparent opacity={0.3} />
          </mesh>
          
          <mesh position={[0, 2, 0]}>
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
        <boxGeometry args={[8, 2, 3]} />
      </mesh>
      
      {/* Main conveyor structure */}
      <group ref={meshRef}>
        {/* Base Frame */}
        <mesh position={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[7.5, 0.2, 1.5]} />
          <meshLambertMaterial color="#444444" />
        </mesh>
        
        {/* Support Legs */}
        <mesh position={[-3, -0.4, 0.6]} castShadow>
          <boxGeometry args={[0.1, 0.8, 0.1]} />
          <meshLambertMaterial color="#333333" />
        </mesh>
        <mesh position={[-3, -0.4, -0.6]} castShadow>
          <boxGeometry args={[0.1, 0.8, 0.1]} />
          <meshLambertMaterial color="#333333" />
        </mesh>
        <mesh position={[0, -0.4, 0.6]} castShadow>
          <boxGeometry args={[0.1, 0.8, 0.1]} />
          <meshLambertMaterial color="#333333" />
        </mesh>
        <mesh position={[0, -0.4, -0.6]} castShadow>
          <boxGeometry args={[0.1, 0.8, 0.1]} />
          <meshLambertMaterial color="#333333" />
        </mesh>
        <mesh position={[3, -0.4, 0.6]} castShadow>
          <boxGeometry args={[0.1, 0.8, 0.1]} />
          <meshLambertMaterial color="#333333" />
        </mesh>
        <mesh position={[3, -0.4, -0.6]} castShadow>
          <boxGeometry args={[0.1, 0.8, 0.1]} />
          <meshLambertMaterial color="#333333" />
        </mesh>
        
        {/* Cross-braces between legs */}
        <mesh position={[-3, -0.8, 0]} castShadow>
          <boxGeometry args={[0.05, 0.05, 1.2]} />
          <meshLambertMaterial color="#444444" />
        </mesh>
        <mesh position={[0, -0.8, 0]} castShadow>
          <boxGeometry args={[0.05, 0.05, 1.2]} />
          <meshLambertMaterial color="#444444" />
        </mesh>
        <mesh position={[3, -0.8, 0]} castShadow>
          <boxGeometry args={[0.05, 0.05, 1.2]} />
          <meshLambertMaterial color="#444444" />
        </mesh>
        
        {/* Longitudinal support beams */}
        <mesh position={[0, -0.8, 0.6]} castShadow>
          <boxGeometry args={[6, 0.05, 0.05]} />
          <meshLambertMaterial color="#444444" />
        </mesh>
        <mesh position={[0, -0.8, -0.6]} castShadow>
          <boxGeometry args={[6, 0.05, 0.05]} />
          <meshLambertMaterial color="#444444" />
        </mesh>
        
        {/* Conveyor Belt Surface with animated texture */}
        <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
          <boxGeometry args={[7.0, 0.05, 1.2]} />
          <meshLambertMaterial 
            map={createConveyorTexture()} 
            ref={beltMaterialRef}
          />
        </mesh>
        
        {/* Side Rails */}
        <mesh position={[0, 0.5, 0.7]} castShadow>
          <boxGeometry args={[7.0, 0.1, 0.05]} />
          <meshLambertMaterial color="#666666" />
        </mesh>
        <mesh position={[0, 0.5, -0.7]} castShadow>
          <boxGeometry args={[7.0, 0.1, 0.05]} />
          <meshLambertMaterial color="#666666" />
        </mesh>
        
        {/* Motor Housing - smaller and better positioned */}
        <mesh position={[3.2, 0.6, -0.8]} castShadow>
          <boxGeometry args={[0.4, 0.4, 0.4]} />
          <meshLambertMaterial color="#1B5E20" />
        </mesh>
        
        {/* Electrical Connection Box */}
        <mesh position={[0, 0.6, -0.9]} castShadow>
          <boxGeometry args={[0.3, 0.2, 0.2]} />
          <meshLambertMaterial color="#37474F" />
        </mesh>
      </group>
      
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
              <cylinderGeometry args={[0.15, 0.15, 0.3, 8]} />
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
              <cylinderGeometry args={[0.25, 0.25, 0.05, 8]} />
              <meshLambertMaterial color="#666666" />
            </mesh>
            
            {/* Port Type Indicator */}
            <mesh position={[0, 0.3, 0]} scale={[scale, scale, scale]}>
              <octahedronGeometry args={[0.08]} />
              <meshLambertMaterial 
                color={getPortColor(port)}
                emissive={getPortColor(port)}
                emissiveIntensity={0.5}
              />
            </mesh>
            
            {/* Port Direction Indicator */}
            <mesh 
              position={[port.direction[0] * 0.4, port.direction[1] * 0.4, port.direction[2] * 0.4]}
              rotation={[
                port.direction[0] !== 0 ? Math.PI / 2 : 0,
                port.direction[2] !== 0 ? Math.PI / 2 : 0,
                0
              ]}
            >
              <coneGeometry args={[0.05, 0.2, 4]} />
              <meshBasicMaterial color={getPortColor(port)} transparent opacity={0.7} />
            </mesh>
            
            {/* Port Label (when hovered) */}
            {isHovered && (
              <mesh position={[0, 0.6, 0]}>
                <sphereGeometry args={[0.03]} />
                <meshBasicMaterial color="#ffeb3b" />
              </mesh>
            )}
          </group>
        );
      })}
      
      {/* Selection indicator when selected and draggable */}
      {isSelected && isDraggable && (
        <>
          <mesh position={[0, 2.0, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.3, 6]} />
            <meshLambertMaterial color="#ffeb3b" emissive="#ffeb3b" emissiveIntensity={0.3} />
          </mesh>
          
          <mesh position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.5, 2.0, 16]} />
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
              <ringGeometry args={[0.3, 0.35, 16]} />
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
ConveyorBelt.connectionPorts = [
  {
    id: 'electric_in',
    type: 'electric',
    label: 'Power Input',
    offset: [3.2, 0.6, -1.2],
    direction: [0, 0, -1],
    required: true
  }
];

export default ConveyorBelt; 