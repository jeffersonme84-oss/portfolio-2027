import { useSyncExternalStore } from 'react'

// true enquanto a media query casar (ex.: '(min-width: 1024px)'); atualiza ao redimensionar.
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query)
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}
