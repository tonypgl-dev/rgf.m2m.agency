-- Pre-booking direct messaging (tourist ↔ companion, no booking required)
-- Separate from the booking chat to keep both data models clean.

create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  tourist_id uuid not null references profiles(id) on delete cascade,
  companion_id uuid not null references companions(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (tourist_id, companion_id)
);

create table if not exists direct_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  sender_id uuid not null references profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now(),
  read_at timestamptz
);

-- RLS
alter table conversations enable row level security;
alter table direct_messages enable row level security;

create policy "Participants can view their conversations"
  on conversations for select
  using (
    tourist_id = auth.uid()
    or companion_id in (select id from companions where profile_id = auth.uid())
  );

create policy "Tourists can create conversations"
  on conversations for insert
  with check (tourist_id = auth.uid());

create policy "Participants can read direct messages"
  on direct_messages for select
  using (
    conversation_id in (
      select id from conversations
      where tourist_id = auth.uid()
        or companion_id in (select id from companions where profile_id = auth.uid())
    )
  );

create policy "Participants can send direct messages"
  on direct_messages for insert
  with check (
    sender_id = auth.uid()
    and conversation_id in (
      select id from conversations
      where tourist_id = auth.uid()
        or companion_id in (select id from companions where profile_id = auth.uid())
    )
  );
