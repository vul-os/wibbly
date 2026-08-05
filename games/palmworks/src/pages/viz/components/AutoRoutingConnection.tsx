import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * A connection port, as read here. This is a structural subset of the
 * `offset` + `[x,y,z]`-`direction` port shape used by most object components
 * (see pages/viz/components/objects/Boiler.tsx and friends) — this file only
 * ever reads `.offset`/`.direction` off whichever port PlantScene hands it,
 * regardless of which object type it came from. A handful of object files
 * (the Water*, HeatPump family) use a different port shape (`position` +
 * string `direction`) for their OWN rendering; if one of those ports is ever
 * passed in here as a `startPort`/`endPort`, `.offset`/`.direction` would be
 * `undefined` at runtime — a pre-existing cross-shape inconsistency in the
 * app, not something this migration changes.
 */
interface RoutePort {
  type?: string;
  label?: string;
  offset: [number, number, number];
  direction: [number, number, number];
}

type Vec3Tuple = [number, number, number];

/** The subset of a PlantScene object this file reads for collision avoidance. */
interface RoutableObject {
  position: Vec3Tuple;
  type: string;
}

interface RouteSegment {
  start: THREE.Vector3;
  end: THREE.Vector3;
  midPoint: THREE.Vector3;
  quaternion: THREE.Quaternion;
  length: number;
  direction: THREE.Vector3;
  geometry: THREE.CylinderGeometry;
  flowMaterial: THREE.ShaderMaterial | null;
}

interface ConnectionTypeConfig {
  color: string;
  radius: number;
  flowColor: string;
  animated: boolean;
}

export interface AutoRoutingConnectionProps {
  startPosition: Vec3Tuple;
  endPosition: Vec3Tuple;
  startPort?: RoutePort | null;
  endPort?: RoutePort | null;
  type?: string;
  onClick?: (event: unknown) => void;
  objects?: RoutableObject[];
  isEditing?: boolean;
}

const AutoRoutingConnection = ({
  startPosition,
  endPosition,
  startPort,
  endPort,
  type = 'liquid',
  onClick,
  objects = [],
  isEditing = false
}: AutoRoutingConnectionProps) => {
  const groupRef = useRef<THREE.Group>(null);
  // Waypoint editing (drag a routed pipe to reshape it) is not implemented
  // yet — this always stays null and the route falls back to the
  // auto-router below. `isEditing` only controls the highlight indicator.
  const [editWaypoints] = useState<THREE.Vector3[] | null>(null);

  // Connection type configurations
  const connectionTypes: Record<string, ConnectionTypeConfig> = {
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

  // Simple ground-based auto-routing algorithm with collision detection
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


    const GROUND_LEVEL = 0.0;
    const MIN_SEGMENT = 0.15;
    const PORT_APPROACH_DISTANCE = 0.8;
    const OBJECT_CLEARANCE_HEIGHT = 3.0; // Height to go above objects
    
    // Object footprints for collision detection
    const OBJECT_FOOTPRINTS = {
      boiler: { radius: 1.4, height: 3.5, clearance: 1.6 },
      pump: { width: 1.6, depth: 1.2, height: 1.0, clearance: 1.4 },
      valve: { radius: 0.8, height: 1.5, clearance: 1.2 },
      powerBox: { width: 1.2, depth: 0.8, height: 1.5, clearance: 1.4 },
      sensor: { radius: 0.4, height: 0.8, clearance: 0.8 },
      controlUnit: { width: 1.0, depth: 0.6, height: 1.2, clearance: 1.1 },
      conveyorBelt: { width: 8.0, depth: 1.5, height: 1.0, clearance: 4.0 }
    };
    
    // Collision detection functions
    const getObjectFootprint = (objPosition, objType) => {
      const footprint = OBJECT_FOOTPRINTS[objType] || { radius: 1.0, height: 2.0, clearance: 1.5 };
      const pos = new THREE.Vector3(...objPosition);
      
      return {
        position: pos,
        type: objType,
        footprint: footprint,
        
        // Check if a ground-level path intersects this object's clearance zone
        blocksGroundPath: (pathStart, pathEnd, buffer = 0.1) => {
          const clearanceRadius = footprint.clearance + buffer;
          const pathDir = new THREE.Vector3().subVectors(pathEnd, pathStart);
          const pathLength = pathDir.length();
          
          if (pathLength < 0.01) return false;
          
          pathDir.normalize();
          const toObj = new THREE.Vector3().subVectors(pos, pathStart);
          const projection = toObj.dot(pathDir);
          
          if (projection < -clearanceRadius || projection > pathLength + clearanceRadius) {
            return false;
          }
          
          const closestPoint = pathStart.clone().add(pathDir.clone().multiplyScalar(
            Math.max(0, Math.min(pathLength, projection))
          ));
          
          const horizontalDistance = Math.sqrt(
            Math.pow(pos.x - closestPoint.x, 2) + 
            Math.pow(pos.z - closestPoint.z, 2)
          );
          
          return horizontalDistance < clearanceRadius;
        },
        
        // Get clearance radius for approach calculations
        getClearanceRadius: () => footprint.clearance,
        
        // Get object height for vertical clearance
        getHeight: () => pos.y + (footprint.height || 2.0) / 2
      };
    };
    
    // Analyze all objects for collision detection
    const allObjects = objects.map(obj => getObjectFootprint(obj.position, obj.type));
    
    // Find source and destination objects to exclude from collision checks
    const sourceObj = allObjects.find(obj => obj.position.distanceTo(start) < 0.5);
    const destObj = allObjects.find(obj => obj.position.distanceTo(end) < 0.5);
    
    // Check if ground path is clear of objects
    const isGroundPathClear = (fromPos, toPos, excludeObjects = []) => {
      for (const obj of allObjects) {
        // Skip source and destination objects
        if (excludeObjects.includes(obj)) continue;
        
        if (obj.blocksGroundPath(fromPos, toPos)) {
          return false;
        }
      }
      return true;
    };
    
    // Find minimum safe height to clear all objects on path
    const findSafeHeight = (fromPos, toPos) => {
      let maxHeight = GROUND_LEVEL;
      
      for (const obj of allObjects) {
        if (obj.blocksGroundPath(fromPos, toPos)) {
          const objHeight = obj.getHeight();
          maxHeight = Math.max(maxHeight, objHeight + OBJECT_CLEARANCE_HEIGHT);
        }
      }
      
      return maxHeight;
    };
    
    const routePoints = [];
    
    // Analyze port orientations
    const startDirection = startPort ? new THREE.Vector3(...startPort.direction).normalize() : new THREE.Vector3(1, 0, 0);
    const endDirection = endPort ? new THREE.Vector3(...endPort.direction).normalize() : new THREE.Vector3(-1, 0, 0);
    
    const startIsUp = startDirection.y > 0.6;
    const endIsUp = endDirection.y > 0.6;
    const endIsDown = endDirection.y < -0.6;
    
    
    // PHASE 1: Start from port
    routePoints.push(startPortPos.clone());
    const currentPos = startPortPos.clone();
    
    // PHASE 2: Move out from start port, then descend to ground
    if (startIsUp) {
      // Upward port: Move up a bit more, then out horizontally
      currentPos.y += 1.0;
      routePoints.push(currentPos.clone());
      
      // Move horizontally toward destination
      const toDestination = new THREE.Vector3().subVectors(endPortPos, currentPos).setY(0).normalize();
      currentPos.add(toDestination.multiplyScalar(PORT_APPROACH_DISTANCE));
      routePoints.push(currentPos.clone());
    } else {
      // Horizontal or downward port: Move out in port direction
      const portDir = startDirection.clone().setY(0).normalize();
      currentPos.add(portDir.multiplyScalar(PORT_APPROACH_DISTANCE));
      routePoints.push(currentPos.clone());
    }
    
    // PHASE 3: Always descend to ground level for main routing
    if (Math.abs(currentPos.y - GROUND_LEVEL) > MIN_SEGMENT) {
      currentPos.y = GROUND_LEVEL;
      routePoints.push(currentPos.clone());
    }
    
    // PHASE 4: Route horizontally to destination area with collision avoidance
    
    // Calculate destination ground position
    const destGroundPos = new THREE.Vector3(endPortPos.x, GROUND_LEVEL, endPortPos.z);
    
    // Check if direct ground path is clear
    const excludeObjects = [sourceObj, destObj].filter(obj => obj);
    const directPathClear = isGroundPathClear(currentPos, destGroundPos, excludeObjects);
    
    if (directPathClear) {
      // Simple L-shaped routing at ground level
      const deltaX = destGroundPos.x - currentPos.x;
      const deltaZ = destGroundPos.z - currentPos.z;
      
      // Route X first, then Z
      if (Math.abs(deltaX) > MIN_SEGMENT) {
        const intermediatePos = new THREE.Vector3(destGroundPos.x, GROUND_LEVEL, currentPos.z);
        if (isGroundPathClear(currentPos, intermediatePos, excludeObjects)) {
          currentPos.x = destGroundPos.x;
          routePoints.push(currentPos.clone());
        }
      }
      if (Math.abs(deltaZ) > MIN_SEGMENT) {
        if (isGroundPathClear(currentPos, destGroundPos, excludeObjects)) {
          currentPos.z = destGroundPos.z;
          routePoints.push(currentPos.clone());
        }
      }
    } else {
      // Elevated routing over obstacles
      const safeHeight = findSafeHeight(currentPos, destGroundPos);
      
      // Go up to safe height
      currentPos.y = safeHeight;
      routePoints.push(currentPos.clone());
      
      // Route horizontally at safe height
      const deltaX = destGroundPos.x - currentPos.x;
      const deltaZ = destGroundPos.z - currentPos.z;
      
      if (Math.abs(deltaX) > MIN_SEGMENT) {
        currentPos.x = destGroundPos.x;
        routePoints.push(currentPos.clone());
      }
      if (Math.abs(deltaZ) > MIN_SEGMENT) {
        currentPos.z = destGroundPos.z;
        routePoints.push(currentPos.clone());
      }
      
      // Descend back to ground level (unless approaching vertical port)
      if (!endIsUp && Math.abs(currentPos.y - GROUND_LEVEL) > MIN_SEGMENT) {
        currentPos.y = GROUND_LEVEL;
        routePoints.push(currentPos.clone());
      }
    }
    
    // PHASE 5: Approach destination port with object clearance
    if (endIsUp) {
      
      // Check if we need to clear objects when approaching from below
      const approachStart = new THREE.Vector3(currentPos.x, GROUND_LEVEL, currentPos.z);
      const approachEnd = new THREE.Vector3(endPortPos.x, GROUND_LEVEL, endPortPos.z);
      
      // If path to directly below port is blocked, go up early
      if (!isGroundPathClear(approachStart, approachEnd, [destObj])) {
        const clearanceHeight = findSafeHeight(approachStart, approachEnd);
        
        // Go up to clearance height
        if (Math.abs(currentPos.y - clearanceHeight) > MIN_SEGMENT) {
          currentPos.y = clearanceHeight;
          routePoints.push(currentPos.clone());
        }
        
        // Move to position above port at clearance height
        if (Math.abs(currentPos.x - endPortPos.x) > MIN_SEGMENT || Math.abs(currentPos.z - endPortPos.z) > MIN_SEGMENT) {
          currentPos.x = endPortPos.x;
          currentPos.z = endPortPos.z;
          routePoints.push(currentPos.clone());
        }
      } else {
        // Standard approach: go to ground position below port, then up
        if (Math.abs(currentPos.y - GROUND_LEVEL) > MIN_SEGMENT) {
          currentPos.y = GROUND_LEVEL;
          routePoints.push(currentPos.clone());
        }
        
        // Move to position below port
        if (Math.abs(currentPos.x - endPortPos.x) > MIN_SEGMENT || Math.abs(currentPos.z - endPortPos.z) > MIN_SEGMENT) {
          currentPos.x = endPortPos.x;
          currentPos.z = endPortPos.z;
          routePoints.push(currentPos.clone());
        }
        
        // Go up above port
        const approachHeight = endPortPos.y + 2.0;
        currentPos.y = approachHeight;
        routePoints.push(currentPos.clone());
      }
      
      // Final descent to port
      if (Math.abs(currentPos.y - endPortPos.y) > MIN_SEGMENT) {
        currentPos.y = endPortPos.y;
        routePoints.push(currentPos.clone());
      }
      
    } else if (endIsDown) {
      // Downward destination: Move to approach position, then connect
      const approachDir = endDirection.clone().negate();
      const approachPos = endPortPos.clone().add(approachDir.multiplyScalar(PORT_APPROACH_DISTANCE));
      approachPos.y = GROUND_LEVEL;
      
      if (currentPos.distanceTo(approachPos) > MIN_SEGMENT) {
        currentPos.copy(approachPos);
        routePoints.push(currentPos.clone());
      }
      
      // Connect to port
      routePoints.push(endPortPos.clone());
      
    } else {
      // Horizontal destination: Go up to port level, then approach and connect
      
      // Rise to port level
      if (Math.abs(currentPos.y - endPortPos.y) > MIN_SEGMENT) {
        currentPos.y = endPortPos.y;
        routePoints.push(currentPos.clone());
      }
      
      // Move out from port in opposite direction
      const approachDir = endDirection.clone().negate().setY(0).normalize();
      const approachPos = endPortPos.clone().add(approachDir.multiplyScalar(PORT_APPROACH_DISTANCE));
      
      if (currentPos.distanceTo(approachPos) > MIN_SEGMENT) {
        currentPos.copy(approachPos);
        routePoints.push(currentPos.clone());
      }
      
      // Connect to port
      routePoints.push(endPortPos.clone());
    }
    
    // PHASE 6: Clean up route - remove duplicate points
    const cleanedPoints = [];
    for (let i = 0; i < routePoints.length; i++) {
      const point = routePoints[i];
      const lastPoint = cleanedPoints[cleanedPoints.length - 1];
      
      if (!lastPoint || point.distanceTo(lastPoint) > MIN_SEGMENT) {
        cleanedPoints.push(point.clone());
      }
    }
    
    return cleanedPoints;
  }, [startPosition, endPosition, startPort, endPort, objects]);

  // Create pipe segments from route points.
  //
  // The geometry and (for animated types) the flow shader material are
  // built here, once per recalculated route, instead of inline in JSX.
  // They are plain `new THREE.*` objects passed in via a `geometry`/
  // `material` prop rather than declared as `<cylinderGeometry>` JSX
  // children, so react-three-fiber's automatic dispose-on-unmount does
  // NOT cover them — building them fresh on every render (as this used
  // to do) leaked a geometry + a compiled shader per segment per render,
  // which on a route being dragged around adds up fast. The effect below
  // disposes the previous batch whenever this memo produces a new one.
  const segments = useMemo(() => {
    const points = editWaypoints || calculateOptimalRoute;
    const segments: RouteSegment[] = [];

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

        const geometry = new THREE.CylinderGeometry(
          config.radius,
          config.radius,
          length,
          12 // Same resolution for all connection types
        );

        const flowMaterial = config.animated
          ? new THREE.ShaderMaterial({
              uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(config.flowColor) },
                segmentIndex: { value: i }
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
            })
          : null;

        segments.push({
          start: start.clone(),
          end: end.clone(),
          midPoint,
          quaternion,
          length,
          direction: direction.clone(),
          geometry,
          flowMaterial
        });
      }
    }

    return segments;
  }, [calculateOptimalRoute, editWaypoints, config.radius, config.animated, config.flowColor]);

  // Dispose the previous batch of manually-created geometries/materials
  // whenever `segments` is recomputed, and on unmount.
  useEffect(() => {
    return () => {
      segments.forEach((segment) => {
        segment.geometry?.dispose();
        segment.flowMaterial?.dispose();
      });
    };
  }, [segments]);

  // Flow animation
  useFrame((state) => {
    if (!config.animated || !groupRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    // UNIFIED animation for all connection types
    groupRef.current.children.forEach((child, index) => {
      if (child.userData.isFlow && child.material) {
        if (child.material.uniforms) {
          // Shader material animation
          child.material.uniforms.time.value = time + index * 0.5;
        } else {
          // Basic material emissive animation
      const pulse = Math.sin(time * 8) * 0.5 + 0.5;
          child.material.emissive.setScalar(pulse * 0.3);
        }
      }
    });
  });

  const handleClick = (event) => {
    event.stopPropagation();
    onClick?.(event);
  };

  return (
    <group ref={groupRef} onClick={handleClick}>
      {/* Main pipe segments */}
      {segments.map((segment, index) => (
        <group key={`segment-${index}`}>
          {/* Main pipe segment */}
          <mesh
            position={segment.midPoint}
            quaternion={segment.quaternion}
            geometry={segment.geometry}
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
          {config.animated && segment.flowMaterial && (
            <mesh
              position={segment.midPoint}
              quaternion={segment.quaternion}
              geometry={segment.geometry}
              material={segment.flowMaterial}
              userData={{ isFlow: true }}
            />
          )}
        </group>
      ))}
      
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
      
      {/* Connection type indicator - UNIFIED SHAPE FOR ALL TYPES */}
      {segments.length > 0 && (
        <mesh position={[
          (startPosition[0] + endPosition[0]) / 2,
          Math.max(...startPosition, ...endPosition) + 1.5,
          (startPosition[2] + endPosition[2]) / 2
        ]}>
          <sphereGeometry args={[0.08]} />
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