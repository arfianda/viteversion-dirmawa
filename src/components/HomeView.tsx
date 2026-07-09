/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from 'react';
import { motion } from 'motion/react';
import { Award, BookOpen, Users, Landmark, Calendar, Search, ArrowUpRight, ArrowRight, Eye, CalendarCheck, MapPin, Briefcase, Sparkles, ChevronLeft, ChevronRight, Trophy } from 'lucide-react';
import { StudentNews, Achievement } from '../types';

interface HomeViewProps {
  setCurrentTab: (tab: string) => void;
  setSelectedUkmId: (id: string | null) => void;
  news: StudentNews[];
  ukmsCount: number;
  alumniCount: number;
  achievementsCount: number;
  achievements: Achievement[];
}

export default function HomeView({ setCurrentTab, setSelectedUkmId, news, ukmsCount, alumniCount, achievementsCount, achievements }: HomeViewProps) {
  const [selectedNews, setSelectedNews] = React.useState<any | null>(null);
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  // Filter news to exclude agenda items for the main news list
  const newsAndAnnouncements = React.useMemo(() => {
    return news.filter(item => {
      const cat = item.category?.toLowerCase() || '';
      return !cat.includes('agenda');
    });
  }, [news]);

  // Find all agenda items
  const agendaItems = React.useMemo(() => {
    return news.filter(item => {
      const cat = item.category?.toLowerCase() || '';
      return cat.includes('agenda');
    });
  }, [news]);

  const latestAgenda = agendaItems[0];

  // Hero carousel slides with placeholder images
  const heroSlides = [
    {
      image: '/gedung-upb.jpg',
      subtitle: 'Portal resmi informasi dan layanan kemahasiswaan Universitas Pelita Bangsa.'
    },
    {
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1920&auto=format&fit=crop',
      subtitle: 'Mewujudkan prestasi mahasiswa berkualitas di tingkat nasional dan internasional.'
    },
    {
      image: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=1920&auto=format&fit=crop',
      subtitle: 'Jejak alumni sukses yang menginspirasi di berbagai industri profesional.'
    },
    {
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1920&auto=format&fit=crop',
      subtitle: 'Mengembangkan potensi akademik dan karakter untuk masa depan gemilang.'
    },
    {
      image: 'https://images.unsplash.com/photo-1576267423048-15c0040fec78?q=80&w=1920&auto=format&fit=crop',
      subtitle: 'Wadah kreativitas mahasiswa melalui Unit Kegiatan Mahasiswa yang aktif dan berprestasi.'
    }
  ];

  // Auto-rotation logic
  React.useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused, heroSlides.length]);

  const stats = [
    { value: ukmsCount > 0 ? `${ukmsCount}+` : '0', label: 'Unit Kegiatan Mahasiswa', sub: 'Minat, Bakat, & Keagamaan', colorBg: 'bg-[#001e40]/10 text-[#001e40]' },
    { value: alumniCount >= 1000 ? `${(alumniCount/1000).toFixed(1)}k+` : (alumniCount > 0 ? `${alumniCount}+` : '0'), label: 'Jaringan Alumni', sub: 'Tersebar di Berbagai Industri', colorBg: 'bg-amber-50 text-[#feb234]' },
    { value: achievementsCount > 0 ? `${achievementsCount}+` : '0', label: 'Prestasi Gemilang', sub: 'Level Regional hingga Nasional', colorBg: 'bg-emerald-50 text-emerald-600' }
  ];

  const handleServiceClick = (id: string) => {
    setCurrentTab(id);
    setSelectedUkmId(null);
  };

  return (
    <div className="space-y-16">

      {/* 1. HERO CAROUSEL - Auto-sliding horizontal carousel */}
      <section className="relative h-[480px] lg:h-[520px] overflow-hidden rounded-3xl shadow-xl"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Slides container */}
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <motion.div
              key={index}
              className="absolute inset-0"
              initial={{ opacity: 0, x: 100 }}
              animate={{
                opacity: index === currentSlide ? 1 : 0,
                x: index === currentSlide ? 0 : index < currentSlide ? -100 : 100
              }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
            >
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url('${slide.image}')` }}
              />
              {/* Navy overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#001e40] via-[#001e40]/90 to-[#001e40]/35" />
            </motion.div>
          ))}
        </div>

        {/* Content Box - Fixed position with changing subtitle */}
        <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 lg:px-20 max-w-2xl space-y-5 z-10 text-white">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 text-[#feb234] px-3.5 py-1 rounded-full text-[11px] font-sans font-bold uppercase tracking-wider w-fit">
            <Sparkles size={11} className="text-[#feb234]" />
            <span>Universitas Pelita Bangsa</span>
          </div>

          <h1 className="font-sans font-black text-3xl sm:text-4xl lg:text-[45px] tracking-tight text-white leading-[1.1]">
            Portal resmi <br /> Kemahasiswaan dan Alumni Universitas Pelita Bangsa
          </h1>

          <motion.p
            key={currentSlide}
            className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed max-w-xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {heroSlides[currentSlide].subtitle}
          </motion.p>

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

        {/* Navigation Arrows */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/20 transition-all opacity-0 hover:opacity-100 group-hover:opacity-100"
          aria-label="Previous slide"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/20 transition-all opacity-0 hover:opacity-100 group-hover:opacity-100"
          aria-label="Next slide"
        >
          <ChevronRight size={20} />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlide
                  ? 'w-8 h-2 bg-[#feb234]'
                  : 'w-2 h-2 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
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
              onClick={() => handleServiceClick('alumni-data')}
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
            onClick={() => handleServiceClick('alumni-data')}
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
            {newsAndAnnouncements.slice(0, 3).map((item) => (
              <div 
                key={item.id} 
                onClick={() => setSelectedNews(item)}
                className="bg-white border border-slate-100 p-4 rounded-xl flex flex-col sm:flex-row gap-4 hover:shadow-md transition cursor-pointer group text-left animate-none"
              >
                <div
                  className="w-full sm:w-36 h-28 bg-cover bg-center rounded-lg flex-shrink-0 transition-transform group-hover:scale-[1.02]"
                  style={{ backgroundImage: `url('${item.image || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=300&auto=format&fit=crop'}')` } as React.CSSProperties}
                />
                <div className="space-y-2 flex-grow flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="inline-block bg-orange-50 text-orange-600 px-2 py-0.5 text-[9px] font-sans font-black uppercase rounded">
                      {item.category}
                    </span>
                    <h3 className="font-sans font-extrabold text-[#001e40] text-sm sm:text-base leading-tight group-hover:text-[#feb234] transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-sans line-clamp-1 leading-normal">
                      {item.summary}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-sans pt-1">
                    <div className="flex items-center space-x-1">
                      <Calendar size={10} />
                      <span>{item.date}</span>
                    </div>
                    <span className="text-[#feb234] font-bold group-hover:underline flex items-center space-x-0.5">
                      <span>Baca Selengkapnya</span>
                      <ArrowRight size={10} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {newsAndAnnouncements.length === 0 && (
              <div className="text-center py-6 text-slate-500 text-sm">
                Tidak ada berita saat ini.
              </div>
            )}
          </div>
        </div>

        {/* Agenda Column (Navy blue rounded card) */}
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="font-sans font-extrabold text-xl text-[#001e40]">Agenda Mendatang</h2>
          </div>

          <div className="bg-[#001e40] p-6 rounded-2xl text-white space-y-5 shadow-md flex flex-col justify-between min-h-[250px] text-left">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-[#feb234]">
                <Calendar size={16} />
                <span className="font-mono text-xs uppercase tracking-wider font-extrabold">
                  Agenda Terdekat
                </span>
              </div>

              {latestAgenda ? (
                <div className="space-y-3">
                  <h3 className="font-sans font-black text-lg text-white leading-tight line-clamp-2">
                    {latestAgenda.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans line-clamp-3">
                    {latestAgenda.summary}
                  </p>
                  <div className="space-y-1 pt-1 text-[11px] text-slate-350 font-mono">
                    <p>📅 Tanggal: {latestAgenda.date}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-1 py-8 text-center text-slate-400">
                  <p className="font-sans font-bold text-xs">Belum ada agenda terdekat.</p>
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Agenda mendatang akan ditampilkan di sini jika sudah dipublikasikan.</p>
                </div>
              )}
            </div>

            {latestAgenda && (
              <button
                onClick={() => setSelectedNews(latestAgenda)}
                className="w-full bg-white/10 hover:bg-white/20 text-[#feb234] py-2.5 rounded-xl text-xs font-sans font-bold uppercase transition cursor-pointer"
              >
                Lihat Detail
              </button>
            )}
          </div>
        </div>

      </section>

      {/* 4.5. MAHASISWA BERPRESTASI - Premium Grid or Slider */}
      <section className="space-y-6">
        <div className="flex justify-between items-end border-b border-slate-200 pb-3">
          <div className="space-y-1 text-left">
            <div className="flex items-center space-x-2 text-[#feb234]">
              <div className="w-6 h-0.5 bg-[#feb234]" />
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider">Apresiasi & Karya</span>
            </div>
            <h2 className="font-sans font-extrabold text-2xl text-[#001e40] tracking-tight">Mahasiswa Berprestasi</h2>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                sessionStorage.setItem('mahasiswa_active_tab', 'prestasi');
                setCurrentTab('mahasiswa');
              }}
              className="text-xs font-sans font-bold text-[#001e40] hover:text-[#002d61] bg-[#feb234] hover:bg-[#ffddb2] px-3 py-1.5 rounded-lg flex items-center space-x-1 shadow-sm transition cursor-pointer"
            >
              <span>Laporkan Prestasi</span>
            </button>
            <button
              onClick={() => setCurrentTab('achievements')}
              className="text-xs font-sans font-bold text-[#feb234] hover:text-[#ffddb2] flex items-center space-x-1 cursor-pointer"
            >
              <span>Lihat Semua</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {achievements.slice(0, 3).map((ach) => {
            const levelColors = {
              'Internasional': 'from-amber-500 to-purple-600 text-white',
              'Nasional': 'from-blue-600 to-indigo-600 text-white',
              'Regional': 'from-emerald-500 to-teal-600 text-white',
            };
            const levelClass = levelColors[ach.level] || 'from-slate-500 to-slate-650 text-white';

            return (
              <div key={ach.id} className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between group hover:shadow-md transition-all duration-300">
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={ach.image || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=600&auto=format&fit=crop'}
                    alt={ach.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Level Badge */}
                  <span className={`absolute top-4 left-4 bg-gradient-to-r ${levelClass} px-2.5 py-0.5 rounded-full text-[9px] font-sans font-black uppercase tracking-wider`}>
                    {ach.level}
                  </span>
                  
                  {/* Rank Title Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center gap-1.5 text-white">
                    <Trophy size={14} className="text-[#feb234]" />
                    <span className="text-xs font-bold font-sans text-white uppercase tracking-wide bg-black/35 px-2 py-0.5 rounded backdrop-blur-sm">
                      {ach.rank}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-grow flex flex-col justify-between space-y-4 text-left">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-[#feb234] uppercase tracking-widest block font-mono">
                      {ach.category}
                    </span>
                    <h3 className="font-sans font-extrabold text-[#001e40] text-sm leading-snug line-clamp-2 min-h-[40px] group-hover:text-[#feb234] transition-colors">
                      {ach.title}
                    </h3>
                    <p className="text-xs text-slate-505 font-sans line-clamp-2 leading-relaxed">
                      {ach.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#191c1e] line-clamp-1">{ach.studentName}</p>
                      <p className="text-[10px] text-slate-400 font-semibold">{ach.major} ({ach.year})</p>
                    </div>
                    <button
                      onClick={() => setCurrentTab('achievements')}
                      className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-[#feb234]/10 text-slate-400 group-hover:text-[#feb234] flex items-center justify-center transition-all animate-none cursor-pointer"
                      title="Lihat detail prestasi"
                    >
                      <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          {achievements.length === 0 && (
            <div className="col-span-3 text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-slate-500 font-medium text-xs">
              Belum ada data prestasi mahasiswa.
            </div>
          )}
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

      {/* 4.6. DETAIL MODAL NEWS / ANNOUNCEMENT */}
      {selectedNews && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#001e40]/60 backdrop-blur-sm animate-fade-in overflow-y-auto text-slate-800"
          onClick={() => setSelectedNews(null)}
        >
          <div 
            className="bg-white border border-slate-200 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-scale-up"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Image Header */}
            {selectedNews.image && (
              <div 
                className="h-56 sm:h-64 w-full bg-cover bg-center relative flex-shrink-0"
                style={{ backgroundImage: `url('${selectedNews.image}')` } as React.CSSProperties}
              >
                <button 
                  onClick={() => setSelectedNews(null)}
                  className="absolute top-4 right-4 bg-black/70 hover:bg-black text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow hover:scale-105 transition cursor-pointer z-10"
                >
                  ✕
                </button>
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent" />
                <div className="absolute bottom-6 left-6 space-y-1 z-10 pr-6">
                  <span className="bg-[#feb234] text-[#001e40] font-sans text-[10px] font-black uppercase px-2.5 py-1 rounded shadow-sm">
                    {selectedNews.category}
                  </span>
                </div>
              </div>
            )}

            {!selectedNews.image && (
              <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center flex-shrink-0 text-left">
                <span className="bg-[#feb234] text-[#001e40] font-sans text-[10px] font-black uppercase px-2.5 py-1 rounded shadow-sm">
                  {selectedNews.category}
                </span>
                <button 
                  onClick={() => setSelectedNews(null)}
                  className="text-slate-400 hover:text-slate-650 transition cursor-pointer text-lg font-bold"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Scrollable Content */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-left">
              <div className="space-y-2">
                <h2 className="font-sans font-black text-xl sm:text-2xl text-[#001e40] leading-tight">
                  {selectedNews.title}
                </h2>
                <div className="flex items-center text-xs text-slate-400 font-sans space-x-1">
                  <Calendar size={12} />
                  <span>Diterbitkan pada: {selectedNews.date}</span>
                </div>
              </div>

              <div className="text-sm text-slate-600 leading-relaxed font-sans space-y-4">
                <p className="font-bold text-slate-800 border-l-4 border-[#feb234] pl-4 italic">
                  {selectedNews.summary}
                </p>
                <div 
                  className="prose max-w-none text-slate-600 space-y-4"
                  dangerouslySetInnerHTML={{ __html: selectedNews.description || '' }}
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex justify-between items-center flex-shrink-0">
              <span className="text-[10px] font-sans font-bold text-slate-400 uppercase">Informasi Kemahasiswaan UPB</span>
              <button
                onClick={() => setSelectedNews(null)}
                className="bg-[#001e40] hover:bg-[#002d61] text-white font-sans font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer shadow-sm"
              >
                Tutup Detail
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}