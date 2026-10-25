import { ExternalLink } from '@/components/layout/ExternalLink'
import { socialIcons } from '@/components/layout/socialIcons'
import { SectionHeading } from '@/components/sections/SectionHeading'
import { Pager } from '@/components/ui/pager'
import { TiltCard } from '@/components/ui/tilt-card'
import { testimonials } from '@/content/testimonials'
import { useLocale } from '@/hooks/useLocale'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { usePager } from '@/hooks/usePager'
import { screenSection } from '@/lib/layout'
import { cn } from '@/lib/utils'

// Linhas de caderno do rótulo de fita.
const notebookLines =
  'bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_1.6rem,var(--lines,var(--border))_1.6rem,var(--lines,var(--border))_calc(1.6rem+1px))]'

// Cada depoimento tem uma interação própria (ciclo pela posição):
// 0 = inclinação 3D que segue o mouse; 1 = sobe com sombra de acento e a faixa cresce;
// 2 = o rótulo "descola" e as linhas do caderno ganham a cor de acento.
const cardHover = [
  '',
  'hover:shadow-[8px_8px_0_var(--accent)] motion-safe:hover:-translate-y-1.5',
  'hover:[--lines:color-mix(in_oklab,var(--accent)_45%,transparent)] motion-safe:hover:-rotate-[1.5deg] motion-safe:hover:translate-x-1',
]

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
}

export function Testimonials() {
  const { t, l } = useLocale()
  // Uma tela por seção: 3 por página no desktop, 2 no tablet, 1 no celular.
  const desktop = useMediaQuery('(min-width: 1024px)')
  const tablet = useMediaQuery('(min-width: 768px)')
  const pager = usePager(testimonials, desktop ? 3 : tablet ? 2 : 1)
  if (testimonials.length === 0) return null
  const LinkedIn = socialIcons.linkedin

  return (
    <section
      id="depoimentos"
      aria-labelledby="depoimentos-titulo"
      className={cn(screenSection, 'mx-auto w-full max-w-[1200px] px-4 md:px-6')}
    >
      <SectionHeading
        id="depoimentos-titulo"
        aside={
          <Pager
            page={pager.page}
            pages={pager.pages}
            onChange={pager.goTo}
            label={t('testimonials.title')}
          />
        }
      >
        {t('testimonials.title')}
      </SectionHeading>

      <ul
        className={cn(
          'grid gap-6',
          testimonials.length > 1 && 'md:grid-cols-2',
          testimonials.length > 2 && 'lg:grid-cols-3',
        )}
      >
        {pager.items.map((item, position) => {
          const variant = (pager.offset + position) % cardHover.length
          const card = (
            <figure
              className={cn(
                'group flex h-full flex-col border-2 border-foreground bg-background transition-[translate,rotate,box-shadow] duration-300',
                cardHover[variant],
              )}
            >
              {/* Faixa superior do rótulo, como numa fita K7 */}
              <div
                aria-hidden
                className={cn(
                  'h-3 border-b-2 border-foreground bg-accent transition-[height] duration-300',
                  variant === 1 && 'group-hover:h-6',
                )}
              />
              <blockquote className={cn('flex-1 px-5 pt-[0.35rem] pb-4', notebookLines)}>
                <p className="font-mono text-sm leading-[1.6rem]">“{l(item.text)}”</p>
              </blockquote>
              <figcaption className="flex items-center gap-3 border-t-2 border-foreground px-5 py-4">
                {item.photo ? (
                  <img
                    src={item.photo}
                    alt=""
                    width={40}
                    height={40}
                    loading="lazy"
                    className="size-10 rounded-full object-cover grayscale"
                  />
                ) : (
                  <span
                    aria-hidden
                    className="flex size-10 items-center justify-center rounded-full border border-foreground font-mono text-xs"
                  >
                    {initials(item.name)}
                  </span>
                )}
                <span className="flex-1 text-sm leading-tight">
                  <span className="block font-semibold">{item.name}</span>
                  <span className="text-muted-foreground">
                    {l(item.role)} · {item.company}
                  </span>
                </span>
                {item.linkedinUrl && (
                  <ExternalLink
                    href={item.linkedinUrl}
                    className="flex size-9 items-center justify-center border border-border hover:border-foreground"
                  >
                    <LinkedIn className="size-4" aria-hidden />
                    <span className="sr-only">
                      {t('testimonials.linkedin')}: {item.name}
                    </span>
                  </ExternalLink>
                )}
              </figcaption>
            </figure>
          )
          return (
            <li key={item.id}>
              {variant === 0 ? <TiltCard className="h-full">{card}</TiltCard> : card}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
