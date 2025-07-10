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

    // CREATE VISUAL HIT BOX for racket collision detection
    const hitBoxGeometry = new THREE.BoxGeometry(0.7, 0.7, 0.05); // Same size as racket head
    const hitBoxMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x00ff00,        // Bright green
        wireframe: true,        // Wireframe mode
        transparent: true,      // Make it semi-transparent
        opacity: 0.8           // Adjust visibility
    });
    const hitBox = new THREE.Mesh(hitBoxGeometry, hitBoxMaterial);
    
    // Position the hit box exactly at the racket head position
    hitBox.position.copy(racketHead.position);
    racketGroup.add(hitBox);

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

    // Store references for animation (add hitBox reference)
    group.userData = {
        leftArm,
        rightArm,
        leftLeg,
        rightLeg,
        racketGroup,
        body,
        head,
        hitBox  // Add reference to the hit box for easy access
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
export function updateRacketAlignment(player, data, ballGroup, gameState, playerIndex) {
    if (data.swinging || !gameState.ballInPlay) return;
    
    const racketGroup = player.userData.racketGroup;
    const rightArm = player.userData.rightArm;
    
    // Calculate ball trajectory and predict where it will be at racket height
    const ballDirection = new THREE.Vector3(
        gameState.ballVelocity.x,
        gameState.ballVelocity.y,
        gameState.ballVelocity.z
    );
    
    // Get current racket world position
    const racketWorldPos = new THREE.Vector3();
    racketGroup.getWorldPosition(racketWorldPos);
    
    // Predict where ball will be when it reaches racket height (1.3)
    const targetHeight = 1.3;
    const currentBallY = ballGroup.position.y;
    const ballVelY = gameState.ballVelocity.y;
    const gravity = -9.8;
    
    // Calculate time for ball to reach racket height using physics
    let timeToReachHeight = 0;
    if (ballVelY !== 0) {
        // Solve quadratic equation: y = y0 + v0*t + 0.5*g*t²
        const a = 0.5 * gravity;
        const b = ballVelY;
        const c = currentBallY - targetHeight;
        
        const discriminant = b * b - 4 * a * c;
        if (discriminant >= 0) {
            const t1 = (-b + Math.sqrt(discriminant)) / (2 * a);
            const t2 = (-b - Math.sqrt(discriminant)) / (2 * a);
            // Choose the positive time that's in the future
            timeToReachHeight = Math.max(0, Math.min(t1 > 0 ? t1 : Infinity, t2 > 0 ? t2 : Infinity));
        }
    }
    
    // Calculate where ball will be at racket height
    const futureBallPos = new THREE.Vector3(
        ballGroup.position.x + gameState.ballVelocity.x * timeToReachHeight,
        targetHeight,
        ballGroup.position.z + gameState.ballVelocity.z * timeToReachHeight
    );
    
    // Check if ball is coming toward this player
    const ballComingToPlayer = 
        (playerIndex === 0 && gameState.ballVelocity.x < 0) || 
        (playerIndex === 1 && gameState.ballVelocity.x > 0);
    
    if (ballComingToPlayer && timeToReachHeight > 0 && timeToReachHeight < 2) {
        // Vector from player to future ball position
        const toBall = new THREE.Vector3().subVectors(futureBallPos, player.position);
        
        // Calculate optimal body rotation to face the ball
        const bodyRotationY = Math.atan2(toBall.z, toBall.x);
        
        // Smoothly rotate player body to face ball trajectory
        const targetBodyRotation = playerIndex === 0 ? 
            Math.PI/2 + bodyRotationY * 0.3 : 
            -Math.PI/2 + bodyRotationY * 0.3;
        
        player.rotation.y = THREE.MathUtils.lerp(player.rotation.y, targetBodyRotation, 0.08);
        
        // Adjust arm and racket to point toward incoming ball more precisely
        if (playerIndex === 0) { // Player 1
            // Calculate optimal arm rotation to intercept ball
            const armRotY = Math.atan2(toBall.z, toBall.x) * 0.7; // More aggressive rotation toward ball
            const armRotX = Math.atan2(toBall.y - 1.3, Math.sqrt(toBall.x * toBall.x + toBall.z * toBall.z)) * 0.5;
            const armRotZ = Math.atan2(toBall.y - 1.3, toBall.x) * 0.3; // Side tilt for better angle
            
            // Smoothly adjust arm position
            rightArm.rotation.y = THREE.MathUtils.lerp(rightArm.rotation.y, armRotY, 0.12);
            rightArm.rotation.x = THREE.MathUtils.lerp(rightArm.rotation.x, armRotX, 0.12);
            rightArm.rotation.z = THREE.MathUtils.lerp(rightArm.rotation.z, armRotZ, 0.08);
            
            // Adjust racket angle for perfect interception
            const racketRotY = Math.atan2(toBall.z, toBall.x) * 0.5;
            const racketRotX = Math.atan2(toBall.y - 1.3, Math.sqrt(toBall.x * toBall.x + toBall.z * toBall.z)) * 0.4;
            
            racketGroup.rotation.y = THREE.MathUtils.lerp(racketGroup.rotation.y, -Math.PI/8 + racketRotY, 0.15);
            racketGroup.rotation.x = THREE.MathUtils.lerp(racketGroup.rotation.x, racketRotX, 0.12);
        } else { // Player 2
            // Calculate optimal arm rotation to intercept ball (mirrored)
            const armRotY = Math.atan2(-toBall.z, -toBall.x) * 0.7;
            const armRotX = Math.atan2(toBall.y - 1.3, Math.sqrt(toBall.x * toBall.x + toBall.z * toBall.z)) * 0.5;
            const armRotZ = Math.atan2(toBall.y - 1.3, -toBall.x) * 0.3;
            
            // Smoothly adjust arm position
            rightArm.rotation.y = THREE.MathUtils.lerp(rightArm.rotation.y, armRotY, 0.12);
            rightArm.rotation.x = THREE.MathUtils.lerp(rightArm.rotation.x, armRotX, 0.12);
            rightArm.rotation.z = THREE.MathUtils.lerp(rightArm.rotation.z, -armRotZ, 0.08);
            
            // Adjust racket angle for perfect interception
            const racketRotY = Math.atan2(-toBall.z, -toBall.x) * 0.5;
            const racketRotX = Math.atan2(toBall.y - 1.3, Math.sqrt(toBall.x * toBall.x + toBall.z * toBall.z)) * 0.4;
            
            racketGroup.rotation.y = THREE.MathUtils.lerp(racketGroup.rotation.y, Math.PI/8 + racketRotY, 0.15);
            racketGroup.rotation.x = THREE.MathUtils.lerp(racketGroup.rotation.x, racketRotX, 0.12);
        }
    } else {
        // Reset to neutral position when ball is not coming
        const neutralBodyRotation = playerIndex === 0 ? Math.PI/2 : -Math.PI/2;
        player.rotation.y = THREE.MathUtils.lerp(player.rotation.y, neutralBodyRotation, 0.04);
        
        rightArm.rotation.y = THREE.MathUtils.lerp(rightArm.rotation.y, 0, 0.04);
        rightArm.rotation.x = THREE.MathUtils.lerp(rightArm.rotation.x, 0, 0.04);
        rightArm.rotation.z = THREE.MathUtils.lerp(rightArm.rotation.z, 0, 0.04);
        
        if (playerIndex === 0) {
            racketGroup.rotation.y = THREE.MathUtils.lerp(racketGroup.rotation.y, -Math.PI/8, 0.04);
            racketGroup.rotation.x = THREE.MathUtils.lerp(racketGroup.rotation.x, 0, 0.04);
        } else {
            racketGroup.rotation.y = THREE.MathUtils.lerp(racketGroup.rotation.y, Math.PI/8, 0.04);
            racketGroup.rotation.x = THREE.MathUtils.lerp(racketGroup.rotation.x, 0, 0.04);
        }
    }
}

// Enhanced function to calculate optimal player position considering racket reach and ball trajectory
export function calculateOptimalPosition(player, ballGroup, gameState, playerIndex) {
    if (!gameState.ballInPlay) return { x: player.position.x, z: player.position.z };
    
    // Always track the ball when it's in play, not just when coming toward player
    const ballVelocity = gameState.ballVelocity;
    const ballPosition = ballGroup.position;
    
    // Calculate where ball will be when it reaches racket height (1.3)
    const targetHeight = 1.3;
    const currentBallY = ballPosition.y;
    const ballVelY = ballVelocity.y;
    const gravity = -9.8;
    
    // Calculate time for ball to reach racket height using physics
    let timeToReachHeight = 0;
    if (Math.abs(ballVelY) > 0.1 || Math.abs(currentBallY - targetHeight) > 0.1) {
        // Solve quadratic equation: y = y0 + v0*t + 0.5*g*t²
        const a = 0.5 * gravity;
        const b = ballVelY;
        const c = currentBallY - targetHeight;
        
        const discriminant = b * b - 4 * a * c;
        if (discriminant >= 0) {
            const t1 = (-b + Math.sqrt(discriminant)) / (2 * a);
            const t2 = (-b - Math.sqrt(discriminant)) / (2 * a);
            // Choose the positive time that's in the future and reasonable
            const validTimes = [t1, t2].filter(t => t > 0 && t < 10);
            if (validTimes.length > 0) {
                timeToReachHeight = Math.min(...validTimes);
            }
        }
    }
    
    // If no valid time found, use simple prediction
    if (timeToReachHeight === 0 || timeToReachHeight > 8) {
        if (Math.abs(ballVelY) > 0.1) {
            timeToReachHeight = Math.abs((targetHeight - currentBallY) / ballVelY);
        } else {
            timeToReachHeight = 1; // Default prediction time
        }
    }
    
    // Predict where ball will be at racket height
    let targetX = ballPosition.x + ballVelocity.x * timeToReachHeight;
    let targetZ = ballPosition.z + ballVelocity.z * timeToReachHeight;
    
    // Account for racket reach and optimal hitting position
    const optimalHitDistance = 0.7; // Sweet spot distance from player center
    const anticipationDistance = 0.3; // How far ahead to position
    
    // Always position player optimally, regardless of ball direction
    if (playerIndex === 0) {
        // Player 1: position so racket's sweet spot will intercept the ball
        targetX = targetX - optimalHitDistance - anticipationDistance;
        targetX = Math.max(-9, Math.min(-2, targetX)); // Clamp to left side
        
        // Adjust Z position based on ball trajectory for better angle
        if (Math.abs(ballVelocity.z) > 0.1) {
            const sideOffset = ballVelocity.z > 0 ? -0.3 : 0.3;
            targetZ = targetZ + sideOffset;
        }
    } else {
        // Player 2: position so racket's sweet spot will intercept the ball
        targetX = targetX + optimalHitDistance + anticipationDistance;
        targetX = Math.max(2, Math.min(9, targetX)); // Clamp to right side
        
        // Adjust Z position based on ball trajectory for better angle
        if (Math.abs(ballVelocity.z) > 0.1) {
            const sideOffset = ballVelocity.z > 0 ? 0.3 : -0.3;
            targetZ = targetZ + sideOffset;
        }
    }
    
    // Clamp to court bounds with some buffer
    targetZ = Math.max(-4.5, Math.min(4.5, targetZ));
    
    // If ball is very close, move more aggressively toward it
    const distanceToBall = Math.sqrt(
        Math.pow(player.position.x - ballPosition.x, 2) +
        Math.pow(player.position.z - ballPosition.z, 2)
    );
    
    if (distanceToBall < 3) {
        // Move more directly toward ball position for close interception
        const directToBallX = ballPosition.x + (playerIndex === 0 ? -0.6 : 0.6);
        const directToBallZ = ballPosition.z;
        
        const blendFactor = Math.max(0.3, (3 - distanceToBall) / 3); // Closer = more direct
        targetX = THREE.MathUtils.lerp(targetX, directToBallX, blendFactor);
        targetZ = THREE.MathUtils.lerp(targetZ, directToBallZ, blendFactor);
    }
    
    // Always ensure player is in a reasonable position
    if (playerIndex === 0) {
        targetX = Math.max(-9, Math.min(-2, targetX));
    } else {
        targetX = Math.max(2, Math.min(9, targetX));
    }
    
    return { x: targetX, z: targetZ };
} 

// Function to toggle hit box visibility
export function toggleHitBoxVisibility(players, ballGroup, visible = null) {
    // If no specific visibility state provided, toggle current state
    if (visible === null) {
        // Check current state from first player's hit box
        const firstHitBox = players[0].userData.hitBox;
        visible = !firstHitBox.visible;
    }
    
    // Toggle racket hit boxes for all players
    players.forEach((player) => {
        if (player.userData.hitBox) {
            player.userData.hitBox.visible = visible;
        }
    });
    
    // Toggle ball collision sphere
    if (ballGroup && ballGroup.userData.collisionSphere) {
        ballGroup.userData.collisionSphere.visible = visible;
    }
    
    console.log(`Hit boxes ${visible ? 'shown' : 'hidden'}`);
    return visible;
} 