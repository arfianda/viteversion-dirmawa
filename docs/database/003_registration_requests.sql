-- Migration: 003_registration_requests
-- Created: 2025-06-19
-- Description: Add registration_requests table for student registration approval workflow

-- ==========================================
-- 1. registration_requests - Pending student registrations awaiting admin approval
-- ==========================================
CREATE TABLE IF NOT EXISTS public.registration_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nim TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  password TEXT, -- Nullable after approval for security
  major TEXT NOT NULL,
  faculty TEXT NOT NULL,
  semester INTEGER,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 2. Indexes for performance
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_registration_requests_status ON public.registration_requests(status);
CREATE INDEX IF NOT EXISTS idx_registration_requests_nim ON public.registration_requests(nim);
CREATE INDEX IF NOT EXISTS idx_registration_requests_created_at ON public.registration_requests(created_at DESC);

-- ==========================================
-- 3. Enable Row Level Security
-- ==========================================
ALTER TABLE public.registration_requests ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 4. RLS Policies
-- ==========================================

-- Allow anyone to insert their own registration request (for the signup form)
CREATE POLICY "Anyone can register" ON public.registration_requests
  FOR INSERT WITH CHECK (true);

-- Allow admin/superadmin to view all registration requests
CREATE POLICY "Admin can view all requests" ON public.registration_requests
  FOR SELECT USING (
    (coalesce(auth.jwt() -> 'user_metadata' ->> 'role', '')) IN ('admin', 'superadmin')
  );

-- Allow admin/superadmin to update registration requests
CREATE POLICY "Admin can update requests" ON public.registration_requests
  FOR ALL USING (
    (coalesce(auth.jwt() -> 'user_metadata' ->> 'role', '')) IN ('admin', 'superadmin')
  );
