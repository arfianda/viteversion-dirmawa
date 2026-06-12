-- Migration: 001_initial_schema
-- Created: 2026-06-12
-- Description: Initial database schema for Dirmawa portal

-- ==========================================
-- 1. student_news - News and announcements
-- ==========================================
CREATE TABLE IF NOT EXISTS student_news (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT,
  description TEXT,
  image_url TEXT,
  news_date DATE,
  category TEXT CHECK (category IN ('Berita', 'Agenda', 'Pengumuman')),
  status TEXT DEFAULT 'Published',
  visibility TEXT DEFAULT 'Public',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 2. scholarships - Scholarship listings
-- ==========================================
CREATE TABLE IF NOT EXISTS scholarships (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT CHECK (type IN ('internal', 'pemerintah', 'swasta')),
  provider TEXT NOT NULL,
  description TEXT,
  funding_amount TEXT,
  registration_deadline DATE,
  banner_image_url TEXT,
  status TEXT DEFAULT 'Open',
  applicants INTEGER DEFAULT 0,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS scholarship_requirements (
  id SERIAL PRIMARY KEY,
  scholarship_id TEXT REFERENCES scholarships(id) ON DELETE CASCADE,
  requirement TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS scholarship_benefits (
  id SERIAL PRIMARY KEY,
  scholarship_id TEXT REFERENCES scholarships(id) ON DELETE CASCADE,
  benefit TEXT NOT NULL
);

-- ==========================================
-- 3. ukms - Student Activity Units (UKM)
-- ==========================================
CREATE TABLE IF NOT EXISTS ukms (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT CHECK (category IN ('Seni & Budaya', 'Olahraga', 'Akademik', 'Sosial', 'Kerohanian', 'Minat Khusus')),
  type TEXT DEFAULT 'Academic & Tech',
  status TEXT DEFAULT 'Active',
  description TEXT,
  short_description TEXT,
  vision TEXT,
  cover_image_url TEXT,
  logo_image_url TEXT,
  active_members INTEGER DEFAULT 0,
  leader_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ukpm_missions (
  id SERIAL PRIMARY KEY,
  ukpm_id TEXT REFERENCES ukms(id) ON DELETE CASCADE,
  mission TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ukpm_requirements (
  id SERIAL PRIMARY KEY,
  ukpm_id TEXT REFERENCES ukms(id) ON DELETE CASCADE,
  requirement TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ukpm_schedules (
  id SERIAL PRIMARY KEY,
  ukpm_id TEXT REFERENCES ukms(id) ON DELETE CASCADE,
  day TEXT NOT NULL,
  time TEXT NOT NULL,
  activity TEXT
);

CREATE TABLE IF NOT EXISTS ukpm_gallery (
  id SERIAL PRIMARY KEY,
  ukpm_id TEXT REFERENCES ukms(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ukpm_contacts (
  id SERIAL PRIMARY KEY,
  ukpm_id TEXT REFERENCES ukms(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  name TEXT NOT NULL,
  contact TEXT
);

-- ==========================================
-- 4. achievements - Student achievements
-- ==========================================
CREATE TABLE IF NOT EXISTS achievements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  student_name TEXT NOT NULL,
  major TEXT NOT NULL,
  level TEXT CHECK (level IN ('Regional', 'Nasional', 'Internasional')),
  rank TEXT,
  category TEXT CHECK (category IN ('Akademik', 'Non-Akademik', 'Seni', 'Olahraga')),
  year INTEGER NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 5. alumni_records - Alumni data
-- ==========================================
CREATE TABLE IF NOT EXISTS alumni_records (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  nim TEXT,
  major TEXT NOT NULL,
  graduation_year INTEGER NOT NULL,
  status TEXT CHECK (status IN ('Bekerja', 'Melanjutkan Studi', 'Wirausaha', 'Belum Bekerja')),
  company TEXT,
  position TEXT,
  email TEXT,
  nim_status TEXT DEFAULT 'Valid',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- Indexes for performance
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_student_news_date ON student_news(news_date DESC);
CREATE INDEX IF NOT EXISTS idx_scholarships_status ON scholarships(status);
CREATE INDEX IF NOT EXISTS idx_scholarships_deadline ON scholarships(registration_deadline);
CREATE INDEX IF NOT EXISTS idx_ukms_category ON ukms(category);
CREATE INDEX IF NOT EXISTS idx_achievements_year ON achievements(year DESC);
CREATE INDEX IF NOT EXISTS idx_alumni_graduation_year ON alumni_records(graduation_year DESC);

-- ==========================================
-- Enable Row Level Security (RLS)
-- ==========================================
ALTER TABLE student_news ENABLE ROW LEVEL SECURITY;
ALTER TABLE scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE scholarship_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE scholarship_benefits ENABLE ROW LEVEL SECURITY;
ALTER TABLE ukms ENABLE ROW LEVEL SECURITY;
ALTER TABLE ukpm_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ukpm_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE ukpm_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE ukpm_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE ukpm_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE alumni_records ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- RLS Policies - Allow public read, authenticated write
-- ==========================================

-- student_news policies
CREATE POLICY "Allow public read access" ON student_news
  FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write" ON student_news
  FOR ALL TO authenticated USING (true);

-- scholarships policies
CREATE POLICY "Allow public read access" ON scholarships
  FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write" ON scholarships
  FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow public read access" ON scholarship_requirements
  FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write" ON scholarship_requirements
  FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow public read access" ON scholarship_benefits
  FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write" ON scholarship_benefits
  FOR ALL TO authenticated USING (true);

-- ukms policies
CREATE POLICY "Allow public read access" ON ukms
  FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write" ON ukms
  FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow public read access" ON ukpm_missions
  FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write" ON ukpm_missions
  FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow public read access" ON ukpm_requirements
  FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write" ON ukpm_requirements
  FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow public read access" ON ukpm_schedules
  FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write" ON ukpm_schedules
  FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow public read access" ON ukpm_gallery
  FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write" ON ukpm_gallery
  FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow public read access" ON ukpm_contacts
  FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write" ON ukpm_contacts
  FOR ALL TO authenticated USING (true);

-- achievements policies
CREATE POLICY "Allow public read access" ON achievements
  FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write" ON achievements
  FOR ALL TO authenticated USING (true);

-- alumni_records policies
CREATE POLICY "Allow public read access" ON alumni_records
  FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write" ON alumni_records
  FOR ALL TO authenticated USING (true);