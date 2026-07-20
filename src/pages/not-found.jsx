import React from 'react';
import { Link } from 'react-router-dom';

/** 404 — out of bounds. Small on purpose: a dead end should point home, not sell. */
export default function NotFound() {
  return (
    <div className="wb-court">
      <div className="wb-grain" aria-hidden="true" />
      <div className="wb-stage wb-404">
        <div className="wb-404__inner wb-rise">
          <p className="wb-eyebrow">404 — out of bounds</p>
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

        {/* The line the ball landed behind. The only ornament on the page. */}
        <svg className="wb-404__mark" viewBox="0 0 300 120" aria-hidden="true">
          <path d="M0 92 H300" stroke="var(--court-line-bright)" strokeWidth="2" />
          <path
            d="M20 78 Q120 10 236 54"
            fill="none" stroke="var(--accent)" strokeWidth="2"
            strokeDasharray="4 6" strokeLinecap="round" opacity=".55"
          />
          <circle cx="248" cy="60" r="7" fill="var(--accent)" />
        </svg>
      </div>

      <style>{`
        .wb-404 {
          display: flex; flex-direction: column; align-items: flex-start;
          justify-content: center; min-height: 70vh; gap: 2rem;
        }
        .wb-404__inner { display: flex; flex-direction: column; align-items: flex-start; }
        .wb-404__actions { display: flex; gap: .75rem; flex-wrap: wrap; margin-top: 1.75rem; }
        .wb-404__mark { width: min(300px, 70%); height: auto; opacity: .8; }
      `}</style>
    </div>
  );
}
