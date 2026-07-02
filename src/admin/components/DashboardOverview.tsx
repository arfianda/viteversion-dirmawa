import React from 'react';
import { Users, Shield, Award, Newspaper, BookOpen, Plus, Megaphone, Sparkles, PlusCircle } from 'lucide-react';
import { AlumniRecord, UkmRecord, ScholarshipRecord, NewsArticle } from '../types';

interface DashboardOverviewProps {
  studentsCount: number;
  newStudentsCount: number;
  ukmsCount: number;
  activeUkmsCount: number;
  scholarshipsCount: number;
  openScholarshipsCount: number;
  alumniCount: number;
  verifiedAlumniCount: number;
  news: NewsArticle[];
  onNavigate: (tab: string) => void;
  onQuickAction: (actionType: 'news' | 'alumni' | 'scholarship') => void;
}

function formatRelativeDate(dateStr: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Hari Ini';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Kemarin';
  }
  
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export default function DashboardOverview({
  studentsCount,
  newStudentsCount,
  ukmsCount,
  activeUkmsCount,
  scholarshipsCount,
  openScholarshipsCount,
  alumniCount,
  verifiedAlumniCount,
  news,
  onNavigate,
  onQuickAction
}: DashboardOverviewProps) {
  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* Welcome header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-sans font-black text-3xl text-[#001e40]">Ringkasan Dasbor</h2>
          <p className="text-sm text-[#43474f] font-medium">Selamat datang kembali. Berikut adalah aktivitas kampus hari ini.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onNavigate('news')}
            className="bg-[#001e40] hover:bg-[#1f477b] text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <Plus size={16} />
            Buat Konten
          </button>
        </div>
      </div>

      {/* Stats Grid (Bento Style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 - Total Students */}
        <div className="bg-white rounded-2xl p-6 border border-[#c3c6d1]/40 shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-h-[140px]">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-[#001e40]/5 text-[#001e40] rounded-xl">
              <BookOpen size={24} />
            </div>
            <span className="text-[11px] font-bold text-[#6d4700] bg-[#feb234]/15 px-2.5 py-1 rounded-full border border-[#feb234]/20">
              +{newStudentsCount} bulan ini
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-bold text-[#43474f] uppercase tracking-wider">Total Mahasiswa</p>
            <h3 className="font-sans font-black text-3xl text-[#001e40] mt-1">
              {studentsCount.toLocaleString('id-ID')}
            </h3>
          </div>
        </div>

        {/* Card 2 - Active UKMs */}
        <div className="bg-white rounded-2xl p-6 border border-[#c3c6d1]/40 shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-h-[140px]">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-[#feb234]/10 text-[#6d4700] rounded-xl">
              <Users size={24} />
            </div>
            <span className="text-[11px] font-bold text-[#43474f] bg-[#f2f4f7] px-2.5 py-1 rounded-full border border-[#c3c6d1]/35">
              {activeUkmsCount} Aktif
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-bold text-[#43474f] uppercase tracking-wider">UKM Aktif</p>
            <h3 className="font-sans font-black text-3xl text-[#001e40] mt-1">
              {ukmsCount}
            </h3>
          </div>
        </div>

        {/* Card 3 - Active Scholarships */}
        <div className="bg-white rounded-2xl p-6 border border-[#c3c6d1]/40 shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-h-[140px]">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-[#001e40]/5 text-[#1f477b] rounded-xl">
              <BookOpen size={24} />
            </div>
            <span className="text-[11px] font-bold text-[#6d4700] bg-[#feb234]/15 px-2.5 py-1 rounded-full border border-[#feb234]/20">
              {openScholarshipsCount} Dibuka
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-bold text-[#43474f] uppercase tracking-wider">Program Beasiswa</p>
            <h3 className="font-sans font-black text-3xl text-[#001e40] mt-1">
              {scholarshipsCount}
            </h3>
          </div>
        </div>

        {/* Card 4 - Registered Alumni */}
        <div className="bg-white rounded-2xl p-6 border border-[#c3c6d1]/40 shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-h-[140px]">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-[#313146]/10 text-[#1c1c30] rounded-xl">
              <Award size={24} />
            </div>
            <span className="text-[11px] font-bold text-[#001b3c] bg-[#d5e3ff] px-2.5 py-1 rounded-full border border-[#a7c8ff]/30">
              {verifiedAlumniCount} Terverifikasi
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-bold text-[#43474f] uppercase tracking-wider">Alumni Terdaftar</p>
            <h3 className="font-sans font-black text-3xl text-[#001e40] mt-1">
              {alumniCount}
            </h3>
          </div>
        </div>
      </div>

      {/* Grid: Quick Actions and Recent Content Updates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions Panel */}
        <div className="bg-white rounded-2xl border border-[#c3c6d1]/40 shadow-sm p-6 flex flex-col h-full justify-between">
          <div>
            <h3 className="font-sans font-bold text-lg text-[#191c1e]">Aksi Cepat</h3>
            <p className="text-xs text-[#737780] font-medium mb-4">Percepat alur kerja administratif Anda secara instan.</p>
          </div>
          
          <div className="space-y-3 flex-1">
            <button
              onClick={() => onQuickAction('news')}
              className="w-full bg-[#001e40] text-white rounded-xl px-4 py-3.5 font-semibold text-sm flex items-center justify-between hover:bg-[#1f477b] transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Megaphone size={18} />
                Tulis Artikel Berita
              </div>
              <PlusCircle size={16} className="opacity-70 group-hover:opacity-100 transition-opacity" />
            </button>

            <button
              onClick={() => onQuickAction('alumni')}
              className="w-full bg-white text-[#001e40] border-2 border-[#001e40] rounded-xl px-4 py-3.5 font-bold text-sm flex items-center justify-between hover:bg-[#001e40]/5 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Users size={18} />
                Unggah Data Alumni
              </div>
              <PlusCircle size={16} className="opacity-70 group-hover:opacity-100 transition-opacity" />
            </button>

            <button
              onClick={() => onQuickAction('scholarship')}
              className="w-full bg-white text-[#001e40] border-2 border-[#001e40] rounded-xl px-4 py-3.5 font-bold text-sm flex items-center justify-between hover:bg-[#001e40]/5 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Sparkles size={18} />
                Tambah Beasiswa Baru
              </div>
              <PlusCircle size={16} className="opacity-70 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-[#eceef1] text-center text-xs text-[#737780] font-medium">
            Kredensial admin resmi aktif
          </div>
        </div>

        {/* Recent Updates Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#c3c6d1]/40 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-[#eceef1] flex justify-between items-center bg-white">
              <div>
                <h3 className="font-sans font-bold text-lg text-[#191c1e]">Pembaruan Konten Terbaru</h3>
                <p className="text-xs text-[#43474f] mt-0.5">Perubahan langsung pada portal komunikasi universitas.</p>
              </div>
              <button
                onClick={() => onNavigate('news')}
                className="text-[#001e40] font-bold text-xs hover:underline cursor-pointer"
              >
                Lihat Semua
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f2f4f7] font-bold text-xs text-[#43474f] uppercase tracking-wider">
                    <th className="p-4 pl-5">Judul Konten</th>
                    <th className="p-4">Kategori</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 pr-5">Tanggal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eceef1] text-sm font-medium">
                  {news.slice(0, 4).map((item) => (
                    <tr key={item.id} className="hover:bg-[#f2f4f7]/40 transition-colors">
                      <td className="p-4 pl-5 text-[#191c1e] font-semibold flex items-center gap-2">
                        <Newspaper size={16} className="text-[#001e40] min-w-[16px]" />
                        <span className="truncate max-w-[200px] md:max-w-[260px]">{item.title}</span>
                      </td>
                      <td className="p-4 text-[#43474f]">{item.category}</td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold leading-none ${
                            item.status === 'Published'
                              ? 'bg-[#001e40]/5 text-[#001e40] border border-[#001e40]/20'
                              : item.status === 'Draft'
                              ? 'bg-[#feb234]/15 text-[#6d4700] border border-[#feb234]/20'
                              : 'bg-[#ffdad6] text-[#93000a] border border-[#ffdad6]'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              item.status === 'Published'
                                ? 'bg-[#001e40]'
                                : item.status === 'Draft'
                                ? 'bg-[#feb234]'
                                : 'bg-[#ba1a1a]'
                            }`}
                          ></span>
                          {item.status === 'Published' ? 'Diterbitkan' : item.status === 'Draft' ? 'Draf' : item.status}
                        </span>
                      </td>
                      <td className="p-4 pr-5 text-[#737780] text-xs">
                        {formatRelativeDate(item.publishDate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4 border-t border-[#eceef1] text-center bg-[#f7f9fc]">
            <button
              onClick={() => onNavigate('news')}
              className="text-[#001e40] hover:text-[#1f477b] text-xs font-bold transition-colors cursor-pointer"
            >
              Kelola dan Edit Semua Berita
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
