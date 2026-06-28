/* ═══════════════════════════════════════════
   FIELD — Reusable form field wrapper
   Props: label, required, error, hint, children
   Usage: import Field from '../components/common/Field'
═══════════════════════════════════════════ */

export default function Field({ label, required: req, error, hint, children }) {
  return (
    <div className="afp-field">
      <label className="afp-label">
        {label}
        {req && <span className="afp-req">*</span>}
      </label>
      {children}
      {hint  && !error && <span className="afp-hint">{hint}</span>}
      {error && <span className="afp-error">{error}</span>}
    </div>
  )
}