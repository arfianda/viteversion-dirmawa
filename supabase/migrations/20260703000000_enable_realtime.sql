-- Enable Realtime for specific tables
-- In Postgres, we can alter publication by setting the tables list directly, which overwrites the previous list and avoids duplicate/missing table errors.
ALTER PUBLICATION supabase_realtime SET TABLE 
  public.registration_requests,
  public.users,
  public.scholarship_applications,
  public.ormawa_applications,
  public.ormawa_proposals,
  public.ormawa_lpjs,
  public.member_reports;

