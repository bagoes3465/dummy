# ⚡ QUICK COMMAND GUIDE

**Semua command dalam 1 halaman**

---

## 🚀 SETUP (First Time Only)

```bash
# 1. Install packages
npm install

# 2. Create environment file
cp .env.example .env

# 3. Edit .env with your Supabase credentials
# (Open .env and update SUPABASE_URL, SUPABASE_ANON_KEY, etc)

# 4. Setup database
npm run db:setup

# 5. (Optional) Load test data
npm run db:seed
```

---

## ▶️ RUN SERVER

### Development (with auto-reload)
```bash
npm run dev
```
→ Server at `http://localhost:3000`  
→ Press `CTRL+C` to stop

### Production
```bash
npm start
```

---

## 🧪 TEST API

### In another terminal:

#### Health check
```bash
curl http://localhost:3000/api/health
```

#### Get backgrounds
```bash
curl http://localhost:3000/api/backgrounds
```

#### Get mascots
```bash
curl http://localhost:3000/api/mascots
```

#### Upload & analyze photo
```bash
curl -X POST http://localhost:3000/api/photos/analyze-face \
  -F "photo=@photo.jpg" \
  -F "photo_id=test-1"
```

#### Generate QR code
```bash
curl -X POST http://localhost:3000/api/downloads/generate-qr \
  -H "Content-Type: application/json" \
  -d '{"photo_id":"test-1"}'
```

---

## 💾 DATABASE

### Setup
```bash
npm run db:setup
```

### Load test data
```bash
npm run db:seed
```

### Reset database (delete all data)
```bash
npm run db:setup  # Then npm run db:seed if needed
```

---

## 🔧 TROUBLESHOOTING

### Port already in use
```bash
# Option 1: Use different port
APP_PORT=3001 npm run dev

# Option 2: Kill process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

### Modules missing
```bash
npm install
```

### Database connection error
1. Check `.env` file has correct Supabase credentials
2. Run `npm run db:setup` again

---

## 📝 ALL SCRIPTS

From `package.json`:

| Command | What it does |
|---------|------------|
| `npm run dev` | Start server with auto-reload |
| `npm start` | Start server (production) |
| `npm run db:setup` | Initialize database |
| `npm run db:seed` | Load test data |

---

## 🔗 API ENDPOINTS (Phase 3+)

Once Phase 3 is done:

```
GET  /api/health                    ← Server health
GET  /api/backgrounds               ← List backgrounds
GET  /api/mascots                   ← List mascots
POST /api/photos/analyze-face       ← Face detection
POST /api/photos/batch-analyze      ← Batch analyze
POST /api/downloads/generate-qr     ← Generate QR
POST /api/photos/process            ← Process photo
```

---

## ✨ TYPICAL WORKFLOW

### Terminal 1: Running server
```bash
npm run dev
```
(Keep this running)

### Terminal 2: Testing
```bash
# Wait for "🚀 Server running..."
# Then test:
curl http://localhost:3000/api/health
```

### Terminal 3: Database
```bash
# If need to reset:
npm run db:setup
npm run db:seed
```

---

## 🎯 STEP-BY-STEP FOR BEGINNERS

```bash
# 1. Navigate to project folder
cd project_photobooth

# 2. Install packages
npm install
# Wait for "added X packages"

# 3. Create .env
cp .env.example .env

# 4. Edit .env with Supabase credentials
# Use your favorite editor:
# - Visual Studio Code: code .env
# - Notepad: notepad .env
# - Nano: nano .env

# 5. Setup database
npm run db:setup
# Wait for "✓ Database initialized"

# 6. Load test data (optional)
npm run db:seed

# 7. Start server
npm run dev
# Wait for "🚀 Server running on http://localhost:3000"

# 8. In new terminal, test
curl http://localhost:3000/api/health
# Should see: {"success":true,"status":"healthy",...}

# ✅ DONE! Server is running!
```

---

## 📍 IMPORTANT NOTES

- ⚠️ Never commit `.env` file (it has secrets!)
- ⚠️ Always run `npm install` after pulling new code
- ⚠️ Keep server terminal open while developing
- 🔄 Auto-reload happens on file save in dev mode
- 🧪 Use Postman or curl to test endpoints

---

## 📞 NEED HELP?

| Problem | Solution |
|---------|----------|
| Command not found | Check you're in project folder |
| npm: command not found | Install Node.js |
| Port 3000 in use | Use different port: `APP_PORT=3001 npm run dev` |
| Database error | Check .env credentials |
| No face detected | Upload clear face photo |
| Slow processing | Wait or reduce image size |

---

## 🎉 COMMON SUCCESS SIGNS

✅ Server running
```
🚀 Server running on http://localhost:3000
```

✅ API working
```bash
curl http://localhost:3000/api/health
# Returns: {"success":true,"status":"healthy",...}
```

✅ Database connected
```bash
curl http://localhost:3000/api/backgrounds
# Returns: list of backgrounds
```

---

**Ready to code? Start with:**
```bash
npm install
npm run dev
```

**Full commands:** [COMMANDS_REFERENCE.md](COMMANDS_REFERENCE.md)
