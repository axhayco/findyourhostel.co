// ─── Supabase Client ─────────────────────────────────────────────────────────
// Drop this file at:  src/integrations/supabase/client.ts
//
// Your project ID: mlnvpxagdcqcayedjhld
// Get your anon key from:
//   Supabase Dashboard → Settings → API → "anon public" key

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://mlnvpxagdcqcayedjhld.supabase.co";

// Reads the anon key from the .env file (VITE_SUPABASE_ANON_KEY).
// Fallback to the hardcoded value if the env var is missing.
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sbnZweGFnZGNxY2F5ZWRqaGxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxOTE2NDAsImV4cCI6MjA4OTc2NzY0MH0.FnbT8tWSYqCBgIP2GpAfgvU756OG39dq7Sr86giJncU";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true, // required for Google OAuth redirect
  },
});