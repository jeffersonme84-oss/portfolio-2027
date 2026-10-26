import type { SkillKey } from './skills'
import type { Localized } from './types'

// Foto do projeto (slides do estudo de caso). phone = tela de celular (vertical); wide = paisagem.
export type ProjectImage = {
  src: string
  alt: Localized
  shape: 'phone' | 'wide'
}

export type Project = {
  slug: string
  title: Localized
  summary: Localized
  // Micro-texto mono do pôster (ano / tipo).
  year: string
  kind: Localized
  cover: string // /images/projects/<slug>.webp (placeholders em SVG até as capas reais)
  // Fotos para os slides do estudo de caso (na ordem: problema, processo, resultado, extras).
  gallery?: ProjectImage[]
  technologies: SkillKey[]
  deployUrl?: string
  githubUrl?: string
  caseStudy: {
    problem: Localized
    process: Localized
    result: Localized
  }
}

// Conteúdo extraído dos repositórios públicos de github.com/JeffersonEvangelista
// (README, package.json e linguagens). Só fatos documentados nos repositórios.
// TODO(jefferson): revisar os textos, descrever a sua parte nos projetos em equipe
// e trocar as capas (hoje placeholders em SVG).
export const projects: Project[] = [
  {
    slug: 'sias-app',
    title: { 'pt-BR': 'SIAS App', 'en-US': 'SIAS App' },
    summary: {
      'pt-BR': 'App mobile que agiliza o agendamento de entrevistas entre RH e candidatos.',
      'en-US': 'Mobile app that streamlines interview scheduling between HR and candidates.',
    },
    year: '2024',
    kind: { 'pt-BR': 'App mobile · equipe', 'en-US': 'Mobile app · team' },
    cover: '/images/projects/sias-app.webp',
    // Telas reais do app (github.com/JeffersonEvangelista/SiasApp, pasta img/).
    gallery: [
      {
        src: '/images/projects/sias-login.webp',
        alt: { 'pt-BR': 'Tela de login do SIAS App', 'en-US': 'SIAS App login screen' },
        shape: 'phone',
      },
      {
        src: '/images/projects/sias-home.webp',
        alt: {
          'pt-BR': 'Painel do RH com as entrevistas oferecidas e agendadas',
          'en-US': 'HR dashboard with offered and scheduled interviews',
        },
        shape: 'phone',
      },
      {
        src: '/images/projects/sias-chatbot.webp',
        alt: {
          'pt-BR': 'Botly, o assistente virtual do SIAS',
          'en-US': 'Botly, the SIAS virtual assistant',
        },
        shape: 'phone',
      },
      {
        src: '/images/projects/sias-agenda.webp',
        alt: { 'pt-BR': 'Agenda de entrevistas', 'en-US': 'Interview schedule' },
        shape: 'phone',
      },
      {
        src: '/images/projects/sias-chat.webp',
        alt: { 'pt-BR': 'Chat entre RH e candidato', 'en-US': 'Chat between HR and candidate' },
        shape: 'phone',
      },
      {
        src: '/images/projects/sias-cadastro.webp',
        alt: { 'pt-BR': 'Tela de cadastro do SIAS App', 'en-US': 'SIAS App sign-up screen' },
        shape: 'phone',
      },
      {
        src: '/images/projects/sias-config.webp',
        alt: {
          'pt-BR': 'Tela de configurações do SIAS App',
          'en-US': 'SIAS App settings screen',
        },
        shape: 'phone',
      },
      {
        src: '/images/projects/sias-banco.webp',
        alt: {
          'pt-BR': 'Diagrama do banco de dados do SIAS App',
          'en-US': 'SIAS App database diagram',
        },
        shape: 'wide',
      },
    ],
    technologies: ['reactNative', 'expo', 'typescript', 'supabase', 'firebase', 'gemini'],
    deployUrl: '',
    githubUrl: 'https://github.com/JeffersonEvangelista/SiasApp',
    caseStudy: {
      problem: {
        'pt-BR':
          'A gestão de entrevistas feita pelo RH exigia muitos contatos manuais com cada candidato para combinar data, horário e local, e os candidatos tinham pouco apoio para se preparar.',
        'en-US':
          'Interview management by HR required many manual contacts with each candidate to agree on date, time and place, and candidates had little support to prepare.',
      },
      // TODO(jefferson): acrescentar a sua contribuição no projeto em equipe
      process: {
        'pt-BR':
          'Projeto acadêmico em equipe que estende a versão web do SIAS para o celular. A equipe estruturou o sistema com o modelo de arquitetura C4 (contexto, contêineres, componentes e código) e construiu o app com React Native e Expo, usando Supabase e Firebase.',
        'en-US':
          'Team academic project that extends the SIAS web version to mobile. The team structured the system with the C4 architecture model (context, containers, components and code) and built the app with React Native and Expo, using Supabase and Firebase.',
      },
      result: {
        'pt-BR':
          'O RH envia solicitações detalhadas (data, horário e local) e o candidato acompanha, aceita ou recusa cada uma. Um chatbot responde dúvidas frequentes e tem um modo de treino com perguntas simuladas de entrevista.',
        'en-US':
          'HR sends detailed requests (date, time and place) and candidates track, accept or decline each one. A chatbot answers frequent questions and offers a training mode with simulated interview questions.',
      },
    },
  },
  {
    slug: 'estacao-esp32',
    title: { 'pt-BR': 'Estação ESP32', 'en-US': 'ESP32 Station' },
    summary: {
      'pt-BR': 'Monitoramento de temperatura e umidade via MQTT, com alarme de incêndio.',
      'en-US': 'Temperature and humidity monitoring over MQTT, with a fire alarm.',
    },
    year: '2024',
    kind: { 'pt-BR': 'IoT', 'en-US': 'IoT' },
    cover: '/images/projects/estacao-esp32.webp',
    // Simulação no Wokwi (github.com/JeffersonEvangelista/Automacao-em-Esp32-Mqtt-temperatura-, pasta Deft/).
    gallery: [
      {
        src: '/images/projects/esp32-simulacao.webp',
        alt: {
          'pt-BR': 'Código e circuito da estação ESP32 simulados no Wokwi',
          'en-US': 'ESP32 station code and circuit simulated on Wokwi',
        },
        shape: 'wide',
      },
      {
        src: '/images/projects/estacao-esp32.webp',
        alt: {
          'pt-BR': 'Circuito com ESP32, sensor DHT22, display LCD e LED',
          'en-US': 'Circuit with ESP32, DHT22 sensor, LCD display and LED',
        },
        shape: 'wide',
      },
      {
        src: '/images/projects/esp32-mqtt.webp',
        alt: {
          'pt-BR': 'Mensagens publicadas no broker MQTT',
          'en-US': 'Messages published to the MQTT broker',
        },
        shape: 'wide',
      },
    ],
    technologies: ['esp32', 'cpp', 'arduino', 'mqtt'],
    deployUrl: '',
    githubUrl: 'https://github.com/JeffersonEvangelista/Automacao-em-Esp32-Mqtt-temperatura-',
    caseStudy: {
      problem: {
        'pt-BR':
          'Acompanhar temperatura e umidade de um ambiente em tempo real e avisar rapidamente quando a temperatura indicar risco de incêndio.',
        'en-US':
          'Track the temperature and humidity of a room in real time and warn quickly when the temperature signals a fire risk.',
      },
      process: {
        'pt-BR':
          'Estação baseada em ESP32 com sensor DHT22, display LCD I2C, LED e buzzer piezoelétrico, programada em C++. Os dados são publicados em um broker MQTT e a hora local é sincronizada por NTP. O circuito foi simulado no Wokwi.',
        'en-US':
          'ESP32-based station with a DHT22 sensor, I2C LCD display, LED and piezo buzzer, programmed in C++. Data is published to an MQTT broker and local time is synced over NTP. The circuit was simulated on Wokwi.',
      },
      result: {
        'pt-BR':
          'O display mostra temperatura, umidade e hora, atualizados a cada 10 segundos. O LED acende fora da faixa de 10 °C a 50 °C, e acima de 60 °C o buzzer dispara como sirene de incêndio.',
        'en-US':
          'The display shows temperature, humidity and time, refreshed every 10 seconds. The LED lights up outside the 10 °C to 50 °C range, and above 60 °C the buzzer sounds like a fire siren.',
      },
    },
  },
  {
    slug: 'nutrisense',
    title: { 'pt-BR': 'NutriSense', 'en-US': 'NutriSense' },
    summary: {
      'pt-BR': 'App Android de acompanhamento nutricional com análise de fotos das refeições.',
      'en-US': 'Android app for nutrition tracking with meal photo analysis.',
    },
    year: '2025',
    kind: { 'pt-BR': 'App Android · equipe', 'en-US': 'Android app · team' },
    cover: '/images/projects/nutrisense.svg',
    technologies: ['android', 'java', 'firebase'],
    deployUrl: '',
    githubUrl: 'https://github.com/JeffersonEvangelista/App_Nutricionista',
    caseStudy: {
      problem: {
        'pt-BR':
          'Facilitar o acompanhamento nutricional personalizado, aproximando o paciente do nutricionista no dia a dia das refeições.',
        'en-US':
          'Make personalized nutrition tracking easier by bringing patients closer to their nutritionist in everyday meals.',
      },
      // TODO(jefferson): acrescentar a sua contribuição no projeto em equipe
      process: {
        'pt-BR':
          'Aplicativo Android em Java, com Firebase como banco de dados na nuvem e integração com serviços de reconhecimento de imagem para identificar alimentos. Projeto em equipe.',
        'en-US':
          'Android app in Java, with Firebase as the cloud database and integration with image recognition services to identify foods. Team project.',
      },
      result: {
        'pt-BR':
          'O usuário troca mensagens com o nutricionista e envia fotos das refeições para receber análises nutricionais, em uma interface de navegação simples.',
        'en-US':
          'Users message their nutritionist and send meal photos to receive nutritional analyses, in a simple, easy-to-navigate interface.',
      },
    },
  },
]
