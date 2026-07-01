const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:postgres@127.0.0.1:54322/postgres',
});

async function main() {
  await client.connect();
  console.log('Connected to local database.');
  const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
  console.log('Tables:');
  for (let row of res.rows) {
    console.log(' - ' + row.table_name);
  }
  await client.end();
}

main().catch(console.error);
