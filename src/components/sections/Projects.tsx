import { useEffect, useState } from 'react'
import { ProjectDialog } from '@/components/sections/ProjectDialog'
import { ProjectLinks } from '@/components/sections/ProjectLinks'
import { RecordSleeve } from '@/components/sections/RecordSleeve'
import { Pager } from '@/components/ui/pager'
import { projects } from '@/content/projects'
import { skills } from '@/content/skills'
import '@/styles/records.css'
import { useLocale } from '@/hooks/useLocale'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { usePager } from '@/hooks/usePager'
import { screenSection } from '@/lib/layout'
import { cn } from '@/lib/utils'

const HASH_PREFIX = '#projeto-'

// Intervalo de anos dos projetos (ex.: "2024 — 2025").
const yearList = projects.map((project) => Number(project.year)).filter(Boolean)
const years =
  yearList.length > 0
    ? [...new Set([Math.min(...yearList), Math.max(...yearList)])].join(' — ')
    : ''

function slugFromHash() {
  const { hash } = window.location
  if (!hash.startsWith(HASH_PREFIX)) return undefined
  const slug = decodeURIComponent(hash.slice(HASH_PREFIX.length))
  return projects.some((project) => project.slug === slug) ? slug : undefined
}

// Projetos como "discografia" (pedido do Jefferson, 2026-11-19; substitui a galeria de pôsteres
// na parede escura): capas de LP numa prateleira de papel, claro e escuro, paginada para caber
// em uma tela. O clique abre o estudo de caso com a galeria (ProjectDialog). Estilos em
// src/styles/records.css.
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
      className={cn(screenSection, 'records relative overflow-hidden')}
    >
      <div className="relative mx-auto w-full max-w-[1200px] px-4 md:px-6">
        {/* Cabeçalho editorial: "Lado A · Discografia selecionada · anos" + total de LPs */}
        <header className="records-head">
          <div>
            <p aria-hidden className="records-eyebrow">
              <b>● {t('projects.side', { side: 'A' })}</b>
              <span>{t('projects.discography')}</span>
              <span className="max-sm:hidden">{years}</span>
            </p>
            <h2 id="projetos-titulo" className="records-title">
              {t('projects.title')}
            </h2>
          </div>
          <div className="records-meta">
            <p aria-hidden>
              <b>{t('projects.count', { count: projects.length })}</b> · {t('projects.kinds')}
              <br />
              <span className="max-lg:hidden">{t('projects.hint')}</span>
            </p>
            <Pager
              page={pager.page}
              pages={pager.pages}
              onChange={pager.goTo}
              label={t('projects.title')}
            />
          </div>
        </header>

        <ul className="records-shelf">
          {pager.items.map((project) => {
            const index = projects.indexOf(project)
            return (
              <li key={project.slug} className="records-item">
                <RecordSleeve
                  project={project}
                  index={index}
                  href={`${HASH_PREFIX}${project.slug}`}
                  onOpen={(event) => {
                    event.preventDefault()
                    open(project.slug)
                  }}
                />
                <div className="records-info">
                  <p className="records-summary">{l(project.summary)}</p>
                  {/* Tecnologias como faixas do disco: A1, B1, A2… */}
                  <ol aria-label={t('projects.technologies')} className="records-tracks">
                    {project.technologies.map((key, n) => {
                      const skill = skills[key]
                      const name = typeof skill.name === 'string' ? skill.name : l(skill.name)
                      return (
                        <li key={key}>
                          <i aria-hidden>
                            {n % 2 ? 'B' : 'A'}
                            {Math.floor(n / 2) + 1}
                          </i>
                          {name}
                        </li>
                      )
                    })}
                  </ol>
                  <div className="records-actions">
                    <a
                      href={`${HASH_PREFIX}${project.slug}`}
                      onClick={(event) => {
                        event.preventDefault()
                        open(project.slug)
                      }}
                      aria-haspopup="dialog"
                      className="records-listen"
                    >
                      <span aria-hidden>▶</span>
                      {t('projects.listen')}
                      <span className="sr-only"> — {l(project.title)}</span>
                    </a>
                    <ProjectLinks project={project} tone="record" />
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      <ProjectDialog
        project={projects.find((project) => project.slug === openSlug)}
        onClose={close}
      />
    </section>
  )
}
