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

const lorem = (text: string): Localized => ({ 'pt-BR': text, 'en-US': text })

// TODO(jefferson): substituir pelos depoimentos reais (só com autorização de quem escreveu).
// Com a lista vazia, a seção some da página.
export const testimonials: Testimonial[] = [
  {
    id: 'depoimento-1',
    name: 'Lorem Ipsum',
    role: lorem('Lorem ipsum'),
    company: 'Dolor Sit',
    text: lorem(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sagittis lacus vel augue laoreet rutrum faucibus.',
    ),
    linkedinUrl: '',
  },
  {
    id: 'depoimento-2',
    name: 'Dolor Amet',
    role: lorem('Lorem ipsum'),
    company: 'Consectetur',
    text: lorem(
      'Sed posuere consectetur est at lobortis. Cras justo odio, dapibus ac facilisis in, egestas eget quam.',
    ),
    linkedinUrl: '',
  },
  {
    id: 'depoimento-3',
    name: 'Sit Elit',
    role: lorem('Lorem ipsum'),
    company: 'Adipiscing',
    text: lorem(
      'Maecenas faucibus mollis interdum. Nullam quis risus eget urna mollis ornare vel eu leo cum sociis.',
    ),
    linkedinUrl: '',
  },
]
