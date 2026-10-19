// Preferência de animações do site: segue o sistema (prefers-reduced-motion) por padrão,
// mas o visitante pode ligar ou reduzir manualmente (botão flutuante), com a escolha salva.
// A classe `reduce-motion` no <html> alimenta as variantes motion-safe/motion-reduce do
// Tailwind e o retro.css. O script inline do index.html aplica o mesmo cálculo antes da
// primeira pintura.

export type MotionPreference = 'system' | 'on' | 'off'

export const MOTION_STORAGE_KEY = 'motion'

const media = window.matchMedia('(prefers-reduced-motion: reduce)')
const listeners = new Set<() => void>()

function readPreference(): MotionPreference {
  try {
    const stored = localStorage.getItem(MOTION_STORAGE_KEY)
    return stored === 'on' || stored === 'off' ? stored : 'system'
  } catch {
    return 'system'
  }
}

let preference = readPreference()

function computeReduced() {
  return preference === 'off' || (preference === 'system' && media.matches)
}

let reduced = computeReduced()
document.documentElement.classList.toggle('reduce-motion', reduced)

function apply() {
  reduced = computeReduced()
  document.documentElement.classList.toggle('reduce-motion', reduced)
  listeners.forEach((listener) => listener())
}

media.addEventListener('change', () => {
  if (preference === 'system') apply()
})

export function isReducedMotion() {
  return reduced
}

export function setMotionPreference(next: MotionPreference) {
  preference = next
  try {
    if (next === 'system') localStorage.removeItem(MOTION_STORAGE_KEY)
    else localStorage.setItem(MOTION_STORAGE_KEY, next)
  } catch {
    // Sem storage: vale só para esta sessão.
  }
  apply()
}

export function subscribeMotion(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
