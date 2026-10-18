import { useRef, type KeyboardEvent, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type PillOption<T extends string> = {
  value: T
  // Nome acessível da opção (traduzido).
  label: string
  // Conteúdo visível dentro da pílula: ícone ou rótulo curto.
  content: ReactNode
}

type PillToggleProps<T extends string> = {
  // switch: tema (liga/desliga a segunda opção). radiogroup: idioma.
  variant: 'switch' | 'radiogroup'
  options: readonly [PillOption<T>, PillOption<T>]
  value: T
  onChange: (value: T) => void
  // aria-label do controle (traduzido).
  label: string
  className?: string
}

// Pílula com bolinha deslizante (referência toggle-darkmode.jpg), usada no tema e no idioma.
export function PillToggle<T extends string>({
  variant,
  options,
  value,
  onChange,
  label,
  className,
}: PillToggleProps<T>) {
  const radios = useRef<(HTMLButtonElement | null)[]>([])
  const activeIndex = options[1].value === value ? 1 : 0

  const track = (
    <>
      <span
        aria-hidden
        className={cn(
          'absolute top-0.5 left-0.5 size-7 rounded-full border border-border bg-background shadow-sm',
          'transition-transform duration-200 ease-out motion-reduce:transition-none',
          activeIndex === 1 && 'translate-x-7',
        )}
      />
      {variant === 'switch' &&
        options.map((option, index) => (
          <span
            key={option.value}
            aria-hidden
            className={cn(
              'relative z-10 flex size-7 items-center justify-center transition-colors duration-200',
              index === activeIndex ? 'text-accent' : 'text-muted-foreground',
            )}
          >
            {option.content}
          </span>
        ))}
    </>
  )

  const trackClass = cn(
    'relative inline-flex h-8 w-[3.75rem] shrink-0 items-center rounded-full border border-border bg-muted p-0.5',
    className,
  )

  if (variant === 'switch') {
    const checked = activeIndex === 1
    return (
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        className={cn(trackClass, 'cursor-pointer')}
        onClick={() => onChange(options[checked ? 0 : 1].value)}
      >
        {track}
      </button>
    )
  }

  function select(index: number) {
    onChange(options[index].value)
    radios.current[index]?.focus()
  }

  function onKeyDown(event: KeyboardEvent) {
    if (['ArrowLeft', 'ArrowUp'].includes(event.key)) {
      event.preventDefault()
      select(0)
    } else if (['ArrowRight', 'ArrowDown'].includes(event.key)) {
      event.preventDefault()
      select(1)
    }
  }

  return (
    <div role="radiogroup" aria-label={label} className={trackClass} onKeyDown={onKeyDown}>
      {track}
      {options.map((option, index) => {
        const checked = index === activeIndex
        return (
          <button
            key={option.value}
            ref={(node) => {
              radios.current[index] = node
            }}
            type="button"
            role="radio"
            aria-checked={checked}
            aria-label={option.label}
            tabIndex={checked ? 0 : -1}
            onClick={() => onChange(option.value)}
            className={cn(
              'relative z-10 flex size-7 cursor-pointer items-center justify-center rounded-full font-mono text-[10px] font-bold',
              'transition-colors duration-200',
              checked ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <span aria-hidden>{option.content}</span>
          </button>
        )
      })}
    </div>
  )
}
