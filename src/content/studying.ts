import type { SkillKey } from './skills'
import type { Localized } from './types'

export type StudyStatus = 'inProgress' | 'done' | 'next'

export type StudyItem = {
  id: string
  icon: SkillKey // ícone de skills.ts
  title: Localized
  detail: Localized // instituição / certificação
  status: StudyStatus
  year: string
}

// Painel "Estudando agora" da Home: o foco é o que o Jefferson estuda e as tecnologias.
// Fonte: timeline.ts (LinkedIn). Do mais atual para o mais antigo; no celular aparecem os 3 primeiros.
export const studying: StudyItem[] = [
  {
    id: 'pos-ti',
    icon: 'cybersecurity',
    title: { 'pt-BR': 'Pós-graduação em TI', 'en-US': 'Graduate program in IT' },
    detail: { 'pt-BR': 'PUC-Campinas · lato sensu', 'en-US': 'PUC-Campinas · lato sensu' },
    status: 'inProgress', // TODO(jefferson): confirmar se segue em andamento
    year: '2025',
  },
  {
    id: 'ingles',
    icon: 'english',
    title: { 'pt-BR': 'Inglês B2 → C1', 'en-US': 'English B2 → C1' },
    detail: { 'pt-BR': 'Preparação para o C1', 'en-US': 'Preparing for C1' },
    status: 'inProgress',
    year: '2026',
  },
  {
    id: 'aws',
    icon: 'aws',
    title: { 'pt-BR': 'AWS Cloud Architecting', 'en-US': 'AWS Cloud Architecting' },
    detail: {
      'pt-BR': 'AWS Academy · EC2, S3, RDS, Lambda, VPC',
      'en-US': 'AWS Academy · EC2, S3, RDS, Lambda, VPC',
    },
    status: 'done',
    year: '2025',
  },
  {
    id: 'ia',
    icon: 'generativeAi',
    title: { 'pt-BR': 'Inteligência Artificial', 'en-US': 'Artificial Intelligence' },
    detail: {
      'pt-BR': 'Centro Paula Souza · IA generativa',
      'en-US': 'Centro Paula Souza · generative AI',
    },
    status: 'done',
    year: '2025',
  },
  {
    id: 'seguranca',
    icon: 'linux',
    title: { 'pt-BR': 'Segurança e Linux', 'en-US': 'Security and Linux' },
    detail: {
      'pt-BR': 'Security+ Network Infrastructure · Linux Essentials',
      'en-US': 'Security+ Network Infrastructure · Linux Essentials',
    },
    status: 'done',
    year: '2024',
  },
]

// Faixa de tecnologias abaixo do painel (chaves de skills.ts).
export const heroStack: SkillKey[] = [
  'java',
  'springBoot',
  'node',
  'react',
  'typescript',
  'python',
  'mysql',
  'postgresql',
  'aws',
  'supabase',
  'linux',
  'figma',
]
