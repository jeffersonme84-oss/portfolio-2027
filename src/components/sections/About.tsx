import { SectionHeading } from '@/components/sections/SectionHeading'
import { Timeline } from '@/components/sections/Timeline'
import { about } from '@/content/timeline'
import { useLocale } from '@/hooks/useLocale'
import { screenSection } from '@/lib/layout'
import { cn } from '@/lib/utils'

// Sobre em uma tela (modelo "videocassete", aprovado pelo Jefferson, 2026-11-19): no topo,
// quem é ele / o que entrega (esquerda) e onde quer chegar (direita); embaixo, a trajetória
// numa lista com contadores + a "tela" do videocassete com o item escolhido.
export function About() {
  const { t, l } = useLocale()
  // A abertura ("Sou Jefferson, Forward Deployed Engineer em São Paulo") fica em negrito.
  const parts = l(about.bio).split(', ')
  const firstName = parts.slice(0, 2).join(', ')
  const rest = parts.slice(2)

  return (
    <section
      id="sobre"
      aria-labelledby="sobre-titulo"
      className={cn(screenSection, 'mx-auto w-full max-w-[1200px] px-4 md:px-6')}
    >
      <SectionHeading
        id="sobre-titulo"
        aside={
          <span className="flex items-center gap-2 pb-1 font-mono text-[11px] tracking-[0.2em]">
            <span aria-hidden className="size-2 rounded-full bg-accent motion-safe:animate-pulse" />
            {t('about.rec')}
          </span>
        }
      >
        {t('about.title')}
      </SectionHeading>

      <div className="mb-5 grid gap-4 md:mb-7 lg:grid-cols-12 lg:gap-10 short:mb-4">
        {/* Quem sou e o que entrego */}
        <div className="lg:col-span-7">
          <p className="mb-1.5 font-mono text-[10.5px] tracking-[0.2em] text-muted-foreground uppercase">
            {t('about.whoLabel')}
          </p>
          <p className="line-clamp-3 text-[15px] leading-relaxed md:line-clamp-none md:text-base short:text-[15px] short:leading-[1.55]">
            <strong className="font-semibold">{firstName}</strong>
            {rest.length > 0 && `, ${rest.join(', ')}`}
          </p>
        </div>
        {/* Onde quero chegar */}
        <div className="hidden lg:col-span-5 lg:block">
          <p className="mb-1.5 font-mono text-[10.5px] tracking-[0.2em] text-muted-foreground uppercase">
            {t('about.goalLabel')}
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground short:leading-normal">
            {l(about.goal)}
          </p>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {about.tags.map((tag, index) => (
              <li
                key={l(tag)}
                className="rounded-full border border-border px-2.5 py-1 font-mono text-[10.5px] tracking-[0.06em]"
              >
                {index === 0 && (
                  <span aria-hidden className="mr-1 text-accent">
                    ●
                  </span>
                )}
                {l(tag)}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="sr-only">{t('about.keyboardHint')}</p>
      <Timeline />
    </section>
  )
}
