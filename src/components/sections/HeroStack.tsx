import { skills, type Skill } from '@/content/skills'
import { heroStack } from '@/content/studying'
import { useLocale } from '@/hooks/useLocale'

// Pílula com os ícones das tecnologias, sobreposta ao topo do retrato da Home (estilo em hero.css).
export function HeroStack() {
  const { t, l } = useLocale()
  const skillName = (skill: Skill) => (typeof skill.name === 'string' ? skill.name : l(skill.name))

  return (
    <ul aria-label={t('hero.study.stack')} className="hero-stack">
      {heroStack.map((key) => {
        const skill: Skill = skills[key]
        const Icon = skill.icon
        const name = skillName(skill)
        return (
          <li key={key} title={name} style={{ '--brand': skill.color } as React.CSSProperties}>
            <Icon aria-hidden />
            <span className="sr-only">{name}</span>
          </li>
        )
      })}
    </ul>
  )
}
