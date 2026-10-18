import { zodResolver } from '@hookform/resolvers/zod'
import { useId, useState, type ReactNode } from 'react'
import { useForm, type FieldError } from 'react-hook-form'
import { VinylNeedle } from '@/components/retro/VinylNeedle'
import { buttonVariants } from '@/components/ui/button-variants'
import { useLocale } from '@/hooks/useLocale'
import {
  contactSchema,
  sendContact,
  type ContactErrorKey,
  type ContactValues,
  type SendResult,
} from '@/lib/contact'
import { playSound } from '@/lib/sound'
import { cn } from '@/lib/utils'

const label = 'mb-2 block font-mono text-[11px] tracking-[0.18em] uppercase'
const input =
  'w-full border-2 border-foreground bg-transparent px-4 py-3 text-base outline-none transition-colors focus-visible:border-accent aria-[invalid=true]:border-destructive'

type FieldProps = {
  id: string
  name: 'name' | 'email' | 'message'
  label: string
  error?: FieldError
  children: (props: {
    id: string
    'aria-invalid': boolean
    'aria-describedby'?: string
  }) => ReactNode
}

function Field({ id, name, label: text, error, children }: FieldProps) {
  const { t } = useLocale()
  const errorId = `${id}-${name}-erro`
  return (
    <div>
      <label htmlFor={`${id}-${name}`} className={label}>
        {text}
      </label>
      {children({
        id: `${id}-${name}`,
        'aria-invalid': Boolean(error),
        'aria-describedby': error ? errorId : undefined,
      })}
      {error?.message && (
        <p id={errorId} className="mt-2 text-sm font-medium text-destructive">
          {t(`contact.errors.${error.message as ContactErrorKey}`)}
        </p>
      )}
    </div>
  )
}

// Carregado sob demanda (React.lazy): zod e react-hook-form ficam fora da primeira dobra.
export default function ContactForm() {
  const { t, locale } = useLocale()
  const id = useId()
  const [result, setResult] = useState<SendResult | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({ resolver: zodResolver(contactSchema) })

  async function onSubmit(values: ContactValues) {
    setResult(null)
    playSound('needle')
    const outcome = await sendContact(values, locale)
    setResult(outcome)
    if (outcome === 'success') reset()
  }

  const resultMessage = result && t(`contact.form.${result}`)

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="relative flex flex-col gap-6"
      aria-busy={isSubmitting}
    >
      <Field id={id} name="name" label={t('contact.form.name')} error={errors.name}>
        {(props) => (
          <input {...props} {...register('name')} autoComplete="name" className={input} />
        )}
      </Field>
      <Field id={id} name="email" label={t('contact.form.email')} error={errors.email}>
        {(props) => (
          <input
            {...props}
            {...register('email')}
            type="email"
            autoComplete="email"
            className={input}
          />
        )}
      </Field>
      <Field id={id} name="message" label={t('contact.form.message')} error={errors.message}>
        {(props) => (
          <textarea
            {...props}
            {...register('message')}
            rows={6}
            className={cn(input, 'resize-y')}
          />
        )}
      </Field>

      {/* Honeypot anti-spam: fora da tela e fora da navegação por teclado */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${id}-website`}>{t('contact.form.honeypot')}</label>
        <input id={`${id}-website`} tabIndex={-1} autoComplete="off" {...register('website')} />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            buttonVariants({ variant: 'default' }),
            'h-14 gap-3 pr-6 pl-3 disabled:opacity-100',
          )}
        >
          <VinylNeedle spinning={isSubmitting} />
          {isSubmitting ? t('contact.form.sending') : t('contact.form.submit')}
        </button>
        <p
          role="status"
          aria-live="polite"
          className={cn('text-sm font-medium', result !== 'success' && 'text-destructive')}
        >
          {resultMessage}
        </p>
      </div>
    </form>
  )
}
