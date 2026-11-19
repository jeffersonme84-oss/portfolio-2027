import { useSyncExternalStore } from 'react'
import { isBooting, subscribeBoot } from '@/lib/boot'

// true quando a tela de carregamento já saiu (ou nem apareceu).
export function useBootDone() {
  return !useSyncExternalStore(subscribeBoot, isBooting)
}
