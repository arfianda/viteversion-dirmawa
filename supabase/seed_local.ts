import { Client } from 'pg';
import { SCHOLARSHIPS, UKMS, ACHIEVEMENTS, NEWS, INITIAL_ALUMNI } from '../src/data';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@127.0.0.1:64322/postgres';

// Helper to parse Indonesian date strings (e.g. "18 Mei 2024") into YYYY-MM-DD
function parseIndoDate(dateStr: string): string {
  if (!dateStr) return new Date().toISOString().split('T')[0];
  
  // If it's already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;

  const parts = dateStr.trim().split(/\s+/);
  if (parts.length !== 3) {
    // Fallback if formatting is unexpected
    const parsed = Date.parse(dateStr);
    if (!isNaN(parsed)) {
      return new Date(parsed).toISOString().split('T')[0];
    }
    return new Date().toISOString().split('T')[0];
  }

  const day = parts[0].padStart(2, '0');
  const monthStr = parts[1].toLowerCase();
  const year = parts[2];

  const monthMap: Record<string, string> = {
    'januari': '01', 'jan': '01',
    'februari': '02', 'feb': '02',
    'maret': '03', 'mar': '03',
    'april': '04', 'apr': '04',
    'mei': '05',
    'juni': '06', 'jun': '06',
    'juli': '07', 'jul': '07',
    'agustus': '08', 'agu': '08', 'agt': '08',
    'september': '09', 'sep': '09',
    'oktober': '10', 'okt': '10',
    'november': '11', 'nov': '11',
    'desember': '12', 'des': '12'
  };

  const month = monthMap[monthStr] || '01';
  return `${year}-${month}-${day}`;
}

async function seed() {
  console.log('🌱 Starting local database seeding via direct PG connection...');
  const client = new Client({ connectionString });

  try {
    await client.connect();
    console.log('🔌 Connected to PostgreSQL!');

    // ----------------------------------------------------
    // 1. Clear existing data in correct dependency order
    // ----------------------------------------------------
    console.log('🧹 Clearing existing table data...');
    
    // Child tables of ukms
    await client.query('TRUNCATE TABLE public.ukpm_missions, public.ukpm_requirements, public.ukpm_schedules, public.ukpm_gallery, public.ukpm_contacts CASCADE');
    
    // Child tables of scholarships
    await client.query('TRUNCATE TABLE public.scholarship_requirements, public.scholarship_benefits CASCADE');

    // Parent content tables
    await client.query('TRUNCATE TABLE public.ukms, public.scholarships, public.student_news, public.achievements, public.alumni_records CASCADE');

    console.log('✅ Tables cleared successfully!');

    // ----------------------------------------------------
    // 2. Seed student_news
    // ----------------------------------------------------
    console.log('🗞️ Seeding news articles (student_news)...');
    for (const news of NEWS) {
      await client.query(
        `INSERT INTO public.student_news (id, title, summary, description, image_url, news_date, category, status, visibility, tags)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          news.id,
          news.title,
          news.summary || '',
          news.description || '',
          news.image || '',
          parseIndoDate(news.date),
          news.category,
          'Published',
          'Public',
          []
        ]
      );
    }
    console.log(`✅ Seeded ${NEWS.length} news articles.`);

    // ----------------------------------------------------
    // 3. Seed scholarships and relations
    // ----------------------------------------------------
    console.log('🎓 Seeding scholarships...');
    for (const s of SCHOLARSHIPS) {
      await client.query(
        `INSERT INTO public.scholarships (id, title, type, provider, description, funding_amount, registration_deadline, banner_image_url, status, applicants, category)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          s.id,
          s.title,
          s.type,
          s.provider,
          s.description || '',
          s.fundingAmount || '',
          parseIndoDate(s.registrationDeadline),
          s.bannerImage || '',
          'Open',
          0,
          s.type === 'internal' ? 'Internal' : 'External'
        ]
      );

      // Seed requirements
      if (s.requirements && s.requirements.length > 0) {
        for (const req of s.requirements) {
          await client.query(
            `INSERT INTO public.scholarship_requirements (scholarship_id, requirement) VALUES ($1, $2)`,
            [s.id, req]
          );
        }
      }

      // Seed benefits
      if (s.benefits && s.benefits.length > 0) {
        for (const ben of s.benefits) {
          await client.query(
            `INSERT INTO public.scholarship_benefits (scholarship_id, benefit) VALUES ($1, $2)`,
            [s.id, ben]
          );
        }
      }
    }
    console.log(`✅ Seeded ${SCHOLARSHIPS.length} scholarships with requirements and benefits.`);

    // ----------------------------------------------------
    // 4. Seed UKMs and relations
    // ----------------------------------------------------
    console.log('🏆 Seeding Student Activity Units (ukms)...');
    for (const u of UKMS) {
      const leaderName = u.contacts?.find(c => c.role.toLowerCase().includes('ketua'))?.name || 'TBD';
      await client.query(
        `INSERT INTO public.ukms (id, name, category, type, status, description, short_description, vision, cover_image_url, logo_image_url, active_members, leader_name)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          u.id,
          u.name,
          u.category,
          'Academic & Tech',
          'Active',
          u.description || '',
          u.shortDescription || '',
          u.vision || '',
          u.coverImage || '',
          u.logoImage || '',
          u.activeMembers || 0,
          leaderName
        ]
      );

      // Seed missions
      if (u.mission && u.mission.length > 0) {
        for (const m of u.mission) {
          await client.query(
            `INSERT INTO public.ukpm_missions (ukpm_id, mission) VALUES ($1, $2)`,
            [u.id, m]
          );
        }
      }

      // Seed requirements
      if (u.requirements && u.requirements.length > 0) {
        for (const r of u.requirements) {
          await client.query(
            `INSERT INTO public.ukpm_requirements (ukpm_id, requirement) VALUES ($1, $2)`,
            [u.id, r]
          );
        }
      }

      // Seed schedules
      if (u.schedule && u.schedule.length > 0) {
        for (const s of u.schedule) {
          await client.query(
            `INSERT INTO public.ukpm_schedules (ukpm_id, day, time, activity) VALUES ($1, $2, $3, $4)`,
            [u.id, s.day, s.time, s.activity || '']
          );
        }
      }

      // Seed gallery
      if (u.gallery && u.gallery.length > 0) {
        for (const img of u.gallery) {
          await client.query(
            `INSERT INTO public.ukpm_gallery (ukpm_id, image_url) VALUES ($1, $2)`,
            [u.id, img]
          );
        }
      }

      // Seed contacts
      if (u.contacts && u.contacts.length > 0) {
        for (const c of u.contacts) {
          await client.query(
            `INSERT INTO public.ukpm_contacts (ukpm_id, role, name, contact) VALUES ($1, $2, $3, $4)`,
            [u.id, c.role, c.name, c.contact || '']
          );
        }
      }
    }
    console.log(`✅ Seeded ${UKMS.length} UKMs with related missions, requirements, schedules, gallery, and contacts.`);

    // ----------------------------------------------------
    // 5. Seed Achievements
    // ----------------------------------------------------
    console.log('🥇 Seeding achievements...');
    for (const a of ACHIEVEMENTS) {
      await client.query(
        `INSERT INTO public.achievements (id, title, student_name, major, level, rank, category, year, description, image_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          a.id,
          a.title,
          a.studentName,
          a.major,
          a.level,
          a.rank || '',
          a.category === 'Seni & Budaya' ? 'Seni' : a.category,
          a.year,
          a.description || '',
          a.image || ''
        ]
      );
    }
    console.log(`✅ Seeded ${ACHIEVEMENTS.length} achievements.`);

    // ----------------------------------------------------
    // 6. Seed Alumni Records
    // ----------------------------------------------------
    console.log('👨‍🎓 Seeding alumni records...');
    for (const al of INITIAL_ALUMNI) {
      const nim = `20${18 + Math.floor(Math.random() * 4)}${10000 + Math.floor(Math.random() * 90000)}`;
      const email = `${al.name.toLowerCase().replace(/\s+/g, '')}@example.com`;
      const status = al.status === 'Lanjut Studi' ? 'Melanjutkan Studi' : al.status === 'Mencari Kerja' ? 'Belum Bekerja' : al.status;

      await client.query(
        `INSERT INTO public.alumni_records (id, name, nim, major, graduation_year, status, company, position, email, nim_status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          al.id,
          al.name,
          nim,
          al.major,
          al.graduationYear,
          status,
          al.company || '',
          al.position || '',
          email,
          'Valid'
        ]
      );
    }
    console.log(`✅ Seeded ${INITIAL_ALUMNI.length} alumni records.`);

    console.log('\n🎉 Seeding completed successfully!');
  } catch (error: any) {
    console.error('\n❌ Seeding failed:');
    console.error(error.message || error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seed();
