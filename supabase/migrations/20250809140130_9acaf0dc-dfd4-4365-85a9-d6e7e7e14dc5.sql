-- Helper: get current user's app role from profiles (bypasses RLS)
create or replace function public.get_current_user_role()
returns user_role
language sql stable security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

-- Categories: public readable; only admins can write
alter table public.categories enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'categories' and policyname = 'Public can view categories'
  ) then
    create policy "Public can view categories"
      on public.categories
      for select
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'categories' and policyname = 'Only admins can insert categories'
  ) then
    create policy "Only admins can insert categories"
      on public.categories
      for insert
      with check (public.get_current_user_role() = 'admin');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'categories' and policyname = 'Only admins can update categories'
  ) then
    create policy "Only admins can update categories"
      on public.categories
      for update
      using (public.get_current_user_role() = 'admin');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'categories' and policyname = 'Only admins can delete categories'
  ) then
    create policy "Only admins can delete categories"
      on public.categories
      for delete
      using (public.get_current_user_role() = 'admin');
  end if;
end $$;

-- Products: public can view active listings; owners/admins manage
alter table public.products enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'products' and policyname = 'Public can view active products'
  ) then
    create policy "Public can view active products"
      on public.products
      for select
      using (coalesce(is_active, true) = true and deleted_at is null);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'products' and policyname = 'Owners and admins can view own products'
  ) then
    create policy "Owners and admins can view own products"
      on public.products
      for select
      using ((auth.uid() = user_id) or (public.get_current_user_role() = 'admin'));
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'products' and policyname = 'Users can insert own products'
  ) then
    create policy "Users can insert own products"
      on public.products
      for insert
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'products' and policyname = 'Owners and admins can update products'
  ) then
    create policy "Owners and admins can update products"
      on public.products
      for update
      using ((auth.uid() = user_id) or (public.get_current_user_role() = 'admin'));
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'products' and policyname = 'Owners and admins can delete products'
  ) then
    create policy "Owners and admins can delete products"
      on public.products
      for delete
      using ((auth.uid() = user_id) or (public.get_current_user_role() = 'admin'));
  end if;
end $$;

-- products_scraped: restrict to admins only
alter table public.products_scraped enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'products_scraped' and policyname = 'Only admins can view scraped products'
  ) then
    create policy "Only admins can view scraped products"
      on public.products_scraped
      for select
      using (public.get_current_user_role() = 'admin');
  end if;
end $$;