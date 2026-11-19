import { ArrowDown, ArrowRight, Download, Mail, MapPin, Play } from 'lucide-react'
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { FaLinkedinIn } from 'react-icons/fa'
import { SiGithub, SiWhatsapp } from 'react-icons/si'
import { ExternalLink } from '@/components/layout/ExternalLink'
import { MatrixPortrait } from '@/components/retro/MatrixPortrait'
import { TapeDeckCounter } from '@/components/retro/TapeDeckCounter'
import { useVisitStats } from '@/hooks/useVisitStats'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { projects } from '@/content/projects'
import { site } from '@/content/site'
import { useBootDone } from '@/hooks/useBootDone'
import { useClock } from '@/hooks/useClock'
import { useLocale } from '@/hooks/useLocale'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useTheme } from '@/hooks/useTheme'
import { useTypewriter } from '@/hooks/useTypewriter'
import { NAV_SECTIONS } from '@/lib/sections'
import { cn } from '@/lib/utils'

// Home "DEFT." (pedido do Jefferson, 2026-11-19): a arte dele (foto + PORTFÓLIO ao fundo) entra
// sem alterações. No desktop ela vira uma "cena" de 1376 × 768 escalada para a largura da tela;
// textos e botões novos ficam por cima nas mesmas coordenadas da arte. Onde a arte já tinha um
// texto que mudou, uma "tampa" (deft-patch) na cor do fundo cobre o original.
// No celular, a foto aparece recortada no topo e o conteúdo vem em HTML embaixo.
// Estilos em src/styles/hero.css.

const STAGE_W = 1376
const STAGE_H = 768

function at(left: number, top: number, width?: number, height?: number): CSSProperties {
  return { left, top, width, height }
}

const featured = projects.find((project) => project.slug === site.hero.featuredProject)

function whatsappHref(message: string) {
  return `${site.whatsappUrl}?text=${encodeURIComponent(message)}`
}

// Número que sobe contando (0 → valor). Com animações reduzidas, aparece pronto.
function CountUp({ to, pad = 0 }: { to: number; pad?: number }) {
  const reduced = useReducedMotion()
  const ready = useBootDone()
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (reduced || !ready) return
    let frame = 0
    const start = performance.now() + 500
    const tick = (now: number) => {
      const progress = Math.min(1, Math.max(0, (now - start) / 1200))
      setValue(Math.round(to * (1 - Math.pow(1 - progress, 3))))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [to, reduced, ready])

  return <>{String(reduced ? to : value).padStart(pad, '0')}</>
}

// Nome completo digitado letra a letra, com cursor no acento. Só começa depois do carregamento.
function TypedName() {
  const ready = useBootDone()
  if (!ready) return <span aria-hidden className="deft-caret" />
  return <TypedNameRun />
}

// Redigita a cada 7 s depois de terminar (pedido do Jefferson). Com animações reduzidas, fica fixo.
const RETYPE_MS = 7000

function TypedNameRun() {
  const { count, done, restart } = useTypewriter(site.name.length, { speed: 70, delay: 700 })
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!done || reduced) return
    const timer = window.setTimeout(restart, RETYPE_MS)
    return () => window.clearTimeout(timer)
  }, [done, reduced, restart])

  return (
    <span aria-hidden>
      {site.name.slice(0, count)}
      <span className={cn('deft-caret', done && 'is-done')} />
    </span>
  )
}

type Stat = { to: number; pad: number; label: string; sub: string; href: string }
type Contact = { href: string; label: string; icon: ReactNode; external: boolean }

// `iconOnly`: só o ícone na tela (o nome fica para leitores de tela e na dica do mouse).
function ContactLink({
  item,
  className,
  iconOnly = false,
}: {
  item: Contact
  className?: string
  iconOnly?: boolean
}) {
  const content = (
    <>
      {item.icon}
      {iconOnly ? <span className="sr-only">{item.label}</span> : item.label}
    </>
  )
  const title = iconOnly ? item.label : undefined
  if (!item.external) {
    return (
      <a href={item.href} className={className} title={title}>
        {content}
      </a>
    )
  }
  return (
    <ExternalLink href={item.href} className={className} title={title}>
      {content}
    </ExternalLink>
  )
}

export function Hero() {
  const { t, l, locale } = useLocale()
  const time = useClock(site.timeZone, locale)
  const reduced = useReducedMotion()
  const isLight = useTheme().resolved === 'light'
  const visits = useVisitStats()
  const artSrc = isLight ? site.hero.backgroundLight : site.hero.background.src
  const heroRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const photoRef = useRef<HTMLAnchorElement>(null)

  const cvHref = site.cv[locale]
  const waHref = whatsappHref(t('hero.whatsappMessage'))
  const caseHref = featured ? `#projeto-${featured.slug}` : '#projetos'

  // Destaques com dados do LinkedIn (experiência primeiro: é o que o recrutador procura).
  const stats: Stat[] = [
    {
      to: site.hero.stats.years,
      pad: 2,
      label: t('hero.stats.years'),
      sub: t('hero.stats.yearsSub'),
      href: '#sobre',
    },
    {
      to: site.hero.stats.technologies,
      pad: 2,
      label: t('hero.stats.technologies'),
      sub: t('hero.stats.technologiesSub'),
      href: '#habilidades',
    },
    {
      to: site.hero.stats.degrees,
      pad: 2,
      label: t('hero.stats.degree'),
      sub: t('hero.stats.degreeSub'),
      href: '#sobre',
    },
    {
      to: site.hero.stats.postAreas,
      pad: 2,
      label: t('hero.stats.post'),
      sub: t('hero.stats.postSub'),
      href: '#sobre',
    },
  ]

  // Menu na ordem da rolagem (Início → Contato), o mesmo do header.
  const menu = NAV_SECTIONS.map(({ id, labelKey }) => ({
    href: `#${id}`,
    label: t(id === 'contato' ? 'nav.contactShort' : labelKey),
  }))

  const contacts: Contact[] = [
    { href: waHref, label: t('social.whatsapp'), icon: <SiWhatsapp aria-hidden />, external: true },
    ...(site.social.linkedin
      ? [
          {
            href: site.social.linkedin,
            label: t('social.linkedin'),
            icon: <FaLinkedinIn aria-hidden />,
            external: true,
          },
        ]
      : []),
    ...(site.social.github
      ? [
          {
            href: site.social.github,
            label: t('social.github'),
            icon: <SiGithub aria-hidden />,
            external: true,
          },
        ]
      : []),
    {
      href: `mailto:${site.email}`,
      label: t('social.email'),
      icon: <Mail aria-hidden />,
      external: false,
    },
  ]

  // Desktop: a cena 1376 × 768 cabe inteira na tela (largura e altura), centralizada, como as
  // outras seções. A sobra vira faixa na cor do fundo da arte.
  useEffect(() => {
    const hero = heroRef.current
    const stage = stageRef.current
    if (!hero || !stage) return
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      const scale = Math.min(width / STAGE_W, height / STAGE_H)
      stage.style.setProperty('--scale', String(scale))
      stage.style.left = `${(width - STAGE_W * scale) / 2}px`
      stage.style.top = `${(height - STAGE_H * scale) / 2}px`
    })
    observer.observe(hero)
    return () => observer.disconnect()
  }, [])

  // Mouse na Home: paralaxe leve da arte, inclinação 2.5D da cena e brilho vermelho que segue
  // o ponteiro (--px/--py de -0.5 a 0.5, lidos pelo hero.css). Nada disso com animações reduzidas.
  useEffect(() => {
    const hero = heroRef.current
    if (!hero || reduced) return
    let frame = 0
    const pointer = { x: 0, y: 0 }
    const apply = () => {
      frame = 0
      hero.style.setProperty('--px', pointer.x.toFixed(3))
      hero.style.setProperty('--py', pointer.y.toFixed(3))
    }
    const onMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      const rect = hero.getBoundingClientRect()
      pointer.x = (event.clientX - rect.left) / rect.width - 0.5
      pointer.y = (event.clientY - rect.top) / rect.height - 0.5
      if (!frame) frame = requestAnimationFrame(apply)
    }
    const onLeave = () => {
      pointer.x = 0
      pointer.y = 0
      if (!frame) frame = requestAnimationFrame(apply)
    }
    hero.addEventListener('pointermove', onMove)
    hero.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(frame)
      hero.removeEventListener('pointermove', onMove)
      hero.removeEventListener('pointerleave', onLeave)
      hero.style.removeProperty('--px')
      hero.style.removeProperty('--py')
    }
  }, [reduced])

  return (
    // A Home segue o tema: arte escura ou clara (cores em hero.css, `.deft-hero.is-light`).
    <section
      id="inicio"
      aria-labelledby="inicio-titulo"
      className={cn('deft-hero', isLight && 'is-light')}
      style={{ '--deft-art': `url('${artSrc}')` } as CSSProperties}
    >
      <h1 id="inicio-titulo" className="sr-only">
        {site.name} · {t('hero.role')}
      </h1>

      {/* ================= Desktop (lg+) ================= */}
      <div ref={heroRef} className="deft-desktop">
        <div className="deft-tilt">
          <div ref={stageRef} className="deft-stage">
            <img
              key={artSrc}
              src={artSrc}
              alt={t('hero.portraitAlt')}
              width={STAGE_W}
              height={STAGE_H}
              fetchPriority="high"
              decoding="async"
              className="deft-art"
            />
            <MatrixPortrait src={artSrc} targetRef={photoRef} />

            {/* Menu: "Summit" sai, Habilidades entra. */}
            <div aria-hidden className="deft-patch" style={at(396, 8, 508, 38)} />
            <nav
              aria-label={t('nav.label')}
              className="deft-nav deft-in"
              style={at(400, 12, 500, 30)}
            >
              {menu.map((item, index) => (
                <a key={item.label} href={item.href} className={cn(index === 0 && 'is-first')}>
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="deft-tools deft-in" style={{ right: STAGE_W - 1180, top: 11 }}>
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
            {/* Área da foto: o cursor vira "PLAY ▶" e o clique leva ao Sobre. */}
            <a
              href="#sobre"
              ref={photoRef}
              className="deft-photo"
              data-cursor-ring="off"
              style={at(565, 112, 335, 598)}
            >
              <span className="sr-only">{t('nav.about')}</span>
            </a>
            {/* Dica que aparece com o mouse na foto: rolar para cima vira tudo código. */}
            <p aria-hidden className="deft-matrix-hint" style={at(612, 668)}>
              {t('hero.matrixHint')}
            </p>
            <ExternalLink
              href={waHref}
              className="deft-hot"
              data-cursor={t('cursor.chat')}
              style={at(1191, 7, 150, 40)}
            >
              <span className="sr-only">{t('nav.talk')}</span>
            </ExternalLink>
            <a href="#inicio" className="deft-hot is-square" style={at(22, 8, 94, 38)}>
              <span className="sr-only">{t('nav.home')}</span>
            </a>

            {/* Topo direito: acento corrigido + relógio de São Paulo. */}
            <div aria-hidden className="deft-patch" style={at(1192, 71, 160, 27)} />
            <p className="deft-free deft-in" style={{ right: 34, top: 77 }}>
              {t('hero.available')}
            </p>
            <p className="deft-clock deft-in" style={{ right: 34, top: 94 }}>
              {site.location} — <time>{time}</time>
            </p>

            {/* Nome completo, digitado. */}
            <div aria-hidden className="deft-patch" style={at(20, 496, 320, 35)} />
            <p className="deft-full deft-in" style={at(28, 498)}>
              <span className="sr-only">{site.name}</span>
              <TypedName />
            </p>

            {/* Cargo: Forward Deployed Engineer (FDE) no lugar do "Full Stack" desenhado na arte
                (canto de cima e linha vermelha embaixo do nome). */}
            <div aria-hidden className="deft-patch" style={at(20, 74, 222, 36)} />
            <p className="deft-roletag deft-in" style={at(25, 77)}>
              {t('hero.roleTag')}
              <span>{t('hero.roleFocus')}</span>
            </p>
            <div aria-hidden className="deft-patch" style={at(22, 534, 300, 31)} />
            <p className="deft-role-line deft-in" style={at(28, 536)}>
              {t('hero.role')}
            </p>

            {/* "Ver projetos" já está na arte: área clicável por cima. */}
            <a
              href="#projetos"
              className="deft-hot is-red"
              data-cursor={t('cursor.view')}
              style={at(28, 654, 142, 44)}
            >
              <span className="sr-only">{t('hero.seeProjects')}</span>
            </a>
            <div aria-hidden className="deft-patch" style={at(178, 652, 304, 50)} />
            {cvHref && (
              <a href={cvHref} download className="deft-cv deft-in" style={at(185, 654)}>
                {t('cv.download')}
                <Download aria-hidden />
              </a>
            )}
            <p className="deft-loc deft-in" style={at(cvHref ? 330 : 190, 667)}>
              <MapPin aria-hidden />
              {t('hero.workMode')}
            </p>

            {/* Canto de baixo: o contador de visitas (deck K7) fica à direita, na coluna dos
                destaques. Sem Supabase, volta o "Ver por dentro" à esquerda. A tampa da esquerda
                cobre o botão de play da arte. */}
            {visits.status === 'ready' ? (
              <>
                <div aria-hidden className="deft-patch" style={at(16, 728, 300, 40)} />
                <TapeDeckCounter
                  stats={visits}
                  className="deft-deck deft-in"
                  style={at(STAGE_W - 34 - 262, 727)}
                />
              </>
            ) : visits.status === 'loading' ? (
              <div aria-hidden className="deft-patch" style={at(16, 728, 300, 40)} />
            ) : (
              featured && (
                <>
                  <div aria-hidden className="deft-patch" style={at(56, 738, 200, 26)} />
                  <a href={caseHref} className="deft-case deft-in" style={at(24, 737)}>
                    <span aria-hidden className="deft-case-dot" />
                    <span className="deft-muted">{t('hero.insideLook')} •</span> {l(featured.title)}
                  </a>
                </>
              )
            )}

            {/* Ao lado do ícone da arte: certificações (LinkedIn) no lugar de "Do banco de dados
                até a tela.". */}
            <div aria-hidden className="deft-patch" style={at(1140, 448, 205, 50)} />
            <a href="#sobre" className="deft-cert deft-in" style={at(1146, 452, 196, 44)}>
              {t('hero.cert.title')}
              <small>{t('hero.cert.sub')}</small>
            </a>

            {/* Destaques com dados reais; cada linha leva à seção correspondente. Uma tampa só
                cobre as 3 linhas da arte; as 4 linhas novas têm a própria linha divisória. */}
            <div aria-hidden className="deft-patch" style={at(1082, 503, 266, 200)} />
            <ul aria-label={t('hero.stats.label')}>
              {stats.map((stat, index) => (
                <li key={stat.label}>
                  <a
                    href={stat.href}
                    className="deft-row deft-in"
                    style={at(1087, 506 + index * 48, 252, 44)}
                  >
                    <b>
                      <CountUp to={stat.to} pad={stat.pad} />
                    </b>
                    <span>
                      {stat.label}
                      <small>{stat.sub}</small>
                    </span>
                    <ArrowRight aria-hidden className="deft-row-arrow" />
                  </a>
                </li>
              ))}
            </ul>

            {/* Contatos em ícones redondos, centralizados embaixo da foto (proposta C, aprovada).
                A base da foto se dissolve na cor do fundo e esconde a barra desenhada na arte;
                outro degradê limpa o canto do contador. */}
            <div aria-hidden className="deft-fade" style={at(330, 672, 716, 96)} />
            <div aria-hidden className="deft-fade is-side" style={at(1056, 684, 320, 84)} />
            <nav
              aria-label={t('hero.contactBar')}
              className="deft-dock deft-in"
              style={at(612, 722, 240, 34)}
            >
              {contacts.map((item, index) => (
                <ContactLink
                  key={item.label}
                  item={item}
                  iconOnly
                  className={cn(index === 0 && 'is-wa')}
                />
              ))}
            </nav>

            {/* Brilho vermelho que segue o mouse, por cima de tudo (sem bloquear cliques). */}
            <div aria-hidden className="deft-glare" />
          </div>
        </div>
      </div>

      {/* ================= Celular e tablet (< lg) ================= */}
      <div className="deft-mobile">
        <div className="deft-mobile-art" role="img" aria-label={t('hero.portraitAlt')}>
          <span className="deft-mobile-free">{t('hero.available')}</span>
        </div>
        <div className="relative z-10 -mt-8 px-4 pb-10 sm:px-6">
          <p className="deft-hi deft-in">{t('hero.hi')}</p>
          <p aria-hidden className="deft-brand deft-in">
            {t('hero.brand')}
            <i />
          </p>
          <p className="mt-1 text-lg font-light deft-muted deft-in">
            <span className="sr-only">{site.name}</span>
            <TypedName />
          </p>
          <p className="mt-2 text-[17px] deft-role deft-in">{t('hero.role')}</p>
          <p className="mt-2 max-w-xl text-[15px] leading-relaxed deft-soft deft-in">
            {t('hero.intro')}
          </p>
          <div className={cn('mt-5 grid gap-2.5 deft-in', cvHref && 'grid-cols-2')}>
            <a href="#projetos" className="deft-btn is-red">
              {t('hero.seeProjects')}
              <ArrowDown aria-hidden />
            </a>
            {cvHref && (
              <a href={cvHref} download className="deft-btn">
                {t('cv.download')}
                <Download aria-hidden />
              </a>
            )}
          </div>
          <p className="mt-3.5 flex items-center gap-1.5 text-[13.5px] deft-soft deft-in">
            <MapPin aria-hidden className="size-3.5 text-[#d42a20]" />
            {t('hero.workMode')}
          </p>
          <ul
            aria-label={t('hero.stats.label')}
            className="mt-5 grid grid-cols-2 gap-2 deft-in sm:grid-cols-4"
          >
            {stats.map((stat) => (
              <li key={stat.label}>
                <a href={stat.href} className="deft-card">
                  <b>
                    <CountUp to={stat.to} pad={stat.pad} />
                  </b>
                  <span>{stat.label}</span>
                </a>
              </li>
            ))}
          </ul>
          {visits.status === 'ready' && <TapeDeckCounter stats={visits} className="mt-5 deft-in" />}
          {featured && visits.status === 'off' && (
            <a href={caseHref} className="mt-5 flex items-center gap-2.5 text-sm deft-soft deft-in">
              <span className="flex size-7 items-center justify-center rounded-full bg-[#d42a20] text-white">
                <Play aria-hidden className="size-3 fill-current" />
              </span>
              {t('hero.insideLook')} • <span className="deft-strong">{l(featured.title)}</span>
            </a>
          )}
          <nav aria-label={t('hero.contactBar')} className="deft-mobile-dock deft-in">
            {contacts.map((item, index) => (
              <ContactLink key={item.label} item={item} className={cn(index === 0 && 'is-wa')} />
            ))}
          </nav>
        </div>
      </div>
    </section>
  )
}
