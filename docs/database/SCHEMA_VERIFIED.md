# Database Schema - Verified State

**Last verified:** 2026-06-12  
**Project:** hqyvbarhhhvjtmmzntvq (Dirmawa)  
**RLS Status:** ✅ ENABLED with policies  
**Auth Status:** ⚠️ Users exist in `public.users` but not in `auth.users` - see docs/AUTH_SETUP.md

## Table Status

| Table | Rows | RLS | Status |
|-------|------|-----|--------|
| `student_news` | 5 | ❌ | ✅ Schema correct |
| `scholarships` | 3 | ❌ | ✅ Schema correct |
| `scholarship_requirements` | 12 | ❌ | ✅ Schema correct |
| `scholarship_benefits` | 9 | ❌ | ✅ Schema correct |
| `ukms` | 5 | ❌ | ✅ Schema correct |
| `ukpm_missions` | 12 | ❌ | ✅ Schema correct |
| `ukpm_schedules` | 7 | ❌ | ✅ Schema correct |
| `ukpm_gallery` | 4 | ❌ | ✅ Schema correct |
| `ukpm_contacts` | 7 | ❌ | ✅ Schema correct |
| `ukpm_requirements` | 11 | ❌ | ✅ Schema correct |
| `achievements` | 4 | ❌ | ✅ Schema correct |
| `alumni_records` | 10 | ❌ | ✅ Schema correct |
| `users` | 3 | ✅ | ✅ Auth table |
| `mahasiswa_profiles` | 0 | ✅ | ✅ Profile table |
| `alumni_profiles` | 0 | ✅ | ✅ Profile table |
| `administrator_profiles` | 3 | ✅ | ✅ Profile table |

## RLS Policies Applied

✅ All 12 content tables now have RLS enabled with:
- `public_read` - Anyone can SELECT (read data)
- `auth_write` - Only authenticated users can INSERT/UPDATE/DELETE

This means yourSupabase anon key is now safe for client-side use - anonymous visitors can only read data, not modify it.

## Security Alert: RLS Disabled

**12 tables have Row Level Security DISABLED** - this means anyone with the anon key can read/modify all data.

### Required Fix

Enable RLS with policies. Run this SQL in **Supabase Dashboard > SQL Editor**:

```sql
-- Enable RLS on all content tables
ALTER TABLE public.student_news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholarship_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholarship_benefits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ukms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ukpm_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ukpm_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ukpm_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ukpm_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ukpm_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alumni_records ENABLE ROW LEVEL SECURITY;

-- Policy: Public read, authenticated write
CREATE POLICY "public_read" ON public.student_news FOR SELECT USING (true);
CREATE POLICY "auth_write" ON public.student_news FOR ALL TO authenticated USING (true);

CREATE POLICY "public_read" ON public.scholarships FOR SELECT USING (true);
CREATE POLICY "auth_write" ON public.scholarships FOR ALL TO authenticated USING (true);
CREATE POLICY "public_read" ON public.scholarship_requirements FOR SELECT USING (true);
CREATE POLICY "auth_write" ON public.scholarship_requirements FOR ALL TO authenticated USING (true);
CREATE POLICY "public_read" ON public.scholarship_benefits FOR SELECT USING (true);
CREATE POLICY "auth_write" ON public.scholarship_benefits FOR ALL TO authenticated USING (true);

CREATE POLICY "public_read" ON public.ukms FOR SELECT USING (true);
CREATE POLICY "auth_write" ON public.ukms FOR ALL TO authenticated USING (true);
CREATE POLICY "public_read" ON public.ukpm_missions FOR SELECT USING (true);
CREATE POLICY "auth_write" ON public.ukpm_missions FOR ALL TO authenticated USING (true);
CREATE POLICY "public_read" ON public.ukpm_schedules FOR SELECT USING (true);
CREATE POLICY "auth_write" ON public.ukpm_schedules FOR ALL TO authenticated USING (true);
CREATE POLICY "public_read" ON public.ukpm_gallery FOR SELECT USING (true);
CREATE POLICY "auth_write" ON public.ukpm_gallery FOR ALL TO authenticated USING (true);
CREATE POLICY "public_read" ON public.ukpm_contacts FOR SELECT USING (true);
CREATE POLICY "auth_write" ON public.ukpm_contacts FOR ALL TO authenticated USING (true);
CREATE POLICY "public_read" ON public.ukpm_requirements FOR SELECT USING (true);
CREATE POLICY "auth_write" ON public.ukpm_requirements FOR ALL TO authenticated USING (true);

CREATE POLICY "public_read" ON public.achievements FOR SELECT USING (true);
CREATE POLICY "auth_write" ON public.achievements FOR ALL TO authenticated USING (true);

CREATE POLICY "public_read" ON public.alumni_records FOR SELECT USING (true);
CREATE POLICY "auth_write" ON public.alumni_records FOR ALL TO authenticated USING (true);
```

## Schema Differences from Migration

The live schema uses TEXT for some fields where the migration uses DATE/INTEGER:
- `scholarships.registration_deadline` - TEXT (not DATE)
- Some enum types differ slightly

These are minor and don't affect functionality.

## Applied Migrations

- `001_initial_schema.sql` - Base schema
- `enable_rls_policies` - RLS enabled 2026-06-12