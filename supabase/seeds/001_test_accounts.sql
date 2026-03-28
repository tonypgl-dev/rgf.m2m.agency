-- ─────────────────────────────────────────────────────────────────────────────
-- Seed: test accounts for local / staging
-- Safe to re-run: auth.users skipped if exists, profiles/companions updated.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 0. Widen the role check constraint to include 'admin' ─────────────────────
alter table profiles
  drop constraint if exists profiles_role_check;

alter table profiles
  add constraint profiles_role_check
  check (role in ('tourist', 'companion', 'admin'));

-- ── 1. Fixed UUIDs (stable across re-runs) ───────────────────────────────────
do $$
declare
  v_admin_id     uuid := 'aaaaaaaa-0000-0000-0000-000000000001';
  v_tourist_id   uuid := 'bbbbbbbb-0000-0000-0000-000000000002';
  v_companion_id uuid := 'cccccccc-0000-0000-0000-000000000003';
  v_comp_row_id  uuid := 'dddddddd-0000-0000-0000-000000000004';
begin

  -- ── 2. auth.users ──────────────────────────────────────────────────────────

  insert into auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  ) values
    -- admin
    (
      v_admin_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'admin@gmail.com',
      crypt('1234', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{}',
      now(),
      now()
    ),
    -- tourist
    (
      v_tourist_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'turist@gmail.com',
      crypt('1234', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{}',
      now(),
      now()
    ),
    -- companion
    (
      v_companion_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'companion@gmail.com',
      crypt('1234', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{}',
      now(),
      now()
    )
  on conflict (id) do nothing;

  -- ── 3. profiles ─────────────────────────────────────────────────────

  insert into profiles (id, role, full_name, avatar_url, city) values
    (v_admin_id,     'admin',     null,               null,                                                                         null),
    (v_tourist_id,   'tourist',   'John Smith',       null,                                                                         'Bucharest'),
    (v_companion_id, 'companion', 'Silvia Vasilescu', 'https://api.dicebear.com/9.x/personas/svg?seed=Silvia&backgroundColor=b6e3f4', 'Bucharest')
  on conflict (id) do update set
    full_name  = excluded.full_name,
    avatar_url = excluded.avatar_url,
    city       = excluded.city;

  -- ── 4. companions ───────────────────────────────────────────────────

  insert into companions (
    id,
    profile_id,
    bio,
    hourly_rate,
    languages,
    activities,
    verified
  ) values (
    v_comp_row_id,
    v_companion_id,
    'My grandfather Vasile raised me. My parents were complicated people — I don''t talk about them. Bunicul raised me on goat''s milk, black bread, and the kind of silences that mean more than most people''s words. He was Aromanian. I am Aromanian. Most people here don''t even know what that means anymore and it breaks my heart every single day.

He knew this city better than anyone alive. Tram driver, line 32, thirty-four years. He used to say the city speaks if you don''t rush it. Nobody listens anymore. Everyone rushes now. Bunicul never rushed.

He passed away in 2019 and I have not been the same since. I won''t pretend otherwise.

I show people Bucharest because it''s what he would have wanted me to do. I take you to the real places — not the ones in the travel blogs, not the ones with the English menus. The courtyard behind the bloc on Mihai Bravu where he used to drink his coffee. The market where he bought cheese every Saturday for forty years. The bench where he sat and watched the tram go by after he retired, because he missed it.

I speak English, French, and Aromanian — his language. A language that is dying and I carry it like a wound.

If you want someone cheerful and performative, there are plenty of those. If you want someone who actually loves this city — the broken, complicated, beautiful thing that it is — I''m here.',
    2,
    array['English', 'French', 'Aromanian'],
    array['City Tour', 'Dinner', 'Museum Visit'],
    true
  )
  on conflict (id) do update set
    bio        = excluded.bio,
    hourly_rate = excluded.hourly_rate,
    languages  = excluded.languages,
    activities = excluded.activities,
    verified   = excluded.verified;

  -- ── 5. availability_slots — replace unbooked slots for next 3 days ────────
  delete from availability_slots
    where companion_id = v_comp_row_id
      and is_booked = false
      and date between current_date + 1 and current_date + 3;

  insert into availability_slots
    (companion_id, date, time_start, time_end, is_booked)
  values
    (v_comp_row_id, current_date + 1, '10:00', '13:00', false),
    (v_comp_row_id, current_date + 1, '14:00', '17:00', false),
    (v_comp_row_id, current_date + 2, '10:00', '13:00', false),
    (v_comp_row_id, current_date + 2, '14:00', '17:00', false),
    (v_comp_row_id, current_date + 3, '10:00', '13:00', false);

end $$;
