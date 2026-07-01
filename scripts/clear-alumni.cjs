const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:postgres@127.0.0.1:54322/postgres',
});

async function main() {
  await client.connect();
  console.log('Connected to local database.');
  
  console.log('Deleting all records from public.alumni_records...');
  await client.query('TRUNCATE TABLE public.alumni_records CASCADE');
  
  console.log('Alumni records table cleared.');
  await client.end();
}

main().catch(err => {
  console.error('Failed to clear alumni records:', err);
  process.exit(1);
});
