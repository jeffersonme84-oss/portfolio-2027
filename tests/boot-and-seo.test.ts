import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { bootProgress } from '../src/lib/bootProgress'
import { contentSecurityPolicy, inlineScriptHashes } from '../vite/seo-plugin'

describe('tela de carregamento (bootProgress)', () => {
  it('nunca devolve NaN, mesmo com tempo negativo (1º quadro)', () => {
    for (const raw of [-0.5, -0.01, 0, 0.3, 0.6, 0.9, 1, 1.5]) {
      expect(Number.isFinite(bootProgress(raw)), String(raw)).toBe(true)
    }
  })

  it('começa em 0, termina em 1 e nunca volta para trás', () => {
    expect(bootProgress(0)).toBe(0)
    expect(bootProgress(1)).toBe(1)
    let previous = -1
    for (let i = 0; i <= 100; i++) {
      const value = bootProgress(i / 100)
      expect(value).toBeGreaterThanOrEqual(previous)
      previous = value
    }
  })
})

describe('segurança: Content-Security-Policy (vite/seo-plugin.ts)', () => {
  const sha = (body: string) => `'sha256-${createHash('sha256').update(body).digest('base64')}'`

  it('gera o hash só dos scripts inline executáveis', () => {
    const html = [
      '<script>console.log(1)</script>',
      '<script type="module" src="/src/main.tsx"></script>',
      '<script type="application/ld+json">{"a":1}</script>',
    ].join('\n')
    expect(inlineScriptHashes(html)).toEqual([sha('console.log(1)')])
  })

  it('cobre o script de tema do index.html', () => {
    const html = readFileSync('index.html', 'utf8')
    expect(inlineScriptHashes(html)).toHaveLength(1)
  })

  it('não libera eval nem scripts de outros domínios', () => {
    const csp = contentSecurityPolicy(["'sha256-abc'"])
    const scriptSrc = csp.split('; ').find((rule) => rule.startsWith('script-src'))
    expect(scriptSrc).toBe("script-src 'self' 'sha256-abc'")
    expect(csp).not.toContain('unsafe-eval')
    expect(csp).toContain("object-src 'none'")
  })
})
