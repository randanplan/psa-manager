import { createClient } from '@supabase/supabase-js';

const env = import.meta.env.MODE || 'development';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;

// Validierung der Umgebungsvariablen
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase configuration missing:');
  console.error('URL:', supabaseUrl);
  console.error('Key:', supabaseAnonKey ? 'present' : 'missing');
  throw new Error('Supabase URL und Anon Key müssen gesetzt sein');
}

if (env === 'development') {
  console.log('Supabase URL:', supabaseUrl);
  console.log('Supabase Anon Key:', supabaseAnonKey ? '***' : 'nicht gesetzt');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});