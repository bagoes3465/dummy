const supabase = require('../database/supabase-client');

/**
 * Service untuk manage mascots (maskot Madiun)
 */
class MascotService {
  /**
   * Get semua mascots yang aktif
   */
  async getAllMascots() {
    try {
      const { data, error } = await supabase
        .from('mascots')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching mascots:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get mascot by ID
   */
  async getMascotById(id) {
    try {
      const { data, error } = await supabase
        .from('mascots')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching mascot:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Tambah mascot baru
   */
  async createMascot(mascotData) {
    try {
      const { data, error } = await supabase
        .from('mascots')
        .insert([
          {
            mascot_name: mascotData.mascot_name,
            description: mascotData.description,
            thumbnail_url: mascotData.thumbnail_url,
            image_url: mascotData.image_url,
            image_layers: mascotData.image_layers || [],
            position_config: mascotData.position_config || {
              x: 50,
              y: 50,
              width: 200,
              height: 200,
              rotation: 0
            },
            is_active: true,
            created_by: mascotData.created_by || 'admin'
          }
        ])
        .select();

      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Error creating mascot:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Update mascot
   */
  async updateMascot(id, mascotData) {
    try {
      const { data, error } = await supabase
        .from('mascots')
        .update(mascotData)
        .eq('id', id)
        .select();

      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Error updating mascot:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete mascot
   */
  async deleteMascot(id) {
    try {
      const { error } = await supabase
        .from('mascots')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting mascot:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new MascotService();
