// Edge Function send-contact (Deno).
// Valida os dados, aplica limite de taxa simples, grava em contact_messages
// (como anon, respeitando a RLS) e envia o e-mail ao Jefferson via Resend.
//
// Segredos (só no Supabase, nunca no front):
//   supabase secrets set RESEND_API_KEY=... CONTACT_TO_EMAIL=...
// Opcional: CONTACT_FROM_EMAIL (remetente verificado no Resend) e ALLOWED_ORIGIN.

import { createClient } from 'npm:@supabase/supabase-js@2'
import { z } from 'npm:zod@4'

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.email().max(254),
  message: z.string().trim().min(10).max(2000),
  locale: z.enum(['pt-BR', 'en-US']).default('pt-BR'),
  website: z.string().max(0).optional(), // honeypot
})

const corsHeaders = {
  'Access-Control-Allow-Origin': Deno.env.get('ALLOWED_ORIGIN') ?? '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// Limite de taxa simples por IP (memória da instância): 5 mensagens a cada 10 minutos.
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 5
const hits = new Map<string, number[]>()

function rateLimited(ip: string) {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > MAX_PER_WINDOW
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

function escapeHtml(text: string) {
  return text.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`)
}

async function sendEmail(data: z.infer<typeof schema>) {
  const apiKey = Deno.env.get('RESEND_API_KEY')
  const to = Deno.env.get('CONTACT_TO_EMAIL')
  if (!apiKey || !to) throw new Error('RESEND_API_KEY ou CONTACT_TO_EMAIL não configurados')

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: Deno.env.get('CONTACT_FROM_EMAIL') ?? 'Portfólio <onboarding@resend.dev>',
      to: [to],
      reply_to: data.email,
      subject: `Portfólio: nova mensagem de ${data.name}`,
      text: `${data.name} <${data.email}> (${data.locale})\n\n${data.message}`,
      html: `<p><strong>${escapeHtml(data.name)}</strong> &lt;${escapeHtml(data.email)}&gt; (${data.locale})</p><p style="white-space:pre-wrap">${escapeHtml(data.message)}</p>`,
    }),
  })
  if (!response.ok) throw new Error(`Resend ${response.status}: ${await response.text()}`)
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return json({ error: 'method_not_allowed' }, 405)

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (rateLimited(ip)) return json({ error: 'rate_limited' }, 429)

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return json({ error: 'invalid_json' }, 400)
  }

  const parsed = schema.safeParse(payload)
  if (!parsed.success) {
    // Honeypot preenchido: responde sucesso para não dar pista ao bot.
    if (typeof payload === 'object' && payload && 'website' in payload && payload.website) {
      return json({ ok: true })
    }
    return json({ error: 'invalid_data' }, 400)
  }
  const data = parsed.data

  // Grava como anon: a RLS só permite INSERT.
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!)
  const { error } = await supabase.from('contact_messages').insert({
    name: data.name,
    email: data.email,
    message: data.message,
    locale: data.locale,
  })
  if (error) {
    console.error('insert', error)
    return json({ error: 'storage_failed' }, 500)
  }

  try {
    await sendEmail(data)
  } catch (emailError) {
    // A mensagem já está salva no banco; registra a falha do e-mail sem perder o contato.
    console.error('email', emailError)
  }

  return json({ ok: true })
})
