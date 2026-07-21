import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const OilTankControlPanel = ({ position, onClick, onDrag, isSelected, isDraggable, gridSnap, gridSize, onPortClick }) => {
  const meshRef = useRef();
  const groupRef = useRef();
  const pumpRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [hoveredPort, setHoveredPort] = useState(null);
  const [isRunning] = useState(false);
  const { camera, gl } = useThree();

  // Define connection ports for the oil tank control panel
  const connectionPorts = [
    {
      id: 'electric_power_main',
      type: 'electric',
      label: 'Main Power 480V',
      offset: [0, -4.2, -3.2],
      direction: [0, -1, 0],
      required: true
    },
    {
      id: 'electric_control',
      type: 'electric',
      label: 'Control Power 120V',
      offset: [1, -4.2, -3.2],
      direction: [0, -1, 0],
      required: true
    },
    {
      id: 'oil_inlet_main',
      type: 'liquid',
      label: 'Main Oil Inlet',
      offset: [-3.2, 0, 3.2],
      direction: [-1, 0, 0],
      required: true
    },
    {
      id: 'oil_outlet_main',
      type: 'liquid',
      label: 'Main Oil Outlet',
      offset: [3.2, -1, 3.2],
      direction: [1, 0, 0],
      required: true
    },
    {
      id: 'oil_recirculation',
      type: 'liquid',
      label: 'Recirculation Line',
      offset: [-3.2, -2, -3.2],
      direction: [-1, 0, 0],
      required: false
    },
    {
      id: 'drain_line',
      type: 'liquid',
      label: 'Emergency Drain',
      offset: [0, -4.5, 0],
      direction: [0, -1, 0],
      required: false
    },
    {
      id: 'vent_nitrogen',
      type: 'gas',
      label: 'Nitrogen Blanket',
      offset: [0, 4.5, 0],
      direction: [0, 1, 0],
      required: false
    },
    {
      id: 'safety_relief',
      type: 'gas',
      label: 'Pressure Relief',
      offset: [1.5, 4.2, 0],
      direction: [0, 1, 0],
      required: true
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
    
    // Animate pump rotation when running
    if (pumpRef.current && isRunning) {
      pumpRef.current.rotation.y += 0.15;
    }
    
    // Scale slightly when dragging
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
        <mesh position={[0, -5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[3, 3.5, 16]} />
          <meshBasicMaterial color="#ffeb3b" transparent opacity={0.3} />
        </mesh>
      )}
      
      {/* Invisible collision box */}
      <mesh onPointerDown={handlePointerDown} visible={false}>
        <boxGeometry args={[8, 10, 8]} />
      </mesh>
      
      {/* ===========================================
          MAIN OIL STORAGE TANK
          =========================================== */}
      
      {/* Main Tank Body - Professional Industrial Design */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <cylinderGeometry args={[3.0, 3.0, 7, 48]} />
        <meshLambertMaterial color="#34495E" />
      </mesh>
      
      {/* Tank Top Dome */}
      <mesh position={[0, 3.7, 0]} castShadow>
        <sphereGeometry args={[3.0, 24, 12]} />
        <meshLambertMaterial color="#2C3E50" />
      </mesh>
      
      {/* Tank Bottom Dome */}
      <mesh position={[0, -3.7, 0]} castShadow>
        <sphereGeometry args={[3.0, 24, 12]} />
        <meshLambertMaterial color="#2C3E50" />
      </mesh>
      
      {/* Tank Reinforcement Bands */}
      {[-2.5, -1.5, -0.5, 0.5, 1.5, 2.5].map((y, i) => (
        <mesh key={`band-${i}`} position={[0, y, 0]} castShadow>
          <torusGeometry args={[3.05, 0.08, 8, 32]} />
          <meshLambertMaterial color="#1A252F" />
        </mesh>
      ))}
      
      {/* Oil Level Sight Glass - Professional Grade */}
      <mesh position={[3.1, 0, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 5, 16]} />
        <meshLambertMaterial color="#BDC3C7" />
      </mesh>
      
      {/* Level Glass Protection */}
      <mesh position={[3.15, 0, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 5.2, 16]} />
        <meshLambertMaterial color="#2C3E50" transparent opacity={0.3} />
      </mesh>
      
      {/* Oil Level (85% full) */}
      <mesh position={[3.12, -0.8, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 3.4, 16]} />
        <meshLambertMaterial color="#8B4513" />
      </mesh>
      
      {/* Level Indicator Scale */}
      {[-2, -1, 0, 1, 2].map((y, i) => (
        <mesh key={`scale-${i}`} position={[3.3, y, 0]} castShadow>
          <boxGeometry args={[0.1, 0.02, 0.02]} />
          <meshLambertMaterial color="#E74C3C" />
        </mesh>
      ))}
      
      {/* ===========================================
          PROFESSIONAL CONTROL PANEL CABINET
          =========================================== */}
      
      {/* Main Control Cabinet - NEMA 4X Rated */}
      <mesh position={[4.5, 0.5, 0]} castShadow>
        <boxGeometry args={[1.2, 4.5, 1.0]} />
        <meshLambertMaterial color="#95A5A6" />
      </mesh>
      
      {/* Cabinet Door */}
      <mesh position={[5.15, 0.5, 0]} castShadow>
        <boxGeometry args={[0.1, 4.3, 0.9]} />
        <meshLambertMaterial color="#BDC3C7" />
      </mesh>
      
      {/* Door Handle - Industrial Grade */}
      <mesh position={[5.2, 0.5, -0.3]} castShadow>
        <boxGeometry args={[0.05, 0.3, 0.08]} />
        <meshLambertMaterial color="#2C3E50" />
      </mesh>
      
      {/* Door Lock */}
      <mesh position={[5.2, 0.5, 0.3]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.06, 8]} rotation={[0, 0, Math.PI/2]} />
        <meshLambertMaterial color="#34495E" />
      </mesh>
      
      {/* HMI Touchscreen Display - 15" Industrial */}
      <mesh position={[5.18, 1.8, 0]} castShadow>
        <boxGeometry args={[0.02, 0.8, 0.6]} />
        <meshLambertMaterial color="#000000" />
      </mesh>
      
      {/* HMI Screen Content */}
      <mesh position={[5.19, 1.8, 0]} castShadow>
        <boxGeometry args={[0.01, 0.75, 0.55]} />
        <meshLambertMaterial color={isRunning ? "#00FF41" : "#FF4444"} />
      </mesh>
      
      {/* HMI Frame */}
      <mesh position={[5.17, 1.8, 0]} castShadow>
        <boxGeometry args={[0.04, 0.85, 0.65]} />
        <meshLambertMaterial color="#2C3E50" />
      </mesh>
      
      {/* Emergency Stop - Mushroom Style */}
      <mesh position={[5.18, 0.7, -0.3]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.06, 12]} rotation={[0, 0, Math.PI/2]} />
        <meshLambertMaterial color="#E74C3C" />
      </mesh>
      
      {/* E-Stop Base */}
      <mesh position={[5.16, 0.7, -0.3]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.04, 12]} rotation={[0, 0, Math.PI/2]} />
        <meshLambertMaterial color="#2C3E50" />
      </mesh>
      
      {/* Selector Switches */}
      {[
        { pos: [5.18, 0.3, -0.15], color: '#3498DB' }, // AUTO/MAN
        { pos: [5.18, 0.3, 0.15], color: '#2ECC71' },  // START/STOP
        { pos: [5.18, 0.1, -0.15], color: '#F39C12' }, // LOCAL/REMOTE
      ].map((sw, i) => (
        <group key={`selector-${i}`}>
          <mesh position={sw.pos} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.03, 8]} rotation={[0, 0, Math.PI/2]} />
            <meshLambertMaterial color={sw.color} />
          </mesh>
          <mesh position={[sw.pos[0] - 0.02, sw.pos[1], sw.pos[2]]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 0.02, 8]} rotation={[0, 0, Math.PI/2]} />
            <meshLambertMaterial color="#2C3E50" />
          </mesh>
        </group>
      ))}
      
      {/* Push Buttons - Industrial Grade */}
      {[
        { pos: [5.18, -0.2, -0.25], color: '#E74C3C' }, // ALARM ACK
        { pos: [5.18, -0.2, -0.1], color: '#F39C12' },  // RESET
        { pos: [5.18, -0.2, 0.1], color: '#2ECC71' },   // START
        { pos: [5.18, -0.2, 0.25], color: '#95A5A6' },  // STOP
      ].map((btn, i) => (
        <group key={`button-${i}`}>
          <mesh position={btn.pos} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.02, 8]} rotation={[0, 0, Math.PI/2]} />
            <meshLambertMaterial color={btn.color} />
          </mesh>
          <mesh position={[btn.pos[0] - 0.015, btn.pos[1], btn.pos[2]]} castShadow>
            <cylinderGeometry args={[0.035, 0.035, 0.015, 8]} rotation={[0, 0, Math.PI/2]} />
            <meshLambertMaterial color="#2C3E50" />
          </mesh>
        </group>
      ))}
      
      {/* Status Indicator Lights */}
      {[
        { pos: [5.18, -0.5, -0.25], color: '#E74C3C', active: !isRunning }, // FAULT
        { pos: [5.18, -0.5, -0.1], color: '#F39C12', active: false },       // WARNING
        { pos: [5.18, -0.5, 0.1], color: '#2ECC71', active: isRunning },   // RUNNING
        { pos: [5.18, -0.5, 0.25], color: '#3498DB', active: true },       // POWER
      ].map((led, i) => (
        <mesh key={`led-${i}`} position={led.pos} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.01, 8]} rotation={[0, 0, Math.PI/2]} />
          <meshLambertMaterial 
            color={led.color} 
            emissive={led.active ? led.color : '#000000'}
            emissiveIntensity={led.active ? 0.8 : 0}
          />
        </mesh>
      ))}
      
      {/* Analog Gauges - Professional Style */}
      {[
        { pos: [5.17, -1.0, -0.2], label: 'PRESSURE' },
        { pos: [5.17, -1.0, 0.2], label: 'TEMPERATURE' },
        { pos: [5.17, -1.4, -0.2], label: 'FLOW' },
        { pos: [5.17, -1.4, 0.2], label: 'LEVEL' },
      ].map((gauge, i) => (
        <group key={`gauge-${i}`}>
          {/* Gauge Face */}
          <mesh position={gauge.pos} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.02, 16]} rotation={[0, 0, Math.PI/2]} />
            <meshLambertMaterial color="#F8F9FA" />
          </mesh>
          {/* Gauge Rim */}
          <mesh position={[gauge.pos[0] - 0.01, gauge.pos[1], gauge.pos[2]]} castShadow>
            <cylinderGeometry args={[0.09, 0.09, 0.015, 16]} rotation={[0, 0, Math.PI/2]} />
            <meshLambertMaterial color="#2C3E50" />
          </mesh>
          {/* Needle */}
          <mesh position={[gauge.pos[0] + 0.005, gauge.pos[1], gauge.pos[2]]} castShadow>
            <boxGeometry args={[0.005, 0.06, 0.002]} />
            <meshLambertMaterial color="#E74C3C" />
          </mesh>
        </group>
      ))}
      
      {/* Nameplate */}
      <mesh position={[5.17, -1.8, 0]} castShadow>
        <boxGeometry args={[0.02, 0.15, 0.4]} />
        <meshLambertMaterial color="#F1C40F" />
      </mesh>
      
      {/* Ventilation Louvers */}
      {[-0.6, 0.6].map((z, i) => (
        <mesh key={`louver-${i}`} position={[5.1, -2.0, z]} castShadow>
          <boxGeometry args={[0.05, 0.3, 0.2]} />
          <meshLambertMaterial color="#7F8C8D" />
        </mesh>
      ))}
      
      {/* ===========================================
          PROCESS EQUIPMENT & PIPING
          =========================================== */}
      
      {/* Main Process Pump */}
      <group ref={pumpRef} position={[-4, -3, 2.5]}>
        {/* Pump Casing */}
        <mesh castShadow>
          <boxGeometry args={[1.5, 1.2, 1.2]} />
          <meshLambertMaterial color="#E74C3C" />
        </mesh>
        {/* Motor */}
        <mesh position={[0, 0.8, 0]} castShadow>
          <cylinderGeometry args={[0.5, 0.5, 1.2, 16]} />
          <meshLambertMaterial color="#2C3E50" />
        </mesh>
        {/* Motor Fan */}
        <mesh position={[0, 1.4, 0]} castShadow>
          <cylinderGeometry args={[0.6, 0.6, 0.1, 8]} />
          <meshLambertMaterial color="#34495E" />
        </mesh>
        {/* Coupling Guard */}
        <mesh position={[0, 0.4, 0]} castShadow>
          <cylinderGeometry args={[0.4, 0.4, 0.3, 12]} />
          <meshLambertMaterial color="#95A5A6" transparent opacity={0.7} />
        </mesh>
      </group>
      
      {/* Filtration Skid */}
      <group position={[-4, 1, -3]}>
        {/* Filter Vessel */}
        <mesh castShadow>
          <cylinderGeometry args={[0.8, 0.8, 2.5, 16]} />
          <meshLambertMaterial color="#7F8C8D" />
        </mesh>
        {/* Filter Head */}
        <mesh position={[0, 1.4, 0]} castShadow>
          <cylinderGeometry args={[0.85, 0.85, 0.3, 16]} />
          <meshLambertMaterial color="#34495E" />
        </mesh>
      </group>
      
      {/* Heat Exchanger */}
      <group position={[0, -3.5, -3]}>
        {/* Shell */}
        <mesh rotation={[0, 0, Math.PI/2]} castShadow>
          <cylinderGeometry args={[0.6, 0.6, 3, 16]} />
          <meshLambertMaterial color="#BDC3C7" />
        </mesh>
        {/* Tube Bundle Access */}
        <mesh position={[1.6, 0, 0]} castShadow>
          <cylinderGeometry args={[0.65, 0.65, 0.2, 16]} />
          <meshLambertMaterial color="#95A5A6" />
        </mesh>
      </group>
      
      {/* Main Piping Network */}
      {/* Inlet Main Line */}
      <mesh position={[-1.5, 0, 3.2]} rotation={[0, Math.PI/2, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 3.5, 12]} />
        <meshLambertMaterial color="#7F8C8D" />
      </mesh>
      
      {/* Outlet Main Line */}
      <mesh position={[1.5, -1, 3.2]} rotation={[0, Math.PI/2, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 3.5, 12]} />
        <meshLambertMaterial color="#7F8C8D" />
      </mesh>
      
      {/* Recirculation Line */}
      <mesh position={[-1.5, -2, -3.2]} rotation={[0, Math.PI/2, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 3.5, 12]} />
        <meshLambertMaterial color="#7F8C8D" />
      </mesh>
      
      {/* Vertical Risers */}
      {[
        { pos: [-3, 1, 3.2], height: 2 },
        { pos: [3, 0, 3.2], height: 2 },
        { pos: [-3, -1, -3.2], height: 2 },
      ].map((pipe, i) => (
        <mesh key={`riser-${i}`} position={pipe.pos} castShadow>
          <cylinderGeometry args={[0.1, 0.1, pipe.height, 12]} />
          <meshLambertMaterial color="#7F8C8D" />
        </mesh>
      ))}
      
      {/* Pipe Supports */}
      {[
        [-1.5, -0.3, 3.2], [1.5, -1.3, 3.2], [-1.5, -2.3, -3.2]
      ].map((pos, i) => (
        <mesh key={`support-${i}`} position={pos} castShadow>
          <boxGeometry args={[0.3, 0.1, 0.3]} />
          <meshLambertMaterial color="#34495E" />
        </mesh>
      ))}
      
      {/* Safety Equipment */}
      {/* Pressure Relief Valve */}
      <mesh position={[1.5, 4.0, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.4, 12]} />
        <meshLambertMaterial color="#E74C3C" />
      </mesh>
      
      {/* PSV Discharge Line */}
      <mesh position={[1.5, 4.5, 0.8]} rotation={[Math.PI/2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 1.6, 12]} />
        <meshLambertMaterial color="#7F8C8D" />
      </mesh>
      
      {/* Temperature Probes */}
      {[
        [0, 2, 3.1], [0, -2, 3.1], [2.5, 0, 0]
      ].map((pos, i) => (
        <mesh key={`temp-probe-${i}`} position={pos} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
          <meshLambertMaterial color="#F39C12" />
        </mesh>
      ))}
      
      {/* Structural Support Framework */}
      {[
        [3, -4.5, 3], [-3, -4.5, 3], [3, -4.5, -3], [-3, -4.5, -3]
      ].map((pos, i) => (
        <mesh key={`leg-${i}`} position={pos} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 1.5, 8]} />
          <meshLambertMaterial color="#2C3E50" />
        </mesh>
      ))}
      
      {/* Base Platform */}
      <mesh position={[0, -5, 0]} castShadow>
        <cylinderGeometry args={[4.5, 4.5, 0.3, 32]} />
        <meshLambertMaterial color="#34495E" />
      </mesh>
      
      {/* Platform Grating */}
      <mesh position={[0, -4.8, 0]} castShadow>
        <cylinderGeometry args={[4.4, 4.4, 0.1, 32]} />
        <meshLambertMaterial color="#7F8C8D" transparent opacity={0.8} />
      </mesh>
      
      {/* ===========================================
          CONNECTION PORTS - INDUSTRIAL GRADE
          =========================================== */}
      {connectionPorts.map((port) => {
        const isHovered = hoveredPort === port.id;
        const scale = isHovered ? 1.15 : 1;
        
        return (
          <group key={port.id} position={port.offset}>
            {/* Flange Assembly */}
            <mesh
              scale={[scale, scale, scale]}
              onClick={(e) => handlePortClick(port, e)}
              onPointerEnter={() => handlePortHover(port.id)}
              onPointerLeave={handlePortLeave}
              castShadow
            >
              <cylinderGeometry args={[0.25, 0.25, 0.15, 12]} />
              <meshLambertMaterial 
                color="#BDC3C7" 
                emissive={isHovered ? getPortColor(port) : '#000000'}
                emissiveIntensity={isHovered ? 0.3 : 0}
              />
            </mesh>
            
            {/* Pipe Stub */}
            <mesh
              scale={[scale, scale, scale]}
              onClick={(e) => handlePortClick(port, e)}
              onPointerEnter={() => handlePortHover(port.id)}
              onPointerLeave={handlePortLeave}
              castShadow
            >
              <cylinderGeometry args={[0.15, 0.15, 0.5, 12]} />
              <meshLambertMaterial color="#7F8C8D" />
            </mesh>
            
            {/* Bolt Circle */}
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <mesh 
                key={i} 
                position={[
                  Math.cos(i * Math.PI / 4) * 0.2 * scale,
                  0,
                  Math.sin(i * Math.PI / 4) * 0.2 * scale
                ]} 
                castShadow
              >
                <cylinderGeometry args={[0.02, 0.02, 0.18, 6]} />
                <meshLambertMaterial color="#2C3E50" />
              </mesh>
            ))}
            
            {/* Port Type Color Coding */}
            <mesh position={[0, 0.4, 0]} scale={[scale, scale, scale]}>
              {port.type === 'electric' && <octahedronGeometry args={[0.12]} />}
              {port.type === 'liquid' && <sphereGeometry args={[0.12, 12, 12]} />}
              {port.type === 'gas' && <coneGeometry args={[0.12, 0.2, 8]} />}
              <meshLambertMaterial 
                color={getPortColor(port)}
                emissive={getPortColor(port)}
                emissiveIntensity={0.6}
              />
            </mesh>
            
            {/* Flow Direction Arrow */}
            <mesh 
              position={[
                port.direction[0] * 0.6,
                port.direction[1] * 0.6,
                port.direction[2] * 0.6
              ]}
              rotation={[
                port.direction[0] !== 0 ? Math.PI / 2 : 0,
                port.direction[2] !== 0 ? Math.PI / 2 : 0,
                0
              ]}
            >
              <coneGeometry args={[0.08, 0.3, 6]} />
              <meshBasicMaterial color={getPortColor(port)} transparent opacity={0.8} />
            </mesh>
            
            {/* Port Label Indicator */}
            {isHovered && (
              <mesh position={[0, 0.8, 0]}>
                <sphereGeometry args={[0.05]} />
                <meshBasicMaterial color="#FFEB3B" />
              </mesh>
            )}
          </group>
        );
      })}
      
      {/* ===========================================
          SELECTION & STATUS INDICATORS
          =========================================== */}
      {isSelected && isDraggable && (
        <>
          {/* Selection Indicator */}
          <mesh position={[0, 5.5, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.4, 8]} />
            <meshLambertMaterial color="#FFEB3B" emissive="#FFEB3B" emissiveIntensity={0.4} />
          </mesh>
          
          {/* Grid Position Indicator */}
          <mesh position={[0, -5.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[4, 4.5, 32]} />
            <meshBasicMaterial color="#3498DB" transparent opacity={0.6} />
          </mesh>
        </>
      )}
      
      {/* Port Highlights when Selected */}
      {isSelected && (
        <>
          {connectionPorts.map((port) => (
            <mesh 
              key={`port-highlight-${port.id}`}
              position={port.offset}
            >
              <ringGeometry args={[0.3, 0.35, 16]} />
              <meshBasicMaterial 
                color={getPortColor(port)} 
                transparent 
                opacity={0.7}
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
OilTankControlPanel.connectionPorts = [
  {
    id: 'electric_power_main',
    type: 'electric',
    label: 'Main Power 480V',
    offset: [0, -4.2, -3.2],
    direction: [0, -1, 0],
    required: true
  },
  {
    id: 'electric_control',
    type: 'electric',
    label: 'Control Power 120V',
    offset: [1, -4.2, -3.2],
    direction: [0, -1, 0],
    required: true
  },
  {
    id: 'oil_inlet_main',
    type: 'liquid',
    label: 'Main Oil Inlet',
    offset: [-3.2, 0, 3.2],
    direction: [-1, 0, 0],
    required: true
  },
  {
    id: 'oil_outlet_main',
    type: 'liquid',
    label: 'Main Oil Outlet',
    offset: [3.2, -1, 3.2],
    direction: [1, 0, 0],
    required: true
  },
  {
    id: 'oil_recirculation',
    type: 'liquid',
    label: 'Recirculation Line',
    offset: [-3.2, -2, -3.2],
    direction: [-1, 0, 0],
    required: false
  },
  {
    id: 'drain_line',
    type: 'liquid',
    label: 'Emergency Drain',
    offset: [0, -4.5, 0],
    direction: [0, -1, 0],
    required: false
  },
  {
    id: 'vent_nitrogen',
    type: 'gas',
    label: 'Nitrogen Blanket',
    offset: [0, 4.5, 0],
    direction: [0, 1, 0],
    required: false
  },
  {
    id: 'safety_relief',
    type: 'gas',
    label: 'Pressure Relief',
    offset: [1.5, 4.2, 0],
    direction: [0, 1, 0],
    required: true
  }
];

export default OilTankControlPanel; 