create table if not exists availability_slots (
  id uuid primary key default gen_random_uuid(),
  companion_id uuid not null references companions(id) on delete cascade,
  date date not null,
  time_start time not null,
  time_end time not null,
  is_booked boolean not null default false
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  tourist_id uuid not null references profiles(id),
  companion_id uuid not null references companions(id),
  slot_id uuid not null references availability_slots(id),
  activity text not null,
  meeting_point text not null,
  status text not null default 'pending'
    check (status in ('pending','confirmed','completed','cancelled')),
  total_price numeric not null,
  duration_hours int not null,
  stripe_payment_intent_id text,
  created_at timestamptz not null default now()
);

-- RLS: availability_slots
alter table availability_slots enable row level security;

create policy "Anyone can view availability slots"
  on availability_slots for select using (true);

create policy "Companions can manage their own slots"
  on availability_slots for all
  using (
    companion_id in (
      select id from companions where profile_id = auth.uid()
    )
  );

-- RLS: bookings
alter table bookings enable row level security;

create policy "Tourists can view own bookings"
  on bookings for select using (tourist_id = auth.uid());

create policy "Companions can view bookings for them"
  on bookings for select
  using (
    companion_id in (
      select id from companions where profile_id = auth.uid()
    )
  );

create policy "Tourists can create bookings"
  on bookings for insert with check (tourist_id = auth.uid());

create policy "Involved parties can update bookings"
  on bookings for update
  using (
    tourist_id = auth.uid()
    or companion_id in (
      select id from companions where profile_id = auth.uid()
    )
  );
