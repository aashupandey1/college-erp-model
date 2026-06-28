import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  IconSchool, IconShieldCheck, IconUserGraduate,
  IconUsersGroup, IconCalculator, IconHOD,
  IconUsers, IconCalendarCheck, IconCoin,
  IconBrandGoogle, IconId, IconEye, IconEyeOff,
} from '../components/Icons'
import './LoginPage.css'
import { apiFetch } from "../services/api";
import { useAuth } from "../context/AuthContext";

const roles = [
  { id: 'admin', label: 'Admin', Icon: IconShieldCheck, fieldLabel: 'Admin ID', placeholder: 'ADM-2024-001', route: '/admin' },
  { id: 'hod', label: 'HOD', Icon: IconHOD, fieldLabel: 'HOD Employee ID', placeholder: 'HOD-CSE-001', route: '/hod' },
  { id: 'faculty', label: 'Faculty', Icon: IconSchool, fieldLabel: 'Employee ID', placeholder: 'FAC-CSE-042', route: '/faculty' },
  { id: 'student', label: 'Student', Icon: IconUserGraduate, fieldLabel: 'Enrollment No.', placeholder: '2021CSE047', route: '/student' },
  { id: 'parent', label: 'Parent', Icon: IconUsersGroup, fieldLabel: 'Parent ID', placeholder: 'PAR-2021-001', route: '/parent' },
  { id: 'accountant', label: 'Accounts', Icon: IconCalculator, fieldLabel: 'Staff ID', placeholder: 'ACC-2024-005', route: '/accountant' },
]

const features = [
  { Icon: IconUsers, text: 'Manage all students, faculty and staff' },
  { Icon: IconCalendarCheck, text: 'Track attendance & academic records' },
  { Icon: IconCoin, text: 'Online fee payment & receipts' },
  { Icon: IconShieldCheck, text: 'Secure role-based access control' },
]

export default function LoginPage() {
  const { login } = useAuth();
  const { role } = useParams()
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedRole, setSelectedRole] = useState(role || 'student')
  useEffect(() => {
    if (role) {
      setSelectedRole(role);
      setIdentifier("");
      setPassword("");
      setError("");
    }
  }, [role]);
  const [showPass, setShowPass] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const navigate = useNavigate()
  const activeRole = roles.find(r => r.id === selectedRole) || roles.find(r => r.id === 'student')
  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          identifier,
          password,
          role: selectedRole,
        }),
      });

      login(data.user, data.token);

      navigate(activeRole.route);

    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="lp-page">

      {/* TOP BAR */}
      <div className="lp-topbar">
        <div className="lp-logo">
          <div className="lp-logo-icon">
            <img src="/logo.png" alt="College ERP Logo" />
          </div>
          <div className="lp-logo-text">
            <span className="lp-logo-name">COLLEGE ERP</span>
            <span className="lp-logo-tagline">One System, Many Solutions</span>
          </div>
        </div>
        <p className="lp-topbar-right">
          Don't have access?{' '}
          <span
            className="lp-contact-link"
            onClick={() => setShowContactModal(true)}
          >
            Contact Admin
          </span>
        </p>
      </div>

      {/* MAIN */}
      <div className="lp-main">

        {/* LEFT */}
        <div className="lp-left">
          <div className="lp-circle lp-circle-1" />
          <div className="lp-circle lp-circle-2" />
          <div className="lp-left-content">
            <div className="lp-left-icon">
              <img src="/logo.png" alt="College ERP Logo" />
            </div>
            <h2 className="lp-brand">COLLEGE <span>ERP</span></h2>
            <p className="lp-tagline">Empowering Education,<br />Simplifying Management</p>
            <div className="lp-features">
              {features.map((f, i) => (
                <div className="lp-feature-row" key={i}>
                  <div className="lp-feat-icon">
                    <f.Icon size={18} color="#60a5fa" />
                  </div>
                  <span>{f.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="lp-right">
          <h2 className="lp-title">Welcome back</h2>
          <p className="lp-sub">Sign in to your account to continue</p>

          {/* Role grid */}
          <div className="lp-role-grid">
            {roles.map(r => (
              <button
                key={r.id}
                type="button"
                className={`lp-role-btn ${selectedRole === r.id ? 'active' : ''}`}
                onClick={() => {
                  setSelectedRole(r.id)
                  navigate(`/login/${r.id}`)
                }}
              >
                <r.Icon size={20} color={selectedRole === r.id ? '#2563eb' : '#6b7a99'} />
                {r.label}
              </button>
            ))}
          </div>

          {/* Form */}
          <form className="lp-form" onSubmit={handleLogin}>
            <div className="lp-form-group">
              <label className="lp-label">{activeRole.fieldLabel}</label>
              <input
                key={selectedRole}
                type="text"
                className="lp-input"
                placeholder={activeRole.placeholder}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>

            <div className="lp-form-group">
              <label className="lp-label">Password</label>
              <div className="lp-input-wrap">
                <input
                  type={showPass ? "text" : "password"}
                  className="lp-input"
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span className="lp-eye" onClick={() => setShowPass(p => !p)}>
                  {showPass
                    ? <IconEyeOff size={17} color="#8a94a6" />
                    : <IconEye size={17} color="#8a94a6" />}
                </span>
              </div>
            </div>
            {error && (
              <div className="lp-error">
                {error}
              </div>
            )}

            <div className="lp-forgot-row">
              <span className="lp-forgot">Forgot password?</span>
            </div>

            <button
              type="submit"
              className="lp-submit"
              disabled={loading}
            >
              {loading
                ? "Signing In..."
                : `Sign In as ${activeRole.label}`}
            </button>
          </form>

          <div className="lp-divider"><span>or</span></div>

          <div className="lp-social-row">
            <button className="lp-social-btn" type="button">
              <IconBrandGoogle size={17} color="#EA4335" /> Google
            </button>
            <button className="lp-social-btn" type="button">
              <IconId size={17} color="#2563eb" /> College SSO
            </button>
          </div>
        </div>

        {/* CONTACT MODAL */}
        {showContactModal && (
          <div
            className="contact-modal-overlay"
            onClick={() => setShowContactModal(false)}
          >
            <div
              className="contact-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <h3>ERP Administrator</h3>

              <div className="contact-info">
                <p>📧 admin@collegeerp.com</p>
                <p>📞 +91 9876543210</p>
                <p>🏢 Admin Block</p>
                <p>🕒 Mon - Sat | 9:00 AM - 5:00 PM</p>
              </div>

              <button
                className="contact-close-btn"
                onClick={() => setShowContactModal(false)}
              >
                Close
              </button>


            </div>
          </div>

        )}
      </div>
    </div>
  )
}