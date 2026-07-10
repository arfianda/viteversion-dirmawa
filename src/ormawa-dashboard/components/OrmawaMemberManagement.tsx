import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  UserPlus, 
  Trash2, 
  Mail, 
  CheckCircle,
  FileSpreadsheet,
  Plus,
  ClipboardList
} from 'lucide-react';
import { SupabaseService } from '../../services/supabaseService';

interface OrmawaMemberManagementProps {
  ukmId: string;
  ukmName: string;
}

interface Member {
  id: string;
  name: string;
  nim: string;
  major: string;
  semester: number;
  joinDate: string;
  role: 'Ketua' | 'Sekretaris' | 'Bendahara' | 'Anggota';
}

export default function OrmawaMemberManagement({ ukmId, ukmName }: OrmawaMemberManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [reportedCount, setReportedCount] = useState<number>(0);
  const [pendingReport, setPendingReport] = useState<any>(null);
  const [isReporting, setIsReporting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);
  
  // Seed Mock members based on the organization name
  const [members, setMembers] = useState<Member[]>([
    { id: '1', name: 'Budi Santoso', nim: '202100123', major: 'Teknik Informatika', semester: 6, joinDate: '15 Sep 2022', role: 'Ketua' },
    { id: '2', name: 'Siti Rahma', nim: '202100456', major: 'Sistem Informasi', semester: 6, joinDate: '20 Sep 2022', role: 'Sekretaris' },
    { id: '3', name: 'Ahmad Fauzi', nim: '202201789', major: 'Teknik Industri', semester: 4, joinDate: '02 Mar 2023', role: 'Bendahara' },
    { id: '4', name: 'Dewi Lestari', nim: '202200111', major: 'Teknik Informatika', semester: 4, joinDate: '10 Mar 2023', role: 'Anggota' },
    { id: '5', name: 'Rian Hidayat', nim: '202302333', major: 'Manajemen', semester: 2, joinDate: '18 Sep 2023', role: 'Anggota' },
    { id: '6', name: 'Lani Anggraini', nim: '202300222', major: 'Sistem Informasi', semester: 2, joinDate: '22 Sep 2023', role: 'Anggota' },
  ]);

  useEffect(() => {
    setReportedCount(members.length);
  }, [members]);

  useEffect(() => {
    const fetchPendingReport = async () => {
      try {
        const report = await SupabaseService.getPendingMemberReportForUkm(ukmId);
        setPendingReport(report);
      } catch (e) {
        console.error('Failed to fetch pending report:', e);
      }
    };
    fetchPendingReport();
  }, [ukmId]);

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reportedCount <= 0) {
      alert('Jumlah anggota harus lebih dari 0!');
      return;
    }
    setIsReporting(true);
    try {
      await SupabaseService.createMemberReport(ukmId, reportedCount);
      setReportSuccess(true);
      const report = await SupabaseService.getPendingMemberReportForUkm(ukmId);
      setPendingReport(report);
      setTimeout(() => setReportSuccess(false), 3000);
    } catch (e: any) {
      console.error(e);
      alert('Gagal melaporkan anggota: ' + (e.message || e));
    } finally {
      setIsReporting(false);
    }
  };

  // Form add member
  const [showAddModal, setShowAddModal] = useState(false);
  const [addNim, setAddNim] = useState('');
  const [addName, setAddName] = useState('');
  const [addMajor, setAddMajor] = useState('Teknik Informatika');
  const [addSemester, setAddSemester] = useState(2);
  const [addRole, setAddRole] = useState<'Ketua' | 'Sekretaris' | 'Bendahara' | 'Anggota'>('Anggota');

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addNim || !addName) return;

    const newMember: Member = {
      id: `mem-${Date.now()}`,
      name: addName,
      nim: addNim,
      major: addMajor,
      semester: addSemester,
      joinDate: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
      role: addRole
    };

    setMembers([...members, newMember]);
    setShowAddModal(false);
    
    // Reset Form
    setAddNim('');
    setAddName('');
    setAddMajor('Teknik Informatika');
    setAddSemester(2);
    setAddRole('Anggota');
  };

  const handleRemoveMember = (id: string) => {
    if (confirm('Apakah Anda yakin ingin mengeluarkan anggota ini dari organisasi?')) {
      setMembers(members.filter(m => m.id !== id));
    }
  };

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.nim.includes(searchQuery) ||
    m.major.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in font-sans pb-10">
      
      {/* Header section */}
      <section className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h2 className="font-display font-extrabold text-2xl md:text-3xl text-[#001e40] mb-1.5">
            Daftar Anggota {ukmName}
          </h2>
          <p className="text-sm text-slate-500 font-medium max-w-2xl">
            Pantau dan kelola roster mahasiswa aktif yang bergabung dalam organisasi kemahasiswaan Anda.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#001e40] hover:bg-[#feb234] text-white hover:text-[#001e40] font-sans font-black text-xs px-5 py-3.5 rounded-xl uppercase tracking-wider shadow cursor-pointer transition active:scale-95 flex items-center gap-1.5"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Anggota</span>
        </button>
      </section>

      {/* Report Member Count Widget */}
      <section className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-yellow-50 text-[#feb234] rounded-xl border border-yellow-100 shrink-0">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Pelaporan Jumlah Anggota Aktif</h3>
            <p className="text-xs text-slate-400 font-semibold">Laporkan jumlah total anggota aktif Anda untuk disinkronkan ke direktori Ormawa setelah disetujui Dirmawa.</p>
          </div>
        </div>

        {pendingReport ? (
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-xs font-bold text-slate-700">Laporan Menunggu Verifikasi</p>
              <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                Jumlah yang dilaporkan: <strong className="text-[#001e40]">{pendingReport.reported_count} Anggota</strong>
              </p>
            </div>
            <span className="inline-block px-3 py-1 bg-yellow-50 text-yellow-800 border border-yellow-200/60 rounded-full text-[10px] font-black uppercase tracking-wider">
              Menunggu Persetujuan
            </span>
          </div>
        ) : (
          <form onSubmit={handleReportSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="flex items-center gap-2 max-w-xs w-full">
              <input
                type="number"
                value={reportedCount}
                onChange={(e) => setReportedCount(Number(e.target.value))}
                placeholder="Jumlah anggota..."
                className="w-full bg-slate-50 border border-slate-200 focus:border-[#001e40] focus:ring-2 focus:ring-[#001e40]/10 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none transition-all"
              />
              <span className="text-xs text-slate-500 font-bold shrink-0">Mhs</span>
            </div>
            <button
              type="submit"
              disabled={isReporting}
              className="bg-[#001e40] hover:bg-[#feb234] text-white hover:text-[#001e40] font-sans font-black text-xs px-5 py-3 rounded-xl uppercase tracking-wider shadow cursor-pointer transition active:scale-95 disabled:opacity-50"
            >
              {isReporting ? 'Mengirim...' : 'Laporkan Anggota'}
            </button>
            {reportSuccess && (
              <span className="text-xs text-green-600 font-bold flex items-center gap-1 animate-fade-in">
                <CheckCircle className="w-3.5 h-3.5" /> Laporan terkirim!
              </span>
            )}
          </form>
        )}
      </section>

      {/* Search and Table box */}
      <section className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
        
        {/* Controls header */}
        <div className="p-5 border-b border-slate-200/80 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-slate-50/50">
          <div className="relative max-w-md w-full">
            <input 
              type="text" 
              placeholder="Cari anggota berdasarkan nama, NIM, prodi..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 focus:border-[#001e40] focus:ring-2 focus:ring-[#001e40]/10 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold outline-none transition-all placeholder:text-slate-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          </div>

          <div className="flex gap-2">
            <button className="bg-white border border-slate-250 hover:bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 transition cursor-pointer">
              <FileSpreadsheet className="w-4 h-4 text-green-600" />
              <span>Export Excel</span>
            </button>
          </div>
        </div>

        {/* Roster Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs text-slate-700">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-450 uppercase font-extrabold text-[9px] tracking-wider">
                <th className="py-4 px-6">Nama Mahasiswa</th>
                <th className="py-4 px-6">NIM</th>
                <th className="py-4 px-6">Program Studi</th>
                <th className="py-4 px-6 text-center">Semester</th>
                <th className="py-4 px-6">Tanggal Bergabung</th>
                <th className="py-4 px-6 text-center">Jabatan</th>
                <th className="py-4 px-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400 font-bold">
                    Tidak ditemukan anggota yang cocok dengan pencarian Anda.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-55/10 transition-colors">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#001e40]/5 text-[#001e40] font-black flex items-center justify-center border border-slate-200 uppercase">
                        {member.name.substring(0, 2)}
                      </div>
                      <span className="font-bold text-slate-800">{member.name}</span>
                    </td>
                    <td className="py-4 px-6 text-slate-500 font-mono font-semibold">{member.nim}</td>
                    <td className="py-4 px-6 text-slate-600">{member.major}</td>
                    <td className="py-4 px-6 text-center font-bold text-slate-650">{member.semester}</td>
                    <td className="py-4 px-6 text-slate-400">{member.joinDate}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                        member.role === 'Ketua' 
                          ? 'bg-blue-50 text-blue-700 border border-blue-150' 
                          : member.role === 'Sekretaris' || member.role === 'Bendahara'
                            ? 'bg-purple-50 text-purple-700 border border-purple-150'
                            : 'bg-slate-50 text-slate-600 border border-slate-150'
                      }`}>
                        {member.role}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      {member.role !== 'Ketua' && (
                        <button
                          onClick={() => handleRemoveMember(member.id)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                          title="Keluarkan dari Ormawa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Summary Footer */}
        <div className="p-4 border-t border-slate-200 flex justify-between items-center text-slate-450 font-bold text-[10px] uppercase">
          <span>Menampilkan {filteredMembers.length} dari {members.length} Anggota</span>
        </div>

      </section>

      {/* Modal Add Member */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in font-sans text-xs">
            <div className="bg-[#001e40] p-5 text-white flex justify-between items-center border-b border-[#002d61]">
              <h3 className="font-sans font-black text-sm uppercase tracking-wider">Tambah Anggota Baru</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-white hover:text-[#feb234] font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleAddMember} className="p-6 space-y-4 text-slate-700">
              
              {/* NIM */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-600 block">NIM Mahasiswa</label>
                <input 
                  type="text" 
                  required
                  placeholder="Contoh: 202100456"
                  value={addNim}
                  onChange={(e) => setAddNim(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#001e40] rounded-xl px-4 py-2.5 outline-none font-semibold"
                />
              </div>

              {/* Name */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-600 block">Nama Lengkap</label>
                <input 
                  type="text" 
                  required
                  placeholder="Contoh: Siti Rahma"
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#001e40] rounded-xl px-4 py-2.5 outline-none font-semibold"
                />
              </div>

              {/* Major */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-600 block">Program Studi</label>
                <select 
                  value={addMajor}
                  onChange={(e) => setAddMajor(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#001e40] rounded-xl px-4 py-2.5 outline-none cursor-pointer font-semibold"
                >
                  <option value="Teknik Informatika">Teknik Informatika</option>
                  <option value="Sistem Informasi">Sistem Informasi</option>
                  <option value="Teknik Industri">Teknik Industri</option>
                  <option value="Manajemen">Manajemen</option>
                  <option value="Hukum">Hukum</option>
                </select>
              </div>

              {/* Semester & Role */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-600 block">Semester</label>
                  <input 
                    type="number" 
                    required
                    min={1}
                    max={14}
                    value={addSemester}
                    onChange={(e) => setAddSemester(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#001e40] rounded-xl px-4 py-2.5 outline-none font-semibold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-600 block">Jabatan</label>
                  <select 
                    value={addRole}
                    onChange={(e) => setAddRole(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#001e40] rounded-xl px-4 py-2.5 outline-none cursor-pointer font-semibold"
                  >
                    <option value="Anggota">Anggota</option>
                    <option value="Sekretaris">Sekretaris</option>
                    <option value="Bendahara">Bendahara</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-500 font-bold hover:text-slate-800 cursor-pointer"
                >
                  Batalkan
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#001e40] hover:bg-[#feb234] text-white hover:text-[#001e40] rounded-xl font-bold transition cursor-pointer"
                >
                  Simpan Anggota
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
