-- Enable Realtime for specific tables
BEGIN;
  -- Remove tables if they are already in the publication (avoids duplicate errors)
  ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS public.registration_requests;
  ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS public.users;
  ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS public.scholarship_applications;
  ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS public.ormawa_applications;
  ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS public.ormawa_proposals;
  ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS public.ormawa_lpjs;
  ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS public.member_reports;

  -- Add tables to the publication
  ALTER PUBLICATION supabase_realtime ADD TABLE public.registration_requests;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.scholarship_applications;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.ormawa_applications;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.ormawa_proposals;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.ormawa_lpjs;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.member_reports;
COMMIT;
