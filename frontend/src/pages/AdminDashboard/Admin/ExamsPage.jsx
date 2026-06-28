import { useCallback, useEffect, useMemo, useState } from "react";
import { IC } from "../constants/iconMap";
import { apiFetch } from "../../../services/api";

const formatExamDate = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const toDateInputValue = (date) => {
  const d = date ? new Date(date) : new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const emptyForm = () => ({
  title: "",
  examType: "Internal",
  semester: "",
  branch: "",
  subject: "",
  date: toDateInputValue(new Date()),
  time: "",
  room: "",
  maxMarks: "100",
  status: "Scheduled",
});

/* ════════════════════════════════════════
   PAGE 5 — EXAMS
════════════════════════════════════════ */
function ExamsPage() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [searchTerm, setSearchTerm] = useState("");
  const [branchFilter, setBranchFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const loadExams = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await apiFetch("/exams");
      setExams(res?.data || []);
    } catch (e) {
      setError(e?.message || "Failed to load exams");
      setExams([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadExams();
  }, [loadExams]);

  const kpiStats = useMemo(() => {
    const list = Array.isArray(exams) ? exams : [];
    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const sevenDaysLater = new Date(now);
    sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);
    sevenDaysLater.setHours(23, 59, 59, 999);

    const total = list.filter((e) => e.status !== "Cancelled").length;
    const upcoming = list.filter((e) => {
      const d = e?.date ? new Date(e.date) : null;
      return (
        d &&
        d >= startOfToday &&
        d <= sevenDaysLater &&
        (e.status === "Scheduled" || e.status === "Ongoing")
      );
    }).length;
    const completed = list.filter((e) => e.status === "Completed").length;
    const ongoing = list.filter((e) => e.status === "Ongoing").length;

    return { total, upcoming, completed, ongoing };
  }, [exams]);

  const branchOptions = useMemo(
    () => [...new Set((Array.isArray(exams) ? exams : []).map((e) => e.branch).filter(Boolean))].sort(),
    [exams]
  );

  const filteredExams = useMemo(() => {
    return (Array.isArray(exams) ? exams : [])
      .filter((e) => {
        const label = `${e.title || ""} ${e.subject || ""} ${e.branch || ""}`.toLowerCase();
        const matchesSearch = label.includes(searchTerm.toLowerCase());
        const matchesBranch = branchFilter === "All" || e.branch === branchFilter;
        const matchesStatus = statusFilter === "All" || e.status === statusFilter;
        return matchesSearch && matchesBranch && matchesStatus;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [exams, searchTerm, branchFilter, statusFilter]);

  const pageSubtitle = useMemo(() => {
    const upcoming = filteredExams.filter((e) => {
      const d = e?.date ? new Date(e.date) : null;
      return d && d >= new Date() && e.status !== "Cancelled";
    });
    if (!upcoming.length) return "No upcoming exams scheduled";
    const first = upcoming[0];
    const month = first?.date
      ? new Date(first.date).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
      : "";
    return `${upcoming.length} upcoming exam${upcoming.length === 1 ? "" : "s"} · ${month}`;
  }, [filteredExams]);

  const resetForm = () => {
    setForm(emptyForm());
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (exam) => {
    setEditingId(exam._id);
    setForm({
      title: exam.title || "",
      examType: exam.examType || "Internal",
      semester: exam.semester || "",
      branch: exam.branch || "",
      subject: exam.subject || "",
      date: toDateInputValue(exam.date),
      time: exam.time || "",
      room: exam.room || "",
      maxMarks: String(exam.maxMarks ?? 100),
      status: exam.status || "Scheduled",
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      window.alert("Exam title is required.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        examType: form.examType,
        semester: form.semester,
        branch: form.branch,
        subject: form.subject,
        date: new Date(form.date).toISOString(),
        time: form.time,
        room: form.room,
        maxMarks: Number(form.maxMarks) || 100,
        status: form.status,
      };

      if (editingId) {
        await apiFetch(`/exams/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch("/exams", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      resetForm();
      await loadExams();
      window.alert(
        editingId
          ? "Exam updated successfully"
          : "Exam scheduled successfully"
      );
    } catch (e) {
      window.alert(e?.message || "Failed to save exam");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (exam) => {
    const ok = window.confirm(`Delete exam "${exam.title || exam.subject}"?`);
    if (!ok) return;

    try {
      await apiFetch(`/exams/${exam._id}`, { method: "DELETE" });
      if (editingId === exam._id) resetForm();
      await loadExams();
      window.alert("Exam deleted successfully");
    } catch (e) {
      window.alert(e?.message || "Failed to delete exam");
    }
  };

  const handleStatusUpdate = async (examId, status) => {
    try {
      await apiFetch(`/exams/${examId}`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      await loadExams();
    } catch (e) {
      window.alert(e?.message || "Failed to update exam status");
    }
  };

  const handleHallTicketExport = () => {
    const scheduled = filteredExams.filter(
      (e) => e.status === "Scheduled" || e.status === "Ongoing"
    );

    const headers = ["Title", "Subject", "Branch", "Semester", "Date", "Time", "Room", "Status"];
    const rows = scheduled.map((e) => [
      e.title || "",
      e.subject || "",
      e.branch || "",
      e.semester || "",
      formatExamDate(e.date),
      e.time || "",
      e.room || "",
      e.status || "",
    ]);

    const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "hall-tickets-schedule.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="ad-page-header">
        <div>
          <div className="ad-page-title">Exam Management</div>
          <div className="ad-page-sub">{loading ? "Loading..." : pageSubtitle}</div>
        </div>
        <div className="ad-header-actions">
          <button
            type="button"
            className="ad-btn-outline"
            onClick={handleHallTicketExport}
            disabled={loading}
          >
            {IC.Download} Hall Tickets
          </button>
          <button
            type="button"
            className="ad-btn-primary"
            onClick={() => {
              if (showForm && !editingId) {
                resetForm();
              } else {
                setEditingId(null);
                setForm(emptyForm());
                setShowForm(true);
              }
            }}
          >
            {IC.Plus} Schedule Exam
          </button>
        </div>
      </div>

      {loading && <div className="ad-page-sub">Loading exams...</div>}
      {!loading && error && <div className="ad-page-sub">{error}</div>}

      {!loading && !error && (
        <>
          <div className="ad-kpi-grid ad-kpi-grid-4">
            <div className="ad-kpi">
              <div className="ad-kpi-top">
                <div className="ad-kpi-icon">{IC.Exams}</div>
              </div>
              <div className="ad-kpi-val">{kpiStats.total}</div>
              <div className="ad-kpi-label">Total exams scheduled</div>
            </div>

            <div className="ad-kpi">
              <div className="ad-kpi-top">
                <div className="ad-kpi-icon">{IC.CalendarCheck}</div>
                {kpiStats.upcoming > 0 && <span className="pill pill-amber">Soon</span>}
              </div>
              <div className="ad-kpi-val">{kpiStats.upcoming}</div>
              <div className="ad-kpi-label">Upcoming (7 days)</div>
            </div>

            <div className="ad-kpi">
              <div className="ad-kpi-top">
                <div className="ad-kpi-icon">{IC.History}</div>
              </div>
              <div className="ad-kpi-val">{kpiStats.completed}</div>
              <div className="ad-kpi-label">Completed</div>
            </div>

            <div className="ad-kpi">
              <div className="ad-kpi-top">
                <div className="ad-kpi-icon">{IC.Attendance}</div>
              </div>
              <div className="ad-kpi-val">{kpiStats.ongoing}</div>
              <div className="ad-kpi-label">Ongoing</div>
            </div>
          </div>

          {showForm && (
            <div className="ad-card">
              <div className="ad-card-header">
                <span className="ad-card-title">
                  {editingId ? "Edit exam" : "Schedule new exam"}
                </span>
                <span className="ad-card-link" onClick={resetForm}>
                  Cancel
                </span>
              </div>

              <div className="ad-table-filters">
                <input
                  className="ad-input"
                  placeholder="Exam title *"
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                />
                <input
                  className="ad-input"
                  placeholder="Subject"
                  value={form.subject}
                  onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))}
                />
                <input
                  className="ad-input"
                  placeholder="Branch"
                  value={form.branch}
                  onChange={(e) => setForm((prev) => ({ ...prev, branch: e.target.value }))}
                />
                <input
                  className="ad-input"
                  placeholder="Semester"
                  value={form.semester}
                  onChange={(e) => setForm((prev) => ({ ...prev, semester: e.target.value }))}
                />
                <select
                  className="ad-select"
                  value={form.examType}
                  onChange={(e) => setForm((prev) => ({ ...prev, examType: e.target.value }))}
                >
                  <option value="Internal">Internal</option>
                  <option value="External">External</option>
                  <option value="Mid-Term">Mid-Term</option>
                  <option value="End-Sem">End-Sem</option>
                </select>
                <input
                  type="date"
                  className="ad-input"
                  value={form.date}
                  onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
                />
                <input
                  className="ad-input"
                  placeholder="Time"
                  value={form.time}
                  onChange={(e) => setForm((prev) => ({ ...prev, time: e.target.value }))}
                />
                <input
                  className="ad-input"
                  placeholder="Room"
                  value={form.room}
                  onChange={(e) => setForm((prev) => ({ ...prev, room: e.target.value }))}
                />
                <input
                  className="ad-input"
                  placeholder="Max marks"
                  value={form.maxMarks}
                  onChange={(e) => setForm((prev) => ({ ...prev, maxMarks: e.target.value }))}
                />
                <select
                  className="ad-select"
                  value={form.status}
                  onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="quick-actions">
                <button
                  type="button"
                  className="ad-btn-primary"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {IC.Check} {editingId ? "Update exam" : "Save exam"}
                </button>
              </div>
            </div>
          )}

          <div className="ad-table-wrap">
            <div className="ad-table-header">
              <span className="ad-card-title">Exam schedule</span>
              <div className="ad-table-filters">
                <div className="ad-search-input">
                  {IC.Search}
                  <input
                    placeholder="Search exams..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="ad-select"
                  value={branchFilter}
                  onChange={(e) => setBranchFilter(e.target.value)}
                >
                  <option value="All">All branches</option>
                  {branchOptions.map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
                <select
                  className="ad-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All status</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <table className="ad-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Branch</th>
                  <th>Semester</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Room</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExams.length === 0 ? (
                  <tr>
                    <td colSpan="8">No exams found.</td>
                  </tr>
                ) : (
                  filteredExams.map((e) => (
                    <tr key={e._id}>
                      <td>{e.subject || e.title || "—"}</td>
                      <td>
                        <span className="pill pill-blue">{e.branch || "—"}</span>
                      </td>
                      <td>{e.semester ? `Sem ${e.semester}` : "—"}</td>
                      <td>{formatExamDate(e.date)}</td>
                      <td>{e.time || "—"}</td>
                      <td>
                        <span className="pill pill-gray">{e.room || "—"}</span>
                      </td>
                      <td>
                        <select
                          className="ad-select"
                          value={e.status}
                          onChange={(ev) => handleStatusUpdate(e._id, ev.target.value)}
                        >
                          <option value="Scheduled">Scheduled</option>
                          <option value="Ongoing">Ongoing</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td>
                        <div className="quick-actions">
                          <button
                            type="button"
                            className="ad-btn-outline"
                            onClick={() => handleEdit(e)}
                          >
                            {IC.Edit}
                          </button>
                          <button
                            type="button"
                            className="ad-btn-danger"
                            onClick={() => handleDelete(e)}
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

export default ExamsPage;
