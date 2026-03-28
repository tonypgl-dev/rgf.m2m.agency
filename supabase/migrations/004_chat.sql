alter table bookings
  add column if not exists check_in_at timestamptz,
  add column if not exists check_out_at timestamptz;

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings(id) on delete cascade,
  sender_id uuid not null references profiles(id),
  content text not null,
  created_at timestamptz not null default now(),
  read_at timestamptz
);

-- RLS
alter table messages enable row level security;

create policy "Booking participants can read messages"
  on messages for select
  using (
    booking_id in (
      select id from bookings
      where tourist_id = auth.uid()
        or companion_id in (
          select id from companions where profile_id = auth.uid()
        )
    )
  );

create policy "Booking participants can send messages"
  on messages for insert
  with check (
    sender_id = auth.uid()
    and booking_id in (
      select id from bookings
      where tourist_id = auth.uid()
        or companion_id in (
          select id from companions where profile_id = auth.uid()
        )
    )
  );

-- Enable Realtime for the messages table.
-- If your project uses a selective publication, uncomment the line below.
-- If supabase_realtime is already FOR ALL TABLES, skip it.
-- alter publication supabase_realtime add table messages;
--
-- You can also enable Realtime from the Supabase Dashboard:
-- Database → Tables → messages → toggle "Realtime" ON.
