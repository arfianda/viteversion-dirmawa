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
      console.log('Connected! Executing migration...');
      
      const sql = `
        -- Add status column to achievements table if not exists
        ALTER TABLE public.achievements ADD COLUMN IF NOT EXISTS status TEXT CHECK (status IN ('Disetujui', 'Menunggu Verifikasi', 'Ditolak')) NOT NULL DEFAULT 'Disetujui';

        -- Set default for new rows to 'Menunggu Verifikasi'
        ALTER TABLE public.achievements ALTER COLUMN status SET DEFAULT 'Menunggu Verifikasi';
      `;
      
      await client.query(sql);
      console.log('Success! Migration applied.');
      await client.end();
      success = true;
      break;
    } catch (err) {
      console.error(`Failed connecting/executing with ${url.substring(0, 30)}... :`, err.message);
      try { await client.end(); } catch (e) {}
    }
  }
  if (!success) {
    console.error('All connection attempts failed!');
    process.exit(1);
  }
}

main();
