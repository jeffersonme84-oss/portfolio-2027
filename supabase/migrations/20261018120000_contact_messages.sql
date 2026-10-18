-- Mensagens do formulário "Fale comigo".
-- RLS ativa: o papel anon só pode INSERT (via Edge Function send-contact); ninguém lê pelo cliente.

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 100),
  email text not null check (char_length(email) between 3 and 254),
  message text not null check (char_length(message) between 10 and 2000),
  locale text not null default 'pt-BR' check (locale in ('pt-BR', 'en-US')),
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

-- Privilégios mínimos: anon só insere as colunas do formulário; authenticated não acessa.
revoke all on table public.contact_messages from anon, authenticated;
grant insert (name, email, message, locale) on table public.contact_messages to anon;

create policy "anon pode apenas inserir mensagens"
  on public.contact_messages
  for insert
  to anon
  with check (true);

-- Sem policies de select/update/delete: leitura só pelo painel do Supabase.

create index if not exists contact_messages_created_at_idx
  on public.contact_messages (created_at desc);
