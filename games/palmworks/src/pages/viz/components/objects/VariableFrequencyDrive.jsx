import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const VariableFrequencyDrive = ({ position, onClick, onDrag, isSelected, isDraggable, gridSnap, gridSize, onPortClick }) => {
  const meshRef = useRef();
  const groupRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [hoveredPort, setHoveredPort] = useState(null);
  const [motorRunning, setMotorRunning] = useState(false);
  const [currentFrequency, setCurrentFrequency] = useState(50.0);
  const [targetFrequency, setTargetFrequency] = useState(50.0);
  const [motorCurrent, setMotorCurrent] = useState(0);
  const [motorSpeed, setMotorSpeed] = useState(0);
  const [outputVoltage, setOutputVoltage] = useState(0);
  const [faultCondition, setFaultCondition] = useState(false);
  const [overloadAlarm, setOverloadAlarm] = useState(false);
  const [remoteMode, setRemoteMode] = useState(true);
  const [displayMode, setDisplayMode] = useState(0); // 0: freq, 1: current, 2: voltage, 3: speed
  const { camera, gl } = useThree();

  // Industrial VFD configuration
  const vfdSettings = {
    ratedPower: 22.0, // kW
    ratedCurrent: 42.0, // A
    inputVoltage: 400, // V
    maxFrequency: 80.0, // Hz
    minFrequency: 5.0, // Hz
    ratedSpeed: 1450, // RPM
    protectionClass: 'IP21'
  };

  // Define connection ports for comprehensive VFD I/O
  const connectionPorts = [
    {
      id: 'power_input_l1',
      type: 'electric',
      label: 'L1 Power Input (400V)',
      offset: [-1.0, 2.5, 1.0],
      direction: [0, 0, 1],
      required: true
    },
    {
      id: 'power_input_l2',
      type: 'electric',
      label: 'L2 Power Input (400V)',
      offset: [-0.6, 2.5, 1.0],
      direction: [0, 0, 1],
      required: true
    },
    {
      id: 'power_input_l3',
      type: 'electric',
      label: 'L3 Power Input (400V)',
      offset: [-0.2, 2.5, 1.0],
      direction: [0, 0, 1],
      required: true
    },
    {
      id: 'motor_output_u',
      type: 'electric',
      label: 'Motor U Phase Output',
      offset: [0.2, 2.5, 1.0],
      direction: [0, 0, 1],
      required: true
    },
    {
      id: 'motor_output_v',
      type: 'electric',
      label: 'Motor V Phase Output',
      offset: [0.6, 2.5, 1.0],
      direction: [0, 0, 1],
      required: true
    },
    {
      id: 'motor_output_w',
      type: 'electric',
      label: 'Motor W Phase Output',
      offset: [1.0, 2.5, 1.0],
      direction: [0, 0, 1],
      required: true
    },
    {
      id: 'analog_input_4_20ma',
      type: 'electric',
      label: 'Speed Reference (4-20mA)',
      offset: [-1.2, 2.0, 1.0],
      direction: [0, 0, 1],
      required: false
    },
    {
      id: 'digital_input_run',
      type: 'electric',
      label: 'Run Command (24VDC)',
      offset: [-0.8, 2.0, 1.0],
      direction: [0, 0, 1],
      required: false
    },
    {
      id: 'digital_input_stop',
      type: 'electric',
      label: 'Stop Command (24VDC)',
      offset: [-0.4, 2.0, 1.0],
      direction: [0, 0, 1],
      required: false
    },
    {
      id: 'relay_output_run',
      type: 'electric',
      label: 'Run Status Relay',
      offset: [0.4, 2.0, 1.0],
      direction: [0, 0, 1],
      required: false
    },
    {
      id: 'relay_output_fault',
      type: 'electric',
      label: 'Fault Alarm Relay',
      offset: [0.8, 2.0, 1.0],
      direction: [0, 0, 1],
      required: false
    },
    {
      id: 'communication_rs485',
      type: 'electric',
      label: 'RS485 Communication',
      offset: [1.2, 2.0, 1.0],
      direction: [0, 0, 1],
      required: false
    }
  ];

  const snapToGrid = (value) => {
    if (!gridSnap) return value;
    return Math.round(value / gridSize) * gridSize;
  };

  // Simulate realistic VFD operation with frequency control
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (motorRunning) {
        // Frequency ramping simulation
        setCurrentFrequency(prev => {
          const rampRate = 2.0; // Hz per second
          const diff = targetFrequency - prev;
          const maxChange = rampRate * 0.2; // 200ms interval
          
          if (Math.abs(diff) < maxChange) {
            return targetFrequency;
          }
          return prev + Math.sign(diff) * maxChange;
        });
        
        // Motor parameters based on frequency
        setMotorCurrent(prev => {
          const expectedCurrent = (currentFrequency / 50.0) * vfdSettings.ratedCurrent * 0.85;
          const noise = (Math.random() - 0.5) * 2.0;
          return Math.max(0, expectedCurrent + noise);
        });
        
        setMotorSpeed(prev => {
          const expectedSpeed = (currentFrequency / 50.0) * vfdSettings.ratedSpeed;
          const slip = Math.random() * 20; // Motor slip variation
          return Math.max(0, expectedSpeed - slip);
        });
        
        setOutputVoltage(prev => {
          const expectedVoltage = (currentFrequency / 50.0) * vfdSettings.inputVoltage;
          return Math.max(0, Math.min(vfdSettings.inputVoltage, expectedVoltage));
        });
        
        // Check for overload
        if (motorCurrent > vfdSettings.ratedCurrent * 1.1) {
          setOverloadAlarm(true);
        }
        
      } else {
        setMotorCurrent(0);
        setMotorSpeed(0);
        setOutputVoltage(0);
      }
      
      // Random fault simulation (very rare)
      if (Math.random() < 0.0008) {
        setFaultCondition(true);
        setMotorRunning(false);
      }
      
    }, 200);
    return () => clearInterval(interval);
  }, [motorRunning, targetFrequency, currentFrequency]);

  // Display cycling
  React.useEffect(() => {
    const interval = setInterval(() => {
      setDisplayMode(prev => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useFrame(() => {
    if (meshRef.current) {
      if (isSelected) {
        meshRef.current.material.emissive.setHex(0x001122);
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

  const getDisplayValue = () => {
    switch (displayMode) {
      case 0: return `${currentFrequency.toFixed(1)} Hz`;
      case 1: return `${motorCurrent.toFixed(1)} A`;
      case 2: return `${outputVoltage.toFixed(0)} V`;
      case 3: return `${motorSpeed.toFixed(0)} RPM`;
      default: return '---';
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
        <mesh position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.0, 2.4, 16]} />
          <meshBasicMaterial color="#00E676" transparent opacity={0.4} />
        </mesh>
      )}
      
      {/* Invisible collision box */}
      <mesh onPointerDown={handlePointerDown} visible={false}>
        <boxGeometry args={[4.5, 5.5, 2.5]} />
      </mesh>
      
      {/* ========== MAIN VFD ENCLOSURE ========== */}
      
      {/* Primary Enclosure - Industrial Steel Cabinet */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[2.8, 4.0, 1.2]} />
        <meshPhongMaterial 
          color="#E0E0E0" 
          specular="#FFFFFF" 
          shininess={90}
          metalness={0.1}
        />
      </mesh>
      
      {/* Front Panel */}
      <mesh position={[0, 0, 0.62]} castShadow>
        <boxGeometry args={[2.75, 3.95, 0.04]} />
        <meshPhongMaterial color="#F5F5F5" specular="#FFFFFF" shininess={100} />
      </mesh>
      
      {/* ========== DIGITAL DISPLAY SECTION ========== */}
      
      {/* Display Housing */}
      <mesh position={[0, 1.4, 0.7]} castShadow>
        <boxGeometry args={[2.4, 1.0, 0.15]} />
        <meshPhongMaterial 
          color="#1A1A2E" 
          specular="#333355" 
          shininess={80}
        />
      </mesh>
      
      {/* Main LCD Display */}
      <mesh position={[0, 1.6, 0.78]} castShadow>
        <boxGeometry args={[1.8, 0.5, 0.03]} />
        <meshPhongMaterial color="#0D1117" />
      </mesh>
      
      {/* Display Screen with Values */}
      <mesh position={[0, 1.6, 0.795]} castShadow>
        <boxGeometry args={[1.75, 0.45, 0.01]} />
        <meshBasicMaterial 
          color={
            faultCondition ? "#DC2626" :
            overloadAlarm ? "#F59E0B" :
            motorRunning ? "#00FF7F" : "#4A90E2"
          } 
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Display Content Area */}
      <mesh position={[0, 1.6, 0.8]} castShadow>
        <boxGeometry args={[1.7, 0.4, 0.005]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      {/* Parameter Display Labels */}
      {[
        { pos: [-0.6, 1.3, 0.78], label: 'FREQ' },
        { pos: [-0.2, 1.3, 0.78], label: 'CURR' },
        { pos: [0.2, 1.3, 0.78], label: 'VOLT' },
        { pos: [0.6, 1.3, 0.78], label: 'SPEED' }
      ].map((item, i) => (
        <mesh key={`label-${i}`} position={item.pos} castShadow>
          <boxGeometry args={[0.25, 0.08, 0.01]} />
          <meshBasicMaterial 
            color={displayMode === i ? "#FFFF00" : "#666666"}
          />
        </mesh>
      ))}
      
      {/* Status Indicator LEDs */}
      {[
        { pos: [-1.0, 1.1, 0.78], color: '#10B981', active: motorRunning, label: 'RUN' },
        { pos: [-0.6, 1.1, 0.78], color: '#DC2626', active: faultCondition, label: 'FAULT' },
        { pos: [-0.2, 1.1, 0.78], color: '#F59E0B', active: overloadAlarm, label: 'ALARM' },
        { pos: [0.2, 1.1, 0.78], color: '#3B82F6', active: remoteMode, label: 'REMOTE' },
        { pos: [0.6, 1.1, 0.78], color: '#8B5CF6', active: !remoteMode, label: 'LOCAL' },
        { pos: [1.0, 1.1, 0.78], color: '#06B6D4', active: true, label: 'POWER' }
      ].map((led, i) => (
        <group key={`led-group-${i}`}>
          {/* LED Housing */}
          <mesh position={led.pos} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.03, 12]} rotation={[Math.PI/2, 0, 0]} />
            <meshPhongMaterial color="#2A2A2A" />
          </mesh>
          {/* LED Lens */}
          <mesh position={[led.pos[0], led.pos[1], led.pos[2] + 0.02]} castShadow>
            <cylinderGeometry args={[0.035, 0.035, 0.015, 12]} rotation={[Math.PI/2, 0, 0]} />
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
      
      {/* ========== CONTROL KEYPAD ========== */}
      
      {/* Keypad Housing */}
      <mesh position={[0, 0.3, 0.7]} castShadow>
        <boxGeometry args={[2.2, 1.4, 0.1]} />
        <meshPhongMaterial color="#D0D0D0" specular="#FFFFFF" shininess={70} />
      </mesh>
      
      {/* Navigation and Control Buttons */}
      {[
        // Navigation buttons
        { pos: [-0.8, 0.6, 0.76], color: '#3B82F6', label: 'UP', size: 0.06 },
        { pos: [-0.8, 0.4, 0.76], color: '#3B82F6', label: 'DOWN', size: 0.06 },
        { pos: [-0.6, 0.5, 0.76], color: '#10B981', label: 'ENTER', size: 0.06 },
        { pos: [-0.4, 0.5, 0.76], color: '#F59E0B', label: 'MENU', size: 0.05 },
        
        // Control buttons
        { pos: [0.0, 0.6, 0.76], color: '#10B981', label: 'START', size: 0.08, action: () => {
          if (!faultCondition && !overloadAlarm) {
            setMotorRunning(true);
          }
        }},
        { pos: [0.3, 0.6, 0.76], color: '#DC2626', label: 'STOP', size: 0.08, action: () => {
          setMotorRunning(false);
        }},
        { pos: [0.6, 0.6, 0.76], color: '#F59E0B', label: 'RESET', size: 0.06, action: () => {
          setFaultCondition(false);
          setOverloadAlarm(false);
        }},
        
        // Frequency control
        { pos: [0.0, 0.3, 0.76], color: '#8B5CF6', label: 'FREQ+', size: 0.06, action: () => {
          setTargetFrequency(prev => Math.min(vfdSettings.maxFrequency, prev + 5));
        }},
        { pos: [0.3, 0.3, 0.76], color: '#8B5CF6', label: 'FREQ-', size: 0.06, action: () => {
          setTargetFrequency(prev => Math.max(vfdSettings.minFrequency, prev - 5));
        }},
        { pos: [0.6, 0.3, 0.76], color: '#06B6D4', label: 'JOG', size: 0.05 },
        
        // Mode buttons
        { pos: [0.0, 0.0, 0.76], color: '#6366F1', label: 'AUTO', size: 0.05 },
        { pos: [0.3, 0.0, 0.76], color: '#EC4899', label: 'LOCAL', size: 0.05, action: () => {
          setRemoteMode(false);
        }},
        { pos: [0.6, 0.0, 0.76], color: '#14B8A6', label: 'REMOTE', size: 0.05, action: () => {
          setRemoteMode(true);
        }}
      ].map((button, i) => (
        <group key={`button-group-${i}`}>
          {/* Button Housing */}
          <mesh position={button.pos} castShadow>
            <cylinderGeometry args={[button.size, button.size, 0.04, 16]} rotation={[Math.PI/2, 0, 0]} />
            <meshPhongMaterial color="#3A3A3A" specular="#777777" shininess={60} />
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
                (button.label === 'LOCAL' && !remoteMode) ||
                (button.label === 'REMOTE' && remoteMode) ? button.color : '#000000'
              }
              emissiveIntensity={0.3}
              specular="#FFFFFF"
              shininess={90}
            />
          </mesh>
        </group>
      ))}
      
      {/* ========== POWER ELECTRONICS SECTION ========== */}
      
      {/* Heat Sink Assembly */}
      <group position={[0, -0.8, 0.4]}>
        {/* Main Heat Sink */}
        <mesh castShadow>
          <boxGeometry args={[2.4, 1.5, 0.6]} />
          <meshPhongMaterial 
            color="#4A4A4A" 
            specular="#888888" 
            shininess={60}
            metalness={0.8}
          />
        </mesh>
        
        {/* Heat Sink Fins */}
        {Array.from({length: 12}, (_, i) => (
          <mesh key={`fin-${i}`} position={[(-1.1 + i * 0.2), 0, 0.2]} castShadow>
            <boxGeometry args={[0.15, 1.4, 0.4]} />
            <meshPhongMaterial color="#5A5A5A" specular="#999999" shininess={70} />
          </mesh>
        ))}
        
        {/* Power Modules */}
        {[-0.6, 0, 0.6].map((xPos, i) => (
          <mesh key={`module-${i}`} position={[xPos, 0.5, 0]} castShadow>
            <boxGeometry args={[0.3, 0.4, 0.2]} />
            <meshPhongMaterial color="#1A1A2E" specular="#333355" shininess={80} />
          </mesh>
        ))}
      </group>
      
      {/* Cooling Fans */}
      {[-0.6, 0.6].map((xPos, i) => (
        <group key={`fan-${i}`} position={[xPos, -1.6, 0.4]}>
          {/* Fan Housing */}
          <mesh castShadow>
            <cylinderGeometry args={[0.25, 0.25, 0.15, 16]} rotation={[Math.PI/2, 0, 0]} />
            <meshPhongMaterial color="#2A2A2A" specular="#666666" shininess={50} />
          </mesh>
          {/* Fan Blades */}
          <group rotation={[0, 0, motorRunning ? Date.now() * 0.01 : 0]}>
            {Array.from({length: 6}, (_, j) => {
              const angle = (j * Math.PI * 2) / 6;
              return (
                <mesh key={`blade-${j}`} position={[
                  Math.cos(angle) * 0.15, 
                  0, 
                  Math.sin(angle) * 0.15
                ]} rotation={[0, angle, 0]} castShadow>
                  <boxGeometry args={[0.08, 0.02, 0.12]} />
                  <meshPhongMaterial color="#1A1A1A" />
                </mesh>
              );
            })}
          </group>
        </group>
      ))}
      
      {/* ========== TERMINAL BLOCKS & CONNECTIONS ========== */}
      
      {/* Power Terminal Block */}
      <group position={[0, 2.2, 0.8]}>
        <mesh castShadow>
          <boxGeometry args={[2.6, 0.4, 0.3]} />
          <meshPhongMaterial color="#F5F5DC" specular="#FFFFFF" shininess={80} />
        </mesh>
        
        {/* Power Terminal Screws */}
        {[-1.0, -0.6, -0.2, 0.2, 0.6, 1.0].map((xPos, i) => (
          <mesh key={`power-terminal-${i}`} position={[xPos, 0, 0.18]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.12, 8]} />
            <meshPhongMaterial color="#2A2A2A" specular="#666666" shininess={90} />
          </mesh>
        ))}
      </group>
      
      {/* Control Terminal Block */}
      <group position={[0, 1.8, 0.8]}>
        <mesh castShadow>
          <boxGeometry args={[2.2, 0.25, 0.2]} />
          <meshPhongMaterial color="#E6E6FA" specular="#FFFFFF" shininess={80} />
        </mesh>
        
        {/* Control Terminal Screws */}
        {[-0.8, -0.4, 0, 0.4, 0.8, 1.2].map((xPos, i) => (
          <mesh key={`ctrl-terminal-${i}`} position={[xPos, 0, 0.12]} castShadow>
            <cylinderGeometry args={[0.025, 0.025, 0.08, 8]} />
            <meshPhongMaterial color="#2A2A2A" specular="#666666" shininess={90} />
          </mesh>
        ))}
      </group>
      
      {/* ========== ELECTRICAL CONDUITS ========== */}
      
      {/* Power Cable Conduits */}
      {[-0.8, -0.4, 0, 0.4, 0.8].map((xPos, i) => (
        <mesh key={`conduit-${i}`} position={[xPos, 1.5, 0.9]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.4, 8]} />
          <meshPhongMaterial color="#2A2A2A" />
        </mesh>
      ))}
      
      {/* ========== MOUNTING & ENCLOSURE ========== */}
      
      {/* Mounting Brackets */}
      {[-1.2, 1.2].map((xPos, i) => (
        <mesh key={`bracket-${i}`} position={[xPos, 0, -0.4]} castShadow>
          <boxGeometry args={[0.2, 3.5, 0.4]} />
          <meshPhongMaterial color="#4A4A4A" specular="#777777" shininess={50} />
        </mesh>
      ))}
      
      {/* Enclosure Feet */}
      {[-1.0, 1.0].map((xPos, i) => (
        <group key={`foot-${i}`}>
          {[-0.5, 0.5].map((zPos, j) => (
            <mesh key={`foot-${i}-${j}`} position={[xPos, -2.2, zPos]} castShadow>
              <cylinderGeometry args={[0.08, 0.08, 0.4, 8]} />
              <meshPhongMaterial color="#2A2A2A" specular="#555555" shininess={70} />
            </mesh>
          ))}
        </group>
      ))}
      
      {/* ========== NAMEPLATE & LABELING ========== */}
      
      {/* Main Nameplate */}
      <mesh position={[0, -1.5, 0.64]} castShadow>
        <boxGeometry args={[2.2, 0.6, 0.02]} />
        <meshPhongMaterial 
          color="#F8F8F8" 
          specular="#FFFFFF" 
          shininess={100}
        />
      </mesh>
      
      {/* Nameplate Text Background */}
      <mesh position={[0, -1.5, 0.65]} castShadow>
        <boxGeometry args={[2.1, 0.55, 0.005]} />
        <meshBasicMaterial color="#1A1A1A" />
      </mesh>
      
      {/* VFD Symbol */}
      <mesh position={[0, 0.8, 0.64]} castShadow>
        <boxGeometry args={[0.3, 0.2, 0.02]} />
        <meshPhongMaterial 
          color="#00BFFF" 
          emissive="#00BFFF" 
          emissiveIntensity={0.3}
          specular="#FFFFFF" 
          shininess={90}
        />
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
              <boxGeometry args={[0.16, 0.16, 0.12]} />
              <meshPhongMaterial 
                color="#B91C1C" 
                emissive={isHovered ? getPortColor(port) : '#000000'}
                emissiveIntensity={isHovered ? 0.4 : 0}
                specular="#FFFFFF"
                shininess={80}
              />
            </mesh>
            
            <mesh position={[0, 0, 0.08]} scale={[scale, scale, scale]}>
              <octahedronGeometry args={[0.045]} />
              <meshPhongMaterial 
                color={getPortColor(port)}
                emissive={getPortColor(port)}
                emissiveIntensity={0.8}
                specular="#FFFFFF"
                shininess={90}
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
      
      {/* Fault Alarm Beacon */}
      {faultCondition && (
        <mesh position={[0, 3.0, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.2, 12]} />
          <meshPhongMaterial 
            color="#DC2626" 
            emissive="#DC2626" 
            emissiveIntensity={Math.sin(Date.now() / 70) * 0.9 + 0.1}
            specular="#FFFFFF"
            shininess={100}
          />
        </mesh>
      )}
      
      {/* Frequency Display Animation */}
      {motorRunning && (
        <mesh position={[0, 1.8, 0.82]} castShadow>
          <sphereGeometry args={[0.03]} />
          <meshBasicMaterial 
            color="#00FF00" 
            transparent 
            opacity={Math.sin(Date.now() / 200) * 0.4 + 0.6}
          />
        </mesh>
      )}
      
      {/* Power Flow Animation */}
      {motorRunning && (
        <group>
          {[-0.6, 0, 0.6].map((xPos, i) => (
            <mesh 
              key={`power-flow-${i}`} 
              position={[xPos, 1.8 + Math.sin(Date.now() / 150 + i) * 0.1, 0.85]} 
              castShadow
            >
              <sphereGeometry args={[0.02]} />
              <meshBasicMaterial 
                color="#FFD700" 
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
          <mesh position={[0, 3.5, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.6, 8]} />
            <meshPhongMaterial 
              color="#FFFF00" 
              emissive="#FFFF00" 
              emissiveIntensity={0.8}
              specular="#FFFFFF"
              shininess={100}
            />
          </mesh>
          
          <mesh position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
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
              <ringGeometry args={[0.2, 0.24, 16]} />
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
VariableFrequencyDrive.connectionPorts = [
  {
    id: 'power_input_l1',
    type: 'electric',
    label: 'L1 Power Input (400V)',
    offset: [-1.0, 2.5, 1.0],
    direction: [0, 0, 1],
    required: true
  },
  {
    id: 'power_input_l2',
    type: 'electric',
    label: 'L2 Power Input (400V)',
    offset: [-0.6, 2.5, 1.0],
    direction: [0, 0, 1],
    required: true
  },
  {
    id: 'power_input_l3',
    type: 'electric',
    label: 'L3 Power Input (400V)',
    offset: [-0.2, 2.5, 1.0],
    direction: [0, 0, 1],
    required: true
  },
  {
    id: 'motor_output_u',
    type: 'electric',
    label: 'Motor U Phase Output',
    offset: [0.2, 2.5, 1.0],
    direction: [0, 0, 1],
    required: true
  },
  {
    id: 'motor_output_v',
    type: 'electric',
    label: 'Motor V Phase Output',
    offset: [0.6, 2.5, 1.0],
    direction: [0, 0, 1],
    required: true
  },
  {
    id: 'motor_output_w',
    type: 'electric',
    label: 'Motor W Phase Output',
    offset: [1.0, 2.5, 1.0],
    direction: [0, 0, 1],
    required: true
  },
  {
    id: 'analog_input_4_20ma',
    type: 'electric',
    label: 'Speed Reference (4-20mA)',
    offset: [-1.2, 2.0, 1.0],
    direction: [0, 0, 1],
    required: false
  },
  {
    id: 'digital_input_run',
    type: 'electric',
    label: 'Run Command (24VDC)',
    offset: [-0.8, 2.0, 1.0],
    direction: [0, 0, 1],
    required: false
  },
  {
    id: 'digital_input_stop',
    type: 'electric',
    label: 'Stop Command (24VDC)',
    offset: [-0.4, 2.0, 1.0],
    direction: [0, 0, 1],
    required: false
  },
  {
    id: 'relay_output_run',
    type: 'electric',
    label: 'Run Status Relay',
    offset: [0.4, 2.0, 1.0],
    direction: [0, 0, 1],
    required: false
  },
  {
    id: 'relay_output_fault',
    type: 'electric',
    label: 'Fault Alarm Relay',
    offset: [0.8, 2.0, 1.0],
    direction: [0, 0, 1],
    required: false
  },
  {
    id: 'communication_rs485',
    type: 'electric',
    label: 'RS485 Communication',
    offset: [1.2, 2.0, 1.0],
    direction: [0, 0, 1],
    required: false
  }
];

export default VariableFrequencyDrive; 