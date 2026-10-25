import { GraduationCap } from 'lucide-react'
import { skills } from '@/content/skills'
import { studying } from '@/content/studying'
import { useLocale } from '@/hooks/useLocale'
import { cn } from '@/lib/utils'

// Cartão "Estudando agora", sobreposto ao retrato da Home. Estilos em hero.css (.study-*).
// Mostra os 3 primeiros estudos (2 no celular); a lista completa fica no "Sobre".
export function StudyPanel() {
  const { t, l } = useLocale()

  return (
    <aside aria-labelledby="estudos-titulo" className="study-panel">
      <header className="study-head">
        <span aria-hidden className="study-icon">
          <GraduationCap />
        </span>
        <div className="min-w-0">
          <p id="estudos-titulo" className="study-title">
            {t('hero.study.title')}
          </p>
          <p className="study-subtitle">{t('hero.study.subtitle')}</p>
        </div>
        <span aria-hidden className="study-rec">
          ● REC
        </span>
      </header>

      <ul className="study-list">
        {studying.slice(0, 3).map((item) => {
          const Icon = skills[item.icon].icon
          return (
            <li key={item.id} className="study-row">
              <span aria-hidden className="study-icon">
                <Icon />
              </span>
              <div className="min-w-0">
                <p className="study-row-title">{l(item.title)}</p>
                <p className="study-row-detail">{l(item.detail)}</p>
              </div>
              <span className={cn('study-status', `is-${item.status}`)}>
                {t(`hero.study.status.${item.status}`)}
                <span className="sr-only"> · {item.year}</span>
              </span>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
