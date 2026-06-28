import { useState } from "react";
import { navItems } from "../constants/navItems";
import { IC } from "../constants/iconMap";
/* ════════════════════════════════════════
   SHARED: LAYOUT SHELL
════════════════════════════════════════ */
function Shell({ active, onNav, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="ad-page">
      <nav className="ad-navbar">
        <div className="ad-nav-left">
          <div className="ad-nav-icon">
            <img src="/logo.png" alt="Logo" />
          </div>
          <div className="ad-nav-text">
            <span className="ad-nav-title">COLLEGE ERP</span>
            <span className="ad-nav-sep"> One System Many Solution </span>
          </div>
        </div>
        <div className="ad-nav-right">
          <div className="ad-search">
            {IC.Search} Search...
          </div>
          <div className="ad-notif">
            {IC.Bell}
            <span className="ad-notif-dot">5</span>
          </div>
          <div className="ad-avatar">AD</div>
          <button
            className="ad-menu-btn"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
        </div>
      </nav>

      <div className="ad-body">
        <aside className={`ad-sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="ad-sidebar-close">
            <button
              className="ad-close-btn"
              onClick={() => setSidebarOpen(false)}
            >
              ✕
            </button>
          </div>
          <div className="ad-sb-user">
            <div className="ad-sb-avatar">AD</div>
            <div className="ad-sb-name">Administrator</div>
            <div className="ad-sb-role">Super Admin</div>
          </div>
          <nav className="ad-sb-nav">
            {navItems.map(item => (
              <div
                key={item.id}
                className={`ad-sb-item ${active === item.id ? 'active' : ''}`}
                onClick={() => {
                  onNav(item.id);
                  setSidebarOpen(false);
                }}
              >
                {item.icon}
                {item.label}
                {item.badge && (
                  <span className="ad-sb-badge" style={{ background: item.badgeColor, color: item.badgeText }}>
                    {item.badge}
                  </span>
                )}
              </div>
            ))}
          </nav>
        </aside>
        {sidebarOpen && (
          <div
            className="ad-sidebar-overlay"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="ad-content">{children}</main>
      </div>
    </div>
  )
}


export default Shell