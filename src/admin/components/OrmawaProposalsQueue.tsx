import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  FileCheck2, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Download, 
  Eye, 
  AlertTriangle,
  Play,
  RotateCcw,
  DollarSign
} from 'lucide-react';
import { OrmawaService, OrmawaProposal, OrmawaLpj } from '../../services/ormawaService';

const formatRupiah = (num: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
};

interface OrmawaProposalsQueueProps {
  onRefresh?: () => void;
}

export default function OrmawaProposalsQueue({ onRefresh }: OrmawaProposalsQueueProps) {
  const [activeSubTab, setActiveSubTab] = useState<'proposals' | 'lpjs'>('proposals');
  const [proposals, setProposals] = useState<OrmawaProposal[]>([]);
  const [lpjs, setLpjs] = useState<OrmawaLpj[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Selection
  const [selectedProposal, setSelectedProposal] = useState<OrmawaProposal | null>(null);
  const [selectedLpj, setSelectedLpj] = useState<OrmawaLpj | null>(null);

  // Catatan penolakan
  const [rejectionNotes, setRejectionNotes] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [pList, lList] = await Promise.all([
        OrmawaService.getProposals(),
        OrmawaService.getLpjs()
      ]);
      setProposals(pList);
      setLpjs(lList);
    } catch (e) {
      console.error('Failed to load proposals/LPJs:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getNextStepInfo = (proposal: OrmawaProposal) => {
    if (proposal.flow_type === 'ukm') {
      switch (proposal.status) {
        case 'submitted_dirmawa':
          return { nextStatus: 'approved_dirmawa_staff', nextHolder: 'dirmawa_direktur', btnLabel: 'Setujui Tinjauan Staff (Teruskan ke Direktur)' };
        case 'approved_dirmawa_staff':
          return { nextStatus: 'approved_dirmawa_direktur', nextHolder: 'dau', btnLabel: 'Setujui (Sebagai Direktur, Teruskan ke DAU)' };
        case 'approved_dirmawa_direktur':
          return { nextStatus: 'approved_dau', nextHolder: 'rektorat', btnLabel: 'Setujui Anggaran (Sebagai Staff DAU & Direktur Umum)' };
        case 'approved_dau':
          return { nextStatus: 'approved_rektorat', nextHolder: 'ormawa', btnLabel: 'Setujui Final (Sebagai Rektorat, Arahkan Upload Scan)' };
        case 'approved_rektorat':
          return null; // Ormawa must upload signed scan
        case 'scan_uploaded':
          return { nextStatus: 'completed', nextHolder: 'completed', btnLabel: 'Proses Cairkan Dana (Sebagai Kasir Keuangan - Selesai)' };
        default:
          return null;
      }
    } else {
      // HIMA / BEM flow
      switch (proposal.status) {
        case 'submitted_dirmawa':
          return { nextStatus: 'approved_prodi', nextHolder: 'dekanat', btnLabel: 'Setujui (Sebagai Kaprodi, Teruskan ke Dekanat)' };
        case 'approved_prodi':
          return { nextStatus: 'approved_dekanat', nextHolder: 'dau', btnLabel: 'Setujui (Sebagai Dekan, Teruskan ke DAU)' };
        case 'approved_dekanat':
          return { nextStatus: 'approved_dau', nextHolder: 'ormawa', btnLabel: 'Setujui Anggaran (Sebagai Staff DAU, Arahkan Upload Scan)' };
        case 'approved_dau':
          return null; // Ormawa must upload signed scan
        case 'scan_uploaded':
          return { nextStatus: 'completed', nextHolder: 'completed', btnLabel: 'Proses Cairkan Dana (Sebagai Kasir Keuangan - Selesai)' };
        default:
          return null;
      }
    }
  };

  const getLpjNextStepInfo = (lpj: OrmawaLpj) => {
    if (lpj.flow_type === 'ukm') {
      switch (lpj.status) {
        case 'submitted_dirmawa':
          return { nextStatus: 'approved_dirmawa_staff', nextHolder: 'dirmawa_direktur', btnLabel: 'Setujui Tinjauan (Teruskan ke Direktur)' };
        case 'approved_dirmawa_staff':
          return { nextStatus: 'approved_dirmawa_direktur', nextHolder: 'rektorat', btnLabel: 'Setujui (Sebagai Direktur, Teruskan ke Rektorat)' };
        case 'approved_dirmawa_direktur':
          return { nextStatus: 'approved_rektorat', nextHolder: 'ormawa', btnLabel: 'Setujui LPJ (Sebagai Rektorat, Arahkan Upload Scan)' };
        case 'approved_rektorat':
          return null; // Ormawa must upload scan of signed LPJ
        case 'scan_uploaded':
          return { nextStatus: 'completed', nextHolder: 'dirmawa_staff', btnLabel: 'Verifikasi Scan & Diarsipkan (Selesai)' };
        default:
          return null;
      }
    } else {
      // HIMA / BEM LPJ flow
      switch (lpj.status) {
        case 'submitted_dirmawa':
          return { nextStatus: 'approved_prodi', nextHolder: 'dekanat', btnLabel: 'Setujui (Sebagai Kaprodi, Teruskan ke Dekanat)' };
        case 'approved_prodi':
          return { nextStatus: 'approved_dekanat', nextHolder: 'ormawa', btnLabel: 'Setujui (Sebagai Dekan, Arahkan Upload Scan)' };
        case 'approved_dekanat':
          return null; // Ormawa must upload scan
        case 'scan_uploaded':
          return { nextStatus: 'completed', nextHolder: 'dirmawa_staff', btnLabel: 'Verifikasi Scan & Diarsipkan (Selesai)' };
        default:
          return null;
      }
    }
  };

  const handleAdvanceProposal = async (proposal: OrmawaProposal) => {
    const nextStep = getNextStepInfo(proposal);
    if (!nextStep) return;

    setIsProcessing(true);
    try {
      await OrmawaService.updateProposalStatus(proposal.id, nextStep.nextStatus as any, nextStep.nextHolder as any);
      alert(`Proposal berhasil dilanjutkan ke tahapan: ${nextStep.nextStatus}`);
      setSelectedProposal(null);
      await fetchData();
      if (onRefresh) onRefresh();
    } catch (e: any) {
      console.error(e);
      alert('Gagal memproses proposal: ' + e.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProposal || !rejectionNotes.trim()) return;

    setIsProcessing(true);
    try {
      await OrmawaService.updateProposalStatus(selectedProposal.id, 'rejected', 'ormawa', rejectionNotes);
      alert('Proposal ditolak dan dikembalikan ke Ormawa.');
      setSelectedProposal(null);
      setRejectionNotes('');
      setShowRejectForm(false);
      await fetchData();
      if (onRefresh) onRefresh();
    } catch (e: any) {
      console.error(e);
      alert('Gagal menolak proposal: ' + e.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAdvanceLpj = async (lpj: OrmawaLpj) => {
    const nextStep = getLpjNextStepInfo(lpj);
    if (!nextStep) return;

    setIsProcessing(true);
    try {
      await OrmawaService.updateLpjStatus(lpj.id, nextStep.nextStatus as any, nextStep.nextHolder as any);
      alert(`LPJ berhasil dilanjutkan ke tahapan: ${nextStep.nextStatus}`);
      setSelectedLpj(null);
      await fetchData();
      if (onRefresh) onRefresh();
    } catch (e: any) {
      console.error(e);
      alert('Gagal memproses LPJ: ' + e.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectLpj = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLpj || !rejectionNotes.trim()) return;

    setIsProcessing(true);
    try {
      await OrmawaService.updateLpjStatus(selectedLpj.id, 'rejected', 'ormawa', rejectionNotes);
      alert('Laporan LPJ ditolak dengan catatan revisi.');
      setSelectedLpj(null);
      setRejectionNotes('');
      setShowRejectForm(false);
      await fetchData();
      if (onRefresh) onRefresh();
    } catch (e: any) {
      console.error(e);
      alert('Gagal menolak LPJ: ' + e.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'Draft';
      case 'submitted_dirmawa': return 'Menunggu Tinjauan Staff';
      case 'approved_dirmawa_staff': return 'Menunggu Tinjauan Direktur';
      case 'approved_dirmawa_direktur': return 'Menunggu Anggaran DAU';
      case 'approved_prodi': return 'Menunggu Dekan';
      case 'approved_dekanat': return 'Menunggu Anggaran DAU';
      case 'approved_dau': return 'Menunggu Rektorat';
      case 'approved_rektorat': return 'Awaiting Upload Scan';
      case 'scan_uploaded': return 'Menunggu Pencairan Dana';
      case 'completed': return 'Selesai / Dana Cair';
      case 'rejected': return 'Ditolak';
      default: return status;
    }
  };

  const getStatusColorClass = (status: string) => {
    if (status === 'completed') return 'bg-green-50 border-green-200 text-green-700';
    if (status === 'rejected') return 'bg-red-50 border-red-200 text-red-700';
    return 'bg-amber-50 border-amber-200 text-amber-700';
  };

  return (
    <div className="space-y-6 font-sans text-xs text-slate-700">
      
      {/* Sub Tabs Selection */}
      <div className="flex border-b border-slate-200 font-sans">
        <button
          onClick={() => { setActiveSubTab('proposals'); setSelectedProposal(null); setSelectedLpj(null); }}
          className={`px-5 py-3 font-black text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'proposals' 
              ? 'border-[#001e40] text-[#001e40]' 
              : 'border-transparent text-slate-450 hover:text-slate-700'
          }`}
        >
          Proposal Kegiatan ({proposals.filter(p => p.status !== 'completed' && p.status !== 'rejected').length})
        </button>
        <button
          onClick={() => { setActiveSubTab('lpjs'); setSelectedProposal(null); setSelectedLpj(null); }}
          className={`px-5 py-3 font-black text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'lpjs' 
              ? 'border-[#001e40] text-[#001e40]' 
              : 'border-transparent text-slate-450 hover:text-slate-700'
          }`}
        >
          Laporan LPJ ({lpjs.filter(l => l.status !== 'completed' && l.status !== 'rejected').length})
        </button>
      </div>

      {/* RENDER PROPOSALS QUEUE */}
      {activeSubTab === 'proposals' && (
        <section className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h4 className="font-sans font-black text-xs uppercase tracking-wider text-[#001e40]">Antrian Proposal Ormawa</h4>
          </div>

          {proposals.length === 0 ? (
            <div className="py-12 text-center text-slate-400 font-bold text-xs">
              Belum ada pengajuan proposal kegiatan.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {proposals.map((prop) => (
                <div key={prop.id} className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h5 className="font-black text-sm text-[#001e40]">{prop.title}</h5>
                      <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[9px] font-bold uppercase">{prop.ukm_name || 'Ormawa'}</span>
                    </div>
                    <p className="text-[10px] text-slate-450 font-bold">
                      Anggaran: <strong className="text-slate-700 font-black">{formatRupiah(Number(prop.target_budget))}</strong> | Tipe Alur: {prop.flow_type.toUpperCase()} | Diajukan: {new Date(prop.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                    <div className="inline-flex gap-2 items-center pt-0.5">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${getStatusColorClass(prop.status)}`}>
                        {getStatusLabel(prop.status)}
                      </span>
                      <span className="text-[9px] text-slate-400 font-medium">Aksi Sekarang Di: <strong className="text-slate-500">{prop.current_step_holder.replace('_', ' ').toUpperCase()}</strong></span>
                    </div>
                  </div>

                  <button
                    onClick={() => { setSelectedProposal(prop); setShowRejectForm(false); }}
                    className="bg-slate-100 hover:bg-[#feb234] text-slate-700 hover:text-[#001e40] px-4 py-2.5 rounded-xl transition cursor-pointer font-bold shrink-0 flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Detail &amp; Proses</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* RENDER LPJS QUEUE */}
      {activeSubTab === 'lpjs' && (
        <section className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h4 className="font-sans font-black text-xs uppercase tracking-wider text-[#001e40]">Antrian Laporan Pertanggungjawaban (LPJ)</h4>
          </div>

          {lpjs.length === 0 ? (
            <div className="py-12 text-center text-slate-400 font-bold text-xs">
              Belum ada laporan LPJ masuk.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {lpjs.map((lpj) => (
                <div key={lpj.id} className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h5 className="font-black text-sm text-[#001e40]">{lpj.title}</h5>
                      <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-[9px] font-bold uppercase">{lpj.ukm_name || 'Ormawa'}</span>
                    </div>
                    <p className="text-[10px] text-slate-450 font-bold">
                      Realisasi Anggaran: <strong className="text-slate-700 font-black">{formatRupiah(Number(lpj.total_spent))}</strong> | Diajukan: {new Date(lpj.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                    <div className="inline-flex gap-2 items-center pt-0.5">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${getStatusColorClass(lpj.status)}`}>
                        {getStatusLabel(lpj.status)}
                      </span>
                      <span className="text-[9px] text-slate-400 font-medium">Aksi Sekarang Di: <strong className="text-slate-500">{lpj.current_step_holder.replace('_', ' ').toUpperCase()}</strong></span>
                    </div>
                  </div>

                  <button
                    onClick={() => { setSelectedLpj(lpj); setShowRejectForm(false); }}
                    className="bg-slate-100 hover:bg-[#feb234] text-slate-700 hover:text-[#001e40] px-4 py-2.5 rounded-xl transition cursor-pointer font-bold shrink-0 flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Detail &amp; Tinjau</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* DETAIL MODAL PROPOSAL */}
      {selectedProposal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-fade-in text-xs text-slate-700">
            <div className="bg-[#001e40] p-5 text-white flex justify-between items-center border-b border-[#002d61]">
              <div>
                <h3 className="font-sans font-black text-sm uppercase tracking-wider">Review Proposal: {selectedProposal.ukm_name}</h3>
                <p className="text-[10px] text-slate-300 mt-1">Diajukan Pada: {new Date(selectedProposal.created_at).toLocaleString()}</p>
              </div>
              <button 
                onClick={() => { setSelectedProposal(null); setShowRejectForm(false); }}
                className="text-white hover:text-[#feb234] font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-0.5">
                  <span className="text-slate-400 font-extrabold text-[9px] uppercase tracking-wider">Judul Proposal</span>
                  <p className="font-black text-sm text-[#001e40]">{selectedProposal.title}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-slate-400 font-extrabold text-[9px] uppercase tracking-wider">Status Tinjauan</span>
                  <div>
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black border uppercase ${getStatusColorClass(selectedProposal.status)}`}>
                      {getStatusLabel(selectedProposal.status)}
                    </span>
                  </div>
                </div>
                <div className="space-y-0.5">
                  <span className="text-slate-400 font-extrabold text-[9px] uppercase tracking-wider">Target Anggaran</span>
                  <p className="font-black text-sm text-slate-800">{formatRupiah(Number(selectedProposal.target_budget))}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-slate-400 font-extrabold text-[9px] uppercase tracking-wider">Tipe Alur Prosedur</span>
                  <p className="font-black text-sm text-slate-600 uppercase">{selectedProposal.flow_type}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 border border-slate-200/60 rounded-xl space-y-1">
                <span className="text-slate-400 font-extrabold text-[9px] uppercase tracking-wider">Deskripsi Singkat</span>
                <p className="font-medium text-slate-655 leading-relaxed">{selectedProposal.description}</p>
              </div>

              {/* Document download grid */}
              <div className="space-y-2 border-t border-slate-100 pt-4">
                <span className="text-slate-400 font-extrabold text-[9px] uppercase tracking-wider">Unduh Berkas Lampiran Awal</span>
                <div className="grid grid-cols-2 gap-3">
                  <a href={selectedProposal.proposal_doc_url} className="flex justify-between items-center bg-slate-50 hover:bg-slate-100 p-2.5 border border-slate-200 rounded-lg text-slate-750 font-bold transition-all">
                    <span>1. Dokumen Proposal Utama</span>
                    <Download className="w-3.5 h-3.5 text-[#001e40]" />
                  </a>
                  {selectedProposal.cover_letter_url && (
                    <a href={selectedProposal.cover_letter_url} className="flex justify-between items-center bg-slate-50 hover:bg-slate-100 p-2.5 border border-slate-200 rounded-lg text-slate-750 font-bold transition-all">
                      <span>2. Surat Pengantar</span>
                      <Download className="w-3.5 h-3.5 text-[#001e40]" />
                    </a>
                  )}
                </div>
              </div>

              {selectedProposal.signed_proposal_url && (
                <div className="bg-green-50/20 border border-green-200 p-4 rounded-xl space-y-2 mt-2">
                  <span className="text-green-800 font-black uppercase text-[9px] tracking-wide block">Scan Berkas Tanda Tangan (Selesai Disetujui Rektorat)</span>
                  <a href={selectedProposal.signed_proposal_url} className="flex justify-between items-center bg-white hover:bg-slate-50 p-2.5 border border-green-200 rounded-lg text-green-900 font-bold">
                    <span>Scan Proposal Disetujui Rektorat.pdf</span>
                    <Download className="w-4 h-4 text-green-700" />
                  </a>
                </div>
              )}

              {/* PROCESS STEP ACTIONS */}
              {!showRejectForm ? (
                selectedProposal.status !== 'completed' && selectedProposal.status !== 'rejected' && (
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-5 border-t border-slate-100">
                    <div className="text-left text-slate-400 leading-tight">
                      <span className="font-extrabold text-[8px] uppercase tracking-wider">Status Saat Ini</span>
                      <p className="font-bold text-slate-500">{getStatusLabel(selectedProposal.status)}</p>
                    </div>

                    <div className="flex gap-2 font-sans w-full sm:w-auto justify-end">
                      <button
                        onClick={() => setShowRejectForm(true)}
                        className="px-4 py-2.5 border border-red-200 hover:bg-red-50 text-red-650 rounded-xl font-bold cursor-pointer shrink-0"
                      >
                        Tolak &amp; Kembalikan
                      </button>

                      {getNextStepInfo(selectedProposal) ? (
                        <button
                          onClick={() => handleAdvanceProposal(selectedProposal)}
                          disabled={isProcessing}
                          className="bg-[#001e40] hover:bg-[#feb234] text-white hover:text-[#001e40] px-5 py-2.5 rounded-xl font-sans font-black transition cursor-pointer flex items-center gap-1.5"
                        >
                          <Play className="w-4 h-4" />
                          <span>{getNextStepInfo(selectedProposal)?.btnLabel}</span>
                        </button>
                      ) : (
                        <span className="bg-amber-50 border border-amber-200 text-amber-700 px-3 py-2 rounded-xl font-bold flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Menunggu Mahasiswa Upload Scan</span>
                        </span>
                      )}
                    </div>
                  </div>
                )
              ) : (
                <form onSubmit={handleRejectProposal} className="space-y-3 pt-4 border-t border-slate-100">
                  <div className="space-y-1.5">
                    <label className="font-bold text-red-750 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Alasan Penolakan / Catatan Perbaikan</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={rejectionNotes}
                      onChange={(e) => setRejectionNotes(e.target.value)}
                      placeholder="Tuliskan saran perbaikan untuk diajukan ulang oleh Ormawa..."
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
                      className="px-5 py-2 bg-red-600 hover:bg-red-755 text-white rounded-xl font-bold transition cursor-pointer"
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

      {/* DETAIL MODAL LPJ */}
      {selectedLpj && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-fade-in text-xs text-slate-700">
            <div className="bg-purple-650 p-5 text-white flex justify-between items-center border-b border-purple-700">
              <div>
                <h3 className="font-sans font-black text-sm uppercase tracking-wider">Review LPJ: {selectedLpj.ukm_name}</h3>
                <p className="text-[10px] text-slate-300 mt-1">Diajukan Pada: {new Date(selectedLpj.created_at).toLocaleString()}</p>
              </div>
              <button 
                onClick={() => { setSelectedLpj(null); setShowRejectForm(false); }}
                className="text-white hover:text-[#feb234] font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-0.5">
                  <span className="text-slate-400 font-extrabold text-[9px] uppercase tracking-wider">Judul LPJ</span>
                  <p className="font-black text-sm text-[#001e40]">{selectedLpj.title}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-slate-400 font-extrabold text-[9px] uppercase tracking-wider">Status Laporan</span>
                  <div>
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black border uppercase ${
                      selectedLpj.status === 'completed' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-amber-50 border-amber-200 text-amber-700'
                    }`}>
                      {getStatusLabel(selectedLpj.status)}
                    </span>
                  </div>
                </div>
                <div className="space-y-0.5">
                  <span className="text-slate-400 font-extrabold text-[9px] uppercase tracking-wider">Realisasi Anggaran</span>
                  <p className="font-black text-sm text-slate-800">{formatRupiah(Number(selectedLpj.total_spent))}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-slate-400 font-extrabold text-[9px] uppercase tracking-wider">Tipe Alur Prosedur</span>
                  <p className="font-black text-sm text-slate-600 uppercase">{selectedLpj.flow_type}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 border border-slate-200/60 rounded-xl space-y-1">
                <span className="text-slate-400 font-extrabold text-[9px] uppercase tracking-wider">Evaluasi Laporan</span>
                <p className="font-medium text-slate-655 leading-relaxed">{selectedLpj.description}</p>
              </div>

              {/* Document download grid */}
              <div className="space-y-2 border-t border-slate-100 pt-4">
                <span className="text-slate-400 font-extrabold text-[9px] uppercase tracking-wider">Unduh Berkas LPJ Awal</span>
                <div className="grid grid-cols-2 gap-3">
                  <a href={selectedLpj.lpj_doc_url} className="flex justify-between items-center bg-slate-50 hover:bg-slate-100 p-2.5 border border-slate-200 rounded-lg text-slate-750 font-bold transition-all">
                    <span>Dokumen LPJ Utama</span>
                    <Download className="w-3.5 h-3.5 text-[#001e40]" />
                  </a>
                  {selectedLpj.receipts_zip_url && (
                    <a href={selectedLpj.receipts_zip_url} className="flex justify-between items-center bg-slate-50 hover:bg-slate-100 p-2.5 border border-slate-200 rounded-lg text-slate-750 font-bold transition-all">
                      <span>Kwitansi Nota ZIP</span>
                      <Download className="w-3.5 h-3.5 text-[#001e40]" />
                    </a>
                  )}
                </div>
              </div>

              {selectedLpj.signed_lpj_url && (
                <div className="bg-green-50/20 border border-green-200 p-4 rounded-xl space-y-2 mt-2">
                  <span className="text-green-800 font-black uppercase text-[9px] tracking-wide block">Scan Berkas LPJ Bertanda Tangan Basah</span>
                  <a href={selectedLpj.signed_lpj_url} className="flex justify-between items-center bg-white hover:bg-slate-50 p-2.5 border border-green-200 rounded-lg text-green-900 font-bold">
                    <span>Scan LPJ Disetujui.pdf</span>
                    <Download className="w-4 h-4 text-green-700" />
                  </a>
                </div>
              )}

              {/* PROCESS STEP ACTIONS FOR LPJ */}
              {!showRejectForm ? (
                selectedLpj.status !== 'completed' && selectedLpj.status !== 'rejected' && (
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-5 border-t border-slate-100">
                    <div className="text-left text-slate-400 leading-tight">
                      <span className="font-extrabold text-[8px] uppercase tracking-wider">Status Saat Ini</span>
                      <p className="font-bold text-slate-500">{getStatusLabel(selectedLpj.status)}</p>
                    </div>

                    <div className="flex gap-2 font-sans w-full sm:w-auto justify-end">
                      <button
                        onClick={() => setShowRejectForm(true)}
                        className="px-4 py-2.5 border border-red-200 hover:bg-red-50 text-red-650 rounded-xl font-bold cursor-pointer shrink-0"
                      >
                        Tolak / Perbaikan
                      </button>

                      {getLpjNextStepInfo(selectedLpj) ? (
                        <button
                          onClick={() => handleAdvanceLpj(selectedLpj)}
                          disabled={isProcessing}
                          className="bg-purple-650 hover:bg-[#feb234] text-white hover:text-[#001e40] px-5 py-2.5 rounded-xl font-sans font-black transition cursor-pointer flex items-center gap-1.5"
                        >
                          <Play className="w-4 h-4" />
                          <span>{getLpjNextStepInfo(selectedLpj)?.btnLabel}</span>
                        </button>
                      ) : (
                        <span className="bg-amber-50 border border-amber-200 text-amber-700 px-3 py-2 rounded-xl font-bold flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Menunggu Mahasiswa Upload Scan</span>
                        </span>
                      )}
                    </div>
                  </div>
                )
              ) : (
                <form onSubmit={handleRejectLpj} className="space-y-3 pt-4 border-t border-slate-100">
                  <div className="space-y-1.5">
                    <label className="font-bold text-red-750 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Alasan Penolakan / Revisi LPJ</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={rejectionNotes}
                      onChange={(e) => setRejectionNotes(e.target.value)}
                      placeholder="Tuliskan catatan perbaikan atau laporan anggaran yang tidak valid..."
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
                      className="px-5 py-2 bg-red-600 hover:bg-red-755 text-white rounded-xl font-bold transition cursor-pointer"
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
