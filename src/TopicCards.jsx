import { useState, useEffect } from 'react';

export default function TopicCards() {
  const [activeTopic, setActiveTopic] = useState(null);
  const [quizState, setQuizState] = useState({});

  // Close modal with Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveTopic(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const topics = [
    {
      id: 'stoikiometri',
      name: 'Stoikiometri',
      tag: 'Fondasi Kuantitatif',
      colorVar: 'var(--color-fresh-teal)',
      bgLight: 'var(--color-fresh-teal-light)',
      borderColor: '#20B8AA',
      icon: '⚖️',
      summary: 'Perhitungan mol, molaritas larutan, dan pereaksi pembatas dalam reaksi pembentukan garam.',
      whyImportant: 'Mengetahui apakah asam dan basa habis bereaksi untuk menghasilkan garam murni atau menghasilkan campuran buffer.',
      formula: 'n = M × V  |  [Garam] = n_garam / V_total',
      concepts: [
        'Konsep Mol & Konsentrasi Molaritas (M)',
        'Stoikiometri Reaksi Penggaraman Netralisasi',
        'Penentuan Pereaksi Pembatas (Limiting Reagent)',
      ],
      detail: {
        intro: 'Stoikiometri adalah jembatan kuantitatif utama kimia. Dalam hidrolisis garam, stoikiometri digunakan untuk memastikan apakah kedua pereaksi (asam dan basa) tepat bereaksi habis menghasilkan garam murni, atau menyisakan pereaksi lemah.',
        formulaExpl: 'Mol zat (n) dihitung dengan mengalikan molaritas (M) dan volume (V dalam Liter/mL). Pada titik ekuivalen: mol asam ekivalen = mol basa ekivalen.',
        example: 'Contoh Nyata: 100 mL HCl 0,1 M (10 mmol) direaksikan dengan 100 mL NaOH 0,1 M (10 mmol). Keduanya tepat habis bereaksi membentuk 10 mmol NaCl dalam volume total 200 mL ([NaCl] = 10 mmol / 200 mL = 0,05 M).',
        misconceptionTip: '💡 Hindari Miskonsepsi Fatal: Jika ada asam lemah atau basa lemah yang BERSISA (berlebih), larutan yang terbentuk adalah Larutan Penyangga (Buffer), BUKAN larutan hidrolisis garam murni!',
        quiz: {
          question: 'Jika 50 mL CH₃COOH 0,1 M dicampur dengan 50 mL NaOH 0,1 M, sistem larutan apa yang terbentuk?',
          options: [
            { text: 'A. Larutan Penyangga (Buffer Asam)', isCorrect: false, feedback: 'Kurang tepat. Kedua pereaksi memiliki mol sama (5 mmol) sehingga keduanya tepat habis bereaksi tanpa ada sisa asam lemah berlebih.' },
            { text: 'B. Larutan Garam Terhidrolisis (CH₃COONa)', isCorrect: true, feedback: 'Tepat sekali! Asam lemah dan basa kuat tepat habis bereaksi membentuk garam CH₃COONa yang mengalami hidrolisis parsial anion dan menghasilkan larutan basa (pH > 7).' },
            { text: 'C. Larutan Asam Kuat Bebas', isCorrect: false, feedback: 'Tidak tepat. CH₃COOH adalah asam lemah dan dinetralkan sempurna oleh NaOH menghasilkan garam dan air.' }
          ]
        }
      }
    },
    {
      id: 'termokimia',
      name: 'Termokimia',
      tag: 'Energetika & Suhu',
      colorVar: 'var(--color-coral)',
      bgLight: 'var(--color-coral-light)',
      borderColor: '#FF887A',
      icon: '🔥',
      summary: 'Perubahan entalpi reaksi netralisasi serta pengaruh suhu terhadap tetapan ionisasi air (Kw).',
      whyImportant: 'Memahami bahwa nilai pH netral 7 hanya berlaku pada 25°C, karena kesetimbangan disosiasi air dipengaruhi kalor.',
      formula: 'H⁺(aq) + OH⁻(aq) → H₂O(l)  (ΔH° = -57,1 kJ/mol)',
      concepts: [
        'Kalor Reaksi Netralisasi Asam-Basa (Eksoterm)',
        'Pengaruh Suhu terhadap Kesetimbangan Ionisasi Air (Kw)',
        'Pergeseran Kesetimbangan Hidrolisis Termal',
      ],
      detail: {
        intro: 'Reaksi asam dan basa selalu disertai pelepasan energi termal (eksoterm). Selain itu, reaksi autoionisasi air (2H₂O ⇌ H₃O⁺ + OH⁻) bersifat endotermik sehingga tetapan ionisasinya (Kw) sangat bergantung pada temperatur larutan.',
        formulaExpl: 'Pada 25°C: Kw = [H₃O⁺][OH⁻] = 1,0 × 10⁻¹⁴ → pH netral = -log(1,0 × 10⁻⁷) = 7,00. Pada suhu 60°C: Kw meningkat menjadi ~9,6 × 10⁻¹⁴ → pH netral = 6,51.',
        example: 'Contoh Eksperimen: Pemanasan air murni hingga 60°C menyebabkan nilai pH turun menjadi 6,51. Meski pH < 7, air tersebut tetap NETRAL karena konsentrasi [H₃O⁺] sama persis dengan [OH⁻].',
        misconceptionTip: '💡 Hindari Miskonsepsi Fatal: Jangan menganggap patokan pH netral adalah angka 7 di semua kondisi suhu! Angka 7 khusus pada suhu 25°C. Karakter "netral" murni ditentukan oleh kesetaraan [H₃O⁺] = [OH⁻].',
        quiz: {
          question: 'Mengapa pH air murni pada suhu 50°C bernilai kurang dari 7 (sekitar 6,63)?',
          options: [
            { text: 'A. Karena autoionisasi air bersifat endoterm sehingga kenaikan suhu menggeser kesetimbangan ke kanan, meningkatkan Kw dan [H⁺]', isCorrect: true, feedback: 'Tepat sekali! Autoionisasi air menyerap kalor (endoterm), sehingga pemanasan memperbanyak konsentrasi H₃O⁺ dan OH⁻ secara seimbang. Akibatnya pH < 7 namun sifat larutan tetap netral.' },
            { text: 'B. Karena air terurai menghasilkan gas asam klorida', isCorrect: false, feedback: 'Keliru. Air murni hanya mengandung molekul H₂O serta ion H⁺ dan OH⁻, tidak ada spesi asam klorida.' },
            { text: 'C. Karena ion OH⁻ menguap lebih dulu daripada ion H⁺', isCorrect: false, feedback: 'Keliru. Ion di dalam larutan tidak menguap seperti itu. Jumlah OH⁻ tetap sama dengan jumlah H⁺.' }
          ]
        }
      }
    },
    {
      id: 'larutan-asam-basa',
      name: 'Larutan Asam–Basa',
      tag: 'Karakter Ionik',
      colorVar: 'var(--color-soft-purple)',
      bgLight: 'var(--color-soft-purple-light)',
      borderColor: '#A995F5',
      icon: '🧪',
      summary: 'Teori Bronsted-Lowry, pasangan konjugasi, serta tetapan Ka dan Kb sebagai penentu hidrolisis.',
      whyImportant: 'Asal-usul komponen asam/basa dari suatu garam menentukan apakah kation atau anionnya mampu bereaksi dengan air.',
      formula: 'Kh = Kw / Ka  (garam asam lemah)  |  Kh = Kw / Kb',
      concepts: [
        'Kekuatan Relatif Asam/Basa Kuat vs Lemah',
        'Pasangan Asam-Basa Konjugasi (Bronsted-Lowry)',
        'Hubungan Ka, Kb, dan Tetapan Hidrolisis (Kh)',
      ],
      detail: {
        intro: 'Konsep pasangan konjugasi Bronsted-Lowry adalah kunci memahami reaksi hidrolisis. Spesi konjugasi dari asam lemah atau basa lemah memiliki reaktivitas cukup kuat untuk merebut atau mendonorkan proton dari/ke molekul air.',
        formulaExpl: 'Semakin lemah suatu asam (Ka makin kecil), semakin kuat basa konjugasinya (Kh = Kw/Ka makin besar). Hal yang sama berlaku pada basa lemah (Kh = Kw/Kb).',
        example: 'Contoh Reaksi: Anion CH₃COO⁻ berasal dari asam lemah CH₃COOH, sehingga merupakan basa konjugasi yang relatif kuat bereaksi dengan H₂O: CH₃COO⁻(aq) + H₂O(l) ⇌ CH₃COOH(aq) + OH⁻(aq). Sebaliknya, Cl⁻ dari HCl sangat lemah sehingga tidak bereaksi dengan air.',
        misconceptionTip: '💡 Hindari Miskonsepsi Fatal: Pelarutan garam adalah proses fisik solvasi ion oleh air. Sedangkan hidrolisis adalah reaksi kimia nyata antara ion dengan molekul air yang memecah ikatan H-OH dan mengubah pH!',
        quiz: {
          question: 'Pada larutan garam amonium nitrat (NH₄NO₃), ion manakah yang mengalami hidrolisis (bereaksi dengan air)?',
          options: [
            { text: 'A. Ion NO₃⁻ saja', isCorrect: false, feedback: 'Kurang tepat. Anion NO₃⁻ berasal dari asam kuat HNO₃ sehingga merupakan basa konjugasi yang sangat lemah dan tidak bereaksi dengan air.' },
            { text: 'B. Kation NH₄⁺ saja', isCorrect: true, feedback: 'Benar sekali! Kation NH₄⁺ berasal dari basa lemah NH₃, sehingga bereaksi dengan air mendonorkan proton: NH₄⁺ + H₂O ⇌ NH₃ + H₃O⁺ (membuat larutan bersifat asam).' },
            { text: 'C. Kedua ion NH₄⁺ dan NO₃⁻ terhidrolisis', isCorrect: false, feedback: 'Keliru. Ion dari komponen kuat tidak terhidrolisis di dalam larutan encer.' }
          ]
        }
      }
    }
  ];

  const handleSelectAnswer = (topicId, optIndex) => {
    setQuizState((prev) => ({
      ...prev,
      [topicId]: optIndex,
    }));
  };

  return (
    <section className="topics-section" id="topik-prasyarat" aria-labelledby="topics-heading">
      <div className="container">
        {/* Section Header */}
        <div className="section-header-center">
          <div className="badge-pill">
            <span>📚 Tiga Fondasi Utama</span>
          </div>
          <h2 id="topics-heading" className="section-title">
            3 Pilar Materi <span className="highlight-teal">Prasyarat Hidrolisis</span>
          </h2>
          <p className="section-subtitle">
            Kuasai ketiga konsep esensial ini sebelum masuk ke petualangan laboratorium hidrolisis garam.
            Klik setiap kartu untuk membuka ringkasan ilmiah terperinci dan uji pemahaman konsepmu!
          </p>
        </div>

        {/* 3 Topic Cards Grid */}
        <div className="topics-grid">
          {topics.map((t) => (
            <article
              key={t.id}
              className="topic-card"
              style={{
                '--card-theme': t.colorVar,
                '--card-theme-bg': t.bgLight,
                borderColor: t.borderColor,
              }}
            >
              {/* Card Header */}
              <div className="topic-card-top">
                <div className="topic-icon-wrap" aria-hidden="true">{t.icon}</div>
                <span className="topic-tag">{t.tag}</span>
              </div>

              {/* Title & Summary */}
              <h3 className="topic-title">{t.name}</h3>
              <p className="topic-summary">{t.summary}</p>

              {/* Formula snippet */}
              <div className="topic-formula-badge">
                <span className="formula-label">Rumus Inti:</span>
                <code>{t.formula}</code>
              </div>

              {/* Key Concept Bullets */}
              <div className="topic-concepts-list">
                <span className="concepts-header">Poin Penting:</span>
                <ul>
                  {t.concepts.map((concept, i) => (
                    <li key={i}>
                      <span className="check-bullet" aria-hidden="true">✓</span>
                      <span>{concept}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card Action Button */}
              <button
                type="button"
                className="btn-topic-action"
                onClick={() => {
                  setActiveTopic(t);
                  setQuizState({});
                }}
                aria-label={`Pelajari lebih lanjut tentang ${t.name}`}
              >
                <span>Pelajari Konsep & Kuis Mini</span>
                <span className="btn-arrow" aria-hidden="true">→</span>
              </button>
            </article>
          ))}
        </div>

        {/* Quick Help Strip */}
        <div className="prereq-banner">
          <div className="prereq-banner-content">
            <span className="banner-icon" aria-hidden="true">💡</span>
            <div>
              <strong>Siap melanjutkan ke materi Hidrolisis Garam?</strong>
              <p>Setelah memahami ketiga pilar di atas, kamu dapat langsung menguji prediksi pH larutan di Lab Maya.</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <a href="#lab-interaktif" className="btn-banner-action">
              🔬 Coba Lab Maya
            </a>
            <a href="#kuis-modul-1" className="btn-banner-action" style={{ background: 'var(--color-deep-navy)', color: '#FFFFFF' }}>
              📝 Kuis Modul 1
            </a>
          </div>
        </div>
      </div>

      {/* Modal Detail & Interactive Quiz */}
      {activeTopic && (
        <div
          className="modal-backdrop"
          onClick={() => setActiveTopic(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="topic-modal-title"
        >
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-row">
                <span className="modal-icon" aria-hidden="true">{activeTopic.icon}</span>
                <div>
                  <h3 id="topic-modal-title" className="modal-title">{activeTopic.name}</h3>
                  <span className="modal-tag">{activeTopic.tag}</span>
                </div>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setActiveTopic(null)}
                aria-label="Tutup jendela ringkasan materi"
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-intro-card">
                <h4>📖 Penjelasan Konsep Inti</h4>
                <p>{activeTopic.detail.intro}</p>

                <div className="modal-formula-box">
                  <span className="formula-box-label">Persamaan & Hubungan Kuantitatif:</span>
                  <code>{activeTopic.formula}</code>
                  <p className="formula-subtext">{activeTopic.detail.formulaExpl}</p>
                </div>

                <div className="modal-example-box">
                  <strong>Penerapan Nyata:</strong>
                  <p>{activeTopic.detail.example}</p>
                </div>

                <div className="modal-misconception-box">
                  <p>{activeTopic.detail.misconceptionTip}</p>
                </div>
              </div>

              {/* Interactive Mini Quiz per PRD poin 7 & AGENTS.md */}
              <div className="modal-quiz-section">
                <div className="quiz-header-row">
                  <h4>🧠 Uji Pemahaman Konsep</h4>
                  <span className="quiz-badge">1 Pertanyaan Cepat</span>
                </div>
                <p className="quiz-question">{activeTopic.detail.quiz.question}</p>

                <div className="quiz-options-list">
                  {activeTopic.detail.quiz.options.map((opt, idx) => {
                    const isSelected = quizState[activeTopic.id] === idx;
                    let optionClass = 'quiz-option-btn';
                    if (isSelected) {
                      optionClass += opt.isCorrect ? ' option-correct' : ' option-incorrect';
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        className={optionClass}
                        onClick={() => handleSelectAnswer(activeTopic.id, idx)}
                      >
                        <span className="opt-radio" aria-hidden="true">{isSelected ? (opt.isCorrect ? '✓' : '✗') : '○'}</span>
                        <span className="opt-text">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Feedback Panel */}
                {quizState[activeTopic.id] !== undefined && (
                  <div
                    className={`quiz-feedback-box ${
                      activeTopic.detail.quiz.options[quizState[activeTopic.id]].isCorrect
                        ? 'feedback-success'
                        : 'feedback-warning'
                    }`}
                  >
                    <strong>
                      {activeTopic.detail.quiz.options[quizState[activeTopic.id]].isCorrect
                        ? '🎉 Analisis Ilmiah Tepat!'
                        : '⚠️ Perhatikan Penjelasan Ilmiah:'}
                    </strong>
                    <p>{activeTopic.detail.quiz.options[quizState[activeTopic.id]].feedback}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-modal-dismiss"
                onClick={() => setActiveTopic(null)}
              >
                Tutup Ringkasan Materi
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

