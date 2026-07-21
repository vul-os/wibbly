import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';

const PressureVessel = ({ position, selected, onClick, showCoordinates }) => {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current && selected) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group 
      ref={groupRef} 
      position={position} 
      onClick={onClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
      }}
    >
      {/* Main vessel body - cylindrical */}
      <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.2, 1.2, 4, 32]} />
        <meshLambertMaterial color={selected ? "#4CAF50" : "#546E7A"} />
      </mesh>

      {/* Top hemisphere cap */}
      <mesh position={[0, 4.8, 0]} castShadow receiveShadow>
        <sphereGeometry args={[1.2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshLambertMaterial color={selected ? "#66BB6A" : "#607D8B"} />
      </mesh>

      {/* Bottom hemisphere cap */}
      <mesh position={[0, 0.2, 0]} rotation={[Math.PI, 0, 0]} castShadow receiveShadow>
        <sphereGeometry args={[1.2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshLambertMaterial color={selected ? "#66BB6A" : "#607D8B"} />
      </mesh>

      {/* Pressure gauge */}
      <mesh position={[1.3, 3.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
        <meshLambertMaterial color="#37474F" />
      </mesh>
      
      {/* Gauge face */}
      <mesh position={[1.4, 3.5, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.05, 16]} />
        <meshLambertMaterial color="#FFFFFF" />
      </mesh>

      {/* Safety valve */}
      <mesh position={[0, 5.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.1, 0.15, 0.4, 16]} />
        <meshLambertMaterial color="#F44336" />
      </mesh>

      {/* Inlet valve */}
      <mesh position={[-1.3, 2, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.3, 16]} />
        <meshLambertMaterial color="#424242" />
      </mesh>

      {/* Outlet valve */}
      <mesh position={[1.3, 1, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.3, 16]} />
        <meshLambertMaterial color="#424242" />
      </mesh>

      {/* Drain valve at bottom */}
      <mesh position={[0, 0.1, 1.1]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.2, 16]} />
        <meshLambertMaterial color="#424242" />
      </mesh>

      {/* Support legs */}
      <mesh position={[-0.8, 0.25, 0.8]} castShadow receiveShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.5, 8]} />
        <meshLambertMaterial color="#37474F" />
      </mesh>
      <mesh position={[0.8, 0.25, 0.8]} castShadow receiveShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.5, 8]} />
        <meshLambertMaterial color="#37474F" />
      </mesh>
      <mesh position={[-0.8, 0.25, -0.8]} castShadow receiveShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.5, 8]} />
        <meshLambertMaterial color="#37474F" />
      </mesh>
      <mesh position={[0.8, 0.25, -0.8]} castShadow receiveShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.5, 8]} />
        <meshLambertMaterial color="#37474F" />
      </mesh>

      {/* Warning stripes */}
      <mesh position={[0, 4.2, 1.21]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 0.3, 0.01]} />
        <meshLambertMaterial color="#FFC107" />
      </mesh>
      <mesh position={[0, 3.8, 1.21]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 0.15, 0.01]} />
        <meshLambertMaterial color="#F44336" />
      </mesh>

      {/* Nameplate */}
      <mesh position={[0, 3, 1.21]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.4, 0.01]} />
        <meshLambertMaterial color="#ECEFF1" />
      </mesh>

      {/* Selection indicator */}
      {selected && (
        <mesh position={[0, 2.5, 0]}>
          <cylinderGeometry args={[1.5, 1.5, 4.2, 32]} />
          <meshLambertMaterial 
            color="#4CAF50" 
            transparent 
            opacity={0.2} 
            wireframe
          />
        </mesh>
      )}

      {/* Coordinate display */}
      {showCoordinates && (
        <Text
          position={[0, 5.8, 0]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {`(${position[0]}, ${position[2]})`}
        </Text>
      )}

      {/* Collision box for clicking */}
      <mesh position={[0, 2.5, 0]} visible={false}>
        <boxGeometry args={[2.8, 5.5, 2.8]} />
        <meshLambertMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
};

export default PressureVessel; 