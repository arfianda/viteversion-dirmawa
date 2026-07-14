-- Migration: create_login_logs
-- Created: 2026-07-13
-- Description: Create table for login logs and setup RLS policies.

CREATE TABLE IF NOT EXISTS public.login_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('success', 'failed')),
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.login_logs ENABLE ROW LEVEL SECURITY;

-- Allow inserts from anyone (anon or authenticated) so we can log all attempts
CREATE POLICY "Allow inserts for everyone" ON public.login_logs
  FOR INSERT WITH CHECK (true);

-- Allow select ONLY for superadmin
CREATE POLICY "Allow select for superadmin" ON public.login_logs
  FOR SELECT USING (
    (coalesce(auth.jwt() -> 'user_metadata' ->> 'role', '')) = 'superadmin' OR
    EXISTS (
      SELECT 1 FROM public.users
      WHERE public.users.id = auth.uid()
      AND public.users.role = 'superadmin'
    )
  );

-- Grant permissions
GRANT INSERT ON TABLE public.login_logs TO anon, authenticated;
GRANT SELECT ON TABLE public.login_logs TO authenticated;
