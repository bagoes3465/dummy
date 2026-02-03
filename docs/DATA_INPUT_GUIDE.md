# Panduan Memasukkan Data Background, Maskot, dan Filter

Ada 3 cara untuk memasukkan data ke dalam aplikasi Photobooth:

## Cara 1: Via Supabase Dashboard (Paling Mudah)

### Step 1: Buka Supabase Dashboard
1. Login ke [https://app.supabase.com](https://app.supabase.com)
2. Pilih project Anda
3. Klik **Table Editor** di sidebar kiri

### Step 2: Masukkan Data Background

1. Klik table `background_templates`
2. Klik tombol **+ Insert Row** atau **Insert**
3. Isi data berikut:

| Field | Nilai Contoh | Tipe |
|-------|-------------|------|
| template_name | "Pantai Madiun" | text |
| description | "Background pantai untuk foto summer" | text |
| thumbnail_url | "https://example.com/bg-pantai-thumb.jpg" | text |
| image_url | "https://example.com/bg-pantai-full.jpg" | text |
| category | "madiun" | text |
| template_config | `{}` atau `{"brightness": 0.8}` | jsonb |
| is_active | TRUE | boolean |
| created_by | "admin" | text |

4. Klik **Save**

### Step 3: Masukkan Data Maskot

1. Klik table `mascots`
2. Klik **+ Insert Row**
3. Isi data berikut:

| Field | Nilai Contoh | Tipe |
|-------|-------------|------|
| mascot_name | "Patungan Madiun" | text |
| description | "Maskot kota Madiun yang lucu" | text |
| image_url | "https://example.com/mascot-1.png" | text |
| thumbnail_url | "https://example.com/mascot-1-thumb.png" | text |
| mascot_config | `{"size": "medium"}` | jsonb |
| is_active | TRUE | boolean |
| created_by | "admin" | text |

4. Klik **Save**

### Step 4: Masukkan Data Filter

1. Klik table `ai_filters`
2. Klik **+ Insert Row**
3. Isi data berikut:

| Field | Nilai Contoh | Tipe |
|-------|-------------|------|
| filter_name | "Sepia Vintage" | text |
| description | "Filter warna sepia untuk efek vintage" | text |
| filter_config | `{"hue": 30, "saturation": 0.5}` | jsonb |
| is_active | TRUE | boolean |
| created_by | "admin" | text |

4. Klik **Save**

---

## Cara 2: Via SQL Script

Jalankan SQL queries ini di **SQL Editor** Supabase Dashboard:

### Tambah Background
```sql
INSERT INTO background_templates (template_name, description, thumbnail_url, image_url, category, template_config, is_active, created_by)
VALUES 
  ('Pantai Madiun', 'Background pantai untuk foto summer', 'https://example.com/bg-pantai-thumb.jpg', 'https://example.com/bg-pantai-full.jpg', 'madiun', '{"brightness": 0.8}', true, 'admin'),
  ('Gunung Wilis', 'Background gunung untuk petualangan', 'https://example.com/bg-gunung-thumb.jpg', 'https://example.com/bg-gunung-full.jpg', 'madiun', '{"contrast": 1.1}', true, 'admin'),
  ('Kota Malam', 'Background kota di malam hari', 'https://example.com/bg-kota-thumb.jpg', 'https://example.com/bg-kota-full.jpg', 'madiun', '{"brightness": 0.6}', true, 'admin');
```

### Tambah Maskot
```sql
INSERT INTO mascots (mascot_name, description, image_url, thumbnail_url, mascot_config, is_active, created_by)
VALUES 
  ('Patungan Kuning', 'Maskot utama kota Madiun', 'https://example.com/mascot-yellow.png', 'https://example.com/mascot-yellow-thumb.png', '{"size": "large"}', true, 'admin'),
  ('Patungan Biru', 'Varian maskot warna biru', 'https://example.com/mascot-blue.png', 'https://example.com/mascot-blue-thumb.png', '{"size": "medium"}', true, 'admin');
```

### Tambah Filter
```sql
INSERT INTO ai_filters (filter_name, description, filter_config, is_active, created_by)
VALUES 
  ('Sepia Vintage', 'Filter warna sepia untuk efek vintage', '{"hue": 30, "saturation": 0.5}', true, 'admin'),
  ('Black & White', 'Filter hitam putih klasik', '{"saturation": 0}', true, 'admin'),
  ('Vibrant Colors', 'Filter warna-warna cerah', '{"saturation": 1.5, "contrast": 1.2}', true, 'admin'),
  ('Cool Tone', 'Filter nada dingin biru', '{"hue": 200, "temperature": -20}', true, 'admin');
```

---

## Cara 3: Via API Endpoint (Programmatic)

Jika Anda ingin menambahkan data via API dari backend:

### Setup di Backend
1. Buka file `/src/routes/backgrounds.js`, tambahkan POST endpoint:

```javascript
// POST - Tambah background baru
router.post('/', async (req, res) => {
  try {
    const { template_name, description, thumbnail_url, image_url, category, template_config, created_by } = req.body;
    
    const { data, error } = await supabase
      .from('background_templates')
      .insert([
        {
          template_name,
          description,
          thumbnail_url,
          image_url,
          category: category || 'madiun',
          template_config: template_config || {},
          is_active: true,
          created_by: created_by || 'admin'
        }
      ])
      .select();
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Contoh Request via cURL atau Postman:

```bash
curl -X POST http://localhost:3001/api/backgrounds \
  -H "Content-Type: application/json" \
  -d '{
    "template_name": "Pantai Madiun",
    "description": "Background pantai untuk foto summer",
    "thumbnail_url": "https://example.com/bg-pantai-thumb.jpg",
    "image_url": "https://example.com/bg-pantai-full.jpg",
    "category": "madiun",
    "template_config": {"brightness": 0.8},
    "created_by": "admin"
  }'
```

---

## Format Data Detail

### Background Template
```json
{
  "template_name": "Pantai Madiun",
  "description": "Background pantai untuk foto summer",
  "thumbnail_url": "https://example.com/bg-pantai-thumb.jpg",
  "image_url": "https://example.com/bg-pantai-full.jpg",
  "category": "madiun",
  "template_config": {
    "brightness": 0.8,
    "contrast": 1.0,
    "blur_radius": 0
  },
  "is_active": true,
  "created_by": "admin"
}
```

### Mascot
```json
{
  "mascot_name": "Patungan Kuning",
  "description": "Maskot utama kota Madiun",
  "image_url": "https://example.com/mascot-yellow.png",
  "thumbnail_url": "https://example.com/mascot-yellow-thumb.png",
  "mascot_config": {
    "size": "large",
    "opacity": 1.0,
    "position": "center"
  },
  "is_active": true,
  "created_by": "admin"
}
```

### Filter
```json
{
  "filter_name": "Sepia Vintage",
  "description": "Filter warna sepia untuk efek vintage",
  "filter_config": {
    "hue": 30,
    "saturation": 0.5,
    "contrast": 1.0,
    "brightness": 0.9
  },
  "is_active": true,
  "created_by": "admin"
}
```

---

## Verifikasi Data

Setelah memasukkan data, verifikasi dengan cara berikut:

### Via Browser
1. Buka aplikasi Photobooth di `http://localhost:3001`
2. Pergi ke halaman Customize
3. Lihat apakah background, maskot, dan filter sudah muncul

### Via API
```bash
# Cek backgrounds
curl http://localhost:3001/api/backgrounds

# Cek mascots
curl http://localhost:3001/api/mascots

# Cek filters
curl http://localhost:3001/api/filters
```

---

## Upload Gambar ke Supabase Storage

Jika Anda belum punya URL gambar, ikuti langkah berikut:

1. Di Supabase Dashboard, klik **Storage** di sidebar
2. Buat bucket baru: `photobooth-assets`
3. Masukkan folder:
   - `backgrounds/` untuk background images
   - `mascots/` untuk mascot images
4. Upload gambar Anda ke folder tersebut
5. Salin public URL dari gambar (klik 3 dots → Copy public URL)
6. Gunakan URL tersebut di field `image_url` dan `thumbnail_url`

---

## Catatan Penting

- **Pastikan is_active = TRUE** jika ingin data ditampilkan di aplikasi
- **URL harus HTTPS atau public URL yang accessible** dari browser
- **Format image sebaiknya PNG (untuk mascot) atau JPG (untuk background)**
- **Thumbnail sebaiknya ukuran 200x200px untuk performa optimal**
- **Jangan lupa set created_by field** untuk tracking siapa yang membuat data
