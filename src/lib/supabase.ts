import type { SupabaseClient } from '@supabase/supabase-js'

// Apenas a anon key no front.
const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let client: Promise<SupabaseClient> | null = null

// Carregado sob demanda (só no envio do formulário) para não pesar a primeira dobra.
// Sem as variáveis VITE_* (ex.: preview sem env), retorna null em vez de derrubar o site;
// o formulário de contato mostra uma mensagem amigável.
export function getSupabase(): Promise<SupabaseClient> | null {
  if (!url || !anonKey) return null
  client ??= import('@supabase/supabase-js').then(({ createClient }) => createClient(url, anonKey))
  return client
}
