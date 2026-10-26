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
  // Fotos extras, mostradas como miniaturas no detalhe (a principal é photo).
  morePhotos?: { src: string; alt: Localized }[]
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
// Itens parecidos foram agrupados para a trajetória caber em uma tela (pedido do Jefferson);
// as fotos extras de cada item aparecem como miniaturas no detalhe.
export const timeline: TimelineItem[] = [
  {
    id: 'verisure',
    type: 'work',
    // TODO(jefferson): no LinkedIn, Júnior (ago. 2024 – nov. 2025) e Pleno (jul. 2024 – abr. 2026) se sobrepõem; conferir as datas
    period: '2024 →',
    title: {
      'pt-BR': 'Líder de equipe · Executivo de vendas',
      'en-US': 'Team leader · Sales executive',
    },
    subtitle: { 'pt-BR': 'Verisure · São Paulo', 'en-US': 'Verisure · São Paulo' },
    summary: {
      'pt-BR': 'Liderança de vendas e segurança eletrônica com IA e IoT.',
      'en-US': 'Sales leadership and electronic security with AI and IoT.',
    },
    details: {
      'pt-BR':
        'Hoje lidero uma equipe de vendas: prospecção de negócios, treinamento de campo e gestão de KPIs para formar profissionais de alta performance. Antes, como executivo Júnior e Pleno, fiz vendas consultivas de alarmes inteligentes com demonstrações presenciais, além de instalação e manutenção de sistemas de segurança com IA e IoT, o que ampliou minha visão sobre automação e infraestrutura tecnológica.',
      'en-US':
        'I currently lead a sales team: business prospecting, field training and KPI management to develop high performers. Before that, as a Junior and Mid-level executive, I did consultative sales of smart alarms with in-person demos, plus installing and maintaining AI and IoT security systems, which broadened my view of automation and tech infrastructure.',
    },
    photo: '/images/about/editorial/retrato-carro.webp',
    photoAlt: {
      'pt-BR': 'Retrato casual de Jefferson',
      'en-US': 'Casual portrait of Jefferson',
    },
  },
  {
    id: 'pos-puc',
    type: 'education',
    period: '2025 →',
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
    morePhotos: [
      {
        src: '/images/about/editorial/formatura-familia.webp',
        alt: {
          'pt-BR': 'Jefferson de beca com a esposa e a filha na formatura',
          'en-US': 'Jefferson in a graduation gown with his wife and daughter',
        },
      },
    ],
  },
  {
    id: 'certificacoes',
    type: 'certification',
    period: '2022 – 2025',
    title: { 'pt-BR': 'Certificações', 'en-US': 'Certifications' },
    subtitle: {
      'pt-BR': 'AWS · Cisco · Fundação Bradesco · Centro Paula Souza',
      'en-US': 'AWS · Cisco · Fundação Bradesco · Centro Paula Souza',
    },
    summary: {
      'pt-BR': 'Nuvem, desenvolvimento, IA, segurança e IoT.',
      'en-US': 'Cloud, development, AI, security and IoT.',
    },
    details: {
      'pt-BR':
        'AWS Academy Cloud Foundations (2024) e Cloud Architecting (2025), com EC2, S3, RDS, Lambda e VPC. Inteligência Artificial Básico (Centro Paula Souza, 2025), JavaScript Essentials 1 (Cisco, 2024), Android no Android Studio (Fundação Bradesco, 2024), Front-End Básico (2024), Java Básico (Fundação Bradesco, 2022) e Conectar (Rocketseat, 2022). Linux Essentials (2022), Security+ Network Infrastructure (2024) e Arduino (2024). Inglês do A1 ao B2, em preparação para o C1.',
      'en-US':
        'AWS Academy Cloud Foundations (2024) and Cloud Architecting (2025), with EC2, S3, RDS, Lambda and VPC. Basic Artificial Intelligence (Centro Paula Souza, 2025), JavaScript Essentials 1 (Cisco, 2024), Android in Android Studio (Fundação Bradesco, 2024), Basic Front-End (2024), Basic Java (Fundação Bradesco, 2022) and Conectar (Rocketseat, 2022). Linux Essentials (2022), Security+ Network Infrastructure (2024) and Arduino (2024). English from A1 to B2, preparing for C1.',
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
    id: 'familia',
    type: 'family',
    period: '∞',
    title: { 'pt-BR': 'Família e valores', 'en-US': 'Family and values' },
    summary: lorem, // TODO(jefferson): preencher
    details: loremLong, // TODO(jefferson): preencher (valores, motivação e apoio)
    photo: '/images/about/editorial/familia-selfie.webp',
    photoAlt: {
      'pt-BR': 'Selfie de Jefferson com a esposa e a filha',
      'en-US': 'Selfie of Jefferson with his wife and daughter',
    },
    revealsIllustration: true,
    morePhotos: [
      {
        src: '/images/about/editorial/pai-e-filha-camisa14.webp',
        alt: {
          'pt-BR': 'Jefferson de costas, com camisa número 14, carregando a filha no colo',
          'en-US': 'Jefferson seen from behind in a number 14 shirt, carrying his daughter',
        },
      },
      {
        src: '/images/about/editorial/esposa-retrato.webp',
        alt: {
          'pt-BR': 'Retrato sorridente da esposa de Jefferson',
          'en-US': "Smiling portrait of Jefferson's wife",
        },
      },
    ],
  },
]

// Easter egg: versão em ilustração da família (usada sem alterações).
export const familyIllustration = '/images/about/ilustracao-familia-easteregg.webp'
