import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const RackSystem = ({ position, onClick, onDrag, isSelected, isDraggable, gridSnap, gridSize, onPortClick }) => {
  const meshRef = useRef();
  const groupRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [hoveredPort, setHoveredPort] = useState(null);
  const [dragStartPos, setDragStartPos] = useState(null);
  const { camera, gl } = useThree();

  const connectionPorts = [
    {
      id: 'conveyor_in',
      type: 'liquid',
      label: 'Conveyor Input',
      offset: [-6.0, 1.0, 0],
      direction: [-1, 0, 0],
      required: false
    },
    {
      id: 'electric_power',
      type: 'electric',
      label: 'Lighting & Systems',
      offset: [0, -0.5, -3.0],
      direction: [0, 0, -1],
      required: false
    },
    {
      id: 'fire_suppression',
      type: 'gas',
      label: 'Fire Suppression',
      offset: [0, 8.0, 0],
      direction: [0, 1, 0],
      required: false
    }
  ];

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
      
      if (!hasMovedMouse) {
        hasMovedMouse = true;
        setIsDragging(true);
      }
      
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
      
      mouse.x = (moveEvent.clientX / gl.domElement.clientWidth) * 2 - 1;
      mouse.y = -(moveEvent.clientY / gl.domElement.clientHeight) * 2 + 1;
      
      raycaster.setFromCamera(mouse, camera);
      
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const intersection = new THREE.Vector3();
      
      if (raycaster.ray.intersectPlane(plane, intersection)) {
        const snappedX = snapToGrid(intersection.x);
        const snappedZ = snapToGrid(intersection.z);
        const newPosition = [snappedX, position[1], snappedZ];
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
      {isDragging && gridSnap && (
        <>
          <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[6.0, 6.5, 16]} />
            <meshBasicMaterial color="#ffeb3b" transparent opacity={0.3} />
          </mesh>
          
          <mesh position={[0, 9, 0]}>
            <sphereGeometry args={[0.05]} />
            <meshBasicMaterial color="#ffeb3b" />
          </mesh>
        </>
      )}
      
      <mesh
        position={[0, 3.5, 0]}
        onPointerDown={handlePointerDown}
        visible={false}
      >
        <boxGeometry args={[13, 10, 7]} />
      </mesh>
      
      {/* Professional Reinforced Concrete Foundation System */}
      {Array.from({ length: 4 }, (_, i) => {
        const x = (i % 2) * 10 - 5;
        const z = Math.floor(i / 2) * 4 - 2;
        return (
          <group key={i} position={[x, -0.9, z]}>
            {/* Main Foundation Pad with Realistic Concrete Texture */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[2.2, 0.6, 2.2]} />
              <meshStandardMaterial 
                color="#5D6D7E" 
                metalness={0.05}
                roughness={0.95}
              />
            </mesh>
            
            {/* Foundation Chamfer Edges */}
            {Array.from({ length: 4 }, (_, edge) => {
              const angle = (edge * Math.PI) / 2;
              const ex = Math.cos(angle) * 1.1;
              const ez = Math.sin(angle) * 1.1;
              return (
                <mesh key={edge} position={[ex, 0.35, ez]} rotation={[0, angle, Math.PI / 4]} castShadow>
                  <boxGeometry args={[0.08, 0.08, 0.6]} />
                  <meshStandardMaterial 
                    color="#6C7B7F" 
                    metalness={0.05}
                    roughness={0.9}
                  />
                </mesh>
              );
            })}
            
            {/* High-Strength Anchor Bolt Assembly */}
            {Array.from({ length: 4 }, (_, j) => {
              const ax = (j % 2) * 1.4 - 0.7;
              const az = Math.floor(j / 2) * 1.4 - 0.7;
              return (
                <group key={j} position={[ax, 0.35, az]}>
                  {/* Main Anchor Bolt (Threaded) */}
                  <mesh castShadow>
                    <cylinderGeometry args={[0.06, 0.06, 0.5, 12]} />
                    <meshStandardMaterial 
                      color="#2C3E50" 
                      metalness={0.9}
                      roughness={0.15}
                    />
                  </mesh>
                  
                  {/* Hex Nut */}
                  <mesh position={[0, 0.3, 0]} castShadow>
                    <cylinderGeometry args={[0.08, 0.08, 0.04, 6]} />
                    <meshStandardMaterial 
                      color="#1B2631" 
                      metalness={0.9}
                      roughness={0.2}
                    />
                  </mesh>
                  
                  {/* Washer */}
                  <mesh position={[0, 0.26, 0]} castShadow>
                    <cylinderGeometry args={[0.09, 0.09, 0.02, 16]} />
                    <meshStandardMaterial 
                      color="#566573" 
                      metalness={0.8}
                      roughness={0.3}
                    />
                  </mesh>
                  
                  {/* Bolt Threading Pattern (Visual Detail) */}
                  {Array.from({ length: 8 }, (_, thread) => (
                    <mesh key={thread} position={[0, -0.15 + thread * 0.05, 0]} castShadow>
                      <torusGeometry args={[0.062, 0.005, 6, 12]} />
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
            
            {/* Rebar Reinforcement Grid (Visible at Edges) */}
            {Array.from({ length: 6 }, (_, j) => (
              <mesh key={j} position={[0, 0.25, 0]} rotation={[0, (j * Math.PI) / 3, 0]} castShadow>
                <boxGeometry args={[2.4, 0.025, 0.025]} />
                <meshStandardMaterial 
                  color="#4A4A4A" 
                  metalness={0.7}
                  roughness={0.4}
                />
              </mesh>
            ))}
            
            {/* Foundation Drainage Channels */}
            {Array.from({ length: 2 }, (_, drain) => {
              const dx = drain * 2.2 - 1.1;
              return (
                <mesh key={drain} position={[dx, 0.32, 0]} castShadow>
                  <boxGeometry args={[0.05, 0.03, 2.0]} />
                  <meshStandardMaterial 
                    color="#2C3E50" 
                    metalness={0.6}
                    roughness={0.8}
                  />
                </mesh>
              );
            })}
            
            {/* Foundation ID Plate */}
            <mesh position={[0.8, 0.32, 0.8]} castShadow>
              <boxGeometry args={[0.25, 0.02, 0.15]} />
              <meshStandardMaterial 
                color="#F4D03F" 
                metalness={0.1}
                roughness={0.9}
              />
            </mesh>
          </group>
        );
      })}

      {/* Industrial Heavy-Duty Steel Column System */}
      {Array.from({ length: 4 }, (_, i) => {
        const x = (i % 2) * 10 - 5;
        const z = Math.floor(i / 2) * 4 - 2;
        return (
          <group key={i} position={[x, 4.0, z]}>
            {/* Main Structural Column (C-Channel Design) */}
            <mesh
              ref={i === 0 ? meshRef : null}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[0.35, 8.0, 0.35]} />
              <meshStandardMaterial 
                color="#1C2833" 
                metalness={0.85}
                roughness={0.12}
              />
            </mesh>
            
            {/* Column Web Reinforcement */}
            <mesh position={[0, 0, 0]} castShadow>
              <boxGeometry args={[0.15, 8.0, 0.35]} />
              <meshStandardMaterial 
                color="#273746" 
                metalness={0.8}
                roughness={0.15}
              />
            </mesh>
            
            {/* Steel I-Beam Flanges */}
            <mesh position={[0.12, 0, 0]} castShadow>
              <boxGeometry args={[0.08, 8.0, 0.4]} />
              <meshStandardMaterial 
                color="#1C2833" 
                metalness={0.85}
                roughness={0.12}
              />
            </mesh>
            <mesh position={[-0.12, 0, 0]} castShadow>
              <boxGeometry args={[0.08, 8.0, 0.4]} />
              <meshStandardMaterial 
                color="#1C2833" 
                metalness={0.85}
                roughness={0.12}
              />
            </mesh>
            
            {/* Weld Seams (Realistic Detail) */}
            {Array.from({ length: 8 }, (_, weld) => (
              <mesh key={weld} position={[0.18, -3.5 + weld, 0]} castShadow>
                <boxGeometry args={[0.02, 0.05, 0.35]} />
                <meshStandardMaterial 
                  color="#5D6D7E" 
                  metalness={0.7}
                  roughness={0.4}
                />
              </mesh>
            ))}
            
            {/* Professional Reinforcement Plates */}
            {Array.from({ length: 5 }, (_, j) => (
              <group key={j} position={[0, -3.5 + j * 2, 0]}>
                <mesh castShadow>
                  <boxGeometry args={[0.55, 0.15, 0.55]} />
                  <meshStandardMaterial 
                    color="#2C3E50" 
                    metalness={0.82}
                    roughness={0.18}
                  />
                </mesh>
                
                {/* Gusset Plates */}
                {Array.from({ length: 4 }, (_, gusset) => {
                  const angle = (gusset * Math.PI) / 2;
                  const gx = Math.cos(angle) * 0.25;
                  const gz = Math.sin(angle) * 0.25;
                  return (
                    <mesh key={gusset} position={[gx, 0, gz]} rotation={[0, angle, Math.PI / 4]} castShadow>
                      <boxGeometry args={[0.15, 0.18, 0.08]} />
                      <meshStandardMaterial 
                        color="#34495E" 
                        metalness={0.8}
                        roughness={0.25}
                      />
                    </mesh>
                  );
                })}
                
                {/* Reinforcement Bolts */}
                {Array.from({ length: 8 }, (_, bolt) => {
                  const bAngle = (bolt * Math.PI) / 4;
                  const bx = Math.cos(bAngle) * 0.2;
                  const bz = Math.sin(bAngle) * 0.2;
                  return (
                    <mesh key={bolt} position={[bx, 0, bz]} castShadow>
                      <cylinderGeometry args={[0.015, 0.015, 0.18, 8]} />
                      <meshStandardMaterial 
                        color="#566573" 
                        metalness={0.9}
                        roughness={0.15}
                      />
                    </mesh>
                  );
                })}
              </group>
            ))}
            
            {/* Industrial Beam Connection Assemblies */}
            {Array.from({ length: 4 }, (_, j) => {
              const height = -2.5 + j * 2;
              return (
                <group key={j} position={[0, height, 0]}>
                  {/* Heavy-Duty Connection Brackets */}
                  {Array.from({ length: 4 }, (_, side) => {
                    const angle = (side * Math.PI) / 2;
                    const bx = Math.cos(angle) * 0.3;
                    const bz = Math.sin(angle) * 0.3;
                    return (
                      <group key={side} position={[bx, 0, bz]} rotation={[0, angle, 0]}>
                        <mesh castShadow>
                          <boxGeometry args={[0.25, 0.25, 0.12]} />
                          <meshStandardMaterial 
                            color="#7F8C8D" 
                            metalness={0.75}
                            roughness={0.35}
                          />
                        </mesh>
                        
                        {/* Connection Slots */}
                        {Array.from({ length: 3 }, (_, slot) => (
                          <mesh key={slot} position={[0, -0.08 + slot * 0.08, 0.08]} castShadow>
                            <boxGeometry args={[0.15, 0.025, 0.06]} />
                            <meshStandardMaterial 
                              color="#2C3E50" 
                              metalness={0.9}
                              roughness={0.1}
                            />
                          </mesh>
                        ))}
                        
                        {/* High-Tensile Bolts */}
                        {Array.from({ length: 6 }, (_, bolt) => {
                          const by = -0.1 + (bolt % 3) * 0.1;
                          const bx = (bolt < 3) ? -0.08 : 0.08;
                          return (
                            <mesh key={bolt} position={[bx, by, 0.08]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                              <cylinderGeometry args={[0.012, 0.012, 0.15, 8]} />
                              <meshStandardMaterial 
                                color="#1B2631" 
                                metalness={0.9}
                                roughness={0.15}
                              />
                            </mesh>
                          );
                        })}
                      </group>
                    );
                  })}
                </group>
              );
            })}
            
            {/* Professional Industrial Signage System */}
            <group position={[0, 2.2, 0.2]}>
              {/* Load Capacity Certification Plate */}
              <mesh castShadow>
                <boxGeometry args={[0.5, 0.35, 0.025]} />
                <meshStandardMaterial 
                  color="#F1C40F" 
                  metalness={0.15}
                  roughness={0.85}
                />
              </mesh>
              
              {/* Safety Border */}
              <mesh position={[0, 0, 0.015]} castShadow>
                <boxGeometry args={[0.48, 0.33, 0.005]} />
                <meshStandardMaterial 
                  color="#D68910" 
                  metalness={0.2}
                  roughness={0.8}
                />
              </mesh>
              
              {/* Text Fields */}
              <mesh position={[0, 0.1, 0.02]} castShadow>
                <boxGeometry args={[0.4, 0.08, 0.002]} />
                <meshStandardMaterial 
                  color="#1A1A1A" 
                  metalness={0.1}
                  roughness={0.9}
                />
              </mesh>
              
              {/* Capacity Numbers */}
              <mesh position={[0, 0, 0.02]} castShadow>
                <boxGeometry args={[0.35, 0.12, 0.002]} />
                <meshStandardMaterial 
                  color="#C0392B" 
                  metalness={0.1}
                  roughness={0.9}
                />
              </mesh>
              
              {/* Safety Symbols */}
              <mesh position={[0, -0.12, 0.02]} castShadow>
                <boxGeometry args={[0.25, 0.06, 0.002]} />
                <meshStandardMaterial 
                  color="#1A1A1A" 
                  metalness={0.1}
                  roughness={0.9}
                />
              </mesh>
            </group>
            
            {/* OSHA Safety Information Panel */}
            <mesh position={[0, 1.6, 0.2]} castShadow>
              <boxGeometry args={[0.4, 0.2, 0.02]} />
              <meshStandardMaterial 
                color="#E74C3C" 
                metalness={0.1}
                roughness={0.9}
              />
            </mesh>
            
            {/* Warning Symbols */}
            <mesh position={[0, 1.6, 0.22]} castShadow>
              <boxGeometry args={[0.35, 0.15, 0.005]} />
              <meshStandardMaterial 
                color="#FFFFFF" 
                metalness={0.1}
                roughness={0.9}
              />
            </mesh>
            
            {/* Professional Column Cap Assembly */}
            <group position={[0, 4.2, 0]}>
              <mesh castShadow>
                <boxGeometry args={[0.6, 0.2, 0.6]} />
                <meshStandardMaterial 
                  color="#34495E" 
                  metalness={0.85}
                  roughness={0.2}
                />
              </mesh>
              
              {/* Cap Reinforcement Ribs */}
              {Array.from({ length: 4 }, (_, rib) => {
                const rAngle = (rib * Math.PI) / 2;
                const rx = Math.cos(rAngle) * 0.25;
                const rz = Math.sin(rAngle) * 0.25;
                return (
                  <mesh key={rib} position={[rx, 0, rz]} rotation={[0, rAngle, 0]} castShadow>
                    <boxGeometry args={[0.35, 0.25, 0.08]} />
                    <meshStandardMaterial 
                      color="#2C3E50" 
                      metalness={0.8}
                      roughness={0.25}
                    />
                  </mesh>
                );
              })}
              
              {/* Lightning Protection Point */}
              <mesh position={[0, 0.15, 0]} castShadow>
                <coneGeometry args={[0.03, 0.1, 8]} />
                <meshStandardMaterial 
                  color="#D68910" 
                  metalness={0.8}
                  roughness={0.2}
                />
              </mesh>
            </group>
            
            {/* Industrial Base Plate Assembly */}
            <group position={[0, -4.15, 0]}>
              <mesh castShadow>
                <boxGeometry args={[0.8, 0.15, 0.8]} />
                <meshStandardMaterial 
                  color="#566573" 
                  metalness={0.85}
                  roughness={0.25}
                />
              </mesh>
              
              {/* Base Plate Reinforcement Gussets */}
              {Array.from({ length: 4 }, (_, gusset) => {
                const gAngle = (gusset * Math.PI) / 2;
                const gx = Math.cos(gAngle) * 0.35;
                const gz = Math.sin(gAngle) * 0.35;
                return (
                  <mesh key={gusset} position={[gx, 0.1, gz]} rotation={[0, gAngle, Math.PI / 6]} castShadow>
                    <boxGeometry args={[0.15, 0.2, 0.08]} />
                    <meshStandardMaterial 
                      color="#4A4A4A" 
                      metalness={0.8}
                      roughness={0.3}
                    />
                  </mesh>
                );
              })}
              
              {/* Leveling Adjustments */}
              {Array.from({ length: 4 }, (_, adj) => {
                const aAngle = (adj * Math.PI) / 2 + Math.PI / 4;
                const ax = Math.cos(aAngle) * 0.3;
                const az = Math.sin(aAngle) * 0.3;
                return (
                  <mesh key={adj} position={[ax, -0.1, az]} castShadow>
                    <cylinderGeometry args={[0.025, 0.025, 0.1, 8]} />
                    <meshStandardMaterial 
                      color="#DC7633" 
                      metalness={0.9}
                      roughness={0.15}
                    />
                  </mesh>
                );
              })}
              
              {/* Grout Pocket */}
              <mesh position={[0, -0.1, 0]} castShadow>
                <cylinderGeometry args={[0.25, 0.25, 0.08, 16]} />
                <meshStandardMaterial 
                  color="#7D6608" 
                  metalness={0.1}
                  roughness={0.9}
                />
              </mesh>
            </group>
            
            {/* Environmental Protection Coating (Wear Marks) */}
            {Array.from({ length: 3 }, (_, wear) => (
              <mesh key={wear} position={[0.18, -2 + wear * 2, 0]} castShadow>
                <boxGeometry args={[0.01, 0.5, 0.35]} />
                <meshStandardMaterial 
                  color="#85929E" 
                  metalness={0.6}
                  roughness={0.7}
                />
              </mesh>
            ))}
          </group>
        );
      })}
      
      {/* Professional Storage Beams (4 levels) */}
      {Array.from({ length: 4 }, (_, level) => {
        const height = -2.5 + level * 2;
        return (
          <group key={level}>
            {/* Front-to-Back Load Beams (Depth Direction) */}
            {Array.from({ length: 2 }, (_, i) => {
              const x = i * 10 - 5;
              return (
                <group key={i}>
                  {/* Main Load Beam (Step Beam Design) */}
                  <mesh position={[x, height, 0]} castShadow>
                    <boxGeometry args={[0.25, 0.3, 4.0]} />
                    <meshStandardMaterial 
                      color="#566573" 
                      metalness={0.8}
                      roughness={0.2}
                    />
                  </mesh>
                  
                  {/* Beam Flange (Top) */}
                  <mesh position={[x, height + 0.2, 0]} castShadow>
                    <boxGeometry args={[0.4, 0.08, 4.0]} />
                    <meshStandardMaterial 
                      color="#5D6D7E" 
                      metalness={0.8}
                      roughness={0.25}
                    />
                  </mesh>
                  
                  {/* Beam Flange (Bottom) */}
                  <mesh position={[x, height - 0.2, 0]} castShadow>
                    <boxGeometry args={[0.35, 0.06, 4.0]} />
                    <meshStandardMaterial 
                      color="#5D6D7E" 
                      metalness={0.8}
                      roughness={0.25}
                    />
                  </mesh>
                  
                  {/* Safety Stops/Pallet Stops */}
                  <mesh position={[x, height + 0.35, 2.1]} castShadow>
                    <boxGeometry args={[0.4, 0.15, 0.08]} />
                    <meshStandardMaterial 
                      color="#E74C3C" 
                      metalness={0.2}
                      roughness={0.8}
                    />
                  </mesh>
                  <mesh position={[x, height + 0.35, -2.1]} castShadow>
                    <boxGeometry args={[0.4, 0.15, 0.08]} />
                    <meshStandardMaterial 
                      color="#E74C3C" 
                      metalness={0.2}
                      roughness={0.8}
                    />
                  </mesh>
                  
                  {/* Beam Connection Hardware */}
                  {Array.from({ length: 2 }, (_, j) => {
                    const z = j * 4 - 2;
                    return (
                      <mesh key={j} position={[x, height, z]} castShadow>
                        <boxGeometry args={[0.3, 0.4, 0.15]} />
                        <meshStandardMaterial 
                          color="#85929E" 
                          metalness={0.7}
                          roughness={0.4}
                        />
                      </mesh>
                    );
                  })}
                </group>
              );
            })}
            
            {/* Cross Beams (Width Direction) */}
            {Array.from({ length: 3 }, (_, i) => {
              const z = (i - 1) * 2;
              return (
                <group key={i}>
                  {/* Main Cross Beam */}
                  <mesh position={[0, height, z]} castShadow>
                    <boxGeometry args={[10.0, 0.25, 0.25]} />
                    <meshStandardMaterial 
                      color="#7F8C8D" 
                      metalness={0.8}
                      roughness={0.2}
                    />
                  </mesh>
                  
                  {/* Cross Beam Flanges */}
                  <mesh position={[0, height + 0.18, z]} castShadow>
                    <boxGeometry args={[10.0, 0.06, 0.35]} />
                    <meshStandardMaterial 
                      color="#85929E" 
                      metalness={0.8}
                      roughness={0.25}
                    />
                  </mesh>
                  
                  {/* Wire Mesh Support Channels */}
                  {Array.from({ length: 5 }, (_, k) => (
                    <mesh key={k} position={[-4 + k * 2, height + 0.25, z]} castShadow>
                      <boxGeometry args={[0.05, 0.08, 0.4]} />
                      <meshStandardMaterial 
                        color="#BDC3C7" 
                        metalness={0.8}
                        roughness={0.4}
                      />
                    </mesh>
                  ))}
                </group>
              );
            })}
            
            {/* Professional Wire Mesh Decking */}
            <group position={[0, height + 0.18, 0]}>
              {/* Main Decking Surface */}
              <mesh castShadow receiveShadow>
                <boxGeometry args={[9.8, 0.03, 3.8]} />
                <meshStandardMaterial 
                  color="#AEB6BF" 
                  metalness={0.7}
                  roughness={0.4}
                  transparent
                  opacity={0.9}
                />
              </mesh>
              
              {/* Wire Grid Pattern */}
              {Array.from({ length: 10 }, (_, k) => (
                <mesh key={k} position={[-4.5 + k * 1, 0.02, 0]} castShadow>
                  <boxGeometry args={[0.02, 0.02, 3.8]} />
                  <meshStandardMaterial 
                    color="#95A5A6" 
                    metalness={0.8}
                    roughness={0.3}
                  />
                </mesh>
              ))}
              {Array.from({ length: 8 }, (_, k) => (
                <mesh key={k} position={[0, 0.02, -1.75 + k * 0.5]} castShadow>
                  <boxGeometry args={[9.8, 0.02, 0.02]} />
                  <meshStandardMaterial 
                    color="#95A5A6" 
                    metalness={0.8}
                    roughness={0.3}
                  />
                </mesh>
              ))}
            </group>
            
            {/* Level Identification and Safety Tags */}
            <group position={[-5.3, height + 0.4, 0]}>
              <mesh rotation={[0, Math.PI / 2, 0]} castShadow>
                <boxGeometry args={[0.2, 0.15, 0.03]} />
                <meshStandardMaterial 
                  color="#3498DB" 
                  metalness={0.1}
                  roughness={0.9}
                />
              </mesh>
              {/* Level Number Display */}
              <mesh position={[0, 0, 0.02]} rotation={[0, Math.PI / 2, 0]} castShadow>
                <boxGeometry args={[0.15, 0.1, 0.01]} />
                <meshStandardMaterial 
                  color="#FFFFFF" 
                  metalness={0.1}
                  roughness={0.9}
                />
              </mesh>
            </group>
            
            {/* Load Capacity Signs */}
            <mesh position={[5.3, height + 0.4, 0]} rotation={[0, -Math.PI / 2, 0]} castShadow>
              <boxGeometry args={[0.25, 0.12, 0.02]} />
              <meshStandardMaterial 
                color="#F39C12" 
                metalness={0.1}
                roughness={0.9}
              />
            </mesh>
          </group>
        );
      })}
      
      {/* Diagonal Cross Bracing for Stability */}
      {Array.from({ length: 2 }, (_, side) => {
        const x = side * 10 - 5;
        return (
          <group key={side}>
            {/* Vertical Cross Braces */}
            {Array.from({ length: 3 }, (_, i) => {
              const direction = i % 2 === 0 ? 1 : -1;
              const yPos = 1.0 + i * 2.5;
              return (
                <mesh 
                  key={i}
                  position={[x, yPos, direction * 1.2]}
                  rotation={[0, 0, direction * Math.PI / 8]}
                  castShadow
                >
                  <cylinderGeometry args={[0.04, 0.04, 5.0, 8]} />
                  <meshStandardMaterial 
                    color="#566573" 
                    metalness={0.8}
                    roughness={0.3}
                  />
                </mesh>
              );
            })}
          </group>
        );
      })}
      
      {/* Forklift Guide Rails and Safety System */}
      {Array.from({ length: 2 }, (_, i) => {
        const x = (i - 0.5) * 9;
        return (
          <group key={i} position={[x, 0.6, 3.2]}>
            {/* Main Guide Post */}
            <mesh castShadow>
              <cylinderGeometry args={[0.08, 0.08, 1.8, 8]} />
              <meshStandardMaterial 
                color="#F39C12" 
                metalness={0.6}
                roughness={0.4}
              />
            </mesh>
            
            {/* Reflective Safety Strips */}
            {Array.from({ length: 3 }, (_, j) => (
              <mesh key={j} position={[0, -0.6 + j * 0.6, 0]} castShadow>
                <cylinderGeometry args={[0.085, 0.085, 0.2, 8]} />
                <meshStandardMaterial 
                  color="#FFEB3B" 
                  metalness={0.1}
                  roughness={0.9}
                  emissive="#FFEB3B"
                  emissiveIntensity={0.15}
                />
              </mesh>
            ))}
          </group>
        );
      })}
      
      {/* Industrial LED Lighting System */}
      <group position={[0, 7.5, 0]}>
        {/* High-Bay LED Fixtures */}
        {Array.from({ length: 4 }, (_, i) => {
          const x = -4.5 + i * 3;
          return (
            <group key={i} position={[x, 0, 0]}>
              {/* Fixture Housing */}
              <mesh castShadow>
                <boxGeometry args={[1.5, 0.25, 0.4]} />
                <meshStandardMaterial 
                  color="#34495E" 
                  metalness={0.3}
                  roughness={0.8}
                />
              </mesh>
              
              {/* LED Array */}
              <mesh position={[0, -0.2, 0]} castShadow>
                <boxGeometry args={[1.4, 0.08, 0.35]} />
                <meshStandardMaterial 
                  color="#F8F9FA" 
                  metalness={0.1}
                  roughness={0.9}
                  emissive="#FFFFFF"
                  emissiveIntensity={isSelected ? 0.4 : 0.2}
                />
              </mesh>
            </group>
          );
        })}
      </group>
      
      {/* Fire Suppression System */}
      <group position={[0, 7.2, 0]}>
        {/* Sprinkler Heads */}
        {Array.from({ length: 6 }, (_, i) => {
          const x = -5 + i * 2;
          return (
            <group key={i} position={[x, 0, 0]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.025, 0.025, 0.3, 8]} />
                <meshStandardMaterial 
                  color="#DC7633" 
                  metalness={0.8}
                  roughness={0.3}
                />
              </mesh>
              
              {/* Sprinkler Head */}
              <mesh position={[0, -0.2, 0]} castShadow>
                <sphereGeometry args={[0.04, 8, 8]} />
                <meshStandardMaterial 
                  color="#E74C3C" 
                  metalness={0.7}
                  roughness={0.4}
                />
              </mesh>
            </group>
          );
        })}
      </group>
      
      {/* Safety Signage */}
      <group position={[-5.8, 3.0, 2.8]}>
        <mesh castShadow>
          <boxGeometry args={[0.6, 0.8, 0.05]} />
          <meshStandardMaterial 
            color="#F39C12" 
            metalness={0.1}
            roughness={0.9}
          />
        </mesh>
      </group>
      
      {/* Advanced Warehouse Management System Terminal */}
      <group position={[-5.8, 1.2, 2.8]}>
        {/* Terminal Mounting Bracket */}
        <mesh position={[0, 0, -0.1]} castShadow>
          <boxGeometry args={[0.5, 0.7, 0.08]} />
          <meshStandardMaterial 
            color="#566573" 
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
        
        {/* Main Terminal Housing */}
        <mesh castShadow>
          <boxGeometry args={[0.45, 0.65, 0.18]} />
          <meshStandardMaterial 
            color="#1C2833" 
            metalness={0.4}
            roughness={0.7}
          />
        </mesh>
        
        {/* Terminal Bezel */}
        <mesh position={[0, 0, 0.1]} castShadow>
          <boxGeometry args={[0.48, 0.68, 0.05]} />
          <meshStandardMaterial 
            color="#2C3E50" 
            metalness={0.3}
            roughness={0.8}
          />
        </mesh>
        
        {/* High-Resolution Touchscreen Display */}
        <mesh position={[0, 0.08, 0.12]} castShadow>
          <boxGeometry args={[0.35, 0.28, 0.025]} />
          <meshStandardMaterial 
            color="#0A0A0A" 
            metalness={0.15}
            roughness={0.85}
            emissive="#00FF41"
            emissiveIntensity={0.4}
          />
        </mesh>
        
        {/* Screen Protective Glass */}
        <mesh position={[0, 0.08, 0.135]} castShadow>
          <boxGeometry args={[0.36, 0.29, 0.008]} />
          <meshStandardMaterial 
            color="#F8F9FA" 
            metalness={0.1}
            roughness={0.1}
            transparent
            opacity={0.1}
          />
        </mesh>
        
        {/* Interface Elements on Screen */}
        <group position={[0, 0.08, 0.137]}>
          {/* Menu Buttons */}
          {Array.from({ length: 4 }, (_, btn) => (
            <mesh key={btn} position={[-0.12 + btn * 0.08, 0.08, 0]} castShadow>
              <boxGeometry args={[0.05, 0.03, 0.001]} />
              <meshStandardMaterial 
                color="#3498DB" 
                metalness={0.1}
                roughness={0.9}
                emissive="#3498DB"
                emissiveIntensity={0.2}
              />
            </mesh>
          ))}
          
          {/* Status Indicators */}
          {Array.from({ length: 3 }, (_, status) => (
            <mesh key={status} position={[0.1, -0.05 + status * 0.04, 0]} castShadow>
              <cylinderGeometry args={[0.008, 0.008, 0.002, 8]} />
              <meshStandardMaterial 
                color={status === 0 ? "#27AE60" : status === 1 ? "#F39C12" : "#E74C3C"} 
                metalness={0.1}
                roughness={0.9}
                emissive={status === 0 ? "#27AE60" : status === 1 ? "#F39C12" : "#E74C3C"}
                emissiveIntensity={0.4}
              />
            </mesh>
          ))}
        </group>
        
        {/* Control Panel Section */}
        <mesh position={[0, -0.18, 0.12]} castShadow>
          <boxGeometry args={[0.42, 0.25, 0.02]} />
          <meshStandardMaterial 
            color="#34495E" 
            metalness={0.4}
            roughness={0.7}
          />
        </mesh>
        
        {/* Professional Barcode Scanner */}
        <group position={[0, -0.25, 0.18]}>
          <mesh castShadow>
            <boxGeometry args={[0.22, 0.15, 0.12]} />
            <meshStandardMaterial 
              color="#DC7633" 
              metalness={0.3}
              roughness={0.7}
            />
          </mesh>
          
          {/* Scanner Window */}
          <mesh position={[0, 0, 0.07]} castShadow>
            <boxGeometry args={[0.18, 0.08, 0.02]} />
            <meshStandardMaterial 
              color="#1A1A1A" 
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
          
          {/* Laser Line */}
          <mesh position={[0, 0, 0.08]} castShadow>
            <boxGeometry args={[0.15, 0.002, 0.001]} />
            <meshStandardMaterial 
              color="#FF0000" 
              metalness={0.1}
              roughness={0.9}
              emissive="#FF0000"
              emissiveIntensity={0.6}
            />
          </mesh>
          
          {/* Scanner Trigger */}
          <mesh position={[0, -0.1, 0.04]} rotation={[Math.PI / 6, 0, 0]} castShadow>
            <boxGeometry args={[0.08, 0.06, 0.02]} />
            <meshStandardMaterial 
              color="#2C3E50" 
              metalness={0.2}
              roughness={0.8}
            />
          </mesh>
        </group>
        
        {/* Industrial Control Buttons */}
        {Array.from({ length: 6 }, (_, btn) => {
          const bx = -0.15 + (btn % 3) * 0.15;
          const by = -0.12 + Math.floor(btn / 3) * 0.08;
          const colors = ['#27AE60', '#E74C3C', '#3498DB', '#F39C12', '#9B59B6', '#95A5A6'];
          return (
            <mesh key={btn} position={[bx, by, 0.135]} castShadow>
              <cylinderGeometry args={[0.025, 0.025, 0.025, 8]} />
              <meshStandardMaterial 
                color={colors[btn]} 
                metalness={0.2}
                roughness={0.8}
                emissive={colors[btn]}
                emissiveIntensity={0.1}
              />
            </mesh>
          );
        })}
        
        {/* Emergency Stop Button */}
        <mesh position={[0.15, -0.05, 0.14]} castShadow>
          <cylinderGeometry args={[0.035, 0.035, 0.04, 8]} />
          <meshStandardMaterial 
            color="#C0392B" 
            metalness={0.2}
            roughness={0.8}
          />
        </mesh>
        
        {/* Key Switch */}
        <mesh position={[-0.15, -0.05, 0.13]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.03, 8]} />
          <meshStandardMaterial 
            color="#566573" 
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
        
        {/* RFID Badge Reader */}
        <mesh position={[0.15, 0.2, 0.12]} castShadow>
          <boxGeometry args={[0.08, 0.12, 0.025]} />
          <meshStandardMaterial 
            color="#1A1A1A" 
            metalness={0.2}
            roughness={0.8}
          />
        </mesh>
        
        {/* Card Reader LED */}
        <mesh position={[0.15, 0.24, 0.135]} castShadow>
          <cylinderGeometry args={[0.008, 0.008, 0.005, 8]} />
          <meshStandardMaterial 
            color="#27AE60" 
            metalness={0.1}
            roughness={0.9}
            emissive="#27AE60"
            emissiveIntensity={0.5}
          />
        </mesh>
        
        {/* Network Indicator Lights */}
        {Array.from({ length: 4 }, (_, led) => (
          <mesh key={led} position={[-0.15 + led * 0.03, -0.25, 0.135]} castShadow>
            <cylinderGeometry args={[0.005, 0.005, 0.003, 8]} />
            <meshStandardMaterial 
              color={led < 2 ? "#27AE60" : "#3498DB"} 
              metalness={0.1}
              roughness={0.9}
              emissive={led < 2 ? "#27AE60" : "#3498DB"}
              emissiveIntensity={0.4}
            />
          </mesh>
        ))}
        
        {/* Cable Management */}
        <mesh position={[0, -0.35, 0]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.3, 8]} />
          <meshStandardMaterial 
            color="#2C3E50" 
            metalness={0.1}
            roughness={0.9}
          />
        </mesh>
        
        {/* Terminal Nameplate */}
        <mesh position={[0, -0.3, 0.12]} castShadow>
          <boxGeometry args={[0.25, 0.06, 0.008]} />
          <meshStandardMaterial 
            color="#D5DBDB" 
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        
        {/* Environmental Protection (Weathering Effects) */}
        <mesh position={[0.2, 0, 0.1]} castShadow>
          <boxGeometry args={[0.02, 0.6, 0.15]} />
          <meshStandardMaterial 
            color="#85929E" 
            metalness={0.5}
            roughness={0.8}
          />
        </mesh>
      </group>
      
      {/* Ultra-Realistic Warehouse Inventory System */}
      {Array.from({ length: 16 }, (_, i) => {
        const level = Math.floor(i / 8);
        const position_in_level = i % 8;
        const x = -3.5 + (position_in_level % 4) * 1.8;
        const z = (Math.floor(position_in_level / 4) - 0.5) * 2.0;
        const y = -1.3 + level * 2 + 0.8;
        const shouldShow = Math.random() > 0.25; // 75% occupancy rate
        
        if (!shouldShow) return null;
        
        // Define realistic product categories
        const productTypes = [
          { 
            name: 'Electronics', 
            colors: ['#2C3E50', '#34495E', '#1A1A1A'], 
            sizes: [[1.0, 0.3, 0.7], [0.8, 0.25, 0.5], [1.1, 0.35, 0.6]],
            labels: ['FRAGILE', 'ELECTRONICS', 'THIS SIDE UP']
          },
          { 
            name: 'Automotive', 
            colors: ['#8D6E63', '#A1887F', '#795548'], 
            sizes: [[1.2, 0.4, 0.8], [1.0, 0.35, 0.7], [1.1, 0.3, 0.9]],
            labels: ['AUTO PARTS', 'HEAVY', 'HANDLE WITH CARE']
          },
          { 
            name: 'Textiles', 
            colors: ['#607D8B', '#78909C', '#546E7A'], 
            sizes: [[1.0, 0.6, 0.6], [0.9, 0.5, 0.7], [1.1, 0.4, 0.8]],
            labels: ['TEXTILES', 'SOFT GOODS', 'DRY ONLY']
          },
          { 
            name: 'Food_Beverage', 
            colors: ['#D4AC0D', '#F39C12', '#E67E22'], 
            sizes: [[1.2, 0.25, 0.8], [1.0, 0.3, 0.6], [1.1, 0.28, 0.7]],
            labels: ['FOOD GRADE', 'PERISHABLE', 'KEEP COOL']
          }
        ];
        
        const productType = productTypes[Math.floor(Math.random() * productTypes.length)];
        
        return (
          <group key={i} position={[x, y, z]}>
            {/* Professional Euro Pallet with Realistic Details */}
            <group>
              {/* Main Pallet Deck */}
              <mesh castShadow receiveShadow>
                <boxGeometry args={[1.2, 0.18, 0.8]} />
                <meshStandardMaterial 
                  color="#D4AC0D" 
                  metalness={0.05}
                  roughness={0.95}
                />
              </mesh>
              
              {/* Pallet Bottom Runners (3 pieces) */}
              {Array.from({ length: 3 }, (_, runner) => (
                <mesh key={runner} position={[0, -0.12, -0.3 + runner * 0.3]} castShadow>
                  <boxGeometry args={[1.2, 0.08, 0.1]} />
                  <meshStandardMaterial 
                    color="#B7950B" 
                    metalness={0.05}
                    roughness={0.9}
                  />
                </mesh>
              ))}
              
              {/* Pallet Side Runners */}
              {Array.from({ length: 2 }, (_, side) => (
                <mesh key={side} position={[0.45 - side * 0.9, -0.12, 0]} castShadow>
                  <boxGeometry args={[0.1, 0.08, 0.8]} />
                  <meshStandardMaterial 
                    color="#B7950B" 
                    metalness={0.05}
                    roughness={0.9}
                  />
                </mesh>
              ))}
              
              {/* Pallet Support Blocks */}
              {Array.from({ length: 6 }, (_, block) => {
                const bx = -0.4 + (block % 3) * 0.4;
                const bz = -0.2 + Math.floor(block / 3) * 0.4;
                return (
                  <mesh key={block} position={[bx, -0.08, bz]} castShadow>
                    <boxGeometry args={[0.08, 0.12, 0.08]} />
                    <meshStandardMaterial 
                      color="#9A7D0A" 
                      metalness={0.05}
                      roughness={0.9}
                    />
                  </mesh>
                );
              })}
              
              {/* Pallet Identification Nail Plate */}
              <mesh position={[0.5, 0.1, 0.35]} castShadow>
                <boxGeometry args={[0.15, 0.01, 0.08]} />
                <meshStandardMaterial 
                  color="#566573" 
                  metalness={0.8}
                  roughness={0.3}
                />
              </mesh>
              
              {/* Heat Treatment Stamp */}
              <mesh position={[-0.4, 0.1, 0.3]} castShadow>
                <boxGeometry args={[0.1, 0.005, 0.06]} />
                <meshStandardMaterial 
                  color="#1A1A1A" 
                  metalness={0.1}
                  roughness={0.9}
                />
              </mesh>
            </group>
            
            {/* Professional Package Stack with Realistic Variety */}
            {Array.from({ length: Math.floor(Math.random() * 4) + 1 }, (_, j) => {
              const packageColor = productType.colors[j % productType.colors.length];
              const packageSize = productType.sizes[j % productType.sizes.length];
              const rotationY = (Math.random() - 0.5) * 0.2; // Slight rotation for realism
              
              return (
                <group key={j} position={[0, 0.25 + j * 0.32, 0]} rotation={[0, rotationY, 0]}>
                  {/* Main Package Box */}
                  <mesh castShadow receiveShadow>
                    <boxGeometry args={packageSize} />
                    <meshStandardMaterial 
                      color={packageColor} 
                      metalness={0.08}
                      roughness={0.85}
                    />
                  </mesh>
                  
                  {/* Package Corner Reinforcement */}
                  {Array.from({ length: 4 }, (_, corner) => {
                    const angle = (corner * Math.PI) / 2;
                    const cx = Math.cos(angle) * (packageSize[0] / 2 - 0.02);
                    const cz = Math.sin(angle) * (packageSize[2] / 2 - 0.02);
                    return (
                      <mesh key={corner} position={[cx, 0, cz]} castShadow>
                        <boxGeometry args={[0.02, packageSize[1] + 0.01, 0.02]} />
                        <meshStandardMaterial 
                          color="#2C3E50" 
                          metalness={0.1}
                          roughness={0.9}
                        />
                      </mesh>
                    );
                  })}
                  
                  {/* Cardboard Edge Wear */}
                  <mesh position={[packageSize[0] / 2 - 0.005, 0, 0]} castShadow>
                    <boxGeometry args={[0.01, packageSize[1], packageSize[2] * 0.8]} />
                    <meshStandardMaterial 
                      color="#A0A0A0" 
                      metalness={0.05}
                      roughness={0.95}
                    />
                  </mesh>
                </group>
              );
            })}
            
            {/* Professional Shipping Documentation */}
            <group position={[0.5, 0.4, 0]}>
              {/* Main Shipping Label */}
              <mesh castShadow>
                <boxGeometry args={[0.28, 0.2, 0.008]} />
                <meshStandardMaterial 
                  color="#FFFFFF" 
                  metalness={0.05}
                  roughness={0.9}
                />
              </mesh>
              
              {/* Address Section */}
              <mesh position={[0, 0.05, 0.005]} castShadow>
                <boxGeometry args={[0.25, 0.08, 0.002]} />
                <meshStandardMaterial 
                  color="#1A1A1A" 
                  metalness={0.1}
                  roughness={0.9}
                />
              </mesh>
              
              {/* Barcode */}
              <mesh position={[0, -0.05, 0.005]} castShadow>
                <boxGeometry args={[0.22, 0.04, 0.001]} />
                <meshStandardMaterial 
                  color="#1A1A1A" 
                  metalness={0.1}
                  roughness={0.9}
                />
              </mesh>
              
              {/* Barcode Lines Detail */}
              {Array.from({ length: 25 }, (_, line) => (
                <mesh key={line} position={[-0.1 + line * 0.008, -0.05, 0.006]} castShadow>
                  <boxGeometry args={[0.002, 0.035, 0.001]} />
                  <meshStandardMaterial 
                    color={line % 2 === 0 ? "#000000" : "#FFFFFF"} 
                    metalness={0.1}
                    roughness={0.9}
                  />
                </mesh>
              ))}
              
              {/* Tracking Number */}
              <mesh position={[0, -0.08, 0.005]} castShadow>
                <boxGeometry args={[0.18, 0.02, 0.001]} />
                <meshStandardMaterial 
                  color="#1A1A1A" 
                  metalness={0.1}
                  roughness={0.9}
                />
              </mesh>
            </group>
            
            {/* Product Category Labels */}
            <mesh position={[-0.4, 0.35, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
              <boxGeometry args={[0.15, 0.1, 0.005]} />
              <meshStandardMaterial 
                color="#3498DB" 
                metalness={0.1}
                roughness={0.9}
              />
            </mesh>
            
            {/* Handling Instructions */}
            {Math.random() > 0.4 && (
              <mesh position={[0, 0.6, 0.4]} castShadow>
                <boxGeometry args={[0.2, 0.12, 0.005]} />
                <meshStandardMaterial 
                  color="#E74C3C" 
                  metalness={0.1}
                  roughness={0.9}
                />
              </mesh>
            )}
            
            {/* Fragile Stickers */}
            {Math.random() > 0.6 && (
              <mesh position={[-0.3, 0.3, 0.35]} castShadow>
                <boxGeometry args={[0.12, 0.12, 0.005]} />
                <meshStandardMaterial 
                  color="#F39C12" 
                  metalness={0.1}
                  roughness={0.9}
                />
              </mesh>
            )}
            
            {/* Pallet Wrap (Stretch Film) */}
            {Math.random() > 0.5 && (
              <mesh position={[0, 0.4, 0]} castShadow>
                <cylinderGeometry args={[0.7, 0.7, 0.8, 16]} />
                <meshStandardMaterial 
                  color="#FFFFFF" 
                  metalness={0.1}
                  roughness={0.9}
                  transparent
                  opacity={0.15}
                />
              </mesh>
            )}
            
            {/* Safety Placards for Hazardous Materials */}
            {Math.random() > 0.8 && (
              <group position={[0.4, 0.5, 0]}>
                <mesh castShadow>
                  <boxGeometry args={[0.1, 0.1, 0.005]} />
                  <meshStandardMaterial 
                    color="#FF6B35" 
                    metalness={0.1}
                    roughness={0.9}
                  />
                </mesh>
                
                {/* Diamond Symbol */}
                <mesh position={[0, 0, 0.003]} rotation={[0, 0, Math.PI / 4]} castShadow>
                  <boxGeometry args={[0.06, 0.06, 0.001]} />
                  <meshStandardMaterial 
                    color="#FFFFFF" 
                    metalness={0.1}
                    roughness={0.9}
                  />
                </mesh>
              </group>
            )}
            
            {/* Load Distribution Blocks */}
            {Array.from({ length: 4 }, (_, block) => {
              const bx = -0.3 + (block % 2) * 0.6;
              const bz = -0.2 + Math.floor(block / 2) * 0.4;
              return (
                <mesh key={block} position={[bx, 0.12, bz]} castShadow>
                  <boxGeometry args={[0.05, 0.02, 0.05]} />
                  <meshStandardMaterial 
                    color="#7F8C8D" 
                    metalness={0.6}
                    roughness={0.4}
                  />
                </mesh>
              );
            })}
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
        <mesh position={[0, 9.0, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.3, 6]} />
          <meshLambertMaterial color="#ffeb3b" emissive="#ffeb3b" emissiveIntensity={0.3} />
        </mesh>
      )}
    </group>
  );
};

export default RackSystem; 