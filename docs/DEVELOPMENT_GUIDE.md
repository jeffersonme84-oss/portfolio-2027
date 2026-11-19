# Guia de desenvolvimento

Guia prático para você continuar evoluindo o portfólio sozinho, pelo VS Code.
Regra de ouro: **conteúdo fica em `src/content/` e textos da interface em `src/i18n/locales/`**.
Quase nunca é preciso mexer num componente para trocar um texto.

---

## 1. Primeiros passos

```bash
pnpm install     # uma vez, ou quando o package.json mudar
pnpm dev         # http://localhost:5173 — salve um arquivo e a página atualiza sozinha
```

Extensões recomendadas no VS Code: **ESLint**, **Prettier**, **Tailwind CSS IntelliSense** e **Vitest**.

Antes de cada commit, rode:

```bash
pnpm check       # lint + typecheck + testes + build
```

---

## 2. Para que serve cada pasta

| Pasta                      | O que tem                                                                                          | Você mexe quando…                    |
| -------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------ |
| `src/content/`             | Dados do site: projetos, trajetória, habilidades, depoimentos, contatos                            | quer mudar **conteúdo**              |
| `src/i18n/locales/`        | Textos fixos da interface (botões, títulos, rótulos) em `pt-BR.json` e `en-US.json`                | quer mudar um **texto da tela**      |
| `public/images/`           | Fotos e capas (`hero/`, `about/`, `projects/`, `testimonials/`)                                    | quer **trocar uma imagem**           |
| `public/cv/`               | PDFs do currículo                                                                                  | for publicar o **CV**                |
| `src/components/sections/` | Uma seção da página por arquivo (`Hero`, `About`, `Projects`, `Skills`, `Testimonials`, `Contact`) | quer mudar o **layout** de uma seção |
| `src/components/layout/`   | Header, Footer, toggles de tema e idioma, botões flutuantes                                        | quer mudar o cabeçalho ou o rodapé   |
| `src/components/retro/`    | Efeitos K7/VHS: abertura, contador, cursor, 404, sons                                              | quer mexer num **easter egg**        |
| `src/components/ui/`       | Peças genéricas: `dialog`, `sheet`, `pager`, `tilt-card`                                           | raramente                            |
| `src/hooks/`               | Lógica reutilizável (`useTheme`, `useLocale`, `useTypewriter`…)                                    | precisa de comportamento novo        |
| `src/lib/`                 | Funções sem tela: tema, animações, Supabase, formulário, visitas                                   | precisa de lógica nova               |
| `src/styles/`              | `tokens.css` (cores), `hero.css` (Home), `retro.css`, `boot.css`, `records.css`                    | quer ajustar **cores ou efeitos**    |
| `supabase/`                | Banco (migrations) e a função do formulário                                                        | for mexer no **back-end**            |
| `tests/`                   | Testes automatizados                                                                               | for criar ou ajustar testes          |
| `vite/`                    | Plugin que gera SEO e a política de segurança no build                                             | raramente                            |

---

## 3. Tarefas comuns (com exemplos reais)

### Mudar um texto da interface

Exemplo: o botão "Ver projetos".

1. Abra `src/i18n/locales/pt-BR.json` e procure (`Ctrl+F`) por `Ver projetos`.
2. Você acha `"seeProjects": "Ver projetos"` dentro de `"hero"`. A chave é `hero.seeProjects`.
3. Mude o texto. Faça o mesmo em `en-US.json`.

> Os dois arquivos precisam ter **as mesmas chaves**. Se faltar uma, `pnpm test` avisa.

### Atualizar informações profissionais e contatos

Arquivo: `src/content/site.ts`.

```ts
title: { 'pt-BR': 'Forward Deployed Engineer (FDE)', 'en-US': 'Forward Deployed Engineer (FDE)' },
email: 'seu-email@exemplo.com',
whatsappUrl: 'https://wa.me/5511961941984',
social: { linkedin: '...', github: '...', behance: '' }, // vazio = não aparece
hero: { stats: { technologies: 30, years: 2, degrees: 1, postAreas: 3 } }, // números da Home
```

### Publicar o currículo (botão "Baixar CV")

1. Coloque os arquivos em `public/cv/`, por exemplo `CV-Jefferson-Evangelista-pt-BR.pdf`.
2. Em `src/content/site.ts`, troque `null` pelo caminho:

```ts
cv: {
  'pt-BR': '/cv/CV-Jefferson-Evangelista-pt-BR.pdf',
  'en-US': '/cv/CV-Jefferson-Evangelista-en-US.pdf',
},
```

O botão aparece sozinho. O teste `toda imagem e PDF citado existe em public/` confere se o nome está certo.

### Trocar uma imagem

1. Exporte em **WebP** (menor que JPG/PNG), com largura até ~1600 px.
2. Salve em `public/images/<pasta>/`. **Mesmo nome = troca direta.** Nome novo = atualize o caminho no arquivo de `src/content/` que cita a imagem.
3. Tire os metadados (EXIF) antes de publicar: localização, câmera etc.

> A arte da Home (`public/images/hero/home-deft.jpg` e `home-deft-light.jpg`) tem textos e botões HTML posicionados por cima, nas coordenadas da arte (1376 × 768). Se a arte mudar de enquadramento, as posições em `src/components/sections/Hero.tsx` (função `at(...)`) precisam acompanhar.

### Adicionar um projeto

Arquivo: `src/content/projects.ts`. Copie um projeto existente e adapte:

```ts
{
  slug: 'meu-projeto',            // minúsculas e hífen; vira o link #projeto-meu-projeto
  title: { 'pt-BR': 'Meu Projeto', 'en-US': 'My Project' },
  summary: { 'pt-BR': 'Uma frase sobre o projeto.', 'en-US': 'One sentence about it.' },
  year: '2026',
  kind: { 'pt-BR': 'Web · solo', 'en-US': 'Web · solo' },
  cover: '/images/projects/meu-projeto.webp',
  technologies: ['react', 'supabase'],   // chaves de skills.ts (o TypeScript avisa se errar)
  deployUrl: 'https://...',              // opcional; vazio = botão desabilitado
  githubUrl: 'https://github.com/...',   // opcional
  caseStudy: {
    problem: { 'pt-BR': '...', 'en-US': '...' },
    process: { 'pt-BR': '...', 'en-US': '...' },
    result: { 'pt-BR': '...', 'en-US': '...' },
  },
},
```

Fotos extras nos slides: campo `gallery` (veja o projeto `sias-app`).

### Adicionar uma certificação

As certificações ficam na trajetória (seção Sobre), no item `id: 'certificacoes'` de `src/content/timeline.ts`. Acrescente a certificação nos campos `subtitle` (instituições) e `details` (lista), nos dois idiomas.

O destaque da Home ("Certificações AWS · Cisco") é texto da interface: chaves `hero.cert.title` e `hero.cert.sub` nos arquivos de `src/i18n/locales/`.

### Adicionar um item na trajetória (experiência, formação)

Arquivo: `src/content/timeline.ts`. Os itens vão do mais recente para o mais antigo. Campos: `id` (único), `type` (`work`, `education`, `certification`, `award`, `family`), `period`, `title`, `subtitle`, `summary`, `details` e, opcionalmente, `photo` + `photoAlt`.

### Adicionar uma habilidade

Arquivo: `src/content/skills.ts`.

1. Crie a entrada no catálogo `skills`: `docker: { name: 'Docker', icon: SiDocker, color: '#2496ED' }` (importe o ícone de `react-icons/si`).
2. Coloque a chave `'docker'` em um dos grupos de `hardSkillGroups`.

### Adicionar um depoimento

Arquivo: `src/content/testimonials.ts`. **Só publique com a autorização de quem escreveu.** Com a lista vazia, a seção some.

### Mudar uma cor

Arquivo: `src/styles/tokens.css`. A paleta fica no topo (`--palette-*`) e o resto do site deriva dela. A Home "DEFT." tem as próprias cores em `src/styles/hero.css` (`--deft-*`).

### Ligar ou desligar os easter eggs

`src/content/site.ts` → `easterEggs: true | false`.

---

## 4. Criar um componente novo

Exemplo: um selo "Disponível" reutilizável.

1. Crie `src/components/ui/AvailableBadge.tsx` (um componente por arquivo, nome em PascalCase):

```tsx
import { useTranslation } from 'react-i18next'

export function AvailableBadge() {
  const { t } = useTranslation()
  return (
    <span className="rounded-full border border-border px-3 py-1 font-mono text-xs">
      {t('hero.available')}
    </span>
  )
}
```

2. Use em qualquer seção: `import { AvailableBadge } from '@/components/ui/AvailableBadge'`.

Regras do projeto:

- **Nenhum texto fixo no componente**: use `t('chave')` ou um campo de `src/content/`.
- Estilo com classes do Tailwind e cores dos tokens (`bg-background`, `text-foreground`, `text-accent`).
- Animação só se respeitar animações reduzidas (variantes `motion-safe:` / `motion-reduce:`).
- `@/` aponta para `src/`.

---

## 5. Testes

```bash
pnpm test          # roda tudo uma vez
pnpm test:watch    # fica observando e roda de novo quando você salva
```

| Arquivo                      | O que confere                                                                        |
| ---------------------------- | ------------------------------------------------------------------------------------ |
| `tests/i18n.test.ts`         | pt-BR e en-US com as mesmas chaves, sem textos vazios, mesmas variáveis `{{...}}`    |
| `tests/content.test.ts`      | imagens e PDFs citados existem, textos nos dois idiomas, slugs únicos, links válidos |
| `tests/contact.test.ts`      | regras do formulário de contato                                                      |
| `tests/boot-and-seo.test.ts` | animação da fita sem `NaN` e a política de segurança (CSP)                           |

Para criar um teste novo, faça um arquivo `tests/<nome>.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { site } from '../src/content/site'

describe('site', () => {
  it('tem nome', () => {
    expect(site.name).not.toBe('')
  })
})
```

---

## 6. Gerar a versão de produção

```bash
pnpm build      # gera dist/
pnpm preview    # http://localhost:4173, com os mesmos cabeçalhos de segurança da Vercel
```

Abra o `preview` e confira o console do navegador (F12): ele deve ficar sem erros vermelhos.

---

## 7. Fluxo de Git

1. Crie uma branch: `git switch -c feat/minha-mudanca`.
2. Faça commits pequenos no padrão **Conventional Commits**: `feat(projects): adiciona projeto X`, `fix(i18n): corrige texto`, `docs: atualiza guia`.
3. Rode `pnpm check` antes de enviar.
4. `git push` e abra um pull request. A Vercel cria uma URL de prévia para você testar antes de juntar em `main`.

---

## 8. Problemas comuns

| Sintoma                                    | Causa provável                                                                                        |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| Texto aparece como `hero.algumaCoisa`      | A chave não existe no JSON do idioma ativo                                                            |
| Imagem quebrada                            | Caminho errado: deve começar com `/images/...` e o arquivo precisa estar em `public/images/`          |
| Animações não aparecem                     | O Windows está com "Efeitos de animação" desligados. Use o botão flutuante "Ativar animações" do site |
| Formulário diz "ainda não está disponível" | Faltam `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` (veja `docs/DEPLOYMENT.md`)                     |
| `pnpm build` falha com erro de tipo        | Rode `pnpm typecheck` e leia a primeira mensagem: ela indica arquivo e linha                          |
