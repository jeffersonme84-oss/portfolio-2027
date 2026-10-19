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

// Biografia e valores (topo da seção Sobre), a partir da seção "Resumo" do LinkedIn.
export const about = {
  bio: {
    'pt-BR':
      'Sou formado em Desenvolvimento de Software Multiplataforma pela Fatec Zona Sul e apaixonado por tecnologia, programação e inteligência artificial. Desenvolvo sistemas web, aplicativos mobile, automações e soluções com IA usando Java, JavaScript, Node.js, Spring Boot, Python, SQL e AWS, com base em cibersegurança, computação em nuvem e integração de sistemas.',
    'en-US':
      'I hold a degree in Multiplatform Software Development from Fatec Zona Sul and I am passionate about technology, programming and artificial intelligence. I build web systems, mobile apps, automations and AI-based solutions with Java, JavaScript, Node.js, Spring Boot, Python, SQL and AWS, backed by cybersecurity, cloud computing and systems integration.',
  } as Localized,
  values: {
    'pt-BR':
      'Uno tecnologia e visão de negócios: a liderança de equipes, as vendas consultivas e os estudos de psicologia e psicanálise me ajudam a entender as pessoas e a criar soluções centradas na experiência do cliente.',
    'en-US':
      'I combine technology with business sense: team leadership, consultative sales and my studies in psychology and psychoanalysis help me understand people and build customer-centered solutions.',
  } as Localized,
}

// Do mais recente para o mais antigo. Fonte: perfil do LinkedIn (out. 2026).
export const timeline: TimelineItem[] = [
  {
    id: 'verisure-lider',
    type: 'work',
    period: '2026 →', // em andamento
    title: { 'pt-BR': 'Líder de equipe', 'en-US': 'Team leader' },
    subtitle: { 'pt-BR': 'Verisure · São Paulo', 'en-US': 'Verisure · São Paulo' },
    summary: {
      'pt-BR': 'Formação de equipe de vendas com foco em resultados e desenvolvimento de pessoas.',
      'en-US': 'Building a sales team focused on results and people development.',
    },
    details: {
      'pt-BR':
        'Prospecção de negócios, treinamento de campo e gestão de KPIs para transformar vendedores em profissionais de alta performance, além da instalação de equipamentos tecnológicos de segurança e vigilância. Foco em liderança, vendas B2B/B2C, treinamento de equipes e gestão de indicadores.',
      'en-US':
        'Business prospecting, field training and KPI management to turn salespeople into high performers, plus installing technological security and surveillance equipment. Focus on leadership, B2B/B2C sales, team training and performance indicators.',
    },
    photo: '/images/about/editorial/retrato-carro.webp',
    photoAlt: {
      'pt-BR': 'Retrato casual de Jefferson',
      'en-US': 'Casual portrait of Jefferson',
    },
  },
  {
    id: 'verisure-executivo',
    type: 'work',
    // TODO(jefferson): no LinkedIn, Júnior (ago. 2024 – nov. 2025) e Pleno (jul. 2024 – abr. 2026) se sobrepõem; conferir as datas
    period: '2024 – 2026',
    title: {
      'pt-BR': 'Executivo de vendas Júnior → Pleno',
      'en-US': 'Sales executive, Junior → Mid-level',
    },
    subtitle: { 'pt-BR': 'Verisure · São Paulo', 'en-US': 'Verisure · São Paulo' },
    summary: {
      'pt-BR': 'Vendas consultivas de alarmes inteligentes com IA e IoT.',
      'en-US': 'Consultative sales of smart alarms with AI and IoT.',
    },
    details: {
      'pt-BR':
        'Prospecção de clientes e vendas consultivas de sistemas de alarmes inteligentes, com demonstrações presenciais, além de manutenções preventivas e instalação de sistemas de segurança com IA e IoT. Experiência que ampliou minha visão sobre Internet das Coisas, automação e infraestrutura tecnológica.',
      'en-US':
        'Client prospecting and consultative sales of smart alarm systems, with in-person demos, plus preventive maintenance and installation of AI and IoT security systems. This broadened my view of the Internet of Things, automation and tech infrastructure.',
    },
  },
  {
    id: 'pos-puc',
    type: 'education',
    period: '2025',
    // TODO(jefferson): confirmar se a pós está em andamento e a previsão de conclusão
    title: {
      'pt-BR': 'Pós-graduação em Tecnologia da Informação',
      'en-US': 'Graduate certificate in Information Technology',
    },
    subtitle: {
      'pt-BR': 'PUC-Campinas · lato sensu',
      'en-US': 'PUC-Campinas · lato sensu',
    },
    summary: {
      'pt-BR': 'Especialização lato sensu em Tecnologia da Informação.',
      'en-US': 'Lato sensu specialization in Information Technology.',
    },
    details: {
      'pt-BR':
        'Pós-graduação lato sensu em Tecnologia da Informação, iniciada em novembro de 2025.',
      'en-US': 'Lato sensu graduate program in Information Technology, started in November 2025.',
    },
  },
  {
    id: 'formatura-fatec',
    type: 'education',
    period: '2023 – 2025',
    title: {
      'pt-BR': 'Desenvolvimento de Software Multiplataforma',
      'en-US': 'Multiplatform Software Development',
    },
    subtitle: { 'pt-BR': 'Fatec Zona Sul', 'en-US': 'Fatec Zona Sul' },
    summary: {
      'pt-BR': 'Graduação tecnológica com projetos web, mobile, automação e IA.',
      'en-US': 'Technology degree with web, mobile, automation and AI projects.',
    },
    details: {
      'pt-BR':
        'Projetos práticos de sistemas web, aplicativos mobile, automação de processos e soluções com IA, usando Java, JavaScript, Node.js, Spring Boot, Python, SQL, MySQL, AWS e ferramentas de IA generativa. Também participei da Semana de Tecnologia da Fatec Zona Sul (2023).',
      'en-US':
        'Hands-on projects in web systems, mobile apps, process automation and AI solutions, using Java, JavaScript, Node.js, Spring Boot, Python, SQL, MySQL, AWS and generative AI tools. I also took part in the Fatec Zona Sul Technology Week (2023).',
    },
    photo: '/images/about/editorial/fatec-formatura-solo.webp',
    photoAlt: {
      'pt-BR': 'Jefferson de beca e faixa na formatura da Fatec',
      'en-US': 'Jefferson in cap and gown at his Fatec graduation',
    },
  },
  {
    id: 'formatura-familia',
    type: 'education',
    period: '2025',
    title: { 'pt-BR': 'Formatura em família', 'en-US': 'Graduation with family' },
    subtitle: { 'pt-BR': 'Fatec Zona Sul', 'en-US': 'Fatec Zona Sul' },
    summary: lorem, // TODO(jefferson): preencher
    details: loremLong,
    photo: '/images/about/editorial/formatura-familia.webp',
    photoAlt: {
      'pt-BR': 'Jefferson de beca com a esposa e a filha na formatura',
      'en-US': 'Jefferson in a graduation gown with his wife and daughter',
    },
  },
  {
    id: 'certificacoes-aws',
    type: 'certification',
    period: '2024 – 2025',
    title: { 'pt-BR': 'AWS Academy Graduate', 'en-US': 'AWS Academy Graduate' },
    subtitle: {
      'pt-BR': 'Amazon Web Services · Cloud Foundations e Cloud Architecting',
      'en-US': 'Amazon Web Services · Cloud Foundations and Cloud Architecting',
    },
    summary: {
      'pt-BR': 'Arquitetura de soluções seguras, escaláveis e eficientes na nuvem.',
      'en-US': 'Designing secure, scalable and efficient cloud solutions.',
    },
    details: {
      'pt-BR':
        'Cloud Foundations (nov. 2024) e Cloud Architecting (mai. 2025), com prática em EC2, S3, RDS, Lambda e VPC e aplicação do AWS Well-Architected Framework, com foco em performance, segurança e otimização de custos.',
      'en-US':
        'Cloud Foundations (Nov 2024) and Cloud Architecting (May 2025), with hands-on EC2, S3, RDS, Lambda and VPC and the AWS Well-Architected Framework, focused on performance, security and cost optimization.',
    },
  },
  {
    id: 'certificacoes-dev',
    type: 'certification',
    period: '2022 – 2025',
    title: { 'pt-BR': 'Desenvolvimento e IA', 'en-US': 'Development and AI' },
    subtitle: {
      'pt-BR': 'Cisco · Fundação Bradesco · Centro Paula Souza · Rocketseat',
      'en-US': 'Cisco · Fundação Bradesco · Centro Paula Souza · Rocketseat',
    },
    summary: {
      'pt-BR': 'JavaScript, Java, Android, front-end e inteligência artificial.',
      'en-US': 'JavaScript, Java, Android, front-end and artificial intelligence.',
    },
    details: {
      'pt-BR':
        'Inteligência Artificial Básico (Centro Paula Souza, 2025); JavaScript Essentials 1 (Cisco, 2024); desenvolvimento Android no Android Studio (Fundação Bradesco, 2024); Front-End Básico (Centro Paula Souza, 2024); Linguagem Java Básico (Fundação Bradesco, 2022); Conectar (Rocketseat, 2022).',
      'en-US':
        'Basic Artificial Intelligence (Centro Paula Souza, 2025); JavaScript Essentials 1 (Cisco, 2024); Android development in Android Studio (Fundação Bradesco, 2024); Basic Front-End (Centro Paula Souza, 2024); Basic Java Programming (Fundação Bradesco, 2022); Conectar (Rocketseat, 2022).',
    },
  },
  {
    id: 'certificacoes-infra',
    type: 'certification',
    period: '2022 – 2024',
    title: {
      'pt-BR': 'Infraestrutura, segurança e IoT',
      'en-US': 'Infrastructure, security and IoT',
    },
    subtitle: {
      'pt-BR': 'Linux · Security+ · Arduino · Inglês',
      'en-US': 'Linux · Security+ · Arduino · English',
    },
    summary: {
      'pt-BR': 'Administração Linux, cibersegurança e eletrônica com Arduino.',
      'en-US': 'Linux administration, cybersecurity and Arduino electronics.',
    },
    details: {
      'pt-BR':
        'Desenvolvimento Profissional em Linux Essentials (2022, preparação para a LPIC-1); Security+ Network Infrastructure (ProProfs, 2024); Curso de Arduino (iPED, 2024); MOOC English Online 1 (Centro Paula Souza, 2024). Inglês com certificações do A1 ao B2, em preparação para o C1.',
      'en-US':
        'Professional Development in Linux Essentials (2022, LPIC-1 preparation); Security+ Network Infrastructure (ProProfs, 2024); Arduino course (iPED, 2024); MOOC English Online 1 (Centro Paula Souza, 2024). English certified from A1 to B2, now preparing for C1.',
    },
  },
  {
    id: 'dmanda',
    type: 'work',
    period: '2022 – 2023',
    title: { 'pt-BR': 'Desenvolvedor Full Stack', 'en-US': 'Full Stack Developer' },
    subtitle: {
      'pt-BR': 'DMANDA Services LLC · São Paulo',
      'en-US': 'DMANDA Services LLC · São Paulo',
    },
    summary: {
      'pt-BR': 'E-commerce, marketplaces, aplicativos, sites e bancos de dados.',
      'en-US': 'E-commerce, marketplaces, apps, websites and databases.',
    },
    details: {
      'pt-BR':
        'Participei da criação de sistemas de e-commerce: lojas virtuais próprias, presença em marketplaces como Mercado Livre e Shopee, aplicativos e sites de vendas e bancos de dados, cobrindo a experiência do cliente e as operações comerciais online. Também atuei no esquema de vendas B2B, em material de apoio, campanhas e feiras.',
      'en-US':
        'I helped build e-commerce systems: own online stores, presence on marketplaces such as Mercado Livre and Shopee, sales apps and websites and databases, covering both customer experience and online operations. I also worked on B2B sales, support materials, campaigns and trade fairs.',
    },
  },
  {
    id: 'psicologia',
    type: 'education',
    period: '2014 – 2025',
    title: {
      'pt-BR': 'Psicologia e Psicanálise',
      'en-US': 'Psychology and Psychoanalysis',
    },
    subtitle: {
      'pt-BR': 'Universidade Anhanguera São Paulo',
      'en-US': 'Universidade Anhanguera São Paulo',
    },
    summary: {
      'pt-BR': 'Três anos e meio de Psicologia e formação em Psicanálise.',
      'en-US': 'Three and a half years of Psychology and training in Psychoanalysis.',
    },
    details: {
      'pt-BR':
        'Estudos em comportamento humano que hoje aplico na experiência do cliente, nas vendas consultivas e no desenvolvimento de soluções centradas no usuário.',
      'en-US':
        'Studies in human behavior that I now apply to customer experience, consultative sales and user-centered solutions.',
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
