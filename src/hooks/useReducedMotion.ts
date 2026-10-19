import { useSyncExternalStore } from 'react'
import { isReducedMotion, subscribeMotion } from '@/lib/motion'

// true quando as animações devem ficar reduzidas: preferência do sistema,
// a menos que o visitante tenha ligado as animações no botão do site.
export function useReducedMotion() {
  return useSyncExternalStore(subscribeMotion, isReducedMotion)
}
