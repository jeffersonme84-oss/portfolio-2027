import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { useEffect } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

// As seções têm a altura da tela e já reservam o espaço do header no padding de cima:
// a âncora para exatamente no topo da seção.
const HEADER_OFFSET = 0
// Tempo para o menu do celular (Sheet) soltar a trava de rolagem antes de rolar.
const UNLOCK_DELAY = 320

const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4)

function isScrollLocked() {
  // O Radix (Dialog e Sheet) marca o body enquanto trava a rolagem.
  return document.body.hasAttribute('data-scroll-locked')
}

// Rolagem suave (Lenis) na página inteira. Desliga com animações reduzidas (sistema ou
// botão do site) e pausa enquanto um modal trava a rolagem.
export function useSmoothScroll() {
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return

    const lenis = new Lenis({ duration: 1.1, easing: easeOutQuart })
    let frame = requestAnimationFrame(function loop(time: number) {
      lenis.raf(time)
      frame = requestAnimationFrame(loop)
    })

    // Links internos (#sobre, #projetos...) também rolam suavemente.
    // Os do estudo de caso (#projeto-<slug>) abrem o modal e ficam de fora.
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]')
      const hash = link?.getAttribute('href')
      if (!hash || hash === '#' || hash.startsWith('#projeto-')) return
      const target = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (!target) return
      event.preventDefault()
      const go = () => {
        lenis.scrollTo(target, { offset: HEADER_OFFSET })
        // Mantém o foco coerente (ex.: "Pular para o conteúdo").
        if (target.hasAttribute('tabindex')) target.focus({ preventScroll: true })
      }
      if (isScrollLocked()) window.setTimeout(go, UNLOCK_DELAY)
      else go()
      history.pushState(null, '', hash)
    }
    document.addEventListener('click', onClick)

    const lockObserver = new MutationObserver(() => {
      if (isScrollLocked()) lenis.stop()
      else lenis.start()
    })
    lockObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['data-scroll-locked'],
    })

    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('click', onClick)
      lockObserver.disconnect()
      lenis.destroy()
    }
  }, [reduced])
}
