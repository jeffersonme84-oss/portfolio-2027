import {
  Clock,
  Languages,
  Lightbulb,
  MessagesSquare,
  Puzzle,
  Users,
  type LucideIcon,
} from 'lucide-react'
import type { IconType } from 'react-icons'
import {
  SiAndroid,
  SiArduino,
  SiCplusplus,
  SiDocker,
  SiEspressif,
  SiExpo,
  SiFigma,
  SiFirebase,
  SiGit,
  SiGithub,
  SiGooglegemini,
  SiJavascript,
  SiMqtt,
  SiNodedotjs,
  SiOpenjdk,
  SiPostgresql,
  SiReact,
  SiShadcnui,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
  SiVite,
} from 'react-icons/si'
import type { Localized } from './types'

export type Skill = {
  name: string | Localized
  icon: IconType | LucideIcon
  // Cor da marca, usada só no hover (ícones são monocromáticos por padrão).
  color?: string
}

// Catálogo de tecnologias. As chaves são usadas em projects.ts (campo technologies).
// Para adicionar uma skill: crie a entrada aqui e inclua a chave em um grupo abaixo.
export const skills = {
  react: { name: 'React', icon: SiReact, color: '#61DAFB' },
  typescript: { name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
  javascript: { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E' },
  vite: { name: 'Vite', icon: SiVite, color: '#9135FF' },
  tailwind: { name: 'Tailwind CSS', icon: SiTailwindcss, color: '#06B6D4' },
  shadcn: { name: 'shadcn/ui', icon: SiShadcnui },
  node: { name: 'Node.js', icon: SiNodedotjs, color: '#5FA04E' },
  supabase: { name: 'Supabase', icon: SiSupabase, color: '#3FCF8E' },
  postgresql: { name: 'PostgreSQL', icon: SiPostgresql, color: '#4169E1' },
  vercel: { name: 'Vercel', icon: SiVercel },
  docker: { name: 'Docker', icon: SiDocker, color: '#2496ED' },
  git: { name: 'Git', icon: SiGit, color: '#F05032' },
  github: { name: 'GitHub', icon: SiGithub },
  figma: { name: 'Figma', icon: SiFigma, color: '#F24E1E' },
  // Tecnologias dos projetos do GitHub (react-icons não tem marca do React Native).
  reactNative: { name: 'React Native', icon: SiReact, color: '#61DAFB' },
  expo: { name: 'Expo', icon: SiExpo },
  firebase: { name: 'Firebase', icon: SiFirebase, color: '#DD2C00' },
  gemini: { name: 'Google Gemini', icon: SiGooglegemini, color: '#8E75B2' },
  android: { name: 'Android', icon: SiAndroid, color: '#34A853' },
  java: { name: 'Java', icon: SiOpenjdk },
  cpp: { name: 'C++', icon: SiCplusplus, color: '#00599C' },
  esp32: { name: 'ESP32', icon: SiEspressif, color: '#E7352C' },
  arduino: { name: 'Arduino', icon: SiArduino, color: '#00878F' },
  mqtt: { name: 'MQTT', icon: SiMqtt, color: '#660066' },
  portuguese: {
    name: { 'pt-BR': 'Português · Lorem', 'en-US': 'Portuguese · Lorem' }, // TODO(jefferson): nível
    icon: Languages,
  },
  english: {
    name: { 'pt-BR': 'Inglês · Lorem', 'en-US': 'English · Lorem' }, // TODO(jefferson): nível
    icon: Languages,
  },
} satisfies Record<string, Skill>

export type SkillKey = keyof typeof skills

export type SkillGroup = {
  id: string
  title: Localized
  skills: SkillKey[]
}

// TODO(jefferson): ajustar a lista completa de hard skills.
export const hardSkillGroups: SkillGroup[] = [
  {
    id: 'frontend',
    title: { 'pt-BR': 'Frontend', 'en-US': 'Frontend' },
    skills: ['react', 'typescript', 'javascript', 'vite', 'tailwind', 'shadcn'],
  },
  {
    id: 'backend',
    title: { 'pt-BR': 'Backend', 'en-US': 'Backend' },
    skills: ['node', 'supabase'],
  },
  {
    id: 'database',
    title: { 'pt-BR': 'Banco de dados', 'en-US': 'Databases' },
    skills: ['postgresql', 'supabase'],
  },
  {
    id: 'devops',
    title: { 'pt-BR': 'DevOps / Deploy', 'en-US': 'DevOps / Deploy' },
    skills: ['vercel', 'docker'],
  },
  {
    id: 'tools',
    title: { 'pt-BR': 'Ferramentas', 'en-US': 'Tools' },
    skills: ['git', 'github', 'figma'],
  },
  {
    id: 'languages',
    title: { 'pt-BR': 'Idiomas', 'en-US': 'Languages' },
    skills: ['portuguese', 'english'],
  },
]

export type SoftSkill = {
  id: string
  icon: LucideIcon
  title: Localized
  text: Localized
}

// TODO(jefferson): ajustar as frases das soft skills.
export const softSkills: SoftSkill[] = [
  {
    id: 'problemas',
    icon: Puzzle,
    title: { 'pt-BR': 'Resolução de problemas', 'en-US': 'Problem solving' },
    text: { 'pt-BR': 'Lorem ipsum dolor sit amet.', 'en-US': 'Lorem ipsum dolor sit amet.' },
  },
  {
    id: 'comunicacao',
    icon: MessagesSquare,
    title: { 'pt-BR': 'Comunicação', 'en-US': 'Communication' },
    text: { 'pt-BR': 'Lorem ipsum dolor sit amet.', 'en-US': 'Lorem ipsum dolor sit amet.' },
  },
  {
    id: 'tempo',
    icon: Clock,
    title: { 'pt-BR': 'Gestão de tempo', 'en-US': 'Time management' },
    text: { 'pt-BR': 'Lorem ipsum dolor sit amet.', 'en-US': 'Lorem ipsum dolor sit amet.' },
  },
  {
    id: 'equipe',
    icon: Users,
    title: { 'pt-BR': 'Trabalho em equipe', 'en-US': 'Teamwork' },
    text: { 'pt-BR': 'Lorem ipsum dolor sit amet.', 'en-US': 'Lorem ipsum dolor sit amet.' },
  },
  {
    id: 'aprendizado',
    icon: Lightbulb,
    title: { 'pt-BR': 'Aprendizado contínuo', 'en-US': 'Continuous learning' },
    text: { 'pt-BR': 'Lorem ipsum dolor sit amet.', 'en-US': 'Lorem ipsum dolor sit amet.' },
  },
]
