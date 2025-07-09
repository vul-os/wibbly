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

    // Arms
    const armGeometry = new THREE.BoxGeometry(0.3, 0.6, 0.3);
    const armMaterial = new THREE.MeshStandardMaterial({ color: 0xFFE6D5 });
    
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-0.55, 1.3, 0);
    group.add(leftArm);

    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(0.55, 1.3, 0);
    group.add(rightArm);

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
    
    // Racket head - make it bigger
    const racketHeadGeometry = new THREE.BoxGeometry(0.7, 0.7, 0.05); // Increased from 0.4 to 0.7
    const racketHeadMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const racketHead = new THREE.Mesh(racketHeadGeometry, racketHeadMaterial);
    racketGroup.add(racketHead);

    // Racket handle - slightly longer
    const handleGeometry = new THREE.BoxGeometry(0.08, 0.6, 0.08); // Increased from 0.5 to 0.6
    const handleMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    handle.position.y = -0.6; // Adjusted to match longer handle
    racketGroup.add(handle);

    // Position racket in right hand - attach to arm properly and move it outward
    if (rotation === Math.PI/2) { // Player 1 facing +Z axis
        // Attach racket directly to the right arm, but position it more outward
        racketGroup.position.set(0.2, 0, 0.4); // More outward from the body on Z axis
        rightArm.add(racketGroup); // Add to right arm
    } else { // Player 2 facing -Z axis
        // Attach racket directly to the right arm, but position it more outward
        racketGroup.position.set(0.2, 0, -0.4); // More outward from the body on negative Z axis
        rightArm.add(racketGroup); // Add to right arm
    }
    // Adjust initial orientation to be more natural with arm
    racketGroup.rotation.z = -Math.PI / 4;
    racketGroup.rotation.y = rotation === Math.PI/2 ? -Math.PI/8 : Math.PI/8;

    // Scale the entire player
    group.scale.set(scale, scale, scale);
    
    // Position the entire player
    group.position.set(x, 0, z);
    group.rotation.y = rotation;

    // Store references for animation
    group.userData = {
        leftArm,
        rightArm,
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
    
    // Movement speed
    const speed = 4.5;
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
        
        // Arm swing while walking
        if (!data.swinging) {
            const armRotation = Math.sin(data.legPhase) * 0.3;
            player.userData.leftArm.rotation.x = armRotation;
            player.userData.rightArm.rotation.x = -armRotation;
            player.userData.racketGroup.rotation.x = -armRotation * 0.5;
        }
    } else {
        // Reset walking animation when stopped
        if (!data.swinging) {
            player.userData.leftLeg.rotation.x = 0;
            player.userData.rightLeg.rotation.x = 0;
            player.userData.leftArm.rotation.x = 0;
            player.userData.rightArm.rotation.x = 0;
            player.userData.racketGroup.rotation.x = 0;
        }
        player.userData.head.position.y = 1.9;
    }
}

export function updatePlayerSwing(player, data, delta, playerIndex) {
    if (data.swinging) {
        data.swingTime += delta;
        
        // Swing animation over 0.25 seconds (faster)
        const swingProgress = Math.min(data.swingTime / 0.25, 1);
        
        // Create a more realistic tennis swing
        if (playerIndex === 0) { // Player 1 (facing +Z)
            // Forehand swing animation (combination of arm rotations)
            const armRotZ = Math.sin(swingProgress * Math.PI) * -0.8; // Side swing
            const armRotY = Math.sin(swingProgress * Math.PI) * 0.4;  // Forward rotation
            const armRotX = Math.sin(swingProgress * Math.PI) * -1.2; // Downward/upward motion
            
            player.userData.rightArm.rotation.z = armRotZ;
            player.userData.rightArm.rotation.y = armRotY;
            player.userData.rightArm.rotation.x = armRotX;
        } else { // Player 2 (facing -Z)
            // Mirror the swing for player 2
            const armRotZ = Math.sin(swingProgress * Math.PI) * 0.8;  // Side swing (mirrored)
            const armRotY = Math.sin(swingProgress * Math.PI) * -0.4; // Forward rotation (mirrored)
            const armRotX = Math.sin(swingProgress * Math.PI) * -1.2; // Downward/upward motion
            
            player.userData.rightArm.rotation.z = armRotZ;
            player.userData.rightArm.rotation.y = armRotY;
            player.userData.rightArm.rotation.x = armRotX;
        }
        
        // End swing
        if (swingProgress >= 1) {
            data.swinging = false;
            // Reset arm rotation
            player.userData.rightArm.rotation.set(0, 0, 0);
        }
    }
}

// New function to align racket with incoming ball
export function updateRacketAlignment(player, data, ball, gameState, playerIndex) {
    if (data.swinging || !gameState.ballInPlay) return;
    
    const racketGroup = player.userData.racketGroup;
    const rightArm = player.userData.rightArm;
    
    // Calculate ball trajectory and predict where it will be
    const ballDirection = new THREE.Vector3(
        gameState.ballVelocity.x,
        gameState.ballVelocity.y,
        gameState.ballVelocity.z
    ).normalize();
    
    // Get current racket world position
    const racketWorldPos = new THREE.Vector3();
    racketGroup.getWorldPosition(racketWorldPos);
    
    // Calculate where ball will be in next 0.5 seconds
    const futureTime = 0.5;
    const futureBallPos = new THREE.Vector3(
        ball.position.x + gameState.ballVelocity.x * futureTime,
        ball.position.y + gameState.ballVelocity.y * futureTime - 0.5 * 9.8 * futureTime * futureTime, // Include gravity
        ball.position.z + gameState.ballVelocity.z * futureTime
    );
    
    // Check if ball is coming toward this player
    const ballComingToPlayer = 
        (playerIndex === 0 && gameState.ballVelocity.x < 0) || 
        (playerIndex === 1 && gameState.ballVelocity.x > 0);
    
    if (ballComingToPlayer) {
        // Vector from player to future ball position
        const toBall = new THREE.Vector3().subVectors(futureBallPos, player.position);
        
        // Adjust arm and racket to point toward incoming ball
        if (playerIndex === 0) { // Player 1
            // Calculate optimal arm rotation to intercept ball
            const armRotY = Math.atan2(toBall.z, toBall.x) * 0.5; // Moderate rotation toward ball
            const armRotX = Math.atan2(toBall.y - 1.3, Math.sqrt(toBall.x * toBall.x + toBall.z * toBall.z)) * 0.3;
            
            // Smoothly adjust arm position
            rightArm.rotation.y = THREE.MathUtils.lerp(rightArm.rotation.y, armRotY, 0.05);
            rightArm.rotation.x = THREE.MathUtils.lerp(rightArm.rotation.x, armRotX, 0.05);
            
            // Adjust racket angle for better interception
            const racketRotY = Math.atan2(toBall.z, toBall.x) * 0.3;
            racketGroup.rotation.y = THREE.MathUtils.lerp(racketGroup.rotation.y, -Math.PI/8 + racketRotY, 0.05);
        } else { // Player 2
            // Calculate optimal arm rotation to intercept ball (mirrored)
            const armRotY = Math.atan2(-toBall.z, -toBall.x) * 0.5;
            const armRotX = Math.atan2(toBall.y - 1.3, Math.sqrt(toBall.x * toBall.x + toBall.z * toBall.z)) * 0.3;
            
            // Smoothly adjust arm position
            rightArm.rotation.y = THREE.MathUtils.lerp(rightArm.rotation.y, armRotY, 0.05);
            rightArm.rotation.x = THREE.MathUtils.lerp(rightArm.rotation.x, armRotX, 0.05);
            
            // Adjust racket angle for better interception
            const racketRotY = Math.atan2(-toBall.z, -toBall.x) * 0.3;
            racketGroup.rotation.y = THREE.MathUtils.lerp(racketGroup.rotation.y, Math.PI/8 + racketRotY, 0.05);
        }
    } else {
        // Reset to neutral position when ball is not coming
        rightArm.rotation.y = THREE.MathUtils.lerp(rightArm.rotation.y, 0, 0.02);
        rightArm.rotation.x = THREE.MathUtils.lerp(rightArm.rotation.x, 0, 0.02);
        
        if (playerIndex === 0) {
            racketGroup.rotation.y = THREE.MathUtils.lerp(racketGroup.rotation.y, -Math.PI/8, 0.02);
        } else {
            racketGroup.rotation.y = THREE.MathUtils.lerp(racketGroup.rotation.y, Math.PI/8, 0.02);
        }
    }
}

// Enhanced function to calculate optimal player position considering racket reach
export function calculateOptimalPosition(player, ball, gameState, playerIndex) {
    if (!gameState.ballInPlay) return { x: player.position.x, z: player.position.z };
    
    // Check if ball is coming toward this player
    const ballComingToPlayer = 
        (playerIndex === 0 && gameState.ballVelocity.x < 0) || 
        (playerIndex === 1 && gameState.ballVelocity.x > 0);
    
    if (!ballComingToPlayer) {
        return { x: player.position.x, z: player.position.z };
    }
    
    // Predict ball landing position with better physics
    let targetX = ball.position.x;
    let targetZ = ball.position.z;
    
    // Time for ball to reach player's X coordinate
    const playerSideX = playerIndex === 0 ? -6 : 6;
    const timeToReach = Math.abs((playerSideX - ball.position.x) / Math.max(0.1, Math.abs(gameState.ballVelocity.x)));
    
    // Predict where ball will be
    targetX = ball.position.x + gameState.ballVelocity.x * timeToReach;
    targetZ = ball.position.z + gameState.ballVelocity.z * timeToReach;
    
    // Account for racket reach - position player so racket can intercept
    const racketReach = 0.6; // Approximate racket reach from player center
    
    if (playerIndex === 0) {
        // Player 1: position to the left of predicted ball position (considering racket reach)
        targetX = Math.max(-9, Math.min(-3, targetX - racketReach));
    } else {
        // Player 2: position to the right of predicted ball position (considering racket reach)
        targetX = Math.max(3, Math.min(9, targetX + racketReach));
    }
    
    // Clamp to court bounds
    targetZ = Math.max(-4, Math.min(4, targetZ));
    
    return { x: targetX, z: targetZ };
} 