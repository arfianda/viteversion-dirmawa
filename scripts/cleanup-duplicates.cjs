const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:postgres@localhost:54322/postgres'
});

async function main() {
  await client.connect();
  console.log('Cleaning up duplicate UKM records...');

  // 1. Find all UKM names that have duplicates
  const dupNamesRes = await client.query(`
    SELECT name, COUNT(*) 
    FROM public.ukms 
    GROUP BY name 
    HAVING COUNT(*) > 1
  `);

  console.log(`Found ${dupNamesRes.rows.length} UKM names with duplicates.`);

  for (const row of dupNamesRes.rows) {
    const ukmName = row.name;

    // Get all UKMs with this name
    const ukmsRes = await client.query('SELECT id, created_at FROM public.ukms WHERE name = $1 ORDER BY created_at ASC', [ukmName]);
    
    // We want to keep the one that is linked in ormawa_admin_profiles (if any)
    let keepUkmId = null;
    for (const ukm of ukmsRes.rows) {
      const checkProfile = await client.query('SELECT id FROM public.ormawa_admin_profiles WHERE ukm_id = $1', [ukm.id]);
      if (checkProfile.rows.length > 0) {
        keepUkmId = ukm.id;
        break;
      }
    }

    // If none are linked, keep the oldest one
    if (!keepUkmId) {
      keepUkmId = ukmsRes.rows[0].id;
    }

    console.log(`For "${ukmName}", keeping UKM ID: ${keepUkmId}`);

    // Update any stray schedules, contacts, or profiles to point to the kept UKM ID before deleting the duplicates
    for (const ukm of ukmsRes.rows) {
      if (ukm.id === keepUkmId) continue;

      // Update dependent records
      await client.query('UPDATE public.ormawa_admin_profiles SET ukm_id = $1 WHERE ukm_id = $2', [keepUkmId, ukm.id]);
      await client.query('UPDATE public.ukpm_schedules SET ukpm_id = $1 WHERE ukpm_id = $2', [keepUkmId, ukm.id]);
      await client.query('UPDATE public.ukpm_contacts SET ukpm_id = $1 WHERE ukpm_id = $2', [keepUkmId, ukm.id]);
      
      // Delete child cascade tables or reference rows
      await client.query('DELETE FROM public.ukpm_missions WHERE ukpm_id = $1', [ukm.id]);
      await client.query('DELETE FROM public.ukpm_gallery WHERE ukpm_id = $1', [ukm.id]);
      await client.query('DELETE FROM public.ukpm_requirements WHERE ukpm_id = $1', [ukm.id]);
      
      // Finally delete the duplicate UKM row
      await client.query('DELETE FROM public.ukms WHERE id = $1', [ukm.id]);
    }
  }

  // De-duplicate users based on email
  const dupUsersRes = await client.query(`
    SELECT email, COUNT(*) 
    FROM public.users 
    GROUP BY email 
    HAVING COUNT(*) > 1
  `);

  console.log(`Found ${dupUsersRes.rows.length} User emails with duplicates.`);

  for (const row of dupUsersRes.rows) {
    const email = row.email;
    const usersRes = await client.query('SELECT id, created_at FROM public.users WHERE email = $1 ORDER BY created_at ASC', [email]);
    
    const keepUserId = usersRes.rows[0].id;
    console.log(`For user "${email}", keeping User ID: ${keepUserId}`);

    for (const user of usersRes.rows) {
      if (user.id === keepUserId) continue;

      // Update admin profiles
      await client.query('UPDATE public.ormawa_admin_profiles SET user_id = $1 WHERE user_id = $2', [keepUserId, user.id]);
      
      // Delete duplicate public user
      await client.query('DELETE FROM public.users WHERE id = $1', [user.id]);
      // Delete duplicate auth user
      await client.query('DELETE FROM auth.users WHERE id = $1', [user.id]);
    }
  }

  const finalCount = await client.query('SELECT COUNT(*) FROM public.ukms');
  console.log('Final clean UKMs count:', finalCount.rows[0].count);

  await client.end();
  console.log('Clean up completed.');
}

main().catch(console.error);
