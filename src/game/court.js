import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { assetUrl } from '../mode.js';

export function loadCourt(scene) {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        
        loader.load(
            // Resolved against the build base, NOT hardcoded to the site root:
            // at /products/magnetite/wibbly/play/ the old absolute path 404'd and the
            // court silently degraded to placeholder geometry.
            assetUrl('models/court.glb'),
            (gltf) => {
                console.log('Court loaded successfully');
                const model = gltf.scene;
                model.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                        if (child.material) {
                            child.material.side = THREE.DoubleSide;
                            child.material.needsUpdate = true;
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

export function createSimpleCourt(scene) {
    const courtGeometry = new THREE.PlaneGeometry(20, 10);
    const courtMaterial = new THREE.MeshStandardMaterial({ color: 0x538a35, side: THREE.DoubleSide });
    const court = new THREE.Mesh(courtGeometry, courtMaterial);
    court.rotation.x = -Math.PI / 2; // Horizontal
    court.position.y = -0.01; // Slightly below players
    court.receiveShadow = true;
    scene.add(court);
    console.log('Using fallback simple court');
    return court;
} 