export const TOUR_STORAGE_KEY = 'the_secret_of_salt_tour_completed';

export function startOnboardingTour() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('open-onboarding-tour'));
  }
}

export interface TourStep {
  id: string;
  target: string; // CSS Selector of the element to highlight
  mobileTarget?: string; // Optional target selector on mobile screens
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
    mobileTarget: '.hero-title',
    title: 'Pusat Aktivitas Belajar Beranda 🏠',
    stepBadge: 'Langkah 1 dari 7',
    icon: '🏠',
    description:
      'Selamat datang di The Secret of Salt! Halaman Beranda ini merupakan pusat aktivitas belajar kimia interaktifmu. Di sini kamu dapat mengakses seluruh bagian utama pembelajaran: fenomena rasa ingin tahu, 3 pilar materi prasyarat, simulasi laboratorium virtual, modul materi lengkap, kuis evaluasi formatif, hingga pemantauan progres belajarmu.',
    tip: 'Mulailah dengan mengamati fenomena pemantik untuk memahami alasan ilmiah di balik perbedaan sifat asam, basa, atau netral dari berbagai larutan garam!',
    preferredPosition: 'bottom',
  },
  {
    id: 'search-bar',
    target: '.search-input-wrapper',
    title: 'Search Bar (Pencarian Materi) 🔍',
    stepBadge: 'Langkah 2 dari 7',
    icon: '🔍',
    description:
      'Gunakan kolom pencarian "Cari konsep atau materi..." di bagian atas ini untuk mencari materi secara cepat berdasarkan kata kunci. Cukup ketik konsep yang ingin kamu pelajari, atau tekan tombol shortcut "/" pada keyboard untuk langsung mengaktifkan kolom pencarian. Hasil pencarian akan langsung muncul secara instan dan dapat diklik untuk menuju materi yang dicari.',
    tip: 'Coba ketik kata kunci seperti "CH3COONa", "rumus pH", "garam asam", atau "tetapan hidrolisis" untuk langsung menuju ke materi terkait!',
    preferredPosition: 'bottom',
  },
  {
    id: 'materi-pembelajaran',
    target: '#materi-nav-tabs',
    title: 'Menu Materi Pembelajaran 📚',
    stepBadge: 'Langkah 3 dari 7',
    icon: '📚',
    description:
      'Di menu materi pembelajaran ini, kamu dapat mempelajari konsep hidrolisis garam secara mendalam dan menyeluruh. Bacalah dan pahami setiap bagian materi melalui navigasi tab yang tersedia: Pengertian & Konsep Dasar, 4 Jenis Garam, Tiga Level Johnstone (makroskopis, submikroskopis, simbolik), Rumus Kh & pH Lengkap, Kalkulator Interaktif, hingga Penerapan Nyata & Pembasmi Miskonsepsi.',
    tip: 'Gunakan tombol tab navigasi di atas kartu materi untuk berpindah antarbagian materi secara mudah, terstruktur, dan berurutan.',
    preferredPosition: 'bottom',
  },
  {
    id: 'laboratorium-virtual',
    target: '#lab-interaktif',
    title: 'Laboratorium Virtual & Simulasi 🧪',
    stepBadge: 'Langkah 4 dari 7',
    icon: '🧪',
    description:
      'Simulasi laboratorium virtual memungkinkan kamu menguji sifat larutan garam secara interaktif dan visual. Pilih sampel garam (NaCl, NH₄Cl, CH₃COONa, atau NH₄CN) untuk mengamati reaksi kimia nyata: perubahan warna cairan, pergerakan partikel ionik mikroskopis, indikator lakmus universal, serta pembacaan nilai pH digital.',
    tip: 'Gunakan tombol pengatur suhu 25°C dan 60°C untuk membuktikan bagaimana temperatur mempengaruhi kesetimbangan ion air (Kw) dan sifat keasaman larutan!',
    preferredPosition: 'top',
  },
  {
    id: 'kuis-pg',
    target: '#kuis-pg-area',
    title: 'Kuis Pilihan Ganda (10 Soal) 📝',
    stepBadge: 'Langkah 5 dari 7',
    icon: '📝',
    description:
      'Uji pemahaman konsepmu melalui 10 butir soal pilihan ganda interaktif. Pilih opsi jawaban (A, B, C, D, atau E) yang kamu anggap benar lalu klik tombol "Kirim Jawaban". Kamu dapat berpindah nomor soal secara bebas menggunakan panel nomor 1–10. Setelah menyelesaikan kuis, kamu dapat melihat skor perolehan serta pembahasan saintifik lengkap.',
    tip: 'Gunakan panel nomor untuk meninjau kembali soal yang belum terjawab sebelum menyelesaikan kuis pilihan ganda.',
    preferredPosition: 'top',
  },
  {
    id: 'kuis-esai',
    target: '#quiz-phase-tabs',
    title: 'Kuis Esai Berpikir Kritis ✍️',
    stepBadge: 'Langkah 6 dari 7',
    icon: '✍️',
    description:
      'Kuis Esai merupakan kelanjutan langsung setelah kamu menyelesaikan 10 soal pilihan ganda (dapat diakses melalui tombol "Lanjut ke Quiz Esai" atau tab Bagian 2). Di sini, kamu harus menuliskan jawaban analitis, penalaran kimia, dan persamaan reaksi hidrolisis berimbang pada kolom textarea yang disediakan berdasarkan pemahaman materimu. Setelah selesai mengisi seluruh soal, tekan tombol "Kirim Semua Jawaban".',
    tip: 'Jawaban esai dan hasil pilihan ganda disimpan dalam satu sesi evaluasi yang sama, lalu diperiksa dan dinilai langsung oleh guru melalui Dashboard Guru.',
    preferredPosition: 'bottom',
  },
  {
    id: 'progres-belajar',
    target: '#sidebar-user-area',
    mobileTarget: '#mobile-top-bar',
    title: 'Pemantauan Progres Belajar 📊',
    stepBadge: 'Langkah 7 dari 7',
    icon: '👤',
    description:
      'Pantau perkembangan belajar dan hasil evaluasimu secara berkala melalui Dashboard Siswa. Di sini kamu dapat melihat profil siswa, ringkasan progres capaian materi, riwayat nilai kuis pilihan ganda, serta status penilaian esai dari guru pengampu.',
    tip: 'Masuk (login) dengan akun Google atau akun siswa kamu agar seluruh progres belajar dan riwayat evaluasi tersimpan permanen di cloud!',
    preferredPosition: 'bottom',
  },
];
