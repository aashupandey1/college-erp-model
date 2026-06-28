// src/components/ModulesSection.jsx
import { useState } from "react";
import { moduleSections } from "../data/modules";
import "./ModulesSection.css";

export default function ModulesSection() {
  // Track open state: "sectionIndex-moduleIndex"
  const [openMap, setOpenMap] = useState({});

  const toggle = (key) => {
    setOpenMap((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <section id="modules" className="modules">
      <div className="container">
        <div className="modules__header">
          <span className="section-tag">24 Modules · 150+ Features</span>
          <h2 className="section-title">Complete ERP Modules</h2>
          <div className="divider" style={{ margin: "14px 0 0" }} />
          <p className="section-subtitle" style={{ marginTop: 12 }}>
            Every aspect of your institution — covered and automated.
          </p>
        </div>

        {moduleSections.map((sec, si) => (
          <div key={si} className="modules__section">
            <p className="modules__section-label">{sec.section}</p>
            <div className="modules__grid">
              {sec.modules.map((mod, mi) => {
                const key = `${si}-${mi}`;
                const isOpen = !!openMap[key];
                return (
                  <div key={mi} className={`mod-card ${isOpen ? "mod-card--open" : ""}`}>
                    <button
                      className="mod-card__header"
                      onClick={() => toggle(key)}
                      aria-expanded={isOpen}
                    >
                      <span className="mod-card__name">{mod.name}</span>
                      <span
                        className="mod-card__badge"
                        style={{ background: sec.bg, color: sec.color }}
                      >
                        {mod.count} features
                      </span>
                      <span
                        className={`mod-card__chevron ${isOpen ? "open" : ""}`}
                        aria-hidden="true"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </span>
                    </button>

                    {isOpen && (
                      <div className="mod-card__body">
                        {mod.features.map((feat, fi) => (
                          <div key={fi} className="mod-card__feat">
                            <span className="mod-card__feat-arrow" style={{ color: sec.color }}>›</span>
                            {feat}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
