import { Menu } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { CvButton } from '@/components/layout/CvButton'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { site } from '@/content/site'
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useActiveSection } from '@/hooks/useActiveSection'
import { useScrollY } from '@/hooks/useScrollY'
import { NAV_SECTIONS } from '@/lib/sections'
import { cn } from '@/lib/utils'

const sectionIds = NAV_SECTIONS.map((section) => section.id)
const initials = site.name
  .split(' ')
  .map((part) => part[0])
  .join('')

type HeaderProps = {
  onBrandClick?: () => void
}

export function Header({ onBrandClick }: HeaderProps) {
  const { t } = useTranslation()
  const scrolled = useScrollY() > 16
  const active = useActiveSection(sectionIds)

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 border-b transition-colors duration-200',
        scrolled ? 'border-border bg-background/95 backdrop-blur-sm' : 'border-transparent',
      )}
    >
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between gap-4 px-4 md:px-6">
        <a
          href="#inicio"
          onClick={onBrandClick}
          className="flex items-baseline gap-3"
        >
          <span className="font-display text-xl font-black tracking-[-0.04em]">{initials}</span>
          <span className="sr-only text-[11px] font-medium tracking-[0.12em] uppercase xl:not-sr-only">
            {site.name}
          </span>
        </a>

        <nav aria-label={t('nav.label')} className="hidden md:block">
          <ul className="flex items-center gap-6">
            {NAV_SECTIONS.map(({ id, labelKey }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={active === id ? 'location' : undefined}
                  className={cn(
                    'py-2 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors',
                    active === id
                      ? 'text-foreground underline decoration-accent decoration-2 underline-offset-8'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {t(labelKey)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <LanguageSwitcher />
          <CvButton size="sm" variant="default" />
        </div>

        <Sheet>
          <SheetTrigger
            className="flex size-10 cursor-pointer items-center justify-center md:hidden"
            aria-label={t('nav.openMenu')}
          >
            <Menu className="size-5" aria-hidden />
          </SheetTrigger>
          <SheetContent closeLabel={t('nav.closeMenu')} aria-describedby={undefined}>
            <SheetTitle className="text-muted-foreground">{t('nav.menu')}</SheetTitle>
            <nav aria-label={t('nav.label')}>
              <ul className="flex flex-col gap-4">
                {NAV_SECTIONS.map(({ id, labelKey }) => (
                  <li key={id}>
                    <SheetClose asChild>
                      <a
                        href={`#${id}`}
                        aria-current={active === id ? 'location' : undefined}
                        className={cn(
                          'font-display text-3xl font-black uppercase tracking-[-0.04em]',
                          active === id && 'text-accent',
                        )}
                      >
                        {t(labelKey)}
                      </a>
                    </SheetClose>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="mt-auto flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <LanguageSwitcher />
              </div>
              <CvButton variant="default" />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
