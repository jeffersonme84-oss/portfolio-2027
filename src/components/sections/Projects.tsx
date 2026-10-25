import { useEffect, useState, type CSSProperties } from 'react'
import { ProjectDialog } from '@/components/sections/ProjectDialog'
import { ProjectLinks } from '@/components/sections/ProjectLinks'
import { TechList } from '@/components/sections/TechList'
import { NotchedProjectCard } from '@/components/ui/notched-project-card'
import { Pager } from '@/components/ui/pager'
import { projects } from '@/content/projects'
import { useLocale } from '@/hooks/useLocale'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { usePager } from '@/hooks/usePager'
import { screenSection } from '@/lib/layout'
import { cn } from '@/lib/utils'

const HASH_PREFIX = '#projeto-'

function slugFromHash() {
  const { hash } = window.location
  if (!hash.startsWith(HASH_PREFIX)) return undefined
  const slug = decodeURIComponent(hash.slice(HASH_PREFIX.length))
  return projects.some((project) => project.slug === slug) ? slug : undefined
}

// Foco visível claro sobre a parede escura.
const wallStyle = { '--ring': 'var(--wall-foreground)' } as CSSProperties

// Galeria de pôsteres numa parede escura (referência projetos-galeria.jpg), paginada para caber
// em uma tela.
export function Projects() {
  const { t, l } = useLocale()
  const [openSlug, setOpenSlug] = useState(slugFromHash)
  // Uma tela por seção: 3 projetos por página no desktop, 2 no tablet, 1 no celular.
  const desktop = useMediaQuery('(min-width: 1024px)')
  const tablet = useMediaQuery('(min-width: 640px)')
  const pager = usePager(projects, desktop ? 3 : tablet ? 2 : 1)

  // Deep link: #projeto-<slug> abre o estudo de caso, também ao navegar no histórico.
  useEffect(() => {
    function onHashChange() {
      setOpenSlug(slugFromHash())
    }
    window.addEventListener('hashchange', onHashChange)
    if (slugFromHash()) document.getElementById('projetos')?.scrollIntoView()
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  function open(slug: string) {
    history.replaceState(null, '', `${HASH_PREFIX}${slug}`)
    setOpenSlug(slug)
  }

  function close() {
    history.replaceState(null, '', '#projetos')
    setOpenSlug(undefined)
  }

  return (
    <section
      id="projetos"
      aria-labelledby="projetos-titulo"
      style={wallStyle}
      className={cn(screenSection, 'relative overflow-hidden bg-wall text-wall-foreground')}
    >
      {/* Luz de teto suave, como na referência */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_60%_100%_at_50%_0%,rgb(255_255_255/0.09),transparent)]"
      />
      <div className="relative mx-auto w-full max-w-[1200px] px-4 md:px-6">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4 md:mb-8">
          <h2
            id="projetos-titulo"
            className="font-display text-[clamp(2.25rem,6vw,4.5rem)] leading-[0.85] font-black tracking-[-0.04em] uppercase"
          >
            {t('projects.title')}
          </h2>
          <Pager
            page={pager.page}
            pages={pager.pages}
            onChange={pager.goTo}
            label={t('projects.title')}
            tone="wall"
          />
        </div>

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {pager.items.map((project) => (
            <li key={project.slug} className="flex flex-col gap-4">
              {/* Pôster com recorte: o canto é pintado na cor da parede e a seta abre o estudo de caso */}
              <NotchedProjectCard
                href={`${HASH_PREFIX}${project.slug}`}
                onClick={(event) => {
                  event.preventDefault()
                  open(project.slug)
                }}
                aria-haspopup="dialog"
                data-project={project.slug}
                title={l(project.title)}
                description={l(project.summary)}
                image={project.cover}
                badge={project.year}
                tags={[l(project.kind)]}
                aspect="4 / 3"
                monochrome
                surface="var(--wall)"
                accent="var(--accent)"
                discClassName="bg-wall-foreground text-wall"
                actionLabel={t('projects.open')}
              />
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-wall-foreground/15 pt-4">
                <TechList
                  technologies={project.technologies}
                  label={t('projects.technologies')}
                  className="text-wall-muted"
                />
                <ProjectLinks project={project} tone="wall" />
              </div>
            </li>
          ))}
        </ul>
      </div>

      <ProjectDialog
        project={projects.find((project) => project.slug === openSlug)}
        onClose={close}
      />
    </section>
  )
}
