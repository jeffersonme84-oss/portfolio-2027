# Relatório de auditoria técnica

**Projeto:** DEFT Portfolio (`portfolio-2027`) · **Data:** 19/11/2026 · **Branch:** `audit/engenharia`
**Escopo:** código, configuração, back-end Supabase, segurança, desempenho, acessibilidade, testes e preparação para a Vercel.
**Restrição:** design aprovado preservado. Nenhuma alteração visual foi feita.

Legenda de status: ✅ **Corrigido e validado** · 🟡 **Pendente** (depende de você ou de autorização) · ℹ️ **Informativo**

---

## 1. Reconhecimento (Etapa Zero)

| Item           | Encontrado                                                                                                        |
| -------------- | ----------------------------------------------------------------------------------------------------------------- |
| Stack          | React 19 + Vite 6 + TypeScript 5.7 (strict), Tailwind 4, shadcn/ui (Radix), i18next, zod 4, Lenis                 |
| Back-end       | Supabase: 2 migrations (`contact_messages`, `site_stats` + `register_visit`), Edge Function `send-contact` (Deno) |
| Banco          | Postgres (Supabase), com RLS em todas as tabelas                                                                  |
| Roteamento     | Nenhum (one-page com âncoras); 404 feita pelo próprio app                                                         |
| Deploy         | `vercel.json` só com a reescrita da SPA                                                                           |
| Git            | `main` limpo e sincronizado com o GitHub (`6d8009b`); auditoria feita na branch `audit/engenharia`                |
| Testes         | **Nenhum** antes da auditoria                                                                                     |
| Estado inicial | lint, typecheck e build passavam; 2 erros no console (ver M1)                                                     |
| Variáveis      | Não há `.env.local` nesta máquina: Supabase não configurado localmente                                            |

---

## 2. Problemas encontrados

### CRÍTICO

| ID  | Responsável | Onde                           | Descrição                                                                                   | Risco                                          | Solução                                                                                                      | Status                           |
| --- | ----------- | ------------------------------ | ------------------------------------------------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | -------------------------------- |
| C1  | Segurança   | Fora do código (CLAUDE.md §10) | O Access Token `sbp_…` do Supabase e a senha do banco foram expostos numa conversa anterior | Quem tiver o token controla o projeto Supabase | Revogar o token (Supabase → Account → Access Tokens) e trocar a senha do banco (Project Settings → Database) | 🟡 Pendente (só você pode fazer) |

### ALTO

| ID  | Responsável       | Onde                | Descrição                                                                                                        | Risco                                                                               | Solução                                                                                                                                                            | Status                        |
| --- | ----------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------- |
| A1  | Back-end / DevOps | `supabase/`, Vercel | O back-end do Supabase (migrations e Edge Function) ainda não foi publicado e não há variáveis `VITE_SUPABASE_*` | Em produção, o formulário mostra "indisponível" e o contador de visitas não aparece | Passo 2 de `docs/DEPLOYMENT.md` + variáveis na Vercel                                                                                                              | 🟡 Pendente (exige sua conta) |
| A2  | Segurança         | `vercel.json`       | Nenhum cabeçalho de segurança nem Content-Security-Policy                                                        | XSS sem segunda barreira; site podia ser embutido em `iframe` (clickjacking)        | CSP com hash dos scripts gerada no build (`vite/seo-plugin.ts`) + `X-Frame-Options`, `frame-ancestors`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, `COOP` | ✅                            |

### MÉDIO

| ID  | Responsável       | Onde                                                       | Descrição                                                                                                                                                             | Risco                                                                           | Solução                                                                                                                                   | Status                                                     |
| --- | ----------------- | ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| M1  | Front-end         | `src/components/retro/BootLoader.tsx` ~l. 95               | Erro `<circle> attribute r: Expected length, "NaN"` no console: no 1º quadro, o tempo do `requestAnimationFrame` podia ser negativo e a curva `ease()` devolvia `NaN` | Erro visível no console (recrutador técnico vê); 1º quadro do carretel inválido | Curva extraída para `src/lib/bootProgress.ts`, com limite 0..1 e teste                                                                    | ✅                                                         |
| M2  | Performance       | `vite.config.ts` (preload)                                 | A arte escura da Home (~430 kB) era pré-carregada **também no tema claro**, sem uso (aviso no console)                                                                | Download desperdiçado e LCP pior no tema claro                                  | Pré-carregamento escolhido pelo tema antes da 1ª pintura                                                                                  | ✅                                                         |
| M3  | Banco / Segurança | `supabase/migrations/20261119120000_site_visits.sql` l. 16 | `register_visit(true)` pode ser chamada por qualquer pessoa com a chave anon, quantas vezes quiser                                                                    | O total de visitas pode ser inflado (sem risco aos dados)                       | Limitar no servidor (ex.: Edge Function com limite por IP, ou tabela de IP/dia)                                                           | 🟡 Recomendação (mudança no banco: precisa de autorização) |
| M4  | Back-end          | `supabase/functions/send-contact/index.ts` l. 21           | Sem `ALLOWED_ORIGIN`, a função responde a qualquer origem (`*`)                                                                                                       | Outro site poderia usar o formulário (o limite por IP continua valendo)         | Definir `ALLOWED_ORIGIN` no deploy (documentado em `DEPLOYMENT.md`)                                                                       | 🟡 Configuração no deploy                                  |
| M5  | QA                | —                                                          | Nenhum teste automatizado                                                                                                                                             | Regressões em conteúdo e traduções passam despercebidas                         | Vitest + 20 testes (ver seção 4)                                                                                                          | ✅                                                         |
| M6  | Segurança         | `package.json`                                             | Alertas em ferramentas de desenvolvimento: `vite` 6.4.4 (moderate), `minimatch` via `typescript-eslint` (moderate)                                                    | Só no ambiente de desenvolvimento; nada disso vai para o site                   | `vite` → 6.4.6, `typescript-eslint` → 8.73.0 (mesma versão principal). `pnpm audit`: **0 vulnerabilidades**                               | ✅                                                         |
| M7  | Performance       | `dist/assets/index-*.js`                                   | JS inicial de 494 kB (164 kB gzip). Lighthouse mobile anterior: 83–86                                                                                                 | LCP mais lento em celulares fracos                                              | Carregar sob demanda partes só do desktop (ex.: `MatrixPortrait`, `CustomCursor`) e medir de novo. Não foi feito: mexe na entrada da Home | ℹ️ Recomendação                                            |

### BAIXO

| ID  | Responsável             | Onde                             | Descrição                                                                                                                                                                                                                           | Solução                                                                                                                 | Status                                   |
| --- | ----------------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| B1  | Arquiteto               | `src/`                           | Código sem uso: `CassetteLabel`, `HeroBooks`, `HeroDiploma`, `HeroMug`, `studying.ts`, `ui/button.tsx`, `ui/kinetic-matrix.tsx`, `ui/notched-project-card.tsx`, `site.experienceYears`, `splitName()` e 11 chaves de tradução órfãs | Removidos. Recuperáveis pelo Git (commit `6d8009b` ou anteriores). `hero.headline` mantida (reservada no CLAUDE.md)     | ✅                                       |
| B2  | DevOps                  | `package.json`                   | Sem `engines` (versão do Node) e sem scripts de teste                                                                                                                                                                               | `engines: node >=20 <25`; scripts `test`, `test:watch`, `check`                                                         | ✅                                       |
| B3  | DevOps                  | `vercel.json`                    | Comandos de build implícitos; sem cache longo para arquivos com hash                                                                                                                                                                | `framework`, `installCommand`, `buildCommand`, `outputDirectory` explícitos; `/assets/*` com `max-age=1 ano, immutable` | ✅                                       |
| B4  | Segurança               | `src/lib/contact.ts`             | O zod 4 tenta `new Function` (JIT), o que a CSP nova bloquearia com erro no console                                                                                                                                                 | `z.config({ jitless: true })`                                                                                           | ✅                                       |
| B5  | Performance / Segurança | `vite/seo-plugin.ts`             | Na validação, a CSP bloqueava fontes que o Vite embute como `data:`                                                                                                                                                                 | `font-src 'self' data:` (capturado no teste de produção, antes de publicar)                                             | ✅                                       |
| B6  | DevOps                  | `.env.example`, `vite.config.ts` | `VITE_SITE_URL` vazio: sem `canonical`, `og:url` e `sitemap.xml`                                                                                                                                                                    | Definir na Vercel (`DEPLOYMENT.md`)                                                                                     | 🟡 No deploy                             |
| B7  | UI/UX                   | `public/og-image.png`            | A imagem de compartilhamento ainda tem o título antigo ("Full Stack")                                                                                                                                                               | Trocada pela captura da Home "DEFT." (Opção A, escolhida pelo Jefferson)                                                                       | ✅ |
| B8  | Documentação            | `README.md`                      | README desatualizado (cargo antigo, funcionalidades que mudaram)                                                                                                                                                                    | Reescrito; criados `ARCHITECTURE`, `DEVELOPMENT_GUIDE`, `DEPLOYMENT`                                                    | ✅                                       |
| B9  | Conteúdo                | `src/content/*`                  | 11 `TODO(jefferson)`: CVs em PDF, arte em alta resolução, objetivo de carreira, datas da Verisure, previsão da pós, textos de família, depoimentos reais, sua parte nos projetos em equipe                                          | Conteúdo seu                                                                                                            | 🟡 Pendente                              |

### INFORMATIVO

| ID  | Responsável    | Observação                                                                                                                                                                                                                 |
| --- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| I1  | Arquiteto      | Arquitetura adequada ao tamanho do projeto: conteúdo separado da apresentação, estado em _external stores_ pequenas, seções abaixo da dobra em chunk separado. Nenhuma reestruturação de pastas foi necessária.            |
| I2  | Banco          | Modelagem correta: `check` de tamanho nas colunas, RLS ligada, privilégios mínimos (`grant insert` só nas colunas do formulário), índice por data. A função `security definer` fixa `search_path` (boa prática).           |
| I3  | Back-end       | Edge Function: validação zod, honeypot, HTML escapado, falha do e-mail não perde a mensagem. O limite por IP é em memória e confia em `x-forwarded-for` (suficiente para um portfólio).                                    |
| I4  | DevOps         | A reescrita `/(.*) → /index.html` devolve **200** para endereços inexistentes (a 404 "SEM SINAL" é do app). Impacto pequeno em SEO; aceitável numa one-page.                                                               |
| I5  | DevOps         | Nas URLs de prévia da Vercel, a barra de comentários (`vercel.live`) é bloqueada pela CSP. Não afeta a produção.                                                                                                           |
| I6  | Privacidade    | O repositório é público e tem fotos da família (decisão sua, CLAUDE.md). Confirme a autorização da esposa e da filha antes de divulgar.                                                                                    |
| I7  | Acessibilidade | Todos os links e botões têm nome acessível; campos do formulário com `label`; `lang` atualizado; `h1` único; animações respeitam a preferência. Os itens "sem nome" de uma 1ª varredura eram falso positivo (menu oculto). |

---

## 3. Arquivos modificados

| Arquivo                                                  | Mudança                                                                                           |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `vercel.json`                                            | Comandos explícitos, cabeçalhos de segurança, cache de `/assets`                                  |
| `vite.config.ts`                                         | Plugin de SEO movido para `vite/`; cabeçalhos da Vercel no `pnpm preview`; configuração do Vitest |
| `vite/seo-plugin.ts`                                     | **Novo.** SEO + CSP com hash + pré-carregamento por tema                                          |
| `package.json`, `pnpm-lock.yaml`                         | `engines`, scripts de teste, `vitest`; `vite` e `typescript-eslint` atualizados (patch/minor)     |
| `tsconfig.app.json`, `tsconfig.node.json`                | Incluem `tests/` e `vite/`                                                                        |
| `src/lib/bootProgress.ts`                                | **Novo.** Curva da fita, com limite 0..1                                                          |
| `src/lib/boot.ts`, `src/components/retro/BootLoader.tsx` | Usam `bootProgress` (correção do `NaN`)                                                           |
| `src/lib/contact.ts`                                     | zod sem `eval`                                                                                    |
| `src/content/site.ts`, `src/content/projects.ts`         | Código morto removido; comentários atualizados                                                    |
| `src/i18n/locales/*.json`                                | 11 chaves órfãs removidas (mesmas nos dois idiomas)                                               |
| 8 componentes sem uso                                    | Removidos (lista em B1)                                                                           |
| `tests/*.test.ts`                                        | **Novos.** 4 arquivos, 20 testes                                                                  |
| `.env.example`, `README.md`, `docs/*.md`                 | Documentação                                                                                      |
| `.claude/launch.json`                                    | Configuração `preview-producao` (porta 4173)                                                      |

---

## 4. Testes e validação (resultados reais)

| Verificação                                     | Comando / método                                                                                                                                                                                   | Resultado                                                                                   |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Tipos                                           | `pnpm typecheck`                                                                                                                                                                                   | ✅ sem erros                                                                                |
| Lint                                            | `pnpm lint`                                                                                                                                                                                        | ✅ sem erros                                                                                |
| Testes                                          | `pnpm test` (Vitest 4.1.12)                                                                                                                                                                        | ✅ 4 arquivos, 20 testes passando                                                           |
| Build                                           | `pnpm build`                                                                                                                                                                                       | ✅ sem erros; CSP com 2 hashes no `dist/index.html`                                         |
| Dependências                                    | `pnpm audit`                                                                                                                                                                                       | ✅ 0 vulnerabilidades                                                                       |
| Cabeçalhos                                      | `pnpm preview` + `fetch('/')`                                                                                                                                                                      | ✅ 6 cabeçalhos presentes                                                                   |
| Console em produção                             | `pnpm preview`, aba nova, navegação completa                                                                                                                                                       | ✅ 0 erros, com CSP ativa                                                                   |
| Fluxos                                          | abertura K7, rolagem pelas 5 seções, estudo de caso (clique, link direto `#projeto-estacao-esp32`, Esc fecha), troca de idioma, tema claro, formulário (mensagem "indisponível" sem Supabase), 404 | ✅                                                                                          |
| Pré-carregamento                                | tema escuro → `home-deft.jpg`; tema claro → `home-deft-light.jpg`                                                                                                                                  | ✅                                                                                          |
| Responsivo                                      | 1376 × 768 e 375 × 812 (sem rolagem lateral)                                                                                                                                                       | ✅                                                                                          |
| Design                                          | Comparação visual manual: capturas do build de produção × site antes da auditoria (Home clara e escura, estudo de caso, celular)                                                                   | ✅ sem diferença percebida                                                                  |
| Envio real do formulário e contador             | —                                                                                                                                                                                                  | 🟡 **Não testado**: Supabase não configurado (A1)                                           |
| Lighthouse / Core Web Vitals                    | —                                                                                                                                                                                                  | 🟡 **Não executado** nesta auditoria (sem Lighthouse nesta máquina). Medir na URL da Vercel |
| Leitores de tela e navegadores além do Chromium | —                                                                                                                                                                                                  | 🟡 **Não testado**                                                                          |

---

## 5. Pendências

1. **C1:** revogar o token `sbp_…` e trocar a senha do banco do Supabase.
2. **A1:** publicar o back-end do Supabase e cadastrar as variáveis na Vercel (`docs/DEPLOYMENT.md`).
3. **M4:** definir `ALLOWED_ORIGIN` na Edge Function.
4. **B6:** definir `VITE_SITE_URL` com o endereço escolhido.
5. ~~**B7:** nova `og-image.png`~~ (feito: captura da Home).
6. **M3:** decidir se o contador de visitas deve ter limite no servidor.
7. **M7:** decidir se vale reduzir o JS inicial (medir antes com o Lighthouse na Vercel).
8. **B9:** conteúdo marcado com `TODO(jefferson)`.
9. Testar em produção: formulário, contador, prévia no LinkedIn e Lighthouse.
