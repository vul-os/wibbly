import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const TemperatureSwitch = ({ position, onClick, onDrag, isSelected, isDraggable, gridSnap, gridSize, onPortClick }) => {
  const meshRef = useRef();
  const groupRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [hoveredPort, setHoveredPort] = useState(null);
  const [currentTemp, setCurrentTemp] = useState(67.3);
  const [highAlarm, setHighAlarm] = useState(false);
  const [lowAlarm, setLowAlarm] = useState(false);
  const [shutdown, setShutdown] = useState(false);
  const [communicationActive, setCommunicationActive] = useState(true);
  const { camera, gl } = useThree();

  // Industrial temperature controller configuration
  const tempSettings = {
    highSetpoint: 85.0,
    lowSetpoint: 15.0,
    highShutdown: 100.0,
    lowShutdown: 5.0,
    deadband: 2.0,
    units: '°C'
  };

  // Define connection ports for the industrial temperature controller
  const connectionPorts = [
    {
      id: 'power_main_120vac',
      type: 'electric',
      label: '120VAC Power',
      offset: [0, -2.8, -1.2],
      direction: [0, -1, 0],
      required: true
    },
    {
      id: 'power_control_24vdc',
      type: 'electric',
      label: '24VDC Control',
      offset: [0.5, -2.8, -1.2],
      direction: [0, -1, 0],
      required: true
    },
    {
      id: 'rtd_input_pt100',
      type: 'electric',
      label: 'RTD PT100 Input',
      offset: [0, -3.2, 0],
      direction: [0, -1, 0],
      required: true
    },
    {
      id: 'alarm_relay_1_no',
      type: 'electric',
      label: 'Alarm 1 N.O.',
      offset: [1.2, -1.5, 0.8],
      direction: [1, 0, 0],
      required: false
    },
    {
      id: 'alarm_relay_2_nc',
      type: 'electric',
      label: 'Alarm 2 N.C.',
      offset: [1.2, -1.8, 0.8],
      direction: [1, 0, 0],
      required: false
    },
    {
      id: 'shutdown_relay_no',
      type: 'electric',
      label: 'Shutdown N.O.',
      offset: [1.2, -2.1, 0.8],
      direction: [1, 0, 0],
      required: false
    },
    {
      id: 'analog_output_4_20ma',
      type: 'electric',
      label: '4-20mA Output',
      offset: [1.2, -1.2, 0.8],
      direction: [1, 0, 0],
      required: false
    },
    {
      id: 'modbus_rs485',
      type: 'electric',
      label: 'Modbus RS485',
      offset: [1.2, -0.9, 0.8],
      direction: [1, 0, 0],
      required: false
    },
    {
      id: 'ethernet_tcp_ip',
      type: 'electric',
      label: 'Ethernet TCP/IP',
      offset: [1.2, -0.6, 0.8],
      direction: [1, 0, 0],
      required: false
    }
  ];

  const snapToGrid = (value) => {
    if (!gridSnap) return value;
    return Math.round(value / gridSize) * gridSize;
  };

  // Simulate realistic temperature monitoring
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTemp(prev => {
        // More realistic temperature simulation
        const trend = (Math.sin(Date.now() / 10000) * 2); // Slow trend
        const noise = (Math.random() - 0.5) * 1.5; // Small fluctuations
        const newTemp = prev + trend + noise;
        
        // Check industrial alarm conditions with hysteresis
        const newHighAlarm = newTemp > tempSettings.highSetpoint;
        const newLowAlarm = newTemp < tempSettings.lowSetpoint;
        const newShutdown = newTemp > tempSettings.highShutdown || newTemp < tempSettings.lowShutdown;
        
        setHighAlarm(newHighAlarm);
        setLowAlarm(newLowAlarm);
        setShutdown(newShutdown);
        
        // Simulate communication status
        setCommunicationActive(Math.random() > 0.02); // 98% uptime
        
        return Math.max(0, Math.min(150, newTemp));
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

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
    
    // Subtle scale when dragging
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
      {/* Grid snap indicators */}
      {isDragging && gridSnap && (
        <mesh position={[0, -3.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.2, 1.5, 16]} />
          <meshBasicMaterial color="#ffeb3b" transparent opacity={0.3} />
        </mesh>
      )}
      
      {/* Invisible collision box */}
      <mesh onPointerDown={handlePointerDown} visible={false}>
        <boxGeometry args={[3, 6, 3]} />
      </mesh>
      
      {/* ===========================================
          MAIN CONTROLLER ENCLOSURE - Professional Grade
          =========================================== */}
      
      {/* Main Enclosure Body - Cast Aluminum */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[1.0, 2.2, 0.6]} />
        <meshLambertMaterial color="#BDC3C7" />
      </mesh>
      
      {/* Enclosure Front Bezel */}
      <mesh position={[0, 0, 0.32]} castShadow>
        <boxGeometry args={[0.98, 2.18, 0.04]} />
        <meshLambertMaterial color="#ECF0F1" />
      </mesh>
      
      {/* Enclosure Mounting Flanges */}
      {[
        [-0.6, 0.9, 0], [0.6, 0.9, 0], [-0.6, -0.9, 0], [0.6, -0.9, 0]
      ].map((pos, i) => (
        <mesh key={`flange-${i}`} position={pos} castShadow>
          <boxGeometry args={[0.2, 0.2, 0.6]} />
          <meshLambertMaterial color="#95A5A6" />
        </mesh>
      ))}
      
      {/* Mounting Bolt Holes */}
      {[
        [-0.6, 0.9, 0.3], [0.6, 0.9, 0.3], [-0.6, -0.9, 0.3], [0.6, -0.9, 0.3]
      ].map((pos, i) => (
        <mesh key={`bolt-hole-${i}`} position={pos} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.08, 8]} rotation={[Math.PI/2, 0, 0]} />
          <meshLambertMaterial color="#2C3E50" />
        </mesh>
      ))}
      
      {/* ===========================================
          PROFESSIONAL HMI DISPLAY SYSTEM
          =========================================== */}
      
      {/* Main Display Bezel - Industrial Grade */}
      <mesh position={[0, 0.6, 0.34]} castShadow>
        <boxGeometry args={[0.7, 0.45, 0.03]} />
        <meshLambertMaterial color="#2C3E50" />
      </mesh>
      
      {/* LCD Display Screen */}
      <mesh position={[0, 0.6, 0.355]} castShadow>
        <boxGeometry args={[0.65, 0.4, 0.008]} />
        <meshLambertMaterial color="#000000" />
      </mesh>
      
      {/* Display Content - Professional Layout */}
      <mesh position={[0, 0.6, 0.36]} castShadow>
        <boxGeometry args={[0.6, 0.35, 0.002]} />
        <meshLambertMaterial 
          color={
            shutdown ? "#FF0000" : 
            highAlarm || lowAlarm ? "#FF8C00" : 
            communicationActive ? "#00FF41" : "#666666"
          } 
        />
      </mesh>
      
      {/* Display Segments - Industrial 7-Segment Style */}
      {/* Main temperature reading */}
      <mesh position={[-0.15, 0.65, 0.361]} castShadow>
        <boxGeometry args={[0.25, 0.12, 0.001]} />
        <meshLambertMaterial 
          color={shutdown ? "#FF3030" : "#00FF41"} 
          emissive={shutdown ? "#FF3030" : "#00FF41"}
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Units display */}
      <mesh position={[0.1, 0.65, 0.361]} castShadow>
        <boxGeometry args={[0.08, 0.04, 0.001]} />
        <meshLambertMaterial color="#FFFF00" />
      </mesh>
      
      {/* Setpoint display */}
      <mesh position={[0.15, 0.55, 0.361]} castShadow>
        <boxGeometry args={[0.15, 0.06, 0.001]} />
        <meshLambertMaterial color="#00BFFF" />
      </mesh>
      
      {/* Status bar */}
      <mesh position={[0, 0.45, 0.361]} castShadow>
        <boxGeometry args={[0.55, 0.03, 0.001]} />
        <meshLambertMaterial 
          color={communicationActive ? "#00FF00" : "#FF0000"}
          emissive={communicationActive ? "#00FF00" : "#FF0000"}
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* ===========================================
          INDUSTRIAL CONTROL INTERFACE
          =========================================== */}
      
      {/* Function Buttons - Professional Layout */}
      {[
        { pos: [-0.25, 0.15, 0.34], label: 'MENU', color: '#34495E' },
        { pos: [-0.08, 0.15, 0.34], label: 'UP', color: '#2ECC71' },
        { pos: [0.08, 0.15, 0.34], label: 'DOWN', color: '#E74C3C' },
        { pos: [0.25, 0.15, 0.34], label: 'ENTER', color: '#3498DB' }
      ].map((btn, i) => (
        <group key={`function-btn-${i}`}>
          {/* Button Housing */}
          <mesh position={btn.pos} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.02, 12]} rotation={[Math.PI/2, 0, 0]} />
            <meshLambertMaterial color="#7F8C8D" />
          </mesh>
          {/* Button Cap */}
          <mesh position={[btn.pos[0], btn.pos[1], btn.pos[2] + 0.015]} castShadow>
            <cylinderGeometry args={[0.035, 0.035, 0.01, 12]} rotation={[Math.PI/2, 0, 0]} />
            <meshLambertMaterial color={btn.color} />
          </mesh>
          {/* Button Label Plate */}
          <mesh position={[btn.pos[0], btn.pos[1] - 0.08, btn.pos[2]]} castShadow>
            <boxGeometry args={[0.12, 0.02, 0.002]} />
            <meshLambertMaterial color="#FFFFFF" />
          </mesh>
        </group>
      ))}
      
      {/* Status LED Array - Industrial Grade */}
      {[
        { pos: [-0.35, -0.1, 0.34], color: '#E74C3C', active: highAlarm, label: 'HIGH ALARM' },
        { pos: [-0.12, -0.1, 0.34], color: '#3498DB', active: lowAlarm, label: 'LOW ALARM' },
        { pos: [0.12, -0.1, 0.34], color: '#FF6B35', active: shutdown, label: 'SHUTDOWN' },
        { pos: [0.35, -0.1, 0.34], color: '#2ECC71', active: communicationActive, label: 'COMM OK' }
      ].map((led, i) => (
        <group key={`status-led-${i}`}>
          {/* LED Housing */}
          <mesh position={led.pos} castShadow>
            <cylinderGeometry args={[0.025, 0.025, 0.015, 12]} rotation={[Math.PI/2, 0, 0]} />
            <meshLambertMaterial color="#2C3E50" />
          </mesh>
          {/* LED Lens */}
          <mesh position={[led.pos[0], led.pos[1], led.pos[2] + 0.01]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.008, 12]} rotation={[Math.PI/2, 0, 0]} />
            <meshLambertMaterial 
              color={led.color} 
              emissive={led.active ? led.color : '#000000'}
              emissiveIntensity={led.active ? 0.8 : 0}
              transparent
              opacity={led.active ? 1.0 : 0.3}
            />
          </mesh>
          {/* LED Label */}
          <mesh position={[led.pos[0], led.pos[1] - 0.08, led.pos[2]]} castShadow>
            <boxGeometry args={[0.14, 0.015, 0.002]} />
            <meshLambertMaterial color="#F8F9FA" />
          </mesh>
        </group>
      ))}
      
      {/* ===========================================
          PROFESSIONAL TEMPERATURE PROBE ASSEMBLY
          =========================================== */}
      
      {/* Probe Connection Head - Industrial Grade */}
      <mesh position={[0, -1.4, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.25, 16]} />
        <meshLambertMaterial color="#95A5A6" />
      </mesh>
      
      {/* Connection Head Cover */}
      <mesh position={[0, -1.28, 0]} castShadow>
        <cylinderGeometry args={[0.125, 0.125, 0.04, 16]} />
        <meshLambertMaterial color="#BDC3C7" />
      </mesh>
      
      {/* Cover Screws */}
      {[0, 1, 2, 3].map((i) => (
        <mesh 
          key={`cover-screw-${i}`} 
          position={[
            Math.cos(i * Math.PI / 2) * 0.1,
            -1.26,
            Math.sin(i * Math.PI / 2) * 0.1
          ]} 
          castShadow
        >
          <cylinderGeometry args={[0.01, 0.01, 0.01, 6]} />
          <meshLambertMaterial color="#2C3E50" />
        </mesh>
      ))}
      
      {/* Thermowell - Stainless Steel */}
      <mesh position={[0, -1.8, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.5, 16]} />
        <meshLambertMaterial color="#D5DBDB" />
      </mesh>
      
      {/* Thermowell Flange */}
      <mesh position={[0, -1.55, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.06, 16]} />
        <meshLambertMaterial color="#BDC3C7" />
      </mesh>
      
      {/* Thermowell Bolt Circle */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh 
          key={`tw-bolt-${i}`} 
          position={[
            Math.cos(i * Math.PI / 3) * 0.08,
            -1.55,
            Math.sin(i * Math.PI / 3) * 0.08
          ]} 
          castShadow
        >
          <cylinderGeometry args={[0.008, 0.008, 0.08, 6]} />
          <meshLambertMaterial color="#34495E" />
        </mesh>
      ))}
      
      {/* RTD Element Housing */}
      <mesh position={[0, -1.9, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.3, 12]} />
        <meshLambertMaterial color="#E8E8E8" />
      </mesh>
      
      {/* Probe Tip */}
      <mesh position={[0, -2.1, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.02, 0.1, 12]} />
        <meshLambertMaterial color="#D5DBDB" />
      </mesh>
      
      {/* ===========================================
          ELECTRICAL CONNECTIONS & CONDUIT
          =========================================== */}
      
      {/* Main Terminal Compartment */}
      <mesh position={[0.65, -1.5, 0]} castShadow>
        <boxGeometry args={[0.5, 0.8, 0.4]} />
        <meshLambertMaterial color="#7F8C8D" />
      </mesh>
      
      {/* Terminal Cover Plate */}
      <mesh position={[0.9, -1.5, 0]} castShadow>
        <boxGeometry args={[0.04, 0.75, 0.35]} />
        <meshLambertMaterial color="#95A5A6" />
      </mesh>
      
      {/* Terminal Cover Screws */}
      {[
        [0.91, -1.25, -0.12], [0.91, -1.25, 0.12],
        [0.91, -1.75, -0.12], [0.91, -1.75, 0.12]
      ].map((pos, i) => (
        <mesh key={`term-cover-screw-${i}`} position={pos} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.01, 6]} rotation={[0, 0, Math.PI/2]} />
          <meshLambertMaterial color="#2C3E50" />
        </mesh>
      ))}
      
      {/* Conduit Entries - Professional Grade */}
      {[
        { pos: [0.65, -1.9, 0.2], size: 0.04, label: 'POWER' },
        { pos: [0.65, -1.9, -0.2], size: 0.03, label: 'SIGNAL' },
        { pos: [0.65, -1.1, 0], size: 0.035, label: 'COMM' }
      ].map((conduit, i) => (
        <group key={`conduit-${i}`}>
          {/* Conduit Hub */}
          <mesh position={conduit.pos} castShadow>
            <cylinderGeometry args={[conduit.size + 0.01, conduit.size + 0.01, 0.08, 12]} rotation={[Math.PI/2, 0, 0]} />
            <meshLambertMaterial color="#34495E" />
          </mesh>
          {/* Conduit Pipe */}
          <mesh position={[conduit.pos[0], conduit.pos[1] - 0.15, conduit.pos[2]]} castShadow>
            <cylinderGeometry args={[conduit.size, conduit.size, 0.2, 12]} rotation={[Math.PI/2, 0, 0]} />
            <meshLambertMaterial color="#7F8C8D" />
          </mesh>
        </group>
      ))}
      
      {/* Cable Glands - Professional Grade */}
      {[
        [0.4, -1.5, 0.15], [0.4, -1.5, -0.15], [0.4, -1.2, 0]
      ].map((pos, i) => (
        <mesh key={`gland-${i}`} position={pos} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.12, 12]} rotation={[0, 0, Math.PI/2]} />
          <meshLambertMaterial color="#2C3E50" />
        </mesh>
      ))}
      
      {/* ===========================================
          PROFESSIONAL NAMEPLATE & LABELING
          =========================================== */}
      
      {/* Main Nameplate */}
      <mesh position={[0, -0.4, 0.34]} castShadow>
        <boxGeometry args={[0.6, 0.15, 0.004]} />
        <meshLambertMaterial color="#F1C40F" />
      </mesh>
      
      {/* Model Number Plate */}
      <mesh position={[0, -0.6, 0.34]} castShadow>
        <boxGeometry args={[0.45, 0.06, 0.002]} />
        <meshLambertMaterial color="#FFFFFF" />
      </mesh>
      
      {/* Serial Number */}
      <mesh position={[0, -0.7, 0.34]} castShadow>
        <boxGeometry args={[0.35, 0.04, 0.002]} />
        <meshLambertMaterial color="#ECF0F1" />
      </mesh>
      
      {/* Certification Labels */}
      {[
        { pos: [-0.3, -0.8, 0.34], text: 'UL', color: '#E74C3C' },
        { pos: [-0.15, -0.8, 0.34], text: 'CSA', color: '#3498DB' },
        { pos: [0, -0.8, 0.34], text: 'ATEX', color: '#F39C12' },
        { pos: [0.15, -0.8, 0.34], text: 'IECEx', color: '#2ECC71' },
        { pos: [0.3, -0.8, 0.34], text: 'SIL2', color: '#9B59B6' }
      ].map((cert, i) => (
        <mesh key={`cert-${i}`} position={cert.pos} castShadow>
          <boxGeometry args={[0.08, 0.03, 0.001]} />
          <meshLambertMaterial color={cert.color} />
        </mesh>
      ))}
      
      {/* ===========================================
          CONNECTION PORTS - INDUSTRIAL TERMINAL BLOCKS
          =========================================== */}
      {connectionPorts.map((port) => {
        const isHovered = hoveredPort === port.id;
        const scale = isHovered ? 1.15 : 1;
        
        return (
          <group key={port.id} position={port.offset}>
            {/* Terminal Block Base */}
            <mesh
              scale={[scale, scale, scale]}
              onClick={(e) => handlePortClick(port, e)}
              onPointerEnter={() => handlePortHover(port.id)}
              onPointerLeave={handlePortLeave}
              castShadow
            >
              <boxGeometry args={[0.12, 0.12, 0.18]} />
              <meshLambertMaterial 
                color="#34495E" 
                emissive={isHovered ? getPortColor(port) : '#000000'}
                emissiveIntensity={isHovered ? 0.3 : 0}
              />
            </mesh>
            
            {/* Terminal Screw */}
            <mesh
              scale={[scale, scale, scale]}
              onClick={(e) => handlePortClick(port, e)}
              onPointerEnter={() => handlePortHover(port.id)}
              onPointerLeave={handlePortLeave}
              castShadow
            >
              <cylinderGeometry args={[0.02, 0.02, 0.08, 8]} />
              <meshLambertMaterial color="#BDC3C7" />
            </mesh>
            
            {/* Wire Entry */}
            <mesh
              scale={[scale, scale, scale]}
              onClick={(e) => handlePortClick(port, e)}
              onPointerEnter={() => handlePortHover(port.id)}
              onPointerLeave={handlePortLeave}
              castShadow
            >
              <cylinderGeometry args={[0.015, 0.015, 0.06, 8]} />
              <meshLambertMaterial color={getPortColor(port)} />
            </mesh>
            
            {/* Terminal Number Label */}
            <mesh position={[0, 0.1, 0]} scale={[scale, scale, scale]}>
              <boxGeometry args={[0.08, 0.03, 0.002]} />
              <meshLambertMaterial color="#FFFFFF" />
            </mesh>
            
            {/* Port Type Indicator */}
            <mesh position={[0, 0.18, 0]} scale={[scale, scale, scale]}>
              {port.type === 'electric' && <octahedronGeometry args={[0.025]} />}
              {port.type === 'liquid' && <sphereGeometry args={[0.025, 8, 8]} />}
              {port.type === 'gas' && <coneGeometry args={[0.025, 0.04, 6]} />}
              <meshLambertMaterial 
                color={getPortColor(port)}
                emissive={getPortColor(port)}
                emissiveIntensity={0.6}
              />
            </mesh>
            
            {/* Hover Indicator */}
            {isHovered && (
              <mesh position={[0, 0.25, 0]}>
                <sphereGeometry args={[0.03]} />
                <meshBasicMaterial color="#FFEB3B" />
              </mesh>
            )}
          </group>
        );
      })}
      
      {/* ===========================================
          ALARM BEACONS & STATUS INDICATORS
          =========================================== */}
      
      {/* High Temperature Alarm Stack Light */}
      {highAlarm && (
        <group position={[0, 1.5, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.15, 16]} />
            <meshLambertMaterial 
              color="#E74C3C" 
              emissive="#E74C3C" 
              emissiveIntensity={0.8}
            />
          </mesh>
          <mesh position={[0, 0.1, 0]} castShadow>
            <sphereGeometry args={[0.08, 12, 8]} />
            <meshLambertMaterial 
              color="#FF6B6B" 
              emissive="#FF6B6B" 
              emissiveIntensity={1.0}
              transparent
              opacity={0.8}
            />
          </mesh>
        </group>
      )}
      
      {/* Low Temperature Alarm Stack Light */}
      {lowAlarm && (
        <group position={[0.25, 1.5, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.15, 16]} />
            <meshLambertMaterial 
              color="#3498DB" 
              emissive="#3498DB" 
              emissiveIntensity={0.8}
            />
          </mesh>
          <mesh position={[0, 0.1, 0]} castShadow>
            <sphereGeometry args={[0.08, 12, 8]} />
            <meshLambertMaterial 
              color="#74B9FF" 
              emissive="#74B9FF" 
              emissiveIntensity={1.0}
              transparent
              opacity={0.8}
            />
          </mesh>
        </group>
      )}
      
      {/* Shutdown Alarm Stack Light */}
      {shutdown && (
        <group position={[-0.25, 1.5, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.1, 0.1, 0.18, 16]} />
            <meshLambertMaterial 
              color="#FF6B35" 
              emissive="#FF6B35" 
              emissiveIntensity={1.0}
            />
          </mesh>
          <mesh position={[0, 0.12, 0]} castShadow>
            <sphereGeometry args={[0.1, 12, 8]} />
            <meshLambertMaterial 
              color="#FF8C42" 
              emissive="#FF8C42" 
              emissiveIntensity={1.2}
              transparent
              opacity={0.9}
            />
          </mesh>
        </group>
      )}
      
      {/* ===========================================
          SELECTION & INTERACTION INDICATORS
          =========================================== */}
      {isSelected && isDraggable && (
        <>
          {/* Selection Beacon */}
          <mesh position={[0, 2.0, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.4, 8]} />
            <meshLambertMaterial color="#FFEB3B" emissive="#FFEB3B" emissiveIntensity={0.4} />
          </mesh>
          
          {/* Grid Position Ring */}
          <mesh position={[0, -3.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.0, 1.3, 32]} />
            <meshBasicMaterial color="#3498DB" transparent opacity={0.6} />
          </mesh>
        </>
      )}
      
      {/* Port Connection Highlights */}
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
    </group>
  );
};

// Export with comprehensive industrial connection port definitions
TemperatureSwitch.connectionPorts = [
  {
    id: 'power_main_120vac',
    type: 'electric',
    label: '120VAC Power',
    offset: [0, -2.8, -1.2],
    direction: [0, -1, 0],
    required: true
  },
  {
    id: 'power_control_24vdc',
    type: 'electric',
    label: '24VDC Control',
    offset: [0.5, -2.8, -1.2],
    direction: [0, -1, 0],
    required: true
  },
  {
    id: 'rtd_input_pt100',
    type: 'electric',
    label: 'RTD PT100 Input',
    offset: [0, -3.2, 0],
    direction: [0, -1, 0],
    required: true
  },
  {
    id: 'alarm_relay_1_no',
    type: 'electric',
    label: 'Alarm 1 N.O.',
    offset: [1.2, -1.5, 0.8],
    direction: [1, 0, 0],
    required: false
  },
  {
    id: 'alarm_relay_2_nc',
    type: 'electric',
    label: 'Alarm 2 N.C.',
    offset: [1.2, -1.8, 0.8],
    direction: [1, 0, 0],
    required: false
  },
  {
    id: 'shutdown_relay_no',
    type: 'electric',
    label: 'Shutdown N.O.',
    offset: [1.2, -2.1, 0.8],
    direction: [1, 0, 0],
    required: false
  },
  {
    id: 'analog_output_4_20ma',
    type: 'electric',
    label: '4-20mA Output',
    offset: [1.2, -1.2, 0.8],
    direction: [1, 0, 0],
    required: false
  },
  {
    id: 'modbus_rs485',
    type: 'electric',
    label: 'Modbus RS485',
    offset: [1.2, -0.9, 0.8],
    direction: [1, 0, 0],
    required: false
  },
  {
    id: 'ethernet_tcp_ip',
    type: 'electric',
    label: 'Ethernet TCP/IP',
    offset: [1.2, -0.6, 0.8],
    direction: [1, 0, 0],
    required: false
  }
];

export default TemperatureSwitch; 