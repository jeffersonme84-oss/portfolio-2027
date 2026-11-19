-- Limite no contador de visitas (auditoria, item M3).
-- Antes, qualquer pessoa com a chave anon podia chamar register_visit(true) em loop e inflar o
-- total. Agora cada IP soma no máximo 1 visita por dia (horário de São Paulo).
-- Privacidade: guarda só um hash (md5 com sal) do IP, nunca o IP, e apaga registros com mais
-- de 2 dias. A tabela tem RLS sem policies: o cliente não lê nem escreve nela.

create table if not exists public.site_visit_log (
  day date not null,
  ip_hash text not null,
  primary key (day, ip_hash)
);

alter table public.site_visit_log enable row level security;
revoke all on table public.site_visit_log from anon, authenticated;

create or replace function public.register_visit(count_it boolean default true)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  total bigint;
  headers json;
  ip text;
  today date := (now() at time zone 'America/Sao_Paulo')::date;
  inserted integer := 0;
begin
  if count_it then
    -- Cabeçalhos da requisição (o PostgREST do Supabase preenche request.headers).
    begin
      headers := nullif(current_setting('request.headers', true), '')::json;
    exception when others then
      headers := null;
    end;
    ip := coalesce(
      headers ->> 'cf-connecting-ip',
      nullif(trim(split_part(coalesce(headers ->> 'x-forwarded-for', ''), ',', 1)), ''),
      'desconhecido'
    );

    insert into public.site_visit_log (day, ip_hash)
      values (today, md5(ip || ':deft-visitas'))
      on conflict do nothing;
    get diagnostics inserted = row_count;

    delete from public.site_visit_log where day < today - 2;
  end if;

  if inserted > 0 then
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
