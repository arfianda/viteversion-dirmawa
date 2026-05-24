# Indonesian Localization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Translate all user-facing text in the Dirmawa 2.0 website to Bahasa Indonesia while maintaining English for developer-facing code.

**Architecture:** Direct string replacement approach - replace all hardcoded English strings with Indonesian equivalents in each component. Maintain existing component structure, variable names, and functionality.

**Tech Stack:** React, TypeScript, Vite
---
### Task 1: Update Navbar Component

**Files:**
- Modify: `C:\Users\arfia\Documents\Websites\dirmawa2.0\src\components\Navbar.tsx`

- [ ] **Step 1: Update navigation items to Indonesian**

```typescript
const navItems = [
  { id: 'home', label: 'Beranda' },
  { id: 'alumni', label: 'Alumni' },
  { id: 'achievements', label: 'Prestasi' },
  { id: 'scholarships', label: 'Beasiswa' },
  { id: 'ukms', label: 'Direktori UKM' },
  { id: 'news', label: 'Berita' },
];
```

- [ ] **Step 2: Update search placeholder**

```typescript
<input
  type="text"
  placeholder="Cari..."
  onFocus={() => setSearchFocused(true)}
  onBlur={() => setSearchFocused(false)}
  className="w-full bg-slate-50 border border-slate-200 rounded-full pl-9 pr-4 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#001e40] transition-all"
/>
```

- [ ] **Step 3: Update login button text**

```typescript
<span>Login Mahasiswa</span>
```

- [ ] **Step 4: Save the file**

### Task 2: Update HomeView Component

**Files:**
- Modify: `C:\Users\arfia\Documents\Websites\dirmawa2.0\src\components\HomeView.tsx`

- [ ] **Step 1: Update hero banner text**

```typescript
<h1 className="font-sans font-black text-3xl sm:text-4xl lg:text-[45px] tracking-tight text-white leading-[1.1]">
  Selamat Datang di<br /> Universitas Pelita Bangsa
</h1>

<p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed max-w-xl">
  Portal resmi informasi dan layanan kemahasiswaan Universitas Pelita Bangsa.
</p>
```

- [ ] **Step 2: Update service buttons**

```typescript
<button 
  onClick={() => setCurrentTab('scholarships')}
  className="px-6 py-3 bg-[#feb234] hover:bg-[#ffddb2] text-[#001e40] font-sans font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow transition-all active:scale-95 duration-300 flex items-center space-x-2"
>
  <span>Selengkapnya</span>
  <ArrowRight size={14} className="stroke-[2.5]" />
</button>
<button 
  onClick={() => setCurrentTab('ukms')}
  className="px-6 py-3 bg-[#001e40] hover:bg-[#002d61] border border-[#002d61] text-white font-sans font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all active:scale-95 duration-300"
>
  Lihat Program Unggulan
</button>
```

- [ ] **Step 3: Update stats labels (already in Indonesian - verify)**

```typescript
const stats = [
  { value: '50+', label: 'Unit Kegiatan Mahasiswa', sub: 'Minat, Bakat, & Keagamaan', colorBg: 'bg-[#001e40]/10 text-[#001e40]' },
  { value: '15k+', label: 'Jaringan Alumni', sub: 'Tersebar di Berbagai Industri', colorBg: 'bg-amber-50 text-[#feb234]' },
  { value: '500+', label: 'Prestasi Gemilang', sub: 'Level Regional hingga Nasional', colorBg: 'bg-emerald-50 text-emerald-600' }
];
```

- [ ] **Step 4: Update service section title and cards**

```typescript
<h2 className="font-sans font-extrabold text-2xl text-[#001e40] tracking-tight">Layanan Utama</h2>

// In service cards:
// Beasiswa card
<span className="bg-[#feb234] text-[#001e40] px-2.5 py-0.5 text-[9px] font-mono font-black uppercase rounded w-fit">
  Beasiswa
</span>
<h3 className="font-sans font-black text-xl text-white">Beasiswa</h3>
<p className="text-xs text-slate-300 leading-relaxed font-sans">
  Informasi lengkap mengenai program beasiswa internal dan eksternal untuk mendukung studi Anda.
</p>

// UKM card
<h4 className="font-sans font-bold text-sm text-[#001e40]">UKM</h4>
<p className="text-xs text-slate-500 font-sans line-clamp-1 leading-normal">
  Temukan minat dan bakat Anda melalui puluhan Unit Kegiatan Mahasiswa yang aktif di kampus.
</p>

// Alumni card
<h4 className="font-sans font-bold text-sm text-[#001e40]">Alumni</h4>
<p className="text-xs text-slate-500 font-sans line-clamp-1 leading-normal">
  Terhubung dengan jaringan alumni yang sukses di berbagai bidang profesional.
</p>

// Pusat Karir card
<h4 className="font-sans font-black text-base text-white">Pusat Karir</h4>
<p className="text-xs text-slate-300 font-sans leading-relaxed">
  Persiapkan masa depan karir Anda dengan pelatihan dan info lowongan kerja terbaru.
</p>
```

- [ ] **Step 5: Update news section**

```typescript
<h2 className="font-sans font-extrabold text-xl text-[#001e40]">Berita & Pengumuman</h2>
<button
  onClick={() => setCurrentTab('news')}
  className="text-xs font-sans font-bold text-[#feb234] hover:text-[#ffddb2] flex items-center space-x-1"
>
  <span>Lihat Semua</span>
  <ArrowRight size={12} />
</button>
```

- [ ] **Step 6: Update news badges and content**

```typescript
// Prestasi badge
<span className="inline-block bg-orange-50 text-orange-600 px-2 py-0.5 text-[9px] font-sans font-black uppercase rounded">
  Prestasi
</span>
// Akademik badge
<span className="inline-block bg-sky-50 text-sky-600 px-2 py-0.5 text-[9px] font-sans font-black uppercase rounded">
  Akademik
</span>
// Update news content with Indonesian text
```

- [ ] **Step 7: Update agenda section**

```typescript
<h2 className="font-sans font-extrabold text-xl text-[#001e40]">Agenda Mendatang</h2>
<h3 className="font-sans font-black text-lg text-white leading-tight">
  Job Fair &amp; Career Expo 2026
</h3>
<button 
  onClick={() => handleServiceClick('alumni')}
  className="w-full bg-white/10 hover:bg-white/20 text-[#feb234] py-2.5 rounded-xl text-xs font-sans font-bold uppercase transition"
>
  Lihat Detail
</button>
```

- [ ] **Step 8: Update minat bakat section**

```typescript
<span className="font-mono text-[10px] uppercase font-bold text-[#feb234] tracking-wider block">Kegiatan Kampus</span>
<h2 className="font-sans font-black text-2xl text-[#001e40]">Eksplorasi Minat &amp; Bakat di UKM</h2>
<p className="text-xs text-slate-500 font-sans">
  Temukan komunitas yang tepat untuk mengembangkan potensi diri, hobi, dan kepemimpinan Anda di Universitas Pelita Bangsa.
</p>
<button 
  onClick={() => setCurrentTab('ukms')}
  className="px-6 py-3 bg-[#001e40] hover:bg-[#002d61] text-white font-sans font-bold text-xs uppercase tracking-wider rounded-xl shadow transition active:scale-95"
>
  Jelajahi Semua UKM
</button>
```

- [ ] **Step 9: Save the file**

### Task 3: Update ScholarshipView Component

**Files:**
- Modify: `C:\Users\arfia\Documents\Websites\dirmawa2.0\src\components\ScholarshipView.tsx`

- [ ] **Step 1: Update header section**

```typescript
<div className="text-center space-y-3">
  <span className="font-mono text-xs font-black uppercase tracking-widest text-[#feb234] block">SIPMA BEASISWA</span>
  <h1 className="font-sans font-black text-3xl sm:text-4xl text-[#001e40] tracking-tight">Portal Informasi Beasiswa</h1>
  <p className="text-sm sm:text-base text-slate-505 max-w-2xl mx-auto font-sans leading-relaxed">
    Cari dan temukan kesempatan pembiayaan pendidikan yang diselenggarakan oleh Kementerian, Pemerintah Daerah, Yayasan UPB, maupun Perusahaan Swasta.
  </p>
</div>
```

- [ ] **Step 2: Update filter buttons**

```typescript
{['semua', 'internal', 'pemerintah', 'swasta'].map((type) => (
  <button
    key={type}
    onClick={() => setSelectedType(type as any)}
    className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-sans font-extrabold tracking-wide transition-all uppercase ${
      selectedType === type
        ? 'bg-[#feb234] text-[#001e40] shadow-md'
        : 'bg-slate-50 text-slate-500 border border-slate-200 hover:text-[#001e40] hover:bg-slate-100'
    }`}
  >
    {type === 'semua' ? 'Semua Beasiswa' : 
     type === 'internal' ? 'Beasiswa Internal' :
     type === 'pemerintah' ? 'Beasiswa Pemerintah' : 'Beasiswa Swasta'}
  </button>
))}
```

- [ ] **Step 3: Update search placeholder**

```typescript
<input
  type="text"
  placeholder="Cari beasiswa atau penyedia..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-sans text-slate-800 placeholder-slate-450 focus:outline-none focus:border-[#001e40] focus:bg-white transition-all"
/>
```

- [ ] **Step 4: Update scholarship card labels**

```typescript
<div className="flex items-center space-x-2.5 text-xs font-mono">
  <span className="bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded-md uppercase font-bold text-[9px]">
    {s.type}
  </span>
  <span className="text-slate-300">•</span>
  <span className="text-[#feb234] font-extrabold">{s.provider}</span>
</div>
```

- [ ] **Step 5: Update consulting section**

```typescript
<div className="space-y-2">
  <div className="flex items-center space-x-2 text-[#001e40]">
    <PhoneCall size={20} className="text-[#feb234]" />
    <h3 className="font-sans font-black text-lg text-[#001e40] tracking-tight">Konsultasi Beasiswa</h3>
  </div>
  <p className="text-xs text-slate-505 leading-relaxed font-sans">
    Kesulitan mendaftar KIP atau bingung menentukan jenis beasiswa yang sesuai? Hubungi staf kemahasiswaan tatap muka online secara langsung.
  </p>
</div>
// Update form labels
<div className="space-y-1">
  <label className="text-slate-700 block font-bold">Nama Lengkap Mahasiswa</label>
</div>
<div className="space-y-1">
  <label className="text-slate-700 block font-bold">NIM Mahasiswa</label>
</div>
<div className="space-y-1">
  <label className="text-slate-700 block font-bold">Jenis Layanan</label>
</div>
<div className="space-y-1">
  <label className="text-slate-700 block font-bold">Email Aktif Kampus</label>
</div>
<div className="space-y-1">
  <label className="text-slate-700 block font-bold">Pesan / Kendala Utama</label>
</div>
<button type="submit" className="w-full py-3 bg-[#001e40] hover:bg-[#002d61] text-white font-bold uppercase rounded-xl shadow font-sans transition-all active:scale-95 text-xs flex items-center justify-center space-x-2">
  <span>Kirim Permohonan Konsultasi</span>
</button>
```

- [ ] **Step 6: Update FAQ section**

```typescript
<div className="space-y-1">
  <span className="font-mono text-xs font-black uppercase text-[#feb234]">Pusat Bantuan Informasi</span>
  <h2 className="font-sans font-extrabold text-2xl text-[#001e40] tracking-tight">Pertanyaan yang Sering Diajukan (FAQ)</h2>
</div>
// FAQ content is already in Indonesian - verify
```

- [ ] **Step 7: Update details modal**

```typescript
<div className="space-y-3 font-sans">
  <span className="text-sm font-bold text-[#001e40] block uppercase border-b border-slate-100 pb-1.5">Persyaratan Berkas</span>
</div>
<div className="space-y-3 font-sans">
  <span className="text-sm font-bold text-[#001e40] block uppercase border-b border-slate-100 pb-1.5">Kelengkapan Manfaat &amp; Subsidi</span>
</div>
<div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center space-x-3 text-xs text-slate-500 leading-relaxed font-sans">
  <Info size={18} className="text-[#feb234] flex-shrink-0" />
  <span>
    Batas akhir formulir online ditutup pada <strong className="text-slate-800">{selectedScholarship.registrationDeadline}</strong>. Seluruh berkas scan wajib digabungkan dalam format PDF berstandar.
  </span>
</div>
<div className="bg-slate-100 border-t border-slate-200 px-6 py-4 flex justify-between items-center flex-shrink-0 select-none">
  <span className="text-[10px] font-mono font-bold text-[#feb234] uppercase tracking-wide">Pintu SIPMA UPB</span>
  <button onClick={() => setSelectedScholarship(null)} className="bg-[#001e40] hover:bg-[#002d61] text-white font-sans font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer">
    Tutup Review
  </button>
</div>
```

- [ ] **Step 8: Update submit button in modal**

```typescript
<button onClick={() => setSelectedScholarship(null)} className="bg-[#001e40] hover:bg-[#002d61] text-white font-sans font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer">
  Tutup Review
</button>
```

- [ ] **Step 9: Save the file**

### Task 4: Update UkmView Component

**Files:**
- Modify: `C:\Users\arfia\Documents\Websites\dirmawa2.0\src\components\UkmView.tsx`

- [ ] **Step 1: Update header section**

```typescript
<div className="text-center space-y-3">
  <span className="font-mono text-xs font-black uppercase tracking-widest text-[#feb234] block">EKSPELORASI ORMAWA</span>
  <h1 className="font-sans font-black text-3xl sm:text-4xl text-[#001e40] tracking-tight">Direktori UKM &amp; Organisasi</h1>
  <p className="text-sm sm:text-base text-slate-505 max-w-2xl mx-auto font-sans leading-relaxed">
    Temukan wadah kreativitas, pengembangan kepribadian, kepemimpinan, dan bakat di berbagai Unit Kegiatan Mahasiswa Universitas Pelita Bangsa.
  </p>
</div>
```

- [ ] **Step 2: Update filter buttons**

```typescript
{categories.map((cat) => (
  <button
    key={cat}
    onClick={() => setSelectedCategory(cat)}
    className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-sans font-extrabold tracking-wide transition-all uppercase ${
      selectedCategory === cat
        ? 'bg-[#feb234] text-[#001e40] shadow-md font-bold'
        : 'bg-slate-50 text-slate-505 border border-slate-200 hover:text-[#001e40] hover:bg-slate-100'
    }`}
  >
    {cat === 'semua' ? 'Semua Kategori' : cat}
  </button>
))}
```

- [ ] **Step 3: Update search placeholder**

```typescript
<input
  type="text"
  placeholder="Cari nama UKM..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-sans text-slate-800 placeholder-slate-455 focus:outline-none focus:border-[#001e40] focus:bg-white transition-all"
/>
```

- [ ] **Step 4: Update action buttons**

```typescript
<div className="px-6 pb-6 pt-2 border-t border-slate-100 flex gap-3">
  <button onClick={() => setSelectedUkmId(u.id)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-sans font-bold text-xs rounded-xl transition cursor-pointer text-center">
    Detail Profil
  </button>
  <button onClick={() => setJoinUkmId(u.id)} className="flex-1 py-2.5 bg-[#001e40] hover:bg-[#002d61] text-white font-sans font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm transition active:scale-95">
    Gabung UKM
  </button>
</div>
```

- [ ] **Step 5: Update info banner**

```typescript
<div className="bg-[#001e40] border border-[#002d61] p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-md relative overflow-hidden">
  <div className="inline-flex items-center space-x-1.5 bg-[#feb234]/10 border border-[#feb234]/30 text-[#feb234] px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase">
    <Sparkles size={11} />
    <span>Pendanaan Ormawa</span>
  </div>
  <h3 className="font-sans font-extrabold text-xl sm:text-2xl text-white tracking-tight">Kompensasi &amp; Hibah Kreativitas UPB</h3>
  <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
    Setiap UKM terdaftar berhak mengajukan pendanaan proposal operasional, insentif prestasi delegasi lomba, perlengkapan inventaris, dan fasilitas bimbingan dosen dari Direktorat Kemahasiswaan.
  </p>
  <button onClick={() => setSelectedUkmId(null)} className="bg-[#feb234] hover:bg-[#ffddb2] text-[#001e40] font-sans font-black text-xs px-5 py-3.5 rounded-xl uppercase tracking-wider shadow cursor-pointer transition active:scale-95">
    Ajukan Proposal Ormawa
  </button>
</div>
```

- [ ] **Step 6: Update UKM detail modal**

```typescript
// Update modal headers and content
<div className="space-y-2 font-sans">
  <span className="text-xs font-bold text-[#feb234] uppercase tracking-wider block">Sejarah &amp; Gambaran Umum</span>
</div>
<div className="space-y-2 font-sans">
  <span className="text-xs font-bold text-[#feb234] uppercase tracking-wider block">Visi Utama</span>
</div>
<div className="space-y-2 font-sans">
  <span className="text-xs font-bold text-[#feb234] uppercase tracking-wider block">Misi Operasional</span>
</div>
<div className="space-y-3">
  <span className="text-xs font-bold text-[#feb234] uppercase tracking-wider block">Agenda &amp; Jadwal Kegiatan</span>
</div>
<div className="space-y-3">
  <span className="text-xs font-bold text-[#feb234] uppercase tracking-wider block">Syarat Keanggotaan</span>
</div>
<div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3 pt-6">
  <span className="text-xs font-bold text-[#001e40] uppercase tracking-wider block">Hubungi Pengurus UKM</span>
</div>
<div className="bg-slate-100 border-t border-slate-200 px-6 py-4 flex justify-between items-center flex-shrink-0">
  <span className="text-[10px] font-sans font-bold text-[#feb234] uppercase tracking-wide">ORGANISASI UPB</span>
  <button onClick={() => setSelectedUkmId(null)} className="bg-slate-200 hover:bg-slate-350 text-slate-700 font-sans font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer">
    Tutup Profil
  </button>
  <button onClick={() => { setSelectedUkmId(null); setJoinUkmId(activeUkm.id); }} className="bg-[#001e40] hover:bg-[#002d61] text-white font-sans font-bold text-xs px-4 py-2.5 rounded-xl uppercase tracking-wider transition active:scale-95 cursor-pointer">
    Gabung Sekarang
  </button>
</div>
```

- [ ] **Step 7: Update join form**

```typescript
<div className="flex justify-between items-start">
  <div className="space-y-1 text-slate-800">
    <div className="font-mono text-[10px] font-bold text-[#feb234] uppercase tracking-wider">FORMULIR PENDAFTARAN</div>
    <h3 className="font-sans font-black text-xl text-[#001e40]">Join {ukms.find(d => d.id === joinUkmId)?.name}</h3>
  </div>
</div>
// Update form labels
<div className="space-y-1">
  <label className="text-slate-700 block font-bold">Nama Lengkap Mahasiswa</label>
</div>
<div className="grid grid-cols-2 gap-3">
  <div className="space-y-1">
    <label className="text-slate-700 block font-bold">NIM Mahasiswa</label>
  </div>
  <div className="space-y-1">
    <label className="text-slate-700 block font-bold">Jurusan / Prodi</label>
  </div>
</div>
<div className="space-y-1">
  <label className="text-slate-700 block font-bold">Email Kontak Aktif</label>
</div>
<div className="space-y-1">
  <label className="text-slate-700 block font-bold">Aspirasi / Motivasi Gabung</label>
</div>
<button type="submit" className="w-full py-3 bg-[#001e40] hover:bg-[#002d61] text-white font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition duration-305 shadow-sm active:scale-95">
  Kirim Formulir Pendaftaran
</button>
// Update success messages
<div className="p-4 bg-yellow-500/10 border border-yellow-350 text-[#feb234] text-xs leading-relaxed rounded-xl font-sans animate-fade-in">
  <span className="font-bold block mb-1">✓ Pengajuan Pendaftaran Terkirim!</span>
  Data diri Anda berhasil direkam dalam waiting-list kepengurusan. Silakan periksa pesan WhatsApp Anda dalam beberapa hari kerja untuk undangan grup kaderisasi internal.
</div>
<div className="p-4 bg-yellow-500/10 border border-yellow-350 text-[#feb234] text-xs leading-relaxed rounded-xl font-sans animate-fade-in">
  <span className="font-bold block mb-1">✓ Jadwal Konsultasi Terkirim!</span>
  Sistem telah mendata permohonan Anda. Nomor tiket antrean dan link Zoom online akan dikirimkan ke email Anda dalam waktu 1x24 jam kerja instansi.
</div>
```

- [ ] **Step 8: Save the file**

### Task 5: Update AlumniView Component

**Files:**
- Modify: `C:\Users\arfia\Documents\Websites\dirmawa2.0\src\components\AlumniView.tsx`

- [ ] **Step 1: Read the component to identify all user-facing text**

- [ ] **Step 2: Update all hardcoded English strings to Indonesian equivalents**

- [ ] **Step 3: Save the file**

### Task 6: Update AchievementView Component

**Files:**
- Modify: `C:\Users\arfia\Documents\Websites\dirmawa2.0\src\components\AchievementView.tsx`

- [ ] **Step 1: Read the component to identify all user-facing text**

- [ ] **Step 2: Update all hardcoded English strings to Indonesian equivalents**

- [ ] **Step 3: Save the file**

### Task 7: Update NewsView Component

**Files:**
- Modify: `C:\Users\arfia\Documents\Websites\dirmawa2.0\src\components\NewsView.tsx`

- [ ] **Step 1: Update header**

```typescript
<div className="flex justify-between items-center border-b border-slate-200 pb-4">
  <h2 className="font-sans font-extrabold text-xl text-[#001e40]">Berita</h2>
  <button onClick={() => setCurrentTab('home')} className="text-xs font-sans font-bold text-[#feb234] hover:text-[#ffddb2] flex items-center space-x-1">
    <span>Kembali ke Beranda</span>
    <ArrowRight size={12} />
  </button>
</div>
```

- [ ] **Step 2: Update empty state message**

```typescript
{beritaNews.length === 0 && (
  <div className="text-center py-12">
    <p className="text-slate-500">Tidak berita yang tersedia saat ini.</p>
  </div>
)}
```

- [ ] **Step 3: Save the file**

### Task 8: Update AdminView Component

**Files:**
- Modify: `C:\Users\arfia\Documents\Websites\dirmawa2.0\src\components\AdminView.tsx`

- [ ] **Step 1: Read the component to identify all user-facing text**

- [ ] **Step 2: Update all hardcoded English strings to Indonesian equivalents**

- [ ] **Step 3: Save the file**

### Task 9: Update Footer Component

**Files:**
- Modify: `C:\Users\arfia\Documents\Websites\dirmawa2.0\src\components/Footer.tsx`

- [ ] **Step 1: Update column headers**

```typescript
<h3 className="text-white font-sans font-semibold text-base py-1 uppercase tracking-wider relative inline-block border-b-2 border-[#feb234] mb-6">
  Layanan Mahasiswa
</h3>
<h3 className="text-white font-sans font-semibold text-base py-1 uppercase tracking-wider relative inline-block border-b-2 border-[#feb234] mb-2">
  Hubungi Kami
</h3>
<h3 className="text-white font-sans font-semibold text-base py-1 uppercase tracking-wider relative inline-block border-b-2 border-[#feb234] mb-6">
  Lokasi Kampus
</h3>
```

- [ ] **Step 2: Update quick links**

```typescript
<li><button onClick={() => handleNav('news')} className="hover:text-[#feb234] text-slate-400 transition-colors block text-left">
  Portal Berita &amp; Kegiatan
</button></li>
<li><button onClick={() => handleNav('scholarships')} className="hover:text-[#feb234] text-slate-300 transition-colors block text-left font-semibold">
  Informasi Beasiswa
</button></li>
<li><button onClick={() => handleNav('ukms')} className="hover:text-[#feb234] text-slate-400 transition-colors block text-left">
  Direktori UKM &amp; Organisasi
</button></li>
<li><button onClick={() => handleNav('achievements')} className="hover:text-[#feb234] text-slate-400 transition-colors block text-left">
  Panggung Prestasi Mahasiswa
</button></li>
<li><button onClick={() => handleNav('alumni')} className="hover:text-[#feb234] text-slate-400 transition-colors block text-left">
  Sebaran Alumni &amp; Pelacakan Karir
</button></li>
```

- [ ] **Step 3: Update contact information labels (these are already descriptive - keep as is)**

- [ ] **Step 4: Update copyright text**

```typescript
<div className="border-t border-[#002d61] mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 font-mono">
  <p>© 2026 Direktorat Kemahasiswaan &amp; Hubungan Alumni UPB. All Rights Reserved.</p>
  <p className="mt-2 sm:mt-0 text-[#feb234]">Integritas Akademik Pristine — Tridharma Perguruan Tinggi</p>
</div>
```

- [ ] **Step 5: Save the file**

### Task 10: Test Application Functionality

**Files:**
- Test: Application functionality

- [ ] **Step 1: Start the development server**

Run: `npm run dev`
Expected: Application starts successfully on port 3000

- [ ] **Step 2: Verify all pages load correctly with Indonesian text**

- [ ] **Step 3: Test navigation between all tabs**

- [ ] **Step 4: Test interactive elements (search, filters, buttons, modals)**

- [ ] **Step 5: Stop the development server**

- [ ] **Step 6: Commit all changes**

```bash
git add src/components/Navbar.tsx src/components/HomeView.tsx src/components/ScholarshipView.tsx src/components/UkmView.tsx src/components/AlumniView.tsx src/components/AchievementView.tsx src/components/NewsView.tsx src/components/AdminView.tsx src/components/Footer.tsx
git commit -m "feat: localize all user-facing text to Bahasa Indonesia"
```