-- Migration: Add proposal submission code and physical receipt tracking
-- Description: Create proposal_seq sequence, add submission_code and physical_received columns to ormawa_proposals.

CREATE SEQUENCE IF NOT EXISTS public.proposal_seq START WITH 1000;

ALTER TABLE public.ormawa_proposals 
ADD COLUMN IF NOT EXISTS submission_code TEXT UNIQUE DEFAULT ('PRP-' || nextval('public.proposal_seq')::text);

ALTER TABLE public.ormawa_proposals 
ADD COLUMN IF NOT EXISTS physical_received BOOLEAN DEFAULT false;
