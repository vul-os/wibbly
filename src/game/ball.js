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
        
        // Position ball in front of the racket face
        const racketGroup = player1.userData.racketGroup;
        if (racketGroup) {
            // Get the world position of the racket head center
            const worldPos = new THREE.Vector3();
            racketGroup.getWorldPosition(worldPos);
            
            // Get the racket's forward direction (considering its rotation)
            const forwardVector = new THREE.Vector3(0, 0, 1);
            forwardVector.applyQuaternion(racketGroup.getWorldQuaternion(new THREE.Quaternion()));
            
            // Position ball in front of the racket face by the ball radius plus a small offset
            const ballRadius = 0.14; // Ball radius
            const offset = ballRadius + 0.05; // Small additional offset to prevent clipping
            
            ball.position.copy(worldPos);
            ball.position.add(forwardVector.multiplyScalar(offset));
        }
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
    
    // Ball out of bounds check - aligned with court size (20x10 units)
    if (Math.abs(ball.position.x) > 10.5 || Math.abs(ball.position.z) > 5.5 || ball.position.y > 15) {
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
        
        // Serve toward a safe zone in Player 2's court area
        const targetX = 6 + Math.random() * 2; // Target between X: 6-8 (safe zone)
        const targetZ = (Math.random() - 0.5) * 4; // Target between Z: -2 to 2 (center court)
        
        // Calculate direction to safe target zone
        const direction = new THREE.Vector3(
            targetX - player.position.x, 
            0, 
            targetZ - player.position.z
        );
        direction.normalize();
        
        // Serve with controlled velocity toward the safe target
        gameState.ballVelocity.set(
            direction.x * (10 + Math.random() * 2), // Consistent speed toward target
            6 + Math.random(),                      // Good arc height
            direction.z * (4 + Math.random() * 2)   // Controlled Z direction
        );
        
        // Ensure Z velocity stays within court bounds
        gameState.ballVelocity.z = Math.max(-3, Math.min(3, gameState.ballVelocity.z));
        
        gameState.lastHitBy = playerIndex;
        console.log(`Ball served toward safe zone at X:${targetX.toFixed(1)}, Z:${targetZ.toFixed(1)}`);
        return true;
    } 
    // If ball is close to racket during play, hit it
    else if (racketToBallDistance < 1.0) { 
        // Calculate new velocity to keep ball in court
        const baseSpeed = 12 + Math.random() * 3; // Base speed
        const arcHeight = 6 + Math.random() * 2;  // Arc height
        
        // Determine direction based on player and aim for safe zones in opponent's court
        let xVelocity, zVelocity;
        
        if (playerIndex === 0) { // Player 1 - aim toward Player 2's safe zone
            xVelocity = baseSpeed; // Always going right from player 1
            
            // Aim for safe zones in Player 2's court (X: 4 to 9, Z: -4 to 4)
            const targetX = 6 + Math.random() * 2; // Target between X: 6-8
            const targetZ = (Math.random() - 0.5) * 6; // Target between Z: -3 to 3
            
            // Calculate direction to target, keeping it in bounds
            const direction = new THREE.Vector3(
                targetX - ball.position.x,
                0,
                targetZ - ball.position.z
            );
            direction.normalize();
            
            // Apply the direction while maintaining base speed
            xVelocity = Math.abs(direction.x) * baseSpeed; // Ensure positive X
            zVelocity = direction.z * (3 + Math.random() * 2); // Controlled Z velocity
            
            // Clamp Z velocity to keep ball in court
            zVelocity = Math.max(-4, Math.min(4, zVelocity));
            
        } else { // Player 2 - aim toward Player 1's safe zone
            xVelocity = -baseSpeed; // Always going left from player 2
            
            // Aim for safe zones in Player 1's court (X: -9 to -4, Z: -4 to 4)
            const targetX = -6 - Math.random() * 2; // Target between X: -8 to -6
            const targetZ = (Math.random() - 0.5) * 6; // Target between Z: -3 to 3
            
            // Calculate direction to target, keeping it in bounds
            const direction = new THREE.Vector3(
                targetX - ball.position.x,
                0,
                targetZ - ball.position.z
            );
            direction.normalize();
            
            // Apply the direction while maintaining base speed
            xVelocity = -Math.abs(direction.x) * baseSpeed; // Ensure negative X
            zVelocity = direction.z * (3 + Math.random() * 2); // Controlled Z velocity
            
            // Clamp Z velocity to keep ball in court
            zVelocity = Math.max(-4, Math.min(4, zVelocity));
        }
        
        // Set velocity with the calculated safe direction
        gameState.ballVelocity.set(xVelocity, arcHeight, zVelocity);
        
        gameState.lastHitBy = playerIndex;
        // Flag player to return to center
        if (playerIndex === 0) {
            gameState.returnToCenter.player1 = true;
        } else {
            gameState.returnToCenter.player2 = true;
        }
        
        console.log(`Ball hit by player ${playerIndex + 1} toward safe zone! Target velocity: X=${xVelocity.toFixed(2)}, Z=${zVelocity.toFixed(2)}`);
        return true;
    } else {
        console.log(`Player ${playerIndex + 1} swing missed - ball too far from racket! Distance: ${racketToBallDistance.toFixed(2)}`);
        return false;
    }
} 