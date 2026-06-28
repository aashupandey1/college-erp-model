import { useState, useEffect, useCallback, useRef } from "react";
import { navItems } from "../constants/navItems";
import { IC } from "../constants/iconMap";

/* ════════════════════════════════════════
   SHARED: LAYOUT SHELL
   FIX LOG:
   - Sidebar open/close now uses CSS class + left/right CSS only
   - Touch events + pointer events unified
   - Body scroll lock on sidebar open (prevents iOS bounce drift)
   - Overlay is a real DOM element (not conditional render) — avoids
     React timing issues that broke touch on real Android
   - z-index properly layered: overlay 998, sidebar 999, navbar 100
   - No transform tricks — pure left CSS transition for reliability
   - Click, touch, keyboard (Escape) all close the sidebar
════════════════════════════════════════ */

function Shell({ active, onNav, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const overlayRef = useRef(null);

  /* ── Lock / unlock body scroll when sidebar is open ── */
  useEffect(() => {
    const body = document.body;
    if (sidebarOpen) {
      // Store scroll position to prevent iOS jump
      const scrollY = window.scrollY;
      body.style.overflow = "hidden";
      body.style.position = "fixed";
      body.style.top = `-${scrollY}px`;
      body.style.width = "100%";
    } else {
      const scrollY = body.style.top;
      body.style.overflow = "";
      body.style.position = "";
      body.style.top = "";
      body.style.width = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }
    return () => {
      body.style.overflow = "";
      body.style.position = "";
      body.style.top = "";
      body.style.width = "";
    };
  }, [sidebarOpen]);

  /* ── Escape key closes sidebar ── */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [sidebarOpen]);

  const openSidebar = useCallback(() => {
    setSidebarOpen(true);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const handleNavItem = useCallback(
    (id) => {
      onNav(id);
      // Close sidebar after nav on any screen
      setSidebarOpen(false);
    },
    [onNav]
  );

  return (
    <div className="ad-page">
      {/* ── TOP NAVBAR ── */}
      <nav className="ad-navbar">
        <div className="ad-nav-left">
          <div className="ad-nav-icon">
            <img src="/logo.png" alt="Logo" />
          </div>
          <div className="ad-nav-text">
            <span className="ad-nav-title">COLLEGE ERP</span>
            <span className="ad-nav-sep">One System Many Solution</span>
          </div>
        </div>

        <div className="ad-nav-right">
          {/* Search — hidden on mobile via CSS */}
          <div className="ad-search">
            {IC.Search}&nbsp;Search...
          </div>

          {/* Notification bell */}
          <div className="ad-notif" role="button" aria-label="Notifications">
            {IC.Bell}
            <span className="ad-notif-dot">5</span>
          </div>

          {/* Avatar */}
          <div className="ad-avatar" role="button" aria-label="Profile">
            AD
          </div>

          {/* Hamburger — visible only on mobile via CSS */}
          <button
            className="ad-menu-btn"
            type="button"
            aria-label="Open menu"
            aria-expanded={sidebarOpen}
            aria-controls="ad-sidebar"
            onClick={openSidebar}
          >
            ☰
          </button>
        </div>
      </nav>

      {/* ── BODY ── */}
      <div className="ad-body">
        {/* ── SIDEBAR ── */}
        <aside
          id="ad-sidebar"
          ref={sidebarRef}
          className={`ad-sidebar${sidebarOpen ? " open" : ""}`}
          aria-label="Sidebar navigation"
          role="navigation"
        >
          {/* Close button row — only visible on mobile via CSS */}
          <div className="ad-sidebar-close">
            <button
              className="ad-close-btn"
              type="button"
              aria-label="Close menu"
              onClick={closeSidebar}
            >
              ✕
            </button>
          </div>

          {/* User info */}
          <div className="ad-sb-user">
            <div className="ad-sb-avatar">AD</div>
            <div className="ad-sb-name">Administrator</div>
            <div className="ad-sb-role">Super Admin</div>
          </div>

          {/* Nav items */}
          <nav className="ad-sb-nav">
            {navItems.map((item) => (
              <div
                key={item.id}
                className={`ad-sb-item${active === item.id ? " active" : ""}`}
                role="button"
                tabIndex={0}
                onClick={() => handleNavItem(item.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleNavItem(item.id);
                  }
                }}
                aria-current={active === item.id ? "page" : undefined}
              >
                {item.icon}
                {item.label}
                {item.badge && (
                  <span
                    className="ad-sb-badge"
                    style={{
                      background: item.badgeColor,
                      color: item.badgeText,
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
            ))}
          </nav>
        </aside>

        {/* ── OVERLAY ──
            Always in the DOM. Visibility controlled by class.
            Using class (not conditional render) avoids React timing issues
            that caused "overlay appears but sidebar doesn't open" on Android.
        ── */}
        <div
          ref={overlayRef}
          className={`ad-sidebar-overlay${sidebarOpen ? " visible" : ""}`}
          aria-hidden="true"
          onClick={closeSidebar}
        />

        {/* ── MAIN CONTENT ── */}
        <main className="ad-content">{children}</main>
      </div>
    </div>
  );
}

export default Shell;