import { useCallback, useEffect, useMemo, useState } from "react";
import { IC } from "../constants/iconMap";
import { apiFetch } from "../../../services/api";

/* ════════════════════════════════════════
   PAGE 13 — COMMUNICATION
════════════════════════════════════════ */

const EMPTY_FORM = {
  title: "",
  message: "",
  recipientGroup: "All Students",
  channel: ["SMS", "Email"],
  priority: "Medium",
  status: "Draft",
};

const PRIORITY_COLOR = { Low: "#059669", Medium: "#2563eb", High: "#d97706", Emergency: "#dc2626" };
const PRIORITY_BG    = { Low: "#f0fdf4", Medium: "#eff4ff", High: "#FAEEDA", Emergency: "#FCEBEB" };
const STATUS_COLOR   = { Draft: "#6b7a99", Scheduled: "#2563eb", Sent: "#059669", Archived: "#854F0B" };

function CommunicationPage() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/communication");
      setNotices(res?.data || []);
    } catch (e) {
      setError(e?.message || "Failed to load notices");
      setNotices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const kpi = useMemo(() => {
    const list = Array.isArray(notices) ? notices : [];
    const active = list.filter((n) => n.status === "Sent" || n.status === "Scheduled").length;
    const emergency = list.filter((n) => n.priority === "Emergency").length;
    const drafts = list.filter((n) => n.status === "Draft").length;
    return { total: list.length, active, emergency, drafts };
  }, [notices]);

  const filtered = useMemo(() => {
    return (Array.isArray(notices) ? notices : []).filter((n) => {
      const term = searchTerm.toLowerCase();
      const matchSearch =
        (n.title || "").toLowerCase().includes(term) ||
        (n.message || "").toLowerCase().includes(term) ||
        (n.recipientGroup || "").toLowerCase().includes(term);
      const matchPriority = priorityFilter === "All" || n.priority === priorityFilter;
      return matchSearch && matchPriority;
    });
  }, [notices, searchTerm, priorityFilter]);

  const recentSent = useMemo(
    () => (Array.isArray(notices) ? notices : [])
      .filter((n) => n.status === "Sent")
      .slice(0, 6),
    [notices]
  );

  const toggleChannel = (ch) => {
    setForm((p) => ({
      ...p,
      channel: p.channel.includes(ch)
        ? p.channel.filter((c) => c !== ch)
        : [...p.channel, ch],
    }));
  };

  const openAdd = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (n) => {
    setEditId(n._id);
    setForm({
      title: n.title || "",
      message: n.message || "",
      recipientGroup: n.recipientGroup || "All Students",
      channel: Array.isArray(n.channel) ? n.channel : ["SMS", "Email"],
      priority: n.priority || "Medium",
      status: n.status || "Draft",
    });
    setShowForm(true);
  };

  const handleSend = async () => {
    if (!form.title.trim()) { window.alert("Title is required."); return; }
    if (!form.message.trim()) { window.alert("Message is required."); return; }
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        message: form.message.trim(),
        recipientGroup: form.recipientGroup,
        channel: form.channel,
        priority: form.priority,
        status: editId ? form.status : "Sent",
        sentAt: editId ? undefined : new Date().toISOString(),
      };
      if (editId) {
        await apiFetch(`/communication/${editId}`, { method: "PUT", body: JSON.stringify(payload) });
        window.alert("Notice updated.");
      } else {
        await apiFetch("/communication", { method: "POST", body: JSON.stringify(payload) });
        window.alert("Notice sent successfully.");
      }
      setShowForm(false);
      setEditId(null);
      setForm(EMPTY_FORM);
      await loadData();
    } catch (e) {
      window.alert(e?.message || "Failed to send notice.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this notice?")) return;
    try {
      await apiFetch(`/communication/${id}`, { method: "DELETE" });
      await loadData();
    } catch (e) {
      window.alert(e?.message || "Failed to delete notice.");
    }
  };

  const handleExport = () => {
    const headers = ["Title", "Message", "Recipient", "Channel", "Priority", "Status", "Sent At"];
    const rows = filtered.map((n) => [
      n.title || "",
      n.message || "",
      n.recipientGroup || "",
      Array.isArray(n.channel) ? n.channel.join("; ") : "",
      n.priority || "",
      n.status || "",
      n.sentAt ? new Date(n.sentAt).toLocaleDateString("en-IN") : "",
    ]);
    const csv = [headers.join(","), ...rows.map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "notices.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="ad-page-header">
        <div>
          <div className="ad-page-title">Communication Hub</div>
          <div className="ad-page-sub">
            {loading ? "Loading..." : `${kpi.active} active notices · ${kpi.emergency} emergency · Bulk SMS · Email · Push`}
          </div>
        </div>
        <div className="ad-header-actions">
          <button className="ad-btn-outline" onClick={handleExport} disabled={loading}>{IC.Download} Export Logs</button>
          <button className="ad-btn-primary" onClick={openAdd}>{IC.Plus} New Notice</button>
        </div>
      </div>

      {loading && <div className="ad-page-sub">Loading notices...</div>}
      {!loading && error && <div className="ad-page-sub" style={{ color: "#dc2626" }}>{error}</div>}

      {!loading && !error && (
        <>
          <div className="ad-kpi-grid ad-kpi-grid-4" style={{ marginBottom: 14 }}>
            {[
              { val: kpi.total, label: "Total notices", bg: "#eff4ff", c: "#2563eb" },
              { val: kpi.active, label: "Sent / Scheduled", bg: "#f0fdf4", c: "#059669" },
              { val: kpi.drafts, label: "Drafts", bg: "#FAEEDA", c: "#854F0B" },
              { val: kpi.emergency, label: "Emergency broadcasts", bg: "#FCEBEB", c: "#A32D2D" },
            ].map((k, i) => (
              <div className="ad-kpi" key={i}>
                <div className="ad-kpi-top">
                  <div className="ad-kpi-icon" style={{ background: k.bg, color: k.c }}>{IC.Bell}</div>
                </div>
                <div className="ad-kpi-val">{k.val}</div>
                <div className="ad-kpi-label">{k.label}</div>
              </div>
            ))}
          </div>

          <div className="ad-grid-2">
            <div className="ad-card">
              <div className="ad-card-header">
                <span className="ad-card-title">{editId ? "Edit Notice" : "Send Notification"}</span>
                {showForm && (
                  <span className="ad-card-link" onClick={() => { setShowForm(false); setEditId(null); }}>Cancel</span>
                )}
                {!showForm && (
                  <span className="ad-card-link" onClick={openAdd}>New Notice</span>
                )}
              </div>
              {showForm ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#6b7a99", marginBottom: 4 }}>Title *</div>
                    <input className="ad-input" placeholder="Notice title..." value={form.title}
                      onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                      style={{ width: "100%", boxSizing: "border-box", fontSize: 12, padding: "6px 10px" }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#6b7a99", marginBottom: 4 }}>Recipient Group</div>
                    <select className="ad-select" style={{ width: "100%" }}
                      value={form.recipientGroup} onChange={(e) => setForm((p) => ({ ...p, recipientGroup: e.target.value }))}>
                      <option>All Students</option>
                      <option>All Faculty</option>
                      <option>CSE Branch</option>
                      <option>IT Branch</option>
                      <option>ECE Branch</option>
                      <option>Parents</option>
                      <option>Hostel Students</option>
                      <option>All</option>
                    </select>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#6b7a99", marginBottom: 4 }}>Channel</div>
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                      {["SMS", "Email", "Push", "WhatsApp"].map((ch) => (
                        <label key={ch} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, cursor: "pointer" }}>
                          <input type="checkbox" checked={form.channel.includes(ch)} onChange={() => toggleChannel(ch)} /> {ch}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#6b7a99", marginBottom: 4 }}>Priority</div>
                    <select className="ad-select" style={{ width: "100%" }}
                      value={form.priority} onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value }))}>
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                      <option>Emergency</option>
                    </select>
                  </div>
                  {editId && (
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "#6b7a99", marginBottom: 4 }}>Status</div>
                      <select className="ad-select" style={{ width: "100%" }}
                        value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
                        <option>Draft</option>
                        <option>Scheduled</option>
                        <option>Sent</option>
                        <option>Archived</option>
                      </select>
                    </div>
                  )}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#6b7a99", marginBottom: 4 }}>Message *</div>
                    <textarea className="ad-input" rows={3} placeholder="Type your message here..."
                      value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                      style={{ width: "100%", boxSizing: "border-box", fontSize: 12, padding: "6px 10px", resize: "none" }} />
                  </div>
                  <button className="ad-btn-primary" style={{ alignSelf: "flex-start" }} onClick={handleSend} disabled={saving}>
                    {IC.Bell} {saving ? "Sending..." : editId ? "Update Notice" : "Send Now"}
                  </button>
                </div>
              ) : (
                <div style={{ color: "#6b7a99", fontSize: 13, padding: "12px 0" }}>
                  Click "New Notice" above to compose and send a notification to students, faculty, or parents.
                </div>
              )}
            </div>

            <div className="ad-card">
              <div className="ad-card-header">
                <span className="ad-card-title">Recent notices</span>
                <span className="ad-card-link">View all</span>
              </div>
              {recentSent.length === 0 ? (
                <div className="ad-page-sub">No sent notices yet.</div>
              ) : (
                <div className="activity-list">
                  {recentSent.map((n) => (
                    <div className="activity-item" key={n._id}>
                      <div className="activity-dot" style={{ background: PRIORITY_COLOR[n.priority] || "#6b7a99" }} />
                      <div style={{ flex: 1 }}>
                        <div className="activity-text">{n.title}</div>
                        <div className="activity-time">
                          {n.recipientGroup || "All"} ·{" "}
                          {n.sentAt ? new Date(n.sentAt).toLocaleDateString("en-IN") : "Draft"}
                        </div>
                      </div>
                      <button className="ad-btn-danger" style={{ padding: "2px 6px", fontSize: 10 }}
                        onClick={() => handleDelete(n._id)}>{IC.Trash}</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="ad-table-wrap" style={{ marginTop: 12 }}>
            <div className="ad-table-header">
              <span className="ad-card-title">All Notices</span>
              <div style={{ display: "flex", gap: 8 }}>
                <div className="ad-search-input">
                  <span style={{ color: "#aab0bc" }}>{IC.Search}</span>
                  <input placeholder="Search title, message..."
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <select className="ad-select" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
                  <option value="All">All priority</option>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Emergency</option>
                </select>
              </div>
            </div>
            <table className="ad-table">
              <thead>
                <tr><th>Title</th><th>Recipient</th><th>Channel</th><th>Priority</th><th>Status</th><th>Date</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan="7" style={{ textAlign: "center", color: "#6b7a99" }}>No notices found.</td></tr>
                ) : (
                  filtered.map((n) => (
                    <tr key={n._id}>
                      <td style={{ fontWeight: 600 }}>{n.title}</td>
                      <td style={{ color: "#6b7a99", fontSize: 11 }}>{n.recipientGroup || "—"}</td>
                      <td style={{ fontSize: 11 }}>
                        {Array.isArray(n.channel) ? n.channel.join(", ") : "—"}
                      </td>
                      <td>
                        <span className="pill" style={{ background: PRIORITY_BG[n.priority], color: PRIORITY_COLOR[n.priority], fontSize: 10 }}>
                          {n.priority}
                        </span>
                      </td>
                      <td>
                        <span className="pill pill-gray" style={{ fontSize: 10, color: STATUS_COLOR[n.status] }}>
                          {n.status}
                        </span>
                      </td>
                      <td style={{ color: "#6b7a99", fontSize: 11 }}>
                        {n.sentAt ? new Date(n.sentAt).toLocaleDateString("en-IN") : n.createdAt ? new Date(n.createdAt).toLocaleDateString("en-IN") : "—"}
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: 4 }}>
                          <button className="ad-btn-outline" style={{ padding: "4px 8px" }} onClick={() => openEdit(n)}>{IC.Edit}</button>
                          <button className="ad-btn-danger" style={{ padding: "4px 8px" }} onClick={() => handleDelete(n._id)}>{IC.Trash}</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}

export default CommunicationPage;