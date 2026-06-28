import { useState } from 'react'
import './ParentDashboard.css'
import {
  IconDashboard, IconUsersGroup, IconCalendarCheck, IconAward,
  IconCoin, IconHostel, IconPlacement, IconMail, IconSettings,
  IconSearch, IconBell, IconDownload, IconCheck, IconAlertCircle,
} from '../../components/Icons'
import logo from "../../assets/logo.png";

/* ══════════════════════════════
   NAV CONFIG
══════════════════════════════ */
const navItems = [
  { id: 'dashboard',   label: 'Dashboard',     icon: <IconDashboard />     },
  { id: 'attendance',  label: 'Attendance',    icon: <IconCalendarCheck /> },
  { id: 'results',     label: 'Results & GPA', icon: <IconAward />         },
  { id: 'fees',        label: 'Fee Payment',   icon: <IconCoin />          },
  { id: 'hostel',      label: 'Hostel',        icon: <IconHostel />        },
  { id: 'placement',   label: 'Placements',    icon: <IconPlacement />     },
  { id: 'communication',label: 'Messages',     icon: <IconMail />          },
  { id: 'settings',    label: 'Settings',      icon: <IconSettings />      },
]

const student = {
  name: 'Aashish Kumar',
  roll: '2021CSE047',
  branch: 'CSE',
  semester: 6,
  attendance: 81,
  cgpa: 8.4,
  feeStatus: 'Due',
  feeAmount: '₹18,500',
}

/* ══════════════════════════════
   SHELL
══════════════════════════════ */
function Shell({ active, onNav, children }) {
  return (
    <div className="par-page">
      <nav className="par-navbar">
        <div className="par-nav-left">
          <div className="par-nav-icon">
            <img src={logo} alt="Logo" />
          </div>
          <div className="par-nav-text">
            <span className="par-nav-title">COLLEGE ERP</span>
            <span className="par-nav-sep">Parent Portal</span>
          </div>
        </div>
        <div className="par-nav-right">
          <div className="par-search">
            <IconSearch size={13} color="rgba(255,255,255,.5)" />
            <span>Search...</span>
          </div>
          <div className="par-notif">
            <IconBell size={15} color="rgba(255,255,255,.7)" />
            <span className="par-notif-dot">2</span>
          </div>
          <div className="par-avatar">RS</div>
        </div>
      </nav>

      <div className="par-body">
        <aside className="par-sidebar">
          <div className="par-sb-user">
            <div className="par-sb-avatar">RS</div>
            <div className="par-sb-name">Ramesh Sharma</div>
            <div className="par-sb-role">Parent of {student.name}</div>
          </div>

          {/* Child selector */}
          <div className="par-child-card">
            <div className="par-child-av">AK</div>
            <div>
              <div className="par-child-name">{student.name}</div>
              <div className="par-child-meta">{student.branch} · Sem {student.semester}</div>
            </div>
          </div>

          <nav className="par-sb-nav">
            {navItems.map(item => (
              <div
                key={item.id}
                className={`par-sb-item ${active === item.id ? 'active' : ''}`}
                onClick={() => onNav(item.id)}
              >
                {item.icon}
                {item.label}
              </div>
            ))}
          </nav>
        </aside>
        <main className="par-content">{children}</main>
      </div>
    </div>
  )
}

/* ══════════════════════════════
   REUSABLE KPI
══════════════════════════════ */
function KPI({ val, label, iconBg, iconColor, icon, trend, trendUp, badge, badgeBg, badgeColor, valColor }) {
  return (
    <div className="par-kpi">
      <div className="par-kpi-top">
        <div className="par-kpi-icon" style={{ background: iconBg, color: iconColor }}>{icon}</div>
        {badge && <span className="par-pill" style={{ background: badgeBg, color: badgeColor }}>{badge}</span>}
      </div>
      <div className="par-kpi-val" style={{ color: valColor || '#7a3e08' }}>{val}</div>
      <div className="par-kpi-label">{label}</div>
      {trend && <div className={`par-kpi-trend ${trendUp ? 'up' : 'down'}`}>{trend}</div>}
    </div>
  )
}

/* ══════════════════════════════
   PAGE 1 — DASHBOARD
══════════════════════════════ */
function DashboardPage() {
  return (
    <>
      <div className="par-page-header">
        <div>
          <div className="par-page-title">Welcome, Mr. Sharma</div>
          <div className="par-page-sub">Tracking {student.name}'s progress · Wednesday, 27 May 2026</div>
        </div>
        <div className="par-header-actions">
          <button className="par-btn-primary"><IconCoin size={13} /> Pay Fee Now</button>
        </div>
      </div>

      <div className="par-kpi-grid par-kpi-4">
        <KPI val={`${student.attendance}%`} label="Attendance"  iconBg="#FFF3E0" iconColor="#92400E" icon={<IconCalendarCheck size={14} color="#92400E" />} badge="Min 75%" badgeBg="#FFF3E0" badgeColor="#92400E" />
        <KPI val={student.cgpa}              label="CGPA"        iconBg="#f0fdf4" iconColor="#059669" icon={<IconAward size={14} color="#059669" />} trend="↑ 0.2 this sem" trendUp valColor="#059669" />
        <KPI val={student.feeAmount}         label="Fee pending" iconBg="#fef2f2" iconColor="#dc2626" icon={<IconCoin size={14} color="#dc2626" />} badge="Due 31 May" badgeBg="#fef2f2" badgeColor="#dc2626" valColor="#dc2626" />
        <KPI val="3"                          label="Drive eligible" iconBg="#FFF3E0" iconColor="#92400E" icon={<IconPlacement size={14} color="#92400E" />} />
      </div>

      <div className="par-grid-2">
        <div className="par-card">
          <div className="par-card-hd">
            <span className="par-card-title">Subject-wise attendance</span>
            <span className="par-card-link">Full report</span>
          </div>
          {[
            ['Data Structures', 92, '#059669'],
            ['OS',              79, '#2563eb'],
            ['DBMS',            68, '#dc2626'],
            ['CN',              85, '#2563eb'],
            ['SE',              77, '#d97706'],
          ].map(([sub, pct, col]) => (
            <div className="par-bar-row" key={sub}>
              <span className="par-bar-label">{sub}</span>
              <div className="par-bar-track">
                <div className="par-bar-fill" style={{ width: `${pct}%`, background: col }} />
              </div>
              <span className="par-bar-pct" style={{ color: col }}>{pct}%</span>
            </div>
          ))}
          <div className="par-alert">
            <IconAlertCircle size={14} color="#dc2626" />
            <span>DBMS attendance low (68%). Needs 4 more lectures to reach 75%.</span>
          </div>
        </div>

        <div className="par-card">
          <div className="par-card-hd"><span className="par-card-title">Recent notices</span></div>
          {[
            { text: 'End-sem exam schedule published',        time: 'Today',       color: '#2563eb' },
            { text: 'Fee due reminder — Last date 31 May',     time: '2 days ago',  color: '#dc2626' },
            { text: 'PTM scheduled for 5 June 2026',           time: '3 days ago',  color: '#059669' },
            { text: 'TCS placement drive — Aashish eligible',  time: '4 days ago',  color: '#7c3aed' },
          ].map((n, i) => (
            <div className="par-notice-item" key={i}>
              <div className="par-notice-dot" style={{ background: n.color }} />
              <div>
                <div className="par-notice-text">{n.text}</div>
                <div className="par-notice-time">{n.time}</div>
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
function AttendancePage() {
  return (
    <>
      <div className="par-page-header">
        <div>
          <div className="par-page-title">Attendance — {student.name}</div>
          <div className="par-page-sub">CSE · Semester 6 · Overall {student.attendance}%</div>
        </div>
        <div className="par-header-actions">
          <button className="par-btn-outline"><IconDownload size={13} /> Download Report</button>
        </div>
      </div>

      <div className="par-kpi-grid par-kpi-4" style={{ marginBottom: 14 }}>
        <KPI val="81%" label="Overall attendance" iconBg="#FFF3E0" iconColor="#92400E" icon={<IconCalendarCheck size={14} color="#92400E" />} />
        <KPI val="220" label="Classes attended"    iconBg="#f0fdf4" iconColor="#059669" icon={<IconCheck size={14} color="#059669" />} />
        <KPI val="52"  label="Classes missed"      iconBg="#fef2f2" iconColor="#dc2626" icon={<IconAlertCircle size={14} color="#dc2626" />} />
        <KPI val="4"   label="Needed for 75% (DBMS)" iconBg="#FFF3E0" iconColor="#92400E" icon={<IconCalendarCheck size={14} color="#92400E" />} />
      </div>

      <div className="par-card">
        <div className="par-card-hd"><span className="par-card-title">Month-wise attendance trend</span></div>
        {[
          ['January', 88, '#059669'],
          ['February', 84, '#059669'],
          ['March', 79, '#2563eb'],
          ['April', 73, '#d97706'],
          ['May', 81, '#2563eb'],
        ].map(([m, pct, col]) => (
          <div className="par-bar-row" key={m}>
            <span className="par-bar-label" style={{ width: 80 }}>{m}</span>
            <div className="par-bar-track">
              <div className="par-bar-fill" style={{ width: `${pct}%`, background: col }} />
            </div>
            <span className="par-bar-pct" style={{ color: col }}>{pct}%</span>
          </div>
        ))}
      </div>
    </>
  )
}

/* ══════════════════════════════
   PAGE 3 — RESULTS & GPA
══════════════════════════════ */
function ResultsPage() {
  return (
    <>
      <div className="par-page-header">
        <div>
          <div className="par-page-title">Results & GPA — {student.name}</div>
          <div className="par-page-sub">CGPA: {student.cgpa} · Semester 6 results</div>
        </div>
        <div className="par-header-actions">
          <button className="par-btn-outline"><IconDownload size={13} /> Marksheet PDF</button>
        </div>
      </div>

      <div className="par-table-wrap">
        <div className="par-table-header"><span className="par-card-title">Semester 6 — Subject results</span></div>
        <table className="par-table">
          <thead><tr><th>Subject</th><th>Internal</th><th>External</th><th>Grade</th><th>Points</th></tr></thead>
          <tbody>
            {[
              { sub: 'Data Structures', int: '28/30', ext: '68/70', grade: 'O',  pts: 10 },
              { sub: 'OS',              int: '25/30', ext: '60/70', grade: 'A+', pts: 9  },
              { sub: 'DBMS',            int: '22/30', ext: '55/70', grade: 'A',  pts: 8  },
              { sub: 'CN',              int: '26/30', ext: '63/70', grade: 'A+', pts: 9  },
              { sub: 'SE',              int: '24/30', ext: '58/70', grade: 'A',  pts: 8  },
            ].map((r, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{r.sub}</td>
                <td style={{ color: '#6b7a99' }}>{r.int}</td>
                <td style={{ color: '#6b7a99' }}>{r.ext}</td>
                <td><span className="par-pill par-pill-green">{r.grade}</span></td>
                <td style={{ fontWeight: 700, color: '#059669' }}>{r.pts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="par-card" style={{ marginTop: 12 }}>
        <div className="par-card-hd"><span className="par-card-title">CGPA trend — all semesters</span></div>
        {[
          ['Sem 1', 78], ['Sem 2', 80], ['Sem 3', 82], ['Sem 4', 81], ['Sem 5', 82], ['Sem 6', 88],
        ].map(([s, pct]) => (
          <div className="par-bar-row" key={s}>
            <span className="par-bar-label" style={{ width: 50 }}>{s}</span>
            <div className="par-bar-track">
              <div className="par-bar-fill" style={{ width: `${pct}%`, background: s === 'Sem 6' ? '#059669' : '#2563eb' }} />
            </div>
            <span className="par-bar-pct" style={{ color: s === 'Sem 6' ? '#059669' : '#2563eb' }}>{(pct/10).toFixed(1)}</span>
          </div>
        ))}
      </div>
    </>
  )
}

/* ══════════════════════════════
   PAGE 4 — FEE PAYMENT
══════════════════════════════ */
function FeesPage() {
  return (
    <>
      <div className="par-page-header">
        <div>
          <div className="par-page-title">Fee Payment — {student.name}</div>
          <div className="par-page-sub">Semester 6 fee status</div>
        </div>
        <div className="par-header-actions">
          <button className="par-btn-primary"><IconCoin size={13} /> Pay ₹18,500 Now</button>
        </div>
      </div>

      <div className="par-kpi-grid par-kpi-3" style={{ marginBottom: 14 }}>
        <KPI val="₹1,02,000" label="Total fee (sem 6)" iconBg="#FFF3E0" iconColor="#92400E" icon={<IconCoin size={14} color="#92400E" />} />
        <KPI val="₹83,500"   label="Paid so far"       iconBg="#f0fdf4" iconColor="#059669" icon={<IconCheck size={14} color="#059669" />} valColor="#059669" />
        <KPI val="₹18,500"   label="Pending"           iconBg="#fef2f2" iconColor="#dc2626" icon={<IconAlertCircle size={14} color="#dc2626" />} badge="Due 31 May" badgeBg="#fef2f2" badgeColor="#dc2626" valColor="#dc2626" />
      </div>

      <div className="par-table-wrap">
        <div className="par-table-header"><span className="par-card-title">Payment history</span></div>
        <table className="par-table">
          <thead><tr><th>Description</th><th>Amount</th><th>Method</th><th>Date</th><th>Receipt</th><th>Status</th></tr></thead>
          <tbody>
            {[
              { d: 'Tuition fee — Installment 1', amt: '₹50,000', method: 'Online', date: '5 Jan',  rc: 'REC-1001', status: 'Paid' },
              { d: 'Tuition fee — Installment 2', amt: '₹33,500', method: 'Online', date: '10 Mar', rc: 'REC-1045', status: 'Paid' },
              { d: 'Exam fee',                    amt: '₹5,000',  method: 'Cash',   date: '2 May',  rc: 'REC-1089', status: 'Paid' },
              { d: 'Tuition fee — Installment 3', amt: '₹18,500', method: '—',      date: '—',      rc: '—',        status: 'Due' },
            ].map((f, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{f.d}</td>
                <td style={{ fontWeight: 700, color: '#1a3a6e' }}>{f.amt}</td>
                <td style={{ color: '#6b7a99' }}>{f.method}</td>
                <td style={{ color: '#6b7a99' }}>{f.date}</td>
                <td style={{ color: '#6b7a99', fontSize: 11 }}>{f.rc}</td>
                <td><span className={f.status === 'Paid' ? 'par-pill par-pill-green' : 'par-pill par-pill-red'}>{f.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

/* ══════════════════════════════
   PAGE 5 — HOSTEL
══════════════════════════════ */
function HostelPage() {
  return (
    <>
      <div className="par-page-header">
        <div>
          <div className="par-page-title">Hostel Details — {student.name}</div>
          <div className="par-page-sub">Block A · Room 105</div>
        </div>
      </div>

      <div className="par-kpi-grid par-kpi-3" style={{ marginBottom: 14 }}>
        <KPI val="A-105" label="Room number"   iconBg="#FFF3E0" iconColor="#92400E" icon={<IconHostel size={14} color="#92400E" />} />
        <KPI val="₹6,200" label="Mess due"      iconBg="#fef2f2" iconColor="#dc2626" icon={<IconCoin size={14} color="#dc2626" />} valColor="#dc2626" />
        <KPI val="Paid"   label="Hostel fee"    iconBg="#f0fdf4" iconColor="#059669" icon={<IconCheck size={14} color="#059669" />} valColor="#059669" />
      </div>

      <div className="par-card">
        <div className="par-card-hd"><span className="par-card-title">Warden contact</span></div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div className="par-child-av" style={{ width: 48, height: 48, fontSize: 16 }}>SK</div>
          <div>
            <div style={{ fontWeight: 700, color: '#1a3a6e', fontSize: 13 }}>Mr. Suresh Kumar</div>
            <div style={{ fontSize: 11, color: '#6b7a99' }}>Warden, Block A · +91 98765 43211</div>
          </div>
        </div>
      </div>
    </>
  )
}

/* ══════════════════════════════
   PAGE 6 — PLACEMENTS
══════════════════════════════ */
function PlacementPage() {
  return (
    <>
      <div className="par-page-header">
        <div>
          <div className="par-page-title">Placement Status — {student.name}</div>
          <div className="par-page-sub">Eligible for 3 active drives</div>
        </div>
      </div>

      <div className="par-table-wrap">
        <div className="par-table-header"><span className="par-card-title">Eligible drives</span></div>
        <table className="par-table">
          <thead><tr><th>Company</th><th>Role</th><th>Package</th><th>Drive Date</th><th>Status</th></tr></thead>
          <tbody>
            {[
              { co: 'TCS',     role: 'Software Engineer',  pkg: '₹3.5–6 LPA', date: '5 Jun',  status: 'Applied'  },
              { co: 'Infosys', role: 'Systems Engineer',   pkg: '₹3.6 LPA',   date: '12 Jun', status: 'Eligible' },
              { co: 'HCL',     role: 'Graduate Trainee',   pkg: '₹2.5–4 LPA', date: '20 Jun', status: 'Eligible' },
            ].map((d, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{d.co}</td>
                <td style={{ color: '#6b7a99' }}>{d.role}</td>
                <td style={{ fontWeight: 600, color: '#1a3a6e' }}>{d.pkg}</td>
                <td style={{ color: '#6b7a99' }}>{d.date}</td>
                <td><span className={d.status === 'Applied' ? 'par-pill par-pill-blue' : 'par-pill par-pill-amber'}>{d.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

/* ══════════════════════════════
   PAGE 7 — COMMUNICATION
══════════════════════════════ */
function CommunicationPage() {
  return (
    <>
      <div className="par-page-header">
        <div>
          <div className="par-page-title">Messages</div>
          <div className="par-page-sub">Communicate directly with faculty/admin</div>
        </div>
        <div className="par-header-actions">
          <button className="par-btn-primary"><IconMail size={13} /> New Message</button>
        </div>
      </div>

      <div className="par-card">
        <div className="par-card-hd"><span className="par-card-title">Recent messages</span></div>
        {[
          { from: 'Dr. Priya Mehra (Class Teacher)', msg: 'Aashish has been performing well this semester.', time: '2 days ago' },
          { from: 'Accounts Office',                  msg: 'Fee reminder — please clear dues by 31 May.',     time: '3 days ago' },
          { from: 'TPO Office',                       msg: 'Your ward is shortlisted for TCS interview.',     time: '5 days ago' },
        ].map((m, i) => (
          <div key={i} style={{ padding: '10px 0', borderBottom: i < 2 ? '1px solid #f4f7fc' : 'none' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#1a3a6e', marginBottom: 3 }}>{m.from}</div>
            <div style={{ fontSize: 12, color: '#4a5568', marginBottom: 3 }}>{m.msg}</div>
            <div style={{ fontSize: 10, color: '#aab0bc' }}>{m.time}</div>
          </div>
        ))}
      </div>
    </>
  )
}

/* ══════════════════════════════
   PAGE 8 — SETTINGS
══════════════════════════════ */
function SettingsPage() {
  const [notify, setNotify] = useState({ sms: true, email: true, attendance: true })

  return (
    <>
      <div className="par-page-header">
        <div>
          <div className="par-page-title">Settings</div>
          <div className="par-page-sub">Parent account preferences</div>
        </div>
        <div className="par-header-actions">
          <button className="par-btn-primary"><IconCheck size={13} /> Save Changes</button>
        </div>
      </div>

      <div className="par-grid-2">
        <div className="par-settings-section">
          <div className="par-settings-title">Profile Information</div>
          {[
            { label: 'Parent Name', val: 'Ramesh Sharma' },
            { label: 'Relation',    val: 'Father' },
            { label: 'Phone',       val: '+91 98765 43210' },
            { label: 'Email',       val: 'ramesh.sharma@email.com' },
          ].map((s, i) => (
            <div className="par-settings-row" key={i}>
              <div className="par-settings-label">{s.label}</div>
              <input className="par-input" defaultValue={s.val} />
            </div>
          ))}
        </div>

        <div className="par-settings-section">
          <div className="par-settings-title">Notification Preferences</div>
          {[
            { k: 'sms',        label: 'SMS Alerts',         desc: 'Attendance & fee alerts via SMS' },
            { k: 'email',      label: 'Email Notifications', desc: 'Result & circular emails' },
            { k: 'attendance', label: 'Attendance Alert',    desc: 'Notify when below 75%' },
          ].map(s => (
            <div className="par-settings-row" key={s.k}>
              <div>
                <div className="par-settings-label">{s.label}</div>
                <div style={{ fontSize: 11, color: '#8a94a6' }}>{s.desc}</div>
              </div>
              <button
                className={`par-toggle ${notify[s.k] ? 'on' : 'off'}`}
                onClick={() => setNotify(p => ({ ...p, [s.k]: !p[s.k] }))}
              />
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
export default function ParentDashboard() {
  const [activePage, setActivePage] = useState('dashboard')

  const pages = {
    dashboard:      <DashboardPage      />,
    attendance:     <AttendancePage     />,
    results:        <ResultsPage        />,
    fees:           <FeesPage           />,
    hostel:         <HostelPage         />,
    placement:      <PlacementPage      />,
    communication:  <CommunicationPage  />,
    settings:       <SettingsPage       />,
  }

  return (
    <Shell active={activePage} onNav={setActivePage}>
      {pages[activePage]}
    </Shell>
  )
}