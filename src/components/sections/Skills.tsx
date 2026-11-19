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
  const groups = usePager(hardSkillGroups, desktop ? 9 : tablet ? 4 : 3)
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
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-2">
        <SectionHeading id="habilidades-titulo">{t('skills.title')}</SectionHeading>
        {/* Cargo em uma linha: Forward Deployed Engineer */}
        <p className="mb-6 max-w-sm text-sm text-muted-foreground md:mb-8 md:text-right">
          <strong className="font-semibold text-foreground">{t('skills.fde')}</strong>{' '}
          {t('skills.fdeLine')}
        </p>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-4 md:mb-5">
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
          // Todas as frentes de uma vez: cada cartão é um "canal" com número, título, para que
          // serve no trabalho de FDE e as habilidades (ícone + nome, lidos na horizontal).
          <ul className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {groups.items.map((group) => {
              const number = String(hardSkillGroups.indexOf(group) + 1).padStart(2, '0')
              return (
                <li
                  key={group.id}
                  className="group/card relative rounded-xl border border-border bg-background px-4 py-3 transition-[border-color,translate,box-shadow] duration-300 hover:border-foreground hover:shadow-[4px_4px_0_var(--foreground)] motion-safe:hover:-translate-x-0.5 motion-safe:hover:-translate-y-0.5"
                >
                  <div className="flex items-center gap-2.5">
                    {/* Número em visor de contador (detalhe retro) */}
                    <span
                      aria-hidden
                      className="rounded-[4px] bg-[#141412] px-1.5 py-0.5 font-mono text-[10.5px] font-bold tracking-[0.08em] text-[#f2efe9] tabular-nums"
                    >
                      {number}
                    </span>
                    <h3 className="font-display text-base leading-none font-black tracking-[-0.02em] uppercase">
                      {l(group.title)}
                    </h3>
                    {/* Medidor VU: as barras sobem com o mouse no cartão */}
                    <span aria-hidden className="skill-vu ml-auto">
                      <i />
                      <i />
                      <i />
                      <i />
                    </span>
                  </div>
                  <p className="mt-1.5 mb-2.5 border-b border-dashed border-border pb-2 font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
                    {l(group.role)}
                  </p>
                  <ul className="flex flex-wrap gap-1.5">
                    {group.skills.map((key) => {
                      const skill = skills[key]
                      const Icon = skill.icon
                      const name = typeof skill.name === 'string' ? skill.name : l(skill.name)
                      const brand = 'color' in skill ? skill.color : undefined
                      return (
                        <li
                          key={key}
                          style={{ '--brand': brand ?? 'currentColor' } as CSSProperties}
                          className="group/skill inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[12.5px] leading-none transition-colors hover:border-foreground"
                        >
                          <Icon
                            aria-hidden
                            className="size-3.5 shrink-0 transition-colors group-hover/card:text-[var(--brand)]"
                          />
                          {name}
                        </li>
                      )
                    })}
                  </ul>
                </li>
              )
            })}
          </ul>
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
