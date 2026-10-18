// Seções da one-page, na ordem do menu (CLAUDE.md, seção 1).
export const NAV_SECTIONS = [
  { id: 'inicio', labelKey: 'nav.home' },
  { id: 'sobre', labelKey: 'nav.about' },
  { id: 'projetos', labelKey: 'nav.projects' },
  { id: 'habilidades', labelKey: 'nav.skills' },
  { id: 'contato', labelKey: 'nav.contact' },
] as const

export type SectionId = (typeof NAV_SECTIONS)[number]['id']
