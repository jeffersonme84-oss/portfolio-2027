import { useEffect, useState, type CSSProperties } from 'react'
import { ProjectDialog } from '@/components/sections/ProjectDialog'
import { ProjectLinks } from '@/components/sections/ProjectLinks'
import { TechList } from '@/components/sections/TechList'
import { NotchedProjectCard } from '@/components/ui/notched-project-card'
import { projects } from '@/content/projects'
import { useLocale } from '@/hooks/useLocale'

const HASH_PREFIX = '#projeto-'

function slugFromHash() {
  const { hash } = window.location
  if (!hash.startsWith(HASH_PREFIX)) return undefined
  const slug = decodeURIComponent(hash.slice(HASH_PREFIX.length))
  return projects.some((project) => project.slug === slug) ? slug : undefined
}

// Foco visível claro sobre a parede escura.
const wallStyle = { '--ring': 'var(--wall-foreground)' } as CSSProperties

// Galeria de pôsteres numa parede escura (referência projetos-galeria.jpg).
export function Projects() {
  const { t, l } = useLocale()
  const [openSlug, setOpenSlug] = useState(slugFromHash)

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
      className="relative overflow-hidden bg-wall text-wall-foreground"
    >
      {/* Luz de teto suave, como na referência */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_60%_100%_at_50%_0%,rgb(255_255_255/0.09),transparent)]"
      />
      <div className="relative mx-auto max-w-[1200px] px-4 py-24 md:px-6 md:py-32">
        <h2
          id="projetos-titulo"
          className="mb-16 font-display text-[clamp(3rem,10vw,8rem)] leading-[0.85] font-black tracking-[-0.04em] uppercase"
        >
          {t('projects.title')}
        </h2>

        <ul className="grid gap-14 md:grid-cols-3 md:gap-8">
          {projects.map((project) => (
            <li key={project.slug} className="flex flex-col gap-5">
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
                aspect="2 / 3"
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
