-- Add photos array to companions
-- The first photo in photos[] is the main/cover photo.
-- avatar_url on profiles remains as fallback when photos is empty.

alter table public.companions
  add column if not exists photos text[] not null default '{}';
