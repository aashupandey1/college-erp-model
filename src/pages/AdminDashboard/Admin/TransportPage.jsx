import { useCallback, useEffect, useMemo, useState } from "react";
import { IC } from "../constants/iconMap";
import { apiFetch } from "../../../services/api";

/* ════════════════════════════════════════
   PAGE 8 — TRANSPORT
════════════════════════════════════════ */

const EMPTY_FORM = {
  routeName: "",
  vehicleNumber: "",
  driverName: "",
  capacity: "",
  fare: "",
  status: "Active",
  stops: "",
};

function TransportPage() {
  const [routes, setRoutes] = useState([]);
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
      const res = await apiFetch("/transport");
      setRoutes(res?.data || []);
    } catch (e) {
      setError(e?.message || "Failed to load transport routes");
      setRoutes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const kpi = useMemo(() => {
    const list = Array.isArray(routes) ? routes : [];
    const active = list.filter((r) => r.status === "Active").length;
    const maintenance = list.filter((r) => r.status === "Maintenance").length;
    const totalStudents = list.reduce(
      (sum, r) => sum + (Array.isArray(r.assignedStudents) ? r.assignedStudents.length : 0),
      0
    );
    return { total: list.length, active, maintenance, totalStudents };
  }, [routes]);

  const filtered = useMemo(() => {
    return (Array.isArray(routes) ? routes : []).filter((r) => {
      const matchSearch =
        (r.routeName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.vehicleNumber || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.driverName || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === "All" || r.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [routes, searchTerm, statusFilter]);

  const openAdd = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (route) => {
    setEditId(route._id);
    setForm({
      routeName: route.routeName || "",
      vehicleNumber: route.vehicleNumber || "",
      driverName: route.driverName || "",
      capacity: route.capacity ?? "",
      fare: route.fare ?? "",
      status: route.status || "Active",
      stops: Array.isArray(route.stops) ? route.stops.join(", ") : (route.stops || ""),
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.routeName.trim()) {
      window.alert("Route name is required.");
      return;
    }
    if (!form.vehicleNumber.trim()) {
      window.alert("Vehicle number is required.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        routeName: form.routeName.trim(),
        vehicleNumber: form.vehicleNumber.trim().toUpperCase(),
        driverName: form.driverName.trim(),
        capacity: Number(form.capacity) || 0,
        fare: Number(form.fare) || 0,
        status: form.status,
        stops: form.stops
          ? form.stops.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
      };
      if (editId) {
        await apiFetch(`/transport/${editId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        window.alert("Route updated successfully.");
      } else {
        await apiFetch("/transport", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        window.alert("Route added successfully.");
      }
      setShowForm(false);
      setEditId(null);
      setForm(EMPTY_FORM);
      await loadData();
    } catch (e) {
      window.alert(e?.message || "Failed to save route.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this route?")) return;
    try {
      await apiFetch(`/transport/${id}`, { method: "DELETE" });
      await loadData();
    } catch (e) {
      window.alert(e?.message || "Failed to delete route.");
    }
  };

  const handleExport = () => {
    const headers = ["Route Name", "Vehicle", "Driver", "Capacity", "Fare", "Stops", "Students", "Status"];
    const rows = filtered.map((r) => [
      r.routeName || "",
      r.vehicleNumber || "",
      r.driverName || "",
      r.capacity ?? 0,
      r.fare ?? 0,
      Array.isArray(r.stops) ? r.stops.join("; ") : "",
      Array.isArray(r.assignedStudents) ? r.assignedStudents.length : 0,
      r.status || "",
    ]);
    const csv = [headers.join(","), ...rows.map((row) => row.map((c) => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transport-routes.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="ad-page-header">
        <div>
          <div className="ad-page-title">Transport Management</div>
          <div className="ad-page-sub">
            {loading ? "Loading..." : `${kpi.total} routes · ${kpi.totalStudents} pass holders · 2026–27`}
          </div>
        </div>
        <div className="ad-header-actions">
          <button className="ad-btn-outline" onClick={handleExport} disabled={loading}>
            {IC.Download} Export
          </button>
          <button className="ad-btn-primary" onClick={openAdd}>
            {IC.Plus} Add Route
          </button>
        </div>
      </div>

      {loading && <div className="ad-page-sub">Loading transport routes...</div>}
      {!loading && error && <div className="ad-page-sub" style={{ color: "#dc2626" }}>{error}</div>}

      {!loading && !error && (
        <>
          <div className="ad-kpi-grid ad-kpi-grid-4" style={{ marginBottom: 14 }}>
            {[
              { val: kpi.total, label: "Total routes", bg: "#eff4ff", c: "#2563eb" },
              { val: kpi.active, label: "Active routes", bg: "#f0fdf4", c: "#059669" },
              { val: kpi.totalStudents, label: "Pass holders", bg: "#FAEEDA", c: "#854F0B" },
              { val: kpi.maintenance, label: "Under maintenance", bg: "#fef2f2", c: "#dc2626" },
            ].map((k, i) => (
              <div className="ad-kpi" key={i}>
                <div className="ad-kpi-top">
                  <div className="ad-kpi-icon" style={{ background: k.bg, color: k.c }}>{IC.Transport}</div>
                </div>
                <div className="ad-kpi-val">{k.val}</div>
                <div className="ad-kpi-label">{k.label}</div>
              </div>
            ))}
          </div>

          {showForm && (
            <div className="ad-card" style={{ marginBottom: 14 }}>
              <div className="ad-card-header">
                <span className="ad-card-title">{editId ? "Edit Route" : "Add New Route"}</span>
                <span className="ad-card-link" onClick={() => { setShowForm(false); setEditId(null); }}>
                  Cancel
                </span>
              </div>
              <div className="ad-table-filters">
                <input
                  className="ad-input"
                  placeholder="Route Name *"
                  value={form.routeName}
                  onChange={(e) => setForm((p) => ({ ...p, routeName: e.target.value }))}
                />
                <input
                  className="ad-input"
                  placeholder="Vehicle Number *"
                  value={form.vehicleNumber}
                  onChange={(e) => setForm((p) => ({ ...p, vehicleNumber: e.target.value.toUpperCase() }))}
                />
                <input
                  className="ad-input"
                  placeholder="Driver Name"
                  value={form.driverName}
                  onChange={(e) => setForm((p) => ({ ...p, driverName: e.target.value }))}
                />
                <input
                  className="ad-input"
                  type="number"
                  placeholder="Capacity"
                  value={form.capacity}
                  onChange={(e) => setForm((p) => ({ ...p, capacity: e.target.value }))}
                />
                <input
                  className="ad-input"
                  type="number"
                  placeholder="Fare (₹)"
                  value={form.fare}
                  onChange={(e) => setForm((p) => ({ ...p, fare: e.target.value }))}
                />
                <select
                  className="ad-select"
                  value={form.status}
                  onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
                >
                  <option>Active</option>
                  <option>Inactive</option>
                  <option>Maintenance</option>
                </select>
              </div>
              <div style={{ padding: "8px 16px" }}>
                <input
                  className="ad-input"
                  placeholder="Stops (comma separated, e.g. Sector 14, NIT, Old Faridabad)"
                  value={form.stops}
                  onChange={(e) => setForm((p) => ({ ...p, stops: e.target.value }))}
                  style={{ width: "100%", boxSizing: "border-box" }}
                />
              </div>
              <div className="quick-actions">
                <button className="ad-btn-primary" onClick={handleSave} disabled={saving}>
                  {IC.Check} {saving ? "Saving..." : editId ? "Update Route" : "Save Route"}
                </button>
              </div>
            </div>
          )}

          <div className="ad-table-wrap">
            <div className="ad-table-header">
              <span className="ad-card-title">All Routes</span>
              <div style={{ display: "flex", gap: 8 }}>
                <div className="ad-search-input">
                  <span style={{ color: "#aab0bc" }}>{IC.Search}</span>
                  <input
                    placeholder="Search route, vehicle, driver..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="ad-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All status</option>
                  <option>Active</option>
                  <option>Inactive</option>
                  <option>Maintenance</option>
                </select>
              </div>
            </div>
            <table className="ad-table">
              <thead>
                <tr>
                  <th>Route Name</th>
                  <th>Stops</th>
                  <th>Vehicle</th>
                  <th>Driver</th>
                  <th>Capacity</th>
                  <th>Fare</th>
                  <th>Students</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan="9" style={{ textAlign: "center", color: "#6b7a99" }}>No routes found.</td></tr>
                ) : (
                  filtered.map((r) => (
                    <tr key={r._id}>
                      <td style={{ fontWeight: 600 }}>{r.routeName}</td>
                      <td style={{ color: "#6b7a99" }}>
                        {Array.isArray(r.stops) ? r.stops.length : 0} stops
                      </td>
                      <td style={{ fontFamily: "monospace", fontSize: 11 }}>{r.vehicleNumber}</td>
                      <td style={{ color: "#6b7a99" }}>{r.driverName || "—"}</td>
                      <td style={{ color: "#6b7a99" }}>{r.capacity ?? "—"}</td>
                      <td style={{ fontWeight: 600 }}>
                        {r.fare ? `₹${r.fare}` : "—"}
                      </td>
                      <td style={{ fontWeight: 600 }}>
                        {Array.isArray(r.assignedStudents) ? r.assignedStudents.length : 0}
                      </td>
                      <td>
                        <span className={r.status === "Active" ? "pill pill-green" : r.status === "Maintenance" ? "pill pill-amber" : "pill pill-gray"}>
                          {r.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: 4 }}>
                          <button className="ad-btn-outline" style={{ padding: "4px 8px" }} onClick={() => openEdit(r)}>
                            {IC.Edit}
                          </button>
                          <button className="ad-btn-danger" style={{ padding: "4px 8px" }} onClick={() => handleDelete(r._id)}>
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

export default TransportPage;