import { Sparkles, ZapOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { setMotionPreference } from '@/lib/motion'

// Liga ou reduz as animações do site (digitação, malha 3D, efeitos de hover),
// independentemente da configuração do sistema operacional.
export function MotionToggle() {
  const { t } = useTranslation()
  const reduced = useReducedMotion()
  const label = reduced ? t('motion.enable') : t('motion.disable')

  return (
    <button
      type="button"
      aria-pressed={!reduced}
      aria-label={label}
      title={label}
      onClick={() => setMotionPreference(reduced ? 'on' : 'off')}
      className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:border-foreground hover:text-foreground aria-pressed:text-accent"
    >
      {reduced ? (
        <ZapOff className="size-4" aria-hidden />
      ) : (
        <Sparkles className="size-4" aria-hidden />
      )}
    </button>
  )
}
