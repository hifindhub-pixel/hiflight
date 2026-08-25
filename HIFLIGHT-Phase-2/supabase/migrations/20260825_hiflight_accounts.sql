-- HiFlight — comptes, profils, World Map et passeport
-- À exécuter une seule fois dans Supabase > SQL Editor.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  avatar_url text,
  preferred_language text not null default 'fr',
  preferred_currency text not null default 'EUR',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.visited_countries (
  user_id uuid not null references auth.users(id) on delete cascade,
  country_code text not null check (country_code ~ '^[A-Z]{3}$'),
  visited boolean not null default false,
  wishlist boolean not null default false,
  visited_at date,
  note text check (char_length(note) <= 1000),
  photo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, country_code),
  constraint one_country_state check (not (visited and wishlist))
);

alter table public.profiles enable row level security;
alter table public.visited_countries enable row level security;

revoke all on table public.profiles from anon;
revoke all on table public.visited_countries from anon;
grant select, insert, update, delete on table public.profiles to authenticated;
grant select, insert, update, delete on table public.visited_countries to authenticated;

drop policy if exists "Users read own profile" on public.profiles;
create policy "Users read own profile" on public.profiles for select to authenticated using ((select auth.uid()) = id);
drop policy if exists "Users insert own profile" on public.profiles;
create policy "Users insert own profile" on public.profiles for insert to authenticated with check ((select auth.uid()) = id);
drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
drop policy if exists "Users delete own profile" on public.profiles;
create policy "Users delete own profile" on public.profiles for delete to authenticated using ((select auth.uid()) = id);

drop policy if exists "Users read own countries" on public.visited_countries;
create policy "Users read own countries" on public.visited_countries for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "Users insert own countries" on public.visited_countries;
create policy "Users insert own countries" on public.visited_countries for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "Users update own countries" on public.visited_countries;
create policy "Users update own countries" on public.visited_countries for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists "Users delete own countries" on public.visited_countries;
create policy "Users delete own countries" on public.visited_countries for delete to authenticated using ((select auth.uid()) = user_id);

create or replace function public.set_updated_at()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
drop trigger if exists visited_countries_set_updated_at on public.visited_countries;
create trigger visited_countries_set_updated_at before update on public.visited_countries for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();
