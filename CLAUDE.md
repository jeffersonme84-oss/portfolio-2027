# CLAUDE.md — Portfólio de Jefferson Moreira Evangelista

> Guia de trabalho para o Claude Code. Leia este arquivo inteiro antes de qualquer tarefa.
> O site é construído **módulo por módulo**. Nunca avance para o próximo módulo sem concluir o atual
> (ver "Definition of Done" de cada módulo) e sem commitar.

---

## 1. Visão geral

- **Dono:** Jefferson Moreira Evangelista, desenvolvedor de sistemas.
- **Público principal:** **recrutadores**. Tudo deve ser escaneável em segundos: CV, LinkedIn e WhatsApp visíveis desde a primeira dobra, projetos como estudos de caso curtos, depoimentos em destaque.
- **Formato:** **one-page** com âncoras no menu (Início, Sobre, Projetos, Habilidades, Fale comigo). O estudo de caso de cada projeto abre em **modal** (dialog do shadcn/ui), com deep link opcional via `#projeto-<slug>`.
- **Idiomas:** português do Brasil (`pt-BR`, padrão) e inglês dos EUA (`en-US`).
- **Tema:** claro e escuro (dark mode).
- **Conceito visual:** estilo **editorial / pôster**, limpo e direto: tipografia gigante, muito espaço em branco, fundo liso, **uma única cor de acento**. A identidade **K7 (fita cassete), VHS e vinil** aparece no **layout, nas interações e em easter eggs, não na paleta de cores**, sempre **discreta** (ver seção 1.1).

## 1.1 Direção de design (referências do Jefferson)

As imagens de referência estão em `docs/referencias/`. **Abra e olhe cada uma antes de implementar a Home, o toggle e os Projetos.**

| Arquivo | O que seguir |
| --- | --- |
| `estilo-principal-editorial.jpg` | **Estilo principal do site.** Nome em tipografia gigante e pesada **atrás** do retrato recortado, fundo liso claro, uma cor de acento (laranja-avermelhado), micro-textos em caixa alta nos cantos (navegação, local e hora, número grande). |
| `home-estrutura.jpg` | Organização da primeira dobra: header enxuto (marca à esquerda, links à direita), texto curto, botão primário preenchido + botão secundário com contorno. **A forma "blob" amarela dessa referência NÃO é usada**; o estilo editorial acima a substitui. |
| `toggle-darkmode.jpg` | Toggle em formato de pílula com bolinha deslizante (sol / lua). **O mesmo componente** é usado para o seletor de idioma. |
| `projetos-galeria.jpg` | Projetos como **pôsteres emoldurados lado a lado**, em preto e branco, numa parede de galeria. |

### Princípio "limpo e direto, sem poluir"

- Uma ideia por tela. No máximo **um** elemento retro em destaque por seção.
- Muito espaço em branco; container de até ~1200px; grid de 12 colunas.
- Texto curto. Parágrafos mais longos só na seção Sobre.
- Proibidos: carrossel automático, parallax pesado, fundos animados, sombras exageradas, mais de 3 micro-textos mono por seção.
- Tudo o que for efeito (glitch, scanlines, grain) é **opt-in por interação** (hover, clique, easter egg), nunca contínuo, e desliga com `prefers-reduced-motion`.

### Tokens de design (ajustáveis em um só lugar: `src/styles/tokens.css`)

| Token | Claro | Escuro |
| --- | --- | --- |
| `--background` | `#E9EDF0` (cinza-azulado claro) | `#0D0D0D` |
| `--foreground` | `#111111` | `#F2F2F2` |
| `--accent` | `#FF3D14` (laranja-avermelhado) | `#FF5233` |
| `--muted` | `#5B6168` | `#9AA0A6` |

- O acento tem contraste de ~3:1 no fundo claro: usar **só em texto grande** (≥ 24px em negrito) e elementos gráficos. Texto pequeno sempre usa `--foreground`.
- Tipografia: **display** ultra-bold em caixa alta, `tracking` apertado (≈ -0.04em) e `line-height` ≈ 0.85 (sugestão: `@fontsource-variable/archivo`); **texto** em Inter; **detalhes retro** em JetBrains Mono. Máximo de 3 famílias.

## 2. Stack (padrão de todos os projetos do Jefferson)

| Camada | Tecnologia |
| --- | --- |
| Frontend | React + Vite + TypeScript (strict) |
| Estilo | Tailwind CSS + shadcn/ui |
| Backend | Supabase (Postgres + Auth + Edge Functions + Storage) |
| Deploy | Vercel |
| Versionamento | GitHub |

Bibliotecas complementares (aprovadas):

- `react-i18next` + `i18next` + `i18next-browser-languagedetector` (i18n)
- `next-themes` ou implementação própria com classe `dark` (tema)
- `framer-motion` (animações; sempre respeitar `prefers-reduced-motion`)
- `react-icons` (ícones de tecnologias via `react-icons/si`, UI via `lucide-react`)
- `react-hook-form` + `zod` (formulário de contato)
- `@vercel/analytics`
- `@supabase/supabase-js`

Não adicionar dependências novas sem justificar no commit.

## 3. Comandos

Gerenciador de pacotes: **pnpm**.

```bash
pnpm install        # instalar dependências
pnpm dev            # servidor de desenvolvimento (Vite)
pnpm build          # build de produção (tsc -b && vite build)
pnpm preview        # pré-visualizar o build
pnpm lint           # ESLint
pnpm format         # Prettier
pnpm typecheck      # tsc --noEmit -p tsconfig.app.json
pnpm exec supabase <cmd>   # CLI do Supabase (devDependency local, sem instalação global)
```

Antes de cada commit: `pnpm lint && pnpm typecheck && pnpm build` devem passar.

## 4. Fluxo de Git e deploy

- Repositório no **GitHub** do Jefferson. Branch principal: `main`.
- **Um commit (ou mais) por módulo concluído**, usando **Conventional Commits**:
  - `feat(home): adiciona hero com efeito máquina de escrever`
  - `fix(i18n): corrige fallback para en-US`
  - `chore(infra): configura eslint e prettier`
  - `docs: atualiza CLAUDE.md`
- Trabalhar em branch por módulo (`feat/modulo-home`) e abrir PR para `main`, ou commitar direto em `main` se o Jefferson pedir.
- **Deploy:** Vercel conectado ao GitHub **somente no Módulo 10**. Depois disso, cada push em `main` publica em produção e PRs geram preview. Até lá, a validação é local (`pnpm build` / `pnpm preview`).
- Nunca commitar `.env`, chaves ou o `service_role` do Supabase.

## 5. Estrutura de pastas

```
.
├── CLAUDE.md
├── docs/
│   └── referencias/         # imagens de referência de design (seção 1.1)
├── public/
│   ├── cv/
│   │   ├── CV-Jefferson-Evangelista-pt-BR.pdf
│   │   └── CV-Jefferson-Evangelista-en-US.pdf
│   ├── images/
│   │   ├── hero/            # retrato recortado da Home (+ candidatas)
│   │   ├── about/           # fotos pessoais e da família (timeline)
│   │   ├── projects/        # capas dos projetos
│   │   └── testimonials/    # fotos dos depoimentos
│   ├── audio/               # sons opcionais dos easter eggs (desligados por padrão)
│   └── og-image.png
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui
│   │   ├── layout/          # Header, Footer, ThemeToggle, LanguageSwitcher
│   │   ├── retro/           # componentes K7 / VHS / vinil reutilizáveis
│   │   └── sections/        # Home, About, Projects, Skills, Testimonials, Contact
│   ├── content/             # CONTEÚDO ESTÁTICO editável pelo Jefferson (ver seção 7)
│   │   ├── timeline.ts
│   │   ├── projects.ts
│   │   ├── skills.ts
│   │   ├── testimonials.ts
│   │   └── site.ts          # nome, e-mail, WhatsApp, redes (placeholders)
│   ├── i18n/
│   │   ├── index.ts
│   │   └── locales/
│   │       ├── pt-BR.json
│   │       └── en-US.json
│   ├── hooks/
│   ├── lib/                 # supabase client, utils, validators
│   ├── styles/
│   ├── App.tsx
│   └── main.tsx
├── supabase/
│   ├── migrations/
│   └── functions/
│       └── send-contact/
├── .env.example
└── package.json
```

## 6. Convenções de código

- TypeScript `strict`. Sem `any`; usar tipos em `src/content/types.ts`.
- Componentes funcionais, um por arquivo, nomes em `PascalCase`; hooks com prefixo `use`.
- Estilo apenas com Tailwind e tokens do shadcn/ui (variáveis CSS em `index.css`). Evitar CSS solto, exceto para efeitos retro (scanlines, grain), isolados em `src/styles/retro.css`.
- **Nenhum texto fixo em componentes.** Todo texto visível vem de `t('chave')` (i18n), exceto o conteúdo em `src/content/`, que usa campos `{ 'pt-BR': string; 'en-US': string }`.
- Acessibilidade: HTML semântico, `alt` descritivo, foco visível, contraste AA, navegação por teclado em timeline, modal e menu.
- Performance: imagens em WebP/AVIF, `loading="lazy"` fora da primeira dobra, dimensões explícitas para evitar layout shift. Meta: Lighthouse ≥ 90 em todas as categorias.
- Mobile-first. Testar em 360px, 768px e 1280px.

## 7. Regra de conteúdo: Lorem ipsum para o Jefferson preencher

O Jefferson preencherá o conteúdo real depois, **direto nos arquivos de `src/content/`**.
Portanto:

- Todo conteúdo ainda não fornecido deve ser **Lorem ipsum**, já com a estrutura completa de campos.
- Marcar cada ponto a preencher com o comentário `// TODO(jefferson): preencher`.
- Manter textos de exemplo dos dois idiomas (`pt-BR` e `en-US`).
- Dados de contato (e-mail, WhatsApp, redes) ficam em `src/content/site.ts` como placeholders (`seu-email@exemplo.com`, `https://linkedin.com/in/seu-perfil`, etc.).
- **Nunca inventar** fatos sobre a carreira, empresas, prêmios, certificações ou depoimentos como se fossem reais. Lorem é Lorem.

Exemplo de tipo para a timeline:

```ts
export type TimelineItem = {
  id: string;
  type: 'work' | 'education' | 'certification' | 'award' | 'family';
  period: string;                       // ex.: "2021 – 2024"
  title: { 'pt-BR': string; 'en-US': string };
  subtitle?: { 'pt-BR': string; 'en-US': string };   // empresa / instituição
  summary: { 'pt-BR': string; 'en-US': string };     // visível fechado
  details: { 'pt-BR': string; 'en-US': string };     // visível ao expandir
  photo?: string;                       // caminho em /images/about/
};
```

Exemplo de tipo para projetos:

```ts
export type Project = {
  slug: string;
  title: { 'pt-BR': string; 'en-US': string };
  summary: { 'pt-BR': string; 'en-US': string };
  cover: string;                        // /images/projects/<slug>.webp
  technologies: string[];               // chaves de skills.ts, ex.: 'react', 'supabase'
  deployUrl?: string;
  githubUrl?: string;
  caseStudy: {
    problem: { 'pt-BR': string; 'en-US': string };
    process: { 'pt-BR': string; 'en-US': string };
    result: { 'pt-BR': string; 'en-US': string };
  };
};
```

### Dados de contato (`src/content/site.ts`)

```ts
export const site = {
  name: 'Jefferson Moreira Evangelista',
  title: { 'pt-BR': 'Desenvolvedor de Sistemas', 'en-US': 'Systems Developer' }, // TODO(jefferson): confirmar título
  location: 'São Paulo, BR',
  timeZone: 'America/Sao_Paulo',
  email: 'seu-email@exemplo.com',                  // TODO(jefferson): preencher
  phoneDisplay: '(11) 96194-1984',
  whatsappUrl: 'https://wa.me/5511961941984',
  social: {
    linkedin: 'https://www.linkedin.com/in/jeffersonmevangelista/',
    instagram: 'https://www.instagram.com/jeffinhooficial20/',
    github: '',   // TODO(jefferson): preencher
    behance: '',  // opcional
    dribbble: '', // opcional
  },
  // Enquanto o PDF não existir, o botão "Baixar CV" fica oculto (null).
  cv: { 'pt-BR': null as string | null, 'en-US': null as string | null },
} as const;
```

Regras: redes com string vazia **não aparecem**; o botão "Baixar CV" só aparece quando o PDF do idioma ativo existir (o Jefferson vai atualizar o currículo depois).

### Conteúdo do LinkedIn

O LinkedIn bloqueia leitura automática, então o conteúdo (sobre, experiências, formação, certificações) **não foi importado**. O Jefferson vai colar o texto ou enviar o PDF do perfil. Até lá, `timeline.ts` segue em Lorem. Ao receber, mapear: *Sobre* → biografia, *Experiência* → itens `work`, *Formação* → `education`, *Licenças e certificados* → `certification`, *Prêmios* → `award`, *Recomendações* → `testimonials.ts` (apenas com autorização).

## 8. Fotos, ativos e privacidade

O Jefferson enviou as fotos. Elas estão no pacote `assets-portfolio.zip`, já com nomes finais. Copiar `public/` e `docs/` para a raiz do projeto.

### Mapa de ativos

| Arquivo (em `public/images/`) | Conteúdo | Uso |
| --- | --- | --- |
| `hero/hero-origem-terno-claro.webp` | Jefferson, terno cinza claro, rosto visível | **Hero (principal)**: remover o fundo e gerar `hero/jefferson-cutout.webp` |
| `hero/hero-alt-terno-preto.webp` | Terno preto, óculos escuros | Alternativa de hero (maior resolução) |
| `hero/hero-alt-oculos.webp` | Close com óculos escuros | Alternativa / detalhe |
| `about/fatec-formatura-solo.webp` | Formatura Fatec (Tecnologia) | Timeline: **Formação** |
| `about/formatura-familia.webp` | Formatura com esposa e filha | Timeline: **Formação / Família** |
| `about/familia-selfie.webp` | Selfie da família | Timeline: **Família / Valores** |
| `about/familia-restaurante.webp` | Família em um restaurante | Timeline: **Família** |
| `about/pai-e-filha-camisa14.webp` | Jefferson com a filha no colo (camisa "JEFFINHO 14") | Timeline: **Paixão / Motivação** |
| `about/esposa-retrato.webp` | Retrato da esposa | Timeline: **Apoio** |
| `about/filha-oculos.webp` | Filha de óculos escuros | Timeline: **Família** (ou easter egg) |
| `about/retrato-carro.webp` | Retrato casual | Uso livre na timeline |
| `about/ilustracao-familia-easteregg.webp` | Ilustração da família (estilo animação) | **Easter egg** (usar sem alterações) |
| `reserva/*` | Prints de tela de aplicativo | **Não usar assim**: precisam do arquivo original |

Dois itens ficaram **de fora do pacote de propósito**: uma foto sem camisa (print de aplicativo) e a repetida da camisa "JEFFINHO 14". Se o Jefferson quiser incluir a primeira, ele decide manualmente.

### Tratamento de imagens (já aplicado)

Todas as fotos do pacote passaram por um acabamento moderno que **não altera a geometria nem os traços do rosto**: correção de orientação, autocontraste leve (+7% de contraste, +5% de cor), tom sutil (sombras levemente frias, luzes levemente quentes), nitidez moderada, exportação em WebP e **remoção de EXIF**. A ilustração da família ficou sem tratamento. Os efeitos VHS (granulado, timecode, glitch) continuam sendo aplicados **em CSS**, nunca nos arquivos.

### Regras

- **Rostos intactos e reconhecíveis.** Nada de distorção, troca ou geração de rostos. Remover o **fundo** do retrato do hero não altera o rosto.
- Tratamentos permitidos: recorte, redimensionamento, granulado leve, tom VHS, preto e branco, vinheta. A ilustração da família entra como está.
- Resolução: o `hero-origem-terno-claro` é pequeno (723×1274 após o tratamento). A marca d'água de aplicativo já foi cortada, mas, se o Jefferson tiver o **original em alta resolução**, ele deve substituir o arquivo.
- **Privacidade:**
  - Fotos de familiares (esposa e filha) só vão para produção com a **autorização deles**; no caso da filha menor, evitar nome completo, escola e local.
  - Remover metadados **EXIF** (localização etc.) de todas as fotos antes de publicar.
  - A foto "camisa 14" mostra uma rua e uma van escolar ao fundo; considerar leve desfoque do fundo ou recorte.
- Legendas contextualizadas com a carreira (ex.: "Fatec · Tecnologia", "Formatura") ficam no `timeline.ts`, nos dois idiomas.

---

# MÓDULOS

Cada módulo tem objetivo, entregáveis e **Definition of Done (DoD)**.

## Módulo 0 — Infraestrutura

**Objetivo:** projeto base rodando, padronizado e publicável.

- Criar projeto com Vite (template React + TS), Tailwind e shadcn/ui.
- Configurar ESLint, Prettier, alias `@/` e `.env.example`.
- Criar repositório GitHub. (A conexão com a Vercel foi adiada para o Módulo 10.)
- Criar projeto Supabase e `src/lib/supabase.ts` (usa apenas `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`).
- Criar a estrutura de pastas da seção 5.

**DoD:** `pnpm build` passa; lint e typecheck limpos; código no GitHub. (Publicação na Vercel movida para o Módulo 10.)

## Módulo 1 — Tema e i18n

**Objetivo:** base de internacionalização e dark mode, usada por todos os outros módulos.

- **i18n:** `pt-BR` (padrão) e `en-US`. Detectar idioma do navegador, persistir a escolha em `localStorage`, `fallbackLng: 'pt-BR'`. Atualizar `<html lang>` ao trocar.
- **Componente `PillToggle`** (referência `toggle-darkmode.jpg`): pílula com bolinha deslizante (~200ms). No tema: ícones sol / lua. No idioma: rótulos **BR | US** (PT-BR / EN-US). Mesmo componente para os dois; `role="switch"` no tema e `role="radiogroup"` no idioma, `aria-label` traduzido, foco visível, operável por teclado.
- **Dark mode:** segue o sistema por padrão, com alternância manual (claro / escuro / sistema), persistida. Classe `dark` no `<html>`; sem flash de tema errado no carregamento.
- **Tokens e paleta** da seção 1.1 (`src/styles/tokens.css`), mapeados para as variáveis do shadcn/ui. Neutros + **um** acento. Os temas retro não definem cores próprias.
- Tipografia da seção 1.1: display ultra-bold, Inter para texto, JetBrains Mono para detalhes retro.

**DoD:** alternar idioma e tema funciona e persiste após recarregar; sem texto fixo nos componentes; sem flash de tema.

## Módulo 2 — Layout, Header e Footer

**Objetivo:** esqueleto da página one-page, no estilo editorial das referências.

- **Header fixo e enxuto** (transparente sobre a Home, com fundo sólido após o scroll):
  - Esquerda: marca "Jefferson Moreira Evangelista" (ou monograma "JME").
  - Links em caixa alta pequena: Início, Sobre, Projetos, Habilidades, Fale comigo (scroll suave e destaque da seção ativa).
  - Direita: `PillToggle` de **tema**, `PillToggle` de **idioma** e botão **"Baixar CV"** (CTA, PDF conforme o idioma ativo).
  - Mobile: menu em sheet (shadcn/ui).
- **Footer:** redes, direitos autorais, "voltar ao topo".
- Botões flutuantes pequenos de **WhatsApp** e **LinkedIn** (links reais vindos de `site.ts`).
- **Detalhe retro (só um):** contador de fita em mono pequeno (ex.: `0042`) que acompanha o scroll.

**DoD:** navegação funciona em desktop e mobile; links de CV, WhatsApp e LinkedIn funcionam com o mínimo de cliques; foco por teclado correto.

## Módulo 3 — Home (Hero)

**Objetivo:** primeira dobra editorial que diz quem sou, a especialidade e leva à ação. Referências: `estilo-principal-editorial.jpg` (visual) e `home-estrutura.jpg` (organização dos CTAs).

**Layout (desktop):**
- Fundo liso (`--background`), **sem foto de fundo cheia**.
- **Retrato recortado** (`hero/jefferson-cutout.webp`, fundo transparente) centralizado, com a base encostada na base da dobra e o **rosto inteiro visível**.
- **Nome gigante atrás do retrato**, em display ultra-bold, com **efeito máquina de escrever** (digita letra a letra, cursor piscando):
  - Linha 1: "JEFFERSON", ocupando ~90% da largura.
  - Linha 2 (menor): "MOREIRA EVANGELISTA".
  - A cabeça sobrepõe o nome como na referência, mas o texto deve continuar legível (nunca cobrir mais de ~35% das letras).
  - Com `prefers-reduced-motion`: texto já completo, sem digitação.
- **Micro-textos nos cantos** (mono, caixa alta, 10–12px, **máximo 4**):
  - Superior esquerdo: "Desenvolvedor de Sistemas" e "São Paulo, BR — 08:00 PM" (**hora ao vivo**, `Intl.DateTimeFormat` com `America/Sao_Paulo`).
  - Superior direito: mini-índice (Sobre · Projetos · Habilidades · Contato).
  - Inferior esquerdo: número grande (anos de experiência, `00` em Lorem) com rótulo.
  - Inferior direito: **headline** curta em 2 a 3 linhas (placeholder, ex.: "Sistemas sólidos. Web com propósito."), dentro de um **rótulo de fita K7** discreto, que é o único elemento retro da dobra.
- **CTAs:** "Ver projetos" (primário, preenchido com acento), "Baixar CV" (secundário, contorno) e links de texto "Fale comigo" e LinkedIn.
- **Mobile:** nome empilhado, retrato centralizado, no máximo 2 micro-textos.

**Retrato:** a foto `hero/hero-origem-terno-claro.webp` já está tratada (cor, nitidez, sem EXIF). Falta o **recorte do fundo** (`hero/jefferson-cutout.webp`). Um teste automático simples deixou resíduos (braço de outra pessoa na foto), então fazer o recorte localmente com `rembg` (`pip install "rembg[cpu]"`, modelo `u2net_human_seg`) e revisar as bordas à mão. Remover **apenas o fundo**; o rosto não pode ser alterado. Enquanto o recorte não existir, usar a foto com máscara em gradiente como fallback.

**Easter egg:** clicar nos carretéis do rótulo faz girar; duplo clique "rebobina" a digitação do nome.

**DoD:** hero cabe na primeira dobra em 360px e 1280px; contraste correto nos dois temas; CTAs funcionam; nada de texto fixo; hora ao vivo correta.

## Módulo 4 — Sobre (Timeline VHS)

**Objetivo:** contar a trajetória em **timeline interativa e limpa**, com estética de VHS discreta.

- Conteúdo em `src/content/timeline.ts` (Lorem), cobrindo:
  - **Biografia resumida:** trajetória, anos de experiência, paixão pela área.
  - **Valores e diferenciais:** o que motiva e como ajuda empresas.
  - **Provas sociais / conquistas:** prêmios, certificações, marcas relevantes.
- **Timeline vertical** com linha fina central; cada item é clicável e **expande** (accordion animado) mostrando detalhes e foto. Navegável por teclado (`Enter`/`Espaço`, setas). Só um item aberto por vez.
- **Fotos** conforme o mapa de ativos da seção 8, contextualizadas com a carreira. Sugestão de uso (textos em Lorem):
  - Formação (Fatec · Tecnologia): `fatec-formatura-solo`, `formatura-familia`
  - Valores e motivação (família): `familia-selfie`, `familia-restaurante`, `pai-e-filha-camisa14`
  - Apoio: `esposa-retrato`
  - Retratos soltos: `retrato-carro`, `filha-oculos`
- **Estética VHS (discreta):**
  - Foto com moldura fina de "frame de fita", granulado leve e **timecode** mono pequeno (ex.: `PLAY ▶ 00:14:32`).
  - Item aberto mostra "PLAY ▶"; fechados mostram "PAUSE ❚❚". Indicador `● REC` sutil só no título da seção.
  - **Tracking glitch** curto apenas no hover da foto (desligado com `prefers-reduced-motion`).
- **Easter egg:** clicar 3 vezes numa foto da família revela `ilustracao-familia-easteregg.webp` (versão em ilustração), com legenda "versão animada".

**DoD:** todos os itens abrem e fecham; rostos intactos; funciona só com Lorem; acessível por teclado; no máximo um efeito retro visível por vez.

## Módulo 5 — Projetos (Galeria + Estudos de caso)

**Objetivo:** vitrine de projetos como uma **galeria de pôsteres**, em que cada projeto conta a sua história. Referência: `projetos-galeria.jpg`.

- Conteúdo em `src/content/projects.ts` (Lorem, 3 projetos de exemplo).
- **Galeria:** projetos lado a lado (3 por linha no desktop, 1 no mobile) sobre uma "parede" lisa e escura (também no tema claro, como contraste de seção). Opcional: gradiente suave no topo imitando a luz de teto da referência.
- **Pôster:** proporção 2:3, **moldura fina** (1–2px), capa em **preto e branco por padrão** e colorida no hover / foco. O título do projeto aparece em display sobre a capa e um micro-texto mono (ano / tipo).
- **Abaixo de cada pôster** (fora da moldura): ícones das tecnologias usadas e **2 botões**: **Deploy** e **GitHub** (nova aba, `rel="noopener noreferrer"`; com URL vazia o botão fica desabilitado).
- **Estudo de caso (modal):** clicar no pôster abre dialog com **Problema → Processo de criação → Resultado final**, tecnologias e botões. Fechar com `Esc`, foco preso no modal, deep link `#projeto-<slug>`.
- Sem elementos de vinil aqui, para manter a seção limpa.

**DoD:** galeria e modal funcionam com Lorem; botões respeitam URLs vazias; responsivo; nenhum texto fixo; acessível por teclado.

## Módulo 6 — Habilidades e Ferramentas

**Objetivo:** mostrar competências de forma visual.

- Conteúdo em `src/content/skills.ts`.
- **Hard Skills** agrupadas (Frontend, Backend, Banco de dados, DevOps/Deploy, Ferramentas, Idiomas), cada uma com **ícone da tecnologia** (`react-icons/si`) e nome. Incluir ao menos: React, TypeScript, Vite, Tailwind CSS, shadcn/ui, Supabase, PostgreSQL, Vercel, Git, GitHub (a lista completa fica para o Jefferson ajustar).
- **Soft Skills** (resolução de problemas, comunicação, gestão de tempo, etc.) com ícone `lucide-react` e frase curta.
- Ícones herdam a cor do texto do tema (monocromáticos), mantendo o visual limpo; cor da marca só no hover.
- **Layout (discreto):** cada grupo é uma "**caixa de discos**" / prateleira de fitas: ícones como lombadas de K7 em linha, com leve inclinação ao hover.

**DoD:** todos os ícones renderizam em claro e escuro; textos traduzidos; adicionar uma skill exige editar só `skills.ts`.

## Módulo 7 — Depoimentos (provas sociais)

**Objetivo:** gerar confiança imediata.

- Conteúdo em `src/content/testimonials.ts` (Lorem; o Jefferson **tem** depoimentos reais e preencherá depois).
- Campos: foto, nome, cargo, empresa, texto curto, link opcional (LinkedIn).
- Apresentação: carrossel simples ou grid de 3 cards, com texto curto e legível.
- **Estética:** cada depoimento como um "**rótulo de fita**" manuscrito (fonte monoespaçada, linhas de caderno), discreto.
- Só publicar depoimentos reais com autorização de quem escreveu.

**DoD:** seção funciona com 0, 1 e N itens (se vazia, é ocultada); sem texto fixo.

## Módulo 8 — Fale comigo (Contato)

**Objetivo:** contato direto com o mínimo de atrito.

- **Formulário:** nome, e-mail, mensagem (`react-hook-form` + `zod`), mensagens de erro traduzidas, estados de enviando / sucesso / erro, campo **honeypot** anti-spam.
- **Informações diretas:** e-mail profissional, WhatsApp (link `https://wa.me/<numero>`), telefone opcional (de `site.ts`).
- **Redes:** LinkedIn, GitHub, Behance, Instagram, Dribbble (exibir só as preenchidas).
- **Botão "Baixar CV"** (PDF no idioma ativo) e botão de WhatsApp visíveis também aqui.

**Backend (Supabase):**
- Tabela `contact_messages` (`id`, `name`, `email`, `message`, `locale`, `created_at`) com **RLS ativa**: o papel `anon` pode apenas `INSERT`; ninguém lê pelo cliente.
- **Edge Function `send-contact`:** valida os dados (zod), aplica limite de taxa simples, grava no Postgres e envia o e-mail ao Jefferson via **Resend**. O cliente chama a função, nunca grava direto.
- Segredos (`RESEND_API_KEY`, `CONTACT_TO_EMAIL`) apenas no Supabase (`supabase secrets set`), nunca no front.

**Layout vinil (discreto):** o botão de enviar é uma **agulha de toca-discos**; ao enviar, um disco gira durante o loading.

**DoD:** envio grava no Postgres e chega por e-mail; falha mostra erro amigável; spam básico bloqueado; sem segredos no repositório.

## Módulo 9 — Easter eggs e interações retro

**Objetivo:** consolidar a identidade K7 / VHS / vinil sem poluir o layout.

Lista inicial (ajustar com o Jefferson):

- **Konami Code** (↑↑↓↓←→←→BA): ativa por alguns segundos um modo "**VHS tracking**" na página inteira, com ruído e linhas horizontais, depois volta ao normal.
- **Clique no logo 5 vezes:** animação de "REW ⏪" e rolagem de volta ao topo, com contador de fita girando.
- **Console do navegador:** mensagem ASCII de uma fita K7 com um recado para recrutadores e link do GitHub.
- **Página 404:** tela de VHS "NO SIGNAL" / barras de cor em tons neutros, com botão "Voltar ao início".
- **Som opcional:** cliques de botão de K7 (play / stop / rewind) e agulha de vinil, **desligados por padrão**, com botão de mutar visível. Nunca tocar áudio automaticamente.

Regras: todo efeito animado respeita `prefers-reduced-motion`; nenhum easter egg bloqueia conteúdo ou navegação; componentes reutilizáveis ficam em `src/components/retro/`.

**DoD:** easter eggs funcionam e podem ser desativados; página continua rápida e acessível.

## Módulo 10 — SEO, analytics e lançamento

- `<title>`, `<meta description>`, Open Graph e Twitter Card por idioma; `og-image.png`.
- `favicon` (ícone de fita ou vinil minimalista), `robots.txt`, `sitemap.xml`.
- JSON-LD `Person` com nome, cargo e links.
- **Deploy na Vercel:** importar `portfolio-2027` (preset Vite, `pnpm install`, `pnpm build`, saída `dist`, raiz do repositório), cadastrar `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` em Environment Variables e validar a URL de produção.
- **Vercel Analytics** (`@vercel/analytics`).
- Auditoria: Lighthouse ≥ 90, checagem de contraste e navegação por teclado.
- Domínio próprio: **a definir** (configurar na Vercel quando houver).
- Checklist final: autorização das fotos da família, EXIF removido, CVs em PDF enviados, placeholders substituídos, nenhum `TODO(jefferson)` remanescente.

**DoD:** site em produção na Vercel, com checklist final concluído.

---

## 9. Como o Claude deve trabalhar neste projeto

1. **Um módulo por vez**, na ordem 0 → 10. Antes de começar, resumir em 3 a 5 linhas o que será feito.
2. Ao terminar: rodar `pnpm lint && pnpm typecheck && pnpm build`, listar o que foi entregue, o que ficou pendente e **commitar** com Conventional Commits.
3. Não alterar módulos já concluídos sem avisar e explicar o motivo.
4. Em dúvida sobre conteúdo, **usar Lorem ipsum + `TODO(jefferson)`** em vez de inventar.
5. Em dúvida sobre decisão de design ou arquitetura, escolher a opção mais simples que atenda ao pedido e registrar a decisão na seção 10.
6. Nunca expor chaves, nunca desativar RLS, nunca desligar regras de acessibilidade para "ficar mais bonito".

## 10. Pendências e decisões

**A definir pelo Jefferson**
- [x] Recorte do hero gerado com `rembg` (`hero/jefferson-cutout.webp`). Pendente: **original em alta resolução** para refazer o recorte com mais nitidez
- [ ] Arquivos originais no lugar dos prints de tela da pasta `reserva/`
- [ ] Título profissional exato (placeholder: "Desenvolvedor de Sistemas")
- [ ] E-mail profissional e GitHub (telefone, WhatsApp, LinkedIn e Instagram já estão em `site.ts`)
- [ ] Conteúdo do LinkedIn (colar o texto ou enviar o PDF do perfil)
- [ ] CVs em PDF (`pt-BR` e `en-US`)
- [ ] Fotos (hero, pessoais, família) e **confirmação de autorização dos familiares**
- [ ] Conteúdo real: timeline, projetos, habilidades finais e depoimentos
- [ ] Domínio próprio
- [ ] Intensidade final dos efeitos retro (ajustar após ver o site rodando)
- [ ] Capas reais dos projetos (hoje placeholders abstratos em SVG em `public/images/projects/`)
- [ ] Publicar o backend do contato (ver "Lançamento" abaixo) e testar o envio real (grava no Postgres + e-mail)
- [ ] Revogar o Access Token `sbp_…` e trocar a senha do banco do Supabase (foram expostos no chat)

**Decisões já tomadas**
- Estilo principal: **editorial / pôster** (referência `estilo-principal-editorial.jpg`); o blob amarelo da referência `home-estrutura.jpg` não é usado.
- Cor de acento: **laranja-avermelhado** (`#FF3D14`), **aprovada** pelo Jefferson; trocável em `tokens.css`.
- Home: retrato recortado com nome gigante atrás, em vez de foto de fundo cheia.
- Toggle de tema e de idioma: o mesmo `PillToggle` (referência `toggle-darkmode.jpg`).
- Projetos: galeria de pôsteres em P&B (referência `projetos-galeria.jpg`).
- Público: recrutadores.
- Formato: one-page com âncoras; estudo de caso em modal.
- Conteúdo: estático no repositório (`src/content/`), **sem painel admin**, por ser a opção mais simples e rápida; Supabase usado para o formulário de contato (e, se necessário, Storage no futuro).
- Idiomas: `pt-BR` (padrão) e `en-US`.
- Estética retro (K7, VHS, vinil): no **layout e em interações / easter eggs**, não nas cores.
- Deploy na Vercel; código versionado no GitHub com Conventional Commits.
- Repositório: `jeffersonme84-oss/portfolio-2027` (privado), com o projeto na raiz de `Portfolio 2027`. A cópia antiga em `portfolio-jefferson/` (git próprio, 3 commits) fica só no disco, ignorada.
- Fotos com familiares já estão versionadas: o repositório deve continuar **privado** até a autorização deles.

**Desvios técnicos (Módulo 0)**

| Tema | Previsto | Como ficou | Motivo |
| --- | --- | --- | --- |
| Versões | não especificadas | React 19, Vite 6, TypeScript 5.7, Tailwind **v4** (`@tailwindcss/vite`, sem `tailwind.config`), shadcn/ui `new-york` | versões estáveis atuais; Tailwind v4 dispensa arquivo de config |
| Variáveis do shadcn/ui | em `index.css` (seção 6) | `index.css` só importa Tailwind; tokens e estilos base (`bg-background`, `border-border`) vão para `src/styles/tokens.css` no Módulo 1 | o build quebrava com utilitários sem token definido |
| pnpm | via corepack | pnpm 10.34.7 instalado com `npm i -g pnpm`; fixado em `packageManager` | o corepack local (0.29.4) falha na verificação de assinatura |
| Build scripts | — | `pnpm.onlyBuiltDependencies: ['esbuild', 'supabase']` no `package.json` | o pnpm 10 bloqueia postinstall por padrão |
| `typecheck` | `tsc --noEmit` | `tsc --noEmit -p tsconfig.app.json` | o `tsconfig.json` raiz só tem references |
| Supabase CLI | não previsto | `supabase` 2.121 como **devDependency**; `supabase/config.toml` gerado por `supabase init` | migrations e edge functions (Módulo 8) sem CLI global |
| Supabase | `src/lib/supabase.ts` | `getSupabase()` retorna `null` sem `VITE_*` (antes lançava erro) e carrega o `supabase-js` sob demanda (Módulos 8 e 10) | não derrubar o site sem env; tirar o `supabase-js` da primeira dobra |
| `.env` | `.env.example` | `.env.example` só com os nomes; valores reais em `.env.local` (ignorado) | nunca versionar valores |
| Lint/format | padrão | ESLint e Prettier ignoram `portfolio-jefferson/`, `assets-portfolio/`, `FOTOS/`, `teste-permissao/`, `.pnpm-store/` | pastas de origem e a cópia antiga ficam na raiz |
| Nome do pacote | — | `portfolio-2027` (renomeado no Módulo 10) | herdado da cópia antiga |

**Status do Módulo 0: concluído** (commits `afd1581`, `a04fd7e`): código, lint, typecheck e build OK, código no GitHub. Deploy na Vercel e variáveis `VITE_*` na Vercel ficam para o Módulo 10, por decisão do Jefferson. `supabase link` só é necessário no Módulo 8.

**Desvios e decisões (Módulos 1 a 10)**

| Módulo | Decisão | Motivo |
| --- | --- | --- |
| 1 | Paleta em `--palette-*` no topo de `tokens.css`; os nomes do shadcn (`--background`, `--accent`, `--muted`…) derivam dela. O `--muted` da seção 1.1 virou `--muted-foreground` (texto); `--muted` é superfície | no shadcn, `--muted` é cor de fundo |
| 1 | Texto sobre o acento é sempre `#111` (`--primary-foreground`); erros (`--destructive`) derivam do acento escurecido | contraste AA sem criar outra cor |
| 1 | Tema próprio (sem `next-themes`): `src/lib/theme.ts` + script inline no `index.html`; botão extra para voltar a "seguir o sistema" | opção mais simples; o switch só tem 2 estados |
| 1 | Idioma detectado do navegador; só a escolha manual é salva (`lang`) | não "congelar" o idioma detectado |
| 1 | Fontes auto-hospedadas via `@fontsource-variable` (Archivo, Inter, JetBrains Mono) | sem requisição a terceiros |
| 2 | Destaque do menu calculado a cada scroll lendo o DOM (sem IntersectionObserver) | o observer perdia seções recriadas |
| 3 | `framer-motion` não foi usado: animações em CSS (`retro.css`, transições Tailwind) | menos JS; tudo desliga com reduced motion |
| 3 | Mão de outra pessoa à direita do retrato esmaecida no recorte; sem recorte, a foto entra com máscara radial | resíduo citado no Módulo 3 |
| 4 | Fotos tratadas em `public/images/about/editorial/` (originais preservados): recorte 4:5, escala uniforme, cores sóbrias, pretos de filme; fundo desfocado na foto da camisa 14. **Rosto sem deformação** | pedido do Jefferson: fotos no tema do site, mantendo o rosto |
| 4 | Foto da timeline só é montada após abrir o item | não baixar ~750 kB de fotos escondidas |
| 5 | Campos `year` e `kind` em `Project` (micro-texto do pôster); tokens `--wall*` para a parede escura | exigidos pelo layout do Módulo 5 |
| 5 | `technologies` tipado como `SkillKey` (chaves de `skills.ts`) | erro de build se a chave não existir |
| 6 | Idiomas como itens de `skills.ts` com ícone `Languages` | adicionar skill continua exigindo só `skills.ts` |
| 7 | Seção "Depoimentos" (`#depoimentos`) entre Habilidades e Fale comigo, fora do menu | o menu segue a seção 1 |
| 8 | Dependências extras: `@hookform/resolvers` e `@radix-ui/react-dialog` (base do Dialog/Sheet) | ligar zod ao react-hook-form; shadcn usa Radix |
| 8 | A Edge Function grava **como anon** (sem `service_role`), respeitando a RLS; falha no e-mail não perde a mensagem (já salva) | regra de nunca usar `service_role` |
| 8 | Limite de taxa em memória da instância (5 envios / 10 min por IP) | "limite de taxa simples" |
| 9 | Sons sintetizados com WebAudio (sem arquivos em `public/audio/`); `site.easterEggs` desliga todos os easter eggs | sem downloads extras; desativável num só lugar |
| 9 | `vercel.json` reescreve rotas desconhecidas para o app, que mostra a 404 "SEM SINAL" | SPA sem roteador |
| 10 | URL pública em `VITE_SITE_URL` (env); plugin no `vite.config.ts` gera JSON-LD, meta tags, preload do retrato, `robots.txt` e, com URL, canonical e `sitemap.xml` | domínio indefinido; dados vêm de `site.ts` sem duplicar |
| 10 | Seções abaixo da dobra e o formulário em chunks lazy; `<Analytics />` só com `VITE_VERCEL_ENV` (exposto pela Vercel) | bundle inicial 241 → 135 kB gzip; evita 404 fora da Vercel |
| 10 | Lighthouse (build local, antes da nova Home): desktop 100/100/100/100; mobile simulado 88/100/100/100. Para mobile ≥ 90 estável seria preciso pré-renderizar o HTML (SSG) | o custo restante é executar o React antes do primeiro paint |

**Atualização da Home (pedido do Jefferson, 2026-10-18)**

| Decisão | Motivo |
| --- | --- |
| ~~Robô futurista em primeiro plano~~ (substituído na 2ª atualização, abaixo). Original guardado em `docs/assets-originais/robo-futurista-original.webp`; as variantes saíram de `public/` | histórico |
| O retrato recortado (`jefferson-cutout.webp`) sai da Home, mas continua na `og-image.png` | compartilhamento com foto real |
| Digitação só do último sobrenome (EVANGELISTA), uma única vez, cursor vertical no acento; JEFFERSON MOREIRA estável; texto completo no `<h1>` (sr-only) e letras visuais `aria-hidden`; duplo clique nos carretéis repete a digitação | pedido do Jefferson; acessibilidade |
| `src/components/ui/kinetic-matrix.tsx`: malha de nós com pulsos, ondas de impacto (clique em área livre) e reação ao ponteiro. **Exceção autorizada** à regra "sem fundos animados", com limites: canvas transparente atrás do conteúdo (`pointer-events: none`), máscara que esvazia o centro, cores dos tokens do tema (+ azul do robô), começa só após `load`/ocioso, pausa fora da tela e com a aba oculta, 30 fps e menos nós no celular, quadro estático com reduced motion. O código original do KineticMatrix não foi enviado; o componente foi escrito a partir da descrição | pedido do Jefferson, sem perder legibilidade e desempenho |
| `useActiveSection` lê o DOM num listener de scroll com `requestAnimationFrame` (antes lia durante o render e forçava reflow) | performance |
| Lighthouse com o robô: desktop 99/100/100/100; mobile 75–90 (mediana ~80) / 100 / 100 / 100 | histórico |
| Neste computador, o Windows está com "Efeitos de animação" desligados, o que ativa `prefers-reduced-motion`: a digitação e a malha aparecem estáticas. Para ver as animações, ligue em Configurações → Acessibilidade → Efeitos visuais | comportamento correto de acessibilidade |

**2ª atualização da Home e dos Projetos (pedido do Jefferson, 2026-10-18)**

| Decisão | Motivo |
| --- | --- |
| Fundo da Hero: foto do Jefferson programando (`public/images/hero/dev-futurista-{800,1600}.webp`, em `site.hero.background`), começando abaixo do nome, com desfoque de 2 px, véu de 55% na cor do fundo e degradês nas bordas (CSS). **Exceção autorizada** à regra de não usar foto de fundo cheia e à de geração de rostos (imagem gerada e enviada por ele). Original em `docs/assets-originais/dev-futurista-original.webp` | pedido: fundo "não muito focado", sem perder a legibilidade |
| Ajuste (mesmo dia): a foto ficou nítida (sem desfoque), menor e inteira (no desktop, enquadrada em até 58 rem, `object-contain`), com véu de 10% e bordas dissolvidas por máscara radial | pedido: imagem estava "muito opaca" |
| KineticMatrix ganhou paralaxe 3D (nós em camadas de profundidade) e destaque mais visível. Com reduced motion, nada se move sozinho, mas as reações ao ponteiro (hover e clique) funcionam e o loop para quando a malha volta ao repouso | o Windows do Jefferson ativa reduced motion e as interações pareciam quebradas |
| Foto da Hero cobre a Home toda (object-cover), nítida, com o rosto centralizado na tela; véus em degradê só no topo (nome), laterais (micro-textos, desktop) e base (CTAs) | pedido: a foto estava "muito embaixo" |
| Botão flutuante "Ativar animações" (`src/lib/motion.ts`, classe `.reduce-motion` no <html>): segue o sistema por padrão, mas o visitante pode ligar/reduzir e a escolha fica salva. Variantes `motion-safe`/`motion-reduce` do Tailwind e o `retro.css` passam a seguir essa classe | o Claude não altera configurações do Windows; o Jefferson liga as animações pelo próprio site |
| Menu do header à direita, junto dos toggles (separador vertical); timeline com fotos centralizadas | pedido do Jefferson |
| Hover diferente em cada soft skill (inverte + peça gira; barra de acento + balão balança; relógio dá uma volta; sombra editorial dura; lâmpada acende) e em cada depoimento (inclinação 3D que segue o mouse com brilho — `src/components/ui/tilt-card.tsx`; sobe com sombra de acento e a faixa cresce; rótulo "descola" e linhas viram acento). Movimentos só com animações ligadas; cores mudam sempre | pedido do Jefferson |
| Foto da Hero menor e inteira, à direita na base (celular: entre textos e CTAs); rótulo K7 ao lado dos CTAs, só em telas >= 1280 px. Hover no nome redigita EVANGELISTA (intervalo de 1,5 s) | pedido: ver todos os detalhes da foto |
| `projects.ts` com 3 projetos reais dos repositórios públicos de github.com/JeffersonEvangelista (SIAS App, Estação ESP32, NutriSense), só com fatos do README/package.json; SIAS e NutriSense marcados como "equipe" (repositórios com outros autores; NutriSense é fork de B0rga). `site.social.github` preenchido. A conta jeffersonme84-oss não tem repositórios públicos | pedido do Jefferson; nada inventado |
| LinkedIn não é lido automaticamente (exige login e os termos proíbem coleta automatizada): o Jefferson exporta o perfil em PDF ou cola o texto | seção 7 |
| Linha MOREIRA EVANGELISTA menor (até 3,5 rem; 8,5 vw no celular); a digitação de EVANGELISTA continua | pedido do Jefferson |
| `src/components/ui/notched-project-card.tsx` (21st.dev) adaptado: sem "use client", cantos de 8 px, título em display, proporção 2:3 (ideia do pôster mantida), recorte pintado em `var(--wall)`, disco claro que fica laranja (acento) no hover/foco, rótulo acessível. A galeria segue na parede escura, em P&B, com Deploy/GitHub abaixo e o estudo de caso em modal | efeito pedido, em harmonia com o tema |
| Lighthouse: desktop 99/100/100/100; mobile 83–86 / 100 / 100 / 100 | foto de fundo pesa menos que o robô |

**Status dos módulos:** 0 a 9 concluídos. Módulo 10 concluído, exceto a **publicação na Vercel** (fica para o fim, por decisão do Jefferson) e o checklist que depende de conteúdo real.

**Lançamento (passo a passo)**
1. Supabase (uma vez): `pnpm exec supabase login`, `pnpm exec supabase link --project-ref <ref>`, `pnpm exec supabase db push` (cria `contact_messages` com RLS), `pnpm exec supabase secrets set RESEND_API_KEY=... CONTACT_TO_EMAIL=...` (opcionais: `CONTACT_FROM_EMAIL`, `ALLOWED_ORIGIN`) e `pnpm exec supabase functions deploy send-contact`.
2. Vercel: importar `portfolio-2027` (preset Vite, `pnpm install`, `pnpm build`, saída `dist`, raiz do repo) e cadastrar `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` e `VITE_SITE_URL`. Ativar Web Analytics no painel.
3. Testar em produção: envio do formulário (linha no Postgres + e-mail), deep link `#projeto-<slug>`, 404, tema e idioma.
4. Checklist final do Módulo 10: autorização das fotos da família, CVs, placeholders e nenhum `TODO(jefferson)` remanescente.
