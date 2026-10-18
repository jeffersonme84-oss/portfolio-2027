import { useEffect } from 'react'
import { About } from '@/components/sections/About'
import { Contact } from '@/components/sections/Contact'
import { Projects } from '@/components/sections/Projects'
import { Skills } from '@/components/sections/Skills'
import { Testimonials } from '@/components/sections/Testimonials'

// Seções abaixo da primeira dobra, num chunk separado (React.lazy no App):
// o hero aparece antes, sem esperar o JS do restante da página.
export default function BelowFold() {
  // Ao abrir a página já com âncora (ex.: /#contato), rola até ela quando a seção existir.
  useEffect(() => {
    const { hash } = window.location
    if (!hash || hash.startsWith('#projeto-')) return
    document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView()
  }, [])

  return (
    <>
      <About />
      <Projects />
      <Skills />
      <Testimonials />
      <Contact />
    </>
  )
}
