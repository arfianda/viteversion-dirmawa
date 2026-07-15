-- Migration: Fix Tier 1 RLS Policies (Excluding alumni_records)
-- Description: Apply secure granular SELECT, INSERT, UPDATE, and DELETE RLS policies for Tier 1 tables.

-- ==========================================
-- 1. Secure public.system_settings
-- ==========================================
DROP POLICY IF EXISTS "Allow authenticated write" ON public.system_settings;
DROP POLICY IF EXISTS "Allow public read access" ON public.system_settings;
DROP POLICY IF EXISTS "Allow public read of settings" ON public.system_settings;
DROP POLICY IF EXISTS "Only superadmins can write settings" ON public.system_settings;

CREATE POLICY "Allow public read of settings" ON public.system_settings
  FOR SELECT USING (true);

CREATE POLICY "Only superadmins can write settings" ON public.system_settings
  FOR ALL TO authenticated USING (public.is_superadmin(auth.uid())) WITH CHECK (public.is_superadmin(auth.uid()));

-- ==========================================
-- 2. Secure public.ormawa_admin_profiles
-- ==========================================
DROP POLICY IF EXISTS "Admins manage profiles" ON public.ormawa_admin_profiles;
DROP POLICY IF EXISTS "Allow public read" ON public.ormawa_admin_profiles;
DROP POLICY IF EXISTS "Users can view own or all admin profiles" ON public.ormawa_admin_profiles;
DROP POLICY IF EXISTS "Only superadmins can manage admin profiles" ON public.ormawa_admin_profiles;

CREATE POLICY "Users can view own or all admin profiles" ON public.ormawa_admin_profiles
  FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Only superadmins can manage admin profiles" ON public.ormawa_admin_profiles
  FOR ALL TO authenticated USING (public.is_superadmin(auth.uid())) WITH CHECK (public.is_superadmin(auth.uid()));

-- ==========================================
-- 3. Secure public.member_reports
-- ==========================================
DROP POLICY IF EXISTS "Allow authenticated insert/update/delete" ON public.member_reports;
DROP POLICY IF EXISTS "Allow public read access" ON public.member_reports;
DROP POLICY IF EXISTS "Users can view own or all member reports" ON public.member_reports;
DROP POLICY IF EXISTS "Ormawa admin can insert own member reports" ON public.member_reports;
DROP POLICY IF EXISTS "Admins can update member reports" ON public.member_reports;
DROP POLICY IF EXISTS "Only superadmins can delete member reports" ON public.member_reports;

CREATE POLICY "Users can view own or all member reports" ON public.member_reports
  FOR SELECT TO authenticated USING (
    public.is_admin(auth.uid()) OR 
    EXISTS (
      SELECT 1 FROM public.ormawa_admin_profiles 
      WHERE user_id = auth.uid() AND ukm_id = member_reports.ukm_id
    )
  );

CREATE POLICY "Ormawa admin can insert own member reports" ON public.member_reports
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.ormawa_admin_profiles 
      WHERE user_id = auth.uid() AND ukm_id = member_reports.ukm_id
    )
  );

CREATE POLICY "Admins can update member reports" ON public.member_reports
  FOR UPDATE TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Only superadmins can delete member reports" ON public.member_reports
  FOR DELETE TO authenticated USING (public.is_superadmin(auth.uid()));

-- ==========================================
-- 4. Secure public.ormawa_applications
-- ==========================================
DROP POLICY IF EXISTS "Admins can view and update all applications" ON public.ormawa_applications;
DROP POLICY IF EXISTS "Users can view own or all applications" ON public.ormawa_applications;
DROP POLICY IF EXISTS "Authenticated users can submit applications" ON public.ormawa_applications;
DROP POLICY IF EXISTS "Admins can review applications" ON public.ormawa_applications;
DROP POLICY IF EXISTS "Only superadmins can delete applications" ON public.ormawa_applications;

CREATE POLICY "Users can view own or all applications" ON public.ormawa_applications
  FOR SELECT TO authenticated USING (applicant_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Authenticated users can submit applications" ON public.ormawa_applications
  FOR INSERT TO authenticated WITH CHECK (applicant_id = auth.uid());

CREATE POLICY "Admins can review applications" ON public.ormawa_applications
  FOR UPDATE TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Only superadmins can delete applications" ON public.ormawa_applications
  FOR DELETE TO authenticated USING (public.is_superadmin(auth.uid()));
