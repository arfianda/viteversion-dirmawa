/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from 'react';
import { createPortal } from 'react-dom';
import { Achievement } from '../types';
import { Search, Award, Calendar, ExternalLink, Trophy, Filter, ArrowUpRight, ShieldCheck, HelpCircle } from 'lucide-react';

interface AchievementViewProps {
  achievements: Achievement[];
  setCurrentTab: (tab: string) => void;
}

export default function AchievementView({ achievements, setCurrentTab }: AchievementViewProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('semua');
  const [selectedLevel, setSelectedLevel] = React.useState<string>('semua');
  const [selectedYear, setSelectedYear] = React.useState<string>('semua');
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);
  const [activeAchievement, setActiveAchievement] = React.useState<Achievement | null>(null);

  const categories = ['semua', 'Akademik', 'Olahraga', 'Seni & Budaya', 'Sosial & Kemanusiaan'];
  const levels = ['semua', 'Internasional', 'Nasional', 'Regional'];
  const years = ['semua', '2024', '2023'];

  const filteredAchievements = achievements.filter((a) => {
    const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.major.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'semua' || a.category === selectedCategory;
    const matchesLevel = selectedLevel === 'semua' || a.level === selectedLevel;
    const matchesYear = selectedYear === 'semua' || a.year.toString() === selectedYear;

    return matchesSearch && matchesCategory && matchesLevel && matchesYear;
  });

  return (
    <div className="space-y-12">
      
      {/* Header Title with pristine clean typography */}
      <div className="text-center space-y-3">
        <span className="font-mono text-xs font-black uppercase tracking-widest text-[#feb234] block">PRESTASI MAHASISWA</span>
        <h1 className="font-sans font-black text-3xl sm:text-4xl text-[#001e40] tracking-tight">Panggung Apresiasi &amp; Prestasi</h1>
        <p className="text-sm sm:text-base text-slate-505 max-w-2xl mx-auto font-sans leading-relaxed">
          Mendokumentasikan karya agung, raihan podium, dan kontribusi pemecahan rekor mahasiswa Universitas Pelita Bangsa di pentas kejuaraan dunia.
        </p>
      </div>

      {/* Grid of Trophies Count (Light elegant white cards) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { text: 'Medali Internasional', count: achievements.filter(a => a.level === 'Internasional').length.toString(), color: 'text-amber-500' },
          { text: 'Medali Nasional', count: achievements.filter(a => a.level === 'Nasional').length.toString(), color: 'text-slate-550' },
          { text: 'Kejuaraan Wilayah', count: achievements.filter(a => a.level === 'Regional').length.toString(), color: 'text-amber-700' },
          { text: 'SIMKATMAWA Cluster', count: 'Utama', color: 'text-[#001e40]' },
        ].map((item, i) => (
          <div key={i} className="bg-white border border-slate-200 p-5 rounded-2xl text-center space-y-2 shadow-sm">
            <div className="text-[10px] font-sans font-bold text-slate-500 uppercase tracking-wider">{item.text}</div>
            <div className={`font-sans font-black text-2xl sm:text-3xl ${item.color} block`}>
              {item.count}
            </div>
            <div className="w-8 h-1 bg-[#feb234]/40 mx-auto rounded-full" />
          </div>
        ))}
      </div>

      {/* FILTER PANEL (Prisinte light container) */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          
          {/* Categories select */}
          <div className="flex flex-wrap gap-2 w-full lg:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-sans font-extrabold tracking-wide transition-all uppercase ${
                  selectedCategory === cat
                    ? 'bg-[#feb234] text-[#001e40] shadow-md font-bold'
                    : 'bg-slate-50 text-slate-500 border border-slate-200 hover:text-[#001e40] hover:bg-slate-100'
                }`}
              >
                {cat === 'semua' ? 'Semua Bidang' : cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Cari atlet, peraih, atau kejuaraan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-sans text-slate-800 placeholder-slate-450 focus:outline-none focus:border-[#001e40] focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Secondary filters row (Levels + Years) */}
        <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-slate-100 text-xs font-sans">
          
          {/* Levels Select */}
          <div className="flex items-center space-x-2">
            <span className="text-slate-500 font-bold">Tingkatan:</span>
            {levels.map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-2.5 py-1.5 rounded-lg border text-[10px] font-bold uppercase transition ${
                  selectedLevel === lvl
                    ? 'bg-[#001e40] text-white border-[#001e40] shadow-sm'
                    : 'bg-slate-50 text-slate-500 border-slate-200 hover:text-[#001e40] hover:border-slate-300'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <span className="text-slate-200 hidden sm:inline">|</span>

          {/* Years select */}
          <div className="flex items-center space-x-2">
            <span className="text-slate-500 font-bold">Tahun:</span>
            {years.map((y) => (
              <button
                key={y}
                onClick={() => setSelectedYear(y)}
                className={`px-2.5 py-1.5 rounded-lg border text-[10px] font-bold uppercase transition ${
                  selectedYear === y
                    ? 'bg-[#001e40] text-white border-[#001e40] shadow-sm'
                    : 'bg-slate-50 text-slate-500 border-slate-200 hover:text-[#001e40] hover:border-slate-300'
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* GALLERIES / CARDS ACHIEVEMENT */}
      {filteredAchievements.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl text-slate-505 space-y-2 shadow-sm">
          <Trophy className="mx-auto text-slate-400" size={36} />
          <p className="font-sans font-black text-slate-800">Dokumentasi prestasi tidak ditemukan</p>
          <p className="text-xs">Ubah kriteria pencarian atau filter tahun kompetisi.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAchievements.map((achievement) => (
            <div 
              key={achievement.id}
              onClick={() => setActiveAchievement(achievement)}
              onMouseEnter={() => setHoveredId(achievement.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer group flex flex-col justify-between shadow-sm animate-fade-in"
            >
              <div>
                {/* Photo Display */}
                <div 
                  className="h-44 sm:h-48 w-full bg-cover bg-center relative"
                  style={{ backgroundImage: `url('${achievement.image}')`, referrerPolicy: 'no-referrer' } as React.CSSProperties}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                  
                  {/* Scope Label Badge */}
                  <div className="absolute top-4 left-4 flex gap-1.5">
                    <span className="bg-[#feb234] text-[#001e40] px-2.5 py-0.5 text-[9px] font-sans font-black uppercase rounded-md shadow-sm">
                      {achievement.level}
                    </span>
                    <span className="bg-blue-500 text-white px-2.5 py-0.5 text-[9px] font-sans font-black uppercase rounded-md shadow-sm">
                      {achievement.rank}
                    </span>
                  </div>
                  
                  {/* Calendar Badge */}
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm border border-slate-700/50 text-white px-2 py-0.5 text-[10px] font-mono rounded">
                    {achievement.year}
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-6 space-y-4">
                  <span className="text-[10px] font-mono text-[#feb234] uppercase font-bold tracking-wider">{achievement.category}</span>
                  <h3 className="font-sans font-extrabold text-[#001e40] group-hover:text-[#feb234] transition-colors leading-snug text-base sm:text-lg line-clamp-2">
                    {achievement.title}
                  </h3>
                  
                  {/* Recipient meta */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-550 font-bold">Peraih:</span>
                      <span className="font-sans font-extrabold text-slate-800">{achievement.studentName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-550 font-bold">Prodi:</span>
                      <span className="text-slate-700 truncate max-w-xs font-semibold">{achievement.major}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-555 leading-relaxed font-sans line-clamp-2">{achievement.description}</p>
                </div>
              </div>

              {/* Read button action */}
              <div className="px-6 pb-6 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-sans font-extrabold text-[#001e40] group-hover:text-[#feb234] transition-all">
                <span>Pelajari Kisah Sukses</span>
                <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Info Support */}
      <div className="bg-[#001e40] border border-[#002d61] rounded-3xl p-8 sm:p-10 space-y-6 lg:flex items-center justify-between gap-8 shadow-md">
        <div className="space-y-3 max-w-2xl font-sans">
          <div className="inline-flex items-center space-x-1 px-3 py-1 bg-[#feb234]/15 text-[#feb234] border border-[#feb234]/30 rounded-full font-mono text-[10px] uppercase font-bold">
            <ShieldCheck size={11} />
            <span>Pendataan Prestasi Mandiri</span>
          </div>
          <h3 className="font-sans font-extrabold text-xl sm:text-2xl text-white tracking-tight">Cetak Prestasi Mandiri untuk SIMKATMAWA</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            Apakah Anda berhasil memenangkan lomba atau menjuarai kejuaraan di luar agenda kampus tahun ini? Silakan daftarkan sertifikat kejuaran Anda di Layanan Admin agar didata dan memperoleh insentif beasiswa prestasi yayasan.
          </p>
        </div>
        <button 
          onClick={() => {
            sessionStorage.setItem('mahasiswa_active_tab', 'prestasi');
            setCurrentTab('mahasiswa');
          }}
          className="bg-[#feb234] hover:bg-[#ffddb2] text-[#001e40] text-xs font-sans font-black px-5 py-3.5 rounded-xl uppercase tracking-wider w-full lg:w-auto shadow-md transition-all active:scale-95 cursor-pointer"
        >
          Laporkan Prestasi Saya
        </button>
      </div>

      {/* DETAIL MODAL ACHIEVEMENT popup overlay */}
      {activeAchievement && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in overflow-y-auto" onClick={() => setActiveAchievement(null)}>
          <div className="bg-white border border-slate-205 w-full max-w-2xl rounded-none sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col h-full sm:h-auto max-h-screen sm:max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Image Header */}
            <div 
              className="h-56 sm:h-64 w-full bg-cover bg-center relative flex-shrink-0"
              style={{ backgroundImage: `url('${activeAchievement.image}')`, referrerPolicy: 'no-referrer' } as React.CSSProperties}
            >
              <button 
                onClick={() => setActiveAchievement(null)}
                className="absolute top-4 right-4 bg-black/75 hover:bg-black text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm hover:scale-105 transition shadow z-10"
              >
                ✕
              </button>
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
              <div className="absolute bottom-6 left-6 space-y-1.5 z-11">
                <div className="flex gap-1.5">
                  <span className="inline-block bg-[#feb234] text-[#001e40] font-sans text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded shadow-sm">
                    {activeAchievement.level}
                  </span>
                  <span className="inline-block bg-[#001e40]/75 text-white font-sans text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded border border-slate-700/50 shadow-sm">
                    {activeAchievement.category}
                  </span>
                </div>
                <h2 className="font-sans font-black text-2xl sm:text-3.5xl text-[#001e40] leading-none drop-shadow-sm">
                  {activeAchievement.title}
                </h2>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-800 text-left">
              
              {/* Main Information */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans text-xs bg-slate-50 border border-slate-200/60 p-4 rounded-xl">
                <div>
                  <span className="text-slate-400 font-mono text-[9px] uppercase font-bold block">Nama Lengkap</span>
                  <span className="text-slate-800 font-bold text-sm block pt-0.5">{activeAchievement.studentName}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-mono text-[9px] uppercase font-bold block">Program Studi</span>
                  <span className="text-slate-800 font-bold text-sm block pt-0.5">{activeAchievement.major}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-mono text-[9px] uppercase font-bold block">Peringkat &amp; Tahun</span>
                  <span className="text-slate-800 font-bold text-sm block pt-0.5">Juara {activeAchievement.rank} ({activeAchievement.year})</span>
                </div>
              </div>

              {/* Description summary */}
              <div className="space-y-2.5 font-sans">
                <span className="text-xs font-bold text-[#feb234] uppercase tracking-wider block">Deskripsi Prestasi</span>
                <p className="text-sm text-slate-650 leading-relaxed font-medium">
                  {activeAchievement.description || 'Tidak ada deskripsi rinci.'}
                </p>
              </div>

              {/* Verification Stamp info */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center space-x-3 text-xs text-slate-500 leading-relaxed font-sans">
                <Trophy size={16} className="text-[#feb234] flex-shrink-0" />
                <span>
                  Sertifikat dan dokumen kejuaraan ini telah divalidasi dan dicatatkan oleh Biro SIMKATMAWA UPB dengan status <strong className="text-emerald-700">Terverifikasi SAKTI</strong>.
                </span>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="bg-slate-100 border-t border-slate-200 px-6 py-4 flex justify-between items-center flex-shrink-0">
              <span className="text-[10px] font-sans font-bold text-[#feb234] uppercase">TROPI MAHASISWA — UPB</span>
              <button
                onClick={() => setActiveAchievement(null)}
                className="bg-[#001e40] hover:bg-[#002d61] text-white font-sans font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer"
              >
                Tutup Review
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
