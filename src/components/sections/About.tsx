import { SectionHeading } from '@/components/sections/SectionHeading'
import { Timeline } from '@/components/sections/Timeline'
import { about } from '@/content/timeline'
import { useLocale } from '@/hooks/useLocale'

export function About() {
  const { t, l } = useLocale()

  return (
    <section
      id="sobre"
      aria-labelledby="sobre-titulo"
      className="mx-auto max-w-[1200px] px-4 py-24 md:px-6 md:py-32"
    >
      <SectionHeading
        id="sobre-titulo"
        aside={
          <span className="flex items-center gap-2 pb-2 font-mono text-[11px] tracking-[0.2em]">
            <span aria-hidden className="size-2 rounded-full bg-accent" />
            {t('about.rec')}
          </span>
        }
      >
        {t('about.title')}
      </SectionHeading>

      <div className="mb-20 grid gap-8 md:grid-cols-12">
        <p className="text-lg leading-relaxed md:col-span-7 md:text-xl">{l(about.bio)}</p>
        <p className="leading-relaxed text-muted-foreground md:col-span-4 md:col-start-9">
          {l(about.values)}
        </p>
      </div>

      <p className="sr-only">{t('about.keyboardHint')}</p>
      <Timeline />
    </section>
  )
}
