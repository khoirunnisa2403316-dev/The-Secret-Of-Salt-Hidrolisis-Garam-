import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './context/useAuth';

export default function Navbar({ onStartClick }) {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [warmMode, setWarmMode] = useState(false);

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setHelpModalOpen(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Toggle warm ivory eye-care mode
  const toggleTheme = () => {
    const next = !warmMode;
    setWarmMode(next);
    if (next) {
      document.body.classList.add('theme-warm-ivory');
    } else {
      document.body.classList.remove('theme-warm-ivory');
    }
  };

  const navLinks = [
    { label: 'Beranda', href: '#beranda', active: true },
    { label: 'Topik Prasyarat', href: '#topik-prasyarat' },
    { label: 'Lab Maya & Simulasi', href: '#lab-interaktif' },
    { label: 'Kuis Modul 1', href: '#kuis-modul-1' },
    { label: 'Tentang Media', href: '#tentang' },
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className="navbar-header" id="beranda">
        <div className="navbar-container container">
          {/* 1. Brand / Media Identity per PRD.md & AGENTS.md */}
          <a href="#beranda" className="navbar-brand" aria-label="The Secret of Salt: Hydrolysis Adventure">
            <div className="brand-logo-badge">
              <svg
                className="brand-icon"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M12 4H20M14 4V11L8.3 22.4C7.4 24.2 8.7 26.3 10.7 26.3H21.3C23.3 26.3 24.6 24.2 23.7 22.4L18 11V4"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.2 18.5C12.4 17.5 14.6 19.5 17 18.5C19.2 17.5 21.8 18.5 21.8 18.5"
                  stroke="#FFD166"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <circle cx="16" cy="22" r="1.5" fill="#FFF9EC" />
                <circle cx="12.5" cy="23" r="1" fill="#FFF9EC" />
                <circle cx="19" cy="20.5" r="1.2" fill="#FFF9EC" />
              </svg>
            </div>
            <div className="brand-text-wrapper">
              <div className="brand-title-row">
                <span className="brand-title">The Secret of Salt</span>
                <span className="brand-grade-tag">SMA/MA XI • Fase F</span>
              </div>
              <span className="brand-tagline">Hydrolysis Adventure — Explore the Ions, Discover the pH!</span>
            </div>
          </a>

          {/* 2. Desktop Nav Links */}
          <nav className="navbar-desktop-nav" aria-label="Navigasi Utama">
            <ul className="nav-links-list">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className={`nav-link ${link.active ? 'active' : ''}`}
                    onClick={(e) => handleNavClick(e, link.href)}
                  >
                    {link.label}
                    {link.active && <span className="active-dot" />}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* 3. Action Buttons & Options (Tema/Bantuan & CTA) */}
          <div className="navbar-actions">
            {/* Opsi Tema: Eye Care Warm Ivory per PRD */}
            <button
              type="button"
              className={`theme-toggle-btn ${warmMode ? 'active' : ''}`}
              onClick={toggleTheme}
              title={warmMode ? 'Ganti ke Mode Normal' : 'Ganti ke Mode Ramah Mata (Warm Ivory)'}
              aria-label="Alihkan mode kenyamanan mata"
            >
              <span aria-hidden="true">{warmMode ? '☀️' : '🌙'}</span>
              <span className="toggle-label">{warmMode ? 'Ivory' : 'Standar'}</span>
            </button>

            {/* Opsi Bantuan / Panduan Belajar */}
            <button
              type="button"
              className="navbar-help-btn"
              onClick={() => setHelpModalOpen(true)}
              aria-label="Buka panduan bantuan belajar"
              title="Bantuan & Petunjuk Belajar"
            >
              <span className="help-icon" aria-hidden="true">💡</span>
              <span className="help-label">Bantuan</span>
            </button>

            {/* CTA Button "Mulai Belajar" */}
            <button
              type="button"
              className="navbar-cta-btn"
              onClick={onStartClick}
              aria-label="Mulai Belajar Sekarang"
            >
              <span className="btn-sparkle" aria-hidden="true">✨</span>
              <span>Mulai Belajar</span>
            </button>

            {/* Auth Actions: Login / Register or Dashboard */}
            {isAuthenticated ? (
              <div className="navbar-auth-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Link
                  to="/dashboard"
                  className="navbar-dashboard-pill"
                  title="Buka Dashboard Belajar Siswa"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(15, 118, 110, 0.1)',
                    color: '#0F766E',
                    fontWeight: '700',
                    fontSize: '0.88rem',
                    textDecoration: 'none',
                    border: '1px solid rgba(15, 118, 110, 0.3)',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <span aria-hidden="true">👤</span>
                  <span className="truncate max-w-[120px]">{user?.fullName?.split(' ')[0] || 'Dashboard'}</span>
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="navbar-logout-btn"
                  title="Keluar dari akun Anda"
                  style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    background: 'transparent',
                    color: '#DC2626',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    border: '1px solid #FECACA',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  Keluar
                </button>
              </div>
            ) : (
              <div className="navbar-auth-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Link
                  to="/login"
                  className="navbar-login-btn"
                  style={{
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'transparent',
                    color: 'var(--color-deep-navy)',
                    fontWeight: '700',
                    fontSize: '0.88rem',
                    textDecoration: 'none',
                    border: '1.5px solid var(--color-border)',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  className="navbar-register-btn"
                  style={{
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: '#0F766E',
                    color: '#FFFFFF',
                    fontWeight: '700',
                    fontSize: '0.88rem',
                    textDecoration: 'none',
                    boxShadow: '0 2px 8px rgba(15, 118, 110, 0.25)',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  Daftar
                </Link>
              </div>
            )}

            {/* Hamburger Button for Mobile */}
            <button
              type="button"
              className={`navbar-hamburger ${mobileMenuOpen ? 'open' : ''}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Tutup navigasi' : 'Buka navigasi'}
              aria-expanded={mobileMenuOpen}
            >
              <span className="hamburger-bar"></span>
              <span className="hamburger-bar"></span>
              <span className="hamburger-bar"></span>
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="navbar-mobile-drawer" role="dialog" aria-modal="true">
            <ul className="mobile-nav-list">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className={`mobile-nav-link ${link.active ? 'active' : ''}`}
                    onClick={(e) => handleNavClick(e, link.href)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="mobile-help-item">
                <button
                  type="button"
                  className="mobile-help-btn"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setHelpModalOpen(true);
                  }}
                >
                  💡 Buka Petunjuk & Bantuan Belajar
                </button>
              </li>
              <li className="mobile-cta-item">
                <button
                  type="button"
                  className="mobile-cta-btn"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onStartClick?.();
                  }}
                >
                  🚀 Mulai Petualangan Belajar
                </button>
              </li>
              {/* Mobile Auth Items */}
              {isAuthenticated ? (
                <>
                  <li className="mobile-auth-item">
                    <Link
                      to="/dashboard"
                      className="mobile-nav-link"
                      onClick={() => setMobileMenuOpen(false)}
                      style={{ fontWeight: '700', color: '#0F766E' }}
                    >
                      👤 Buka Dashboard Siswa ({user?.fullName?.split(' ')[0]})
                    </Link>
                  </li>
                  <li className="mobile-auth-item">
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        logout();
                      }}
                      className="mobile-help-btn"
                      style={{ color: '#DC2626' }}
                    >
                      🚪 Keluar dari Akun
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="mobile-auth-item">
                    <Link
                      to="/login"
                      className="mobile-nav-link"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      🔐 Masuk ke Akun
                    </Link>
                  </li>
                  <li className="mobile-auth-item">
                    <Link
                      to="/register"
                      className="mobile-nav-link"
                      onClick={() => setMobileMenuOpen(false)}
                      style={{ fontWeight: '700', color: '#0F766E' }}
                    >
                      ✨ Daftar Akun Baru
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </header>

      {/* Modal Bantuan & Panduan Belajar */}
      {helpModalOpen && (
        <div
          className="modal-backdrop"
          onClick={() => setHelpModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="help-modal-title"
        >
          <div className="modal-container help-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-row">
                <span className="modal-icon">📖</span>
                <div>
                  <h3 id="help-modal-title" className="modal-title">Panduan & Bantuan Belajar</h3>
                  <span className="modal-tag">Kimia SMA/MA Kelas XI — Hidrolisis Garam</span>
                </div>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setHelpModalOpen(false)}
                aria-label="Tutup panduan bantuan"
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="help-step-box">
                <div className="help-step-num">01</div>
                <div>
                  <strong>Jelajahi 3 Topik Prasyarat</strong>
                  <p>
                    Sebelum menganalisis reaksi garam, pahami Stoikiometri (mol pereaksi pembatas), Termokimia (kalor netralisasi dan pengaruh suhu pada Kw), serta Teori Asam-Basa Konjugasi Bronsted-Lowry.
                  </p>
                </div>
              </div>

              <div className="help-step-box">
                <div className="help-step-num">02</div>
                <div>
                  <strong>Eksperimen di Beaker Virtual</strong>
                  <p>
                    Gunakan simulasi interaktif pada Hero Section untuk mengganti garam (NaCl, NH₄Cl, CH₃COONa, NH₄CN) dan amati interaksi ion dengan air secara mikroskopis.
                  </p>
                </div>
              </div>

              <div className="help-step-box">
                <div className="help-step-num">03</div>
                <div>
                  <strong>Cegah Miskonsepsi Kimia</strong>
                  <p>
                    Ingat bahwa pH netral = 7 secara spesifik berlaku pada suhu 25°C ($K_w = 1,0 \times 10^{-14}$). Pada suhu lebih tinggi, nilai pH netral bergeser, namun larutan tetap netral jika $[H_3O^+] = [OH^-]$. Pelarutan garam bukanlah hidrolisis; hanya ion konjugasi lemah yang bereaksi dengan molekul air.
                  </p>
                </div>
              </div>

              <div className="help-step-box">
                <div className="help-step-num">04</div>
                <div>
                  <strong>Aksesibilitas & Pintasan</strong>
                  <p>
                    Tekan tombol <kbd className="kb-key">Esc</kbd> kapan saja untuk menutup modal. Gunakan tombol <kbd className="kb-key">Tab</kbd> untuk berpindah antartombol dan kontrol interaktif.
                  </p>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-modal-dismiss"
                onClick={() => setHelpModalOpen(false)}
              >
                Saya Mengerti, Tutup Panduan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

