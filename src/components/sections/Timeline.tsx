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

const pad2 = (value: number) => String(value).padStart(2, '0')

// Trajetória no modelo "videocassete" (aprovado pelo Jefferson, 2026-11-19): todos os itens numa
// lista com o período num visor de contador; o item escolhido passa na "tela" do videocassete,
// com controles ◀◀ ▶ ▶▶ e barra de progresso. Setas do teclado navegam pela lista.
export function Timeline() {
  const { t, l } = useLocale()
  const [selected, setSelected] = useState(0)
  const [photoIndex, setPhotoIndex] = useState(0)
  const buttons = useRef(new Map<number, HTMLButtonElement>())
  const last = timeline.length - 1
  const item = timeline[Math.min(selected, last)]
  const photos =
    item.photo && item.photoAlt
      ? [{ src: item.photo, alt: item.photoAlt }, ...(item.morePhotos ?? [])]
      : []
  const photo = photos[Math.min(photoIndex, photos.length - 1)]

  function select(index: number, focus = false) {
    const next = (index + timeline.length) % timeline.length
    setSelected(next)
    setPhotoIndex(0)
    if (focus) requestAnimationFrame(() => buttons.current.get(next)?.focus())
  }

  function onKeyDown(event: KeyboardEvent, index: number) {
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
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-10">
      {/* Lista: no celular vira uma faixa que rola para o lado. */}
      <ol
        aria-label={t('about.timeline')}
        className="-mx-4 flex snap-x gap-1.5 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0 lg:pb-0"
      >
        {timeline.map((entry, index) => {
          const active = index === selected
          return (
            <li key={entry.id} className="shrink-0 snap-start lg:shrink">
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
                  'group grid w-full cursor-pointer grid-cols-[4.75rem_minmax(0,1fr)] items-center gap-3 rounded-lg px-2 py-1.5 text-left transition-[background-color,box-shadow] max-lg:w-64',
                  active
                    ? 'bg-background shadow-[0_0_0_1px_var(--border),0_10px_20px_-16px_rgb(0_0_0/0.5)]'
                    : 'hover:bg-foreground/[0.04]',
                )}
              >
                {/* Período no visor de contador */}
                <span
                  className={cn(
                    'rounded-[5px] py-1.5 text-center font-mono text-[10.5px] font-bold tracking-[0.04em] tabular-nums transition-colors',
                    active ? 'bg-accent text-[#111]' : 'bg-[#141412] text-[#f2efe9]',
                  )}
                >
                  {entry.period.replace(' – ', '–')}
                </span>
                <span className="min-w-0">
                  <span
                    className={cn(
                      'block truncate text-[14.5px] leading-snug font-semibold',
                      !active && 'group-hover:text-accent',
                    )}
                  >
                    {l(entry.title)}
                  </span>
                  {entry.subtitle && (
                    <span className="block truncate text-[12.5px] text-muted-foreground short:hidden">
                      {l(entry.subtitle)}
                    </span>
                  )}
                </span>
              </button>
            </li>
          )
        })}
      </ol>

      {/* Videocassete: tela com o item escolhido + controles */}
      <div className="rounded-2xl bg-gradient-to-b from-[#2a2a27] to-[#151513] p-3 text-[#eee] shadow-[0_30px_50px_-30px_rgb(0_0_0/0.6),inset_0_1px_0_rgb(255_255_255/0.08)] md:p-3.5">
        <article
          id="trajetoria-detalhe"
          aria-live="polite"
          aria-label={`${t('about.detail')}: ${l(item.title)}`}
          className="vcr-screen relative flex gap-4 overflow-hidden rounded-[10px] bg-[#0b0d0c] p-4 pt-9 md:gap-5"
        >
          {/* OSD do videocassete */}
          <span
            aria-hidden
            className="absolute inset-x-4 top-2.5 flex justify-between font-mono text-[10.5px] tracking-[0.14em] text-[#e8e4dc]"
          >
            <span>
              <span className="text-[#ff5a40]">●</span> {t('about.play')} ▶ &nbsp;CH{' '}
              {pad2(selected + 1)}
            </span>
            <span>{timecode(selected)}</span>
          </span>

          {photo ? (
            <div className="flex w-24 shrink-0 flex-col gap-2 md:w-32 short:w-28">
              <VhsPhoto
                key={`${item.id}-${photoIndex}`}
                src={photo.src}
                alt={l(photo.alt)}
                timecode={timecode(selected)}
                revealsIllustration={photoIndex === 0 && item.revealsIllustration}
                className="mx-0 [&_.vhs-frame]:border-white/20 [&_.vhs-frame]:bg-white/5"
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
                          'block size-9 overflow-hidden border transition-colors',
                          index === photoIndex
                            ? 'border-accent'
                            : 'border-white/20 opacity-70 hover:opacity-100',
                        )}
                      >
                        <img
                          src={entry.src}
                          alt={l(entry.alt)}
                          width={36}
                          height={36}
                          loading="lazy"
                          className="size-full object-cover"
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            // Sem foto: barras de cor de fita sem sinal
            <div
              aria-hidden
              className="vcr-bars grid aspect-[4/5] w-24 shrink-0 place-items-center self-start md:w-32 short:w-28"
            >
              <span className="bg-black px-1.5 py-0.5 font-mono text-[9px] tracking-[0.2em] text-white">
                {t('about.noSignal')}
              </span>
            </div>
          )}

          <div key={item.id} className="vcr-text min-w-0">
            <p className="font-mono text-[10.5px] tracking-[0.16em] text-[#9a978f] uppercase">
              {t(`about.types.${item.type}`)} · {item.period}
            </p>
            <h3 className="mt-1.5 font-display text-lg leading-[1.05] font-black tracking-[-0.02em] text-white uppercase md:text-[1.6rem]">
              {l(item.title)}
            </h3>
            {item.subtitle && (
              <p className="mt-1 text-sm font-medium text-[#e8e4dc]">{l(item.subtitle)}</p>
            )}
            <p className="mt-2 line-clamp-4 text-[13.5px] leading-relaxed text-[#b9b5ad] md:mt-2.5 md:line-clamp-none md:text-sm short:line-clamp-5">
              {l(item.details)}
            </p>
          </div>
        </article>

        {/* Controles do aparelho */}
        <div className="mt-3 flex items-center gap-2 font-mono text-xs">
          {[
            { label: '◀◀', aria: t('about.prev'), onClick: () => select(selected - 1) },
            {
              label: `▶ ${t('about.play')}`,
              aria: t('about.next'),
              onClick: () => select(selected + 1),
            },
            { label: '▶▶', aria: t('about.next'), onClick: () => select(selected + 1) },
          ].map((control, index) => (
            <button
              key={index}
              type="button"
              aria-label={control.aria}
              onClick={control.onClick}
              className="h-8 rounded-md border border-[#3a3a36] bg-gradient-to-b from-[#34342f] to-[#1f1f1c] px-3 text-[#e8e4dc] shadow-[0_2px_0_#000] transition-transform active:translate-y-0.5 active:shadow-none"
            >
              {control.label}
            </button>
          ))}
          <span
            aria-hidden
            className="h-2 flex-1 overflow-hidden rounded bg-[#0b0b0a] shadow-[inset_0_1px_2px_#000]"
          >
            <span
              className="block h-full bg-[#d42a20] transition-[width] duration-500"
              style={{ width: `${((selected + 1) / timeline.length) * 100}%` }}
            />
          </span>
          <span aria-hidden className="text-[10.5px] tracking-[0.14em] text-[#9a978f]">
            {pad2(selected + 1)}/{pad2(timeline.length)}
          </span>
        </div>
      </div>
    </div>
  )
}
