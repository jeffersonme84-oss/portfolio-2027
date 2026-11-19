import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useBootDone } from '@/hooks/useBootDone'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { playSound } from '@/lib/sound'
import { cn } from '@/lib/utils'
import type { VisitStats } from '@/lib/visits'

// Contador de visitas em forma de contador mecânico de deck K7 (aprovado numa prévia,
// 2026-11-19): rodas de números que giram, carretel rodando e "● N agora" ao vivo.
// Easter egg: clique rebobina até 00000 (◀◀ REW) e toca de volta até o total.
// Dados em src/lib/visits.ts. Estilos em src/styles/retro.css (.deck-*).

const WHEELS = 5
const DIGITS = '0123456789'

type Props = {
  stats: Extract<VisitStats, { status: 'ready' }>
  className?: string
  style?: React.CSSProperties
}

export function TapeDeckCounter({ stats, className, style }: Props) {
  const { t, i18n } = useTranslation()
  const reduced = useReducedMotion()
  const bootDone = useBootDone()
  const [shown, setShown] = useState(reduced ? stats.total : 0)
  const [mode, setMode] = useState<'play' | 'rew'>('play')
  const timer = useRef(0)

  // Entra rolando de 00000 até o total (depois do carregamento); depois acompanha o total.
  useEffect(() => {
    if (!bootDone || mode === 'rew') return
    const id = window.setTimeout(() => setShown(stats.total), reduced ? 0 : 450)
    return () => window.clearTimeout(id)
  }, [stats.total, bootDone, reduced, mode])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  function rewind() {
    if (mode === 'rew') return
    playSound('rewind')
    setMode('rew')
    setShown(0)
    timer.current = window.setTimeout(() => {
      playSound('play')
      setMode('play')
    }, 900)
  }

  const text = String(Math.min(shown, 10 ** WHEELS - 1)).padStart(WHEELS, '0')
  const total = stats.total.toLocaleString(i18n.language)

  return (
    <button
      type="button"
      onClick={rewind}
      data-cursor={t('cursor.rew')}
      aria-label={t('visits.aria', { total, count: stats.online })}
      className={cn('deck', mode === 'rew' && 'is-rew', className)}
      style={
        {
          ...style,
          '--deck-speed': `${Math.max(0.8, 3.2 - stats.online * 0.4)}s`,
        } as React.CSSProperties
      }
    >
      <span aria-hidden className="deck-window">
        {[...text].map((digit, i) => (
          <span key={i} className="deck-wheel">
            <span
              className="deck-strip"
              style={{
                translate: `0 ${-10 * Number(digit)}%`,
                transitionDelay: mode === 'rew' ? '0s' : `${(WHEELS - 1 - i) * 0.09}s`,
              }}
            >
              {[...DIGITS].map((d) => (
                <span key={d}>{d}</span>
              ))}
            </span>
          </span>
        ))}
      </span>

      <span aria-hidden className="deck-labels">
        <b>{mode === 'rew' ? `◀◀ ${t('visits.rew')}` : t('visits.label')}</b>
        <span className="deck-live">{t('visits.online', { count: stats.online })}</span>
      </span>

      {/* Mini fita K7 à direita: os carretéis giram (mais rápido com mais gente online). */}
      <svg aria-hidden className="deck-tape" viewBox="0 0 44 28">
        <rect x="0.75" y="0.75" width="42.5" height="26.5" rx="3" className="deck-tape-body" />
        <rect x="4" y="3.5" width="36" height="6" rx="1" className="deck-tape-label" />
        <rect x="4" y="3.5" width="36" height="2" className="deck-tape-stripe" />
        <rect x="9" y="12" width="26" height="9" rx="4.5" className="deck-tape-window" />
        <path d="M14 21.5h16" className="deck-tape-band" />
        <g className="deck-tape-reel">
          <circle cx="15" cy="16.5" r="3.4" />
          <path d="M15 13.6v1.6M12.5 18l1.4-.8M17.5 18l-1.4-.8" />
        </g>
        <g className="deck-tape-reel">
          <circle cx="29" cy="16.5" r="3.4" />
          <path d="M29 13.6v1.6M26.5 18l1.4-.8M31.5 18l-1.4-.8" />
        </g>
        <path d="M12 27.25l2-3.5h16l2 3.5" className="deck-tape-foot" />
      </svg>
      {stats.demo && (
        <span aria-hidden className="deck-demo">
          {t('visits.demo')}
        </span>
      )}
    </button>
  )
}
