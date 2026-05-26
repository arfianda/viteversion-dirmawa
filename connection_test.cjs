const { Client } = require('pg');
require('dotenv').config();

console.log('Testing connection...');
console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('DIRECT_URL:', process.env.DIRECT_URL);

// Test direct connection first
const testConnection = async (connectionString, label) => {
  console.log(`\n--- Testing ${label} ---`);
  const client = new Client({ connectionString });

  try {
    await client.connect();
    console.log('✅ Connection successful!');

    // Get version
    const versionRes = await client.query('SELECT version()');
    console.log('PostgreSQL version:', versionRes.rows[0].version.substring(0, 50) + '...');

    // List tables
    const tablesRes = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    console.log(`\n📋 Found ${tablesRes.rowCount} tables:`);
    tablesRes.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });

    await client.end();
    return true;
  } catch (err) {
    console.error('❌ Connection failed:');
    console.error('  Code:', err.code);
    console.error('  Message:', err.message);
    if (err.detail) console.error('  Detail:', err.detail);
    await client.end();
    return false;
  }
};

// Try both connection strings
testConnection(process.env.DIRECT_URL, 'DIRECT_URL (port 5432)');
testConnection(process.env.DATABASE_URL, 'DATABASE_URL (pooler port 6543)');