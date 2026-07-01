-- Migration: 007_get_registration_status_rpc
-- Created: 2026-07-01
-- Description: Create a secure RPC function to check registration request status by NIM or Email, bypassing RLS safely.

CREATE OR REPLACE FUNCTION public.get_registration_status(p_query text)
RETURNS TABLE (status text, rejection_reason text) AS $$
BEGIN
  RETURN QUERY
  SELECT r.status, r.rejection_reason
  FROM public.registration_requests r
  WHERE r.nim = p_query OR r.email = p_query
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to client roles
GRANT EXECUTE ON FUNCTION public.get_registration_status(text) TO anon, authenticated;
