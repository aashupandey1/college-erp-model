/* ═══════════════════════════════════════════
   STEP 4 — PREVIEW & SAVE
   Props: data
   Note:  HR-related fields excluded from preview.
          Save notice updated (no temp password).
═══════════════════════════════════════════ */

import { FI } from '../../constants/facultyIcons'
import { ALL_SUBJECTS } from '../../constants/facultyConstants'

export default function Step4Preview({ data }) {
  const fullName = [data.firstName, data.middleName, data.lastName]
    .filter(Boolean).join(' ')

  const initials = fullName
    .split(' ')
    .map(w => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')

  const assignedSubjs = (data.assignedSubjects || [])
    .map(code => ALL_SUBJECTS.find(s => s.code === code))
    .filter(Boolean)

  const totalExp = (Number(data.teachExp) || 0) + (Number(data.indExp) || 0)

  const sections = [
    {
      title: 'Personal Information',
      rows: [
        ['Full Name',      fullName || '—'],
        ['Date of Birth',  data.dob || '—'],
        ['Gender',         data.gender || '—'],
        ['Blood Group',    data.bloodGroup || '—'],
        ['Mobile',         data.phone || '—'],
        ['Official Email', data.email || '—'],
        ['Address',        data.address ? `${data.address}, ${data.city}` : '—'],
        ['Aadhaar',        data.aadhaar ? '✓ Provided' : '—'],
        ['PAN',            data.pan || '—'],
      ],
    },
    {
      title: 'Professional Details',
      rows: [
        ['Department',       data.dept || '—'],
        ['Designation',      data.desig || '—'],
        ['Employment Type',  data.empType || '—'],
        ['Date of Joining',  data.joining || '—'],
        ['Qualification',    data.qual || '—'],
        ['Specialization',   data.specialization || '—'],
        ['University',       data.university || '—'],
        ['Teaching Exp.',    `${data.teachExp || 0} yrs`],
        ['Industry Exp.',    `${data.indExp || 0} yrs`],
        ['Total Experience', `${totalExp} yrs`],
        ['Publications',     data.publications || '0'],
      ],
    },
    {
      title: 'Workload Summary',
      rows: [
        ['Assigned Subjects', assignedSubjs.length ? assignedSubjs.map(s => s.code).join(', ') : '—'],
        ['Lecture Hours/wk',  `${data.lectureHrs || 0} hrs`],
        ['Lab Hours/wk',      `${data.labHrs || 0} hrs`],
        ['Tutorial Hours/wk', `${data.tutorialHrs || 0} hrs`],
        ['Total Workload',    `${(Number(data.lectureHrs) || 0) + (Number(data.labHrs) || 0) + (Number(data.tutorialHrs) || 0)} hrs/week`],
        ['Class Teacher',     data.isClassTeacher  ? 'Yes' : 'No'],
        ['Research Guide',    data.isResearchGuide ? 'Yes' : 'No'],
        ['FYP Guide',         data.isFYPGuide      ? 'Yes' : 'No'],
      ],
    },
  ]

  return (
    <div className="afp-step-content">
      <div className="afp-step-header">
        <div className="afp-step-title-icon"><FI.Doc /></div>
        <div>
          <h2 className="afp-step-title">Preview & Save</h2>
          <p className="afp-step-sub">Review all details before adding to the system</p>
        </div>
      </div>

      {/* ── Profile Hero Card ── */}
      <div className="afp-preview-hero">
        {data.photoPreview
          ? <img src={data.photoPreview} alt="Faculty" className="afp-preview-photo" />
          : <div className="afp-preview-avatar">{initials || '?'}</div>
        }
        <div className="afp-preview-info">
          <div className="afp-preview-name">{fullName || '— Name not entered —'}</div>
          <div className="afp-preview-meta">
            {[data.desig, data.dept].filter(Boolean).join(' · ') || 'No dept / designation'}
          </div>
          <div className="afp-preview-tags">
            {data.qual    && <span className="afp-preview-tag">{data.qual}</span>}
            {data.empType && <span className="afp-preview-tag">{data.empType}</span>}
            {data.joining && <span className="afp-preview-tag">Joining: {data.joining}</span>}
          </div>
        </div>
        <div className="afp-preview-status">
          <span className="afp-status-badge">Ready to save</span>
        </div>
      </div>

      {/* ── Data Sections ── */}
      <div className="afp-preview-sections">
        {sections.map(sec => (
          <div key={sec.title} className="afp-preview-section">
            <div className="afp-preview-sec-title">{sec.title}</div>
            <div className="afp-preview-rows">
              {sec.rows.map(([k, v]) => (
                <div key={k} className="afp-preview-row">
                  <span className="afp-preview-key">{k}</span>
                  <span className="afp-preview-val">{v}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Assigned Subjects ── */}
      {assignedSubjs.length > 0 && (
        <div className="afp-preview-section">
          <div className="afp-preview-sec-title">
            Assigned Subjects ({assignedSubjs.length})
          </div>
          <div className="afp-preview-subjects">
            {assignedSubjs.map(s => (
              <div key={s.code} className="afp-preview-subject-card">
                <span className="afp-preview-subject-code">{s.code}</span>
                <span className="afp-preview-subject-name">{s.name}</span>
                <span className="afp-preview-subject-meta">Sem {s.sem}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Save Notice (no temp password) ── */}
      <div className="afp-save-notice">
        <span>✅</span>
        <span>After saving, this faculty member will be added to the system.</span>
      </div>
    </div>
  )
}