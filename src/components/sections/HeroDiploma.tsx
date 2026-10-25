import { useLocale } from '@/hooks/useLocale'

// Diploma emoldurado na parede da cena da Home (Fatec Zona Sul · DSM, timeline.ts).
// Texto em HTML (nítido e traduzível); estilo e posição em hero.css (.hero-diploma).
export function HeroDiploma() {
  const { t } = useLocale()

  return (
    <figure className="hero-card hero-diploma">
      <div className="hero-diploma-mat">
        <p className="hero-diploma-kicker">{t('hero.diploma.kicker')}</p>
        <p className="hero-diploma-school">Fatec Zona Sul</p>
        <p className="hero-diploma-course">{t('hero.diploma.course')}</p>
        <div aria-hidden className="hero-diploma-foot">
          <span className="hero-diploma-sign" />
          <span className="hero-diploma-seal" />
        </div>
      </div>
      <figcaption className="sr-only">{t('hero.diploma.caption')}</figcaption>
    </figure>
  )
}
