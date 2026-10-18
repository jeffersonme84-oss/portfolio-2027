import type { CSSProperties } from 'react'
import { SectionHeading } from '@/components/sections/SectionHeading'
import { hardSkillGroups, skills, softSkills } from '@/content/skills'
import { useLocale } from '@/hooks/useLocale'

const subheading = 'mb-8 font-mono text-[11px] tracking-[0.2em] uppercase'

export function Skills() {
  const { t, l } = useLocale()

  return (
    <section
      id="habilidades"
      aria-labelledby="habilidades-titulo"
      className="mx-auto max-w-[1200px] px-4 py-24 md:px-6 md:py-32"
    >
      <SectionHeading id="habilidades-titulo">{t('skills.title')}</SectionHeading>

      <h3 className={subheading}>{t('skills.hard')}</h3>
      <div className="grid gap-x-12 gap-y-14 md:grid-cols-2">
        {hardSkillGroups.map((group) => (
          <div key={group.id}>
            <h4 className="mb-3 text-sm font-semibold">{l(group.title)}</h4>
            {/* Prateleira: cada skill é a lombada de uma fita K7 */}
            <ul className="flex min-h-40 flex-wrap items-end gap-2 border-b-4 border-foreground pb-0.5">
              {group.skills.map((key) => {
                const skill = skills[key]
                const Icon = skill.icon
                const name = typeof skill.name === 'string' ? skill.name : l(skill.name)
                const brand = 'color' in skill ? skill.color : undefined
                return (
                  <li
                    key={key}
                    style={{ '--brand': brand ?? 'currentColor' } as CSSProperties}
                    className="group flex h-36 w-11 origin-bottom flex-col items-center gap-3 rounded-t-sm border-2 border-b-0 border-foreground bg-background py-2 transition-transform duration-200 hover:-translate-y-1 hover:-rotate-3 motion-reduce:transition-none motion-reduce:hover:transform-none"
                  >
                    <Icon
                      className="size-5 shrink-0 transition-colors group-hover:text-[var(--brand)]"
                      aria-hidden
                    />
                    <span className="flex-1 overflow-hidden font-mono text-[10px] font-semibold tracking-[0.12em] whitespace-nowrap uppercase [writing-mode:vertical-rl]">
                      {name}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>

      <h3 className={`${subheading} mt-24`}>{t('skills.soft')}</h3>
      <ul className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {softSkills.map((skill) => {
          const Icon = skill.icon
          return (
            <li key={skill.id} className="flex gap-4 bg-background p-6">
              <Icon className="size-6 shrink-0" aria-hidden />
              <div>
                <h4 className="font-display text-lg leading-tight font-black tracking-[-0.02em] uppercase">
                  {l(skill.title)}
                </h4>
                <p className="mt-1 text-sm text-muted-foreground">{l(skill.text)}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
