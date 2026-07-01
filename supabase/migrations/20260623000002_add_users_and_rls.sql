-- Migration: 002_add_users_and_rls
-- Created: 2026-06-14
-- Description: Add users table, profile tables, RLS policies, and seed users

-- ==========================================
-- 1. users - User accounts with roles
-- ==========================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT CHECK (role IN ('superadmin', 'admin', 'administrator', 'operator', 'mahasiswa', 'alumni')) NOT NULL DEFAULT 'operator',
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 2. mahasiswa_profiles - Student profiles
-- ==========================================
CREATE TABLE IF NOT EXISTS public.mahasiswa_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  nim TEXT UNIQUE NOT NULL,
  major TEXT NOT NULL,
  faculty TEXT,
  semester INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 3. alumni_profiles - Alumni profiles
-- ==========================================
CREATE TABLE IF NOT EXISTS public.alumni_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  nim TEXT UNIQUE,
  graduation_year INTEGER,
  major TEXT,
  company TEXT,
  position TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 4. Indexes for performance
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_mahasiswa_profiles_user ON public.mahasiswa_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_mahasiswa_profiles_nim ON public.mahasiswa_profiles(nim);
CREATE INDEX IF NOT EXISTS idx_alumni_profiles_user ON public.alumni_profiles(user_id);

-- ==========================================
-- 5. Enable Row Level Security
-- ==========================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mahasiswa_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alumni_profiles ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 6. RLS Policies
-- ==========================================

-- users policies
CREATE POLICY "Users can read own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Superadmin can read all users" ON public.users
  FOR SELECT USING ((coalesce(auth.jwt() -> 'user_metadata' ->> 'role', '')) = 'superadmin');
CREATE POLICY "Superadmin manages all users" ON public.users
  FOR ALL USING ((coalesce(auth.jwt() -> 'user_metadata' ->> 'role', '')) = 'superadmin');
CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- mahasiswa_profiles policies
CREATE POLICY "Users can view own profile" ON public.mahasiswa_profiles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.mahasiswa_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE public.users.id = auth.uid()
      AND public.users.role IN ('administrator', 'superadmin', 'admin')
    )
  );
CREATE POLICY "Users can insert own profile" ON public.mahasiswa_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.mahasiswa_profiles
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- alumni_profiles policies
CREATE POLICY "Users can view own alumni profile" ON public.alumni_profiles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all alumni profiles" ON public.alumni_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE public.users.id = auth.uid()
      AND public.users.role IN ('administrator', 'superadmin', 'admin')
    )
  );
CREATE POLICY "Users can insert own alumni profile" ON public.alumni_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own alumni profile" ON public.alumni_profiles
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ==========================================
-- 7. Seed initial users in auth.users
-- ==========================================

-- Seed superadmin: arfiandafirsta@gmail.com
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change_token_new, email_change_token_current, recovery_token, phone_change_token, email_change, phone_change, reauthentication_token)
VALUES (
  '00000000-0000-0000-0000-000000000000'::uuid,
  '00000000-0000-0000-0000-000000000001'::uuid,
  'authenticated',
  'authenticated',
  'arfiandafirsta@gmail.com',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"provider": "email", "providers": ["email"]}'::jsonb,
  '{"name": "Arfianda", "role": "superadmin"}'::jsonb,
  now(),
  now(),
  '', '', '', '', '',
  '', '', ''
)
ON CONFLICT (id) DO NOTHING;

-- Seed student: budi@upb.ac.id
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change_token_new, email_change_token_current, recovery_token, phone_change_token, email_change, phone_change, reauthentication_token)
VALUES (
  '00000000-0000-0000-0000-000000000000'::uuid,
  '00000000-0000-0000-0000-000000000005'::uuid,
  'authenticated',
  'authenticated',
  'budi@upb.ac.id',
  crypt('student123', gen_salt('bf')),
  now(),
  '{"provider": "email", "providers": ["email"]}'::jsonb,
  '{"name": "Budi Santoso", "role": "mahasiswa"}'::jsonb,
  now(),
  now(),
  '', '', '', '', '',
  '', '', ''
)
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- 8. Seed public.users and profiles
-- ==========================================

-- Seed public.users
INSERT INTO public.users (id, email, name, role)
VALUES 
  ('00000000-0000-0000-0000-000000000001'::uuid, 'arfiandafirsta@gmail.com', 'Arfianda', 'superadmin'),
  ('00000000-0000-0000-0000-000000000005'::uuid, 'budi@upb.ac.id', 'Budi Santoso', 'mahasiswa')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role;

-- Seed mahasiswa_profiles for Budi Santoso
INSERT INTO public.mahasiswa_profiles (user_id, nim, major, faculty, semester)
VALUES (
  '00000000-0000-0000-0000-000000000005'::uuid,
  '202100123',
  'Teknik Informatika',
  'Fakultas Teknik',
  7
)
ON CONFLICT (user_id) DO UPDATE SET
  nim = EXCLUDED.nim,
  major = EXCLUDED.major,
  faculty = EXCLUDED.faculty,
  semester = EXCLUDED.semester;