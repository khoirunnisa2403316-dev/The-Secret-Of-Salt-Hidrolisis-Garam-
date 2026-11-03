import { useState } from 'react';

export default function HeroSection({ onStartClick }) {
  // Interactive mini beaker salt state
  const [selectedSalt, setSelectedSalt] = useState('NH4Cl');
  const [temperature, setTemperature] = useState(25); // 25°C or 60°C

  const saltData = {
    NaCl: {
      name: 'Natrium Klorida (NaCl)',
      badgeType: 'Asam Kuat + Basa Kuat',
      origin: 'Asam Kuat (HCl) + Basa Kuat (NaOH)',
      nature: 'Netral',
      natureClass: 'badge-neutral',
      color: '#48BB78', // Emerald neutral
      liquidBg: 'rgba(72, 187, 120, 0.20)',
      ph25: '7,00',
      ph60: '6,51',
      reaction: 'Na⁺(aq) + Cl⁻(aq) + H₂O(l) → Tidak terjadi hidrolisis',
      explanation:
        'Ion Na⁺ dan Cl⁻ merupakan spesi konjugasi yang sangat lemah di dalam air sehingga tidak menarik H⁺ maupun OH⁻ dari air (tidak terhidrolisis). pH larutan tetap netral.',
      ions: ['Na⁺', 'Cl⁻', 'H₂O', 'Na⁺', 'Cl⁻', 'H₂O'],
      testStripColor: '#48BB78',
    },
    NH4Cl: {
      name: 'Amonium Klorida (NH₄Cl)',
      badgeType: 'Asam Kuat + Basa Lemah',
      origin: 'Asam Kuat (HCl) + Basa Lemah (NH₃)',
      nature: 'Asam',
      natureClass: 'badge-acidic',
      color: '#FF887A', // Coral acidic
      liquidBg: 'rgba(255, 136, 122, 0.22)',
      ph25: '5,12',
      ph60: '4,88',
      reaction: 'NH₄⁺(aq) + H₂O(l) ⇌ NH₃(aq) + H₃O⁺(aq)',
      explanation:
        'Kation NH₄⁺ mendonorkan proton ke molekul air menghasilkan ion hidronium (H₃O⁺). Peningkatan konsentrasi [H₃O⁺] menyebabkan larutan bersifat asam.',
      ions: ['NH₄⁺', 'Cl⁻', 'H₃O⁺', 'NH₃', 'NH₄⁺', 'H₂O'],
      testStripColor: '#FF887A',
    },
    CH3COONa: {
      name: 'Natrium Asetat (CH₃COONa)',
      badgeType: 'Asam Lemah + Basa Kuat',
      origin: 'Asam Lemah (CH₃COOH) + Basa Kuat (NaOH)',
      nature: 'Basa',
      natureClass: 'badge-basic',
      color: '#20B8AA', // Fresh Teal basic
      liquidBg: 'rgba(32, 184, 170, 0.22)',
      ph25: '8,87',
      ph60: '8,40',
      reaction: 'CH₃COO⁻(aq) + H₂O(l) ⇌ CH₃COOH(aq) + OH⁻(aq)',
      explanation:
        'Anion asetat CH₃COO⁻ menarik proton dari air menghasilkan molekul CH₃COOH dan ion hidroksida (OH⁻). Peningkatan [OH⁻] menyebabkan larutan bersifat basa.',
      ions: ['CH₃COO⁻', 'Na⁺', 'OH⁻', 'CH₃COOH', 'Na⁺', 'H₂O'],
      testStripColor: '#20B8AA',
    },
    NH4CN: {
      name: 'Amonium Sianida (NH₄CN)',
      badgeType: 'Asam Lemah + Basa Lemah',
      origin: 'Asam Lemah (HCN) + Basa Lemah (NH₃)',
      nature: 'Basa (Kb > Ka)',
      natureClass: 'badge-basic',
      color: '#A995F5', // Soft Purple
      liquidBg: 'rgba(169, 149, 245, 0.22)',
      ph25: '9,23',
      ph60: '8,75',
      reaction: 'NH₄⁺(aq) + CN⁻(aq) + H₂O(l) ⇌ NH₃(aq) + HCN(aq)',
      explanation:
        'Kedua ion mengalami hidrolisis (hidrolisis total). Sifat larutan ditentukan oleh perbandingan Ka dan Kb. Karena Kb(NH₃) = 1,8×10⁻⁵ > Ka(HCN) = 6,2×10⁻¹⁰, larutan bersifat basa!',
      ions: ['NH₄⁺', 'CN⁻', 'OH⁻', 'NH₃', 'HCN', 'H₂O'],
      testStripColor: '#A995F5',
    },
  };

  const current = saltData[selectedSalt];
  const currentPh = temperature === 25 ? current.ph25 : current.ph60;

  return (
    <section className="hero-section" aria-labelledby="hero-heading">
      <div className="hero-container container">
        {/* Left Column: Text & Curiosity Hook */}
        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-icon" aria-hidden="true">🧪</span>
            <span>The Secret of Salt • SMA/MA Kelas XI (Fase F)</span>
          </div>

          <h1 id="hero-heading" className="hero-title">
            Mengungkap Rahasia <span className="highlight-teal">Hidrolisis Garam</span>
          </h1>
          <p className="hero-subtitle">
            Jelajahi interaksi ionik tingkat mikroskopis, amati reaksi dengan molekul air, dan temukan sifat pH larutan garam secara interaktif!
          </p>

          {/* Fenomena Pemantik per PRD 9.1 */}
          <div className="hero-hook-box">
            <div className="hook-header">
              <span className="hook-icon" aria-hidden="true">💡</span>
              <strong className="hook-title">Fenomena Rasa Ingin Tahu:</strong>
            </div>
            <p className="hero-hook-text">
              <strong>Apakah semua garam menghasilkan larutan netral? Ternyata tidak.</strong> Mengapa garam dapur (<strong>NaCl</strong>) menghasilkan larutan netral, namun pupuk <strong>NH₄Cl</strong> bersifat asam, dan garam <strong>CH₃COONa</strong> bersifat basa? Pelajari bagaimana ion-ion garam bereaksi dengan air dan menentukan sifat larutan!
            </p>
          </div>

          {/* 3 Measurable Learning Goals (TP) */}
          <div className="hero-goals-row">
            <div className="goal-item" title="Capaian Pembelajaran TP 1">
              <span className="goal-icon" aria-hidden="true">🎯</span>
              <span>1. Identifikasi Asal Garam</span>
            </div>
            <div className="goal-item" title="Capaian Pembelajaran TP 2 & 3">
              <span className="goal-icon" aria-hidden="true">🔬</span>
              <span>2. Reaksi Ion dengan Air</span>
            </div>
            <div className="goal-item" title="Capaian Pembelajaran TP 4">
              <span className="goal-icon" aria-hidden="true">📊</span>
              <span>3. Prediksi & Hitung pH</span>
            </div>
          </div>

          {/* CTA Buttons per PRD 9.1 */}
          <div className="hero-cta-group">
            <button
              type="button"
              className="btn-primary-hero"
              onClick={onStartClick}
              id="mulai-belajar-btn"
              aria-label="Mulai Belajar Materi Hidrolisis Garam"
            >
              <span className="btn-icon" aria-hidden="true">🚀</span>
              <span className="btn-text">Mulai Belajar</span>
              <svg className="btn-arrow" viewBox="0 0 20 20" fill="currentColor" width="20" height="20" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <a href="#lab-interaktif" className="btn-secondary-hero">
              <span className="btn-icon" aria-hidden="true">🔬</span>
              <span>Jelajahi Simulasi</span>
            </a>
          </div>
        </div>

        {/* Right Column: Interactive Science Simulation Beaker */}
        <div className="hero-visual-card" id="lab-interaktif" aria-label="Simulasi Lab Maya Partikel Garam">
          <div className="visual-card-header">
            <div className="live-indicator">
              <span className="live-pulse" aria-hidden="true"></span>
              <span className="live-label">Laboratorium Maya • Simulasi Cepat</span>
            </div>

            {/* Suhu Switcher (Mencegah Miskonsepsi Suhu 25°C vs 60°C) */}
            <div className="temp-control-pill" role="group" aria-label="Pilih Suhu Pengukuran">
              <button
                type="button"
                className={`temp-btn ${temperature === 25 ? 'active' : ''}`}
                onClick={() => setTemperature(25)}
                title="Suhu standar laboratorium (Kw = 1,0 × 10⁻¹⁴, pH netral = 7,00)"
              >
                25°C
              </button>
              <button
                type="button"
                className={`temp-btn ${temperature === 60 ? 'active' : ''}`}
                onClick={() => setTemperature(60)}
                title="Suhu tinggi (Kw = 9,6 × 10⁻¹⁴, pH netral = 6,51)"
              >
                60°C
              </button>
            </div>
          </div>

          {/* Salt Sample Selector Pills */}
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
                {saltKey === 'NaCl' && '1. NaCl'}
                {saltKey === 'NH4Cl' && '2. NH₄Cl'}
                {saltKey === 'CH3COONa' && '3. CH₃COONa'}
                {saltKey === 'NH4CN' && '4. NH₄CN'}
              </button>
            ))}
          </div>

          {/* Interactive Beaker Visualizer & Digital pH Meter */}
          <div className="beaker-stage">
            {/* Visual Glass Beaker */}
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
                <div className="ions-particles-container" aria-hidden="true">
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
              <div className="beaker-ticks" aria-hidden="true">
                <span className="tick tick-3">200 mL</span>
                <span className="tick tick-2">100 mL</span>
                <span className="tick tick-1">50 mL</span>
              </div>
            </div>

            {/* Live Indicator Card & Digital pH Reader */}
            <div className="simulation-info-panel">
              <div className="info-salt-title">
                <div>
                  <strong>{current.name}</strong>
                  <span className="salt-badge-type">{current.badgeType}</span>
                </div>
                <div className="ph-meter-badge" style={{ backgroundColor: current.liquidBg, borderColor: current.color }}>
                  <span className="ph-meter-label">pH ({temperature}°C):</span>
                  <span className="ph-meter-val" style={{ color: current.color }}>{currentPh}</span>
                </div>
              </div>

              <div className="info-origin">
                <small>Kombinasi Asal:</small>
                <div>{current.origin}</div>
              </div>

              <div className="info-reaction-box">
                <small className="reaction-label">Persamaan Reaksi Ionik:</small>
                <code className="reaction-formula">{current.reaction}</code>
              </div>

              <p className="info-desc">{current.explanation}</p>

              {/* Anti-misconception alert when 60°C is selected */}
              {temperature === 60 && (
                <div className="temp-alert-box">
                  <span aria-hidden="true">⚠️</span>
                  <span>
                    Pada 60°C, air murni memiliki pH 6,51 namun tetap <strong>NETRAL</strong> karena [H₃O⁺] = [OH⁻]!
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

