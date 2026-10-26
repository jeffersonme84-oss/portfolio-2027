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

// Trajetória em "lista + detalhe", para caber em uma tela: a lista (período | título) é
// paginada e o item escolhido aparece ao lado (abaixo, no celular), com foto e detalhes.
// Setas do teclado navegam pela lista.
export function Timeline() {
  const { t, l } = useLocale()
  const tablet = useMediaQuery('(min-width: 768px)')
  const perPage = tablet ? 4 : 3
  const pager = usePager(timeline, perPage)
  const [selected, setSelected] = useState(0)
  const [photoIndex, setPhotoIndex] = useState(0)
  const buttons = useRef(new Map<number, HTMLButtonElement>())
  const item = timeline[Math.min(selected, timeline.length - 1)]
  const photos =
    item.photo && item.photoAlt
      ? [{ src: item.photo, alt: item.photoAlt }, ...(item.morePhotos ?? [])]
      : []
  const photo = photos[Math.min(photoIndex, photos.length - 1)]

  function select(index: number, focus = false) {
    setSelected(index)
    setPhotoIndex(0)
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
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-10">
      {/* min-w-0: os títulos truncados não podem esticar a coluna além da tela. */}
      <div className="flex min-w-0 flex-col gap-4">
        <ol aria-label={t('about.timeline')} className="flex flex-col border-t border-border">
          {pager.items.map((entry, position) => {
            const index = pager.offset + position
            const active = index === selected
            return (
              <li key={entry.id} className="border-b border-border">
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
                    'group grid w-full cursor-pointer grid-cols-[5.5rem_minmax(0,1fr)] items-baseline gap-3 py-3 pr-3 pl-3 text-left transition-colors md:grid-cols-[7rem_minmax(0,1fr)]',
                    // Barra de acento à esquerda marca o item aberto.
                    active
                      ? 'bg-foreground/[0.05] shadow-[inset_3px_0_0_var(--accent)]'
                      : 'hover:bg-foreground/[0.03]',
                  )}
                >
                  <span className="font-mono text-[11px] tracking-[0.08em] text-muted-foreground tabular-nums">
                    {entry.period}
                  </span>
                  <span className="min-w-0">
                    <span
                      className={cn(
                        'block truncate text-[15px] leading-snug font-semibold',
                        active ? 'text-accent' : 'group-hover:text-accent',
                      )}
                    >
                      {l(entry.title)}
                    </span>
                    {entry.subtitle && (
                      <span className="block truncate text-[13px] text-muted-foreground">
                        {l(entry.subtitle)}
                      </span>
                    )}
                  </span>
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
        />
      </div>

      {/* Detalhe do item escolhido */}
      <article
        id="trajetoria-detalhe"
        aria-live="polite"
        aria-label={`${t('about.detail')}: ${l(item.title)}`}
        className="flex gap-4 rounded-lg border border-border p-4 md:gap-5 md:p-5"
      >
        {photo && (
          <div className="flex w-24 shrink-0 flex-col gap-2 md:w-32">
            <VhsPhoto
              key={`${item.id}-${photoIndex}`}
              src={photo.src}
              alt={l(photo.alt)}
              timecode={timecode(selected)}
              revealsIllustration={photoIndex === 0 && item.revealsIllustration}
              className="mx-0"
            />
            {photos.length > 1 && (
              <ul className="hidden gap-1.5 md:flex" aria-label={t('about.morePhotos')}>
                {photos.map((entry, index) => (
                  <li key={entry.src}>
                    <button
                      type="button"
                      onClick={() => setPhotoIndex(index)}
                      aria-pressed={index === photoIndex}
                      className={cn(
                        'block size-9 overflow-hidden border transition-colors md:size-11',
                        index === photoIndex
                          ? 'border-accent'
                          : 'border-border opacity-70 hover:opacity-100',
                      )}
                    >
                      <img
                        src={entry.src}
                        alt={l(entry.alt)}
                        width={44}
                        height={44}
                        loading="lazy"
                        className="size-full object-cover"
                      />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        <div className="min-w-0">
          <p className="font-mono text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
            {item.period} · {t(`about.types.${item.type}`)}
          </p>
          <h3 className="mt-1 font-display text-base leading-tight font-black tracking-[-0.02em] uppercase md:mt-1.5 md:text-2xl">
            {l(item.title)}
          </h3>
          {item.subtitle && <p className="mt-1 text-sm font-medium">{l(item.subtitle)}</p>}
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-foreground/80 md:mt-3 md:line-clamp-none md:text-[15px]">
            {l(item.details)}
          </p>
        </div>
      </article>
    </div>
  )
}
