-- Migration: 008_approve_registration_rpc
-- Created: 2026-07-01
-- Description: Create database RPC function to approve a registration request, creating auth user, profile, and status update atomically.

CREATE OR REPLACE FUNCTION public.approve_registration_request(
  p_request_id uuid,
  p_admin_id uuid
) RETURNS void SECURITY DEFINER AS $$
DECLARE
  v_req record;
  v_user_id uuid;
BEGIN
  -- 1. Fetch the registration request
  SELECT * INTO v_req FROM public.registration_requests WHERE id = p_request_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Registration request not found';
  END IF;

  -- Prevent duplicate approvals
  IF v_req.status = 'approved' THEN
    RETURN;
  END IF;

  -- 2. Generate a new UUID for the user
  v_user_id := gen_random_uuid();

  -- 3. Insert into auth.users with cost factor 10 password
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
    v_req.email,
    crypt(v_req.password, gen_salt('bf', 10)),
    now(),
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    json_build_object('name', v_req.name, 'role', 'mahasiswa')::jsonb,
    now(),
    now(),
    '', '', '', '', '', '', '', ''
  );

  -- 4. Insert into public.users
  INSERT INTO public.users (id, email, name, role)
  VALUES (v_user_id, v_req.email, v_req.name, 'mahasiswa');

  -- 5. Insert into public.mahasiswa_profiles
  INSERT INTO public.mahasiswa_profiles (user_id, nim, major, faculty, semester)
  VALUES (v_user_id, v_req.nim, v_req.major, v_req.faculty, v_req.semester);

  -- 6. Update the registration request status
  UPDATE public.registration_requests
  SET status = 'approved',
      reviewed_by = p_admin_id,
      reviewed_at = now()
  WHERE id = p_request_id;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.approve_registration_request(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.approve_registration_request(uuid, uuid) TO anon;
