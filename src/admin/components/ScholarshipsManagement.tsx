import React, { useState, useEffect } from 'react';
import { Search, HelpCircle, PlusCircle, Sparkles, AlertTriangle, FileText, CheckSquare, Calendar, Edit2, ChevronLeft, ChevronRight, Trash2, X } from 'lucide-react';
import { ScholarshipRecord } from '../types';
import { SupabaseService } from '../../services/supabaseService';

interface ScholarshipsManagementProps {
  scholarships: ScholarshipRecord[];
  onAddScholarship: (record: Omit<ScholarshipRecord, 'id' | 'applicants'>) => void;
  onEditScholarship: (record: ScholarshipRecord) => void;
  onDeleteScholarship?: (id: string) => void;
  readOnly?: boolean;
}

export default function ScholarshipsManagement({ scholarships, onAddScholarship, onEditScholarship, onDeleteScholarship, readOnly = false }: ScholarshipsManagementProps) {
  const [activeTab, setActiveTab] = useState<'All' | 'Internal' | 'External' | 'Government'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);

  // Form input states
  const [newName, setNewName] = useState('');
  const [newProvider, setNewProvider] = useState('');
  const [newDeadline, setNewDeadline] = useState('');
  const [newType, setNewType] = useState<'Internal' | 'External' | 'Government'>('Internal');
  const [newDesc, setNewDesc] = useState('');
  const [newCat, setNewCat] = useState('Internal University');

  // Edit modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ScholarshipRecord | null>(null);
  const [editName, setEditName] = useState('');
  const [editProvider, setEditProvider] = useState('');
  const [editDeadline, setEditDeadline] = useState('');
  const [editType, setEditType] = useState<'Internal' | 'External' | 'Government'>('Internal');
  const [editStatus, setEditStatus] = useState<'Open' | 'Soon' | 'Closed'>('Open');
  const [editDesc, setEditDesc] = useState('');
  const [editCat, setEditCat] = useState('Internal University');

  // Application Stats state
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await SupabaseService.getAdminScholarshipApplications();
        setApplications(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchApplications();
  }, [scholarships]);

  // Calculate actual stats
  const totalApplicants = applications.length;
  const reviewedApplicants = applications.filter(a => a.status !== 'pending').length;

  // Calculate critical deadlines (closest upcoming deadlines that are open)
  const upcomingDeadlines = [...scholarships]
    .filter(s => s.status === 'Open')
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 2);

  // Filter logic
  const filteredScholarships = scholarships.filter(item => {
    const matchesTab = activeTab === 'All' || item.type === activeTab;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Client-side pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  const totalPages = Math.ceil(filteredScholarships.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedScholarships = filteredScholarships.slice(startIndex, startIndex + itemsPerPage);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newProvider || !newDeadline) {
      alert("Please fill in Name, Provider, and Deadline!");
      return;
    }

    onAddScholarship({
      name: newName,
      provider: newProvider,
      deadline: newDeadline,
      status: 'Open',
      type: newType,
      description: newDesc || "No description provided.",
      category: newCat
    });

    // Reset Form
    setNewName('');
    setNewProvider('');
    setNewDeadline('');
    setNewType('Internal');
    setNewDesc('');
    setNewCat('Internal University');
    setShowAddModal(false);
  };

  const handleEdit = (item: ScholarshipRecord) => {
    setEditingRecord(item);
    setEditName(item.name);
    setEditProvider(item.provider);
    setEditDeadline(item.deadline);
    setEditType(item.type);
    setEditStatus(item.status);
    setEditDesc(item.description || '');
    setEditCat(item.category || '');
    setShowEditModal(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;
    onEditScholarship({
      ...editingRecord,
      name: editName,
      provider: editProvider,
      deadline: editDeadline,
      type: editType,
      status: editStatus,
      description: editDesc,
      category: editCat
    });
    setShowEditModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-sans font-black text-3xl text-[#001e40] mb-1">Manajemen Beasiswa</h2>
          <p className="text-sm text-[#43474f] font-medium">Awasi pendaftaran, kelola penyedia, dan perbarui status beasiswa.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={() => setFaqOpen(true)}
            className="flex-1 md:flex-none border border-[#001e40] text-[#001e40] bg-white hover:bg-[#eceef1] font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <HelpCircle size={16} />
            Kelola FAQ
          </button>
          {!readOnly && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex-1 md:flex-none bg-[#001e40] hover:bg-[#1f477b] text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer shadow-[#001e40]/10"
            >
              <PlusCircle size={16} />
              Tambah Beasiswa
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#c3c6d1]/40 flex flex-col md:flex-row gap-4 justify-between items-center">
        
        {/* Category filter chips */}
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {['All', 'Internal', 'External', 'Government'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab
                  ? 'bg-[#001e40] text-white'
                  : 'bg-[#f2f4f7] text-[#43474f] hover:bg-[#eceef1]'
              }`}
            >
              {tab === 'All' ? 'Semua Kategori' : tab}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="w-full md:w-72 flex items-center bg-[#f2f4f7] px-4 py-2.5 rounded-xl border border-[#c3c6d1] focus-within:border-[#001e40]">
          <Search size={18} className="text-[#737780] mr-2" />
          <input
            type="text"
            placeholder="Cari beasiswa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none w-full text-sm text-[#191c1e] focus:ring-0 p-0 font-medium"
          />
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Main Data Table (Spans 2 columns) */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-[#c3c6d1]/45 overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-6 border-b border-[#eceef1] bg-[#f7f9fc] flex justify-between items-center">
              <h3 className="font-sans font-bold text-lg text-[#001e40]">Program Aktif</h3>
              <span className="text-xs text-[#737780] font-semibold">Database pendaftaran aktif</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f2f4f7] text-[#43474f] font-bold text-xs uppercase tracking-wider border-b border-[#c3c6d1]/30">
                    <th className="p-4 pl-6">Nama Beasiswa</th>
                    <th className="p-4">Penyedia</th>
                    <th className="p-4">Batas Waktu</th>
                    <th className="p-4 text-center">Pendaftar</th>
                    <th className="p-4">Status</th>
                    {!readOnly && <th className="p-4 pr-6 text-right">Aksi</th>}
                  </tr>
                </thead>
                <tbody className="text-sm font-medium divide-y divide-[#c3c6d1]/20 text-[#191c1e]">
                  {paginatedScholarships.length === 0 ? (
                    <tr>
                      <td colSpan={readOnly ? 5 : 6} className="text-center py-8 text-slate-400 font-medium text-xs">
                        Tidak ada program beasiswa ditemukan.
                      </td>
                    </tr>
                  ) : (
                    paginatedScholarships.map((item) => (
                      <tr key={item.id} className="hover:bg-[#f2f4f7]/30 transition-colors">
                        <td className="p-4 pl-6">
                          <div className="font-bold text-[#001e40]">{item.name}</div>
                          <div className="text-xs text-[#737780] font-semibold mt-0.5">{item.category}</div>
                        </td>
                        <td className="p-4 text-[#191c1e]">{item.provider}</td>
                        <td className="p-4 text-[#737780]">{item.deadline}</td>
                        <td className="p-4 text-center font-bold text-[#191c1e]">{item.applicants?.toLocaleString() || 0}</td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              item.status === 'Open'
                                ? 'bg-[#feb234]/15 text-[#6d4700] border-[#feb234]/20'
                                : item.status === 'Soon'
                                ? 'bg-[#f2f4f7] text-[#737780] border-[#c3c6d1]/30'
                                : 'bg-[#001e40]/5 text-[#1f477b] border-[#001e40]/10'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                item.status === 'Open'
                                  ? 'bg-[#feb234]'
                                  : item.status === 'Soon'
                                  ? 'bg-[#737780]'
                                  : 'bg-[#001e40]'
                              }`}
                            ></span>
                            {item.status === 'Open' ? 'Buka' : item.status === 'Soon' ? 'Segera' : 'Tutup'}
                          </span>
                        </td>
                        {!readOnly && (
                          <td className="p-4 pr-6 text-right">
                            <div className="flex justify-end gap-1.5">
                              <button
                                onClick={() => handleEdit(item)}
                                className="text-[#737780] hover:text-[#001e40] p-1.5 rounded-lg hover:bg-[#f2f4f7] transition-all cursor-pointer inline-flex items-center justify-center"
                                title="Edit Beasiswa"
                              >
                                <Edit2 size={14} />
                              </button>
                              {onDeleteScholarship && (
                                <button
                                  onClick={() => onDeleteScholarship(item.id)}
                                  className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-all cursor-pointer inline-flex items-center justify-center"
                                  title="Hapus Beasiswa"
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table footer pagination */}
          <div className="p-4 border-t border-[#eceef1] bg-[#f7f9fc] flex justify-between items-center text-xs font-bold text-[#737780]">
            <span>
              Menampilkan {filteredScholarships.length === 0 ? 0 : startIndex + 1} sampai{' '}
              {Math.min(startIndex + itemsPerPage, filteredScholarships.length)} dari{' '}
              {filteredScholarships.length} data
            </span>
            <div className="flex gap-1.5 items-center">
              <button
                className="p-1 rounded hover:bg-[#eceef1] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || totalPages <= 1}
              >
                <ChevronLeft size={16} />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 rounded flex items-center justify-center text-xs transition-colors cursor-pointer ${
                    currentPage === page
                      ? 'bg-[#001e40] text-white'
                      : 'hover:bg-[#eceef1] text-[#191c1e]'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                className="p-1 rounded hover:bg-[#eceef1] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages <= 1}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Side Widgets Panel */}
        <div className="flex flex-col gap-6 text-left">
          
          {/* Quick Stats Widget */}
          <div className="bg-white rounded-2xl p-6 border border-[#c3c6d1]/45 relative overflow-hidden group">
            <h3 className="font-sans font-bold text-[#001e40] text-lg mb-6 relative z-10">Statistik Pendaftaran</h3>
            <div className="space-y-4 relative z-10">
              
              <div className="flex justify-between items-center p-3.5 rounded-xl bg-[#f7f9fc] border border-[#c3c6d1]/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#feb234]/15 flex items-center justify-center text-[#6d4700]">
                    <FileText size={18} />
                  </div>
                  <span className="text-sm font-bold text-[#191c1e]">Total Pendaftar</span>
                </div>
                <span className="font-headline font-bold text-lg text-[#001e40]">{totalApplicants}</span>
              </div>

              <div className="flex justify-between items-center p-3.5 rounded-xl bg-[#f7f9fc] border border-[#c3c6d1]/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#001e40]/5 flex items-center justify-center text-[#001e40]">
                    <CheckSquare size={18} />
                  </div>
                  <span className="text-sm font-bold text-[#191c1e]">Ditinjau</span>
                </div>
                <span className="font-headline font-bold text-lg text-[#001e40]">{reviewedApplicants}</span>
              </div>

            </div>
          </div>

          {/* Upcoming Deadlines Widget */}
          <div className="bg-[#001e40] text-[#799dd6] rounded-2xl p-6 shadow-lg shadow-[#001e40]/20 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute inset-0 bg-gradient-to-br from-[#001e40] to-[#003366] opacity-75 z-0"></div>
            
            <div className="relative z-10 flex justify-between items-center mb-6">
              <h3 className="font-sans font-bold text-base text-white">Batas Waktu Penting</h3>
              <AlertTriangle className="text-[#feb234]" size={18} />
            </div>

            <ul className="relative z-10 space-y-4">
              {upcomingDeadlines.length === 0 ? (
                <li className="text-xs text-white/50 italic py-2">Tidak ada batas waktu aktif</li>
              ) : (
                upcomingDeadlines.map((item, index) => {
                  const dateParts = item.deadline.split('-');
                  const monthStr = dateParts[1] ? new Date(item.deadline).toLocaleString('id-ID', { month: 'short' }) : 'HARI';
                  const dayStr = dateParts[2] || '00';
                  return (
                    <li key={item.id} className={`flex gap-4 items-start ${index === 0 && upcomingDeadlines.length > 1 ? 'pb-4 border-b border-white/10' : ''}`}>
                      <div className="bg-[#feb234] text-[#291800] rounded-xl py-1.5 px-3 text-center min-w-[56px] font-bold animate-fade-in">
                        <div className="text-[9px] uppercase tracking-wider font-bold">{monthStr}</div>
                        <div className="text-lg font-headline leading-none mt-0.5">{dayStr}</div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white leading-tight">{item.name}</div>
                        <div className="text-[11px] text-white/70 mt-1 font-semibold leading-relaxed">
                          Status: <span className="text-[#feb234] uppercase font-bold">{item.status === 'Open' ? 'BUKA' : item.status === 'Soon' ? 'SEGERA' : 'TUTUP'}</span>
                        </div>
                      </div>
                    </li>
                  );
                })
              )}
            </ul>
          </div>

        </div>
      </div>

      {/* Add Scholarship Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-[#191c1e]/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#c3c6d1]/40 text-left">
            <h3 className="font-sans font-bold text-xl text-[#001e40] mb-4">Pasang Peluang Beasiswa Baru</h3>
            <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-xs font-bold text-[#43474f] uppercase tracking-wider mb-1">Nama Beasiswa</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Beasiswa Bank Indonesia 2024"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-[#f2f4f7] border border-[#c3c6d1] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#001e40]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#43474f] uppercase tracking-wider mb-1">Penyedia / Sponsor</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bank Indonesia / CSR"
                  value={newProvider}
                  onChange={(e) => setNewProvider(e.target.value)}
                  className="w-full bg-[#f2f4f7] border border-[#c3c6d1] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#001e40]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#43474f] uppercase tracking-wider mb-1">Kategori Pendanaan</label>
                  <select
                    value={newType}
                    onChange={(e) => {
                      const typeVal = e.target.value as 'Internal' | 'External' | 'Government';
                      setNewType(typeVal);
                      if (typeVal === 'Internal') setNewCat('Internal Universitas');
                      else if (typeVal === 'External') setNewCat('Eksternal Korporasi');
                      else setNewCat('Instansi Pemerintah');
                    }}
                    className="w-full bg-[#f2f4f7] border border-[#c3c6d1] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#001e40]"
                  >
                    <option value="Internal">Internal</option>
                    <option value="External">Eksternal</option>
                    <option value="Government">Pemerintah</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#43474f] uppercase tracking-wider mb-1">Tanggal Batas Waktu</label>
                  <input
                    type="date"
                    required
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full bg-[#f2f4f7] border border-[#c3c6d1] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-[#001e40] focus:ring-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#43474f] uppercase tracking-wider mb-1">Deskripsi Singkat</label>
                <textarea
                  rows={3}
                  placeholder="Berikan persyaratan IPK, struktur wawancara, tunjangan bulanan, atau kriteria..."
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
                  className="px-5 py-2.5 bg-[#001e40] hover:bg-[#1f477b] text-white text-sm font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Buat Peluang Beasiswa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Scholarship Modal */}
      {showEditModal && editingRecord && (
        <div className="fixed inset-0 bg-[#191c1e]/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#c3c6d1]/40 text-left">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-sans font-bold text-xl text-[#001e40]">Edit Peluang Beasiswa</h3>
              <button onClick={() => setShowEditModal(false)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-650 transition-colors">
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="space-y-4 animate-fade-in text-xs font-sans">
              <div>
                <label className="block text-[10px] font-bold text-[#43474f] uppercase tracking-wider mb-1">Nama Beasiswa</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[#f2f4f7] border border-[#c3c6d1] rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#001e40]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-[#43474f] uppercase tracking-wider mb-1">Penyedia</label>
                  <input
                    type="text"
                    required
                    value={editProvider}
                    onChange={(e) => setEditProvider(e.target.value)}
                    className="w-full bg-[#f2f4f7] border border-[#c3c6d1] rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#43474f] uppercase tracking-wider mb-1">Batas Waktu</label>
                  <input
                    type="date"
                    required
                    value={editDeadline}
                    onChange={(e) => setEditDeadline(e.target.value)}
                    className="w-full bg-[#f2f4f7] border border-[#c3c6d1] rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-[#43474f] uppercase tracking-wider mb-1">Tipe Kategori</label>
                  <select
                    value={editType}
                    onChange={(e) => setEditType(e.target.value as any)}
                    className="w-full bg-[#f2f4f7] border border-[#c3c6d1] rounded-xl px-4 py-2.5 text-xs focus:outline-none font-bold text-slate-800"
                  >
                    <option value="Internal">Internal</option>
                    <option value="External">Eksternal</option>
                    <option value="Government">Pemerintah</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#43474f] uppercase tracking-wider mb-1">Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full bg-[#f2f4f7] border border-[#c3c6d1] rounded-xl px-4 py-2.5 text-xs focus:outline-none font-bold text-slate-800"
                  >
                    <option value="Open">Buka</option>
                    <option value="Soon">Segera</option>
                    <option value="Closed">Tutup</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#43474f] uppercase tracking-wider mb-1">Detail Kategori</label>
                <input
                  type="text"
                  value={editCat}
                  onChange={(e) => setEditCat(e.target.value)}
                  placeholder="Contoh: Internal Universitas"
                  className="w-full bg-[#f2f4f7] border border-[#c3c6d1] rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#43474f] uppercase tracking-wider mb-1">Deskripsi</label>
                <textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  rows={3}
                  className="w-full bg-[#f2f4f7] border border-[#c3c6d1] rounded-xl px-4 py-2.5 text-xs focus:outline-none resize-none"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2 border-t border-[#eceef1]">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-350 text-slate-700 font-bold rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#001e40] hover:bg-[#1f477b] text-white font-bold rounded-xl transition cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FAQs Panel */}
      {faqOpen && (
        <div className="fixed inset-0 bg-[#191c1e]/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in" onClick={() => setFaqOpen(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#c3c6d1]/40 text-left" onClick={e => e.stopPropagation()}>
            <h3 className="font-sans font-bold text-xl text-[#001e40] mb-4 border-b border-[#eceef1] pb-3">Pengaturan FAQ Beasiswa Mahasiswa</h3>
            
            <div className="space-y-4 max-h-[360px] overflow-y-auto pr-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="font-bold text-xs text-[#001e40]">Tanya: Bagaimana IPK Mahasiswa Diverifikasi?</p>
                <p className="text-xs text-[#43474f] mt-1 font-medium leading-relaxed">Jawab: IPK disinkronkan langsung dengan database sistem SIA akademik setiap malam.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="font-bold text-xs text-[#001e40]">Tanya: Apa yang terjadi jika Pengajuan Pendaftaran Tidak Lengkap?</p>
                <p className="text-xs text-[#43474f] mt-1 font-medium leading-relaxed">Jawab: Draf akan ditandai otomatis untuk peringatan mahasiswa 48 jam sebelum batas waktu ditutup.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="font-bold text-xs text-[#001e40]">Tanya: Apakah Alumni berhak atas Beasiswa Eksternal lanjutan?</p>
                <p className="text-xs text-[#43474f] mt-1 font-medium leading-relaxed">Jawab: Dukungan pendanaan korporat dan pascasarjana tertentu memungkinkan pencalonan alumni.</p>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[#eceef1] mt-5">
              <button
                type="button"
                onClick={() => setFaqOpen(false)}
                className="px-5 py-2.5 bg-[#001e40] text-white text-sm font-bold rounded-xl shadow-md cursor-pointer"
              >
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
