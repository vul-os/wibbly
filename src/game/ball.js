import * as THREE from 'three';

export function createBall(scene) {
    const ballGeometry = new THREE.SphereGeometry(0.105, 32, 32); // Reduced by 25% from 0.14 to 0.105
    const ballMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 }); // Yellow ball
    const ball = new THREE.Mesh(ballGeometry, ballMaterial);
    ball.position.set(-8, 1, 0); // Start position near player 1 at court end
    ball.castShadow = true;
    scene.add(ball);
    return ball;
}

export function updateBallPhysics(ball, gameState, delta, clock, players) {
    // Store players reference on ball for smart targeting
    if (!ball.userData) ball.userData = {};
    ball.userData.players = players;
    
    // Keep ball with player 1 if waiting to serve - position in front of racket
    if (!gameState.ballInPlay && gameState.waitingToServe) {
        const player1 = players[0];
        
        // Position ball in front of the racket for realistic serve
        const racketGroup = player1.userData.racketGroup;
        const racketPos = new THREE.Vector3();
        racketGroup.getWorldPosition(racketPos);
        
        // Place ball in front of the racket (toward opponent direction)
        ball.position.x = racketPos.x + 0.5; // In front of racket toward opponent
        ball.position.y = racketPos.y + 0.2; // Slightly above racket
        ball.position.z = racketPos.z; // Same Z as racket
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
    if (ball.position.y < 0.105) { // Adjusted for new ball size (from 0.14 to 0.105)
        ball.position.y = 0.105;
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
    
    // Set ball back to player 1's racket area for serve
    const player1 = players[0];
    // Position ball in front of the racket
    const racketGroup = player1.userData.racketGroup;
    const racketPos = new THREE.Vector3();
    racketGroup.getWorldPosition(racketPos);
    
    ball.position.set(
        racketPos.x + 0.5, // In front of racket toward opponent
        racketPos.y + 0.2, // Slightly above racket
        racketPos.z // Same Z as racket
    );
    gameState.ballVelocity.set(0, 0, 0);
    
    console.log("Ball reset. Press SPACEBAR to serve again.");
}

export function handleBallHit(ball, gameState, player, playerIndex, swingDirection = 'right') {
    // Remove incorrect rightArm reference - we use the new arm structure now
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
        
        // Realistic tennis serve - calculate trajectory to clear net and land in service box
        
        // Tennis court dimensions and targets
        const netPosition = 0;      // Net is at X=0
        const netHeight = 0.9;      // Tennis net height
        const serviceBoxStart = 2;  // Service box starts at X=2
        const serviceBoxEnd = 6;    // Service box ends at X=6
        
        // Target position in opponent's service box (random within service area)
        const targetX = serviceBoxStart + Math.random() * (serviceBoxEnd - serviceBoxStart);
        const targetZ = (Math.random() - 0.5) * 3; // Random side in service box (-1.5 to 1.5)
        
        // Calculate horizontal distance to target
        const horizontalDistance = targetX - player.position.x; // About 14 units total
        const horizontalDistanceToNet = netPosition - player.position.x; // About 8 units to net
        const sideDistance = targetZ - player.position.z;
        
        // Calculate realistic serve speed (tennis serves are 90-120 mph = ~40-54 m/s, scaled for game)
        const serveSpeed = 14 + Math.random() * 4; // Increased from 12-16 to 14-18 for better pace
        
        // Calculate time of flight based on horizontal distance and speed
        const timeToTarget = horizontalDistance / serveSpeed;
        
        // Calculate required vertical velocity to clear net and land at target
        // Using physics: h = v0*t - 0.5*g*t^2
        // We want the ball to be at net height when it reaches the net
        const timeToNet = horizontalDistanceToNet / serveSpeed;
        const gravity = 9.8;
        
        // Calculate Y velocity needed to clear net by a safe margin (0.3 units)
        const netClearanceHeight = netHeight + 0.3; // Clear net by 30cm
        const requiredYVelocityForNet = (netClearanceHeight + 0.5 * gravity * timeToNet * timeToNet) / timeToNet;
        
        // But we also want to land at ground level at target
        // Calculate Y velocity for landing at target
        const startHeight = ball.position.y;
        const requiredYVelocityForLanding = (0.5 * gravity * timeToTarget * timeToTarget) / timeToTarget;
        
        // Use the higher of the two velocities to ensure we clear the net
        const finalYVelocity = Math.max(requiredYVelocityForNet, requiredYVelocityForLanding);
        
        // Calculate velocities
        const xVelocity = serveSpeed;
        const zVelocity = sideDistance / timeToTarget;
        const yVelocity = finalYVelocity;
        
        // Add some natural serve variation
        const xVariation = (Math.random() - 0.5) * 2;
        const zVariation = (Math.random() - 0.5) * 2;
        const yVariation = (Math.random() - 0.5) * 1;
        
        gameState.ballVelocity.set(
            xVelocity + xVariation,
            yVelocity + yVariation,
            zVelocity + zVariation
        );
        
        gameState.lastHitBy = playerIndex;
        console.log(`Tennis serve! Target: (${targetX.toFixed(1)}, ${targetZ.toFixed(1)}) Speed: ${serveSpeed.toFixed(1)}`);
        console.log(`Velocity: X=${(xVelocity + xVariation).toFixed(1)}, Y=${(yVelocity + yVariation).toFixed(1)}, Z=${(zVelocity + zVariation).toFixed(1)}`);
        return true;
    } 
    // If ball is close to racket during play, hit it
    else if (racketToBallDistance < 1.0) { 
        // Smart rally hitting - aim within bounds to keep game going
        
        // Court boundaries
        const courtLeft = -10;    // Left court boundary
        const courtRight = 10;    // Right court boundary
        const courtBack = -4;     // Back court boundary
        const courtFront = 4;     // Front court boundary
        const netPosition = 0;    // Net position
        const netHeight = 0.9;    // Net height
        
        // Determine target court area based on which player is hitting
        let targetXMin, targetXMax, targetZMin, targetZMax;
        let baseSpeed = 12 + Math.random() * 4; // Increased from 10-14 to 12-16 for better pace
        
        if (playerIndex === 0) { // Player 1 hitting to opponent's side (right side)
            targetXMin = 1;       // Just past the net
            targetXMax = 8;       // Near opponent's baseline, but not too deep
            targetZMin = -3;      // Left side of court
            targetZMax = 3;       // Right side of court
        } else { // Player 2 hitting to player 1's side (left side)
            targetXMin = -8;      // Near player 1's baseline, but not too deep
            targetXMax = -1;      // Just past the net
            targetZMin = -3;      // Left side of court
            targetZMax = 3;       // Right side of court
        }
        
        // Smart targeting: avoid hitting directly at opponent
        let targetX, targetZ;
        
        // Get opponent position for smart placement
        const opponentIndex = playerIndex === 0 ? 1 : 0;
        const opponentPlayer = ball.userData?.players?.[opponentIndex];
        
        if (opponentPlayer) {
            // Try to hit away from opponent
            const opponentZ = opponentPlayer.position.z;
            
            // Prefer hitting to the opposite side of where opponent is
            if (opponentZ < 0) {
                // Opponent on left, hit to right
                targetZ = 1 + Math.random() * 2; // Z: 1 to 3
            } else {
                // Opponent on right, hit to left  
                targetZ = -3 + Math.random() * 2; // Z: -3 to -1
            }
        } else {
            // Random placement if we can't find opponent
            targetZ = targetZMin + Math.random() * (targetZMax - targetZMin);
        }
        
        // Random depth within safe bounds
        targetX = targetXMin + Math.random() * (targetXMax - targetXMin);
        
        // Add some natural variation but keep within bounds
        targetX = Math.max(targetXMin, Math.min(targetXMax, targetX + (Math.random() - 0.5) * 2));
        targetZ = Math.max(targetZMin, Math.min(targetZMax, targetZ + (Math.random() - 0.5) * 1));
        
        // Calculate trajectory to target (similar to serve logic)
        const horizontalDistance = Math.abs(targetX - ball.position.x);
        const horizontalDistanceToNet = Math.abs(netPosition - ball.position.x);
        const sideDistance = targetZ - ball.position.z;
        
        // Calculate time of flight
        const timeToTarget = horizontalDistance / baseSpeed;
        const timeToNet = horizontalDistanceToNet / baseSpeed;
        const gravity = 9.8;
        
        // Ensure ball clears net with margin
        const netClearanceHeight = netHeight + 0.8; // Increased from 0.5 to 0.8 for better net clearance
        const requiredYVelocityForNet = (netClearanceHeight + 0.5 * gravity * timeToNet * timeToNet) / timeToNet;
        
        // Calculate Y velocity for landing at target  
        const requiredYVelocityForLanding = (0.5 * gravity * timeToTarget * timeToTarget) / timeToTarget;
        
        // Use higher velocity to ensure net clearance, with minimum for proper arc
        const minArcHeight = 6.5; // Increased from 5 to 6.5 for better net clearance
        const yVelocity = Math.max(requiredYVelocityForNet, requiredYVelocityForLanding, minArcHeight);
        
        // Calculate final velocities
        const xDirection = playerIndex === 0 ? 1 : -1; // Direction to opponent's side
        const xVelocity = xDirection * baseSpeed;
        const zVelocity = sideDistance / timeToTarget;
        
        // Add slight variation for natural play
        const xVariation = (Math.random() - 0.5) * 1;
        const zVariation = (Math.random() - 0.5) * 1;
        const yVariation = (Math.random() - 0.5) * 1;
        
        // Apply swing direction influence for human player
        if (playerIndex === 0 && swingDirection) {
            if (swingDirection === 'left') {
                // Adjust Z velocity for left swing
                const leftAdjustment = -2 - Math.random() * 2;
                targetZ = Math.max(targetZMin, targetZ + leftAdjustment);
            } else if (swingDirection === 'right') {
                // Adjust Z velocity for right swing
                const rightAdjustment = 2 + Math.random() * 2;
                targetZ = Math.min(targetZMax, targetZ + rightAdjustment);
            }
            // Recalculate Z velocity with swing adjustment
            const adjustedZVelocity = (targetZ - ball.position.z) / timeToTarget;
            gameState.ballVelocity.set(
                xVelocity + xVariation,
                yVelocity + yVariation,
                adjustedZVelocity + zVariation
            );
        } else {
            gameState.ballVelocity.set(
                xVelocity + xVariation,
                yVelocity + yVariation,
                zVelocity + zVariation
            );
        }
        
        gameState.lastHitBy = playerIndex;
        
        // Flag player to return to center
        if (playerIndex === 0) {
            gameState.returnToCenter.player1 = true;
        } else {
            gameState.returnToCenter.player2 = true;
        }
        
        console.log(`Player ${playerIndex + 1} rally hit! Target: (${targetX.toFixed(1)}, ${targetZ.toFixed(1)}) Direction: ${swingDirection || 'center'}`);
        return true;
    } else {
        console.log(`Player ${playerIndex + 1} swing missed - ball too far from racket! Distance: ${racketToBallDistance.toFixed(2)}`);
        return false;
    }
} 