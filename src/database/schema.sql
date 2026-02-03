-- Tabel Users untuk menyimpan data pengguna
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE,
  username VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabel Photo Sessions untuk menyimpan sesi fotografi
CREATE TABLE IF NOT EXISTS photo_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_name VARCHAR(255),
  session_date TIMESTAMP DEFAULT NOW(),
  total_photos INTEGER DEFAULT 0,
  ai_filter_applied BOOLEAN DEFAULT FALSE,
  filter_type VARCHAR(50),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabel Photos untuk menyimpan file foto
CREATE TABLE IF NOT EXISTS photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES photo_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  original_url VARCHAR(500),
  processed_url VARCHAR(500),
  thumbnail_url VARCHAR(500),
  ai_analysis JSONB DEFAULT '{}',
  filters_applied JSONB DEFAULT '[]',
  photo_number INTEGER,
  taken_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabel AI Filters untuk menyimpan metadata filter AI
CREATE TABLE IF NOT EXISTS ai_filters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filter_name VARCHAR(100) UNIQUE,
  description TEXT,
  filter_config JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_by VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabel Face Recognition untuk menyimpan data face detection
CREATE TABLE IF NOT EXISTS face_recognition_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  photo_id UUID REFERENCES photos(id) ON DELETE CASCADE,
  face_count INTEGER,
  face_data JSONB,
  emotion VARCHAR(50),
  face_quality_score FLOAT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabel Analytics untuk menyimpan data penggunaan
CREATE TABLE IF NOT EXISTS analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES photo_sessions(id) ON DELETE CASCADE,
  event_type VARCHAR(50),
  event_details JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Storage Bucket untuk menyimpan foto (konfigurasi di Storage)
-- Jalankan pernyataan ini melalui dashboard Supabase atau API

-- Create indexes untuk performa
CREATE INDEX IF NOT EXISTS idx_photo_sessions_user_id ON photo_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_photos_session_id ON photos(session_id);
CREATE INDEX IF NOT EXISTS idx_photos_user_id ON photos(user_id);
CREATE INDEX IF NOT EXISTS idx_face_recognition_photo_id ON face_recognition_data(photo_id);
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_session_id ON analytics(session_id);

-- Tabel Background Templates untuk background replacement
CREATE TABLE IF NOT EXISTS background_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_name VARCHAR(100),
  description TEXT,
  thumbnail_url VARCHAR(500),
  image_url VARCHAR(500),
  category VARCHAR(50) DEFAULT 'madiun',
  template_config JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_by VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabel Mascots untuk maskot Madiun
CREATE TABLE IF NOT EXISTS mascots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mascot_name VARCHAR(100),
  description TEXT,
  thumbnail_url VARCHAR(500),
  image_url VARCHAR(500),
  image_layers JSONB,
  position_config JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_by VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabel Download Links dengan QR Code
CREATE TABLE IF NOT EXISTS download_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  photo_id UUID REFERENCES photos(id) ON DELETE CASCADE,
  session_id UUID REFERENCES photo_sessions(id) ON DELETE CASCADE,
  download_code VARCHAR(20) UNIQUE,
  qr_code_url VARCHAR(500),
  download_url VARCHAR(500),
  password VARCHAR(100),
  expires_at TIMESTAMP,
  download_count INTEGER DEFAULT 0,
  max_downloads INTEGER DEFAULT -1,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabel Photo Processing untuk track background & mascot applied
CREATE TABLE IF NOT EXISTS photo_processing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  photo_id UUID REFERENCES photos(id) ON DELETE CASCADE,
  session_id UUID REFERENCES photo_sessions(id) ON DELETE CASCADE,
  background_template_id UUID REFERENCES background_templates(id),
  mascot_id UUID REFERENCES mascots(id),
  processing_status VARCHAR(50) DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
  processing_error TEXT,
  processing_metadata JSONB,
  processed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabel Download Analytics untuk tracking downloads
CREATE TABLE IF NOT EXISTS download_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  download_link_id UUID REFERENCES download_links(id) ON DELETE CASCADE,
  photo_id UUID REFERENCES photos(id) ON DELETE CASCADE,
  downloader_info JSONB,
  device_type VARCHAR(50),
  ip_address VARCHAR(45),
  downloaded_at TIMESTAMP DEFAULT NOW()
);

-- Audit logging - track perubahan
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name VARCHAR(100),
  record_id UUID,
  action VARCHAR(50),
  old_values JSONB,
  new_values JSONB,
  changed_by VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes untuk performa
CREATE INDEX IF NOT EXISTS idx_background_templates_category ON background_templates(category);
CREATE INDEX IF NOT EXISTS idx_background_templates_is_active ON background_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_mascots_is_active ON mascots(is_active);
CREATE INDEX IF NOT EXISTS idx_download_links_photo_id ON download_links(photo_id);
CREATE INDEX IF NOT EXISTS idx_download_links_session_id ON download_links(session_id);
CREATE INDEX IF NOT EXISTS idx_download_links_download_code ON download_links(download_code);
CREATE INDEX IF NOT EXISTS idx_photo_processing_photo_id ON photo_processing(photo_id);
CREATE INDEX IF NOT EXISTS idx_photo_processing_background_id ON photo_processing(background_template_id);
CREATE INDEX IF NOT EXISTS idx_photo_processing_mascot_id ON photo_processing(mascot_id);
CREATE INDEX IF NOT EXISTS idx_download_analytics_download_link_id ON download_analytics(download_link_id);
