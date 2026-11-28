export const TOUR_STORAGE_KEY = 'the_secret_of_salt_tour_completed';

export function startOnboardingTour() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('open-onboarding-tour'));
  }
}

export interface TourStep {
  id: string;
  target: string; // CSS Selector of the element to highlight
  title: string;
  stepBadge: string;
  icon: string;
  description: string;
  tip?: string;
  preferredPosition?: 'top' | 'bottom' | 'center';
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: 'beranda',
    target: '#beranda-hero-content',
    title: 'Selamat Datang di The Secret of Salt! 🧪',
    stepBadge: 'Langkah 1 dari 7',
    icon: '🏠',
    description:
      'Media pembelajaran kimia interaktif SMA/MA Kelas XI Fase F. Di sini kamu akan mengungkap rahasia sifat larutan garam (asam, basa, atau netral) berdasarkan reaksi transfer proton ion dengan molekul air.',
    tip: 'Amati fenomena rasa ingin tahu untuk memahami mengapa pupuk NH₄Cl bersifat asam, sedangkan garam dapur NaCl bersifat netral!',
    preferredPosition: 'bottom',
  },
  {
    id: 'topik-prasyarat',
    target: '#topik-prasyarat',
    title: '3 Pilar Materi Prasyarat 📚',
    stepBadge: 'Langkah 2 dari 7',
    icon: '📖',
    description:
      'Kuasai 3 fondasi penting sebelum mempelajari hidrolisis: Stoikiometri (mol & pereaksi pembatas), Termokimia (pengaruh kalor pada Kw), dan Larutan Asam-Basa (pasangan konjugasi Bronsted-Lowry). Klik tiap kartu untuk membuka materi dan kuis ringkas.',
    tip: 'Ingat bahwa nilai pH netral 7,00 secara khusus berlaku pada suhu standar 25°C!',
    preferredPosition: 'bottom',
  },
  {
    id: 'lab-interaktif',
    target: '#lab-interaktif',
    title: 'Laboratorium Virtual & Simulasi Cepat 🔬',
    stepBadge: 'Langkah 3 dari 7',
    icon: '🧪',
    description:
      'Uji 4 jenis larutan garam: NaCl, NH₄Cl, CH₃COONa, dan NH₄CN dalam gelas kimia interaktif. Kamu dapat mengamati warna larutan, indikator lakmus universal, dan nilai pH digital secara langsung.',
    tip: 'Gunakan tombol pengalih suhu 25°C dan 60°C untuk membuktikan bagaimana temperatur mempengaruhi kesetimbangan ion air (Kw).',
    preferredPosition: 'bottom',
  },
  {
    id: 'eksplorasi-partikel',
    target: '#beaker-stage-container',
    title: 'Eksplorasi Partikel Submikroskopis ⚗️',
    stepBadge: 'Langkah 4 dari 7',
    icon: '🔬',
    description:
      'Pelajari interaksi tingkat mikroskopis: ion manakah yang bereaksi dengan air dan mendonorkan atau menerima proton membentuk ion H₃O⁺ atau OH⁻, lengkap dengan persamaan reaksi kesetimbangannya.',
    tip: 'Reaksi hidrolisis merupakan kesetimbangan transfer proton dinamis, bukan sekadar pelarutan garam biasa.',
    preferredPosition: 'top',
  },
  {
    id: 'kuis-pg',
    target: '#kuis-pg-area',
    title: 'Kuis Formatif Pilihan Ganda 🎯',
    stepBadge: 'Langkah 5 dari 7',
    icon: '📝',
    description:
      'Uji pemahamanmu melalui 10 butir soal pilihan ganda interaktif. Fitur ini dilengkapi navigasi nomor soal, pelacak waktu pengerjaan, dan pembahasan saintifik mendalam bebas miskonsepsi.',
    tip: 'Pilihan jawaban langsung dibekukan setelah dikirim agar kamu dapat mengevaluasi pemahaman konsep secara murni.',
    preferredPosition: 'top',
  },
  {
    id: 'kuis-esai',
    target: '#quiz-phase-tabs',
    title: 'Kuis Esai Berpikir Kritis (HOTS) ✍️',
    stepBadge: 'Langkah 6 dari 7',
    icon: '✍️',
    description:
      'Setelah menyelesaikan soal pilihan ganda, lanjutkan ke 5 soal esai analitis. Tuliskan jawaban, persamaan reaksi berimbang, dan penalaran kimiamu pada kolom teks yang disediakan, lalu kirimkan untuk dinilai oleh guru pengampu.',
    tip: 'Pastikan semua butir soal esai sudah terisi sebelum menekan tombol "Kirim Semua Jawaban"!',
    preferredPosition: 'bottom',
  },
  {
    id: 'progress-belajar',
    target: '#sidebar-user-area',
    title: 'Pantau Perkembangan Belajarmu 📊',
    stepBadge: 'Langkah 7 dari 7',
    icon: '👤',
    description:
      'Akses Dashboard Siswa untuk melihat riwayat nilai, statistik evaluasi, dan sinkronisasi Cloud Firestore. Masuk menggunakan akun Google agar seluruh pencapaian belajarmu tersimpan secara permanen.',
    tip: 'Kamu bisa mengulang tur panduan ini kapan pun dengan menekan tombol "Tur Fitur" pada menu navigasi samping!',
    preferredPosition: 'bottom',
  },
];
