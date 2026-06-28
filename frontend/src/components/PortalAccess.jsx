  // src/components/PortalAccess.jsx
  import { portalRoles } from "../data/modules";
  import "./PortalAccess.css";
  import {
    IconShieldCheck,
    IconHOD,
    IconUserGraduate,
    IconUsers,
    IconCalculator,
    IconUsersGroup,
    IconDashboard
  } from "../components/Icons";

  const ICONS = {
    shield: <IconShieldCheck size={34} />,
    hod: <IconHOD size={34} />,
    faculty: <IconUsersGroup size={34} />,
    student: <IconUserGraduate size={34} />,
    parent: <IconUsers size={34} />,
    accountant: <IconCalculator size={34} />
  };

  export default function PortalAccess() {
    return (
      <section id="portal" className="portal">
        <div className="container">
          <div className="portal__header">
            <h2 className="section-title">Access Your Portal</h2>
            <div className="divider" />
            <p className="section-subtitle" style={{ margin: "12px auto 0", textAlign: "center" }}>
              Select your role to get started
            </p>
          </div>

          <div className="portal__grid">
            {portalRoles.map((role) => (
              <div key={role.name} className="portal__card fade-in">
                <div
                  className="portal__card-icon"
                  style={{ background: role.bg, color: role.color }}
                >
                  {ICONS[role.icon]}
                </div>
                <h3 className="portal__card-name">{role.name}</h3>
                <p className="portal__card-desc">{role.description}</p>
                <a
                  href={role.path}
                  className="portal__card-link"
                  style={{ color: role.color }}
                >
                  Login
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
