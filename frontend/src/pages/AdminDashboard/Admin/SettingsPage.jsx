import { useCallback, useEffect, useState } from "react";
import { IC } from "../constants/iconMap";
import { apiFetch } from "../../../services/api";

/* ════════════════════════════════════════
   PAGE 20 — SETTINGS
════════════════════════════════════════ */
function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState("");

  /* Mirror exact schema from Settings.js model */
  const [form, setForm] = useState({
    collegeName:     "",
    academicYear:    "",
    currentSemester: "",
    emailDomain:     "",
    notifications: { sms: true,  email: true,  push: false },
    autoAlerts:    { attendance: true, fee: true, result: false },
    security:      { twofa: false, sessionTimeout: true, auditLogs: true },
  });

  /* ── Load from backend ── */
  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res  = await apiFetch("/settings");
      const data = res?.data || {};
      setForm({
        collegeName:     data.collegeName     || "",
        academicYear:    data.academicYear    || "",
        currentSemester: data.currentSemester || "",
        emailDomain:     data.emailDomain     || "",
        notifications: {
          sms:   data.notifications?.sms   ?? true,
          email: data.notifications?.email ?? true,
          push:  data.notifications?.push  ?? false,
        },
        autoAlerts: {
          attendance: data.autoAlerts?.attendance ?? true,
          fee:        data.autoAlerts?.fee        ?? true,
          result:     data.autoAlerts?.result     ?? false,
        },
        security: {
          twofa:          data.security?.twofa          ?? false,
          sessionTimeout: data.security?.sessionTimeout ?? true,
          auditLogs:      data.security?.auditLogs      ?? true,
        },
      });
    } catch (e) {
      setError(e?.message || "Failed to load settings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  /* ── Save to backend ── */
  const handleSave = async () => {
    if (!form.collegeName.trim()) { window.alert("College Name is required."); return; }

    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await apiFetch("/settings", {
        method: "PUT",
        body:   JSON.stringify(form),
      });
      setSuccess("Settings saved successfully.");
      setTimeout(() => setSuccess(""), 3000);
    } catch (e) {
      setError(e?.message || "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  /* ── Field setters ── */
  const setGeneral = (key, val) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const toggleNested = (section, key) =>
    setForm((prev) => ({
      ...prev,
      [section]: { ...prev[section], [key]: !prev[section][key] },
    }));

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <>
        <div className="ad-page-header">
          <div>
            <div className="ad-page-title">Settings</div>
            <div className="ad-page-sub">Loading settings…</div>
          </div>
        </div>
      </>
    );
  }

  /* ════ RENDER ════ */
  return (
    <>
      {/* Header */}
      <div className="ad-page-header">
        <div>
          <div className="ad-page-title">Settings</div>
          <div className="ad-page-sub">System configuration and preferences</div>
        </div>
        <div className="ad-header-actions">
          {error   && <span style={{ color: "#dc2626", fontSize: 12 }}>{error}</span>}
          {success && <span style={{ color: "#059669", fontSize: 12 }}>{success}</span>}
          <button
            type="button"
            className="ad-btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {IC.Check} {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="ad-grid-2">
        {/* ── Left column ── */}
        <div>
          {/* General */}
          <div className="settings-section">
            <div className="settings-section-title">General Settings</div>
            {[
              { key: "collegeName",     label: "College Name" },
              { key: "academicYear",    label: "Academic Year" },
              { key: "currentSemester", label: "Current Semester" },
              { key: "emailDomain",     label: "Email Domain" },
            ].map(({ key, label }) => (
              <div className="settings-row" key={key}>
                <div><div className="settings-label">{label}</div></div>
                <input
                  className="ad-input"
                  value={form[key]}
                  onChange={(e) => setGeneral(key, e.target.value)}
                  style={{ fontSize: 12, padding: "6px 10px", width: 180 }}
                />
              </div>
            ))}
          </div>

          {/* Notifications */}
          <div className="settings-section">
            <div className="settings-section-title">Notification Settings</div>
            {[
              { k: "sms",   label: "SMS Notifications",  desc: "Send SMS for attendance, fee alerts" },
              { k: "email", label: "Email Notifications", desc: "Send emails for results, circulars" },
              { k: "push",  label: "Push Notifications",  desc: "In-app notifications for all users" },
            ].map((s) => (
              <div className="settings-row" key={s.k}>
                <div>
                  <div className="settings-label">{s.label}</div>
                  <div className="settings-desc">{s.desc}</div>
                </div>
                <button
                  type="button"
                  className={`toggle ${form.notifications[s.k] ? "toggle-on" : "toggle-off"}`}
                  onClick={() => toggleNested("notifications", s.k)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── Right column ── */}
        <div>
          {/* Auto Alerts */}
          <div className="settings-section">
            <div className="settings-section-title">Auto Alerts</div>
            {[
              { k: "attendance", label: "Attendance shortage alert", desc: "Alert when student < 75%" },
              { k: "fee",        label: "Fee due reminder",          desc: "7 days before due date" },
              { k: "result",     label: "Result publish notification", desc: "Auto-notify on result publish" },
            ].map((s) => (
              <div className="settings-row" key={s.k}>
                <div>
                  <div className="settings-label">{s.label}</div>
                  <div className="settings-desc">{s.desc}</div>
                </div>
                <button
                  type="button"
                  className={`toggle ${form.autoAlerts[s.k] ? "toggle-on" : "toggle-off"}`}
                  onClick={() => toggleNested("autoAlerts", s.k)}
                />
              </div>
            ))}
          </div>

          {/* Security */}
          <div className="settings-section">
            <div className="settings-section-title">Security Settings</div>
            {[
              { k: "twofa",          label: "Two-factor authentication", desc: "OTP on login for all users" },
              { k: "sessionTimeout", label: "Auto session timeout",       desc: "Logout after 30 min inactivity" },
              { k: "auditLogs",      label: "Activity audit logs",        desc: "Log all admin actions" },
            ].map((s) => (
              <div className="settings-row" key={s.k}>
                <div>
                  <div className="settings-label">{s.label}</div>
                  <div className="settings-desc">{s.desc}</div>
                </div>
                <button
                  type="button"
                  className={`toggle ${form.security[s.k] ? "toggle-on" : "toggle-off"}`}
                  onClick={() => toggleNested("security", s.k)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default SettingsPage;