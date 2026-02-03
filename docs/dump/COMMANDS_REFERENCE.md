# ▶️ CARA MENJALANKAN PROJECT - COMMAND REFERENCE

**Lengkap dengan semua command yang dibutuhkan**

---

## 🚀 QUICK START (5 MENIT)

### 1️⃣ Install Dependencies
```bash
npm install
```

### 2️⃣ Setup Environment
```bash
cp .env.example .env
# Edit .env dan tambahkan Supabase credentials
```

### 3️⃣ Setup Database
```bash
npm run db:setup
```

### 4️⃣ Run Server
```bash
npm run dev
```

✅ **Done!** Server running di `http://localhost:3000`

---

## 📋 SEMUA COMMANDS

### SETUP COMMANDS

#### Install semua dependencies
```bash
npm install
```
**Apa itu**: Download semua packages dari package.json
**Output**: Folder `node_modules` dibuat

#### Update dependencies
```bash
npm update
```
**Apa itu**: Update semua packages ke versi terbaru

#### Check outdated packages
```bash
npm outdated
```
**Apa itu**: Lihat package mana yang bisa di-update

---

### DATABASE COMMANDS

#### Setup database (buat schema & tables)
```bash
npm run db:setup
```
**Apa itu**: Initialize database dengan schema dari `src/database/schema.sql`
**Prerequisite**: Supabase credentials sudah di `.env`
**Output**: Database sudah siap dengan 12 tables

#### Seed database (masukkan data contoh)
```bash
npm run db:seed
```
**Apa itu**: Masukkan data pre-seeded:
  - 5 background templates
  - 3 mascots
  - 5 filters
**Prerequisite**: Database sudah di-setup
**Output**: Data ready untuk testing

#### Buat user/connections baru
```bash
node src/database/setup.js --create-user
```
**Apa itu**: Buat koneksi database baru

---

### DEVELOPMENT COMMANDS

#### Run server (development mode dengan auto-reload)
```bash
npm run dev
```
**Apa itu**: Jalankan server dengan Nodemon (auto-reload saat file berubah)
**Output**: Server running di port 3000
**Tekan**: `CTRL+C` untuk stop

#### Run server (production mode)
```bash
npm start
```
**Apa itu**: Jalankan server tanpa auto-reload
**Gunakan**: Untuk production/deployment

#### Run server dengan debug info
```bash
DEBUG=* npm run dev
```
**Apa itu**: Jalankan dengan verbose logging
**Output**: Lebih banyak informasi untuk debugging

---

### TESTING COMMANDS

#### Health check (cek server running)
```bash
curl http://localhost:3000/api/health
```
**Expected output**:
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2026-02-02T10:00:00.000Z",
  "uptime": 120.5
}
```

#### Get all backgrounds
```bash
curl http://localhost:3000/api/backgrounds
```

#### Get all mascots
```bash
curl http://localhost:3000/api/mascots
```

#### Analyze photo (upload + face detection)
```bash
curl -X POST http://localhost:3000/api/photos/analyze-face \
  -F "photo=@path/to/photo.jpg" \
  -F "photo_id=test-photo-1"
```

#### Generate QR code
```bash
curl -X POST http://localhost:3000/api/downloads/generate-qr \
  -H "Content-Type: application/json" \
  -d '{"photo_id":"test-photo-1","expires_in":7}'
```

#### Get server status
```bash
curl http://localhost:3000/api/status
```
**Output**: Info tentang database connection, services enabled, etc

---

## 🔧 ENVIRONMENT SETUP

### Create .env file
```bash
cp .env.example .env
```

### Edit .env dengan credentials
```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# MediaPipe (Face Recognition)
MEDIAPIPE_ENABLED=true
MEDIAPIPE_MODEL_ASSETS_PATH=./node_modules/@mediapipe/tasks-vision/wasm

# App
NODE_ENV=development
APP_PORT=3000

# Storage
STORAGE_PATH=./uploads
STORAGE_TEMP_PATH=./uploads/temp
```

### Verify credentials
```bash
# Test Supabase connection
node -e "
const { supabase } = require('./src/database/supabase-client');
supabase.from('backgrounds').select('*').limit(1).then(r => {
  console.log('✅ Database connected!');
  console.log('Rows:', r.data?.length || 0);
}).catch(e => console.error('❌ Error:', e.message));
"
```

---

## 📦 PACKAGE SCRIPTS (dari package.json)

```json
{
  "scripts": {
    "dev": "nodemon src/index.js",
    "start": "node src/index.js",
    "db:setup": "node src/database/setup.js",
    "db:seed": "node src/database/seed.js"
  }
}
```

### Cara menggunakan:
```bash
npm run [script-name]
```

**Contoh:**
```bash
npm run dev      # Start development server
npm start        # Start production server
npm run db:setup # Setup database
npm run db:seed  # Seed database
```

---

## 🧪 TESTING DENGAN POSTMAN

### Import Collection
1. Buka Postman
2. Create new request
3. Set method & URL
4. Send

### Test Cases

#### 1. Health Check
```
Method: GET
URL: http://localhost:3000/api/health
Body: (none)
```

#### 2. Get Backgrounds
```
Method: GET
URL: http://localhost:3000/api/backgrounds
Params: 
  - category: madiun (optional)
Body: (none)
```

#### 3. Get Specific Background
```
Method: GET
URL: http://localhost:3000/api/backgrounds/bg-001
Body: (none)
```

#### 4. Analyze Face
```
Method: POST
URL: http://localhost:3000/api/photos/analyze-face
Body: form-data
  - photo: [Select file]
  - photo_id: test-photo-1
```

#### 5. Batch Analyze
```
Method: POST
URL: http://localhost:3000/api/photos/batch-analyze
Body: form-data
  - photos: [Select multiple files, max 5]
```

#### 6. Generate QR Code
```
Method: POST
URL: http://localhost:3000/api/downloads/generate-qr
Headers: Content-Type: application/json
Body (raw JSON):
{
  "photo_id": "test-photo-1",
  "expires_in": 7
}
```

#### 7. Process Photo
```
Method: POST
URL: http://localhost:3000/api/photos/process
Body: form-data
  - photo: [Select file]
  - photo_id: test-photo-1
  - background_id: bg-001
  - mascot_id: mascot-001
  - filter_id: beauty
  - quality: 85
```

---

## 🛠️ TROUBLESHOOTING

### Error: "Cannot find module 'express'"
```bash
# Solution:
npm install
```

### Error: "EADDRINUSE: address already in use :::3000"
```bash
# Solution 1: Kill process on port 3000
lsof -ti:3000 | xargs kill -9  # Mac/Linux
netstat -ano | findstr :3000   # Windows (find PID)
taskkill /PID <PID> /F         # Windows (kill)

# Solution 2: Use different port
APP_PORT=3001 npm run dev
```

### Error: "Supabase connection failed"
```bash
# Check .env file
cat .env

# Verify credentials
echo "SUPABASE_URL: $SUPABASE_URL"
echo "SUPABASE_ANON_KEY: $SUPABASE_ANON_KEY"

# Update if needed
# Then restart server
```

### Error: "Database table not found"
```bash
# Solution: Setup database
npm run db:setup

# Then seed data
npm run db:seed
```

### Error: "Module not found: sharp"
```bash
# Solution:
npm install sharp
# or
npm install
```

### Port not responding
```bash
# Check if server started
curl http://localhost:3000/api/health

# If not responding, check logs in terminal
# Look for errors in console output
```

---

## 📊 SERVER LOGS

### Typical startup (dengan npm run dev):
```
> nodemon src/index.js

[nodemon] 3.0.2
[nodemon] to restart at any time, type `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,json
[nodemon] starting `node src/index.js`
✓ Face Recognition Service initialized
🚀 Server running on http://localhost:3000
📍 API Docs: http://localhost:3000/api/docs
```

### Logs during request:
```
POST /api/photos/analyze-face
📸 Step 1: Loading image...
👤 Step 2: Detecting face...
✅ Analysis complete!
200 OK
```

### Error logs:
```
❌ Error: No face detected in image
GET /api/backgrounds/invalid-id
404 Not Found: Background not found
```

---

## 🔄 DEVELOPMENT WORKFLOW

### Recommended setup:

#### Terminal 1: Running server
```bash
npm run dev
```
Keep running, auto-reloads on file changes

#### Terminal 2: Testing API
```bash
# Test endpoints as you develop
curl http://localhost:3000/api/health

# Or use Postman for easier testing
```

#### Terminal 3: Database management
```bash
# If need to reset database
npm run db:setup
npm run db:seed
```

---

## 🎯 STEP-BY-STEP UNTUK PEMULA

### Step 1: Clone repository
```bash
git clone <repository-url>
cd project_photobooth
```

### Step 2: Install dependencies
```bash
npm install
```
(Tunggu beberapa menit sampai selesai)

### Step 3: Create .env file
```bash
cp .env.example .env
```

### Step 4: Edit .env (ganti dengan Supabase credentials Anda)
```bash
# Windows
notepad .env

# Mac/Linux
nano .env
```

Ubah:
```env
SUPABASE_URL=<your-url>
SUPABASE_ANON_KEY=<your-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

### Step 5: Setup database
```bash
npm run db:setup
```

### Step 6: Seed data (optional)
```bash
npm run db:seed
```

### Step 7: Start server
```bash
npm run dev
```

### Step 8: Test
```bash
curl http://localhost:3000/api/health
```

Jika output seperti ini:
```json
{"success":true,"status":"healthy",...}
```

✅ **SUCCESS! Server running!**

---

## 📱 POSTMAN TESTING (EASIEST)

### 1. Download Postman
https://www.postman.com/downloads/

### 2. Create Collection
- Click "Create New"
- Select "Collection"
- Name: "Photobooth API"

### 3. Add Requests
Add requests for:
- GET /api/health
- GET /api/backgrounds
- GET /api/mascots
- POST /api/photos/analyze-face
- POST /api/downloads/generate-qr

### 4. Test
- Click send pada tiap request
- Lihat response

---

## 🚀 PHASE 3 & 4 COMMANDS

### Setelah implementasi Phase 3 (API):
```bash
# Test API endpoints
npm run dev

# In another terminal:
curl http://localhost:3000/api/health
curl http://localhost:3000/api/backgrounds
curl -X POST http://localhost:3000/api/photos/analyze-face \
  -F "photo=@photo.jpg"
```

### Setelah implementasi Phase 4 (Images):
```bash
# Test image processing
curl -X POST http://localhost:3000/api/photos/process \
  -F "photo=@photo.jpg" \
  -F "background_id=bg-001" \
  -F "mascot_id=mascot-001"
```

---

## 📝 CHEAT SHEET

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npm run dev` | Start server (dev mode) |
| `npm start` | Start server (production) |
| `npm run db:setup` | Initialize database |
| `npm run db:seed` | Load test data |
| `curl http://localhost:3000/api/health` | Test server |
| `Ctrl+C` | Stop server |
| `npm update` | Update packages |

---

## ✅ VERIFICATION CHECKLIST

Sebelum start development:

- [ ] Node.js installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] `.env` file created dengan Supabase credentials
- [ ] `npm install` completed
- [ ] `npm run db:setup` berhasil
- [ ] `npm run dev` server started
- [ ] `curl http://localhost:3000/api/health` returns success

---

## 🎉 READY TO GO!

Sekarang Anda tahu semua command untuk:
- ✅ Setup project
- ✅ Run server
- ✅ Test endpoints
- ✅ Troubleshoot issues

**Next step:** Mulai Phase 3 implementation! 🚀

Baca: [docs/PHASE3_API_IMPLEMENTATION.md](docs/PHASE3_API_IMPLEMENTATION.md)

---

**Happy coding!**
