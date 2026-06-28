/* ═══════════════════════════════════════════
   STEP 1 — PERSONAL INFORMATION
   Props: data, setData, errors
═══════════════════════════════════════════ */
import Field from "../../../../components/common/Field";
import { FI } from '../../constants/facultyIcons'
import { BLOOD_GROUPS, CATEGORIES, RELATIONSHIPS } from '../../constants/facultyConstants'

export default function Step1Personal({ data, setData, errors }) {
  const set = (k, v) => setData(p => ({ ...p, [k]: v }))

  return (
    <div className="afp-step-content">
      <div className="afp-step-header">
        <div className="afp-step-title-icon"><FI.User /></div>
        <div>
          <h2 className="afp-step-title">Personal Information</h2>
          <p className="afp-step-sub">Basic details and contact information</p>
        </div>
      </div>

      {/* ── Photo Upload ── */}
      <div className="afp-photo-row">
        <div className="afp-photo-preview">
          {data.photoPreview
            ? <img src={data.photoPreview} alt="Faculty" className="afp-photo-img" />
            : (
              <div className="afp-photo-placeholder">
                <FI.User />
                <span>No photo</span>
              </div>
            )
          }
        </div>
        <div className="afp-photo-info">
          <div className="afp-photo-title">Profile Photo</div>
          <div className="afp-photo-hint">JPG or PNG · Max 2MB · Recommended 200×200px</div>
          <label className="afp-upload-btn">
            <FI.Upload /> Upload Photo
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={e => {
                const file = e.target.files[0]
                if (file) {
                  const reader = new FileReader()
                  reader.onload = ev => set('photoPreview', ev.target.result)
                  reader.readAsDataURL(file)
                }
              }}
            />
          </label>
        </div>
      </div>

      <div className="afp-divider" />

      {/* ── Name ── */}
      <div className="afp-grid-3">
        <Field label="First Name" required error={errors.firstName}>
          <input
            className={`afp-input ${errors.firstName ? 'err' : ''}`}
            value={data.firstName}
            onChange={e => set('firstName', e.target.value)}
            placeholder="e.g. Priya"
          />
        </Field>
        <Field label="Middle Name">
          <input
            className="afp-input"
            value={data.middleName}
            onChange={e => set('middleName', e.target.value)}
            placeholder="Optional"
          />
        </Field>
        <Field label="Last Name" required error={errors.lastName}>
          <input
            className={`afp-input ${errors.lastName ? 'err' : ''}`}
            value={data.lastName}
            onChange={e => set('lastName', e.target.value)}
            placeholder="e.g. Mehra"
          />
        </Field>
      </div>

      <div className="afp-grid-2">
        <Field label="Date of Birth" required error={errors.dob}>
          <input
            className={`afp-input ${errors.dob ? 'err' : ''}`}
            type="date"
            value={data.dob}
            onChange={e => set('dob', e.target.value)}
          />
        </Field>
        <Field label="Gender" required error={errors.gender}>
          <select
            className={`afp-input ${errors.gender ? 'err' : ''}`}
            value={data.gender}
            onChange={e => set('gender', e.target.value)}
          >
            <option value="">— Select —</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </Field>
        <Field label="Blood Group">
          <select className="afp-input" value={data.bloodGroup} onChange={e => set('bloodGroup', e.target.value)}>
            <option value="">— Select —</option>
            {BLOOD_GROUPS.map(b => <option key={b}>{b}</option>)}
          </select>
        </Field>
        <Field label="Category">
          <select className="afp-input" value={data.category} onChange={e => set('category', e.target.value)}>
            <option value="">— Select —</option>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </Field>
      </div>

      {/* ── Contact ── */}
      <div className="afp-section-label">Contact Details</div>
      <div className="afp-grid-2">
        <Field label="Mobile Number" required error={errors.phone} hint="10-digit number">
          <input
            className={`afp-input ${errors.phone ? 'err' : ''}`}
            value={data.phone}
            onChange={e => set('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
            placeholder="9876543210"
            maxLength={10}
          />
        </Field>
        <Field label="Alternate Phone">
          <input
            className="afp-input"
            value={data.altPhone}
            onChange={e => set('altPhone', e.target.value.replace(/\D/g, '').slice(0, 10))}
            placeholder="Optional"
          />
        </Field>
        <Field label="Official Email" required error={errors.email} hint="Will be used for login">
          <input
            className={`afp-input ${errors.email ? 'err' : ''}`}
            type="email"
            value={data.email}
            onChange={e => set('email', e.target.value)}
            placeholder="priya.mehra@college.edu"
          />
        </Field>
        <Field label="Personal Email">
          <input
            className="afp-input"
            type="email"
            value={data.personalEmail}
            onChange={e => set('personalEmail', e.target.value)}
            placeholder="personal@gmail.com"
          />
        </Field>
      </div>

      {/* ── Address ── */}
      <div className="afp-section-label">Address</div>
      <div className="afp-grid-1">
        <Field label="Current Address" required error={errors.address}>
          <textarea
            className={`afp-input afp-textarea ${errors.address ? 'err' : ''}`}
            value={data.address}
            onChange={e => set('address', e.target.value)}
            placeholder="House/Flat No., Street, Area, City, State, PIN"
            rows={2}
          />
        </Field>
      </div>
      <div className="afp-grid-3">
        <Field label="City" required error={errors.city}>
          <input
            className={`afp-input ${errors.city ? 'err' : ''}`}
            value={data.city}
            onChange={e => set('city', e.target.value)}
            placeholder="Ghaziabad"
          />
        </Field>
        <Field label="State">
          <input
            className="afp-input"
            value={data.state}
            onChange={e => set('state', e.target.value)}
            placeholder="Uttar Pradesh"
          />
        </Field>
        <Field label="PIN Code">
          <input
            className="afp-input"
            value={data.pin}
            onChange={e => set('pin', e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="201001"
            maxLength={6}
          />
        </Field>
      </div>

      {/* ── Identity ── */}
      <div className="afp-section-label">Identity Documents</div>
      <div className="afp-grid-2">
        <Field label="Aadhaar Number" error={errors.aadhaar} hint="12-digit Aadhaar card number">
          <input
            className={`afp-input ${errors.aadhaar ? 'err' : ''}`}
            value={data.aadhaar}
            onChange={e => set('aadhaar', e.target.value.replace(/\D/g, '').slice(0, 12))}
            placeholder="XXXX XXXX XXXX"
            maxLength={12}
          />
        </Field>
        <Field label="PAN Number">
          <input
            className="afp-input"
            value={data.pan}
            onChange={e => set('pan', e.target.value.toUpperCase().slice(0, 10))}
            placeholder="ABCDE1234F"
            maxLength={10}
          />
        </Field>
      </div>

      {/* ── Emergency Contact ── */}
      <div className="afp-section-label">Emergency Contact</div>
      <div className="afp-grid-3">
        <Field label="Contact Name">
          <input
            className="afp-input"
            value={data.emergencyName}
            onChange={e => set('emergencyName', e.target.value)}
            placeholder="Full name"
          />
        </Field>
        <Field label="Relationship">
          <select className="afp-input" value={data.emergencyRel} onChange={e => set('emergencyRel', e.target.value)}>
            <option value="">— Select —</option>
            {RELATIONSHIPS.map(r => <option key={r}>{r}</option>)}
          </select>
        </Field>
        <Field label="Phone">
          <input
            className="afp-input"
            value={data.emergencyPhone}
            onChange={e => set('emergencyPhone', e.target.value.replace(/\D/g, '').slice(0, 10))}
            placeholder="10-digit number"
            maxLength={10}
          />
        </Field>
      </div>
    </div>
  )
}