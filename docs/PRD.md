
# PRODUCT REQUIREMENTS DOCUMENT (PRD)
# THE SECRET OF SALT
## WEBSITE PEMBELAJARAN INTERAKTIF HIDROLISIS GARAM
### Kimia SMA/MA Kelas XI — Fase F

---

# DOKUMEN IDENTITAS PRODUK

Nama Produk       : The Secret of Salt
Jenis Produk      : Educational Learning Website
Bidang            : Pendidikan Kimia
Jenjang           : SMA/MA Kelas XI
Mata Pelajaran    : Kimia
Materi Utama      : Hidrolisis Garam
Bahasa            : Bahasa Indonesia
Platform          : Website responsif
Target Pengguna   : Siswa dan guru Kimia
Versi Dokumen     : 2.0 — Comprehensive PRD
Status            : Spesifikasi pengembangan
Prioritas Produk  : Pembelajaran konseptual, simulasi, kalkulator,
                    latihan, dan evaluasi

---

# DAFTAR ISI

1. Ringkasan Produk
2. Latar Belakang
3. Visi, Misi, dan Tujuan Produk
4. Target Pengguna dan User Persona
5. Capaian dan Tujuan Pembelajaran
6. Ruang Lingkup Produk
7. Struktur Navigasi Website
8. Desain UI/UX
9. Spesifikasi Halaman Beranda
10. Halaman Orientasi Pembelajaran
11. Modul Materi 1: Konsep Dasar
12. Modul Materi 2: Klasifikasi Garam
13. Modul Materi 3: Mekanisme Hidrolisis
14. Modul Materi 4: Tetapan Hidrolisis
15. Modul Materi 5: Perhitungan pH
16. Modul Materi 6: Penerapan Hidrolisis
17. Simulasi Interaktif
18. Kalkulator pH
19. Contoh Soal dan Pembahasan
20. Latihan Mandiri
21. Kuis Interaktif
22. Evaluasi Akhir
23. Sistem Penilaian
24. Progress Belajar
25. Glosarium
26. Referensi dan Sumber Belajar
27. Spesifikasi Fungsional
28. Spesifikasi Teknis
29. Struktur Data
30. Struktur Folder Proyek
31. Kebutuhan Keamanan dan Privasi
32. Aksesibilitas
33. Non-Functional Requirements
34. Acceptance Criteria
35. Testing Plan
36. Prioritas Pengembangan
37. Indikator Keberhasilan Produk
38. Risiko dan Mitigasi
39. Prompt Implementasi untuk AI Coding
40. Definition of Done

==================================================
# 1. RINGKASAN PRODUK
==================================================

## 1.1 Deskripsi Produk

The Secret of Salt adalah website pembelajaran Kimia interaktif
yang dirancang untuk membantu siswa kelas XI SMA/MA mempelajari
materi hidrolisis garam secara sistematis, visual, dan kontekstual.

Website tidak hanya menyajikan teks dan rumus, tetapi juga
mengintegrasikan:

- Materi konseptual.
- Ilustrasi partikel.
- Animasi reaksi ion dengan air.
- Simulasi klasifikasi garam.
- Kalkulator pH.
- Contoh soal bertahap.
- Latihan mandiri.
- Kuis otomatis.
- Evaluasi akhir.
- Umpan balik pembelajaran.
- Ringkasan dan glosarium.
- Pemantauan progres belajar.

Website harus memungkinkan siswa belajar mandiri dari konsep
paling dasar sampai mampu menganalisis reaksi hidrolisis
dan menyelesaikan perhitungan pH.

## 1.2 Permasalahan yang Ingin Diselesaikan

Permasalahan utama pembelajaran hidrolisis garam:

1. Siswa kesulitan membedakan ion yang mengalami hidrolisis
   dan ion yang tidak mengalami hidrolisis berarti.

2. Siswa sering menghafal klasifikasi garam tanpa memahami
   hubungan kekuatan asam, kekuatan basa, dan sifat larutan.

3. Siswa kesulitan menulis persamaan reaksi hidrolisis.

4. Siswa kesulitan menentukan rumus yang sesuai untuk
   menghitung pH setiap jenis garam.

5. Siswa sering keliru membedakan Ka, Kb, Kh, dan Kw.

6. Siswa mengalami kesulitan menghubungkan pengamatan
   makroskopis, model partikel submikroskopis, dan persamaan
   kimia simbolik.

7. Media pembelajaran yang hanya berupa teks dan rumus
   belum tentu membantu siswa membangun pemahaman konseptual.

## 1.3 Solusi Produk

Website menyediakan pembelajaran bertahap:

TAHAP 1: KENALI
Mengenal garam, asam, basa, dan konsep kesetimbangan.

TAHAP 2: PAHAMI
Memahami ionisasi, ion konjugasi, dan reaksi dengan air.

TAHAP 3: IDENTIFIKASI
Menentukan ion yang mengalami hidrolisis.

TAHAP 4: ANALISIS
Menentukan sifat asam, basa, atau netral.

TAHAP 5: HITUNG
Menggunakan tetapan hidrolisis untuk menentukan pH.

TAHAP 6: TERAPKAN
Menyelesaikan persoalan dan menganalisis fenomena sehari-hari.

TAHAP 7: EVALUASI
Menguji pemahaman dan memperbaiki miskonsepsi.

## 1.4 Unique Value Proposition

Keunggulan utama produk:

- Materi tersusun dari dasar ke tingkat penerapan.
- Visualisasi menjelaskan perilaku ion secara konseptual.
- Kalkulator tidak hanya memberikan hasil, tetapi juga
  memperlihatkan langkah perhitungan.
- Latihan memberikan pembahasan berdasarkan alasan ilmiah.
- Desain ramah bagi siswa yang merasa kesulitan belajar kimia.
- Materi, simulasi, dan latihan terintegrasi dalam satu website.

==================================================
# 2. LATAR BELAKANG
==================================================

Hidrolisis garam merupakan materi yang menghubungkan konsep
asam-basa, kesetimbangan kimia, kekuatan asam dan basa,
ionisasi, serta perhitungan pH.

Pemahaman materi membutuhkan tiga representasi kimia:

A. REPRESENTASI MAKROSKOPIS
Mengamati sifat larutan, perubahan indikator, atau nilai pH.

B. REPRESENTASI SUBMIKROSKOPIS
Memahami interaksi ion dengan molekul air dan pembentukan
spesies seperti H₃O⁺ atau OH⁻.

C. REPRESENTASI SIMBOLIK
Menuliskan rumus garam, persamaan reaksi, tetapan kesetimbangan,
dan perhitungan pH.

Website harus menghubungkan ketiga representasi tersebut
secara eksplisit.

Contoh pembelajaran CH₃COONa:

Makroskopis:
Larutan menunjukkan sifat basa.

Submikroskopis:
Ion CH₃COO⁻ menerima proton dari air sehingga terbentuk
CH₃COOH dan OH⁻.

Simbolik:
CH₃COO⁻ + H₂O ⇌ CH₃COOH + OH⁻

Siswa harus memahami bahwa sifat basa berasal dari reaksi
ion dengan air, bukan sekadar karena garam berasal dari
suatu reaksi netralisasi.

==================================================
# 3. VISI, MISI, DAN TUJUAN PRODUK
==================================================

## 3.1 Visi

Menjadi media pembelajaran Kimia digital yang membantu siswa
memahami konsep kimia melalui pengalaman belajar interaktif,
visual, kontekstual, dan berbasis penalaran ilmiah.

## 3.2 Misi

1. Menyajikan materi hidrolisis garam secara akurat.
2. Menghubungkan teori, visualisasi, dan perhitungan.
3. Mengembangkan kemampuan analisis dan pemecahan masalah.
4. Memberikan latihan dengan umpan balik yang bermakna.
5. Membantu guru memanfaatkan teknologi dalam pembelajaran.

## 3.3 Tujuan Produk

Pada akhir penggunaan website, siswa diharapkan mampu:

- Menjelaskan konsep hidrolisis garam.
- Menghubungkan sifat garam dengan asam dan basa asalnya.
- Mengklasifikasikan empat jenis garam.
- Mengidentifikasi ion yang mengalami hidrolisis.
- Menuliskan reaksi hidrolisis.
- Menentukan tetapan hidrolisis.
- Menghitung pH menggunakan rumus yang tepat.
- Menganalisis data hasil simulasi.
- Menyelesaikan masalah kontekstual.
- Menjelaskan alasan ilmiah di balik suatu jawaban.

==================================================
# 4. TARGET PENGGUNA DAN USER PERSONA
==================================================

## 4.1 Persona Siswa

Nama persona:
Siswa kelas XI SMA.

Karakteristik:
- Memiliki kemampuan awal kimia yang beragam.
- Membutuhkan penjelasan sederhana dan bertahap.
- Mengakses website melalui ponsel atau laptop.
- Membutuhkan contoh soal beserta langkah penyelesaian.
- Membutuhkan latihan dengan umpan balik langsung.

Kebutuhan:
- Memahami konsep tanpa menghafal semata.
- Mengetahui alasan suatu ion terhidrolisis.
- Mengetahui rumus yang harus digunakan.
- Mengetahui kesalahan dalam perhitungan.
- Mengetahui materi yang perlu diulang.

## 4.2 Persona Guru

Karakteristik:
- Mengajar Kimia SMA/MA.
- Membutuhkan media pembelajaran digital.
- Membutuhkan materi dan evaluasi yang sistematis.
- Memerlukan contoh penerapan konsep.

Kebutuhan:
- Tujuan pembelajaran yang jelas.
- Materi sesuai tingkat siswa.
- Simulasi untuk diskusi kelas.
- Latihan dan evaluasi.
- Referensi materi yang dapat diperiksa.

## 4.3 User Stories

Sebagai siswa, saya ingin membaca materi dari konsep dasar
agar dapat memahami hidrolisis sebelum menghitung pH.

Sebagai siswa, saya ingin memilih suatu garam pada simulasi
agar dapat melihat ion yang mengalami hidrolisis.

Sebagai siswa, saya ingin memasukkan data ke kalkulator
agar dapat memeriksa proses perhitungan pH.

Sebagai siswa, saya ingin menerima pembahasan setelah kuis
agar dapat mengetahui alasan jawaban benar atau salah.

Sebagai guru, saya ingin menggunakan simulasi di kelas
agar siswa dapat mendiskusikan reaksi ion dengan air.

==================================================
# 5. CAPAIAN DAN TUJUAN PEMBELAJARAN
==================================================

## 5.1 Acuan Kurikulum

Materi dirancang untuk Kimia SMA/MA kelas XI Fase F,
dengan penyesuaian terhadap capaian pembelajaran dan
alur tujuan pembelajaran yang digunakan satuan pendidikan.

Dokumen final harus diverifikasi dengan dokumen kurikulum
resmi yang berlaku di sekolah pengguna.

## 5.2 Tujuan Pembelajaran

TP 1 — Pemahaman Konsep
Siswa mampu menjelaskan pengertian hidrolisis garam serta
hubungannya dengan kekuatan asam dan basa asal.

TP 2 — Klasifikasi
Siswa mampu mengklasifikasikan garam berdasarkan asam dan
basa pembentuknya serta memprediksi sifat larutannya.

TP 3 — Analisis Reaksi
Siswa mampu menentukan ion yang mengalami hidrolisis
dan menuliskan persamaan reaksinya dengan benar.

TP 4 — Perhitungan
Siswa mampu menentukan Kh dan menghitung pH larutan garam
berdasarkan data yang diberikan.

TP 5 — Interpretasi
Siswa mampu menafsirkan data pH atau hasil simulasi untuk
menjelaskan sifat larutan secara ilmiah.

TP 6 — Pemecahan Masalah
Siswa mampu menyelesaikan masalah kontekstual terkait
hidrolisis garam menggunakan konsep dan data yang relevan.

## 5.3 Pemetaan Materi dan Tujuan

Materi 1: Konsep dasar → TP 1
Materi 2: Klasifikasi garam → TP 2
Materi 3: Reaksi hidrolisis → TP 3
Materi 4: Tetapan hidrolisis → TP 4
Materi 5: Perhitungan pH → TP 4
Materi 6: Penerapan dan interpretasi → TP 5 dan TP 6

## 5.4 Indikator Keberhasilan Siswa

Siswa mampu:
- Menjelaskan konsep dengan kata-kata sendiri.
- Mengidentifikasi asal asam dan basa suatu garam.
- Menentukan ion yang mengalami hidrolisis.
- Menuliskan reaksi yang setara.
- Memilih rumus berdasarkan jenis garam.
- Menunjukkan proses perhitungan.
- Menafsirkan hasil perhitungan sesuai sifat larutan.

==================================================
# 6. RUANG LINGKUP PRODUK
==================================================

## 6.1 Fitur Wajib (MVP)

1. Beranda.
2. Tujuan pembelajaran.
3. Modul materi lengkap.
4. Tabel klasifikasi garam.
5. Simulasi hidrolisis.
6. Contoh soal.
7. Kalkulator pH.
8. Kuis pilihan ganda.
9. Evaluasi akhir.
10. Pembahasan jawaban.
11. Ringkasan materi.
12. Glosarium.
13. Penyimpanan progres lokal.

## 6.2 Fitur Pengembangan Lanjutan

- Akun guru dan siswa.
- Dashboard guru.
- Rekap nilai siswa.
- Pengelolaan bank soal.
- Ekspor nilai.
- Laporan hasil evaluasi.
- Pembuatan kuis berdasarkan topik.
- Penyimpanan progres melalui server.
- Fitur kelas dan kode kelas.

Fitur lanjutan tidak boleh menghambat tersedianya fitur
pembelajaran inti.

## 6.3 Di Luar Ruang Lingkup Versi Pertama

- Sistem pembelajaran berbayar.
- Integrasi pembayaran.
- Forum publik.
- Obrolan antarpengguna.
- Peringkat kompetitif antarsiswa.
- Sistem kecerdasan buatan yang membutuhkan layanan eksternal.

==================================================
# 7. STRUKTUR NAVIGASI WEBSITE
==================================================

## 7.1 Navigasi Utama

Beranda
├── Mulai Belajar
├── Tujuan Pembelajaran
├── Materi
│   ├── Konsep Dasar
│   ├── Klasifikasi Garam
│   ├── Mekanisme Hidrolisis
│   ├── Tetapan Hidrolisis
│   ├── Perhitungan pH
│   └── Penerapan
├── Laboratorium Virtual
│   ├── Pilih Garam
│   ├── Amati Ion
│   └── Analisis Hasil
├── Kalkulator pH
├── Latihan
├── Kuis
├── Evaluasi Akhir
├── Ringkasan
├── Glosarium
└── Referensi

## 7.2 Aturan Navigasi

- Navbar harus konsisten pada semua halaman utama.
- Menu aktif harus memiliki penanda visual.
- Tombol kembali harus berfungsi.
- Setiap modul menyediakan navigasi sebelumnya dan berikutnya.
- Pengguna dapat membuka materi tanpa harus menyelesaikan
  semua modul sebelumnya.
- Progres belajar ditampilkan secara jelas.
- Semua tautan harus mengarah ke halaman yang benar.

==================================================
# 8. DESAIN UI/UX
==================================================

## 8.1 Konsep Desain

Tema:
Modern Chemistry Learning Laboratory.

Karakter desain:
- Menyenangkan.
- Ramah bagi siswa.
- Minimalis.
- Tidak terlalu ramai.
- Ilmiah tetapi mudah dipahami.
- Memiliki ilustrasi laboratorium.
- Mengutamakan keterbacaan.

## 8.2 Palet Warna

Primary Blue     : #4A90C7
Light Blue       : #D9F0FF
Deep Navy        : #183153
White            : #FFFFFF
Soft Background  : #F5FAFF
Accent Yellow    : #FFD166
Soft Green       : #70C1A0
Soft Red         : #E98989
Neutral Gray     : #64748B

Warna asam dan basa hanya menjadi petunjuk tambahan.
Setiap informasi harus tetap dapat dipahami melalui teks,
label, ikon, dan bentuk visual.

## 8.3 Tipografi

Heading:
Poppins atau font sans-serif sejenis.

Body:
Inter atau sans-serif sejenis.

Persamaan:
Font matematika atau MathJax/KaTeX.

Ketentuan:
- Ukuran teks isi nyaman dibaca.
- Persamaan tidak terpotong.
- Subskrip dan superskrip terlihat jelas.
- Kontras teks dengan latar belakang memadai.

## 8.4 Komponen UI

- Navbar.
- Hero section.
- Tombol aksi utama.
- Kartu materi.
- Kartu tujuan pembelajaran.
- Breadcrumb.
- Progress bar.
- Tab pembelajaran.
- Accordion.
- Kartu contoh soal.
- Input kalkulator.
- Kartu hasil perhitungan.
- Diagram reaksi.
- Modal pembahasan.
- Kartu evaluasi.
- Footer.

## 8.5 Responsivitas

Desktop:
- Navbar horizontal.
- Konten menggunakan grid.
- Materi dan ilustrasi dapat ditampilkan berdampingan.

Tablet:
- Grid menyesuaikan lebar.
- Navigasi tetap mudah digunakan.

Mobile:
- Navbar menjadi menu ringkas.
- Kartu tersusun satu kolom.
- Persamaan dapat digulir secara horizontal.
- Tombol memiliki area sentuh memadai.
- Tidak ada konten penting yang terpotong.

==================================================
# 9. SPESIFIKASI HALAMAN BERANDA
==================================================

## 9.1 Hero Section

Elemen:
- Logo berbentuk gelas kimia.
- Nama The Secret of Salt.
- Judul "Mengungkap Rahasia Hidrolisis Garam".
- Deskripsi produk.
- Tombol "Mulai Belajar".
- Tombol "Jelajahi Simulasi".
- Ilustrasi molekul air dan ion.

Teks pengantar:

"Apakah semua garam menghasilkan larutan netral?
Ternyata tidak. Pelajari bagaimana ion-ion garam bereaksi
dengan air dan menentukan sifat larutan."

## 9.2 Bagian Peta Belajar

Tampilkan urutan:

01. Kenali Garam
02. Pahami Hidrolisis
03. Identifikasi Ion
04. Pelajari Rumus
05. Hitung pH
06. Uji Pemahaman

Setiap kartu memiliki tombol menuju materi terkait.

## 9.3 Bagian Fitur Unggulan

Kartu 1:
Materi Interaktif
Penjelasan, persamaan, dan ilustrasi konsep.

Kartu 2:
Laboratorium Virtual
Amati ion yang mengalami hidrolisis.

Kartu 3:
Kalkulator pH
Pelajari perhitungan langkah demi langkah.

Kartu 4:
Kuis Kimia
Uji pemahaman dan baca pembahasan.

## 9.4 Bagian Progress

Tampilkan:
- Persentase penyelesaian materi.
- Jumlah modul selesai.
- Skor kuis terakhir.
- Tombol melanjutkan materi.

Progress dihitung berdasarkan status modul yang tersimpan.

## 9.5 Footer

Berisi:
- Nama produk.
- Deskripsi singkat.
- Navigasi materi.
- Tujuan pembelajaran.
- Referensi.
- Informasi penggunaan.
- Catatan bahwa kalkulator pendidikan menggunakan
  asumsi perhitungan yang dijelaskan kepada pengguna.

==================================================
# 10. HALAMAN ORIENTASI PEMBELAJARAN
==================================================

Halaman ini muncul ketika siswa memilih "Mulai Belajar".

## 10.1 Konten

- Pengantar materi.
- Tujuan pembelajaran.
- Peta konsep.
- Prasyarat belajar.
- Estimasi waktu belajar.
- Petunjuk navigasi.

## 10.2 Prasyarat

Siswa sebaiknya memahami:
- Asam dan basa.
- Asam kuat dan asam lemah.
- Basa kuat dan basa lemah.
- Ionisasi dalam air.
- Kesetimbangan kimia dasar.
- Konsep pH dan pOH.
- Logaritma dasar.

## 10.3 Diagnostik Awal

Sediakan lima pertanyaan singkat untuk mengetahui
pemahaman awal siswa.

Contoh:
1. Apa yang dimaksud dengan asam?
2. Apa perbedaan asam kuat dan asam lemah?
3. Apa yang dimaksud dengan ionisasi?
4. Berapa pH netral pada suhu 25°C?
5. Apakah semua garam bersifat netral?

Diagnostik tidak langsung menentukan kelulusan.
Hasilnya digunakan untuk merekomendasikan materi prasyarat.

==================================================
# 11. MODUL MATERI 1: KONSEP DASAR
==================================================

## 11.1 Tujuan Modul

Siswa mampu menjelaskan:
- Pengertian garam.
- Pengertian hidrolisis.
- Pengertian hidrolisis garam.
- Hubungan asam, basa, dan garam.
- Konsep ion konjugasi.

## 11.2 Materi Garam

Garam merupakan senyawa ionik yang terdiri atas kation
dan anion. Banyak garam terbentuk melalui reaksi asam-basa.

Contoh:
HCl + NaOH → NaCl + H₂O

NaCl terbentuk dari:
- HCl sebagai asam kuat.
- NaOH sebagai basa kuat.

Contoh lain:
CH₃COOH + NaOH → CH₃COONa + H₂O

CH₃COONa terbentuk dari:
- CH₃COOH sebagai asam lemah.
- NaOH sebagai basa kuat.

Catatan:
Pembentukan garam tidak selalu harus melalui netralisasi
langsung asam dan basa.

## 11.3 Pengertian Hidrolisis

Hidrolisis adalah reaksi suatu spesies kimia dengan air.

Dalam hidrolisis garam, ion tertentu dari garam bereaksi
dengan air dan memengaruhi kesetimbangan ion dalam larutan.

## 11.4 Pengertian Hidrolisis Garam

Hidrolisis garam adalah reaksi ion-ion garam dengan air
yang dapat menghasilkan perubahan konsentrasi H₃O⁺ atau
OH⁻ sehingga memengaruhi pH larutan.

Tidak semua ion garam mengalami hidrolisis berarti.

## 11.5 Konsep Air

Air mengalami autoionisasi:

2H₂O ⇌ H₃O⁺ + OH⁻

Pada suhu 25°C:

Kw = [H₃O⁺][OH⁻] = 1,0 × 10⁻¹⁴

Dalam pendekatan larutan encer pada suhu 25°C:

pH + pOH = 14

pH = -log[H₃O⁺]

pOH = -log[OH⁻]

pH netral sekitar 7 pada suhu 25°C.

## 11.6 Konsep Asam dan Basa Konjugasi

Asam konjugasi dan basa konjugasi berhubungan melalui
perpindahan satu proton.

Contoh:
CH₃COOH ⇌ H⁺ + CH₃COO⁻

CH₃COOH adalah asam.
CH₃COO⁻ adalah basa konjugasinya.

Contoh:
NH₄⁺ ⇌ H⁺ + NH₃

NH₄⁺ adalah asam konjugasi.
NH₃ adalah basa.

## 11.7 Interaksi Pengguna

Sediakan kartu interaktif:
- "Apa itu garam?"
- "Apa itu hidrolisis?"
- "Mengapa garam dapat bersifat asam?"
- "Mengapa garam dapat bersifat basa?"

Setiap kartu menampilkan penjelasan setelah diklik.

## 11.8 Cek Pemahaman

Pertanyaan:
Mengapa larutan garam tidak selalu netral?

Jawaban yang diharapkan:
Karena ion tertentu dari garam dapat bereaksi dengan air
dan mengubah konsentrasi H₃O⁺ atau OH⁻.

==================================================
# 12. MODUL MATERI 2: KLASIFIKASI GARAM
==================================================

## 12.1 Tujuan Modul

Siswa dapat:
- Menentukan asam dan basa asal garam.
- Mengidentifikasi kekuatan asam dan basa.
- Menentukan ion yang terhidrolisis.
- Memprediksi sifat larutan.

## 12.2 Jenis Pertama: Asam Kuat + Basa Kuat

Contoh:
NaCl, KNO₃.

Reaksi pembentukan:
HCl + NaOH → NaCl + H₂O

Disosiasi:
NaCl → Na⁺ + Cl⁻

Na⁺ berasal dari basa kuat.
Cl⁻ berasal dari asam kuat.

Kedua ion tidak mengalami hidrolisis berarti.

Kesimpulan:
Larutan umumnya netral.

Pada suhu 25°C, pH larutan encer idealnya mendekati 7.

## 12.3 Jenis Kedua: Asam Kuat + Basa Lemah

Contoh:
NH₄Cl.

Reaksi pembentukan:
HCl + NH₃ → NH₄Cl

Disosiasi:
NH₄Cl → NH₄⁺ + Cl⁻

Cl⁻ tidak mengalami hidrolisis berarti.

NH₄⁺ bereaksi dengan air:

NH₄⁺ + H₂O ⇌ NH₃ + H₃O⁺

Pembentukan H₃O⁺ menyebabkan larutan bersifat asam.

Kesimpulan:
Garam dari asam kuat dan basa lemah umumnya menghasilkan
larutan asam.

## 12.4 Jenis Ketiga: Asam Lemah + Basa Kuat

Contoh:
CH₃COONa.

Disosiasi:
CH₃COONa → CH₃COO⁻ + Na⁺

Na⁺ tidak mengalami hidrolisis berarti.

CH₃COO⁻ bereaksi dengan air:

CH₃COO⁻ + H₂O ⇌ CH₃COOH + OH⁻

Pembentukan OH⁻ menyebabkan larutan bersifat basa.

Kesimpulan:
Garam dari asam lemah dan basa kuat umumnya menghasilkan
larutan basa.

## 12.5 Jenis Keempat: Asam Lemah + Basa Lemah

Contoh:
NH₄CH₃COO.

Ion yang terlibat:
NH₄⁺ dan CH₃COO⁻.

Reaksi kation:
NH₄⁺ + H₂O ⇌ NH₃ + H₃O⁺

Reaksi anion:
CH₃COO⁻ + H₂O ⇌ CH₃COOH + OH⁻

Kedua ion dapat mengalami hidrolisis.

Sifat larutan ditentukan oleh perbandingan Ka asam asal
dan Kb basa asal.

Jika Ka > Kb:
Larutan cenderung asam.

Jika Kb > Ka:
Larutan cenderung basa.

Jika Ka = Kb:
pH mendekati 7 dalam pendekatan ideal pada suhu 25°C.

## 12.6 Tabel Interaktif

Kolom:
- Jenis garam.
- Contoh.
- Ion yang terhidrolisis.
- Sifat larutan.
- Penjelasan.

Baris:
1. Asam kuat + basa kuat.
2. Asam kuat + basa lemah.
3. Asam lemah + basa kuat.
4. Asam lemah + basa lemah.

Tabel harus dapat digunakan pada perangkat mobile.

## 12.7 Kartu Perbandingan

Setiap jenis garam memiliki tombol:
"Lihat Reaksi"
"Lihat Ion"
"Lihat Alasan"

Saat dipilih, tampilkan persamaan reaksi dan penjelasan
mengapa larutan memiliki sifat tertentu.

==================================================
# 13. MODUL MATERI 3: MEKANISME HIDROLISIS
==================================================

## 13.1 Tujuan Modul

Siswa mampu menjelaskan proses hidrolisis secara simbolik
dan submikroskopis.

## 13.2 Ion yang Tidak Mengalami Hidrolisis Berarti

Kation dari basa kuat, seperti Na⁺ dan K⁺, umumnya tidak
mengalami hidrolisis berarti dalam air.

Anion dari asam kuat, seperti Cl⁻ dan NO₃⁻, umumnya tidak
mengalami hidrolisis berarti.

## 13.3 Hidrolisis Kation

Contoh:
NH₄⁺ + H₂O ⇌ NH₃ + H₃O⁺

Penjelasan:
NH₄⁺ memberikan proton kepada H₂O.

Akibat:
Konsentrasi H₃O⁺ bertambah.

Sifat larutan:
Asam.

## 13.4 Hidrolisis Anion

Contoh:
CH₃COO⁻ + H₂O ⇌ CH₃COOH + OH⁻

Penjelasan:
CH₃COO⁻ menerima proton dari H₂O.

Akibat:
Konsentrasi OH⁻ bertambah.

Sifat larutan:
Basa.

## 13.5 Diagram Tiga Representasi

Makroskopis:
Larutan NH₄Cl menunjukkan sifat asam.

Submikroskopis:
NH₄⁺ bereaksi dengan H₂O dan membentuk H₃O⁺.

Simbolik:
NH₄⁺ + H₂O ⇌ NH₃ + H₃O⁺

Website harus menyajikan ketiganya secara berurutan.

## 13.6 Interaksi

Siswa memilih satu ion.

Website menampilkan:
1. Asal ion.
2. Pasangan asam atau basa konjugasi.
3. Reaksi dengan air.
4. Produk reaksi.
5. Pengaruh terhadap pH.

==================================================
# 14. MODUL MATERI 4: TETAPAN HIDROLISIS
==================================================

## 14.1 Tujuan Modul

Siswa mampu:
- Menjelaskan Kh.
- Menghubungkan Kh dengan Ka, Kb, dan Kw.
- Menentukan Kh sesuai jenis garam.
- Menggunakan Kh dalam perhitungan.

## 14.2 Tetapan Hidrolisis Kation

Untuk kation yang merupakan asam konjugasi basa lemah:

NH₄⁺ + H₂O ⇌ NH₃ + H₃O⁺

Kh = [NH₃][H₃O⁺] / [NH₄⁺]

Hubungan:
Kh = Kw / Kb

Kb adalah tetapan ionisasi basa lemah asal.

## 14.3 Tetapan Hidrolisis Anion

Untuk anion yang merupakan basa konjugasi asam lemah:

CH₃COO⁻ + H₂O ⇌ CH₃COOH + OH⁻

Kh = [CH₃COOH][OH⁻] / [CH₃COO⁻]

Hubungan:
Kh = Kw / Ka

Ka adalah tetapan ionisasi asam lemah asal.

## 14.4 Hubungan untuk Garam dari Asam Lemah dan Basa Lemah

Untuk kedua ion yang terhidrolisis:

Kh,kation = Kw / Kb

Kh,anion = Kw / Ka

Jangan menyamakan kedua tetapan tersebut tanpa memeriksa
reaksi dan definisi tetapan yang digunakan.

## 14.5 Faktor yang Mempengaruhi Perhitungan

- Konsentrasi garam.
- Nilai Ka.
- Nilai Kb.
- Suhu.
- Asumsi larutan encer.
- Besarnya perubahan konsentrasi saat kesetimbangan.

## 14.6 Interaksi

Sediakan alat bantu pemilihan rumus.

Pertanyaan:
"Ion apa yang mengalami hidrolisis?"

Jika kation dari basa lemah:
Tampilkan Kh = Kw/Kb.

Jika anion dari asam lemah:
Tampilkan Kh = Kw/Ka.

Jika keduanya:
Tampilkan penjelasan kedua tetapan dan rumus pH yang relevan.

==================================================
# 15. MODUL MATERI 5: PERHITUNGAN pH
==================================================

## 15.1 Tujuan Modul

Siswa mampu menghitung pH larutan garam dengan langkah
yang benar dan memahami alasan pemilihan rumus.

## 15.2 Alur Penyelesaian

LANGKAH 1:
Identifikasi jenis garam.

LANGKAH 2:
Tentukan ion yang mengalami hidrolisis.

LANGKAH 3:
Tentukan nilai Kh.

LANGKAH 4:
Tentukan konsentrasi H₃O⁺ atau OH⁻.

LANGKAH 5:
Hitung pH atau pOH.

LANGKAH 6:
Tentukan sifat larutan.

## 15.3 Garam Asam Kuat dan Basa Kuat

Contoh:
NaCl 0,1 M.

NaCl → Na⁺ + Cl⁻

Kedua ion tidak mengalami hidrolisis berarti.

Pada suhu 25°C:
pH mendekati 7 untuk larutan encer ideal.

## 15.4 Garam Asam Kuat dan Basa Lemah

Contoh:
NH₄Cl 0,1 M.
Kb NH₃ = 1,0 × 10⁻⁵.
Kw = 1,0 × 10⁻¹⁴.

Langkah 1:
Kh = Kw/Kb

Kh = 10⁻¹⁴ / 10⁻⁵
Kh = 10⁻⁹

Langkah 2:
[H₃O⁺] ≈ √(Kh × C)

[H₃O⁺] ≈ √(10⁻⁹ × 0,1)

[H₃O⁺] ≈ 10⁻⁵ M

Langkah 3:
pH = -log[H₃O⁺]

pH ≈ 5

Kesimpulan:
Larutan bersifat asam.

Catatan:
Hasil ini menggunakan pendekatan hidrolisis kecil.

## 15.5 Garam Asam Lemah dan Basa Kuat

Contoh:
CH₃COONa 0,1 M.
Ka CH₃COOH = 1,0 × 10⁻⁵.

Langkah 1:
Kh = Kw/Ka

Kh = 10⁻¹⁴ / 10⁻⁵
Kh = 10⁻⁹

Langkah 2:
[OH⁻] ≈ √(Kh × C)

[OH⁻] ≈ √(10⁻⁹ × 0,1)

[OH⁻] ≈ 10⁻⁵ M

Langkah 3:
pOH = -log[OH⁻] = 5

pH = 14 - 5 = 9

Kesimpulan:
Larutan bersifat basa.

## 15.6 Garam Asam Lemah dan Basa Lemah

Untuk larutan ideal dengan pendekatan yang sesuai pada
suhu 25°C:

pH ≈ 7 + ½ log(Kb/Ka)

Keterangan:
Ka = tetapan ionisasi asam lemah asal.
Kb = tetapan ionisasi basa lemah asal.

Contoh:
Ka = 10⁻⁵ dan Kb = 10⁻⁴.

pH ≈ 7 + ½ log(10⁻⁴/10⁻⁵)

pH ≈ 7 + ½ log(10)

pH ≈ 7,5

Kesimpulan:
Larutan cenderung bersifat basa.

Catatan:
Rumus ini merupakan pendekatan yang memerlukan asumsi
kesetimbangan tertentu. Untuk kondisi di luar asumsi,
gunakan penyelesaian kesetimbangan yang lebih lengkap.

## 15.7 Perhitungan Tingkat Lanjut

Untuk larutan yang tidak memenuhi asumsi hidrolisis kecil,
website harus menyediakan metode kesetimbangan lengkap.

Metode dapat menggunakan:
- Persamaan kesetimbangan.
- Neraca massa.
- Neraca muatan.
- Kesetimbangan autoionisasi air.

Website tidak boleh selalu menggunakan pendekatan akar
kuadrat tanpa memeriksa kelayakan pendekatannya.

## 15.8 Format Tampilan Jawaban

Setiap penyelesaian memuat:
- Diketahui.
- Ditanya.
- Jenis garam.
- Reaksi hidrolisis.
- Rumus.
- Substitusi nilai.
- Hasil perhitungan.
- Kesimpulan sifat larutan.

==================================================
# 16. MODUL MATERI 6: PENERAPAN HIDROLISIS
==================================================

## 16.1 Tujuan Modul

Siswa mampu menghubungkan hidrolisis garam dengan fenomena
sehari-hari dan penggunaan kimia.

## 16.2 Konteks Pembelajaran

Gunakan konteks:
- Larutan garam dalam kehidupan sehari-hari.
- Penggunaan garam dalam industri.
- Pengolahan air.
- Sistem penyangga dan kesetimbangan asam-basa.
- Pengaruh pH terhadap proses kimia.

Setiap konteks harus memiliki penjelasan yang sesuai dengan
konsep kimia dan tidak menyederhanakan sistem kompleks secara
berlebihan.

## 16.3 Aktivitas Analisis

Berikan data tiga larutan:
- Larutan A: pH 7,0.
- Larutan B: pH 5,5.
- Larutan C: pH 8,5.

Pertanyaan:
1. Mana yang bersifat asam?
2. Mana yang bersifat basa?
3. Apakah pH saja cukup untuk memastikan jenis garam?
4. Data tambahan apa yang diperlukan untuk mengidentifikasi
   ion yang mengalami hidrolisis?

Jawaban harus menjelaskan bahwa pH dapat menunjukkan
sifat larutan, tetapi tidak selalu cukup untuk menentukan
identitas garam atau mekanisme reaksi secara unik.

==================================================
# 17. SIMULASI INTERAKTIF
==================================================

## 17.1 Nama Fitur

Salt Hydrolysis Virtual Lab.

## 17.2 Tujuan

Membantu siswa memvisualisasikan ion, molekul air,
reaksi hidrolisis, dan hubungan reaksi dengan sifat larutan.

## 17.3 Pilihan Garam

Sediakan contoh:
1. NaCl.
2. NH₄Cl.
3. CH₃COONa.
4. NH₄CH₃COO.

Untuk garam keempat, tampilkan bahwa kedua ion dapat
mengalami hidrolisis dan hasil pH bergantung pada nilai
kesetimbangan yang digunakan.

## 17.4 Tampilan Simulasi

Area utama:
- Bejana larutan.
- Representasi molekul air.
- Ion positif dan negatif.
- Panel persamaan reaksi.
- Panel penjelasan.
- Panel hasil analisis.

## 17.5 Alur Interaksi

1. Pengguna memilih garam.
2. Website menampilkan disosiasi garam.
3. Pengguna memilih ion.
4. Website menunjukkan apakah ion mengalami hidrolisis.
5. Website menampilkan persamaan reaksi.
6. Website menjelaskan produk reaksi.
7. Website menjelaskan pengaruh terhadap pH.
8. Pengguna menjawab pertanyaan analisis.

## 17.6 Aturan Ilmiah Visualisasi

- Jumlah partikel tidak boleh mengklaim konsentrasi nyata
  jika gambar hanya bersifat ilustratif.
- Ukuran ion tidak boleh menyesatkan.
- Reaksi reversibel harus ditandai dengan panah kesetimbangan.
- Ion yang tidak mengalami hidrolisis berarti harus diberi
  penjelasan, bukan dihapus dari sistem.
- Animasi tidak boleh menyiratkan bahwa semua ion bereaksi.
- Perubahan pH harus didasarkan pada model perhitungan
  atau data yang dijelaskan.

## 17.7 Kontrol Simulasi

- Mulai.
- Jeda.
- Ulangi.
- Pilih garam.
- Tampilkan reaksi.
- Sembunyikan reaksi.
- Reset simulasi.

## 17.8 Kriteria Keberhasilan

Simulasi harus:
- Memiliki fungsi yang benar.
- Menampilkan reaksi yang sesuai.
- Dapat diakses pada perangkat mobile.
- Tetap dapat dipahami tanpa animasi.
- Menyediakan keterangan teks.

==================================================
# 18. KALKULATOR pH
==================================================

## 18.1 Tujuan

Membantu siswa memilih jenis garam, memasukkan parameter,
dan melihat perhitungan pH secara transparan.

## 18.2 Mode Kalkulator

MODE A:
Asam kuat + basa kuat.

MODE B:
Asam kuat + basa lemah.

MODE C:
Asam lemah + basa kuat.

MODE D:
Asam lemah + basa lemah.

MODE E:
Perhitungan kesetimbangan lanjutan.

## 18.3 Input

- Jenis garam.
- Konsentrasi awal.
- Ka jika diperlukan.
- Kb jika diperlukan.
- Kw atau suhu.
- Satuan konsentrasi.
- Pilihan metode pendekatan.

## 18.4 Validasi

Konsentrasi harus positif.
Ka dan Kb harus positif.
Data wajib tidak boleh kosong.
Nilai numerik harus valid.
Nilai yang tidak realistis harus mendapat peringatan.

Kalkulator tidak boleh menampilkan hasil seolah-olah akurat
jika input tidak cukup.

## 18.5 Output

- Jenis garam.
- Ion yang terhidrolisis.
- Persamaan reaksi.
- Nilai Kh.
- Perhitungan konsentrasi ion.
- pH.
- pOH jika relevan.
- Kategori sifat larutan.
- Langkah perhitungan.
- Asumsi dan batasan metode.

## 18.6 Algoritma

1. Validasi input.
2. Tentukan model kimia yang digunakan.
3. Identifikasi ion yang mengalami hidrolisis.
4. Tentukan konstanta kesetimbangan.
5. Hitung kesetimbangan.
6. Periksa konsistensi hasil.
7. Hitung pH berdasarkan konsentrasi H₃O⁺.
8. Tampilkan langkah dan asumsi.

## 18.7 Contoh Pengujian Kalkulator

Input:
Jenis garam = NH₄Cl
C = 0,1 M
Kb NH₃ = 10⁻⁵
Kw = 10⁻¹⁴

Hasil pendekatan:
Kh = 10⁻⁹
[H₃O⁺] ≈ 10⁻⁵ M
pH ≈ 5

Kalkulator harus menampilkan label:
"Hasil pendekatan — asumsi hidrolisis kecil."

==================================================
# 19. CONTOH SOAL DAN PEMBAHASAN
==================================================

## 19.1 Contoh Soal Konseptual

Soal:
Mengapa larutan NH₄Cl bersifat asam?

Pembahasan:
NH₄Cl terdisosiasi menjadi NH₄⁺ dan Cl⁻.
NH₄⁺ bereaksi dengan air menghasilkan NH₃ dan H₃O⁺.
Cl⁻ tidak mengalami hidrolisis berarti.
Peningkatan H₃O⁺ menyebabkan larutan bersifat asam.

## 19.2 Contoh Soal Klasifikasi

Soal:
Tentukan sifat larutan CH₃COONa.

Pembahasan:
CH₃COONa berasal dari asam lemah CH₃COOH dan basa kuat
NaOH. Ion CH₃COO⁻ mengalami hidrolisis menghasilkan OH⁻.
Larutan bersifat basa.

## 19.3 Contoh Soal Perhitungan

Soal:
Hitung pH larutan CH₃COONa 0,1 M jika
Ka CH₃COOH = 10⁻⁵ dan Kw = 10⁻¹⁴.

Jawaban:
Kh = Kw/Ka = 10⁻⁹

[OH⁻] ≈ √(Kh × C)
[OH⁻] ≈ √(10⁻⁹ × 0,1)
[OH⁻] ≈ 10⁻⁵ M

pOH = 5
pH ≈ 9

## 19.4 Format Pembahasan

Setiap soal wajib menyediakan:
- Konsep yang diuji.
- Jawaban benar.
- Langkah penyelesaian.
- Alasan ilmiah.
- Kesalahan umum.
- Petunjuk belajar lanjutan.

==================================================
# 20. LATIHAN MANDIRI
==================================================

## 20.1 Tingkat Dasar

Fokus:
- Definisi hidrolisis.
- Klasifikasi garam.
- Ion yang terhidrolisis.
- Sifat larutan.

## 20.2 Tingkat Menengah

Fokus:
- Persamaan reaksi.
- Hubungan Ka, Kb, Kw, dan Kh.
- Pemilihan rumus.
- Perhitungan pH sederhana.

## 20.3 Tingkat Lanjut

Fokus:
- Analisis beberapa jenis garam.
- Interpretasi data pH.
- Perhitungan dengan parameter berbeda.
- Evaluasi pendekatan kesetimbangan.
- Pemecahan masalah kontekstual.

## 20.4 Umpan Balik

Jawaban benar:
Tampilkan penjelasan mengapa jawaban benar.

Jawaban salah:
Tampilkan petunjuk terlebih dahulu, lalu pembahasan
lengkap jika pengguna memilih "Lihat Pembahasan".

Jangan hanya menampilkan pesan "Salah".

==================================================
# 21. KUIS INTERAKTIF
==================================================

## 21.1 Spesifikasi

- Pilihan ganda.
- Satu jawaban benar.
- Urutan soal dapat diacak.
- Jawaban dinilai otomatis.
- Pembahasan tersedia.
- Skor akhir ditampilkan.
- Pengguna dapat mengulang kuis.

## 21.2 Contoh Soal

SOAL 1

Garam yang menghasilkan larutan asam adalah ...

A. NaCl
B. KNO₃
C. NH₄Cl
D. CH₃COONa

Kunci: C

Pembahasan:
NH₄⁺ mengalami hidrolisis dan menghasilkan H₃O⁺.

SOAL 2

Ion yang mengalami hidrolisis dalam CH₃COONa adalah ...

A. Na⁺
B. CH₃COO⁻
C. Keduanya
D. Tidak ada

Kunci: B

SOAL 3

Ion NH₄⁺ mengalami hidrolisis karena ...

A. Berasal dari asam kuat.
B. Merupakan asam konjugasi dari basa lemah.
C. Tidak memiliki muatan.
D. Selalu membentuk OH⁻.

Kunci: B

SOAL 4

Larutan CH₃COONa cenderung bersifat basa karena ...

A. Menghasilkan Cl⁻.
B. Menghasilkan H₃O⁺ melalui ion Na⁺.
C. Anionnya menghasilkan OH⁻ melalui reaksi dengan air.
D. Semua garam bersifat basa.

Kunci: C

SOAL 5

Jika Kh = 10⁻⁹ dan konsentrasi garam 0,1 M, konsentrasi
ion yang dihasilkan melalui hidrolisis kecil diperkirakan ...

A. 10⁻³ M
B. 10⁻⁴ M
C. 10⁻⁵ M
D. 10⁻⁹ M

Kunci: C

Pembahasan:
√(10⁻⁹ × 10⁻¹) = √10⁻¹⁰ = 10⁻⁵ M.

## 21.3 Bank Soal

Bank soal harus dapat dikelompokkan berdasarkan:
- Materi.
- Tingkat kesulitan.
- Tujuan pembelajaran.
- Jenis soal.
- Kunci jawaban.
- Pembahasan.

==================================================
# 22. EVALUASI AKHIR
==================================================

## 22.1 Komposisi Evaluasi

Bagian A:
10 soal pilihan ganda.

Bagian B:
3 soal uraian konsep dan klasifikasi.

Bagian C:
2 soal perhitungan pH.

Bagian D:
1 soal analisis data atau simulasi.

Total:
16 butir soal.

## 22.2 Kisi-Kisi Evaluasi

| Kompetensi | Bentuk | Jumlah |
|------------|--------|--------|
| Konsep dasar | Pilihan ganda | 2 |
| Klasifikasi | Pilihan ganda | 3 |
| Reaksi hidrolisis | Pilihan ganda dan uraian | 3 |
| Tetapan hidrolisis | Pilihan ganda | 2 |
| Perhitungan pH | Uraian | 2 |
| Analisis data | Uraian | 2 |
| Penerapan | Pilihan ganda dan uraian | 2 |

## 22.3 Ketentuan Evaluasi

- Instruksi harus jelas.
- Data numerik harus lengkap.
- Soal perhitungan harus memiliki jawaban yang dapat diverifikasi.
- Penilaian uraian harus menggunakan rubrik.
- Hasil evaluasi disertai rekomendasi materi untuk dipelajari ulang.

==================================================
# 23. SISTEM PENILAIAN
==================================================

## 23.1 Skor Pilihan Ganda

Jawaban benar mendapat skor sesuai bobot soal.
Jawaban salah mendapat skor nol.
Tidak ada pengurangan skor tambahan.

## 23.2 Skor Uraian

Penilaian mempertimbangkan:
- Ketepatan konsep.
- Ketepatan reaksi.
- Pemilihan rumus.
- Proses perhitungan.
- Kesimpulan.

## 23.3 Rubrik Contoh

Skor 4:
Konsep, reaksi, rumus, perhitungan, dan kesimpulan benar.

Skor 3:
Konsep dan metode benar dengan satu kesalahan kecil.

Skor 2:
Sebagian konsep benar, tetapi terdapat kesalahan penting.

Skor 1:
Menunjukkan pemahaman awal, tetapi metode belum tepat.

Skor 0:
Tidak menjawab atau jawaban tidak relevan.

## 23.4 Hasil Evaluasi

Tampilkan:
- Skor total.
- Jawaban benar dan salah.
- Pembahasan.
- Kompetensi yang dikuasai.
- Materi yang perlu diulang.

==================================================
# 24. PROGRESS BELAJAR
==================================================

## 24.1 Fitur

Simpan status:
- Modul selesai.
- Kuis yang pernah dikerjakan.
- Skor kuis terakhir.
- Skor terbaik.
- Materi yang perlu diulang.

## 24.2 Perhitungan Progres

Progress materi =
(jumlah modul selesai / jumlah modul wajib) × 100%

Progress hanya dihitung dari aktivitas yang benar-benar
diselesaikan pengguna.

## 24.3 Penyimpanan

Versi pertama menggunakan LocalStorage.

Ketentuan:
- Simpan data progres minimum.
- Jangan menyimpan informasi sensitif.
- Sediakan opsi reset progres.
- Tangani kondisi penyimpanan tidak tersedia.
- Jangan mengklaim data tersinkronisasi ant perangkat.

==================================================
# 25. GLOSARIUM
==================================================

Garam:
Senyawa ionik yang tersusun dari kation dan anion.

Hidrolisis:
Reaksi suatu spesies kimia dengan air.

Hidrolisis garam:
Reaksi ion tertentu dari garam dengan air yang memengaruhi
komposisi ion larutan dan dapat mengubah pH.

Asam kuat:
Asam yang terionisasi hampir sempurna dalam air pada
kondisi yang sesuai.

Asam lemah:
Asam yang hanya terionisasi sebagian dalam air.

Basa kuat:
Basa yang terdisosiasi atau bereaksi hampir sempurna
sesuai sifat basa kuatnya dalam air.

Basa lemah:
Basa yang bereaksi sebagian dengan air.

Ka:
Tetapan ionisasi asam.

Kb:
Tetapan ionisasi basa.

Kh:
Tetapan kesetimbangan reaksi hidrolisis yang didefinisikan
berdasarkan reaksi yang digunakan.

Kw:
Tetapan autoionisasi air.

pH:
Ukuran keasaman larutan berdasarkan aktivitas ion hidrogen;
pada pendekatan larutan encer digunakan konsentrasi H₃O⁺.

pOH:
Ukuran yang berkaitan dengan aktivitas ion hidroksida.

Ion konjugasi:
Pasangan spesies asam-basa yang berhubungan melalui
perpindahan proton.

Kesetimbangan:
Keadaan dinamis ketika laju reaksi maju dan balik sama.

==================================================
# 26. REFERENSI DAN SUMBER BELAJAR
==================================================

Website harus menyediakan referensi yang dapat diverifikasi.

Kategori sumber:
1. Buku Kimia SMA/MA yang digunakan sekolah.
2. Buku kimia umum mengenai kesetimbangan asam-basa.
3. Buku atau sumber pembelajaran mengenai hidrolisis garam.
4. Dokumen kurikulum resmi yang berlaku.
5. Sumber pendidikan kimia yang kredibel.

Setiap materi yang diambil dari sumber luar harus dicatat
dengan informasi bibliografi yang sesuai.

Jangan membuat judul buku, nama penulis, DOI, atau URL palsu.

Referensi final harus diverifikasi sebelum website diterbitkan.

==================================================
# 27. SPESIFIKASI FUNGSIONAL
==================================================

## FR-01: Navigasi

Sistem harus memungkinkan pengguna berpindah antarmodul.

Kriteria:
- Semua menu berfungsi.
- Tautan tidak rusak.
- Halaman aktif ditandai.
- Navigasi mobile berfungsi.

## FR-02: Materi

Sistem harus menampilkan teks, persamaan, tabel, dan ilustrasi.

Kriteria:
- Materi terstruktur.
- Rumus terbaca.
- Persamaan benar.
- Konten tidak terpotong.

## FR-03: Simulasi

Sistem harus menampilkan model reaksi sesuai garam pilihan.

Kriteria:
- Pilihan garam berfungsi.
- Reaksi sesuai jenis ion.
- Penjelasan muncul dengan benar.
- Tombol reset berfungsi.

## FR-04: Kalkulator

Sistem harus menghitung pH sesuai model yang dipilih.

Kriteria:
- Input divalidasi.
- Rumus sesuai jenis garam.
- Hasil memiliki langkah penyelesaian.
- Batas pendekatan dijelaskan.

## FR-05: Kuis

Sistem harus memeriksa jawaban dan menghitung skor.

Kriteria:
- Jawaban benar dan salah ditangani.
- Skor sesuai kunci.
- Pembahasan ditampilkan.
- Kuis dapat diulang.

## FR-06: Evaluasi

Sistem harus menampilkan hasil evaluasi.

Kriteria:
- Skor dihitung sesuai rubrik.
- Hasil tidak berubah tanpa perubahan jawaban.
- Pembahasan sesuai soal.

## FR-07: Progress

Sistem harus menyimpan status belajar secara lokal.

Kriteria:
- Progres diperbarui.
- Progres bertahan setelah halaman dimuat ulang.
- Reset bekerja.
- Tidak ada klaim sinkronisasi cloud tanpa backend.

==================================================
# 28. SPESIFIKASI TEKNIS
==================================================

## 28.1 Teknologi Rekomendasi

Frontend:
- React.
- TypeScript.
- Vite.
- Tailwind CSS.

Routing:
- React Router atau mekanisme routing yang setara.

Persamaan:
- KaTeX atau MathJax.

Pengujian:
- Vitest untuk unit testing.
- React Testing Library untuk komponen.
- Playwright untuk pengujian end-to-end jika diperlukan.

Penyimpanan:
- LocalStorage pada versi pertama.

Backend:
- Opsional pada tahap MVP.
- Diperlukan jika sistem membutuhkan akun, kelas, dan laporan guru.

## 28.2 Aturan Implementasi

- Gunakan komponen yang dapat digunakan ulang.
- Pisahkan data materi dari komponen tampilan.
- Pisahkan logika perhitungan dari antarmuka.
- Gunakan TypeScript untuk mengurangi kesalahan tipe.
- Gunakan fungsi matematika yang dapat diuji secara terpisah.
- Tangani error pada input dan penyimpanan.
- Jangan membuat tombol yang hanya bersifat dekoratif.
- Jangan mengklaim fitur berhasil sebelum benar-benar berfungsi.

==================================================
# 29. STRUKTUR DATA
==================================================

## 29.1 Data Materi

Setiap modul memiliki:

- id.
- title.
- description.
- learningObjectives.
- contentSections.
- equations.
- examples.
- exercises.
- references.
- estimatedDuration.

## 29.2 Data Garam

Setiap data garam memuat:

- id.
- formula.
- name.
- acidOrigin.
- baseOrigin.
- acidStrength.
- baseStrength.
- hydrolyzingIons.
- reactions.
- expectedNature.
- explanation.
- calculationModel.

## 29.3 Data Soal

Setiap soal memuat:

- id.
- question.
- questionType.
- options.
- correctAnswer.
- explanation.
- topic.
- learningObjective.
- difficulty.
- scoringRule.

## 29.4 Data Progres

Simpan:
- completedModuleIds.
- latestQuizScore.
- bestQuizScore.
- lastVisitedModule.
- updatedAt.

Hindari menyimpan data pribadi yang tidak dibutuhkan.

==================================================
# 30. STRUKTUR FOLDER PROYEK
==================================================

src/
├── app/
│   ├── App.tsx
│   └── routes.tsx
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── PageContainer.tsx
│   │
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── ProgressBar.tsx
│   │   └── Accordion.tsx
│   │
│   ├── chemistry/
│   │   ├── Equation.tsx
│   │   ├── IonDiagram.tsx
│   │   ├── SaltCard.tsx
│   │   └── ReactionPanel.tsx
│   │
│   └── assessment/
│       ├── QuestionCard.tsx
│       ├── QuizResult.tsx
│       └── FeedbackPanel.tsx
│
├── pages/
│   ├── HomePage.tsx
│   ├── OrientationPage.tsx
│   ├── MaterialsPage.tsx
│   ├── SimulationPage.tsx
│   ├── CalculatorPage.tsx
│   ├── PracticePage.tsx
│   ├── QuizPage.tsx
│   ├── EvaluationPage.tsx
│   ├── SummaryPage.tsx
│   └── ReferencesPage.tsx
│
├── data/
│   ├── materials.ts
│   ├── salts.ts
│   ├── questions.ts
│   └── references.ts
│
├── services/
│   ├── hydrolysis.ts
│   ├── phCalculator.ts
│   ├── assessment.ts
│   └── progressStorage.ts
│
├── hooks/
│   └── useProgress.ts
│
├── types/
│   ├── chemistry.ts
│   ├── question.ts
│   └── progress.ts
│
├── styles/
│   └── globals.css
│
└── main.tsx

==================================================
# 31. KEAMANAN DAN PRIVASI
==================================================

- Website versi pertama tidak mewajibkan akun.
- Jangan mengumpulkan data pribadi tanpa kebutuhan.
- Jangan menyimpan kata sandi dalam LocalStorage.
- Validasi seluruh input pengguna.
- Jangan menjalankan kode dari input pengguna.
- Jika backend ditambahkan, gunakan autentikasi yang sesuai.
- Batasi akses guru dan siswa berdasarkan peran.
- Jelaskan penggunaan dan penyimpanan data.
- Sediakan cara menghapus progres lokal.

==================================================
# 32. AKSESIBILITAS
==================================================

Website harus:
- Dapat digunakan dengan keyboard.
- Memiliki label untuk input.
- Memiliki teks alternatif pada gambar informatif.
- Menggunakan kontras yang cukup.
- Tidak mengandalkan warna saja.
- Menampilkan fokus keyboard.
- Menyediakan teks pada visualisasi.
- Menghormati pengaturan pengurangan animasi.
- Tidak mengandalkan drag-and-drop sebagai satu-satunya
  cara untuk menyelesaikan aktivitas.

==================================================
# 33. NON-FUNCTIONAL REQUIREMENTS
==================================================

## NFR-01: Kinerja

- Halaman utama harus terasa responsif.
- Hindari gambar dan animasi berukuran berlebihan.
- Gunakan pemuatan aset yang efisien.
- Jangan menjalankan simulasi berat tanpa kebutuhan.

## NFR-02: Keandalan

- Perhitungan harus dapat diuji.
- Error harus ditampilkan dengan jelas.
- Input invalid tidak boleh menghasilkan hasil menyesatkan.
- Progress harus ditangani secara konsisten.

## NFR-03: Usability

- Pengguna baru dapat menemukan materi utama dengan mudah.
- Tombol memiliki label yang jelas.
- Penjelasan menggunakan bahasa Indonesia yang sesuai
  untuk siswa SMA.
- Materi tidak hanya berisi rumus tanpa penjelasan.

## NFR-04: Kompatibilitas

- Chrome.
- Edge.
- Firefox.
- Safari modern.
- Perangkat desktop, tablet, dan ponsel.

## NFR-05: Pemeliharaan

- Data materi mudah diperbarui.
- Bank soal mudah ditambah.
- Logika perhitungan terpisah dari UI.
- Dokumentasi instalasi dan penggunaan tersedia.

==================================================
# 34. ACCEPTANCE CRITERIA
==================================================

Produk dinyatakan memenuhi persyaratan jika:

AC-01:
Semua halaman utama dapat diakses.

AC-02:
Semua tujuan pembelajaran terhubung dengan materi yang sesuai.

AC-03:
Empat jenis garam dijelaskan dengan benar.

AC-04:
Reaksi hidrolisis sesuai dengan ion yang terlibat.

AC-05:
Perhitungan Kh menggunakan hubungan yang tepat.

AC-06:
Kalkulator menghasilkan hasil yang sesuai dengan model
dan asumsi yang digunakan.

AC-07:
Kuis menghitung skor sesuai kunci jawaban.

AC-08:
Pembahasan tersedia untuk setiap soal latihan.

AC-09:
Progress tersimpan dan dapat direset.

AC-10:
Website dapat digunakan pada layar kecil.

AC-11:
Tidak ada tautan, tombol, atau input utama yang rusak.

AC-12:
Materi dan hasil perhitungan telah ditinjau secara ilmiah.

==================================================
# 35. TESTING PLAN
==================================================

## 35.1 Unit Testing

Uji:
- Perhitungan Kh.
- Perhitungan pH.
- Validasi input.
- Perhitungan skor.
- Perhitungan progress.
- Penyimpanan dan reset progress.

## 35.2 Integration Testing

Uji:
- Pemilihan garam dan perubahan simulasi.
- Data soal dan proses penilaian.
- Kalkulator dan tampilan hasil.
- Progress dan LocalStorage.
- Navigasi antarmodul.

## 35.3 End-to-End Testing

Skenario:
1. Pengguna membuka beranda.
2. Pengguna memulai pembelajaran.
3. Pengguna membaca materi klasifikasi.
4. Pengguna mencoba simulasi.
5. Pengguna menghitung pH.
6. Pengguna mengerjakan kuis.
7. Website menampilkan hasil.
8. Pengguna menutup dan membuka kembali halaman.
9. Progress ditampilkan dengan benar.

## 35.4 Validasi Kimia

Lakukan pemeriksaan khusus terhadap:
- Kekuatan asam dan basa.
- Identifikasi ion terhidrolisis.
- Persamaan reaksi.
- Definisi Kh.
- Hubungan Kh dengan Ka, Kb, dan Kw.
- Pendekatan konsentrasi ion.
- Nilai pH.
- Asumsi suhu dan larutan encer.

## 35.5 Validasi Pembelajaran

Pastikan:
- Tujuan pembelajaran terukur.
- Materi berurutan.
- Contoh soal relevan.
- Soal memiliki kunci yang benar.
- Umpan balik menjelaskan alasan.
- Evaluasi mengukur pemahaman, bukan hanya hafalan.

==================================================
# 36. PRIORITAS PENGEMBANGAN
==================================================

## PHASE 1 — MVP

Prioritas tertinggi:
1. Struktur website dan navigasi.
2. Desain UI/UX.
3. Materi lengkap.
4. Klasifikasi garam.
5. Contoh soal.
6. Kalkulator pH.
7. Kuis interaktif.
8. Progress belajar.
9. Pengujian dasar.

## PHASE 2 — INTERAKTIVITAS

1. Simulasi ion.
2. Animasi reaksi.
3. Latihan bertingkat.
4. Umpan balik berdasarkan kesalahan.
5. Visualisasi persamaan.

## PHASE 3 — PENGELOLAAN PEMBELAJARAN

1. Akun guru dan siswa.
2. Dashboard.
3. Penyimpanan nilai di server.
4. Pengelolaan bank soal.
5. Laporan hasil belajar.

Pengembangan harus dilakukan secara bertahap.
Fitur tambahan tidak boleh mengurangi ketepatan materi inti.

==================================================
# 37. INDIKATOR KEBERHASILAN PRODUK
==================================================

Indikator teknis:
- Semua fitur wajib berfungsi.
- Tidak ada error kritis pada alur belajar.
- Kalkulator lolos pengujian kasus acuan.
- Navigasi mobile berfungsi.

Indikator pembelajaran:
- Siswa dapat menjelaskan konsep hidrolisis.
- Siswa dapat mengidentifikasi ion yang terhidrolisis.
- Siswa dapat menuliskan reaksi yang benar.
- Siswa dapat memilih rumus pH yang sesuai.
- Siswa dapat menjelaskan alasan jawabannya.

Indikator penggunaan:
- Siswa dapat menyelesaikan alur belajar tanpa bantuan teknis.
- Siswa dapat menemukan kembali materi yang diperlukan.
- Siswa memahami umpan balik kuis.
- Guru dapat menggunakan simulasi untuk diskusi.

Keberhasilan pendidikan tidak boleh hanya ditentukan oleh
jumlah klik atau lamanya pengguna membuka website.

==================================================
# 38. RISIKO DAN MITIGASI
==================================================

RISIKO 1:
Siswa menghafal rumus tanpa memahami konsep.

Mitigasi:
Sertakan penjelasan mekanisme reaksi dan visualisasi ion.

RISIKO 2:
Kalkulator memberikan hasil yang keliru.

Mitigasi:
Pisahkan logika kimia, gunakan unit testing, dan tampilkan
asumsi serta batas pendekatan.

RISIKO 3:
Animasi sulit diakses.

Mitigasi:
Sediakan keterangan tekstual dan kontrol animasi.

RISIKO 4:
Materi terlalu padat.

Mitigasi:
Bagi materi menjadi modul pendek dengan tujuan jelas.

RISIKO 5:
Progress hilang.

Mitigasi:
Tangani error LocalStorage dan sediakan pemberitahuan.

RISIKO 6:
Sumber materi tidak dapat diverifikasi.

Mitigasi:
Gunakan referensi yang benar-benar tersedia dan periksa
informasi bibliografi sebelum publikasi.

==================================================
# 39. PROMPT IMPLEMENTASI UNTUK AI CODING
==================================================

Gunakan seluruh dokumen PRD ini sebagai spesifikasi utama
untuk membangun website The Secret of Salt.

Buat website pembelajaran Kimia kelas XI SMA mengenai
Hidrolisis Garam dengan React, TypeScript, Vite, dan
Tailwind CSS.

ATURAN UTAMA:

1. Bangun website yang benar-benar berfungsi, bukan hanya
   desain statis atau mockup.

2. Implementasikan semua halaman dan navigasi yang tercantum
   dalam PRD.

3. Gunakan bahasa Indonesia untuk seluruh antarmuka.

4. Gunakan desain laboratorium kimia modern yang ramah siswa,
   dengan warna biru muda, putih, navy, dan aksen lembut.

5. Buat materi pembelajaran terstruktur dari konsep dasar
   sampai perhitungan pH.

6. Implementasikan simulasi hidrolisis untuk NaCl, NH₄Cl,
   CH₃COONa, dan NH₄CH₃COO.

7. Buat kalkulator pH yang menghitung berdasarkan jenis garam,
   konsentrasi, Ka, Kb, Kw, dan model kesetimbangan yang sesuai.

8. Jangan menggunakan satu rumus pendekatan untuk seluruh
   jenis garam.

9. Tampilkan langkah perhitungan, satuan, asumsi, dan
   peringatan ketika pendekatan tidak sesuai.

10. Buat kuis, latihan, evaluasi, skor, pembahasan, dan
    penyimpanan progres lokal.

11. Gunakan komponen reusable dan pisahkan logika kimia
    dari komponen UI.

12. Pastikan persamaan kimia ditampilkan dengan benar,
    termasuk indeks, muatan ion, dan panah kesetimbangan.

13. Buat semua tombol memiliki fungsi yang nyata.

14. Pastikan website responsif pada desktop, tablet,
    dan smartphone.

15. Implementasikan validasi input, error handling,
    aksesibilitas, dan pengujian.

16. Jangan membuat data referensi, hasil eksperimen,
    atau klaim ilmiah yang tidak dapat diverifikasi.

17. Jika fitur memerlukan backend tetapi backend belum tersedia,
    jelaskan keterbatasannya dan jangan berpura-pura bahwa
    penyimpanan cloud sudah berfungsi.

18. Setelah implementasi, jalankan pengujian dan perbaiki
    error yang ditemukan.

URUTAN PENGERJAAN:

Tahap 1:
Buat struktur proyek dan navigasi.

Tahap 2:
Buat desain global dan halaman beranda.

Tahap 3:
Implementasikan seluruh materi.

Tahap 4:
Implementasikan simulasi.

Tahap 5:
Implementasikan kalkulator pH.

Tahap 6:
Implementasikan latihan dan evaluasi.

Tahap 7:
Implementasikan progress belajar.

Tahap 8:
Lakukan validasi ilmiah dan pengujian.

Tahap 9:
Pastikan aplikasi dapat dijalankan sesuai petunjuk.

Jangan berhenti setelah membuat halaman beranda.
Lanjutkan implementasi semua fitur wajib sampai selesai.

==================================================
# 40. DEFINITION OF DONE
==================================================

Proyek dinyatakan selesai apabila:

[ ] Website dapat dijalankan.
[ ] Semua halaman utama tersedia.
[ ] Navigasi berfungsi.
[ ] Materi hidrolisis garam lengkap.
[ ] Tujuan pembelajaran terhubung dengan materi.
[ ] Tabel klasifikasi garam berfungsi.
[ ] Simulasi hidrolisis berfungsi.
[ ] Kalkulator pH berfungsi.
[ ] Perhitungan memiliki langkah yang transparan.
[ ] Latihan memiliki kunci dan pembahasan.
[ ] Kuis menghitung skor dengan benar.
[ ] Evaluasi menampilkan hasil.
[ ] Progress tersimpan secara lokal.
[ ] Progress dapat direset.
[ ] Tampilan responsif.
[ ] Aksesibilitas dasar diperiksa.
[ ] Validasi input diterapkan.
[ ] Tidak ada tombol utama yang tidak berfungsi.
[ ] Persamaan kimia telah diperiksa.
[ ] Perhitungan telah diuji dengan kasus acuan.
[ ] Referensi dapat diverifikasi.
[ ] Dokumentasi penggunaan tersedia.

==================================================
AKHIR DOKUMEN PRD
==================================================

PRODUCT VISION:

"The Secret of Salt" dirancang untuk menjadikan hidrolisis
garam sebagai pengalaman belajar yang lebih mudah dipahami,
bukan sekadar kumpulan rumus yang harus dihafal.

Siswa harus dapat melihat hubungan antara asal garam,
perilaku ion dalam air, pembentukan H₃O⁺ atau OH⁻,
sifat larutan, dan perhitungan pH.

Setiap halaman, animasi, soal, dan fitur harus memiliki
tujuan pembelajaran yang jelas dan mendukung pemahaman
kimia secara ilmiah.
