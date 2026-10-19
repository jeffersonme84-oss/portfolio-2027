import type { Locale, Localized } from './types'

export type SocialNetwork = 'linkedin' | 'github' | 'behance' | 'instagram' | 'dribbble'

export const site = {
  name: 'Jefferson Moreira Evangelista',
  title: { 'pt-BR': 'Desenvolvedor de Sistemas', 'en-US': 'Systems Developer' } as Localized, // TODO(jefferson): confirmar título
  location: 'São Paulo, BR',
  timeZone: 'America/Sao_Paulo',
  // Número grande da Home (anos de experiência).
  experienceYears: '00', // TODO(jefferson): preencher
  email: 'seu-email@exemplo.com', // TODO(jefferson): preencher
  phoneDisplay: '(11) 96194-1984',
  whatsappUrl: 'https://wa.me/5511961941984',
  // Redes com string vazia não aparecem. A ordem aqui é a ordem de exibição.
  social: {
    linkedin: 'https://www.linkedin.com/in/jeffersonmevangelista/',
    github: '', // TODO(jefferson): preencher
    behance: '', // opcional
    instagram: 'https://www.instagram.com/jeffinhooficial20/',
    dribbble: '', // opcional
  } satisfies Record<SocialNetwork, string>,
  // Enquanto o PDF não existir, o botão "Baixar CV" fica oculto (null).
  // Ex.: '/cv/CV-Jefferson-Evangelista-pt-BR.pdf'
  cv: { 'pt-BR': null, 'en-US': null } as Record<Locale, string | null>, // TODO(jefferson): enviar os PDFs
  // Imagem de fundo da Home (desfocada e suavizada em CSS para não competir com o nome).
  // Para trocar: coloque o arquivo em public/images/hero/ e ajuste src e srcSet.
  hero: {
    background: {
      src: '/images/hero/dev-futurista-1600.webp',
      srcSet:
        '/images/hero/dev-futurista-800.webp 800w, /images/hero/dev-futurista-1600.webp 1600w',
      width: 1600,
      height: 900,
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
