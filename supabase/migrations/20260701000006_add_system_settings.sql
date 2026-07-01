-- Create system_settings table
CREATE TABLE IF NOT EXISTS public.system_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Seed under_construction setting
INSERT INTO public.system_settings (key, value)
VALUES ('under_construction', 'false')
ON CONFLICT (key) DO NOTHING;

-- Enable RLS
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Allow public read access" ON public.system_settings;
DROP POLICY IF EXISTS "Allow authenticated write" ON public.system_settings;

CREATE POLICY "Allow public read access" ON public.system_settings FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write" ON public.system_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
