import { Monitor, Moon, Sun } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PillToggle } from '@/components/layout/PillToggle'
import { useTheme } from '@/hooks/useTheme'
import type { ResolvedTheme } from '@/lib/theme'

export function ThemeToggle() {
  const { t } = useTranslation()
  const { preference, resolved, setPreference } = useTheme()

  return (
    <div className="flex items-center gap-1">
      <PillToggle<ResolvedTheme>
        variant="switch"
        label={t('theme.dark')}
        value={resolved}
        onChange={setPreference}
        options={[
          { value: 'light', label: t('theme.light'), content: <Sun className="size-4" /> },
          { value: 'dark', label: t('theme.dark'), content: <Moon className="size-4" /> },
        ]}
      />
      {preference !== 'system' && (
        <button
          type="button"
          onClick={() => setPreference('system')}
          aria-label={t('theme.useSystem')}
          title={t('theme.useSystem')}
          className="flex size-7 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
        >
          <Monitor className="size-3.5" aria-hidden />
        </button>
      )}
    </div>
  )
}
