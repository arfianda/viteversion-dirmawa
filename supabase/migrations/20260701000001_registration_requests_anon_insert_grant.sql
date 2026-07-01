-- Migration: 006_registration_requests_anon_insert_grant
-- Created: 2026-07-01
-- Description: Grant INSERT privilege on registration_requests to anon and authenticated roles to allow signup submissions.

GRANT INSERT ON public.registration_requests TO anon, authenticated;
