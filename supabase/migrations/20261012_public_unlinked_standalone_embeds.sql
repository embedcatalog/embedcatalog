create policy "Public can view approved unlinked standalone embeds"
  on public.standalone_embeds
  for select to anon, authenticated
  using (status = 'approved' and project_id is null);

create policy "Public can view profiles with approved unlinked standalone embeds"
  on public.standalone_embed_profiles
  for select to anon, authenticated
  using (
    exists (
      select 1
      from public.standalone_embeds
      where standalone_embeds.owner_id = standalone_embed_profiles.owner_id
        and standalone_embeds.status = 'approved'
        and standalone_embeds.project_id is null
    )
  );