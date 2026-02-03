# Solusi Network Error di CustomizeScreen

## Masalah
Error: `AxiosError: Network Error` saat membuka CustomizeScreen.jsx

## Root Cause
Backend server pada port 3000 tidak berjalan. Frontend mencoba memanggil API endpoints:
- `GET http://localhost:3000/api/backgrounds`
- `GET http://localhost:3000/api/filters`
- `GET http://localhost:3000/api/mascots`

Tetapi tidak ada server yang listening di port 3000.

## Solusi yang Diterapkan

### 1. Backend Server Dimulai ✅
Backend server sekarang berjalan di **port 3000** dengan perintah:
```bash
npm run dev
```

### 2. Environment Variables Fixed ✅
File `.env` sudah dikonfigurasi dengan benar dengan:
- `SUPABASE_URL=https://mmsgocylzeckgetqxhdm.supabase.co`
- `SUPABASE_ANON_KEY=sb_publishable_...`
- `APP_PORT=3000`

### 3. Supabase Client Updated ✅
Modified `src/database/supabase-client.js` untuk fallback ke `SUPABASE_ANON_KEY` jika `SUPABASE_SERVICE_ROLE_KEY` tidak tersedia.

## Cara Menjalankan

### Terminal 1: Start Backend Server
```bash
cd e:\!project\project_photobooth
npm run dev
```
Tunggu hingga muncul:
```
✅ Server running on http://localhost:3000
```

### Terminal 2: Start Frontend (sudah running di 3001)
```bash
cd e:\!project\project_photobooth\frontend
npm run dev
```

## Verifikasi

### Cek Backend
```bash
# Via PowerShell
powershell -Command "(Invoke-RestMethod -Uri 'http://localhost:3000/api/health').status"
# Output: "ok"
```

### Cek di Browser
1. Buka `http://localhost:3001`
2. Pergi ke CustomizeScreen
3. Seharusnya tidak ada error, data akan loading

### Cek API Endpoints
```bash
# Backgrounds
powershell -Command "Invoke-RestMethod -Uri 'http://localhost:3000/api/backgrounds'" | ConvertTo-Json

# Filters
powershell -Command "Invoke-RestMethod -Uri 'http://localhost:3000/api/filters'" | ConvertTo-Json

# Mascots
powershell -Command "Invoke-RestMethod -Uri 'http://localhost:3000/api/mascots'" | ConvertTo-Json
```

## Setup Permanent (Windows)

Buat file `start-dev.bat` di root folder:
```batch
@echo off
echo Starting Photobooth Development Environment...
start cmd /k "cd e:\!project\project_photobooth && npm run dev"
timeout /t 3
start cmd /k "cd e:\!project\project_photobooth\frontend && npm run dev"
echo Both servers started!
pause
```

Jalankan `start-dev.bat` setiap kali ingin development.

## Troubleshooting

| Masalah | Solusi |
|---------|--------|
| Port 3000 sudah terpakai | `taskkill /F /IM node.exe` lalu restart |
| Supabase connection error | Cek `.env` SUPABASE_URL dan SUPABASE_ANON_KEY |
| Backend error di terminal | Lihat pesan error di terminal, biasanya missing dependencies |
| Frontend masih error | Refresh browser cache (Ctrl+Shift+Del) |

## Status Sekarang
✅ Backend running di port 3000
✅ Frontend running di port 3001  
✅ API endpoints ready
⏳ Tunggu data (backgrounds, mascots, filters) untuk ditambahkan via script atau Supabase Dashboard
