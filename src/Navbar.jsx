import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './context/useAuth';
import './Navbar.css';

/**
 * Left Sidebar Navigation Component — The Secret of Salt
 * Positioned on the left side downwards in an orderly, structured, neat sequence.
 * Features responsive off-canvas drawer on mobile and persistent sidebar on desktop.
 */
export default function Navbar({ onStartClick }) {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [warmMode, setWarmMode] = useState(false);
  const [activeHash, setActiveHash] = useState('#beranda');

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

  // Track active section as user scrolls
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['beranda', 'topik-prasyarat', 'lab-interaktif', 'kuis-modul-1', 'tentang'];
      const scrollPosition = window.scrollY + 140;

      for (let i = sections.length - 1; i >= 0; i--) {
        const id = sections[i];
        const el = document.getElementById(id);
        if (el && scrollPosition >= el.offsetTop) {
          setActiveHash(`#${id}`);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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
    { label: 'Beranda', href: '#beranda', icon: '🏠' },
    { label: 'Topik Prasyarat', href: '#topik-prasyarat', icon: '📖' },
    { label: 'Lab Maya & Simulasi', href: '#lab-interaktif', icon: '🧪' },
    { label: 'Kuis Modul 1', href: '#kuis-modul-1', icon: '🎯' },
    { label: 'Tentang Media', href: '#tentang', icon: 'ℹ️' },
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setActiveHash(href);
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleStartCta = () => {
    setMobileMenuOpen(false);
    onStartClick?.();
  };

  const isAuthorizedTeacher =
    user?.role === 'teacher' &&
    user?.email?.toLowerCase().trim() === 'khoirun.nisa.2403316@students.um.ac.id';

  return (
    <>
      {/* 1. Mobile Top Bar (Visible only on screens < 1024px) */}
      <div className="sidebar-mobile-bar" id="mobile-top-bar">
        <a href="#beranda" className="mobile-bar-brand" onClick={(e) => handleNavClick(e, '#beranda')}>
          <div className="mobile-bar-logo">
            <svg
              style={{ width: '22px', height: '22px' }}
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
            </svg>
          </div>
          <span className="mobile-bar-title">The Secret of Salt</span>
        </a>

        <button
          type="button"
          className="mobile-bar-hamburger"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Tutup menu samping' : 'Buka menu samping'}
          aria-expanded={mobileMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* 2. Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* 3. Main Left Sidebar (Disamping Kiri Kebawah Secara Berurutan Terstruktur) */}
      <aside
        className={`sidebar-panel ${mobileMenuOpen ? 'open' : ''}`}
        aria-label="Navigasi Panel Beranda"
        id="beranda"
      >
        {/* A. Bagian Atas: Identitas / Brand Media */}
        <div className="sidebar-brand-block">
          <div className="sidebar-brand-top">
            <a
              href="#beranda"
              className="sidebar-brand-link"
              onClick={(e) => handleNavClick(e, '#beranda')}
              aria-label="Kembali ke atas Beranda"
            >
              <div className="sidebar-brand-logo">
                <svg
                  style={{ width: '26px', height: '26px' }}
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

              <div className="sidebar-brand-info">
                <span className="sidebar-brand-title">The Secret of Salt</span>
                <span className="sidebar-brand-tag">XI • FASE F</span>
              </div>
            </a>

            <button
              type="button"
              className="sidebar-close-btn"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Tutup panel"
            >
              ✕
            </button>
          </div>

          <p className="sidebar-brand-tagline">
            Hydrolysis Adventure — Explore the Ions, Discover the pH!
          </p>
        </div>

        {/* B. Bagian Tengah (Scrollable): Menu Navigasi, Hak Akses, dan Pengaturan */}
        <div className="sidebar-middle-scroll">
          {/* B.1. Menu Navigasi Utama */}
          <div className="sidebar-section">
            <span className="sidebar-section-title">Navigasi Belajar</span>
            <ul className="sidebar-nav-list">
              {navLinks.map((link) => {
                const isActive = activeHash === link.href;
                return (
                  <li key={link.label} className="sidebar-nav-item">
                    <a
                      href={link.href}
                      className={`sidebar-nav-link ${isActive ? 'active' : ''}`}
                      onClick={(e) => handleNavClick(e, link.href)}
                    >
                      <div className="sidebar-nav-left">
                        <span className="sidebar-nav-icon">{link.icon}</span>
                        <span>{link.label}</span>
                      </div>
                      {isActive && <span className="sidebar-active-dot" />}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* B.2. Akses Khusus: Panel Guru (Khusus Akun Guru) & Dashboard Siswa */}
          {isAuthenticated && (
            <div className="sidebar-section">
              <span className="sidebar-section-title">Area Pengguna</span>
              <div className="sidebar-special-pills">
                {isAuthorizedTeacher && (
                  <Link
                    to="/teacher"
                    className="sidebar-teacher-btn"
                    onClick={() => setMobileMenuOpen(false)}
                    title="Buka Panel Pengampu Guru"
                  >
                    <span>👩‍🏫</span>
                    <span>Panel Pengampu Guru</span>
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  className="sidebar-dashboard-btn"
                  onClick={() => setMobileMenuOpen(false)}
                  title="Buka Dashboard Belajar Anda"
                >
                  <span>👤</span>
                  <span>Dashboard {isAuthorizedTeacher ? 'Pengampu' : 'Siswa'}</span>
                </Link>
              </div>
            </div>
          )}

          {/* B.3. Fitur Belajar, Tema, dan Bantuan */}
          <div className="sidebar-section">
            <span className="sidebar-section-title">Fitur & Pengaturan</span>
            <div className="sidebar-util-buttons">
              {/* Tombol Panduan Belajar */}
              <button
                type="button"
                className="sidebar-util-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setHelpModalOpen(true);
                }}
                title="Buka Petunjuk & Panduan Belajar Kimia"
              >
                <span style={{ fontSize: '1.05rem' }}>💡</span>
                <span>Panduan Belajar</span>
              </button>

              {/* Tombol Alih Mode Ramah Mata */}
              <button
                type="button"
                className={`sidebar-util-btn ${warmMode ? 'warm-active' : ''}`}
                onClick={toggleTheme}
                title={warmMode ? 'Ganti ke Mode Normal' : 'Ganti ke Mode Ramah Mata (Warm Ivory)'}
              >
                <span style={{ fontSize: '1.05rem' }}>{warmMode ? '☀️' : '🌙'}</span>
                <span>Mode: {warmMode ? 'Hangat Ivory' : 'Standar'}</span>
              </button>

              {/* CTA Mulai Belajar */}
              <button
                type="button"
                className="sidebar-cta-btn"
                onClick={handleStartCta}
                title="Mulai Petualangan Belajar Hidrolisis Garam"
              >
                <span>✨</span>
                <span>Mulai Belajar</span>
              </button>
            </div>
          </div>
        </div>

        {/* C. Bagian Bawah: Akun Pengguna / Autentikasi */}
        <div className="sidebar-bottom-block">
          <span className="sidebar-section-title">Akun Belajar</span>
          {isAuthenticated ? (
            <div className="sidebar-user-card">
              <div className="sidebar-user-left">
                <div className="sidebar-user-avatar">
                  {user?.fullName?.charAt(0)?.toUpperCase() || 'S'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span className="sidebar-user-name" title={user?.fullName || 'Pengguna'}>
                    {user?.fullName || 'Pengguna'}
                  </span>
                  <span style={{ fontSize: '0.68rem', color: '#64748B' }}>
                    {isAuthorizedTeacher ? 'Guru Pengampu' : 'Siswa'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="sidebar-btn-logout"
                title="Keluar dari akun"
              >
                Keluar
              </button>
            </div>
          ) : (
            <div className="sidebar-auth-guest">
              <Link
                to="/login"
                className="sidebar-btn-login"
                onClick={() => setMobileMenuOpen(false)}
              >
                Masuk ke Akun
              </Link>
              <Link
                to="/register"
                className="sidebar-btn-register"
                onClick={() => setMobileMenuOpen(false)}
              >
                ✨ Daftar Akun Baru
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* 4. Modal Panduan & Bantuan Belajar */}
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
