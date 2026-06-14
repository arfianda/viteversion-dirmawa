# RBAC Hierarchical Superadmin System Design

**Date:** 2026-06-14  
**Author:** Arfianda  
**Status:** Approved

---

## Overview

This document specifies the Role-Based Access Control (RBAC) hierarchical system for the Dirmawa portal. The system introduces user management with three role levels, enabling the superadmin (Arfianda) to manage other users and assign roles.

## Architecture

### Database Schema

```
auth.users (Supabase built-in)
    ↓ (1:1 via UUID)
public.users
    ├── id (UUID, PK, FK → auth.users.id)
    ├── email (TEXT, UNIQUE, NOT NULL)
    ├── name (TEXT, NOT NULL)
    ├── role (TEXT ENUM: 'superadmin' | 'admin' | 'operator')
    ├── created_at (TIMESTAMPTZ)
    └── updated_at (TIMESTAMPTZ)
```

### Role Hierarchy

| Role | Level | Description |
|------|-------|-------------|
| `superadmin` | L3 | Full system access, user management, role assignment |
| `admin` | L2 | Content management (CRUD), no user management |
| `operator` | L1 | View-only + draft creation, requires approval |

### Initial Seed Data

```sql
INSERT INTO public.users (email, name, role)
VALUES ('arfiandafirsta@gmail.com', 'Arfianda', 'superadmin');
```

---

## Permissions Matrix

| Permission | superadmin | admin | operator |
|------------|------------|-------|----------|
| Manage Users & Roles | ✅ Full | ❌ None | ❌ None |
| Create Scholarships | ✅ Publish | ✅ Publish | ⚠️ Draft only |
| Create UKMs | ✅ Publish | ✅ Publish | ⚠️ Draft only |
| Create Achievements | ✅ Publish | ✅ Publish | ⚠️ Draft only |
| Create News | ✅ Publish | ✅ Publish | ⚠️ Draft only |
| Manage Alumni Records | ✅ Full | ✅ Full | ❌ None |
| View All Content | ✅ | ✅ | ✅ |
| Access Admin Panel | ✅ Full | ✅ Partial | ❌ Limited |

**Legend:** ✅ = Full access, ⚠️ = Restricted, ❌ = No access

---

## Implementation Modules

### 1. Database Migration (`002_add_users_and_rls.sql`)
- Create `public.users` table
- Add RLS policies for role-based access
- Create indexes on `email` and `role`
- Seed initial superadmin user

### 2. AuthService Extension (`src/services/authService.ts`)
- `getUserRole(userId: string): Promise<string>`
- `isAdmin(userId: string): Promise<boolean>`
- `isSuperadmin(userId: string): Promise<boolean>`
- `canAccess(permission: string): Promise<boolean>`

### 3. User Management UI (`src/components/UserManagementView.tsx`)
- User list with search/filter
- Add new user form
- Edit user role dropdown
- Delete user confirmation
- Visible only to superadmin

### 4. Protected Routes (`src/App.tsx`)
- Role-based route guards
- Redirect unauthorized users
- Show appropriate error messages

---

## Row Level Security (RLS) Policies

### Users Table
```sql
-- Allow authenticated users to read their own profile
CREATE POLICY "Users can read own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Allow superadmin to read all users
CREATE POLICY "Superadmin can read all users" ON public.users
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'superadmin')
  );

-- Allow superadmin to insert/update/delete users
CREATE POLICY "Superadmin manages users" ON public.users
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'superadmin')
  );
```

### Content Tables (scholarships, ukms, achievements, news)
```sql
-- Public read, authenticated write with role check
CREATE POLICY "Authenticated users can insert" ON scholarships
  FOR INSERT TO authenticated USING (true);

CREATE POLICY "Admin+ can update" ON scholarships
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role IN ('superadmin', 'admin'))
  );
```

---

## Success Criteria

1. ✅ Superadmin (Arfianda) can log in with full access
2. ✅ Superadmin can create/edit/delete users
3. ✅ Superadmin can assign/change user roles
4. ✅ Role-based permissions enforced at database level (RLS)
5. ✅ Role-based permissions enforced at UI level (route guards)
6. ✅ Operators can create drafts but cannot publish

---

## Files to Modify/Create

| File | Action | Purpose |
|------|--------|---------|
| `docs/database/002_add_users_and_rls.sql` | Create | Migration |
| `src/services/authService.ts` | Modify | Add role methods |
| `src/types.ts` | Modify | Add User type |
| `src/components/UserManagementView.tsx` | Create | Admin UI |
| `src/App.tsx` | Modify | Add protected routes |
| `src/components/Navbar.tsx` | Modify | Show user info + logout |

---

## Notes

- All RLS policies must be tested before deployment
- User deletion should cascade to related content (soft delete considered)
- Email uniqueness constraint prevents duplicate accounts
- Consider adding `last_login` tracking in future iteration