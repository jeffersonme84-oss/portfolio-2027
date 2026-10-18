import { useTranslation } from 'react-i18next'
import { FloatingContacts } from '@/components/layout/FloatingContacts'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { TapeCounter } from '@/components/retro/TapeCounter'
import { About } from '@/components/sections/About'
import { Hero } from '@/components/sections/Hero'
import { Projects } from '@/components/sections/Projects'
import { Skills } from '@/components/sections/Skills'
import { Testimonials } from '@/components/sections/Testimonials'
import { SectionHeading } from '@/components/sections/SectionHeading'
import { NAV_SECTIONS } from '@/lib/sections'

export default function App() {
  const { t } = useTranslation()

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
      >
        {t('nav.skipToContent')}
      </a>
      <Header />
      <main id="conteudo" tabIndex={-1}>
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Testimonials />
        {NAV_SECTIONS.filter(({ id }) => !['inicio', 'sobre', 'projetos', 'habilidades'].includes(id)).map(({ id, labelKey }) => (
          <section
            key={id}
            id={id}
            aria-labelledby={`${id}-titulo`}
            className="mx-auto min-h-svh max-w-[1200px] px-4 pt-24 md:px-6"
          >
            <SectionHeading id={`${id}-titulo`}>{t(labelKey)}</SectionHeading>
          </section>
        ))}
      </main>
      <Footer />
      <FloatingContacts />
      <TapeCounter />
    </>
  )
}
