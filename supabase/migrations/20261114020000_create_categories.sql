create table if not exists public.categories (
  name text primary key check (length(btrim(name)) > 0),
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

drop policy if exists "Categories are readable by everyone" on public.categories;
create policy "Categories are readable by everyone"
  on public.categories for select
  using (true);

create unique index if not exists categories_name_lower_key
  on public.categories (lower(name));

insert into public.categories (name)
values
  ('AI & Machine Learning'),
  ('Developer Tools'),
  ('Design'),
  ('Education'),
  ('Finance'),
  ('Games'),
  ('Open Source'),
  ('Productivity'),
  ('Security'),
  ('Social'),
  ('SaaS'),
  ('Other')
on conflict do nothing;

insert into public.categories (name)
select distinct on (lower(btrim(category)))
  btrim(category)
from public.projects
cross join lateral unnest(categories) as project_category(category)
where nullif(btrim(category), '') is not null
order by lower(btrim(category)), btrim(category)
on conflict do nothing;

create or replace function public.sync_project_categories()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.categories (name)
  select distinct on (lower(btrim(category)))
    btrim(category)
  from unnest(new.categories) as project_category(category)
  where nullif(btrim(category), '') is not null
  order by lower(btrim(category)), btrim(category)
  on conflict do nothing;

  return new;
end;
$$;

drop trigger if exists sync_project_categories on public.projects;
create trigger sync_project_categories
  after insert or update of categories on public.projects
  for each row
  execute function public.sync_project_categories();
