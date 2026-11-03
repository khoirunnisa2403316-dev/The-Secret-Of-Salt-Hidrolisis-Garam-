# AGENTS GUIDELINES — THE SECRET OF SALT (HYDROLYSIS ADVENTURE)
### Panduan Pengembang & AI Agent: Standar Rekayasa, Kepatuhan Ilmiah, dan Desain UI/UX

> Dokumen utama lengkap tersinkronisasi di [docs/AGENT.md](file:///c:/Users/Khoirun%20Nisa%27%20Rakhma/WEBB/docs/AGENT.md).

---

## 1. Peran dan Prinsip Utama
- **Nama Produk**: The Secret of Salt — Website Pembelajaran Interaktif Hidrolisis Garam (Kimia SMA/MA Kelas XI Fase F).
- **Peran**: Senior React/TypeScript Developer, UI/UX Designer Edukasi Sains, & Chemistry Education Specialist.
- **Tujuan**: Menghadirkan pengalaman belajar kimia yang interaktif, menyenangkan (*joyful*), bermakna (*meaningful*), akurat secara saintifik, dan bebas dari miskonsepsi.

---

## 2. Standar Desain & Visual Identity (PRD Compliance)
Gunakan palet warna resmi yang telah ditentukan:
- **Fresh Teal**: `#20B8AA` / `#4A90C7` (Aksen utama sains, kesegaran, inovasi, tombol primer)
- **Deep Navy**: `#243B64` / `#183153` (Warna dasar tipografi, latar kontras, kestabilan)
- **Sunny Yellow**: `#FFD166` (Energi, highlight konsep penting, peringatan positif, bintang)
- **Coral / Soft Red**: `#FF887A` / `#E98989` (Aksen asam / ion $H_3O^+$, tombol aksi interaktif)
- **Soft Purple / Green**: `#A995F5` / `#70C1A0` (Aksen basa / ion $OH^-$, status larutan)
- **Warm Ivory / Soft BG**: `#FFF9EC` / `#F5FAFF` (Latar belakang lembut ramah mata)

### Elemen Visual & UI:
1. Kartu membulat (*border-radius: 16px - 24px*) dengan bayangan lembut (*soft elevation shadows*).
2. Ilustrasi laboratorium modern: gelas kimia (*beaker*), erlenmeyer, pipet, dan partikel ionik.
3. Tipografi modern (*Plus Jakarta Sans* / *Outfit* / *Poppins* / *Inter*) dengan hierarki jelas.
4. Hindari desain kekanak-kanakan (*childish*) serta hindari tampilan teks yang terlalu padat.
5. Animasi ringan dan halus (*micro-interactions*), serta mendukung opsi pengurangan gerakan (`prefers-reduced-motion`).

---

## 3. Ketepatan Konten Kimia (Scientific Accuracy)
1. **Tiga Tingkat Representasi Kimia (Johnstone's Triangle)**:
   - **Makroskopis**: Fenomena indrawi, warna indikator lakmus/universal, nilai pH terukur.
   - **Submikroskopis**: Model partikel ionik dan molekul air, transfer proton membentuk $H_3O^+$ atau $OH^-$.
   - **Simbolik**: Rumus senyawa, persamaan ionisasi, dan persamaan reaksi hidrolisis berimbang dengan panah kesetimbangan ($\rightleftharpoons$).
2. **Notasi Kimia & Persamaan Reaksi**:
   - $NH_4^+ + H_2O \rightleftharpoons NH_3 + H_3O^+$ (menghasilkan sifat asam, $[\text{H}^+] = \sqrt{\frac{K_w}{K_b} \cdot M_{\text{kation}}}$)
   - $CH_3COO^- + H_2O \rightleftharpoons CH_3COOH + OH^-$ (menghasilkan sifat basa, $[\text{OH}^-] = \sqrt{\frac{K_w}{K_a} \cdot M_{\text{anion}}}$)
   - $KCl$ atau $NaCl$: Garam dari asam kuat dan basa kuat, ion tidak bereaksi dengan air secara signifikan (pH netral = 7 pada $25^\circ\text{C}$).
   - Garam dari asam lemah dan basa lemah: $[\text{H}^+] = \sqrt{\frac{K_w \cdot K_a}{K_b}}$, sifat ditentukan perbandingan $K_a$ dan $K_b$.
3. **Pencegahan Miskonsepsi**:
   - Pelarutan (dissolution) berbeda dengan hidrolisis (tidak semua ion bereaksi dengan air).
   - pH netral bernilai 7 secara khusus pada suhu $25^\circ\text{C}$ ($K_w = 1.0 \times 10^{-14}$).
   - Perhatikan valensi ion (misal $(\text{NH}_4)_2\text{SO}_4 \implies [\text{NH}_4^+] = 2 \times M_{\text{garam}}$).

---

## 4. Struktur Komponen & Kode
1. **Pemisahan Modul Sesuai PRD**:
   - `components/layout/` (`Navbar.jsx`, `Footer.jsx`, `PageContainer.jsx`)
   - `components/chemistry/` (`Equation.jsx`, `IonDiagram.jsx`, `SaltCard.jsx`, `ReactionPanel.jsx`)
   - `components/assessment/` (`QuestionCard.jsx`, `QuizResult.jsx`, `FeedbackPanel.jsx`)
   - `services/` (`hydrolysis.ts`, `phCalculator.ts`, `assessment.ts`, `progressStorage.ts`)
2. **Interaktivitas Wajib**:
   - Tidak ada tombol dekoratif tanpa aksi (setiap tombol harus memicu navigasi, modal penjelasan, simulasi, kalkulasi, atau umpan balik yang jelas).
3. **Aksesibilitas (a11y)**:
   - Gunakan elemen semantik HTML5 (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`).
   - Sediakan atribut `aria-label`, navigasi keyboard ramah tabulasi, dan rasio kontras warna standar WCAG AA/AAA.
