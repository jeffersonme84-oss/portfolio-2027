import { createClient } from '@supabase/supabase-js'

// Apenas a anon key no front. O service_role nunca entra neste projeto.
const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  throw new Error('Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY (veja .env.example).')
}

export const supabase = createClient(url, anonKey)
