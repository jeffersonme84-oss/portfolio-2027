import { ExternalLink } from '@/components/layout/ExternalLink'
import { socialIcons } from '@/components/layout/socialIcons'
import { SectionHeading } from '@/components/sections/SectionHeading'
import { testimonials } from '@/content/testimonials'
import { useLocale } from '@/hooks/useLocale'
import { cn } from '@/lib/utils'

// Linhas de caderno do rótulo de fita.
const notebookLines =
  'bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_1.6rem,var(--border)_1.6rem,var(--border)_calc(1.6rem+1px))]'

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
}

export function Testimonials() {
  const { t, l } = useLocale()
  if (testimonials.length === 0) return null
  const LinkedIn = socialIcons.linkedin

  return (
    <section
      id="depoimentos"
      aria-labelledby="depoimentos-titulo"
      className="mx-auto max-w-[1200px] px-4 py-24 md:px-6 md:py-32"
    >
      <SectionHeading id="depoimentos-titulo">{t('testimonials.title')}</SectionHeading>

      <ul
        className={cn(
          'grid gap-6',
          testimonials.length > 1 && 'md:grid-cols-2',
          testimonials.length > 2 && 'lg:grid-cols-3',
        )}
      >
        {testimonials.map((item) => (
          <li key={item.id}>
            <figure className="flex h-full flex-col border-2 border-foreground bg-background">
              {/* Faixa superior do rótulo, como numa fita K7 */}
              <div aria-hidden className="h-3 border-b-2 border-foreground bg-accent" />
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
          </li>
        ))}
      </ul>
    </section>
  )
}
