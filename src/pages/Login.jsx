import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import InputField from '../components/InputField';
import PasswordField from '../components/PasswordField';
import { useAuth } from '../context/useAuth';

/**
 * Login Page — Media Pembelajaran Kimia
 * Implements full validation, loading state, show/hide password,
 * error/success feedback, and redirect to dashboard.
 */

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, authError, clearError } = useAuth();

  // Form states
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: true,
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState(
    location.state?.registeredMessage || ''
  );

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Format email tidak valid (contoh: nama@sekolah.sch.id).';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Kata sandi wajib diisi.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear field-specific error as user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (authError) {
      clearError();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || isLoading) return;

    const res = await login({
      email: formData.email,
      password: formData.password,
      rememberMe: formData.rememberMe,
    });

    if (res.success) {
      setSuccessMessage('Berhasil masuk! Mengarahkan ke Dashboard Belajar...');
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 700);
    }
  };

  // Demo auto-fill convenience for quick testing
  const handleAutoFillDemo = () => {
    setFormData({
      email: 'siswa@kimia.sch.id',
      password: 'Kimia2026!',
      rememberMe: true,
    });
    setErrors({});
    clearError();
  };

  return (
    <AuthLayout
      title="Selamat Datang Kembali!"
      subtitle="Masuk untuk melanjutkan perjalanan belajar kimia Anda."
      footerText="Belum memiliki akun?"
      footerLinkText="Daftar sekarang"
      footerLinkTo="/register"
      illustrationBadge="Akses Lab Mandiri • Fase F"
      illustrationQuote="Eksplorasi konsep hidrolisis garam, amati transfer proton pembentuk ion H₃O⁺ dan OH⁻, serta uji pemahamanmu!"
    >
      {/* Global Alert Notification (Error / Success) */}
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

      {successMessage && !authError && (
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

      {/* Main Login Form */}
      <form onSubmit={handleSubmit} noValidate>
        {/* Input Email */}
        <InputField
          id="login-email"
          name="email"
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Masukkan email Anda"
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

        {/* Input Kata Sandi */}
        <PasswordField
          id="login-password"
          name="password"
          label="Kata Sandi"
          value={formData.password}
          onChange={handleChange}
          placeholder="Masukkan kata sandi."
          error={errors.password}
          required
          autoComplete="current-password"
          disabled={isLoading}
          rightAction={
            <Link
              to="/forgot-password"
              className="text-xs sm:text-sm font-semibold text-[#0F766E] hover:text-[#115E59] hover:underline focus:outline-none focus:underline"
            >
              Lupa Kata Sandi?
            </Link>
          }
        />

        {/* Remember Me Checkbox */}
        <div className="flex items-center justify-between mt-2 mb-6">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              disabled={isLoading}
              className="w-4 h-4 rounded text-[#0F766E] border-slate-300 focus:ring-[#0F766E]"
            />
            <span className="text-xs sm:text-sm text-[#64748B]">Ingat sesi saya di perangkat ini</span>
          </label>
        </div>

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
              <span>Memproses...</span>
            </>
          ) : (
            <>
              <span>Masuk</span>
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

      {/* Quick Demo Helper Pill */}
      <div className="mt-5 p-3 rounded-xl bg-[#F0FDFA] border border-[#CCFBF1] flex items-center justify-between gap-2 text-xs text-[#134E4A]">
        <div className="flex items-center gap-1.5 truncate">
          <span className="text-sm">💡</span>
          <span className="truncate">
            Akun Demo: <strong>siswa@kimia.sch.id</strong> (Kimia2026!)
          </span>
        </div>
        <button
          type="button"
          onClick={handleAutoFillDemo}
          className="shrink-0 font-bold text-[#0F766E] hover:text-[#115E59] underline hover:no-underline"
        >
          Isi Otomatis
        </button>
      </div>
    </AuthLayout>
  );
}
