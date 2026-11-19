import { existsSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { projects } from '../src/content/projects'
import { activeSocials, site } from '../src/content/site'
import { hardSkillGroups, skills, softSkills } from '../src/content/skills'
import { testimonials } from '../src/content/testimonials'
import { about, familyIllustration, timeline } from '../src/content/timeline'
import { LOCALES } from '../src/content/types'

// Testes do conteúdo que o Jefferson edita em src/content/. Pegam erros comuns de edição:
// imagem com o nome errado, texto faltando num idioma, slug repetido, link quebrado.

const publicDir = path.resolve(__dirname, '../public')

// Junta todas as strings de um objeto (recursivo).
function strings(value: unknown): string[] {
  if (typeof value === 'string') return [value]
  if (Array.isArray(value)) return value.flatMap(strings)
  if (value && typeof value === 'object') return Object.values(value).flatMap(strings)
  return []
}

// Encontra objetos com as chaves 'pt-BR' e 'en-US' (textos traduzidos).
function localized(value: unknown, where = ''): { where: string; text: Record<string, unknown> }[] {
  if (Array.isArray(value)) return value.flatMap((item, i) => localized(item, `${where}[${i}]`))
  if (!value || typeof value !== 'object') return []
  if ('pt-BR' in value || 'en-US' in value)
    return [{ where, text: value as Record<string, unknown> }]
  return Object.entries(value).flatMap(([key, child]) => localized(child, `${where}.${key}`))
}

const content = { site, projects, timeline, about, testimonials, softSkills, hardSkillGroups }

describe('conteúdo (src/content)', () => {
  it('toda imagem e PDF citado existe em public/', () => {
    const files = strings({ ...content, familyIllustration }).filter((text) =>
      /^\/(images|cv|audio)\//.test(text),
    )
    // srcSet: "/images/a.jpg 1376w, /images/b.jpg 2752w"
    const paths = files.flatMap((text) => text.split(',').map((part) => part.trim().split(' ')[0]))
    const missing = paths.filter((file) => !existsSync(path.join(publicDir, file)))
    expect(missing).toEqual([])
  })

  it('todo texto traduzido tem pt-BR e en-US preenchidos', () => {
    // site.cv fica null até o PDF existir (o botão "Baixar CV" some): é permitido.
    const texts = localized(content).filter(({ where }) => where !== '.site.cv')
    const problems = texts.flatMap(({ where, text }) =>
      LOCALES.filter((locale) => typeof text[locale] !== 'string' || text[locale] === '').map(
        (locale) => `${where} (${locale})`,
      ),
    )
    expect(problems).toEqual([])
  })

  it('slugs dos projetos e ids da trajetória não se repetem', () => {
    const slugs = projects.map((project) => project.slug)
    const ids = timeline.map((item) => item.id)
    expect(new Set(slugs).size).toBe(slugs.length)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('slugs servem para o link #projeto-<slug> (minúsculas, números e hífen)', () => {
    for (const project of projects) expect(project.slug).toMatch(/^[a-z0-9-]+$/)
  })

  it('o projeto em destaque da Home existe', () => {
    expect(projects.some((project) => project.slug === site.hero.featuredProject)).toBe(true)
  })

  it('as tecnologias dos projetos existem em skills.ts', () => {
    for (const project of projects) {
      for (const tech of project.technologies)
        expect(skills, `${project.slug}: ${tech}`).toHaveProperty(tech)
    }
  })

  it('links de contato e redes estão em formato válido', () => {
    expect(site.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    expect(site.whatsappUrl).toMatch(/^https:\/\/wa\.me\/\d{12,13}$/)
    for (const [network, url] of activeSocials()) expect(url, network).toMatch(/^https:\/\//)
  })

  it('links de deploy e GitHub dos projetos usam https', () => {
    for (const project of projects) {
      for (const url of [project.deployUrl, project.githubUrl].filter(Boolean)) {
        expect(url, project.slug).toMatch(/^https:\/\//)
      }
    }
  })
})
