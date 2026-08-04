import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const MixerAgitator = ({ position, onClick, onDrag, isSelected, isDraggable, gridSnap, gridSize, onPortClick }) => {
  const meshRef = useRef();
  const groupRef = useRef();
  const agitatorRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [hoveredPort, setHoveredPort] = useState(null);
  const [, setDragStartPos] = useState(null);
  const { camera, gl } = useThree();

  // Define connection ports for the mixer/agitator
  const connectionPorts = [
    {
      id: 'electric_in',
      type: 'electric',
      label: 'Motor Power Input',
      offset: [0, 2.5, -1.8],
      direction: [0, 0, -1],
      required: true
    },
    {
      id: 'liquid_in_1',
      type: 'liquid',
      label: 'Liquid Input 1',
      offset: [-1.8, 1.0, 0],
      direction: [-1, 0, 0],
      required: true
    },
    {
      id: 'liquid_in_2',
      type: 'liquid',
      label: 'Liquid Input 2',
      offset: [1.8, 1.0, 0],
      direction: [1, 0, 0],
      required: false
    },
    {
      id: 'liquid_out',
      type: 'liquid',
      label: 'Mixed Output',
      offset: [0, -1.8, 1.8],
      direction: [0, 0, 1],
      required: false
    },
    {
      id: 'drain_out',
      type: 'liquid',
      label: 'Drain Output',
      offset: [0, -2.2, 0],
      direction: [0, -1, 0],
      required: false
    },
    {
      id: 'gas_vent',
      type: 'gas',
      label: 'Gas Vent',
      offset: [0, 2.8, 0],
      direction: [0, 1, 0],
      required: false
    },
    {
      id: 'cleaning_in',
      type: 'liquid',
      label: 'Cleaning Input',
      offset: [0, 2.0, 1.8],
      direction: [0, 0, 1],
      required: false
    }
  ];

  // Grid snap size (CAD-like behavior)
  const GRID_SIZE = gridSize || 1.0;

  const snapToGrid = (value) => {
    if (!gridSnap) return value;
    return Math.round(value / GRID_SIZE) * GRID_SIZE;
  };

  useFrame(() => {
    if (meshRef.current) {
      if (isSelected) {
        meshRef.current.material.emissive.setHex(0x444444);
      } else if (hovered && isDraggable) {
        meshRef.current.material.emissive.setHex(0x222222);
      } else {
        meshRef.current.material.emissive.setHex(0x000000);
      }
    }
    
    // Rotate agitator blades when selected (simulating operation)
    if (agitatorRef.current && isSelected) {
      agitatorRef.current.rotation.y += 0.05;
    }
    
    // Scale slightly when dragging for better visual feedback
    if (groupRef.current) {
      const targetScale = isDragging ? 1.05 : 1;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15);
    }
  });

  const handlePointerDown = (event) => {
    if (!isDraggable) {
      onClick?.(event);
      return;
    }
    
    event.stopPropagation();
    let hasMovedMouse = false;
    setDragStartPos(position);
    gl.domElement.style.cursor = 'grabbing';
    
    const handlePointerMove = (moveEvent) => {
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
        const newPosition = [snappedX, position[1], snappedZ];
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
    event.preventDefault?.();
  };

  const handlePortClick = (port, event) => {
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

  const handlePortHover = (portId) => {
    setHoveredPort(portId);
    gl.domElement.style.cursor = 'pointer';
  };

  const handlePortLeave = () => {
    setHoveredPort(null);
    gl.domElement.style.cursor = isDraggable ? 'grab' : 'auto';
  };

  const getPortColor = (port) => {
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
          <mesh position={[0, -2.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.2, 1.6, 16]} />
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
        <boxGeometry args={[4, 6, 4]} />
      </mesh>
      
      {/* Main Mixing Tank */}
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[1.6, 1.6, 3.5, 24]} />
        <meshStandardMaterial 
          color="#F5F5F5" 
          metalness={0.6}
          roughness={0.3}
          envMapIntensity={0.4}
        />
      </mesh>
      
      {/* Tank Shell Reinforcement */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[1.62, 1.62, 0.1, 24]} />
        <meshStandardMaterial 
          color="#D3D3D3" 
          metalness={0.8}
          roughness={0.4}
        />
      </mesh>
      
      {/* Tank Bottom (dished head) */}
      <mesh position={[0, -1.85, 0]} castShadow>
        <sphereGeometry args={[1.6, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial 
          color="#E8E8E8" 
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      
      {/* Tank Top Lid (removable) */}
      <mesh position={[0, 1.9, 0]} castShadow>
        <cylinderGeometry args={[1.7, 1.7, 0.15, 24]} />
        <meshStandardMaterial 
          color="#C0C0C0" 
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Lid Bolt Pattern */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i * Math.PI * 2) / 12;
        const x = Math.cos(angle) * 1.55;
        const z = Math.sin(angle) * 1.55;
        return (
          <mesh key={i} position={[x, 1.98, z]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.08, 8]} />
            <meshStandardMaterial 
              color="#696969" 
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>
        );
      })}
      
      {/* Motor Housing */}
      <mesh position={[0, 3.2, 0]} castShadow>
        <cylinderGeometry args={[0.6, 0.6, 1.0, 16]} />
        <meshStandardMaterial 
          color="#2C2C2C" 
          metalness={0.3}
          roughness={0.8}
        />
      </mesh>
      
      {/* Motor End Caps */}
      <mesh position={[0, 3.75, 0]} castShadow>
        <cylinderGeometry args={[0.62, 0.62, 0.1, 16]} />
        <meshStandardMaterial 
          color="#1C1C1C" 
          metalness={0.5}
          roughness={0.6}
        />
      </mesh>
      <mesh position={[0, 2.65, 0]} castShadow>
        <cylinderGeometry args={[0.62, 0.62, 0.1, 16]} />
        <meshStandardMaterial 
          color="#1C1C1C" 
          metalness={0.5}
          roughness={0.6}
        />
      </mesh>
      
      {/* Motor Cooling Fins */}
      {Array.from({ length: 16 }, (_, i) => {
        const angle = (i * Math.PI) / 8;
        const x = Math.cos(angle) * 0.65;
        const z = Math.sin(angle) * 0.65;
        return (
          <mesh key={i} position={[x, 3.2, z]} castShadow>
            <boxGeometry args={[0.08, 0.8, 0.04]} />
            <meshStandardMaterial 
              color="#404040" 
              metalness={0.4}
              roughness={0.7}
            />
          </mesh>
        );
      })}
      
      {/* Motor Name Plate */}
      <mesh position={[0.62, 3.2, 0]} castShadow>
        <boxGeometry args={[0.02, 0.3, 0.15]} />
        <meshStandardMaterial 
          color="#F0F0F0" 
          metalness={0.1}
          roughness={0.9}
        />
      </mesh>
      
      {/* Motor Terminal Box */}
      <mesh position={[0, 3.2, 0.7]} castShadow>
        <boxGeometry args={[0.25, 0.2, 0.15]} />
        <meshStandardMaterial 
          color="#2F2F2F" 
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>
      
      {/* Drive Shaft */}
      <mesh position={[0, 1.0, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 4.5, 12]} />
        <meshStandardMaterial 
          color="#4A4A4A" 
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      
      {/* Shaft Coupling */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.2, 12]} />
        <meshStandardMaterial 
          color="#2F2F2F" 
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>
      
      {/* Shaft Seal/Stuffing Box */}
      <mesh position={[0, 1.8, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.3, 12]} />
        <meshStandardMaterial 
          color="#696969" 
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>
      
      {/* Agitator Assembly */}
      <group ref={agitatorRef} position={[0, -0.5, 0]}>
        {/* Central Hub (Stronger Construction) */}
        <mesh castShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.25, 12]} />
          <meshStandardMaterial 
            color="#2E7D32" 
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
        
        {/* Hub Reinforcement Ribs */}
        {Array.from({ length: 4 }, (_, i) => {
          const angle = (i * Math.PI) / 2;
          const x = Math.cos(angle) * 0.08;
          const z = Math.sin(angle) * 0.08;
          return (
            <mesh key={i} position={[x, 0, z]} rotation={[0, angle, 0]} castShadow>
              <boxGeometry args={[0.2, 0.3, 0.04]} />
              <meshStandardMaterial 
                color="#1B5E20" 
                metalness={0.7}
                roughness={0.4}
              />
            </mesh>
          );
        })}
        
        {/* Upper Mixing Blades (Pitched Turbine) */}
        {Array.from({ length: 6 }, (_, i) => {
          const angle = (i * Math.PI) / 3;
          const x = Math.cos(angle) * 0.9;
          const z = Math.sin(angle) * 0.9;
          return (
            <mesh 
              key={i} 
              position={[x, 0.15, z]} 
              rotation={[0, angle + Math.PI / 6, Math.PI / 8]}
              castShadow
            >
              <boxGeometry args={[0.8, 0.04, 0.2]} />
              <meshStandardMaterial 
                color="#388E3C" 
                metalness={0.7}
                roughness={0.2}
              />
            </mesh>
          );
        })}
        
        {/* Lower Blade Set (Radial Flow Impeller) */}
        {Array.from({ length: 6 }, (_, i) => {
          const angle = (i * Math.PI) / 3 + Math.PI / 6;
          const x = Math.cos(angle) * 0.7;
          const z = Math.sin(angle) * 0.7;
          return (
            <mesh 
              key={i + 6} 
              position={[x, -0.15, z]} 
              rotation={[0, angle, -Math.PI / 12]}
              castShadow
            >
              <boxGeometry args={[0.6, 0.04, 0.15]} />
              <meshStandardMaterial 
                color="#4CAF50" 
                metalness={0.7}
                roughness={0.2}
              />
            </mesh>
          );
        })}
        
        {/* Bottom Blade Set (Axial Flow) */}
        {Array.from({ length: 4 }, (_, i) => {
          const angle = (i * Math.PI) / 2;
          const x = Math.cos(angle) * 0.5;
          const z = Math.sin(angle) * 0.5;
          return (
            <mesh 
              key={i + 12} 
              position={[x, -0.45, z]} 
              rotation={[0, angle + Math.PI / 4, -Math.PI / 6]}
              castShadow
            >
              <boxGeometry args={[0.4, 0.03, 0.12]} />
              <meshStandardMaterial 
                color="#66BB6A" 
                metalness={0.7}
                roughness={0.2}
              />
            </mesh>
          );
        })}
        
        {/* Blade Reinforcement Brackets */}
        {Array.from({ length: 6 }, (_, i) => {
          const angle = (i * Math.PI) / 3;
          const x = Math.cos(angle) * 0.4;
          const z = Math.sin(angle) * 0.4;
          return (
            <mesh key={i} position={[x, 0, z]} rotation={[0, angle, 0]} castShadow>
              <boxGeometry args={[0.08, 0.06, 0.06]} />
              <meshStandardMaterial 
                color="#2E7D32" 
                metalness={0.8}
                roughness={0.3}
              />
            </mesh>
          );
        })}
      </group>
      
      {/* Tank Support Legs (Heavy Duty) */}
      {Array.from({ length: 3 }, (_, i) => {
        const angle = (i * Math.PI * 2) / 3;
        const x = Math.cos(angle) * 1.8;
        const z = Math.sin(angle) * 1.8;
        return (
          <group key={i}>
            {/* Main Support Leg */}
            <mesh position={[x, -1.2, z]} castShadow>
              <cylinderGeometry args={[0.12, 0.12, 2.5, 12]} />
              <meshStandardMaterial 
                color="#5D4037" 
                metalness={0.6}
                roughness={0.5}
              />
            </mesh>
            {/* Base Plate */}
            <mesh position={[x, -2.6, z]} castShadow>
              <cylinderGeometry args={[0.3, 0.3, 0.1, 12]} />
              <meshStandardMaterial 
                color="#3E2723" 
                metalness={0.8}
                roughness={0.3}
              />
            </mesh>
            {/* Anchor Bolts */}
            {Array.from({ length: 4 }, (_, j) => {
              const boltAngle = (j * Math.PI) / 2;
              const boltX = x + Math.cos(boltAngle) * 0.2;
              const boltZ = z + Math.sin(boltAngle) * 0.2;
              return (
                <mesh key={j} position={[boltX, -2.7, boltZ]} castShadow>
                  <cylinderGeometry args={[0.02, 0.02, 0.15, 8]} />
                  <meshStandardMaterial 
                    color="#424242" 
                    metalness={0.9}
                    roughness={0.2}
                  />
                </mesh>
              );
            })}
            {/* Tank Attachment Clamp */}
            <mesh position={[x * 0.9, 0.5, z * 0.9]} castShadow>
              <boxGeometry args={[0.15, 0.3, 0.1]} />
              <meshStandardMaterial 
                color="#6D4C41" 
                metalness={0.7}
                roughness={0.4}
              />
            </mesh>
          </group>
        );
      })}
      
      {/* Support Braces (Cross Bracing) */}
      {Array.from({ length: 6 }, (_, i) => {
        const level = Math.floor(i / 3);
        const angle = ((i % 3) * Math.PI * 2) / 3;
        const height = -1.8 + level * 1.0;
        const x1 = Math.cos(angle) * 1.8;
        const z1 = Math.sin(angle) * 1.8;
        const angle2 = (((i % 3) + 1) * Math.PI * 2) / 3;
        const x2 = Math.cos(angle2) * 1.8;
        const z2 = Math.sin(angle2) * 1.8;
        const midX = (x1 + x2) / 2;
        const midZ = (z1 + z2) / 2;
        const length = Math.sqrt((x2 - x1) ** 2 + (z2 - z1) ** 2);
        return (
          <mesh 
            key={i} 
            position={[midX, height, midZ]} 
            rotation={[0, angle + Math.PI / 3, 0]}
            castShadow
          >
            <cylinderGeometry args={[0.04, 0.04, length, 8]} />
            <meshStandardMaterial 
              color="#795548" 
              metalness={0.6}
              roughness={0.5}
            />
          </mesh>
        );
      })}
      
      {/* Tank Support Ring */}
      <mesh position={[0, -0.2, 0]} castShadow>
        <torusGeometry args={[1.7, 0.08, 8, 16]} />
        <meshStandardMaterial 
          color="#8D6E63" 
          metalness={0.7}
          roughness={0.4}
        />
      </mesh>
      
      {/* Level Indicators (Magnetic Level Gauges) */}
      {Array.from({ length: 2 }, (_, i) => {
        const height = -0.5 + i * 1.5;
        return (
          <group key={i} position={[1.7, height, 0]}>
            {/* Gauge Chamber */}
            <mesh castShadow>
              <boxGeometry args={[0.1, 1.0, 0.06]} />
              <meshStandardMaterial 
                color="#4CAF50" 
                metalness={0.1}
                roughness={0.9}
                transparent
                opacity={0.8}
              />
            </mesh>
            {/* Level Float Indicator */}
            <mesh position={[0, 0.2, 0]} castShadow>
              <sphereGeometry args={[0.03, 8, 8]} />
              <meshStandardMaterial 
                color="#FF5722" 
                metalness={0.8}
                roughness={0.2}
                emissive="#441100"
                emissiveIntensity={0.1}
              />
            </mesh>
            {/* Gauge Housing */}
            <mesh castShadow>
              <boxGeometry args={[0.12, 1.05, 0.02]} />
              <meshStandardMaterial 
                color="#2E7D32" 
                metalness={0.7}
                roughness={0.4}
              />
            </mesh>
            {/* Process Connections */}
            <mesh position={[0, 0.5, 0]} castShadow>
              <cylinderGeometry args={[0.04, 0.04, 0.03, 8]} />
              <meshStandardMaterial 
                color="#616161" 
                metalness={0.8}
                roughness={0.3}
              />
            </mesh>
            <mesh position={[0, -0.5, 0]} castShadow>
              <cylinderGeometry args={[0.04, 0.04, 0.03, 8]} />
              <meshStandardMaterial 
                color="#616161" 
                metalness={0.8}
                roughness={0.3}
              />
            </mesh>
          </group>
        );
      })}
      
      {/* Temperature Sensor (RTD Well) */}
      <group position={[0, 0.5, 1.7]}>
        {/* Temperature Well */}
        <mesh castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.5, 8]} />
          <meshStandardMaterial 
            color="#C62828" 
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
        {/* Well Flange */}
        <mesh position={[0, -0.2, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.04, 8]} />
          <meshStandardMaterial 
            color="#B71C1C" 
            metalness={0.7}
            roughness={0.4}
          />
        </mesh>
        {/* Transmitter Head */}
        <mesh position={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[0.1, 0.15, 0.06]} />
          <meshStandardMaterial 
            color="#FF5722" 
            metalness={0.1}
            roughness={0.8}
          />
        </mesh>
        {/* Signal Cable */}
        <mesh position={[0.1, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.01, 0.01, 0.2, 6]} />
          <meshStandardMaterial 
            color="#424242" 
            metalness={0.1}
            roughness={0.9}
          />
        </mesh>
      </group>
      
      {/* Pressure Relief Valve */}
      <group position={[0, 2.5, 0]}>
        {/* Valve Body */}
        <mesh castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.2, 8]} />
          <meshStandardMaterial 
            color="#FF9800" 
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
        {/* Spring Housing */}
        <mesh position={[0, 0.15, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.2, 8]} />
          <meshStandardMaterial 
            color="#F57C00" 
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>
        {/* Adjustment Cap */}
        <mesh position={[0, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.1, 6]} />
          <meshStandardMaterial 
            color="#E65100" 
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        {/* Discharge Pipe */}
        <mesh position={[0.12, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.2, 8]} />
          <meshStandardMaterial 
            color="#FFAB40" 
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
      </group>
      
      {/* Variable Frequency Drive (VFD) */}
      <group position={[0, 3.2, -0.8]}>
        {/* VFD Enclosure */}
        <mesh castShadow>
          <boxGeometry args={[0.4, 0.6, 0.2]} />
          <meshStandardMaterial 
            color="#263238" 
            metalness={0.2}
            roughness={0.8}
          />
        </mesh>
        {/* Display Panel */}
        <mesh position={[0, 0.1, 0.11]} castShadow>
          <boxGeometry args={[0.25, 0.15, 0.02]} />
          <meshStandardMaterial 
            color="#000000" 
            metalness={0.1}
            roughness={0.9}
          />
        </mesh>
        {/* Control Buttons */}
        {Array.from({ length: 4 }, (_, i) => (
          <mesh key={i} position={[-0.1 + i * 0.07, -0.15, 0.11]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.02, 8]} />
            <meshStandardMaterial 
              color={i === 0 ? "#4CAF50" : i === 1 ? "#F44336" : "#2196F3"} 
              metalness={0.3}
              roughness={0.7}
            />
          </mesh>
        ))}
        {/* Cooling Vents */}
        {Array.from({ length: 8 }, (_, i) => (
          <mesh key={i} position={[-0.15 + i * 0.04, -0.25, 0.11]} castShadow>
            <boxGeometry args={[0.02, 0.08, 0.01]} />
            <meshStandardMaterial 
              color="#424242" 
              metalness={0.1}
              roughness={0.9}
            />
          </mesh>
        ))}
        {/* Cable Glands */}
        <mesh position={[0, -0.3, -0.08]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.08, 8]} />
          <meshStandardMaterial 
            color="#757575" 
            metalness={0.8}
            roughness={0.3}
          />
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
              <cylinderGeometry args={[0.25, 0.25, 0.06, 8]} />
              <meshLambertMaterial color="#666666" />
            </mesh>
            
            {/* Port Type Indicator */}
            <mesh position={[0, 0.3, 0]} scale={[scale, scale, scale]}>
              {port.type === 'electric' && <octahedronGeometry args={[0.08]} />}
              {port.type === 'liquid' && <sphereGeometry args={[0.08, 8, 8]} />}
              {port.type === 'gas' && <coneGeometry args={[0.08, 0.12, 6]} />}
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
          <mesh position={[0, 4.2, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.3, 6]} />
            <meshLambertMaterial color="#ffeb3b" emissive="#ffeb3b" emissiveIntensity={0.3} />
          </mesh>
          
          {/* Grid position indicator */}
          <mesh position={[0, -2.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.4, 1.8, 16]} />
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
MixerAgitator.connectionPorts = [
  {
    id: 'electric_in',
    type: 'electric',
    label: 'Motor Power Input',
    offset: [0, 2.5, -1.8],
    direction: [0, 0, -1],
    required: true
  },
  {
    id: 'liquid_in_1',
    type: 'liquid',
    label: 'Liquid Input 1',
    offset: [-1.8, 1.0, 0],
    direction: [-1, 0, 0],
    required: true
  },
  {
    id: 'liquid_in_2',
    type: 'liquid',
    label: 'Liquid Input 2',
    offset: [1.8, 1.0, 0],
    direction: [1, 0, 0],
    required: false
  },
  {
    id: 'liquid_out',
    type: 'liquid',
    label: 'Mixed Output',
    offset: [0, -1.8, 1.8],
    direction: [0, 0, 1],
    required: false
  },
  {
    id: 'drain_out',
    type: 'liquid',
    label: 'Drain Output',
    offset: [0, -2.2, 0],
    direction: [0, -1, 0],
    required: false
  },
  {
    id: 'gas_vent',
    type: 'gas',
    label: 'Gas Vent',
    offset: [0, 2.8, 0],
    direction: [0, 1, 0],
    required: false
  },
  {
    id: 'cleaning_in',
    type: 'liquid',
    label: 'Cleaning Input',
    offset: [0, 2.0, 1.8],
    direction: [0, 0, 1],
    required: false
  }
];

export default MixerAgitator; 