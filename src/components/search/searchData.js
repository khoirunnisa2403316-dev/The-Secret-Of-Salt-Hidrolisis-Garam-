/**
 * Search Dataset for The Secret of Salt
 * Comprehensive index of all chemical concepts, hydrolysis types, formulas, simulations, quizzes, and applications.
 */

export const searchDatabase = [
  {
    id: 'konsep-dasar',
    title: 'Konsep Dasar Hidrolisis Garam',
    category: 'Konsep Fundamental',
    categoryIcon: '💡',
    description: 'Reaksi kimia antara ion-ion garam dengan molekul air yang memecah ikatan H-OH dan menghasilkan ion H₃O⁺ atau OH⁻ bebas.',
    keywords: ['konsep', 'hidrolisis', 'garam', 'pengertian', 'definisi', 'apa itu hidrolisis', 'arti hidrolisis', 'molekul air', 'reaksi kimia'],
    target: { type: 'tab', tab: 'konsep', elementId: 'materi-hidrolisis' }
  },
  {
    id: 'pengertian-hidrolisis',
    title: 'Pengertian Hidrolisis Garam & Autoionisasi Air (Kw)',
    category: 'Konsep Fundamental',
    categoryIcon: '💧',
    description: 'Berasal dari hydro (air) dan lysis (penguraian). Mengubah pH larutan melalui kesetimbangan air Kw = [H₃O⁺][OH⁻] = 1,0 × 10⁻¹⁴ pada 25°C.',
    keywords: ['pengertian', 'definisi', 'hydro', 'lysis', 'autoionisasi', 'air', 'kw', 'tetapan air', 'suhu 25'],
    target: { type: 'tab', tab: 'konsep', elementId: 'materi-hidrolisis' }
  },
  {
    id: 'pelarutan-vs-hidrolisis',
    title: 'Perbedaan Pelarutan Garam vs Hidrolisis Garam',
    category: 'Pembeda Kritis',
    categoryIcon: '⚡',
    description: 'Pelarutan hanya proses fisik pemisahan kisi kristal (solvasi). Hidrolisis adalah reaksi kimia pemutusan ikatan H-OH air.',
    keywords: ['pelarutan', 'dissolution', 'perbedaan', 'solvasi', 'hidrasi', 'hidrolisis vs pelarutan', 'reaksi kimia', 'proses fisik'],
    target: { type: 'tab', tab: 'konsep', elementId: 'materi-hidrolisis' }
  },
  {
    id: 'pasangan-konjugasi',
    title: 'Pasangan Konjugasi Bronsted-Lowry Penentu Hidrolisis',
    category: 'Teori Asam-Basa',
    categoryIcon: '🔄',
    description: 'Semakin lemah asam/basa asalnya, semakin kuat spesi konjugasinya. Hanya kation dari basa lemah dan anion dari asam lemah yang bereaksi dengan air.',
    keywords: ['konjugasi', 'bronsted', 'lowry', 'asam konjugasi', 'basa konjugasi', 'spesi lemah', 'transfer proton'],
    target: { type: 'tab', tab: 'konsep', elementId: 'materi-hidrolisis' }
  },
  {
    id: 'jenis-hidrolisis-overview',
    title: '4 Jenis Karakteristik Hidrolisis Garam Lengkap',
    category: 'Klasifikasi Garam',
    categoryIcon: '🏷️',
    description: 'Klasifikasi 4 jenis garam: tidak terhidrolisis (netral), hidrolisis parsial kation (asam), hidrolisis parsial anion (basa), dan hidrolisis total.',
    keywords: ['jenis', 'klasifikasi', '4 jenis', 'macam garam', 'tipe hidrolisis', 'sifat larutan garam', 'jenis-jenis hidrolisis garam'],
    target: { type: 'tab', tab: 'jenis', saltType: 'lemah_kuat', elementId: 'materi-hidrolisis' }
  },
  {
    id: 'garam-kuat-kuat',
    title: 'Garam Asam Kuat & Basa Kuat: NaCl (Tidak Terhidrolisis)',
    category: 'Jenis Garam (pH = 7)',
    categoryIcon: '🟢',
    description: 'Contoh: NaCl, KCl, K₂SO₄. Kation dan anion konjugasi sangat lemah sehingga tidak bereaksi dengan air. pH larutan netral (pH = 7 pada 25°C).',
    keywords: ['asam kuat basa kuat', 'asam kuat dan basa kuat', 'nacl', 'kcl', 'k2so4', 'netral', 'ph 7', 'tidak terhidrolisis', 'garam netral', 'natrium klorida'],
    target: { type: 'tab', tab: 'jenis', saltType: 'kuat_kuat', elementId: 'materi-hidrolisis' }
  },
  {
    id: 'garam-kuat-lemah',
    title: 'Garam Asam Kuat & Basa Lemah: NH₄Cl (Hidrolisis Parsial Kation)',
    category: 'Jenis Garam (pH < 7, Asam)',
    categoryIcon: '🔴',
    description: 'Contoh: NH₄Cl, (NH₄)₂SO₄, AlCl₃. Kation NH₄⁺ mendonorkan proton ke air menghasilkan H₃O⁺. Sifat asam (pH < 7). Rumus: [H⁺] = √(Kw/Kb × [Kation]).',
    keywords: ['asam kuat basa lemah', 'asam kuat dan basa lemah', 'nh4cl', 'amonium klorida', 'alcl3', 'asam', 'ph < 7', 'hidrolisis parsial', 'kation', 'h3o+'],
    target: { type: 'tab', tab: 'jenis', saltType: 'kuat_lemah', elementId: 'materi-hidrolisis' }
  },
  {
    id: 'garam-lemah-kuat',
    title: 'Garam Asam Lemah & Basa Kuat: CH₃COONa (Hidrolisis Parsial Anion)',
    category: 'Jenis Garam (pH > 7, Basa)',
    categoryIcon: '🔵',
    description: 'Contoh: CH₃COONa, NaCN, KF. Anion CH₃COO⁻ menarik proton dari air menghasilkan OH⁻. Sifat basa (pH > 7). Rumus: [OH⁻] = √(Kw/Ka × [Anion]).',
    keywords: ['asam lemah basa kuat', 'asam lemah dan basa kuat', 'ch3coona', 'natrium asetat', 'nacn', 'kf', 'basa', 'ph > 7', 'hidrolisis parsial', 'anion', 'oh-'],
    target: { type: 'tab', tab: 'jenis', saltType: 'lemah_kuat', elementId: 'materi-hidrolisis' }
  },
  {
    id: 'garam-lemah-lemah',
    title: 'Garam Asam Lemah & Basa Lemah: NH₄CN (Hidrolisis Total)',
    category: 'Jenis Garam (Total/Sempurna)',
    categoryIcon: '🟣',
    description: 'Contoh: NH₄CN, CH₃COONH₄. Kation dan anion bereaksi bersamaan dengan air. Sifat pH ditentukan perbandingan Ka dan Kb: [H⁺] = √(Kw × Ka / Kb).',
    keywords: ['asam lemah basa lemah', 'asam lemah dan basa lemah', 'nh4cn', 'ch3coonh4', 'hidrolisis total', 'hidrolisis sempurna', 'ka kb', 'perbandingan ka kb'],
    target: { type: 'tab', tab: 'jenis', saltType: 'lemah_lemah', elementId: 'materi-hidrolisis' }
  },
  {
    id: 'rumus-kh-alfa',
    title: 'Rumus Tetapan Kh, Derajat Hidrolisis (α), & Hubungan Ka/Kb',
    category: 'Rumus & Perhitungan',
    categoryIcon: '📐',
    description: 'Perumusan Kh = Kw/Ka, Kh = Kw/Kb, serta Kh = Kw/(Ka×Kb). Perhitungan derajat hidrolisis α = √(Kh / M_garam).',
    keywords: ['rumus', 'kh', 'tetapan hidrolisis', 'alfa', 'derajat hidrolisis', 'persamaan', 'matematis', 'hitung kh'],
    target: { type: 'tab', tab: 'rumus', elementId: 'materi-hidrolisis' }
  },
  {
    id: 'rumus-ph-lengkap',
    title: 'Rumus Perhitungan pH Garam Terhidrolisis & Valensi Ion',
    category: 'Rumus & Perhitungan',
    categoryIcon: '📊',
    description: 'Perhitungan pH = -log[H⁺] atau pH = 14 - pOH. Perhatikan valensi ion garam seperti (NH₄)₂SO₄ dengan [NH₄⁺] = 2 × Molaritas.',
    keywords: ['rumus ph', 'hitung ph', 'perhitungan ph', 'poh', 'valensi', 'koefisien', 'konsentrasi ion', 'molaritas', 'rumus dan perhitungan ph'],
    target: { type: 'tab', tab: 'rumus', elementId: 'materi-hidrolisis' }
  },
  {
    id: 'simulator-kalkulator-ph',
    title: 'Simulator Kalkulator Perhitungan pH Garam Interaktif',
    category: 'Alat Simulasi',
    categoryIcon: '🧮',
    description: 'Kalkulator digital untuk menghitung pH larutan garam otomatis dengan langkah bertahap: penentuan jenis garam, rumus [H⁺]/[OH⁻], dan nilai akhir pH.',
    keywords: ['kalkulator', 'simulator', 'kalkulator ph', 'hitung otomatis', 'alat hitung', 'angka', 'molaritas garam', 'perhitungan ph'],
    target: { type: 'tab', tab: 'kalkulator', elementId: 'materi-hidrolisis' }
  },
  {
    id: 'segitiga-johnstone',
    title: 'Model Representasi Segitiga Johnstone (Makro, Submikro, Simbolik)',
    category: 'Representasi Kimia',
    categoryIcon: '🔬',
    description: 'Visualisasi fenomena makroskopis (warna lakmus/indikator), pemodelan submikroskopis ion bebas dalam air, dan persamaan reaksi simbolik berimbang.',
    keywords: ['johnstone', 'makroskopis', 'submikroskopis', 'simbolik', 'segitiga johnstone', 'tiga level', 'representasi', 'mikro', 'partikel'],
    target: { type: 'tab', tab: 'johnstone', elementId: 'materi-hidrolisis' }
  },
  {
    id: 'lab-maya-beaker',
    title: 'Laboratorium Maya Beaker Simulasi Partikel Ionik',
    category: 'Lab Virtual',
    categoryIcon: '🧪',
    description: 'Uji garam NaCl, NH₄Cl, CH₃COONa, NH₄CN langsung di gelas kimia beaker virtual. Amati partikel mengapung dan pembacaan pH meter digital.',
    keywords: ['lab maya', 'virtual lab', 'beaker', 'gelas kimia', 'simulasi partikel', 'partikel ion', 'ion mengapung', 'suhu 60', 'eksperimen'],
    target: { type: 'scroll', elementId: 'lab-interaktif' }
  },
  {
    id: 'prasyarat-stoikiometri',
    title: 'Topik Prasyarat 1: Stoikiometri & Penentuan Pereaksi Pembatas',
    category: 'Pilar Prasyarat',
    categoryIcon: '⚖️',
    description: 'Perhitungan mol n = M × V untuk memastikan pereaksi habis bereaksi menghasilkan garam murni tanpa sisa pereaksi buffer.',
    keywords: ['stoikiometri', 'prasyarat', 'mol', 'pereaksi pembatas', 'molaritas', 'titik ekuivalen', 'buffer vs garam', 'massa'],
    target: { type: 'scroll', elementId: 'topik-prasyarat' }
  },
  {
    id: 'prasyarat-termokimia',
    title: 'Topik Prasyarat 2: Termokimia & Pengaruh Suhu terhadap Kw',
    category: 'Pilar Prasyarat',
    categoryIcon: '🔥',
    description: 'Kalor reaksi netralisasi eksoterm dan pengaruh temperatur pada kesetimbangan ionisasi air (Kw). Memahami pH netral 7 hanya pada 25°C.',
    keywords: ['termokimia', 'suhu', 'kalor netralisasi', 'eksoterm', 'endoterm', 'suhu 60 derajat', 'kw air', 'entalpi', 'suhu 25'],
    target: { type: 'scroll', elementId: 'topik-prasyarat' }
  },
  {
    id: 'prasyarat-asam-basa',
    title: 'Topik Prasyarat 3: Larutan Asam-Basa & Tetapan Ka/Kb',
    category: 'Pilar Prasyarat',
    categoryIcon: '🧪',
    description: 'Kekuatan relatif asam kuat vs asam lemah, basa kuat vs basa lemah, serta nilai tetapan ionisasi Ka dan Kb sebagai dasar reaksi hidrolisis.',
    keywords: ['asam basa', 'ka', 'kb', 'asam lemah', 'basa lemah', 'asam kuat', 'basa kuat', 'derajat ionisasi'],
    target: { type: 'scroll', elementId: 'topik-prasyarat' }
  },
  {
    id: 'aplikasi-hidrolisis',
    title: 'Penerapan Hidrolisis dalam Kehidupan (Tawas, Pupuk, Soda Kue)',
    category: 'Penerapan Nyata',
    categoryIcon: '🌍',
    description: 'Contoh nyata: Tawas Al₂(SO₄)₃ untuk penjernihan air, pupuk ZA (NH₄)₂SO₄ pada tanah alkalis, soda kue NaHCO₃, dan baking powder.',
    keywords: ['aplikasi', 'kehidupan sehari-hari', 'tawas', 'penjernih air', 'pupuk za', 'soda kue', 'nahco3', 'baking powder', 'tanah', 'penerapan'],
    target: { type: 'tab', tab: 'aplikasi', elementId: 'materi-hidrolisis' }
  },
  {
    id: 'pembasmi-miskonsepsi',
    title: 'Kotak Pembasmi Miskonsepsi Kimia (Misconception Buster)',
    category: 'Pencegahan Miskonsepsi',
    categoryIcon: '🛡️',
    description: 'Klarifikasi ilmiah: pH netral tidak selalu 7 (bergantung suhu), derajat hidrolisis sangat kecil (tidak 100%), dan perbedaan pelarutan vs hidrolisis.',
    keywords: ['miskonsepsi', 'salah paham', 'pembasmi miskonsepsi', 'fakta ilmiah', 'cegah miskonsepsi', 'suhu 25 vs 60', 'pelarutan vs hidrolisis'],
    target: { type: 'tab', tab: 'aplikasi', elementId: 'materi-hidrolisis' }
  },
  {
    id: 'kuis-pilihan-ganda',
    title: 'Kuis Pilihan Ganda (10 Soal) dengan Pembahasan Lengkap',
    category: 'Evaluasi & Latihan Soal',
    categoryIcon: '📝',
    description: '10 butir soal pilihan ganda formatif bertingkat HOTS dengan penjelasan ilmiah dan feedback langsung di setiap jawaban.',
    keywords: ['contoh soal', 'soal', 'pembahasan', 'kuis', 'pilihan ganda', 'latihan soal', 'evaluasi', '10 soal', 'pg', 'contoh soal dan pembahasan'],
    target: { type: 'scroll', elementId: 'kuis-modul-1' }
  },
  {
    id: 'kuis-esai',
    title: 'Kuis Esai (5 Soal Analisis Reaksi & Perhitungan)',
    category: 'Evaluasi & Latihan Soal',
    categoryIcon: '✍️',
    description: '5 soal esai analitis mencakup prediksi sifat garam, reaksi hidrolisis berimbang, perhitungan pH garam bivalen, dan fenomena pemanasan.',
    keywords: ['kuis esai', 'soal esai', 'esai', 'uraian', '5 soal esai', 'analisis reaksi', 'pembahasan esai', 'soal dan pembahasan'],
    target: { type: 'scroll', elementId: 'kuis-modul-1' }
  },
  {
    id: 'referensi-akademik',
    title: 'Sumber Materi, Buku Teks Kemendikbud & Jurnal Kimia',
    category: 'Kepustakaan',
    categoryIcon: '📚',
    description: 'Rujukan resmi Buku Kimia SMA Kelas XI Kurikulum Merdeka, Raymond Chang Chemistry 12th Ed, dan Brown Chemistry Central Science.',
    keywords: ['referensi', 'sumber materi', 'buku', 'chang', 'kemendikbud', 'kurikulum merdeka', 'pustaka', 'daftar pustaka'],
    target: { type: 'scroll', elementId: 'tentang' }
  }
];

/**
 * Perform relevance search over database
 * @param {string} query
 * @returns {Array} List of matched search results sorted by relevance
 */
export function searchContent(query) {
  if (!query || typeof query !== 'string') return [];
  const clean = query.trim().toLowerCase();
  if (clean.length === 0) return [];

  const tokens = clean.split(/\s+/).filter(Boolean);

  const scoredResults = searchDatabase.map((item) => {
    let score = 0;
    const titleLower = item.title.toLowerCase();
    const catLower = item.category.toLowerCase();
    const descLower = item.description.toLowerCase();
    const keywordsJoined = item.keywords.join(' ').toLowerCase();

    // Exact title match gets highest priority
    if (titleLower.includes(clean)) {
      score += 50;
      if (titleLower.startsWith(clean)) score += 20;
    }

    // Category match
    if (catLower.includes(clean)) {
      score += 30;
    }

    // Keywords match
    if (keywordsJoined.includes(clean)) {
      score += 25;
    }

    // Description match
    if (descLower.includes(clean)) {
      score += 15;
    }

    // Token-level scoring
    let allTokensPresent = true;
    for (const token of tokens) {
      const inTitle = titleLower.includes(token);
      const inCat = catLower.includes(token);
      const inKey = keywordsJoined.includes(token);
      const inDesc = descLower.includes(token);

      if (inTitle || inCat || inKey || inDesc) {
        if (inTitle) score += 10;
        if (inCat) score += 6;
        if (inKey) score += 5;
        if (inDesc) score += 3;
      } else {
        allTokensPresent = false;
      }
    }

    if (allTokensPresent && tokens.length > 1) {
      score += 20;
    }

    return { item, score };
  });

  return scoredResults
    .filter((res) => res.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((res) => res.item);
}
