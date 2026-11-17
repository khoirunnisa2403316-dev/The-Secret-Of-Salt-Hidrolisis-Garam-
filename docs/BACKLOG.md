# BACKLOG PENGEMBANGAN — THE SECRET OF SALT
### Pelacakan Status Fitur & Roadmap Rekayasa (Hydrolysis Adventure)

Acuan: PRD.md Bab 36 (Prioritas Pengembangan), Bab 39 (Roadmap 9 Tahap), dan Bab 40 (Definition of Done).

---

## Roadmap 9 Tahap Pengembangan

| Tahap | Modul / Fitur | Status | Catatan / Issue Terkait |
| :--- | :--- | :---: | :--- |
| **Tahap 1** | Inisialisasi Fondasi Proyek, Vite, React, TS, Styling Tokens | **Selesai** | Baseline setup |
| **Tahap 2** | Navigasi Global, Beranda, Hero Mini Lab, Kartu 3 Pilar Prasyarat | **Selesai** | Navbar & TopicCards modal |
| **Tahap 3** | Modul Materi Komprehensif (Modul 1 s.d. 6) | Dalam Pengerjaan | Modul 1 data terintegrasi |
| **Tahap 4** | Laboratorium Virtual Hidrolisis Interaktif | Siap Dikerjakan | Simulasi reaksi ionik makro-mikro |
| **Tahap 5** | Kalkulator pH Garam Step-by-Step Transparan | Siap Dikerjakan | Algoritma $K_h$, [H+], [OH-], pH |
| **Tahap 6** | Kuis Formatif Modul 1 & Evaluasi Penilaian Diagnostik | **Selesai** | **Issue #04**: 10 soal terverifikasi, frozen diagnostic, storage adapter, riwayat perangkat |
| **Tahap 7** | Sistem Autentikasi Pengguna & Database Cloud | **Selesai** | **Issue #05 & #06**: Firebase Auth, Cloud Firestore, Login, Register, Forgot Password, Dashboard terproteksi |
| **Tahap 8** | Audit Kepatuhan Ilmiah, Aksesibilitas WCAG & Validasi Rumus | **Selesai (Modul 1)** | Verifikasi rumus Kh, $m1-q8$ pH 9 (Opsi C), keyboard nav |
| **Tahap 9** | Polish, Optimasi Kinerja, Production Readiness | Berkelanjutan | 0 warning linter, build terverifikasi |

---

## Log Isu Selesai (Completed Issues)

### [Issue #04] Kuis Formatif Interaktif Modul 1 (Hidrolisis Garam)
- **Komponen**: `src/components/assessment/QuizModule1.tsx`, `QuizModule1.css`
- **Data Soal**: 10 butir soal terverifikasi di `src/data/soalHidrolisisGaram.ts`
- **Tipe & Kontrak**: `src/types/quiz.ts`, `src/types/databaseContract.ts`, `src/services/dbSyncContract.ts`
- **Penyimpanan Lokal**: `src/services/storageAdapter.ts` dengan penanganan kuota penuh/storage ditolak dan isolasi draf vs riwayat perangkat.
- **Kontrak Basis Data**: Dokumentasi DDL dan API sinkronisasi di [docs/DATABASED.md](file:///c:/Users/Khoirun%20Nisa%27%20Rakhma/WEBB/docs/DATABASED.md).

### [Issue #05] Sistem Autentikasi Pengguna & Halaman Login/Register/Forgot-Password/Dashboard
- **Komponen**: `src/components/AuthLayout.jsx`, `src/components/InputField.jsx`, `src/components/PasswordField.jsx`
- **Halaman**: `src/pages/Login.jsx`, `src/pages/Register.jsx`, `src/pages/ForgotPassword.jsx`, `src/pages/Dashboard.jsx`
- **Rute**: Integrasi React Router DOM v7 pada `src/App.tsx` (`/login`, `/register`, `/forgot-password`, `/dashboard`, `/`)

### [Issue #06] Integrasi Layanan Firebase Authentication & Database Cloud Firestore
- **Layanan**: `src/services/firebase.js` (Firebase App, Auth, & Firestore initialization via Vite env)
- **Sinkronisasi Kuis**: `src/services/firestoreQuizService.js` (Menyimpan evaluasi kuis ke koleksi `quiz_attempts` dan migrasi otomatis sesi guest)
- **Otentikasi Cloud**: `src/services/authService.js` terhubung ke `createUserWithEmailAndPassword`, `signInWithEmailAndPassword`, `signOut`, `sendPasswordResetEmail`, dan penyimpanan profil di Firestore `users/{uid}`.
- **Dokumentasi & Rules**: Update [docs/DATABASED.md](file:///c:/Users/Khoirun%20Nisa%27%20Rakhma/WEBB/docs/DATABASED.md) dan pembuatan file konfigurasi `.env.local`.

### [Issue #07] Penyempurnaan & Standarisasi UI/UX Autentikasi
- **Komponen**: `src/components/Auth.css`, `src/components/InputField.jsx`, `src/components/PasswordField.jsx`, `src/components/AuthLayout.jsx`
- **Perbaikan**: Penataan ulang `@layer base` di `src/index.css`, jaminan padding 44px anti-overlap teks dengan ikon, tombol *Teal* solid, kartu split adaptif responsif.

### [Issue #08] Panel Pengampu Guru, Login Google, Antrean Sinkronisasi Akun, & Migrasi Tamu Pilihan Siswa
- **Komponen & Halaman**: `src/pages/TeacherDashboard.jsx`, `src/pages/TeacherDashboard.css`, update `src/pages/Dashboard.jsx`, `src/pages/Login.jsx`, `src/pages/Register.jsx`
- **Fitur Panel Guru**: Filter kelas (`listClass`), status data (memuat, kosong, gagal, total, pembaruan), daftar hasil masuk (alias, aktivitas, jenis percobaan, versi soal, skor, waktu server), rincian satu percobaan (lembar jawaban asli, kunci, pembahasan), rekap per butir (frekuensi A-D, benar-salah, aturan percobaan terakhir/terbaik/semua), dan tindak lanjut pembelajaran (interpretasi miskonsepsi + 1 rekomendasi kegiatan berikutnya).
- **Layanan Autentikasi & Antrean**: Login Google (`loginWithGoogle`), antrean sinkronisasi idempoten per akun (`chem_sync_queue_${userId}`), migrasi kuis tamu pilihan siswa (`migrateSelectedGuestAttempts`), dan penanganan pergantian akun saat request berjalan.
- **Rute & Proteksi**: Rute `/teacher` dan `/panel-guru` terproteksi untuk role `teacher`, serta pengujian multi-peran (2 siswa: Ahmad Fauzi & Nabila Putri; 1 guru: Ibu Siti Rahma, M.Pd.).
