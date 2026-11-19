import type { MouseEvent } from 'react'
import type { Project } from '@/content/projects'
import { useLocale } from '@/hooks/useLocale'

type RecordSleeveProps = {
  project: Project
  // Posição no catálogo (DEFT—001, Lado A…), a partir de 0.
  index: number
  href: string
  onOpen: (event: MouseEvent<HTMLAnchorElement>) => void
}

const SIDES = 'ABCDEFGHIJ'

// Capa de LP de um projeto (Projetos como "discografia", aprovado numa prévia, 2026-11-19):
// capa impressa com número de catálogo, foto em duotone e obi vermelho na lateral. No hover/foco
// a capa gira em 3D e o vinil sai girando. O clique abre o estudo de caso (ProjectDialog).
// Estilos em src/styles/records.css.
export function RecordSleeve({ project, index, href, onOpen }: RecordSleeveProps) {
  const { t, l } = useLocale()
  const title = l(project.title)
  const catalog = `DEFT—${String(index + 1).padStart(3, '0')}`
  const side = SIDES[index % SIDES.length]

  return (
    <a
      href={href}
      onClick={onOpen}
      aria-haspopup="dialog"
      aria-label={`${t('projects.open')}: ${title}`}
      data-project={project.slug}
      className="record"
    >
      <span aria-hidden className="record-vinyl">
        <span className="record-spin" />
        <span className="record-label">
          <span>
            <b>{title.split(' ')[0]}</b>
            {project.year} · 33⅓
          </span>
        </span>
      </span>

      <span className="record-sleeve">
        <span aria-hidden className="record-top">
          <span>{catalog}</span>
          <b>{project.year}</b>
        </span>
        <span className="record-cover">
          <img
            src={project.cover}
            alt=""
            width={800}
            height={600}
            loading="lazy"
            decoding="async"
          />
        </span>
        <span className="record-bottom">
          <span className="record-title">{title}</span>
          <span aria-hidden className="record-side">
            {t('projects.side', { side })}
          </span>
        </span>
        <span aria-hidden className="record-obi">
          <span>
            {l(project.kind)} · {project.year}
          </span>
        </span>
      </span>
    </a>
  )
}
