import type { Localized } from './types'

export type HeroBook = {
  id: string
  title: Localized
  // Largura relativa da lombada (0–1): livros de tamanhos diferentes deixam a pilha natural.
  size: number
  tone: 'ink' | 'steel' | 'accent'
}

// Pilha de livros da Home: os temas que o Jefferson estuda e com que trabalha (timeline.ts).
// São temas, não títulos de livros reais. Para trocar: edite esta lista.
export const heroBooks: HeroBook[] = [
  {
    id: 'java',
    title: { 'pt-BR': 'Java & Spring Boot', 'en-US': 'Java & Spring Boot' },
    size: 0.92,
    tone: 'ink',
  },
  {
    id: 'cloud',
    title: { 'pt-BR': 'Cloud · AWS', 'en-US': 'Cloud · AWS' },
    size: 1,
    tone: 'steel',
  },
  {
    id: 'security',
    title: { 'pt-BR': 'Cibersegurança', 'en-US': 'Cybersecurity' },
    size: 0.86,
    tone: 'accent',
  },
  {
    id: 'data',
    title: { 'pt-BR': 'Banco de Dados · SQL', 'en-US': 'Databases · SQL' },
    size: 0.96,
    tone: 'ink',
  },
  {
    id: 'ai',
    title: { 'pt-BR': 'Inteligência Artificial', 'en-US': 'Artificial Intelligence' },
    size: 0.9,
    tone: 'steel',
  },
]
