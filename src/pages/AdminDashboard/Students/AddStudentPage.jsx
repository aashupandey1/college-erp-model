import { useState } from 'react'
import './AddStudentPage.css'
import { apiFetch } from "../../../services/api";

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
  INITIAL FORM STATE
══════════════════════════════════════ */
const INIT = {
  /* Personal */
  firstName: '', lastName: '', dob: '', gender: '', category: '',
  bloodGroup: '', religion: '', aadhar: '', photo: null,

  /* Academic */
  rollNumber: '', branch: '', semester: '', section: '',
  admYear: '', admDate: '', programme: 'B.Tech',
  feeCategory: '', previousSchool: '', tcNumber: '',

  /* Guardian */
  guardianName: '', guardianRelation: 'Father', guardianPhone: '',
  guardianEmail: '', guardianOccupation: '', guardianIncome: '',
  guardianAddress: '', motherName: '', motherPhone: '',

  /* Contact */
  personalEmail: '', personalPhone: '', permanentAddress: '',
  city: '', state: '', pincode: '', sameAsPermanent: false,

  /* Other */
  hostelRequired: 'No', transportRequired: 'No',
  busRoute: '', scholarshipApplicable: 'No',
  scholarshipScheme: '', remarks: '',
}

/* ══════════════════════════════════════
  SUB-COMPONENTS
══════════════════════════════════════ */
function FormField({ label, required, error, children }) {
  return (
    <div className="afs-field">
      <label className="afs-label">
        {label}
        {required && <span className="afs-req">*</span>}
      </label>
      {children}
      {error && <span className="afs-error">⚠ {error}</span>}
    </div>
  )
}

function Input({ value, onChange, placeholder, type = 'text', maxLength, disabled }) {
  return (
    <input
      className={`afs-input${value ? ' afs-input-filled' : ''}`}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      maxLength={maxLength}
      disabled={disabled}
    />
  )
}

function Select({ value, onChange, options, placeholder }) {
  return (
    <select
      className={`afs-select${value ? ' afs-input-filled' : ''}`}
      value={value}
      onChange={onChange}
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
  STEP 1 — Personal Information
══════════════════════════════════════ */
function StepPersonal({ data, set, errors }) {
  return (
    <div className="afs-step-body">
      <SectionHead icon="👤" title="Personal Information"
        sub="Student ki basic personal details fill karein" />

      {/* Photo upload */}
      <div className="afs-photo-row">
        <div className="afs-photo-box">
          {data.photo
            ? <img src={URL.createObjectURL(data.photo)} alt="preview" className="afs-photo-img" />
            : <div className="afs-photo-placeholder">📷<br /><span>Upload Photo</span></div>
          }
        </div>
        <div className="afs-photo-info">
          <div className="afs-photo-title">Student Photograph</div>
          <div className="afs-photo-sub">JPG / PNG · Max 2MB · Passport size preferred</div>
          <label className="afs-btn-outline afs-upload-btn">
            Choose File
            <input type="file" accept="image/*" hidden
              onChange={e => set('photo', e.target.files[0])} />
          </label>
        </div>
      </div>

      <div className="afs-grid-2">
        <FormField label="First Name" required error={errors.firstName}>
          <Input value={data.firstName} onChange={e => set('firstName', e.target.value)}
            placeholder="e.g. Aashish" />
        </FormField>

        <FormField label="Last Name" required error={errors.lastName}>
          <Input value={data.lastName} onChange={e => set('lastName', e.target.value)}
            placeholder="e.g. Kumar" />
        </FormField>

        <FormField label="Date of Birth" required error={errors.dob}>
          <Input type="date" value={data.dob} onChange={e => set('dob', e.target.value)} />
        </FormField>

        <FormField label="Gender" required error={errors.gender}>
          <Select value={data.gender} onChange={e => set('gender', e.target.value)}
            placeholder="Select gender"
            options={['Male', 'Female', 'Other']} />
        </FormField>

        <FormField label="Category" required error={errors.category}>
          <Select value={data.category} onChange={e => set('category', e.target.value)}
            placeholder="Select category"
            options={['General', 'OBC', 'SC', 'ST', 'EWS']} />
        </FormField>

        <FormField label="Blood Group">
          <Select value={data.bloodGroup} onChange={e => set('bloodGroup', e.target.value)}
            placeholder="Select blood group"
            options={['A+', 'A−', 'B+', 'B−', 'AB+', 'AB−', 'O+', 'O−']} />
        </FormField>

        <FormField label="Religion">
          <Select value={data.religion} onChange={e => set('religion', e.target.value)}
            placeholder="Select religion"
            options={['Hindu', 'Muslim', 'Christian', 'Sikh', 'Other']} />
        </FormField>

        <FormField label="Aadhar Number" error={errors.aadhar}>
          <Input value={data.aadhar} onChange={e => set('aadhar', e.target.value.replace(/\D/g, ''))}
            placeholder="XXXX XXXX XXXX" maxLength={12} />
        </FormField>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════
  STEP 2 — Academic Details
══════════════════════════════════════ */
function StepAcademic({ data, set, errors }) {
  return (
    <div className="afs-step-body">
      <SectionHead icon="🎓" title="Academic Details"
        sub="Enrollment, branch, aur previous education details" />

      <div className="afs-grid-2">
        <FormField label="Roll / Enrollment Number" required error={errors.rollNumber}>
          <Input value={data.rollNumber} onChange={e => set('rollNumber', e.target.value.toUpperCase())}
            placeholder="e.g. 2024CSE001" />
        </FormField>

        <FormField label="Programme" required>
          <Select value={data.programme} onChange={e => set('programme', e.target.value)}
            options={['B.Tech', 'M.Tech', 'BCA', 'MCA', 'B.Sc', 'MBA']} />
        </FormField>

        <FormField label="Branch / Department" required error={errors.branch}>
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

        <FormField label="Current Semester" required error={errors.semester}>
          <Select value={data.semester} onChange={e => set('semester', e.target.value)}
            placeholder="Select semester"
            options={['1', '2', '3', '4', '5', '6', '7', '8']} />
        </FormField>

        <FormField label="Section">
          <Select value={data.section} onChange={e => set('section', e.target.value)}
            placeholder="Select section"
            options={['A', 'B', 'C', 'D']} />
        </FormField>

        <FormField label="Admission Year" required error={errors.admYear}>
          <Select value={data.admYear} onChange={e => set('admYear', e.target.value)}
            placeholder="Select year"
            options={['2020', '2021', '2022', '2023', '2024', '2025']} />
        </FormField>

        <FormField label="Admission Date">
          <Input type="date" value={data.admDate} onChange={e => set('admDate', e.target.value)} />
        </FormField>

        <FormField label="Fee Category">
          <Select value={data.feeCategory} onChange={e => set('feeCategory', e.target.value)}
            placeholder="Select category"
            options={['Regular', 'Management Quota', 'NRI', 'Scholarship']} />
        </FormField>
      </div>

      {/* Previous education */}
      <div className="afs-divider">
        <span>Previous Education</span>
      </div>
      <div className="afs-grid-2">
        <FormField label="Previous School / College">
          <Input value={data.previousSchool} onChange={e => set('previousSchool', e.target.value)}
            placeholder="e.g. Govt. Sr. Sec. School, Delhi" />
        </FormField>

        <FormField label="Transfer Certificate Number">
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
function StepGuardian({ data, set, errors }) {
  return (
    <div className="afs-step-body">
      <SectionHead icon="👨‍👩‍👦" title="Guardian / Parent Details"
        sub="Primary guardian aur mother ki information" />

      <div className="afs-info-banner">
        <span>ℹ</span>
        <span>Primary guardian ka mobile number Parent Portal login ke liye use hoga.</span>
      </div>

      <div className="afs-grid-2">
        <FormField label="Guardian Full Name" required error={errors.guardianName}>
          <Input value={data.guardianName} onChange={e => set('guardianName', e.target.value)}
            placeholder="e.g. Ramesh Kumar" />
        </FormField>

        <FormField label="Relationship" required>
          <Select value={data.guardianRelation} onChange={e => set('guardianRelation', e.target.value)}
            options={['Father', 'Mother', 'Uncle', 'Aunt', 'Sibling', 'Other']} />
        </FormField>

        <FormField label="Guardian Phone" required error={errors.guardianPhone}>
          <Input value={data.guardianPhone} onChange={e => set('guardianPhone', e.target.value.replace(/\D/g, ''))}
            placeholder="10-digit mobile number" maxLength={10} />
        </FormField>

        <FormField label="Guardian Email">
          <Input type="email" value={data.guardianEmail}
            onChange={e => set('guardianEmail', e.target.value)}
            placeholder="parent@email.com" />
        </FormField>

        <FormField label="Occupation">
          <Select value={data.guardianOccupation}
            onChange={e => set('guardianOccupation', e.target.value)}
            placeholder="Select occupation"
            options={['Government Service', 'Private Service', 'Business', 'Farmer', 'Self-Employed', 'Other']} />
        </FormField>

        <FormField label="Annual Family Income">
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
        <FormField label="Mother's Name">
          <Input value={data.motherName} onChange={e => set('motherName', e.target.value)}
            placeholder="e.g. Sunita Devi" />
        </FormField>

        <FormField label="Mother's Phone">
          <Input value={data.motherPhone} onChange={e => set('motherPhone', e.target.value.replace(/\D/g, ''))}
            placeholder="10-digit mobile number" maxLength={10} />
        </FormField>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════
  STEP 4 — Contact Details
══════════════════════════════════════ */
function StepContact({ data, set, errors }) {
  return (
    <div className="afs-step-body">
      <SectionHead icon="📞" title="Contact Details"
        sub="Student ka email, phone, aur residential address" />

      <div className="afs-grid-2">
        <FormField label="Personal Email" required error={errors.personalEmail}>
          <Input type="email" value={data.personalEmail}
            onChange={e => set('personalEmail', e.target.value)}
            placeholder="student@email.com" />
        </FormField>

        <FormField label="Personal Mobile" required error={errors.personalPhone}>
          <Input value={data.personalPhone}
            onChange={e => set('personalPhone', e.target.value.replace(/\D/g, ''))}
            placeholder="10-digit number" maxLength={10} />
        </FormField>
      </div>

      <div className="afs-divider"><span>Permanent Address</span></div>
      <div className="afs-grid-1">
        <FormField label="Address Line" required error={errors.permanentAddress}>
          <textarea className="afs-textarea" rows={2}
            value={data.permanentAddress}
            onChange={e => set('permanentAddress', e.target.value)}
            placeholder="House no., Street, Colony..."
          />
        </FormField>
      </div>
      <div className="afs-grid-3">
        <FormField label="City" required error={errors.city}>
          <Input value={data.city} onChange={e => set('city', e.target.value)}
            placeholder="e.g. Delhi" />
        </FormField>

        <FormField label="State" required error={errors.state}>
          <Select value={data.state} onChange={e => set('state', e.target.value)}
            placeholder="Select state"
            options={[
              'Andhra Pradesh', 'Bihar', 'Delhi', 'Gujarat', 'Haryana',
              'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
              'Madhya Pradesh', 'Maharashtra', 'Punjab', 'Rajasthan',
              'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'Uttarakhand',
              'West Bengal', 'Other',
            ]} />
        </FormField>

        <FormField label="Pincode" required error={errors.pincode}>
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
function StepOther({ data, set }) {
  return (
    <div className="afs-step-body">
      <SectionHead icon="📋" title="Other Details"
        sub="Hostel, transport, scholarship aur additional remarks" />

      <div className="afs-grid-2">
        {/* Hostel */}
        <div className="afs-toggle-card">
          <div className="afs-toggle-top">
            <span className="afs-toggle-icon">🏠</span>
            <div>
              <div className="afs-toggle-title">Hostel Required?</div>
              <div className="afs-toggle-sub">Hostel allotment ke liye apply</div>
            </div>
          </div>
          <div className="afs-toggle-options">
            {['Yes', 'No'].map(v => (
              <label key={v} className={`afs-radio-btn${data.hostelRequired === v ? ' selected' : ''}`}>
                <input type="radio" name="hostel" value={v}
                  checked={data.hostelRequired === v}
                  onChange={() => set('hostelRequired', v)} hidden />
                {v}
              </label>
            ))}
          </div>
        </div>

        {/* Transport */}
        <div className="afs-toggle-card">
          <div className="afs-toggle-top">
            <span className="afs-toggle-icon">🚌</span>
            <div>
              <div className="afs-toggle-title">Transport Required?</div>
              <div className="afs-toggle-sub">College bus service enrollment</div>
            </div>
          </div>
          <div className="afs-toggle-options">
            {['Yes', 'No'].map(v => (
              <label key={v} className={`afs-radio-btn${data.transportRequired === v ? ' selected' : ''}`}>
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
        <FormField label="Preferred Bus Route">
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
        <div className="afs-toggle-card">
          <div className="afs-toggle-top">
            <span className="afs-toggle-icon">🎖</span>
            <div>
              <div className="afs-toggle-title">Scholarship Applicable?</div>
              <div className="afs-toggle-sub">Government ya private scheme</div>
            </div>
          </div>
          <div className="afs-toggle-options">
            {['Yes', 'No'].map(v => (
              <label key={v} className={`afs-radio-btn${data.scholarshipApplicable === v ? ' selected' : ''}`}>
                <input type="radio" name="scholarship" value={v}
                  checked={data.scholarshipApplicable === v}
                  onChange={() => set('scholarshipApplicable', v)} hidden />
                {v}
              </label>
            ))}
          </div>
        </div>

        {data.scholarshipApplicable === 'Yes' && (
          <FormField label="Scholarship Scheme Name">
            <Input value={data.scholarshipScheme}
              onChange={e => set('scholarshipScheme', e.target.value)}
              placeholder="e.g. NSP OBC, PM Scholarship..." />
          </FormField>
        )}
      </div>

      <div className="afs-divider"><span>Additional Remarks</span></div>
      <FormField label="Remarks / Notes">
        <textarea className="afs-textarea" rows={3}
          value={data.remarks}
          onChange={e => set('remarks', e.target.value)}
          placeholder="Koi special note admin ke liye..."
        />
      </FormField>

      {/* Documents checklist */}
      <div className="afs-doc-checklist">
        <div className="afs-section-title" style={{ marginBottom: 12 }}>
          📄 Documents Checklist
        </div>
        <div className="afs-doc-note">
          Ye documents admission ke time collect kiye jaayenge:
        </div>
        <div className="afs-doc-grid">
          {[
            'Aadhar Card', '10th Marksheet', '12th Marksheet',
            'Transfer Certificate', 'Category Certificate', 'Income Certificate',
            'Passport Photo (4 copies)', 'Character Certificate',
          ].map((doc, i) => (
            <label key={i} className="afs-doc-item">
              <input type="checkbox" className="afs-checkbox" />
              <span>{doc}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════
  REVIEW PANEL
══════════════════════════════════════ */
function ReviewPanel({ data }) {
  const fullName = `${data.firstName} ${data.lastName}`.trim()
  return (
    <div className="afs-review">
      <div className="afs-review-hero">
        <div className="afs-review-av">
          {data.photo
            ? <img src={URL.createObjectURL(data.photo)} alt="student" className="afs-photo-img" />
            : <span>{fullName.split(' ').map(n => n[0]).join('').toUpperCase() || '?'}</span>
          }
        </div>
        <div>
          <div className="afs-review-name">{fullName || 'Student Name'}</div>
          <div className="afs-review-roll">{data.rollNumber || 'Roll not assigned'}</div>
          <div className="afs-review-tags">
            {data.branch && <span className="pill pill-blue">{data.branch}</span>}
            {data.semester && <span className="pill pill-teal">Sem {data.semester}</span>}
            {data.programme && <span className="pill pill-purple">{data.programme}</span>}
          </div>
        </div>
      </div>

      {[
        {
          title: '👤 Personal', rows: [
            ['DOB', data.dob], ['Gender', data.gender],
            ['Category', data.category], ['Blood Group', data.bloodGroup],
            ['Aadhar', data.aadhar || '—'],
          ]
        },
        {
          title: '🎓 Academic', rows: [
            ['Branch', data.branch], ['Section', data.section || '—'],
            ['Adm. Year', data.admYear], ['Fee Category', data.feeCategory || '—'],
          ]
        },
        {
          title: '👨‍👩‍👦 Guardian', rows: [
            ['Name', data.guardianName], ['Relation', data.guardianRelation],
            ['Phone', data.guardianPhone || '—'], ['Income', data.guardianIncome || '—'],
          ]
        },
        {
          title: '📞 Contact', rows: [
            ['Email', data.personalEmail || '—'],
            ['Phone', data.personalPhone || '—'],
            ['City', `${data.city}${data.state ? ', ' + data.state : ''}`],
            ['Pincode', data.pincode || '—'],
          ]
        },
        {
          title: '📋 Other', rows: [
            ['Hostel', data.hostelRequired],
            ['Transport', data.transportRequired],
            ['Scholarship', data.scholarshipApplicable],
          ]
        },
      ].map((sec, si) => (
        <div key={si} className="afs-review-section">
          <div className="afs-review-section-title">{sec.title}</div>
          {sec.rows.map(([label, val], ri) => (
            <div key={ri} className="afs-review-row">
              <span className="afs-review-label">{label}</span>
              <span className="afs-review-val">{val || '—'}</span>
            </div>
          ))}
        </div>
      ))}
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
    if (!data.dob) e.dob = 'Date of birth required'
    if (!data.gender) e.gender = 'Select gender'
    if (!data.category) e.category = 'Select category'
    if (data.aadhar && data.aadhar.length !== 12) e.aadhar = 'Must be 12 digits'
  }
  if (step === 2) {
    if (!data.rollNumber.trim()) e.rollNumber = 'Roll number required'
    if (!data.branch) e.branch = 'Select branch'
    if (!data.semester) e.semester = 'Select semester'
    if (!data.admYear) e.admYear = 'Select admission year'
  }
  if (step === 3) {
    if (!data.guardianName.trim()) e.guardianName = 'Guardian name required'
    if (!data.guardianPhone.trim() || data.guardianPhone.length !== 10)
      e.guardianPhone = 'Valid 10-digit number required'
  }
  if (step === 4) {
    if (!data.personalEmail.includes('@')) e.personalEmail = 'Valid email required'
    if (data.personalPhone.length !== 10) e.personalPhone = 'Valid 10-digit number required'
    if (!data.permanentAddress.trim()) e.permanentAddress = 'Address required'
    if (!data.city.trim()) e.city = 'City required'
    if (!data.state) e.state = 'Select state'
    if (data.pincode.length !== 6) e.pincode = 'Valid 6-digit pincode'
  }
  return e
}

/* ══════════════════════════════════════
  MAIN COMPONENT
══════════════════════════════════════ */
export default function AddStudentPage({ onClose }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(INIT)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }))
    setErrors(e => ({ ...e, [key]: undefined }))
  }

  const goNext = () => {
    const e = validate(step, form)
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({})
    setStep(s => Math.min(s + 1, 6))
  }

  const goBack = () => setStep(s => Math.max(s - 1, 1))

  const handleSubmit = async () => {
    const e = validate(step, form);

    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    try {
      await apiFetch("/students", {
        method: "POST",
        body: JSON.stringify({
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

          remarks: form.remarks
        })
      });

      setSubmitted(true);

    } catch (err) {
      alert(err.message);
    }
  };

  /* ── Success screen ── */
  if (submitted) {
    return (
      <div className="afs-success-screen">
        <div className="afs-success-icon">🎉</div>
        <h2 className="afs-success-title">Student Added Successfully!</h2>
        <p className="afs-success-sub">
          <strong>{form.firstName} {form.lastName}</strong> ({form.rollNumber}) ka record create ho gaya hai.
        </p>
        <div className="afs-success-actions">
          <button className="afs-btn-outline" onClick={() => { setForm(INIT); setStep(1); setSubmitted(false) }}>
            ➕ Add Another Student
          </button>
          <button className="afs-btn-primary" onClick={() => {
            onClose();
          }}>
            ← Back to Students
          </button>
        </div>
      </div>
    )
  }

  const STEP_COMPONENTS = [StepPersonal, StepAcademic, StepGuardian, StepContact, StepOther]
  const CurrentStep = STEP_COMPONENTS[step - 1]
  const isReview = step === 6

  return (
    <div className="afs-root">

      {/* ── PAGE HEADER ── */}
      <div className="ad-page-header">
        <div>
          <div className="ad-page-title">Add New Student</div>
          <div className="ad-page-sub">Naye student ka complete enrollment form</div>
        </div>
        <div className="ad-header-actions">
          <button type="button" className="ad-btn-outline" onClick={onClose}>
            ✕ Cancel
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
              style={{ cursor: step > s.id ? 'pointer' : 'default' }}
            >
              <div className="afs-step-bubble">
                {status === 'done' ? '✓' : s.icon}
              </div>
              <div className="afs-step-label">{s.label}</div>
              {i < STEPS.length - 1 && <div className="afs-step-line" />}
            </div>
          )
        })}
        {/* Review step */}
        <div className={`afs-step ${isReview ? 'active' : step > 5 ? 'done' : 'pending'}`}>
          <div className="afs-step-bubble">👁</div>
          <div className="afs-step-label">Review</div>
        </div>
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div className="afs-layout">

        {/* Form area */}
        <div className="afs-form-area">
          {!isReview
            ? <CurrentStep data={form} set={set} errors={errors} />
            : (
              <div className="afs-step-body">
                <SectionHead icon="👁" title="Review & Confirm"
                  sub="Sab details check karein, phir submit karein" />
                <div className="afs-info-banner">
                  <span>ℹ</span>
                  <span>Koi bhi section edit karne ke liye uske step pe click karein (stepper mein).</span>
                </div>
              </div>
            )
          }

          {/* Navigation buttons */}
          <div className="afs-nav-row">
            {step > 1
              ? <button className="afs-btn-outline" onClick={goBack}>← Back</button>
              : <div />
            }
            {!isReview
              ? <button className="afs-btn-primary" onClick={goNext}>
                {step === 5 ? 'Review →' : 'Next →'}
              </button>
              : <button className="afs-btn-success" onClick={handleSubmit}>
                ✓ Submit & Add Student
              </button>
            }
          </div>
        </div>

        {/* Review sidebar — always visible on desktop */}
        <div className="afs-sidebar">
          <div className="afs-sidebar-title">📋 Preview</div>
          <ReviewPanel data={form} />
        </div>

      </div>
    </div>
  )
}