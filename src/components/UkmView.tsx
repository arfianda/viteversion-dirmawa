/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from 'react';
import { createPortal } from 'react-dom';
import { UKM } from '../types';
import { Search, Calendar, Phone, CheckCircle, Users, Compass, Sparkles, Instagram, X } from 'lucide-react';

interface UkmViewProps {
  ukms: UKM[];
  selectedUkmId: string | null;
  setSelectedUkmId: (id: string | null) => void;
}

export default function UkmView({ ukms, selectedUkmId, setSelectedUkmId }: UkmViewProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('semua');
  const [joinUkmId, setJoinUkmId] = React.useState<string | null>(null);
  
  // Load session from local storage
  const [session, setSession] = React.useState<any>(() => {
    const saved = localStorage.getItem('upb_mahasiswa_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        localStorage.removeItem('upb_mahasiswa_session');
      }
    }
    return null;
  });

  const [verifyMethod, setVerifyMethod] = React.useState<'code' | 'scan'>('code');
  const [verificationCode, setVerificationCode] = React.useState('');
  const [isScanning, setIsScanning] = React.useState(false);
  const [scanSuccess, setScanSuccess] = React.useState(false);
  const [joinSuccess, setJoinSuccess] = React.useState(false);

  const ukmTokens: Record<string, string> = {
    '1': 'UPB-SENI-X9A2F',
    '2': 'UPB-BASKET-7D3K9',
    '3': 'UPB-ROBOT-5H8P2',
    '4': 'UPB-MAPALA-3K6J1',
    '5': 'UPB-FUTSAL-8R2L9',
    '6': 'UPB-ENGLISH-4N8Y2'
  };

  const getUkmToken = (ukm: UKM) => {
    if (ukmTokens[ukm.id]) return ukmTokens[ukm.id];
    const shortName = ukm.name.split(' ').pop()?.toUpperCase() || 'ORMAWA';
    return `UPB-${shortName}-X7K2B`;
  };

  const handleVerifyCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinUkmId || !session) return;

    const ukm = ukms.find(u => u.id === joinUkmId);
    if (!ukm) return;

    const expectedToken = getUkmToken(ukm);
    if (verificationCode.trim().toUpperCase() === expectedToken) {
      const savedIds = localStorage.getItem(`upb_joined_ukms_${session.id}`);
      let joinedIds = savedIds ? JSON.parse(savedIds) : [];
      
      if (!joinedIds.includes(joinUkmId)) {
        joinedIds.push(joinUkmId);
        localStorage.setItem(`upb_joined_ukms_${session.id}`, JSON.stringify(joinedIds));
      }
      setJoinSuccess(true);
      setTimeout(() => {
        setJoinSuccess(false);
        setJoinUkmId(null);
        setVerificationCode('');
      }, 3000);
    } else {
      alert('Token verifikasi salah. Silakan periksa kembali token unik Anda.');
    }
  };

  const handleSimulateScan = () => {
    if (!joinUkmId || !session) return;
    setIsScanning(true);
    setScanSuccess(false);

    setTimeout(() => {
      setIsScanning(false);
      setScanSuccess(true);
      
      const savedIds = localStorage.getItem(`upb_joined_ukms_${session.id}`);
      let joinedIds = savedIds ? JSON.parse(savedIds) : [];
      
      if (!joinedIds.includes(joinUkmId)) {
        joinedIds.push(joinUkmId);
        localStorage.setItem(`upb_joined_ukms_${session.id}`, JSON.stringify(joinedIds));
      }
      
      setJoinSuccess(true);
      setTimeout(() => {
        setJoinSuccess(false);
        setJoinUkmId(null);
        setScanSuccess(false);
      }, 3000);
    }, 2000);
  };

  const handleRedirectLogin = () => {
    sessionStorage.setItem('pending_portal', 'mahasiswa');
    window.location.hash = '#/mahasiswa';
  };

  const categories = ['semua', 'Seni & Budaya', 'Olahraga', 'Akademik', 'Sosial', 'Kerohanian', 'Himpunan'];

  const filteredUkms = ukms.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'semua' || u.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedUkms = [...filteredUkms].sort((a, b) => {
    const aIsHimpunan = a.category === 'Himpunan';
    const bIsHimpunan = b.category === 'Himpunan';
    if (aIsHimpunan && !bIsHimpunan) return 1;
    if (!aIsHimpunan && bIsHimpunan) return -1;
    return 0;
  });

  const activeUkm = ukms.find(u => u.id === selectedUkmId) || null;

  const selectedVerifyUkm = ukms.find(d => d.id === joinUkmId) || null;
  const savedIds = session ? localStorage.getItem(`upb_joined_ukms_${session.id}`) : null;
  const joinedIds = savedIds ? JSON.parse(savedIds) : [];
  const alreadyJoined = joinUkmId ? joinedIds.includes(joinUkmId) : false;

  return (
    <div className="space-y-12">
      
      {/* Header section with pristine typography */}
      <div className="text-center space-y-3">
        <span className="font-mono text-xs font-black uppercase tracking-widest text-[#feb234] block">EKSPLORASI ORMAWA</span>
        <h1 className="font-sans font-black text-3xl sm:text-4xl text-[#001e40] tracking-tight">Direktori Ormawa</h1>
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
        {sortedUkms.map((u) => (
          <div 
            key={u.id}
            className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col justify-between group shadow-sm"
          >
            <div>
              {/* Cover Banner picture */}
              <div 
                className="h-40 w-full bg-cover bg-center relative"
                style={{ backgroundImage: `url('${u.coverImage}')`, referrerPolicy: 'no-referrer' } as React.CSSProperties}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                {u.logoImage && (
                  <div className="absolute -bottom-7 right-4 w-14 h-14 rounded-full border-2 border-white bg-white overflow-hidden shadow-md z-10">
                    <img src={u.logoImage} alt={`${u.name} logo`} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="absolute bottom-4 left-4 bg-[#feb234] text-[#001e40] px-2.5 py-0.5 text-[9px] font-sans font-black uppercase rounded-md shadow-sm">
                  {u.category}
                </div>
              </div>

              {/* Card content body */}
              <div className="p-6 space-y-4 text-slate-800">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-sans font-black text-lg text-[#001e40] group-hover:text-[#feb234] transition-colors tracking-tight line-clamp-1">
                    {u.name}
                  </h3>
                  <div className="flex items-center space-x-1.5 bg-yellow-50 text-[#feb234] border border-yellow-250/50 px-2 py-0.5 rounded text-[10px] font-sans font-black">
                    <Users size={11} />
                    <span>{u.activeMembers} Mhs</span>
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
      {activeUkm && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in overflow-y-auto" onClick={() => setSelectedUkmId(null)}>
          <div className="bg-white border border-slate-250 w-full max-w-3xl rounded-none sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col h-full sm:h-auto max-h-screen sm:max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Cover Image header */}
            <div 
              className="h-56 sm:h-64 w-full bg-cover bg-center relative flex-shrink-0"
              style={{ backgroundImage: `url('${activeUkm.coverImage}')`, referrerPolicy: 'no-referrer' } as React.CSSProperties}
            >
              <button 
                onClick={() => setSelectedUkmId(null)}
                className="absolute top-4 right-4 bg-black/75 hover:bg-black text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm hover:scale-105 transition shadow z-10"
              >
                ✕
              </button>
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
              <div className="absolute bottom-6 left-6 flex items-center gap-3.5 z-11">
                {activeUkm.logoImage && (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-white bg-white overflow-hidden shadow-md flex-shrink-0">
                    <img src={activeUkm.logoImage} alt={`${activeUkm.name} logo`} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-block bg-[#feb234] text-[#001e40] font-sans text-xs font-black uppercase tracking-wider px-3 py-1 rounded shadow-sm">
                      {activeUkm.category}
                    </span>
                    {activeUkm.instagramUrl && (
                      <a
                        href={activeUkm.instagramUrl.startsWith('http') ? activeUkm.instagramUrl : `https://instagram.com/${activeUkm.instagramUrl.replace('@', '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 bg-[#e1306c] hover:bg-[#c13584] text-white font-sans text-[10px] font-black px-2.5 py-1 rounded shadow-sm transition-all uppercase tracking-wider"
                      >
                        <Instagram size={11} />
                        <span>Instagram</span>
                      </a>
                    )}
                  </div>
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

              {/* Photo Gallery */}
              {activeUkm.gallery && activeUkm.gallery.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-slate-100 font-sans">
                  <span className="text-xs font-bold text-[#feb234] uppercase tracking-wider block">Galeri Foto Kegiatan</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {activeUkm.gallery.map((imgUrl, i) => (
                      <div key={i} className="aspect-video rounded-xl overflow-hidden border border-slate-200 shadow-sm group relative">
                        <img 
                          src={imgUrl} 
                          alt={`Galeri ${activeUkm.name}`} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
        </div>,
        document.body
      )}

      {/* JOIN UKM MODEL - VERIFICATION / LOGIN PROMPT */}
      {joinUkmId && selectedVerifyUkm && createPortal(
        <div 
          className="fixed inset-0 z-50 bg-[#001e40]/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" 
          onClick={() => { if (!isScanning) setJoinUkmId(null); }}
        >
          <div 
            className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200 animate-scale-up max-h-[90vh] flex flex-col font-sans text-xs" 
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 space-y-4 flex-1 overflow-y-auto text-slate-700">
              
              {!session ? (
                /* 1. GUEST / NOT LOGGED IN PROMPT */
                <div className="text-center space-y-4 py-4">
                  <div className="flex justify-center text-amber-500">
                    <Compass className="w-12 h-12" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-sans font-black text-base text-[#001e40]">Akses Terbatas Mahasiswa</h3>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed font-semibold">
                      Silakan login sebagai <strong>Mahasiswa</strong> terlebih dahulu untuk dapat bergabung dengan Ormawa menggunakan Token Verifikasi / Scan QR.
                    </p>
                  </div>
                  <div className="pt-4 flex gap-3 justify-center">
                    <button 
                      onClick={() => setJoinUkmId(null)}
                      className="px-4 py-2 border border-slate-250 hover:bg-slate-50 text-slate-600 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      Kembali
                    </button>
                    <button 
                      onClick={handleRedirectLogin}
                      className="px-4 py-2 bg-[#001e40] hover:bg-[#feb234] text-white hover:text-[#001e40] font-black text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
                    >
                      Login Mahasiswa
                    </button>
                  </div>
                </div>
              ) : alreadyJoined ? (
                /* 2. ALREADY JOINED */
                <div className="text-center space-y-4 py-6">
                  <div className="flex justify-center text-green-600">
                    <CheckCircle className="w-12 h-12" />
                  </div>
                  <div>
                    <h3 className="font-sans font-black text-base text-[#001e40]">Sudah Bergabung</h3>
                    <p className="text-xs text-slate-500 mt-1 font-semibold">Anda sudah terdaftar sebagai anggota aktif di {selectedVerifyUkm.name}.</p>
                  </div>
                  <div className="pt-2">
                    <button 
                      onClick={() => setJoinUkmId(null)}
                      className="px-5 py-2.5 bg-[#001e40] text-white hover:bg-[#feb234] hover:text-[#001e40] font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              ) : joinSuccess ? (
                /* 3. VERIFICATION SUCCESS */
                <div className="text-center space-y-4 py-6 animate-fade-in">
                  <div className="flex justify-center text-green-600">
                    <CheckCircle className="w-12 h-12" />
                  </div>
                  <div>
                    <h3 className="font-sans font-black text-base text-green-700">Verifikasi Berhasil!</h3>
                    <p className="text-xs text-slate-500 mt-1 font-semibold">Selamat, Anda resmi bergabung dengan {selectedVerifyUkm.name}.</p>
                  </div>
                </div>
              ) : (
                /* 4. VERIFICATION TABS (CODE / SCANNER) */
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="font-sans font-black text-base text-[#001e40]">Verifikasi Anggota Baru</h3>
                      <p className="text-[10px] text-slate-500 font-semibold">{selectedVerifyUkm.name}</p>
                    </div>
                    <button 
                      disabled={isScanning}
                      onClick={() => { setJoinUkmId(null); }} 
                      className="text-slate-400 hover:text-slate-650 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Tab Selector */}
                  <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl">
                    <button 
                      disabled={isScanning}
                      onClick={() => setVerifyMethod('code')}
                      className={`py-2 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${verifyMethod === 'code' ? 'bg-white text-[#001e40] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Kode Verifikasi
                    </button>
                    <button 
                      disabled={isScanning}
                      onClick={() => setVerifyMethod('scan')}
                      className={`py-2 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${verifyMethod === 'scan' ? 'bg-white text-[#001e40] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Scan Barcode/QR
                    </button>
                  </div>

                  {verifyMethod === 'code' ? (
                    <form onSubmit={handleVerifyCodeSubmit} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider text-center">Token Verifikasi Ormawa</label>
                        <input 
                          type="text"
                          required
                          value={verificationCode}
                          onChange={e => setVerificationCode(e.target.value)}
                          placeholder="Masukkan 12-karakter token unik..."
                          className="w-full p-3 bg-white border border-slate-200 focus:border-[#feb234] focus:ring-1 focus:ring-[#feb234] rounded-xl text-xs font-mono font-bold tracking-wider outline-none text-center"
                        />
                        <p className="text-[9px] text-amber-600 font-semibold text-center mt-1">
                          Info Demo: Pengurus memberikan token unik berikut `{getUkmToken(selectedVerifyUkm)}`
                        </p>
                      </div>

                      <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                        <button 
                          type="button"
                          onClick={() => { setJoinUkmId(null); }}
                          className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-650 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                        >
                          Batal
                        </button>
                        <button 
                          type="submit"
                          className="px-4 py-2 bg-[#feb234] hover:bg-[#e09b24] text-[#291800] font-bold text-xs rounded-lg shadow-sm transition-colors cursor-pointer"
                        >
                          Verifikasi &amp; Gabung
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      {isScanning ? (
                        <div className="bg-slate-900 rounded-2xl h-48 flex flex-col items-center justify-center relative overflow-hidden">
                          <div className="absolute inset-x-0 h-[2px] bg-emerald-500 animate-scan-line"></div>
                          <div className="w-24 h-24 border-2 border-dashed border-emerald-500/60 rounded-xl flex items-center justify-center animate-pulse">
                            <Compass className="w-8 h-8 text-emerald-500 animate-spin" />
                          </div>
                          <span className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase mt-4">Memindai Barcode/QR...</span>
                        </div>
                      ) : (
                        <div className="bg-slate-900 rounded-2xl p-5 text-center text-white space-y-4 relative overflow-hidden">
                          <div className="flex justify-center">
                            <Compass className="w-12 h-12 text-[#feb234]" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white">Pindai QR Code Rekrutmen</p>
                            <p className="text-[10px] text-slate-400 mt-1 max-w-xs mx-auto">
                              Arahkan kamera ke QR code / barcode rekrutmen resmi yang dipasang oleh pengurus Ormawa.
                            </p>
                          </div>

                          <div className="flex flex-col gap-2">
                            <button 
                              onClick={handleSimulateScan}
                              className="w-full py-2.5 bg-[#feb234] hover:bg-[#e09b24] text-[#291800] font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
                            >
                              Simulasikan Scan Kamera
                            </button>
                            <div className="relative border border-dashed border-slate-700 hover:border-slate-500 rounded-xl py-3 cursor-pointer transition-colors bg-slate-950/40">
                              <input 
                                type="file" 
                                accept="image/*"
                                onChange={handleSimulateScan}
                                className="absolute inset-0 opacity-0 cursor-pointer" 
                              />
                              <p className="text-[9px] text-slate-400 font-bold">Atau Unggah Gambar QR Code</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end pt-2 border-t border-slate-100">
                        <button 
                          disabled={isScanning}
                          onClick={() => { setJoinUkmId(null); }}
                          className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-650 font-bold text-xs rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
