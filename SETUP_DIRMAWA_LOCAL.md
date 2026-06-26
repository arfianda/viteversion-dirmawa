# SETUP_DIRMAWA_LOCAL.md
# Panduan Migrasi Tech Stack — Local Development First
# Stack: React 19 + Vite v6 + Tailwind v4 + PostgreSQL + PostgREST + Minio
# Menggantikan: Supabase Cloud (Free Tier)
# Tujuan: Jalankan & validasi stack secara lokal sebelum deploy ke VPS

---

## KONTEKS PROYEK

Dokumen ini adalah versi **lokal** dari migration guide Dirmawa. Semua service dijalankan via **Docker Compose** di mesin pengembang, sehingga:

- Tidak perlu VPS atau domain dulu
- Environment identik dengan production (same stack, same config pattern)
- Mudah di-reset dan di-rebuild ulang
- Credential & konfigurasi sudah dalam format yang siap dipindah ke `.env.production`

**Setelah semua service berjalan dan divalidasi di lokal**, deployment ke VPS tinggal menyalin nilai env dan menjalankan setup server.

---

## PRASYARAT

Pastikan sudah terinstall di mesin lokal:

- **Docker Desktop** (Windows/Mac) atau **Docker Engine + Docker Compose** (Linux)  
  → [https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/)
- **Node.js 20 LTS** → [https://nodejs.org](https://nodejs.org)
- **Git**

Verifikasi:
```bash
docker --version        # Docker version 24+
docker compose version  # Docker Compose version v2+
node --version          # v20.x.x
```

---

## STRUKTUR FOLDER

Buat folder khusus untuk infrastruktur lokal, terpisah dari folder project React:

```
dirmawa-infra/          ← folder baru, bukan di dalam project React
├── docker-compose.yml
├── .env                ← credential lokal (jangan di-commit)
├── .env.example        ← template credential (boleh di-commit)
├── postgres/
│   └── init/
│       └── 01_schema.sql
└── nginx/
    └── default.conf
```

```bash
mkdir dirmawa-infra && cd dirmawa-infra
mkdir -p postgres/init nginx
```

---

## LANGKAH 1: Buat File `.env`

File ini menyimpan semua credential untuk lokal. Nilai-nilainya nanti bisa dipakai langsung saat setup VPS.

Buat file `.env` di dalam `dirmawa-infra/`:

```env
# ============================================================
# DIRMAWA — LOCAL ENVIRONMENT
# Jangan commit file ini ke Git!
# ============================================================

# PostgreSQL
DB_NAME=dirmawa_db
DB_USER=dirmawa_user
DB_PASSWORD=lokal_password_ganti_ini

# PostgREST
JWT_SECRET=lokal_jwt_secret_minimal_32_karakter_ganti_ini
POSTGREST_PORT=3001

# Minio
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin123
MINIO_PORT=9000
MINIO_CONSOLE_PORT=9001

# Adminer
ADMINER_PORT=8080

# URL yang dipakai oleh frontend Vite (localhost)
VITE_API_URL=http://localhost:3001
VITE_STORAGE_URL=http://localhost:9000
```

> **Catatan:** Untuk production nanti, ganti semua nilai password/secret dengan string acak yang kuat. Bisa generate dengan: `openssl rand -hex 32`

---

## LANGKAH 2: Buat `docker-compose.yml`

Buat file `docker-compose.yml` di dalam `dirmawa-infra/`:

```yaml
version: "3.9"

services:

  # ============================================================
  # PostgreSQL 16 — Database Utama
  # ============================================================
  postgres:
    image: postgres:16-alpine
    container_name: dirmawa_postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./postgres/init:/docker-entrypoint-initdb.d   # auto-run saat container pertama dibuat
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER} -d ${DB_NAME}"]
      interval: 10s
      timeout: 5s
      retries: 5

  # ============================================================
  # PostgREST — REST API otomatis dari PostgreSQL
  # Pengganti Supabase API, kompatibel dengan query syntax-nya
  # ============================================================
  postgrest:
    image: postgrest/postgrest:latest
    container_name: dirmawa_postgrest
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      PGRST_DB_URI: postgres://${DB_USER}:${DB_PASSWORD}@postgres:5432/${DB_NAME}
      PGRST_DB_SCHEMAS: public
      PGRST_DB_ANON_ROLE: anon
      PGRST_JWT_SECRET: ${JWT_SECRET}
      PGRST_SERVER_PORT: 3000
      PGRST_DB_POOL: 10
      PGRST_LOG_LEVEL: warn
    ports:
      - "${POSTGREST_PORT}:3000"

  # ============================================================
  # Minio — Object Storage untuk PDF
  # Pengganti Supabase Storage, kompatibel dengan S3 API
  # ============================================================
  minio:
    image: minio/minio:latest
    container_name: dirmawa_minio
    restart: unless-stopped
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: ${MINIO_ROOT_USER}
      MINIO_ROOT_PASSWORD: ${MINIO_ROOT_PASSWORD}
    ports:
      - "${MINIO_PORT}:9000"
      - "${MINIO_CONSOLE_PORT}:9001"
    volumes:
      - minio_data:/data
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 30s
      timeout: 10s
      retries: 3

  # ============================================================
  # Minio Setup — Buat bucket default sekali saat pertama jalan
  # ============================================================
  minio-setup:
    image: minio/mc:latest
    container_name: dirmawa_minio_setup
    depends_on:
      minio:
        condition: service_healthy
    entrypoint: >
      /bin/sh -c "
        mc alias set local http://minio:9000 ${MINIO_ROOT_USER} ${MINIO_ROOT_PASSWORD};
        mc mb --ignore-existing local/proposals;
        mc mb --ignore-existing local/lpj;
        mc mb --ignore-existing local/beasiswa;
        mc mb --ignore-existing local/asuransi;
        mc mb --ignore-existing local/public;
        mc anonymous set public local/public;
        echo 'Bucket setup selesai';
      "
    restart: "no"

  # ============================================================
  # Adminer — GUI Database Ringan (pengganti Supabase Studio)
  # ============================================================
  adminer:
    image: adminer:latest
    container_name: dirmawa_adminer
    restart: unless-stopped
    depends_on:
      - postgres
    ports:
      - "${ADMINER_PORT}:8080"
    environment:
      ADMINER_DEFAULT_SERVER: postgres

volumes:
  postgres_data:
  minio_data:
```

---

## LANGKAH 3: Buat Schema Database

Buat file `postgres/init/01_schema.sql`. File ini akan otomatis dieksekusi saat container PostgreSQL pertama kali dibuat.

```sql
-- ============================================================
-- SETUP ROLES untuk PostgREST (mirip behavior Supabase)
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'anon') THEN
    CREATE ROLE anon NOLOGIN;
  END IF;
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'authenticated') THEN
    CREATE ROLE authenticated NOLOGIN;
  END IF;
END$$;

-- Grant role ke DB user agar PostgREST bisa switch role
GRANT anon TO dirmawa_user;
GRANT authenticated TO dirmawa_user;

-- ============================================================
-- EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- SKEMA AUTENTIKASI (pengganti Supabase Auth)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   TEXT        NOT NULL,
    role            VARCHAR(50) NOT NULL DEFAULT 'mahasiswa',
    -- role: superadmin | admin | editor | mahasiswa
    is_active       BOOLEAN     DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- MODUL: ORGANISASI MAHASISWA
-- ============================================================
CREATE TABLE IF NOT EXISTS organizations (
    id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR(255) NOT NULL,
    description TEXT,
    editor_id   UUID        REFERENCES users(id),
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS proposals (
    id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID        REFERENCES organizations(id),
    submitter_id    UUID        REFERENCES users(id),
    title           VARCHAR(500) NOT NULL,
    description     TEXT,
    status          VARCHAR(50) DEFAULT 'pending',
    -- status: pending | reviewed | approved | rejected
    file_path       TEXT,
    file_url        TEXT,
    submitted_at    TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at     TIMESTAMPTZ,
    reviewer_id     UUID        REFERENCES users(id),
    notes           TEXT
);

CREATE TABLE IF NOT EXISTS lpj (
    id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    proposal_id     UUID        REFERENCES proposals(id),
    organization_id UUID        REFERENCES organizations(id),
    submitter_id    UUID        REFERENCES users(id),
    title           VARCHAR(500) NOT NULL,
    status          VARCHAR(50) DEFAULT 'pending',
    file_path       TEXT,
    file_url        TEXT,
    submitted_at    TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at     TIMESTAMPTZ,
    reviewer_id     UUID        REFERENCES users(id),
    notes           TEXT
);

-- ============================================================
-- MODUL: BEASISWA
-- ============================================================
CREATE TABLE IF NOT EXISTS scholarships (
    id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR(255) NOT NULL,
    provider    VARCHAR(255),
    description TEXT,
    requirements TEXT,
    deadline    DATE,
    is_active   BOOLEAN     DEFAULT TRUE,
    created_by  UUID        REFERENCES users(id),
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS scholarship_applications (
    id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    scholarship_id  UUID        REFERENCES scholarships(id),
    applicant_id    UUID        REFERENCES users(id),
    status          VARCHAR(50) DEFAULT 'pending',
    -- status: pending | verified | approved | rejected
    file_path       TEXT,
    file_url        TEXT,
    applied_at      TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at     TIMESTAMPTZ,
    reviewer_id     UUID        REFERENCES users(id),
    notes           TEXT
);

-- ============================================================
-- MODUL: KONSELING
-- ============================================================
CREATE TABLE IF NOT EXISTS counseling_appointments (
    id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id      UUID        REFERENCES users(id),
    counselor_id    UUID        REFERENCES users(id),
    topic           VARCHAR(255),
    description     TEXT,
    preferred_date  DATE,
    preferred_time  TIME,
    status          VARCHAR(50) DEFAULT 'pending',
    -- status: pending | confirmed | cancelled | done
    meeting_url     TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    confirmed_at    TIMESTAMPTZ
);

-- ============================================================
-- MODUL: ASURANSI
-- ============================================================
CREATE TABLE IF NOT EXISTS insurance_claims (
    id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id      UUID        REFERENCES users(id),
    claim_type      VARCHAR(100),
    description     TEXT,
    amount_claimed  DECIMAL(15,2),
    status          VARCHAR(50) DEFAULT 'pending',
    file_path       TEXT,
    file_url        TEXT,
    submitted_at    TIMESTAMPTZ DEFAULT NOW(),
    processed_at    TIMESTAMPTZ,
    processor_id    UUID        REFERENCES users(id),
    notes           TEXT
);

-- ============================================================
-- MODUL: CAREER LINK
-- ============================================================
CREATE TABLE IF NOT EXISTS career_links (
    id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    url         TEXT        NOT NULL,
    company     VARCHAR(255),
    is_active   BOOLEAN     DEFAULT TRUE,
    created_by  UUID        REFERENCES users(id),
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- GRANT PERMISSIONS untuk PostgREST
-- ============================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;
```

---

## LANGKAH 4: Jalankan Stack

```bash
# Masuk ke folder infrastruktur
cd dirmawa-infra

# Pull image dan jalankan semua service
docker compose up -d

# Cek status semua container
docker compose ps

# Lihat log real-time (opsional)
docker compose logs -f
```

Output `docker compose ps` yang diharapkan — semua status `running`:

```
NAME                    STATUS          PORTS
dirmawa_postgres        running         0.0.0.0:5432->5432/tcp
dirmawa_postgrest       running         0.0.0.0:3001->3000/tcp
dirmawa_minio           running         0.0.0.0:9000->9000/tcp, 0.0.0.0:9001->9001/tcp
dirmawa_adminer         running         0.0.0.0:8080->8080/tcp
dirmawa_minio_setup     exited (0)      ← normal, ini container satu kali jalan
```

---

## LANGKAH 5: Verifikasi Semua Service

### PostgreSQL
```bash
# Cek tabel berhasil dibuat
docker exec -it dirmawa_postgres psql -U dirmawa_user -d dirmawa_db -c "\dt"
```
Harus tampil semua tabel: `users`, `organizations`, `proposals`, `lpj`, dst.

### PostgREST API
```bash
# Harus mengembalikan JSON daftar tabel
curl http://localhost:3001/
```

```bash
# Test query tabel users (harusnya array kosong [])
curl http://localhost:3001/users
```

### Minio
Buka browser → [http://localhost:9001](http://localhost:9001)  
Login dengan `minioadmin` / `minioadmin123`  
Pastikan 5 bucket sudah ada: `proposals`, `lpj`, `beasiswa`, `asuransi`, `public`

### Adminer
Buka browser → [http://localhost:8080](http://localhost:8080)  
Login dengan:
- System: `PostgreSQL`
- Server: `postgres`
- Username: `dirmawa_user`
- Password: `lokal_password_ganti_ini`
- Database: `dirmawa_db`

---

## LANGKAH 6: Update Project Vite

### File `.env.local` di root project React

Buat atau update file `.env.local` di folder project React kamu (bukan di `dirmawa-infra`):

```env
# Endpoint lokal — mengarah ke Docker Compose
VITE_API_URL=http://localhost:3001
VITE_STORAGE_URL=http://localhost:9000
VITE_JWT_SECRET=lokal_jwt_secret_minimal_32_karakter_ganti_ini

# Hapus atau komentari ini:
# VITE_SUPABASE_URL=...
# VITE_SUPABASE_ANON_KEY=...
```

> `.env.local` diabaikan Git secara default — aman untuk simpan credential lokal.

---

### Buat `src/lib/api.js` — Pengganti `supabase.js`

File ini adalah drop-in replacement untuk `@supabase/supabase-js`. Ganti semua import dari `supabase.js` ke `api.js`.

```javascript
// src/lib/api.js
// Drop-in replacement untuk @supabase/supabase-js
// Menggunakan PostgREST yang sintaksnya kompatibel dengan Supabase query builder

const API_URL = import.meta.env.VITE_API_URL;
const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

// Ambil token dari localStorage
const getToken = () => localStorage.getItem('auth_token');

// Header standar untuk setiap request
const buildHeaders = (extra = {}) => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  ...(getToken()
    ? { 'Authorization': `Bearer ${getToken()}` }
    : { 'Authorization': 'Bearer anon' }),
  ...extra,
});

// Query builder — meniru Supabase client API
export const db = {
  from: (table) => ({

    select: async (columns = '*', options = {}) => {
      const params = new URLSearchParams({ select: columns, ...options });
      const res = await fetch(`${API_URL}/${table}?${params}`, {
        headers: buildHeaders(),
      });
      const json = await res.json();
      return { data: res.ok ? json : null, error: res.ok ? null : json };
    },

    insert: async (data) => {
      const res = await fetch(`${API_URL}/${table}`, {
        method: 'POST',
        headers: buildHeaders({ 'Prefer': 'return=representation' }),
        body: JSON.stringify(data),
      });
      const json = await res.json();
      return { data: res.ok ? json : null, error: res.ok ? null : json };
    },

    update: async (data, match) => {
      const params = new URLSearchParams(match);
      const res = await fetch(`${API_URL}/${table}?${params}`, {
        method: 'PATCH',
        headers: buildHeaders({ 'Prefer': 'return=representation' }),
        body: JSON.stringify(data),
      });
      const json = await res.json();
      return { data: res.ok ? json : null, error: res.ok ? null : json };
    },

    delete: async (match) => {
      const params = new URLSearchParams(match);
      const res = await fetch(`${API_URL}/${table}?${params}`, {
        method: 'DELETE',
        headers: buildHeaders(),
      });
      return { error: res.ok ? null : await res.json() };
    },
  }),
};

// Storage helper — meniru Supabase Storage
export const storage = {
  upload: async (bucket, path, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${STORAGE_URL}/${bucket}/${path}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${getToken()}` },
      body: formData,
    });
    return {
      data: {
        path: `${bucket}/${path}`,
        url: `${STORAGE_URL}/${bucket}/${path}`,
      },
      error: res.ok ? null : await res.json(),
    };
  },

  getPublicUrl: (bucket, path) => ({
    data: { publicUrl: `${STORAGE_URL}/${bucket}/${path}` },
  }),
};

export default { db, storage };
```

### Cara mengganti import di project

Cari semua file yang menggunakan `supabase.js`:
```bash
# Dari root project React
grep -r "supabase" src/ --include="*.jsx" --include="*.js" --include="*.ts" --include="*.tsx" -l
```

Ganti import di setiap file:
```javascript
// Sebelum:
import { supabase } from '@/lib/supabase'
import supabase from '../lib/supabase'

// Sesudah:
import { db, storage } from '@/lib/api'
import { db, storage } from '../lib/api'
```

---

## LANGKAH 7: Jalankan Vite Dev Server

```bash
# Di folder project React
npm install     # jika belum
npm run dev
```

Aplikasi berjalan di [http://localhost:5173](http://localhost:5173) dan terhubung ke stack lokal di Docker.

---

## Perintah Berguna

```bash
# Matikan semua service
docker compose down

# Matikan + hapus semua data (reset total)
docker compose down -v

# Restart satu service saja
docker compose restart postgrest

# Lihat log satu service
docker compose logs -f postgrest

# Masuk ke shell PostgreSQL
docker exec -it dirmawa_postgres psql -U dirmawa_user -d dirmawa_db

# Rebuild ulang setelah perubahan docker-compose.yml
docker compose up -d --force-recreate
```

---

## Ringkasan Akses Lokal

| Service | URL Lokal | Fungsi |
|---|---|---|
| **Frontend Vite** | http://localhost:5173 | Aplikasi React |
| **PostgREST API** | http://localhost:3001 | REST API dari PostgreSQL |
| **Minio Storage** | http://localhost:9000 | Object storage (S3 API) |
| **Minio Console** | http://localhost:9001 | GUI manajemen bucket & file |
| **Adminer** | http://localhost:8080 | GUI database (pengganti Supabase Studio) |
| **PostgreSQL** | localhost:5432 | Database langsung (untuk tools seperti DBeaver, TablePlus) |

---

## Checklist Sebelum Deploy ke VPS

Pastikan semua poin ini sudah terpenuhi di lokal sebelum lanjut ke server:

- [ ] Semua service berjalan tanpa error (`docker compose ps`)
- [ ] Schema database berhasil dibuat (semua tabel tampil di Adminer)
- [ ] PostgREST merespons query dari frontend
- [ ] Upload file ke Minio berhasil dan bucket tersedia
- [ ] Tidak ada lagi import dari `supabase.js` di project
- [ ] Semua fitur utama aplikasi berjalan dengan stack baru
- [ ] Catat semua nilai dari `.env` — akan dipakai ulang saat setup VPS (dengan password yang lebih kuat)

---

*Dokumen ini adalah versi lokal dari SETUP_DIRMAWA_INFRA.md*
*Stack: PostgreSQL 16 + PostgREST + Minio + Adminer via Docker Compose*
*Target: Local development machine (Windows / Mac / Linux)*
