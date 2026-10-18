// Tema claro / escuro / sistema, com a classe `dark` no <html>.
// O script inline do index.html aplica o mesmo cálculo antes da primeira pintura (sem flash).

export type ThemePreference = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'theme'

const media = window.matchMedia('(prefers-color-scheme: dark)')
const listeners = new Set<() => void>()

function readPreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    return stored === 'light' || stored === 'dark' ? stored : 'system'
  } catch {
    return 'system'
  }
}

let preference = readPreference()

function resolve(p: ThemePreference): ResolvedTheme {
  if (p !== 'system') return p
  return media.matches ? 'dark' : 'light'
}

function apply() {
  document.documentElement.classList.toggle('dark', resolve(preference) === 'dark')
}

function emit() {
  listeners.forEach((listener) => listener())
}

media.addEventListener('change', () => {
  if (preference !== 'system') return
  apply()
  emit()
})

export function getThemePreference(): ThemePreference {
  return preference
}

export function getResolvedTheme(): ResolvedTheme {
  return resolve(preference)
}

export function setThemePreference(next: ThemePreference) {
  preference = next
  try {
    if (next === 'system') localStorage.removeItem(THEME_STORAGE_KEY)
    else localStorage.setItem(THEME_STORAGE_KEY, next)
  } catch {
    // Sem storage (modo privado): o tema vale só para esta sessão.
  }
  apply()
  emit()
}

export function subscribeTheme(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
