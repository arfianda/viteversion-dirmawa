const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:postgres@127.0.0.1:54322/postgres',
});

async function main() {
  await client.connect();
  console.log('Connected to local database to remove mock admins.');
  
  // 1. Delete mock admins from auth.users (cascade deletes public.users if references exist)
  // Let's delete them by emails: abcd@upb.ac.id, efgh@upb.ac.id, asdf@upb.ac.id
  const emails = ['abcd@upb.ac.id', 'efgh@upb.ac.id', 'asdf@upb.ac.id'];
  
  console.log('Deleting from auth.users and public.users...');
  await client.query('DELETE FROM auth.users WHERE email = ANY($1)', [emails]);
  await client.query('DELETE FROM public.users WHERE email = ANY($1)', [emails]);
  
  console.log('Mock admins removed successfully.');
  await client.end();
}

main().catch(err => {
  console.error('Failed to remove mock admins:', err);
  process.exit(1);
});
