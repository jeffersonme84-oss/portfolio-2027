import { useSyncExternalStore } from 'react'

function subscribe(callback: () => void) {
  window.addEventListener('scroll', callback, { passive: true })
  return () => window.removeEventListener('scroll', callback)
}

// Posição vertical do scroll, arredondada para evitar renders a cada subpixel.
export function useScrollY() {
  return useSyncExternalStore(subscribe, () => Math.round(window.scrollY))
}
