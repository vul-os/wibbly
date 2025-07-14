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
        swingCheckInterval: 1000 / 60, // Check swing conditions at 60 FPS
        // Add swing cooldown controls to prevent rapid swinging
        player1SwingCooldown: 0,
        player2SwingCooldown: 0,
        swingCooldownDuration: 200, // 200ms cooldown between swings (reduced for quick corrections)
        // Track ball approach to ensure only one swing per approach
        ballApproachId: 0,
        player1LastAttemptedBall: -1,
        player2LastAttemptedBall: -1
    };
}

export function createPlayerData() {
    return [
        { targetX: -6.0, targetZ: -1.5, isLeftSide: true, moveTime: 0, swinging: false, swingTime: 0, legPhase: 0, x: -6.0, z: -1.5, homeX: -6.0, homeZ: -1.5 },
        { targetX: 6.5, targetZ: 1.7, isLeftSide: false, moveTime: 0, swinging: false, swingTime: 0, legPhase: 0, x: 6.5, z: 1.7, homeX: 6.5, homeZ: 1.7 }
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
        // Move to ready position (left side like real tennis)
        playerData1.targetX = -6.0; // Updated to match new ready position
        playerData1.targetZ = -1.5;
        
        // Check if close to ready position, then disable flag
        const distanceToReady = Math.sqrt(
            Math.pow(player1.position.x - (-6.0), 2) +
            Math.pow(player1.position.z - (-1.5), 2)
        );
        
        if (distanceToReady < 1) {
            gameState.returnToCenter.player1 = false;
        }
        
        // Reset rotation to normal after hitting
        const neutralRotation = Math.PI/2; // Facing forward (+Z axis)
        player1.rotation.y = THREE.MathUtils.lerp(player1.rotation.y, neutralRotation, 0.08);
    }
    
    // Realistic tennis positioning when ball is in play
    else if (gameState.ballInPlay) {
        const ballPos = ballGroup.position;
        const ballVelocity = gameState.ballVelocity;
        
        // Check if ball is coming toward player 1's side
        const ballComingToPlayer1 = ballVelocity.x < 0 || (ballPos.x < 1 && Math.abs(ballVelocity.x) < 4); // Improved logic similar to Player 2
        
        if (ballComingToPlayer1) {
            // Only move toward ball if it's actually coming to this side
            const optimalPos = calculateOptimalPosition(player1, ballGroup, gameState, 0);
            
            // Don't be too aggressive - only move if ball is reasonably close
            const distanceToBall = Math.sqrt(
                Math.pow(player1.position.x - ballPos.x, 2) +
                Math.pow(player1.position.z - ballPos.z, 2)
            );
            
            // Debug logging for Player 1
            if (gameState.debug && Math.floor(Date.now() / 1000) % 4 === 0) {
                console.log(`Player 1 AI: Ball at (${ballPos.x.toFixed(1)}, ${ballPos.z.toFixed(1)}), Distance: ${distanceToBall.toFixed(1)}, Moving to: (${optimalPos.x.toFixed(1)}, ${optimalPos.z.toFixed(1)})`);
            }
            
            if (distanceToBall < 6) { // Increased from 4 to 6 for better ball tracking
                // Move to intercept, but not too aggressively
                playerData1.targetX = optimalPos.x;
                playerData1.targetZ = optimalPos.z;
            } else {
                // Stay in good court position but track ball better
                playerData1.targetX = Math.max(-8, Math.min(-4, ballPos.x - 0.5)); // Improved tracking (was -1.5, now -0.5)
                playerData1.targetZ = Math.max(-2, Math.min(2, ballPos.z * 0.5)); // Increased responsiveness from 0.3 to 0.5
            }
            
            // Reset rotation to normal during play
            const neutralRotation = Math.PI/2; // Facing forward (+Z axis)
            player1.rotation.y = THREE.MathUtils.lerp(player1.rotation.y, neutralRotation, 0.08);
        } else {
            // Ball not coming to player 1 - stay in good court coverage position
            // Position based on ball location for better court coverage
            const courtCoverageX = -6.0; // Moved slightly forward from -6.5 for better court coverage
            const courtCoverageZ = Math.max(-2.5, Math.min(1, -1.5 + ballPos.z * 0.3)); // Increased responsiveness from 0.2 to 0.3
            
            playerData1.targetX = courtCoverageX;
            playerData1.targetZ = courtCoverageZ;
            
            // Reset rotation to normal during play
            const neutralRotation = Math.PI/2; // Facing forward (+Z axis)
            player1.rotation.y = THREE.MathUtils.lerp(player1.rotation.y, neutralRotation, 0.08);
        }
    }
    // When ball is not in play, stay in ready position
    else {
        // Good ready position for court coverage (left side like real tennis)
        playerData1.targetX = -6.0; // Moved forward from -6.5 for better court coverage
        playerData1.targetZ = -1.5;
        
        // If waiting to serve, angle towards opponent
        if (gameState.waitingToServe) {
            // Calculate angle to face Player 2 at (6.5, 1.7)
            const toOpponent = new THREE.Vector3(6.5 - player1.position.x, 0, 1.7 - player1.position.z);
            const angleToOpponent = Math.atan2(toOpponent.z, toOpponent.x);
            
            // Smoothly rotate to face opponent with slight adjustment
            const targetRotation = angleToOpponent - Math.PI/4; // Slight angle for natural serving stance
            player1.rotation.y = THREE.MathUtils.lerp(player1.rotation.y, targetRotation, 0.05);
        }
    }
}

// Separate swing checking function for higher frequency updates
function checkPlayer1Swing(player1, playerData1, ballGroup, gameState) {
    const currentTime = performance.now();
    
    // Check cooldown - prevent rapid swinging
    if (currentTime < gameState.player1SwingCooldown) {
        return; // Still in cooldown, don't swing
    }
    
    // Only proceed if not already swinging and ball is in play
    if (!playerData1.swinging && gameState.ballInPlay) {
        const ballPos = ballGroup.position;
        const distanceToBall = Math.sqrt(
            Math.pow(player1.position.x - ballPos.x, 2) +
            Math.pow(player1.position.z - ballPos.z, 2)
        );
        
        // Check if this is a new ball approach (ball changed direction toward player)
        const ballMovingToPlayer = gameState.ballVelocity.x < 0;
        
        // Check if we've already attempted to swing at this ball approach
        if (gameState.player1LastAttemptedBall === gameState.ballApproachId) {
            return; // Already attempted swing for this ball approach
        }
        
        // Enhanced swing conditions - conservative timing for guaranteed hits
        const ballAtGoodHeight = ballGroup.position.y > 0.1 && ballGroup.position.y < 6.0; // Keep relaxed height range
        
        // Only swing when ball is very close - within collision detection range
        const ballInHittingRange = distanceToBall < 1.5; // Very close to collision range (1.2)
        const ballVeryClose = distanceToBall < 1.0; // Even closer for optimal hits
        
        // Conservative swing trigger - only swing when ball is definitely hittable
        const ballGenerallyTowardsPlayer = ballMovingToPlayer || Math.abs(gameState.ballVelocity.x) < 2; // Very restrictive direction check
        const shouldSwing = ballAtGoodHeight && ballGenerallyTowardsPlayer && (ballInHittingRange || ballVeryClose);
        
        if (shouldSwing) {
            // Mark this ball approach as attempted
            gameState.player1LastAttemptedBall = gameState.ballApproachId;
            
            // Set cooldown timer
            gameState.player1SwingCooldown = currentTime + gameState.swingCooldownDuration;
            
            // Execute swing
            playerData1.swinging = true;
            playerData1.swingTime = 0;
            handleBallHit(ballGroup, gameState, player1, 0);
            console.log(`Player 1 single swing! Distance: ${distanceToBall.toFixed(2)}, Approach ID: ${gameState.ballApproachId}`);
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
        // Move to ready position (right side like real tennis)
        playerData2.targetX = 6.5;
        playerData2.targetZ = 1.7;
        
        // Check if close to ready position, then disable flag
        const distanceToReady = Math.sqrt(
            Math.pow(player2.position.x - 6.5, 2) +
            Math.pow(player2.position.z - 1.7, 2)
        );
        
        if (distanceToReady < 1) {
            gameState.returnToCenter.player2 = false;
        }
    }
    
    // Realistic tennis positioning when ball is in play
    else if (gameState.ballInPlay) {
        const ballPos = ballGroup.position;
        const ballVelocity = gameState.ballVelocity;
        
        // Check if ball is coming toward player 2's side (improved logic)
        const ballComingToPlayer2 = ballVelocity.x > 0 || (ballPos.x > 1 && Math.abs(ballVelocity.x) < 4); // Reduced threshold from x > 2 to x > 1, increased velocity threshold
        
        if (ballComingToPlayer2) {
            // Only move toward ball if it's actually coming to this side
            const optimalPos = calculateOptimalPosition(player2, ballGroup, gameState, 1);
            
            // More aggressive movement - increased distance threshold
            const distanceToBall = Math.sqrt(
                Math.pow(player2.position.x - ballPos.x, 2) +
                Math.pow(player2.position.z - ballPos.z, 2)
            );
            
            // Debug logging for Player 2
            if (gameState.debug && Math.floor(Date.now() / 1000) % 3 === 0) {
                console.log(`Player 2 AI: Ball at (${ballPos.x.toFixed(1)}, ${ballPos.z.toFixed(1)}), Distance: ${distanceToBall.toFixed(1)}, Moving to: (${optimalPos.x.toFixed(1)}, ${optimalPos.z.toFixed(1)})`);
            }
            
            if (distanceToBall < 8) { // Increased from 6 to 8 for even more aggressive movement
                // Move to intercept, but not too aggressively
                playerData2.targetX = optimalPos.x;
                playerData2.targetZ = optimalPos.z;
            } else {
                // Stay in good court position but track ball more aggressively
                playerData2.targetX = Math.max(3.5, Math.min(8, ballPos.x + 0.3)); // Reduced offset from 0.5 to 0.3, expanded range
                playerData2.targetZ = Math.max(-2, Math.min(2, ballPos.z * 0.7)); // Increased responsiveness from 0.5 to 0.7
            }
        } else {
            // Ball not coming to player 2 - stay in good court coverage position
            // Position based on ball location for better court coverage
            const courtCoverageX = 6.5; // Good baseline position
            const courtCoverageZ = Math.max(-1, Math.min(2.5, 1.7 + ballPos.z * 0.2)); // Slight adjustment based on ball, biased towards right
            
            playerData2.targetX = courtCoverageX;
            playerData2.targetZ = courtCoverageZ;
        }
    }
    // When ball is not in play, stay in ready position
    else {
        // Good ready position for court coverage (right side like real tennis)
        playerData2.targetX = 6.5;
        playerData2.targetZ = 1.7;
    }
}

// Separate swing checking function for player 2
function checkPlayer2Swing(player2, playerData2, ballGroup, gameState) {
    const currentTime = performance.now();
    
    // Check cooldown - prevent rapid swinging
    if (currentTime < gameState.player2SwingCooldown) {
        return; // Still in cooldown, don't swing
    }
    
    // Only proceed if not already swinging and ball is in play
    if (!playerData2.swinging && gameState.ballInPlay) {
        const ballPos = ballGroup.position;
        const distanceToBall = Math.sqrt(
            Math.pow(player2.position.x - ballPos.x, 2) +
            Math.pow(player2.position.z - ballPos.z, 2)
        );
        
        // Check if this is a new ball approach (ball changed direction toward player)
        const ballMovingToPlayer = gameState.ballVelocity.x > 0;
        const ballWasMovingAway = !ballMovingToPlayer;
        
        // Increment ball approach ID when ball direction changes toward player
        if (ballMovingToPlayer && gameState.player2LastAttemptedBall !== gameState.ballApproachId) {
            // This is a new ball approach - reset attempt tracking
            // (ballApproachId will be updated in updatePlayer2AI if needed)
        }
        
        // Check if we've already attempted to swing at this ball approach
        if (gameState.player2LastAttemptedBall === gameState.ballApproachId) {
            return; // Already attempted swing for this ball approach
        }
        
        // Enhanced swing conditions - conservative timing for guaranteed hits
        const ballAtGoodHeight = ballGroup.position.y > 0.1 && ballGroup.position.y < 6.0; // Keep relaxed height range
        
        // Only swing when ball is very close - within collision detection range
        const ballInHittingRange = distanceToBall < 1.5; // Very close to collision range (1.2)
        const ballVeryClose = distanceToBall < 1.0; // Even closer for optimal hits
        
        // Conservative swing trigger - only swing when ball is definitely hittable
        const ballGenerallyTowardsPlayer = ballMovingToPlayer || Math.abs(gameState.ballVelocity.x) < 2; // Very restrictive direction check
        const shouldSwing = ballAtGoodHeight && ballGenerallyTowardsPlayer && (ballInHittingRange || ballVeryClose);
        
        if (shouldSwing) {
            // Mark this ball approach as attempted
            gameState.player2LastAttemptedBall = gameState.ballApproachId;
            
            // Set cooldown timer
            gameState.player2SwingCooldown = currentTime + gameState.swingCooldownDuration;
            
            // Debug info for swing timing
            console.log(`🎾 SWING DEBUG - Player 2 at (${player2.position.x.toFixed(1)}, ${player2.position.z.toFixed(1)}), Ball at (${ballPos.x.toFixed(1)}, ${ballPos.z.toFixed(1)}), Distance: ${distanceToBall.toFixed(2)}, Ball velocity: (${gameState.ballVelocity.x.toFixed(1)}, ${gameState.ballVelocity.z.toFixed(1)})`);
            
            // Execute swing
            playerData2.swinging = true;
            playerData2.swingTime = 0;
            handleBallHit(ballGroup, gameState, player2, 1);
            console.log(`Player 2 single swing! Distance: ${distanceToBall.toFixed(2)}, Approach ID: ${gameState.ballApproachId}`);
        }
    }
}

export function initializeGame(players, ballGroup, gameState, playerData) {
    console.log("Starting game!");
    
    // Reset player positions to realistic tennis ready positions (opposite sides)
    players[0].position.set(-6.0, 0, -1.5); // Player 1 on left side (moved forward)
    players[1].position.set(6.5, 0, 1.7);   // Player 2 on right side
    
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
    
    // Reset swing tracking for clean start
    gameState.ballApproachId = 0;
    gameState.player1LastAttemptedBall = -1;
    gameState.player2LastAttemptedBall = -1;
    gameState.player1SwingCooldown = 0;
    gameState.player2SwingCooldown = 0;
    
    // Set players to realistic tennis ready positions (opposite sides)
    playerData[0].targetX = -6.0;
    playerData[0].targetZ = -1.5; // Player 1 on left side
    playerData[1].targetX = 6.5;
    playerData[1].targetZ = 1.7;  // Player 2 on right side
    
    console.log("Game started. Press SPACEBAR to serve the ball.");
} 