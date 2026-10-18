import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

type ReelState = 'idle' | 'play' | 'rewind'

type CassetteLabelProps = {
  children: ReactNode
  side: string
  // Easter egg: sem handlers, os carretéis ficam estáticos.
  interactive?: boolean
  onSpin?: () => void
  onRewind?: () => void
  className?: string
}

function Reel({ x, state }: { x: number; state: ReelState }) {
  return (
    <g className="retro-reel" data-state={state === 'idle' ? undefined : state}>
      <circle cx={x} cy="14" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx={x} cy="14" r="3" fill="currentColor" />
      {[0, 60, 120].map((angle) => (
        <line
          key={angle}
          x1={x}
          y1="6"
          x2={x}
          y2="22"
          stroke="currentColor"
          strokeWidth="1.5"
          transform={`rotate(${angle} ${x} 14)`}
        />
      ))}
    </g>
  )
}

// Rótulo de fita K7 discreto: o único elemento retro da primeira dobra.
export function CassetteLabel({
  children,
  side,
  interactive = true,
  onSpin,
  onRewind,
  className,
}: CassetteLabelProps) {
  const { t } = useTranslation()
  const [state, setState] = useState<ReelState>('idle')
  const timer = useRef<number>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  function animate(next: ReelState, duration: number) {
    setState(next)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setState('idle'), duration)
  }

  const reels = (
    <svg viewBox="0 0 100 28" className="h-7 w-full" aria-hidden>
      <rect
        x="18"
        y="2"
        width="64"
        height="24"
        rx="12"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.4"
      />
      <Reel x={32} state={state} />
      <Reel x={68} state={state} />
    </svg>
  )

  return (
    <div className={cn('w-72 border-2 border-foreground bg-background p-4', className)}>
      <div className="mb-3 flex items-center justify-between border-b border-border pb-2 font-mono text-[10px] tracking-[0.2em] uppercase">
        <span>{side}</span>
        <span aria-hidden className="size-1.5 rounded-full bg-accent" />
      </div>
      <div className="mb-4">{children}</div>
      {interactive ? (
        <button
          type="button"
          aria-label={t('hero.reels')}
          title={t('hero.reels')}
          className="block w-full cursor-pointer text-foreground"
          onClick={() => {
            animate('play', 2400)
            onSpin?.()
          }}
          onDoubleClick={() => {
            animate('rewind', 1400)
            onRewind?.()
          }}
        >
          {reels}
        </button>
      ) : (
        <div className="text-foreground">{reels}</div>
      )}
    </div>
  )
}
