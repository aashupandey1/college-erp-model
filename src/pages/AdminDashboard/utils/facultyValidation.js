/* ═══════════════════════════════════════════
   FACULTY VALIDATION HELPERS
   Export: required, emailVal, phoneVal, aadhaarVal
   Usage:  import { required, emailVal, ... } from '../utils/facultyValidation'
═══════════════════════════════════════════ */

export const required  = (v) => (!v || !String(v).trim()) ? 'This field is required' : ''

export const emailVal  = (v) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
  ? 'Invalid email address' : ''

export const phoneVal  = (v) => !/^\d{10}$/.test(v)
  ? 'Must be exactly 10 digits' : ''

export const aadhaarVal = (v) => v && !/^\d{12}$/.test(v)
  ? 'Must be 12 digits' : ''