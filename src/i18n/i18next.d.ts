import 'i18next'
import type ptBR from './locales/pt-BR.json'

// Chaves de t() tipadas a partir do pt-BR (idioma de referência).
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    resources: { translation: typeof ptBR }
  }
}
