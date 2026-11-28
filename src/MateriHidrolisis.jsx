import { useState, useMemo, useEffect } from 'react';
import './MateriHidrolisis.css';

// Superscript converter for scientific notation powers
function toSuperscript(num) {
  const map = { '-': '⁻', '+': '⁺', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
  return String(num).split('').map((c) => map[c] || c).join('');
}

// Convert numbers like 1.8e-5 to "1,8 × 10⁻⁵" (no confusing 'e' for students)
function formatScientific(val, decimals = 2) {
  const num = typeof val === 'number' ? val : parseFloat(val);
  if (isNaN(num) || num === 0) return '0';
  const expStr = num.toExponential();
  const [mantissa, exp] = expStr.split('e');
  const m = parseFloat(mantissa);
  const mFormatted = Number.isInteger(m) ? m.toString() : m.toFixed(decimals).replace(/\.?0+$/, '');
  const expNum = parseInt(exp, 10);
  if (expNum === 0) return mFormatted.replace('.', ',');
  return `${mFormatted.replace('.', ',')} × 10${toSuperscript(expNum)}`;
}

// Convert numbers like 1.8e-5 to decimal helper string "(0,000018)"
function formatDecimal(val) {
  const num = typeof val === 'number' ? val : parseFloat(val);
  if (isNaN(num) || num === 0) return '0';
  if (num < 1) {
    const s = num.toFixed(10).replace(/0+$/, '').replace(/\.$/, '');
    return s.replace('.', ',');
  }
  return num.toString().replace('.', ',');
}

// Parse student input gracefully (supports 1.8e-5, 0.000018, 1,8 x 10^-5, etc.)
function parseIonVal(str, fallback = 1.8e-5) {
  if (typeof str === 'number') return isNaN(str) || str <= 0 ? fallback : str;
  if (!str) return fallback;
  const clean = String(str).trim().replace(',', '.');
  if (/^([0-9.]+)\s*[xX*×]\s*10\^?([+-]?[0-9]+)$/.test(clean)) {
    const match = clean.match(/^([0-9.]+)\s*[xX*×]\s*10\^?([+-]?[0-9]+)$/);
    if (match) {
      const parsed = parseFloat(match[1]) * Math.pow(10, parseInt(match[2], 10));
      return isNaN(parsed) || parsed <= 0 ? fallback : parsed;
    }
  }
  const parsed = parseFloat(clean);
  return isNaN(parsed) || parsed <= 0 ? fallback : parsed;
}

/**
 * Materi Hidrolisis Garam Lengkap — The Secret of Salt
 * Mengacu pada PRD Bab 11, 12, 13, 14, 15, 16 dan AGENTS.md:
 * 1. Pengertian Garam, Air (Kw), Hidrolisis & Konsep Pasangan Konjugasi
 * 2. 4 Jenis Hidrolisis Garam Lengkap
 * 3. Mekanisme & Johnstone's Triangle (Makroskopis, Submikroskopis, Simbolik)
 * 4. Rumus Tetapan Kh, Derajat Hidrolisis, dan Rumus pH Lengkap
 * 5. Simulator Kalkulator Perhitungan pH Interaktif (Langkah bertahap ramah SMA)
 * 6. Penerapan Sehari-hari & Misconception Buster
 */
export default function MateriHidrolisis() {
  const [activeTab, setActiveTab] = useState('konsep');
  const [selectedSaltType, setSelectedSaltType] = useState('lemah_kuat');
  const [johnstoneSalt, setJohnstoneSalt] = useState('CH3COONa');

  // Calculator Interactive States
  const [calcSaltType, setCalcSaltType] = useState('lemah_kuat'); // 'kuat_kuat' | 'lemah_kuat' | 'kuat_lemah' | 'lemah_lemah'
  const [molarity, setMolarity] = useState('0.1');
  const [valence, setValence] = useState('1');

  // Ka / Kb SMA-Friendly Controls & Presets
  const [ionPresetMode, setIonPresetMode] = useState('cuka'); // 'cuka' | 'amonia' | 'custom'
  const [kaInputVal, setKaInputVal] = useState('1.8e-5');
  const [kbInputVal, setKbInputVal] = useState('1.8e-5');

  // Listen to external switch requests (e.g. from SearchBar)
  useEffect(() => {
    const handleSwitchTab = (e) => {
      const { tab, saltType } = e.detail || {};
      if (tab) {
        setActiveTab(tab);
      }
      if (saltType) {
        setSelectedSaltType(saltType);
        if (tab === 'kalkulator') {
          setCalcSaltType(saltType);
        }
      }
    };

    window.addEventListener('switch-materi-tab', handleSwitchTab);
    return () => window.removeEventListener('switch-materi-tab', handleSwitchTab);
  }, []);

  // Preset Handler for Ka/Kb buttons
  const handleSelectIonPreset = (mode) => {
    setIonPresetMode(mode);
    if (mode === 'cuka') {
      setCalcSaltType('lemah_kuat');
      setKaInputVal('1.8e-5');
    } else if (mode === 'amonia') {
      setCalcSaltType('kuat_lemah');
      setKbInputVal('1.8e-5');
    }
  };

  // Preset Handler for Salt Demonstrations
  const handleApplyPreset = (presetKey) => {
    if (presetKey === 'ch3coona') {
      setCalcSaltType('lemah_kuat');
      setMolarity('0.1');
      setValence('1');
      setKaInputVal('1.8e-5');
      setIonPresetMode('cuka');
    } else if (presetKey === 'nh4cl') {
      setCalcSaltType('kuat_lemah');
      setMolarity('0.1');
      setValence('1');
      setKbInputVal('1.8e-5');
      setIonPresetMode('amonia');
    } else if (presetKey === 'nh4_2so4') {
      setCalcSaltType('kuat_lemah');
      setMolarity('0.05');
      setValence('2');
      setKbInputVal('1.8e-5');
      setIonPresetMode('amonia');
    } else if (presetKey === 'nh4cn') {
      setCalcSaltType('lemah_lemah');
      setMolarity('0.1');
      setKaInputVal('6.2e-10');
      setKbInputVal('1.8e-5');
      setIonPresetMode('custom');
    } else if (presetKey === 'nacl') {
      setCalcSaltType('kuat_kuat');
      setMolarity('0.1');
      setValence('1');
    }
  };

  // Real-time calculation computation
  const calcResult = useMemo(() => {
    const M = parseFloat(molarity) || 0.1;
    const v = parseInt(valence, 10) || 1;
    const Kw = 1e-14;
    const ionM = M * v;
    const Ka = parseIonVal(kaInputVal, 1.8e-5);
    const Kb = parseIonVal(kbInputVal, 1.8e-5);

    if (calcSaltType === 'kuat_kuat') {
      return {
        nature: 'Netral',
        ph: '7,00',
        poh: '7,00',
        hPlus: '1,0 × 10⁻⁷',
        ohMinus: '1,0 × 10⁻⁷',
        kh: '0 (Tidak terhidrolisis)',
        alpha: '0',
        badgeClass: 'neutral',
        explanation: 'Ion dari asam kuat dan basa kuat tidak bereaksi dengan air. Pada suhu 25°C nilai pH tepat netral 7,00.',
        steps: [
          'Garam terionisasi sempurna menjadi kation dan anion bebas di dalam air.',
          'Kation basa kuat dan anion asam kuat tidak menarik atau mendonorkan proton dari/ke molekul air.',
          'Kesetimbangan autoionisasi air tidak terganggu: [H⁺] = [OH⁻] = 1,0 × 10⁻⁷ M.',
          'pH = -log(1,0 × 10⁻⁷) = 7,00 (Netral).',
        ],
      };
    }

    if (calcSaltType === 'lemah_kuat') {
      const Kh = Kw / Ka;
      const ohMinus = Math.sqrt(Kh * ionM);
      const poh = -Math.log10(ohMinus);
      const ph = 14 - poh;
      const alpha = Math.sqrt(Kh / ionM) * 100;

      return {
        nature: 'Basa (pH > 7)',
        ph: ph.toFixed(2).replace('.', ','),
        poh: poh.toFixed(2).replace('.', ','),
        hPlus: formatScientific(Kw / ohMinus),
        ohMinus: formatScientific(ohMinus),
        kh: formatScientific(Kh),
        alpha: alpha < 0.01 ? '< 0,01' : alpha.toFixed(3).replace('.', ','),
        badgeClass: 'basic',
        explanation: `Anion asam lemah terhidrolisis menarik proton dari air membentuk ion OH⁻ bebas. Karena Ka = ${formatScientific(Ka)}, nilai Kh = ${formatScientific(Kh)}.`,
        steps: [
          `Langkah 1 (Hitung Konsentrasi Anion): [Anion] = ${M} M × valensi ${v} = ${ionM.toFixed(3).replace('.', ',')} M`,
          `Langkah 2 (Tetapan Hidrolisis Kh): Kh = Kw / Ka = 10⁻¹⁴ / (${formatScientific(Ka)}) = ${formatScientific(Kh)}`,
          `Langkah 3 (Konsentrasi OH⁻): [OH⁻] = √(Kh × [Anion]) = √( (${formatScientific(Kh)}) × ${ionM} ) = ${formatScientific(ohMinus)} M`,
          `Langkah 4 (Hitung pOH & pH): pOH = -log(${formatScientific(ohMinus)}) = ${poh.toFixed(2).replace('.', ',')}  →  pH = 14 - ${poh.toFixed(2).replace('.', ',')} = ${ph.toFixed(2).replace('.', ',')}`,
        ],
      };
    }

    if (calcSaltType === 'kuat_lemah') {
      const Kh = Kw / Kb;
      const hPlus = Math.sqrt(Kh * ionM);
      const ph = -Math.log10(hPlus);
      const poh = 14 - ph;
      const alpha = Math.sqrt(Kh / ionM) * 100;

      return {
        nature: 'Asam (pH < 7)',
        ph: ph.toFixed(2).replace('.', ','),
        poh: poh.toFixed(2).replace('.', ','),
        hPlus: formatScientific(hPlus),
        ohMinus: formatScientific(Kw / hPlus),
        kh: formatScientific(Kh),
        alpha: alpha < 0.01 ? '< 0,01' : alpha.toFixed(3).replace('.', ','),
        badgeClass: 'acidic',
        explanation: `Kation basa lemah terhidrolisis mendonorkan proton ke air membentuk ion H₃O⁺ bebas. Karena Kb = ${formatScientific(Kb)}, nilai Kh = ${formatScientific(Kh)}.`,
        steps: [
          `Langkah 1 (Hitung Konsentrasi Kation): [Kation] = ${M} M × valensi ${v} = ${ionM.toFixed(3).replace('.', ',')} M`,
          `Langkah 2 (Tetapan Hidrolisis Kh): Kh = Kw / Kb = 10⁻¹⁴ / (${formatScientific(Kb)}) = ${formatScientific(Kh)}`,
          `Langkah 3 (Konsentrasi H⁺): [H⁺] = √(Kh × [Kation]) = √( (${formatScientific(Kh)}) × ${ionM} ) = ${formatScientific(hPlus)} M`,
          `Langkah 4 (Hitung pH): pH = -log(${formatScientific(hPlus)}) = ${ph.toFixed(2).replace('.', ',')}`,
        ],
      };
    }

    // lemah_lemah
    const hPlus = Math.sqrt((Kw * Ka) / Kb);
    const ph = -Math.log10(hPlus);
    const poh = 14 - ph;
    let natureStr = 'Netral (Ka = Kb)';
    let badge = 'neutral';
    if (Ka > Kb) {
      natureStr = 'Asam (Ka > Kb)';
      badge = 'acidic';
    } else if (Kb > Ka) {
      natureStr = 'Basa (Kb > Ka)';
      badge = 'basic';
    }

    return {
      nature: natureStr,
      ph: ph.toFixed(2).replace('.', ','),
      poh: poh.toFixed(2).replace('.', ','),
      hPlus: formatScientific(hPlus),
      ohMinus: formatScientific(Kw / hPlus),
      kh: formatScientific(Kw / (Ka * Kb)),
      alpha: 'Tergantung Ka & Kb',
      badgeClass: badge,
      explanation: 'Kedua ion kation dan anion sama-sama terhidrolisis. Nilai pH tidak dipengaruhi konsentrasi garam (M) dalam larutan encer.',
      steps: [
        `Langkah 1 (Bandingkan Ka & Kb): Ka = ${formatScientific(Ka)}, Kb = ${formatScientific(Kb)}`,
        `Langkah 2 (Hitung [H⁺]): [H⁺] = √(Kw × Ka / Kb) = √( 10⁻¹⁴ × (${formatScientific(Ka)}) / (${formatScientific(Kb)}) ) = ${formatScientific(hPlus)} M`,
        `Langkah 3 (Hitung pH): pH = -log(${formatScientific(hPlus)}) = ${ph.toFixed(2).replace('.', ',')}`,
        `Langkah 4 (Rumus Praktis): pH = 7 + ½(pKa - pKb) = 7 + ½(${-Math.log10(Ka).toFixed(2).replace('.', ',')} - ${-Math.log10(Kb).toFixed(2).replace('.', ',')}) = ${ph.toFixed(2).replace('.', ',')}`,
      ],
    };
  }, [calcSaltType, molarity, valence, kaInputVal, kbInputVal]);

  // Data 4 Jenis Garam
  const saltTypesData = {
    kuat_kuat: {
      title: '1. Garam dari Asam Kuat dan Basa Kuat',
      badge: 'Tidak Terhidrolisis • Netral',
      badgeColor: '#10B981',
      nature: 'Netral (pH = 7 pada 25°C)',
      lakmus: 'Lakmus Merah tetap Merah, Lakmus Biru tetap Biru',
      examples: 'NaCl, KCl, KNO₃, Na₂SO₄, BaCl₂, NaNO₃',
      origin: 'Asam Kuat (misal HCl, HNO₃, H₂SO₄) + Basa Kuat (misal NaOH, KOH)',
      dissociation: 'NaCl(s) ⎯⎯→ Na⁺(aq) + Cl⁻(aq)',
      hydrolysisReaction: 'Na⁺(aq) + H₂O(l) ⎯⎯→ Tidak bereaksi\nCl⁻(aq) + H₂O(l) ⎯⎯→ Tidak bereaksi',
      why: 'Kation Na⁺ dan anion Cl⁻ merupakan asam & basa konjugasi yang amat sangat lemah, sehingga afinitasnya terhadap ion H⁺ maupun OH⁻ dari molekul air sangat rendah. Kesetimbangan autoionisasi air tidak terganggu, sehingga [H⁺] = [OH⁻] = 1,0 × 10⁻⁷ M.',
      formulaKh: 'Kh = 0 (Tidak terhidrolisis)',
      formulaPh: 'pH = 7,00 (pada suhu 25°C)',
    },
    lemah_kuat: {
      title: '2. Garam dari Asam Lemah dan Basa Kuat',
      badge: 'Hidrolisis Parsial (Anion) • Basa',
      badgeColor: '#20B8AA',
      nature: 'Basa (pH > 7 pada 25°C)',
      lakmus: 'Lakmus Merah berubah menjadi BIRU, Lakmus Biru tetap Biru',
      examples: 'CH₃COONa, NaCN, KF, KNO₂, HCOONa, Ba(CH₃COO)₂',
      origin: 'Asam Lemah (misal CH₃COOH, HCN, HF) + Basa Kuat (misal NaOH, KOH)',
      dissociation: 'CH₃COONa(s) ⎯⎯→ Na⁺(aq) + CH₃COO⁻(aq)',
      hydrolysisReaction: 'Na⁺(aq) + H₂O(l) ⎯⎯→ Tidak bereaksi\nCH₃COO⁻(aq) + H₂O(l) ⇌ CH₃COOH(aq) + OH⁻(aq)',
      why: 'Anion CH₃COO⁻ berasal dari asam lemah CH₃COOH sehingga merupakan basa konjugasi yang relatif kuat. Anion ini mampu menarik proton (H⁺) dari molekul air dan menghasilkan ion OH⁻ bebas. Akibatnya, konsentrasi [OH⁻] bertambah sehingga larutan bersifat basa.',
      formulaKh: 'Kh = Kw / Ka',
      formulaPh: '[OH⁻] = √(Kh × [Anion]) = √( (Kw/Ka) × M_anion )\npOH = -log[OH⁻]  →  pH = 14 - pOH',
    },
    kuat_lemah: {
      title: '3. Garam dari Asam Kuat dan Basa Lemah',
      badge: 'Hidrolisis Parsial (Kation) • Asam',
      badgeColor: '#FF887A',
      nature: 'Asam (pH < 7 pada 25°C)',
      lakmus: 'Lakmus Biru berubah menjadi MERAH, Lakmus Merah tetap Merah',
      examples: 'NH₄Cl, (NH₄)₂SO₄, AlCl₃, FeSO₄, Zn(NO₃)₂',
      origin: 'Asam Kuat (misal HCl, H₂SO₄) + Basa Lemah (misal NH₃ / NH₄OH, Al(OH)₃)',
      dissociation: 'NH₄Cl(s) ⎯⎯→ NH₄⁺(aq) + Cl⁻(aq)',
      hydrolysisReaction: 'NH₄⁺(aq) + H₂O(l) ⇌ NH₃(aq) + H₃O⁺(aq)\nCl⁻(aq) + H₂O(l) ⎯⎯→ Tidak bereaksi',
      why: 'Kation NH₄⁺ berasal dari basa lemah NH₃ sehingga merupakan asam konjugasi yang cukup kuat. Kation ini mendonorkan proton ke molekul air menghasilkan ion hidronium (H₃O⁺). Peningkatan konsentrasi [H₃O⁺] menyebabkan larutan bersifat asam.',
      formulaKh: 'Kh = Kw / Kb',
      formulaPh: '[H⁺] = √(Kh × [Kation]) = √( (Kw/Kb) × M_kation )\npH = -log[H⁺]',
    },
    lemah_lemah: {
      title: '4. Garam dari Asam Lemah dan Basa Lemah',
      badge: 'Hidrolisis Total / Sempurna',
      badgeColor: '#A995F5',
      nature: 'Tergantung nilai perbandingan Ka dan Kb',
      lakmus: 'Ka > Kb (Merahkan lakmus biru) | Kb > Ka (Birukan lakmus merah)',
      examples: 'NH₄CH₃COO, NH₄CN, (NH₄)₂CO₃, Al₂(CO₃)₃',
      origin: 'Asam Lemah (misal CH₃COOH, HCN) + Basa Lemah (misal NH₃)',
      dissociation: 'NH₄CH₃COO(s) ⎯⎯→ NH₄⁺(aq) + CH₃COO⁻(aq)',
      hydrolysisReaction: 'NH₄⁺(aq) + H₂O(l) ⇌ NH₃(aq) + H₃O⁺(aq)\nCH₃COO⁻(aq) + H₂O(l) ⇌ CH₃COOH(aq) + OH⁻(aq)',
      why: 'Kedua ion (kation dan anion) sama-sama berasal dari spesi lemah sehingga keduanya terhidrolisis sekaligus dalam larutan. Sifat larutan ditentukan oleh pertarungan kekuatan Ka dan Kb: jika Ka > Kb bersifat asam, jika Kb > Ka bersifat basa, dan jika Ka = Kb bersifat netral.',
      formulaKh: 'Kh = Kw / (Ka × Kb)',
      formulaPh: '[H⁺] = √( (Kw × Ka) / Kb )\npH = 7 + ½(pKa - pKb)',
    },
  };

  // Johnstone Salt Details
  const johnstoneData = {
    NaCl: {
      name: 'Natrium Klorida (NaCl)',
      saltClass: 'Asam Kuat + Basa Kuat',
      macro: {
        obs: 'Larutan jernih tak berwarna, pH = 7,00 pada 25°C. Kertas lakmus merah tetap merah dan lakmus biru tetap biru.',
        colorTest: '#10B981',
      },
      submicro: {
        obs: 'Molekul H₂O hanya mengelilingi (menghidrasi) kation Na⁺ dan anion Cl⁻. Tidak ada transfer proton atau pemecahan molekul air.',
      },
      symbolic: {
        eq1: 'NaCl(s) ⎯⎯→ Na⁺(aq) + Cl⁻(aq)',
        eq2: 'Na⁺(aq) + Cl⁻(aq) + H₂O(l) ⎯⎯→ Tidak Terjadi Reaksi Hidrolisis',
      },
    },
    CH3COONa: {
      name: 'Natrium Asetat (CH₃COONa)',
      saltClass: 'Asam Lemah + Basa Kuat',
      macro: {
        obs: 'Larutan jernih, pH ~ 8,87 (basa). Mengubah kertas lakmus merah menjadi biru, dan memberikan warna merah muda pada indikator PP.',
        colorTest: '#20B8AA',
      },
      submicro: {
        obs: 'Anion asetat (CH₃COO⁻) bertindak sebagai akseptor proton, menarik ion H⁺ dari molekul H₂O. Terbentuk molekul CH₃COOH dan ion OH⁻ bebas yang melimpah.',
      },
      symbolic: {
        eq1: 'CH₃COONa(s) ⎯⎯→ Na⁺(aq) + CH₃COO⁻(aq)',
        eq2: 'CH₃COO⁻(aq) + H₂O(l) ⇌ CH₃COOH(aq) + OH⁻(aq)',
      },
    },
    NH4Cl: {
      name: 'Amonium Klorida (NH₄Cl)',
      saltClass: 'Asam Kuat + Basa Lemah',
      macro: {
        obs: 'Larutan jernih, pH ~ 5,12 (asam). Mengubah kertas lakmus biru menjadi merah, dan berwarna kuning cerah pada indikator metil merah.',
        colorTest: '#FF887A',
      },
      submicro: {
        obs: 'Kation amonium (NH₄⁺) bertindak sebagai donor proton, memberikan satu H⁺ kepada molekul air H₂O. Terbentuk molekul gas terlarut NH₃ dan ion hidronium H₃O⁺.',
      },
      symbolic: {
        eq1: 'NH₄Cl(s) ⎯⎯→ NH₄⁺(aq) + Cl⁻(aq)',
        eq2: 'NH₄⁺(aq) + H₂O(l) ⇌ NH₃(aq) + H₃O⁺(aq)',
      },
    },
    NH4CN: {
      name: 'Amonium Sianida (NH₄CN)',
      saltClass: 'Asam Lemah + Basa Lemah',
      macro: {
        obs: 'Larutan bersifat basa (pH ~ 9,23) karena Kb NH₃ (1,8×10⁻⁵) lebih besar daripada Ka HCN (6,2×10⁻¹⁰). Kertas lakmus merah menjadi biru.',
        colorTest: '#A995F5',
      },
      submicro: {
        obs: 'Kation NH₄⁺ dan anion CN⁻ sama-sama berinteraksi dengan H₂O. Karena CN⁻ lebih kuat menarik proton dibanding kemampuan NH₄⁺ mendonorkan proton, ion OH⁻ dihasilkan lebih banyak daripada H₃O⁺.',
      },
      symbolic: {
        eq1: 'NH₄CN(s) ⎯⎯→ NH₄⁺(aq) + CN⁻(aq)',
        eq2: 'NH₄⁺(aq) + CN⁻(aq) + H₂O(l) ⇌ NH₃(aq) + HCN(aq) + (OH⁻ berlebih)',
      },
    },
  };

  const curSalt = saltTypesData[selectedSaltType];
  const curJohnstone = johnstoneData[johnstoneSalt];

  return (
    <section className="materi-section" id="materi-hidrolisis" aria-labelledby="materi-heading">
      <div className="materi-container">
        {/* Section Header */}
        <div className="materi-header">
          <div className="materi-badge">
            <span>📚</span>
            <span>Kurikulum Merdeka • Pembelajaran Mendalam (Deep Learning) • Modul Lengkap Fase F</span>
          </div>
          <h2 id="materi-heading" className="materi-title">
            Materi Pembelajaran <span className="highlight-teal">Hidrolisis Garam</span>
          </h2>
          <p className="materi-subtitle">
            Pelajari konsep fundamental, 4 jenis garam, mekanisme Johnstone (makro-mikro-simbolik), perumusan tetapan Kh, serta kalkulasi pH interaktif tanpa miskonsepsi.
          </p>
        </div>

        {/* 6 Sub-Navigation Tabs */}
        <div className="materi-nav-tabs" role="tablist" aria-label="Tab Materi Hidrolisis">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'konsep'}
            className={`materi-tab-btn ${activeTab === 'konsep' ? 'active' : ''}`}
            onClick={() => setActiveTab('konsep')}
          >
            <span className="tab-icon">💡</span>
            <span>1. Pengertian & Konsep Dasar</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'jenis'}
            className={`materi-tab-btn ${activeTab === 'jenis' ? 'active' : ''}`}
            onClick={() => setActiveTab('jenis')}
          >
            <span className="tab-icon">🏷️</span>
            <span>2. Jenis-Jenis Garam</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'johnstone'}
            className={`materi-tab-btn ${activeTab === 'johnstone' ? 'active' : ''}`}
            onClick={() => setActiveTab('johnstone')}
          >
            <span className="tab-icon">🔬</span>
            <span>3. Tiga Level Johnstone</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'rumus'}
            className={`materi-tab-btn ${activeTab === 'rumus' ? 'active' : ''}`}
            onClick={() => setActiveTab('rumus')}
          >
            <span className="tab-icon">📐</span>
            <span>4. Rumus Kh & pH Lengkap</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'kalkulator'}
            className={`materi-tab-btn ${activeTab === 'kalkulator' ? 'active' : ''}`}
            onClick={() => setActiveTab('kalkulator')}
          >
            <span className="tab-icon">🧮</span>
            <span>5. Simulator Kalkulator pH</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'aplikasi'}
            className={`materi-tab-btn ${activeTab === 'aplikasi' ? 'active' : ''}`}
            onClick={() => setActiveTab('aplikasi')}
          >
            <span className="tab-icon">🌍</span>
            <span>6. Penerapan & Miskonsepsi</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="materi-card">
          {/* TAB 1: PENGERTIAN & KONSEP DASAR */}
          {activeTab === 'konsep' && (
            <div className="tab-pane animate-fadeIn">
              <div className="materi-subtopic-citation">
                <span className="citation-icon">📖</span> Sumber: Buku Kimia Kelas XI Kemendikbud
              </div>
              <div className="concept-grid">
                <div className="concept-box">
                  <div className="concept-box-header">
                    <div className="concept-icon-badge">🧂</div>
                    <h3 className="concept-box-title">Apa itu Garam?</h3>
                  </div>
                  <div className="concept-box-body">
                    Garam adalah senyawa ionik yang tersusun dari kation (ion positif) dan anion (ion negatif). Garam terbentuk melalui reaksi netralisasi antara asam dan basa, reaksi logam dengan asam, maupun oksida basa dengan asam.
                    <div className="concept-formula-pill">Asam + Basa ⎯⎯→ Garam + Air</div>
                  </div>
                </div>

                <div className="concept-box">
                  <div className="concept-box-header">
                    <div className="concept-icon-badge">💧</div>
                    <h3 className="concept-box-title">Pengertian Hidrolisis Garam</h3>
                  </div>
                  <div className="concept-box-body">
                    Berasal dari kata <em>hydro</em> (air) dan <em>lysis</em> (penguraian). <strong>Hidrolisis garam</strong> adalah reaksi kimia antara ion-ion garam (kation atau anion dari spesi lemah) dengan molekul air yang menghasilkan ion H₃O⁺ atau OH⁻ bebas sehingga mengubah pH larutan.
                    <div className="concept-formula-pill">Ion Garam(aq) + H₂O(l) ⇌ Produk + (H₃O⁺ / OH⁻)</div>
                  </div>
                </div>

                <div className="concept-box">
                  <div className="concept-box-header">
                    <div className="concept-icon-badge">⚖️</div>
                    <h3 className="concept-box-title">Autoionisasi Air & Nilai Kw</h3>
                  </div>
                  <div className="concept-box-body">
                    Air murni mengalami autoionisasi membentuk kesetimbangan dinamis: 2H₂O ⇌ H₃O⁺ + OH⁻. Pada temperatur standar 25°C, tetapan kesetimbangan air bernilai <strong>Kw = 1,0 × 10⁻¹⁴</strong>, sehingga pH + pOH = 14.
                    <div className="concept-formula-pill">Kw = [H₃O⁺][OH⁻] = 1,0 × 10⁻¹⁴ (25°C)</div>
                  </div>
                </div>

                <div className="concept-box">
                  <div className="concept-box-header">
                    <div className="concept-icon-badge">🔄</div>
                    <h3 className="concept-box-title">Pasangan Konjugasi Bronsted-Lowry</h3>
                  </div>
                  <div className="concept-box-body">
                    Kekuatan hidrolisis ditentukan oleh pasangan konjugasi: semakin lemah suatu asam/basa, semakin kuat basa/asam konjugasinya. Oleh sebab itu, hanya kation dari basa lemah dan anion dari asam lemah yang mampu bereaksi dengan air.
                    <div className="concept-formula-pill">Kh = Kw / Ka  (atau  Kh = Kw / Kb)</div>
                  </div>
                </div>
              </div>

              {/* Perbandingan Krusial: Pelarutan vs Hidrolisis */}
              <div className="comparison-box">
                <div className="comparison-header">
                  <span>💡</span>
                  <span>Pembeda Utama: Pelarutan (Dissolution) vs Hidrolisis (Hydrolysis)</span>
                </div>
                <div className="comparison-columns">
                  <div className="comparison-col dissolution">
                    <h4><span>🧊</span> 1. Pelarutan Garam (Fisik)</h4>
                    <p>
                      Peristiwa terpisahnya kisi kristal padatan garam menjadi ion-ion bebas yang dikelilingi oleh molekul-molekul air (proses hidrasi/solvasi). Tidak ada ikatan kovalen O-H dalam molekul air yang putus, dan jumlah [H⁺] serta [OH⁻] tetap seimbang.
                    </p>
                  </div>
                  <div className="comparison-col hydrolysis">
                    <h4><span>⚡</span> 2. Hidrolisis Garam (Reaksi Kimia)</h4>
                    <p>
                      Reaksi kimia nyata ketika ion garam memecah ikatan H-OH pada molekul air melalui transfer proton. Reaksi ini menghasilkan asam/basa konjugasi baru dan mengubah konsentrasi [H₃O⁺] atau [OH⁻], sehingga larutan memiliki sifat asam atau basa.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 4 JENIS GARAM LENGKAP */}
          {activeTab === 'jenis' && (
            <div className="tab-pane animate-fadeIn">
              <div className="materi-subtopic-citation">
                <span className="citation-icon">📖</span> Sumber: Chang, Chemistry Ch. 16
              </div>
              <div className="salt-type-selector">
                <button
                  type="button"
                  className={`salt-type-btn ${selectedSaltType === 'kuat_kuat' ? 'active' : ''}`}
                  onClick={() => setSelectedSaltType('kuat_kuat')}
                >
                  <span className="salt-type-badge" style={{ background: '#DCFCE7', color: '#166534' }}>
                    Netral
                  </span>
                  <span className="salt-type-name">Asam Kuat + Basa Kuat</span>
                  <span className="salt-type-ph">pH = 7,00 (Tidak terhidrolisis)</span>
                </button>

                <button
                  type="button"
                  className={`salt-type-btn ${selectedSaltType === 'lemah_kuat' ? 'active' : ''}`}
                  onClick={() => setSelectedSaltType('lemah_kuat')}
                >
                  <span className="salt-type-badge" style={{ background: '#CCFBF1', color: '#0F766E' }}>
                    Basa
                  </span>
                  <span className="salt-type-name">Asam Lemah + Basa Kuat</span>
                  <span className="salt-type-ph">pH &gt; 7 (Hidrolisis Anion)</span>
                </button>

                <button
                  type="button"
                  className={`salt-type-btn ${selectedSaltType === 'kuat_lemah' ? 'active' : ''}`}
                  onClick={() => setSelectedSaltType('kuat_lemah')}
                >
                  <span className="salt-type-badge" style={{ background: '#FEE2E2', color: '#991B1B' }}>
                    Asam
                  </span>
                  <span className="salt-type-name">Asam Kuat + Basa Lemah</span>
                  <span className="salt-type-ph">pH &lt; 7 (Hidrolisis Kation)</span>
                </button>

                <button
                  type="button"
                  className={`salt-type-btn ${selectedSaltType === 'lemah_lemah' ? 'active' : ''}`}
                  onClick={() => setSelectedSaltType('lemah_lemah')}
                >
                  <span className="salt-type-badge" style={{ background: '#F3E8FF', color: '#6B21A8' }}>
                    Ka vs Kb
                  </span>
                  <span className="salt-type-name">Asam Lemah + Basa Lemah</span>
                  <span className="salt-type-ph">Hidrolisis Total / Sempurna</span>
                </button>
              </div>

              {/* Salt Details Panel */}
              <div className="salt-detail-panel">
                <div className="salt-detail-header">
                  <div className="salt-detail-title-group">
                    <h3>{curSalt.title}</h3>
                    <div className="salt-detail-meta">
                      <span className="salt-origin-badge" style={{ background: curSalt.badgeColor + '20', color: curSalt.badgeColor }}>
                        {curSalt.badge}
                      </span>
                      <span style={{ fontSize: '0.88rem', color: '#64748B', fontWeight: 600 }}>
                        Sifat: <strong>{curSalt.nature}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="salt-grid-info">
                  <div className="salt-info-card">
                    <div className="salt-info-label">Asal Komponen Pembentuk</div>
                    <div className="salt-info-value">{curSalt.origin}</div>
                  </div>
                  <div className="salt-info-card">
                    <div className="salt-info-label">Contoh Senyawa Garam</div>
                    <div className="salt-info-value">{curSalt.examples}</div>
                  </div>
                  <div className="salt-info-card">
                    <div className="salt-info-label">Perubahan Kertas Lakmus</div>
                    <div className="salt-info-value">{curSalt.lakmus}</div>
                  </div>
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    1. Reaksi Ionisasi / Disosiasi Sempurna dalam Air:
                  </div>
                  <div className="chemical-equation-box">{curSalt.dissociation}</div>
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    2. Reaksi Kesetimbangan Hidrolisis dengan Molekul Air:
                  </div>
                  <div className="chemical-equation-box" style={{ whiteSpace: 'pre-line' }}>
                    {curSalt.hydrolysisReaction}
                  </div>
                </div>

                <div className="salt-info-card" style={{ marginTop: '16px', background: '#F0FDFA', border: '1px solid #CCFBF1' }}>
                  <div className="salt-info-label" style={{ color: '#0F766E' }}>Penjelasan Ilmiah Tanpa Miskonsepsi</div>
                  <div className="salt-info-value" style={{ color: '#134E4A' }}>{curSalt.why}</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TIGA LEVEL JOHNSTONE */}
          {activeTab === 'johnstone' && (
            <div className="tab-pane animate-fadeIn">
              <div className="johnstone-intro">
                <p>
                  Memahami kimia secara utuh membutuhkan integrasi <strong>Segitiga Johnstone (Johnstone's Triangle)</strong>: menghubungkan apa yang diamati di laboratorium (makroskopis), apa yang terjadi pada partikel atomik (submikroskopis), dan bagaimana dituliskan dalam rumus reaksi berimbang (simbolik).
                </p>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '14px', flexWrap: 'wrap' }}>
                  {Object.keys(johnstoneData).map((sKey) => (
                    <button
                      key={sKey}
                      type="button"
                      onClick={() => setJohnstoneSalt(sKey)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '10px',
                        border: johnstoneSalt === sKey ? '2px solid #0F766E' : '1px solid #CBD5E1',
                        background: johnstoneSalt === sKey ? '#0F766E' : '#FFFFFF',
                        color: johnstoneSalt === sKey ? '#FFFFFF' : '#334155',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {johnstoneData[sKey].name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="johnstone-triangle-grid">
                {/* Level 1: Makroskopis */}
                <div className="johnstone-card macro">
                  <span className="johnstone-level-tag">Tingkat 1 • Makroskopis</span>
                  <h4>Pengamatan Laboratorium Nyata</h4>
                  <p>{curJohnstone.macro.obs}</p>
                  <div className="johnstone-visual">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          background: curJohnstone.macro.colorTest,
                          boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                        }}
                      />
                      <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#334155' }}>
                        Warna Indikator pH Teruji
                      </span>
                    </div>
                  </div>
                </div>

                {/* Level 2: Submikroskopis */}
                <div className="johnstone-card submicro">
                  <span className="johnstone-level-tag">Tingkat 2 • Submikroskopis</span>
                  <h4>Dinamika Partikel & Transfer Proton</h4>
                  <p>{curJohnstone.submicro.obs}</p>
                  <div className="johnstone-visual" style={{ fontFamily: 'Fira Code', fontSize: '0.82rem', color: '#991B1B' }}>
                    Interaksi Transfer: [Ion Garam] ⇌ [H₂O Solvasi]
                  </div>
                </div>

                {/* Level 3: Simbolik */}
                <div className="johnstone-card symbolic">
                  <span className="johnstone-level-tag">Tingkat 3 • Simbolik</span>
                  <h4>Persamaan Reaksi & Notasi Kimia</h4>
                  <div style={{ marginTop: '10px' }}>
                    <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700 }}>Disosiasi Garam:</div>
                    <div style={{ fontFamily: 'Fira Code', fontSize: '0.86rem', color: '#4338CA', margin: '4px 0 10px 0' }}>
                      {curJohnstone.symbolic.eq1}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700 }}>Reaksi Kesetimbangan:</div>
                    <div style={{ fontFamily: 'Fira Code', fontSize: '0.86rem', color: '#0F766E' }}>
                      {curJohnstone.symbolic.eq2}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: RUMUS TETAPAN KH & PERHITUNGAN PH */}
          {activeTab === 'rumus' && (
            <div className="tab-pane animate-fadeIn">
              <div className="materi-subtopic-citation">
                <span className="citation-icon">📖</span> Sumber: Brown, Chemistry: The Central Science
              </div>
              <div className="formula-grid">
                {/* Rumus Garam Basa */}
                <div className="formula-card">
                  <div className="formula-card-header">
                    <h3 className="formula-card-title">Garam Asam Lemah + Basa Kuat</h3>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '3px 8px', borderRadius: '6px', background: '#CCFBF1', color: '#0F766E' }}>
                      Bersifat Basa
                    </span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 700 }}>1. Tetapan Hidrolisis Anion:</div>
                  <div className="formula-display">Kh = Kw / Ka</div>
                  <div style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 700 }}>2. Konsentrasi Ion Hidroksida:</div>
                  <div className="formula-display">[OH⁻] = √(Kh × [Anion]) = √( (Kw/Ka) × M_anion )</div>
                  <div style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 700 }}>3. Penentuan Nilai pH:</div>
                  <div className="formula-display">pOH = -log[OH⁻]  |  pH = 14 - pOH</div>
                  <div className="formula-notes">
                    💡 Contoh: Pada CH₃COONa, [Anion] = M_garam. Pada Ca(CH₃COO)₂, [Anion] = 2 × M_garam.
                  </div>
                </div>

                {/* Rumus Garam Asam */}
                <div className="formula-card">
                  <div className="formula-card-header">
                    <h3 className="formula-card-title">Garam Asam Kuat + Basa Lemah</h3>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '3px 8px', borderRadius: '6px', background: '#FEE2E2', color: '#991B1B' }}>
                      Bersifat Asam
                    </span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 700 }}>1. Tetapan Hidrolisis Kation:</div>
                  <div className="formula-display">Kh = Kw / Kb</div>
                  <div style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 700 }}>2. Konsentrasi Ion Hidronium:</div>
                  <div className="formula-display">[H⁺] = √(Kh × [Kation]) = √( (Kw/Kb) × M_kation )</div>
                  <div style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 700 }}>3. Penentuan Nilai pH:</div>
                  <div className="formula-display">pH = -log[H⁺]</div>
                  <div className="formula-notes">
                    💡 Contoh: Pada NH₄Cl, [Kation] = M_garam. Pada (NH₄)₂SO₄, [Kation] = 2 × M_garam.
                  </div>
                </div>

                {/* Rumus Garam Asam Lemah + Basa Lemah */}
                <div className="formula-card">
                  <div className="formula-card-header">
                    <h3 className="formula-card-title">Garam Asam Lemah + Basa Lemah</h3>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '3px 8px', borderRadius: '6px', background: '#F3E8FF', color: '#6B21A8' }}>
                      Total / Sempurna
                    </span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 700 }}>1. Tetapan Hidrolisis Total:</div>
                  <div className="formula-display">Kh = Kw / (Ka × Kb)</div>
                  <div style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 700 }}>2. Konsentrasi Ion H⁺:</div>
                  <div className="formula-display">[H⁺] = √( (Kw × Ka) / Kb )</div>
                  <div style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 700 }}>3. Rumus Praktis Nilai pH:</div>
                  <div className="formula-display">pH = 7 + ½(pKa - pKb)</div>
                  <div className="formula-notes">
                    💡 Perhatikan: Nilai pH garam jenis ini <strong>tidak bergantung pada konsentrasi garam (M)</strong> dalam larutan encer ideal!
                  </div>
                </div>

                {/* Rumus Derajat Hidrolisis */}
                <div className="formula-card">
                  <div className="formula-card-header">
                    <h3 className="formula-card-title">Derajat Hidrolisis (α)</h3>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '3px 8px', borderRadius: '6px', background: '#FEF3C7', color: '#92400E' }}>
                      Fraksi Terurai
                    </span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 700 }}>1. Untuk Hidrolisis Parsial:</div>
                  <div className="formula-display">α = √(Kh / [Ion]) = √(Kh / M)</div>
                  <div style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 700 }}>2. Untuk Hidrolisis Total:</div>
                  <div className="formula-display">α = √(Kh) / (1 + √(Kh)) ≈ √(Kh)</div>
                  <div className="formula-notes">
                    Persentase garam yang terhidrolisis dihitung dengan mengalikan nilai α dengan 100% (umumnya bernilai sangat kecil, &lt; 1%).
                  </div>
                </div>
              </div>

              {/* Valence Warning Box */}
              <div className="valence-warning-box">
                <div className="valence-icon">⚠️</div>
                <div className="valence-content">
                  <h4>Peringatan Penting: Faktor Valensi Kation dan Anion!</h4>
                  <p>
                    Jangan langsung memasukkan konsentrasi garam ke dalam rumus tanpa memeriksa indeks jumlah ionnya. Contoh: pada larutan <strong>(NH₄)₂SO₄ 0,05 M</strong>, karena setiap molekul garam melepaskan 2 ion NH₄⁺, maka konsentrasi kation <strong>[NH₄⁺] = 2 × 0,05 M = 0,1 M</strong>!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SIMULATOR KALKULATOR pH INTERAKTIF */}
          {activeTab === 'kalkulator' && (
            <div className="tab-pane animate-fadeIn">
              <div className="materi-subtopic-citation">
                <span className="citation-icon">📖</span> Sumber: Perhitungan menggunakan rumus standar Kh = Kw / Ka (atau Kw / Kb), Kw = 1,0 × 10⁻¹⁴ pada 25°C
              </div>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#183153', marginBottom: '8px' }}>
                  🎯 Pilih Contoh Preset Cepat untuk Demonstrasi:
                </div>
                <div className="calc-preset-btns">
                  <button type="button" className="calc-preset-btn" onClick={() => handleApplyPreset('ch3coona')}>
                    🧪 CH₃COONa 0,1 M (Basa)
                  </button>
                  <button type="button" className="calc-preset-btn" onClick={() => handleApplyPreset('nh4cl')}>
                    🧪 NH₄Cl 0,1 M (Asam)
                  </button>
                  <button type="button" className="calc-preset-btn" onClick={() => handleApplyPreset('nh4_2so4')}>
                    🧪 (NH₄)₂SO₄ 0,05 M (Valensi 2)
                  </button>
                  <button type="button" className="calc-preset-btn" onClick={() => handleApplyPreset('nh4cn')}>
                    🧪 NH₄CN 0,1 M (Ka vs Kb)
                  </button>
                  <button type="button" className="calc-preset-btn" onClick={() => handleApplyPreset('nacl')}>
                    🧪 NaCl 0,1 M (Netral)
                  </button>
                </div>
                <div className="materi-preset-note">
                  ℹ️ Nilai Ka/Kb yang dipakai adalah nilai standar pada 25°C dari buku teks. Jika soalmu memakai nilai berbeda, silakan ubah di kolom Ketik Sendiri.
                </div>
              </div>

              <div className="calculator-panel">
                {/* Inputs Area */}
                <div className="calculator-inputs">
                  <h4 style={{ margin: '0 0 16px 0', fontSize: '1.05rem', fontWeight: 800, color: '#183153' }}>
                    ⚙️ Parameter Larutan Garam
                  </h4>

                  <div className="calc-field-group">
                    <label className="calc-field-label">Tipe Pembentukan Garam:</label>
                    <select
                      className="calc-input"
                      value={calcSaltType}
                      onChange={(e) => setCalcSaltType(e.target.value)}
                    >
                      <option value="kuat_kuat">Asam Kuat + Basa Kuat (Netral)</option>
                      <option value="lemah_kuat">Asam Lemah + Basa Kuat (Basa)</option>
                      <option value="kuat_lemah">Asam Kuat + Basa Lemah (Asam)</option>
                      <option value="lemah_lemah">Asam Lemah + Basa Lemah (Total)</option>
                    </select>
                  </div>

                  <div className="calc-field-group">
                    <label className="calc-field-label">Konsentrasi Molaritas Garam (M):</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.001"
                      max="2"
                      className="calc-input"
                      value={molarity}
                      onChange={(e) => setMolarity(e.target.value)}
                    />
                  </div>

                  {calcSaltType !== 'lemah_lemah' && calcSaltType !== 'kuat_kuat' && (
                    <div className="calc-field-group">
                      <label className="calc-field-label">Valensi Ion yang Terhidrolisis (1 atau 2):</label>
                      <select
                        className="calc-input"
                        value={valence}
                        onChange={(e) => setValence(e.target.value)}
                      >
                        <option value="1">1 (Contoh: NH₄Cl, CH₃COONa)</option>
                        <option value="2">2 (Contoh: (NH₄)₂SO₄, Ca(CH₃COO)₂)</option>
                      </select>
                    </div>
                  )}

                  {/* Section Pilihan Cepat Ka / Kb (SMA-Friendly Controls) */}
                  {(calcSaltType === 'lemah_kuat' || calcSaltType === 'kuat_lemah' || calcSaltType === 'lemah_lemah') && (
                    <div style={{ marginBottom: '18px' }}>
                      <label className="calc-field-label" style={{ marginBottom: '8px' }}>
                        ⚡ Pilihan Preset Tetapan Ionisasi (Ka / Kb):
                      </label>
                      <div className="ka-kb-preset-bar">
                        <button
                          type="button"
                          className={`ka-kb-preset-btn ${ionPresetMode === 'cuka' ? 'active' : ''}`}
                          onClick={() => handleSelectIonPreset('cuka')}
                        >
                          <span>🍃</span>
                          <span>Asam Cuka - Ka 1,8 × 10⁻⁵</span>
                        </button>
                        <button
                          type="button"
                          className={`ka-kb-preset-btn ${ionPresetMode === 'amonia' ? 'active' : ''}`}
                          onClick={() => handleSelectIonPreset('amonia')}
                        >
                          <span>🧪</span>
                          <span>Amonia - Kb 1,8 × 10⁻⁵</span>
                        </button>
                        <button
                          type="button"
                          className={`ka-kb-preset-btn ${ionPresetMode === 'custom' ? 'active' : ''}`}
                          onClick={() => handleSelectIonPreset('custom')}
                        >
                          <span>✏️</span>
                          <span>Ketik Sendiri</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {(calcSaltType === 'lemah_kuat' || calcSaltType === 'lemah_lemah') && (
                    <div className="calc-field-group">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <label className="calc-field-label" style={{ margin: 0 }}>
                          Tetapan Ionisasi Asam Lemah (Ka):
                        </label>
                        {ionPresetMode !== 'custom' ? (
                          <span style={{ fontSize: '0.78rem', color: '#0F766E', fontWeight: 700 }}>
                            🔒 Nilai Terisi Otomatis
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
                            ✏️ Mode Ketik Bebas
                          </span>
                        )}
                      </div>

                      {/* Input Kolom Ka */}
                      <input
                        type="text"
                        className="calc-input"
                        value={kaInputVal}
                        onChange={(e) => setKaInputVal(e.target.value)}
                        disabled={ionPresetMode !== 'custom'}
                        style={{
                          backgroundColor: ionPresetMode !== 'custom' ? '#F1F5F9' : '#FFFFFF',
                          cursor: ionPresetMode !== 'custom' ? 'not-allowed' : 'text',
                        }}
                        placeholder="Contoh: 1.8e-5 atau 0.000018 atau 1,8 x 10^-5"
                      />

                      {/* Tampilan 2 Format Sekaligus (Format Utama & Format Bantu Desimal) */}
                      <div className="ka-kb-preview-card">
                        <div className="ka-kb-main-format">
                          <span className="ka-kb-symbol">Nilai Ka:</span>
                          <span className="ka-kb-value-highlight">
                            {formatScientific(parseIonVal(kaInputVal, 1.8e-5))}
                          </span>
                        </div>
                        <div className="ka-kb-decimal-helper">
                          Format Nilai Desimal: ({formatDecimal(parseIonVal(kaInputVal, 1.8e-5))})
                        </div>

                        {/* Indikator Bar Warna Lemah vs Cukup Kuat */}
                        <div className="ka-kb-strength-container">
                          <div className="strength-bar-track">
                            <div
                              className={`strength-bar-fill ${parseIonVal(kaInputVal, 1.8e-5) < 1e-4 ? 'weak' : 'moderate'}`}
                              style={{ width: parseIonVal(kaInputVal, 1.8e-5) < 1e-4 ? '45%' : '85%' }}
                            />
                          </div>
                          <div className="strength-status-row">
                            <span className="strength-label-text">Tingkat Kekuatan Asam Asal:</span>
                            {parseIonVal(kaInputVal, 1.8e-5) < 1e-4 ? (
                              <span className="strength-badge weak">
                                🟢 Lemah (Ka &lt; 10⁻⁴)
                              </span>
                            ) : (
                              <span className="strength-badge moderate">
                                🟠 Cukup Kuat (Ka &gt; 10⁻⁴)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Kotak Info Penjelasan Sederhana Bahasa Santai Anak SMA */}
                      <div className="ka-kb-info-callout">
                        <span className="info-callout-icon">💡</span>
                        <p className="info-callout-text">
                          Ka / Kb kecil = asam/basa lemah, sedikit yang terurai jadi ion. Semakin besar nilainya, semakin kuat.
                        </p>
                      </div>
                    </div>
                  )}

                  {(calcSaltType === 'kuat_lemah' || calcSaltType === 'lemah_lemah') && (
                    <div className="calc-field-group">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <label className="calc-field-label" style={{ margin: 0 }}>
                          Tetapan Ionisasi Basa Lemah (Kb):
                        </label>
                        {ionPresetMode !== 'custom' ? (
                          <span style={{ fontSize: '0.78rem', color: '#0F766E', fontWeight: 700 }}>
                            🔒 Nilai Terisi Otomatis
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
                            ✏️ Mode Ketik Bebas
                          </span>
                        )}
                      </div>

                      {/* Input Kolom Kb */}
                      <input
                        type="text"
                        className="calc-input"
                        value={kbInputVal}
                        onChange={(e) => setKbInputVal(e.target.value)}
                        disabled={ionPresetMode !== 'custom'}
                        style={{
                          backgroundColor: ionPresetMode !== 'custom' ? '#F1F5F9' : '#FFFFFF',
                          cursor: ionPresetMode !== 'custom' ? 'not-allowed' : 'text',
                        }}
                        placeholder="Contoh: 1.8e-5 atau 0.000018 atau 1,8 x 10^-5"
                      />

                      {/* Tampilan 2 Format Sekaligus (Format Utama & Format Bantu Desimal) */}
                      <div className="ka-kb-preview-card">
                        <div className="ka-kb-main-format">
                          <span className="ka-kb-symbol">Nilai Kb:</span>
                          <span className="ka-kb-value-highlight">
                            {formatScientific(parseIonVal(kbInputVal, 1.8e-5))}
                          </span>
                        </div>
                        <div className="ka-kb-decimal-helper">
                          Format Nilai Desimal: ({formatDecimal(parseIonVal(kbInputVal, 1.8e-5))})
                        </div>

                        {/* Indikator Bar Warna Lemah vs Cukup Kuat */}
                        <div className="ka-kb-strength-container">
                          <div className="strength-bar-track">
                            <div
                              className={`strength-bar-fill ${parseIonVal(kbInputVal, 1.8e-5) < 1e-4 ? 'weak' : 'moderate'}`}
                              style={{ width: parseIonVal(kbInputVal, 1.8e-5) < 1e-4 ? '45%' : '85%' }}
                            />
                          </div>
                          <div className="strength-status-row">
                            <span className="strength-label-text">Tingkat Kekuatan Basa Asal:</span>
                            {parseIonVal(kbInputVal, 1.8e-5) < 1e-4 ? (
                              <span className="strength-badge weak">
                                🟢 Lemah (Kb &lt; 10⁻⁴)
                              </span>
                            ) : (
                              <span className="strength-badge moderate">
                                🟠 Cukup Kuat (Kb &gt; 10⁻⁴)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Kotak Info Penjelasan Sederhana Bahasa Santai Anak SMA */}
                      <div className="ka-kb-info-callout">
                        <span className="info-callout-icon">💡</span>
                        <p className="info-callout-text">
                          Ka / Kb kecil = asam/basa lemah, sedikit yang terurai jadi ion. Semakin besar nilainya, semakin kuat.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Outputs & Step Breakdown */}
                <div className="calculator-outputs">
                  <div className={`calc-result-hero ${calcResult.badgeClass}`}>
                    <div>
                      <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 800, opacity: 0.9 }}>
                        Nilai pH Terhitung (25°C)
                      </div>
                      <div className="calc-ph-number">{calcResult.ph}</div>
                      <div className="calc-nature-title">{calcResult.nature}</div>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '0.88rem', lineHeight: 1.5 }}>
                      <div>pOH: <strong>{calcResult.poh}</strong></div>
                      <div>Kh: <strong>{calcResult.kh}</strong></div>
                      <div>Derajat α: <strong>{calcResult.alpha}%</strong></div>
                    </div>
                  </div>

                  <h4 style={{ margin: '0 0 12px 0', fontSize: '0.98rem', fontWeight: 800, color: '#183153' }}>
                    📝 Langkah Perhitungan Matematis Terperinci:
                  </h4>
                  <div className="calc-steps-list">
                    {calcResult.steps.map((step, idx) => (
                      <div key={idx} className="calc-step-item">
                        <div className="calc-step-num">Tahap {idx + 1}</div>
                        <div className="calc-step-math">{step}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: PENERAPAN KEHIDUPAN & ANTI-MISKONSEPSI */}
          {activeTab === 'aplikasi' && (
            <div className="tab-pane animate-fadeIn">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#183153', marginBottom: '16px' }}>
                🌾 Penerapan Hidrolisis Garam dalam Kehidupan Nyata
              </h3>
              <div className="apps-grid">
                <div className="app-item-card">
                  <div className="app-icon">🌱</div>
                  <h4>Pupuk Amonium Sulfat / ZA</h4>
                  <span className="app-salt-tag">(NH₄)₂SO₄ • Hidrolisis Kation</span>
                  <p>
                    Kation NH₄⁺ terhidrolisis menghasilkan ion H₃O⁺. Jika diberikan berlebihan tanpa pengapuran tanah, pH tanah pertanian akan turun menjadi asam, sehingga tanaman tertentu membutuhkan penambahan kapur dolomit untuk dinetralkan.
                  </p>
                </div>

                <div className="app-item-card">
                  <div className="app-icon">🚰</div>
                  <h4>Penjernihan Air Minum dengan Tawas</h4>
                  <span className="app-salt-tag">Al₂(SO₄)₃ • Hidrolisis Kation Al³⁺</span>
                  <p>
                    Ion Al³⁺ terhidrolisis hebat dalam air membentuk endapan gelatin Al(OH)₃: Al³⁺ + 3H₂O ⇌ Al(OH)₃(s) + 3H⁺. Endapan ini mengadsorpsi dan menggumpalkan partikel kotoran lumpur di dalam air hingga mengendap ke dasar.
                  </p>
                </div>

                <div className="app-item-card">
                  <div className="app-icon">🧁</div>
                  <h4>Baking Soda / Soda Kue</h4>
                  <span className="app-salt-tag">NaHCO₃ • Hidrolisis Anion Basa</span>
                  <p>
                    Anion hidrogen karbonat HCO₃⁻ mengalami hidrolisis parsial menghasilkan lingkungan basa lembut: HCO₃⁻ + H₂O ⇌ H₂CO₃ + OH⁻. Basa lembut ini membantu adonan mengembang dan sering digunakan sebagai antasida pereda sakit maag.
                  </p>
                </div>

                <div className="app-item-card">
                  <div className="app-icon">🧼</div>
                  <h4>Sabun Mandi & Pembersih</h4>
                  <span className="app-salt-tag">C₁₇H₃₅COONa (Natrium Stearat)</span>
                  <p>
                    Garam dari asam lemak lemah dan basa kuat NaOH. Anion karboksilat terhidrolisis menghasilkan ion OH⁻ bebas, menyebabkan larutan air sabun terasa licin di kulit dan bersifat basa lembut (pH 8 - 9).
                  </p>
                </div>

                <div className="app-item-card">
                  <div className="app-icon">🥫</div>
                  <h4>Pengawet Natrium Benzoat</h4>
                  <span className="app-salt-tag">C₆H₅COONa • Pengawet Makanan</span>
                  <p>
                    Garam dari asam benzoat (asam lemah) dan NaOH. Di dalam minuman sari buah berasam, anion benzoat berada dalam kesetimbangan untuk menghambat pertumbuhan mikroba dan kapang pembusuk makanan.
                  </p>
                </div>
              </div>

              {/* Misconception Buster Section */}
              <div className="misconception-section">
                <div className="misconception-title">
                  <span>🛡️</span>
                  <span>Kotak Pembasmi Miskonsepsi (Misconception Buster)</span>
                </div>
                <div className="misconception-grid">
                  <div className="misconception-card">
                    <div className="misconception-wrong">
                      <span>❌</span>
                      <strong>Miskonsepsi Siswa:</strong> "Semua garam rasanya asin dan larutannya pasti memiliki pH netral 7."
                    </div>
                    <div className="misconception-right">
                      <span>✅</span>
                      <strong>Fakta Ilmiah:</strong> Hanya garam dari asam kuat dan basa kuat yang netral (seperti NaCl). Garam dari asam lemah/basa lemah dapat bersifat asam (pH &lt; 7) atau basa (pH &gt; 7) tergantung ion yang terhidrolisis!
                    </div>
                  </div>

                  <div className="misconception-card">
                    <div className="misconception-wrong">
                      <span>❌</span>
                      <strong>Miskonsepsi Siswa:</strong> "Angka 7 adalah patokan mutlak larutan netral di segala kondisi."
                    </div>
                    <div className="misconception-right">
                      <span>✅</span>
                      <strong>Fakta Ilmiah:</strong> pH netral bernilai 7 secara khusus pada suhu 25°C (Kw = 1,0×10⁻¹⁴). Pada suhu 60°C, Kw meningkat sehingga air netral memiliki pH 6,51. Karakter netral murni berarti [H⁺] = [OH⁻].
                    </div>
                  </div>

                  <div className="misconception-card">
                    <div className="misconception-wrong">
                      <span>❌</span>
                      <strong>Miskonsepsi Siswa:</strong> "Semua ion garam habis bereaksi 100% dengan air."
                    </div>
                    <div className="misconception-right">
                      <span>✅</span>
                      <strong>Fakta Ilmiah:</strong> Reaksi hidrolisis adalah reaksi kesetimbangan dinamis bolak-balik (⇌) dengan derajat hidrolisis (α) sangat kecil (biasanya &lt; 1%). Sebagian besar ion garam tetap berada dalam bentuk ion bebas.
                    </div>
                  </div>

                  <div className="misconception-card">
                    <div className="misconception-wrong">
                      <span>❌</span>
                      <strong>Miskonsepsi Siswa:</strong> "Konsentrasi kation selalu sama persis dengan konsentrasi garam."
                    </div>
                    <div className="misconception-right">
                      <span>✅</span>
                      <strong>Fakta Ilmiah:</strong> Wajib memperhitungkan koefisien/valensi stoikiometri ion garam. Pada (NH₄)₂SO₄ 0,05 M, konsentrasi kation terhidrolisis adalah [NH₄⁺] = 2 × 0,05 M = 0,1 M.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
