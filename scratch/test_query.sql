BEGIN;
SET ROLE authenticated;
-- Set JWT claims (auth.uid() returns the 'sub' field)
SELECT set_config('request.jwt.claims', '{"sub": "00000000-0000-0000-0000-000000000001"}', true);
SELECT auth.uid(), public.is_superadmin(auth.uid());
INSERT INTO public.system_settings (key, value) VALUES ('under_construction', 'true') ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
COMMIT;
