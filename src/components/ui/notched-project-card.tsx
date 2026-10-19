import { ArrowUpRight } from 'lucide-react'
import type { AnchorHTMLAttributes, CSSProperties } from 'react'
import { cn } from '@/lib/utils'

/**
 * NotchedProjectCard (adaptado de 21st.dev ao estilo editorial do portfólio)
 *
 * Capa com um recorte arredondado no canto inferior direito e a seta de "abrir"
 * encaixada nele. O recorte é pintado na cor da superfície ATRÁS do card
 * (`surface`); em outro fundo, passe a cor dele.
 *
 * Adaptações: sem "use client" (Vite), cantos menores, título em display,
 * proporção configurável (pôster 2:3), classes do disco por prop (parede escura),
 * rótulo acessível da ação e atributos extras repassados ao link.
 */

export interface NotchedProjectCardProps extends Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'title'
> {
  href: string
  title: string
  description?: string
  /** capa */
  image: string
  imageAlt?: string
  /** selo no topo da capa, ex.: o ano */
  badge?: string
  tags?: string[]
  /** capa em P&B que ganha cor no hover / foco */
  monochrome?: boolean
  /** cor atrás do card; o recorte é pintado nela */
  surface?: string
  /** preenchimento do disco no hover (qualquer cor CSS) */
  accent?: string
  /** cor da seta sobre `accent` */
  accentForeground?: string
  /** proporção da capa, ex.: '2 / 3' */
  aspect?: string
  /** classes do disco da seta em repouso */
  discClassName?: string
  /** texto para leitores de tela, ex.: "Abrir estudo de caso" */
  actionLabel?: string
}

const DISC = 56 // disco da seta, px
const BLOCK = 72 // bloco do recorte, px (raio = BLOCK - DISC / 2)
const FILLET = 24 // curva onde o recorte encontra as bordas da capa, px

export function NotchedProjectCard({
  href,
  title,
  description,
  image,
  imageAlt = '',
  badge,
  tags = [],
  monochrome = false,
  surface = 'var(--background)',
  accent,
  accentForeground = '#111111',
  aspect = '4 / 3',
  discClassName = 'bg-secondary text-secondary-foreground',
  actionLabel,
  className,
  ...props
}: NotchedProjectCardProps) {
  const tone = monochrome
    ? 'grayscale transition-[filter,scale] duration-500 group-hover:grayscale-0 group-focus-visible:grayscale-0 motion-reduce:transition-none'
    : 'transition-[scale] duration-500 motion-reduce:transition-none'

  return (
    <a href={href} className={cn('group flex flex-col rounded-lg', className)} {...props}>
      <div className="relative">
        {/* capa */}
        <div
          className="relative overflow-hidden rounded-lg bg-muted"
          style={{ aspectRatio: aspect }}
        >
          <img
            src={image}
            alt={imageAlt}
            loading="lazy"
            decoding="async"
            className={cn(
              'absolute inset-0 h-full w-full object-cover group-hover:scale-[1.04] motion-reduce:group-hover:scale-100',
              tone,
            )}
          />
          {badge && (
            <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center pt-4">
              <span className="rounded-full border border-white/40 bg-black/40 px-2.5 py-1 font-mono text-[10px] tracking-[0.18em] text-white uppercase backdrop-blur-md">
                {badge}
              </span>
            </div>
          )}
        </div>

        {/* recorte: bloco com canto côncavo e um filete em cada ponta */}
        <div
          aria-hidden
          className="absolute right-0 bottom-0"
          style={{
            width: BLOCK,
            height: BLOCK,
            borderTopLeftRadius: BLOCK - DISC / 2,
            background: surface,
          }}
        />
        {[
          { bottom: BLOCK, right: 0 },
          { bottom: 0, right: BLOCK },
        ].map((position, index) => (
          <div
            key={index}
            aria-hidden
            className="absolute"
            style={{
              ...position,
              width: FILLET,
              height: FILLET,
              background: `radial-gradient(circle at top left, transparent ${FILLET - 0.5}px, ${surface} ${FILLET}px)`,
            }}
          />
        ))}

        {/* seta encaixada no recorte */}
        <span
          aria-hidden
          className={cn(
            'absolute right-0 bottom-0 flex items-center justify-center rounded-full transition-[background-color,color,scale] duration-300 group-hover:scale-105 motion-reduce:transition-none',
            discClassName,
            accent
              ? 'group-hover:bg-[var(--card-accent)] group-hover:text-[var(--card-accent-fg)] group-focus-visible:bg-[var(--card-accent)] group-focus-visible:text-[var(--card-accent-fg)]'
              : 'group-hover:bg-primary group-hover:text-primary-foreground',
          )}
          style={
            {
              width: DISC,
              height: DISC,
              '--card-accent': accent,
              '--card-accent-fg': accentForeground,
            } as CSSProperties
          }
        >
          <ArrowUpRight className="size-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>

      <h3 className="mt-5 font-display text-3xl leading-[0.9] font-black tracking-[-0.03em] [overflow-wrap:anywhere] uppercase">
        {title}
        {actionLabel && <span className="sr-only"> — {actionLabel}</span>}
      </h3>
      {description && <p className="mt-2 text-sm leading-relaxed opacity-75">{description}</p>}
      {tags.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <li
              key={`${tag}-${index}`}
              className="rounded-sm border border-current/30 px-2 py-1 font-mono text-[10px] tracking-[0.15em] uppercase opacity-80"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}
    </a>
  )
}

export default NotchedProjectCard
