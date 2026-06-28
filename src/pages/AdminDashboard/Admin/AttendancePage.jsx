import { useCallback, useEffect, useMemo, useState } from "react";
import { IC } from "../constants/iconMap";
import { apiFetch } from "../../../services/api";
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const ELIGIBILITY_THRESHOLD = 75;


const getStudentId = (record) => String(record?.student?._id || record?.student || "");

const isPresent = (status) => status === "Present" || status === "Late";

const formatDisplayDate = (date) =>
  date.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

const formatTime = (date) =>
  date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

const toDateInputValue = (date) => {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

/* ════════════════════════════════════════
   PAGE 4 — ATTENDANCE
════════════════════════════════════════ */
function AttendancePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [records, setRecords] = useState([]);
  const [students, setStudents] = useState([]);
  const [settings, setSettings] = useState(null);
  const [selectedDate, setSelectedDate] = useState(toDateInputValue(new Date()));
  const [saving, setSaving] = useState(false);
  const [entryForm, setEntryForm] = useState({
    student: "",
    subject: "",
    period: "",
    status: "Present",
    remarks: "",
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [attendanceRes, studentsRes, settingsRes] = await Promise.all([
        apiFetch("/attendance"),
        apiFetch("/students"),
        apiFetch("/settings"),
      ]);

      setRecords(attendanceRes?.data || []);
      setStudents(studentsRes?.data || []);
      setSettings(settingsRes?.data || null);
    } catch (e) {
      setError(e?.message || "Failed to load attendance data");
      setRecords([]);
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
      if (s?._id) map.set(String(s._id), s.branch || "General");
    });
    return map;
  }, [students]);

  const studentStats = useMemo(() => {
    const map = new Map();

    (Array.isArray(records) ? records : []).forEach((r) => {
      const sid = getStudentId(r);
      if (!sid) return;

      if (!map.has(sid)) {
        map.set(sid, {
          studentName: r.studentName || "Unknown",
          rollNumber: r.rollNumber || "",
          branch: studentBranchMap.get(sid) || "General",
          total: 0,
          present: 0,
        });
      }

      const row = map.get(sid);
      row.total += 1;
      if (isPresent(r.status)) row.present += 1;
    });

    return Array.from(map.entries()).map(([sid, v]) => ({
      sid,
      ...v,
      pct: v.total ? Math.round((v.present / v.total) * 100) : 0,
    }));
  }, [records, studentBranchMap]);

  const selectedDayRecords = useMemo(() => {
    const dayStart = new Date(selectedDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(selectedDate);
    dayEnd.setHours(23, 59, 59, 999);

    return (Array.isArray(records) ? records : []).filter((r) => {
      const d = r?.date ? new Date(r.date) : null;
      return d && d >= dayStart && d <= dayEnd;
    });
  }, [records, selectedDate]);

  const analytics = useMemo(() => {
    const totalToday = selectedDayRecords.length;
    const presentToday = selectedDayRecords.filter((r) => isPresent(r.status)).length;
    const absentToday = selectedDayRecords.filter((r) => r.status === "Absent").length;
    const leaveToday = selectedDayRecords.filter((r) => r.status === "Leave").length;
    const avgToday = totalToday ? Math.round((presentToday / totalToday) * 100) : 0;

    const belowThreshold = studentStats.filter((s) => s.pct < ELIGIBILITY_THRESHOLD).length;

    const lectureMap = new Map();
    selectedDayRecords.forEach((r) => {
      const key = r.period ? `Period ${r.period}` : r.subject || "General";
      if (!lectureMap.has(key)) lectureMap.set(key, { total: 0, present: 0 });
      const agg = lectureMap.get(key);
      agg.total += 1;
      if (isPresent(r.status)) agg.present += 1;
    });

    const lectureWise = Array.from(lectureMap.entries())
      .map(([label, v]) => ({
        label,
        pct: v.total ? Math.round((v.present / v.total) * 100) : 0,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    const branchMap = new Map();
    selectedDayRecords.forEach((r) => {
      const branch = studentBranchMap.get(getStudentId(r)) || "General";
      if (!branchMap.has(branch)) branchMap.set(branch, { total: 0, present: 0 });
      const agg = branchMap.get(branch);
      agg.total += 1;
      if (isPresent(r.status)) agg.present += 1;
    });

    const branchWise = Array.from(branchMap.entries())
      .map(([branch, v]) => ({
        branch,
        pct: v.total ? Math.round((v.present / v.total) * 100) : 0,
      }))
      .sort((a, b) => b.pct - a.pct);

    const lowAttendance = [...studentStats]
      .filter((s) => s.pct < ELIGIBILITY_THRESHOLD)
      .sort((a, b) => a.pct - b.pct)
      .slice(0, 6);

    const now = new Date();
    const monthly = [];
    for (let i = 3; i >= 0; i -= 1) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = d.getMonth();
      const year = d.getFullYear();
      const monthRecords = (Array.isArray(records) ? records : []).filter((r) => {
        const rd = r?.date ? new Date(r.date) : null;
        return rd && rd.getMonth() === month && rd.getFullYear() === year;
      });
      const present = monthRecords.filter((r) => isPresent(r.status)).length;
      const pct = monthRecords.length ? Math.round((present / monthRecords.length) * 100) : 0;
      monthly.push({ label: MONTH_NAMES[month], pct });
    }

    const allStudentIds = new Set(
      (Array.isArray(students) ? students : []).map((s) => String(s._id))
    );
    const trackedIds = new Set(studentStats.map((s) => s.sid));
    const eligible = studentStats.filter((s) => s.pct >= ELIGIBILITY_THRESHOLD).length;
    const notEligible = studentStats.filter((s) => s.pct < ELIGIBILITY_THRESHOLD).length;
    const untracked = [...allStudentIds].filter((id) => !trackedIds.has(id)).length;

    const leaveRows = selectedDayRecords
      .filter((r) => r.status === "Leave")
      .map((r) => ({
        key: r._id,
        name: r.studentName || "Student",
        reason: r.remarks || r.subject || "Leave",
        status: "Approved",
      }));

    const lastSync = (Array.isArray(records) ? records : [])
      .map((r) => (r.updatedAt ? new Date(r.updatedAt) : r.createdAt ? new Date(r.createdAt) : null))
      .filter(Boolean)
      .sort((a, b) => b - a)[0];

    return {
      totalToday,
      presentToday,
      absentToday,
      leaveToday,
      avgToday,
      belowThreshold,
      lectureWise,
      branchWise,
      lowAttendance,
      monthly,
      eligible,
      notEligible: notEligible + untracked,
      leaveRows,
      lastSync,
      uniqueLectures: lectureWise.length,
    };
  }, [selectedDayRecords, studentStats, records, students, studentBranchMap]);

  const handleExport = () => {
    const headers = ["Student", "Roll Number", "Date", "Subject", "Period", "Status", "Remarks"];
    const rows = selectedDayRecords.map((r) => [
      r.studentName || "",
      r.rollNumber || "",
      r.date ? new Date(r.date).toLocaleDateString("en-IN") : "",
      r.subject || "",
      r.period || "",
      r.status || "",
      r.remarks || "",
    ]);

    const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `attendance-${selectedDate}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleMarkAttendance = async () => {
    if (!entryForm.student) {
      window.alert("Please select a student.");
      return;
    }

    setSaving(true);
    try {
      await apiFetch("/attendance", {
        method: "POST",
        body: JSON.stringify({
          student: entryForm.student,
          date: new Date(selectedDate).toISOString(),
          subject: entryForm.subject || "General",
          period: entryForm.period,
          status: entryForm.status,
          remarks: entryForm.remarks,
        }),
      });

      setEntryForm({ student: "", subject: "", period: "", status: "Present", remarks: "" });
      await loadData();
      alert("Attendance marked successfully");
    } catch (e) {
      window.alert(e?.message || "Failed to mark attendance");
    } finally {
      setSaving(false);
    }
  };

  const handleStatusUpdate = async (recordId, status) => {
    try {
      await apiFetch(`/attendance/${recordId}`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      await loadData();
    } catch (e) {
      window.alert(e?.message || "Failed to update attendance");
    }
  };

  const selectedDateLabel = formatDisplayDate(new Date(selectedDate));

  return (
    <>
      <div className="ad-page-header">
        <div>
          <div className="ad-page-title">Attendance Management</div>
          <div className="ad-page-sub">
            {selectedDateLabel} · {loading ? "Loading..." : `${analytics.totalToday} records`}
          </div>
        </div>
        <div className="ad-header-actions">
          <input
            type="date"
            className="ad-input"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <button type="button" className="ad-btn-outline" onClick={handleExport} disabled={loading}>
            {IC.Download} Export Excel
          </button>
        </div>
      </div>

      {loading && <div className="ad-page-sub">Loading attendance...</div>}
      {!loading && error && <div className="ad-page-sub">{error}</div>}

      {!loading && !error && (
        <>
          <div className="ad-kpi-grid ad-kpi-grid-4">
            <div className="ad-kpi">
              <div className="ad-kpi-top">
                <div className="ad-kpi-icon">{IC.Attendance}</div>
                {analytics.avgToday >= ELIGIBILITY_THRESHOLD ? (
                  <span className="pill pill-green">Good</span>
                ) : (
                  analytics.totalToday > 0 && <span className="pill pill-amber">Low</span>
                )}
              </div>
              <div className="ad-kpi-val">{analytics.avgToday}%</div>
              <div className="ad-kpi-label">Today&apos;s avg</div>
            </div>

            <div className="ad-kpi">
              <div className="ad-kpi-top">
                <div className="ad-kpi-icon">{IC.Check}</div>
              </div>
              <div className="ad-kpi-val">{analytics.presentToday}</div>
              <div className="ad-kpi-label">Present today</div>
            </div>

            <div className="ad-kpi">
              <div className="ad-kpi-top">
                <div className="ad-kpi-icon">{IC.X}</div>
              </div>
              <div className="ad-kpi-val">{analytics.absentToday}</div>
              <div className="ad-kpi-label">Absent today</div>
            </div>

            <div className="ad-kpi">
              <div className="ad-kpi-top">
                <div className="ad-kpi-icon">{IC.AlertCircle}</div>
              </div>
              <div className="ad-kpi-val">{analytics.belowThreshold}</div>
              <div className="ad-kpi-label">Below 75%</div>
            </div>

            <div className="ad-kpi">
              <div className="ad-kpi-top">
                <div className="ad-kpi-icon">{IC.Exams}</div>
              </div>
              <div className="ad-kpi-val">{analytics.uniqueLectures}</div>
              <div className="ad-kpi-label">Lectures today</div>
            </div>

            <div className="ad-kpi">
              <div className="ad-kpi-top">
                <div className="ad-kpi-icon">{IC.Bell}</div>
              </div>
              <div className="ad-kpi-val">
                {settings?.autoAlerts?.attendance ? "On" : "Off"}
              </div>
              <div className="ad-kpi-label">Attendance alerts</div>
            </div>

            <div className="ad-kpi">
              <div className="ad-kpi-top">
                <div className="ad-kpi-icon">{IC.Students}</div>
              </div>
              <div className="ad-kpi-val">{analytics.eligible}</div>
              <div className="ad-kpi-label">Eligible</div>
            </div>

            <div className="ad-kpi">
              <div className="ad-kpi-top">
                <div className="ad-kpi-icon">{IC.CalendarCheck}</div>
              </div>
              <div className="ad-kpi-val">{analytics.leaveToday}</div>
              <div className="ad-kpi-label">Leave today</div>
            </div>
          </div>

          <div className="ad-grid-2">
            <div className="ad-card">
              <div className="ad-card-header">
                <span className="ad-card-title">Branch-wise attendance today</span>
              </div>

              {analytics.branchWise.length === 0 ? (
                <div className="ad-page-sub">No attendance data for selected date.</div>
              ) : (
                analytics.branchWise.map((b) => (
                  <div className="bar-row" key={b.branch}>
                    <span className="bar-label">{b.branch}</span>
                    <div className="bar-track">
                      <svg viewBox="0 0 100 6" preserveAspectRatio="none" width="100%" height="6" aria-hidden="true">
                        <rect x="0" y="0" width={b.pct} height="6" rx="3" />
                      </svg>
                    </div>
                    <span className="bar-pct">{b.pct}%</span>
                  </div>
                ))
              )}
            </div>

            <div className="ad-card">
              <div className="ad-card-header">
                <span className="ad-card-title">Low attendance alert — Below 75%</span>
                <span className="ad-card-link">View all</span>
              </div>

              <table className="ad-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Branch</th>
                    <th>Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.lowAttendance.length === 0 ? (
                    <tr>
                      <td colSpan="3">No students below 75%.</td>
                    </tr>
                  ) : (
                    analytics.lowAttendance.map((s) => (
                      <tr key={s.sid}>
                        <td>{s.studentName}</td>
                        <td>
                          <span className="pill pill-blue">{s.branch}</span>
                        </td>
                        <td>
                          <span className="pill pill-red">{s.pct}%</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="ad-grid-2">
            <div className="ad-card">
              <div className="ad-card-header">
                <span className="ad-card-title">Daily lecture-wise attendance</span>
              </div>

              {analytics.lectureWise.length === 0 ? (
                <div className="ad-page-sub">No lecture records for selected date.</div>
              ) : (
                analytics.lectureWise.map((lec) => (
                  <div className="bar-row" key={lec.label}>
                    <span className="bar-label">{lec.label}</span>
                    <div className="bar-track">
                      <svg viewBox="0 0 100 6" preserveAspectRatio="none" width="100%" height="6" aria-hidden="true">
                        <rect x="0" y="0" width={lec.pct} height="6" rx="3" />
                      </svg>
                    </div>
                    <span className="bar-pct">{lec.pct}%</span>
                  </div>
                ))
              )}
            </div>

            <div className="ad-card">
              <div className="ad-card-header">
                <span className="ad-card-title">System integration status</span>
              </div>

              <table className="ad-table">
                <tbody>
                  <tr>
                    <td>Attendance alerts</td>
                    <td>
                      <span className={`pill ${settings?.autoAlerts?.attendance ? "pill-green" : "pill-gray"}`}>
                        {settings?.autoAlerts?.attendance ? "Enabled" : "Disabled"}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>Email notifications</td>
                    <td>
                      <span className={`pill ${settings?.notifications?.email ? "pill-green" : "pill-gray"}`}>
                        {settings?.notifications?.email ? "Enabled" : "Disabled"}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>Last sync</td>
                    <td>{analytics.lastSync ? formatTime(analytics.lastSync) : "—"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="ad-grid-2">
            <div className="ad-card">
              <div className="ad-card-header">
                <span className="ad-card-title">Manual attendance entry</span>
              </div>

              <div className="ad-table-filters">
                <select
                  className="ad-select"
                  value={entryForm.student}
                  onChange={(e) => setEntryForm((prev) => ({ ...prev, student: e.target.value }))}
                >
                  <option value="">Select student</option>
                  {(Array.isArray(students) ? students : []).map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.fullName || `${s.firstName} ${s.lastName}`} ({s.rollNumber})
                    </option>
                  ))}
                </select>

                <input
                  className="ad-input"
                  placeholder="Subject"
                  value={entryForm.subject}
                  onChange={(e) => setEntryForm((prev) => ({ ...prev, subject: e.target.value }))}
                />

                <input
                  className="ad-input"
                  placeholder="Period"
                  value={entryForm.period}
                  onChange={(e) => setEntryForm((prev) => ({ ...prev, period: e.target.value }))}
                />

                <select
                  className="ad-select"
                  value={entryForm.status}
                  onChange={(e) => setEntryForm((prev) => ({ ...prev, status: e.target.value }))}
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Late">Late</option>
                  <option value="Leave">Leave</option>
                </select>

                <input
                  className="ad-input"
                  placeholder="Remarks"
                  value={entryForm.remarks}
                  onChange={(e) => setEntryForm((prev) => ({ ...prev, remarks: e.target.value }))}
                />
              </div>

              <div className="quick-actions">
                <button
                  type="button"
                  className="ad-btn-primary"
                  onClick={handleMarkAttendance}
                  disabled={saving}
                >
                  {IC.Plus} Mark Attendance
                </button>
              </div>

              {selectedDayRecords.length > 0 && (
                <table className="ad-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Subject</th>
                      <th>Status</th>
                      <th>Edit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedDayRecords.slice(0, 8).map((r) => (
                      <tr key={r._id}>
                        <td>{r.studentName}</td>
                        <td>{r.subject || "—"}</td>
                        <td>
                          <span
                            className={`pill ${
                              r.status === "Present" || r.status === "Late"
                                ? "pill-green"
                                : r.status === "Leave"
                                  ? "pill-amber"
                                  : "pill-red"
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>
                        <td>
                          <select
                            className="ad-select"
                            value={r.status}
                            onChange={(e) => handleStatusUpdate(r._id, e.target.value)}
                          >
                            <option value="Present">Present</option>
                            <option value="Absent">Absent</option>
                            <option value="Late">Late</option>
                            <option value="Leave">Leave</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="ad-card">
              <div className="ad-card-header">
                <span className="ad-card-title">Monthly &amp; cumulative reports</span>
              </div>

              {analytics.monthly.map((m) => (
                <div className="bar-row" key={m.label}>
                  <span className="bar-label">{m.label}</span>
                  <div className="bar-track">
                    <svg viewBox="0 0 100 6" preserveAspectRatio="none" width="100%" height="6" aria-hidden="true">
                      <rect x="0" y="0" width={m.pct} height="6" rx="3" />
                    </svg>
                  </div>
                  <span className="bar-pct">{m.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="ad-grid-2">
            <div className="ad-card">
              <div className="ad-card-header">
                <span className="ad-card-title">Exam eligibility</span>
              </div>

              <table className="ad-table">
                <tbody>
                  <tr>
                    <td>Eligible students (≥ 75%)</td>
                    <td>
                      <span className="pill pill-green">{analytics.eligible}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>Not eligible (&lt; 75%)</td>
                    <td>
                      <span className="pill pill-red">{analytics.notEligible}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="ad-card">
              <div className="ad-card-header">
                <span className="ad-card-title">Student leave management</span>
              </div>

              <table className="ad-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Reason</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.leaveRows.length === 0 ? (
                    <tr>
                      <td colSpan="3">No leave records for selected date.</td>
                    </tr>
                  ) : (
                    analytics.leaveRows.map((row) => (
                      <tr key={row.key}>
                        <td>{row.name}</td>
                        <td>{row.reason}</td>
                        <td>
                          <span className="pill pill-green">{row.status}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default AttendancePage;
