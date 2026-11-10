import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import InputField from '../components/InputField';
import PasswordField from '../components/PasswordField';
import { useAuth } from '../context/useAuth';

/**
 * Register Page — Media Pembelajaran Kimia
 * Implements real-time validation, password matching, minimum length,
 * password strength indicator, loading state, and redirect.
 */

export default function Register() {
  const navigate = useNavigate();
  const { register, isLoading, authError, clearError } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Password strength helper
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { level: 0, label: '', color: '' };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 1) return { level: 1, label: 'Lemah', color: 'bg-[#DC2626]' };
    if (score === 2 || score === 3) return { level: 2, label: 'Sedang', color: 'bg-[#F59E0B]' };
    return { level: 3, label: 'Kuat & Aman', color: 'bg-[#16A34A]' };
  };

  const strength = getPasswordStrength(formData.password);

  const validateForm = () => {
    const newErrors = {};

    // Nama Lengkap
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Nama lengkap wajib diisi.';
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Nama lengkap minimal 3 karakter.';
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Format email tidak valid (contoh: nama@sekolah.sch.id).';
    }

    // Kata Sandi
    if (!formData.password) {
      newErrors.password = 'Kata sandi wajib dibuat.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Kata sandi minimal harus terdiri dari 8 karakter.';
    }

    // Ulangi Kata Sandi
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Wajib mengulangi kata sandi.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Kata sandi tidak sesuai dengan input sebelumnya.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Real-time clearance of errors
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (name === 'confirmPassword' && formData.password && value === formData.password) {
      setErrors((prev) => ({ ...prev, confirmPassword: '' }));
    }
    if (authError) {
      clearError();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || isLoading) return;

    const res = await register({
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    });

    if (res.success) {
      setSuccessMessage('Akun berhasil dibuat! Mengarahkan ke Dashboard Anda...');
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 900);
    }
  };

  return (
    <AuthLayout
      title="Buat Akun Baru"
      subtitle="Daftar sekarang dan mulai pengalaman belajar kimia yang lebih menyenangkan."
      footerText="Sudah memiliki akun?"
      footerLinkText="Masuk sekarang"
      footerLinkTo="/login"
      illustrationBadge="Petualangan Kimia Interaktif"
      illustrationQuote="Gabung bersama komunitas belajar kimia SMA/MA Fase F. Kuasai konsep hidrolisis garam dan stoikiometri dengan mudah!"
    >
      {/* Global Error Alert */}
      {authError && (
        <div
          role="alert"
          className="mb-5 p-3.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] text-sm flex items-start gap-2.5 animate-fadeIn"
        >
          <svg className="w-5 h-5 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-medium">{authError}</span>
        </div>
      )}

      {/* Success Notification */}
      {successMessage && (
        <div
          role="status"
          className="mb-5 p-3.5 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-[#16A34A] text-sm flex items-start gap-2.5 animate-fadeIn"
        >
          <svg className="w-5 h-5 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-semibold">{successMessage}</span>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} noValidate>
        {/* A. Nama Lengkap */}
        <InputField
          id="register-fullname"
          name="fullName"
          label="Nama Lengkap"
          type="text"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Masukkan nama lengkap Anda"
          error={errors.fullName}
          required
          autoComplete="name"
          disabled={isLoading}
          icon={
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          }
        />

        {/* B. Email */}
        <InputField
          id="register-email"
          name="email"
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Masukkan email aktif Anda"
          error={errors.email}
          required
          autoComplete="email"
          disabled={isLoading}
          icon={
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          }
        />

        {/* C. Kata Sandi */}
        <PasswordField
          id="register-password"
          name="password"
          label="Kata Sandi"
          value={formData.password}
          onChange={handleChange}
          placeholder="Buat kata sandi (min. 8 karakter)"
          error={errors.password}
          required
          autoComplete="new-password"
          disabled={isLoading}
        />

        {/* Password Strength Indicator */}
        {formData.password && (
          <div className="auth-strength-box">
            <div className="auth-strength-header">
              <span>Keamanan kata sandi:</span>
              <span className="auth-strength-label">{strength.label}</span>
            </div>
            <div className="auth-strength-track">
              <div
                className="auth-strength-segment"
                style={{
                  backgroundColor:
                    strength.level >= 1
                      ? strength.level === 1
                        ? '#DC2626'
                        : strength.level === 2
                        ? '#F59E0B'
                        : '#16A34A'
                      : 'transparent',
                }}
              />
              <div
                className="auth-strength-segment"
                style={{
                  backgroundColor:
                    strength.level >= 2
                      ? strength.level === 2
                        ? '#F59E0B'
                        : '#16A34A'
                      : 'transparent',
                }}
              />
              <div
                className="auth-strength-segment"
                style={{
                  backgroundColor:
                    strength.level >= 3 ? '#16A34A' : 'transparent',
                }}
              />
            </div>
          </div>
        )}

        {/* D. Ulangi Kata Sandi */}
        <PasswordField
          id="register-confirm-password"
          name="confirmPassword"
          label="Ulangi Kata Sandi"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Masukkan kembali kata sandi"
          error={errors.confirmPassword}
          required
          autoComplete="new-password"
          disabled={isLoading}
        />

        {/* Terms notice */}
        <p style={{ fontSize: '0.78rem', color: '#64748B', marginBottom: '1.25rem', lineHeight: '1.45' }}>
          Dengan mendaftar, Anda menyetujui ketentuan penggunaan dan pedoman pembelajaran mandiri Fase F.
        </p>

        {/* Primary Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="auth-submit-btn"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Mendaftarkan Akun...</span>
            </>
          ) : (
            <>
              <span>Daftar</span>
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </>
          )}
        </button>
      </form>
    </AuthLayout>
  );
}
