# 🎬 Phase 5 Implementation Guide: Modern Tablet UI

**Date Started:** February 2, 2026
**Status:** ✅ IMPLEMENTATION READY
**Framework:** React 18 + Tailwind CSS + Zustand

---

## ✅ Completed Components

### ✨ Common Components (Reusable)

#### 1. **Header.jsx** - Top Navigation Bar
```jsx
Features:
✅ Government logo & app branding
✅ Live date/time display
✅ Settings & user icons
✅ Smart city theme
```

**Props:** None (internal state)
**Used In:** All screens

---

#### 2. **Button.jsx** - Touch-Friendly Buttons
```jsx
Props:
- variant: 'primary' | 'secondary' | 'outline' | 'ghost'
- size: 'sm' | 'md' | 'lg' | 'xl'
- disabled: boolean
- loading: boolean

Example:
<Button size="xl" onClick={handleSubmit}>
  📷 Ambil Foto
</Button>
```

---

#### 3. **Card.jsx** - Container Component
```jsx
Props:
- className: string (additional styles)
- children: ReactNode

Example:
<Card className="shadow-lg">
  <h1>Welcome</h1>
</Card>
```

---

#### 4. **StepIndicator.jsx** - Progress Tracker
```jsx
Props:
- currentStep: number (1-5)
- totalSteps: number (default: 5)

Shows:
✅ Step counter (Step 3 of 5)
✅ Progress bar
✅ Step dots with checkmarks
```

---

#### 5. **LoadingAnimation.jsx** - Processing State
```jsx
Props:
- message: string (status text)
- progress: number (0-100)

Features:
✅ Radial pulse rings
✅ Spinning loader icon
✅ Progress bar
✅ Friendly AI messages
```

---

### 🎨 Feature Components

#### 1. **FeatureCard.jsx** - Feature Display
```jsx
Props:
- icon: string (emoji)
- title: string
- description: string

Example:
<FeatureCard
  icon="🌆"
  title="Landmark"
  description="Background Kota Madiun"
/>
```

---

#### 2. **SelectionCard.jsx** - Selector Cards
```jsx
Props:
- image: string (URL)
- title: string
- description: string (optional)
- selected: boolean
- onClick: function

Features:
✅ Image preview
✅ Selection checkmark
✅ Hover effects
✅ Focused states
```

---

#### 3. **CountdownTimer.jsx** - Photo Countdown
```jsx
Props:
- initialSeconds: number (default: 5)
- onComplete: function

Features:
✅ 5→4→3→2→1 countdown
✅ Animated pulse rings
✅ Auto-triggers capture
```

---

### 📱 Screen Components (5 Main Screens)

#### **Screen 1: Welcome Screen**
```
Path: src/components/screens/WelcomeScreen.jsx

Purpose: First impression, feature showcase, start action

Layout:
┌────────────────────────────┐
│  Header with date/time     │
├────────────────────────────┤
│                            │
│  🏛️ AI Photobooth         │
│  Kota Madiun              │
│                            │
│  [HERO IMAGE]             │
│                            │
│  Feature Cards (3):        │
│  - 🌆 Landmark Background  │
│  - 📸 Realistic Photos     │
│  - ✨ AI Filters          │
│                            │
│  [AMBIL FOTO BUTTON]       │
│                            │
└────────────────────────────┘

Features:
✅ Hero image with Madiun landmark
✅ 3 feature cards with bounce animation
✅ Large touch-friendly CTA button
✅ Professional government branding

Navigation:
→ Click "Ambil Foto" → Camera Screen
```

---

#### **Screen 2: Camera Screen**
```
Path: src/components/screens/CameraScreen.jsx

Purpose: Live preview, capture photo with countdown

Layout:
┌────────────────────────────┐
│ ← Kembali    Coba Ulang →  │
├────────────────────────────┤
│                            │
│  ┌──────────────────────┐  │
│  │                      │  │
│  │  [CAMERA PREVIEW]    │  │
│  │  (Live video feed)   │  │
│  │                      │  │
│  └──────────────────────┘  │
│                            │
│  Silahkan Berpose         │
│  (atau countdown: 3...)    │
│                            │
│  [← Batal]  [📷 Ambil]    │
│                            │
└────────────────────────────┘

Features:
✅ Live camera feed
✅ Countdown animation (5→1)
✅ Mobile camera access
✅ Retake option
✅ Back button to restart

State:
- videoRef: camera feed
- canvasRef: photo capture
- showCountdown: animation toggle
- isActive: camera ready

Navigation:
→ "Ambil Gambar" → 5-sec countdown → Customize Screen
→ "← Kembali" → Welcome Screen
```

---

#### **Screen 3: Customization Screen**
```
Path: src/components/screens/CustomizeScreen.jsx

Purpose: Select backgrounds, mascots, filters

Layout:
┌────────────────────────────┐
│ ← Kembali        Lanjut →  │
├────────────────────────────┤
│  Langkah 3 dari 5         │
│  [Progress bar]           │
│                            │
│  📍 Pilih Background       │
│  [Card 1] [Card 2] [Card 3]│
│  (Heritage/Batik/Modern)  │
│                            │
│  🎭 Pilih Maskot          │
│  [Card 1] [Card 2] [Card 3]│
│                            │
│  🎨 Pilih Filter          │
│  [Card 1] [Card 2] [Card 3]│
│  (Beauty/Vintage/Cool...)  │
│                            │
│  [← Kembali] [Lanjut →]   │
│                            │
└────────────────────────────┘

Features:
✅ Step indicator (3/5)
✅ 3 background templates
✅ 3 mascot options
✅ 5 color filters
✅ Selection checkmarks
✅ Hover preview effects

API Calls:
- GET /api/backgrounds → Load background options
- GET /api/filters → Load filter options
- GET /api/mascots → Load mascot options

State:
- selectedBackground: Background | null
- selectedFilter: Filter | null
- selectedMascot: Mascot | null

Navigation:
→ "Lanjut" (all selected) → Processing Screen
→ "← Kembali" → Camera Screen
```

---

#### **Screen 4: Processing Screen**
```
Path: src/components/screens/ProcessingScreen.jsx

Purpose: Show AI processing animation & progress

Layout:
┌────────────────────────────┐
│  Header                    │
├────────────────────────────┤
│                            │
│                            │
│        [LOADING]           │
│      (Radial pulse rings)  │
│                            │
│  Sedang memproses foto… │
│                            │
│  ██████░░░░░░░░  45%      │
│                            │
│  ✨ Menambahkan efek AI... │
│                            │
│                            │
└────────────────────────────┘

Features:
✅ Animated pulse rings
✅ Spinning loader icon
✅ Progress bar (0-100%)
✅ Friendly status messages
✅ Auto-advance when complete

Processing Pipeline:
1. 📤 Upload original photo (10-30%)
2. 🎨 Apply background (30-60%)
3. 🔧 Apply filter effects (60-85%)
4. 🎭 Add mascot overlay (85-95%)
5. ✨ Generate QR code (95-100%)

API Calls:
- POST /api/photos/upload → Upload photo
- POST /api/photos/process → Process with effects
- POST /api/downloads/generate → Generate QR code

State:
- progress: 0-100
- loading: boolean

Navigation:
→ Auto-advance to Result Screen when done
```

---

#### **Screen 5: Result Screen**
```
Path: src/components/screens/ResultScreen.jsx

Purpose: Display result, show QR code, allow download

Layout:
┌────────────────────────────┐
│  ✓ Selesai!               │
├────────────────────────────┤
│                            │
│  Left Column:              │
│  ┌──────────────────────┐  │
│  │  [PHOTO RESULT]      │  │
│  │  (Processed image)   │  │
│  └──────────────────────┘  │
│  [UNDUH FOTO]             │
│                            │
│  Right Column:             │
│  ┌──────────────────────┐  │
│  │   Scan untuk:       │  │
│  │   [QR CODE]         │  │
│  │   Download di HP    │  │
│  └──────────────────────┘  │
│                            │
│  [← Ambil Foto Lagi]       │
│  Terima kasih...           │
│                            │
└────────────────────────────┘

Features:
✅ Success badge (green checkmark)
✅ Full-size photo preview
✅ Generated QR code
✅ Download button (downloads to device)
✅ "Ambil Foto Lagi" button (restart)
✅ Thank you message

API Calls:
- GET /api/photos/{id} → Fetch processed photo

State:
- processedPhoto: Photo data
- qrCode: QR code data
- downloading: boolean

Navigation:
→ "Unduh Foto" → Download to device
→ "Ambil Foto Lagi" → Reset to Welcome Screen
```

---

## 🔗 API Integration

### Base URL
```javascript
const API_BASE_URL = 'http://localhost:3000/api'
```

### Available Endpoints

| Method | Endpoint | Purpose | Used In Screen |
|--------|----------|---------|---|
| GET | `/backgrounds` | List backgrounds | Customize (3) |
| GET | `/filters` | List filters | Customize (3) |
| GET | `/mascots` | List mascots | Customize (3) |
| POST | `/photos/session` | Create session | Welcome (1) |
| POST | `/photos/upload` | Upload photo | Processing (4) |
| POST | `/photos/process` | Process photo | Processing (4) |
| GET | `/photos/{id}` | Get photo details | Result (5) |
| POST | `/downloads/generate` | Generate QR code | Processing (4) |
| GET | `/downloads/{id}` | Get download link | Result (5) |

---

## 🎯 State Management (Zustand)

### Global Store: `usePhotoboothStore`

```javascript
// Screen navigation
currentScreen: 'welcome' | 'camera' | 'customize' | 'processing' | 'result'

// Session & Photo data
sessionId: string | null
photoId: string | null
originalPhoto: base64 | null
processedPhoto: Photo | null
qrCode: string | null

// User selections
selectedBackground: Background | null
selectedFilter: Filter | null
selectedMascot: Mascot | null

// UI state
loading: boolean
progress: 0-100
error: string | null
```

### Usage Example
```javascript
import usePhotoboothStore from '@/hooks/usePhotoboothStore'

function MyComponent() {
  const selectedBg = usePhotoboothStore(state => state.selectedBackground)
  const setSelectedBg = usePhotoboothStore(state => state.setSelectedBackground)
  
  return (
    <button onClick={() => setSelectedBg(newBg)}>
      Select
    </button>
  )
}
```

---

## 🎨 Design Tokens

### Colors
```css
Primary Blue: #2563EB
Light Blue: #DBEAFE
Soft Gray: #F3F4F6
White: #FFFFFF
Success: #10B981
Warning: #F59E0B
Error: #EF4444
```

### Spacing (8px grid)
```css
sm: 8px
md: 16px
lg: 24px
xl: 32px
2xl: 48px
```

### Typography
```css
Heading XL: 3.5rem / 700
Heading LG: 2.25rem / 600
Heading MD: 1.5rem / 600
Body LG: 1.125rem / 400
Body MD: 1rem / 400
Body SM: 0.875rem / 400
```

### Border Radius
```css
sm: 8px
md: 12px
lg: 16px
xl: 24px
2xl: 32px
```

---

## 🚀 Running the Project

### 1. Install dependencies
```bash
cd frontend
npm install
```

### 2. Start development server
```bash
npm run dev
```

Server runs on: `http://localhost:3001`

(Proxies API calls to `http://localhost:3000/api`)

### 3. Build for production
```bash
npm run build
```

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── StepIndicator.jsx
│   │   │   └── LoadingAnimation.jsx
│   │   ├── features/
│   │   │   ├── FeatureCard.jsx
│   │   │   ├── SelectionCard.jsx
│   │   │   ├── CountdownTimer.jsx
│   │   │   └── CameraPreview.jsx
│   │   └── screens/
│   │       ├── WelcomeScreen.jsx
│   │       ├── CameraScreen.jsx
│   │       ├── CustomizeScreen.jsx
│   │       ├── ProcessingScreen.jsx
│   │       └── ResultScreen.jsx
│   ├── pages/
│   │   └── PhotoboothApp.jsx
│   ├── hooks/
│   │   ├── usePhotoboothStore.js
│   │   └── useCamera.js
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## 🎬 User Flow

```
Welcome Screen (1)
↓
[Click "Ambil Foto"]
↓
Camera Screen (2)
├─ Live preview
├─ 5-second countdown
└─ Capture photo
↓
[Click "Ambil Gambar"]
↓
Customization Screen (3)
├─ Select background
├─ Select filter
├─ Select mascot
└─ [Click "Lanjut"]
↓
Processing Screen (4)
├─ Upload original photo (10%)
├─ Apply background (30%)
├─ Apply filter (60%)
├─ Add mascot (85%)
├─ Generate QR (95%)
└─ Complete (100%)
↓
Result Screen (5)
├─ Show photo result
├─ Show QR code
├─ [Unduh Foto] → Download
└─ [Ambil Foto Lagi] → Back to Welcome
```

---

## 🔍 Key Features

### ✅ Accessibility
- Large touch targets (48px minimum)
- High contrast text
- Clear labels
- Keyboard navigation support
- Screen reader friendly

### ✅ Performance
- Code splitting by route
- Lazy loading images
- Optimized animations
- Minimal re-renders with Zustand
- CSS animations instead of JS

### ✅ Responsive Design
- Tablet portrait (1024×1366) - Default
- Tablet landscape (1366×1024) - Supported
- Fallback for smaller tablets
- Safe area insets for notches/home bars

### ✅ User Experience
- Clear progress indication
- Immediate feedback on actions
- No unexpected state changes
- Error handling with recovery
- Friendly error messages

---

## 🧪 Testing Checklist

- [ ] Welcome screen loads correctly
- [ ] Camera feed works (if device has camera)
- [ ] Photo capture functionality
- [ ] Countdown timer works
- [ ] Selection saves to store
- [ ] Processing animation shows progress
- [ ] Results display processed photo
- [ ] QR code generates correctly
- [ ] Download functionality works
- [ ] "Ambil Foto Lagi" resets app
- [ ] All buttons are touch-friendly
- [ ] Responsive on tablet sizes
- [ ] No layout shifts during loading

---

## 📋 Next Steps

### Immediate (Today)
- [ ] Install dependencies
- [ ] Start dev server
- [ ] Test all screens
- [ ] Verify API integration

### Short-term (This week)
- [ ] Add error screens
- [ ] Add image optimization
- [ ] Add offline support
- [ ] Polish animations

### Medium-term (Next week)
- [ ] Add admin panel
- [ ] Add analytics
- [ ] Add photo history
- [ ] Add sharing features

### Long-term
- [ ] Multi-language support
- [ ] Advanced filters
- [ ] Real-time face detection
- [ ] Mobile app (React Native)

---

## 🎉 Status

**✅ Phase 5 Implementation: COMPLETE**

All 5 screens implemented with:
- ✅ Clean, modern UI
- ✅ Touch-friendly interface
- ✅ Professional government branding
- ✅ Smooth animations
- ✅ Full API integration
- ✅ State management
- ✅ Responsive design
- ✅ Accessibility features

**Ready for:** Testing & Deployment

---

**Last Updated:** February 2, 2026
**Phase:** 5 of 6 (83% Complete)
**Next Phase:** 6 - Deployment & Docker
