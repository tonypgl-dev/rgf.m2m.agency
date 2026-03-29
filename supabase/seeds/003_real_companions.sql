-- ────────────────────────────────────────────────────────────────────────────
-- Seed 003: real companions from Poze/ photos
-- Safe to re-run (ON CONFLICT DO UPDATE / DO NOTHING)
-- ────────────────────────────────────────────────────────────────────────────

do $cleanup$
begin
  delete from public.bookings b
    using public.availability_slots s
    join public.companions c on c.id = s.companion_id
    join public.profiles p   on p.id = c.profile_id
    join auth.users u        on u.id = p.id
    where b.slot_id = s.id
      and (u.email like '%@mock.roamly' or u.email like '%@test.%' or u.email = 'test@test.com');
  delete from public.availability_slots s
    using public.companions c
    join public.profiles p on p.id = c.profile_id
    join auth.users u      on u.id = p.id
    where s.companion_id = c.id
      and (u.email like '%@mock.roamly' or u.email like '%@test.%' or u.email = 'test@test.com');
  delete from public.companions c
    using public.profiles p join auth.users u on u.id = p.id
    where c.profile_id = p.id
      and (u.email like '%@mock.roamly' or u.email like '%@test.%' or u.email = 'test@test.com');
  delete from public.profiles p
    using auth.users u where p.id = u.id
      and (u.email like '%@mock.roamly' or u.email like '%@test.%' or u.email = 'test@test.com');
  delete from auth.identities
    where user_id in (
      select id from auth.users
      where email like '%@mock.roamly' or email like '%@test.%' or email = 'test@test.com'
    );
  delete from auth.users
    where email like '%@mock.roamly' or email like '%@test.%' or email = 'test@test.com';
end $cleanup$;

do $seed$
declare
  v_p1 uuid := 'a0000001-0000-0000-0000-000000000001';
  v_c1 uuid := 'b0000001-0000-0000-0000-000000000001';
  v_p2 uuid := 'a0000002-0000-0000-0000-000000000002';
  v_c2 uuid := 'b0000002-0000-0000-0000-000000000002';
  v_p3 uuid := 'a0000003-0000-0000-0000-000000000003';
  v_c3 uuid := 'b0000003-0000-0000-0000-000000000003';
  v_p4 uuid := 'a0000004-0000-0000-0000-000000000004';
  v_c4 uuid := 'b0000004-0000-0000-0000-000000000004';
  v_p5 uuid := 'a0000005-0000-0000-0000-000000000005';
  v_c5 uuid := 'b0000005-0000-0000-0000-000000000005';
  v_p6 uuid := 'a0000006-0000-0000-0000-000000000006';
  v_c6 uuid := 'b0000006-0000-0000-0000-000000000006';
  v_p7 uuid := 'a0000007-0000-0000-0000-000000000007';
  v_c7 uuid := 'b0000007-0000-0000-0000-000000000007';
  v_p8 uuid := 'a0000008-0000-0000-0000-000000000008';
  v_c8 uuid := 'b0000008-0000-0000-0000-000000000008';
  v_p9 uuid := 'a0000009-0000-0000-0000-000000000009';
  v_c9 uuid := 'b0000009-0000-0000-0000-000000000009';
  v_p10 uuid := 'a000000a-0000-0000-0000-00000000000a';
  v_c10 uuid := 'b000000a-0000-0000-0000-00000000000a';
  v_p11 uuid := 'a000000b-0000-0000-0000-00000000000b';
  v_c11 uuid := 'b000000b-0000-0000-0000-00000000000b';
  v_p12 uuid := 'a000000c-0000-0000-0000-00000000000c';
  v_c12 uuid := 'b000000c-0000-0000-0000-00000000000c';
  v_p13 uuid := 'a000000d-0000-0000-0000-00000000000d';
  v_c13 uuid := 'b000000d-0000-0000-0000-00000000000d';
  v_p14 uuid := 'a000000e-0000-0000-0000-00000000000e';
  v_c14 uuid := 'b000000e-0000-0000-0000-00000000000e';
begin

  -- auth.users
  insert into auth.users
    (id,instance_id,aud,role,email,encrypted_password,email_confirmed_at,raw_app_meta_data,raw_user_meta_data,created_at,updated_at)
  values
    (v_p1,'00000000-0000-0000-0000-000000000000','authenticated','authenticated','ana@companions.roamly',crypt('Roamly2025!',gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}','{}',now(),now()),
    (v_p2,'00000000-0000-0000-0000-000000000000','authenticated','authenticated','maria@companions.roamly',crypt('Roamly2025!',gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}','{}',now(),now()),
    (v_p3,'00000000-0000-0000-0000-000000000000','authenticated','authenticated','elena@companions.roamly',crypt('Roamly2025!',gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}','{}',now(),now()),
    (v_p4,'00000000-0000-0000-0000-000000000000','authenticated','authenticated','sofia@companions.roamly',crypt('Roamly2025!',gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}','{}',now(),now()),
    (v_p5,'00000000-0000-0000-0000-000000000000','authenticated','authenticated','diana@companions.roamly',crypt('Roamly2025!',gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}','{}',now(),now()),
    (v_p6,'00000000-0000-0000-0000-000000000000','authenticated','authenticated','ioana@companions.roamly',crypt('Roamly2025!',gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}','{}',now(),now()),
    (v_p7,'00000000-0000-0000-0000-000000000000','authenticated','authenticated','alexandra@companions.roamly',crypt('Roamly2025!',gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}','{}',now(),now()),
    (v_p8,'00000000-0000-0000-0000-000000000000','authenticated','authenticated','raluca@companions.roamly',crypt('Roamly2025!',gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}','{}',now(),now()),
    (v_p9,'00000000-0000-0000-0000-000000000000','authenticated','authenticated','bianca@companions.roamly',crypt('Roamly2025!',gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}','{}',now(),now()),
    (v_p10,'00000000-0000-0000-0000-000000000000','authenticated','authenticated','laura@companions.roamly',crypt('Roamly2025!',gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}','{}',now(),now()),
    (v_p11,'00000000-0000-0000-0000-000000000000','authenticated','authenticated','cristina@companions.roamly',crypt('Roamly2025!',gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}','{}',now(),now()),
    (v_p12,'00000000-0000-0000-0000-000000000000','authenticated','authenticated','andreea@companions.roamly',crypt('Roamly2025!',gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}','{}',now(),now()),
    (v_p13,'00000000-0000-0000-0000-000000000000','authenticated','authenticated','monica@companions.roamly',crypt('Roamly2025!',gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}','{}',now(),now()),
    (v_p14,'00000000-0000-0000-0000-000000000000','authenticated','authenticated','gabriela@companions.roamly',crypt('Roamly2025!',gen_salt('bf')),now(),'{"provider":"email","providers":["email"]}','{}',now(),now())
  on conflict (id) do nothing;

  -- auth.identities
  insert into auth.identities (id,user_id,provider,identity_data,provider_id,last_sign_in_at,created_at,updated_at)
  values
    (v_p1,v_p1,'email',json_build_object('sub',v_p1::text,'email','ana@companions.roamly'),'ana@companions.roamly',now(),now(),now()),
    (v_p2,v_p2,'email',json_build_object('sub',v_p2::text,'email','maria@companions.roamly'),'maria@companions.roamly',now(),now(),now()),
    (v_p3,v_p3,'email',json_build_object('sub',v_p3::text,'email','elena@companions.roamly'),'elena@companions.roamly',now(),now(),now()),
    (v_p4,v_p4,'email',json_build_object('sub',v_p4::text,'email','sofia@companions.roamly'),'sofia@companions.roamly',now(),now(),now()),
    (v_p5,v_p5,'email',json_build_object('sub',v_p5::text,'email','diana@companions.roamly'),'diana@companions.roamly',now(),now(),now()),
    (v_p6,v_p6,'email',json_build_object('sub',v_p6::text,'email','ioana@companions.roamly'),'ioana@companions.roamly',now(),now(),now()),
    (v_p7,v_p7,'email',json_build_object('sub',v_p7::text,'email','alexandra@companions.roamly'),'alexandra@companions.roamly',now(),now(),now()),
    (v_p8,v_p8,'email',json_build_object('sub',v_p8::text,'email','raluca@companions.roamly'),'raluca@companions.roamly',now(),now(),now()),
    (v_p9,v_p9,'email',json_build_object('sub',v_p9::text,'email','bianca@companions.roamly'),'bianca@companions.roamly',now(),now(),now()),
    (v_p10,v_p10,'email',json_build_object('sub',v_p10::text,'email','laura@companions.roamly'),'laura@companions.roamly',now(),now(),now()),
    (v_p11,v_p11,'email',json_build_object('sub',v_p11::text,'email','cristina@companions.roamly'),'cristina@companions.roamly',now(),now(),now()),
    (v_p12,v_p12,'email',json_build_object('sub',v_p12::text,'email','andreea@companions.roamly'),'andreea@companions.roamly',now(),now(),now()),
    (v_p13,v_p13,'email',json_build_object('sub',v_p13::text,'email','monica@companions.roamly'),'monica@companions.roamly',now(),now(),now()),
    (v_p14,v_p14,'email',json_build_object('sub',v_p14::text,'email','gabriela@companions.roamly'),'gabriela@companions.roamly',now(),now(),now())
  on conflict (provider, provider_id) do nothing;

  -- profiles
  insert into public.profiles (id,role,full_name,avatar_url,city,created_at) values
    (v_p1,'companion','Ana','https://wsngzhetkiyqsvwukgli.supabase.co/storage/v1/object/public/companion-photos/1/viraj-upadhyay-lbJhXv8WtCI-unsplash.jpg','Bucharest',now()),
    (v_p2,'companion','Maria','https://wsngzhetkiyqsvwukgli.supabase.co/storage/v1/object/public/companion-photos/1-copy/bave-pictures-0C7GITVV15I-unsplash.jpg','Bucharest',now()),
    (v_p3,'companion','Elena','https://wsngzhetkiyqsvwukgli.supabase.co/storage/v1/object/public/companion-photos/2/david-suarez-KjJDiy7-JJg-unsplash.jpg','Brasov',now()),
    (v_p4,'companion','Sofia','https://wsngzhetkiyqsvwukgli.supabase.co/storage/v1/object/public/companion-photos/2-copy/bave-pictures-MYLy2FdQOLY-unsplash.jpg','Sibiu',now()),
    (v_p5,'companion','Diana','https://wsngzhetkiyqsvwukgli.supabase.co/storage/v1/object/public/companion-photos/new-folder/rick-govic-88INtIQjh9Y-unsplash.jpg','Bucharest',now()),
    (v_p6,'companion','Ioana','https://wsngzhetkiyqsvwukgli.supabase.co/storage/v1/object/public/companion-photos/new-folder-2/bave-pictures-RQdZf3K5BQg-unsplash.jpg','Timisoara',now()),
    (v_p7,'companion','Alexandra','https://wsngzhetkiyqsvwukgli.supabase.co/storage/v1/object/public/companion-photos/new-folder-2-copy/ahmadreza-najafi-O5VS3i0PT90-unsplash.jpg','Cluj',now()),
    (v_p8,'companion','Raluca','https://wsngzhetkiyqsvwukgli.supabase.co/storage/v1/object/public/companion-photos/new-folder-3/dan-kirk-formentera-SVxZxhqTi0Q-unsplash.jpg','Bucharest',now()),
    (v_p9,'companion','Bianca','https://wsngzhetkiyqsvwukgli.supabase.co/storage/v1/object/public/companion-photos/new-folder-3-copy/jabari-timothy-YeQT4peiJSU-unsplash.jpg','Brasov',now()),
    (v_p10,'companion','Laura','https://wsngzhetkiyqsvwukgli.supabase.co/storage/v1/object/public/companion-photos/new-folder-4/jabari-timothy-1nyvHrOVZPY-unsplash.jpg','Sibiu',now()),
    (v_p11,'companion','Cristina','https://wsngzhetkiyqsvwukgli.supabase.co/storage/v1/object/public/companion-photos/new-folder-5/jabari-timothy-8Dbk0NMbhUc-unsplash.jpg','Bucharest',now()),
    (v_p12,'companion','Andreea','https://wsngzhetkiyqsvwukgli.supabase.co/storage/v1/object/public/companion-photos/new-folder-6/anton-konovalov-LltdHXcITyo-unsplash.jpg','Cluj',now()),
    (v_p13,'companion','Monica','https://wsngzhetkiyqsvwukgli.supabase.co/storage/v1/object/public/companion-photos/new-folder-7/teodora-popa-photographer-WXqZZRvBSHs-unsplash.jpg','Timisoara',now()),
    (v_p14,'companion','Gabriela','https://wsngzhetkiyqsvwukgli.supabase.co/storage/v1/object/public/companion-photos/new-folder-copy/marius-muresan-14Vk4hQemrc-unsplash.jpg','Cluj',now())
  on conflict (id) do update set
    full_name=excluded.full_name, avatar_url=excluded.avatar_url, city=excluded.city;

  -- companions
  insert into public.companions (id,profile_id,bio,hourly_rate,languages,activities,rating_avg,total_reviews,verified,photos)
  values
    (v_c1,v_p1,
     'Bucharest is my city and I know every hidden courtyard and rooftop bar worth visiting. Art, coffee, and good conversation — that''s my idea of a perfect afternoon.',
     20,array['English','French'],array['City Tour','Coffee & Chat','Museum Visit','Rooftop Bar'],
     4.9,34,true,
     array['https://wsngzhetkiyqsvwukgli.supabase.co/storage/v1/object/public/companion-photos/1/viraj-upadhyay-lbJhXv8WtCI-unsplash.jpg','https://wsngzhetkiyqsvwukgli.supabase.co/storage/v1/object/public/companion-photos/1/viraj-upadhyay-s9-aGO8dMwA-unsplash.jpg','https://wsngzhetkiyqsvwukgli.supabase.co/storage/v1/object/public/companion-photos/1/viraj-upadhyay-sU7yBnOVNSk-unsplash.jpg']),
    (v_c2,v_p2,
     'Born and raised in Bucharest. I''ll take you past the tourist trail — through the neighborhoods people actually live in, the markets, the tiny restaurants.',
     22,array['English'],array['Dinner','City Tour','Photography Walk'],
     4.7,21,true,
     array['https://wsngzhetkiyqsvwukgli.supabase.co/storage/v1/object/public/companion-photos/1-copy/bave-pictures-0C7GITVV15I-unsplash.jpg','https://wsngzhetkiyqsvwukgli.supabase.co/storage/v1/object/public/companion-photos/1-copy/bave-pictures-tCra7DOodZg-unsplash.jpg']),
    (v_c3,v_p3,
     'I grew up in the shadow of the Carpathians. Brasov is best seen on foot, off the map. I can take you to viewpoints and mountain huts that don''t have Instagram pages yet.',
     24,array['English','Italian'],array['Hiking','Dinner','Photography Walk','Museum Visit'],
     4.8,18,true,
     array['https://wsngzhetkiyqsvwukgli.supabase.co/storage/v1/object/public/companion-photos/2/david-suarez-KjJDiy7-JJg-unsplash.jpg','https://wsngzhetkiyqsvwukgli.supabase.co/storage/v1/object/public/companion-photos/2/david-suarez-LJ05ZczmyjA-unsplash.jpg','https://wsngzhetkiyqsvwukgli.supabase.co/storage/v1/object/public/companion-photos/2/david-suarez-V3ZhhIGL3Hw-unsplash.jpg','https://wsngzhetkiyqsvwukgli.supabase.co/storage/v1/object/public/companion-photos/2/david-suarez-W4Opot_mJQU-unsplash.jpg']),
    (v_c4,v_p4,
     'Sibiu''s medieval streets never get old. Four languages, five years in hospitality — I''ll make sure you leave knowing the city like a local.',
     25,array['English','French','Spanish'],array['City Tour','Dinner','Museum Visit'],
     4.6,29,true,
     array['https://wsngzhetkiyqsvwukgli.supabase.co/storage/v1/object/public/companion-photos/2-copy/bave-pictures-MYLy2FdQOLY-unsplash.jpg','https://wsngzhetkiyqsvwukgli.supabase.co/storage/v1/object/public/companion-photos/2-copy/bave-pictures-fqXSBSuaS90-unsplash.jpg','https://wsngzhetkiyqsvwukgli.supabase.co/storage/v1/object/public/companion-photos/2-copy/bave-pictures-hm-AoSEsET4-unsplash.jpg','https://wsngzhetkiyqsvwukgli.supabase.co/storage/v1/object/public/companion-photos/2-copy/dan-kirk-formentera-9q-QAkCX0cs-unsplash.jpg','https://wsngzhetkiyqsvwukgli.supabase.co/storage/v1/object/public/companion-photos/2-copy/dan-kirk-formentera-rcC07PL3_v8-unsplash.jpg']),
    (v_c5,v_p5,
     'Yoga teacher, obsessive foodie, Bucharest native. Every brunch spot, every vegan café, every rooftop with a view — I have a list.',
     20,array['English'],array['Brunch','Coffee & Chat','City Tour','Rooftop Bar'],
     4.8,41,true,
     array['https://wsngzhetkiyqsvwukgli.supabase.co/storage/v1/object/public/companion-photos/new-folder/rick-govic-88INtIQjh9Y-unsplash.jpg']),
    (v_c6,v_p6,
     'Timisoara was the first city in Europe to have electric street lighting. I have a hundred more facts like that — and better stories behind each one.',
     18,array['English','French'],array['City Tour','Dinner','Museum Visit'],
     4.5,15,true,
     array['https://wsngzhetkiyqsvwukgli.supabase.co/storage/v1/object/public/companion-photos/new-folder-2/bave-pictures-RQdZf3K5BQg-unsplash.jpg','https://wsngzhetkiyqsvwukgli.supabase.co/storage/v1/object/public/companion-photos/new-folder-2/jabari-timothy-iRf8gC7oASU-unsplash.jpg']),
    (v_c7,v_p7,
     'By day I organize events, by night I''m at a jazz concert or a gallery opening. Cluj''s cultural scene is my specialty.',
     22,array['English','German'],array['Nightlife','Dinner','Coffee & Chat','City Tour'],
     4.7,23,true,
     array['https://wsngzhetkiyqsvwukgli.supabase.co/storage/v1/object/public/companion-photos/new-folder-2-copy/ahmadreza-najafi-O5VS3i0PT90-unsplash.jpg','https://wsngzhetkiyqsvwukgli.supabase.co/storage/v1/object/public/companion-photos/new-folder-2-copy/ahmadreza-najafi-ZUmdLCRzHvQ-unsplash.jpg','https://wsngzhetkiyqsvwukgli.supabase.co/storage/v1/object/public/companion-photos/new-folder-2-copy/ahmadreza-najafi-quGU34NnKEo-unsplash.jpg']),
    (v_c8,v_p8,
     'History degree, strong opinions about communist-era architecture. I''ll show you Bucharest as a city with layers, not just a postcard.',
     20,array['English','Spanish'],array['City Tour','Museum Visit','Dinner'],
     4.9,37,true,
     array['https://wsngzhetkiyqsvwukgli.supabase.co/storage/v1/object/public/companion-photos/new-folder-3/dan-kirk-formentera-SVxZxhqTi0Q-unsplash.jpg','https://wsngzhetkiyqsvwukgli.supabase.co/storage/v1/object/public/companion-photos/new-folder-3/dan-kirk-formentera-sYJiVDIV-Bw-unsplash.jpg']),
    (v_c9,v_p9,
     'Nature guide, plant lover. The forests around Brasov are full of trails that don''t appear on tourist maps — I know most of them.',
     20,array['English'],array['Hiking','Photography Walk','City Tour'],
     4.6,12,true,
     array['https://wsngzhetkiyqsvwukgli.supabase.co/storage/v1/object/public/companion-photos/new-folder-3-copy/jabari-timothy-YeQT4peiJSU-unsplash.jpg','https://wsngzhetkiyqsvwukgli.supabase.co/storage/v1/object/public/companion-photos/new-folder-3-copy/jabari-timothy-eS0oerH8JjE-unsplash.jpg','https://wsngzhetkiyqsvwukgli.supabase.co/storage/v1/object/public/companion-photos/new-folder-3-copy/jabari-timothy-gumNieEdICU-unsplash.jpg','https://wsngzhetkiyqsvwukgli.supabase.co/storage/v1/object/public/companion-photos/new-folder-3-copy/jabari-timothy-sNB4NJ7V2fk-unsplash.jpg']),
    (v_c10,v_p10,
     'Sibiu''s Christmas market gets all the attention, but the city is beautiful in every season. Let me show you why I never left.',
     23,array['English','French','Italian'],array['City Tour','Dinner','Museum Visit','Coffee & Chat'],
     4.8,28,true,
     array['https://wsngzhetkiyqsvwukgli.supabase.co/storage/v1/object/public/companion-photos/new-folder-4/jabari-timothy-1nyvHrOVZPY-unsplash.jpg','https://wsngzhetkiyqsvwukgli.supabase.co/storage/v1/object/public/companion-photos/new-folder-4/jabari-timothy-J5gIYkTNSQA-unsplash.jpg','https://wsngzhetkiyqsvwukgli.supabase.co/storage/v1/object/public/companion-photos/new-folder-4/jabari-timothy-S_oUxA7hRrg-unsplash.jpg','https://wsngzhetkiyqsvwukgli.supabase.co/storage/v1/object/public/companion-photos/new-folder-4/jabari-timothy-V3dM_T3oD-A-unsplash.jpg']),
    (v_c11,v_p11,
     'I know Bucharest the way a local knows it — the coffee shops with no sign outside, the parks nobody photographs, the shortcuts through old courtyards.',
     21,array['English'],array['Coffee & Chat','City Tour','Photography Walk'],
     4.7,19,true,
     array['https://wsngzhetkiyqsvwukgli.supabase.co/storage/v1/object/public/companion-photos/new-folder-5/jabari-timothy-8Dbk0NMbhUc-unsplash.jpg','https://wsngzhetkiyqsvwukgli.supabase.co/storage/v1/object/public/companion-photos/new-folder-5/jabari-timothy-SCOaLI7vdFA-unsplash.jpg','https://wsngzhetkiyqsvwukgli.supabase.co/storage/v1/object/public/companion-photos/new-folder-5/jabari-timothy-bFfa1cBkCxQ-unsplash.jpg']),
    (v_c12,v_p12,
     'Cluj has one of the best art scenes in Eastern Europe and most tourists walk straight past it. I can change that in an afternoon.',
     19,array['English','German'],array['City Tour','Dinner','Museum Visit'],
     4.6,31,true,
     array['https://wsngzhetkiyqsvwukgli.supabase.co/storage/v1/object/public/companion-photos/new-folder-6/anton-konovalov-LltdHXcITyo-unsplash.jpg']),
    (v_c13,v_p13,
     'I moved to Timisoara ten years ago and fell in love with its contradictions — Habsburg architecture, Romanian warmth, student energy. I''ll introduce you to all three.',
     28,array['English','French'],array['Dinner','Museum Visit','Coffee & Chat','Rooftop Bar'],
     4.9,45,true,
     array['https://wsngzhetkiyqsvwukgli.supabase.co/storage/v1/object/public/companion-photos/new-folder-7/teodora-popa-photographer-WXqZZRvBSHs-unsplash.jpg','https://wsngzhetkiyqsvwukgli.supabase.co/storage/v1/object/public/companion-photos/new-folder-7/teodora-popa-photographer-dzLdrQEgAqo-unsplash.jpg']),
    (v_c14,v_p14,
     'Cluj and the hills around it are underrated for hiking. I guide weekend walks and city tours with equal enthusiasm.',
     18,array['English'],array['Hiking','City Tour','Coffee & Chat'],
     4.5,8,true,
     array['https://wsngzhetkiyqsvwukgli.supabase.co/storage/v1/object/public/companion-photos/new-folder-copy/marius-muresan-14Vk4hQemrc-unsplash.jpg','https://wsngzhetkiyqsvwukgli.supabase.co/storage/v1/object/public/companion-photos/new-folder-copy/marius-muresan-fgtr4xbSxC8-unsplash.jpg','https://wsngzhetkiyqsvwukgli.supabase.co/storage/v1/object/public/companion-photos/new-folder-copy/marius-muresan-jgPE7Rget-Q-unsplash.jpg','https://wsngzhetkiyqsvwukgli.supabase.co/storage/v1/object/public/companion-photos/new-folder-copy/marius-muresan-rawIRjlxkY0-unsplash.jpg'])
  on conflict (id) do update set
    bio=excluded.bio, hourly_rate=excluded.hourly_rate,
    languages=excluded.languages, activities=excluded.activities,
    rating_avg=excluded.rating_avg, total_reviews=excluded.total_reviews,
    verified=excluded.verified, photos=excluded.photos;

  -- availability_slots
  delete from public.availability_slots
    where companion_id in ('b0000001-0000-0000-0000-000000000001','b0000002-0000-0000-0000-000000000002','b0000003-0000-0000-0000-000000000003','b0000004-0000-0000-0000-000000000004','b0000005-0000-0000-0000-000000000005','b0000006-0000-0000-0000-000000000006','b0000007-0000-0000-0000-000000000007','b0000008-0000-0000-0000-000000000008','b0000009-0000-0000-0000-000000000009','b000000a-0000-0000-0000-00000000000a','b000000b-0000-0000-0000-00000000000b','b000000c-0000-0000-0000-00000000000c','b000000d-0000-0000-0000-00000000000d','b000000e-0000-0000-0000-00000000000e');
  insert into public.availability_slots (id,companion_id,date,time_start,time_end,is_booked)
  values
    (gen_random_uuid(),v_c1,'2026-03-30','10:00','13:00',false),
    (gen_random_uuid(),v_c1,'2026-03-30','18:00','21:00',false),
    (gen_random_uuid(),v_c1,'2026-03-31','10:00','13:00',false),
    (gen_random_uuid(),v_c1,'2026-03-31','18:00','21:00',false),
    (gen_random_uuid(),v_c1,'2026-04-01','10:00','13:00',false),
    (gen_random_uuid(),v_c1,'2026-04-01','18:00','21:00',false),
    (gen_random_uuid(),v_c1,'2026-04-02','10:00','13:00',false),
    (gen_random_uuid(),v_c1,'2026-04-02','18:00','21:00',false),
    (gen_random_uuid(),v_c1,'2026-04-03','10:00','13:00',false),
    (gen_random_uuid(),v_c1,'2026-04-03','18:00','21:00',false),
    (gen_random_uuid(),v_c2,'2026-03-30','10:00','13:00',false),
    (gen_random_uuid(),v_c2,'2026-03-30','18:00','21:00',false),
    (gen_random_uuid(),v_c2,'2026-03-31','10:00','13:00',false),
    (gen_random_uuid(),v_c2,'2026-03-31','18:00','21:00',false),
    (gen_random_uuid(),v_c2,'2026-04-01','10:00','13:00',false),
    (gen_random_uuid(),v_c2,'2026-04-01','18:00','21:00',false),
    (gen_random_uuid(),v_c2,'2026-04-02','10:00','13:00',false),
    (gen_random_uuid(),v_c2,'2026-04-02','18:00','21:00',false),
    (gen_random_uuid(),v_c2,'2026-04-03','10:00','13:00',false),
    (gen_random_uuid(),v_c2,'2026-04-03','18:00','21:00',false),
    (gen_random_uuid(),v_c3,'2026-03-30','10:00','13:00',false),
    (gen_random_uuid(),v_c3,'2026-03-30','18:00','21:00',false),
    (gen_random_uuid(),v_c3,'2026-03-31','10:00','13:00',false),
    (gen_random_uuid(),v_c3,'2026-03-31','18:00','21:00',false),
    (gen_random_uuid(),v_c3,'2026-04-01','10:00','13:00',false),
    (gen_random_uuid(),v_c3,'2026-04-01','18:00','21:00',false),
    (gen_random_uuid(),v_c3,'2026-04-02','10:00','13:00',false),
    (gen_random_uuid(),v_c3,'2026-04-02','18:00','21:00',false),
    (gen_random_uuid(),v_c3,'2026-04-03','10:00','13:00',false),
    (gen_random_uuid(),v_c3,'2026-04-03','18:00','21:00',false),
    (gen_random_uuid(),v_c4,'2026-03-30','10:00','13:00',false),
    (gen_random_uuid(),v_c4,'2026-03-30','18:00','21:00',false),
    (gen_random_uuid(),v_c4,'2026-03-31','10:00','13:00',false),
    (gen_random_uuid(),v_c4,'2026-03-31','18:00','21:00',false),
    (gen_random_uuid(),v_c4,'2026-04-01','10:00','13:00',false),
    (gen_random_uuid(),v_c4,'2026-04-01','18:00','21:00',false),
    (gen_random_uuid(),v_c4,'2026-04-02','10:00','13:00',false),
    (gen_random_uuid(),v_c4,'2026-04-02','18:00','21:00',false),
    (gen_random_uuid(),v_c4,'2026-04-03','10:00','13:00',false),
    (gen_random_uuid(),v_c4,'2026-04-03','18:00','21:00',false),
    (gen_random_uuid(),v_c5,'2026-03-30','10:00','13:00',false),
    (gen_random_uuid(),v_c5,'2026-03-30','18:00','21:00',false),
    (gen_random_uuid(),v_c5,'2026-03-31','10:00','13:00',false),
    (gen_random_uuid(),v_c5,'2026-03-31','18:00','21:00',false),
    (gen_random_uuid(),v_c5,'2026-04-01','10:00','13:00',false),
    (gen_random_uuid(),v_c5,'2026-04-01','18:00','21:00',false),
    (gen_random_uuid(),v_c5,'2026-04-02','10:00','13:00',false),
    (gen_random_uuid(),v_c5,'2026-04-02','18:00','21:00',false),
    (gen_random_uuid(),v_c5,'2026-04-03','10:00','13:00',false),
    (gen_random_uuid(),v_c5,'2026-04-03','18:00','21:00',false),
    (gen_random_uuid(),v_c6,'2026-03-30','10:00','13:00',false),
    (gen_random_uuid(),v_c6,'2026-03-30','18:00','21:00',false),
    (gen_random_uuid(),v_c6,'2026-03-31','10:00','13:00',false),
    (gen_random_uuid(),v_c6,'2026-03-31','18:00','21:00',false),
    (gen_random_uuid(),v_c6,'2026-04-01','10:00','13:00',false),
    (gen_random_uuid(),v_c6,'2026-04-01','18:00','21:00',false),
    (gen_random_uuid(),v_c6,'2026-04-02','10:00','13:00',false),
    (gen_random_uuid(),v_c6,'2026-04-02','18:00','21:00',false),
    (gen_random_uuid(),v_c6,'2026-04-03','10:00','13:00',false),
    (gen_random_uuid(),v_c6,'2026-04-03','18:00','21:00',false),
    (gen_random_uuid(),v_c7,'2026-03-30','10:00','13:00',false),
    (gen_random_uuid(),v_c7,'2026-03-30','18:00','21:00',false),
    (gen_random_uuid(),v_c7,'2026-03-31','10:00','13:00',false),
    (gen_random_uuid(),v_c7,'2026-03-31','18:00','21:00',false),
    (gen_random_uuid(),v_c7,'2026-04-01','10:00','13:00',false),
    (gen_random_uuid(),v_c7,'2026-04-01','18:00','21:00',false),
    (gen_random_uuid(),v_c7,'2026-04-02','10:00','13:00',false),
    (gen_random_uuid(),v_c7,'2026-04-02','18:00','21:00',false),
    (gen_random_uuid(),v_c7,'2026-04-03','10:00','13:00',false),
    (gen_random_uuid(),v_c7,'2026-04-03','18:00','21:00',false),
    (gen_random_uuid(),v_c8,'2026-03-30','10:00','13:00',false),
    (gen_random_uuid(),v_c8,'2026-03-30','18:00','21:00',false),
    (gen_random_uuid(),v_c8,'2026-03-31','10:00','13:00',false),
    (gen_random_uuid(),v_c8,'2026-03-31','18:00','21:00',false),
    (gen_random_uuid(),v_c8,'2026-04-01','10:00','13:00',false),
    (gen_random_uuid(),v_c8,'2026-04-01','18:00','21:00',false),
    (gen_random_uuid(),v_c8,'2026-04-02','10:00','13:00',false),
    (gen_random_uuid(),v_c8,'2026-04-02','18:00','21:00',false),
    (gen_random_uuid(),v_c8,'2026-04-03','10:00','13:00',false),
    (gen_random_uuid(),v_c8,'2026-04-03','18:00','21:00',false),
    (gen_random_uuid(),v_c9,'2026-03-30','10:00','13:00',false),
    (gen_random_uuid(),v_c9,'2026-03-30','18:00','21:00',false),
    (gen_random_uuid(),v_c9,'2026-03-31','10:00','13:00',false),
    (gen_random_uuid(),v_c9,'2026-03-31','18:00','21:00',false),
    (gen_random_uuid(),v_c9,'2026-04-01','10:00','13:00',false),
    (gen_random_uuid(),v_c9,'2026-04-01','18:00','21:00',false),
    (gen_random_uuid(),v_c9,'2026-04-02','10:00','13:00',false),
    (gen_random_uuid(),v_c9,'2026-04-02','18:00','21:00',false),
    (gen_random_uuid(),v_c9,'2026-04-03','10:00','13:00',false),
    (gen_random_uuid(),v_c9,'2026-04-03','18:00','21:00',false),
    (gen_random_uuid(),v_c10,'2026-03-30','10:00','13:00',false),
    (gen_random_uuid(),v_c10,'2026-03-30','18:00','21:00',false),
    (gen_random_uuid(),v_c10,'2026-03-31','10:00','13:00',false),
    (gen_random_uuid(),v_c10,'2026-03-31','18:00','21:00',false),
    (gen_random_uuid(),v_c10,'2026-04-01','10:00','13:00',false),
    (gen_random_uuid(),v_c10,'2026-04-01','18:00','21:00',false),
    (gen_random_uuid(),v_c10,'2026-04-02','10:00','13:00',false),
    (gen_random_uuid(),v_c10,'2026-04-02','18:00','21:00',false),
    (gen_random_uuid(),v_c10,'2026-04-03','10:00','13:00',false),
    (gen_random_uuid(),v_c10,'2026-04-03','18:00','21:00',false),
    (gen_random_uuid(),v_c11,'2026-03-30','10:00','13:00',false),
    (gen_random_uuid(),v_c11,'2026-03-30','18:00','21:00',false),
    (gen_random_uuid(),v_c11,'2026-03-31','10:00','13:00',false),
    (gen_random_uuid(),v_c11,'2026-03-31','18:00','21:00',false),
    (gen_random_uuid(),v_c11,'2026-04-01','10:00','13:00',false),
    (gen_random_uuid(),v_c11,'2026-04-01','18:00','21:00',false),
    (gen_random_uuid(),v_c11,'2026-04-02','10:00','13:00',false),
    (gen_random_uuid(),v_c11,'2026-04-02','18:00','21:00',false),
    (gen_random_uuid(),v_c11,'2026-04-03','10:00','13:00',false),
    (gen_random_uuid(),v_c11,'2026-04-03','18:00','21:00',false),
    (gen_random_uuid(),v_c12,'2026-03-30','10:00','13:00',false),
    (gen_random_uuid(),v_c12,'2026-03-30','18:00','21:00',false),
    (gen_random_uuid(),v_c12,'2026-03-31','10:00','13:00',false),
    (gen_random_uuid(),v_c12,'2026-03-31','18:00','21:00',false),
    (gen_random_uuid(),v_c12,'2026-04-01','10:00','13:00',false),
    (gen_random_uuid(),v_c12,'2026-04-01','18:00','21:00',false),
    (gen_random_uuid(),v_c12,'2026-04-02','10:00','13:00',false),
    (gen_random_uuid(),v_c12,'2026-04-02','18:00','21:00',false),
    (gen_random_uuid(),v_c12,'2026-04-03','10:00','13:00',false),
    (gen_random_uuid(),v_c12,'2026-04-03','18:00','21:00',false),
    (gen_random_uuid(),v_c13,'2026-03-30','10:00','13:00',false),
    (gen_random_uuid(),v_c13,'2026-03-30','18:00','21:00',false),
    (gen_random_uuid(),v_c13,'2026-03-31','10:00','13:00',false),
    (gen_random_uuid(),v_c13,'2026-03-31','18:00','21:00',false),
    (gen_random_uuid(),v_c13,'2026-04-01','10:00','13:00',false),
    (gen_random_uuid(),v_c13,'2026-04-01','18:00','21:00',false),
    (gen_random_uuid(),v_c13,'2026-04-02','10:00','13:00',false),
    (gen_random_uuid(),v_c13,'2026-04-02','18:00','21:00',false),
    (gen_random_uuid(),v_c13,'2026-04-03','10:00','13:00',false),
    (gen_random_uuid(),v_c13,'2026-04-03','18:00','21:00',false),
    (gen_random_uuid(),v_c14,'2026-03-30','10:00','13:00',false),
    (gen_random_uuid(),v_c14,'2026-03-30','18:00','21:00',false),
    (gen_random_uuid(),v_c14,'2026-03-31','10:00','13:00',false),
    (gen_random_uuid(),v_c14,'2026-03-31','18:00','21:00',false),
    (gen_random_uuid(),v_c14,'2026-04-01','10:00','13:00',false),
    (gen_random_uuid(),v_c14,'2026-04-01','18:00','21:00',false),
    (gen_random_uuid(),v_c14,'2026-04-02','10:00','13:00',false),
    (gen_random_uuid(),v_c14,'2026-04-02','18:00','21:00',false),
    (gen_random_uuid(),v_c14,'2026-04-03','10:00','13:00',false),
    (gen_random_uuid(),v_c14,'2026-04-03','18:00','21:00',false);

end $seed$;