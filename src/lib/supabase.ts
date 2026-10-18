import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Apenas a anon key no front.
const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let client: SupabaseClient | null = null

// Sem as variáveis VITE_* (ex.: preview sem env), retorna null em vez de derrubar o site;
// o formulário de contato mostra uma mensagem amigável.
export function getSupabase(): SupabaseClient | null {
  if (!url || !anonKey) return null
  client ??= createClient(url, anonKey)
  return client
}
