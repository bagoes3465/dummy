const supabase = require('../database/supabase-client');

/**
 * Service untuk manage background templates
 */
class BackgroundService {
  /**
   * Get semua background templates yang aktif
   */
  async getAllBackgrounds(category = 'madiun') {
    try {
      const { data, error } = await supabase
        .from('background_templates')
        .select('*')
        .eq('is_active', true)
        .eq('category', category)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching backgrounds:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get background template by ID
   */
  async getBackgroundById(id) {
    try {
      const { data, error } = await supabase
        .from('background_templates')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching background:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Tambah background template baru
   */
  async createBackground(backgroundData) {
    try {
      const { data, error } = await supabase
        .from('background_templates')
        .insert([
          {
            template_name: backgroundData.template_name,
            description: backgroundData.description,
            thumbnail_url: backgroundData.thumbnail_url,
            image_url: backgroundData.image_url,
            category: backgroundData.category || 'madiun',
            template_config: backgroundData.template_config || {},
            is_active: true,
            created_by: backgroundData.created_by || 'admin'
          }
        ])
        .select();

      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Error creating background:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Update background template
   */
  async updateBackground(id, backgroundData) {
    try {
      const { data, error } = await supabase
        .from('background_templates')
        .update(backgroundData)
        .eq('id', id)
        .select();

      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Error updating background:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete background template
   */
  async deleteBackground(id) {
    try {
      const { error } = await supabase
        .from('background_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting background:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new BackgroundService();
