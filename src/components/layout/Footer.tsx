import { ArrowUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ExternalLink } from '@/components/layout/ExternalLink'
import { socialIcons } from '@/components/layout/socialIcons'
import { activeSocials, site } from '@/content/site'

export function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between md:px-6">
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
        <p className="text-xs text-muted-foreground">
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
