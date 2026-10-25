import type { Locale, Localized } from './types'

export type SocialNetwork = 'linkedin' | 'github' | 'behance' | 'instagram' | 'dribbble'

export const site = {
  name: 'Jefferson Moreira Evangelista',
  title: { 'pt-BR': 'Desenvolvedor de Software', 'en-US': 'Software Developer' } as Localized,
  location: 'São Paulo, BR',
  timeZone: 'America/Sao_Paulo',
  // Número grande da Home: anos como desenvolvedor full stack (DMANDA, fev. 2022 – nov. 2023).
  experienceYears: '02',
  email: 'jeff.evangelista2027@icloud.com',
  phoneDisplay: '(11) 96194-1984',
  whatsappUrl: 'https://wa.me/5511961941984',
  // Redes com string vazia não aparecem. A ordem aqui é a ordem de exibição.
  social: {
    linkedin: 'https://www.linkedin.com/in/jeffersonmevangelista/',
    github: 'https://github.com/JeffersonEvangelista',
    behance: '', // opcional
    instagram: 'https://www.instagram.com/jeffinhooficial20/',
    dribbble: '', // opcional
  } satisfies Record<SocialNetwork, string>,
  // Enquanto o PDF não existir, o botão "Baixar CV" fica oculto (null).
  // Ex.: '/cv/CV-Jefferson-Evangelista-pt-BR.pdf'
  cv: { 'pt-BR': null, 'en-US': null } as Record<Locale, string | null>, // TODO(jefferson): enviar os PDFs
  // Retrato emoldurado da Home (4:5), com o painel de estudos e as tecnologias por cima.
  // Gerado por scripts/armadura-cor.mjs (cor "aço natural", só cor e tom).
  hero: {
    portrait: {
      src: '/images/hero/retrato-armadura-960.webp',
      srcSet:
        '/images/hero/retrato-armadura-480.webp 480w, /images/hero/retrato-armadura-960.webp 960w',
      sizes: '(min-width: 1024px) 420px, 62vw',
      width: 960,
      height: 1200,
    },
  },
  // Liga/desliga todos os easter eggs (Konami, logo, carretéis, foto da família).
  easterEggs: true,
}

export function activeSocials() {
  return (Object.entries(site.social) as [SocialNetwork, string][]).filter(([, url]) => url !== '')
}

export function splitName(name: string) {
  const [first, ...rest] = name.toUpperCase().split(' ')
  return { first, rest: rest.join(' ') }
}
