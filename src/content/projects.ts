import type { SkillKey } from './skills'
import type { Localized } from './types'

export type Project = {
  slug: string
  title: Localized
  summary: Localized
  // Micro-texto mono do pôster (ano / tipo).
  year: string
  kind: Localized
  cover: string // /images/projects/<slug>.webp (placeholders em SVG até as capas reais)
  technologies: SkillKey[]
  deployUrl?: string
  githubUrl?: string
  caseStudy: {
    problem: Localized
    process: Localized
    result: Localized
  }
}

const lorem = (text: string): Localized => ({ 'pt-BR': text, 'en-US': text })

const caseStudy = {
  problem: lorem(
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Nullam quis risus eget urna mollis ornare vel eu leo.',
  ),
  process: lorem(
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean lacinia bibendum nulla sed consectetur. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec sed odio dui.',
  ),
  result: lorem(
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam porta sem malesuada magna mollis euismod. Maecenas sed diam eget risus varius blandit sit amet non magna.',
  ),
}

// TODO(jefferson): substituir pelos projetos reais (capas, textos, links).
export const projects: Project[] = [
  {
    slug: 'lorem-ipsum',
    title: lorem('Lorem Ipsum'),
    summary: lorem('Lorem ipsum dolor sit amet, consectetur adipiscing elit.'),
    year: '0000',
    kind: { 'pt-BR': 'Web app', 'en-US': 'Web app' },
    cover: '/images/projects/lorem-ipsum.svg',
    technologies: ['react', 'typescript', 'supabase', 'vercel'],
    deployUrl: '',
    githubUrl: '',
    caseStudy,
  },
  {
    slug: 'dolor-sit',
    title: lorem('Dolor Sit'),
    summary: lorem('Sed do eiusmod tempor incididunt ut labore et dolore.'),
    year: '0000',
    kind: { 'pt-BR': 'Sistema', 'en-US': 'System' },
    cover: '/images/projects/dolor-sit.svg',
    technologies: ['node', 'postgresql', 'docker'],
    deployUrl: '',
    githubUrl: '',
    caseStudy,
  },
  {
    slug: 'amet-consectetur',
    title: lorem('Amet Consectetur'),
    summary: lorem('Ut enim ad minim veniam, quis nostrud exercitation.'),
    year: '0000',
    kind: { 'pt-BR': 'Site', 'en-US': 'Website' },
    cover: '/images/projects/amet-consectetur.svg',
    technologies: ['react', 'vite', 'tailwind', 'figma'],
    deployUrl: '',
    githubUrl: '',
    caseStudy,
  },
]
