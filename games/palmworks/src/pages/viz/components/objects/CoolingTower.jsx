import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const CoolingTower = ({ position, onClick, onDrag, isSelected, isDraggable, gridSnap, gridSize, onPortClick }) => {
  const meshRef = useRef();
  const groupRef = useRef();
  const fanRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [hoveredPort, setHoveredPort] = useState(null);
  const [dragStartPos, setDragStartPos] = useState(null);
  const { camera, gl } = useThree();

  // Define connection ports for the cooling tower
  const connectionPorts = [
    {
      id: 'electric_in',
      type: 'electric',
      label: 'Fan Motor Power',
      offset: [0, 4.5, -2.5],
      direction: [0, 0, -1],
      required: true
    },
    {
      id: 'hot_water_in',
      type: 'liquid',
      label: 'Hot Water Inlet',
      offset: [-2.5, 3.5, 0],
      direction: [-1, 0, 0],
      required: true
    },
    {
      id: 'cold_water_out',
      type: 'liquid',
      label: 'Cold Water Outlet',
      offset: [2.5, -2.0, 0],
      direction: [1, 0, 0],
      required: false
    },
    {
      id: 'makeup_water_in',
      type: 'liquid',
      label: 'Makeup Water',
      offset: [-1.5, -2.0, 2.0],
      direction: [0, 0, 1],
      required: false
    },
    {
      id: 'blowdown_out',
      type: 'liquid',
      label: 'Blowdown Drain',
      offset: [1.5, -2.5, 0],
      direction: [0, -1, 0],
      required: false
    },
    {
      id: 'overflow_out',
      type: 'liquid',
      label: 'Overflow Drain',
      offset: [0, -2.5, 1.8],
      direction: [0, 0, 1],
      required: false
    },
    {
      id: 'air_inlet',
      type: 'gas',
      label: 'Air Inlet',
      offset: [0, 0, 3.0],
      direction: [0, 0, 1],
      required: false
    },
    {
      id: 'air_outlet',
      type: 'gas',
      label: 'Air Discharge',
      offset: [0, 5.5, 0],
      direction: [0, 1, 0],
      required: false
    }
  ];

  // Grid snap size (CAD-like behavior)
  const GRID_SIZE = gridSize || 1.0;

  const snapToGrid = (value) => {
    if (!gridSnap) return value;
    return Math.round(value / GRID_SIZE) * GRID_SIZE;
  };

  useFrame((state) => {
    if (meshRef.current) {
      if (isSelected) {
        meshRef.current.material.emissive.setHex(0x444444);
      } else if (hovered && isDraggable) {
        meshRef.current.material.emissive.setHex(0x222222);
      } else {
        meshRef.current.material.emissive.setHex(0x000000);
      }
    }
    
    // Rotate fan when selected (simulating operation)
    if (fanRef.current && isSelected) {
      fanRef.current.rotation.y += 0.08;
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

  const handleClick = (event) => {    
    if (!isDragging) {
      onClick?.(event);
    }
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
          <mesh position={[0, -2.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[2.5, 3.0, 16]} />
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
        <boxGeometry args={[6, 8, 6]} />
      </mesh>
      
      {/* Concrete Foundation Ring */}
      <mesh position={[0, -2.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[3.2, 3.2, 0.6, 20]} />
        <meshStandardMaterial 
          color="#5D6D7E" 
          metalness={0.1}
          roughness={0.9}
        />
      </mesh>
      
      {/* Foundation Reinforcement Bars */}
      <mesh position={[0, -2.2, 0]} castShadow receiveShadow>
        <torusGeometry args={[2.8, 0.08, 8, 16]} />
        <meshStandardMaterial 
          color="#34495E" 
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[0, -2.5, 0]} castShadow receiveShadow>
        <torusGeometry args={[2.5, 0.08, 8, 16]} />
        <meshStandardMaterial 
          color="#34495E" 
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>
      
      {/* Foundation Anchor Bolts */}
      {Array.from({ length: 16 }, (_, i) => {
        const angle = (i * Math.PI) / 8;
        const x = Math.cos(angle) * 2.9;
        const z = Math.sin(angle) * 2.9;
        return (
          <group key={i} position={[x, -2.6, z]}>
            {/* Anchor Bolt */}
            <mesh castShadow>
              <cylinderGeometry args={[0.03, 0.03, 0.4, 8]} />
              <meshStandardMaterial 
                color="#2C3E50" 
                metalness={0.9}
                roughness={0.2}
              />
            </mesh>
            {/* Anchor Plate */}
            <mesh position={[0, 0.15, 0]} castShadow>
              <cylinderGeometry args={[0.08, 0.08, 0.02, 8]} />
              <meshStandardMaterial 
                color="#34495E" 
                metalness={0.8}
                roughness={0.3}
              />
            </mesh>
            {/* Nut */}
            <mesh position={[0, 0.2, 0]} castShadow>
              <cylinderGeometry args={[0.04, 0.04, 0.03, 6]} />
              <meshStandardMaterial 
                color="#5D6D7E" 
                metalness={0.9}
                roughness={0.2}
              />
            </mesh>
          </group>
        );
      })}
      
      {/* Water Collection Basin (Concrete) */}
      <mesh position={[0, -1.8, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.8, 2.8, 1.0, 24]} />
        <meshStandardMaterial 
          color="#95A5A6" 
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>
      
      {/* Basin Inner Wall (Waterproof Coating) */}
      <mesh position={[0, -1.8, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.75, 2.75, 1.05, 24]} />
        <meshStandardMaterial 
          color="#7FB3D3" 
          metalness={0.3}
          roughness={0.6}
        />
      </mesh>
      
      {/* Basin Water Level */}
      <mesh position={[0, -1.6, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.7, 2.7, 0.6, 24]} />
        <meshStandardMaterial 
          color="#5DADE2" 
          metalness={0.0}
          roughness={0.1}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Water Surface Ripples */}
      <mesh position={[0, -1.3, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.65, 2.65, 0.02, 24]} />
        <meshStandardMaterial 
          color="#85C1E9" 
          metalness={0.2}
          roughness={0.1}
          transparent
          opacity={0.6}
        />
      </mesh>
      
      {/* Basin Overflow Weir */}
      <mesh position={[0, -1.4, 0]} castShadow>
        <torusGeometry args={[2.6, 0.05, 8, 20]} />
        <meshStandardMaterial 
          color="#566573" 
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>
      
      {/* Basin Drain Grating */}
      <mesh position={[0, -2.25, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.05, 12]} />
        <meshStandardMaterial 
          color="#2C3E50" 
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>
      
      {/* Drain Grate Bars */}
      {Array.from({ length: 6 }, (_, i) => (
        <mesh key={i} position={[0, -2.22, 0]} rotation={[0, (i * Math.PI) / 6, 0]} castShadow>
          <boxGeometry args={[0.6, 0.02, 0.02]} />
          <meshStandardMaterial 
            color="#34495E" 
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
      ))}
      
      {/* Main Tower Structure (Fiberglass Shell) */}
      <mesh
        ref={meshRef}
        position={[0, 1.5, 0]}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[2.2, 2.8, 4.0, 24]} />
        <meshStandardMaterial 
          color="#D5D8DC" 
          metalness={0.2}
          roughness={0.7}
          envMapIntensity={0.2}
        />
      </mesh>
      
      {/* Tower Shell Reinforcement Ribs */}
      {Array.from({ length: 6 }, (_, i) => {
        const height = -1.8 + i * 0.6;
        return (
          <mesh key={i} position={[0, height, 0]} castShadow>
            <torusGeometry args={[2.2 + (height + 1.8) * 0.15, 0.05, 8, 24]} />
            <meshStandardMaterial 
              color="#A6ACAF" 
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
        );
      })}
      
      {/* Tower Support Columns (Galvanized Steel) */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i * Math.PI) / 4;
        const x = Math.cos(angle) * 2.5;
        const z = Math.sin(angle) * 2.5;
        return (
          <group key={i} position={[x, 0.5, z]}>
            {/* Main Column */}
            <mesh castShadow>
              <cylinderGeometry args={[0.1, 0.1, 3.0, 12]} />
              <meshStandardMaterial 
                color="#85929E" 
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
            {/* Column Base Plate */}
            <mesh position={[0, -1.6, 0]} castShadow>
              <cylinderGeometry args={[0.2, 0.2, 0.05, 12]} />
              <meshStandardMaterial 
                color="#5D6D7E" 
                metalness={0.9}
                roughness={0.2}
              />
            </mesh>
            {/* Column Connection Bolts */}
            {Array.from({ length: 4 }, (_, j) => {
              const boltAngle = (j * Math.PI) / 2;
              const boltX = Math.cos(boltAngle) * 0.15;
              const boltZ = Math.sin(boltAngle) * 0.15;
              return (
                <mesh key={j} position={[boltX, -1.62, boltZ]} castShadow>
                  <cylinderGeometry args={[0.01, 0.01, 0.03, 6]} />
                  <meshStandardMaterial 
                    color="#34495E" 
                    metalness={0.9}
                    roughness={0.2}
                  />
                </mesh>
              );
            })}
            {/* Tower Connection Bracket */}
            <mesh position={[x * -0.04, 1.0, z * -0.04]} castShadow>
              <boxGeometry args={[0.15, 0.3, 0.08]} />
              <meshStandardMaterial 
                color="#7B7D7D" 
                metalness={0.8}
                roughness={0.3}
              />
            </mesh>
          </group>
        );
      })}
      
      {/* Air Inlet Louvers */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i * Math.PI) / 4;
        const x = Math.cos(angle) * 2.6;
        const z = Math.sin(angle) * 2.6;
        return (
          <group key={i} position={[x, 0.5, z]} rotation={[0, angle, 0]}>
            {/* Louver Sections */}
            {Array.from({ length: 6 }, (_, j) => (
              <mesh key={j} position={[0, -1.2 + j * 0.4, 0.1]} rotation={[Math.PI / 6, 0, 0]} castShadow>
                <boxGeometry args={[0.8, 0.1, 0.02]} />
                <meshStandardMaterial 
                  color="#909497" 
                  metalness={0.8}
                  roughness={0.3}
                />
              </mesh>
            ))}
          </group>
        );
      })}
      
      {/* Fill Material (Honeycomb PVC Media) */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[2.4, 2.4, 2.0, 20]} />
        <meshStandardMaterial 
          color="#48C9B0" 
          metalness={0.0}
          roughness={0.9}
          transparent
          opacity={0.4}
        />
      </mesh>
      
      {/* Fill Support Grid (Stainless Steel) */}
      <mesh position={[0, -0.4, 0]} castShadow>
        <cylinderGeometry args={[2.45, 2.45, 0.08, 20]} />
        <meshStandardMaterial 
          color="#85929E" 
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Fill Material Honeycomb Structure */}
      {Array.from({ length: 144 }, (_, i) => {
        const row = Math.floor(i / 12);
        const col = i % 12;
        const x = -2.2 + col * 0.4;
        const z = -2.2 + row * 0.4;
        const distance = Math.sqrt(x * x + z * z);
        if (distance < 2.3) {
          return (
            <group key={i} position={[x, 0.5, z]}>
              {/* Vertical Fill Sheets */}
              <mesh castShadow>
                <boxGeometry args={[0.15, 1.8, 0.01]} />
                <meshStandardMaterial 
                  color="#5DADE2" 
                  metalness={0.1}
                  roughness={0.8}
                  transparent
                  opacity={0.8}
                />
              </mesh>
              {/* Cross Fill Sheets */}
              <mesh rotation={[0, Math.PI / 2, 0]} castShadow>
                <boxGeometry args={[0.15, 1.8, 0.01]} />
                <meshStandardMaterial 
                  color="#76D7C4" 
                  metalness={0.1}
                  roughness={0.8}
                  transparent
                  opacity={0.6}
                />
              </mesh>
              {/* Diagonal Spacers */}
              <mesh rotation={[0, Math.PI / 4, 0]} position={[0, 0.3, 0]} castShadow>
                <boxGeometry args={[0.2, 0.02, 0.02]} />
                <meshStandardMaterial 
                  color="#27AE60" 
                  metalness={0.2}
                  roughness={0.7}
                />
              </mesh>
              <mesh rotation={[0, -Math.PI / 4, 0]} position={[0, -0.3, 0]} castShadow>
                <boxGeometry args={[0.2, 0.02, 0.02]} />
                <meshStandardMaterial 
                  color="#27AE60" 
                  metalness={0.2}
                  roughness={0.7}
                />
              </mesh>
            </group>
          );
        }
        return null;
      }).filter(Boolean)}
      
      {/* Water Distribution Header (Main Pipe) */}
      <mesh position={[0, 3.2, 0]} castShadow>
        <cylinderGeometry args={[2.0, 2.0, 0.15, 20]} />
        <meshStandardMaterial 
          color="#2980B9" 
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Distribution Pipe Network */}
      {Array.from({ length: 4 }, (_, i) => {
        const angle = (i * Math.PI) / 2;
        const x = Math.cos(angle) * 1.2;
        const z = Math.sin(angle) * 1.2;
        return (
          <group key={i} position={[x, 3.2, z]} rotation={[0, angle, 0]}>
            {/* Branch Pipe */}
            <mesh castShadow>
              <cylinderGeometry args={[0.08, 0.08, 1.6, 12]} />
              <meshStandardMaterial 
                color="#3498DB" 
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
            {/* Pipe Support Brackets */}
            <mesh position={[0, -0.05, 0]} castShadow>
              <boxGeometry args={[0.15, 0.05, 1.6]} />
              <meshStandardMaterial 
                color="#566573" 
                metalness={0.7}
                roughness={0.4}
              />
            </mesh>
          </group>
        );
      })}
      
      {/* Distribution Nozzles (Spray Heads) */}
      {Array.from({ length: 24 }, (_, i) => {
        const ring = Math.floor(i / 8);
        const ringAngle = (i % 8) * Math.PI / 4;
        const radius = 0.6 + ring * 0.7;
        const x = Math.cos(ringAngle) * radius;
        const z = Math.sin(ringAngle) * radius;
        return (
          <group key={i} position={[x, 3.1, z]}>
            {/* Nozzle Body */}
            <mesh castShadow>
              <cylinderGeometry args={[0.03, 0.05, 0.15, 8]} />
              <meshStandardMaterial 
                color="#1ABC9C" 
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
            {/* Spray Pattern Deflector */}
            <mesh position={[0, -0.1, 0]} castShadow>
              <cylinderGeometry args={[0.08, 0.08, 0.02, 12]} />
              <meshStandardMaterial 
                color="#16A085" 
                metalness={0.7}
                roughness={0.3}
              />
            </mesh>
            {/* Water Droplets (when selected) */}
            {isSelected && Array.from({ length: 6 }, (_, j) => {
              const dropAngle = (j * Math.PI) / 3;
              const dropX = Math.cos(dropAngle) * 0.1;
              const dropZ = Math.sin(dropAngle) * 0.1;
              return (
                <mesh key={j} position={[dropX, -0.2 - j * 0.1, dropZ]} castShadow>
                  <sphereGeometry args={[0.01, 6, 6]} />
                  <meshStandardMaterial 
                    color="#85C1E9" 
                    metalness={0.0}
                    roughness={0.1}
                    transparent
                    opacity={0.8}
                  />
                </mesh>
              );
            })}
          </group>
        );
      })}
      
      {/* Drift Eliminator Frame */}
      <mesh position={[0, 3.8, 0]} castShadow>
        <cylinderGeometry args={[2.1, 2.1, 0.4, 20]} />
        <meshStandardMaterial 
          color="#566573" 
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Eliminator Support Grid */}
      {Array.from({ length: 7 }, (_, i) => (
        <mesh key={i} position={[0, 3.8, -1.5 + i * 0.5]} castShadow>
          <boxGeometry args={[4.0, 0.35, 0.03]} />
          <meshStandardMaterial 
            color="#7F8C8D" 
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
      ))}
      {Array.from({ length: 7 }, (_, i) => (
        <mesh key={i} position={[-1.5 + i * 0.5, 3.8, 0]} castShadow>
          <boxGeometry args={[0.03, 0.35, 4.0]} />
          <meshStandardMaterial 
            color="#7F8C8D" 
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
      ))}
      
      {/* Drift Eliminator Chevron Vanes */}
      {Array.from({ length: 36 }, (_, i) => {
        const row = Math.floor(i / 6);
        const col = i % 6;
        const x = -1.25 + col * 0.5;
        const z = -1.25 + row * 0.5;
        return (
          <group key={i} position={[x, 3.8, z]}>
            {/* First Chevron Blade */}
            <mesh rotation={[0, Math.PI / 8, 0]} position={[-0.1, 0, 0]} castShadow>
              <boxGeometry args={[0.4, 0.35, 0.01]} />
              <meshStandardMaterial 
                color="#AEB6BF" 
                metalness={0.6}
                roughness={0.4}
              />
            </mesh>
            {/* Second Chevron Blade */}
            <mesh rotation={[0, -Math.PI / 8, 0]} position={[0.1, 0, 0]} castShadow>
              <boxGeometry args={[0.4, 0.35, 0.01]} />
              <meshStandardMaterial 
                color="#D5DBDB" 
                metalness={0.5}
                roughness={0.5}
              />
            </mesh>
            {/* Water Collection Pocket */}
            <mesh position={[0, -0.15, 0]} castShadow>
              <boxGeometry args={[0.35, 0.04, 0.04]} />
              <meshStandardMaterial 
                color="#85929E" 
                metalness={0.8}
                roughness={0.3}
              />
            </mesh>
          </group>
        );
      })}
      
      {/* Drift Eliminator Vanes */}
      {Array.from({ length: 32 }, (_, i) => {
        const angle = (i * Math.PI) / 16;
        const x = Math.cos(angle) * 1.8;
        const z = Math.sin(angle) * 1.8;
        return (
          <mesh key={i} position={[x, 3.8, z]} rotation={[0, angle, Math.PI / 6]} castShadow>
            <boxGeometry args={[0.3, 0.35, 0.02]} />
            <meshStandardMaterial 
              color="#C0392B" 
              metalness={0.4}
              roughness={0.6}
            />
          </mesh>
        );
      })}
      
      {/* Fan Housing Shell */}
      <mesh position={[0, 4.8, 0]} castShadow>
        <cylinderGeometry args={[1.9, 1.9, 0.8, 20]} />
        <meshStandardMaterial 
          color="#34495E" 
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Fan Housing Inner Liner */}
      <mesh position={[0, 4.8, 0]} castShadow>
        <cylinderGeometry args={[1.85, 1.85, 0.85, 20]} />
        <meshStandardMaterial 
          color="#566573" 
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      
      {/* Fan Housing Reinforcement Rings */}
      <mesh position={[0, 4.5, 0]} castShadow>
        <torusGeometry args={[1.9, 0.05, 8, 20]} />
        <meshStandardMaterial 
          color="#2C3E50" 
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[0, 5.1, 0]} castShadow>
        <torusGeometry args={[1.9, 0.05, 8, 20]} />
        <meshStandardMaterial 
          color="#2C3E50" 
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Fan Assembly */}
      <group ref={fanRef} position={[0, 4.8, 0]}>
        {/* Fan Hub (Forged Steel) */}
        <mesh castShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.25, 16]} />
          <meshStandardMaterial 
            color="#5D6D7E" 
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        
        {/* Hub Mounting Bolts */}
        {Array.from({ length: 8 }, (_, i) => {
          const angle = (i * Math.PI) / 4;
          const x = Math.cos(angle) * 0.25;
          const z = Math.sin(angle) * 0.25;
          return (
            <mesh key={i} position={[x, 0.08, z]} castShadow>
              <cylinderGeometry args={[0.02, 0.02, 0.03, 6]} />
              <meshStandardMaterial 
                color="#2C3E50" 
                metalness={0.9}
                roughness={0.2}
              />
            </mesh>
          );
        })}
        
        {/* Fan Blades (Aerospace Grade) */}
        {Array.from({ length: 6 }, (_, i) => {
          const angle = (i * Math.PI) / 3;
          return (
            <group key={i} rotation={[0, angle, 0]}>
              {/* Main Blade Structure */}
              <mesh position={[0.8, 0, 0]} rotation={[0, 0, Math.PI / 18]} castShadow>
                <boxGeometry args={[1.6, 0.12, 0.06]} />
                <meshStandardMaterial 
                  color="#85929E" 
                  metalness={0.8}
                  roughness={0.2}
                />
              </mesh>
              {/* Blade Tip Reinforcement */}
              <mesh position={[1.55, 0, 0]} castShadow>
                <boxGeometry args={[0.1, 0.15, 0.08]} />
                <meshStandardMaterial 
                  color="#2C3E50" 
                  metalness={0.9}
                  roughness={0.1}
                />
              </mesh>
              {/* Blade Root Reinforcement */}
              <mesh position={[0.35, 0, 0]} castShadow>
                <boxGeometry args={[0.1, 0.2, 0.08]} />
                <meshStandardMaterial 
                  color="#34495E" 
                  metalness={0.8}
                  roughness={0.2}
                />
              </mesh>
              {/* Blade Attachment Bracket */}
              <mesh position={[0.25, 0, 0]} castShadow>
                <boxGeometry args={[0.08, 0.25, 0.1]} />
                <meshStandardMaterial 
                  color="#566573" 
                  metalness={0.8}
                  roughness={0.3}
                />
              </mesh>
            </group>
          );
        })}
        
        {/* Blade Safety Ring */}
        <mesh position={[0, 0, 0]} castShadow>
          <torusGeometry args={[1.7, 0.04, 8, 24]} />
          <meshStandardMaterial 
            color="#E74C3C" 
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
        
        {/* Dynamic Balancing Weights */}
        {Array.from({ length: 3 }, (_, i) => {
          const angle = (i * Math.PI * 2) / 3;
          const x = Math.cos(angle) * 0.28;
          const z = Math.sin(angle) * 0.28;
          return (
            <mesh key={i} position={[x, -0.1, z]} castShadow>
              <cylinderGeometry args={[0.03, 0.03, 0.05, 8]} />
              <meshStandardMaterial 
                color="#D35400" 
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
          );
        })}
      </group>
      
      {/* Fan Motor Housing */}
      <mesh position={[0, 5.9, 0]} castShadow>
        <cylinderGeometry args={[0.45, 0.45, 1.0, 16]} />
        <meshStandardMaterial 
          color="#2C3E50" 
          metalness={0.6}
          roughness={0.5}
        />
      </mesh>
      
      {/* Motor End Bells */}
      <mesh position={[0, 5.4, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.1, 16]} />
        <meshStandardMaterial 
          color="#34495E" 
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[0, 6.4, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.1, 16]} />
        <meshStandardMaterial 
          color="#34495E" 
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      
      {/* Motor Nameplate */}
      <mesh position={[0, 5.9, 0.45]} castShadow>
        <boxGeometry args={[0.3, 0.15, 0.01]} />
        <meshStandardMaterial 
          color="#F8C471" 
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>
      
      {/* Motor Terminal Box */}
      <mesh position={[0.3, 6.1, 0]} castShadow>
        <boxGeometry args={[0.2, 0.15, 0.12]} />
        <meshStandardMaterial 
          color="#2E4053" 
          metalness={0.3}
          roughness={0.8}
        />
      </mesh>
      
      {/* Motor Conduit Entry */}
      <mesh position={[0.4, 6.1, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.08, 8]} />
        <meshStandardMaterial 
          color="#5D6D7E" 
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Motor Cooling Fins */}
      {Array.from({ length: 16 }, (_, i) => {
        const angle = (i * Math.PI) / 8;
        const x = Math.cos(angle) * 0.48;
        const z = Math.sin(angle) * 0.48;
        return (
          <mesh key={i} position={[x, 5.9, z]} castShadow>
            <boxGeometry args={[0.04, 0.8, 0.015]} />
            <meshStandardMaterial 
              color="#566573" 
              metalness={0.5}
              roughness={0.6}
            />
          </mesh>
        );
      })}
      
      {/* Motor Mounting Feet */}
      {Array.from({ length: 4 }, (_, i) => {
        const angle = (i * Math.PI) / 2;
        const x = Math.cos(angle) * 0.4;
        const z = Math.sin(angle) * 0.4;
        return (
          <mesh key={i} position={[x, 5.35, z]} castShadow>
            <boxGeometry args={[0.12, 0.08, 0.08]} />
            <meshStandardMaterial 
              color="#7B7D7D" 
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>
        );
      })}
      
      {/* Fan Guard Ring */}
      <mesh position={[0, 4.8, 0]} castShadow>
        <torusGeometry args={[1.9, 0.04, 8, 24]} />
        <meshStandardMaterial 
          color="#85929E" 
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Fan Guard Spokes */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i * Math.PI) / 4;
        const x = Math.cos(angle) * 0.95;
        const z = Math.sin(angle) * 0.95;
        return (
          <mesh key={i} position={[x, 4.8, z]} rotation={[0, angle, 0]} castShadow>
            <boxGeometry args={[1.9, 0.03, 0.03]} />
            <meshStandardMaterial 
              color="#7F8C8D" 
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>
        );
      })}
      
      {/* Water Level Indicators */}
      {Array.from({ length: 2 }, (_, i) => (
        <group key={i} position={[2.9, -1.8 + i * 0.8, 0]}>
          {/* Level Glass */}
          <mesh castShadow>
            <boxGeometry args={[0.08, 0.6, 0.06]} />
            <meshStandardMaterial 
              color="#3498DB" 
              metalness={0.1}
              roughness={0.9}
              transparent
              opacity={0.8}
            />
          </mesh>
          {/* Level Indicator Float */}
          <mesh position={[0, 0.1, 0]} castShadow>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshStandardMaterial 
              color="#E74C3C" 
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
          {/* Gauge Housing */}
          <mesh castShadow>
            <boxGeometry args={[0.1, 0.65, 0.02]} />
            <meshStandardMaterial 
              color="#2F4F4F" 
              metalness={0.6}
              roughness={0.4}
            />
          </mesh>
        </group>
      ))}
      
      {/* Temperature Sensors */}
      {Array.from({ length: 3 }, (_, i) => {
        const heights = [1.0, 2.0, 3.0];
        return (
          <group key={i} position={[2.4, heights[i], 0]}>
            {/* Temperature Well */}
            <mesh castShadow>
              <cylinderGeometry args={[0.03, 0.03, 0.4, 8]} />
              <meshStandardMaterial 
                color="#E74C3C" 
                metalness={0.8}
                roughness={0.3}
              />
            </mesh>
            {/* Transmitter Head */}
            <mesh position={[0, 0.3, 0]} castShadow>
              <boxGeometry args={[0.08, 0.12, 0.06]} />
              <meshStandardMaterial 
                color="#F39C12" 
                metalness={0.1}
                roughness={0.8}
              />
            </mesh>
          </group>
        );
      })}
      
      {/* Water Pumps */}
      {Array.from({ length: 2 }, (_, i) => {
        const angle = (i * Math.PI);
        const x = Math.cos(angle) * 3.2;
        const z = Math.sin(angle) * 3.2;
        return (
          <group key={i} position={[x, -1.8, z]}>
            {/* Pump Casing */}
            <mesh castShadow>
              <cylinderGeometry args={[0.3, 0.3, 0.6, 12]} />
              <meshStandardMaterial 
                color="#2980B9" 
                metalness={0.7}
                roughness={0.3}
              />
            </mesh>
            {/* Pump Motor */}
            <mesh position={[0, 0.5, 0]} castShadow>
              <cylinderGeometry args={[0.2, 0.2, 0.4, 12]} />
              <meshStandardMaterial 
                color="#34495E" 
                metalness={0.4}
                roughness={0.7}
              />
            </mesh>
            {/* Pump Base */}
            <mesh position={[0, -0.4, 0]} castShadow>
              <boxGeometry args={[0.8, 0.1, 0.5]} />
              <meshStandardMaterial 
                color="#5D6D7E" 
                metalness={0.8}
                roughness={0.3}
              />
            </mesh>
          </group>
        );
      })}
      
      {/* Control Panel */}
      <mesh position={[-3.5, 1.0, 0]} castShadow>
        <boxGeometry args={[0.4, 1.0, 0.2]} />
        <meshStandardMaterial 
          color="#2E4053" 
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>
      
      {/* Control Panel Display */}
      <mesh position={[-3.3, 1.2, 0]} castShadow>
        <boxGeometry args={[0.25, 0.15, 0.02]} />
        <meshStandardMaterial 
          color="#17202A" 
          metalness={0.1}
          roughness={0.9}
        />
      </mesh>
      
      {/* Control Indicators */}
      {Array.from({ length: 4 }, (_, i) => (
        <mesh key={i} position={[-3.3, 0.9 - i * 0.15, 0.01]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.02, 8]} />
          <meshStandardMaterial 
            color={i < 2 ? "#27AE60" : "#E74C3C"} 
            metalness={0.3}
            roughness={0.7}
            emissive={i < 2 ? "#154F23" : "#7B241C"}
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
      
      {/* Piping Connections */}
      <mesh position={[-2.2, 3.5, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.6, 12]} />
        <meshStandardMaterial 
          color="#5DADE2" 
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      <mesh position={[2.2, -2.0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.6, 12]} />
        <meshStandardMaterial 
          color="#3498DB" 
          metalness={0.8}
          roughness={0.2}
        />
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
          <mesh position={[0, 6.5, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.4, 6]} />
            <meshStandardMaterial color="#ffeb3b" emissive="#ffeb3b" emissiveIntensity={0.3} />
          </mesh>
          
          {/* Grid position indicator */}
          <mesh position={[0, -3.0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[2.8, 3.4, 16]} />
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
CoolingTower.connectionPorts = [
  {
    id: 'electric_in',
    type: 'electric',
    label: 'Fan Motor Power',
    offset: [0, 4.5, -2.5],
    direction: [0, 0, -1],
    required: true
  },
  {
    id: 'hot_water_in',
    type: 'liquid',
    label: 'Hot Water Inlet',
    offset: [-2.5, 3.5, 0],
    direction: [-1, 0, 0],
    required: true
  },
  {
    id: 'cold_water_out',
    type: 'liquid',
    label: 'Cold Water Outlet',
    offset: [2.5, -2.0, 0],
    direction: [1, 0, 0],
    required: false
  },
  {
    id: 'makeup_water_in',
    type: 'liquid',
    label: 'Makeup Water',
    offset: [-1.5, -2.0, 2.0],
    direction: [0, 0, 1],
    required: false
  },
  {
    id: 'blowdown_out',
    type: 'liquid',
    label: 'Blowdown Drain',
    offset: [1.5, -2.5, 0],
    direction: [0, -1, 0],
    required: false
  },
  {
    id: 'overflow_out',
    type: 'liquid',
    label: 'Overflow Drain',
    offset: [0, -2.5, 1.8],
    direction: [0, 0, 1],
    required: false
  },
  {
    id: 'air_inlet',
    type: 'gas',
    label: 'Air Inlet',
    offset: [0, 0, 3.0],
    direction: [0, 0, 1],
    required: false
  },
  {
    id: 'air_outlet',
    type: 'gas',
    label: 'Air Discharge',
    offset: [0, 5.5, 0],
    direction: [0, 1, 0],
    required: false
  }
];

export default CoolingTower; 