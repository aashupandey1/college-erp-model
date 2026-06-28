import { useCallback, useEffect, useMemo, useState } from "react";
import { IC } from "../constants/iconMap";
import { apiFetch } from "../../../services/api";

const PAGE_SIZE = 10;
const STUDENT_FETCH_LIMIT = 500;

const getStudentId = (record) => String(record?.student?._id || record?.student || "");

const calcAttendancePct = (records, studentId) => {
  const rows = records.filter((r) => getStudentId(r) === String(studentId));
  if (!rows.length) return null;
  const present = rows.filter((r) => r.status === "Present" || r.status === "Late").length;
  return Math.round((present / rows.length) * 100);
};

const calcFeeStatus = (fees, studentId) => {
  const rows = fees.filter((f) => getStudentId(f) === String(studentId));
  if (!rows.length) return "—";
  if (rows.some((f) => f.status === "Overdue")) return "Overdue";
  if (rows.some((f) => f.status === "Pending")) return "Pending";
  if (rows.some((f) => f.status === "Partially Paid")) return "Partially Paid";
  return "Paid";
};

const feePillClass = (status) => {
  if (status === "Paid") return "pill-green";
  if (status === "Overdue") return "pill-red";
  if (status === "Pending" || status === "Partially Paid") return "pill-amber";
  return "pill-gray";
};

const statusPillClass = (status) => {
  if (status === "Active") return "pill-green";
  if (status === "Suspended") return "pill-red";
  return "pill-gray";
};

const enrichStudent = (raw, attendanceRecords, fees) => {
  const attPct = calcAttendancePct(attendanceRecords, raw._id);
  const fee = calcFeeStatus(fees, raw._id);
  const name = raw.fullName || `${raw.firstName || ""} ${raw.lastName || ""}`.trim();
  const admYear = raw.admissionYear || "";
  const batchEnd = admYear && !Number.isNaN(Number(admYear)) ? String(Number(admYear) + 4) : "";

  return {
    ...raw,
    name,
    id: raw.rollNumber,
    sem: raw.semester,
    batch: admYear && batchEnd ? `${admYear}-${batchEnd}` : "—",
    academicYear: admYear || "—",
    admYear: raw.admissionYear,
    admDate: raw.admissionDate,
    att: attPct != null ? `${attPct}%` : "—",
    attPct,
    cgpa: "—",
    fee,
    documentStatus: raw.tcNumber ? "Verified" : "Pending",
    email: raw.personalEmail,
    phone: raw.phone,
    address: raw.permanentAddress,
    guardian: raw.guardianName,
    guardianRel: raw.guardianRelation,
    guardianPhone: raw.guardianPhone,
    guardianEmail: raw.guardianEmail,
    guardianOcc: raw.guardianOccupation,
    guardianIncome: raw.guardianIncome,
  };
};

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

/* ════════════════════════════════════════
   PAGE 2 — STUDENTS
════════════════════════════════════════ */
function StudentsPage({ onNav }) {
  const [studentList, setStudentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [branchFilter, setBranchFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");
  const [semesterFilter, setSemesterFilter] = useState("All");
  const [page, setPage] = useState(1);

  const loadStudents = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [studentsRes, attendanceRes, feesRes] = await Promise.all([
        apiFetch(`/students?limit=${STUDENT_FETCH_LIMIT}`),
        apiFetch("/attendance"),
        apiFetch("/fees"),
      ]);

      const students = studentsRes?.data || [];
      const attendance = attendanceRes?.data || [];
      const fees = feesRes?.data || [];

      const enriched = (Array.isArray(students) ? students : []).map((s) =>
        enrichStudent(s, attendance, fees)
      );

      setStudentList(enriched);
    } catch (e) {
      setError(e?.message || "Failed to load students");
      setStudentList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  const branchOptions = useMemo(
    () => [...new Set(studentList.map((s) => s.branch).filter(Boolean))].sort(),
    [studentList]
  );

  const yearOptions = useMemo(
    () => [...new Set(studentList.map((s) => s.academicYear).filter((y) => y && y !== "—"))].sort(),
    [studentList]
  );

  const semesterOptions = useMemo(
    () => [...new Set(studentList.map((s) => s.sem).filter(Boolean))].sort((a, b) => Number(a) - Number(b)),
    [studentList]
  );

  const kpiStats = useMemo(() => {
    const totalEnrolled = studentList.filter((s) => s.status === "Active").length;
    const currentYear = new Date().getFullYear().toString();
    const ninetyDaysAgo = Date.now() - 90 * 24 * 60 * 60 * 1000;

    const newAdmissions = studentList.filter((s) => {
      if (s.admissionYear === currentYear) return true;
      if (s.createdAt && new Date(s.createdAt).getTime() >= ninetyDaysAgo) return true;
      return false;
    }).length;

    const feeDefaulters = studentList.filter(
      (s) => s.fee === "Overdue" || s.fee === "Pending"
    ).length;

    const lowAttendance = studentList.filter(
      (s) => s.attPct != null && s.attPct < 75
    ).length;

    return { totalEnrolled, newAdmissions, feeDefaulters, lowAttendance };
  }, [studentList]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, branchFilter, yearFilter, semesterFilter]);

  const filteredStudents = studentList.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(student.id || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBranch = branchFilter === "All" || student.branch === branchFilter;

    const matchesYear = yearFilter === "All" || student.academicYear === yearFilter;

    const matchesSemester =
      semesterFilter === "All" || String(student.sem) === String(semesterFilter);

    return matchesSearch && matchesBranch && matchesYear && matchesSemester;
  });

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / PAGE_SIZE));
  const paginatedStudents = filteredStudents.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const handleDelete = async (student) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${student.name}?`
    );

    if (!confirmDelete) return;

    try {
      await apiFetch(`/students/${student._id}`, { method: "DELETE" });
      setStudentList((prev) => prev.filter((s) => s._id !== student._id));
      setSuccessMessage(`${student.name} deleted successfully.`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (e) {
      window.alert(e?.message || "Failed to delete student");
    }
  };

  const handleExport = () => {
    const headers = [
      "Name",
      "Roll Number",
      "Branch",
      "Batch",
      "Section",
      "Semester",
      "Attendance",
      "CGPA",
      "Fee",
      "Status",
      "Documents",
    ];

    const rows = filteredStudents.map((s) => [
      s.name,
      s.id,
      s.branch || "",
      s.batch,
      s.section || "",
      s.sem || "",
      s.att,
      s.cgpa,
      s.fee,
      s.status || "",
      s.documentStatus,
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "students.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="ad-page-header">
        <div>
          <div className="ad-page-title">Students</div>
          <div className="ad-page-sub">
            Showing {filteredStudents.length} of {studentList.length} students
          </div>
        </div>
        <div className="ad-header-actions">
          <button type="button" className="ad-btn-outline" onClick={handleExport} disabled={loading}>
            {IC.Download} Export
          </button>
          <button type="button" className="ad-btn-outline" onClick={() => onNav("admissions")}>
            Admissions
          </button>
          <button type="button" className="ad-btn-primary" onClick={() => onNav("addStudent")}>
            {IC.Plus} Add Student
          </button>
        </div>
      </div>

      {loading && <div className="ad-page-sub">Loading students...</div>}
      {!loading && error && <div className="ad-page-sub">{error}</div>}
      {!loading && !error && successMessage && (
        <div className="ad-page-sub">{successMessage}</div>
      )}

      {!loading && !error && (
        <>
          <div className="ad-kpi-grid ad-kpi-grid-4">
            <div className="ad-kpi">
              <div className="ad-kpi-top">
                <div className="ad-kpi-icon">{IC.Students}</div>
              </div>
              <div className="ad-kpi-val">{kpiStats.totalEnrolled.toLocaleString("en-IN")}</div>
              <div className="ad-kpi-label">Total enrolled</div>
            </div>

            <div className="ad-kpi">
              <div className="ad-kpi-top">
                <div className="ad-kpi-icon">{IC.Plus}</div>
              </div>
              <div className="ad-kpi-val">{kpiStats.newAdmissions.toLocaleString("en-IN")}</div>
              <div className="ad-kpi-label">New admissions</div>
            </div>

            <div className="ad-kpi">
              <div className="ad-kpi-top">
                <div className="ad-kpi-icon">{IC.Fees}</div>
                {kpiStats.feeDefaulters > 0 && <span className="pill pill-red">Alert</span>}
              </div>
              <div className="ad-kpi-val">{kpiStats.feeDefaulters}</div>
              <div className="ad-kpi-label">Fee defaulters</div>
            </div>

            <div className="ad-kpi">
              <div className="ad-kpi-top">
                <div className="ad-kpi-icon">{IC.Attendance}</div>
                {kpiStats.lowAttendance > 0 && <span className="pill pill-amber">Alert</span>}
              </div>
              <div className="ad-kpi-val">{kpiStats.lowAttendance}</div>
              <div className="ad-kpi-label">Low attendance</div>
            </div>
          </div>

          <div className="ad-table-wrap">
            <div className="ad-table-header">
              <span className="ad-card-title">All Students</span>
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
                  value={branchFilter}
                  onChange={(e) => setBranchFilter(e.target.value)}
                >
                  <option value="All">All Branches</option>
                  {branchOptions.map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
                <select
                  className="ad-select"
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                >
                  <option value="All">All Years</option>
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <select
                  className="ad-select"
                  value={semesterFilter}
                  onChange={(e) => setSemesterFilter(e.target.value)}
                >
                  <option value="All">All Semesters</option>
                  {semesterOptions.map((sem) => (
                    <option key={sem} value={sem}>
                      Sem {sem}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <table className="ad-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Branch</th>
                  <th>Batch</th>
                  <th>Section</th>
                  <th>Sem</th>
                  <th>Attendance</th>
                  <th>CGPA</th>
                  <th>Fee</th>
                  <th>Status</th>
                  <th>Documents</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedStudents.length === 0 ? (
                  <tr>
                    <td colSpan="11">No students found.</td>
                  </tr>
                ) : (
                  paginatedStudents.map((s) => (
                    <tr key={s._id || s.id}>
                      <td>
                        <div className="stu-cell">
                          <div className="stu-av">{getInitials(s.name)}</div>
                          <div>
                            <div className="stu-name">{s.name}</div>
                            <div className="stu-id">{s.id}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="pill pill-blue">{s.branch || "—"}</span>
                      </td>
                      <td>{s.batch}</td>
                      <td>{s.section || "—"}</td>
                      <td>Sem {s.sem || "—"}</td>
                      <td>
                        {s.attPct != null ? (
                          <span className={`pill ${s.attPct < 75 ? "pill-red" : "pill-green"}`}>
                            {s.att}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td>{s.cgpa}</td>
                      <td>
                        <span className={`pill ${feePillClass(s.fee)}`}>{s.fee}</span>
                      </td>
                      <td>
                        <span className={`pill ${statusPillClass(s.status)}`}>
                          {s.status || "—"}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`pill ${
                            s.documentStatus === "Verified" ? "pill-green" : "pill-amber"
                          }`}
                        >
                          {s.documentStatus}
                        </span>
                      </td>
                      <td>
                        <div className="quick-actions">
                          <button
                            type="button"
                            className="ad-btn-success ad-action-btn"
                            onClick={() => onNav("studentProfile", s)}
                          >
                            {IC.Eye}
                          </button>
                          <button
                            type="button"
                            className="ad-btn-delete ad-action-btn"
                            onClick={() => onNav("editStudent", s)}
                          >
                            {IC.Edit}
                          </button>
                          <button
                            type="button"
                            className="ad-btn-danger ad-action-btn"
                            onClick={() => handleDelete(s)}
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

            {filteredStudents.length > PAGE_SIZE && (
              <div className="ad-header-actions" style={{ padding: "12px 16px" }}>
                <button
                  type="button"
                  className="ad-btn-outline"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                >
                  Previous
                </button>
                <span className="ad-page-sub" style={{ margin: "0 12px" }}>
                  Page {page} of {totalPages}
                </span>
                <button
                  type="button"
                  className="ad-btn-outline"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default StudentsPage;
