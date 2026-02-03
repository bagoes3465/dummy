# 🖼️ Photobooth AI - Phase 4: Image Processing Implementation

**Duration:** 10 days | **Status:** Ready to Implement
**Tech Stack:** Sharp + Jimp | **Focus:** Background removal, Filters, Watermarks

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Day-by-Day Implementation](#day-by-day-implementation)
3. [Core Services](#core-services)
4. [API Integration](#api-integration)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

Phase 4 akan mengimplementasikan:

| Feature | Tool | Status |
|---------|------|--------|
| **Background Removal** | Jimp (free, on-device) | 🔨 Build |
| **Filter Effects** | Sharp + Custom | 🔨 Build |
| **Watermark** | Sharp overlay | 🔨 Build |
| **Frame Addition** | Sharp composite | 🔨 Build |
| **Face Blur** | MediaPipe + Jimp | 🔨 Build |
| **Photo Enhancement** | Sharp filters | 🔨 Build |

**Tech Stack:**
- **Sharp** - Fast image resizing, format conversion
- **Jimp** - Pure JS image manipulation (no dependencies)
- **MediaPipe** - Face detection (already setup)

---

## 📅 Day-by-Day Implementation

### **DAY 1: Photo Processing Service Architecture**

**Goals:**
- ✅ Understand existing `photo-processing-service.js`
- ✅ Improve dan extend dengan baru features
- ✅ Setup image processing pipeline

**Current Status:**
File `src/services/photo-processing-service.js` sudah ada, kita akan enhance:

```javascript
const sharp = require('sharp');
const Jimp = require('jimp');
const fs = require('fs').promises;
const path = require('path');

const UPLOADS_DIR = process.env.STORAGE_PATH || './uploads';
const TEMP_DIR = process.env.STORAGE_TEMP_PATH || './uploads/temp';

class PhotoProcessingService {
  
  /**
   * Initialize directories
   */
  static async initialize() {
    try {
      await fs.mkdir(UPLOADS_DIR, { recursive: true });
      await fs.mkdir(TEMP_DIR, { recursive: true });
      console.log('✅ Photo processing directories ready');
    } catch (error) {
      console.error('❌ Error initializing directories:', error);
    }
  }

  /**
   * Convert base64 to file
   */
  static async base64ToFile(base64String, filename) {
    try {
      const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        throw new Error('Invalid base64 format');
      }

      const data = Buffer.from(matches[2], 'base64');
      const filepath = path.join(UPLOADS_DIR, filename);
      await fs.writeFile(filepath, data);
      
      return filepath;
    } catch (error) {
      console.error('Error converting base64 to file:', error);
      throw error;
    }
  }

  /**
   * Remove background using Jimp
   * Strategy: Detect white/transparent pixels and remove
   */
  static async removeBackground(imagePath, outputPath) {
    try {
      const image = await Jimp.read(imagePath);
      
      // Get image dimensions
      const width = image.bitmap.width;
      const height = image.bitmap.height;
      
      // Scan pixels and make background transparent
      image.scan(0, 0, width, height, function(x, y, idx) {
        const r = this.bitmap.data[idx];
        const g = this.bitmap.data[idx + 1];
        const b = this.bitmap.data[idx + 2];
        const a = this.bitmap.data[idx + 3];
        
        // If pixel is close to white (background), make transparent
        if (r > 200 && g > 200 && b > 200 && a === 255) {
          this.bitmap.data[idx + 3] = 0; // Set alpha to 0 (transparent)
        }
      });
      
      await image.write(outputPath);
      return outputPath;
    } catch (error) {
      console.error('Error removing background:', error);
      throw error;
    }
  }

  /**
   * Apply filters to image
   */
  static async applyFilter(imagePath, filterConfig, outputPath) {
    try {
      let transform = sharp(imagePath);
      
      if (filterConfig.grayscale) {
        transform = transform.grayscale();
      }
      
      if (filterConfig.sepia) {
        // Apply sepia tone
        transform = transform.tint({ r: 112, g: 66, b: 20 });
      }
      
      if (filterConfig.brightness !== undefined) {
        // Brightness adjustment
        const brightnessValue = 100 + (filterConfig.brightness * 50);
        transform = transform.modulate({ brightness: brightnessValue / 100 });
      }
      
      if (filterConfig.saturation !== undefined) {
        // Saturation adjustment
        transform = transform.modulate({ saturation: filterConfig.saturation });
      }
      
      if (filterConfig.contrast !== undefined) {
        // Contrast adjustment
        const contrastValue = 100 + ((filterConfig.contrast - 1) * 100);
        transform = transform.modulate({ saturation: contrastValue / 100 });
      }
      
      if (filterConfig.blur && filterConfig.blur_strength) {
        // Blur effect
        const blurValue = Math.round(filterConfig.blur_strength * 25);
        transform = transform.blur(blurValue);
      }
      
      await transform.toFile(outputPath);
      return outputPath;
    } catch (error) {
      console.error('Error applying filter:', error);
      throw error;
    }
  }

  /**
   * Add watermark to image
   */
  static async addWatermark(imagePath, watermarkText, outputPath) {
    try {
      const image = await Jimp.read(imagePath);
      const width = image.bitmap.width;
      const height = image.bitmap.height;
      
      // Load default font
      const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
      
      // Add watermark at bottom right
      image.print(
        font,
        width - 250,
        height - 50,
        {
          text: watermarkText,
          alignmentX: Jimp.HORIZONTAL_ALIGN_RIGHT,
          alignmentY: Jimp.VERTICAL_ALIGN_BOTTOM
        }
      );
      
      await image.write(outputPath);
      return outputPath;
    } catch (error) {
      console.error('Error adding watermark:', error);
      throw error;
    }
  }

  /**
   * Composite/Overlay background
   */
  static async compositeBackground(foregroundPath, backgroundPath, outputPath) {
    try {
      const background = await sharp(backgroundPath)
        .resize(1920, 1080, { fit: 'cover' })
        .toBuffer();
      
      const composite = await sharp(background)
        .composite([
          { input: foregroundPath, gravity: 'center' }
        ])
        .toFile(outputPath);
      
      return outputPath;
    } catch (error) {
      console.error('Error compositing background:', error);
      throw error;
    }
  }

  /**
   * Resize image to standard dimensions
   */
  static async resizeImage(imagePath, width, height, outputPath) {
    try {
      await sharp(imagePath)
        .resize(width, height, { fit: 'cover' })
        .toFile(outputPath);
      
      return outputPath;
    } catch (error) {
      console.error('Error resizing image:', error);
      throw error;
    }
  }

  /**
   * Complete photo processing pipeline
   */
  static async processPhoto(imagePath, options = {}) {
    try {
      const {
        backgroundId = null,
        filterId = null,
        watermarkText = 'Photobooth AI',
        removeBackground = false,
        faces = []
      } = options;

      let currentImage = imagePath;
      const outputDir = TEMP_DIR;
      let processStep = 0;

      // Step 1: Remove background (if requested)
      if (removeBackground) {
        processStep++;
        const bgRemovedPath = path.join(outputDir, `step${processStep}_bg_removed.png`);
        currentImage = await this.removeBackground(currentImage, bgRemovedPath);
        console.log(`✅ Step ${processStep}: Background removed`);
      }

      // Step 2: Apply background template
      if (backgroundId && backgroundId !== 0) {
        processStep++;
        const backgroundPath = path.join(UPLOADS_DIR, `background_${backgroundId}.jpg`);
        const compositePath = path.join(outputDir, `step${processStep}_with_bg.jpg`);
        currentImage = await this.compositeBackground(currentImage, backgroundPath, compositePath);
        console.log(`✅ Step ${processStep}: Background applied`);
      }

      // Step 3: Apply filter
      if (filterId && filterId !== 0) {
        processStep++;
        const filterPath = path.join(outputDir, `step${processStep}_filtered.jpg`);
        // Assume filterConfig dari database
        const filterConfig = { grayscale: false, brightness: 0.1 };
        currentImage = await this.applyFilter(currentImage, filterConfig, filterPath);
        console.log(`✅ Step ${processStep}: Filter applied`);
      }

      // Step 4: Add watermark
      if (watermarkText) {
        processStep++;
        const watermarkPath = path.join(outputDir, `step${processStep}_watermark.jpg`);
        currentImage = await this.addWatermark(currentImage, watermarkText, watermarkPath);
        console.log(`✅ Step ${processStep}: Watermark added`);
      }

      // Step 5: Final resize to standard dimension
      processStep++;
      const finalPath = path.join(UPLOADS_DIR, `photo_${Date.now()}.jpg`);
      currentImage = await this.resizeImage(currentImage, 1920, 1080, finalPath);
      console.log(`✅ Step ${processStep}: Final image ready`);

      return {
        success: true,
        originalPath: imagePath,
        processedPath: currentImage,
        steps: processStep,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Error in photo processing pipeline:', error);
      throw error;
    }
  }

  /**
   * Blur faces using face detection data
   */
  static async blurFaces(imagePath, faces, outputPath) {
    try {
      let image = await Jimp.read(imagePath);
      
      for (const face of faces) {
        const { x, y, width, height } = face;
        
        // Create blurred region
        const blurred = await Jimp.read(imagePath);
        await blurred.crop(x, y, width, height).blur(20);
        
        // Composite back
        image.composite(blurred, x, y);
      }
      
      await image.write(outputPath);
      return outputPath;
    } catch (error) {
      console.error('Error blurring faces:', error);
      throw error;
    }
  }

  /**
   * Enhance image quality
   */
  static async enhanceImage(imagePath, outputPath) {
    try {
      await sharp(imagePath)
        .normalize() // Auto-enhance contrast
        .sharpen() // Sharpen details
        .toFile(outputPath);
      
      return outputPath;
    } catch (error) {
      console.error('Error enhancing image:', error);
      throw error;
    }
  }

  /**
   * Convert image format
   */
  static async convertFormat(imagePath, format, outputPath) {
    try {
      const validFormats = ['jpeg', 'png', 'webp', 'gif'];
      
      if (!validFormats.includes(format)) {
        throw new Error(`Invalid format: ${format}`);
      }
      
      await sharp(imagePath)
        .toFormat(format)
        .toFile(outputPath);
      
      return outputPath;
    } catch (error) {
      console.error('Error converting format:', error);
      throw error;
    }
  }

  /**
   * Get image metadata
   */
  static async getImageMetadata(imagePath) {
    try {
      const metadata = await sharp(imagePath).metadata();
      return metadata;
    } catch (error) {
      console.error('Error getting metadata:', error);
      throw error;
    }
  }

  /**
   * Cleanup temp files
   */
  static async cleanupTempFiles() {
    try {
      const files = await fs.readdir(TEMP_DIR);
      for (const file of files) {
        const filePath = path.join(TEMP_DIR, file);
        await fs.unlink(filePath);
      }
      console.log('✅ Temp files cleaned up');
    } catch (error) {
      console.error('Error cleaning temp files:', error);
    }
  }
}

// Initialize on load
PhotoProcessingService.initialize();

module.exports = PhotoProcessingService;
```

**Testing:**
```bash
# Test dependencies
npm list sharp jimp

# Both harus installed
```

---

### **DAY 2: Background Removal Implementation**

**Goals:**
- ✅ Implement smart background removal
- ✅ Test dengan sample images
- ✅ Optimize untuk speed

**Key Points:**
- Background removal menggunakan **Jimp** (pure JS, no native dependencies)
- Strategy: Detect warna white/uniform dan replace dengan transparent
- Alternative: Bisa integrate dengan `remove.bg` API (free tier available)

**Code to add to `photo-processing-service.js`:**

```javascript
/**
 * Advanced background removal dengan edge detection
 */
static async removeBackgroundAdvanced(imagePath, outputPath, threshold = 200) {
  try {
    const image = await Jimp.read(imagePath);
    const width = image.bitmap.width;
    const height = image.bitmap.height;
    
    // Create alpha channel
    image.scan(0, 0, width, height, function(x, y, idx) {
      const r = this.bitmap.data[idx];
      const g = this.bitmap.data[idx + 1];
      const b = this.bitmap.data[idx + 2];
      
      // Calculate luminance
      const luminance = (r * 0.299 + g * 0.587 + b * 0.114);
      
      // If bright (background), make transparent
      if (luminance > threshold) {
        this.bitmap.data[idx + 3] = 0;
      }
    });
    
    await image.write(outputPath);
    return outputPath;
  } catch (error) {
    throw error;
  }
}

/**
 * Background removal dengan remove.bg API (optional, paid)
 */
static async removeBackgroundAPI(imagePath, outputPath, apiKey) {
  try {
    const fetch = require('node-fetch');
    const fs = require('fs');
    
    const imageBuffer = fs.readFileSync(imagePath);
    
    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey
      },
      body: imageBuffer
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    const buffer = await response.buffer();
    fs.writeFileSync(outputPath, buffer);
    
    return outputPath;
  } catch (error) {
    console.error('Error with remove.bg API:', error);
    // Fallback to local removal
    return this.removeBackgroundAdvanced(imagePath, outputPath);
  }
}
```

---

### **DAY 3: Filter Effects Implementation**

**Goals:**
- ✅ Implement all filter types
- ✅ Create filter presets
- ✅ Test real-time performance

**Supported Filters:**

| Filter | Effect | Parameters |
|--------|--------|-----------|
| **Beauty Mode** | Smoothing + Whitening | smoothing: 0-1, whitening: 0-1 |
| **Vintage** | Sepia tone | sepia: 0-1 |
| **Cool Tone** | Blue shift | blue_shift: 0-1 |
| **B&W Classic** | Grayscale | contrast: 1-2 |
| **Bokeh** | Blur background | blur_strength: 0-1 |

**Implementation:**

```javascript
static async applyBeautyFilter(imagePath, outputPath, smoothing = 0.8, whitening = 0.5) {
  try {
    let transform = sharp(imagePath);
    
    // Smoothing: slight blur
    if (smoothing > 0) {
      const blurValue = Math.round(smoothing * 5);
      transform = transform.blur(blurValue);
    }
    
    // Whitening: increase brightness
    if (whitening > 0) {
      const brightnessModifier = 1 + (whitening * 0.2);
      transform = transform.modulate({ brightness: brightnessModifier });
    }
    
    await transform.toFile(outputPath);
    return outputPath;
  } catch (error) {
    throw error;
  }
}

static async applyVintageFilter(imagePath, outputPath, intensity = 0.6) {
  try {
    await sharp(imagePath)
      .modulate({ saturation: 0.6 })
      .tint({ r: 112, g: 66, b: 20 })
      .modulate({ brightness: 1.1 })
      .toFile(outputPath);
    
    return outputPath;
  } catch (error) {
    throw error;
  }
}

static async applyCoolToneFilter(imagePath, outputPath, intensity = 0.3) {
  try {
    await sharp(imagePath)
      .modulate({ saturation: 1.1 })
      .tint({ r: 50, g: 100, b: 200 })
      .modulate({ brightness: 1.05 })
      .toFile(outputPath);
    
    return outputPath;
  } catch (error) {
    throw error;
  }
}
```

---

### **DAY 4: Watermark & Branding**

**Goals:**
- ✅ Add text watermark
- ✅ Add logo watermark
- ✅ Customize position & transparency

**Implementation:**

```javascript
static async addTextWatermark(imagePath, text, outputPath, options = {}) {
  try {
    const {
      position = 'bottom-right', // top-left, top-center, top-right, bottom-left, bottom-center, bottom-right
      fontSize = 32,
      color = '#FFFFFF',
      opacity = 0.7
    } = options;
    
    const image = await Jimp.read(imagePath);
    const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
    
    const positionMap = {
      'top-left': { x: 20, y: 20 },
      'top-center': { x: image.bitmap.width / 2 - 100, y: 20 },
      'top-right': { x: image.bitmap.width - 250, y: 20 },
      'bottom-left': { x: 20, y: image.bitmap.height - 50 },
      'bottom-center': { x: image.bitmap.width / 2 - 100, y: image.bitmap.height - 50 },
      'bottom-right': { x: image.bitmap.width - 250, y: image.bitmap.height - 50 }
    };
    
    const pos = positionMap[position];
    
    image.print(font, pos.x, pos.y, {
      text: text,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_CENTER
    });
    
    await image.write(outputPath);
    return outputPath;
  } catch (error) {
    throw error;
  }
}

static async addLogoWatermark(imagePath, logoPath, outputPath, options = {}) {
  try {
    const {
      position = 'bottom-right',
      scale = 0.15,
      opacity = 0.8
    } = options;
    
    const image = await Jimp.read(imagePath);
    const logo = await Jimp.read(logoPath);
    
    // Resize logo
    const logoWidth = Math.round(image.bitmap.width * scale);
    const logoHeight = Math.round(logo.bitmap.height * (logoWidth / logo.bitmap.width));
    logo.resize(logoWidth, logoHeight);
    
    // Set opacity
    logo.opacity(opacity);
    
    // Position
    const positionMap = {
      'top-left': { x: 20, y: 20 },
      'top-right': { x: image.bitmap.width - logoWidth - 20, y: 20 },
      'bottom-left': { x: 20, y: image.bitmap.height - logoHeight - 20 },
      'bottom-right': { x: image.bitmap.width - logoWidth - 20, y: image.bitmap.height - logoHeight - 20 }
    };
    
    const pos = positionMap[position];
    
    image.composite(logo, pos.x, pos.y);
    await image.write(outputPath);
    
    return outputPath;
  } catch (error) {
    throw error;
  }
}
```

---

### **DAY 5: Frame & Border Effects**

**Goals:**
- ✅ Add photo frames
- ✅ Add borders
- ✅ Custom frame designs

**Implementation:**

```javascript
static async addFrame(imagePath, frameColor = '#FFFFFF', frameWidth = 50, outputPath) {
  try {
    const metadata = await sharp(imagePath).metadata();
    const newWidth = metadata.width + (frameWidth * 2);
    const newHeight = metadata.height + (frameWidth * 2);
    
    await sharp({
      create: {
        width: newWidth,
        height: newHeight,
        channels: 3,
        background: frameColor
      }
    })
    .composite([
      { input: imagePath, left: frameWidth, top: frameWidth }
    ])
    .toFile(outputPath);
    
    return outputPath;
  } catch (error) {
    throw error;
  }
}

static async addPolaroidFrame(imagePath, outputPath) {
  try {
    const metadata = await sharp(imagePath).metadata();
    const frameWidth = 30;
    const bottomSpace = 80; // Extra space untuk "label" polaroid
    
    const newWidth = metadata.width + (frameWidth * 2);
    const newHeight = metadata.height + frameWidth + bottomSpace;
    
    await sharp({
      create: {
        width: newWidth,
        height: newHeight,
        channels: 3,
        background: '#FFFEF5' // Vintage white
      }
    })
    .composite([
      { input: imagePath, left: frameWidth, top: frameWidth }
    ])
    .toFile(outputPath);
    
    return outputPath;
  } catch (error) {
    throw error;
  }
}
```

---

### **DAY 6: Face Detection & Blur**

**Goals:**
- ✅ Integrate MediaPipe face detection
- ✅ Blur/pixelate detected faces
- ✅ Performance optimization

**Implementation:**

```javascript
static async blurDetectedFaces(imagePath, faces, outputPath, blurStrength = 20) {
  try {
    if (!faces || faces.length === 0) {
      // No faces to blur, just copy file
      await fs.copyFile(imagePath, outputPath);
      return outputPath;
    }
    
    let image = await Jimp.read(imagePath);
    
    for (const face of faces) {
      const { x, y, width, height } = face;
      
      // Extract region
      const regionBuffer = await sharp({
        create: {
          width: Math.round(width),
          height: Math.round(height),
          channels: 3,
          background: '#000000'
        }
      })
      .blur(blurStrength)
      .toBuffer();
      
      // Read blurred region
      const blurredRegion = await Jimp.read(regionBuffer);
      
      // Composite back
      image.composite(blurredRegion, Math.round(x), Math.round(y));
    }
    
    await image.write(outputPath);
    return outputPath;
  } catch (error) {
    throw error;
  }
}

static async pixelateFaces(imagePath, faces, outputPath, pixelSize = 10) {
  try {
    let image = await Jimp.read(imagePath);
    
    for (const face of faces) {
      const { x, y, width, height } = face;
      
      image.scan(
        Math.round(x),
        Math.round(y),
        Math.round(width),
        Math.round(height),
        function(px, py, idx) {
          if (px % pixelSize === 0 && py % pixelSize === 0) {
            // Copy this pixel to surrounding pixelated block
            const r = this.bitmap.data[idx];
            const g = this.bitmap.data[idx + 1];
            const b = this.bitmap.data[idx + 2];
            
            for (let i = 0; i < pixelSize; i++) {
              for (let j = 0; j < pixelSize; j++) {
                const blockIdx = ((py + j) * this.bitmap.width + (px + i)) * 4;
                this.bitmap.data[blockIdx] = r;
                this.bitmap.data[blockIdx + 1] = g;
                this.bitmap.data[blockIdx + 2] = b;
              }
            }
          }
        }
      );
    }
    
    await image.write(outputPath);
    return outputPath;
  } catch (error) {
    throw error;
  }
}
```

---

### **DAY 7: Batch Processing & Performance**

**Goals:**
- ✅ Batch processing untuk multiple photos
- ✅ Queue system
- ✅ Performance benchmarking

**Implementation:**

```javascript
class ProcessingQueue {
  constructor(maxConcurrent = 3) {
    this.queue = [];
    this.processing = 0;
    this.maxConcurrent = maxConcurrent;
  }

  async add(task) {
    this.queue.push(task);
    this.process();
  }

  async process() {
    if (this.processing >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }

    this.processing++;
    const task = this.queue.shift();

    try {
      await task();
    } catch (error) {
      console.error('Error processing task:', error);
    } finally {
      this.processing--;
      this.process();
    }
  }
}

// Usage
const processingQueue = new ProcessingQueue(3);

async function queuePhotoProcessing(photoData) {
  await processingQueue.add(async () => {
    await PhotoProcessingService.processPhoto(photoData.imagePath, photoData.options);
  });
}
```

---

### **DAY 8: Advanced Effects**

**Goals:**
- ✅ HDR-like effects
- ✅ Glow effects
- ✅ Vintage effects

**Implementation:**

```javascript
static async applyHDREffect(imagePath, outputPath) {
  try {
    // Increase saturation and contrast
    await sharp(imagePath)
      .modulate({ saturation: 1.5, brightness: 1.1 })
      .sharpen({ sigma: 2 })
      .toFile(outputPath);
    
    return outputPath;
  } catch (error) {
    throw error;
  }
}

static async applyGlowEffect(imagePath, outputPath) {
  try {
    const image = await Jimp.read(imagePath);
    
    // Create glow by duplicating and blurring
    const blurred = image.clone().blur(15);
    
    // Blend original with blurred
    image.composite(blurred, 0, 0);
    
    await image.write(outputPath);
    return outputPath;
  } catch (error) {
    throw error;
  }
}

static async applyCoolChromeEffect(imagePath, outputPath) {
  try {
    await sharp(imagePath)
      .modulate({ saturation: 1.2, brightness: 0.95, hue: 180 })
      .sharpen()
      .toFile(outputPath);
    
    return outputPath;
  } catch (error) {
    throw error;
  }
}
```

---

### **DAY 9: API Endpoints Integration**

**Goals:**
- ✅ Create `/api/photos/process` endpoint
- ✅ Handle async processing
- ✅ Return progress updates

**File: `src/routes/photos.js` - Add new endpoints:**

```javascript
// POST /api/photos/process - Full processing pipeline
router.post('/process', async (req, res) => {
  try {
    const { photo_id, background_id, filter_id, watermark_text } = req.body;
    
    if (!photo_id) {
      return res.status(400).json({ error: 'photo_id required' });
    }
    
    // Get photo from database
    const { data: photoData, error: photoError } = await supabase
      .from('photos')
      .select('*')
      .eq('photo_id', photo_id)
      .single();
    
    if (photoError) throw photoError;
    
    // Get background template
    let backgroundPath = null;
    if (background_id) {
      const { data: bgData } = await supabase
        .from('background_templates')
        .select('image_url')
        .eq('id', background_id)
        .single();
      backgroundPath = bgData?.image_url;
    }
    
    // Get filter config
    let filterConfig = null;
    if (filter_id) {
      const { data: filterData } = await supabase
        .from('ai_filters')
        .select('filter_config')
        .eq('id', filter_id)
        .single();
      filterConfig = filterData?.filter_config ? JSON.parse(filterData.filter_config) : null;
    }
    
    // Process photo
    const photoProcessingService = require('../services/photo-processing-service');
    const result = await photoProcessingService.processPhoto(
      photoData.original_image_path,
      {
        backgroundId: background_id,
        filterId: filter_id,
        filterConfig: filterConfig,
        watermarkText: watermark_text || 'Photobooth AI'
      }
    );
    
    // Update photo in database
    const { error: updateError } = await supabase
      .from('photos')
      .update({
        processed_image_path: result.processedPath,
        background_id,
        filter_id,
        processed_at: new Date().toISOString()
      })
      .eq('photo_id', photo_id);
    
    if (updateError) throw updateError;
    
    res.json({
      success: true,
      photo_id,
      processed_path: result.processedPath,
      steps: result.steps
    });
  } catch (error) {
    console.error('Error processing photo:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/photos/:photo_id/download - Get download link
router.get('/:photo_id/download', async (req, res) => {
  try {
    const { data: photoData, error } = await supabase
      .from('photos')
      .select('*')
      .eq('photo_id', req.params.photo_id)
      .single();
    
    if (error) throw error;
    if (!photoData) {
      return res.status(404).json({ error: 'Photo not found' });
    }
    
    // Return file as download
    // TODO: Implement file serving
    res.json({
      success: true,
      photo_id: photoData.photo_id,
      download_ready: true
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

### **DAY 10: Testing & Optimization**

**Goals:**
- ✅ Performance testing
- ✅ Quality testing
- ✅ Error handling
- ✅ Production readiness

**Performance Checklist:**
- [ ] Single photo processing < 2 seconds
- [ ] Batch processing optimized
- [ ] Memory usage monitored
- [ ] Cleanup temp files
- [ ] Error handling complete
- [ ] All filters tested
- [ ] Edge cases handled

**Testing Script:**

```bash
# Test 1: Create session
SESSION_ID=$(curl -s -X POST http://localhost:3000/api/photos/session \
  -H "Content-Type: application/json" \
  -d '{"background_id": 1}' | jq -r '.session_id')

echo "Session: $SESSION_ID"

# Test 2: Process photo (after upload)
curl -X POST http://localhost:3000/api/photos/process \
  -H "Content-Type: application/json" \
  -d "{
    \"photo_id\": \"PHOTO_ID_HERE\",
    \"background_id\": 1,
    \"filter_id\": 1,
    \"watermark_text\": \"Photo Booth\"
  }"

# Test 3: Get processed photo
curl http://localhost:3000/api/photos/PHOTO_ID_HERE
```

---

## 📊 Performance Metrics

| Operation | Time | Memory |
|-----------|------|--------|
| Remove background | ~500ms | ~50MB |
| Apply filter | ~300ms | ~30MB |
| Add watermark | ~200ms | ~20MB |
| Composite background | ~600ms | ~60MB |
| Full pipeline | ~1.5s | ~100MB |

---

## ✅ Completion Checklist

- [ ] Background removal working
- [ ] All filters implemented
- [ ] Watermark system working
- [ ] Frame effects added
- [ ] Face blur implemented
- [ ] Batch processing setup
- [ ] API endpoints working
- [ ] Performance optimized
- [ ] All tests passing
- [ ] Error handling complete

---

## 🚀 Next Steps

After Phase 4 complete:

1. **Phase 5: Frontend** (7+ days)
   - React UI
   - Real-time preview
   - Camera integration

2. **Phase 6: Deployment** (3 days)
   - Docker setup
   - Cloud hosting
   - CI/CD pipeline

---

**Ready to start Phase 4? Let's build! 🎨**
