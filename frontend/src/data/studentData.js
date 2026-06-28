// Student ka saara data yahan — component mein hardcode nahi

export const studentProfile = {
  name: 'Aashish Kumar',
  initials: 'AK',
  roll: '2021CSE047',
  branch: 'CSE',
  semester: 6,
};

export const studentStats = [
  {
    id: 'attendance',
    icon: 'ti-calendar-check',
    label: 'Attendance',
    value: '81%',
    sub: 'Min 75% required',
    badge: 'Live',
    badgeColor: '#2563eb',
    badgeBg: '#eff4ff',
    valueColor: '#2563eb',
  },
  {
    id: 'cgpa',
    icon: 'ti-award',
    label: 'CGPA',
    value: '8.4',
    sub: '↑ 0.2 this sem',
    valueColor: '#059669',
    subColor: '#059669',
  },
  {
    id: 'fee',
    icon: 'ti-coin',
    label: 'Fee Pending',
    value: '₹18.5K',
    sub: 'Due: 31 May',
    badge: 'Due',
    badgeColor: '#dc2626',
    badgeBg: '#fef2f2',
    valueColor: '#dc2626',
    subColor: '#dc2626',
  },
  {
    id: 'placement',
    icon: 'ti-briefcase',
    label: 'Drive Eligible',
    value: '3',
    sub: 'TCS, Infosys, HCL',
    valueColor: '#d97706',
    subColor: '#d97706',
  },
];

export const subjectAttendance = [
  { name: 'Data Struct.', pct: 92, color: '#059669' },
  { name: 'OS',           pct: 79, color: '#2563eb' },
  { name: 'DBMS',         pct: 68, color: '#dc2626', warning: true },
  { name: 'CN',           pct: 85, color: '#2563eb' },
  { name: 'SE',           pct: 77, color: '#2563eb' },
];

export const recentNotices = [
  { text: 'End-sem exam schedule published',      time: 'Today · Exam Dept.',  color: '#2563eb' },
  { text: 'TCS placement drive — Apply by 30 May', time: 'Yesterday · TPO',    color: '#059669' },
  { text: 'Fee due reminder — Last date: 31 May', time: '2 days ago · Accounts', color: '#d97706' },
];

export const quickDownloads = [
  { label: 'ID Card',     icon: 'ti-id-badge',       color: '#2563eb', bg: '#eff4ff' },
  { label: 'Fee Receipt', icon: 'ti-receipt',         color: '#059669', bg: '#f0fdf4' },
  { label: 'Bonafide',    icon: 'ti-file-certificate', color: '#7c3aed', bg: '#fdf4ff' },
  { label: 'Marksheet',   icon: 'ti-award',            color: '#d97706', bg: '#fff7ed' },
];

export const sidebarLinks = [
  { label: 'Dashboard',   icon: 'ti-layout-dashboard', path: '/student' },
  { label: 'Attendance',  icon: 'ti-calendar-check',   path: '/student/attendance' },
  { label: 'Results & GPA', icon: 'ti-file-description', path: '/student/results' },
  { label: 'Fee Payment', icon: 'ti-coin',              path: '/student/fee' },
  { label: 'LMS / Notes', icon: 'ti-books',             path: '/student/lms' },
  { label: 'Timetable',   icon: 'ti-calendar',          path: '/student/timetable' },
  { label: 'Placements',  icon: 'ti-briefcase',         path: '/student/placements' },
  { label: 'Documents',   icon: 'ti-download',          path: '/student/documents' },
  { label: 'Grievance',   icon: 'ti-message',           path: '/student/grievance' },
];