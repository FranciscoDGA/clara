-- Clara: schema inicial (Supabase / Postgres)
-- Rodar com: supabase db push

-- 1. Perfis (1:1 com auth.users)
create table if not exists public.perfis (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text,
  whatsapp text,
  estado char(2),
  renda_faixa text default 'ate_1sm',
  tem_filhos boolean default false,
  plano text default 'gratuito' check (plano in ('gratuito','clara_plus','clara_pro')),
  criado_em timestamptz default now(),
  atualizado_em timestamptz default now()
);

-- 2. Casos juridicos
create table if not exists public.casos (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references public.perfis(id) on delete cascade not null,
  tipo_caso text not null,
  categoria text not null default 'família',
  status text not null default 'triagem'
    check (status in ('triagem','documentos_gerados','protocolado','em_andamento','concluido','arquivado')),
  urgencia text not null default 'normal'
    check (urgencia in ('critica','alta','normal','baixa')),
  relato_original text,
  dados_extraidos jsonb not null default '{}'::jsonb,
  prazo_proximo timestamptz,
  criado_em timestamptz default now(),
  atualizado_em timestamptz default now()
);
create index if not exists idx_casos_usuario on public.casos(usuario_id);
create index if not exists idx_casos_status on public.casos(status);
create index if not exists idx_casos_tipo on public.casos(tipo_caso);

-- 3. Documentos gerados
create table if not exists public.documentos (
  id uuid primary key default gen_random_uuid(),
  caso_id uuid references public.casos(id) on delete cascade not null,
  tipo text not null,
  titulo text not null,
  conteudo_markdown text not null,
  variaveis_faltantes jsonb default '[]'::jsonb,
  status text default 'gerado' check (status in ('gerado','baixado','protocolado')),
  gerado_em timestamptz default now()
);
create index if not exists idx_docs_caso on public.documentos(caso_id);

-- 4. Jurisprudencia (base RAG futura / referência)
create table if not exists public.jurisprudencia (
  id uuid primary key default gen_random_uuid(),
  tribunal text not null,
  numero_processo text,
  ementa text not null,
  area text default 'familia',
  tema text,
  data_julgamento date,
  criado_em timestamptz default now()
);

-- 5. Logs IA (custo/transparência)
create table if not exists public.logs_ia (
  id uuid primary key default gen_random_uuid(),
  caso_id uuid references public.casos(id) on delete set null,
  etapa text not null,
  tokens_estimados int default 0,
  criado_em timestamptz default now()
);

-- RLS
alter table public.perfis enable row level security;
alter table public.casos enable row level security;
alter table public.documentos enable row level security;
alter table public.jurisprudencia enable row level security;
alter table public.logs_ia enable row level security;

-- Politicas: usuario so acessa o proprio dado
drop policy if exists "perfis_own" on public.perfis;
create policy "perfis_own" on public.perfis
  for all using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "casos_own" on public.casos;
create policy "casos_own" on public.casos
  for all using (auth.uid() = usuario_id) with check (auth.uid() = usuario_id);

drop policy if exists "docs_via_caso" on public.documentos;
create policy "docs_via_caso" on public.documentos
  for all using (
    exists (select 1 from public.casos c where c.id = documentos.caso_id and c.usuario_id = auth.uid())
  ) with check (
    exists (select 1 from public.casos c where c.id = documentos.caso_id and c.usuario_id = auth.uid())
  );

-- jurisprudencia: leitura publica
drop policy if exists "juris_read" on public.jurisprudencia;
create policy "juris_read" on public.jurisprudencia for select using (true);

drop policy if exists "logs_own" on public.logs_ia;
create policy "logs_own" on public.logs_ia
  for select using (
    caso_id is null or exists (select 1 from public.casos c where c.id = logs_ia.caso_id and c.usuario_id = auth.uid())
  );

-- Trigger: cria perfil automaticamente no signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.perfis (id, nome)
  values (new.id, coalesce(new.raw_user_meta_data->>'nome', new.email))
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Trigger: atualizado_em
create or replace function public.touch_updated()
returns trigger language plpgsql as $$
begin new.atualizado_em = now(); return new; end; $$;

drop trigger if exists trg_perfis_touch on public.perfis;
create trigger trg_perfis_touch before update on public.perfis
  for each row execute procedure public.touch_updated();

drop trigger if exists trg_casos_touch on public.casos;
create trigger trg_casos_touch before update on public.casos
  for each row execute procedure public.touch_updated();

-- Seed jurisprudencia minima
insert into public.jurisprudencia (tribunal, numero_processo, ementa, area, tema, data_julgamento) values
('STJ','REsp 1.876.543/SP','Alimentos provisórios. Critério necessidade-possibilidade. Percentual de 30% da renda do alimentante como parâmetro inicial, passível de revisão.','familia','alimentos_provisorios_percentual','2023-08-15'),
('STJ','REsp 1.923.456/RJ','Guarda compartilhada como regra. Melhor interesse da criança. Exceção só com prova robusta de risco.','familia','guarda_compartilhada_regra','2023-11-20'),
('TJSP','Apelação 1234567-89.2023.8.26.0000','Medida protetiva de urgência. Lei Maria da Penha. Palavra da vítima suficiente. Independe de BO prévio.','familia','medida_protetiva_palavra_vitima','2024-02-10')
on conflict do nothing;
