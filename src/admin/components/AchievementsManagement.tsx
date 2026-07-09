import React, { useState } from 'react';
import { Award, Check, X, Trash2, Trophy, Clock, CheckCircle, XCircle, ArrowUpRight, Search, Eye } from 'lucide-react';
import { Achievement } from '../../types';

interface AchievementsManagementProps {
  achievements: Achievement[];
  onUpdateStatus: (id: string, status: 'Disetujui' | 'Ditolak') => Promise<void>;
  onDeleteAchievement: (id: string) => Promise<void>;
}

export default function AchievementsManagement({ 
  achievements, 
  onUpdateStatus, 
  onDeleteAchievement 
}: AchievementsManagementProps) {
  const [filter, setFilter] = useState<'All' | 'Disetujui' | 'Menunggu Verifikasi' | 'Ditolak'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Statistics
  const totalCount = achievements.length;
  const approvedCount = achievements.filter(a => a.status === 'Disetujui').length;
  const pendingCount = achievements.filter(a => !a.status || a.status === 'Menunggu Verifikasi').length;
  const rejectedCount = achievements.filter(a => a.status === 'Ditolak').length;

  // Filtering & Search
  const filteredAchievements = achievements.filter(ach => {
    // Status filter
    if (filter === 'Disetujui' && ach.status !== 'Disetujui') return false;
    if (filter === 'Menunggu Verifikasi' && ach.status && ach.status !== 'Menunggu Verifikasi') return false;
    if (filter === 'Ditolak' && ach.status !== 'Ditolak') return false;

    // Search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      const titleMatch = ach.title.toLowerCase().includes(query);
      const studentMatch = ach.studentName.toLowerCase().includes(query);
      const majorMatch = ach.major.toLowerCase().includes(query);
      const rankMatch = ach.rank.toLowerCase().includes(query);
      return titleMatch || studentMatch || majorMatch || rankMatch;
    }

    return true;
  });

  const getStatusBadge = (status?: string) => {
    if (status === 'Disetujui') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold leading-none bg-emerald-50 text-emerald-700 border border-emerald-250/20">
          <CheckCircle size={12} />
          Disetujui
        </span>
      );
    }
    if (status === 'Ditolak') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold leading-none bg-red-50 text-red-700 border border-red-200">
          <XCircle size={12} />
          Ditolak
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold leading-none bg-amber-50 text-amber-700 border border-amber-200">
        <Clock size={12} />
        Menunggu Verifikasi
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* Page Header */}
      <div>
        <h2 className="font-sans font-black text-3xl text-[#001e40]">Verifikasi Prestasi Mahasiswa</h2>
        <p className="text-sm text-[#43474f] font-medium">Tinjau, setujui, atau tolak laporan prestasi akademik dan non-akademik yang diajukan oleh mahasiswa.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-slate-50 text-[#001e40] flex items-center justify-center flex-shrink-0">
            <Trophy size={20} />
          </div>
          <div>
            <p className="text-xl font-black text-[#001e40]">{totalCount}</p>
            <p className="text-[10px] uppercase font-bold text-slate-400">Total Pengajuan</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0">
            <Clock size={20} className="animate-pulse" />
          </div>
          <div>
            <p className="text-xl font-black text-amber-700">{pendingCount}</p>
            <p className="text-[10px] uppercase font-bold text-slate-400">Menunggu Verifikasi</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
            <CheckCircle size={20} />
          </div>
          <div>
            <p className="text-xl font-black text-emerald-700">{approvedCount}</p>
            <p className="text-[10px] uppercase font-bold text-slate-400">Disetujui (SKPI)</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-700 flex items-center justify-center flex-shrink-0">
            <XCircle size={20} />
          </div>
          <div>
            <p className="text-xl font-black text-red-700">{rejectedCount}</p>
            <p className="text-[10px] uppercase font-bold text-slate-400">Ditolak</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl shadow-sm p-4 border border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Filters */}
        <div className="flex gap-2 w-full md:w-auto">
          {['All', 'Menunggu Verifikasi', 'Disetujui', 'Ditolak'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filter === tab 
                  ? 'bg-[#001e40] text-white shadow-sm' 
                  : 'bg-slate-50 text-slate-655 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {tab === 'All' ? 'Semua Status' : tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Cari nama, kegiatan, NIM..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 focus:border-[#001e40] focus:ring-2 focus:ring-[#001e40]/10 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold outline-none transition-all placeholder:text-slate-400"
          />
          <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
        </div>
      </div>

      {/* Data Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#c3c6d1]/40 overflow-hidden">
        <div className="p-5 border-b border-[#eceef1] bg-[#f7f9fc] flex justify-between items-center">
          <h3 className="font-sans font-bold text-[#191c1e] text-base">Daftar Pengajuan Prestasi</h3>
          <span className="bg-[#d5e3ff] text-[#001b3c] text-xs font-bold px-3 py-1 rounded-full border border-[#a7c8ff]/20">
            {filteredAchievements.length} Data ditemukan
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f2f4f7] text-[#43474f] font-bold text-xs uppercase tracking-wider border-b border-[#c3c6d1]/30">
                <th className="px-6 py-4">Mahasiswa</th>
                <th className="px-6 py-4">Kegiatan / Kompetisi</th>
                <th className="px-6 py-4 text-center">Tingkat &amp; Tahun</th>
                <th className="px-6 py-4">Peringkat &amp; Kategori</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right pr-6">Verifikasi</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium divide-y divide-[#c3c6d1]/20 text-[#191c1e]">
              {filteredAchievements.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400 font-medium text-xs">
                    Tidak ada pengajuan prestasi mahasiswa yang ditemukan.
                  </td>
                </tr>
              ) : (
                filteredAchievements.map((ach) => (
                  <tr key={ach.id} className="hover:bg-[#f2f4f7]/40 transition-colors">
                    {/* Mahasiswa Info */}
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-[#191c1e]">{ach.studentName}</p>
                        <p className="text-xs text-[#737780] font-semibold">{ach.major}</p>
                      </div>
                    </td>

                    {/* Title */}
                    <td className="px-6 py-4 max-w-sm">
                      <div className="flex flex-col gap-1">
                        <p className="font-semibold text-[#191c1e] line-clamp-2">{ach.title}</p>
                        {ach.description && <p className="text-[11px] text-[#737780] font-medium line-clamp-1">{ach.description}</p>}
                      </div>
                    </td>

                    {/* Level & Year */}
                    <td className="px-6 py-4 text-center">
                      <div>
                        <span className="bg-[#d5e3ff]/70 text-[#001e40] text-[10px] font-bold px-2 py-0.5 rounded-md border border-[#a7c8ff]/20">
                          {ach.level}
                        </span>
                        <p className="text-xs text-slate-400 font-semibold mt-1">{ach.year}</p>
                      </div>
                    </td>

                    {/* Rank & Category */}
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-[#001e40]">{ach.rank}</p>
                        <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase block mt-0.5">{ach.category}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      {getStatusBadge(ach.status)}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right pr-6 whitespace-nowrap">
                      <div className="flex justify-end items-center gap-2">
                        {ach.image && (
                          <button
                            onClick={() => setSelectedImage(ach.image)}
                            className="p-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-[#001e40] border border-slate-200/50 cursor-pointer"
                            title="Lihat Foto Bukti"
                          >
                            <Eye size={14} />
                          </button>
                        )}
                        
                        {(ach.status !== 'Disetujui') && (
                          <button
                            onClick={() => {
                              if (confirm(`Setujui pengajuan prestasi "${ach.title}"?`)) {
                                onUpdateStatus(ach.id, 'Disetujui');
                              }
                            }}
                            className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 hover:text-emerald-700 rounded-lg border border-emerald-150/40 cursor-pointer"
                            title="Setujui Pengajuan"
                          >
                            <Check size={14} className="stroke-[3]" />
                          </button>
                        )}

                        {(ach.status !== 'Ditolak') && (
                          <button
                            onClick={() => {
                              if (confirm(`Tolak pengajuan prestasi "${ach.title}"?`)) {
                                onUpdateStatus(ach.id, 'Ditolak');
                              }
                            }}
                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-700 rounded-lg border border-red-150/40 cursor-pointer"
                            title="Tolak Pengajuan"
                          >
                            <X size={14} className="stroke-[3]" />
                          </button>
                        )}

                        <button
                          onClick={() => {
                            if (confirm(`Apakah Anda yakin ingin menghapus data pengajuan prestasi ini?`)) {
                              onDeleteAchievement(ach.id);
                            }
                          }}
                          className="p-1.5 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg border border-slate-200/50 cursor-pointer"
                          title="Hapus Data"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full p-4 relative" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 p-1 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 hover:text-slate-700 transition"
            >
              <X size={20} />
            </button>
            <img 
              src={selectedImage} 
              alt="Dokumentasi Bukti Prestasi" 
              className="w-full max-h-[70vh] object-contain rounded-xl"
            />
            <div className="mt-3 flex justify-between items-center">
              <span className="text-xs text-slate-400 font-semibold">Bukti Sertifikat / Foto Kegiatan</span>
              <a 
                href={selectedImage} 
                target="_blank" 
                rel="noreferrer"
                className="text-xs font-bold text-[#001e40] hover:underline flex items-center gap-1"
              >
                Buka di Tab Baru <ArrowUpRight size={12} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
