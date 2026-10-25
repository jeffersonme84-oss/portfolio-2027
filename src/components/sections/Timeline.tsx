import { useRef, useState, type KeyboardEvent } from 'react'
import { VhsPhoto } from '@/components/retro/VhsPhoto'
import { Pager } from '@/components/ui/pager'
import { timeline } from '@/content/timeline'
import { useLocale } from '@/hooks/useLocale'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { usePager } from '@/hooks/usePager'
import { cn } from '@/lib/utils'

// Timecode determinístico por item, só decorativo (ex.: 00:14:32).
function timecode(index: number) {
  const seconds = 7 * 60 + index * 437
  const pad = (value: number) => String(value).padStart(2, '0')
  return `00:${pad(Math.floor(seconds / 60) % 60)}:${pad(seconds % 60)}`
}

// Trajetória em "lista + detalhe", para caber em uma tela: a lista é paginada e o item
// escolhido aparece ao lado (abaixo, no celular), com foto e detalhes. Setas navegam.
export function Timeline() {
  const { t, l } = useLocale()
  const tablet = useMediaQuery('(min-width: 768px)')
  const perPage = tablet ? 4 : 3
  const pager = usePager(timeline, perPage)
  const [selected, setSelected] = useState(0)
  const buttons = useRef(new Map<number, HTMLButtonElement>())
  const item = timeline[selected]

  function select(index: number, focus = false) {
    setSelected(index)
    pager.goTo(Math.floor(index / perPage))
    // Depois de trocar de página, o botão novo só existe no próximo quadro.
    if (focus) requestAnimationFrame(() => buttons.current.get(index)?.focus())
  }

  function onKeyDown(event: KeyboardEvent, index: number) {
    const last = timeline.length - 1
    const target = {
      ArrowDown: Math.min(index + 1, last),
      ArrowRight: Math.min(index + 1, last),
      ArrowUp: Math.max(index - 1, 0),
      ArrowLeft: Math.max(index - 1, 0),
      Home: 0,
      End: last,
    }[event.key]
    if (target === undefined) return
    event.preventDefault()
    select(target, true)
  }

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-8">
      {/* min-w-0: os títulos truncados não podem esticar a coluna além da tela. */}
      <div className="flex min-w-0 flex-col gap-4">
        <ol aria-label={t('about.timeline')} className="relative flex flex-col">
          {/* Linha fina da fita */}
          <span aria-hidden className="absolute top-2 bottom-2 left-[5px] w-px bg-border" />
          {pager.items.map((entry, position) => {
            const index = pager.offset + position
            const active = index === selected
            return (
              <li key={entry.id} className="relative pl-6">
                <span
                  aria-hidden
                  className={cn(
                    'absolute top-3 left-0 size-[11px] rounded-full border-2 border-foreground bg-background transition-colors',
                    active && 'border-accent bg-accent',
                  )}
                />
                <button
                  ref={(node) => {
                    if (node) buttons.current.set(index, node)
                    else buttons.current.delete(index)
                  }}
                  type="button"
                  aria-pressed={active}
                  aria-controls="trajetoria-detalhe"
                  onClick={() => select(index)}
                  onKeyDown={(event) => onKeyDown(event, index)}
                  className={cn(
                    'group w-full cursor-pointer rounded-md px-3 py-2 text-left transition-colors',
                    active ? 'bg-foreground/[0.06]' : 'hover:bg-foreground/[0.03]',
                  )}
                >
                  <span className="flex items-center justify-between gap-3 font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
                    <span className="truncate">
                      {entry.period} · {t(`about.types.${entry.type}`)}
                    </span>
                    <span aria-hidden className={cn('shrink-0', active && 'text-foreground')}>
                      {active ? `${t('about.play')} ▶` : '❚❚'}
                    </span>
                  </span>
                  <span
                    className={cn(
                      'mt-0.5 block truncate font-display text-base leading-tight font-black tracking-[-0.02em] uppercase md:text-lg',
                      active ? 'text-accent' : 'group-hover:text-accent',
                    )}
                  >
                    {l(entry.title)}
                  </span>
                  {entry.subtitle && (
                    <span className="block truncate text-xs text-muted-foreground">
                      {l(entry.subtitle)}
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ol>
        <Pager
          page={pager.page}
          pages={pager.pages}
          // Trocar de página já mostra o primeiro item dela no detalhe.
          onChange={(page) => select(page * perPage)}
          label={t('about.timeline')}
          className="pl-6"
        />
      </div>

      {/* Detalhe do item escolhido */}
      <article
        id="trajetoria-detalhe"
        aria-live="polite"
        aria-label={`${t('about.detail')}: ${l(item.title)}`}
        className="flex gap-4 rounded-lg border border-border p-4 md:gap-5 md:p-5"
      >
        {item.photo && item.photoAlt && (
          <VhsPhoto
            key={item.id}
            src={item.photo}
            alt={l(item.photoAlt)}
            timecode={timecode(selected)}
            revealsIllustration={item.revealsIllustration}
            className="mx-0 w-24 shrink-0 md:w-40"
          />
        )}
        <div className="min-w-0">
          <p className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
            {item.period} · {t(`about.types.${item.type}`)}
          </p>
          <h3 className="mt-1 font-display text-xl leading-tight font-black tracking-[-0.02em] uppercase md:text-2xl">
            {l(item.title)}
          </h3>
          {item.subtitle && <p className="mt-1 text-sm font-medium">{l(item.subtitle)}</p>}
          <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-muted-foreground md:mt-3 md:line-clamp-none">
            {l(item.details)}
          </p>
        </div>
      </article>
    </div>
  )
}
