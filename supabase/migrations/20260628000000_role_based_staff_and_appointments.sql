-- Migration: 007_role_based_staff_and_appointments
-- Created: 2026-07-01
-- Description: Add roles array column to users, update constraints, and create appointments table with RLS

-- 1. Alter public.users role check constraint to allow new roles
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE public.users ADD CONSTRAINT users_role_check CHECK (
  role IN ('superadmin', 'direktur', 'staf_beasiswa', 'staf_ormawa', 'staf_alumni', 'staf_depan', 'admin', 'administrator', 'operator', 'mahasiswa', 'alumni', 'admin_ormawa')
);

-- 2. Add roles array column if it doesn't exist
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS roles TEXT[];

-- 3. Migrate existing roles into the roles array
UPDATE public.users SET roles = ARRAY[role] WHERE roles IS NULL;

-- 4. Set DEFAULT for roles column
ALTER TABLE public.users ALTER COLUMN roles SET DEFAULT ARRAY['mahasiswa'];

-- 5. Create appointments table
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  student_name TEXT NOT NULL,
  ormawa_name TEXT,
  purpose TEXT NOT NULL,
  requested_date DATE NOT NULL,
  requested_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Enable RLS on appointments
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies for appointments
CREATE POLICY "Allow anyone authenticated to insert appointments" ON public.appointments
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow creators to view their own appointments" ON public.appointments
  FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Allow staff and direktur to manage appointments" ON public.appointments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE public.users.id = auth.uid()
      AND (
        public.users.role IN ('superadmin', 'admin', 'administrator')
        OR public.users.roles && ARRAY['superadmin', 'direktur', 'staf_depan']
      )
    )
  );
