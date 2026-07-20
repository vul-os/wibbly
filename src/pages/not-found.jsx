import React from 'react';
import { Link } from 'react-router-dom';

/** 404 — out of bounds. Small on purpose: a dead end should point home, not sell. */
export default function NotFound() {
  return (
    <div className="wb-court">
      <div className="wb-stage wb-404">
        <p className="wb-eyebrow">404 · out of bounds</p>
        <h1 className="wb-wordmark">out</h1>
        <p className="wb-tagline">That route does not exist. The ball landed outside the lines.</p>
        <div className="wb-404__actions">
          <Link to="/" className="wb-btn wb-btn--primary">
            Back to the title screen
          </Link>
          <Link to="/setup" className="wb-btn wb-btn--ghost">
            Camera setup
          </Link>
        </div>
      </div>

      <style>{`
        .wb-404 { display: flex; flex-direction: column; align-items: flex-start; justify-content: center; min-height: 70vh; }
        .wb-404__actions { display: flex; gap: .75rem; flex-wrap: wrap; margin-top: 1.75rem; }
      `}</style>
    </div>
  );
}
