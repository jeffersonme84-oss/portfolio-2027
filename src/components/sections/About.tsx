import { SectionHeading } from '@/components/sections/SectionHeading'
import { Timeline } from '@/components/sections/Timeline'
import { about } from '@/content/timeline'
import { useLocale } from '@/hooks/useLocale'
import { screenSection } from '@/lib/layout'
import { cn } from '@/lib/utils'

// Sobre em uma tela: biografia à esquerda, trajetória (lista + detalhe) à direita.
export function About() {
  const { t, l } = useLocale()

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
            <span aria-hidden className="size-2 rounded-full bg-accent" />
            {t('about.rec')}
          </span>
        }
      >
        {t('about.title')}
      </SectionHeading>

      {/* Biografia e valores numa faixa larga; a trajetória (lista + detalhe) embaixo. */}
      <div className="mb-5 grid gap-4 md:mb-7 lg:grid-cols-12 lg:gap-10">
        {/* No celular a biografia fica em 2 linhas, para a trajetória caber na tela. */}
        <p className="line-clamp-2 text-base leading-relaxed md:line-clamp-4 lg:col-span-7 lg:line-clamp-none">
          {l(about.bio)}
        </p>
        <p className="hidden text-sm leading-relaxed text-muted-foreground lg:col-span-5 lg:block">
          {l(about.values)}
        </p>
      </div>
      <p className="sr-only">{t('about.keyboardHint')}</p>
      <Timeline />
    </section>
  )
}
