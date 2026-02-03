# 🚀 Photobooth AI - API Implementation Guide

**Duration:** 7 days | **Status:** Ready to Implement
**Tech Stack:** Node.js + Express | **Database:** Supabase (PostgreSQL)

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [API Endpoints](#api-endpoints)
3. [Day-by-Day Implementation](#day-by-day-implementation)
4. [Code Structure](#code-structure)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)

---

## ⚡ Quick Start

```bash
# 1. Create main server file
npm run dev

# 2. Should see:
# ✅ Server running on http://localhost:3000
# ✅ Database connected

# 3. Test API
curl http://localhost:3000/api/health
# Response: { status: 'ok', timestamp: '2026-02-02T...' }
```

---

## 🔌 API Endpoints (Lengkap)

### Authentication & Health
```
GET /api/health                    → Server status check
POST /api/auth/register            → Register user (Phase 3+)
POST /api/auth/login               → Login user (Phase 3+)
```

### Backgrounds & Templates
```
GET /api/backgrounds               → List semua backgrounds
GET /api/backgrounds/:id           → Get specific background
GET /api/backgrounds/category/:cat → Filter by category (madiun, studio, etc)
```

### Mascots
```
GET /api/mascots                   → List semua mascots
GET /api/mascots/:id              → Get specific mascot
GET /api/mascots/active           → List mascots aktif
```

### AI Filters
```
GET /api/filters                   → List semua filters
GET /api/filters/:id              → Get specific filter
GET /api/filters/active           → List filters aktif
```

### Photo Processing (Core Feature)
```
POST /api/photo/upload            → Upload foto + background
POST /api/photo/process           → Process dengan filter/mascot
GET /api/photo/:session_id        → Get photo by session
GET /api/photo/session/:id        → Get all photos in session
DELETE /api/photo/:id             → Delete photo
```

### Download & QR Code
```
POST /api/download/generate       → Generate download link dengan QR
GET /api/download/:link_id        → Get download info
GET /api/download/:link_id/file   → Download foto (+ frame, watermark)
GET /api/analytics                → Analytics dashboard
```

---

## 📅 Day-by-Day Implementation

### **DAY 1: Project Setup & Server Initialization**

**Goals:**
- ✅ Create `src/index.js` (main server)
- ✅ Setup Express middleware
- ✅ Create `/api/health` endpoint
- ✅ Test server startup

**Tasks:**

1. Create `src/index.js`:
```bash
# File: src/index.js
mkdir -p src/routes src/controllers src/middleware src/utils
touch src/index.js src/routes/backgrounds.js src/routes/photos.js
```

2. Add to `src/index.js`:
```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.APP_PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: 'connected'
  });
});

// Routes (akan ditambah nanti)
app.use('/api/backgrounds', require('./routes/backgrounds'));
app.use('/api/mascots', require('./routes/mascots'));
app.use('/api/filters', require('./routes/filters'));
app.use('/api/photos', require('./routes/photos'));
app.use('/api/downloads', require('./routes/downloads'));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📊 API docs: http://localhost:${PORT}/api/docs`);
});

module.exports = app;
```

3. Update `package.json` scripts:
```json
{
  "scripts": {
    "dev": "node src/index.js",
    "start": "NODE_ENV=production node src/index.js",
    "test": "jest",
    "db:setup": "node src/database/setup.js",
    "db:seed": "node src/database/seed.js"
  }
}
```

**Testing:**
```bash
npm run dev
# ✅ Should see: Server running on http://localhost:3000

# Test in another terminal
curl http://localhost:3000/api/health
# Response: { status: 'ok', timestamp: '...', database: 'connected' }
```

---

### **DAY 2: Backgrounds & Mascots Endpoints**

**Goals:**
- ✅ `/api/backgrounds` - List, filter, get by ID
- ✅ `/api/mascots` - List, get by ID
- ✅ Query optimization dengan database

**File: `src/routes/backgrounds.js`**
```javascript
const express = require('express');
const supabase = require('../database/supabase-client');
const router = express.Router();

// GET all backgrounds
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    
    let query = supabase.from('background_templates').select('*');
    
    if (category) {
      query = query.eq('category', category);
    }
    
    query = query.eq('is_active', true);
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    res.json({
      success: true,
      count: data.length,
      data: data
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET specific background
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('background_templates')
      .select('*')
      .eq('id', req.params.id)
      .single();
    
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Background not found' });
    
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

**File: `src/routes/mascots.js`**
```javascript
const express = require('express');
const supabase = require('../database/supabase-client');
const router = express.Router();

// GET all mascots
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('mascots')
      .select('*')
      .eq('is_active', true);
    
    if (error) throw error;
    
    res.json({
      success: true,
      count: data.length,
      data
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET specific mascot
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('mascots')
      .select('*')
      .eq('id', req.params.id)
      .single();
    
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Mascot not found' });
    
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

**Testing:**
```bash
curl http://localhost:3000/api/backgrounds
curl http://localhost:3000/api/backgrounds?category=madiun
curl http://localhost:3000/api/mascots
```

---

### **DAY 3: Filters & Photo Endpoints**

**Goals:**
- ✅ `/api/filters` endpoint
- ✅ `/api/photos` - Upload foto
- ✅ Basic photo session management

**File: `src/routes/filters.js`**
```javascript
const express = require('express');
const supabase = require('../database/supabase-client');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('ai_filters')
      .select('*')
      .eq('is_active', true);
    
    if (error) throw error;
    
    res.json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('ai_filters')
      .select('*')
      .eq('id', req.params.id)
      .single();
    
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Filter not found' });
    
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

**File: `src/routes/photos.js`**
```javascript
const express = require('express');
const supabase = require('../database/supabase-client');
const faceRecognitionService = require('../services/face-recognition-service');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// Create photo session
router.post('/session', async (req, res) => {
  try {
    const session_id = uuidv4();
    const { user_id, background_id, filter_id } = req.body;
    
    const { data, error } = await supabase
      .from('photo_sessions')
      .insert({
        session_id,
        user_id: user_id || null,
        background_id: background_id || null,
        filter_id: filter_id || null,
        created_at: new Date().toISOString()
      })
      .select();
    
    if (error) throw error;
    
    res.json({ success: true, session_id, data: data[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload & process photo
router.post('/upload', async (req, res) => {
  try {
    const { session_id, image_base64, background_id, filter_id } = req.body;
    
    if (!session_id || !image_base64) {
      return res.status(400).json({ error: 'session_id dan image_base64 required' });
    }
    
    // Detect faces
    const faces = await faceRecognitionService.detectFaces(image_base64);
    
    // Store photo metadata
    const photo_id = uuidv4();
    const { data, error } = await supabase
      .from('photos')
      .insert({
        photo_id,
        session_id,
        original_image_path: `uploads/${photo_id}.jpg`,
        processed_image_path: `uploads/${photo_id}_processed.jpg`,
        background_id,
        filter_id,
        face_count: faces.length,
        created_at: new Date().toISOString()
      })
      .select();
    
    if (error) throw error;
    
    res.json({
      success: true,
      photo_id,
      session_id,
      faces_detected: faces.length,
      data: data[0]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get photos by session
router.get('/session/:session_id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .eq('session_id', req.params.session_id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    res.json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

**Testing:**
```bash
# Create session
curl -X POST http://localhost:3000/api/photos/session \
  -H "Content-Type: application/json" \
  -d '{"background_id": 1}'

# Upload photo (need base64 image data)
curl -X POST http://localhost:3000/api/photos/upload \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "xxx",
    "image_base64": "data:image/jpeg;base64,...",
    "background_id": 1
  }'
```

---

### **DAY 4: Download & QR Code Endpoints**

**Goals:**
- ✅ `/api/downloads` - Generate download link
- ✅ QR code generation
- ✅ File delivery (foto + watermark)

**File: `src/routes/downloads.js`**
```javascript
const express = require('express');
const supabase = require('../database/supabase-client');
const downloadService = require('../services/download-service');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// Generate download link
router.post('/generate', async (req, res) => {
  try {
    const { photo_id, session_id } = req.body;
    
    if (!photo_id) {
      return res.status(400).json({ error: 'photo_id required' });
    }
    
    const link_id = uuidv4();
    const download_url = `http://localhost:${process.env.APP_PORT}/api/downloads/${link_id}/file`;
    
    // Generate QR code
    const qr_data = await downloadService.generateQRCode(download_url);
    
    // Store download link
    const { data, error } = await supabase
      .from('download_links')
      .insert({
        link_id,
        photo_id,
        session_id,
        qr_code_data: qr_data,
        download_url,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        created_at: new Date().toISOString()
      })
      .select();
    
    if (error) throw error;
    
    res.json({
      success: true,
      link_id,
      download_url,
      qr_code: qr_data,
      expires_in_days: 7
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Download file
router.get('/:link_id/file', async (req, res) => {
  try {
    const { data: linkData, error: linkError } = await supabase
      .from('download_links')
      .select('*')
      .eq('link_id', req.params.link_id)
      .single();
    
    if (linkError || !linkData) {
      return res.status(404).json({ error: 'Download link not found or expired' });
    }
    
    // Check expiry
    if (new Date(linkData.expires_at) < new Date()) {
      return res.status(410).json({ error: 'Download link expired' });
    }
    
    // Get photo
    const { data: photoData, error: photoError } = await supabase
      .from('photos')
      .select('*')
      .eq('photo_id', linkData.photo_id)
      .single();
    
    if (photoError) throw photoError;
    
    // TODO: Stream file from storage
    // For now, return placeholder
    res.json({
      success: true,
      photo_id: photoData.photo_id,
      message: 'File download ready'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

---

### **DAY 5: Error Handling & Validation**

**Goals:**
- ✅ Middleware untuk validation
- ✅ Error handling global
- ✅ Input sanitization

**File: `src/middleware/validation.js`**
```javascript
// Validate photo upload
const validatePhotoUpload = (req, res, next) => {
  const { session_id, image_base64 } = req.body;
  
  if (!session_id) {
    return res.status(400).json({ error: 'session_id required' });
  }
  
  if (!image_base64) {
    return res.status(400).json({ error: 'image_base64 required' });
  }
  
  if (!image_base64.startsWith('data:image')) {
    return res.status(400).json({ error: 'Invalid image format' });
  }
  
  next();
};

module.exports = { validatePhotoUpload };
```

---

### **DAY 6: Testing & Documentation**

**Goals:**
- ✅ API testing (manual + automated)
- ✅ Generate API docs
- ✅ Create postman collection

**Testing Script: `tests/api.test.js`**
```javascript
const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

describe('Photobooth API', () => {
  test('Health check', async () => {
    const res = await axios.get(`${BASE_URL}/health`);
    expect(res.data.status).toBe('ok');
  });
  
  test('Get backgrounds', async () => {
    const res = await axios.get(`${BASE_URL}/backgrounds`);
    expect(res.data.success).toBe(true);
    expect(Array.isArray(res.data.data)).toBe(true);
  });
  
  test('Get mascots', async () => {
    const res = await axios.get(`${BASE_URL}/mascots`);
    expect(res.data.success).toBe(true);
  });
});
```

---

### **DAY 7: Optimization & Deployment Setup**

**Goals:**
- ✅ Performance optimization
- ✅ Caching strategy
- ✅ Production checklist
- ✅ Deployment prep

**Optimization checklist:**
- [ ] Add request caching (Redis optional)
- [ ] Add rate limiting
- [ ] Add request logging
- [ ] Add CORS security
- [ ] Add authentication tokens
- [ ] Test with load testing tool
- [ ] Add API versioning (/api/v1/)
- [ ] Document API endpoints

---

## 🏗️ Code Structure

```
src/
├── index.js                    ← Main server file
├── routes/                     ← API endpoints
│   ├── backgrounds.js
│   ├── mascots.js
│   ├── filters.js
│   ├── photos.js
│   └── downloads.js
├── controllers/                ← Business logic (future)
├── middleware/                 ← Express middleware
│   └── validation.js
├── utils/                      ← Helper functions
├── services/                   ← Existing services
│   ├── face-recognition-service.js
│   ├── background-service.js
│   ├── mascot-service.js
│   ├── download-service.js
│   └── photo-processing-service.js
└── database/
    ├── supabase-client.js
    ├── schema.sql
    └── seed.js
```

---

## 🧪 Testing

### Manual Testing
```bash
# Health check
curl http://localhost:3000/api/health

# Get backgrounds
curl http://localhost:3000/api/backgrounds

# Get with filter
curl "http://localhost:3000/api/backgrounds?category=madiun"

# Create session
curl -X POST http://localhost:3000/api/photos/session \
  -H "Content-Type: application/json" \
  -d '{"background_id": 1}'

# Upload photo
curl -X POST http://localhost:3000/api/photos/upload \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "SESSION_ID_HERE",
    "image_base64": "data:image/jpeg;base64,/9j/...",
    "background_id": 1
  }'
```

### Automated Testing
```bash
npm test

# With coverage
npm test -- --coverage
```

---

## 🐛 Troubleshooting

### Issue: "Cannot find module '@supabase/supabase-js'"
```bash
npm install @supabase/supabase-js
```

### Issue: "CORS error"
Pastikan middleware CORS sudah ada di index.js:
```javascript
const cors = require('cors');
app.use(cors());
```

### Issue: "Database connection error"
Cek `.env` file punya SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY

### Issue: Port already in use
```bash
# Change port in .env
APP_PORT=3001

# Or kill existing process
npx lsof -i :3000
kill -9 <PID>
```

---

## ✅ Completion Checklist

- [ ] `/api/health` working
- [ ] `/api/backgrounds` returning data
- [ ] `/api/mascots` returning data
- [ ] `/api/filters` returning data
- [ ] `/api/photos/session` creating sessions
- [ ] `/api/photos/upload` processing uploads
- [ ] `/api/downloads/generate` creating download links
- [ ] Error handling working
- [ ] CORS enabled
- [ ] All tests passing

---

## 📞 Next Steps

After API Implementation complete:

1. **Phase 4: Image Processing** (10 days)
   - Implement background removal
   - Add filter effects
   - Generate watermarked images

2. **Phase 5: Frontend** (7+ days)
   - React UI
   - Camera integration
   - Photo gallery

3. **Phase 6: Deployment** (3 days)
   - Docker setup
   - Cloud hosting
   - Production configuration

---

**Ready? Start with Day 1:** `npm run dev` 🚀
