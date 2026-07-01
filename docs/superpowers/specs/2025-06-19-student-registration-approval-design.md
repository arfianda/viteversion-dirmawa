# Student Registration Approval Workflow

## Overview
Enable student registration requests to be reviewed and approved by admin users (`superadmin` or `admin` roles) before they become active in the system.

## Flow

```
Student → Register (MahasiswaRegister.tsx)
   ↓
INSERT INTO registration_requests (status = 'pending')
   ↓
Admin Portal → Registration Queue Tab
   ↓
Admin clicks Accept/Reject
   ↓
On Accept: Create Auth User → Insert users → Insert mahasiswa_profiles → Update request
On Reject: Update request with rejection_reason
```

## Database Schema

### registration_requests Table

```sql
CREATE TABLE IF NOT EXISTS public.registration_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nim TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  major TEXT NOT NULL,
  faculty TEXT NOT NULL,
  semester INTEGER,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_registration_requests_status ON public.registration_requests(status);
CREATE INDEX idx_registration_requests_nim ON public.registration_requests(nim);

-- RLS: Only admin/superadmin can view and manage requests
ALTER TABLE public.registration_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can view all registration requests"
  ON public.registration_requests FOR SELECT
  USING (auth.jwt()->>'role' IN ('admin', 'superadmin'));

CREATE POLICY "Admin can update registration requests"
  ON public.registration_requests FOR ALL
  USING (auth.jwt()->>'role' IN ('admin', 'superadmin'));
```

## Frontend Changes

### src/mahasiswa-dashboard/components/MahasiswaRegister.tsx
- Already inserts into `registration_requests`. Verified table name and columns.

### src/admin/AdminPortal.tsx
- Add new nav item: **Registration Queue**
- Route to a new component: `RegistrationQueue.tsx`

### src/admin/components/RegistrationQueue.tsx (New)
- **UI**: Table of pending registration requests
- **Columns**: NIM, Nama, Email, Program Studi, Fakultas, Semester, Tanggal Daftar
- **Actions per row**: 
  - *View Detail* (modal)
  - *Accept* (with confirmation) → calls `approveRegistrationRequest(id)`
  - *Reject* (modal for optional reason) → calls `rejectRegistrationRequest(id, reason)`
- **Filters**: Show All / Pending / Approved / Rejected
- **Empty state**: Message when there are no pending requests

### src/services/supabaseService.ts
- `getRegistrationRequests(status?)` → fetch from `registration_requests`
- `approveRegistrationRequest(id, adminId)` 
  - Transaction: create auth user → insert `public.users` → insert `mahasiswa_profiles` → update request
- `rejectRegistrationRequest(id, reason)` → update request status

### src/services/authService.ts
- `createUserFromRegistration(requestId, adminId)` → Edge Function or RPC call to handle the multi-step approval

## Security
1. Plain text password stored in `registration_requests` — acceptable for temporary holding since proper RLS restricts access to verified admin roles
2. On approval, password is consumed by Supabase Auth; the row in registration_requests can have password set to null or the row deleted after approval

## Error Handling
- Handle case where NIM or email already exists when approving (duplicate prevention)
- Handle Supabase Auth creation failures (e.g., email already in auth)
- Show loading states during approval (creating user takes time)
- Rollback on failure: if any step fails, mark request as failed and alert admin

## Testing Checklist
- [ ] Student can register and `registration_requests` row is created with status = 'pending'
- [ ] Admin can see the request in the Registration Queue tab
- [ ] Admin can approve the request — verify user created in Auth, users table, and mahasiswa_profiles
- [ ] Admin can reject the request with optional reason
- [ ] Student cannot log in until approved
- [ ] Already-existing NIM/email is prevented at both register time and approve time
