const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase configuration');
  console.error('SUPABASE_URL:', supabaseUrl ? 'set' : 'NOT SET');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'set' : 'NOT SET');
  console.error('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? 'set' : 'NOT SET');
  throw new Error('Supabase URL dan API Key harus didefinisikan di .env');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
