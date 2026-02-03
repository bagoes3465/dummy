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
    console.error('Error fetching backgrounds:', error);
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
    console.error('Error fetching background:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
