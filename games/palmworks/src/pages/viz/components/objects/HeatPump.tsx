import { useRef, useState } from 'react';
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import type { PlantObjectComponent, PlantObjectProps } from './types';

interface HeatPumpProps extends PlantObjectProps {
  position: [number, number, number];
}

interface HeatPumpPort {
  id: string;
  label: string;
  position: [number, number, number];
  type: 'electric' | 'liquid' | 'gas';
  direction: 'input' | 'output' | 'service';
}

const HeatPump: PlantObjectComponent<HeatPumpProps, HeatPumpPort> = ({
  position = [0, 0, 0],
  onClick,
  onDrag,
  onPortClick,
  isSelected = false,
  isDraggable = false,
  gridSnap = false,
  gridSize = 1.0
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [, setDragStartPos] = useState<[number, number, number] | null>(null);
  const { camera, gl } = useThree();

  // Animation references for ultra-realistic heat pump operation
  const compressorRef = useRef<THREE.Mesh>(null);
  const fanRef = useRef<THREE.Group>(null);
  const refrigerantFlowRef = useRef<THREE.Mesh>(null);
  const temperatureDisplayRef = useRef<THREE.Mesh>(null);
  const statusLEDRef = useRef<THREE.Mesh>(null);
  const defrostLEDRef = useRef<THREE.Mesh>(null);
  const heatExchangerRef = useRef<THREE.Mesh>(null);
  const steamRef = useRef<THREE.Mesh>(null);
  const condensateRef = useRef<THREE.Mesh>(null);
  const evaporatorFinsRef = useRef<THREE.Mesh>(null);
  const pressureGaugeRef = useRef<THREE.Mesh>(null);
  const flowMeterRef = useRef<THREE.Mesh>(null);
  const alarmLEDRef = useRef<THREE.Mesh>(null);
  const waterJetRef = useRef<THREE.Mesh>(null);
  const systemLEDRef = useRef<THREE.Mesh>(null);
  const vibrationRef = useRef<THREE.Group>(null);

  // Professional heat pump connection ports
  const connectionPorts: HeatPumpPort[] = [
    // Water circulation (pool heating loop)
    { id: 'water_inlet', label: 'WATER-IN', position: [-1.2, -0.4, 1.8], type: 'liquid', direction: 'input' },
    { id: 'water_outlet', label: 'WATER-OUT', position: [1.2, -0.4, 1.8], type: 'liquid', direction: 'output' },
    { id: 'bypass_valve', label: 'BYPASS', position: [0, -0.6, 1.8], type: 'liquid', direction: 'output' },
    { id: 'condensate_drain', label: 'DRAIN', position: [0.8, -0.8, 1.8], type: 'liquid', direction: 'output' },

    // Electrical connections
    { id: 'power_input', label: 'PWR-IN', position: [-1.4, -0.8, 1.8], type: 'electric', direction: 'input' },
    { id: 'control_input', label: 'CTRL-IN', position: [-0.8, -0.8, 1.8], type: 'electric', direction: 'input' },
    { id: 'fan_control', label: 'FAN-CTRL', position: [-0.2, -0.8, 1.8], type: 'electric', direction: 'input' },
    { id: 'defrost_control', label: 'DEFROST', position: [0.4, -0.8, 1.8], type: 'electric', direction: 'input' },

    // Monitoring outputs
    { id: 'temp_signal', label: 'TEMP-SIG', position: [1.0, -0.8, 1.8], type: 'electric', direction: 'output' },
    { id: 'status_signal', label: 'STATUS', position: [1.6, -0.8, 1.8], type: 'electric', direction: 'output' },
    { id: 'alarm_signal', label: 'ALARM', position: [1.8, -0.6, 1.8], type: 'electric', direction: 'output' },

    // Refrigerant service ports
    { id: 'service_high', label: 'HIGH-P', position: [-0.6, 0.8, 1.8], type: 'gas', direction: 'service' },
    { id: 'service_low', label: 'LOW-P', position: [0.6, 0.8, 1.8], type: 'gas', direction: 'service' }
  ];

  const GRID_SIZE = gridSize || 1.0;

  const snapToGrid = (value: number): number => {
    if (!gridSnap) return value;
    return Math.round(value / GRID_SIZE) * GRID_SIZE;
  };

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Professional compressor operation with realistic duty cycling
    if (compressorRef.current) {
      const dutyPhase = Math.sin(time * 0.08) > 0 ? 1 : 0; // 8% duty cycle variation
      compressorRef.current.rotation.y = time * 12 * dutyPhase; // Scroll compressor rotation
      
      // Compressor vibration when running (60Hz industrial motor)
      if (dutyPhase > 0 && vibrationRef.current) {
        const vibration = Math.sin(time * 377) * 0.004; // 60Hz x 2π for realistic vibration
        vibrationRef.current.position.y = 0.2 + vibration;
      }
    }
    
    // Variable speed fan operation based on ambient temperature simulation
    if (fanRef.current) {
      const ambientTemp = 22 + Math.sin(time * 0.03) * 8; // 14-30°C ambient variation
      const fanSpeed = Math.max(0.2, Math.min(1.0, (ambientTemp - 10) / 25)); // Variable speed control
      fanRef.current.rotation.z = time * 18 * fanSpeed; // Fan blade rotation with speed control
    }
    
    // Refrigerant flow visualization in lines
    if (refrigerantFlowRef.current) {
      (refrigerantFlowRef.current.material as THREE.MeshStandardMaterial).opacity = 0.4 + Math.sin(time * 6) * 0.3;
      refrigerantFlowRef.current.position.y = Math.sin(time * 3) * 0.03;
    }

    // Professional temperature display animation (28°C setpoint with realistic variation)
    if (temperatureDisplayRef.current) {
      const intensity = 0.85 + Math.sin(time * 3) * 0.08; // Realistic LCD flicker
      (temperatureDisplayRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity;
    }

    // Advanced status LED patterns
    if (statusLEDRef.current) {
      const runPattern = Math.sin(time * 1.5) > 0 ? 0.95 : 0.4; // Professional running indicator
      (statusLEDRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = runPattern;
    }
    if (defrostLEDRef.current) {
      // Defrost cycle every 120 seconds simulation
      const defrostCycle = Math.sin(time * 0.052) > 0.92 ? 0.95 : 0;
      (defrostLEDRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = defrostCycle;
    }
    if (alarmLEDRef.current) {
      (alarmLEDRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0; // No alarms (normal operation)
    }
    if (systemLEDRef.current) {
      const heartbeat = Math.sin(time * 2.5) > 0.7 ? 0.9 : 0.2; // System heartbeat
      (systemLEDRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = heartbeat;
    }

    // Heat exchanger thermal effects with realistic heat distribution
    if (heatExchangerRef.current) {
      const thermalActivity = 0.15 + Math.sin(time * 1.2) * 0.08;
      (heatExchangerRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = thermalActivity;
    }
    
    // Professional pressure gauge simulation
    if (pressureGaugeRef.current) {
      const pressure = 180 + Math.sin(time * 0.8) * 20; // 160-200 PSI system pressure
      pressureGaugeRef.current.rotation.z = -Math.PI/2 + (pressure / 400) * Math.PI;
    }
    
    // Flow meter turbine rotation
    if (flowMeterRef.current) {
      flowMeterRef.current.rotation.z = time * 25; // High-precision flow measurement
    }
    
    // Steam effect during heating operation
    if (steamRef.current) {
      steamRef.current.rotation.y = time * 0.4;
      steamRef.current.position.y = 2.8 + Math.sin(time * 1.8) * 0.12;
      (steamRef.current.material as THREE.MeshStandardMaterial).opacity = 0.15 + Math.sin(time * 2.5) * 0.08;
    }

    // Condensate drip animation with realistic timing
    if (condensateRef.current) {
      condensateRef.current.position.y = -0.4 + Math.sin(time * 4) * 0.08;
      (condensateRef.current.material as THREE.MeshStandardMaterial).opacity = 0.7 + Math.sin(time * 3.5) * 0.25;
    }

    // Evaporator fin frost buildup simulation (seasonal effect)
    if (evaporatorFinsRef.current) {
      const frostLevel = Math.max(0, Math.sin(time * 0.025) * 0.4);
      (evaporatorFinsRef.current.material as THREE.MeshStandardMaterial).color.setRGB(
        0.88 + frostLevel * 0.12,
        0.9 + frostLevel * 0.1,
        0.95 + frostLevel * 0.05
      );
    }

    // Water jet effects from heated water
    if (waterJetRef.current) {
      const jetIntensity = 0.8 + Math.sin(time * 2.2) * 0.15;
      (waterJetRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = jetIntensity;
      waterJetRef.current.scale.setScalar(jetIntensity);
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

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    if (!isDragging) {
      onClick?.(event);
    }
  };

  const handlePortClick = (port: HeatPumpPort, event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (onPortClick) {
      onPortClick(port, position, event);
    }
  };

  const getPortColor = (type: HeatPumpPort['type']): string => {
    switch (type) {
      case 'electric': return '#FF5722';
      case 'liquid': return '#2196F3';
      case 'gas': return '#FFC107';
      default: return '#666666';
    }
  };

  return (
    <group ref={groupRef} position={position}>
      {/* ULTRA-REALISTIC PROFESSIONAL FOUNDATION AND INFRASTRUCTURE */}
      <group>
        {/* Reinforced Concrete Foundation with Expansion Joints */}
        <mesh position={[0, -0.3, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.5, 0.25, 3.0]} />
          <meshStandardMaterial 
            color="#6D7C84"
            metalness={0.1}
            roughness={0.9}
          />
        </mesh>

        {/* Concrete Rebar Reinforcement Grid */}
        {[...Array<unknown>(10)].map((_, i) => (
          <mesh key={`rebar-x-${i}`} position={[-2.0 + i * 0.45, -0.25, 0]} rotation={[Math.PI/2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.008, 0.008, 3.0, 8]} />
            <meshStandardMaterial color="#8B4513" metalness={0.8} roughness={0.4} />
          </mesh>
        ))}
        {[...Array<unknown>(7)].map((_, i) => (
          <mesh key={`rebar-z-${i}`} position={[0, -0.25, -1.35 + i * 0.45]} rotation={[0, 0, Math.PI/2]} castShadow>
            <cylinderGeometry args={[0.008, 0.008, 4.5, 8]} />
            <meshStandardMaterial color="#8B4513" metalness={0.8} roughness={0.4} />
          </mesh>
        ))}

        {/* Professional Anti-Vibration Isolators */}
        {(
          [[-1.8, -0.18, -1.2], [1.8, -0.18, -1.2], [-1.8, -0.18, 1.2], [1.8, -0.18, 1.2]] as const
        ).map((pos, i) => (
          <group key={`isolator-${i}`} position={pos}>
            <mesh castShadow>
              <cylinderGeometry args={[0.1, 0.1, 0.06, 16]} />
              <meshStandardMaterial color="#1C1C1C" metalness={0.3} roughness={0.8} />
            </mesh>
            <mesh position={[0, 0.035, 0]} castShadow>
              <cylinderGeometry args={[0.08, 0.08, 0.01, 16]} />
              <meshStandardMaterial color="#37474F" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Isolator mounting bolts */}
            {[...Array<unknown>(4)].map((_, j) => {
              const angle = (j * Math.PI) / 2;
              const x = Math.cos(angle) * 0.06;
              const z = Math.sin(angle) * 0.06;
              return (
                <mesh key={`bolt-${j}`} position={[x, -0.035, z]} castShadow>
                  <cylinderGeometry args={[0.005, 0.005, 0.02, 8]} />
                  <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
                </mesh>
              );
            })}
          </group>
        ))}

        {/* Heavy-Duty Professional Equipment Skid */}
        <mesh 
          position={[0, -0.12, 0]} 
          castShadow 
          receiveShadow
          onPointerDown={handlePointerDown}
          onClick={handleClick}
        >
          <boxGeometry args={[4.2, 0.12, 2.8]} />
          <meshStandardMaterial 
            color={isSelected ? "#4CAF50" : "#37474F"}
            metalness={0.88}
            roughness={0.12}
          />
        </mesh>

        {/* Skid Support Beams (I-Beam Construction) */}
        {([[-1.8, -0.12, 0], [1.8, -0.12, 0]] as const).map((pos, i) => (
          <mesh key={`beam-long-${i}`} position={pos} castShadow>
            <boxGeometry args={[0.12, 0.15, 2.8]} />
            <meshStandardMaterial color="#263238" metalness={0.85} roughness={0.18} />
          </mesh>
        ))}
        {([[0, -0.12, -1.25], [0, -0.12, 1.25]] as const).map((pos, i) => (
          <mesh key={`beam-cross-${i}`} position={pos} castShadow>
            <boxGeometry args={[4.0, 0.15, 0.12]} />
            <meshStandardMaterial color="#263238" metalness={0.85} roughness={0.18} />
          </mesh>
        ))}

        {/* Professional Anchor Bolts with Washers */}
        {(
          [[-1.8, -0.22, -1.25], [1.8, -0.22, -1.25], [-1.8, -0.22, 1.25], [1.8, -0.22, 1.25]] as const
        ).map((pos, i) => (
          <group key={`anchor-${i}`} position={pos}>
            <mesh castShadow>
              <cylinderGeometry args={[0.015, 0.015, 0.18, 8]} />
              <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh position={[0, 0.09, 0]} castShadow>
              <cylinderGeometry args={[0.025, 0.025, 0.008, 8]} />
              <meshStandardMaterial color="#E0E0E0" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
        ))}

        {/* Professional Drainage System */}
        <mesh position={[1.8, -0.28, 1.2]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.15, 12]} />
          <meshStandardMaterial color="#37474F" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[1.8, -0.32, 1.2]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.02, 8]} />
          <meshStandardMaterial color="#263238" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* ULTRA-REALISTIC MAIN HEAT PUMP HOUSING */}
      <group>
        {/* Professional Outdoor Unit Cabinet */}
        <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.0, 1.8, 2.5]} />
          <meshStandardMaterial 
            color="#F5F5F5"
            metalness={0.85}
            roughness={0.18}
          />
        </mesh>

        {/* Cabinet Corner Reinforcements */}
        {(
          [[-1.95, 0.8, -1.2], [1.95, 0.8, -1.2], [-1.95, 0.8, 1.2], [1.95, 0.8, 1.2]] as const
        ).map((pos, i) => (
          <mesh key={`corner-${i}`} position={pos} castShadow>
            <boxGeometry args={[0.1, 1.85, 0.1]} />
            <meshStandardMaterial color="#BDBDBD" metalness={0.8} roughness={0.2} />
          </mesh>
        ))}

        {/* Professional Louvered Side Panels for Airflow */}
        {[-2.05, 2.05].map((x, side) => (
          <group key={`louvers-${side}`} position={[x, 0.8, 0]}>
            {[...Array<unknown>(16)].map((_, i) => (
              <mesh key={`louver-${i}`} position={[0, -0.7 + i * 0.09, 0]} rotation={[0, 0, Math.PI/6]} castShadow>
                <boxGeometry args={[0.06, 2.2, 0.025]} />
                <meshStandardMaterial color="#E0E0E0" metalness={0.75} roughness={0.25} />
              </mesh>
            ))}
          </group>
        ))}

        {/* Top Fan Grille and Professional Housing */}
        <mesh position={[0, 1.75, 0]} castShadow>
          <cylinderGeometry args={[0.8, 0.8, 0.12, 24]} />
          <meshStandardMaterial color="#37474F" metalness={0.85} roughness={0.15} />
        </mesh>

        {/* Professional Fan Grille Protection Grid */}
        {[...Array<unknown>(12)].map((_, i) => {
          const angle = (i * Math.PI) / 6;
          const x = Math.cos(angle) * 0.6;
          const z = Math.sin(angle) * 0.6;
          return (
            <mesh key={`grille-${i}`} position={[x, 1.82, z]} rotation={[0, angle, 0]} castShadow>
              <boxGeometry args={[0.025, 0.08, 1.1]} />
              <meshStandardMaterial color="#616161" metalness={0.85} roughness={0.15} />
            </mesh>
          );
        })}

        {/* Concentric Safety Rings */}
        {[0.4, 0.6, 0.75].map((radius, i) => (
          <mesh key={`safety-ring-${i}`} position={[0, 1.82, 0]} castShadow>
            <torusGeometry args={[radius, 0.015, 8, 24]} />
            <meshStandardMaterial color="#757575" metalness={0.8} roughness={0.2} />
          </mesh>
        ))}

        {/* Variable Speed Professional Fan Assembly */}
        <group ref={fanRef} position={[0, 1.65, 0]}>
          {/* Fan Motor Housing */}
          <mesh castShadow>
            <cylinderGeometry args={[0.12, 0.12, 0.25, 20]} />
            <meshStandardMaterial color="#263238" metalness={0.9} roughness={0.08} />
          </mesh>
          
          {/* Motor Cooling Fins */}
          {[...Array<unknown>(12)].map((_, i) => (
            <mesh key={`motor-fin-${i}`} position={[0, 0, 0]} rotation={[0, (i * Math.PI) / 6, 0]} castShadow>
              <boxGeometry args={[0.015, 0.2, 0.14]} />
              <meshStandardMaterial color="#37474F" metalness={0.8} roughness={0.2} />
            </mesh>
          ))}
          
          {/* Professional Fan Blades (Aerodynamically Optimized) */}
          {[...Array<unknown>(7)].map((_, i) => {
            const angle = (i * Math.PI * 2) / 7;
            return (
              <mesh 
                key={`blade-${i}`} 
                position={[Math.cos(angle) * 0.4, 0, Math.sin(angle) * 0.4]} 
                rotation={[0, angle + Math.PI/8, Math.PI/10]}
                castShadow
              >
                <boxGeometry args={[0.5, 0.025, 0.12]} />
                <meshStandardMaterial 
                  color="#455A64" 
                  metalness={0.85} 
                  roughness={0.12}
                />
              </mesh>
            );
          })}

          {/* Fan Hub with Professional Finish */}
          <mesh castShadow>
            <cylinderGeometry args={[0.15, 0.15, 0.05, 20]} />
            <meshStandardMaterial 
              color="#1A237E" 
              metalness={0.95} 
              roughness={0.05}
            />
          </mesh>

          {/* Dynamic Balancing Weights */}
          {[...Array<unknown>(4)].map((_, i) => {
            const angle = (i * Math.PI) / 2;
            const x = Math.cos(angle) * 0.12;
            const z = Math.sin(angle) * 0.12;
            return (
              <mesh key={`weight-${i}`} position={[x, 0.03, z]} castShadow>
                <cylinderGeometry args={[0.01, 0.01, 0.02, 8]} />
                <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
              </mesh>
            );
          })}
        </group>

        {/* Professional Equipment Labels and Nameplates */}
        <mesh position={[0, 0.2, 1.26]} castShadow>
          <boxGeometry args={[0.8, 0.3, 0.01]} />
          <meshStandardMaterial color="#FAFAFA" metalness={0.2} roughness={0.8} />
        </mesh>

        {/* Manufacturer Logo Area */}
        <mesh position={[1.5, 1.2, 1.26]} castShadow>
          <boxGeometry args={[0.4, 0.2, 0.005]} />
          <meshStandardMaterial color="#1976D2" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* ULTRA-REALISTIC PROFESSIONAL SCROLL COMPRESSOR SYSTEM */}
      <group ref={vibrationRef} position={[-1.2, 0.2, -0.5]}>
        {/* Advanced Compressor Foundation/Mounting */}
        <mesh position={[0, -0.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.9, 0.15, 0.7]} />
          <meshStandardMaterial 
            color="#6D7C84"
            metalness={0.1}
            roughness={0.9}
          />
        </mesh>

        {/* Professional Anti-Vibration Mounts */}
        {(
          [[-0.35, -0.33, -0.25], [0.35, -0.33, -0.25], [-0.35, -0.33, 0.25], [0.35, -0.33, 0.25]] as const
        ).map((pos, i) => (
          <mesh key={`comp-mount-${i}`} position={pos} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.03, 12]} />
            <meshStandardMaterial color="#1C1C1C" metalness={0.2} roughness={0.8} />
          </mesh>
        ))}
        
        {/* Hermetic Scroll Compressor Housing */}
        <mesh ref={compressorRef} castShadow receiveShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.8, 24]} />
          <meshStandardMaterial 
            color="#1A237E"
            metalness={0.92}
            roughness={0.08}
            envMapIntensity={0.9}
          />
        </mesh>

        {/* Compressor Shell Weld Seams */}
        <mesh position={[0, 0.25, 0]} castShadow>
          <torusGeometry args={[0.355, 0.01, 8, 24]} />
          <meshStandardMaterial color="#0D47A1" metalness={0.95} roughness={0.05} />
        </mesh>
        <mesh position={[0, -0.25, 0]} castShadow>
          <torusGeometry args={[0.355, 0.01, 8, 24]} />
          <meshStandardMaterial color="#0D47A1" metalness={0.95} roughness={0.05} />
        </mesh>

        {/* Professional Compressor Nameplate */}
        <mesh position={[0.37, 0.15, 0]} castShadow>
          <boxGeometry args={[0.01, 0.25, 0.18]} />
          <meshStandardMaterial color="#FAFAFA" metalness={0.2} roughness={0.8} />
        </mesh>

        {/* Compressor Mounting Bolts with Professional Hardware */}
        {[...Array<unknown>(8)].map((_, i) => {
          const angle = (i * Math.PI) / 4;
          const x = Math.cos(angle) * 0.4;
          const z = Math.sin(angle) * 0.4;
          return (
            <mesh key={`comp-bolt-${i}`} position={[x, -0.42, z]} castShadow>
              <cylinderGeometry args={[0.012, 0.012, 0.05, 8]} />
              <meshStandardMaterial color="#424242" metalness={0.9} roughness={0.1} />
            </mesh>
          );
        })}

        {/* Suction Line Connection (Large, Low Pressure) */}
        <mesh position={[0.25, 0.3, 0.4]} rotation={[Math.PI/2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.2, 16]} />
          <meshStandardMaterial color="#2E7D32" metalness={0.85} roughness={0.15} />
        </mesh>
        <mesh position={[0.25, 0.4, 0.4]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.02, 16]} />
          <meshStandardMaterial color="#1B5E20" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Discharge Line Connection (Small, High Pressure) */}
        <mesh position={[-0.25, 0.3, 0.4]} rotation={[Math.PI/2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.2, 16]} />
          <meshStandardMaterial color="#D32F2F" metalness={0.85} roughness={0.15} />
        </mesh>
        <mesh position={[-0.25, 0.4, 0.4]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.02, 16]} />
          <meshStandardMaterial color="#B71C1C" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Electrical Terminal Box */}
        <mesh position={[0.4, 0.2, 0]} castShadow>
          <boxGeometry args={[0.12, 0.08, 0.1]} />
          <meshStandardMaterial color="#263238" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Compressor Sight Glass */}
        <mesh position={[0, 0, 0.36]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.01, 16]} />
          <meshStandardMaterial 
            color="#E3F2FD" 
            transparent
            opacity={0.9}
            metalness={0.1}
            roughness={0.05}
          />
        </mesh>

        {/* Internal Scroll Assembly (Visible Through Cutaway) */}
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.15, 20]} />
          <meshStandardMaterial 
            color="#FFD700" 
            metalness={0.95} 
            roughness={0.03}
          />
        </mesh>

        {/* Scroll Orbiting Motion Indicator */}
        <mesh position={[0.05, 0, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.16, 12]} />
          <meshStandardMaterial 
            color="#FF9800" 
            metalness={0.9} 
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* PROFESSIONAL HEAT EXCHANGER COILS */}
      <group>
        {/* Evaporator Coil (Air Side) - Ultra-Realistic */}
        <group position={[1.0, 0.6, -1.0]}>
          <mesh ref={evaporatorFinsRef} castShadow>
            <boxGeometry args={[1.5, 1.0, 0.25]} />
            <meshStandardMaterial 
              color="#B0BEC5"
              metalness={0.85}
              roughness={0.25}
            />
          </mesh>
          
          {/* Ultra-Fine Fin Pattern */}
          {[...Array<unknown>(20)].map((_, i) => (
            <mesh key={`evap-fin-${i}`} position={[-0.7 + i * 0.07, 0, 0]} castShadow>
              <boxGeometry args={[0.008, 0.95, 0.22]} />
              <meshStandardMaterial color="#90A4AE" metalness={0.85} roughness={0.35} />
            </mesh>
          ))}

          {/* Copper Refrigerant Tubes with Professional Bends */}
          {[...Array<unknown>(8)].map((_, i) => (
            <mesh key={`evap-tube-${i}`} position={[0, -0.4 + i * 0.1, 0]} rotation={[0, 0, Math.PI/2]} castShadow>
              <cylinderGeometry args={[0.01, 0.01, 1.5, 12]} />
              <meshStandardMaterial color="#B87333" metalness={0.95} roughness={0.05} />
            </mesh>
          ))}

          {/* Tube Bends and U-Returns */}
          {[...Array<unknown>(4)].map((_, i) => (
            <mesh key={`evap-bend-${i}`} position={[0.7, -0.3 + i * 0.2, 0]} rotation={[Math.PI/2, 0, 0]} castShadow>
              <torusGeometry args={[0.05, 0.01, 8, 16]} />
              <meshStandardMaterial color="#B87333" metalness={0.95} roughness={0.05} />
            </mesh>
          ))}

          {/* Frost Accumulation Areas */}
          <mesh position={[0, -0.3, 0.13]} castShadow>
            <boxGeometry args={[1.4, 0.3, 0.01]} />
            <meshStandardMaterial 
              color="#F0F8FF" 
              transparent
              opacity={0.3}
              metalness={0.0}
              roughness={1.0}
            />
          </mesh>
        </group>

        {/* Condenser Coil (Water Side Heat Exchanger) - Professional Grade */}
        <group position={[0, 0.4, 0.8]}>
          <mesh ref={heatExchangerRef} castShadow receiveShadow>
            <cylinderGeometry args={[0.3, 0.3, 1.2, 24]} />
            <meshStandardMaterial 
              color="#1976D2"
              metalness={0.88}
              roughness={0.12}
              emissive="#0D47A1"
              emissiveIntensity={0.1}
            />
          </mesh>

          {/* Professional Tube Bundle Pattern */}
          {[...Array<unknown>(12)].map((_, i) => {
            const angle = (i * Math.PI) / 6;
            const x = Math.cos(angle) * 0.18;
            const z = Math.sin(angle) * 0.18;
            return (
              <mesh key={`cond-tube-${i}`} position={[x, 0, z]} castShadow>
                <cylinderGeometry args={[0.015, 0.015, 1.15, 12]} />
                <meshStandardMaterial color="#B87333" metalness={0.95} roughness={0.05} />
              </mesh>
            );
          })}

          {/* Water Inlet/Outlet Manifolds with Professional Fittings */}
          <mesh position={[-0.4, 0, 0]} rotation={[0, 0, Math.PI/2]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.25, 16]} />
            <meshStandardMaterial color="#1565C0" metalness={0.85} roughness={0.15} />
          </mesh>
          <mesh position={[0.4, 0, 0]} rotation={[0, 0, Math.PI/2]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.25, 16]} />
            <meshStandardMaterial color="#1565C0" metalness={0.85} roughness={0.15} />
          </mesh>

          {/* Manifold Flanges */}
          <mesh position={[-0.52, 0, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.12, 0.02, 16]} />
            <meshStandardMaterial color="#0D47A1" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0.52, 0, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.12, 0.02, 16]} />
            <meshStandardMaterial color="#0D47A1" metalness={0.9} roughness={0.1} />
          </mesh>

          {/* Heat Exchanger Insulation Jacket */}
          <mesh position={[0, 0, 0]} castShadow>
            <cylinderGeometry args={[0.32, 0.32, 1.0, 24]} />
            <meshStandardMaterial 
              color="#37474F" 
              transparent
              opacity={0.8}
              metalness={0.1}
              roughness={0.9}
            />
          </mesh>
        </group>
      </group>

      {/* REFRIGERANT LINES WITH PROFESSIONAL INSULATION */}
      <group>
        {/* Suction Line (Large, Insulated) */}
        <mesh ref={refrigerantFlowRef} position={[-0.4, 0.7, 0]} rotation={[0, Math.PI/3, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 2.0, 16]} />
          <meshStandardMaterial 
            color="#2E7D32"
            transparent
            opacity={0.9}
            metalness={0.85}
            roughness={0.15}
          />
        </mesh>

        {/* Professional Insulation Wrap */}
        <mesh position={[-0.4, 0.7, 0]} rotation={[0, Math.PI/3, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.07, 1.98, 16]} />
          <meshStandardMaterial 
            color="#1C1C1C"
            metalness={0.1}
            roughness={0.95}
          />
        </mesh>

        {/* Liquid Line (Small, Copper) */}
        <mesh position={[0.4, 0.6, 0]} rotation={[0, -Math.PI/4, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 1.5, 12]} />
          <meshStandardMaterial 
            color="#B87333"
            metalness={0.95}
            roughness={0.05}
          />
        </mesh>

        {/* Professional Service Valves */}
        {(
          [
            { pos: [-0.6, 1.2, 0.4], type: 'high', color: '#D32F2F' },
            { pos: [0.6, 1.2, 0.4], type: 'low', color: '#2E7D32' }
          ] as const
        ).map((valve, i) => (
          <group key={`service-${i}`} position={valve.pos}>
            <mesh castShadow>
              <cylinderGeometry args={[0.025, 0.025, 0.1, 12]} />
              <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh position={[0, 0.055, 0]} castShadow>
              <cylinderGeometry args={[0.035, 0.035, 0.01, 8]} />
              <meshStandardMaterial color={valve.color} metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Service Port Cap */}
            <mesh position={[0, 0.08, 0]} castShadow>
              <cylinderGeometry args={[0.015, 0.015, 0.02, 8]} />
              <meshStandardMaterial color="#1A1A1A" metalness={0.8} roughness={0.3} />
            </mesh>
          </group>
        ))}

        {/* Pressure Relief Valve */}
        <mesh position={[0, 1.4, 0.6]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.08, 8]} />
          <meshStandardMaterial color="#FF5722" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* ENVIRONMENTAL EFFECTS */}
      <group>
        {/* Professional Steam Effect During Heating */}
        <mesh ref={steamRef} position={[0, 2.8, 0]} castShadow>
          <sphereGeometry args={[0.4, 20, 16]} />
          <meshStandardMaterial 
            color="#E1F5FE"
            transparent
            opacity={0.18}
            metalness={0.0}
            roughness={1.0}
          />
        </mesh>

        {/* Multiple Steam Plumes for Realistic Effect */}
        {[...Array<unknown>(3)].map((_, i) => (
          <mesh key={`steam-${i}`} position={[0.3 - i * 0.3, 2.5 + i * 0.1, 0.2 - i * 0.1]} castShadow>
            <sphereGeometry args={[0.2, 12, 10]} />
            <meshStandardMaterial 
              color="#F0F8FF"
              transparent
              opacity={0.12}
              metalness={0.0}
              roughness={1.0}
            />
          </mesh>
        ))}

        {/* Condensate Drain System */}
        <mesh ref={condensateRef} position={[1.8, -0.15, -1.0]} castShadow>
          <sphereGeometry args={[0.025, 10, 8]} />
          <meshStandardMaterial 
            color="#1976D2"
            transparent
            opacity={0.8}
            metalness={0.1}
            roughness={0.8}
          />
        </mesh>

        {/* Professional Condensate Drain Line */}
        <mesh position={[1.8, -0.25, -1.0]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.25, 12]} />
          <meshStandardMaterial color="#616161" metalness={0.8} roughness={0.25} />
        </mesh>

        {/* Drain Pan */}
        <mesh position={[1.8, -0.35, -1.0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.02, 16]} />
          <meshStandardMaterial color="#455A64" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Water Jets from Heat Exchanger (Heated Water Effect) */}
        <mesh ref={waterJetRef} position={[0.4, 0.4, 0.9]} castShadow>
          <coneGeometry args={[0.02, 0.1, 8]} />
          <meshStandardMaterial 
            color="#1976D2"
            emissive="#42A5F5"
            emissiveIntensity={0.6}
            transparent
            opacity={0.7}
          />
        </mesh>
      </group>

      {/* ULTRA-REALISTIC PROFESSIONAL CONTROL PANEL AND INSTRUMENTATION */}
      <group position={[0, 0, 1.3]}>
        {/* Professional Control Panel Housing (NEMA 4X) */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.4, 1.2, 0.18]} />
          <meshStandardMaterial 
            color="#263238" 
            metalness={0.88} 
            roughness={0.15}
          />
        </mesh>

        {/* Professional Gasket Seal */}
        <mesh position={[0, 0, 0.085]} castShadow>
          <boxGeometry args={[1.35, 1.15, 0.005]} />
          <meshStandardMaterial color="#1A1A1A" metalness={0.1} roughness={0.9} />
        </mesh>

        {/* HMI Touchscreen Display */}
        <mesh ref={temperatureDisplayRef} position={[0, 0.25, 0.095]} castShadow>
          <boxGeometry args={[0.6, 0.35, 0.02]} />
          <meshStandardMaterial 
            color="#00BCD4" 
            emissive="#00BCD4" 
            emissiveIntensity={0.85} 
          />
        </mesh>

        {/* Display Bezel */}
        <mesh position={[0, 0.25, 0.09]} castShadow>
          <boxGeometry args={[0.65, 0.4, 0.01]} />
          <meshStandardMaterial color="#1A1A1A" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Professional Temperature Readout */}
        <Text
          position={[0, 0.35, 0.106]}
          fontSize={0.03}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
        >
          POOL TEMP
        </Text>
        <Text
          position={[0, 0.25, 0.106]}
          fontSize={0.06}
          color="#00FF41"
          anchorX="center"
          anchorY="middle"
        >
          28.2°C
        </Text>
        <Text
          position={[0, 0.15, 0.106]}
          fontSize={0.025}
          color="#FFD700"
          anchorX="center"
          anchorY="middle"
        >
          SETPOINT: 28.0°C
        </Text>

        {/* Professional Pressure Gauge */}
        <group position={[-0.4, -0.15, 0.1]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.02, 20]} />
            <meshStandardMaterial color="#F5F5F5" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0, 0.015]} castShadow>
            <cylinderGeometry args={[0.07, 0.07, 0.001, 20]} />
            <meshStandardMaterial color="#FFFFFF" metalness={0.1} roughness={0.9} />
          </mesh>
          {/* Pressure Gauge Needle */}
          <mesh ref={pressureGaugeRef} position={[0, 0, 0.016]} castShadow>
            <boxGeometry args={[0.001, 0.05, 0.002]} />
            <meshStandardMaterial color="#D32F2F" metalness={0.8} roughness={0.2} />
          </mesh>
          <Text
            position={[0, -0.12, 0.02]}
            fontSize={0.015}
            color="#263238"
            anchorX="center"
            anchorY="middle"
          >
            PRESSURE
          </Text>
        </group>

        {/* Digital Flow Meter */}
        <group position={[0.4, -0.15, 0.1]}>
          <mesh castShadow>
            <boxGeometry args={[0.12, 0.08, 0.03]} />
            <meshStandardMaterial color="#1A1A1A" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0, 0.02]} castShadow>
            <boxGeometry args={[0.1, 0.06, 0.005]} />
            <meshStandardMaterial 
              color="#00FF00" 
              emissive="#00FF00" 
              emissiveIntensity={0.6}
            />
          </mesh>
          {/* Flow Meter Turbine */}
          <mesh ref={flowMeterRef} position={[0, 0, 0.025]} castShadow>
            <cylinderGeometry args={[0.01, 0.01, 0.002, 6]} />
            <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
          </mesh>
          <Text
            position={[0, 0, 0.026]}
            fontSize={0.01}
            color="#000000"
            anchorX="center"
            anchorY="middle"
          >
            125 LPM
          </Text>
          <Text
            position={[0, -0.12, 0.02]}
            fontSize={0.015}
            color="#263238"
            anchorX="center"
            anchorY="middle"
          >
            FLOW RATE
          </Text>
        </group>

        {/* Professional Control Buttons */}
        {(
          [
            { pos: [-0.35, -0.4, 0.095], label: 'POWER', color: '#4CAF50' },
            { pos: [-0.1, -0.4, 0.095], label: 'SET', color: '#FF9800' },
            { pos: [0.15, -0.4, 0.095], label: 'MODE', color: '#2196F3' },
            { pos: [0.4, -0.4, 0.095], label: 'RESET', color: '#F44336' }
          ] as const
        ).map((btn, i) => (
          <group key={`button-${i}`}>
            <mesh position={btn.pos} castShadow>
              <cylinderGeometry args={[0.03, 0.03, 0.015, 16]} />
              <meshStandardMaterial color={btn.color} metalness={0.8} roughness={0.2} />
            </mesh>
            <Text
              position={[btn.pos[0], btn.pos[1] - 0.08, btn.pos[2]]}
              fontSize={0.012}
              color="#E0E0E0"
              anchorX="center"
              anchorY="middle"
            >
              {btn.label}
            </Text>
          </group>
        ))}

        {/* Professional Multi-LED Status Panel */}
        <group position={[0, -0.25, 0.095]}>
          {(
            [
              { pos: [-0.25, 0, 0], label: 'SYSTEM', color: '#4CAF50', ref: systemLEDRef },
              { pos: [-0.08, 0, 0], label: 'HEATING', color: '#FF5722', ref: statusLEDRef },
              { pos: [0.08, 0, 0], label: 'DEFROST', color: '#2196F3', ref: defrostLEDRef },
              { pos: [0.25, 0, 0], label: 'ALARM', color: '#F44336', ref: alarmLEDRef }
            ] as const
          ).map((led, i) => (
            <group key={`led-${i}`}>
              <mesh ref={led.ref} position={led.pos} castShadow>
                <cylinderGeometry args={[0.012, 0.012, 0.008, 8]} />
                <meshStandardMaterial 
                  color={led.color}
                  emissive={led.color}
                  emissiveIntensity={i === 0 ? 0.7 : i === 1 ? 0.5 : i === 2 ? 0 : 0}
                />
              </mesh>
              <Text
                position={[led.pos[0], led.pos[1] - 0.04, led.pos[2]]}
                fontSize={0.008}
                color="#BDBDBD"
                anchorX="center"
                anchorY="middle"
              >
                {led.label}
              </Text>
            </group>
          ))}
        </group>

        {/* Emergency Stop Button */}
        <mesh position={[0.5, 0.4, 0.095]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.02, 16]} />
          <meshStandardMaterial color="#D32F2F" metalness={0.8} roughness={0.2} />
        </mesh>
        <Text
          position={[0.5, 0.32, 0.1]}
          fontSize={0.008}
          color="#D32F2F"
          anchorX="center"
          anchorY="middle"
        >
          E-STOP
        </Text>

        {/* Professional Cable Glands */}
        <mesh position={[-0.65, -0.5, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.18, 12]} />
          <meshStandardMaterial color="#1A1A1A" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0.65, -0.5, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.18, 12]} />
          <meshStandardMaterial color="#1A1A1A" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>

      {/* Connection Ports */}
      {connectionPorts.map((port) => (
        <group key={port.id} position={port.position}>
          <mesh
            onClick={(e) => handlePortClick(port, e)}
            castShadow
          >
            <cylinderGeometry args={[0.05, 0.05, 0.1, 8]} />
            <meshStandardMaterial 
              color={getPortColor(port.type)} 
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
          
          <Text
            position={[0, -0.15, 0]}
            fontSize={0.018}
            color="#E0E0E0"
            anchorX="center"
            anchorY="middle"
          >
            {port.label}
          </Text>
        </group>
      ))}

      {/* Selection indicator */}
      {isSelected && isDraggable && (
        <>
          <mesh position={[0, 2, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.3, 6]} />
            <meshStandardMaterial color="#ffeb3b" emissive="#ffeb3b" emissiveIntensity={0.3} />
          </mesh>
          
          <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.8, 2.2, 16]} />
            <meshBasicMaterial color="#2196F3" transparent opacity={0.5} />
          </mesh>
        </>
      )}
    </group>
  );
};

export default HeatPump; 