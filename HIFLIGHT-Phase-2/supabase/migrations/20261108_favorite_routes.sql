-- HiFlight — favoris de trajets (cœur sur les pages de vols)
-- À exécuter une seule fois dans Supabase > SQL Editor.

create table if not exists public.favorite_routes (
  user_id uuid not null references auth.users(id) on delete cascade,
  route_slug text not null check (route_slug ~ '^[a-z0-9-]{3,80}$'),
  created_at timestamptz not null default now(),
  primary key (user_id, route_slug)
);

create index if not exists favorite_routes_user_created_idx on public.favorite_routes (user_id, created_at desc);

alter table public.favorite_routes enable row level security;

revoke all on table public.favorite_routes from anon;
grant select, insert, delete on table public.favorite_routes to authenticated;

drop policy if exists "Users read own favorite routes" on public.favorite_routes;
create policy "Users read own favorite routes" on public.favorite_routes for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "Users insert own favorite routes" on public.favorite_routes;
create policy "Users insert own favorite routes" on public.favorite_routes for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "Users delete own favorite routes" on public.favorite_routes;
create policy "Users delete own favorite routes" on public.favorite_routes for delete to authenticated using ((select auth.uid()) = user_id);
