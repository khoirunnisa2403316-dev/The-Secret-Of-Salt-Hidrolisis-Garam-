import { useState } from 'react';

export default function HeroSection({ onStartClick }) {
  // Interactive mini beaker salt state for scientific curiosity hook
  const [selectedSalt, setSelectedSalt] = useState('NH4Cl');

  const saltData = {
    NaCl: {
      name: 'Natrium Klorida (NaCl)',
      origin: 'Asam Kuat (HCl) + Basa Kuat (NaOH)',
      nature: 'Netral (pH = 7,00 pada 25°C)',
      natureClass: 'badge-neutral',
      color: '#48BB78', // Emerald neutral
      liquidBg: 'rgba(72, 187, 120, 0.18)',
      reaction: 'Na⁺(aq) + Cl⁻(aq) + H₂O(l) → Tidak terjadi hidrolisis',
      explanation: 'Ion Na⁺ dan Cl⁻ merupakan konjugasi kuat sehingga tidak menarik H⁺ atau OH⁻ dari air.',
      ions: ['Na⁺', 'Cl⁻', 'H₂O', 'Na⁺', 'Cl⁻'],
    },
    NH4Cl: {
      name: 'Amonium Klorida (NH₄Cl)',
      origin: 'Asam Kuat (HCl) + Basa Lemah (NH₃)',
      nature: 'Asam (pH < 7, contoh: 5,12)',
      natureClass: 'badge-acidic',
      color: '#FF887A', // Coral acidic
      liquidBg: 'rgba(255, 136, 122, 0.22)',
      reaction: 'NH₄⁺(aq) + H₂O(l) ⇌ NH₃(aq) + H₃O⁺(aq)',
      explanation: 'Kation NH₄⁺ mendonorkan proton ke air membentuk ion hidronium (H₃O⁺), meningkatkan keasaman.',
      ions: ['NH₄⁺', 'Cl⁻', 'H₃O⁺', 'NH₃', 'NH₄⁺'],
    },
    CH3COONa: {
      name: 'Natrium Asetat (CH₃COONa)',
      origin: 'Asam Lemah (CH₃COOH) + Basa Kuat (NaOH)',
      nature: 'Basa (pH > 7, contoh: 8,87)',
      natureClass: 'badge-basic',
      color: '#20B8AA', // Fresh Teal basic
      liquidBg: 'rgba(32, 184, 170, 0.22)',
      reaction: 'CH₃COO⁻(aq) + H₂O(l) ⇌ CH₃COOH(aq) + OH⁻(aq)',
      explanation: 'Anion asetat CH₃COO⁻ menarik proton dari air menghasilkan ion hidroksida (OH⁻), membuat larutan basa.',
      ions: ['CH₃COO⁻', 'Na⁺', 'OH⁻', 'CH₃COOH', 'Na⁺'],
    },
  };

  const current = saltData[selectedSalt];

  return (
    <section className="hero-section" aria-labelledby="hero-heading">
      <div className="hero-container container">
        {/* Left Column: Text & CTA */}
        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-icon">🧪</span>
            <span>Media Pembelajaran Kimia SMA XI • Kurikulum Merdeka</span>
          </div>

          <h1 id="hero-heading" className="hero-title">
            Jelajahi Rahasia <span className="highlight-teal">Ion</span>, Ungkap Misteri{' '}
            <span className="highlight-yellow">pH Larutan!</span>
          </h1>

          {/* Fenomena Pemantik per PRD */}
          <div className="hero-hook-box">
            <div className="hook-header">
              <span className="hook-icon">💡</span>
              <strong className="hook-title">Fenomena Pemantik:</strong>
            </div>
            <p className="hero-hook-text">
              Mengapa garam dapur (<strong>NaCl</strong>) berasa netral di air, namun pupuk{' '}
              <strong>NH₄Cl</strong> bersifat asam, dan baking soda <strong>NaHCO₃</strong> bersifat basa?
              Temukan bagaimana ion berinteraksi dengan air melalui simulasi mikroskopis interaktif!
            </p>
          </div>

          {/* Quick Learning Goals */}
          <div className="hero-goals-row">
            <div className="goal-item">
              <span className="goal-icon">🎯</span>
              <span>Identifikasi Asal Garam</span>
            </div>
            <div className="goal-item">
              <span className="goal-icon">🔬</span>
              <span>Reaksi Ion & Air</span>
            </div>
            <div className="goal-item">
              <span className="goal-icon">📊</span>
              <span>Hitung Nilai pH Akurat</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="hero-cta-group">
            <button
              type="button"
              className="btn-primary-hero"
              onClick={onStartClick}
              id="mulai-belajar-btn"
            >
              <span className="btn-icon">🚀</span>
              <span className="btn-text">Mulai Belajar</span>
              <svg className="btn-arrow" viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <a href="#topik-prasyarat" className="btn-secondary-hero">
              <span className="btn-icon">📚</span>
              <span>Lihat 3 Topik Dasar</span>
            </a>
          </div>
        </div>

        {/* Right Column: Interactive Science Simulation Beaker */}
        <div className="hero-visual-card" id="lab-interaktif">
          <div className="visual-card-header">
            <div className="live-indicator">
              <span className="live-pulse"></span>
              <span className="live-label">Pratinjau Reaksi Cepat</span>
            </div>
            <span className="visual-badge-level">Suhu 25°C</span>
          </div>

          <div className="salt-selector-pills" role="tablist" aria-label="Pilih Sampel Garam">
            {Object.keys(saltData).map((saltKey) => (
              <button
                key={saltKey}
                type="button"
                role="tab"
                aria-selected={selectedSalt === saltKey}
                className={`salt-pill-btn ${selectedSalt === saltKey ? 'active' : ''}`}
                onClick={() => setSelectedSalt(saltKey)}
              >
                {saltKey === 'NaCl' && 'NaCl'}
                {saltKey === 'NH4Cl' && 'NH₄Cl'}
                {saltKey === 'CH3COONa' && 'CH₃COONa'}
              </button>
            ))}
          </div>

          {/* Interactive Beaker Visualizer */}
          <div className="beaker-stage">
            <div
              className="beaker-glass"
              style={{
                borderColor: current.color,
                boxShadow: `0 12px 30px ${current.liquidBg}`,
              }}
            >
              {/* Liquid inside beaker */}
              <div
                className="beaker-liquid"
                style={{
                  backgroundColor: current.liquidBg,
                  borderTopColor: current.color,
                }}
              >
                <div className="liquid-surface-wave" style={{ backgroundColor: current.color }}></div>

                {/* Microscopic Ions floating */}
                <div className="ions-particles-container">
                  {current.ions.map((ion, idx) => (
                    <span
                      key={`${ion}-${idx}`}
                      className={`particle-ion particle-${idx + 1}`}
                      style={{
                        borderColor: current.color,
                        color: '#243B64',
                      }}
                    >
                      {ion}
                    </span>
                  ))}
                </div>
              </div>

              {/* Beaker Measurement lines */}
              <div className="beaker-ticks">
                <span className="tick tick-3">200 mL</span>
                <span className="tick tick-2">100 mL</span>
                <span className="tick tick-1">50 mL</span>
              </div>
            </div>

            {/* Live Indicator Card */}
            <div className="simulation-info-panel">
              <div className="info-salt-title">
                <strong>{current.name}</strong>
                <span className={`nature-badge ${current.natureClass}`}>{current.nature}</span>
              </div>
              <div className="info-origin">
                <small>Asal Pembentukan:</small>
                <div>{current.origin}</div>
              </div>
              <div className="info-reaction-box">
                <small className="reaction-label">Persamaan Reaksi Ion:</small>
                <code className="reaction-formula">{current.reaction}</code>
              </div>
              <p className="info-desc">{current.explanation}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
