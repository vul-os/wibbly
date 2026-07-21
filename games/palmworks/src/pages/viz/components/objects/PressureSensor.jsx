import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const PressureSensor = ({ position, onClick, onDrag, isSelected, isDraggable, gridSnap, gridSize, onPortClick }) => {
  const meshRef = useRef();
  const groupRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [hoveredPort, setHoveredPort] = useState(null);
  const [currentPressure, setCurrentPressure] = useState(12.7);
  const [highAlarm, setHighAlarm] = useState(false);
  const [lowAlarm, setLowAlarm] = useState(false);
  const [communicationActive, setCommunicationActive] = useState(true);
  const { camera, gl } = useThree();

  // Industrial pressure transmitter configuration
  const pressureSettings = {
    minRange: 0.0,
    maxRange: 25.0,
    highAlarmSetpoint: 20.0,
    lowAlarmSetpoint: 2.0,
    units: 'bar'
  };

  // Define connection ports with realistic industrial locations
  const connectionPorts = [
    {
      id: 'power_24vdc_loop',
      type: 'electric',
      label: '24VDC Loop Power (+)',
      offset: [-0.15, 1.2, 0.45],
      direction: [0, 0, 1],
      required: true
    },
    {
      id: 'signal_4_20ma',
      type: 'electric',
      label: '4-20mA Signal (-)',
      offset: [0.15, 1.2, 0.45],
      direction: [0, 0, 1],
      required: true
    },
    {
      id: 'process_connection_high',
      type: 'liquid',
      label: 'Process High Pressure',
      offset: [0, -1.8, 0],
      direction: [0, -1, 0],
      required: true
    },
    {
      id: 'process_connection_low',
      type: 'liquid',
      label: 'Process Low Pressure (Ref)',
      offset: [0.8, -1.8, 0],
      direction: [0, -1, 0],
      required: false
    }
  ];

  const snapToGrid = (value) => {
    if (!gridSnap) return value;
    return Math.round(value / gridSize) * gridSize;
  };

  // Simulate realistic pressure measurement with drift and noise
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPressure(prev => {
        // Simulate realistic pressure variations
        const noise = (Math.random() - 0.5) * 0.3;
        const drift = Math.sin(Date.now() / 10000) * 0.5;
        const newPressure = prev + noise + drift * 0.1;
        
        setHighAlarm(newPressure > pressureSettings.highAlarmSetpoint);
        setLowAlarm(newPressure < pressureSettings.lowAlarmSetpoint);
        setCommunicationActive(Math.random() > 0.005); // Very rare communication loss
        
        return Math.max(0, Math.min(25, newPressure));
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useFrame(() => {
    if (meshRef.current) {
      if (isSelected) {
        meshRef.current.material.emissive.setHex(0x222222);
      } else if (hovered && isDraggable) {
        meshRef.current.material.emissive.setHex(0x111111);
      } else {
        meshRef.current.material.emissive.setHex(0x000000);
      }
    }
    
    if (groupRef.current) {
      const targetScale = isDragging ? 1.02 : 1;
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
        gl.domElement.style.cursor = isDraggable ? 'grab' : 'auto';
        
        document.removeEventListener('mousemove', handlePointerMove);
        document.removeEventListener('mouseup', handlePointerUp);
        document.removeEventListener('touchmove', handlePointerMove);
        document.removeEventListener('touchend', handlePointerUp);
        
        onClick?.(event);
        return;
      }
      
      setIsDragging(false);
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
        <mesh position={[0, -2.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.2, 1.5, 16]} />
          <meshBasicMaterial color="#00E676" transparent opacity={0.4} />
        </mesh>
      )}
      
      {/* Invisible collision box */}
      <mesh onPointerDown={handlePointerDown} visible={false}>
        <boxGeometry args={[3.0, 4.5, 2.0]} />
      </mesh>
      
      {/* ========== TRANSMITTER HOUSING ========== */}
      
      {/* Main Electronics Housing */}
      <mesh ref={meshRef} castShadow receiveShadow position={[0, 0.8, 0]}>
        <boxGeometry args={[1.2, 1.8, 0.8]} />
        <meshLambertMaterial color="#8E9AAF" roughness={0.3} />
      </mesh>
      
      {/* Housing Top Cap */}
      <mesh castShadow position={[0, 1.8, 0]}>
        <cylinderGeometry args={[0.65, 0.65, 0.2, 8]} />
        <meshLambertMaterial color="#6B7280" />
      </mesh>
      
      {/* Housing Front Plate with Bezel */}
      <mesh position={[0, 0.8, 0.42]} castShadow>
        <boxGeometry args={[1.15, 1.75, 0.05]} />
        <meshLambertMaterial color="#CBD5E1" />
      </mesh>
      
      {/* Display Bezel */}
      <mesh position={[0, 1.1, 0.445]} castShadow>
        <boxGeometry args={[0.9, 0.6, 0.03]} />
        <meshLambertMaterial color="#374151" />
      </mesh>
      
      {/* LCD Display */}
      <mesh position={[0, 1.1, 0.46]} castShadow>
        <boxGeometry args={[0.85, 0.55, 0.015]} />
        <meshLambertMaterial color="#1F2937" />
      </mesh>
      
      {/* Display Screen with Backlight */}
      <mesh position={[0, 1.1, 0.468]} castShadow>
        <boxGeometry args={[0.8, 0.5, 0.008]} />
        <meshLambertMaterial 
          color={
            !communicationActive ? "#DC2626" :
            highAlarm || lowAlarm ? "#F59E0B" : 
            "#10B981"
          } 
          emissive={
            !communicationActive ? "#DC2626" :
            highAlarm || lowAlarm ? "#F59E0B" : 
            "#10B981"
          }
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Display Text Area */}
      <mesh position={[0, 1.1, 0.47]} castShadow>
        <boxGeometry args={[0.75, 0.45, 0.002]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      {/* Status LED Array */}
      {[
        { pos: [-0.35, 0.5, 0.44], color: '#DC2626', active: highAlarm, label: 'HI' },
        { pos: [-0.15, 0.5, 0.44], color: '#F59E0B', active: lowAlarm, label: 'LO' },
        { pos: [0.05, 0.5, 0.44], color: '#10B981', active: communicationActive, label: 'OK' },
        { pos: [0.25, 0.5, 0.44], color: '#3B82F6', active: true, label: 'PWR' }
      ].map((led, i) => (
        <group key={`led-group-${i}`}>
          {/* LED Housing */}
          <mesh position={led.pos} castShadow>
            <cylinderGeometry args={[0.025, 0.025, 0.02, 12]} rotation={[Math.PI/2, 0, 0]} />
            <meshLambertMaterial color="#374151" />
          </mesh>
          {/* LED Light */}
          <mesh position={[led.pos[0], led.pos[1], led.pos[2] + 0.012]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.01, 12]} rotation={[Math.PI/2, 0, 0]} />
            <meshLambertMaterial 
              color={led.color} 
              emissive={led.active ? led.color : '#000000'}
              emissiveIntensity={led.active ? 0.8 : 0}
              transparent
              opacity={led.active ? 1.0 : 0.3}
            />
          </mesh>
        </group>
      ))}
      
      {/* ========== CABLE GLAND COMPARTMENT ========== */}
      
      {/* Cable Gland Housing */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[0.8, 0.4, 0.5]} />
        <meshLambertMaterial color="#6B7280" />
      </mesh>
      
      {/* Cable Gland Threads */}
      <mesh position={[-0.15, 1.5, 0.3]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.2, 12]} rotation={[Math.PI/2, 0, 0]} />
        <meshLambertMaterial color="#4B5563" />
      </mesh>
      
      <mesh position={[0.15, 1.5, 0.3]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.2, 12]} rotation={[Math.PI/2, 0, 0]} />
        <meshLambertMaterial color="#4B5563" />
      </mesh>
      
      {/* ========== MOUNTING BRACKET ========== */}
      
      {/* Main Mounting Bracket */}
      <mesh position={[0, 0.2, -0.5]} castShadow>
        <boxGeometry args={[1.6, 0.8, 0.1]} />
        <meshLambertMaterial color="#6B7280" />
      </mesh>
      
      {/* Mounting Holes */}
      <mesh position={[-0.6, 0.2, -0.52]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.12, 16]} rotation={[Math.PI/2, 0, 0]} />
        <meshLambertMaterial color="#374151" />
      </mesh>
      
      <mesh position={[0.6, 0.2, -0.52]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.12, 16]} rotation={[Math.PI/2, 0, 0]} />
        <meshLambertMaterial color="#374151" />
      </mesh>
      
      {/* ========== PROCESS MANIFOLD ========== */}
      
      {/* Main Manifold Block */}
      <mesh position={[0, -0.8, 0]} castShadow>
        <boxGeometry args={[1.8, 0.8, 0.6]} />
        <meshLambertMaterial color="#9CA3AF" />
      </mesh>
      
      {/* Pressure Ports with Flanges */}
      <mesh position={[0, -1.4, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.25, 0.4, 16]} />
        <meshLambertMaterial color="#6B7280" />
      </mesh>
      
      {/* High Pressure Flange */}
      <mesh position={[0, -1.7, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.1, 16]} />
        <meshLambertMaterial color="#4B5563" />
      </mesh>
      
      {/* Low Pressure Port */}
      <mesh position={[0.8, -1.4, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.4, 16]} />
        <meshLambertMaterial color="#6B7280" />
      </mesh>
      
      {/* Low Pressure Flange */}
      <mesh position={[0.8, -1.7, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.1, 16]} />
        <meshLambertMaterial color="#4B5563" />
      </mesh>
      
      {/* Flange Bolts */}
      {[0, Math.PI/2, Math.PI, 3*Math.PI/2].map((angle, i) => (
        <group key={`bolt-group-${i}`}>
          <mesh position={[
            Math.cos(angle) * 0.25, 
            -1.7, 
            Math.sin(angle) * 0.25
          ]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.12, 6]} />
            <meshLambertMaterial color="#374151" />
          </mesh>
        </group>
      ))}
      
      {/* ========== NAMEPLATE ========== */}
      
      {/* Nameplate */}
      <mesh position={[0, 0.3, 0.44]} castShadow>
        <boxGeometry args={[0.8, 0.3, 0.01]} />
        <meshLambertMaterial color="#F3F4F6" />
      </mesh>
      
      {/* Nameplate Text Background */}
      <mesh position={[0, 0.3, 0.445]} castShadow>
        <boxGeometry args={[0.75, 0.25, 0.005]} />
        <meshBasicMaterial color="#1F2937" />
      </mesh>
      
      {/* ========== CONNECTION PORTS ========== */}
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
              <boxGeometry args={[0.12, 0.12, 0.08]} />
              <meshLambertMaterial 
                color="#DC2626" 
                emissive={isHovered ? getPortColor(port) : '#000000'}
                emissiveIntensity={isHovered ? 0.4 : 0}
              />
            </mesh>
            
            <mesh position={[0, 0, 0.08]} scale={[scale, scale, scale]}>
              {port.type === 'electric' && <octahedronGeometry args={[0.03]} />}
              {port.type === 'liquid' && <sphereGeometry args={[0.03, 12, 12]} />}
              <meshLambertMaterial 
                color={getPortColor(port)}
                emissive={getPortColor(port)}
                emissiveIntensity={0.7}
              />
            </mesh>
            
            {isHovered && (
              <mesh position={[0, 0, 0.15]}>
                <sphereGeometry args={[0.04]} />
                <meshBasicMaterial color="#FDE047" />
              </mesh>
            )}
          </group>
        );
      })}
      
      {/* ========== INDICATORS & EFFECTS ========== */}
      
      {/* High Alarm Strobe */}
      {highAlarm && (
        <mesh position={[0.5, 2.2, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.1, 12]} />
          <meshLambertMaterial 
            color="#DC2626" 
            emissive="#DC2626" 
            emissiveIntensity={Math.sin(Date.now() / 200) * 0.5 + 0.5}
          />
        </mesh>
      )}
      
      {/* Selection indicators */}
      {isSelected && isDraggable && (
        <>
          <mesh position={[0, 2.5, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.4, 8]} />
            <meshLambertMaterial color="#FDE047" emissive="#FDE047" emissiveIntensity={0.6} />
          </mesh>
          
          <mesh position={[0, -2.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.0, 1.3, 32]} />
            <meshBasicMaterial color="#3B82F6" transparent opacity={0.7} />
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
              <ringGeometry args={[0.15, 0.18, 16]} />
              <meshBasicMaterial 
                color={getPortColor(port)} 
                transparent 
                opacity={0.8}
                side={THREE.DoubleSide}
              />
            </mesh>
          ))}
        </>
      )}
      
      {/* Process Connection Labels */}
      {isSelected && (
        <>
          <mesh position={[0, -2.2, 0]}>
            <sphereGeometry args={[0.02]} />
            <meshBasicMaterial color="#60A5FA" />
          </mesh>
          <mesh position={[0.8, -2.2, 0]}>
            <sphereGeometry args={[0.02]} />
            <meshBasicMaterial color="#60A5FA" />
          </mesh>
        </>
      )}
    </group>
  );
};

// Export with enhanced connection port definitions
PressureSensor.connectionPorts = [
  {
    id: 'power_24vdc_loop',
    type: 'electric',
    label: '24VDC Loop Power (+)',
    offset: [-0.15, 1.2, 0.45],
    direction: [0, 0, 1],
    required: true
  },
  {
    id: 'signal_4_20ma',
    type: 'electric',
    label: '4-20mA Signal (-)',
    offset: [0.15, 1.2, 0.45],
    direction: [0, 0, 1],
    required: true
  },
  {
    id: 'process_connection_high',
    type: 'liquid',
    label: 'Process High Pressure',
    offset: [0, -1.8, 0],
    direction: [0, -1, 0],
    required: true
  },
  {
    id: 'process_connection_low',
    type: 'liquid',
    label: 'Process Low Pressure (Ref)',
    offset: [0.8, -1.8, 0],
    direction: [0, -1, 0],
    required: false
  }
];

export default PressureSensor; 