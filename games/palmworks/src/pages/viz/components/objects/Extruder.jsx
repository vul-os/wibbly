import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const Extruder = ({ position, onClick, onDrag, isSelected, isDraggable, gridSnap, gridSize, onPortClick }) => {
  const meshRef = useRef();
  const groupRef = useRef();
  const screwRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [hoveredPort, setHoveredPort] = useState(null);
  const [dragStartPos, setDragStartPos] = useState(null);
  const { camera, gl } = useThree();

  // Define connection ports for the extruder
  const connectionPorts = [
    {
      id: 'electric_motor',
      type: 'electric',
      label: 'Motor Power',
      offset: [-3.5, 1.2, -0.8],
      direction: [-1, 0, 0],
      required: true
    },
    {
      id: 'electric_heaters',
      type: 'electric',
      label: 'Heating Elements',
      offset: [0, -1.5, -1.2],
      direction: [0, -1, 0],
      required: true
    },
    {
      id: 'material_feed',
      type: 'liquid',
      label: 'Material Feed',
      offset: [-2.8, 2.5, 0],
      direction: [0, 1, 0],
      required: true
    },
    {
      id: 'product_output',
      type: 'liquid',
      label: 'Extruded Product',
      offset: [4.2, 0.2, 0],
      direction: [1, 0, 0],
      required: true
    },
    {
      id: 'cooling_water_in',
      type: 'liquid',
      label: 'Cooling Water In',
      offset: [2.0, -1.5, 1.0],
      direction: [0, 0, 1],
      required: false
    },
    {
      id: 'cooling_water_out',
      type: 'liquid',
      label: 'Cooling Water Out',
      offset: [2.0, -1.5, -1.0],
      direction: [0, 0, -1],
      required: false
    },
    {
      id: 'compressed_air',
      type: 'gas',
      label: 'Instrument Air',
      offset: [3.5, 1.0, 1.2],
      direction: [0, 0, 1],
      required: false
    },
    {
      id: 'control_signal',
      type: 'electric',
      label: 'Control System',
      offset: [-1.5, -2.0, 1.5],
      direction: [0, 0, 1],
      required: false
    }
  ];

  // Screw rotation animation when selected
  useFrame((state, delta) => {
    if (isSelected && screwRef.current) {
      screwRef.current.rotation.z += delta * 3; // 3 rad/s rotation speed
    }
  });

  const snapToGrid = (value) => {
    if (!gridSnap) return value;
    return Math.round(value / gridSize) * gridSize;
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
      {/* Grid snap indicators when dragging */}
      {isDragging && gridSnap && (
        <>
          <mesh position={[0, -2.0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[3.0, 3.5, 16]} />
            <meshBasicMaterial color="#ffeb3b" transparent opacity={0.3} />
          </mesh>
          
          <mesh position={[0, 4, 0]}>
            <sphereGeometry args={[0.05]} />
            <meshBasicMaterial color="#ffeb3b" />
          </mesh>
        </>
      )}
      
      {/* Invisible collision box for easier interaction */}
      <mesh
        onPointerDown={handlePointerDown}
        visible={false}
      >
        <boxGeometry args={[8, 5, 4]} />
      </mesh>
      
      {/* Reinforced Concrete Foundation */}
      <mesh position={[0, -1.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[9.0, 0.4, 4.0]} />
        <meshStandardMaterial 
          color="#5D6D7E" 
          metalness={0.1}
          roughness={0.9}
        />
      </mesh>
      
      {/* Steel Machine Base Frame */}
      <mesh position={[0, -1.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[8.5, 0.25, 3.5]} />
        <meshStandardMaterial 
          color="#2C3E50" 
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Foundation Anchor Bolts */}
      {Array.from({ length: 12 }, (_, i) => {
        const row = Math.floor(i / 4);
        const col = i % 4;
        const x = -3.0 + col * 2.0;
        const z = -1.5 + row * 1.5;
        return (
          <group key={i} position={[x, -2.0, z]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.06, 0.06, 0.3, 8]} />
              <meshStandardMaterial 
                color="#2C3E50" 
                metalness={0.9}
                roughness={0.2}
              />
            </mesh>
            {/* Anchor Plate */}
            <mesh position={[0, 0.12, 0]} castShadow>
              <cylinderGeometry args={[0.12, 0.12, 0.04, 8]} />
              <meshStandardMaterial 
                color="#34495E" 
                metalness={0.8}
                roughness={0.3}
              />
            </mesh>
            {/* Hex Nut */}
            <mesh position={[0, 0.18, 0]} castShadow>
              <cylinderGeometry args={[0.08, 0.08, 0.06, 6]} />
              <meshStandardMaterial 
                color="#5D6D7E" 
                metalness={0.9}
                roughness={0.2}
              />
            </mesh>
          </group>
        );
      })}
      
      {/* Main Extruder Barrel (Chrome Steel) */}
      <mesh
        ref={meshRef}
        position={[0.5, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[0.35, 0.35, 6.0, 32]} />
        <meshStandardMaterial 
          color="#E8EAED" 
          metalness={0.9}
          roughness={0.05}
          envMapIntensity={0.8}
        />
      </mesh>
      
      {/* Barrel Mounting Flanges */}
      {Array.from({ length: 3 }, (_, i) => (
        <mesh key={i} position={[-2.5 + i * 2.5, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.45, 0.45, 0.08, 24]} />
          <meshStandardMaterial 
            color="#D5DBDB" 
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}
      
      {/* Barrel Longitudinal Weld Seams */}
      {Array.from({ length: 4 }, (_, i) => {
        const angle = (i * Math.PI) / 2;
        const y = Math.cos(angle) * 0.36;
        const z = Math.sin(angle) * 0.36;
        return (
          <mesh key={i} position={[0.5, y, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.01, 0.01, 6.1, 8]} />
            <meshStandardMaterial 
              color="#CACFD2" 
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
        );
      })}
      
      {/* Barrel Reinforcement Rings */}
      {Array.from({ length: 4 }, (_, i) => (
        <mesh key={i} position={[-1.8 + i * 1.2, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.37, 0.03, 8, 20]} />
          <meshStandardMaterial 
            color="#A6ACAF" 
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
      ))}
      
      {/* Barrel Temperature Probe Wells */}
      {Array.from({ length: 6 }, (_, i) => {
        const angle = (i * Math.PI) / 3 + Math.PI / 6;
        const x = -2.4 + i * 0.8;
        const y = Math.cos(angle) * 0.45;
        const z = Math.sin(angle) * 0.45;
        return (
          <group key={i} position={[x, y, z]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.02, 0.02, 0.25, 8]} />
              <meshStandardMaterial 
                color="#E74C3C" 
                metalness={0.8}
                roughness={0.3}
              />
            </mesh>
            {/* Thermocouple Head */}
            <mesh position={[0, 0.15, 0]} castShadow>
              <boxGeometry args={[0.08, 0.12, 0.06]} />
              <meshStandardMaterial 
                color="#F39C12" 
                metalness={0.2}
                roughness={0.8}
              />
            </mesh>
          </group>
        );
      })}
      
      {/* Professional Heating Zones with Band Heaters */}
      {Array.from({ length: 5 }, (_, i) => (
        <group key={i} position={[-2.2 + i * 1.2, 0, 0]}>
          {/* Cast Aluminum Heating Element Housing */}
          <mesh castShadow>
            <cylinderGeometry args={[0.42, 0.42, 0.8, 20]} />
            <meshStandardMaterial 
              color="#E74C3C" 
              metalness={0.4}
              roughness={0.6}
              emissive="#441100"
              emissiveIntensity={isSelected ? 0.2 : 0.1}
            />
          </mesh>
          
          {/* Heating Element Coils (visible bands) */}
          {Array.from({ length: 4 }, (_, j) => (
            <mesh key={j} position={[0, -0.25 + j * 0.17, 0]} castShadow>
              <torusGeometry args={[0.43, 0.015, 6, 16]} />
              <meshStandardMaterial 
                color="#DC7633" 
                metalness={0.7}
                roughness={0.4}
                emissive="#8B0000"
                emissiveIntensity={isSelected ? 0.3 : 0.1}
              />
            </mesh>
          ))}
          
          {/* Thermal Insulation Jacket (Mineral Wool) */}
          <mesh castShadow>
            <cylinderGeometry args={[0.52, 0.52, 0.95, 16]} />
            <meshStandardMaterial 
              color="#F4F6F7" 
              metalness={0.05}
              roughness={0.95}
              transparent
              opacity={0.8}
            />
          </mesh>
          
          {/* Stainless Steel Cladding */}
          <mesh castShadow>
            <cylinderGeometry args={[0.54, 0.54, 1.0, 20]} />
            <meshStandardMaterial 
              color="#BDC3C7" 
              metalness={0.8}
              roughness={0.15}
            />
          </mesh>
          
          {/* Zone Temperature Controller */}
          <mesh position={[0, 0.65, 0]} castShadow>
            <boxGeometry args={[0.2, 0.15, 0.08]} />
            <meshStandardMaterial 
              color="#2C3E50" 
              metalness={0.1}
              roughness={0.9}
            />
          </mesh>
          
          {/* Digital Temperature Display */}
          <mesh position={[0, 0.66, 0.05]} castShadow>
            <boxGeometry args={[0.15, 0.08, 0.01]} />
            <meshStandardMaterial 
              color="#1A1A1A" 
              metalness={0.1}
              roughness={0.9}
              emissive="#00FF00"
              emissiveIntensity={0.2}
            />
          </mesh>
          
          {/* Zone Number Label */}
          <mesh position={[0, -0.65, 0]} castShadow>
            <boxGeometry args={[0.15, 0.06, 0.02]} />
            <meshStandardMaterial 
              color="#F4D03F" 
              metalness={0.2}
              roughness={0.8}
            />
          </mesh>
          
          {/* Electrical Conduit Connection */}
          <mesh position={[0, -0.5, 0.3]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.12, 8]} />
            <meshStandardMaterial 
              color="#566573" 
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>
          
          {/* Pressure Relief Port */}
          <mesh position={[0, 0.5, -0.3]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.08, 8]} />
            <meshStandardMaterial 
              color="#DC7633" 
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
        </group>
      ))}
      
      {/* Professional Extruder Screw Assembly */}
      <group ref={screwRef} position={[0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        {/* High-Strength Steel Screw Shaft */}
        <mesh castShadow>
          <cylinderGeometry args={[0.12, 0.12, 5.8, 20]} />
          <meshStandardMaterial 
            color="#2C3E50" 
            metalness={0.95}
            roughness={0.05}
            envMapIntensity={1.0}
          />
        </mesh>
        
        {/* Screw Shaft Keyway */}
        <mesh position={[0, 0, 0.13]} castShadow>
          <boxGeometry args={[0.03, 5.8, 0.02]} />
          <meshStandardMaterial 
            color="#1B2631" 
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
        
        {/* Hardened Steel Screw Flights (Helical Pattern) */}
        {Array.from({ length: 30 }, (_, i) => {
          const angle = (i * Math.PI) / 8;
          const height = -2.85 + i * 0.19;
          const flightRadius = 0.28 - (i > 20 ? (i - 20) * 0.01 : 0); // Tapered compression
          return (
            <group key={i} position={[0, height, 0]} rotation={[0, angle, 0]}>
              {/* Main Flight */}
              <mesh castShadow>
                <boxGeometry args={[flightRadius * 2, 0.05, 0.12]} />
                <meshStandardMaterial 
                  color="#5D6D7E" 
                  metalness={0.9}
                  roughness={0.1}
                />
              </mesh>
              {/* Flight Reinforcement */}
              <mesh castShadow>
                <boxGeometry args={[flightRadius * 1.5, 0.08, 0.06]} />
                <meshStandardMaterial 
                  color="#34495E" 
                  metalness={0.85}
                  roughness={0.2}
                />
              </mesh>
              {/* Flight Edge Hardening */}
              <mesh position={[flightRadius, 0, 0]} castShadow>
                <boxGeometry args={[0.02, 0.06, 0.14]} />
                <meshStandardMaterial 
                  color="#1C2833" 
                  metalness={0.95}
                  roughness={0.05}
                />
              </mesh>
            </group>
          );
        })}
        
        {/* Screw Tip (Compression Zone) */}
        <mesh position={[0, 2.9, 0]} castShadow>
          <coneGeometry args={[0.18, 0.4, 16]} />
          <meshStandardMaterial 
            color="#1B2631" 
            metalness={0.95}
            roughness={0.05}
          />
        </mesh>
        
        {/* Mixing Elements (Distributive Mixing) */}
        {Array.from({ length: 3 }, (_, i) => {
          const position = 1.5 + i * 0.6;
          return (
            <group key={i} position={[0, position, 0]}>
              {Array.from({ length: 4 }, (_, j) => {
                const angle = (j * Math.PI) / 2;
                return (
                  <mesh key={j} rotation={[0, angle, 0]} castShadow>
                    <boxGeometry args={[0.25, 0.08, 0.04]} />
                    <meshStandardMaterial 
                      color="#8E44AD" 
                      metalness={0.9}
                      roughness={0.1}
                    />
                  </mesh>
                );
              })}
            </group>
          );
        })}
        
        {/* Thrust Bearing Assembly */}
        <mesh position={[0, -2.95, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.15, 16]} />
          <meshStandardMaterial 
            color="#B7950B" 
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
      </group>
      
      {/* Industrial Feed Hopper System */}
      <group position={[-2.8, 1.8, 0]}>
        {/* Main Hopper Body (Stainless Steel) */}
        <mesh castShadow>
          <coneGeometry args={[1.2, 1.5, 12]} />
          <meshStandardMaterial 
            color="#E8EAED" 
            metalness={0.8}
            roughness={0.1}
          />
        </mesh>
        
        {/* Hopper Reinforcement Rings */}
        {Array.from({ length: 3 }, (_, i) => (
          <mesh key={i} position={[0, 0.6 - i * 0.4, 0]} castShadow>
            <torusGeometry args={[1.0 - i * 0.25, 0.02, 8, 16]} />
            <meshStandardMaterial 
              color="#D5DBDB" 
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>
        ))}
        
        {/* Hopper Lid with Inspection Port */}
        <mesh position={[0, 0.8, 0]} castShadow>
          <cylinderGeometry args={[1.25, 1.25, 0.08, 16]} />
          <meshStandardMaterial 
            color="#AEB6BF" 
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        
        {/* Inspection Port Cover */}
        <mesh position={[0, 0.9, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 0.06, 16]} />
          <meshStandardMaterial 
            color="#85929E" 
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
        
        {/* Level Sensor Probe */}
        <mesh position={[0.8, 0.2, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.8, 8]} />
          <meshStandardMaterial 
            color="#F39C12" 
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
        
        {/* Level Sensor Housing */}
        <mesh position={[0.8, 0.7, 0]} castShadow>
          <boxGeometry args={[0.15, 0.2, 0.1]} />
          <meshStandardMaterial 
            color="#E67E22" 
            metalness={0.1}
            roughness={0.8}
          />
        </mesh>
        
        {/* Material Agitator */}
        <mesh position={[0, 0.1, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 1.0, 8]} />
          <meshStandardMaterial 
            color="#566573" 
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
        
        {/* Agitator Blades */}
        {Array.from({ length: 4 }, (_, i) => {
          const angle = (i * Math.PI) / 2;
          const x = Math.cos(angle) * 0.4;
          const z = Math.sin(angle) * 0.4;
          return (
            <mesh key={i} position={[x, 0.1, z]} rotation={[0, angle, 0]} castShadow>
              <boxGeometry args={[0.3, 0.06, 0.03]} />
              <meshStandardMaterial 
                color="#7D3C98" 
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
          );
        })}
        
        {/* Hopper Support Structure */}
        <mesh position={[0, -0.8, 0]} castShadow>
          <cylinderGeometry args={[0.6, 0.6, 0.15, 16]} />
          <meshStandardMaterial 
            color="#5D6D7E" 
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
        
        {/* Feed Throat Transition */}
        <mesh position={[0, -1.2, 0]} castShadow>
          <cylinderGeometry args={[0.25, 0.4, 0.8, 12]} />
          <meshStandardMaterial 
            color="#95A5A6" 
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
        
        {/* Material Flow Indicator */}
        <mesh position={[-1.0, 0.4, 0]} castShadow>
          <boxGeometry args={[0.5, 0.3, 0.08]} />
          <meshStandardMaterial 
            color="#E67E22" 
            metalness={0.1}
            roughness={0.9}
            transparent
            opacity={0.7}
          />
        </mesh>
        
        {/* Emergency Dump Valve */}
        <mesh position={[0, -1.6, 0.4]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.15, 8]} />
          <meshStandardMaterial 
            color="#C0392B" 
            metalness={0.7}
            roughness={0.4}
          />
        </mesh>
      </group>
      
      {/* Professional Die Head Assembly */}
      <group position={[3.8, 0, 0]}>
        {/* Main Die Head Body (Tool Steel) */}
        <mesh castShadow>
          <cylinderGeometry args={[0.5, 0.35, 0.8, 20]} />
          <meshStandardMaterial 
            color="#1B4F72" 
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        
        {/* Die Head Mounting Flange */}
        <mesh position={[0, 0, -0.5]} castShadow>
          <cylinderGeometry args={[0.55, 0.55, 0.12, 20]} />
          <meshStandardMaterial 
            color="#5D6D7E" 
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        
        {/* Mounting Bolts */}
        {Array.from({ length: 8 }, (_, i) => {
          const angle = (i * Math.PI) / 4;
          const x = Math.cos(angle) * 0.45;
          const z = Math.sin(angle) * 0.45;
          return (
            <mesh key={i} position={[x, 0, z - 0.5]} castShadow>
              <cylinderGeometry args={[0.02, 0.02, 0.15, 8]} />
              <meshStandardMaterial 
                color="#2C3E50" 
                metalness={0.9}
                roughness={0.2}
              />
            </mesh>
          );
        })}
        
        {/* Precision Die Insert */}
        <mesh position={[0, 0, 0.5]} castShadow>
          <cylinderGeometry args={[0.3, 0.25, 0.2, 16]} />
          <meshStandardMaterial 
            color="#8E44AD" 
            metalness={0.95}
            roughness={0.05}
          />
        </mesh>
        
        {/* Die Opening (Variable Cross-Section) */}
        <mesh position={[0, 0, 0.65]} castShadow>
          <cylinderGeometry args={[0.06, 0.08, 0.15, 12]} />
          <meshStandardMaterial 
            color="#1A1A1A" 
            metalness={0.95}
            roughness={0.05}
          />
        </mesh>
        
        {/* Temperature Control Channels */}
        {Array.from({ length: 6 }, (_, i) => {
          const angle = (i * Math.PI) / 3;
          const x = Math.cos(angle) * 0.4;
          const z = Math.sin(angle) * 0.4;
          return (
            <mesh key={i} position={[x, 0, z]} castShadow>
              <cylinderGeometry args={[0.025, 0.025, 0.9, 8]} />
              <meshStandardMaterial 
                color="#3498DB" 
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
          );
        })}
        
        {/* Die Head Heater Cartridges */}
        {Array.from({ length: 4 }, (_, i) => {
          const angle = (i * Math.PI) / 2 + Math.PI / 4;
          const x = Math.cos(angle) * 0.25;
          const z = Math.sin(angle) * 0.25;
          return (
            <mesh key={i} position={[x, 0, z]} castShadow>
              <cylinderGeometry args={[0.015, 0.015, 0.6, 8]} />
              <meshStandardMaterial 
                color="#E74C3C" 
                metalness={0.7}
                roughness={0.3}
                emissive="#8B0000"
                emissiveIntensity={isSelected ? 0.2 : 0.05}
              />
            </mesh>
          );
        })}
        
        {/* Pressure Sensor Port */}
        <mesh position={[0, 0.35, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.15, 8]} />
          <meshStandardMaterial 
            color="#F39C12" 
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
        
        {/* Pressure Gauge */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.08, 16]} />
          <meshStandardMaterial 
            color="#DAA520" 
            metalness={0.2}
            roughness={0.7}
          />
        </mesh>
        
        {/* Gauge Face */}
        <mesh position={[0, 0.55, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.01, 16]} />
          <meshStandardMaterial 
            color="#F5F5DC" 
            metalness={0.1}
            roughness={0.9}
          />
        </mesh>
        
        {/* Screen Changer Assembly */}
        <mesh position={[0, 0, -0.9]} castShadow>
          <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
          <meshStandardMaterial 
            color="#566573" 
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
        
        {/* Breaker Plate */}
        <mesh position={[0, 0, -0.75]} castShadow>
          <cylinderGeometry args={[0.32, 0.32, 0.04, 16]} />
          <meshStandardMaterial 
            color="#85929E" 
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        
        {/* Hydraulic Screen Changer Actuator */}
        <mesh position={[0, -0.4, -0.9]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.25, 12]} />
          <meshStandardMaterial 
            color="#DC7633" 
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>
      </group>
      
      {/* Industrial Drive Motor System */}
      <group position={[-3.5, 0.8, 0]}>
        {/* Main Motor Housing (TEFC Design) */}
        <mesh castShadow>
          <cylinderGeometry args={[0.4, 0.4, 1.2, 20]} />
          <meshStandardMaterial 
            color="#2C2C2C" 
            metalness={0.3}
            roughness={0.8}
          />
        </mesh>
        
        {/* Motor End Bells */}
        <mesh position={[0, 0.65, 0]} castShadow>
          <cylinderGeometry args={[0.42, 0.42, 0.12, 20]} />
          <meshStandardMaterial 
            color="#1C1C1C" 
            metalness={0.5}
            roughness={0.6}
          />
        </mesh>
        <mesh position={[0, -0.65, 0]} castShadow>
          <cylinderGeometry args={[0.42, 0.42, 0.12, 20]} />
          <meshStandardMaterial 
            color="#1C1C1C" 
            metalness={0.5}
            roughness={0.6}
          />
        </mesh>
        
        {/* Cooling Fins */}
        {Array.from({ length: 16 }, (_, i) => {
          const angle = (i * Math.PI) / 8;
          const x = Math.cos(angle) * 0.45;
          const z = Math.sin(angle) * 0.45;
          return (
            <mesh key={i} position={[x, 0, z]} castShadow>
              <boxGeometry args={[0.08, 1.0, 0.04]} />
              <meshStandardMaterial 
                color="#404040" 
                metalness={0.4}
                roughness={0.7}
              />
            </mesh>
          );
        })}
        
        {/* Motor Nameplate */}
        <mesh position={[0.42, 0, 0]} castShadow>
          <boxGeometry args={[0.02, 0.3, 0.15]} />
          <meshStandardMaterial 
            color="#F0F0F0" 
            metalness={0.1}
            roughness={0.9}
          />
        </mesh>
        
        {/* Terminal Box */}
        <mesh position={[0, 0, 0.5]} castShadow>
          <boxGeometry args={[0.3, 0.25, 0.18]} />
          <meshStandardMaterial 
            color="#2F2F2F" 
            metalness={0.2}
            roughness={0.8}
          />
        </mesh>
        
        {/* Output Shaft */}
        <mesh position={[0, 0.8, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.25, 12]} />
          <meshStandardMaterial 
            color="#4A4A4A" 
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        
        {/* Shaft Keyway */}
        <mesh position={[0, 0.8, 0.085]} castShadow>
          <boxGeometry args={[0.02, 0.25, 0.015]} />
          <meshStandardMaterial 
            color="#1B2631" 
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
      </group>
      
      {/* High-Ratio Gearbox */}
      <mesh position={[-2.8, 0.5, 0]} castShadow>
        <boxGeometry args={[0.7, 0.6, 0.6]} />
        <meshStandardMaterial 
          color="#566573" 
          metalness={0.7}
          roughness={0.4}
        />
      </mesh>
      
      {/* Gearbox Oil Sight Glass */}
      <mesh position={[-2.8, 0.7, 0.32]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.02, 12]} />
        <meshStandardMaterial 
          color="#85C1E9" 
          metalness={0.1}
          roughness={0.9}
          transparent
          opacity={0.7}
        />
      </mesh>
      
      {/* Flexible Coupling */}
      <mesh position={[-2.2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.3, 12]} />
        <meshStandardMaterial 
          color="#DC7633" 
          metalness={0.6}
          roughness={0.5}
        />
      </mesh>
      
      {/* Professional Control Cabinet */}
      <group position={[-1.5, -0.5, 1.2]}>
        {/* Main Cabinet Body */}
        <mesh castShadow>
          <boxGeometry args={[0.8, 1.5, 0.4]} />
          <meshStandardMaterial 
            color="#34495E" 
            metalness={0.2}
            roughness={0.8}
          />
        </mesh>
        
        {/* Control Panel Door */}
        <mesh position={[0, 0.2, 0.22]} castShadow>
          <boxGeometry args={[0.6, 1.0, 0.04]} />
          <meshStandardMaterial 
            color="#5D6D7E" 
            metalness={0.3}
            roughness={0.7}
          />
        </mesh>
        
        {/* HMI Touchscreen */}
        <mesh position={[0, 0.4, 0.25]} castShadow>
          <boxGeometry args={[0.35, 0.25, 0.02]} />
          <meshStandardMaterial 
            color="#1A1A1A" 
            metalness={0.1}
            roughness={0.9}
            emissive="#0066CC"
            emissiveIntensity={0.3}
          />
        </mesh>
        
        {/* Control Buttons Array */}
        {Array.from({ length: 8 }, (_, i) => {
          const x = -0.2 + (i % 4) * 0.13;
          const y = 0.05 + Math.floor(i / 4) * 0.15;
          const color = i < 4 ? '#27AE60' : '#E74C3C';
          return (
            <mesh key={i} position={[x, y, 0.26]} castShadow>
              <cylinderGeometry args={[0.025, 0.025, 0.02, 8]} />
              <meshStandardMaterial 
                color={color} 
                metalness={0.2}
                roughness={0.8}
              />
            </mesh>
          );
        })}
        
        {/* Emergency Stop Button */}
        <mesh position={[0, -0.3, 0.26]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.04, 16]} />
          <meshStandardMaterial 
            color="#C0392B" 
            metalness={0.1}
            roughness={0.9}
          />
        </mesh>
        
        {/* Variable Frequency Drive (VFD) */}
        <mesh position={[0, -0.3, -0.18]} castShadow>
          <boxGeometry args={[0.5, 0.8, 0.15]} />
          <meshStandardMaterial 
            color="#2C3E50" 
            metalness={0.1}
            roughness={0.9}
          />
        </mesh>
        
        {/* VFD Display */}
        <mesh position={[0, -0.1, -0.09]} castShadow>
          <boxGeometry args={[0.2, 0.1, 0.01]} />
          <meshStandardMaterial 
            color="#1A1A1A" 
            metalness={0.1}
            roughness={0.9}
            emissive="#FF6600"
            emissiveIntensity={0.2}
          />
        </mesh>
        
        {/* Power Distribution Terminal Blocks */}
        {Array.from({ length: 6 }, (_, i) => (
          <mesh key={i} position={[-0.25 + i * 0.1, 0.6, -0.15]} castShadow>
            <boxGeometry args={[0.08, 0.15, 0.1]} />
            <meshStandardMaterial 
              color="#85929E" 
              metalness={0.6}
              roughness={0.4}
            />
          </mesh>
        ))}
        
        {/* Cooling Fan Grille */}
        <mesh position={[0, 0.7, 0.22]} castShadow>
          <boxGeometry args={[0.3, 0.15, 0.02]} />
          <meshStandardMaterial 
            color="#2C3E50" 
            metalness={0.6}
            roughness={0.5}
          />
        </mesh>
              </group>
      
      {/* Industrial Support Structure */}
      {Array.from({ length: 6 }, (_, i) => {
        const x = -3.5 + i * 1.4;
        return (
          <group key={i} position={[x, -0.8, 0]}>
            {/* Main Support Post */}
            <mesh castShadow>
              <cylinderGeometry args={[0.1, 0.1, 1.4, 12]} />
              <meshStandardMaterial 
                color="#7F8C8D" 
                metalness={0.6}
                roughness={0.5}
              />
            </mesh>
            {/* Adjustable Foot */}
            <mesh position={[0, -0.8, 0]} castShadow>
              <cylinderGeometry args={[0.15, 0.15, 0.12, 12]} />
              <meshStandardMaterial 
                color="#2C3E50" 
                metalness={0.8}
                roughness={0.3}
              />
            </mesh>
            {/* Support Bracket */}
            <mesh position={[0, 0.5, 0]} castShadow>
              <boxGeometry args={[0.25, 0.2, 0.1]} />
              <meshStandardMaterial 
                color="#566573" 
                metalness={0.7}
                roughness={0.4}
              />
            </mesh>
          </group>
        );
      })}
      
      {/* Cross Bracing */}
      {Array.from({ length: 3 }, (_, i) => {
        const x1 = -3.5 + i * 2.8;
        const x2 = x1 + 1.4;
        const midX = (x1 + x2) / 2;
        const length = Math.sqrt((x2 - x1) ** 2 + 0);
        return (
          <mesh 
            key={i} 
            position={[midX, -0.8, 0.8]} 
            rotation={[0, i % 2 === 0 ? 0.2 : -0.2, 0]}
            castShadow
          >
            <cylinderGeometry args={[0.03, 0.03, length, 8]} />
            <meshStandardMaterial 
              color="#85929E" 
              metalness={0.6}
              roughness={0.5}
            />
          </mesh>
        );
      })}
      
      {/* Safety Guards and Access Platforms */}
      <group position={[0, 1.5, 0]}>
        {/* Main Platform Grating */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[8.0, 0.08, 1.5]} />
          <meshStandardMaterial 
            color="#566573" 
            metalness={0.7}
            roughness={0.6}
          />
        </mesh>
        
        {/* Platform Handrails */}
        {Array.from({ length: 2 }, (_, i) => {
          const z = (i - 0.5) * 1.6;
          return (
            <mesh key={i} position={[0, 0.9, z]} castShadow>
              <boxGeometry args={[8.0, 0.04, 0.08]} />
              <meshStandardMaterial 
                color="#85929E" 
                metalness={0.8}
                roughness={0.3}
              />
            </mesh>
          );
        })}
        
        {/* Handrail Posts */}
        {Array.from({ length: 6 }, (_, i) => {
          const x = -3.5 + i * 1.4;
          return (
            <group key={i}>
              <mesh position={[x, 0.5, 0.75]} castShadow>
                <cylinderGeometry args={[0.025, 0.025, 1.0, 8]} />
                <meshStandardMaterial 
                  color="#7F8C8D" 
                  metalness={0.8}
                  roughness={0.3}
                />
              </mesh>
              <mesh position={[x, 0.5, -0.75]} castShadow>
                <cylinderGeometry args={[0.025, 0.025, 1.0, 8]} />
                <meshStandardMaterial 
                  color="#7F8C8D" 
                  metalness={0.8}
                  roughness={0.3}
                />
              </mesh>
            </group>
          );
        })}
        
        {/* Access Ladder */}
        <group position={[-4.5, -0.7, 0]}>
          {/* Ladder Rails */}
          <mesh position={[-0.15, 0, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 1.4, 8]} />
            <meshStandardMaterial 
              color="#95A5A6" 
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>
          <mesh position={[0.15, 0, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 1.4, 8]} />
            <meshStandardMaterial 
              color="#95A5A6" 
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>
          
          {/* Ladder Rungs */}
          {Array.from({ length: 4 }, (_, i) => (
            <mesh key={i} position={[0, -0.5 + i * 0.35, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.015, 0.015, 0.3, 8]} />
              <meshStandardMaterial 
                color="#AEB6BF" 
                metalness={0.8}
                roughness={0.4}
              />
            </mesh>
          ))}
        </group>
      </group>
      
      {/* Product Discharge Chute */}
      <group position={[4.8, -0.3, 0]}>
        <mesh rotation={[0, 0, -Math.PI / 6]} castShadow>
          <boxGeometry args={[1.2, 0.4, 0.5]} />
          <meshStandardMaterial 
            color="#85929E" 
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>
        
        {/* Chute Sides */}
        <mesh position={[0.3, -0.15, 0.3]} rotation={[0, 0, -Math.PI / 6]} castShadow>
          <boxGeometry args={[1.2, 0.12, 0.08]} />
          <meshStandardMaterial 
            color="#7B7D7D" 
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
        <mesh position={[0.3, -0.15, -0.3]} rotation={[0, 0, -Math.PI / 6]} castShadow>
          <boxGeometry args={[1.2, 0.12, 0.08]} />
          <meshStandardMaterial 
            color="#7B7D7D" 
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
        
        {/* Product Collection Bin */}
        <mesh position={[1.0, -1.2, 0]} castShadow>
          <cylinderGeometry args={[0.8, 0.6, 1.0, 16]} />
          <meshStandardMaterial 
            color="#D5DBDB" 
            metalness={0.5}
            roughness={0.6}
          />
        </mesh>
      </group>
      
      {/* Electrical Conduit and Cable Management */}
      {Array.from({ length: 4 }, (_, i) => {
        const x = -2.5 + i * 1.5;
        return (
          <group key={i} position={[x, -1.3, 1.0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.03, 0.03, 2.8, 8]} />
              <meshStandardMaterial 
                color="#566573" 
                metalness={0.8}
                roughness={0.3}
              />
            </mesh>
            {/* Cable Support Clamps */}
            {Array.from({ length: 3 }, (_, j) => (
              <mesh key={j} position={[0, -0.8 + j * 0.8, 0]} castShadow>
                <torusGeometry args={[0.04, 0.01, 4, 8]} />
                <meshStandardMaterial 
                  color="#85929E" 
                  metalness={0.7}
                  roughness={0.4}
                />
              </mesh>
            ))}
          </group>
        );
      })}
      
      {/* Connection Ports */}
      {connectionPorts.map((port) => {
        const isHovered = hoveredPort === port.id;
        const scale = isHovered ? 1.2 : 1;
        
        return (
          <group key={port.id} position={port.offset}>
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
          </group>
        );
      })}
      
      {/* Selection indicator */}
      {isSelected && isDraggable && (
        <mesh position={[0, 3.5, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.3, 6]} />
          <meshLambertMaterial color="#ffeb3b" emissive="#ffeb3b" emissiveIntensity={0.3} />
        </mesh>
      )}
    </group>
  );
};

export default Extruder; 