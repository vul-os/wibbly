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

  // Professional plumbing-style auto-routing algorithm with object-specific clearances
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

    console.log('🔌 ROUTING DEBUG START');
    console.log('📍 Start pos:', startPosition, 'Port pos:', startPortPos.toArray());
    console.log('📍 End pos:', endPosition, 'Port pos:', endPortPos.toArray());
    console.log('🎯 Start port direction:', startPort?.direction, 'End port direction:', endPort?.direction);
    console.log('🔗 Connection type:', type);

    // Enhanced object footprints with realistic 3D dimensions
    const OBJECT_FOOTPRINTS = {
      boiler: { radius: 1.4, height: 3.5, clearance: 1.6 }, // Further reduced clearance
      pump: { width: 1.6, depth: 1.2, height: 1.0, clearance: 1.4 }, // Further reduced clearance
      valve: { radius: 0.8, height: 1.5, clearance: 1.2 }, // Further reduced clearance
      powerBox: { width: 1.2, depth: 0.8, height: 1.5, clearance: 1.4 }, // Further reduced clearance
      sensor: { radius: 0.4, height: 0.8, clearance: 0.8 },
      controlUnit: { width: 1.0, depth: 0.6, height: 1.2, clearance: 1.1 }, // Further reduced clearance
      conveyorBelt: { width: 8.0, depth: 1.5, height: 1.0, clearance: 4.0 } // Further reduced clearance
    };

    // Professional routing constants - SAME FOR ALL CONNECTION TYPES
    const GROUND_LEVEL = 0.3;
    const MIN_PORT_CLEARANCE = 1.2; // Reduced
    const VERTICAL_CLEARANCE = 3.0; // Reduced
    const MIN_SEGMENT = 0.15;
    const SHORT_DISTANCE_THRESHOLD = 6.0; // Reduced to force more proper routing
    const DEPARTURE_MULTIPLIER = 1.0; // Reduced to stay closer to objects
    const SAFETY_HEIGHT_BUFFER = 0.8; // Reduced
    
    const routePoints = [];
    
    // Enhanced port direction analysis
    const startDirection = startPort ? 
      new THREE.Vector3(...startPort.direction).normalize() : 
      new THREE.Vector3(1, 0, 0);
    const endDirection = endPort ? 
      new THREE.Vector3(...endPort.direction).normalize() : 
      new THREE.Vector3(-1, 0, 0);
    
    const toDestination = new THREE.Vector3().subVectors(endPortPos, startPortPos);
    const totalDistance = toDestination.length();
    toDestination.normalize();
    
    console.log('🧭 Start direction:', startDirection.toArray());
    console.log('🧭 End direction:', endDirection.toArray()); 
    console.log('🧭 To destination:', toDestination.toArray(), 'Distance:', totalDistance.toFixed(2));
    
    // Analyze port orientations
    const startIsUp = startDirection.y > 0.6;
    const startIsDown = startDirection.y < -0.6;
    const endIsUp = endDirection.y > 0.6;
    const endIsDown = endDirection.y < -0.6;
    
    console.log('📊 Port analysis - Start: up=' + startIsUp + ', down=' + startIsDown + ' | End: up=' + endIsUp + ', down=' + endIsDown);
    
    // Enhanced 3D object analysis with proper footprint collision detection
    const createObjectAnalysis = (objPosition, objType) => {
      const footprint = OBJECT_FOOTPRINTS[objType] || { radius: 1.0, height: 2.0, clearance: 1.5 };
      const pos = new THREE.Vector3(...objPosition);
      
      return {
        position: pos,
        type: objType,
        footprint: footprint,
        
        // Get 3D collision boundary
        getCollisionBounds: () => {
          const bounds = {
            center: pos.clone(),
            minY: pos.y - (footprint.height || 2.0) / 2,
            maxY: pos.y + (footprint.height || 2.0) / 2
          };
          
          if (footprint.radius) {
            bounds.radius = footprint.radius;
            bounds.type = 'cylinder';
          } else {
            bounds.width = footprint.width || 1.0;
            bounds.depth = footprint.depth || 1.0;
            bounds.type = 'box';
          }
          
          return bounds;
        },
        
        // Get clearance zone (includes safety buffer)
        getClearanceRadius: () => footprint.clearance,
        
        // Check if a 3D path segment intersects with this object's footprint
        intersectsPath: (pathStart, pathEnd, pathRadius = 0.1) => {
          const bounds = this.getCollisionBounds();
          const pathDir = new THREE.Vector3().subVectors(pathEnd, pathStart);
          const pathLength = pathDir.length();
          
          if (pathLength < 0.01) return false;
          
          pathDir.normalize();
          
          // Check vertical overlap first
          const minPathY = Math.min(pathStart.y, pathEnd.y) - pathRadius;
          const maxPathY = Math.max(pathStart.y, pathEnd.y) + pathRadius;
          
          if (maxPathY < bounds.minY || minPathY > bounds.maxY) {
            return false; // No vertical overlap
          }
          
          // Check horizontal collision
          const toObj = new THREE.Vector3().subVectors(bounds.center, pathStart);
          const projection = toObj.dot(pathDir);
          const clampedProjection = Math.max(0, Math.min(pathLength, projection));
          
          const closestPoint = pathStart.clone().add(pathDir.clone().multiplyScalar(clampedProjection));
          const horizontalDistance = Math.sqrt(
            Math.pow(bounds.center.x - closestPoint.x, 2) + 
            Math.pow(bounds.center.z - closestPoint.z, 2)
          );
          
          const collisionRadius = bounds.type === 'cylinder' ? 
            bounds.radius : 
            Math.max(bounds.width, bounds.depth) / 2;
          
          return horizontalDistance < (collisionRadius + pathRadius + 0.2);
        },
        
        // Check if path passes through clearance zone
        blocksPath: (pathStart, pathEnd, buffer = 0) => {
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
          
          const distance = pos.distanceTo(closestPoint);
          return distance < clearanceRadius;
        }
      };
    };
    
    // Analyze ALL objects in scene (including source and destination)
    const allObjects = objects.map(obj => createObjectAnalysis(obj.position, obj.type));
    
    // Find source and destination objects
    const sourceObj = allObjects.find(obj => obj.position.distanceTo(start) < 0.5) || 
      createObjectAnalysis(startPosition, 'generic');
    const destObj = allObjects.find(obj => obj.position.distanceTo(end) < 0.5) || 
      createObjectAnalysis(endPosition, 'generic');
    
    // Advanced collision detection functions
    const isPath3DClear = (fromPos, toPos, pathRadius = 0.1, excludeObjects = []) => {
      for (const obj of allObjects) {
        // Skip excluded objects (usually source/dest when checking departure/approach)
        if (excludeObjects.some(excluded => obj.position.distanceTo(excluded.position) < 0.5)) {
          continue;
        }
        
        if (obj.intersectsPath(fromPos, toPos, pathRadius)) {
          return false;
        }
      }
      return true;
    };
    
    const isPathClearOfClearanceZones = (fromPos, toPos, buffer = 0.1, excludeObjects = []) => {
      console.log('🔍 Checking path clearance from', fromPos.toArray(), 'to', toPos.toArray(), 'buffer:', buffer);
      
      for (const obj of allObjects) {
        // Skip excluded objects
        if (excludeObjects.some(excluded => obj.position.distanceTo(excluded.position) < 0.5)) {
          console.log('  ⏭️ Skipping excluded object at', obj.position.toArray());
          continue;
        }
        
        if (obj.blocksPath(fromPos, toPos, buffer)) {
          console.log('  ❌ BLOCKED by object at', obj.position.toArray(), 'type:', obj.type, 'clearance:', obj.footprint.clearance);
          return false;
        } else {
          console.log('  ✅ Clear of object at', obj.position.toArray(), 'type:', obj.type);
        }
      }
      console.log('  ✅ Path completely clear');
      return true;
    };
    
    const findMinimumSafeHeight = (fromPos, toPos, excludeObjects = []) => {
      let safeHeight = GROUND_LEVEL;
      
      for (const obj of allObjects) {
        // Skip excluded objects
        if (excludeObjects.some(excluded => obj.position.distanceTo(excluded.position) < 0.5)) {
          continue;
        }
        
        if (obj.blocksPath(
          new THREE.Vector3(fromPos.x, GROUND_LEVEL, fromPos.z),
          new THREE.Vector3(toPos.x, GROUND_LEVEL, toPos.z),
          0.2
        )) {
          const requiredHeight = obj.position.y + (obj.footprint.height || 2.0) / 2 + VERTICAL_CLEARANCE;
          safeHeight = Math.max(safeHeight, requiredHeight);
        }
      }
      
      return safeHeight;
    };
    
    // START SMART ROUTING ALGORITHM - UNIFIED FOR ALL CONNECTION TYPES
    
    // 1. Initialize routing - ALL CONNECTIONS USE SAME LOGIC
    routePoints.push(startPortPos.clone());
    let currentPos = startPortPos.clone();
    
    // 2. PHASE 1: UNIFIED departure from source - ALWAYS AIM FOR GROUND LEVEL
    let departureDirection;
    let departureDistance = sourceObj.getClearanceRadius();
    
    console.log('🚀 PHASE 1 - UNIFIED Departure (Ground-Preferred)');
    console.log('📏 Departure distance:', departureDistance.toFixed(2));
    
    // UNIFIED APPROACH: Always try to get to ground level as quickly as possible
    // regardless of port type - only differ in initial departure direction
    
    if (startIsUp) {
      console.log('⬆️ Upward port - rise then ground route');
      // Upward port: Go up first, then horizontal toward destination
      const riseHeight = Math.max(MIN_PORT_CLEARANCE * 2.5, 3.0);
      currentPos.y += riseHeight;
      routePoints.push(currentPos.clone());
      console.log('📈 Rose to height:', currentPos.y.toFixed(2));
      
      // Choose best horizontal direction toward destination
      departureDirection = toDestination.clone().setY(0).normalize();
      console.log('🧭 Direction toward destination:', departureDirection.toArray());
      
    } else if (startIsDown) {
      console.log('⬇️ Downward port - brief descent then ground route');
      // Downward port: Brief descent then horizontal toward destination
      currentPos.y -= MIN_PORT_CLEARANCE;
      routePoints.push(currentPos.clone());
      departureDirection = toDestination.clone().setY(0).normalize();
      console.log('📉 Descended to:', currentPos.y.toFixed(2), 'Direction:', departureDirection.toArray());
      
    } else {
      console.log('➡️ Horizontal port - UNIFIED ground-level routing');
      // UNIFIED HORIZONTAL LOGIC: All horizontal ports use same ground-preferred approach
      // No special treatment for electrical vs liquid - all aim for destination
      
      const destDir = toDestination.clone().setY(0).normalize();
      const portDir = startDirection.clone().setY(0).normalize();
      
      // Test destination direction first (prioritize ground routing)
      const testDest = currentPos.clone().add(destDir.clone().multiplyScalar(departureDistance));
      const destClear = isPathClearOfClearanceZones(currentPos, testDest, 0.2, [sourceObj]);
      
      console.log('🔍 Destination direction clear:', destClear);
      
      if (destClear) {
        // Destination direction is clear - use it (promotes ground routing)
        departureDirection = destDir;
        console.log('✅ Using destination direction for ground routing');
      } else {
        // Destination blocked - try port direction, but still blend toward destination
        const testPort = currentPos.clone().add(portDir.clone().multiplyScalar(departureDistance));
        const portClear = isPathClearOfClearanceZones(currentPos, testPort, 0.2, [sourceObj]);
        
        if (portClear) {
          // Blend port direction with destination direction (50/50 for unified behavior)
          departureDirection = portDir.lerp(destDir, 0.5).normalize();
          console.log('✅ Blending port and destination directions:', departureDirection.toArray());
        } else {
          // Both blocked - just use destination direction anyway
          departureDirection = destDir;
          console.log('⚠️ Both blocked, forcing destination direction');
        }
      }
    }
    
    // Apply departure movement - IDENTICAL FOR ALL CONNECTION TYPES
    const beforeDeparture = currentPos.clone();
    currentPos.add(departureDirection.multiplyScalar(departureDistance * DEPARTURE_MULTIPLIER));
    routePoints.push(currentPos.clone());
    console.log('🚀 Departed from:', beforeDeparture.toArray(), 'to:', currentPos.toArray());
    
    // PHASE 1.5: MANDATORY ground descent for ALL connection types
    console.log('🌍 PHASE 1.5 - MANDATORY Ground descent for all types');
    console.log('📏 Current height:', currentPos.y.toFixed(2), 'Ground level:', GROUND_LEVEL);
    
    // FORCE all connections to ground level after departure (unless starting from upward port)
    if (!startIsUp && Math.abs(currentPos.y - GROUND_LEVEL) > MIN_SEGMENT) {
      console.log('⬇️ Forcing descent to ground level for unified routing');
      currentPos.y = GROUND_LEVEL;
      routePoints.push(currentPos.clone());
      console.log('✅ Now at ground level:', currentPos.toArray());
    } else if (startIsUp) {
      console.log('ℹ️ Upward port - will descend after horizontal movement');
    } else {
      console.log('ℹ️ Already near ground level');
    }
    
    // 4. PHASE 2: Calculate optimal destination approach
    let destApproachPos;
    const destClearance = destObj.getClearanceRadius();
    
    if (endIsUp) {
      // Upward destination: approach from optimal angle at ground level
      const approachDirections = [
        toDestination.clone().negate().setY(0).normalize(),
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(-1, 0, 0),
        new THREE.Vector3(0, 0, -1)
      ];
      
      let bestApproach = approachDirections[0];
      let bestApproachScore = -1;
      
      for (const dir of approachDirections) {
        const testPos = end.clone().add(dir.clone().multiplyScalar(destClearance));
        testPos.y = GROUND_LEVEL;
        
        const clearance = isPathClearOfClearanceZones(testPos, currentPos, 0.2, [destObj]) ? 1 : 0;
        const alignment = dir.dot(toDestination.clone().negate());
        const portAlignment = dir.dot(endDirection.clone().negate()); // Prefer approaches opposite to port
        const score = clearance + alignment * 0.3 + portAlignment * 0.7;
        
        if (score > bestApproachScore) {
          bestApproachScore = score;
          bestApproach = dir;
        }
      }
      
      destApproachPos = end.clone().add(bestApproach.clone().multiplyScalar(destClearance));
      destApproachPos.y = GROUND_LEVEL;
      
    } else if (endIsDown) {
      // Downward destination: approach from above, respecting port direction
      const approachDir = endDirection.clone().negate();
      destApproachPos = endPortPos.clone().add(approachDir.multiplyScalar(destClearance));
      destApproachPos.y = Math.max(destApproachPos.y, GROUND_LEVEL + 0.5);
      
    } else {
      // UNIFIED HORIZONTAL DESTINATION: All horizontal ports get same ground-level approach
      console.log('🎯 Horizontal destination - unified ground approach');
      const approachDir = endDirection.clone().negate().setY(0).normalize();
      destApproachPos = endPortPos.clone().add(approachDir.multiplyScalar(destClearance));
      destApproachPos.y = GROUND_LEVEL;
      console.log('📍 Approach position:', destApproachPos.toArray());
    }
    
    // 5. PHASE 3: UNIFIED routing strategy - ALWAYS PREFER GROUND LEVEL
    console.log('🎯 PHASE 3 - UNIFIED Routing strategy (Ground-Preferred)');
    console.log('📍 Current pos:', currentPos.toArray());
    console.log('📍 Dest approach pos:', destApproachPos.toArray());
    
    // UNIFIED GROUND-LEVEL PREFERENCE: All connection types prefer ground routing
    const groundPathClear = isPathClearOfClearanceZones(currentPos, destApproachPos, 0.02);
    let routingHeight = GROUND_LEVEL;
    let needsElevation = false;
    
    console.log('🔍 Ground path clear:', groundPathClear);
    
    if (!groundPathClear) {
      needsElevation = true;
      routingHeight = findMinimumSafeHeight(currentPos, destApproachPos);
      routingHeight += SAFETY_HEIGHT_BUFFER;
      
      console.log('⚠️ Ground blocked - elevation needed for all types');
      console.log('📈 Safe height:', (routingHeight - SAFETY_HEIGHT_BUFFER).toFixed(2), '+ buffer:', SAFETY_HEIGHT_BUFFER, '= total:', routingHeight.toFixed(2));
    } else {
      console.log('✅ Ground clear - unified ground routing for all types');
    }
    
    // 6. PHASE 4: UNIFIED horizontal routing - IDENTICAL FOR ALL CONNECTION TYPES
    const targetHeight = needsElevation ? routingHeight : GROUND_LEVEL;
    
    console.log('🎯 PHASE 4 - UNIFIED Horizontal routing');
    console.log('📏 Target height:', targetHeight.toFixed(2), '(elevated:', needsElevation + ')');
    
    // Ensure we're at the target routing height
    if (Math.abs(currentPos.y - targetHeight) > MIN_SEGMENT) {
      console.log('📏 Height adjustment needed from', currentPos.y.toFixed(2), 'to', targetHeight.toFixed(2));
      currentPos.y = targetHeight;
      routePoints.push(currentPos.clone());
      console.log('✅ Height adjusted to:', currentPos.toArray());
    } else {
      console.log('ℹ️ Already at target height');
    }
    
    // UNIFIED L-shaped routing with collision avoidance - SAME FOR ALL TYPES
    const deltaX = destApproachPos.x - currentPos.x;
    const deltaZ = destApproachPos.z - currentPos.z;
    
    // Test both routing orders with same collision buffers for all types
    const xFirstPos = new THREE.Vector3(destApproachPos.x, targetHeight, currentPos.z);
    const zFirstPos = new THREE.Vector3(currentPos.x, targetHeight, destApproachPos.z);
    
    const xFirstClear = isPathClearOfClearanceZones(currentPos, xFirstPos, 0.05) &&
                        isPathClearOfClearanceZones(xFirstPos, destApproachPos, 0.05);
    const zFirstClear = isPathClearOfClearanceZones(currentPos, zFirstPos, 0.05) &&
                        isPathClearOfClearanceZones(zFirstPos, destApproachPos, 0.05);
    
    // UNIFIED routing order selection - same logic for all connection types
    let routeXFirst = Math.abs(deltaX) > Math.abs(deltaZ);
    if (xFirstClear && !zFirstClear) routeXFirst = true;
    if (!xFirstClear && zFirstClear) routeXFirst = false;
    
    // Execute unified routing order
    if (routeXFirst) {
      if (Math.abs(deltaX) > MIN_SEGMENT) {
        currentPos.x = destApproachPos.x;
        routePoints.push(currentPos.clone());
      }
      if (Math.abs(deltaZ) > MIN_SEGMENT) {
        currentPos.z = destApproachPos.z;
        routePoints.push(currentPos.clone());
      }
    } else {
      if (Math.abs(deltaZ) > MIN_SEGMENT) {
        currentPos.z = destApproachPos.z;
        routePoints.push(currentPos.clone());
      }
      if (Math.abs(deltaX) > MIN_SEGMENT) {
        currentPos.x = destApproachPos.x;
        routePoints.push(currentPos.clone());
      }
    }
    
    // 7. PHASE 5: UNIFIED ground return - SAME FOR ALL CONNECTION TYPES
    console.log('🌍 PHASE 5 - UNIFIED Ground return');
    if (Math.abs(currentPos.y - GROUND_LEVEL) > MIN_SEGMENT && !endIsUp) {
      const testDescend = new THREE.Vector3(currentPos.x, GROUND_LEVEL, currentPos.z);
      // Use same small buffer for all connection types
      if (isPathClearOfClearanceZones(testDescend, destApproachPos, 0.05, [destObj])) {
        console.log('⬇️ Unified ground return for all types');
        currentPos.y = GROUND_LEVEL;
        routePoints.push(currentPos.clone());
      }
    }
    
    // 8. PHASE 6: Final approach to destination - IDENTICAL FOR ALL TYPES
    if (endIsUp) {
      // Ensure ground level approach
      if (Math.abs(currentPos.y - GROUND_LEVEL) > MIN_SEGMENT) {
        currentPos.y = GROUND_LEVEL;
        routePoints.push(currentPos.clone());
      }
      
      // Vertical rise
      const riseHeight = endPortPos.y + MIN_PORT_CLEARANCE * 2.5;
      currentPos.y = riseHeight;
      routePoints.push(currentPos.clone());
      
      // Position above port
      if (currentPos.distanceTo(new THREE.Vector3(endPortPos.x, riseHeight, endPortPos.z)) > MIN_SEGMENT) {
        currentPos.x = endPortPos.x;
        currentPos.z = endPortPos.z;
        routePoints.push(currentPos.clone());
      }
      
      // Descend to port
      if (Math.abs(currentPos.y - endPortPos.y) > MIN_SEGMENT) {
        currentPos.y = endPortPos.y;
        routePoints.push(currentPos.clone());
      }
    } else {
      // Direct approach for horizontal/downward ports
      if (currentPos.distanceTo(destApproachPos) > MIN_SEGMENT) {
        routePoints.push(destApproachPos.clone());
        currentPos.copy(destApproachPos);
      }
      
      // Final connection
      if (currentPos.distanceTo(endPortPos) > MIN_SEGMENT) {
        routePoints.push(endPortPos.clone());
      }
    }
    
    // 9. PHASE 7: Optimize and clean up - SAME FOR ALL TYPES
    const optimizedPoints = [];
    
    for (let i = 0; i < routePoints.length; i++) {
      const point = routePoints[i];
      const lastPoint = optimizedPoints[optimizedPoints.length - 1];
      
      if (!lastPoint || point.distanceTo(lastPoint) > MIN_SEGMENT) {
        optimizedPoints.push(point.clone());
      }
    }
    
    // Ensure exact destination
    const finalPoint = optimizedPoints[optimizedPoints.length - 1];
    if (!finalPoint || finalPoint.distanceTo(endPortPos) > MIN_SEGMENT) {
      optimizedPoints.push(endPortPos.clone());
    }
    
    console.log('🏁 FINAL ROUTE:');
    optimizedPoints.forEach((point, i) => {
      console.log(`  ${i}: [${point.x.toFixed(2)}, ${point.y.toFixed(2)}, ${point.z.toFixed(2)}]`);
    });
    console.log('📊 Route summary - Total points:', optimizedPoints.length, 'Ground level points:', 
      optimizedPoints.filter(p => Math.abs(p.y - GROUND_LEVEL) < 0.1).length);
    console.log('🔌 ROUTING DEBUG END\n');
    
    return optimizedPoints;
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

  // Create flow material for animated segments - UNIFIED FOR ALL TYPES
  const createFlowMaterial = (segmentIndex) => {
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
          12  // Same resolution for all connection types
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