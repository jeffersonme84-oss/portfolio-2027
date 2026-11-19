import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { useTranslation } from 'react-i18next'
import { site } from '@/content/site'
import { useClock } from '@/hooks/useClock'
import { useLocale } from '@/hooks/useLocale'
import { finishBoot, getBootRun, subscribeBoot } from '@/lib/boot'
import { bootProgress } from '@/lib/bootProgress'
import '@/styles/boot.css'

// Tela de carregamento "fita K7" (aprovada pelo Jefferson numa prévia, 2026-11-19):
// carretéis passando a fita, nome que se decodifica, log de build, contador odômetro e saída com
// glitch VHS + "TV de tubo desligando". Na primeira visita e ao clicar na marca DEFT. da Home;
// nunca com animações reduzidas (ver src/lib/boot.ts). Clique, Esc ou Enter pulam.
// Estilos em src/styles/boot.css.

const WORD = 'DEFT'
const GLYPHS = '01<>/{}[]#$%&*+=;:ABCDEFGHJKLMNPQRSTUVWXYZ'
const DURATION = 2600
const DIGITS = '0123456789'

export function BootLoader() {
  // Cada "sessão" (1ª visita ou replay pela marca DEFT.) monta uma tela nova, que continua
  // montada até a animação de saída terminar.
  const run = useSyncExternalStore(subscribeBoot, getBootRun)
  const [goneRun, setGoneRun] = useState(0)
  if (run === 0 || goneRun === run) return null
  return <Boot key={run} onGone={() => setGoneRun(run)} />
}

function Boot({ onGone }: { onGone: () => void }) {
  const { t } = useTranslation()
  const { locale } = useLocale()
  const time = useClock(site.timeZone, locale)
  const [phase, setPhase] = useState<'play' | 'glitch' | 'off'>('play')
  const root = useRef<HTMLDivElement>(null)
  const skip = useRef<() => void>(() => {})
  const onGoneRef = useRef(onGone)

  const log = [
    ...(t('boot.log', { returnObjects: true }) as string[]).map((text) => ({ ok: true, text })),
    { ok: false, text: t('boot.loaded', { count: site.hero.stats.technologies }) },
    { ok: false, text: '▶ PLAY' },
  ]

  useEffect(() => {
    const el = root.current
    if (!el) return
    const $ = <T extends Element>(selector: string) => el.querySelector<T>(selector)
    const cols = [...el.querySelectorAll<HTMLElement>('.boot-col i')]
    const letters = [...el.querySelectorAll<HTMLElement>('.boot-name .boot-letter')]
    const dot = $<HTMLElement>('.boot-name .boot-dot')
    const bar = $<HTMLElement>('.boot-bar i')
    const tc = $<HTMLElement>('.boot-tc')
    const typed = $<HTMLElement>('.boot-typed')
    const tapeL = $<SVGCircleElement>('#boot-tape-l')
    const tapeR = $<SVGCircleElement>('#boot-tape-r')
    const reelL = $<SVGGElement>('#boot-reel-l')
    const reelR = $<SVGGElement>('#boot-reel-r')
    const rows = [...el.querySelectorAll<HTMLElement>('.boot-log > div')]

    // Trava a rolagem (o Lenis para com data-scroll-locked).
    document.body.setAttribute('data-scroll-locked', '')
    const html = document.documentElement
    const prevOverflow = html.style.overflow
    html.style.overflow = 'hidden'

    const timers: number[] = []
    let frame = 0
    let ended = false
    const start = performance.now()
    let lastScramble = 0

    const end = () => {
      if (ended) return
      ended = true
      cancelAnimationFrame(frame)
      timers.push(window.setTimeout(() => setPhase('glitch'), 260))
      timers.push(
        window.setTimeout(() => {
          setPhase('off')
          // A Home começa a entrar enquanto a "TV desliga".
          document.body.removeAttribute('data-scroll-locked')
          html.style.overflow = prevOverflow
          finishBoot()
        }, 900),
      )
      timers.push(window.setTimeout(() => onGoneRef.current(), 1700))
    }
    skip.current = end

    const tick = (now: number) => {
      const raw = Math.min(1, Math.max(0, (now - start) / DURATION))
      const p = bootProgress(raw)
      const value = raw >= 1 ? 100 : Math.min(99, Math.floor((p * 100) / 3) * 3)
      const text = String(value).padStart(3, '0')
      cols.forEach((col, i) => (col.style.translate = `0 ${-1.15 * Number(text[i])}em`))
      if (bar) bar.style.width = `${value}%`

      // A fita passa do carretel esquerdo para o direito.
      tapeL?.setAttribute('r', String(18 + 22 * (1 - p)))
      tapeR?.setAttribute('r', String(18 + 22 * p))
      const angle = (now - start) * 0.5
      if (reelL) reelL.style.transform = `rotate(${angle}deg)`
      if (reelR) reelR.style.transform = `rotate(${angle * 1.4}deg)`

      const ms = now - start
      if (tc) {
        tc.textContent = `00:00:${String(Math.floor(ms / 1000)).padStart(2, '0')}:${String(Math.floor(ms / 33) % 30).padStart(2, '0')}`
      }

      // Log: cada linha aparece no seu ponto do progresso; só as 5 últimas ficam.
      const shown = Math.min(rows.length, Math.floor(p * rows.length + 0.3))
      rows.forEach((row, i) => row.classList.toggle('is-on', i < shown && i >= shown - 5))

      // Nome decodificando letra a letra.
      if (now - lastScramble > 55) {
        lastScramble = now
        letters.forEach((letter, i) => {
          const solved = p > 0.25 + i * 0.17
          letter.textContent = solved ? WORD[i] : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
          letter.classList.toggle('is-scrambled', !solved)
        })
        if (dot && p > 0.95) dot.style.opacity = '1'
      }

      // Nome completo em máquina de escrever, em ritmo constante (pelo tempo, não pelo progresso).
      if (typed) {
        const chars = Math.round(Math.min(1, Math.max(0, (raw - 0.1) / 0.7)) * site.name.length)
        if (typed.textContent?.length !== chars) typed.textContent = site.name.slice(0, chars)
      }

      if (raw < 1) frame = requestAnimationFrame(tick)
      else end()
    }
    frame = requestAnimationFrame(tick)

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === 'Enter' || event.key === ' ') end()
    }
    window.addEventListener('keydown', onKey)

    return () => {
      cancelAnimationFrame(frame)
      timers.forEach((timer) => window.clearTimeout(timer))
      window.removeEventListener('keydown', onKey)
      document.body.removeAttribute('data-scroll-locked')
      html.style.overflow = prevOverflow
    }
  }, [])

  return (
    <div
      ref={root}
      role="status"
      aria-label={t('boot.label')}
      onClick={() => skip.current()}
      className={`boot is-${phase}`}
      data-lenis-prevent
    >
      <div aria-hidden className="boot-inner">
        <div className="boot-hud boot-tl">
          <span className="boot-rec" />
          <b>REC</b> &nbsp;{t('boot.side')}
        </div>
        <div className="boot-hud boot-tr">
          {site.location} — <b>{time}</b>
          <br />
          <span className="boot-tc">00:00:00:00</span>
        </div>

        <div className="boot-center">
          <svg className="boot-tape" viewBox="0 0 440 280" fill="none">
            <rect
              x="2"
              y="2"
              width="436"
              height="276"
              rx="18"
              fill="#141412"
              stroke="#2c2c28"
              strokeWidth="2"
            />
            <rect x="28" y="26" width="384" height="70" rx="6" fill="#edeae6" />
            <rect x="28" y="26" width="384" height="14" fill="#d42a20" />
            <text
              x="40"
              y="66"
              fontFamily="Archivo Variable, Arial Black, sans-serif"
              fontWeight="900"
              fontSize="22"
              fill="#111"
              letterSpacing="-1"
            >
              DEFT.
            </text>
            <text
              x="122"
              y="66"
              fontFamily="JetBrains Mono Variable, monospace"
              fontSize="11"
              fill="#555"
              letterSpacing="1.5"
            >
              {t('boot.cassette')}
            </text>
            <text
              x="40"
              y="86"
              fontFamily="JetBrains Mono Variable, monospace"
              fontSize="10"
              fill="#888"
              letterSpacing="1.5"
            >
              {t('hero.role').toUpperCase()}
            </text>
            <rect x="92" y="112" width="256" height="100" rx="50" fill="#0b0b09" stroke="#2c2c28" />
            <circle id="boot-tape-l" cx="142" cy="162" r="40" fill="#2a1a16" />
            <circle id="boot-tape-r" cx="298" cy="162" r="18" fill="#2a1a16" />
            <g className="boot-reel" id="boot-reel-l">
              <circle cx="142" cy="162" r="16" fill="#edeae6" />
              <circle cx="142" cy="162" r="6" fill="#0b0b09" />
              <path d="M142 146v8M142 170v8M126 162h8M150 162h8" stroke="#0b0b09" strokeWidth="3" />
            </g>
            <g className="boot-reel" id="boot-reel-r">
              <circle cx="298" cy="162" r="16" fill="#edeae6" />
              <circle cx="298" cy="162" r="6" fill="#0b0b09" />
              <path d="M298 146v8M298 170v8M282 162h8M306 162h8" stroke="#0b0b09" strokeWidth="3" />
            </g>
            <path d="M118 236h204l22 40H96z" fill="#1c1c19" stroke="#2c2c28" />
            <circle cx="140" cy="256" r="5" fill="#0b0b09" />
            <circle cx="300" cy="256" r="5" fill="#0b0b09" />
            <circle cx="22" cy="22" r="4" fill="#2c2c28" />
            <circle cx="418" cy="22" r="4" fill="#2c2c28" />
            <circle cx="22" cy="258" r="4" fill="#2c2c28" />
            <circle cx="418" cy="258" r="4" fill="#2c2c28" />
          </svg>
          <div className="boot-name">
            {[...WORD].map((_, i) => (
              <span key={i} className="boot-letter is-scrambled">
                0
              </span>
            ))}
            <span className="boot-dot">.</span>
          </div>
          {/* Nome completo (pedido do Jefferson), no lugar da frase. */}
          <div className="boot-tag">
            <span className="boot-typed" />
            <span className="boot-caret" />
          </div>
        </div>

        <div className="boot-log">
          {log.map((row) => (
            <div key={row.text}>
              <span className={row.ok ? 'boot-ok' : undefined}>{row.ok ? '✓' : '›'}</span>{' '}
              {row.text}
            </div>
          ))}
        </div>
        <div className="boot-hud boot-bl">$ deft run portfolio --side A</div>
        <div className="boot-hud boot-skip">{t('boot.skip')}</div>
        <div className="boot-hud boot-br">
          <div className="boot-odo">
            <div className="boot-digits">
              {[0, 1, 2].map((col) => (
                <span key={col} className="boot-col">
                  <i>
                    {[...DIGITS].map((digit) => (
                      <span key={digit}>{digit}</span>
                    ))}
                  </i>
                </span>
              ))}
            </div>
            <span className="boot-pct">%</span>
          </div>
        </div>
        <div className="boot-bar">
          <i />
        </div>
        <div className="boot-slice" style={{ top: '22%' }} />
        <div className="boot-slice" style={{ top: '58%' }} />
        <div className="boot-slice" style={{ top: '81%' }} />
      </div>
    </div>
  )
}
