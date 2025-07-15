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
        { 
            targetX: -8, targetZ: -1, isLeftSide: true, moveTime: 0, swinging: false, swingTime: 0, 
            legPhase: 0, x: -8, z: -1, homeX: -8, homeZ: -1 // Player 1 - left baseline, slightly left of center
        },
        { 
            targetX: 8, targetZ: 1, isLeftSide: false, moveTime: 0, swinging: false, swingTime: 0, 
            legPhase: 0, x: 8, z: 1, homeX: 8, homeZ: 1 // Player 2 - right baseline, slightly right of center
        }
    ];
}

export function updatePlayerPositions(gameState, playerData, clock) {
    const now = clock.getElapsedTime();
    
    // Only make small positional adjustments when not actively playing
    // AND not waiting to serve (players should be still during serve)
    if (now - gameState.lastMoveTime > 4 + Math.random() * 3 && 
        !gameState.returnToCenter.player1 && 
        !gameState.returnToCenter.player2 && 
        !gameState.ballInPlay &&
        !gameState.waitingToServe) { // Added this condition to prevent movement during serve
        
        gameState.lastMoveTime = now;
        
        // Player 1 - stay near baseline on left side with small movements
        const player1Data = playerData[0];
        player1Data.targetX = -8 + (Math.random() - 0.5) * 2; // Small movement around baseline
        player1Data.targetZ = (Math.random() - 0.5) * 3; // Small side-to-side movement
        
        // Player 2 - stay near baseline on right side with small movements  
        const player2Data = playerData[1];
        player2Data.targetX = 8 + (Math.random() - 0.5) * 2; // Small movement around baseline
        player2Data.targetZ = (Math.random() - 0.5) * 3; // Small side-to-side movement

        console.log(`Players making small adjustments: P1(${player1Data.targetX.toFixed(1)}, ${player1Data.targetZ.toFixed(1)}), P2(${player2Data.targetX.toFixed(1)}, ${player2Data.targetZ.toFixed(1)})`);
    }
}

export function updatePlayer1AI(players, gameState, playerData, ball) {
    const player1 = players[0];
    const playerData1 = playerData[0];
    
    // Check if player should return to center baseline position
    if (gameState.returnToCenter.player1) {
        playerData1.targetX = playerData1.homeX; // Return to baseline
        playerData1.targetZ = playerData1.homeZ; // Return to center
        
        // Check if player is close to center position
        const dx = playerData1.targetX - player1.position.x;
        const dz = playerData1.targetZ - player1.position.z;
        const distanceToCenter = Math.sqrt(dx * dx + dz * dz);
        
        if (distanceToCenter < 0.5) {
            gameState.returnToCenter.player1 = false;
            console.log("Player 1 reached baseline position");
        }
    }
    // Track ball realistically when it's coming toward player
    else if (gameState.ballInPlay && gameState.lastHitBy !== 0 && gameState.ballVelocity.x < 0) {
        // Move horizontally to align with ball Z position
        let targetX = -8; // Stay near baseline
        let targetZ = ball.position.z; // Align horizontally with ball
        
        // Predict ball position for better alignment
        const timeToReach = Math.abs((player1.position.x - ball.position.x) / gameState.ballVelocity.x);
        if (timeToReach > 0 && timeToReach < 3) {
            // Calculate where ball will be when it reaches player's X position
            targetZ = ball.position.z + gameState.ballVelocity.z * timeToReach;
            
            // Move forward slightly if ball is high (for better hitting position)
            if (ball.position.y > 1.5) {
                targetX = -7; // Move forward slightly
            }
        }
        
        // Keep player in bounds and on their side
        targetX = Math.max(-9, Math.min(-5, targetX));
        targetZ = Math.max(-4, Math.min(4, targetZ));
        
        // Update target
        playerData1.targetX = targetX;
        playerData1.targetZ = targetZ;
        
        // Debug logging for ball tracking
        if (gameState.debug && ball.position.x < -2 && Math.abs(ball.position.x - player1.position.x) < 6) {
            console.log(`Player 1 tracking ball: Moving to Z=${targetZ.toFixed(2)}, Ball Z=${ball.position.z.toFixed(2)}`);
        }
    }
}

export function updatePlayer2AI(players, gameState, playerData, ball) {
    const player2 = players[1];
    const playerData2 = playerData[1];
    
    // Check if player should return to center baseline position
    if (gameState.returnToCenter.player2) {
        playerData2.targetX = playerData2.homeX; // Return to baseline
        playerData2.targetZ = playerData2.homeZ; // Return to center
        
        // Check if player is close to center position
        const dx = playerData2.targetX - player2.position.x;
        const dz = playerData2.targetZ - player2.position.z;
        const distanceToCenter = Math.sqrt(dx * dx + dz * dz);
        
        if (distanceToCenter < 0.5) {
            gameState.returnToCenter.player2 = false;
            console.log("Player 2 reached baseline position");
        }
    }
    // Track ball realistically when it's coming toward player
    else if (gameState.ballInPlay && gameState.lastHitBy !== 1 && gameState.ballVelocity.x > 0) {
        // Move horizontally to align with ball Z position
        let targetX = 8; // Stay near baseline
        let targetZ = ball.position.z; // Align horizontally with ball
        
        // Predict ball position for better alignment
        const timeToReach = Math.abs((ball.position.x - player2.position.x) / gameState.ballVelocity.x);
        if (timeToReach > 0 && timeToReach < 3) {
            // Calculate where ball will be when it reaches player's X position
            targetZ = ball.position.z + gameState.ballVelocity.z * timeToReach;
            
            // Move forward slightly if ball is high (for better hitting position)
            if (ball.position.y > 1.5) {
                targetX = 7; // Move forward slightly
            }
        }
        
        // Keep player in bounds and on their side
        targetX = Math.max(5, Math.min(9, targetX));
        targetZ = Math.max(-4, Math.min(4, targetZ));
        
        // Update target
        playerData2.targetX = targetX;
        playerData2.targetZ = targetZ;
        
        // Debug logging for ball tracking
        if (gameState.debug && ball.position.x > 2 && Math.abs(ball.position.x - player2.position.x) < 6) {
            console.log(`Player 2 tracking ball: Moving to Z=${targetZ.toFixed(2)}, Ball Z=${ball.position.z.toFixed(2)}`);
        }
    }
    
    // Improve player 2's ability to hit the ball with racket-based detection
    if (gameState.ballInPlay && !playerData2.swinging) {
        // Get racket position in world space - removed incorrect rightArm reference
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
    
    // Reset player positions to proper tennis baseline positions
    players[0].position.set(-8, 0, -1); // Player 1: left baseline, slightly left of center
    players[1].position.set(8, 0, 1);   // Player 2: right baseline, slightly right of center
    
    // Players face head-on (toward center court Z axis)
    players[0].rotation.y = Math.PI/2; // Facing forward (+Z axis)
    players[1].rotation.y = -Math.PI/2; // Facing toward us (-Z axis)
    
    // Reset ball position to be in front of player 1's racket for serve
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
    
    // Initial state
    gameState.ballVelocity.set(0, 0, 0);
    gameState.ballInPlay = false;
    gameState.waitingToServe = true;
    gameState.lastHitBy = null;
    gameState.lastMoveTime = 0;
    gameState.returnToCenter = { player1: false, player2: false };
    
    // Set players to proper tennis baseline positions
    playerData[0].targetX = -8; // Player 1 baseline (left side)
    playerData[0].targetZ = -1; // Slightly left of center
    playerData[0].homeX = -8;   // Home baseline position
    playerData[0].homeZ = -1;   // Home position slightly left of center
    
    playerData[1].targetX = 8;  // Player 2 baseline (right side) 
    playerData[1].targetZ = 1;  // Slightly right of center
    playerData[1].homeX = 8;    // Home baseline position
    playerData[1].homeZ = 1;    // Home position slightly right of center
    
    console.log("Game started. Press SPACEBAR to serve the ball.");
    console.log(`Player positions: P1(-8, -1) P2(8, 1) - Properly spaced for tennis!`);
} 