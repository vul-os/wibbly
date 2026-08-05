import { useRef, useState } from 'react';
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import type { PlantObjectComponent, PlantObjectProps } from './types';

interface WaterSupplyProps extends PlantObjectProps {
  position: [number, number, number];
  showCoordinates?: boolean;
}

interface WaterSupplyPort {
  id: string;
  label: string;
  position: [number, number, number];
  type: 'electric' | 'liquid';
  direction: 'input' | 'output';
}

const WaterSupply: PlantObjectComponent<WaterSupplyProps, WaterSupplyPort> = ({
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
  const [isDragging, setIsDragging] = useState(false);
  const [, setDragStart] = useState<[number, number, number] | null>(null);

  // Animation states - Professional grade equipment
  const pump1ImpellerRef = useRef<THREE.Mesh>(null);
  const pump2ImpellerRef = useRef<THREE.Mesh>(null);
  // Declared and read in the useFrame loop below but never attached to any
  // JSX element - same dead-ref class as RackSystem's meshRef/HeatPump's
  // condenserFinsRef. `.current` is always null; pre-existing, not fixed.
  const pump1MotorRef = useRef<THREE.Mesh>(null);
  const pump2MotorRef = useRef<THREE.Mesh>(null);
  const filterRotorRef = useRef<THREE.Mesh>(null);
  const waterRef = useRef<THREE.Mesh>(null);
  const waterFlowRef = useRef<THREE.Mesh>(null); // also never attached, see above
  const waterJetRef = useRef<THREE.Mesh>(null);
  const pressureGaugeRef = useRef<THREE.Mesh>(null);
  const flowMeterRef = useRef<THREE.Mesh>(null); // also never attached, see above
  const statusLEDRef = useRef<THREE.Mesh>(null);
  const systemLEDRef = useRef<THREE.Mesh>(null);
  const alarmLEDRef = useRef<THREE.Mesh>(null);
  const bubbleRef = useRef<THREE.Mesh>(null);
  const steamRef = useRef<THREE.Mesh>(null);

  // Water supply system connection ports
  const connectionPorts: WaterSupplyPort[] = [
    // Water inlet/outlet
    { id: 'water_inlet', label: 'INLET', position: [-1.5, 0.5, 1.8], type: 'liquid', direction: 'input' },
    { id: 'filtered_outlet', label: 'FILTERED', position: [1.5, 0.5, 1.8], type: 'liquid', direction: 'output' },
    { id: 'main_outlet', label: 'MAIN-OUT', position: [1.5, 0.2, 1.8], type: 'liquid', direction: 'output' },
    { id: 'emergency_outlet', label: 'EMRG-OUT', position: [1.5, -0.1, 1.8], type: 'liquid', direction: 'output' },
    
    // Electrical connections
    { id: 'power_input', label: 'PWR-IN', position: [-1.2, -0.8, 1.8], type: 'electric', direction: 'input' },
    { id: 'pump1_control', label: 'PUMP1', position: [-0.8, -0.8, 1.8], type: 'electric', direction: 'input' },
    { id: 'pump2_control', label: 'PUMP2', position: [-0.4, -0.8, 1.8], type: 'electric', direction: 'input' },
    { id: 'filter_control', label: 'FILTER', position: [0, -0.8, 1.8], type: 'electric', direction: 'input' },
    
    // Monitoring outputs
    { id: 'pressure_signal', label: 'PRESSURE', position: [0.4, -0.8, 1.8], type: 'electric', direction: 'output' },
    { id: 'flow_signal', label: 'FLOW', position: [0.8, -0.8, 1.8], type: 'electric', direction: 'output' },
    { id: 'level_signal', label: 'LEVEL', position: [1.2, -0.8, 1.8], type: 'electric', direction: 'output' },
    
    // Waste/drain
    { id: 'drain_outlet', label: 'DRAIN', position: [0, -1.0, 1.8], type: 'liquid', direction: 'output' }
  ];

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Professional pump animations with realistic speeds
    if (pump1ImpellerRef.current) {
      pump1ImpellerRef.current.rotation.z = time * 18; // High-efficiency centrifugal pump
    }
    if (pump2ImpellerRef.current) {
      pump2ImpellerRef.current.rotation.z = time * 15; // Backup pump, slightly slower
    }
    
    // Motor vibration simulation
    if (pump1MotorRef.current) {
      const vibration = Math.sin(time * 60) * 0.002; // 60Hz motor vibration
      pump1MotorRef.current.position.y = 0.5 + vibration;
    }
    if (pump2MotorRef.current) {
      const vibration = Math.sin(time * 60 + Math.PI/3) * 0.002;
      pump2MotorRef.current.position.y = 0.5 + vibration;
    }
    
    // Advanced filter rotation with variable speed
    if (filterRotorRef.current) {
      filterRotorRef.current.rotation.y = time * 1.8 + Math.sin(time * 0.5) * 0.1;
    }
    
    // Realistic water level animation
    if (waterRef.current) {
      (waterRef.current.material as THREE.MeshStandardMaterial).opacity = 0.4 + Math.sin(time * 2) * 0.1;
    }

    // Professional water flow effects
    if (waterFlowRef.current) {
      waterFlowRef.current.rotation.z = time * 5; // Flow indicator rotation
    }
    if (waterJetRef.current) {
      const jetIntensity = 0.7 + Math.sin(time * 4) * 0.2;
      (waterJetRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = jetIntensity;
    }

    // Industrial gauge animations
    if (pressureGaugeRef.current) {
      const pressure = 85 + Math.sin(time * 1.2) * 5; // Pressure variation 80-90 PSI
      pressureGaugeRef.current.rotation.z = ((pressure - 40) / 100) * Math.PI - Math.PI/2;
    }
    if (flowMeterRef.current) {
      flowMeterRef.current.rotation.z = time * 8; // Flow meter turbine
    }

    // Professional status LED patterns
    if (statusLEDRef.current) {
      const intensity = 0.9 + Math.sin(time * 2) * 0.1; // System operational
      (statusLEDRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity;
    }
    if (systemLEDRef.current) {
      const blinkRate = 1.5;
      const intensity = Math.sin(time * blinkRate) > 0 ? 0.9 : 0.3; // Heartbeat pattern
      (systemLEDRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity;
    }
    if (alarmLEDRef.current) {
      (alarmLEDRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0; // No alarms (off)
    }

    // Water bubbles and steam effects
    if (bubbleRef.current) {
      bubbleRef.current.position.y = 0.2 + Math.sin(time * 3) * 0.1;
      (bubbleRef.current.material as THREE.MeshStandardMaterial).opacity = 0.3 + Math.sin(time * 4) * 0.2;
    }
    if (steamRef.current) {
      steamRef.current.rotation.y = time * 0.5;
      steamRef.current.position.y = 2.5 + Math.sin(time * 2) * 0.05;
    }
  });

  const { camera, gl } = useThree();

  const GRID_SIZE = gridSize || 1.0;

  const snapToGrid = (value: number): number => {
    if (!gridSnap) return value;
    return Math.round(value / GRID_SIZE) * GRID_SIZE;
  };

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    if (!isDraggable) {
      onClick?.(event);
      return;
    }

    event.stopPropagation();
    let hasMovedMouse = false;
    setDragStart(position);
    gl.domElement.style.cursor = 'grabbing';

    const handlePointerMove = (moveEvent: MouseEvent | TouchEvent) => {
      if (!onDrag) return;

      // A TouchEvent carries its coordinates on `.touches[0]`, not on the
      // event itself — reading `.clientX`/`.clientY` straight off the event
      // (as this used to) is always `undefined` for touch input, which is
      // why touch-drag never moved anything.
      const point = 'touches' in moveEvent ? moveEvent.touches[0] : moveEvent;
      if (!point) return;

      // Only set dragging to true when we actually move
      if (!hasMovedMouse) {
        hasMovedMouse = true;
        setIsDragging(true);
      }

      // Get intersection with ground plane
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      mouse.x = (point.clientX / gl.domElement.clientWidth) * 2 - 1;
      mouse.y = -(point.clientY / gl.domElement.clientHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // Intersect with ground plane at y=0
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const intersection = new THREE.Vector3();

      if (raycaster.ray.intersectPlane(plane, intersection)) {
        // Snap to grid for CAD-like behavior
        const snappedX = snapToGrid(intersection.x);
        const snappedZ = snapToGrid(intersection.z);
        const newPosition: [number, number, number] = [snappedX, position[1], snappedZ];
        onDrag(newPosition);
      }
    };

    const handlePointerUp = () => {
      // If no mouse movement occurred, it's a click, not a drag
      if (!hasMovedMouse) {
        setIsDragging(false);
        setDragStart(null);
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
      setDragStart(null);
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
    (event as unknown as { preventDefault?: () => void }).preventDefault?.();
  };

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    if (!isDragging) {
      onClick?.(event);
    }
  };

  const handlePortClick = (port: WaterSupplyPort, event: ThreeEvent<MouseEvent>) => {
    if (onPortClick) {
      const worldPosition = new THREE.Vector3(...port.position).add(new THREE.Vector3(...position));
      onPortClick(port, [worldPosition.x, worldPosition.y, worldPosition.z], event);
    }
  };

  return (
    <group ref={groupRef} position={position}>
      {/* Water Supply System */}
      <group>
        {/* Professional Concrete Foundation */}
        <mesh position={[0, -0.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.0, 0.4, 3.0]} />
          <meshStandardMaterial 
            color="#6D7C84"
            metalness={0.1}
            roughness={0.9}
          />
        </mesh>
        
        {/* Reinforcement Rebar Grid */}
        {[...Array(8)].map((_, i) => (
          <mesh key={`rebar-x-${i}`} position={[-1.75 + i * 0.5, -0.15, 0]} rotation={[Math.PI/2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.008, 0.008, 3.0, 8]} />
            <meshStandardMaterial color="#8B4513" metalness={0.8} roughness={0.4} />
          </mesh>
        ))}
        {[...Array(7)].map((_, i) => (
          <mesh key={`rebar-z-${i}`} position={[0, -0.15, -1.25 + i * 0.42]} rotation={[0, 0, Math.PI/2]} castShadow>
            <cylinderGeometry args={[0.008, 0.008, 4.0, 8]} />
            <meshStandardMaterial color="#8B4513" metalness={0.8} roughness={0.4} />
          </mesh>
        ))}

        {/* Industrial Base Platform with Anti-Slip Surface */}
        <mesh 
          position={[0, 0.1, 0]}
          castShadow 
          receiveShadow
          onPointerDown={handlePointerDown}
          onClick={handleClick}
        >
          <boxGeometry args={[3.8, 0.2, 2.8]} />
          <meshStandardMaterial 
            color={isSelected ? "#4CAF50" : "#37434A"}
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>

        {/* Anti-Slip Diamond Plate Pattern */}
        {[...Array(15)].map((_, x) => 
          [...Array(11)].map((_, z) => (
            <mesh 
              key={`diamond-${x}-${z}`} 
              position={[-1.75 + x * 0.25, 0.21, -1.25 + z * 0.25]} 
              castShadow
            >
              <cylinderGeometry args={[0.02, 0.015, 0.006, 4]} />
              <meshStandardMaterial color="#2A3439" metalness={0.8} roughness={0.3} />
            </mesh>
          ))
        )}

        {/* Professional Control Enclosure NEMA 4X */}
        <mesh position={[0, 0, 1.8]} castShadow receiveShadow>
          <boxGeometry args={[3.2, 2.6, 0.6]} />
          <meshStandardMaterial 
            color="#F5F5F5" 
            metalness={0.8}
            roughness={0.15}
          />
        </mesh>

        {/* Enclosure Door with Professional Hardware */}
        <mesh position={[0.1, 0, 2.11]} castShadow>
          <boxGeometry args={[2.8, 2.4, 0.08]} />
          <meshStandardMaterial 
            color="#E8EAF6" 
            metalness={0.7}
            roughness={0.2}
          />
        </mesh>

        {/* Door Handle (Industrial T-Handle) */}
        <mesh position={[-1.2, 0.3, 2.16]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.12, 12]} />
          <meshStandardMaterial color="#1A1A1A" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[-1.2, 0.3, 2.22]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.02, 12]} />
          <meshStandardMaterial color="#1A1A1A" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Professional Latches */}
        <mesh position={[-1.2, 0.8, 2.16]} castShadow>
          <boxGeometry args={[0.05, 0.03, 0.12]} />
          <meshStandardMaterial color="#333333" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[-1.2, -0.2, 2.16]} castShadow>
          <boxGeometry args={[0.05, 0.03, 0.12]} />
          <meshStandardMaterial color="#333333" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Door Gasket (Weather Seal) */}
        <mesh position={[0.1, 0, 2.065]} castShadow>
          <boxGeometry args={[2.85, 2.45, 0.01]} />
          <meshStandardMaterial color="#1A1A1A" metalness={0.1} roughness={0.8} />
        </mesh>

        {/* Ventilation Louvers */}
        {[...Array(8)].map((_, i) => (
          <mesh key={`louver-${i}`} position={[0.8, -0.8 + i * 0.15, 2.08]} castShadow>
            <boxGeometry args={[0.6, 0.02, 0.03]} />
            <meshStandardMaterial color="#B0BEC5" metalness={0.8} roughness={0.2} />
          </mesh>
        ))}

        {/* Professional Mounting Brackets */}
        {[[-1.4, 1.1], [1.4, 1.1], [-1.4, -1.1], [1.4, -1.1]].map(([x, y], i) => (
          <group key={`bracket-${i}`} position={[x, y, 1.5]}>
            <mesh castShadow>
              <boxGeometry args={[0.12, 0.12, 0.6]} />
              <meshStandardMaterial color="#37474F" metalness={0.8} roughness={0.3} />
            </mesh>
            {/* Mounting bolts */}
            <mesh position={[0, 0, 0.31]} castShadow>
              <cylinderGeometry args={[0.015, 0.015, 0.06, 6]} />
              <meshStandardMaterial color="#1A1A1A" metalness={0.9} roughness={0.1} />
            </mesh>
          </group>
        ))}

        {/* Cable Entry Glands */}
        <mesh position={[-1.4, -1.1, 1.9]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.1, 12]} />
          <meshStandardMaterial color="#1A1A1A" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[1.4, -1.1, 1.9]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.1, 12]} />
          <meshStandardMaterial color="#1A1A1A" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Professional Water Storage Tank System */}
        <group position={[-1.0, 0.8, 0.3]}>
          {/* Tank Support Structure */}
          {[...Array(4)].map((_, i) => {
            const angle = (i * Math.PI) / 2;
            const x = Math.cos(angle) * 0.6;
            const z = Math.sin(angle) * 0.6;
            return (
              <group key={`support-${i}`} position={[x, -0.5, z]}>
                <mesh castShadow>
                  <cylinderGeometry args={[0.04, 0.04, 1.0, 12]} />
                  <meshStandardMaterial color="#37474F" metalness={0.8} roughness={0.2} />
                </mesh>
                <mesh position={[0, -0.52, 0]} castShadow>
                  <cylinderGeometry args={[0.08, 0.08, 0.04, 12]} />
                  <meshStandardMaterial color="#263238" metalness={0.9} roughness={0.1} />
                </mesh>
              </group>
            );
          })}
          
          {/* Main storage tank with professional finish */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.55, 0.55, 1.6, 24]} />
            <meshStandardMaterial 
              color="#E8EAF6" 
              metalness={0.95}
              roughness={0.05}
              envMapIntensity={0.8}
            />
          </mesh>
          
          {/* Tank Shell Weld Seams */}
          <mesh position={[0, 0.4, 0]} castShadow>
            <torusGeometry args={[0.555, 0.008, 8, 24]} />
            <meshStandardMaterial color="#D0D0D0" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0, -0.4, 0]} castShadow>
            <torusGeometry args={[0.555, 0.008, 8, 24]} />
            <meshStandardMaterial color="#D0D0D0" metalness={0.9} roughness={0.2} />
          </mesh>

          {/* Professional Dished Head (ASME Compliant) */}
          <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
            <sphereGeometry args={[0.55, 20, 12, 0, Math.PI * 2, 0, Math.PI/2]} />
            <meshStandardMaterial 
              color="#F0F4F8" 
              metalness={0.95}
              roughness={0.03}
              envMapIntensity={0.9}
            />
          </mesh>
          
          {/* Top Head Weld */}
          <mesh position={[0, 0.8, 0]} castShadow>
            <torusGeometry args={[0.555, 0.01, 8, 24]} />
            <meshStandardMaterial color="#C8C8C8" metalness={0.9} roughness={0.2} />
          </mesh>

          {/* Bottom Dished Head */}
          <mesh position={[0, -0.8, 0]} rotation={[Math.PI, 0, 0]} castShadow receiveShadow>
            <sphereGeometry args={[0.55, 20, 12, 0, Math.PI * 2, 0, Math.PI/2]} />
            <meshStandardMaterial 
              color="#F0F4F8" 
              metalness={0.95}
              roughness={0.03}
              envMapIntensity={0.9}
            />
          </mesh>

          {/* Realistic Water with Advanced Materials */}
          <mesh ref={waterRef} position={[0, 0.1, 0]} castShadow>
            <cylinderGeometry args={[0.52, 0.52, 1.2, 24]} />
            <meshStandardMaterial 
              color="#1976D2" 
              transparent
              opacity={0.6}
              metalness={0.1}
              roughness={0.1}
              envMapIntensity={0.3}
            />
          </mesh>
          
          {/* Water Surface Bubbles */}
          <mesh ref={bubbleRef} position={[0, 0.72, 0]} castShadow>
            <sphereGeometry args={[0.51, 16, 8]} />
            <meshStandardMaterial 
              color="#42A5F5" 
              transparent
              opacity={0.2}
              metalness={0.0}
              roughness={0.9}
            />
          </mesh>

          {/* Professional Level Gauge System */}
          <group position={[0.58, 0, 0]}>
            {/* Gauge Glass Housing */}
            <mesh castShadow>
              <boxGeometry args={[0.08, 1.6, 0.08]} />
              <meshStandardMaterial color="#37474F" metalness={0.8} roughness={0.2} />
            </mesh>
            
            {/* Gauge Glass */}
            <mesh position={[0.01, 0, 0]} castShadow>
              <boxGeometry args={[0.06, 1.55, 0.06]} />
              <meshStandardMaterial 
                color="#E3F2FD" 
                transparent
                opacity={0.8}
                metalness={0.0}
                roughness={0.1}
              />
            </mesh>
            
            {/* Water Level in Gauge */}
            <mesh position={[0.015, -0.2, 0]} castShadow>
              <boxGeometry args={[0.05, 1.0, 0.05]} />
              <meshStandardMaterial 
                color="#2196F3" 
                transparent
                opacity={0.7}
                metalness={0.1}
                roughness={0.8}
              />
            </mesh>
            
            {/* Level Scale Markings */}
            {[...Array(11)].map((_, i) => (
              <mesh key={`scale-${i}`} position={[0.045, -0.75 + i * 0.15, 0]} castShadow>
                <boxGeometry args={[0.02, 0.01, 0.001]} />
                <meshStandardMaterial color="#FFEB3B" metalness={0.9} roughness={0.1} />
              </mesh>
            ))}
          </group>

          {/* Tank Nozzles and Connections */}
          {/* Top Manway */}
          <mesh position={[0, 1.0, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.15, 0.08, 16]} />
            <meshStandardMaterial color="#37474F" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 1.04, 0]} castShadow>
            <cylinderGeometry args={[0.18, 0.18, 0.02, 16]} />
            <meshStandardMaterial color="#263238" metalness={0.9} roughness={0.1} />
          </mesh>

          {/* Overflow Nozzle */}
          <mesh position={[0.45, 0.6, 0]} rotation={[0, 0, Math.PI/2]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.2, 12]} />
            <meshStandardMaterial color="#1976D2" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Drain Valve */}
          <mesh position={[0, -0.85, 0.45]} rotation={[Math.PI/2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.15, 12]} />
            <meshStandardMaterial color="#D32F2F" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Tank Nameplate */}
          <mesh position={[0, 0, 0.56]} castShadow>
            <boxGeometry args={[0.4, 0.15, 0.005]} />
            <meshStandardMaterial color="#FAFAFA" metalness={0.2} roughness={0.8} />
          </mesh>
        </group>

        {/* Pump System 1 */}
        <group position={[-0.7, -0.5, 0.8]}>
          {/* Pump housing */}
          <mesh castShadow>
            <cylinderGeometry args={[0.3, 0.3, 0.6, 12]} />
            <meshStandardMaterial 
              color="#D32F2F" 
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
          
          {/* Pump impeller */}
          <mesh ref={pump1ImpellerRef} position={[0, 0, 0]} castShadow>
            <cylinderGeometry args={[0.25, 0.25, 0.05, 6]} />
            <meshStandardMaterial 
              color="#F44336" 
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
          
          {/* Motor */}
          <mesh position={[0, 0.5, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.2, 0.4, 12]} />
            <meshStandardMaterial color="#424242" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>

        {/* Pump System 2 */}
        <group position={[0.7, -0.5, 0.8]}>
          {/* Pump housing */}
          <mesh castShadow>
            <cylinderGeometry args={[0.3, 0.3, 0.6, 12]} />
            <meshStandardMaterial 
              color="#1976D2" 
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
          
          {/* Pump impeller */}
          <mesh ref={pump2ImpellerRef} position={[0, 0, 0]} castShadow>
            <cylinderGeometry args={[0.25, 0.25, 0.05, 6]} />
            <meshStandardMaterial 
              color="#2196F3" 
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
          
          {/* Motor */}
          <mesh position={[0, 0.5, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.2, 0.4, 12]} />
            <meshStandardMaterial color="#424242" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>

        {/* Filtration System */}
        <group position={[0, 0.7, 0.5]}>
          {/* Main filter housing */}
          <mesh castShadow>
            <cylinderGeometry args={[0.4, 0.4, 1.2, 12]} />
            <meshStandardMaterial 
              color="#2E7D32" 
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
          
          {/* Filter element */}
          <mesh ref={filterRotorRef} position={[0, 0, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.3, 1.0, 8]} />
            <meshStandardMaterial 
              color="#81C784" 
              metalness={0.3}
              roughness={0.7}
            />
          </mesh>
        </group>

        {/* Status LEDs */}
        <mesh ref={statusLEDRef} position={[-0.2, -0.1, 1.72]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.01, 12]} />
          <meshStandardMaterial 
            color="#4CAF50" 
            emissive="#4CAF50" 
            emissiveIntensity={0.9}
          />
        </mesh>

        {/* PROFESSIONAL CONTROL PANEL COMPONENTS */}
        
        {/* HMI Touchscreen Display */}
        <mesh position={[0, 0.2, 2.12]} castShadow>
          <boxGeometry args={[0.8, 0.5, 0.06]} />
          <meshStandardMaterial color="#1A1A1A" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.2, 2.125]} castShadow>
          <boxGeometry args={[0.75, 0.45, 0.01]} />
          <meshStandardMaterial 
            color="#0D47A1" 
            emissive="#1976D2" 
            emissiveIntensity={0.3}
            metalness={0.1}
            roughness={0.9}
          />
        </mesh>

        {/* Industrial Pressure Gauge */}
        <mesh ref={pressureGaugeRef} position={[-0.6, 0.2, 2.12]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.04, 20]} />
          <meshStandardMaterial color="#E0E0E0" metalness={0.2} roughness={0.8} />
        </mesh>
        <mesh position={[-0.6, 0.2, 2.125]} castShadow>
          <cylinderGeometry args={[0.075, 0.075, 0.005, 20]} />
          <meshStandardMaterial color="#FAFAFA" metalness={0.1} roughness={0.9} />
        </mesh>
        {/* Gauge Needle */}
        <mesh ref={pressureGaugeRef} position={[-0.6, 0.25, 2.13]} rotation={[0, 0, -Math.PI/4]} castShadow>
          <boxGeometry args={[0.001, 0.05, 0.001]} />
          <meshStandardMaterial color="#D32F2F" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Flow Meter Display */}
        <mesh position={[0.6, 0.2, 2.12]} castShadow>
          <boxGeometry args={[0.2, 0.15, 0.04]} />
          <meshStandardMaterial color="#2E7D32" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0.6, 0.2, 2.125]} castShadow>
          <boxGeometry args={[0.18, 0.13, 0.005]} />
          <meshStandardMaterial 
            color="#4CAF50" 
            emissive="#4CAF50" 
            emissiveIntensity={0.4}
          />
        </mesh>

        {/* System Status Light Panel */}
        <group position={[-0.9, -0.3, 2.12]}>
          {/* System LED */}
          <mesh ref={systemLEDRef} position={[0, 0.1, 0]} castShadow>
            <cylinderGeometry args={[0.015, 0.015, 0.01, 12]} />
            <meshStandardMaterial 
              color="#4CAF50" 
              emissive="#4CAF50" 
              emissiveIntensity={0.8}
            />
          </mesh>
          {/* Alarm LED */}
          <mesh ref={alarmLEDRef} position={[0, 0, 0]} castShadow>
            <cylinderGeometry args={[0.015, 0.015, 0.01, 12]} />
            <meshStandardMaterial 
              color="#F44336" 
              emissive="#F44336" 
              emissiveIntensity={0.0}
            />
          </mesh>
          {/* Power LED */}
          <mesh position={[0, -0.1, 0]} castShadow>
            <cylinderGeometry args={[0.015, 0.015, 0.01, 12]} />
            <meshStandardMaterial 
              color="#2196F3" 
              emissive="#2196F3" 
              emissiveIntensity={0.9}
            />
          </mesh>
        </group>

        {/* Emergency Stop Button */}
        <mesh position={[0.9, -0.3, 2.12]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.03, 16]} />
          <meshStandardMaterial color="#D32F2F" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0.9, -0.3, 2.125]} castShadow>
          <cylinderGeometry args={[0.035, 0.035, 0.005, 16]} />
          <meshStandardMaterial color="#FF1744" metalness={0.6} roughness={0.3} />
        </mesh>

        {/* PROFESSIONAL PIPING NETWORK */}
        
        {/* Main Supply Header */}
        <mesh position={[0, 1.8, -0.5]} rotation={[0, Math.PI/2, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 3.5, 16]} />
          <meshStandardMaterial color="#1976D2" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Distribution Manifold */}
        <mesh position={[1.5, 1.2, 0]} rotation={[Math.PI/2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 1.2, 16]} />
          <meshStandardMaterial color="#2E7D32" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Pipe Supports and Hangers */}
        {[...Array(5)].map((_, i) => (
          <group key={`pipe-support-${i}`} position={[-1.5 + i * 0.75, 1.8, -0.5]}>
            <mesh castShadow>
              <boxGeometry args={[0.05, 0.05, 0.3]} />
              <meshStandardMaterial color="#37474F" metalness={0.8} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0, -0.18]} castShadow>
              <cylinderGeometry args={[0.12, 0.12, 0.04, 12]} />
              <meshStandardMaterial color="#37474F" metalness={0.8} roughness={0.3} />
            </mesh>
          </group>
        ))}

        {/* Pipe Fittings - Tees and Elbows */}
        <mesh position={[0, 1.8, -0.5]} castShadow>
          <sphereGeometry args={[0.12, 12, 8]} />
          <meshStandardMaterial color="#0D47A1" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[1.5, 1.8, -0.5]} castShadow>
          <sphereGeometry args={[0.12, 12, 8]} />
          <meshStandardMaterial color="#0D47A1" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Professional Valves */}
        <group position={[0.8, 1.8, -0.5]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.06, 0.06, 0.2, 12]} />
            <meshStandardMaterial color="#FF5722" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh rotation={[Math.PI/2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.15, 8]} />
            <meshStandardMaterial color="#FF8A65" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>

        {/* ADVANCED WATER EFFECTS */}
        
        {/* Water Jet from Outlet */}
        <mesh ref={waterJetRef} position={[1.5, 0.5, 1.9]} rotation={[0, Math.PI/2, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.3, 12]} />
          <meshStandardMaterial 
            color="#42A5F5" 
            transparent
            opacity={0.7}
            emissive="#1976D2"
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Steam Effect from Hot Water */}
        <mesh ref={steamRef} position={[0, 2.5, 0]} castShadow>
          <sphereGeometry args={[0.1, 8, 6]} />
          <meshStandardMaterial 
            color="#E3F2FD" 
            transparent
            opacity={0.3}
            metalness={0.0}
            roughness={1.0}
          />
        </mesh>

        {/* Water Droplets */}
        {[...Array(6)].map((_, i) => (
          <mesh 
            key={`droplet-${i}`} 
            position={[
              -0.3 + Math.random() * 0.6,
              0.4 + Math.random() * 0.2,
              1.85 + Math.random() * 0.1
            ]} 
            castShadow
          >
            <sphereGeometry args={[0.005, 8, 6]} />
            <meshStandardMaterial 
              color="#42A5F5" 
              transparent
              opacity={0.8}
              metalness={0.1}
              roughness={0.1}
            />
          </mesh>
        ))}

        {/* INDUSTRIAL SAFETY EQUIPMENT */}
        
        {/* Eye Wash Station */}
        <group position={[-1.6, 0.5, 1.2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.8, 12]} />
            <meshStandardMaterial color="#37474F" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.45, 0]} castShadow>
            <sphereGeometry args={[0.05, 12, 8]} />
            <meshStandardMaterial color="#FFEB3B" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>

        {/* Safety Shower */}
        <group position={[1.6, 0.8, 1.2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.04, 0.04, 1.2, 12]} />
            <meshStandardMaterial color="#37474F" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.65, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.02, 16]} />
            <meshStandardMaterial color="#FFEB3B" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>

        {/* Warning Signage */}
        <mesh position={[-1.4, 0.8, 2.12]} rotation={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.2, 0.15, 0.01]} />
          <meshStandardMaterial color="#FF5722" metalness={0.1} roughness={0.8} />
        </mesh>
        <mesh position={[1.4, 0.8, 2.12]} rotation={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.2, 0.15, 0.01]} />
          <meshStandardMaterial color="#FF9800" metalness={0.1} roughness={0.8} />
        </mesh>

        {/* Professional Cable Management */}
        <group position={[0, -1.0, 1.5]}>
          <mesh castShadow>
            <boxGeometry args={[3.0, 0.15, 0.3]} />
            <meshStandardMaterial color="#607D8B" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Cable Tray Supports */}
          {[...Array(6)].map((_, i) => (
            <mesh key={`cable-support-${i}`} position={[-1.25 + i * 0.5, -0.12, 0]} castShadow>
              <boxGeometry args={[0.03, 0.1, 0.25]} />
              <meshStandardMaterial color="#455A64" metalness={0.8} roughness={0.3} />
            </mesh>
          ))}
        </group>

        {/* Grounding System */}
        <mesh position={[0, -0.3, -1.3]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.6, 8]} />
          <meshStandardMaterial color="#8BC34A" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.3, -1.6]} castShadow>
          <boxGeometry args={[0.15, 0.15, 0.05]} />
          <meshStandardMaterial color="#4CAF50" metalness={0.1} roughness={0.8} />
        </mesh>

        {/* Connection Ports */}
        {connectionPorts.map((port) => (
          <group key={port.id}>
            <mesh 
              position={port.position}
              onClick={(e) => handlePortClick(port, e)}
              castShadow
            >
              <cylinderGeometry args={[0.04, 0.04, 0.08, 8]} />
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
              position={[port.position[0], port.position[1] - 0.15, port.position[2] + 0.05]}
              fontSize={0.08}
              color="#FFFFFF"
              fontWeight="bold"
              anchorX="center"
              anchorY="middle"
            >
              {port.label}
            </Text>
          </group>
        ))}

        {/* System Labeling */}
        <Text
          position={[0, 0.9, 1.73]}
          fontSize={0.15}
          color="#FFFFFF"
          fontWeight="bold"
          anchorX="center"
          anchorY="middle"
        >
          WATER SUPPLY SYSTEM
        </Text>
        
        <Text
          position={[0, 0.7, 1.73]}
          fontSize={0.08}
          color="#B0BEC5"
          anchorX="center"
          anchorY="middle"
        >
          Fresh Water Distribution
        </Text>
        
        <Text
          position={[0, 0.55, 1.73]}
          fontSize={0.06}
          color="#90A4AE"
          anchorX="center"
          anchorY="middle"
        >
          Flow: 500 GPM | Pressure: 85 PSI
        </Text>

        {/* Component labels */}
        <Text
          position={[-1.0, 1.4, 0.5]}
          fontSize={0.06}
          color="#E0E0E0"
          anchorX="center"
          anchorY="middle"
        >
          STORAGE
        </Text>
        
        <Text
          position={[0, 1.4, 0.5]}
          fontSize={0.06}
          color="#E0E0E0"
          anchorX="center"
          anchorY="middle"
        >
          FILTRATION
        </Text>
        
        <Text
          position={[-0.7, 0.2, 0.8]}
          fontSize={0.05}
          color="#E0E0E0"
          anchorX="center"
          anchorY="middle"
        >
          PUMP-1
        </Text>
        
        <Text
          position={[0.7, 0.2, 0.8]}
          fontSize={0.05}
          color="#E0E0E0"
          anchorX="center"
          anchorY="middle"
        >
          PUMP-2
        </Text>
      </group>

      {/* Coordinate display */}
      {showCoordinates && (
        <Text
          position={[0, 3, 0]}
          fontSize={0.2}
          color="yellow"
          anchorX="center"
          anchorY="middle"
        >
          {`(${position[0].toFixed(1)}, ${position[2].toFixed(1)})`}
        </Text>
      )}

      {/* Selection indicator */}
      {isSelected && (
        <mesh position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[3.5, 4.0, 32]} />
          <meshBasicMaterial color="#4CAF50" transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
};

// Static property for accessing connection ports
WaterSupply.connectionPorts = [
  { id: 'water_inlet', label: 'INLET', position: [-1.5, 0.5, 1.8], type: 'liquid', direction: 'input' },
  { id: 'filtered_outlet', label: 'FILTERED', position: [1.5, 0.5, 1.8], type: 'liquid', direction: 'output' },
  { id: 'main_outlet', label: 'MAIN-OUT', position: [1.5, 0.2, 1.8], type: 'liquid', direction: 'output' },
  { id: 'emergency_outlet', label: 'EMRG-OUT', position: [1.5, -0.1, 1.8], type: 'liquid', direction: 'output' },
  { id: 'power_input', label: 'PWR-IN', position: [-1.2, -0.8, 1.8], type: 'electric', direction: 'input' },
  { id: 'pump1_control', label: 'PUMP1', position: [-0.8, -0.8, 1.8], type: 'electric', direction: 'input' },
  { id: 'pump2_control', label: 'PUMP2', position: [-0.4, -0.8, 1.8], type: 'electric', direction: 'input' },
  { id: 'filter_control', label: 'FILTER', position: [0, -0.8, 1.8], type: 'electric', direction: 'input' },
  { id: 'pressure_signal', label: 'PRESSURE', position: [0.4, -0.8, 1.8], type: 'electric', direction: 'output' },
  { id: 'flow_signal', label: 'FLOW', position: [0.8, -0.8, 1.8], type: 'electric', direction: 'output' },
  { id: 'level_signal', label: 'LEVEL', position: [1.2, -0.8, 1.8], type: 'electric', direction: 'output' },
  { id: 'drain_outlet', label: 'DRAIN', position: [0, -1.0, 1.8], type: 'liquid', direction: 'output' }
];

export default WaterSupply;
