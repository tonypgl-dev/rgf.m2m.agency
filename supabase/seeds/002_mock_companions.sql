-- ─────────────────────────────────────────────────────────────────────────────
-- Seed: 10 mock companion profiles with photos
-- Safe to re-run (ON CONFLICT DO UPDATE)
-- ─────────────────────────────────────────────────────────────────────────────

do $$
declare
  -- Fixed profile UUIDs (auth.users / profiles)
  ids uuid[] := array[
    'cc000001-0000-0000-0000-000000000001',
    'cc000002-0000-0000-0000-000000000002',
    'cc000003-0000-0000-0000-000000000003',
    'cc000004-0000-0000-0000-000000000004',
    'cc000005-0000-0000-0000-000000000005',
    'cc000006-0000-0000-0000-000000000006',
    'cc000007-0000-0000-0000-000000000007',
    'cc000008-0000-0000-0000-000000000008',
    'cc000009-0000-0000-0000-000000000009',
    'cc000010-0000-0000-0000-000000000010'
  ];

  -- Fixed companion-row UUIDs (companions table)
  comp_ids uuid[] := array[
    'c1000001-0000-0000-0000-000000000001',
    'c1000002-0000-0000-0000-000000000002',
    'c1000003-0000-0000-0000-000000000003',
    'c1000004-0000-0000-0000-000000000004',
    'c1000005-0000-0000-0000-000000000005',
    'c1000006-0000-0000-0000-000000000006',
    'c1000007-0000-0000-0000-000000000007',
    'c1000008-0000-0000-0000-000000000008',
    'c1000009-0000-0000-0000-000000000009',
    'c1000010-0000-0000-0000-000000000010'
  ];
begin

  -- ── 1. auth.users ────────────────────────────────────────────────────────────
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) values
    (ids[1],  '00000000-0000-0000-0000-000000000000','authenticated','authenticated','ana.pop@mock.roamly',       crypt('Mock1234!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
    (ids[2],  '00000000-0000-0000-0000-000000000000','authenticated','authenticated','maria.ionescu@mock.roamly', crypt('Mock1234!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
    (ids[3],  '00000000-0000-0000-0000-000000000000','authenticated','authenticated','elena.david@mock.roamly',   crypt('Mock1234!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
    (ids[4],  '00000000-0000-0000-0000-000000000000','authenticated','authenticated','sofia.stan@mock.roamly',    crypt('Mock1234!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
    (ids[5],  '00000000-0000-0000-0000-000000000000','authenticated','authenticated','diana.marin@mock.roamly',   crypt('Mock1234!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
    (ids[6],  '00000000-0000-0000-0000-000000000000','authenticated','authenticated','ioana.rusu@mock.roamly',    crypt('Mock1234!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
    (ids[7],  '00000000-0000-0000-0000-000000000000','authenticated','authenticated','alexandra.nicu@mock.roamly',crypt('Mock1234!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
    (ids[8],  '00000000-0000-0000-0000-000000000000','authenticated','authenticated','raluca.popa@mock.roamly',   crypt('Mock1234!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
    (ids[9],  '00000000-0000-0000-0000-000000000000','authenticated','authenticated','bianca.dinu@mock.roamly',   crypt('Mock1234!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
    (ids[10], '00000000-0000-0000-0000-000000000000','authenticated','authenticated','laura.gheorghe@mock.roamly',crypt('Mock1234!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now())
  on conflict (id) do nothing;

  -- ── 2. auth.identities ───────────────────────────────────────────────────────
  insert into auth.identities (id, user_id, provider, identity_data, provider_id, last_sign_in_at, created_at, updated_at)
  values
    (ids[1],  ids[1],  'email', json_build_object('sub', ids[1]::text,  'email', 'ana.pop@mock.roamly'),       'ana.pop@mock.roamly',       now(), now(), now()),
    (ids[2],  ids[2],  'email', json_build_object('sub', ids[2]::text,  'email', 'maria.ionescu@mock.roamly'), 'maria.ionescu@mock.roamly', now(), now(), now()),
    (ids[3],  ids[3],  'email', json_build_object('sub', ids[3]::text,  'email', 'elena.david@mock.roamly'),   'elena.david@mock.roamly',   now(), now(), now()),
    (ids[4],  ids[4],  'email', json_build_object('sub', ids[4]::text,  'email', 'sofia.stan@mock.roamly'),    'sofia.stan@mock.roamly',    now(), now(), now()),
    (ids[5],  ids[5],  'email', json_build_object('sub', ids[5]::text,  'email', 'diana.marin@mock.roamly'),   'diana.marin@mock.roamly',   now(), now(), now()),
    (ids[6],  ids[6],  'email', json_build_object('sub', ids[6]::text,  'email', 'ioana.rusu@mock.roamly'),    'ioana.rusu@mock.roamly',    now(), now(), now()),
    (ids[7],  ids[7],  'email', json_build_object('sub', ids[7]::text,  'email', 'alexandra.nicu@mock.roamly'),'alexandra.nicu@mock.roamly',now(), now(), now()),
    (ids[8],  ids[8],  'email', json_build_object('sub', ids[8]::text,  'email', 'raluca.popa@mock.roamly'),   'raluca.popa@mock.roamly',   now(), now(), now()),
    (ids[9],  ids[9],  'email', json_build_object('sub', ids[9]::text,  'email', 'bianca.dinu@mock.roamly'),   'bianca.dinu@mock.roamly',   now(), now(), now()),
    (ids[10], ids[10], 'email', json_build_object('sub', ids[10]::text, 'email', 'laura.gheorghe@mock.roamly'),'laura.gheorghe@mock.roamly',now(), now(), now())
  on conflict (provider, provider_id) do nothing;

  -- ── 3. profiles ──────────────────────────────────────────────────────────────
  insert into public.profiles (id, role, full_name, avatar_url, city, created_at)
  values
    (ids[1],  'companion', 'Ana Pop',         'https://randomuser.me/api/portraits/women/11.jpg', 'Bucharest', now()),
    (ids[2],  'companion', 'Maria Ionescu',   'https://randomuser.me/api/portraits/women/21.jpg', 'Cluj',      now()),
    (ids[3],  'companion', 'Elena David',     'https://randomuser.me/api/portraits/women/31.jpg', 'Brasov',    now()),
    (ids[4],  'companion', 'Sofia Stan',      'https://randomuser.me/api/portraits/women/44.jpg', 'Sibiu',     now()),
    (ids[5],  'companion', 'Diana Marin',     'https://randomuser.me/api/portraits/women/53.jpg', 'Bucharest', now()),
    (ids[6],  'companion', 'Ioana Rusu',      'https://randomuser.me/api/portraits/women/62.jpg', 'Timisoara', now()),
    (ids[7],  'companion', 'Alexandra Nicu',  'https://randomuser.me/api/portraits/women/72.jpg', 'Cluj',      now()),
    (ids[8],  'companion', 'Raluca Popa',     'https://randomuser.me/api/portraits/women/17.jpg', 'Bucharest', now()),
    (ids[9],  'companion', 'Bianca Dinu',     'https://randomuser.me/api/portraits/women/26.jpg', 'Brasov',    now()),
    (ids[10], 'companion', 'Laura Gheorghe',  'https://randomuser.me/api/portraits/women/38.jpg', 'Sibiu',     now())
  on conflict (id) do update set
    full_name  = excluded.full_name,
    avatar_url = excluded.avatar_url,
    city       = excluded.city;

  -- ── 4. companions ────────────────────────────────────────────────────────────
  insert into public.companions (id, profile_id, bio, hourly_rate, languages, activities, rating_avg, total_reviews, verified, photos)
  values
    (comp_ids[1], ids[1],  'Art lover and coffee enthusiast. I know all the hidden gems in Bucharest — from street art to rooftop bars.',
      20, array['English','French'],          array['City Tour','Coffee & Chat','Museum Visit','Rooftop Bar'], 4.9, 34, true,
      array['https://randomuser.me/api/portraits/women/11.jpg','https://randomuser.me/api/portraits/women/12.jpg','https://randomuser.me/api/portraits/women/13.jpg']),

    (comp_ids[2],  ids[2],  'Architecture student with a passion for Cluj''s creative scene. Let me show you the city beyond the tourist map.',
      18, array['English','German'],          array['City Tour','Dinner','Art Galleries','Hiking'],            4.7, 21, true,
      array['https://randomuser.me/api/portraits/women/21.jpg','https://randomuser.me/api/portraits/women/22.jpg','https://randomuser.me/api/portraits/women/23.jpg']),

    (comp_ids[3],  ids[3],  'Brasov local, hiking guide on weekends. I can take you to the best viewpoints and cozy mountain restaurants.',
      22, array['English','Italian'],         array['Hiking','Dinner','City Tour','Photography Walk'],         4.8, 18, true,
      array['https://randomuser.me/api/portraits/women/31.jpg','https://randomuser.me/api/portraits/women/32.jpg','https://randomuser.me/api/portraits/women/33.jpg']),

    (comp_ids[4],  ids[4],  'Fluent in 4 languages, worked in hospitality for 5 years. Sibiu has the most beautiful medieval center in Romania.',
      25, array['English','French','Spanish','German'], array['City Tour','Dinner','Museum Visit','Coffee & Chat'], 4.6, 29, true,
      array['https://randomuser.me/api/portraits/women/44.jpg','https://randomuser.me/api/portraits/women/45.jpg','https://randomuser.me/api/portraits/women/46.jpg']),

    (comp_ids[5],  ids[5],  'Yoga instructor and foodie. I know every brunch spot and vegan restaurant in Bucharest worth visiting.',
      20, array['English'],                   array['Brunch','Coffee & Chat','City Tour','Yoga Session'],       4.8, 41, true,
      array['https://randomuser.me/api/portraits/women/53.jpg','https://randomuser.me/api/portraits/women/54.jpg','https://randomuser.me/api/portraits/women/55.jpg']),

    (comp_ids[6],  ids[6],  'Timisoara was the first city to have electric street lighting in Europe — and I can tell you a hundred more stories.',
      18, array['English','French'],          array['City Tour','Dinner','Museum Visit','Coffee & Chat'],       4.5, 15, true,
      array['https://randomuser.me/api/portraits/women/62.jpg','https://randomuser.me/api/portraits/women/63.jpg','https://randomuser.me/api/portraits/women/64.jpg']),

    (comp_ids[7],  ids[7],  'Event organizer by day, jazz fan by night. Cluj''s nightlife and cultural scene are my specialty.',
      22, array['English','German'],          array['Nightlife','Concert','Dinner','Coffee & Chat'],            4.7, 23, true,
      array['https://randomuser.me/api/portraits/women/72.jpg','https://randomuser.me/api/portraits/women/73.jpg','https://randomuser.me/api/portraits/women/74.jpg']),

    (comp_ids[8],  ids[8],  'History graduate, passionate about Bucharest''s communist era architecture and the stories behind it.',
      20, array['English','Spanish'],         array['City Tour','Museum Visit','Photography Walk','Dinner'],    4.9, 37, true,
      array['https://randomuser.me/api/portraits/women/17.jpg','https://randomuser.me/api/portraits/women/18.jpg','https://randomuser.me/api/portraits/women/19.jpg']),

    (comp_ids[9],  ids[9],  'Nature guide and plant lover. Brasov is surrounded by forests — let me take you off the beaten path.',
      20, array['English'],                   array['Hiking','Photography Walk','City Tour','Coffee & Chat'],   4.6, 12, true,
      array['https://randomuser.me/api/portraits/women/26.jpg','https://randomuser.me/api/portraits/women/27.jpg','https://randomuser.me/api/portraits/women/28.jpg']),

    (comp_ids[10], ids[10], 'Former tour guide turned freelancer. Sibiu''s Christmas market is magical — but the city is beautiful year-round.',
      23, array['English','French','Italian'],array['City Tour','Dinner','Museum Visit','Coffee & Chat'],       4.8, 28, true,
      array['https://randomuser.me/api/portraits/women/38.jpg','https://randomuser.me/api/portraits/women/39.jpg','https://randomuser.me/api/portraits/women/40.jpg'])

  on conflict (id) do update set
    bio          = excluded.bio,
    hourly_rate  = excluded.hourly_rate,
    languages    = excluded.languages,
    activities   = excluded.activities,
    rating_avg   = excluded.rating_avg,
    total_reviews = excluded.total_reviews,
    verified     = excluded.verified,
    photos       = excluded.photos;

  -- ── 5. availability_slots (next 5 days, 2 slots/day each) ───────────────────
  insert into public.availability_slots (companion_id, date, time_start, time_end, is_booked)
  select
    c.id,
    current_date + d.day_offset,
    s.time_start,
    s.time_end,
    false
  from public.companions c
  cross join (values (1),(2),(3),(4),(5)) as d(day_offset)
  cross join (values ('10:00'::time,'13:00'::time),('14:00'::time,'18:00'::time)) as s(time_start, time_end)
  where c.profile_id = any(ids)
  on conflict do nothing;

end $$;
