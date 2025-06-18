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

    // Constants for routing
    const GROUND_LEVEL = 0;
    const CLEARANCE_HEIGHT = 2.5; // Height to clear objects
    const OBJECT_RADIUS = 2.0; // Assumed radius around objects to avoid
    const OUTWARD_DISTANCE = 1.5; // Distance to move outward from objects
    
    // Helper function to check if a point is too close to any object
    const isNearObject = (point, excludeObjects = []) => {
      return objects.some(obj => {
        if (excludeObjects.includes(obj.id)) return false;
        const objPos = new THREE.Vector3(...obj.position);
        const distance = point.clone().setY(objPos.y).distanceTo(objPos);
        return distance < OBJECT_RADIUS;
      });
    };
    
    // Helper function to find a safe routing height
    const getSafeRoutingHeight = (path) => {
      let maxObjectHeight = GROUND_LEVEL;
      
      // Check all objects along the path
      for (const obj of objects) {
        const objPos = new THREE.Vector3(...obj.position);
        
        // Check if object is near the routing path
        for (let i = 0; i < path.length - 1; i++) {
          const segmentStart = path[i].clone().setY(objPos.y);
          const segmentEnd = path[i + 1].clone().setY(objPos.y);
          
          // Distance from object to line segment
          const line = new THREE.Line3(segmentStart, segmentEnd);
          const closestPoint = line.closestPointToPoint(objPos, true, new THREE.Vector3());
          const distance = closestPoint.distanceTo(objPos);
          
          if (distance < OBJECT_RADIUS) {
            // This object is in the way, need to go over it
            maxObjectHeight = Math.max(maxObjectHeight, objPos.y + CLEARANCE_HEIGHT);
          }
        }
      }
      
      return maxObjectHeight;
    };

    // Auto-routing logic for realistic plumbing-style connections
    const routePoints = [];
    
    // Start at the port position
    routePoints.push(startPortPos.clone());
    
    // Step 1: Go outward from start object using port direction
    let currentPos = startPortPos.clone();
    
    if (startPort && startPort.direction) {
      const outwardDirection = new THREE.Vector3(...startPort.direction).normalize();
      currentPos.add(outwardDirection.multiplyScalar(OUTWARD_DISTANCE));
      routePoints.push(currentPos.clone());
    }
    
    // Step 2: Calculate routing strategy - prefer going down when possible, avoid obstacles
    const distance = currentPos.distanceTo(endPortPos);
    const deltaX = endPortPos.x - currentPos.x;
    const deltaZ = endPortPos.z - currentPos.z;
    const deltaY = endPortPos.y - currentPos.y;
    
    // Determine if we should go down first (preferred for plumbing)
    const shouldGoDown = deltaY < -0.5; // If end is significantly lower
    
    if (distance > 3) {
      // Long distance routing with obstacle avoidance
      let routingHeight;
      
      if (shouldGoDown) {
        // Gravity-fed routing: try to go down first, then horizontal
        const preferredHeight = Math.max(GROUND_LEVEL + 0.5, endPortPos.y);
        
        // Create preliminary horizontal path to check for obstacles
        const preliminaryPath = [
          currentPos.clone(),
          new THREE.Vector3(endPortPos.x, preferredHeight, currentPos.z),
          new THREE.Vector3(endPortPos.x, preferredHeight, endPortPos.z)
        ];
        
        // Check if this path needs elevation due to obstacles
        routingHeight = Math.max(preferredHeight, getSafeRoutingHeight(preliminaryPath));
        
        // Go down to routing level
        if (currentPos.y > routingHeight) {
          routePoints.push(new THREE.Vector3(currentPos.x, routingHeight, currentPos.z));
          currentPos.set(currentPos.x, routingHeight, currentPos.z);
        }
        
        // Route horizontally at safe level, avoiding obstacles
        if (Math.abs(deltaX) > Math.abs(deltaZ)) {
          // X-dominant route
          const midPoint1 = new THREE.Vector3(endPortPos.x, routingHeight, currentPos.z);
          const midPoint2 = new THREE.Vector3(endPortPos.x, routingHeight, endPortPos.z);
          
          // Check if we need to detour around obstacles
          if (isNearObject(midPoint1)) {
            // Add detour points
            const detourZ = currentPos.z + (endPortPos.z > currentPos.z ? OBJECT_RADIUS + 1 : -OBJECT_RADIUS - 1);
            routePoints.push(new THREE.Vector3(currentPos.x, routingHeight, detourZ));
            routePoints.push(new THREE.Vector3(endPortPos.x, routingHeight, detourZ));
          }
          
          routePoints.push(midPoint1);
          routePoints.push(midPoint2);
        } else {
          // Z-dominant route
          const midPoint1 = new THREE.Vector3(currentPos.x, routingHeight, endPortPos.z);
          const midPoint2 = new THREE.Vector3(endPortPos.x, routingHeight, endPortPos.z);
          
          // Check if we need to detour around obstacles
          if (isNearObject(midPoint1)) {
            // Add detour points
            const detourX = currentPos.x + (endPortPos.x > currentPos.x ? OBJECT_RADIUS + 1 : -OBJECT_RADIUS - 1);
            routePoints.push(new THREE.Vector3(detourX, routingHeight, currentPos.z));
            routePoints.push(new THREE.Vector3(detourX, routingHeight, endPortPos.z));
          }
          
          routePoints.push(midPoint1);
          routePoints.push(midPoint2);
        }
        
        // Go up to end if needed
        if (routingHeight < endPortPos.y) {
          routePoints.push(new THREE.Vector3(endPortPos.x, endPortPos.y, endPortPos.z));
        }
      } else {
        // Standard elevated routing for long distances going up
        const preliminaryPath = [
          currentPos.clone(),
          new THREE.Vector3(endPortPos.x, currentPos.y, currentPos.z),
          new THREE.Vector3(endPortPos.x, currentPos.y, endPortPos.z)
        ];
        
        routingHeight = Math.max(
          Math.max(currentPos.y, endPortPos.y) + 1.0,
          getSafeRoutingHeight(preliminaryPath)
        );
        
        // Go up to elevated level
        if (currentPos.y < routingHeight) {
          routePoints.push(new THREE.Vector3(currentPos.x, routingHeight, currentPos.z));
          currentPos.set(currentPos.x, routingHeight, currentPos.z);
        }
        
        // Route horizontally at elevated level
        if (Math.abs(deltaX) > Math.abs(deltaZ)) {
          // X-dominant route
          routePoints.push(new THREE.Vector3(endPortPos.x, routingHeight, currentPos.z));
          routePoints.push(new THREE.Vector3(endPortPos.x, routingHeight, endPortPos.z));
        } else {
          // Z-dominant route
          routePoints.push(new THREE.Vector3(currentPos.x, routingHeight, endPortPos.z));
          routePoints.push(new THREE.Vector3(endPortPos.x, routingHeight, endPortPos.z));
        }
        
        // Go down to end
        if (routingHeight > endPortPos.y) {
          routePoints.push(new THREE.Vector3(endPortPos.x, endPortPos.y, endPortPos.z));
        }
      }
    } else {
      // Short distance - simple L-shaped routing with obstacle checking
      if (Math.abs(deltaX) > Math.abs(deltaZ)) {
        // Route X first, then Z, then Y if needed
        const waypoint1 = new THREE.Vector3(endPortPos.x, currentPos.y, currentPos.z);
        const waypoint2 = new THREE.Vector3(endPortPos.x, currentPos.y, endPortPos.z);
        
        // Check for obstacles and adjust height if needed
        if (isNearObject(waypoint1) || isNearObject(waypoint2)) {
          const safeHeight = getSafeRoutingHeight([currentPos, waypoint1, waypoint2]);
          waypoint1.y = safeHeight;
          waypoint2.y = safeHeight;
          
          // Go up first if needed
          if (currentPos.y < safeHeight) {
            routePoints.push(new THREE.Vector3(currentPos.x, safeHeight, currentPos.z));
          }
        }
        
        routePoints.push(waypoint1);
        if (Math.abs(deltaZ) > 0.01) {
          routePoints.push(waypoint2);
        }
        if (Math.abs(deltaY) > 0.01) {
          routePoints.push(new THREE.Vector3(endPortPos.x, endPortPos.y, endPortPos.z));
        }
      } else {
        // Route Z first, then X, then Y if needed
        const waypoint1 = new THREE.Vector3(currentPos.x, currentPos.y, endPortPos.z);
        const waypoint2 = new THREE.Vector3(endPortPos.x, currentPos.y, endPortPos.z);
        
        // Check for obstacles and adjust height if needed
        if (isNearObject(waypoint1) || isNearObject(waypoint2)) {
          const safeHeight = getSafeRoutingHeight([currentPos, waypoint1, waypoint2]);
          waypoint1.y = safeHeight;
          waypoint2.y = safeHeight;
          
          // Go up first if needed
          if (currentPos.y < safeHeight) {
            routePoints.push(new THREE.Vector3(currentPos.x, safeHeight, currentPos.z));
          }
        }
        
        routePoints.push(waypoint1);
        if (Math.abs(deltaX) > 0.01) {
          routePoints.push(waypoint2);
        }
        if (Math.abs(deltaY) > 0.01) {
          routePoints.push(new THREE.Vector3(endPortPos.x, endPortPos.y, endPortPos.z));
        }
      }
    }
    
    // Step 3: Approach end object from port direction if available
    if (endPort && endPort.direction) {
      const approachDirection = new THREE.Vector3(...endPort.direction).normalize();
      const approachPoint = endPortPos.clone().sub(approachDirection.multiplyScalar(OUTWARD_DISTANCE));
      
      // Add approach point if it's different from last point
      const lastPoint = routePoints[routePoints.length - 1];
      if (lastPoint.distanceTo(approachPoint) > 0.1) {
        routePoints.push(approachPoint);
      }
    }
    
    // End at the port position
    routePoints.push(endPortPos.clone());
    
    // Remove duplicate consecutive points
    const cleanedPoints = [routePoints[0]];
    for (let i = 1; i < routePoints.length; i++) {
      const current = routePoints[i];
      const previous = routePoints[i - 1];
      if (current.distanceTo(previous) > 0.01) {
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