import { useState } from 'react'
import './AdmissionsPage.css'
import {
  IconPlus,
  IconSearch,
  IconDownload,
  IconEdit,
  IconEye,
  IconCheck,
  IconX,
  IconFilter,
  IconUsers,
} from '../../../components/Icons'

/* ══════════════════════════════
   MOCK DATA
══════════════════════════════ */
const initialApplications = [
  {
    id: 'ADM-2026-001', name: 'Rahul Sharma',     photo: null,
    dob: '2005-03-14', gender: 'Male',   phone: '9876543210', email: 'rahul@gmail.com',
    father: 'Ramesh Sharma', mother: 'Sunita Sharma', parentPhone: '9876500001',
    address: 'H-14, Sector 18, Faridabad, Haryana',
    class10: '92%', class12: '88%', category: 'General',
    branch: 'CSE', appliedDate: '10 May 2026', status: 'Approved',
  },
  {
    id: 'ADM-2026-002', name: 'Priya Singh',      photo: null,
    dob: '2005-07-22', gender: 'Female', phone: '9876543211', email: 'priya@gmail.com',
    father: 'Suresh Singh',  mother: 'Meena Singh',  parentPhone: '9876500002',
    address: '42, Model Town, Delhi',
    class10: '89%', class12: '85%', category: 'OBC',
    branch: 'ECE', appliedDate: '12 May 2026', status: 'Pending',
  },
  {
    id: 'ADM-2026-003', name: 'Arjun Verma',      photo: null,
    dob: '2005-01-08', gender: 'Male',   phone: '9876543212', email: 'arjun@gmail.com',
    father: 'Anil Verma',    mother: 'Rekha Verma',  parentPhone: '9876500003',
    address: '7, Green Park, Gurugram, Haryana',
    class10: '78%', class12: '74%', category: 'SC',
    branch: 'MECH', appliedDate: '14 May 2026', status: 'Under Review',
  },
  {
    id: 'ADM-2026-004', name: 'Sneha Patel',      photo: null,
    dob: '2005-11-30', gender: 'Female', phone: '9876543213', email: 'sneha@gmail.com',
    father: 'Vikram Patel',  mother: 'Nisha Patel',  parentPhone: '9876500004',
    address: 'B-22, Lajpat Nagar, New Delhi',
    class10: '95%', class12: '93%', category: 'General',
    branch: 'IT',   appliedDate: '15 May 2026', status: 'Approved',
  },
  {
    id: 'ADM-2026-005', name: 'Karan Malhotra',   photo: null,
    dob: '2005-05-19', gender: 'Male',   phone: '9876543214', email: 'karan@gmail.com',
    father: 'Rajiv Malhotra',mother: 'Pooja Malhotra',parentPhone: '9876500005',
    address: 'C-9, Vasant Kunj, New Delhi',
    class10: '82%', class12: '79%', category: 'General',
    branch: 'CIVIL',appliedDate: '16 May 2026', status: 'Rejected',
  },
  {
    id: 'ADM-2026-006', name: 'Anjali Gupta',     photo: null,
    dob: '2005-09-12', gender: 'Female', phone: '9876543215', email: 'anjali@gmail.com',
    father: 'Deepak Gupta',  mother: 'Sunita Gupta', parentPhone: '9876500006',
    address: '18, Rohini Sector 7, Delhi',
    class10: '91%', class12: '87%', category: 'OBC',
    branch: 'CSE',  appliedDate: '17 May 2026', status: 'Pending',
  },
]

const STATUS_CONFIG = {
  Approved:     { bg: '#EAF3DE', color: '#3B6D11' },
  Pending:      { bg: '#FAEEDA', color: '#854F0B' },
  'Under Review':{ bg: '#E6F1FB', color: '#185FA5' },
  Rejected:     { bg: '#FCEBEB', color: '#A32D2D' },
}

const BRANCHES  = ['CSE', 'ECE', 'MECH', 'IT', 'CIVIL']
const CATS      = ['General', 'OBC', 'SC', 'ST', 'EWS']
const STATUSES  = ['Approved', 'Pending', 'Under Review', 'Rejected']

/* ══════════════════════════════
   ADD APPLICATION MODAL
══════════════════════════════ */
function AddModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    name: '', dob: '', gender: 'Male', phone: '', email: '',
    father: '', mother: '', parentPhone: '', address: '',
    class10: '', class12: '', category: 'General', branch: 'CSE',
  })
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSave = () => {
    if (!form.name || !form.phone || !form.branch) return
    onSave({
      ...form,
      id: `ADM-2026-${String(Math.floor(Math.random() * 900) + 100)}`,
      appliedDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Pending',
      photo: null,
    })
    onClose()
  }

  return (
    <div className="adm-modal-overlay" onClick={onClose}>
      <div className="adm-modal" onClick={e => e.stopPropagation()}>
        <div className="adm-modal-header">
          <span className="adm-modal-title">New Admission Application</span>
          <button className="adm-icon-btn" onClick={onClose}><IconX size={16} /></button>
        </div>

        <div className="adm-modal-body">
          <div className="adm-form-section">Personal Details</div>
          <div className="adm-form-grid-2">
            <div className="adm-form-group">
              <label>Full Name *</label>
              <input placeholder="Rahul Sharma" value={form.name} onChange={e => set('name', e.target.value)} />
            </div>
            <div className="adm-form-group">
              <label>Date of Birth</label>
              <input type="date" value={form.dob} onChange={e => set('dob', e.target.value)} />
            </div>
            <div className="adm-form-group">
              <label>Gender</label>
              <select value={form.gender} onChange={e => set('gender', e.target.value)}>
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>
            <div className="adm-form-group">
              <label>Phone *</label>
              <input placeholder="9876543210" value={form.phone} onChange={e => set('phone', e.target.value)} />
            </div>
            <div className="adm-form-group adm-col-2">
              <label>Email</label>
              <input placeholder="student@email.com" value={form.email} onChange={e => set('email', e.target.value)} />
            </div>
          </div>

          <div className="adm-form-section">Parent / Guardian Details</div>
          <div className="adm-form-grid-2">
            <div className="adm-form-group">
              <label>Father's Name</label>
              <input placeholder="Ramesh Sharma" value={form.father} onChange={e => set('father', e.target.value)} />
            </div>
            <div className="adm-form-group">
              <label>Mother's Name</label>
              <input placeholder="Sunita Sharma" value={form.mother} onChange={e => set('mother', e.target.value)} />
            </div>
            <div className="adm-form-group">
              <label>Parent Phone</label>
              <input placeholder="9876500001" value={form.parentPhone} onChange={e => set('parentPhone', e.target.value)} />
            </div>
            <div className="adm-form-group">
              <label>Category</label>
              <select value={form.category} onChange={e => set('category', e.target.value)}>
                {CATS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="adm-form-group adm-col-2">
              <label>Address</label>
              <input placeholder="H-14, Sector 18, Faridabad, Haryana" value={form.address} onChange={e => set('address', e.target.value)} />
            </div>
          </div>

          <div className="adm-form-section">Academic Details</div>
          <div className="adm-form-grid-2">
            <div className="adm-form-group">
              <label>Class 10 Percentage</label>
              <input placeholder="92%" value={form.class10} onChange={e => set('class10', e.target.value)} />
            </div>
            <div className="adm-form-group">
              <label>Class 12 Percentage</label>
              <input placeholder="88%" value={form.class12} onChange={e => set('class12', e.target.value)} />
            </div>
            <div className="adm-form-group">
              <label>Applied Branch *</label>
              <select value={form.branch} onChange={e => set('branch', e.target.value)}>
                {BRANCHES.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="adm-modal-footer">
          <button className="adm-btn-outline" onClick={onClose}>Cancel</button>
          <button className="adm-btn-primary" onClick={handleSave}>
            <IconCheck size={13} /> Save Application
          </button>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════
   VIEW / EDIT MODAL
══════════════════════════════ */
function ViewModal({ app, onClose, onStatusChange }) {
  const initials = app.name.split(' ').map(n => n[0]).join('').slice(0, 2)

  return (
    <div className="adm-modal-overlay" onClick={onClose}>
      <div className="adm-modal adm-modal-wide" onClick={e => e.stopPropagation()}>
        <div className="adm-modal-header">
          <span className="adm-modal-title">Application — {app.id}</span>
          <button className="adm-icon-btn" onClick={onClose}><IconX size={16} /></button>
        </div>

        <div className="adm-modal-body">
          {/* Profile header */}
          <div className="adm-profile-header">
            <div className="adm-profile-avatar">{initials}</div>
            <div>
              <div className="adm-profile-name">{app.name}</div>
              <div className="adm-profile-meta">{app.branch} · {app.category} · Applied {app.appliedDate}</div>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <span className="adm-status-pill" style={{ background: STATUS_CONFIG[app.status]?.bg, color: STATUS_CONFIG[app.status]?.color }}>
                {app.status}
              </span>
            </div>
          </div>

          <div className="adm-detail-grid">
            {/* Personal */}
            <div className="adm-detail-section">
              <div className="adm-detail-title">Personal Details</div>
              {[
                ['Date of Birth', app.dob],
                ['Gender',        app.gender],
                ['Phone',         app.phone],
                ['Email',         app.email],
                ['Address',       app.address],
              ].map(([k, v]) => (
                <div className="adm-detail-row" key={k}>
                  <span className="adm-detail-key">{k}</span>
                  <span className="adm-detail-val">{v}</span>
                </div>
              ))}
            </div>

            {/* Parent */}
            <div className="adm-detail-section">
              <div className="adm-detail-title">Parent / Guardian</div>
              {[
                ["Father's Name", app.father],
                ["Mother's Name", app.mother],
                ['Parent Phone',  app.parentPhone],
                ['Category',      app.category],
              ].map(([k, v]) => (
                <div className="adm-detail-row" key={k}>
                  <span className="adm-detail-key">{k}</span>
                  <span className="adm-detail-val">{v}</span>
                </div>
              ))}
            </div>

            {/* Academic */}
            <div className="adm-detail-section">
              <div className="adm-detail-title">Academic Details</div>
              {[
                ['Class 10',       app.class10],
                ['Class 12',       app.class12],
                ['Applied Branch', app.branch],
              ].map(([k, v]) => (
                <div className="adm-detail-row" key={k}>
                  <span className="adm-detail-key">{k}</span>
                  <span className="adm-detail-val">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Status change */}
          <div className="adm-status-change">
            <span style={{ fontSize: 12, fontWeight: 600, color: '#6b7a99' }}>Change status:</span>
            <div className="adm-status-btns">
              {STATUSES.map(s => (
                <button
                  key={s}
                  className={`adm-status-btn ${app.status === s ? 'active' : ''}`}
                  style={app.status === s ? { background: STATUS_CONFIG[s].bg, color: STATUS_CONFIG[s].color, border: `1.5px solid ${STATUS_CONFIG[s].color}` } : {}}
                  onClick={() => onStatusChange(app.id, s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="adm-modal-footer">
          <button className="adm-btn-outline" onClick={onClose}>Close</button>
          <button className="adm-btn-primary"><IconDownload size={13} /> Download Application</button>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════
   MAIN PAGE
══════════════════════════════ */
export default function AdmissionsPage({ onClose }) {
  const [apps,        setApps]        = useState(initialApplications)
  const [search,      setSearch]      = useState('')
  const [filterBranch,setFilterBranch]= useState('All')
  const [filterStatus,setFilterStatus]= useState('All')
  const [showAdd,     setShowAdd]     = useState(false)
  const [viewApp,     setViewApp]     = useState(null)

  /* ── Live filtering ── */
  const filtered = apps.filter(a => {
    const q = search.toLowerCase()
    const matchSearch = !q ||
      a.name.toLowerCase().includes(q) ||
      a.id.toLowerCase().includes(q) ||
      a.phone.includes(q)
    const matchBranch = filterBranch === 'All' || a.branch === filterBranch
    const matchStatus = filterStatus === 'All' || a.status === filterStatus
    return matchSearch && matchBranch && matchStatus
  })

  const handleAdd = newApp => setApps(p => [newApp, ...p])

  const handleStatusChange = (id, newStatus) => {
    setApps(p => p.map(a => a.id === id ? { ...a, status: newStatus } : a))
    setViewApp(v => v ? { ...v, status: newStatus } : v)
  }

  /* ── KPI counts ── */
  const total      = apps.length
  const approved   = apps.filter(a => a.status === 'Approved').length
  const pending    = apps.filter(a => a.status === 'Pending').length
  const underReview= apps.filter(a => a.status === 'Under Review').length

  return (
    <div className="adm-page">

      {/* ── Header ── */}
      <div className="adm-header">
        <div>
          <div className="adm-title">Admissions Management</div>
          <div className="adm-sub">AY 2026–27 · Online & Walk-in applications</div>
        </div>
        <div className="adm-header-actions">
          <button className="adm-btn-outline"><IconDownload size={13} /> Export</button>
          <button className='adm-btn-outline' onClick={onClose}>← Back</button>
          <button className="adm-btn-primary" onClick={() => setShowAdd(true)}>
            <IconPlus size={13} /> New Application
          </button>
        </div>
      </div>

      {/* ── KPI cards ── */}
      <div className="adm-kpi-row">
        {[
          { label: 'Total Applications', val: total,       bg: '#eff4ff', c: '#2563eb'  },
          { label: 'Approved',           val: approved,    bg: '#EAF3DE', c: '#3B6D11'  },
          { label: 'Pending',            val: pending,     bg: '#FAEEDA', c: '#854F0B'  },
          { label: 'Under Review',       val: underReview, bg: '#E6F1FB', c: '#185FA5'  },
        ].map((k, i) => (
          <div className="adm-kpi" key={i}>
            <div className="adm-kpi-icon" style={{ background: k.bg, color: k.c }}>
              <IconUsers size={14} color={k.c} />
            </div>
            <div className="adm-kpi-val" style={{ color: k.c }}>{k.val}</div>
            <div className="adm-kpi-label">{k.label}</div>
          </div>
        ))}
      </div>

      {/* ── Table ── */}
      <div className="adm-table-card">
        {/* Filters */}
        <div className="adm-table-toolbar">
          <span className="adm-table-heading">All Applications</span>
          <div className="adm-filters">
            <div className="adm-search-box">
              <IconSearch size={13} color="#aab0bc" />
              <input
                placeholder="Search name, ID, phone..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button className="adm-clear-btn" onClick={() => setSearch('')}>
                  <IconX size={12} />
                </button>
              )}
            </div>
            <select className="adm-select" value={filterBranch} onChange={e => setFilterBranch(e.target.value)}>
              <option value="All">All branches</option>
              {BRANCHES.map(b => <option key={b}>{b}</option>)}
            </select>
            <select className="adm-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="All">All status</option>
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
            {(filterBranch !== 'All' || filterStatus !== 'All' || search) && (
              <button className="adm-clear-filters" onClick={() => { setSearch(''); setFilterBranch('All'); setFilterStatus('All') }}>
                <IconFilter size={12} /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Results count */}
        {filtered.length !== apps.length && (
          <div className="adm-result-count">
            Showing {filtered.length} of {apps.length} applications
          </div>
        )}

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="adm-empty">
            <IconUsers size={36} color="#e8ecf4" />
            <p>No applications found</p>
            <span>Try adjusting your search or filters</span>
          </div>
        ) : (
          <div className="adm-table-scroll">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Application ID</th>
                  <th>Student</th>
                  <th>Branch</th>
                  <th>Category</th>
                  <th>Class 12</th>
                  <th>Applied</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a, i) => (
                  <tr key={i}>
                    <td className="adm-id-cell">{a.id}</td>
                    <td>
                      <div className="adm-stu-cell">
                        <div className="adm-stu-av">
                          {a.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <div className="adm-stu-name">{a.name}</div>
                          <div className="adm-stu-meta">{a.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="adm-branch-pill">{a.branch}</span>
                    </td>
                    <td className="adm-muted">{a.category}</td>
                    <td style={{ fontWeight: 600, color: '#1a3a6e' }}>{a.class12}</td>
                    <td className="adm-muted">{a.appliedDate}</td>
                    <td>
                      <span
                        className="adm-status-pill"
                        style={{ background: STATUS_CONFIG[a.status]?.bg, color: STATUS_CONFIG[a.status]?.color }}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td>
                      <div className="adm-action-btns">
                        <button
                          className="adm-action-btn adm-action-view"
                          title="View details"
                          onClick={() => setViewApp(a)}
                        >
                          <IconEye size={13} />
                        </button>
                        <button
                          className="adm-action-btn adm-action-approve"
                          title="Approve"
                          onClick={() => handleStatusChange(a.id, 'Approved')}
                          disabled={a.status === 'Approved'}
                        >
                          <IconCheck size={13} />
                        </button>
                        <button
                          className="adm-action-btn adm-action-reject"
                          title="Reject"
                          onClick={() => handleStatusChange(a.id, 'Rejected')}
                          disabled={a.status === 'Rejected'}
                        >
                          <IconX size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      {showAdd && <AddModal onClose={() => setShowAdd(false)} onSave={handleAdd} />}
      {viewApp  && (
        <ViewModal
          app={viewApp}
          onClose={() => setViewApp(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  )
}