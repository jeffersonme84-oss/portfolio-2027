import { useEffect, type RefObject } from 'react'

// Raio do holofote (px, no espaço da camada) e quanto ele anda por quadro em direção ao cursor.
const RADIUS = 190
const FOLLOW = 0.14

// Holofote que segue o cursor e revela uma segunda camada através de uma máscara radial.
// Só move variáveis CSS (--spot-x, --spot-y, --spot-r) e para o loop quando chega ao destino.
// Sem mouse (toque), não faz nada. Com animações reduzidas, acompanha o cursor sem atraso.
export function useSpotlight(
  areaRef: RefObject<HTMLElement | null>,
  layerRef: RefObject<HTMLElement | null>,
  reducedMotion: boolean,
) {
  useEffect(() => {
    const area = areaRef.current
    const layer = layerRef.current
    if (!area || !layer || !matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const pointer = { x: 0, y: 0, inside: false }
    const target = { x: 0, y: 0, r: 0 }
    const current = { x: 0, y: 0, r: 0 }
    const follow = reducedMotion ? 1 : FOLLOW
    let placed = false
    let frame = 0

    // A camada está dentro de um wrapper escalado que desliza com a paralaxe: a cada quadro,
    // converte o cursor (pixels da tela) para pixels da própria camada.
    function locate() {
      const rect = layer!.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      target.x = ((pointer.x - rect.left) * layer!.offsetWidth) / rect.width
      target.y = ((pointer.y - rect.top) * layer!.offsetHeight) / rect.height
    }

    function tick() {
      if (pointer.inside) locate()
      current.x += (target.x - current.x) * follow
      current.y += (target.y - current.y) * follow
      current.r += (target.r - current.r) * follow
      layer!.style.setProperty('--spot-x', `${current.x.toFixed(1)}px`)
      layer!.style.setProperty('--spot-y', `${current.y.toFixed(1)}px`)
      layer!.style.setProperty('--spot-r', `${current.r.toFixed(1)}px`)
      // Com o cursor dentro, o loop continua (a foto pode estar deslizando); fora, para ao apagar.
      const moving = pointer.inside || Math.abs(target.r - current.r) > 0.5
      frame = moving ? requestAnimationFrame(tick) : 0
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(tick)
    }
    function onPointerMove(event: PointerEvent) {
      if (event.pointerType === 'touch') return
      pointer.x = event.clientX
      pointer.y = event.clientY
      pointer.inside = true
      locate()
      target.r = RADIUS
      // Primeira entrada: o holofote nasce no cursor (só o raio cresce), sem atravessar a tela.
      if (!placed) {
        current.x = target.x
        current.y = target.y
        placed = true
      }
      schedule()
    }
    function onPointerLeave() {
      pointer.inside = false
      target.r = 0
      placed = false
      schedule()
    }

    area.addEventListener('pointermove', onPointerMove)
    area.addEventListener('pointerleave', onPointerLeave)
    return () => {
      cancelAnimationFrame(frame)
      area.removeEventListener('pointermove', onPointerMove)
      area.removeEventListener('pointerleave', onPointerLeave)
      for (const name of ['--spot-x', '--spot-y', '--spot-r']) layer.style.removeProperty(name)
    }
  }, [areaRef, layerRef, reducedMotion])
}
