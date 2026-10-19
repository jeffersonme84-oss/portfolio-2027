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
      {/* Malha tecnológica: camada decorativa atrás de tudo, mais visível nas bordas */}
      <KineticMatrix
        interactionRef={sectionRef}
        className="-z-10 [mask-image:radial-gradient(ellipse_42%_55%_at_50%_58%,transparent_35%,black_100%)]"
      />
      <div className="relative mx-auto flex h-full max-w-[1200px] flex-col px-4 md:px-6">
        {/* Nome gigante atrás do robô */}
        <h1
          id="inicio-titulo"
          className="relative z-0 pt-4 font-display font-black uppercase lg:pt-6"
        >
          <span className="sr-only">{site.name}</span>
          <span aria-hidden className="block">
            <span className="block text-[min(14vw,11.2rem)] leading-[0.85] tracking-[-0.04em] text-accent">
              {first}
            </span>
            <span className="mt-1 block text-[min(12vw,4.9rem)] leading-[0.88] tracking-[-0.04em] lg:text-[min(6.6vw,4.9rem)]">
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

        {/* Robô de corpo inteiro em primeiro plano: base encostada na base da dobra */}
        <img
          src={site.hero.src}
          srcSet={site.hero.srcSet}
          sizes="(min-width: 1024px) 448px, (min-width: 640px) 50vh, 42vh"
          alt={t('hero.portraitAlt')}
          width={site.hero.width}
          height={site.hero.height}
          fetchPriority="high"
          decoding="async"
          className="pointer-events-none absolute bottom-0 left-1/2 z-10 h-[44%] w-auto max-w-[min(100%,48rem)] -translate-x-1/2 object-contain object-bottom select-none sm:h-[52%] lg:h-[63%] lg:max-w-[28rem]"
        />

        {/* Rodapé da dobra: número + CTAs à esquerda, rótulo K7 à direita */}
        <div className="relative z-20 mt-auto flex items-end justify-between gap-6 pb-6 sm:pb-14 lg:pb-10">
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
            className="mr-14 hidden shrink-0 lg:block"
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
