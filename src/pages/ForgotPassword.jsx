import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import InputField from '../components/InputField';
import { useAuth } from '../context/useAuth';

/**
 * ForgotPassword Page — Media Pembelajaran Kimia
 * Implements password reset link dispatch with email validation,
 * loading indicator, and success instructions.
 */

export default function ForgotPassword() {
  const { resetPassword, isLoading, authError, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successInfo, setSuccessInfo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError('Email wajib diisi.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('Format email tidak valid.');
      return;
    }

    setError('');
    const res = await resetPassword(cleanEmail);
    if (res.success) {
      setSuccessInfo(res);
    }
  };

  return (
    <AuthLayout
      title="Lupa Kata Sandi?"
      subtitle="Masukkan email yang terdaftar untuk menerima tautan pemulihan kata sandi."
      footerText="Sudah ingat kata sandi Anda?"
      footerLinkText="Masuk sekarang"
      footerLinkTo="/login"
      illustrationBadge="Bantuan Akses Akun"
      illustrationQuote="Keamanan akun belajarmu adalah prioritas kami. Tautan pemulihan akan dikirim secara aman langsung ke kotak masuk emailmu."
    >
      {/* Global Error Banner */}
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
      {successInfo ? (
        <div className="p-5 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] text-[#164E63] animate-fadeIn">
          <div className="flex items-center gap-2.5 text-[#16A34A] font-bold text-base mb-2">
            <svg className="w-6 h-6" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>Tautan Pemulihan Terkirim!</span>
          </div>
          <p className="text-sm text-[#475569] leading-relaxed mb-4">
            {successInfo.message}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/login"
              className="py-2.5 px-4 rounded-xl text-center font-bold text-sm text-white bg-[#0F766E] hover:bg-[#115E59] shadow-sm transition-colors"
            >
              Kembali ke Login
            </Link>
            <button
              type="button"
              onClick={() => setSuccessInfo(null)}
              className="py-2.5 px-4 rounded-xl text-center font-semibold text-sm text-[#0F766E] bg-white border border-[#CCFBF1] hover:bg-[#F0FDFA] transition-colors"
            >
              Kirim Ulang Email
            </button>
          </div>
        </div>
      ) : (
        /* Reset Form */
        <form onSubmit={handleSubmit} noValidate>
          <InputField
            id="forgot-email"
            name="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError('');
              if (authError) clearError();
            }}
            placeholder="Masukkan email terdaftar"
            error={error}
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-white bg-[#0F766E] hover:bg-[#115E59] active:scale-[0.99] shadow-md shadow-[#0F766E]/25 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
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
                <span>Mengirim Tautan...</span>
              </>
            ) : (
              <>
                <span>Kirim Tautan Reset</span>
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

          <div className="mt-5 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#64748B] hover:text-[#0F766E] transition-colors"
            >
              <span aria-hidden="true">←</span>
              <span>Kembali ke Login</span>
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}
