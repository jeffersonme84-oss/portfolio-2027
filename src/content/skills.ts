import {
  Accessibility,
  BellRing,
  BrainCircuit,
  Gauge,
  Megaphone,
  MonitorSmartphone,
  Network,
  Palette,
  ShoppingCart,
  TrendingUp,
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
  // Design e UI/UX (Figma e este portfólio: responsivo e acessível).
  uiux: { name: { 'pt-BR': 'UI/UX Design', 'en-US': 'UI/UX Design' }, icon: Palette },
  responsive: {
    name: { 'pt-BR': 'Design responsivo', 'en-US': 'Responsive design' },
    icon: MonitorSmartphone,
  },
  accessibility: {
    name: { 'pt-BR': 'Acessibilidade', 'en-US': 'Accessibility' },
    icon: Accessibility,
  },
  // Segurança (Security+ Network Infrastructure; segurança eletrônica na Verisure).
  networkSecurity: {
    name: { 'pt-BR': 'Segurança de redes', 'en-US': 'Network security' },
    icon: Network,
  },
  electronicSecurity: {
    name: { 'pt-BR': 'Segurança eletrônica', 'en-US': 'Electronic security' },
    icon: BellRing,
  },
  // Comercial e marketing (Verisure e DMANDA).
  sales: { name: { 'pt-BR': 'Vendas B2B/B2C', 'en-US': 'B2B/B2C sales' }, icon: TrendingUp },
  kpis: { name: { 'pt-BR': 'Gestão de KPIs', 'en-US': 'KPI management' }, icon: Gauge },
  ecommerce: {
    name: { 'pt-BR': 'E-commerce', 'en-US': 'E-commerce' },
    icon: ShoppingCart,
  },
  campaigns: {
    name: { 'pt-BR': 'Campanhas e feiras', 'en-US': 'Campaigns and fairs' },
    icon: Megaphone,
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
  // Para que serve no trabalho de Forward Deployed Engineer (uma linha curta).
  role: Localized
  skills: SkillKey[]
}

// 9 frentes, todas visíveis de uma vez na seção Habilidades.
export const hardSkillGroups: SkillGroup[] = [
  {
    id: 'frontend',
    title: { 'pt-BR': 'Frontend', 'en-US': 'Frontend' },
    role: { 'pt-BR': 'Telas que o cliente usa', 'en-US': 'Screens the client uses' },
    skills: ['react', 'javascript', 'typescript', 'vite', 'tailwind', 'shadcn'],
  },
  {
    id: 'backend',
    title: { 'pt-BR': 'Backend e APIs', 'en-US': 'Backend & APIs' },
    role: { 'pt-BR': 'Integração com os sistemas', 'en-US': 'Integration with systems' },
    skills: ['java', 'springBoot', 'node', 'python', 'restApi'],
  },
  {
    id: 'database',
    title: { 'pt-BR': 'Dados', 'en-US': 'Data' },
    role: { 'pt-BR': 'Dados da operação', 'en-US': 'Operational data' },
    skills: ['mysql', 'postgresql', 'supabase', 'firebase'],
  },
  {
    id: 'cloud',
    title: { 'pt-BR': 'Cloud e deploy', 'en-US': 'Cloud & deploy' },
    role: { 'pt-BR': 'Em produção e rodando', 'en-US': 'Live in production' },
    skills: ['aws', 'vercel', 'linux', 'git', 'github'],
  },
  {
    id: 'ai',
    title: { 'pt-BR': 'IA aplicada', 'en-US': 'Applied AI' },
    role: { 'pt-BR': 'IA em fluxos reais', 'en-US': 'AI in real workflows' },
    skills: ['generativeAi', 'gemini', 'python'],
  },
  {
    id: 'mobile-iot',
    title: { 'pt-BR': 'Mobile e IoT', 'en-US': 'Mobile & IoT' },
    role: { 'pt-BR': 'Apps e sensores em campo', 'en-US': 'Apps and sensors in the field' },
    skills: ['reactNative', 'android', 'expo', 'esp32', 'arduino', 'mqtt'],
  },
  {
    id: 'security',
    title: { 'pt-BR': 'Segurança', 'en-US': 'Security' },
    role: { 'pt-BR': 'Seguro desde o 1º deploy', 'en-US': 'Secure from the first deploy' },
    skills: ['cybersecurity', 'networkSecurity', 'electronicSecurity'],
  },
  {
    id: 'design',
    title: { 'pt-BR': 'Produto e UX', 'en-US': 'Product & UX' },
    role: { 'pt-BR': 'Entender antes de construir', 'en-US': 'Understand before building' },
    skills: ['figma', 'uiux', 'responsive', 'accessibility'],
  },
  {
    id: 'business',
    title: { 'pt-BR': 'Cliente e negócio', 'en-US': 'Client & business' },
    role: { 'pt-BR': 'A língua do negócio', 'en-US': 'Speaking business' },
    skills: ['sales', 'kpis', 'ecommerce', 'campaigns', 'portuguese', 'english'],
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
