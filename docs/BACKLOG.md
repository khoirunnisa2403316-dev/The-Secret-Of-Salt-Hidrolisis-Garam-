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
| **Tahap 7** | Sinkronisasi Progres Belajar & Penyimpanan Lokal | **Selesai (MVP)** | Storage adapter guest, fallback error handling, kontrak Bab 4 di [docs/DATABASED.md](file:///c:/Users/Khoirun%20Nisa%27%20Rakhma/WEBB/docs/DATABASED.md) |
| **Tahap 8** | Audit Kepatuhan Ilmiah, Aksesibilitas WCAG & Validasi Rumus | **Selesai (Modul 1)** | Verifikasi rumus Kh, $m1-q8$ pH 9 (Opsi C), keyboard nav |
| **Tahap 9** | Polish, Optimasi Kinerja, Production Readiness | Berkelanjutan | Bundle < 300KB, 0 warning linter |

---

## Log Isu Selesai (Completed Issues)

### [Issue #04] Kuis Formatif Interaktif Modul 1 (Hidrolisis Garam)
- **Komponen**: `src/components/assessment/QuizModule1.tsx`, `QuizModule1.css`
- **Data Soal**: 10 butir soal terverifikasi di `src/data/soalHidrolisisGaram.ts`
- **Tipe & Kontrak**: `src/types/quiz.ts`, `src/types/databaseContract.ts`, `src/services/dbSyncContract.ts`
- **Penyimpanan Lokal**: `src/services/storageAdapter.ts` dengan penanganan kuota penuh/storage ditolak dan isolasi draf vs riwayat perangkat.
- **Kontrak Basis Data**: Dokumentasi DDL dan API sinkronisasi di [docs/DATABASED.md](file:///c:/Users/Khoirun%20Nisa%27%20Rakhma/WEBB/docs/DATABASED.md).

