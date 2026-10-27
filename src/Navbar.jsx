import { useState } from 'react';

export default function Navbar({ onStartClick }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Beranda', href: '#beranda', active: true },
    { label: 'Topik Prasyarat', href: '#topik-prasyarat' },
    { label: 'Lab Maya & Simulasi', href: '#lab-interaktif' },
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
    <header className="navbar-header" id="beranda">
      <div className="navbar-container container">
        {/* Brand / Media Identity */}
        <a href="#beranda" className="navbar-brand" aria-label="Hydrolysis Adventure Home">
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
              <span className="brand-title">Hydrolysis Adventure</span>
              <span className="brand-grade-tag">SMA/MA XI</span>
            </div>
            <span className="brand-tagline">Explore the Ions, Discover the pH!</span>
          </div>
        </a>

        {/* Desktop Nav Links */}
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

        {/* Action Button & Mobile Toggle */}
        <div className="navbar-actions">
          <button
            type="button"
            className="navbar-cta-btn"
            onClick={onStartClick}
            aria-label="Mulai Belajar Sekarang"
          >
            <span className="btn-sparkle">✨</span>
            <span>Mulai Belajar</span>
          </button>

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
          </ul>
        </div>
      )}
    </header>
  );
}
