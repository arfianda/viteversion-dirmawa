-- Migration: 009_get_student_login_info_rpc
-- Created: 2026-07-01
-- Description: Create secure RPC to fetch student login details by NIM, bypassing RLS safely.

CREATE OR REPLACE FUNCTION public.get_student_login_info(p_nim text)
RETURNS TABLE (
  email text,
  role text,
  name text,
  avatar_url text,
  major text,
  semester integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT u.email, u.role, u.name, u.avatar_url, m.major, m.semester
  FROM public.mahasiswa_profiles m
  JOIN public.users u ON m.user_id = u.id
  WHERE m.nim = p_nim
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute privileges to client roles
GRANT EXECUTE ON FUNCTION public.get_student_login_info(text) TO anon, authenticated;
