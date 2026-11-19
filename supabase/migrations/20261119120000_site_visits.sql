-- Contador de visitas da Home (deck K7). Uma linha só, com o total.
-- RLS ativa e sem policies: o cliente não lê nem escreve a tabela. O acesso é só pela função
-- register_visit (security definer), que soma 1 ou apenas devolve o total.

create table if not exists public.site_stats (
  id smallint primary key default 1 check (id = 1),
  visits bigint not null default 0,
  updated_at timestamptz not null default now()
);

insert into public.site_stats (id) values (1) on conflict (id) do nothing;

alter table public.site_stats enable row level security;
revoke all on table public.site_stats from anon, authenticated;

create or replace function public.register_visit(count_it boolean default true)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  total bigint;
begin
  if count_it then
    update public.site_stats
      set visits = visits + 1, updated_at = now()
      where id = 1
      returning visits into total;
  else
    select visits into total from public.site_stats where id = 1;
  end if;
  return coalesce(total, 0);
end;
$$;

revoke all on function public.register_visit(boolean) from public;
grant execute on function public.register_visit(boolean) to anon, authenticated;
