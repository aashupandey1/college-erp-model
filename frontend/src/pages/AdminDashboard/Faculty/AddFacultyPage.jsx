/* ═══════════════════════════════════════════════════════════════
   ADD FACULTY PAGE  —  Production-Ready Architecture
   Multi-step form · 4 steps
   Props:
     onBack  — Faculty list pe wapas jane ka handler
     onSave  — Cleaned payload return karta hai (no auto ID)
═══════════════════════════════════════════════════════════════ */

import { useState } from 'react'
import './AddFacultyPage.css'

import { FI } from '../constants/facultyIcons'
import { INITIAL_FACULTY_STATE } from '../constants/facultyInitialState'
import { required, emailVal, phoneVal, aadhaarVal } from '../utils/facultyValidation'
import StepBar from "../../../components/common/StepBar";
const STEPS = [
    { id: 1, label: "Personal Details" },
    { id: 2, label: "Professional Details" },
    { id: 3, label: "Subjects & Workload" },
    { id: 4, label: "Preview" },
];

import Step1Personal from './steps/Step1Personal'
import Step2Professional from './steps/Step2Professional'
import Step3Subjects from './steps/Step3Subjects'
import Step4Preview from './steps/Step4Preview'

/* ── Validation per step (uses imported helpers) ── */
function validateStep(step, data) {
    const errs = {}

    if (step === 1) {
        const r1 = required(data.firstName); if (r1) errs.firstName = r1
        const r2 = required(data.lastName); if (r2) errs.lastName = r2
        const r3 = required(data.dob); if (r3) errs.dob = r3
        const r4 = required(data.gender); if (r4) errs.gender = r4
        const r5 = phoneVal(data.phone); if (r5) errs.phone = r5
        const r6 = emailVal(data.email); if (r6) errs.email = r6
        const r7 = required(data.address); if (r7) errs.address = r7
        const r8 = required(data.city); if (r8) errs.city = r8
        if (data.aadhaar) { const r = aadhaarVal(data.aadhaar); if (r) errs.aadhaar = r }
    }

    if (step === 2) {
        const r1 = required(data.dept); if (r1) errs.dept = r1
        const r2 = required(data.desig); if (r2) errs.desig = r2
        const r3 = required(data.qual); if (r3) errs.qual = r3
        const r4 = required(data.joining); if (r4) errs.joining = r4
    }

    return errs
}

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
export default function AddFacultyPage({
    faculty,
    onBack,
    onSave,
    onUpdate,
    isEdit = false,
}) {
    const [step, setStep] = useState(1)
    const [data, setData] = useState(
        faculty
            ? { ...INITIAL_FACULTY_STATE, ...faculty }
            : { ...INITIAL_FACULTY_STATE }
    )
    const [errors, setErrors] = useState({})
    const [saved, setSaved] = useState(false)

    /* ── Navigation ── */
    const next = () => {
        const errs = validateStep(step, data)
        if (Object.keys(errs).length) { setErrors(errs); return }
        setErrors({})
        setStep(s => s + 1)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const prev = () => {
        setErrors({})
        setStep(s => s - 1)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    /* ── Save — backend-ready payload (no auto-ID) ── */
    const handleSave = () => {
        const fullName = [data.firstName, data.middleName, data.lastName]
            .filter(Boolean)
            .join(" ");

        const totalExp =
            (Number(data.teachExp) || 0) +
            (Number(data.indExp) || 0);

        const totalWorkload =
            (Number(data.lectureHrs) || 0) +
            (Number(data.labHrs) || 0) +
            (Number(data.tutorialHrs) || 0);

        const payload = {
            ...(faculty || {}), // 👈 Existing faculty ki id aur baaki fields preserve
            ...data,
            name: fullName,
            totalExperience: totalExp,
            workload: totalWorkload,
        };
        setSaved(true);

        if (isEdit) {
            onUpdate?.(payload);
        } else {
            onSave?.(payload);
        }

        setTimeout(() => {
            onBack?.();
        }, 1800);
    };

    /* ── Success Screen ── */
    if (saved) {
        return (
            <div className="afp-root">
                <div className="afp-success">
                    <div className="afp-success-icon">✅</div>
                    <h2 className="afp-success-title">
                        {isEdit
                            ? "Faculty Updated Successfully!"
                            : "Faculty Added Successfully!"}
                    </h2>
                    <p className="afp-success-sub">
                        {[data.firstName, data.lastName].filter(Boolean).join(" ")}
                        {isEdit
                            ? " has been updated successfully."
                            : " has been added to the system."}
                    </p>
                    <button className="afp-btn-primary" onClick={onBack}>← Back to Faculty List</button>
                </div>
            </div>
        )
    }

    /* ── Main Render ── */
    return (
        <div className="afp-root">

            {/* ── Top Bar ── */}
            <div className="afp-topbar">
                <button className="afp-back-btn" onClick={onBack}>
                    <FI.Back /> Back to Faculty
                </button>
                <div className="afp-topbar-title">
                    <h1 className="afp-main-title">
                        {isEdit ? "Edit Faculty" : "Add New Faculty"}
                    </h1>
                    <p className="afp-main-sub">Step {step} of {STEPS.length} — {STEPS[step - 1].label}</p>
                </div>
                <div className="afp-topbar-right">
                    <span className="afp-progress-text">{Math.round((step / STEPS.length) * 100)}% complete</span>
                    <div className="afp-progress-bar">
                        <div className="afp-progress-fill" style={{ width: `${(step / STEPS.length) * 100}%` }} />
                    </div>
                </div>
            </div>

            {/* ── Step Bar ── */}
            <StepBar current={step} steps={STEPS} />

            {/* ── Form Body ── */}
            <div className="afp-body">
                {step === 1 && <Step1Personal data={data} setData={setData} errors={errors} />}
                {step === 2 && <Step2Professional data={data} setData={setData} errors={errors} />}
                {step === 3 && <Step3Subjects data={data} setData={setData} errors={errors} />}
                {step === 4 && <Step4Preview data={data} />}
            </div>

            {/* ── Footer Navigation ── */}
            <div className="afp-footer">
                <button className="afp-btn-ghost" onClick={onBack}>Cancel</button>
                <div className="afp-footer-right">
                    {step > 1 && (
                        <button className="afp-btn-outline" onClick={prev}>← Previous</button>
                    )}
                    {step < 4 && (
                        <button className="afp-btn-primary" onClick={next}>
                            Next: {STEPS[step].label} →
                        </button>
                    )}
                    {step === 4 && (
                        <button className="afp-btn-success" onClick={handleSave}>
                            <FI.Check /> {isEdit ? "Update Faculty" : "Save Faculty"}
                        </button>
                    )}
                </div>
            </div>

        </div>
    )
}