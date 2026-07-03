import React, { useState, useEffect } from 'react';
import { 
  Check, 
  X, 
  Download, 
  FileText, 
  HelpCircle,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  AlertCircle
} from 'lucide-react';
import { OrmawaService, OrmawaApplication } from '../../services/ormawaService';

interface OrmawaApplicationsQueueProps {
  reviewerId: string;
  onRefresh?: () => void;
}

export default function OrmawaApplicationsQueue({ reviewerId, onRefresh }: OrmawaApplicationsQueueProps) {
  const [applications, setApplications] = useState<OrmawaApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Selection
  const [selectedApp, setSelectedApp] = useState<OrmawaApplication | null>(null);
  
  // Review inputs
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchApps = async () => {
    setIsLoading(true);
    try {
      const data = await OrmawaService.getApplications();
      setApplications(data);
    } catch (e) {
      console.error('Failed to load applications:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleApprove = async (app: OrmawaApplication) => {
    if (!confirm(`Apakah Anda yakin ingin menyetujui pendirian organisasi "${app.name}"? Ini akan secara otomatis membuat UKM di direktori dan membuat akun admin khusus.`)) return;
    
    setIsProcessing(true);
    try {
      await OrmawaService.reviewApplication(app.id, 'approved', undefined, reviewerId);
      alert(`Ormawa "${app.name}" disetujui! Akun admin khusus telah digenerate.`);
      setSelectedApp(null);
      await fetchApps();
      if (onRefresh) onRefresh();
    } catch (e: any) {
      console.error(e);
      alert('Gagal menyetujui pengajuan: ' + e.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp || !rejectionReason.trim()) return;

    setIsProcessing(true);
    try {
      await OrmawaService.reviewApplication(selectedApp.id, 'rejected', rejectionReason, reviewerId);
      alert(`Pengajuan ormawa "${selectedApp.name}" ditolak dengan catatan.`);
      setSelectedApp(null);
      setRejectionReason('');
      setShowRejectForm(false);
      await fetchApps();
      if (onRefresh) onRefresh();
    } catch (e: any) {
      console.error(e);
      alert('Gagal menolak pengajuan: ' + e.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status: OrmawaApplication['status']) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 bg-green-50 border border-green-200 text-green-700 px-2.5 py-1 rounded-full text-xs font-bold">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Disetujui</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 bg-red-50 border border-red-200 text-red-700 px-2.5 py-1 rounded-full text-xs font-bold">
            <XCircle className="w-3.5 h-3.5" />
            <span>Ditolak</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 px-2.5 py-1 rounded-full text-xs font-bold">
            <Clock className="w-3.5 h-3.5" />
            <span>Pending</span>
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400 font-sans font-bold">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-[#001e40] rounded-full animate-spin"></div>
        <span>Memuat antrian pengajuan...</span>
      </div>
    );
  }

  const pendingApps = applications.filter(a => a.status === 'pending');
  const pastApps = applications.filter(a => a.status !== 'pending');

  return (
    <div className="space-y-6 font-sans text-xs text-slate-700">
      
      {/* Pending Applications Grid */}
      <section className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <h4 className="font-sans font-black text-xs uppercase tracking-wider text-[#001e40]">Antrian Pengajuan Pending ({pendingApps.length})</h4>
          </div>
        </div>

        {pendingApps.length === 0 ? (
          <div className="py-12 text-center text-slate-400 font-bold text-xs">
            Tidak ada pengajuan ormawa baru yang perlu ditinjau.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {pendingApps.map((app) => (
              <div key={app.id} className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-slate-50/50 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h5 className="font-black text-sm text-[#001e40]">{app.name}</h5>
                    <span className="bg-[#001e40]/5 text-[#001e40] px-2 py-0.5 rounded text-[10px] font-bold capitalize">{app.category}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold">
                    Pengusul: <strong className="text-slate-650 font-black">{app.leader_name}</strong> (NIM: {app.leader_nim}) | Diajukan: {new Date(app.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                  <p className="text-[10px] text-slate-500 max-w-xl truncate">{app.description}</p>
                </div>
                
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => setSelectedApp(app)}
                    className="bg-slate-100 hover:bg-[#feb234] text-slate-700 hover:text-[#001e40] px-3.5 py-2 rounded-xl transition cursor-pointer font-bold flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Detail</span>
                  </button>
                  <button
                    onClick={() => handleApprove(app)}
                    disabled={isProcessing}
                    className="bg-green-600 hover:bg-green-700 text-white px-3.5 py-2 rounded-xl transition cursor-pointer font-bold flex items-center gap-1 disabled:opacity-50"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Setujui</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* History review section */}
      <section className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <h4 className="font-sans font-black text-xs uppercase tracking-wider text-[#001e40]">Riwayat Keputusan Tinjauan</h4>
        </div>

        {pastApps.length === 0 ? (
          <div className="py-8 text-center text-slate-400 font-bold text-xs">
            Belum ada riwayat peninjauan ormawa.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
            {pastApps.map((app) => (
              <div key={app.id} className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs font-medium">
                <div className="space-y-1">
                  <h5 className="font-bold text-slate-800">{app.name}</h5>
                  <p className="text-[10px] text-slate-400 font-bold">
                    Ketua: {app.leader_name} ({app.leader_nim}) | Diproses: {new Date(app.reviewed_at || app.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                  {app.status === 'rejected' && app.rejection_reason && (
                    <p className="text-[10px] text-red-650 bg-red-50 p-2 rounded-lg leading-relaxed mt-1">
                      Catatan Penolakan: {app.rejection_reason}
                    </p>
                  )}
                </div>
                <div className="shrink-0">{getStatusBadge(app.status)}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Detail Modal Overlay */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl animate-fade-in text-xs text-slate-700">
            <div className="bg-[#001e40] p-5 text-white flex justify-between items-center border-b border-[#002d61]">
              <div>
                <h3 className="font-sans font-black text-sm uppercase tracking-wider">Detail Pengajuan Ormawa</h3>
                <p className="text-[10px] text-slate-300 mt-1">NIM Pengaju: {selectedApp.leader_nim} | {selectedApp.applicant_email}</p>
              </div>
              <button 
                onClick={() => { setSelectedApp(null); setShowRejectForm(false); }}
                className="text-white hover:text-[#feb234] font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-0.5">
                  <span className="text-slate-400 font-extrabold text-[9px] uppercase tracking-wider">Nama Calon Ormawa</span>
                  <p className="font-black text-sm text-[#001e40]">{selectedApp.name}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-slate-400 font-extrabold text-[9px] uppercase tracking-wider">Kategori Kegiatan</span>
                  <div>
                    <span className="bg-[#feb234]/15 px-2 py-0.5 rounded text-[#734e00] font-black uppercase text-[10px]">
                      {selectedApp.category}
                    </span>
                  </div>
                </div>
                <div className="space-y-0.5">
                  <span className="text-slate-400 font-extrabold text-[9px] uppercase tracking-wider">Calon Ketua Umum</span>
                  <p className="font-bold text-slate-800">{selectedApp.leader_name} ({selectedApp.leader_nim})</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-slate-400 font-extrabold text-[9px] uppercase tracking-wider">Tanggal Mengajukan</span>
                  <p className="font-bold text-slate-700">{new Date(selectedApp.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                </div>
              </div>

              <div className="space-y-1 bg-slate-50 p-4 border border-slate-200/60 rounded-xl">
                <span className="text-slate-400 font-extrabold text-[9px] uppercase tracking-wider">Latar Belakang &amp; Deskripsi</span>
                <p className="font-medium text-slate-655 leading-relaxed">{selectedApp.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1 bg-slate-50 p-4 border border-slate-200/60 rounded-xl">
                  <span className="text-slate-400 font-extrabold text-[9px] uppercase tracking-wider">Visi</span>
                  <p className="font-bold text-[#001e40] italic">"{selectedApp.vision}"</p>
                </div>
                <div className="space-y-1 bg-slate-50 p-4 border border-slate-200/60 rounded-xl">
                  <span className="text-slate-400 font-extrabold text-[9px] uppercase tracking-wider">Misi Organisasi</span>
                  <ul className="list-decimal pl-4 space-y-1 font-medium text-slate-600 mt-1">
                    {selectedApp.mission.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Document attachment links for review */}
              <div className="space-y-2.5 border-t border-slate-100 pt-4">
                <span className="text-slate-400 font-extrabold text-[9px] uppercase tracking-wider">Unduh Dokumen Kelengkapan Pengajuan</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {selectedApp.proposal_format_url && (
                    <a 
                      href={selectedApp.proposal_format_url} 
                      className="flex justify-between items-center bg-slate-50 hover:bg-slate-100 p-2.5 border border-slate-200 rounded-lg text-slate-750 font-bold transition-all"
                    >
                      <span className="truncate pr-1">1. Proposal Pendirian</span>
                      <Download className="w-3.5 h-3.5 text-[#001e40] shrink-0" />
                    </a>
                  )}
                  {selectedApp.ukm_request_url && (
                    <a 
                      href={selectedApp.ukm_request_url} 
                      className="flex justify-between items-center bg-slate-50 hover:bg-slate-100 p-2.5 border border-slate-200 rounded-lg text-slate-750 font-bold transition-all"
                    >
                      <span className="truncate pr-1">2. Permohonan UKM</span>
                      <Download className="w-3.5 h-3.5 text-[#001e40] shrink-0" />
                    </a>
                  )}
                  {selectedApp.quality_procedure_url && (
                    <a 
                      href={selectedApp.quality_procedure_url} 
                      className="flex justify-between items-center bg-slate-50 hover:bg-slate-100 p-2.5 border border-slate-200 rounded-lg text-slate-750 font-bold transition-all"
                    >
                      <span className="truncate pr-1">3. Prosedur Mutu</span>
                      <Download className="w-3.5 h-3.5 text-[#001e40] shrink-0" />
                    </a>
                  )}
                </div>
              </div>

              {/* Decision Section */}
              {!showRejectForm ? (
                selectedApp.status === 'pending' && (
                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => setShowRejectForm(true)}
                      className="px-5 py-2.5 border border-red-200 hover:bg-red-50 text-red-650 rounded-xl font-bold transition cursor-pointer"
                    >
                      Tolak Pengajuan
                    </button>
                    <button
                      onClick={() => handleApprove(selectedApp)}
                      disabled={isProcessing}
                      className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition cursor-pointer"
                    >
                      Setujui Pendirian
                    </button>
                  </div>
                )
              ) : (
                <form onSubmit={handleReject} className="space-y-3 pt-4 border-t border-slate-100">
                  <div className="space-y-1.5">
                    <label className="font-bold text-red-750 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>Alasan Penolakan (Catatan Revisi)</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Masukkan alasan penolakan berkas atau instruksi perbaikan..."
                      className="w-full bg-slate-50 border border-red-200 focus:border-red-500 rounded-xl px-4 py-2.5 outline-none font-medium text-red-950"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowRejectForm(false)}
                      className="px-4 py-2 text-slate-500 font-bold hover:text-slate-800 cursor-pointer"
                    >
                      Kembali
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="px-5 py-2 bg-red-600 hover:bg-red-750 text-white rounded-xl font-bold transition cursor-pointer"
                    >
                      Kirim Tolak
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
