import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Search, PlusCircle, Eye, Edit2, Ban, RefreshCw, CheckCircle, Users, Trash2, Upload } from 'lucide-react';
import { UkmRecord } from '../types';

interface OrmawaDirectoryProps {
  ukms: UkmRecord[];
  onAddUkm: (record: Omit<UkmRecord, 'id' | 'updatedAt'>) => void;
  onUpdateUkmStatus: (id: string, status: 'Active' | 'Inactive') => void;
  onEditUkm: (record: UkmRecord) => void;
  onDeleteUkm?: (id: string) => void;
  readOnly?: boolean;
}

const mapCategoryToEnglish = (dbCategory: string): string => {
  if (!dbCategory) return 'Special Interest';
  const c = dbCategory.toLowerCase();
  if (c.includes('seni') || c.includes('budaya') || c.includes('art')) return 'Arts & Culture';
  if (c.includes('olahraga') || c.includes('sport')) return 'Sports';
  if (c.includes('akademik') || c.includes('academic')) return 'Academic';
  if (c.includes('sosial') || c.includes('social')) return 'Social';
  if (c.includes('kerohanian') || c.includes('rohani') || c.includes('relig')) return 'Religious';
  if (c.includes('himpunan') || c.includes('association')) return 'Himpunan';
  return 'Special Interest';
};

export default function OrmawaDirectory({ ukms, onAddUkm, onUpdateUkmStatus, onEditUkm, onDeleteUkm, readOnly = false }: OrmawaDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<UkmRecord | null>(null);
  const [showDetailModal, setShowDetailModal] = useState<UkmRecord | null>(null);
  
  // Add Ormawa Form States
  const [newName, setNewName] = useState('');
  const [newCat, setNewCat] = useState('Academic');
  const [newType, setNewType] = useState('Academic & Tech');
  const [newDesc, setNewDesc] = useState('');
  const [newLeader, setNewLeader] = useState('');
  const [newLogoUrl, setNewLogoUrl] = useState('');

  // Edit Ormawa Form States
  const [editName, setEditName] = useState('');
  const [editCat, setEditCat] = useState('Academic');
  const [editType, setEditType] = useState('Academic & Tech');
  const [editDesc, setEditDesc] = useState('');
  const [editLeader, setEditLeader] = useState('');
  const [editLogoUrl, setEditLogoUrl] = useState('');

  // Filtering logic
  const filteredUkms = ukms.filter(ukm => {
    const matchesSearch = ukm.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ukm.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ukm.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || mapCategoryToEnglish(ukm.category) === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'Sports', 'Arts & Culture', 'Academic', 'Social', 'Religious', 'Himpunan', 'Special Interest'];

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Logo image size must not exceed 2MB!");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (isEdit) {
        setEditLogoUrl(base64String);
      } else {
        setNewLogoUrl(base64String);
      }
    };
    reader.readAsDataURL(file);
  };

  const openEditModal = (ukm: UkmRecord) => {
    setShowEditModal(ukm);
    setEditName(ukm.name);
    setEditCat(mapCategoryToEnglish(ukm.category));
    setEditType(ukm.type);
    setEditDesc(ukm.description);
    setEditLeader(ukm.leaderName || '');
    setEditLogoUrl(ukm.logoUrl || '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newDesc || !newLeader) {
      alert("Please fill in all layout fields!");
      return;
    }

    onAddUkm({
      name: newName,
      category: newCat,
      type: newType,
      status: 'Active',
      description: newDesc,
      leaderName: newLeader,
      logoUrl: newLogoUrl || undefined
    });

    // Reset layout form
    setNewName('');
    setNewCat('Academic');
    setNewType('Academic & Tech');
    setNewDesc('');
    setNewLeader('');
    setNewLogoUrl('');
    setShowAddModal(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showEditModal) return;
    if (!editName || !editDesc || !editLeader) {
      alert("Please fill in all fields!");
      return;
    }

    onEditUkm({
      ...showEditModal,
      name: editName,
      category: editCat,
      type: editType,
      description: editDesc,
      leaderName: editLeader,
      logoUrl: editLogoUrl || undefined
    });

    setShowEditModal(null);
  };

  const toggleStatus = (id: string, current: 'Active' | 'Inactive') => {
    const nextStatus = current === 'Active' ? 'Inactive' : 'Active';
    onUpdateUkmStatus(id, nextStatus);
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="font-sans font-black text-3xl text-[#001e40]">Direktori Ormawa</h2>
          <p className="text-sm text-[#43474f] max-w-2xl font-medium mt-1">
            Kelola organisasi kemahasiswaan yang terdaftar, pantau status aktif mereka, dan awasi profil kepemimpinan dalam ekosistem universitas.
          </p>
        </div>
        {!readOnly && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#001e40] hover:bg-[#1f477b] text-white font-bold text-sm px-6 py-3 rounded-xl flex items-center gap-2 transition-colors shadow-sm cursor-pointer whitespace-nowrap"
          >
            <PlusCircle size={18} />
            Tambah Ormawa Baru
          </button>
        )}
      </div>

      {/* Toolbar Filter / Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#c3c6d1]/40 flex flex-col md:flex-row gap-4 justify-between items-center">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737780]">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Cari berdasarkan nama, tipe, deskripsi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#f2f4f7] text-[#191c1e] text-sm pl-10 pr-4 py-2.5 rounded-xl border border-[#c3c6d1] focus:border-[#001e40] focus:ring-1 focus:ring-[#001e40] transition-all font-medium"
          />
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#feb234] text-[#291800]'
                  : 'bg-[#f2f4f7] text-[#43474f] hover:bg-[#eceef1]'
              }`}
            >
              {cat === 'All' ? 'Semua Organisasi' : 
               cat === 'Sports' ? 'Olahraga' : 
               cat === 'Arts & Culture' ? 'Seni & Budaya' : 
               cat === 'Academic' ? 'Akademik' : 
               cat === 'Social' ? 'Sosial' : 
               cat === 'Religious' ? 'Kerohanian' : 
               cat === 'Himpunan' ? 'Himpunan' :
               cat === 'Special Interest' ? 'Minat Khusus' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Bento Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUkms.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl p-12 border border-[#c3c6d1]/30 text-center">
            <Users size={48} className="text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-700">Tidak ada organisasi yang ditemukan</p>
            <p className="text-xs text-slate-400 mt-1">Coba gunakan filter atau kata kunci pencarian lain.</p>
          </div>
        ) : (
          filteredUkms.map((ukm) => (
            <div
              key={ukm.id}
              className={`bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-[#c3c6d1]/30 flex flex-col justify-between group ${
                ukm.status === 'Inactive' ? 'opacity-70' : ''
              }`}
            >
              <div>
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div className="flex gap-4 items-center min-w-0">
                    <div className="w-14 h-14 rounded-xl bg-[#f2f4f7] border border-[#c3c6d1]/40 flex items-center justify-center overflow-hidden shrink-0">
                      {ukm.logoUrl ? (
                        <img
                          alt={`${ukm.name} logo`}
                          className="w-full h-full object-cover"
                          src={ukm.logoUrl}
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <Users size={28} className="text-[#001e40]" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3
                        onClick={() => setShowDetailModal(ukm)}
                        className="font-headline font-bold text-[#191c1e] text-base leading-tight group-hover:text-[#001e40] transition-colors cursor-pointer truncate"
                      >
                        {ukm.name}
                      </h3>
                      <p className="text-xs font-bold text-[#737780] mt-1 truncate">{ukm.type}</p>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shrink-0 ${
                      ukm.status === 'Active'
                        ? 'bg-[#feb234]/20 text-[#6d4700]'
                        : 'bg-[#eceef1] text-[#43474f]'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        ukm.status === 'Active' ? 'bg-[#feb234]' : 'bg-[#737780]'
                      }`}
                    ></span>
                    {ukm.status === 'Active' ? 'Aktif' : 'Tidak Aktif'}
                  </span>
                </div>

                <p className="text-xs text-[#43474f] font-medium line-clamp-3 mb-5">
                  {ukm.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#eceef1] flex justify-between items-center mt-auto">
                <span className="text-[11px] font-semibold text-[#737780]">
                  Diperbarui: {ukm.updatedAt || '24 Okt 2023'}
                </span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setShowDetailModal(ukm)}
                    className="w-8 h-8 rounded-full bg-[#f2f4f7] hover:bg-[#001e40]/10 text-[#001e40] flex items-center justify-center transition-colors cursor-pointer"
                    title="Lihat Profil"
                  >
                    <Eye size={16} />
                  </button>
                  {!readOnly && (
                    <>
                      <button
                        onClick={() => openEditModal(ukm)}
                        className="w-8 h-8 rounded-full bg-[#f2f4f7] hover:bg-[#001e40]/10 text-[#001e40] flex items-center justify-center transition-colors cursor-pointer"
                        title="Edit Detail"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => toggleStatus(ukm.id, ukm.status)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                          ukm.status === 'Active'
                            ? 'bg-[#f2f4f7] text-[#ba1a1a] hover:bg-[#ffdad6]'
                            : 'bg-green-50 text-green-700 hover:bg-green-200'
                        }`}
                        title={ukm.status === 'Active' ? 'Nonaktifkan' : 'Aktifkan'}
                      >
                        {ukm.status === 'Active' ? <Ban size={14} /> : <CheckCircle size={14} />}
                      </button>
                      {onDeleteUkm && (
                        <button
                          onClick={() => onDeleteUkm(ukm.id)}
                          className="w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 text-[#ba1a1a] flex items-center justify-center transition-colors cursor-pointer"
                          title="Hapus Organisasi"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-8 pt-4 border-t border-[#c3c6d1]/30">
        <span className="text-xs font-semibold text-[#43474f]">
          Menampilkan 1-{filteredUkms.length} dari {ukms.length} organisasi
        </span>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-xl border border-[#c3c6d1] text-[#191c1e] text-xs font-bold hover:bg-[#f2f4f7] disabled:opacity-50 transition-colors" disabled>
            Sebelumnya
          </button>
          <button className="px-4 py-2 rounded-xl border border-[#c3c6d1] text-[#191c1e] text-xs font-bold hover:bg-[#f2f4f7] transition-colors" onClick={() => alert("Semua Ormawa saat ini ditampilkan dalam satu halaman.")}>
            Selanjutnya
          </button>
        </div>
      </div>

      {/* Add Ormawa Modal */}
      {showAddModal && createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#c3c6d1]/40 text-left">
            <h3 className="font-sans font-bold text-xl text-[#001e40] mb-4">Daftarkan Organisasi Kemahasiswaan Baru (Ormawa)</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#43474f] uppercase tracking-wider mb-1">Nama Ormawa</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Futsal Club Pelita Bangsa"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-[#f2f4f7] border border-[#c3c6d1] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#001e40]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#43474f] uppercase tracking-wider mb-1">Kategori</label>
                  <select
                    value={newCat}
                    onChange={(e) => {
                      setNewCat(e.target.value);
                      if (e.target.value === 'Sports') setNewType('Olahraga & Atletik');
                      else if (e.target.value === 'Arts & Culture') setNewType('Seni & Budaya');
                      else if (e.target.value === 'Social') setNewType('Sosial & Komunitas');
                      else if (e.target.value === 'Religious') setNewType('Kerohanian');
                      else if (e.target.value === 'Himpunan') setNewType('Himpunan Mahasiswa');
                      else if (e.target.value === 'Special Interest') setNewType('Minat Khusus');
                      else setNewType('Akademik & Teknologi');
                    }}
                    className="w-full bg-[#f2f4f7] border border-[#c3c6d1] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#001e40]"
                  >
                    <option value="Academic">Akademik</option>
                    <option value="Sports">Olahraga</option>
                    <option value="Arts & Culture">Seni &amp; Budaya</option>
                    <option value="Social">Sosial</option>
                    <option value="Religious">Kerohanian</option>
                    <option value="Himpunan">Himpunan</option>
                    <option value="Special Interest">Minat Khusus</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#43474f] uppercase tracking-wider mb-1">Tipe / Fokus</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Olahraga Lapangan"
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full bg-[#f2f4f7] border border-[#c3c6d1] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#001e40]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#43474f] uppercase tracking-wider mb-1">Nama Ketua Organisasi</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={newLeader}
                  onChange={(e) => setNewLeader(e.target.value)}
                  className="w-full bg-[#f2f4f7] border border-[#c3c6d1] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#001e40]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#43474f] uppercase tracking-wider mb-1">Logo Organisasi</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-[#f2f4f7] border border-[#c3c6d1]/40 flex items-center justify-center overflow-hidden shrink-0">
                    {newLogoUrl ? (
                      <img src={newLogoUrl} alt="Pratinjau logo" className="w-full h-full object-cover" />
                    ) : (
                      <Users size={28} className="text-[#001e40]" />
                    )}
                  </div>
                  <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-[#c3c6d1] rounded-xl p-3 hover:bg-[#f2f4f7]/50 cursor-pointer transition-colors">
                    <div className="flex flex-col items-center justify-center gap-1 text-[#43474f]">
                      <Upload size={20} />
                      <span className="text-xs font-bold text-center">Unggah Logo</span>
                      <span className="text-[10px] text-[#737780] font-medium text-center">Maks 2MB (PNG, JPG)</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleLogoFileChange(e, false)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#43474f] uppercase tracking-wider mb-1">Deskripsi Singkat Ormawa</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Jelaskan tujuan organisasi, jadwal kegiatan, prestasi..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-[#f2f4f7] border border-[#c3c6d1] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#001e40] resize-none"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-[#eceef1]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 border border-[#c3c6d1] text-[#43474f] text-sm font-bold rounded-xl hover:bg-[#f2f4f7] cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#001e40] text-white text-sm font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Buat Ormawa
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Edit Ormawa Modal */}
      {showEditModal && createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#c3c6d1]/40 text-left">
            <h3 className="font-sans font-bold text-xl text-[#001e40] mb-4">Edit Organisasi Kemahasiswaan (Ormawa)</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#43474f] uppercase tracking-wider mb-1">Nama Ormawa</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Futsal Club Pelita Bangsa"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[#f2f4f7] border border-[#c3c6d1] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#001e40]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#43474f] uppercase tracking-wider mb-1">Kategori</label>
                  <select
                    value={editCat}
                    onChange={(e) => {
                      setEditCat(e.target.value);
                      if (e.target.value === 'Sports') setEditType('Olahraga & Atletik');
                      else if (e.target.value === 'Arts & Culture') setEditType('Seni & Budaya');
                      else if (e.target.value === 'Social') setEditType('Sosial & Komunitas');
                      else if (e.target.value === 'Religious') setEditType('Kerohanian');
                      else if (e.target.value === 'Himpunan') setEditType('Himpunan Mahasiswa');
                      else if (e.target.value === 'Special Interest') setEditType('Minat Khusus');
                      else setEditType('Akademik & Teknologi');
                    }}
                    className="w-full bg-[#f2f4f7] border border-[#c3c6d1] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#001e40]"
                  >
                    <option value="Academic">Akademik</option>
                    <option value="Sports">Olahraga</option>
                    <option value="Arts & Culture">Seni &amp; Budaya</option>
                    <option value="Social">Sosial</option>
                    <option value="Religious">Kerohanian</option>
                    <option value="Himpunan">Himpunan</option>
                    <option value="Special Interest">Minat Khusus</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#43474f] uppercase tracking-wider mb-1">Tipe / Fokus</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Olahraga Lapangan"
                    value={editType}
                    onChange={(e) => setEditType(e.target.value)}
                    className="w-full bg-[#f2f4f7] border border-[#c3c6d1] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#001e40]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#43474f] uppercase tracking-wider mb-1">Nama Ketua Organisasi</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={editLeader}
                  onChange={(e) => setEditLeader(e.target.value)}
                  className="w-full bg-[#f2f4f7] border border-[#c3c6d1] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#001e40]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#43474f] uppercase tracking-wider mb-1">Logo Organisasi</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-[#f2f4f7] border border-[#c3c6d1]/40 flex items-center justify-center overflow-hidden shrink-0">
                    {editLogoUrl ? (
                      <img src={editLogoUrl} alt="Pratinjau logo" className="w-full h-full object-cover" />
                    ) : (
                      <Users size={28} className="text-[#001e40]" />
                    )}
                  </div>
                  <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-[#c3c6d1] rounded-xl p-3 hover:bg-[#f2f4f7]/50 cursor-pointer transition-colors">
                    <div className="flex flex-col items-center justify-center gap-1 text-[#43474f]">
                      <Upload size={20} />
                      <span className="text-xs font-bold text-center">Ubah Logo</span>
                      <span className="text-[10px] text-[#737780] font-medium text-center">Maks 2MB (PNG, JPG)</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleLogoFileChange(e, true)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#43474f] uppercase tracking-wider mb-1">Deskripsi</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Jelaskan tujuan organisasi, jadwal kegiatan, prestasi..."
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full bg-[#f2f4f7] border border-[#c3c6d1] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#001e40] resize-none"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-[#eceef1]">
                <button
                  type="button"
                  onClick={() => setShowEditModal(null)}
                  className="px-4 py-2.5 border border-[#c3c6d1] text-[#43474f] text-sm font-bold rounded-xl hover:bg-[#f2f4f7] cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#001e40] text-white text-sm font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Detail Modal */}
      {showDetailModal && createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-fade-in" onClick={() => setShowDetailModal(null)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#c3c6d1]/40 text-left" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-4 mb-4 border-b border-[#eceef1] pb-4">
              <div className="w-16 h-16 rounded-xl bg-[#f2f4f7] border border-[#c3c6d1]/40 flex items-center justify-center overflow-hidden shrink-0">
                {showDetailModal.logoUrl ? (
                  <img src={showDetailModal.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <Users size={28} className="text-[#001e40]" />
                )}
              </div>
              <div>
                <span className="text-xs bg-[#feb234]/15 text-[#6d4700] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border border-[#feb234]/20">
                  {showDetailModal.category === 'Academic' ? 'Akademik' :
                   showDetailModal.category === 'Sports' ? 'Olahraga' :
                   showDetailModal.category === 'Arts & Culture' ? 'Seni & Budaya' :
                   showDetailModal.category === 'Social' ? 'Sosial' :
                   showDetailModal.category === 'Religious' ? 'Kerohanian' :
                   showDetailModal.category === 'Himpunan' ? 'Himpunan' :
                   showDetailModal.category === 'Special Interest' ? 'Minat Khusus' : showDetailModal.category}
                </span>
                <h3 className="font-headline font-bold text-[#001e40] text-lg mt-1">{showDetailModal.name}</h3>
              </div>
            </div>

            <div className="space-y-3 font-medium text-sm text-[#191c1e]">
              <div>
                <p className="text-xs text-[#737780] font-bold uppercase tracking-wider">Subtipe / Tipe</p>
                <p className="text-[#191c1e] text-sm mt-0.5 font-semibold">{showDetailModal.type}</p>
              </div>

              <div>
                <p className="text-xs text-[#737780] font-bold uppercase tracking-wider">Ketua Saat Ini</p>
                <p className="text-[#191c1e] text-sm mt-0.5 font-semibold">{showDetailModal.leaderName || 'Akan Ditentukan'}</p>
              </div>

              <div>
                <p className="text-xs text-[#737780] font-bold uppercase tracking-wider">Status Keaktifan</p>
                <p className="text-[#191c1e] text-sm mt-0.5 font-semibold">{showDetailModal.status === 'Active' ? 'Aktif' : 'Tidak Aktif'}</p>
              </div>

              <div>
                <p className="text-xs text-[#737780] font-bold uppercase tracking-wider">Deskripsi Detail</p>
                <p className="text-[#43474f] text-sm mt-0.5 leading-relaxed">{showDetailModal.description}</p>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-5 border-t border-[#eceef1] mt-5">
              <button
                type="button"
                onClick={() => setShowDetailModal(null)}
                className="px-5 py-2.5 bg-[#001e40] hover:bg-[#1f477b] text-white text-sm font-bold rounded-xl shadow-md cursor-pointer"
              >
                Tutup Profil
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
