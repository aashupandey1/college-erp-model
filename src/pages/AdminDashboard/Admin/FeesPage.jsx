import { useCallback, useEffect, useMemo, useState } from "react";
import { IC } from "../constants/iconMap";

import { apiFetch } from "../../../services/api";
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
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${formatCurrency(num)}`;
};

const toDateInputValue = (date) => {
  const d = date ? new Date(date) : new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const getStudentId = (record) => String(record?.student?._id || record?.student || "");

const isCollected = (status) => status === "Paid" || status === "Partially Paid";

const isOnlineMode = (mode) => /online|upi|razorpay|net banking|card/i.test(mode || "");

const emptyForm = () => ({
  student: "",
  feeType: "Tuition",
  amount: "",
  dueDate: toDateInputValue(new Date()),
  status: "Paid",
  paymentMode: "Online",
  receiptNumber: "",
  remarks: "",
});

/* ════════════════════════════════════════
   PAGE 6 — FEES
════════════════════════════════════════ */
function FeesPage() {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [feesRes, studentsRes, settingsRes] = await Promise.all([
        apiFetch("/fees"),
        apiFetch("/students"),
        apiFetch("/settings"),
      ]);

      setFees(feesRes?.data || []);
      setStudents(studentsRes?.data || []);
      setSettings(settingsRes?.data || null);
    } catch (e) {
      setError(e?.message || "Failed to load fee data");
      setFees([]);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const studentBranchMap = useMemo(() => {
    const map = new Map();
    (Array.isArray(students) ? students : []).forEach((s) => {
      if (s?._id) map.set(String(s._id), s.branch || "—");
    });
    return map;
  }, [students]);

  const enrichedFees = useMemo(() => {
    return (Array.isArray(fees) ? fees : [])
      .map((f) => ({
        ...f,
        branch: studentBranchMap.get(getStudentId(f)) || "—",
        displayDate: f.createdAt || f.dueDate,
      }))
      .sort((a, b) => new Date(b.displayDate) - new Date(a.displayDate));
  }, [fees, studentBranchMap]);

  const kpiStats = useMemo(() => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    const thisMonth = enrichedFees.filter((f) => {
      const d = f.dueDate ? new Date(f.dueDate) : null;
      return d && d.getMonth() === month && d.getFullYear() === year;
    });

    const collectedThisMonth = thisMonth.reduce((sum, f) => {
      if (isCollected(f.status)) return sum + (f.amount || 0);
      return sum;
    }, 0);

    const pendingAmount = enrichedFees
      .filter((f) => f.status === "Pending" || f.status === "Overdue")
      .reduce((sum, f) => sum + (f.amount || 0), 0);

    const paidFees = enrichedFees.filter((f) => f.status === "Paid" || f.status === "Partially Paid");
    const onlineCount = paidFees.filter((f) => isOnlineMode(f.paymentMode)).length;
    const onlinePct = paidFees.length ? Math.round((onlineCount / paidFees.length) * 100) : 0;

    const defaulterIds = new Set(
      enrichedFees
        .filter((f) => f.status === "Overdue" || f.status === "Pending")
        .map((f) => getStudentId(f))
        .filter(Boolean)
    );

    const paidThisMonth = thisMonth.filter((f) => isCollected(f.status)).length;
    const pendingRecords = enrichedFees.filter(
      (f) => f.status === "Pending" || f.status === "Overdue"
    ).length;

    return {
      collectedThisMonth,
      pendingAmount,
      onlinePct,
      defaulters: defaulterIds.size,
      paidThisMonth,
      pendingRecords,
      onlineCount,
    };
  }, [enrichedFees]);

  const filteredFees = enrichedFees.filter((f) => {
    const matchesSearch =
      (f.studentName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.rollNumber || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "All" || f.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const pageSubtitle = useMemo(() => {
    const month = new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" });
    const ay = settings?.academicYear ? `Academic Year ${settings.academicYear}` : "";
    return [month, ay].filter(Boolean).join(" · ");
  }, [settings]);

  const handleCollectFee = async () => {
    if (!form.student || !form.amount) {
      window.alert("Please select a student and enter amount.");
      return;
    }

    setSaving(true);
    try {
      await apiFetch("/fees", {
        method: "POST",
        body: JSON.stringify({
          student: form.student,
          feeType: form.feeType,
          amount: Number(form.amount),
          dueDate: new Date(form.dueDate).toISOString(),
          status: form.status,
          paymentMode: form.paymentMode,
          receiptNumber: form.receiptNumber,
          remarks: form.remarks,
        }),
      });

      setForm(emptyForm());
      setShowForm(false);
      await loadData();
      window.alert("Fee collected successfully");
    } catch (e) {
      window.alert(e?.message || "Failed to collect fee");
    } finally {
      setSaving(false);
    }
  };

  const handleStatusUpdate = async (feeId, status) => {
    try {
      await apiFetch(`/fees/${feeId}`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      await loadData();
    } catch (e) {
      window.alert(e?.message || "Failed to update fee status");
    }
  };

  const handleDelete = async (fee) => {
    const ok = window.confirm(`Delete fee record for ${fee.studentName}?`);
    if (!ok) return;

    try {
      await apiFetch(`/fees/${fee._id}`, { method: "DELETE" });
      await loadData();
      window.alert("Fee record deleted successfully");
    } catch (e) {
      window.alert(e?.message || "Failed to delete fee record");
    }
  };

  const handleExport = () => {
    const headers = [
      "Student",
      "Roll Number",
      "Branch",
      "Fee Type",
      "Amount",
      "Payment Mode",
      "Due Date",
      "Receipt",
      "Status",
    ];

    const rows = filteredFees.map((f) => [
      f.studentName || "",
      f.rollNumber || "",
      f.branch || "",
      f.feeType || "",
      f.amount || 0,
      f.paymentMode || "",
      f.dueDate ? new Date(f.dueDate).toLocaleDateString("en-IN") : "",
      f.receiptNumber || "",
      f.status || "",
    ]);

    const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "fee-transactions.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="ad-page-header">
        <div>
          <div className="ad-page-title">Fee Management</div>
          <div className="ad-page-sub">{loading ? "Loading..." : pageSubtitle}</div>
        </div>
        <div className="ad-header-actions">
          <button type="button" className="ad-btn-outline" onClick={handleExport} disabled={loading}>
            {IC.Download} Export Excel
          </button>
          <button
            type="button"
            className="ad-btn-primary"
            onClick={() => setShowForm((prev) => !prev)}
          >
            {IC.Plus} Collect Fee
          </button>
        </div>
      </div>

      {loading && <div className="ad-page-sub">Loading fees...</div>}
      {!loading && error && <div className="ad-page-sub">{error}</div>}

      {!loading && !error && (
        <>
          <div className="ad-kpi-grid ad-kpi-grid-4">
            <div className="ad-kpi">
              <div className="ad-kpi-top">
                <div className="ad-kpi-icon">{IC.Fees}</div>
              </div>
              <div className="ad-kpi-val">{formatCompact(kpiStats.collectedThisMonth)}</div>
              <div className="ad-kpi-label">Collected this month</div>
              <div className="ad-kpi-trend trend-up">
                {kpiStats.paidThisMonth} payment{kpiStats.paidThisMonth === 1 ? "" : "s"}
              </div>
            </div>

            <div className="ad-kpi">
              <div className="ad-kpi-top">
                <div className="ad-kpi-icon">{IC.Rupee}</div>
                {kpiStats.pendingAmount > 0 && <span className="pill pill-red">Due</span>}
              </div>
              <div className="ad-kpi-val">{formatCompact(kpiStats.pendingAmount)}</div>
              <div className="ad-kpi-label">Pending amount</div>
              <div className="ad-kpi-trend trend-down">
                {kpiStats.pendingRecords} record{kpiStats.pendingRecords === 1 ? "" : "s"}
              </div>
            </div>

            <div className="ad-kpi">
              <div className="ad-kpi-top">
                <div className="ad-kpi-icon">{IC.Calculator}</div>
              </div>
              <div className="ad-kpi-val">{kpiStats.onlinePct}%</div>
              <div className="ad-kpi-label">Online payments</div>
              <div className="ad-kpi-trend trend-neu">
                {kpiStats.onlineCount} online transaction{kpiStats.onlineCount === 1 ? "" : "s"}
              </div>
            </div>

            <div className="ad-kpi">
              <div className="ad-kpi-top">
                <div className="ad-kpi-icon">{IC.AlertCircle}</div>
                {kpiStats.defaulters > 0 && <span className="pill pill-red">Alert</span>}
              </div>
              <div className="ad-kpi-val">{kpiStats.defaulters}</div>
              <div className="ad-kpi-label">Defaulters</div>
              <div className="ad-kpi-trend trend-down">Students with pending/overdue fees</div>
            </div>
          </div>

          {showForm && (
            <div className="ad-card">
              <div className="ad-card-header">
                <span className="ad-card-title">Collect fee</span>
                <span className="ad-card-link" onClick={() => setShowForm(false)}>
                  Cancel
                </span>
              </div>

              <div className="ad-table-filters">
                <select
                  className="ad-select"
                  value={form.student}
                  onChange={(e) => setForm((prev) => ({ ...prev, student: e.target.value }))}
                >
                  <option value="">Select student</option>
                  {(Array.isArray(students) ? students : []).map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.fullName || `${s.firstName} ${s.lastName}`} ({s.rollNumber})
                    </option>
                  ))}
                </select>

                <select
                  className="ad-select"
                  value={form.feeType}
                  onChange={(e) => setForm((prev) => ({ ...prev, feeType: e.target.value }))}
                >
                  <option value="Tuition">Tuition</option>
                  <option value="Hostel">Hostel</option>
                  <option value="Transport">Transport</option>
                  <option value="Exam">Exam</option>
                  <option value="Library">Library</option>
                  <option value="Other">Other</option>
                </select>

                <input
                  className="ad-input"
                  placeholder="Amount"
                  value={form.amount}
                  onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
                />

                <input
                  type="date"
                  className="ad-input"
                  value={form.dueDate}
                  onChange={(e) => setForm((prev) => ({ ...prev, dueDate: e.target.value }))}
                />

                <select
                  className="ad-select"
                  value={form.status}
                  onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
                >
                  <option value="Paid">Paid</option>
                  <option value="Partially Paid">Partially Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Overdue">Overdue</option>
                </select>

                <select
                  className="ad-select"
                  value={form.paymentMode}
                  onChange={(e) => setForm((prev) => ({ ...prev, paymentMode: e.target.value }))}
                >
                  <option value="Online">Online</option>
                  <option value="UPI">UPI</option>
                  <option value="Cash">Cash</option>
                  <option value="DD">DD</option>
                  <option value="Cheque">Cheque</option>
                </select>

                <input
                  className="ad-input"
                  placeholder="Receipt number"
                  value={form.receiptNumber}
                  onChange={(e) => setForm((prev) => ({ ...prev, receiptNumber: e.target.value }))}
                />

                <input
                  className="ad-input"
                  placeholder="Remarks"
                  value={form.remarks}
                  onChange={(e) => setForm((prev) => ({ ...prev, remarks: e.target.value }))}
                />
              </div>

              <div className="quick-actions">
                <button
                  type="button"
                  className="ad-btn-primary"
                  onClick={handleCollectFee}
                  disabled={saving}
                >
                  {IC.Check} Save payment
                </button>
              </div>
            </div>
          )}

          <div className="ad-table-wrap">
            <div className="ad-table-header">
              <span className="ad-card-title">Recent transactions</span>
              <div className="ad-table-filters">
                <div className="ad-search-input">
                  {IC.Search}
                  <input
                    placeholder="Search student..."
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
                  <option value="Paid">Paid</option>
                  <option value="Partially Paid">Partially Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
            </div>

            <table className="ad-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Branch</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Date</th>
                  <th>Receipt</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFees.length === 0 ? (
                  <tr>
                    <td colSpan="8">No fee records found.</td>
                  </tr>
                ) : (
                  filteredFees.map((f) => (
                    <tr key={f._id}>
                      <td>{f.studentName || "—"}</td>
                      <td>
                        <span className="pill pill-blue">{f.branch}</span>
                      </td>
                      <td>₹{formatCurrency(f.amount)}</td>
                      <td>{f.paymentMode || "—"}</td>
                      <td>
                        {f.displayDate
                          ? new Date(f.displayDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                          })
                          : "—"}
                      </td>
                      <td>{f.receiptNumber || "—"}</td>
                      <td>
                        <select
                          className="ad-select"
                          value={f.status}
                          onChange={(e) => handleStatusUpdate(f._id, e.target.value)}
                        >
                          <option value="Paid">Paid</option>
                          <option value="Partially Paid">Partially Paid</option>
                          <option value="Pending">Pending</option>
                          <option value="Overdue">Overdue</option>
                        </select>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="ad-btn-danger"
                          onClick={() => handleDelete(f)}
                        >
                          {IC.Trash}
                        </button>
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

export default FeesPage;
