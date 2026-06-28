/* ═══════════════════════════════════════════
   FACULTY CONSTANTS
   Export: DEPTS, DESIGS, QUALS, SPECIALIZATIONS,
           ALL_SUBJECTS, BLOOD_GROUPS, EMPLOYMENT_TYPES
   Usage:  import { DEPTS, ... } from '../constants/facultyConstants'
═══════════════════════════════════════════ */

export const DEPTS = [
  'CSE', 'ECE', 'MECH', 'CIVIL', 'IT', 'MATH', 'PHYSICS', 'CHEMISTRY', 'ENGLISH',
]

export const DESIGS = [
  'Lecturer', 'Asst. Professor', 'Assoc. Professor', 'Professor', 'HOD', 'Principal',
]

export const QUALS = [
  'B.Tech', 'M.Tech', 'M.Sc', 'MBA', 'MCA',
  'Ph.D. (IIT)', 'Ph.D. (NIT)', 'Ph.D. (BITS)',
  'Ph.D. (IIIT)', 'Ph.D. (Delhi University)', 'Ph.D.',
]

export const SPECIALIZATIONS = [
  'Artificial Intelligence', 'Machine Learning', 'Data Science',
  'Computer Networks', 'Cyber Security', 'Cloud Computing',
  'VLSI Design', 'Embedded Systems', 'Signal Processing',
  'Thermal Engineering', 'Manufacturing', 'Structural Engineering',
  'Web Technologies', 'Database Systems', 'Software Engineering',
  'Mathematics', 'Applied Physics', 'English Literature',
]

export const ALL_SUBJECTS = [
  { code: 'CS601', name: 'Data Structures & Algorithms', dept: 'CSE', sem: 6 },
  { code: 'CS602', name: 'Operating Systems',            dept: 'CSE', sem: 6 },
  { code: 'CS603', name: 'Database Management Systems',  dept: 'CSE', sem: 6 },
  { code: 'CS604', name: 'Computer Networks',            dept: 'CSE', sem: 6 },
  { code: 'CS605', name: 'Software Engineering',         dept: 'CSE', sem: 6 },
  { code: 'EC401', name: 'Digital Electronics',          dept: 'ECE', sem: 4 },
  { code: 'EC402', name: 'Signals & Systems',            dept: 'ECE', sem: 4 },
  { code: 'ME301', name: 'Thermodynamics',               dept: 'MECH', sem: 4 },
  { code: 'ME302', name: 'Fluid Mechanics',              dept: 'MECH', sem: 4 },
  { code: 'IT501', name: 'Web Technologies',             dept: 'IT',   sem: 5 },
  { code: 'MA201', name: 'Engineering Mathematics',      dept: 'MATH', sem: 2 },
]

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

export const EMPLOYMENT_TYPES = [
  'Full-time', 'Part-time', 'Visiting', 'Contractual', 'Guest Faculty',
]

export const CATEGORIES = ['General', 'OBC', 'SC', 'ST', 'EWS']

export const RELATIONSHIPS = ['Spouse', 'Parent', 'Sibling', 'Child', 'Friend', 'Other']