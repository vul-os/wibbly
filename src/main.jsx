import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Navigate, Routes, Route } from 'react-router-dom';

// Firebase Analytics was removed deliberately: it is a central tracking beacon
// in a product whose thesis is decentralization (see WIBBLY.md §7). No
// analytics SDK replaces it.

import './style.css';

import Title from './pages/title.jsx';
import Setup from './pages/setup.jsx';
import Play from './pages/play.jsx';
import NotFound from './pages/not-found.jsx';
import Demo from './pages/demo.jsx';
import { isDemo } from './mode.js';

/**
 * Four surfaces, and that is the whole app:
 *
 *   /        title screen — pick a game
 *   /setup   first-run camera flow (permission explainer → handedness → framing)
 *   /play    tennis + its in-game menu
 *   *        404
 *
 * The marketing pages that used to live here are gone. The product's public
 * writing belongs to site/landing.html and site/docs (WIBBLY.md §8, phase 2);
 * duplicating it inside the app only created a second place for claims to
 * drift out of date.
 */
/**
 * Demo mode is deliberately NOT a route inside the app above.
 *
 * It renders one component and nothing else — no Router, no history, no 404,
 * no route that could push the embedding page somewhere unexpected. A router
 * inside an iframe is a way to navigate the frame, and the demo's contract
 * with the page hosting it is that it never navigates at all.
 *
 * Dropping the router also drops react-router from the demo bundle.
 */
function App() {
  if (isDemo()) return <Demo />;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Title />} />
        <Route path="/setup" element={<Setup />} />
        <Route path="/play" element={<Play />} />

        {/* Legacy route from the old marketing shell. */}
        <Route path="/tennis" element={<Navigate to="/play" replace />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
