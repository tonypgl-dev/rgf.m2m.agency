-- ─── Reviews ─────────────────────────────────────────────────────────────────

create table if not exists reviews (
  id            uuid primary key default gen_random_uuid(),
  booking_id    uuid not null unique references bookings(id) on delete cascade,
  reviewer_id   uuid not null references auth.users(id) on delete cascade,
  reviewee_id   uuid not null references auth.users(id) on delete cascade,
  rating        smallint not null check (rating between 1 and 5),
  comment       text,
  created_at    timestamptz not null default now()
);

-- RLS
alter table reviews enable row level security;

-- Anyone can read reviews
create policy "reviews_select_all"
  on reviews for select
  using (true);

-- Reviewer inserts their own review (one per booking enforced by unique)
create policy "reviews_insert_own"
  on reviews for insert
  with check (reviewer_id = auth.uid());

-- ─── Rating trigger ───────────────────────────────────────────────────────────

create or replace function update_companion_rating()
returns trigger language plpgsql security definer as $$
declare
  v_companion_id uuid;
begin
  -- Resolve companion profile_id → companion id from reviewee_id
  select id into v_companion_id
  from companions
  where profile_id = NEW.reviewee_id;

  if v_companion_id is null then
    return NEW;
  end if;

  update companions
  set
    rating_avg    = (select round(avg(rating)::numeric, 2) from reviews where reviewee_id = NEW.reviewee_id),
    total_reviews = (select count(*) from reviews where reviewee_id = NEW.reviewee_id)
  where id = v_companion_id;

  return NEW;
end;
$$;

drop trigger if exists trg_update_companion_rating on reviews;
create trigger trg_update_companion_rating
  after insert on reviews
  for each row execute function update_companion_rating();
