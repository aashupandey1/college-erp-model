import { useEffect, useMemo, useState } from "react";
import { IC } from "../constants/iconMap";
import { apiFetch } from "../../../services/api";

const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const formatCurrency = (n) => {
  const num = Number(n) || 0;
  try {
    return num.toLocaleString("en-IN", { maximumFractionDigits: 0 });
  } catch {
    return String(num);
  }
};

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const noticePriorityClass = (priority) => {
  if (priority === "Emergency") return "pill-red";
  if (priority === "High") return "pill-amber";
  return "pill-blue";
};

const activityTypeClass = (type) => {
  if (type === "fee") return "pill-green";
  if (type === "grievance") return "pill-red";
  return "pill-blue";
};

/* ════════════════════════════════════════
   PAGE 1 — DASHBOARD
════════════════════════════════════════ */
function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [studentsCount, setStudentsCount] = useState(0);
  const [facultyCount, setFacultyCount] = useState(0);
  const [todayAttendance, setTodayAttendance] = useState({ total: 0, present: 0, percent: 0 });
  const [feeMonthStats, setFeeMonthStats] = useState({ collected: 0, defaulters: 0 });
  const [feeChart, setFeeChart] = useState([]);
  const [pendingGrievancesCount, setPendingGrievancesCount] = useState(0);
  const [pendingScholarshipsCount, setPendingScholarshipsCount] = useState(0);
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [lowAttendanceRows, setLowAttendanceRows] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [recentNotices, setRecentNotices] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [branchAttendance, setBranchAttendance] = useState([]);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const [
          studentsRes,
          facultyRes,
          feesRes,
          attendanceRes,
          examsRes,
          grievancesRes,
          communicationRes,
          scholarshipRes,
        ] = await Promise.all([
          apiFetch("/students"),
          apiFetch("/faculty"),
          apiFetch("/fees"),
          apiFetch("/attendance"),
          apiFetch("/exams"),
          apiFetch("/grievances"),
          apiFetch("/communication"),
          apiFetch("/scholarship"),
        ]);

        const students = studentsRes?.data || [];
        const faculty = facultyRes?.data || [];
        const fees = feesRes?.data || [];
        const attendance = attendanceRes?.data || [];
        const exams = examsRes?.data || [];
        const grievances = grievancesRes?.data || [];
        const notices = communicationRes?.data || [];
        const scholarships = scholarshipRes?.data || [];

        const studentBranchMap = new Map();
        (Array.isArray(students) ? students : []).forEach((s) => {
          if (s?._id) studentBranchMap.set(String(s._id), s.branch || "General");
        });

        if (mounted) {
          setStudentsCount(Array.isArray(students) ? students.length : 0);
          setFacultyCount(Array.isArray(faculty) ? faculty.length : 0);
        }

        const now = new Date();
        const startOfToday = new Date(now);
        startOfToday.setHours(0, 0, 0, 0);
        const endOfToday = new Date(now);
        endOfToday.setHours(23, 59, 59, 999);

        const todays = (Array.isArray(attendance) ? attendance : []).filter((r) => {
          const d = r?.date ? new Date(r.date) : null;
          return d && d >= startOfToday && d <= endOfToday;
        });

        const presentCount = todays.filter((r) => r?.status === "Present" || r?.status === "Late").length;
        const totalCount = todays.length;
        const percent = totalCount ? Math.round((presentCount / totalCount) * 100) : 0;

        if (mounted) {
          setTodayAttendance({ total: totalCount, present: presentCount, percent });
        }

        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const thisMonthFees = (Array.isArray(fees) ? fees : []).filter((f) => {
          const d = f?.dueDate ? new Date(f.dueDate) : null;
          return d && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        });

        const collectedThisMonth = thisMonthFees.reduce((sum, f) => {
          const st = f?.status;
          if (st === "Paid" || st === "Partially Paid") return sum + (f?.amount || 0);
          return sum;
        }, 0);

        const defaultersThisMonth = thisMonthFees.filter(
          (f) => f?.status === "Overdue" || f?.status === "Pending"
        ).length;

        const months = [];
        for (let i = 5; i >= 0; i -= 1) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          months.push({ year: d.getFullYear(), month: d.getMonth() });
        }

        const chart = months.map((m) => {
          const monthFees = (Array.isArray(fees) ? fees : []).filter((f) => {
            const dd = f?.dueDate ? new Date(f.dueDate) : null;
            return dd && dd.getFullYear() === m.year && dd.getMonth() === m.month;
          });

          const collected = monthFees.reduce((sum, f) => {
            const st = f?.status;
            if (st === "Paid" || st === "Partially Paid") return sum + (f?.amount || 0);
            return sum;
          }, 0);

          return {
            m: MONTH_SHORT[m.month],
            year: m.year,
            collected,
          };
        });

        if (mounted) {
          setFeeMonthStats({ collected: collectedThisMonth, defaulters: defaultersThisMonth });
          setFeeChart(chart);
        }

        const upcoming = (Array.isArray(exams) ? exams : [])
          .filter((e) => {
            const d = e?.date ? new Date(e.date) : null;
            return d && d >= startOfToday;
          })
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 4);

        if (mounted) {
          setUpcomingExams(upcoming);
        }

        const pendingGr = (Array.isArray(grievances) ? grievances : []).filter(
          (g) => g?.status === "Open" || g?.status === "In Progress"
        );

        const pendingSch = (Array.isArray(scholarships) ? scholarships : []).filter(
          (s) => s?.status === "Pending" || s?.status === "Under Review"
        );

        if (mounted) {
          setPendingGrievancesCount(
            (Array.isArray(grievances) ? grievances : []).filter((g) => g?.status === "Open").length
          );
          setPendingScholarshipsCount(pendingSch.length);
        }

        const approvals = [
          ...pendingGr.map((g) => ({
            key: `gr-${g._id}`,
            type: g?.category || "Grievance",
            desc: g?.description || "—",
            time: g?.filedDate ? new Date(g.filedDate).toLocaleString() : "",
            sortDate: g?.filedDate ? new Date(g.filedDate) : new Date(0),
            pillClass: g?.status === "Open" ? "pill-red" : "pill-amber",
            pillLabel: g?.status === "Open" ? "Open" : "In Progress",
            icon: IC.Mail,
          })),
          ...pendingSch.map((s) => ({
            key: `sch-${s._id}`,
            type: "Scholarship",
            desc: `${s?.studentName || "Student"} — ${s?.scheme || "Application"}`,
            time: s?.appliedDate ? new Date(s.appliedDate).toLocaleString() : "",
            sortDate: s?.appliedDate ? new Date(s.appliedDate) : new Date(0),
            pillClass: "pill-amber",
            pillLabel: s?.status || "Pending",
            icon: IC.Award,
          })),
        ]
          .sort((a, b) => (b.sortDate?.getTime() || 0) - (a.sortDate?.getTime() || 0))
          .slice(0, 5);

        if (mounted) {
          setPendingApprovals(approvals);
        }

        const noticeItems = (Array.isArray(notices) ? notices : [])
          .filter((n) => n?.status !== "Archived")
          .sort((a, b) => {
            const da = new Date(a?.sentAt || a?.createdAt || 0);
            const db = new Date(b?.sentAt || b?.createdAt || 0);
            return db - da;
          })
          .slice(0, 4);

        if (mounted) {
          setRecentNotices(noticeItems);
        }

        const byStudent = new Map();
        todays.forEach((r) => {
          const sid = r?.student?._id?.toString?.() || r?.student?.toString?.() || "unknown";
          const branch =
            studentBranchMap.get(String(r?.student?._id || r?.student)) ||
            r?.student?.branch ||
            "General";

          if (!byStudent.has(sid)) {
            byStudent.set(sid, {
              total: 0,
              present: 0,
              studentName: r?.studentName || "Unknown",
              rollNumber: r?.rollNumber || "",
              branch,
            });
          }

          const row = byStudent.get(sid);
          row.total += 1;
          if (r?.status === "Present" || r?.status === "Late") row.present += 1;
        });

        const lowRows = Array.from(byStudent.entries())
          .map(([sid, v]) => {
            const pct = v.total ? Math.round((v.present / v.total) * 100) : 0;
            return { ...v, pct, sid };
          })
          .filter((r) => r.pct < 75)
          .sort((a, b) => a.pct - b.pct)
          .slice(0, 5);

        if (mounted) {
          setLowAttendanceRows(lowRows);
        }

        const branchAgg = new Map();
        todays.forEach((r) => {
          const sid = r?.student?._id?.toString?.() || r?.student?.toString?.() || "";
          const branch = studentBranchMap.get(sid) || "General";
          if (!branchAgg.has(branch)) branchAgg.set(branch, { total: 0, present: 0 });
          const agg = branchAgg.get(branch);
          agg.total += 1;
          if (r?.status === "Present" || r?.status === "Late") agg.present += 1;
        });

        const bArr = Array.from(branchAgg.entries())
          .map(([branch, v]) => ({
            branch,
            pct: v.total ? Math.round((v.present / v.total) * 100) : 0,
          }))
          .sort((a, b) => b.pct - a.pct)
          .slice(0, 5);

        if (mounted) {
          setBranchAttendance(bArr);
        }

        const activityItems = [];

        todays.slice(0, 10).forEach((r) => {
          activityItems.push({
            key: `att-${r?._id}`,
            type: "attendance",
            text: `${r?.studentName || "Student"} attendance marked — ${r?.status || "—"}`,
            time: r?.date ? new Date(r.date) : null,
          });
        });

        (Array.isArray(fees) ? fees : []).slice(0, 10).forEach((f) => {
          activityItems.push({
            key: `fee-${f?._id}`,
            type: "fee",
            text: `Fee update — ${f?.studentName || "Student"} ₹${f?.amount || 0}`,
            time: f?.createdAt ? new Date(f.createdAt) : null,
          });
        });

        pendingGr.slice(0, 10).forEach((g) => {
          activityItems.push({
            key: `gr-act-${g?._id}`,
            type: "grievance",
            text: `Grievance filed — ${g?.category || "Grievance"}`,
            time: g?.filedDate ? new Date(g.filedDate) : null,
          });
        });

        const sortedActivity = activityItems
          .filter((x) => x.time)
          .sort((a, b) => (b.time?.getTime() || 0) - (a.time?.getTime() || 0))
          .slice(0, 6)
          .map((x) => ({
            ...x,
            timeText: x.time ? x.time.toLocaleString() : "",
          }));

        if (mounted) {
          setRecentActivity(sortedActivity);
        }
      } catch (e) {
        if (mounted) setError(e?.message || "Failed to load dashboard");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const feeMax = useMemo(() => {
    const max = Math.max(0, ...feeChart.map((x) => x.collected || 0));
    return max || 1;
  }, [feeChart]);

  return (
    <>
      <div className="ad-page-header">
        <div>
          <div className="ad-page-title">Admin Dashboard</div>
          <div className="ad-page-sub">Dashboard overview</div>
        </div>
        <div className="ad-header-actions">
          <button type="button" className="ad-btn-outline">
            {IC.Download} Report
          </button>
          <button type="button" className="ad-btn-primary">
            {IC.Plus} Add User
          </button>
        </div>
      </div>

      {loading && <div className="ad-page-sub">Loading dashboard...</div>}
      {!loading && error && <div className="ad-page-sub">{error}</div>}

      {!loading && !error && (
        <>
          <div className="ad-kpi-grid ad-kpi-grid-4">
            <div className="ad-kpi">
              <div className="ad-kpi-top">
                <div className="ad-kpi-icon">{IC.Students}</div>
              </div>
              <div className="ad-kpi-val">{studentsCount.toLocaleString("en-IN")}</div>
              <div className="ad-kpi-label">Total students</div>
            </div>

            <div className="ad-kpi">
              <div className="ad-kpi-top">
                <div className="ad-kpi-icon">{IC.Attendance}</div>
                {todayAttendance.total > 0 && (
                  <span className={`pill ${todayAttendance.percent >= 75 ? "pill-green" : "pill-red"}`}>
                    {todayAttendance.percent >= 75 ? "Good" : "Needs attention"}
                  </span>
                )}
              </div>
              <div className="ad-kpi-val">{todayAttendance.percent}%</div>
              <div className="ad-kpi-label">Today&apos;s attendance</div>
              <div className="ad-kpi-trend trend-neu">
                {todayAttendance.present} present of {todayAttendance.total} records
              </div>
            </div>

            <div className="ad-kpi">
              <div className="ad-kpi-top">
                <div className="ad-kpi-icon">{IC.Fees}</div>
              </div>
              <div className="ad-kpi-val">₹{formatCurrency(feeMonthStats.collected)}</div>
              <div className="ad-kpi-label">Fee this month</div>
            </div>

            <div className="ad-kpi">
              <div className="ad-kpi-top">
                <div className="ad-kpi-icon">{IC.Fees}</div>
                {feeMonthStats.defaulters > 0 ? (
                  <span className="pill pill-red">Urgent</span>
                ) : (
                  <span className="pill pill-green">OK</span>
                )}
              </div>
              <div className="ad-kpi-val">{feeMonthStats.defaulters}</div>
              <div className="ad-kpi-label">Fee defaulters</div>
            </div>
          </div>

          <div className="ad-kpi-grid ad-kpi-grid-4">
            <div className="ad-kpi">
              <div className="ad-kpi-top">
                <div className="ad-kpi-icon">{IC.Faculty}</div>
              </div>
              <div className="ad-kpi-val">{facultyCount.toLocaleString("en-IN")}</div>
              <div className="ad-kpi-label">Faculty</div>
            </div>

            <div className="ad-kpi">
              <div className="ad-kpi-top">
                <div className="ad-kpi-icon">{IC.Mail}</div>
              </div>
              <div className="ad-kpi-val">{pendingGrievancesCount}</div>
              <div className="ad-kpi-label">Open grievances</div>
            </div>

            <div className="ad-kpi">
              <div className="ad-kpi-top">
                <div className="ad-kpi-icon">{IC.Exams}</div>
              </div>
              <div className="ad-kpi-val">{upcomingExams.length}</div>
              <div className="ad-kpi-label">Upcoming exams</div>
            </div>

            <div className="ad-kpi">
              <div className="ad-kpi-top">
                <div className="ad-kpi-icon">{IC.Award}</div>
              </div>
              <div className="ad-kpi-val">{pendingScholarshipsCount}</div>
              <div className="ad-kpi-label">Pending scholarships</div>
            </div>
          </div>

          <div className="ad-card">
            <div className="ad-card-header">
              <span className="ad-card-title">Quick actions</span>
            </div>
            <div className="quick-actions">
              <button type="button" className="ad-btn-outline">
                {IC.Students} Add Student
              </button>
              <button type="button" className="ad-btn-outline">
                {IC.Faculty} Add Faculty
              </button>
              <button type="button" className="ad-btn-outline">
                {IC.Fees} Collect Fee
              </button>
              <button type="button" className="ad-btn-outline">
                {IC.Attendance} Mark Attendance
              </button>
              <button type="button" className="ad-btn-outline">
                {IC.Bell} Send Notice
              </button>
              <button type="button" className="ad-btn-outline">
                {IC.Reports} Generate Report
              </button>
            </div>
          </div>

          <div className="ad-grid-3">
            <div className="ad-card">
              <div className="ad-card-header">
                <span className="ad-card-title">Fee collection</span>
                <span className="ad-card-link">Details</span>
              </div>

              {feeChart.map((f) => {
                const pct = Math.round(((f.collected || 0) / feeMax) * 100);
                return (
                  <div className="bar-row" key={`${f.year}-${f.m}`}>
                    <span className="bar-label">{f.m}</span>
                    <div className="bar-track">
                      <svg viewBox="0 0 100 6" preserveAspectRatio="none" width="100%" height="6" aria-hidden="true">
                        <rect x="0" y="0" width={pct} height="6" rx="3" />
                      </svg>
                    </div>
                    <span className="bar-pct">₹{formatCurrency(f.collected)}</span>
                  </div>
                );
              })}

              <div className="stat-summary">
                <span className="stat-chip">
                  Collected: <b>₹{formatCurrency(feeMonthStats.collected)}</b>
                </span>
                <span className="stat-chip">
                  Defaulters: <b>{feeMonthStats.defaulters}</b>
                </span>
              </div>
            </div>

            <div className="ad-card">
              <div className="ad-card-header">
                <span className="ad-card-title">Upcoming exams</span>
                <span className="ad-card-link">View all</span>
              </div>

              {upcomingExams.length === 0 ? (
                <div className="ad-page-sub">No upcoming exams found.</div>
              ) : (
                <div className="timeline">
                  {upcomingExams.map((e, i) => {
                    const d = e?.date ? new Date(e.date) : null;
                    const date = d ? d.getDate().toString() : "—";
                    const mon = d ? MONTH_SHORT[d.getMonth()] : "";
                    return (
                      <div className="tl-item" key={e?._id || i}>
                        <div className="tl-dot">
                          <span className="ad-kpi-label">{date}</span>
                          <span className="activity-time">{mon}</span>
                        </div>
                        <div className="tl-body">
                          <div className="tl-title">{e?.subject || e?.title || "Exam"}</div>
                          <div className="tl-sub">
                            {e?.branch || "—"} · Room {e?.room || "—"}
                          </div>
                          <span className="pill pill-blue">{e?.status || "Scheduled"}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="ad-card">
              <div className="ad-card-header">
                <span className="ad-card-title">Recent notices</span>
                <span className="ad-card-link">View all</span>
              </div>

              {recentNotices.length === 0 ? (
                <div className="ad-page-sub">No notices found.</div>
              ) : (
                recentNotices.map((n, i) => (
                  <div key={n?._id || i} className="notice-item">
                    <span className={`pill ${noticePriorityClass(n?.priority)}`}>
                      {n?.priority?.[0] || "N"}
                    </span>
                    <div>
                      <div className="notice-text">{n?.title || n?.message}</div>
                      <div className="notice-time">
                        {(n?.sentAt || n?.createdAt)
                          ? new Date(n.sentAt || n.createdAt).toLocaleString()
                          : ""}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="ad-grid-2">
            <div className="ad-card">
              <div className="ad-card-header">
                <span className="ad-card-title">Low attendance alerts</span>
                <span className="ad-card-link">View all</span>
              </div>

              <table className="ad-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Branch</th>
                    <th>Attendance</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {lowAttendanceRows.length === 0 ? (
                    <tr>
                      <td colSpan="4">No low attendance alerts for today.</td>
                    </tr>
                  ) : (
                    lowAttendanceRows.map((s, i) => (
                      <tr key={s.sid || i}>
                        <td>
                          <div className="stu-cell">
                            <div className="stu-av">{getInitials(s.studentName)}</div>
                            <div>
                              <div className="stu-name">{s.studentName}</div>
                              <div className="stu-id">{s.rollNumber || ""}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="pill pill-blue">{s.branch || "General"}</span>
                        </td>
                        <td>
                          <span className={`pill ${s.pct < 70 ? "pill-red" : "pill-amber"}`}>
                            {s.pct}%
                          </span>
                        </td>
                        <td>
                          <button type="button" className="ad-btn-outline">
                            Notify
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="ad-card">
              <div className="ad-card-header">
                <span className="ad-card-title">Pending approvals</span>
                <span className="ad-card-link">View all</span>
              </div>

              {pendingApprovals.length === 0 ? (
                <div className="ad-page-sub">No pending approvals.</div>
              ) : (
                pendingApprovals.map((ap) => (
                  <div key={ap.key} className="notice-item">
                    <div className="ad-kpi-icon">{ap.icon}</div>
                    <div>
                      <div className="tl-title">{ap.type}</div>
                      <div className="activity-text">{ap.desc}</div>
                      <div className="activity-time">{ap.time}</div>
                    </div>
                    <span className={`pill ${ap.pillClass}`}>{ap.pillLabel}</span>
                  </div>
                ))
              )}

              {pendingApprovals.length > 0 && (
                <div className="quick-actions">
                  <button type="button" className="ad-btn-success">
                    {IC.Check} Approve all
                  </button>
                  <button type="button" className="ad-btn-danger">
                    {IC.X} Reject
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="ad-grid-2">
            <div className="ad-card">
              <div className="ad-card-header">
                <span className="ad-card-title">Branch-wise attendance</span>
                <span className="ad-card-link">Details</span>
              </div>

              {branchAttendance.length === 0 ? (
                <div className="ad-page-sub">No attendance data for today.</div>
              ) : (
                branchAttendance.map((b) => (
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
                <span className="ad-card-title">Recent activity</span>
              </div>
              <div className="activity-list">
                {recentActivity.length === 0 ? (
                  <div className="ad-page-sub">No activity yet.</div>
                ) : (
                  recentActivity.map((a) => (
                    <div className="activity-item" key={a.key}>
                      <span className={`pill ${activityTypeClass(a.type)}`}>
                        {a.type === "fee" ? "Fee" : a.type === "grievance" ? "GR" : "ATT"}
                      </span>
                      <div>
                        <div className="activity-text">{a.text}</div>
                        <div className="activity-time">{a.timeText}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default DashboardPage;
