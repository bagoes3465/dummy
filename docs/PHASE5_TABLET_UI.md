# 📱 Phase 5: Modern Tablet UI - AI Photobooth Kota Madiun

**Duration:** 7 days | **Status:** Implementation Starting
**Tech Stack:** React 18 + Tailwind CSS | **Target:** Tablet Portrait (1024x1366)

---

## 🎨 Design System

### Color Palette
```css
/* Primary Colors */
--primary-blue: #2563EB      /* Royal Blue - Main CTA */
--light-blue: #DBEAFE       /* Light Blue - Backgrounds */
--soft-gray: #F3F4F6        /* Soft Gray - Cards */
--white: #FFFFFF            /* Clean backgrounds */

/* Status Colors */
--success: #10B981          /* Green - Complete */
--processing: #F59E0B       /* Yellow - Loading */
--error: #EF4444            /* Red - Error */
--neutral: #6B7280          /* Gray - Disabled */
```

### Typography
```css
/* Font: Inter / SF Pro / Poppins */
--heading-xl: 3.5rem (700)   /* Main titles */
--heading-lg: 2.25rem (600)  /* Screen titles */
--heading-md: 1.5rem (600)   /* Section titles */
--body-lg: 1.125rem (400)    /* Body text */
--body-md: 1rem (400)        /* Labels */
--body-sm: 0.875rem (400)    /* Hints */
```

### Spacing & Layout
```css
/* Grid based on 8px */
--gap-sm: 8px
--gap-md: 16px
--gap-lg: 24px
--gap-xl: 32px

/* Border radius */
--radius-sm: 8px
--radius-md: 12px
--radius-lg: 16px
--radius-xl: 24px
```

---

## 📱 Screen Layouts

### 1️⃣ Welcome Screen
**Purpose:** First impression, feature overview, start action

**Layout:**
```
┌─────────────────────────────────────┐
│  Logo  Date/Time          Admin ⚙️  │  ← Header (40px)
├─────────────────────────────────────┤
│                                     │
│    🏛️ AI Photobooth              │
│  Kota Madiun                       │
│                                     │
│  [Preview Image with Landmark]     │
│                                     │
│  ✨ Landmark Background            │
│  📸 Realistic Photos               │
│  🎨 AI Filters                     │
│                                     │
│      [AMBIL FOTO]                  │
│                                     │
└─────────────────────────────────────┘
```

**Components:**
- Header (Logo, Title, Date/Time, User icon)
- Feature icons (3 feature cards)
- CTA Button (Large, blue, touch-friendly)
- Illustration (Madiun landmark + mascot)

---

### 2️⃣ Camera Capture Screen
**Purpose:** Live camera feed, countdown, instruction

**Layout:**
```
┌─────────────────────────────────────┐
│  ← Kembali              Coba Ulang →│
├─────────────────────────────────────┤
│                                     │
│      [CAMERA PREVIEW]              │
│      (Rounded Frame)               │
│      📷                             │
│                                     │
│   Silahkan Berpose                 │
│   (3 detik lagi)                   │
│                                     │
│      [AMBIL GAMBAR]                │
│                                     │
└─────────────────────────────────────┘
```

**Components:**
- Navigation header
- Camera preview (large, rounded frame)
- Countdown timer (5 → 1)
- Instruction text
- Primary button

---

### 3️⃣ Customization Screen
**Purpose:** Background & mascot selection

**Layout:**
```
┌─────────────────────────────────────┐
│  ← Kembali              Lanjut →    │
├─────────────────────────────────────┤
│  Langkah 3 dari 5                  │
│                                     │
│  📍 Pilih Background               │
│  [Card 1]  [Card 2]  [Card 3]      │
│                                     │
│  🎭 Pilih Maskot                   │
│  [Card 1]  [Card 2]  [Card 3]      │
│                                     │
│  🎨 Pilih Filter                   │
│  [Card 1]  [Card 2]  [Card 3]      │
│                                     │
└─────────────────────────────────────┘
```

**Components:**
- Step indicator
- Selection cards (with checkmark on selected)
- Category headers
- Navigation buttons

---

### 4️⃣ Processing Screen
**Purpose:** Show loading state with friendly messaging

**Layout:**
```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│        [Loading Animation]         │
│        (Radial waves / Spark)      │
│                                     │
│    Sedang memproses foto…         │
│                                     │
│    ██████░░░░░░░░░░  45%          │
│                                     │
│    ✨ Menambahkan efek AI...      │
│                                     │
│                                     │
└─────────────────────────────────────┘
```

**Components:**
- Loading animation
- Progress bar
- Status message
- Friendly AI message

---

### 5️⃣ Result Screen
**Purpose:** Display result, QR code, save action

**Layout:**
```
┌─────────────────────────────────────┐
│  ✓ Selesai!                        │
├─────────────────────────────────────┤
│                                     │
│      [PHOTO RESULT]                │
│      (Rounded frame)               │
│                                     │
│    Scan untuk download:            │
│         [QR Code]                  │
│                                     │
│      [SIMPAN FOTO]                 │
│      [AMBIL FOTO LAGI]             │
│                                     │
└─────────────────────────────────────┘
```

**Components:**
- Status badge (Success)
- Photo result preview
- QR code section
- Action buttons

---

## 🏗️ Component Structure

```
src/
├── components/
│   ├── common/
│   │   ├── Header.jsx              ← Top navigation bar
│   │   ├── Button.jsx              ← Reusable button
│   │   ├── Card.jsx                ← Card container
│   │   ├── LoadingAnimation.jsx    ← Loading spinner
│   │   └── StepIndicator.jsx       ← Progress indicator
│   │
│   ├── screens/
│   │   ├── WelcomeScreen.jsx       ← Screen 1
│   │   ├── CameraScreen.jsx        ← Screen 2
│   │   ├── CustomizeScreen.jsx     ← Screen 3
│   │   ├── ProcessingScreen.jsx    ← Screen 4
│   │   └── ResultScreen.jsx        ← Screen 5
│   │
│   └── features/
│       ├── FeatureCard.jsx         ← Feature icons
│       ├── SelectionCard.jsx       ← Background/Mascot selector
│       ├── CameraPreview.jsx       ← Camera feed
│       ├── CountdownTimer.jsx      ← Countdown display
│       └── QRCode.jsx              ← QR code display
│
├── pages/
│   └── PhotoboothApp.jsx           ← Main app container
│
├── hooks/
│   ├── useCamera.js                ← Camera hook
│   ├── usePhotobooth.js            ← State management
│   └── useAPI.js                   ← API calls
│
├── services/
│   ├── api.js                      ← API client
│   ├── camera.js                   ← Camera utilities
│   └── storage.js                  ← Local storage
│
├── styles/
│   ├── globals.css                 ← Global styles
│   ├── tailwind.config.js          ← Tailwind config
│   └── colors.css                  ← Color system
│
├── utils/
│   ├── constants.js                ← App constants
│   └── helpers.js                  ← Utility functions
│
└── App.jsx                         ← Entry point
```

---

## 🎯 Features by Screen

### Welcome Screen
- ✅ Hero image with Madiun landmark
- ✅ Feature cards (3 features)
- ✅ Start button
- ✅ Responsive header

### Camera Screen
- ✅ Live camera preview
- ✅ Countdown timer (5 → 1)
- ✅ Capture button
- ✅ Retake option

### Customization Screen
- ✅ Step indicator (3/5)
- ✅ Background selection (3 options)
- ✅ Mascot selection (3 options)
- ✅ Filter selection (3 options)
- ✅ Category headers

### Processing Screen
- ✅ Loading animation
- ✅ Progress bar (0-100%)
- ✅ Status messages
- ✅ Auto-advance when done

### Result Screen
- ✅ Photo preview
- ✅ Success badge
- ✅ QR code display
- ✅ Save & retry buttons

---

## 🎨 Styling Approach

**Framework:** Tailwind CSS

**Customization:**
```tailwind.config.js
module.exports = {
  theme: {
    colors: {
      primary: '#2563EB',
      'primary-light': '#DBEAFE',
      secondary: '#F3F4F6',
      success: '#10B981',
      processing: '#F59E0B',
      error: '#EF4444',
      white: '#FFFFFF'
    },
    borderRadius: {
      sm: '8px',
      md: '12px',
      lg: '16px',
      xl: '24px'
    },
    spacing: {
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px'
    }
  }
}
```

---

## 📱 Responsive Design

**Tablet Target:**
- Portrait: 1024px × 1366px
- Landscape: 1366px × 1024px
- Touch-friendly spacing
- Large tap targets (48px minimum)

**Breakpoints:**
```css
/* Tablet Portrait (default) */
@media (min-width: 1024px) { }

/* Tablet Landscape */
@media (min-width: 1366px) { }

/* Fallback for smaller tablets */
@media (max-width: 768px) { }
```

---

## 🔗 Integration Points

### API Endpoints Used:
```javascript
GET  /api/backgrounds        ← Fetch backgrounds
GET  /api/filters           ← Fetch filters
GET  /api/mascots           ← Fetch mascots
POST /api/photos/session    ← Create session
POST /api/photos/upload     ← Upload photo
POST /api/photos/process    ← Process photo (Phase 4)
POST /api/downloads/generate ← Generate QR code
```

### State Management:
```javascript
const [currentScreen, setCurrentScreen] = useState('welcome')
const [sessionId, setSessionId] = useState(null)
const [photoId, setPhotoId] = useState(null)
const [selectedBg, setSelectedBg] = useState(null)
const [selectedFilter, setSelectedFilter] = useState(null)
const [selectedMascot, setSelectedMascot] = useState(null)
const [processedPhoto, setProcessedPhoto] = useState(null)
const [loading, setLoading] = useState(false)
const [progress, setProgress] = useState(0)
```

---

## 🚀 Development Phases (7 days)

### Day 1: Project Setup & Components
- ✅ Create React app with Tailwind
- ✅ Setup project structure
- ✅ Create common components (Header, Button, Card)
- ✅ Setup color system

### Day 2: Welcome & Camera Screens
- ✅ Welcome screen UI
- ✅ Camera screen with preview
- ✅ Camera capture logic

### Day 3: Customization Screen
- ✅ Selection cards
- ✅ Background/Mascot/Filter selection
- ✅ Step indicator

### Day 4: Processing & Result Screens
- ✅ Processing animation
- ✅ Progress bar
- ✅ Result screen with QR code

### Day 5: API Integration
- ✅ Connect to Phase 3/4 APIs
- ✅ State management
- ✅ Error handling

### Day 6: Testing & Polish
- ✅ End-to-end testing
- ✅ UI polish
- ✅ Responsive adjustments

### Day 7: Deployment & Documentation
- ✅ Build optimization
- ✅ Deployment setup
- ✅ User documentation

---

## 📊 UX Flow

```
┌─────────────┐
│  Welcome    │  Welcome & feature overview
└──────┬──────┘
       │ [Ambil Foto]
       ↓
┌─────────────┐
│  Camera     │  Live preview + capture
└──────┬──────┘
       │ [Ambil Gambar]
       ↓
┌──────────────────┐
│  Customization   │  Select BG, Mascot, Filter
└────────┬─────────┘
         │ [Lanjut]
         ↓
┌──────────────────┐
│  Processing      │  AI processing animation
└────────┬─────────┘
         │ (Auto advance)
         ↓
┌──────────────────┐
│  Result          │  Photo + QR code download
└────────┬─────────┘
         │
         ├─ [Simpan] → Download
         └─ [Ambil Lagi] → Back to Welcome
```

---

## 🎯 Success Metrics

- [ ] All 5 screens implemented
- [ ] Touch-friendly interface
- [ ] Camera integration working
- [ ] Photo processing working
- [ ] QR code generation working
- [ ] Mobile-optimized for tablets
- [ ] Load time < 2 seconds
- [ ] Smooth animations
- [ ] Error handling
- [ ] Accessibility (WCAG AA)

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.x | UI library |
| Tailwind CSS | 3.x | Styling |
| Vite | 5.x | Build tool |
| Axios | Latest | HTTP client |
| React Router | 6.x | Navigation |
| Zustand | Latest | State management |

---

## 📦 Dependencies to Install

```bash
npm install react@18 react-dom@18
npm install -D tailwindcss postcss autoprefixer
npm install axios
npm install react-router-dom
npm install zustand
npm install qrcode.react
npm install react-webcam
```

---

## 🎉 Ready to Build!

This Phase 5 will create a modern, professional, government-grade photobooth experience.

**Next Step:** Start Day 1 Implementation

---

**Status:** 📋 Planning Complete - Ready to Code
**Timeline:** 7 days
**Complexity:** Medium-High
**Challenge:** Camera + API Integration + Smooth UX

Let's build! 🚀
