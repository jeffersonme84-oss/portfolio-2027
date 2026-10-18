import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FloatingContacts } from '@/components/layout/FloatingContacts'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { NotFound } from '@/components/retro/NotFound'
import { SoundToggle } from '@/components/retro/SoundToggle'
import { TapeCounter } from '@/components/retro/TapeCounter'
import { VhsOverlay } from '@/components/retro/VhsOverlay'
import { Hero } from '@/components/sections/Hero'
import { site } from '@/content/site'
import { useKonami } from '@/hooks/useKonami'
import { printConsoleTape } from '@/lib/consoleTape'
import { playSound } from '@/lib/sound'

type RetroEffect = 'tracking' | 'rewind' | null

const BelowFold = lazy(() => import('@/components/sections/BelowFold'))

const isNotFound = !['/', '/index.html'].includes(window.location.pathname)

export default function App() {
  const { t } = useTranslation()
  const [effect, setEffect] = useState<RetroEffect>(null)
  const effectTimer = useRef<number>(undefined)
  const brandClicks = useRef<number[]>([])

  function showEffect(next: Exclude<RetroEffect, null>, duration: number) {
    setEffect(next)
    window.clearTimeout(effectTimer.current)
    effectTimer.current = window.setTimeout(() => setEffect(null), duration)
  }

  // Konami Code (↑↑↓↓←→←→BA): modo VHS tracking por alguns segundos.
  useKonami(() => {
    playSound('play')
    showEffect('tracking', 4000)
  }, site.easterEggs)

  // 5 cliques no logo em até 3 s: "REW" e volta ao topo (o link já leva a #inicio).
  function onBrandClick() {
    if (!site.easterEggs) return
    const now = Date.now()
    brandClicks.current = [...brandClicks.current.filter((time) => now - time < 3000), now]
    if (brandClicks.current.length >= 5) {
      brandClicks.current = []
      playSound('rewind')
      showEffect('rewind', 1800)
    }
  }

  // Título e descrição no idioma ativo.
  useEffect(() => {
    document.title = t('meta.title')
    document.querySelector('meta[name="description"]')?.setAttribute('content', t('meta.description'))
  }, [t])

  useEffect(() => {
    if (site.easterEggs) {
      printConsoleTape(t('retro.console'), site.social.github || site.social.linkedin)
    }
    return () => window.clearTimeout(effectTimer.current)
  }, [t])

  if (isNotFound) return <NotFound />

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
      >
        {t('nav.skipToContent')}
      </a>
      <Header onBrandClick={onBrandClick} />
      <main id="conteudo" tabIndex={-1}>
        <Hero />
        <Suspense fallback={<div className="min-h-svh" />}>
          <BelowFold />
        </Suspense>
      </main>
      <Footer />
      <FloatingContacts>
        <SoundToggle />
      </FloatingContacts>
      <TapeCounter rewinding={effect === 'rewind'} />
      {effect && (
        <VhsOverlay
          mode={effect}
          label={effect === 'rewind' ? `${t('retro.rewind')} ◀◀` : `${t('retro.tracking')} ▶`}
        />
      )}
    </>
  )
}
