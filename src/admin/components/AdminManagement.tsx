import React, { useState } from 'react';
import { UserCheck, Shield, ChevronLeft, ChevronRight, MoreVertical, Plus, Trash2, Key } from 'lucide-react';
import { AdminRecord } from '../types';

interface AdminManagementProps {
  admins: AdminRecord[];
  onAddAdmin: (admin: Omit<AdminRecord, 'id' | 'avatarInitials' | 'lastActive'>) => void;
  onRemoveAdmin: (id: string) => void;
  onUpdateAdminRole: (id: string, role: 'Super Admin' | 'Admin' | 'Editor') => void;
}

export default function AdminManagement({ admins, onAddAdmin, onRemoveAdmin, onUpdateAdminRole }: AdminManagementProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeAdminOptions, setActiveAdminOptions] = useState<string | null>(null);

  // Form input states
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'Super Admin' | 'Admin' | 'Editor'>('Admin');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) {
      alert("Please fill in Name and Email!");
      return;
    }

    onAddAdmin({
      name: newName,
      email: newEmail,
      role: newRole
    });

    setNewName('');
    setNewEmail('');
    setNewRole('Admin');
    setShowAddModal(false);
  };

  const handleRoleToggle = (id: string, currentRole: 'Super Admin' | 'Admin' | 'Editor') => {
    const nextRoleMap: Record<'Super Admin' | 'Admin' | 'Editor', 'Super Admin' | 'Admin' | 'Editor'> = {
      'Super Admin': 'Admin',
      'Admin': 'Editor',
      'Editor': 'Super Admin',
    };
    onUpdateAdminRole(id, nextRoleMap[currentRole]);
    setActiveAdminOptions(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-headline font-bold text-3xl text-[#191c1e]">User Access Control</h2>
          <p className="text-sm text-[#43474f] font-medium mt-1">Manage administrator roles, permissions, and system access.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#001e40] text-white hover:bg-[#1f477b] font-bold text-sm px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-opacity shadow-sm whitespace-nowrap cursor-pointer hover:shadow-md"
        >
          <Plus size={18} />
          Add New Admin
        </button>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Table Section (2 columns cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-[#c3c6d1]/30 flex flex-col overflow-hidden justify-between">
          <div>
            <div className="p-5 border-b border-[#eceef1] flex justify-between items-center bg-white">
              <h3 className="font-headline font-semibold text-lg text-[#191c1e]">Active Administrators</h3>
              <span className="text-xs text-[#737780] font-semibold">Active staff credentials list</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f2f4f7] border-b border-[#eceef1] font-bold text-xs text-[#43474f] uppercase tracking-wider">
                    <th className="px-5 py-4 pl-6">Name &amp; Email</th>
                    <th className="px-5 py-4">Role</th>
                    <th className="px-5 py-4">Last Active</th>
                    <th className="px-5 py-4 text-right pr-6">Actions</th>
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
                      <td className="px-5 py-4">
                        <span
                          onClick={() => handleRoleToggle(admin.id, admin.role)}
                          title="Click to rotate role"
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border cursor-pointer select-none ${
                            admin.role === 'Super Admin'
                              ? 'bg-[#feb234]/15 text-[#6d4700] border-[#feb234]/25'
                              : admin.role === 'Admin'
                              ? 'bg-[#d5e3ff] text-[#1f477b] border-[#a7c8ff]/30'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {admin.role}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-[#737780] text-xs font-semibold">
                        {admin.lastActive}
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
                            <button
                              onClick={() => handleRoleToggle(admin.id, admin.role)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-[#f2f4f7] font-semibold text-[#191c1e] text-left transition-colors cursor-pointer"
                            >
                              <Key size={14} />
                              Rotate Role
                            </button>
                            <hr className="my-1 border-slate-100" />
                            <button
                              onClick={() => {
                                if (confirm(`Remove admin permissions for ${admin.name}?`)) {
                                  onRemoveAdmin(admin.id);
                                }
                                setActiveAdminOptions(null);
                              }}
                              disabled={admins.length <= 1}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#ba1a1a] hover:bg-[#ffdad6] font-semibold text-left transition-colors cursor-pointer disabled:opacity-50"
                            >
                              <Trash2 size={14} />
                              Revoke Access
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
              <p className="text-xs text-[#737780] font-semibold">Showing 1 to {admins.length} of {admins.length} admins</p>
              <div className="flex gap-1">
                <button className="p-1 rounded text-slate-400 hover:bg-slate-200 disabled:opacity-50" disabled>
                  <ChevronLeft size={16} />
                </button>
                <button className="p-1 rounded text-[#001e40] hover:bg-slate-200" onClick={() => alert("All active administrative lists are fully rendered.")}>
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
                <h3 className="font-headline font-bold text-base text-[#191c1e]">Role Overview</h3>
                <p className="text-xs text-[#737780] font-semibold">Permission levels explained</p>
              </div>
            </div>

            <div className="space-y-4 flex-1">
              {/* Super Admin Info */}
              <div className="p-4 rounded-xl border border-[#feb234]/30 bg-[#feb234]/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#feb234]/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-sm text-[#291800] flex items-center gap-2">
                    Super Admin
                    <span className="w-1.5 h-1.5 rounded-full bg-[#feb234]"></span>
                  </h4>
                </div>
                <p className="text-xs text-[#443000] leading-relaxed font-semibold">
                  Unrestricted access to all modules, settings, user management, and system configurations.
                </p>
              </div>

              {/* Admin Info */}
              <div className="p-4 rounded-xl border border-[#c3c6d1]/20 bg-[#f2f4f7] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#001e40]/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="font-bold text-sm text-[#001e40] flex items-center gap-2">
                    Admin / Staff
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1f477b]"></span>
                  </h4>
                </div>
                <p className="text-xs text-[#43474f] leading-relaxed font-medium">
                  Can manage content, data, approve student submissions, but cannot alter global core settings or delete admins.
                </p>
              </div>

              {/* Editor Info */}
              <div className="p-4 rounded-xl border border-[#eceef1] bg-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-slate-100 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="font-bold text-sm text-[#191c1e] flex items-center gap-2">
                    Editor
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                  </h4>
                </div>
                <p className="text-xs text-[#43474f] leading-relaxed font-medium">
                  Restricted editor access. Only permitted to draft, edit, and publish News articles and UKM Ormawa catalog updates.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => alert("Opening advanced permissions matrix editor...")}
            className="mt-6 w-full py-3 border border-[#001e40] text-[#001e40] font-bold text-sm rounded-xl hover:bg-slate-50 transition-colors cursor-pointer select-none"
          >
            Edit Role Permissions
          </button>
        </div>

      </div>

      {/* Add Admin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-[#191c1e]/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#c3c6d1]/40">
            <h3 className="font-headline font-bold text-xl text-[#001e40] mb-4">Grant Administrator Access</h3>
            <form onSubmit={handleCreateSubmit} className="space-y-4 animate-fade-in block">
              <div>
                <label className="block text-xs font-bold text-[#43474f] uppercase tracking-wider mb-1">Full Name & credentials</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prof. Dr. John Doe, M.T."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-[#f2f4f7] border border-[#c3c6d1] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#001e40]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#43474f] uppercase tracking-wider mb-1">Official University Email</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. johndoe@upb.ac.id"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full bg-[#f2f4f7] border border-[#c3c6d1] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#001e40]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#43474f] uppercase tracking-wider mb-1">Access Role Level</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="w-full bg-[#f2f4f7] border border-[#c3c6d1] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#001e40]"
                >
                  <option value="Super Admin">Super Admin (Unrestricted)</option>
                  <option value="Admin">Admin (Active Management)</option>
                  <option value="Editor">Editor (Limited to Writing/UKM)</option>
                </select>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-[#eceef1]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 border border-[#c3c6d1] text-[#43474f] text-sm font-bold rounded-xl hover:bg-[#f2f4f7] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#001e40] hover:bg-[#1f477b] text-white text-sm font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Grant Access credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
