#!/usr/bin/env node

/**
 * Script untuk menambahkan data Background, Mascot, dan Filter ke database
 * Gunakan: node insert-data.js
 */

const supabase = require('./src/database/supabase-client');

// Data template yang akan dimasukkan
const BACKGROUNDS = [
  {
    template_name: 'Pantai Madiun',
    description: 'Background pantai untuk foto summer',
    thumbnail_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&h=200&fit=crop',
    image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&fit=crop',
    category: 'madiun',
    template_config: { brightness: 0.8, contrast: 1.0 }
  },
  {
    template_name: 'Gunung Wilis',
    description: 'Background gunung untuk petualangan',
    thumbnail_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop',
    image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&fit=crop',
    category: 'madiun',
    template_config: { brightness: 0.9, contrast: 1.1 }
  },
  {
    template_name: 'Kota Malam',
    description: 'Background kota di malam hari',
    thumbnail_url: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=200&h=200&fit=crop',
    image_url: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&fit=crop',
    category: 'madiun',
    template_config: { brightness: 0.6, contrast: 1.1 }
  }
];

const MASCOTS = [
  {
    mascot_name: 'Patungan Kuning',
    description: 'Maskot utama kota Madiun yang ceria',
    image_url: 'https://via.placeholder.com/300x400/FFD700/000000?text=Patungan+Kuning',
    thumbnail_url: 'https://via.placeholder.com/100x100/FFD700/000000?text=Patungan',
    mascot_config: { size: 'large', opacity: 1.0, position: 'center' }
  },
  {
    mascot_name: 'Patungan Biru',
    description: 'Varian maskot warna biru',
    image_url: 'https://via.placeholder.com/300x400/4169E1/FFFFFF?text=Patungan+Biru',
    thumbnail_url: 'https://via.placeholder.com/100x100/4169E1/FFFFFF?text=Patungan',
    mascot_config: { size: 'medium', opacity: 0.95, position: 'center' }
  }
];

const FILTERS = [
  {
    filter_name: 'Sepia Vintage',
    description: 'Filter warna sepia untuk efek vintage',
    filter_config: { hue: 30, saturation: 0.5, contrast: 1.0, brightness: 0.9 }
  },
  {
    filter_name: 'Black & White',
    description: 'Filter hitam putih klasik',
    filter_config: { saturation: 0, contrast: 1.2, brightness: 1.0 }
  },
  {
    filter_name: 'Vibrant Colors',
    description: 'Filter warna-warna cerah',
    filter_config: { saturation: 1.5, contrast: 1.2, brightness: 1.05 }
  },
  {
    filter_name: 'Cool Tone',
    description: 'Filter nada dingin biru',
    filter_config: { hue: 200, saturation: 0.8, temperature: -20 }
  },
  {
    filter_name: 'Warm Tone',
    description: 'Filter nada hangat oranye',
    filter_config: { hue: 20, saturation: 0.8, temperature: 20 }
  }
];

async function insertData() {
  try {
    console.log('🚀 Memulai memasukkan data...\n');

    // Insert Backgrounds
    console.log('📸 Memasukkan Background Templates...');
    const backgroundsWithDefaults = BACKGROUNDS.map(bg => ({
      ...bg,
      is_active: true,
      created_by: 'admin'
    }));
    
    const { data: bgData, error: bgError } = await supabase
      .from('background_templates')
      .insert(backgroundsWithDefaults)
      .select();
    
    if (bgError) throw bgError;
    console.log(`✅ ${bgData.length} background(s) ditambahkan\n`);

    // Insert Mascots
    console.log('🎭 Memasukkan Mascot Data...');
    const mascotsWithDefaults = MASCOTS.map(m => ({
      ...m,
      is_active: true,
      created_by: 'admin'
    }));
    
    const { data: mascotData, error: mascotError } = await supabase
      .from('mascots')
      .insert(mascotsWithDefaults)
      .select();
    
    if (mascotError) throw mascotError;
    console.log(`✅ ${mascotData.length} mascot(s) ditambahkan\n`);

    // Insert Filters
    console.log('🎨 Memasukkan AI Filters...');
    const filtersWithDefaults = FILTERS.map(f => ({
      ...f,
      is_active: true,
      created_by: 'admin'
    }));
    
    const { data: filterData, error: filterError } = await supabase
      .from('ai_filters')
      .insert(filtersWithDefaults)
      .select();
    
    if (filterError) throw filterError;
    console.log(`✅ ${filterData.length} filter(s) ditambahkan\n`);

    console.log('🎉 Semua data berhasil ditambahkan!');
    console.log('\n📊 Ringkasan:');
    console.log(`   - Backgrounds: ${bgData.length}`);
    console.log(`   - Mascots: ${mascotData.length}`);
    console.log(`   - Filters: ${filterData.length}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the script
insertData();
