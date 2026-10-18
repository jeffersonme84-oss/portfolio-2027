import { useScrollY } from '@/hooks/useScrollY'
import { cn } from '@/lib/utils'

type TapeCounterProps = {
  rewinding?: boolean
}

// Contador de fita (único detalhe retro do layout): avança com o scroll.
export function TapeCounter({ rewinding = false }: TapeCounterProps) {
  const count = Math.min(9999, Math.floor(useScrollY() / 8))

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed bottom-4 left-4 z-30 hidden items-center gap-1.5 border border-border bg-background px-2 py-1 font-mono text-[10px] tabular-nums tracking-[0.2em] sm:flex"
    >
      <span className={cn('text-accent', rewinding && 'motion-safe:animate-pulse')}>
        {rewinding ? '◀◀' : '▶'}
      </span>
      {String(count).padStart(4, '0')}
    </div>
  )
}
