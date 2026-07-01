import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  FileCheck2, 
  Plus, 
  Upload, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Download, 
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import { OrmawaService, OrmawaProposal, OrmawaLpj } from '../../services/ormawaService';

interface OrmawaProposalsManagementProps {
  ukmId: string;
  ukmName: string;
}

export default function OrmawaProposalsManagement({ ukmId, ukmName }: OrmawaProposalsManagementProps) {
  const [activeSubTab, setActiveSubTab] = useState<'list' | 'add_proposal' | 'add_lpj'>('list');
  const [proposals, setProposals] = useState<OrmawaProposal[]>([]);
  const [lpjs, setLpjs] = useState<OrmawaLpj[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Proposal Form State
  const [pTitle, setPTitle] = useState('');
  const [pDesc, setPDesc] = useState('');
  const [pBudget, setPBudget] = useState('');
  const [pDate, setPDate] = useState('');
  const [pFlowType, setPFlowType] = useState<'ukm' | 'hima'>('ukm');
  const [pDoc, setPDoc] = useState<File | null>(null);
  const [pLetter, setPLetter] = useState<File | null>(null);
  const [pFacility, setPFacility] = useState<File | null>(null);
  const [pExpedition, setPExpedition] = useState<File | null>(null);
  const [isSubmittingP, setIsSubmittingP] = useState(false);

  // LPJ Form State
  const [lProposalId, setLProposalId] = useState('');
  const [lTitle, setLTitle] = useState('');
  const [lDesc, setLDesc] = useState('');
  const [lSpent, setLSpent] = useState('');
  const [lDoc, setLDoc] = useState<File | null>(null);
  const [lReceipts, setLReceipts] = useState<File | null>(null);
  const [lFlowType, setLFlowType] = useState<'ukm' | 'hima'>('ukm');
  const [isSubmittingL, setIsSubmittingL] = useState(false);

  // Modal Detail State
  const [selectedProposal, setSelectedProposal] = useState<OrmawaProposal | null>(null);
  const [selectedLpj, setSelectedLpj] = useState<OrmawaLpj | null>(null);
  
  // Signed upload scan
  const [scanFile, setScanFile] = useState<File | null>(null);
  const [isUploadingScan, setIsUploadingScan] = useState(false);

  // Alert state
  const [successAlert, setSuccessAlert] = useState<string | null>(null);
  const [errorAlert, setErrorAlert] = useState<string | null>(null);

  const fetchLists = async () => {
    setIsLoading(true);
    try {
      const [pList, lList] = await Promise.all([
        OrmawaService.getProposals(ukmId),
        OrmawaService.getLpjs(ukmId)
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
    fetchLists();
  }, [ukmId]);

  const handleProposalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessAlert(null);
    setErrorAlert(null);

    if (!pDoc) {
      setErrorAlert('Dokumen Proposal Utama wajib diunggah.');
      return;
    }

    setIsSubmittingP(true);
    try {
      // Create mock file URLs
      const proposalDocUrl = `/uploads/proposals/${ukmId}_${Date.now()}_doc_${pDoc.name}`;
      const coverLetterUrl = pLetter ? `/uploads/proposals/${ukmId}_${Date.now()}_letter_${pLetter.name}` : '';
      const facilityRentUrl = pFacility ? `/uploads/proposals/${ukmId}_${Date.now()}_facility_${pFacility.name}` : '';
      const expeditionFormUrl = pExpedition ? `/uploads/proposals/${ukmId}_${Date.now()}_expedition_${pExpedition.name}` : '';

      await OrmawaService.submitProposal({
        ukm_id: ukmId,
        title: pTitle,
        description: pDesc,
        target_budget: Number(pBudget),
        activity_date: pDate,
        proposal_doc_url: proposalDocUrl,
        cover_letter_url: coverLetterUrl || undefined,
        facility_rent_url: facilityRentUrl || undefined,
        expedition_form_url: expeditionFormUrl || undefined,
        flow_type: pFlowType
      });

      setSuccessAlert('Proposal kegiatan berhasil diajukan! Anda dapat memantau progresnya di halaman ini.');
      
      // Reset form
      setPTitle('');
      setPDesc('');
      setPBudget('');
      setPDate('');
      setPFlowType('ukm');
      setPDoc(null);
      setPLetter(null);
      setPFacility(null);
      setPExpedition(null);
      setActiveSubTab('list');

      await fetchLists();
    } catch (e: any) {
      console.error(e);
      setErrorAlert(e.message || 'Gagal mengajukan proposal.');
    } finally {
      setIsSubmittingP(false);
    }
  };

  const handleLpjSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessAlert(null);
    setErrorAlert(null);

    if (!lDoc) {
      setErrorAlert('Dokumen LPJ Utama wajib diunggah.');
      return;
    }

    setIsSubmittingL(true);
    try {
      // Create mock file URLs
      const lpjDocUrl = `/uploads/lpjs/${ukmId}_${Date.now()}_doc_${lDoc.name}`;
      const receiptsZipUrl = lReceipts ? `/uploads/lpjs/${ukmId}_${Date.now()}_receipts_${lReceipts.name}` : '';

      await OrmawaService.submitLpj({
        ukm_id: ukmId,
        proposal_id: lProposalId || undefined,
        title: lTitle,
        description: lDesc,
        total_spent: Number(lSpent),
        lpj_doc_url: lpjDocUrl,
        receipts_zip_url: receiptsZipUrl || undefined,
        flow_type: lFlowType
      });

      setSuccessAlert('Laporan Pertanggungjawaban (LPJ) kegiatan berhasil dilaporkan!');
      
      // Reset form
      setLProposalId('');
      setLTitle('');
      setLDesc('');
      setLSpent('');
      setLDoc(null);
      setLReceipts(null);
      setLFlowType('ukm');
      setActiveSubTab('list');

      await fetchLists();
    } catch (e: any) {
      console.error(e);
      setErrorAlert(e.message || 'Gagal melaporkan LPJ.');
    } finally {
      setIsSubmittingL(false);
    }
  };

  const handleUploadScanFile = async (proposalId: string) => {
    if (!scanFile) return;
    setIsUploadingScan(true);
    try {
      const scanUrl = `/uploads/scans/${ukmId}_${Date.now()}_signed_${scanFile.name}`;
      await OrmawaService.uploadSignedProposalScan(proposalId, scanUrl);
      alert('File scan bertanda tangan berhasil diunggah! Status proposal berubah menjadi scan_uploaded.');
      setScanFile(null);
      setSelectedProposal(null);
      await fetchLists();
    } catch (e: any) {
      console.error(e);
      alert('Gagal mengunggah file scan: ' + e.message);
    } finally {
      setIsUploadingScan(false);
    }
  };

  const handleUploadLpjScanFile = async (lpjId: string) => {
    if (!scanFile) return;
    setIsUploadingScan(true);
    try {
      const scanUrl = `/uploads/scans/${ukmId}_${Date.now()}_signed_lpj_${scanFile.name}`;
      await OrmawaService.uploadSignedLpjScan(lpjId, scanUrl);
      alert('File scan LPJ bertanda tangan berhasil diunggah!');
      setScanFile(null);
      setSelectedLpj(null);
      await fetchLists();
    } catch (e: any) {
      console.error(e);
      alert('Gagal mengunggah file scan LPJ: ' + e.message);
    } finally {
      setIsUploadingScan(false);
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
      case 'approved_rektorat': return 'Siap Upload Scan';
      case 'scan_uploaded': return 'Menunggu Pencairan Dana';
      case 'completed': return 'Selesai / Dana Cair';
      case 'rejected': return 'Ditolak';
      default: return status;
    }
  };

  const getStatusColorClass = (status: string) => {
    if (status === 'completed') return 'bg-green-50 border-green-200 text-green-700';
    if (status === 'rejected') return 'bg-red-50 border-red-200 text-red-700';
    if (status === 'approved_rektorat' || status === 'approved_dau') return 'bg-blue-50 border-blue-200 text-blue-700 animate-pulse';
    return 'bg-amber-50 border-amber-200 text-amber-700';
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  };

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400 font-sans font-bold">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-[#001e40] rounded-full animate-spin"></div>
        <span>Memuat data dokumen...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in font-sans pb-10">
      
      {/* Header section */}
      <section className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-[#001e40] mb-1.5">
            Manajemen Proposal &amp; LPJ
          </h2>
          <p className="text-sm text-slate-500 font-medium max-w-2xl">
            Kirimkan berkas pengajuan proposal untuk pencairan dana kegiatan dan buat Laporan Pertanggungjawaban (LPJ) setelah kegiatan selesai dilaksanakan.
          </p>
        </div>
        
        {activeSubTab === 'list' && (
          <div className="flex gap-3 font-sans shrink-0">
            <button
              onClick={() => setActiveSubTab('add_proposal')}
              className="bg-[#001e40] hover:bg-[#feb234] text-white hover:text-[#001e40] font-black text-xs px-4 py-3 rounded-xl uppercase tracking-wider transition shadow cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Ajukan Proposal</span>
            </button>
            <button
              onClick={() => setActiveSubTab('add_lpj')}
              className="bg-purple-650 hover:bg-[#feb234] text-white hover:text-[#001e40] font-black text-xs px-4 py-3 rounded-xl uppercase tracking-wider transition shadow cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Laporkan LPJ</span>
            </button>
          </div>
        )}
      </section>

      {successAlert && (
        <div className="bg-green-55/15 border border-green-300 text-green-800 p-5 rounded-2xl flex items-start gap-3.5">
          <CheckCircle className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
          <div className="text-xs font-bold leading-relaxed">{successAlert}</div>
        </div>
      )}

      {errorAlert && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-center font-bold text-xs">
          {errorAlert}
        </div>
      )}

      {/* Sub Tabs Toggle for adding/listing */}
      {activeSubTab !== 'list' && (
        <button 
          onClick={() => setActiveSubTab('list')}
          className="text-xs font-black text-[#001e40] hover:text-[#feb234] underline uppercase flex items-center gap-1 cursor-pointer transition-colors"
        >
          <span>← Kembali ke Daftar</span>
        </button>
      )}

      {/* RENDER LIST SUB-TAB */}
      {activeSubTab === 'list' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Proposals Table (Span 7) */}
          <section className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#feb234]" />
                <h4 className="font-sans font-black text-xs uppercase tracking-wider text-[#001e40]">Pengajuan Proposal</h4>
              </div>
              <span className="bg-[#001e40]/5 text-[#001e40] px-2 py-0.5 rounded-full font-bold text-[9px]">
                {proposals.length} Total
              </span>
            </div>

            <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
              {proposals.length === 0 ? (
                <div className="py-12 text-center text-slate-400 font-bold text-xs">
                  Belum ada pengajuan proposal kegiatan.
                </div>
              ) : (
                proposals.map((prop) => (
                  <div key={prop.id} className="p-4 flex justify-between items-center gap-4 hover:bg-slate-50/50 transition-colors text-xs font-medium">
                    <div className="space-y-1 overflow-hidden">
                      <h5 className="font-bold text-slate-800 truncate max-w-[280px]">{prop.title}</h5>
                      <p className="text-[10px] text-slate-450 font-bold">
                        Tanggal: {new Date(prop.activity_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })} | Budget: <strong className="text-slate-700 font-black">{formatRupiah(Number(prop.target_budget))}</strong>
                      </p>
                      <div className="inline-flex gap-1.5 items-center mt-1">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-black border uppercase ${getStatusColorClass(prop.status)}`}>
                          {getStatusLabel(prop.status)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedProposal(prop)}
                      className="bg-slate-100 hover:bg-[#feb234] text-slate-700 hover:text-[#001e40] p-2.5 rounded-xl transition cursor-pointer shrink-0"
                      title="Lihat Detail & Lacak"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* LPJs Table (Span 5) */}
          <section className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-purple-650" />
                <h4 className="font-sans font-black text-xs uppercase tracking-wider text-[#001e40]">Laporan Pertanggungjawaban (LPJ)</h4>
              </div>
              <span className="bg-[#001e40]/5 text-[#001e40] px-2 py-0.5 rounded-full font-bold text-[9px]">
                {lpjs.length} Total
              </span>
            </div>

            <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
              {lpjs.length === 0 ? (
                <div className="py-12 text-center text-slate-400 font-bold text-xs">
                  Belum ada laporan pertanggungjawaban (LPJ).
                </div>
              ) : (
                lpjs.map((lpj) => (
                  <div key={lpj.id} className="p-4 flex justify-between items-center gap-4 hover:bg-slate-50/50 transition-colors text-xs font-medium">
                    <div className="space-y-1 overflow-hidden">
                      <h5 className="font-bold text-slate-800 truncate max-w-[200px]">{lpj.title}</h5>
                      <p className="text-[10px] text-slate-450 font-bold">
                        Spesifikasi Pengeluaran: <strong className="text-slate-700 font-black">{formatRupiah(Number(lpj.total_spent))}</strong>
                      </p>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-black border uppercase mt-1 ${
                        lpj.status === 'completed' 
                          ? 'bg-green-50 border-green-200 text-green-700' 
                          : lpj.status === 'rejected'
                            ? 'bg-red-50 border-red-200 text-red-700'
                            : 'bg-amber-50 border-amber-200 text-amber-700'
                      }`}>
                        {getStatusLabel(lpj.status)}
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedLpj(lpj)}
                      className="bg-slate-100 hover:bg-[#feb234] text-slate-700 hover:text-[#001e40] p-2.5 rounded-xl transition cursor-pointer shrink-0"
                      title="Lihat Detail LPJ"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>

        </div>
      )}

      {/* RENDER ADD PROPOSAL FORM */}
      {activeSubTab === 'add_proposal' && (
        <form onSubmit={handleProposalSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden font-sans">
          <div className="p-5 bg-[#001e40] text-white flex items-center gap-2 border-b border-[#002d61]">
            <FileText className="w-5 h-5 text-[#feb234]" />
            <h3 className="font-sans font-black text-sm uppercase tracking-wider">Formulir Pengajuan Proposal Kegiatan</h3>
          </div>

          <div className="p-6 space-y-5 text-xs text-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Proposal Title */}
              <div className="md:col-span-2 space-y-1.5">
                <label className="font-bold text-slate-700 block">Judul Kegiatan / Proposal</label>
                <input 
                  type="text"
                  required
                  value={pTitle}
                  onChange={(e) => setPTitle(e.target.value)}
                  placeholder="Contoh: Proposal Kegiatan Workshop Pengembangan IoT 2024"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#001e40] focus:ring-2 focus:ring-[#001e40]/10 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Target Budget */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Target Ajuan Anggaran (IDR)</label>
                <input 
                  type="number"
                  required
                  min={0}
                  value={pBudget}
                  onChange={(e) => setPBudget(e.target.value)}
                  placeholder="Contoh: 5000000 (Tanpa Rp atau titik)"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#001e40] focus:ring-2 focus:ring-[#001e40]/10 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Activity Date */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Tanggal Pelaksanaan Kegiatan</label>
                <input 
                  type="date"
                  required
                  value={pDate}
                  onChange={(e) => setPDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#001e40] focus:ring-2 focus:ring-[#001e40]/10 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all"
                />
              </div>

              {/* Flow Type */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Tipe Jalur Persetujuan</label>
                <select 
                  required
                  value={pFlowType}
                  onChange={(e) => setPFlowType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#001e40] focus:ring-2 focus:ring-[#001e40]/10 rounded-xl px-4 py-3 text-sm font-medium outline-none cursor-pointer"
                >
                  <option value="ukm">Jalur UKM / LDK / KSU (Langsung ke Dirmawa - DAU - Rektorat)</option>
                  <option value="hima">Jalur HIMA / BEM (Melalui Prodi - Dekan - DAU)</option>
                </select>
              </div>

              {/* Description */}
              <div className="md:col-span-2 space-y-1.5">
                <label className="font-bold text-slate-700 block">Deskripsi Kegiatan Singkat</label>
                <textarea 
                  required
                  rows={4}
                  value={pDesc}
                  onChange={(e) => setPDesc(e.target.value)}
                  placeholder="Jelaskan ringkasan materi, narasumber, target peserta, dan keluaran kegiatan..."
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#001e40] focus:ring-2 focus:ring-[#001e40]/10 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              {/* File Upload Grid */}
              <div className="md:col-span-2 border-t border-slate-100 pt-5 space-y-4">
                <h4 className="font-sans font-black text-sm text-[#001e40] uppercase tracking-wider mb-2">Unggah Berkas Lampiran (Masing-masing Max 5MB, PDF/DOCX)</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  
                  {/* Proposal Doc */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-600 block">1. Dokumen Proposal Utama *</label>
                    <input 
                      type="file" 
                      id="p-doc-file" 
                      className="hidden" 
                      onChange={(e) => e.target.files && setPDoc(e.target.files[0])}
                      accept=".pdf,.docx,.doc"
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById('p-doc-file')?.click()}
                      className={`w-full flex items-center justify-between px-3 py-2.5 border rounded-xl cursor-pointer text-left transition-all ${
                        pDoc ? 'bg-blue-50/20 border-blue-300 text-blue-800' : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}
                    >
                      <span className="truncate pr-1">{pDoc ? pDoc.name : 'Pilih File'}</span>
                      <Upload className="w-3.5 h-3.5 shrink-0" />
                    </button>
                  </div>

                  {/* Cover Letter */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-600 block">2. Surat Pengantar</label>
                    <input 
                      type="file" 
                      id="p-letter-file" 
                      className="hidden" 
                      onChange={(e) => e.target.files && setPLetter(e.target.files[0])}
                      accept=".pdf,.docx,.doc"
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById('p-letter-file')?.click()}
                      className={`w-full flex items-center justify-between px-3 py-2.5 border rounded-xl cursor-pointer text-left transition-all ${
                        pLetter ? 'bg-blue-50/20 border-blue-300 text-blue-800' : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}
                    >
                      <span className="truncate pr-1">{pLetter ? pLetter.name : 'Pilih File'}</span>
                      <Upload className="w-3.5 h-3.5 shrink-0" />
                    </button>
                  </div>

                  {/* Facility Rent */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-600 block">3. Peminjaman Fasilitas</label>
                    <input 
                      type="file" 
                      id="p-fac-file" 
                      className="hidden" 
                      onChange={(e) => e.target.files && setPFacility(e.target.files[0])}
                      accept=".pdf,.docx,.doc"
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById('p-fac-file')?.click()}
                      className={`w-full flex items-center justify-between px-3 py-2.5 border rounded-xl cursor-pointer text-left transition-all ${
                        pFacility ? 'bg-blue-50/20 border-blue-300 text-blue-800' : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}
                    >
                      <span className="truncate pr-1">{pFacility ? pFacility.name : 'Pilih File'}</span>
                      <Upload className="w-3.5 h-3.5 shrink-0" />
                    </button>
                  </div>

                  {/* Expedition Form */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-600 block">4. Form Ekspedisi</label>
                    <input 
                      type="file" 
                      id="p-exp-file" 
                      className="hidden" 
                      onChange={(e) => e.target.files && setPExpedition(e.target.files[0])}
                      accept=".pdf,.docx,.doc"
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById('p-exp-file')?.click()}
                      className={`w-full flex items-center justify-between px-3 py-2.5 border rounded-xl cursor-pointer text-left transition-all ${
                        pExpedition ? 'bg-blue-50/20 border-blue-300 text-blue-800' : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}
                    >
                      <span className="truncate pr-1">{pExpedition ? pExpedition.name : 'Pilih File'}</span>
                      <Upload className="w-3.5 h-3.5 shrink-0" />
                    </button>
                  </div>

                </div>
              </div>

            </div>

            <div className="flex justify-end gap-3 pt-5 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveSubTab('list')}
                className="px-5 py-3 text-slate-500 font-bold hover:text-slate-800 cursor-pointer"
              >
                Batalkan
              </button>
              <button
                type="submit"
                disabled={isSubmittingP}
                className="bg-[#001e40] hover:bg-[#feb234] text-white hover:text-[#001e40] font-sans font-black px-6 py-3 rounded-xl uppercase tracking-wider shadow cursor-pointer transition active:scale-95 flex items-center gap-1.5"
              >
                {isSubmittingP ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <span>Mengirim...</span>
                  </>
                ) : (
                  <span>Kirim Proposal</span>
                )}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* RENDER ADD LPJ FORM */}
      {activeSubTab === 'add_lpj' && (
        <form onSubmit={handleLpjSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden font-sans">
          <div className="p-5 bg-purple-650 text-white flex items-center gap-2 border-b border-purple-700">
            <FileCheck2 className="w-5 h-5 text-[#feb234]" />
            <h3 className="font-sans font-black text-sm uppercase tracking-wider">Formulir Laporan Pertanggungjawaban (LPJ)</h3>
          </div>

          <div className="p-6 space-y-5 text-xs text-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Reference Proposal */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block font-sans">Hubungkan ke Proposal Kegiatan (Opsional)</label>
                <select 
                  value={lProposalId}
                  onChange={(e) => setLProposalId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#001e40] focus:ring-2 focus:ring-[#001e40]/10 rounded-xl px-4 py-3 text-sm font-medium outline-none cursor-pointer"
                >
                  <option value="">-- Tanpa Hubungan Proposal (Kegiatan Mandiri) --</option>
                  {proposals.map((p) => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              {/* Flow Type for LPJ */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block font-sans">Tipe Jalur LPJ</label>
                <select 
                  required
                  value={lFlowType}
                  onChange={(e) => setLFlowType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#001e40] focus:ring-2 focus:ring-[#001e40]/10 rounded-xl px-4 py-3 text-sm font-medium outline-none cursor-pointer"
                >
                  <option value="ukm">Jalur UKM / LDK / KSU (Staff Dirmawa - Direktur - Rektorat)</option>
                  <option value="hima">Jalur HIMA / BEM (Prodi - Dekan - Staff Dirmawa)</option>
                </select>
              </div>

              {/* LPJ Title */}
              <div className="md:col-span-2 space-y-1.5">
                <label className="font-bold text-slate-700 block">Judul Laporan (LPJ)</label>
                <input 
                  type="text"
                  required
                  value={lTitle}
                  onChange={(e) => setLTitle(e.target.value)}
                  placeholder="Contoh: Laporan Pertanggungjawaban Kegiatan Workshop IoT 2024"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#001e40] focus:ring-2 focus:ring-[#001e40]/10 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Total Spent budget */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Total Pengeluaran Realisasi (IDR)</label>
                <input 
                  type="number"
                  required
                  min={0}
                  value={lSpent}
                  onChange={(e) => setLSpent(e.target.value)}
                  placeholder="Contoh: 4500000"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#001e40] focus:ring-2 focus:ring-[#001e40]/10 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              {/* LPJ Description */}
              <div className="md:col-span-2 space-y-1.5">
                <label className="font-bold text-slate-700 block">Ringkasan Evaluasi Kegiatan</label>
                <textarea 
                  required
                  rows={4}
                  value={lDesc}
                  onChange={(e) => setLDesc(e.target.value)}
                  placeholder="Jelaskan evaluasi pelaksanaan kegiatan, jumlah akhir peserta yang hadir, kendala, dan hasil evaluasi..."
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#001e40] focus:ring-2 focus:ring-[#001e40]/10 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              {/* File Uploads for LPJ */}
              <div className="md:col-span-2 border-t border-slate-100 pt-5 space-y-4">
                <h4 className="font-sans font-black text-sm text-[#001e40] uppercase tracking-wider mb-2">Unggah Berkas Laporan (Masing-masing Max 5MB)</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* LPJ Doc */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-600 block">1. Dokumen Laporan LPJ Utama * (PDF/DOCX)</label>
                    <input 
                      type="file" 
                      id="l-doc-file" 
                      className="hidden" 
                      onChange={(e) => e.target.files && setLDoc(e.target.files[0])}
                      accept=".pdf,.docx,.doc"
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById('l-doc-file')?.click()}
                      className={`w-full flex items-center justify-between px-3 py-2.5 border rounded-xl cursor-pointer text-left transition-all ${
                        lDoc ? 'bg-blue-50/20 border-blue-300 text-blue-800' : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}
                    >
                      <span className="truncate pr-1">{lDoc ? lDoc.name : 'Pilih File'}</span>
                      <Upload className="w-3.5 h-3.5 shrink-0" />
                    </button>
                  </div>

                  {/* Receipts Zip */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-600 block">2. Kwitansi / Nota Pendukung (ZIP)</label>
                    <input 
                      type="file" 
                      id="l-zip-file" 
                      className="hidden" 
                      onChange={(e) => e.target.files && setLReceipts(e.target.files[0])}
                      accept=".zip,.rar"
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById('l-zip-file')?.click()}
                      className={`w-full flex items-center justify-between px-3 py-2.5 border rounded-xl cursor-pointer text-left transition-all ${
                        lReceipts ? 'bg-blue-50/20 border-blue-300 text-blue-800' : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}
                    >
                      <span className="truncate pr-1">{lReceipts ? lReceipts.name : 'Pilih File'}</span>
                      <Upload className="w-3.5 h-3.5 shrink-0" />
                    </button>
                  </div>

                </div>
              </div>

            </div>

            <div className="flex justify-end gap-3 pt-5 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveSubTab('list')}
                className="px-5 py-3 text-slate-500 font-bold hover:text-slate-800 cursor-pointer"
              >
                Batalkan
              </button>
              <button
                type="submit"
                disabled={isSubmittingL}
                className="bg-purple-650 hover:bg-[#feb234] text-white hover:text-[#001e40] font-sans font-black px-6 py-3 rounded-xl uppercase tracking-wider shadow cursor-pointer transition active:scale-95 flex items-center gap-1.5"
              >
                {isSubmittingL ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <span>Mengirim...</span>
                  </>
                ) : (
                  <span>Kirim Laporan LPJ</span>
                )}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* DETAIL MODAL PROPOSAL */}
      {selectedProposal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-fade-in font-sans text-xs">
            <div className="bg-[#001e40] p-5 text-white flex justify-between items-center border-b border-[#002d61]">
              <div>
                <h3 className="font-sans font-black text-sm uppercase tracking-wider">Detail Pengajuan Proposal</h3>
                <span className="bg-[#feb234]/15 px-2 py-0.5 rounded text-[#feb234] font-black text-[9px] tracking-wide mt-1 inline-block">
                  ID: {selectedProposal.id.substring(0, 8)}...
                </span>
              </div>
              <button 
                onClick={() => { setSelectedProposal(null); setScanFile(null); }}
                className="text-white hover:text-[#feb234] font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5 text-slate-700 max-h-[75vh] overflow-y-auto">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-0.5">
                  <span className="text-slate-400 font-extrabold text-[9px] uppercase tracking-wider">Judul Proposal</span>
                  <p className="font-black text-sm text-[#001e40]">{selectedProposal.title}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-slate-400 font-extrabold text-[9px] uppercase tracking-wider">Status Alur</span>
                  <div>
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black border uppercase ${getStatusColorClass(selectedProposal.status)}`}>
                      {getStatusLabel(selectedProposal.status)}
                    </span>
                  </div>
                </div>
                <div className="space-y-0.5">
                  <span className="text-slate-400 font-extrabold text-[9px] uppercase tracking-wider">Anggaran Diajukan</span>
                  <p className="font-black text-sm text-slate-800">{formatRupiah(Number(selectedProposal.target_budget))}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-slate-400 font-extrabold text-[9px] uppercase tracking-wider">Tanggal Pelaksanaan</span>
                  <p className="font-bold text-slate-700">{new Date(selectedProposal.activity_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                </div>
              </div>

              <div className="space-y-1 bg-slate-50 p-4 border border-slate-200/60 rounded-xl">
                <span className="text-slate-400 font-extrabold text-[9px] uppercase tracking-wider">Deskripsi Kegiatan</span>
                <p className="font-medium text-slate-650 leading-relaxed">{selectedProposal.description}</p>
              </div>

              {selectedProposal.status === 'rejected' && selectedProposal.rejection_reason && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-2.5 text-red-750">
                  <AlertTriangle className="w-5 h-5 shrink-0 text-red-650 mt-0.5" />
                  <div>
                    <strong className="font-black">Alasan Penolakan:</strong>
                    <p className="mt-1 font-medium leading-relaxed">{selectedProposal.rejection_reason}</p>
                  </div>
                </div>
              )}

              {/* Document Download links */}
              <div className="space-y-2 border-t border-slate-100 pt-4">
                <span className="text-slate-400 font-extrabold text-[9px] uppercase tracking-wider">Berkas Pengajuan Awal</span>
                <div className="grid grid-cols-2 gap-3">
                  <a 
                    href={selectedProposal.proposal_doc_url} 
                    className="flex justify-between items-center bg-slate-50 hover:bg-slate-100 p-2.5 border border-slate-200 rounded-lg text-slate-750 font-bold transition-all"
                  >
                    <span>Dokumen Proposal Utama</span>
                    <Download className="w-4 h-4 text-[#001e40]" />
                  </a>
                  {selectedProposal.cover_letter_url && (
                    <a 
                      href={selectedProposal.cover_letter_url} 
                      className="flex justify-between items-center bg-slate-50 hover:bg-slate-100 p-2.5 border border-slate-200 rounded-lg text-slate-750 font-bold transition-all"
                    >
                      <span>Surat Pengantar</span>
                      <Download className="w-4 h-4 text-[#001e40]" />
                    </a>
                  )}
                </div>
              </div>

              {/* UPLOAD SCAN PORTION */}
              {((selectedProposal.status === 'approved_rektorat' && selectedProposal.flow_type === 'ukm') || 
                (selectedProposal.status === 'approved_dau' && selectedProposal.flow_type === 'hima')) && (
                <div className="bg-blue-50/30 border border-blue-200 p-4 rounded-xl space-y-3 mt-4">
                  <div className="flex gap-2 items-center text-blue-800">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <strong className="font-black uppercase text-[10px] tracking-wide">Langkah Wajib: Unggah Berkas Scan Tanda Tangan</strong>
                  </div>
                  <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
                    Proposal Anda telah disetujui instansi. Silakan unduh hardfile proposal, minta pengesahan tanda tangan rektorat (atau pembina), kemudian unggah berkas scan PDF bertanda tangan basah di bawah ini agar dana kasir dapat dicairkan.
                  </p>
                  
                  <div className="flex gap-3 items-center">
                    <input 
                      type="file" 
                      id="scan-upload-file" 
                      className="hidden" 
                      onChange={(e) => e.target.files && setScanFile(e.target.files[0])}
                      accept=".pdf,.docx,.doc"
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById('scan-upload-file')?.click()}
                      className={`flex-1 flex justify-between items-center px-3 py-2.5 border rounded-xl cursor-pointer text-left transition-all ${
                        scanFile ? 'bg-white border-blue-400 text-blue-800 font-bold' : 'bg-white border-slate-200 text-slate-400'
                      }`}
                    >
                      <span className="truncate pr-1">{scanFile ? scanFile.name : 'Pilih File Scan PDF'}</span>
                      <Upload className="w-3.5 h-3.5 shrink-0" />
                    </button>
                    
                    <button
                      onClick={() => handleUploadScanFile(selectedProposal.id)}
                      disabled={!scanFile || isUploadingScan}
                      className="bg-blue-650 hover:bg-blue-750 text-white font-black px-4 py-2.5 rounded-xl uppercase tracking-wider transition disabled:opacity-50"
                    >
                      {isUploadingScan ? 'Proses...' : 'Upload'}
                    </button>
                  </div>
                </div>
              )}

              {selectedProposal.signed_proposal_url && (
                <div className="space-y-2 border-t border-slate-100 pt-4">
                  <span className="text-slate-400 font-extrabold text-[9px] uppercase tracking-wider">Scan Tanda Tangan Basah</span>
                  <a 
                    href={selectedProposal.signed_proposal_url} 
                    className="flex justify-between items-center bg-green-50 border border-green-200 text-green-800 p-2.5 rounded-lg font-bold"
                  >
                    <span>Scan Proposal Disetujui Rektorat.pdf</span>
                    <Download className="w-4 h-4 text-green-700" />
                  </a>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* DETAIL MODAL LPJ */}
      {selectedLpj && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl animate-fade-in font-sans text-xs">
            <div className="bg-purple-650 p-5 text-white flex justify-between items-center border-b border-purple-700">
              <div>
                <h3 className="font-sans font-black text-sm uppercase tracking-wider">Detail Laporan LPJ</h3>
                <span className="bg-purple-500/20 px-2 py-0.5 rounded text-white font-black text-[9px] mt-1 inline-block">
                  ID: {selectedLpj.id.substring(0, 8)}...
                </span>
              </div>
              <button 
                onClick={() => { setSelectedLpj(null); setScanFile(null); }}
                className="text-white hover:text-[#feb234] font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5 text-slate-700 max-h-[75vh] overflow-y-auto">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-0.5">
                  <span className="text-slate-400 font-extrabold text-[9px] uppercase tracking-wider">Judul LPJ</span>
                  <p className="font-black text-sm text-[#001e40]">{selectedLpj.title}</p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-slate-400 font-extrabold text-[9px] uppercase tracking-wider">Status Laporan</span>
                  <div>
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black border uppercase ${
                      selectedLpj.status === 'completed' 
                        ? 'bg-green-50 border-green-200 text-green-700' 
                        : selectedLpj.status === 'rejected'
                          ? 'bg-red-50 border-red-200 text-red-700'
                          : 'bg-amber-50 border-amber-200 text-amber-700'
                    }`}>
                      {getStatusLabel(selectedLpj.status)}
                    </span>
                  </div>
                </div>
                <div className="space-y-0.5">
                  <span className="text-slate-400 font-extrabold text-[9px] uppercase tracking-wider">Total Realisasi Pengeluaran</span>
                  <p className="font-black text-sm text-slate-800">{formatRupiah(Number(selectedLpj.total_spent))}</p>
                </div>
                {selectedLpj.proposal_title && (
                  <div className="space-y-0.5">
                    <span className="text-slate-400 font-extrabold text-[9px] uppercase tracking-wider">Proposal Terkait</span>
                    <p className="font-bold text-slate-700 truncate max-w-[200px]">{selectedLpj.proposal_title}</p>
                  </div>
                )}
              </div>

              <div className="space-y-1 bg-slate-50 p-4 border border-slate-200/60 rounded-xl">
                <span className="text-slate-400 font-extrabold text-[9px] uppercase tracking-wider">Evaluasi Laporan</span>
                <p className="font-medium text-slate-650 leading-relaxed">{selectedLpj.description}</p>
              </div>

              {selectedLpj.status === 'rejected' && selectedLpj.rejection_reason && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-2.5 text-red-750">
                  <AlertTriangle className="w-5 h-5 shrink-0 text-red-650 mt-0.5" />
                  <div>
                    <strong className="font-black">Catatan Penolakan / Revisi:</strong>
                    <p className="mt-1 font-medium leading-relaxed">{selectedLpj.rejection_reason}</p>
                  </div>
                </div>
              )}

              <div className="space-y-2 border-t border-slate-100 pt-4">
                <span className="text-slate-400 font-extrabold text-[9px] uppercase tracking-wider">Berkas Laporan Awal</span>
                <div className="grid grid-cols-2 gap-3">
                  <a 
                    href={selectedLpj.lpj_doc_url} 
                    className="flex justify-between items-center bg-slate-50 hover:bg-slate-100 p-2.5 border border-slate-200 rounded-lg text-slate-750 font-bold transition-all"
                  >
                    <span>Dokumen LPJ Utama</span>
                    <Download className="w-4 h-4 text-[#001e40]" />
                  </a>
                  {selectedLpj.receipts_zip_url && (
                    <a 
                      href={selectedLpj.receipts_zip_url} 
                      className="flex justify-between items-center bg-slate-50 hover:bg-slate-100 p-2.5 border border-slate-200 rounded-lg text-slate-750 font-bold transition-all"
                    >
                      <span>Kwitansi Nota ZIP</span>
                      <Download className="w-4 h-4 text-[#001e40]" />
                    </a>
                  )}
                </div>
              </div>

              {/* UPLOAD SCAN LPJ PORTION */}
              {((selectedLpj.status === 'approved_rektorat' && selectedLpj.flow_type === 'ukm') || 
                (selectedLpj.status === 'approved_dekanat' && selectedLpj.flow_type === 'hima')) && (
                <div className="bg-blue-50/30 border border-blue-200 p-4 rounded-xl space-y-3 mt-4">
                  <div className="flex gap-2 items-center text-blue-800">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <strong className="font-black uppercase text-[10px] tracking-wide">Unggah Scan LPJ Bertanda Tangan Basah</strong>
                  </div>
                  <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
                    Tinjauan LPJ Anda telah selesai disetujui. Silakan unggah berkas scan LPJ akhir yang sudah ditandatangani rektorat/dekanat untuk menyelesaikan administrasi.
                  </p>
                  
                  <div className="flex gap-3 items-center">
                    <input 
                      type="file" 
                      id="scan-lpj-upload-file" 
                      className="hidden" 
                      onChange={(e) => e.target.files && setScanFile(e.target.files[0])}
                      accept=".pdf,.docx,.doc"
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById('scan-lpj-upload-file')?.click()}
                      className={`flex-1 flex justify-between items-center px-3 py-2.5 border rounded-xl cursor-pointer text-left transition-all ${
                        scanFile ? 'bg-white border-blue-400 text-blue-800 font-bold' : 'bg-white border-slate-200 text-slate-400'
                      }`}
                    >
                      <span className="truncate pr-1">{scanFile ? scanFile.name : 'Pilih File Scan PDF'}</span>
                      <Upload className="w-3.5 h-3.5 shrink-0" />
                    </button>
                    
                    <button
                      onClick={() => handleUploadLpjScanFile(selectedLpj.id)}
                      disabled={!scanFile || isUploadingScan}
                      className="bg-blue-650 hover:bg-blue-750 text-white font-black px-4 py-2.5 rounded-xl uppercase tracking-wider transition disabled:opacity-50"
                    >
                      {isUploadingScan ? 'Proses...' : 'Upload'}
                    </button>
                  </div>
                </div>
              )}

              {selectedLpj.signed_lpj_url && (
                <div className="space-y-2 border-t border-slate-100 pt-4">
                  <span className="text-slate-400 font-extrabold text-[9px] uppercase tracking-wider">Scan LPJ Tanda Tangan Basah</span>
                  <a 
                    href={selectedLpj.signed_lpj_url} 
                    className="flex justify-between items-center bg-green-50 border border-green-200 text-green-800 p-2.5 rounded-lg font-bold"
                  >
                    <span>Scan LPJ Disetujui.pdf</span>
                    <Download className="w-4 h-4 text-green-700" />
                  </a>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
