# Authentication Setup Guide

## Current Status

The application has Supabase authentication integration ready, but requires proper setup in your Supabase project.

## Required Supabase Configuration

### 1. Enable Email/Password Auth

In Supabase Dashboard:
1. Go to **Authentication** > **Providers**
2. Enable **Email** provider
3. Disable "Confirm email" for development (or enable for production)

### 2. Create Test Users

You have 3 admin users in `public.users`, but they need auth credentials:

```sql
-- Run this in Supabase SQL Editor to create auth users
-- Note: Replace 'password123' with secure passwords in production

-- For abcd@upb.ac.id
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'abcd@upb.ac.id',
  crypt('password123', gen_salt('bf')),
  now(),
  NULL,
  now(),
  '{"provider": "email", "providers": ["email"]}'::jsonb,
  '{"name": "Dr. ABCD", "role": "administrator"}'::jsonb,
  now(),
  now()
);

-- For efgh@upb.ac.id
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'efgh@upb.ac.id',
  crypt('password123', gen_salt('bf')),
  now(),
  NULL,
  now(),
  '{"provider": "email", "providers": ["email"]}'::jsonb,
  '{"name": "EFGH, M.Kom", "role": "administrator"}'::jsonb,
  now(),
  now()
);

-- For asdf@upb.ac.id
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'asdf@upb.ac.id',
  crypt('password123', gen_salt('bf')),
  now(),
  NULL,
  now(),
  '{"provider": "email", "providers": ["email"]}'::jsonb,
  '{"name": "ASDF", "role": "administrator"}'::jsonb,
  now(),
  now()
);
```

### 3. Alternative: Create Users via Supabase Dashboard

Easier method - use the Supabase UI:

1. Go to **Authentication** > **Users**
2. Click **Add User**
3. Create users:
   - `abcd@upb.ac.id` / `password123` (Name: Dr. ABCD, Role: administrator)
   - `efgh@upb.ac.id` / `password123` (Name: EFGH, M.Kom, Role: administrator)
   - `asdf@upb.ac.id` / `password123` (Name: ASDF, Role: administrator)

### 4. Create Student User (for Mahasiswa Login)

```sql
-- First create auth user
-- Then create mahasiswa profile

-- Step 1: Create via Dashboard (easier) or use SQL:
-- After creating auth user, link to mahasiswa_profiles:

INSERT INTO mahasiswa_profiles (user_id, nim, major, faculty, semester, enrollment_year, status)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'budi@upb.ac.id'),
  '202100123',
  'Teknik Informatatika',
  'Fakultas Teknik',
  7,
  2021,
  'Aktif'
);
```

### 5. Setup RLS Policies for Auth

```sql
-- Ensure users can only read their own profile
ALTER TABLE mahasiswa_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON mahasiswa_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
  ON mahasiswa_profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE public.users.id = auth.uid()
      AND public.users.role = 'administrator'
    )
  );
```

## Demo Credentials

After setup, use these credentials:

### Admin Portal (`/#/admin` or `?portal=admin`)
| Email | Password | Name |
|-------|----------|------|
| abcd@upb.ac.id | password123 | Dr. ABCD |
| efgh@upb.ac.id | password123 | EFGH, M.Kom |
| asdf@upb.ac.id | password123 | ASDF |

### Mahasiswa Portal (`/#/mahasiswa` or `?portal=mahasiswa`)
| NIM | Password | Name |
|-----|----------|------|
| 202100123 | student123 | Budi Santoso |

## Troubleshooting

### "Invalid login credentials"
- Ensure user exists in **Authentication** > **Users** (not just `public.users`)
- Check password is correct
- Verify email is confirmed (or disable confirmation requirement)

### "Row Level Security" errors
- Run the RLS policies above
- Ensure `public.users` table has RLS enabled with proper policies

### Login works but data doesn't load
- Check that `public.users` table has a row linked to the auth user
- Verify RLS policies allow the authenticated role to read data

## Testing

1. Start dev server: `npm run dev`
2. Go to `http://localhost:3001`
3. Test Admin Login:
   - Navigate to `http://localhost:3001/?portal=admin` or use hash `#/admin`
   - Login with admin credentials
4. Test Mahasiswa Login:
   - Navigate to `http://localhost:3001/?portal=mahasiswa` or use hash `#/mahasiswa`
   - Login with student credentials