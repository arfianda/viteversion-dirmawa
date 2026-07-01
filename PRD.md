# Product Requirements Document (PRD)
## Website Direktorat Kemahasiswaan — Universitas Pelita Bangsa (Vite Version)
**Versi:** 2.0  
**Tanggal:** Juni 2026  
**Dibuat oleh:** Tim Web Development  
**Status:** Updated (Actual Implementation)

---

## 1. Latar Belakang & Permasalahan

Website kemahasiswaan Universitas Pelita Bangsa (https://dirmawa.pelitabangsa.ac.id) sebelumnya menghadapi sejumlah masalah kritis:

- **Tampilan usang** — desain tidak responsif, tertinggal dari standar UI/UX modern, tidak mencerminkan identitas institusi yang profesional.
- **Tidak ada admin aktif** — konten statis dan tidak diperbarui, informasi kegiatan/program sudah tidak relevan.
- **Aksesibilitas buruk** — struktur navigasi membingungkan, tidak mobile-friendly.
- **Tidak mendukung akreditasi** — minim dokumentasi visual, data alumni, dan pencapaian mahasiswa yang terstruktur.
- **Tidak ada sistem manajemen konten** — penambahan konten membutuhkan kemampuan teknis.

---

## 2. Tujuan Produk

| Tujuan | Metrik Keberhasilan |
|---|---|
| Menjadi portal informasi kemahasiswaan yang modern & terpercaya | Bounce rate < 40%, avg. session > 2 menit |
| Mendukung nilai akreditasi institusi | Data alumni & prestasi mahasiswa terdokumentasi lengkap |
| Mudah dikelola tanpa keahlian teknis | Admin dapat update konten dalam < 5 menit |
| Diakses mahasiswa, alumni, dan pihak eksternal | Mobile traffic terlayani penuh (responsive 100%) |

---

## 3. Target Pengguna

### 3.1 Pengguna Utama
| Segmen | Kebutuhan |
|---|---|
| **Mahasiswa Aktif** | Info UKM/Ormawa, pendaftaran kegiatan, beasiswa, info berprestasi |
| **Calon Mahasiswa** | Gambaran kehidupan kampus, organisasi, prestasi |
| **Alumni** | Direktori alumni, jaringan, info reuni/tracer study |
| **Dosen & Staff** | Update kegiatan kemahasiswaan, data mahasiswa berprestasi |

### 3.2 Pengguna Sekunder
| Segmen | Kebutuhan |
|---|---|
| **Tim Akreditasi / BAN-PT** | Data terstruktur alumni per tahun & prodi, prestasi mahasiswa |
| **Pihak Eksternal / Mitra** | Informasi institusi dan pencapaian mahasiswa |
| **Admin Kemahasiswaan** | Manajemen konten, upload data, pengelolaan halaman |

---

## 4. Fitur & Modul

Sistem portal ini terbagi menjadi tiga area fungsional utama:

### 4.1 Halaman Publik (Frontend)

#### 🏠 Beranda (Homepage)
- **Hero Section:** Banner visual menarik dengan tagline dan ajakan aksi (Call-to-Action) yang dinamis.
- **Statistik Interaktif:** Penghitung otomatis jumlah UKM aktif (50+), Alumni (15k+), dan Prestasi Mahasiswa (500+).
- **Akses Cepat (Quick Access Grid):** Jalan pintas ke layanan utama seperti Beasiswa, UKM, Tracer Alumni, dan Pusat Karir.
- **Berita & Agenda:** Menampilkan pengumuman penting terbaru dan agenda kegiatan kemahasiswaan terdekat (seperti Job Fair).

#### 🎓 Data Alumni (Tracer Study)
- **Visualisasi Interaktif:** Diagram lingkaran (Pie Chart) untuk sebaran karier alumni dan diagram batang (Bar Chart) untuk tren kelulusan per tahun menggunakan **Recharts**.
- **Tabel Data Alumni:** Direktori alumni yang dapat dicari, diurutkan, dan memiliki paginasi menggunakan **TanStack Table**.
- **Kuesioner Tracer Study:** Formulir pengisian data karier alumni yang dilengkapi validasi dinamis menggunakan **React Hook Form** dan **Zod**.

#### 🏆 Mahasiswa Berprestasi (Achievements Board)
- **Galeri Kartu Profil:** Menampilkan prestasi mahasiswa tingkat regional, nasional, dan internasional.
- **Filter Pencarian:** Penyaringan data berdasarkan tingkat prestasi, kategori, program studi, dan tahun.
- **Formulir Pengajuan:** Memungkinkan mahasiswa mengunggah pengajuan prestasi baru untuk verifikasi kampus.

#### 🏛️ UKM & Ormawa (Directory)
- **Direktori UKM:** Terbagi berdasarkan kategori: Seni & Budaya, Olahraga, Akademik, Sosial, Kerohanian, Minat Khusus.
- **Halaman Detail:** Visi & misi, jadwal latihan, dokumentasi kegiatan (galeri), kontak pengurus, dan form pendaftaran langsung.

#### 🎓 Beasiswa (Scholarships Portal)
- **Informasi Beasiswa:** Klasifikasi beasiswa berdasarkan jenis (Internal, Pemerintah, Swasta).
- **Detail Modal:** Detail dana, batas akhir pendaftaran, persyaratan administrasi, dan manfaat beasiswa.
- **Simulator Kelayakan:** Alat bantu bagi mahasiswa untuk mengecek kesesuaian persyaratan IPK dan dokumen sebelum mendaftar.

#### 📰 Berita & Pengumuman
- Artikel berita kegiatan kemahasiswaan dengan filter kategori dan pencarian kata kunci.

#### 📄 Halaman Statis & Panduan
- Profil Direktorat Kemahasiswaan (visi, misi, struktur organisasi).
- Halaman fasilitas kemahasiswaan dan layanan konseling/karir.
- **Dokumen Panduan:** Akses langsung ke Kode Etik Mahasiswa, POK UPB, dan Panduan Akademik.

---

### 4.2 Portal Console Admin (Backend/CMS)

#### Dashboard Overview
- Rangkuman metrik utama sistem dalam bentuk widget informatif.

#### Manajemen Konten
- **CRUD Beasiswa:** Tambah, edit, dan hapus informasi program beasiswa beserta persyaratan dan manfaatnya.
- **CRUD UKM/Ormawa:** Pengelolaan informasi profil UKM, kontak, logo, banner, dan galeri foto.
- **CRUD Berita & Pengumuman:** Editor artikel berita dan pengumuman dengan status publikasi dan sistem tagging.

#### Manajemen Data Alumni
- **Pemuatan Massal (Bulk Upload):** Validasi format NIM dan data kelulusan sebelum dimasukkan ke database.
- **Sinkronisasi Database:** Sinkronisasi langsung data alumni terverifikasi dengan Supabase.
- **Ekspor Data:** Pengeksporan data direktori alumni ke format spreadsheet (CSV/Excel).

#### Antrean Registrasi & Manajemen Pengguna
- Verifikasi dan persetujuan akun pendaftaran mahasiswa baru.
- Manajemen peran pengguna (Operator, Admin, Superadmin) dengan kontrol akses berbasis peran (RBAC).

---

### 4.3 Portal Mahasiswa (Student Dashboard)

#### Autentikasi & Registrasi
- Halaman masuk (Login) terdedikasi dengan informasi misi institusi di panel samping.
- Tombol akun demo instan ("Budi Santoso", NIM: 202100123) untuk keperluan simulasi.

#### Ringkasan Dashboard (Overview)
- Pesan selamat datang personal ("Selamat Datang Kembali, Budi!").
- Bento-grid berisi rangkuman status: jumlah prestasi dilaporkan, UKM diikuti, dan status keaktifan beasiswa.

#### Modul Layanan Mahasiswa
- **UKM Saya:** Daftar keanggotaan UKM yang sedang diikuti beserta rekomendasi UKM baru.
- **Beasiswa Saya:** Monitoring status beasiswa aktif, checklist pemenuhan dokumen (seperti transkrip IPK), dan riwayat beasiswa.
- **Pengajuan Prestasi (SKPI Integration):** Pengisian detail prestasi (nama lomba, kategori, tingkat, peringkat, tanggal) dan unggah berkas bukti prestasi untuk dinilai oleh admin.
- **Pengaturan Akun:** Pembaruan info pribadi (NIM, nomor telepon, email), pergantian kata sandi, serta preferensi notifikasi email/push.

---

## 5. Tech Stack

Berikut adalah rincian teknologi yang digunakan pada aplikasi **Dirmawa (Vite Version)**:

| Layer | Teknologi | Deskripsi / Alasan |
|---|---|---|
| **Core Framework** | React 19 & TypeScript | Versi React terbaru dengan performa tinggi dan type safety penuh. |
| **Build Tool / Bundler** | Vite v6.2.3 | Build tool modern super cepat pengganti Webpack / Next.js bundler. |
| **Styling** | Tailwind CSS v4.0.0 | Konfigurasi modern menggunakan `@tailwindcss/vite` untuk compile styling super cepat dan integrasi CSS variables. |
| **Typography** | Plus Jakarta Sans & Inter | Font modern dari Google Fonts untuk kenyamanan membaca konten yang padat. |
| **Data Tables** | TanStack Table v8 (`@tanstack/react-table`) | Library manajemen tabel tanpa gaya bawaan (headless) untuk sorting, filtering, dan pagination. |
| **Data Visualization** | Recharts v3.8.1 | Chart SVG berbasis komponen React untuk visualisasi analitik karier alumni. |
| **Form Validation** | React Hook Form + Zod Resolver | Validasi sisi klien yang ketat dan efisien untuk kuesioner, pengajuan prestasi, dan login. |
| **Animations** | Motion v12 | Framework animasi (sebelumnya Framer Motion) untuk transisi navigasi dan efek mikro-interaksi premium. |
| **Database & API Client** | Supabase Client SDK (`@supabase/supabase-js`) | Integrasi langsung dengan PostgreSQL Supabase tanpa perantara REST API konvensional. |
| **Database (ORM)** | Prisma Client (Opsional / Development) | Digunakan untuk pengujian koneksi database dan pemeliharaan skema PostgreSQL lokal. |
| **Icons** | Lucide React | Koleksi ikon vektor SVG yang modern dan konsisten. |
| **Routing** | SPA Hash-based Routing | Navigasi client-side menggunakan state and window hash (`#/home`, `#/mahasiswa`, `#/admin`) untuk menghindari error refresh page pada deployment statis. |

---

## 6. Arsitektur Sistem

Aplikasi ini menggunakan arsitektur Single Page Application (SPA) yang berkomunikasi langsung dengan Supabase Backend-as-a-Service (BaaS) di cloud:

```
┌─────────────────────────────────────────────────────────┐
│                    INTERNET / USER                       │
└───────────────────────────┬─────────────────────────────┘
                            │
                    ┌───────▼───────┐
                    │   Host Statis │
                    │ (Vite Server) │
                    └───────┬───────┘
                            │
          ┌─────────────────▼──────────────────┐
          │      Vite React 19 Application     │
          │  ┌────────────┐  ┌───────────────┐  │
          │  │Hash Routing│  │  Services /   │  │
          │  │ (Frontend) │  │  API Client   │  │
          │  └────────────┘  └───────┬───────┘  │
          └──────────────────────────┼───────────┘
                                     │
               ┌─────────────────────┼──────────────────┐
               │                     │                  │
       ┌───────▼──────┐    ┌─────────▼─────┐  ┌────────▼──────┐
       │   Supabase   │    │   Supabase    │  │   Supabase    │
       │ (PostgreSQL) │    │   (Storage)   │  │    (Auth)     │
       └──────────────┘    └───────────────┘  └───────────────┘
```

---

## 7. Alur Data Alumni (Excel → Visualisasi)

```
Admin Upload File spreadsheet (.xlsx/.csv)
        │
        ▼
Validasi Format & Pemrosesan Data (Sisi Klien)
  - Cek kolom wajib (Nama, NIM, Prodi, Tahun)
  - Penandaan baris error (misal: "Invalid NIM")
        │
        ▼
Preview Data (Ditampilkan dalam tabel interaktif di Admin Panel)
        │
        ▼
Konfirmasi Admin & Pengunggahan Massal ke Supabase (via supabaseClient)
        │
        ▼
Agregasi Data Karier & Kelulusan di Supabase
        │
        ▼
Aplikasi Klien fetch data → Recharts memvisualisasikan grafik tren
```

---

## 8. Desain & UI/UX

### 8.1 Prinsip Desain
- **Clean & Professional** — Layout bersih dengan fokus pada keterbacaan data akademik.
- **Dynamic Interactions** — Efek hover halus pada kartu beasiswa dan UKM, serta transisi halaman mulus menggunakan Motion v12.
- **Bento Grid Layout** — Digunakan pada Dashboard Mahasiswa dan Admin untuk menampilkan berbagai modul data secara ringkas.

### 8.2 Palet Warna
- **Primary:** `#001e40` (Biru Tua) — Warna identitas Universitas Pelita Bangsa yang tepercaya.
- **Secondary:** `#feb234` (Kuning Emas) — Sebagai aksen, penyorot tombol aksi penting, dan badge.
- **Background:** `#f7f9fc` (Abu-abu Terang) — Latar belakang yang nyaman di mata untuk membaca teks panjang.
- **Neutral Dark / Text:** `#191c1e` — Warna tulisan utama dengan kontras tinggi.

---

## 9. Keamanan & Validasi

| Area | Implementasi |
|---|---|
| **Autentikasi** | Supabase Auth dengan sesi JWT. Sesi disimpan di `localStorage` klien untuk persistensi. |
| **Otorisasi (RBAC)** | Role disimpan di tabel `users` database (`mahasiswa`, `alumni`, `admin`, `superadmin`). Navigasi ke `/admin` dibatasi berdasarkan role ini. |
| **Validasi Form** | Integrasi schema Zod pada setiap input sensitif (login, form pengajuan prestasi, form tracer study). |
| **SQL Injection** | Dihindari secara default karena menggunakan Supabase client SDK dan query builder yang otomatis melakukan parameterisasi. |

---

## 10. Struktur Database (Supabase / PostgreSQL Schema)

### `users`
Tabel pengguna utama yang terintegrasi dengan data auth Supabase:
- `id` (UUID, Primary Key)
- `email` (Text, Unique)
- `name` (Text)
- `role` (Text - 'administrator', 'superadmin', 'admin', 'mahasiswa', 'alumni')
- `phone` (Text, Nullable)
- `avatar_url` (Text, Nullable)
- `created_at` (Timestamp)

### `mahasiswa_profiles`
Profil tambahan khusus mahasiswa aktif:
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key ke `users.id`)
- `nim` (Text, Unique)
- `major` (Text)
- `faculty` (Text, Nullable)
- `semester` (Integer, Nullable)

### `alumni_records`
Data alumni untuk kebutuhan tracer study dan akreditasi:
- `id` (UUID, Primary Key)
- `name` (Text)
- `nim` (Text)
- `graduation_year` (Integer)
- `major` (Text)
- `status` (Text - 'Bekerja', 'Wirausaha', 'Lanjut Studi', 'Mencari Kerja')
- `company` (Text, Nullable)
- `position` (Text, Nullable)
- `email` (Text, Nullable)
- `nim_status` (Text - 'Valid', 'Invalid NIM')

### `ukms`
Informasi Unit Kegiatan Mahasiswa (UKM):
- `id` (UUID, Primary Key)
- `name` (Text)
- `category` (Text - 'Seni & Budaya', 'Olahraga', 'Akademik', 'Sosial', 'Kerohanian', 'Minat Khusus')
- `description` (Text)
- `short_description` (Text)
- `cover_image_url` (Text)
- `logo_image_url` (Text)
- `vision` (Text)
- `active_members` (Integer)
- `leader_name` (Text, Nullable)
- `status` (Text - 'Active', 'Inactive')

### `scholarships`
Informasi beasiswa yang ditawarkan:
- `id` (UUID, Primary Key)
- `title` (Text)
- `type` (Text - 'internal', 'pemerintah', 'swasta')
- `provider` (Text)
- `description` (Text)
- `funding_amount` (Text)
- `registration_deadline` (Date)
- `banner_image_url` (Text)
- `status` (Text - 'Open', 'Closed')
- `applicants` (Integer)

### `achievements`
Data prestasi mahasiswa yang dipamerkan di galeri publik:
- `id` (UUID, Primary Key)
- `title` (Text)
- `student_name` (Text)
- `major` (Text)
- `level` (Text - 'Kampus', 'Regional', 'Nasional', 'Internasional')
- `rank` (Text)
- `category` (Text)
- `year` (Integer)
- `description` (Text)
- `image_url` (Text)

### `registration_requests`
Pendaftaran akun mahasiswa baru yang mengantre persetujuan admin:
- `id` (UUID, Primary Key)
- `nim` (Text)
- `name` (Text)
- `email` (Text)
- `major` (Text)
- `faculty` (Text)
- `semester` (Integer)
- `status` (Text - 'pending', 'approved', 'rejected')
- `rejection_reason` (Text, Nullable)
- `reviewed_by` (UUID, Nullable)
- `reviewed_at` (Timestamp, Nullable)
- `created_at` (Timestamp)

---

## 11. Kriteria Penerimaan (Acceptance Criteria)

Website dinyatakan siap digunakan di lingkungan produksi (Go-Live) jika memenuhi kriteria berikut:

- [x] Semua navigasi berbasis hash (`#/home`, `#/mahasiswa`, `#/admin`) berjalan lancar di desktop maupun perangkat seluler.
- [x] Sesi login tersimpan dengan benar dan bertahan ketika halaman dimuat ulang.
- [x] Data profil mahasiswa, beasiswa, prestasi, dan UKM berhasil dimuat secara dinamis dari Supabase.
- [x] Pencarian, penyaringan, dan paginasi data pada tabel alumni berfungsi tanpa hambatan.
- [x] Formulir tracer study alumni dan pengajuan prestasi mahasiswa memiliki validasi input yang mencegah data kosong terkirim ke database.
- [x] Dashboard admin dapat melakukan penambahan, pengeditan, dan penghapusan data secara dinamis yang langsung memperbarui tampilan publik.
- [x] Antrean registrasi dapat disetujui (Approve) oleh admin yang secara otomatis membuat pengguna baru di Supabase Auth.