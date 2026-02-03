# 🔧 TROUBLESHOOTING: npm run db:setup Error

**Exit Code: 1 berarti error terjadi**

---

## 🔍 Kemungkinan Penyebab

### 1. ❌ Supabase Credentials Tidak Valid

Jika error seperti:
```
Error: Invalid API credentials
Error: SUPABASE_URL or SUPABASE_ANON_KEY not found
```

**Solusi:**
```bash
# 1. Pastikan .env file sudah dibuat
ls -la .env  # Mac/Linux
dir .env     # Windows

# 2. Jika belum ada:
cp .env.example .env

# 3. Edit .env dan update dengan Supabase credentials yang valid
# Buka: https://app.supabase.com
# Copy dari Project Settings:
#   - SUPABASE_URL
#   - SUPABASE_ANON_KEY (Anon/Public)
#   - SUPABASE_SERVICE_ROLE_KEY (Service Role Secret)

# 4. Pastikan format URL benar (https://, bukan http://)
# SUPABASE_URL=https://your-project-id.supabase.co
```

---

### 2. ❌ Database sudah ada / Tables sudah ada

Jika error seperti:
```
Error: relation "users" already exists
Error: table "users" already exists
```

**Solusi:**
```bash
# Itu normal! Anda bisa abaikan.
# Atau jika ingin clean slate:

# Di Supabase Dashboard:
# 1. Go to SQL Editor
# 2. Buat query baru
# 3. Copy-paste:

DROP TABLE IF EXISTS download_analytics CASCADE;
DROP TABLE IF EXISTS download_links CASCADE;
DROP TABLE IF EXISTS photo_files CASCADE;
DROP TABLE IF EXISTS face_recognition_data CASCADE;
DROP TABLE IF EXISTS photo_processing CASCADE;
DROP TABLE IF EXISTS mascots CASCADE;
DROP TABLE IF EXISTS background_templates CASCADE;
DROP TABLE IF EXISTS ai_filters CASCADE;
DROP TABLE IF EXISTS photos CASCADE;
DROP TABLE IF EXISTS photo_sessions CASCADE;
DROP TABLE IF EXISTS analytics CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS users CASCADE;

# 4. Click Run
# 5. Then run again:
npm run db:setup
```

---

### 3. ❌ Supabase RPC tidak tersedia

Jika melihat:
```
⚠️ Catatan: Anda perlu menjalankan SQL schema secara manual
📄 SQL Schema yang perlu dijalankan di Supabase SQL Editor:
```

**Solusi MANUAL (Recommended):**

1. Buka Supabase Dashboard: https://app.supabase.com

2. Select project Anda

3. Go to SQL Editor (sidebar kiri)

4. Create new query

5. Copy semua SQL dari `src/database/schema.sql`:
   ```bash
   cat src/database/schema.sql
   ```

6. Paste ke Supabase SQL Editor

7. Click "Run"

8. Tunggu selesai (harus ada konfirmasi)

9. Sekarang jalankan:
   ```bash
   npm run db:seed
   ```

---

## ✅ STEP-BY-STEP SETUP (BENAR)

### Step 1: Create .env
```bash
cp .env.example .env
```

### Step 2: Get Supabase Credentials
1. Go to https://app.supabase.com
2. Login / Create account (free)
3. Create new project (or select existing)
4. Wait untuk database ready
5. Go to Project Settings → API
6. Copy:
   - URL
   - Anon/Public Key
   - Service Role Secret Key

### Step 3: Edit .env
```bash
# Windows (Notepad)
notepad .env

# Mac/Linux (Nano)
nano .env
```

Update:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### Step 4: Manual Setup Database
1. Go to Supabase Dashboard
2. SQL Editor → New Query
3. Copy paste semua dari `src/database/schema.sql`
4. Click Run
5. Wait for success

### Step 5: Seed Data
```bash
npm run db:seed
```

### Step 6: Verify
```bash
curl http://localhost:3000/api/backgrounds
```

---

## 📋 COMMON ERRORS & FIXES

| Error | Cause | Fix |
|-------|-------|-----|
| `Invalid API credentials` | Wrong/missing credentials | Check .env file |
| `SUPABASE_URL not found` | .env file missing | `cp .env.example .env` |
| `table already exists` | Recreating schema | Safe to ignore or delete tables first |
| `network error` | Supabase offline | Check https://status.supabase.com |
| `Connection refused` | Wrong URL | Verify SUPABASE_URL format |
| `RPC function not found` | Using exec_sql which doesn't exist | Use manual setup (see above) |

---

## 🎯 RECOMMENDED: MANUAL SETUP

Untuk menghindari masalah, gunakan cara manual:

### 1. Setup Database (Manual)
```bash
# 1. Buka Supabase
# 2. SQL Editor → New Query
# 3. Copy & paste semua isi dari:
cat src/database/schema.sql

# 4. Click Run di Supabase
# 5. Tunggu success message
```

### 2. Seed Data
```bash
npm run db:seed
```

### 3. Verify Setup
```bash
# Terminal 1: Run server
npm run dev

# Terminal 2: Test
curl http://localhost:3000/api/backgrounds
```

---

## ✨ Verification Checklist

- [ ] .env file exists
- [ ] SUPABASE_URL is valid (format: https://xxx.supabase.co)
- [ ] SUPABASE_ANON_KEY is filled
- [ ] SUPABASE_SERVICE_ROLE_KEY is filled
- [ ] Database tables created in Supabase (check Tables menu)
- [ ] npm run db:seed executed successfully
- [ ] npm run dev starts server without error
- [ ] curl http://localhost:3000/api/health returns success

---

## 📞 IF STILL ERROR

Check these:

1. **Supabase Status**
   - Is Supabase online? https://status.supabase.com

2. **Database Connection**
   ```bash
   # Test connection directly
   node -e "
   const { supabase } = require('./src/database/supabase-client');
   supabase.from('backgrounds').select('*').limit(1)
     .then(r => console.log('✅ Connected!', r.data?.length))
     .catch(e => console.error('❌ Error:', e.message));
   "
   ```

3. **Check Node Version**
   ```bash
   node --version  # Should be v14+
   npm --version   # Should be v6+
   ```

4. **Reinstall Dependencies**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

---

## 🚀 NEXT STEPS (AFTER SETUP)

Once database is ready:

```bash
# 1. Run server
npm run dev

# 2. Test API (another terminal)
curl http://localhost:3000/api/health

# 3. Proceed to Phase 3 implementation
# Read: docs/PHASE3_API_IMPLEMENTATION.md
```

---

**Need more help? Check:**
- [COMMANDS_REFERENCE.md](COMMANDS_REFERENCE.md)
- [QUICK_COMMANDS.md](QUICK_COMMANDS.md)
- [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md)
