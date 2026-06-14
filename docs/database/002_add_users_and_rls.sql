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