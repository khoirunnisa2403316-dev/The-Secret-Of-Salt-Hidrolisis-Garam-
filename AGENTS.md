# AGENTS GUIDELINES — HYDROLYSIS ADVENTURE

Pedoman arsitektur kode, standar UI/UX edukasi sains, dan kepatuhan ilmiah untuk pengembangan website pembelajaran Kimia Interaktif **Hydrolysis Adventure**.

---

## 1. Peran dan Prinsip Utama
- **Peran**: Senior React Developer & UI/UX Designer Edukasi Sains.
- **Tujuan**: Menghadirkan pengalaman belajar kimia yang interaktif, menyenangkan (*joyful*), bermakna (*meaningful*), akurat secara saintifik, dan bebas dari miskonsepsi.

---

## 2. Standar Desain & Visual Identity (PRD Compliance)
Gunakan palet warna resmi yang telah ditentukan:
- **Fresh Teal**: `#20B8AA` (Aksen utama sains, kesegaran, inovasi)
- **Deep Navy**: `#243B64` (Warna dasar tipografi, latar kontras, kestabilan)
- **Sunny Yellow**: `#FFD166` (Energi, highlight konsep penting, peringatan positif)
- **Coral**: `#FF887A` (Aksen asam/termokimia, tombol aksi interaktif)
- **Soft Purple**: `#A995F5` (Spesies ion, nuansa basa/larutan, keanggunan)
- **Warm Ivory**: `#FFF9EC` (Latar belakang lembut ramah mata, kartu netral)

### Elemen Visual:
1. Kartu membulat (*border-radius: 16px - 24px*) dengan bayangan lembut (*soft elevation shadows*).
2. Ilustrasi laboratorium modern: gelas kimia (*beaker*), erlenmeyer, pipet, dan partikel ionik.
3. Tipografi modern (*Plus Jakarta Sans* / *Outfit*) dengan hierarki jelas.
4. Hindari desain kekanak-kanakan (*childish*) serta hindari tampilan teks yang terlalu padat.
5. Animasi ringan dan halus (*micro-interactions*), serta mendukung opsi pengurangan gerakan (*reduced-motion*).

---

## 3. Ketepatan Konten Kimia (Scientific Accuracy)
1. **Notasi Kimia & Persamaan Reaksi**:
   - Selalu gunakan penulisan ion dan fase yang benar:
     - $NH_4^+ + H_2O \rightleftharpoons NH_3 + H_3O^+$ (menghasilkan sifat asam)
     - $CH_3COO^- + H_2O \rightleftharpoons CH_3COOH + OH^-$ (menghasilkan sifat basa)
     - $KCl$ atau $NaCl$: Garam dari asam kuat dan basa kuat, ion tidak bereaksi dengan air secara signifikan (pH netral).
2. **Pencegahan Miskonsepsi**:
   - Jelaskan bahwa pelarutan berbeda dengan hidrolisis (tidak semua ion bereaksi dengan molekul air).
   - pH netral bernilai 7 secara khusus pada suhu $25^\circ\text{C}$ ($K_w = 1.0 \times 10^{-14}$), bukan pada sembarang suhu.
   - Sifat garam dari asam lemah dan basa lemah ditentukan oleh perbandingan $K_a$ dan $K_b$.

---

## 4. Struktur Komponen & Kode
1. **Pemisahan Komponen**:
   - `Navbar.jsx`: Memuat identitas media edukasi, status tingkatan kelas (SMA XI), navigasi responsif, dan opsi tema/bantuan.
   - `HeroSection.jsx`: Memuat judul pemantik, fenomena rasa ingin tahu (*curiosity hook*), tujuan belajar terukur, dan tombol aksi "Mulai Belajar" dengan simulasi lab interaktif terintegrasi.
   - `TopicCards.jsx`: Tiga kartu topik prasyarat/inti (**Stoikiometri**, **Termokimia**, **Larutan Asam–Basa**) yang dilengkapi modal detail materi, ringkasan rumus, dan kuis pemahaman konsep.
2. **Interaktivitas Wajib**:
   - Tidak ada tombol dekoratif tanpa aksi (setiap tombol harus memicu navigasi, modal penjelasan, simulasi, atau umpan balik yang jelas).
3. **Aksesibilitas (a11y)**:
   - Gunakan elemen semantik HTML5 (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`).
   - Sediakan atribut `aria-label`, navigasi keyboard yang ramah tabulasi, dan rasio kontras warna yang memenuhi standar WCAG.
