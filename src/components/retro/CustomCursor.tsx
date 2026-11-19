import { useEffect, useRef, useSyncExternalStore } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

// Cursor "bolinha vermelha + halo com inércia" (aprovado numa prévia, 2026-11-19).
// Só em telas com mouse (hover + ponteiro fino) e com animações ligadas; o cursor do sistema
// some, menos em campos de texto. Em links e botões o halo cresce; com `data-cursor="TEXTO"`
// ele mostra o texto (ex.: PLAY ▶ na foto da Home).

const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')

function subscribePointer(listener: () => void) {
  finePointer.addEventListener('change', listener)
  return () => finePointer.removeEventListener('change', listener)
}

export function CustomCursor() {
  const reduced = useReducedMotion()
  const fine = useSyncExternalStore(subscribePointer, () => finePointer.matches)
  if (reduced || !fine) return null
  return <Cursor />
}

function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    const label = labelRef.current
    if (!dot || !ring || !label) return
    const html = document.documentElement
    html.classList.add('has-cursor')

    const mouse = { x: -100, y: -100 }
    const lag = { x: -100, y: -100 }
    let frame = 0

    const loop = () => {
      lag.x += (mouse.x - lag.x) * 0.18
      lag.y += (mouse.y - lag.y) * 0.18
      ring.style.transform = `translate3d(${lag.x}px, ${lag.y}px, 0)`
      frame =
        Math.abs(mouse.x - lag.x) + Math.abs(mouse.y - lag.y) > 0.2
          ? requestAnimationFrame(loop)
          : 0
    }

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      mouse.x = event.clientX
      mouse.y = event.clientY
      dot.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`
      html.classList.remove('cursor-out')
      if (!frame) frame = requestAnimationFrame(loop)

      const target = event.target instanceof Element ? event.target : null
      const tagged = target?.closest<HTMLElement>('[data-cursor]')
      const text = tagged?.dataset.cursor ?? ''
      const interactive = !!target?.closest(
        'a, button, [role="button"], [role="switch"], [role="radio"], summary, label',
      )
      const typing = !!target?.closest('input, textarea, select, [contenteditable="true"]')
      // data-cursor-ring="off": só o ponto (ex.: lente do Matrix na foto da Home).
      const ringOff = !!target?.closest('[data-cursor-ring="off"]')
      label.textContent = text
      ring.dataset.state =
        typing || ringOff ? 'hidden' : text ? 'label' : interactive ? 'hover' : ''
      dot.dataset.state = typing ? 'hidden' : ''
    }
    const onLeave = () => html.classList.add('cursor-out')
    const onDown = () => ring.classList.add('is-down')
    const onUp = () => ring.classList.remove('is-down')

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    return () => {
      cancelAnimationFrame(frame)
      html.classList.remove('has-cursor', 'cursor-out')
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
    }
  }, [])

  return (
    <div aria-hidden className="cursor-layer">
      <div ref={ringRef} className="cursor-ring">
        <span ref={labelRef} />
      </div>
      <div ref={dotRef} className="cursor-dot" />
    </div>
  )
}
