import { ArrowRight } from 'lucide-react'
import type { CSSProperties } from 'react'
import { CvButton } from '@/components/layout/CvButton'
import { ExternalLink } from '@/components/layout/ExternalLink'
import { CassetteLabel } from '@/components/retro/CassetteLabel'
import { buttonVariants } from '@/components/ui/button-variants'
import { site, splitName } from '@/content/site'
import { useClock } from '@/hooks/useClock'
import { useLocale } from '@/hooks/useLocale'
import { useTypewriter } from '@/hooks/useTypewriter'
import { playSound } from '@/lib/sound'
import { cn } from '@/lib/utils'

const { first, rest } = splitName(site.name)
const restWords = rest.split(' ')

// Sem o recorte (fundo transparente), a foto original entra com bordas esmaecidas,
// escondendo o fundo e o braço de outra pessoa à direita.
const fallbackMask: CSSProperties = {
  maskImage: 'radial-gradient(ellipse 44% 78% at 50% 36%, black 62%, transparent 100%)',
}

const microText = 'font-mono text-[11px] leading-snug tracking-[0.14em] uppercase'

type TypedProps = { text: string; offset: number; count: number; showCursor: boolean }

// Linha do nome: letras ainda não digitadas ficam invisíveis para não mexer no layout.
function Typed({ text, offset, count, showCursor }: TypedProps) {
  const typed = Math.max(0, Math.min(text.length, count - offset))
  return (
    <>
      {text.slice(0, typed)}
      {showCursor && typed < text.length && typed > 0 && (
        <span className="retro-cursor text-foreground">_</span>
      )}
      <span className="invisible">{text.slice(typed)}</span>
    </>
  )
}

export function Hero() {
  const { t, l, locale } = useLocale()
  const time = useClock(site.timeZone, locale)
  const total = first.length + rest.length
  const { count, done, restart } = useTypewriter(total)
  const portrait = site.hero.cutout ?? site.hero.fallback

  const miniIndex = [
    { href: '#sobre', label: t('nav.about') },
    { href: '#projetos', label: t('nav.projects') },
    { href: '#habilidades', label: t('nav.skills') },
    { href: '#contato', label: t('nav.contactShort') },
  ]

  return (
    <section
      id="inicio"
      aria-labelledby="inicio-titulo"
      className="relative h-svh min-h-[600px] overflow-hidden pt-14"
    >
      <div className="relative mx-auto flex h-full max-w-[1200px] flex-col px-4 md:px-6">
        {/* Nome gigante atrás do retrato */}
        <h1 id="inicio-titulo" className="relative z-0 pt-4 font-display font-black uppercase lg:pt-6">
          <span className="sr-only">{site.name}</span>
          <span aria-hidden className="block">
            <span className="block text-[min(14vw,11.2rem)] leading-[0.85] tracking-[-0.04em] text-accent">
              <Typed text={first} offset={0} count={count} showCursor={!done} />
            </span>
            <span className="mt-1 block text-[min(12vw,4.9rem)] leading-[0.88] tracking-[-0.04em] lg:text-[min(6.6vw,4.9rem)]">
              {restWords.map((word, index) => {
                const offset = first.length + restWords.slice(0, index).join('').length
                return (
                  <span key={word} className="block lg:inline">
                    {index > 0 && <span className="hidden lg:inline"> </span>}
                    <Typed text={word} offset={offset} count={count} showCursor={!done} />
                  </span>
                )
              })}
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

        {/* Retrato: base encostada na base da dobra */}
        <img
          src={portrait}
          alt={t('hero.portraitAlt')}
          width={723}
          height={1274}
          fetchPriority="high"
          decoding="async"
          style={site.hero.cutout ? undefined : fallbackMask}
          className="pointer-events-none absolute bottom-0 left-1/2 z-10 h-[62%] w-auto max-w-none -translate-x-1/2 object-contain object-bottom select-none sm:h-[70%] lg:h-[84%]"
        />

        {/* Rodapé da dobra: número + CTAs à esquerda, rótulo K7 à direita */}
        <div className="relative z-20 mt-auto flex items-end justify-between gap-6 pb-6 lg:pb-10">
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
                <ExternalLink href={site.social.linkedin} className="underline-offset-4 hover:underline">
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
