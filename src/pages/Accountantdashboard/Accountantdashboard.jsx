import { useState } from 'react'
import './AccountantDashboard.css'
import {
  IconDashboard, IconCalculator, IconCoin, IconUsers,
  IconReports, IconSettings, IconSearch, IconBell,
  IconPlus, IconDownload, IconFilter, IconCheck,
  IconAlertCircle, IconEdit,
} from '../../components/Icons'
import logo from "../../assets/logo.png";
/* ══════════════════════════════
   NAV CONFIG
══════════════════════════════ */
const navItems = [
  { id: 'dashboard',    label: 'Dashboard',        icon: <IconDashboard />  },
  { id: 'collection',   label: 'Fee Collection',   icon: <IconCoin />       , badge: '12', badgeBg: '#FCEBEB', badgeText: '#A32D2D' },
  { id: 'receipts',     label: 'Receipts',         icon: <IconReports />    },
  { id: 'defaulters',   label: 'Due Tracking',     icon: <IconAlertCircle />},
  { id: 'scholarship',  label: 'Scholarships',     icon: <IconUsers />      },
  { id: 'payroll',      label: 'Payroll',          icon: <IconCalculator /> },
  { id: 'reports',      label: 'Reports',          icon: <IconDownload />   },
  { id: 'settings',     label: 'Settings',         icon: <IconSettings />   },
]

/* ══════════════════════════════
   SHELL
══════════════════════════════ */
function Shell({ active, onNav, children }) {
  return (
    <div className="acc-page">
      <nav className="acc-navbar">
        <div className="acc-nav-left">
          <div className="acc-nav-icon">
            <img src={logo} alt="Logo" />
          </div>
          <div className="acc-nav-text">
            <span className="acc-nav-title">COLLEGE ERP</span>
            <span className="acc-nav-sep">Accounts Panel</span>
          </div>
        </div>
        <div className="acc-nav-right">
          <div className="acc-search">
            <IconSearch size={13} color="rgba(255,255,255,.5)" />
            <span>Search...</span>
          </div>
          <div className="acc-notif">
            <IconBell size={15} color="rgba(255,255,255,.7)" />
            <span className="acc-notif-dot">6</span>
          </div>
          <div className="acc-avatar">SK</div>
        </div>
      </nav>

      <div className="acc-body">
        <aside className="acc-sidebar">
          <div className="acc-sb-user">
            <div className="acc-sb-avatar">SK</div>
            <div className="acc-sb-name">Sunita Kapoor</div>
            <div className="acc-sb-role">Chief Accountant</div>
          </div>
          <nav className="acc-sb-nav">
            {navItems.map(item => (
              <div
                key={item.id}
                className={`acc-sb-item ${active === item.id ? 'active' : ''}`}
                onClick={() => onNav(item.id)}
              >
                {item.icon}
                {item.label}
                {item.badge && (
                  <span className="acc-sb-badge" style={{ background: item.badgeBg, color: item.badgeText }}>
                    {item.badge}
                  </span>
                )}
              </div>
            ))}
          </nav>
        </aside>
        <main className="acc-content">{children}</main>
      </div>
    </div>
  )
}

/* ══════════════════════════════
   REUSABLE KPI
══════════════════════════════ */
function KPI({ val, label, iconBg, iconColor, icon, trend, trendUp, badge, badgeBg, badgeColor, valColor }) {
  return (
    <div className="acc-kpi">
      <div className="acc-kpi-top">
        <div className="acc-kpi-icon" style={{ background: iconBg, color: iconColor }}>{icon}</div>
        {badge && <span className="acc-pill" style={{ background: badgeBg, color: badgeColor }}>{badge}</span>}
      </div>
      <div className="acc-kpi-val" style={{ color: valColor || '#065F46' }}>{val}</div>
      <div className="acc-kpi-label">{label}</div>
      {trend && <div className={`acc-kpi-trend ${trendUp ? 'up' : 'down'}`}>{trend}</div>}
    </div>
  )
}

/* ══════════════════════════════
   PAGE 1 — DASHBOARD
══════════════════════════════ */
function DashboardPage() {
  return (
    <>
      <div className="acc-page-header">
        <div>
          <div className="acc-page-title">Accounts Dashboard</div>
          <div className="acc-page-sub">Wednesday, 27 May 2026 · Academic Year 2025–26</div>
        </div>
        <div className="acc-header-actions">
          <button className="acc-btn-outline"><IconDownload size={13} /> Daily Report</button>
          <button className="acc-btn-primary"><IconPlus size={13} /> Collect Fee</button>
        </div>
      </div>

      <div className="acc-kpi-grid acc-kpi-4">
        <KPI val="₹42.3L" label="Collected this month" iconBg="#ECFDF5" iconColor="#065F46" icon={<IconCoin size={14} color="#065F46" />} trend="↑ 8% vs April" trendUp />
        <KPI val="₹8.7L"  label="Pending dues"          iconBg="#fef2f2" iconColor="#dc2626" icon={<IconAlertCircle size={14} color="#dc2626" />} badge="12 students" badgeBg="#fef2f2" badgeColor="#dc2626" valColor="#dc2626" />
        <KPI val="68%"    label="Online payments"       iconBg="#eff4ff" iconColor="#2563eb" icon={<IconCoin size={14} color="#2563eb" />} />
        <KPI val="₹38,200" label="Cash collected today" iconBg="#ECFDF5" iconColor="#065F46" icon={<IconCoin size={14} color="#065F46" />} />
      </div>

      <div className="acc-kpi-grid acc-kpi-4" style={{ marginBottom: 14 }}>
        <KPI val="124" label="Transactions today" iconBg="#eff4ff" iconColor="#2563eb" icon={<IconReports size={14} color="#2563eb" />} />
        <KPI val="₹18.4L" label="Payroll this month" iconBg="#FFF3E0" iconColor="#92400E" icon={<IconCalculator size={14} color="#92400E" />} />
        <KPI val="42" label="Scholarship applications" iconBg="#EEEDFE" iconColor="#534AB7" icon={<IconUsers size={14} color="#534AB7" />} />
        <KPI val="3" label="Refund requests" iconBg="#fef2f2" iconColor="#dc2626" icon={<IconAlertCircle size={14} color="#dc2626" />} />
      </div>

      <div className="acc-grid-2">
        <div className="acc-card">
          <div className="acc-card-hd">
            <span className="acc-card-title">Branch-wise fee collection</span>
            <span className="acc-card-link">Details</span>
          </div>
          {[
            ['CSE',   '94%', '#065F46'],
            ['ECE',   '88%', '#065F46'],
            ['MECH',  '76%', '#d97706'],
            ['CIVIL', '69%', '#dc2626'],
            ['IT',    '91%', '#065F46'],
          ].map(([br, pct, col]) => (
            <div className="acc-bar-row" key={br}>
              <span className="acc-bar-label">{br}</span>
              <div className="acc-bar-track">
                <div className="acc-bar-fill" style={{ width: pct, background: col }} />
              </div>
              <span className="acc-bar-pct" style={{ color: col }}>{pct}</span>
            </div>
          ))}
        </div>

        <div className="acc-card">
          <div className="acc-card-hd"><span className="acc-card-title">Recent transactions</span></div>
          <div className="acc-activity-list">
            {[
              { text: 'Fee collected — Rahul Sharma ₹45,000',   time: '5 min ago',  color: '#065F46' },
              { text: 'Receipt generated — REC-1089',            time: '12 min ago', color: '#2563eb' },
              { text: 'Scholarship approved — Priya Sharma',     time: '1 hr ago',   color: '#7c3aed' },
              { text: 'Salary processed — 18 faculty members',   time: '2 hrs ago',  color: '#92400E' },
            ].map((a, i) => (
              <div className="acc-activity-item" key={i}>
                <div className="acc-activity-dot" style={{ background: a.color }} />
                <div><div className="acc-activity-text">{a.text}</div><div className="acc-activity-time">{a.time}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

/* ══════════════════════════════
   PAGE 2 — FEE COLLECTION
══════════════════════════════ */
function CollectionPage() {
  return (
    <>
      <div className="acc-page-header">
        <div>
          <div className="acc-page-title">Fee Collection</div>
          <div className="acc-page-sub">Collect fee payments from students</div>
        </div>
        <div className="acc-header-actions">
          <button className="acc-btn-primary"><IconPlus size={13} /> New Collection</button>
        </div>
      </div>

      <div className="acc-card" style={{ marginBottom: 14 }}>
        <div className="acc-card-hd"><span className="acc-card-title">Quick fee collection</span></div>
        <div className="acc-form-grid">
          <div className="acc-form-group">
            <label className="acc-label">Student Enrollment No.</label>
            <input className="acc-input" placeholder="2021CSE047" />
          </div>
          <div className="acc-form-group">
            <label className="acc-label">Fee Component</label>
            <select className="acc-select">
              <option>Tuition Fee</option>
              <option>Exam Fee</option>
              <option>Hostel Fee</option>
              <option>Library Fine</option>
            </select>
          </div>
          <div className="acc-form-group">
            <label className="acc-label">Amount</label>
            <input className="acc-input" placeholder="₹18,500" />
          </div>
          <div className="acc-form-group">
            <label className="acc-label">Payment Method</label>
            <select className="acc-select">
              <option>Cash</option>
              <option>Online (Razorpay)</option>
              <option>DD / Cheque</option>
            </select>
          </div>
        </div>
        <button className="acc-btn-primary" style={{ marginTop: 12 }}><IconCheck size={13} /> Collect & Generate Receipt</button>
      </div>

      <div className="acc-table-wrap">
        <div className="acc-table-header">
          <span className="acc-card-title">Today's collections</span>
          <div className="acc-search-input">
            <IconSearch size={13} color="#aab0bc" />
            <input placeholder="Search student..." />
          </div>
        </div>
        <table className="acc-table">
          <thead><tr><th>Student</th><th>Branch</th><th>Component</th><th>Amount</th><th>Method</th><th>Receipt</th><th>Status</th></tr></thead>
          <tbody>
            {[
              { n: 'Rahul Sharma', b: 'CSE',  c: 'Tuition Fee', amt: '₹45,000', method: 'Online', rc: 'REC-1101', status: 'Paid' },
              { n: 'Priya Mehra',  b: 'ECE',  c: 'Exam Fee',    amt: '₹5,000',  method: 'Cash',   rc: 'REC-1102', status: 'Paid' },
              { n: 'Arjun Singh',  b: 'MECH', c: 'Hostel Fee',  amt: '₹12,000', method: 'Online', rc: 'REC-1103', status: 'Paid' },
              { n: 'Kavya Reddy',  b: 'IT',   c: 'Tuition Fee', amt: '₹45,000', method: 'DD',      rc: 'REC-1104', status: 'Paid' },
            ].map((f, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{f.n}</td>
                <td><span className="acc-pill acc-pill-blue">{f.b}</span></td>
                <td style={{ color: '#6b7a99' }}>{f.c}</td>
                <td style={{ fontWeight: 700, color: '#1a3a6e' }}>{f.amt}</td>
                <td style={{ color: '#6b7a99' }}>{f.method}</td>
                <td style={{ color: '#6b7a99', fontSize: 11 }}>{f.rc}</td>
                <td><span className="acc-pill acc-pill-green">{f.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

/* ══════════════════════════════
   PAGE 3 — RECEIPTS
══════════════════════════════ */
function ReceiptsPage() {
  return (
    <>
      <div className="acc-page-header">
        <div>
          <div className="acc-page-title">Receipts</div>
          <div className="acc-page-sub">All fee receipts generated</div>
        </div>
        <div className="acc-header-actions">
          <button className="acc-btn-outline"><IconDownload size={13} /> Export All</button>
        </div>
      </div>

      <div className="acc-table-wrap">
        <div className="acc-table-header">
          <span className="acc-card-title">Receipt history</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <div className="acc-search-input">
              <IconSearch size={13} color="#aab0bc" />
              <input placeholder="Search receipt no..." />
            </div>
            <select className="acc-select"><option>All months</option><option>May 2026</option><option>April 2026</option></select>
          </div>
        </div>
        <table className="acc-table">
          <thead><tr><th>Receipt No.</th><th>Student</th><th>Amount</th><th>Date</th><th>Method</th><th>Action</th></tr></thead>
          <tbody>
            {[
              { rc: 'REC-1101', n: 'Rahul Sharma',  amt: '₹45,000', date: '27 May', method: 'Online' },
              { rc: 'REC-1100', n: 'Sneha Patel',   amt: '₹45,000', date: '26 May', method: 'Online' },
              { rc: 'REC-1099', n: 'Manish Tiwari', amt: '₹22,000', date: '26 May', method: 'Cash' },
              { rc: 'REC-1098', n: 'Riya Agarwal',  amt: '₹38,500', date: '25 May', method: 'Online' },
              { rc: 'REC-1097', n: 'Vikram Joshi',  amt: '₹45,000', date: '24 May', method: 'DD' },
            ].map((r, i) => (
              <tr key={i}>
                <td><span className="acc-pill acc-pill-blue">{r.rc}</span></td>
                <td style={{ fontWeight: 600 }}>{r.n}</td>
                <td style={{ fontWeight: 700, color: '#1a3a6e' }}>{r.amt}</td>
                <td style={{ color: '#6b7a99' }}>{r.date}</td>
                <td style={{ color: '#6b7a99' }}>{r.method}</td>
                <td><button className="acc-btn-outline" style={{ padding: '4px 8px', fontSize: 11 }}><IconDownload size={11} /> PDF</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

/* ══════════════════════════════
   PAGE 4 — DUE TRACKING / DEFAULTERS
══════════════════════════════ */
function DefaultersPage() {
  return (
    <>
      <div className="acc-page-header">
        <div>
          <div className="acc-page-title">Due Tracking</div>
          <div className="acc-page-sub">12 students with pending fees</div>
        </div>
        <div className="acc-header-actions">
          <button className="acc-btn-outline"><IconBell size={13} /> Send Reminders</button>
          <button className="acc-btn-outline"><IconDownload size={13} /> Export</button>
        </div>
      </div>

      <div className="acc-kpi-grid acc-kpi-3" style={{ marginBottom: 14 }}>
        <KPI val="12"   label="Total defaulters" iconBg="#fef2f2" iconColor="#dc2626" icon={<IconAlertCircle size={14} color="#dc2626" />} valColor="#dc2626" />
        <KPI val="₹8.7L" label="Total pending"    iconBg="#fef2f2" iconColor="#dc2626" icon={<IconCoin size={14} color="#dc2626" />} valColor="#dc2626" />
        <KPI val="4"    label="Overdue 30+ days"  iconBg="#FFF3E0" iconColor="#92400E" icon={<IconAlertCircle size={14} color="#92400E" />} />
      </div>

      <div className="acc-table-wrap">
        <div className="acc-table-header"><span className="acc-card-title">Defaulter list</span></div>
        <table className="acc-table">
          <thead><tr><th>Student</th><th>Branch</th><th>Amount Due</th><th>Due Date</th><th>Days Overdue</th><th>Action</th></tr></thead>
          <tbody>
            {[
              { n: 'Kavya Reddy',   b: 'IT',    amt: '₹45,000', due: '24 May', days: 3,  },
              { n: 'Arjun Singh',   b: 'MECH',  amt: '₹38,500', due: '15 May', days: 12, },
              { n: 'Neha Gupta',    b: 'CIVIL', amt: '₹22,000', due: '10 May', days: 17, },
              { n: 'Raj Patel',     b: 'CSE',   amt: '₹45,000', due: '1 May',  days: 26, },
            ].map((f, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{f.n}</td>
                <td><span className="acc-pill acc-pill-blue">{f.b}</span></td>
                <td style={{ fontWeight: 700, color: '#dc2626' }}>{f.amt}</td>
                <td style={{ color: '#6b7a99' }}>{f.due}</td>
                <td><span className={f.days > 15 ? 'acc-pill acc-pill-red' : 'acc-pill acc-pill-amber'}>{f.days} days</span></td>
                <td><button className="acc-btn-outline" style={{ padding: '4px 8px', fontSize: 11 }}><IconBell size={11} /> Remind</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

/* ══════════════════════════════
   PAGE 5 — SCHOLARSHIPS
══════════════════════════════ */
function ScholarshipPage() {
  return (
    <>
      <div className="acc-page-header">
        <div>
          <div className="acc-page-title">Scholarships</div>
          <div className="acc-page-sub">42 applications · AY 2025–26</div>
        </div>
        <div className="acc-header-actions">
          <button className="acc-btn-primary"><IconPlus size={13} /> New Scheme</button>
        </div>
      </div>

      <div className="acc-kpi-grid acc-kpi-4" style={{ marginBottom: 14 }}>
        <KPI val="42" label="Total applications" iconBg="#eff4ff" iconColor="#2563eb" icon={<IconUsers size={14} color="#2563eb" />} />
        <KPI val="28" label="Approved"            iconBg="#ECFDF5" iconColor="#065F46" icon={<IconCheck size={14} color="#065F46" />} />
        <KPI val="9"  label="Pending review"      iconBg="#FFF3E0" iconColor="#92400E" icon={<IconAlertCircle size={14} color="#92400E" />} />
        <KPI val="₹14.2L" label="Total disbursed" iconBg="#ECFDF5" iconColor="#065F46" icon={<IconCoin size={14} color="#065F46" />} />
      </div>

      <div className="acc-table-wrap">
        <div className="acc-table-header"><span className="acc-card-title">Scholarship applications</span></div>
        <table className="acc-table">
          <thead><tr><th>Student</th><th>Scheme</th><th>Category</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {[
              { n: 'Priya Sharma',  scheme: 'NSP Merit',      cat: 'OBC',   amt: '₹25,000', status: 'Approved' },
              { n: 'Rohit Verma',   scheme: 'State Minority', cat: 'Minority', amt: '₹18,000', status: 'Pending' },
              { n: 'Sneha Patel',   scheme: 'Merit Scholarship', cat: 'General', amt: '₹30,000', status: 'Approved' },
              { n: 'Arjun Singh',   scheme: 'SC/ST Scheme',   cat: 'SC',    amt: '₹35,000', status: 'Pending' },
            ].map((s, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{s.n}</td>
                <td style={{ color: '#6b7a99' }}>{s.scheme}</td>
                <td><span className="acc-pill acc-pill-purple">{s.cat}</span></td>
                <td style={{ fontWeight: 700, color: '#1a3a6e' }}>{s.amt}</td>
                <td><span className={s.status === 'Approved' ? 'acc-pill acc-pill-green' : 'acc-pill acc-pill-amber'}>{s.status}</span></td>
                <td><button className="acc-btn-outline" style={{ padding: '4px 8px', fontSize: 11 }}><IconEdit size={11} /> Review</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

/* ══════════════════════════════
   PAGE 6 — PAYROLL
══════════════════════════════ */
function PayrollPage() {
  return (
    <>
      <div className="acc-page-header">
        <div>
          <div className="acc-page-title">Payroll</div>
          <div className="acc-page-sub">May 2026 · 104 employees</div>
        </div>
        <div className="acc-header-actions">
          <button className="acc-btn-outline"><IconDownload size={13} /> Payslips</button>
          <button className="acc-btn-primary"><IconCheck size={13} /> Process Salary</button>
        </div>
      </div>

      <div className="acc-kpi-grid acc-kpi-4" style={{ marginBottom: 14 }}>
        <KPI val="₹18.4L" label="Total payroll"   iconBg="#FFF3E0" iconColor="#92400E" icon={<IconCalculator size={14} color="#92400E" />} />
        <KPI val="104"     label="Employees"       iconBg="#eff4ff" iconColor="#2563eb" icon={<IconUsers size={14} color="#2563eb" />} />
        <KPI val="92"      label="Salary processed" iconBg="#ECFDF5" iconColor="#065F46" icon={<IconCheck size={14} color="#065F46" />} />
        <KPI val="12"      label="Pending"          iconBg="#fef2f2" iconColor="#dc2626" icon={<IconAlertCircle size={14} color="#dc2626" />} />
      </div>

      <div className="acc-table-wrap">
        <div className="acc-table-header"><span className="acc-card-title">Faculty & staff salary</span></div>
        <table className="acc-table">
          <thead><tr><th>Employee</th><th>Designation</th><th>Basic</th><th>Deductions</th><th>Net Pay</th><th>Status</th></tr></thead>
          <tbody>
            {[
              { n: 'Dr. Priya Mehra',    desig: 'Asst. Professor', basic: '₹65,000', ded: '₹8,200', net: '₹56,800', status: 'Paid'    },
              { n: 'Prof. Rajan Sharma', desig: 'Professor',        basic: '₹95,000', ded: '₹12,400', net: '₹82,600', status: 'Paid'    },
              { n: 'Mr. Vivek Gupta',    desig: 'Lecturer',          basic: '₹42,000', ded: '₹5,100', net: '₹36,900', status: 'Pending' },
              { n: 'Dr. Sunita Rao',     desig: 'Assoc. Professor',  basic: '₹78,000', ded: '₹9,800', net: '₹68,200', status: 'Paid'    },
            ].map((p, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{p.n}</td>
                <td style={{ color: '#6b7a99', fontSize: 11 }}>{p.desig}</td>
                <td style={{ color: '#6b7a99' }}>{p.basic}</td>
                <td style={{ color: '#dc2626' }}>{p.ded}</td>
                <td style={{ fontWeight: 700, color: '#065F46' }}>{p.net}</td>
                <td><span className={p.status === 'Paid' ? 'acc-pill acc-pill-green' : 'acc-pill acc-pill-amber'}>{p.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

/* ══════════════════════════════
   PAGE 7 — REPORTS
══════════════════════════════ */
function ReportsPage() {
  return (
    <>
      <div className="acc-page-header">
        <div>
          <div className="acc-page-title">Financial Reports</div>
          <div className="acc-page-sub">Generate and export accounting reports</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
        {[
          { title: 'Daily Collection Report', desc: 'Cash + online summary',     bg: '#ECFDF5', c: '#065F46' },
          { title: 'Monthly Fee Report',      desc: 'Branch-wise collection',     bg: '#eff4ff', c: '#2563eb' },
          { title: 'Defaulter Report',        desc: 'Pending dues list',          bg: '#fef2f2', c: '#dc2626' },
          { title: 'Scholarship Report',      desc: 'Disbursement summary',       bg: '#EEEDFE', c: '#534AB7' },
          { title: 'Payroll Report',          desc: 'Salary register, Form 16',   bg: '#FFF3E0', c: '#92400E' },
          { title: 'Bank Reconciliation',     desc: 'Daily ledger vs bank stmt',  bg: '#fdf4ff', c: '#7c3aed' },
        ].map((r, i) => (
          <div key={i} style={{
            background: '#fff', border: '1px solid #e8ecf4', borderRadius: 12,
            padding: 16, display: 'flex', alignItems: 'center', gap: 12,
            cursor: 'pointer', transition: 'all .15s',
          }}
            onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(6,95,70,.1)'}
            onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}
          >
            <div style={{ width: 40, height: 40, borderRadius: 10, background: r.bg, color: r.c, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <IconReports size={18} color={r.c} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#065F46', marginBottom: 2 }}>{r.title}</div>
              <div style={{ fontSize: 11, color: '#8a94a6' }}>{r.desc}</div>
            </div>
            <button className="acc-btn-outline" style={{ fontSize: 11, flexShrink: 0 }}>
              <IconDownload size={12} />
            </button>
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
  const [toggles, setToggles] = useState({ reminders: true, autoReceipt: true, lateFee: false })

  return (
    <>
      <div className="acc-page-header">
        <div>
          <div className="acc-page-title">Settings</div>
          <div className="acc-page-sub">Accounts configuration</div>
        </div>
        <div className="acc-header-actions">
          <button className="acc-btn-primary"><IconCheck size={13} /> Save Changes</button>
        </div>
      </div>

      <div className="acc-grid-2">
        <div className="acc-settings-section">
          <div className="acc-settings-title">Fee Configuration</div>
          {[
            { label: 'Late Fee (per day)', val: '₹50' },
            { label: 'Grace Period',        val: '7 days' },
            { label: 'Default Payment Gateway', val: 'Razorpay' },
          ].map((s, i) => (
            <div className="acc-settings-row" key={i}>
              <div className="acc-settings-label">{s.label}</div>
              <input className="acc-input" defaultValue={s.val} style={{ width: 140 }} />
            </div>
          ))}
        </div>

        <div className="acc-settings-section">
          <div className="acc-settings-title">Automation</div>
          {[
            { k: 'reminders',   label: 'Auto fee reminders',  desc: '7 days before due date' },
            { k: 'autoReceipt', label: 'Auto-generate receipt', desc: 'On successful payment' },
            { k: 'lateFee',     label: 'Auto late fee',         desc: 'Apply after grace period' },
          ].map(s => (
            <div className="acc-settings-row" key={s.k}>
              <div>
                <div className="acc-settings-label">{s.label}</div>
                <div style={{ fontSize: 11, color: '#8a94a6' }}>{s.desc}</div>
              </div>
              <button
                className={`acc-toggle ${toggles[s.k] ? 'on' : 'off'}`}
                onClick={() => setToggles(p => ({ ...p, [s.k]: !p[s.k] }))}
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
export default function AccountantDashboard() {
  const [activePage, setActivePage] = useState('dashboard')

  const pages = {
    dashboard:    <DashboardPage   />,
    collection:   <CollectionPage  />,
    receipts:     <ReceiptsPage    />,
    defaulters:   <DefaultersPage  />,
    scholarship:  <ScholarshipPage />,
    payroll:      <PayrollPage     />,
    reports:      <ReportsPage     />,
    settings:     <SettingsPage    />,
  }

  return (
    <Shell active={activePage} onNav={setActivePage}>
      {pages[activePage]}
    </Shell>
  )
}