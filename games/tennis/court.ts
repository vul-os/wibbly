import * as THREE from 'three';
import { debugLog } from './debug';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { assetUrl } from '../../src/mode';

/** Same narrowing three.js's own examples use — `isMesh` rather than `instanceof`. */
function isMesh(obj: THREE.Object3D): obj is THREE.Mesh {
    return (obj as THREE.Mesh).isMesh === true;
}

export function loadCourt(scene: THREE.Scene): Promise<THREE.Group | THREE.Mesh> {
    return new Promise((resolve) => {
        const loader = new GLTFLoader();

        loader.load(
            // Resolved against the build base, NOT hardcoded to the site root:
            // at /products/magnetite/wibbly/play/ the old absolute path 404'd and the
            // court silently degraded to placeholder geometry.
            assetUrl('models/court.glb'),
            (gltf) => {
                debugLog('Court loaded successfully');
                const model = gltf.scene;
                model.traverse((child) => {
                    if (isMesh(child)) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                        if (child.material) {
                            const material = child.material as THREE.Material;
                            material.side = THREE.DoubleSide;
                            material.needsUpdate = true;
                        }
                    }
                });
                scene.add(model);
                resolve(model);
            },
            undefined,
            (error) => {
                console.error('Error loading court model:', error);
                // Fallback to simple court if model fails to load
                const fallbackCourt = createSimpleCourt(scene);
                resolve(fallbackCourt);
            }
        );
    });
}

export function createSimpleCourt(scene: THREE.Scene): THREE.Mesh {
    const courtGeometry = new THREE.PlaneGeometry(20, 10);
    const courtMaterial = new THREE.MeshStandardMaterial({ color: 0x538a35, side: THREE.DoubleSide });
    const court = new THREE.Mesh(courtGeometry, courtMaterial);
    court.rotation.x = -Math.PI / 2; // Horizontal
    court.position.y = -0.01; // Slightly below players
    court.receiveShadow = true;
    scene.add(court);
    debugLog('Using fallback simple court');
    return court;
}