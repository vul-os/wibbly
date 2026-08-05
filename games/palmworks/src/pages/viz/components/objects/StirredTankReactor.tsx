import { useRef, useState } from 'react';
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import type { PlantObjectComponent, PlantObjectProps } from './types';

interface StirredTankReactorProps extends PlantObjectProps {
  position: [number, number, number];
}

interface StirredTankReactorPort {
  id: string;
  type: 'electric' | 'liquid' | 'gas';
  label: string;
  offset: [number, number, number];
  direction: [number, number, number];
  required: boolean;
}

const StirredTankReactor: PlantObjectComponent<StirredTankReactorProps, StirredTankReactorPort> = ({ position, onClick, onDrag, isSelected, isDraggable, gridSnap, gridSize, onPortClick }) => {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const agitatorRef = useRef<THREE.Group>(null);
  const { gl, camera } = useThree();

  const [isDragging, setIsDragging] = useState(false);
  const [, setHovered] = useState(false);
  const [hoveredPort, setHoveredPort] = useState<string | null>(null);
  const [, setDragStartPos] = useState<[number, number, number] | null>(null);

  // Connection ports for the reactor
  const connectionPorts: StirredTankReactorPort[] = [
    {
      id: 'electric_in',
      type: 'electric',
      label: 'Agitator Motor Power',
      offset: [0, 4.0, -2.2],
      direction: [0, 0, -1],
      required: true
    },
    {
      id: 'reactant_a_in',
      type: 'liquid',
      label: 'Reactant A Feed',
      offset: [-1.8, 2.0, 0],
      direction: [-1, 0, 0],
      required: true
    },
    {
      id: 'reactant_b_in',
      type: 'liquid',
      label: 'Reactant B Feed',
      offset: [1.8, 2.0, 0],
      direction: [1, 0, 0],
      required: true
    },
    {
      id: 'catalyst_in',
      type: 'liquid',
      label: 'Catalyst Feed',
      offset: [0, 3.0, 1.8],
      direction: [0, 0, 1],
      required: false
    },
    {
      id: 'steam_in',
      type: 'gas',
      label: 'Heating Steam',
      offset: [-2.2, 1.0, 0],
      direction: [-1, 0, 0],
      required: false
    },
    {
      id: 'cooling_water_in',
      type: 'liquid',
      label: 'Cooling Water In',
      offset: [-2.2, -0.5, 0],
      direction: [-1, 0, 0],
      required: false
    },
    {
      id: 'cooling_water_out',
      type: 'liquid',
      label: 'Cooling Water Out',
      offset: [2.2, -0.5, 0],
      direction: [1, 0, 0],
      required: false
    },
    {
      id: 'product_out',
      type: 'liquid',
      label: 'Product Discharge',
      offset: [0, -1.8, 2.0],
      direction: [0, 0, 1],
      required: true
    },
    {
      id: 'vent_gas',
      type: 'gas',
      label: 'Vent/Vacuum',
      offset: [0, 3.5, 0],
      direction: [0, 1, 0],
      required: false
    }
  ];

  // Rotation animation for agitator when selected
  useFrame((state, delta) => {
    if (isSelected && agitatorRef.current) {
      agitatorRef.current.rotation.y += delta * 2; // 2 rad/s rotation speed
    }
  });

  const GRID_SIZE = gridSize || 1.0;

  const snapToGrid = (value: number): number => {
    if (!gridSnap) return value;
    return Math.round(value / GRID_SIZE) * GRID_SIZE;
  };

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

    // Prevent default to avoid text selection
    (event as unknown as { preventDefault?: () => void }).preventDefault?.();
  };



  const handlePortClick = (port: StirredTankReactorPort, event: ThreeEvent<MouseEvent>) => {
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

  const getPortColor = (port: StirredTankReactorPort): string => {
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
      {/* Grid snap indicators */}
      {isDragging && gridSnap && (
        <>
          <mesh position={[0, -2.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[2.0, 2.5, 16]} />
            <meshBasicMaterial color="#ffeb3b" transparent opacity={0.3} />
          </mesh>
          
          <mesh position={[0, 5, 0]}>
            <sphereGeometry args={[0.05]} />
            <meshBasicMaterial color="#ffeb3b" />
          </mesh>
        </>
      )}
      
      {/* Invisible collision box */}
      <mesh
        onPointerDown={handlePointerDown}
        visible={false}
      >
        <boxGeometry args={[5, 8, 5]} />
      </mesh>
      
      {/* Concrete Foundation Pad */}
      <mesh position={[0, -2.15, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[3.0, 3.0, 0.6, 24]} />
        <meshStandardMaterial 
          color="#7F8C8D" 
          metalness={0.1}
          roughness={0.9}
        />
      </mesh>
      
      {/* Foundation Reinforcement Grid */}
      {Array.from({ length: 8 }, (_, i) => (
        <mesh key={i} position={[0, -1.85, 0]} rotation={[0, (i * Math.PI) / 8, 0]} castShadow>
          <boxGeometry args={[5.8, 0.05, 0.05]} />
          <meshStandardMaterial 
            color="#34495E" 
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
      ))}
      
      {/* Foundation Anchor Bolt Ring */}
      <mesh position={[0, -1.8, 0]} castShadow>
        <torusGeometry args={[2.5, 0.1, 8, 20]} />
        <meshStandardMaterial 
          color="#566573" 
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Foundation Anchor Bolts */}
      {Array.from({ length: 16 }, (_, i) => {
        const angle = (i * Math.PI) / 8;
        const x = Math.cos(angle) * 2.5;
        const z = Math.sin(angle) * 2.5;
        return (
          <group key={i} position={[x, -2.0, z]}>
            {/* Anchor Bolt */}
            <mesh castShadow>
              <cylinderGeometry args={[0.04, 0.04, 0.4, 8]} />
              <meshStandardMaterial 
                color="#2C3E50" 
                metalness={0.9}
                roughness={0.2}
              />
            </mesh>
            {/* Anchor Plate */}
            <mesh position={[0, 0.15, 0]} castShadow>
              <cylinderGeometry args={[0.08, 0.08, 0.03, 8]} />
              <meshStandardMaterial 
                color="#34495E" 
                metalness={0.8}
                roughness={0.3}
              />
            </mesh>
            {/* Nut and Washer */}
            <mesh position={[0, 0.22, 0]} castShadow>
              <cylinderGeometry args={[0.05, 0.05, 0.04, 6]} />
              <meshStandardMaterial 
                color="#5D6D7E" 
                metalness={0.9}
                roughness={0.2}
              />
            </mesh>
            {/* Threading Indicator */}
            {Array.from({ length: 8 }, (_, j) => (
              <mesh key={j} position={[0, -0.15 + j * 0.04, 0]} castShadow>
                <torusGeometry args={[0.041, 0.002, 4, 8]} />
                <meshStandardMaterial 
                  color="#1B2631" 
                  metalness={0.8}
                  roughness={0.4}
                />
              </mesh>
            ))}
          </group>
        );
      })}
      
      {/* Reactor Support Structure */}
      {Array.from({ length: 4 }, (_, i) => {
        const angle = (i * Math.PI) / 2;
        const x = Math.cos(angle) * 2.0;
        const z = Math.sin(angle) * 2.0;
        return (
          <group key={i} position={[x, -0.5, z]}>
            {/* Main Support Column (I-Beam Style) */}
            <mesh castShadow>
              <cylinderGeometry args={[0.15, 0.15, 3.2, 12]} />
              <meshStandardMaterial 
                color="#85929E" 
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
            
            {/* I-Beam Flanges */}
            <mesh castShadow>
              <boxGeometry args={[0.25, 3.2, 0.08]} />
              <meshStandardMaterial 
                color="#7B7D7D" 
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
            <mesh castShadow>
              <boxGeometry args={[0.08, 3.2, 0.25]} />
              <meshStandardMaterial 
                color="#7B7D7D" 
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
            
            {/* Cross Bracing to Adjacent Legs */}
            <mesh position={[x * -0.25, -0.8, z * -0.25]} rotation={[0, angle + Math.PI/4, 0]} castShadow>
              <cylinderGeometry args={[0.05, 0.05, 1.4, 8]} />
              <meshStandardMaterial 
                color="#566573" 
                metalness={0.8}
                roughness={0.3}
              />
            </mesh>
            
            {/* Secondary Cross Bracing */}
            <mesh position={[x * -0.25, 0.8, z * -0.25]} rotation={[0, angle + Math.PI/4, 0]} castShadow>
              <cylinderGeometry args={[0.05, 0.05, 1.4, 8]} />
              <meshStandardMaterial 
                color="#566573" 
                metalness={0.8}
                roughness={0.3}
              />
            </mesh>
            
            {/* Base Plate */}
            <mesh position={[0, -1.7, 0]} castShadow>
              <cylinderGeometry args={[0.25, 0.25, 0.08, 12]} />
              <meshStandardMaterial 
                color="#5D6D7E" 
                metalness={0.9}
                roughness={0.2}
              />
            </mesh>
            
            {/* Base Plate Bolts */}
            {Array.from({ length: 4 }, (_, j) => {
              const boltAngle = (j * Math.PI) / 2;
              const boltX = Math.cos(boltAngle) * 0.18;
              const boltZ = Math.sin(boltAngle) * 0.18;
              return (
                <mesh key={j} position={[boltX, -1.74, boltZ]} castShadow>
                  <cylinderGeometry args={[0.015, 0.015, 0.04, 6]} />
                  <meshStandardMaterial 
                    color="#2C3E50" 
                    metalness={0.9}
                    roughness={0.2}
                  />
                </mesh>
              );
            })}
            
            {/* Vessel Connection Bracket */}
            <mesh position={[x * -0.08, 1.0, z * -0.08]} castShadow>
              <boxGeometry args={[0.2, 0.4, 0.12]} />
              <meshStandardMaterial 
                color="#7B7D7D" 
                metalness={0.8}
                roughness={0.3}
              />
            </mesh>
            
            {/* Connection Bolts */}
            {Array.from({ length: 3 }, (_, k) => (
              <mesh key={k} position={[x * -0.02, 0.8 + k * 0.2, z * -0.02]} castShadow>
                <cylinderGeometry args={[0.02, 0.02, 0.08, 6]} />
                <meshStandardMaterial 
                  color="#34495E" 
                  metalness={0.9}
                  roughness={0.2}
                />
              </mesh>
            ))}
          </group>
        );
      })}
      
      {/* Main Reactor Vessel (316L Stainless Steel) */}
      <mesh
        ref={meshRef}
        position={[0, 1.0, 0]}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[2.0, 2.0, 4.0, 32]} />
        <meshStandardMaterial 
          color="#E8EAED" 
          metalness={0.9}
          roughness={0.05}
          envMapIntensity={0.8}
        />
      </mesh>
      
      {/* Vessel Shell Weld Seams */}
      {Array.from({ length: 2 }, (_, i) => (
        <mesh key={i} position={[0, -0.5 + i * 3.0, 0]} castShadow>
          <torusGeometry args={[2.02, 0.015, 8, 32]} />
          <meshStandardMaterial 
            color="#D5DBDB" 
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}
      
      {/* Vessel Top Dished Head (Torispherical) */}
      <mesh position={[0, 3.2, 0]} castShadow receiveShadow>
        <sphereGeometry args={[2.0, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial 
          color="#F8F9FA" 
          metalness={0.9}
          roughness={0.05}
          envMapIntensity={0.8}
        />
      </mesh>
      
      {/* Top Head Weld Seam */}
      <mesh position={[0, 3.0, 0]} castShadow>
        <torusGeometry args={[2.02, 0.02, 8, 32]} />
        <meshStandardMaterial 
          color="#D5DBDB" 
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Vessel Bottom Dished Head (Torispherical) */}
      <mesh position={[0, -1.2, 0]} rotation={[Math.PI, 0, 0]} castShadow receiveShadow>
        <sphereGeometry args={[2.0, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial 
          color="#F8F9FA" 
          metalness={0.9}
          roughness={0.05}
          envMapIntensity={0.8}
        />
      </mesh>
      
      {/* Bottom Head Weld Seam */}
      <mesh position={[0, -1.0, 0]} castShadow>
        <torusGeometry args={[2.02, 0.02, 8, 32]} />
        <meshStandardMaterial 
          color="#D5DBDB" 
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Vessel Nameplate */}
      <mesh position={[0, 2.0, 2.05]} castShadow>
        <boxGeometry args={[0.6, 0.3, 0.02]} />
        <meshStandardMaterial 
          color="#F4D03F" 
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>
      
      {/* Nameplate Text Background */}
      <mesh position={[0, 2.0, 2.06]} castShadow>
        <boxGeometry args={[0.55, 0.25, 0.005]} />
        <meshStandardMaterial 
          color="#1B2631" 
          metalness={0.1}
          roughness={0.9}
        />
      </mesh>
      
      {/* Inner Heating/Cooling Jacket */}
      <mesh position={[0, 1.0, 0]} castShadow>
        <cylinderGeometry args={[2.12, 2.12, 3.6, 32]} />
        <meshStandardMaterial 
          color="#AEB6BF" 
          metalness={0.8}
          roughness={0.15}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Outer Jacket Shell */}
      <mesh position={[0, 1.0, 0]} castShadow>
        <cylinderGeometry args={[2.25, 2.25, 3.8, 32]} />
        <meshStandardMaterial 
          color="#85929E" 
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Jacket Spiral Baffles (Heat Transfer Enhancement) */}
      {Array.from({ length: 12 }, (_, i) => {
        const height = -1.5 + i * 0.3;
        const rotation = i * Math.PI / 6;
        return (
          <mesh key={i} position={[0, height, 0]} rotation={[0, rotation, 0]} castShadow>
            <torusGeometry args={[2.18, 0.03, 6, 16]} />
            <meshStandardMaterial 
              color="#566573" 
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>
        );
      })}
      
      {/* Jacket Support Lugs */}
      {Array.from({ length: 6 }, (_, i) => {
        const angle = (i * Math.PI) / 3;
        const x = Math.cos(angle) * 2.25;
        const z = Math.sin(angle) * 2.25;
        return (
          <group key={i} position={[x, 1.0, z]} rotation={[0, angle, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.15, 0.4, 0.08]} />
              <meshStandardMaterial 
                color="#7B7D7D" 
                metalness={0.8}
                roughness={0.3}
              />
            </mesh>
            {/* Support Bolts */}
            {Array.from({ length: 2 }, (_, j) => (
              <mesh key={j} position={[0, -0.1 + j * 0.2, 0]} castShadow>
                <cylinderGeometry args={[0.015, 0.015, 0.1, 6]} />
                <meshStandardMaterial 
                  color="#34495E" 
                  metalness={0.9}
                  roughness={0.2}
                />
              </mesh>
            ))}
          </group>
        );
      })}
      
      {/* Thermal Insulation (Mineral Wool) */}
      <mesh position={[0, 1.0, 0]} castShadow>
        <cylinderGeometry args={[2.45, 2.45, 4.0, 20]} />
        <meshStandardMaterial 
          color="#F7DC6F" 
          metalness={0.1}
          roughness={0.95}
        />
      </mesh>
      
      {/* Insulation Cladding (Aluminum) */}
      <mesh position={[0, 1.0, 0]} castShadow>
        <cylinderGeometry args={[2.5, 2.5, 4.1, 24]} />
        <meshStandardMaterial 
          color="#D5D8DC" 
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      
      {/* Cladding Bands */}
      {Array.from({ length: 5 }, (_, i) => {
        const height = -1.8 + i * 0.9;
        return (
          <mesh key={i} position={[0, height, 0]} castShadow>
            <torusGeometry args={[2.52, 0.04, 8, 24]} />
            <meshStandardMaterial 
              color="#AEB6BF" 
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
        );
      })}
      
      {/* Vessel Reinforcement Rings */}
      {Array.from({ length: 4 }, (_, i) => {
        const height = -0.8 + i * 1.2;
        return (
          <mesh key={i} position={[0, height, 0]} castShadow>
            <torusGeometry args={[2.05, 0.05, 8, 24]} />
            <meshStandardMaterial 
              color="#A6ACAF" 
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
        );
      })}
      
      {/* Reactor Baffles (Anti-Vortex) */}
      {Array.from({ length: 4 }, (_, i) => {
        const angle = (i * Math.PI) / 2;
        const x = Math.cos(angle) * 1.85;
        const z = Math.sin(angle) * 1.85;
        return (
          <mesh key={i} position={[x, 1.0, z]} rotation={[0, angle, 0]} castShadow>
            <boxGeometry args={[0.1, 3.5, 0.3]} />
            <meshStandardMaterial 
              color="#95A5A6" 
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
        );
      })}
      
      {/* Agitator Shaft */}
      <mesh position={[0, 1.0, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 5.5, 12]} />
        <meshStandardMaterial 
          color="#566573" 
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      
      {/* Multi-Level Agitator Assembly */}
      <group ref={agitatorRef} position={[0, 1.0, 0]}>
        {/* Bottom Impeller - High-Efficiency Pitched Blade Turbine */}
        <group position={[0, -1.2, 0]}>
          {/* Hub with Keyway */}
          <mesh castShadow>
            <cylinderGeometry args={[0.18, 0.18, 0.25, 16]} />
            <meshStandardMaterial 
              color="#17202A" 
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
          
          {/* Keyway Slot */}
          <mesh position={[0.15, 0, 0]} castShadow>
            <boxGeometry args={[0.06, 0.25, 0.02]} />
            <meshStandardMaterial 
              color="#0B1426" 
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>
          
          {/* Pitched Blades with Reinforcement */}
          {Array.from({ length: 6 }, (_, i) => {
            const angle = (i * Math.PI) / 3;
            return (
              <group key={i} rotation={[0, angle, 0]}>
                {/* Main Blade */}
                <mesh position={[0.45, 0, 0]} rotation={[0, 0, Math.PI / 5]} castShadow>
                  <boxGeometry args={[0.7, 0.15, 0.06]} />
                  <meshStandardMaterial 
                    color="#2C3E50" 
                    metalness={0.8}
                    roughness={0.15}
                  />
                </mesh>
                
                {/* Blade Reinforcement Rib */}
                <mesh position={[0.45, 0, 0]} rotation={[0, 0, Math.PI / 5]} castShadow>
                  <boxGeometry args={[0.7, 0.04, 0.08]} />
                  <meshStandardMaterial 
                    color="#34495E" 
                    metalness={0.8}
                    roughness={0.2}
                  />
                </mesh>
                
                {/* Blade Attachment */}
                <mesh position={[0.2, 0, 0]} castShadow>
                  <boxGeometry args={[0.15, 0.2, 0.1]} />
                  <meshStandardMaterial 
                    color="#566573" 
                    metalness={0.8}
                    roughness={0.2}
                  />
                </mesh>
              </group>
            );
          })}
          
          {/* Hub Bolts */}
          {Array.from({ length: 6 }, (_, i) => {
            const angle = (i * Math.PI) / 3;
            const x = Math.cos(angle) * 0.14;
            const z = Math.sin(angle) * 0.14;
            return (
              <mesh key={i} position={[x, 0.1, z]} castShadow>
                <cylinderGeometry args={[0.015, 0.015, 0.05, 6]} />
                <meshStandardMaterial 
                  color="#1B2631" 
                  metalness={0.9}
                  roughness={0.2}
                />
              </mesh>
            );
          })}
        </group>
        
        {/* Middle Impeller - Rushton Turbine */}
        <group position={[0, 0, 0]}>
          {/* Hub */}
          <mesh castShadow>
            <cylinderGeometry args={[0.15, 0.15, 0.18, 16]} />
            <meshStandardMaterial 
              color="#17202A" 
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
          
          {/* Disc */}
          <mesh castShadow>
            <cylinderGeometry args={[0.25, 0.25, 0.02, 20]} />
            <meshStandardMaterial 
              color="#2C3E50" 
              metalness={0.8}
              roughness={0.15}
            />
          </mesh>
          
          {/* Flat Blades */}
          {Array.from({ length: 6 }, (_, i) => {
            const angle = (i * Math.PI) / 3;
            return (
              <group key={i} rotation={[0, angle, 0]}>
                {/* Blade */}
                <mesh position={[0.4, 0, 0]} castShadow>
                  <boxGeometry args={[0.3, 0.18, 0.04]} />
                  <meshStandardMaterial 
                    color="#566573" 
                    metalness={0.8}
                    roughness={0.15}
                  />
                </mesh>
                
                {/* Blade Stiffener */}
                <mesh position={[0.4, 0.08, 0]} castShadow>
                  <boxGeometry args={[0.3, 0.02, 0.06]} />
                  <meshStandardMaterial 
                    color="#7B7D7D" 
                    metalness={0.8}
                    roughness={0.2}
                  />
                </mesh>
              </group>
            );
          })}
        </group>
        
        {/* Top Impeller - Marine Propeller */}
        <group position={[0, 1.2, 0]}>
          {/* Hub */}
          <mesh castShadow>
            <cylinderGeometry args={[0.12, 0.12, 0.15, 16]} />
            <meshStandardMaterial 
              color="#17202A" 
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
          
          {/* Propeller Blades with Curvature */}
          {Array.from({ length: 3 }, (_, i) => {
            const angle = (i * Math.PI * 2) / 3;
            return (
              <group key={i} rotation={[0, angle, 0]}>
                {/* Main Blade Section */}
                <mesh position={[0.3, 0, 0]} rotation={[0, 0, -Math.PI / 10]} castShadow>
                  <boxGeometry args={[0.5, 0.1, 0.025]} />
                  <meshStandardMaterial 
                    color="#85929E" 
                    metalness={0.8}
                    roughness={0.15}
                  />
                </mesh>
                
                {/* Blade Tip */}
                <mesh position={[0.52, 0, 0]} rotation={[0, 0, -Math.PI / 8]} castShadow>
                  <boxGeometry args={[0.06, 0.08, 0.02]} />
                  <meshStandardMaterial 
                    color="#7B7D7D" 
                    metalness={0.8}
                    roughness={0.2}
                  />
                </mesh>
                
                {/* Blade Root */}
                <mesh position={[0.1, 0, 0]} castShadow>
                  <boxGeometry args={[0.08, 0.12, 0.03]} />
                  <meshStandardMaterial 
                    color="#566573" 
                    metalness={0.8}
                    roughness={0.2}
                  />
                </mesh>
              </group>
            );
          })}
          
          {/* Propeller Spinner */}
          <mesh position={[0, 0.08, 0]} castShadow>
            <sphereGeometry args={[0.08, 12, 8]} />
            <meshStandardMaterial 
              color="#34495E" 
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
        </group>
        
        {/* Shaft Coupling */}
        <mesh position={[0, 2.8, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.2, 12]} />
          <meshStandardMaterial 
            color="#2C3E50" 
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        
        {/* Coupling Bolts */}
        {Array.from({ length: 6 }, (_, i) => {
          const angle = (i * Math.PI) / 3;
          const x = Math.cos(angle) * 0.1;
          const z = Math.sin(angle) * 0.1;
          return (
            <mesh key={i} position={[x, 2.8, z]} castShadow>
              <cylinderGeometry args={[0.01, 0.01, 0.03, 6]} />
              <meshStandardMaterial 
                color="#1B2631" 
                metalness={0.9}
                roughness={0.2}
              />
            </mesh>
          );
        })}
      </group>
      
      {/* Industrial Agitator Motor Housing */}
      <mesh position={[0, 4.2, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.8, 20]} />
        <meshStandardMaterial 
          color="#1B2631" 
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      
      {/* Motor End Bells */}
      <mesh position={[0, 3.8, 0]} castShadow>
        <cylinderGeometry args={[0.28, 0.28, 0.12, 16]} />
        <meshStandardMaterial 
          color="#2C3E50" 
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[0, 4.6, 0]} castShadow>
        <cylinderGeometry args={[0.28, 0.28, 0.12, 16]} />
        <meshStandardMaterial 
          color="#2C3E50" 
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Motor Cooling Fins */}
      {Array.from({ length: 16 }, (_, i) => {
        const angle = (i * Math.PI) / 8;
        const x = Math.cos(angle) * 0.37;
        const z = Math.sin(angle) * 0.37;
        return (
          <mesh key={i} position={[x, 4.2, z]} castShadow>
            <boxGeometry args={[0.05, 0.7, 0.02]} />
            <meshStandardMaterial 
              color="#566573" 
              metalness={0.6}
              roughness={0.5}
            />
          </mesh>
        );
      })}
      
      {/* Motor Nameplate */}
      <mesh position={[0, 4.2, 0.37]} castShadow>
        <boxGeometry args={[0.25, 0.15, 0.01]} />
        <meshStandardMaterial 
          color="#F39C12" 
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>
      
      {/* Motor Terminal Box */}
      <mesh position={[0.25, 4.3, 0]} castShadow>
        <boxGeometry args={[0.15, 0.12, 0.1]} />
        <meshStandardMaterial 
          color="#2E4053" 
          metalness={0.3}
          roughness={0.8}
        />
      </mesh>
      
      {/* Conduit Entry */}
      <mesh position={[0.32, 4.3, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.08, 8]} />
        <meshStandardMaterial 
          color="#5D6D7E" 
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Motor Mounting Feet */}
      {Array.from({ length: 4 }, (_, i) => {
        const angle = (i * Math.PI) / 2;
        const x = Math.cos(angle) * 0.3;
        const z = Math.sin(angle) * 0.3;
        return (
          <mesh key={i} position={[x, 3.7, z]} castShadow>
            <boxGeometry args={[0.1, 0.06, 0.06]} />
            <meshStandardMaterial 
              color="#7B7D7D" 
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>
        );
      })}
      
      {/* Variable Frequency Drive (VFD) */}
      <mesh position={[0, 5.0, 0]} castShadow>
        <boxGeometry args={[0.5, 0.4, 0.25]} />
        <meshStandardMaterial 
          color="#2E4053" 
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>
      
      {/* VFD Display Panel */}
      <mesh position={[0, 5.0, 0.13]} castShadow>
        <boxGeometry args={[0.25, 0.15, 0.01]} />
        <meshStandardMaterial 
          color="#17202A" 
          metalness={0.1}
          roughness={0.9}
        />
      </mesh>
      
      {/* VFD Status LEDs */}
      {Array.from({ length: 4 }, (_, i) => (
        <mesh key={i} position={[-0.15 + i * 0.1, 4.9, 0.13]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.01, 8]} />
          <meshStandardMaterial 
            color={i < 2 ? "#27AE60" : "#E74C3C"} 
            metalness={0.3}
            roughness={0.7}
            emissive={i < 2 ? "#1E8449" : "#A93226"}
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
      
      {/* VFD Control Buttons */}
      {Array.from({ length: 3 }, (_, i) => (
        <mesh key={i} position={[-0.1 + i * 0.1, 4.85, 0.13]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.015, 8]} />
          <meshStandardMaterial 
            color="#566573" 
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
      ))}
      
      {/* Manhole Cover */}
      <mesh position={[0, 3.0, 1.5]} rotation={[Math.PI / 3, 0, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.1, 16]} />
        <meshStandardMaterial 
          color="#85929E" 
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Manhole Bolts */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i * Math.PI) / 4;
        const x = Math.cos(angle) * 0.25;
        const y = Math.sin(angle) * 0.25;
        return (
          <mesh key={i} position={[x, 3.0 + y * Math.cos(Math.PI / 3), 1.5 + y * Math.sin(Math.PI / 3)]} 
                rotation={[Math.PI / 3, 0, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.03, 6]} />
            <meshStandardMaterial 
              color="#2C3E50" 
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>
        );
      })}
      
      {/* Temperature Wells (RTD/Thermocouple) */}
      {Array.from({ length: 4 }, (_, i) => {
        const heights = [0.2, 1.0, 1.8, 2.6];
        const angle = (i * Math.PI) / 6;
        const x = Math.cos(angle) * 2.6;
        const z = Math.sin(angle) * 2.6;
        return (
          <group key={i} position={[x, heights[i], z]}>
            {/* Thermowell */}
            <mesh castShadow>
              <cylinderGeometry args={[0.035, 0.035, 0.5, 8]} />
              <meshStandardMaterial 
                color="#E74C3C" 
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
            
            {/* Temperature Transmitter Head */}
            <mesh position={[0, 0.35, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.06, 0.15, 12]} />
              <meshStandardMaterial 
                color="#F39C12" 
                metalness={0.2}
                roughness={0.8}
              />
            </mesh>
            
            {/* Junction Box */}
            <mesh position={[0, 0.5, 0]} castShadow>
              <boxGeometry args={[0.1, 0.08, 0.06]} />
              <meshStandardMaterial 
                color="#2E4053" 
                metalness={0.3}
                roughness={0.8}
              />
            </mesh>
            
            {/* Conduit Connection */}
            <mesh position={[0.05, 0.5, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.015, 0.015, 0.06, 8]} />
              <meshStandardMaterial 
                color="#5D6D7E" 
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
          </group>
        );
      })}
      
      {/* Additional Process Instrumentation */}
      
      {/* Flow Meter (Magnetic) */}
      <group position={[-2.8, 2.0, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.3, 12]} />
          <meshStandardMaterial 
            color="#8E44AD" 
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>
        <mesh position={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[0.15, 0.1, 0.08]} />
          <meshStandardMaterial 
            color="#9B59B6" 
            metalness={0.2}
            roughness={0.8}
          />
        </mesh>
      </group>
      
      {/* Conductivity Probe */}
      <group position={[1.5, 1.2, 1.5]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
          <meshStandardMaterial 
            color="#1ABC9C" 
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
        <mesh position={[0, 0.25, 0]} castShadow>
          <boxGeometry args={[0.08, 0.06, 0.05]} />
          <meshStandardMaterial 
            color="#16A085" 
            metalness={0.2}
            roughness={0.8}
          />
        </mesh>
      </group>
      
      {/* Dissolved Oxygen Probe */}
      <group position={[-1.5, 1.5, 1.5]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.45, 8]} />
          <meshStandardMaterial 
            color="#E67E22" 
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
        <mesh position={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[0.1, 0.08, 0.06]} />
          <meshStandardMaterial 
            color="#D35400" 
            metalness={0.2}
            roughness={0.8}
          />
        </mesh>
      </group>
      
      {/* Pressure Gauges */}
      {Array.from({ length: 2 }, (_, i) => {
        const positions = [[0, 2.8, 2.0], [-1.5, 2.0, 1.5]] as const;
        return (
          <group key={i} position={positions[i]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.12, 0.12, 0.08, 16]} />
              <meshStandardMaterial 
                color="#2F4F4F" 
                metalness={0.6}
                roughness={0.4}
              />
            </mesh>
            <mesh position={[0, 0, 0.05]} castShadow>
              <cylinderGeometry args={[0.1, 0.1, 0.02, 16]} />
              <meshStandardMaterial 
                color="#F8F9FA" 
                metalness={0.1}
                roughness={0.9}
              />
            </mesh>
          </group>
        );
      })}
      
      {/* pH Probe */}
      <group position={[1.2, 1.8, 1.2]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.5, 8]} />
          <meshStandardMaterial 
            color="#9B59B6" 
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
        <mesh position={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[0.12, 0.08, 0.06]} />
          <meshStandardMaterial 
            color="#8E44AD" 
            metalness={0.2}
            roughness={0.8}
          />
        </mesh>
      </group>
      
      {/* Level Indicator */}
      <group position={[2.2, 1.0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.08, 2.0, 0.06]} />
          <meshStandardMaterial 
            color="#3498DB" 
            metalness={0.1}
            roughness={0.9}
            transparent
            opacity={0.8}
          />
        </mesh>
        <mesh position={[0, 0.3, 0]} castShadow>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial 
            color="#E74C3C" 
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        <mesh castShadow>
          <boxGeometry args={[0.1, 2.05, 0.02]} />
          <meshStandardMaterial 
            color="#2F4F4F" 
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>
      </group>
      
      {/* Safety Relief Valve */}
      <group position={[0.8, 3.2, 0.8]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.3, 12]} />
          <meshStandardMaterial 
            color="#E74C3C" 
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        <mesh position={[0, 0.2, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.1, 12]} />
          <meshStandardMaterial 
            color="#C0392B" 
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
      </group>
      
      {/* Mechanical Seal Assembly */}
      <group position={[0, 3.4, 0]}>
        {/* Seal Housing */}
        <mesh castShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.25, 16]} />
          <meshStandardMaterial 
            color="#566573" 
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        
        {/* Seal Gland */}
        <mesh position={[0, 0.15, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.18, 0.08, 16]} />
          <meshStandardMaterial 
            color="#7B7D7D" 
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        
        {/* Seal Flush Connections */}
        {Array.from({ length: 2 }, (_, i) => {
          const angle = (i * Math.PI);
          const x = Math.cos(angle) * 0.15;
          const z = Math.sin(angle) * 0.15;
          return (
            <mesh key={i} position={[x, 0, z]} rotation={[0, angle, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.02, 0.02, 0.08, 8]} />
              <meshStandardMaterial 
                color="#85929E" 
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
          );
        })}
        
        {/* Seal Bolts */}
        {Array.from({ length: 8 }, (_, i) => {
          const angle = (i * Math.PI) / 4;
          const x = Math.cos(angle) * 0.16;
          const z = Math.sin(angle) * 0.16;
          return (
            <mesh key={i} position={[x, -0.1, z]} castShadow>
              <cylinderGeometry args={[0.01, 0.01, 0.05, 6]} />
              <meshStandardMaterial 
                color="#2C3E50" 
                metalness={0.9}
                roughness={0.2}
              />
            </mesh>
          );
        })}
      </group>
      
      {/* Access Platform */}
      <group position={[3.0, 1.5, 0]}>
        {/* Platform Deck */}
        <mesh castShadow>
          <boxGeometry args={[1.0, 0.05, 1.5]} />
          <meshStandardMaterial 
            color="#7B7D7D" 
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
        
        {/* Platform Grating */}
        {Array.from({ length: 8 }, (_, i) => (
          <mesh key={i} position={[-0.4 + i * 0.1, 0.03, 0]} castShadow>
            <boxGeometry args={[0.02, 0.02, 1.5]} />
            <meshStandardMaterial 
              color="#566573" 
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>
        ))}
        
        {/* Handrail Posts */}
        {Array.from({ length: 3 }, (_, i) => (
          <mesh key={i} position={[-0.4 + i * 0.4, 0.5, 0.7]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 1.0, 8]} />
            <meshStandardMaterial 
              color="#85929E" 
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
        ))}
        
        {/* Handrail */}
        <mesh position={[0, 0.9, 0.7]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 1.0, 8]} />
          <meshStandardMaterial 
            color="#85929E" 
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </group>
      
      {/* Ladder Access */}
      <group position={[2.6, 0, 0]}>
        {/* Ladder Rails */}
        {Array.from({ length: 2 }, (_, i) => (
          <mesh key={i} position={[0, 2.0, -0.2 + i * 0.4]} castShadow>
            <cylinderGeometry args={[0.025, 0.025, 4.0, 8]} />
            <meshStandardMaterial 
              color="#85929E" 
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
        ))}
        
        {/* Ladder Rungs */}
        {Array.from({ length: 12 }, (_, i) => (
          <mesh key={i} position={[0, 0.2 + i * 0.3, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
            <meshStandardMaterial 
              color="#7B7D7D" 
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>
        ))}
        
        {/* Ladder Safety Cage */}
        <mesh position={[0, 2.0, 0]} castShadow>
          <cylinderGeometry args={[0.4, 0.4, 4.0, 12]} />
          <meshStandardMaterial 
            color="#566573" 
            metalness={0.8}
            roughness={0.3}
            wireframe={true}
            transparent
            opacity={0.3}
          />
        </mesh>
      </group>
      
      {/* Connection Ports */}
      {connectionPorts.map((port) => {
        const isHovered = hoveredPort === port.id;
        const scale = isHovered ? 1.2 : 1;
        
        return (
          <group key={port.id} position={port.offset}>
            {/* Port Nozzle */}
            <mesh
              scale={[scale, scale, scale]}
              onClick={(e) => handlePortClick(port, e)}
              onPointerEnter={() => handlePortHover(port.id)}
              onPointerLeave={handlePortLeave}
              castShadow
            >
              <cylinderGeometry args={[0.12, 0.12, 0.4, 12]} />
              <meshStandardMaterial 
                color={getPortColor(port)} 
                emissive={isHovered ? getPortColor(port) : '#000000'}
                emissiveIntensity={isHovered ? 0.3 : 0}
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
            
            {/* ANSI Flange */}
            <mesh
              scale={[scale, scale, scale]}
              onClick={(e) => handlePortClick(port, e)}
              onPointerEnter={() => handlePortHover(port.id)}
              onPointerLeave={handlePortLeave}
              castShadow
            >
              <cylinderGeometry args={[0.22, 0.22, 0.08, 16]} />
              <meshStandardMaterial 
                color="#85929E" 
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
            
            {/* Flange Bolts */}
            {Array.from({ length: 8 }, (_, i) => {
              const angle = (i * Math.PI) / 4;
              const x = Math.cos(angle) * 0.18;
              const z = Math.sin(angle) * 0.18;
              return (
                <mesh key={i} position={[x, 0, z]} scale={[scale, scale, scale]} castShadow>
                  <cylinderGeometry args={[0.015, 0.015, 0.1, 6]} />
                  <meshStandardMaterial 
                    color="#2C3E50" 
                    metalness={0.9}
                    roughness={0.2}
                  />
                </mesh>
              );
            })}
            
            {/* Flange Face Gasket */}
            <mesh scale={[scale, scale, scale]} castShadow>
              <torusGeometry args={[0.15, 0.01, 8, 16]} />
              <meshStandardMaterial 
                color="#7B7D7D" 
                metalness={0.3}
                roughness={0.8}
              />
            </mesh>
            
            {/* Port Type Indicator */}
            <mesh position={[0, 0.35, 0]} scale={[scale, scale, scale]}>
              {port.type === 'electric' && <octahedronGeometry args={[0.06]} />}
              {port.type === 'liquid' && <sphereGeometry args={[0.06, 8, 8]} />}
              {port.type === 'gas' && <coneGeometry args={[0.06, 0.1, 6]} />}
              <meshStandardMaterial 
                color={getPortColor(port)}
                emissive={getPortColor(port)}
                emissiveIntensity={0.5}
                metalness={0.7}
                roughness={0.3}
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
              <coneGeometry args={[0.04, 0.15, 4]} />
              <meshBasicMaterial color={getPortColor(port)} transparent opacity={0.7} />
            </mesh>
            
            {/* Port Label (when hovered) */}
            {isHovered && (
              <mesh position={[0, 0.6, 0]}>
                <sphereGeometry args={[0.025]} />
                <meshBasicMaterial color="#ffeb3b" />
              </mesh>
            )}
          </group>
        );
      })}
      
      {/* Selection indicator */}
      {isSelected && isDraggable && (
        <>
          <mesh position={[0, 5.5, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.3, 6]} />
            <meshStandardMaterial color="#ffeb3b" emissive="#ffeb3b" emissiveIntensity={0.3} />
          </mesh>
          
          <mesh position={[0, -2.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[2.2, 2.7, 16]} />
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
              <ringGeometry args={[0.3, 0.4, 16]} />
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

// Export with connection port definitions
StirredTankReactor.connectionPorts = [
  {
    id: 'electric_in',
    type: 'electric',
    label: 'Agitator Motor Power',
    offset: [0, 4.0, -2.2],
    direction: [0, 0, -1],
    required: true
  },
  {
    id: 'reactant_a_in',
    type: 'liquid',
    label: 'Reactant A Feed',
    offset: [-1.8, 2.0, 0],
    direction: [-1, 0, 0],
    required: true
  },
  {
    id: 'reactant_b_in',
    type: 'liquid',
    label: 'Reactant B Feed',
    offset: [1.8, 2.0, 0],
    direction: [1, 0, 0],
    required: true
  },
  {
    id: 'catalyst_in',
    type: 'liquid',
    label: 'Catalyst Feed',
    offset: [0, 3.0, 1.8],
    direction: [0, 0, 1],
    required: false
  },
  {
    id: 'steam_in',
    type: 'gas',
    label: 'Heating Steam',
    offset: [-2.2, 1.0, 0],
    direction: [-1, 0, 0],
    required: false
  },
  {
    id: 'cooling_water_in',
    type: 'liquid',
    label: 'Cooling Water In',
    offset: [-2.2, -0.5, 0],
    direction: [-1, 0, 0],
    required: false
  },
  {
    id: 'cooling_water_out',
    type: 'liquid',
    label: 'Cooling Water Out',
    offset: [2.2, -0.5, 0],
    direction: [1, 0, 0],
    required: false
  },
  {
    id: 'product_out',
    type: 'liquid',
    label: 'Product Discharge',
    offset: [0, -1.8, 2.0],
    direction: [0, 0, 1],
    required: true
  },
  {
    id: 'vent_gas',
    type: 'gas',
    label: 'Vent/Vacuum',
    offset: [0, 3.5, 0],
    direction: [0, 1, 0],
    required: false
  }
];

export default StirredTankReactor; 