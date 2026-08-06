import { forwardRef, useImperativeHandle } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

export interface GestureRaycastHandle {
  /**
   * Viewport client (x, y) pixels -> ground-plane (y=0) world (x, z), or
   * null if the ray does not hit the ground (camera looking above the
   * horizon, degenerate frame, ...). Same raycast-onto-ground-plane the
   * mouse drag path already does per-object (see objects/Pump.tsx's own
   * `handlePointerMove` — this is the identical `THREE.Plane` +
   * `Raycaster.intersectPlane` call, just addressable from outside a
   * specific object's drag handler so "pinch to place" can use it for a
   * NEW object that does not exist yet).
   */
  screenToGround(clientX: number, clientY: number): { x: number; z: number } | null;
}

/**
 * A ref-exposed bridge between `useThree()` (only callable from inside
 * `<Canvas>`) and the gesture layer's `PlacementRouter`, which runs outside
 * the R3F tree entirely (it is driven by `HandInput`'s gesture stream, not
 * by React Three Fiber events). Renders nothing — same
 * `forwardRef`/`useImperativeHandle` pattern `PlantScene` already uses for
 * its own `PlantSceneHandle`.
 */
const GestureRaycastBridge = forwardRef<GestureRaycastHandle>((_props, ref) => {
  const { camera, gl } = useThree();

  useImperativeHandle(ref, () => ({
    screenToGround: (clientX, clientY) => {
      const rect = gl.domElement.getBoundingClientRect();
      const ndc = new THREE.Vector2(
        ((clientX - rect.left) / rect.width) * 2 - 1,
        -((clientY - rect.top) / rect.height) * 2 + 1,
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(ndc, camera);

      const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const hit = new THREE.Vector3();
      if (!raycaster.ray.intersectPlane(groundPlane, hit)) return null;
      return { x: hit.x, z: hit.z };
    },
  }));

  return null;
});

GestureRaycastBridge.displayName = 'GestureRaycastBridge';

export default GestureRaycastBridge;
