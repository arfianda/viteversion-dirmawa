/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from 'react';
import { motion } from 'motion/react';
import { Award, BookOpen, Users, Landmark, Calendar, Search, ArrowUpRight, ArrowRight, Eye, CalendarCheck, MapPin, Briefcase, Sparkles } from 'lucide-react';

interface HomeViewProps {
  setCurrentTab: (tab: string) => void;
  setSelectedUkmId: (id: string | null) => void;
}

export default function HomeView({ setCurrentTab, setSelectedUkmId }: HomeViewProps) {
  const [selectedNews, setSelectedNews] = React.useState<any | null>(null);

  // Stats matching the exact values of your stitch mockups: 50+ Unit Kegiatan Mahasiswa, 15k+ Jaringan Alumni, 500+ Prestasi Gemilang
  const stats = [
    { value: '50+', label: 'Unit Kegiatan Mahasiswa', sub: 'Minat, Bakat, & Keagamaan', colorBg: 'bg-[#001e40]/10 text-[#001e40]' },
    { value: '15k+', label: 'Jaringan Alumni', sub: 'Tersebar di Berbagai Industri', colorBg: 'bg-amber-50 text-[#feb234]' },
    { value: '500+', label: 'Prestasi Gemilang', sub: 'Level Regional hingga Nasional', colorBg: 'bg-emerald-50 text-emerald-600' }
  ];

  const handleServiceClick = (id: string) => {
    setCurrentTab(id);
    setSelectedUkmId(null);
  };

  return (
    <div className="space-y-16">

      {/* 1. HERO BANNER - Exact layout styling of Universitas Pelita Bangsa */}
      <section className="relative h-[480px] lg:h-[520px] overflow-hidden rounded-3xl shadow-xl">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/gedung-upb.jpg')`
          }}
        />
        {/* Navy overlay to replicate the dark gradient color schema in visual mockups */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#001e40] via-[#001e40]/90 to-[#001e40]/35" />

        {/* Content Box */}
        <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 lg:px-20 max-w-2xl space-y-5 z-10 text-white">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 text-[#feb234] px-3.5 py-1 rounded-full text-[11px] font-sans font-bold uppercase tracking-wider w-fit">
            <Sparkles size={11} className="text-[#feb234]" />
            <span>Universitas Pelita Bangsa</span>
          </div>

          <h1 className="font-sans font-black text-3xl sm:text-4xl lg:text-[45px] tracking-tight text-white leading-[1.1]">
            Portal resmi <br /> Kemahasiswaan dan Alumni Universitas Pelita Bangsa
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed max-w-xl">
            Portal resmi informasi dan layanan kemahasiswaan Universitas Pelita Bangsa.
          </p>

          <div className="flex flex-wrap gap-3.5 pt-2">
            <button
              onClick={() => { setCurrentTab('about'); setSelectedUkmId(null); }}
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
          </div>
        </div>
      </section>

      {/* 2. STATS BAR - Clean circular icons on left, text on right */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm flex items-center space-x-4">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 ${stat.colorBg}`}>
              {i === 0 && <Users size={24} />}
              {i === 1 && <Landmark size={24} />}
              {i === 2 && <Award size={24} />}
            </div>
            <div className="space-y-0.5">
              <span className="font-sans font-black text-2xl sm:text-3xl text-[#001e40] block leading-none">
                {stat.value}
              </span>
              <span className="font-sans font-bold text-[13px] text-slate-800 block">
                {stat.label}
              </span>
              <span className="text-[10px] text-slate-500 block uppercase font-medium tracking-wide">
                {stat.sub}
              </span>
            </div>
          </div>
        ))}
      </section>

      {/* 3. LAYANAN UTAMA - The precise grid layout from the mockup */}
      <section className="space-y-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-[#feb234]">
            <div className="w-6 h-0.5 bg-[#feb234]" />
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider">Informasi & Ormawa</span>
          </div>
          <h2 className="font-sans font-extrabold text-2xl text-[#001e40] tracking-tight">Layanan Utama</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">

          {/* BEASISWA (Tall card spanning 2 cols on desktop) */}
          <div
            onClick={() => handleServiceClick('scholarships')}
            className="md:col-span-2 relative h-[320px] rounded-2xl overflow-hidden cursor-pointer group shadow-sm border border-slate-200"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              style={{ backgroundImage: `url('https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop')` } as React.CSSProperties}
            />
            {/* Blue tint overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/60 to-slate-900/30" />

            <div className="absolute inset-0 p-6 flex flex-col justify-between text-white z-10">
              <span className="bg-[#feb234] text-[#001e40] px-2.5 py-0.5 text-[9px] font-mono font-black uppercase rounded w-fit">
                Beasiswa
              </span>
              <div className="space-y-2">
                <h3 className="font-sans font-black text-xl text-white">Beasiswa</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Informasi lengkap mengenai program beasiswa internal dan eksternal untuk mendukung studi Anda.
                </p>
              </div>
            </div>
          </div>

          {/* UKM & ALUMNI cards */}
          <div className="flex flex-col justify-between gap-6 lg:col-span-2">
            {/* UKM Card */}
            <div
              onClick={() => handleServiceClick('ukms')}
              className="bg-white hover:bg-slate-50 border border-slate-100 p-5 rounded-2xl shadow-sm cursor-pointer group flex flex-col justify-between h-[148px] transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                  <Users size={18} />
                </div>
                <ArrowUpRight size={16} className="text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <div className="space-y-1">
                <h4 className="font-sans font-bold text-sm text-[#001e40]">UKM</h4>
                <p className="text-xs text-slate-500 font-sans line-clamp-1 leading-normal">
                  Temukan minat dan bakat Anda melalui puluhan Unit Kegiatan Mahasiswa yang aktif di kampus.
                </p>
              </div>
            </div>

            {/* ALUMNI Card */}
            <div
              onClick={() => handleServiceClick('alumni')}
              className="bg-white hover:bg-slate-50 border border-slate-100 p-5 rounded-2xl shadow-sm cursor-pointer group flex flex-col justify-between h-[148px] transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Landmark size={18} />
                </div>
                <ArrowUpRight size={16} className="text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <div className="space-y-1">
                <h4 className="font-sans font-bold text-sm text-[#001e40]">Alumni</h4>
                <p className="text-xs text-slate-500 font-sans line-clamp-1 leading-normal">
                  Terhubung dengan jaringan alumni yang sukses di berbagai bidang profesional.
                </p>
              </div>
            </div>
          </div>

          {/* PUSAT KARIR (Solid navy/blue card) */}
          <div
            onClick={() => handleServiceClick('alumni')}
            className="bg-gradient-to-br from-[#001e40] to-[#002d61] hover:to-[#0a3366] border border-slate-800 p-6 rounded-2xl shadow-sm cursor-pointer group flex flex-col justify-between h-[320px] text-white transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-[#feb234]/15 text-[#feb234] flex items-center justify-center">
              <Briefcase size={18} />
            </div>

            <div className="space-y-3">
              <h4 className="font-sans font-black text-base text-white">Pusat Karir</h4>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                Persiapkan masa depan karir Anda dengan pelatihan dan info lowongan kerja terbaru.
              </p>
              <div className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#feb234] text-[#feb234] hover:text-[#001e40] flex items-center justify-center transition-all mt-4">
                <ArrowRight size={14} />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. BERITA & PENGUMUMAN & AGENDA MENDATANG */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* Berita List (Spans 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-200 pb-3">
            <h2 className="font-sans font-extrabold text-xl text-[#001e40]">Berita & Pengumuman</h2>
            <button
              onClick={() => setCurrentTab('news')}
              className="text-xs font-sans font-bold text-[#feb234] hover:text-[#ffddb2] flex items-center space-x-1"
            >
              <span>Lihat Semua</span>
              <ArrowRight size={12} />
            </button>
          </div>

          {/* News listing matching stitch */}
          <div className="space-y-4">

            {/* News 1 */}
            <div className="bg-white border border-slate-100 p-4 rounded-xl flex flex-col sm:flex-row gap-4 hover:shadow-sm transition">
              <div
                className="w-full sm:w-36 h-28 bg-cover bg-center rounded-lg flex-shrink-0"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=300&auto=format&fit=crop')` } as React.CSSProperties}
              />
              <div className="space-y-2 flex-grow">
                <span className="inline-block bg-orange-50 text-orange-600 px-2 py-0.5 text-[9px] font-sans font-black uppercase rounded">
                  Prestasi
                </span>
                <h3 className="font-sans font-extrabold text-[#001e40] text-sm sm:text-base leading-tight">
                  Tim Robotik Universitas Pelita Bangsa Raih Juara 1 Nasional
                </h3>
                <p className="text-xs text-slate-505 font-sans line-clamp-1 leading-normal">
                  Inovasi terbaru dari tim mahasiswa teknik berhasil memenangkan kompetisi bergengsi tingkat nasional.
                </p>
                <div className="flex items-center text-[10px] text-slate-400 font-sans space-x-1">
                  <Calendar size={10} />
                  <span>12 Oktober 2024</span>
                </div>
              </div>
            </div>

            {/* News 2 */}
            <div className="bg-white border border-slate-100 p-4 rounded-xl flex flex-col sm:flex-row gap-4 hover:shadow-sm transition">
              <div
                className="w-full sm:w-36 h-28 bg-cover bg-center rounded-lg flex-shrink-0"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=300&auto=format&fit=crop')` } as React.CSSProperties}
              />
              <div className="space-y-2 flex-grow">
                <span className="inline-block bg-sky-50 text-sky-600 px-2 py-0.5 text-[9px] font-sans font-black uppercase rounded">
                  Akademik
                </span>
                <h3 className="font-sans font-extrabold text-[#001e40] text-sm sm:text-base leading-tight">
                  Pendaftaran Beasiswa Internal Semester Ganjil 2026 Dibuka
                </h3>
                <p className="text-xs text-slate-505 font-sans line-clamp-1 leading-normal">
                  Segera persiapkan berkas Anda, pendaftaran beasiswa prestasi dan bantuan studi telah resmi dibuka.
                </p>
                <div className="flex items-center text-[10px] text-slate-400 font-sans space-x-1">
                  <Calendar size={10} />
                  <span>10 Oktober 2024</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Agenda Column (Navy blue rounded card) */}
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="font-sans font-extrabold text-xl text-[#001e40]">Agenda Mendatang</h2>
          </div>

          <div className="bg-[#001e40] p-6 rounded-2xl text-white space-y-5 shadow-md">
            <div className="flex items-center space-x-2 text-[#feb234]">
              <Calendar size={16} />
              <span className="font-mono text-xs uppercase tracking-wider font-extrabold">Hari Ini</span>
            </div>

            <div className="space-y-3">
              <h3 className="font-sans font-black text-lg text-white leading-tight">
                Job Fair &amp; Career Expo 2026
              </h3>
              <p className="text-xs text-slate-400">
                Aula Gedung B, Kampus Cikarang.
              </p>
              <div className="space-y-1 pt-1 text-[11px] text-slate-300 font-mono">
                <p>⌚ 09.00 - 16.00 WIB</p>
                <p>📍 Auditorium Lt. 3</p>
              </div>
            </div>

            <button
              onClick={() => handleServiceClick('alumni')}
              className="w-full bg-white/10 hover:bg-white/20 text-[#feb234] py-2.5 rounded-xl text-xs font-sans font-bold uppercase transition"
            >
              Lihat Detail
            </button>
          </div>
        </div>

      </section>

      {/* 5. MINAT BAKAT (Olahraga, Seni, Akademik) */}
      <section className="bg-white border border-slate-200/80 rounded-2xl p-8 text-center space-y-6">
        <div className="space-y-2 max-w-xl mx-auto">
          <span className="font-mono text-[10px] uppercase font-bold text-[#feb234] tracking-wider block">Kegiatan Kampus</span>
          <h2 className="font-sans font-black text-2xl text-[#001e40]">Eksplorasi Minat &amp; Bakat di UKM</h2>
          <p className="text-xs text-slate-500 font-sans">
            Temukan komunitas yang tepat untuk mengembangkan potensi diri, hobi, dan kepemimpinan Anda di Universitas Pelita Bangsa.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {['Olahraga', 'Seni & Budaya', 'Akademik'].map((cat, i) => (
            <div key={i} className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex flex-col items-center space-y-3.5 select-none">
              <div className="w-12 h-12 rounded-full bg-white text-[#001e40] shadow-sm flex items-center justify-center font-bold text-lg">
                🏆
              </div>
              <span className="font-sans font-bold text-sm text-[#001e40]">{cat}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => setCurrentTab('ukms')}
          className="px-6 py-3 bg-[#001e40] hover:bg-[#002d61] text-white font-sans font-bold text-xs uppercase tracking-wider rounded-xl shadow transition active:scale-95"
        >
          Jelajahi Semua UKM
        </button>
      </section>

    </div>
  );
}