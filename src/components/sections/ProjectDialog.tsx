import { useRef, useState, type KeyboardEvent } from 'react'
import { ProjectLinks } from '@/components/sections/ProjectLinks'
import { TechList } from '@/components/sections/TechList'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Pager } from '@/components/ui/pager'
import type { Project, ProjectImage } from '@/content/projects'
import { useLocale } from '@/hooks/useLocale'
import { cn } from '@/lib/utils'

type ProjectDialogProps = {
  project: Project | undefined
  onClose: () => void
}

type Slide = {
  key: string
  label: string
  text?: string
  image?: ProjectImage
}

// Foto do slide: tela de celular inteira (vertical) ou imagem larga, sem cortar.
function SlideImage({ image, alt }: { image: ProjectImage; alt: string }) {
  return (
    <div
      className={cn(
        'flex items-center justify-center overflow-hidden rounded-lg bg-foreground/[0.04] p-3',
        image.shape === 'phone' ? 'h-[32svh] md:h-[46svh]' : 'h-[24svh] md:h-[40svh]',
      )}
    >
      <img
        src={image.src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={cn(
          'max-h-full max-w-full object-contain',
          image.shape === 'phone' && 'rounded-2xl shadow-lg',
        )}
      />
    </div>
  )
}

// Estudo de caso em slides: visão geral → Problema → Processo → Resultado → fotos extras.
// Setas, pontos ou ← → do teclado; Esc fecha.
export function ProjectDialog({ project, onClose }: ProjectDialogProps) {
  const { t, l } = useLocale()
  const [slide, setSlide] = useState(0)
  // Mantém o conteúdo durante a animação de saída.
  const last = useRef(project)
  if (project && project !== last.current) {
    last.current = project
    setSlide(0)
  }
  const shown = last.current
  if (!shown) return <Dialog open={false} />

  const gallery = shown.gallery ?? []
  const cover: ProjectImage = { src: shown.cover, alt: shown.title, shape: 'wide' }
  const slides: Slide[] = [
    { key: 'overview', label: l(shown.kind), image: gallery.length ? cover : undefined },
    {
      key: 'problem',
      label: t('projects.problem'),
      text: l(shown.caseStudy.problem),
      image: gallery[0],
    },
    {
      key: 'process',
      label: t('projects.process'),
      text: l(shown.caseStudy.process),
      image: gallery[1],
    },
    {
      key: 'result',
      label: t('projects.result'),
      text: l(shown.caseStudy.result),
      image: gallery[2],
    },
    ...gallery.slice(3).map((image, index) => ({
      key: `extra-${index}`,
      label: t('projects.gallery'),
      text: l(image.alt),
      image,
    })),
  ]
  const current = slides[Math.min(slide, slides.length - 1)]
  const goTo = (next: number) => setSlide(Math.max(0, Math.min(slides.length - 1, next)))

  function onKeyDown(event: KeyboardEvent) {
    // Não rouba as setas de campos/links focados dentro dos slides.
    if (event.key === 'ArrowRight') goTo(slide + 1)
    else if (event.key === 'ArrowLeft') goTo(slide - 1)
  }

  return (
    <Dialog open={project !== undefined} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        closeLabel={t('projects.close')}
        className="max-w-5xl"
        onKeyDown={onKeyDown}
        onCloseAutoFocus={(event) => {
          // Devolve o foco ao pôster, mesmo quando o modal abriu pelo deep link.
          event.preventDefault()
          document.querySelector<HTMLElement>(`[data-project="${shown.slug}"]`)?.focus()
        }}
      >
        <p className="mb-2 font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
          {shown.year} / {l(shown.kind)}
        </p>
        <DialogTitle className="pr-10 text-[clamp(2rem,5vw,3.5rem)] leading-[0.85] font-black tracking-[-0.04em] uppercase">
          {l(shown.title)}
        </DialogTitle>

        {/* Slide atual; a key reinicia a animação de entrada a cada troca. */}
        <div
          key={current.key}
          role="group"
          aria-roledescription="slide"
          aria-label={`${slide + 1} / ${slides.length}: ${current.label}`}
          className={cn(
            'mt-6 grid items-center gap-6 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-right-4 motion-safe:duration-300',
            current.image && 'md:grid-cols-[1.15fr_1fr] md:gap-10',
          )}
        >
          {current.image && <SlideImage image={current.image} alt={l(current.image.alt)} />}
          <div>
            <h3 className="mb-3 font-mono text-[11px] tracking-[0.18em] uppercase">
              <span className="text-accent" aria-hidden>
                {String(slide + 1).padStart(2, '0')}{' '}
              </span>
              {current.label}
            </h3>
            {current.key === 'overview' ? (
              <>
                <DialogDescription className="text-lg leading-relaxed text-foreground">
                  {l(shown.summary)}
                </DialogDescription>
                <div className="mt-6">
                  <h4 className="mb-3 font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
                    {t('projects.technologies')}
                  </h4>
                  <TechList
                    technologies={shown.technologies}
                    label={t('projects.technologies')}
                    showNames
                  />
                </div>
                <div className="mt-6">
                  <ProjectLinks project={shown} tone="page" />
                </div>
              </>
            ) : (
              <p className="text-base leading-relaxed md:text-lg">{current.text}</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4 border-t border-border pt-4">
          <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground" aria-hidden>
            {String(slide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
          </p>
          <Pager page={slide} pages={slides.length} onChange={goTo} label={l(shown.title)} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
