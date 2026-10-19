import { useCallback, useEffect, useState } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

type Options = {
  speed?: number
  delay?: number
}

// Quantos caracteres de `total` já foram "digitados". Com reduced motion, tudo de uma vez.
export function useTypewriter(total: number, { speed = 75, delay = 400 }: Options = {}) {
  const reducedMotion = useReducedMotion()
  const [run, setRun] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (reducedMotion) return
    let current = 0
    // Repetições (hover, carretéis) começam quase na hora; só a primeira espera o carregamento.
    const startDelay = run === 0 ? delay : Math.min(delay, 150)
    let timer = window.setTimeout(function tick() {
      current += 1
      setCount(current)
      if (current < total) timer = window.setTimeout(tick, speed)
    }, startDelay)
    return () => window.clearTimeout(timer)
  }, [reducedMotion, total, speed, delay, run])

  const restart = useCallback(() => {
    setCount(0)
    setRun((value) => value + 1)
  }, [])

  return {
    count: reducedMotion ? total : count,
    done: reducedMotion || count >= total,
    restart,
  }
}
