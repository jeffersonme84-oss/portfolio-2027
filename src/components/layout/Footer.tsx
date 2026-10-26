import { ArrowUp } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ExternalLink } from '@/components/layout/ExternalLink'
import { socialIcons } from '@/components/layout/socialIcons'
import { activeSocials, site } from '@/content/site'

export function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()
  const ref = useRef<HTMLElement>(null)

  // Publica a altura do rodapé em --footer-h: o Fale comigo desconta essa altura e os dois
  // juntos ocupam exatamente uma tela.
  useEffect(() => {
    const footer = ref.current
    if (!footer) return
    const root = document.documentElement
    const observer = new ResizeObserver(() =>
      root.style.setProperty('--footer-h', `${footer.offsetHeight}px`),
    )
    observer.observe(footer)
    return () => {
      observer.disconnect()
      root.style.removeProperty('--footer-h')
    }
  }, [])

  return (
    <footer ref={ref} className="border-t border-border">
      {/* Celular: redes e "voltar ao topo" na mesma linha, direitos embaixo (rodapé baixo). */}
      <div className="mx-auto grid max-w-[1200px] grid-cols-[1fr_auto] items-center gap-x-4 gap-y-3 px-4 py-4 md:flex md:justify-between md:px-6 md:py-6">
        <ul aria-label={t('social.label')} className="flex flex-wrap gap-2">
          {activeSocials().map(([network, url]) => {
            const Icon = socialIcons[network]
            return (
              <li key={network}>
                <ExternalLink
                  href={url}
                  className="flex size-10 items-center justify-center border border-border transition-colors hover:border-foreground"
                >
                  <Icon className="size-4" aria-hidden />
                  <span className="sr-only">{t(`social.${network}`)}</span>
                </ExternalLink>
              </li>
            )
          })}
        </ul>
        <p className="order-last col-span-2 text-[11px] text-muted-foreground md:order-none md:text-xs">
          © {year} {site.name}. {t('footer.rights')}
        </p>
        <a
          href="#inicio"
          className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] hover:text-accent"
        >
          {t('footer.backToTop')}
          <ArrowUp className="size-4" aria-hidden />
        </a>
      </div>
    </footer>
  )
}
