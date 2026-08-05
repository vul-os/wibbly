import React, { useRef, useState } from 'react';
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import type { PlantObjectComponent, PlantObjectProps } from './types';

interface PressureControlValveProps extends PlantObjectProps {
  position: [number, number, number];
}

interface PressureControlValvePort {
  id: string;
  type: 'electric' | 'liquid' | 'gas';
  label: string;
  offset: [number, number, number];
  direction: [number, number, number];
  required: boolean;
}

const PressureControlValve: PlantObjectComponent<PressureControlValveProps, PressureControlValvePort> = ({ position, onClick, onDrag, isSelected, isDraggable, gridSnap, gridSize, onPortClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [hoveredPort, setHoveredPort] = useState<string | null>(null);
  const [, setCurrentPressure] = useState(8.5);
  const [setpoint] = useState(10.0);
  const [valvePosition, setValvePosition] = useState(45); // 0-100% open
  const [highAlarm, setHighAlarm] = useState(false);
  const [lowAlarm, setLowAlarm] = useState(false);
  const [controlActive, setControlActive] = useState(true);
  const [manualMode] = useState(false);
  const { camera, gl } = useThree();

  // Industrial pressure control valve configuration
  const valveSettings = {
    minPressure: 0.0,
    maxPressure: 16.0,
    highAlarmSetpoint: 12.0,
    lowAlarmSetpoint: 2.0,
    normalSetpoint: 10.0,
    units: 'bar'
  };

  // Define connection ports for comprehensive I/O
  const connectionPorts: PressureControlValvePort[] = [
    {
      id: 'process_inlet',
      type: 'liquid',
      label: 'Process Inlet (High Pressure)',
      offset: [-1.8, 0, 0],
      direction: [-1, 0, 0],
      required: true
    },
    {
      id: 'process_outlet',
      type: 'liquid',
      label: 'Process Outlet (Controlled)',
      offset: [1.8, 0, 0],
      direction: [1, 0, 0],
      required: true
    },
    {
      id: 'control_signal_4_20ma',
      type: 'electric',
      label: '4-20mA Control Signal',
      offset: [0, 3.2, 0.8],
      direction: [0, 1, 0],
      required: true
    },
    {
      id: 'power_24vdc',
      type: 'electric',
      label: '24VDC Power Supply',
      offset: [-0.4, 3.2, 0.8],
      direction: [0, 1, 0],
      required: true
    },
    {
      id: 'feedback_signal',
      type: 'electric',
      label: 'Position Feedback Signal',
      offset: [0.4, 3.2, 0.8],
      direction: [0, 1, 0],
      required: false
    },
    {
      id: 'alarm_output_high',
      type: 'electric',
      label: 'High Pressure Alarm',
      offset: [-0.6, 2.8, 1.0],
      direction: [0, 0, 1],
      required: false
    },
    {
      id: 'alarm_output_low',
      type: 'electric',
      label: 'Low Pressure Alarm',
      offset: [0.6, 2.8, 1.0],
      direction: [0, 0, 1],
      required: false
    }
  ];

  const GRID_SIZE = gridSize || 1.0;

  const snapToGrid = (value: number): number => {
    if (!gridSnap) return value;
    return Math.round(value / GRID_SIZE) * GRID_SIZE;
  };

  // Simulate realistic pressure control valve operation
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPressure(prev => {
        // Simulate pressure control behavior with realistic dynamics
        const error = setpoint - prev;
        const controlResponse = manualMode ? 0 : error * 0.08;
        const noise = (Math.random() - 0.5) * 0.15;
        const systemDelay = Math.sin(Date.now() / 5000) * 0.1;
        const newPressure = prev + controlResponse + noise + systemDelay;
        
        // Update valve position based on control with realistic dynamics
        setValvePosition(currentPos => {
          if (manualMode) return currentPos;
          const targetPosition = Math.max(5, Math.min(95, 50 + error * 4));
          const positionChange = (targetPosition - currentPos) * 0.08;
          return Math.max(0, Math.min(100, currentPos + positionChange));
        });
        
        setHighAlarm(newPressure > valveSettings.highAlarmSetpoint);
        setLowAlarm(newPressure < valveSettings.lowAlarmSetpoint);
        setControlActive(Math.random() > 0.002);
        
        return Math.max(0, Math.min(16, newPressure));
      });
    }, 200);
    return () => clearInterval(interval);
  }, [setpoint, manualMode]);

  useFrame(() => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.MeshPhongMaterial;
      if (isSelected) {
        material.emissive.setHex(0x221122);
      } else if (hovered && isDraggable) {
        material.emissive.setHex(0x111111);
      } else {
        material.emissive.setHex(0x000000);
      }
    }
    
    if (groupRef.current) {
      const targetScale = isDragging ? 1.01 : 1;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    if (!isDraggable) {
      onClick?.(event);
      return;
    }

    event.stopPropagation();
    let hasMovedMouse = false;
    gl.domElement.style.cursor = 'grabbing';

    const handlePointerMove = (moveEvent: MouseEvent) => {
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
        const newPosition: [number, number, number] = [snappedX, position[1], snappedZ];
        onDrag(newPosition);
      }
    };

    const handlePointerUp = () => {
      if (!hasMovedMouse) {
        setIsDragging(false);
        gl.domElement.style.cursor = isDraggable ? 'grab' : 'auto';

        document.removeEventListener('mousemove', handlePointerMove);
        document.removeEventListener('mouseup', handlePointerUp);
        document.removeEventListener('touchmove', handlePointerMove as EventListener);
        document.removeEventListener('touchend', handlePointerUp as EventListener);

        onClick?.(event);
        return;
      }

      setIsDragging(false);
      gl.domElement.style.cursor = isDraggable ? 'grab' : 'auto';

      document.removeEventListener('mousemove', handlePointerMove);
      document.removeEventListener('mouseup', handlePointerUp);
      document.removeEventListener('touchmove', handlePointerMove as EventListener);
      document.removeEventListener('touchend', handlePointerUp as EventListener);
    };

    document.addEventListener('mousemove', handlePointerMove);
    document.addEventListener('mouseup', handlePointerUp);
    document.addEventListener('touchmove', handlePointerMove as EventListener);
    document.addEventListener('touchend', handlePointerUp as EventListener);

    (event as unknown as { preventDefault?: () => void }).preventDefault?.();
  };

  const handlePortClick = (port: PressureControlValvePort, event: ThreeEvent<MouseEvent>) => {
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

  const getPortColor = (port: PressureControlValvePort): string => {
    switch (port.type) {
      case 'electric': return '#FF6B35';
      case 'liquid': return '#4A90E2';
      case 'gas': return '#F7DC6F';
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
      {/* Grid snap indicators */}
      {isDragging && gridSnap && (
        <mesh position={[0, -1.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.0, 2.4, 16]} />
          <meshBasicMaterial color="#00E676" transparent opacity={0.4} />
        </mesh>
      )}
      
      {/* Invisible collision box */}
      <mesh onPointerDown={handlePointerDown} visible={false}>
        <boxGeometry args={[5.0, 6.0, 3.5]} />
      </mesh>
      
      {/* ========== MAIN VALVE BODY ========== */}
      
      {/* Primary Valve Body - Cast Steel */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[2.8, 1.6, 1.4]} />
        {/* `roughness` isn't a MeshPhongMaterial property (Phong uses
            specular/shininess, not the PBR roughness/metalness params) -
            three.js silently ignores unknown material props, so this was
            already a no-op. Dropped rather than typed around. */}
        <meshPhongMaterial
          color="#7A7A7A"
          specular="#AAAAAA"
          shininess={30}
        />
      </mesh>

      {/* Valve Body Top Cover */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <boxGeometry args={[2.6, 0.2, 1.2]} />
        <meshPhongMaterial color="#6B6B6B" specular="#999999" shininess={25} />
      </mesh>
      
      {/* Valve Body Bottom */}
      <mesh position={[0, -0.9, 0]} castShadow>
        <boxGeometry args={[2.6, 0.2, 1.2]} />
        <meshPhongMaterial color="#6B6B6B" specular="#999999" shininess={25} />
      </mesh>
      
      {/* ========== FLANGED CONNECTIONS ========== */}
      
      {/* Inlet Flange Assembly */}
      <group position={[-1.6, 0, 0]}>
        {/* Main Flange */}
        <mesh rotation={[0, 0, Math.PI/2]} castShadow>
          <cylinderGeometry args={[0.8, 0.8, 0.25, 20]} />
          <meshPhongMaterial color="#5A5A5A" specular="#888888" shininess={40} />
        </mesh>
        {/* Flange Face */}
        <mesh position={[-0.15, 0, 0]} rotation={[0, 0, Math.PI/2]} castShadow>
          <cylinderGeometry args={[0.82, 0.82, 0.05, 20]} />
          <meshPhongMaterial color="#4A4A4A" specular="#777777" shininess={50} />
        </mesh>
        {/* Inner Bore */}
        <mesh position={[-0.1, 0, 0]} rotation={[0, 0, Math.PI/2]} castShadow>
          <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
          <meshPhongMaterial color="#3A3A3A" />
        </mesh>
      </group>

      {/* Outlet Flange Assembly */}
      <group position={[1.6, 0, 0]}>
        {/* Main Flange */}
        <mesh rotation={[0, 0, Math.PI/2]} castShadow>
          <cylinderGeometry args={[0.8, 0.8, 0.25, 20]} />
          <meshPhongMaterial color="#5A5A5A" specular="#888888" shininess={40} />
        </mesh>
        {/* Flange Face */}
        <mesh position={[0.15, 0, 0]} rotation={[0, 0, Math.PI/2]} castShadow>
          <cylinderGeometry args={[0.82, 0.82, 0.05, 20]} />
          <meshPhongMaterial color="#4A4A4A" specular="#777777" shininess={50} />
        </mesh>
        {/* Inner Bore */}
        <mesh position={[0.1, 0, 0]} rotation={[0, 0, Math.PI/2]} castShadow>
          <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
          <meshPhongMaterial color="#3A3A3A" />
        </mesh>
      </group>
      
      {/* Flange Bolts - High Detail */}
      {[-1.6, 1.6].map((xPos, i) => (
        <group key={`flange-bolts-${i}`}>
          {Array.from({length: 8}, (_, j) => {
            const angle = (j * Math.PI * 2) / 8;
            return (
              <group key={`bolt-${i}-${j}`}>
                {/* Bolt Head */}
                <mesh position={[
                  xPos + (i === 0 ? -0.05 : 0.05),
                  Math.cos(angle) * 0.6,
                  Math.sin(angle) * 0.6
                ]} rotation={[0, 0, Math.PI/2]} castShadow>
                  <cylinderGeometry args={[0.04, 0.04, 0.08, 6]} />
                  <meshPhongMaterial color="#2A2A2A" specular="#666666" shininess={60} />
                </mesh>
                {/* Bolt Shaft */}
                <mesh position={[
                  xPos,
                  Math.cos(angle) * 0.6,
                  Math.sin(angle) * 0.6
                ]} rotation={[0, 0, Math.PI/2]} castShadow>
                  <cylinderGeometry args={[0.025, 0.025, 0.3, 12]} />
                  <meshPhongMaterial color="#333333" />
                </mesh>
                {/* Washer */}
                <mesh position={[
                  xPos + (i === 0 ? -0.08 : 0.08),
                  Math.cos(angle) * 0.6,
                  Math.sin(angle) * 0.6
                ]} rotation={[0, 0, Math.PI/2]} castShadow>
                  <cylinderGeometry args={[0.035, 0.035, 0.02, 16]} />
                  <meshPhongMaterial color="#4A4A4A" specular="#777777" shininess={40} />
                </mesh>
              </group>
            );
          })}
        </group>
      ))}
      
      {/* ========== PNEUMATIC ACTUATOR ASSEMBLY ========== */}
      
      {/* Actuator Yoke - Cast Iron */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <boxGeometry args={[1.0, 0.6, 0.8]} />
        <meshPhongMaterial color="#5A5A5A" specular="#888888" shininess={30} />
      </mesh>
      
      {/* Actuator Mounting Bolts */}
      {[-0.4, 0.4].map((xPos, i) => (
        <group key={`yoke-bolts-${i}`}>
          {[-0.3, 0.3].map((zPos, j) => (
            <mesh key={`yoke-bolt-${i}-${j}`} position={[xPos, 1.0, zPos]} castShadow>
              <cylinderGeometry args={[0.03, 0.03, 0.4, 6]} />
              <meshPhongMaterial color="#2A2A2A" specular="#666666" shininess={60} />
            </mesh>
          ))}
        </group>
      ))}
      
      {/* Main Actuator Cylinder */}
      <mesh position={[0, 2.2, 0]} castShadow>
        <cylinderGeometry args={[0.9, 0.9, 1.4, 24]} />
        {/* `metalness` isn't a MeshPhongMaterial property (that's a PBR
            param); three.js silently ignores unknown material props, so
            this was already a no-op. Dropped rather than typed around. */}
        <meshPhongMaterial
          color="#8A8A8A"
          specular="#BBBBBB"
          shininess={50}
        />
      </mesh>

      {/* Actuator End Caps */}
      <mesh position={[0, 2.9, 0]} castShadow>
        <cylinderGeometry args={[0.95, 0.95, 0.15, 24]} />
        <meshPhongMaterial color="#6A6A6A" specular="#999999" shininess={60} />
      </mesh>
      
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.95, 0.95, 0.15, 24]} />
        <meshPhongMaterial color="#6A6A6A" specular="#999999" shininess={60} />
      </mesh>
      
      {/* Actuator Piston Rod */}
      <mesh position={[0, 1.0, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.8, 16]} />
        <meshPhongMaterial
          color="#4A4A4A"
          specular="#888888"
          shininess={80}
        />
      </mesh>

      {/* Piston Rod Seal Gland */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.2, 16]} />
        <meshPhongMaterial color="#5A5A5A" specular="#888888" shininess={40} />
      </mesh>
      
      {/* ========== POSITIONER & CONTROL MODULE ========== */}
      
      {/* Digital Positioner Housing */}
      <mesh position={[0, 2.8, 0.8]} castShadow>
        <boxGeometry args={[1.4, 1.0, 0.6]} />
        <meshPhongMaterial
          color="#2A2A3A"
          specular="#555566"
          shininess={60}
        />
      </mesh>

      {/* Positioner Front Panel */}
      <mesh position={[0, 2.8, 1.12]} castShadow>
        <boxGeometry args={[1.35, 0.95, 0.04]} />
        <meshPhongMaterial color="#E8E8E8" specular="#FFFFFF" shininess={90} />
      </mesh>
      
      {/* LCD Display with Bezel */}
      <mesh position={[0, 3.1, 1.14]} castShadow>
        <boxGeometry args={[0.8, 0.4, 0.02]} />
        <meshPhongMaterial color="#1A1A1A" />
      </mesh>
      
      {/* LCD Screen with Backlight */}
      <mesh position={[0, 3.1, 1.145]} castShadow>
        <boxGeometry args={[0.75, 0.35, 0.005]} />
        <meshBasicMaterial 
          color={
            !controlActive ? "#DC2626" :
            highAlarm || lowAlarm ? "#F59E0B" : 
            "#00FF7F"
          } 
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Digital Display Text Area */}
      <mesh position={[0, 3.1, 1.148]} castShadow>
        <boxGeometry args={[0.7, 0.3, 0.002]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      {/* Control Button Array */}
      {(
        [
          { pos: [-0.5, 2.6, 1.14], color: '#DC2626', label: 'STOP', active: false },
          { pos: [-0.2, 2.6, 1.14], color: '#10B981', label: 'AUTO', active: !manualMode },
          { pos: [0.1, 2.6, 1.14], color: '#F59E0B', label: 'MANUAL', active: manualMode },
          { pos: [0.4, 2.6, 1.14], color: '#3B82F6', label: 'RESET', active: false }
        ] as const
      ).map((button, i) => (
        <group key={`button-group-${i}`}>
          {/* Button Housing */}
          <mesh position={button.pos} rotation={[Math.PI/2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 0.03, 16]} />
            <meshPhongMaterial color="#3A3A3A" specular="#666666" shininess={50} />
          </mesh>
          {/* Button Top */}
          <mesh position={[button.pos[0], button.pos[1], button.pos[2] + 0.018]} rotation={[Math.PI/2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.015, 16]} />
            <meshPhongMaterial
              color={button.color}
              emissive={button.active ? button.color : '#000000'}
              emissiveIntensity={button.active ? 0.4 : 0}
              specular="#FFFFFF"
              shininess={80}
            />
          </mesh>
        </group>
      ))}

      {/* Status LED Array with Housings */}
      {(
        [
          { pos: [-0.5, 2.9, 1.14], color: '#DC2626', active: highAlarm, label: 'HI-ALARM' },
          { pos: [-0.2, 2.9, 1.14], color: '#F59E0B', active: lowAlarm, label: 'LO-ALARM' },
          { pos: [0.1, 2.9, 1.14], color: '#10B981', active: controlActive, label: 'READY' },
          { pos: [0.4, 2.9, 1.14], color: '#3B82F6', active: !manualMode, label: 'AUTO' }
        ] as const
      ).map((led, i) => (
        <group key={`led-group-${i}`}>
          {/* LED Housing */}
          <mesh position={led.pos} rotation={[Math.PI/2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.025, 12]} />
            <meshPhongMaterial color="#2A2A2A" />
          </mesh>
          {/* LED Lens */}
          <mesh position={[led.pos[0], led.pos[1], led.pos[2] + 0.015]} rotation={[Math.PI/2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.025, 0.025, 0.01, 12]} />
            <meshPhongMaterial 
              color={led.color}
              emissive={led.active ? led.color : '#000000'}
              emissiveIntensity={led.active ? 0.8 : 0}
              transparent
              opacity={led.active ? 1.0 : 0.4}
              specular="#FFFFFF"
              shininess={100}
            />
          </mesh>
        </group>
      ))}
      
      {/* ========== PRESSURE SENSORS & INSTRUMENTATION ========== */}
      
      {/* Upstream Pressure Transmitter */}
      <group position={[-1.2, -0.5, 0.8]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.4, 16]} />
          <meshPhongMaterial color="#6B7280" specular="#999999" shininess={50} />
        </mesh>
        <mesh position={[0, 0.25, 0]} castShadow>
          <boxGeometry args={[0.2, 0.15, 0.15]} />
          <meshPhongMaterial color="#4A5568" />
        </mesh>
        {/* Process Connection */}
        <mesh position={[0, -0.3, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.2, 12]} />
          <meshPhongMaterial color="#4A4A4A" />
        </mesh>
      </group>
      
      {/* Downstream Pressure Transmitter */}
      <group position={[1.2, -0.5, 0.8]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.4, 16]} />
          <meshPhongMaterial color="#6B7280" specular="#999999" shininess={50} />
        </mesh>
        <mesh position={[0, 0.25, 0]} castShadow>
          <boxGeometry args={[0.2, 0.15, 0.15]} />
          <meshPhongMaterial color="#4A5568" />
        </mesh>
        {/* Process Connection */}
        <mesh position={[0, -0.3, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.2, 12]} />
          <meshPhongMaterial color="#4A4A4A" />
        </mesh>
      </group>
      
      {/* Instrument Tubing */}
      <mesh position={[-1.2, -0.1, 0.8]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 0.6, 8]} />
        <meshPhongMaterial color="#C0C0C0" specular="#FFFFFF" shininess={90} />
      </mesh>
      
      <mesh position={[1.2, -0.1, 0.8]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 0.6, 8]} />
        <meshPhongMaterial color="#C0C0C0" specular="#FFFFFF" shininess={90} />
      </mesh>
      
      {/* ========== CABLE MANAGEMENT ========== */}
      
      {/* Conduit System */}
      <mesh position={[0, 2.4, 1.2]} castShadow>
        <boxGeometry args={[0.8, 0.1, 0.1]} />
        <meshPhongMaterial color="#3A3A3A" />
      </mesh>
      
      {/* Cable Glands */}
      {[-0.3, 0, 0.3].map((xPos, i) => (
        <mesh key={`gland-${i}`} position={[xPos, 2.4, 1.25]} rotation={[Math.PI/2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.1, 12]} />
          <meshPhongMaterial color="#2A2A2A" specular="#555555" shininess={40} />
        </mesh>
      ))}
      
      {/* ========== MOUNTING & FOUNDATION ========== */}
      
      {/* Valve Mounting Skid */}
      <mesh position={[0, -1.0, 0]} castShadow>
        <boxGeometry args={[3.5, 0.25, 2.0]} />
        <meshPhongMaterial
          color="#5A5A5A"
          specular="#888888"
          shininess={30}
        />
      </mesh>

      {/* Mounting Brackets */}
      {[-1.5, 1.5].map((xPos, i) => (
        <mesh key={`bracket-${i}`} position={[xPos, -0.7, 0]} castShadow>
          <boxGeometry args={[0.3, 0.6, 1.8]} />
          <meshPhongMaterial color="#4A4A4A" specular="#777777" shininess={40} />
        </mesh>
      ))}
      
      {/* Foundation Bolts */}
      {[-1.6, -0.8, 0.8, 1.6].map((xPos, i) => (
        <group key={`foundation-bolts-${i}`}>
          {[-0.8, 0.8].map((zPos, j) => (
            <mesh key={`foundation-bolt-${i}-${j}`} position={[xPos, -1.2, zPos]} castShadow>
              <cylinderGeometry args={[0.06, 0.06, 0.3, 8]} />
              <meshPhongMaterial color="#2A2A2A" specular="#555555" shininess={60} />
            </mesh>
          ))}
        </group>
      ))}
      
      {/* ========== NAMEPLATE & IDENTIFICATION ========== */}
      
      {/* Main Nameplate */}
      <mesh position={[0, -0.3, 0.72]} castShadow>
        <boxGeometry args={[1.8, 0.6, 0.03]} />
        <meshPhongMaterial 
          color="#F8F8F8" 
          specular="#FFFFFF" 
          shininess={100}
        />
      </mesh>
      
      {/* Nameplate Text Background */}
      <mesh position={[0, -0.3, 0.735]} castShadow>
        <boxGeometry args={[1.7, 0.55, 0.01]} />
        <meshBasicMaterial color="#1A1A1A" />
      </mesh>
      
      {/* Flow Direction Indicator */}
      <mesh position={[0, 0.3, 0.72]} rotation={[0, 0, -Math.PI/2]} castShadow>
        <coneGeometry args={[0.12, 0.3, 4]} />
        <meshPhongMaterial
          color="#FFD700" 
          emissive="#FFD700" 
          emissiveIntensity={0.2}
          specular="#FFFFFF" 
          shininess={80}
        />
      </mesh>
      
      {/* Manufacturer Logo Area */}
      <mesh position={[0, 0.6, 0.72]} castShadow>
        <boxGeometry args={[0.8, 0.2, 0.02]} />
        <meshPhongMaterial color="#E8E8E8" specular="#FFFFFF" shininess={90} />
      </mesh>
      
      {/* ========== CONNECTION PORTS ========== */}
      {connectionPorts.map((port) => {
        const isHovered = hoveredPort === port.id;
        const scale = isHovered ? 1.4 : 1;
        
        return (
          <group key={port.id} position={port.offset}>
            <mesh
              scale={[scale, scale, scale]}
              onClick={(e) => handlePortClick(port, e)}
              onPointerEnter={() => handlePortHover(port.id)}
              onPointerLeave={handlePortLeave}
              castShadow
            >
              <boxGeometry args={[0.18, 0.18, 0.12]} />
              <meshPhongMaterial 
                color={port.type === 'electric' ? "#C53030" : "#2B6CB0"} 
                emissive={isHovered ? getPortColor(port) : '#000000'}
                emissiveIntensity={isHovered ? 0.4 : 0}
                specular="#FFFFFF"
                shininess={70}
              />
            </mesh>
            
            <mesh position={[0, 0, 0.08]} scale={[scale, scale, scale]}>
              {port.type === 'electric' && <octahedronGeometry args={[0.05]} />}
              {port.type === 'liquid' && <sphereGeometry args={[0.05, 16, 16]} />}
              <meshPhongMaterial 
                color={getPortColor(port)}
                emissive={getPortColor(port)}
                emissiveIntensity={0.7}
                specular="#FFFFFF"
                shininess={80}
              />
            </mesh>
            
            {isHovered && (
              <mesh position={[0, 0, 0.2]}>
                <sphereGeometry args={[0.06]} />
                <meshBasicMaterial color="#FFFF00" />
              </mesh>
            )}
          </group>
        );
      })}
      
      {/* ========== DYNAMIC INDICATORS & EFFECTS ========== */}
      
      {/* High Pressure Alarm Beacon */}
      {highAlarm && (
        <mesh position={[0.8, 3.5, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.15, 12]} />
          <meshPhongMaterial 
            color="#DC2626" 
            emissive="#DC2626" 
            emissiveIntensity={Math.sin(Date.now() / 100) * 0.8 + 0.2}
            specular="#FFFFFF"
            shininess={100}
          />
        </mesh>
      )}
      
      {/* Low Pressure Warning */}
      {lowAlarm && (
        <mesh position={[-0.8, 3.5, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.15, 12]} />
          <meshPhongMaterial 
            color="#F59E0B" 
            emissive="#F59E0B" 
            emissiveIntensity={Math.sin(Date.now() / 200) * 0.6 + 0.4}
            specular="#FFFFFF"
            shininess={100}
          />
        </mesh>
      )}
      
      {/* Valve Position Indicator - Rotating Pointer */}
      <group position={[0, 0.8, 0.8]} rotation={[0, 0, (valvePosition / 100) * Math.PI * 1.8 - Math.PI * 0.9]}>
        <mesh castShadow>
          <boxGeometry args={[0.4, 0.04, 0.02]} />
          <meshPhongMaterial 
            color="#FFD700" 
            emissive="#FFD700" 
            emissiveIntensity={0.3}
            specular="#FFFFFF" 
            shininess={90}
          />
        </mesh>
      </group>
      
      {/* Position Scale */}
      <mesh position={[0, 0.8, 0.82]} rotation={[Math.PI/2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.25, 0.02, 32]} />
        <meshPhongMaterial color="#E8E8E8" specular="#FFFFFF" shininess={80} />
      </mesh>
      
      {/* Selection indicators */}
      {isSelected && isDraggable && (
        <>
          <mesh position={[0, 4.0, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.6, 8]} />
            <meshPhongMaterial 
              color="#FFFF00" 
              emissive="#FFFF00" 
              emissiveIntensity={0.8}
              specular="#FFFFFF"
              shininess={100}
            />
          </mesh>
          
          <mesh position={[0, -1.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.8, 2.2, 32]} />
            <meshBasicMaterial color="#00BFFF" transparent opacity={0.8} />
          </mesh>
        </>
      )}
      
      {/* Port highlights when selected */}
      {isSelected && (
        <>
          {connectionPorts.map((port) => (
            <mesh 
              key={`port-highlight-${port.id}`}
              position={port.offset}
            >
              <ringGeometry args={[0.22, 0.26, 16]} />
              <meshBasicMaterial 
                color={getPortColor(port)} 
                transparent 
                opacity={0.9}
                side={THREE.DoubleSide}
              />
            </mesh>
          ))}
        </>
      )}
      
      {/* Realistic Steam/Process Effect */}
      {valvePosition > 20 && (
        <group position={[1.8, 0.5, 0]}>
          {Array.from({length: 5}, (_, i) => (
            <mesh 
              key={`steam-${i}`} 
              position={[0.2 + i * 0.1, i * 0.2, 0]} 
              castShadow
            >
              <sphereGeometry args={[0.05 + i * 0.02, 8, 8]} />
              <meshBasicMaterial 
                color="#FFFFFF" 
                transparent 
                opacity={0.3 - i * 0.05}
              />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
};

// Export with enhanced connection port definitions
PressureControlValve.connectionPorts = [
  {
    id: 'process_inlet',
    type: 'liquid',
    label: 'Process Inlet (High Pressure)',
    offset: [-1.8, 0, 0],
    direction: [-1, 0, 0],
    required: true
  },
  {
    id: 'process_outlet',
    type: 'liquid',
    label: 'Process Outlet (Controlled)',
    offset: [1.8, 0, 0],
    direction: [1, 0, 0],
    required: true
  },
  {
    id: 'control_signal_4_20ma',
    type: 'electric',
    label: '4-20mA Control Signal',
    offset: [0, 3.2, 0.8],
    direction: [0, 1, 0],
    required: true
  },
  {
    id: 'power_24vdc',
    type: 'electric',
    label: '24VDC Power Supply',
    offset: [-0.4, 3.2, 0.8],
    direction: [0, 1, 0],
    required: true
  },
  {
    id: 'feedback_signal',
    type: 'electric',
    label: 'Position Feedback Signal',
    offset: [0.4, 3.2, 0.8],
    direction: [0, 1, 0],
    required: false
  },
  {
    id: 'alarm_output_high',
    type: 'electric',
    label: 'High Pressure Alarm',
    offset: [-0.6, 2.8, 1.0],
    direction: [0, 0, 1],
    required: false
  },
  {
    id: 'alarm_output_low',
    type: 'electric',
    label: 'Low Pressure Alarm',
    offset: [0.6, 2.8, 1.0],
    direction: [0, 0, 1],
    required: false
  }
];

export default PressureControlValve; 