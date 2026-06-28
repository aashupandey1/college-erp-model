/* ═══════════════════════════════════════════
   STEP 2 — PROFESSIONAL DETAILS
   Props: data, setData, errors
   Note:  Salary, Bank, Patents, Projects,
          Research Exp, Previous Institution
          removed — belong to HR Module.
═══════════════════════════════════════════ */
import Field from "../../../../components/common/Field";
import { FI } from '../../constants/facultyIcons'
import {
  DEPTS,
  DESIGS,
  QUALS,
  SPECIALIZATIONS,
  EMPLOYMENT_TYPES,
} from '../../constants/facultyConstants'

export default function Step2Professional({ data, setData, errors }) {
  const set = (k, v) => setData(p => ({ ...p, [k]: v }))

  return (
    <div className="afp-step-content">
      <div className="afp-step-header">
        <div className="afp-step-title-icon"><FI.Academic /></div>
        <div>
          <h2 className="afp-step-title">Professional Details</h2>
          <p className="afp-step-sub">Academic qualifications and employment information</p>
        </div>
      </div>

      {/* ── Department & Designation ── */}
      <div className="afp-section-label">Department & Designation</div>
      <div className="afp-grid-2">
        <Field label="Department" required error={errors.dept}>
          <select
            className={`afp-input ${errors.dept ? 'err' : ''}`}
            value={data.dept}
            onChange={e => set('dept', e.target.value)}
          >
            <option value="">— Select Department —</option>
            {DEPTS.map(d => <option key={d}>{d}</option>)}
          </select>
        </Field>
        <Field label="Designation" required error={errors.desig}>
          <select
            className={`afp-input ${errors.desig ? 'err' : ''}`}
            value={data.desig}
            onChange={e => set('desig', e.target.value)}
          >
            <option value="">— Select Designation —</option>
            {DESIGS.map(d => <option key={d}>{d}</option>)}
          </select>
        </Field>
        <Field label="Employment Type">
          <select className="afp-input" value={data.empType} onChange={e => set('empType', e.target.value)}>
            <option value="">— Select —</option>
            {EMPLOYMENT_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Date of Joining" required error={errors.joining}>
          <input
            className={`afp-input ${errors.joining ? 'err' : ''}`}
            type="date"
            value={data.joining}
            onChange={e => set('joining', e.target.value)}
          />
        </Field>
      </div>

      {/* ── Qualifications ── */}
      <div className="afp-section-label">Qualifications</div>
      <div className="afp-grid-2">
        <Field label="Highest Qualification" required error={errors.qual}>
          <select
            className={`afp-input ${errors.qual ? 'err' : ''}`}
            value={data.qual}
            onChange={e => set('qual', e.target.value)}
          >
            <option value="">— Select —</option>
            {QUALS.map(q => <option key={q}>{q}</option>)}
          </select>
        </Field>
        <Field label="Specialization" hint="Main area of expertise">
          <select className="afp-input" value={data.specialization} onChange={e => set('specialization', e.target.value)}>
            <option value="">— Select —</option>
            {SPECIALIZATIONS.map(s => <option key={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="University / Institute" hint="Where degree was obtained">
          <input
            className="afp-input"
            value={data.university}
            onChange={e => set('university', e.target.value)}
            placeholder="IIT Delhi, NIT Kurukshetra..."
          />
        </Field>
        <Field label="Year of Graduation">
          <input
            className="afp-input"
            type="number"
            min="1970"
            max="2026"
            value={data.gradYear}
            onChange={e => set('gradYear', e.target.value)}
            placeholder="e.g. 2016"
          />
        </Field>
      </div>

      {/* ── PhD Details (conditional) ── */}
      {(data.qual?.startsWith('Ph.D') || data.qual === 'Ph.D.') && (
        <div className="afp-phd-box">
          <div className="afp-phd-label">Ph.D. Details</div>
          <div className="afp-grid-2">
            <Field label="Ph.D. Title">
              <input
                className="afp-input"
                value={data.phdTitle}
                onChange={e => set('phdTitle', e.target.value)}
                placeholder="Thesis title"
              />
            </Field>
            <Field label="Ph.D. Year">
              <input
                className="afp-input"
                type="number"
                value={data.phdYear}
                onChange={e => set('phdYear', e.target.value)}
                placeholder="e.g. 2018"
              />
            </Field>
          </div>
        </div>
      )}

      {/* ── Experience ── */}
      <div className="afp-section-label">Experience</div>
      <div className="afp-grid-2">
        <Field label="Teaching Experience (yrs)" hint="Years of teaching experience">
          <input
            className="afp-input"
            type="number"
            min="0"
            max="50"
            value={data.teachExp}
            onChange={e => set('teachExp', e.target.value)}
            placeholder="0"
          />
        </Field>
        <Field label="Industry Experience (yrs)">
          <input
            className="afp-input"
            type="number"
            min="0"
            max="50"
            value={data.indExp}
            onChange={e => set('indExp', e.target.value)}
            placeholder="0"
          />
        </Field>
      </div>

      {/* ── Publications ── */}
      <div className="afp-section-label">Research & Publications</div>
      <div className="afp-grid-1">
        <Field label="Publications (count)">
          <input
            className="afp-input"
            type="number"
            min="0"
            value={data.publications}
            onChange={e => set('publications', e.target.value)}
            placeholder="0"
          />
        </Field>
      </div>
    </div>
  )
}