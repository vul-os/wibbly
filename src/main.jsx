import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Firebase analytics to initialize it
import { analytics } from './services/firebase.js';

// Import pages and components
import Home from './pages/home.jsx';
import About from './pages/about.jsx';
import TennisGamePage from './pages/game-tennis.jsx';
import NotFound from './pages/not-found.jsx';

function App() {
  return (
    <Router>
      <Routes>
        {/* Home/Landing page */}
        <Route path="/" element={<Home />} />
        
        {/* About page */}
        <Route path="/about" element={<About />} />
        
        {/* Tennis game - now at /play */}
        <Route path="/play" element={<TennisGamePage />} />
        
        {/* Legacy redirects */}
        <Route path="/tennis" element={<TennisGamePage />} />
        
        {/* 404 Not Found - must be last */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
); 