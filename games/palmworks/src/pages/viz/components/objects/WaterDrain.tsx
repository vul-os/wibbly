import { useRef, useState } from 'react';
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import type { PlantObjectComponent, PlantObjectProps } from './types';

interface WaterDrainProps extends PlantObjectProps {
  position: [number, number, number];
  showCoordinates?: boolean;
}

interface WaterDrainPort {
  id: string;
  label: string;
  position: [number, number, number];
  type: 'electric' | 'liquid';
  direction: 'input' | 'output';
}

const WaterDrain: PlantObjectComponent<WaterDrainProps, WaterDrainPort> = ({
  position = [0, 0, 0],
  onClick,
  onDrag,
  onPortClick,
  isSelected = false,
  isDraggable = false,
  gridSnap = false,
  gridSize = 1.0,
  showCoordinates = false
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [, setIsDragging] = useState(false);
  const [hasMovedMouse, setHasMovedMouse] = useState(false);
  const { camera, raycaster } = useThree();

  // Animation references for realistic effects
  const pumpImpellerRef = useRef<THREE.Group>(null);
  const pumpMotorRef = useRef<THREE.Mesh>(null);
  const drainWaterRef = useRef<THREE.Mesh>(null);
  const levelIndicatorRef = useRef<THREE.Mesh>(null);
  const statusLEDRef = useRef<THREE.Mesh>(null);
  const alarmLEDRef = useRef<THREE.Mesh>(null);
  const flowMeterRef = useRef<THREE.Mesh>(null);
  const bubbleRef = useRef<THREE.Mesh>(null);
  const waterJetRef = useRef<THREE.Mesh>(null);
  const sumpWaterRef = useRef<THREE.Mesh>(null);

  // Professional water drain system connection ports
  const connectionPorts: WaterDrainPort[] = [
    // Water collection inlets
    { id: 'floor_drain_1', label: 'FLOOR-1', position: [-1.2, -0.8, 1.6], type: 'liquid', direction: 'input' },
    { id: 'floor_drain_2', label: 'FLOOR-2', position: [-0.4, -0.8, 1.6], type: 'liquid', direction: 'input' },
    { id: 'floor_drain_3', label: 'FLOOR-3', position: [0.4, -0.8, 1.6], type: 'liquid', direction: 'input' },
    { id: 'floor_drain_4', label: 'FLOOR-4', position: [1.2, -0.8, 1.6], type: 'liquid', direction: 'input' },
    
    // Main drainage outlets
    { id: 'main_discharge', label: 'DISCHARGE', position: [1.5, 0.2, 1.6], type: 'liquid', direction: 'output' },
    { id: 'overflow_outlet', label: 'OVERFLOW', position: [1.5, 0.5, 1.6], type: 'liquid', direction: 'output' },
    { id: 'emergency_drain', label: 'EMERGENCY', position: [1.5, -0.1, 1.6], type: 'liquid', direction: 'output' },
    
    // Electrical connections
    { id: 'power_input', label: 'PWR-IN', position: [-1.3, -0.5, 1.6], type: 'electric', direction: 'input' },
    { id: 'pump_control', label: 'PUMP-CTRL', position: [-0.9, -0.5, 1.6], type: 'electric', direction: 'input' },
    { id: 'level_control', label: 'LEVEL-CTRL', position: [-0.5, -0.5, 1.6], type: 'electric', direction: 'input' },
    
    // Monitoring signals
    { id: 'level_signal', label: 'LEVEL-SIG', position: [0.5, -0.5, 1.6], type: 'electric', direction: 'output' },
    { id: 'flow_signal', label: 'FLOW-SIG', position: [0.9, -0.5, 1.6], type: 'electric', direction: 'output' },
    { id: 'alarm_signal', label: 'ALARM-SIG', position: [1.3, -0.5, 1.6], type: 'electric', direction: 'output' }
  ];

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Pump animations with realistic operation
    if (pumpImpellerRef.current) {
      pumpImpellerRef.current.rotation.z = time * 20; // High-speed drainage pump
    }
    
    // Motor vibration simulation
    if (pumpMotorRef.current) {
      const vibration = Math.sin(time * 60) * 0.002; // Industrial motor vibration
      pumpMotorRef.current.position.y = 0.4 + vibration;
    }
    
    // Sump water level animation
    if (sumpWaterRef.current) {
      const level = 0.3 + Math.sin(time * 0.6) * 0.1; // Water level fluctuation
      sumpWaterRef.current.scale.y = level;
      (sumpWaterRef.current.material as THREE.MeshStandardMaterial).opacity = 0.6 + Math.sin(time * 1.5) * 0.2;
    }

    // Drain water flow effect
    if (drainWaterRef.current) {
      drainWaterRef.current.rotation.z = time * 8; // Swirling drain effect
      (drainWaterRef.current.material as THREE.MeshStandardMaterial).opacity = 0.5 + Math.sin(time * 4) * 0.2;
    }
    
    // Level indicator movement
    if (levelIndicatorRef.current) {
      const level = 0.3 + Math.sin(time * 0.6) * 0.1;
      levelIndicatorRef.current.position.y = -0.5 + level * 0.8;
    }
    
    // Status LED patterns
    if (statusLEDRef.current) {
      const intensity = 0.9 + Math.sin(time * 1.8) * 0.1; // System operational
      (statusLEDRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity;
    }
    if (alarmLEDRef.current) {
      (alarmLEDRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0; // No alarms
    }

    // Flow meter turbine
    if (flowMeterRef.current) {
      flowMeterRef.current.rotation.z = time * 10; // Flow measurement
    }

    // Water effects
    if (bubbleRef.current) {
      bubbleRef.current.position.y = -0.2 + Math.sin(time * 2.5) * 0.1;
      (bubbleRef.current.material as THREE.MeshStandardMaterial).opacity = 0.3 + Math.sin(time * 3) * 0.2;
    }
    if (waterJetRef.current) {
      const jetIntensity = 0.6 + Math.sin(time * 3.5) * 0.3;
      (waterJetRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = jetIntensity;
    }
  });

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    if (!isDraggable) return;
    event.stopPropagation();
    setHasMovedMouse(false);

    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const mouse = new THREE.Vector2();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const ground = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const intersection = new THREE.Vector3();
    raycaster.ray.intersectPlane(ground, intersection);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      setHasMovedMouse(true);

      const newRect = (moveEvent.target as HTMLElement | null)?.getBoundingClientRect?.() || rect;
      const newMouse = new THREE.Vector2();
      newMouse.x = ((moveEvent.clientX - newRect.left) / newRect.width) * 2 - 1;
      newMouse.y = -((moveEvent.clientY - newRect.top) / newRect.height) * 2 + 1;

      raycaster.setFromCamera(newMouse, camera);
      const newIntersection = new THREE.Vector3();
      raycaster.ray.intersectPlane(ground, newIntersection);

      const newPosition: [number, number, number] = [newIntersection.x, position[1], newIntersection.z];

      if (gridSnap && gridSize > 0) {
        newPosition[0] = Math.round(newPosition[0] / gridSize) * gridSize;
        newPosition[2] = Math.round(newPosition[2] / gridSize) * gridSize;
      }

      if (onDrag) {
        onDrag(newPosition);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
    };

    setIsDragging(true);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'grabbing';
  };

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    if (!hasMovedMouse && onClick) {
      event.stopPropagation();
      onClick(event);
    }
  };

  const handlePortClick = (port: WaterDrainPort, event: ThreeEvent<MouseEvent>) => {
    if (onPortClick) {
      const worldPosition = new THREE.Vector3(...port.position).add(new THREE.Vector3(...position));
      onPortClick(port, [worldPosition.x, worldPosition.y, worldPosition.z], event);
    }
  };

  return (
    <group ref={groupRef} position={position}>
      {/* INDUSTRIAL WATER DRAIN SYSTEM */}
      
      {/* ULTRA-REALISTIC PROFESSIONAL FOUNDATION */}
      <group>
        {/* Reinforced Concrete Foundation with Rebar */}
        <mesh position={[0, -0.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.0, 0.4, 3.0]} />
          <meshStandardMaterial 
            color="#6D7C84"
            metalness={0.1}
            roughness={0.9}
          />
        </mesh>
        
        {/* Rebar Reinforcement Grid */}
        {[...Array<unknown>(9)].map((_, i) => (
          <mesh key={`rebar-x-${i}`} position={[-1.8 + i * 0.45, -0.18, 0]} rotation={[Math.PI/2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.008, 0.008, 3.0, 8]} />
            <meshStandardMaterial color="#8B4513" metalness={0.8} roughness={0.4} />
          </mesh>
        ))}
        {[...Array<unknown>(7)].map((_, i) => (
          <mesh key={`rebar-z-${i}`} position={[0, -0.18, -1.35 + i * 0.45]} rotation={[0, 0, Math.PI/2]} castShadow>
            <cylinderGeometry args={[0.008, 0.008, 4.0, 8]} />
            <meshStandardMaterial color="#8B4513" metalness={0.8} roughness={0.4} />
          </mesh>
        ))}

        {/* Anti-Slip Diamond Plate Flooring */}
        <mesh position={[0, 0.02, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.8, 0.04, 2.8]} />
          <meshStandardMaterial 
            color="#37434A"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>

        {/* Diamond Plate Pattern */}
        {[...Array<unknown>(16)].map((_, x) => 
          [...Array<unknown>(12)].map((_, z) => (
            <mesh 
              key={`diamond-${x}-${z}`} 
              position={[-1.8 + x * 0.225, 0.045, -1.25 + z * 0.225]} 
              castShadow
            >
              <cylinderGeometry args={[0.015, 0.01, 0.005, 4]} />
              <meshStandardMaterial color="#2A3439" metalness={0.8} roughness={0.3} />
            </mesh>
          ))
        )}
        
        {/* Professional Sump Pit Excavation */}
        <mesh position={[0, -0.6, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.9, 0.9, 1.0, 20]} />
          <meshStandardMaterial 
            color="#5A6268"
            metalness={0.1}
            roughness={0.8}
          />
        </mesh>
        
        {/* Industrial Grade Sump Liner (316 Stainless Steel) */}
        <mesh position={[0, -0.55, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.85, 0.85, 0.9, 24]} />
          <meshStandardMaterial 
            color="#F0F4F8"
            metalness={0.95}
            roughness={0.03}
            envMapIntensity={0.9}
          />
        </mesh>

        {/* Sump Liner Weld Seams */}
        <mesh position={[0, -0.3, 0]} castShadow>
          <torusGeometry args={[0.855, 0.008, 8, 24]} />
          <meshStandardMaterial color="#D0D0D0" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.8, 0]} castShadow>
          <torusGeometry args={[0.855, 0.008, 8, 24]} />
          <meshStandardMaterial color="#D0D0D0" metalness={0.9} roughness={0.2} />
        </mesh>
        
        {/* Realistic Sump Water with Advanced Effects */}
        <mesh ref={sumpWaterRef} position={[0, -0.85, 0]} castShadow>
          <cylinderGeometry args={[0.82, 0.82, 0.6, 24]} />
          <meshStandardMaterial 
            color="#1976D2"
            transparent
            opacity={0.75}
            metalness={0.1}
            roughness={0.05}
            envMapIntensity={0.4}
          />
        </mesh>
        
        {/* Water Surface Agitation Bubbles */}
        <mesh ref={bubbleRef} position={[0, -0.25, 0]} castShadow>
          <sphereGeometry args={[0.8, 20, 12]} />
          <meshStandardMaterial 
            color="#42A5F5"
            transparent
            opacity={0.15}
            metalness={0.0}
            roughness={1.0}
          />
        </mesh>

        {/* Professional Safety Railings Around Sump */}
        {[...Array<unknown>(16)].map((_, i) => {
          const angle = (i * Math.PI) / 8;
          const x = Math.cos(angle) * 1.1;
          const z = Math.sin(angle) * 1.1;
          return (
            <group key={`railing-${i}`} position={[x, 0.5, z]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.02, 0.02, 1.0, 12]} />
                <meshStandardMaterial color="#FFEB3B" metalness={0.8} roughness={0.2} />
              </mesh>
              <mesh position={[0, 0.35, 0]} castShadow>
                <cylinderGeometry args={[0.025, 0.025, 0.05, 12]} />
                <meshStandardMaterial color="#FF5722" metalness={0.8} roughness={0.2} />
              </mesh>
            </group>
          );
        })}

        {/* Sump Access Ladder */}
        <group position={[0.9, 0.2, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.05, 1.2, 0.03]} />
            <meshStandardMaterial color="#37474F" metalness={0.8} roughness={0.2} />
          </mesh>
          {[...Array<unknown>(6)].map((_, i) => (
            <mesh key={`rung-${i}`} position={[0, 0.5 - i * 0.2, 0.12]} rotation={[0, 0, Math.PI/2]} castShadow>
              <cylinderGeometry args={[0.015, 0.015, 0.2, 12]} />
              <meshStandardMaterial color="#37474F" metalness={0.8} roughness={0.2} />
            </mesh>
          ))}
        </group>
      </group>

      {/* PROFESSIONAL FLOOR DRAIN GRATES */}
      {[-1.2, -0.4, 0.4, 1.2].map((x, i) => (
        <group key={`floor-drain-${i}`} position={[x, 0.02, -0.8]}>
          {/* Drain Frame */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.25, 0.04, 0.25]} />
            <meshStandardMaterial 
              color="#37474F"
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
          
          {/* Professional Grate Pattern */}
          {[...Array<unknown>(5)].map((_, j) => (
            <mesh key={`grate-${j}`} position={[0, 0.025, -0.1 + j * 0.05]} castShadow>
              <boxGeometry args={[0.2, 0.01, 0.01]} />
              <meshStandardMaterial color="#263238" metalness={0.9} roughness={0.1} />
            </mesh>
          ))}
          {[...Array<unknown>(5)].map((_, j) => (
            <mesh key={`grate-cross-${j}`} position={[-0.1 + j * 0.05, 0.025, 0]} rotation={[0, Math.PI/2, 0]} castShadow>
              <boxGeometry args={[0.2, 0.01, 0.01]} />
              <meshStandardMaterial color="#263238" metalness={0.9} roughness={0.1} />
            </mesh>
          ))}
          
          {/* Water Flow Effect in Drain */}
          <mesh ref={drainWaterRef} position={[0, -0.05, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.1, 12]} />
            <meshStandardMaterial 
              color="#1976D2"
              transparent
              opacity={0.6}
              metalness={0.1}
              roughness={0.8}
            />
          </mesh>
        </group>
      ))}

      {/* ULTRA-REALISTIC PROFESSIONAL LIFT PUMP SYSTEM */}
      <group position={[0.8, 0.2, 0.3]}>
        {/* Reinforced Pump Foundation/Skid */}
        <mesh position={[0, -0.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.8, 0.15, 0.6]} />
          <meshStandardMaterial 
            color="#6D7C84"
            metalness={0.1}
            roughness={0.9}
          />
        </mesh>

        {/* Anti-Vibration Mounting Pads */}
        {(
          [[-0.25, -0.33, -0.2], [0.25, -0.33, -0.2], [-0.25, -0.33, 0.2], [0.25, -0.33, 0.2]] as const
        ).map((pos, i) => (
          <mesh key={`pad-${i}`} position={pos} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.03, 12]} />
            <meshStandardMaterial color="#1C1C1C" metalness={0.2} roughness={0.8} />
          </mesh>
        ))}
        
        {/* Professional Cast Iron Pump Housing */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.22, 0.22, 0.45, 20]} />
          <meshStandardMaterial 
            color="#1976D2"
            metalness={0.9}
            roughness={0.12}
            envMapIntensity={0.8}
          />
        </mesh>

        {/* Pump Housing Bolts */}
        {[...Array<unknown>(8)].map((_, i) => {
          const angle = (i * Math.PI) / 4;
          const x = Math.cos(angle) * 0.25;
          const z = Math.sin(angle) * 0.25;
          return (
            <mesh key={`bolt-${i}`} position={[x, 0, z]} castShadow>
              <cylinderGeometry args={[0.008, 0.008, 0.04, 6]} />
              <meshStandardMaterial color="#37474F" metalness={0.9} roughness={0.1} />
            </mesh>
          );
        })}

        {/* Pump Nameplate */}
        <mesh position={[0.22, 0.1, 0]} castShadow>
          <boxGeometry args={[0.01, 0.12, 0.08]} />
          <meshStandardMaterial color="#E0E0E0" metalness={0.8} roughness={0.2} />
        </mesh>
        
        {/* High-Performance Pump Impeller */}
        <group ref={pumpImpellerRef}>
          <mesh position={[0, 0, 0]} castShadow>
            <cylinderGeometry args={[0.16, 0.16, 0.04, 12]} />
            <meshStandardMaterial 
              color="#1565C0"
              metalness={0.95}
              roughness={0.03}
              envMapIntensity={0.9}
            />
          </mesh>
          
          {/* Precision Impeller Vanes */}
          {[...Array<unknown>(8)].map((_, i) => {
            const angle = (i * Math.PI) / 4;
            const x = Math.cos(angle) * 0.12;
            const z = Math.sin(angle) * 0.12;
            return (
              <mesh 
                key={`vane-${i}`} 
                position={[x, 0, z]} 
                rotation={[0, angle, Math.PI/8]}
                castShadow
              >
                <boxGeometry args={[0.025, 0.04, 0.18]} />
                <meshStandardMaterial color="#0D47A1" metalness={0.95} roughness={0.05} />
              </mesh>
            );
          })}

          {/* Central Hub */}
          <mesh position={[0, 0, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 0.045, 16]} />
            <meshStandardMaterial color="#0D47A1" metalness={0.95} roughness={0.03} />
          </mesh>
        </group>
        
        {/* High-Efficiency Electric Motor */}
        <mesh ref={pumpMotorRef} position={[0, 0.45, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.14, 0.14, 0.3, 20]} />
          <meshStandardMaterial 
            color="#37474F"
            metalness={0.85}
            roughness={0.15}
            envMapIntensity={0.7}
          />
        </mesh>

        {/* Motor Terminal Box */}
        <mesh position={[0.15, 0.5, 0]} castShadow>
          <boxGeometry args={[0.08, 0.06, 0.08]} />
          <meshStandardMaterial color="#263238" metalness={0.8} roughness={0.2} />
        </mesh>
        
        {/* Advanced Motor Cooling Fins */}
        {[...Array<unknown>(12)].map((_, i) => (
          <mesh key={`fin-${i}`} position={[0, 0.45, 0]} rotation={[0, (i * Math.PI) / 6, 0]} castShadow>
            <boxGeometry args={[0.01, 0.25, 0.16]} />
            <meshStandardMaterial color="#263238" metalness={0.75} roughness={0.25} />
          </mesh>
        ))}

        {/* Professional Coupling */}
        <mesh position={[0, 0.25, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.08, 16]} />
          <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
        </mesh>
        
        {/* Pump Suction Pipe with Flange */}
        <mesh position={[0, -0.3, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.15, 16]} />
          <meshStandardMaterial color="#2E7D32" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.375, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.02, 16]} />
          <meshStandardMaterial color="#1B5E20" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Pump Discharge Pipe with Check Valve */}
        <mesh position={[0.35, 0, 0]} rotation={[0, 0, Math.PI/2]} castShadow>
          <cylinderGeometry args={[0.045, 0.045, 0.3, 16]} />
          <meshStandardMaterial color="#2E7D32" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Professional Check Valve */}
        <mesh position={[0.45, 0, 0]} castShadow>
          <sphereGeometry args={[0.07, 16, 12]} />
          <meshStandardMaterial color="#1B5E20" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Isolation Valve */}
        <mesh position={[0.6, 0, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.08, 16]} />
          <meshStandardMaterial color="#FF5722" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0.6, 0.08, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.05, 12]} />
          <meshStandardMaterial color="#37474F" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Pressure Gauge */}
        <mesh position={[0.5, 0.1, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.02, 16]} />
          <meshStandardMaterial color="#E0E0E0" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0.5, 0.112, 0]} castShadow>
          <cylinderGeometry args={[0.035, 0.035, 0.002, 16]} />
          <meshStandardMaterial color="#212121" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* ULTRA-REALISTIC PROFESSIONAL CONTROL SYSTEM */}
      <group position={[0, 0, 1.4]}>
        {/* NEMA 4X Control Panel Enclosure */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[3.2, 2.0, 0.35]} />
          <meshStandardMaterial 
            color="#F5F5F5"
            metalness={0.85}
            roughness={0.12}
            envMapIntensity={0.8}
          />
        </mesh>

        {/* Weatherproof Gasket Seal */}
        <mesh position={[0, 0, 0.16]} castShadow>
          <boxGeometry args={[3.1, 1.9, 0.01]} />
          <meshStandardMaterial color="#1C1C1C" metalness={0.3} roughness={0.8} />
        </mesh>
        
        {/* Professional Panel Door */}
        <mesh position={[0, 0, 0.18]} castShadow>
          <boxGeometry args={[2.9, 1.7, 0.08]} />
          <meshStandardMaterial 
            color="#E8EAF6"
            metalness={0.8}
            roughness={0.15}
            envMapIntensity={0.7}
          />
        </mesh>

        {/* Door Handle and Lock */}
        <mesh position={[1.35, 0, 0.22]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.08, 12]} />
          <meshStandardMaterial color="#37474F" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[1.35, -0.3, 0.22]} castShadow>
          <boxGeometry args={[0.04, 0.06, 0.03]} />
          <meshStandardMaterial color="#37474F" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Professional HMI Touchscreen Display */}
        <mesh position={[-0.6, 0.4, 0.19]} castShadow>
          <boxGeometry args={[0.6, 0.4, 0.04]} />
          <meshStandardMaterial color="#1C1C1C" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[-0.6, 0.4, 0.195]} castShadow>
          <boxGeometry args={[0.55, 0.35, 0.005]} />
          <meshStandardMaterial 
            color="#0D47A1"
            emissive="#1976D2"
            emissiveIntensity={0.6}
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* HMI Screen Content */}
        <mesh position={[-0.6, 0.45, 0.198]} castShadow>
          <boxGeometry args={[0.5, 0.02, 0.002]} />
          <meshStandardMaterial 
            color="#4CAF50"
            emissive="#4CAF50"
            emissiveIntensity={0.8}
          />
        </mesh>
        <mesh position={[-0.6, 0.35, 0.198]} castShadow>
          <boxGeometry args={[0.4, 0.02, 0.002]} />
          <meshStandardMaterial 
            color="#FF9800"
            emissive="#FF9800"
            emissiveIntensity={0.7}
          />
        </mesh>
        
        {/* Advanced Level Control Display */}
        <mesh position={[-0.6, 0.0, 0.19]} castShadow>
          <boxGeometry args={[0.5, 0.3, 0.03]} />
          <meshStandardMaterial 
            color="#263238"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        
        {/* Digital Level Readout */}
        <mesh ref={levelIndicatorRef} position={[-0.6, 0.05, 0.195]} castShadow>
          <boxGeometry args={[0.45, 0.08, 0.005]} />
          <meshStandardMaterial 
            color="#4CAF50"
            emissive="#4CAF50"
            emissiveIntensity={0.9}
          />
        </mesh>

        {/* Level Bar Graph */}
        {[...Array<unknown>(10)].map((_, i) => (
          <mesh key={`level-bar-${i}`} position={[-0.75 + i * 0.03, -0.1, 0.195]} castShadow>
            <boxGeometry args={[0.02, 0.12, 0.003]} />
            <meshStandardMaterial 
              color={i < 6 ? "#4CAF50" : i < 8 ? "#FF9800" : "#F44336"}
              emissive={i < 6 ? "#4CAF50" : i < 8 ? "#FF9800" : "#F44336"}
              emissiveIntensity={0.6}
            />
          </mesh>
        ))}
        
        {/* Professional Industrial Flow Meter */}
        <mesh position={[0.6, 0.4, 0.19]} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.04, 20]} />
          <meshStandardMaterial color="#2E7D32" metalness={0.85} roughness={0.15} />
        </mesh>
        <mesh position={[0.6, 0.4, 0.195]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.005, 20]} />
          <meshStandardMaterial color="#E0E0E0" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Flow Meter Turbine (Animated) */}
        <mesh ref={flowMeterRef} position={[0.6, 0.4, 0.198]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.002, 8]} />
          <meshStandardMaterial color="#4CAF50" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Digital Flow Display */}
        <mesh position={[0.6, 0.15, 0.19]} castShadow>
          <boxGeometry args={[0.25, 0.12, 0.03]} />
          <meshStandardMaterial color="#1C1C1C" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0.6, 0.15, 0.195]} castShadow>
          <boxGeometry args={[0.22, 0.05, 0.005]} />
          <meshStandardMaterial 
            color="#4CAF50"
            emissive="#4CAF50"
            emissiveIntensity={0.8}
          />
        </mesh>
        
        {/* Professional Status LED Panel */}
        <group position={[-0.9, -0.4, 0.19]}>
          {/* System Status LED */}
          <mesh ref={statusLEDRef} position={[0, 0.15, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.015, 16]} />
            <meshStandardMaterial 
              color="#4CAF50"
              emissive="#4CAF50"
              emissiveIntensity={0.9}
            />
          </mesh>
          
          {/* Alarm LED */}
          <mesh ref={alarmLEDRef} position={[0, 0.05, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.015, 16]} />
            <meshStandardMaterial 
              color="#F44336"
              emissive="#F44336"
              emissiveIntensity={0.0}
            />
          </mesh>
          
          {/* Power LED */}
          <mesh position={[0, -0.05, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.015, 16]} />
            <meshStandardMaterial 
              color="#FF9800"
              emissive="#FF9800"
              emissiveIntensity={0.8}
            />
          </mesh>

          {/* Pump Running LED */}
          <mesh position={[0, -0.15, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.015, 16]} />
            <meshStandardMaterial 
              color="#2196F3"
              emissive="#2196F3"
              emissiveIntensity={0.7}
            />
          </mesh>

          {/* LED Labels */}
          <mesh position={[-0.08, 0.15, 0]} castShadow>
            <boxGeometry args={[0.12, 0.02, 0.002]} />
            <meshStandardMaterial color="#E0E0E0" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>

        {/* Industrial Pressure Gauge */}
        <mesh position={[0.2, 0.1, 0.19]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.03, 20]} />
          <meshStandardMaterial color="#37474F" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0.2, 0.1, 0.195]} castShadow>
          <cylinderGeometry args={[0.075, 0.075, 0.005, 20]} />
          <meshStandardMaterial color="#E0E0E0" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Pressure Gauge Needle */}
        <mesh position={[0.2, 0.1, 0.198]} rotation={[0, 0, Math.PI/4]} castShadow>
          <boxGeometry args={[0.001, 0.06, 0.002]} />
          <meshStandardMaterial color="#F44336" emissive="#F44336" emissiveIntensity={0.8} />
        </mesh>
        
        {/* Professional Emergency Stop Button */}
        <mesh position={[0.9, -0.4, 0.22]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.04, 16]} />
          <meshStandardMaterial color="#D32F2F" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0.9, -0.4, 0.24]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.01, 16]} />
          <meshStandardMaterial color="#B71C1C" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Control Switches */}
        <mesh position={[0.3, -0.4, 0.19]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.02, 16]} />
          <meshStandardMaterial color="#4CAF50" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0.5, -0.4, 0.19]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.02, 16]} />
          <meshStandardMaterial color="#FF9800" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Cable Management and Conduits */}
        <mesh position={[-1.4, 0, 0.1]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.6, 12]} />
          <meshStandardMaterial color="#37474F" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[1.4, 0, 0.1]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.6, 12]} />
          <meshStandardMaterial color="#37474F" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Professional Warning Signs */}
        <mesh position={[0, 0.8, 0.19]} castShadow>
          <boxGeometry args={[0.3, 0.08, 0.005]} />
          <meshStandardMaterial color="#FFEB3B" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.8, 0.19]} castShadow>
          <boxGeometry args={[0.4, 0.06, 0.005]} />
          <meshStandardMaterial color="#FF5722" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>

      {/* DRAINAGE MANIFOLD SYSTEM */}
      <group position={[0, 0.4, -0.5]}>
        {/* Main Collection Header */}
        <mesh rotation={[0, Math.PI/2, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 2.8, 16]} />
          <meshStandardMaterial color="#1976D2" metalness={0.8} roughness={0.2} />
        </mesh>
        
        {/* Branch Connections */}
        {[-1.2, -0.4, 0.4, 1.2].map((x, i) => (
          <mesh key={`branch-${i}`} position={[x, -0.3, 0]} rotation={[Math.PI/2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.4, 12]} />
            <meshStandardMaterial color="#1976D2" metalness={0.8} roughness={0.2} />
          </mesh>
        ))}
        
        {/* Professional Fittings */}
        {[-1.2, -0.4, 0.4, 1.2].map((x, i) => (
          <mesh key={`fitting-${i}`} position={[x, 0, 0]} castShadow>
            <sphereGeometry args={[0.08, 12, 8]} />
            <meshStandardMaterial color="#0D47A1" metalness={0.9} roughness={0.1} />
          </mesh>
        ))}
      </group>

      {/* ULTRA-REALISTIC WATER EFFECTS AND ENVIRONMENTAL DETAILS */}
      
      {/* Primary Water Discharge Jet */}
      <mesh ref={waterJetRef} position={[1.5, 0.2, 1.5]} rotation={[0, Math.PI/2, 0]} castShadow>
        <cylinderGeometry args={[0.018, 0.012, 0.25, 12]} />
        <meshStandardMaterial 
          color="#42A5F5"
          transparent
          opacity={0.85}
          emissive="#1976D2"
          emissiveIntensity={0.5}
          envMapIntensity={0.4}
        />
      </mesh>

      {/* Water Droplets Effect */}
      {[...Array<unknown>(6)].map((_, i) => (
        <mesh key={`droplet-${i}`} position={[1.7 + Math.random() * 0.2, 0.15 + Math.random() * 0.1, 1.5 + (Math.random() - 0.5) * 0.3]} castShadow>
          <sphereGeometry args={[0.008, 8, 6]} />
          <meshStandardMaterial 
            color="#42A5F5"
            transparent
            opacity={0.7}
            metalness={0.1}
            roughness={0.1}
          />
        </mesh>
      ))}

      {/* Steam/Mist Effects from Heated Water */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <sphereGeometry args={[1.2, 12, 8]} />
        <meshStandardMaterial 
          color="#E3F2FD"
          transparent
          opacity={0.05}
          metalness={0.0}
          roughness={1.0}
        />
      </mesh>

      {/* Emergency Eye Wash Station */}
      <group position={[-2.2, 0.6, -0.8]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.03, 0.03, 1.2, 12]} />
          <meshStandardMaterial color="#FFEB3B" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.55, 0]} castShadow>
          <boxGeometry args={[0.15, 0.1, 0.08]} />
          <meshStandardMaterial color="#4CAF50" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.4, 0]} castShadow>
          <sphereGeometry args={[0.04, 12, 8]} />
          <meshStandardMaterial color="#E0E0E0" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* Safety Shower */}
      <group position={[-2.2, 1.2, -0.3]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.3, 12]} />
          <meshStandardMaterial color="#37474F" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.18, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.02, 16]} />
          <meshStandardMaterial color="#E0E0E0" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* Electrical Grounding System */}
      <mesh position={[1.8, -0.1, 0.5]} castShadow>
        <cylinderGeometry args={[0.01, 0.01, 0.3, 8]} />
        <meshStandardMaterial color="#8BC34A" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[1.8, -0.25, 0.5]} castShadow>
        <boxGeometry args={[0.04, 0.04, 0.02]} />
        <meshStandardMaterial color="#4CAF50" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Professional Cable Tray System */}
      <group position={[0, 1.8, 1.0]}>
        <mesh castShadow>
          <boxGeometry args={[3.0, 0.03, 0.2]} />
          <meshStandardMaterial color="#607D8B" metalness={0.8} roughness={0.2} />
        </mesh>
        {[...Array<unknown>(10)].map((_, i) => (
          <mesh key={`tray-rung-${i}`} position={[-1.35 + i * 0.3, 0, 0]} castShadow>
            <boxGeometry args={[0.02, 0.03, 0.2]} />
            <meshStandardMaterial color="#546E7A" metalness={0.8} roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* Industrial Lighting */}
      <group position={[0, 2.2, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.08, 16]} />
          <meshStandardMaterial color="#37474F" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.045, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.005, 16]} />
          <meshStandardMaterial 
            color="#FFF"
            emissive="#FFF"
            emissiveIntensity={0.3}
          />
        </mesh>
      </group>

      {/* Hazmat Spill Kit */}
      <group position={[-1.8, 0.3, 1.2]}>
        <mesh castShadow>
          <boxGeometry args={[0.3, 0.4, 0.15]} />
          <meshStandardMaterial color="#FF5722" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0.08]} castShadow>
          <boxGeometry args={[0.25, 0.05, 0.02]} />
          <meshStandardMaterial color="#E0E0E0" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* Water Level Sensors */}
      <group position={[0, 0.1, 0.9]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.8, 12]} />
          <meshStandardMaterial color="#607D8B" metalness={0.8} roughness={0.2} />
        </mesh>
        {[...Array<unknown>(4)].map((_, i) => (
          <mesh key={`sensor-${i}`} position={[0, -0.3 + i * 0.2, 0]} castShadow>
            <sphereGeometry args={[0.02, 12, 8]} />
            <meshStandardMaterial color="#2196F3" metalness={0.8} roughness={0.2} />
          </mesh>
        ))}
      </group>

      {/* CONNECTION PORTS */}
      {connectionPorts.map((port) => (
        <group key={port.id}>
          <mesh 
            position={port.position}
            onClick={(e) => handlePortClick(port, e)}
            castShadow
          >
            <cylinderGeometry args={[0.03, 0.03, 0.06, 8]} />
            <meshStandardMaterial 
              color={
                port.type === 'liquid' ? 
                  (port.direction === 'input' ? '#1976D2' : '#2E7D32') :
                  (port.direction === 'input' ? '#FF5722' : '#FFC107')
              }
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
          
          <Text
            position={[port.position[0], port.position[1] - 0.12, port.position[2] + 0.04]}
            fontSize={0.06}
            color="#FFFFFF"
            fontWeight="bold"
            anchorX="center"
            anchorY="middle"
          >
            {port.label}
          </Text>
        </group>
      ))}

      {/* SYSTEM LABELING */}
      <Text
        position={[0, 1.2, 1.32]}
        fontSize={0.12}
        color="#FFFFFF"
        fontWeight="bold"
        anchorX="center"
        anchorY="middle"
      >
        WATER DRAIN SYSTEM
      </Text>
      
      <Text
        position={[0, 1.05, 1.32]}
        fontSize={0.07}
        color="#B0BEC5"
        anchorX="center"
        anchorY="middle"
      >
        Industrial Water Removal
      </Text>
      
      <Text
        position={[0, 0.92, 1.32]}
        fontSize={0.05}
        color="#90A4AE"
        anchorX="center"
        anchorY="middle"
      >
        Flow: 150 GPM | Level: AUTO
      </Text>

      {/* COMPONENT LABELS */}
      <Text
        position={[0, -0.9, 0]}
        fontSize={0.05}
        color="#E0E0E0"
        anchorX="center"
        anchorY="middle"
      >
        SUMP PIT
      </Text>
      
      <Text
        position={[0.8, 0.7, 0.3]}
        fontSize={0.04}
        color="#E0E0E0"
        anchorX="center"
        anchorY="middle"
      >
        LIFT PUMP
      </Text>

      <mesh
        onPointerDown={handlePointerDown}
        onClick={handleClick}
        position={[0, 0, 0]}
        visible={false}
      >
        <boxGeometry args={[3.5, 2, 2.5]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* COORDINATE DISPLAY */}
      {showCoordinates && (
        <Text
          position={[0, 2.5, 0]}
          fontSize={0.2}
          color="yellow"
          anchorX="center"
          anchorY="middle"
        >
          {`(${position[0].toFixed(1)}, ${position[2].toFixed(1)})`}
        </Text>
      )}

      {/* SELECTION INDICATOR */}
      {isSelected && (
        <mesh position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[4.0, 4.5, 32]} />
          <meshBasicMaterial color="#4CAF50" transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
};

// Static property for accessing connection ports
WaterDrain.connectionPorts = [
  { id: 'floor_drain_1', label: 'FLOOR-1', position: [-1.2, -0.8, 1.6], type: 'liquid', direction: 'input' },
  { id: 'floor_drain_2', label: 'FLOOR-2', position: [-0.4, -0.8, 1.6], type: 'liquid', direction: 'input' },
  { id: 'floor_drain_3', label: 'FLOOR-3', position: [0.4, -0.8, 1.6], type: 'liquid', direction: 'input' },
  { id: 'floor_drain_4', label: 'FLOOR-4', position: [1.2, -0.8, 1.6], type: 'liquid', direction: 'input' },
  { id: 'main_discharge', label: 'DISCHARGE', position: [1.5, 0.2, 1.6], type: 'liquid', direction: 'output' },
  { id: 'overflow_outlet', label: 'OVERFLOW', position: [1.5, 0.5, 1.6], type: 'liquid', direction: 'output' },
  { id: 'emergency_drain', label: 'EMERGENCY', position: [1.5, -0.1, 1.6], type: 'liquid', direction: 'output' },
  { id: 'power_input', label: 'PWR-IN', position: [-1.3, -0.5, 1.6], type: 'electric', direction: 'input' },
  { id: 'pump_control', label: 'PUMP-CTRL', position: [-0.9, -0.5, 1.6], type: 'electric', direction: 'input' },
  { id: 'level_control', label: 'LEVEL-CTRL', position: [-0.5, -0.5, 1.6], type: 'electric', direction: 'input' },
  { id: 'level_signal', label: 'LEVEL-SIG', position: [0.5, -0.5, 1.6], type: 'electric', direction: 'output' },
  { id: 'flow_signal', label: 'FLOW-SIG', position: [0.9, -0.5, 1.6], type: 'electric', direction: 'output' },
  { id: 'alarm_signal', label: 'ALARM-SIG', position: [1.3, -0.5, 1.6], type: 'electric', direction: 'output' }
];

export default WaterDrain; 