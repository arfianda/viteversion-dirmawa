const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DIRECT_URL,
});

client.connect()
  .then(() => {
    console.log('✅ Connected to PostgreSQL (direct)!');
    return client.query('SELECT version()');
  })
  .then(res => {
    console.log('PostgreSQL version:', res.rows[0]);
    return client.query('SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\'');
  })
  .then(res => {
    console.log('\n📋 Tables in database:');
    res.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });

    // Get schema for each table
    return Promise.all(
      res.rows.map(async (row) => {
        const tableName = row.table_name;
        console.log(`\n📋 Schema for table "${tableName}":`);
        const columns = await client.query(`
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = $1
          ORDER BY ordinal_position
        `, [tableName]);

        columns.rows.forEach(col => {
          console.log(`  ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'} ${col.column_default ? `DEFAULT ${col.column_default}` : ''}`);
        });
      })
    );
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err);
  })
  .finally(() => {
    client.end();
  });