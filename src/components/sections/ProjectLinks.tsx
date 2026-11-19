import { ExternalLink as ExternalIcon } from 'lucide-react'
import { SiGithub } from 'react-icons/si'
import { ExternalLink } from '@/components/layout/ExternalLink'
import type { Project } from '@/content/projects'
import { useLocale } from '@/hooks/useLocale'
import { cn } from '@/lib/utils'

const linkClass =
  'inline-flex h-9 items-center gap-2 border px-3 text-[11px] font-bold tracking-[0.12em] uppercase transition-colors'

type ProjectLinksProps = {
  project: Project
  // 'record': links discretos sob as capas de LP; 'page': dentro do modal (tema do site);
  // 'wall': cores da antiga parede escura.
  tone: 'wall' | 'page' | 'record'
}

const toneClasses = {
  wall: 'border-wall-foreground/40 text-wall-foreground hover:border-wall-foreground hover:bg-wall-foreground hover:text-wall',
  page: 'border-foreground text-foreground hover:bg-foreground hover:text-background',
  record:
    'h-auto border-0 border-b border-current px-0 pb-0.5 text-[12px] tracking-[0.04em] normal-case text-current hover:text-(--records-red-text) [&_svg]:size-3',
}

// Botões Deploy e GitHub: com URL vazia ficam desabilitados.
export function ProjectLinks({ project, tone }: ProjectLinksProps) {
  const { t, l } = useLocale()
  const toneClass = toneClasses[tone]

  const links = [
    { key: 'deploy', url: project.deployUrl, label: t('projects.deploy'), Icon: ExternalIcon },
    { key: 'github', url: project.githubUrl, label: t('projects.github'), Icon: SiGithub },
  ]

  return (
    <div className={cn('flex', tone === 'record' ? 'gap-4' : 'gap-2')}>
      {links.map(({ key, url, label, Icon }) =>
        url ? (
          <ExternalLink key={key} href={url} className={cn(linkClass, toneClass)}>
            <Icon className="size-3.5" aria-hidden />
            {label}
            <span className="sr-only">— {l(project.title)}</span>
          </ExternalLink>
        ) : (
          <button
            key={key}
            type="button"
            disabled
            className={cn(linkClass, toneClass, 'cursor-not-allowed opacity-40')}
          >
            <Icon className="size-3.5" aria-hidden />
            {label}
            <span className="sr-only">
              — {l(project.title)} ({t('projects.unavailable')})
            </span>
          </button>
        ),
      )}
    </div>
  )
}
