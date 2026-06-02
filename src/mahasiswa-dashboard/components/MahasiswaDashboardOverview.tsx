import React from 'react';
import { 
  Trophy, 
  Users, 
  Award, 
  Calendar, 
  Clock, 
  MapPin, 
  Megaphone, 
  ArrowRight, 
  Star,
  PlusCircle
} from 'lucide-react';

interface DashboardOverviewProps {
  studentName: string;
  onNavigate: (tab: string) => void;
}

export default function MahasiswaDashboardOverview({ studentName, onNavigate }: DashboardOverviewProps) {
  return (
    <div className="space-y-8 animate-fade-in pb-10">
      
      {/* Welcome Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
        <div>
          <h1 className="font-display font-extrabold text-2xl md:text-3xl text-[#001e40] mb-1.5">
            Selamat Datang Kembali, {studentName}!
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Berikut adalah ringkasan kegiatan kemahasiswaan dan prestasi Anda.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-[#feb234]/10 text-[#6d4700] px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border border-[#feb234]/20">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>Fakultas Ilmu Komputer</span>
          </div>
          <button 
            onClick={() => onNavigate('prestasi')}
            className="bg-[#001e40] hover:bg-[#1f477b] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Ajukan Prestasi Baru</span>
          </button>
        </div>
      </section>

      {/* Bento Grid: Academic Overview */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card: Prestasi Saya */}
        <div 
          onClick={() => onNavigate('prestasi')}
          className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden group"
        >
          <div className="absolute -right-6 -top-6 bg-[#001e40]/5 w-32 h-32 rounded-full blur-2xl group-hover:bg-[#001e40]/10 transition-colors"></div>
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Prestasi Saya</p>
              <h2 className="font-display font-extrabold text-4xl text-[#001e40]">5</h2>
            </div>
            <div className="bg-[#001e40]/5 p-3 rounded-xl text-[#001e40] group-hover:bg-[#001e40] group-hover:text-white transition-colors">
              <Trophy className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[#815500] text-xs font-bold relative z-10">
            <span className="w-2 h-2 rounded-full bg-[#feb234] animate-pulse"></span>
            <span>2 menunggu verifikasi</span>
          </div>
        </div>

        {/* Card: UKM Diikuti */}
        <div 
          onClick={() => onNavigate('ukm')}
          className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden group"
        >
          <div className="absolute -right-6 -bottom-6 bg-[#feb234]/10 w-32 h-32 rounded-full blur-2xl group-hover:bg-[#feb234]/20 transition-colors"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">UKM Diikuti</p>
              <h2 className="font-display font-extrabold text-4xl text-[#001e40]">
                2 <span className="text-sm font-medium text-slate-400 font-sans">/ 3 Max</span>
              </h2>
            </div>
            <div className="bg-[#feb234]/10 p-3 rounded-xl text-[#815500] group-hover:bg-[#feb234] group-hover:text-[#291800] transition-colors">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3 relative z-10">
            <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-[10px] font-bold border border-slate-200">Robotika</span>
            <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-[10px] font-bold border border-slate-200">English Club</span>
          </div>
        </div>

        {/* Card: Status Beasiswa */}
        <div 
          onClick={() => onNavigate('beasiswa')}
          className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute -left-6 -bottom-6 bg-emerald-500/5 w-32 h-32 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors"></div>
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Status Beasiswa</p>
              <h2 className="font-display font-extrabold text-2xl text-emerald-600">Aktif</h2>
            </div>
            <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs font-bold text-slate-700 mb-0.5">Beasiswa Unggulan UPB</p>
          <p className="text-[10px] text-slate-400 font-semibold">Valid s.d. Sep 2024</p>
        </div>
      </section>

      {/* Split Layout: Timeline & Activity Feed */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Jadwal Kegiatan UKM (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <h3 className="font-sans font-black text-lg text-[#001e40] flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#001e40]" />
                Jadwal Kegiatan UKM
              </h3>
              <button 
                onClick={() => onNavigate('ukm')}
                className="text-xs font-bold text-[#815500] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Lihat Kalender</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Event Item 1 */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100/70 border border-slate-100 transition-all">
                <div className="flex flex-col items-center justify-center w-14 h-14 bg-[#001e40] text-[#feb234] rounded-xl shrink-0 font-sans shadow-sm">
                  <span className="font-bold text-sm leading-tight">15:00</span>
                  <span className="text-[9px] uppercase tracking-wider font-extrabold opacity-80">WIB</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-[#001e40] truncate">Rapat Mingguan Robotika</h4>
                  <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-450 shrink-0" />
                    <span className="truncate">Ruang UKM Terpadu - Gd. Kemahasiswaan</span>
                  </p>
                </div>
                <span className="hidden sm:block px-3 py-1 bg-white text-slate-600 rounded-full text-[10px] font-bold border border-slate-200/80">
                  UKM Robotika
                </span>
              </div>

              {/* Event Item 2 */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100/70 border border-slate-100 transition-all">
                <div className="flex flex-col items-center justify-center w-14 h-14 bg-slate-200 text-slate-700 rounded-xl shrink-0 font-sans">
                  <span className="font-bold text-sm leading-tight">18:30</span>
                  <span className="text-[9px] uppercase tracking-wider font-extrabold opacity-80">WIB</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-[#001e40] truncate">Latihan English Club</h4>
                  <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-450 shrink-0" />
                    <span className="truncate">Ruang Sidang B - Gd. Rektorat Lt. 2</span>
                  </p>
                </div>
                <span className="hidden sm:block px-3 py-1 bg-white text-slate-600 rounded-full text-[10px] font-bold border border-slate-200/80">
                  English Club
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Info Kemahasiswaan (Activity Feed) */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm flex flex-col h-full overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/70">
              <h3 className="font-sans font-black text-lg text-[#001e40] flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-[#815500]" />
                Info Kemahasiswaan
              </h3>
            </div>
            
            <div className="p-5 flex-1 space-y-6">
              
              {/* Timeline item 1 */}
              <div className="relative pl-6 before:absolute before:left-1.5 before:top-2 before:bottom-[-28px] before:w-0.5 before:bg-slate-100 last:before:hidden">
                <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full bg-[#feb234] border-2 border-white shadow-sm ring-1 ring-slate-200"></div>
                <p className="text-[10px] font-bold text-[#815500] uppercase tracking-wider mb-1">Hari Ini, 09:00 WIB</p>
                <h4 className="font-bold text-xs text-[#001e40] mb-1">Batas Laporan Prestasi</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Pengumpulan bukti prestasi periode ganjil ditutup hari ini pukul 23:59 WIB.
                </p>
              </div>

              {/* Timeline item 2 */}
              <div className="relative pl-6 before:absolute before:left-1.5 before:top-2 before:bottom-[-28px] before:w-0.5 before:bg-slate-100 last:before:hidden">
                <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full bg-[#001e40] border-2 border-white shadow-sm ring-1 ring-slate-200"></div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Kemarin</p>
                <h4 className="font-bold text-xs text-[#001e40] mb-1">Rekrutmen Terbuka UKM Seni</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Pendaftaran anggota baru UKM Seni dibuka untuk angkatan 2023 dan 2024.
                </p>
              </div>

              {/* Timeline item 3 */}
              <div className="relative pl-6 before:absolute before:left-1.5 before:top-2 before:bottom-[-28px] before:w-0.5 before:bg-slate-100 last:before:hidden">
                <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full bg-slate-300 border-2 border-white shadow-sm ring-1 ring-slate-200"></div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">12 Okt 2023</p>
                <h4 className="font-bold text-xs text-[#001e40] mb-1">Beasiswa LPDP Gel. 2</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Pendaftaran beasiswa LPDP Gelombang 2 resmi dibuka. Persiapkan berkas Anda.
                </p>
              </div>

            </div>
          </div>
        </div>

      </section>

    </div>
  );
}
