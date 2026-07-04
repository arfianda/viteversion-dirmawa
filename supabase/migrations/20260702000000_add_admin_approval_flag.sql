-- Migration: 008_add_admin_approval_flag
-- Created: 2026-07-02
-- Description: Add is_approved column to public.users and approve all existing users by default

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_approved BOOLEAN NOT NULL DEFAULT FALSE;

-- Set existing accounts to approved so the current admin/students are not blocked
UPDATE public.users SET is_approved = TRUE;
