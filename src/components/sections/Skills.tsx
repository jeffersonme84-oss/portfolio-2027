import { useState, type CSSProperties } from 'react'
import { SectionHeading } from '@/components/sections/SectionHeading'
import { Pager } from '@/components/ui/pager'
import { hardSkillGroups, skills, softSkills } from '@/content/skills'
import { useLocale } from '@/hooks/useLocale'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { usePager } from '@/hooks/usePager'
import { screenSection } from '@/lib/layout'
import { cn } from '@/lib/utils'

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
  const [tab, setTab] = useState<'hard' | 'soft'>('hard')
  const desktop = useMediaQuery('(min-width: 1024px)')
  const tablet = useMediaQuery('(min-width: 640px)')
  // Uma tela por seção: todos os grupos no desktop; menos por página em telas menores.
  const groups = usePager(hardSkillGroups, desktop ? 8 : tablet ? 4 : 2)
  const soft = usePager(softSkills, desktop ? 6 : tablet ? 4 : 3)
  const pager = tab === 'hard' ? groups : soft

  const tabs = [
    { id: 'hard', label: t('skills.tabs.hard') },
    { id: 'soft', label: t('skills.tabs.soft') },
  ] as const

  return (
    <section
      id="habilidades"
      aria-labelledby="habilidades-titulo"
      className={cn(screenSection, 'mx-auto w-full max-w-[1200px] px-4 md:px-6')}
    >
      <SectionHeading id="habilidades-titulo">{t('skills.title')}</SectionHeading>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-4 md:mb-6">
        <div
          role="tablist"
          aria-label={t('skills.title')}
          className="inline-flex rounded-full border border-border p-1"
        >
          {tabs.map((item) => (
            <button
              key={item.id}
              id={`habilidades-aba-${item.id}`}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              aria-controls="habilidades-painel"
              onClick={() => setTab(item.id)}
              onKeyDown={(event) => {
                if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
                  const next = tab === 'hard' ? 'soft' : 'hard'
                  setTab(next)
                  document.getElementById(`habilidades-aba-${next}`)?.focus()
                }
              }}
              tabIndex={tab === item.id ? 0 : -1}
              className={cn(
                'rounded-full px-4 py-1.5 font-mono text-[11px] tracking-[0.16em] uppercase transition-colors',
                tab === item.id ? 'bg-foreground text-background' : 'hover:text-accent',
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
        <Pager
          page={pager.page}
          pages={pager.pages}
          onChange={pager.goTo}
          label={tab === 'hard' ? t('skills.hard') : t('skills.soft')}
        />
      </div>

      <div id="habilidades-painel" role="tabpanel" aria-labelledby={`habilidades-aba-${tab}`}>
        {tab === 'hard' ? (
          <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
            {groups.items.map((group) => (
              <div key={group.id}>
                <h3 className="mb-2 text-center text-sm font-semibold">{l(group.title)}</h3>
                {/* Prateleira: cada skill é a lombada de uma fita K7 */}
                <ul className="flex min-h-32 flex-wrap items-end justify-center gap-1.5 border-b-4 border-foreground pb-0.5">
                  {group.skills.map((key) => {
                    const skill = skills[key]
                    const Icon = skill.icon
                    const name = typeof skill.name === 'string' ? skill.name : l(skill.name)
                    const brand = 'color' in skill ? skill.color : undefined
                    return (
                      <li
                        key={key}
                        style={{ '--brand': brand ?? 'currentColor' } as CSSProperties}
                        className="group flex h-28 w-9 origin-bottom flex-col items-center gap-2 rounded-t-sm border-2 border-b-0 border-foreground bg-background py-1.5 transition-transform duration-200 hover:-translate-y-1 hover:-rotate-3 motion-reduce:transition-none motion-reduce:hover:transform-none"
                      >
                        <Icon
                          className="size-4 shrink-0 transition-colors group-hover:text-[var(--brand)]"
                          aria-hidden
                        />
                        <span className="flex-1 overflow-hidden font-mono text-[9px] font-semibold tracking-[0.1em] whitespace-nowrap uppercase [writing-mode:vertical-rl]">
                          {name}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <ul className="grid border-t border-l border-border sm:grid-cols-2 lg:grid-cols-3">
            {soft.items.map((skill, position) => {
              const Icon = skill.icon
              const effect = softHover[(soft.offset + position) % softHover.length]
              return (
                <li
                  key={skill.id}
                  className={cn(
                    'group relative flex gap-4 border-r border-b border-border bg-background p-5 transition-[background-color,color,box-shadow,translate] duration-300',
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
                    <h3 className="font-display text-lg leading-tight font-black tracking-[-0.02em] uppercase">
                      {l(skill.title)}
                    </h3>
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
        )}
      </div>
    </section>
  )
}
