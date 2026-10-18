import { useTranslation } from 'react-i18next'
import type { Localized } from '@/content/types'
import { getLanguage } from '@/i18n'

// Idioma ativo e helper para ler campos { 'pt-BR', 'en-US' } de src/content/.
export function useLocale() {
  const { t } = useTranslation()
  const locale = getLanguage()
  const l = (text: Localized) => text[locale]
  return { t, locale, l }
}
