/* ═══════════════════════════════════════════════════════════════
   STUDENT PROFILE VIEW
   Admin ke liye — kisi bhi student ki full profile ek page par
   Usage:
     import StudentProfileView from './StudentProfileView'
     <StudentProfileView student={selectedStudent} onClose={()=>setViewItem(null)} />
   Props:
     student  — student object (SEED_STUDENTS ya useCRUD se)
     onClose  — back / close karne ka handler
═══════════════════════════════════════════════════════════════ */
import { useEffect, useState } from 'react'
import './StudentProfileView.css'
import { apiFetch } from '../../../services/api'

const mapStudentForView = (raw) => {
  if (!raw) return null

  const name = raw.fullName || `${raw.firstName || ''} ${raw.lastName || ''}`.trim()
  const admYear = raw.admissionYear || ''

  return {
    ...raw,
    name,
    id: raw.rollNumber,
    sem: raw.semester,
    admYear: raw.admissionYear,
    admDate: raw.admissionDate,
    email: raw.personalEmail,
    phone: raw.phone,
    address: raw.permanentAddress,
    guardian: raw.guardianName,
    guardianRel: raw.guardianRelation,
    guardianPhone: raw.guardianPhone,
    guardianEmail: raw.guardianEmail,
    guardianOcc: raw.guardianOccupation,
    hostel: raw.hostelRequired,
    transport: raw.transportRequired,
    scholarship: raw.scholarshipApplicable,
    schemeNme: raw.scholarshipScheme,
    academicYear: admYear || '—',
    batch: admYear && !Number.isNaN(Number(admYear))
      ? `${admYear}-${Number(admYear) + 4}`
      : '—',
  }
}

/* ─── Mock data (agar real data nahi aaya to ye use hoga) ─── */
const MOCK_ATTENDANCE = [
  { subject: 'Data Structures & Algo', code: 'CS601', total: 48, present: 41, pct: 85 },
  { subject: 'Operating Systems', code: 'CS602', total: 45, present: 38, pct: 84 },
  { subject: 'Database Management', code: 'CS603', total: 42, present: 28, pct: 67 },
  { subject: 'Computer Networks', code: 'CS604', total: 40, present: 35, pct: 88 },
  { subject: 'Software Engineering', code: 'CS605', total: 38, present: 30, pct: 79 },
]

const MOCK_RESULTS = [
  { sem: 5, subjects: [{ name: 'Data Comm.', internal: 28, external: 68, total: 96, grade: 'O', pass: true }, { name: 'Algorithms', internal: 24, external: 60, total: 84, grade: 'A+', pass: true }, { name: 'Web Tech', internal: 22, external: 58, total: 80, grade: 'A', pass: true }, { name: 'DBMS', internal: 18, external: 42, total: 60, grade: 'C', pass: true }, { name: 'CN Lab', internal: 25, external: 48, total: 73, grade: 'B+', pass: true }], sgpa: 8.4, result: 'Pass' },
  { sem: 4, subjects: [{ name: 'OS', internal: 20, external: 52, total: 72, grade: 'B+', pass: true }, { name: 'DBMS', internal: 15, external: 38, total: 53, grade: 'D', pass: false }, { name: 'Math IV', internal: 25, external: 65, total: 90, grade: 'O', pass: true }, { name: 'COA', internal: 22, external: 55, total: 77, grade: 'A', pass: true }], sgpa: 7.2, result: 'Fail (Back)' },
  { sem: 3, subjects: [{ name: 'DS', internal: 27, external: 65, total: 92, grade: 'O', pass: true }, { name: 'Math III', internal: 23, external: 60, total: 83, grade: 'A+', pass: true }, { name: 'OOP', internal: 26, external: 62, total: 88, grade: 'A+', pass: true }], sgpa: 8.8, result: 'Pass' },
]

const MOCK_FEES = [
  { sem: 6, amount: 45000, paid: 45000, due: 0, date: '2026-03-12', receipt: 'REC-2026-101', method: 'UPI', status: 'Paid' },
  { sem: 5, amount: 45000, paid: 45000, due: 0, date: '2025-09-10', receipt: 'REC-2025-086', method: 'Online', status: 'Paid' },
  { sem: 4, amount: 43000, paid: 43000, due: 0, date: '2025-03-08', receipt: 'REC-2025-042', method: 'Cash', status: 'Paid' },
  { sem: 3, amount: 43000, paid: 43000, due: 0, date: '2024-09-15', receipt: 'REC-2024-071', method: 'Online', status: 'Paid' },
  { sem: 2, amount: 41000, paid: 41000, due: 0, date: '2024-03-20', receipt: 'REC-2024-028', method: 'UPI', status: 'Paid' },
  { sem: 1, amount: 41000, paid: 41000, due: 0, date: '2023-09-02', receipt: 'REC-2023-001', method: 'DD', status: 'Paid' },
]

const MOCK_LIBRARY = [
  { book: 'Introduction to Algorithms', author: 'Cormen', issued: '2026-05-10', due: '2026-06-10', returned: null, fine: 0, status: 'Issued' },
  { book: 'Operating System Concepts', author: 'Silberschatz', issued: '2026-04-01', due: '2026-05-01', returned: '2026-05-02', fine: 2, status: 'Returned' },
  { book: 'Computer Networks', author: 'Tanenbaum', issued: '2026-03-15', due: '2026-04-15', returned: '2026-04-14', fine: 0, status: 'Returned' },
]

const MOCK_HOSTEL = {
  allotted: true, block: 'A', room: 'A-204', floor: 2, type: 'Triple',
  warden: 'Mr. Rajesh Sharma', wardenPhone: '9876540001',
  messPlan: 'Veg + Non-Veg', feeStatus: 'Paid', feeAmount: 12000,
  inTime: '09:30 PM', joinDate: '2021-09-01',
}

const MOCK_TRANSPORT = {
  enrolled: true, route: 'RT-01', routeName: 'College → Sector 14',
  stop: 'Sector 12 Metro', vehicle: 'HR-29-0001', driver: 'Ramesh Kumar',
  passExpiry: '2026-07-31', feePaid: true,
}

const MOCK_PLACEMENT = {
  eligible: true, cgpaCriteria: '6.5+', registeredDrives: [
    { company: 'TCS', role: 'Software Engineer', date: '2026-06-05', status: 'Applied' },
    { company: 'Infosys', role: 'Systems Engineer', date: '2026-06-12', status: 'Applied' },
    { company: 'HCL', role: 'Grad. Eng. Trainee', date: '2026-05-10', status: 'Shortlisted' },
  ]
}

/* ─── Helpers ─── */
function Pill({ children, type = 'muted' }) {
  const map = {
    green: { bg: '#EAF3DE', color: '#3B6D11' },
    red: { bg: '#FCEBEB', color: '#A32D2D' },
    amber: { bg: '#FAEEDA', color: '#854F0B' },
    blue: { bg: '#E6F1FB', color: '#185FA5' },
    teal: { bg: '#e3f3f1', color: '#0F766E' },
    purple: { bg: '#EEEDFE', color: '#534AB7' },
    muted: { bg: '#F1EFE8', color: '#5F5E5A' },
  }
  const s = map[type] || map.muted
  return (
    <span className="spv-pill" style={{ background: s.bg, color: s.color }}>
      {children}
    </span>
  )
}

function AttBar({ pct }) {
  const color = pct >= 75 ? (pct >= 85 ? '#059669' : '#2563eb') : '#dc2626'
  return (
    <div className="spv-bar-track">
      <div className="spv-bar-fill" style={{ width: `${pct}%`, background: color }} />
    </div>
  )
}

function Section({ title, icon, children }) {
  return (
    <div className="spv-section">
      <div className="spv-section-hd">
        <span className="spv-section-icon">{icon}</span>
        <span className="spv-section-title">{title}</span>
      </div>
      <div className="spv-section-body">{children}</div>
    </div>
  )
}

function InfoRow({ label, value, highlight }) {
  return (
    <div className="spv-info-row">
      <span className="spv-info-label">{label}</span>
      <span className="spv-info-value" style={highlight ? { color: highlight, fontWeight: 700 } : {}}>{value}</span>
    </div>
  )
}

/* ─── Grade color ─── */
function gradeColor(g) {
  if (['O', 'A+'].includes(g)) return '#059669'
  if (['A', 'B+'].includes(g)) return '#2563eb'
  if (['B', 'C'].includes(g)) return '#d97706'
  return '#dc2626'
}

/* ─── Print helper ─── */
function printProfile(student) {
  window.print()
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function StudentProfileView({ student, onClose, onNav }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [profile, setProfile] = useState(() => mapStudentForView(student))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const studentId = student?._id
    if (!studentId) {
      setProfile(mapStudentForView(student))
      return
    }

    const fetchProfile = async () => {
      setLoading(true)
      setError('')

      try {
        const response = await apiFetch(`/students/${studentId}`)
        setProfile(mapStudentForView(response.data))
      } catch (err) {
        setError(err.message || 'Failed to load student profile')
        setProfile(mapStudentForView(student))
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [student])

  if (!student) {
    return <h1>Student Not Found</h1>
  }

  if (!profile) {
    return <h1>Student Not Found</h1>
  }


  /* Initials from name */
  const initials = profile.name.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('')

  /* Merge mock data with real where possible */
  const attendance = MOCK_ATTENDANCE
  const results = MOCK_RESULTS
  const fees = MOCK_FEES
  const library = MOCK_LIBRARY
  const hostel = MOCK_HOSTEL
  const transport = MOCK_TRANSPORT
  const placement = MOCK_PLACEMENT

  const attPct = profile.att || Math.round(attendance.reduce((s, a) => s + a.pct, 0) / attendance.length)
  const totalFee = fees.reduce((s, f) => s + f.amount, 0)
  const totalPaid = fees.reduce((s, f) => s + f.paid, 0)

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '👤' },
    { id: 'attendance', label: 'Attendance', icon: '📅' },
    { id: 'results', label: 'Results', icon: '📊' },
    { id: 'fees', label: 'Fees', icon: '💰' },
    { id: 'library', label: 'Library', icon: '📚' },
    { id: 'hostel', label: 'Hostel', icon: '🏠' },
    { id: 'transport', label: 'Transport', icon: '🚌' },
    { id: 'placement', label: 'Placement', icon: '🏢' },
  ]

  return (
    <div className="spv-root">

      {/* ─── TOP BAR ─── */}
      <div className="spv-topbar">
        <button className="spv-back" onClick={onClose}>
          ← Back to Students
        </button>
        <div className="spv-topbar-right">
          {loading && <span className="spv-back">Loading profile...</span>}
          {error && <span className="spv-back">{error}</span>}
          <button className="spv-btn-outline" onClick={() => printProfile(profile)}>🖨 Print</button>
          <button className="spv-btn-outline">✉ Send Email</button>
          <button className="spv-btn-primary" onClick={() => onNav("editStudent", profile)}>✏ Edit Profile</button>
          <button
            className="spv-btn-secondary"
            onClick={() => onNav("studentIdCard", profile)}
          >
             Generate ID Card
          </button>
        </div>
      </div>

      {/* ─── HERO CARD ─── */}
      <div className="spv-hero">
        <div className="spv-hero-left">
          <div className="spv-avatar">{initials}</div>
          <div className="spv-hero-info">
            <h1 className="spv-name">{profile.name}</h1>
            <div className="spv-sub-line">
              <span className="spv-roll">{profile.id}</span>
              <Pill type="teal">{profile.branch}</Pill>
              <Pill type="blue">Sem {profile.sem}</Pill>
              <Pill type="muted">Section {profile.section || 'A'}</Pill>
              {profile.status === 'Active' ? <Pill type="green">Active</Pill> : <Pill type="red">{profile.status}</Pill>}
            </div>
            <div className="spv-hero-tags">
              <span>📧 {profile.email || `${profile.id.toLowerCase()}@student.college.edu`}</span>
              <span>📞 {profile.phone || '—'}</span>
              <span>🎂 {profile.dob || '—'}</span>
              <span>📍 {profile.address || '—'}</span>
            </div>
          </div>
        </div>

        {/* Right: 4 quick stats */}
        <div className="spv-hero-stats">
          {[
            { val: `${attPct}%`, label: 'Attendance', color: attPct >= 75 ? '#059669' : '#dc2626', bg: attPct >= 75 ? '#EAF3DE' : '#FCEBEB' },
            { val: profile.cgpa || '8.4', label: 'CGPA', color: '#2563eb', bg: '#E6F1FB' },
            { val: profile.fee || 'Paid', label: 'Fee Status', color: profile.fee === 'Paid' ? '#059669' : '#dc2626', bg: profile.fee === 'Paid' ? '#EAF3DE' : '#FCEBEB' },
            { val: profile.admYear || '2021', label: 'Adm. Year', color: '#534AB7', bg: '#EEEDFE' },
          ].map((s, i) => (
            <div className="spv-stat-card" key={i} style={{ background: s.bg }}>
              <div className="spv-stat-val" style={{ color: s.color }}>{s.val}</div>
              <div className="spv-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── TABS ─── */}
      <div className="spv-tabs">
        {tabs.map(t => (
          <button
            key={t.id}
            className={`spv-tab${activeTab === t.id ? ' active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ─── TAB CONTENT ─── */}
      <div className="spv-body">

        {/* ════ TAB 1: OVERVIEW ════ */}
        {activeTab === 'overview' && (
          <div className="spv-grid-2">

            {/* Personal Info */}
            <Section title="Personal Information" icon="👤">
              <InfoRow label="Full Name" value={profile.name} />
              <InfoRow label="Roll Number" value={profile.id} />
              <InfoRow label="Date of Birth" value={profile.dob || '—'} />
              <InfoRow label="Email" value={profile.email || `${profile.id.toLowerCase()}@student.college.edu`} />
              <InfoRow label="Phone" value={profile.phone || '—'} />
              <InfoRow label="Address" value={profile.address || '—'} />
              <InfoRow label="Category" value="OBC" />
              <InfoRow label="Blood Group" value="B+" />
            </Section>

            {/* Academic Info */}
            <Section title="Academic Details" icon="🎓">
              <InfoRow label="Branch" value={profile.branch} />
              <InfoRow label="Current Semester" value={`Sem ${profile.sem}`} />
              <InfoRow label="Section" value={profile.section || 'A'} />
              <InfoRow label="Admission Year" value={profile.admYear || '2021'} />
              <InfoRow label="Batch" value={`${profile.admYear || 2021}–${(Number(profile.admYear || 2021) + 4)}`} />
              <InfoRow label="Current CGPA" value={profile.cgpa || '8.4'} highlight="#2563eb" />
              <InfoRow label="Backlog subjects" value="1 (DBMS · Sem 4)" highlight="#dc2626" />
              <InfoRow label="Academic Status" value={profile.status} highlight={profile.status === 'Active' ? '#059669' : '#dc2626'} />
            </Section>

            {/* Guardian Info */}
            <Section title="Guardian / Parent Details" icon="👨‍👩‍👦">
              <InfoRow label="Guardian Name" value={profile.guardian || '—'} />
              <InfoRow label="Relationship" value={profile.guardianRel || '—'} />
              <InfoRow label="Phone" value={profile.guardianPhone || '—'} />
              <InfoRow label="Email" value={profile.guardianEmail || '—'} />
              <InfoRow label="Occupation" value={profile.guardianOcc || '—'} />
              <InfoRow label="Annual Income" value="₹4.5 Lakh" />
            </Section>

            <Section title="Certificates" icon="📜">
              <div className="spv-cert-grid">

                <button
                  className="spv-cert-btn"
                  onClick={() => onNav("bonafideCertificate", student)}
                >
                  Bonafide Certificate
                </button>

                <button
                  className="spv-cert-btn"
                  onClick={() => onNav("characterCertificate", student)}
                >
                  Character Certificate
                </button>

                <button
                  className="spv-cert-btn"
                  onClick={() => onNav("transferCertificate", student)}
                >
                  Transfer Certificate
                </button>

              </div>
            </Section>

            {/* Documents */}
            <Section title="Documents Uploaded" icon="📄">
              {[
                { doc: 'Aadhar Card', status: 'Verified', icon: '✅' },
                { doc: '10th Marksheet', status: 'Verified', icon: '✅' },
                { doc: '12th Marksheet', status: 'Verified', icon: '✅' },
                { doc: 'Transfer Certificate', status: 'Verified', icon: '✅' },
                { doc: 'Category Certificate', status: 'Pending', icon: '⏳' },
                { doc: 'Income Certificate', status: 'Missing', icon: '❌' },
              ].map((d, i) => (
                <div className="spv-doc-row" key={i}>
                  <span className="spv-doc-icon">{d.icon}</span>
                  <span className="spv-doc-name">{d.doc}</span>
                  <Pill type={d.status === 'Verified' ? 'green' : d.status === 'Pending' ? 'amber' : 'red'}>{d.status}</Pill>
                </div>
              ))}
            </Section>

          </div>
        )}

        {/* ════ TAB 2: ATTENDANCE ════ */}
        {activeTab === 'attendance' && (
          <>
            {/* Summary KPIs */}
            <div className="spv-kpi-row">
              {[
                { val: `${attPct}%`, label: 'Overall Attendance', color: attPct >= 75 ? '#059669' : '#dc2626', bg: attPct >= 75 ? '#EAF3DE' : '#FCEBEB' },
                { val: attendance.reduce((s, a) => s + a.present, 0), label: 'Total Classes Present', color: '#2563eb', bg: '#E6F1FB' },
                { val: attendance.reduce((s, a) => s + a.total, 0), label: 'Total Classes Held', color: '#534AB7', bg: '#EEEDFE' },
                { val: attendance.filter(a => a.pct < 75).length, label: 'Subjects Below 75%', color: '#dc2626', bg: '#FCEBEB' },
              ].map((k, i) => (
                <div className="spv-kpi" key={i} style={{ background: k.bg }}>
                  <div className="spv-kpi-val" style={{ color: k.color }}>{k.val}</div>
                  <div className="spv-kpi-label">{k.label}</div>
                </div>
              ))}
            </div>

            {/* Subject-wise table */}
            <Section title="Subject-wise Attendance — Sem 6" icon="📅">
              <table className="spv-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Code</th>
                    <th>Total Classes</th>
                    <th>Present</th>
                    <th>Absent</th>
                    <th>Attendance %</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((a, i) => {
                    const color = a.pct >= 75 ? '#059669' : '#dc2626'
                    return (
                      <tr key={i}>
                        <td className="spv-td-bold">{a.subject}</td>
                        <td><span className="spv-code-tag">{a.code}</span></td>
                        <td>{a.total}</td>
                        <td style={{ color: '#059669', fontWeight: 600 }}>{a.present}</td>
                        <td style={{ color: '#dc2626', fontWeight: 600 }}>{a.total - a.present}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <AttBar pct={a.pct} />
                            <span style={{ color, fontWeight: 700, minWidth: 36 }}>{a.pct}%</span>
                          </div>
                        </td>
                        <td>
                          {a.pct >= 75
                            ? <Pill type="green">OK</Pill>
                            : <Pill type="red">⚠ Short</Pill>
                          }
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </Section>

            {/* Shortage warning */}
            {attendance.some(a => a.pct < 75) && (
              <div className="spv-alert spv-alert-danger">
                <span className="spv-alert-icon">⚠</span>
                <div>
                  <strong>Attendance shortage detected</strong>
                  {attendance.filter(a => a.pct < 75).map(a => {
                    const needed = Math.ceil((0.75 * a.total - a.present) / 0.25)
                    return (
                      <div key={a.code} style={{ fontSize: 12, marginTop: 3 }}>
                        {a.subject} ({a.pct}%) — {needed} more class{needed !== 1 ? 'es' : ''} needed to reach 75%
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Monthly trend */}
            <Section title="Monthly Attendance Trend — 2026" icon="📈">
              <div className="spv-month-grid">
                {[['Jan', 88], ['Feb', 84], ['Mar', 81], ['Apr', 79], ['May', 76]].map(([m, p]) => (
                  <div key={m} className="spv-month-cell">
                    <div className="spv-month-bar-wrap">
                      <div className="spv-month-bar" style={{ height: `${p}%`, background: p >= 75 ? '#0F766E' : '#dc2626' }} />
                    </div>
                    <div className="spv-month-pct" style={{ color: p >= 75 ? '#059669' : '#dc2626' }}>{p}%</div>
                    <div className="spv-month-label">{m}</div>
                  </div>
                ))}
              </div>
            </Section>
          </>
        )}

        {/* ════ TAB 3: RESULTS ════ */}
        {activeTab === 'results' && (
          <>
            <div className="spv-kpi-row">
              {[
                { val: profile.cgpa || '8.4', label: 'Overall CGPA', color: '#2563eb', bg: '#E6F1FB' },
                { val: results[0]?.sgpa, label: 'Last Sem SGPA', color: '#059669', bg: '#EAF3DE' },
                { val: '1', label: 'Active Backlogs', color: '#dc2626', bg: '#FCEBEB' },
                { val: `${results.length * 5}`, label: 'Total Subjects', color: '#534AB7', bg: '#EEEDFE' },
              ].map((k, i) => (
                <div className="spv-kpi" key={i} style={{ background: k.bg }}>
                  <div className="spv-kpi-val" style={{ color: k.color }}>{k.val}</div>
                  <div className="spv-kpi-label">{k.label}</div>
                </div>
              ))}
            </div>

            {results.map((r, ri) => (
              <Section key={ri} title={`Semester ${r.sem} Result`} icon="📊">
                <div style={{ display: 'flex', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
                  <div className="spv-sem-badge">SGPA: <strong>{r.sgpa}</strong></div>
                  <Pill type={r.result === 'Pass' ? 'green' : 'red'}>{r.result}</Pill>
                </div>
                <table className="spv-table">
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th style={{ textAlign: 'center' }}>Internal (30)</th>
                      <th style={{ textAlign: 'center' }}>External (70)</th>
                      <th style={{ textAlign: 'center' }}>Total (100)</th>
                      <th style={{ textAlign: 'center' }}>Grade</th>
                      <th style={{ textAlign: 'center' }}>Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {r.subjects.map((s, si) => (
                      <tr key={si} style={{ background: !s.pass ? '#fff9f9' : '' }}>
                        <td className="spv-td-bold">{s.name}</td>
                        <td style={{ textAlign: 'center' }}>{s.internal}</td>
                        <td style={{ textAlign: 'center' }}>{s.external}</td>
                        <td style={{ textAlign: 'center', fontWeight: 700, color: '#1a3a6e' }}>{s.total}</td>
                        <td style={{ textAlign: 'center' }}>
                          <span style={{ fontWeight: 800, color: gradeColor(s.grade) }}>{s.grade}</span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          {s.pass
                            ? <Pill type="green">Pass</Pill>
                            : <Pill type="red">Fail</Pill>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Section>
            ))}

            {/* CGPA trend */}
            <Section title="CGPA Progression" icon="📈">
              <div className="spv-cgpa-row">
                {[['Sem 1', '8.2'], ['Sem 2', '8.5'], ['Sem 3', '8.8'], ['Sem 4', '7.2'], ['Sem 5', '8.4'], ['Sem 6', '—']].map(([s, c], i) => (
                  <div key={i} className="spv-cgpa-cell">
                    <div className="spv-cgpa-val" style={{ color: c === '—' ? '#aab0bc' : Number(c) >= 7.5 ? '#059669' : '#dc2626' }}>{c}</div>
                    <div className="spv-cgpa-sem">{s}</div>
                  </div>
                ))}
              </div>
            </Section>
          </>
        )}

        {/* ════ TAB 4: FEES ════ */}
        {activeTab === 'fees' && (
          <>
            <div className="spv-kpi-row">
              {[
                { val: `₹${totalFee.toLocaleString()}`, label: 'Total Fee (6 sems)', color: '#1a3a6e', bg: '#eff4ff' },
                { val: `₹${totalPaid.toLocaleString()}`, label: 'Total Paid', color: '#059669', bg: '#EAF3DE' },
                { val: `₹${(totalFee - totalPaid).toLocaleString()}`, label: 'Outstanding Due', color: '#dc2626', bg: '#FCEBEB' },
                { val: fees.filter(f => f.status === 'Paid').length + '/' + fees.length, label: 'Semesters Cleared', color: '#534AB7', bg: '#EEEDFE' },
              ].map((k, i) => (
                <div className="spv-kpi" key={i} style={{ background: k.bg }}>
                  <div className="spv-kpi-val" style={{ color: k.color }}>{k.val}</div>
                  <div className="spv-kpi-label">{k.label}</div>
                </div>
              ))}
            </div>

            <Section title="Semester-wise Fee History" icon="💰">
              <table className="spv-table">
                <thead>
                  <tr>
                    <th>Semester</th>
                    <th>Amount</th>
                    <th>Paid</th>
                    <th>Due</th>
                    <th>Method</th>
                    <th>Date</th>
                    <th>Receipt</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {fees.map((f, i) => (
                    <tr key={i}>
                      <td className="spv-td-bold">Sem {f.sem}</td>
                      <td style={{ color: '#1a3a6e', fontWeight: 600 }}>₹{f.amount.toLocaleString()}</td>
                      <td style={{ color: '#059669', fontWeight: 700 }}>₹{f.paid.toLocaleString()}</td>
                      <td style={{ color: f.due > 0 ? '#dc2626' : '#059669', fontWeight: 600 }}>
                        {f.due > 0 ? `₹${f.due.toLocaleString()}` : '—'}
                      </td>
                      <td style={{ color: '#6b7a99' }}>{f.method}</td>
                      <td style={{ color: '#6b7a99', fontSize: 11 }}>{f.date}</td>
                      <td style={{ fontFamily: 'monospace', fontSize: 10, color: '#6b7a99' }}>{f.receipt}</td>
                      <td>
                        <Pill type={f.status === 'Paid' ? 'green' : f.status === 'Partial' ? 'amber' : 'red'}>{f.status}</Pill>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Section>

            {/* Scholarship section */}
            <Section title="Scholarship Status" icon="🎖">
              <div className="spv-scholar-card">
                <div className="spv-scholar-left">
                  <div className="spv-scholar-scheme">NSP — OBC Scholarship</div>
                  <div className="spv-scholar-detail">National Scholarship Portal · Government of India</div>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, fontSize: 18, color: '#3B6D11' }}>₹25,000</div>
                    <div style={{ fontSize: 11, color: '#6b7a99' }}>AY 2025–26</div>
                  </div>
                  <Pill type="green">Approved</Pill>
                </div>
              </div>
            </Section>
          </>
        )}

        {/* ════ TAB 5: LIBRARY ════ */}
        {activeTab === 'library' && (
          <>
            <div className="spv-kpi-row">
              {[
                { val: library.filter(b => b.status === 'Issued').length, label: 'Currently Issued', color: '#854F0B', bg: '#FAEEDA' },
                { val: library.filter(b => b.status === 'Returned').length, label: 'Returned', color: '#059669', bg: '#EAF3DE' },
                { val: library.reduce((s, b) => s + b.fine, 0), label: 'Total Fine (₹)', color: '#dc2626', bg: '#FCEBEB' },
                { val: library.length, label: 'Total Issues', color: '#2563eb', bg: '#E6F1FB' },
              ].map((k, i) => (
                <div className="spv-kpi" key={i} style={{ background: k.bg }}>
                  <div className="spv-kpi-val" style={{ color: k.color }}>{k.val}</div>
                  <div className="spv-kpi-label">{k.label}</div>
                </div>
              ))}
            </div>

            <Section title="Library Book History" icon="📚">
              <table className="spv-table">
                <thead>
                  <tr>
                    <th>Book Title</th>
                    <th>Author</th>
                    <th>Issue Date</th>
                    <th>Due Date</th>
                    <th>Return Date</th>
                    <th>Fine (₹)</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {library.map((b, i) => (
                    <tr key={i} style={{ background: b.status === 'Issued' && new Date(b.due) < new Date() ? '#fff8f8' : '' }}>
                      <td className="spv-td-bold">{b.book}</td>
                      <td style={{ color: '#6b7a99', fontSize: 11 }}>{b.author}</td>
                      <td style={{ fontSize: 11, color: '#6b7a99' }}>{b.issued}</td>
                      <td style={{ fontWeight: 600, color: new Date(b.due) < new Date() && !b.returned ? '#dc2626' : '#1a3a6e', fontSize: 11 }}>{b.due}</td>
                      <td style={{ color: '#059669', fontSize: 11 }}>{b.returned || '—'}</td>
                      <td style={{ color: b.fine > 0 ? '#dc2626' : '#059669', fontWeight: 700 }}>{b.fine > 0 ? `₹${b.fine}` : '—'}</td>
                      <td>
                        <Pill type={b.status === 'Issued' ? 'amber' : 'green'}>{b.status}</Pill>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Section>
          </>
        )}

        {/* ════ TAB 6: HOSTEL ════ */}
        {activeTab === 'hostel' && (
          <>
            {hostel.allotted ? (
              <>
                <div className="spv-kpi-row">
                  {[
                    { val: `${hostel.block}-${hostel.room.split('-')[1]}`, label: 'Room Number', color: '#0F766E', bg: '#e3f3f1' },
                    { val: `Block ${hostel.block}`, label: 'Block', color: '#2563eb', bg: '#E6F1FB' },
                    { val: hostel.type, label: 'Room Type', color: '#534AB7', bg: '#EEEDFE' },
                    { val: hostel.feeStatus, label: 'Fee Status', color: hostel.feeStatus === 'Paid' ? '#059669' : '#dc2626', bg: hostel.feeStatus === 'Paid' ? '#EAF3DE' : '#FCEBEB' },
                  ].map((k, i) => (
                    <div className="spv-kpi" key={i} style={{ background: k.bg }}>
                      <div className="spv-kpi-val" style={{ color: k.color }}>{k.val}</div>
                      <div className="spv-kpi-label">{k.label}</div>
                    </div>
                  ))}
                </div>

                <div className="spv-grid-2">
                  <Section title="Room Details" icon="🏠">
                    <InfoRow label="Room Number" value={hostel.room} />
                    <InfoRow label="Block" value={`Block ${hostel.block}`} />
                    <InfoRow label="Floor" value={`Floor ${hostel.floor}`} />
                    <InfoRow label="Room Type" value={hostel.type} />
                    <InfoRow label="Mess Plan" value={hostel.messPlan} />
                    <InfoRow label="Joining Date" value={hostel.joinDate} />
                    <InfoRow label="Fee Amount" value={`₹${hostel.feeAmount.toLocaleString()}/sem`} />
                    <InfoRow label="Fee Status" value={hostel.feeStatus} highlight={hostel.feeStatus === 'Paid' ? '#059669' : '#dc2626'} />
                  </Section>

                  <Section title="Warden Details" icon="👮">
                    <InfoRow label="Warden Name" value={hostel.warden} />
                    <InfoRow label="Phone" value={hostel.wardenPhone} />
                    <InfoRow label="In-time" value={hostel.inTime} />
                    <InfoRow label="Block" value={`Block ${hostel.block}`} />

                    <div style={{ marginTop: 16 }}>
                      <div className="spv-section-title" style={{ marginBottom: 10 }}>Today's Mess Menu</div>
                      {[['Breakfast', 'Poha, Chai, Bread'], ['Lunch', 'Dal, Rice, Sabzi, Roti'], ['Snacks', 'Samosa, Tea'], ['Dinner', 'Paneer Masala, Dal, Rice']].map(([m, f]) => (
                        <div key={m} className="spv-mess-row">
                          <span className="spv-mess-time">{m}</span>
                          <span className="spv-mess-food">{f}</span>
                        </div>
                      ))}
                    </div>
                  </Section>
                </div>
              </>
            ) : (
              <div className="spv-empty">
                <div style={{ fontSize: 36 }}>🏠</div>
                <div className="spv-empty-title">Not allotted hostel</div>
                <div className="spv-empty-sub">This student is a day scholar or hostel not assigned yet.</div>
              </div>
            )}
          </>
        )}

        {/* ════ TAB 7: TRANSPORT ════ */}
        {activeTab === 'transport' && (
          <>
            {transport.enrolled ? (
              <>
                <div className="spv-kpi-row">
                  {[
                    { val: transport.route, label: 'Route ID', color: '#2563eb', bg: '#E6F1FB' },
                    { val: transport.stop, label: 'Boarding Stop', color: '#0F766E', bg: '#e3f3f1' },
                    { val: transport.vehicle, label: 'Vehicle No.', color: '#534AB7', bg: '#EEEDFE' },
                    { val: transport.feePaid ? 'Paid' : 'Pending', label: 'Bus Pass Fee', color: transport.feePaid ? '#059669' : '#dc2626', bg: transport.feePaid ? '#EAF3DE' : '#FCEBEB' },
                  ].map((k, i) => (
                    <div className="spv-kpi" key={i} style={{ background: k.bg }}>
                      <div className="spv-kpi-val" style={{ color: k.color }}>{k.val}</div>
                      <div className="spv-kpi-label">{k.label}</div>
                    </div>
                  ))}
                </div>

                <Section title="Transport Details" icon="🚌">
                  <InfoRow label="Route ID" value={transport.route} />
                  <InfoRow label="Route Name" value={transport.routeName} />
                  <InfoRow label="Boarding Stop" value={transport.stop} />
                  <InfoRow label="Vehicle Number" value={transport.vehicle} />
                  <InfoRow label="Driver Name" value={transport.driver} />
                  <InfoRow label="Pass Expiry" value={transport.passExpiry} />
                  <InfoRow label="Fee Status" value={transport.feePaid ? 'Paid' : 'Pending'} highlight={transport.feePaid ? '#059669' : '#dc2626'} />
                </Section>
              </>
            ) : (
              <div className="spv-empty">
                <div style={{ fontSize: 36 }}>🚌</div>
                <div className="spv-empty-title">No transport enrollment</div>
                <div className="spv-empty-sub">Student not enrolled in college bus service.</div>
              </div>
            )}
          </>
        )}

        {/* ════ TAB 8: PLACEMENT ════ */}
        {activeTab === 'placement' && (
          <>
            <div className="spv-kpi-row">
              {[
                { val: profile.cgpa || '8.4', label: 'CGPA', color: '#2563eb', bg: '#E6F1FB' },
                { val: placement.eligible ? 'Yes' : 'No', label: 'Eligible', color: placement.eligible ? '#059669' : '#dc2626', bg: placement.eligible ? '#EAF3DE' : '#FCEBEB' },
                { val: placement.registeredDrives.length, label: 'Drives Applied', color: '#534AB7', bg: '#EEEDFE' },
                { val: placement.registeredDrives.filter(d => d.status === 'Shortlisted').length, label: 'Shortlisted', color: '#854F0B', bg: '#FAEEDA' },
              ].map((k, i) => (
                <div className="spv-kpi" key={i} style={{ background: k.bg }}>
                  <div className="spv-kpi-val" style={{ color: k.color }}>{k.val}</div>
                  <div className="spv-kpi-label">{k.label}</div>
                </div>
              ))}
            </div>

            <Section title="Placement Drives Registered" icon="🏢">
              <table className="spv-table">
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Role</th>
                    <th>Drive Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {placement.registeredDrives.map((d, i) => (
                    <tr key={i}>
                      <td className="spv-td-bold">{d.company}</td>
                      <td style={{ color: '#6b7a99', fontSize: 11 }}>{d.role}</td>
                      <td style={{ color: '#6b7a99', fontSize: 11 }}>{d.date}</td>
                      <td>
                        <Pill type={d.status === 'Shortlisted' ? 'green' : d.status === 'Applied' ? 'blue' : 'muted'}>{d.status}</Pill>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Section>

            {/* Eligibility criteria */}
            <Section title="Eligibility Criteria" icon="✅">
              <div className="spv-elig-grid">
                {[
                  { label: 'CGPA ≥ 6.5', met: Number(profile.cgpa || 8.4) >= 6.5 },
                  { label: 'No active KT', met: false },
                  { label: 'Attendance ≥ 75%', met: attPct >= 75 },
                  { label: 'Fee cleared', met: profile.fee !== 'Overdue' },
                  { label: 'Registered on portal', met: true },
                  { label: 'Resume uploaded', met: true },
                ].map((e, i) => (
                  <div key={i} className={`spv-elig-item ${e.met ? 'met' : 'not-met'}`}>
                    <span>{e.met ? '✅' : '❌'}</span>
                    <span>{e.label}</span>
                  </div>
                ))}
              </div>
              {!placement.eligible && (
                <div className="spv-alert spv-alert-danger" style={{ marginTop: 12 }}>
                  <span className="spv-alert-icon">⚠</span>
                  <span>Student has 1 active backlog — not eligible for many drives.</span>
                </div>
              )}
            </Section>
          </>
        )}

      </div>
    </div>
  )
}