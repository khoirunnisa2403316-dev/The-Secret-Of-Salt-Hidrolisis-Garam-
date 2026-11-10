import { Link } from 'react-router-dom';
import chemistryIllustration from '../assets/images/chemistry-illustration.svg';
import atomMolecule from '../assets/images/atom-molecule.svg';
import './Auth.css';

/**
 * AuthLayout Component — Media Pembelajaran Kimia
 * Implements a modern, responsive split layout with chemistry illustrations,
 * rounded cards, soft elevation shadows, and robust layout guarantees.
 */

export default function AuthLayout({
  title,
  subtitle,
  children,
  footerText,
  footerLinkText,
  footerLinkTo,
  illustrationBadge = 'Lab Maya Kimia • Fase F',
  illustrationQuote = 'Ungkap rahasia kesetimbangan ionik dan hidrolisis garam dalam petualangan kimia interaktif!',
}) {
  return (
    <div className="auth-page-container">
      {/* Background Decorative Glows */}
      <div className="auth-ambient-glow-1" aria-hidden="true" />
      <div className="auth-ambient-glow-2" aria-hidden="true" />
      <div className="auth-ambient-glow-3" aria-hidden="true" />

      {/* Floating Molecule / Ion Accents */}
      <div className="auth-floating-pill auth-floating-pill-1" aria-hidden="true">
        <span className="auth-pill-badge">
          NH₄⁺(aq) + H₂O ⇌ NH₃ + H₃O⁺
        </span>
      </div>
      <div className="auth-floating-pill auth-floating-pill-2" aria-hidden="true">
        <span className="auth-pill-badge auth-pill-badge-alt">
          CH₃COO⁻(aq) + H₂O ⇌ CH₃COOH + OH⁻
        </span>
      </div>

      {/* 1. Minimalist Top Header */}
      <header className="auth-header">
        <Link
          to="/"
          className="auth-brand-link"
          aria-label="Kembali ke Beranda The Secret of Salt"
        >
          <div className="auth-brand-logo">
            <img
              src={atomMolecule}
              alt="Logo Media Pembelajaran Kimia"
            />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span className="auth-brand-title">
                The Secret of Salt
              </span>
              <span className="auth-brand-badge">
                Kimia XI
              </span>
            </div>
            <p className="auth-brand-subtitle">
              Media Pembelajaran Kimia Interaktif
            </p>
          </div>
        </Link>

        <Link
          to="/"
          className="auth-back-link"
        >
          <span aria-hidden="true">←</span>
          <span>Kembali ke Beranda</span>
        </Link>
      </header>

      {/* 2. Main Content Container: Split Layout (Illustration + Form Card) */}
      <main className="auth-main-area">
        <div className="auth-card">
          
          {/* Left Side: Educational Chemistry Illustration Banner */}
          <div className="auth-side-panel">
            {/* Subtle Molecule Pattern Overlay */}
            <div className="auth-side-pattern" aria-hidden="true" />

            {/* Top Badge */}
            <div className="auth-side-top">
              <div className="auth-side-badge">
                <span className="auth-pulse-dot" />
                <span>{illustrationBadge}</span>
              </div>
            </div>

            {/* Center Chemical Graphic */}
            <div className="auth-side-center">
              <img
                src={chemistryIllustration}
                alt="Ilustrasi Laboratorium Kimia dan Partikel Garam"
                className="auth-illustration-img"
              />
              <p className="auth-illustration-caption">
                ✦ Johnstone's Triangle • Makro - Mikro - Simbolik ✦
              </p>
            </div>

            {/* Bottom Quote & Highlights */}
            <div className="auth-side-bottom">
              <p className="auth-quote-text">
                "{illustrationQuote}"
              </p>
              <div className="auth-feature-tags">
                <span>🧪 Lab Interaktif</span>
                <span>•</span>
                <span>📊 Hitung pH</span>
                <span>•</span>
                <span>🎯 Kuis Teruji</span>
              </div>
            </div>
          </div>

          {/* Right Side: Form Card */}
          <div className="auth-form-panel">
            {/* Form Header */}
            <div>
              <div className="auth-mobile-badge">
                <span>🧪 Media Belajar Kimia</span>
              </div>
              <h1 className="auth-title">
                {title}
              </h1>
              {subtitle && (
                <p className="auth-subtitle">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Injected Form Body */}
            <div>{children}</div>

            {/* Form Footer */}
            {footerText && footerLinkTo && (
              <div className="auth-card-footer">
                <span>{footerText}</span>
                <Link to={footerLinkTo}>
                  {footerLinkText}
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 3. Simple Academic Footer */}
      <footer className="auth-outer-footer">
        <p>
          © 2026 The Secret of Salt • Media Pembelajaran Kimia Fase F SMA/MA • Kurikulum Merdeka
        </p>
      </footer>
    </div>
  );
}
