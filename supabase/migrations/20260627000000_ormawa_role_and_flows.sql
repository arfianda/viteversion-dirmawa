-- Migration: 005_ormawa_role_and_flows
-- Created: 2026-06-27
-- Description: Add admin_ormawa role, ormawa applications, profiles, proposals, and LPJs.

-- 1. Add 'admin_ormawa' to user_role enum
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'admin_ormawa';

-- 2. Create public.ormawa_admin_profiles
CREATE TABLE IF NOT EXISTS public.ormawa_admin_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  ukm_id UUID NOT NULL REFERENCES public.ukms(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create public.ormawa_applications
CREATE TABLE IF NOT EXISTS public.ormawa_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Seni & Budaya', 'Olahraga', 'Akademik', 'Sosial', 'Kerohanian', 'Minat Khusus')),
  description TEXT NOT NULL,
  vision TEXT NOT NULL,
  mission TEXT[] NOT NULL DEFAULT '{}',
  leader_name TEXT NOT NULL,
  leader_nim TEXT NOT NULL,
  proposal_format_url TEXT,
  ukm_request_url TEXT,
  quality_procedure_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  reviewed_by UUID REFERENCES public.users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create public.ormawa_proposals
CREATE TABLE IF NOT EXISTS public.ormawa_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ukm_id UUID NOT NULL REFERENCES public.ukms(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  target_budget NUMERIC NOT NULL,
  activity_date DATE NOT NULL,
  proposal_doc_url TEXT NOT NULL,
  cover_letter_url TEXT,
  facility_rent_url TEXT,
  expedition_form_url TEXT,
  signed_proposal_url TEXT,
  status TEXT NOT NULL DEFAULT 'submitted_dirmawa' 
    CHECK (status IN ('draft', 'submitted_dirmawa', 'approved_dirmawa_staff', 'approved_dirmawa_direktur', 'approved_dau', 'approved_rektorat', 'scan_uploaded', 'completed', 'rejected')),
  rejection_reason TEXT,
  flow_type TEXT NOT NULL CHECK (flow_type IN ('ukm', 'hima')),
  current_step_holder TEXT NOT NULL 
    CHECK (current_step_holder IN ('ormawa', 'dirmawa_staff', 'dirmawa_direktur', 'prodi', 'dekanat', 'dau', 'rektorat', 'kasir_keuangan')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create public.ormawa_lpjs
CREATE TABLE IF NOT EXISTS public.ormawa_lpjs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ukm_id UUID NOT NULL REFERENCES public.ukms(id) ON DELETE CASCADE,
  proposal_id UUID REFERENCES public.ormawa_proposals(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  total_spent NUMERIC NOT NULL,
  lpj_doc_url TEXT NOT NULL,
  receipts_zip_url TEXT,
  signed_lpj_url TEXT,
  status TEXT NOT NULL DEFAULT 'submitted_dirmawa' 
    CHECK (status IN ('draft', 'submitted_dirmawa', 'approved_dirmawa_staff', 'approved_dirmawa_direktur', 'approved_prodi', 'approved_dekanat', 'approved_rektorat', 'scan_uploaded', 'completed', 'rejected')),
  rejection_reason TEXT,
  flow_type TEXT NOT NULL CHECK (flow_type IN ('ukm', 'hima')),
  current_step_holder TEXT NOT NULL 
    CHECK (current_step_holder IN ('ormawa', 'dirmawa_staff', 'dirmawa_direktur', 'prodi', 'dekanat', 'rektorat')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.ormawa_admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ormawa_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ormawa_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ormawa_lpjs ENABLE ROW LEVEL SECURITY;

-- Policies for ormawa_admin_profiles
DROP POLICY IF EXISTS "Allow public read" ON public.ormawa_admin_profiles;
CREATE POLICY "Allow public read" ON public.ormawa_admin_profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins manage profiles" ON public.ormawa_admin_profiles;
CREATE POLICY "Admins manage profiles" ON public.ormawa_admin_profiles FOR ALL TO authenticated USING (true);

-- Policies for ormawa_applications
DROP POLICY IF EXISTS "Students can view own applications" ON public.ormawa_applications;
CREATE POLICY "Students can view own applications" ON public.ormawa_applications FOR SELECT USING (auth.uid() = applicant_id);
DROP POLICY IF EXISTS "Students can submit applications" ON public.ormawa_applications;
CREATE POLICY "Students can submit applications" ON public.ormawa_applications FOR INSERT WITH CHECK (auth.uid() = applicant_id);
DROP POLICY IF EXISTS "Admins can view and update all applications" ON public.ormawa_applications;
CREATE POLICY "Admins can view and update all applications" ON public.ormawa_applications FOR ALL TO authenticated USING (true);

-- Policies for proposals and LPJs
DROP POLICY IF EXISTS "Allow public read of proposals" ON public.ormawa_proposals;
CREATE POLICY "Allow public read of proposals" ON public.ormawa_proposals FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated users manage proposals" ON public.ormawa_proposals;
CREATE POLICY "Authenticated users manage proposals" ON public.ormawa_proposals FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow public read of lpjs" ON public.ormawa_lpjs;
CREATE POLICY "Allow public read of lpjs" ON public.ormawa_lpjs FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated users manage lpjs" ON public.ormawa_lpjs;
CREATE POLICY "Authenticated users manage lpjs" ON public.ormawa_lpjs FOR ALL TO authenticated USING (true);
