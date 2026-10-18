export const LOCALES = ['pt-BR', 'en-US'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'pt-BR'

// Texto de conteúdo nos dois idiomas (CLAUDE.md, seção 7).
export type Localized = Record<Locale, string>
