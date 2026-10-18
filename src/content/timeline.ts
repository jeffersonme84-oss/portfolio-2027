import type { Localized } from './types'

export type TimelineType = 'work' | 'education' | 'certification' | 'award' | 'family'

export type TimelineItem = {
  id: string
  type: TimelineType
  period: string // ex.: "2021 – 2024"
  title: Localized
  subtitle?: Localized // empresa / instituição
  summary: Localized // visível fechado
  details: Localized // visível ao expandir
  photo?: string // caminho em /images/about/editorial/
  photoAlt?: Localized
  // Foto da família que revela a ilustração com 3 cliques (easter egg).
  revealsIllustration?: boolean
}

const lorem: Localized = {
  'pt-BR':
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'en-US':
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
}

const loremLong: Localized = {
  'pt-BR':
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.',
  'en-US':
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.',
}

const loremTitle: Localized = { 'pt-BR': 'Lorem ipsum dolor', 'en-US': 'Lorem ipsum dolor' }

// Biografia resumida e valores (topo da seção Sobre).
export const about = {
  // TODO(jefferson): preencher com a seção "Sobre" do LinkedIn
  bio: {
    'pt-BR':
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Vestibulum id ligula porta felis euismod semper. Cras mattis consectetur purus sit amet fermentum.',
    'en-US':
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Vestibulum id ligula porta felis euismod semper. Cras mattis consectetur purus sit amet fermentum.',
  } as Localized,
  // TODO(jefferson): preencher valores e diferenciais (o que motiva e como ajuda empresas)
  values: {
    'pt-BR':
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas faucibus mollis interdum. Donec ullamcorper nulla non metus auctor fringilla.',
    'en-US':
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas faucibus mollis interdum. Donec ullamcorper nulla non metus auctor fringilla.',
  } as Localized,
}

// Do mais recente para o mais antigo. TODO(jefferson): preencher a partir do LinkedIn.
export const timeline: TimelineItem[] = [
  {
    id: 'experiencia-1',
    type: 'work',
    period: '0000 – 0000', // TODO(jefferson): preencher
    title: loremTitle, // TODO(jefferson): cargo
    subtitle: { 'pt-BR': 'Lorem Ipsum Ltda.', 'en-US': 'Lorem Ipsum Ltda.' }, // TODO(jefferson): empresa
    summary: lorem,
    details: loremLong,
    photo: '/images/about/editorial/retrato-carro.webp',
    photoAlt: {
      'pt-BR': 'Retrato casual de Jefferson',
      'en-US': 'Casual portrait of Jefferson',
    },
  },
  {
    id: 'certificacao-1',
    type: 'certification',
    period: '0000', // TODO(jefferson): preencher
    title: loremTitle, // TODO(jefferson): certificação
    subtitle: { 'pt-BR': 'Lorem Ipsum', 'en-US': 'Lorem Ipsum' }, // TODO(jefferson): emissor
    summary: lorem,
    details: loremLong,
  },
  {
    id: 'premio-1',
    type: 'award',
    period: '0000', // TODO(jefferson): preencher
    title: loremTitle, // TODO(jefferson): prêmio ou marca relevante
    summary: lorem,
    details: loremLong,
  },
  {
    id: 'formatura-fatec',
    type: 'education',
    period: '0000', // TODO(jefferson): ano da formatura
    title: { 'pt-BR': 'Formatura', 'en-US': 'Graduation' },
    subtitle: { 'pt-BR': 'Fatec · Tecnologia', 'en-US': 'Fatec · Technology' }, // TODO(jefferson): nome do curso
    summary: lorem,
    details: loremLong,
    photo: '/images/about/editorial/fatec-formatura-solo.webp',
    photoAlt: {
      'pt-BR': 'Jefferson de beca e faixa na formatura da Fatec',
      'en-US': 'Jefferson in cap and gown at his Fatec graduation',
    },
  },
  {
    id: 'formatura-familia',
    type: 'education',
    period: '0000', // TODO(jefferson): ano da formatura
    title: { 'pt-BR': 'Formatura em família', 'en-US': 'Graduation with family' },
    subtitle: { 'pt-BR': 'Fatec · Tecnologia', 'en-US': 'Fatec · Technology' },
    summary: lorem,
    details: loremLong,
    photo: '/images/about/editorial/formatura-familia.webp',
    photoAlt: {
      'pt-BR': 'Jefferson de beca com a esposa e a filha na formatura',
      'en-US': 'Jefferson in a graduation gown with his wife and daughter',
    },
  },
  {
    id: 'valores',
    type: 'family',
    period: '∞',
    title: { 'pt-BR': 'Valores', 'en-US': 'Values' },
    summary: lorem, // TODO(jefferson): preencher
    details: loremLong,
    photo: '/images/about/editorial/familia-selfie.webp',
    photoAlt: {
      'pt-BR': 'Selfie de Jefferson com a esposa e a filha',
      'en-US': 'Selfie of Jefferson with his wife and daughter',
    },
    revealsIllustration: true,
  },
  {
    id: 'motivacao',
    type: 'family',
    period: '∞',
    title: { 'pt-BR': 'Motivação', 'en-US': 'Motivation' },
    summary: lorem, // TODO(jefferson): preencher
    details: loremLong,
    photo: '/images/about/editorial/pai-e-filha-camisa14.webp',
    photoAlt: {
      'pt-BR': 'Jefferson de costas, com camisa número 14, carregando a filha no colo',
      'en-US': 'Jefferson seen from behind in a number 14 shirt, carrying his daughter',
    },
  },
  {
    id: 'apoio',
    type: 'family',
    period: '∞',
    title: { 'pt-BR': 'Apoio', 'en-US': 'Support' },
    summary: lorem, // TODO(jefferson): preencher
    details: loremLong,
    photo: '/images/about/editorial/esposa-retrato.webp',
    photoAlt: {
      'pt-BR': 'Retrato sorridente da esposa de Jefferson',
      'en-US': "Smiling portrait of Jefferson's wife",
    },
  },
]

// Easter egg: versão em ilustração da família (usada sem alterações).
export const familyIllustration = '/images/about/ilustracao-familia-easteregg.webp'
