import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle, XCircle, Eye, Clock, AlertCircle, RefreshCw, Search, BookOpen, Phone } from 'lucide-react';
import { RegistrationRequest } from '../types';
import { SupabaseService } from '../../services/supabaseService';
import { supabase } from '../../services/supabaseClient';
import { LIST_PRODI_UPB } from '../../constants/prodi';

interface RegistrationQueueProps {
  onRefresh?: () => void;
}

interface ModalState {
  type: 'approve' | 'reject' | 'detail' | null;
  request: RegistrationRequest | null;
}

export default function RegistrationQueue({ onRefresh }: RegistrationQueueProps) {
  const [currentTab, setCurrentTab] = useState<'queue' | 'database'>(() => {
    const saved = sessionStorage.getItem('registration_active_tab');
    if (saved === 'queue' || saved === 'database') {
      sessionStorage.removeItem('registration_active_tab');
      return saved;
    }
    return 'queue';
  });
  const [requests, setRequests] = useState<RegistrationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [modal, setModal] = useState<ModalState>({ type: null, request: null });
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);

  // Active student database states
  const [activeStudents, setActiveStudents] = useState<any[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');
  const [studentProdiFilter, setStudentProdiFilter] = useState('all');

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await SupabaseService.getRegistrationRequests();
      setRequests(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch registration requests');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    setStudentsLoading(true);
    try {
      const data = await SupabaseService.getActiveStudents();
      setActiveStudents(data);
    } catch (err: any) {
      console.error('Failed to fetch active students:', err);
    } finally {
      setStudentsLoading(false);
    }
  };

  const handleRefreshAll = async () => {
    await Promise.all([fetchData(), fetchStudents()]);
    onRefresh?.();
  };

  useEffect(() => {
    fetchData();
    fetchStudents();
  }, []);

  const filteredRequests = requests.filter((r) => {
    if (activeFilter === 'all') return true;
    return r.status === activeFilter;
  });

  const getStatusCount = (status: 'pending' | 'approved' | 'rejected') =>
    requests.filter((r) => r.status === status).length;

  const handleApprove = async () => {
    if (!modal.request) return;
    setProcessing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Admin session not found');
      }
      await SupabaseService.approveRegistrationRequest(modal.request.id, user.id);
      setModal({ type: null, request: null });
      await handleRefreshAll();
    } catch (err: any) {
      setError('Failed to approve: ' + (err.message || 'Unknown error'));
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!modal.request) return;
    setProcessing(true);
    try {
      await SupabaseService.rejectRegistrationRequest(modal.request.id, rejectionReason);
      setModal({ type: null, request: null });
      setRejectionReason('');
      await handleRefreshAll();
    } catch (err: any) {
      setError('Failed to reject: ' + (err.message || 'Unknown error'));
    } finally {
      setProcessing(false);
    }
  };

  const filteredStudents = activeStudents.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      student.nim.toLowerCase().includes(studentSearch.toLowerCase()) ||
      student.email.toLowerCase().includes(studentSearch.toLowerCase());

    const matchesProdi =
      studentProdiFilter === 'all' || student.major === studentProdiFilter;

    return matchesSearch && matchesProdi;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-10 text-left">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="font-sans font-black text-2xl text-[#001e40] mb-1.5">
              {currentTab === 'queue' ? 'Antrian Registrasi Mahasiswa' : 'Database Mahasiswa Aktif'}
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              {currentTab === 'queue'
                ? 'Tinjau dan setujui permintaan registrasi akun mahasiswa baru.'
                : 'Lihat dan filter seluruh data mahasiswa yang telah terdaftar.'}
            </p>
          </div>
          <button
            onClick={handleRefreshAll}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#001e40] hover:bg-[#1f477b] text-white text-xs font-bold rounded-xl transition-all cursor-pointer border-none"
          >
            <RefreshCw className="w-4 h-4" />
            Perbarui
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          onClick={() => setCurrentTab('queue')}
          className={`pb-4 px-2 font-headline font-black text-sm tracking-tight transition-all cursor-pointer relative bg-transparent border-none -mb-px ${
            currentTab === 'queue' ? 'text-[#001e40] border-b-2 border-[#001e40] font-black' : 'text-slate-400 hover:text-slate-650'
          }`}
        >
          Antrian Registrasi
        </button>
        <button
          onClick={() => setCurrentTab('database')}
          className={`pb-4 px-2 font-headline font-black text-sm tracking-tight transition-all cursor-pointer relative bg-transparent border-none -mb-px ${
            currentTab === 'database' ? 'text-[#001e40] border-b-2 border-[#001e40] font-black' : 'text-slate-400 hover:text-slate-650'
          }`}
        >
          Database Mahasiswa
        </button>
      </div>

      {currentTab === 'queue' ? (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Menunggu</p>
                <p className="text-3xl font-black text-[#815500]">{getStatusCount('pending')}</p>
              </div>
              <div className="p-3 bg-amber-100 text-amber-700 rounded-xl">
                <Clock className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Disetujui</p>
                <p className="text-3xl font-black text-emerald-600">{getStatusCount('approved')}</p>
              </div>
              <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Ditolak</p>
                <p className="text-3xl font-black text-red-600">{getStatusCount('rejected')}</p>
              </div>
              <div className="p-3 bg-red-100 text-red-700 rounded-xl">
                <XCircle className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Tab Filters */}
          <div className="flex gap-2 flex-wrap">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border-none ${
                  activeFilter === filter
                    ? 'bg-[#001e40] text-white shadow-sm'
                    : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {filter === 'all' ? 'Semua Permintaan' : filter === 'pending' ? 'Menunggu' : filter === 'approved' ? 'Disetujui' : 'Ditolak'}
                {filter !== 'all' && (
                  <span className="ml-1 bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded-full text-xs font-bold">
                    {getStatusCount(filter as 'pending' | 'approved' | 'rejected')}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-center gap-3 text-sm font-medium">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <div className="flex-1">{error}</div>
              <button
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-700 font-bold text-xs bg-transparent border-none cursor-pointer"
              >
                Tutup
              </button>
            </div>
          )}

          {/* Requests Table */}
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-sans font-black text-lg text-[#001e40]">Permintaan Registrasi</h3>
              <span className="text-xs text-slate-500 font-semibold">
                Menampilkan {filteredRequests.length} dari {requests.length} permintaan
              </span>
            </div>

            {loading ? (
              <div className="p-12 text-center text-slate-400 text-sm font-medium">
                <div className="inline-block w-6 h-6 border-2 border-slate-200 border-t-[#001e40] rounded-full animate-spin mb-2"></div>
                <p>Memuat permintaan registrasi...</p>
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-sm font-bold text-slate-700">
                  {activeFilter === 'all'
                    ? 'Tidak ada permintaan registrasi ditemukan'
                    : `Tidak ada permintaan dengan status ${activeFilter === 'pending' ? 'menunggu' : activeFilter === 'approved' ? 'disetujui' : 'ditolak'} ditemukan`}
                </p>
                <p className="text-xs text-slate-400 mt-1">Periksa kembali nanti untuk pengajuan baru.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-black uppercase tracking-wider border-b border-slate-200 text-[10px]">
                      <th className="px-5 py-3.5">Mahasiswa</th>
                      <th className="px-5 py-3.5">NIM</th>
                      <th className="px-5 py-3.5">Program Studi</th>
                      <th className="px-5 py-3.5">Status</th>
                      <th className="px-5 py-3.5 text-center pr-6">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-4 pl-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#001e40]/5 rounded-full flex items-center justify-center text-[#001e40] font-black">
                              {req.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800 text-sm leading-tight">{req.name}</h4>
                              <p className="text-[10px] text-slate-400 font-semibold">{req.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 font-mono font-bold text-slate-700">{req.nim}</td>
                        <td className="px-5 py-4 font-semibold text-slate-600">{req.major}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            req.status === 'pending'
                              ? 'bg-amber-50 text-amber-700'
                              : req.status === 'approved'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-red-50 text-red-700'
                          }`}>
                            {req.status === 'pending' ? 'Menunggu' : req.status === 'approved' ? 'Disetujui' : 'Ditolak'}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-center pr-6">
                          <div className="flex gap-1.5 justify-center">
                            {req.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => setModal({ type: 'approve', request: req })}
                                  className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border-none rounded-lg transition-colors cursor-pointer"
                                  title="Setujui"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setModal({ type: 'reject', request: req })}
                                  className="p-2 bg-red-50 hover:bg-red-100 text-red-600 border-none rounded-lg transition-colors cursor-pointer"
                                  title="Tolak"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => setModal({ type: 'detail', request: req })}
                              className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 border-none rounded-lg transition-colors cursor-pointer"
                              title="Lihat Detail"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Active Student database view */}
          <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-[#001e40] focus:ring-2 focus:ring-[#001e40]/10 text-slate-800 text-xs rounded-xl pl-9 pr-4 py-3 font-medium outline-none transition-all placeholder:text-slate-400"
                placeholder="Cari mahasiswa berdasarkan nama, NIM, atau email..."
              />
            </div>
            <div className="w-full md:w-64">
              <select
                value={studentProdiFilter}
                onChange={(e) => setStudentProdiFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-[#001e40] focus:ring-2 focus:ring-[#001e40]/10 text-slate-800 text-xs rounded-xl px-4 py-3 font-semibold outline-none transition-all"
              >
                <option value="all">Semua Program Studi</option>
                {LIST_PRODI_UPB.map((prodi) => (
                  <option key={prodi.name} value={prodi.name}>
                    {prodi.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-sans font-black text-lg text-[#001e40]">Daftar Mahasiswa Terdaftar</h3>
              <span className="text-xs text-slate-500 font-semibold">
                Menampilkan {filteredStudents.length} dari {activeStudents.length} mahasiswa
              </span>
            </div>

            {studentsLoading ? (
              <div className="p-12 text-center text-slate-400 text-sm font-medium">
                <div className="inline-block w-6 h-6 border-2 border-slate-200 border-t-[#001e40] rounded-full animate-spin mb-2"></div>
                <p>Memuat database mahasiswa...</p>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-sm font-bold text-slate-700">Tidak ada data mahasiswa ditemukan</p>
                <p className="text-xs text-slate-400 mt-1">Coba periksa kata kunci pencarian atau filter program studi Anda.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-black uppercase tracking-wider border-b border-slate-200 text-[10px]">
                      <th className="px-5 py-3.5 pl-6">Mahasiswa</th>
                      <th className="px-5 py-3.5">NIM</th>
                      <th className="px-5 py-3.5">Program Studi</th>
                      <th className="px-5 py-3.5 text-center">Semester</th>
                      <th className="px-5 py-3.5 pr-6">No. WhatsApp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStudents.map((student) => (
                      <tr key={student.userId} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-4 pl-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#001e40]/5 rounded-full flex items-center justify-center text-[#001e40] font-black uppercase overflow-hidden">
                              {student.avatarUrl ? (
                                <img src={student.avatarUrl} alt={student.name} className="w-full h-full object-cover" />
                              ) : (
                                student.name.slice(0, 2)
                              )}
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800 text-sm leading-tight">{student.name}</h4>
                              <p className="text-[10px] text-slate-400 font-semibold">{student.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 font-mono font-bold text-[#001e40]">{student.nim}</td>
                        <td className="px-5 py-4 font-semibold text-slate-600">{student.major}</td>
                        <td className="px-5 py-4 font-bold text-slate-800 text-center">{student.semester}</td>
                        <td className="px-5 py-4 text-slate-600 font-semibold pr-6">
                          {student.phone ? (
                            <a
                              href={`https://wa.me/${student.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 hover:underline"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              {student.phone}
                            </a>
                          ) : (
                            '-'
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* Approve Modal */}
      {modal.type === 'approve' && modal.request && createPortal(
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-200 animate-scale-up text-left">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-sans font-black text-lg text-[#001e40]">Setujui Registrasi</h3>
                <p className="text-xs text-slate-500">Konfirmasi persetujuan akun mahasiswa</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 mb-6 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Nama</span>
                <span className="font-bold text-slate-800">{modal.request.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">NIM</span>
                <span className="font-bold text-slate-800">{modal.request.nim}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Email</span>
                <span className="font-bold text-slate-800">{modal.request.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Program Studi</span>
                <span className="font-bold text-slate-800">{modal.request.major}</span>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setModal({ type: null, request: null })}
                className="px-5 py-2.5 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleApprove}
                disabled={processing}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {processing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>Setujui Registrasi</>
                )}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Reject Modal */}
      {modal.type === 'reject' && modal.request && createPortal(
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-200 animate-scale-up text-left">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
                <XCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-sans font-black text-lg text-[#001e40]">Tolak Registrasi</h3>
                <p className="text-xs text-slate-500">Berikan alasan penolakan untuk mahasiswa</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-slate-50 rounded-xl p-4 text-xs">
                <div className="flex justify-between mb-1">
                  <span className="text-slate-500 font-semibold">Nama</span>
                  <span className="font-bold text-slate-800">{modal.request.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">NIM</span>
                  <span className="font-bold text-slate-800">{modal.request.nim}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Alasan Penolakan (opsional)
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Contoh: Dokumen tidak lengkap, NIM tidak valid"
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:ring-2 focus:ring-[#001e40]/10 focus:border-[#001e40] outline-none transition-all resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setModal({ type: null, request: null });
                  setRejectionReason('');
                }}
                className="px-5 py-2.5 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleReject}
                disabled={processing}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {processing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>Tolak Registrasi</>
                )}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Detail Modal */}
      {modal.type === 'detail' && modal.request && createPortal(
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl border border-slate-200 animate-scale-up text-left">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 bg-[#001e40] text-[#feb234] rounded-xl flex items-center justify-center font-bold text-sm">
                {modal.request.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-sans font-black text-lg text-[#001e40]">{modal.request.name}</h3>
                <p className="text-xs text-slate-500">{modal.request.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 text-xs">
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-slate-400 font-semibold mb-1">NIM</p>
                <p className="font-bold text-slate-800">{modal.request.nim}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-slate-400 font-semibold mb-1">Program Studi</p>
                <p className="font-bold text-slate-800">{modal.request.major}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-slate-400 font-semibold mb-1">Semester</p>
                <p className="font-bold text-slate-800">{modal.request.semester}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                  modal.request.status === 'pending'
                    ? 'bg-amber-50 text-amber-700 border-amber-100'
                    : modal.request.status === 'approved'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                    : 'bg-red-50 text-red-700 border-red-100'
                }`}
              >
                {modal.request.status === 'pending' && <Clock className="w-3 h-3" />}
                {modal.request.status === 'approved' && <CheckCircle className="w-3 h-3" />}
                {modal.request.status === 'rejected' && <XCircle className="w-3 h-3" />}
                {modal.request.status === 'pending' ? 'Menunggu' : modal.request.status === 'approved' ? 'Disetujui' : 'Ditolak'}
              </span>
              <span className="text-xs text-slate-400">
                Diajukan pada{' '}
                {new Date(modal.request.created_at).toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setModal({ type: null, request: null })}
                className="px-5 py-2.5 bg-[#001e40] hover:bg-[#1f477b] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
