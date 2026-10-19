import type { CSSProperties } from 'react'
import { SectionHeading } from '@/components/sections/SectionHeading'
import { hardSkillGroups, skills, softSkills } from '@/content/skills'
import { useLocale } from '@/hooks/useLocale'
import { cn } from '@/lib/utils'

const subheading = 'mb-8 font-mono text-[11px] tracking-[0.2em] uppercase'

// Cada soft skill tem uma interação de hover própria (ciclo pela posição na lista).
// Movimentos só com animações ligadas (motion-safe); cores mudam sempre.
const softHover = [
  // peça de quebra-cabeça que encaixa: card inverte e o ícone gira
  {
    card: 'hover:bg-foreground hover:text-background',
    icon: 'motion-safe:group-hover:rotate-90 motion-safe:group-hover:scale-110',
    text: 'group-hover:text-background/70',
  },
  // conversa: barra de acento sobe pela lateral e o balão balança
  {
    card: 'before:absolute before:inset-y-0 before:left-0 before:w-1 before:origin-bottom before:scale-y-0 before:bg-accent before:transition-transform before:duration-300 hover:before:scale-y-100',
    icon: 'group-hover:text-accent motion-safe:group-hover:animate-nudge',
    text: '',
  },
  // tempo: os ponteiros dão uma volta completa
  {
    card: '',
    icon: 'group-hover:text-accent motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-hover:rotate-[360deg]',
    text: 'group-hover:text-foreground',
  },
  // equipe: card se destaca com sombra editorial dura
  {
    card: 'hover:z-10 hover:shadow-[6px_6px_0_var(--foreground)] motion-safe:hover:-translate-x-0.5 motion-safe:hover:-translate-y-0.5',
    icon: 'motion-safe:group-hover:scale-125',
    text: '',
  },
  // ideia: a lâmpada acende
  {
    card: 'hover:bg-[radial-gradient(circle_at_15%_30%,color-mix(in_oklab,var(--accent)_18%,transparent),transparent_65%)]',
    icon: 'group-hover:text-accent group-hover:drop-shadow-[0_0_10px_var(--accent)]',
    text: '',
  },
]

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
      <ul className="grid border-t border-l border-border sm:grid-cols-2 lg:grid-cols-3">
        {softSkills.map((skill, index) => {
          const Icon = skill.icon
          const effect = softHover[index % softHover.length]
          return (
            <li
              key={skill.id}
              className={cn(
                'group relative flex gap-4 border-r border-b border-border bg-background p-6 transition-[background-color,color,box-shadow,translate] duration-300',
                effect.card,
              )}
            >
              <Icon
                className={cn(
                  'size-6 shrink-0 transition-[color,scale,rotate] duration-300',
                  effect.icon,
                )}
                aria-hidden
              />
              <div>
                <h4 className="font-display text-lg leading-tight font-black tracking-[-0.02em] uppercase">
                  {l(skill.title)}
                </h4>
                <p
                  className={cn(
                    'mt-1 text-sm text-muted-foreground transition-colors',
                    effect.text,
                  )}
                >
                  {l(skill.text)}
                </p>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
