# AGENT GUIDELINES — THE SECRET OF SALT (HYDROLYSIS ADVENTURE)
### Panduan Agen AI & Pengembang: Standar Rekayasa, Kepatuhan Ilmiah, dan Desain UI/UX Edukasi Sains

---

## 1. Identitas Proyek & Peran Agen

- **Nama Produk**: The Secret of Salt (Website Pembelajaran Interaktif Hidrolisis Garam)
- **Sub-Tema / Modul Petualangan**: Hydrolysis Adventure
- **Target Pengguna**: Siswa SMA/MA Kelas XI (Fase F) & Guru Mata Pelajaran Kimia
- **Peran Agen**: Senior React/TypeScript Developer, UI/UX Designer Edukasi Sains, & Chemistry Education Specialist.
- **Tujuan Utama**: Menghadirkan platform pembelajaran kimia berbasis web yang interaktif, menyenangkan (*joyful*), bermakna (*meaningful*), akurat secara saintifik, bebas dari miskonsepsi, dan memiliki estetika visual kelas dunia.

---

## 2. Prinsip Rekayasa Perangkat Lunak & Aturan Kerja

Setiap agen atau pengembang yang bekerja pada repositori ini **WAJIB** mematuhi aturan berikut:

1. **Aplikasi Berfungsi Nyata (No Placeholders/Mockups)**:
   - Jangan pernah menyajikan komponen tiruan atau tombol dekoratif tanpa fungsi nyata.
   - Setiap tombol aksi, navigasi, kalkulator, dan modal harus memiliki *state* dan interaktivitas yang berfungsi penuh.
2. **Pemisahan Logika Kimia & UI**:
   - Seluruh logika perhitungan stoikiometri, kesetimbangan, kalkulator pH, dan klasifikasi garam harus diletakkan dalam direktori `services/` (murni logika TypeScript murni dengan unit testing), terpisah dari komponen UI.
3. **Penyimpanan Progres Lokal (LocalStorage)**:
   - Progres belajar siswa (modul selesai, skor kuis, latihan mandiri) disimpan secara konsisten di `localStorage` dengan penanganan fallback jika terjadi galat penyimpanan/kuota penuh.
   - Sediakan tombol dan fungsi "Reset Progres" yang transparan.
4. **Bahasa Antarmuka**:
   - Seluruh teks UI, materi, penjelasan soal, dan glosarium menggunakan **Bahasa Indonesia** yang baku, ramah, komunikatif, dan sesuai untuk jenjang SMA/MA.
5. **Responsif & Multi-Platform**:
   - Antarmuka harus diuji dan tampil prima di layar ponsel (*mobile-first*), tablet, hingga monitor desktop.

---

## 3. Standar UI/UX & Visual Identity (PRD Compliance)

Desain mengusung tema **Modern Chemistry Learning Laboratory**: bersih, menyenangkan, futuristik, serta ramah mata.

### 3.1 Palet Warna Resmi (Design Tokens)

| Token / Nama Warna | Kode Hex | Fungsi & Filosofi |
| :--- | :--- | :--- |
| **Fresh Teal** | `#20B8AA` / `#4A90C7` | Aksen sains utama, navigasi interaktif, tombol primer, kesegaran inovasi |
| **Deep Navy** | `#243B64` / `#183153` | Warna dasar tipografi judul, header kontras tinggi, kestabilan |
| **Sunny Yellow** | `#FFD166` | Aksen highlight konsep penting, lencana pencapaian, bintang, peringatan konstruktif |
| **Coral / Soft Red** | `#FF887A` / `#E98989` | Penanda sifat asam ($H_3O^+$), kation terhidrolisis, tombol aksi interaktif penting |
| **Soft Purple / Green** | `#A995F5` / `#70C1A0` | Penanda sifat basa ($OH^-$), anion terhidrolisis, status netral |
| **Warm Ivory / Soft BG** | `#FFF9EC` / `#F5FAFF` | Latar belakang lembut ramah mata untuk sesi belajar yang panjang |

### 3.2 Karakteristik Visual & Komponen
- **Kartu & Kontainer**: Sudut membulat (*border-radius: 16px - 24px*) dengan bayangan lembut bertingkat (*soft elevation shadows*).
- **Tipografi Modern**: Gunakan font modern seperti *Plus Jakarta Sans*, *Outfit*, atau *Poppins* untuk heading, serta *Inter* untuk teks tubuh.
- **Aksesibilitas (WCAG 2.1 AA/AAA)**:
  - Rasio kontras teks terhadap latar belakang minimal 4.5:1.
  - Jangan mengandalkan warna semata untuk menyampaikan informasi (sertakan simbol, label teks, dan ikon).
  - Navigasi keyboard penuh (`Tab`, `Shift+Tab`, `Enter`, `Space`) dengan *focus ring* yang jelas.
  - Dukungan preferensi `prefers-reduced-motion` untuk siswa dengan sensitivitas animasi.

---

## 4. Standar Ketepatan Ilmiah & Pencegahan Miskonsepsi

Kimia adalah sains presisi. Tidak boleh ada kekeliruan notasi, rumus, atau konsep.

### 4.1 Tiga Representasi Kimia (Johnstone's Triangle)
Setiap pembahasan garam (misalnya $\text{NaCl}$, $\text{NH}_4\text{Cl}$, $\text{CH}_3\text{COONa}$, $\text{NH}_4\text{CH}_3\text{COO}$) wajib menghubungkan 3 level:
1. **Representasi Makroskopis**: Pengamatan indrawi nyata (warna larutan, trayek indikator lakmus/universal, nilai pH terukur).
2. **Representasi Submikroskopis**: Model partikel interaksi ionik dengan molekul air, transfer proton, dan pembentukan spesies $\text{H}_3\text{O}^+$ atau $\text{OH}^-$.
3. **Representasi Simbolik**: Persamaan disosiasi/ionisasi, persamaan reaksi hidrolisis berimbang dengan panah kesetimbangan ($\rightleftharpoons$), muatan ion yang tepat, dan fase zat.

### 4.2 Notasi Kimia & Persamaan Reaksi Standar
- **Garam Asam Kuat + Basa Kuat (Netral)**:
  $$\text{NaCl}_{(s)} \xrightarrow{\text{H}_2\text{O}} \text{Na}^+_{(aq)} + \text{Cl}^-_{(aq)}$$
  *(Ion $\text{Na}^+$ dan $\text{Cl}^-$ berasal dari asam kuat dan basa kuat sehingga tidak terhidrolisis secara signifikan; $\text{pH} = 7$ pada $25^\circ\text{C}$).*
- **Garam Asam Kuat + Basa Lemah (Asam)**:
  $$\text{NH}_4\text{Cl}_{(s)} \xrightarrow{\text{H}_2\text{O}} \text{NH}_4^+_{(aq)} + \text{Cl}^-_{(aq)}$$
  $$\text{NH}_4^+_{(aq)} + \text{H}_2\text{O}_{(l)} \rightleftharpoons \text{NH}_{3(aq)} + \text{H}_3\text{O}^+_{(aq)}$$
  $$[\text{H}^+] = \sqrt{\frac{K_w}{K_b} \cdot M_{\text{kation}}}$$
- **Garam Asam Lemah + Basa Kuat (Basa)**:
  $$\text{CH}_3\text{COONa}_{(s)} \xrightarrow{\text{H}_2\text{O}} \text{Na}^+_{(aq)} + \text{CH}_3\text{COO}^-_{(aq)}$$
  $$\text{CH}_3\text{COO}^-_{(aq)} + \text{H}_2\text{O}_{(l)} \rightleftharpoons \text{CH}_3\text{COOH}_{(aq)} + \text{OH}^-_{(aq)}$$
  $$[\text{OH}^-] = \sqrt{\frac{K_w}{K_a} \cdot M_{\text{anion}}}$$
- **Garam Asam Lemah + Basa Lemah**:
  $$[\text{H}^+] = \sqrt{\frac{K_w \cdot K_a}{K_b}}$$
  - Jika $K_a > K_b \rightarrow$ Sifat Asam ($\text{pH} < 7$).
  - Jika $K_a < K_b \rightarrow$ Sifat Basa ($\text{pH} > 7$).
  - Jika $K_a = K_b \rightarrow$ Sifat Netral ($\text{pH} = 7$).

### 4.3 Miskonsepsi yang Wajib Dicegah
1. **Pelarutan $\neq$ Hidrolisis**: Garam yang larut dalam air tidak serta merta terhidrolisis. Hidrolisis adalah reaksi kesetimbangan kimia antara ion garam dengan molekul air menghasilkan ion $\text{H}_3\text{O}^+$ atau $\text{OH}^-$.
2. **Kondisi Suhu pada pH Netral**: Nilai $\text{pH} = 7$ bersifat netral hanya spesifik pada suhu kamar $25^\circ\text{C}$ di mana $K_w = 1.0 \times 10^{-14}$.
3. **Valensi Garam pada Konsentrasi Ion**: Perhitungan konsentrasi kation/anion wajib memperhitungkan indeks stoikiometri garam, contohnya pada $(\text{NH}_4)_2\text{SO}_4$, konsentrasi $[\text{NH}_4^+] = 2 \times M_{\text{garam}}$.

---

## 5. Arsitektur Proyek & Struktur Folder

Struktur folder mengacu pada Bab 30 PRD untuk skalabilitas dan keteraturan:

```text
src/
├── app/
│   ├── App.tsx             # Root component & state global/provider
│   └── routes.tsx          # Navigasi halaman & tab routing
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx      # Navigasi utama, status jenjang SMA XI, switch tema/bantuan
│   │   ├── Footer.tsx      # Atribusi ilmiah, hak cipta, glosarium cepat
│   │   └── PageContainer.tsx
│   ├── ui/
│   │   ├── Button.tsx      # Komponen tombol aksesibel & variasi aksi
│   │   ├── Card.tsx        # Container kartu rounded modern
│   │   ├── ProgressBar.tsx # Indikator kemajuan modul & kuis
│   │   └── Accordion.tsx   # Komponen lipat untuk pembahasan soal & penurunan rumus
│   ├── chemistry/
│   │   ├── Equation.tsx     # Renderer persamaan kimia simbolik (KaTeX/LaTeX format)
│   │   ├── IonDiagram.tsx    # Visualisasi submikroskopis partikel ion & molekul air
│   │   ├── SaltCard.tsx      # Kartu klasifikasi garam beserta asal asam-basa
│   │   └── ReactionPanel.tsx # Panel interaktif animasi reaksi hidrolisis
│   └── assessment/
│       ├── QuestionCard.tsx  # Kartu soal latihan & evaluasi
│       ├── QuizResult.tsx    # Laporan skor & analisis kelemahan konsep
│       └── FeedbackPanel.tsx # Umpan balik ilmiah dan pembongkaran miskonsepsi
├── pages/
│   ├── HomePage.tsx          # Beranda: HeroSection, Curiosity Hook, Topik Inti
│   ├── OrientationPage.tsx   # Tujuan pembelajaran, Capaian Fase F, panduan belajar
│   ├── MaterialsPage.tsx     # Modul Materi 1 s.d. 6 bertahap
│   ├── SimulationPage.tsx    # Laboratorium Virtual Hidrolisis interaktif
│   ├── CalculatorPage.tsx    # Kalkulator pH dengan langkah step-by-step transparan
│   ├── PracticePage.tsx      # Latihan mandiri terbimbing
│   ├── QuizPage.tsx          # Kuis formatif interaktif
│   ├── EvaluationPage.tsx    # Evaluasi sumatif akhir
│   ├── SummaryPage.tsx       # Rangkuman rumus, peta konsep & infografis
│   └── ReferencesPage.tsx    # Daftar pustaka & glosarium istilah
├── data/
│   ├── materials.ts          # Konten materi teks, analogi, & ringkasan
│   ├── salts.ts              # Database garam, nilai Ka, Kb, kelarutan, jenis hidrolisis
│   ├── questions.ts          # Bank soal latihan, kuis, dan evaluasi beserta kunci & pembahasan
│   └── references.ts         # Sumber literatur kurikulum & jurnal sains
├── services/
│   ├── hydrolysis.ts         # Logika penentuan ion & klasifikasi hidrolisis
│   ├── phCalculator.ts       # Logika perhitungan matematis [H+], [OH-], pH, dan pOH
│   ├── assessment.ts         # Logika penilaian kuis & analisis kompetensi
│   └── progressStorage.ts    # Adapter LocalStorage untuk progres belajar
├── hooks/
│   └── useProgress.ts        # Custom hook manajemen progres belajar siswa
├── types/
│   ├── chemistry.ts          # Type definition untuk Ion, Salt, Reaction, Equilibrium
│   ├── question.ts           # Type definition untuk Question, Option, Explanation
│   └── progress.ts           # Type definition untuk UserProgress & QuizAttempt
└── styles/
    └── globals.css           # Variabel token CSS, tema warna, dan reset modern
```

---

## 6. Alur Pengerjaan & Urutan Pengembangan (Roadmap)

Sesuai arahan PRD Bagian 39, agen harus bekerja secara sistematis melalui 9 tahapan:

- [x] **Tahap 1: Inisialisasi & Fondasi Proyek**
  Menyiapkan dependensi Vite, React, TypeScript, konfigurasi font, dan kerangka struktur folder.
- [x] **Tahap 2: Navigasi Global & Halaman Beranda (Hero & Topic Cards)**
  Membangun `Navbar.jsx`, `HeroSection.jsx` dengan simulasi mini lab pemantik rasa ingin tahu, dan `TopicCards.jsx` dengan modal interaktif.
- [ ] **Tahap 3: Halaman Orientasi & Modul Materi Komprehensif (Modul 1 - 6)**
  Mengimplementasikan materi konseptual dasar, klasifikasi garam, mekanisme reaksi, tetapan $K_h$, penurunan rumus pH, dan aplikasi kehidupan sehari-hari.
- [ ] **Tahap 4: Laboratorium Virtual & Simulasi Hidrolisis Interaktif**
  Simulasi pemilihan garam ($\text{NaCl}, \text{NH}_4\text{Cl}, \text{CH}_3\text{COONa}, \text{NH}_4\text{CH}_3\text{COO}$), visualisasi partikel ionik, dan deteksi pH larutan.
- [ ] **Tahap 5: Kalkulator pH Garam Cerdas & Transparan**
  Kalkulator dengan validasi input konsentrasi, pilihan valensi ion, nilai $K_a$/$K_b$, dan penjabaran langkah perhitungan matematis secara terperinci.
- [ ] **Tahap 6: Latihan Mandiri, Kuis Formatif & Evaluasi Sumatif**
  Sistem tes dengan pengacakan opsi, umpan balik langsung, pembahasan saintifik, dan rekomendasi pengulangan materi jika terjadi kesalahan.
- [ ] **Tahap 7: Sinkronisasi Progres Belajar & Glosarium Interaktif**
  Penyimpanan lokal `useProgress`, indikator kemajuan belajar, dan pencarian istilah kimia instan.
- [ ] **Tahap 8: Audit Kepatuhan Ilmiah, Aksesibilitas & Pengujian**
  Verifikasi persamaan reaksi, uji batas kalkulator, validasi warna WCAG, dan uji navigasi keyboard.
- [ ] **Tahap 9: Polish & Production Readiness**
  Optimasi bundle, responsivitas multi-device, dan dokumentasi operasional pengguna.

---

## 7. Definition of Done (DoD)

Sebuah modul atau fitur dinyatakan selesai apabila:
1. **Berfungsi Penuh**: Tidak ada *dead button*, tidak ada tautan buntu, dan interaktivitas berjalan mulus.
2. **Akurasi Kimia Terverifikasi**: Notasi indeks subskrip/supersprip benar, persamaan reaksi berimbang, rumus pH valid sesuai jenis garam.
3. **Responsif**: Berfungsi tanpa overflow atau kerusakan tata letak pada layar smartphone (360px) hingga desktop monitor (1440px+).
4. **Bebas Error Konsol**: Tidak ada galat TypeScript, runtime exception, atau peringatan linting kritis.
5. **Tercatat di AI Log**: Setiap pembaruan penting dicatat dalam `docs/AI_LOG.md` dan backlog diperbarui di `docs/BACKLOG.md`.
