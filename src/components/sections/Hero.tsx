import { ArrowRight } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { CvButton } from '@/components/layout/CvButton'
import { ExternalLink } from '@/components/layout/ExternalLink'
import { HeroStack } from '@/components/sections/HeroStack'
import { StudyPanel } from '@/components/sections/StudyPanel'
import { buttonVariants } from '@/components/ui/button-variants'
import { KineticMatrix } from '@/components/ui/kinetic-matrix'
import { site, splitName } from '@/content/site'
import { useClock } from '@/hooks/useClock'
import { useLocale } from '@/hooks/useLocale'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useTypewriter } from '@/hooks/useTypewriter'
import { cn } from '@/lib/utils'

const { first, rest } = splitName(site.name)
// Linha 2 (MOREIRA EVANGELISTA) é digitável: no carregamento só o último sobrenome é digitado
// (MOREIRA já aparece); ao passar o mouse no nome, a linha inteira é digitada de novo.
const restWords = rest.split(' ')
const wordOffsets = restWords.map((_, index) => restWords.slice(0, index).join('').length)
const restLength = restWords.join('').length
const firstRunStart = wordOffsets.at(-1) ?? 0

const microText = 'font-mono text-[11px] leading-snug tracking-[0.14em] uppercase'

type TypedProps = { text: string; offset: number; count: number; typing: boolean }

// Letras ainda não digitadas ficam invisíveis: o layout não se move durante a digitação.
// O cursor aparece só na palavra que está sendo digitada.
function Typed({ text, offset, count, typing }: TypedProps) {
  const typed = Math.max(0, Math.min(text.length, count - offset))
  const active = typing && count >= offset && count < offset + text.length
  return (
    <>
      {text.slice(0, typed)}
      {active && (
        <span className="retro-cursor relative inline-block h-[0.78em] w-[0.06em] translate-y-[0.04em] bg-accent align-baseline" />
      )}
      <span className="invisible">{text.slice(typed)}</span>
    </>
  )
}

export function Hero() {
  const { t, l, locale } = useLocale()
  const time = useClock(site.timeZone, locale)
  const { count, done, restart } = useTypewriter(restLength, {
    speed: 95,
    delay: 700,
    startAt: firstRunStart,
  })
  const sectionRef = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()

  // Profundidade suave: retrato e cartões se movem em camadas com o mouse (variáveis CSS, sem re-render).
  useEffect(() => {
    const section = sectionRef.current
    if (!section || reducedMotion) return
    let frame = 0
    const pointer = { x: 0, y: 0 }
    function apply() {
      frame = 0
      section!.style.setProperty('--px', pointer.x.toFixed(3))
      section!.style.setProperty('--py', pointer.y.toFixed(3))
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(apply)
    }
    function onPointerMove(event: PointerEvent) {
      if (event.pointerType === 'touch') return
      const rect = section!.getBoundingClientRect()
      pointer.x = (event.clientX - rect.left) / rect.width - 0.5
      pointer.y = (event.clientY - rect.top) / rect.height - 0.5
      schedule()
    }
    function onPointerLeave() {
      pointer.x = 0
      pointer.y = 0
      schedule()
    }
    section.addEventListener('pointermove', onPointerMove)
    section.addEventListener('pointerleave', onPointerLeave)
    return () => {
      cancelAnimationFrame(frame)
      section.removeEventListener('pointermove', onPointerMove)
      section.removeEventListener('pointerleave', onPointerLeave)
      for (const name of ['--px', '--py']) section.style.removeProperty(name)
    }
  }, [reducedMotion])

  // Passar o mouse sobre o nome digita MOREIRA EVANGELISTA de novo (quando a digitação anterior terminou).
  function retypeSurname() {
    if (done) restart()
  }

  return (
    <section
      id="inicio"
      ref={sectionRef}
      aria-labelledby="inicio-titulo"
      className="relative isolate h-svh min-h-[640px] overflow-hidden pt-14"
    >
      {/* Malha tecnológica com paralaxe 3D: camada decorativa de fundo, mais leve atrás do painel */}
      <KineticMatrix
        interactionRef={sectionRef}
        className="-z-10 [mask-image:radial-gradient(ellipse_40%_50%_at_74%_55%,rgb(0_0_0/0.3)_0%,black_100%)]"
      />
      {/* Duas colunas no desktop (texto | painel); no celular, empilhado. Grade em hero.css. */}
      <div className="hero-layout mx-auto h-full max-w-[1200px] px-4 md:px-6">
        <div className="hero-text">
          <p className={cn(microText, 'hero-in hero-in-1 text-muted-foreground')}>
            — {t('hero.greeting')}
          </p>
          <h1
            id="inicio-titulo"
            onPointerEnter={retypeSurname}
            className="mt-3 cursor-default font-display font-black uppercase"
          >
            <span className="sr-only">{site.name}</span>
            <span aria-hidden className="block">
              {/* Cada linha sobe por trás de uma máscara (entrada em hero.css). */}
              <span className="hero-mask">
                <span className="hero-line hero-name-first block text-accent">{first}</span>
              </span>
              <span className="hero-mask mt-1">
                <span className="hero-line hero-line-2 hero-name-rest block">
                  {restWords.map((word, index) => (
                    <span key={word} className="whitespace-nowrap">
                      {index > 0 && ' '}
                      <Typed text={word} offset={wordOffsets[index]} count={count} typing={!done} />
                    </span>
                  ))}
                </span>
              </span>
            </span>
          </h1>
          <p className="hero-in hero-in-2 mt-5 text-lg font-semibold tracking-tight lg:text-xl">
            {l(site.title)} <span className="text-muted-foreground">· {t('hero.focus')}</span>
          </p>
          <p className="hero-in hero-in-2 hero-intro mt-3 max-w-[34rem] text-muted-foreground">
            {t('hero.intro')}
          </p>
          <p className={cn(microText, 'hero-in hero-in-3 mt-5')}>
            {site.location} — <time>{time}</time>
          </p>
        </div>

        {/* Retrato emoldurado em destaque, com o que estuda e as tecnologias por cima. */}
        <div className="hero-panel-slot">
          <div className="hero-visual">
            <div aria-hidden className="hero-portrait-frame" />
            <div className="hero-portrait">
              <img
                src={site.hero.portrait.src}
                srcSet={site.hero.portrait.srcSet}
                sizes={site.hero.portrait.sizes}
                alt={t('hero.portraitAlt')}
                width={site.hero.portrait.width}
                height={site.hero.portrait.height}
                fetchPriority="high"
                decoding="async"
                className="size-full object-cover select-none"
              />
            </div>
            <HeroStack />
            <StudyPanel />
          </div>
        </div>

        <div className="hero-cta hero-in hero-in-4">
          <div className="flex flex-wrap items-center gap-3">
            <a href="#projetos" className={cn(buttonVariants({ variant: 'default' }), 'group')}>
              {t('hero.seeProjects')}
              <ArrowRight
                aria-hidden
                className="transition-transform duration-300 ease-out group-hover:translate-x-1"
              />
            </a>
            <CvButton />
          </div>
          {/* No celular, os botões flutuantes já levam a LinkedIn e WhatsApp. */}
          <div className="mt-4 hidden gap-5 text-[11px] font-semibold tracking-[0.14em] uppercase sm:flex">
            <a href="#contato" className="underline-offset-4 hover:underline">
              {t('nav.contact')}
            </a>
            {site.social.linkedin && (
              <ExternalLink
                href={site.social.linkedin}
                className="underline-offset-4 hover:underline"
              >
                {t('social.linkedin')}
              </ExternalLink>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
