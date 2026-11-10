# AI DEVELOPMENT LOG — THE SECRET OF SALT

Dokumen ini mencatat keputusan arsitektur, progres pengerjaan modul, dan riwayat iterasi pengembangan website **The Secret of Salt** (Hydrolysis Adventure).

---

## [2026-10-27] Inisialisasi Pedoman Agen (AGENT.md)
- **Tindakan**: Pembuatan dokumen panduan agen dan pengembang di [docs/AGENT.md](file:///c:/Users/Khoirun%20Nisa%27%20Rakhma/WEBB/docs/AGENT.md) dan pembaruan [AGENTS.md](file:///c:/Users/Khoirun%20Nisa%27%20Rakhma/WEBB/AGENTS.md).
- **Ruang Lingkup**:
  1. Penyelarasan identitas produk sesuai PRD v2.0 (Kimia SMA/MA Kelas XI Fase F).
  2. Penetapan standar UI/UX laboratorium modern, palet warna resmi (*Fresh Teal*, *Deep Navy*, *Sunny Yellow*, *Coral*, *Soft Purple*, *Warm Ivory*), dan aksesibilitas WCAG.
  3. Standarisasi kepatuhan ilmiah (segitiga representasi Johnstone: Makroskopis, Submikroskopis, Simbolik) serta pencegahan miskonsepsi hidrolisis.
  4. Penyusunan arsitektur folder modular (Bab 30 PRD) dan Roadmap pengerjaan 9 tahap (Bab 39 PRD).
  5. Perumusan kriteria *Definition of Done (DoD)*.
- **Status**: Selesai dan tersinkronisasi.

---

## [2026-11-03] Issue #04: Implementasi Kuis Formatif Modul 1 (10 Soal Terverifikasi) & Kontrak Database Bab 4
- **Tindakan**: Pembangunan modul kuis formatif interaktif lengkap dengan sistem penilaian, pembekuan jawaban diagnostik, penyimpanan draf aman, navigasi keyboard, riwayat perangkat terpisah, dan spesifikasi kontrak sinkronisasi basis data backend.
- **File Dibuat / Diperbarui**:
  1. `src/types/quiz.ts`: Definisi tipe data `QuizQuestion`, `QuizOption`, `SubmittedAnswer`, `GuestQuizSession`, `QuizAttemptHistoryItem`, dan `StorageOperationResult`.
  2. `src/data/soalHidrolisisGaram.ts`: 10 butir soal terverifikasi untuk Modul 1 (Konsep Dasar, Sifat Larutan, Reaksi Hidrolisis Kation/Anion, Tetapan Kh, dan Perhitungan pH). Verifikasi saintifik pada soal $m1-q8$ (CH₃COONa 0,1 M menghasilkan pH = 9, kunci C).
  3. `src/services/storageAdapter.ts`: Adaptor penyimpanan lokal anti-rusak (safe parser, error handler untuk *storage access denied* / *quota exceeded* / *corrupt JSON*) yang membedakan draf aktif dari riwayat percobaan final.
  4. `src/components/assessment/QuizModule1.tsx` & `QuizModule1.css`: Komponen kuis interaktif dengan palette navigasi 1–10, pembekuan diagnostik sebelum pembahasan, validasi tombol kirim, navigasi keyboard (1-4, Panah, Enter), rangkuman skor, percobaan ulang ber-ID baru, dan modal konfirmasi hapus riwayat.
  5. `src/types/databaseContract.ts` & `src/services/dbSyncContract.ts`: Kontrak antarmuka migrasi sesi guest ke akun siswa terdaftar serta sinkronisasi hasil kuis per butir sesuai Bab 4 PRD.
  6. `docs/DATABASED.md`: Dokumentasi skema PostgreSQL DDL dan spesifikasi endpoint REST API (Bab 4 Persona Siswa & Guru).
  7. `docs/BACKLOG.md`: Pelacakan kemajuan backlog implementasi fitur.
- **Kepatuhan Terhadap Aturan Pengguna**:
  - Tombol submit nonaktif sebelum opsi dipilih.
  - Jawaban diagnostik dibekukan saat pengiriman sebelum pembahasan tampil.
  - Draf dan riwayat perangkat dipisahkan; tombol reset draf aktif independen dari dialog konfirmasi hapus riwayat perangkat.
  - Tangani penyimpanan ditolak tanpa pernah mengklaim berhasil simpan jika gagal.
  - Tidak melakukan commit / merge otomatis.
- **Status**: Teruji dengan `oxlint` (0 warning, 0 error) dan `vite build` (sukses).

---

## [2026-11-10] Issue #05: Sistem Autentikasi Pengguna & Halaman Login/Register/Forgot-Password/Dashboard
- **Tindakan**: Implementasi sistem autentikasi lengkap media pembelajaran kimia menggunakan React, React Router DOM v7, dan Tailwind CSS v4.
- **File Dibuat / Diperbarui**:
  1. `src/components/AuthLayout.jsx`: Tata letak autentikasi split-screen dengan ilustrasi laboratorium kimia modern, partikel ion ($H_3O^+, OH^-, NH_4^+, CH_3COO^-$), sudut membulat, bayangan lembut, dan responsivitas mobile-first.
  2. `src/components/InputField.jsx`: Komponen input teks/email reusable dengan ikon kiri, penanda wajib, pesan kesalahan real-time di bawah input, dan ring fokus teal.
  3. `src/components/PasswordField.jsx`: Komponen input kata sandi reusable dengan ikon gembok kiri, tombol show/hide password mata interaktif, dan tautan kanan opsional ("Lupa Kata Sandi?").
  4. `src/pages/Login.jsx`: Halaman login lengkap dengan validasi email/kata sandi, loading state, notifikasi keberhasilan/kesalahan, dan akun demo kimia cepat.
  5. `src/pages/Register.jsx`: Halaman registrasi siswa baru (Nama Lengkap, Email, Kata Sandi min 8 karakter, Ulangi Kata Sandi, indikator kekuatan password, validasi kecocokan).
  6. `src/pages/ForgotPassword.jsx`: Halaman pemulihan kata sandi melalui email dengan validasi dan konfirmasi pengiriman tautan.
  7. `src/pages/Dashboard.jsx`: Dashboard siswa terproteksi yang menampilkan identitas profil, capaian kuis terverifikasi, dan jalan pintas ke Lab Maya.
  8. `src/services/authService.js` & `src/context/useAuth.ts`: Layanan autentikasi aman (kriptografi SHA-256 browser, tanpa penyimpanan plaintext password di localStorage, integrasi Supabase/Firebase via env variables, migrasi kuis guest otomatis).
  9. `src/App.tsx` & `src/App.jsx`: Konfigurasi rute `/login`, `/register`, `/forgot-password`, `/dashboard` (terproteksi), dan `/` (beranda publik terjaga utuh).
  10. `src/Navbar.jsx`: Integrasi status masuk/daftar/dashboard siswa ke navigasi utama dan laci seluler (*mobile drawer*).
  11. `.env.example`: Panduan konfigurasi variabel lingkungan Supabase & Firebase.
- **Kepatuhan Desain & Pengujian**:
  - Palet warna resmi (#0F766E Teal, #164E63 Dark Cyan, #5EEAD4 Mint, #F0FDFA Light Mint, #DC2626 Error, #16A34A Success).
  - Teruji dengan `oxlint` (0 warning, 0 error) dan `vite build` (selesai dalam ~390ms).
  - Tidak menghapus fitur lain yang sudah ada (Hero, TopicCards, QuizModule1, Footer tetap utuh).
  - Tidak melakukan commit / merge otomatis.
- **Status**: Selesai dan diverifikasi.

---

## [2026-11-10] Issue #06: Integrasi Layanan Firebase Authentication & Database Cloud Firestore
- **Tindakan**: Integrasi penuh SDK Firebase v13 (`firebase/auth` dan `firebase/firestore`) ke dalam aplikasi web media pembelajaran kimia.
- **File Dibuat / Diperbarui**:
  1. `src/services/firebase.js`: Inisialisasi Firebase App, Firebase Auth (`getAuth`), dan Cloud Firestore (`getFirestore`) menggunakan variabel lingkungan Vite (`VITE_FIREBASE_*`).
  2. `src/services/firestoreQuizService.js`: Layanan penyimpanan dan penarikan riwayat percobaan kuis siswa ke koleksi Cloud Firestore `quiz_attempts`, serta migrasi otomatis draf sesi guest ke cloud.
  3. `src/services/authService.js`: Integrasi alur registrasi (`createUserWithEmailAndPassword` + penyimpanan profil siswa ke Firestore `users/{uid}`), login (`signInWithEmailAndPassword`), logout (`signOut`), reset password (`sendPasswordResetEmail`), dan penerjemahan kode error Firebase ke Bahasa Indonesia yang ramah pengguna.
  4. `src/context/AuthContext.jsx`: Penambahan listener status autentikasi real-time Firebase (`onAuthStateChanged`) untuk menjaga sesi tetap sinkron saat halaman dimuat ulang.
  5. `src/pages/Dashboard.jsx`: Menampilkan status koneksi Firebase Cloud, daftar riwayat evaluasi kuis langsung dari Firestore, dan panel bantuan konfigurasi kunci `.env.local`.
  6. `src/components/assessment/QuizModule1.tsx`: Sinkronisasi otomatis hasil pengerjaan kuis formatif ke Cloud Firestore saat siswa menyelesaikan 10 butir soal.
  7. `.env.local` & `.env.example`: Template dan file konfigurasi Firebase Console siap pakai.
  8. `docs/DATABASED.md`: Dokumentasi skema NoSQL Cloud Firestore (`users` dan `quiz_attempts`) beserta aturan keamanan (*Security Rules*).
- **Status**: Teruji dengan `oxlint` (0 warning, 0 error) dan `vite build` (sukses).

---

## [2026-11-10] Issue #07: Perbaikan dan Penyempurnaan Tampilan Visual Halaman Autentikasi
- **Masalah yang Ditemukan**:
  1. Ikon input (*user*, *email*, *lock*) menumpuk langsung (*overlap*) di atas teks placeholder pada formulir registrasi dan login.
  2. Jarak vertikal antar-kolom formulir terlalu sempit dan tombol "Daftar" / "Masuk" tidak tampak/terpotong.
  3. Tata letak split card pada viewport desktop mengalami pemotongan (*clipping*) pada sisi ilustrasi (badge atas dan kutipan bawah terpotong).
  4. **Akar Penyebab Utama**: Deklarasi reset unlayered `* { margin: 0; padding: 0; }` dan `button { background: none; }` di `src/index.css` di luar `@layer` menimpa seluruh utilitas Tailwind CSS v4 (`pl-10`, `py-3`, `bg-[#0F766E]`, `text-white`), sehingga padding input menjadi 0 dan latar tombol menjadi transparan (*invisible* putih di atas putih).
- **Solusi & Perbaikan**:
  1. **Migrasi CSS Reset ke `@layer base` (`src/index.css`)**: Membungkus reset standar dalam `@layer base` agar tunduk pada aturan spesifisitas utilitas Tailwind.
  2. **Pembuatan Stylesheet Terdedikasi (`src/components/Auth.css`)**:
     - `.auth-input`: Diberi jaminan indentasi pasti `padding-left: 2.75rem !important` (44px) dan inline style `paddingLeft: 44px` agar teks placeholder tidak akan pernah menumpuk dengan ikon.
     - `.auth-left-icon`: Penempatan ikon vertikal presisi (`left: 0.85rem; top: 50%; transform: translateY(-50%)`).
     - `.auth-submit-btn`: Tombol solid warna *Fresh Teal* (`#0F766E` !important) dengan teks putih tebal (`#FFFFFF` !important), border-radius 12px, shadow lembut, dan transisi hover.
     - `.auth-card` & `.auth-side-panel`: Tata letak kartu split yang fleksibel dengan pembatasan lebar ilustrasi kimia maksimal 230px sehingga badge atas dan kutipan bawah tidak terpotong.
  3. **Pembaruan Komponen**:
     - `src/components/InputField.jsx`, `src/components/PasswordField.jsx`, `src/components/AuthLayout.jsx`.
     - `src/pages/Register.jsx`, `src/pages/Login.jsx`, `src/pages/ForgotPassword.jsx`.
- **Hasil Verifikasi**:
  - `oxlint`: 0 warning, 0 error.
  - `tsc -b && vite build`: Sukses (65 modul ditransformasikan tanpa galat).
