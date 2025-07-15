import * as THREE from 'three';

export function createPlayer(x, z, rotation, scale = 1) {
    const group = new THREE.Group();
    
    // Body (red shirt)
    const bodyGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.4);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xcc3333 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 1.2;
    group.add(body);

    // Head
    const headGeometry = new THREE.BoxGeometry(0.6, 0.6, 0.6);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0xFFE6D5 });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.9;
    group.add(head);

    // Hair
    const hairGeometry = new THREE.BoxGeometry(0.65, 0.2, 0.65);
    const hairMaterial = new THREE.MeshStandardMaterial({ color: 0xFFD700 });
    const hair = new THREE.Mesh(hairGeometry, hairMaterial);
    hair.position.y = 2.3;
    group.add(hair);

    // Eyes
    const eyeGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.05);
    const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x4FA4FF });
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.15, 1.9, 0.3);
    group.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.15, 1.9, 0.3);
    group.add(rightEye);

    // Create anatomical arm structure
    const armMaterial = new THREE.MeshStandardMaterial({ color: 0xFFE6D5 });
    
    // LEFT ARM STRUCTURE (Player's actual left - positive X from behind view)
    // Left shoulder (sphere joint)
    const shoulderGeometry = new THREE.SphereGeometry(0.15, 8, 6);
    const leftShoulder = new THREE.Mesh(shoulderGeometry, armMaterial);
    leftShoulder.position.set(0.55, 1.5, 0); // POSITIVE X = Player's left from behind view
    // Extend left arm much further outward
    leftShoulder.rotation.z = 0.6; // Increased from 0.3 to 0.6 for more outward extension
    leftShoulder.rotation.x = 0.2; // Add slight forward tilt
    group.add(leftShoulder);
    
    // Left upper arm (shoulder to elbow) - made shorter
    const upperArmGeometry = new THREE.CylinderGeometry(0.12, 0.12, 0.45); // Reduced from 0.6 to 0.45
    const leftUpperArm = new THREE.Mesh(upperArmGeometry, armMaterial);
    leftUpperArm.position.set(0, -0.225, 0); // Adjusted for shorter arm
    leftShoulder.add(leftUpperArm);
    
    // Left elbow (sphere joint)
    const elbowGeometry = new THREE.SphereGeometry(0.1, 8, 6);
    const leftElbow = new THREE.Mesh(elbowGeometry, armMaterial);
    leftElbow.position.set(0, -0.225, 0); // Adjusted for shorter arm
    leftElbow.rotation.z = -0.7; // Increased from -0.4 to -0.7 for more extension
    leftElbow.rotation.x = 0.2; // Add slight forward bend
    leftUpperArm.add(leftElbow);
    
    // Left lower arm (elbow to wrist) - made shorter
    const lowerArmGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.4); // Reduced from 0.55 to 0.4
    const leftLowerArm = new THREE.Mesh(lowerArmGeometry, armMaterial);
    leftLowerArm.position.set(0, -0.2, 0); // Adjusted for shorter arm and positioned higher
    leftElbow.add(leftLowerArm);
    
    // Left hand (sphere at wrist)
    const handGeometry = new THREE.SphereGeometry(0.12, 8, 6);
    const leftHand = new THREE.Mesh(handGeometry, armMaterial);
    leftHand.position.set(0, -0.2, 0); // Adjusted for shorter arm and positioned higher
    leftLowerArm.add(leftHand);

    // RIGHT ARM STRUCTURE (Player's actual right - negative X from behind view)
    // Right shoulder (sphere joint) - THIS IS WHERE THE RACKET GOES
    const rightShoulder = new THREE.Mesh(shoulderGeometry, armMaterial);
    rightShoulder.position.set(-0.55, 1.5, 0); // NEGATIVE X = Player's right from behind view
    // Extend right arm much further outward and forward for tennis stance
    rightShoulder.rotation.z = -0.6; // Increased from -0.3 to -0.6 for more outward extension
    rightShoulder.rotation.y = rotation === Math.PI/2 ? -0.3 : 0.3; // Increased forward rotation
    rightShoulder.rotation.x = 0.2; // Add slight forward tilt
    group.add(rightShoulder);
    
    // Make right shoulder slightly different color to identify it
    const rightShoulderMaterial = new THREE.MeshStandardMaterial({ color: 0xFFD0A5 }); // Slightly different skin tone
    rightShoulder.material = rightShoulderMaterial;
    
    // Right upper arm (shoulder to elbow) - made shorter
    const rightUpperArm = new THREE.Mesh(upperArmGeometry, armMaterial);
    rightUpperArm.position.set(0, -0.225, 0); // Adjusted for shorter arm
    rightShoulder.add(rightUpperArm);
    
    // Right elbow (sphere joint)
    const rightElbow = new THREE.Mesh(elbowGeometry, armMaterial);
    rightElbow.position.set(0, -0.225, 0); // Adjusted for shorter arm
    rightElbow.rotation.z = 0.7; // Increased from 0.4 to 0.7 for more extension
    rightElbow.rotation.x = 0.2; // Add slight forward bend
    rightUpperArm.add(rightElbow);
    
    // Right lower arm (elbow to wrist) - made shorter
    const rightLowerArm = new THREE.Mesh(lowerArmGeometry, armMaterial);
    rightLowerArm.position.set(0, -0.2, 0); // Adjusted for shorter arm and positioned higher
    rightElbow.add(rightLowerArm);
    
    // Right hand (sphere at wrist) - THIS IS WHERE THE RACKET GOES
    const rightHand = new THREE.Mesh(handGeometry, armMaterial);
    rightHand.position.set(0, -0.2, 0); // Adjusted for shorter arm and positioned higher
    rightLowerArm.add(rightHand);
    
    // Make right hand slightly larger and different color to identify it clearly
    const rightHandMaterial = new THREE.MeshStandardMaterial({ color: 0xFFB085 }); // Slightly orangish for identification
    rightHand.material = rightHandMaterial;
    rightHand.scale.set(1.2, 1.2, 1.2); // Make it slightly larger

    // Legs
    const legGeometry = new THREE.BoxGeometry(0.35, 0.8, 0.35);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x4477CC });
    
    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-0.2, 0.4, 0);
    group.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0.2, 0.4, 0);
    group.add(rightLeg);

    // Lower body (waist/shorts) - adjusted to fix intersection with shirt
    const pantsGeometry = new THREE.BoxGeometry(0.6, 0.25, 0.45);
    const pantsMaterial = new THREE.MeshStandardMaterial({ color: 0x4477CC });
    const pants = new THREE.Mesh(pantsGeometry, pantsMaterial);
    pants.position.y = 0.75; // Lowered slightly to avoid intersection with shirt
    group.add(pants);

    // Racket
    const racketGroup = new THREE.Group();
    
    // Racket head - make it bigger and more tennis-like
    const racketHeadGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.05); // More oval tennis racket shape
    const racketHeadMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const racketHead = new THREE.Mesh(racketHeadGeometry, racketHeadMaterial);
    racketGroup.add(racketHead);

    // Racket strings for more realism
    const stringMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc });
    for (let i = -2; i <= 2; i++) {
        // Vertical strings
        const vStringGeometry = new THREE.BoxGeometry(0.01, 0.7, 0.01);
        const vString = new THREE.Mesh(vStringGeometry, stringMaterial);
        vString.position.set(i * 0.1, 0, 0.02);
        racketGroup.add(vString);
        
        // Horizontal strings
        const hStringGeometry = new THREE.BoxGeometry(0.5, 0.01, 0.01);
        const hString = new THREE.Mesh(hStringGeometry, stringMaterial);
        hString.position.set(0, i * 0.15, 0.02);
        racketGroup.add(hString);
    }

    // Racket handle - longer and more realistic
    const handleGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.8); // Longer handle
    const handleMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    handle.position.y = -0.7; // Position below the head
    racketGroup.add(handle);

    // Handle grip wrap for realism
    const gripGeometry = new THREE.CylinderGeometry(0.065, 0.065, 0.3);
    const gripMaterial = new THREE.MeshStandardMaterial({ color: 0x2a2a2a });
    const grip = new THREE.Mesh(gripGeometry, gripMaterial);
    grip.position.y = -0.85; // Bottom part of handle
    racketGroup.add(grip);

    // Add debug collision sphere (invisible by default, can be toggled for debugging)
    const debugSphereGeometry = new THREE.SphereGeometry(1.0, 8, 8); // 1.0 radius matches collision detection
    const debugSphereMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x00ff00, 
        transparent: true, 
        opacity: 0.2,
        wireframe: true 
    });
    const debugSphere = new THREE.Mesh(debugSphereGeometry, debugSphereMaterial);
    debugSphere.visible = false; // Hidden by default, can be enabled for debugging
    racketGroup.add(debugSphere);

    // Store reference to debug sphere for later access
    racketGroup.userData = { debugSphere };

    // RACKET ATTACHMENT - TO PLAYER'S RIGHT HAND (negative X side from behind view)
    // Attach racket to RIGHT hand with better positioning
    console.log("Attaching racket to player's RIGHT hand (negative X side from behind view)");
    if (rotation === Math.PI/2) { // Player 1 facing +Z axis
        racketGroup.position.set(-0.3, 0.1, 0.6); // Further out and higher, negative X for player's right
        rightHand.add(racketGroup); // EXPLICITLY ADD TO RIGHT HAND
        // Tennis grip orientation - RACKET FACES UPWARD
        racketGroup.rotation.x = Math.PI / 2; // Rotate to face upward
        racketGroup.rotation.z = Math.PI / 8; // Slight tilt
        racketGroup.rotation.y = Math.PI / 8; // Slight turn
    } else { // Player 2 facing -Z axis
        racketGroup.position.set(-0.3, 0.1, -0.6); // Further out and higher, negative X for player's right
        rightHand.add(racketGroup); // EXPLICITLY ADD TO RIGHT HAND
        // Mirror the grip for player 2 - RACKET FACES UPWARD
        racketGroup.rotation.x = Math.PI / 2; // Rotate to face upward
        racketGroup.rotation.z = -Math.PI / 8; // Slight tilt (mirrored)
        racketGroup.rotation.y = -Math.PI / 8; // Slight turn (mirrored)
    }
    
    // Add a bright marker to the right hand to confirm it's the right one
    const rightHandMarker = new THREE.SphereGeometry(0.05, 8, 8);
    const rightHandMarkerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Bright red
    const rightHandMarkerMesh = new THREE.Mesh(rightHandMarker, rightHandMarkerMaterial);
    rightHandMarkerMesh.position.set(0, 0, 0.2);
    rightHand.add(rightHandMarkerMesh);

    // Scale the entire player
    group.scale.set(scale, scale, scale);
    
    // Position the entire player
    group.position.set(x, 0, z);
    group.rotation.y = rotation;

    // Store references for animation - updated to use new arm structure
    group.userData = {
        leftShoulder,
        leftElbow,
        leftHand,
        rightShoulder,
        rightElbow,
        rightHand,
        leftLeg,
        rightLeg,
        racketGroup,
        body,
        head
    };

    return group;
}

export function updatePlayerMovement(player, data, delta) {
    // Calculate direction to target
    const dx = data.targetX - player.position.x;
    const dz = data.targetZ - player.position.z;
    const distance = Math.sqrt(dx * dx + dz * dz);
    
    // Movement speed - increased for better ball tracking
    const speed = 6.5; // Increased from 4.5 to 6.5 for faster response to ball
    const moveSpeed = speed * delta;
    
    // If not at target, move toward it
    if (distance > 0.1) {
        // Movement direction
        const moveX = (dx / distance) * moveSpeed;
        const moveZ = (dz / distance) * moveSpeed;
        
        // Update position
        player.position.x += moveX;
        player.position.z += moveZ;
        
        // Walking animation
        data.legPhase += delta * 8;
        
        // Leg movement
        const legRotation = Math.sin(data.legPhase) * 0.4;
        player.userData.leftLeg.rotation.x = legRotation;
        player.userData.rightLeg.rotation.x = -legRotation;
        
        // Head bounce
        const bounce = Math.abs(Math.sin(data.legPhase * 2)) * 0.05;
        player.userData.head.position.y = 1.9 + bounce;
        
        // Arm swing while walking - updated for new arm structure
        if (!data.swinging) {
            const armRotation = Math.sin(data.legPhase) * 0.3;
            player.userData.leftShoulder.rotation.z = armRotation;
            player.userData.rightShoulder.rotation.z = -armRotation;
        }
    } else {
        // Reset walking animation when stopped
        if (!data.swinging) {
            player.userData.leftLeg.rotation.x = 0;
            player.userData.rightLeg.rotation.x = 0;
            player.userData.leftShoulder.rotation.z = 0;
            player.userData.rightShoulder.rotation.z = 0;
        }
        player.userData.head.position.y = 1.9;
    }
}

export function updatePlayerSwing(player, data, delta, playerIndex) {
    if (data.swinging) {
        data.swingTime += delta;
        
        // Swing animation over 0.25 seconds (faster)
        const swingProgress = Math.min(data.swingTime / 0.25, 1);
        
        // Create a more realistic tennis swing using the new arm structure
        if (playerIndex === 0) { // Player 1 (facing +Z)
            // Shoulder rotation for the swing
            const shoulderRotZ = Math.sin(swingProgress * Math.PI) * -0.8;
            const shoulderRotY = Math.sin(swingProgress * Math.PI) * 0.4;
            
            // Elbow rotation
            const elbowRotZ = Math.sin(swingProgress * Math.PI) * -0.6;
            
            player.userData.rightShoulder.rotation.z = shoulderRotZ;
            player.userData.rightShoulder.rotation.y = shoulderRotY;
            player.userData.rightElbow.rotation.z = elbowRotZ;
        } else { // Player 2 (facing -Z)
            // Mirror the swing for player 2
            const shoulderRotZ = Math.sin(swingProgress * Math.PI) * 0.8;
            const shoulderRotY = Math.sin(swingProgress * Math.PI) * -0.4;
            
            // Elbow rotation
            const elbowRotZ = Math.sin(swingProgress * Math.PI) * 0.6;
            
            player.userData.rightShoulder.rotation.z = shoulderRotZ;
            player.userData.rightShoulder.rotation.y = shoulderRotY;
            player.userData.rightElbow.rotation.z = elbowRotZ;
        }
        
        // End swing
        if (swingProgress >= 1) {
            data.swinging = false;
            // Reset arm rotations
            player.userData.rightShoulder.rotation.set(0, 0, 0);
            player.userData.rightElbow.rotation.set(0, 0, 0);
        }
    }
}

// Update player arm positions based on pose detection data
export function updatePlayerPose(player, poseDetector, playerIndex) {
    if (!poseDetector) return;
    
    // Only apply pose data to player 1 (the human player)
    if (playerIndex !== 0) return;
    
    const armAngles = poseDetector.getArmAngles();
    if (!armAngles || armAngles.confidence < 0.5) return;
    
    // Apply pose data to the player's arm joints
    const { rightShoulder, rightElbow } = player.userData;
    
    // Convert pose angles to 3D rotations
    // Note: Pose detection gives us 2D angles, we need to map them to 3D space
    
    // Shoulder rotation - map 2D angle to 3D shoulder movement
    // shoulderAngle ranges from -PI to PI, we map it to shoulder Z rotation
    const shoulderRotZ = THREE.MathUtils.clamp(armAngles.shoulderAngle * 0.8, -1.5, 1.5);
    const shoulderRotX = THREE.MathUtils.clamp(armAngles.shoulderAngle * 0.3, -0.8, 0.8);
    
    // Elbow rotation - map elbow angle to elbow joint rotation
    const elbowRotZ = THREE.MathUtils.clamp(armAngles.elbowAngle * 0.6, -1.2, 1.2);
    
    // Apply rotations smoothly to avoid jittery movement
    const smoothing = 0.1; // Lower = smoother but more delayed
    
    // Smooth interpolation to current pose
    rightShoulder.rotation.z = THREE.MathUtils.lerp(rightShoulder.rotation.z, shoulderRotZ, smoothing);
    rightShoulder.rotation.x = THREE.MathUtils.lerp(rightShoulder.rotation.x, shoulderRotX, smoothing);
    rightElbow.rotation.z = THREE.MathUtils.lerp(rightElbow.rotation.z, elbowRotZ, smoothing);
    
    // Visual feedback - make the joints glow when pose is being tracked
    if (armAngles.confidence > 0.7) {
        // High confidence - bright green glow
        rightShoulder.material.emissive.setHex(0x004400);
        rightElbow.material.emissive.setHex(0x004400);
    } else if (armAngles.confidence > 0.5) {
        // Medium confidence - dim green glow
        rightShoulder.material.emissive.setHex(0x002200);
        rightElbow.material.emissive.setHex(0x002200);
    } else {
        // Low confidence - no glow
        rightShoulder.material.emissive.setHex(0x000000);
        rightElbow.material.emissive.setHex(0x000000);
    }
}

// Toggle debug collision sphere visibility for racket
export function toggleRacketDebug(player, visible) {
    const racketGroup = player.userData.racketGroup;
    if (racketGroup && racketGroup.userData && racketGroup.userData.debugSphere) {
        racketGroup.userData.debugSphere.visible = visible;
    }
} 