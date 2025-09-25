import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.VITE_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.SUPABASE_ANON_KEY;

const vars = import.meta.env;
const missingVars = [];
if (!supabaseUrl) missingVars.push("VITE_SUPABASE_URL");
if (!supabaseAnonKey) missingVars.push("VITE_SUPABASE_ANON_KEY");
if (missingVars.length > 0) {
  console.log("Environment variables:", vars);
  throw new Error(
    `Missing Supabase environment variable(s): ${missingVars.join(", ")}`,
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  db: { schema: "public" },
});
