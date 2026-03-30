-- Add approval status to companions
-- 'pending'  = profile submitted, awaiting admin review
-- 'approved' = visible publicly, can receive bookings
-- 'rejected' = profile rejected, not visible publicly

alter table companions
  add column if not exists status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected'));

-- Migrate existing data: already-verified companions become approved
update companions set status = 'approved' where verified = true;

-- Update RLS: public sees only approved; companions see their own record regardless of status
drop policy if exists "Anyone can view companions" on companions;

create policy "Anyone can view approved companions"
  on companions for select
  using (status = 'approved' OR profile_id = auth.uid());
