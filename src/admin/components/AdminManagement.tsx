import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { UserCheck, Shield, ChevronLeft, ChevronRight, MoreVertical, Plus, Trash2, Key, Check } from 'lucide-react';
import { AdminRecord } from '../types';

interface AdminManagementProps {
  admins: AdminRecord[];
  onAddAdmin: (admin: Omit<AdminRecord, 'id' | 'avatarInitials' | 'lastActive'> & { roles?: string[] }) => void;
  onRemoveAdmin: (id: string) => void;
  onUpdateAdminRole: (id: string, role: 'Super Admin' | 'Admin' | 'Editor') => void;
  onUpdateAdminRoles?: (id: string, roles: string[]) => void;
  onUpdateAdminApproval?: (id: string, isApproved: boolean) => void;
}

const AVAILABLE_BADGES = [
  { value: 'superadmin', label: 'Super Admin', color: 'bg-red-50 text-red-700 border-red-200' },
  { value: 'direktur', label: 'Direktur', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { value: 'staf_beasiswa', label: 'Staf Beasiswa', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { value: 'staf_ormawa', label: 'Staf Ormawa', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { value: 'staf_alumni', label: 'Staf Alumni', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { value: 'staf_depan', label: 'Staf Depan', color: 'bg-teal-50 text-teal-700 border-teal-200' },
];

export default function AdminManagement({ admins, onAddAdmin, onRemoveAdmin, onUpdateAdminRole, onUpdateAdminRoles, onUpdateAdminApproval }: AdminManagementProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeAdminOptions, setActiveAdminOptions] = useState<string | null>(null);
  const [roleSelectorAdminId, setRoleSelectorAdminId] = useState<string | null>(null);

  // Form input states
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newSelectedRoles, setNewSelectedRoles] = useState<string[]>(['staf_ormawa']);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) {
      alert("Please fill in Name and Email!");
      return;
    }

    const primaryRole = newSelectedRoles.includes('superadmin') ? 'Super Admin' : newSelectedRoles.includes('operator') ? 'Editor' : 'Admin';

    onAddAdmin({
      name: newName,
      email: newEmail,
      role: primaryRole as any,
      roles: newSelectedRoles
    });

    setNewName('');
    setNewEmail('');
    setNewSelectedRoles(['staf_ormawa']);
    setShowAddModal(false);
  };

  const getCurrentRoles = (admin: AdminRecord): string[] => {
    if (admin.roles && admin.roles.length > 0) return admin.roles;
    if (admin.role === 'Super Admin') return ['superadmin'];
    if (admin.role === 'Editor') return ['operator'];
    return ['admin'];
  };

  const handleToggleBadge = (id: string, badgeValue: string) => {
    const adminObj = admins.find(a => a.id === id);
    if (!adminObj) return;
    const current = getCurrentRoles(adminObj);
    let updated: string[];
    if (current.includes(badgeValue)) {
      updated = current.filter(r => r !== badgeValue);
    } else {
      updated = [...current, badgeValue];
    }
    if (onUpdateAdminRoles) {
      onUpdateAdminRoles(id, updated);
    }
  };

  const handleRemoveBadge = (id: string, badgeValue: string) => {
    const adminObj = admins.find(a => a.id === id);
    if (!adminObj) return;
    const current = getCurrentRoles(adminObj);
    const updated = current.filter(r => r !== badgeValue);
    if (onUpdateAdminRoles) {
      onUpdateAdminRoles(id, updated);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-sans font-black text-3xl text-[#001e40]">Kontrol Akses Pengguna</h2>
          <p className="text-sm text-[#43474f] font-medium mt-1">Kelola peran administrator, izin akses, dan hak istimewa sistem dengan badge multi-peran.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#001e40] text-white hover:bg-[#1f477b] font-bold text-sm px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-opacity shadow-sm whitespace-nowrap cursor-pointer hover:shadow-md"
        >
          <Plus size={18} />
          Tambah Admin Baru
        </button>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Table Section (2 columns cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-[#c3c6d1]/30 flex flex-col overflow-hidden justify-between">
          <div>
            <div className="p-5 border-b border-[#eceef1] flex justify-between items-center bg-white">
              <h3 className="font-sans font-semibold text-lg text-[#191c1e]">Administrator &amp; Staf Aktif</h3>
              <span className="text-xs text-[#737780] font-semibold">Daftar kredensial staf aktif</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f2f4f7] border-b border-[#eceef1] font-bold text-xs text-[#43474f] uppercase tracking-wider">
                    <th className="px-5 py-4 pl-6">Nama &amp; Email</th>
                    <th className="px-5 py-4">Peran Badges</th>
                    <th className="px-5 py-4">Terakhir Aktif</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right pr-6">Aksi</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-medium divide-y divide-[#eceef1] bg-white text-[#191c1e]">
                  {admins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-slate-50 transition-colors relative">
                      <td className="px-5 py-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#d5e3ff] text-[#001e40] flex items-center justify-center font-bold text-xs">
                            {admin.avatarInitials}
                          </div>
                          <div>
                            <p className="font-semibold text-[#191c1e]">{admin.name}</p>
                            <p className="text-[#43474f] text-xs font-semibold lowercase mt-0.5">{admin.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 relative">
                        <div className="flex flex-wrap gap-1.5 items-center max-w-[280px]">
                          {getCurrentRoles(admin).map((rVal) => {
                            const badgeObj = AVAILABLE_BADGES.find(b => b.value === rVal);
                            const label = badgeObj ? badgeObj.label : rVal;
                            const colorClass = badgeObj ? badgeObj.color : 'bg-slate-100 text-slate-700 border-slate-200';
                            return (
                              <span
                                key={rVal}
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${colorClass} flex items-center gap-1`}
                              >
                                {label}
                                <button
                                  onClick={() => handleRemoveBadge(admin.id, rVal)}
                                  className="text-slate-400 hover:text-slate-700 font-bold ml-1 cursor-pointer"
                                  title="Hapus peran ini"
                                >
                                  ×
                                </button>
                              </span>
                            );
                          })}
                          
                          <button
                            onClick={() => setRoleSelectorAdminId(roleSelectorAdminId === admin.id ? null : admin.id)}
                            className="px-2 py-0.5 rounded-full text-[10px] font-bold border border-dashed border-slate-300 text-slate-500 hover:border-slate-500 hover:text-slate-800 transition-all cursor-pointer flex items-center gap-0.5 bg-slate-50"
                            title="Tambah peran/badge baru"
                          >
                            + Peran
                          </button>

                          {roleSelectorAdminId === admin.id && (
                            <div className="absolute left-6 mt-8 bg-white border border-[#c3c6d1] shadow-2xl rounded-2xl p-3.5 z-40 min-w-[200px] text-left animate-fade-in space-y-2">
                              <p className="text-[11px] font-black text-slate-800 uppercase tracking-wider mb-2 border-b border-slate-100 pb-1.5">Pilih Peran Badges</p>
                              {AVAILABLE_BADGES.map((badge) => {
                                const isAssigned = getCurrentRoles(admin).includes(badge.value);
                                return (
                                  <label key={badge.value} className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-50 p-1.5 rounded-lg select-none">
                                    <input
                                      type="checkbox"
                                      checked={isAssigned}
                                      onChange={() => handleToggleBadge(admin.id, badge.value)}
                                      className="rounded border-slate-350 text-[#001e40] focus:ring-[#001e40] cursor-pointer"
                                    />
                                    <span>{badge.label}</span>
                                  </label>
                                );
                              })}
                              <div className="flex justify-end pt-2 border-t border-slate-100">
                                <button
                                  onClick={() => setRoleSelectorAdminId(null)}
                                  className="px-3 py-1 bg-[#001e40] hover:bg-[#1f477b] text-white text-[10px] font-bold rounded-lg cursor-pointer"
                                >
                                  Selesai
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-[#737780] text-xs font-semibold">
                        {admin.lastActive}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          admin.isApproved
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {admin.isApproved ? 'Aktif / Disetujui' : 'Menunggu'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right pr-6 relative">
                        <button
                          onClick={() => setActiveAdminOptions(activeAdminOptions === admin.id ? null : admin.id)}
                          className="text-[#737780] hover:text-[#191c1e] transition-colors p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer"
                        >
                          <MoreVertical size={16} />
                        </button>

                        {/* Dropdown Menu Option Context */}
                        {activeAdminOptions === admin.id && (
                          <div className="absolute right-6 top-12 bg-white border border-[#c3c6d1] shadow-xl rounded-xl p-1 z-30 min-w-[150px] text-left">
                            {admin.isApproved === false && onUpdateAdminApproval && (
                              <button
                                onClick={() => {
                                  onUpdateAdminApproval(admin.id, true);
                                  setActiveAdminOptions(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-emerald-50 font-semibold text-emerald-700 text-left transition-colors cursor-pointer"
                              >
                                <Check size={14} className="stroke-[3]" />
                                Setujui Staf
                              </button>
                            )}
                            {admin.isApproved === true && admin.email !== 'arfiandafirsta@gmail.com' && onUpdateAdminApproval && (
                              <button
                                onClick={() => {
                                  if (confirm(`Nonaktifkan akses untuk ${admin.name}?`)) {
                                    onUpdateAdminApproval(admin.id, false);
                                  }
                                  setActiveAdminOptions(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-red-50 font-semibold text-[#ba1a1a] text-left transition-colors cursor-pointer"
                              >
                                <Trash2 size={14} />
                                Nonaktifkan Staf
                              </button>
                            )}
                            <hr className="my-1 border-slate-100" />
                            <button
                              onClick={() => {
                                setRoleSelectorAdminId(admin.id);
                                setActiveAdminOptions(null);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-[#f2f4f7] font-semibold text-[#191c1e] text-left transition-colors cursor-pointer"
                            >
                              <Key size={14} />
                              Kelola Peran
                            </button>
                            <hr className="my-1 border-slate-100" />
                            <button
                              onClick={() => {
                                if (confirm(`Hapus akses administrator untuk ${admin.name}?`)) {
                                  onRemoveAdmin(admin.id);
                                }
                                setActiveAdminOptions(null);
                              }}
                              disabled={admins.length <= 1}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#ba1a1a] hover:bg-[#ffdad6] font-semibold text-left transition-colors cursor-pointer disabled:opacity-50"
                            >
                              <Trash2 size={14} />
                              Cabut Akses
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination footer details */}
            <div className="p-4 border-t border-[#eceef1] bg-[#f7f9fc] flex items-center justify-between mt-auto">
              <p className="text-xs text-[#737780] font-semibold">Menampilkan 1 sampai {admins.length} dari {admins.length} admin</p>
              <div className="flex gap-1">
                <button className="p-1 rounded text-slate-400 hover:bg-slate-200 disabled:opacity-50" disabled>
                  <ChevronLeft size={16} />
                </button>
                <button className="p-1 rounded text-[#001e40] hover:bg-slate-200" onClick={() => alert("Semua daftar administrator aktif telah ditampilkan.")}>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Roles details overview panel sidebar (1 column) */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#c3c6d1]/30 p-6 flex flex-col h-full justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-[#feb234]/10 rounded-xl text-[#6d4700]">
                <Shield size={20} />
              </div>
              <div>
                <h3 className="font-sans font-bold text-base text-[#191c1e]">Ringkasan Peran</h3>
                <p className="text-xs text-[#737780] font-semibold">Penjelasan tingkat hak akses</p>
              </div>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto max-h-[500px] pr-1">
              <div className="p-3.5 rounded-xl border border-red-100 bg-red-50/50">
                <h4 className="font-bold text-xs text-red-800">Super Admin</h4>
                <p className="text-[11px] text-red-700/90 leading-relaxed font-medium mt-1">
                  Akses penuh ke semua modul, kontrol sistem global, registrasi staf, dan akses manajemen data sensitif.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-purple-100 bg-purple-50/50">
                <h4 className="font-bold text-xs text-purple-800">Direktur Dirmawa (Bu Wening)</h4>
                <p className="text-[11px] text-purple-700/90 leading-relaxed font-medium mt-1">
                  Hak akses membaca (Read-only) ke seluruh modul beasiswa, alumni, ormawa, dan melihat agenda janji temu pribadi.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-amber-100 bg-amber-50/50">
                <h4 className="font-bold text-xs text-amber-800">Staf Beasiswa</h4>
                <p className="text-[11px] text-amber-700/90 leading-relaxed font-medium mt-1">
                  Khusus mengelola publikasi program beasiswa dan antrian pendaftaran beasiswa mahasiswa.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/50">
                <h4 className="font-bold text-xs text-emerald-800">Staf Ormawa</h4>
                <p className="text-[11px] text-emerald-700/90 leading-relaxed font-medium mt-1">
                  Mengelola direktori Ormawa, verifikasi laporan jumlah anggota, serta antrian proposal &amp; LPJ Ormawa.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-blue-100 bg-blue-50/50">
                <h4 className="font-bold text-xs text-blue-800">Staf Alumni</h4>
                <p className="text-[11px] text-blue-700/90 leading-relaxed font-medium mt-1">
                  Khusus mengelola database alumni, karir lulusan, dan statistik validitas NIM alumni.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-teal-100 bg-teal-50/50">
                <h4 className="font-bold text-xs text-teal-800">Staf Depan (Front Desk)</h4>
                <p className="text-[11px] text-teal-700/90 leading-relaxed font-medium mt-1">
                  Mengatur agenda janji temu (appointment scheduler) dengan Direktur Dirmawa dan tracking umum ormawa.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Add Admin Modal */}
      {showAddModal && createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#c3c6d1]/40 text-left">
            <h3 className="font-sans font-bold text-xl text-[#001e40] mb-4">Berikan Akses Administrator Baru</h3>
            <form onSubmit={handleCreateSubmit} className="space-y-4 animate-fade-in block">
              <div>
                <label className="block text-xs font-bold text-[#43474f] uppercase tracking-wider mb-1">Nama Lengkap &amp; Kredensial</label>
                <input
                  type="text"
                  required
                  autoComplete="off"
                  placeholder="Contoh: Prof. Dr. John Doe, M.T."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-[#f2f4f7] border border-[#c3c6d1] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#001e40]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#43474f] uppercase tracking-wider mb-1">Email Resmi Universitas</label>
                <input
                  type="email"
                  required
                  placeholder="Contoh: johndoe@upb.ac.id"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full bg-[#f2f4f7] border border-[#c3c6d1] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#001e40]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#43474f] uppercase tracking-wider mb-2">Tingkat Peran Akses (Bisa Pilih Banyak)</label>
                <div className="grid grid-cols-2 gap-2 bg-[#f2f4f7] p-3 rounded-xl border border-[#c3c6d1]/50 text-xs">
                  {AVAILABLE_BADGES.map((badge) => {
                    const isChecked = newSelectedRoles.includes(badge.value);
                    return (
                      <label key={badge.value} className="flex items-center gap-2 p-1.5 hover:bg-white rounded-lg cursor-pointer transition-all select-none">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setNewSelectedRoles(newSelectedRoles.filter(r => r !== badge.value));
                            } else {
                              setNewSelectedRoles([...newSelectedRoles, badge.value]);
                            }
                          }}
                          className="rounded border-slate-350 text-[#001e40] focus:ring-[#001e40] cursor-pointer"
                        />
                        <span className="font-bold text-slate-700">{badge.label}</span>
                      </label>
                    );
                  })}
                </div>
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
                  Berikan Kredensial Akses
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
