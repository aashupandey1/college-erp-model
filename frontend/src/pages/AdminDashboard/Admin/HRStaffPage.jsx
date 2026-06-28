import { useCallback, useEffect, useMemo, useState } from "react";
import { IC } from "../constants/iconMap";
import { apiFetch } from "../../../services/api";

/* ════════════════════════════════════════
   PAGE 14 — HR / STAFF
════════════════════════════════════════ */

const EMPTY_FORM = {
  employeeId: "",
  name: "",
  department: "",
  designation: "",
  employeeType: "Teaching",
  joinedDate: "",
  status: "Active",
  contactNumber: "",
  email: "",
};

function HRStaffPage() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [deptFilter, setDeptFilter] = useState("All");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/hr");
      setStaff(res?.data || []);
    } catch (e) {
      setError(e?.message || "Failed to load staff members");
      setStaff([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const kpi = useMemo(() => {
    const list = Array.isArray(staff) ? staff : [];
    const total = list.length;
    const teaching = list.filter((s) => s.employeeType === "Teaching").length;
    const nonTeaching = list.filter((s) => s.employeeType === "Non-Teaching").length;
    const onLeave = list.filter((s) => s.status === "On Leave").length;
    return { total, teaching, nonTeaching, onLeave };
  }, [staff]);

  const deptOptions = useMemo(() => {
    return [...new Set((Array.isArray(staff) ? staff : []).map((s) => s.department).filter(Boolean))].sort();
  }, [staff]);

  const deptCount = useMemo(() => {
    const list = Array.isArray(staff) ? staff : [];
    const map = {};
    list.forEach((s) => { if (s.department) map[s.department] = (map[s.department] || 0) + 1; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [staff]);

  const filtered = useMemo(() => {
    return (Array.isArray(staff) ? staff : []).filter((s) => {
      const term = searchTerm.toLowerCase();
      const matchSearch =
        (s.name || "").toLowerCase().includes(term) ||
        (s.employeeId || "").toLowerCase().includes(term) ||
        (s.designation || "").toLowerCase().includes(term) ||
        (s.department || "").toLowerCase().includes(term);
      const matchType = typeFilter === "All" || s.employeeType === typeFilter;
      const matchDept = deptFilter === "All" || s.department === deptFilter;
      return matchSearch && matchType && matchDept;
    });
  }, [staff, searchTerm, typeFilter, deptFilter]);

  const openAdd = () => {
    setEditId(null);
    // Auto-generate employee ID
    const num = String((Array.isArray(staff) ? staff : []).length + 1).padStart(3, "0");
    setForm({ ...EMPTY_FORM, employeeId: `EMP-${num}` });
    setShowForm(true);
  };

  const openEdit = (s) => {
    setEditId(s._id);
    setForm({
      employeeId: s.employeeId || "",
      name: s.name || "",
      department: s.department || "",
      designation: s.designation || "",
      employeeType: s.employeeType || "Teaching",
      joinedDate: s.joinedDate ? new Date(s.joinedDate).toISOString().split("T")[0] : "",
      status: s.status || "Active",
      contactNumber: s.contactNumber || "",
      email: s.email || "",
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.employeeId.trim()) { window.alert("Employee ID is required."); return; }
    if (!form.name.trim()) { window.alert("Name is required."); return; }
    if (!form.employeeType) { window.alert("Employee type is required."); return; }
    setSaving(true);
    try {
      const payload = {
        employeeId: form.employeeId.trim(),
        name: form.name.trim(),
        department: form.department.trim(),
        designation: form.designation.trim(),
        employeeType: form.employeeType,
        joinedDate: form.joinedDate || undefined,
        status: form.status,
        contactNumber: form.contactNumber.trim(),
        email: form.email.trim().toLowerCase(),
      };
      if (editId) {
        await apiFetch(`/hr/${editId}`, { method: "PUT", body: JSON.stringify(payload) });
        window.alert("Employee record updated.");
      } else {
        await apiFetch("/hr", { method: "POST", body: JSON.stringify(payload) });
        window.alert("Employee added successfully.");
      }
      setShowForm(false);
      setEditId(null);
      setForm(EMPTY_FORM);
      await loadData();
    } catch (e) {
      window.alert(e?.message || "Failed to save employee.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this employee record?")) return;
    try {
      await apiFetch(`/hr/${id}`, { method: "DELETE" });
      await loadData();
    } catch (e) {
      window.alert(e?.message || "Failed to delete employee.");
    }
  };

  const handleExport = () => {
    const headers = ["Employee ID", "Name", "Department", "Designation", "Type", "Joined", "Status", "Contact", "Email"];
    const rows = filtered.map((s) => [
      s.employeeId || "",
      s.name || "",
      s.department || "",
      s.designation || "",
      s.employeeType || "",
      s.joinedDate ? new Date(s.joinedDate).toLocaleDateString("en-IN") : "",
      s.status || "",
      s.contactNumber || "",
      s.email || "",
    ]);
    const csv = [headers.join(","), ...rows.map((row) => row.map((c) => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "staff-directory.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const initials = (name) => (name || "?").split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  return (
    <>
      <div className="ad-page-header">
        <div>
          <div className="ad-page-title">HR & Staff Management</div>
          <div className="ad-page-sub">
            {loading ? "Loading..." : `${kpi.total} employees · ${kpi.teaching} teaching · ${kpi.nonTeaching} non-teaching`}
          </div>
        </div>
        <div className="ad-header-actions">
          <button className="ad-btn-outline" onClick={handleExport} disabled={loading}>{IC.Download} Export</button>
          <button className="ad-btn-primary" onClick={openAdd}>{IC.Plus} Add Employee</button>
        </div>
      </div>

      {loading && <div className="ad-page-sub">Loading staff directory...</div>}
      {!loading && error && <div className="ad-page-sub" style={{ color: "#dc2626" }}>{error}</div>}

      {!loading && !error && (
        <>
          <div className="ad-kpi-grid ad-kpi-grid-4" style={{ marginBottom: 14 }}>
            {[
              { val: kpi.total, label: "Total employees", bg: "#eff4ff", c: "#2563eb" },
              { val: kpi.teaching, label: "Teaching staff", bg: "#EEEDFE", c: "#534AB7" },
              { val: kpi.nonTeaching, label: "Non-teaching staff", bg: "#EAF3DE", c: "#3B6D11" },
              { val: kpi.onLeave, label: "On leave today", bg: "#FAEEDA", c: "#854F0B" },
            ].map((k, i) => (
              <div className="ad-kpi" key={i}>
                <div className="ad-kpi-top">
                  <div className="ad-kpi-icon" style={{ background: k.bg, color: k.c }}>{IC.UsersGroup}</div>
                </div>
                <div className="ad-kpi-val">{k.val}</div>
                <div className="ad-kpi-label">{k.label}</div>
              </div>
            ))}
          </div>

          {showForm && (
            <div className="ad-card" style={{ marginBottom: 14 }}>
              <div className="ad-card-header">
                <span className="ad-card-title">{editId ? "Edit Employee" : "Add New Employee"}</span>
                <span className="ad-card-link" onClick={() => { setShowForm(false); setEditId(null); }}>Cancel</span>
              </div>
              <div className="ad-table-filters">
                <input className="ad-input" placeholder="Employee ID *" value={form.employeeId}
                  onChange={(e) => setForm((p) => ({ ...p, employeeId: e.target.value }))} />
                <input className="ad-input" placeholder="Full Name *" value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
                <input className="ad-input" placeholder="Department" value={form.department}
                  onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))} />
                <input className="ad-input" placeholder="Designation" value={form.designation}
                  onChange={(e) => setForm((p) => ({ ...p, designation: e.target.value }))} />
                <select className="ad-select" value={form.employeeType}
                  onChange={(e) => setForm((p) => ({ ...p, employeeType: e.target.value }))}>
                  <option>Teaching</option>
                  <option>Non-Teaching</option>
                </select>
                <input className="ad-input" type="date" placeholder="Joined Date" value={form.joinedDate}
                  onChange={(e) => setForm((p) => ({ ...p, joinedDate: e.target.value }))} />
                <select className="ad-select" value={form.status}
                  onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
                  <option>Active</option>
                  <option>On Leave</option>
                  <option>Inactive</option>
                </select>
                <input className="ad-input" placeholder="Contact Number" value={form.contactNumber}
                  onChange={(e) => setForm((p) => ({ ...p, contactNumber: e.target.value }))} />
                <input className="ad-input" type="email" placeholder="Email" value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
              </div>
              <div className="quick-actions">
                <button className="ad-btn-primary" onClick={handleSave} disabled={saving}>
                  {IC.Check} {saving ? "Saving..." : editId ? "Update Employee" : "Add Employee"}
                </button>
              </div>
            </div>
          )}

          <div className="ad-table-wrap" style={{ marginBottom: 12 }}>
            <div className="ad-table-header">
              <span className="ad-card-title">Employee Directory</span>
              <div style={{ display: "flex", gap: 8 }}>
                <div className="ad-search-input">
                  <span style={{ color: "#aab0bc" }}>{IC.Search}</span>
                  <input placeholder="Search employee..."
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <select className="ad-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                  <option value="All">All types</option>
                  <option>Teaching</option>
                  <option>Non-Teaching</option>
                </select>
                <select className="ad-select" value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
                  <option value="All">All depts</option>
                  {deptOptions.map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <table className="ad-table">
              <thead>
                <tr><th>Employee</th><th>Dept</th><th>Designation</th><th>Type</th><th>Joined</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan="7" style={{ textAlign: "center", color: "#6b7a99" }}>No employees found.</td></tr>
                ) : (
                  filtered.map((s) => (
                    <tr key={s._id}>
                      <td>
                        <div className="stu-cell">
                          <div className="stu-av" style={{ background: "#eff4ff", color: "#2563eb" }}>{initials(s.name)}</div>
                          <div>
                            <div className="stu-name">{s.name}</div>
                            <div className="stu-id">{s.employeeId}</div>
                          </div>
                        </div>
                      </td>
                      <td>{s.department ? <span className="pill pill-purple" style={{ fontSize: 9 }}>{s.department}</span> : "—"}</td>
                      <td style={{ color: "#6b7a99", fontSize: 11 }}>{s.designation || "—"}</td>
                      <td>
                        <span className={s.employeeType === "Teaching" ? "pill pill-blue" : "pill pill-gray"} style={{ fontSize: 9 }}>
                          {s.employeeType}
                        </span>
                      </td>
                      <td style={{ color: "#6b7a99", fontSize: 11 }}>
                        {s.joinedDate ? new Date(s.joinedDate).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "—"}
                      </td>
                      <td>
                        <span className={s.status === "Active" ? "pill pill-green" : s.status === "On Leave" ? "pill pill-amber" : "pill pill-gray"}>
                          {s.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: 4 }}>
                          <button className="ad-btn-outline" style={{ padding: "4px 8px" }} onClick={() => openEdit(s)}>{IC.Edit}</button>
                          <button className="ad-btn-danger" style={{ padding: "4px 8px" }} onClick={() => handleDelete(s._id)}>{IC.Trash}</button>
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
              <div className="ad-card-header"><span className="ad-card-title">Department-wise headcount</span></div>
              {deptCount.length === 0 ? (
                <div className="ad-page-sub">No data yet.</div>
              ) : (
                deptCount.map(([dept, cnt]) => {
                  const colors = ["#2563eb", "#534AB7", "#854F0B", "#059669", "#d97706", "#6b7a99"];
                  const col = colors[deptCount.map(([d]) => d).indexOf(dept) % colors.length];
                  const max = deptCount[0]?.[1] || 1;
                  return (
                    <div className="bar-row" key={dept}>
                      <span className="bar-label" style={{ width: 60 }}>{dept}</span>
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
              <div className="ad-card-header"><span className="ad-card-title">Staff summary</span></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  { label: "Total Staff", val: kpi.total, c: "#1a3a6e" },
                  { label: "Teaching", val: kpi.teaching, c: "#534AB7" },
                  { label: "Non-Teaching", val: kpi.nonTeaching, c: "#059669" },
                  { label: "On Leave", val: kpi.onLeave, c: "#d97706" },
                ].map((r, i) => (
                  <div key={i} style={{ background: "#f4f7fc", borderRadius: 8, padding: "8px 10px" }}>
                    <div style={{ fontSize: 9, fontWeight: 600, color: "#8a94a6", textTransform: "uppercase", marginBottom: 3 }}>
                      {r.label}
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: r.c }}>{r.val}</div>
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

export default HRStaffPage;