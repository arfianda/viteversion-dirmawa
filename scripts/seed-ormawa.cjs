const XLSX = require('xlsx');
const path = require('path');
const { Client } = require('pg');
const crypto = require('crypto');

const client = new Client({
  connectionString: 'postgresql://postgres:postgres@localhost:54322/postgres'
});

function getCategory(name) {
  const upper = name.toUpperCase();
  if (upper.includes('HIMPUNAN') || upper.includes('HIMA') || upper.includes('HMPS')) {
    return 'Himpunan';
  }
  if (upper.includes('BSM') || upper.includes('SENI') || upper.includes('SUARA') || upper.includes('SENIKASELIA')) {
    return 'Seni & Budaya';
  }
  if (upper.includes('OLAHRAGA') || upper.includes('OPER') || upper.includes('SILAT') || upper.includes('FUTSAL') || upper.includes('ESPORT') || upper.includes('MAHESKOMTIF')) {
    return 'Olahraga';
  }
  if (upper.includes('LDK') || upper.includes('RABBANI')) {
    return 'Kerohanian';
  }
  if (upper.includes('MAPALA') || upper.includes('PRAMUKA') || upper.includes('SOSIAL')) {
    return 'Sosial';
  }
  return 'Akademik';
}

async function main() {
  await client.connect();
  console.log('Connected to PostgreSQL database.');

  const excelPath = path.join(__dirname, '../Akun_Login_Ormawa_UPB_2026.xlsx');
  const workbook = XLSX.readFile(excelPath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet);

  console.log(`Read ${rows.length} rows from Excel.`);

  for (const row of rows) {
    const namaOrmawa = row['Nama Ormawa']?.trim();
    const username = row['Username']?.trim();
    const password = row['Password Default']?.trim();
    const induk = row['Induk Ormawa']?.trim();

    if (!namaOrmawa || !username || !password) {
      console.warn('Skipping row due to missing values:', row);
      continue;
    }

    const email = `${username}@upb.ac.id`;
    const category = getCategory(namaOrmawa);
    const type = induk === 'UNIVERSITAS' ? 'Universitas' : 'Fakultas';
    const leaderName = `Ketua ${namaOrmawa.split(' (')[0]}`;
    const desc = `${namaOrmawa} adalah organisasi kemahasiswaan Universitas Pelita Bangsa di bawah naungan ${induk === 'UNIVERSITAS' ? 'Universitas' : 'Fakultas ' + induk} yang berfokus pada pengembangan minat, bakat, keahlian, dan kepemimpinan mahasiswa.`;
    const shortDesc = `${namaOrmawa} Universitas Pelita Bangsa.`;
    const vision = `Menjadi wadah pengembangan ${namaOrmawa} yang unggul, berprestasi, berintegritas, dan inovatif di tingkat nasional pada tahun 2028.`;

    // 1. Check/Get adminUserId from auth.users or public.users
    let adminUserId = null;
    const checkAuthUser = await client.query('SELECT id FROM auth.users WHERE email = $1', [email]);
    if (checkAuthUser.rows.length > 0) {
      adminUserId = checkAuthUser.rows[0].id;
    } else {
      const checkPublicUser = await client.query('SELECT id FROM public.users WHERE email = $1', [email]);
      if (checkPublicUser.rows.length > 0) {
        adminUserId = checkPublicUser.rows[0].id;
      }
    }

    adminUserId = adminUserId || crypto.randomUUID();

    // 2. Check/Get ukmId from public.ukms
    let ukmId = null;
    const checkUkm = await client.query('SELECT id FROM public.ukms WHERE name = $1', [namaOrmawa]);
    if (checkUkm.rows.length > 0) {
      ukmId = checkUkm.rows[0].id;
    } else {
      ukmId = crypto.randomUUID();
    }

    console.log(`Seeding: ${namaOrmawa} (${email}) ...`);

    try {
      // A. Insert into public.ukms if not exists
      const ukmInsertSql = `
        INSERT INTO public.ukms (
          id, name, category, type, status, description, 
          short_description, vision, active_members, leader_name, 
          logo_image_url, cover_image_url, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, now(), now())
        ON CONFLICT (id) DO NOTHING
      `;
      await client.query(ukmInsertSql, [
        ukmId,
        namaOrmawa,
        category,
        type,
        'Active',
        desc,
        shortDesc,
        vision,
        15,
        leaderName,
        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop'
      ]);

      const rawUserMetadata = JSON.stringify({
        name: namaOrmawa,
        role: 'admin_ormawa',
        roles: ['admin_ormawa']
      });

      // B. Insert into auth.users (Supabase Auth) if not exists
      const checkAuthExists = await client.query('SELECT id FROM auth.users WHERE email = $1', [email]);
      if (checkAuthExists.rows.length === 0) {
        await client.query(`
          INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, 
            email_confirmed_at, raw_app_meta_data, raw_user_meta_data, 
            created_at, updated_at, confirmation_token, 
            email_change_token_new, email_change_token_current, 
            recovery_token, phone_change_token, email_change, 
            phone_change, reauthentication_token
          ) VALUES (
            '00000000-0000-0000-0000-000000000000'::uuid,
            $1::uuid,
            'authenticated',
            'authenticated',
            $2,
            crypt($3, gen_salt('bf', 10)),
            now(),
            '{"provider": "email", "providers": ["email"]}'::jsonb,
            $4::jsonb,
            now(),
            now(),
            '', '', '', '', '', '', '', ''
          )
          ON CONFLICT (id) DO NOTHING
        `, [adminUserId, email, password, rawUserMetadata]);
      }

      // C. Insert into public.users if not exists
      await client.query(`
        INSERT INTO public.users (id, email, name, role, roles, is_approved, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, now(), now())
        ON CONFLICT (id) DO NOTHING
      `, [adminUserId, email, namaOrmawa, 'admin_ormawa', ['admin_ormawa'], true]);

      // D. Insert into public.ormawa_admin_profiles if not exists
      await client.query(`
        INSERT INTO public.ormawa_admin_profiles (id, user_id, ukm_id, created_at, updated_at)
        VALUES ($1, $2, $3, now(), now())
        ON CONFLICT (user_id) DO NOTHING
      `, [crypto.randomUUID(), adminUserId, ukmId]);

      // E. Add default schedule & contact (only if not exists)
      const checkSchedule = await client.query('SELECT id FROM public.ukpm_schedules WHERE ukpm_id = $1', [ukmId]);
      if (checkSchedule.rows.length === 0) {
        await client.query(`
          INSERT INTO public.ukpm_schedules (ukpm_id, day, time, activity)
          VALUES ($1, $2, $3, $4)
        `, [ukmId, 'Sabtu', '10:00 - 12:00', 'Latihan & Pertemuan Mingguan']);
      }

      const checkContact = await client.query('SELECT id FROM public.ukpm_contacts WHERE ukpm_id = $1', [ukmId]);
      if (checkContact.rows.length === 0) {
        await client.query(`
          INSERT INTO public.ukpm_contacts (ukpm_id, role, name, contact)
          VALUES ($1, $2, $3, $4)
        `, [ukmId, 'Ketua Umum', leaderName, '081234567890']);
      }

    } catch (err) {
      console.error(`Error seeding ${namaOrmawa}:`, err);
    }
  }

  await client.end();
  console.log('Seeding process completed.');
}

main().catch(console.error);
