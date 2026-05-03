create extension if not exists pgcrypto;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  short_description text,
  description text,
  price numeric not null check (price >= 0),
  old_price numeric check (old_price is null or old_price >= 0),
  category text not null,
  subcategory text,
  sizes text[] default '{}',
  colors text[] default '{}',
  images text[] default '{}',
  main_image text,
  is_available boolean default true,
  is_featured boolean default false,
  is_promo boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value jsonb not null default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin')),
  created_at timestamptz default now()
);

create index if not exists products_category_idx on public.products (category);
create index if not exists products_created_at_idx on public.products (created_at desc);
create index if not exists products_available_idx on public.products (is_available);
create index if not exists products_promo_idx on public.products (is_promo);
create index if not exists products_featured_idx on public.products (is_featured);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists set_site_settings_updated_at on public.site_settings;
create trigger set_site_settings_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

create or replace function public.is_admin(user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_profiles
    where id = user_id
      and role = 'admin'
  );
$$;

revoke all on function public.is_admin(uuid) from public;
grant execute on function public.is_admin(uuid) to anon, authenticated;

alter table public.products enable row level security;
alter table public.site_settings enable row level security;
alter table public.admin_profiles enable row level security;

drop policy if exists "Visitors can read available products" on public.products;
create policy "Visitors can read available products"
on public.products
for select
to anon, authenticated
using (is_available = true);

drop policy if exists "Admins can read all products" on public.products;
create policy "Admins can read all products"
on public.products
for select
to authenticated
using (public.is_admin(auth.uid()));

drop policy if exists "Admins can insert products" on public.products;
create policy "Admins can insert products"
on public.products
for insert
to authenticated
with check (public.is_admin(auth.uid()));

drop policy if exists "Admins can update products" on public.products;
create policy "Admins can update products"
on public.products
for update
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "Admins can delete products" on public.products;
create policy "Admins can delete products"
on public.products
for delete
to authenticated
using (public.is_admin(auth.uid()));

drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings"
on public.site_settings
for select
to anon, authenticated
using (true);

drop policy if exists "Admins can manage site settings" on public.site_settings;
create policy "Admins can manage site settings"
on public.site_settings
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "Users can read their admin profile" on public.admin_profiles;
create policy "Users can read their admin profile"
on public.admin_profiles
for select
to authenticated
using (id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists "Admins can manage admin profiles" on public.admin_profiles;
create policy "Admins can manage admin profiles"
on public.admin_profiles
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read product images" on storage.objects;
create policy "Public can read product images"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'product-images');

drop policy if exists "Admins can upload product images" on storage.objects;
create policy "Admins can upload product images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'product-images' and public.is_admin(auth.uid()));

drop policy if exists "Admins can update product images" on storage.objects;
create policy "Admins can update product images"
on storage.objects
for update
to authenticated
using (bucket_id = 'product-images' and public.is_admin(auth.uid()))
with check (bucket_id = 'product-images' and public.is_admin(auth.uid()));

drop policy if exists "Admins can delete product images" on storage.objects;
create policy "Admins can delete product images"
on storage.objects
for delete
to authenticated
using (bucket_id = 'product-images' and public.is_admin(auth.uid()));

insert into public.site_settings (key, value)
values
  ('store_name', '"Maison Max"'::jsonb),
  ('whatsapp_number', '"221774957211"'::jsonb),
  ('delivery_zones', '["Dakar","Pikine","Guédiawaye","Rufisque","Thiès","Mbour","Saint-Louis","Touba","Kaolack","Ziguinchor"]'::jsonb)
on conflict (key) do update set value = excluded.value;

insert into public.products (
  name,
  slug,
  short_description,
  description,
  price,
  old_price,
  category,
  subcategory,
  sizes,
  colors,
  images,
  main_image,
  is_available,
  is_featured,
  is_promo
)
values
  (
    'Robe elegante wax',
    'robe-elegante-wax',
    'Robe fluide en wax premium, coupe chic pour ceremonies et sorties.',
    'Robe elegante confectionnee dans un tissu wax lumineux avec une coupe confortable. Ideale pour les receptions, les sorties a Dakar et les evenements familiaux.',
    15000,
    20000,
    'robes',
    'Femme',
    array['S','M','L','XL'],
    array['Rouge','Jaune','Bleu'],
    array['https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80'],
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80',
    true,
    true,
    true
  ),
  (
    'Boubou homme brode',
    'boubou-homme-brode',
    'Boubou deux pieces avec broderie sobre et finition premium.',
    'Boubou homme ample, elegant et facile a porter. Finitions propres, col brode et tissu agreable pour les grandes occasions.',
    28000,
    35000,
    'boubous',
    'Homme',
    array['M','L','XL','XXL'],
    array['Blanc','Bleu nuit','Beige'],
    array['https://images.unsplash.com/photo-1608755728617-aefab37d2edd?auto=format&fit=crop&w=900&q=80'],
    'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?auto=format&fit=crop&w=900&q=80',
    true,
    true,
    true
  ),
  (
    'Chemise homme en lin',
    'chemise-homme-lin',
    'Chemise respirante, coupe moderne et facile a associer.',
    'Chemise homme en lin melange pour les journees chaudes. Col propre, coupe actuelle et boutons ton sur ton.',
    12000,
    15000,
    'chemises',
    'Homme',
    array['M','L','XL'],
    array['Blanc','Ciel','Sable'],
    array['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80'],
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80',
    true,
    false,
    true
  ),
  (
    'Boubou enfant ceremonie',
    'boubou-enfant-ceremonie',
    'Tenue enfant confortable pour Tabaski, baptemes et fetes.',
    'Boubou enfant doux et leger avec une belle finition. Disponible en plusieurs tailles et couleurs lumineuses.',
    10000,
    13000,
    'vetements-enfants',
    'Enfant',
    array['2 ans','4 ans','6 ans','8 ans'],
    array['Blanc','Bleu','Rose'],
    array['https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=900&q=80'],
    'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=900&q=80',
    true,
    true,
    true
  )
on conflict (slug) do nothing;

-- Apres creation du premier utilisateur dans Supabase Auth, donnez-lui le role admin :
-- insert into public.admin_profiles (id, role)
-- select id, 'admin' from auth.users where email = 'vendeur@maisonmax.sn'
-- on conflict (id) do update set role = excluded.role;
