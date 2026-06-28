// src/components/CollegeLogo.jsx

import './CollegeLogo.css'

export default function CollegeLogo() {
  return (
    <div className="college-logo">
        <div className="college-logo__icon">
          <img src="/logo.png" alt="College ERP Logo" />
        </div>
      <div className="college-logo__text">
        <span className="college-logo__title">COLLEGE ERP</span>
        <span className="college-logo__subtitle">One System, Many Solutions</span>
      </div>
    </div>
  )
}