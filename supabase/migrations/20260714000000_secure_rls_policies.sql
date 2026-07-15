-- Migration: Secure RLS policies and RPC role checks
-- Description: Replace auth.jwt() -> 'user_metadata' checks with database role lookups using secure SECURITY DEFINER helper functions.

-- 1. Helper function to query roles safely (SECURITY DEFINER runs as owner, avoiding recursive RLS)
CREATE OR REPLACE FUNCTION public.get_user_role(p_user_id uuid)
RETURNS text SECURITY DEFINER AS $$
BEGIN
  RETURN (SELECT role FROM public.users WHERE id = p_user_id);
END;
$$ LANGUAGE plpgsql;

-- 2. Helper function to check if superadmin
CREATE OR REPLACE FUNCTION public.is_superadmin(p_user_id uuid)
RETURNS boolean SECURITY DEFINER AS $$
BEGIN
  RETURN COALESCE((SELECT role = 'superadmin' FROM public.users WHERE id = p_user_id), false);
END;
$$ LANGUAGE plpgsql;

-- 3. Helper function to check if admin/staf
CREATE OR REPLACE FUNCTION public.is_admin(p_user_id uuid)
RETURNS boolean SECURITY DEFINER AS $$
BEGIN
  RETURN COALESCE(
    (SELECT role IN ('admin', 'superadmin', 'administrator', 'staf_beasiswa', 'staf_ormawa', 'staf_alumni', 'staf_depan', 'direktur') 
     FROM public.users WHERE id = p_user_id), 
    false
  );
END;
$$ LANGUAGE plpgsql;

-- 4. Recreate public.users policies securely
DROP POLICY IF EXISTS "Superadmin can read all users" ON public.users;
DROP POLICY IF EXISTS "Superadmin manages all users" ON public.users;

CREATE POLICY "Superadmin can read all users" ON public.users
  FOR SELECT USING (public.is_superadmin(auth.uid()));

CREATE POLICY "Superadmin manages all users" ON public.users
  FOR ALL USING (public.is_superadmin(auth.uid()));

-- 5. Recreate public.registration_requests policies securely
DROP POLICY IF EXISTS "Admin can view all requests" ON public.registration_requests;
DROP POLICY IF EXISTS "Admin can update requests" ON public.registration_requests;

CREATE POLICY "Admin can view all requests" ON public.registration_requests
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admin can update requests" ON public.registration_requests
  FOR ALL USING (public.is_admin(auth.uid()));

-- 6. Recreate public.login_logs policy securely
DROP POLICY IF EXISTS "Allow select for superadmin" ON public.login_logs;

CREATE POLICY "Allow select for superadmin" ON public.login_logs
  FOR SELECT USING (public.is_superadmin(auth.uid()));

-- 7. Update create_user_with_role RPC to use secure check
CREATE OR REPLACE FUNCTION public.create_user_with_role(
  p_email text,
  p_name text,
  p_role text
) RETURNS jsonb SECURITY DEFINER AS $$
DECLARE
  v_user_id uuid;
  v_res jsonb;
  v_mapped_role text;
BEGIN
  -- Verify the current user is a superadmin when called via PostgREST/API
  IF auth.role() IN ('authenticated', 'anon') AND NOT public.is_superadmin(auth.uid()) THEN
    RAISE EXCEPTION 'Unauthorized: Only superadmins can create users.';
  END IF;

  -- Map friendly display roles if needed
  IF p_role = 'Super Admin' THEN
    v_mapped_role := 'superadmin';
  ELSIF p_role = 'Admin' THEN
    v_mapped_role := 'administrator';
  ELSE
    v_mapped_role := lower(replace(p_role, ' ', '_'));
  END IF;

  -- Generate user ID
  v_user_id := gen_random_uuid();

  -- Insert into auth.users (simulating admin user creation)
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, 
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, 
    created_at, updated_at, confirmation_token, 
    email_change_token_new, email_change_token_current, 
    recovery_token, phone_change_token, email_change, 
    phone_change, reauthentication_token
  )
  VALUES (
    '00000000-0000-0000-0000-000000000000'::uuid,
    v_user_id,
    'authenticated',
    'authenticated',
    p_email,
    crypt('Password123!', gen_salt('bf', 10)), -- default temp password
    now(),
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    json_build_object('name', p_name, 'role', v_mapped_role)::jsonb,
    now(),
    now(),
    '', '', '', '', '', '', '', ''
  );

  -- Insert into public.users
  INSERT INTO public.users (id, email, name, role, is_approved)
  VALUES (v_user_id, p_email, p_name, v_mapped_role, true);

  v_res := json_build_object(
    'success', true,
    'id', v_user_id,
    'message', 'User account created successfully.'
  );

  RETURN v_res;
END;
$$ LANGUAGE plpgsql;
