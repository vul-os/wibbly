# Tennis Game Module

This directory contains the tennis game organized into logical, modular components for better maintainability.

## File Structure

### Core Components

- **`Game.jsx`** - Main game component that orchestrates the entire tennis game
- **`index.js`** - Entry point that exports the main TennisGame component

### Game Systems

- **`Player.js`** - Player creation, movement, and animation logic
  - `createPlayer()` - Creates 3D player models with rackets
  - `updatePlayerMovement()` - Handles player movement and walking animations
  - `updatePlayerSwing()` - Manages racket swing animations

- **`Ball.js`** - Ball physics and interaction logic
  - `createBall()` - Creates the tennis ball
  - `updateBallPhysics()` - Handles ball movement, gravity, and collisions
  - `handleBallHit()` - Manages ball hitting mechanics
  - `resetBall()` - Resets ball position after points

- **`Court.js`** - Court loading and creation
  - `loadCourt()` - Loads 3D court model from GLB file
  - `createSimpleCourt()` - Fallback simple court if model fails to load

- **`GameLogic.js`** - Game state management and AI
  - `createGameState()` - Initializes game state object
  - `createPlayerData()` - Initializes player data arrays
  - `updatePlayerPositions()` - Random player movement logic
  - `updatePlayer1AI()` / `updatePlayer2AI()` - AI behavior for players
  - `initializeGame()` - Game initialization function

## Usage

The game is imported and used in `main.jsx`:

```jsx
import TennisGame from './game';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <TennisGame />
    </React.StrictMode>
);
```

## Features

- 3D tennis game with physics simulation
- AI players with intelligent ball tracking
- Pose detection for player control via webcam
- Realistic tennis mechanics (serving, hitting, court boundaries)
- Modular architecture for easy maintenance and extension

## Dependencies

- Three.js for 3D graphics
- React for UI components
- Pose detection library for motion control 