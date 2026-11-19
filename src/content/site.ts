import type { Locale, Localized } from './types'

export type SocialNetwork = 'linkedin' | 'github' | 'behance' | 'instagram' | 'dribbble'

export const site = {
  name: 'Jefferson Moreira Evangelista',
  // Cargo (pedido do Jefferson, 2026-11-19): Forward Deployed Engineer.
  title: {
    'pt-BR': 'Forward Deployed Engineer (FDE)',
    'en-US': 'Forward Deployed Engineer (FDE)',
  } as Localized,
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
  // Arte da Home "DEFT." (foto + PORTFÓLIO ao fundo), usada sem alterações; ajustes em src/styles/hero.css.
  // As posições dos textos por cima seguem as coordenadas desta arte (1376 × 768).
  // TODO(jefferson): enviar a arte em alta resolução (e, se possível, uma versão sem os textos).
  hero: {
    background: {
      src: '/images/hero/home-deft.jpg',
      srcSet: '/images/hero/home-deft.jpg 1376w',
      width: 1376,
      height: 768,
    },
    // Mesma arte no modo claro (enviada pelo Jefferson, mesmo tamanho e posições).
    backgroundLight: '/images/hero/home-deft-light.jpg',
    // Números da Home. Tecnologias = itens técnicos de skills.ts (linguagens, frameworks, bancos,
    // nuvem, ferramentas, IoT e IA), sem soft skills, design, comercial e idiomas.
    stats: { technologies: 30, years: 2, degrees: 1 },
    // Projeto aberto por "Ver por dentro" (slug de projects.ts).
    featuredProject: 'sias-app',
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
