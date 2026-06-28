// src/components/WhyChoose.jsx
import { whyChooseUs } from "../data/modules";
import "./WhyChoose.css";

const ICONS = {
  "shield-check": (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  ),
  "trending-up": (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  "clock": (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  "smartphone": (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  ),
};

export default function WhyChoose() {
  return (
    <section id="features" className="why">
      <div className="container">
        <div className="why__header">
          <h2 className="section-title">Why Choose Our ERP?</h2>
          <div className="divider" />
          <p className="section-subtitle" style={{ margin: "12px auto 0", textAlign: "center" }}>
            Built for modern educational institutions
          </p>
        </div>

        <div className="why__grid">
          {whyChooseUs.map((item, i) => (
            <div key={i} className="why__card fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
              <div
                className="why__icon"
                style={{ background: item.bg, color: item.color }}
              >
                {ICONS[item.icon]}
              </div>
              <h3 className="why__title">{item.title}</h3>
              <p className="why__desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
