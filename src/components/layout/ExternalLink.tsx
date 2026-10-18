import type { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'

// Link para fora do site: nova aba, sem acesso ao opener, com aviso para leitores de tela.
export function ExternalLink({ children, ...props }: Omit<ComponentProps<'a'>, 'target' | 'rel'>) {
  const { t } = useTranslation()
  return (
    <a target="_blank" rel="noopener noreferrer" {...props}>
      {children}
      <span className="sr-only"> {t('social.newTab')}</span>
    </a>
  )
}
