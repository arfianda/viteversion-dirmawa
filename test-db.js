require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  const prisma = new PrismaClient();

  try {
    await prisma.$connect();
    console.log('✅ Database connection successful!');

    // List all tables
    const tables = await prisma.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
    console.log('\n📋 Tables in database:');
    tables.forEach(table => {
      console.log(`  - ${table.table_name}`);
    });

    // Show schema for each table
    for (const table of tables) {
      const tableName = table.table_name;
      console.log(`\n📋 Schema for table "${tableName}":`);
      const columns = await prisma.$queryRaw`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = ${tableName}
        ORDER BY ordinal_position
      `;
      columns.forEach(col => {
        console.log(`  ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'} ${col.column_default ? `DEFAULT ${col.column_default}` : ''}`);
      });
    }

    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

testConnection();