# Publicação na Vercel

> **Situação atual (19/11/2026):** o site está no ar em **https://deftdev.vercel.app** (projeto `deftdev`), publicado pela Vercel CLI. Para republicar depois de uma mudança:
>
> ```bash
> vercel deploy --prod
> ```
>
> Para publicar sozinho a cada `git push`: instale o app da Vercel no GitHub (https://github.com/apps/vercel/installations/new → só o repositório `portfolio-2027`) e rode `vercel git connect` na pasta do projeto.
>
> Observação para Windows: ao cadastrar variáveis pela CLI com `|` no PowerShell, o valor pode ganhar um caractere invisível (BOM). Prefira cadastrar pelo painel da Vercel.

O projeto já está pronto para a Vercel: `vercel.json` define framework (Vite), comandos, pasta de saída, reescrita da SPA e cabeçalhos de segurança. Só faltam as ações que dependem da sua conta.

## Endereço do site

Verificados em 19/11/2026 (pode mudar até você criar o projeto):

| Endereço                   | Custo                                        | Situação                                                  |
| -------------------------- | -------------------------------------------- | --------------------------------------------------------- |
| **`deftdev.vercel.app`**   | grátis                                       | livre ✔ (recomendado: curto, fácil de falar e de digitar) |
| `jeffersondeft.vercel.app` | grátis                                       | livre ✔                                                   |
| `deft.vercel.app`          | —                                            | já está em uso                                            |
| **`deft.dev.br`**          | anual, no [Registro.br](https://registro.br) | livre ✔ (recomendado se quiser domínio próprio)           |
| `jeffersondeft.com.br`     | anual, no Registro.br                        | livre ✔                                                   |

O endereço `*.vercel.app` vem do **nome do projeto** na Vercel: chamando o projeto de `deftdev`, o site fica em `https://deftdev.vercel.app`.

## 1. Publicar (≈ 10 minutos)

1. Entre em [vercel.com](https://vercel.com) com sua conta do GitHub.
2. **Add New… → Project → Import** o repositório `jeffersonme84-oss/portfolio-2027`.
3. **Project Name:** `deftdev`.
4. A Vercel detecta tudo pelo `vercel.json`. Confira:
   - Framework Preset: **Vite**
   - Install Command: `pnpm install --frozen-lockfile`
   - Build Command: `pnpm build`
   - Output Directory: `dist`
   - Root Directory: `./` (raiz)
5. **Environment Variables** (todas em _Production_ e _Preview_):

   | Nome                     | Valor                                                                 |
   | ------------------------ | --------------------------------------------------------------------- |
   | `VITE_SITE_URL`          | `https://deftdev.vercel.app` (ou o domínio próprio, sem barra no fim) |
   | `VITE_SUPABASE_URL`      | Supabase → Project Settings → API → Project URL                       |
   | `VITE_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → chave `anon` / `publishable`      |

   Sem as duas do Supabase o site funciona, mas o formulário mostra "ainda não está disponível" e o contador de visitas some (no lugar aparece "Ver por dentro").

6. **Deploy.**
7. Em **Analytics**, clique em _Enable_ para ativar o Web Analytics.

Daqui em diante, **cada push em `main` publica em produção** e cada pull request ganha uma URL de prévia.

> A versão do Node vem do campo `engines` do `package.json` (20 a 24). Se a Vercel avisar sobre a versão, escolha **22.x** em Settings → General → Node.js Version.

## 2. Back-end no Supabase (formulário e contador)

Rode na pasta do projeto (a CLI do Supabase já vem como dependência):

```bash
pnpm exec supabase login
pnpm exec supabase link --project-ref <id-do-projeto>
pnpm exec supabase db push
pnpm exec supabase secrets set RESEND_API_KEY=<chave> CONTACT_TO_EMAIL=<seu-email> ALLOWED_ORIGIN=https://deftdev.vercel.app
pnpm exec supabase functions deploy send-contact
```

- `db push` cria as tabelas `contact_messages` e `site_stats` (com RLS) e a função `register_visit`.
- `ALLOWED_ORIGIN` restringe quem pode chamar a função do formulário. **Defina sempre**: sem ela a função aceita qualquer origem.
- Opcional: `CONTACT_FROM_EMAIL` (remetente com domínio verificado no Resend). Sem ele, o e-mail sai de `onboarding@resend.dev`.
- O contador de visitas usa o **Realtime Presence** do Supabase, que já vem ligado.

## 3. Domínio próprio (opcional)

1. Registre o domínio (ex.: `deft.dev.br`) no Registro.br.
2. Na Vercel: **Settings → Domains → Add** → `deft.dev.br`. A Vercel mostra os registros DNS.
3. No Registro.br, em **DNS**, crie os registros que a Vercel indicou (em geral um `A` para `76.76.21.21` no domínio raiz e um `CNAME` `www` → `cname.vercel-dns.com`).
4. Troque `VITE_SITE_URL` para `https://deft.dev.br` e o `ALLOWED_ORIGIN` do Supabase (passo 2), depois faça **Redeploy**.

O HTTPS é automático.

## 4. Checklist depois de publicar

- [ ] A Home abre nos temas claro e escuro, sem erros no console (F12).
- [ ] O link direto `https://deftdev.vercel.app/#projeto-sias-app` abre o estudo de caso.
- [ ] Um endereço qualquer (`/teste`) mostra a página "SEM SINAL".
- [ ] Português e inglês funcionam.
- [ ] O formulário envia: a linha aparece em Supabase → Table Editor → `contact_messages` e o e-mail chega.
- [ ] O contador de visitas aparece no canto da Home.
- [ ] `https://deftdev.vercel.app/robots.txt` e `/sitemap.xml` existem.
- [ ] Prévia de compartilhamento ok: cole o link no LinkedIn ou em [opengraph.xyz](https://www.opengraph.xyz).

## 5. Voltar uma versão (rollback)

Na Vercel, **Deployments** → escolha uma publicação anterior que funcionava → **⋯ → Promote to Production**. O site volta na hora, sem mexer no código. Depois, corrija no Git e publique de novo.

## 6. Logs

- Erros do site: console do navegador.
- Build: Vercel → Deployments → (publicação) → **Build Logs**.
- Formulário: Supabase → Edge Functions → `send-contact` → **Logs**.
