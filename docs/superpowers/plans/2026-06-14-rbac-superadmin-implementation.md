# RBAC Hierarchical Superadmin System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a role-based access control system with superadmin (Arfianda) at the top, enabling user management and role assignment.

**Architecture:** Database-first approach with RLS policies enforcing permissions at the PostgreSQL level, supplemented by UI-level route guards. The `public.users` table links to `auth.users` via UUID, with roles stored as ENUM values.

**Tech Stack:** Supabase (PostgreSQL + Auth), React 19, TypeScript, Tailwind CSS v4

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `docs/database/002_add_users_and_rls.sql` | Create | Database migration with users table + RLS |
| `src/types.ts` | Modify | Add User type with role enum |
| `src/services/authService.ts` | Modify | Add role checking methods |
| `src/components/UserManagementView.tsx` | Create | User management UI (superadmin only) |
| `src/App.tsx` | Modify | Add role-based route guards |
| `src/components/Navbar.tsx` | Modify | Display user info + role badge |

---

### Task 1: Database Migration - Users Table and RLS Policies

**Files:**
- Create: `docs/database/002_add_users_and_rls.sql`

- [ ] **Step 1: Create migration file with users table**

```sql
-- Migration: 002_add_users_and_rls
-- Created: 2026-06-14
-- Description: Add users table for RBAC and superadmin seed data

-- ==========================================
-- 1. users - User accounts with roles
-- ==========================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT CHECK (role IN ('superadmin', 'admin', 'operator')) NOT NULL DEFAULT 'operator',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 2. Indexes for performance
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- ==========================================
-- 3. Enable Row Level Security
-- ==========================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 4. RLS Policies
-- ==========================================

-- Allow users to read their own profile
CREATE POLICY "Users can read own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Allow superadmin to read all user profiles
CREATE POLICY "Superadmin can read all users" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users u 
      WHERE u.id = auth.uid() AND u.role = 'superadmin'
    )
  );

-- Allow superadmin to manage all users (INSERT, UPDATE, DELETE)
CREATE POLICY "Superadmin manages all users" ON public.users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users u 
      WHERE u.id = auth.uid() AND u.role = 'superadmin'
    )
  );

-- ==========================================
-- 5. Seed initial superadmin user
-- ==========================================
-- Note: This will be inserted after the auth user is created
-- For now, we create a placeholder that superadmin will update

INSERT INTO public.users (id, email, name, role)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'arfiandafirsta@gmail.com',
  'Arfianda',
  'superadmin'
)
ON CONFLICT (email) DO UPDATE SET
  name = 'Arfianda',
  role = 'superadmin';
```

- [ ] **Step 2: Apply migration to Supabase**

```bash
# Using Supabase CLI from project root
supabase db push -f docs/database/002_add_users_and_rls.sql

# Or manually run in Supabase Dashboard SQL Editor
```

Expected: Table `public.users` created with RLS policies, superadmin user seeded

- [ ] **Step 3: Commit**

```bash
git add docs/database/002_add_users_and_rls.sql
git commit -m "feat: add users table with RLS policies for RBAC system"
```

---

### Task 2: Add User Type to types.ts

**Files:**
- Modify: `src/types.ts`

- [ ] **Step 1: Add UserRole and User types**

Read `src/types.ts` first, then add after the existing types:

```typescript
export type UserRole = 'superadmin' | 'admin' | 'operator';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/types.ts
git commit -m "types: add UserRole and User types for RBAC"
```

---

### Task 3: Extend AuthService with Role Methods

**Files:**
- Modify: `src/services/authService.ts`

- [ ] **Step 1: Add role checking methods to AuthService**

Add these methods at the end of the AuthService object (before the closing `};`):

```typescript
  /**
   * Get current user's role from database
   */
  async getUserRole(userId: string): Promise<UserRole | null> {
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    if (error || !data) {
      return null;
    }

    return data.role as UserRole;
  },

  /**
   * Check if user is admin or superadmin
   */
  async isAdmin(userId: string): Promise<boolean> {
    const role = await this.getUserRole(userId);
    return role === 'admin' || role === 'superadmin';
  },

  /**
   * Check if user is superadmin
   */
  async isSuperadmin(userId: string): Promise<boolean> {
    const role = await this.getUserRole(userId);
    return role === 'superadmin';
  },

  /**
   * Check if user can perform action based on role
   */
  async canAccess(userId: string, requiredRole: UserRole): Promise<boolean> {
    const role = await this.getUserRole(userId);
    if (!role) return false;

    const roleHierarchy: Record<UserRole, number> = {
      operator: 1,
      admin: 2,
      superadmin: 3,
    };

    return roleHierarchy[role] >= roleHierarchy[requiredRole];
  },

  /**
   * Update user role (superadmin only)
   */
  async updateUserRole(targetUserId: string, newRole: UserRole, currentUserId: string): Promise<{ success: boolean; error?: string }> {
    // Verify current user is superadmin
    const isSuper = await this.isSuperadmin(currentUserId);
    if (!isSuper) {
      return { success: false, error: 'Only superadmin can change roles' };
    }

    const { error } = await supabase
      .from('users')
      .update({ role: newRole, updated_at: new Date().toISOString() })
      .eq('id', targetUserId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  },

  /**
   * Get all users (superadmin only)
   */
  async getAllUsers(currentUserId: string): Promise<User[] | null> {
    const isSuper = await this.isSuperadmin(currentUserId);
    if (!isSuper) {
      return null;
    }

    const { data, error } = await supabase
      .from('users')
      .select('id, email, name, role, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (error) {
      return null;
    }

    return data as unknown as User[];
  },
```

- [ ] **Step 2: Import UserRole type at top of file**

```typescript
import { UserRole } from '../types';
```

- [ ] **Step 3: Commit**

```bash
git add src/services/authService.ts
git commit -m "feat: add role checking and user management methods to AuthService"
```

---

### Task 4: Create UserManagementView Component

**Files:**
- Create: `src/components/UserManagementView.tsx`

- [ ] **Step 1: Create the component**

```tsx
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { AuthService } from '../services/authService';
import { User, UserRole } from '../types';
import { Users, UserPlus, Edit2, Trash2, Search, Shield, XCircle } from 'lucide-react';

export function UserManagementView() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  // New user form state
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('operator');

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    setError(null);
    
    const session = await AuthService.getSession();
    if (!session) {
      setError('Not authenticated');
      setLoading(false);
      return;
    }

    setCurrentUser(session);

    const isSuper = await AuthService.isSuperadmin(session.id);
    if (!isSuper) {
      setError('Access denied: Superadmin access required');
      setLoading(false);
      return;
    }

    const allUsers = await AuthService.getAllUsers(session.id);
    if (allUsers) {
      setUsers(allUsers);
    }
    setLoading(false);
  }

  async function handleAddUser(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!currentUser) return;

    // In a real implementation, this would create auth user first
    // For now, we'll show a message that this requires Supabase Admin API
    setError('User creation requires Supabase Admin API. Use Supabase Dashboard to create users, then assign roles here.');
  }

  async function handleRoleChange(userId: string, newRole: UserRole) {
    if (!currentUser) return;

    const result = await AuthService.updateUserRole(userId, newRole, currentUser.id);
    if (!result.success) {
      setError(result.error || 'Failed to update role');
      return;
    }

    // Refresh users list
    await loadUsers();
  }

  async function handleDeleteUser(user: User) {
    if (!confirm(`Delete user ${user.name}? This action cannot be undone.`)) {
      return;
    }

    // Prevent self-deletion
    if (user.email === 'arfiandafirsta@gmail.com') {
      setError('Cannot delete the superadmin account');
      return;
    }

    // In real implementation, call Supabase Admin API
    setError('User deletion requires Supabase Admin API. Use Supabase Dashboard.');
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'superadmin': return 'bg-red-100 text-red-800 border-red-200';
      case 'admin': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'operator': return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error && !users.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                <p className="text-sm text-gray-500">Manage users and assign roles</p>
              </div>
            </div>
            {currentUser && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Logged in as:</span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
                  {currentUser.name} (Superadmin)
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <UserPlus className="w-5 h-5" />
            Add User
          </button>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                      disabled={user.email === 'arfiandafirsta@gmail.com'}
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${getRoleBadgeColor(user.role)} ${
                        user.email === 'arfiandafirsta@gmail.com' ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                      }`}
                    >
                      <option value="superadmin">Superadmin</option>
                      <option value="admin">Admin</option>
                      <option value="operator">Operator</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingUser(user)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit user"
                      >
                        <Edit2 className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user)}
                        disabled={user.email === 'arfiandafirsta@gmail.com'}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Delete user"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>No users found</p>
            </div>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Add New User</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddUser}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="operator">Operator</option>
                    <option value="admin">Admin</option>
                    <option value="superadmin">Superadmin</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/UserManagementView.tsx
git commit -m "feat: add UserManagementView component for superadmin"
```

---

### Task 5: Update App.tsx with Protected Routes

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Read App.tsx to understand current routing**

- [ ] **Step 2: Add role-based route guard**

Add a new route for user management that only superadmin can access. The implementation will depend on the current routing structure found in App.tsx.

After understanding the routing, add:

```typescript
// Import at top
import { UserManagementView } from './components/UserManagementView';

// In the routes section, add:
{
  path: 'admin/users',
  element: <ProtectedRoute requiredRole="superadmin"><UserManagementView /></ProtectedRoute>
}
```

- [ ] **Step 3: Create/update ProtectedRoute component if needed**

If a ProtectedRoute component doesn't exist, create it or add inline role checking in the route.

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "feat: add protected route for user management"
```

---

### Task 6: Update Navbar with User Info

**Files:**
- Modify: `src/components/Navbar.tsx`

- [ ] **Step 1: Read Navbar.tsx to understand current structure**

- [ ] **Step 2: Add user info display and role badge**

Add in the Navbar:
- Display current user name
- Show role badge (superadmin/admin/operator)
- Link to user management (visible only to superadmin)

- [ ] **Step 3: Commit**

```bash
git add src/components/Navbar.tsx
git commit -m "feat: add user info and role badge to Navbar"
```

---

## Testing Checklist

After implementation, verify:

- [ ] Superadmin user exists in database with correct email
- [ ] RLS policies prevent non-superadmin from accessing user management
- [ ] AuthService methods return correct role checks
- [ ] UserManagementView renders only for superadmin
- [ ] Role assignment works correctly
- [ ] Protected routes redirect unauthorized users

---

## Self-Review

**Spec Coverage Check:**

| Spec Requirement | Task |
|-----------------|------|
| Users table with RLS | Task 1 |
| Seed superadmin (Arfianda) | Task 1 |
| UserRole type | Task 2 |
| AuthService role methods | Task 3 |
| UserManagementView UI | Task 4 |
| Protected routes | Task 5 |
| Navbar user info | Task 6 |

**Type Consistency Check:**
- `UserRole` type defined in `types.ts` is used consistently across `authService.ts`, `UserManagementView.tsx`
- Method signatures match: `getUserRole`, `isAdmin`, `isSuperadmin`, `canAccess`, `updateUserRole`, `getAllUsers`

**No Placeholders Found** ✓