/* ═══════════════════════════════════════════
   FACULTY INITIAL FORM STATE
   Export: INITIAL_FACULTY_STATE
   Note:   HR fields (salary, bank, patents etc.)
           are intentionally excluded — they belong
           to the HR Module, not Faculty Module.
   Usage:  import { INITIAL_FACULTY_STATE } from '../constants/facultyInitialState'
═══════════════════════════════════════════ */

export const INITIAL_FACULTY_STATE = {
  /* ── Step 1: Personal ── */
  photoPreview:    '',
  firstName:       '',
  middleName:      '',
  lastName:        '',
  dob:             '',
  gender:          '',
  bloodGroup:      '',
  category:        '',
  phone:           '',
  altPhone:        '',
  email:           '',
  personalEmail:   '',
  address:         '',
  city:            '',
  state:           '',
  pin:             '',
  aadhaar:         '',
  pan:             '',
  emergencyName:   '',
  emergencyRel:    '',
  emergencyPhone:  '',

  /* ── Step 2: Professional ── */
  dept:            '',
  desig:           '',
  empType:         '',
  joining:         '',
  qual:            '',
  specialization:  '',
  university:      '',
  gradYear:        '',
  phdTitle:        '',
  phdYear:         '',
  teachExp:        '',
  indExp:          '',
  publications:    '',

  /* ── Step 3: Subjects & Workload ── */
  assignedSubjects:    [],
  lectureHrs:          '',
  labHrs:              '',
  tutorialHrs:         '',
  isClassTeacher:      false,
  isResearchGuide:     false,
  isFYPGuide:          false,
  isExamCoordinator:   false,
  isAdmissionCoord:    false,
  isNSSCoord:          false,
}