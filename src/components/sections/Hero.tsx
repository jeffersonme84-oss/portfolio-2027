import { ArrowRight } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { CvButton } from '@/components/layout/CvButton'
import { ExternalLink } from '@/components/layout/ExternalLink'
import { CassetteLabel } from '@/components/retro/CassetteLabel'
import { buttonVariants } from '@/components/ui/button-variants'
import { KineticMatrix } from '@/components/ui/kinetic-matrix'
import { site, splitName } from '@/content/site'
import { useClock } from '@/hooks/useClock'
import { useLocale } from '@/hooks/useLocale'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useTypewriter } from '@/hooks/useTypewriter'
import { playSound } from '@/lib/sound'
import { cn } from '@/lib/utils'

const { first, rest } = splitName(site.name)
// Só o último sobrenome é digitado; o restante do nome fica estável desde o carregamento.
const restWords = rest.split(' ')
const typedWord = restWords.at(-1) ?? ''
const staticWords = restWords.slice(0, -1)

const microText = 'font-mono text-[11px] leading-snug tracking-[0.14em] uppercase'

type TypedProps = { text: string; count: number; typing: boolean }

// Letras ainda não digitadas ficam invisíveis: o layout não se move durante a digitação.
function Typed({ text, count, typing }: TypedProps) {
  const typed = Math.min(text.length, count)
  return (
    <>
      {text.slice(0, typed)}
      {typing && (
        <span className="retro-cursor relative inline-block h-[0.78em] w-[0.06em] translate-y-[0.04em] bg-accent align-baseline" />
      )}
      <span className="invisible">{text.slice(typed)}</span>
    </>
  )
}

export function Hero() {
  const { t, l, locale } = useLocale()
  const time = useClock(site.timeZone, locale)
  const { count, done, restart } = useTypewriter(typedWord.length, { speed: 110, delay: 700 })
  const sectionRef = useRef<HTMLElement>(null)
  const lastRetype = useRef(0)
  const reducedMotion = useReducedMotion()

  // Paralaxe suave: a foto acompanha o mouse e o scroll (variáveis CSS, sem re-render).
  useEffect(() => {
    const section = sectionRef.current
    if (!section || reducedMotion) return
    let frame = 0
    const pointer = { x: 0, y: 0 }
    function apply() {
      frame = 0
      section!.style.setProperty('--px', pointer.x.toFixed(3))
      section!.style.setProperty('--py', pointer.y.toFixed(3))
      section!.style.setProperty('--sy', `${Math.min(window.scrollY, 900) * 0.12}px`)
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
    window.addEventListener('scroll', schedule, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      section.removeEventListener('pointermove', onPointerMove)
      section.removeEventListener('pointerleave', onPointerLeave)
      window.removeEventListener('scroll', schedule)
      for (const name of ['--px', '--py', '--sy']) section.style.removeProperty(name)
    }
  }, [reducedMotion])

  // Passar o mouse perto do nome digita o sobrenome de novo (intervalo mínimo entre repetições).
  function retypeSurname() {
    const now = Date.now()
    if (!done || now - lastRetype.current < 1500) return
    lastRetype.current = now
    restart()
  }

  const miniIndex = [
    { href: '#sobre', label: t('nav.about') },
    { href: '#projetos', label: t('nav.projects') },
    { href: '#habilidades', label: t('nav.skills') },
    { href: '#contato', label: t('nav.contactShort') },
  ]

  return (
    <section
      id="inicio"
      ref={sectionRef}
      aria-labelledby="inicio-titulo"
      className="relative isolate h-svh min-h-[600px] overflow-hidden pt-14"
    >
      {/* Foto colorida à direita, na base, dissolvendo na cor da página (claro e escuro).
          Fica abaixo do nome e se move em paralaxe com o mouse e o scroll. */}
      <div className="absolute inset-x-0 bottom-0 -z-20 h-[44%] sm:h-[48%] lg:inset-x-auto lg:right-0 lg:h-[56%] lg:w-[48%]">
        <div className="absolute inset-0 overflow-hidden">
          <div className="size-full motion-safe:animate-reveal motion-safe:[animation-delay:250ms]">
            <div className="size-full transition-transform duration-700 ease-out [transform:translate3d(calc(var(--px,0)*-18px),calc(var(--py,0)*-12px_+_var(--sy,0px)),0)_scale(1.04)] motion-reduce:[transform:none]">
              <img
                src={site.hero.background.src}
                srcSet={site.hero.background.srcSet}
                sizes="(min-width: 1024px) 48vw, 100vw"
                alt={t('hero.portraitAlt')}
                width={site.hero.background.width}
                height={site.hero.background.height}
                fetchPriority="high"
                decoding="async"
                className="size-full object-cover object-[50%_15%] select-none [filter:saturate(0.9)_brightness(1.06)] dark:[filter:none]"
              />
            </div>
          </div>
        </div>
        {/* Bordas fundem na cor da página: esquerda (onde ficam os textos), topo e base.
            O véu passa 2 px das bordas para cobrir a junção com a camada animada da foto. */}
        <div
          aria-hidden
          className="absolute -inset-[2px] bg-[linear-gradient(to_right,var(--background)_0%,var(--background)_3%,color-mix(in_oklab,var(--background)_45%,transparent)_22%,transparent_45%),linear-gradient(to_bottom,var(--background)_0%,var(--background)_4%,transparent_30%),linear-gradient(to_top,var(--background)_0%,var(--background)_3%,transparent_18%)]"
        />
      </div>

      {/* Malha tecnológica com paralaxe 3D: camada decorativa sobre a foto, mais leve no centro */}
      <KineticMatrix
        interactionRef={sectionRef}
        className="-z-10 [mask-image:radial-gradient(ellipse_40%_50%_at_50%_60%,rgb(0_0_0/0.35)_0%,black_100%)]"
      />
      <div className="relative mx-auto flex h-full max-w-[1200px] flex-col px-4 md:px-6">
        {/* Nome gigante */}
        <h1
          id="inicio-titulo"
          onPointerEnter={retypeSurname}
          className="relative z-20 cursor-default pt-4 font-display font-black uppercase lg:pt-6"
        >
          <span className="sr-only">{site.name}</span>
          <span aria-hidden className="block">
            <span className="block text-[min(14vw,11.2rem)] leading-[0.85] tracking-[-0.04em] text-accent motion-safe:animate-rise">
              {first}
            </span>
            <span className="mt-2 block text-[min(8.5vw,3.5rem)] leading-[0.9] tracking-[-0.03em] motion-safe:animate-rise motion-safe:[animation-delay:120ms] lg:text-[min(4.6vw,3.5rem)]">
              {staticWords.map((word) => (
                <span key={word} className="block lg:inline">
                  {word}
                  <span className="hidden lg:inline"> </span>
                </span>
              ))}
              <span className="block whitespace-nowrap lg:inline">
                <Typed text={typedWord} count={count} typing={!done} />
              </span>
            </span>
          </span>
        </h1>

        {/* Micro-textos superiores */}
        <div className="relative z-20 mt-5 flex justify-between gap-6 motion-safe:animate-rise motion-safe:[animation-delay:220ms]">
          <p className={microText}>
            {l(site.title)}
            <br />
            {site.location} — <time>{time}</time>
          </p>
          <nav aria-label={t('hero.index')} className="hidden lg:block">
            <ul className={cn(microText, 'text-right')}>
              {miniIndex.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="inline-block py-[5px] hover:text-accent">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Rodapé da dobra: número + CTAs, e o rótulo K7 ao lado */}
        <div className="relative z-20 mt-auto flex items-end gap-10 pb-6 motion-safe:animate-rise motion-safe:[animation-delay:360ms] sm:pb-14 lg:pb-10">
          <div className="flex w-full flex-col gap-5 bg-gradient-to-t from-background from-60% to-transparent pt-10 lg:w-auto lg:bg-none lg:pt-0">
            <p className="hidden items-end gap-3 lg:flex">
              <span className="font-display text-7xl leading-[0.85] font-black tracking-[-0.04em]">
                {site.experienceYears}
              </span>
              <span className={cn(microText, 'max-w-[8rem] pb-1')}>{t('hero.experience')}</span>
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a href="#projetos" className={buttonVariants({ variant: 'default' })}>
                {t('hero.seeProjects')}
                <ArrowRight aria-hidden />
              </a>
              <CvButton />
            </div>
            <div className="flex gap-5 text-[11px] font-semibold tracking-[0.14em] uppercase">
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

          <CassetteLabel
            side={t('hero.side')}
            interactive={site.easterEggs}
            onSpin={() => playSound('play')}
            onRewind={() => {
              playSound('rewind')
              restart()
            }}
            className="hidden w-64 shrink-0 xl:block"
          >
            <p className="font-display text-[1.75rem] leading-[0.95] font-black tracking-[-0.02em] text-balance text-accent uppercase">
              {t('hero.headline')}
            </p>
          </CassetteLabel>
        </div>
      </div>
    </section>
  )
}
