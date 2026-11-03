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
