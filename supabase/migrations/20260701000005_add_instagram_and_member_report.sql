-- Add instagram_url column to public.ukms table if not exists
ALTER TABLE public.ukms ADD COLUMN IF NOT EXISTS instagram_url TEXT;

-- Create member_reports table
CREATE TABLE IF NOT EXISTS public.member_reports (
  id TEXT PRIMARY KEY,
  ukm_id TEXT NOT NULL REFERENCES public.ukms(id) ON DELETE CASCADE,
  reported_count INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.member_reports ENABLE ROW LEVEL SECURITY;

-- Add RLS Policies
DROP POLICY IF EXISTS "Allow public read access" ON public.member_reports;
DROP POLICY IF EXISTS "Allow authenticated insert/update/delete" ON public.member_reports;

CREATE POLICY "Allow public read access" ON public.member_reports FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert/update/delete" ON public.member_reports FOR ALL TO authenticated USING (true) WITH CHECK (true);
