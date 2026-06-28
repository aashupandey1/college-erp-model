import { useState } from 'react'
import './HODDashboard.css'
import {
  IconDashboard, IconUsers, IconSchool, IconCalendarCheck,
  IconExams, IconCoin, IconReports, IconSettings,
  IconSearch, IconBell, IconPlus, IconDownload,
  IconEdit, IconCheck, IconFilter,
} from '../../components/Icons'
import logo from "../../assets/logo.png";

/* ══════════════════════════════
   NAV CONFIG
══════════════════════════════ */
const navItems = [
  { id: 'dashboard',  label: 'Dashboard',        icon: <IconDashboard />     },
  { id: 'faculty',    label: 'Faculty',           icon: <IconSchool />        },
  { id: 'students',   label: 'Students',          icon: <IconUsers />         },
  { id: 'attendance', label: 'Attendance',        icon: <IconCalendarCheck /> },
  { id: 'subjects',   label: 'Subject Allocation',icon: <IconExams />         },
  { id: 'timetable',  label: 'Timetable',         icon: <IconCalendarCheck /> },
  { id: 'results',    label: 'Result Analytics',  icon: <IconReports />       },
  { id: 'reports',    label: 'Reports',           icon: <IconDownload />      },
  { id: 'settings',   label: 'Settings',          icon: <IconSettings />      },
]

/* ══════════════════════════════
   SHELL
══════════════════════════════ */
function Shell({ active, onNav, children }) {
  return (
    <div className="hod-page">
      <nav className="hod-navbar">
        <div className="hod-nav-left">
          <div className="hod-nav-icon">
            <img src={logo} alt="Logo" />
          </div>
          <div className="hod-nav-text">
            <span className="hod-nav-title">COLLEGE ERP</span>
            <span className="hod-nav-sep">HOD Panel</span>
          </div>
        </div>
        <div className="hod-nav-right">
          <div className="hod-search">
            <IconSearch size={13} color="rgba(255,255,255,.5)" />
            <span>Search...</span>
          </div>
          <div className="hod-notif">
            <IconBell size={15} color="rgba(255,255,255,.7)" />
            <span className="hod-notif-dot">3</span>
          </div>
          <div className="hod-avatar">DR</div>
        </div>
      </nav>

      <div className="hod-body">
        <aside className="hod-sidebar">
          <div className="hod-sb-user">
            <div className="hod-sb-avatar">DR</div>
            <div className="hod-sb-name">Dr. Rajesh Kumar</div>
            <div className="hod-sb-role">HOD · CSE Department</div>
          </div>
          <nav className="hod-sb-nav">
            {navItems.map(item => (
              <div
                key={item.id}
                className={`hod-sb-item ${active === item.id ? 'active' : ''}`}
                onClick={() => onNav(item.id)}
              >
                {item.icon}
                {item.label}
              </div>
            ))}
          </nav>
        </aside>
        <main className="hod-content">{children}</main>
      </div>
    </div>
  )
}

/* ══════════════════════════════
   REUSABLE KPI CARD
══════════════════════════════ */
function KPI({ val, label, iconBg, iconColor, icon, trend, trendUp, badge, badgeBg, badgeColor }) {
  return (
    <div className="hod-kpi">
      <div className="hod-kpi-top">
        <div className="hod-kpi-icon" style={{ background: iconBg, color: iconColor }}>{icon}</div>
        {badge && <span className="hod-pill" style={{ background: badgeBg, color: badgeColor }}>{badge}</span>}
      </div>
      <div className="hod-kpi-val">{val}</div>
      <div className="hod-kpi-label">{label}</div>
      {trend && <div className={`hod-kpi-trend ${trendUp ? 'up' : 'down'}`}>{trend}</div>}
    </div>
  )
}

/* ══════════════════════════════
   PAGE 1 — DASHBOARD
══════════════════════════════ */
function DashboardPage() {
  return (
    <>
      <div className="hod-page-header">
        <div>
          <div className="hod-page-title">HOD Dashboard</div>
          <div className="hod-page-sub">CSE Department · Wednesday, 27 May 2026 · Sem 6</div>
        </div>
        <div className="hod-header-actions">
          <button className="hod-btn-outline"><IconDownload size={13} /> Report</button>
          <button className="hod-btn-primary"><IconPlus size={13} /> Add Notice</button>
        </div>
      </div>

      {/* KPI Row 1 */}
      <div className="hod-kpi-grid hod-kpi-4">
        <KPI val="342" label="CSE Students" iconBg="#eff4ff" iconColor="#2563eb" icon={<IconUsers size={14} color="#2563eb" />} trend="↑ 18 this year" trendUp />
        <KPI val="18"  label="Faculty members" iconBg="#EEEDFE" iconColor="#534AB7" icon={<IconSchool size={14} color="#534AB7" />} />
        <KPI val="86%" label="Avg attendance" iconBg="#f0fdf4" iconColor="#059669" icon={<IconCalendarCheck size={14} color="#059669" />} badge="Good" badgeBg="#EAF3DE" badgeColor="#3B6D11" />
        <KPI val="7"   label="Pending approvals" iconBg="#FAEEDA" iconColor="#854F0B" icon={<IconExams size={14} color="#854F0B" />} badge="Action" badgeBg="#FAEEDA" badgeColor="#854F0B" />
      </div>

      {/* KPI Row 2 */}
      <div className="hod-kpi-grid hod-kpi-4" style={{ marginBottom: 14 }}>
        <KPI val="12"  label="Subjects this sem" iconBg="#eff4ff" iconColor="#2563eb" icon={<IconExams size={14} color="#2563eb" />} />
        <KPI val="8.2" label="Avg CGPA (CSE)" iconBg="#f0fdf4" iconColor="#059669" icon={<IconReports size={14} color="#059669" />} trend="↑ 0.3 vs last sem" trendUp />
        <KPI val="4"   label="Low attendance (<75%)" iconBg="#fef2f2" iconColor="#dc2626" icon={<IconCalendarCheck size={14} color="#dc2626" />} />
        <KPI val="89%" label="CSE Placement rate" iconBg="#EAF3DE" iconColor="#3B6D11" icon={<IconReports size={14} color="#3B6D11" />} />
      </div>

      <div className="hod-grid-2">
        {/* Faculty workload */}
        <div className="hod-card">
          <div className="hod-card-hd">
            <span className="hod-card-title">Faculty workload</span>
            <span className="hod-card-link">View all</span>
          </div>
          {[
            ['Dr. Priya Mehra',  3, 18, '#2563eb'],
            ['Prof. Rajan S.',   2, 12, '#059669'],
            ['Dr. Anita Singh',  4, 22, '#d97706'],
            ['Mr. Vivek Gupta',  3, 16, '#2563eb'],
            ['Dr. Sunita Rao',   2, 10, '#059669'],
          ].map(([name, sub, hrs, col]) => (
            <div className="hod-bar-row" key={name}>
              <span className="hod-bar-label">{name}</span>
              <div className="hod-bar-track">
                <div className="hod-bar-fill" style={{ width: `${(hrs / 24) * 100}%`, background: col }} />
              </div>
              <span className="hod-bar-pct" style={{ color: col }}>{hrs}h/wk</span>
            </div>
          ))}
        </div>

        {/* Pending approvals */}
        <div className="hod-card">
          <div className="hod-card-hd">
            <span className="hod-card-title">Pending approvals</span>
            <span className="hod-card-link">View all</span>
          </div>
          {[
            { type: 'Leave request',      from: 'Mr. Vivek Gupta',  date: 'Today',       color: '#d97706' },
            { type: 'Timetable change',   from: 'Dr. Priya Mehra',  date: 'Yesterday',   color: '#2563eb' },
            { type: 'Attendance edit',    from: 'Prof. Rajan S.',   date: '2 days ago',  color: '#7c3aed' },
            { type: 'Subject allocation', from: 'Dr. Anita Singh',  date: '3 days ago',  color: '#059669' },
          ].map((a, i) => (
            <div className="hod-activity-item" key={i}>
              <div className="hod-activity-dot" style={{ background: a.color }} />
              <div style={{ flex: 1 }}>
                <div className="hod-activity-text">{a.type} — {a.from}</div>
                <div className="hod-activity-time">{a.date}</div>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                <button className="hod-btn-success"><IconCheck size={12} /></button>
                <button className="hod-btn-danger" style={{ fontSize: 11 }}>✕</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sem-wise attendance chart */}
      <div className="hod-card" style={{ marginTop: 12 }}>
        <div className="hod-card-hd">
          <span className="hod-card-title">Subject-wise attendance — CSE Sem 6</span>
          <span className="hod-card-link">Full report</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {[
            ['Data Structures', '89%', '#2563eb'],
            ['OS',              '82%', '#2563eb'],
            ['DBMS',            '68%', '#dc2626'],
            ['CN',              '85%', '#2563eb'],
            ['SE',              '79%', '#d97706'],
            ['Project',         '91%', '#059669'],
          ].map(([sub, pct, col]) => (
            <div key={sub} style={{ background: '#f4f7fc', borderRadius: 8, padding: '10px 12px' }}>
              <div style={{ fontSize: 11, color: '#6b7a99', marginBottom: 4 }}>{sub}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: col }}>{pct}</div>
              <div className="hod-prog-track">
                <div className="hod-prog-fill" style={{ width: pct, background: col }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

/* ══════════════════════════════
   PAGE 2 — FACULTY MONITORING
══════════════════════════════ */
function FacultyPage() {
  return (
    <>
      <div className="hod-page-header">
        <div>
          <div className="hod-page-title">Faculty Monitoring</div>
          <div className="hod-page-sub">CSE Department · 18 faculty members</div>
        </div>
        <div className="hod-header-actions">
          <button className="hod-btn-outline"><IconDownload size={13} /> Export</button>
          <button className="hod-btn-primary"><IconPlus size={13} /> Add Faculty</button>
        </div>
      </div>

      <div className="hod-kpi-grid hod-kpi-4" style={{ marginBottom: 14 }}>
        <KPI val="18"  label="Total faculty"    iconBg="#eff4ff"  iconColor="#2563eb" icon={<IconSchool size={14} color="#2563eb" />} />
        <KPI val="15"  label="Active today"     iconBg="#f0fdf4"  iconColor="#059669" icon={<IconCheck  size={14} color="#059669" />} />
        <KPI val="2"   label="On leave"         iconBg="#FAEEDA"  iconColor="#854F0B" icon={<IconFilter size={14} color="#854F0B" />} />
        <KPI val="4.3" label="Avg hrs/week"     iconBg="#EEEDFE"  iconColor="#534AB7" icon={<IconReports size={14} color="#534AB7" />} />
      </div>

      <div className="hod-table-wrap">
        <div className="hod-table-header">
          <span className="hod-card-title">All CSE Faculty</span>
          <div className="hod-search-input">
            <IconSearch size={13} color="#aab0bc" />
            <input placeholder="Search faculty..." />
          </div>
        </div>
        <table className="hod-table">
          <thead>
            <tr>
              <th>Faculty</th><th>Designation</th><th>Subjects</th>
              <th>Hrs/week</th><th>Students</th><th>Feedback</th><th>Status</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'Dr. Priya Mehra',   id: 'FAC-001', desig: 'Asst. Prof',   sub: 3, hrs: 18, stu: 120, fb: '4.6/5', status: 'Active' },
              { name: 'Prof. Rajan Sharma',id: 'FAC-002', desig: 'Professor',     sub: 2, hrs: 12, stu: 80,  fb: '4.8/5', status: 'Active' },
              { name: 'Dr. Anita Singh',   id: 'FAC-003', desig: 'Asst. Prof',   sub: 4, hrs: 22, stu: 160, fb: '4.4/5', status: 'Active' },
              { name: 'Mr. Vivek Gupta',   id: 'FAC-004', desig: 'Lecturer',      sub: 3, hrs: 0,  stu: 0,   fb: '4.1/5', status: 'On Leave' },
              { name: 'Dr. Sunita Rao',    id: 'FAC-005', desig: 'Assoc. Prof',  sub: 2, hrs: 10, stu: 80,  fb: '4.7/5', status: 'Active' },
            ].map((f, i) => (
              <tr key={i}>
                <td>
                  <div className="hod-stu-cell">
                    <div className="hod-stu-av" style={{ background: '#EEEDFE', color: '#534AB7' }}>
                      {f.name[0]}{f.name.split(' ')[1]?.[0]}
                    </div>
                    <div>
                      <div className="hod-stu-name">{f.name}</div>
                      <div className="hod-stu-id">{f.id}</div>
                    </div>
                  </div>
                </td>
                <td style={{ color: '#6b7a99', fontSize: 11 }}>{f.desig}</td>
                <td style={{ fontWeight: 600 }}>{f.sub}</td>
                <td style={{ color: f.hrs === 0 ? '#dc2626' : '#1a3a6e', fontWeight: 600 }}>{f.hrs > 0 ? `${f.hrs}h` : '—'}</td>
                <td style={{ fontWeight: 600 }}>{f.stu > 0 ? f.stu : '—'}</td>
                <td style={{ color: '#059669', fontWeight: 600 }}>{f.fb}</td>
                <td>
                  <span className={f.status === 'Active' ? 'hod-pill hod-pill-green' : 'hod-pill hod-pill-amber'}>
                    {f.status}
                  </span>
                </td>
                <td>
                  <button className="hod-btn-outline" style={{ padding: '4px 8px', fontSize: 11 }}>
                    <IconEdit size={12} /> View
                  </button>
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
   PAGE 3 — STUDENTS
══════════════════════════════ */
function StudentsPage() {
  return (
    <>
      <div className="hod-page-header">
        <div>
          <div className="hod-page-title">Students — CSE Department</div>
          <div className="hod-page-sub">342 students · Sem 1 to Sem 8</div>
        </div>
        <div className="hod-header-actions">
          <button className="hod-btn-outline"><IconDownload size={13} /> Export</button>
          <button className="hod-btn-outline"><IconFilter size={13} /> Filter</button>
        </div>
      </div>

      <div className="hod-kpi-grid hod-kpi-4" style={{ marginBottom: 14 }}>
        <KPI val="342" label="Total students"   iconBg="#eff4ff" iconColor="#2563eb" icon={<IconUsers size={14} color="#2563eb" />} />
        <KPI val="4"   label="Low attendance"   iconBg="#fef2f2" iconColor="#dc2626" icon={<IconCalendarCheck size={14} color="#dc2626" />} />
        <KPI val="8.2" label="Avg CGPA"         iconBg="#f0fdf4" iconColor="#059669" icon={<IconReports size={14} color="#059669" />} />
        <KPI val="89%" label="Placement rate"   iconBg="#EAF3DE" iconColor="#3B6D11" icon={<IconReports size={14} color="#3B6D11" />} />
      </div>

      <div className="hod-table-wrap">
        <div className="hod-table-header">
          <span className="hod-card-title">CSE Students</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <div className="hod-search-input">
              <IconSearch size={13} color="#aab0bc" />
              <input placeholder="Search student..." />
            </div>
            <select className="hod-select">
              <option>All semesters</option>
              {[2,4,6,8].map(s => <option key={s}>Sem {s}</option>)}
            </select>
          </div>
        </div>
        <table className="hod-table">
          <thead>
            <tr><th>Student</th><th>Sem</th><th>Attendance</th><th>CGPA</th><th>Backlog</th><th>Fee</th><th>Status</th></tr>
          </thead>
          <tbody>
            {[
              { n: 'Aashish Kumar', id: '2021CSE047', sem: 6, att: 81,  cgpa: 8.4, backlog: 0, fee: 'Paid',    status: 'Active'   },
              { n: 'Priya Sharma',  id: '2021CSE048', sem: 6, att: 74,  cgpa: 7.9, backlog: 1, fee: 'Pending', status: 'Active'   },
              { n: 'Rohit Verma',   id: '2021CSE049', sem: 6, att: 88,  cgpa: 8.1, backlog: 0, fee: 'Paid',    status: 'Active'   },
              { n: 'Arjun Singh',   id: '2021CSE051', sem: 6, att: 67,  cgpa: 6.8, backlog: 2, fee: 'Overdue', status: 'Detained' },
              { n: 'Kavya Reddy',   id: '2021CSE052', sem: 6, att: 85,  cgpa: 8.7, backlog: 0, fee: 'Paid',    status: 'Active'   },
            ].map((s, i) => (
              <tr key={i}>
                <td>
                  <div className="hod-stu-cell">
                    <div className="hod-stu-av" style={{ background: '#eff4ff', color: '#2563eb' }}>
                      {s.n.split(' ').map(w => w[0]).join('')}
                    </div>
                    <div>
                      <div className="hod-stu-name">{s.n}</div>
                      <div className="hod-stu-id">{s.id}</div>
                    </div>
                  </div>
                </td>
                <td style={{ color: '#6b7a99' }}>Sem {s.sem}</td>
                <td style={{ fontWeight: 600, color: s.att < 75 ? '#dc2626' : '#059669' }}>
                  {s.att}%{s.att < 75 ? ' ⚠' : ''}
                </td>
                <td style={{ fontWeight: 600 }}>{s.cgpa}</td>
                <td>
                  {s.backlog > 0
                    ? <span className="hod-pill hod-pill-red">{s.backlog} subject{s.backlog > 1 ? 's' : ''}</span>
                    : <span className="hod-pill hod-pill-green">Clear</span>
                  }
                </td>
                <td style={{ color: s.fee === 'Paid' ? '#059669' : s.fee === 'Pending' ? '#d97706' : '#dc2626', fontWeight: 600, fontSize: 11 }}>
                  {s.fee}
                </td>
                <td>
                  <span className={s.status === 'Active' ? 'hod-pill hod-pill-green' : 'hod-pill hod-pill-red'}>
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
   PAGE 4 — ATTENDANCE MONITORING
══════════════════════════════ */
function AttendancePage() {
  return (
    <>
      <div className="hod-page-header">
        <div>
          <div className="hod-page-title">Attendance Monitoring</div>
          <div className="hod-page-sub">CSE Department · May 2026</div>
        </div>
        <div className="hod-header-actions">
          <button className="hod-btn-outline"><IconDownload size={13} /> Export Excel</button>
        </div>
      </div>

      <div className="hod-kpi-grid hod-kpi-4" style={{ marginBottom: 14 }}>
        <KPI val="86%" label="Dept avg attendance" iconBg="#f0fdf4" iconColor="#059669" icon={<IconCalendarCheck size={14} color="#059669" />} badge="Good" badgeBg="#EAF3DE" badgeColor="#3B6D11" />
        <KPI val="4"   label="Below 75%"            iconBg="#fef2f2" iconColor="#dc2626" icon={<IconCalendarCheck size={14} color="#dc2626" />} />
        <KPI val="295" label="Present today"         iconBg="#eff4ff" iconColor="#2563eb" icon={<IconUsers size={14} color="#2563eb" />} />
        <KPI val="47"  label="Absent today"          iconBg="#FAEEDA" iconColor="#854F0B" icon={<IconUsers size={14} color="#854F0B" />} />
      </div>

      <div className="hod-grid-2">
        <div className="hod-card">
          <div className="hod-card-hd"><span className="hod-card-title">Subject-wise attendance</span></div>
          {[
            ['Data Structures', '89%', '#2563eb'],
            ['OS',              '82%', '#2563eb'],
            ['DBMS',            '68%', '#dc2626'],
            ['CN',              '85%', '#2563eb'],
            ['SE',              '79%', '#d97706'],
            ['Project',         '91%', '#059669'],
          ].map(([sub, pct, col]) => (
            <div className="hod-bar-row" key={sub}>
              <span className="hod-bar-label" style={{ width: 80 }}>{sub}</span>
              <div className="hod-bar-track">
                <div className="hod-bar-fill" style={{ width: pct, background: col }} />
              </div>
              <span className="hod-bar-pct" style={{ color: col }}>{pct}</span>
            </div>
          ))}
        </div>

        <div className="hod-card">
          <div className="hod-card-hd">
            <span className="hod-card-title">Low attendance alerts</span>
            <span className="hod-pill hod-pill-red">4 students</span>
          </div>
          <table className="hod-table" style={{ fontSize: 11 }}>
            <thead><tr><th>Student</th><th>Attendance</th><th>Shortage</th></tr></thead>
            <tbody>
              {[
                { n: 'Priya Sharma', att: '74%', short: '2 lectures' },
                { n: 'Arjun Singh',  att: '67%', short: '8 lectures' },
                { n: 'Raj Patel',    att: '71%', short: '5 lectures' },
                { n: 'Neha Gupta',   att: '73%', short: '3 lectures' },
              ].map((s, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{s.n}</td>
                  <td style={{ color: '#dc2626', fontWeight: 700 }}>{s.att} ⚠</td>
                  <td style={{ color: '#d97706' }}>{s.short}</td>
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
   PAGE 5 — SUBJECT ALLOCATION
══════════════════════════════ */
function SubjectsPage() {
  return (
    <>
      <div className="hod-page-header">
        <div>
          <div className="hod-page-title">Subject Allocation</div>
          <div className="hod-page-sub">CSE Department · Semester 6 · AY 2025–26</div>
        </div>
        <div className="hod-header-actions">
          <button className="hod-btn-primary"><IconPlus size={13} /> Assign Subject</button>
        </div>
      </div>

      <div className="hod-table-wrap">
        <div className="hod-table-header">
          <span className="hod-card-title">Subject — Faculty mapping · Sem 6</span>
          <select className="hod-select">
            <option>Semester 6</option>
            <option>Semester 4</option>
            <option>Semester 2</option>
          </select>
        </div>
        <table className="hod-table">
          <thead>
            <tr><th>Subject</th><th>Code</th><th>Credits</th><th>Assigned Faculty</th><th>Students</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            {[
              { sub: 'Data Structures',     code: 'CS601', cr: 4, fac: 'Dr. Priya Mehra',   stu: 120, status: 'Assigned' },
              { sub: 'Operating Systems',   code: 'CS602', cr: 4, fac: 'Prof. Rajan Sharma', stu: 120, status: 'Assigned' },
              { sub: 'DBMS',                code: 'CS603', cr: 3, fac: 'Dr. Anita Singh',   stu: 120, status: 'Assigned' },
              { sub: 'Computer Networks',   code: 'CS604', cr: 3, fac: 'Dr. Sunita Rao',    stu: 120, status: 'Assigned' },
              { sub: 'Software Engg.',      code: 'CS605', cr: 3, fac: 'Dr. Priya Mehra',   stu: 120, status: 'Assigned' },
              { sub: 'Major Project',       code: 'CS606', cr: 6, fac: '— Unassigned —',    stu: 120, status: 'Pending'  },
            ].map((s, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{s.sub}</td>
                <td><span className="hod-pill hod-pill-blue">{s.code}</span></td>
                <td style={{ fontWeight: 600, color: '#1a3a6e' }}>{s.cr}</td>
                <td style={{ color: s.fac.startsWith('—') ? '#dc2626' : '#4a5568' }}>{s.fac}</td>
                <td style={{ color: '#6b7a99' }}>{s.stu}</td>
                <td>
                  <span className={s.status === 'Assigned' ? 'hod-pill hod-pill-green' : 'hod-pill hod-pill-red'}>
                    {s.status}
                  </span>
                </td>
                <td>
                  <button className="hod-btn-outline" style={{ padding: '4px 8px', fontSize: 11 }}>
                    <IconEdit size={11} /> Edit
                  </button>
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
   PAGE 6 — TIMETABLE
══════════════════════════════ */
function TimetablePage() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  const slots = ['9:00', '10:00', '11:00', '12:00', '2:00', '3:00', '4:00']

  const schedule = {
    Monday:    ['DS-Dr.PM', 'OS-Prof.RS', '—', 'DBMS-Dr.AS', 'CN-Dr.SR', 'SE-Dr.PM', '—'],
    Tuesday:   ['OS-Prof.RS', 'DS-Dr.PM', 'DBMS-Dr.AS', '—', 'SE-Dr.PM', '—', 'CN-Dr.SR'],
    Wednesday: ['DBMS-Dr.AS', '—', 'DS-Dr.PM', 'OS-Prof.RS', '—', 'CN-Dr.SR', 'SE-Dr.PM'],
    Thursday:  ['CN-Dr.SR', 'SE-Dr.PM', '—', 'DS-Dr.PM', 'DBMS-Dr.AS', 'OS-Prof.RS', '—'],
    Friday:    ['SE-Dr.PM', 'CN-Dr.SR', 'OS-Prof.RS', '—', 'DS-Dr.PM', '—', 'DBMS-Dr.AS'],
  }

  const subColors = { DS: '#eff4ff', OS: '#EEEDFE', DBMS: '#fef2f2', CN: '#f0fdf4', SE: '#FAEEDA', '—': 'transparent' }
  const textColors = { DS: '#2563eb', OS: '#534AB7', DBMS: '#dc2626', CN: '#059669', SE: '#854F0B', '—': '#aab0bc' }

  return (
    <>
      <div className="hod-page-header">
        <div>
          <div className="hod-page-title">Timetable — CSE Sem 6</div>
          <div className="hod-page-sub">Academic Year 2025–26 · Section A</div>
        </div>
        <div className="hod-header-actions">
          <button className="hod-btn-outline"><IconDownload size={13} /> Export PDF</button>
          <button className="hod-btn-primary"><IconEdit size={13} /> Edit Timetable</button>
        </div>
      </div>

      <div className="hod-card" style={{ overflowX: 'auto' }}>
        <table className="hod-table hod-tt-table">
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
                  const sub = cell.split('-')[0]
                  const fac = cell.split('-')[1] || ''
                  return (
                    <td key={ci} style={{ padding: 6 }}>
                      {cell !== '—' ? (
                        <div style={{
                          background: subColors[sub] || '#f4f7fc',
                          color: textColors[sub] || '#1a3a6e',
                          borderRadius: 6, padding: '5px 7px', fontSize: 10, fontWeight: 600
                        }}>
                          <div>{sub}</div>
                          <div style={{ fontWeight: 400, fontSize: 9, opacity: .8 }}>{fac}</div>
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
   PAGE 7 — RESULT ANALYTICS
══════════════════════════════ */
function ResultsPage() {
  return (
    <>
      <div className="hod-page-header">
        <div>
          <div className="hod-page-title">Result Analytics</div>
          <div className="hod-page-sub">CSE Department · Semester 5 results</div>
        </div>
        <div className="hod-header-actions">
          <button className="hod-btn-outline"><IconDownload size={13} /> PDF Report</button>
        </div>
      </div>

      <div className="hod-kpi-grid hod-kpi-4" style={{ marginBottom: 14 }}>
        <KPI val="94%" label="Pass percentage"  iconBg="#f0fdf4" iconColor="#059669" icon={<IconCheck  size={14} color="#059669" />} badge="Good" badgeBg="#EAF3DE" badgeColor="#3B6D11" />
        <KPI val="8.2" label="Avg CGPA"         iconBg="#eff4ff" iconColor="#2563eb" icon={<IconReports size={14} color="#2563eb" />} />
        <KPI val="12"  label="Students with backlog" iconBg="#fef2f2" iconColor="#dc2626" icon={<IconUsers size={14} color="#dc2626" />} />
        <KPI val="8"   label="Toppers (9+ CGPA)" iconBg="#EAF3DE" iconColor="#3B6D11" icon={<IconReports size={14} color="#3B6D11" />} />
      </div>

      <div className="hod-grid-2">
        <div className="hod-card">
          <div className="hod-card-hd"><span className="hod-card-title">Subject-wise pass %</span></div>
          {[
            ['Data Structures', '96%', '#059669'],
            ['OS',              '91%', '#2563eb'],
            ['DBMS',            '88%', '#d97706'],
            ['CN',              '93%', '#2563eb'],
            ['SE',              '95%', '#059669'],
          ].map(([sub, pct, col]) => (
            <div className="hod-bar-row" key={sub}>
              <span className="hod-bar-label" style={{ width: 80 }}>{sub}</span>
              <div className="hod-bar-track">
                <div className="hod-bar-fill" style={{ width: pct, background: col }} />
              </div>
              <span className="hod-bar-pct" style={{ color: col }}>{pct}</span>
            </div>
          ))}
        </div>

        <div className="hod-card">
          <div className="hod-card-hd"><span className="hod-card-title">Top 5 students — Sem 5</span></div>
          <table className="hod-table" style={{ fontSize: 11 }}>
            <thead><tr><th>Rank</th><th>Student</th><th>CGPA</th></tr></thead>
            <tbody>
              {[
                { r: 1, n: 'Kavya Reddy',   cgpa: 9.4 },
                { r: 2, n: 'Sneha Patel',   cgpa: 9.2 },
                { r: 3, n: 'Aashish Kumar', cgpa: 8.8 },
                { r: 4, n: 'Rohit Verma',   cgpa: 8.6 },
                { r: 5, n: 'Priya Sharma',  cgpa: 8.2 },
              ].map((s, i) => (
                <tr key={i}>
                  <td><span className="hod-pill hod-pill-blue">#{s.r}</span></td>
                  <td style={{ fontWeight: 600 }}>{s.n}</td>
                  <td style={{ color: '#059669', fontWeight: 700 }}>{s.cgpa}</td>
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
   PAGE 8 — REPORTS
══════════════════════════════ */
function ReportsPage() {
  return (
    <>
      <div className="hod-page-header">
        <div>
          <div className="hod-page-title">Department Reports</div>
          <div className="hod-page-sub">CSE · Generate and export reports</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
        {[
          { title: 'Attendance Report',   desc: 'Subject-wise monthly attendance', bg: '#eff4ff', c: '#2563eb'  },
          { title: 'Result Report',       desc: 'Sem-wise results, pass %, toppers',bg: '#f0fdf4', c: '#059669' },
          { title: 'Faculty Report',      desc: 'Workload, feedback, performance',  bg: '#EEEDFE', c: '#534AB7' },
          { title: 'Student Report',      desc: 'Complete student data CSV',        bg: '#fdf4ff', c: '#7c3aed' },
          { title: 'Placement Report',    desc: 'CSE placement stats PDF',          bg: '#FAEEDA', c: '#854F0B' },
          { title: 'NAAC Report',         desc: 'Criterion-wise dept data',         bg: '#E6F1FB', c: '#185FA5' },
        ].map((r, i) => (
          <div key={i} style={{
            background: '#fff', border: '1px solid #e8ecf4', borderRadius: 12,
            padding: 16, display: 'flex', alignItems: 'center', gap: 12,
            cursor: 'pointer', transition: 'all .15s',
          }}
            onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(37,99,235,.1)'}
            onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}
          >
            <div style={{ width: 40, height: 40, borderRadius: 10, background: r.bg, color: r.c, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <IconReports size={18} color={r.c} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1a3a6e', marginBottom: 2 }}>{r.title}</div>
              <div style={{ fontSize: 11, color: '#8a94a6' }}>{r.desc}</div>
            </div>
            <button className="hod-btn-outline" style={{ fontSize: 11, flexShrink: 0 }}>
              <IconDownload size={12} />
            </button>
          </div>
        ))}
      </div>
    </>
  )
}

/* ══════════════════════════════
   PAGE 9 — SETTINGS
══════════════════════════════ */
function SettingsPage() {
  const [notify, setNotify] = useState({ attendance: true, results: true, leave: false })

  return (
    <>
      <div className="hod-page-header">
        <div>
          <div className="hod-page-title">Department Settings</div>
          <div className="hod-page-sub">CSE Department preferences</div>
        </div>
        <div className="hod-header-actions">
          <button className="hod-btn-primary"><IconCheck size={13} /> Save Changes</button>
        </div>
      </div>

      <div className="hod-grid-2">
        <div>
          <div className="hod-settings-section">
            <div className="hod-settings-title">Department Info</div>
            {[
              { label: 'Department Name', val: 'Computer Science & Engineering' },
              { label: 'Department Code', val: 'CSE' },
              { label: 'HOD Name',        val: 'Dr. Rajesh Kumar' },
              { label: 'Contact Email',   val: 'hod.cse@college.edu' },
            ].map((s, i) => (
              <div className="hod-settings-row" key={i}>
                <div className="hod-settings-label">{s.label}</div>
                <input className="hod-input" defaultValue={s.val} />
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="hod-settings-section">
            <div className="hod-settings-title">Notification Preferences</div>
            {[
              { k: 'attendance', label: 'Attendance shortage alert', desc: 'When student falls below 75%' },
              { k: 'results',    label: 'Result notifications',       desc: 'When results are published' },
              { k: 'leave',      label: 'Leave request alerts',       desc: 'When faculty applies leave' },
            ].map(s => (
              <div className="hod-settings-row" key={s.k}>
                <div>
                  <div className="hod-settings-label">{s.label}</div>
                  <div style={{ fontSize: 11, color: '#8a94a6' }}>{s.desc}</div>
                </div>
                <button
                  className={`hod-toggle ${notify[s.k] ? 'on' : 'off'}`}
                  onClick={() => setNotify(p => ({ ...p, [s.k]: !p[s.k] }))}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

/* ══════════════════════════════
   MAIN EXPORT
══════════════════════════════ */
export default function HODDashboard() {
  const [activePage, setActivePage] = useState('dashboard')

  const pages = {
    dashboard:  <DashboardPage  />,
    faculty:    <FacultyPage    />,
    students:   <StudentsPage   />,
    attendance: <AttendancePage />,
    subjects:   <SubjectsPage   />,
    timetable:  <TimetablePage  />,
    results:    <ResultsPage    />,
    reports:    <ReportsPage    />,
    settings:   <SettingsPage   />,
  }

  return (
    <Shell active={activePage} onNav={setActivePage}>
      {pages[activePage]}
    </Shell>
  )
}