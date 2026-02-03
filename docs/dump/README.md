# 📸 Photobooth AI Project

Aplikasi Photobooth berbasis AI dengan processing foto, background replacement, mascot Madiun, dan QR code download menggunakan Supabase sebagai backend database.

## 🚀 MULAI DARI SINI

### 👤 Baru di project ini?
👉 **Baca [CARA_IMPLEMENTASI.md](CARA_IMPLEMENTASI.md)** - Panduan implementasi lengkap dalam Bahasa Indonesia

### 💻 Siap mulai coding?
👉 **Baca [docs/PHASE3_API_IMPLEMENTATION.md](docs/PHASE3_API_IMPLEMENTATION.md)** - API Implementation Guide

### 🎨 Ingin process gambar?
👉 **Baca [docs/PHASE4_IMAGE_PROCESSING.md](docs/PHASE4_IMAGE_PROCESSING.md)** - Image Processing Guide

### 🤖 Face Recognition?
👉 **Baca [docs/MEDIAPIPE_SETUP.md](docs/MEDIAPIPE_SETUP.md)** - FREE Face Detection (MediaPipe)

---

## ✨ Fitur

- 📷 Capture foto dengan multiple frame options
- 🎨 Background replacement dengan tema-tema Madiun
- 🦁 Integrasi mascot/karakter Madiun di foto
- 🤖 AI-powered image processing (Beauty mode, Filters, Effects)
- 😊 Face detection & recognition (FREE dengan MediaPipe!)
- 📱 QR Code generation untuk download link
- 💾 Cloud storage dengan Supabase Storage
- 📊 Analytics & tracking penggunaan
- 📉 Download analytics & tracking
- 🎨 Custom filter library
- 📱 Responsive design

## 🛠️ Tech Stack

- **Backend**: Node.js + Express (Phase 3)
- **Database**: Supabase (PostgreSQL) ✅
- **Storage**: Supabase Storage
- **Image Processing**: Sharp, Jimp (Phase 4)
- **QR Code**: qrcode
- **Face Detection**: MediaPipe (FREE) ✅
- **Authentication**: Supabase Auth
- **Frontend**: React/Vue (Phase 5)

## 📦 Setup Cepat

### 1. Clone & Install
```bash
git clone <repository>
cd project_photobooth
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env
# Edit .env dengan Supabase credentials
```

### 3. Setup Database
```bash
npm run db:setup
```

Lihat [SUPABASE_SETUP.md](./docs/SUPABASE_SETUP.md) untuk detail lengkap.

### 4. Seed Database dengan Background, Mascot & Filter
```bash
npm run db:seed
```

Ini akan menambahkan:
- Pre-defined AI filters
- Background templates Madiun
- Mascots/karakter Madiun

### 5. Jalankan Development
```bash
npm run dev
```

## 📚 Dokumentasi

- [Supabase Setup Guide](./docs/SUPABASE_SETUP.md)
- [Project Structure](./docs/PROJECT_STRUCTURE.md)
- [Background, Mascot & Download Features](./docs/BACKGROUND_MASCOT_DOWNLOAD.md)
- [Image Processing Pipeline](./docs/IMAGE_PROCESSING.md)

## 📊 Database Schema

### Core Tables
- **users** - Data pengguna
- **photo_sessions** - Sesi fotografi
- **photos** - File foto dengan metadata
- **ai_filters** - Filter library

### New Tables (Background & Mascot)
- **background_templates** - Background themes Madiun
- **mascots** - Maskot/karakter Madiun
- **photo_processing** - Track processing status
- **download_links** - QR code & download management
- **download_analytics** - Download tracking & analytics

### Additional Tables
- **face_recognition_data** - Face detection results
- **analytics** - Usage tracking
- **audit_logs** - Activity logs

## 📝 Environment Variables

```env
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Services
OPENAI_API_KEY=your_openai_key
REMOVEBG_API_KEY=your_removebg_key

# Image Processing
IMAGE_MAX_WIDTH=1920
IMAGE_MAX_HEIGHT=1080
IMAGE_QUALITY=95

# Download Configuration
DOWNLOAD_BASE_URL=http://localhost:3000
DOWNLOAD_EXPIRY_HOURS=24

# App Config
NODE_ENV=development
APP_PORT=3000
```

## 🚀 Fitur Utama

### 🎨 Background Replacement
- 5 pre-built background templates dengan tema Madiun
- Support custom backgrounds
- Configurable opacity, blur, dan positioning
- Real-time preview

### 🦁 Mascot Integration
- 3 mascots/karakter Madiun tersedia
- Adjustable positioning (X, Y, width, height, rotation)
- Layer-based composition
- Flip & rotate support

### 📱 QR Code Download
- Auto-generate QR codes untuk setiap foto
- Customizable expiration time
- Download limit management
- Password protection (optional)

### 📊 Download Analytics
- Track total downloads per photo
- Device type tracking
- IP address logging
- Download timeline analytics

## 🔄 Workflow Fotografi

```
1. User membuka photobooth app
2. Pilih background template (Madiun themed)
3. Pilih mascot
4. Ambil foto
5. AI processing:
   - Background replacement
   - Mascot overlay
   - Filter application
   - Face enhancement
6. Generate QR code untuk download
7. User scan QR atau buka link
8. Download foto terproses
9. Track download analytics
```

## 🎯 Services

### Background Service (`src/services/background-service.js`)
- Get all/single backgrounds
- Create/update/delete backgrounds
- Filter by category

### Mascot Service (`src/services/mascot-service.js`)
- Get all/single mascots
- Create/update/delete mascots
- Position configuration

### Download Service (`src/services/download-service.js`)
- Generate QR codes
- Create download links
- Track downloads
- Manage expiration & limits

### Photo Processing Service (`src/services/photo-processing-service.js`)
- Start processing tasks
- Update processing status
- Track progress
- Get pending tasks

## 📈 Roadmap

- [x] Database setup dengan Supabase
- [x] Background templates schema
- [x] Mascot integration schema
- [x] QR code & download links
- [x] Download analytics
- [ ] Image processing pipeline
- [ ] API endpoints
- [ ] Frontend UI
- [ ] Real-time preview
- [ ] Mobile app
- [ ] Share features

## 🔒 Security

- RLS (Row Level Security) di semua tabel
- User authentication via Supabase Auth
- Download link expiration
- Password-protected downloads
- IP tracking untuk fraud detection
- CORS enabled untuk production

## 📄 License

MIT

---

**Status**: 
- Database Setup ✅
- Services Layer ✅ 
- API Development ⏳
- Image Processing Pipeline ⏳
- Frontend ⏳

Dibuat dengan ❤️ untuk Kota Madiun

