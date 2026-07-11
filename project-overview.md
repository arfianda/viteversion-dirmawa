# Project Overview — Website Direktorat Kemahasiswaan & Alumni UPB

Dokumentasi ini memberikan gambaran menyeluruh mengenai arsitektur, teknologi, struktur folder, modul, dan detail teknis dari aplikasi **Portal Direktorat Kemahasiswaan dan Alumni Universitas Pelita Bangsa (UPB)**.

---

## 1. Ringkasan Project

### 1.1 Deskripsi & Tujuan
Portal ini dirancang untuk menggantikan sistem kemahasiswaan lama yang memiliki kendala seperti tampilan usang (tidak responsif), konten statis (kurang pembaruan), aksesibilitas buruk di perangkat mobile, serta kurangnya modul pencatatan terstruktur untuk akreditasi institusi.

Aplikasi ini mengintegrasikan:
- Layanan publik kemahasiswaan (Beasiswa, Direktori Ormawa, Pengumuman, Fasilitas).
- Tracer Study Alumni dengan visualisasi bagan interaktif untuk akreditasi BAN-PT.
- Dasbor Mahasiswa (*Student Portal*) untuk pendaftaran Ormawa, pemantauan beasiswa, dan pelaporan prestasi (SKPI).
- Dasbor Pengurus Ormawa untuk memperbarui profil organisasi secara mandiri, melaporkan keanggotaan, dan mengajukan proposal pendanaan.
- Portal Console Admin untuk staf Dirmawa guna mengelola seluruh data, konten publikasi, serta memverifikasi antrean proposal & LPJ.

### 1.2 Target Pengguna
1. **Mahasiswa Aktif:** Mengajukan beasiswa, mendaftar Ormawa/Himpunan, melaporkan prestasi lomba.
2. **Calon Mahasiswa / Publik:** Mengeksplorasi kehidupan kampus, daftar Ormawa, dan prestasi mahasiswa.
3. **Alumni:** Mengisi tracer study, melihat direktori alumni, mencari lowongan kerja.
4. **Pengurus Ormawa:** Mengelola detail profil Ormawa dan melaporkan jumlah anggota serta proposal kegiatan.
5. **Staf & Direktur Kemahasiswaan (Admin):** Memverifikasi pengajuan, mengelola konten publikasi (beasiswa, berita), memantau data tracer alumni.
6. **Tim Akreditasi:** Mengakses data prestasi dan statistika karier alumni per program studi secara real-time.

---

## 2. Tech Stack

| Layer | Teknologi | Deskripsi |
|---|---|---|
| **Core Framework** | React 19 & TypeScript | Kerangka utama SPA dengan pengetikan statis aman (*type safety*). |
| **Styling & UI** | Tailwind CSS v4.0.0 | Compile style super cepat terintegrasi langsung dengan `@tailwindcss/vite`. |
| **Typography** | Plus Jakarta Sans & Inter | Google Fonts modern untuk kenyamanan membaca konten padat. |
| **Data Tables** | TanStack Table v8 | Manajemen tabel tracer alumni (pencarian, sorting, paginasi). |
| **Visualisasi Data** | Recharts v3.8.1 | Bagan diagram interaktif sebaran karier & statistik kelulusan alumni. |
| **Validasi Form** | React Hook Form & Zod | Penanganan formulir (tracer study, pengajuan proposal, settings). |
| **Animasi** | Motion v12 | Framework animasi mikro-interaksi dan transisi halaman. |
| **Database & Auth** | Supabase BaaS | Layanan autentikasi pengguna, penyimpanan berkas, dan PostgreSQL. |
| **Database ORM** | Prisma Client | Digunakan untuk pengujian koneksi database lokal selama pengembangan. |
| **Bundler / Build** | Vite v6.2.3 | Toolkit build modern super cepat. |
| **Routing** | SPA Hash-based Routing | Navigasi client-side menggunakan state and window hash (`#/home`, `#/mahasiswa`, dsb). |

---

## 3. Struktur Folder

Berikut adalah visualisasi pohon struktur folder utama aplikasi:

```
viteversion-dirmawa/
├── docs/                      # Dokumentasi rencana alur fitur & sistem
├── prisma/                    # Konfigurasi Prisma ORM lokal (schema.prisma)
├── public/                    # Aset statis public (ikon, favicon)
├── scripts/                   # Script otomasi migrasi dan seeding database (.cjs)
├── src/                       # Source code utama aplikasi
│   ├── admin/                 # Portal Console Admin Staf Kemahasiswaan
│   │   ├── components/        # Komponen fungsional admin (Alumni, Beasiswa, Ormawa, dll)
│   │   ├── AdminPortal.tsx    # Entry point & layout sidebar Portal Admin
│   │   └── types.ts           # Tipe data khusus dasbor admin
│   ├── assets/                # Gambar, logo kampus, dan aset media lokal
│   ├── components/            # Komponen halaman publik & panduan kemahasiswaan
│   │   ├── panduan/           # Dokumen resmi (POK, Kode Etik, Panduan Mahasiswa)
│   │   ├── Navbar.tsx         # Navigasi utama
│   │   ├── Footer.tsx         # Footer situs
│   │   └── ...View.tsx        # Views halaman utama (Home, Ukm, Alumni, dll)
│   ├── mahasiswa-dashboard/   # Portal Dasbor Mahasiswa Aktif
│   │   ├── components/        # Sub-fitur (Ajukan Ormawa, Beasiswa, SKPI, Settings)
│   │   └── MahasiswaPortal.tsx# Entry point & sidebar Dasbor Mahasiswa
│   ├── ormawa-dashboard/      # Portal Dasbor Khusus Pengurus Ormawa
│   │   ├── components/        # Sub-fitur (Profile Editor, Member List, Proposals)
│   │   └── OrmawaPortal.tsx   # Entry point & sidebar Dasbor Ormawa
│   ├── services/              # Modul integrasi Supabase (API Client & Auth)
│   │   ├── authService.ts     # Penanganan session, Google SSO & credentials login
│   │   └── supabaseService.ts # Kueri DB (CRUD Beasiswa, News, Alumni, dll)
│   ├── types/                 # Definisi tipe data global TypeScript
│   ├── App.tsx                # Konfigurasi perutean utama (routing) & state data global
│   ├── index.css              # Entrypoint CSS Tailwind v4 & konfigurasi font
│   └── main.tsx               # Bootstrapping React DOM ke elemen root index.html
├── package.json               # Manifest dependensi & script project
└── vite.config.ts             # Konfigurasi builder Vite & plugin tailwind/react
```

---

## 4. Daftar Halaman / Modul

Aplikasi ini menggunakan perutean berbasis **Single Page Application (SPA) Hash Routing** untuk menghindari kendala 404 refresh halaman pada server hosting statis.

### 4.1 Halaman Publik (Visitor / Guest View)

#### 1. Beranda (`#/home` | `HomeView.tsx`)
- **Tujuan:** Pintu gerbang informasi publik kemahasiswaan.
- **Komponen Utama:** Slider berita, statistik interaktif (UKM, Alumni, Prestasi), grid pintasan layanan, dan teaser fasilitas kampus.
- **Elemen Kompleks:** Animasi banner dari Motion v12, detail berita pop-up portal.

#### 2. Berita (`#/news` | `NewsView.tsx`)
- **Tujuan:** Menampilkan kabar, agenda, dan pengumuman resmi.
- **Komponen Utama:** Featured Hero Article, Bento grid berita 3-kolom, filter chips kategori.
- **Elemen Kompleks:** Pop-up detail artikel berbasis React Portal (`createPortal` ke `document.body`) dengan dynamic backdrop-blur.

#### 3. Beasiswa (`#/scholarships` | `ScholarshipView.tsx`)
- **Tujuan:** Menyediakan info beasiswa (Internal, Pemerintah, Swasta).
- **Komponen Utama:** Filter kategori, Detail persyaratan, Simulator Kelayakan IPK/berkas, dan form pengajuan.
- **Elemen Kompleks:** Form verifikasi berkas, progress bar simulator kelayakan, modal formulir pengajuan.

#### 4. Ormawa (`#/ukms` | `UkmView.tsx`)
- **Tujuan:** Direktori Ormawa (BEM, DPM) & UKM tingkat universitas serta Himpunan Mahasiswa Program Studi (HMPS/HIMA).
- **Komponen Utama:** Filter kategori, pencarian cepat, grid organisasi (UKM didahulukan, Himpunan ditaruh di bawah secara otomatis).
- **Elemen Kompleks:** Pendaftaran langsung anggota baru, modal galeri foto & kontak pengurus.

#### 5. Prestasi (`#/achievements` | `AchievementView.tsx`)
- **Tujuan:** Papan apresiasi pencapaian mahasiswa.
- **Komponen Utama:** Galeri kartu prestasi, filter tahun/tingkatan (Regional, Nasional, Internasional).
- **Elemen Kompleks:** Modal detail dokumentasi prestasi mahasiswa.

#### 6. Tracer Study Alumni (`#/alumni/data` | `AlumniView.tsx`)
- **Tujuan:** Basis data alumni dan penelusuran rekam jejak karier kelulusan.
- **Komponen Utama:** Bagan visualisasi interaktif sebaran status (Kerja, Wirausaha, Lanjut Studi, Cari Kerja), tabel pencarian alumni, form Tracer Study.
- **Elemen Kompleks:** Bagan Recharts (Pie Chart & Bar Chart), TanStack Table dengan paginasi/sorting, form kuesioner tracer (React Hook Form + Zod).

#### 7. Fasilitas (`#/facilities` | `FacilitiesView.tsx`)
- **Tujuan:** Panduan fasilitas kemahasiswaan (Unit Kesehatan Kampus, Layanan Konseling, Asuransi).
- **Komponen Utama:** Teaser layanan, panduan darurat medis, form pengajuan booking jadwal konseling mahasiswa.
- **Elemen Kompleks:** Form booking interaktif, pop-up portal darurat medis.

#### 8. Panduan Akademik (`#/panduan/...`)
- **Tujuan:** Menampilkan dokumen regulasi resmi kemahasiswaan (Kode Etik, POK UPB, Panduan Mahasiswa).
- **Komponen Utama:** Navigasi bab dokumen, panel pembaca teks statis terstruktur.

---

### 4.2 Portal Mahasiswa (`#/mahasiswa` | `MahasiswaPortal.tsx`)
- **Tujuan:** Dasbor mahasiswa aktif untuk mengelola aktivitas internal kemahasiswaan.
- **Komponen Utama:**
  - **Overview:** Bento grid statistik status pribadi mahasiswa.
  - **Ormawa Saya:** Profil Ormawa diikuti, jadwal pertemuan, scan barcode verifikasi, cari Ormawa baru.
  - **Beasiswa Saya:** Monitoring pengajuan beasiswa, checklist kelengkapan dokumen.
  - **Pengajuan Prestasi:** Input detail prestasi lomba & unggah berkas bukti prestasi untuk SKPI.
  - **Settings:** Ganti kata sandi, lengkapi profil pribadi (NIM, Jurusan, Semester).
- **Elemen Kompleks:** Upload file gambar/PDF bukti prestasi, scanner barcode tiruan, form settings dengan validasi Zod.

---

### 4.3 Portal Dasbor Ormawa (`#/ormawa` | `OrmawaPortal.tsx`)
- **Tujuan:** Dasbor pengurus organisasi mahasiswa untuk pemeliharaan konten direktori publik mereka.
- **Komponen Utama:**
  - **Detail Editor:** Pembaruan deskripsi organisasi, logo, cover image, jadwal latihan, kontak WhatsApp, tautan Instagram.
  - **Member Management:** Manajemen status anggota aktif, pelaporan jumlah anggota baru ke Dirmawa.
  - **Proposals & LPJ:** Modul pengajuan dana kegiatan dan laporan pertanggungjawaban.
- **Elemen Kompleks:** Form panjang editor profil, upload logo/cover image base64, status tracker proposal pendanaan.

---

### 4.4 Portal Console Admin (`#/admin` | `AdminPortal.tsx`)
- **Tujuan:** Pusat kendali data dan konten bagi staf Dirmawa.
- **Komponen Utama:**
  - **Overview:** Metrik dashboard operasional.
  - **Manajemen Modul (CRUD):** Beasiswa, Ormawa/Himpunan, Prestasi, Berita/Agenda, Alumni.
  - **Queues (Antrean Verifikasi):** Pendaftaran akun mahasiswa, aplikasi beasiswa, proposal kegiatan & LPJ, serta verifikasi laporan anggota aktif Ormawa.
- **Elemen Kompleks:** Bulk upload data alumni (.xlsx/.csv), ekspor file Excel, validasi massal NIM, persetujuan/penolakan berkas dengan catatan revisi.

---

## 5. Komponen Reusable

Berikut adalah komponen bersama (*shared/reusable components*) yang dipakai di beberapa halaman aplikasi:

1. **`Navbar` (`src/components/Navbar.tsx`):**
   - Dipakai di: Seluruh halaman publik (Beranda, Beasiswa, Ormawa, Fasilitas, Alumni, Prestasi, Tentang, Berita, Panduan).
2. **`Footer` (`src/components/Footer.tsx`):**
   - Dipakai di: Seluruh halaman publik.
3. **`ComingSoonView` & `UnderConstructionView` (`src/components/`):**
   - Dipakai di: Navigasi menu lowongan kerja, IKALISA, serta penanda ketika web dalam mode perawatan (*maintenance mode*).
4. **`createPortal` Modal Detail (React Portals):**
   - Dipakai di:
     - `HomeView.tsx` (Pop-up berita)
     - `NewsView.tsx` (Pop-up berita detail)
     - `AchievementView.tsx` (Detail prestasi)
     - `ScholarshipView.tsx` (Detail beasiswa & persyaratan)
     - `FacilitiesView.tsx` (Modal booking konseling & darurat medis)
     - `OrmawaDirectory.tsx` (Detail ormawa di panel admin)

---

## 6. Breakpoint & Styling Saat Ini

### 6.1 Responsivitas Grid & Flexbox
Aplikasi ini memanfaatkan utilitas responsif bawaan dari Tailwind CSS v4 untuk mendukung berbagai ukuran viewport:
- **Mobile (`default` hingga `sm:`):** Sebagian besar layout bertransisi menjadi grid 1-kolom atau flexbox arah vertikal (`flex-col`). Menu navigasi diringkas ke dalam tombol burger menu, dan visualisasi grafik Recharts mengecil secara dinamis menggunakan container `<ResponsiveContainer>`.
- **Tablet (`md:`):** Grid bertransisi menjadi 2-kolom (misalnya pada direktori Ormawa dan artikel berita).
- **Desktop (`lg:` dan `xl:`):** Grid bertransisi penuh ke 3-kolom. Navbar dirender secara mendatar penuh dengan menu dropdown interaktif.

### 6.2 Visual Backdrop Blur (Visual Blur Portaling)
- **Known Issue yang Telah Diselesaikan:** Sebelumnya, backdrop-blur (`backdrop-blur-sm`) pada modal detail sering mengalami patahan visual (terpotong menjadi kotak kecil) saat dibuka pada container halaman yang memiliki animasi transform CSS (seperti kelas `animate-fade-in` pada halaman UKM dan Beasiswa).
- **Solusi Implementasi:** Semua modal interaktif kini telah direfaktor untuk dirender di luar hierarki DOM utama menggunakan **React Portals** (`createPortal(..., document.body)`). Hal ini memastikan efek blur berjalan 100% mulus di seluruh layar tanpa batasan container induk (*parent constraints*).

---

## 7. Dependensi UI Penting (`package.json`)

Berikut adalah daftar paket dependensi dari `package.json` yang secara langsung mengontrol tampilan dan tata letak aplikasi:

- **`tailwindcss` & `@tailwindcss/vite` (`^4.1.14`):** Mengelola sistem utility classes dan integrasi parser style CSS super cepat selama pengembangan.
- **`lucide-react` (`^0.546.0`):** Menyediakan ribuan ikon SVG seragam yang responsif untuk tombol, menu sidebar, dan indikator status.
- **`motion` (`^12.23.24`):** Mengatur animasi transisi perpindahan tab halaman, modal scale-up, dan efek hover zoom interaktif.
- **`recharts` (`^3.8.1`):** Digunakan untuk visualisasi bagan data alumni di halaman publik.
- **`@tanstack/react-table` (`^8.21.3`):** Mengelola logika filter, sorting, dan paginasi tabel data alumni dan antrean admin.
- **`react-hook-form` (`^7.76.0`) & `zod` (`^4.4.3`):** Menyediakan validasi input formulir agar UI dapat menampilkan pesan kesalahan secara *real-time* kepada pengguna.

---

## 8. Catatan Tambahan & Batasan Teknis

- **Single Page Application (SPA) State:** Karena aplikasi ini adalah SPA murni berbasis client-side routing, navigasi bergantung penuh pada status hash di URL. Segala bentuk perpindahan halaman tidak memicu refresh jaringan.
- **Supabase BaaS Connection:** Kinerja loading awal halaman sangat bergantung pada latensi koneksi ke server Supabase (Postgres & Auth). Jika token kedaluwarsa atau server offline, aplikasi akan masuk ke fallback penanganan error terintegrasi.
- **Target Browser:** Aplikasi dioptimalkan untuk browser modern yang mendukung CSS Variables Level 2, Grid Layout, dan CSS Backdrop-filter (Chrome 76+, Safari 13+, Edge 79+, Firefox 70+).
- **Upload Batasan File:** Unggah logo Ormawa, berkas prestasi lomba, dan dokumen proposal kegiatan dibatasi maksimal **2MB** dengan format file yang divalidasi ketat (PNG, JPG, PDF) pada sisi klien sebelum dikirim ke server penyimpanan (*Supabase Storage*).
