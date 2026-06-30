/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from 'react';
import { UKM } from '../types';
import { Search, Calendar, Phone, CheckCircle, Users, Compass, Sparkles } from 'lucide-react';

interface UkmViewProps {
  ukms: UKM[];
  selectedUkmId: string | null;
  setSelectedUkmId: (id: string | null) => void;
}

export default function UkmView({ ukms, selectedUkmId, setSelectedUkmId }: UkmViewProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('semua');
  const [joinUkmId, setJoinUkmId] = React.useState<string | null>(null);
  
  // Join form state
  const [joinForm, setJoinForm] = React.useState({ name: '', nim: '', email: '', motivation: '', department: '' });
  const [joinSuccess, setJoinSuccess] = React.useState(false);

  const categories = ['semua', 'Seni & Budaya', 'Olahraga', 'Akademik', 'Sosial', 'Kerohanian'];

  const filteredUkms = ukms.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'semua' || u.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const activeUkm = ukms.find(u => u.id === selectedUkmId) || null;

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (joinForm.name && joinForm.nim && joinForm.email) {
      setJoinSuccess(true);
      setTimeout(() => {
        setJoinSuccess(false);
        setJoinUkmId(null);
        setJoinForm({ name: '', nim: '', email: '', motivation: '', department: '' });
      }, 4000);
    }
  };

  return (
    <div className="space-y-12">
      
      {/* Header section with pristine typography */}
      <div className="text-center space-y-3">
        <span className="font-mono text-xs font-black uppercase tracking-widest text-[#feb234] block">EKSPELORASI ORMAWA</span>
        <h1 className="font-sans font-black text-3xl sm:text-4xl text-[#001e40] tracking-tight">Direktori UKM &amp; Organisasi</h1>
        <p className="text-sm sm:text-base text-slate-505 max-w-2xl mx-auto font-sans leading-relaxed">
          Temukan wadah kreativitas, pengembangan kepribadian, kepemimpinan, dan bakat di berbagai Unit Kegiatan Mahasiswa Universitas Pelita Bangsa.
        </p>
      </div>

      {/* Filter and Search Bar (Clean light container) */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col lg:flex-row gap-4 items-center justify-between">
        
        {/* Categories chips selection */}
        <div className="flex flex-wrap gap-2 w-full lg:w-auto">
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
        </div>

        {/* Search Input styling */}
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Cari nama UKM..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-sans text-slate-800 placeholder-slate-455 focus:outline-none focus:border-[#001e40] focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* GRID UKMs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredUkms.map((u) => (
          <div 
            key={u.id}
            className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col justify-between group shadow-sm"
          >
            <div>
              {/* Cover Banner picture */}
              <div 
                className="h-40 w-full bg-cover bg-center relative"
                style={{ backgroundImage: `url('${u.coverImage || 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop'}')`, referrerPolicy: 'no-referrer' } as React.CSSProperties}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 bg-[#feb234] text-[#001e40] px-2.5 py-0.5 text-[9px] font-sans font-black uppercase rounded-md shadow-sm">
                  {u.category}
                </div>
              </div>

              {/* Card content body */}
              <div className="p-6 space-y-4 text-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                    {u.logoImage ? (
                      <img 
                        src={u.logoImage} 
                        alt={`${u.name} logo`} 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=200&auto=format&fit=crop';
                        }}
                      />
                    ) : (
                      <Users size={20} className="text-[#001e40]" />
                    )}
                  </div>
                  <div className="min-w-0 flex-grow">
                    <h3 className="font-sans font-black text-lg text-[#001e40] group-hover:text-[#feb234] transition-colors tracking-tight line-clamp-1">
                      {u.name}
                    </h3>
                    <div className="flex items-center space-x-1.5 bg-yellow-50 text-[#feb234] border border-yellow-250/50 px-2 py-0.5 rounded text-[10px] font-sans font-black w-fit mt-1">
                      <Users size={11} />
                      <span>{u.activeMembers} Mhs</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-555 font-sans leading-relaxed line-clamp-3">
                  {u.shortDescription}
                </p>

                {/* Sub schedule details */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-[11px] space-y-1 text-slate-650 font-sans">
                  <span className="text-[#feb234] font-black block mb-1">📅 Sesi Latihan:</span>
                  {u.schedule.slice(0, 1).map((sch, i) => (
                    <div key={i} className="flex justify-between font-medium">
                      <span className="text-slate-700 font-bold">{sch.day}</span>
                      <span>{sch.time}</span>
                    </div>
                  ))}
                  {u.schedule.length === 0 && <span className="italic">Jadwal latihan belum diunggah</span>}
                </div>
              </div>
            </div>

            {/* Bottom Actions styling */}
            <div className="px-6 pb-6 pt-2 border-t border-slate-100 flex gap-3">
              <button
                onClick={() => setSelectedUkmId(u.id)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-sans font-bold text-xs rounded-xl transition cursor-pointer text-center"
              >
                Detail Profil
              </button>
              <button
                onClick={() => setJoinUkmId(u.id)}
                className="flex-1 py-2.5 bg-[#001e40] hover:bg-[#002d61] text-white font-sans font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm transition active:scale-95"
              >
                Gabung UKM
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Info Banner promotion */}
      <div className="bg-[#001e40] border border-[#002d61] p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 blur-2xl pointer-events-none" />
        <div className="space-y-2 max-w-xl text-center md:text-left">
          <div className="inline-flex items-center space-x-1.5 bg-[#feb234]/10 border border-[#feb234]/30 text-[#feb234] px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase">
            <Sparkles size={11} />
            <span>Pendanaan Ormawa</span>
          </div>
          <h3 className="font-sans font-extrabold text-xl sm:text-2xl text-white tracking-tight">Kompensasi &amp; Hibah Kreativitas UPB</h3>
          <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
            Setiap UKM terdaftar berhak mengajukan pendanaan proposal operasional, insentif prestasi delegasi lomba, perlengkapan inventaris, dan fasilitas bimbingan dosen dari Direktorat Kemahasiswaan.
          </p>
        </div>
        <button 
          onClick={() => setSelectedUkmId(null)}
          className="bg-[#feb234] hover:bg-[#ffddb2] text-[#001e40] font-sans font-black text-xs px-5 py-3.5 rounded-xl uppercase tracking-wider shadow cursor-pointer transition active:scale-95 flex-shrink-0"
        >
          Ajukan Proposal Ormawa
        </button>
      </div>

      {/* UKM Detail Drawer / Modal Cover overlay with beautiful Light Theme */}
      {activeUkm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white border border-slate-250 w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Modal Cover Image header */}
            <div 
              className="h-56 sm:h-64 w-full bg-cover bg-center relative flex-shrink-0"
              style={{ backgroundImage: `url('${activeUkm.coverImage || 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop'}')`, referrerPolicy: 'no-referrer' } as React.CSSProperties}
            >
              <button 
                onClick={() => setSelectedUkmId(null)}
                className="absolute top-4 right-4 bg-black/75 hover:bg-black text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm hover:scale-105 transition shadow z-10"
              >
                ✕
              </button>
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
              <div className="absolute bottom-6 left-6 flex items-center gap-4 z-11">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-slate-200 shadow-md flex items-center justify-center overflow-hidden shrink-0">
                  {activeUkm.logoImage ? (
                    <img 
                      src={activeUkm.logoImage} 
                      alt={`${activeUkm.name} logo`} 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=200&auto=format&fit=crop';
                      }}
                    />
                  ) : (
                    <Users size={32} className="text-[#001e40]" />
                  )}
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <span className="bg-[#feb234] text-[#001e40] font-sans text-xs font-black uppercase tracking-wider px-3 py-1 rounded shadow-sm w-fit block">
                    {activeUkm.category}
                  </span>
                  <h2 className="font-sans font-black text-2xl sm:text-3.5xl text-[#001e40] leading-none">
                    {activeUkm.name}
                  </h2>
                </div>
              </div>
            </div>

            {/* Modal scrollable content body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-800">
              
              {/* Description history */}
              <div className="space-y-2 font-sans">
                <span className="text-xs font-bold text-[#feb234] uppercase tracking-wider block">Sejarah &amp; Gambaran Umum</span>
                <p className="text-sm text-slate-650 leading-relaxed font-sans">{activeUkm.description}</p>
              </div>

              {/* Vision & Mission lists */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
                <div className="space-y-2 font-sans">
                  <span className="text-xs font-bold text-[#feb234] uppercase tracking-wider block">Visi Utama</span>
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs text-slate-650 font-sans italic leading-relaxed font-semibold">
                    "{activeUkm.vision}"
                  </div>
                </div>

                <div className="space-y-2 font-sans">
                  <span className="text-xs font-bold text-[#feb234] uppercase tracking-wider block">Misi Operasional</span>
                  <ul className="space-y-2 text-xs text-slate-650 list-inside list-disc">
                    {activeUkm.mission.map((mis, i) => (
                      <li key={i} className="leading-relaxed">{mis}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Schedules and requirements information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 font-sans">
                {/* Schedule plans list */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-[#feb234] uppercase tracking-wider block">Agenda &amp; Jadwal Kegiatan</span>
                  <div className="space-y-2.5">
                    {activeUkm.schedule.map((sch, i) => (
                      <div key={i} className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl flex items-start space-x-2.5">
                        <Calendar size={15} className="text-[#feb234] flex-shrink-0 mt-0.5" />
                        <div className="text-xs">
                          <span className="font-bold text-slate-800 block">{sch.day}</span>
                          <span className="font-medium text-slate-600 block pt-0.5">{sch.activity}</span>
                          <span className="font-mono text-[10px] text-slate-400 block pt-0.5">{sch.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Enrollment requirements list */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-[#feb234] uppercase tracking-wider block">Syarat Keanggotaan</span>
                  <ul className="space-y-2.5">
                    {activeUkm.requirements.map((req, i) => (
                      <li key={i} className="flex items-start space-x-2 bg-slate-50/50 p-2.5 rounded-lg border border-slate-200 text-xs text-slate-650 font-medium">
                        <CheckCircle size={14} className="text-[#feb234] flex-shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Contacts contact details info */}
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3 pt-6">
                <span className="text-xs font-bold text-[#001e40] uppercase tracking-wider block">Hubungi Pengurus UKM</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs font-sans">
                  {activeUkm.contacts.map((c, i) => (
                    <div key={i} className="flex items-center space-x-2.5 bg-white border border-slate-200 p-2.5 rounded-xl shadow-sm">
                      <div className="bg-yellow-50 p-1.5 rounded-lg text-[#feb234] border border-yellow-200 flex-shrink-0">
                        <Phone size={13} />
                      </div>
                      <div className="min-w-0">
                        <span className="text-slate-400 font-mono text-[9px] uppercase font-bold block">{c.role}</span>
                        <span className="text-slate-800 font-bold text-xs block truncate">{c.name}</span>
                        <span className="text-slate-500 font-mono text-[10px] block font-semibold">{c.contact}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Bottom actions */}
            <div className="bg-slate-100 border-t border-slate-200 px-6 py-4 flex justify-between items-center flex-shrink-0">
              <span className="text-[10px] font-sans font-bold text-[#feb234] uppercase tracking-wide">ORGANISASI UPB</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedUkmId(null)}
                  className="bg-slate-200 hover:bg-slate-350 text-slate-700 font-sans font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer"
                >
                  Tutup Profil
                </button>
                <button
                  onClick={() => {
                    setSelectedUkmId(null);
                    setJoinUkmId(activeUkm.id);
                  }}
                  className="bg-[#001e40] hover:bg-[#002d61] text-white font-sans font-bold text-xs px-4 py-2.5 rounded-xl uppercase tracking-wider transition active:scale-95 cursor-pointer"
                >
                  Gabung Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* JOIN UKM MODEL popup layout inside Light Theme */}
      {joinUkmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white border border-slate-250 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1 text-slate-800">
                <div className="font-mono text-[10px] font-bold text-[#feb234] uppercase tracking-wider">FORMULIR PENDAFTARAN</div>
                <h3 className="font-sans font-black text-xl text-[#001e40]">Join {ukms.find(d => d.id === joinUkmId)?.name}</h3>
              </div>
              <button 
                onClick={() => setJoinUkmId(null)} 
                className="text-slate-400 hover:text-slate-800 text-sm bg-slate-50 border border-slate-200 w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {joinSuccess ? (
              <div className="p-4 bg-yellow-500/10 border border-yellow-350 text-[#feb234] text-xs leading-relaxed rounded-xl font-sans animate-fade-in">
                <span className="font-bold block mb-1">✓ Pengajuan Pendaftaran Terkirim!</span>
                Data diri Anda berhasil direkam dalam waiting-list kepengurusan. Silakan periksa pesan WhatsApp Anda dalam beberapa hari kerja untuk undangan grup kaderisasi internal.
              </div>
            ) : (
              <form onSubmit={handleJoinSubmit} className="space-y-4 font-sans text-xs">
                {/* Full name input */}
                <div className="space-y-1">
                  <label className="text-slate-700 block font-bold">Nama Lengkap Mahasiswa</label>
                  <input
                    type="text"
                    required
                    value={joinForm.name}
                    onChange={(e) => setJoinForm({ ...joinForm, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-850 focus:outline-none focus:border-[#001e40] focus:bg-white text-xs font-sans"
                    placeholder="Contoh: Dewa Wicaksana"
                  />
                </div>

                {/* NIM + Major inputs */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-700 block font-bold">NIM Mahasiswa</label>
                    <input
                      type="text"
                      required
                      maxLength={10}
                      value={joinForm.nim}
                      onChange={(e) => setJoinForm({ ...joinForm, nim: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-850 focus:outline-none focus:border-[#001e40] focus:bg-white text-xs font-sans"
                      placeholder="312010xxx"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-700 block font-bold">Jurusan / Prodi</label>
                    <input
                      type="text"
                      required
                      value={joinForm.department}
                      onChange={(e) => setJoinForm({ ...joinForm, department: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-850 focus:outline-none focus:border-[#001e40] focus:bg-white text-xs font-sans"
                      placeholder="Teknik Informatika"
                    />
                  </div>
                </div>

                {/* Email address */}
                <div className="space-y-1">
                  <label className="text-slate-700 block font-bold">Email Kontak Aktif</label>
                  <input
                    type="email"
                    required
                    value={joinForm.email}
                    onChange={(e) => setJoinForm({ ...joinForm, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-850 focus:outline-none focus:border-[#001e40] focus:bg-white text-xs font-sans"
                    placeholder="dewa@mhs.upb.ac.id"
                  />
                </div>

                {/* Aspirations motivation */}
                <div className="space-y-1">
                  <label className="text-slate-700 block font-bold">Aspirasi / Motivasi Gabung</label>
                  <textarea
                    required
                    value={joinForm.motivation}
                    onChange={(e) => setJoinForm({ ...joinForm, motivation: e.target.value })}
                    rows={2}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-850 focus:outline-none focus:border-[#001e40] focus:bg-white text-xs font-sans"
                    placeholder="Saya ingin meningkatkan skill..."
                  />
                </div>

                {/* Submission button */}
                <button
                  type="submit"
                  className="w-full py-3 bg-[#001e40] hover:bg-[#002d61] text-white font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition duration-305 shadow-sm active:scale-95"
                >
                  Kirim Formulir Pendaftaran
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
