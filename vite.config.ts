import { readFileSync } from 'node:fs'
import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'
import { seo } from './vite/seo-plugin'

// Cabeçalhos de segurança do vercel.json também no `pnpm preview`, para testar localmente
// o site como ele roda em produção.
type VercelHeaders = { headers: { source: string; headers: { key: string; value: string }[] }[] }
const vercel = JSON.parse(readFileSync('./vercel.json', 'utf8')) as VercelHeaders
const securityHeaders = Object.fromEntries(
  (vercel.headers.find((rule) => rule.source === '/(.*)')?.headers ?? []).map(({ key, value }) => [
    key,
    value,
  ]),
)

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  return {
    plugins: [react(), tailwindcss(), seo(env.VITE_SITE_URL ?? '')],
    resolve: {
      alias: { '@': path.resolve(__dirname, './src') },
    },
    preview: { headers: securityHeaders },
    build: {
      rollupOptions: {
        onwarn(warning, warn) {
          // O zod 4 traz comentários @__PURE__ em posições que o Rollup ignora: aviso inofensivo
          // de dependência. Avisos do nosso código continuam aparecendo.
          if (warning.code === 'INVALID_ANNOTATION' && warning.id?.includes('node_modules')) return
          warn(warning)
        },
      },
    },
    // Testes automatizados (pnpm test): ficam em tests/ e rodam no Node.
    test: {
      include: ['tests/**/*.test.ts'],
      environment: 'node',
    },
  }
})
