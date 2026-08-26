-- Répare les installations antérieures où les tables existaient déjà avant
-- l'ajout des colonnes utilisées par le trigger public.set_updated_at().

alter table public.profiles
  add column if not exists updated_at timestamptz not null default now();

alter table public.visited_countries
  add column if not exists updated_at timestamptz not null default now();
