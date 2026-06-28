import { useCallback, useEffect, useMemo, useState } from "react";
import { IC } from "../constants/iconMap";
import { apiFetch } from "../../../services/api";

/* ─── Helpers ─── */
const formatCurrency = (n) => {
  const num = Number(n) || 0;
  try {
    return num.toLocaleString("en-IN", { maximumFractionDigits: 0 });
  } catch {
    return String(num);
  }
};

const formatCompact = (n) => {
  const num = Number(n) || 0;
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000)   return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000)     return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${formatCurrency(num)}`;
};

const statusPillClass = (status) => {
  if (status === "In Stock")     return "pill-green";
  if (status === "Low Stock")    return "pill-amber";
  if (status === "Out of Stock") return "pill-red";
  return "pill-gray";
};

const emptyForm = () => ({
  itemName:     "",
  category:     "",
  quantity:     "",
  unit:         "",
  value:        "",
  vendor:       "",
  status:       "In Stock",
  reorderLevel: "",
});

/* ════════════════════════════════════════
   PAGE 17 — PURCHASE / INVENTORY
════════════════════════════════════════ */
function InventoryPage() {
  const [items,          setItems]          = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState("");
  const [saving,         setSaving]         = useState(false);
  const [searchTerm,     setSearchTerm]     = useState("");
  const [statusFilter,   setStatusFilter]   = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showForm,       setShowForm]       = useState(false);
  const [editingItem,    setEditingItem]    = useState(null);
  const [form,           setForm]           = useState(emptyForm());

  /* ── Load ── */
  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/inventory");
      setItems(Array.isArray(res?.data) ? res.data : []);
    } catch (e) {
      setError(e?.message || "Failed to load inventory");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  /* ── Derived ── */
  const categoryOptions = useMemo(
    () => [...new Set(items.map((i) => i.category).filter(Boolean))].sort(),
    [items]
  );

  const kpiStats = useMemo(() => {
    const total      = items.length;
    const inStock    = items.filter((i) => i.status === "In Stock").length;
    const lowStock   = items.filter((i) => i.status === "Low Stock").length;
    const outOfStock = items.filter((i) => i.status === "Out of Stock").length;
    const totalValue = items.reduce((sum, i) => sum + (Number(i.value) || 0), 0);
    return { total, inStock, lowStock, outOfStock, totalValue };
  }, [items]);

  const filteredItems = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return items.filter((i) => {
      const matchesSearch =
        String(i.itemName  || "").toLowerCase().includes(q) ||
        String(i.category  || "").toLowerCase().includes(q) ||
        String(i.vendor    || "").toLowerCase().includes(q);
      const matchesStatus   = statusFilter   === "All" || i.status   === statusFilter;
      const matchesCategory = categoryFilter === "All" || i.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [items, searchTerm, statusFilter, categoryFilter]);

  /* ── Form helpers ── */
  const setField = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const openAdd = () => {
    setEditingItem(null);
    setForm(emptyForm());
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setForm({
      itemName:     item.itemName     || "",
      category:     item.category     || "",
      quantity:     item.quantity     ?? "",
      unit:         item.unit         || "",
      value:        item.value        ?? "",
      vendor:       item.vendor       || "",
      status:       item.status       || "In Stock",
      reorderLevel: item.reorderLevel ?? "",
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingItem(null);
    setForm(emptyForm());
  };

  /* ── Validation ── */
  const validateForm = () => {
    if (!form.itemName.trim())                             return "Item Name is required.";
    if (form.quantity === "" || isNaN(Number(form.quantity))) return "Valid quantity is required.";
    if (Number(form.quantity) < 0)                         return "Quantity cannot be negative.";
    return null;
  };

  /* ── CRUD ── */
  const handleSave = async () => {
    const err = validateForm();
    if (err) { window.alert(err); return; }

    if (!editingItem) {
      const dup = items.some(
        (i) => i.itemName.trim().toLowerCase() === form.itemName.trim().toLowerCase()
      );
      if (dup) { window.alert("An item with this name already exists."); return; }
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        quantity:     Number(form.quantity),
        value:        Number(form.value)        || 0,
        reorderLevel: Number(form.reorderLevel) || 0,
      };

      if (editingItem) {
        await apiFetch(`/inventory/${editingItem._id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        window.alert("Item updated successfully.");
      } else {
        await apiFetch("/inventory", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        window.alert("Item added successfully.");
      }
      closeForm();
      await loadData();
    } catch (e) {
      window.alert(e?.message || "Failed to save item.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.itemName}"? This cannot be undone.`)) return;
    try {
      await apiFetch(`/inventory/${item._id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((i) => i._id !== item._id));
    } catch (e) {
      window.alert(e?.message || "Failed to delete item.");
    }
  };

  /* ── Export ── */
  const handleExport = () => {
    const headers = ["Item Name","Category","Quantity","Unit","Value (₹)","Vendor","Status","Reorder Level"];
    const rows = filteredItems.map((i) => [
      i.itemName     || "",
      i.category     || "",
      i.quantity     ?? 0,
      i.unit         || "",
      i.value        ?? 0,
      i.vendor       || "",
      i.status       || "",
      i.reorderLevel ?? 0,
    ]);
    const csv  = [headers.join(","), ...rows.map((r) => r.map((v) => `"${v}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href     = url;
    link.download = "inventory.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  /* ════ RENDER ════ */
  return (
    <>
      {/* Header */}
      <div className="ad-page-header">
        <div>
          <div className="ad-page-title">Purchase & Inventory</div>
          <div className="ad-page-sub">
            {loading
              ? "Loading..."
              : `${filteredItems.length} of ${items.length} items · Stock management`}
          </div>
        </div>
        <div className="ad-header-actions">
          <button type="button" className="ad-btn-outline" onClick={handleExport} disabled={loading}>
            {IC.Download} Export
          </button>
          <button type="button" className="ad-btn-primary" onClick={openAdd}>
            {IC.Plus} Add Item
          </button>
        </div>
      </div>

      {loading && <div className="ad-page-sub">Loading inventory...</div>}
      {!loading && error && <div className="ad-page-sub">{error}</div>}

      {!loading && !error && (
        <>
          {/* KPIs */}
          <div className="ad-kpi-grid ad-kpi-grid-4">
            <div className="ad-kpi">
              <div className="ad-kpi-top">
                <div className="ad-kpi-icon">{IC.Calculator}</div>
              </div>
              <div className="ad-kpi-val">{kpiStats.total.toLocaleString("en-IN")}</div>
              <div className="ad-kpi-label">Total items</div>
            </div>

            <div className="ad-kpi">
              <div className="ad-kpi-top">
                <div className="ad-kpi-icon">{IC.Check}</div>
              </div>
              <div className="ad-kpi-val">{kpiStats.inStock}</div>
              <div className="ad-kpi-label">In stock</div>
            </div>

            <div className="ad-kpi">
              <div className="ad-kpi-top">
                <div className="ad-kpi-icon">{IC.AlertCircle}</div>
                {kpiStats.lowStock > 0 && <span className="pill pill-amber">Low</span>}
              </div>
              <div className="ad-kpi-val">{kpiStats.lowStock}</div>
              <div className="ad-kpi-label">Low stock alerts</div>
            </div>

            <div className="ad-kpi">
              <div className="ad-kpi-top">
                <div className="ad-kpi-icon">{IC.Rupee}</div>
              </div>
              <div className="ad-kpi-val">{formatCompact(kpiStats.totalValue)}</div>
              <div className="ad-kpi-label">Total asset value</div>
            </div>
          </div>

          {/* Add / Edit Form */}
          {showForm && (
            <div className="ad-card">
              <div className="ad-card-header">
                <span className="ad-card-title">
                  {editingItem ? "Edit Inventory Item" : "Add Inventory Item"}
                </span>
                <span className="ad-card-link" onClick={closeForm}>Cancel</span>
              </div>

              <div className="ad-table-filters">
                <input
                  className="ad-input"
                  placeholder="Item Name *"
                  value={form.itemName}
                  onChange={(e) => setField("itemName", e.target.value)}
                />
                <input
                  className="ad-input"
                  placeholder="Category"
                  value={form.category}
                  onChange={(e) => setField("category", e.target.value)}
                />
                <input
                  className="ad-input"
                  type="number"
                  placeholder="Quantity *"
                  value={form.quantity}
                  onChange={(e) => setField("quantity", e.target.value)}
                />
                <input
                  className="ad-input"
                  placeholder="Unit (nos, kg, boxes…)"
                  value={form.unit}
                  onChange={(e) => setField("unit", e.target.value)}
                />
                <input
                  className="ad-input"
                  type="number"
                  placeholder="Value (₹)"
                  value={form.value}
                  onChange={(e) => setField("value", e.target.value)}
                />
                <input
                  className="ad-input"
                  placeholder="Vendor"
                  value={form.vendor}
                  onChange={(e) => setField("vendor", e.target.value)}
                />
                <select
                  className="ad-select"
                  value={form.status}
                  onChange={(e) => setField("status", e.target.value)}
                >
                  <option>In Stock</option>
                  <option>Low Stock</option>
                  <option>Out of Stock</option>
                </select>
                <input
                  className="ad-input"
                  type="number"
                  placeholder="Reorder Level"
                  value={form.reorderLevel}
                  onChange={(e) => setField("reorderLevel", e.target.value)}
                />
              </div>

              <div className="quick-actions">
                <button
                  type="button"
                  className="ad-btn-primary"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {IC.Check} {saving ? "Saving…" : editingItem ? "Update Item" : "Save Item"}
                </button>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="ad-table-wrap">
            <div className="ad-table-header">
              <span className="ad-card-title">Stock Inventory</span>
              <div className="ad-table-filters">
                <div className="ad-search-input">
                  {IC.Search}
                  <input
                    placeholder="Search item…"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="ad-select"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="All">All categories</option>
                  {categoryOptions.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <select
                  className="ad-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All status</option>
                  <option>In Stock</option>
                  <option>Low Stock</option>
                  <option>Out of Stock</option>
                </select>
              </div>
            </div>

            <table className="ad-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Category</th>
                  <th>Qty</th>
                  <th>Unit</th>
                  <th>Value</th>
                  <th>Vendor</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan="8">No inventory items found.</td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item._id}>
                      <td style={{ fontWeight: 600 }}>{item.itemName}</td>
                      <td>
                        <span className="pill pill-gray" style={{ fontSize: 9 }}>
                          {item.category || "—"}
                        </span>
                      </td>
                      <td style={{
                        fontWeight: 600,
                        color: item.status === "Out of Stock"
                          ? "#991b1b"
                          : item.status === "Low Stock"
                            ? "#dc2626"
                            : "#1a3a6e",
                      }}>
                        {item.quantity ?? 0}
                      </td>
                      <td style={{ color: "#6b7a99", fontSize: 11 }}>{item.unit || "—"}</td>
                      <td style={{ fontWeight: 700, color: "#1a3a6e" }}>
                        ₹{formatCurrency(item.value)}
                      </td>
                      <td style={{ color: "#6b7a99", fontSize: 11 }}>{item.vendor || "—"}</td>
                      <td>
                        <span className={`pill ${statusPillClass(item.status)}`} style={{ fontSize: 10 }}>
                          {item.status || "—"}
                        </span>
                      </td>
                      <td>
                        <div className="quick-actions">
                          <button
                            type="button"
                            className="ad-btn-outline ad-action-btn"
                            onClick={() => openEdit(item)}
                          >
                            {IC.Edit}
                          </button>
                          <button
                            type="button"
                            className="ad-btn-danger ad-action-btn"
                            onClick={() => handleDelete(item)}
                          >
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

export default InventoryPage;