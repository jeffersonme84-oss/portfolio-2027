import { ArrowRight } from 'lucide-react'
import { useRef } from 'react'
import { CvButton } from '@/components/layout/CvButton'
import { ExternalLink } from '@/components/layout/ExternalLink'
import { CassetteLabel } from '@/components/retro/CassetteLabel'
import { buttonVariants } from '@/components/ui/button-variants'
import { KineticMatrix } from '@/components/ui/kinetic-matrix'
import { site, splitName } from '@/content/site'
import { useClock } from '@/hooks/useClock'
import { useLocale } from '@/hooks/useLocale'
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
          className="relative z-0 cursor-default pt-4 font-display font-black uppercase lg:pt-6"
        >
          <span className="sr-only">{site.name}</span>
          <span aria-hidden className="block">
            <span className="block text-[min(14vw,11.2rem)] leading-[0.85] tracking-[-0.04em] text-accent">
              {first}
            </span>
            <span className="mt-2 block text-[min(8.5vw,3.5rem)] leading-[0.9] tracking-[-0.03em] lg:text-[min(4.6vw,3.5rem)]">
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
        <div className="relative z-20 mt-5 flex justify-between gap-6">
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

        {/* Foto inteira (todos os detalhes visíveis), menor e alinhada à direita */}
        <figure className="absolute inset-x-4 top-[47%] z-10 aspect-video sm:inset-x-6 sm:top-[42%] lg:inset-x-auto lg:top-auto lg:right-16 lg:bottom-10 xl:right-10 lg:w-[min(46%,34rem)]">
          <img
            src={site.hero.background.src}
            srcSet={site.hero.background.srcSet}
            sizes="(min-width: 1024px) 34rem, 92vw"
            alt={t('hero.portraitAlt')}
            width={site.hero.background.width}
            height={site.hero.background.height}
            fetchPriority="high"
            decoding="async"
            className="size-full rounded-md object-contain shadow-[0_24px_60px_-28px_rgb(0_0_0/0.55)] ring-1 ring-foreground/10 select-none"
          />
        </figure>

        {/* Rodapé da dobra: número + CTAs, e o rótulo K7 ao lado (a foto fica livre à direita) */}
        <div className="relative z-20 mt-auto flex items-end gap-10 pb-6 sm:pb-14 lg:pb-10">
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
