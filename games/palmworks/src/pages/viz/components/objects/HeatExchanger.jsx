import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const HeatExchanger = ({ position, onClick, onDrag, isSelected, isDraggable, gridSnap, gridSize, onPortClick }) => {
  const meshRef = useRef();
  const groupRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [hoveredPort, setHoveredPort] = useState(null);
  const [, setDragStartPos] = useState(null);
  const { camera, gl } = useThree();

  // Define connection ports for the heat exchanger
  const connectionPorts = [
    {
      id: 'electric_in',
      type: 'electric',
      label: 'Electrical Input',
      offset: [0, 1.2, -1.8],
      direction: [0, 0, -1],
      required: true
    },
    {
      id: 'water_in',
      type: 'liquid',
      label: 'Water Inlet',
      offset: [-2.2, 0, 0],
      direction: [-1, 0, 0],
      required: true
    },
    {
      id: 'water_out',
      type: 'liquid',
      label: 'Water Outlet',
      offset: [2.2, 0, 0],
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
          <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.8, 1.2, 16]} />
            <meshBasicMaterial color="#ffeb3b" transparent opacity={0.3} />
          </mesh>
          
          {/* Show coordinate text overlay */}
          <mesh position={[0, 2.5, 0]}>
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
        <boxGeometry args={[5, 3, 4]} />
      </mesh>
      
      {/* Main Heat Exchanger Body */}
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[4, 2, 3]} />
        <meshLambertMaterial color="#FF9800" />
      </mesh>
      
      {/* Top Cover */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <boxGeometry args={[4.2, 0.2, 3.2]} />
        <meshLambertMaterial color="#E65100" />
      </mesh>
      
      {/* Bottom Cover */}
      <mesh position={[0, -1.1, 0]} castShadow>
        <boxGeometry args={[4.2, 0.2, 3.2]} />
        <meshLambertMaterial color="#E65100" />
      </mesh>
      
      {/* Heat Exchanger Tubes (visible through grilles) */}
      {Array.from({ length: 8 }, (_, i) => (
        <mesh key={`tube-${i}`} position={[i * 0.4 - 1.4, 0, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 2.8, 8]} />
          <meshLambertMaterial color="#BDBDBD" />
        </mesh>
      ))}
      
      {/* Side Panels with Ventilation Grilles */}
      <mesh position={[2.2, 0, 0]} castShadow>
        <boxGeometry args={[0.2, 1.6, 2.6]} />
        <meshLambertMaterial color="#BF360C" />
      </mesh>
      
      <mesh position={[-2.2, 0, 0]} castShadow>
        <boxGeometry args={[0.2, 1.6, 2.6]} />
        <meshLambertMaterial color="#BF360C" />
      </mesh>
      
      {/* Ventilation Grilles */}
      {Array.from({ length: 10 }, (_, i) => (
        <React.Fragment key={`grille-${i}`}>
          <mesh position={[2.25, i * 0.2 - 0.8, 0]} castShadow>
            <boxGeometry args={[0.05, 0.05, 2.4]} />
            <meshLambertMaterial color="#666666" />
          </mesh>
          <mesh position={[-2.25, i * 0.2 - 0.8, 0]} castShadow>
            <boxGeometry args={[0.05, 0.05, 2.4]} />
            <meshLambertMaterial color="#666666" />
          </mesh>
        </React.Fragment>
      ))}
      
      {/* Control Panel */}
      <mesh position={[0, 0.5, 1.6]} castShadow>
        <boxGeometry args={[1.5, 0.8, 0.1]} />
        <meshLambertMaterial color="#37474F" />
      </mesh>
      
      {/* Control Panel Display */}
      <mesh position={[0, 0.5, 1.65]} castShadow>
        <boxGeometry args={[0.8, 0.4, 0.05]} />
        <meshLambertMaterial color="#000000" emissive="#004D40" emissiveIntensity={0.3} />
      </mesh>
      
      {/* Control Buttons */}
      {[-0.4, -0.1, 0.2].map((x, i) => (
        <mesh key={`button-${i}`} position={[x, 0.2, 1.65]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.05, 8]} />
          <meshLambertMaterial color={i === 1 ? '#4CAF50' : '#F44336'} />
        </mesh>
      ))}
      
      {/* Temperature Sensors */}
      <mesh position={[-1.5, 0.8, 1.6]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.3, 8]} />
        <meshLambertMaterial color="#ffeb3b" />
      </mesh>
      
      <mesh position={[1.5, 0.8, 1.6]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.3, 8]} />
        <meshLambertMaterial color="#ffeb3b" />
      </mesh>
      
      {/* Mounting Feet */}
      {[
        [-1.8, -1.3, -1.2],
        [1.8, -1.3, -1.2],
        [-1.8, -1.3, 1.2],
        [1.8, -1.3, 1.2]
      ].map((footPos, i) => (
        <mesh key={`foot-${i}`} position={footPos} castShadow>
          <boxGeometry args={[0.3, 0.2, 0.3]} />
          <meshLambertMaterial color="#37474F" />
        </mesh>
      ))}
      
      {/* Inlet/Outlet Pipes */}
      <mesh position={[-1.8, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.8, 12]} />
        <meshLambertMaterial color="#666666" />
      </mesh>
      
      <mesh position={[1.8, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.8, 12]} />
        <meshLambertMaterial color="#666666" />
      </mesh>
      
      {/* Electrical Junction Box */}
      <mesh position={[0, 1.2, -1.3]} castShadow>
        <boxGeometry args={[0.6, 0.4, 0.3]} />
        <meshLambertMaterial color="#37474F" />
      </mesh>
      
      {/* Electrical Conduit */}
      <mesh position={[0, 1.2, -1.5]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.3, 8]} />
        <meshLambertMaterial color="#666666" />
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
          <mesh position={[0, 2, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.3, 6]} />
            <meshLambertMaterial color="#ffeb3b" emissive="#ffeb3b" emissiveIntensity={0.3} />
          </mesh>
          
          {/* Grid position indicator */}
          <mesh position={[0, -2.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
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
HeatExchanger.connectionPorts = [
  {
    id: 'electric_in',
    type: 'electric',
    label: 'Electrical Input',
    offset: [0, 1.2, -1.8],
    direction: [0, 0, -1],
    required: true
  },
  {
    id: 'water_in',
    type: 'liquid',
    label: 'Water Inlet',
    offset: [-2.2, 0, 0],
    direction: [-1, 0, 0],
    required: true
  },
  {
    id: 'water_out',
    type: 'liquid',
    label: 'Water Outlet',
    offset: [2.2, 0, 0],
    direction: [1, 0, 0],
    required: false
  }
];

export default HeatExchanger; 