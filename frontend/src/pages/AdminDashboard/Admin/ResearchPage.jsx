import { useCallback, useEffect, useMemo, useState } from "react";
import { IC } from "../constants/iconMap";
import { apiFetch } from "../../../services/api";

/* ════════════════════════════════════════
   PAGE 16 — RESEARCH / R&D
════════════════════════════════════════ */

const EMPTY_FORM = {
  title: "",
  principalInvestigator: "",
  department: "",
  grantAmount: "",
  fundingAgency: "",
  endDate: "",
  status: "Active",
  description: "",
};

const formatCompact = (n) => {
  const num = Number(n) || 0;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(0)}K`;
  return `₹${num}`;
};

function ResearchPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/research");
      setProjects(res?.data || []);
    } catch (e) {
      setError(e?.message || "Failed to load research projects");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const kpi = useMemo(() => {
    const list = Array.isArray(projects) ? projects : [];
    const active = list.filter((p) => p.status === "Active").length;
    const totalGrant = list.reduce((sum, p) => sum + (p.grantAmount || 0), 0);
    return { total: list.length, active, totalGrant };
  }, [projects]);

  const deptOptions = useMemo(() => {
    return [...new Set((Array.isArray(projects) ? projects : []).map((p) => p.department).filter(Boolean))].sort();
  }, [projects]);

  const agencyBreakdown = useMemo(() => {
    const list = Array.isArray(projects) ? projects : [];
    const map = {};
    list.forEach((p) => {
      if (p.fundingAgency) map[p.fundingAgency] = (map[p.fundingAgency] || 0) + (p.grantAmount || 0);
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [projects]);

  const filtered = useMemo(() => {
    return (Array.isArray(projects) ? projects : []).filter((p) => {
      const term = searchTerm.toLowerCase();
      const matchSearch =
        (p.title || "").toLowerCase().includes(term) ||
        (p.principalInvestigator || "").toLowerCase().includes(term) ||
        (p.fundingAgency || "").toLowerCase().includes(term);
      const matchDept = deptFilter === "All" || p.department === deptFilter;
      const matchStatus = statusFilter === "All" || p.status === statusFilter;
      return matchSearch && matchDept && matchStatus;
    });
  }, [projects, searchTerm, deptFilter, statusFilter]);

  const openAdd = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (p) => {
    setEditId(p._id);
    setForm({
      title: p.title || "",
      principalInvestigator: p.principalInvestigator || "",
      department: p.department || "",
      grantAmount: p.grantAmount ?? "",
      fundingAgency: p.fundingAgency || "",
      endDate: p.endDate ? new Date(p.endDate).toISOString().split("T")[0] : "",
      status: p.status || "Active",
      description: p.description || "",
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) { window.alert("Project title is required."); return; }
    if (!form.endDate) { window.alert("End date is required."); return; }
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        principalInvestigator: form.principalInvestigator.trim(),
        department: form.department.trim(),
        grantAmount: Number(form.grantAmount) || 0,
        fundingAgency: form.fundingAgency.trim(),
        endDate: form.endDate,
        status: form.status,
        description: form.description.trim(),
      };
      if (editId) {
        await apiFetch(`/research/${editId}`, { method: "PUT", body: JSON.stringify(payload) });
        window.alert("Project updated.");
      } else {
        await apiFetch("/research", { method: "POST", body: JSON.stringify(payload) });
        window.alert("Project added successfully.");
      }
      setShowForm(false);
      setEditId(null);
      setForm(EMPTY_FORM);
      await loadData();
    } catch (e) {
      window.alert(e?.message || "Failed to save project.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this research project?")) return;
    try {
      await apiFetch(`/research/${id}`, { method: "DELETE" });
      await loadData();
    } catch (e) {
      window.alert(e?.message || "Failed to delete project.");
    }
  };

  const handleExport = () => {
    const headers = ["Title", "Principal Investigator", "Dept", "Grant (₹)", "Funding Agency", "End Date", "Status"];
    const rows = filtered.map((p) => [
      p.title || "",
      p.principalInvestigator || "",
      p.department || "",
      p.grantAmount ?? 0,
      p.fundingAgency || "",
      p.endDate ? new Date(p.endDate).toLocaleDateString("en-IN") : "",
      p.status || "",
    ]);
    const csv = [headers.join(","), ...rows.map((row) => row.map((c) => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "research-projects.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="ad-page-header">
        <div>
          <div className="ad-page-title">Research & Development</div>
          <div className="ad-page-sub">
            {loading ? "Loading..." : `${kpi.active} active projects · ${formatCompact(kpi.totalGrant)} total grants · AY 2025–26`}
          </div>
        </div>
        <div className="ad-header-actions">
          <button className="ad-btn-outline" onClick={handleExport} disabled={loading}>{IC.Download} R&D Report</button>
          <button className="ad-btn-primary" onClick={openAdd}>{IC.Plus} Add Project</button>
        </div>
      </div>

      {loading && <div className="ad-page-sub">Loading research projects...</div>}
      {!loading && error && <div className="ad-page-sub" style={{ color: "#dc2626" }}>{error}</div>}

      {!loading && !error && (
        <>
          <div className="ad-kpi-grid ad-kpi-grid-4" style={{ marginBottom: 14 }}>
            {[
              { val: kpi.active, label: "Active projects", bg: "#eff4ff", c: "#2563eb" },
              { val: formatCompact(kpi.totalGrant), label: "Total grants received", bg: "#EAF3DE", c: "#3B6D11" },
              { val: kpi.total, label: "Total projects", bg: "#FAEEDA", c: "#854F0B" },
              { val: (Array.isArray(projects) ? projects : []).filter((p) => p.status === "Completed").length, label: "Completed", bg: "#EEEDFE", c: "#534AB7" },
            ].map((k, i) => (
              <div className="ad-kpi" key={i}>
                <div className="ad-kpi-top">
                  <div className="ad-kpi-icon" style={{ background: k.bg, color: k.c }}>{IC.Flask}</div>
                </div>
                <div className="ad-kpi-val">{k.val}</div>
                <div className="ad-kpi-label">{k.label}</div>
              </div>
            ))}
          </div>

          {showForm && (
            <div className="ad-card" style={{ marginBottom: 14 }}>
              <div className="ad-card-header">
                <span className="ad-card-title">{editId ? "Edit Project" : "Add Research Project"}</span>
                <span className="ad-card-link" onClick={() => { setShowForm(false); setEditId(null); }}>Cancel</span>
              </div>
              <div className="ad-table-filters">
                <input className="ad-input" placeholder="Project Title *" value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
                <input className="ad-input" placeholder="Principal Investigator" value={form.principalInvestigator}
                  onChange={(e) => setForm((p) => ({ ...p, principalInvestigator: e.target.value }))} />
                <input className="ad-input" placeholder="Department (e.g. CSE)" value={form.department}
                  onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))} />
                <input className="ad-input" type="number" placeholder="Grant Amount (₹)" value={form.grantAmount}
                  onChange={(e) => setForm((p) => ({ ...p, grantAmount: e.target.value }))} />
                <input className="ad-input" placeholder="Funding Agency (e.g. DST, SERB)" value={form.fundingAgency}
                  onChange={(e) => setForm((p) => ({ ...p, fundingAgency: e.target.value }))} />
                <input className="ad-input" type="date" placeholder="End Date *" value={form.endDate}
                  onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))} />
                <select className="ad-select" value={form.status}
                  onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
                  <option>Active</option>
                  <option>Completed</option>
                  <option>On Hold</option>
                  <option>Cancelled</option>
                </select>
              </div>
              <div style={{ padding: "8px 16px" }}>
                <input className="ad-input" placeholder="Project description / notes" value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  style={{ width: "100%", boxSizing: "border-box" }} />
              </div>
              <div className="quick-actions">
                <button className="ad-btn-primary" onClick={handleSave} disabled={saving}>
                  {IC.Check} {saving ? "Saving..." : editId ? "Update Project" : "Save Project"}
                </button>
              </div>
            </div>
          )}

          <div className="ad-table-wrap" style={{ marginBottom: 12 }}>
            <div className="ad-table-header">
              <span className="ad-card-title">Research Projects</span>
              <div style={{ display: "flex", gap: 8 }}>
                <div className="ad-search-input">
                  <span style={{ color: "#aab0bc" }}>{IC.Search}</span>
                  <input placeholder="Search title, PI, agency..."
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <select className="ad-select" value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
                  <option value="All">All depts</option>
                  {deptOptions.map((d) => <option key={d}>{d}</option>)}
                </select>
                <select className="ad-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="All">All status</option>
                  <option>Active</option>
                  <option>Completed</option>
                  <option>On Hold</option>
                  <option>Cancelled</option>
                </select>
              </div>
            </div>
            <table className="ad-table">
              <thead>
                <tr><th>Project Title</th><th>Principal Investigator</th><th>Dept</th><th>Grant</th><th>Agency</th><th>End Date</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan="8" style={{ textAlign: "center", color: "#6b7a99" }}>No projects found.</td></tr>
                ) : (
                  filtered.map((p) => (
                    <tr key={p._id}>
                      <td style={{ fontWeight: 600 }}>{p.title}</td>
                      <td style={{ color: "#6b7a99", fontSize: 11 }}>{p.principalInvestigator || "—"}</td>
                      <td>{p.department ? <span className="pill pill-blue" style={{ fontSize: 9 }}>{p.department}</span> : "—"}</td>
                      <td style={{ fontWeight: 700, color: "#1a3a6e" }}>{formatCompact(p.grantAmount)}</td>
                      <td>{p.fundingAgency ? <span className="pill pill-gray" style={{ fontSize: 9 }}>{p.fundingAgency}</span> : "—"}</td>
                      <td style={{ color: "#6b7a99", fontSize: 11 }}>
                        {p.endDate ? new Date(p.endDate).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "—"}
                      </td>
                      <td>
                        <span className={p.status === "Active" ? "pill pill-green" : p.status === "Completed" ? "pill pill-blue" : "pill pill-gray"}>
                          {p.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: 4 }}>
                          <button className="ad-btn-outline" style={{ padding: "4px 8px" }} onClick={() => openEdit(p)}>{IC.Edit}</button>
                          <button className="ad-btn-danger" style={{ padding: "4px 8px" }} onClick={() => handleDelete(p._id)}>{IC.Trash}</button>
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
              <div className="ad-card-header"><span className="ad-card-title">Grants by funding agency</span></div>
              {agencyBreakdown.length === 0 ? (
                <div className="ad-page-sub">No data yet.</div>
              ) : (
                agencyBreakdown.map(([agency, amount]) => {
                  const max = agencyBreakdown[0]?.[1] || 1;
                  const colors = ["#2563eb", "#534AB7", "#854F0B", "#059669", "#d97706"];
                  const col = colors[agencyBreakdown.map(([a]) => a).indexOf(agency) % colors.length];
                  return (
                    <div className="bar-row" key={agency}>
                      <span className="bar-label" style={{ width: 54 }}>{agency}</span>
                      <div className="bar-track">
                        <div className="bar-fill" style={{ width: `${(amount / max) * 100}%`, background: col }} />
                      </div>
                      <span className="bar-pct" style={{ color: col }}>{formatCompact(amount)}</span>
                    </div>
                  );
                })
              )}
            </div>

            <div className="ad-card">
              <div className="ad-card-header"><span className="ad-card-title">Projects near deadline</span></div>
              <div className="activity-list">
                {(Array.isArray(projects) ? projects : [])
                  .filter((p) => p.status === "Active" && p.endDate)
                  .sort((a, b) => new Date(a.endDate) - new Date(b.endDate))
                  .slice(0, 5)
                  .map((p) => (
                    <div className="activity-item" key={p._id}>
                      <div className="activity-dot" style={{ background: "#2563eb" }} />
                      <div>
                        <div className="activity-text">{p.title}</div>
                        <div className="activity-time">
                          {p.department || "—"} · PI: {p.principalInvestigator || "—"} · Ends:{" "}
                          {new Date(p.endDate).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                        </div>
                      </div>
                    </div>
                  ))}
                {(Array.isArray(projects) ? projects : []).filter((p) => p.status === "Active").length === 0 && (
                  <div className="ad-page-sub">No active projects.</div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default ResearchPage;