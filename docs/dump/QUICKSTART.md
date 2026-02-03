# 🎞️ PHOTOBOOTH AI - MADIUN EDITION

**Setup Database & Services Complete! ✅**

---

## 🚀 FASTEST START (5 MINUTES)

👉 **[QUICK_COMMANDS.md](QUICK_COMMANDS.md)** - All commands on 1 page!

```bash
# 1. Install
npm install

# 2. Configure
cp .env.example .env
# Edit .env with Supabase credentials

# 3. Setup
npm run db:setup

# 4. Run
npm run dev

# 5. Test (in another terminal)
curl http://localhost:3000/api/health
```

---

## 📖 Quick Start

### 1. Setup Database (First Time)
```bash
# Copy environment file
cp .env.example .env

# Edit .env dengan Supabase credentials
# SUPABASE_URL=https://your-project.supabase.co
# SUPABASE_ANON_KEY=your_key
# SUPABASE_SERVICE_ROLE_KEY=your_key

# Setup database
npm run db:setup

# Seed data (backgrounds, mascots, filters)
npm run db:seed
```

### 2. View Documentation
```bash
# Main documentation files:
docs/SUPABASE_SETUP.md           # Supabase setup guide
docs/BACKGROUND_MASCOT_DOWNLOAD.md # Feature documentation
docs/IMAGE_PROCESSING.md          # Image processing guide
docs/INTEGRATION_GUIDE.md         # Integration instructions
docs/EXAMPLE_API_ENDPOINTS.js    # API endpoint examples
```

### 3. Key Files
```
✅ Database Schema: src/database/schema.sql
✅ Services:
   - Background: src/services/background-service.js
   - Mascot: src/services/mascot-service.js
   - Download: src/services/download-service.js
   - Processing: src/services/photo-processing-service.js
```

---

## 📊 What's Included

### Database Tables (5 New)
- `background_templates` - Background themes
- `mascots` - Maskot Madiun
- `photo_processing` - Processing status tracking
- `download_links` - QR codes & download management
- `download_analytics` - Download analytics

### Pre-seeded Data
- **5 Backgrounds**: Madiun Landmark, Culture, Festival, Studio, Bokeh
- **3 Mascots**: Roro Jonggrang, Classic, Cultural Figure
- **5 Filters**: Beauty, Vintage, Cool Tone, B&W, Bokeh

### Services (4 Ready-to-Use)
| Service | Purpose |
|---------|---------|
| Background Service | CRUD backgrounds |
| Mascot Service | CRUD mascots |
| Download Service | QR code + download management |
| Photo Processing Service | Track processing status |

---

## 🎯 Next Steps

### Phase 1: API Endpoints ⏳
```bash
# Copy template from:
docs/EXAMPLE_API_ENDPOINTS.js

# Create your Express server:
src/index.js
src/routes/photobooth-routes.js
```

### Phase 2: Image Processing ⏳
```bash
# Follow guide:
docs/IMAGE_PROCESSING.md

# Create service:
src/services/image-processing-service.js

# Install dependencies:
npm install sharp jimp
```

### Phase 3: Frontend ⏳
```bash
# Call API endpoints:
GET /api/backgrounds     # Get all backgrounds
GET /api/mascots        # Get all mascots
POST /api/photos/:id/process  # Process photo
POST /api/photos/:id/generate-qr # Get QR code
```

---

## 📋 Documentation Structure

```
Root Documentation:
├── README.md (main project overview)
├── SETUP_SUMMARY.md (what's been completed)
├── IMPLEMENTATION_CHECKLIST.md (tasks & timeline)

Detailed Guides:
├── docs/SUPABASE_SETUP.md
├── docs/BACKGROUND_MASCOT_DOWNLOAD.md
├── docs/IMAGE_PROCESSING.md
├── docs/INTEGRATION_GUIDE.md
├── docs/EXAMPLE_API_ENDPOINTS.js
└── docs/PROJECT_STRUCTURE.md
```

---

## 🎬 Features

### 🎨 Background Replacement
- Swap background dengan tema Madiun
- Customizable opacity & blur
- Easy to add more templates

### 🦁 Mascot Integration
- Add Madiun mascots to photos
- Adjustable positioning & size
- Support rotation & effects

### 📱 QR Code Download
- Auto-generate QR codes
- Download link management
- Analytics tracking
- Expiration control

---

## 🔑 Key Environment Variables

```env
# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Image Processing
IMAGE_MAX_WIDTH=1920
IMAGE_MAX_HEIGHT=1080
IMAGE_QUALITY=95

# Download
DOWNLOAD_BASE_URL=http://localhost:3000
DOWNLOAD_EXPIRY_HOURS=24

# App
NODE_ENV=development
APP_PORT=3000
```

---

## 📦 Dependencies

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.38.4",
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "multer": "^1.4.5-lts.1",
    "uuid": "^9.0.0",
    "qrcode": "^1.5.3",
    "sharp": "^0.33.1",
    "jimp": "^0.22.10"
  }
}
```

---

## 🗄️ Database Design

```
┌─────────────┐
│   Photos    │◄────────┬────────────────────┐
└────┬────────┘         │                    │
     │ 1:N              │                    │
     │                  │                    │
┌────▼────────────────────┐   ┌──────┐  ┌──────────┐
│ PhotoProcessing         │   │Backgr│  │Mascots  │
│ (background + mascot)   │──►│ound  │  │         │
└────┬────────────────────┘   └──────┘  └──────────┘
     │ 1:N
     │
┌────▼──────────┐
│DownloadLinks  │◄─── QR Codes + Download Management
│ (QR + tracks) │
└────┬──────────┘
     │ 1:N
     │
┌────▼──────────────┐
│DownloadAnalytics  │◄─── User tracking & analytics
└───────────────────┘
```

---

## 🚀 Typical Workflow

```
1. User opens app
   ↓
2. Select background (GET /api/backgrounds)
   ↓
3. Select mascot (GET /api/mascots)
   ↓
4. Take photo (capture from camera)
   ↓
5. Process photo (POST /api/photos/:id/process)
   - Background removal
   - Background replacement
   - Mascot overlay
   - Filter application
   ↓
6. Generate QR code (POST /api/photos/:id/generate-qr)
   ↓
7. User scans QR or opens link
   ↓
8. Download processed photo
   ↓
9. Analytics tracked
```

---

## 🔒 Security Features

✅ RLS (Row Level Security) on all tables
✅ QR code expiration (24h default)
✅ Download limits per link
✅ Optional password protection
✅ IP tracking for analytics
✅ Audit logging

---

## 📊 Monitoring & Analytics

Track:
- Total downloads per photo
- Download by device type
- Download timeline
- Processing success/failure rate
- User engagement metrics

---

## 🆘 Quick Help

### "Database not connecting?"
→ Check SUPABASE_URL & SUPABASE_SERVICE_ROLE_KEY in .env

### "QR code not generating?"
→ Verify qrcode package installed (npm install qrcode)

### "Background image not loading?"
→ Check image_url is valid and publicly accessible

### "Mascot positioning wrong?"
→ Adjust position_config (x, y, width, height, rotation)

---

## 📚 Learning Resources

| Topic | Resource |
|-------|----------|
| Supabase | [supabase.com/docs](https://supabase.com/docs) |
| Sharp | [sharp.pixelplumbing.com](https://sharp.pixelplumbing.com/) |
| Jimp | [github.com/jimp-dev/jimp](https://github.com/jimp-dev/jimp) |
| QR Codes | [davidshimjs.github.io/qrcodejs](https://davidshimjs.github.io/qrcodejs/) |
| Express | [expressjs.com](https://expressjs.com/) |

---

## 📞 Support

For detailed information, check the `docs/` folder:
- Setup issues → `docs/SUPABASE_SETUP.md`
- Feature questions → `docs/BACKGROUND_MASCOT_DOWNLOAD.md`
- Image processing → `docs/IMAGE_PROCESSING.md`
- Integration → `docs/INTEGRATION_GUIDE.md`
- API examples → `docs/EXAMPLE_API_ENDPOINTS.js`

---

## ✅ Completed Tasks

- [x] Database schema designed
- [x] Services created (Background, Mascot, Download, Processing)
- [x] Seed data prepared
- [x] Documentation written
- [x] Example code provided

---

## ⏳ What's Next

1. **API Endpoints** - Implement Express routes
2. **Image Processing** - Setup Sharp/Jimp pipeline
3. **Frontend** - Build React/Vue UI
4. **Testing** - Unit & integration tests
5. **Deployment** - Production setup

---

## 🎉 Status

```
✅ Database Setup
✅ Services Layer
✅ Documentation
⏳ API Implementation
⏳ Image Processing
⏳ Frontend Development
```

---

## 📝 License

MIT

---

**Photobooth AI - Powered by Supabase & Madiun Pride** 🦁

*For questions or contributions, refer to documentation in `docs/` folder*

Last Updated: February 2, 2026
