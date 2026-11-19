import { describe, expect, it } from 'vitest'
import ptBR from '../src/i18n/locales/pt-BR.json'
import { contactSchema } from '../src/lib/contact'

// Validação do formulário "Fale comigo" (a Edge Function send-contact repete as mesmas regras).

const valid = { name: 'Maria Silva', email: 'maria@empresa.com', message: 'Olá! Vi seu portfólio.' }

// Chave de erro (sufixo de contact.errors.*) do primeiro problema encontrado.
function errorOf(values: Record<string, string>) {
  const result = contactSchema.safeParse(values)
  return result.success ? null : result.error.issues[0].message
}

describe('formulário de contato (src/lib/contact.ts)', () => {
  it('aceita uma mensagem válida e tira espaços das pontas', () => {
    const result = contactSchema.parse({ ...valid, name: '  Maria Silva  ' })
    expect(result.name).toBe('Maria Silva')
  })

  it('recusa nome vazio, e-mail inválido e mensagem curta ou longa', () => {
    expect(errorOf({ ...valid, name: '   ' })).toBe('nameRequired')
    expect(errorOf({ ...valid, name: 'a'.repeat(101) })).toBe('nameTooLong')
    expect(errorOf({ ...valid, email: 'maria@' })).toBe('emailInvalid')
    expect(errorOf({ ...valid, message: 'curta' })).toBe('messageTooShort')
    expect(errorOf({ ...valid, message: 'a'.repeat(2001) })).toBe('messageTooLong')
  })

  it('toda chave de erro tem tradução em contact.errors', () => {
    const keys = [
      'nameRequired',
      'nameTooLong',
      'emailInvalid',
      'messageTooShort',
      'messageTooLong',
    ]
    for (const key of keys) expect(ptBR.contact.errors).toHaveProperty(key)
  })
})
