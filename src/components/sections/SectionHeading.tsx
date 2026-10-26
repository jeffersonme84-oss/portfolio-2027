import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type SectionHeadingProps = {
  id: string
  children: ReactNode
  // Micro-texto mono ou controles ao lado do título (ex.: "● REC", paginação).
  aside?: ReactNode
  className?: string
}

// Título de seção em display, no estilo editorial. Tamanho contido para a seção caber em uma tela.
export function SectionHeading({ id, children, aside, className }: SectionHeadingProps) {
  return (
    <div className={cn('mb-5 flex flex-wrap items-end justify-between gap-4 md:mb-6', className)}>
      <h2
        id={id}
        className="font-display text-[clamp(2.25rem,6vw,4.5rem)] leading-[0.85] font-black tracking-[-0.04em] uppercase"
      >
        {children}
      </h2>
      {aside}
    </div>
  )
}
