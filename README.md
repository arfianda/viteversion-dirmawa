# Dirmawa - Portal Layanan Kemahasiswaan & Alumni Universitas Pelita Bangsa

**Dirmawa** adalah Portal Web Layanan Kemahasiswaan dan Hub Data Alumni modern terintegrasi untuk **Universitas Pelita Bangsa (UPB)**. Sistem ini menghubungkan mahasiswa, pengurus Organisasi Kemahasiswaan (Ormawa/Hima), alumni, dan staf administrasi Dirmawa dalam satu platform digital.

---

## 🚀 Fitur Utama

Sistem ini terbagi menjadi empat portal utama:

1. **Portal Publik / Beranda (`src/components/`)**
   - **Layanan Informasi**: Menampilkan berita prestasi mahasiswa, pengumuman akademik, dan agenda kegiatan kampus.
   - **Portal Beasiswa (`ScholarshipView.tsx`)**: Informasi program beasiswa eksternal, internal, dan pemerintah.
   - **Direktori UKM (`UkmView.tsx`)**: Informasi profil, jadwal latihan, dan pendaftaran anggota UKM secara langsung.
   - **Hub Data Alumni & Tracer Study (`AlumniView.tsx`)**: Pratinjau data penyerapan kerja alumni dilengkapi dengan visualisasi analitik grafik (**Recharts**).

2. **Portal Mahasiswa (`src/mahasiswa-dashboard/`)**
   - Manajemen profil akademik mahasiswa.
   - Pengajuan pendaftaran ormawa baru dan permohonan rekomendasi beasiswa.

3. **Portal Admin Ormawa / Hima (`src/ormawa-dashboard/`)**
   - Manajemen keanggotaan dan profil ormawa.
   - Pengajuan proposal kegiatan dan Laporan Pertanggungjawaban (LPJ) terstruktur.

4. **Portal Admin Dirmawa & Super Admin (`src/admin/`)**
   - **Kontrol Akses Multi-Peran**: Super Admin dapat menetapkan peran staf ganda secara modular menggunakan sistem badge checklist (seperti *Staf Depan*, *Staf Ormawa*, *Staf Beasiswa*, *Staf Alumni*, atau *Direktur*).
   - **Mode Baca-Saja (Read-only)**: Akun dengan peran `direktur` (Bu Wening) memiliki hak baca-saja di seluruh portal manajemen untuk memantau data tanpa izin modifikasi.
   - **Janji Temu Direktur**: Modul penjadwalan pertemuan resmi dengan Direktur Dirmawa, diajukan melalui Staf Depan/Super Admin dan dikelola di dasbor direktur.
   - **Manajemen Data CRUD**: Pengelolaan data beasiswa, direktori UKM, verifikasi anggota, artikel berita, dan persetujuan antrian akun baru.

---

## 🛠️ Tech Stack

- **Frontend:** React 19 & TypeScript
- **Build Tool:** Vite (v6.4.2)
- **Styling:** Tailwind CSS (dikonfigurasi menggunakan plugin `@tailwindcss/vite`)
- **Database & Auth:** Supabase (PostgreSQL dengan Row Level Security yang ketat)
- **Visualisasi Data:** Recharts
- **Validasi Form:** React Hook Form & Zod
- **Ikon:** Lucide React

---

## 📁 Struktur Direktori Proyek

```text
viteversion-dirmawa/
├── supabase/                         # Skema database & file migrasi Supabase
├── src/
│   ├── admin/                        # Portal Admin Dirmawa & Kontrol Akses
│   │   ├── components/               # Komponen kontrol akses, beasiswa, alumni, janji temu
│   │   └── types.ts                  # Deklarasi tipe data khusus Admin
│   ├── mahasiswa-dashboard/          # Portal dasbor pribadi mahasiswa
│   ├── ormawa-dashboard/             # Portal dasbor untuk pengurus Ormawa/Hima
│   ├── components/                   # Komponen halaman utama (Landing Page, Beasiswa, UKM, Alumni)
│   ├── services/                     # Layanan integrasi API Supabase & Auth
│   ├── types/                        # Deklarasi tipe data global mahasiswa & profil
│   ├── App.tsx                       # Titik masuk utama aplikasi & router
│   ├── index.css                     # Gaya CSS global & konfigurasi Tailwind
│   ├── main.tsx                      # Titik render utama Vite React
│   └── data.ts                       # Data cadangan statis
├── SETUP_DIRMAWA_LOCAL.md            # Panduan instalasi dan setup lokal
├── package.json                      # Berkas dependensi proyek
└── tsconfig.json                     # Konfigurasi compiler TypeScript
```

---

## 🏃 Panduan Memulai Cepat

Informasi lengkap mengenai persiapan database lokal (Docker/Supabase CLI), konfigurasi environment variable, dan migrasi database dapat ditemukan pada panduan terpisah di **[SETUP_DIRMAWA_LOCAL.md](file:///home/arfiandastr/Documents/magang/viteversion-dirmawa/SETUP_DIRMAWA_LOCAL.md)**.

### Langkah Menjalankan Aplikasi:

1. **Instal Dependensi**
   ```bash
   npm install
   ```

2. **Jalankan Server Development**
   ```bash
   npm run dev
   ```
   *Aplikasi secara default dapat diakses melalui `http://localhost:3000`.*

3. **Membangun Aplikasi untuk Produksi**
   ```bash
   npm run build
   ```
