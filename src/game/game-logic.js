import * as THREE from 'three';
import { handleBallHit } from './ball.js';

export function createGameState() {
    return {
        ballVelocity: new THREE.Vector3(0, 0, 0),
        ballInPlay: false,
        waitingToServe: true,
        lastHitBy: null,
        score: { player1: 0, player2: 0 },
        debug: true, // Enable debugging
        lastMoveTime: 0, // Track last time players changed positions
        returnToCenter: {
            player1: false,
            player2: false
        },
        usePoseDetection: true // Enable pose detection
    };
}

export function createPlayerData() {
    return [
        { targetX: -8, targetZ: 0, isLeftSide: true, moveTime: 0, swinging: false, swingTime: 0, legPhase: 0, x: -8, z: 0, homeX: -8, homeZ: 0 },
        { targetX: 8, targetZ: 0, isLeftSide: false, moveTime: 0, swinging: false, swingTime: 0, legPhase: 0, x: 8, z: 0, homeX: 8, homeZ: 0 }
    ];
}

export function updatePlayerPositions(gameState, playerData, clock) {
    const now = clock.getElapsedTime();
    
    // Update positions every 3-5 seconds - but only if players are not returning to center
    // and not actively chasing the ball
    if (now - gameState.lastMoveTime > 3 + Math.random() * 2 && 
        !gameState.returnToCenter.player1 && 
        !gameState.returnToCenter.player2 && 
        (!gameState.ballInPlay || 
        (gameState.ballVelocity.x > 0 && gameState.lastHitBy === 0) || 
        (gameState.ballVelocity.x < 0 && gameState.lastHitBy === 1))) {
        
        gameState.lastMoveTime = now;
        
        // Player 1 - left side of court (-9 to -4)
        const player1Data = playerData[0];
        player1Data.targetX = -9 + Math.random() * 5; // Stay on left side, further back
        player1Data.targetZ = -4 + Math.random() * 8; // Full width of court
        
        // Player 2 - right side of court (4 to 9)
        const player2Data = playerData[1];
        player2Data.targetX = 4 + Math.random() * 5; // Stay on right side, further back
        player2Data.targetZ = -4 + Math.random() * 8; // Full width of court
        
        console.log(`Players moving to new positions: P1(${player1Data.targetX.toFixed(1)}, ${player1Data.targetZ.toFixed(1)}), P2(${player2Data.targetX.toFixed(1)}, ${player2Data.targetZ.toFixed(1)})`);
    }
}

export function updatePlayer1AI(players, gameState, playerData, ball) {
    const player1 = players[0];
    const playerData1 = playerData[0];
    
    // Check if player should return to center
    if (gameState.returnToCenter.player1) {
        playerData1.targetX = playerData1.homeX; // Return to home X position
        playerData1.targetZ = playerData1.homeZ; // Return to home Z position
        
        // Check if player is close to center position
        const dx = playerData1.targetX - player1.position.x;
        const dz = playerData1.targetZ - player1.position.z;
        const distanceToCenter = Math.sqrt(dx * dx + dz * dz);
        
        if (distanceToCenter < 0.5) {
            gameState.returnToCenter.player1 = false; // Reset the flag once player reaches center
            console.log("Player 1 reached home position");
        }
    }
    // Chase the ball only if not returning to center and ball is coming toward player
    else if (gameState.ballInPlay && gameState.lastHitBy !== 0 && gameState.ballVelocity.x < 0) {
        // Predict where ball will land
        let targetX = -8;
        let targetZ = 0;
        
        // Ball coming toward player 1
        const timeToReach = (player1.position.x - ball.position.x) / gameState.ballVelocity.x;
        if (timeToReach > 0) {
            // Calculate predicted landing position
            targetZ = ball.position.z + gameState.ballVelocity.z * timeToReach;
            
            // Position player to the right of the ball from their perspective
            // For player 1 (facing +Z), the right side is +Z direction
            targetZ = targetZ + 1.2; // Position more to the right of the ball
            
            // Keep player 1 in his half of the court - but closer to center for better reach
            targetX = Math.min(-4, Math.max(-9, ball.position.x - 0.8));
        }
        
        // Clamp to court bounds
        targetZ = Math.max(-4, Math.min(4, targetZ));
        
        // Update target
        playerData1.targetX = targetX;
        playerData1.targetZ = targetZ;
        
        // Add debug logging to track player 1's target when ball approaches
        if (gameState.debug && ball.position.x < -3 && Math.abs(ball.position.x - player1.position.x) < 5) {
            console.log(`Player 1 targeting: X=${targetX.toFixed(2)}, Z=${targetZ.toFixed(2)}, Ball at: X=${ball.position.x.toFixed(2)}, Z=${ball.position.z.toFixed(2)}`);
        }
    }
}

export function updatePlayer2AI(players, gameState, playerData, ball) {
    const player2 = players[1];
    const playerData2 = playerData[1];
    
    // Check if player should return to center
    if (gameState.returnToCenter.player2) {
        playerData2.targetX = playerData2.homeX; // Return to home X position 
        playerData2.targetZ = playerData2.homeZ; // Return to home Z position
        
        // Check if player is close to center position
        const dx = playerData2.targetX - player2.position.x;
        const dz = playerData2.targetZ - player2.position.z;
        const distanceToCenter = Math.sqrt(dx * dx + dz * dz);
        
        if (distanceToCenter < 0.5) {
            gameState.returnToCenter.player2 = false; // Reset the flag once player reaches center
            console.log("Player 2 reached home position");
        }
    }
    // Chase the ball only if not returning to center and ball is coming toward player
    else if (gameState.ballInPlay && gameState.lastHitBy !== 1) {
        // Predict where ball will land
        let targetX = 8;
        let targetZ = 0;
        
        // Simple prediction - improve accuracy
        if (gameState.ballVelocity.x > 0) {
            // Ball coming toward player 2
            const timeToReach = (player2.position.x - ball.position.x) / gameState.ballVelocity.x;
            if (timeToReach > 0) {
                // Calculate predicted landing position
                targetZ = ball.position.z + gameState.ballVelocity.z * timeToReach;
                
                // Position player to the right of the ball from their perspective
                // For player 2 (facing -Z), the right side is -Z direction
                targetZ = targetZ - 1.5; // Position more to the right of the ball
                
                // Move closer to ball for better chance of hitting
                targetX = Math.max(4, Math.min(9, ball.position.x + 0.8));
            }
        }
        
        // Clamp to court bounds
        targetZ = Math.max(-4, Math.min(4, targetZ));
        
        // Update target
        playerData2.targetX = targetX;
        playerData2.targetZ = targetZ;
        
        // Add debug logging to track player 2's target when ball approaches
        if (gameState.debug && ball.position.x > 3 && Math.abs(ball.position.x - player2.position.x) < 5) {
            console.log(`Player 2 targeting: X=${targetX.toFixed(2)}, Z=${targetZ.toFixed(2)}, Ball at: X=${ball.position.x.toFixed(2)}, Z=${ball.position.z.toFixed(2)}`);
        }
    }
    
    // Improve player 2's ability to hit the ball with racket-based detection
    if (gameState.ballInPlay && !playerData2.swinging) {
        // Get racket position in world space
        const rightArm = player2.userData.rightArm;
        const racketGroup = player2.userData.racketGroup;
        const racketPos = new THREE.Vector3();
        
        // Get racket's world position for more accurate collision
        racketGroup.getWorldPosition(racketPos);
        
        // Calculate racket-to-ball distance instead of player-to-ball
        const racketToBallDistance = racketPos.distanceTo(ball.position);
        
        // More precise hit detection based on racket position
        if (racketToBallDistance < 1.0 && gameState.ballVelocity.x > 0) {
            playerData2.swinging = true;
            playerData2.swingTime = 0;
            
            // Hit the ball using the ball module
            handleBallHit(ball, gameState, player2, 1);
            
            console.log("Ball hit by player 2! Racket distance: " + racketToBallDistance.toFixed(2));
        }
    }
}

export function initializeGame(players, ball, gameState, playerData) {
    console.log("Starting game!");
    
    // Reset player positions to court ends
    players[0].position.set(-8, 0, 0);
    players[1].position.set(8, 0, 0);
    
    // Players face head-on (toward center court Z axis)
    players[0].rotation.y = Math.PI/2; // Facing forward (+Z axis)
    players[1].rotation.y = -Math.PI/2; // Facing toward us (-Z axis)
    
    // Reset ball position to be in front of player 1's racket
    const player1 = players[0];
    // Position ball where the racket can hit it
    ball.position.set(
        player1.position.x + 0.6, // Slightly in front
        1.3,                      // Racket height
        player1.position.z + 0.5  // Offset to be hittable by racket
    );
    
    // Initial state
    gameState.ballVelocity.set(0, 0, 0);
    gameState.ballInPlay = false;
    gameState.waitingToServe = true;
    gameState.lastHitBy = null;
    gameState.lastMoveTime = 0;
    gameState.returnToCenter = { player1: false, player2: false };
    
    // Set players to be at center of their court sides, but further back
    playerData[0].targetX = -8;
    playerData[0].targetZ = 0;
    playerData[1].targetX = 8;
    playerData[1].targetZ = 0;
    
    console.log("Game started. Press SPACEBAR to serve the ball.");
} 