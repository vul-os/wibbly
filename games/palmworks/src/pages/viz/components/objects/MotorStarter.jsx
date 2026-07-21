import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const MotorStarter = ({ position, onClick, onDrag, isSelected, isDraggable, gridSnap, gridSize, onPortClick }) => {
  const meshRef = useRef();
  const groupRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [hoveredPort, setHoveredPort] = useState(null);
  const [motorRunning, setMotorRunning] = useState(false);
  const [, setMotorCurrent] = useState(0);
  const [overloadTripped, setOverloadTripped] = useState(false);
  const [faultCondition, setFaultCondition] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [emergencyStop, setEmergencyStop] = useState(false);
  const { camera, gl } = useThree();

  // Industrial motor starter configuration
  const starterSettings = {
    ratedCurrent: 32.0,
    overloadCurrent: 38.0,
    ratedVoltage: 400,
    motorPower: 15.0, // kW
    protectionClass: 'IP65'
  };

  // Define connection ports for comprehensive motor control
  const connectionPorts = [
    {
      id: 'power_supply_l1',
      type: 'electric',
      label: 'L1 Power Supply (400V)',
      offset: [-0.8, 2.0, 1.2],
      direction: [0, 0, 1],
      required: true
    },
    {
      id: 'power_supply_l2',
      type: 'electric',
      label: 'L2 Power Supply (400V)',
      offset: [-0.4, 2.0, 1.2],
      direction: [0, 0, 1],
      required: true
    },
    {
      id: 'power_supply_l3',
      type: 'electric',
      label: 'L3 Power Supply (400V)',
      offset: [0.0, 2.0, 1.2],
      direction: [0, 0, 1],
      required: true
    },
    {
      id: 'motor_output_u',
      type: 'electric',
      label: 'Motor U Phase Output',
      offset: [0.4, 2.0, 1.2],
      direction: [0, 0, 1],
      required: true
    },
    {
      id: 'motor_output_v',
      type: 'electric',
      label: 'Motor V Phase Output',
      offset: [0.8, 2.0, 1.2],
      direction: [0, 0, 1],
      required: true
    },
    {
      id: 'motor_output_w',
      type: 'electric',
      label: 'Motor W Phase Output',
      offset: [1.2, 2.0, 1.2],
      direction: [0, 0, 1],
      required: true
    },
    {
      id: 'control_start',
      type: 'electric',
      label: 'Start Command (24VDC)',
      offset: [-1.0, 1.5, 1.2],
      direction: [0, 0, 1],
      required: false
    },
    {
      id: 'control_stop',
      type: 'electric',
      label: 'Stop Command (24VDC)',
      offset: [-0.6, 1.5, 1.2],
      direction: [0, 0, 1],
      required: false
    },
    {
      id: 'auxiliary_no',
      type: 'electric',
      label: 'Auxiliary Contact (NO)',
      offset: [1.0, 1.5, 1.2],
      direction: [0, 0, 1],
      required: false
    },
    {
      id: 'overload_alarm',
      type: 'electric',
      label: 'Overload Alarm Output',
      offset: [1.4, 1.5, 1.2],
      direction: [0, 0, 1],
      required: false
    }
  ];

  const snapToGrid = (value) => {
    if (!gridSnap) return value;
    return Math.round(value / gridSize) * gridSize;
  };

  // Simulate realistic motor starter operation
  React.useEffect(() => {
    const interval = setInterval(() => {
      setMotorCurrent(() => {
        if (!motorRunning) return 0;
        
        // Simulate motor startup current surge and normal operation
        const baseload = starterSettings.ratedCurrent * 0.8;
        const variation = (Math.random() - 0.5) * 2.0;
        const newCurrent = baseload + variation;
        
        // Check for overload condition
        if (newCurrent > starterSettings.overloadCurrent) {
          setOverloadTripped(true);
          setMotorRunning(false);
          setFaultCondition(true);
        }
        
        return Math.max(0, newCurrent);
      });
      
      // Random fault simulation (very rare)
      if (Math.random() < 0.001) {
        setFaultCondition(true);
        setMotorRunning(false);
      }
      
    }, 250);
    return () => clearInterval(interval);
  }, [motorRunning]);

  useFrame(() => {
    if (meshRef.current) {
      if (isSelected) {
        meshRef.current.material.emissive.setHex(0x112211);
      } else if (hovered && isDraggable) {
        meshRef.current.material.emissive.setHex(0x111111);
      } else {
        meshRef.current.material.emissive.setHex(0x000000);
      }
    }
    
    if (groupRef.current) {
      const targetScale = isDragging ? 1.01 : 1;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
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
        <mesh position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.8, 2.2, 16]} />
          <meshBasicMaterial color="#00E676" transparent opacity={0.4} />
        </mesh>
      )}
      
      {/* Invisible collision box */}
      <mesh onPointerDown={handlePointerDown} visible={false}>
        <boxGeometry args={[4.0, 4.5, 3.0]} />
      </mesh>
      
      {/* ========== MAIN ENCLOSURE ========== */}
      
      {/* Primary Enclosure - Steel Cabinet */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[2.5, 3.0, 1.0]} />
        <meshPhongMaterial 
          color="#E8E8E8" 
          specular="#FFFFFF" 
          shininess={80}
          metalness={0.1}
        />
      </mesh>
      
      {/* Enclosure Door Frame */}
      <mesh position={[0, 0, 0.52]} castShadow>
        <boxGeometry args={[2.45, 2.95, 0.04]} />
        <meshPhongMaterial color="#D0D0D0" specular="#FFFFFF" shininess={90} />
      </mesh>
      
      {/* Door Handle */}
      <mesh position={[1.0, 0.5, 0.55]} castShadow>
        <boxGeometry args={[0.15, 0.3, 0.05]} />
        <meshPhongMaterial color="#2A2A2A" specular="#666666" shininess={60} />
      </mesh>
      
      {/* Ventilation Grilles */}
      {[-0.8, 0.8].map((xPos, i) => (
        <group key={`vent-${i}`}>
          {Array.from({length: 8}, (_, j) => (
            <mesh key={`vent-line-${i}-${j}`} position={[xPos, 1.2 - j * 0.15, 0.54]} castShadow>
              <boxGeometry args={[0.4, 0.03, 0.02]} />
              <meshPhongMaterial color="#1A1A1A" />
            </mesh>
          ))}
        </group>
      ))}
      
      {/* ========== CONTROL PANEL SECTION ========== */}
      
      {/* Control Panel Housing */}
      <mesh position={[0, 0.8, 0.6]} castShadow>
        <boxGeometry args={[2.2, 1.0, 0.2]} />
        <meshPhongMaterial 
          color="#F5F5F5" 
          specular="#FFFFFF" 
          shininess={100}
        />
      </mesh>
      
      {/* Digital Display */}
      <mesh position={[0, 1.1, 0.72]} castShadow>
        <boxGeometry args={[1.0, 0.3, 0.03]} />
        <meshPhongMaterial color="#1A1A1A" />
      </mesh>
      
      {/* Display Screen */}
      <mesh position={[0, 1.1, 0.735]} castShadow>
        <boxGeometry args={[0.95, 0.25, 0.01]} />
        <meshBasicMaterial 
          color={
            faultCondition ? "#DC2626" :
            overloadTripped ? "#F59E0B" :
            motorRunning ? "#00FF7F" : "#4A90E2"
          } 
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Current Display Numbers */}
      <mesh position={[0, 1.1, 0.74]} castShadow>
        <boxGeometry args={[0.9, 0.2, 0.005]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      {/* Control Button Array */}
      {[
        { pos: [-0.8, 0.6, 0.72], color: '#10B981', label: 'START', size: 0.08, action: () => {
          if (!emergencyStop && !overloadTripped && !faultCondition) {
            setMotorRunning(true);
          }
        }},
        { pos: [-0.4, 0.6, 0.72], color: '#DC2626', label: 'STOP', size: 0.08, action: () => {
          setMotorRunning(false);
        }},
        { pos: [0.0, 0.6, 0.72], color: '#F59E0B', label: 'RESET', size: 0.06, action: () => {
          setOverloadTripped(false);
          setFaultCondition(false);
        }},
        { pos: [0.4, 0.6, 0.72], color: '#3B82F6', label: 'TEST', size: 0.06, action: () => {}},
        { pos: [0.8, 0.6, 0.72], color: '#8B5CF6', label: 'LOCAL', size: 0.06, action: () => {
          setManualMode(!manualMode);
        }}
      ].map((button, i) => (
        <group key={`button-group-${i}`}>
          {/* Button Housing */}
          <mesh position={button.pos} castShadow>
            <cylinderGeometry args={[button.size, button.size, 0.04, 16]} rotation={[Math.PI/2, 0, 0]} />
            <meshPhongMaterial color="#3A3A3A" specular="#777777" shininess={50} />
          </mesh>
          {/* Button Top */}
          <mesh 
            position={[button.pos[0], button.pos[1], button.pos[2] + 0.025]} 
            castShadow
            onClick={button.action}
          >
            <cylinderGeometry args={[button.size - 0.01, button.size - 0.01, 0.02, 16]} rotation={[Math.PI/2, 0, 0]} />
            <meshPhongMaterial 
              color={button.color}
              emissive={
                (button.label === 'START' && motorRunning) ||
                (button.label === 'LOCAL' && manualMode) ? button.color : '#000000'
              }
              emissiveIntensity={0.3}
              specular="#FFFFFF"
              shininess={90}
            />
          </mesh>
        </group>
      ))}
      
      {/* Emergency Stop Button */}
      <group position={[1.0, 1.1, 0.72]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.06, 16]} rotation={[Math.PI/2, 0, 0]} />
          <meshPhongMaterial color="#DC2626" specular="#FFFFFF" shininess={80} />
        </mesh>
        <mesh 
          position={[0, 0, 0.04]} 
          castShadow
          onClick={() => {
            setEmergencyStop(!emergencyStop);
            if (!emergencyStop) setMotorRunning(false);
          }}
        >
          <cylinderGeometry args={[0.1, 0.1, 0.03, 16]} rotation={[Math.PI/2, 0, 0]} />
          <meshPhongMaterial 
            color="#B91C1C" 
            emissive={emergencyStop ? "#DC2626" : "#000000"}
            emissiveIntensity={emergencyStop ? 0.5 : 0}
          />
        </mesh>
      </group>
      
      {/* Status LED Array */}
      {[
        { pos: [-1.0, 0.9, 0.72], color: '#10B981', active: motorRunning, label: 'RUN' },
        { pos: [-0.6, 0.9, 0.72], color: '#DC2626', active: faultCondition, label: 'FAULT' },
        { pos: [-0.2, 0.9, 0.72], color: '#F59E0B', active: overloadTripped, label: 'OVERLOAD' },
        { pos: [0.2, 0.9, 0.72], color: '#3B82F6', active: !manualMode, label: 'REMOTE' },
        { pos: [0.6, 0.9, 0.72], color: '#8B5CF6', active: manualMode, label: 'LOCAL' }
      ].map((led, i) => (
        <group key={`led-group-${i}`}>
          {/* LED Housing */}
          <mesh position={led.pos} castShadow>
            <cylinderGeometry args={[0.035, 0.035, 0.03, 12]} rotation={[Math.PI/2, 0, 0]} />
            <meshPhongMaterial color="#2A2A2A" />
          </mesh>
          {/* LED Lens */}
          <mesh position={[led.pos[0], led.pos[1], led.pos[2] + 0.02]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.015, 12]} rotation={[Math.PI/2, 0, 0]} />
            <meshPhongMaterial 
              color={led.color}
              emissive={led.active ? led.color : '#000000'}
              emissiveIntensity={led.active ? 0.9 : 0}
              transparent
              opacity={led.active ? 1.0 : 0.4}
              specular="#FFFFFF"
              shininess={100}
            />
          </mesh>
        </group>
      ))}
      
      {/* ========== ELECTRICAL COMPONENTS SECTION ========== */}
      
      {/* Main Contactor Assembly */}
      <group position={[0, 0, 0.3]}>
        {/* Contactor Housing */}
        <mesh castShadow>
          <boxGeometry args={[1.2, 0.8, 0.4]} />
          <meshPhongMaterial color="#2A2A3A" specular="#555566" shininess={60} />
        </mesh>
        
        {/* Contactor Coil */}
        <mesh position={[0, 0, 0.25]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.3, 16]} />
          <meshPhongMaterial color="#8B4513" specular="#AA6633" shininess={40} />
        </mesh>
        
        {/* Main Contacts */}
        {[-0.4, 0, 0.4].map((xPos, i) => (
          <group key={`contact-${i}`}>
            <mesh position={[xPos, 0.3, 0.1]} castShadow>
              <boxGeometry args={[0.1, 0.15, 0.2]} />
              <meshPhongMaterial color="#C0C0C0" specular="#FFFFFF" shininess={90} />
            </mesh>
            <mesh position={[xPos, -0.3, 0.1]} castShadow>
              <boxGeometry args={[0.1, 0.15, 0.2]} />
              <meshPhongMaterial color="#C0C0C0" specular="#FFFFFF" shininess={90} />
            </mesh>
          </group>
        ))}
      </group>
      
      {/* Overload Relay */}
      <group position={[0, -0.8, 0.3]}>
        <mesh castShadow>
          <boxGeometry args={[1.0, 0.6, 0.3]} />
          <meshPhongMaterial color="#4A5568" specular="#777888" shininess={50} />
        </mesh>
        
        {/* Thermal Elements */}
        {[-0.3, 0, 0.3].map((xPos, i) => (
          <mesh key={`thermal-${i}`} position={[xPos, 0, 0.2]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.2, 12]} />
            <meshPhongMaterial color="#FF6B35" specular="#FFAA77" shininess={70} />
          </mesh>
        ))}
        
        {/* Reset Button */}
        <mesh position={[0, 0.2, 0.2]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.02, 12]} rotation={[Math.PI/2, 0, 0]} />
          <meshPhongMaterial color="#F59E0B" specular="#FFFFFF" shininess={80} />
        </mesh>
      </group>
      
      {/* Circuit Breaker */}
      <group position={[0.8, 0.5, 0.3]}>
        <mesh castShadow>
          <boxGeometry args={[0.4, 1.0, 0.3]} />
          <meshPhongMaterial color="#1A1A2E" specular="#333355" shininess={60} />
        </mesh>
        
        {/* Breaker Handle */}
        <mesh position={[0, 0.4, 0.2]} castShadow>
          <boxGeometry args={[0.3, 0.1, 0.05]} />
          <meshPhongMaterial 
            color={faultCondition ? "#DC2626" : "#10B981"}
            emissive={faultCondition ? "#DC2626" : "#000000"}
            emissiveIntensity={faultCondition ? 0.3 : 0}
          />
        </mesh>
      </group>
      
      {/* Control Transformer */}
      <group position={[-0.8, -0.5, 0.3]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.4, 16]} />
          <meshPhongMaterial color="#4A4A4A" specular="#777777" shininess={50} />
        </mesh>
        
        {/* Transformer Windings */}
        <mesh position={[0, 0, 0.25]} castShadow>
          <torusGeometry args={[0.15, 0.03, 8, 16]} />
          <meshPhongMaterial color="#8B4513" specular="#AA6633" shininess={40} />
        </mesh>
      </group>
      
      {/* ========== TERMINAL BLOCKS ========== */}
      
      {/* Power Terminal Block */}
      <group position={[0, 1.6, 0.8]}>
        <mesh castShadow>
          <boxGeometry args={[2.0, 0.3, 0.2]} />
          <meshPhongMaterial color="#F5F5DC" specular="#FFFFFF" shininess={70} />
        </mesh>
        
        {/* Terminal Screws */}
        {[-0.8, -0.4, 0, 0.4, 0.8, 1.2].map((xPos, i) => (
          <mesh key={`terminal-${i}`} position={[xPos, 0, 0.12]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.08, 6]} />
            <meshPhongMaterial color="#2A2A2A" specular="#666666" shininess={80} />
          </mesh>
        ))}
      </group>
      
      {/* Control Terminal Block */}
      <group position={[0, 1.2, 0.8]}>
        <mesh castShadow>
          <boxGeometry args={[1.6, 0.2, 0.15]} />
          <meshPhongMaterial color="#E6E6FA" specular="#FFFFFF" shininess={70} />
        </mesh>
        
        {/* Control Terminal Screws */}
        {[-0.6, -0.2, 0.2, 0.6, 1.0, 1.4].map((xPos, i) => (
          <mesh key={`ctrl-terminal-${i}`} position={[xPos, 0, 0.08]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.06, 6]} />
            <meshPhongMaterial color="#2A2A2A" specular="#666666" shininess={80} />
          </mesh>
        ))}
      </group>
      
      {/* ========== WIRING ========== */}
      
      {/* Power Cables */}
      {[-0.4, 0, 0.4].map((xPos, i) => (
        <mesh key={`power-cable-${i}`} position={[xPos, 0.8, 0.6]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
          <meshPhongMaterial color="#1A1A1A" />
        </mesh>
      ))}
      
      {/* Control Wiring */}
      {[-0.3, 0.3].map((xPos, i) => (
        <mesh key={`ctrl-cable-${i}`} position={[xPos, 0.6, 0.65]} castShadow>
          <cylinderGeometry args={[0.01, 0.01, 0.3, 6]} />
          <meshPhongMaterial color={i === 0 ? "#DC2626" : "#3B82F6"} />
        </mesh>
      ))}
      
      {/* ========== MOUNTING & ENCLOSURE ========== */}
      
      {/* Mounting Rails */}
      <mesh position={[0, -1.6, 0.3]} castShadow>
        <boxGeometry args={[2.2, 0.1, 0.6]} />
        <meshPhongMaterial color="#4A4A4A" specular="#777777" shininess={50} />
      </mesh>
      
      {/* Enclosure Feet */}
      {[-1.0, 1.0].map((xPos, i) => (
        <group key={`foot-${i}`}>
          {[-0.4, 0.4].map((zPos, j) => (
            <mesh key={`foot-${i}-${j}`} position={[xPos, -1.8, zPos]} castShadow>
              <cylinderGeometry args={[0.06, 0.06, 0.3, 8]} />
              <meshPhongMaterial color="#2A2A2A" specular="#555555" shininess={60} />
            </mesh>
          ))}
        </group>
      ))}
      
      {/* ========== NAMEPLATE & LABELING ========== */}
      
      {/* Main Nameplate */}
      <mesh position={[0, -1.2, 0.52]} castShadow>
        <boxGeometry args={[1.8, 0.5, 0.02]} />
        <meshPhongMaterial 
          color="#F8F8F8" 
          specular="#FFFFFF" 
          shininess={100}
        />
      </mesh>
      
      {/* Nameplate Text Background */}
      <mesh position={[0, -1.2, 0.53]} castShadow>
        <boxGeometry args={[1.7, 0.45, 0.005]} />
        <meshBasicMaterial color="#1A1A1A" />
      </mesh>
      
      {/* Electrical Symbol */}
      <mesh position={[0, 0.2, 0.52]} castShadow>
        <boxGeometry args={[0.2, 0.2, 0.02]} />
        <meshPhongMaterial 
          color="#FFD700" 
          emissive="#FFD700" 
          emissiveIntensity={0.3}
          specular="#FFFFFF" 
          shininess={90}
        />
      </mesh>
      
      {/* ========== CONNECTION PORTS ========== */}
      {connectionPorts.map((port) => {
        const isHovered = hoveredPort === port.id;
        const scale = isHovered ? 1.3 : 1;
        
        return (
          <group key={port.id} position={port.offset}>
            <mesh
              scale={[scale, scale, scale]}
              onClick={(e) => handlePortClick(port, e)}
              onPointerEnter={() => handlePortHover(port.id)}
              onPointerLeave={handlePortLeave}
              castShadow
            >
              <boxGeometry args={[0.15, 0.15, 0.1]} />
              <meshPhongMaterial 
                color="#B91C1C" 
                emissive={isHovered ? getPortColor(port) : '#000000'}
                emissiveIntensity={isHovered ? 0.4 : 0}
                specular="#FFFFFF"
                shininess={80}
              />
            </mesh>
            
            <mesh position={[0, 0, 0.08]} scale={[scale, scale, scale]}>
              <octahedronGeometry args={[0.04]} />
              <meshPhongMaterial 
                color={getPortColor(port)}
                emissive={getPortColor(port)}
                emissiveIntensity={0.7}
                specular="#FFFFFF"
                shininess={90}
              />
            </mesh>
            
            {isHovered && (
              <mesh position={[0, 0, 0.18]}>
                <sphereGeometry args={[0.05]} />
                <meshBasicMaterial color="#FFFF00" />
              </mesh>
            )}
          </group>
        );
      })}
      
      {/* ========== DYNAMIC INDICATORS & EFFECTS ========== */}
      
      {/* Fault Alarm Beacon */}
      {faultCondition && (
        <mesh position={[0, 2.2, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.15, 12]} />
          <meshPhongMaterial 
            color="#DC2626" 
            emissive="#DC2626" 
            emissiveIntensity={Math.sin(Date.now() / 80) * 0.9 + 0.1}
            specular="#FFFFFF"
            shininess={100}
          />
        </mesh>
      )}
      
      {/* Motor Running Indicator */}
      {motorRunning && (
        <mesh position={[0, 2.0, 0.6]} castShadow>
          <sphereGeometry args={[0.05]} />
          <meshBasicMaterial 
            color="#00FF00" 
            transparent 
            opacity={Math.sin(Date.now() / 300) * 0.3 + 0.7}
          />
        </mesh>
      )}
      
      {/* Current Flow Animation */}
      {motorRunning && (
        <group>
          {[-0.4, 0, 0.4].map((xPos, i) => (
            <mesh 
              key={`current-${i}`} 
              position={[xPos, 1.0 + Math.sin(Date.now() / 200 + i) * 0.1, 0.7]} 
              castShadow
            >
              <sphereGeometry args={[0.02]} />
              <meshBasicMaterial 
                color="#00BFFF" 
                transparent 
                opacity={0.8}
              />
            </mesh>
          ))}
        </group>
      )}
      
      {/* Selection indicators */}
      {isSelected && isDraggable && (
        <>
          <mesh position={[0, 2.8, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.5, 8]} />
            <meshPhongMaterial 
              color="#FFFF00" 
              emissive="#FFFF00" 
              emissiveIntensity={0.8}
              specular="#FFFFFF"
              shininess={100}
            />
          </mesh>
          
          <mesh position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.5, 1.9, 32]} />
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
              <ringGeometry args={[0.18, 0.22, 16]} />
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
    </group>
  );
};

// Export with comprehensive connection port definitions
MotorStarter.connectionPorts = [
  {
    id: 'power_supply_l1',
    type: 'electric',
    label: 'L1 Power Supply (400V)',
    offset: [-0.8, 2.0, 1.2],
    direction: [0, 0, 1],
    required: true
  },
  {
    id: 'power_supply_l2',
    type: 'electric',
    label: 'L2 Power Supply (400V)',
    offset: [-0.4, 2.0, 1.2],
    direction: [0, 0, 1],
    required: true
  },
  {
    id: 'power_supply_l3',
    type: 'electric',
    label: 'L3 Power Supply (400V)',
    offset: [0.0, 2.0, 1.2],
    direction: [0, 0, 1],
    required: true
  },
  {
    id: 'motor_output_u',
    type: 'electric',
    label: 'Motor U Phase Output',
    offset: [0.4, 2.0, 1.2],
    direction: [0, 0, 1],
    required: true
  },
  {
    id: 'motor_output_v',
    type: 'electric',
    label: 'Motor V Phase Output',
    offset: [0.8, 2.0, 1.2],
    direction: [0, 0, 1],
    required: true
  },
  {
    id: 'motor_output_w',
    type: 'electric',
    label: 'Motor W Phase Output',
    offset: [1.2, 2.0, 1.2],
    direction: [0, 0, 1],
    required: true
  },
  {
    id: 'control_start',
    type: 'electric',
    label: 'Start Command (24VDC)',
    offset: [-1.0, 1.5, 1.2],
    direction: [0, 0, 1],
    required: false
  },
  {
    id: 'control_stop',
    type: 'electric',
    label: 'Stop Command (24VDC)',
    offset: [-0.6, 1.5, 1.2],
    direction: [0, 0, 1],
    required: false
  },
  {
    id: 'auxiliary_no',
    type: 'electric',
    label: 'Auxiliary Contact (NO)',
    offset: [1.0, 1.5, 1.2],
    direction: [0, 0, 1],
    required: false
  },
  {
    id: 'overload_alarm',
    type: 'electric',
    label: 'Overload Alarm Output',
    offset: [1.4, 1.5, 1.2],
    direction: [0, 0, 1],
    required: false
  }
];

export default MotorStarter; 