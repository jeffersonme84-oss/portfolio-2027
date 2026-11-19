<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=rect&color=0:D42A20,100:0d0d0d&height=150&text=DEFT.%20PORTF%C3%93LIO&fontSize=56&fontColor=ffffff&fontAlignY=48&desc=Jefferson%20Moreira%20Evangelista%20%E2%80%A2%20Forward%20Deployed%20Engineer&descAlignY=78&descSize=17" width="100%" alt="DEFT. Portfólio"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 19"/>
  <img src="https://img.shields.io/badge/TypeScript_strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Vite_6-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/Tailwind_4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase"/>
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel"/>
  <img src="https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white" alt="Vitest"/>
</p>

<p align="center">
  <b>Portfólio one-page, bilíngue e acessível, com identidade editorial "DEFT." e interações retrô (fita K7, VHS e vinil).</b><br/>
  Feito para recrutadores: contato, LinkedIn e projetos a um clique na primeira tela.
</p>

---

## Funcionalidades

| Funcionalidade                | Detalhes                                                                                         |
| ----------------------------- | ------------------------------------------------------------------------------------------------ |
| **Bilíngue**                  | Português (padrão) e inglês, com detecção do idioma do navegador (`react-i18next`)               |
| **Tema claro e escuro**       | Arte da Home nos dois temas; escolha salva e aplicada antes da primeira pintura (sem "flash")    |
| **Home "DEFT."**              | Arte original com textos HTML por cima, foto em "código Matrix", contador de visitas em deck K7  |
| **Projetos como discografia** | Capas de LP; cada projeto abre um estudo de caso em slides, com link direto `#projeto-<slug>`    |
| **Sobre em videocassete**     | Trajetória navegável por teclado, com foto e detalhes na "tela"                                  |
| **Contato de verdade**        | Formulário (`react-hook-form` + `zod`) → Edge Function do Supabase → Postgres + e-mail (Resend)  |
| **Easter eggs**               | Abertura em fita K7 (clique na marca DEFT. repete), Konami Code, sons opcionais, 404 "SEM SINAL" |
| **Acessível**                 | HTML semântico, foco visível, contraste AA, botão para reduzir animações                         |
| **Seguro**                    | CSP com hash dos scripts, cabeçalhos de segurança, RLS no banco, sem segredos no front           |

## Tecnologias

| Camada            | Tecnologia                                                              |
| ----------------- | ----------------------------------------------------------------------- |
| Front-end         | React 19, Vite 6, TypeScript (strict)                                   |
| Estilo            | Tailwind CSS 4, shadcn/ui (Radix), CSS próprio para os efeitos retrô    |
| Formulários       | react-hook-form, zod                                                    |
| Idiomas           | i18next, react-i18next, detector de idioma                              |
| Back-end          | Supabase: Postgres (RLS), Edge Function `send-contact` (Deno), Realtime |
| Deploy e métricas | Vercel, Vercel Analytics                                                |
| Qualidade         | ESLint, Prettier, Vitest, Conventional Commits                          |

## Requisitos

- **Node.js 20 a 24** (o projeto usa 22).
- **pnpm 10** (`npm i -g pnpm`, ou o pnpm que vem no Node portátil em `D:\tools\node`).
- Opcional: uma conta Supabase, para o formulário e o contador de visitas.

## Instalação e execução local

```bash
git clone https://github.com/jeffersonme84-oss/portfolio-2027.git
cd portfolio-2027
pnpm install
cp .env.example .env.local   # opcional: preencha as variáveis do Supabase
pnpm dev                     # abre em http://localhost:5173
```

Sem as variáveis do Supabase o site funciona normalmente: o formulário mostra uma mensagem amigável e, no `pnpm dev`, o contador de visitas entra em modo demonstração.

## Scripts

| Comando           | O que faz                                                       |
| ----------------- | --------------------------------------------------------------- |
| `pnpm dev`        | Servidor de desenvolvimento com recarga automática              |
| `pnpm build`      | Checagem de tipos + build de produção em `dist/`                |
| `pnpm preview`    | Serve o `dist/` com os mesmos cabeçalhos de segurança da Vercel |
| `pnpm test`       | Roda os testes automatizados (Vitest) uma vez                   |
| `pnpm test:watch` | Testes em modo observação, enquanto você edita                  |
| `pnpm lint`       | ESLint                                                          |
| `pnpm typecheck`  | TypeScript sem gerar arquivos                                   |
| `pnpm format`     | Prettier em todo o projeto                                      |
| `pnpm check`      | Tudo antes de um commit: lint + typecheck + testes + build      |

## Estrutura de pastas

```
src/
├── content/        ← TEXTOS E DADOS que você edita (projetos, trajetória, habilidades, contatos)
├── i18n/locales/   ← textos da interface em pt-BR e en-US
├── components/
│   ├── sections/   ← seções da página (Hero, About, Projects, Skills, Testimonials, Contact)
│   ├── layout/     ← Header, Footer, toggles de tema e idioma, contatos flutuantes
│   ├── retro/      ← efeitos K7/VHS/vinil (abertura, contador, cursor, 404)
│   └── ui/         ← peças genéricas (dialog, sheet, pager, tilt-card)
├── hooks/          ← lógica reutilizável (useTheme, useLocale, useTypewriter...)
├── lib/            ← utilidades sem tela (tema, animações, Supabase, contato, visitas)
└── styles/         ← tokens de cor e CSS dos efeitos (hero, retro, boot, records)
public/images/      ← fotos e capas
supabase/           ← migrations do banco e Edge Function do formulário
tests/              ← testes automatizados
vite/               ← plugin de SEO e segurança usado no build
docs/               ← documentação e referências de design
```

## Documentação

| Documento                                              | Para quê                                                                                      |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| [docs/DEVELOPMENT_GUIDE.md](docs/DEVELOPMENT_GUIDE.md) | **Comece aqui.** Onde trocar textos, imagens, projetos, certificações; como criar componentes |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)           | Como o site é organizado por dentro e por quê                                                 |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)               | Publicar na Vercel e configurar o Supabase                                                    |
| [docs/AUDIT_REPORT.md](docs/AUDIT_REPORT.md)           | Auditoria técnica: problemas encontrados, corrigidos e pendentes                              |
| [CLAUDE.md](CLAUDE.md)                                 | Histórico de decisões de design e de cada módulo                                              |

## Publicação

O deploy é na **Vercel**, conectada a este repositório: cada push em `main` publica em produção e cada pull request ganha uma URL de prévia. O passo a passo está em [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

---

<p align="center">Feito por <b>Jefferson Moreira Evangelista</b> · <a href="https://www.linkedin.com/in/jeffersonmevangelista/">LinkedIn</a> · <a href="https://github.com/JeffersonEvangelista">GitHub</a></p>
