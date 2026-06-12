# Database Schema Documentation

## Overview

This directory contains database schemas and migrations for the Dirmawa portal using Supabase (PostgreSQL).

## Tables

### 1. `student_news`
News and announcements for students.

| Column | Type | Description |
|--------|------|-------------|
| id | TEXT | Primary key (UUID) |
| title | TEXT | News title |
| summary | TEXT | Short summary |
| description | TEXT | Full content |
| image_url | TEXT | Cover image URL |
| news_date | DATE | Publication date |
| category | TEXT | Berita, Agenda, or Pengumuman |
| status | TEXT | Published/Draft |
| visibility | TEXT | Public/Private |
| tags | TEXT[] | Array of tags |

### 2. `scholarships`
Scholarship opportunities.

| Column | Type | Description |
|--------|------|-------------|
| id | TEXT | Primary key (UUID) |
| title | TEXT | Scholarship name |
| type | TEXT | internal, pemerintah, swasta |
| provider | TEXT | Organization name |
| description | TEXT | Full description |
| funding_amount | TEXT | Funding details |
| registration_deadline | DATE | Application deadline |
| banner_image_url | TEXT | Banner image |
| status | TEXT | Open/Closed |
| applicants | INTEGER | Applicant count |

#### Related Tables:
- `scholarship_requirements` - Requirements (FK: scholarship_id)
- `scholarship_benefits` - Benefits (FK: scholarship_id)

### 3. `ukms` (Unit Kegiatan Mahasiswa)
Student activity units.

| Column | Type | Description |
|--------|------|-------------|
| id | TEXT | Primary key (UUID) |
| name | TEXT | UKM name |
| category | TEXT | Seni & Budaya, Olahraga, Akademik, Sosial, Kerohanian, Minat Khusus |
| type | TEXT | Additional type classification |
| status | TEXT | Active/Inactive |
| description | TEXT | Full description |
| short_description | TEXT | Brief summary |
| vision | TEXT | Vision statement |
| cover_image_url | TEXT | Cover image |
| logo_image_url | TEXT | Logo image |
| active_members | INTEGER | Member count |
| leader_name | TEXT | Leader name |

#### Related Tables:
- `ukpm_missions` - Mission statements (FK: ukpm_id)
- `ukpm_requirements` - Membership requirements (FK: ukpm_id)
- `ukpm_schedules` - Activity schedules (FK: ukpm_id)
- `ukpm_gallery` - Photo gallery (FK: ukpm_id)
- `ukpm_contacts` - Contact persons (FK: ukpm_id)

### 4. `achievements`
Student achievements and awards.

| Column | Type | Description |
|--------|------|-------------|
| id | TEXT | Primary key (UUID) |
| title | TEXT | Achievement title |
| student_name | TEXT | Student name |
| major | TEXT | Study program |
| level | TEXT | Regional, Nasional, Internasional |
| rank | TEXT | Ranking (1st, 2nd, etc.) |
| category | TEXT | Akademik, Non-Akademik, Seni, Olahraga |
| year | INTEGER | Year achieved |
| description | TEXT | Description |
| image_url | TEXT | Image URL |

### 5. `alumni_records`
Alumni tracer study data.

| Column | Type | Description |
|--------|------|-------------|
| id | TEXT | Primary key (UUID) |
| name | TEXT | Alumni name |
| nim | TEXT | Student ID |
| major | TEXT | Study program |
| graduation_year | INTEGER | Year of graduation |
| status | TEXT | Bekerja, Melanjutkan Studi, Wirausaha, Belum Bekerja |
| company | TEXT | Current company |
| position | TEXT | Current position |
| email | TEXT | Email address |
| nim_status | TEXT | Validation status |

## Row Level Security (RLS)

All tables have RLS enabled with:
- **Public read access** - Anyone can view data
- **Authenticated write access** - Only logged-in users can modify

## Migrations

| File | Description |
|------|-------------|
| `001_initial_schema.sql` | Initial schema with all tables, indexes, and RLS policies |

## Usage

### Apply migration to Supabase:
```bash
# Using Supabase CLI
supabase db push -f docs/database/001_initial_schema.sql

# Or run directly in Supabase Dashboard SQL Editor
```

### Check existing tables:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```