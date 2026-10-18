import { FunctionsHttpError } from '@supabase/supabase-js'
import { z } from 'zod'
import type { Locale } from '@/content/types'
import { getSupabase } from '@/lib/supabase'

// As mensagens são sufixos de chave i18n (contact.errors.*), traduzidas na tela.
export const contactSchema = z.object({
  name: z.string().trim().min(1, { error: 'nameRequired' }).max(100, { error: 'nameTooLong' }),
  email: z.email({ error: 'emailInvalid' }),
  message: z
    .string()
    .trim()
    .min(10, { error: 'messageTooShort' })
    .max(2000, { error: 'messageTooLong' }),
  // Honeypot: humanos não veem este campo; bots costumam preencher.
  website: z.string().optional(),
})

export type ContactValues = z.infer<typeof contactSchema>
export type ContactErrorKey = 'nameRequired' | 'nameTooLong' | 'emailInvalid' | 'messageTooShort' | 'messageTooLong'

export type SendResult = 'success' | 'error' | 'rateLimited' | 'unavailable'

// O cliente chama a Edge Function `send-contact`; nunca grava direto na tabela.
export async function sendContact(values: ContactValues, locale: Locale): Promise<SendResult> {
  if (values.website) return 'success' // bot: finge sucesso sem enviar

  const supabase = getSupabase()
  if (!supabase) return 'unavailable'

  const { error } = await supabase.functions.invoke('send-contact', {
    body: { name: values.name, email: values.email, message: values.message, locale },
  })
  if (!error) return 'success'
  if (error instanceof FunctionsHttpError && error.context instanceof Response) {
    if (error.context.status === 429) return 'rateLimited'
  }
  return 'error'
}
