import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Users, Shield, Award, Newspaper, BookOpen, Plus, Megaphone, Sparkles, PlusCircle, Check, X, AlertCircle, ArrowRight } from 'lucide-react';
import { NewsArticle } from '../types';

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
  userRoles: string[];
  pendingScholarships: any[];
  pendingRegistrations: any[];
  pendingUserApprovals: any[];
  onApproveScholarship: (id: string) => Promise<void>;
  onRejectScholarship: (id: string, reason: string) => Promise<void>;
  onApproveRegistration: (id: string) => Promise<void>;
  onApproveUser: (id: string) => Promise<void>;
  onNavigate: (tab: string) => void;
  onQuickAction: (actionType: 'news' | 'alumni' | 'scholarship') => void;
}

const getEmbeddableUrl = (url: string) => {
  if (!url) return '';
  
  if (url.includes('drive.google.com')) {
    const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
    }
    const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idMatch && idMatch[1]) {
      return `https://drive.google.com/file/d/${idMatch[1]}/preview`;
    }
  }
  return url;
};

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
  userRoles,
  pendingScholarships,
  pendingRegistrations,
  pendingUserApprovals,
  onApproveScholarship,
  onRejectScholarship,
  onApproveRegistration,
  onApproveUser,
  onNavigate,
  onQuickAction
}: DashboardOverviewProps) {
  const [selectedReviewApp, setSelectedReviewApp] = useState<any | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ type: 'scholarship' | 'user' | 'registration'; data: any } | null>(null);

  const isSuper = userRoles.includes('superadmin');
  const isScholarshipStaff = userRoles.includes('staf_beasiswa') || isSuper;

  const showScholarshipReminders = isScholarshipStaff && pendingScholarships.length > 0;
  const showUserApprovalsReminders = isSuper && pendingUserApprovals.length > 0;
  const showRegistrationReminders = isSuper && pendingRegistrations.length > 0;
  const hasReminders = showScholarshipReminders || showUserApprovalsReminders || showRegistrationReminders;

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

      {/* Reminders / Action Required Panel */}
      {hasReminders && (
        <div className="bg-white rounded-2xl border border-red-100 bg-gradient-to-r from-red-50/10 via-amber-50/5 to-white p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 text-red-800 border-b border-red-100/50 pb-3">
            <AlertCircle size={20} className="text-red-500 animate-pulse" />
            <div>
              <h3 className="font-sans font-bold text-base text-[#191c1e]">Tindakan Diperlukan (Pengingat Administrasi)</h3>
              <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Selesaikan permohonan yang tertunda untuk menghindari keterlambatan proses mahasiswa.</p>
            </div>
          </div>

          <div className="space-y-5">
            {/* 1. Scholarship Applications Reminders */}
            {showScholarshipReminders && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#feb234] rounded-full"></span>
                    Menunggu Persetujuan Beasiswa ({pendingScholarships.length})
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pendingScholarships.slice(0, 3).map((app) => (
                    <div key={app.id} className="bg-[#f8fafc] border border-slate-200/60 rounded-xl p-4 flex flex-col justify-between hover:border-slate-350 transition-colors">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-sm text-slate-800">{app.name}</h4>
                            <p className="text-[10px] text-slate-400 font-semibold">{app.nim} • {app.major}</p>
                          </div>
                          <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            IPK: {app.gpa?.toFixed(2) || 'N/A'}
                          </span>
                        </div>
                        <div className="bg-[#001e40]/5 rounded-lg px-2.5 py-1.5 border border-[#001e40]/10">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Program Beasiswa</p>
                          <p className="text-xs font-bold text-[#001e40] truncate mt-0.5">
                            {app.scholarships?.title || 'Program Beasiswa'}
                          </p>
                        </div>
                      </div>

                      {/* Approve / Reject Controls */}
                      <div className="mt-4 pt-3 border-t border-slate-200/50 flex flex-col gap-2">
                        {rejectingId === app.id ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              required
                              placeholder="Masukkan alasan penolakan..."
                              value={rejectReason}
                              onChange={(e) => setRejectReason(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-red-500 font-medium"
                            />
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => {
                                  setRejectingId(null);
                                  setRejectReason('');
                                }}
                                disabled={processingId !== null}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] font-bold cursor-pointer"
                              >
                                Batal
                              </button>
                              <button
                                onClick={async () => {
                                  if (!rejectReason.trim()) return;
                                  setProcessingId(app.id);
                                  await onRejectScholarship(app.id, rejectReason);
                                  setRejectingId(null);
                                  setRejectReason('');
                                  setProcessingId(null);
                                }}
                                disabled={processingId !== null}
                                className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                              >
                                Kirim
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <button
                              onClick={() => setSelectedReviewApp(app)}
                              className="w-full bg-[#001e40] hover:bg-[#1f477b] text-white font-bold py-2 rounded-lg text-[10px] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Shield size={12} />
                              Tinjau Berkas & Detail
                            </button>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setRejectingId(app.id)}
                                disabled={processingId !== null}
                                className="flex-1 bg-white hover:bg-red-50 text-red-600 border border-red-200 hover:border-red-300 font-bold py-1.5 rounded-lg text-[10px] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <X size={12} />
                                Tolak
                              </button>
                              <button
                                onClick={() => {
                                  setConfirmAction({ type: 'scholarship', data: app });
                                }}
                                disabled={processingId !== null}
                                className="flex-1 bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold py-1.5 rounded-lg text-[10px] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <Check size={12} />
                                Setujui
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {pendingScholarships.length > 3 && (
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => onNavigate('scholarship-apps')}
                      className="text-[#001e40] hover:text-[#1f477b] hover:underline font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      Buka Antrian Beasiswa ({pendingScholarships.length - 3} Lainnya)
                      <ArrowRight size={14} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 2. User Approvals Reminders (Super Admin Only) */}
            {showUserApprovalsReminders && (
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#feb234] rounded-full"></span>
                    Menunggu Persetujuan Akun Staf Baru ({pendingUserApprovals.length})
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pendingUserApprovals.slice(0, 3).map((usr) => (
                    <div key={usr.id} className="bg-[#f8fafc] border border-slate-200/60 rounded-xl p-4 flex justify-between items-center hover:border-slate-350 transition-colors">
                      <div>
                        <h4 className="font-bold text-sm text-slate-800">{usr.name}</h4>
                        <p className="text-[10px] text-slate-400 font-semibold">{usr.email}</p>
                        <span className="inline-block mt-1 bg-slate-155 text-slate-700 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                          {usr.role}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setConfirmAction({ type: 'user', data: usr });
                        }}
                        disabled={processingId !== null}
                        className="bg-[#001e40] hover:bg-[#1f477b] text-white font-bold p-2 rounded-lg text-xs transition-colors cursor-pointer"
                        title="Setujui Akun"
                      >
                        <Check size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Student Registration Request Reminders (Super Admin Only) */}
            {showRegistrationReminders && (
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#feb234] rounded-full"></span>
                    Permohonan Registrasi Mahasiswa Baru ({pendingRegistrations.length})
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pendingRegistrations.slice(0, 3).map((reg) => (
                    <div key={reg.id} className="bg-[#f8fafc] border border-slate-200/60 rounded-xl p-4 flex justify-between items-center hover:border-slate-350 transition-colors">
                      <div>
                        <h4 className="font-bold text-sm text-slate-800">{reg.name}</h4>
                        <p className="text-[10px] text-slate-400 font-semibold">NIM: {reg.nim}</p>
                        <span className="inline-block mt-1 bg-blue-50 text-blue-700 text-[9px] font-bold px-2 py-0.5 rounded border border-blue-100">
                          Menunggu Verifikasi
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setConfirmAction({ type: 'registration', data: reg });
                        }}
                        disabled={processingId !== null}
                        className="bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold p-2 rounded-lg text-xs transition-colors cursor-pointer"
                        title="Setujui Registrasi"
                      >
                        <Check size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                
                {pendingRegistrations.length > 3 && (
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => onNavigate('registrations')}
                      className="text-[#001e40] hover:text-[#1f477b] hover:underline font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      Buka Antrian Registrasi ({pendingRegistrations.length - 3} Lainnya)
                      <ArrowRight size={14} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

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
              className="w-full bg-[#001e40] text-white rounded-xl px-4 py-3.5 font-semibold text-sm flex items-center justify-between hover:bg-[#1f477b] transition-colors group group-hover:bg-[#1f477b] cursor-pointer"
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

      {/* Modal Tinjau Berkas */}
      {selectedReviewApp && createPortal(
        <div className="fixed inset-0 z-[100] flex justify-center items-center bg-black/50 backdrop-blur-sm p-4 md:py-10">
          <div className="bg-white border border-slate-200 w-full max-w-5xl h-[640px] max-h-[90vh] rounded-3xl shadow-2xl flex flex-col transition-all duration-300">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center shrink-0">
              <div>
                <h3 className="font-sans font-black text-lg text-[#001e40]">Review Pemberkasan & Detail Pendaftaran</h3>
                <p className="text-[10px] text-slate-500 font-bold mt-0.5">Harap verifikasi semua berkas sebelum menyetujui pendaftaran.</p>
              </div>
              <button
                onClick={() => {
                  setSelectedReviewApp(null);
                  setRejectingId(null);
                  setRejectReason('');
                }}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 text-xs text-slate-800 space-y-4 overflow-y-auto flex-grow">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans h-full">
                {/* Left: Student Info */}
                <div className="lg:col-span-5 space-y-4 text-left flex flex-col justify-between h-full">
                  <div className="space-y-4">
                    <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-200/40 space-y-3">
                      <h4 className="font-bold text-xs text-[#001e40] uppercase tracking-wider border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
                        <Users size={14} className="text-[#001e40]" />
                        Informasi Mahasiswa
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Nama Lengkap</span>
                          <p className="font-bold text-slate-900 text-xs mt-0.5 break-words">{selectedReviewApp.name}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">NIM</span>
                          <p className="font-bold text-slate-900 text-xs mt-0.5">{selectedReviewApp.nim}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Program Studi</span>
                          <p className="font-bold text-slate-900 text-xs mt-0.5">{selectedReviewApp.major || '-'}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Indeks Prestasi Kumulatif (IPK)</span>
                          <p className="font-bold text-slate-900 text-xs mt-0.5">
                            <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              {selectedReviewApp.gpa?.toFixed(2) || 'N/A'}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">No. Telepon / WA</span>
                          <p className="font-bold text-slate-900 text-xs mt-0.5">{selectedReviewApp.phone || '-'}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Program Beasiswa</span>
                          <p className="font-bold text-slate-900 text-xs mt-0.5 truncate">{selectedReviewApp.scholarships?.title || '-'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-200/40 space-y-2">
                      <h4 className="font-bold text-xs text-[#001e40] uppercase tracking-wider border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
                        <Shield size={14} className="text-[#001e40]" />
                        Status Berkas
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium">Pastikan kelengkapan berkas berikut sebelum melakukan persetujuan:</p>
                      <ul className="space-y-1.5 text-[11px] font-bold text-slate-700">
                        <li className="flex items-center gap-1.5 text-green-700">
                          <Check size={14} className="text-green-600" />
                          Kartu Hasil Studi (KHS) Semester Terakhir
                        </li>
                        <li className="flex items-center gap-1.5 text-green-700">
                          <Check size={14} className="text-green-600" />
                          Surat Pernyataan Tidak Menerima Beasiswa Lain
                        </li>
                        <li className="flex items-center gap-1.5 text-green-700">
                          <Check size={14} className="text-green-600" />
                          Sertifikat Prestasi Pendukung (bila ada)
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Actions in details pane */}
                  <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                    {rejectingId === selectedReviewApp.id ? (
                      <div className="space-y-2">
                        <label className="text-[10px] text-slate-400 font-bold uppercase">Alasan Penolakan</label>
                        <input
                          type="text"
                          required
                          placeholder="Masukkan alasan penolakan..."
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-red-500 font-medium"
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => {
                              setRejectingId(null);
                              setRejectReason('');
                            }}
                            disabled={processingId !== null}
                            className="px-3 py-1.5 bg-slate-150 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold cursor-pointer"
                          >
                            Batal
                          </button>
                          <button
                            onClick={async () => {
                              if (!rejectReason.trim()) return;
                              setProcessingId(selectedReviewApp.id);
                              await onRejectScholarship(selectedReviewApp.id, rejectReason);
                              setRejectingId(null);
                              setRejectReason('');
                              setSelectedReviewApp(null);
                              setProcessingId(null);
                            }}
                            disabled={processingId !== null}
                            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                          >
                            Kirim Penolakan
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-3">
                        <button
                          onClick={() => setRejectingId(selectedReviewApp.id)}
                          disabled={processingId !== null}
                          className="flex-1 bg-white hover:bg-red-50 text-red-600 border-2 border-red-200 hover:border-red-300 font-bold py-2 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <X size={14} />
                          Tolak
                        </button>
                        <button
                          onClick={() => {
                            setConfirmAction({ type: 'scholarship', data: selectedReviewApp });
                          }}
                          disabled={processingId !== null}
                          className="flex-1 bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold py-2 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Check size={14} />
                          Setujui Beasiswa
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Embedded PDF/Document Preview */}
                <div className="lg:col-span-7 border border-slate-200 rounded-2xl overflow-hidden flex flex-col h-full min-h-[300px] bg-slate-50 relative">
                  <div className="absolute top-2 right-2 z-10">
                    <a
                      href={selectedReviewApp.document_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/90 hover:bg-white text-xs font-bold text-[#001e40] px-3 py-1.5 rounded-lg shadow-sm border border-slate-200 flex items-center gap-1 cursor-pointer"
                    >
                      Buka Tab Baru ↗
                    </a>
                  </div>
                  {selectedReviewApp.document_url ? (
                    <iframe
                      src={getEmbeddableUrl(selectedReviewApp.document_url)}
                      title="Dokumen Pendaftaran Beasiswa"
                      className="w-full h-full border-0"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 p-6 text-center">
                      <AlertCircle size={40} className="mb-2 text-slate-300" />
                      <p className="font-bold">Tidak ada dokumen yang diunggah</p>
                      <p className="text-[10px] mt-1 max-w-[200px]">Mahasiswa ini belum mengunggah dokumen pemberkasan.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Custom Confirmation Modal */}
      {confirmAction && createPortal(
        <div className="fixed inset-0 z-[100] flex justify-center items-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-6 animate-scale-in text-center text-slate-800">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 text-emerald-600">
              <Check size={24} />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-sans font-black text-lg text-[#001e40]">
                {confirmAction.type === 'scholarship' && 'Setujui Pengajuan Beasiswa'}
                {confirmAction.type === 'user' && 'Setujui Akun Staf'}
                {confirmAction.type === 'registration' && 'Setujui Registrasi Mahasiswa'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {confirmAction.type === 'scholarship' && 'Apakah Anda yakin ingin menyetujui pengajuan beasiswa untuk mahasiswa berikut?'}
                {confirmAction.type === 'user' && 'Apakah Anda yakin ingin menyetujui akses dan peran staf berikut?'}
                {confirmAction.type === 'registration' && 'Apakah Anda yakin ingin menyetujui registrasi akun mahasiswa baru berikut?'}
              </p>
              
              <div className="bg-[#f8fafc] border border-slate-200/60 rounded-2xl p-4 text-left space-y-3 mt-4">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Nama Lengkap</span>
                  <p className="font-bold text-[#001e40] text-sm mt-0.5">{confirmAction.data.name}</p>
                </div>
                
                {confirmAction.type === 'scholarship' && (
                  <>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">NIM</span>
                      <p className="font-bold text-slate-800 text-xs mt-0.5">{confirmAction.data.nim}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Beasiswa</span>
                      <p className="font-bold text-slate-800 text-xs mt-0.5">{confirmAction.data.scholarship_id}</p>
                    </div>
                  </>
                )}
                
                {confirmAction.type === 'user' && (
                  <>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email</span>
                      <p className="font-bold text-slate-800 text-xs mt-0.5">{confirmAction.data.email}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Peran Staf</span>
                      <p className="font-bold text-slate-800 text-xs mt-0.5 uppercase">{confirmAction.data.role}</p>
                    </div>
                  </>
                )}

                {confirmAction.type === 'registration' && (
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">NIM</span>
                    <p className="font-bold text-slate-800 text-xs mt-0.5">{confirmAction.data.nim}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setConfirmAction(null)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={async () => {
                  const { type, data } = confirmAction;
                  setConfirmAction(null);
                  setProcessingId(data.id);
                  
                  if (type === 'scholarship') {
                    await onApproveScholarship(data.id);
                    setSelectedReviewApp(null);
                  } else if (type === 'user') {
                    await onApproveUser(data.id);
                  } else if (type === 'registration') {
                    await onApproveRegistration(data.id);
                  }
                  
                  setProcessingId(null);
                }}
                className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Setujui
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
