import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { ThemeToggle } from '@/components/layout/ThemeToggle'

// Os toggles entram no Header no Módulo 2.
export default function App() {
  return (
    <main className="flex min-h-svh items-center justify-center gap-4">
      <ThemeToggle />
      <LanguageSwitcher />
    </main>
  )
}
