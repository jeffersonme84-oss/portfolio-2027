import { cva } from 'class-variance-authority'

// Botão do shadcn/ui ajustado ao estilo editorial: caixa alta, cantos retos, sem sombras.
export const buttonVariants = cva(
  'inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap font-sans text-xs font-bold uppercase tracking-[0.12em] transition-colors disabled:pointer-events-none disabled:opacity-40 aria-disabled:pointer-events-none aria-disabled:opacity-40 [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-foreground hover:text-background',
        outline:
          'border-2 border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background',
        ghost: 'text-foreground hover:bg-muted',
        link: 'px-0 text-foreground underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-11 px-5',
        sm: 'h-9 px-3',
        icon: 'size-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)
