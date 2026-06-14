/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Edit2, Trash2, Search, Shield, XCircle, CheckCircle } from 'lucide-react';
import { User, UserRole } from '../types';
import { AuthService } from '../services/authService';
import { AuthUser } from '../services/authService';

interface UserManagementViewProps {
  currentUser: AuthUser | null;
}

interface ExtendedUser extends User {
  isSelected?: boolean;
}

type UserStatus = 'all' | 'superadmin' | 'admin' | 'operator';

export default function UserManagementView({ currentUser }: UserManagementViewProps) {
  const [users, setUsers] = useState<ExtendedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<UserStatus>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Add user form state
  const [addUserForm, setAddUserForm] = useState({
    email: '',
    name: '',
    role: 'operator' as UserRole,
  });

  // Protected user email - cannot be deleted
  const PROTECTED_USER_EMAIL = 'arfiandafirsta@gmail.com';

  // Check if current user is superadmin
  const isSuperadmin = currentUser && currentUser.role === 'superadmin';

  // Load users on mount
  useEffect(() => {
    if (currentUser) {
      loadUsers();
    }
  }, [currentUser]);

  const loadUsers = async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      const fetchedUsers = await AuthService.getAllUsers(currentUser.id);
      if (fetchedUsers) {
        // Map to ExtendedUser and mark restart flag
        const extendedUsers = fetchedUsers.map(user => ({
          ...user,
          // Flag restart user
          isRestartFlag: user.email === PROTECTED_USER_EMAIL,
        }));
        setUsers(extendedUsers);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  const triggerMessage = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // Filter users based on search and status
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || user.role === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleOpenAddModal = () => {
    setAddUserForm({ email: '', name: '', role: 'operator' });
    setShowAddModal(true);
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) return;

    try {
      // For now, we'll simulate adding a user locally
      // In production, this would call AuthService.addUser which requires Supabase Admin API
      const newUser: ExtendedUser = {
        id: crypto.randomUUID(),
        email: addUserForm.email,
        name: addUserForm.name,
        role: addUserForm.role,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Optimistic update
      setUsers([newUser, ...users]);
      setShowAddModal(false);
      triggerMessage('User berhasil ditambahkan! Silakan sinkronisasi dengan database.');
    } catch (err) {
      console.error(err);
      triggerMessage('Gagal menambahkan user', 'error');
    }
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!currentUser || !userToDelete) return;

    // Check for protected user
    if (userToDelete.email === PROTECTED_USER_EMAIL) {
      triggerMessage('Tidak dapat menghapus user utama (arfiandafirsta@gmail.com)', 'error');
      setShowDeleteConfirm(false);
      setUserToDelete(null);
      return;
    }

    try {
      const result = await AuthService.deleteUser(userToDelete.id, currentUser.id);

      if (result.success) {
        setUsers(users.filter(u => u.id !== userToDelete.id));
        triggerMessage('User berhasil dihapus!');
      } else {
        triggerMessage(result.error || 'Gagal menghapus user', 'error');
      }
    } catch (err) {
      console.error(err);
      triggerMessage('Gagal menghapus user', 'error');
    } finally {
      setShowDeleteConfirm(false);
      setUserToDelete(null);
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    if (!currentUser) return;

    try {
      const result = await AuthService.updateUserRoleWithEmail(userId, newRole, currentUser.id);

      if (result.success) {
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole, updatedAt: new Date() } : u));
        triggerMessage('Role user berhasil diperbarui!');
      } else {
        triggerMessage(result.error || 'Gagal mengubah role', 'error');
      }
    } catch (err) {
      console.error(err);
      triggerMessage('Gagal mengubah role user', 'error');
    }
  };

  // Get badge color based on role
  const getRoleBadgeClass = (role: UserRole) => {
    switch (role) {
      case 'superadmin':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'admin':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'operator':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Get role label
  const getRoleLabel = (role: UserRole) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  // Access control - only superadmin can access
  if (!isSuperadmin) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-red-50 rounded-full">
              <XCircle size={64} className="text-red-600" />
            </div>
          </div>
          <h2 className="font-sans font-bold text-2xl text-[#001e40] mb-3">
            Akses Ditolak
          </h2>
          <p className="text-slate-600 text-sm font-medium">
            Hanya Superadmin yang dapat mengakses halaman manajemen user.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div id="user-management" className="space-y-8 animate-fade-in">

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center space-x-2 bg-red-50 text-red-700 border border-red-200 px-3.5 py-1.5 rounded-full text-xs font-sans font-extrabold uppercase">
            <Shield size={13} />
            <span>Manajemen User - Superadmin Only</span>
          </div>
          <h1 className="font-sans font-black text-3xl sm:text-4xl text-[#001e40] tracking-tight">
            User Management
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Kelola akun user, role, dan akses sistem
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-3 bg-[#001e40] hover:bg-[#002d61] text-white rounded-xl font-sans font-bold text-xs uppercase tracking-wider flex items-center space-x-2 shadow-sm transition duration-300 cursor-pointer"
        >
          <UserPlus size={16} className="text-[#feb234]" />
          <span>Tambah User Baru</span>
        </button>
      </div>

      {/* Status Message */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl flex items-center space-x-3 text-xs font-sans leading-relaxed border animate-fade-in ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-250'
              : 'bg-red-50 text-red-750 border-red-250'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle size={16} />
          ) : (
            <XCircle size={16} />
          )}
          <span className="font-bold">{statusMessage.text}</span>
        </div>
      )}

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari user berdasarkan nama atau email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-sans text-slate-800 focus:border-[#001e40] focus:ring-0 outline-none"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Role:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as UserStatus)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-sans font-semibold text-slate-700 focus:border-[#001e40] outline-none cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="superadmin">Superadmin</option>
            <option value="admin">Admin</option>
            <option value="operator">Operator</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-[#001e40]"></div>
            <p className="mt-4 text-slate-500 text-sm font-medium">Loading users...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <th className="px-5 py-4 font-black uppercase tracking-wider">User</th>
                  <th className="px-5 py-4 font-black uppercase tracking-wider">Email</th>
                  <th className="px-5 py-4 font-black uppercase tracking-wider">Role</th>
                  <th className="px-5 py-4 font-black uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-12 text-center text-slate-500 font-medium">
                      {searchQuery || statusFilter !== 'all'
                        ? 'Tidak ada user yang sesuai dengan filter'
                        : 'Belum ada user'}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(user => {
                    const isProtected = user.email === PROTECTED_USER_EMAIL;
                    return (
                      <tr key={user.id} className="hover:bg-slate-50/75 transition">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#001e40] to-[#feb234] flex items-center justify-center text-white font-bold text-sm shrink-0">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-sm">{user.name}</p>
                              {isProtected && (
                                <span className="text-[10px] text-red-600 font-semibold flex items-center gap-1 mt-0.5">
                                  <Shield size={10} />
                                  Protected Account
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-slate-600 font-medium">{user.email}</p>
                        </td>
                        <td className="px-5 py-4">
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                            disabled={isProtected}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border cursor-pointer transition-colors ${
                              isProtected
                                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                : getRoleBadgeClass(user.role) + ' hover:opacity-80'
                            }`}
                          >
                            <option value="superadmin">Superadmin</option>
                            <option value="admin">Admin</option>
                            <option value="operator">Operator</option>
                          </select>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleDeleteClick(user)}
                              disabled={isProtected}
                              className={`p-2 rounded-xl transition-colors ${
                                isProtected
                                  ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                  : 'bg-slate-50 border border-slate-200 hover:bg-red-650 hover:text-white text-slate-600 cursor-pointer'
                              }`}
                              title={isProtected ? 'Cannot delete protected user' : 'Delete user'}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-[100] animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
            <div className="flex justify-between items-center border-b border-slate-200 p-5">
              <h3 className="font-sans font-black text-lg text-[#001e40]">Tambah User Baru</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <XCircle size={20} />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-slate-700 font-bold block text-xs">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={addUserForm.email}
                  onChange={(e) => setAddUserForm({ ...addUserForm, email: e.target.value })}
                  placeholder="user@example.com"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-sans text-slate-800 focus:border-[#001e40] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-bold block text-xs">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={addUserForm.name}
                  onChange={(e) => setAddUserForm({ ...addUserForm, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-sans text-slate-800 focus:border-[#001e40] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-bold block text-xs">
                  Role / Permission Level <span className="text-red-500">*</span>
                </label>
                <select
                  value={addUserForm.role}
                  onChange={(e) => setAddUserForm({ ...addUserForm, role: e.target.value as UserRole })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-sans font-semibold text-slate-700 focus:border-[#001e40] outline-none cursor-pointer"
                >
                  <option value="operator">Operator - Basic operational access</option>
                  <option value="admin">Admin - Full management access</option>
                  <option value="superadmin">Superadmin - Complete system control</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-150 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-sans font-bold rounded-xl text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-5 py-2.5 bg-[#001e40] hover:bg-[#002d61] text-white font-sans font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && userToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-[100] animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
            <div className="p-5 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={32} className="text-red-600" />
              </div>
              <h3 className="font-sans font-black text-xl text-[#001e40] mb-2">
                Delete User?
              </h3>
              <p className="text-slate-600 text-sm font-medium mb-6">
                Are you sure you want to delete the user{' '}
                <span className="font-bold text-[#001e40]">{userToDelete.name}</span>?
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setUserToDelete(null);
                  }}
                  className="flex-1 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-sans font-bold rounded-xl text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="flex-1 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-sans font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}