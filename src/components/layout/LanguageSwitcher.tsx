import { useTranslation } from 'react-i18next'
import { PillToggle } from '@/components/layout/PillToggle'
import type { Locale } from '@/content/types'
import { getLanguage, setLanguage } from '@/i18n'

export function LanguageSwitcher() {
  // useTranslation re-renderiza o componente quando o idioma muda.
  const { t } = useTranslation()

  return (
    <PillToggle<Locale>
      variant="radiogroup"
      label={t('language.label')}
      value={getLanguage()}
      onChange={setLanguage}
      options={[
        { value: 'pt-BR', label: t('language.pt-BR'), content: t('language.short.pt-BR') },
        { value: 'en-US', label: t('language.en-US'), content: t('language.short.en-US') },
      ]}
    />
  )
}
