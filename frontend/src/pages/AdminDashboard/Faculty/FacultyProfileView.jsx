/* ═══════════════════════════════════════════════════════════════
   FACULTY PROFILE VIEW
   Admin ke liye — kisi bhi faculty ki full profile ek page par
   Usage:
     import FacultyProfileView from './FacultyProfileView'
     <FacultyProfileView faculty={selectedFaculty} onBack={()=>setViewItem(null)} onNav={onNav} />
   Props:
     faculty  — faculty object (FacultyPage ki table se)
     onBack   — back / close karne ka handler
     onNav    — Admin dashboard ka navigation handler
═══════════════════════════════════════════════════════════════ */
import { useEffect, useState } from "react";
import { apiFetch } from "../../../services/api";
import './FacultyProfileView.css';
import { IC } from "../constants/iconMap";

/* ─── Pill badge ─── */
function Pill({ children, type = 'muted' }) {
    const map = {
        green: { bg: '#EAF3DE', color: '#3B6D11' },
        red: { bg: '#FCEBEB', color: '#A32D2D' },
        amber: { bg: '#FAEEDA', color: '#854F0B' },
        blue: { bg: '#E6F1FB', color: '#185FA5' },
        teal: { bg: '#e3f3f1', color: '#0F766E' },
        purple: { bg: '#EEEDFE', color: '#534AB7' },
        indigo: { bg: '#EEF0FE', color: '#4338CA' },
        muted: { bg: '#F1EFE8', color: '#5F5E5A' },
    };
    const s = map[type] || map.muted;
    return (
        <span className="fpv-pill" style={{ background: s.bg, color: s.color }}>
            {children}
        </span>
    );
}

/* ─── Section card wrapper ─── */
function Section({ title, icon, children, action }) {
    return (
        <div className="fpv-section">
            <div className="fpv-section-hd">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="fpv-section-icon">{icon}</span>
                    <span className="fpv-section-title">{title}</span>
                </div>
                {action && <div>{action}</div>}
            </div>
            <div className="fpv-section-body">{children}</div>
        </div>
    );
}

/* ─── Label : Value row ─── */
function InfoRow({ label, value, highlight }) {
    return (
        <div className="fpv-info-row">
            <span className="fpv-info-label">{label}</span>
            <span
                className="fpv-info-value"
                style={highlight ? { color: highlight, fontWeight: 700 } : {}}
            >
                {value || '—'}
            </span>
        </div>
    );
}

/* ─── Coming Soon placeholder ─── */
function ComingSoon() {
    return (
        <div style={{ textAlign: 'center', padding: '48px 24px', color: '#8a94a6' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🚧</div>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Coming Soon</div>
            <div style={{ fontSize: 13 }}>
                This section will be connected to live data in the next update.
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function FacultyProfileView({ faculty, onBack, onNav }) {
    const [facultyData, setFacultyData] = useState(faculty);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState('overview');

    /* ── Fetch full faculty record from MongoDB ── */
    useEffect(() => {
        const loadFaculty = async () => {
            if (!faculty?._id) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);

                const res = await apiFetch(`/faculty/${faculty._id}`);
                setFacultyData(res.data);

            } catch (err) {
                setError(err.message || "Failed to load faculty data.");
            } finally {
                setLoading(false);
            }
        };

        loadFaculty();
    }, [faculty]);

    /* ── Guards ── */
    if (loading) {
        return (
            <div className="fpv-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
                <h2 style={{ color: '#8a94a6' }}>Loading Faculty...</h2>
            </div>
        );
    }
    if (error) {
        return (
            <div className="fpv-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
                <h2 style={{ color: '#dc2626' }}>{error}</h2>
            </div>
        );
    }
    if (!facultyData) {
        return (
            <div className="fpv-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
                <div style={{ textAlign: 'center', color: '#8a94a6' }}>
                    <div style={{ fontSize: 32 }}>👤</div>
                    <div style={{ fontWeight: 700, marginTop: 8 }}>Faculty not found</div>
                </div>
            </div>
        );
    }

    /* ── Derived values (schema-safe) ── */

    // Initials — strip honorifics from name
    const initials = (facultyData.name || '')
        .split(' ')
        .filter(w => !['Dr.', 'Prof.', 'Mr.', 'Ms.', 'Mrs.'].includes(w))
        .map(w => w[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('');

    // Full address — address + city + state + pin (all String fields in schema)
    const fullAddress = [facultyData.address, facultyData.city, facultyData.state, facultyData.pin]
        .filter(Boolean)
        .join(', ') || '—';

    // assignedSubjects — schema: [{ type: String }], so array of plain strings, NOT objects
    const assignedSubjects = Array.isArray(facultyData.assignedSubjects)
        ? facultyData.assignedSubjects
        : [];

    // Weekly workload — schema: lectureHrs, labHrs, tutorialHrs (all String)
    // Parse to numbers safely for display; show '—' if all missing
    const lectureHrs = parseFloat(facultyData.lectureHrs) || 0;
    const labHrs = parseFloat(facultyData.labHrs) || 0;
    const tutorialHrs = parseFloat(facultyData.tutorialHrs) || 0;
    const totalHrs = lectureHrs + labHrs + tutorialHrs;
    const weeklyHrsDisplay = totalHrs > 0 ? `${totalHrs} hrs/wk` : '—';

    // Active subjects count — schema has subjects: Number
    const subjectCount = facultyData.subjects ?? assignedSubjects.length;

    // Role badges — schema: Boolean flags
    const activeRoles = [
        facultyData.isClassTeacher && 'Class Teacher',
        facultyData.isResearchGuide && 'Research Guide',
        facultyData.isFYPGuide && 'FYP Guide',
        facultyData.isExamCoordinator && 'Exam Coordinator',
        facultyData.isAdmissionCoord && 'Admission Coordinator',
        facultyData.isNSSCoord && 'NSS Coordinator',
    ].filter(Boolean);

    const tabs = [
        { id: 'overview', label: 'Overview', icon: IC.Users },
        { id: 'subjects', label: 'Subjects', icon: IC.Library },
        { id: 'attendance', label: 'Attendance', icon: IC.CalendarCheck },
        { id: 'marks', label: 'Marks', icon: IC.Exams },
        { id: 'appraisal', label: 'Appraisal', icon: IC.Award },
        { id: 'leave', label: 'Leave', icon: IC.CalendarCheck },
        { id: 'research', label: 'Research', icon: IC.Flask },
        { id: 'feedback', label: 'Student Feedback', icon: IC.Star },
        { id: 'salary', label: 'Salary History', icon: IC.Rupee },
        { id: 'login', label: 'Login History', icon: IC.History },
    ];

    return (
        <div className="fpv-root">

            {/* ─── TOP BAR ─── */}
            <div className="fpv-topbar">
                <button className="fpv-back" onClick={onBack}>
                    ← Back to Faculty
                </button>
                <div className="fpv-topbar-right">
                    <button className="fpv-btn-outline" onClick={() => window.print()}>🖨 Print</button>
                    <button className="fpv-btn-outline">✉ Send Email</button>
                    <button
                        className="fpv-btn-primary"
                        onClick={() => onNav("editFaculty", facultyData)}
                    >
                        ✏ Edit Profile
                    </button>
                    <button
                        className="fp-btn-outline"
                        onClick={() => console.log("Download Faculty Profile PDF")}
                    >
                        {IC.Download} Download PDF
                    </button>
                </div>
            </div>

            {/* ─── HERO CARD ─── */}
            <div className="fpv-hero">
                <div className="fpv-hero-left">
                    {/* Avatar: photo if uploaded, else initials */}
                    {facultyData.photoPreview ? (
                        <img
                            src={facultyData.photoPreview}
                            alt={facultyData.name}
                            className="fpv-avatar"
                            style={{ objectFit: 'cover', borderRadius: '50%' }}
                        />
                    ) : (
                        <div className="fpv-avatar">{initials}</div>
                    )}
                    <div className="fpv-hero-info">
                        <h1 className="fpv-name">{facultyData.name}</h1>
                        <div className="fpv-sub-line">
                            {/* schema field: id */}
                            <span className="fpv-emp-id">{facultyData.id}</span>
                            {/* schema field: dept */}
                            <Pill type="purple">{facultyData.dept}</Pill>
                            {/* schema field: desig */}
                            <Pill type="indigo">{facultyData.desig}</Pill>
                            {/* schema field: status */}
                            {facultyData.status === 'Active'
                                ? <Pill type="green">Active</Pill>
                                : <Pill type="amber">{facultyData.status}</Pill>
                            }
                        </div>
                        <div className="fpv-hero-tags">
                            {/* schema fields: email, phone, dept, exp */}
                            <span>📧 {facultyData.email || '—'}</span>
                            <span>📞 {facultyData.phone || '—'}</span>
                            <span>🏛 {facultyData.dept ? `${facultyData.dept} Department` : '—'}</span>
                            <span>⏱ {facultyData.exp || '—'}</span>
                        </div>
                    </div>
                </div>

                {/* Quick stats — only schema-available values */}
                <div className="fpv-hero-stats">
                    {[
                        {
                            // schema: subjects (Number)
                            val: subjectCount || '—',
                            label: 'Active Subjects',
                            color: '#534AB7',
                            bg: '#EEEDFE',
                        },
                        {
                            // schema: lectureHrs + labHrs + tutorialHrs
                            val: weeklyHrsDisplay,
                            label: 'Weekly Workload',
                            color: '#0F766E',
                            bg: '#e3f3f1',
                        },
                        {
                            // schema: teachExp
                            val: facultyData.teachExp || '—',
                            label: 'Teaching Exp',
                            color: '#185FA5',
                            bg: '#E6F1FB',
                        },
                        {
                            // schema: status
                            val: facultyData.status || '—',
                            label: 'Current Status',
                            color: facultyData.status === 'Active' ? '#059669' : '#d97706',
                            bg: facultyData.status === 'Active' ? '#EAF3DE' : '#FAEEDA',
                        },
                    ].map((s, i) => (
                        <div className="fpv-stat-card" key={i} style={{ background: s.bg }}>
                            <div className="fpv-stat-val" style={{ color: s.color }}>{s.val}</div>
                            <div className="fpv-stat-label">{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ─── TABS ─── */}
            <div className="fpv-tabs">
                {tabs.map(t => (
                    <button
                        key={t.id}
                        className={`fpv-tab${activeTab === t.id ? ' active' : ''}`}
                        onClick={() => setActiveTab(t.id)}
                    >
                        {t.icon} {t.label}
                    </button>
                ))}
            </div>

            {/* ─── TAB CONTENT ─── */}
            <div className="fpv-body">

                {/* ════ TAB 1: OVERVIEW ════ */}
                {activeTab === 'overview' && (
                    <div className="fpv-grid-2">

                        {/* Personal Information */}
                        <Section title="Personal Information" icon="👤">
                            {/* schema: name, id, dob, gender, email, phone, address+city+state+pin, bloodGroup */}
                            <InfoRow label="Full Name" value={facultyData.name} />
                            <InfoRow label="Employee ID" value={facultyData.id} />
                            <InfoRow label="Date of Birth" value={facultyData.dob} />
                            <InfoRow label="Gender" value={facultyData.gender} />
                            <InfoRow label="Blood Group" value={facultyData.bloodGroup} />
                            <InfoRow label="Category" value={facultyData.category} />
                            <InfoRow label="Email" value={facultyData.email} />
                            <InfoRow label="Personal Email" value={facultyData.personalEmail} />
                            <InfoRow label="Phone" value={facultyData.phone} />
                            <InfoRow label="Alt Phone" value={facultyData.altPhone} />
                            <InfoRow label="Address" value={fullAddress} />
                        </Section>

                        {/* Employment Details */}
                        <Section title="Employment Details" icon="🏛">
                            {/* schema: dept, desig, empType, joining, exp, teachExp, indExp, status */}
                            <InfoRow label="Department" value={facultyData.dept} />
                            <InfoRow label="Designation" value={facultyData.desig} />
                            <InfoRow label="Employee Type" value={facultyData.empType} />
                            <InfoRow label="Joining Date" value={facultyData.joining} />
                            <InfoRow label="Total Experience" value={facultyData.exp} />
                            <InfoRow label="Teaching Experience" value={facultyData.teachExp} />
                            <InfoRow label="Industry Experience" value={facultyData.indExp} />
                            <InfoRow
                                label="Status"
                                value={facultyData.status}
                                highlight={facultyData.status === 'Active' ? '#059669' : '#d97706'}
                            />
                        </Section>

                        {/* Academic Qualifications */}
                        <Section title="Qualifications" icon="🎓">
                            {/*
                              schema: qual (String), university (String), gradYear (String),
                                      phdTitle (String), phdYear (String)
                              — these are plain strings, NOT an array, so display as InfoRows
                            */}
                            <InfoRow label="Highest Qualification" value={facultyData.qual} />
                            <InfoRow label="University / Institute" value={facultyData.university} />
                            <InfoRow label="Graduation Year" value={facultyData.gradYear} />
                            {facultyData.phdTitle && (
                                <InfoRow label="Ph.D. Title" value={facultyData.phdTitle} />
                            )}
                            {facultyData.phdYear && (
                                <InfoRow label="Ph.D. Year" value={facultyData.phdYear} />
                            )}
                        </Section>

                        {/* Specialization & Roles */}
                        <Section title="Specialization & Roles" icon="🧩">
                            {/*
                              schema: specialization (String — single value, NOT array)
                              schema: isClassTeacher, isResearchGuide, isFYPGuide, etc. (Boolean flags)
                              schema: publications (String — a count or description, NOT array)
                            */}
                            <InfoRow label="Specialization" value={facultyData.specialization} />
                            <InfoRow label="Publications" value={facultyData.publications} />

                            {activeRoles.length > 0 && (
                                <div style={{ marginTop: 12 }}>
                                    <div className="fpv-info-label" style={{ marginBottom: 8 }}>
                                        Additional Roles
                                    </div>
                                    <div className="fpv-spec-wrap">
                                        {activeRoles.map((role, i) => (
                                            <span key={i} className="fpv-spec-tag">{role}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </Section>

                        {/* Workload Summary */}
                        <Section title="Workload Summary" icon="📚">
                            {/* schema: lectureHrs, labHrs, tutorialHrs, subjects (Number) */}
                            <InfoRow label="Lecture Hours / Week" value={facultyData.lectureHrs ? `${facultyData.lectureHrs} hrs` : '—'} />
                            <InfoRow label="Lab Hours / Week" value={facultyData.labHrs ? `${facultyData.labHrs} hrs` : '—'} />
                            <InfoRow label="Tutorial Hours / Week" value={facultyData.tutorialHrs ? `${facultyData.tutorialHrs} hrs` : '—'} />
                            <InfoRow
                                label="Total Weekly Hours"
                                value={totalHrs > 0 ? `${totalHrs} hrs` : '—'}
                                highlight="#534AB7"
                            />
                            <InfoRow label="Subjects Assigned" value={subjectCount || '—'} />
                        </Section>

                        {/* Emergency Contact */}
                        <Section title="Emergency Contact" icon="🚨">
                            {/* schema: emergencyName, emergencyRel, emergencyPhone */}
                            <InfoRow label="Contact Name" value={facultyData.emergencyName} />
                            <InfoRow label="Relationship" value={facultyData.emergencyRel} />
                            <InfoRow label="Contact Phone" value={facultyData.emergencyPhone} />
                        </Section>

                    </div>
                )}

                {/* ════ TAB 2: SUBJECTS ════ */}
                {activeTab === 'subjects' && (
                    <>
                        <div className="fpv-kpi-row">
                            {[
                                {
                                    // schema: subjects (Number)
                                    val: subjectCount || '—',
                                    label: 'Subjects Assigned',
                                    color: '#534AB7',
                                    bg: '#EEEDFE',
                                },
                                {
                                    // schema: lectureHrs
                                    val: facultyData.lectureHrs ? `${facultyData.lectureHrs} hrs` : '—',
                                    label: 'Lecture Hrs / Week',
                                    color: '#185FA5',
                                    bg: '#E6F1FB',
                                },
                                {
                                    // schema: labHrs
                                    val: facultyData.labHrs ? `${facultyData.labHrs} hrs` : '—',
                                    label: 'Lab Hrs / Week',
                                    color: '#059669',
                                    bg: '#EAF3DE',
                                },
                                {
                                    // schema: tutorialHrs
                                    val: facultyData.tutorialHrs ? `${facultyData.tutorialHrs} hrs` : '—',
                                    label: 'Tutorial Hrs / Week',
                                    color: '#0F766E',
                                    bg: '#e3f3f1',
                                },
                            ].map((k, i) => (
                                <div className="fpv-kpi" key={i} style={{ background: k.bg }}>
                                    <div className="fpv-kpi-val" style={{ color: k.color }}>{k.val}</div>
                                    <div className="fpv-kpi-label">{k.label}</div>
                                </div>
                            ))}
                        </div>

                        {/*
                          schema: assignedSubjects — [{ type: String }]
                          These are plain subject name strings, NOT objects with code/sem/branch.
                          So we render a simple list, not a detailed table.
                        */}
                        <Section title="Assigned Subjects" icon="📖">
                            {assignedSubjects.length > 0 ? (
                                <table className="fpv-table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Subject Name</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {assignedSubjects.map((subjectName, i) => (
                                            <tr key={i}>
                                                <td style={{ color: '#8a94a6', fontSize: 12, width: 40 }}>
                                                    {i + 1}
                                                </td>
                                                <td className="fpv-td-bold">{subjectName}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div style={{ color: '#8a94a6', padding: '24px 0', textAlign: 'center' }}>
                                    No subjects assigned yet.
                                </div>
                            )}
                        </Section>

                        {/* Timetable — not in schema */}
                        <Section title="Weekly Timetable Snapshot" icon="🗓">
                            <ComingSoon />
                        </Section>
                    </>
                )}

                {/* ════ TAB 3: ATTENDANCE ════ */}
                {/* Not in Faculty schema — Coming Soon */}
                {activeTab === 'attendance' && (
                    <Section title="Faculty Attendance" icon="📅">
                        <ComingSoon />
                    </Section>
                )}

                {/* ════ TAB 4: MARKS HISTORY ════ */}
                {/* Not in Faculty schema — Coming Soon */}
                {activeTab === 'marks' && (
                    <Section title="Marks Entry History" icon="📝">
                        <ComingSoon />
                    </Section>
                )}

                {/* ════ TAB 5: APPRAISAL ════ */}
                {/* Not in Faculty schema — Coming Soon */}
                {activeTab === 'appraisal' && (
                    <Section title="Appraisal Records" icon="⭐">
                        <ComingSoon />
                    </Section>
                )}

                {/* ════ TAB 6: LEAVE ════ */}
                {/* Not in Faculty schema — Coming Soon */}
                {activeTab === 'leave' && (
                    <Section title="Leave History" icon="🗓">
                        <ComingSoon />
                    </Section>
                )}

                {/* ════ TAB 7: RESEARCH & FDP ════ */}
                {/*
                  schema: publications (String — a plain text value e.g. "12" or "IEEE 2024")
                  NOT an array of objects, so full research cards cannot be rendered.
                  Display the publications string as a summary; rest Coming Soon.
                */}
                {activeTab === 'research' && (
                    <>
                        <div className="fpv-kpi-row">
                            {[
                                {
                                    val: facultyData.publications || '—',
                                    label: 'Publications',
                                    color: '#534AB7',
                                    bg: '#EEEDFE',
                                },
                                {
                                    val: facultyData.isResearchGuide ? 'Yes' : 'No',
                                    label: 'Research Guide',
                                    color: facultyData.isResearchGuide ? '#059669' : '#8a94a6',
                                    bg: facultyData.isResearchGuide ? '#EAF3DE' : '#F1EFE8',
                                },
                                {
                                    val: facultyData.isFYPGuide ? 'Yes' : 'No',
                                    label: 'FYP Guide',
                                    color: facultyData.isFYPGuide ? '#185FA5' : '#8a94a6',
                                    bg: facultyData.isFYPGuide ? '#E6F1FB' : '#F1EFE8',
                                },
                                {
                                    val: facultyData.phdYear || '—',
                                    label: 'Ph.D. Year',
                                    color: '#0F766E',
                                    bg: '#e3f3f1',
                                },
                            ].map((k, i) => (
                                <div className="fpv-kpi" key={i} style={{ background: k.bg }}>
                                    <div className="fpv-kpi-val" style={{ color: k.color }}>{k.val}</div>
                                    <div className="fpv-kpi-label">{k.label}</div>
                                </div>
                            ))}
                        </div>

                        <Section title="Research Overview" icon="🔬">
                            <InfoRow label="Specialization" value={facultyData.specialization} />
                            <InfoRow label="Publications" value={facultyData.publications} />
                            <InfoRow label="Ph.D. Title" value={facultyData.phdTitle} />
                            <InfoRow label="Ph.D. Year" value={facultyData.phdYear} />
                            <InfoRow
                                label="Research Guide"
                                value={facultyData.isResearchGuide ? 'Yes' : 'No'}
                                highlight={facultyData.isResearchGuide ? '#059669' : undefined}
                            />
                            <InfoRow
                                label="FYP Guide"
                                value={facultyData.isFYPGuide ? 'Yes' : 'No'}
                                highlight={facultyData.isFYPGuide ? '#059669' : undefined}
                            />
                        </Section>

                        {/* Detailed paper list / FDP list — needs a separate collection */}
                        <Section title="Publication Details & FDPs" icon="🎓">
                            <ComingSoon />
                        </Section>
                    </>
                )}

                {/* ════ TAB 8: STUDENT FEEDBACK ════ */}
                {/* Not in Faculty schema — Coming Soon */}
                {activeTab === 'feedback' && (
                    <Section title="Student Feedback" icon="⭐">
                        <ComingSoon />
                    </Section>
                )}

                {/* ════ TAB 9: SALARY HISTORY ════ */}
                {/* Not in Faculty schema — Coming Soon */}
                {activeTab === 'salary' && (
                    <Section title="Salary History" icon="💰">
                        <ComingSoon />
                    </Section>
                )}

                {/* ════ TAB 10: LOGIN HISTORY ════ */}
                {/* Not in Faculty schema — Coming Soon */}
                {activeTab === 'login' && (
                    <Section title="Login History" icon="🔐">
                        <ComingSoon />
                    </Section>
                )}

            </div>
        </div>
    );
}