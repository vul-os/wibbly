import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const DistillationColumn = ({ position, onClick, onDrag, isSelected, isDraggable, gridSnap, gridSize, onPortClick }) => {
  const meshRef = useRef();
  const groupRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [hoveredPort, setHoveredPort] = useState(null);
  const [, setDragStartPos] = useState(null);
  const { camera, gl } = useThree();

  // Define connection ports for the distillation column
  const connectionPorts = [
    {
      id: 'electric_in',
      type: 'electric',
      label: 'Power Input',
      offset: [0, -3.5, -1.5],
      direction: [0, 0, -1],
      required: true
    },
    {
      id: 'feed_in',
      type: 'liquid',
      label: 'Feed Input',
      offset: [-1.8, 1.0, 0],
      direction: [-1, 0, 0],
      required: true
    },
    {
      id: 'distillate_out',
      type: 'liquid',
      label: 'Distillate Output',
      offset: [1.8, 4.5, 0],
      direction: [1, 0, 0],
      required: false
    },
    {
      id: 'bottoms_out',
      type: 'liquid',
      label: 'Bottoms Output',
      offset: [1.8, -3.5, 0],
      direction: [1, 0, 0],
      required: false
    },
    {
      id: 'reflux_in',
      type: 'liquid',
      label: 'Reflux Input',
      offset: [-1.8, 4.0, 0],
      direction: [-1, 0, 0],
      required: false
    },
    {
      id: 'steam_in',
      type: 'gas',
      label: 'Steam Input',
      offset: [0, -4.0, 1.5],
      direction: [0, 0, 1],
      required: true
    },
    {
      id: 'cooling_water_in',
      type: 'liquid',
      label: 'Cooling Water In',
      offset: [-1.5, 5.0, 0],
      direction: [-1, 0, 0],
      required: false
    },
    {
      id: 'cooling_water_out',
      type: 'liquid',
      label: 'Cooling Water Out',
      offset: [1.5, 5.5, 0],
      direction: [1, 0, 0],
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
          <mesh position={[0, -4.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.5, 2.0, 16]} />
            <meshBasicMaterial color="#ffeb3b" transparent opacity={0.3} />
          </mesh>
          
          {/* Show coordinate text overlay */}
          <mesh position={[0, 6, 0]}>
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
        <boxGeometry args={[4, 10, 4]} />
      </mesh>
      
      {/* Main Column Body */}
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[1.4, 1.4, 8, 24]} />
        <meshStandardMaterial 
          color="#E8E8E8" 
          metalness={0.7}
          roughness={0.2}
          envMapIntensity={0.5}
        />
      </mesh>
      
      {/* Column Base Flange */}
      <mesh position={[0, -4.2, 0]} castShadow>
        <cylinderGeometry args={[1.6, 1.6, 0.3, 24]} />
        <meshStandardMaterial 
          color="#B0B0B0" 
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>
      
      {/* Column Top Flange */}
      <mesh position={[0, 4.2, 0]} castShadow>
        <cylinderGeometry args={[1.6, 1.6, 0.3, 24]} />
        <meshStandardMaterial 
          color="#B0B0B0" 
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>
      
      {/* Column Shell Reinforcement Rings */}
      {Array.from({ length: 3 }, (_, i) => (
        <mesh key={i} position={[0, -2 + i * 2, 0]} castShadow>
          <cylinderGeometry args={[1.42, 1.42, 0.12, 24]} />
          <meshStandardMaterial 
            color="#A0A0A0" 
            metalness={0.9}
            roughness={0.4}
          />
        </mesh>
      ))}
      
      {/* Internal Trays (visible as external bands) */}
      {Array.from({ length: 15 }, (_, i) => (
        <group key={i} position={[0, -3.6 + i * 0.5, 0]}>
          {/* Tray Support Ring */}
          <mesh castShadow>
            <cylinderGeometry args={[1.41, 1.41, 0.06, 24]} />
            <meshStandardMaterial 
              color="#505050" 
              metalness={0.6}
              roughness={0.5}
            />
          </mesh>
          {/* Tray Weir (small raised edge) */}
          <mesh position={[0, 0.04, 0]} castShadow>
            <cylinderGeometry args={[1.2, 1.2, 0.02, 24]} />
            <meshStandardMaterial 
              color="#606060" 
              metalness={0.5}
              roughness={0.6}
            />
          </mesh>
          {/* Downcomers (liquid flow paths) */}
          {Array.from({ length: 2 }, (_, j) => {
            const angle = j * Math.PI;
            const x = Math.cos(angle) * 1.0;
            const z = Math.sin(angle) * 1.0;
            return (
              <mesh key={j} position={[x, 0.1, z]} castShadow>
                <boxGeometry args={[0.15, 0.2, 0.08]} />
                <meshStandardMaterial 
                  color="#404040" 
                  metalness={0.7}
                  roughness={0.4}
                />
              </mesh>
            );
          })}
        </group>
      ))}
      
      {/* Reboiler (bottom heating unit) */}
      <mesh position={[0, -5.5, 0]} castShadow>
        <cylinderGeometry args={[1.8, 1.8, 1.5, 20]} />
        <meshStandardMaterial 
          color="#8B4513" 
          metalness={0.4}
          roughness={0.7}
        />
      </mesh>
      
      {/* Reboiler Insulation Jacket */}
      <mesh position={[0, -5.5, 0]} castShadow>
        <cylinderGeometry args={[1.85, 1.85, 1.6, 20]} />
        <meshStandardMaterial 
          color="#D2691E" 
          metalness={0.1}
          roughness={0.9}
        />
      </mesh>
      
      {/* Reboiler heating coils (internal steam coils) */}
      <mesh position={[0, -5.5, 0]} castShadow>
        <torusGeometry args={[1.2, 0.12, 8, 20]} />
        <meshStandardMaterial 
          color="#FF4500" 
          metalness={0.8}
          roughness={0.3}
          emissive="#441100"
          emissiveIntensity={0.1}
        />
      </mesh>
      <mesh position={[0, -5.2, 0]} castShadow>
        <torusGeometry args={[1.0, 0.1, 8, 20]} />
        <meshStandardMaterial 
          color="#FF6347" 
          metalness={0.8}
          roughness={0.3}
          emissive="#441100"
          emissiveIntensity={0.1}
        />
      </mesh>
      <mesh position={[0, -5.8, 0]} castShadow>
        <torusGeometry args={[0.8, 0.08, 8, 20]} />
        <meshStandardMaterial 
          color="#FF7F50" 
          metalness={0.8}
          roughness={0.3}
          emissive="#441100"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Reboiler Support Skirt */}
      <mesh position={[0, -6.4, 0]} castShadow>
        <coneGeometry args={[1.9, 0.4, 16]} />
        <meshStandardMaterial 
          color="#654321" 
          metalness={0.5}
          roughness={0.6}
        />
      </mesh>
      
      {/* Condenser Shell (top cooling unit) */}
      <mesh position={[0, 5.8, 0]} castShadow>
        <boxGeometry args={[2.5, 1.0, 1.5]} />
        <meshStandardMaterial 
          color="#4682B4" 
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>
      
      {/* Condenser End Caps */}
      <mesh position={[-1.3, 5.8, 0]} castShadow>
        <boxGeometry args={[0.1, 1.1, 1.6]} />
        <meshStandardMaterial 
          color="#2E5984" 
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[1.3, 5.8, 0]} castShadow>
        <boxGeometry args={[0.1, 1.1, 1.6]} />
        <meshStandardMaterial 
          color="#2E5984" 
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      
      {/* Condenser cooling tubes (heat exchanger tubes) */}
      {Array.from({ length: 18 }, (_, i) => {
        const row = Math.floor(i / 6);
        const col = i % 6;
        const x = -1.0 + col * 0.4;
        const z = -0.4 + row * 0.4;
        return (
          <mesh key={i} position={[x, 5.8, z]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 1.2, 12]} />
            <meshStandardMaterial 
              color="#87CEEB" 
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>
        );
      })}
      
      {/* Condenser Tube Sheets */}
      <mesh position={[-1.2, 5.8, 0]} castShadow>
        <boxGeometry args={[0.05, 0.9, 1.4]} />
        <meshStandardMaterial 
          color="#708090" 
          metalness={0.8}
          roughness={0.4}
        />
      </mesh>
      <mesh position={[1.2, 5.8, 0]} castShadow>
        <boxGeometry args={[0.05, 0.9, 1.4]} />
        <meshStandardMaterial 
          color="#708090" 
          metalness={0.8}
          roughness={0.4}
        />
      </mesh>
      
      {/* Condenser Insulation */}
      <mesh position={[0, 5.8, 0]} castShadow>
        <boxGeometry args={[2.6, 1.1, 1.6]} />
        <meshStandardMaterial 
          color="#F0F8FF" 
          metalness={0.1}
          roughness={0.9}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Support Structure (Heavy duty columns) */}
      {Array.from({ length: 4 }, (_, i) => {
        const angle = (i * Math.PI) / 2;
        const x = Math.cos(angle) * 2.2;
        const z = Math.sin(angle) * 2.2;
        return (
          <group key={i}>
            {/* Main Support Column */}
            <mesh position={[x, -1, z]} castShadow>
              <cylinderGeometry args={[0.12, 0.12, 6, 12]} />
              <meshStandardMaterial 
                color="#708090" 
                metalness={0.7}
                roughness={0.4}
              />
            </mesh>
            {/* Column Base Plate */}
            <mesh position={[x, -4.2, z]} castShadow>
              <cylinderGeometry args={[0.25, 0.25, 0.1, 12]} />
              <meshStandardMaterial 
                color="#556B2F" 
                metalness={0.8}
                roughness={0.3}
              />
            </mesh>
            {/* Anchor Bolts */}
            {Array.from({ length: 4 }, (_, j) => {
              const boltAngle = (j * Math.PI) / 2;
              const boltX = x + Math.cos(boltAngle) * 0.15;
              const boltZ = z + Math.sin(boltAngle) * 0.15;
              return (
                <mesh key={j} position={[boltX, -4.3, boltZ]} castShadow>
                  <cylinderGeometry args={[0.02, 0.02, 0.15, 8]} />
                  <meshStandardMaterial 
                    color="#2F4F4F" 
                    metalness={0.9}
                    roughness={0.2}
                  />
                </mesh>
              );
            })}
          </group>
        );
      })}
      
      {/* Support Braces (Cross bracing) */}
      {Array.from({ length: 8 }, (_, i) => {
        const level = Math.floor(i / 4);
        const angle = (i % 4) * Math.PI / 2 + Math.PI / 4;
        const height = -2 + level * 4;
        const x1 = Math.cos(angle) * 1.8;
        const z1 = Math.sin(angle) * 1.8;
        const x2 = Math.cos(angle + Math.PI / 2) * 1.8;
        const z2 = Math.sin(angle + Math.PI / 2) * 1.8;
        const midX = (x1 + x2) / 2;
        const midZ = (z1 + z2) / 2;
        const length = Math.sqrt((x2 - x1) ** 2 + (z2 - z1) ** 2);
        return (
          <mesh 
            key={i} 
            position={[midX, height, midZ]} 
            rotation={[0, angle + Math.PI / 4, 0]}
            castShadow
          >
            <cylinderGeometry args={[0.06, 0.06, length, 8]} />
            <meshStandardMaterial 
              color="#778899" 
              metalness={0.6}
              roughness={0.5}
            />
          </mesh>
        );
      })}
      
      {/* Platform/Walkway at mid-level */}
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.5, 2.5, 0.08, 16]} />
        <meshStandardMaterial 
          color="#2F4F4F" 
          metalness={0.8}
          roughness={0.6}
        />
      </mesh>
      
      {/* Platform Railing */}
      {Array.from({ length: 16 }, (_, i) => {
        const angle = (i * Math.PI) / 8;
        const x = Math.cos(angle) * 2.4;
        const z = Math.sin(angle) * 2.4;
        return (
          <mesh key={i} position={[x, 2.0, z]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 1.0, 6]} />
            <meshStandardMaterial 
              color="#4682B4" 
              metalness={0.7}
              roughness={0.4}
            />
          </mesh>
        );
      })}
      
      {/* Temperature Sensors (RTD/Thermocouple Wells) */}
      {Array.from({ length: 6 }, (_, i) => {
        const height = -2 + i * 1.5;
        return (
          <group key={i} position={[1.5, height, 0]}>
            {/* Temperature Well */}
            <mesh castShadow>
              <cylinderGeometry args={[0.03, 0.03, 0.6, 8]} />
              <meshStandardMaterial 
                color="#B22222" 
                metalness={0.8}
                roughness={0.3}
              />
            </mesh>
            {/* Well Flange */}
            <mesh position={[0, -0.25, 0]} castShadow>
              <cylinderGeometry args={[0.08, 0.08, 0.05, 8]} />
              <meshStandardMaterial 
                color="#8B0000" 
                metalness={0.7}
                roughness={0.4}
              />
            </mesh>
            {/* Transmitter Head */}
            <mesh position={[0, 0.4, 0]} castShadow>
              <boxGeometry args={[0.12, 0.2, 0.08]} />
              <meshStandardMaterial 
                color="#FF4500" 
                metalness={0.1}
                roughness={0.8}
              />
            </mesh>
          </group>
        );
      })}
      
      {/* Pressure Indicators (Bourdon Tube Gauges) */}
      {Array.from({ length: 4 }, (_, i) => {
        const height = -1 + i * 2;
        return (
          <group key={i} position={[0, height, 1.5]}>
            {/* Gauge Body */}
            <mesh castShadow>
              <cylinderGeometry args={[0.18, 0.18, 0.12, 16]} />
              <meshStandardMaterial 
                color="#DAA520" 
                metalness={0.2}
                roughness={0.7}
              />
            </mesh>
            {/* Gauge Face */}
            <mesh position={[0, 0.07, 0]} castShadow>
              <cylinderGeometry args={[0.15, 0.15, 0.02, 16]} />
              <meshStandardMaterial 
                color="#F5F5DC" 
                metalness={0.1}
                roughness={0.9}
              />
            </mesh>
            {/* Gauge Needle */}
            <mesh position={[0, 0.08, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
              <boxGeometry args={[0.12, 0.01, 0.01]} />
              <meshStandardMaterial 
                color="#DC143C" 
                metalness={0.0}
                roughness={0.8}
              />
            </mesh>
            {/* Connection Port */}
            <mesh position={[0, -0.08, 0]} castShadow>
              <cylinderGeometry args={[0.04, 0.04, 0.1, 8]} />
              <meshStandardMaterial 
                color="#B8860B" 
                metalness={0.8}
                roughness={0.3}
              />
            </mesh>
          </group>
        );
      })}
      
      {/* Level Indicators (Magnetic Level Gauges) */}
      {Array.from({ length: 3 }, (_, i) => {
        const height = -2 + i * 3;
        return (
          <group key={i} position={[1.5, height, 0]}>
            {/* Gauge Chamber */}
            <mesh castShadow>
              <boxGeometry args={[0.12, 1.2, 0.08]} />
              <meshStandardMaterial 
                color="#228B22" 
                metalness={0.1}
                roughness={0.9}
                transparent
                opacity={0.7}
              />
            </mesh>
            {/* Level Indicator Float */}
            <mesh position={[0, -0.2, 0]} castShadow>
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshStandardMaterial 
                color="#FF6347" 
                metalness={0.8}
                roughness={0.2}
                emissive="#441100"
                emissiveIntensity={0.1}
              />
            </mesh>
            {/* Gauge Frame */}
            <mesh castShadow>
              <boxGeometry args={[0.15, 1.25, 0.02]} />
              <meshStandardMaterial 
                color="#2F4F4F" 
                metalness={0.6}
                roughness={0.4}
              />
            </mesh>
            {/* Connection Flanges */}
            <mesh position={[0, 0.6, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.06, 0.04, 8]} />
              <meshStandardMaterial 
                color="#696969" 
                metalness={0.8}
                roughness={0.3}
              />
            </mesh>
            <mesh position={[0, -0.6, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.06, 0.04, 8]} />
              <meshStandardMaterial 
                color="#696969" 
                metalness={0.8}
                roughness={0.3}
              />
            </mesh>
          </group>
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
            <mesh position={[0, 0.4, 0]} scale={[scale, scale, scale]}>
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
          <mesh position={[0, 6.5, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.4, 6]} />
            <meshLambertMaterial color="#ffeb3b" emissive="#ffeb3b" emissiveIntensity={0.3} />
          </mesh>
          
          {/* Grid position indicator */}
          <mesh position={[0, -4.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.8, 2.2, 16]} />
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
DistillationColumn.connectionPorts = [
  {
    id: 'electric_in',
    type: 'electric',
    label: 'Power Input',
    offset: [0, -3.5, -1.5],
    direction: [0, 0, -1],
    required: true
  },
  {
    id: 'feed_in',
    type: 'liquid',
    label: 'Feed Input',
    offset: [-1.8, 1.0, 0],
    direction: [-1, 0, 0],
    required: true
  },
  {
    id: 'distillate_out',
    type: 'liquid',
    label: 'Distillate Output',
    offset: [1.8, 4.5, 0],
    direction: [1, 0, 0],
    required: false
  },
  {
    id: 'bottoms_out',
    type: 'liquid',
    label: 'Bottoms Output',
    offset: [1.8, -3.5, 0],
    direction: [1, 0, 0],
    required: false
  },
  {
    id: 'reflux_in',
    type: 'liquid',
    label: 'Reflux Input',
    offset: [-1.8, 4.0, 0],
    direction: [-1, 0, 0],
    required: false
  },
  {
    id: 'steam_in',
    type: 'gas',
    label: 'Steam Input',
    offset: [0, -4.0, 1.5],
    direction: [0, 0, 1],
    required: true
  },
  {
    id: 'cooling_water_in',
    type: 'liquid',
    label: 'Cooling Water In',
    offset: [-1.5, 5.0, 0],
    direction: [-1, 0, 0],
    required: false
  },
  {
    id: 'cooling_water_out',
    type: 'liquid',
    label: 'Cooling Water Out',
    offset: [1.5, 5.5, 0],
    direction: [1, 0, 0],
    required: false
  }
];

export default DistillationColumn; 