import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import type { PlantObjectProps } from './types';

interface DayTankProps extends PlantObjectProps {
  position: [number, number, number];
  // PlantScene's commonProps only ever sets `isSelected`, never `selected` —
  // this component reads a prop name PlantScene never passes, so `selected`
  // (and therefore the highlight/rotation below) is always undefined/off
  // when driven from the scene. Pre-existing mismatch, not fixed here.
  selected?: boolean;
}

const DayTank = ({ position, selected, onClick, showCoordinates }: DayTankProps) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current && selected) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group 
      ref={groupRef}
      position={position}
      onClick={(e) => onClick?.(e)}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
      }}
    >
      {/* Support platform base */}
      <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.8, 1.8, 0.2, 32]} />
        <meshLambertMaterial color={selected ? "#8D6E63" : "#5D4037"} />
      </mesh>

      {/* Support legs */}
      <mesh position={[-1.2, 0.4, 1.2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.8, 8]} />
        <meshLambertMaterial color="#424242" />
      </mesh>
      <mesh position={[1.2, 0.4, 1.2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.8, 8]} />
        <meshLambertMaterial color="#424242" />
      </mesh>
      <mesh position={[-1.2, 0.4, -1.2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.8, 8]} />
        <meshLambertMaterial color="#424242" />
      </mesh>
      <mesh position={[1.2, 0.4, -1.2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.8, 8]} />
        <meshLambertMaterial color="#424242" />
      </mesh>

      {/* Main tank body - cylindrical */}
      <mesh position={[0, 2.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.0, 1.0, 2.5, 32]} />
        <meshLambertMaterial color={selected ? "#A1887F" : "#6D4C41"} />
      </mesh>

      {/* Tank top dome */}
      <mesh position={[0, 3.6, 0]} castShadow receiveShadow>
        <sphereGeometry args={[1.0, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshLambertMaterial color={selected ? "#BCAAA4" : "#795548"} />
      </mesh>

      {/* Level sight glass */}
      <mesh position={[1.05, 2.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.1, 2.0, 0.2]} />
        <meshLambertMaterial color="#E3F2FD" transparent opacity={0.7} />
      </mesh>

      {/* Level indicator markings */}
      <mesh position={[1.1, 3.0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.05, 0.1, 0.01]} />
        <meshLambertMaterial color="#F44336" />
      </mesh>
      <mesh position={[1.1, 2.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.05, 0.1, 0.01]} />
        <meshLambertMaterial color="#FF9800" />
      </mesh>
      <mesh position={[1.1, 2.0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.05, 0.1, 0.01]} />
        <meshLambertMaterial color="#4CAF50" />
      </mesh>
      <mesh position={[1.1, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.05, 0.1, 0.01]} />
        <meshLambertMaterial color="#2196F3" />
      </mesh>

      {/* Fill inlet on top */}
      <mesh position={[0, 4.0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.3, 16]} />
        <meshLambertMaterial color="#37474F" />
      </mesh>

      {/* Fill cap */}
      <mesh position={[0, 4.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.18, 0.18, 0.1, 16]} />
        <meshLambertMaterial color="#263238" />
      </mesh>

      {/* Dispensing nozzle */}
      <mesh position={[-1.1, 1.5, 0]} rotation={[0, 0, Math.PI / 4]} castShadow receiveShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.4, 16]} />
        <meshLambertMaterial color="#424242" />
      </mesh>

      {/* Dispensing valve handle */}
      <mesh position={[-1.3, 1.3, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.2, 8]} />
        <meshLambertMaterial color="#FF5722" />
      </mesh>

      {/* Overflow pipe */}
      <mesh position={[0, 3.3, 1.05]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.3, 16]} />
        <meshLambertMaterial color="#424242" />
      </mesh>

      {/* Drain valve at bottom */}
      <mesh position={[0, 1.0, 1.05]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.2, 16]} />
        <meshLambertMaterial color="#424242" />
      </mesh>

      {/* Access ladder */}
      <mesh position={[-1.05, 2.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.05, 3.0, 0.05]} />
        <meshLambertMaterial color="#616161" />
      </mesh>
      
      {/* Ladder rungs */}
      <mesh position={[-1.0, 1.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.15, 0.03, 0.03]} />
        <meshLambertMaterial color="#616161" />
      </mesh>
      <mesh position={[-1.0, 2.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.15, 0.03, 0.03]} />
        <meshLambertMaterial color="#616161" />
      </mesh>
      <mesh position={[-1.0, 2.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.15, 0.03, 0.03]} />
        <meshLambertMaterial color="#616161" />
      </mesh>
      <mesh position={[-1.0, 3.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.15, 0.03, 0.03]} />
        <meshLambertMaterial color="#616161" />
      </mesh>

      {/* Level transmitter */}
      <mesh position={[0, 3.8, 0.8]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 0.2, 0.3]} />
        <meshLambertMaterial color="#37474F" />
      </mesh>

      {/* Level transmitter display */}
      <mesh position={[0, 3.8, 1.0]} castShadow receiveShadow>
        <boxGeometry args={[0.15, 0.15, 0.05]} />
        <meshLambertMaterial color="#4CAF50" />
      </mesh>

      {/* Tank nameplate */}
      <mesh position={[0, 2.5, 1.05]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 0.3, 0.01]} />
        <meshLambertMaterial color="#ECEFF1" />
      </mesh>

      {/* Warning sign */}
      <mesh position={[0.8, 2.8, 0.8]} rotation={[0, Math.PI / 4, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 0.3, 0.02]} />
        <meshLambertMaterial color="#FFC107" />
      </mesh>

      {/* Selection indicator */}
      {selected && (
        <mesh position={[0, 2.2, 0]}>
          <cylinderGeometry args={[1.3, 1.3, 2.8, 32]} />
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
          position={[0, 4.8, 0]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {`(${position[0]}, ${position[2]})`}
        </Text>
      )}

      {/* Collision box for clicking */}
      <mesh position={[0, 2.2, 0]} visible={false}>
        <boxGeometry args={[2.5, 4.5, 2.5]} />
        <meshLambertMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
};

export default DayTank; 