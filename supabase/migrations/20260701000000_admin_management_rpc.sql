-- Migration: 005_admin_management_rpc
-- Created: 2026-07-01
-- Description: Create RPC to allow superadmins to create users with roles and trigger to cascade deletion from public.users to auth.users

-- Create RPC function to create user
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
  IF auth.role() IN ('authenticated', 'anon') AND coalesce(auth.jwt() -> 'user_metadata' ->> 'role', '') != 'superadmin' THEN
    RAISE EXCEPTION 'Unauthorized: Only superadmins can create users.';
  END IF;

  -- Map friendly display roles if needed
  IF p_role = 'Super Admin' THEN
    v_mapped_role := 'superadmin';
  ELSIF p_role = 'Admin' THEN
    v_mapped_role := 'administrator';
  ELSIF p_role = 'Editor' THEN
    v_mapped_role := 'operator';
  ELSE
    v_mapped_role := p_role;
  END IF;

  -- Generate new user ID
  v_user_id := gen_random_uuid();

  -- Insert into auth.users with default password 'password123'
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
    crypt('password123', gen_salt('bf', 10)),
    now(),
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    json_build_object('name', p_name, 'role', v_mapped_role)::jsonb,
    now(),
    now(),
    '', '', '', '', '', '', '', ''
  );

  -- Insert into public.users
  INSERT INTO public.users (id, email, name, role)
  VALUES (v_user_id, p_email, p_name, v_mapped_role);

  -- Return user info
  SELECT json_build_object(
    'id', v_user_id,
    'name', p_name,
    'email', p_email,
    'role', p_role
  ) INTO v_res;

  RETURN v_res;
END;
$$ LANGUAGE plpgsql;

-- Create function to cascade deletion from public.users to auth.users
CREATE OR REPLACE FUNCTION public.delete_auth_user_on_public_delete()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM auth.users WHERE id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE OR REPLACE TRIGGER tr_delete_auth_user
  AFTER DELETE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.delete_auth_user_on_public_delete();

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.create_user_with_role(text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_user_with_role(text, text, text) TO anon;
