import { createClient } from '@supabase/supabase-js';

const env = import.meta.env.MODE || 'development';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

// Debug-Informationen für Vercel
console.log('Environment:', env);
console.log('Available env vars:', Object.keys(import.meta.env));
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL ? 'set' : 'not set');
console.log('PUBLIC_SUPABASE_URL:', import.meta.env.PUBLIC_SUPABASE_URL ? 'set' : 'not set');
console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'set' : 'not set');
console.log('PUBLIC_SUPABASE_ANON_KEY:', import.meta.env.PUBLIC_SUPABASE_ANON_KEY ? 'set' : 'not set');

// Validierung der Umgebungsvariablen
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase configuration missing:');
  console.error('URL:', supabaseUrl);
  console.error('Key:', supabaseAnonKey ? 'present' : 'missing');
  throw new Error('Supabase URL und Anon Key müssen gesetzt sein');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});