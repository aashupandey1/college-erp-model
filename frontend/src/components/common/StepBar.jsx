/* ═══════════════════════════════════════════
   STEPBAR — Multi-step progress indicator
   Props: current (number)
   Usage: import StepBar from '../components/common/StepBar'
═══════════════════════════════════════════ */

import { FI } from "../../pages/AdminDashboard/constants/facultyIcons";

const STEPS = [
  { num: 1, label: 'Personal Info',  icon: <FI.User /> },
  { num: 2, label: 'Professional',   icon: <FI.Academic /> },
  { num: 3, label: 'Subjects',       icon: <FI.Subject /> },
  { num: 4, label: 'Preview & Save', icon: <FI.Doc /> },
]

export default function StepBar({ current }) {
  return (
    <div className="afp-stepbar">
      {STEPS.map((s, i) => {
        const done   = current > s.num
        const active = current === s.num
        return (
          <div className="afp-step-wrap" key={s.num}>
            <div className={`afp-step ${active ? 'active' : ''} ${done ? 'done' : ''}`}>
              <div className="afp-step-circle">
                {done ? <FI.Check /> : s.icon}
              </div>
              <div className="afp-step-info">
                <div className="afp-step-num">Step {s.num}</div>
                <div className="afp-step-label">{s.label}</div>
              </div>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`afp-step-line ${done ? 'done' : ''}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export { STEPS }