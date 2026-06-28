/* ══════════════════════════════════════════════════════════════
   EditStudentPage.jsx
   Admin student ka data edit karta hai.
   Props:
     student  — student object (StudentsPage se)
     onNav    — navigation handler
   Usage:
     <EditStudentPage student={selectedStudent} onNav={setActive} />
══════════════════════════════════════════════════════════════ */
import { useState, useMemo } from 'react'
import './AddStudentPage.css'   // same styles reuse
import './EditStudentPage.css'  // edit-specific overrides
import { apiFetch } from '../../../services/api'

/* ══════════════════════════════════════
   STEP CONFIG
══════════════════════════════════════ */
const STEPS = [
  { id: 1, label: 'Personal Info', icon: '👤' },
  { id: 2, label: 'Academic', icon: '🎓' },
  { id: 3, label: 'Guardian', icon: '👨‍👩‍👦' },
  { id: 4, label: 'Contact', icon: '📞' },
  { id: 5, label: 'Other Details', icon: '📋' },
]

/* ══════════════════════════════════════
   HELPERS — student prop → form state
══════════════════════════════════════ */
function buildInitial(student) {
  if (!student) return {}
  const firstName = student.firstName || (student.name || '').split(' ')[0] || ''
  const lastName = student.lastName || (student.name || '').split(' ').slice(1).join(' ')
  return {
    /* Personal */
    firstName,
    lastName,
    dob: student.dob || '',
    gender: student.gender || '',
    category: student.category || '',
    bloodGroup: student.bloodGroup || '',
    religion: student.religion || '',
    aadhar: student.aadhar || '',
    photo: null,

    /* Academic */
    rollNumber: student.rollNumber || student.id || '',
    branch: student.branch || '',
    semester: String(student.semester || student.sem || ''),
    section: student.section || '',
    admYear: student.admissionYear || student.admYear || '',
    admDate: student.admissionDate || student.admDate || '',
    programme: student.programme || 'B.Tech',
    feeCategory: student.feeCategory || '',
    previousSchool: student.previousSchool || '',
    tcNumber: student.tcNumber || '',
    status: student.status || 'Active',

    /* Guardian */
    guardianName: student.guardianName || student.guardian || '',
    guardianRelation: student.guardianRelation || student.guardianRel || 'Father',
    guardianPhone: student.guardianPhone || '',
    guardianEmail: student.guardianEmail || '',
    guardianOccupation: student.guardianOccupation || student.guardianOcc || '',
    guardianIncome: student.guardianIncome || '',
    motherName: student.motherName || '',
    motherPhone: student.motherPhone || '',

    /* Contact */
    personalEmail: student.personalEmail || student.email || '',
    personalPhone: student.phone || student.personalPhone || '',
    permanentAddress: student.permanentAddress || student.address || '',
    city: student.city || '',
    state: student.state || '',
    pincode: student.pincode || '',

    /* Other */
    hostelRequired: student.hostelRequired || student.hostel || 'No',
    transportRequired: student.transportRequired || student.transport || 'No',
    busRoute: student.busRoute || '',
    scholarshipApplicable: student.scholarshipApplicable || student.scholarship || 'No',
    scholarshipScheme: student.scholarshipScheme || student.schemeNme || '',
    remarks: student.remarks || '',
  }
}

const mapFormToPayload = (form) => ({
  firstName: form.firstName,
  lastName: form.lastName,
  rollNumber: form.rollNumber,
  dob: form.dob,
  gender: form.gender,
  category: form.category,
  bloodGroup: form.bloodGroup,
  religion: form.religion,
  aadhar: form.aadhar,
  programme: form.programme,
  branch: form.branch,
  semester: form.semester,
  section: form.section,
  admissionYear: form.admYear,
  admissionDate: form.admDate,
  feeCategory: form.feeCategory,
  previousSchool: form.previousSchool,
  tcNumber: form.tcNumber,
  status: form.status,
  guardianName: form.guardianName,
  guardianRelation: form.guardianRelation,
  guardianPhone: form.guardianPhone,
  guardianEmail: form.guardianEmail,
  guardianOccupation: form.guardianOccupation,
  guardianIncome: form.guardianIncome,
  motherName: form.motherName,
  motherPhone: form.motherPhone,
  personalEmail: form.personalEmail,
  phone: form.personalPhone,
  permanentAddress: form.permanentAddress,
  city: form.city,
  state: form.state,
  pincode: form.pincode,
  hostelRequired: form.hostelRequired,
  transportRequired: form.transportRequired,
  busRoute: form.busRoute,
  scholarshipApplicable: form.scholarshipApplicable,
  scholarshipScheme: form.scholarshipScheme,
  remarks: form.remarks,
})

/* ══════════════════════════════════════
   REUSABLE SUB-COMPONENTS
══════════════════════════════════════ */
function FormField({ label, required, error, children, changed }) {
  return (
    <div className={`afs-field${changed ? ' esp-field-changed' : ''}`}>
      <label className="afs-label">
        {label}
        {required && <span className="afs-req">*</span>}
        {changed && <span className="esp-changed-badge">● edited</span>}
      </label>
      {children}
      {error && <span className="afs-error">⚠ {error}</span>}
    </div>
  )
}

function Input({ value, onChange, placeholder, type = 'text', maxLength, disabled, readOnly }) {
  return (
    <input
      className={`afs-input${value ? ' afs-input-filled' : ''}${readOnly ? ' esp-readonly' : ''}`}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      maxLength={maxLength}
      disabled={disabled}
      readOnly={readOnly}
    />
  )
}

function Select({ value, onChange, options, placeholder, disabled }) {
  return (
    <select
      className={`afs-select${value ? ' afs-input-filled' : ''}`}
      value={value}
      onChange={onChange}
      disabled={disabled}
    >
      <option value="">{placeholder || 'Select...'}</option>
      {options.map(o => (
        <option key={o.value ?? o} value={o.value ?? o}>
          {o.label ?? o}
        </option>
      ))}
    </select>
  )
}

function SectionHead({ icon, title, sub }) {
  return (
    <div className="afs-section-head">
      <div className="afs-section-icon">{icon}</div>
      <div>
        <div className="afs-section-title">{title}</div>
        {sub && <div className="afs-section-sub">{sub}</div>}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════
   STEP 1 — Personal Info
══════════════════════════════════════ */
function StepPersonal({ data, original, set, errors }) {
  const ch = k => data[k] !== original[k]
  return (
    <div className="afs-step-body">
      <SectionHead icon="👤" title="Personal Information"
        sub="Basic personal details update karein" />

      {/* Photo */}
      <div className="afs-photo-row">
        <div className="afs-photo-box">
          {data.photo
            ? <img src={URL.createObjectURL(data.photo)} alt="preview" className="afs-photo-img" />
            : (
              <div className="esp-current-photo">
                <div className="esp-photo-initials">
                  {(data.firstName[0] || '') + (data.lastName[0] || '')}
                </div>
                <div className="esp-photo-hint">Current</div>
              </div>
            )
          }
        </div>
        <div className="afs-photo-info">
          <div className="afs-photo-title">Student Photograph</div>
          <div className="afs-photo-sub">New photo upload karo (optional) · JPG/PNG · Max 2MB</div>
          <label className="afs-btn-outline afs-upload-btn">
            Change Photo
            <input type="file" accept="image/*" hidden
              onChange={e => set('photo', e.target.files[0])} />
          </label>
        </div>
      </div>

      <div className="afs-grid-2">
        <FormField label="First Name" required error={errors.firstName} changed={ch('firstName')}>
          <Input value={data.firstName} onChange={e => set('firstName', e.target.value)}
            placeholder="e.g. Aashish" />
        </FormField>

        <FormField label="Last Name" required error={errors.lastName} changed={ch('lastName')}>
          <Input value={data.lastName} onChange={e => set('lastName', e.target.value)}
            placeholder="e.g. Kumar" />
        </FormField>

        <FormField label="Date of Birth" error={errors.dob} changed={ch('dob')}>
          <Input type="date" value={data.dob} onChange={e => set('dob', e.target.value)} />
        </FormField>

        <FormField label="Gender" error={errors.gender} changed={ch('gender')}>
          <Select value={data.gender} onChange={e => set('gender', e.target.value)}
            placeholder="Select gender" options={['Male', 'Female', 'Other']} />
        </FormField>

        <FormField label="Category" changed={ch('category')}>
          <Select value={data.category} onChange={e => set('category', e.target.value)}
            options={['General', 'OBC', 'SC', 'ST', 'EWS']} />
        </FormField>

        <FormField label="Blood Group" changed={ch('bloodGroup')}>
          <Select value={data.bloodGroup} onChange={e => set('bloodGroup', e.target.value)}
            placeholder="Select" options={['A+', 'A−', 'B+', 'B−', 'AB+', 'AB−', 'O+', 'O−']} />
        </FormField>

        <FormField label="Religion" changed={ch('religion')}>
          <Select value={data.religion} onChange={e => set('religion', e.target.value)}
            placeholder="Select" options={['Hindu', 'Muslim', 'Christian', 'Sikh', 'Other']} />
        </FormField>

        <FormField label="Aadhar Number" error={errors.aadhar} changed={ch('aadhar')}>
          <Input value={data.aadhar}
            onChange={e => set('aadhar', e.target.value.replace(/\D/g, ''))}
            placeholder="XXXX XXXX XXXX" maxLength={12} />
        </FormField>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════
   STEP 2 — Academic Details
══════════════════════════════════════ */
function StepAcademic({ data, original, set, errors }) {
  const ch = k => data[k] !== original[k]
  return (
    <div className="afs-step-body">
      <SectionHead icon="🎓" title="Academic Details"
        sub="Enrollment, branch, semester aur status update karein" />

      <div className="esp-readonly-note">
        <span>🔒</span>
        <span>Roll number ek baar assign hone ke baad change nahi hota.</span>
      </div>

      <div className="afs-grid-2">
        {/* Roll number — read-only */}
        <FormField label="Roll / Enrollment Number">
          <Input value={data.rollNumber} readOnly
            placeholder="Read-only" />
        </FormField>

        <FormField label="Programme" changed={ch('programme')}>
          <Select value={data.programme} onChange={e => set('programme', e.target.value)}
            options={['B.Tech', 'M.Tech', 'BCA', 'MCA', 'B.Sc', 'MBA']} />
        </FormField>

        <FormField label="Branch / Department" required error={errors.branch} changed={ch('branch')}>
          <Select value={data.branch} onChange={e => set('branch', e.target.value)}
            placeholder="Select branch"
            options={[
              { value: 'CSE', label: 'Computer Science (CSE)' },
              { value: 'ECE', label: 'Electronics (ECE)' },
              { value: 'MECH', label: 'Mechanical (MECH)' },
              { value: 'CIVIL', label: 'Civil Engineering' },
              { value: 'IT', label: 'Information Technology (IT)' },
              { value: 'EEE', label: 'Electrical (EEE)' },
            ]} />
        </FormField>

        <FormField label="Current Semester" required error={errors.semester} changed={ch('semester')}>
          <Select value={data.semester} onChange={e => set('semester', e.target.value)}
            placeholder="Select"
            options={['1', '2', '3', '4', '5', '6', '7', '8']} />
        </FormField>

        <FormField label="Section" changed={ch('section')}>
          <Select value={data.section} onChange={e => set('section', e.target.value)}
            placeholder="Select" options={['A', 'B', 'C', 'D']} />
        </FormField>

        <FormField label="Admission Year" required error={errors.admYear} changed={ch('admYear')}>
          <Select value={data.admYear} onChange={e => set('admYear', e.target.value)}
            placeholder="Select year"
            options={['2020', '2021', '2022', '2023', '2024', '2025']} />
        </FormField>

        <FormField label="Fee Category" changed={ch('feeCategory')}>
          <Select value={data.feeCategory} onChange={e => set('feeCategory', e.target.value)}
            placeholder="Select"
            options={['Regular', 'Management Quota', 'NRI', 'Scholarship']} />
        </FormField>

        {/* Status — important field */}
        <FormField label="Academic Status" changed={ch('status')}>
          <div className="esp-status-options">
            {[
              { val: 'Active', color: '#059669', bg: '#EAF3DE', icon: '✓' },
              { val: 'Detained', color: '#d97706', bg: '#FAEEDA', icon: '⚠' },
              { val: 'Alumni', color: '#2563eb', bg: '#E6F1FB', icon: '🎓' },
              { val: 'Dropout', color: '#dc2626', bg: '#FCEBEB', icon: '✕' },
            ].map(s => (
              <label key={s.val}
                className={`esp-status-btn${data.status === s.val ? ' selected' : ''}`}
                style={data.status === s.val ? { background: s.bg, color: s.color, borderColor: s.color } : {}}
              >
                <input type="radio" name="status" value={s.val}
                  checked={data.status === s.val}
                  onChange={() => set('status', s.val)} hidden />
                {s.icon} {s.val}
              </label>
            ))}
          </div>
        </FormField>
      </div>

      <div className="afs-divider"><span>Previous Education</span></div>
      <div className="afs-grid-2">
        <FormField label="Previous School / College" changed={ch('previousSchool')}>
          <Input value={data.previousSchool}
            onChange={e => set('previousSchool', e.target.value)}
            placeholder="Govt. Sr. Sec. School..." />
        </FormField>

        <FormField label="Transfer Certificate Number" changed={ch('tcNumber')}>
          <Input value={data.tcNumber} onChange={e => set('tcNumber', e.target.value)}
            placeholder="TC / Migration number" />
        </FormField>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════
   STEP 3 — Guardian Details
══════════════════════════════════════ */
function StepGuardian({ data, original, set, errors }) {
  const ch = k => data[k] !== original[k]
  return (
    <div className="afs-step-body">
      <SectionHead icon="👨‍👩‍👦" title="Guardian / Parent Details"
        sub="Primary guardian aur mother ki updated information" />

      <div className="afs-grid-2">
        <FormField label="Guardian Full Name" required error={errors.guardianName} changed={ch('guardianName')}>
          <Input value={data.guardianName} onChange={e => set('guardianName', e.target.value)}
            placeholder="e.g. Ramesh Kumar" />
        </FormField>

        <FormField label="Relationship" changed={ch('guardianRelation')}>
          <Select value={data.guardianRelation} onChange={e => set('guardianRelation', e.target.value)}
            options={['Father', 'Mother', 'Uncle', 'Aunt', 'Sibling', 'Other']} />
        </FormField>

        <FormField label="Guardian Phone" required error={errors.guardianPhone} changed={ch('guardianPhone')}>
          <Input value={data.guardianPhone}
            onChange={e => set('guardianPhone', e.target.value.replace(/\D/g, ''))}
            placeholder="10-digit mobile" maxLength={10} />
        </FormField>

        <FormField label="Guardian Email" changed={ch('guardianEmail')}>
          <Input type="email" value={data.guardianEmail}
            onChange={e => set('guardianEmail', e.target.value)}
            placeholder="parent@email.com" />
        </FormField>

        <FormField label="Occupation" changed={ch('guardianOccupation')}>
          <Select value={data.guardianOccupation}
            onChange={e => set('guardianOccupation', e.target.value)}
            placeholder="Select"
            options={['Government Service', 'Private Service', 'Business', 'Farmer', 'Self-Employed', 'Other']} />
        </FormField>

        <FormField label="Annual Family Income" changed={ch('guardianIncome')}>
          <Select value={data.guardianIncome}
            onChange={e => set('guardianIncome', e.target.value)}
            placeholder="Select range"
            options={[
              'Below ₹1 Lakh', '₹1–2.5 Lakh', '₹2.5–5 Lakh',
              '₹5–8 Lakh', '₹8–12 Lakh', 'Above ₹12 Lakh',
            ]} />
        </FormField>
      </div>

      <div className="afs-divider"><span>Mother's Details</span></div>
      <div className="afs-grid-2">
        <FormField label="Mother's Name" changed={ch('motherName')}>
          <Input value={data.motherName} onChange={e => set('motherName', e.target.value)}
            placeholder="e.g. Sunita Devi" />
        </FormField>

        <FormField label="Mother's Phone" changed={ch('motherPhone')}>
          <Input value={data.motherPhone}
            onChange={e => set('motherPhone', e.target.value.replace(/\D/g, ''))}
            placeholder="10-digit" maxLength={10} />
        </FormField>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════
   STEP 4 — Contact Details
══════════════════════════════════════ */
function StepContact({ data, original, set, errors }) {
  const ch = k => data[k] !== original[k]
  return (
    <div className="afs-step-body">
      <SectionHead icon="📞" title="Contact Details"
        sub="Email, phone aur residential address update karein" />

      <div className="afs-grid-2">
        <FormField label="Personal Email" required error={errors.personalEmail} changed={ch('personalEmail')}>
          <Input type="email" value={data.personalEmail}
            onChange={e => set('personalEmail', e.target.value)}
            placeholder="student@email.com" />
        </FormField>

        <FormField label="Personal Mobile" required error={errors.personalPhone} changed={ch('personalPhone')}>
          <Input value={data.personalPhone}
            onChange={e => set('personalPhone', e.target.value.replace(/\D/g, ''))}
            placeholder="10-digit" maxLength={10} />
        </FormField>
      </div>

      <div className="afs-divider"><span>Permanent Address</span></div>
      <FormField label="Address Line" required error={errors.permanentAddress} changed={ch('permanentAddress')}>
        <textarea className="afs-textarea" rows={2}
          value={data.permanentAddress}
          onChange={e => set('permanentAddress', e.target.value)}
          placeholder="House no., Street, Colony..." />
      </FormField>

      <div className="afs-grid-3" style={{ marginTop: 14 }}>
        <FormField label="City" required error={errors.city} changed={ch('city')}>
          <Input value={data.city} onChange={e => set('city', e.target.value)}
            placeholder="e.g. Delhi" />
        </FormField>

        <FormField label="State" required error={errors.state} changed={ch('state')}>
          <Select value={data.state} onChange={e => set('state', e.target.value)}
            placeholder="Select state"
            options={[
              'Delhi', 'Haryana', 'Uttar Pradesh', 'Rajasthan', 'Punjab',
              'Bihar', 'Jharkhand', 'Madhya Pradesh', 'Gujarat', 'Maharashtra',
              'Karnataka', 'Tamil Nadu', 'Andhra Pradesh', 'Telangana',
              'West Bengal', 'Himachal Pradesh', 'Uttarakhand', 'Other',
            ]} />
        </FormField>

        <FormField label="Pincode" required error={errors.pincode} changed={ch('pincode')}>
          <Input value={data.pincode}
            onChange={e => set('pincode', e.target.value.replace(/\D/g, ''))}
            placeholder="6-digit" maxLength={6} />
        </FormField>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════
   STEP 5 — Other Details
══════════════════════════════════════ */
function StepOther({ data, original, set }) {
  const ch = k => data[k] !== original[k]
  return (
    <div className="afs-step-body">
      <SectionHead icon="📋" title="Other Details"
        sub="Hostel, transport, scholarship preferences update karein" />

      <div className="afs-grid-2">
        <div className={`afs-toggle-card${ch('hostelRequired') ? ' esp-card-changed' : ''}`}>
          <div className="afs-toggle-top">
            <span className="afs-toggle-icon">🏠</span>
            <div>
              <div className="afs-toggle-title">
                Hostel Required?
                {ch('hostelRequired') && <span className="esp-changed-badge">● changed</span>}
              </div>
              <div className="afs-toggle-sub">Hostel allotment preference</div>
            </div>
          </div>
          <div className="afs-toggle-options">
            {['Yes', 'No'].map(v => (
              <label key={v}
                className={`afs-radio-btn${data.hostelRequired === v ? ' selected' : ''}`}>
                <input type="radio" name="hostel" value={v}
                  checked={data.hostelRequired === v}
                  onChange={() => set('hostelRequired', v)} hidden />
                {v}
              </label>
            ))}
          </div>
        </div>

        <div className={`afs-toggle-card${ch('transportRequired') ? ' esp-card-changed' : ''}`}>
          <div className="afs-toggle-top">
            <span className="afs-toggle-icon">🚌</span>
            <div>
              <div className="afs-toggle-title">
                Transport Required?
                {ch('transportRequired') && <span className="esp-changed-badge">● changed</span>}
              </div>
              <div className="afs-toggle-sub">College bus service enrollment</div>
            </div>
          </div>
          <div className="afs-toggle-options">
            {['Yes', 'No'].map(v => (
              <label key={v}
                className={`afs-radio-btn${data.transportRequired === v ? ' selected' : ''}`}>
                <input type="radio" name="transport" value={v}
                  checked={data.transportRequired === v}
                  onChange={() => set('transportRequired', v)} hidden />
                {v}
              </label>
            ))}
          </div>
        </div>
      </div>

      {data.transportRequired === 'Yes' && (
        <FormField label="Preferred Bus Route" changed={ch('busRoute')}>
          <Select value={data.busRoute} onChange={e => set('busRoute', e.target.value)}
            placeholder="Select route"
            options={[
              { value: 'RT-01', label: 'RT-01 · College → Sector 14' },
              { value: 'RT-02', label: 'RT-02 · College → Sector 22' },
              { value: 'RT-03', label: 'RT-03 · College → Old Bus Stand' },
            ]} />
        </FormField>
      )}

      <div className="afs-divider"><span>Scholarship</span></div>
      <div className="afs-grid-2">
        <div className={`afs-toggle-card${ch('scholarshipApplicable') ? ' esp-card-changed' : ''}`}>
          <div className="afs-toggle-top">
            <span className="afs-toggle-icon">🎖</span>
            <div>
              <div className="afs-toggle-title">
                Scholarship Applicable?
                {ch('scholarshipApplicable') && <span className="esp-changed-badge">● changed</span>}
              </div>
              <div className="afs-toggle-sub">Government ya private scheme</div>
            </div>
          </div>
          <div className="afs-toggle-options">
            {['Yes', 'No'].map(v => (
              <label key={v}
                className={`afs-radio-btn${data.scholarshipApplicable === v ? ' selected' : ''}`}>
                <input type="radio" name="scholarship" value={v}
                  checked={data.scholarshipApplicable === v}
                  onChange={() => set('scholarshipApplicable', v)} hidden />
                {v}
              </label>
            ))}
          </div>
        </div>

        {data.scholarshipApplicable === 'Yes' && (
          <FormField label="Scholarship Scheme Name" changed={ch('scholarshipScheme')}>
            <Input value={data.scholarshipScheme}
              onChange={e => set('scholarshipScheme', e.target.value)}
              placeholder="e.g. NSP OBC, PM Scholarship..." />
          </FormField>
        )}
      </div>

      <div className="afs-divider"><span>Additional Remarks</span></div>
      <FormField label="Remarks / Notes" changed={ch('remarks')}>
        <textarea className="afs-textarea" rows={3}
          value={data.remarks}
          onChange={e => set('remarks', e.target.value)}
          placeholder="Admin notes ya special instructions..." />
      </FormField>
    </div>
  )
}

/* ══════════════════════════════════════
   CHANGES SIDEBAR
══════════════════════════════════════ */
const FIELD_LABELS = {
  firstName: 'First Name', lastName: 'Last Name', dob: 'DOB',
  gender: 'Gender', category: 'Category', bloodGroup: 'Blood Group',
  religion: 'Religion', aadhar: 'Aadhar',
  branch: 'Branch', semester: 'Semester', section: 'Section',
  admYear: 'Adm. Year', programme: 'Programme',
  feeCategory: 'Fee Category', status: 'Status',
  guardianName: 'Guardian Name', guardianRelation: 'Relation',
  guardianPhone: 'Guardian Phone', guardianEmail: 'Guardian Email',
  guardianOccupation: 'Occupation', guardianIncome: 'Income',
  motherName: 'Mother Name', motherPhone: 'Mother Phone',
  personalEmail: 'Email', personalPhone: 'Phone',
  permanentAddress: 'Address', city: 'City', state: 'State', pincode: 'Pincode',
  hostelRequired: 'Hostel', transportRequired: 'Transport',
  busRoute: 'Bus Route', scholarshipApplicable: 'Scholarship',
  scholarshipScheme: 'Scheme', remarks: 'Remarks',
}

function ChangesSidebar({ form, original }) {
  const changes = useMemo(() => {
    return Object.keys(FIELD_LABELS).filter(k => form[k] !== original[k] && k !== 'photo')
  }, [form, original])

  const fullName = `${form.firstName} ${form.lastName}`.trim()
  const initials = fullName.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('')

  return (
    <div className="afs-sidebar">
      <div className="afs-sidebar-title">✏ Editing</div>

      {/* Student identity card */}
      <div className="esp-identity-card">
        <div className="esp-identity-av">{initials || '?'}</div>
        <div>
          <div className="esp-identity-name">{fullName || 'Student'}</div>
          <div className="esp-identity-id">{form.rollNumber || '—'}</div>
          <div className="esp-identity-meta">
            <span className="pill pill-blue">{form.branch || '—'}</span>
            <span className="pill pill-teal">Sem {form.semester || '—'}</span>
          </div>
        </div>
      </div>

      {/* Status badge */}
      <div className={`esp-status-bar esp-status-${(form.status || 'active').toLowerCase()}`}>
        {form.status === 'Active' && '✓ Active'}
        {form.status === 'Detained' && '⚠ Detained'}
        {form.status === 'Alumni' && '🎓 Alumni'}
        {form.status === 'Dropout' && '✕ Dropout'}
        {!form.status && '— Status not set'}
      </div>

      {/* Changes tracker */}
      <div className="esp-changes-box">
        <div className="esp-changes-title">
          {changes.length === 0 ? '✓ No changes yet' : `${changes.length} field${changes.length > 1 ? 's' : ''} changed`}
        </div>

        {changes.length === 0
          ? <div className="esp-no-changes">Koi bhi field edit karo — changes yahan dikhenge.</div>
          : changes.map(k => (
            <div key={k} className="esp-change-row">
              <div className="esp-change-label">{FIELD_LABELS[k]}</div>
              <div className="esp-change-vals">
                <span className="esp-old">{original[k] || '—'}</span>
                <span className="esp-arrow">→</span>
                <span className="esp-new">{form[k] || '—'}</span>
              </div>
            </div>
          ))
        }
      </div>

      {/* Quick info */}
      <div className="esp-quick-info">
        <div className="esp-qi-row"><span>CGPA</span><span className="esp-qi-val">—</span></div>
        <div className="esp-qi-row"><span>Attendance</span><span className="esp-qi-val">—</span></div>
        <div className="esp-qi-row"><span>Fee Status</span><span className="esp-qi-val">—</span></div>
      </div>

      <div className="esp-sidebar-note">
        🔒 CGPA, attendance aur fee status system-generated hain — yahan edit nahi hote.
      </div>
    </div>
  )
}

/* ══════════════════════════════════════
   VALIDATION
══════════════════════════════════════ */
function validate(step, data) {
  const e = {}
  if (step === 1) {
    if (!data.firstName.trim()) e.firstName = 'First name required'
    if (!data.lastName.trim()) e.lastName = 'Last name required'
    if (data.aadhar && data.aadhar.length !== 12) e.aadhar = 'Must be 12 digits'
  }
  if (step === 2) {
    if (!data.branch) e.branch = 'Select branch'
    if (!data.semester) e.semester = 'Select semester'
    if (!data.admYear) e.admYear = 'Select admission year'
  }
  if (step === 3) {
    if (!data.guardianName.trim()) e.guardianName = 'Guardian name required'
    if (data.guardianPhone.length !== 10) e.guardianPhone = 'Valid 10-digit number required'
  }
  if (step === 4) {
    if (!data.personalEmail.includes('@')) e.personalEmail = 'Valid email required'
    if (data.personalPhone && data.personalPhone.length !== 10) e.personalPhone = 'Valid 10-digit number'
    if (data.pincode && data.pincode.length !== 6) e.pincode = 'Valid 6-digit pincode'
  }
  return e
}

/* ══════════════════════════════════════
   CONFIRM DISCARD MODAL
══════════════════════════════════════ */
function DiscardModal({ changeCount, onConfirm, onCancel }) {
  return (
    <div className="esp-modal-overlay">
      <div className="esp-modal">
        <div className="esp-modal-icon">⚠️</div>
        <div className="esp-modal-title">Discard {changeCount} change{changeCount > 1 ? 's' : ''}?</div>
        <div className="esp-modal-sub">
          Ye changes save nahi honge. Kya aap wapas jaana chahte hain?
        </div>
        <div className="esp-modal-actions">
          <button className="afs-btn-outline" onClick={onCancel}>Keep Editing</button>
          <button className="esp-btn-discard" onClick={onConfirm}>Discard & Go Back</button>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════ */
export default function EditStudentPage({ student, onNav, onCancel, onUpdated }) {
  const original = useMemo(() => buildInitial(student), [student])

  const [step, setStep] = useState(1)
  const [form, setForm] = useState(() => buildInitial(student))
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [showDiscard, setShowDiscard] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  if (!student) return (
    <div className="afs-success-screen">
      <div style={{ fontSize: 40 }}>⚠️</div>
      <div className="afs-success-title" style={{ color: '#dc2626' }}>No student selected</div>
      <button className="afs-btn-primary" onClick={() => onNav?.('students')}>
        ← Back to Students
      </button>
    </div>
  )

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }))
    setErrors(e => ({ ...e, [key]: undefined }))
  }

  /* Count total changes */
  const totalChanges = Object.keys(FIELD_LABELS).filter(
    k => form[k] !== original[k] && k !== 'photo'
  ).length + (form.photo ? 1 : 0)

  const goNext = () => {
    const e = validate(step, form)
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({})
    setStep(s => Math.min(s + 1, 5))
  }

  const goBack = () => {
    if (step === 1) {
      if (totalChanges > 0) { setShowDiscard(true); return }
      onNav?.('students')
      return
    }
    setStep(s => s - 1)
  }

  const handleUpdate = async () => {
    const e = validate(step, form)
    if (Object.keys(e).length) { setErrors(e); return }

    const studentId = student._id
    if (!studentId) {
      setSaveError('Student record ID is missing.')
      return
    }

    setSaving(true)
    setSaveError('')

    try {
      const response = await apiFetch(`/students/${studentId}`, {
        method: 'PUT',
        body: JSON.stringify(mapFormToPayload(form)),
      })

      onUpdated?.(response.data)
      setSubmitted(true)
    } catch (err) {
      setSaveError(err.message || 'Failed to update student')
    } finally {
      setSaving(false)
    }
  }

  /* ── Success screen ── */
  if (submitted) {
    return (
      <div className="afs-success-screen">
        <div className="afs-success-icon">✅</div>
        <h2 className="afs-success-title">Profile Updated!</h2>
        <p className="afs-success-sub">
          <strong>{form.firstName} {form.lastName}</strong> ({form.rollNumber}) ka record
          successfully update ho gaya hai.
          {totalChanges > 0 && <> <br /><span style={{ color: '#059669' }}>{totalChanges} field{totalChanges > 1 ? 's' : ''} changed.</span></>}
        </p>
        <div className="afs-success-actions">
          <button className="afs-btn-primary" onClick={() => onNav?.('studentProfile')}> ← View Profile </button>
          <button className="afs-btn-outline" onClick={() => onNav?.('students')}> All Students →</button>
        </div>
      </div>
    )
  }

  const STEP_COMPONENTS = [StepPersonal, StepAcademic, StepGuardian, StepContact, StepOther]
  const CurrentStep = STEP_COMPONENTS[step - 1]

  return (
    <div className="afs-root">

      {showDiscard && (
        <DiscardModal
          changeCount={totalChanges}
          onCancel={() => setShowDiscard(false)}
          onConfirm={() => { setShowDiscard(false); onNav?.('students') }}
        />
      )}

      {/* ── PAGE HEADER ── */}
      <div className="ad-page-header">
        <div>
          <div className="ad-page-title">Edit Student Profile</div>
          <div className="ad-page-sub">
            {student.firstName} {student.lastName} · {student.rollNumber} · {student.branch}
          </div>
        </div>
        <div className="ad-header-actions">
          {totalChanges > 0 && (
            <span className="esp-unsaved-badge">
              ● {totalChanges} unsaved change{totalChanges > 1 ? 's' : ''}
            </span>
          )}
          <button className="ad-btn-outline" onClick={goBack}>
            {totalChanges > 0 ? '✕ Discard' : '← Back'}
          </button>
        </div>
      </div>

      {/* ── STEPPER ── */}
      <div className="afs-stepper">
        {STEPS.map((s, i) => {
          const status = step > s.id ? 'done' : step === s.id ? 'active' : 'pending'
          return (
            <div key={s.id} className={`afs-step ${status}`}
              onClick={() => step > s.id && setStep(s.id)}
              style={{ cursor: step > s.id ? 'pointer' : 'default' }}>
              <div className="afs-step-bubble">
                {status === 'done' ? '✓' : s.icon}
              </div>
              <div className="afs-step-label">{s.label}</div>
              {i < STEPS.length - 1 && <div className="afs-step-line" />}
            </div>
          )
        })}
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div className="afs-layout">

        {/* Form area */}
        <div className="afs-form-area">
          <CurrentStep data={form} original={original} set={set} errors={errors} />

          <div className="afs-nav-row">
            <button className="afs-btn-outline" onClick={goBack} disabled={saving}>
              {step === 1 ? (totalChanges > 0 ? '✕ Discard' : '← Back') : '← Back'}
            </button>

            {step < 5
              ? <button className="afs-btn-primary" onClick={goNext}>Next →</button>
              : (
                <>
                  {saveError && <span className="afs-error">⚠ {saveError}</span>}
                  <button
                    className={`afs-btn-success${totalChanges === 0 ? ' esp-btn-disabled' : ''}`}
                    onClick={handleUpdate}
                    disabled={totalChanges === 0 || saving}
                  >
                    {saving
                      ? 'Saving...'
                      : totalChanges === 0
                        ? 'No Changes to Save'
                        : `✓ Save ${totalChanges} Change${totalChanges > 1 ? 's' : ''}`}
                  </button>
                </>
              )
            }
          </div>
        </div>

        {/* Changes sidebar */}
        <ChangesSidebar form={form} original={original} />

      </div>
    </div>
  )
}