import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TennisGame from '../game';

const TennisGamePage = () => {
  const navigate = useNavigate();
  const [isGameStarted, setIsGameStarted] = useState(false);

  useEffect(() => {
    // Auto-start the game after a short delay
    const timer = setTimeout(() => {
      setIsGameStarted(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleGoHome = () => {
    navigate('/');
  };

  if (!isGameStarted) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-logo">
            <span className="logo-text">Wibbly</span>
            <span className="logo-suffix">.io</span>
          </div>
          <div className="loading-text">Loading Tennis Game...</div>
          <div className="loading-bar">
            <div className="loading-progress"></div>
          </div>
        </div>

        <style jsx>{`
          .loading-container {
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

          .loading-content {
            text-align: center;
            background: rgba(255, 255, 255, 0.9);
            padding: 3rem 2rem;
            border-radius: 20px;
            border: 1px solid rgba(79, 209, 199, 0.2);
            backdrop-filter: blur(10px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          }

          .loading-logo {
            font-size: 2.5rem;
            font-weight: 800;
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

          .loading-text {
            color: #388e3c;
            font-size: 1.1rem;
            margin-bottom: 2rem;
            font-family: 'Inter', sans-serif;
          }

          .loading-bar {
            width: 200px;
            height: 4px;
            background: rgba(79, 209, 199, 0.2);
            border-radius: 2px;
            overflow: hidden;
            margin: 0 auto;
          }

          .loading-progress {
            height: 100%;
            background: linear-gradient(135deg, #4fd1c7 0%, #26a69a 100%);
            border-radius: 2px;
            animation: loading 1.5s ease-in-out infinite;
          }

          @keyframes loading {
            0% { width: 0%; }
            100% { width: 100%; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="tennis-game-page">
      {/* Tennis Game - No navigation overlay */}
      <TennisGame />

      <style jsx>{`
        .tennis-game-page {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default TennisGamePage; 