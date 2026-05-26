/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from 'react';
import { Scholarship, UKM, Achievement, AlumniRecord, StudentNews } from '../types';
import { Shield, Plus, Edit2, Trash2, BookOpen, Users, Award, FileText, Landmark, CheckCircle, Save } from 'lucide-react';
import { SupabaseService } from '../services/supabaseService';

interface AdminViewProps {
  scholarships: Scholarship[];
  setScholarships: React.Dispatch<React.SetStateAction<Scholarship[]>>;
  ukms: UKM[];
  setUkms: React.Dispatch<React.SetStateAction<UKM[]>>;
  achievements: Achievement[];
  setAchievements: React.Dispatch<React.SetStateAction<Achievement[]>>;
  news: StudentNews[];
  setNews: React.Dispatch<React.SetStateAction<StudentNews[]>>;
  alumni: AlumniRecord[];
  setAlumni: React.Dispatch<React.SetStateAction<AlumniRecord[]>>;
}

type AdminTab = 'scholarships' | 'ukms' | 'achievements' | 'news' | 'alumni';

export default function AdminView({
  scholarships, setScholarships,
  ukms, setUkms,
  achievements, setAchievements,
  news, setNews,
  alumni, setAlumni
}: AdminViewProps) {
  const [activeTab, setActiveTab] = React.useState<AdminTab>('scholarships');
  
  // Status message state
  const [statusMessage, setStatusMessage] = React.useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // General Edit state
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [isAdding, setIsAdding] = React.useState<boolean>(false);

  // Scholarship form state
  const [scholarshipForm, setScholarshipForm] = React.useState<Partial<Scholarship>>({
    title: '', type: 'pemerintah', provider: '', description: '', fundingAmount: '', registrationDeadline: '', requirements: [''], benefits: [''], bannerImage: ''
  });

  // UKM form state
  const [ukmForm, setUkmForm] = React.useState<Partial<UKM>>({
    name: '', category: 'Seni & Budaya', description: '', shortDescription: '', vision: '', mission: [''], schedule: [{ day: '', time: '', activity: '' }], requirements: [''], activeMembers: 10, coverImage: '', logoImage: '', contacts: [{ role: '', name: '', contact: '' }]
  });

  // Achievement form state
  const [achievementForm, setAchievementForm] = React.useState<Partial<Achievement>>({
    title: '', studentName: '', major: '', level: 'Nasional', rank: '', category: 'Akademik', year: 2024, description: '', image: ''
  });

  // News form state
  const [newsForm, setNewsForm] = React.useState<Partial<StudentNews>>({
    title: '', summary: '', description: '', category: 'Berita', date: '', image: ''
  });

  // Alumni form state
  const [alumniForm, setAlumniForm] = React.useState<Partial<AlumniRecord>>({
    name: '', graduationYear: 2024, major: 'Teknik Informatika', status: 'Bekerja', company: '', position: ''
  });

  const triggerMessage = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleOpenAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    // Reset forms
    setScholarshipForm({ title: '', type: 'pemerintah', provider: '', description: '', fundingAmount: '', registrationDeadline: '', requirements: [''], benefits: [''], bannerImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop' });
    setUkmForm({ name: '', category: 'Seni & Budaya', description: '', shortDescription: '', vision: '', mission: [''], schedule: [{ day: 'Senin', time: '16.00', activity: 'Latihan' }], requirements: [''], activeMembers: 10, coverImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop', logoImage: '', contacts: [{ role: 'Ketua', name: '', contact: '' }] });
    setAchievementForm({ title: '', studentName: '', major: 'Teknik Informatika', level: 'Nasional', rank: '', category: 'Akademik', year: 2024, description: '', image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=300&auto=format&fit=crop' });
    setNewsForm({ title: '', summary: '', description: '', category: 'Berita', date: '2024-05-22', image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=300&auto=format&fit=crop' });
    setAlumniForm({ name: '', graduationYear: 2024, major: 'Teknik Informatika', status: 'Bekerja', company: '', position: '' });
  };

  const handleEditOpen = (item: any) => {
    setEditingId(item.id);
    setIsAdding(false);
    if (activeTab === 'scholarships') setScholarshipForm(item);
    if (activeTab === 'ukms') setUkmForm(item);
    if (activeTab === 'achievements') setAchievementForm(item);
    if (activeTab === 'news') setNewsForm(item);
    if (activeTab === 'alumni') setAlumniForm(item);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus data ini?')) return;
    
    try {
      if (activeTab === 'scholarships') {
        await SupabaseService.deleteScholarship(id);
        setScholarships(scholarships.filter(s => s.id !== id));
        triggerMessage('Beasiswa berhasil dihapus!');
      } else if (activeTab === 'ukms') {
        await SupabaseService.deleteUkm(id);
        setUkms(ukms.filter(u => u.id !== id));
        triggerMessage('UKM berhasil dihapus!');
      } else if (activeTab === 'achievements') {
        await SupabaseService.deleteAchievement(id);
        setAchievements(achievements.filter(a => a.id !== id));
        triggerMessage('Apresiasi Prestasi berhasil dihapus!');
      } else if (activeTab === 'news') {
        await SupabaseService.deleteNewsArticle(id);
        setNews(news.filter(n => n.id !== id));
        triggerMessage('Kanal berita berhasil dihapus!');
      } else if (activeTab === 'alumni') {
        await SupabaseService.deleteAlumni(id);
        setAlumni(alumni.filter(a => a.id !== id));
        triggerMessage('Data Rekaman alumni berhasil dihapus!');
      }
    } catch (err) {
      console.error(err);
      triggerMessage('Gagal menghapus data dari database', 'error');
    }
  };

  const handleSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (activeTab === 'scholarships') {
        if (isAdding) {
          const item: Scholarship = {
            ...(scholarshipForm as Scholarship),
            id: crypto.randomUUID()
          };
          await SupabaseService.saveScholarship(item, true);
          setScholarships([item, ...scholarships]);
          triggerMessage('Beasiswa baru berhasil ditambahkan!');
        } else {
          const item = { ...scholarshipForm } as Scholarship;
          await SupabaseService.saveScholarship(item, false);
          setScholarships(scholarships.map(s => s.id === editingId ? item : s));
          triggerMessage('Beasiswa berhasil diperbarui!');
        }
      } else if (activeTab === 'ukms') {
        if (isAdding) {
          const item: UKM = {
            ...(ukmForm as UKM),
            id: crypto.randomUUID()
          };
          await SupabaseService.saveUkm(item, true);
          setUkms([item, ...ukms]);
          triggerMessage('UKM Baru berhasil ditambahkan!');
        } else {
          const item = { ...ukmForm } as UKM;
          await SupabaseService.saveUkm(item, false);
          setUkms(ukms.map(u => u.id === editingId ? item : u));
          triggerMessage('Profil UKM berhasil disimpan!');
        }
      } else if (activeTab === 'achievements') {
        if (isAdding) {
          const item: Achievement = {
            ...(achievementForm as Achievement),
            id: crypto.randomUUID()
          };
          await SupabaseService.saveAchievement(item, true);
          setAchievements([item, ...achievements]);
          triggerMessage('Prestasi baru berhasil dilaporkan!');
        } else {
          const item = { ...achievementForm } as Achievement;
          await SupabaseService.saveAchievement(item, false);
          setAchievements(achievements.map(a => a.id === editingId ? item : a));
          triggerMessage('Data Prestasi diperbarui!');
        }
      } else if (activeTab === 'news') {
        if (isAdding) {
          const item: StudentNews = {
            ...(newsForm as StudentNews),
            id: crypto.randomUUID()
          };
          await SupabaseService.addStudentNews(item);
          setNews([item, ...news]);
          triggerMessage('Kanal Berita baru berhasil diunggah!');
        } else {
          const item = { ...newsForm } as StudentNews;
          await SupabaseService.updateStudentNews(editingId!, item);
          setNews(news.map(n => n.id === editingId ? { ...n, ...item } as StudentNews : n));
          triggerMessage('Konten Berita berhasil disimpan!');
        }
      } else if (activeTab === 'alumni') {
        if (isAdding) {
          const item: AlumniRecord = {
            ...(alumniForm as AlumniRecord),
            id: crypto.randomUUID()
          };
          await SupabaseService.saveAlumni(item, true);
          setAlumni([item, ...alumni]);
          triggerMessage('Tracer alumni manual berhasil ditambahkan!');
        } else {
          const item = { ...alumniForm } as AlumniRecord;
          await SupabaseService.saveAlumni(item, false);
          setAlumni(alumni.map(a => a.id === editingId ? item : a));
          triggerMessage('Tracer alumni berhasil diperbarui!');
        }
      }

      setIsAdding(false);
      setEditingId(null);
    } catch (err) {
      console.error(err);
      triggerMessage('Gagal menyimpan data ke database', 'error');
    }
  };

  return (
    <div id="admin" className="space-y-10">
      
      {/* Title Header with light parameters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-6 gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center space-x-2 bg-yellow-50 text-[#feb234] border border-yellow-250 px-3.5 py-1.5 rounded-full text-xs font-sans font-extrabold uppercase">
            <Shield size={13} />
            <span>Hak Akses Biro Kemahasiswaan</span>
          </div>
          <h1 className="font-sans font-black text-3xl sm:text-4xl text-[#001e40] tracking-tight">Portal Admin</h1>
        </div>
        
        {!isAdding && !editingId && (
          <button
            onClick={handleOpenAdd}
            className="px-5 py-3 bg-[#001e40] hover:bg-[#002d61] text-white rounded-xl font-sans font-bold text-xs uppercase tracking-wider flex items-center space-x-2 shadow-sm transition duration-300"
          >
            <Plus size={16} className="text-[#feb234]" />
            <span>Tambah Data Baru</span>
          </button>
        )}
      </div>

      {statusMessage && (
        <div className={`p-4 rounded-xl flex items-center space-x-3 text-xs font-sans leading-relaxed border animate-fade-in ${
          statusMessage.type === 'success'
            ? 'bg-emerald-50 text-emerald-700 border-emerald-250'
            : 'bg-red-50 text-red-750 border-red-250'
        }`}>
          <CheckCircle size={16} />
          <span className="font-bold">{statusMessage.text}</span>
        </div>
      )}

      {/* TABS SELECT */}
      {!isAdding && !editingId && (
        <div className="grid grid-cols-2 sm:grid-cols-5 bg-white border border-slate-200 p-2 rounded-2xl gap-2 font-sans shadow-sm">
          {[
            { id: 'scholarships', label: 'Beasiswa', icon: BookOpen },
            { id: 'ukms', label: 'Profil UKM', icon: Users },
            { id: 'achievements', label: 'Prestasi', icon: Award },
            { id: 'news', label: 'Berita', icon: FileText },
            { id: 'alumni', label: 'Data Alumni', icon: Landmark }
          ].map(tab => {
            const Icon = tab.icon;
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as AdminTab);
                  setIsAdding(false);
                  setEditingId(null);
                }}
                className={`flex items-center justify-center space-x-2.5 py-3 px-2 rounded-xl text-xs font-bold tracking-wide transition-all uppercase ${
                  isTabActive
                    ? 'bg-[#feb234] text-[#001e40] shadow-sm'
                    : 'bg-transparent text-slate-500 hover:text-[#001e40] hover:bg-slate-50'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* ADD / EDIT DYNAMIC FORMS LAYOUT (Pristine Light Form styling) */}
      {(isAdding || editingId) ? (
        <div className="bg-white border border-slate-200 p-8 rounded-3xl space-y-6 shadow-sm animate-fade-in">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4 text-slate-800">
            <h3 className="font-sans font-black text-[#001e40] text-xl">
              {isAdding ? 'Tambah Data' : 'Sunting Data'} — <span className="text-[#feb234] uppercase">{activeTab}</span>
            </h3>
            <button
              onClick={() => {
                setIsAdding(false);
                setEditingId(null);
              }}
              className="text-xs font-sans font-bold text-slate-500 hover:text-[#001e40] bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-lg"
            >
              Batal
            </button>
          </div>

          <form onSubmit={handleSaveSubmit} className="space-y-6 font-sans text-xs text-slate-800">
            
            {/* 1. BEASISWA FORM */}
            {activeTab === 'scholarships' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block">Judul Beasiswa</label>
                  <input
                    type="text" required value={scholarshipForm.title} onChange={e => setScholarshipForm({ ...scholarshipForm, title: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-slate-800 font-sans text-xs focus:border-[#001e40]"
                    placeholder="Judul Beasiswa"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block">Penyedia Beasiswa / Yayasan</label>
                  <input
                    type="text" required value={scholarshipForm.provider} onChange={e => setScholarshipForm({ ...scholarshipForm, provider: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-slate-800 font-sans text-xs focus:border-[#001e40]"
                    placeholder="Contoh: Kemendikbudristek"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block">Klasifikasi Beasiswa</label>
                  <select
                    value={scholarshipForm.type} onChange={e => setScholarshipForm({ ...scholarshipForm, type: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-slate-800 font-sans text-xs focus:border-[#001e40]"
                  >
                    <option value="pemerintah">Pemerintah</option>
                    <option value="internal">Internal Yayasan UPB</option>
                    <option value="swasta">Mitra Swasta</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block">Format Bantuan Pendanaan</label>
                  <input
                    type="text" required value={scholarshipForm.fundingAmount} onChange={e => setScholarshipForm({ ...scholarshipForm, fundingAmount: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-slate-800 font-sans text-xs focus:border-[#001e40]"
                    placeholder="Contoh: Dana SPP 100% Bebas"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block">Batas Akhir / Deadline</label>
                  <input
                    type="text" required value={scholarshipForm.registrationDeadline} onChange={e => setScholarshipForm({ ...scholarshipForm, registrationDeadline: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-slate-800 font-sans text-xs"
                    placeholder="Contoh: 30 September 2024"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block">Link Foto Sampul Banner</label>
                  <input
                    type="text" value={scholarshipForm.bannerImage} onChange={e => setScholarshipForm({ ...scholarshipForm, bannerImage: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-slate-800 font-sans text-xs"
                    placeholder="Link gambar web..."
                  />
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-slate-700 font-bold block">Deskripsi Utama Beasiswa</label>
                  <textarea
                    rows={3} required value={scholarshipForm.description} onChange={e => setScholarshipForm({ ...scholarshipForm, description: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-slate-800 font-sans text-xs focus:border-[#001e40]"
                    placeholder="Tuliskan gambaran umum rincian program beasiswa..."
                  />
                </div>
              </div>
            )}

            {/* 2. UKM FORM */}
            {activeTab === 'ukms' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block">Nama UKM / Organisasi</label>
                  <input
                    type="text" required value={ukmForm.name} onChange={e => setUkmForm({ ...ukmForm, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-slate-800 font-sans text-xs focus:border-[#001e40]"
                    placeholder="Misal: UKM Basket Ultra"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block">Kategori Peminatan</label>
                  <select
                    value={ukmForm.category} onChange={e => setUkmForm({ ...ukmForm, category: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-slate-800 font-sans text-xs focus:border-[#001e40]"
                  >
                    <option value="Seni & Budaya">Seni & Budaya</option>
                    <option value="Olahraga">Olahraga</option>
                    <option value="Akademik">Akademik / Riset</option>
                    <option value="Sosial">Sosial Kemanusiaan</option>
                    <option value="Kerohanian">Kerohanian</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block">Slogan / Keterangan Singkat</label>
                  <input
                    type="text" required value={ukmForm.shortDescription} onChange={e => setUkmForm({ ...ukmForm, shortDescription: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-slate-800 font-sans text-xs focus:border-[#001e40]"
                    placeholder="Keterangan singkat"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block">Jumlah Kader Aktif</label>
                  <input
                    type="number" required value={ukmForm.activeMembers} onChange={e => setUkmForm({ ...ukmForm, activeMembers: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-slate-800 font-sans text-xs"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-slate-700 font-bold block">Visi UKM</label>
                  <input
                    type="text" required value={ukmForm.vision} onChange={e => setUkmForm({ ...ukmForm, vision: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-slate-800 font-sans text-xs"
                    placeholder="Visi UKM"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-slate-700 font-bold block">Profil Deskripsi Lengkap</label>
                  <textarea
                    rows={3} required value={ukmForm.description} onChange={e => setUkmForm({ ...ukmForm, description: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-slate-800 font-sans text-xs"
                  />
                </div>
              </div>
            )}

            {/* 3. TROPHY PRESTASI FORM */}
            {activeTab === 'achievements' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs font-sans">
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block">Judul Prestasi / Kejuaraan</label>
                  <input
                    type="text" required value={achievementForm.title} onChange={e => setAchievementForm({ ...achievementForm, title: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-slate-800 font-sans text-xs focus:border-[#feb234]"
                    placeholder="Contoh: Juara 1 Robotik Nasional"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block">Nama Lengkap Peraih / Ketua</label>
                  <input
                    type="text" required value={achievementForm.studentName} onChange={e => setAchievementForm({ ...achievementForm, studentName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-slate-800 font-sans text-xs focus:border-[#feb234]"
                    placeholder="Contoh: Rian Hidayat"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block">Program Studi Mahasiswa</label>
                  <input
                    type="text" required value={achievementForm.major} onChange={e => setAchievementForm({ ...achievementForm, major: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-slate-800 font-sans text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block">Raihan Podium / Rank</label>
                  <input
                    type="text" required value={achievementForm.rank} onChange={e => setAchievementForm({ ...achievementForm, rank: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-slate-800 font-sans text-xs"
                    placeholder="Contoh: Gold Medal / Juara 1"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block">Kompetisi Scope Level</label>
                  <select
                    value={achievementForm.level} onChange={e => setAchievementForm({ ...achievementForm, level: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-slate-805 font-sans text-xs"
                  >
                    <option value="Internasional">Internasional</option>
                    <option value="Nasional">Nasional</option>
                    <option value="Regional">Regional</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block">Bidang / Kategori</label>
                  <select
                    value={achievementForm.category} onChange={e => setAchievementForm({ ...achievementForm, category: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-slate-805 font-sans text-xs text-xs"
                  >
                    <option value="Akademik">Akademik</option>
                    <option value="Olahraga">Olahraga</option>
                    <option value="Seni & Budaya">Seni & Budaya</option>
                    <option value="Sosial & Kemanusiaan">Sosial & Kemanusiaan</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block">Tahun Berjalan</label>
                  <input
                    type="number" required value={achievementForm.year} onChange={e => setAchievementForm({ ...achievementForm, year: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-slate-800 font-sans text-xs"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-slate-700 font-bold block">Deskripsi Prestasi</label>
                  <textarea
                    rows={3} required value={achievementForm.description} onChange={e => setAchievementForm({ ...achievementForm, description: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-slate-800 font-sans text-xs"
                  />
                </div>
              </div>
            )}

            {/* 4. BERITA KAMPUS FORM */}
            {activeTab === 'news' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs text-slate-800 font-sans">
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block">Judul Berita</label>
                  <input
                    type="text" required value={newsForm.title} onChange={e => setNewsForm({ ...newsForm, title: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-slate-800 font-sans text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block">Tanggal Terbit</label>
                  <input
                    type="date" required value={newsForm.date} onChange={e => setNewsForm({ ...newsForm, date: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-slate-800 font-sans text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block">Klasifikasi Konten</label>
                  <select
                    value={newsForm.category} onChange={e => setNewsForm({ ...newsForm, category: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-slate-805 font-sans text-xs"
                  >
                    <option value="Berita">Berita</option>
                    <option value="Agenda">Agenda</option>
                    <option value="Pengumuman">Pengumuman</option>
                  </select>
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-slate-700 font-bold block">Keterangan Singkat</label>
                  <input
                    type="text" required value={newsForm.summary} onChange={e => setNewsForm({ ...newsForm, summary: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-slate-800 font-sans text-xs"
                    placeholder="Tajuk ringkasan 1 baris"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-slate-700 font-bold block">Konten Berita Lengkap</label>
                  <textarea
                    rows={4} required value={newsForm.description} onChange={e => setNewsForm({ ...newsForm, description: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-slate-800 font-sans text-xs"
                  />
                </div>
              </div>
            )}

            {/* 5. DATABASE REKAMAN ALUMNI FORM */}
            {activeTab === 'alumni' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs text-slate-800 font-sans">
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block">Nama Lengkap Alumni</label>
                  <input
                    type="text" required value={alumniForm.name} onChange={e => setAlumniForm({ ...alumniForm, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-slate-800 font-sans text-xs focus:border-[#feb234]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block">Tahun Kelulusan / Angkatan</label>
                  <input
                    type="number" required value={alumniForm.graduationYear} onChange={e => setAlumniForm({ ...alumniForm, graduationYear: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-slate-800 font-sans text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block">Major Konsentrasi</label>
                  <input
                    type="text" required value={alumniForm.major} onChange={e => setAlumniForm({ ...alumniForm, major: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-slate-800 font-sans text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block">Status Karir Alumni</label>
                  <select
                    value={alumniForm.status} onChange={e => setAlumniForm({ ...alumniForm, status: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-slate-850 font-sans text-xs"
                  >
                    <option value="Bekerja">Bekerja</option>
                    <option value="Wirausaha">Wirausaha / Mandiri</option>
                    <option value="Lanjut Studi">Lanjut Studi (S2)</option>
                    <option value="Mencari Kerja">Mencari Kerja</option>
                  </select>
                </div>
                {alumniForm.status !== 'Mencari Kerja' && (
                  <>
                    <div className="space-y-1">
                      <label className="text-slate-700 font-bold block">Perusahaan / Kampus / Usaha</label>
                      <input
                        type="text" required value={alumniForm.company} onChange={e => setAlumniForm({ ...alumniForm, company: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-slate-800 font-sans text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-700 font-bold block">Jabatan / Konsentrasi</label>
                      <input
                        type="text" required value={alumniForm.position} onChange={e => setAlumniForm({ ...alumniForm, position: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-slate-800 font-sans text-xs"
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {/* BUTTON SUBMIT */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 font-sans">
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setEditingId(null);
                }}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-sans font-bold rounded-xl text-xs"
              >
                Kembali / Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#001e40] hover:bg-[#002d61] text-white font-sans font-bold rounded-xl text-xs uppercase tracking-wider flex items-center space-x-2 active:scale-95 transition"
              >
                <Save size={14} className="text-[#feb234]" />
                <span>Simpan Rekaman</span>
              </button>
            </div>

          </form>
        </div>
      ) : (
        /* TABLE MANAGEMENTS DISPLAY RECORDS BY SELECT TAB (Light dynamic tables) */
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm animate-fade-in text-slate-800 font-sans">
          
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left font-sans text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-sans text-[10px] border-b border-slate-200 uppercase">
                  <th className="px-5 py-4 font-black">Data ID</th>
                  <th className="px-5 py-4 font-black">Informasi Detail</th>
                  <th className="px-5 py-4 font-black">Data Filter</th>
                  <th className="px-5 py-4 font-black text-right">Aksi Biro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 font-sans text-slate-700">
                
                {/* 1. TABLE DISPLAY RECORDS: SCHOLARSHIPS */}
                {activeTab === 'scholarships' && scholarships.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/75 transition">
                    <td className="px-5 py-4 font-mono text-xs text-[#feb234] font-black">#{item.id}</td>
                    <td className="px-5 py-4 max-w-sm">
                      <span className="text-slate-900 font-bold block text-sm">{item.title}</span>
                      <span className="text-slate-400 block text-[10.5px] truncate font-sans">{item.description}</span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded uppercase font-bold text-[9px] block w-fit mb-1">{item.type}</span>
                      <span className="text-slate-500 font-bold text-[10px] block">{item.provider}</span>
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEditOpen(item)} className="p-2 bg-slate-50 border border-slate-200 hover:bg-[#feb234] hover:text-[#001e40] rounded-xl text-slate-600 transition-colors cursor-pointer"><Edit2 size={13} /></button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 bg-slate-50 border border-slate-200 hover:bg-red-650 hover:text-white rounded-xl text-slate-600 transition-colors cursor-pointer"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}

                {/* 2. TABLE DISPLAY RECORDS: UKMs */}
                {activeTab === 'ukms' && ukms.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/75 transition">
                    <td className="px-5 py-4 font-mono text-xs text-[#feb234] font-black">#{item.id}</td>
                    <td className="px-5 py-4 max-w-sm">
                      <span className="text-slate-900 font-bold block text-sm">{item.name}</span>
                      <span className="text-slate-400 block text-[10.5px] truncate">{item.shortDescription}</span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded uppercase font-bold text-[9px] block w-fit mb-1">{item.category}</span>
                      <span className="text-slate-500 font-mono text-[10px] block font-bold">{item.activeMembers} Anggota Baru</span>
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEditOpen(item)} className="p-2 bg-slate-50 border border-slate-200 hover:bg-[#feb234] hover:text-[#001e40] rounded-xl text-slate-600 transition-colors cursor-pointer"><Edit2 size={13} /></button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 bg-slate-50 border border-slate-200 hover:bg-red-650 hover:text-white rounded-xl text-slate-600 transition-colors cursor-pointer"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}

                {/* 3. TABLE DISPLAY RECORDS: ACHIEVEMENTS */}
                {activeTab === 'achievements' && achievements.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/75 transition">
                    <td className="px-5 py-4 font-mono text-xs text-[#feb234] font-black">#{item.id}</td>
                    <td className="px-5 py-4 max-w-sm">
                      <span className="text-slate-900 font-bold block text-sm">{item.title}</span>
                      <span className="text-slate-400 block text-[10.5px] block truncate font-bold">Peraih: {item.studentName} — {item.major}</span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="bg-yellow-50 text-[#feb234] border border-yellow-250 px-2.5 py-0.5 rounded font-mono text-[9px] block w-fit mb-1">{item.level}</span>
                      <span className="text-slate-500 font-sans font-bold text-[10px] block">{item.rank}</span>
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEditOpen(item)} className="p-2 bg-slate-50 border border-slate-200 hover:bg-[#feb234] hover:text-[#001e40] rounded-xl text-slate-600 transition-colors cursor-pointer"><Edit2 size={13} /></button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 bg-slate-50 border border-slate-200 hover:bg-red-650 hover:text-white rounded-xl text-slate-600 transition-colors cursor-pointer"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}

                {/* 4. TABLE DISPLAY RECORDS: NEWS */}
                {activeTab === 'news' && news.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/75 transition">
                    <td className="px-5 py-4 font-mono text-xs text-[#feb234] font-black">#{item.id}</td>
                    <td className="px-5 py-4 max-w-sm">
                      <span className="text-slate-900 font-bold block text-sm">{item.title}</span>
                      <span className="text-slate-400 block text-[10.5px] truncate">{item.summary}</span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded text-[9px] uppercase font-bold block w-fit mb-1">{item.category}</span>
                      <span className="text-slate-500 text-[10px] block font-mono font-bold">{item.date}</span>
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEditOpen(item)} className="p-2 bg-slate-50 border border-slate-200 hover:bg-[#feb234] hover:text-[#001e40] rounded-xl text-slate-600 transition-colors cursor-pointer"><Edit2 size={13} /></button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 bg-slate-50 border border-slate-200 hover:bg-red-650 hover:text-white rounded-xl text-slate-600 transition-colors cursor-pointer"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}

                {/* 5. TABLE DISPLAY RECORDS: ALUMNI */}
                {activeTab === 'alumni' && alumni.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/75 transition">
                    <td className="px-5 py-4 font-mono text-xs text-[#feb234] font-black">#{item.id}</td>
                    <td className="px-5 py-4 max-w-sm">
                      <span className="text-slate-900 font-bold block text-sm">{item.name}</span>
                      <span className="text-slate-400 block text-[10.5px] block font-semibold truncate">{item.major} (Angkatan {item.graduationYear})</span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[10px] uppercase font-bold block w-fit mb-1">{item.status}</span>
                      <span className="text-slate-500 text-[10px] block font-bold">{item.company}</span>
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEditOpen(item)} className="p-2 bg-slate-50 border border-slate-200 hover:bg-[#feb234] hover:text-[#001e40] rounded-xl text-slate-600 transition-colors cursor-pointer"><Edit2 size={13} /></button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 bg-slate-50 border border-slate-200 hover:bg-red-650 hover:text-white rounded-xl text-slate-600 transition-colors cursor-pointer"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}

              </tbody>
            </table>
          </div>
          
        </div>
      )}

    </div>
  );
}
