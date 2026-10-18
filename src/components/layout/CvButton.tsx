import { Download } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button-variants'
import { site } from '@/content/site'
import { useLocale } from '@/hooks/useLocale'
import { cn } from '@/lib/utils'

type CvButtonProps = {
  variant?: 'default' | 'outline'
  size?: 'default' | 'sm'
  className?: string
}

// Só aparece quando existe o PDF do idioma ativo (site.cv).
export function CvButton({ variant = 'outline', size = 'default', className }: CvButtonProps) {
  const { t, locale } = useLocale()
  const href = site.cv[locale]
  if (!href) return null

  return (
    <a href={href} download className={cn(buttonVariants({ variant, size }), className)}>
      <Download aria-hidden />
      {t('cv.download')}
    </a>
  )
}
