import React, { useState, useEffect } from 'react';
import { 
  Award, 
  History, 
  HelpCircle, 
  Info, 
  CloudUpload, 
  FileText, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Eye, 
  X,
  Plus,
  Download
} from 'lucide-react';
import { UserSession } from '../../types/mahasiswa';
import { supabase } from '../../services/supabaseClient';

interface AchievementItem {
  id: string;
  date: string;
  title: string;
  category: 'Akademik' | 'Olahraga' | 'Seni & Budaya' | 'Keagamaan' | 'Lainnya';
  level: 'Internasional' | 'Nasional' | 'Regional' | 'Kampus';
  rank: string;
  status: 'Disetujui' | 'Menunggu Verifikasi' | 'Ditolak';
  file?: string;
  points: number;
}

interface MahasiswaPengajuanPrestasiProps {
  session: UserSession;
}

export default function MahasiswaPengajuanPrestasi({ session }: MahasiswaPengajuanPrestasiProps) {
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('Semua Status');
  const [file, setFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    level: 'Nasional',
    category: 'Akademik',
    date: '',
    rank: '',
    imageUrl: ''
  });

  const [showDetail, setShowDetail] = useState<AchievementItem | null>(null);

  const fetchAchievements = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('student_name', session.name)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mapped = (data || []).map((row: any) => {
        const uiLevel = row.level || 'Nasional';
        let uiCategory: any = 'Akademik';
        if (row.category === 'Olahraga') uiCategory = 'Olahraga';
        else if (row.category === 'Seni') uiCategory = 'Seni & Budaya';
        else if (row.category === 'Non-Akademik') uiCategory = 'Lainnya';

        const pointsMapping = {
          'Internasional': 10,
          'Nasional': 5,
          'Regional': 3,
          'Kampus': 1
        };
        const points = pointsMapping[uiLevel as 'Internasional' | 'Nasional' | 'Regional' | 'Kampus'] || 1;

        return {
          id: row.id,
          date: row.created_at ? new Date(row.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Baru',
          title: row.title,
          category: uiCategory,
          level: uiLevel,
          rank: row.rank || '',
          status: row.status || 'Menunggu Verifikasi',
          points: points,
          file: 'sertifikat.pdf'
        };
      });

      setAchievements(mapped);
    } catch (e) {
      console.error('Failed to load achievements:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, [session]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const img = e.target.files[0];
      setImageFile(img);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(img);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.date || !formData.rank) {
      alert('Mohon lengkapi seluruh kolom formulir.');
      return;
    }

    try {
      const dbLevel = ['Regional', 'Nasional', 'Internasional'].includes(formData.level) 
        ? formData.level 
        : 'Regional';

      const categoryMapping: Record<string, string> = {
        'Akademik': 'Akademik',
        'Olahraga': 'Olahraga',
        'Seni & Budaya': 'Seni',
        'Keagamaan': 'Non-Akademik',
        'Lainnya': 'Non-Akademik'
      };
      const dbCategory = categoryMapping[formData.category] || 'Non-Akademik';
      const year = formData.date ? new Date(formData.date).getFullYear() : new Date().getFullYear();

      const newId = crypto.randomUUID();
      const payload = {
        id: newId,
        title: formData.title,
        student_name: session.name,
        major: session.major || 'Teknik Informatika',
        level: dbLevel,
        rank: formData.rank,
        category: dbCategory,
        year: year,
        description: `Keterangan: ${formData.rank}`,
        image_url: imagePreview || formData.imageUrl || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop',
        status: 'Menunggu Verifikasi'
      };

      const { error } = await supabase
        .from('achievements')
        .insert(payload);

      if (error) throw error;

      alert('Pengajuan prestasi baru berhasil dikirim!');
      fetchAchievements();
      
      setFormData({
        title: '',
        level: 'Nasional',
        category: 'Akademik',
        date: '',
        rank: '',
        imageUrl: ''
      });
      setFile(null);
      setImageFile(null);
      setImagePreview('');
    } catch (err: any) {
      console.error('Failed to submit achievement:', err);
      alert('Gagal mengirim pengajuan prestasi: ' + (err.message || 'Unknown error'));
    }
  };

  const filteredAchievements = achievements.filter(ach => {
    if (filter === 'Semua Status') return true;
    if (filter === 'Disetujui' && ach.status === 'Disetujui') return true;
    if (filter === 'Menunggu' && ach.status === 'Menunggu Verifikasi') return true;
    if (filter === 'Ditolak' && ach.status === 'Ditolak') return true;
    return false;
  });

  const totalPoints = achievements
    .filter(a => a.status === 'Disetujui')
    .reduce((sum, a) => sum + a.points, 0);

  const pendingCount = achievements.filter(a => a.status === 'Menunggu Verifikasi').length;

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 font-sans">
        <div className="w-8 h-8 border-4 border-[#001e40]/20 border-t-[#001e40] rounded-full animate-spin mx-auto mb-4" />
        <span>Memuat data prestasi...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      
      {/* Hero Header */}
      <section className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-[#001e40] mb-1.5">
            Pelaporan Prestasi Mahasiswa
          </h2>
          <p className="text-sm text-slate-500 font-medium max-w-2xl">
            Catat setiap langkah suksesmu. Pengajuan prestasi yang terverifikasi akan secara otomatis masuk ke dalam Surat Keterangan Pendamping Ijazah (SKPI) Anda.
          </p>
        </div>
        <div className="flex gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 shrink-0 font-sans">
          <div className="text-center px-4">
            <p className="text-xl font-black text-[#001e40]">{totalPoints}</p>
            <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-450 mt-0.5">Total Poin</p>
          </div>
          <div className="w-[1px] bg-slate-200"></div>
          <div className="text-center px-4">
            <p className="text-xl font-black text-[#815500]">{pendingCount}</p>
            <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-450 mt-0.5">Pending</p>
          </div>
        </div>
      </section>

      {/* Grid Layout: Form & Guidelines */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Left Card: Submission Form (Span 8) */}
        <section className="xl:col-span-8 bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
          <div className="p-5 bg-[#001e40] text-[#feb234] flex items-center gap-2 border-b border-[#002d61]">
            <Award className="w-5 h-5" />
            <h3 className="font-sans font-black text-sm uppercase tracking-wider text-white">Formulir Pengajuan Baru</h3>
          </div>
          
          <form onSubmit={handleFormSubmit} className="p-6 space-y-5 text-xs text-slate-800 font-sans">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Nama Lomba */}
              <div className="md:col-span-2 space-y-1.5">
                <label className="font-bold text-slate-700 block">Nama Kegiatan / Kompetisi</label>
                <input 
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Contoh: National Robotics Competition 2024"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#001e40] focus:ring-2 focus:ring-[#001e40]/10 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Tingkat & Kategori */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Tingkat Pencapaian</label>
                <select 
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#001e40] focus:ring-2 focus:ring-[#001e40]/10 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all"
                >
                  <option>Internasional</option>
                  <option>Nasional</option>
                  <option>Regional</option>
                  <option>Kampus</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Kategori Prestasi</label>
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#001e40] focus:ring-2 focus:ring-[#001e40]/10 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all"
                >
                  <option>Akademik</option>
                  <option>Olahraga</option>
                  <option>Seni &amp; Budaya</option>
                  <option>Keagamaan</option>
                  <option>Lainnya</option>
                </select>
              </div>

              {/* Tanggal & Peringkat */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Tanggal Pencapaian</label>
                <input 
                  type="date"
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#001e40] focus:ring-2 focus:ring-[#001e40]/10 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Peringkat / Juara</label>
                <input 
                  type="text"
                  name="rank"
                  required
                  value={formData.rank}
                  onChange={handleInputChange}
                  placeholder="Contoh: Juara 1 / Harapan 2 / Finalis"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#001e40] focus:ring-2 focus:ring-[#001e40]/10 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Drag and Drop Certificate Upload */}
              <div className="md:col-span-2 space-y-1.5">
                <label className="font-bold text-slate-700 block">Unggah Bukti Sertifikat (PDF/JPG, Max 5MB)</label>
                <div 
                  onClick={() => document.getElementById('file-input')?.click()}
                  className="border-2 border-dashed border-slate-200 hover:border-[#001e40] hover:bg-slate-50/50 rounded-2xl p-8 flex flex-col items-center justify-center bg-slate-50/20 transition-all cursor-pointer group text-center"
                >
                  <CloudUpload className="w-10 h-10 text-slate-400 group-hover:scale-105 transition-transform mb-2" />
                  {file ? (
                    <div className="flex items-center gap-1.5 bg-[#feb234]/15 border border-[#feb234]/25 px-3 py-1 rounded-lg text-[#291800] font-bold text-xs">
                      <FileText className="w-3.5 h-3.5" />
                      <span>{file.name}</span>
                    </div>
                  ) : (
                    <p className="font-medium text-slate-500">
                      Seret dan lepas file di sini atau <span className="text-[#001e40] font-bold">Pilih File</span>
                    </p>
                  )}
                  <input 
                    type="file" 
                    id="file-input"
                    className="hidden" 
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </div>
              </div>

              {/* Achievement Thumbnail Image Upload */}
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">Link Gambar / Foto Kegiatan (Alternatif)</label>
                  <input 
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    placeholder="Contoh: https://url-foto.com/gambar.jpg"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#001e40] focus:ring-2 focus:ring-[#001e40]/10 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">Atau Unggah Foto Dokumentasi (PNG/JPG)</label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => document.getElementById('image-input')?.click()}
                      className="px-4 py-2.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Pilih Foto Kegiatan
                    </button>
                    <input 
                      type="file" 
                      id="image-input"
                      className="hidden" 
                      onChange={handleImageFileChange}
                      accept="image/*"
                    />
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-12 h-12 rounded-lg object-cover border border-slate-200 shadow-sm"
                      />
                    ) : imageFile ? (
                      <span className="text-xs text-slate-500 font-semibold truncate max-w-[150px]">{imageFile.name}</span>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium animate-pulse">Belum ada foto dipilih</span>
                    )}
                  </div>
                </div>
              </div>

            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 font-sans">
              <button 
                type="button"
                onClick={() => {
                  setFormData({ title: '', level: 'Nasional', category: 'Akademik', date: '', rank: '', imageUrl: '' });
                  setFile(null);
                  setImageFile(null);
                  setImagePreview('');
                }}
                className="px-4 py-2.5 hover:text-slate-900 text-slate-450 font-bold transition-all cursor-pointer"
              >
                Batalkan
              </button>
              <button 
                type="submit"
                className="px-6 py-2.5 bg-[#001e40] hover:bg-[#1f477b] text-white font-bold rounded-xl shadow-lg shadow-[#001e40]/10 transition-all active:scale-95 cursor-pointer"
              >
                Kirim Pengajuan
              </button>
            </div>
          </form>
        </section>

        {/* Right Side: Guideline and Help Boxes (Span 4) */}
        <aside className="xl:col-span-4 space-y-6">
          {/* Guide Card */}
          <div className="bg-[#feb234]/10 border border-[#feb234]/20 p-5 rounded-2xl text-[#291800] shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-5 h-5 text-[#815500] shrink-0" />
              <h4 className="font-sans font-black text-sm uppercase tracking-wider text-[#815500]">Panduan Verifikasi</h4>
            </div>
            <ul className="space-y-2.5 font-sans text-xs font-semibold leading-relaxed list-disc pl-4 opacity-90 text-slate-700">
              <li>Pastikan nama di sertifikat sesuai dengan identitas NIM Anda.</li>
              <li>Resolusi file harus terbaca dengan jelas (Min. 300dpi).</li>
              <li>Proses verifikasi membutuhkan waktu 3-5 hari kerja oleh Admin.</li>
              <li>Tingkat Internasional memerlukan bukti tautan resmi kompetisi.</li>
            </ul>
          </div>

          {/* Help Card */}
          <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#001e40]/5 rounded-full -mr-12 -mt-12"></div>
            <h4 className="font-sans font-black text-sm text-[#001e40] mb-1.5">Butuh Bantuan?</h4>
            <p className="text-xs text-slate-500 font-medium mb-4 leading-relaxed">
              Hubungi tim kemahasiswaan Universitas Pelita Bangsa jika Anda mengalami kendala saat pengajuan.
            </p>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); alert('Membuka kontak bantuan kemahasiswaan...'); }}
              className="inline-flex items-center gap-1 text-[#001e40] font-bold hover:underline text-xs"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Buka Tiket Bantuan</span>
            </a>
          </div>
        </aside>

      </div>

      {/* Riwayat Pengajuan (Achievement History Table) */}
      <section className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-[#001e40]" />
            <h3 className="font-sans font-black text-base text-[#001e40]">Riwayat Pengajuan SKPI</h3>
          </div>
          
          <div className="flex items-center gap-2 text-xs font-sans">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Filter Status:</span>
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-slate-700 outline-none focus:border-[#001e40] shadow-sm"
            >
              <option>Semua Status</option>
              <option>Disetujui</option>
              <option>Menunggu</option>
              <option>Ditolak</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left font-sans border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-black text-[10px] uppercase border-b border-slate-200">
                <th className="px-6 py-4">Tanggal Pengajuan</th>
                <th className="px-6 py-4">Nama Kegiatan &amp; Kategori</th>
                <th className="px-6 py-4">Tingkat</th>
                <th className="px-6 py-4">Peringkat / Juara</th>
                <th className="px-6 py-4">Status Verifikasi</th>
                <th className="px-6 py-4 text-center">Berkas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 text-slate-700">
              {filteredAchievements.map((ach) => (
                <tr key={ach.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-500">{ach.date}</td>
                  <td className="px-6 py-4 max-w-sm">
                    <p className="font-bold text-slate-900 mb-1">{ach.title}</p>
                    <span className="text-[10px] font-bold bg-[#001e40]/5 text-[#001e40] px-2 py-0.5 rounded border border-[#001e40]/10 uppercase tracking-wide">
                      {ach.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-600">{ach.level}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">{ach.rank}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {ach.status === 'Disetujui' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full font-bold text-[10px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Disetujui ({ach.points} Poin)</span>
                      </span>
                    )}
                    {ach.status === 'Menunggu Verifikasi' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 text-[#815500] border border-[#feb234]/20 rounded-full font-bold text-[10px]">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Menunggu Verifikasi</span>
                      </span>
                    )}
                    {ach.status === 'Ditolak' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-700 border border-red-100 rounded-full font-bold text-[10px]">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Ditolak</span>
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {ach.file ? (
                      <button 
                        onClick={() => setShowDetail(ach)}
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-[#001e40] transition-colors cursor-pointer"
                        title="Lihat Detail Pengajuan"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    ) : (
                      <span className="text-slate-350 text-[10px] font-semibold">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modal File Viewer / Submission Details */}
      {showDetail && (
        <div className="fixed inset-0 z-50 bg-[#001e40]/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowDetail(null)}>
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200 border-t-8 border-t-[#001e40] animate-scale-up" onClick={e => e.stopPropagation()}>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <h4 className="font-sans font-black text-lg text-[#001e40]">Detail Pengajuan Prestasi</h4>
                <button onClick={() => setShowDetail(null)} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 font-sans text-xs">
                <div>
                  <p className="text-slate-400 font-semibold">Nama Kegiatan</p>
                  <p className="font-bold text-slate-800 text-sm mt-0.5">{showDetail.title}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-slate-400 font-semibold">Tingkat</p>
                    <p className="font-bold text-slate-800 mt-0.5">{showDetail.level}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-semibold">Kategori</p>
                    <p className="font-bold text-slate-800 mt-0.5">{showDetail.category}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-slate-400 font-semibold">Hasil / Peringkat</p>
                    <p className="font-bold text-slate-850 mt-0.5">{showDetail.rank}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-semibold">Tanggal Perolehan</p>
                    <p className="font-bold text-slate-800 mt-0.5">{showDetail.date}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <p className="text-slate-400 font-semibold mb-2">Berkas Pendukung</p>
                  <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                    <span className="font-bold text-slate-700 truncate max-w-[200px]">{showDetail.file}</span>
                    <button 
                      onClick={() => alert(`Mengunduh berkas ${showDetail.file}...`)}
                      className="text-xs font-bold text-[#001e40] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button 
                  onClick={() => setShowDetail(null)}
                  className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  Tutup Detail
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
