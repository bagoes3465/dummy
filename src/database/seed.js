const supabase = require('./supabase-client');

async function seedDatabase() {
  try {
    console.log('🌱 Memulai seed database...\n');

    // Seed AI Filters
    console.log('Menambahkan AI Filters...');
    const filters = [
      {
        filter_name: 'Beauty Mode',
        description: 'Filter kecantikan dengan smoothing dan whitening',
        filter_config: JSON.stringify({
          smoothing: 0.8,
          whitening: 0.5,
          brightness: 0.1
        }),
        is_active: true,
        created_by: 'admin'
      },
      {
        filter_name: 'Vintage',
        description: 'Filter vintage dengan warna sepia',
        filter_config: JSON.stringify({
          sepia: 0.6,
          saturation: 0.4,
          contrast: 1.2
        }),
        is_active: true,
        created_by: 'admin'
      },
      {
        filter_name: 'Cool Tone',
        description: 'Filter tone dingin dengan blue shift',
        filter_config: JSON.stringify({
          blue_shift: 0.3,
          saturation: 1.1,
          contrast: 1.1
        }),
        is_active: true,
        created_by: 'admin'
      },
      {
        filter_name: 'B&W Classic',
        description: 'Filter hitam putih klasik',
        filter_config: JSON.stringify({
          grayscale: 1.0,
          contrast: 1.3
        }),
        is_active: true,
        created_by: 'admin'
      },
      {
        filter_name: 'Bokeh Effect',
        description: 'Efek bokeh untuk background blur',
        filter_config: JSON.stringify({
          blur_background: true,
          blur_strength: 0.7,
          focus_distance: 1.5
        }),
        is_active: true,
        created_by: 'admin'
      }
    ];

    const { error: filterError } = await supabase
      .from('ai_filters')
      .insert(filters);

    if (filterError) {
      console.log('ℹ️  AI Filters mungkin sudah ada atau:', filterError.message);
    } else {
      console.log('✅ AI Filters ditambahkan\n');
    }

    // Seed Background Templates (Madiun themed)
    console.log('Menambahkan Background Templates Madiun...');
    const backgrounds = [
      {
        template_name: 'Madiun Landmark',
        description: 'Background dengan landmark terkenal Madiun',
        thumbnail_url: 'https://via.placeholder.com/150?text=Madiun+Landmark',
        image_url: 'https://via.placeholder.com/1920x1080?text=Madiun+Landmark',
        category: 'madiun',
        template_config: JSON.stringify({
          position: 'full',
          opacity: 0.8,
          blur: 0
        }),
        is_active: true,
        created_by: 'admin'
      },
      {
        template_name: 'Madiun Culture',
        description: 'Background dengan motif budaya Madiun',
        thumbnail_url: 'https://via.placeholder.com/150?text=Madiun+Culture',
        image_url: 'https://via.placeholder.com/1920x1080?text=Madiun+Culture',
        category: 'madiun',
        template_config: JSON.stringify({
          position: 'full',
          opacity: 0.9,
          blur: 0
        }),
        is_active: true,
        created_by: 'admin'
      },
      {
        template_name: 'Madiun Festival',
        description: 'Background tema festival Madiun',
        thumbnail_url: 'https://via.placeholder.com/150?text=Madiun+Festival',
        image_url: 'https://via.placeholder.com/1920x1080?text=Madiun+Festival',
        category: 'madiun',
        template_config: JSON.stringify({
          position: 'full',
          opacity: 0.85,
          blur: 0
        }),
        is_active: true,
        created_by: 'admin'
      },
      {
        template_name: 'Studio White',
        description: 'Background putih polos untuk studio',
        thumbnail_url: 'https://via.placeholder.com/150?text=Studio+White',
        image_url: 'https://via.placeholder.com/1920x1080?text=Studio+White',
        category: 'madiun',
        template_config: JSON.stringify({
          position: 'full',
          opacity: 1.0,
          blur: 0,
          color: '#FFFFFF'
        }),
        is_active: true,
        created_by: 'admin'
      },
      {
        template_name: 'Bokeh Colorful',
        description: 'Background bokeh dengan warna-warni',
        thumbnail_url: 'https://via.placeholder.com/150?text=Bokeh+Colorful',
        image_url: 'https://via.placeholder.com/1920x1080?text=Bokeh+Colorful',
        category: 'madiun',
        template_config: JSON.stringify({
          position: 'full',
          opacity: 0.7,
          blur: 10,
          effect: 'bokeh'
        }),
        is_active: true,
        created_by: 'admin'
      }
    ];

    const { error: bgError } = await supabase
      .from('background_templates')
      .insert(backgrounds);

    if (bgError) {
      console.log('ℹ️  Background templates mungkin sudah ada atau:', bgError.message);
    } else {
      console.log('✅ Background templates ditambahkan\n');
    }

    // Seed Mascots (Maskot Madiun)
    console.log('Menambahkan Mascots Madiun...');
    const mascots = [
      {
        mascot_name: 'Roro Jonggrang',
        description: 'Maskot Madiun yang terinspirasi dari cerita Roro Jonggrang',
        thumbnail_url: 'https://via.placeholder.com/150?text=Roro+Jonggrang',
        image_url: 'https://via.placeholder.com/300x300?text=Roro+Jonggrang',
        image_layers: JSON.stringify([
          { type: 'body', url: 'body_layer.png' },
          { type: 'head', url: 'head_layer.png' },
          { type: 'accessories', url: 'accessories_layer.png' }
        ]),
        position_config: JSON.stringify({
          x: 80,
          y: 50,
          width: 200,
          height: 250,
          rotation: 0,
          flip: false
        }),
        is_active: true,
        created_by: 'admin'
      },
      {
        mascot_name: 'Madiun Mascot Classic',
        description: 'Maskot klasik Madiun dengan warna tradisional',
        thumbnail_url: 'https://via.placeholder.com/150?text=Madiun+Classic',
        image_url: 'https://via.placeholder.com/300x300?text=Madiun+Classic',
        image_layers: JSON.stringify([
          { type: 'base', url: 'base_layer.png' },
          { type: 'decoration', url: 'decoration_layer.png' }
        ]),
        position_config: JSON.stringify({
          x: 70,
          y: 60,
          width: 180,
          height: 220,
          rotation: 0,
          flip: false
        }),
        is_active: true,
        created_by: 'admin'
      },
      {
        mascot_name: 'Madiun Cultural Figure',
        description: 'Tokoh budaya Madiun dalam bentuk maskot',
        thumbnail_url: 'https://via.placeholder.com/150?text=Cultural+Figure',
        image_url: 'https://via.placeholder.com/300x300?text=Cultural+Figure',
        image_layers: JSON.stringify([
          { type: 'costume', url: 'costume_layer.png' },
          { type: 'face', url: 'face_layer.png' },
          { type: 'details', url: 'details_layer.png' }
        ]),
        position_config: JSON.stringify({
          x: 75,
          y: 55,
          width: 190,
          height: 240,
          rotation: 0,
          flip: false
        }),
        is_active: true,
        created_by: 'admin'
      }
    ];

    const { error: mascotError } = await supabase
      .from('mascots')
      .insert(mascots);

    if (mascotError) {
      console.log('ℹ️  Mascots mungkin sudah ada atau:', mascotError.message);
    } else {
      console.log('✅ Mascots ditambahkan\n');
    }

    console.log('✅ Database seeding selesai!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

seedDatabase();
