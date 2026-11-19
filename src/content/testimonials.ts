import type { Localized } from './types'

export type Testimonial = {
  id: string
  name: string
  role: Localized
  company: string
  text: Localized
  photo?: string // /images/testimonials/<id>.webp
  linkedinUrl?: string
}

// TODO(jefferson): adicionar os depoimentos reais (só com autorização de quem escreveu).
// Com a lista vazia, a seção some da página. Os exemplos em Lorem ipsum foram retirados para
// não aparecerem para recrutadores (2026-11-19). Modelo de um depoimento:
//
//   {
//     id: 'maria-silva',
//     name: 'Maria Silva',
//     role: { 'pt-BR': 'Gerente de Projetos', 'en-US': 'Project Manager' },
//     company: 'Empresa X',
//     text: { 'pt-BR': 'Texto do depoimento…', 'en-US': 'Testimonial text…' },
//     photo: '/images/testimonials/maria-silva.webp', // opcional
//     linkedinUrl: 'https://www.linkedin.com/in/...', // opcional
//   },
export const testimonials: Testimonial[] = []
