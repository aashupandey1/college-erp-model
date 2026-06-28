import { useCallback, useEffect, useMemo, useState } from "react";
import { IC } from "../constants/iconMap";
import { apiFetch } from "../../../services/api";

/* ════════════════════════════════════════
   PAGE 12 — SCHOLARSHIP
════════════════════════════════════════ */

const EMPTY_FORM = {
  studentName: "",
  branch: "",
  scheme: "",
  amount: "",
  status: "Pending",
  description: "",
};

const ST_COL = { Approved: "#3B6D11", Pending: "#854F0B", "Under Review": "#185FA5", Rejected: "#A32D2D" };
const ST_BG  = { Approved: "#EAF3DE", Pending: "#FAEEDA", "Under Review": "#E6F1FB", Rejected: "#FCEBEB" };

function ScholarshipPage() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const [searchTerm, setSearchTerm] = useState("");
  const [schemeFilter, setSchemeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/scholarship");
      setApps(res?.data || []);
    } catch (e) {
      setError(e?.message || "Failed to load scholarship applications");
      setApps([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const kpi = useMemo(() => {
    const list = Array.isArray(apps) ? apps : [];
    const total = list.length;
    const approved = list.filter((a) => a.status === "Approved").length;
    const pending = list.filter((a) => a.status === "Pending" || a.status === "Under Review").length;
    const disbursed = list
      .filter((a) => a.status === "Approved")
      .reduce((sum, a) => sum + (a.amount || 0), 0);
    return { total, approved, pending, disbursed };
  }, [apps]);

  const schemeOptions = useMemo(() => {
    const schemes = [...new Set((Array.isArray(apps) ? apps : []).map((a) => a.scheme).filter(Boolean))];
    return schemes;
  }, [apps]);

  const filtered = useMemo(() => {
    return (Array.isArray(apps) ? apps : []).filter((a) => {
      const term = searchTerm.toLowerCase();
      const matchSearch =
        (a.studentName || "").toLowerCase().includes(term) ||
        (a.scheme || "").toLowerCase().includes(term) ||
        (a.branch || "").toLowerCase().includes(term);
      const matchScheme = schemeFilter === "All" || (a.scheme || "").includes(schemeFilter);
      const matchStatus = statusFilter === "All" || a.status === statusFilter;
      return matchSearch && matchScheme && matchStatus;
    });
  }, [apps, searchTerm, schemeFilter, statusFilter]);

  const formatAmount = (n) => {
    const num = Number(n) || 0;
    if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
    return `₹${num.toLocaleString("en-IN")}`;
  };

  const openAdd = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (a) => {
    setEditId(a._id);
    setForm({
      studentName: a.studentName || "",
      branch: a.branch || "",
      scheme: a.scheme || "",
      amount: a.amount ?? "",
      status: a.status || "Pending",
      description: a.description || "",
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.studentName.trim()) { window.alert("Student name is required."); return; }
    if (!form.scheme.trim()) { window.alert("Scholarship scheme is required."); return; }
    if (!form.amount || Number(form.amount) <= 0) { window.alert("Valid amount is required."); return; }
    setSaving(true);
    try {
      const payload = {
        studentName: form.studentName.trim(),
        branch: form.branch.trim(),
        scheme: form.scheme.trim(),
        amount: Number(form.amount),
        status: form.status,
        description: form.description.trim(),
      };
      if (editId) {
        await apiFetch(`/scholarship/${editId}`, { method: "PUT", body: JSON.stringify(payload) });
        window.alert("Application updated.");
      } else {
        await apiFetch("/scholarship", { method: "POST", body: JSON.stringify(payload) });
        window.alert("Application submitted.");
      }
      setShowForm(false);
      setEditId(null);
      setForm(EMPTY_FORM);
      await loadData();
    } catch (e) {
      window.alert(e?.message || "Failed to save application.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this application?")) return;
    try {
      await apiFetch(`/scholarship/${id}`, { method: "DELETE" });
      await loadData();
    } catch (e) {
      window.alert(e?.message || "Failed to delete application.");
    }
  };

  const handleExport = () => {
    const headers = ["Student", "Branch", "Scheme", "Amount", "Applied Date", "Status"];
    const rows = filtered.map((a) => [
      a.studentName || "",
      a.branch || "",
      a.scheme || "",
      a.amount ?? 0,
      a.appliedDate ? new Date(a.appliedDate).toLocaleDateString("en-IN") : "",
      a.status || "",
    ]);
    const csv = [headers.join(","), ...rows.map((row) => row.map((c) => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "scholarship-applications.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="ad-page-header">
        <div>
          <div className="ad-page-title">Scholarship Management</div>
          <div className="ad-page-sub">
            {loading ? "Loading..." : `${kpi.total} applications · ${kpi.approved} approved · AY 2025–26`}
          </div>
        </div>
        <div className="ad-header-actions">
          <button className="ad-btn-outline" onClick={handleExport} disabled={loading}>{IC.Download} Audit Report</button>
          <button className="ad-btn-primary" onClick={openAdd}>{IC.Plus} New Application</button>
        </div>
      </div>

      {loading && <div className="ad-page-sub">Loading scholarship data...</div>}
      {!loading && error && <div className="ad-page-sub" style={{ color: "#dc2626" }}>{error}</div>}

      {!loading && !error && (
        <>
          <div className="ad-kpi-grid ad-kpi-grid-4" style={{ marginBottom: 14 }}>
            {[
              { val: kpi.total, label: "Total applications", bg: "#eff4ff", c: "#2563eb" },
              { val: kpi.approved, label: "Approved", bg: "#EAF3DE", c: "#3B6D11" },
              { val: kpi.pending, label: "Pending / Under review", bg: "#FAEEDA", c: "#854F0B" },
              { val: formatAmount(kpi.disbursed), label: "Total disbursed", bg: "#EEEDFE", c: "#534AB7" },
            ].map((k, i) => (
              <div className="ad-kpi" key={i}>
                <div className="ad-kpi-top">
                  <div className="ad-kpi-icon" style={{ background: k.bg, color: k.c }}>{IC.Award}</div>
                </div>
                <div className="ad-kpi-val">{k.val}</div>
                <div className="ad-kpi-label">{k.label}</div>
              </div>
            ))}
          </div>

          {showForm && (
            <div className="ad-card" style={{ marginBottom: 14 }}>
              <div className="ad-card-header">
                <span className="ad-card-title">{editId ? "Edit Application" : "New Scholarship Application"}</span>
                <span className="ad-card-link" onClick={() => { setShowForm(false); setEditId(null); }}>Cancel</span>
              </div>
              <div className="ad-table-filters">
                <input className="ad-input" placeholder="Student Name *" value={form.studentName}
                  onChange={(e) => setForm((p) => ({ ...p, studentName: e.target.value }))} />
                <input className="ad-input" placeholder="Branch (e.g. CSE, ECE)" value={form.branch}
                  onChange={(e) => setForm((p) => ({ ...p, branch: e.target.value }))} />
                <input className="ad-input" placeholder="Scholarship Scheme *" value={form.scheme}
                  onChange={(e) => setForm((p) => ({ ...p, scheme: e.target.value }))} />
                <input className="ad-input" type="number" placeholder="Amount (₹) *" value={form.amount}
                  onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))} />
                <select className="ad-select" value={form.status}
                  onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
                  <option>Pending</option>
                  <option>Under Review</option>
                  <option>Approved</option>
                  <option>Rejected</option>
                </select>
              </div>
              <div style={{ padding: "8px 16px" }}>
                <input className="ad-input" placeholder="Notes / Description" value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  style={{ width: "100%", boxSizing: "border-box" }} />
              </div>
              <div className="quick-actions">
                <button className="ad-btn-primary" onClick={handleSave} disabled={saving}>
                  {IC.Check} {saving ? "Saving..." : editId ? "Update" : "Submit Application"}
                </button>
              </div>
            </div>
          )}

          <div className="ad-table-wrap" style={{ marginBottom: 12 }}>
            <div className="ad-table-header">
              <span className="ad-card-title">Scholarship Applications</span>
              <div style={{ display: "flex", gap: 8 }}>
                <div className="ad-search-input">
                  <span style={{ color: "#aab0bc" }}>{IC.Search}</span>
                  <input placeholder="Search student, scheme..."
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <select className="ad-select" value={schemeFilter} onChange={(e) => setSchemeFilter(e.target.value)}>
                  <option value="All">All schemes</option>
                  {schemeOptions.map((s) => <option key={s}>{s}</option>)}
                </select>
                <select className="ad-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="All">All status</option>
                  <option>Approved</option>
                  <option>Pending</option>
                  <option>Under Review</option>
                  <option>Rejected</option>
                </select>
              </div>
            </div>
            <table className="ad-table">
              <thead>
                <tr><th>Student</th><th>Branch</th><th>Scheme</th><th>Amount</th><th>Applied</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan="7" style={{ textAlign: "center", color: "#6b7a99" }}>No applications found.</td></tr>
                ) : (
                  filtered.map((a) => (
                    <tr key={a._id}>
                      <td style={{ fontWeight: 600 }}>{a.studentName}</td>
                      <td>{a.branch ? <span className="pill pill-blue" style={{ fontSize: 9 }}>{a.branch}</span> : "—"}</td>
                      <td style={{ color: "#6b7a99", fontSize: 11 }}>{a.scheme}</td>
                      <td style={{ fontWeight: 700, color: "#1a3a6e" }}>{formatAmount(a.amount)}</td>
                      <td style={{ color: "#6b7a99", fontSize: 11 }}>
                        {a.appliedDate ? new Date(a.appliedDate).toLocaleDateString("en-IN") : "—"}
                      </td>
                      <td>
                        <span className="pill" style={{ background: ST_BG[a.status], color: ST_COL[a.status], fontSize: 10 }}>
                          {a.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: 4 }}>
                          <button className="ad-btn-outline" style={{ padding: "4px 8px" }} onClick={() => openEdit(a)}>{IC.Edit}</button>
                          <button className="ad-btn-danger" style={{ padding: "4px 8px" }} onClick={() => handleDelete(a._id)}>{IC.Trash}</button>
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
              <div className="ad-card-header"><span className="ad-card-title">Scheme-wise applications</span></div>
              {schemeOptions.length === 0 ? (
                <div className="ad-page-sub">No data yet.</div>
              ) : (
                schemeOptions.map((s) => {
                  const cnt = (Array.isArray(apps) ? apps : []).filter((a) => a.scheme === s).length;
                  const max = schemeOptions.length ? Math.max(...schemeOptions.map((sn) =>
                    (Array.isArray(apps) ? apps : []).filter((a) => a.scheme === sn).length
                  ), 1) : 1;
                  const colors = ["#2563eb", "#534AB7", "#059669", "#d97706", "#dc2626"];
                  const col = colors[schemeOptions.indexOf(s) % colors.length];
                  return (
                    <div className="bar-row" key={s}>
                      <span className="bar-label" style={{ width: 130 }}>{s}</span>
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
              <div className="ad-card-header"><span className="ad-card-title">Disbursement summary</span></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  { label: "Total Applications", val: kpi.total, c: "#1a3a6e" },
                  { label: "Approved", val: kpi.approved, c: "#059669" },
                  { label: "Pending / Review", val: kpi.pending, c: "#d97706" },
                  { label: "Total Disbursed", val: formatAmount(kpi.disbursed), c: "#534AB7" },
                ].map((r, i) => (
                  <div key={i} style={{ background: "#f4f7fc", borderRadius: 8, padding: "8px 10px" }}>
                    <div style={{ fontSize: 9, fontWeight: 600, color: "#8a94a6", textTransform: "uppercase", marginBottom: 3 }}>
                      {r.label}
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: r.c }}>{r.val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default ScholarshipPage;