import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { SiWhatsapp } from 'react-icons/si'
import { ExternalLink } from '@/components/layout/ExternalLink'
import { socialIcons } from '@/components/layout/socialIcons'
import { site } from '@/content/site'

const buttonClass =
  'flex size-11 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:border-foreground hover:bg-foreground hover:text-background'

type FloatingContactsProps = {
  // Controles extras (ex.: botão de som do Módulo 9) empilhados acima dos contatos.
  children?: ReactNode
}

// Atalhos fixos de WhatsApp e LinkedIn, a um clique de qualquer ponto da página.
export function FloatingContacts({ children }: FloatingContactsProps) {
  const { t } = useTranslation()
  const LinkedIn = socialIcons.linkedin

  return (
    <aside
      aria-label={t('floating.label')}
      className="fixed right-4 bottom-4 z-30 flex flex-col items-center gap-2"
    >
      {children}
      {site.social.linkedin && (
        <ExternalLink href={site.social.linkedin} className={buttonClass}>
          <LinkedIn className="size-4" aria-hidden />
          <span className="sr-only">{t('floating.linkedin')}</span>
        </ExternalLink>
      )}
      <ExternalLink href={site.whatsappUrl} className={buttonClass}>
        <SiWhatsapp className="size-5" aria-hidden />
        <span className="sr-only">{t('floating.whatsapp')}</span>
      </ExternalLink>
    </aside>
  )
}
