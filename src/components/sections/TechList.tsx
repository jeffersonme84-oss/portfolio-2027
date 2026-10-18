import { skills, type SkillKey } from '@/content/skills'
import { useLocale } from '@/hooks/useLocale'
import { cn } from '@/lib/utils'

type TechListProps = {
  technologies: SkillKey[]
  label: string
  showNames?: boolean
  className?: string
}

// Ícones das tecnologias de um projeto (nomes visíveis no modal, só para leitores de tela na galeria).
export function TechList({ technologies, label, showNames = false, className }: TechListProps) {
  const { l } = useLocale()

  return (
    <ul aria-label={label} className={cn('flex flex-wrap items-center gap-3', className)}>
      {technologies.map((key) => {
        const skill = skills[key]
        const Icon = skill.icon
        const name = typeof skill.name === 'string' ? skill.name : l(skill.name)
        return (
          <li key={key} className="flex items-center gap-1.5" title={name}>
            <Icon className="size-4 shrink-0" aria-hidden />
            <span className={cn('text-xs', !showNames && 'sr-only')}>{name}</span>
          </li>
        )
      })}
    </ul>
  )
}
