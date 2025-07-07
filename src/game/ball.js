import * as THREE from 'three';

export function createBall(scene) {
    const ballGeometry = new THREE.SphereGeometry(0.14, 32, 32); // Increased by 40% from 0.1
    const ballMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 }); // Yellow ball
    const ball = new THREE.Mesh(ballGeometry, ballMaterial);
    ball.position.set(-8, 1, 0); // Start position near player 1 at court end
    ball.castShadow = true;
    scene.add(ball);
    return ball;
}

export function updateBallPhysics(ball, gameState, delta, clock, players) {
    // Keep ball with player 1 if waiting to serve
    if (!gameState.ballInPlay && gameState.waitingToServe) {
        const player1 = players[0];
        
        // Position ball in front of player's racket - aligned with bigger racket
        const rightArm = player1.userData.rightArm;
        // Convert position from local space to world space
        const worldPos = new THREE.Vector3();
        rightArm.getWorldPosition(worldPos);
        
        ball.position.x = worldPos.x + 0.4; // Adjusted for bigger racket
        ball.position.z = worldPos.z + 0.6; // Adjusted for bigger racket
        ball.position.y = 1.3;              // Racket height
        return;
    }
    
    if (!gameState.ballInPlay) return;
    
    // Apply gravity
    gameState.ballVelocity.y -= 9.8 * delta;
    
    // Update position
    ball.position.x += gameState.ballVelocity.x * delta;
    ball.position.y += gameState.ballVelocity.y * delta;
    ball.position.z += gameState.ballVelocity.z * delta;
    
    // Prevent ball from going below ground with stronger bounce
    if (ball.position.y < 0.14) { // Adjusted for new ball size (from 0.1 to 0.14)
        ball.position.y = 0.14;
        // Stronger bounce - increased from 0.7 to 0.85
        gameState.ballVelocity.y = Math.abs(gameState.ballVelocity.y) * 0.85;
        
        // If ball hits ground, check for scoring
        if (Math.abs(ball.position.x) > 10) {
            console.log("Ball out of bounds!");
            resetBall(ball, gameState, players);
        }
    }
    
    // Ball out of bounds check
    if (Math.abs(ball.position.x) > 12 || Math.abs(ball.position.z) > 7 || ball.position.y > 15) {
        console.log("Ball out of bounds!");
        resetBall(ball, gameState, players);
    }
    
    // Log ball state every few seconds for debugging
    if (gameState.debug && Math.floor(clock.elapsedTime * 10) % 30 === 0) {
        console.log(`Ball pos: (${ball.position.x.toFixed(2)}, ${ball.position.y.toFixed(2)}, ${ball.position.z.toFixed(2)})`);
        console.log(`Ball velocity: (${gameState.ballVelocity.x.toFixed(2)}, ${gameState.ballVelocity.y.toFixed(2)}, ${gameState.ballVelocity.z.toFixed(2)})`);
    }
}

export function resetBall(ball, gameState, players) {
    gameState.ballInPlay = false;
    gameState.waitingToServe = true;
    
    // Set ball back to player 1's racket position
    const player1 = players[0];
    // Position ball where the racket can hit it
    ball.position.set(
        player1.position.x + 0.6, // Slightly in front
        1.3,                      // Racket height
        player1.position.z + 0.5  // Offset to be hittable by racket
    );
    gameState.ballVelocity.set(0, 0, 0);
    
    console.log("Ball reset. Press SPACEBAR to serve again.");
}

export function handleBallHit(ball, gameState, player, playerIndex, swingDirection = 'right') {
    const rightArm = player.userData.rightArm;
    const racketGroup = player.userData.racketGroup;
    const racketPos = new THREE.Vector3();
    
    // Get racket's world position for more accurate collision
    racketGroup.getWorldPosition(racketPos);
    
    // Calculate racket-to-ball distance instead of player-to-ball
    const racketToBallDistance = racketPos.distanceTo(ball.position);
    console.log(`Player ${playerIndex + 1} racket to ball distance: ${racketToBallDistance.toFixed(2)}`);
    
    // If ball not in play yet and racket is close enough, serve it
    if (!gameState.ballInPlay && racketToBallDistance < 1.2 && playerIndex === 0) {
        gameState.ballInPlay = true;
        gameState.waitingToServe = false;
        
        // Direct the serve clearly toward player 2 with better trajectory
        const targetX = 8; // Player 2's position
        const targetZ = 0; // Center of the court
        
        // Calculate direction to target
        const dirVec = new THREE.Vector3(targetX - player.position.x, 6, targetZ - player.position.z);
        dirVec.normalize();
        
        // Add velocity with slight randomness for variation
        gameState.ballVelocity.set(
            dirVec.x * (12 + Math.random() * 2), // Consistent X direction toward player 2
            6 + Math.random(),                   // Good arc height
            dirVec.z * (4 + Math.random() * 2)   // Z direction toward center with slight variation
        );
        
        gameState.lastHitBy = playerIndex;
        console.log("Ball served toward player 2!");
        return true;
    } 
    // If ball is close to racket during play, hit it
    else if (racketToBallDistance < 1.0) { 
        // Calculate new velocity based on swing direction
        const baseSpeed = 12 + Math.random() * 3; // Base speed
        const arcHeight = 6 + Math.random() * 2;  // Arc height
        
        // Determine direction based on player and swing
        let xVelocity, zVelocity;
        
        if (playerIndex === 0) { // Player 1
            xVelocity = baseSpeed; // Always going right from player 1
            
            // Determine Z direction based on swing direction
            if (swingDirection === 'left') {
                zVelocity = -4 - Math.random() * 2; // Hit to the left
            } else if (swingDirection === 'right') {
                zVelocity = 4 + Math.random() * 2;  // Hit to the right
            } else {
                zVelocity = (Math.random() - 0.5) * 4; // Random direction
            }
        } else { // Player 2
            xVelocity = -baseSpeed; // Always going left from player 2
            
            // Apply angle variation for player 2
            const angleVariation = Math.random() * 0.3 - 0.15; // -15% to +15% angle variation
            zVelocity = (Math.random() - 0.5) * 4; // More controlled z variation
            
            // Calculate normalized direction vector and then apply angle variation
            const magnitude = Math.sqrt(xVelocity * xVelocity + zVelocity * zVelocity);
            const normalizedX = xVelocity / magnitude;
            const normalizedZ = zVelocity / magnitude;
            
            // Apply rotation to the normalized vector
            const rotatedX = normalizedX * Math.cos(angleVariation) - normalizedZ * Math.sin(angleVariation);
            const rotatedZ = normalizedX * Math.sin(angleVariation) + normalizedZ * Math.cos(angleVariation);
            
            xVelocity = rotatedX * magnitude;
            zVelocity = rotatedZ * magnitude;
        }
        
        // Set velocity with the determined direction
        gameState.ballVelocity.set(xVelocity, arcHeight, zVelocity);
        
        gameState.lastHitBy = playerIndex;
        // Flag player to return to center
        if (playerIndex === 0) {
            gameState.returnToCenter.player1 = true;
        } else {
            gameState.returnToCenter.player2 = true;
        }
        
        console.log(`Ball hit by player ${playerIndex + 1}! Direction: ${swingDirection}`);
        return true;
    } else {
        console.log(`Player ${playerIndex + 1} swing missed - ball too far from racket! Distance: ${racketToBallDistance.toFixed(2)}`);
        return false;
    }
} 