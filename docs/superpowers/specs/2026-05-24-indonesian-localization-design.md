# Indonesian Language Localization Design

## Overview
This document outlines the design for localizing all user-facing text in the Dirmawa 2.0 website to Bahasa Indonesia. The goal is to ensure consistency in language for Indonesian users while maintaining English for developer-facing code (variables, function names, etc.).

## Scope
- Translate all visible user interface text to Bahasa Indonesia
- Maintain English for code identifiers, comments, and technical documentation
- Focus on components that render text to users: Navbar, HomeView, ScholarshipView, UkmView, AlumniView, AchievementView, NewsView, AdminView, Footer
- Update static text in components, placeholder text, labels, buttons, navigation items, headers, tooltips, etc.

## Current State Analysis
Based on code review, the following components contain user-facing text that needs translation:

### 1. Navbar Component (`src/components/Navbar.tsx`)
- Navigation items: Homepage, Alumni, Achievements, Scholarships, UKM Directory, Berita, Student Login
- Brand text: "Direktorat", "Kemahasiswaan dan Alumni" (already in Indonesian)
- Search placeholder: "Search..."
- Login button text: "Student Login"

### 2. HomeView Component (`src/components/HomeView.tsx`)
- Hero banner text: "Universitas Pelita Bangsa", "Lorem ipsum. dolor sit amet.", "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quae quod voluptatem nesciunt!"
- Service buttons: "Pelajari Lebih Lanjut", "Program Unggulan"
- Stats labels: "Unit Kegiatan Mahasiswa", "Jaringan Alumni", "Prestasi Gemilang"
- Service cards: "Beasiswa", "UKM", "Alumni", "Pusat Karir"
- News section: "Berita & Pengumuman", "Lihat Semua", "Prestasi", "Akademik", "Lihat Detail"
- Agenda section: "Agenda Mendatang", "Hari Ini", "Job Fair & Career Expo 2026", "Lihat Detail"
- Minat Bakat section: "University Activity", "Eksplorasi Minat & Bakat di UKM", "Olahraga", "Seni & Budaya", "Akademik", "Jelajahi Semua UKM"

### 3. ScholarshipView Component (`src/components/ScholarshipView.tsx`)
- Header: "SIPMA BEASISWA", "Portal Informasi Beasiswa", "Cari dan temukan kesempatan pembiayaan pendidikan..."
- Filter labels: "Semua Beasiswa", "internal", "pemerintah", "swasta"
- Search placeholder: "Cari beasiswa atau penyedia..."
- Scholarship cards: "Sifat Bantuan:", "Deadline Registrasi:"
- Consulting section: "Konsultasi Beasiswa", "Kesulitan mendaftar KIP atau bingung menentukan jenis beasiswa yang sesuai?", "Jadwal Konsultasi Terkirim!", "Nama Lengkap Mahasiswa", "NIM Mahasiswa", "Jenis Layanan", "Email Aktif Kampus", "Pesan / Kendala Utama", "Kirim Permohonan Konsultasi"
- FAQ section: "Pusat Bantuan Informasi", "Frequently Asked Questions"
- Details modal: "Persyaratan Berkas", "Kelengkapan Manfaat & Subsidi", "Batas akhir formulir online", "Pintu SIPMA UPB", "Tutup Review"

### 4. UkmView Component (`src/components/UkmView.tsx`)
- Header: "EKSPELORASI ORMAWA", "Direktori UKM & Organisasi", "Temukan wadah kreativitas, pengembangan kepribadian, kepemimpinan, dan bakat..."
- Filter labels: "Semua Kategori", category names (Seni & Budaya, Olahraga, Akademik, Sosial, Kerohanian)
- Search placeholder: "Cari nama UKM..."
- Action buttons: "Detail Profil", "Gabung UKM"
- Info banner: "Pendanaan Ormawa", "Kompensasi & Hibah Kreativitas UPB", "Ajukan Proposal Ormawa"
- UKM detail modal: "Sejarah & Gambaran Umum", "Visi Utama", "Misi Operasional", "Agenda & Jadwal Kegiatan", "Syarat Keanggotaan", "Hubungi Pengurus UKM"
- Join form: "FORMULIR PENDAFTARAN", "Nama Lengkap Mahasiswa", "NIM Mahasiswa", "Jurusan / Prodi", "Email Kontak Aktif", "Aspirasi / Motivasi Gabung", "Kirim Formulir Pendaftaran"
- Success messages: "Pengajuan Pendaftaran Terkirim!", "Data diri Anda berhasil direkam..."

### 5. AlumniView Component (`src/components/AlumniView.tsx`)
*(Not reviewed yet - need to check)*

### 6. AchievementView Component (`src/components/AchievementView.tsx`)
*(Not reviewed yet - need to check)*

### 7. NewsView Component (`src/components/NewsView.tsx`)
- Header: "Berita", "Kembali ke Homepage"
- Empty state: "Tidak berita yang tersedia saat ini."

### 8. AdminView Component (`src/components/AdminView.tsx`)
*(Not reviewed yet - need to check)*

### 9. Footer Component (`src/components/Footer.tsx`)
- Column headers: "Layanan Mahasiswa", "Hubungi Kami", "Lokasi Kampus"
- Link texts: "Portal Berita & Kegiatan", "Informasi Beasiswa", "Direktori UKM & Organisasi", "Panggung Prestasi Mahasiswa", "Sebaran Alumni & Pelacakan Karir"
- Contact labels: "Gedung B Lt. 2, Kampus Universitas Pelita Bangsa.", "kemahasiswaan@pelitabangsa.ac.id", "(021) 2928-1111 / Ext: 104", "Buka Peta"
- Copyright text: "© 2026 Directorate of Student Affairs & Alumni Relations UPB. All Rights Reserved.", "Pristine Academic Integrity — Tridharma Perguruan Tinggi"

## Approach
We will create a centralized translation system using a JSON-based i18n approach or direct string replacement in components. Given the current codebase structure, I recommend:

### Option 1: Direct String Replacement (Recommended for simplicity)
- Replace all hardcoded English strings with Indonesian equivalents in each component
- Keep variables, function names, comments in English
- Maintain existing component structure and styling

### Option 2: Centralized Translation Files
- Create `src/locales/id.json` with all translations
- Create `src/locales/en.json` for fallback
- Implement a simple useTranslation hook
- Replace strings with t('key') calls

Given the scope and timeline, Option 1 is recommended for immediate implementation with plans to migrate to Option 2 in future iterations.

## Data Flow
1. User visits website
2. Components render with Indonesian text
3. No external API calls needed for static translations
4. Interactive elements (forms, buttons) maintain functionality with updated labels

## Error Handling
- If translation missing, fallback to English (for Option 2)
- For Option 1, all strings will be present in code
- No runtime errors expected from translation changes

## Implementation Plan
1. Create translation mapping for all user-facing strings
2. Update Navbar component
3. Update HomeView component
4. Update ScholarshipView component
5. Update UkmView component
6. Update AlumniView component
7. Update AchievementView component
8. Update NewsView component
9. Update AdminView component
10. Update Footer component
11. Verify all changes don't break functionality
12. Test with Indonesian language settings

## Components to Update
1. `src/components/Navbar.xaml`
2. `src/components/HomeView.tsx`
3. `src/components/ScholarshipView.tsx`
4. `src/components/UkmView.tsx`
5. `src/components/AlumniView.tsx`
6. `src/components/AchievementView.tsx`
7. `src/components/NewsView.tsx`
8. `src/components/AdminView.tsx`
9. `src/components/Footer.tsx`

## Success Criteria
- All user-visible text is in Bahasa Indonesia
- No broken functionality or UI issues
- Code maintainability preserved (variables, functions in English)
- Consistent terminology across components
- Proper handling of special characters in Indonesian

## Next Steps
After design approval, proceed to implementation planning phase.