// src/components/Hero.jsx
import { stats } from "../data/modules";
import "./Hero.css";

// College building image from Unsplash (free to use)
const COLLEGE_IMG =
  "https://images.unsplash.com/photo-1562774053-701939374585?w=900&q=80&auto=format&fit=crop";

export default function Hero() {
  return (
    <section id="home" className="hero">
      {/* Background dots decoration */}
      <div className="hero__dots hero__dots--1" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} className="hero__dot" />
        ))}
      </div>
      <div className="hero__dots hero__dots--2" aria-hidden="true">
        {Array.from({ length: 9 }).map((_, i) => (
          <span key={i} className="hero__dot" />
        ))}
      </div>

      <div className="container hero__inner">
        {/* Left: Text */}
        <div className="hero__content">
          <div className="hero__badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            Smart Campus. Seamless Management.
          </div>

          <h1 className="hero__title">
            COLLEGE <span className="hero__title-accent">ERP</span>
          </h1>

          <p className="hero__subtitle">
            Empowering Education, Simplifying Management
          </p>
          <div className="hero__divider" />
          {/* Ensure visible content even if other styles fail */}
          <div style={{ display: 'none' }}>Hero content loaded</div>
          <p className="hero__desc">
            A unified platform to manage academic, administrative
            and student life activities efficiently.
          </p>

          <div className="hero__actions">
            <a href="#portal" className="btn btn--primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              Login to Portal
            </a>
            <a href="#modules" className="btn btn--outline">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              Explore Modules
            </a>
          </div>

          {/* Stats Row */}
          <div className="hero__stats">
            {stats.map((s, i) => (
              <div key={i} className="hero__stat">
                <span className="hero__stat-value">{s.value}</span>
                <span className="hero__stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Image with clipped shape */}
        <div className="hero__image-wrap">
          <div className="hero__image-bg" />
          <img
            src={COLLEGE_IMG}
            alt="College campus"
            className="hero__image"
          />
        </div>
      </div>
    </section>
  );
}
