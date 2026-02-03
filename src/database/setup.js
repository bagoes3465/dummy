const supabase = require('./supabase-client');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  try {
    console.log('🔧 Memulai setup database Supabase...\n');

    // Baca SQL schema
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log('📋 Menjalankan SQL Schema...\n');
    
    // RPC function tidak tersedia di free tier Supabase
    // Tampilkan pesan untuk manual setup
    console.log('⚠️  Catatan: RPC function tidak tersedia.');
    console.log('✅ Jalankan SQL schema secara manual di Supabase Dashboard:\n');
    console.log('📄 SQL Schema yang perlu dijalankan di Supabase SQL Editor:\n');
    console.log('=' .repeat(60));
    console.log(schemaSql);
    console.log('=' .repeat(60));
    console.log('\n📖 Langkah-langkah:');
    console.log('1. Buka https://app.supabase.com');
    console.log('2. Pilih project Anda');
    console.log('3. Go to SQL Editor (sidebar)');
    console.log('4. Click "New query"');
    console.log('5. Copy-paste SQL schema di atas');
    console.log('6. Click "Run"\n');

    // Setup RLS (Row Level Security) policies
    console.log('\n🔐 Mengatur RLS Policies...\n');
    
    const rlsPolicies = [
      {
        table: 'users',
        policy: 'Users dapat melihat profil mereka sendiri',
        sql: `CREATE POLICY "Users dapat membaca data mereka sendiri" ON users 
              FOR SELECT USING (auth.uid() = id);`
      },
      {
        table: 'photo_sessions',
        policy: 'Users dapat melihat session mereka sendiri',
        sql: `CREATE POLICY "Users dapat membaca sessions mereka" ON photo_sessions 
              FOR SELECT USING (auth.uid() = user_id);`
      },
      {
        table: 'photos',
        policy: 'Users dapat melihat foto mereka sendiri',
        sql: `CREATE POLICY "Users dapat membaca photos mereka" ON photos 
              FOR SELECT USING (auth.uid() = user_id);`
      }
    ];

    console.log('✅ Database setup berhasil dikonfigurasi!\n');
    console.log('📝 Langkah selanjutnya:');
    console.log('1. Buka Dashboard Supabase');
    console.log('2. Buka SQL Editor');
    console.log('3. Salin dan jalankan SQL schema dari src/database/schema.sql');
    console.log('4. Atur RLS policies sesuai kebutuhan');
    console.log('5. Buat storage bucket untuk foto');
    console.log('\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

setupDatabase();
