const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, '..', 'supabase_credentials_backup.sql');
const content = fs.readFileSync(inputFile, 'utf8');

function splitSqlValues(valuesStr) {
  const parts = [];
  let current = '';
  let inQuote = false;
  for (let i = 0; i < valuesStr.length; i++) {
    const char = valuesStr[i];
    if (char === "'") {
      if (inQuote && valuesStr[i + 1] === "'") {
        current += "''";
        i++; // skip next quote
      } else {
        inQuote = !inQuote;
        current += char;
      }
    } else if (char === ',' && !inQuote) {
      parts.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  parts.push(current.trim());
  return parts;
}

function getCategory(name) {
  const upper = name.toUpperCase();
  if (upper.includes('HIMPUNAN') || upper.includes('HIMA') || upper.includes('HMPS')) {
    return 'Akademik';
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

const lines = content.split('\n');

const usersMap = {}; // userId -> name
const profiles = []; // { userId, ukmId }

lines.forEach(line => {
  if (line.trim().startsWith('INSERT INTO public.users')) {
    // Extract columns and values
    const colStart = line.indexOf('INSERT INTO public.users (') + 'INSERT INTO public.users ('.length;
    const colEnd = line.indexOf(') VALUES');
    const cols = line.substring(colStart, colEnd).split(',').map(s => s.trim());

    const valStart = line.indexOf('VALUES (') + 'VALUES ('.length;
    const valEnd = line.lastIndexOf(') ON CONFLICT');
    const valsStr = line.substring(valStart, valEnd);
    const vals = splitSqlValues(valsStr);

    const idIdx = cols.indexOf('id');
    const nameIdx = cols.indexOf('name');
    
    if (idIdx !== -1 && nameIdx !== -1) {
      const id = vals[idIdx].replace(/'/g, '');
      const name = vals[nameIdx].replace(/'/g, '');
      usersMap[id] = name;
    }
  }

  if (line.trim().startsWith('INSERT INTO public.ormawa_admin_profiles')) {
    const colStart = line.indexOf('INSERT INTO public.ormawa_admin_profiles (') + 'INSERT INTO public.ormawa_admin_profiles ('.length;
    const colEnd = line.indexOf(') VALUES');
    const cols = line.substring(colStart, colEnd).split(',').map(s => s.trim());

    const valStart = line.indexOf('VALUES (') + 'VALUES ('.length;
    const valEnd = line.lastIndexOf(') ON CONFLICT');
    const valsStr = line.substring(valStart, valEnd);
    const vals = splitSqlValues(valsStr);

    const userIdIdx = cols.indexOf('user_id');
    const ukmIdIdx = cols.indexOf('ukm_id');

    if (userIdIdx !== -1 && ukmIdIdx !== -1) {
      const userId = vals[userIdIdx].replace(/'/g, '');
      const ukmId = vals[ukmIdIdx].replace(/'/g, '');
      profiles.push({ userId, ukmId });
    }
  }
});

console.log(`Parsed ${Object.keys(usersMap).length} public users.`);
console.log(`Parsed ${profiles.length} profiles.`);

// Generate inserts for public.ukms
const ukmInserts = [];
profiles.forEach(p => {
  const ukmName = usersMap[p.userId] || `UKM ${p.ukmId.substring(0, 8)}`;
  const category = getCategory(ukmName);
  const type = ukmName.includes('HIMPUNAN') || ukmName.includes('HIMA') ? 'Fakultas' : 'Universitas';
  const desc = `${ukmName} adalah organisasi kemahasiswaan Universitas Pelita Bangsa yang berfokus pada pengembangan minat, bakat, keahlian, dan kepemimpinan mahasiswa.`;
  const shortDesc = `${ukmName} Universitas Pelita Bangsa.`;
  const vision = `Menjadi wadah pengembangan ${ukmName} yang unggul, berprestasi, berintegritas, dan inovatif.`;
  const leaderName = `Ketua ${ukmName}`;

  ukmInserts.push(`INSERT INTO public.ukms (id, name, category, type, status, description, short_description, vision, active_members, leader_name, created_at, updated_at) VALUES ('${p.ukmId}', '${ukmName}', '${category}', '${type}', 'Active', '${desc}', '${shortDesc}', '${vision}', 15, '${leaderName}', now(), now()) ON CONFLICT (id) DO NOTHING;`);
});

const sqlContent = ukmInserts.join('\n');
fs.writeFileSync(path.join(__dirname, '..', 'supabase_credentials_backup_clean.sql'), sqlContent + '\n\n' + fs.readFileSync(path.join(__dirname, '..', 'supabase_credentials_backup_clean.sql'), 'utf8'), 'utf8');

console.log(`Added ${ukmInserts.length} ukm inserts to the beginning of clean sql file!`);
