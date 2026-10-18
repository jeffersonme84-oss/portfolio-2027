import { useRef } from 'react'
import { ProjectLinks } from '@/components/sections/ProjectLinks'
import { TechList } from '@/components/sections/TechList'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import type { Project } from '@/content/projects'
import { useLocale } from '@/hooks/useLocale'

type ProjectDialogProps = {
  project: Project | undefined
  onClose: () => void
}

// Estudo de caso: Problema → Processo de criação → Resultado final.
export function ProjectDialog({ project, onClose }: ProjectDialogProps) {
  const { t, l } = useLocale()
  // Mantém o conteúdo durante a animação de saída.
  const last = useRef(project)
  if (project) last.current = project
  const shown = last.current

  return (
    <Dialog open={project !== undefined} onOpenChange={(open) => !open && onClose()}>
      {shown && (
        <DialogContent
          closeLabel={t('projects.close')}
          onCloseAutoFocus={(event) => {
            // Devolve o foco ao pôster, mesmo quando o modal abriu pelo deep link.
            event.preventDefault()
            document.querySelector<HTMLElement>(`[data-project="${shown.slug}"]`)?.focus()
          }}
        >
          <p className="mb-3 font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
            {shown.year} / {l(shown.kind)}
          </p>
          <DialogTitle className="pr-10 text-[clamp(2.5rem,7vw,4.5rem)] leading-[0.85] font-black tracking-[-0.04em] uppercase">
            {l(shown.title)}
          </DialogTitle>
          <DialogDescription className="mt-4 text-lg">{l(shown.summary)}</DialogDescription>

          <div className="mt-10 grid gap-8">
            {(
              [
                ['problem', t('projects.problem')],
                ['process', t('projects.process')],
                ['result', t('projects.result')],
              ] as const
            ).map(([key, label], index) => (
              <section
                key={key}
                className="grid gap-2 border-t border-border pt-4 md:grid-cols-[12rem_1fr]"
              >
                <h3 className="font-mono text-[11px] tracking-[0.18em] uppercase">
                  <span className="text-accent" aria-hidden>
                    0{index + 1}{' '}
                  </span>
                  {label}
                </h3>
                <p className="leading-relaxed">{l(shown.caseStudy[key])}</p>
              </section>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-6 border-t border-border pt-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="mb-3 font-mono text-[11px] tracking-[0.18em] uppercase">
                {t('projects.technologies')}
              </h3>
              <TechList
                technologies={shown.technologies}
                label={t('projects.technologies')}
                showNames
              />
            </div>
            <ProjectLinks project={shown} tone="page" />
          </div>
        </DialogContent>
      )}
    </Dialog>
  )
}
