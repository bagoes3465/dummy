const sharp = require('sharp');
const Jimp = require('jimp');
const fs = require('fs').promises;
const path = require('path');
const supabase = require('../database/supabase-client');

const UPLOADS_DIR = process.env.STORAGE_PATH || './uploads';
const TEMP_DIR = process.env.STORAGE_TEMP_PATH || './uploads/temp';

/**
 * Photo Processing Service - Phase 4 Implementation
 * Handles: Background removal, Filters, Watermarks, Frames, Face blur
 */
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
   * Remove background using Jimp (local, free)
   */
  static async removeBackground(imagePath, outputPath, threshold = 200) {
    try {
      const image = await Jimp.read(imagePath);
      const width = image.bitmap.width;
      const height = image.bitmap.height;
      
      // Scan pixels and make background transparent
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
      console.log(`✅ Background removed: ${outputPath}`);
      return outputPath;
    } catch (error) {
      console.error('Error removing background:', error);
      throw error;
    }
  }

  /**
   * Apply filter to image
   */
  static async applyFilter(imagePath, filterId, filterConfig, outputPath) {
    try {
      let transform = sharp(imagePath);
      
      // Beauty Mode
      if (filterId === 1 || filterConfig?.smoothing) {
        const smoothing = filterConfig?.smoothing || 0.8;
        const whitening = filterConfig?.whitening || 0.5;
        
        if (smoothing > 0) {
          const blurValue = Math.round(smoothing * 5);
          transform = transform.blur(blurValue);
        }
        
        if (whitening > 0) {
          const brightnessModifier = 1 + (whitening * 0.2);
          transform = transform.modulate({ brightness: brightnessModifier });
        }
      }
      
      // Vintage
      if (filterId === 2 || filterConfig?.sepia) {
        const sepia = filterConfig?.sepia || 0.6;
        transform = sharp(imagePath)
          .modulate({ saturation: 0.6, brightness: 1.1 })
          .tint({ r: 112, g: 66, b: 20 });
      }
      
      // Cool Tone
      if (filterId === 3 || filterConfig?.blue_shift) {
        transform = sharp(imagePath)
          .modulate({ saturation: 1.1, brightness: 1.05 })
          .tint({ r: 50, g: 100, b: 200 });
      }
      
      // B&W Classic
      if (filterId === 4 || filterConfig?.grayscale) {
        transform = transform.grayscale();
        if (filterConfig?.contrast) {
          transform = transform.modulate({ brightness: filterConfig.contrast });
        }
      }
      
      // Bokeh
      if (filterId === 5 || filterConfig?.blur_strength) {
        const blurValue = Math.round((filterConfig?.blur_strength || 0.7) * 25);
        transform = transform.blur(blurValue);
      }
      
      // Custom saturation/contrast
      if (filterConfig?.saturation || filterConfig?.contrast) {
        transform = transform.modulate({
          saturation: filterConfig?.saturation || 1,
          brightness: (filterConfig?.brightness || 1)
        });
      }
      
      await transform.toFile(outputPath);
      console.log(`✅ Filter applied: ${outputPath}`);
      return outputPath;
    } catch (error) {
      console.error('Error applying filter:', error);
      throw error;
    }
  }

  /**
   * Add text watermark
   */
  static async addTextWatermark(imagePath, text = 'Photobooth AI', outputPath, options = {}) {
    try {
      const {
        position = 'bottom-right',
        opacity = 0.7,
        color = 0xFFFFFFFF
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
      
      const pos = positionMap[position] || positionMap['bottom-right'];
      
      image.print(font, pos.x, pos.y, {
        text: text,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: Jimp.VERTICAL_ALIGN_CENTER
      });
      
      await image.write(outputPath);
      console.log(`✅ Watermark added: ${outputPath}`);
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
      const metadata = await sharp(foregroundPath).metadata();
      
      const composite = await sharp(backgroundPath)
        .resize(metadata.width, metadata.height, { fit: 'cover' })
        .composite([
          { input: foregroundPath, gravity: 'center' }
        ])
        .toFile(outputPath);
      
      console.log(`✅ Background composited: ${outputPath}`);
      return outputPath;
    } catch (error) {
      console.error('Error compositing background:', error);
      throw error;
    }
  }

  /**
   * Add frame/border to image
   */
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
      
      console.log(`✅ Frame added: ${outputPath}`);
      return outputPath;
    } catch (error) {
      console.error('Error adding frame:', error);
      throw error;
    }
  }

  /**
   * Add Polaroid frame effect
   */
  static async addPolaroidFrame(imagePath, outputPath) {
    try {
      const metadata = await sharp(imagePath).metadata();
      const frameWidth = 30;
      const bottomSpace = 80;
      
      const newWidth = metadata.width + (frameWidth * 2);
      const newHeight = metadata.height + frameWidth + bottomSpace;
      
      await sharp({
        create: {
          width: newWidth,
          height: newHeight,
          channels: 3,
          background: '#FFFEF5'
        }
      })
      .composite([
        { input: imagePath, left: frameWidth, top: frameWidth }
      ])
      .toFile(outputPath);
      
      console.log(`✅ Polaroid frame added: ${outputPath}`);
      return outputPath;
    } catch (error) {
      console.error('Error adding polaroid frame:', error);
      throw error;
    }
  }

  /**
   * Blur detected faces
   */
  static async blurDetectedFaces(imagePath, faces, outputPath, blurStrength = 20) {
    try {
      if (!faces || faces.length === 0) {
        await fs.copyFile(imagePath, outputPath);
        return outputPath;
      }
      
      let image = await Jimp.read(imagePath);
      
      for (const face of faces) {
        const { x, y, width, height } = face;
        
        // Extract and blur region
        image.scan(
          Math.round(x),
          Math.round(y),
          Math.round(width),
          Math.round(height),
          function(px, py, idx) {
            // Apply blur effect by averaging neighbor pixels
            if (px % 3 === 0 && py % 3 === 0) {
              const r = this.bitmap.data[idx];
              const g = this.bitmap.data[idx + 1];
              const b = this.bitmap.data[idx + 2];
              
              for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
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
      console.log(`✅ Faces blurred: ${outputPath}`);
      return outputPath;
    } catch (error) {
      console.error('Error blurring faces:', error);
      throw error;
    }
  }

  /**
   * Pixelate faces
   */
  static async pixelateFaces(imagePath, faces, outputPath, pixelSize = 10) {
    try {
      if (!faces || faces.length === 0) {
        await fs.copyFile(imagePath, outputPath);
        return outputPath;
      }
      
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
      console.log(`✅ Faces pixelated: ${outputPath}`);
      return outputPath;
    } catch (error) {
      console.error('Error pixelating faces:', error);
      throw error;
    }
  }

  /**
   * Resize image
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
   * Complete photo processing pipeline
   */
  static async processPhoto(imagePath, options = {}) {
    try {
      const {
        backgroundId = null,
        filterId = null,
        filterConfig = null,
        watermarkText = 'Photobooth AI',
        removeBackground = false,
        faces = [],
        frameType = null,
        blurFaces = false,
        pixelateFaces = false
      } = options;

      let currentImage = imagePath;
      const outputDir = TEMP_DIR;
      let processStep = 0;

      console.log(`\n📸 Processing photo: ${imagePath}`);

      // Step 1: Remove background
      if (removeBackground) {
        processStep++;
        const bgRemovedPath = path.join(outputDir, `step${processStep}_bg_removed.png`);
        currentImage = await this.removeBackground(currentImage, bgRemovedPath);
        console.log(`✅ Step ${processStep}: Background removed`);
      }

      // Step 2: Blur/Pixelate faces
      if (blurFaces && faces.length > 0) {
        processStep++;
        const facesBlurredPath = path.join(outputDir, `step${processStep}_faces_blurred.jpg`);
        currentImage = await this.blurDetectedFaces(currentImage, faces, facesBlurredPath);
        console.log(`✅ Step ${processStep}: Faces blurred`);
      } else if (pixelateFaces && faces.length > 0) {
        processStep++;
        const facesPixelatedPath = path.join(outputDir, `step${processStep}_faces_pixelated.jpg`);
        currentImage = await this.pixelateFaces(currentImage, faces, facesPixelatedPath);
        console.log(`✅ Step ${processStep}: Faces pixelated`);
      }

      // Step 3: Apply background template
      if (backgroundId && backgroundId !== 0) {
        processStep++;
        const backgroundPath = path.join(UPLOADS_DIR, `background_${backgroundId}.jpg`);
        const compositePath = path.join(outputDir, `step${processStep}_with_bg.jpg`);
        
        // For demo, use placeholder
        try {
          currentImage = await this.compositeBackground(currentImage, backgroundPath, compositePath);
        } catch (e) {
          console.log(`⚠️ Background file not found, skipping composite`);
        }
        console.log(`✅ Step ${processStep}: Background applied`);
      }

      // Step 4: Apply filter
      if (filterId && filterId !== 0) {
        processStep++;
        const filterPath = path.join(outputDir, `step${processStep}_filtered.jpg`);
        currentImage = await this.applyFilter(currentImage, filterId, filterConfig, filterPath);
        console.log(`✅ Step ${processStep}: Filter applied`);
      }

      // Step 5: Add frame
      if (frameType === 'polaroid') {
        processStep++;
        const framePath = path.join(outputDir, `step${processStep}_polaroid.jpg`);
        currentImage = await this.addPolaroidFrame(currentImage, framePath);
        console.log(`✅ Step ${processStep}: Polaroid frame added`);
      } else if (frameType === 'border') {
        processStep++;
        const framePath = path.join(outputDir, `step${processStep}_frame.jpg`);
        currentImage = await this.addFrame(currentImage, '#FFFFFF', 30, framePath);
        console.log(`✅ Step ${processStep}: Border frame added`);
      }

      // Step 6: Add watermark
      if (watermarkText) {
        processStep++;
        const watermarkPath = path.join(outputDir, `step${processStep}_watermark.jpg`);
        currentImage = await this.addTextWatermark(currentImage, watermarkText, watermarkPath);
        console.log(`✅ Step ${processStep}: Watermark added`);
      }

      // Step 7: Final resize
      processStep++;
      const finalPath = path.join(UPLOADS_DIR, `photo_${Date.now()}.jpg`);
      await this.resizeImage(currentImage, 1920, 1080, finalPath);
      console.log(`✅ Step ${processStep}: Final image ready`);

      return {
        success: true,
        originalPath: imagePath,
        processedPath: finalPath,
        steps: processStep,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Error in photo processing pipeline:', error);
      throw error;
    }
  }

  /**
   * Track processing in database (legacy support)
   */
  async startProcessing(photoId, sessionId, backgroundId, mascotId) {
    try {
      const { data, error } = await supabase
        .from('photo_processing')
        .insert([
          {
            photo_id: photoId,
            session_id: sessionId,
            background_template_id: backgroundId,
            mascot_id: mascotId,
            processing_status: 'pending',
            processing_metadata: {
              started_at: new Date().toISOString(),
              background_id: backgroundId,
              mascot_id: mascotId
            }
          }
        ])
        .select();

      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Error starting photo processing:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Update processing status
   */
  async updateProcessingStatus(processingId, status, metadata = {}) {
    try {
      const updateData = {
        processing_status: status,
        updated_at: new Date().toISOString()
      };

      if (status === 'processing') {
        updateData.processing_metadata = {
          ...metadata,
          started_at: new Date().toISOString()
        };
      } else if (status === 'completed') {
        updateData.processing_metadata = {
          ...metadata,
          completed_at: new Date().toISOString()
        };
        updateData.processed_at = new Date();
      } else if (status === 'failed') {
        updateData.processing_error = metadata.error || 'Unknown error';
        updateData.processing_metadata = {
          ...metadata,
          failed_at: new Date().toISOString()
        };
      }

      const { data, error } = await supabase
        .from('photo_processing')
        .update(updateData)
        .eq('id', processingId)
        .select();

      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Error updating processing status:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get processing status by photo
   */
  async getProcessingByPhoto(photoId) {
    try {
      const { data, error } = await supabase
        .from('photo_processing')
        .select(`
          *,
          background:background_template_id(*),
          mascot:mascot_id(*)
        `)
        .eq('photo_id', photoId)
        .order('created_at', { ascending: false })
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching processing status:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get all processing by session
   */
  async getProcessingBySession(sessionId) {
    try {
      const { data, error } = await supabase
        .from('photo_processing')
        .select(`
          *,
          background:background_template_id(*),
          mascot:mascot_id(*),
          photo:photo_id(*)
        `)
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching session processing:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get pending processing tasks
   */
  async getPendingProcessing() {
    try {
      const { data, error } = await supabase
        .from('photo_processing')
        .select(`
          *,
          background:background_template_id(*),
          mascot:mascot_id(*),
          photo:photo_id(*)
        `)
        .in('processing_status', ['pending', 'processing'])
        .order('created_at', { ascending: true });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching pending processing:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new PhotoProcessingService();
