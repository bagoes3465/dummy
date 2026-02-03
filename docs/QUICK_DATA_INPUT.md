# Quick Reference: Memasukkan Data

## ⚡ Cara Cepat (3 Pilihan)

### Opsi 1: Pakai Script Otomatis (Paling Cepat)
```bash
# Jalankan script ini dari root folder project
node insert-data.js
```
Ini akan langsung menambahkan sample data (3 backgrounds, 2 mascots, 5 filters).

### Opsi 2: Pakai Supabase Dashboard (Paling Mudah)
1. Buka [https://app.supabase.com](https://app.supabase.com)
2. Login & pilih project
3. Klik **Table Editor**
4. Pilih table → **Insert Row**
5. Isi data & **Save**

### Opsi 3: Pakai SQL (Fleksibel)
Copy-paste ke **SQL Editor** di Supabase:

**Tambah 1 Background:**
```sql
INSERT INTO background_templates 
(template_name, description, thumbnail_url, image_url, category, template_config, is_active, created_by)
VALUES 
('Pantai Biru', 'Background pantai yang indah', 
 'https://example.com/thumb.jpg', 
 'https://example.com/full.jpg', 
 'madiun', '{"brightness": 0.8}', true, 'admin');
```

**Tambah 1 Mascot:**
```sql
INSERT INTO mascots 
(mascot_name, description, image_url, thumbnail_url, mascot_config, is_active, created_by)
VALUES 
('Patungan Kuning', 'Maskot utama Madiun', 
 'https://example.com/mascot.png', 
 'https://example.com/mascot-thumb.png', 
 '{"size": "large"}', true, 'admin');
```

**Tambah 1 Filter:**
```sql
INSERT INTO ai_filters 
(filter_name, description, filter_config, is_active, created_by)
VALUES 
('Sepia', 'Efek sepia vintage', 
 '{"hue": 30, "saturation": 0.5}', true, 'admin');
```

---

## 📋 Struktur Data

### Background Template
```json
{
  "template_name": "Nama Background",
  "description": "Deskripsi singkat",
  "thumbnail_url": "URL gambar thumbnail (200x200px)",
  "image_url": "URL gambar full size",
  "category": "madiun", // atau kategori lain
  "template_config": {
    "brightness": 0.8,    // 0-1
    "contrast": 1.0       // 0-2
  },
  "is_active": true,      // true untuk tampil di app
  "created_by": "admin"   // nama creator
}
```

### Mascot
```json
{
  "mascot_name": "Nama Maskot",
  "description": "Deskripsi maskot",
  "image_url": "URL gambar maskot (PNG recommended)",
  "thumbnail_url": "URL thumbnail (100x100px)",
  "mascot_config": {
    "size": "large",      // small, medium, large
    "opacity": 1.0,       // 0-1
    "position": "center"  // center, left, right
  },
  "is_active": true,
  "created_by": "admin"
}
```

### Filter
```json
{
  "filter_name": "Nama Filter",
  "description": "Deskripsi efek filter",
  "filter_config": {
    "hue": 30,           // 0-360
    "saturation": 0.5,   // 0-2
    "contrast": 1.0,     // 0-2
    "brightness": 0.9    // 0-2
  },
  "is_active": true,
  "created_by": "admin"
}
```

---

## 🖼️ Cara Upload Gambar ke Supabase

1. **Buka Storage di Supabase Dashboard**
   - Klik **Storage** di sidebar kiri

2. **Buat Bucket**
   - Klik **Create new bucket**
   - Nama: `photobooth-assets`
   - Pilih **Public** untuk public access

3. **Buat Folder (Opsional)**
   - Masuk ke bucket
   - Klik **Upload folder**
   - Buat: `backgrounds/`, `mascots/`, `filters/`

4. **Upload Gambar**
   - Drag & drop atau klik **Upload**
   - Pilih file gambar Anda

5. **Copy Public URL**
   - Klik 3 dots (...) di file
   - Klik **Copy public URL**
   - Gunakan URL ini di field `image_url` atau `thumbnail_url`

---

## ✅ Verifikasi Data

**Cek via API:**
```bash
# Terminal/PowerShell
curl http://localhost:3001/api/backgrounds
curl http://localhost:3001/api/mascots
curl http://localhost:3001/api/filters
```

**Cek di Browser:**
1. Buka aplikasi di `http://localhost:3001`
2. Pergi ke halaman **Customize**
3. Lihat apakah data sudah muncul

**Cek di Database:**
1. Buka Supabase Dashboard
2. Klik **Table Editor**
3. Lihat isi table `background_templates`, `mascots`, `ai_filters`

---

## 🚨 Troubleshooting

| Masalah | Solusi |
|---------|--------|
| Data tidak muncul di app | Cek `is_active = true` di database |
| Gambar tidak muncul | Cek URL image accessible (bukan localhost) |
| Error "404 not found" | Pastikan field required sudah diisi |
| Perlu ubah data | Edit langsung di Supabase Dashboard |

---

## 📚 File Referensi

- **Panduan Detail**: [DATA_INPUT_GUIDE.md](DATA_INPUT_GUIDE.md)
- **Script Auto**: [../../insert-data.js](../../insert-data.js)
- **Database Schema**: [../../src/database/schema.sql](../../src/database/schema.sql)
- **API Routes**: 
  - [../../src/routes/backgrounds.js](../../src/routes/backgrounds.js)
  - [../../src/routes/mascots.js](../../src/routes/mascots.js)
  - [../../src/routes/filters.js](../../src/routes/filters.js)
