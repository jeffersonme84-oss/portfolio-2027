import { cn } from '@/lib/utils'

type VinylNeedleProps = {
  spinning: boolean
  className?: string
}

// Toca-discos mínimo para o botão de enviar: o disco gira durante o envio.
export function VinylNeedle({ spinning, className }: VinylNeedleProps) {
  return (
    <svg viewBox="0 0 40 40" className={cn('size-8 shrink-0', className)} aria-hidden>
      <g className="retro-reel" data-state={spinning ? 'play' : undefined}>
        <circle cx="17" cy="21" r="15" fill="currentColor" />
        <circle
          cx="17"
          cy="21"
          r="11"
          fill="none"
          stroke="var(--background)"
          strokeOpacity="0.35"
        />
        <circle
          cx="17"
          cy="21"
          r="7.5"
          fill="none"
          stroke="var(--background)"
          strokeOpacity="0.35"
        />
        <circle cx="17" cy="21" r="4" fill="var(--accent)" />
        <circle cx="17" cy="21" r="1" fill="currentColor" />
        <rect x="16" y="8" width="2" height="3" fill="var(--background)" opacity="0.5" />
      </g>
      {/* Braço com a agulha, pousando no disco */}
      <path
        d="M37 3 L37 9 L26 22"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="37" cy="4" r="2.5" fill="currentColor" />
      <rect
        x="23"
        y="20.5"
        width="5"
        height="3"
        rx="0.5"
        fill="currentColor"
        transform="rotate(-50 25.5 22)"
      />
    </svg>
  )
}
