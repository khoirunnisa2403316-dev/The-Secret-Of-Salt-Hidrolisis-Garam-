import { useState, useEffect } from 'react';
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
  const { user, isAuthenticated, login, loginWithGoogle, switchDemoRole, isLoading, authError, clearError, isFirebaseConfigured } = useAuth();

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

  // Jika sudah terautentikasi (misal kembali dari pengalihan Google Auth), arahkan ke dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === 'teacher' ? '/teacher' : '/dashboard', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  // Akses pengujian multi-peran untuk pengembang (hanya aktif jika parameter ?dev=true atau ?demo=true disertakan pada URL)
  const isDevMode = new URLSearchParams(location.search).get('dev') === 'true' ||
                    new URLSearchParams(location.search).get('demo') === 'true';

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

  const handleGoogleLogin = async () => {
    clearError();
    const res = await loginWithGoogle();
    if (res?.redirecting) {
      return;
    }
    if (res?.success) {
      setSuccessMessage('Berhasil masuk dengan akun Google! Mengarahkan...');
      setTimeout(() => {
        navigate(res.user?.role === 'teacher' ? '/teacher' : '/dashboard', { replace: true });
      }, 700);
    }
  };

  // Demo auto-fill convenience for quick testing
  const handleAutoFillDemo = (roleKey = 'student1') => {
    switchDemoRole(roleKey);
    navigate(roleKey === 'teacher' ? '/teacher' : '/dashboard', { replace: true });
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
      {/* Firebase Configuration Warning (only shown when env keys are missing) */}
      {!isFirebaseConfigured && (
        <div
          role="alert"
          className="mb-5 p-3.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] text-xs sm:text-sm flex items-start gap-2.5 animate-fadeIn"
        >
          <svg className="w-5 h-5 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <span className="font-semibold block">Firebase Authentication belum terkonfigurasi.</span>
            <span>Pastikan variabel lingkungan Firebase (VITE_FIREBASE_API_KEY, dll.) telah diatur.</span>
          </div>
        </div>
      )}

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

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '1.25rem 0', gap: '0.75rem' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }} />
          <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase' }}>atau</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }} />
        </div>

        {/* Google Login Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            borderRadius: '0.75rem',
            backgroundColor: '#FFFFFF',
            border: '1.5px solid #CBD5E1',
            color: '#1E293B',
            fontWeight: '700',
            fontSize: '0.925rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            transition: 'all 0.2s ease',
          }}
        >
          <svg style={{ width: '1.25rem', height: '1.25rem' }} viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Masuk dengan Google</span>
        </button>
      </form>

      {/* Quick Demo Roles Bar — Hanya untuk kebutuhan pengujian pengembang yang aman via ?dev=true atau ?demo=true */}
      {isDevMode && (
        <div className="mt-5 p-3 rounded-xl bg-[#F0FDFA] border border-[#CCFBF1] text-xs text-[#134E4A]">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontWeight: '800' }}>🧪 Akses Cepat Evaluasi Multi-Peran (Mode Pengembang):</span>
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => handleAutoFillDemo('teacher')}
              style={{
                padding: '0.35rem 0.65rem',
                borderRadius: '0.5rem',
                backgroundColor: '#164E63',
                color: '#FFFFFF',
                fontWeight: '700',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              👩‍🏫 Guru: Khoirun Nisa' Rakhma
            </button>
            <button
              type="button"
              onClick={() => handleAutoFillDemo('student1')}
              style={{
                padding: '0.35rem 0.65rem',
                borderRadius: '0.5rem',
                backgroundColor: '#FFFFFF',
                color: '#0F766E',
                border: '1px solid #5EEAD4',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              👦 Siswa 1: Ahmad Fauzi
            </button>
            <button
              type="button"
              onClick={() => handleAutoFillDemo('student2')}
              style={{
                padding: '0.35rem 0.65rem',
                borderRadius: '0.5rem',
                backgroundColor: '#FFFFFF',
                color: '#0F766E',
                border: '1px solid #5EEAD4',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              👧 Siswa 2: Nabila Putri
            </button>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}
