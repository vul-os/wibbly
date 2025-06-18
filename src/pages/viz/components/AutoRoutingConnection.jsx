import React, { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const AutoRoutingConnection = ({ 
  startPosition, 
  endPosition, 
  startPort, 
  endPort, 
  type = 'liquid', 
  onClick,
  objects = [],
  isEditing = false,
  onEditComplete
}) => {
  const groupRef = useRef();
  const [editWaypoints, setEditWaypoints] = useState(null);

  // Connection type configurations
  const connectionTypes = {
    liquid: {
      color: '#2196F3',
      radius: 0.08,
      flowColor: '#64B5F6',
      animated: true
    },
    gas: {
      color: '#FFC107',
      radius: 0.06,
      flowColor: '#FFEB3B',
      animated: true
    },
    electric: {
      color: '#FF5722',
      radius: 0.04,
      flowColor: '#FF8A65',
      animated: true
    }
  };

  const config = connectionTypes[type] || connectionTypes.liquid;

  // Intelligent auto-routing algorithm with outward movement and downward preference
  const calculateOptimalRoute = useMemo(() => {
    const start = new THREE.Vector3(...startPosition);
    const end = new THREE.Vector3(...endPosition);
    
    // Calculate actual port positions
    const startPortPos = start.clone();
    const endPortPos = end.clone();
    
    if (startPort) {
      startPortPos.add(new THREE.Vector3(...startPort.offset));
    }
    if (endPort) {
      endPortPos.add(new THREE.Vector3(...endPort.offset));
    }

    // Constants for routing - simplified for predictable behavior
    const FLOOR_LEVEL = 0.3; // Route near floor level
    const OUTWARD_DISTANCE = 1.8; // Distance to move outward from objects
    const CLEARANCE_HEIGHT = 2.8; // Height to clear objects when necessary
    
    // Helper function to check if routing path conflicts with objects
    const getMinClearanceHeight = (pathPoints) => {
      let minHeight = FLOOR_LEVEL;
      
      // Check each object to see if we need to route over it
      for (const obj of objects) {
        const objPos = new THREE.Vector3(...obj.position);
        
        // Check if any path segment passes near this object
        for (let i = 0; i < pathPoints.length - 1; i++) {
          const segStart = pathPoints[i].clone();
          const segEnd = pathPoints[i + 1].clone();
          
          // Only check horizontal proximity (ignore y)
          segStart.y = objPos.y;
          segEnd.y = objPos.y;
          
          const line = new THREE.Line3(segStart, segEnd);
          const closest = line.closestPointToPoint(objPos, true, new THREE.Vector3());
          const distance = closest.distanceTo(objPos);
          
          // If path goes too close to object, route higher
          if (distance < 1.5) {
            minHeight = Math.max(minHeight, objPos.y + CLEARANCE_HEIGHT);
          }
        }
      }
      
      return minHeight;
    };

    // Step-by-step routing: direction-aware smart routing
    const routePoints = [];
    
    // 1. Start at source port
    routePoints.push(startPortPos.clone());
    
    // 2. Move outward from source based on port direction and position
    let currentPos = startPortPos.clone();
    if (startPort && startPort.direction) {
      const portDir = new THREE.Vector3(...startPort.direction).normalize();
      
      // Determine routing strategy based on port direction
      if (portDir.y > 0.5) {
        // Port points up - go up first (like steam outlet on top of boiler)
        currentPos.y += 2.0; // Go up significantly
        routePoints.push(currentPos.clone());
        
        // Then move horizontally outward
        currentPos.x += portDir.x * OUTWARD_DISTANCE;
        currentPos.z += portDir.z * OUTWARD_DISTANCE;
        if (Math.abs(portDir.x) > 0.1 || Math.abs(portDir.z) > 0.1) {
          routePoints.push(currentPos.clone());
        }
      } else if (portDir.y < -0.5) {
        // Port points down - go down first
        currentPos.y -= 1.0;
        routePoints.push(currentPos.clone());
        
        // Then move horizontally outward
        currentPos.x += portDir.x * OUTWARD_DISTANCE;
        currentPos.z += portDir.z * OUTWARD_DISTANCE;
        if (Math.abs(portDir.x) > 0.1 || Math.abs(portDir.z) > 0.1) {
          routePoints.push(currentPos.clone());
        }
      } else {
        // Port points horizontally - go outward first
        currentPos.add(portDir.multiplyScalar(OUTWARD_DISTANCE));
        routePoints.push(currentPos.clone());
      }
    }
    
    // 3. Calculate end approach strategy
    let endApproachPos = endPortPos.clone();
    if (endPort && endPort.direction) {
      const endPortDir = new THREE.Vector3(...endPort.direction).normalize();
      
      // Determine approach strategy based on end port direction
      if (endPortDir.y > 0.5) {
        // End port points up - approach from above
        endApproachPos.y += 2.0;
        endApproachPos.x -= endPortDir.x * OUTWARD_DISTANCE;
        endApproachPos.z -= endPortDir.z * OUTWARD_DISTANCE;
      } else if (endPortDir.y < -0.5) {
        // End port points down - approach from below
        endApproachPos.y -= 1.0;
        endApproachPos.x -= endPortDir.x * OUTWARD_DISTANCE;
        endApproachPos.z -= endPortDir.z * OUTWARD_DISTANCE;
      } else {
        // End port points horizontally - approach from opposite direction
        endApproachPos.add(endPortDir.multiplyScalar(-OUTWARD_DISTANCE));
      }
    }
    
    // 4. Route to floor level for horizontal movement (unless both ports are high)
    const horizontalPath = [currentPos.clone(), endApproachPos.clone()];
    let routingHeight = getMinClearanceHeight(horizontalPath);
    
    // If both start and end are high up, keep routing high
    const startIsHigh = currentPos.y > 2.0;
    const endIsHigh = endApproachPos.y > 2.0;
    
    if (startIsHigh && endIsHigh) {
      routingHeight = Math.max(routingHeight, Math.min(currentPos.y, endApproachPos.y));
    }
    
    // Move to routing height if needed
    if (Math.abs(currentPos.y - routingHeight) > 0.1) {
      currentPos.y = routingHeight;
      routePoints.push(currentPos.clone());
    }
    
    // 5. Route horizontally at routing level
    const deltaX = endApproachPos.x - currentPos.x;
    const deltaZ = endApproachPos.z - currentPos.z;
    
    // Simple L-shaped horizontal routing
    if (Math.abs(deltaX) > 0.1) {
      currentPos.x = endApproachPos.x;
      routePoints.push(currentPos.clone());
    }
    
    if (Math.abs(deltaZ) > 0.1) {
      currentPos.z = endApproachPos.z;
      routePoints.push(currentPos.clone());
    }
    
    // 6. Move to approach position height
    if (Math.abs(endApproachPos.y - currentPos.y) > 0.1) {
      currentPos.y = endApproachPos.y;
      routePoints.push(currentPos.clone());
    }
    
    // 7. Approach end port if needed
    if (endApproachPos.distanceTo(endPortPos) > 0.1) {
      routePoints.push(endApproachPos.clone());
    }
    
    // 8. End at target port
    routePoints.push(endPortPos.clone());
    
    // Clean up duplicate points
    const cleanedPoints = [routePoints[0]];
    for (let i = 1; i < routePoints.length; i++) {
      const current = routePoints[i];
      const previous = routePoints[i - 1];
      if (current.distanceTo(previous) > 0.05) {
        cleanedPoints.push(current);
      }
    }
    
    return cleanedPoints;
  }, [startPosition, endPosition, startPort, endPort, objects]);

  // Create pipe segments from route points
  const segments = useMemo(() => {
    const points = editWaypoints || calculateOptimalRoute;
    const segments = [];
    
    for (let i = 0; i < points.length - 1; i++) {
      const start = points[i];
      const end = points[i + 1];
      const direction = new THREE.Vector3().subVectors(end, start);
      const length = direction.length();
      
      if (length > 0.01) {
        direction.normalize();
        const midPoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
        const quaternion = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 1, 0), 
          direction
        );
        
        segments.push({
          start: start.clone(),
          end: end.clone(),
          midPoint,
          quaternion,
          length,
          direction: direction.clone()
        });
      }
    }
    
    return segments;
  }, [calculateOptimalRoute, editWaypoints]);

  // Flow animation
  useFrame((state) => {
    if (!config.animated || !groupRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    if (type === 'electric') {
      // Pulse effect for electric connections
      const pulse = Math.sin(time * 8) * 0.5 + 0.5;
      groupRef.current.children.forEach(child => {
        if (child.userData.isFlow && child.material) {
          child.material.emissive.setScalar(pulse * 0.3);
        }
      });
    } else {
      // Flow animation for liquid/gas
      groupRef.current.children.forEach((child, index) => {
        if (child.userData.isFlow && child.material && child.material.uniforms) {
          child.material.uniforms.time.value = time + index * 0.5;
        }
      });
    }
  });

  // Create flow material for animated segments
  const createFlowMaterial = (segmentIndex) => {
    if (type === 'electric') {
      return new THREE.MeshLambertMaterial({
        color: config.flowColor,
        emissive: config.flowColor,
        emissiveIntensity: 0.2
      });
    }
    
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(config.flowColor) },
        segmentIndex: { value: segmentIndex }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color;
        uniform float segmentIndex;
        varying vec2 vUv;
        
        void main() {
          float flow = sin(vUv.y * 10.0 - time * 3.0 + segmentIndex) * 0.5 + 0.5;
          vec3 finalColor = color * (0.5 + flow * 0.5);
          gl_FragColor = vec4(finalColor, 0.8);
        }
      `,
      transparent: true
    });
  };

  const handleClick = (event) => {
    event.stopPropagation();
    onClick?.(event);
  };

  return (
    <group ref={groupRef} onClick={handleClick}>
      {/* Main pipe segments */}
      {segments.map((segment, index) => {
        const segmentGeometry = new THREE.CylinderGeometry(
          config.radius, 
          config.radius, 
          segment.length, 
          type === 'electric' ? 6 : 12
        );
        
        return (
          <group key={`segment-${index}`}>
            {/* Main pipe segment */}
            <mesh
              position={segment.midPoint}
              quaternion={segment.quaternion}
              geometry={segmentGeometry}
              castShadow
              receiveShadow
            >
              <meshLambertMaterial 
                color={config.color}
                emissive={isEditing ? config.color : '#000000'}
                emissiveIntensity={isEditing ? 0.2 : 0}
              />
            </mesh>
            
            {/* Flow animation segment */}
            {config.animated && (
              <mesh
                position={segment.midPoint}
                quaternion={segment.quaternion}
                geometry={segmentGeometry}
                material={createFlowMaterial(index)}
                userData={{ isFlow: true }}
              />
            )}
          </group>
        );
      })}
      
      {/* Connection joints at bends */}
      {segments.length > 1 && segments.slice(0, -1).map((segment, index) => {
        const jointPosition = segment.end;
        return (
          <mesh key={`joint-${index}`} position={jointPosition}>
            <sphereGeometry args={[config.radius * 1.3, 8, 8]} />
            <meshLambertMaterial 
              color={config.color}
              emissive={isEditing ? config.color : '#000000'}
              emissiveIntensity={isEditing ? 0.2 : 0}
            />
          </mesh>
        );
      })}
      
      {/* Connection type indicator */}
      {segments.length > 0 && (
        <mesh position={[
          (startPosition[0] + endPosition[0]) / 2,
          Math.max(...startPosition, ...endPosition) + 1.5,
          (startPosition[2] + endPosition[2]) / 2
        ]}>
          {type === 'electric' && <octahedronGeometry args={[0.08]} />}
          {type === 'gas' && <coneGeometry args={[0.06, 0.15, 6]} />}
          {type === 'liquid' && <coneGeometry args={[0.08, 0.2, 4]} rotation={[0, 0, Math.PI / 2]} />}
          <meshLambertMaterial 
            color={config.color}
            emissive={config.color}
            emissiveIntensity={0.3}
          />
        </mesh>
      )}
      
      {/* Connection flanges at ports */}
      {startPort && (
        <mesh position={new THREE.Vector3(...startPosition).add(new THREE.Vector3(...startPort.offset))}>
          <cylinderGeometry args={[config.radius * 2, config.radius * 2, 0.05, 8]} />
          <meshLambertMaterial color="#666666" />
        </mesh>
      )}
      
      {endPort && (
        <mesh position={new THREE.Vector3(...endPosition).add(new THREE.Vector3(...endPort.offset))}>
          <cylinderGeometry args={[config.radius * 2, config.radius * 2, 0.05, 8]} />
          <meshLambertMaterial color="#666666" />
        </mesh>
      )}
      
      {/* Edit mode indicators */}
      {isEditing && (
        <>
          {segments.map((segment, index) => (
            <mesh 
              key={`edit-handle-${index}`} 
              position={segment.midPoint}
            >
              <sphereGeometry args={[0.1]} />
              <meshLambertMaterial color="#FFEB3B" emissive="#FFEB3B" emissiveIntensity={0.5} />
            </mesh>
          ))}
        </>
      )}
    </group>
  );
};

export default AutoRoutingConnection; 