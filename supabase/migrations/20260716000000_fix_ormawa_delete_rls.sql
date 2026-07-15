-- Migration: Fix Ormawa Proposals and LPJs Delete RLS Policies
-- Description: Split FOR ALL permissive policies into granular SELECT, INSERT, UPDATE, and DELETE policies.

-- ==========================================
-- 1. Secure public.ormawa_proposals
-- ==========================================
DROP POLICY IF EXISTS "Authenticated users manage proposals" ON public.ormawa_proposals;

CREATE POLICY "Authenticated users can view proposals" ON public.ormawa_proposals
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert proposals" ON public.ormawa_proposals
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update proposals" ON public.ormawa_proposals
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Only superadmins can delete proposals" ON public.ormawa_proposals
  FOR DELETE TO authenticated USING (public.is_superadmin(auth.uid()));

-- ==========================================
-- 2. Secure public.ormawa_lpjs
-- ==========================================
DROP POLICY IF EXISTS "Authenticated users manage lpjs" ON public.ormawa_lpjs;

CREATE POLICY "Authenticated users can view lpjs" ON public.ormawa_lpjs
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert lpjs" ON public.ormawa_lpjs
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update lpjs" ON public.ormawa_lpjs
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Only superadmins can delete lpjs" ON public.ormawa_lpjs
  FOR DELETE TO authenticated USING (public.is_superadmin(auth.uid()));
