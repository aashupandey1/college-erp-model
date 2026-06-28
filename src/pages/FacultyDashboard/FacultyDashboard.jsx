import { useState } from 'react'
import './FacultyDashboard.css'
import {
  IconDashboard, IconCalendarCheck, IconExams, IconLibrary,
  IconCalendarCheck as IconTimetable, IconUsers, IconReports,
  IconHostel as IconLeave, IconSearch, IconBell, IconSchool,
  IconDownload, IconPlus, IconCheck, IconEdit, IconFilter,
  IconAlertCircle, IconMail, IconSettings,
} from '../../components/Icons'
import logo from "../../assets/logo.png";

/* ══════════════════════════════
   NAV CONFIG
══════════════════════════════ */
const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <IconDashboard /> },
  { id: 'attendance', label: 'Attendance', icon: <IconCalendarCheck /> },
  { id: 'marks', label: 'Marks Entry', icon: <IconExams /> },
  { id: 'lms', label: 'LMS', icon: <IconLibrary /> },
  { id: 'assessments', label: 'Assessments', icon: <IconExams /> },
  { id: 'timetable', label: 'Timetable', icon: <IconTimetable /> },
  { id: 'students', label: 'My Students', icon: <IconUsers /> },
  { id: 'communication', label: 'Communication', icon: <IconMail /> },
  { id: 'appraisal', label: 'Appraisal', icon: <IconReports /> },
  { id: 'leave', label: 'Leave', icon: <IconLeave /> },
  { id: 'reports', label: 'Reports', icon: <IconReports /> },
  { id: 'settings', label: 'Settings', icon: <IconSettings /> },
]
/* ══════════════════════════════
   SHELL
══════════════════════════════ */
function Shell({ active, onNav, children }) {
  return (
    <div className="fac-page">
      <nav className="fac-navbar">
        <div className="fac-nav-left">
          <div className="fac-nav-icon">
            <img src={logo} alt="Logo" />
          </div>
          <div className="fac-nav-text">
            <span className="fac-nav-title">COLLEGE ERP</span>
            <span className="fac-nav-sep">Faculty Portal</span>
          </div>
        </div>
        <div className="fac-nav-right">
          <div className="fac-search">
            <IconSearch size={13} color="rgba(255,255,255,.5)" />
            <span>Search...</span>
          </div>
          <div className="fac-notif">
            <IconBell size={15} color="rgba(255,255,255,.7)" />
            <span className="fac-notif-dot">2</span>
          </div>
          <div className="fac-avatar">PM</div>
        </div>
      </nav>

      <div className="fac-body">
        <aside className="fac-sidebar">
          <div className="fac-sb-user">
            <div className="fac-sb-avatar">PM</div>
            <div className="fac-sb-name">Dr. Priya Mehra</div>
            <div className="fac-sb-role">Asst. Prof · CSE</div>
          </div>
          <nav className="fac-sb-nav">
            {navItems.map(item => (
              <div
                key={item.id}
                className={`fac-sb-item ${active === item.id ? 'active' : ''}`}
                onClick={() => onNav(item.id)}
              >
                {item.icon}
                {item.label}
              </div>
            ))}
          </nav>
        </aside>
        <main className="fac-content">{children}</main>
      </div>
    </div>
  )
}

/* ══════════════════════════════
   REUSABLE KPI CARD
══════════════════════════════ */
function KPI({ val, label, iconBg, iconColor, icon, trend, trendUp, badge, badgeBg, badgeColor }) {
  return (
    <div className="fac-kpi">
      <div className="fac-kpi-top">
        <div className="fac-kpi-icon" style={{ background: iconBg, color: iconColor }}>{icon}</div>
        {badge && <span className="fac-pill" style={{ background: badgeBg, color: badgeColor }}>{badge}</span>}
      </div>
      <div className="fac-kpi-val">{val}</div>
      <div className="fac-kpi-label">{label}</div>
      {trend && <div className={`fac-kpi-trend ${trendUp ? 'up' : 'down'}`}>{trend}</div>}
    </div>
  )
}

/* ══════════════════════════════
   PAGE 1 — DASHBOARD
══════════════════════════════ */
function DashboardPage() {
  return (
    <>
      <div className="fac-page-header">
        <div>
          <div className="fac-page-title">My Dashboard</div>
          <div className="fac-page-sub">Dr. Priya Mehra · CSE Department · Wednesday, 27 May 2026</div>
        </div>
        <div className="fac-header-actions">
          <button className="fac-btn-outline"><IconDownload size={13} /> Report</button>
          <button className="fac-btn-primary"><IconMail size={13} /> Message HOD</button>
        </div>
      </div>

      <div className="fac-kpi-grid fac-kpi-4">
        <KPI val="3" label="Subjects assigned" iconBg="#eff4ff" iconColor="#2563eb" icon={<IconExams size={14} color="#2563eb" />} />
        <KPI val="282" label="Total students" iconBg="#EEEDFE" iconColor="#534AB7" icon={<IconUsers size={14} color="#534AB7" />} />
        <KPI val="86%" label="Avg class attendance" iconBg="#f0fdf4" iconColor="#059669" icon={<IconCalendarCheck size={14} color="#059669" />} badge="Good" badgeBg="#EAF3DE" badgeColor="#3B6D11" />
        <KPI val="2" label="Pending tasks" iconBg="#FAEEDA" iconColor="#854F0B" icon={<IconAlertCircle size={14} color="#854F0B" />} badge="Due" badgeBg="#FAEEDA" badgeColor="#854F0B" />
      </div>

      <div className="fac-grid-2" style={{ marginTop: 12 }}>
        {/* Today's schedule */}
        <div className="fac-card">
          <div className="fac-card-hd">
            <span className="fac-card-title">Today's schedule</span>
            <span className="fac-card-link">Full timetable</span>
          </div>
          {[
            { time: '9:00 AM', sub: 'Data Structures', room: 'Lab-3', sem: 'Sem 6', color: '#2563eb', bg: '#eff4ff' },
            { time: '11:00 AM', sub: 'SE Lab', room: 'CSE-101', sem: 'Sem 6', color: '#059669', bg: '#f0fdf4' },
            { time: '2:00 PM', sub: 'Data Structures', room: 'CSE-202', sem: 'Sem 4', color: '#2563eb', bg: '#eff4ff' },
          ].map((c, i) => (
            <div className="fac-schedule-row" key={i}>
              <div className="fac-schedule-time">{c.time}</div>
              <div className="fac-schedule-pill" style={{ background: c.bg, color: c.color }}>
                <span className="fac-schedule-sub">{c.sub}</span>
                <span className="fac-schedule-meta">{c.room} · {c.sem}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Pending tasks */}
        <div className="fac-card">
          <div className="fac-card-hd">
            <span className="fac-card-title">Pending tasks</span>
            <span className="fac-pill fac-pill-amber">2 due</span>
          </div>
          {[
            { task: 'Submit Sem-5 marks', due: 'Due today', color: '#dc2626', bg: '#fef2f2' },
            { task: 'Upload DS lecture notes', due: 'Due tomorrow', color: '#d97706', bg: '#FAEEDA' },
            { task: 'Review project submissions', due: 'Jun 2', color: '#059669', bg: '#f0fdf4' },
          ].map((t, i) => (
            <div className="fac-task-row" key={i}>
              <div className="fac-task-dot" style={{ background: t.color }} />
              <div style={{ flex: 1 }}>
                <div className="fac-task-label">{t.task}</div>
                <div className="fac-task-due" style={{ color: t.color }}>{t.due}</div>
              </div>
              <span className="fac-pill" style={{ background: t.bg, color: t.color, fontSize: 10 }}>
                {t.due}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Subject-wise attendance summary */}
      <div className="fac-card" style={{ marginTop: 12 }}>
        <div className="fac-card-hd">
          <span className="fac-card-title">Subject-wise attendance — my classes</span>
          <span className="fac-card-link">Detailed report</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {[
            ['Data Structures', 'CS601', '89%', '#2563eb', 120],
            ['Software Engg.', 'CS605', '82%', '#d97706', 120],
            ['DS Lab', 'CS601L', '91%', '#059669', 60],
          ].map(([sub, code, pct, col, stu]) => (
            <div key={sub} style={{ background: '#f4f7fc', borderRadius: 8, padding: '12px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#1a3a6e' }}>{sub}</div>
                <span className="fac-pill fac-pill-blue" style={{ fontSize: 9 }}>{code}</span>
              </div>
              <div style={{ fontSize: 11, color: '#8a94a6', marginBottom: 8 }}>{stu} students</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: col, marginBottom: 6 }}>{pct}</div>
              <div className="fac-prog-track">
                <div className="fac-prog-fill" style={{ width: pct, background: col }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

/* ══════════════════════════════
   PAGE 2 — ATTENDANCE
══════════════════════════════ */
const initialStudents = [
  { id: 1, name: 'Aashish Kumar', roll: 'CSE047', overall: 81, today: 'Present', lowAtt: false },
  { id: 2, name: 'Priya Sharma', roll: 'CSE048', overall: 74, today: 'Absent', lowAtt: true },
  { id: 3, name: 'Rohit Verma', roll: 'CSE049', overall: 88, today: 'Present', lowAtt: false },
  { id: 4, name: 'Sneha Patel', roll: 'CSE050', overall: 92, today: 'Present', lowAtt: false },
  { id: 5, name: 'Arjun Singh', roll: 'CSE051', overall: 67, today: 'Absent', lowAtt: true },
  { id: 6, name: 'Kavya Reddy', roll: 'CSE052', overall: 85, today: 'Present', lowAtt: false },
  { id: 7, name: 'Raj Patel', roll: 'CSE053', overall: 71, today: 'Present', lowAtt: true },
  { id: 8, name: 'Neha Gupta', roll: 'CSE054', overall: 78, today: 'Present', lowAtt: false },
]

function AttendancePage() {
  const [students, setStudents] = useState(initialStudents)
  const [submitted, setSubmitted] = useState(false)
  const [selSub, setSelSub] = useState('Data Structures')

  const presentCount = students.filter(s => s.today === 'Present').length
  const absentCount = students.filter(s => s.today === 'Absent').length

  const markAll = () => setStudents(students.map(s => ({ ...s, today: 'Present' })))
  const toggle = (id, status) => setStudents(students.map(s => s.id === id ? { ...s, today: status } : s))

  return (
    <>
      <div className="fac-page-header">
        <div>
          <div className="fac-page-title">Mark Attendance</div>
          <div className="fac-page-sub">CSE Sem 6 · Section A · 27 May 2026 · Lecture 3</div>
        </div>
        <div className="fac-header-actions">
          <button className="fac-btn-outline" onClick={markAll}><IconCheck size={13} /> Mark all present</button>
          <button
            className={`fac-btn-primary ${submitted ? 'submitted' : ''}`}
            onClick={() => setSubmitted(true)}
          >
            {submitted ? <><IconCheck size={13} /> Submitted</> : 'Submit Attendance'}
          </button>
        </div>
      </div>

      <div className="fac-kpi-grid fac-kpi-4" style={{ marginBottom: 14 }}>
        <KPI val={students.length} label="Total students" iconBg="#eff4ff" iconColor="#2563eb" icon={<IconUsers size={14} color="#2563eb" />} />
        <KPI val={presentCount} label="Present today" iconBg="#f0fdf4" iconColor="#059669" icon={<IconCheck size={14} color="#059669" />} />
        <KPI val={absentCount} label="Absent today" iconBg="#fef2f2" iconColor="#dc2626" icon={<IconAlertCircle size={14} color="#dc2626" />} />
        <KPI val={students.filter(s => s.lowAtt).length} label="Low attendance" iconBg="#FAEEDA" iconColor="#854F0B" icon={<IconAlertCircle size={14} color="#854F0B" />} badge="⚠" badgeBg="#FAEEDA" badgeColor="#854F0B" />
      </div>

      {/* Subject selector chips */}
      <div className="fac-chips-row" style={{ marginBottom: 14 }}>
        {['Data Structures', 'Software Engg.', 'DS Lab'].map(s => (
          <button
            key={s}
            className={`fac-chip ${selSub === s ? 'active' : ''}`}
            onClick={() => setSelSub(s)}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="fac-table-wrap">
        <div className="fac-table-header">
          <span className="fac-card-title">{selSub} — CSE Sem 6</span>
          <div className="fac-search-input">
            <IconSearch size={13} color="#aab0bc" />
            <input placeholder="Search student..." />
          </div>
        </div>
        <table className="fac-table">
          <thead>
            <tr>
              <th>#</th><th>Student</th><th>Roll no.</th>
              <th>Overall att.</th><th>Today</th><th>Mark</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, idx) => (
              <tr key={s.id} className={s.today === 'Absent' ? 'row-absent' : ''}>
                <td className="fac-row-num">{String(idx + 1).padStart(2, '0')}</td>
                <td>
                  <div className="fac-stu-cell">
                    <div className="fac-stu-av" style={{ background: '#eff4ff', color: '#2563eb' }}>
                      {s.name.split(' ').map(w => w[0]).join('')}
                    </div>
                    <span className="fac-stu-name">{s.name}</span>
                  </div>
                </td>
                <td className="fac-roll">{s.roll}</td>
                <td>
                  <span className={`fac-att-pct ${s.overall < 75 ? 'low' : 'ok'}`}>
                    {s.overall}%{s.lowAtt ? ' ⚠' : ''}
                  </span>
                </td>
                <td>
                  <span className={`fac-today-badge ${s.today === 'Present' ? 'present' : 'absent'}`}>
                    {s.today}
                  </span>
                </td>
                <td>
                  <div className="fac-pa-btns">
                    <button
                      className={`fac-pa-btn p ${s.today === 'Present' ? 'active-p' : ''}`}
                      onClick={() => toggle(s.id, 'Present')}
                    >P</button>
                    <button
                      className={`fac-pa-btn a ${s.today === 'Absent' ? 'active-a' : ''}`}
                      onClick={() => toggle(s.id, 'Absent')}
                    >A</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {submitted && (
        <div className="fac-submit-success">
          <IconCheck size={16} color="#059669" />
          Attendance submitted for {selSub} · Lecture 3 · {presentCount} present, {absentCount} absent
        </div>
      )}
    </>
  )
}

/* ══════════════════════════════
   PAGE 3 — MARKS ENTRY
══════════════════════════════ */
function MarksPage() {
  const [marks, setMarks] = useState([
    { id: 1, name: 'Aashish Kumar', roll: 'CSE047', mid: 38, assign: 18, total: null },
    { id: 2, name: 'Priya Sharma', roll: 'CSE048', mid: 32, assign: 16, total: null },
    { id: 3, name: 'Rohit Verma', roll: 'CSE049', mid: 40, assign: 19, total: null },
    { id: 4, name: 'Sneha Patel', roll: 'CSE050', mid: 42, assign: 20, total: null },
    { id: 5, name: 'Arjun Singh', roll: 'CSE051', mid: 28, assign: 12, total: null },
    { id: 6, name: 'Kavya Reddy', roll: 'CSE052', mid: 44, assign: 20, total: null },
  ])
  const [saved, setSaved] = useState(false)

  const update = (id, field, val) => {
    setMarks(marks.map(m => m.id === id ? { ...m, [field]: Number(val) } : m))
  }

  const grade = (t) => {
    if (t == null) return '—'
    if (t >= 90) return 'O'
    if (t >= 75) return 'A+'
    if (t >= 60) return 'A'
    if (t >= 50) return 'B+'
    if (t >= 40) return 'B'
    return 'F'
  }

  const gradeColor = (t) => {
    if (t == null) return '#aab0bc'
    if (t >= 75) return '#059669'
    if (t >= 50) return '#d97706'
    return '#dc2626'
  }

  return (
    <>
      <div className="fac-page-header">
        <div>
          <div className="fac-page-title">Marks Entry</div>
          <div className="fac-page-sub">Data Structures · CS601 · CSE Sem 6 · Sem 5 Examination</div>
        </div>
        <div className="fac-header-actions">
          <button className="fac-btn-outline"><IconDownload size={13} /> Export</button>
          <button className="fac-btn-primary" onClick={() => setSaved(true)}>
            <IconCheck size={13} /> {saved ? 'Saved' : 'Save Marks'}
          </button>
        </div>
      </div>

      <div className="fac-kpi-grid fac-kpi-4" style={{ marginBottom: 14 }}>
        <KPI val="6" label="Total students" iconBg="#eff4ff" iconColor="#2563eb" icon={<IconUsers size={14} color="#2563eb" />} />
        <KPI val="37" label="Class avg (mid)" iconBg="#EEEDFE" iconColor="#534AB7" icon={<IconExams size={14} color="#534AB7" />} />
        <KPI val="1" label="Below passing" iconBg="#fef2f2" iconColor="#dc2626" icon={<IconAlertCircle size={14} color="#dc2626" />} />
        <KPI val="2" label="Outstanding (O)" iconBg="#f0fdf4" iconColor="#059669" icon={<IconReports size={14} color="#059669" />} />
      </div>

      <div className="fac-table-wrap">
        <div className="fac-table-header">
          <span className="fac-card-title">Enter marks — Data Structures (Max: Mid 50 · Assignment 20)</span>
          <select className="fac-select">
            <option>Semester 5 Exam</option>
            <option>Mid-term</option>
            <option>Assignment 1</option>
          </select>
        </div>
        <table className="fac-table">
          <thead>
            <tr>
              <th>Student</th><th>Roll</th>
              <th>Mid-term <small style={{ fontWeight: 400 }}>/50</small></th>
              <th>Assignment <small style={{ fontWeight: 400 }}>/20</small></th>
              <th>Total <small style={{ fontWeight: 400 }}>/70</small></th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            {marks.map(m => {
              const t = m.mid + m.assign
              return (
                <tr key={m.id}>
                  <td>
                    <div className="fac-stu-cell">
                      <div className="fac-stu-av" style={{ background: '#EEEDFE', color: '#534AB7' }}>
                        {m.name.split(' ').map(w => w[0]).join('')}
                      </div>
                      <span className="fac-stu-name">{m.name}</span>
                    </div>
                  </td>
                  <td className="fac-roll">{m.roll}</td>
                  <td>
                    <input
                      type="number" min="0" max="50"
                      className="fac-marks-input"
                      value={m.mid}
                      onChange={e => update(m.id, 'mid', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number" min="0" max="20"
                      className="fac-marks-input"
                      value={m.assign}
                      onChange={e => update(m.id, 'assign', e.target.value)}
                    />
                  </td>
                  <td style={{ fontWeight: 700, color: gradeColor(t) }}>{t}</td>
                  <td>
                    <span
                      className="fac-pill"
                      style={{
                        background: t >= 75 ? '#EAF3DE' : t >= 50 ? '#FAEEDA' : '#fef2f2',
                        color: gradeColor(t),
                        fontWeight: 700,
                      }}
                    >{grade(t)}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {saved && (
        <div className="fac-submit-success">
          <IconCheck size={16} color="#059669" />
          Marks saved for Data Structures · CS601 — awaiting HOD review
        </div>
      )}
    </>
  )
}

/* ══════════════════════════════
   PAGE 4 — LMS
══════════════════════════════ */
function LMSPage() {
  return (
    <>
      <div className="fac-page-header">
        <div>
          <div className="fac-page-title">Learning Management</div>
          <div className="fac-page-sub">Upload resources, assignments & announcements</div>
        </div>
        <div className="fac-header-actions">
          <button className="fac-btn-primary"><IconPlus size={13} /> Upload Resource</button>
        </div>
      </div>

      <div className="fac-grid-2">
        {/* Upload zone */}
        <div className="fac-card">
          <div className="fac-card-hd"><span className="fac-card-title">Upload study material</span></div>
          <div className="fac-upload-zone">
            <IconDownload size={28} color="#2563eb" />
            <div style={{ fontWeight: 600, color: '#1a3a6e', marginTop: 8 }}>Drop files here</div>
            <div style={{ fontSize: 11, color: '#8a94a6', marginTop: 4 }}>PDF, PPT, DOC up to 50 MB</div>
            <button className="fac-btn-outline" style={{ marginTop: 12, fontSize: 12 }}>Choose file</button>
          </div>
        </div>

        {/* Recent uploads */}
        <div className="fac-card">
          <div className="fac-card-hd">
            <span className="fac-card-title">Recent uploads</span>
            <span className="fac-card-link">View all</span>
          </div>
          {[
            { name: 'DS Unit-4 Notes.pdf', sub: 'Data Structures', date: 'Today', size: '2.1 MB', color: '#dc2626' },
            { name: 'SE Assignment-2.docx', sub: 'Software Engg.', date: 'Yesterday', size: '340 KB', color: '#2563eb' },
            { name: 'DS Lab Manual.pdf', sub: 'DS Lab', date: '3 days ago', size: '5.4 MB', color: '#dc2626' },
            { name: 'Graph Algo Slides.pptx', sub: 'Data Structures', date: '1 week ago', size: '8.2 MB', color: '#d97706' },
          ].map((f, i) => (
            <div className="fac-file-row" key={i}>
              <div className="fac-file-icon" style={{ background: `${f.color}18`, color: f.color }}>
                <IconExams size={14} color={f.color} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="fac-file-name">{f.name}</div>
                <div className="fac-file-meta">{f.sub} · {f.date} · {f.size}</div>
              </div>
              <button className="fac-btn-outline" style={{ padding: '4px 8px', fontSize: 11, flexShrink: 0 }}>
                <IconDownload size={11} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Assignments */}
      <div className="fac-card" style={{ marginTop: 12 }}>
        <div className="fac-card-hd">
          <span className="fac-card-title">Assignments</span>
          <button className="fac-btn-primary" style={{ fontSize: 11, padding: '5px 10px' }}>
            <IconPlus size={12} /> New assignment
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
          {[
            { title: 'Assignment 2 — Sorting', sub: 'Data Structures', due: 'Jun 1', sub_count: 38, total: 42, color: '#2563eb', bg: '#eff4ff' },
            { title: 'Case Study — SDLC', sub: 'Software Engg.', due: 'Jun 5', sub_count: 20, total: 42, color: '#d97706', bg: '#FAEEDA' },
            { title: 'Lab Record', sub: 'DS Lab', due: 'Jun 3', sub_count: 42, total: 42, color: '#059669', bg: '#f0fdf4' },
          ].map((a, i) => (
            <div key={i} style={{ background: a.bg, borderRadius: 10, padding: '12px 14px' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#1a3a6e', marginBottom: 2 }}>{a.title}</div>
              <div style={{ fontSize: 11, color: '#6b7a99', marginBottom: 8 }}>{a.sub} · Due {a.due}</div>
              <div style={{ fontSize: 11, color: a.color, fontWeight: 600 }}>
                {a.sub_count}/{a.total} submitted
              </div>
              <div className="fac-prog-track" style={{ marginTop: 6 }}>
                <div className="fac-prog-fill" style={{ width: `${(a.sub_count / a.total) * 100}%`, background: a.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

/* ══════════════════════════════
   PAGE 5 — TIMETABLE
══════════════════════════════ */
function TimetablePage() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  const slots = ['9:00', '10:00', '11:00', '12:00', '2:00', '3:00', '4:00']

  const schedule = {
    Monday: ['DS-Sem6', 'SE-Sem6', '—', 'FREE', 'DS-Sem4', '—', 'FREE'],
    Tuesday: ['FREE', 'DS-Sem6', 'SE-Sem6', '—', 'FREE', 'DSL-Sem6', 'FREE'],
    Wednesday: ['SE-Sem6', '—', 'DS-Sem6', 'FREE', '—', 'DS-Sem4', 'FREE'],
    Thursday: ['DS-Sem4', 'FREE', '—', 'DS-Sem6', 'SE-Sem6', '—', 'FREE'],
    Friday: ['FREE', 'DS-Sem6', '—', 'SE-Sem6', '—', 'DS-Sem4', 'DSL-Sem6'],
  }

  const colors = {
    'DS-Sem6': { bg: '#eff4ff', col: '#2563eb', label: 'DS · Sem 6' },
    'SE-Sem6': { bg: '#FAEEDA', col: '#854F0B', label: 'SE · Sem 6' },
    'DS-Sem4': { bg: '#EEEDFE', col: '#534AB7', label: 'DS · Sem 4' },
    'DSL-Sem6': { bg: '#f0fdf4', col: '#059669', label: 'DS Lab · S6' },
    'FREE': { bg: '#f7f9fd', col: '#aab0bc', label: 'Free period' },
    '—': null,
  }

  return (
    <>
      <div className="fac-page-header">
        <div>
          <div className="fac-page-title">My Timetable</div>
          <div className="fac-page-sub">AY 2025–26 · Semester 6 schedule</div>
        </div>
        <div className="fac-header-actions">
          <button className="fac-btn-outline"><IconDownload size={13} /> Export PDF</button>
        </div>
      </div>

      <div className="fac-card" style={{ overflowX: 'auto' }}>
        <table className="fac-table fac-tt-table">
          <thead>
            <tr>
              <th style={{ width: 90 }}>Day</th>
              {slots.map(s => <th key={s}>{s}</th>)}
            </tr>
          </thead>
          <tbody>
            {days.map(day => (
              <tr key={day}>
                <td style={{ fontWeight: 600, color: '#1a3a6e', fontSize: 12 }}>{day}</td>
                {schedule[day].map((cell, ci) => {
                  const c = colors[cell]
                  return (
                    <td key={ci} style={{ padding: 6 }}>
                      {c ? (
                        <div style={{
                          background: c.bg, color: c.col,
                          borderRadius: 6, padding: '6px 8px',
                          fontSize: 10, fontWeight: 600, textAlign: 'center',
                        }}>
                          {c.label}
                        </div>
                      ) : (
                        <div style={{ textAlign: 'center', color: '#e8ecf4', fontSize: 16 }}>—</div>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

/* ══════════════════════════════
   PAGE 6 — MY STUDENTS
══════════════════════════════ */
function StudentsPage() {
  return (
    <>
      <div className="fac-page-header">
        <div>
          <div className="fac-page-title">My Students</div>
          <div className="fac-page-sub">282 students across 3 subjects</div>
        </div>
        <div className="fac-header-actions">
          <button className="fac-btn-outline"><IconDownload size={13} /> Export</button>
          <button className="fac-btn-outline"><IconFilter size={13} /> Filter</button>
        </div>
      </div>

      <div className="fac-kpi-grid fac-kpi-4" style={{ marginBottom: 14 }}>
        <KPI val="282" label="Total students" iconBg="#eff4ff" iconColor="#2563eb" icon={<IconUsers size={14} color="#2563eb" />} />
        <KPI val="4" label="Low attendance" iconBg="#fef2f2" iconColor="#dc2626" icon={<IconCalendarCheck size={14} color="#dc2626" />} />
        <KPI val="3" label="Backlog students" iconBg="#FAEEDA" iconColor="#854F0B" icon={<IconAlertCircle size={14} color="#854F0B" />} />
        <KPI val="8.1" label="Avg CGPA (DS)" iconBg="#f0fdf4" iconColor="#059669" icon={<IconReports size={14} color="#059669" />} />
      </div>

      <div className="fac-table-wrap">
        <div className="fac-table-header">
          <span className="fac-card-title">Student list — Data Structures · Sem 6</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <div className="fac-search-input">
              <IconSearch size={13} color="#aab0bc" />
              <input placeholder="Search student..." />
            </div>
            <select className="fac-select">
              <option>Data Structures</option>
              <option>Software Engg.</option>
              <option>DS Lab</option>
            </select>
          </div>
        </div>
        <table className="fac-table">
          <thead>
            <tr>
              <th>Student</th><th>Roll</th><th>Attendance</th>
              <th>Mid-term</th><th>CGPA</th><th>Backlog</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              { n: 'Aashish Kumar', roll: 'CSE047', att: 81, mid: 38, cgpa: 8.4, backlog: 0, status: 'Active' },
              { n: 'Priya Sharma', roll: 'CSE048', att: 74, mid: 32, cgpa: 7.9, backlog: 1, status: 'Active' },
              { n: 'Rohit Verma', roll: 'CSE049', att: 88, mid: 40, cgpa: 8.1, backlog: 0, status: 'Active' },
              { n: 'Sneha Patel', roll: 'CSE050', att: 92, mid: 42, cgpa: 9.2, backlog: 0, status: 'Active' },
              { n: 'Arjun Singh', roll: 'CSE051', att: 67, mid: 28, cgpa: 6.8, backlog: 2, status: 'Risk' },
              { n: 'Kavya Reddy', roll: 'CSE052', att: 85, mid: 44, cgpa: 9.4, backlog: 0, status: 'Active' },
            ].map((s, i) => (
              <tr key={i}>
                <td>
                  <div className="fac-stu-cell">
                    <div className="fac-stu-av" style={{ background: '#eff4ff', color: '#2563eb' }}>
                      {s.n.split(' ').map(w => w[0]).join('')}
                    </div>
                    <div>
                      <div className="fac-stu-name">{s.n}</div>
                      <div className="fac-stu-id">{s.roll}</div>
                    </div>
                  </div>
                </td>
                <td style={{ color: '#6b7a99', fontSize: 11 }}>{s.roll}</td>
                <td style={{ fontWeight: 600, color: s.att < 75 ? '#dc2626' : '#059669' }}>
                  {s.att}%{s.att < 75 ? ' ⚠' : ''}
                </td>
                <td style={{ fontWeight: 600 }}>{s.mid}/50</td>
                <td style={{ fontWeight: 600 }}>{s.cgpa}</td>
                <td>
                  {s.backlog > 0
                    ? <span className="fac-pill fac-pill-red">{s.backlog} subject{s.backlog > 1 ? 's' : ''}</span>
                    : <span className="fac-pill fac-pill-green">Clear</span>
                  }
                </td>
                <td>
                  <span className={s.status === 'Active' ? 'fac-pill fac-pill-green' : 'fac-pill fac-pill-red'}>
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

/* ══════════════════════════════
   PAGE 7 — APPRAISAL
══════════════════════════════ */
function AppraisalPage() {
  return (
    <>
      <div className="fac-page-header">
        <div>
          <div className="fac-page-title">My Appraisal</div>
          <div className="fac-page-sub">AY 2025–26 · Self-assessment & HOD review</div>
        </div>
        <div className="fac-header-actions">
          <button className="fac-btn-primary"><IconDownload size={13} /> Download Report</button>
        </div>
      </div>

      <div className="fac-kpi-grid fac-kpi-4" style={{ marginBottom: 14 }}>
        <KPI val="4.6" label="Student feedback" iconBg="#eff4ff" iconColor="#2563eb" icon={<IconReports size={14} color="#2563eb" />} badge="/5" badgeBg="#eff4ff" badgeColor="#2563eb" />
        <KPI val="18h" label="Weekly teaching hrs" iconBg="#EEEDFE" iconColor="#534AB7" icon={<IconCalendarCheck size={14} color="#534AB7" />} />
        <KPI val="3" label="Research papers" iconBg="#f0fdf4" iconColor="#059669" icon={<IconLibrary size={14} color="#059669" />} trend="↑ 1 this year" trendUp />
        <KPI val="94%" label="Class completion" iconBg="#EAF3DE" iconColor="#3B6D11" icon={<IconCheck size={14} color="#3B6D11" />} />
      </div>

      <div className="fac-grid-2">
        {/* Performance bars */}
        <div className="fac-card">
          <div className="fac-card-hd"><span className="fac-card-title">Performance metrics</span></div>
          {[
            ['Teaching effectiveness', '92%', '#2563eb'],
            ['Student engagement', '88%', '#059669'],
            ['Punctuality', '95%', '#059669'],
            ['Research contribution', '72%', '#d97706'],
            ['Admin compliance', '85%', '#2563eb'],
          ].map(([label, val, col]) => (
            <div className="fac-bar-row" key={label}>
              <span className="fac-bar-label">{label}</span>
              <div className="fac-bar-track">
                <div className="fac-bar-fill" style={{ width: val, background: col }} />
              </div>
              <span className="fac-bar-pct" style={{ color: col }}>{val}</span>
            </div>
          ))}
        </div>

        {/* HOD comments */}
        <div className="fac-card">
          <div className="fac-card-hd"><span className="fac-card-title">HOD remarks</span></div>
          <div style={{ background: '#f4f7fc', borderRadius: 8, padding: '12px 14px', fontSize: 12, color: '#1a3a6e', lineHeight: 1.6, marginBottom: 12 }}>
            "Dr. Mehra consistently delivers high-quality lectures. Student feedback is excellent. Encouraged to submit 1 more research paper this academic year."
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 11, color: '#8a94a6' }}>Reviewed by Dr. Rajesh Kumar · 20 May 2026</div>
            <span className="fac-pill fac-pill-green">Approved</span>
          </div>
        </div>
      </div>
    </>
  )
}

/* ══════════════════════════════
   PAGE 8 — LEAVE
══════════════════════════════ */
function LeavePage() {
  const [form, setForm] = useState({ type: 'Casual Leave', from: '', to: '', reason: '' })
  const [applied, setApplied] = useState(false)

  return (
    <>
      <div className="fac-page-header">
        <div>
          <div className="fac-page-title">Leave Management</div>
          <div className="fac-page-sub">Apply and track your leave requests</div>
        </div>
      </div>

      <div className="fac-kpi-grid fac-kpi-4" style={{ marginBottom: 14 }}>
        <KPI val="12" label="Casual leave left" iconBg="#f0fdf4" iconColor="#059669" icon={<IconCheck size={14} color="#059669" />} />
        <KPI val="5" label="Medical leave left" iconBg="#eff4ff" iconColor="#2563eb" icon={<IconAlertCircle size={14} color="#2563eb" />} />
        <KPI val="3" label="Availed this year" iconBg="#FAEEDA" iconColor="#854F0B" icon={<IconCalendarCheck size={14} color="#854F0B" />} />
        <KPI val="1" label="Pending approval" iconBg="#fef2f2" iconColor="#dc2626" icon={<IconAlertCircle size={14} color="#dc2626" />} />
      </div>

      <div className="fac-grid-2">
        {/* Apply form */}
        <div className="fac-card">
          <div className="fac-card-hd"><span className="fac-card-title">Apply for leave</span></div>
          <div className="fac-leave-form">
            <div className="fac-settings-row">
              <div className="fac-settings-label">Leave type</div>
              <select className="fac-select" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                <option>Casual Leave</option>
                <option>Medical Leave</option>
                <option>Earned Leave</option>
                <option>On Duty</option>
              </select>
            </div>
            <div className="fac-settings-row">
              <div className="fac-settings-label">From date</div>
              <input className="fac-input" type="date" value={form.from} onChange={e => setForm({ ...form, from: e.target.value })} />
            </div>
            <div className="fac-settings-row">
              <div className="fac-settings-label">To date</div>
              <input className="fac-input" type="date" value={form.to} onChange={e => setForm({ ...form, to: e.target.value })} />
            </div>
            <div className="fac-settings-row" style={{ alignItems: 'flex-start' }}>
              <div className="fac-settings-label" style={{ paddingTop: 6 }}>Reason</div>
              <textarea
                className="fac-input fac-textarea"
                rows={3}
                placeholder="Brief reason for leave..."
                value={form.reason}
                onChange={e => setForm({ ...form, reason: e.target.value })}
              />
            </div>
            <button
              className={`fac-btn-primary ${applied ? 'submitted' : ''}`}
              style={{ marginTop: 4, width: '100%', justifyContent: 'center' }}
              onClick={() => setApplied(true)}
            >
              {applied ? <><IconCheck size={13} /> Applied</> : 'Apply for Leave'}
            </button>
          </div>
        </div>

        {/* Leave history */}
        <div className="fac-card">
          <div className="fac-card-hd"><span className="fac-card-title">Leave history</span></div>
          <table className="fac-table" style={{ fontSize: 11 }}>
            <thead><tr><th>Type</th><th>Dates</th><th>Days</th><th>Status</th></tr></thead>
            <tbody>
              {[
                { type: 'Casual', from: 'Mar 14', to: 'Mar 15', days: 2, status: 'Approved' },
                { type: 'Medical', from: 'Feb 8', to: 'Feb 9', days: 2, status: 'Approved' },
                { type: 'On Duty', from: 'Jan 22', to: 'Jan 22', days: 1, status: 'Approved' },
                { type: 'Casual', from: 'Jun 3', to: 'Jun 3', days: 1, status: 'Pending' },
              ].map((l, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{l.type}</td>
                  <td style={{ color: '#6b7a99' }}>{l.from} – {l.to}</td>
                  <td style={{ fontWeight: 600 }}>{l.days}d</td>
                  <td>
                    <span className={l.status === 'Approved' ? 'fac-pill fac-pill-green' : 'fac-pill fac-pill-amber'}>
                      {l.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

/* ══════════════════════════════
   PAGE 9 — Assessments
══════════════════════════════ */

function AssessmentsPage() {
  return (
    <>
      <div className="fac-page-header">
        <div>
          <div className="fac-page-title">Assessments</div>
          <div className="fac-page-sub">
            Create quizzes, assignments and online tests
          </div>
        </div>

        <div className="fac-header-actions">
          <button className="fac-btn-primary">
            <IconPlus size={13} /> Create Assessment
          </button>
        </div>
      </div>

      <div className="fac-card">
        <h3>Assessment Management</h3>
        <p>Create quizzes, assignments and online exams.</p>
      </div>
    </>
  )
}

/* ══════════════════════════════
   PAGE 10 — Reports
══════════════════════════════ */
function ReportsPage() {
  return (
    <>
      <div className="fac-page-header">
        <div>
          <div className="fac-page-title">Reports</div>
          <div className="fac-page-sub">
            Attendance, marks and performance reports
          </div>
        </div>

        <div className="fac-header-actions">
          <button className="fac-btn-outline">
            <IconDownload size={13}/> Export PDF
          </button>
        </div>
      </div>

      <div className="fac-card">
        <h3>Faculty Reports</h3>
        <p>Generate attendance, marks and student reports.</p>
      </div>
    </>
  )
}

/* ══════════════════════════════
   PAGE 11 — Communication
══════════════════════════════ */
function CommunicationPage() {
  return (
    <>
      <div className="fac-page-header">
        <div>
          <div className="fac-page-title">Communication</div>
          <div className="fac-page-sub">
            Send notices and announcements
          </div>
        </div>

        <div className="fac-header-actions">
          <button className="fac-btn-primary">
            <IconMail size={13}/> New Message
          </button>
        </div>
      </div>

      <div className="fac-card">
        <h3>Communication Hub</h3>
        <p>Send notices, announcements and messages to students.</p>
      </div>
    </>
  )
}

/* ══════════════════════════════
   PAGE 12 —  Profile
══════════════════════════════ */
function ProfilePage() {
  return (
    <>
      <div className="fac-page-header">
        <div>
          <div className="fac-page-title">My Profile</div>
          <div className="fac-page-sub">
            Faculty information
          </div>
        </div>

        <div className="fac-header-actions">
          <button className="fac-btn-primary">
            <IconEdit size={13}/> Edit Profile
          </button>
        </div>
      </div>

      <div className="fac-card">
        <h3>Faculty Profile</h3>
        <p>Manage personal details, qualification and department.</p>
      </div>
    </>
  )
}

/* ══════════════════════════════
   PAGE 13 —  Settings
══════════════════════════════ */
function SettingsPage() {
  return (
    <>
      <div className="fac-page-header">
        <div>
          <div className="fac-page-title">Settings</div>
          <div className="fac-page-sub">
            Account preferences
          </div>
        </div>
      </div>

      <div className="fac-card">
        <h3>Settings</h3>
        <p>Manage password, notifications and account settings.</p>
      </div>
    </>
  )
}
/* ══════════════════════════════
   MAIN EXPORT
══════════════════════════════ */
export default function FacultyPortal() {
  const [activePage, setActivePage] = useState('dashboard')

  const pages = {
    dashboard: <DashboardPage />,
    attendance: <AttendancePage />,
    marks: <MarksPage />,
    lms: <LMSPage />,
    assessments: <AssessmentsPage />,
    timetable: <TimetablePage />,
    students: <StudentsPage />,
    reports: <ReportsPage />,
    communication: <CommunicationPage />,
    appraisal: <AppraisalPage />,
    leave: <LeavePage />,
    profile: <ProfilePage />,
    settings: <SettingsPage />,
  }
  return (
    <Shell active={activePage} onNav={setActivePage}>
      {pages[activePage]}
    </Shell>
  )
}