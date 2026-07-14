/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from 'react';
import { createPortal } from 'react-dom';
import { Scholarship } from '../types';
import { Search, Calendar, Landmark, CheckCircle, Info, PhoneCall, ChevronDown, ChevronUp, AlertCircle, Sparkles, FileText, Upload } from 'lucide-react';
import { SupabaseService } from '../services/supabaseService';

interface ScholarshipViewProps {
  scholarships: Scholarship[];
}

export default function ScholarshipView({ scholarships }: ScholarshipViewProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedType, setSelectedType] = React.useState<'semua' | 'internal' | 'pemerintah' | 'swasta'>('semua');
  const [selectedScholarship, setSelectedScholarship] = React.useState<Scholarship | null>(null);
  
  // Student session state
  const [studentSession, setStudentSession] = React.useState<any>(null);
  
  // Application form state
  const [showApplyModal, setShowApplyModal] = React.useState(false);
  const [gpa, setGpa] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [documentName, setDocumentName] = React.useState('cv_dan_transkrip_mahasiswa.pdf');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitSuccess, setSubmitSuccess] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const saved = localStorage.getItem('upb_mahasiswa_session');
    if (saved) {
      try {
        setStudentSession(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Accordion state (FAQ)
  const [faqOpenIndex, setFaqOpenIndex] = React.useState<number | null>(null);

  // Consulting simulation state
  const [consultForm, setConsultForm] = React.useState({ name: '', nim: '', email: '', topic: 'KIP-Kuliah', message: '' });
  const [consultSubmitted, setConsultSubmitted] = React.useState(false);

  const filteredScholarships = scholarships.filter((s) => {
    const matchesSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.provider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'semua' || s.type === selectedType;
    return matchesSearch && matchesType;
  });

  const faqs = [
    {
      q: 'Apakah diperbolehkan menerima dua jenis beasiswa sekaligus secara bersamaan?',
      a: 'Berdasarkan regulasi umum Direktorat Kemahasiswaan UPB, mahasiswa dilarang menerima pendanaan ganda (double funding) dari sumber eksternal maupun kementerian. Namun, beasiswa yayasan atau potongan prestasi internal boleh disinergikan dengan regulasi ketat tertentu.'
    },
    {
      q: 'Bagaimana jika IPK saya menurun di bawah ambang batas minimal penerima beasiswa?',
      a: 'Akan dilakukan evaluasi berkala di setiap akhir semester genap. Mahasiswa yang IPK-nya turun dari kriteria minimal (misal 3.00 untuk KIP-K atau 3.75 untuk beasiswa internal) akan diberikan masa pembinaan 1 semester sebelum hak pendanaanya ditangguhkan sementara.'
    },
    {
      q: 'Kapan batas pengumpulan berkas fisik aplikasi Beasiswa KIP-Kuliah?',
      a: 'Berkas fisik asli wajib diserahkan ke Loket Beasiswa Keuangan Gedung Rektorat UPB selambat-lambatnya 5 hari kerja setelah pendaftaran online di akun resmi KIP-K Kemenristekristek ditutup.'
    },
    {
      q: 'Apakah mahasiswa semester akhir masih diperbolehkan mengajukan beasiswa UPB?',
      a: 'Beasiswa Prestasi Akademik UPB pada prinsipnya ditujukan untuk membiayai studi semester aktif berjalan. Mahasiswa semester 8 yang menyisakan hanya penulisan Skripsi tetap diperkenankan mendaftar khusus beasiswa penunjang riset akhir yayasan.'
    }
  ];

  const handleConsultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (consultForm.name && consultForm.nim && consultForm.email) {
      setConsultSubmitted(true);
      setTimeout(() => {
        setConsultSubmitted(false);
        setConsultForm({ name: '', nim: '', email: '', topic: 'KIP-Kuliah', message: '' });
      }, 5000);
    }
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentSession || !selectedScholarship) return;
    
    const parsedGpa = parseFloat(gpa);
    if (isNaN(parsedGpa) || parsedGpa < 0 || parsedGpa > 4.0) {
      setSubmitError('IPK harus berupa angka antara 0.00 dan 4.00');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await SupabaseService.submitScholarshipApplication({
        user_id: studentSession.id,
        scholarship_id: selectedScholarship.id,
        nim: studentSession.nim || '202100123',
        name: studentSession.name,
        major: studentSession.major || 'Teknik Informatika',
        gpa: parsedGpa,
        phone: phone,
        document_url: `https://storage.googleapis.com/dirmawa-docs/${documentName}`
      });
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setShowApplyModal(false);
        setSelectedScholarship(null);
        setGpa('');
        setPhone('');
      }, 3000);
    } catch (err: any) {
      console.error(err);
      if (err?.message?.includes('unique') || err?.message?.includes('duplicate')) {
        setSubmitError('Anda sudah mengirimkan pendaftaran untuk beasiswa ini sebelumnya.');
      } else {
        setSubmitError(err?.message || 'Gagal mengirim pendaftaran beasiswa.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-12">
      
      {/* Header section with clean, elegant styling */}
      <div className="text-center space-y-3">
        <span className="font-mono text-xs font-black uppercase tracking-widest text-[#feb234] block">SIPMA BEASISWA</span>
        <h1 className="font-sans font-black text-3xl sm:text-4xl text-[#001e40] tracking-tight">Portal Informasi Beasiswa</h1>
        <p className="text-sm sm:text-base text-slate-505 max-w-2xl mx-auto font-sans leading-relaxed">
          Cari dan temukan kesempatan pembiayaan pendidikan yang diselenggarakan oleh Kementerian, Pemerintah Daerah, Yayasan UPB, maupun Perusahaan Swasta.
        </p>
      </div>

      {/* Main Grid Filters & Search (White container, light theme) */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Categories chips */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {['semua', 'internal', 'pemerintah', 'swasta'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type as any)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-sans font-extrabold tracking-wide transition-all uppercase ${
                selectedType === type
                  ? 'bg-[#feb234] text-[#001e40] shadow-md'
                  : 'bg-slate-50 text-slate-500 border border-slate-200 hover:text-[#001e40] hover:bg-slate-100'
              }`}
            >
              {type === 'semua' ? 'Semua Beasiswa' :
            type === 'internal' ? 'Beasiswa Internal' :
            type === 'pemerintah' ? 'Beasiswa Pemerintah' :
            type === 'swasta' ? 'Beasiswa Swasta' : type
          }
            </button>
          ))}
        </div>

        {/* Search Input styling */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Cari beasiswa atau penyedia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-sans text-slate-800 placeholder-slate-450 focus:outline-none focus:border-[#001e40] focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Grid of Scholarship cards */}
      {filteredScholarships.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl text-slate-505 space-y-2.5 shadow-sm">
          <AlertCircle className="mx-auto text-[#feb234]" size={36} />
          <p className="font-sans font-black text-slate-800">Beasiswa tidak ditemukan</p>
          <p className="text-xs">Coba cari kata kunci lain atau ubah filter tipe beasiswa.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredScholarships.map((s) => (
            <div 
              key={s.id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col justify-between shadow-sm"
            >
              <div>
                <div 
                  className="h-48 w-full bg-cover bg-center"
                  style={{ backgroundImage: `url('${s.bannerImage}')`, referrerPolicy: 'no-referrer' } as React.CSSProperties}
                />
                <div className="p-6 space-y-4">
                  <div className="flex items-center space-x-2.5 text-xs font-mono">
                    <span className="bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded-md uppercase font-bold text-[9px]">
                      {s.type}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[#feb234] font-extrabold">{s.provider}</span>
                  </div>
                  
                  <h3 className="font-sans font-black text-lg text-[#001e40] tracking-tight">{s.title}</h3>
                  <p className="text-xs text-slate-505 font-sans leading-relaxed line-clamp-3">{s.description}</p>
                  
                  <div className="space-y-2 text-xs font-sans text-slate-600 pt-1">
                    <div className="flex items-center space-x-2">
                      <CheckCircle size={14} className="text-[#feb234] flex-shrink-0" />
                      <span className="font-bold text-slate-800">Sifat Bantuan:</span>
                      <span className="text-slate-650">{s.fundingAmount}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar size={14} className="text-[#feb234] flex-shrink-0" />
                      <span className="font-bold text-slate-800">Deadline Registrasi:</span>
                      <span className="text-red-650 font-mono font-bold bg-red-100/35 px-2 py-0.5 rounded border border-red-200/50">{s.registrationDeadline}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6 pt-3 border-t border-slate-100 flex">
                <button
                  onClick={() => setSelectedScholarship(s)}
                  className="w-full py-3 bg-[#001e40] hover:bg-[#002d61] text-white font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-sm active:scale-95"
                >
                  Syarat & Alur Beasiswa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Consulting Call to Action & FAQs Dual Col (Light structured layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
        
        {/* FAQs list (Left 3/5 with pure light cards) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="space-y-1">
            <span className="font-mono text-xs font-black uppercase text-[#feb234]">Pusat Bantuan Informasi</span>
            <h2 className="font-sans font-extrabold text-2xl text-[#001e40] tracking-tight">Pertanyaan yang Sering Diajukan (FAQ)</h2>
          </div>

          <div className="space-y-3 font-sans">
            {faqs.map((faq, index) => {
              const isOpen = faqOpenIndex === index;
              return (
                <div 
                  key={index} 
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-all duration-300 shadow-sm"
                >
                  <button
                    onClick={() => setFaqOpenIndex(isOpen ? null : index)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left text-sm font-bold text-slate-800 hover:text-[#feb234]"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-slate-505 leading-relaxed border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Counseling Form (Right 2/5 with pristine light styling) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 blur-2xl pointer-events-none" />
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-[#001e40]">
              <PhoneCall size={20} className="text-[#feb234]" />
              <h3 className="font-sans font-black text-lg text-[#001e40] tracking-tight">Konsultasi Beasiswa</h3>
            </div>
            <p className="text-xs text-slate-505 leading-relaxed font-sans">
              Kesulitan mendaftar KIP atau bingung menentukan jenis beasiswa yang sesuai? Hubungi staf kemahasiswaan tatap muka online secara langsung.
            </p>
          </div>

          {consultSubmitted ? (
            <div className="p-4 bg-yellow-500/10 border border-yellow-350 text-[#feb234] text-xs leading-relaxed rounded-xl font-sans animate-fade-in">
              <span className="font-bold block mb-1">✓ Jadwal Konsultasi Terkirim!</span>
              Sistem telah mendata permohonan Anda. Nomor tiket antrean dan link Zoom online akan dikirimkan ke email Anda dalam waktu 1x24 jam kerja instansi.
            </div>
          ) : (
            <form onSubmit={handleConsultSubmit} className="space-y-4 font-sans text-xs">
              <div className="space-y-1">
                <label className="text-slate-700 block font-bold">Nama Lengkap Mahasiswa</label>
                <input
                  type="text"
                  required
                  value={consultForm.name}
                  onChange={(e) => setConsultForm({ ...consultForm, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-slate-850 focus:outline-none focus:border-[#001e40] focus:bg-white text-xs"
                  placeholder="Contoh: Rian Hidayat"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 block font-bold">NIM Mahasiswa</label>
                  <input
                    type="text"
                    required
                    maxLength={12}
                    value={consultForm.nim}
                    onChange={(e) => setConsultForm({ ...consultForm, nim: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-slate-850 focus:outline-none focus:border-[#001e40] focus:bg-white text-xs"
                    placeholder="312010xxx"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 block font-bold">Jenis Layanan</label>
                  <select
                    value={consultForm.topic}
                    onChange={(e) => setConsultForm({ ...consultForm, topic: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-slate-850 focus:outline-none focus:border-[#001e40] focus:bg-white text-xs font-sans font-bold"
                  >
                    <option value="KIP-Kuliah">KIP-Kuliah</option>
                    <option value="UPB Prestasi">Internal UPB</option>
                    <option value="Djarum">Djarum Plus</option>
                    <option value="Lainnya">Lain-lain</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 block font-bold">Email Aktif Kampus</label>
                <input
                  type="email"
                  required
                  value={consultForm.email}
                  onChange={(e) => setConsultForm({ ...consultForm, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-slate-850 focus:outline-none focus:border-[#001e40] focus:bg-white text-xs"
                  placeholder="rian.h@mhs.upb.ac.id"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 block font-bold">Pesan / Kendala Utama</label>
                <textarea
                  value={consultForm.message}
                  onChange={(e) => setConsultForm({ ...consultForm, message: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-slate-850 focus:outline-none focus:border-[#001e40] focus:bg-white text-xs"
                  placeholder="Jelaskan secara singkat kendala pengumpulan berkas...."
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#001e40] hover:bg-[#002d61] text-white font-bold uppercase rounded-xl shadow font-sans transition-all active:scale-95 text-xs flex items-center justify-center space-x-2"
              >
                <span>Kirim Permohonan Konsultasi</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Details requirements overlay */}
      {selectedScholarship && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in overflow-y-auto" onClick={() => setSelectedScholarship(null)}>
          <div className="bg-white border border-slate-250 w-full max-w-2xl rounded-none sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col h-full sm:h-auto max-h-screen sm:max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <div 
              className="h-44 w-full bg-cover bg-center relative"
              style={{ backgroundImage: `url('${selectedScholarship.bannerImage}')`, referrerPolicy: 'no-referrer' } as React.CSSProperties}
            >
              <button 
                onClick={() => setSelectedScholarship(null)}
                className="absolute top-4 right-4 bg-black/75 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm hover:bg-black transition-all"
              >
                ✕
              </button>
              <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-800">
              <div className="space-y-1 text-left">
                <span className="text-xs font-mono font-bold uppercase text-[#feb234]">{selectedScholarship.provider}</span>
                <h3 className="font-sans font-black text-2xl text-[#001e40] leading-tight">{selectedScholarship.title}</h3>
              </div>

              <div className="space-y-3 font-sans text-left">
                <span className="text-sm font-bold text-[#001e40] block uppercase border-b border-slate-100 pb-1.5">Persyaratan Berkas</span>
                <ul className="space-y-2.5 text-xs text-slate-650 list-inside list-disc">
                  {selectedScholarship.requirements.map((req, index) => (
                    <li key={index} className="leading-relaxed">{req}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3 font-sans text-left">
                <span className="text-sm font-bold text-[#001e40] block uppercase border-b border-slate-100 pb-1.5">Kelengkapan Manfaat &amp; Subsidi</span>
                <ul className="space-y-2.5 text-xs text-slate-650">
                  {selectedScholarship.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle size={15} className="text-[#feb234] flex-shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center space-x-3 text-xs text-slate-500 leading-relaxed font-sans text-left">
                <Info size={18} className="text-[#feb234] flex-shrink-0" />
                <span>
                  Batas akhir formulir online ditutup pada <strong className="text-slate-800">{selectedScholarship.registrationDeadline}</strong>. Seluruh berkas scan wajib digabungkan dalam format PDF berstandar.
                </span>
              </div>
            </div>

            <div className="bg-slate-100 border-t border-slate-200 px-6 py-4 flex justify-between items-center flex-shrink-0 select-none">
              <span className="text-[10px] font-mono font-bold text-[#feb234] uppercase tracking-wide">Pintu SIPMA UPB</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedScholarship(null)}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-sans font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer"
                >
                  Tutup Review
                </button>
                {studentSession ? (
                  <button
                    onClick={() => setShowApplyModal(true)}
                    className="bg-[#feb234] hover:bg-[#e09c2a] text-[#001e40] font-sans font-black text-xs px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Sparkles size={14} />
                    Daftar Sekarang
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedScholarship(null);
                      window.location.hash = '#/mahasiswa';
                    }}
                    className="bg-[#001e40] hover:bg-[#002d61] text-white font-sans font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5"
                  >
                    Login Mahasiswa untuk Mendaftar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Scholarship application form modal */}
      {showApplyModal && selectedScholarship && createPortal(
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto" onClick={() => setShowApplyModal(false)}>
          <div className="bg-white border border-slate-250 w-full max-w-md rounded-none sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col h-full sm:h-auto max-h-screen sm:max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-sans font-black text-lg text-[#001e40]">Formulir Pendaftaran Beasiswa</h3>
              <button 
                onClick={() => setShowApplyModal(false)}
                className="text-slate-400 hover:text-slate-650 font-bold"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleApplySubmit} className="p-6 space-y-4 font-sans text-xs flex-1 overflow-y-auto">
              <div className="bg-[#feb234]/10 border border-[#feb234]/20 p-3 rounded-xl text-slate-800 flex flex-col gap-1 text-left">
                <span className="font-bold text-[#001e40]">{selectedScholarship.title}</span>
                <span className="text-[10px] text-slate-500 font-medium">Penyelenggara: {selectedScholarship.provider}</span>
              </div>

              {submitSuccess ? (
                <div className="p-4 bg-yellow-500/10 border border-yellow-350 text-[#feb234] leading-relaxed rounded-xl font-bold text-center animate-fade-in">
                  ✓ Berkas Pendaftaran Berhasil Dikirim!
                  <span className="block font-medium text-[10px] text-slate-400 mt-1">Status pengajuan dapat Anda pantau berkala pada Dasbor Akun Mahasiswa Anda.</span>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                    <div className="space-y-1">
                      <label className="text-slate-700 block font-bold">Nama Lengkap</label>
                      <input
                        type="text"
                        disabled
                        value={studentSession?.name || 'Dewa Wicaksana'}
                        className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3.5 py-2 text-slate-500 cursor-not-allowed"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-700 block font-bold">NIM</label>
                      <input
                        type="text"
                        disabled
                        value={studentSession?.nim || '202100123'}
                        className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3.5 py-2 text-slate-500 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-slate-700 block font-bold">Program Studi</label>
                    <input
                      type="text"
                      disabled
                      value={studentSession?.major || 'Teknik Informatika'}
                      className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3.5 py-2 text-slate-500 cursor-not-allowed"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                    <div className="space-y-1">
                      <label className="text-slate-700 block font-bold">Indeks Prestasi Kumulatif (IPK) *</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0.00"
                        max="4.00"
                        required
                        placeholder="Contoh: 3.75"
                        value={gpa}
                        onChange={(e) => setGpa(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-slate-800 focus:outline-none focus:border-[#001e40] focus:bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-700 block font-bold">No. Handphone (WA) *</label>
                      <input
                        type="tel"
                        required
                        placeholder="0812xxxxxxxx"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-slate-850 focus:outline-none focus:border-[#001e40] focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-slate-700 block font-bold">Dokumen Pendukung (CV &amp; Transkrip Nilai) *</label>
                    <div className="border-2 border-dashed border-slate-250 p-4 rounded-xl flex flex-col items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100/50 transition-colors">
                      <Upload size={24} className="text-slate-450" />
                      <span className="font-bold text-slate-700">{documentName}</span>
                      <span className="text-[10px] text-slate-400">PDF, Maksimal 5MB (Disimulasikan)</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-[#001e40] hover:bg-[#002d61] disabled:bg-slate-300 text-white font-bold uppercase rounded-xl shadow font-sans transition-all active:scale-95 text-xs flex items-center justify-center space-x-2 cursor-pointer mt-2"
                  >
                    <span>{isSubmitting ? 'Mengirim...' : 'Kirim Pendaftaran Beasiswa'}</span>
                  </button>
                </>
              )}
            </form>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
