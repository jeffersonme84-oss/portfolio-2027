import { useRef, useState, type KeyboardEvent } from 'react'
import { VhsPhoto } from '@/components/retro/VhsPhoto'
import { timeline } from '@/content/timeline'
import { useLocale } from '@/hooks/useLocale'
import { cn } from '@/lib/utils'

// Timecode determinístico por item, só decorativo (ex.: 00:14:32).
function timecode(index: number) {
  const seconds = 7 * 60 + index * 437
  const pad = (value: number) => String(value).padStart(2, '0')
  return `00:${pad(Math.floor(seconds / 60) % 60)}:${pad(seconds % 60)}`
}

// Timeline vertical em accordion: um item aberto por vez, setas para navegar.
export function Timeline() {
  const { t, l } = useLocale()
  const [openId, setOpenId] = useState<string | null>(null)
  // Itens já abertos mantêm a foto montada (a animação de fechar não perde a imagem).
  const [seen, setSeen] = useState<ReadonlySet<string>>(new Set())

  function toggle(id: string) {
    const next = openId === id ? null : id
    setOpenId(next)
    if (next) setSeen((current) => new Set(current).add(next))
  }
  const headers = useRef<(HTMLButtonElement | null)[]>([])

  function onKeyDown(event: KeyboardEvent, index: number) {
    const last = timeline.length - 1
    const target = {
      ArrowDown: Math.min(index + 1, last),
      ArrowUp: Math.max(index - 1, 0),
      Home: 0,
      End: last,
    }[event.key]
    if (target === undefined) return
    event.preventDefault()
    headers.current[target]?.focus()
  }

  return (
    <ol aria-label={t('about.timeline')} className="relative">
      {/* Linha fina central (à esquerda no mobile) */}
      <span aria-hidden className="absolute top-0 bottom-0 left-[7px] w-px bg-border md:left-1/2" />
      {timeline.map((item, index) => {
        const open = openId === item.id
        const panelId = `timeline-${item.id}`
        return (
          <li
            key={item.id}
            className="relative grid grid-cols-[15px_1fr] gap-x-5 pb-10 md:grid-cols-[1fr_15px_1fr] md:gap-x-8"
          >
            <p className="hidden pt-1 text-right font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase md:block">
              {item.period}
            </p>
            <span
              aria-hidden
              className={cn(
                'relative z-10 mt-1.5 size-[15px] rounded-full border-2 border-foreground bg-background transition-colors',
                open && 'border-accent bg-accent',
              )}
            />
            <div>
              <h3>
                <button
                  ref={(node) => {
                    headers.current[index] = node
                  }}
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => toggle(item.id)}
                  onKeyDown={(event) => onKeyDown(event, index)}
                  className="group w-full cursor-pointer text-left"
                >
                  <span className="mb-1 flex items-center justify-between gap-4 font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
                    <span>
                      <span className="md:hidden">{item.period} · </span>
                      {t(`about.types.${item.type}`)}
                    </span>
                    <span aria-hidden className={cn(open && 'text-foreground')}>
                      {open ? `${t('about.play')} ▶` : `${t('about.pause')} ❚❚`}
                    </span>
                  </span>
                  <span className="block font-display text-2xl leading-none font-black tracking-[-0.03em] uppercase group-hover:text-accent md:text-3xl">
                    {l(item.title)}
                  </span>
                  {item.subtitle && (
                    <span className="mt-1 block text-sm font-medium">{l(item.subtitle)}</span>
                  )}
                  <span className="mt-2 block text-sm text-muted-foreground">{l(item.summary)}</span>
                </button>
              </h3>
              <div
                id={panelId}
                role="region"
                aria-label={l(item.title)}
                inert={!open}
                className={cn(
                  'grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none',
                  open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                )}
              >
                <div className="flex min-h-0 flex-col gap-5 overflow-hidden">
                  <span aria-hidden className="h-0" />
                  <p className="max-w-prose text-sm leading-relaxed">{l(item.details)}</p>
                  {/* Foto só entra após a primeira abertura: não baixa imagens escondidas */}
                  {seen.has(item.id) && item.photo && item.photoAlt && (
                    <VhsPhoto
                      src={item.photo}
                      alt={l(item.photoAlt)}
                      timecode={timecode(index)}
                      revealsIllustration={item.revealsIllustration}
                    />
                  )}
                </div>
              </div>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
