-- Migration: 006_scholarship_applications
-- Created: 2026-06-30
-- Description: Create scholarship_applications table with appropriate RLS policies.

CREATE TABLE IF NOT EXISTS public.scholarship_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  scholarship_id TEXT NOT NULL REFERENCES public.scholarships(id) ON DELETE CASCADE,
  nim TEXT NOT NULL,
  name TEXT NOT NULL,
  major TEXT NOT NULL,
  gpa NUMERIC NOT NULL,
  phone TEXT,
  document_url TEXT, -- URL for CV/transcript PDF or a simulated file upload
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, scholarship_id) -- Prevent duplicate application
);

-- Enable Row Level Security
ALTER TABLE public.scholarship_applications ENABLE ROW LEVEL SECURITY;

-- Grant permissions to client roles
GRANT SELECT, INSERT, UPDATE ON public.scholarship_applications TO authenticated;
GRANT SELECT ON public.scholarship_applications TO anon;

-- RLS Policies
DROP POLICY IF EXISTS "Users can manage own applications" ON public.scholarship_applications;
CREATE POLICY "Users can manage own applications" ON public.scholarship_applications
  FOR ALL TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins manage all applications" ON public.scholarship_applications;
CREATE POLICY "Admins manage all applications" ON public.scholarship_applications
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE public.users.id = auth.uid()
      AND (
        public.users.role IN ('administrator', 'superadmin', 'admin', 'staf_beasiswa', 'direktur')
        OR public.users.roles && ARRAY['superadmin', 'admin', 'administrator', 'staf_beasiswa', 'direktur']
      )
    )
  );

-- =========================================================================
-- GLOBAL GRANTS FOR CLIENT ROLES (anon / authenticated)
-- =========================================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
