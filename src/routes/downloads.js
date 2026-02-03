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
    const download_url = `http://localhost:${process.env.APP_PORT || 3000}/api/downloads/${link_id}/file`;
    
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
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
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
    console.error('Error generating download link:', error);
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
    res.json({
      success: true,
      photo_id: photoData.photo_id,
      message: 'File download ready'
    });
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
