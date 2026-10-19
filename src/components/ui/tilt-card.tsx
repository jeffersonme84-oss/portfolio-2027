import { useRef, type HTMLAttributes, type PointerEvent } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { cn } from '@/lib/utils'

type TiltCardProps = HTMLAttributes<HTMLDivElement> & {
  // Inclinação máxima, em graus.
  max?: number
}

// Card que inclina em 3D na direção do ponteiro, com um brilho que acompanha o cursor.
// Desligado com animações reduzidas.
export function TiltCard({ max = 8, className, children, style, ...props }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const element = ref.current
    if (!element || reduced || event.pointerType === 'touch') return
    const rect = element.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height
    element.style.setProperty('--tilt-x', `${(0.5 - y) * max * 2}deg`)
    element.style.setProperty('--tilt-y', `${(x - 0.5) * max * 2}deg`)
    element.style.setProperty('--glow-x', `${x * 100}%`)
    element.style.setProperty('--glow-y', `${y * 100}%`)
  }

  function onPointerLeave() {
    const element = ref.current
    if (!element) return
    element.style.setProperty('--tilt-x', '0deg')
    element.style.setProperty('--tilt-y', '0deg')
  }

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={cn(
        'group/tilt relative transition-transform duration-200 ease-out [transform:perspective(900px)_rotateX(var(--tilt-x,0deg))_rotateY(var(--tilt-y,0deg))] motion-reduce:[transform:none]',
        className,
      )}
      style={style}
      {...props}
    >
      {children}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/tilt:opacity-100 motion-reduce:hidden"
        style={{
          background:
            'radial-gradient(circle at var(--glow-x, 50%) var(--glow-y, 50%), color-mix(in oklab, var(--accent) 18%, transparent), transparent 55%)',
        }}
      />
    </div>
  )
}
