import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { familyIllustration } from '@/content/timeline'
import { site } from '@/content/site'
import { cn } from '@/lib/utils'

type VhsPhotoProps = {
  src: string
  alt: string
  // Timecode mono no canto (ex.: 00:14:32).
  timecode: string
  revealsIllustration?: boolean
  // Tamanho da figura (padrão: até max-w-xs, centralizada).
  className?: string
}

// Foto em "frame de fita": moldura fina, granulado leve, timecode e glitch só no hover.
export function VhsPhoto({
  src,
  alt,
  timecode,
  revealsIllustration = false,
  className,
}: VhsPhotoProps) {
  const { t } = useTranslation()
  const [clicks, setClicks] = useState(0)
  const animated = site.easterEggs && revealsIllustration && clicks >= 3

  return (
    <figure className={cn('mx-auto w-full max-w-xs', className)}>
      <div
        className="vhs-frame relative border border-foreground/30 bg-foreground/5 p-1.5"
        onClick={revealsIllustration ? () => setClicks((count) => count + 1) : undefined}
      >
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={animated ? familyIllustration : src}
            alt={animated ? `${alt} (${t('about.animated')})` : alt}
            width={960}
            height={1200}
            loading="lazy"
            decoding="async"
            className="vhs-glitch size-full object-cover"
          />
          <span aria-hidden className="vhs-grain pointer-events-none absolute inset-0" />
          <span
            aria-hidden
            className="absolute bottom-2 left-2 bg-black/60 px-1.5 py-0.5 font-mono text-[10px] tracking-[0.15em] text-white"
          >
            {t('about.play')} ▶ {timecode}
          </span>
        </div>
      </div>
      {animated && (
        <figcaption className="mt-2 font-mono text-[10px] tracking-[0.15em] text-muted-foreground uppercase">
          {t('about.animated')}
        </figcaption>
      )}
    </figure>
  )
}
