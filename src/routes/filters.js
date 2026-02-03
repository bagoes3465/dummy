const express = require('express');
const supabase = require('../database/supabase-client');
const router = express.Router();

// GET all filters
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('ai_filters')
      .select('*')
      .eq('is_active', true);
    
    if (error) throw error;
    
    res.json({ success: true, count: data.length, data });
  } catch (error) {
    console.error('Error fetching filters:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET specific filter
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
    console.error('Error fetching filter:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
