-- Storage bucket for companion photos

insert into storage.buckets (id, name, public)
values ('companion-photos', 'companion-photos', true)
on conflict do nothing;

-- Authenticated users may upload to the bucket
create policy if not exists "companions upload own photos"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'companion-photos');

-- Anyone may read companion photos
create policy if not exists "public read companion photos"
  on storage.objects for select to public
  using (bucket_id = 'companion-photos');

-- Authenticated users may delete their own uploads
create policy if not exists "companions delete own photos"
  on storage.objects for delete to authenticated
  using (bucket_id = 'companion-photos');
