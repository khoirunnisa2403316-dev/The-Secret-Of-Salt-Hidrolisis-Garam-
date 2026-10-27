import { useState } from 'react';

export default function TopicCards() {
  const [activeTopic, setActiveTopic] = useState(null);
  const [quizState, setQuizState] = useState({});

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
        intro: 'Stoikiometri adalah jembatan utama untuk menghitung jumlah zat kimia. Dalam hidrolisis garam, stoikiometri digunakan untuk memastikan apakah kedua pereaksi (asam dan basa) tepat bereaksi habis menghasilkan garam murni.',
        example: 'Contoh: 100 mL HCl 0,1 M (10 mmol) direaksikan dengan 100 mL NaOH 0,1 M (10 mmol). Keduanya habis bereaksi membentuk 10 mmol NaCl dalam volume total 200 mL ([NaCl] = 0,05 M).',
        misconceptionTip: '💡 Hindari Miskonsepsi: Jika asam lemah atau basa lemah berlebih, yang terbentuk adalah larutan penyangga (buffer), bukan larutan hidrolisis murni!',
        quiz: {
          question: 'Jika 50 mL CH₃COOH 0,1 M dicampur dengan 50 mL NaOH 0,1 M, sistem apa yang terbentuk?',
          options: [
            { text: 'A. Larutan Penyangga (Buffer Asam)', isCorrect: false, feedback: 'Kurang tepat. Kedua pereaksi memiliki mol sama (5 mmol) sehingga keduanya habis bereaksi dan tidak ada asam lemah berlebih.' },
            { text: 'B. Larutan Garam Terhidrolisis (CH₃COONa)', isCorrect: true, feedback: 'Tepat sekali! Asam lemah dan basa kuat tepat habis bereaksi membentuk garam CH₃COONa yang terhidrolisis sebagian dan bersifat basa.' },
            { text: 'C. Larutan Asam Kuat Bebas', isCorrect: false, feedback: 'Tidak tepat. CH₃COOH adalah asam lemah dan dinetralkan sempurna oleh NaOH.' }
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
        intro: 'Reaksi asam dan basa selalu disertai pertukaran energi termal. Selain itu, tetapan ionisasi air (Kw) sangat sensitif terhadap perubahan temperatur lingkungan.',
        example: 'Pada 25°C, Kw = 1,0 × 10⁻¹⁴ (pH netral = 7). Namun pada 60°C, Kw meningkat menjadi ~9,6 × 10⁻¹⁴ sehingga pH netral bergeser ke ~6,51.',
        misconceptionTip: '💡 Hindari Miskonsepsi: Air murni pada suhu 60°C dengan pH 6,51 tetap NETRAL, bukan asam! Karena [H⁺] tetap sama dengan [OH⁻]. Jangan menganggap pH 7 adalah patokan mutlak di semua suhu!',
        quiz: {
          question: 'Mengapa pH air murni pada suhu 50°C bernilai kurang dari 7 (sekitar 6,63)?',
          options: [
            { text: 'A. Karena ionisasi air bersifat endoterm sehingga kenaikan suhu meningkatkan Kw dan [H⁺]', isCorrect: true, feedback: 'Tepat sekali! Reaksi autoionisasi air menyerap kalor (endoterm), sehingga pemanasan memperbanyak H⁺ dan OH⁻, membuat pH < 7 namun tetap netral.' },
            { text: 'B. Karena air berubah menjadi larutan asam klorida', isCorrect: false, feedback: 'Keliru. Air murni hanya mengandung molekul H₂O dan ion H⁺/OH⁻, tidak ada asam klorida.' },
            { text: 'C. Karena ion OH⁻ menghilang saat dipanaskan', isCorrect: false, feedback: 'Keliru. Jumlah ion OH⁻ justru meningkat sebanding dengan ion H⁺.' }
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
        intro: 'Konsep pasangan konjugasi Bronsted-Lowry adalah kunci memahami hidrolisis. Spesi konjugasi dari asam atau basa lemah memiliki afinitas cukup kuat untuk merebut atau mendonorkan proton dari/ke molekul air.',
        example: 'CH₃COO⁻ berasal dari asam lemah CH₃COOH, sehingga merupakan basa konjugasi yang relatif kuat untuk menarik H⁺ dari H₂O: CH₃COO⁻ + H₂O ⇌ CH₃COOH + OH⁻.',
        misconceptionTip: '💡 Hindari Miskonsepsi: Ion Na⁺ dari NaOH dan Cl⁻ dari HCl tidak mengalami hidrolisis karena merupakan asam/basa konjugasi yang sangat lemah di dalam air.',
        quiz: {
          question: 'Pada garam amonium nitrat (NH₄NO₃), ion manakah yang bereaksi dengan air (mengalami hidrolisis)?',
          options: [
            { text: 'A. Ion NO₃⁻ saja', isCorrect: false, feedback: 'Kurang tepat. NO₃⁻ berasal dari asam kuat HNO₃ sehingga tidak bereaksi dengan air.' },
            { text: 'B. Ion NH₄⁺ saja', isCorrect: true, feedback: 'Benar sekali! Kation NH₄⁺ berasal dari basa lemah NH₃, sehingga menghidrolisis air menghasilkan H₃O⁺ (larutan bersifat asam).' },
            { text: 'C. Kedua ion NH₄⁺ dan NO₃⁻', isCorrect: false, feedback: 'Keliru. Hanya ion dari komponen lemah yang terhidrolisis di dalam air.' }
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
            Klik setiap kartu untuk melihat ringkasan ilmiah dan kuis uji pemahaman!
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
                <div className="topic-icon-wrap">{t.icon}</div>
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
                      <span className="check-bullet">✓</span>
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
                <span className="btn-arrow">→</span>
              </button>
            </article>
          ))}
        </div>

        {/* Quick Help Strip */}
        <div className="prereq-banner">
          <div className="prereq-banner-content">
            <span className="banner-icon">💡</span>
            <div>
              <strong>Siap melanjutkan ke materi Hidrolisis Garam?</strong>
              <p>Setelah memahami ketiga pilar di atas, kamu dapat langsung menguji prediksi pH larutan di Lab Maya.</p>
            </div>
          </div>
          <a href="#lab-interaktif" className="btn-banner-action">
            🔬 Coba Lab Maya
          </a>
        </div>
      </div>

      {/* Modal Detail & Interactive Quiz */}
      {activeTopic && (
        <div className="modal-backdrop" onClick={() => setActiveTopic(null)} role="dialog" aria-modal="true">
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-row">
                <span className="modal-icon">{activeTopic.icon}</span>
                <div>
                  <h3 className="modal-title">{activeTopic.name}</h3>
                  <span className="modal-tag">{activeTopic.tag}</span>
                </div>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setActiveTopic(null)}
                aria-label="Tutup jendela informasi"
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-intro-card">
                <h4>📖 Penjelasan Konsep</h4>
                <p>{activeTopic.detail.intro}</p>
                <div className="modal-example-box">
                  <strong>Penerapan:</strong>
                  <p>{activeTopic.detail.example}</p>
                </div>
                <div className="modal-misconception-box">
                  <p>{activeTopic.detail.misconceptionTip}</p>
                </div>
              </div>

              {/* Interactive Mini Quiz per PRD poin 7 */}
              <div className="modal-quiz-section">
                <h4>🧠 Uji Pemahaman Cepat</h4>
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
                        <span className="opt-radio">{isSelected ? (opt.isCorrect ? '✓' : '✗') : '○'}</span>
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
                        ? '🎉 Jawaban Tepat!'
                        : '⚠️ Perhatikan Miskonsepsi:'}
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
                Tutup Ringkasan
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
