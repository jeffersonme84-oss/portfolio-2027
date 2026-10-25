import { useEffect } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

// Transição entre seções: cada seção abaixo da Home entra (fade, leve subida e blur) quando
// chega na tela. Estilo em hero.css (.reveal / .is-in). Sem JS, com animações reduzidas ou
// para a seção que já está na tela, nada fica escondido.
export function useRevealOnScroll(rootId = 'conteudo') {
  const reduced = useReducedMotion()

  useEffect(() => {
    const root = document.getElementById(rootId)
    if (!root || reduced || !('IntersectionObserver' in window)) return

    const seen = new WeakSet<Element>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-in')
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.06 },
    )

    function register() {
      root?.querySelectorAll(':scope > section:not(#inicio)').forEach((section) => {
        if (seen.has(section)) return
        seen.add(section)
        if (section.getBoundingClientRect().top < window.innerHeight) return
        section.classList.add('reveal')
        observer.observe(section)
      })
    }

    register()
    // As seções chegam depois (chunk lazy do BelowFold).
    const mutations = new MutationObserver(register)
    mutations.observe(root, { childList: true })

    return () => {
      mutations.disconnect()
      observer.disconnect()
      root.querySelectorAll('.reveal').forEach((section) => section.classList.remove('reveal'))
    }
  }, [reduced, rootId])
}
