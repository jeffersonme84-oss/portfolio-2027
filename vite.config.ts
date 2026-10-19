import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import { activeSocials, site } from './src/content/site'
import ptBR from './src/i18n/locales/pt-BR.json'

// SEO gerado a partir de src/content/site.ts (sem duplicar dados no index.html):
// JSON-LD Person, URLs absolutas de Open Graph e, com VITE_SITE_URL definido,
// canonical, robots.txt com sitemap e sitemap.xml.
function seo(siteUrl: string): Plugin {
  const base = siteUrl.replace(/\/$/, '')
  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.name,
    jobTitle: site.title['pt-BR'],
    address: { '@type': 'PostalAddress', addressLocality: 'São Paulo', addressCountry: 'BR' },
    sameAs: activeSocials().map(([, url]) => url),
    ...(base && { url: base, image: `${base}/og-image.png` }),
  }

  return {
    name: 'portfolio-seo',
    transformIndexHtml(html) {
      const tags = [
        `<link rel="preload" as="image" href="${site.hero.background.src}" imagesrcset="${site.hero.background.srcSet}" imagesizes="(min-width: 1024px) 48vw, 100vw" fetchpriority="high" />`,
        `<meta name="description" content="${ptBR.meta.description}" />`,
        `<meta property="og:title" content="${ptBR.meta.title}" />`,
        `<meta property="og:description" content="${ptBR.meta.description}" />`,
        `<meta property="og:image" content="${base}/og-image.png" />`,
        `<meta name="twitter:title" content="${ptBR.meta.title}" />`,
        `<meta name="twitter:description" content="${ptBR.meta.description}" />`,
        `<meta name="twitter:image" content="${base}/og-image.png" />`,
        `<script type="application/ld+json">${JSON.stringify(person)}</script>`,
      ]
      if (base) {
        tags.push(
          `<link rel="canonical" href="${base}/" />`,
          `<meta property="og:url" content="${base}/" />`,
        )
      }
      return html
        .replace(
          '<title>Jefferson Moreira Evangelista</title>',
          `<title>${ptBR.meta.title}</title>`,
        )
        .replace('</head>', `    ${tags.join('\n    ')}\n  </head>`)
    },
    generateBundle() {
      const robots = [
        'User-agent: *',
        'Allow: /',
        ...(base ? ['', `Sitemap: ${base}/sitemap.xml`] : []),
      ]
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `${robots.join('\n')}\n` })
      if (base) {
        this.emitFile({
          type: 'asset',
          fileName: 'sitemap.xml',
          source: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${base}/</loc><changefreq>monthly</changefreq><priority>1.0</priority></url>
</urlset>
`,
        })
      }
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  return {
    plugins: [react(), tailwindcss(), seo(env.VITE_SITE_URL ?? '')],
    resolve: {
      alias: { '@': path.resolve(__dirname, './src') },
    },
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
  }
})
