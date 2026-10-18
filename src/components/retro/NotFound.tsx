import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { buttonVariants } from '@/components/ui/button-variants'

// Página 404 no estilo VHS: "SEM SINAL" com barras de cor em tons neutros.
export function NotFound() {
  const { t } = useTranslation()

  return (
    <main className="flex min-h-svh flex-col">
      <div aria-hidden className="vhs-bars h-[38svh]" />
      <div className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col justify-center gap-6 px-4 py-12 md:px-6">
        <p aria-hidden className="font-mono text-xs tracking-[0.2em] text-muted-foreground">
          ■ {t('notFound.stop')} · 00:00:00
        </p>
        <h1 className="font-display text-[clamp(3.5rem,14vw,11rem)] leading-[0.85] font-black tracking-[-0.04em] uppercase">
          {t('notFound.title')}
        </h1>
        <p className="text-lg">{t('notFound.text')}</p>
        <a href="/" className={buttonVariants({ variant: 'default', className: 'self-start' })}>
          <ArrowLeft aria-hidden />
          {t('notFound.back')}
        </a>
      </div>
    </main>
  )
}
