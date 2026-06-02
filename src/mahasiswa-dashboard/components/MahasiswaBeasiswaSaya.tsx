import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Eye, 
  Sparkles, 
  Clock, 
  TrendingUp, 
  FileText,
  Calendar,
  DollarSign
} from 'lucide-react';

interface TaskItem {
  id: string;
  title: string;
  deadline?: string;
  submittedDate?: string;
  status: string;
  color?: string;
}

export default function MahasiswaBeasiswaSaya() {
  const [tasks, setTasks] = useState<TaskItem[]>([
    {
      id: 'gpa-report',
      title: 'Laporan IPK Semester Ganjil',
      deadline: '15 Mar 2024',
      status: 'pending',
      color: 'bg-amber-50 text-amber-800 border-amber-250 text-amber-600'
    },
    {
      id: 'active-declaration',
      title: 'Surat Pernyataan Keaktifan Kuliah',
      submittedDate: '10 Jan 2024',
      status: 'completed'
    }
  ]);

  const handleUpload = (taskId: string) => {
    alert(`Mengunggah berkas untuk tugas "${taskId === 'gpa-report' ? 'Laporan IPK Semester Ganjil' : 'Surat Pernyataan Keaktifan'}"...`);
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          status: 'completed',
          submittedDate: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
        };
      }
      return task;
    }));
  };

  const history = [
    {
      name: 'Beasiswa PPA (Peningkatan Prestasi Akademik)',
      year: 2023,
      status: 'Selesai',
      amount: 'Rp 5.000.000',
      statusType: 'success'
    },
    {
      name: 'Bantuan Biaya Pendidikan Alumni UPB',
      year: 2022,
      status: 'Tidak Lolos',
      amount: '-',
      statusType: 'failed'
    }
  ];

  const recommendations = [
    {
      id: 'bi',
      name: 'Beasiswa Bank Indonesia 2024',
      type: 'EKSTERNAL',
      deadline: 'Tutup 30 Mar',
      desc: 'Program bantuan biaya pendidikan untuk mahasiswa semester 4-6 dengan IPK minimal 3.25.',
      image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: 'research',
      name: 'Hibah Riset Skripsi Mahasiswa Akhir',
      type: 'INTERNAL',
      deadline: 'Tutup 12 Apr',
      desc: 'Bantuan dana penelitian untuk mahasiswa tingkat akhir UPB yang sedang menyusun tugas akhir.',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: 'global',
      name: 'Global Leader Scholarship Foundation',
      type: 'EKSTERNAL',
      deadline: 'Tutup 25 Mei',
      desc: 'Program pertukaran mahasiswa dan beasiswa internasional ke mitra universitas di Asia Timur.',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      
      {/* Page Header */}
      <section className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
        <h2 className="font-display font-extrabold text-2xl md:text-3xl text-[#001e40] mb-1.5">
          Beasiswa Saya
        </h2>
        <p className="text-sm text-slate-500 font-medium">
          Pantau status, kelola laporan, dan temukan peluang pendanaan pendidikan Anda di Universitas Pelita Bangsa.
        </p>
      </section>

      {/* Dashboard Bento Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Active Scholarship Status Card (Span 8) */}
        <div className="lg:col-span-8 bg-[#001e40] text-white rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-lg flex flex-col justify-between min-h-[300px] border border-[#002d61]">
          {/* Decorative Blur Circle */}
          <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-[#feb234]/10 rounded-full blur-3xl"></div>

          <div className="relative z-10 space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#feb234] text-[#291800] px-3.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase">
                AKTIF
              </span>
              <span className="text-slate-300 text-xs font-mono">ID Beasiswa: SCH-2024-0012</span>
            </div>
            
            <div>
              <h3 className="font-display font-extrabold text-xl md:text-2xl text-white mb-2 leading-snug">
                Beasiswa Unggulan Universitas Pelita Bangsa
              </h3>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-medium max-w-xl">
                Pembebasan biaya kuliah penuh (Uang Kuliah Tunggal) dan pemberian dana pendukung bulanan untuk Semester Genap TA 2024/2025.
              </p>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 gap-4 border-t border-white/10 pt-6 mt-6 text-xs font-sans">
            <div>
              <p className="text-slate-400 font-semibold mb-0.5">Periode Berlaku</p>
              <p className="font-bold text-white flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#feb234]" />
                <span>Feb 2024 - Agu 2024</span>
              </p>
            </div>
            <div>
              <p className="text-slate-400 font-semibold mb-0.5">IPK Minimal (Target)</p>
              <p className="font-bold text-white flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-[#feb234]" />
                <span>3.50 / 4.00</span>
              </p>
            </div>
            <div className="col-span-2 md:col-span-1">
              <p className="text-slate-400 font-semibold mb-0.5">Semester Berjalan</p>
              <p className="font-bold text-[#feb234] uppercase tracking-wide">Semester 4 (Ganjil)</p>
            </div>
          </div>
        </div>

        {/* Task & Document Checklists (Span 4) */}
        <div className="lg:col-span-4 bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h4 className="font-sans font-black text-base text-[#001e40]">Tugas &amp; Dokumen</h4>
              <AlertCircle className="w-5 h-5 text-[#815500]" />
            </div>
            
            <div className="space-y-4">
              {tasks.map(task => (
                <div key={task.id} className={`p-4 rounded-xl border flex gap-3 ${
                  task.status === 'completed' 
                    ? 'bg-emerald-50/50 border-emerald-100 text-emerald-800' 
                    : 'bg-amber-50/60 border-amber-100 text-[#815500]'
                }`}>
                  {task.status === 'completed' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className={`font-bold text-xs ${task.status === 'completed' ? 'text-emerald-800' : 'text-[#291800]'}`}>
                      {task.title}
                    </p>
                    {task.status === 'completed' ? (
                      <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Diterima: {task.submittedDate}</p>
                    ) : (
                      <>
                        <p className="text-[10px] text-amber-600 font-semibold mt-0.5">Batas: {task.deadline}</p>
                        <button 
                          onClick={() => handleUpload(task.id)}
                          className="mt-2 text-[10px] font-bold text-amber-700 bg-white border border-amber-200 px-3 py-1 rounded-lg hover:bg-amber-50 transition-colors shadow-sm cursor-pointer"
                        >
                          Upload Sekarang
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Direktorat Kemahasiswaan UPB
            </span>
          </div>
        </div>

      </section>

      {/* Scholarship History Table */}
      <section className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h4 className="font-sans font-black text-base text-[#001e40]">Riwayat Beasiswa Saya</h4>
          <button 
            onClick={() => alert('Mengekspor berkas riwayat beasiswa ke format PDF...')}
            className="text-xs font-bold text-[#001e40] flex items-center gap-1 hover:underline cursor-pointer"
          >
            <span>Ekspor PDF</span>
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
        
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left font-sans border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-black text-[10px] uppercase border-b border-slate-200">
                <th className="px-6 py-4">Nama Beasiswa</th>
                <th className="px-6 py-4">Tahun Akademik</th>
                <th className="px-6 py-4">Status Pencairan</th>
                <th className="px-6 py-4">Total Nominal</th>
                <th className="px-6 py-4 text-center">Aksi Berkas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 text-slate-700">
              {history.map((record, index) => (
                <tr key={index} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">{record.name}</td>
                  <td className="px-6 py-4 font-semibold text-slate-500">{record.year}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border ${
                      record.statusType === 'success' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        : 'bg-red-50 text-red-700 border-red-100'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold font-mono text-slate-700">{record.amount}</td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => alert(`Membuka berkas arsip beasiswa tahun ${record.year}...`)}
                      className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-[#001e40] transition-colors cursor-pointer"
                      title="Lihat Detail/Arsip"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Scholarship Opportunities Recommendations */}
      <section className="space-y-5">
        <div className="flex justify-between items-center">
          <h4 className="font-sans font-black text-lg text-[#001e40] flex items-center gap-1.5">
            <Sparkles className="w-5 h-5 text-[#815500]" />
            Rekomendasi Peluang Beasiswa
          </h4>
          <a 
            href="#"
            onClick={(e) => { e.preventDefault(); alert('Mengalihkan ke direktori beasiswa eksternal...'); }}
            className="text-xs font-bold text-[#815500] hover:underline"
          >
            Lihat Semua Peluang
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendations.map(rec => (
            <div 
              key={rec.id}
              className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-all group"
            >
              <div className="h-40 overflow-hidden relative border-b border-slate-100">
                <img src={rec.image} alt={rec.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute top-3 left-3 bg-[#001e40]/75 backdrop-blur-sm text-[#feb234] border border-[#feb234]/30 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider">
                  {rec.type}
                </div>
              </div>
              
              <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-1.5 text-slate-450 text-[10px] font-bold mb-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{rec.deadline}</span>
                  </div>
                  <h5 className="font-bold text-sm text-[#001e40] leading-snug group-hover:text-amber-600 transition-colors mb-1.5">
                    {rec.name}
                  </h5>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">
                    {rec.desc}
                  </p>
                </div>
                
                <button 
                  onClick={() => alert(`Mengajukan pendaftaran beasiswa "${rec.name}"...`)}
                  className="w-full py-2.5 bg-[#feb234] hover:bg-[#feb234]/90 text-[#291800] font-bold text-xs rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
                >
                  Daftar Sekarang
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
