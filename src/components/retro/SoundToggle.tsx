import { Volume2, VolumeX } from 'lucide-react'
import { useSyncExternalStore } from 'react'
import { useTranslation } from 'react-i18next'
import { isSoundEnabled, setSoundEnabled, subscribeSound } from '@/lib/sound'

// Botão visível de ligar/mutar os sons dos easter eggs (desligados por padrão).
export function SoundToggle() {
  const { t } = useTranslation()
  const enabled = useSyncExternalStore(subscribeSound, isSoundEnabled)
  const label = enabled ? t('sound.disable') : t('sound.enable')

  return (
    <button
      type="button"
      aria-pressed={enabled}
      aria-label={label}
      title={label}
      onClick={() => setSoundEnabled(!enabled)}
      className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
    >
      {enabled ? (
        <Volume2 className="size-4" aria-hidden />
      ) : (
        <VolumeX className="size-4" aria-hidden />
      )}
    </button>
  )
}
