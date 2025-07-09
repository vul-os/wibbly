import * as THREE from 'three';
import { handleBallHit } from './ball.js';
import { calculateOptimalPosition } from './player.js';

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
    
    // Only update positions when ball is not in play or players are idle
    // Much less frequent updates when ball is in play to avoid interfering with ball tracking
    const timeSinceLastMove = now - gameState.lastMoveTime;
    const shouldUpdatePositions = timeSinceLastMove > 5 + Math.random() * 3; // Increased from 3-5 to 5-8 seconds
    
    if (shouldUpdatePositions && 
        !gameState.returnToCenter.player1 && 
        !gameState.returnToCenter.player2 && 
        !gameState.ballInPlay) { // Only when ball is NOT in play
        
        gameState.lastMoveTime = now;
        
        // Player 1 - left side of court (-9 to -4) - smaller movement range
        const player1Data = playerData[0];
        player1Data.targetX = -8 + Math.random() * 2; // Smaller range: -8 to -6
        player1Data.targetZ = -2 + Math.random() * 4; // Smaller range: -2 to 2
        
        // Player 2 - right side of court (4 to 9) - smaller movement range
        const player2Data = playerData[1];
        player2Data.targetX = 6 + Math.random() * 2; // Smaller range: 6 to 8
        player2Data.targetZ = -2 + Math.random() * 4; // Smaller range: -2 to 2
        
        console.log(`Players moving to new idle positions: P1(${player1Data.targetX.toFixed(1)}, ${player1Data.targetZ.toFixed(1)}), P2(${player2Data.targetX.toFixed(1)}, ${player2Data.targetZ.toFixed(1)})`);
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
    // Always track the ball when it's in play, regardless of who hit it last
    else if (gameState.ballInPlay) {
        // Use the new optimal positioning function that considers racket reach
        const optimalPos = calculateOptimalPosition(player1, ball, gameState, 0);
        
        // Update target with optimal position - always track the ball
        playerData1.targetX = optimalPos.x;
        playerData1.targetZ = optimalPos.z;
        
        // Auto-swing when ball is close enough and moving towards player
        if (!playerData1.swinging) {
            const distanceToBall = Math.sqrt(
                Math.pow(player1.position.x - ball.position.x, 2) +
                Math.pow(player1.position.z - ball.position.z, 2)
            );
            
            // More aggressive swing conditions
            const ballMovingToPlayer = gameState.ballVelocity.x < 0; // Ball moving left towards player 1
            const ballInRange = distanceToBall < 1.8; // Increased range
            const ballAtGoodHeight = ball.position.y > 0.5 && ball.position.y < 3; // Reasonable height
            
            if (ballInRange && ballMovingToPlayer && ballAtGoodHeight) {
                playerData1.swinging = true;
                playerData1.swingTime = 0;
                handleBallHit(ball, gameState, player1, 0);
                console.log("Player 1 auto-swing! Distance: " + distanceToBall.toFixed(2));
            }
        }
    }
    // When ball is not in play, stay in a ready position
    else {
        // Move to a good ready position
        playerData1.targetX = -7; // Slightly forward ready position
        playerData1.targetZ = 0;   // Center of court
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
    // Always track the ball when it's in play, regardless of who hit it last
    else if (gameState.ballInPlay) {
        // Use the new optimal positioning function that considers racket reach
        const optimalPos = calculateOptimalPosition(player2, ball, gameState, 1);
        
        // Update target with optimal position - always track the ball
        playerData2.targetX = optimalPos.x;
        playerData2.targetZ = optimalPos.z;
        
        // Auto-swing when ball is close enough and moving towards player
        if (!playerData2.swinging) {
            const distanceToBall = Math.sqrt(
                Math.pow(player2.position.x - ball.position.x, 2) +
                Math.pow(player2.position.z - ball.position.z, 2)
            );
            
            // More aggressive swing conditions
            const ballMovingToPlayer = gameState.ballVelocity.x > 0; // Ball moving right towards player 2
            const ballInRange = distanceToBall < 1.8; // Increased range
            const ballAtGoodHeight = ball.position.y > 0.5 && ball.position.y < 3; // Reasonable height
            
            if (ballInRange && ballMovingToPlayer && ballAtGoodHeight) {
                playerData2.swinging = true;
                playerData2.swingTime = 0;
                handleBallHit(ball, gameState, player2, 1);
                console.log("Player 2 auto-swing! Distance: " + distanceToBall.toFixed(2));
            }
        }
    }
    // When ball is not in play, stay in a ready position
    else {
        // Move to a good ready position
        playerData2.targetX = 7; // Slightly forward ready position
        playerData2.targetZ = 0;  // Center of court
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