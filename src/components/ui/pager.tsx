import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useLocale } from '@/hooks/useLocale'
import { cn } from '@/lib/utils'

type PagerProps = {
  page: number
  pages: number
  onChange: (page: number) => void
  // Nome do conteúdo paginado, para os leitores de tela (ex.: "Projetos").
  label: string
  // 'wall': cores para a parede escura dos Projetos.
  tone?: 'default' | 'wall'
  className?: string
}

// Setas + pontos, no estilo da referência: some quando há uma página só.
export function Pager({ page, pages, onChange, label, tone = 'default', className }: PagerProps) {
  const { t } = useLocale()
  if (pages <= 1) return null

  const arrow = cn(
    'flex size-10 items-center justify-center rounded-full border transition-colors disabled:pointer-events-none disabled:opacity-35',
    tone === 'wall'
      ? 'border-wall-foreground/25 hover:border-wall-foreground hover:bg-wall-foreground hover:text-wall'
      : 'border-border hover:border-foreground hover:bg-foreground hover:text-background',
  )

  return (
    <nav aria-label={label} className={cn('flex items-center gap-3', className)}>
      <button
        type="button"
        className={arrow}
        onClick={() => onChange(page - 1)}
        disabled={page === 0}
        aria-label={t('pager.prev')}
      >
        <ArrowLeft className="size-4" aria-hidden />
      </button>
      <ol className="flex items-center gap-1.5">
        {Array.from({ length: pages }, (_, index) => (
          <li key={index}>
            <button
              type="button"
              onClick={() => onChange(index)}
              aria-current={index === page ? 'page' : undefined}
              aria-label={t('pager.goTo', { n: index + 1, total: pages })}
              className={cn(
                // after: área de toque de ~24 px sem mudar o tamanho visível do ponto.
                'relative block h-1.5 rounded-full transition-[width,background-color] duration-300 after:absolute after:-inset-x-1.5 after:-inset-y-2.5',
                index === page ? 'w-6 bg-accent' : 'w-1.5',
                index !== page && (tone === 'wall' ? 'bg-wall-foreground/35' : 'bg-foreground/25'),
              )}
            />
          </li>
        ))}
      </ol>
      <button
        type="button"
        className={arrow}
        onClick={() => onChange(page + 1)}
        disabled={page === pages - 1}
        aria-label={t('pager.next')}
      >
        <ArrowRight className="size-4" aria-hidden />
      </button>
    </nav>
  )
}
