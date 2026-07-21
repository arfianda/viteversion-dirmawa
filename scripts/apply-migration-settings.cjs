const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const client = new Client({
  connectionString: 'postgresql://postgres:postgres@127.0.0.1:64322/postgres',
});

async function main() {
  await client.connect();
  console.log('Connected to local database.');
  
  const sqlPath = path.join(__dirname, '../supabase/migrations/20260701000006_add_system_settings.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  
  console.log('Applying system_settings migration...');
  await client.query(sql);
  console.log('Migration applied successfully.');
  
  await client.end();
}

main().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
