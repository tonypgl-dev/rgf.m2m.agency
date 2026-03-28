create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('tourist', 'companion')),
  full_name text,
  avatar_url text,
  phone text,
  city text,
  created_at timestamptz not null default now()
);

create table if not exists companions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  bio text,
  hourly_rate numeric check (hourly_rate >= 0),
  languages text[] not null default '{}',
  activities text[] not null default '{}',
  rating_avg numeric not null default 0,
  verified boolean not null default false,
  total_reviews int not null default 0
);

-- RLS
alter table profiles enable row level security;
alter table companions enable row level security;

create policy "Users can view all profiles"
  on profiles for select using (true);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

create policy "Anyone can view companions"
  on companions for select using (true);

create policy "Companions can update own record"
  on companions for update
  using (profile_id = auth.uid());
