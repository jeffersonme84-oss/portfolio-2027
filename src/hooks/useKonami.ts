import { useEffect, useRef } from 'react'

const SEQUENCE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
]

// Dispara `onMatch` quando o Konami Code (↑↑↓↓←→←→BA) é digitado.
export function useKonami(onMatch: () => void, enabled = true) {
  const callback = useRef(onMatch)
  useEffect(() => {
    callback.current = onMatch
  })

  useEffect(() => {
    if (!enabled) return
    let position = 0
    function onKeyDown(event: KeyboardEvent) {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key
      position = key === SEQUENCE[position] ? position + 1 : key === SEQUENCE[0] ? 1 : 0
      if (position === SEQUENCE.length) {
        position = 0
        callback.current()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [enabled])
}
