import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/content/types'
import enUS from './locales/en-US.json'
import ptBR from './locales/pt-BR.json'

// Mesma chave lida pelo script inline do index.html.
export const LANGUAGE_STORAGE_KEY = 'lang'

// Garante em tempo de compilação que o en-US tem todas as chaves do pt-BR.
const enUSTranslation: typeof ptBR = enUS

function toLocale(lng: string | undefined): Locale {
  return lng?.toLowerCase().startsWith('en') ? 'en-US' : DEFAULT_LOCALE
}

i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = toLocale(lng)
})

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      'pt-BR': { translation: ptBR },
      'en-US': { translation: enUSTranslation },
    },
    supportedLngs: LOCALES,
    fallbackLng: DEFAULT_LOCALE,
    load: 'currentOnly',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
      // Só persiste a escolha manual (setLanguage); a detecção segue o navegador.
      caches: [],
      convertDetectedLanguage: toLocale,
    },
  })

export function getLanguage(): Locale {
  return toLocale(i18n.resolvedLanguage)
}

export function setLanguage(lng: Locale) {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lng)
  } catch {
    // Sem storage (modo privado): o idioma vale só para esta sessão.
  }
  void i18n.changeLanguage(lng)
}

export default i18n
