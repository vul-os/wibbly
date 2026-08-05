/**
 * Shared value types for the tennis game module (games/tennis/*).
 *
 * Three.js's `Object3D.userData` is `Record<string, any>` by design (see
 * three's own Object3D.d.ts), so it structurally accepts any shape without a
 * cast — these aliases exist purely to give `player.userData.rightArm` and
 * friends a real, checked type at every call site instead of `any`.
 */
import type * as THREE from 'three';

/** Per-player mesh references stashed on the player's `Group.userData`, set up in `createPlayer`. */
export interface PlayerUserData {
  leftArm: THREE.Mesh;
  rightArm: THREE.Mesh;
  leftLeg: THREE.Mesh;
  rightLeg: THREE.Mesh;
  racketGroup: THREE.Group;
  body: THREE.Mesh;
  head: THREE.Mesh;
  /** Visual racket-head hit box, toggled by `toggleHitBoxVisibility`. */
  hitBox: THREE.Mesh;
}

/** A tennis player: a `THREE.Group` carrying `PlayerUserData`. */
export type PlayerObject = THREE.Group & { userData: PlayerUserData };

/** Mesh references stashed on the ball group's `userData`, set up in `createBall`. */
export interface BallUserData {
  ball: THREE.Mesh;
  collisionSphere: THREE.Mesh;
}

/** The ball: a `THREE.Group` (ball mesh + its visual collision sphere) carrying `BallUserData`. */
export type BallObject = THREE.Group & { userData: BallUserData };

/** Per-player movement/animation state, one per player, created by `createPlayerData`. */
export interface PlayerData {
  targetX: number;
  targetZ: number;
  isLeftSide: boolean;
  moveTime: number;
  swinging: boolean;
  swingTime: number;
  legPhase: number;
  x: number;
  z: number;
  homeX: number;
  homeZ: number;
  /** Lazily created by `updatePlayerMovement` on first use, for momentum smoothing. */
  velocity?: { x: number; z: number };
}

/** Which side of the net the ball last approached from, for scoring/positioning. */
export interface ReturnToCenter {
  player1: boolean;
  player2: boolean;
}

export interface Score {
  player1: number;
  player2: number;
}

/** Full per-match mutable state, created by `createGameState`. */
export interface GameState {
  ballVelocity: THREE.Vector3;
  ballInPlay: boolean;
  waitingToServe: boolean;
  lastHitBy: number | null;
  score: Score;
  debug: boolean;
  lastMoveTime: number;
  returnToCenter: ReturnToCenter;
  usePoseDetection: boolean;
  lastAIUpdate: number;
  aiUpdateInterval: number;
  player1LastSwingCheck: number;
  player2LastSwingCheck: number;
  swingCheckInterval: number;
  player1SwingCooldown: number;
  player2SwingCooldown: number;
  swingCooldownDuration: number;
  ballApproachId: number;
  player1LastAttemptedBall: number;
  player2LastAttemptedBall: number;
}

/** `'left' | 'right'` swing direction, as fed from a gesture or the spacebar fallback. */
export type SwingDirection = 'left' | 'right';
