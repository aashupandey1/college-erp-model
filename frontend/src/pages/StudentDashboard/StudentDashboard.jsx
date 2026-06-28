import { useState } from 'react'
import './StudentDashboard.css'
import {
  IconDashboard, IconCalendarCheck, IconExams, IconLibrary,
  IconReports, IconCoin, IconHostel, IconTransport,
  IconSearch, IconBell, IconSchool, IconDownload,
  IconAlertCircle, IconCheck, IconSettings, IconMail,
  IconAward, IconPlacement, IconUsers,
} from '../../components/Icons'
import logo from "../../assets/logo.png";

/* ══════════════════════════════
   STUDENT PROFILE
══════════════════════════════ */
const profile = {
  name:     'Aashish Kumar',
  initials: 'AK',
  roll:     '2021CSE047',
  branch:   'CSE',
  semester: 6,
  section:  'A',
  year:     3,
}

/* ══════════════════════════════
   NAV CONFIG
══════════════════════════════ */
const navItems = [
  { id: 'dashboard',  label: 'Dashboard',    icon: <IconDashboard />     },
  { id: 'attendance', label: 'Attendance',   icon: <IconCalendarCheck /> },
  { id: 'results',    label: 'Results',      icon: <IconExams />         },
  { id: 'timetable',  label: 'Timetable',    icon: <IconCalendarCheck /> },
  { id: 'library',    label: 'Library',      icon: <IconLibrary />       },
  { id: 'fees',       label: 'Fee Payment',  icon: <IconCoin />          },
  { id: 'hostel',     label: 'Hostel',       icon: <IconHostel />        },
  { id: 'placement',  label: 'Placement',    icon: <IconPlacement />     },
]

/* ══════════════════════════════
   SHELL
══════════════════════════════ */
function Shell({ active, onNav, children }) {
  return (
    <div className="sd-page">
      <nav className="sd-navbar">
        <div className="sd-nav-left">
          <div className="sd-nav-icon">
            <img src={logo} alt="Logo" />
          </div>
          <div className="sd-nav-text">
            <span className="sd-nav-title">COLLEGE ERP</span>
            <span className="sd-nav-sep">Student Portal</span>
          </div>
        </div>
        <div className="sd-nav-right">
          <div className="sd-search">
            <IconSearch size={13} color="rgba(255,255,255,.5)" />
            <span>Search...</span>
          </div>
          <div className="sd-notif">
            <IconBell size={15} color="rgba(255,255,255,.7)" />
            <span className="sd-notif-dot">3</span>
          </div>
          <div className="sd-user-chip">
            <div className="sd-user-avatar">{profile.initials}</div>
            <div className="sd-user-info">
              <span className="sd-user-name">{profile.name}</span>
              <span className="sd-user-sub">{profile.branch} · Sem {profile.semester}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="sd-body">
        <aside className="sd-sidebar">
          <div className="sd-sb-user">
            <div className="sd-sb-avatar">{profile.initials}</div>
            <div className="sd-sb-name">{profile.name}</div>
            <div className="sd-sb-roll">Roll: {profile.roll}</div>
          </div>
          <nav className="sd-sb-nav">
            {navItems.map(item => (
              <div
                key={item.id}
                className={`sd-nav-item ${active === item.id ? 'active' : ''}`}
                onClick={() => onNav(item.id)}
              >
                {item.icon}
                {item.label}
              </div>
            ))}
          </nav>
        </aside>
        <main className="sd-content">{children}</main>
      </div>
    </div>
  )
}

/* ══════════════════════════════
   REUSABLE KPI
══════════════════════════════ */
function KPI({ val, label, sub, iconBg, iconColor, icon, badge, badgeBg, badgeColor, valColor }) {
  return (
    <div className="sd-kpi">
      <div className="sd-kpi-top">
        <div className="sd-kpi-icon" style={{ background: iconBg, color: iconColor }}>{icon}</div>
        {badge && <span className="sd-pill" style={{ background: badgeBg, color: badgeColor }}>{badge}</span>}
      </div>
      <div className="sd-kpi-val" style={{ color: valColor || '#1a3a6e' }}>{val}</div>
      <div className="sd-kpi-label">{label}</div>
      {sub && <div className="sd-kpi-sub">{sub}</div>}
    </div>
  )
}

/* ══════════════════════════════
   PAGE 1 — DASHBOARD
══════════════════════════════ */
const subjectAttendance = [
  { name: 'Data Structures', pct: 89, color: '#2563eb' },
  { name: 'OS',              pct: 82, color: '#2563eb' },
  { name: 'DBMS',            pct: 68, color: '#dc2626' },
  { name: 'CN',              pct: 85, color: '#2563eb' },
  { name: 'SE',              pct: 79, color: '#d97706' },
  { name: 'Project',         pct: 91, color: '#059669' },
]

const recentNotices = [
  { text: 'Semester 6 exam schedule released',    time: 'Today, 10:00 AM',   color: '#2563eb' },
  { text: 'Fee payment deadline: June 10',        time: 'Yesterday',         color: '#dc2626' },
  { text: 'Sports Day registration open',         time: '2 days ago',        color: '#059669' },
  { text: 'HOD meeting for project students',     time: '3 days ago',        color: '#d97706' },
]

const quickDownloads = [
  { label: 'ID Card',       icon: <IconDownload size={15} color="#2563eb" />,  bg: '#eff4ff' },
  { label: 'Bonafide',      icon: <IconDownload size={15} color="#059669" />,  bg: '#f0fdf4' },
  { label: 'Fee Receipt',   icon: <IconDownload size={15} color="#d97706" />,  bg: '#FAEEDA' },
  { label: 'Marksheet',     icon: <IconDownload size={15} color="#534AB7" />,  bg: '#EEEDFE' },
]

function DashboardPage() {
  return (
    <>
      <div className="sd-page-header">
        <div>
          <h2 className="sd-greeting">Good morning, Aashish! 👋</h2>
          <p className="sd-date">Wednesday, 27 May 2026 · Semester {profile.semester} · Section {profile.section}</p>
        </div>
        <div className="sd-header-actions">
          <button className="sd-btn-outline"><IconDownload size={13} /> ID Card</button>
          <button className="sd-btn-primary"><IconCoin size={13} /> Pay Fee</button>
        </div>
      </div>

      <div className="sd-kpi-grid sd-kpi-4">
        <KPI val="81%"  label="Attendance"     sub="↑ 2% this month"     iconBg="#eff4ff" iconColor="#2563eb" icon={<IconCalendarCheck size={14} color="#2563eb" />} badge="OK"   badgeBg="#EAF3DE" badgeColor="#3B6D11" />
        <KPI val="8.4"  label="Current CGPA"   sub="Sem 5 result"        iconBg="#f0fdf4" iconColor="#059669" icon={<IconReports size={14} color="#059669" />}       badge="Good" badgeBg="#EAF3DE" badgeColor="#3B6D11" />
        <KPI val="₹0"   label="Fee dues"        sub="Paid till Sem 6"     iconBg="#f0fdf4" iconColor="#059669" icon={<IconCoin size={14} color="#059669" />}           badge="Clear" badgeBg="#EAF3DE" badgeColor="#3B6D11" />
        <KPI val="1"    label="Backlog"          sub="DBMS · Sem 4"        iconBg="#fef2f2" iconColor="#dc2626" icon={<IconExams size={14} color="#dc2626" />}         badge="⚠"   badgeBg="#fef2f2" badgeColor="#dc2626" />
      </div>

      <div className="sd-bottom-grid">
        {/* Attendance card */}
        <div className="sd-card">
          <div className="sd-card-hd">
            <span className="sd-card-title">Subject-wise attendance</span>
            <span className="sd-card-link">See all</span>
          </div>
          <div className="sd-att-list">
            {subjectAttendance.map(sub => (
              <div className="sd-att-row" key={sub.name}>
                <span className="sd-att-name">{sub.name}</span>
                <div className="sd-att-track">
                  <div className="sd-att-fill" style={{ width: `${sub.pct}%`, background: sub.color }} />
                </div>
                <span className="sd-att-pct" style={{ color: sub.color }}>{sub.pct}%</span>
              </div>
            ))}
          </div>
          <div className="sd-warning">
            <IconAlertCircle size={15} color="#dc2626" />
            <span>DBMS attendance is 68% — need 4 more classes to reach 75%</span>
          </div>
        </div>

        {/* Right col */}
        <div className="sd-right-col">
          {/* Notices */}
          <div className="sd-card">
            <div className="sd-card-hd">
              <span className="sd-card-title">Recent notices</span>
              <span className="sd-card-link">All notices</span>
            </div>
            {recentNotices.map((n, i) => (
              <div className="sd-notice-item" key={i}>
                <div className="sd-notice-dot" style={{ background: n.color }} />
                <div>
                  <div className="sd-notice-text">{n.text}</div>
                  <div className="sd-notice-time">{n.time}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick downloads */}
          <div className="sd-card">
            <div className="sd-card-hd">
              <span className="sd-card-title">Quick downloads</span>
            </div>
            <div className="sd-dl-grid">
              {quickDownloads.map(d => (
                <button className="sd-dl-btn" key={d.label} style={{ '--dl-bg': d.bg }}>
                  {d.icon}
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

/* ══════════════════════════════
   PAGE 2 — ATTENDANCE
══════════════════════════════ */
function AttendancePage() {
  return (
    <>
      <div className="sd-page-header">
        <div>
          <div className="sd-page-title">My Attendance</div>
          <div className="sd-page-sub">CSE Sem 6 · May 2026</div>
        </div>
        <div className="sd-header-actions">
          <button className="sd-btn-outline"><IconDownload size={13} /> Export</button>
        </div>
      </div>

      <div className="sd-kpi-grid sd-kpi-4" style={{ marginBottom: 14 }}>
        <KPI val="81%" label="Overall attendance" sub="↑ 2% this month" iconBg="#eff4ff" iconColor="#2563eb" icon={<IconCalendarCheck size={14} color="#2563eb" />} badge="Good" badgeBg="#EAF3DE" badgeColor="#3B6D11" />
        <KPI val="48"  label="Classes attended"   sub="Out of 59 total" iconBg="#f0fdf4" iconColor="#059669" icon={<IconCheck size={14} color="#059669" />} />
        <KPI val="11"  label="Classes missed"      sub="May 2026"        iconBg="#FAEEDA" iconColor="#854F0B" icon={<IconAlertCircle size={14} color="#854F0B" />} />
        <KPI val="1"   label="Subject below 75%"   sub="DBMS"            iconBg="#fef2f2" iconColor="#dc2626" icon={<IconAlertCircle size={14} color="#dc2626" />} badge="⚠" badgeBg="#fef2f2" badgeColor="#dc2626" />
      </div>

      <div className="sd-card">
        <div className="sd-card-hd">
          <span className="sd-card-title">Subject-wise breakdown — Sem 6</span>
        </div>
        <table className="sd-table">
          <thead>
            <tr><th>Subject</th><th>Code</th><th>Total classes</th><th>Attended</th><th>Attendance %</th><th>Status</th></tr>
          </thead>
          <tbody>
            {[
              { sub: 'Data Structures', code: 'CS601', total: 40, att: 36, pct: 89 },
              { sub: 'Operating Systems', code: 'CS602', total: 38, att: 31, pct: 82 },
              { sub: 'DBMS',             code: 'CS603', total: 35, att: 24, pct: 68 },
              { sub: 'Computer Networks',code: 'CS604', total: 36, att: 31, pct: 85 },
              { sub: 'Software Engg.',   code: 'CS605', total: 34, att: 27, pct: 79 },
              { sub: 'Project',          code: 'CS606', total: 22, att: 20, pct: 91 },
            ].map((s, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{s.sub}</td>
                <td><span className="sd-pill sd-pill-blue">{s.code}</span></td>
                <td style={{ color: '#6b7a99' }}>{s.total}</td>
                <td style={{ fontWeight: 600 }}>{s.att}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div className="sd-mini-track">
                      <div className="sd-mini-fill" style={{ width: `${s.pct}%`, background: s.pct < 75 ? '#dc2626' : s.pct < 80 ? '#d97706' : '#2563eb' }} />
                    </div>
                    <span style={{ fontWeight: 700, color: s.pct < 75 ? '#dc2626' : s.pct < 80 ? '#d97706' : '#059669', fontSize: 12 }}>{s.pct}%</span>
                  </div>
                </td>
                <td>
                  <span className={s.pct < 75 ? 'sd-pill sd-pill-red' : 'sd-pill sd-pill-green'}>
                    {s.pct < 75 ? 'Low ⚠' : 'OK'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="sd-warning" style={{ marginTop: 12 }}>
          <IconAlertCircle size={15} color="#dc2626" />
          <span>DBMS attendance is 68% — you need to attend 4 more classes to reach the 75% minimum requirement</span>
        </div>
      </div>
    </>
  )
}

/* ══════════════════════════════
   PAGE 3 — RESULTS
══════════════════════════════ */
function ResultsPage() {
  return (
    <>
      <div className="sd-page-header">
        <div>
          <div className="sd-page-title">My Results</div>
          <div className="sd-page-sub">CSE · Semester-wise academic record</div>
        </div>
        <div className="sd-header-actions">
          <button className="sd-btn-outline"><IconDownload size={13} /> Marksheet</button>
        </div>
      </div>

      <div className="sd-kpi-grid sd-kpi-4" style={{ marginBottom: 14 }}>
        <KPI val="8.4" label="Current CGPA"   sub="Sem 5 result"   iconBg="#eff4ff"  iconColor="#2563eb" icon={<IconReports size={14} color="#2563eb" />} badge="Rank #3" badgeBg="#eff4ff" badgeColor="#2563eb" />
        <KPI val="8.8" label="Best sem SGPA"  sub="Semester 3"     iconBg="#f0fdf4"  iconColor="#059669" icon={<IconAward size={14} color="#059669" />} />
        <KPI val="1"   label="Backlogs"        sub="DBMS · Sem 4"  iconBg="#fef2f2"  iconColor="#dc2626" icon={<IconAlertCircle size={14} color="#dc2626" />} />
        <KPI val="94%" label="Pass %"          sub="All subjects"  iconBg="#EAF3DE"  iconColor="#3B6D11" icon={<IconCheck size={14} color="#3B6D11" />} />
      </div>

      {/* Sem-wise CGPA */}
      <div className="sd-card" style={{ marginBottom: 12 }}>
        <div className="sd-card-hd">
          <span className="sd-card-title">Semester-wise SGPA</span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 90, padding: '0 4px' }}>
          {[
            { sem: 'Sem 1', sgpa: 7.8 },
            { sem: 'Sem 2', sgpa: 8.1 },
            { sem: 'Sem 3', sgpa: 8.8 },
            { sem: 'Sem 4', sgpa: 7.9 },
            { sem: 'Sem 5', sgpa: 8.6 },
            { sem: 'Sem 6', sgpa: null },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              {s.sgpa ? (
                <>
                  <div style={{ fontSize: 10, fontWeight: 700, color: s.sgpa >= 8.5 ? '#059669' : '#2563eb' }}>{s.sgpa}</div>
                  <div style={{ width: '100%', background: s.sgpa >= 8.5 ? '#059669' : '#2563eb', borderRadius: '4px 4px 0 0', height: `${((s.sgpa - 6) / 4) * 70}px`, opacity: .85 }} />
                </>
              ) : (
                <>
                  <div style={{ fontSize: 10, color: '#aab0bc' }}>—</div>
                  <div style={{ width: '100%', background: '#e8ecf4', borderRadius: '4px 4px 0 0', height: 12 }} />
                </>
              )}
              <div style={{ fontSize: 9, color: '#8a94a6', fontWeight: 500 }}>{s.sem}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Subject-wise marks */}
      <div className="sd-card">
        <div className="sd-card-hd">
          <span className="sd-card-title">Semester 5 — subject-wise marks</span>
          <span className="sd-pill sd-pill-green">SGPA: 8.6</span>
        </div>
        <table className="sd-table">
          <thead>
            <tr><th>Subject</th><th>Internal</th><th>External</th><th>Total</th><th>Grade</th><th>Credits</th></tr>
          </thead>
          <tbody>
            {[
              { sub: 'Compiler Design',    int: 24, ext: 68, total: 92, grade: 'A+', cr: 4 },
              { sub: 'Machine Learning',   int: 22, ext: 62, total: 84, grade: 'A',  cr: 4 },
              { sub: 'Cloud Computing',    int: 25, ext: 71, total: 96, grade: 'O',  cr: 3 },
              { sub: 'Information Security', int: 21, ext: 59, total: 80, grade: 'A', cr: 3 },
              { sub: 'Elective — AI',      int: 23, ext: 65, total: 88, grade: 'A+', cr: 3 },
            ].map((s, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{s.sub}</td>
                <td style={{ color: '#6b7a99' }}>{s.int}/25</td>
                <td style={{ color: '#6b7a99' }}>{s.ext}/75</td>
                <td style={{ fontWeight: 700 }}>{s.total}/100</td>
                <td>
                  <span className="sd-pill" style={{
                    background: s.grade === 'O' ? '#EAF3DE' : s.grade === 'A+' ? '#eff4ff' : '#EEEDFE',
                    color: s.grade === 'O' ? '#3B6D11' : s.grade === 'A+' ? '#2563eb' : '#534AB7',
                    fontWeight: 700,
                  }}>{s.grade}</span>
                </td>
                <td style={{ color: '#6b7a99' }}>{s.cr}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

/* ══════════════════════════════
   PAGE 4 — TIMETABLE
══════════════════════════════ */
function TimetablePage() {
  const days  = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  const slots = ['9:00', '10:00', '11:00', '12:00', '2:00', '3:00', '4:00']

  const schedule = {
    Monday:    ['DS',  'OS',   '—',   'DBMS', 'CN',  'SE',  '—'  ],
    Tuesday:   ['OS',  'DS',   'DBMS','—',    'SE',  '—',   'CN' ],
    Wednesday: ['DBMS','—',    'DS',  'OS',   '—',   'CN',  'SE' ],
    Thursday:  ['CN',  'SE',   '—',   'DS',   'DBMS','OS',  '—'  ],
    Friday:    ['SE',  'CN',   'OS',  '—',    'DS',  '—',   'Lab'],
  }

  const colors = {
    DS:   { bg: '#eff4ff', col: '#2563eb' },
    OS:   { bg: '#EEEDFE', col: '#534AB7' },
    DBMS: { bg: '#fef2f2', col: '#dc2626' },
    CN:   { bg: '#f0fdf4', col: '#059669' },
    SE:   { bg: '#FAEEDA', col: '#854F0B' },
    Lab:  { bg: '#EAF3DE', col: '#3B6D11' },
    '—':  null,
  }

  return (
    <>
      <div className="sd-page-header">
        <div>
          <div className="sd-page-title">Class Timetable</div>
          <div className="sd-page-sub">CSE Sem 6 · Section A · AY 2025–26</div>
        </div>
        <div className="sd-header-actions">
          <button className="sd-btn-outline"><IconDownload size={13} /> Export PDF</button>
        </div>
      </div>

      <div className="sd-card" style={{ overflowX: 'auto' }}>
        <table className="sd-table sd-tt-table">
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
                        <div style={{ background: c.bg, color: c.col, borderRadius: 6, padding: '6px 8px', fontSize: 10, fontWeight: 600, textAlign: 'center' }}>
                          {cell}
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

      {/* Legend */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
        {Object.entries(colors).filter(([k]) => k !== '—').map(([key, c]) => (
          <span key={key} className="sd-pill" style={{ background: c.bg, color: c.col }}>{key}</span>
        ))}
      </div>
    </>
  )
}

/* ══════════════════════════════
   PAGE 5 — LIBRARY
══════════════════════════════ */
function LibraryPage() {
  return (
    <>
      <div className="sd-page-header">
        <div>
          <div className="sd-page-title">Library</div>
          <div className="sd-page-sub">Books issued, due dates & search</div>
        </div>
        <div className="sd-header-actions">
          <button className="sd-btn-primary"><IconSearch size={13} /> Search Books</button>
        </div>
      </div>

      <div className="sd-kpi-grid sd-kpi-4" style={{ marginBottom: 14 }}>
        <KPI val="3"   label="Books issued"    sub="Currently with you" iconBg="#eff4ff"  iconColor="#2563eb" icon={<IconLibrary size={14} color="#2563eb" />} />
        <KPI val="1"   label="Due this week"   sub="Return by Jun 2"   iconBg="#FAEEDA"  iconColor="#854F0B" icon={<IconAlertCircle size={14} color="#854F0B" />} badge="!" badgeBg="#FAEEDA" badgeColor="#854F0B" />
        <KPI val="₹0"  label="Fine pending"    sub="All clear"         iconBg="#f0fdf4"  iconColor="#059669" icon={<IconCoin size={14} color="#059669" />} />
        <KPI val="5"   label="Books available" sub="On your wishlist"  iconBg="#EEEDFE"  iconColor="#534AB7" icon={<IconLibrary size={14} color="#534AB7" />} />
      </div>

      <div className="sd-card">
        <div className="sd-card-hd">
          <span className="sd-card-title">Currently issued books</span>
        </div>
        <table className="sd-table">
          <thead>
            <tr><th>Book title</th><th>Author</th><th>Issue date</th><th>Due date</th><th>Status</th></tr>
          </thead>
          <tbody>
            {[
              { title: 'Introduction to Algorithms', author: 'CLRS',          issued: 'May 10', due: 'Jun 10', status: 'OK'      },
              { title: 'Computer Networks',           author: 'A. Tanenbaum',  issued: 'May 20', due: 'Jun 2',  status: 'Due soon'},
              { title: 'DBMS by Korth',               author: 'Silberschatz', issued: 'May 5',  due: 'Jun 5',  status: 'OK'      },
            ].map((b, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{b.title}</td>
                <td style={{ color: '#6b7a99' }}>{b.author}</td>
                <td style={{ color: '#6b7a99' }}>{b.issued}</td>
                <td style={{ fontWeight: 600 }}>{b.due}</td>
                <td>
                  <span className={b.status === 'OK' ? 'sd-pill sd-pill-green' : 'sd-pill sd-pill-amber'}>
                    {b.status}
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
   PAGE 6 — FEE PAYMENT
══════════════════════════════ */
function FeesPage() {
  const [paid, setPaid] = useState(false)

  return (
    <>
      <div className="sd-page-header">
        <div>
          <div className="sd-page-title">Fee Payment</div>
          <div className="sd-page-sub">AY 2025–26 · Semester 6</div>
        </div>
      </div>

      <div className="sd-kpi-grid sd-kpi-4" style={{ marginBottom: 14 }}>
        <KPI val="₹82,000" label="Total semester fee"  sub="AY 2025–26" iconBg="#eff4ff"  iconColor="#2563eb" icon={<IconCoin size={14} color="#2563eb" />} />
        <KPI val="₹82,000" label="Amount paid"         sub="Full payment" iconBg="#f0fdf4" iconColor="#059669" icon={<IconCheck size={14} color="#059669" />} />
        <KPI val="₹0"      label="Balance due"         sub="No dues"     iconBg="#f0fdf4"  iconColor="#059669" icon={<IconCoin size={14} color="#059669" />} badge="Clear" badgeBg="#EAF3DE" badgeColor="#3B6D11" />
        <KPI val="Mar 12"  label="Last payment"        sub="Online · UPI" iconBg="#EEEDFE" iconColor="#534AB7" icon={<IconCalendarCheck size={14} color="#534AB7" />} />
      </div>

      <div className="sd-grid-2">
        <div className="sd-card">
          <div className="sd-card-hd"><span className="sd-card-title">Fee receipt history</span></div>
          <table className="sd-table" style={{ fontSize: 11 }}>
            <thead><tr><th>Semester</th><th>Amount</th><th>Date</th><th>Mode</th><th>Status</th></tr></thead>
            <tbody>
              {[
                { sem: 'Sem 6', amt: '₹82,000', date: 'Mar 12, 2026', mode: 'UPI',     status: 'Paid' },
                { sem: 'Sem 5', amt: '₹80,000', date: 'Sep 8, 2025',  mode: 'Net Banking', status: 'Paid' },
                { sem: 'Sem 4', amt: '₹80,000', date: 'Mar 5, 2025',  mode: 'UPI',     status: 'Paid' },
                { sem: 'Sem 3', amt: '₹78,000', date: 'Sep 2, 2024',  mode: 'Cheque',  status: 'Paid' },
              ].map((f, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{f.sem}</td>
                  <td style={{ fontWeight: 700, color: '#059669' }}>{f.amt}</td>
                  <td style={{ color: '#6b7a99' }}>{f.date}</td>
                  <td style={{ color: '#6b7a99' }}>{f.mode}</td>
                  <td><span className="sd-pill sd-pill-green">{f.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="sd-card">
          <div className="sd-card-hd"><span className="sd-card-title">Fee breakdown — Sem 6</span></div>
          {[
            ['Tuition fee',    '₹60,000', '#2563eb'],
            ['Library fee',    '₹2,000',  '#534AB7'],
            ['Lab charges',    '₹8,000',  '#059669'],
            ['Exam fee',       '₹5,000',  '#d97706'],
            ['Development fee','₹7,000',  '#854F0B'],
          ].map(([label, amt, col]) => (
            <div key={label} className="sd-fee-row">
              <span style={{ fontSize: 12, color: '#4a5568' }}>{label}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: col }}>{amt}</span>
            </div>
          ))}
          <div className="sd-fee-total">
            <span style={{ fontWeight: 700 }}>Total</span>
            <span style={{ fontWeight: 800, color: '#1a3a6e' }}>₹82,000</span>
          </div>
          <button
            className={`sd-btn-primary ${paid ? 'sd-btn-success' : ''}`}
            style={{ marginTop: 14, width: '100%', justifyContent: 'center' }}
            onClick={() => setPaid(true)}
          >
            {paid ? <><IconCheck size={13} /> Receipt Downloaded</> : <><IconDownload size={13} /> Download Receipt</>}
          </button>
        </div>
      </div>
    </>
  )
}

/* ══════════════════════════════
   PAGE 7 — HOSTEL
══════════════════════════════ */
function HostelPage() {
  return (
    <>
      <div className="sd-page-header">
        <div>
          <div className="sd-page-title">Hostel</div>
          <div className="sd-page-sub">Room details, fee & complaints</div>
        </div>
      </div>

      <div className="sd-kpi-grid sd-kpi-4" style={{ marginBottom: 14 }}>
        <KPI val="B-204"   label="Room no."         sub="Block B · Floor 2"  iconBg="#eff4ff" iconColor="#2563eb" icon={<IconHostel size={14} color="#2563eb" />} />
        <KPI val="3"       label="Roommates"         sub="Total 4 occupants"  iconBg="#EEEDFE" iconColor="#534AB7" icon={<IconUsers size={14} color="#534AB7" />} />
        <KPI val="₹12,000" label="Hostel fee/sem"    sub="Paid · Sem 6"       iconBg="#f0fdf4" iconColor="#059669" icon={<IconCoin size={14} color="#059669" />} badge="Paid" badgeBg="#EAF3DE" badgeColor="#3B6D11" />
        <KPI val="1"       label="Open complaint"    sub="WiFi issue"         iconBg="#FAEEDA" iconColor="#854F0B" icon={<IconAlertCircle size={14} color="#854F0B" />} />
      </div>

      <div className="sd-grid-2">
        <div className="sd-card">
          <div className="sd-card-hd"><span className="sd-card-title">Room details</span></div>
          {[
            ['Block',       'Block B'],
            ['Room no.',    'B-204'],
            ['Floor',       '2nd Floor'],
            ['Room type',   'Shared (4-seater)'],
            ['Warden',      'Mr. Suresh Tiwari'],
            ['Contact',     '+91 98765 43210'],
            ['Mess timing', '7:30 AM / 12:30 PM / 7:30 PM'],
          ].map(([k, v]) => (
            <div key={k} className="sd-info-row">
              <span className="sd-info-key">{k}</span>
              <span className="sd-info-val">{v}</span>
            </div>
          ))}
        </div>

        <div className="sd-card">
          <div className="sd-card-hd">
            <span className="sd-card-title">Complaints</span>
            <button className="sd-btn-primary" style={{ fontSize: 11, padding: '5px 10px' }}>
              + New complaint
            </button>
          </div>
          <table className="sd-table" style={{ fontSize: 11 }}>
            <thead><tr><th>Issue</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              {[
                { issue: 'WiFi not working in room', date: 'May 25', status: 'Open'     },
                { issue: 'Tap leaking — bathroom',   date: 'May 10', status: 'Resolved' },
                { issue: 'Light not working',        date: 'Apr 22', status: 'Resolved' },
              ].map((c, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 500 }}>{c.issue}</td>
                  <td style={{ color: '#6b7a99' }}>{c.date}</td>
                  <td>
                    <span className={c.status === 'Open' ? 'sd-pill sd-pill-amber' : 'sd-pill sd-pill-green'}>
                      {c.status}
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
   PAGE 8 — PLACEMENT
══════════════════════════════ */
function PlacementPage() {
  const [applied, setApplied] = useState({})

  return (
    <>
      <div className="sd-page-header">
        <div>
          <div className="sd-page-title">Placement</div>
          <div className="sd-page-sub">Campus recruitment drives · AY 2025–26</div>
        </div>
        <div className="sd-header-actions">
          <button className="sd-btn-outline"><IconDownload size={13} /> My Resume</button>
        </div>
      </div>

      <div className="sd-kpi-grid sd-kpi-4" style={{ marginBottom: 14 }}>
        <KPI val="89%"    label="CSE placement rate"  sub="AY 2024–25"      iconBg="#EAF3DE" iconColor="#3B6D11" icon={<IconPlacement size={14} color="#3B6D11" />} badge="Top dept" badgeBg="#EAF3DE" badgeColor="#3B6D11" />
        <KPI val="₹7.2L"  label="Avg package (CSE)"   sub="AY 2024–25"      iconBg="#eff4ff" iconColor="#2563eb" icon={<IconCoin size={14} color="#2563eb" />} />
        <KPI val="3"      label="Drives applied"       sub="This year"       iconBg="#EEEDFE" iconColor="#534AB7" icon={<IconPlacement size={14} color="#534AB7" />} />
        <KPI val="8.4"    label="Your CGPA"            sub="Eligible for all" iconBg="#f0fdf4" iconColor="#059669" icon={<IconAward size={14} color="#059669" />} badge="Good" badgeBg="#EAF3DE" badgeColor="#3B6D11" />
      </div>

      <div className="sd-card">
        <div className="sd-card-hd">
          <span className="sd-card-title">Upcoming & recent drives</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { company: 'Google India',    role: 'SWE Intern',      pkg: '₹25L',   cgpa: 8.0, date: 'Jun 5',  status: 'Open',   color: '#2563eb', bg: '#eff4ff'  },
            { company: 'Infosys',         role: 'Systems Engineer', pkg: '₹3.6L',  cgpa: 6.5, date: 'Jun 10', status: 'Open',   color: '#059669', bg: '#f0fdf4'  },
            { company: 'TCS',             role: 'Digital Ninja',    pkg: '₹7L',    cgpa: 7.0, date: 'Jun 15', status: 'Open',   color: '#d97706', bg: '#FAEEDA'  },
            { company: 'Microsoft MACH',  role: 'PM Role',          pkg: '₹30L',   cgpa: 8.5, date: 'May 20', status: 'Closed', color: '#534AB7', bg: '#EEEDFE'  },
            { company: 'Wipro',           role: 'Project Engineer', pkg: '₹3.5L',  cgpa: 6.0, date: 'May 15', status: 'Closed', color: '#6b7a99', bg: '#f4f7fc'  },
          ].map((d, i) => (
            <div key={i} className="sd-drive-row">
              <div className="sd-drive-logo" style={{ background: d.bg, color: d.color }}>
                {d.company[0]}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#1a3a6e' }}>{d.company}</div>
                <div style={{ fontSize: 11, color: '#6b7a99', marginTop: 2 }}>
                  {d.role} · {d.pkg} · Min CGPA {d.cgpa} · {d.date}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className={d.status === 'Open' ? 'sd-pill sd-pill-green' : 'sd-pill sd-pill-muted'}>
                  {d.status}
                </span>
                {d.status === 'Open' && (
                  <button
                    className={applied[i] ? 'sd-btn-outline' : 'sd-btn-primary'}
                    style={{ fontSize: 11, padding: '5px 12px' }}
                    onClick={() => setApplied(p => ({ ...p, [i]: true }))}
                  >
                    {applied[i] ? <><IconCheck size={11} /> Applied</> : 'Apply'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

/* ══════════════════════════════
   MAIN EXPORT
══════════════════════════════ */
export default function StudentDashboard() {
  const [activePage, setActivePage] = useState('dashboard')

  const pages = {
    dashboard:  <DashboardPage  />,
    attendance: <AttendancePage />,
    results:    <ResultsPage    />,
    timetable:  <TimetablePage  />,
    library:    <LibraryPage    />,
    fees:       <FeesPage       />,
    hostel:     <HostelPage     />,
    placement:  <PlacementPage  />,
  }

  return (
    <Shell active={activePage} onNav={setActivePage}>
      {pages[activePage]}
    </Shell>
  )
}