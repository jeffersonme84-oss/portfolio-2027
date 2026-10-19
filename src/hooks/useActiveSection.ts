import { useEffect, useState } from 'react'

// Seção que cruza o meio da tela, para destacar o link ativo do menu.
// Lê o DOM atual fora do render, no máximo uma vez por frame (sem forçar reflow
// durante a renderização e sem guardar referências a seções recriadas).
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState(ids[0])

  useEffect(() => {
    let frame = 0
    function measure() {
      frame = 0
      const middle = window.innerHeight / 2
      let current = ids[0]
      for (const id of ids) {
        const element = document.getElementById(id)
        if (element && element.getBoundingClientRect().top <= middle) current = id
      }
      setActive(current)
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(measure)
    }
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    window.addEventListener('hashchange', schedule)
    schedule()
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      window.removeEventListener('hashchange', schedule)
    }
  }, [ids])

  return active
}
