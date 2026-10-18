import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type SectionHeadingProps = {
  id: string
  children: ReactNode
  // Micro-texto mono ao lado do título (ex.: "● REC").
  aside?: ReactNode
  className?: string
}

// Título de seção em display gigante, no estilo editorial.
export function SectionHeading({ id, children, aside, className }: SectionHeadingProps) {
  return (
    <div className={cn('mb-12 flex items-end justify-between gap-4 md:mb-16', className)}>
      <h2
        id={id}
        className="font-display text-[clamp(3rem,10vw,8rem)] leading-[0.85] font-black tracking-[-0.04em] uppercase"
      >
        {children}
      </h2>
      {aside}
    </div>
  )
}
