import type { QuizQuestion } from '../types/quiz';

export const SOAL_VERSION = '1.0.0';

export const soalHidrolisisGaram: QuizQuestion[] = [
  {
    id: 'm1-q1',
    konsep: 'konsep-hidrolisis-garam',
    pertanyaan:
      'Hidrolisis garam merupakan reaksi antara ion-ion garam dengan air yang dapat memengaruhi pH larutan. Pernyataan yang tepat adalah ...',
    opsi: [
      { id: 'A', teks: 'Semua garam menghasilkan larutan netral.' },
      { id: 'B', teks: 'Ion-ion tertentu dari garam bereaksi dengan air sehingga memengaruhi pH.' },
      { id: 'C', teks: 'Semua ion garam menghasilkan ion H⁺.' },
      { id: 'D', teks: 'Hidrolisis hanya terjadi pada garam dari asam kuat dan basa kuat.' },
    ],
    jawabanBenar: 'B',
    pembahasan:
      'Hidrolisis garam terjadi ketika ion yang berasal dari asam lemah atau basa lemah bereaksi dengan air sehingga dapat mengubah pH larutan.',
  },
  {
    id: 'm1-q2',
    konsep: 'sifat-larutan-garam',
    pertanyaan:
      'Garam berikut yang menghasilkan larutan bersifat asam ketika dilarutkan dalam air adalah ...',
    opsi: [
      { id: 'A', teks: 'NaCl' },
      { id: 'B', teks: 'KNO₃' },
      { id: 'C', teks: 'CH₃COONa' },
      { id: 'D', teks: 'NH₄Cl' },
    ],
    jawabanBenar: 'D',
    pembahasan:
      'NH₄Cl berasal dari basa lemah NH₃ dan asam kuat HCl. Ion NH₄⁺ mengalami hidrolisis menghasilkan H₃O⁺ sehingga larutan bersifat asam.',
  },
  {
    id: 'm1-q3',
    konsep: 'hidrolisis-parsial-anion',
    pertanyaan:
      'Natrium asetat (CH₃COONa) dilarutkan dalam air. Ion yang mengalami hidrolisis adalah ...',
    opsi: [
      { id: 'A', teks: 'Na⁺' },
      { id: 'B', teks: 'CH₃COO⁻' },
      { id: 'C', teks: 'Na⁺ dan CH₃COO⁻' },
      { id: 'D', teks: 'Tidak ada ion yang mengalami hidrolisis.' },
    ],
    jawabanBenar: 'B',
    pembahasan:
      'CH₃COO⁻ berasal dari asam lemah CH₃COOH sehingga dapat bereaksi dengan air menghasilkan CH₃COOH dan OH⁻. Sementara itu, Na⁺ berasal dari basa kuat NaOH dan tidak mengalami hidrolisis.',
  },
  {
    id: 'm1-q4',
    konsep: 'hidrolisis-total',
    pertanyaan:
      'Garam NH₄CH₃COO berasal dari asam lemah CH₃COOH dan basa lemah NH₃. Jenis hidrolisis yang terjadi adalah ...',
    opsi: [
      { id: 'A', teks: 'Tidak mengalami hidrolisis' },
      { id: 'B', teks: 'Hidrolisis parsial anion' },
      { id: 'C', teks: 'Hidrolisis parsial kation' },
      { id: 'D', teks: 'Hidrolisis total' },
    ],
    jawabanBenar: 'D',
    pembahasan:
      'Garam dari asam lemah dan basa lemah mengalami hidrolisis total karena kation dan anionnya sama-sama bereaksi dengan air.',
  },
  {
    id: 'm1-q5',
    konsep: 'reaksi-hidrolisis-anion',
    pertanyaan:
      'Persamaan reaksi hidrolisis ion karbonat (CO₃²⁻) yang tepat adalah ...',
    opsi: [
      { id: 'A', teks: 'CO₃²⁻ + H₂O ⇌ HCO₃⁻ + OH⁻' },
      { id: 'B', teks: 'CO₃²⁻ + H₂O ⇌ H⁺ + HCO₃⁻' },
      { id: 'C', teks: 'CO₃²⁻ + H₂O ⇌ CO₂ + H₂' },
      { id: 'D', teks: 'CO₃²⁻ + H₂O ⇌ H₂CO₃ + H₃O⁺' },
    ],
    jawabanBenar: 'A',
    pembahasan:
      'Ion CO₃²⁻ merupakan basa konjugasi dari asam lemah H₂CO₃. Ion ini menerima proton dari air sehingga menghasilkan HCO₃⁻ dan OH⁻.',
  },
  {
    id: 'm1-q6',
    konsep: 'reaksi-hidrolisis-kation',
    pertanyaan:
      'Persamaan reaksi hidrolisis ion amonium (NH₄⁺) yang benar adalah ...',
    opsi: [
      { id: 'A', teks: 'NH₄⁺ + H₂O ⇌ NH₃ + OH⁻' },
      { id: 'B', teks: 'NH₄⁺ + H₂O ⇌ NH₃ + H₃O⁺' },
      { id: 'C', teks: 'NH₄⁺ + H₂O ⇌ NH₂⁻ + H₂' },
      { id: 'D', teks: 'NH₄⁺ + H₂O ⇌ NH₄OH + OH⁻' },
    ],
    jawabanBenar: 'B',
    pembahasan:
      'Ion NH₄⁺ bertindak sebagai asam konjugasi dari basa lemah NH₃. Ion ini memberikan proton kepada air sehingga terbentuk NH₃ dan H₃O⁺.',
  },
  {
    id: 'm1-q7',
    konsep: 'tetapan-hidrolisis',
    pertanyaan:
      'Diketahui Ka CH₃COOH = 10⁻⁵ dan Kw = 10⁻¹⁴. Nilai Kh untuk ion CH₃COO⁻ adalah ...',
    opsi: [
      { id: 'A', teks: '10⁻⁵' },
      { id: 'B', teks: '10⁻⁷' },
      { id: 'C', teks: '10⁻⁹' },
      { id: 'D', teks: '10⁻¹⁴' },
    ],
    jawabanBenar: 'C',
    pembahasan:
      'Tetapan hidrolisis anion dari asam lemah dihitung dengan Kh = Kw/Ka. Jadi, Kh = 10⁻¹⁴/10⁻⁵ = 10⁻⁹.',
  },
  {
    id: 'm1-q8',
    konsep: 'perhitungan-ph-garam',
    pertanyaan:
      'Larutan CH₃COONa memiliki konsentrasi 0,1 M. Jika Ka CH₃COOH = 10⁻⁵ dan Kw = 10⁻¹⁴, berapakah pH larutan tersebut?',
    opsi: [
      { id: 'A', teks: '5' },
      { id: 'B', teks: '7' },
      { id: 'C', teks: '9' },
      { id: 'D', teks: '12' },
    ],
    jawabanBenar: 'C', // Terverifikasi secara ilmiah: Kh = Kw/Ka = 10⁻⁹, [OH⁻] = √(Kh × C) = 10⁻⁵ M => pOH = 5 => pH = 14 - 5 = 9 (Opsi C)
    pembahasan:
      'Kh = Kw/Ka = 10⁻⁹. [OH⁻] = √(Kh × C) = √(10⁻⁹ × 10⁻¹) = 10⁻⁵ M. Jadi, pOH = 5 dan pH = 14 − 5 = 9. Dengan demikian, jawaban yang benar adalah C.',
  },
  {
    id: 'm1-q9',
    konsep: 'analisis-sifat-larutan',
    pertanyaan:
      'Larutan NH₄Cl bersifat asam, sedangkan CH₃COONa bersifat basa. Penyebab perbedaan sifat kedua larutan tersebut adalah ...',
    opsi: [
      { id: 'A', teks: 'NH₄Cl dan CH₃COONa tidak mengalami hidrolisis.' },
      { id: 'B', teks: 'NH₄⁺ menghasilkan H₃O⁺, sedangkan CH₃COO⁻ menghasilkan OH⁻ melalui hidrolisis.' },
      { id: 'C', teks: 'Kedua garam menghasilkan ion H₃O⁺ dalam jumlah sama.' },
      { id: 'D', teks: 'Semua ion penyusun kedua garam mengalami hidrolisis.' },
    ],
    jawabanBenar: 'B',
    pembahasan:
      'NH₄⁺ bereaksi dengan air menghasilkan H₃O⁺ sehingga larutan bersifat asam. Sebaliknya, CH₃COO⁻ bereaksi dengan air menghasilkan OH⁻ sehingga larutan bersifat basa.',
  },
  {
    id: 'm1-q10',
    konsep: 'penerapan-hidrolisis-garam',
    pertanyaan:
      'Tawas Al₂(SO₄)₃ digunakan dalam proses penjernihan air. Ion Al³⁺ mengalami hidrolisis dan menghasilkan H₃O⁺. Berdasarkan peristiwa tersebut, sifat larutan tawas adalah ...',
    opsi: [
      { id: 'A', teks: 'Asam' },
      { id: 'B', teks: 'Basa' },
      { id: 'C', teks: 'Netral' },
      { id: 'D', teks: 'Tidak dapat ditentukan' },
    ],
    jawabanBenar: 'A',
    pembahasan:
      'Ion Al³⁺ mengalami hidrolisis menghasilkan H₃O⁺ sehingga meningkatkan konsentrasi ion hidronium dan menyebabkan larutan bersifat asam.',
  },
];
