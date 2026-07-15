-- Migration: Create Alumni Public View and Restrict Raw Table SELECT RLS
-- Description: Expose non-PII directory details in a public view while securing raw alumni_records.

-- 1. Create the public view
CREATE OR REPLACE VIEW public.alumni_public_stats AS
SELECT
  id,
  name,
  graduation_year,
  major,
  status,
  company,
  position
FROM public.alumni_records;

-- Grant select on public view to anon and authenticated roles
GRANT SELECT ON public.alumni_public_stats TO anon, authenticated;

-- 2. Restrict SELECT RLS policy on raw table
DROP POLICY IF EXISTS "public_read" ON public.alumni_records;
DROP POLICY IF EXISTS "auth_write" ON public.alumni_records;
DROP POLICY IF EXISTS "Allow public read of alumni" ON public.alumni_records;
DROP POLICY IF EXISTS "Only admins can read alumni records" ON public.alumni_records;
DROP POLICY IF EXISTS "Admins can manage alumni" ON public.alumni_records;

CREATE POLICY "Only admins can read alumni records" ON public.alumni_records
  FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage alumni" ON public.alumni_records
  FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
