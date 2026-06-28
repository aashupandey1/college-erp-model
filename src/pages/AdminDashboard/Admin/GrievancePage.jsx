import { useCallback, useEffect, useMemo, useState } from "react";
import { IC } from "../constants/iconMap";
import { apiFetch } from "../../../services/api";

/* ════════════════════════════════════════
   PAGE 11 — GRIEVANCE
════════════════════════════════════════ */

const EMPTY_FORM = {
  grievanceId: "",
  studentName: "",
  branch: "",
  category: "Academic",
  description: "",
  assignedTo: "",
  status: "Open",
};

const STATUS_COLOR = { Open: "#A32D2D", "In Progress": "#854F0B", Resolved: "#3B6D11" };
const STATUS_BG    = { Open: "#FCEBEB", "In Progress": "#FAEEDA", Resolved: "#EAF3DE" };

function GrievancePage() {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/grievances");
      setGrievances(res?.data || []);
    } catch (e) {
      setError(e?.message || "Failed to load grievances");
      setGrievances([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const kpi = useMemo(() => {
    const list = Array.isArray(grievances) ? grievances : [];
    const open = list.filter((g) => g.status === "Open").length;
    const inProgress = list.filter((g) => g.status === "In Progress").length;
    const resolved = list.filter((g) => g.status === "Resolved").length;
    return { open, inProgress, resolved, total: list.length };
  }, [grievances]);

  const filtered = useMemo(() => {
    return (Array.isArray(grievances) ? grievances : []).filter((g) => {
      const term = searchTerm.toLowerCase();
      const matchSearch =
        (g.grievanceId || "").toLowerCase().includes(term) ||
        (g.studentName || "").toLowerCase().includes(term) ||
        (g.category || "").toLowerCase().includes(term) ||
        (g.description || "").toLowerCase().includes(term);
      const matchStatus = statusFilter === "All" || g.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [grievances, searchTerm, statusFilter]);

  const categories = useMemo(() => {
    const cats = ["Academic", "Hostel", "Fee", "Ragging", "Transport", "Other"];
    return cats;
  }, []);

  const catBreakdown = useMemo(() => {
    const list = Array.isArray(grievances) ? grievances : [];
    const map = {};
    list.forEach((g) => { map[g.category] = (map[g.category] || 0) + 1; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [grievances]);

  const openAdd = () => {
    setEditId(null);
    // Auto-generate GRV ID
    const num = String((Array.isArray(grievances) ? grievances : []).length + 1).padStart(3, "0");
    setForm({ ...EMPTY_FORM, grievanceId: `GRV-${num}` });
    setShowForm(true);
  };

  const openEdit = (g) => {
    setEditId(g._id);
    setForm({
      grievanceId: g.grievanceId || "",
      studentName: g.studentName || "",
      branch: g.branch || "",
      category: g.category || "Academic",
      description: g.description || "",
      assignedTo: g.assignedTo || "",
      status: g.status || "Open",
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.grievanceId.trim()) { window.alert("Grievance ID is required."); return; }
    if (!form.category.trim()) { window.alert("Category is required."); return; }
    if (!form.description.trim()) { window.alert("Description is required."); return; }
    setSaving(true);
    try {
      const payload = {
        grievanceId: form.grievanceId.trim(),
        studentName: form.studentName.trim(),
        branch: form.branch.trim(),
        category: form.category,
        description: form.description.trim(),
        assignedTo: form.assignedTo.trim(),
        status: form.status,
      };
      if (editId) {
        await apiFetch(`/grievances/${editId}`, { method: "PUT", body: JSON.stringify(payload) });
        window.alert("Grievance updated.");
      } else {
        await apiFetch("/grievances", { method: "POST", body: JSON.stringify(payload) });
        window.alert("Grievance logged.");
      }
      setShowForm(false);
      setEditId(null);
      setForm(EMPTY_FORM);
      await loadData();
    } catch (e) {
      window.alert(e?.message || "Failed to save grievance.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this grievance?")) return;
    try {
      await apiFetch(`/grievances/${id}`, { method: "DELETE" });
      await loadData();
    } catch (e) {
      window.alert(e?.message || "Failed to delete grievance.");
    }
  };

  const handleExport = () => {
    const headers = ["ID", "Student", "Branch", "Category", "Description", "Assigned To", "Filed Date", "Status"];
    const rows = filtered.map((g) => [
      g.grievanceId || "",
      g.studentName || "",
      g.branch || "",
      g.category || "",
      g.description || "",
      g.assignedTo || "",
      g.filedDate ? new Date(g.filedDate).toLocaleDateString("en-IN") : "",
      g.status || "",
    ]);
    const csv = [headers.join(","), ...rows.map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "grievances.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="ad-page-header">
        <div>
          <div className="ad-page-title">Grievance & Discipline</div>
          <div className="ad-page-sub">
            {loading ? "Loading..." : `${kpi.total} total · ${kpi.open} open · Complaint portal`}
          </div>
        </div>
        <div className="ad-header-actions">
          <button className="ad-btn-outline" onClick={handleExport} disabled={loading}>{IC.Download} Export</button>
          <button className="ad-btn-primary" onClick={openAdd}>{IC.Plus} Log Complaint</button>
        </div>
      </div>

      {loading && <div className="ad-page-sub">Loading grievances...</div>}
      {!loading && error && <div className="ad-page-sub" style={{ color: "#dc2626" }}>{error}</div>}

      {!loading && !error && (
        <>
          <div className="ad-kpi-grid ad-kpi-grid-4" style={{ marginBottom: 14 }}>
            {[
              { val: kpi.open, label: "Open", bg: "#FCEBEB", c: "#A32D2D" },
              { val: kpi.inProgress, label: "In Progress", bg: "#FAEEDA", c: "#854F0B" },
              { val: kpi.resolved, label: "Resolved", bg: "#EAF3DE", c: "#3B6D11" },
              { val: kpi.total, label: "Total complaints", bg: "#eff4ff", c: "#2563eb" },
            ].map((k, i) => (
              <div className="ad-kpi" key={i}>
                <div className="ad-kpi-top">
                  <div className="ad-kpi-icon" style={{ background: k.bg, color: k.c }}>{IC.Mail}</div>
                </div>
                <div className="ad-kpi-val">{k.val}</div>
                <div className="ad-kpi-label">{k.label}</div>
              </div>
            ))}
          </div>

          {showForm && (
            <div className="ad-card" style={{ marginBottom: 14 }}>
              <div className="ad-card-header">
                <span className="ad-card-title">{editId ? "Update Grievance" : "Log New Complaint"}</span>
                <span className="ad-card-link" onClick={() => { setShowForm(false); setEditId(null); }}>Cancel</span>
              </div>
              <div className="ad-table-filters">
                <input className="ad-input" placeholder="Grievance ID *" value={form.grievanceId}
                  onChange={(e) => setForm((p) => ({ ...p, grievanceId: e.target.value }))} />
                <input className="ad-input" placeholder="Student Name" value={form.studentName}
                  onChange={(e) => setForm((p) => ({ ...p, studentName: e.target.value }))} />
                <input className="ad-input" placeholder="Branch" value={form.branch}
                  onChange={(e) => setForm((p) => ({ ...p, branch: e.target.value }))} />
                <select className="ad-select" value={form.category}
                  onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}>
                  {categories.map((c) => <option key={c}>{c}</option>)}
                </select>
                <input className="ad-input" placeholder="Assigned To" value={form.assignedTo}
                  onChange={(e) => setForm((p) => ({ ...p, assignedTo: e.target.value }))} />
                <select className="ad-select" value={form.status}
                  onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
                  <option>Open</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                </select>
              </div>
              <div style={{ padding: "8px 16px" }}>
                <textarea className="ad-input" rows={2} placeholder="Description *" value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  style={{ width: "100%", boxSizing: "border-box", resize: "none" }} />
              </div>
              <div className="quick-actions">
                <button className="ad-btn-primary" onClick={handleSave} disabled={saving}>
                  {IC.Check} {saving ? "Saving..." : editId ? "Update" : "Log Complaint"}
                </button>
              </div>
            </div>
          )}

          <div className="ad-table-wrap" style={{ marginBottom: 12 }}>
            <div className="ad-table-header">
              <span className="ad-card-title">All Grievances</span>
              <div style={{ display: "flex", gap: 8 }}>
                <div className="ad-search-input">
                  <span style={{ color: "#aab0bc" }}>{IC.Search}</span>
                  <input placeholder="Search ID, student, category..."
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <select className="ad-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="All">All status</option>
                  <option>Open</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                </select>
              </div>
            </div>
            <table className="ad-table">
              <thead>
                <tr><th>ID</th><th>Student</th><th>Branch</th><th>Category</th><th>Filed</th><th>Assigned To</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan="8" style={{ textAlign: "center", color: "#6b7a99" }}>No grievances found.</td></tr>
                ) : (
                  filtered.map((g) => (
                    <tr key={g._id}>
                      <td style={{ fontFamily: "monospace", fontSize: 11, color: "#6b7a99" }}>{g.grievanceId}</td>
                      <td style={{ fontWeight: 600 }}>{g.studentName || "Anonymous"}</td>
                      <td>{g.branch ? <span className="pill pill-blue" style={{ fontSize: 9 }}>{g.branch}</span> : <span style={{ color: "#aab0bc" }}>—</span>}</td>
                      <td><span className="pill pill-gray" style={{ fontSize: 9 }}>{g.category}</span></td>
                      <td style={{ color: "#6b7a99", fontSize: 11 }}>
                        {g.filedDate ? new Date(g.filedDate).toLocaleDateString("en-IN") : "—"}
                      </td>
                      <td style={{ color: "#6b7a99", fontSize: 11 }}>{g.assignedTo || "—"}</td>
                      <td>
                        <span className="pill" style={{ background: STATUS_BG[g.status], color: STATUS_COLOR[g.status], fontSize: 10 }}>
                          {g.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: 4 }}>
                          <button className="ad-btn-outline" style={{ padding: "4px 8px" }} onClick={() => openEdit(g)}>{IC.Edit}</button>
                          <button className="ad-btn-danger" style={{ padding: "4px 8px" }} onClick={() => handleDelete(g._id)}>{IC.Trash}</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="ad-grid-2">
            <div className="ad-card">
              <div className="ad-card-header"><span className="ad-card-title">Category breakdown</span></div>
              {catBreakdown.length === 0 ? (
                <div className="ad-page-sub">No data yet.</div>
              ) : (
                catBreakdown.map(([cat, cnt]) => {
                  const colors = { Academic: "#2563eb", Hostel: "#854F0B", Fee: "#d97706", Ragging: "#dc2626", Other: "#534AB7", Transport: "#059669" };
                  const col = colors[cat] || "#6b7a99";
                  const max = catBreakdown[0]?.[1] || 1;
                  return (
                    <div className="bar-row" key={cat}>
                      <span className="bar-label" style={{ width: 72 }}>{cat}</span>
                      <div className="bar-track">
                        <div className="bar-fill" style={{ width: `${(cnt / max) * 100}%`, background: col }} />
                      </div>
                      <span className="bar-pct" style={{ color: col }}>{cnt}</span>
                    </div>
                  );
                })
              )}
            </div>

            <div className="ad-card">
              <div className="ad-card-header"><span className="ad-card-title">Recent open grievances</span></div>
              <div className="activity-list">
                {(Array.isArray(grievances) ? grievances : [])
                  .filter((g) => g.status === "Open" || g.status === "In Progress")
                  .slice(0, 5)
                  .map((g) => (
                    <div className="activity-item" key={g._id}>
                      <div className="activity-dot" style={{ background: STATUS_COLOR[g.status] || "#6b7a99" }} />
                      <div>
                        <div className="activity-text">{g.description}</div>
                        <div className="activity-time">
                          {g.category} · {g.studentName || "Anonymous"} ·{" "}
                          {g.filedDate ? new Date(g.filedDate).toLocaleDateString("en-IN") : ""}
                        </div>
                      </div>
                    </div>
                  ))}
                {(Array.isArray(grievances) ? grievances : []).filter((g) => g.status === "Open" || g.status === "In Progress").length === 0 && (
                  <div className="ad-page-sub">No open grievances.</div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default GrievancePage;