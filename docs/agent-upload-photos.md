# Context pentru Agent Nou — Roamly Project

## Ce este proiectul

**Roamly** — aplicatie web de social companionship pentru turisti straini in Romania.
Stack: Next.js 16, TypeScript, Tailwind CSS v4, Supabase (PostgreSQL + Storage + Auth), Stripe.
Site live: roamly.ro
Local: localhost:3000

## Supabase

- URL: https://wsngzhetkiyqsvwukgli.supabase.co
- Schema: **public** (toate tabelele sunt in public, fara schema custom)
- Bucket Storage: `companion-photos` (public)
- URL format fisiere: `https://wsngzhetkiyqsvwukgli.supabase.co/storage/v1/object/public/companion-photos/[path]`

Clients:
- `src/lib/supabase/client.ts` — browser client (fara db.schema)
- `src/lib/supabase/server.ts` — server client cu cookies
- `src/lib/supabase/service.ts` — service role client (bypasses RLS)

## Task in curs — Upload Poze + Seed Companions

### Situatia

Exista un folder `D:/work/rentgf/Poze/` cu **14 subdirectoare**.
Fiecare subdirector = un set de poze pentru o companiona (1-4 poze per set).

Structura Poze/:
```
1/                    → 3 poze (viraj-upadhyay)
1 - Copy/             → 2 poze (bave-pictures)
2/                    → 4 poze (david-suarez)
2 - Copy/             → 5 poze (bave-pictures + dan-kirk)
New folder/           → 1 poza (rick-govic)
New folder - Copy/    → 4 poze (marius-muresan)
New folder (2)/       → 2 poze (bave-pictures + jabari-timothy)
New folder (2) - Copy/→ 3 poze (ahmadreza-najafi)
New folder (3)/       → 2 poze (dan-kirk-formentera)
New folder (3) - Copy/→ 4 poze (jabari-timothy)
New folder (4)/       → 4 poze (jabari-timothy)
New folder (5)/       → 3 poze (jabari-timothy)
New folder (6)/       → 1 poza (anton-konovalov)
New folder (7)/       → 2 poze (teodora-popa-photographer)
```

### Ce trebuie facut (in ordine)

**STEP 1 — Upload poze in Supabase Storage**

Creeaza si ruleaza `scripts/upload-poze.mjs` care:
1. Citeste toate subdirectoarele din `./Poze/`
2. Pentru fiecare director, uploadeaza fiecare `.jpg` in bucket-ul `companion-photos`
   la path: `[sanitized-folder-name]/[filename]`
   (sanitized = replace spaces cu `-`, lowercase)
3. Colecteaza URL-urile publice
4. Salveaza rezultatul in `scripts/poze-urls.json`:
   ```json
   {
     "1": ["https://...jpg", "https://...jpg", "https://...jpg"],
     "1-copy": ["https://...jpg", "https://...jpg"],
     ...
   }
   ```

Foloseste service role key din `.env.local` pentru upload.
Instaleaza `@supabase/supabase-js` daca nu e deja (e deja in package.json).

Script exemplu de pornire:
```js
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const supabase = createClient(
  'https://wsngzhetkiyqsvwukgli.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
)
```

**STEP 2 — Genereaza seed SQL**

Dupa upload, genereaza `supabase/seeds/003_real_companions.sql` care:

1. Sterge toti mock companions existenti:
```sql
-- sterge mock users (email @mock.roamly si @test.)
do $$
declare mock_ids uuid[];
begin
  select array_agg(id) into mock_ids
  from auth.users
  where email like '%@mock.roamly' or email like '%@test.%' or email = 'test@test.com';

  if mock_ids is not null then
    delete from auth.identities where user_id = any(mock_ids);
    delete from public.profiles where id = any(mock_ids);
    delete from auth.users where id = any(mock_ids);
  end if;
end $$;
```

2. Creeaza **14 companione** (una per director din Poze/) cu:
   - UUID-uri fixe (stabile, safe to re-run)
   - Nume romanesti: Ana, Maria, Elena, Sofia, Diana, Ioana, Alexandra,
     Raluca, Bianca, Laura, Cristina, Andreea, Monica, Gabriela
   - Email: `[firstname]@companions.roamly`
   - Orase distribuite: Bucharest(5), Cluj(3), Brasov(2), Sibiu(2), Timisoara(2)
   - `photos[]`: array cu URL-urile uploadate pentru directorul respectiv
   - `avatar_url` (pe profiles): primul URL din photos[]
   - Bio autentic si variat per companiona
   - `hourly_rate`: 18-28€ (variat)
   - `languages`: toate au English + una/doua in plus (French, German, Spanish, Italian)
   - `activities`: 3-4 per companiona din: City Tour, Dinner, Museum Visit,
     Coffee & Chat, Hiking, Photography Walk, Nightlife, Rooftop Bar, Brunch
   - `verified`: true
   - `rating_avg`: 4.5-4.9
   - `total_reviews`: 8-45
   - Availability slots: 2 slots/zi pentru urmatoarele 5 zile

3. Adauga `auth.identities` pentru fiecare user (altfel login nu functioneaza)

**STEP 3 — Afiseaza SQL-ul**

Nu rula SQL-ul automat. Afiseaza-l in terminal sau salveaza-l in fisier
ca utilizatorul sa il poata copia in Supabase SQL Editor.

## Schema DB relevanta

```sql
-- profiles
id uuid PK (= auth.users.id)
role text ('tourist'|'companion'|'admin')
full_name text
avatar_url text
phone text
city text
created_at timestamptz

-- companions
id uuid PK
profile_id uuid FK → profiles.id
bio text
hourly_rate numeric
languages text[]
activities text[]
rating_avg numeric
total_reviews int
verified boolean
stripe_account_id text
photos text[]   ← IMPORTANT: array de URL-uri

-- availability_slots
id uuid PK
companion_id uuid FK → companions.id
date date
time_start time
time_end time
is_booked boolean
```

## Note importante

- `photos[]` coloana a fost adaugata recent (migration 006_photos.sql) — exista deja
- Bucket `companion-photos` exista deja in Supabase Storage cu policy public read
- Nu modifica fisierele din `src/lib/supabase/`
- Nu modifica alte pagini sau componente — doar scripts/ si seeds/
- `.env.local` are toate cheile necesare
