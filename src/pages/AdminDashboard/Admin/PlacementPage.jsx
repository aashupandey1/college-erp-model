import { useCallback, useEffect, useMemo, useState } from "react";
import { IC } from "../constants/iconMap";
import { apiFetch } from "../../../services/api";

/* ════════════════════════════════════════
   PAGE 9 — PLACEMENT
════════════════════════════════════════ */

const EMPTY_FORM = {
  companyName: "",
  role: "",
  packageLpa: "",
  location: "",
  driveDate: "",
  eligibilityBranch: "",
  eligibilityBatch: "",
  status: "Scheduled",
  description: "",
};

function PlacementPage() {
  const [drives, setDrives] = useState([]);
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
      const res = await apiFetch("/placement");
      setDrives(res?.data || []);
    } catch (e) {
      setError(e?.message || "Failed to load placement drives");
      setDrives([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const kpi = useMemo(() => {
    const list = Array.isArray(drives) ? drives : [];
    const totalPlaced = list.reduce(
      (sum, d) => sum + (Array.isArray(d.selectedStudents) ? d.selectedStudents.length : 0),
      0
    );
    const companies = list.length;
    const pkgs = list.map((d) => d.packageLpa || 0).filter((p) => p > 0);
    const highest = pkgs.length ? Math.max(...pkgs) : 0;
    const avg = pkgs.length ? (pkgs.reduce((a, b) => a + b, 0) / pkgs.length).toFixed(1) : 0;
    return { totalPlaced, companies, highest, avg };
  }, [drives]);

  const filtered = useMemo(() => {
    return (Array.isArray(drives) ? drives : []).filter((d) => {
      const matchSearch =
        (d.companyName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (d.role || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (d.eligibilityBranch || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === "All" || d.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [drives, searchTerm, statusFilter]);

  const activeDrives = useMemo(
    () => filtered.filter((d) => d.status === "Scheduled" || d.status === "Ongoing").slice(0, 5),
    [filtered]
  );

  const openAdd = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (drive) => {
    setEditId(drive._id);
    setForm({
      companyName: drive.companyName || "",
      role: drive.role || "",
      packageLpa: drive.packageLpa ?? "",
      location: drive.location || "",
      driveDate: drive.driveDate ? drive.driveDate.split("T")[0] : "",
      eligibilityBranch: drive.eligibilityBranch || "",
      eligibilityBatch: drive.eligibilityBatch || "",
      status: drive.status || "Scheduled",
      description: drive.description || "",
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.companyName.trim()) { window.alert("Company name is required."); return; }
    if (!form.role.trim()) { window.alert("Job role is required."); return; }
    if (!form.driveDate) { window.alert("Drive date is required."); return; }
    setSaving(true);
    try {
      const payload = {
        companyName: form.companyName.trim(),
        role: form.role.trim(),
        packageLpa: Number(form.packageLpa) || 0,
        location: form.location.trim(),
        driveDate: form.driveDate,
        eligibilityBranch: form.eligibilityBranch.trim(),
        eligibilityBatch: form.eligibilityBatch.trim(),
        status: form.status,
        description: form.description.trim(),
      };
      if (editId) {
        await apiFetch(`/placement/${editId}`, { method: "PUT", body: JSON.stringify(payload) });
        window.alert("Drive updated successfully.");
      } else {
        await apiFetch("/placement", { method: "POST", body: JSON.stringify(payload) });
        window.alert("Drive added successfully.");
      }
      setShowForm(false);
      setEditId(null);
      setForm(EMPTY_FORM);
      await loadData();
    } catch (e) {
      window.alert(e?.message || "Failed to save drive.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this placement drive?")) return;
    try {
      await apiFetch(`/placement/${id}`, { method: "DELETE" });
      await loadData();
    } catch (e) {
      window.alert(e?.message || "Failed to delete drive.");
    }
  };

  const handleExport = () => {
    const headers = ["Company", "Role", "Package (LPA)", "Location", "Drive Date", "Branch", "Batch", "Applied", "Selected", "Status"];
    const rows = filtered.map((d) => [
      d.companyName || "",
      d.role || "",
      d.packageLpa ?? 0,
      d.location || "",
      d.driveDate ? new Date(d.driveDate).toLocaleDateString("en-IN") : "",
      d.eligibilityBranch || "",
      d.eligibilityBatch || "",
      Array.isArray(d.studentsApplied) ? d.studentsApplied.length : 0,
      Array.isArray(d.selectedStudents) ? d.selectedStudents.length : 0,
      d.status || "",
    ]);
    const csv = [headers.join(","), ...rows.map((row) => row.map((c) => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "placement-drives.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const statusPillClass = (s) => {
    if (s === "Scheduled") return "pill-blue";
    if (s === "Ongoing") return "pill-amber";
    if (s === "Completed") return "pill-green";
    return "pill-gray";
  };

  return (
    <>
      <div className="ad-page-header">
        <div>
          <div className="ad-page-title">Placement Cell</div>
          <div className="ad-page-sub">
            {loading ? "Loading..." : `${kpi.companies} drives · ${kpi.totalPlaced} students placed · AY 2025–26`}
          </div>
        </div>
        <div className="ad-header-actions">
          <button className="ad-btn-outline" onClick={handleExport} disabled={loading}>
            {IC.Download} Placement Report
          </button>
          <button className="ad-btn-primary" onClick={openAdd}>{IC.Plus} Add Drive</button>
        </div>
      </div>

      {loading && <div className="ad-page-sub">Loading placement data...</div>}
      {!loading && error && <div className="ad-page-sub" style={{ color: "#dc2626" }}>{error}</div>}

      {!loading && !error && (
        <>
          <div className="ad-kpi-grid ad-kpi-grid-4" style={{ marginBottom: 14 }}>
            {[
              { val: kpi.totalPlaced, label: "Students placed", bg: "#f0fdf4", c: "#059669" },
              { val: kpi.companies, label: "Companies visited", bg: "#EEEDFE", c: "#534AB7" },
              { val: kpi.highest ? `₹${kpi.highest}L` : "—", label: "Highest package", bg: "#FAEEDA", c: "#854F0B" },
              { val: kpi.avg ? `₹${kpi.avg}L` : "—", label: "Average package", bg: "#eff4ff", c: "#2563eb" },
            ].map((k, i) => (
              <div className="ad-kpi" key={i}>
                <div className="ad-kpi-top">
                  <div className="ad-kpi-icon" style={{ background: k.bg, color: k.c }}>{IC.Placement}</div>
                </div>
                <div className="ad-kpi-val">{k.val}</div>
                <div className="ad-kpi-label">{k.label}</div>
              </div>
            ))}
          </div>

          {showForm && (
            <div className="ad-card" style={{ marginBottom: 14 }}>
              <div className="ad-card-header">
                <span className="ad-card-title">{editId ? "Edit Drive" : "Add Placement Drive"}</span>
                <span className="ad-card-link" onClick={() => { setShowForm(false); setEditId(null); }}>Cancel</span>
              </div>
              <div className="ad-table-filters">
                <input className="ad-input" placeholder="Company Name *" value={form.companyName}
                  onChange={(e) => setForm((p) => ({ ...p, companyName: e.target.value }))} />
                <input className="ad-input" placeholder="Job Role *" value={form.role}
                  onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))} />
                <input className="ad-input" type="number" placeholder="Package (LPA)" value={form.packageLpa}
                  onChange={(e) => setForm((p) => ({ ...p, packageLpa: e.target.value }))} />
                <input className="ad-input" placeholder="Location" value={form.location}
                  onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} />
                <input className="ad-input" type="date" placeholder="Drive Date *" value={form.driveDate}
                  onChange={(e) => setForm((p) => ({ ...p, driveDate: e.target.value }))} />
                <input className="ad-input" placeholder="Eligible Branch (e.g. CSE, IT)" value={form.eligibilityBranch}
                  onChange={(e) => setForm((p) => ({ ...p, eligibilityBranch: e.target.value }))} />
                <input className="ad-input" placeholder="Eligible Batch (e.g. 2026)" value={form.eligibilityBatch}
                  onChange={(e) => setForm((p) => ({ ...p, eligibilityBatch: e.target.value }))} />
                <select className="ad-select" value={form.status}
                  onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
                  <option>Scheduled</option>
                  <option>Ongoing</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                </select>
              </div>
              <div style={{ padding: "8px 16px" }}>
                <input className="ad-input" placeholder="Description / Notes" value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  style={{ width: "100%", boxSizing: "border-box" }} />
              </div>
              <div className="quick-actions">
                <button className="ad-btn-primary" onClick={handleSave} disabled={saving}>
                  {IC.Check} {saving ? "Saving..." : editId ? "Update Drive" : "Save Drive"}
                </button>
              </div>
            </div>
          )}

          <div className="ad-grid-2">
            <div className="ad-card">
              <div className="ad-card-header">
                <span className="ad-card-title">Active / Upcoming drives</span>
                <span className="ad-card-link">View all</span>
              </div>
              {activeDrives.length === 0 ? (
                <div className="ad-page-sub">No active drives.</div>
              ) : (
                <div className="timeline">
                  {activeDrives.map((d) => (
                    <div className="tl-item" key={d._id}>
                      <div className="tl-dot" style={{ background: "#EEEDFE", color: "#534AB7", fontWeight: 700, fontSize: 10 }}>
                        {(d.companyName || "?")[0]}
                      </div>
                      <div className="tl-body">
                        <div className="tl-title">{d.companyName} — {d.role}</div>
                        <div className="tl-sub">
                          {d.packageLpa ? `₹${d.packageLpa} LPA` : "Package TBD"} · Drive:{" "}
                          {d.driveDate ? new Date(d.driveDate).toLocaleDateString("en-IN") : "TBD"} ·{" "}
                          <span style={{ color: "#2563eb", fontWeight: 600 }}>
                            {Array.isArray(d.studentsApplied) ? d.studentsApplied.length : 0} applied
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="ad-card">
              <div className="ad-card-header"><span className="ad-card-title">Drive status summary</span></div>
              {["Scheduled", "Ongoing", "Completed", "Cancelled"].map((s) => {
                const cnt = (Array.isArray(drives) ? drives : []).filter((d) => d.status === s).length;
                const colors = { Scheduled: "#2563eb", Ongoing: "#d97706", Completed: "#059669", Cancelled: "#dc2626" };
                return (
                  <div className="bar-row" key={s}>
                    <span className="bar-label" style={{ width: 90 }}>{s}</span>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: drives.length ? `${(cnt / drives.length) * 100}%` : "0%", background: colors[s] }} />
                    </div>
                    <span className="bar-pct" style={{ color: colors[s] }}>{cnt}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="ad-table-wrap" style={{ marginTop: 12 }}>
            <div className="ad-table-header">
              <span className="ad-card-title">All Placement Drives</span>
              <div style={{ display: "flex", gap: 8 }}>
                <div className="ad-search-input">
                  <span style={{ color: "#aab0bc" }}>{IC.Search}</span>
                  <input placeholder="Search company, role, branch..."
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <select className="ad-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="All">All status</option>
                  <option>Scheduled</option>
                  <option>Ongoing</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                </select>
              </div>
            </div>
            <table className="ad-table">
              <thead>
                <tr>
                  <th>Company</th><th>Role</th><th>Package</th><th>Drive Date</th>
                  <th>Branch</th><th>Applied</th><th>Selected</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan="9" style={{ textAlign: "center", color: "#6b7a99" }}>No drives found.</td></tr>
                ) : (
                  filtered.map((d) => (
                    <tr key={d._id}>
                      <td style={{ fontWeight: 600 }}>{d.companyName}</td>
                      <td style={{ color: "#6b7a99", fontSize: 11 }}>{d.role}</td>
                      <td style={{ fontWeight: 700, color: "#1a3a6e" }}>
                        {d.packageLpa ? `₹${d.packageLpa} LPA` : "—"}
                      </td>
                      <td style={{ color: "#6b7a99", fontSize: 11 }}>
                        {d.driveDate ? new Date(d.driveDate).toLocaleDateString("en-IN") : "—"}
                      </td>
                      <td>
                        {d.eligibilityBranch ? (
                          <span className="pill pill-blue" style={{ fontSize: 9 }}>{d.eligibilityBranch}</span>
                        ) : "—"}
                      </td>
                      <td style={{ fontWeight: 600 }}>
                        {Array.isArray(d.studentsApplied) ? d.studentsApplied.length : 0}
                      </td>
                      <td style={{ fontWeight: 600, color: "#059669" }}>
                        {Array.isArray(d.selectedStudents) ? d.selectedStudents.length : 0}
                      </td>
                      <td>
                        <span className={`pill ${statusPillClass(d.status)}`}>{d.status}</span>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: 4 }}>
                          <button className="ad-btn-outline" style={{ padding: "4px 8px" }} onClick={() => openEdit(d)}>
                            {IC.Edit}
                          </button>
                          <button className="ad-btn-danger" style={{ padding: "4px 8px" }} onClick={() => handleDelete(d._id)}>
                            {IC.Trash}
                          </button>
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

export default PlacementPage;