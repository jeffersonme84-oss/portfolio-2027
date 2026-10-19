import {
  BrainCircuit,
  Handshake,
  Languages,
  Lightbulb,
  MessagesSquare,
  Presentation,
  Puzzle,
  ShieldCheck,
  Users,
  Webhook,
  type LucideIcon,
} from 'lucide-react'
import type { IconType } from 'react-icons'
import { FaAws } from 'react-icons/fa'
import {
  SiAndroid,
  SiArduino,
  SiCplusplus,
  SiEspressif,
  SiExpo,
  SiFigma,
  SiFirebase,
  SiGit,
  SiGithub,
  SiGooglegemini,
  SiJavascript,
  SiLinux,
  SiMqtt,
  SiMysql,
  SiNodedotjs,
  SiOpenjdk,
  SiPostgresql,
  SiPython,
  SiReact,
  SiShadcnui,
  SiSpringboot,
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

// Catálogo de tecnologias (LinkedIn, repositórios do GitHub e a stack deste site).
// As chaves são usadas em projects.ts (campo technologies).
// Para adicionar uma skill: crie a entrada aqui e inclua a chave em um grupo abaixo.
export const skills = {
  react: { name: 'React', icon: SiReact, color: '#61DAFB' },
  typescript: { name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
  javascript: { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E' },
  vite: { name: 'Vite', icon: SiVite, color: '#9135FF' },
  tailwind: { name: 'Tailwind CSS', icon: SiTailwindcss, color: '#06B6D4' },
  shadcn: { name: 'shadcn/ui', icon: SiShadcnui },
  node: { name: 'Node.js', icon: SiNodedotjs, color: '#5FA04E' },
  java: { name: 'Java', icon: SiOpenjdk },
  springBoot: { name: 'Spring Boot', icon: SiSpringboot, color: '#6DB33F' },
  python: { name: 'Python', icon: SiPython, color: '#3776AB' },
  restApi: { name: { 'pt-BR': 'APIs REST', 'en-US': 'REST APIs' }, icon: Webhook },
  supabase: { name: 'Supabase', icon: SiSupabase, color: '#3FCF8E' },
  mysql: { name: 'MySQL', icon: SiMysql, color: '#4479A1' },
  postgresql: { name: 'PostgreSQL', icon: SiPostgresql, color: '#4169E1' },
  aws: { name: 'AWS', icon: FaAws, color: '#FF9900' },
  vercel: { name: 'Vercel', icon: SiVercel },
  linux: { name: 'Linux', icon: SiLinux, color: '#FCC624' },
  git: { name: 'Git', icon: SiGit, color: '#F05032' },
  github: { name: 'GitHub', icon: SiGithub },
  figma: { name: 'Figma', icon: SiFigma, color: '#F24E1E' },
  reactNative: { name: 'React Native', icon: SiReact, color: '#61DAFB' },
  expo: { name: 'Expo', icon: SiExpo },
  firebase: { name: 'Firebase', icon: SiFirebase, color: '#DD2C00' },
  android: { name: 'Android', icon: SiAndroid, color: '#34A853' },
  gemini: { name: 'Google Gemini', icon: SiGooglegemini, color: '#8E75B2' },
  generativeAi: {
    name: { 'pt-BR': 'IA generativa', 'en-US': 'Generative AI' },
    icon: BrainCircuit,
  },
  cybersecurity: {
    name: { 'pt-BR': 'Cibersegurança', 'en-US': 'Cybersecurity' },
    icon: ShieldCheck,
  },
  cpp: { name: 'C++', icon: SiCplusplus, color: '#00599C' },
  esp32: { name: 'ESP32', icon: SiEspressif, color: '#E7352C' },
  arduino: { name: 'Arduino', icon: SiArduino, color: '#00878F' },
  mqtt: { name: 'MQTT', icon: SiMqtt, color: '#660066' },
  portuguese: {
    name: { 'pt-BR': 'Português · nativo', 'en-US': 'Portuguese · native' },
    icon: Languages,
  },
  english: {
    name: { 'pt-BR': 'Inglês · B2', 'en-US': 'English · B2' },
    icon: Languages,
  },
} satisfies Record<string, Skill>

export type SkillKey = keyof typeof skills

export type SkillGroup = {
  id: string
  title: Localized
  skills: SkillKey[]
}

export const hardSkillGroups: SkillGroup[] = [
  {
    id: 'frontend',
    title: { 'pt-BR': 'Frontend', 'en-US': 'Frontend' },
    skills: ['react', 'javascript', 'typescript', 'vite', 'tailwind', 'shadcn'],
  },
  {
    id: 'backend',
    title: { 'pt-BR': 'Backend', 'en-US': 'Backend' },
    skills: ['java', 'springBoot', 'node', 'python', 'restApi'],
  },
  {
    id: 'database',
    title: { 'pt-BR': 'Banco de dados', 'en-US': 'Databases' },
    skills: ['mysql', 'postgresql', 'supabase', 'firebase'],
  },
  {
    id: 'cloud',
    title: { 'pt-BR': 'Cloud e infraestrutura', 'en-US': 'Cloud & infrastructure' },
    skills: ['aws', 'vercel', 'linux', 'cybersecurity'],
  },
  {
    id: 'mobile-iot',
    title: { 'pt-BR': 'Mobile e IoT', 'en-US': 'Mobile & IoT' },
    skills: ['reactNative', 'android', 'expo', 'esp32', 'arduino', 'mqtt'],
  },
  {
    id: 'ai',
    title: { 'pt-BR': 'Inteligência artificial', 'en-US': 'Artificial intelligence' },
    skills: ['generativeAi', 'gemini', 'python'],
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

// Competências do LinkedIn (Liderança de equipe, Apresentações de vendas) e do resumo do perfil.
export const softSkills: SoftSkill[] = [
  {
    id: 'problemas',
    icon: Puzzle,
    title: { 'pt-BR': 'Resolução de problemas', 'en-US': 'Problem solving' },
    text: {
      'pt-BR': 'Entender a necessidade do usuário antes de escrever a solução.',
      'en-US': 'Understanding what users need before writing the solution.',
    },
  },
  {
    id: 'comunicacao',
    icon: MessagesSquare,
    title: { 'pt-BR': 'Comunicação', 'en-US': 'Communication' },
    text: {
      'pt-BR': 'Explicar tecnologia com clareza para clientes e equipes.',
      'en-US': 'Explaining technology clearly to clients and teams.',
    },
  },
  {
    id: 'apresentacoes',
    icon: Presentation,
    title: { 'pt-BR': 'Apresentações de vendas', 'en-US': 'Sales presentations' },
    text: {
      'pt-BR': 'Demonstrações consultivas focadas no problema do cliente.',
      'en-US': "Consultative demos focused on the client's problem.",
    },
  },
  {
    id: 'lideranca',
    icon: Users,
    title: { 'pt-BR': 'Liderança de equipe', 'en-US': 'Team leadership' },
    text: {
      'pt-BR': 'Treinamento em campo, metas e gestão de indicadores.',
      'en-US': 'Field training, goals and KPI management.',
    },
  },
  {
    id: 'aprendizado',
    icon: Lightbulb,
    title: { 'pt-BR': 'Aprendizado contínuo', 'en-US': 'Continuous learning' },
    text: {
      'pt-BR': 'Certificações em nuvem, IA e segurança; inglês rumo ao C1.',
      'en-US': 'Cloud, AI and security certifications; English toward C1.',
    },
  },
  {
    id: 'negociacao',
    icon: Handshake,
    title: { 'pt-BR': 'Negociação consultiva', 'en-US': 'Consultative negotiation' },
    text: {
      'pt-BR': 'Relacionamento com clientes orientado a resultados.',
      'en-US': 'Results-oriented client relationships.',
    },
  },
]
