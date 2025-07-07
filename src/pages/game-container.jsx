import React, { useState } from 'react';
import GameMenu from './GameMenu.jsx';
import TennisGame from '../game/index.js';

const GameContainer = () => {
  const [gameState, setGameState] = useState('menu'); // 'menu' or 'tennis'
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleStartTennis = () => {
    setIsTransitioning(true);
    
    // Add a brief transition delay for better UX
    setTimeout(() => {
      setGameState('tennis');
      setIsTransitioning(false);
    }, 500);
  };

  const handleBackToMenu = () => {
    setIsTransitioning(true);
    
    setTimeout(() => {
      setGameState('menu');
      setIsTransitioning(false);
    }, 300);
  };

  if (isTransitioning) {
    return (
      <div className="game-transition">
        <div className="transition-content">
          <div className="transition-logo">
            <span className="logo-text">Wibbly</span>
            <span className="logo-suffix">.io</span>
          </div>
          <div className="transition-text">
            {gameState === 'menu' ? 'Starting Tennis...' : 'Returning to Menu...'}
          </div>
          <div className="transition-loader">
            <div className="loader-bar"></div>
          </div>
        </div>

        <style jsx>{`
          .game-transition {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background: linear-gradient(135deg, #e0f2f1 0%, #f1f8e9 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
          }

          .transition-content {
            text-align: center;
            background: rgba(255, 255, 255, 0.9);
            padding: 3rem 2rem;
            border-radius: 20px;
            border: 1px solid rgba(79, 209, 199, 0.2);
            backdrop-filter: blur(10px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          }

          .transition-logo {
            font-size: 3rem;
            font-weight: 900;
            margin-bottom: 1rem;
            font-family: 'Inter', sans-serif;
          }

          .logo-text {
            background: linear-gradient(135deg, #4fd1c7 0%, #81c784 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .logo-suffix {
            color: #66bb6a;
          }

          .transition-text {
            color: #388e3c;
            font-size: 1.1rem;
            margin-bottom: 2rem;
            font-family: 'Inter', sans-serif;
          }

          .transition-loader {
            width: 200px;
            height: 4px;
            background: rgba(79, 209, 199, 0.2);
            border-radius: 2px;
            overflow: hidden;
            position: relative;
            margin: 0 auto;
          }

          .loader-bar {
            height: 100%;
            background: linear-gradient(135deg, #4fd1c7 0%, #26a69a 100%);
            border-radius: 2px;
            animation: loading 1s ease-in-out infinite;
          }

          @keyframes loading {
            0% { width: 0%; margin-left: 0%; }
            50% { width: 75%; margin-left: 12.5%; }
            100% { width: 0%; margin-left: 100%; }
          }
        `}</style>
      </div>
    );
  }

  if (gameState === 'tennis') {
    return (
      <div className="tennis-container">
        {/* Game Navigation Overlay */}
        <div className="game-nav">
          <button onClick={handleBackToMenu} className="back-btn">
            <svg className="back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Menu</span>
          </button>
        </div>

        {/* Tennis Game */}
        <TennisGame />

        <style jsx>{`
          .tennis-container {
            position: relative;
            width: 100%;
            height: 100vh;
            overflow: hidden;
          }

          .game-nav {
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 1000;
            pointer-events: auto;
          }

          .back-btn {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1rem;
            background: rgba(15, 15, 35, 0.9);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            color: #ffffff;
            font-family: 'Inter', sans-serif;
            font-size: 0.9rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
          }

          .back-btn:hover {
            background: rgba(15, 15, 35, 0.95);
            border-color: rgba(99, 102, 241, 0.3);
            transform: translateY(-1px);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          }

          .back-icon {
            width: 1rem;
            height: 1rem;
          }

          @media (max-width: 768px) {
            .game-nav {
              top: 15px;
              left: 15px;
            }

            .back-btn {
              padding: 0.5rem 0.75rem;
              font-size: 0.8rem;
            }

            .back-btn span {
              display: none;
            }
          }
        `}</style>
      </div>
    );
  }

  // Default: Show game menu
  return <GameMenu onStartTennis={handleStartTennis} />;
};

export default GameContainer; 