/**
 * Data Soal Quiz Esai Modul 1 (Hidrolisis Garam)
 * Sesuai ketentuan PRD, AGENTS.md, dan instruksi evaluasi sains
 */

export interface EssayRubricItem {
  deskripsi: string;
  poin: number;
}

export interface EssayQuestionData {
  id: string; // e.g. "esai-1"
  nomor: number;
  judul: string;
  konsep: string;
  pertanyaan: string;
  kunciJawaban: string;
  maxScore: number; // 20
  rubrik: EssayRubricItem[];
}

export const SOAL_ESAI_VERSION = '1.0.0';
export const TOTAL_SOAL_ESAI = 5;
export const MAX_SCORE_PER_ESAI = 20;
export const TOTAL_MAX_ESAI_SCORE = 100;

export const soalEsaiHidrolisisGaram: EssayQuestionData[] = [
  {
    id: 'esai-1',
    nomor: 1,
    judul: 'SOAL 1 – KONSEP HIDROLISIS GARAM',
    konsep: 'Konsep Dasar Hidrolisis Garam & Asal Pembentuk',
    pertanyaan:
      'Jelaskan apa yang dimaksud dengan hidrolisis garam. Mengapa suatu garam dapat menghasilkan larutan yang bersifat asam, basa, atau netral ketika dilarutkan dalam air? Jelaskan berdasarkan asal asam dan basa pembentuk garam tersebut!',
    kunciJawaban:
      'Hidrolisis garam merupakan reaksi antara ion-ion garam dengan air yang dapat menghasilkan ion H₃O⁺ atau OH⁻. Sifat larutan bergantung pada kekuatan relatif asam dan basa pembentuk garam. Garam dari asam kuat dan basa kuat umumnya netral, asam kuat dan basa lemah bersifat asam, sedangkan asam lemah dan basa kuat bersifat basa.',
    maxScore: 20,
    rubrik: [
      { deskripsi: 'Ketepatan pengertian hidrolisis', poin: 8 },
      { deskripsi: 'Penjelasan hubungan asam dan basa pembentuk garam', poin: 8 },
      { deskripsi: 'Kejelasan penjelasan', poin: 4 },
    ],
  },
  {
    id: 'esai-2',
    nomor: 2,
    judul: 'SOAL 2 – ANALISIS SIFAT LARUTAN',
    konsep: 'Klasifikasi Sifat Larutan Garam',
    pertanyaan:
      'Diketahui tiga garam berikut:\n- NaCl\n- NH₄Cl\n- CH₃COONa\n\nTentukan sifat larutan masing-masing garam (asam, basa, atau netral). Jelaskan alasanmu berdasarkan asal asam dan basa pembentuk setiap garam!',
    kunciJawaban:
      '- NaCl: netral, berasal dari HCl (asam kuat) dan NaOH (basa kuat).\n- NH₄Cl: asam, berasal dari HCl (asam kuat) dan NH₃ (basa lemah).\n- CH₃COONa: basa, berasal dari CH₃COOH (asam lemah) dan NaOH (basa kuat).',
    maxScore: 20,
    rubrik: [
      { deskripsi: 'Ketepatan klasifikasi NaCl', poin: 5 },
      { deskripsi: 'Ketepatan klasifikasi NH₄Cl', poin: 5 },
      { deskripsi: 'Ketepatan klasifikasi CH₃COONa', poin: 5 },
      { deskripsi: 'Alasan ilmiah', poin: 5 },
    ],
  },
  {
    id: 'esai-3',
    nomor: 3,
    judul: 'SOAL 3 – PERSAMAAN REAKSI HIDROLISIS',
    konsep: 'Persamaan Reaksi Ionisasi & Transfer Proton',
    pertanyaan:
      'Tuliskan persamaan reaksi hidrolisis ion NH₄⁺ dan CN⁻ ketika garam NH₄CN dilarutkan dalam air. Jelaskan peran masing-masing ion dalam menentukan sifat larutan!',
    kunciJawaban:
      'Hidrolisis ion NH₄⁺:\n\nNH₄⁺ + H₂O ⇌ NH₃ + H₃O⁺\n\nHidrolisis ion CN⁻:\n\nCN⁻ + H₂O ⇌ HCN + OH⁻\n\nNH₄⁺ berperan sebagai asam karena memberikan proton kepada air, sedangkan CN⁻ berperan sebagai basa karena menerima proton dari air.',
    maxScore: 20,
    rubrik: [
      { deskripsi: 'Persamaan hidrolisis NH₄⁺', poin: 7 },
      { deskripsi: 'Persamaan hidrolisis CN⁻', poin: 7 },
      { deskripsi: 'Penjelasan peran kedua ion', poin: 6 },
    ],
  },
  {
    id: 'esai-4',
    nomor: 4,
    judul: 'SOAL 4 – PERHITUNGAN pH',
    konsep: 'Kuantitatif pH Larutan Garam Terhidrolisis',
    pertanyaan:
      'Suatu larutan CH₃COONa memiliki konsentrasi 0,1 M. Jika diketahui Ka CH₃COOH = 10⁻⁵ dan Kw = 10⁻¹⁴, hitunglah:\n\na. Nilai Kb ion CH₃COO⁻.\nb. Konsentrasi ion OH⁻.\nc. Nilai pH larutan.\n\nTuliskan langkah-langkah perhitungan secara lengkap!',
    kunciJawaban:
      'Diketahui:\nC = 0,1 M\nKa = 10⁻⁵\nKw = 10⁻¹⁴\n\na. Menghitung Kb:\n\nKb = Kw / Ka\nKb = 10⁻¹⁴ / 10⁻⁵\nKb = 10⁻⁹\n\nb. Menghitung konsentrasi OH⁻:\n\n[OH⁻] = √(Kb × C)\n[OH⁻] = √(10⁻⁹ × 10⁻¹)\n[OH⁻] = √10⁻¹⁰\n[OH⁻] = 10⁻⁵ M\n\nc. Menghitung pH:\n\npOH = -log 10⁻⁵ = 5\npH = 14 - 5 = 9\n\nJadi, pH larutan adalah 9.',
    maxScore: 20,
    rubrik: [
      { deskripsi: 'Perhitungan Kb', poin: 5 },
      { deskripsi: 'Perhitungan OH⁻', poin: 7 },
      { deskripsi: 'Perhitungan pH', poin: 5 },
      { deskripsi: 'Langkah dan satuan', poin: 3 },
    ],
  },
  {
    id: 'esai-5',
    nomor: 5,
    judul: 'SOAL 5 – ANALISIS DAN PENALARAN',
    konsep: 'Analisis Kekuatan Relatif Ka dan Kb',
    pertanyaan:
      'Garam NH₄CN terbentuk dari asam lemah HCN dan basa lemah NH₃. Kedua ion penyusunnya dapat mengalami hidrolisis.\n\nJelaskan bagaimana kekuatan relatif kedua reaksi hidrolisis tersebut memengaruhi sifat larutan. Apakah larutan NH₄CN selalu bersifat netral? Berikan alasan ilmiahmu!',
    kunciJawaban:
      'NH₄⁺ mengalami hidrolisis menghasilkan H₃O⁺, sedangkan CN⁻ mengalami hidrolisis menghasilkan OH⁻.\n\nSifat larutan ditentukan oleh perbandingan Ka dari NH₄⁺ dan Kb dari CN⁻:\n- Jika Ka > Kb, larutan bersifat asam.\n- Jika Ka < Kb, larutan bersifat basa.\n- Jika Ka = Kb, larutan bersifat netral.\n\nJadi, NH₄CN tidak selalu bersifat netral. Sifatnya bergantung pada perbandingan kekuatan asam dan basa relatif kedua ion tersebut.',
    maxScore: 20,
    rubrik: [
      { deskripsi: 'Penjelasan hidrolisis NH₄⁺', poin: 5 },
      { deskripsi: 'Penjelasan hidrolisis CN⁻', poin: 5 },
      { deskripsi: 'Analisis perbandingan Ka dan Kb', poin: 7 },
      { deskripsi: 'Kesimpulan', poin: 3 },
    ],
  },
];
