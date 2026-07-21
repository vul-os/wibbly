import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Connection = ({ startPosition, endPosition, startPort, endPort, type = 'liquid', onClick }) => {
  const groupRef = useRef();
  const flowRef = useRef();

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
      animated: true,
      segments: 8
    }
  };

  const config = connectionTypes[type] || connectionTypes.liquid;

  // Create straight pipe path with 90-degree bends
  const { segments, totalLength } = useMemo(() => {
    const start = new THREE.Vector3(...startPosition);
    const end = new THREE.Vector3(...endPosition);
    
    // Add port offsets if provided
    if (startPort) {
      start.add(new THREE.Vector3(...startPort.offset));
    }
    if (endPort) {
      end.add(new THREE.Vector3(...endPort.offset));
    }
    
    const segments = [];
    let totalLength = 0;
    
    // Calculate routing with 90-degree bends
    const midHeight = Math.max(start.y, end.y) + 1.5;
    
    // Route: Start -> Up -> Horizontal -> Down -> End
    const point1 = new THREE.Vector3(start.x, start.y, start.z);
    const point2 = new THREE.Vector3(start.x, midHeight, start.z);
    const point3 = new THREE.Vector3(end.x, midHeight, end.z);
    const point4 = new THREE.Vector3(end.x, end.y, end.z);
    
    const points = [point1, point2, point3, point4];
    
    // Create straight segments between points
    for (let i = 0; i < points.length - 1; i++) {
      const segmentStart = points[i];
      const segmentEnd = points[i + 1];
      const direction = new THREE.Vector3().subVectors(segmentEnd, segmentStart);
      const length = direction.length();
      
      if (length > 0.01) { // Only create segment if meaningful length
        direction.normalize();
        
        segments.push({
          start: segmentStart.clone(),
          end: segmentEnd.clone(),
          direction: direction.clone(),
          length: length
        });
        
        totalLength += length;
      }
    }
    
    return { segments, totalLength };
  }, [startPosition, endPosition, startPort, endPort]);

  // Flow animation
  useFrame((state) => {
    if (config.animated && flowRef.current) {
      const time = state.clock.elapsedTime;
      
      if (type === 'electric') {
        // Pulse effect for electric connections
        const pulse = Math.sin(time * 8) * 0.5 + 0.5;
        flowRef.current.children.forEach(child => {
          if (child.material) {
            child.material.emissive.setScalar(pulse * 0.3);
          }
        });
      } else {
        // Flow animation for liquid/gas
        flowRef.current.children.forEach((child, index) => {
          if (child.material && child.material.uniforms) {
            child.material.uniforms.time.value = time + index * 0.5;
          }
        });
      }
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

  return (
    <group ref={groupRef} onClick={onClick}>
      {/* Main pipe segments */}
      {segments.map((segment, index) => {
        const segmentGeometry = new THREE.CylinderGeometry(
          config.radius, 
          config.radius, 
          segment.length, 
          type === 'electric' ? 6 : 12
        );
        
        // Position and orient the segment
        const midPoint = new THREE.Vector3().addVectors(segment.start, segment.end).multiplyScalar(0.5);
        
        // Calculate rotation to align with segment direction
        const up = new THREE.Vector3(0, 1, 0);
        const quaternion = new THREE.Quaternion().setFromUnitVectors(up, segment.direction);
        
        return (
          <group key={`segment-${index}`}>
            {/* Main pipe segment */}
            <mesh
              position={midPoint}
              quaternion={quaternion}
              geometry={segmentGeometry}
              castShadow
              receiveShadow
            >
              <meshLambertMaterial color={config.color} />
            </mesh>
            
            {/* Flow animation segment */}
            {config.animated && (
              <mesh
                position={midPoint}
                quaternion={quaternion}
                geometry={segmentGeometry}
                material={createFlowMaterial(index)}
              />
            )}
          </group>
        );
      })}
      
      {/* 90-degree elbow joints */}
      {segments.length > 1 && segments.slice(0, -1).map((segment, index) => {
        const jointPosition = segment.end;
        return (
          <mesh key={`joint-${index}`} position={jointPosition}>
            <sphereGeometry args={[config.radius * 1.2, 8, 8]} />
            <meshLambertMaterial color={config.color} />
          </mesh>
        );
      })}
      
      {/* Connection type indicators */}
      {type === 'electric' && (
        <mesh position={[
          (startPosition[0] + endPosition[0]) / 2,
          Math.max(...startPosition, ...endPosition) + 2,
          (startPosition[2] + endPosition[2]) / 2
        ]}>
          <octahedronGeometry args={[0.1]} />
          <meshLambertMaterial color="#FFEB3B" />
        </mesh>
      )}
      
      {type === 'gas' && (
        <mesh position={[
          (startPosition[0] + endPosition[0]) / 2,
          Math.max(...startPosition, ...endPosition) + 2,
          (startPosition[2] + endPosition[2]) / 2
        ]}>
          <coneGeometry args={[0.08, 0.2, 6]} />
          <meshLambertMaterial color="#FFC107" />
        </mesh>
      )}
      
      {type === 'liquid' && (
        <mesh position={[
          (startPosition[0] + endPosition[0]) / 2,
          Math.max(...startPosition, ...endPosition) + 2,
          (startPosition[2] + endPosition[2]) / 2
        ]} rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[0.1, 0.3, 4]} />
          <meshLambertMaterial color="#2196F3" />
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
    </group>
  );
};

export default Connection; 