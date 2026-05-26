# Product Requirements Document (PRD)
## Website Direktorat Kemahasiswaan — Universitas Pelita Bangsa
**Versi:** 1.0  
**Tanggal:** Mei 2026  
**Dibuat oleh:** Tim Web Development  
**Status:** Draft

---

## 1. Latar Belakang & Permasalahan

Website kemahasiswaan Universitas Pelita Bangsa (https://dirmawa.pelitabangsa.ac.id) saat ini menghadapi sejumlah masalah kritis:

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

### 4.1 Halaman Publik (Frontend)

#### 🏠 Beranda (Homepage)
- Hero section dengan tagline dan visual menarik
- Highlight berita/pengumuman terbaru
- Statistik singkat: jumlah UKM, alumni, mahasiswa berprestasi
- Shortcut navigasi ke modul utama
- Banner kegiatan/event mendatang

#### 🎓 Data Alumni
- **Visualisasi interaktif** data lulusan:
  - Grafik jumlah alumni per tahun kelulusan
  - Breakdown per program studi
  - Filter tahun & prodi (dropdown/slider)
  - Chart types: bar chart, line chart, pie chart
- **Sumber data:** upload file `.xlsx` oleh admin → diproses → ditampilkan sebagai visualisasi
- **Tabel alumni** dengan kolom: Nama, Prodi, Tahun Lulus, IPK (opsional)
- Export data sebagai PDF/CSV (untuk keperluan akreditasi)

#### 🏆 Mahasiswa Berprestasi
- Galeri kartu profil mahasiswa berprestasi
- Detail: nama, prodi, angkatan, jenis prestasi, tingkat (nasional/internasional), tahun
- Filter berdasarkan: tahun, prodi, tingkat prestasi
- Halaman detail per mahasiswa (foto, deskripsi pencapaian, dokumentasi)

#### 🏛️ UKM & Ormawa
- Direktori lengkap semua Unit Kegiatan Mahasiswa & Organisasi Mahasiswa
- Kartu per UKM: nama, deskripsi singkat, kategori, foto logo/kegiatan
- Halaman detail UKM: profil lengkap, galeri foto, kontak, media sosial, jadwal latihan/kegiatan
- Kategori UKM: Seni & Budaya, Olahraga, Akademik, Sosial, Kerohanian, Minat Khusus

#### 📰 Berita & Pengumuman
- Artikel berita kegiatan kemahasiswaan
- Pengumuman penting (beasiswa, lomba, deadline)
- Sistem tag dan kategori
- Search artikel

#### 🎓 Beasiswa
- **Halaman daftar beasiswa** — semua beasiswa yang tersedia di Universitas Pelita Bangsa (internal maupun eksternal)
- **Kartu per beasiswa** berisi: nama beasiswa, penyelenggara (kampus/pemerintah/swasta), kuota, nilai beasiswa, status (Buka / Tutup / Segera Dibuka)
- **Halaman detail beasiswa** berisi:
  - Deskripsi & latar belakang beasiswa
  - Persyaratan (IPK minimum, semester, dokumen yang dibutuhkan)
  - Jadwal penting: pembukaan, penutupan, pengumuman
  - Tata cara pendaftaran (step-by-step)
  - Tombol link ke formulir pendaftaran (Google Form / SIAKAD / eksternal)
  - Dokumen lampiran yang bisa diunduh (template surat, formulir PDF)
- **Filter & pencarian** berdasarkan: kategori (internal/eksternal/pemerintah), status (aktif/tutup), jenjang (S1/S2)
- **Badge notifikasi** — beasiswa yang akan segera dibuka dalam 7 hari
- **FAQ Beasiswa** — pertanyaan umum seputar beasiswa di Pelita Bangsa

#### 📄 Halaman Statis
- Profil Direktorat Kemahasiswaan (visi, misi, struktur organisasi)
- Layanan kemahasiswaan (konseling, karir)
- Kontak & lokasi

---

### 4.2 Panel Admin (Backend/CMS)

#### Dashboard Admin
- Statistik overview: jumlah konten, views, aktivitas terakhir
- Quick action: tambah berita, upload data alumni, tambah prestasi

#### Manajemen Konten
- CRUD berita & pengumuman (rich text editor)
- CRUD mahasiswa berprestasi (form + upload foto)
- CRUD UKM/Ormawa (form lengkap + galeri foto)
- CRUD Beasiswa (form lengkap + upload dokumen + pengaturan status & jadwal)

#### Manajemen Data Alumni
- Upload file `.xlsx` template alumni
- Preview data sebelum publish
- Validasi data otomatis (format, duplikat)
- Riwayat upload

#### Manajemen User Admin
- Role: Super Admin, Admin, Editor
- Manajemen akun admin

---

## 5. Tech Stack

### 5.1 Frontend
| Layer | Teknologi | Alasan |
|---|---|---|
| **Framework** | Next.js 14 (App Router) | SSR/SSG untuk SEO, performance, dan aksesibilitas; cocok untuk website institusi publik |
| **Bahasa** | TypeScript | Type safety, maintainability jangka panjang |
| **Styling** | Tailwind CSS + shadcn/ui | Developer experience cepat, komponen siap pakai, konsistensi desain |
| **Animasi** | Framer Motion | Animasi halus untuk transisi halaman dan elemen interaktif |
| **Visualisasi Data** | Recharts + D3.js | Chart alumni yang interaktif dan responsif |
| **Tabel Data** | TanStack Table (React Table) | Sorting, filtering, pagination untuk data alumni |
| **Form** | React Hook Form + Zod | Validasi form admin yang robust |
| **Icons** | Lucide React | Set ikon konsisten dan modern |

### 5.2 Backend & API
| Layer | Teknologi | Alasan |
|---|---|---|
| **Runtime** | Node.js | Ekosistem terlengkap, kompatibel dengan Next.js |
| **API** | Next.js API Routes / Route Handlers | Terintegrasi dengan frontend, mengurangi kompleksitas deployment |
| **Auth** | NextAuth.js v5 | Autentikasi admin yang aman, support multiple providers |
| **ORM** | Prisma | Type-safe database queries, migrasi mudah |
| **File Parsing** | SheetJS (xlsx) | Parse file Excel alumni yang diupload |
| **File Upload** | Uploadthing / Cloudinary | Upload foto dan file dengan CDN |

### 5.3 Database
| Layer | Teknologi | Alasan |
|---|---|---|
| **Database Utama** | PostgreSQL | Relasional, stabil, cocok untuk data terstruktur alumni & konten |
| **Hosting DB** | Supabase (PostgreSQL managed) | Free tier tersedia, dashboard mudah, built-in storage & auth alternatif |

### 5.4 Infrastructure & Deployment
| Layer | Teknologi | Alasan |
|---|---|---|
| **Hosting** | Vercel | Deployment otomatis, optimasi Next.js native, free tier untuk institusi |
| **CDN & Media** | Cloudinary | Optimasi gambar otomatis (WebP), galeri foto UKM |
| **Domain** | Subdomain existing `dirmawa.pelitabangsa.ac.id` | Tidak perlu registrasi domain baru |
| **CI/CD** | GitHub Actions + Vercel | Auto-deploy setiap push ke branch main |
| **Monitoring** | Vercel Analytics + Sentry | Pantau performa dan error |

### 5.5 Tools Pendukung
| Tool | Kegunaan |
|---|---|
| **Git + GitHub** | Version control & kolaborasi tim |
| **ESLint + Prettier** | Code quality & formatting konsisten |
| **Husky** | Pre-commit hooks untuk linting |
| **Storybook** | Dokumentasi & preview komponen UI |

---

## 6. Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────┐
│                    INTERNET / USER                       │
└───────────────────────────┬─────────────────────────────┘
                            │
                    ┌───────▼───────┐
                    │   Vercel CDN  │
                    │  (Edge Cache) │
                    └───────┬───────┘
                            │
          ┌─────────────────▼──────────────────┐
          │         Next.js Application         │
          │  ┌────────────┐  ┌───────────────┐  │
          │  │  App Router │  │  API Routes   │  │
          │  │ (Frontend) │  │  (Backend)    │  │
          │  └────────────┘  └───────┬───────┘  │
          └──────────────────────────┼───────────┘
                                     │
               ┌─────────────────────┼──────────────────┐
               │                     │                  │
       ┌───────▼──────┐    ┌─────────▼─────┐  ┌────────▼──────┐
       │  Supabase    │    │  Cloudinary   │  │  NextAuth.js  │
       │ (PostgreSQL) │    │  (Media CDN)  │  │  (Auth)       │
       └──────────────┘    └───────────────┘  └───────────────┘
```

---

## 7. Alur Data Alumni (Excel → Visualisasi)

```
Admin Upload .xlsx
        │
        ▼
Validasi Format File (SheetJS)
  - Cek kolom wajib
  - Cek format data
  - Laporan error jika tidak valid
        │
        ▼
Preview Data (Tabel sementara di admin panel)
        │
        ▼
Konfirmasi & Simpan ke Database (PostgreSQL via Prisma)
        │
        ▼
API Endpoint mengagregasi data per tahun & prodi
        │
        ▼
Frontend fetch → Recharts render visualisasi interaktif
```

---

## 8. Desain & UI/UX

### 8.1 Prinsip Desain
- **Clean & Professional** — mencerminkan institusi pendidikan tinggi berkualitas
- **Informatif** — data mudah dibaca, hierarki visual jelas
- **Accessible** — WCAG 2.1 AA compliance, kontras warna memadai
- **Mobile-first** — mayoritas mahasiswa mengakses via smartphone

### 8.2 Palet Warna (Proposal)
| Token | Hex | Penggunaan |
|---|---|---|
| Primary | `#003366` | Biru tua — warna utama institusi |
| Secondary | `#E8A020` | Emas — aksen & highlight |
| Neutral | `#F5F7FA` | Background halaman |
| Text | `#1A1A2E` | Teks utama |
| Success | `#22C55E` | Notifikasi sukses |

### 8.3 Tipografi
- **Heading:** Plus Jakarta Sans (modern, Indonesian-designed font)
- **Body:** Inter / Nunito Sans (legibility tinggi untuk konten panjang)

### 8.4 Komponen Kunci
- Navbar sticky dengan mega-menu dropdown
- Hero section dengan animasi counter statistik
- Card sistem modular untuk berita, UKM, prestasi
- Data table dengan filter & pagination
- Chart interaktif dengan tooltip dan animasi

---

## 9. Keamanan

| Area | Implementasi |
|---|---|
| **Autentikasi Admin** | NextAuth dengan session token + refresh token |
| **Authorization** | Role-based access control (RBAC) |
| **Input Validation** | Zod schema validation di semua endpoint |
| **File Upload** | Whitelist ekstensi (.xlsx, .jpg, .png, .pdf), max size 10MB |
| **HTTPS** | SSL/TLS via Vercel (otomatis) |
| **Rate Limiting** | Upstash Redis rate limiter pada API routes |
| **SQL Injection** | Prisma ORM (parameterized queries by default) |
| **XSS Protection** | Next.js built-in + sanitasi rich text editor |

---

## 10. SEO & Performa

| Aspek | Target |
|---|---|
| **Core Web Vitals LCP** | < 2.5 detik |
| **Core Web Vitals CLS** | < 0.1 |
| **Core Web Vitals FID** | < 100ms |
| **Lighthouse Score** | > 90 (semua kategori) |
| **SEO** | Meta tags, Open Graph, JSON-LD structured data |
| **Sitemap** | Auto-generated XML sitemap |
| **Image Optimization** | Next.js Image component + WebP via Cloudinary |

---

## 11. Tahapan Pengembangan (Roadmap)

### Phase 1 — Fondasi (Sprint 1–2, ~4 minggu)
- [ ] Setup project (Next.js, TypeScript, Tailwind, Prisma, PostgreSQL)
- [ ] Desain sistem (design tokens, komponen dasar, layout)
- [ ] Database schema (alumni, prestasi, UKM, berita, user)
- [ ] Autentikasi admin (NextAuth)
- [ ] Halaman Beranda (static, konten placeholder)

### Phase 2 — Modul Utama (Sprint 3–5, ~6 minggu)
- [ ] Modul UKM & Ormawa (CRUD + halaman publik)
- [ ] Modul Mahasiswa Berprestasi (CRUD + galeri)
- [ ] Modul Beasiswa (CRUD + halaman publik + upload dokumen + status otomatis)
- [ ] Modul Berita & Pengumuman
- [ ] Halaman statis (Profil Direktorat, Layanan, Kontak)

### Phase 3 — Alumni & Visualisasi (Sprint 6–7, ~4 minggu)
- [ ] Upload & parsing file `.xlsx` alumni
- [ ] Database alumni + API agregasi
- [ ] Visualisasi data interaktif (chart per tahun, per prodi)
- [ ] Filter & tabel alumni
- [ ] Export PDF/CSV

### Phase 4 — Polish & Launch (Sprint 8, ~2 minggu)
- [ ] QA & bug fixing
- [ ] Optimasi performa & SEO
- [ ] Testing aksesibilitas
- [ ] Migrasi konten dari website lama
- [ ] Pelatihan admin
- [ ] Go-live & monitoring

---

## 12. Struktur Database (Schema Overview)

```sql
-- Beasiswa
Beasiswa {
  id, nama, slug, penyelenggara, kategori (internal/eksternal/pemerintah),
  jenjang, deskripsi, persyaratan, nilai_beasiswa, kuota,
  tgl_buka, tgl_tutup, tgl_pengumuman,
  link_pendaftaran, status (draft/published/closed),
  created_at, updated_at
}

-- Dokumen Beasiswa (lampiran downloadable)
BeasiswaDokumen {
  id, beasiswa_id, nama_file, file_url, created_at
}

-- Alumni
Alumni {
  id, nama, nim, prodi_id, tahun_masuk, tahun_lulus, ipk, status, created_at
}

-- Program Studi
Prodi {
  id, nama, fakultas, jenjang (S1/D3/S2)
}

-- Mahasiswa Berprestasi
Prestasi {
  id, mahasiswa_nama, nim, prodi_id, angkatan, jenis_prestasi,
  tingkat (kampus/regional/nasional/internasional),
  deskripsi, foto_url, tahun, created_at
}

-- UKM/Ormawa
UKM {
  id, nama, slug, kategori, deskripsi, logo_url, cover_url,
  kontak_email, kontak_wa, instagram, status_aktif, created_at
}

-- Galeri UKM
UKMFoto {
  id, ukm_id, foto_url, caption, created_at
}

-- Berita
Berita {
  id, judul, slug, konten, cover_url, kategori,
  status (draft/published), penulis_id, published_at
}

-- User Admin
User {
  id, nama, email, password_hash, role (superadmin/admin/editor), created_at
}
```

---

## 13. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Data alumni tidak konsisten/tidak lengkap | Tinggi | Buat template Excel standar + validasi otomatis saat upload |
| Admin tidak aktif kembali | Tinggi | Dokumentasi CMS lengkap + pelatihan; antarmuka admin sesederhana mungkin |
| Perubahan branding universitas | Medium | Gunakan design tokens & CSS variables untuk kemudahan rebranding |
| Server down saat akreditasi | Tinggi | Deploy di Vercel (99.99% uptime SLA), backup database berkala |
| Data alumni sensitif bocor | Tinggi | Role-based access, halaman alumni hanya tampil data yang diizinkan (no NIM by default) |

---

## 14. Kriteria Penerimaan (Acceptance Criteria)

Website dinyatakan siap launch jika memenuhi semua kriteria berikut:

- [ ] Semua halaman publik dapat diakses tanpa error di mobile & desktop
- [ ] Admin dapat login, menambah/edit/hapus konten tanpa bantuan developer
- [ ] Upload file Excel alumni berhasil diproses & divisualisasikan
- [ ] Lighthouse score ≥ 90 untuk Performance, Accessibility, SEO
- [ ] Data alumni dapat diekspor sebagai PDF/CSV
- [ ] Semua form memiliki validasi yang sesuai
- [ ] Website dapat diakses di subdomain `dirmawa.pelitabangsa.ac.id`
- [ ] Dokumentasi teknis & panduan admin tersedia

---

## 15. Referensi & Inspirasi Desain

- https://kemahasiswaan.ui.ac.id (Universitas Indonesia)
- https://kemahasiswaan.ugm.ac.id (Universitas Gadjah Mada)
- https://student.itb.ac.id (Institut Teknologi Bandung)

---

*Dokumen ini bersifat living document dan akan diperbarui sesuai perkembangan diskusi dengan stakeholder.*
