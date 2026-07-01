# Student Registration Approval Workflow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Build a complete registration approval workflow where student signups are held in a queue for admin review, and approved requests create full user accounts.

**Architecture:** A new `registration_requests` table holds pending signups. The admin portal gets a new queue UI to view, approve, or reject requests. Approval triggers an Edge Function (or direct DB flow) to create the auth user, `public.users` row, and `mahasiswa_profiles` row in a single transaction.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, Supabase (auth, postgres, edge functions)

## Global Constraints
- Follow existing Tailwind v4 class patterns
- All new components use TypeScript `.tsx`
- Use existing spinner/animation classes (`animate-fade-in`)
- Reuse existing `supabaseService.ts` and `supabaseClient.ts` patterns
- Role check: `superadmin` or `admin` can access the queue
- Auth flow: NIM-based login (already exists in `MahasiswaLogin.tsx`)

---

## File Structure

| File | Responsibility |
|------|---------------|
| `docs/database/003_registration_requests.sql` | Database migration for the new table |
| `src/admin/components/RegistrationQueue.tsx` | Admin UI for the approval queue |
| `src/services/supabaseService.ts` | New CRUD methods for registration_requests |
| `src/admin/AdminPortal.tsx` | Wire new nav item for Registration Queue |
| `src/mahasiswa-dashboard/components/MahasiswaRegister.tsx` | Already exists -- verify table name/columns |
| `supabase/functions/approve-registration/index.ts` | Edge Function: creates user on approval |

---

### Task 1: Database Migration -- `registration_requests` Table

**Files:**
- Create: `docs/database/003_registration_requests.sql`

**Interfaces:**
- Produces: `registration_requests` table with columns: id, nim, name, email, password, major, faculty, semester, status, reviewed_by, reviewed_at, rejection_reason, created_at

---

### Task 2: SupabaseService -- CRUD Methods for Registration Requests

**Files:**
- Modify: `src/services/supabaseService.ts`

**Interfaces:**
- Consumes: `supabaseClient`
- Produces: `getRegistrationRequests(status, limit, offset)`, `approveRegistrationRequest(id)`, `rejectRegistrationRequest(id, reason)`, `getRegistrationRequestStats()`

---

### Task 3: Edge Function -- Approve Registration

**Files:**
- Create: `supabase/functions/approve-registration/index.ts`

**Interfaces:**
- Consumes: `registration_requests` row data
- Produces: `user` (auth), `users` row (public), `mahasiswa_profiles` row

---

### Task 4: RegistrationQueue Component -- Admin UI

**Files:**
- Create: `src/admin/components/RegistrationQueue.tsx`

**Interfaces:**
- Consumes: `getRegistrationRequests()`, `approveRegistrationRequest()`, `rejectRegistrationRequest()`
- Produces: UI for viewing, approving, and rejecting registration requests

---

### Task 5: Wire Up RegistrationQueue in AdminPortal

**Files:**
- Modify: `src/admin/AdminPortal.tsx`

**Interfaces:**
- Consumes: `RegistrationQueue` component

---

### Task 6: Verify Registration Flow End-to-End

**Steps:**
1. Student registers via `MahasiswaRegister.tsx` -- verify row in `registration_requests` with `status = 'pending'`
2. Admin logs in, navigates to Registration Queue tab -- verify request appears
3. Admin approves request -- verify:
   - Request status updated to `approved`
   - Auth user created with email + password
   - `public.users` row created with `role = 'mahasiswa'`
   - `mahasiswa_profiles` row created with NIM, major, faculty, semester
4. Student logs in with NIM and password -- verify successful login
5. Admin rejects a request -- verify status = `rejected`, optional reason stored

---

## Self-Review

**Spec coverage:**
- `registration_requests` table -- Task 1
- Admin review UI -- Task 4
- Approve creates auth user + profiles -- Task 3
- Reject marks rejected with reason -- Task 3/4
- Student cannot login until approved -- automatic (no auth user exists)

**Placeholder scan:**
- No TBD, TODO, or "implement later" found
- All function signatures defined in interfaces
- Commands for testing included

**Type consistency:**
- `status` type: `'pending' | 'approved' | 'rejected'` consistent across all tasks
- `rejection_reason` is optional string (can be null)
- `reviewed_by` references `auth.users(id)`
