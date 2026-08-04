import * as THREE from 'three';
import { debugLog } from './debug';
import type { BallObject, GameState, PlayerObject, SwingDirection } from './types';

/** Minimal clock surface `updateBallPhysics` reads — satisfied by `THREE.Clock` or a test stub. */
export interface BallPhysicsClock {
    elapsedTime: number;
}

export function createBall(scene: THREE.Scene): BallObject {
    // Create a group to hold both the ball and its collision sphere
    const ballGroup = new THREE.Group();
    
    const ballGeometry = new THREE.SphereGeometry(0.105, 32, 32); // 25% smaller than 0.14
    const ballMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 }); // Yellow ball
    const ball = new THREE.Mesh(ballGeometry, ballMaterial);
    ball.castShadow = true;
    ballGroup.add(ball);
    
    // CREATE VISUAL COLLISION SPHERE for ball collision detection
    const collisionSphereGeometry = new THREE.SphereGeometry(0.105, 16, 16); // Same radius as ball
    const collisionSphereMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xff0000,        // Bright red
        wireframe: true,        // Wireframe mode
        transparent: true,      // Make it semi-transparent
        opacity: 0.6           // Adjust visibility
    });
    const collisionSphere = new THREE.Mesh(collisionSphereGeometry, collisionSphereMaterial);
    
    // Position the collision sphere exactly at the ball position
    collisionSphere.position.copy(ball.position);
    ballGroup.add(collisionSphere);
    
    ballGroup.position.set(-8, 1, 0); // Start position near player 1 at court end
    
    // Store reference to collision sphere for easy access
    ballGroup.userData = {
        ball: ball,
        collisionSphere: collisionSphere
    };

    scene.add(ballGroup);
    return ballGroup as BallObject; // Return the group instead of just the ball
}

// Helper function to position ball correctly for serving
function positionBallForServing(ballGroup: BallObject, player1: PlayerObject): void {
    // Get the racket's world position for accurate serving position
    const racketGroup = player1.userData.racketGroup;
    const racketHead = racketGroup.children[0]; // First child is the racket head
    
    // Get world position of racket head
    const worldPosition = new THREE.Vector3();
    racketHead.getWorldPosition(worldPosition);
    
    // Position ball slightly in front of racket face in the direction it's facing
    const racketForward = new THREE.Vector3(0, 0, 1);
    const worldMatrix = new THREE.Matrix4();
    racketHead.updateMatrixWorld(true);
    worldMatrix.copy(racketHead.matrixWorld);
    const rotationMatrix = new THREE.Matrix3().setFromMatrix4(worldMatrix);
    racketForward.applyMatrix3(rotationMatrix);
    
    // Position ball group in front of racket
    ballGroup.position.copy(worldPosition);
    ballGroup.position.add(racketForward.multiplyScalar(0.2)); // 0.2 units in front of racket
    
    // Debug logs removed for cleaner console output
}

export function updateBallPhysics(
    ballGroup: BallObject,
    gameState: GameState,
    delta: number,
    clock: BallPhysicsClock,
    players: PlayerObject[],
): void {
    // Keep ball with player 1 if waiting to serve
    if (!gameState.ballInPlay && gameState.waitingToServe) {
        const player1 = players[0];
        
        // Use the new positioning function for accurate ball placement
        positionBallForServing(ballGroup, player1);
        return;
    }
    
    if (!gameState.ballInPlay) return;
    
    // Apply gravity
    gameState.ballVelocity.y -= 9.8 * delta;
    
    // Update position
    ballGroup.position.x += gameState.ballVelocity.x * delta;
    ballGroup.position.y += gameState.ballVelocity.y * delta;
    ballGroup.position.z += gameState.ballVelocity.z * delta;
    
    // Prevent ball from going below ground with stronger bounce
    if (ballGroup.position.y < 0.105) { // Adjusted for 25% smaller ball size
        ballGroup.position.y = 0.105;
        // Stronger bounce - increased from 0.7 to 0.85
        gameState.ballVelocity.y = Math.abs(gameState.ballVelocity.y) * 0.85;
        
        // If ball hits ground, check for scoring
        if (Math.abs(ballGroup.position.x) > 10) {
            debugLog("Ball out of bounds!");
            resetBall(ballGroup, gameState, players);
        }
    }
    
    // Ball out of bounds check
    if (Math.abs(ballGroup.position.x) > 12 || Math.abs(ballGroup.position.z) > 7 || ballGroup.position.y > 15) {
        debugLog("Ball out of bounds!");
        resetBall(ballGroup, gameState, players);
    }
    
    // Log ball state every few seconds for debugging
    if (gameState.debug && Math.floor(clock.elapsedTime * 10) % 30 === 0) {
        debugLog(`Ball pos: (${ballGroup.position.x.toFixed(2)}, ${ballGroup.position.y.toFixed(2)}, ${ballGroup.position.z.toFixed(2)})`);
        debugLog(`Ball velocity: (${gameState.ballVelocity.x.toFixed(2)}, ${gameState.ballVelocity.y.toFixed(2)}, ${gameState.ballVelocity.z.toFixed(2)})`);
    }
}

export function resetBall(ballGroup: BallObject, gameState: GameState, players: PlayerObject[]): void {
    gameState.ballInPlay = false;
    gameState.waitingToServe = true;
    
    // Reset ball approach ID for new point - clears all swing attempts
    gameState.ballApproachId = (gameState.ballApproachId || 0) + 1;
    gameState.player1LastAttemptedBall = -1;
    gameState.player2LastAttemptedBall = -1;
    
    // Reset swing cooldowns for new point
    gameState.player1SwingCooldown = 0;
    gameState.player2SwingCooldown = 0;
    
    // Use accurate positioning for ball reset
    const player1 = players[0];
    positionBallForServing(ballGroup, player1);
    gameState.ballVelocity.set(0, 0, 0);
    
    debugLog("Ball reset. Press SPACEBAR to serve again.");
}

// Helper function to check if a sphere intersects with an oriented bounding box
function sphereIntersectsOBB(
    sphereCenter: THREE.Vector3,
    sphereRadius: number,
    obbCenter: THREE.Vector3,
    obbSize: THREE.Vector3,
    obbRotationMatrix: THREE.Matrix3,
): boolean {
    // Transform sphere center to OBB's local space
    const localSphereCenter = sphereCenter.clone().sub(obbCenter);
    localSphereCenter.applyMatrix3(obbRotationMatrix.clone().transpose());
    
    // Find the closest point on the box to the sphere center
    const closestPoint = new THREE.Vector3(
        Math.max(-obbSize.x / 2, Math.min(obbSize.x / 2, localSphereCenter.x)),
        Math.max(-obbSize.y / 2, Math.min(obbSize.y / 2, localSphereCenter.y)),
        Math.max(-obbSize.z / 2, Math.min(obbSize.z / 2, localSphereCenter.z))
    );
    
    // Check if the distance from sphere center to closest point is within radius
    const distance = localSphereCenter.distanceTo(closestPoint);
    return distance <= sphereRadius;
}

interface RacketHeadTransform {
    position: THREE.Vector3;
    rotation: THREE.Matrix3;
    size: THREE.Vector3;
}

// Helper function to get racket head's world transformation
function getRacketHeadTransform(player: PlayerObject, playerIndex: number): RacketHeadTransform {
    const racketGroup = player.userData.racketGroup;
    const racketHead = racketGroup.children[0]; // First child is the racket head
    
    // Get world position
    const worldPosition = new THREE.Vector3();
    racketHead.getWorldPosition(worldPosition);
    
    // Get world rotation matrix
    const worldMatrix = new THREE.Matrix4();
    racketHead.updateMatrixWorld(true);
    worldMatrix.copy(racketHead.matrixWorld);
    
    // Extract rotation matrix
    const rotationMatrix = new THREE.Matrix3().setFromMatrix4(worldMatrix);
    
    // Get scaled racket head size (original: 0.7, 0.7, 0.05, scaled by 0.63)
    const scale = 0.63;
    const racketSize = new THREE.Vector3(0.7 * scale, 0.7 * scale, 0.05 * scale);
    
    return {
        position: worldPosition,
        rotation: rotationMatrix,
        size: racketSize
    };
}

export function handleBallHit(
    ballGroup: BallObject,
    gameState: GameState,
    player: PlayerObject,
    playerIndex: number,
    swingDirection: SwingDirection = 'right',
    confidence = 1,
): boolean {
    // GestureEvent.confidence is 0..1 and the input contract is explicit that
    // games MUST NOT treat it as a clean signal — an Attested gesture is
    // never replay-verifiable and never certain (see wibbly-input's
    // GestureEvent doc). AI-driven hits (game-logic.js) and the spacebar
    // fallback never pass one, so they stay at full, deterministic power;
    // only a real camera-detected swing can come in under 1. Clamped and
    // NaN-guarded since it crosses a library boundary.
    const swingConfidence = Number.isFinite(confidence) ? Math.min(1, Math.max(0, confidence)) : 1;
    const rightArm = player.userData.rightArm;
    const racketGroup = player.userData.racketGroup;
    
    // Get accurate racket head transformation
    const racketTransform = getRacketHeadTransform(player, playerIndex);
    
    // Ball properties
    const ballRadius = 0.105; // Our ball radius (25% smaller)
    const ballPosition = ballGroup.position.clone(); // Use ballGroup position
    
    // Check collision using oriented bounding box
    const isColliding = sphereIntersectsOBB(
        ballPosition,
        ballRadius,
        racketTransform.position,
        racketTransform.size,
        racketTransform.rotation
    );
    
    // Calculate distance for debugging (still useful for logs)
    const racketToBallDistance = racketTransform.position.distanceTo(ballPosition);
    
    // Enhanced collision detection with timing window
    const isSwinging = (player.userData.rightArm.rotation.x !== 0 || player.userData.rightArm.rotation.y !== 0 || player.userData.rightArm.rotation.z !== 0);
    
    debugLog(`Player ${playerIndex + 1} - Distance: ${racketToBallDistance.toFixed(2)}, Colliding: ${isColliding}, Swinging: ${isSwinging}`);
    
    // Debug info available if needed, but removed for cleaner output
    
    // If ball not in play yet and racket is close enough, serve it (adjusted for smaller players)
    if (!gameState.ballInPlay && racketToBallDistance < 0.9 && playerIndex === 0) {
        gameState.ballInPlay = true;
        gameState.waitingToServe = false;
        
        // Calculate serve direction based on racket orientation
        const racketForward = new THREE.Vector3(0, 0, 1);
        racketForward.applyMatrix3(racketTransform.rotation);
        
        // Direct the serve toward player 2's actual position (diagonal serve)
        const targetX = 6.5; // Player 2's actual X position
        const targetZ = 1.8; // Adjusted for opponent's right-side positioning relative to ball
        const dirVec = new THREE.Vector3(targetX - player.position.x, 0, targetZ - player.position.z);
        dirVec.normalize();
        
        // Blend racket direction with target direction for more realistic serve
        const blendedDirection = racketForward.clone().multiplyScalar(0.3).add(dirVec.multiplyScalar(0.7));
        blendedDirection.normalize();
        
        // Add velocity with racket-influenced direction
        gameState.ballVelocity.set(
            blendedDirection.x * (12 + Math.random() * 2),
            6 + Math.random(),
            blendedDirection.z * (6 + Math.random() * 2)
        );
        
        gameState.lastHitBy = playerIndex;
        
        // Increment ball approach ID for new ball trajectory - resets swing attempts
        gameState.ballApproachId = (gameState.ballApproachId || 0) + 1;
        
        debugLog("Ball served toward player 2's actual position with diagonal trajectory!");
        return true;
    }
    // If ball is close to racket during play, hit it (adjusted for smaller players)
    else if (racketToBallDistance < 1.6) { // Increased from 1.2 to 1.6 to handle timing gaps
        // Calculate hit direction based on racket face normal and swing
        const racketForward = new THREE.Vector3(0, 0, 1);
        racketForward.applyMatrix3(racketTransform.rotation);
        
        // Get racket's right vector for cross-court shots
        const racketRight = new THREE.Vector3(1, 0, 0);
        racketRight.applyMatrix3(racketTransform.rotation);
        
        // Base speed with some variation, tempered by how sure the input
        // pipeline is that this was actually a swing. The recognizer only
        // ever emits an event once its own thresholds are cleared (so this
        // never drops below ~0.85x here), but a marginal detection still
        // reads as a softer, less committed shot rather than the same
        // full-power swing as a clean one.
        const powerFactor = THREE.MathUtils.lerp(0.7, 1.0, swingConfidence);
        const baseSpeed = (12 + Math.random() * 3) * powerFactor;
        const arcHeight = 5 + Math.random() * 3;
        
        // Calculate hit direction based on swing direction and racket orientation
        let hitDirection = racketForward.clone();
        
        if (playerIndex === 0) { // Player 1
            // Ensure ball generally goes toward player 2 (positive X)
            if (hitDirection.x < 0) hitDirection.x = Math.abs(hitDirection.x);
            
            // Apply swing direction influence
            if (swingDirection === 'left') {
                hitDirection.add(racketRight.clone().multiplyScalar(-0.5)); // Cross-court left
            } else if (swingDirection === 'right') {
                hitDirection.add(racketRight.clone().multiplyScalar(0.5));  // Cross-court right
            }
        } else { // Player 2
            // Ensure ball generally goes toward player 1 (negative X)
            if (hitDirection.x > 0) hitDirection.x = -Math.abs(hitDirection.x);
            
            // Apply swing direction influence (mirrored)
            if (swingDirection === 'left') {
                hitDirection.add(racketRight.clone().multiplyScalar(0.5));
            } else if (swingDirection === 'right') {
                hitDirection.add(racketRight.clone().multiplyScalar(-0.5));
            }
        }
        
        // Normalize and apply speed
        hitDirection.normalize();
        
        // Set velocity with racket-based direction
        gameState.ballVelocity.set(
            hitDirection.x * baseSpeed,
            arcHeight,
            hitDirection.z * (baseSpeed * 0.7) // Slightly reduce Z component for better court play
        );
        
        gameState.lastHitBy = playerIndex;
        
        // Increment ball approach ID for new ball trajectory - resets swing attempts
        gameState.ballApproachId = (gameState.ballApproachId || 0) + 1;
        
        // Flag player to return to center
        if (playerIndex === 0) {
            gameState.returnToCenter.player1 = true;
        } else {
            gameState.returnToCenter.player2 = true;
        }
        
        debugLog(`Ball hit by player ${playerIndex + 1} with accurate racket collision! Direction: ${swingDirection}`);
        return true;
    } else if (racketToBallDistance < 0.45) {
        // Close miss - provide feedback
        debugLog(`Player ${playerIndex + 1} close miss - Distance: ${racketToBallDistance.toFixed(2)}, Colliding: ${isColliding}, Swinging: ${isSwinging}`);
        return false;
    } else {
        // Far miss
        return false;
    }
} 