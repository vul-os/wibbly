import { useRef, useState } from 'react';
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import type { PlantObjectComponent, PlantObjectProps } from './types';

interface PipelineSystemProps extends PlantObjectProps {
  position: [number, number, number];
}

interface PipelineSystemPort {
  id: string;
  type: 'electric' | 'liquid' | 'gas';
  label: string;
  offset: [number, number, number];
  direction: [number, number, number];
  required: boolean;
}

const PipelineSystem: PlantObjectComponent<PipelineSystemProps, PipelineSystemPort> = ({ position, onClick, onDrag, isSelected, isDraggable, gridSnap, gridSize, onPortClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [hoveredPort, setHoveredPort] = useState<string | null>(null);
  const [, setDragStartPos] = useState<[number, number, number] | null>(null);
  const { camera, gl } = useThree();

  const connectionPorts: PipelineSystemPort[] = [
    {
      id: 'pipeline_input',
      type: 'liquid',
      label: 'Pipeline Input',
      offset: [-8.0, 1.2, 0],
      direction: [-1, 0, 0],
      required: true
    },
    {
      id: 'pipeline_output',
      type: 'liquid',
      label: 'Pipeline Output',
      offset: [8.0, 1.2, 0],
      direction: [1, 0, 0],
      required: true
    },
    {
      id: 'electric_power',
      type: 'electric',
      label: 'Control Systems',
      offset: [0, -0.5, -2.5],
      direction: [0, 0, -1],
      required: false
    },
    {
      id: 'instrument_air',
      type: 'gas',
      label: 'Instrument Air',
      offset: [-4.0, 1.8, -2.0],
      direction: [0, 0, -1],
      required: false
    },
    {
      id: 'emergency_shutdown',
      type: 'electric',
      label: 'Emergency Shutdown',
      offset: [4.0, 1.8, -2.0],
      direction: [0, 0, -1],
      required: false
    }
  ];

  const GRID_SIZE = gridSize || 1.0;

  const snapToGrid = (value: number): number => {
    if (!gridSnap) return value;
    return Math.round(value / GRID_SIZE) * GRID_SIZE;
  };

  useFrame(() => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      if (isSelected) {
        material.emissive.setHex(0x444444);
      } else if (hovered && isDraggable) {
        material.emissive.setHex(0x222222);
      } else {
        material.emissive.setHex(0x000000);
      }
    }

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

      if (!hasMovedMouse) {
        hasMovedMouse = true;
        setIsDragging(true);
      }

      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      mouse.x = (point.clientX / gl.domElement.clientWidth) * 2 - 1;
      mouse.y = -(point.clientY / gl.domElement.clientHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const intersection = new THREE.Vector3();

      if (raycaster.ray.intersectPlane(plane, intersection)) {
        const snappedX = snapToGrid(intersection.x);
        const snappedZ = snapToGrid(intersection.z);
        const newPosition: [number, number, number] = [snappedX, position[1], snappedZ];
        onDrag(newPosition);
      }
    };

    const handlePointerUp = () => {
      if (!hasMovedMouse) {
        setIsDragging(false);
        setDragStartPos(null);
        gl.domElement.style.cursor = isDraggable ? 'grab' : 'auto';

        document.removeEventListener('mousemove', handlePointerMove);
        document.removeEventListener('mouseup', handlePointerUp);
        document.removeEventListener('touchmove', handlePointerMove);
        document.removeEventListener('touchend', handlePointerUp);

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

    document.addEventListener('mousemove', handlePointerMove);
    document.addEventListener('mouseup', handlePointerUp);
    document.addEventListener('touchmove', handlePointerMove);
    document.addEventListener('touchend', handlePointerUp);

    (event as unknown as { preventDefault?: () => void }).preventDefault?.();
  };

  const handlePortClick = (port: PipelineSystemPort, event: ThreeEvent<MouseEvent>) => {
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

  const getPortColor = (port: PipelineSystemPort): string => {
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
      {isDragging && gridSnap && (
        <>
          <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[8.0, 8.5, 16]} />
            <meshBasicMaterial color="#ffeb3b" transparent opacity={0.3} />
          </mesh>
          
          <mesh position={[0, 6, 0]}>
            <sphereGeometry args={[0.05]} />
            <meshBasicMaterial color="#ffeb3b" />
          </mesh>
        </>
      )}
      
      <mesh
        position={[0, 2.0, 0]}
        onPointerDown={handlePointerDown}
        visible={false}
      >
        <boxGeometry args={[18, 6, 6]} />
      </mesh>
      
      {/* Professional Pipeline Foundation System */}
      {Array.from({ length: 8 }, (_, i) => {
        const x = -7 + i * 2;
        return (
          <group key={i} position={[x, -0.8, 0]}>
            {/* Concrete Pipeline Support Pier */}
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.4, 0.6, 0.8, 12]} />
              <meshStandardMaterial 
                color="#5D6D7E" 
                metalness={0.05}
                roughness={0.95}
              />
            </mesh>
            
            {/* Steel Saddle Support */}
            <mesh position={[0, 0.5, 0]} castShadow>
              <cylinderGeometry args={[0.35, 0.35, 0.25, 16]} />
              <meshStandardMaterial 
                color="#2C3E50" 
                metalness={0.85}
                roughness={0.15}
              />
            </mesh>
            
            {/* Support Saddle Cradle */}
            <mesh position={[0, 0.65, 0]} rotation={[0, 0, 0]} castShadow>
              <cylinderGeometry args={[0.38, 0.38, 0.15, 16, 1, false, 0, Math.PI]} />
              <meshStandardMaterial 
                color="#34495E" 
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
            
            {/* Anchor Bolts */}
            {Array.from({ length: 4 }, (_, j) => {
              const angle = (j * Math.PI) / 2;
              const bx = Math.cos(angle) * 0.3;
              const bz = Math.sin(angle) * 0.3;
              return (
                <mesh key={j} position={[bx, -0.3, bz]} castShadow>
                  <cylinderGeometry args={[0.02, 0.02, 0.6, 8]} />
                  <meshStandardMaterial 
                    color="#566573" 
                    metalness={0.9}
                    roughness={0.2}
                  />
                </mesh>
              );
            })}
          </group>
        );
      })}
      
      {/* Main Pipeline with Realistic Segments */}
      {Array.from({ length: 7 }, (_, i) => {
        const x = -6 + i * 2;
        const isJoint = i > 0;
        
        return (
          <group key={i} position={[x, 1.2, 0]}>
            {/* Main Pipe Segment */}
            <mesh
              ref={i === 3 ? meshRef : null}
              rotation={[0, 0, Math.PI / 2]}
              castShadow
              receiveShadow
            >
              <cylinderGeometry args={[0.3, 0.3, 2.0, 32]} />
              <meshStandardMaterial 
                color="#4A4A4A" 
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
            
            {/* Pipe Joint/Flange */}
            {isJoint && (
              <group position={[-1, 0, 0]}>
                <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
                  <cylinderGeometry args={[0.45, 0.45, 0.08, 32]} />
                  <meshStandardMaterial 
                    color="#2C3E50" 
                    metalness={0.85}
                    roughness={0.15}
                  />
                </mesh>
                
                {/* Flange Bolts */}
                {Array.from({ length: 8 }, (_, j) => {
                  const angle = (j * Math.PI) / 4;
                  const bx = Math.cos(angle) * 0.35;
                  const bz = Math.sin(angle) * 0.35;
                  return (
                    <mesh key={j} position={[0, bx, bz]} rotation={[0, 0, Math.PI / 2]} castShadow>
                      <cylinderGeometry args={[0.015, 0.015, 0.12, 8]} />
                      <meshStandardMaterial 
                        color="#1B2631" 
                        metalness={0.9}
                        roughness={0.15}
                      />
                    </mesh>
                  );
                })}
                
                {/* Gasket */}
                <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
                  <cylinderGeometry args={[0.32, 0.32, 0.02, 32]} />
                  <meshStandardMaterial 
                    color="#8B4513" 
                    metalness={0.1}
                    roughness={0.9}
                  />
                </mesh>
              </group>
            )}
            
            {/* Thermal Insulation */}
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.42, 0.42, 1.8, 24]} />
              <meshStandardMaterial 
                color="#D5DBDB" 
                metalness={0.1}
                roughness={0.9}
                transparent
                opacity={0.8}
              />
            </mesh>
            
            {/* Aluminum Cladding */}
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.45, 0.45, 1.8, 24]} />
              <meshStandardMaterial 
                color="#BDC3C7" 
                metalness={0.7}
                roughness={0.3}
              />
            </mesh>
            
            {/* Cladding Bands */}
            {Array.from({ length: 4 }, (_, band) => (
              <mesh key={band} position={[-0.8 + band * 0.4, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.46, 0.46, 0.03, 24]} />
                <meshStandardMaterial 
                  color="#85929E" 
                  metalness={0.8}
                  roughness={0.2}
                />
              </mesh>
            ))}
          </group>
        );
      })}
      
      {/* Pipeline Control Valves */}
      {Array.from({ length: 3 }, (_, i) => {
        const x = -3 + i * 3;
        const valveTypes = ['isolation', 'control', 'safety'];
        const valveType = valveTypes[i];
        
        return (
          <group key={i} position={[x, 1.2, 0]}>
            {/* Valve Body */}
            <mesh castShadow>
              <boxGeometry args={[0.8, 0.8, 0.8]} />
              <meshStandardMaterial 
                color={valveType === 'safety' ? "#E74C3C" : "#34495E"} 
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
            
            {/* Valve Stem */}
            <mesh position={[0, 0.6, 0]} castShadow>
              <cylinderGeometry args={[0.05, 0.05, 0.8, 12]} />
              <meshStandardMaterial 
                color="#566573" 
                metalness={0.9}
                roughness={0.15}
              />
            </mesh>
            
            {/* Actuator Housing */}
            <mesh position={[0, 1.2, 0]} castShadow>
              <cylinderGeometry args={[0.25, 0.25, 0.4, 12]} />
              <meshStandardMaterial 
                color="#2C3E50" 
                metalness={0.8}
                roughness={0.25}
              />
            </mesh>
            
            {/* Pneumatic Actuator */}
            {valveType === 'control' && (
              <group position={[0, 1.6, 0]}>
                <mesh castShadow>
                  <cylinderGeometry args={[0.2, 0.2, 0.3, 16]} />
                  <meshStandardMaterial 
                    color="#DC7633" 
                    metalness={0.7}
                    roughness={0.3}
                  />
                </mesh>
                
                {/* Air Lines */}
                <mesh position={[0.3, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
                  <cylinderGeometry args={[0.015, 0.015, 0.4, 8]} />
                  <meshStandardMaterial 
                    color="#F39C12" 
                    metalness={0.3}
                    roughness={0.7}
                  />
                </mesh>
              </group>
            )}
            
            {/* Manual Handwheel */}
            {valveType === 'isolation' && (
              <group position={[0, 1.8, 0]}>
                <mesh castShadow>
                  <cylinderGeometry args={[0.3, 0.3, 0.05, 16]} />
                  <meshStandardMaterial 
                    color="#566573" 
                    metalness={0.8}
                    roughness={0.3}
                  />
                </mesh>
                
                {/* Handwheel Spokes */}
                {Array.from({ length: 6 }, (_, spoke) => {
                  const angle = (spoke * Math.PI) / 3;
                  const sx = Math.cos(angle) * 0.2;
                  const sz = Math.sin(angle) * 0.2;
                  return (
                    <mesh key={spoke} position={[sx, 0, sz]} rotation={[0, angle, Math.PI / 2]} castShadow>
                      <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
                      <meshStandardMaterial 
                        color="#7F8C8D" 
                        metalness={0.8}
                        roughness={0.3}
                      />
                    </mesh>
                  );
                })}
              </group>
            )}
            
            {/* Position Indicator */}
            <mesh position={[0.5, 1.0, 0]} castShadow>
              <boxGeometry args={[0.15, 0.08, 0.02]} />
              <meshStandardMaterial 
                color="#F39C12" 
                metalness={0.2}
                roughness={0.8}
              />
            </mesh>
          </group>
        );
      })}
      
      {/* Pipeline Instrumentation */}
      {Array.from({ length: 4 }, (_, i) => {
        const x = -4.5 + i * 3;
        const instruments = ['pressure', 'flow', 'temperature', 'level'];
        const instrument = instruments[i];
        
        return (
          <group key={i} position={[x, 2.5, 0]}>
            {/* Instrument Tap */}
            <mesh position={[0, -0.6, 0]} castShadow>
              <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
              <meshStandardMaterial 
                color="#566573" 
                metalness={0.9}
                roughness={0.2}
              />
            </mesh>
            
            {/* Instrument Housing */}
            <mesh castShadow>
              <cylinderGeometry args={[0.12, 0.12, 0.2, 16]} />
              <meshStandardMaterial 
                color="#2C3E50" 
                metalness={0.8}
                roughness={0.25}
              />
            </mesh>
            
            {/* Display Face */}
            <mesh position={[0, 0.12, 0]} castShadow>
              <cylinderGeometry args={[0.1, 0.1, 0.02, 16]} />
              <meshStandardMaterial 
                color="#F8F9FA" 
                metalness={0.1}
                roughness={0.9}
              />
            </mesh>
            
            {/* Instrument Label */}
            <mesh position={[0, 0.25, 0]} castShadow>
              <boxGeometry args={[0.2, 0.05, 0.01]} />
              <meshStandardMaterial 
                color={instrument === 'pressure' ? '#E74C3C' : 
                       instrument === 'flow' ? '#3498DB' :
                       instrument === 'temperature' ? '#F39C12' : '#27AE60'} 
                metalness={0.1}
                roughness={0.9}
              />
            </mesh>
            
            {/* Signal Transmitter */}
            <mesh position={[0.2, 0, 0]} castShadow>
              <boxGeometry args={[0.08, 0.15, 0.06]} />
              <meshStandardMaterial 
                color="#34495E" 
                metalness={0.7}
                roughness={0.4}
              />
            </mesh>
            
            {/* Cable Conduit */}
            <mesh position={[0.3, 0, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
              <cylinderGeometry args={[0.015, 0.015, 0.5, 8]} />
              <meshStandardMaterial 
                color="#85929E" 
                metalness={0.3}
                roughness={0.7}
              />
            </mesh>
          </group>
        );
      })}
      
      {/* Emergency Shutdown System */}
      <group position={[4.0, 3.0, -1.8]}>
        {/* ESD Panel */}
        <mesh castShadow>
          <boxGeometry args={[0.6, 0.8, 0.15]} />
          <meshStandardMaterial 
            color="#C0392B" 
            metalness={0.3}
            roughness={0.8}
          />
        </mesh>
        
        {/* Emergency Stop Button */}
        <mesh position={[0, 0.2, 0.1]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.05, 16]} />
          <meshStandardMaterial 
            color="#E74C3C" 
            metalness={0.2}
            roughness={0.8}
          />
        </mesh>
        
        {/* Warning Light */}
        <mesh position={[0, -0.2, 0.1]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.03, 16]} />
          <meshStandardMaterial 
            color="#F39C12" 
            metalness={0.1}
            roughness={0.9}
            emissive="#F39C12"
            emissiveIntensity={isSelected ? 0.5 : 0.2}
          />
        </mesh>
        
        {/* Control Wiring */}
        <mesh position={[0, -0.5, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
          <meshStandardMaterial 
            color="#2C3E50" 
            metalness={0.1}
            roughness={0.9}
          />
        </mesh>
      </group>
      
      {/* Pipeline Markers and Signage */}
      {Array.from({ length: 3 }, (_, i) => {
        const x = -4 + i * 4;
        return (
          <group key={i} position={[x, 3.5, 0]}>
            {/* Mile Marker Post */}
            <mesh castShadow>
              <boxGeometry args={[0.08, 1.5, 0.08]} />
              <meshStandardMaterial 
                color="#F39C12" 
                metalness={0.2}
                roughness={0.8}
              />
            </mesh>
            
            {/* Marker Sign */}
            <mesh position={[0, 0.5, 0]} castShadow>
              <boxGeometry args={[0.3, 0.2, 0.02]} />
              <meshStandardMaterial 
                color="#FFFFFF" 
                metalness={0.1}
                roughness={0.9}
              />
            </mesh>
            
            {/* Reflective Strips */}
            <mesh position={[0, 0.5, 0.015]} castShadow>
              <boxGeometry args={[0.25, 0.15, 0.005]} />
              <meshStandardMaterial 
                color="#FFEB3B" 
                metalness={0.1}
                roughness={0.9}
                emissive="#FFEB3B"
                emissiveIntensity={0.1}
              />
            </mesh>
          </group>
        );
      })}
      
      {/* Expansion Joints */}
      {Array.from({ length: 2 }, (_, i) => {
        const x = -2 + i * 4;
        return (
          <group key={i} position={[x, 1.2, 0]}>
            {/* Expansion Bellows */}
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.35, 0.35, 0.6, 32]} />
              <meshStandardMaterial 
                color="#85929E" 
                metalness={0.9}
                roughness={0.1}
              />
            </mesh>
            
            {/* Bellows Convolutions */}
            {Array.from({ length: 5 }, (_, j) => (
              <mesh key={j} position={[-0.2 + j * 0.1, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <torusGeometry args={[0.37, 0.03, 8, 24]} />
                <meshStandardMaterial 
                  color="#566573" 
                  metalness={0.9}
                  roughness={0.15}
                />
              </mesh>
            ))}
            
            {/* Tie Rods */}
            {Array.from({ length: 4 }, (_, j) => {
              const angle = (j * Math.PI) / 2;
              const ty = Math.cos(angle) * 0.5;
              const tz = Math.sin(angle) * 0.5;
              return (
                <mesh key={j} position={[0, ty, tz]} rotation={[0, 0, Math.PI / 2]} castShadow>
                  <cylinderGeometry args={[0.01, 0.01, 0.8, 8]} />
                  <meshStandardMaterial 
                    color="#2C3E50" 
                    metalness={0.9}
                    roughness={0.2}
                  />
                </mesh>
              );
            })}
          </group>
        );
      })}
      
      {/* Cathodic Protection System */}
      {Array.from({ length: 2 }, (_, i) => {
        const x = -6 + i * 12;
        return (
          <group key={i} position={[x, 0.5, -1.5]}>
            {/* Test Station */}
            <mesh castShadow>
              <boxGeometry args={[0.3, 0.4, 0.2]} />
              <meshStandardMaterial 
                color="#F39C12" 
                metalness={0.3}
                roughness={0.8}
              />
            </mesh>
            
            {/* Ground Rod */}
            <mesh position={[0, -1.0, 0]} castShadow>
              <cylinderGeometry args={[0.015, 0.015, 2.0, 8]} />
              <meshStandardMaterial 
                color="#DC7633" 
                metalness={0.8}
                roughness={0.3}
              />
            </mesh>
            
            {/* Connection Cable */}
            <mesh position={[0.1, 0, 0.5]} rotation={[Math.PI / 4, 0, 0]} castShadow>
              <cylinderGeometry args={[0.008, 0.008, 0.8, 8]} />
              <meshStandardMaterial 
                color="#1A1A1A" 
                metalness={0.1}
                roughness={0.9}
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
      
      {isSelected && isDraggable && (
        <mesh position={[0, 6.0, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.3, 6]} />
          <meshLambertMaterial color="#ffeb3b" emissive="#ffeb3b" emissiveIntensity={0.3} />
        </mesh>
      )}
    </group>
  );
};

export default PipelineSystem; 