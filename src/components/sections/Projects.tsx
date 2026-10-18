import { useEffect, useState, type CSSProperties } from 'react'
import { ProjectDialog } from '@/components/sections/ProjectDialog'
import { ProjectLinks } from '@/components/sections/ProjectLinks'
import { TechList } from '@/components/sections/TechList'
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
              <button
                type="button"
                onClick={() => open(project.slug)}
                aria-haspopup="dialog"
                data-project={project.slug}
                className="group block w-full cursor-pointer border-2 border-wall-foreground/70 bg-black p-2 text-left transition-colors hover:border-wall-foreground"
              >
                <span className="relative block aspect-[2/3] overflow-hidden">
                  <img
                    src={project.cover}
                    alt=""
                    width={600}
                    height={900}
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover grayscale transition-[filter] duration-500 group-hover:grayscale-0 group-focus-visible:grayscale-0 motion-reduce:transition-none"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30" />
                  <span className="absolute top-3 left-3 font-mono text-[10px] tracking-[0.18em] text-white uppercase">
                    {project.year} / {l(project.kind)}
                  </span>
                  <span className="absolute inset-x-4 bottom-4 text-white">
                    <span className="block font-display text-3xl leading-[0.85] font-black tracking-[-0.04em] [overflow-wrap:anywhere] uppercase lg:text-4xl">
                      {l(project.title)}
                    </span>
                    <span className="mt-2 block text-sm text-white/80">{l(project.summary)}</span>
                    <span className="sr-only"> — {t('projects.open')}</span>
                  </span>
                </span>
              </button>
              <div className="flex flex-wrap items-center justify-between gap-4">
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

      <ProjectDialog project={projects.find((project) => project.slug === openSlug)} onClose={close} />
    </section>
  )
}
