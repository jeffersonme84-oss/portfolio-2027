import { cn } from '@/lib/utils'

type VhsOverlayProps = {
  // tracking: Konami Code. rewind: 5 cliques no logo.
  mode: 'tracking' | 'rewind'
  label: string
}

// Efeito de tela inteira, temporário e sem bloquear cliques ou leitura.
export function VhsOverlay({ mode, label }: VhsOverlayProps) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[60]">
      {mode === 'tracking' && (
        <>
          <div className="vhs-scanlines absolute inset-0" />
          <div className="vhs-grain absolute inset-0 opacity-30" />
          <div className="vhs-tracking-band absolute inset-x-0 h-16" />
        </>
      )}
      <span
        className={cn(
          'absolute top-20 left-6 bg-black/70 px-2 py-1 font-mono text-sm tracking-[0.2em] text-white',
          mode === 'rewind' && 'motion-safe:animate-pulse',
        )}
      >
        {label}
      </span>
    </div>
  )
}
