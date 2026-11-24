import { useState, useEffect } from 'react';

/**
 * GoogleAccountPickerModal Component
 * Menampilkan dialog pemilihan akun Google yang transparan dan aman
 * jika Firebase belum terkonfigurasi atau dalam mode pengujian lokal,
 * mencegah terjadinya login otomatis ke akun bawaan tanpa izin pengguna.
 */
export default function GoogleAccountPickerModal({ isOpen, onSelectAccount, onCancel }) {
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [customError, setCustomError] = useState('');

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const defaultAccounts = [
    {
      id: 'usr_demo_teacher_01',
      fullName: "Khoirun Nisa' Rakhma, S.Pd.",
      email: 'khoirun.nisa.2403316@students.um.ac.id',
      role: 'teacher',
      badge: '👩‍🏫 Guru Kimia',
      avatarBg: '#164E63',
      initials: 'KN',
    },
    {
      id: 'usr_demo_student_01',
      fullName: 'Ahmad Fauzi',
      email: 'ahmad.fauzi@gmail.com',
      role: 'student',
      badge: '👦 Siswa (XI-MIPA-1)',
      avatarBg: '#0F766E',
      initials: 'AF',
    },
    {
      id: 'usr_demo_student_02',
      fullName: 'Nabila Putri',
      email: 'nabila.putri@gmail.com',
      role: 'student',
      badge: '👧 Siswi (XI-MIPA-1)',
      avatarBg: '#7C3AED',
      initials: 'NP',
    },
  ];

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customEmail.trim())) {
      setCustomError('Format email Google tidak valid (contoh: nama@gmail.com).');
      return;
    }
    const cleanEmail = customEmail.trim().toLowerCase();
    const cleanName = customName.trim() || cleanEmail.split('@')[0];

    onSelectAccount({
      id: `usr_google_${Date.now()}`,
      fullName: cleanName,
      email: cleanEmail,
      role: cleanEmail.includes('guru') || cleanEmail.includes('teacher') || cleanEmail === 'khoirun.nisa.2403316@students.um.ac.id' ? 'teacher' : 'student',
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="google-picker-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-scaleUp"
        style={{
          width: '100%',
          maxWidth: '26rem',
          backgroundColor: '#FFFFFF',
          borderRadius: '1.25rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          border: '1px solid #E2E8F0',
        }}
      >
        {/* Header */}
        <div style={{ padding: '1.5rem 1.5rem 1rem 1.5rem', textAlign: 'center', borderBottom: '1px solid #F1F5F9' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
            <svg style={{ width: '2rem', height: '2rem' }} viewBox="0 0 24 24">
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
          </div>
          <h2 id="google-picker-title" style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1E293B', margin: 0 }}>
            Pilih Akun Google
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.35rem', marginBottom: 0 }}>
            untuk melanjutkan ke <strong style={{ color: '#0F766E' }}>The Secret of Salt</strong>
          </p>
        </div>

        {/* Content */}
        <div style={{ padding: '1rem 1.25rem' }}>
          {!showCustomForm ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {defaultAccounts.map((account) => (
                <button
                  key={account.id}
                  type="button"
                  onClick={() => onSelectAccount(account)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.85rem',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.75rem',
                    border: '1px solid #E2E8F0',
                    backgroundColor: '#FFFFFF',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F8FAFC';
                    e.currentTarget.style.borderColor = '#0F766E';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                    e.currentTarget.style.borderColor = '#E2E8F0';
                  }}
                >
                  <div
                    style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      borderRadius: '9999px',
                      backgroundColor: account.avatarBg,
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '800',
                      fontSize: '0.9rem',
                      flexShrink: 0,
                    }}
                  >
                    {account.initials}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: '700', fontSize: '0.9rem', color: '#1E293B' }}>
                        {account.fullName}
                      </span>
                    </div>
                    <span style={{ display: 'block', fontSize: '0.775rem', color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {account.email}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '0.375rem',
                      backgroundColor: account.role === 'teacher' ? '#E0F2FE' : '#F0FDF4',
                      color: account.role === 'teacher' ? '#0369A1' : '#15803D',
                      flexShrink: 0,
                    }}
                  >
                    {account.badge}
                  </span>
                </button>
              ))}

              {/* Use another account option */}
              <button
                type="button"
                onClick={() => setShowCustomForm(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.75rem',
                  border: '1px dashed #CBD5E1',
                  backgroundColor: '#FAFAFA',
                  textAlign: 'left',
                  cursor: 'pointer',
                  color: '#475569',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  marginTop: '0.25rem',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F1F5F9';
                  e.currentTarget.style.color = '#0F766E';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FAFAFA';
                  e.currentTarget.style.color = '#475569';
                }}
              >
                <div
                  style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '9999px',
                    backgroundColor: '#E2E8F0',
                    color: '#64748B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem',
                    flexShrink: 0,
                  }}
                >
                  +
                </div>
                <span>Gunakan akun Google lain...</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleCustomSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.25rem' }}>
                  Nama Tampilan
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Budi Santoso"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.875rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '0.25rem' }}>
                  Email Google
                </label>
                <input
                  type="email"
                  placeholder="nama@gmail.com"
                  value={customEmail}
                  onChange={(e) => {
                    setCustomEmail(e.target.value);
                    setCustomError('');
                  }}
                  required
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.75rem',
                    borderRadius: '0.5rem',
                    border: customError ? '1px solid #EF4444' : '1px solid #CBD5E1',
                    fontSize: '0.875rem',
                    boxSizing: 'border-box',
                  }}
                />
                {customError && (
                  <span style={{ display: 'block', fontSize: '0.75rem', color: '#DC2626', marginTop: '0.25rem' }}>
                    {customError}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowCustomForm(false)}
                  style={{
                    flex: 1,
                    padding: '0.6rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#FFFFFF',
                    color: '#475569',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '0.6rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    backgroundColor: '#0F766E',
                    color: '#FFFFFF',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  Pilih Akun Ini
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '0.75rem 1.25rem', backgroundColor: '#F8FAFC', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: '1px solid #CBD5E1',
              backgroundColor: '#FFFFFF',
              color: '#64748B',
              fontSize: '0.85rem',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}
