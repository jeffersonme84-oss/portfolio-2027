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
  // Cena da Home (degradê + armadura futurista), cobrindo a primeira dobra; ajustes em src/styles/hero.css.
  // Para trocar: coloque o arquivo em public/images/hero/ e ajuste src e srcSet.
  hero: {
    background: {
      src: '/images/hero/home-cena-2496.webp',
      srcSet: '/images/hero/home-cena-1248.webp 1248w, /images/hero/home-cena-2496.webp 2496w',
      width: 2496,
      height: 1664,
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
