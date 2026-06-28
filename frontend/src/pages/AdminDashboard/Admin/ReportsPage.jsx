import { useCallback, useEffect, useMemo, useState } from "react";
import { IC } from "../constants/iconMap";
import { apiFetch } from "../../../services/api";

/* ─── Constants ─── */
const TYPE_LABELS = {
  attendance: "Attendance Report",
  fees:       "Fee Collection Report",
  exams:      "Exam Results Report",
  placement:  "Placement Report",
  students:   "Student Master Report",
  faculty:    "Faculty Report",
  hostel:     "Hostel Report",
  library:    "Library Report",
  naac:       "NAAC Criterion Report",
};

const TYPE_COLORS = {
  attendance: { bg: "#eff4ff", c: "#2563eb" },
  fees:       { bg: "#f0fdf4", c: "#059669" },
  exams:      { bg: "#EEEDFE", c: "#534AB7" },
  placement:  { bg: "#FAEEDA", c: "#854F0B" },
  students:   { bg: "#fdf4ff", c: "#7c3aed" },
  faculty:    { bg: "#fef2f2", c: "#dc2626" },
  hostel:     { bg: "#FAECE7", c: "#993C1D" },
  library:    { bg: "#E1F5EE", c: "#0F6E56" },
  naac:       { bg: "#E6F1FB", c: "#185FA5" },
};

const statusPillClass = (status) => {
  if (status === "generated") return "pill-green";
  if (status === "ready")     return "pill-blue";
  if (status === "draft")     return "pill-gray";
  return "pill-gray";
};

const emptyForm = () => ({
  title:       "",
  category:    "",
  description: "",
  type:        "attendance",
  format:      "pdf",
  status:      "ready",
});

/* ════════════════════════════════════════
   PAGE 19 — REPORTS & ANALYTICS
════════════════════════════════════════ */
function ReportsPage() {
  const [reports,       setReports]       = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState("");
  const [saving,        setSaving]        = useState(false);
  const [searchTerm,    setSearchTerm]    = useState("");
  const [typeFilter,    setTypeFilter]    = useState("All");
  const [statusFilter,  setStatusFilter]  = useState("All");
  const [showForm,      setShowForm]      = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [form,          setForm]          = useState(emptyForm());

  /* ── Load ── */
  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/reports");
      setReports(Array.isArray(res?.data) ? res.data : []);
    } catch (e) {
      setError(e?.message || "Failed to load reports");
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  /* ── Derived ── */
  const kpiStats = useMemo(() => {
    const total     = reports.length;
    const generated = reports.filter((r) => r.status === "generated").length;
    const ready     = reports.filter((r) => r.status === "ready").length;
    const draft     = reports.filter((r) => r.status === "draft").length;
    return { total, generated, ready, draft };
  }, [reports]);

  const filteredReports = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return reports.filter((r) => {
      const matchesSearch =
        String(r.title       || "").toLowerCase().includes(q) ||
        String(r.category    || "").toLowerCase().includes(q) ||
        String(r.description || "").toLowerCase().includes(q);
      const matchesType   = typeFilter   === "All" || r.type   === typeFilter;
      const matchesStatus = statusFilter === "All" || r.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [reports, searchTerm, typeFilter, statusFilter]);

  /* Latest report per type (for card grid) */
  const latestByType = useMemo(() => {
    const map = {};
    filteredReports.forEach((r) => {
      if (!map[r.type]) map[r.type] = r;
    });
    return map;
  }, [filteredReports]);

  /* ── Form helpers ── */
  const setField = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const openAdd = () => {
    setEditingReport(null);
    setForm(emptyForm());
    setShowForm(true);
  };

  const openEdit = (report) => {
    setEditingReport(report);
    setForm({
      title:       report.title       || "",
      category:    report.category    || "",
      description: report.description || "",
      type:        report.type        || "attendance",
      format:      report.format      || "pdf",
      status:      report.status      || "ready",
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingReport(null);
    setForm(emptyForm());
  };

  /* ── Validation ── */
  const validateForm = () => {
    if (!form.title.trim()) return "Report title is required.";
    if (!form.type)         return "Report type is required.";
    return null;
  };

  /* ── CRUD ── */
  const handleSave = async () => {
    const err = validateForm();
    if (err) { window.alert(err); return; }

    if (!editingReport) {
      const dup = reports.some(
        (r) => r.title.trim().toLowerCase() === form.title.trim().toLowerCase()
      );
      if (dup) { window.alert("A report with this title already exists."); return; }
    }

    setSaving(true);
    try {
      const payload = { ...form, generatedAt: new Date().toISOString() };

      if (editingReport) {
        await apiFetch(`/reports/${editingReport._id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        window.alert("Report updated successfully.");
      } else {
        await apiFetch("/reports", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        window.alert("Report created successfully.");
      }
      closeForm();
      await loadData();
    } catch (e) {
      window.alert(e?.message || "Failed to save report.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (report) => {
    if (!window.confirm(`Delete report "${report.title}"?`)) return;
    try {
      await apiFetch(`/reports/${report._id}`, { method: "DELETE" });
      setReports((prev) => prev.filter((r) => r._id !== report._id));
    } catch (e) {
      window.alert(e?.message || "Failed to delete report.");
    }
  };

  const handleMarkGenerated = async (report) => {
    try {
      await apiFetch(`/reports/${report._id}`, {
        method: "PUT",
        body: JSON.stringify({ status: "generated", generatedAt: new Date().toISOString() }),
      });
      await loadData();
    } catch (e) {
      window.alert(e?.message || "Failed to update report status.");
    }
  };

  /* ── Export ── */
  const handleExport = () => {
    const headers = ["Title","Category","Type","Format","Status","Generated At"];
    const rows = filteredReports.map((r) => [
      r.title       || "",
      r.category    || "",
      TYPE_LABELS[r.type] || r.type || "",
      r.format      || "",
      r.status      || "",
      r.generatedAt ? new Date(r.generatedAt).toLocaleDateString("en-IN") : "",
    ]);
    const csv  = [headers.join(","), ...rows.map((row) => row.map((v) => `"${v}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href     = url;
    link.download = "reports.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  /* ════ RENDER ════ */
  return (
    <>
      {/* Header */}
      <div className="ad-page-header">
        <div>
          <div className="ad-page-title">Reports & Analytics</div>
          <div className="ad-page-sub">
            {loading
              ? "Loading…"
              : `${filteredReports.length} of ${reports.length} reports · MIS export`}
          </div>
        </div>
        <div className="ad-header-actions">
          <button type="button" className="ad-btn-outline" onClick={handleExport} disabled={loading}>
            {IC.Download} Export
          </button>
          <button type="button" className="ad-btn-primary" onClick={openAdd}>
            {IC.Plus} New Report
          </button>
        </div>
      </div>

      {loading && <div className="ad-page-sub">Loading reports…</div>}
      {!loading && error && <div className="ad-page-sub">{error}</div>}

      {!loading && !error && (
        <>
          {/* KPIs */}
          <div className="ad-kpi-grid ad-kpi-grid-4">
            <div className="ad-kpi">
              <div className="ad-kpi-top"><div className="ad-kpi-icon">{IC.Reports}</div></div>
              <div className="ad-kpi-val">{kpiStats.total}</div>
              <div className="ad-kpi-label">Total reports</div>
            </div>
            <div className="ad-kpi">
              <div className="ad-kpi-top"><div className="ad-kpi-icon">{IC.Check}</div></div>
              <div className="ad-kpi-val">{kpiStats.generated}</div>
              <div className="ad-kpi-label">Generated</div>
            </div>
            <div className="ad-kpi">
              <div className="ad-kpi-top"><div className="ad-kpi-icon">{IC.Star}</div></div>
              <div className="ad-kpi-val">{kpiStats.ready}</div>
              <div className="ad-kpi-label">Ready</div>
            </div>
            <div className="ad-kpi">
              <div className="ad-kpi-top"><div className="ad-kpi-icon">{IC.Edit}</div></div>
              <div className="ad-kpi-val">{kpiStats.draft}</div>
              <div className="ad-kpi-label">Draft</div>
            </div>
          </div>

          {/* Create / Edit Form */}
          {showForm && (
            <div className="ad-card">
              <div className="ad-card-header">
                <span className="ad-card-title">
                  {editingReport ? "Edit Report" : "Create Report"}
                </span>
                <span className="ad-card-link" onClick={closeForm}>Cancel</span>
              </div>

              <div className="ad-table-filters">
                <input
                  className="ad-input"
                  placeholder="Report Title *"
                  value={form.title}
                  onChange={(e) => setField("title", e.target.value)}
                />
                <input
                  className="ad-input"
                  placeholder="Category"
                  value={form.category}
                  onChange={(e) => setField("category", e.target.value)}
                />
                <input
                  className="ad-input"
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) => setField("description", e.target.value)}
                />
                <select
                  className="ad-select"
                  value={form.type}
                  onChange={(e) => setField("type", e.target.value)}
                >
                  {Object.keys(TYPE_LABELS).map((t) => (
                    <option key={t} value={t}>{TYPE_LABELS[t]}</option>
                  ))}
                </select>
                <select
                  className="ad-select"
                  value={form.format}
                  onChange={(e) => setField("format", e.target.value)}
                >
                  <option value="pdf">PDF</option>
                  <option value="excel">Excel</option>
                  <option value="csv">CSV</option>
                  <option value="json">JSON</option>
                </select>
                <select
                  className="ad-select"
                  value={form.status}
                  onChange={(e) => setField("status", e.target.value)}
                >
                  <option value="draft">Draft</option>
                  <option value="ready">Ready</option>
                  <option value="generated">Generated</option>
                </select>
              </div>

              <div className="quick-actions">
                <button
                  type="button"
                  className="ad-btn-primary"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {IC.Check} {saving ? "Saving…" : editingReport ? "Update Report" : "Create Report"}
                </button>
              </div>
            </div>
          )}

          {/* Report Cards (one per type that has at least one report) */}
          {Object.keys(TYPE_LABELS).some((t) => latestByType[t]) && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 10,
                marginBottom: 14,
              }}
            >
              {Object.keys(TYPE_LABELS)
                .filter((t) => latestByType[t])
                .map((type) => {
                  const colors = TYPE_COLORS[type] || { bg: "#eff4ff", c: "#2563eb" };
                  const rep    = latestByType[type];
                  return (
                    <div className="report-card" key={type}>
                      <div
                        className="report-icon"
                        style={{ background: colors.bg, color: colors.c }}
                      >
                        {IC.Reports}
                      </div>
                      <div>
                        <div className="report-title">{TYPE_LABELS[type]}</div>
                        <div className="report-desc">
                          {rep.description || rep.category || "Latest: " + (rep.format || "").toUpperCase()}
                        </div>
                      </div>
                      <div
                        style={{
                          marginLeft: "auto",
                          flexShrink: 0,
                          display: "flex",
                          flexDirection: "column",
                          gap: 4,
                          alignItems: "flex-end",
                        }}
                      >
                        <span className={`pill ${statusPillClass(rep.status)}`} style={{ fontSize: 9 }}>
                          {rep.status}
                        </span>
                        <button
                          type="button"
                          className="ad-btn-outline"
                          style={{ fontSize: 11 }}
                          onClick={() => handleMarkGenerated(rep)}
                          title="Mark as Generated"
                        >
                          {IC.Download}
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}

          {/* Table */}
          <div className="ad-table-wrap">
            <div className="ad-table-header">
              <span className="ad-card-title">All Reports</span>
              <div className="ad-table-filters">
                <div className="ad-search-input">
                  {IC.Search}
                  <input
                    placeholder="Search report…"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="ad-select"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="All">All types</option>
                  {Object.keys(TYPE_LABELS).map((t) => (
                    <option key={t} value={t}>{TYPE_LABELS[t]}</option>
                  ))}
                </select>
                <select
                  className="ad-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All status</option>
                  <option value="draft">Draft</option>
                  <option value="ready">Ready</option>
                  <option value="generated">Generated</option>
                </select>
              </div>
            </div>

            <table className="ad-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Format</th>
                  <th>Status</th>
                  <th>Generated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.length === 0 ? (
                  <tr>
                    <td colSpan="6">
                      No reports found. Click "New Report" to create one.
                    </td>
                  </tr>
                ) : (
                  filteredReports.map((report) => {
                    const colors = TYPE_COLORS[report.type] || { bg: "#eff4ff", c: "#2563eb" };
                    return (
                      <tr key={report._id}>
                        <td style={{ fontWeight: 600 }}>{report.title}</td>
                        <td>
                          <span
                            className="pill"
                            style={{ background: colors.bg, color: colors.c, fontSize: 9 }}
                          >
                            {TYPE_LABELS[report.type] || report.type}
                          </span>
                        </td>
                        <td style={{ fontFamily: "monospace", fontSize: 11, textTransform: "uppercase" }}>
                          {report.format}
                        </td>
                        <td>
                          <span className={`pill ${statusPillClass(report.status)}`} style={{ fontSize: 10 }}>
                            {report.status}
                          </span>
                        </td>
                        <td style={{ color: "#6b7a99", fontSize: 11 }}>
                          {report.generatedAt
                            ? new Date(report.generatedAt).toLocaleDateString("en-IN")
                            : "—"}
                        </td>
                        <td>
                          <div className="quick-actions">
                            <button
                              type="button"
                              className="ad-btn-outline ad-action-btn"
                              onClick={() => openEdit(report)}
                            >
                              {IC.Edit}
                            </button>
                            <button
                              type="button"
                              className="ad-btn-danger ad-action-btn"
                              onClick={() => handleDelete(report)}
                            >
                              {IC.Trash}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}

export default ReportsPage;