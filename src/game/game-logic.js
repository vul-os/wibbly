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
        usePoseDetection: true, // Enable pose detection
        // Add AI update timing controls
        lastAIUpdate: 0,
        aiUpdateInterval: 1000 / 30, // Target 30 FPS for AI updates
        player1LastSwingCheck: 0,
        player2LastSwingCheck: 0,
        swingCheckInterval: 1000 / 60 // Check swing conditions at 60 FPS
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

export function updatePlayer1AI(players, gameState, playerData, ballGroup) {
    const player1 = players[0];
    const playerData1 = playerData[0];
    const currentTime = performance.now();
    
    // Frame-rate independent AI updates
    if (currentTime - gameState.lastAIUpdate < gameState.aiUpdateInterval) {
        // Only update swing checking at higher frequency
        if (currentTime - gameState.player1LastSwingCheck >= gameState.swingCheckInterval) {
            checkPlayer1Swing(player1, playerData1, ballGroup, gameState);
            gameState.player1LastSwingCheck = currentTime;
        }
        return;
    }
    
    // Return to center after hitting if flagged
    if (gameState.returnToCenter.player1) {
        // Move to center position
        playerData1.targetX = -7;
        playerData1.targetZ = 0;
        
        // Check if close to center, then disable flag
        const distanceToCenter = Math.sqrt(
            Math.pow(player1.position.x - (-7), 2) +
            Math.pow(player1.position.z - 0, 2)
        );
        
        if (distanceToCenter < 1) {
            gameState.returnToCenter.player1 = false;
        }
    }
    
    // Wii Sports style aggressive ball tracking when ball is in play
    else if (gameState.ballInPlay) {
        // Use the optimal positioning function that considers racket reach
        const optimalPos = calculateOptimalPosition(player1, ballGroup, gameState, 0);
        
        // More aggressive tracking - move more directly toward the ball
        const ballPos = ballGroup.position;
        const distanceToBall = Math.sqrt(
            Math.pow(player1.position.x - ballPos.x, 2) +
            Math.pow(player1.position.z - ballPos.z, 2)
        );
        
        if (distanceToBall > 2.5) {
            // Move toward ball with more aggressive positioning
            let trackingX = ballPos.x - 0.8; // Stay slightly behind ball for hitting
            let trackingZ = ballPos.z;
            
            // Constrain to player 1's side of court
            trackingX = Math.max(-9, Math.min(-2, trackingX));
            trackingZ = Math.max(-4.5, Math.min(4.5, trackingZ));
            
            // Blend optimal position with aggressive tracking
            const aggressiveFactor = Math.min(1.0, distanceToBall / 3.0);
            playerData1.targetX = optimalPos.x * (1 - aggressiveFactor) + trackingX * aggressiveFactor;
            playerData1.targetZ = optimalPos.z * (1 - aggressiveFactor) + trackingZ * aggressiveFactor;
        } else {
            // Close to ball, use optimal positioning
            playerData1.targetX = optimalPos.x;
            playerData1.targetZ = optimalPos.z;
        }
    }
    // When ball is not in play, stay in a ready position
    else {
        // Move to a good ready position - more centered for Wii Sports feel
        playerData1.targetX = -6.5; // Closer to center for better court coverage
        playerData1.targetZ = 0;     // Center of court
    }
}

// Separate swing checking function for higher frequency updates
function checkPlayer1Swing(player1, playerData1, ballGroup, gameState) {
    if (!playerData1.swinging && gameState.ballInPlay) {
        const ballPos = ballGroup.position;
        const distanceToBall = Math.sqrt(
            Math.pow(player1.position.x - ballPos.x, 2) +
            Math.pow(player1.position.z - ballPos.z, 2)
        );
        
        // Enhanced swing conditions with better prediction
        const ballMovingToPlayer = gameState.ballVelocity.x < 0; // Ball moving left towards player 1
        const ballInRange = distanceToBall < 2.4; // Slightly increased range for deployment
        const ballAtGoodHeight = ballGroup.position.y > 0.3 && ballGroup.position.y < 4; // Wider height range
        
        // Predict ball position in next few frames for better timing
        const futureX = ballPos.x + gameState.ballVelocity.x * 0.1; // 100ms prediction
        const futureBallToPlayer = Math.sqrt(
            Math.pow(player1.position.x - futureX, 2) +
            Math.pow(player1.position.z - ballPos.z, 2)
        );
        
        // Also consider if ball is slowing down near player or will be close soon
        const ballSlowingDown = Math.abs(gameState.ballVelocity.x) < 3;
        const ballWillBeClose = futureBallToPlayer < 2.0;
        
        if ((ballInRange || ballWillBeClose) && (ballMovingToPlayer || ballSlowingDown) && ballAtGoodHeight) {
            playerData1.swinging = true;
            playerData1.swingTime = 0;
            handleBallHit(ballGroup, gameState, player1, 0);
            console.log("Player 1 Wii Sports auto-swing! Distance: " + distanceToBall.toFixed(2));
        }
    }
}

export function updatePlayer2AI(players, gameState, playerData, ballGroup) {
    const player2 = players[1];
    const playerData2 = playerData[1];
    const currentTime = performance.now();
    
    // Frame-rate independent AI updates - use same timer as player 1
    if (currentTime - gameState.lastAIUpdate < gameState.aiUpdateInterval) {
        // Only update swing checking at higher frequency
        if (currentTime - gameState.player2LastSwingCheck >= gameState.swingCheckInterval) {
            checkPlayer2Swing(player2, playerData2, ballGroup, gameState);
            gameState.player2LastSwingCheck = currentTime;
        }
        return;
    }
    
    // Update the AI timer after both players have been processed
    gameState.lastAIUpdate = currentTime;
    
    // Return to center after hitting if flagged
    if (gameState.returnToCenter.player2) {
        // Move to center position
        playerData2.targetX = 7;
        playerData2.targetZ = 0;
        
        // Check if close to center, then disable flag
        const distanceToCenter = Math.sqrt(
            Math.pow(player2.position.x - 7, 2) +
            Math.pow(player2.position.z - 0, 2)
        );
        
        if (distanceToCenter < 1) {
            gameState.returnToCenter.player2 = false;
        }
    }
    
    // Always track the ball when it's in play, regardless of who hit it last
    else if (gameState.ballInPlay) {
        // Use the new optimal positioning function that considers racket reach
        const optimalPos = calculateOptimalPosition(player2, ballGroup, gameState, 1);
        
        // Update target with optimal position - always track the ball
        playerData2.targetX = optimalPos.x;
        playerData2.targetZ = optimalPos.z;
    }
    // When ball is not in play, stay in a ready position
    else {
        // Move to a good ready position
        playerData2.targetX = 7; // Slightly forward ready position
        playerData2.targetZ = 0;  // Center of court
    }
}

// Separate swing checking function for player 2
function checkPlayer2Swing(player2, playerData2, ballGroup, gameState) {
    if (!playerData2.swinging && gameState.ballInPlay) {
        const ballPos = ballGroup.position;
        const distanceToBall = Math.sqrt(
            Math.pow(player2.position.x - ballPos.x, 2) +
            Math.pow(player2.position.z - ballPos.z, 2)
        );
        
        // Enhanced swing conditions with better prediction
        const ballMovingToPlayer = gameState.ballVelocity.x > 0; // Ball moving right towards player 2
        const ballInRange = distanceToBall < 2.4; // Slightly increased range for deployment
        const ballAtGoodHeight = ballGroup.position.y > 0.3 && ballGroup.position.y < 4; // Wider height range
        
        // Predict ball position in next few frames for better timing
        const futureX = ballPos.x + gameState.ballVelocity.x * 0.1; // 100ms prediction
        const futureBallToPlayer = Math.sqrt(
            Math.pow(player2.position.x - futureX, 2) +
            Math.pow(player2.position.z - ballPos.z, 2)
        );
        
        // Also consider if ball is slowing down near player or will be close soon
        const ballSlowingDown = Math.abs(gameState.ballVelocity.x) < 3;
        const ballWillBeClose = futureBallToPlayer < 2.0;
        
        if ((ballInRange || ballWillBeClose) && (ballMovingToPlayer || ballSlowingDown) && ballAtGoodHeight) {
            playerData2.swinging = true;
            playerData2.swingTime = 0;
            handleBallHit(ballGroup, gameState, player2, 1);
            console.log("Player 2 auto-swing! Distance: " + distanceToBall.toFixed(2));
        }
    }
}

export function initializeGame(players, ballGroup, gameState, playerData) {
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
    ballGroup.position.set(
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