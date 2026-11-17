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

## [2026-11-17] Pembersihan Data Dummy / Mock Responden Siswa pada Panel Guru
- **Kebutuhan Pengguna**: Menghapus seluruh data *dummy / mock* responden siswa (Ahmad Fauzi, Nabila Putri, Budi Santoso, Dewi Lestari) dari Panel Guru dan hanya menampilkan data asli pengumpulan kuis dari siswa riil.
- **Tindakan yang Dilakukan**:
  1. Menghapus fungsi `getPreSeededSubmissions()` dan generator data tiruan dari `src/services/firestoreQuizService.js`.
  2. Menghapus cache lokal tiruan `chem_teacher_submissions_cache` dan pemanggilan data riwayat mock.
  3. Memastikan fungsi `fetchTeacherClassSubmissions()` murni mengambil data pengumpulan kuis asli dari koleksi `quiz_attempts` Cloud Firestore dan mengabaikan entri berawalan `att_demo_`.
  4. Menambahkan status kosong (*empty state*) yang elegan dan informatif pada tab analisis butir di `src/pages/TeacherDashboard.jsx` jika belum ada siswa yang mengumpulkan kuis.
- **Kepatuhan Aturan Pengguna**:
  - Tidak melakukan commit / merge git otomatis.
- **Hasil Verifikasi**:
  - `oxlint`: 0 warning, 0 error.
  - `tsc -b && vite build`: Sukses (67 modul transformed, 0 error).

---

## [2026-11-17] Eksklusivitas Akun Guru Pengampu (khoirun.nisa.2403316@students.um.ac.id) & Penyembunyian Tombol Panel Guru
- **Kebutuhan Pengguna**:
  1. Hanya email `khoirun.nisa.2403316@students.um.ac.id` yang diizinkan menjadi akun Guru (`role: 'teacher'`). Seluruh akun lain (Google, pendaftaran email biasa, dan akun demo) tidak dapat masuk ke Panel Guru dan secara otomatis berstatus Siswa (`role: 'student'`).
  2. Pada bilah navigasi beranda (`Navbar.jsx`), tombol "Panel Guru" / "Guru" dibuat *difold* / tersembunyi secara bawaan (tidak tampil sama sekali saat pengguna belum masuk atau saat siswa login). Tombol Panel Guru hanya akan muncul apabila pengguna yang sedang login terverifikasi adalah `khoirun.nisa.2403316@students.um.ac.id`.
  3. Proteksi rute `/teacher` dan `/panel-guru` di `App.tsx` via `TeacherRoute` untuk mencegah akses URL langsung oleh siswa maupun pengguna anonim (langsung dialihkan ke `/dashboard`).
  4. Penyempurnaan kerapihan antarmuka formulir autentikasi (`Auth.css`, `InputField.jsx`, `PasswordField.jsx`): penambahan margin bawah label (0.45rem), padding horizontal 48px pada input berikon untuk menjamin teks tidak pernah bertumpuk dengan ikon atau tombol sandi, serta flex layout yang adaptif.
- **File Diperbarui**:
  - `src/services/authService.js`: Deklarasi `TEACHER_EMAIL = 'khoirun.nisa.2403316@students.um.ac.id'`, fungsi validasi `isTeacherEmail(email)`, penegakan peran otomatis di `registerUser`, `loginUser`, `loginWithGoogle`, `setSession`, dan pembaruan profil guru demo (`usr_demo_teacher_01`).
  - `src/Navbar.jsx`: Penghapusan tombol publik guru saat *logout*, dan penampilan bersyarat tombol "Panel Guru" hanya untuk email guru pengampu yang sah baik pada navbar desktop maupun laci menu mobile.
  - `src/App.tsx`: Pembuatan pembungkus rute `TeacherRoute` yang memeriksa kecocokan email dan peran sebelum merender `TeacherDashboard`.
  - `src/pages/TeacherDashboard.jsx`: Penegakan otorisasi di tingkat komponen, tampilan profil resmi guru `Khoirun Nisa' Rakhma, S.Pd.`, dan pembersihan tombol *switcher* bebas yang sebelumnya mengizinkan alih peran acak.
  - `src/pages/Dashboard.jsx` & `src/pages/Login.jsx`: Penyelarasan tombol guru pengampu dengan kredensial email yang sah.
  - `src/components/Auth.css`, `src/components/InputField.jsx`, `src/components/PasswordField.jsx`: Peningkatan estetika visual form, pemisahan label-input, dan jaminan jarak teks-ikon 48px.
- **Kepatuhan Aturan Pengguna**:
  - Tidak melakukan commit / merge git otomatis.
- **Hasil Verifikasi**:
  - `oxlint`: 0 warning, 0 error.
  - `tsc -b && vite build`: Sukses (67 modul transformed, 0 error).

---

## [2026-11-17] Transformasi Panel Navigasi Beranda Menjadi Left Sidebar Vertikal Terstruktur
- **Kebutuhan Pengguna**: Mengubah susunan panel navigasi beranda yang sebelumnya horizontal memanjang di atas menjadi navigasi samping kiri yang tersusun rapi ke bawah secara berurutan dan terstruktur.
- **Tindakan & Solusi Arsitektur UI/UX**:
  1. **Pembuatan Stylesheet [Navbar.css](file:///c:/Users/Khoirun%20Nisa%27%20Rakhma/WEBB/src/Navbar.css)**:
     - Mengubah container desktop (`min-width: 1024px`) menjadi bilah samping kiri permanen (`position: fixed; left: 0; top: 0; bottom: 0; width: 280px`).
     - Menyediakan custom thin scrollbar dan drawer responsif pada perangkat seluler (`< 1024px`) yang meluncur mulus dari kiri ke kanan dengan backdrop overlay.
  2. **Hierarki Vertikal Berurutan ke Bawah di [Navbar.jsx](file:///c:/Users/Khoirun%20Nisa%27%20Rakhma/WEBB/src/Navbar.jsx)**:
     - **Bagian 1 (Atas)**: Identitas/Brand Media (Logo Beaker, "The Secret of Salt", badge "XI • FASE F", tagline).
     - **Bagian 2 (Tengah Atas)**: `Navigasi Belajar` (Beranda, Topik Prasyarat, Lab Maya & Simulasi, Kuis Modul 1, Tentang Media) dengan active scroll indicator.
     - **Bagian 3 (Area Pengguna)**: Tombol spesial `Panel Pengampu Guru` (hanya muncul untuk `khoirun.nisa.2403316@students.um.ac.id`) dan `Dashboard Siswa`.
     - **Bagian 4 (Utilitas)**: Panduan Belajar, Mode Tampilan Ramah Mata (Warm Ivory), dan tombol CTA "Mulai Belajar".
     - **Bagian 5 (Bawah)**: `Akun Belajar` (Kartu profil + tombol keluar saat login; tombol Masuk & Daftar Akun saat tamu).
  3. **Penyesuaian Layout Halaman di [App.css](file:///c:/Users/Khoirun%20Nisa%27%20Rakhma/WEBB/src/App.css)**:
     - Menambahkan offset desktop `padding-left: 280px` pada `.app-wrapper` sehingga seluruh konten beranda (Hero, Beaker Lab, Topik Prasyarat, Kuis Modul 1, Footer) mengalir seimbang di sisi kanan tanpa terpotong atau tertimpa sidebar.
- **Hasil Verifikasi**:
  - `oxlint`: 0 warning, 0 error.
  - `tsc -b && vite build`: Sukses (68 modul transformed, 0 error).
  - Tidak ada commit / merge otomatis yang dijalankan.

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

---

## [2026-11-17] Issue #08: Panel Pengampu Guru, Login Google, Antrean Sinkronisasi Akun, & Migrasi Tamu Pilihan Siswa
- **Tindakan**: Pembangunan halaman Panel Guru komprehensif, integrasi Google Authentication, sistem antrean sinkronisasi idempoten per akun, migrasi selektif hasil kuis tamu, serta penanganan pergantian akun saat request berjalan.
- **File Dibuat / Diperbarui**:
  1. `src/pages/TeacherDashboard.jsx` & `TeacherDashboard.css`: Panel Guru dengan filter rombel (`listClass`), kartu analitik kelas (rata-rata, KKTP, butir tersulit), daftar hasil diterima (alias, aktivitas, jenis percobaan, versi soal, skor, waktu server), modal rincian lembar jawaban per butir, rekap per butir (frekuensi opsi A-D, benar-salah, aturan 1 percobaan per siswa: terakhir/terbaik/semua), dan tindak lanjut pembelajaran (interpretasi miskonsepsi + 1 rekomendasi kegiatan belajar berikutnya).
  2. `src/services/firestoreQuizService.js`: Penambahan antrean pengiriman per akun `chem_sync_queue_${userId}`, pengiriman idempoten via `attemptId`, migrasi hasil tamu pilihan siswa (`migrateSelectedGuestAttempts`), pemulihan riwayat siswa spesifik, dan data diagnostik realistis untuk pengujian 2 siswa (Ahmad Fauzi & Nabila Putri) dan 1 guru (Ibu Siti Rahma, M.Pd.).
  3. `src/services/firebase.js`: Inklusi dan ekspor `GoogleAuthProvider` serta `signInWithPopup`.
  4. `src/services/authService.js`: Penambahan metode `loginWithGoogle()`, penanganan pembatalan popup Google (`auth/popup-closed-by-user`), detektor pergantian akun (`isCurrentSessionUser`), dan *account switcher* cepat untuk simulasi.
  5. `src/context/useAuth.ts` & `src/context/AuthContext.jsx`: Ekspos fungsi `loginWithGoogle` dan `switchDemoRole`.
  6. `src/pages/Dashboard.jsx`: Penambahan kartu seleksi migrasi hasil kuis sesi tamu, kartu antrean sinkronisasi akun offline-to-online, dan tautan akses Panel Guru.
  7. `src/pages/Login.jsx` & `src/pages/Register.jsx`: Tombol "Masuk dengan Google" dan "Daftar dengan Google" dengan logo resmi Google dan penanganan pembatalan tanpa error fatal.
  8. `src/components/assessment/QuizModule1.tsx`: Sinkronisasi otomatis ke akun pengguna dan antrean idempoten saat kuis diselesaikan.
  9. `src/App.tsx` & `src/Navbar.jsx`: Pendaftaran rute `/teacher` dan `/panel-guru` serta tombol akses cepat Panel Guru di bilah navigasi.
  10. `docs/DATABASED.md`, `docs/BACKLOG.md`: Pembaruan aturan keamanan Firestore, kontrak antrean, dan dokumentasi arsitektur.
- **Kepatuhan Aturan Pengguna**:
  - Seluruh materi, soal kuis Modul 1, navigasi beranda, 3D beaker, dan fitur kimia tetap terjaga 100%.
  - Tidak melakukan commit / merge git otomatis.
- **Status**: Teruji dengan `oxlint` (0 warning, 0 error) dan `vite build` (sukses).

---

## [2026-11-17] Pembersihan Data Dummy / Mock Responden Siswa pada Panel Guru
- **Kebutuhan Pengguna**: Menghapus seluruh data *dummy / mock* responden siswa (Ahmad Fauzi, Nabila Putri, Budi Santoso, Dewi Lestari) dari Panel Guru dan hanya menampilkan data asli pengumpulan kuis dari siswa riil.
- **Tindakan yang Dilakukan**:
  1. Menghapus fungsi `getPreSeededSubmissions()` dan generator data tiruan dari `src/services/firestoreQuizService.js`.
  2. Menghapus cache lokal tiruan `chem_teacher_submissions_cache` dan pemanggilan data riwayat mock.
  3. Memastikan fungsi `fetchTeacherClassSubmissions()` murni mengambil data pengumpulan kuis asli dari koleksi `quiz_attempts` Cloud Firestore dan mengabaikan entri berawalan `att_demo_`.
  4. Menambahkan status kosong (*empty state*) yang elegan dan informatif pada tab analisis butir di `src/pages/TeacherDashboard.jsx` jika belum ada siswa yang mengumpulkan kuis.
- **Kepatuhan Aturan Pengguna**:
  - Tidak melakukan commit / merge git otomatis.
- **Hasil Verifikasi**:
  - `oxlint`: 0 warning, 0 error.
  - `tsc -b && vite build`: Sukses (67 modul transformed, 0 error).

---

## [2026-11-17] Eksklusivitas Akun Guru Pengampu (khoirun.nisa.2403316@students.um.ac.id) & Penyembunyian Tombol Panel Guru
- **Kebutuhan Pengguna**:
  1. Hanya email `khoirun.nisa.2403316@students.um.ac.id` yang diizinkan menjadi akun Guru (`role: 'teacher'`). Seluruh akun lain (Google, pendaftaran email biasa, dan akun demo) tidak dapat masuk ke Panel Guru dan secara otomatis berstatus Siswa (`role: 'student'`).
  2. Pada bilah navigasi beranda (`Navbar.jsx`), tombol "Panel Guru" / "Guru" dibuat *difold* / tersembunyi secara bawaan (tidak tampil sama sekali saat pengguna belum masuk atau saat siswa login). Tombol Panel Guru hanya akan muncul apabila pengguna yang sedang login terverifikasi adalah `khoirun.nisa.2403316@students.um.ac.id`.
  3. Proteksi rute `/teacher` dan `/panel-guru` di `App.tsx` via `TeacherRoute` untuk mencegah akses URL langsung oleh siswa maupun pengguna anonim (langsung dialihkan ke `/dashboard`).
  4. Penyempurnaan kerapihan antarmuka formulir autentikasi (`Auth.css`, `InputField.jsx`, `PasswordField.jsx`): penambahan margin bawah label (0.45rem), padding horizontal 48px pada input berikon untuk menjamin teks tidak pernah bertumpuk dengan ikon atau tombol sandi, serta flex layout yang adaptif.
- **File Diperbarui**:
  - `src/services/authService.js`: Deklarasi `TEACHER_EMAIL = 'khoirun.nisa.2403316@students.um.ac.id'`, fungsi validasi `isTeacherEmail(email)`, penegakan peran otomatis di `registerUser`, `loginUser`, `loginWithGoogle`, `setSession`, dan pembaruan profil guru demo (`usr_demo_teacher_01`).
  - `src/Navbar.jsx`: Penghapusan tombol publik guru saat *logout*, dan penampilan bersyarat tombol "Panel Guru" hanya untuk email guru pengampu yang sah baik pada navbar desktop maupun laci menu mobile.
  - `src/App.tsx`: Pembuatan pembungkus rute `TeacherRoute` yang memeriksa kecocokan email dan peran sebelum merender `TeacherDashboard`.
  - `src/pages/TeacherDashboard.jsx`: Penegakan otorisasi di tingkat komponen, tampilan profil resmi guru `Khoirun Nisa' Rakhma, S.Pd.`, dan pembersihan tombol *switcher* bebas yang sebelumnya mengizinkan alih peran acak.
  - `src/pages/Dashboard.jsx` & `src/pages/Login.jsx`: Penyelarasan tombol guru pengampu dengan kredensial email yang sah.
  - `src/components/Auth.css`, `src/components/InputField.jsx`, `src/components/PasswordField.jsx`: Peningkatan estetika visual form, pemisahan label-input, dan jaminan jarak teks-ikon 48px.
- **Kepatuhan Aturan Pengguna**:
  - Tidak melakukan commit / merge git otomatis.
- **Hasil Verifikasi**:
  - `oxlint`: 0 warning, 0 error.
  - `tsc -b && vite build`: Sukses (67 modul transformed, 0 error).

---

## [2026-11-17] Transformasi Panel Navigasi Beranda Menjadi Left Sidebar Vertikal Terstruktur
- **Kebutuhan Pengguna**: Mengubah susunan panel navigasi beranda yang sebelumnya horizontal memanjang di atas menjadi navigasi samping kiri yang tersusun rapi ke bawah secara berurutan dan terstruktur.
- **Tindakan & Solusi Arsitektur UI/UX**:
  1. **Pembuatan Stylesheet [Navbar.css](file:///c:/Users/Khoirun%20Nisa%27%20Rakhma/WEBB/src/Navbar.css)**:
     - Mengubah container desktop (`min-width: 1024px`) menjadi bilah samping kiri permanen (`position: fixed; left: 0; top: 0; bottom: 0; width: 280px`).
     - Menyediakan custom thin scrollbar dan drawer responsif pada perangkat seluler (`< 1024px`) yang meluncur mulus dari kiri ke kanan dengan backdrop overlay.
  2. **Hierarki Vertikal Berurutan ke Bawah di [Navbar.jsx](file:///c:/Users/Khoirun%20Nisa%27%20Rakhma/WEBB/src/Navbar.jsx)**:
     - **Bagian 1 (Atas)**: Identitas/Brand Media (Logo Beaker, "The Secret of Salt", badge "XI • FASE F", tagline).
     - **Bagian 2 (Tengah Atas)**: `Navigasi Belajar` (Beranda, Topik Prasyarat, Lab Maya & Simulasi, Kuis Modul 1, Tentang Media) dengan active scroll indicator.
     - **Bagian 3 (Area Pengguna)**: Tombol spesial `Panel Pengampu Guru` (hanya muncul untuk `khoirun.nisa.2403316@students.um.ac.id`) dan `Dashboard Siswa`.
     - **Bagian 4 (Utilitas)**: Panduan Belajar, Mode Tampilan Ramah Mata (Warm Ivory), dan tombol CTA "Mulai Belajar".
     - **Bagian 5 (Bawah)**: `Akun Belajar` (Kartu profil + tombol keluar saat login; tombol Masuk & Daftar Akun saat tamu).
  3. **Penyesuaian Layout Halaman di [App.css](file:///c:/Users/Khoirun%20Nisa%27%20Rakhma/WEBB/src/App.css)**:
     - Menambahkan offset desktop `padding-left: 280px` pada `.app-wrapper` sehingga seluruh konten beranda (Hero, Beaker Lab, Topik Prasyarat, Kuis Modul 1, Footer) mengalir seimbang di sisi kanan tanpa terpotong atau tertimpa sidebar.
- **Hasil Verifikasi**:
  - `oxlint`: 0 warning, 0 error.
  - `tsc -b && vite build`: Sukses (68 modul transformed, 0 error).
  - Tidak ada commit / merge otomatis yang dijalankan.
