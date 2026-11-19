import { describe, expect, it } from 'vitest'
import enUS from '../src/i18n/locales/en-US.json'
import ptBR from '../src/i18n/locales/pt-BR.json'

// Transforma { a: { b: 'x' } } em { 'a.b': 'x' } para comparar os dois idiomas.
function flatten(value: unknown, prefix = ''): Record<string, unknown> {
  if (value === null || typeof value !== 'object' || Array.isArray(value))
    return { [prefix]: value }
  return Object.entries(value).reduce<Record<string, unknown>>(
    (all, [key, child]) => ({ ...all, ...flatten(child, prefix ? `${prefix}.${key}` : key) }),
    {},
  )
}

const pt = flatten(ptBR)
const en = flatten(enUS)

// Pega as variáveis de interpolação, como {{count}}.
const placeholders = (text: unknown) =>
  typeof text === 'string' ? [...text.matchAll(/{{\s*(\w+)\s*}}/g)].map((m) => m[1]).sort() : []

describe('traduções (src/i18n/locales)', () => {
  it('pt-BR e en-US têm exatamente as mesmas chaves', () => {
    expect(Object.keys(en).sort()).toEqual(Object.keys(pt).sort())
  })

  it('nenhum texto está vazio', () => {
    const empty = Object.entries({ ...pt, ...en }).filter(([, text]) => text === '')
    expect(empty).toEqual([])
  })

  it('as variáveis {{...}} são as mesmas nos dois idiomas', () => {
    const different = Object.keys(pt).filter(
      (key) => placeholders(pt[key]).join() !== placeholders(en[key]).join(),
    )
    expect(different).toEqual([])
  })

  it('as listas (ex.: boot.log) têm o mesmo tamanho', () => {
    const lists = Object.keys(pt).filter((key) => Array.isArray(pt[key]))
    for (const key of lists) {
      expect((en[key] as unknown[]).length, key).toBe((pt[key] as unknown[]).length)
    }
  })
})
