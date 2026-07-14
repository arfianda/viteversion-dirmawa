import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle, XCircle, Eye, Clock, AlertCircle, RefreshCw, Download, FileText, Search, ExternalLink } from 'lucide-react';
import { ScholarshipApplication } from '../../types';
import { SupabaseService } from '../../services/supabaseService';

const getEmbeddableUrl = (url: string) => {
  if (!url) return '';
  
  // Google Drive Links (convert view/open to preview so they allow iframe embedding)
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
  
  // Dropbox Links
  if (url.includes('dropbox.com')) {
    return url.replace('dl=0', 'raw=1');
  }

  return url;
};

interface ModalState {
  type: 'approve' | 'reject' | 'detail' | null;
  application: ScholarshipApplication | null;
}

interface ScholarshipApplicationsQueueProps {
  onRefresh?: () => void;
}

export default function ScholarshipApplicationsQueue({ onRefresh }: ScholarshipApplicationsQueueProps) {
  const [applications, setApplications] = useState<ScholarshipApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [modal, setModal] = useState<ModalState>({ type: null, application: null });
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await SupabaseService.getAdminScholarshipApplications();
      setApplications(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch scholarship applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredApplications = applications.filter((app) => {
    const matchesFilter = activeFilter === 'all' || app.status === activeFilter;
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.nim.includes(searchQuery) ||
                          (app.scholarships?.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusCount = (status: 'pending' | 'approved' | 'rejected') =>
    applications.filter((a) => a.status === status).length;

  const handleApprove = async () => {
    if (!modal.application) return;
    setProcessing(true);
    try {
      await SupabaseService.updateScholarshipApplicationStatus(modal.application.id, 'approved');
      setModal({ type: null, application: null });
      await fetchData();
      if (onRefresh) onRefresh();
    } catch (err: any) {
      setError('Failed to approve: ' + (err.message || 'Unknown error'));
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!modal.application) return;
    setProcessing(true);
    try {
      await SupabaseService.updateScholarshipApplicationStatus(modal.application.id, 'rejected', rejectionReason);
      setModal({ type: null, application: null });
      setRejectionReason('');
      await fetchData();
      if (onRefresh) onRefresh();
    } catch (err: any) {
      setError('Failed to reject: ' + (err.message || 'Unknown error'));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm text-left">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="font-sans font-black text-2xl text-[#001e40] mb-1.5">
              Antrian Pendaftaran Beasiswa
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Tinjau dan setujui permintaan pendaftaran beasiswa mahasiswa.
            </p>
          </div>
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#001e40] hover:bg-[#1f477b] text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Perbarui Antrian
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl font-semibold flex items-center gap-2 text-xs">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
                activeFilter === filter
                  ? 'bg-[#feb234] text-[#001e40] shadow-sm'
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800'
              }`}
            >
              {filter === 'all' && `Semua (${applications.length})`}
              {filter === 'pending' && `Menunggu (${getStatusCount('pending')})`}
              {filter === 'approved' && `Disetujui (${getStatusCount('approved')})`}
              {filter === 'rejected' && `Ditolak (${getStatusCount('rejected')})`}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            type="text"
            placeholder="Cari berdasarkan nama mahasiswa atau NIM..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-sans text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#001e40] focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-xs">
            <RefreshCw className="animate-spin w-8 h-8 text-[#001e40] mx-auto mb-4" />
            Memuat antrian pendaftaran...
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="py-20 text-center text-slate-400 text-xs">
            Tidak ada pendaftaran beasiswa ditemukan.
          </div>
        ) : (
          <div className="overflow-x-auto text-xs text-left">
            <table className="w-full text-left font-sans border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-black text-[10px] uppercase border-b border-slate-200">
                  <th className="px-6 py-4">Informasi Mahasiswa</th>
                  <th className="px-6 py-4">Program Studi</th>
                  <th className="px-6 py-4">Beasiswa Diambil</th>
                  <th className="px-6 py-4">IPK</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 text-slate-700">
                {filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{app.name}</div>
                      <div className="text-[10px] text-slate-400 font-semibold">{app.nim}</div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-500">{app.major}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{app.scholarships?.title || 'Program Beasiswa'}</div>
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">{app.scholarships?.type}</div>
                    </td>
                    <td className="px-6 py-4 font-bold font-mono text-slate-850">{app.gpa.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border uppercase ${
                        app.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          : app.status === 'rejected'
                          ? 'bg-red-50 text-red-700 border-red-100'
                          : 'bg-amber-50 text-amber-700 border-amber-100'
                      }`}>
                        {app.status === 'pending' ? 'MENUNGGU' : app.status === 'approved' ? 'DISETUJUI' : 'DITOLAK'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setModal({ type: 'detail', application: app })}
                          className="p-1.5 bg-slate-50 hover:bg-slate-150 text-slate-650 rounded-lg cursor-pointer"
                          title="Lihat Detail"
                        >
                          <Eye size={14} />
                        </button>
                        {app.status === 'pending' && (
                          <>
                            <button
                              onClick={() => setModal({ type: 'approve', application: app })}
                              className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg cursor-pointer"
                              title="Setujui Pendaftaran"
                            >
                              <CheckCircle size={14} />
                            </button>
                            <button
                              onClick={() => setModal({ type: 'reject', application: app })}
                              className="p-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg cursor-pointer"
                              title="Tolak Pendaftaran"
                            >
                              <XCircle size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail / Action Modals */}
      {modal.type && modal.application && createPortal(
        <div className="fixed inset-0 z-50 flex justify-center items-start overflow-y-auto bg-black/70 backdrop-blur-sm p-4 md:py-10">
          <div className={`bg-white border border-slate-200 w-full rounded-3xl shadow-2xl flex flex-col my-auto transition-all duration-300 ${
            modal.type === 'detail' && modal.application.document_url ? 'max-w-5xl h-[640px] max-h-[90vh]' : 'max-w-md'
          }`}>
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center shrink-0">
              <h3 className="font-sans font-black text-lg text-[#001e40]">
                {modal.type === 'detail' && 'Detail Pendaftaran Beasiswa'}
                {modal.type === 'approve' && 'Setujui Pendaftaran'}
                {modal.type === 'reject' && 'Tolak Pendaftaran'}
              </h3>
              <button
                onClick={() => setModal({ type: null, application: null })}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 text-xs text-slate-800 space-y-4 overflow-y-auto flex-grow">
              
              {modal.type === 'detail' && (
                modal.application.document_url ? (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans">
                    {/* Left: Info */}
                    <div className="lg:col-span-5 space-y-4 text-left">
                      <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-200/40 space-y-3">
                        <h4 className="font-bold text-xs text-[#001e40] uppercase tracking-wider border-b border-slate-250/50 pb-1.5">Informasi Mahasiswa</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase">Nama</span>
                            <p className="font-bold text-slate-900 text-xs mt-0.5 break-words">{modal.application.name}</p>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase">NIM</span>
                            <p className="font-bold text-slate-900 text-xs mt-0.5">{modal.application.nim}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase">Program Studi</span>
                            <p className="font-bold text-slate-900 text-xs mt-0.5 break-words">{modal.application.major}</p>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase">IPK</span>
                            <p className="font-bold text-emerald-700 text-xs mt-0.5 font-mono">{modal.application.gpa.toFixed(2)}</p>
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Nomor WhatsApp</span>
                          <p className="font-bold text-slate-900 text-xs mt-0.5">{modal.application.phone || '-'}</p>
                        </div>
                      </div>

                      <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-200/40 space-y-3">
                        <h4 className="font-bold text-xs text-[#001e40] uppercase tracking-wider border-b border-slate-250/50 pb-1.5">Beasiswa Diambil</h4>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Nama Program</span>
                          <p className="font-bold text-[#001e40] text-xs mt-0.5">{modal.application.scholarships?.title}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Penyelenggara</span>
                          <p className="font-bold text-slate-600 text-xs mt-0.5 uppercase">{modal.application.scholarships?.provider}</p>
                        </div>
                      </div>

                      {modal.application.status === 'rejected' && modal.application.rejection_reason && (
                        <div className="bg-red-50 border border-red-100 p-4 rounded-2xl text-red-800 text-xs">
                          <span className="font-bold block mb-1">Alasan Penolakan:</span>
                          <p className="font-medium">{modal.application.rejection_reason}</p>
                        </div>
                      )}

                      {modal.application.status === 'pending' && (
                        <div className="bg-[#feb234]/10 border border-[#feb234]/20 p-4 rounded-2xl space-y-3">
                          <span className="text-[10px] text-[#815500] font-black uppercase tracking-wider block">Keputusan Cepat</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setModal({ type: 'approve', application: modal.application })}
                              className="flex-grow py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-1 cursor-pointer active:scale-95 text-[11px]"
                            >
                              <CheckCircle size={12} />
                              <span>Setujui</span>
                            </button>
                            <button
                              onClick={() => setModal({ type: 'reject', application: modal.application })}
                              className="flex-grow py-3 bg-red-650 hover:bg-red-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-1 cursor-pointer active:scale-95 text-[11px]"
                            >
                              <XCircle size={12} />
                              <span>Tolak</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right: PDF Document Preview */}
                    <div className="lg:col-span-7 flex flex-col h-[500px] border border-slate-200 rounded-2xl overflow-hidden bg-slate-100">
                      <div className="bg-slate-200/70 border-b border-slate-300 px-4 py-2.5 flex justify-between items-center text-[10px] font-bold text-slate-700">
                        <span className="flex items-center gap-1">
                          <FileText size={12} className="text-slate-500" />
                          PRATINJAU DOKUMEN PERSYARATAN
                        </span>
                        <a 
                          href={modal.application.document_url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-[#001e40] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <ExternalLink size={10} />
                          <span>Buka Tab Baru</span>
                        </a>
                      </div>
                      <iframe
                        src={getEmbeddableUrl(modal.application.document_url)}
                        className="w-full flex-grow border-none"
                        title="PDF Preview"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 font-sans text-left">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-slate-400 font-semibold">Nama Mahasiswa</span>
                        <p className="font-bold text-slate-900 mt-0.5">{modal.application.name}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold">NIM</span>
                        <p className="font-bold text-slate-900 mt-0.5">{modal.application.nim}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-slate-400 font-semibold">Program Studi</span>
                        <p className="font-bold text-slate-900 mt-0.5">{modal.application.major}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold">IPK Dilaporkan</span>
                        <p className="font-bold text-slate-900 mt-0.5 font-mono">{modal.application.gpa.toFixed(2)}</p>
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-400 font-semibold">Nomor WhatsApp</span>
                      <p className="font-bold text-slate-900 mt-0.5">{modal.application.phone || '-'}</p>
                    </div>

                    <div className="border-t border-slate-100 pt-3">
                      <span className="text-slate-400 font-semibold">Beasiswa Diambil</span>
                      <p className="font-bold text-[#001e40] mt-0.5">{modal.application.scholarships?.title}</p>
                      <p className="text-[10px] text-slate-450 font-bold uppercase mt-0.5">{modal.application.scholarships?.provider}</p>
                    </div>

                    {modal.application.status === 'rejected' && modal.application.rejection_reason && (
                      <div className="bg-red-50 border border-red-100 p-3 rounded-xl text-red-800">
                        <span className="font-bold">Alasan Penolakan:</span>
                        <p className="mt-1 font-medium">{modal.application.rejection_reason}</p>
                      </div>
                    )}
                  </div>
                )
              )}

              {modal.type === 'approve' && (
                <div className="space-y-3">
                  <p className="leading-relaxed font-sans font-medium text-slate-650">
                    Apakah Anda yakin ingin menyetujui pendaftaran beasiswa **{modal.application.name}** untuk program **{modal.application.scholarships?.title}**?
                  </p>
                  <p className="text-[10px] text-slate-450 font-bold">
                    Mahasiswa akan menerima notifikasi status kelulusan beasiswa di dashboard portal mahasiswa.
                  </p>
                </div>
              )}

              {modal.type === 'reject' && (
                <div className="space-y-4 font-sans">
                  <p className="leading-relaxed font-medium text-slate-650">
                    Silakan masukkan alasan penolakan pendaftaran beasiswa untuk **{modal.application.name}**:
                  </p>
                  
                  <div className="space-y-1">
                    <label className="text-slate-700 block font-bold">Alasan Penolakan *</label>
                    <textarea
                      required
                      rows={3}
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Masukkan alasan secara detail agar dapat dipahami oleh mahasiswa..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:outline-none focus:border-[#001e40] focus:bg-white text-xs"
                    />
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex justify-end gap-2 rounded-b-3xl shrink-0">
              <button
                onClick={() => setModal({ type: null, application: null })}
                className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl transition cursor-pointer"
                disabled={processing}
              >
                Batal
              </button>
              
              {modal.type === 'approve' && (
                <button
                  onClick={handleApprove}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                  disabled={processing}
                >
                  {processing ? 'Processing...' : 'Ya, Setujui'}
                </button>
              )}

              {modal.type === 'reject' && (
                <button
                  onClick={handleReject}
                  className="px-5 py-2.5 bg-red-650 hover:bg-red-700 text-white font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                  disabled={processing || !rejectionReason.trim()}
                >
                  {processing ? 'Processing...' : 'Ya, Tolak'}
                </button>
              )}

              {modal.type === 'detail' && (
                <button
                  onClick={() => setModal({ type: null, application: null })}
                  className="px-5 py-2.5 bg-[#001e40] hover:bg-[#1f477b] text-white font-bold rounded-xl transition cursor-pointer"
                >
                  Tutup
                </button>
              )}
            </div>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
