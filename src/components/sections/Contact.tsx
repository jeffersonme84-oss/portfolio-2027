import { Mail, Phone } from 'lucide-react'
import { lazy, Suspense } from 'react'
import { SiWhatsapp } from 'react-icons/si'
import { CvButton } from '@/components/layout/CvButton'
import { ExternalLink } from '@/components/layout/ExternalLink'
import { socialIcons } from '@/components/layout/socialIcons'
import { SectionHeading } from '@/components/sections/SectionHeading'
import { buttonVariants } from '@/components/ui/button-variants'
import { activeSocials, site } from '@/content/site'
import { useLocale } from '@/hooks/useLocale'

const subheading = 'mb-4 font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase'

const ContactForm = lazy(() => import('@/components/sections/ContactForm'))

export function Contact() {
  const { t } = useLocale()

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
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex items-center gap-3 hover:text-accent"
                >
                  <Mail className="size-4" aria-hidden />
                  <span className="sr-only">{t('social.email')}: </span>
                  {site.email}
                </a>
              </li>
              <li>
                <ExternalLink
                  href={site.whatsappUrl}
                  className="inline-flex items-center gap-3 hover:text-accent"
                >
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
                    <ExternalLink
                      href={url}
                      className="inline-flex items-center gap-2 hover:text-accent"
                    >
                      <Icon className="size-4" aria-hidden />
                      {t(`social.${network}`)}
                    </ExternalLink>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="flex flex-wrap gap-3">
            <ExternalLink
              href={site.whatsappUrl}
              className={buttonVariants({ variant: 'outline' })}
            >
              <SiWhatsapp aria-hidden />
              {t('social.whatsapp')}
            </ExternalLink>
            <CvButton />
          </div>
        </div>

        <div className="md:col-span-7">
          <Suspense fallback={<div className="min-h-[30rem]" />}>
            <ContactForm />
          </Suspense>
        </div>
      </div>
    </section>
  )
}
