import { useCallback, useEffect, useMemo, useState } from "react";
import { IC } from "../constants/iconMap";


import { apiFetch } from "../../../services/api";
const PAGE_SIZE = 10;
const parseHours = (value) => {
  const n = parseFloat(String(value || "").replace(/[^\d.]/g, ""));
  return Number.isNaN(n) ? 0 : n;
};

const getWorkloadHrs = (faculty) =>
  parseHours(faculty.lectureHrs) + parseHours(faculty.labHrs) + parseHours(faculty.tutorialHrs);

const getSubjectsLabel = (faculty) => {
  if (Array.isArray(faculty.assignedSubjects) && faculty.assignedSubjects.length) {
    return faculty.assignedSubjects.join(", ");
  }
  if (faculty.subjects) return String(faculty.subjects);
  return "—";
};

const enrichFaculty = (raw) => ({
  ...raw,
  name: raw.name || [raw.firstName, raw.middleName, raw.lastName].filter(Boolean).join(" ").trim(),
  subjectsLabel: getSubjectsLabel(raw),
  workloadHrs: getWorkloadHrs(raw),
});

const statusPillClass = (status) => {
  if (status === "Active") return "pill-green";
  if (status === "On Leave") return "pill-amber";
  return "pill-gray";
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
   PAGE 3 — FACULTY
════════════════════════════════════════ */
function FacultyPage({ onNav }) {
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");

  const loadFaculty = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await apiFetch("/faculty");
      const faculty = res?.data || [];
      const enriched = (Array.isArray(faculty) ? faculty : []).map(enrichFaculty);
      setFacultyList(enriched);
    } catch (e) {
      setError(e?.message || "Failed to load faculty");
      setFacultyList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFaculty();
  }, [loadFaculty]);

  const deptOptions = useMemo(
    () => [...new Set(facultyList.map((f) => f.dept).filter(Boolean))].sort(),
    [facultyList]
  );

  const kpiStats = useMemo(() => {
    const total = facultyList.length;
    const active = facultyList.filter((f) => f.status === "Active").length;
    const onLeave = facultyList.filter((f) => f.status === "On Leave").length;

    const workloads = facultyList.map((f) => f.workloadHrs).filter((h) => h > 0);
    const avgWorkload = workloads.length
      ? (workloads.reduce((sum, h) => sum + h, 0) / workloads.length).toFixed(1)
      : "0";

    return { total, active, onLeave, avgWorkload };
  }, [facultyList]);

  const filteredFaculty = facultyList.filter((f) => {
    const q = searchTerm.toLowerCase();

    const matchesSearch =
      String(f.name || "").toLowerCase().includes(q) ||
      String(f.id || "").toLowerCase().includes(q) ||
      String(f.dept || "").toLowerCase().includes(q) ||
      String(f.desig || "").toLowerCase().includes(q) ||
      String(f.email || "").toLowerCase().includes(q) ||
      String(f.phone || "").toLowerCase().includes(q);

    const matchesDept =
      deptFilter === "All" || f.dept === deptFilter;

    return matchesSearch && matchesDept;
  });

  const handleDelete = async (faculty) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${faculty.name}?`
    );

    if (!confirmDelete) return;

    try {
      await apiFetch(`/faculty/${faculty._id}`, { method: "DELETE" });
      setFacultyList((prev) => prev.filter((f) => f._id !== faculty._id));
    } catch (e) {
      window.alert(e?.message || "Failed to delete faculty");
    }
  };

  const handleExport = () => {
    const headers = [
      "Name",
      "Employee ID",
      "Department",
      "Designation",
      "Subjects",
      "Experience",
      "Workload (hrs/wk)",
      "Status",
    ];

    const rows = filteredFaculty.map((f) => [
      f.name,
      f.id,
      f.dept || "",
      f.desig || "",
      f.subjectsLabel,
      f.exp || "",
      f.workloadHrs || 0,
      f.status || "",
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "faculty.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="ad-page-header">
        <div>
          <div className="ad-page-title">Faculty Management</div>
          <div className="ad-page-sub">
            Showing {filteredFaculty.length} of {facultyList.length} faculty members
          </div>
        </div>
        <div className="ad-header-actions">
          <button type="button" className="ad-btn-outline" onClick={handleExport} disabled={loading}>
            {IC.Download} Export
          </button>
          <button type="button" className="ad-btn-primary" onClick={() => onNav("addFaculty")}>
            {IC.Plus} Add Faculty
          </button>
        </div>
      </div>

      {loading && <div className="ad-page-sub">Loading faculty...</div>}
      {!loading && error && <div className="ad-page-sub">{error}</div>}

      {!loading && !error && (
        <>
          <div className="ad-kpi-grid ad-kpi-grid-4">
            <div className="ad-kpi">
              <div className="ad-kpi-top">
                <div className="ad-kpi-icon">{IC.Faculty}</div>
              </div>
              <div className="ad-kpi-val">{kpiStats.total.toLocaleString("en-IN")}</div>
              <div className="ad-kpi-label">Total faculty</div>
            </div>

            <div className="ad-kpi">
              <div className="ad-kpi-top">
                <div className="ad-kpi-icon">{IC.Check}</div>
              </div>
              <div className="ad-kpi-val">{kpiStats.active.toLocaleString("en-IN")}</div>
              <div className="ad-kpi-label">Active</div>
            </div>

            <div className="ad-kpi">
              <div className="ad-kpi-top">
                <div className="ad-kpi-icon">{IC.CalendarCheck}</div>
                {kpiStats.onLeave > 0 && <span className="pill pill-amber">Away</span>}
              </div>
              <div className="ad-kpi-val">{kpiStats.onLeave}</div>
              <div className="ad-kpi-label">On leave</div>
            </div>

            <div className="ad-kpi">
              <div className="ad-kpi-top">
                <div className="ad-kpi-icon">{IC.Calculator}</div>
              </div>
              <div className="ad-kpi-val">{kpiStats.avgWorkload}</div>
              <div className="ad-kpi-label">Avg workload (hrs/wk)</div>
            </div>
          </div>

          <div className="ad-table-wrap">
            <div className="ad-table-header">
              <span className="ad-card-title">All Faculty</span>
              <div className="ad-table-filters">
                <div className="ad-search-input">
                  {IC.Search}
                  <input
                    placeholder="Search faculty..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="ad-select"
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                >
                  <option value="All">All depts</option>
                  {deptOptions.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <table className="ad-table">
              <thead>
                <tr>
                  <th>Faculty</th>
                  <th>Dept</th>
                  <th>Designation</th>
                  <th>Subjects</th>
                  <th>Experience</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFaculty.length === 0 ? (
                  <tr>
                    <td colSpan="7">No faculty found.</td>
                  </tr>
                ) : (
                  filteredFaculty.map((f) => (
                    <tr key={f._id || f.id}>
                      <td>
                        <div className="stu-cell">
                          <div className="stu-av">{getInitials(f.name)}</div>
                          <div>
                            <div className="stu-name">{f.name}</div>
                            <div className="stu-id">{f.id}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="pill pill-purple">{f.dept || "—"}</span>
                      </td>
                      <td>{f.desig || "—"}</td>
                      <td>{f.subjectsLabel}</td>
                      <td>{f.exp || "—"}</td>
                      <td>
                        <span className={`pill ${statusPillClass(f.status)}`}>
                          {f.status || "—"}
                        </span>
                      </td>
                      <td>
                        <div className="quick-actions">
                          <button
                            type="button"
                            className="ad-btn-success ad-action-btn"
                            onClick={() => onNav("facultyProfile", f)}
                          >
                            {IC.Eye}
                          </button>

                          <button
                            type="button"
                            className="ad-btn-outline ad-action-btn"
                            onClick={() => onNav("editFaculty", f)}
                          >
                            {IC.Edit}
                          </button>

                          <button
                            type="button"
                            className="ad-btn-danger ad-action-btn"
                            onClick={() => handleDelete(f)}
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

export default FacultyPage;
