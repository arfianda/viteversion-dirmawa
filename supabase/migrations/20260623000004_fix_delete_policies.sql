-- Migration: 004_fix_delete_policies
-- Created: 2026-06-20
-- Description: Recreate RLS policies for all content tables to explicitly allow DELETE actions for authenticated admins.
-- INSTRUCTIONS: Copy and paste this script into your Supabase Dashboard SQL Editor, then run it to fix the deletion issue.

-- List of content tables to fix:
-- 1. student_news
-- 2. scholarships
-- 3. scholarship_requirements
-- 4. scholarship_benefits
-- 5. ukms
-- 6. ukpm_missions
-- 7. ukpm_schedules
-- 8. ukpm_gallery
-- 9. ukpm_contacts
-- 10. ukpm_requirements
-- 11. achievements
-- 12. alumni_records

-- =========================================================================
-- 1. student_news
-- =========================================================================
DROP POLICY IF EXISTS "public_read" ON public.student_news;
DROP POLICY IF EXISTS "auth_write" ON public.student_news;
DROP POLICY IF EXISTS "Allow public read access" ON public.student_news;
DROP POLICY IF EXISTS "Allow authenticated write" ON public.student_news;

ALTER TABLE public.student_news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read" ON public.student_news FOR SELECT USING (true);
CREATE POLICY "auth_write" ON public.student_news FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =========================================================================
-- 2. scholarships
-- =========================================================================
DROP POLICY IF EXISTS "public_read" ON public.scholarships;
DROP POLICY IF EXISTS "auth_write" ON public.scholarships;
DROP POLICY IF EXISTS "Allow public read access" ON public.scholarships;
DROP POLICY IF EXISTS "Allow authenticated write" ON public.scholarships;

ALTER TABLE public.scholarships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read" ON public.scholarships FOR SELECT USING (true);
CREATE POLICY "auth_write" ON public.scholarships FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =========================================================================
-- 3. scholarship_requirements
-- =========================================================================
DROP POLICY IF EXISTS "public_read" ON public.scholarship_requirements;
DROP POLICY IF EXISTS "auth_write" ON public.scholarship_requirements;
DROP POLICY IF EXISTS "Allow public read access" ON public.scholarship_requirements;
DROP POLICY IF EXISTS "Allow authenticated write" ON public.scholarship_requirements;

ALTER TABLE public.scholarship_requirements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read" ON public.scholarship_requirements FOR SELECT USING (true);
CREATE POLICY "auth_write" ON public.scholarship_requirements FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =========================================================================
-- 4. scholarship_benefits
-- =========================================================================
DROP POLICY IF EXISTS "public_read" ON public.scholarship_benefits;
DROP POLICY IF EXISTS "auth_write" ON public.scholarship_benefits;
DROP POLICY IF EXISTS "Allow public read access" ON public.scholarship_benefits;
DROP POLICY IF EXISTS "Allow authenticated write" ON public.scholarship_benefits;

ALTER TABLE public.scholarship_benefits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read" ON public.scholarship_benefits FOR SELECT USING (true);
CREATE POLICY "auth_write" ON public.scholarship_benefits FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =========================================================================
-- 5. ukms
-- =========================================================================
DROP POLICY IF EXISTS "public_read" ON public.ukms;
DROP POLICY IF EXISTS "auth_write" ON public.ukms;
DROP POLICY IF EXISTS "Allow public read access" ON public.ukms;
DROP POLICY IF EXISTS "Allow authenticated write" ON public.ukms;

ALTER TABLE public.ukms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read" ON public.ukms FOR SELECT USING (true);
CREATE POLICY "auth_write" ON public.ukms FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =========================================================================
-- 6. ukpm_missions
-- =========================================================================
DROP POLICY IF EXISTS "public_read" ON public.ukpm_missions;
DROP POLICY IF EXISTS "auth_write" ON public.ukpm_missions;
DROP POLICY IF EXISTS "Allow public read access" ON public.ukpm_missions;
DROP POLICY IF EXISTS "Allow authenticated write" ON public.ukpm_missions;

ALTER TABLE public.ukpm_missions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read" ON public.ukpm_missions FOR SELECT USING (true);
CREATE POLICY "auth_write" ON public.ukpm_missions FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =========================================================================
-- 7. ukpm_schedules
-- =========================================================================
DROP POLICY IF EXISTS "public_read" ON public.ukpm_schedules;
DROP POLICY IF EXISTS "auth_write" ON public.ukpm_schedules;
DROP POLICY IF EXISTS "Allow public read access" ON public.ukpm_schedules;
DROP POLICY IF EXISTS "Allow authenticated write" ON public.ukpm_schedules;

ALTER TABLE public.ukpm_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read" ON public.ukpm_schedules FOR SELECT USING (true);
CREATE POLICY "auth_write" ON public.ukpm_schedules FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =========================================================================
-- 8. ukpm_gallery
-- =========================================================================
DROP POLICY IF EXISTS "public_read" ON public.ukpm_gallery;
DROP POLICY IF EXISTS "auth_write" ON public.ukpm_gallery;
DROP POLICY IF EXISTS "Allow public read access" ON public.ukpm_gallery;
DROP POLICY IF EXISTS "Allow authenticated write" ON public.ukpm_gallery;

ALTER TABLE public.ukpm_gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read" ON public.ukpm_gallery FOR SELECT USING (true);
CREATE POLICY "auth_write" ON public.ukpm_gallery FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =========================================================================
-- 9. ukpm_contacts
-- =========================================================================
DROP POLICY IF EXISTS "public_read" ON public.ukpm_contacts;
DROP POLICY IF EXISTS "auth_write" ON public.ukpm_contacts;
DROP POLICY IF EXISTS "Allow public read access" ON public.ukpm_contacts;
DROP POLICY IF EXISTS "Allow authenticated write" ON public.ukpm_contacts;

ALTER TABLE public.ukpm_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read" ON public.ukpm_contacts FOR SELECT USING (true);
CREATE POLICY "auth_write" ON public.ukpm_contacts FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =========================================================================
-- 10. ukpm_requirements
-- =========================================================================
DROP POLICY IF EXISTS "public_read" ON public.ukpm_requirements;
DROP POLICY IF EXISTS "auth_write" ON public.ukpm_requirements;
DROP POLICY IF EXISTS "Allow public read access" ON public.ukpm_requirements;
DROP POLICY IF EXISTS "Allow authenticated write" ON public.ukpm_requirements;

ALTER TABLE public.ukpm_requirements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read" ON public.ukpm_requirements FOR SELECT USING (true);
CREATE POLICY "auth_write" ON public.ukpm_requirements FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =========================================================================
-- 11. achievements
-- =========================================================================
DROP POLICY IF EXISTS "public_read" ON public.achievements;
DROP POLICY IF EXISTS "auth_write" ON public.achievements;
DROP POLICY IF EXISTS "Allow public read access" ON public.achievements;
DROP POLICY IF EXISTS "Allow authenticated write" ON public.achievements;

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read" ON public.achievements FOR SELECT USING (true);
CREATE POLICY "auth_write" ON public.achievements FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =========================================================================
-- 12. alumni_records
-- =========================================================================
DROP POLICY IF EXISTS "public_read" ON public.alumni_records;
DROP POLICY IF EXISTS "auth_write" ON public.alumni_records;
DROP POLICY IF EXISTS "Allow public read access" ON public.alumni_records;
DROP POLICY IF EXISTS "Allow authenticated write" ON public.alumni_records;

ALTER TABLE public.alumni_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read" ON public.alumni_records FOR SELECT USING (true);
CREATE POLICY "auth_write" ON public.alumni_records FOR ALL TO authenticated USING (true) WITH CHECK (true);
