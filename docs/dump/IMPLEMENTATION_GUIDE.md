# 🛠️ IMPLEMENTATION GUIDE - QUICK START

**Panduan lengkap untuk implementasi Photobooth AI project**

---

## 📊 IMPLEMENTATION ROADMAP

```
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE ✅ COMPLETE                       │
│     (Schema, Seed Data, Supabase Connection Ready)           │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                    SERVICES ✅ COMPLETE                       │
│     (Background, Mascot, Download, Face Recognition)         │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│              PHASE 3: API IMPLEMENTATION ⏳ TODO (7 days)     │
│   • Express server setup                                     │
│   • Route handlers                                           │
│   • Middleware configuration                                 │
│   • Error handling                                           │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│          PHASE 4: IMAGE PROCESSING ⏳ TODO (10 days)         │
│   • Sharp image manipulation                                 │
│   • Background removal                                       │
│   • Mascot overlay compositing                               │
│   • Filter effects application                               │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│            PHASE 5: FRONTEND ⏳ TODO (14 days)               │
│   • React/Vue components                                     │
│   • Camera capture                                           │
│   • UI controls                                              │
│   • Real-time preview                                        │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│         PHASE 6-7: TESTING & DEPLOY ⏳ TODO (10 days)        │
│   • Unit tests                                               │
│   • Integration tests                                        │
│   • Docker setup                                             │
│   • Cloud deployment                                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 PHASE 3: API IMPLEMENTATION (7 DAYS)

### What You'll Build
- Express.js server
- REST API endpoints (25+)
- Middleware stack
- Error handling

### Step-by-Step Guide

**⏱️ Total Time: 7 days**

#### Day 1-2: Server Setup
1. Create `src/index.js` (main server)
2. Setup Express & middleware
3. Configure multer for file uploads
4. Test server startup

**Reference**: [docs/PHASE3_API_IMPLEMENTATION.md](docs/PHASE3_API_IMPLEMENTATION.md#step-1-create-main-server-file)

#### Day 3-4: Route Implementation
1. Create `src/routes/photobooth-routes.js`
2. Implement background endpoints (GET, list)
3. Implement mascot endpoints (GET, list)
4. Implement face recognition endpoints

**Reference**: [docs/PHASE3_API_IMPLEMENTATION.md](docs/PHASE3_API_IMPLEMENTATION.md#step-4-create-main-api-routes)

#### Day 5: Face Recognition Integration
1. Add face analyze endpoint
2. Add batch analysis endpoint
3. Setup photo sessions
4. Test face detection

**Reference**: [docs/MEDIAPIPE_SETUP.md](docs/MEDIAPIPE_SETUP.md)

#### Day 6: Download & QR Routes
1. Add QR code generation endpoint
2. Add download link tracking
3. Add analytics endpoints
4. Test download flow

**Reference**: [docs/PHASE3_API_IMPLEMENTATION.md](docs/PHASE3_API_IMPLEMENTATION.md#-download-endpoints)

#### Day 7: Testing & Debugging
1. Test all endpoints
2. Fix bugs
3. Add error handling
4. Performance optimization

**Reference**: [docs/PHASE3_API_IMPLEMENTATION.md](docs/PHASE3_API_IMPLEMENTATION.md#step-5-testing-endpoints)

---

## 🎨 PHASE 4: IMAGE PROCESSING (10 DAYS)

### What You'll Build
- Image processing pipeline
- Background removal
- Mascot overlay
- Filter effects
- Output optimization

### Step-by-Step Guide

**⏱️ Total Time: 10 days**

#### Day 1-2: Image Service Foundation
1. Create `src/services/image-processing-service.js`
2. Setup Sharp library
3. Create directory structure (`uploads/temp`, `uploads/processed`)
4. Test basic image loading

**Reference**: [docs/PHASE4_IMAGE_PROCESSING.md](docs/PHASE4_IMAGE_PROCESSING.md#step-1-create-image-processing-service)

#### Day 3-4: Pipeline Architecture
1. Design processing workflow
2. Implement face detection integration
3. Setup error handling
4. Create logging

**Reference**: [docs/PHASE4_IMAGE_PROCESSING.md](docs/PHASE4_IMAGE_PROCESSING.md#architecture)

#### Day 5-6: Background Processing
1. Implement background removal (edge detection method)
2. Add background template application
3. Handle different image sizes
4. Test with various backgrounds

**Reference**: [docs/PHASE4_IMAGE_PROCESSING.md](docs/PHASE4_IMAGE_PROCESSING.md#-apply-background-template)

#### Day 7-8: Mascot Overlay & Effects
1. Implement mascot overlay
2. Add position calculation
3. Implement rotation/flip
4. Add filter effects (beauty, vintage, BW, cool, bokeh)

**Reference**: [docs/PHASE4_IMAGE_PROCESSING.md](docs/PHASE4_IMAGE_PROCESSING.md#-overlay-mascot-on-top-of-photo)

#### Day 9: Performance & Optimization
1. Optimize image quality
2. Implement batch processing
3. Add caching
4. Performance testing

**Reference**: [docs/PHASE4_IMAGE_PROCESSING.md](docs/PHASE4_IMAGE_PROCESSING.md#performance-tips)

#### Day 10: Integration & Testing
1. Hook into API endpoints
2. End-to-end testing
3. Fix issues
4. Performance tuning

**Reference**: [docs/PHASE4_IMAGE_PROCESSING.md](docs/PHASE4_IMAGE_PROCESSING.md#step-2-add-image-processing-route)

---

## 👨‍💻 CODE IMPLEMENTATION EXAMPLE

### Phase 3 Quick Start (Copy-Paste)

**1. Create src/index.js**
```bash
# Copy template from docs
cat docs/PHASE3_API_IMPLEMENTATION.md | grep -A 100 "STEP 1:" > src/index.js
```

**2. Create src/routes/photobooth-routes.js**
- Copy from `docs/EXAMPLE_API_ENDPOINTS.js`
- Or follow `docs/PHASE3_API_IMPLEMENTATION.md#step-4`

**3. Run server**
```bash
npm run dev
```

**4. Test endpoints**
```bash
curl http://localhost:3000/api/health
```

### Phase 4 Quick Start

**1. Create image service**
```bash
# Copy from docs/PHASE4_IMAGE_PROCESSING.md
```

**2. Add processing route**
```javascript
router.post('/api/photos/process', upload.single('photo'), async (req, res) => {
  const result = await imageProcessing.processPhoto(req.file.buffer, {
    photoId: req.body.photo_id,
    backgroundId: req.body.background_id,
    mascotId: req.body.mascot_id,
    filterId: req.body.filter_id
  });
  res.json(result);
});
```

**3. Test**
```bash
curl -X POST http://localhost:3000/api/photos/process \
  -F "photo=@photo.jpg" \
  -F "background_id=bg-001"
```

---

## 📋 IMPLEMENTATION CHECKLIST

### PHASE 3: API
- [ ] Create `src/index.js` (Express server)
- [ ] Create `src/routes/photobooth-routes.js`
- [ ] Create `src/routes/health-routes.js`
- [ ] Test server startup
- [ ] Implement GET `/api/backgrounds`
- [ ] Implement GET `/api/mascots`
- [ ] Implement POST `/api/photos/analyze-face`
- [ ] Implement POST `/api/downloads/generate-qr`
- [ ] Add error handling middleware
- [ ] Add CORS middleware
- [ ] Test all endpoints with curl/Postman
- [ ] Performance check
- [ ] Documentation update

### PHASE 4: IMAGE PROCESSING
- [ ] Create `src/services/image-processing-service.js`
- [ ] Setup Sharp library integration
- [ ] Implement background removal
- [ ] Implement background application
- [ ] Implement mascot overlay
- [ ] Implement filter effects
- [ ] Create `uploads/temp` & `uploads/processed` directories
- [ ] Add image processing route
- [ ] Add batch processing
- [ ] Test with various images
- [ ] Performance optimization
- [ ] Error handling
- [ ] Documentation update

---

## 🔧 TOOLS & LIBRARIES YOU'LL USE

### Phase 3
```json
{
  "express": "Web framework",
  "multer": "File upload handling",
  "cors": "Cross-origin requests",
  "dotenv": "Environment variables"
}
```

### Phase 4
```json
{
  "sharp": "High-performance image processing",
  "jimp": "Image compositing (alternative)",
  "fs": "File system operations",
  "@mediapipe/tasks-vision": "Face detection"
}
```

---

## 📚 DOCUMENTATION FILES

| Phase | Documentation | Purpose |
|-------|---------------|---------|
| 3 | [docs/PHASE3_API_IMPLEMENTATION.md](docs/PHASE3_API_IMPLEMENTATION.md) | Complete API guide |
| 3 | [docs/EXAMPLE_API_ENDPOINTS.js](docs/EXAMPLE_API_ENDPOINTS.js) | API templates |
| 4 | [docs/PHASE4_IMAGE_PROCESSING.md](docs/PHASE4_IMAGE_PROCESSING.md) | Complete image processing guide |
| 4 | [docs/IMAGE_PROCESSING.md](docs/IMAGE_PROCESSING.md) | Advanced processing guide |

---

## ✅ TESTING STRATEGY

### Phase 3: API Testing
```bash
# Test server
curl http://localhost:3000/api/health

# Test upload
curl -X POST http://localhost:3000/api/photos/analyze-face \
  -F "photo=@test.jpg"

# Test QR generation
curl -X POST http://localhost:3000/api/downloads/generate-qr \
  -H "Content-Type: application/json" \
  -d '{"photo_id":"test-1"}'
```

### Phase 4: Image Processing Testing
```bash
# Test basic processing
curl -X POST http://localhost:3000/api/photos/process \
  -F "photo=@test.jpg" \
  -F "background_id=bg-001"

# Test with all options
curl -X POST http://localhost:3000/api/photos/process \
  -F "photo=@test.jpg" \
  -F "background_id=bg-001" \
  -F "mascot_id=mascot-001" \
  -F "filter_id=beauty"
```

---

## 🚀 QUICK START (FASTEST PATH)

### If you want to skip ahead (risky):
1. Copy `docs/EXAMPLE_API_ENDPOINTS.js` → `src/routes/photobooth-routes.js`
2. Create minimal `src/index.js`
3. Run `npm run dev`

**Note**: You'll miss important details and error handling!

### Recommended (safe):
1. Follow [docs/PHASE3_API_IMPLEMENTATION.md](docs/PHASE3_API_IMPLEMENTATION.md) step-by-step
2. Build incrementally
3. Test each endpoint
4. Then move to Phase 4

---

## 💡 COMMON MISTAKES TO AVOID

1. ❌ Not handling file uploads properly
2. ❌ Missing CORS setup
3. ❌ Not validating input parameters
4. ❌ Poor error messages
5. ❌ Not testing endpoints before moving on
6. ❌ Hardcoding paths instead of using .env
7. ❌ Not optimizing images before processing
8. ❌ Missing database transaction handling

---

## 🎯 SUCCESS CRITERIA

### Phase 3 Complete When:
- ✅ All API endpoints respond correctly
- ✅ File uploads work
- ✅ Error handling in place
- ✅ Can analyze photos
- ✅ Can generate QR codes
- ✅ CORS working

### Phase 4 Complete When:
- ✅ Image processing pipeline works
- ✅ Background removal works (or skipped gracefully)
- ✅ Mascot overlay works
- ✅ Filters apply correctly
- ✅ Output images saved properly
- ✅ Batch processing works
- ✅ Performance acceptable

---

## 📞 NEED HELP?

| Issue | Solution |
|-------|----------|
| Port already in use | Change `APP_PORT` in .env |
| Module not found | Run `npm install` |
| CORS error | Check CORS middleware setup |
| File upload fails | Check `multer` config, increase file size limit |
| Image processing slow | Reduce image resolution first |
| Face not detected | Check image quality, face size |
| Mascot not visible | Check z-index, position calculation |

---

## 🎉 NEXT STEPS

After completing Phase 3 & 4:

1. **Phase 5**: Frontend Development (React/Vue)
2. **Phase 6**: Testing (unit, integration, E2E)
3. **Phase 7**: Deployment (Docker, Cloud)

---

## 📞 CONTACT & RESOURCES

- **API Templates**: [docs/EXAMPLE_API_ENDPOINTS.js](docs/EXAMPLE_API_ENDPOINTS.js)
- **Architecture**: [ARCHITECTURE_OVERVIEW.md](ARCHITECTURE_OVERVIEW.md) (if exists)
- **Face Recognition**: [docs/MEDIAPIPE_SETUP.md](docs/MEDIAPIPE_SETUP.md)
- **Database**: [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md)

---

**Ready to implement? Start with [docs/PHASE3_API_IMPLEMENTATION.md](docs/PHASE3_API_IMPLEMENTATION.md)!**

🚀 **Let's build the Photobooth AI!**
