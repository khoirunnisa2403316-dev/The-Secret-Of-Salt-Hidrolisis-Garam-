import { Link } from 'react-router-dom';
import chemistryIllustration from '../assets/images/chemistry-illustration.svg';
import atomMolecule from '../assets/images/atom-molecule.svg';

/**
 * AuthLayout Component — Media Pembelajaran Kimia
 * Implements modern split layout with chemistry illustrations,
 * rounded surface card, soft shadows, and responsive adaptation.
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
    <div className="min-h-screen bg-[#F0FDFA] flex flex-col justify-between relative overflow-hidden font-sans selection:bg-[#5EEAD4] selection:text-[#134E4A]">
      {/* Background Decorative Chemical Elements & Floating Ambient Glows */}
      <div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#5EEAD4]/20 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 -left-40 w-96 h-96 rounded-full bg-[#0F766E]/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-32 right-1/4 w-80 h-80 rounded-full bg-[#164E63]/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Floating Molecule / Ion Accents */}
      <div
        className="hidden lg:block absolute top-24 left-12 opacity-35 hover:opacity-60 transition-opacity pointer-events-none"
        aria-hidden="true"
      >
        <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#FFFFFF] text-[#0F766E] border border-[#5EEAD4] shadow-xs">
          NH₄⁺(aq) + H₂O ⇌ NH₃ + H₃O⁺
        </span>
      </div>
      <div
        className="hidden lg:block absolute bottom-16 left-1/3 opacity-30 pointer-events-none"
        aria-hidden="true"
      >
        <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#FFFFFF] text-[#164E63] border border-[#CBD5E1] shadow-xs">
          CH₃COO⁻(aq) + H₂O ⇌ CH₃COOH + OH⁻
        </span>
      </div>

      {/* 1. Minimalist Top Header */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex items-center justify-between z-10">
        <Link
          to="/"
          className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E] rounded-xl p-1"
          aria-label="Kembali ke Beranda The Secret of Salt"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-linear-to-br from-[#0F766E] to-[#164E63] flex items-center justify-center shadow-md shadow-[#0F766E]/20 group-hover:scale-105 transition-transform">
            <img
              src={atomMolecule}
              alt="Logo Media Pembelajaran Kimia"
              className="w-7 h-7 drop-shadow-xs"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg text-[#134E4A] tracking-tight group-hover:text-[#0F766E] transition-colors">
                The Secret of Salt
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#CCFBF1] text-[#0F766E] uppercase tracking-wider">
                Kimia XI
              </span>
            </div>
            <p className="text-xs text-[#64748B] hidden sm:block">
              Media Pembelajaran Kimia Interaktif
            </p>
          </div>
        </Link>

        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#0F766E] hover:text-[#115E59] bg-[#FFFFFF] px-3.5 py-2 rounded-xl border border-[#CCFBF1] shadow-xs hover:border-[#5EEAD4] transition-all"
        >
          <span aria-hidden="true">←</span>
          <span>Kembali ke Beranda</span>
        </Link>
      </header>

      {/* 2. Main Content Container: Split Layout (Illustration + Card) */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 flex-1 flex items-center justify-center z-10">
        <div className="w-full max-w-5xl bg-[#FFFFFF] rounded-2xl sm:rounded-3xl shadow-xl shadow-[#0F766E]/08 border border-[#E2E8F0] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
          
          {/* Left Side: Educational Chemistry Illustration Banner (Visible on Desktop / Tablet) */}
          <div className="hidden lg:flex lg:col-span-5 bg-linear-to-br from-[#0F766E] via-[#115E59] to-[#164E63] text-[#FFFFFF] p-8 sm:p-10 flex-col justify-between relative overflow-hidden">
            {/* Subtle Molecule Pattern Overlay */}
            <div
              className="absolute inset-0 opacity-10 bg-[radial-gradient(#5EEAD4_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"
              aria-hidden="true"
            />

            {/* Top Badge */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFFFFF]/15 backdrop-blur-xs border border-[#FFFFFF]/25 text-xs font-semibold text-[#5EEAD4]">
                <span className="w-2 h-2 rounded-full bg-[#5EEAD4] animate-pulse" />
                <span>{illustrationBadge}</span>
              </div>
            </div>

            {/* Center Chemical Graphic */}
            <div className="my-auto py-6 relative z-10 flex flex-col items-center text-center">
              <img
                src={chemistryIllustration}
                alt="Ilustrasi Laboratorium Kimia dan Partikel Garam"
                className="w-full max-w-[280px] drop-shadow-lg transform hover:scale-102 transition-transform duration-300"
              />
              <p className="mt-4 text-xs font-mono text-[#5EEAD4]/90 tracking-wide uppercase">
                ✦ Johnstone's Triangle • Makro - Mikro - Simbolik ✦
              </p>
            </div>

            {/* Bottom Quote & Highlights */}
            <div className="relative z-10 pt-4 border-t border-[#FFFFFF]/20">
              <p className="text-sm font-medium text-[#F0FDFA] leading-relaxed italic">
                "{illustrationQuote}"
              </p>
              <div className="mt-4 flex items-center gap-4 text-xs text-[#5EEAD4]">
                <span className="flex items-center gap-1.5">
                  <span className="text-sm">🧪</span> Lab Interaktif
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-sm">📊</span> Hitung pH
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-sm">🎯</span> Kuis Teruji
                </span>
              </div>
            </div>
          </div>

          {/* Right Side: Form Card */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
            {/* Form Header */}
            <div className="mb-6 sm:mb-8">
              <div className="inline-flex lg:hidden items-center gap-2 px-3 py-1 rounded-full bg-[#CCFBF1] text-[#0F766E] text-xs font-bold mb-3">
                <span>🧪 Media Belajar Kimia</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#134E4A] tracking-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-2 text-sm sm:text-base text-[#64748B] leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Injected Form Body */}
            <div>{children}</div>

            {/* Form Footer */}
            {footerText && footerLinkTo && (
              <div className="mt-8 pt-6 border-t border-[#E2E8F0] text-center text-sm text-[#64748B]">
                <span>{footerText} </span>
                <Link
                  to={footerLinkTo}
                  className="font-bold text-[#0F766E] hover:text-[#115E59] hover:underline focus:outline-none focus:underline transition-colors"
                >
                  {footerLinkText}
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 3. Simple Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 py-4 text-center text-xs text-[#64748B] z-10">
        <p>
          © 2026 The Secret of Salt • Media Pembelajaran Kimia Fase F SMA/MA • Kurikulum Merdeka
        </p>
      </footer>
    </div>
  );
}

