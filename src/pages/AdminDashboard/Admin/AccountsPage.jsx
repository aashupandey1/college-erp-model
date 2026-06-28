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

const formatDate = (d) => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });
  } catch {
    return String(d);
  }
};

const typePillClass = (type) => (type === "Credit" ? "pill-green" : "pill-red");

const emptyForm = () => ({
  description: "",
  category:    "",
  type:        "Credit",
  amount:      "",
  date:        new Date().toISOString().slice(0, 10),
  reference:   "",
  notes:       "",
});

/* ════════════════════════════════════════
   PAGE 18 — ACCOUNTS & BUDGET
════════════════════════════════════════ */
function AccountsPage() {
  const [transactions,   setTransactions]   = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState("");
  const [saving,         setSaving]         = useState(false);
  const [searchTerm,     setSearchTerm]     = useState("");
  const [typeFilter,     setTypeFilter]     = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showForm,       setShowForm]       = useState(false);
  const [editingTx,      setEditingTx]      = useState(null);
  const [form,           setForm]           = useState(emptyForm());

  /* ── Load ── */
  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/accounts");
      setTransactions(Array.isArray(res?.data) ? res.data : []);
    } catch (e) {
      setError(e?.message || "Failed to load transactions");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  /* ── Derived ── */
  const categoryOptions = useMemo(
    () => [...new Set(transactions.map((t) => t.category).filter(Boolean))].sort(),
    [transactions]
  );

  const kpiStats = useMemo(() => {
    const totalCredit = transactions
      .filter((t) => t.type === "Credit")
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    const totalDebit = transactions
      .filter((t) => t.type === "Debit")
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    const balance = totalCredit - totalDebit;
    const count   = transactions.length;
    return { totalCredit, totalDebit, balance, count };
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return transactions.filter((t) => {
      const matchesSearch =
        String(t.description || "").toLowerCase().includes(q) ||
        String(t.category    || "").toLowerCase().includes(q) ||
        String(t.reference   || "").toLowerCase().includes(q);
      const matchesType     = typeFilter     === "All" || t.type     === typeFilter;
      const matchesCategory = categoryFilter === "All" || t.category === categoryFilter;
      return matchesSearch && matchesType && matchesCategory;
    });
  }, [transactions, searchTerm, typeFilter, categoryFilter]);

  /* ── Form helpers ── */
  const setField = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const openAdd = () => {
    setEditingTx(null);
    setForm(emptyForm());
    setShowForm(true);
  };

  const openEdit = (tx) => {
    setEditingTx(tx);
    setForm({
      description: tx.description || "",
      category:    tx.category    || "",
      type:        tx.type        || "Credit",
      amount:      tx.amount      ?? "",
      date:        tx.date
        ? new Date(tx.date).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10),
      reference:   tx.reference   || "",
      notes:       tx.notes       || "",
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingTx(null);
    setForm(emptyForm());
  };

  /* ── Validation ── */
  const validateForm = () => {
    if (!form.description.trim())                          return "Description is required.";
    if (!form.type)                                        return "Type (Credit / Debit) is required.";
    if (form.amount === "" || isNaN(Number(form.amount)))  return "Valid amount is required.";
    if (Number(form.amount) <= 0)                          return "Amount must be greater than 0.";
    return null;
  };

  /* ── CRUD ── */
  const handleSave = async () => {
    const err = validateForm();
    if (err) { window.alert(err); return; }

    setSaving(true);
    try {
      const payload = { ...form, amount: Number(form.amount) };

      if (editingTx) {
        await apiFetch(`/accounts/${editingTx._id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        window.alert("Transaction updated successfully.");
      } else {
        await apiFetch("/accounts", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        window.alert("Transaction added successfully.");
      }
      closeForm();
      await loadData();
    } catch (e) {
      window.alert(e?.message || "Failed to save transaction.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (tx) => {
    if (!window.confirm(`Delete transaction "${tx.description}"?`)) return;
    try {
      await apiFetch(`/accounts/${tx._id}`, { method: "DELETE" });
      setTransactions((prev) => prev.filter((t) => t._id !== tx._id));
    } catch (e) {
      window.alert(e?.message || "Failed to delete transaction.");
    }
  };

  /* ── Export ── */
  const handleExport = () => {
    const headers = ["Description","Category","Type","Amount (₹)","Date","Reference","Notes"];
    const rows = filteredTransactions.map((t) => [
      t.description || "",
      t.category    || "",
      t.type        || "",
      t.amount      ?? 0,
      t.date ? new Date(t.date).toLocaleDateString("en-IN") : "",
      t.reference   || "",
      t.notes       || "",
    ]);
    const csv  = [headers.join(","), ...rows.map((r) => r.map((v) => `"${v}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href     = url;
    link.download = "accounts.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  /* ════ RENDER ════ */
  return (
    <>
      {/* Header */}
      <div className="ad-page-header">
        <div>
          <div className="ad-page-title">Accounts & Budget</div>
          <div className="ad-page-sub">
            {loading
              ? "Loading…"
              : `${filteredTransactions.length} of ${transactions.length} transactions`}
          </div>
        </div>
        <div className="ad-header-actions">
          <button type="button" className="ad-btn-outline" onClick={handleExport} disabled={loading}>
            {IC.Download} Export
          </button>
          <button type="button" className="ad-btn-primary" onClick={openAdd}>
            {IC.Plus} Add Entry
          </button>
        </div>
      </div>

      {loading && <div className="ad-page-sub">Loading accounts…</div>}
      {!loading && error && <div className="ad-page-sub">{error}</div>}

      {!loading && !error && (
        <>
          {/* KPIs */}
          <div className="ad-kpi-grid ad-kpi-grid-4">
            <div className="ad-kpi">
              <div className="ad-kpi-top">
                <div className="ad-kpi-icon" style={{ background: "#EAF3DE", color: "#3B6D11" }}>
                  {IC.Ledger}
                </div>
              </div>
              <div className="ad-kpi-val">{formatCompact(kpiStats.totalCredit)}</div>
              <div className="ad-kpi-label">Total credit</div>
            </div>

            <div className="ad-kpi">
              <div className="ad-kpi-top">
                <div className="ad-kpi-icon" style={{ background: "#FCEBEB", color: "#A32D2D" }}>
                  {IC.Ledger}
                </div>
              </div>
              <div className="ad-kpi-val">{formatCompact(kpiStats.totalDebit)}</div>
              <div className="ad-kpi-label">Total debit</div>
            </div>

            <div className="ad-kpi">
              <div className="ad-kpi-top">
                <div
                  className="ad-kpi-icon"
                  style={{
                    background: kpiStats.balance >= 0 ? "#EAF3DE" : "#FCEBEB",
                    color:      kpiStats.balance >= 0 ? "#3B6D11" : "#A32D2D",
                  }}
                >
                  {IC.Rupee}
                </div>
              </div>
              <div className="ad-kpi-val">{formatCompact(Math.abs(kpiStats.balance))}</div>
              <div className="ad-kpi-label">
                {kpiStats.balance >= 0 ? "Net surplus" : "Net deficit"}
              </div>
            </div>

            <div className="ad-kpi">
              <div className="ad-kpi-top">
                <div className="ad-kpi-icon">{IC.History}</div>
              </div>
              <div className="ad-kpi-val">{kpiStats.count}</div>
              <div className="ad-kpi-label">Total entries</div>
            </div>
          </div>

          {/* Add / Edit Form */}
          {showForm && (
            <div className="ad-card">
              <div className="ad-card-header">
                <span className="ad-card-title">
                  {editingTx ? "Edit Transaction" : "Add Transaction"}
                </span>
                <span className="ad-card-link" onClick={closeForm}>Cancel</span>
              </div>

              <div className="ad-table-filters">
                <input
                  className="ad-input"
                  placeholder="Description *"
                  value={form.description}
                  onChange={(e) => setField("description", e.target.value)}
                />
                <input
                  className="ad-input"
                  placeholder="Category"
                  value={form.category}
                  onChange={(e) => setField("category", e.target.value)}
                />
                <select
                  className="ad-select"
                  value={form.type}
                  onChange={(e) => setField("type", e.target.value)}
                >
                  <option value="Credit">Credit</option>
                  <option value="Debit">Debit</option>
                </select>
                <input
                  className="ad-input"
                  type="number"
                  placeholder="Amount (₹) *"
                  value={form.amount}
                  onChange={(e) => setField("amount", e.target.value)}
                />
                <input
                  className="ad-input"
                  type="date"
                  value={form.date}
                  onChange={(e) => setField("date", e.target.value)}
                />
                <input
                  className="ad-input"
                  placeholder="Reference (optional)"
                  value={form.reference}
                  onChange={(e) => setField("reference", e.target.value)}
                />
                <input
                  className="ad-input"
                  placeholder="Notes (optional)"
                  value={form.notes}
                  onChange={(e) => setField("notes", e.target.value)}
                />
              </div>

              <div className="quick-actions">
                <button
                  type="button"
                  className="ad-btn-primary"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {IC.Check} {saving ? "Saving…" : editingTx ? "Update Entry" : "Save Entry"}
                </button>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="ad-table-wrap">
            <div className="ad-table-header">
              <span className="ad-card-title">Transaction Ledger</span>
              <div className="ad-table-filters">
                <div className="ad-search-input">
                  {IC.Search}
                  <input
                    placeholder="Search transaction…"
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
                  <option value="Credit">Credit</option>
                  <option value="Debit">Debit</option>
                </select>
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
              </div>
            </div>

            <table className="ad-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Reference</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="7">No transactions found.</td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx) => (
                    <tr key={tx._id}>
                      <td style={{ fontWeight: 600 }}>{tx.description}</td>
                      <td>
                        <span className="pill pill-gray" style={{ fontSize: 9 }}>
                          {tx.category || "—"}
                        </span>
                      </td>
                      <td>
                        <span className={`pill ${typePillClass(tx.type)}`} style={{ fontSize: 10 }}>
                          {tx.type}
                        </span>
                      </td>
                      <td style={{
                        fontWeight: 700,
                        color: tx.type === "Credit" ? "#059669" : "#dc2626",
                      }}>
                        ₹{formatCurrency(tx.amount)}
                      </td>
                      <td style={{ color: "#6b7a99", fontSize: 11 }}>
                        {formatDate(tx.date)}
                      </td>
                      <td style={{ color: "#6b7a99", fontSize: 11, fontFamily: "monospace" }}>
                        {tx.reference || "—"}
                      </td>
                      <td>
                        <div className="quick-actions">
                          <button
                            type="button"
                            className="ad-btn-outline ad-action-btn"
                            onClick={() => openEdit(tx)}
                          >
                            {IC.Edit}
                          </button>
                          <button
                            type="button"
                            className="ad-btn-danger ad-action-btn"
                            onClick={() => handleDelete(tx)}
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

export default AccountsPage;