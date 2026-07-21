import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const PowerBox = ({ position, onClick, onDrag, isSelected, isDraggable, gridSnap, gridSize, onPortClick }) => {
  const meshRef = useRef();
  const groupRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [hoveredPort, setHoveredPort] = useState(null);
  const [dragStartPos, setDragStartPos] = useState(null);
  const { camera, gl } = useThree();

  // Define connection ports for the power box
  const connectionPorts = [
    {
      id: 'electric_out_1',
      type: 'electric',
      label: 'Power Output 1',
      offset: [0.55, 1.0, 0],
      direction: [1, 0, 0],
      required: false
    },
    {
      id: 'electric_out_2',
      type: 'electric',
      label: 'Power Output 2',
      offset: [0, 1.0, 0.55],
      direction: [0, 0, 1],
      required: false
    },
    {
      id: 'electric_out_3',
      type: 'electric',
      label: 'Power Output 3',
      offset: [-0.55, 1.0, 0],
      direction: [-1, 0, 0],
      required: false
    },
    {
      id: 'electric_out_4',
      type: 'electric',
      label: 'Power Output 4',
      offset: [0, 1.0, -0.55],
      direction: [0, 0, -1],
      required: false
    }
  ];

  // Grid snap size (CAD-like behavior)
  const GRID_SIZE = gridSize || 1.0;

  const snapToGrid = (value) => {
    if (!gridSnap) return value;
    return Math.round(value / GRID_SIZE) * GRID_SIZE;
  };

  // Create lightning bolt texture
  const createLightningTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    
    // Clear background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw lightning bolt
    ctx.fillStyle = '#FFD700'; // Gold color
    ctx.strokeStyle = '#FFA000'; // Darker gold outline
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    // Lightning bolt shape
    ctx.moveTo(64, 20);  // Top center
    ctx.lineTo(45, 55);  // Left side
    ctx.lineTo(60, 55);  // Small right jog
    ctx.lineTo(40, 100); // Bottom left
    ctx.lineTo(75, 65);  // Right side up
    ctx.lineTo(60, 65);  // Small left jog
    ctx.lineTo(80, 30);  // Top right
    ctx.closePath();
    
    ctx.fill();
    ctx.stroke();
    
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  };

  useFrame((state) => {
    if (meshRef.current) {
      if (isSelected) {
        meshRef.current.children.forEach(child => {
          if (child.material && child.material.emissive) {
            child.material.emissive.setHex(0x444444);
          }
        });
      } else if (hovered && isDraggable) {
        meshRef.current.children.forEach(child => {
          if (child.material && child.material.emissive) {
            child.material.emissive.setHex(0x222222);
          }
        });
      } else {
        meshRef.current.children.forEach(child => {
          if (child.material && child.material.emissive) {
            child.material.emissive.setHex(0x000000);
          }
        });
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
          <mesh position={[0, -1.0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.8, 1.2, 16]} />
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
        <boxGeometry args={[2, 2, 2]} />
      </mesh>
      
      {/* Main power box structure */}
      <group ref={meshRef}>
        {/* Main Power Box Body - taller and thinner */}
        <mesh position={[0, 1.0, 0]} castShadow>
          <boxGeometry args={[1.0, 2.0, 1.0]} />
          <meshLambertMaterial color="#FF9800" />
        </mesh>
        
        {/* Top Cover */}
        <mesh position={[0, 2.05, 0]} castShadow>
          <boxGeometry args={[1.1, 0.1, 1.1]} />
          <meshLambertMaterial color="#F57400" />
        </mesh>
        
        {/* Base */}
        <mesh position={[0, -0.05, 0]} castShadow>
          <boxGeometry args={[1.1, 0.1, 1.1]} />
          <meshLambertMaterial color="#E65100" />
        </mesh>
        
        {/* Lightning Bolt Symbol on Front */}
        <mesh position={[0, 1.0, 0.51]} castShadow>
          <planeGeometry args={[0.6, 0.6]} />
          <meshBasicMaterial 
            map={createLightningTexture()} 
            transparent={true}
            alphaTest={0.1}
          />
        </mesh>
        
        {/* Lightning Bolt Symbol on Top Lid - visible from above */}
        <mesh position={[0, 2.11, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
          <planeGeometry args={[0.8, 0.8]} />
          <meshBasicMaterial 
            map={createLightningTexture()} 
            transparent={true}
            alphaTest={0.1}
          />
        </mesh>
        
        {/* Warning Stripes */}
        <mesh position={[0.45, 1.0, 0]} castShadow>
          <boxGeometry args={[0.05, 1.8, 0.9]} />
          <meshLambertMaterial color="#FFD700" />
        </mesh>
        <mesh position={[-0.45, 1.0, 0]} castShadow>
          <boxGeometry args={[0.05, 1.8, 0.9]} />
          <meshLambertMaterial color="#FFD700" />
        </mesh>
        
        {/* Ventilation Grilles */}
        <mesh position={[0, 1.6, 0.51]} castShadow>
          <boxGeometry args={[0.8, 0.05, 0.02]} />
          <meshLambertMaterial color="#333333" />
        </mesh>
        <mesh position={[0, 1.4, 0.51]} castShadow>
          <boxGeometry args={[0.8, 0.05, 0.02]} />
          <meshLambertMaterial color="#333333" />
        </mesh>
        <mesh position={[0, 1.2, 0.51]} castShadow>
          <boxGeometry args={[0.8, 0.05, 0.02]} />
          <meshLambertMaterial color="#333333" />
        </mesh>
        
        {/* Status Indicators */}
        <mesh position={[0.3, 1.8, 0.51]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshLambertMaterial 
            color="#00E676"
            emissive="#00E676"
            emissiveIntensity={0.5}
          />
        </mesh>
        <mesh position={[0.1, 1.8, 0.51]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshLambertMaterial 
            color="#2196F3"
            emissive="#2196F3"
            emissiveIntensity={0.3}
          />
        </mesh>
        <mesh position={[-0.1, 1.8, 0.51]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshLambertMaterial 
            color="#FF5722"
            emissive="#FF5722"
            emissiveIntensity={0.3}
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
          
          <mesh position={[0, -0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.0, 1.3, 16]} />
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
PowerBox.connectionPorts = [
  {
    id: 'electric_out_1',
    type: 'electric',
    label: 'Power Output 1',
    offset: [0.55, 1.0, 0],
    direction: [1, 0, 0],
    required: false
  },
  {
    id: 'electric_out_2',
    type: 'electric',
    label: 'Power Output 2',
    offset: [0, 1.0, 0.55],
    direction: [0, 0, 1],
    required: false
  },
  {
    id: 'electric_out_3',
    type: 'electric',
    label: 'Power Output 3',
    offset: [-0.55, 1.0, 0],
    direction: [-1, 0, 0],
    required: false
  },
  {
    id: 'electric_out_4',
    type: 'electric',
    label: 'Power Output 4',
    offset: [0, 1.0, -0.55],
    direction: [0, 0, -1],
    required: false
  }
];

export default PowerBox; 