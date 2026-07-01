import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Upload, 
  FileText, 
  HelpCircle, 
  CheckSquare, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle, 
  Clock, 
  XCircle,
  ChevronRight,
  Plus,
  Trash2
} from 'lucide-react';
import { OrmawaService, OrmawaApplication } from '../../services/ormawaService';

interface MahasiswaAjukanOrmawaProps {
  studentId: string;
  studentName: string;
  studentNim: string;
}

export default function MahasiswaAjukanOrmawa({ studentId, studentName, studentNim }: MahasiswaAjukanOrmawaProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Akademik' as OrmawaApplication['category'],
    description: '',
    vision: '',
    leaderName: studentName,
    leaderNim: studentNim,
  });

  const [missions, setMissions] = useState<string[]>(['']);
  const [agreedToPok, setAgreedToPok] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Files
  const [proposalFile, setProposalFile] = useState<File | null>(null);
  const [requestFile, setRequestFile] = useState<File | null>(null);
  const [procedureFile, setProcedureFile] = useState<File | null>(null);

  // Applications History
  const [history, setHistory] = useState<OrmawaApplication[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const categories: OrmawaApplication['category'][] = [
    'Akademik', 'Olahraga', 'Seni & Budaya', 'Sosial', 'Kerohanian', 'Minat Khusus'
  ];

  const templates = [
    {
      name: 'Format Penyusunan Proposal Pengajuan Ormawa',
      filename: 'format_proposal_pengajuan.docx',
      path: '/templates/format_proposal_pengajuan.docx'
    },
    {
      name: 'Surat Permohonan Pendirian UKM',
      filename: 'surat_permohonan_pendirian_ukm.docx',
      path: '/templates/surat_permohonan_pendirian_ukm.docx'
    },
    {
      name: 'Pengesahan Prosedur Mutu Pendirian Organisasi Mahasiswa',
      filename: 'pengesahan_prosedur_mutu_pendirian.docx',
      path: '/templates/pengesahan_prosedur_mutu_pendirian.docx'
    }
  ];

  const loadHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const data = await OrmawaService.getStudentApplications(studentId);
      setHistory(data);
    } catch (e: any) {
      console.error('Failed to load application history:', e);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [studentId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMissionChange = (index: number, value: string) => {
    const updated = [...missions];
    updated[index] = value;
    setMissions(updated);
  };

  const addMissionField = () => {
    setMissions([...missions, '']);
  };

  const removeMissionField = (index: number) => {
    if (missions.length === 1) return;
    const updated = missions.filter((_, i) => i !== index);
    setMissions(updated);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileSetter: (f: File | null) => void) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Enforce 5MB limit
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert('File size exceeds the 5MB limit. Please upload a smaller file.');
        e.target.value = '';
        return;
      }

      // Validate extension
      const validExtensions = ['.pdf', '.docx', '.doc'];
      const fileExt = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();
      if (!validExtensions.includes(fileExt)) {
        alert('Format file tidak didukung. Harap upload file PDF atau Word (.docx/.doc).');
        e.target.value = '';
        return;
      }

      fileSetter(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Simple validations
    if (!agreedToPok) {
      setSubmitError('Anda harus membaca dan menyetujui Pedoman Organisasi Kemahasiswaan (POK) terlebih dahulu.');
      return;
    }

    if (!proposalFile || !requestFile || !procedureFile) {
      setSubmitError('Semua lampiran dokumen wajib diunggah.');
      return;
    }

    const activeMissions = missions.filter(m => m.trim() !== '');
    if (activeMissions.length === 0) {
      setSubmitError('Visi harus disertai minimal satu misi organisasi.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Mock File Upload URLs for demo ease-of-use
      const proposalFormatUrl = `/uploads/proposals/${studentId}_${Date.now()}_${proposalFile.name}`;
      const ukmRequestUrl = `/uploads/requests/${studentId}_${Date.now()}_${requestFile.name}`;
      const qualityProcedureUrl = `/uploads/procedures/${studentId}_${Date.now()}_${procedureFile.name}`;

      await OrmawaService.submitApplication({
        applicant_id: studentId,
        name: formData.name,
        category: formData.category,
        description: formData.description,
        vision: formData.vision,
        mission: activeMissions,
        leader_name: formData.leaderName,
        leader_nim: formData.leaderNim,
        proposal_format_url: proposalFormatUrl,
        ukm_request_url: ukmRequestUrl,
        quality_procedure_url: qualityProcedureUrl,
      });

      setSubmitSuccess(true);
      setFormData({
        name: '',
        category: 'Akademik',
        description: '',
        vision: '',
        leaderName: studentName,
        leaderNim: studentNim,
      });
      setMissions(['']);
      setAgreedToPok(false);
      setProposalFile(null);
      setRequestFile(null);
      setProcedureFile(null);
      
      // Reload history
      await loadHistory();
    } catch (e: any) {
      console.error(e);
      setSubmitError(e.message || 'Gagal mengirim pengajuan. Hubungi administrator.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: OrmawaApplication['status']) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 bg-green-50 border border-green-200 text-green-700 px-2.5 py-1 rounded-full text-xs font-bold font-sans">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Disetujui</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 bg-red-50 border border-red-200 text-red-700 px-2.5 py-1 rounded-full text-xs font-bold font-sans">
            <XCircle className="w-3.5 h-3.5" />
            <span>Ditolak</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 px-2.5 py-1 rounded-full text-xs font-bold font-sans">
            <Clock className="w-3.5 h-3.5" />
            <span>Menunggu</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      
      {/* Header section */}
      <section className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-[#001e40] mb-1.5">
            Pengajuan Ormawa Baru
          </h2>
          <p className="text-sm text-slate-500 font-medium max-w-2xl">
            Ajukan pembentukan Unit Kegiatan Mahasiswa (UKM) baru di Universitas Pelita Bangsa. Pastikan berkas dokumen lengkap sesuai prosedur mutu.
          </p>
        </div>
      </section>

      {submitSuccess && (
        <div className="bg-green-55/15 border border-green-300 text-green-800 p-5 rounded-2xl flex items-start gap-3.5">
          <CheckCircle className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">Pengajuan Berhasil Dikirim!</h4>
            <p className="text-xs text-green-700 mt-1 leading-relaxed">
              Permohonan pendirian organisasi baru Anda telah tersimpan dan sedang menunggu verifikasi oleh Biro Kemahasiswaan (Staff Dirmawa). Akun admin ormawa akan otomatis digenerate jika pengajuan disetujui.
            </p>
            <button 
              onClick={() => setSubmitSuccess(false)}
              className="mt-3 text-xs font-black text-green-800 underline uppercase hover:text-green-900"
            >
              Ajukan Lagi
            </button>
          </div>
        </div>
      )}

      {/* Grid container */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Form (Span 8) */}
        <div className="xl:col-span-8 space-y-8">
          
          {/* Document Templates Download section */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5 text-[#feb234]" />
              <h3 className="font-sans font-black text-sm uppercase tracking-wider text-[#001e40]">Unduh Dokumen Lampiran</h3>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Sebelum mengisi formulir, silakan unduh dan lengkapi file format template resmi di bawah ini:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans">
              {templates.map((tpl, i) => (
                <div key={i} className="bg-slate-50 border border-slate-200/60 p-4 rounded-xl flex flex-col justify-between items-start gap-4 hover:border-slate-350 transition-all">
                  <div className="space-y-1">
                    <FileText className="w-8 h-8 text-blue-600 mb-1" />
                    <h4 className="font-bold text-xs text-slate-800 leading-snug">{tpl.name}</h4>
                    <p className="text-[10px] text-slate-400 font-medium">{tpl.filename}</p>
                  </div>
                  <a
                    href={tpl.path}
                    download
                    className="w-full text-center bg-white border border-slate-250 hover:bg-[#001e40] hover:text-white transition-colors py-2 rounded-lg text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden font-sans">
            <div className="p-5 bg-[#001e40] text-white flex items-center gap-2 border-b border-[#002d61]">
              <Sparkles className="w-5 h-5 text-[#feb234]" />
              <h3 className="font-sans font-black text-sm uppercase tracking-wider">Formulir Pengajuan Ormawa</h3>
            </div>

            <div className="p-6 space-y-6 text-xs text-slate-700">
              {submitError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-center font-bold">
                  {submitError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Organisasi Name */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="font-bold text-slate-700 block">Nama Calon Organisasi</label>
                  <input 
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Contoh: UKM Robotika & Kecerdasan Buatan"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#001e40] focus:ring-2 focus:ring-[#001e40]/10 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all placeholder:text-slate-400"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">Kategori Kegiatan</label>
                  <select 
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#001e40] focus:ring-2 focus:ring-[#001e40]/10 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all cursor-pointer"
                  >
                    {categories.map((cat, idx) => (
                      <option key={idx} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Leader Name */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">NIM Calon Ketua</label>
                  <input 
                    type="text"
                    name="leaderNim"
                    readOnly
                    value={formData.leaderNim}
                    className="w-full bg-slate-100 border border-slate-200 text-slate-500 rounded-xl px-4 py-3 text-sm font-semibold outline-none cursor-not-allowed"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="font-bold text-slate-700 block">Deskripsi Organisasi</label>
                  <textarea 
                    name="description"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Tuliskan latar belakang pendirian, fokus kegiatan, dan lingkup organisasi..."
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#001e40] focus:ring-2 focus:ring-[#001e40]/10 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all placeholder:text-slate-400 resize-y"
                  />
                </div>

                {/* Vision */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="font-bold text-slate-700 block">Visi Organisasi</label>
                  <textarea 
                    name="vision"
                    required
                    rows={2}
                    value={formData.vision}
                    onChange={handleInputChange}
                    placeholder="Menjadi pusat pengembangan bakat robotika berstandar nasional..."
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#001e40] focus:ring-2 focus:ring-[#001e40]/10 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all placeholder:text-slate-400 resize-y"
                  />
                </div>

                {/* Mission (Dynamic) */}
                <div className="md:col-span-2 space-y-2">
                  <label className="font-bold text-slate-700 block">Misi Organisasi (Minimal 1)</label>
                  <div className="space-y-2.5">
                    {missions.map((mission, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <span className="w-5 h-5 rounded-full bg-[#001e40]/5 flex items-center justify-center font-bold text-[10px] text-[#001e40] shrink-0">
                          {index + 1}
                        </span>
                        <input 
                          type="text"
                          required
                          value={mission}
                          onChange={(e) => handleMissionChange(index, e.target.value)}
                          placeholder="Misi organisasi..."
                          className="w-full bg-slate-50 border border-slate-200 focus:border-[#001e40] focus:ring-2 focus:ring-[#001e40]/10 rounded-xl px-4 py-2.5 text-xs font-medium outline-none transition-all placeholder:text-slate-400"
                        />
                        {missions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeMissionField(index)}
                            className="p-2 text-red-500 hover:text-red-700 transition hover:bg-red-55/10 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={addMissionField}
                    className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-black transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Misi</span>
                  </button>
                </div>

                {/* File Upload Attachment fields */}
                <div className="md:col-span-2 border-t border-slate-100 pt-5 space-y-4">
                  <h4 className="font-sans font-black text-sm text-[#001e40] uppercase tracking-wider mb-2">Unggah Dokumen Lampiran (Masing-masing Max 5MB, PDF/DOCX)</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* File 1: Proposal */}
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-600 block">1. Proposal Pendirian</label>
                      <div className="relative">
                        <input
                          type="file"
                          id="proposal-upload"
                          className="hidden"
                          onChange={(e) => handleFileChange(e, setProposalFile)}
                          accept=".pdf,.docx,.doc"
                        />
                        <button
                          type="button"
                          onClick={() => document.getElementById('proposal-upload')?.click()}
                          className={`w-full flex items-center justify-between px-3 py-3 border rounded-xl cursor-pointer text-left transition-all ${
                            proposalFile 
                              ? 'bg-blue-50/20 border-blue-300 text-blue-800' 
                              : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-350'
                          }`}
                        >
                          <span className="truncate pr-2 font-medium">
                            {proposalFile ? proposalFile.name : 'Pilih file proposal'}
                          </span>
                          <Upload className="w-4 h-4 shrink-0 text-slate-450" />
                        </button>
                      </div>
                    </div>

                    {/* File 2: Request letter */}
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-600 block">2. Surat Permohonan UKM</label>
                      <div className="relative">
                        <input
                          type="file"
                          id="request-upload"
                          className="hidden"
                          onChange={(e) => handleFileChange(e, setRequestFile)}
                          accept=".pdf,.docx,.doc"
                        />
                        <button
                          type="button"
                          onClick={() => document.getElementById('request-upload')?.click()}
                          className={`w-full flex items-center justify-between px-3 py-3 border rounded-xl cursor-pointer text-left transition-all ${
                            requestFile 
                              ? 'bg-blue-50/20 border-blue-300 text-blue-800' 
                              : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-350'
                          }`}
                        >
                          <span className="truncate pr-2 font-medium">
                            {requestFile ? requestFile.name : 'Pilih file surat'}
                          </span>
                          <Upload className="w-4 h-4 shrink-0 text-slate-450" />
                        </button>
                      </div>
                    </div>

                    {/* File 3: Quality procedure */}
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-600 block">3. Prosedur Mutu</label>
                      <div className="relative">
                        <input
                          type="file"
                          id="procedure-upload"
                          className="hidden"
                          onChange={(e) => handleFileChange(e, setProcedureFile)}
                          accept=".pdf,.docx,.doc"
                        />
                        <button
                          type="button"
                          onClick={() => document.getElementById('procedure-upload')?.click()}
                          className={`w-full flex items-center justify-between px-3 py-3 border rounded-xl cursor-pointer text-left transition-all ${
                            procedureFile 
                              ? 'bg-blue-50/20 border-blue-300 text-blue-800' 
                              : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-350'
                          }`}
                        >
                          <span className="truncate pr-2 font-medium">
                            {procedureFile ? procedureFile.name : 'Pilih file prosedur'}
                          </span>
                          <Upload className="w-4 h-4 shrink-0 text-slate-450" />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>

                {/* POK Checklist */}
                <div className="md:col-span-2 bg-slate-50 p-4 border border-slate-200/60 rounded-2xl space-y-3 mt-2">
                  <div className="flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      id="agreedToPok"
                      checked={agreedToPok}
                      onChange={(e) => setAgreedToPok(e.target.checked)}
                      className="mt-1 w-4 h-4 accent-[#001e40] rounded border-slate-300 focus:ring-[#001e40] cursor-pointer"
                    />
                    <label htmlFor="agreedToPok" className="font-medium text-slate-600 leading-relaxed cursor-pointer select-none">
                      Saya bersedia membaca, menaati, dan tunduk pada seluruh ketentuan yang tercantum dalam <span className="font-bold text-[#001e40] underline">Pedoman Organisasi Kemahasiswaan (POK)</span> Universitas Pelita Bangsa, serta bersedia menerima sanksi apabila melanggar komitmen mutu.
                    </label>
                  </div>
                </div>

              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end pt-5 border-t border-slate-100 font-sans gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      name: '',
                      category: 'Akademik',
                      description: '',
                      vision: '',
                      leaderName: studentName,
                      leaderNim: studentNim,
                    });
                    setMissions(['']);
                    setAgreedToPok(false);
                    setProposalFile(null);
                    setRequestFile(null);
                    setProcedureFile(null);
                  }}
                  className="px-5 py-3 hover:text-slate-900 text-slate-450 font-bold transition-all cursor-pointer"
                >
                  Reset Form
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#001e40] hover:bg-[#feb234] text-white hover:text-[#001e40] font-sans font-black px-6 py-3 rounded-xl uppercase tracking-wider shadow cursor-pointer transition active:scale-95 flex items-center justify-center gap-1.5 min-w-[140px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      <span>Mengirim...</span>
                    </>
                  ) : (
                    <span>Kirim Pengajuan</span>
                  )}
                </button>
              </div>

            </div>
          </form>

        </div>

        {/* Right column: Status History & Help Guidelines (Span 4) */}
        <div className="xl:col-span-4 space-y-8 font-sans">
          
          {/* History */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5 space-y-4">
            <h3 className="font-sans font-black text-sm uppercase tracking-wider text-[#001e40]">Status Pengajuan Saya</h3>
            
            {isLoadingHistory ? (
              <div className="py-6 flex flex-col items-center justify-center text-slate-400 gap-2">
                <div className="w-5 h-5 border-2 border-slate-200 border-t-slate-400 rounded-full animate-spin"></div>
                <span className="text-[10px] font-bold">Memuat riwayat...</span>
              </div>
            ) : history.length === 0 ? (
              <div className="py-6 text-center text-slate-400 font-bold text-xs">
                Belum ada pengajuan ormawa.
              </div>
            ) : (
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                {history.map((app) => (
                  <div key={app.id} className="bg-slate-50 border border-slate-200/60 p-4 rounded-xl space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-bold text-xs text-slate-800 leading-tight pr-1 truncate max-w-[160px]">{app.name}</h4>
                      {getStatusBadge(app.status)}
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold">{new Date(app.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                    <p className="text-[10px] text-slate-500 leading-relaxed truncate">{app.description}</p>
                    {app.status === 'rejected' && app.rejection_reason && (
                      <div className="bg-red-50 border border-red-100 p-2.5 rounded-lg text-[10px] text-red-700 leading-relaxed">
                        <strong className="font-bold">Alasan Penolakan:</strong> {app.rejection_reason}
                      </div>
                    )}
                    {app.status === 'approved' && (
                      <div className="bg-green-50 border border-green-100 p-2.5 rounded-lg text-[10px] text-green-700 leading-relaxed font-medium">
                        Akun admin telah dibuat. Silakan login admin dengan email format: <span className="font-bold font-mono">admin.{app.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@upb.ac.id</span> menggunakan sandi default <span className="font-bold font-mono">password123</span>.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Guidelines */}
          <section className="bg-[#001e40] text-white rounded-2xl shadow-sm border border-[#002d61] p-5 space-y-4">
            <div className="flex items-center gap-1.5">
              <HelpCircle className="w-5 h-5 text-[#feb234]" />
              <h3 className="font-sans font-black text-sm uppercase tracking-wider text-[#feb234]">Petunjuk Pengajuan</h3>
            </div>
            
            <ul className="space-y-3.5 text-xs text-slate-300 leading-relaxed font-medium list-none pl-0">
              <li className="flex gap-2">
                <span className="text-[#feb234] font-extrabold shrink-0 mt-0.5">•</span>
                <span>Calon ormawa harus memiliki pengurus inti (Ketua, Sekretaris, Bendahara) dan minimal <strong>10 anggota mahasiswa</strong> terdaftar.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#feb234] font-extrabold shrink-0 mt-0.5">•</span>
                <span>Format Proposal dan Prosedur Mutu wajib ditandatangani oleh inisiator dan dosen pembina pendamping sebelum di-scan dan diunggah.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#feb234] font-extrabold shrink-0 mt-0.5">•</span>
                <span>Proses validasi berkas dilakukan selama <strong>3 - 7 hari kerja</strong> oleh staff Direktorat Kemahasiswaan.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[#feb234] font-extrabold shrink-0 mt-0.5">•</span>
                <span>Jika status disetujui, ketua/inisiator dapat masuk ke dashboard admin ormawa menggunakan email yang digenerate otomatis.</span>
              </li>
            </ul>
          </section>

        </div>

      </div>

    </div>
  );
}
