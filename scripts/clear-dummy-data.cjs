const { Client } = require('pg');

const urls = [
  process.env.DATABASE_URL,
  'postgresql://postgres:postgres@10.200.3.197:54322/postgres',
  'postgresql://postgres:postgres@127.0.0.1:54322/postgres'
].filter(Boolean);

async function main() {
  let success = false;
  for (const url of urls) {
    const client = new Client({ connectionString: url });
    try {
      console.log(`Connecting to database: ${url.replace(/:[^:@]+@/, ':***@')} ...`);
      await client.connect();
      console.log('Connected! Executing truncate commands...');
      
      const sql = `
        BEGIN;
        TRUNCATE TABLE public.scholarship_applications CASCADE;
        TRUNCATE TABLE public.scholarship_requirements CASCADE;
        TRUNCATE TABLE public.scholarship_benefits CASCADE;
        TRUNCATE TABLE public.scholarships CASCADE;
        
        TRUNCATE TABLE public.ukpm_missions CASCADE;
        TRUNCATE TABLE public.ukpm_schedules CASCADE;
        TRUNCATE TABLE public.ukpm_contacts CASCADE;
        TRUNCATE TABLE public.ukpm_gallery CASCADE;
        TRUNCATE TABLE public.ukpm_requirements CASCADE;
        TRUNCATE TABLE public.member_reports CASCADE;
        TRUNCATE TABLE public.ormawa_applications CASCADE;
        TRUNCATE TABLE public.ormawa_proposals CASCADE;
        TRUNCATE TABLE public.ormawa_lpjs CASCADE;
        TRUNCATE TABLE public.ukms CASCADE;
        TRUNCATE TABLE public.achievements CASCADE;
        COMMIT;
      `;
      
      await client.query(sql);
      console.log('Success! Dummy data for scholarships, UKMs, and achievements cleared.');
      await client.end();
      success = true;
      break;
    } catch (err) {
      console.error(`Failed connecting/executing with ${url.substring(0, 30)}... :`, err.message);
      try { await client.end(); } catch (e) {}
    }
  }
  if (!success) {
    console.error('All database connection attempts failed!');
    process.exit(1);
  }
}

main();
