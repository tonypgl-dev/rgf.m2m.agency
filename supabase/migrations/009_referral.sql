-- Referral infrastructure skeleton
-- referral_code: codul unic al unui utilizator (folosit de influenceri/ghizi pentru a aduce alții)
-- referred_by:   codul folosit la înregistrare (cine l-a adus)

alter table profiles
  add column if not exists referral_code text unique,
  add column if not exists referred_by text;

-- Index pentru lookup rapid la înregistrare
create index if not exists profiles_referral_code_idx on profiles(referral_code);
create index if not exists profiles_referred_by_idx on profiles(referred_by);
