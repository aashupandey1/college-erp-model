/* ═══════════════════════════════════════════
   STEP 3 — SUBJECTS & WORKLOAD
   Props: data, setData, errors
═══════════════════════════════════════════ */

import Field from "../../../../components/common/Field";
import { FI } from "../../constants/facultyIcons";
import { ALL_SUBJECTS } from "../../constants/facultyConstants";
export default function Step3Subjects({ data, setData, errors }) {
  const set = (k, v) => setData(p => ({ ...p, [k]: v }))

  const deptSubjects = data.dept
    ? ALL_SUBJECTS.filter(s => s.dept === data.dept)
    : ALL_SUBJECTS

  const toggleSubject = (code) => {
    const current = data.assignedSubjects || []
    const exists  = current.includes(code)
    if (exists) {
      set('assignedSubjects', current.filter(s => s !== code))
    } else {
      if (current.length >= 6) return
      set('assignedSubjects', [...current, code])
    }
  }

  const assignedSubjs = (data.assignedSubjects || [])
    .map(code => ALL_SUBJECTS.find(s => s.code === code))
    .filter(Boolean)

  const totalHrs = (Number(data.lectureHrs) || 0)
    + (Number(data.labHrs) || 0)
    + (Number(data.tutorialHrs) || 0)

  return (
    <div className="afp-step-content">
      <div className="afp-step-header">
        <div className="afp-step-title-icon"><FI.Subject /></div>
        <div>
          <h2 className="afp-step-title">Subjects & Workload</h2>
          <p className="afp-step-sub">Assign subjects and configure weekly workload</p>
        </div>
      </div>

      {/* ── Subject Grid ── */}
      <div className="afp-section-label">
        Assign Subjects{' '}
        <span style={{ fontWeight: 400, textTransform: 'none', color: '#8a94a6', fontSize: 11 }}>
          — Max 6 subjects
        </span>
      </div>

      {!data.dept && (
        <div className="afp-info-box">
          ℹ️ Select a department in Step 2 to see relevant subjects
        </div>
      )}

      <div className="afp-subject-grid">
        {deptSubjects.map(s => {
          const selected = (data.assignedSubjects || []).includes(s.code)
          return (
            <div
              key={s.code}
              className={`afp-subject-card ${selected ? 'selected' : ''}`}
              onClick={() => toggleSubject(s.code)}
            >
              <div className="afp-subject-check">
                {selected && <FI.Check />}
              </div>
              <div className="afp-subject-code">{s.code}</div>
              <div className="afp-subject-name">{s.name}</div>
              <div className="afp-subject-meta">
                <span>{s.dept}</span>
                <span>Sem {s.sem}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Assigned Summary ── */}
      {assignedSubjs.length > 0 && (
        <div className="afp-selected-subjects">
          <div className="afp-section-label" style={{ marginTop: 0 }}>
            Assigned ({assignedSubjs.length})
          </div>
          <div className="afp-tags-row">
            {assignedSubjs.map(s => (
              <span key={s.code} className="afp-subject-tag">
                {s.code} — {s.name}
                <button className="afp-tag-remove" onClick={() => toggleSubject(s.code)}>
                  <FI.X />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="afp-divider" />

      {/* ── Weekly Workload ── */}
      <div className="afp-section-label">Weekly Workload</div>
      <div className="afp-grid-3">
        <Field label="Lecture Hours / week" hint="Theory classes">
          <div className="afp-hr-input-wrap">
            <input
              className="afp-input"
              type="number"
              min="0"
              max="30"
              value={data.lectureHrs || ''}
              onChange={e => set('lectureHrs', Number(e.target.value))}
              placeholder="0"
            />
            <span className="afp-hr-unit">hrs</span>
          </div>
        </Field>
        <Field label="Lab Hours / week">
          <div className="afp-hr-input-wrap">
            <input
              className="afp-input"
              type="number"
              min="0"
              max="20"
              value={data.labHrs || ''}
              onChange={e => set('labHrs', Number(e.target.value))}
              placeholder="0"
            />
            <span className="afp-hr-unit">hrs</span>
          </div>
        </Field>
        <Field label="Tutorial Hours / week">
          <div className="afp-hr-input-wrap">
            <input
              className="afp-input"
              type="number"
              min="0"
              max="10"
              value={data.tutorialHrs || ''}
              onChange={e => set('tutorialHrs', Number(e.target.value))}
              placeholder="0"
            />
            <span className="afp-hr-unit">hrs</span>
          </div>
        </Field>
      </div>

      {/* ── Workload Summary Bar ── */}
      <div className="afp-workload-summary">
        <div className="afp-workload-total">
          <span
            className="afp-workload-val"
            style={{ color: totalHrs > 25 ? '#dc2626' : '#059669' }}
          >
            {totalHrs}
          </span>
          <span className="afp-workload-label">hrs / week total</span>
          {totalHrs > 25 && (
            <span className="afp-workload-warn">⚠ Exceeds recommended 25 hrs</span>
          )}
        </div>
        <div className="afp-workload-bars">
          {[
            { label: 'Lecture',  val: Number(data.lectureHrs)  || 0, color: '#2563eb', max: 30 },
            { label: 'Lab',      val: Number(data.labHrs)      || 0, color: '#059669', max: 20 },
            { label: 'Tutorial', val: Number(data.tutorialHrs) || 0, color: '#854F0B', max: 10 },
          ].map(b => (
            <div key={b.label} className="afp-workload-bar-row">
              <span className="afp-workload-bar-label">{b.label}</span>
              <div className="afp-workload-bar-track">
                <div
                  className="afp-workload-bar-fill"
                  style={{ width: `${(b.val / b.max) * 100}%`, background: b.color }}
                />
              </div>
              <span className="afp-workload-bar-val">{b.val}h</span>
            </div>
          ))}
        </div>
      </div>

      <div className="afp-divider" />

      {/* ── Additional Roles ── */}
      <div className="afp-section-label">Additional Roles</div>
      <div className="afp-checkbox-grid">
        {[
          { key: 'isClassTeacher',     label: 'Class Teacher',        desc: 'Assigned as class teacher for a batch' },
          { key: 'isResearchGuide',    label: 'Research Guide',       desc: 'Guides Ph.D. / M.Tech thesis students' },
          { key: 'isFYPGuide',         label: 'FYP Guide',            desc: 'Guides final year projects' },
          { key: 'isExamCoordinator',  label: 'Exam Coordinator',     desc: 'Manages exam schedule for department' },
          { key: 'isAdmissionCoord',   label: 'Admission Coordinator',desc: 'Handles admission counselling' },
          { key: 'isNSSCoord',         label: 'NSS Coordinator',      desc: 'National Service Scheme in-charge' },
        ].map(r => (
          <label key={r.key} className="afp-checkbox-card">
            <input
              type="checkbox"
              checked={!!data[r.key]}
              onChange={e => set(r.key, e.target.checked)}
              className="afp-checkbox"
            />
            <div>
              <div className="afp-checkbox-label">{r.label}</div>
              <div className="afp-checkbox-desc">{r.desc}</div>
            </div>
          </label>
        ))}
      </div>
    </div>
  )
}