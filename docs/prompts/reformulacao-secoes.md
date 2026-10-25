# Prompt — Reformulação das seções do portfólio (uma tela por seção)

> Uso: colar este prompt no Claude Code dentro do repositório `portfolio-2027`.
> Ele complementa o `CLAUDE.md` (que continua valendo: i18n, acessibilidade, Lorem + `TODO(jefferson)`, nada inventado).

---

## 1. Papel

Atue como **Designer de Produto Sênior (nível Awwwards) e Engenheiro Front-End especialista em motion e performance**. Você vai reformular as seções abaixo da Home do portfólio de **Jefferson Moreira Evangelista**, mantendo a Home atual como está e elevando o restante ao mesmo padrão.

## 2. Objetivo

1. **Cada seção cabe em uma tela** ("página por página"), como a Home: em 1280×720, 1440×900 e 360×740, nenhuma seção precisa de rolagem interna para ser entendida. O que não couber é **paginado** (setas + pontos), nunca cortado.
2. **Projetos** com layout muito próximo ao da referência `https://gustavosantosjs.netlify.app/` (seção "Projetos").
3. **Sobre e Experiências** reorganizados como na referência (cartão de identidade + métricas + stacks; experiências em duas colunas).
4. **Armadura da Home** com cor mais natural, em harmonia com a paleta do site.
5. **Posicionamento multiárea**: deixar o Jefferson competitivo para vagas de **desenvolvimento**, **cibersegurança**, **banco de dados/dados**, **UI/UX** e **áreas comerciais de tecnologia** (pré-vendas, customer success, vendas técnicas e marketing), sem inventar experiência.

## 3. Referências (o que copiar e o que não copiar)

| Referência | Copiar | Não copiar |
| --- | --- | --- |
| gustavosantosjs.netlify.app | Estrutura: numeração de seção (`01`, `02`…), cabeçalho "Projetos / Trabalhos recentes e destaque", grade 2×2 de cards com setas e pontos, selo `APP`/`WEB` sobre a capa, eyebrow mono com o cliente, título, chips de tecnologia com `+N`; cartão de identidade (Nome, Localização, E-mail, Telefone, Interesses, Redes) ao lado das métricas e da grade de ícones de stacks; Experiências em duas colunas (data + empresa à esquerda; cargo, descrição e chips à direita); bloco final "Fale comigo" com 3 cartões (telefone, e-mail, LinkedIn) | Textos, nomes, logos, fotos, capas e métricas do Gustavo. Fontes dele (Geist/Bricolage): manter as do site (Archivo, Inter, JetBrains Mono) |
| motionsites.ai (prompt "consentinel") | **Não foi possível ler: a página exige login.** Se o Jefferson colar o texto do prompt aqui, ajustar a seção 4 com as técnicas dele | — |

## 4. Tecnologias

Stack atual (não trocar): React 19 + Vite 6 + TypeScript strict, Tailwind CSS v4, shadcn/ui, react-i18next, Lenis, react-icons/lucide-react, Supabase (contato), Vercel.

| Necessidade | Tecnologia | Observação |
| --- | --- | --- |
| Uma seção por tela | `min-h-svh` + layout em grid que cabe em `100svh`; `lenis/snap` (já vem no pacote `lenis`) com snap **suave** entre seções | snap só no desktop com mouse; desliga com animações reduzidas e quando a seção é mais alta que a tela |
| Paginação de projetos/experiências | Carrossel do shadcn/ui (`embla-carousel-react`, dependência nova: justificar no commit) | setas, pontos, arrastar no celular, teclado (← →), `aria-roledescription="carousel"` |
| Transições e entrada | `framer-motion` (já aprovado no CLAUDE.md): `AnimatePresence` na troca de página do carrossel, `whileInView` com stagger nos cards | duração 0,5–0,8 s, easing `cubic-bezier(0.16,1,0.3,1)`, nada contínuo |
| Tratamento da imagem da Home | script Node com `sharp` em `scripts/` (devDependency) | gera novas versões; o original fica em `docs/assets-originais/` |
| Capas reais dos projetos | screenshots em WebP 16:10 (1200×750 e 600×375) | `loading="lazy"`, `width`/`height` explícitos |

Proibido: carrossel automático, parallax pesado, vídeo de fundo, bibliotecas 3D (three.js) só para enfeite.

## 5. Ajuste da armadura (Home)

Problema: o azul elétrico dos LEDs e o metal muito frio brigam com o acento laranja (`#FF3D14` / `#FF5233`) e com o fundo neutro.

Fazer com `sharp`, sobre `home-cena-2496.webp`, gerando `home-cena-natural-{1248,2496}.webp`:

- Saturação geral −15% a −20%; azuis (matiz ≈ 200–230°) com −45% de saturação, puxados para um aço neutro levemente frio.
- Realces levemente quentes (+3 a +5% no vermelho acima de 70% de luminância), sombras neutras próximas de `#0D0D0D`.
- Contraste local suave para o metal parecer real, sem "plástico".
- Opcional (variante B para comparar): LEDs com brilho âmbar discreto puxado do acento.
- **Proibido** alterar rosto, pose ou geometria: só cor e tom. Mostrar antes/depois lado a lado para o Jefferson aprovar antes de trocar em `site.ts`.

## 6. Arquitetura das seções (ordem final)

`01 Início` (atual, não mexer) · `02 Sobre` · `03 Projetos` · `04 Experiências` · `05 Habilidades` · `06 Depoimentos` (oculta se vazia) · `07 Fale comigo`

Cada seção: numeração mono (`02`), título em display, subtítulo de uma linha, conteúdo e um único detalhe retro (no máximo).

### 02 · Sobre (uma tela)

- **Esquerda — cartão de identidade** (vidro discreto, borda 1px): Nome, Cargo-alvo, Localização, E-mail, Telefone/WhatsApp, Idiomas (Português nativo · Inglês B2, preparando C1), Interesses (`TODO(jefferson)`), redes (LinkedIn, GitHub, Instagram). Botões "Baixar CV" (só se o PDF existir) e "Fale comigo".
- **Direita — bio curta** (máx. 3 linhas, de `about.bio`) + **grade de métricas** + **grade de ícones de stacks** (todos os itens de `skills.ts`, monocromáticos, cor da marca no hover).
- **Métricas (reais, calculadas, nunca infladas):**

| Métrica | Valor | Origem |
| --- | --- | --- |
| Tecnologias e ferramentas | **30+** | itens técnicos de `skills.ts` (hoje 31) |
| Certificações | **12+** | AWS (2) + desenvolvimento e IA (6) + infraestrutura, segurança e IoT (4) |
| Anos em tecnologia | **4+** | desde 2022 (Java, Linux, DMANDA) |
| Anos em vendas e liderança | **2+** | Verisure, desde 2024 |
| Projetos publicados | **5** | SIAS App, Estação ESP32, NutriSense, Spring Boot, este portfólio |

  Os números vêm de funções em `src/content/metrics.ts` (contam `skills.ts`, `timeline.ts` e `projects.ts`), para não desatualizarem.
- **Seletor de foco profissional (ideia nova):** chips `Dev Full Stack · Cibersegurança · Dados · UI/UX · Comercial & Marketing`. Escolher um chip destaca (sem esconder o resto) as skills, projetos e experiências daquela área e troca a frase de apresentação. A escolha vai para a URL (`?foco=seguranca`), para o Jefferson mandar o link certo em cada candidatura.

### 03 · Projetos (uma tela, igual à referência)

- Cabeçalho: `03` · "Projetos" · "Trabalhos recentes e destaque"; à direita, setas ← → e pontos de paginação.
- **Grade 2×2 por página no desktop** (4 projetos), 1 por página no celular (deslizar). Página com menos de 4 itens não deixa buracos estranhos (centralizar).
- **Card:** capa 16:10 com selo `APP` / `WEB` / `IOT` / `API` no canto; abaixo, eyebrow mono com o contexto (`FATEC · EQUIPE`, `PESSOAL`), título, chips das 3 primeiras tecnologias + `+N`. Hover: capa sobe 2% e sai do P&B; borda em acento. Clique: abre o estudo de caso (modal atual, deep link `#projeto-<slug>`). Botões Deploy/GitHub dentro do modal.
- **Filtro por área** ligado ao seletor de foco (ex.: Cibersegurança destaca a Estação ESP32 e o próprio portfólio, com RLS e rate limit).
- **Conteúdo:** os 3 de `projects.ts` + `spring-boot` (desafio Java/Spring Boot, `github.com/JeffersonEvangelista/SpringBoot`) + `portfolio-2027` (este site: React, TS, Supabase com RLS, Edge Function, i18n, Lighthouse). Só fatos dos repositórios; a parte do Jefferson nos projetos em equipe fica como `TODO(jefferson)`.
- Capas: screenshots reais (README/app rodando); enquanto não existirem, manter os placeholders SVG.

### 04 · Experiências (uma tela, paginada)

- Cabeçalho: `04` · "Experiências" · faixa mono `2014 — 2026`.
- Duas colunas por item: **esquerda** período + empresa; **direita** cargo, descrição de 2 linhas e chips de competências. Três itens por página, setas e pontos.
- Itens (de `timeline.ts`): Líder de equipe (Verisure), Executivo de vendas Júnior → Pleno (Verisure), Desenvolvedor Full Stack (DMANDA), Pós em TI (PUC-Campinas), Tecnólogo DSM (Fatec Zona Sul), Psicologia e Psicanálise (Anhanguera), certificações agrupadas.
- Chips mostram as competências transferíveis: na Verisure, `IoT`, `Segurança eletrônica`, `KPIs`, `Vendas B2B/B2C`, `Liderança`; na DMANDA, `E-commerce`, `Marketplaces`, `Banco de dados`, `Campanhas`, `Feiras`.
- As fotos de família saem desta lista e viram uma faixa pequena de fotos no fim do "Sobre" (com o easter egg da ilustração mantido), só se a autorização da família estiver confirmada.

### 05 · Habilidades (uma tela)

- Abas por grupo (Frontend, Backend, Dados, Cloud e infraestrutura, Segurança, Mobile e IoT, IA, Design/UI, Comercial & Marketing). Soft skills em uma linha de cartões compactos.
- Novos grupos só com o que é real: **Segurança** (Security+ Network Infrastructure, Linux, segurança eletrônica e IoT na Verisure, RLS/Supabase), **Design/UI** (Figma, este portfólio), **Comercial & Marketing** (vendas consultivas, negociação, apresentações, campanhas e feiras na DMANDA, gestão de KPIs).

### 07 · Fale comigo (uma tela)

- Formulário atual + três cartões como na referência: WhatsApp/telefone, e-mail, LinkedIn. CTA final "Vamos conversar sobre a sua vaga".

## 7. Textos de posicionamento (rascunho, revisar com o Jefferson)

- Frase do "Sobre": "Desenvolvedor de software que entende de pessoas e de negócios: construo sistemas web, mobile e IoT, com base em nuvem e segurança, e sei apresentar e vender tecnologia."
- Por foco (troca com o seletor):
  - **Dev Full Stack:** "Java, Spring Boot, Node.js, React e AWS, do banco de dados ao deploy."
  - **Cibersegurança:** "Base em Security+, Linux e segurança eletrônica com IoT; RLS e boas práticas no código."
  - **Dados:** "SQL, MySQL, PostgreSQL e Firebase; modelagem e integração de sistemas."
  - **UI/UX:** "Interfaces acessíveis e centradas no usuário, com base em Psicologia e Figma."
  - **Comercial & Marketing:** "Liderança de equipe de vendas, negociação consultiva, campanhas e feiras B2B."
- Tudo em `pt-BR` e `en-US` (i18n), sem texto fixo nos componentes.

## 8. Regras

- **Nada inventado**: empresas, clientes, números e depoimentos só se estiverem em `src/content/` ou forem confirmados pelo Jefferson. O que faltar: Lorem + `// TODO(jefferson): preencher`.
- Não copiar textos, logos ou imagens do site de referência.
- Contraste AA nos dois temas; foco visível; carrosséis operáveis por teclado; `prefers-reduced-motion` e o botão "Ativar animações" desligam snap, transições e entradas.
- Performance: carrossel e seções abaixo da dobra em chunks lazy; meta Lighthouse ≥ 90 no desktop e sem piorar o mobile atual.
- Registrar cada decisão nova na seção 10 do `CLAUDE.md`.

## 9. Pendências que dependem do Jefferson

- [ ] Texto do prompt "consentinel" (motionsites exige login).
- [ ] Aprovar a variante de cor da armadura (antes/depois).
- [ ] Interesses pessoais para o cartão de identidade.
- [ ] Sua contribuição nos projetos em equipe (SIAS App, NutriSense).
- [ ] Screenshots reais dos projetos.
- [ ] CVs em PDF (pt-BR e en-US); opcional: uma versão por área.
- [ ] Confirmar as métricas da tabela da seção "02 · Sobre".

## 10. Entrega e validação

1. Uma branch por etapa: `feat/sobre-metricas`, `feat/projetos-galeria`, `feat/experiencias`, `feat/habilidades-grupos`, `chore/armadura-cor`.
2. Em cada etapa: `pnpm lint && pnpm typecheck && pnpm build`, screenshots em 1280×720 e 360×740 (claro e escuro) provando que a seção cabe na tela, e commit em Conventional Commits.
3. Ao final: Lighthouse desktop e mobile e lista do que ficou `TODO(jefferson)`.
