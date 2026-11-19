import { ArrowUpRight, Menu } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { CvButton } from '@/components/layout/CvButton'
import { ExternalLink } from '@/components/layout/ExternalLink'
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { site } from '@/content/site'
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useActiveSection } from '@/hooks/useActiveSection'
import { useScrollY } from '@/hooks/useScrollY'
import { NAV_SECTIONS } from '@/lib/sections'
import { cn } from '@/lib/utils'

const sectionIds = NAV_SECTIONS.map((section) => section.id)

// Marca "DEFT." no mesmo desenho da arte da Home: monograma em quadrado + nome com ponto vermelho.
function Brand() {
  return (
    <span aria-hidden className="flex items-center gap-2">
      <span className="flex size-7 items-center justify-center rounded-md border-2 border-[#d42a20] font-display text-sm font-black text-[#d42a20]">
        D
      </span>
      <span className="font-display text-xl font-black tracking-[-0.04em]">
        DEFT<span className="text-[#d42a20]">.</span>
      </span>
    </span>
  )
}

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
        'fixed inset-x-0 top-0 z-40 border-b transition-[background-color,opacity,visibility] duration-200',
        scrolled
          ? 'border-border bg-background/95 backdrop-blur-sm'
          : // No desktop a própria arte da Home já traz o menu, então este some até rolar.
            'border-transparent text-foreground lg:invisible lg:opacity-0',
      )}
    >
      <div className="mx-auto flex h-14 max-w-[1200px] items-center gap-4 px-4 md:gap-6 md:px-6">
        <a href="#inicio" onClick={onBrandClick} className="flex items-center">
          <Brand />
          <span className="sr-only">{site.name}</span>
        </a>

        {/* Menu à direita, junto dos controles de tema e idioma */}
        <nav aria-label={t('nav.label')} className="ml-auto hidden md:block">
          <ul className="flex items-center gap-5 lg:gap-6">
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

        <span aria-hidden className="hidden h-5 w-px bg-border md:block" />

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <LanguageSwitcher />
          <CvButton size="sm" variant="default" />
          <ExternalLink
            href={`${site.whatsappUrl}?text=${encodeURIComponent(t('hero.whatsappMessage'))}`}
            className="hidden items-center gap-1.5 rounded-full border border-border px-4 py-1.5 text-sm transition-colors hover:border-foreground lg:flex"
          >
            {t('nav.talk')}
            <ArrowUpRight aria-hidden className="size-4" />
          </ExternalLink>
        </div>

        <Sheet>
          <SheetTrigger
            className="ml-auto flex size-10 cursor-pointer items-center justify-center md:hidden"
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
