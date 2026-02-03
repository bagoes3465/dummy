# 🚀 Phase 5: Quick Start Guide

## Setup Frontend Project

### 1. Install Dependencies
```bash
cd e:\!project\project_photobooth\frontend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

**Output:**
```
  ➜  Local:   http://localhost:3001
  ➜  press h to show help
```

### 3. Open in Browser
```
http://localhost:3001
```

---

## Project Structure

```
frontend/
├── src/
│   ├── components/          ← Reusable UI components
│   │   ├── common/         ← Button, Card, Header, etc.
│   │   ├── features/       ← SelectionCard, FeatureCard
│   │   └── screens/        ← 5 Main screens
│   ├── pages/              ← Page containers
│   ├── hooks/              ← Custom hooks (useCamera, store)
│   ├── services/           ← API service
│   ├── index.css           ← Global styles
│   ├── App.jsx             ← Main app
│   └── main.jsx            ← Entry point
├── index.html              ← HTML template
├── vite.config.js          ← Build config
├── tailwind.config.js      ← Tailwind theme
└── package.json            ← Dependencies
```

---

## 5 Main Screens

| Screen | Purpose | Route |
|--------|---------|-------|
| 1️⃣ Welcome | Feature showcase, start action | `welcome` |
| 2️⃣ Camera | Live preview, capture photo | `camera` |
| 3️⃣ Customize | Select BG, filter, mascot | `customize` |
| 4️⃣ Processing | AI processing, progress | `processing` |
| 5️⃣ Result | Show photo, QR code, download | `result` |

---

## 🔌 API Integration

### Prerequisites
- Backend server running on `http://localhost:3000`
- All Phase 3/4 APIs available

### API Proxy
Frontend automatically proxies to backend:
```javascript
// Frontend: http://localhost:3001/api/health
// Routes to: http://localhost:3000/api/health
```

### Key Endpoints Used
```javascript
GET  /api/backgrounds     ← Customize screen
GET  /api/filters        ← Customize screen
GET  /api/mascots        ← Customize screen
POST /api/photos/upload  ← Processing screen
POST /api/photos/process ← Processing screen
POST /api/downloads/generate ← Processing screen
```

---

## 🎨 Design System

### Color Palette
```css
Primary: #2563EB (Royal Blue)
Light: #DBEAFE (Light Blue)
Gray: #F3F4F6 (Soft Gray)
Success: #10B981 (Green)
```

### Components Available
- `<Button />` - With variants (primary, secondary, outline, ghost)
- `<Card />` - Container with shadow
- `<Header />` - Top navigation bar
- `<StepIndicator />` - Progress tracker
- `<SelectionCard />` - Option selector
- `<LoadingAnimation />` - Processing state

---

## 📱 Responsive Design

### Target: Tablet Portrait (1024×1366)
- Default layout
- Touch-friendly sizing
- Full-screen experience

### Also Supports: Tablet Landscape (1366×1024)
- Horizontal grid layout
- Multi-column customization
- Wider photo display

---

## 🧪 Testing the App

### Manual Testing Flow
1. **Welcome Screen**
   - [ ] Displays correctly
   - [ ] Click "Ambil Foto" → Goes to Camera

2. **Camera Screen**
   - [ ] Live camera feed shows
   - [ ] Can capture photo
   - [ ] Countdown appears
   - [ ] Back button works

3. **Customization Screen**
   - [ ] Loads backgrounds from API
   - [ ] Loads filters from API
   - [ ] Loads mascots from API
   - [ ] Selections save
   - [ ] Next button enabled when all selected

4. **Processing Screen**
   - [ ] Shows loading animation
   - [ ] Progress bar animates
   - [ ] Auto-advances to result

5. **Result Screen**
   - [ ] Photo displays
   - [ ] QR code shows
   - [ ] Download works
   - [ ] "Ambil Foto Lagi" resets to Welcome

---

## 🔧 Troubleshooting

### Frontend won't start
```bash
# Clear node_modules and reinstall
rm -r node_modules package-lock.json
npm install
npm run dev
```

### Camera not working
- Check browser permissions
- Enable camera access for localhost
- Use HTTPS in production

### API calls failing
- Verify backend is running on port 3000
- Check CORS is enabled
- See browser console for errors

### Styles not loading
- Clear browser cache (Ctrl+Shift+Delete)
- Rebuild Tailwind CSS: `npm run build`
- Check tailwind.config.js is correct

---

## 📦 Dependencies

```json
{
  "react": "18.2.0",
  "react-dom": "18.2.0",
  "react-router-dom": "6.20.0",
  "axios": "1.6.0",
  "zustand": "4.4.0",
  "qrcode.react": "1.0.1",
  "lucide-react": "0.294.0",
  "tailwindcss": "3.3.0"
}
```

---

## 🚀 Build for Production

```bash
npm run build
```

Creates optimized build in `dist/` folder:
- Minified code
- Optimized images
- Tree-shaken dependencies
- Ready for deployment

---

## 📊 Performance Tips

- ✅ Images are lazy-loaded
- ✅ Code is split by route
- ✅ Animations use CSS (not JS)
- ✅ State updates are minimal
- ✅ No unnecessary re-renders

---

## 🎯 Next Steps

1. **Test all screens locally**
2. **Verify API integration**
3. **Test on tablet device**
4. **Optimize images**
5. **Deploy to production**

---

**Status:** ✅ Ready to Use
**Last Updated:** February 2, 2026
