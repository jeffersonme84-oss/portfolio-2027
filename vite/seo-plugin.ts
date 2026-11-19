import { createHash } from 'node:crypto'
import type { Plugin } from 'vite'
import { activeSocials, site } from '../src/content/site'
import ptBR from '../src/i18n/locales/pt-BR.json'

// Plugin do Vite que monta o <head> a partir de src/content/site.ts (sem duplicar dados no
// index.html):
// - meta description, Open Graph, Twitter Card e JSON-LD Person;
// - pré-carregamento da arte da Home do tema certo (escuro ou claro);
// - com VITE_SITE_URL definido: canonical, og:url, sitemap.xml e robots.txt com sitemap;
// - no build: Content-Security-Policy com o hash de cada <script> inline.

// Hash SHA-256 (base64) de cada <script> inline executável do HTML. Scripts com `src` e
// JSON-LD (que o navegador não executa) ficam de fora.
export function inlineScriptHashes(html: string) {
  const scripts = html.matchAll(
    /<script(?![^>]*\bsrc=)(?![^>]*application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/g,
  )
  return [...scripts].map(
    ([, body]) => `'sha256-${createHash('sha256').update(body, 'utf8').digest('base64')}'`,
  )
}

// Política de segurança de conteúdo do site. Tudo vem do próprio domínio, exceto o Supabase
// (formulário, contador e presença em tempo real). `frame-ancestors` não funciona em <meta>:
// fica no vercel.json, junto dos outros cabeçalhos.
export function contentSecurityPolicy(scriptHashes: string[]) {
  return [
    "default-src 'self'",
    `script-src 'self' ${scriptHashes.join(' ')}`.trim(),
    // React usa style="" (posições da Home, variáveis CSS): precisa de 'unsafe-inline' em estilos.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    // data: = fontes pequenas que o Vite embute no CSS (sem elas, alguns caracteres mudam).
    "font-src 'self' data:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
    "media-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-src 'none'",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
  ].join('; ')
}

// Pré-carrega só a arte da Home do tema que vai aparecer (o script de tema do index.html já
// rodou e pôs ou não a classe `dark`). Antes, a arte escura era baixada também no tema claro.
function preloadHeroArt() {
  const dark = JSON.stringify(site.hero.background.src)
  const light = JSON.stringify(site.hero.backgroundLight)
  return `<script>(function(){try{var l=document.createElement('link');l.rel='preload';l.as='image';l.setAttribute('fetchpriority','high');l.href=document.documentElement.classList.contains('dark')?${dark}:${light};document.head.appendChild(l)}catch(e){}})()</script>`
}

export function seo(siteUrl: string): Plugin {
  // trim() também tira espaços e BOM invisível que podem vir colados no valor da variável.
  const base = siteUrl.trim().replace(/\/$/, '')
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
    transformIndexHtml: {
      order: 'post',
      handler(html, context) {
        const tags = [
          preloadHeroArt(),
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
        let result = html
          .replace(
            '<title>Jefferson Moreira Evangelista</title>',
            `<title>${ptBR.meta.title}</title>`,
          )
          .replace('</head>', `    ${tags.join('\n    ')}\n  </head>`)

        // Só no build (no `pnpm dev` o Vite injeta scripts próprios de recarga).
        if (context.bundle) {
          const csp = contentSecurityPolicy(inlineScriptHashes(result))
          result = result.replace(
            '<meta charset="UTF-8" />',
            `<meta charset="UTF-8" />\n    <meta http-equiv="Content-Security-Policy" content="${csp}" />`,
          )
        }
        return result
      },
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
