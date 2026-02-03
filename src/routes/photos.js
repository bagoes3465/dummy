const express = require('express');
const supabase = require('../database/supabase-client');
const PhotoProcessingService = require('../services/photo-processing-service');
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
    console.error('Error creating session:', error);
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
    
    // For now, just store metadata
    // Face detection will be implemented in Phase 4
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
        face_count: 0,
        created_at: new Date().toISOString()
      })
      .select();
    
    if (error) throw error;
    
    res.json({
      success: true,
      photo_id,
      session_id,
      faces_detected: 0,
      data: data[0]
    });
  } catch (error) {
    console.error('Error uploading photo:', error);
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
    console.error('Error fetching photos:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get specific photo
router.get('/:photo_id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .eq('photo_id', req.params.photo_id)
      .single();
    
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Photo not found' });
    
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching photo:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/photos/process - Full processing pipeline
router.post('/process', async (req, res) => {
  try {
    const { 
      photo_id, 
      background_id, 
      filter_id, 
      watermark_text,
      remove_background,
      blur_faces,
      pixelate_faces,
      frame_type
    } = req.body;
    
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
    if (!photoData) return res.status(404).json({ error: 'Photo not found' });
    
    // Get filter config if needed
    let filterConfig = null;
    if (filter_id) {
      const { data: filterData } = await supabase
        .from('ai_filters')
        .select('filter_config')
        .eq('id', filter_id)
        .single();
      filterConfig = filterData?.filter_config ? JSON.parse(filterData.filter_config) : null;
    }
    
    // Process photo using the service
    const result = await PhotoProcessingService.processPhoto(
      photoData.original_image_path,
      {
        backgroundId: background_id,
        filterId: filter_id,
        filterConfig: filterConfig,
        watermarkText: watermark_text || 'Photobooth AI',
        removeBackground: remove_background || false,
        faces: [],
        frameType: frame_type,
        blurFaces: blur_faces || false,
        pixelateFaces: pixelate_faces || false
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
      steps: result.steps,
      message: `Photo processed in ${result.steps} steps`
    });
  } catch (error) {
    console.error('Error processing photo:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/photos/batch-process - Process multiple photos
router.post('/batch-process', async (req, res) => {
  try {
    const { photo_ids, background_id, filter_id, watermark_text } = req.body;
    
    if (!photo_ids || !Array.isArray(photo_ids) || photo_ids.length === 0) {
      return res.status(400).json({ error: 'photo_ids array required' });
    }
    
    const results = [];
    
    for (const photoId of photo_ids) {
      try {
        const { data: photoData } = await supabase
          .from('photos')
          .select('*')
          .eq('photo_id', photoId)
          .single();
        
        if (!photoData) continue;
        
        let filterConfig = null;
        if (filter_id) {
          const { data: filterData } = await supabase
            .from('ai_filters')
            .select('filter_config')
            .eq('id', filter_id)
            .single();
          filterConfig = filterData?.filter_config ? JSON.parse(filterData.filter_config) : null;
        }
        
        const result = await PhotoProcessingService.processPhoto(
          photoData.original_image_path,
          {
            backgroundId: background_id,
            filterId: filter_id,
            filterConfig: filterConfig,
            watermarkText: watermark_text || 'Photobooth AI'
          }
        );
        
        results.push({
          photo_id: photoId,
          success: result.success,
          processed_path: result.processedPath
        });
      } catch (error) {
        results.push({
          photo_id: photoId,
          success: false,
          error: error.message
        });
      }
    }
    
    res.json({
      success: true,
      processed: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results
    });
  } catch (error) {
    console.error('Error batch processing photos:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
