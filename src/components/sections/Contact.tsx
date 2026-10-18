import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Phone } from 'lucide-react'
import { useId, useState } from 'react'
import { useForm, type FieldError } from 'react-hook-form'
import { SiWhatsapp } from 'react-icons/si'
import { CvButton } from '@/components/layout/CvButton'
import { ExternalLink } from '@/components/layout/ExternalLink'
import { socialIcons } from '@/components/layout/socialIcons'
import { VinylNeedle } from '@/components/retro/VinylNeedle'
import { SectionHeading } from '@/components/sections/SectionHeading'
import { buttonVariants } from '@/components/ui/button-variants'
import { activeSocials, site } from '@/content/site'
import { useLocale } from '@/hooks/useLocale'
import {
  contactSchema,
  sendContact,
  type ContactErrorKey,
  type ContactValues,
  type SendResult,
} from '@/lib/contact'
import { cn } from '@/lib/utils'

const label = 'mb-2 block font-mono text-[11px] tracking-[0.18em] uppercase'
const input =
  'w-full border-2 border-foreground bg-transparent px-4 py-3 text-base outline-none transition-colors focus-visible:border-accent aria-[invalid=true]:border-destructive'
const subheading = 'mb-4 font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase'

type FieldProps = {
  id: string
  name: 'name' | 'email' | 'message'
  label: string
  error?: FieldError
  children: (props: { id: string; 'aria-invalid': boolean; 'aria-describedby'?: string }) => React.ReactNode
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

export function Contact() {
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
    const outcome = await sendContact(values, locale)
    setResult(outcome)
    if (outcome === 'success') reset()
  }

  const resultMessage = result && t(`contact.form.${result}`)

  return (
    <section
      id="contato"
      aria-labelledby="contato-titulo"
      className="mx-auto max-w-[1200px] px-4 py-24 md:px-6 md:py-32"
    >
      <SectionHeading id="contato-titulo">{t('contact.title')}</SectionHeading>

      <div className="grid gap-16 md:grid-cols-12">
        <div className="flex flex-col gap-10 md:col-span-5">
          <p className="text-lg leading-relaxed">{t('contact.intro')}</p>

          <div>
            <h3 className={subheading}>{t('contact.direct')}</h3>
            <ul className="flex flex-col gap-3">
              <li>
                <a href={`mailto:${site.email}`} className="inline-flex items-center gap-3 hover:text-accent">
                  <Mail className="size-4" aria-hidden />
                  <span className="sr-only">{t('social.email')}: </span>
                  {site.email}
                </a>
              </li>
              <li>
                <ExternalLink href={site.whatsappUrl} className="inline-flex items-center gap-3 hover:text-accent">
                  <SiWhatsapp className="size-4" aria-hidden />
                  <span className="sr-only">{t('social.whatsapp')}: </span>
                  {site.phoneDisplay}
                </ExternalLink>
              </li>
              <li>
                <a
                  href={`tel:+55${site.phoneDisplay.replace(/\D/g, '')}`}
                  className="inline-flex items-center gap-3 hover:text-accent"
                >
                  <Phone className="size-4" aria-hidden />
                  <span className="sr-only">{t('social.phone')}: </span>
                  {site.phoneDisplay}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className={subheading}>{t('contact.networks')}</h3>
            <ul className="flex flex-wrap gap-x-6 gap-y-3">
              {activeSocials().map(([network, url]) => {
                const Icon = socialIcons[network]
                return (
                  <li key={network}>
                    <ExternalLink href={url} className="inline-flex items-center gap-2 hover:text-accent">
                      <Icon className="size-4" aria-hidden />
                      {t(`social.${network}`)}
                    </ExternalLink>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="flex flex-wrap gap-3">
            <ExternalLink href={site.whatsappUrl} className={buttonVariants({ variant: 'outline' })}>
              <SiWhatsapp aria-hidden />
              {t('social.whatsapp')}
            </ExternalLink>
            <CvButton />
          </div>
        </div>

        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 md:col-span-7"
          aria-busy={isSubmitting}
        >
          <Field id={id} name="name" label={t('contact.form.name')} error={errors.name}>
            {(props) => <input {...props} {...register('name')} autoComplete="name" className={input} />}
          </Field>
          <Field id={id} name="email" label={t('contact.form.email')} error={errors.email}>
            {(props) => (
              <input {...props} {...register('email')} type="email" autoComplete="email" className={input} />
            )}
          </Field>
          <Field id={id} name="message" label={t('contact.form.message')} error={errors.message}>
            {(props) => <textarea {...props} {...register('message')} rows={6} className={cn(input, 'resize-y')} />}
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
              className={cn(buttonVariants({ variant: 'default' }), 'h-14 gap-3 pr-6 pl-3 disabled:opacity-100')}
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
      </div>
    </section>
  )
}
