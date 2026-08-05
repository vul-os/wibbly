import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const WaterPump = ({ 
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
  const groupRef = useRef();
  const pumpImpellerRef = useRef();
  const pumpMotorRef = useRef();
  const strainerBasketRef = useRef();
  const waterFlowRef = useRef();
  const pressureGaugeRef = useRef();
  const statusLEDRef = useRef();
  const flowMeterRef = useRef();
  const vfdDisplayRef = useRef();
  const waterJetRef = useRef();
  const bubbleEffectRef = useRef();

  const [, setIsDragging] = useState(false);
  const [hasMovedMouse, setHasMovedMouse] = useState(false);
  const { camera, gl } = useThree();

  // Professional connection ports for pool water circulation system
  const connectionPorts = [
    { id: 'pool_suction', label: 'POOL-IN', position: [-0.8, -0.2, -0.6], type: 'liquid', direction: 'input' },
    { id: 'skimmer_suction', label: 'SKIMMER', position: [-0.8, 0.1, -0.6], type: 'liquid', direction: 'input' },
    { id: 'main_drain', label: 'DRAIN-IN', position: [-0.8, -0.4, -0.6], type: 'liquid', direction: 'input' },
    { id: 'filter_discharge', label: 'TO-FILTER', position: [0.8, 0.2, -0.6], type: 'liquid', direction: 'output' },
    { id: 'heater_line', label: 'TO-HEATER', position: [0.8, 0.0, -0.6], type: 'liquid', direction: 'output' },
    { id: 'return_jets', label: 'RETURN', position: [0.8, -0.2, -0.6], type: 'liquid', direction: 'output' },
    { id: 'chemical_feed', label: 'CHEM-FEED', position: [0.4, 0.4, -0.6], type: 'liquid', direction: 'input' },
    { id: 'power_input', label: 'PWR-IN', position: [-0.6, -0.6, -0.6], type: 'electric', direction: 'input' },
    { id: 'vfd_control', label: 'VFD-CTRL', position: [-0.2, -0.6, -0.6], type: 'electric', direction: 'input' },
    { id: 'flow_signal', label: 'FLOW-SIG', position: [0.2, -0.6, -0.6], type: 'electric', direction: 'output' },
    { id: 'pressure_signal', label: 'PRESS-SIG', position: [0.6, -0.6, -0.6], type: 'electric', direction: 'output' }
  ];

  // Advanced animations for realistic pool pump operation
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (pumpImpellerRef.current) {
      // High-speed pool pump impeller (3450 RPM = 57.5 RPS)
      pumpImpellerRef.current.rotation.y = time * 57.5;
    }
    
    if (pumpMotorRef.current) {
      // Subtle motor vibration at 60Hz
      pumpMotorRef.current.position.y = 0.45 + Math.sin(time * 377) * 0.002;
    }

    if (strainerBasketRef.current) {
      // Gentle rotation of strainer basket from water flow
      strainerBasketRef.current.rotation.y = time * 0.5;
    }

    if (waterFlowRef.current) {
      // Animated water flow through transparent pipes
      waterFlowRef.current.material.opacity = 0.6 + Math.sin(time * 8) * 0.2;
    }

    if (pressureGaugeRef.current) {
      // Dynamic pressure reading simulation
      const pressure = 15 + Math.sin(time * 2) * 3; // 12-18 PSI range
      pressureGaugeRef.current.rotation.z = -Math.PI/2 + (pressure / 30) * Math.PI;
    }

    if (statusLEDRef.current) {
      // Pulsing status LED for "running" indication
      const intensity = 0.6 + Math.sin(time * 4) * 0.3;
      statusLEDRef.current.material.emissiveIntensity = intensity;
    }

    if (flowMeterRef.current) {
      // Turbine rotation in flow meter
      flowMeterRef.current.rotation.z = time * 20; // 20 RPS for good flow
    }

    if (vfdDisplayRef.current) {
      // VFD display flickering effect
      const flicker = Math.sin(time * 60) > 0.95 ? 0.3 : 0.8;
      vfdDisplayRef.current.material.emissiveIntensity = flicker;
    }

    if (waterJetRef.current) {
      // Water jet animation with pressure variations
      const jetPressure = 1.0 + Math.sin(time * 3) * 0.2;
      waterJetRef.current.scale.setScalar(jetPressure);
    }

    if (bubbleEffectRef.current) {
      // Bubble animation in strainer basket
      bubbleEffectRef.current.position.y = -0.3 + Math.sin(time * 2) * 0.1;
      bubbleEffectRef.current.material.opacity = 0.3 + Math.sin(time * 4) * 0.2;
    }
  });

  const handlePointerDown = (event) => {
    if (!isDraggable) return;
    
    event.stopPropagation();
    setHasMovedMouse(false);
    
    const canvas = gl.domElement;
    const rect = canvas.getBoundingClientRect();
    
    const mouse = new THREE.Vector2();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    
    const ground = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const intersection = new THREE.Vector3();
    raycaster.ray.intersectPlane(ground, intersection);
    
    const handleMouseMove = (moveEvent) => {
      setHasMovedMouse(true);
      
      const newRect = moveEvent.target.getBoundingClientRect?.() || rect;
      const newMouse = new THREE.Vector2();
      newMouse.x = ((moveEvent.clientX - newRect.left) / newRect.width) * 2 - 1;
      newMouse.y = -((moveEvent.clientY - newRect.top) / newRect.height) * 2 + 1;
      
      raycaster.setFromCamera(newMouse, camera);
      const newIntersection = new THREE.Vector3();
      raycaster.ray.intersectPlane(ground, newIntersection);
      
      const newPosition = [newIntersection.x, position[1], newIntersection.z];
      
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

  const handleClick = (event) => {
    if (!hasMovedMouse && onClick) {
      event.stopPropagation();
      onClick(event);
    }
  };

  const handlePortClick = (port, event) => {
    if (onPortClick) {
      const worldPosition = new THREE.Vector3(...port.position).add(new THREE.Vector3(...position));
      onPortClick(port, [worldPosition.x, worldPosition.y, worldPosition.z], event);
    }
  };

  return (
    <group ref={groupRef} position={position}>
      {/* ULTRA-REALISTIC POOL WATER CIRCULATION PUMP SYSTEM */}
      
      {/* ULTRA-REALISTIC PROFESSIONAL FOUNDATION AND INFRASTRUCTURE */}
      <group>
        {/* Reinforced Concrete Foundation with Expansion Joints */}
        <mesh position={[0, -0.3, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.4, 0.25, 1.8]} />
          <meshStandardMaterial 
            color="#6D7C84"
            metalness={0.1}
            roughness={0.9}
          />
        </mesh>

        {/* Concrete Rebar Reinforcement Grid */}
        {[...Array(8)].map((_, i) => (
          <mesh key={`rebar-x-${i}`} position={[-1.1 + i * 0.32, -0.28, 0]} castShadow>
            <cylinderGeometry args={[0.006, 0.006, 1.8, 8]} rotation={[Math.PI/2, 0, 0]} />
            <meshStandardMaterial color="#8B4513" metalness={0.8} roughness={0.4} />
          </mesh>
        ))}
        {[...Array(6)].map((_, i) => (
          <mesh key={`rebar-z-${i}`} position={[0, -0.28, -0.85 + i * 0.34]} castShadow>
            <cylinderGeometry args={[0.006, 0.006, 2.4, 8]} rotation={[0, 0, Math.PI/2]} />
            <meshStandardMaterial color="#8B4513" metalness={0.8} roughness={0.4} />
          </mesh>
        ))}

        {/* Anti-Slip Diamond Plate Surface */}
        <mesh position={[0, -0.16, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.2, 0.03, 1.6]} />
          <meshStandardMaterial 
            color="#37434A"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>

        {/* Diamond Plate Pattern */}
        {[...Array(12)].map((_, x) => 
          [...Array(9)].map((_, z) => (
            <mesh 
              key={`diamond-${x}-${z}`} 
              position={[-1.0 + x * 0.18, -0.15, -0.72 + z * 0.18]} 
              castShadow
            >
              <cylinderGeometry args={[0.012, 0.008, 0.003, 4]} />
              <meshStandardMaterial color="#2A3439" metalness={0.8} roughness={0.3} />
            </mesh>
          ))
        )}

        {/* Professional Anti-Vibration Isolators */}
        {[[-0.5, -0.18, -0.4], [0.5, -0.18, -0.4], [-0.5, -0.18, 0.4], [0.5, -0.18, 0.4]].map((pos, i) => (
          <group key={`vibration-isolator-${i}`} position={pos}>
            <mesh castShadow>
              <cylinderGeometry args={[0.06, 0.06, 0.04, 16]} />
              <meshStandardMaterial color="#1C1C1C" metalness={0.2} roughness={0.8} />
            </mesh>
            <mesh position={[0, 0.025, 0]} castShadow>
              <cylinderGeometry args={[0.04, 0.04, 0.01, 16]} />
              <meshStandardMaterial color="#37474F" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
        ))}

        {/* Heavy-Duty Structural Steel Skid */}
        <mesh position={[0, -0.12, 0]} castShadow>
          <boxGeometry args={[2.0, 0.1, 1.5]} />
          <meshStandardMaterial color="#37474F" metalness={0.85} roughness={0.15} />
        </mesh>

        {/* Skid Support Beams */}
        {[[-0.9, -0.12, 0], [0.9, -0.12, 0]].map((pos, i) => (
          <mesh key={`beam-${i}`} position={pos} castShadow>
            <boxGeometry args={[0.08, 0.12, 1.5]} />
            <meshStandardMaterial color="#263238" metalness={0.8} roughness={0.2} />
          </mesh>
        ))}

        {/* Professional Anchor Bolts */}
        {[[-0.9, -0.22, -0.65], [0.9, -0.22, -0.65], [-0.9, -0.22, 0.65], [0.9, -0.22, 0.65]].map((pos, i) => (
          <mesh key={`anchor-${i}`} position={pos} castShadow>
            <cylinderGeometry args={[0.012, 0.012, 0.15, 8]} />
            <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
          </mesh>
        ))}

        {/* Drainage System */}
        <mesh position={[0.8, -0.25, 0.6]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.1, 12]} />
          <meshStandardMaterial color="#37474F" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0.8, -0.28, 0.6]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.01, 8]} />
          <meshStandardMaterial color="#263238" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* ULTRA-REALISTIC PROFESSIONAL POOL PUMP HOUSING */}
      <group position={[0, 0.1, 0]}>
        {/* Professional Cast Iron Pump Volute */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.28, 24, 20]} />
          <meshStandardMaterial 
            color="#1976D2"
            metalness={0.92}
            roughness={0.08}
            envMapIntensity={0.9}
          />
        </mesh>

        {/* Volute Casting Marks and Machined Surfaces */}
        <mesh position={[0, 0, 0]} castShadow>
          <torusGeometry args={[0.25, 0.02, 8, 20]} />
          <meshStandardMaterial color="#1565C0" metalness={0.95} roughness={0.05} />
        </mesh>

        {/* Professional Pump Housing Cover with Gasket */}
        <mesh position={[0, 0, 0.32]} castShadow>
          <cylinderGeometry args={[0.24, 0.24, 0.12, 24]} />
          <meshStandardMaterial color="#1565C0" metalness={0.92} roughness={0.08} />
        </mesh>

        {/* O-Ring Gasket Groove */}
        <mesh position={[0, 0, 0.26]} castShadow>
          <torusGeometry args={[0.22, 0.008, 8, 24]} />
          <meshStandardMaterial color="#1C1C1C" metalness={0.3} roughness={0.8} />
        </mesh>

        {/* Professional Housing Bolts with Washers */}
        {[...Array(10)].map((_, i) => {
          const angle = (i * Math.PI) / 5;
          const x = Math.cos(angle) * 0.28;
          const z = Math.sin(angle) * 0.28;
          return (
            <group key={`housing-bolt-${i}`} position={[x, 0, z + 0.32]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.01, 0.01, 0.05, 8]} />
                <meshStandardMaterial color="#37474F" metalness={0.9} roughness={0.1} />
              </mesh>
              <mesh position={[0, 0, 0.025]} castShadow>
                <cylinderGeometry args={[0.015, 0.015, 0.003, 8]} />
                <meshStandardMaterial color="#E0E0E0" metalness={0.8} roughness={0.2} />
              </mesh>
            </group>
          );
        })}

        {/* Pump Manufacturer Nameplate */}
        <mesh position={[0.29, 0.1, 0]} castShadow>
          <boxGeometry args={[0.01, 0.18, 0.12]} />
          <meshStandardMaterial color="#E0E0E0" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Pool-Specific Strainer Pot with See-Through Lid */}
        <mesh position={[-0.45, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.35, 20]} />
          <meshStandardMaterial 
            color="#F0F4F8"
            metalness={0.95}
            roughness={0.03}
            transparent
            opacity={0.95}
          />
        </mesh>

        {/* Strainer Lid Clamp Ring */}
        <mesh position={[-0.45, 0.15, 0]} castShadow>
          <torusGeometry args={[0.21, 0.02, 8, 20]} />
          <meshStandardMaterial color="#37474F" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Professional Strainer Basket with Handle */}
        <group ref={strainerBasketRef} position={[-0.45, 0, 0]}>
          {/* Basket Body */}
          <mesh castShadow>
            <cylinderGeometry args={[0.17, 0.17, 0.28, 20]} />
            <meshStandardMaterial color="#37474F" metalness={0.85} roughness={0.15} />
          </mesh>
          
          {/* Professional Mesh Pattern - Vertical Slats */}
          {[...Array(16)].map((_, i) => (
            <mesh key={`mesh-vert-${i}`} position={[0, 0, 0]} rotation={[0, (i * Math.PI) / 8, 0]} castShadow>
              <boxGeometry args={[0.003, 0.25, 0.3]} />
              <meshStandardMaterial color="#263238" metalness={0.9} roughness={0.1} />
            </mesh>
          ))}
          
          {/* Horizontal Support Rings */}
          {[...Array(6)].map((_, i) => (
            <mesh key={`mesh-ring-${i}`} position={[0, -0.12 + i * 0.04, 0]} castShadow>
              <torusGeometry args={[0.16, 0.003, 8, 20]} />
              <meshStandardMaterial color="#263238" metalness={0.9} roughness={0.1} />
            </mesh>
          ))}

          {/* Basket Handle */}
          <mesh position={[0, 0.18, 0]} castShadow>
            <cylinderGeometry args={[0.008, 0.008, 0.12, 8]} />
            <meshStandardMaterial color="#37474F" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.22, 0]} castShadow>
            <sphereGeometry args={[0.015, 12, 8]} />
            <meshStandardMaterial color="#FF5722" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>

        {/* Strainer Drain Plug */}
        <mesh position={[-0.45, -0.22, 0]} castShadow>
          <cylinderGeometry args={[0.01, 0.01, 0.02, 8]} />
          <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Enhanced Bubble Effect with Debris Simulation */}
        <mesh ref={bubbleEffectRef} position={[-0.45, -0.35, 0]} castShadow>
          <sphereGeometry args={[0.15, 16, 12]} />
          <meshStandardMaterial 
            color="#42A5F5"
            transparent
            opacity={0.25}
            metalness={0.0}
            roughness={1.0}
          />
        </mesh>

        {/* Simulated Debris in Strainer */}
        {[...Array(5)].map((_, i) => (
          <mesh key={`debris-${i}`} position={[-0.45 + (Math.random() - 0.5) * 0.2, -0.15 + Math.random() * 0.1, (Math.random() - 0.5) * 0.2]} castShadow>
            <sphereGeometry args={[0.008, 8, 6]} />
            <meshStandardMaterial color="#8D6E63" metalness={0.1} roughness={0.9} />
          </mesh>
        ))}

        {/* Pump Suction Eye Cover */}
        <mesh position={[-0.28, 0, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.03, 16]} />
          <meshStandardMaterial color="#1565C0" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Volute Discharge Nozzle */}
        <mesh position={[0.28, 0.05, 0]} rotation={[0, 0, Math.PI/2]} castShadow>
          <cylinderGeometry args={[0.06, 0.08, 0.08, 16]} />
          <meshStandardMaterial color="#1976D2" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* HIGH-PERFORMANCE POOL PUMP IMPELLER */}
      <group ref={pumpImpellerRef} position={[0, 0.1, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.18, 0.18, 0.05, 16]} />
          <meshStandardMaterial 
            color="#1565C0"
            metalness={0.95}
            roughness={0.03}
            envMapIntensity={0.9}
          />
        </mesh>
        
        {/* Pool-Optimized Impeller Vanes */}
        {[...Array(6)].map((_, i) => {
          const angle = (i * Math.PI) / 3;
          const x = Math.cos(angle) * 0.14;
          const z = Math.sin(angle) * 0.14;
          return (
            <mesh 
              key={`impeller-vane-${i}`} 
              position={[x, 0, z]} 
              rotation={[0, angle, Math.PI/6]}
              castShadow
            >
              <boxGeometry args={[0.03, 0.05, 0.2]} />
              <meshStandardMaterial color="#0D47A1" metalness={0.95} roughness={0.05} />
            </mesh>
          );
        })}

        {/* Impeller Hub */}
        <mesh castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.06, 16]} />
          <meshStandardMaterial color="#0D47A1" metalness={0.95} roughness={0.03} />
        </mesh>
      </group>

      {/* ULTRA-REALISTIC VARIABLE SPEED MOTOR SYSTEM */}
      <mesh ref={pumpMotorRef} position={[0, 0.48, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.18, 0.18, 0.4, 24]} />
        <meshStandardMaterial 
          color="#37474F"
          metalness={0.88}
          roughness={0.12}
          envMapIntensity={0.8}
        />
      </mesh>

      {/* Motor End Bells */}
      <mesh position={[0, 0.28, 0]} castShadow>
        <cylinderGeometry args={[0.19, 0.19, 0.05, 24]} />
        <meshStandardMaterial color="#263238" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0.68, 0]} castShadow>
        <cylinderGeometry args={[0.19, 0.19, 0.05, 24]} />
        <meshStandardMaterial color="#263238" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Motor Shaft */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 0.08, 16]} />
        <meshStandardMaterial color="#E0E0E0" metalness={0.95} roughness={0.05} />
      </mesh>

      {/* Shaft Coupling */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.06, 12]} />
        <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Professional Motor Nameplate */}
      <mesh position={[0.19, 0.52, 0]} castShadow>
        <boxGeometry args={[0.01, 0.18, 0.12]} />
        <meshStandardMaterial color="#E0E0E0" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Motor Frame Ribs */}
      {[...Array(8)].map((_, i) => (
        <mesh key={`frame-rib-${i}`} position={[0, 0.35 + i * 0.02, 0]} rotation={[0, (i * Math.PI) / 4, 0]} castShadow>
          <boxGeometry args={[0.01, 0.02, 0.2]} />
          <meshStandardMaterial color="#263238" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}

      {/* Professional Motor Cooling Fins */}
      {[...Array(20)].map((_, i) => (
        <mesh key={`motor-fin-${i}`} position={[0, 0.48, 0]} rotation={[0, (i * Math.PI) / 10, 0]} castShadow>
          <boxGeometry args={[0.006, 0.35, 0.2]} />
          <meshStandardMaterial color="#263238" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}

      {/* Cooling Fan Shroud */}
      <mesh position={[0, 0.73, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.14, 0.08, 16]} />
        <meshStandardMaterial color="#1C1C1C" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Cooling Fan Blades */}
      {[...Array(6)].map((_, i) => (
        <mesh key={`fan-blade-${i}`} position={[0, 0.74, 0]} rotation={[0, (i * Math.PI) / 3, Math.PI/12]} castShadow>
          <boxGeometry args={[0.08, 0.002, 0.12]} />
          <meshStandardMaterial color="#37474F" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}

      {/* Professional Terminal Box */}
      <mesh position={[0.2, 0.65, 0]} castShadow>
        <boxGeometry args={[0.12, 0.1, 0.12]} />
        <meshStandardMaterial color="#263238" metalness={0.85} roughness={0.15} />
      </mesh>

      {/* Terminal Box Cover */}
      <mesh position={[0.2, 0.65, 0.061]} castShadow>
        <boxGeometry args={[0.11, 0.09, 0.002]} />
        <meshStandardMaterial color="#E0E0E0" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Terminal Box Conduit Entries */}
      {[[-0.04, -0.02, 0], [0.04, -0.02, 0]].map((pos, i) => (
        <mesh key={`conduit-${i}`} position={[0.2 + pos[0], 0.65 + pos[1], pos[2]]} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.03, 12]} />
          <meshStandardMaterial color="#37474F" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}

      {/* Motor Feet */}
      {[[-0.22, 0.28, -0.08], [0.22, 0.28, -0.08], [-0.22, 0.28, 0.08], [0.22, 0.28, 0.08]].map((pos, i) => (
        <mesh key={`motor-foot-${i}`} position={pos} castShadow>
          <boxGeometry args={[0.06, 0.02, 0.04]} />
          <meshStandardMaterial color="#37474F" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}

      {/* Motor Mounting Bolts */}
      {[[-0.22, 0.27, -0.08], [0.22, 0.27, -0.08], [-0.22, 0.27, 0.08], [0.22, 0.27, 0.08]].map((pos, i) => (
        <mesh key={`motor-bolt-${i}`} position={pos} castShadow>
          <cylinderGeometry args={[0.008, 0.008, 0.04, 8]} />
          <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
        </mesh>
      ))}

      {/* PROFESSIONAL POOL PIPING SYSTEM */}
      <group position={[0, -0.05, 0]}>
        {/* Suction Pipe with Flange */}
        <mesh position={[-0.6, 0, 0]} rotation={[0, 0, Math.PI/2]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.4, 16]} />
          <meshStandardMaterial color="#2E7D32" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[-0.8, 0, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.03, 16]} />
          <meshStandardMaterial color="#1B5E20" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Discharge Pipe with Check Valve */}
        <mesh position={[0.6, 0.15, 0]} rotation={[0, 0, Math.PI/2]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.4, 16]} />
          <meshStandardMaterial color="#2E7D32" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Pool-Specific Check Valve */}
        <mesh position={[0.8, 0.15, 0]} castShadow>
          <sphereGeometry args={[0.08, 16, 12]} />
          <meshStandardMaterial color="#1B5E20" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Water Flow Animation in Transparent Pipe */}
        <mesh ref={waterFlowRef} position={[0.6, 0.15, 0]} rotation={[0, 0, Math.PI/2]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.35, 16]} />
          <meshStandardMaterial 
            color="#42A5F5"
            transparent
            opacity={0.6}
            metalness={0.1}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* ULTRA-REALISTIC VFD CONTROL SYSTEM */}
      <group position={[0.6, 1.0, 0.5]}>
        {/* Professional NEMA 4X VFD Enclosure */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.35, 0.5, 0.18]} />
          <meshStandardMaterial 
            color="#F5F5F5"
            metalness={0.85}
            roughness={0.12}
            envMapIntensity={0.8}
          />
        </mesh>

        {/* Enclosure Gasket Seal */}
        <mesh position={[0, 0, 0.085]} castShadow>
          <boxGeometry args={[0.34, 0.49, 0.005]} />
          <meshStandardMaterial color="#1C1C1C" metalness={0.3} roughness={0.8} />
        </mesh>

        {/* Professional HMI Touchscreen Display */}
        <mesh ref={vfdDisplayRef} position={[0, 0.15, 0.092]} castShadow>
          <boxGeometry args={[0.25, 0.15, 0.015]} />
          <meshStandardMaterial 
            color="#0D47A1"
            emissive="#1976D2"
            emissiveIntensity={0.9}
            transparent
            opacity={0.95}
          />
        </mesh>

        {/* Display Bezel */}
        <mesh position={[0, 0.15, 0.087]} castShadow>
          <boxGeometry args={[0.27, 0.17, 0.008]} />
          <meshStandardMaterial color="#1C1C1C" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Digital Readouts on Display */}
        <mesh position={[-0.06, 0.18, 0.093]} castShadow>
          <boxGeometry args={[0.08, 0.02, 0.001]} />
          <meshStandardMaterial 
            color="#4CAF50"
            emissive="#4CAF50"
            emissiveIntensity={0.8}
          />
        </mesh>
        <mesh position={[0.06, 0.18, 0.093]} castShadow>
          <boxGeometry args={[0.08, 0.02, 0.001]} />
          <meshStandardMaterial 
            color="#FF9800"
            emissive="#FF9800"
            emissiveIntensity={0.8}
          />
        </mesh>

        {/* Professional Control Buttons */}
        <mesh position={[-0.1, 0.0, 0.092]} castShadow>
          <cylinderGeometry args={[0.018, 0.018, 0.012, 16]} />
          <meshStandardMaterial color="#4CAF50" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.0, 0.092]} castShadow>
          <cylinderGeometry args={[0.018, 0.018, 0.012, 16]} />
          <meshStandardMaterial color="#FF9800" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0.1, 0.0, 0.092]} castShadow>
          <cylinderGeometry args={[0.018, 0.018, 0.012, 16]} />
          <meshStandardMaterial color="#F44336" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Emergency Stop Button */}
        <mesh position={[0, -0.1, 0.095]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.018, 16]} />
          <meshStandardMaterial color="#D32F2F" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Speed Control Potentiometer */}
        <mesh position={[-0.08, -0.05, 0.092]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.02, 16]} />
          <meshStandardMaterial color="#37474F" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[-0.08, -0.05, 0.102]} castShadow>
          <cylinderGeometry args={[0.008, 0.008, 0.01, 16]} />
          <meshStandardMaterial color="#E0E0E0" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Status LED Panel */}
        <group position={[0.08, -0.05, 0.092]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.008, 0.008, 0.01, 16]} />
            <meshStandardMaterial 
              color="#4CAF50"
              emissive="#4CAF50"
              emissiveIntensity={0.8}
            />
          </mesh>
          <mesh position={[0, -0.025, 0]} castShadow>
            <cylinderGeometry args={[0.008, 0.008, 0.01, 16]} />
            <meshStandardMaterial color="#FF9800" emissive="#FF9800" emissiveIntensity={0.7} />
          </mesh>
        </group>

        {/* Advanced Cooling System */}
        {[...Array(8)].map((_, i) => (
          <mesh key={`vfd-vent-${i}`} position={[0, -0.18 + i * 0.03, 0.092]} castShadow>
            <boxGeometry args={[0.3, 0.003, 0.01]} />
            <meshStandardMaterial color="#37474F" metalness={0.8} roughness={0.3} />
          </mesh>
        ))}

        {/* Internal Cooling Fan */}
        <mesh position={[0, -0.2, 0.05]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.02, 16]} />
          <meshStandardMaterial color="#1C1C1C" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Cable Glands */}
        <mesh position={[0, -0.22, 0]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.04, 12]} />
          <meshStandardMaterial color="#37474F" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0.05, -0.22, 0]} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.04, 12]} />
          <meshStandardMaterial color="#37474F" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* VFD Mounting Brackets */}
        {[[-0.15, 0, -0.05], [0.15, 0, -0.05]].map((pos, i) => (
          <mesh key={`vfd-bracket-${i}`} position={pos} castShadow>
            <boxGeometry args={[0.04, 0.5, 0.08]} />
            <meshStandardMaterial color="#37474F" metalness={0.8} roughness={0.2} />
          </mesh>
        ))}

        {/* Professional Warning Labels */}
        <mesh position={[0, 0.22, 0.092]} castShadow>
          <boxGeometry args={[0.15, 0.03, 0.001]} />
          <meshStandardMaterial color="#FFEB3B" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.22, 0.092]} castShadow>
          <boxGeometry args={[0.2, 0.02, 0.001]} />
          <meshStandardMaterial color="#FF5722" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>

      {/* PROFESSIONAL INSTRUMENTATION */}
      <group position={[-0.4, 0.6, 0.4]}>
        {/* Pressure Gauge */}
        <mesh position={[0, 0.1, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.03, 20]} />
          <meshStandardMaterial color="#37474F" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.1, 0.016]} castShadow>
          <cylinderGeometry args={[0.055, 0.055, 0.005, 20]} />
          <meshStandardMaterial color="#E0E0E0" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Pressure Gauge Needle */}
        <mesh ref={pressureGaugeRef} position={[0, 0.1, 0.02]} rotation={[0, 0, -Math.PI/4]} castShadow>
          <boxGeometry args={[0.001, 0.045, 0.002]} />
          <meshStandardMaterial color="#F44336" emissive="#F44336" emissiveIntensity={0.8} />
        </mesh>

        {/* Flow Meter */}
        <mesh position={[0, -0.1, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.08, 16]} />
          <meshStandardMaterial color="#2E7D32" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh ref={flowMeterRef} position={[0, -0.1, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.005, 8]} />
          <meshStandardMaterial color="#4CAF50" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Status LED */}
        <mesh ref={statusLEDRef} position={[0.1, 0, 0]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.01, 16]} />
          <meshStandardMaterial 
            color="#4CAF50"
            emissive="#4CAF50"
            emissiveIntensity={0.8}
          />
        </mesh>
      </group>

      {/* ULTRA-REALISTIC WATER EFFECTS AND ENVIRONMENTAL SYSTEMS */}
      <group>
        {/* Enhanced Water Discharge Jet with Pressure Variation */}
        <mesh ref={waterJetRef} position={[1.2, 0.08, 0]} rotation={[0, Math.PI/2, 0]} castShadow>
          <cylinderGeometry args={[0.025, 0.018, 0.4, 16]} />
          <meshStandardMaterial 
            color="#42A5F5"
            transparent
            opacity={0.85}
            emissive="#1976D2"
            emissiveIntensity={0.5}
            envMapIntensity={0.3}
          />
        </mesh>

        {/* Advanced Water Droplet System */}
        {[...Array(12)].map((_, i) => (
          <mesh key={`water-drop-${i}`} position={[1.4 + Math.random() * 0.3, 0.0 + Math.random() * 0.15, (Math.random() - 0.5) * 0.4]} castShadow>
            <sphereGeometry args={[0.005 + Math.random() * 0.008, 8, 6]} />
            <meshStandardMaterial 
              color="#42A5F5"
              transparent
              opacity={0.75}
              metalness={0.1}
              roughness={0.05}
              envMapIntensity={0.4}
            />
          </mesh>
        ))}

        {/* Water Mist Effect */}
        <mesh position={[1.5, 0.3, 0]} castShadow>
          <sphereGeometry args={[0.4, 12, 8]} />
          <meshStandardMaterial 
            color="#E3F2FD"
            transparent
            opacity={0.1}
            metalness={0.0}
            roughness={1.0}
          />
        </mesh>

        {/* Professional Chemical Feed System */}
        <group position={[0.5, 0.5, 0.2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.01, 0.01, 0.25, 12]} />
            <meshStandardMaterial color="#FF5722" metalness={0.8} roughness={0.2} />
          </mesh>
          
          {/* Chemical Injection Valve */}
          <mesh position={[0, -0.08, 0]} castShadow>
            <cylinderGeometry args={[0.015, 0.015, 0.03, 12]} />
            <meshStandardMaterial color="#FF9800" metalness={0.8} roughness={0.2} />
          </mesh>
          
          {/* Chemical Feed Pump */}
          <mesh position={[0, 0.15, 0]} castShadow>
            <boxGeometry args={[0.04, 0.06, 0.04]} />
            <meshStandardMaterial color="#37474F" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>

        {/* Pool Return Manifold */}
        <group position={[1.0, -0.1, 0]}>
          <mesh rotation={[0, Math.PI/2, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.6, 16]} />
            <meshStandardMaterial color="#2E7D32" metalness={0.8} roughness={0.2} />
          </mesh>
          
          {/* Return Jet Fittings */}
          {[-0.2, 0, 0.2].map((z, i) => (
            <mesh key={`return-jet-${i}`} position={[0, 0, z]} castShadow>
              <cylinderGeometry args={[0.02, 0.02, 0.05, 12]} />
              <meshStandardMaterial color="#1B5E20" metalness={0.9} roughness={0.1} />
            </mesh>
          ))}
        </group>
      </group>

      {/* PROFESSIONAL SAFETY AND ENVIRONMENTAL EQUIPMENT */}
      <group>
        {/* Emergency Eye Wash Station */}
        <group position={[-1.5, 0.8, -1.2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.025, 0.025, 1.6, 12]} />
            <meshStandardMaterial color="#FFEB3B" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.75, 0]} castShadow>
            <boxGeometry args={[0.12, 0.08, 0.06]} />
            <meshStandardMaterial color="#4CAF50" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.65, 0]} castShadow>
            <sphereGeometry args={[0.03, 12, 8]} />
            <meshStandardMaterial color="#E0E0E0" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>

        {/* Pool Equipment Lighting */}
        <group position={[0, 1.8, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.05, 16]} />
            <meshStandardMaterial color="#37474F" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, -0.03, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 0.003, 16]} />
            <meshStandardMaterial 
              color="#FFF"
              emissive="#FFF"
              emissiveIntensity={0.4}
            />
          </mesh>
        </group>

        {/* Professional Tool Storage */}
        <group position={[-1.2, 0.4, 1.0]}>
          <mesh castShadow>
            <boxGeometry args={[0.2, 0.6, 0.1]} />
            <meshStandardMaterial color="#FF5722" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0, 0.055]} castShadow>
            <boxGeometry args={[0.18, 0.05, 0.01]} />
            <meshStandardMaterial color="#E0E0E0" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>

        {/* Water Quality Test Kit */}
        <group position={[1.0, 0.2, 0.8]}>
          <mesh castShadow>
            <boxGeometry args={[0.15, 0.08, 0.1]} />
            <meshStandardMaterial color="#2196F3" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0, 0.051]} castShadow>
            <boxGeometry args={[0.12, 0.05, 0.001]} />
            <meshStandardMaterial color="#E0E0E0" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>

        {/* Electrical Grounding System */}
        <mesh position={[1.2, -0.2, 0.4]} castShadow>
          <cylinderGeometry args={[0.008, 0.008, 0.4, 8]} />
          <meshStandardMaterial color="#4CAF50" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[1.2, -0.4, 0.4]} castShadow>
          <boxGeometry args={[0.03, 0.03, 0.015]} />
          <meshStandardMaterial color="#4CAF50" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Professional Warning Signage */}
        <mesh position={[0, 1.4, 0.6]} rotation={[0, Math.PI, 0]} castShadow>
          <boxGeometry args={[0.25, 0.15, 0.01]} />
          <meshStandardMaterial color="#FFEB3B" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[-0.8, 1.0, 0.6]} rotation={[0, Math.PI/4, 0]} castShadow>
          <boxGeometry args={[0.2, 0.1, 0.01]} />
          <meshStandardMaterial color="#FF5722" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Professional Cable Management */}
        <group position={[0.3, 0.8, 0.7]}>
          <mesh castShadow>
            <boxGeometry args={[0.6, 0.03, 0.08]} />
            <meshStandardMaterial color="#607D8B" metalness={0.8} roughness={0.2} />
          </mesh>
          {[...Array(5)].map((_, i) => (
            <mesh key={`cable-tie-${i}`} position={[-0.2 + i * 0.1, 0, 0]} castShadow>
              <boxGeometry args={[0.01, 0.03, 0.08]} />
              <meshStandardMaterial color="#546E7A" metalness={0.8} roughness={0.3} />
            </mesh>
          ))}
        </group>
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
            fontSize={0.05}
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
        position={[0, 1.2, 0.42]}
        fontSize={0.1}
        color="#FFFFFF"
        fontWeight="bold"
        anchorX="center"
        anchorY="middle"
      >
        POOL WATER CIRCULATION PUMP
      </Text>
      
      <Text
        position={[0, 1.05, 0.42]}
        fontSize={0.06}
        color="#B0BEC5"
        anchorX="center"
        anchorY="middle"
      >
        Variable Speed Pool Pump
      </Text>
      
      <Text
        position={[0, 0.92, 0.42]}
        fontSize={0.04}
        color="#90A4AE"
        anchorX="center"
        anchorY="middle"
      >
        Flow: 85 GPM | Pressure: 15.2 PSI | Speed: 2850 RPM
      </Text>

      {/* COMPONENT LABELS */}
      <Text
        position={[-0.4, -0.4, 0.42]}
        fontSize={0.04}
        color="#E0E0E0"
        anchorX="center"
        anchorY="middle"
      >
        STRAINER
      </Text>
      
      <Text
        position={[0, 0.75, 0.42]}
        fontSize={0.04}
        color="#E0E0E0"
        anchorX="center"
        anchorY="middle"
      >
        VS MOTOR
      </Text>

      <Text
        position={[0.5, 1.1, 0.42]}
        fontSize={0.04}
        color="#E0E0E0"
        anchorX="center"
        anchorY="middle"
      >
        VFD CONTROL
      </Text>

      <mesh
        onPointerDown={handlePointerDown}
        onClick={handleClick}
        position={[0, 0.2, 0]}
        visible={false}
      >
        <boxGeometry args={[2.0, 1.5, 1.0]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* COORDINATE DISPLAY */}
      {showCoordinates && (
        <Text
          position={[0, 2.0, 0]}
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
        <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.2, 2.7, 32]} />
          <meshBasicMaterial color="#4CAF50" transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
};

// Static property for accessing connection ports
WaterPump.connectionPorts = [
  { id: 'pool_suction', label: 'POOL-IN', position: [-0.8, -0.2, 0.4], type: 'liquid', direction: 'input' },
  { id: 'skimmer_suction', label: 'SKIMMER', position: [-0.8, 0.1, 0.4], type: 'liquid', direction: 'input' },
  { id: 'main_drain', label: 'DRAIN-IN', position: [-0.8, -0.4, 0.4], type: 'liquid', direction: 'input' },
  { id: 'filter_discharge', label: 'TO-FILTER', position: [0.8, 0.2, 0.4], type: 'liquid', direction: 'output' },
  { id: 'heater_line', label: 'TO-HEATER', position: [0.8, 0.0, 0.4], type: 'liquid', direction: 'output' },
  { id: 'return_jets', label: 'RETURN', position: [0.8, -0.2, 0.4], type: 'liquid', direction: 'output' },
  { id: 'chemical_feed', label: 'CHEM-FEED', position: [0.4, 0.4, 0.4], type: 'liquid', direction: 'input' },
  { id: 'power_input', label: 'PWR-IN', position: [-0.6, -0.6, 0.4], type: 'electric', direction: 'input' },
  { id: 'vfd_control', label: 'VFD-CTRL', position: [-0.2, -0.6, 0.4], type: 'electric', direction: 'input' },
  { id: 'flow_signal', label: 'FLOW-SIG', position: [0.2, -0.6, 0.4], type: 'electric', direction: 'output' },
  { id: 'pressure_signal', label: 'PRESS-SIG', position: [0.6, -0.6, 0.4], type: 'electric', direction: 'output' }
];

export default WaterPump; 