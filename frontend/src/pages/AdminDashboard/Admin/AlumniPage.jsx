import { useCallback, useEffect, useMemo, useState } from "react";
import { IC } from "../constants/iconMap";
import { apiFetch } from "../../../services/api";

/* ════════════════════════════════════════
   PAGE 15 — ALUMNI
════════════════════════════════════════ */

const EMPTY_FORM = {
  fullName: "",
  batch: "",
  branch: "",
  company: "",
  role: "",
  city: "",
  email: "",
  phone: "",
  status: "Active",
};

function AlumniPage() {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const [searchTerm, setSearchTerm] = useState("");
  const [batchFilter, setBatchFilter] = useState("All");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/alumni");
      setAlumni(res?.data || []);
    } catch (e) {
      setError(e?.message || "Failed to load alumni");
      setAlumni([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const kpi = useMemo(() => {
    const list = Array.isArray(alumni) ? alumni : [];
    const total = list.length;
    const batches = [...new Set(list.map((a) => a.batch).filter(Boolean))];
    const latestBatch = batches.sort().reverse()[0];
    const latestCount = latestBatch ? list.filter((a) => a.batch === latestBatch).length : 0;
    return { total, batches: batches.length, latestBatch, latestCount };
  }, [alumni]);

  const batchOptions = useMemo(() => {
    return [...new Set((Array.isArray(alumni) ? alumni : []).map((a) => a.batch).filter(Boolean))].sort().reverse();
  }, [alumni]);

  const batchBreakdown = useMemo(() => {
    const list = Array.isArray(alumni) ? alumni : [];
    const map = {};
    list.forEach((a) => { if (a.batch) map[a.batch] = (map[a.batch] || 0) + 1; });
    return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0])).slice(0, 5);
  }, [alumni]);

  const filtered = useMemo(() => {
    return (Array.isArray(alumni) ? alumni : []).filter((a) => {
      const term = searchTerm.toLowerCase();
      const matchSearch =
        (a.fullName || "").toLowerCase().includes(term) ||
        (a.company || "").toLowerCase().includes(term) ||
        (a.branch || "").toLowerCase().includes(term) ||
        (a.city || "").toLowerCase().includes(term);
      const matchBatch = batchFilter === "All" || a.batch === batchFilter;
      return matchSearch && matchBatch;
    });
  }, [alumni, searchTerm, batchFilter]);

  const openAdd = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (a) => {
    setEditId(a._id);
    setForm({
      fullName: a.fullName || "",
      batch: a.batch || "",
      branch: a.branch || "",
      company: a.company || "",
      role: a.role || "",
      city: a.city || "",
      email: a.email || "",
      phone: a.phone || "",
      status: a.status || "Active",
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.fullName.trim()) { window.alert("Full name is required."); return; }
    if (!form.batch.trim()) { window.alert("Batch year is required."); return; }
    setSaving(true);
    try {
      const payload = {
        fullName: form.fullName.trim(),
        batch: form.batch.trim(),
        branch: form.branch.trim(),
        company: form.company.trim(),
        role: form.role.trim(),
        city: form.city.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        status: form.status,
      };
      if (editId) {
        await apiFetch(`/alumni/${editId}`, { method: "PUT", body: JSON.stringify(payload) });
        window.alert("Alumni record updated.");
      } else {
        await apiFetch("/alumni", { method: "POST", body: JSON.stringify(payload) });
        window.alert("Alumni registered successfully.");
      }
      setShowForm(false);
      setEditId(null);
      setForm(EMPTY_FORM);
      await loadData();
    } catch (e) {
      window.alert(e?.message || "Failed to save alumni record.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this alumni record?")) return;
    try {
      await apiFetch(`/alumni/${id}`, { method: "DELETE" });
      await loadData();
    } catch (e) {
      window.alert(e?.message || "Failed to delete alumni.");
    }
  };

  const handleExport = () => {
    const headers = ["Full Name", "Batch", "Branch", "Company", "Role", "City", "Email", "Phone", "Status"];
    const rows = filtered.map((a) => [
      a.fullName || "",
      a.batch || "",
      a.branch || "",
      a.company || "",
      a.role || "",
      a.city || "",
      a.email || "",
      a.phone || "",
      a.status || "",
    ]);
    const csv = [headers.join(","), ...rows.map((row) => row.map((c) => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "alumni-directory.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const initials = (name) => (name || "?").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <>
      <div className="ad-page-header">
        <div>
          <div className="ad-page-title">Alumni Management</div>
          <div className="ad-page-sub">
            {loading ? "Loading..." : `${kpi.total} registered alumni · ${kpi.batches} batches`}
          </div>
        </div>
        <div className="ad-header-actions">
          <button className="ad-btn-outline" onClick={handleExport} disabled={loading}>{IC.Download} Directory PDF</button>
          <button className="ad-btn-primary" onClick={openAdd}>{IC.Plus} Register Alumni</button>
        </div>
      </div>

      {loading && <div className="ad-page-sub">Loading alumni directory...</div>}
      {!loading && error && <div className="ad-page-sub" style={{ color: "#dc2626" }}>{error}</div>}

      {!loading && !error && (
        <>
          <div className="ad-kpi-grid ad-kpi-grid-4" style={{ marginBottom: 14 }}>
            {[
              { val: kpi.total, label: "Registered alumni", bg: "#EEEDFE", c: "#534AB7" },
              { val: kpi.latestCount, label: `Batch ${kpi.latestBatch || "—"} registered`, bg: "#EAF3DE", c: "#3B6D11" },
              { val: kpi.batches, label: "Total batches", bg: "#FAEEDA", c: "#854F0B" },
              { val: (Array.isArray(alumni) ? alumni : []).filter((a) => a.status === "Active").length, label: "Active profiles", bg: "#eff4ff", c: "#2563eb" },
            ].map((k, i) => (
              <div className="ad-kpi" key={i}>
                <div className="ad-kpi-top">
                  <div className="ad-kpi-icon" style={{ background: k.bg, color: k.c }}>{IC.GradCap}</div>
                </div>
                <div className="ad-kpi-val">{k.val}</div>
                <div className="ad-kpi-label">{k.label}</div>
              </div>
            ))}
          </div>

          {showForm && (
            <div className="ad-card" style={{ marginBottom: 14 }}>
              <div className="ad-card-header">
                <span className="ad-card-title">{editId ? "Edit Alumni" : "Register New Alumni"}</span>
                <span className="ad-card-link" onClick={() => { setShowForm(false); setEditId(null); }}>Cancel</span>
              </div>
              <div className="ad-table-filters">
                <input className="ad-input" placeholder="Full Name *" value={form.fullName}
                  onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))} />
                <input className="ad-input" placeholder="Batch Year * (e.g. 2023)" value={form.batch}
                  onChange={(e) => setForm((p) => ({ ...p, batch: e.target.value }))} />
                <input className="ad-input" placeholder="Branch (e.g. CSE)" value={form.branch}
                  onChange={(e) => setForm((p) => ({ ...p, branch: e.target.value }))} />
                <input className="ad-input" placeholder="Current Company" value={form.company}
                  onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))} />
                <input className="ad-input" placeholder="Current Role" value={form.role}
                  onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))} />
                <input className="ad-input" placeholder="City" value={form.city}
                  onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))} />
                <input className="ad-input" type="email" placeholder="Email" value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
                <input className="ad-input" placeholder="Phone" value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
                <select className="ad-select" value={form.status}
                  onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
              <div className="quick-actions">
                <button className="ad-btn-primary" onClick={handleSave} disabled={saving}>
                  {IC.Check} {saving ? "Saving..." : editId ? "Update" : "Register Alumni"}
                </button>
              </div>
            </div>
          )}

          <div className="ad-table-wrap" style={{ marginBottom: 12 }}>
            <div className="ad-table-header">
              <span className="ad-card-title">Alumni Directory</span>
              <div style={{ display: "flex", gap: 8 }}>
                <div className="ad-search-input">
                  <span style={{ color: "#aab0bc" }}>{IC.Search}</span>
                  <input placeholder="Search name, company, branch..."
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <select className="ad-select" value={batchFilter} onChange={(e) => setBatchFilter(e.target.value)}>
                  <option value="All">All batches</option>
                  {batchOptions.map((b) => <option key={b}>{b}</option>)}
                </select>
              </div>
            </div>
            <table className="ad-table">
              <thead>
                <tr><th>Alumni</th><th>Batch</th><th>Branch</th><th>Company</th><th>Role</th><th>City</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan="7" style={{ textAlign: "center", color: "#6b7a99" }}>No alumni found.</td></tr>
                ) : (
                  filtered.map((a) => (
                    <tr key={a._id}>
                      <td>
                        <div className="stu-cell">
                          <div className="stu-av" style={{ background: "#EEEDFE", color: "#534AB7" }}>{initials(a.fullName)}</div>
                          <div className="stu-name">{a.fullName}</div>
                        </div>
                      </td>
                      <td><span className="pill pill-purple" style={{ fontSize: 9 }}>Batch {a.batch}</span></td>
                      <td>{a.branch ? <span className="pill pill-blue" style={{ fontSize: 9 }}>{a.branch}</span> : "—"}</td>
                      <td style={{ fontWeight: 600, color: "#1a3a6e" }}>{a.company || "—"}</td>
                      <td style={{ color: "#6b7a99", fontSize: 11 }}>{a.role || "—"}</td>
                      <td style={{ color: "#6b7a99", fontSize: 11 }}>{a.city || "—"}</td>
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
              <div className="ad-card-header"><span className="ad-card-title">Batch-wise registrations</span></div>
              {batchBreakdown.length === 0 ? (
                <div className="ad-page-sub">No data yet.</div>
              ) : (
                batchBreakdown.map(([batch, cnt]) => {
                  const max = batchBreakdown[0]?.[1] || 1;
                  const colors = ["#534AB7", "#2563eb", "#2563eb", "#d97706", "#6b7a99"];
                  const col = colors[batchBreakdown.map(([b]) => b).indexOf(batch) % colors.length];
                  return (
                    <div className="bar-row" key={batch}>
                      <span className="bar-label" style={{ width: 60 }}>Batch {batch}</span>
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
              <div className="ad-card-header"><span className="ad-card-title">Top companies</span></div>
              {(() => {
                const list = Array.isArray(alumni) ? alumni : [];
                const map = {};
                list.forEach((a) => { if (a.company) map[a.company] = (map[a.company] || 0) + 1; });
                const top = Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5);
                const max = top[0]?.[1] || 1;
                const colors = ["#2563eb", "#534AB7", "#059669", "#d97706", "#dc2626"];
                if (top.length === 0) return <div className="ad-page-sub">No data yet.</div>;
                return top.map(([co, cnt], i) => (
                  <div className="bar-row" key={co}>
                    <span className="bar-label" style={{ width: 90 }}>{co}</span>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${(cnt / max) * 100}%`, background: colors[i % colors.length] }} />
                    </div>
                    <span className="bar-pct" style={{ color: colors[i % colors.length] }}>{cnt}</span>
                  </div>
                ));
              })()}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default AlumniPage;