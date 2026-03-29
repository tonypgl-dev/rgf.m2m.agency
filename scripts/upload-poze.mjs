/**
 * STEP 1: Upload photos from ./Poze/ to Supabase Storage
 * STEP 2: Generate supabase/seeds/003_real_companions.sql
 *
 * Run: node scripts/upload-poze.mjs
 */

import { createClient } from "@supabase/supabase-js";
import { readdir, readFile, writeFile } from "fs/promises";
import { join, resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// ── Parse .env.local ──────────────────────────────────────────────────────────
function parseEnv(raw) {
  const env = {};
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
    env[key] = val;
  }
  return env;
}

// ── Sanitize folder name → storage slug ──────────────────────────────────────
function sanitize(name) {
  return name
    .toLowerCase()
    .replace(/\s*-\s*copy/gi, "-copy")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-_]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// ── Companion metadata (14 entries — order matches sorted Poze/ dirs) ─────────
// Sorted dir order: 1, 1 - Copy, 2, 2 - Copy, New folder, New folder (2),
//   New folder (2) - Copy, New folder (3), New folder (3) - Copy,
//   New folder (4), New folder (5), New folder (6), New folder (7), New folder - Copy
const COMPANIONS = [
  { name: "Ana",       city: "Bucharest",  rate: 20, langs: ["English","French"],           acts: ["City Tour","Coffee & Chat","Museum Visit","Rooftop Bar"], rating: 4.9, reviews: 34 },
  { name: "Maria",     city: "Bucharest",  rate: 22, langs: ["English"],                   acts: ["Dinner","City Tour","Photography Walk"],                  rating: 4.7, reviews: 21 },
  { name: "Elena",     city: "Brasov",     rate: 24, langs: ["English","Italian"],          acts: ["Hiking","Dinner","Photography Walk","Museum Visit"],      rating: 4.8, reviews: 18 },
  { name: "Sofia",     city: "Sibiu",      rate: 25, langs: ["English","French","Spanish"], acts: ["City Tour","Dinner","Museum Visit"],                      rating: 4.6, reviews: 29 },
  { name: "Diana",     city: "Bucharest",  rate: 20, langs: ["English"],                   acts: ["Brunch","Coffee & Chat","City Tour","Rooftop Bar"],        rating: 4.8, reviews: 41 },
  { name: "Ioana",     city: "Timisoara",  rate: 18, langs: ["English","French"],           acts: ["City Tour","Dinner","Museum Visit"],                      rating: 4.5, reviews: 15 },
  { name: "Alexandra", city: "Cluj",       rate: 22, langs: ["English","German"],           acts: ["Nightlife","Dinner","Coffee & Chat","City Tour"],         rating: 4.7, reviews: 23 },
  { name: "Raluca",    city: "Bucharest",  rate: 20, langs: ["English","Spanish"],          acts: ["City Tour","Museum Visit","Dinner"],                      rating: 4.9, reviews: 37 },
  { name: "Bianca",    city: "Brasov",     rate: 20, langs: ["English"],                   acts: ["Hiking","Photography Walk","City Tour"],                  rating: 4.6, reviews: 12 },
  { name: "Laura",     city: "Sibiu",      rate: 23, langs: ["English","French","Italian"], acts: ["City Tour","Dinner","Museum Visit","Coffee & Chat"],      rating: 4.8, reviews: 28 },
  { name: "Cristina",  city: "Bucharest",  rate: 21, langs: ["English"],                   acts: ["Coffee & Chat","City Tour","Photography Walk"],           rating: 4.7, reviews: 19 },
  { name: "Andreea",   city: "Cluj",       rate: 19, langs: ["English","German"],           acts: ["City Tour","Dinner","Museum Visit"],                      rating: 4.6, reviews: 31 },
  { name: "Monica",    city: "Timisoara",  rate: 28, langs: ["English","French"],           acts: ["Dinner","Museum Visit","Coffee & Chat","Rooftop Bar"],    rating: 4.9, reviews: 45 },
  { name: "Gabriela",  city: "Cluj",       rate: 18, langs: ["English"],                   acts: ["Hiking","City Tour","Coffee & Chat"],                     rating: 4.5, reviews:  8 },
];

const BIOS = {
  Ana:       "Bucharest is my city and I know every hidden courtyard and rooftop bar worth visiting. Art, coffee, and good conversation — that's my idea of a perfect afternoon.",
  Maria:     "Born and raised in Bucharest. I'll take you past the tourist trail — through the neighborhoods people actually live in, the markets, the tiny restaurants.",
  Elena:     "I grew up in the shadow of the Carpathians. Brasov is best seen on foot, off the map. I can take you to viewpoints and mountain huts that don't have Instagram pages yet.",
  Sofia:     "Sibiu's medieval streets never get old. Four languages, five years in hospitality — I'll make sure you leave knowing the city like a local.",
  Diana:     "Yoga teacher, obsessive foodie, Bucharest native. Every brunch spot, every vegan café, every rooftop with a view — I have a list.",
  Ioana:     "Timisoara was the first city in Europe to have electric street lighting. I have a hundred more facts like that — and better stories behind each one.",
  Alexandra: "By day I organize events, by night I'm at a jazz concert or a gallery opening. Cluj's cultural scene is my specialty.",
  Raluca:    "History degree, strong opinions about communist-era architecture. I'll show you Bucharest as a city with layers, not just a postcard.",
  Bianca:    "Nature guide, plant lover. The forests around Brasov are full of trails that don't appear on tourist maps — I know most of them.",
  Laura:     "Sibiu's Christmas market gets all the attention, but the city is beautiful in every season. Let me show you why I never left.",
  Cristina:  "I know Bucharest the way a local knows it — the coffee shops with no sign outside, the parks nobody photographs, the shortcuts through old courtyards.",
  Andreea:   "Cluj has one of the best art scenes in Eastern Europe and most tourists walk straight past it. I can change that in an afternoon.",
  Monica:    "I moved to Timisoara ten years ago and fell in love with its contradictions — Habsburg architecture, Romanian warmth, student energy. I'll introduce you to all three.",
  Gabriela:  "Cluj and the hills around it are underrated for hiking. I guide weekend walks and city tours with equal enthusiasm.",
};

// Stable UUIDs (safe to re-run)
const PROFILE_UUIDS = [
  "a0000001-0000-0000-0000-000000000001", "a0000002-0000-0000-0000-000000000002",
  "a0000003-0000-0000-0000-000000000003", "a0000004-0000-0000-0000-000000000004",
  "a0000005-0000-0000-0000-000000000005", "a0000006-0000-0000-0000-000000000006",
  "a0000007-0000-0000-0000-000000000007", "a0000008-0000-0000-0000-000000000008",
  "a0000009-0000-0000-0000-000000000009", "a000000a-0000-0000-0000-00000000000a",
  "a000000b-0000-0000-0000-00000000000b", "a000000c-0000-0000-0000-00000000000c",
  "a000000d-0000-0000-0000-00000000000d", "a000000e-0000-0000-0000-00000000000e",
];
const COMPANION_UUIDS = [
  "b0000001-0000-0000-0000-000000000001", "b0000002-0000-0000-0000-000000000002",
  "b0000003-0000-0000-0000-000000000003", "b0000004-0000-0000-0000-000000000004",
  "b0000005-0000-0000-0000-000000000005", "b0000006-0000-0000-0000-000000000006",
  "b0000007-0000-0000-0000-000000000007", "b0000008-0000-0000-0000-000000000008",
  "b0000009-0000-0000-0000-000000000009", "b000000a-0000-0000-0000-00000000000a",
  "b000000b-0000-0000-0000-00000000000b", "b000000c-0000-0000-0000-00000000000c",
  "b000000d-0000-0000-0000-00000000000d", "b000000e-0000-0000-0000-00000000000e",
];

// ── SQL helpers ───────────────────────────────────────────────────────────────
const sq = (s) => `'${String(s).replace(/'/g, "''")}'`;
const pgArr = (arr) => `array[${arr.map(sq).join(",")}]`;

// ── Generate dates: next 5 days from 2026-03-30 ───────────────────────────────
function getNextDays(n) {
  const days = [];
  const start = new Date("2026-03-30");
  for (let i = 0; i < n; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const envRaw = await readFile(join(ROOT, ".env.local"), "utf8");
  const env = parseEnv(envRaw);

  const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
  const SERVICE_KEY  = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SERVICE_KEY) throw new Error("Missing Supabase env vars");

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false },
  });

  // ── STEP 1: Upload photos ────────────────────────────────────────────────────
  const pozeRoot = join(ROOT, "Poze");
  const entries  = await readdir(pozeRoot, { withFileTypes: true });
  const dirs     = entries.filter((e) => e.isDirectory()).map((e) => e.name).sort();

  console.log(`\nFound ${dirs.length} directories — uploading...\n`);

  const urlMap = {};  // dir name → [urls]

  for (const dir of dirs) {
    const slug    = sanitize(dir);
    const dirPath = join(pozeRoot, dir);
    const files   = (await readdir(dirPath)).filter((f) => f.toLowerCase().endsWith(".jpg")).sort();
    const urls    = [];

    console.log(`📁  "${dir}"  →  ${slug}/  (${files.length} files)`);

    for (const file of files) {
      const storagePath = `${slug}/${file}`;

      // Check if already uploaded (avoid duplicate uploads)
      const { data: existing } = await supabase.storage
        .from("companion-photos")
        .list(slug, { search: file });

      if (existing && existing.some((f) => f.name === file)) {
        console.log(`    ✓  already exists: ${file}`);
      } else {
        const buf     = await readFile(join(dirPath, file));
        const { error } = await supabase.storage
          .from("companion-photos")
          .upload(storagePath, buf, { contentType: "image/jpeg", upsert: false });

        if (error) {
          console.error(`    ✗  ${file}: ${error.message}`);
          continue;
        }
        console.log(`    ↑  uploaded: ${file}`);
      }

      urls.push(`${SUPABASE_URL}/storage/v1/object/public/companion-photos/${storagePath}`);
    }

    urlMap[dir] = urls;
  }

  // Save url map
  const urlsPath = join(__dirname, "poze-urls.json");
  await writeFile(urlsPath, JSON.stringify(urlMap, null, 2), "utf8");
  console.log(`\nURL map saved to scripts/poze-urls.json`);

  // ── STEP 2: Generate SQL ─────────────────────────────────────────────────────
  const count = Math.min(dirs.length, COMPANIONS.length);
  const dates = getNextDays(5);
  const L     = [];

  L.push("-- ────────────────────────────────────────────────────────────────────────────");
  L.push("-- Seed 003: real companions from Poze/ photos");
  L.push("-- Safe to re-run (ON CONFLICT DO UPDATE / DO NOTHING)");
  L.push("-- ────────────────────────────────────────────────────────────────────────────");
  L.push("");

  // ── Cleanup mock data ────────────────────────────────────────────────────────
  L.push("do $cleanup$");
  L.push("begin");
  L.push("  delete from public.availability_slots s");
  L.push("    using public.companions c");
  L.push("    join public.profiles p on p.id = c.profile_id");
  L.push("    join auth.users u      on u.id = p.id");
  L.push("    where s.companion_id = c.id");
  L.push("      and (u.email like '%@mock.roamly' or u.email like '%@test.%' or u.email = 'test@test.com');");
  L.push("  delete from public.companions c");
  L.push("    using public.profiles p join auth.users u on u.id = p.id");
  L.push("    where c.profile_id = p.id");
  L.push("      and (u.email like '%@mock.roamly' or u.email like '%@test.%' or u.email = 'test@test.com');");
  L.push("  delete from public.profiles p");
  L.push("    using auth.users u where p.id = u.id");
  L.push("      and (u.email like '%@mock.roamly' or u.email like '%@test.%' or u.email = 'test@test.com');");
  L.push("  delete from auth.identities");
  L.push("    where user_id in (");
  L.push("      select id from auth.users");
  L.push("      where email like '%@mock.roamly' or email like '%@test.%' or email = 'test@test.com'");
  L.push("    );");
  L.push("  delete from auth.users");
  L.push("    where email like '%@mock.roamly' or email like '%@test.%' or email = 'test@test.com';");
  L.push("end $cleanup$;");
  L.push("");

  // ── Insert real companions ───────────────────────────────────────────────────
  L.push("do $seed$");
  L.push("declare");
  for (let i = 0; i < count; i++) {
    L.push(`  v_p${i + 1} uuid := '${PROFILE_UUIDS[i]}';`);
    L.push(`  v_c${i + 1} uuid := '${COMPANION_UUIDS[i]}';`);
  }
  L.push("begin");

  // auth.users
  L.push("\n  -- auth.users");
  const uVals = [];
  for (let i = 0; i < count; i++) {
    const email = `${COMPANIONS[i].name.toLowerCase()}@companions.roamly`;
    uVals.push(
      `    (v_p${i+1},'00000000-0000-0000-0000-000000000000','authenticated','authenticated',` +
      `${sq(email)},crypt('Roamly2025!',gen_salt('bf')),now(),` +
      `'{"provider":"email","providers":["email"]}','{}',now(),now())`
    );
  }
  L.push("  insert into auth.users");
  L.push("    (id,instance_id,aud,role,email,encrypted_password,email_confirmed_at,raw_app_meta_data,raw_user_meta_data,created_at,updated_at)");
  L.push("  values");
  L.push(uVals.join(",\n") + "\n  on conflict (id) do nothing;");

  // auth.identities
  L.push("\n  -- auth.identities");
  const iVals = [];
  for (let i = 0; i < count; i++) {
    const email = `${COMPANIONS[i].name.toLowerCase()}@companions.roamly`;
    iVals.push(
      `    (v_p${i+1},v_p${i+1},'email',` +
      `json_build_object('sub',v_p${i+1}::text,'email',${sq(email)}),` +
      `${sq(email)},now(),now(),now())`
    );
  }
  L.push("  insert into auth.identities (id,user_id,provider,identity_data,provider_id,last_sign_in_at,created_at,updated_at)");
  L.push("  values");
  L.push(iVals.join(",\n") + "\n  on conflict (provider, provider_id) do nothing;");

  // profiles
  L.push("\n  -- profiles");
  const pVals = [];
  for (let i = 0; i < count; i++) {
    const c  = COMPANIONS[i];
    const av = urlMap[dirs[i]]?.[0] ?? null;
    pVals.push(`    (v_p${i+1},'companion',${sq(c.name)},${av ? sq(av) : "null"},${sq(c.city)},now())`);
  }
  L.push("  insert into public.profiles (id,role,full_name,avatar_url,city,created_at) values");
  L.push(pVals.join(",\n"));
  L.push("  on conflict (id) do update set");
  L.push("    full_name=excluded.full_name, avatar_url=excluded.avatar_url, city=excluded.city;");

  // companions
  L.push("\n  -- companions");
  const cVals = [];
  for (let i = 0; i < count; i++) {
    const c    = COMPANIONS[i];
    const urls = urlMap[dirs[i]] ?? [];
    const bio  = BIOS[c.name] ?? `Local guide based in ${c.city}.`;
    cVals.push(
      `    (v_c${i+1},v_p${i+1},\n` +
      `     ${sq(bio)},\n` +
      `     ${c.rate},${pgArr(c.langs)},${pgArr(c.acts)},\n` +
      `     ${c.rating},${c.reviews},true,\n` +
      `     ${pgArr(urls)})`
    );
  }
  L.push("  insert into public.companions (id,profile_id,bio,hourly_rate,languages,activities,rating_avg,total_reviews,verified,photos)");
  L.push("  values");
  L.push(cVals.join(",\n"));
  L.push("  on conflict (id) do update set");
  L.push("    bio=excluded.bio, hourly_rate=excluded.hourly_rate,");
  L.push("    languages=excluded.languages, activities=excluded.activities,");
  L.push("    rating_avg=excluded.rating_avg, total_reviews=excluded.total_reviews,");
  L.push("    verified=excluded.verified, photos=excluded.photos;");

  // availability_slots (2 per day × 5 days × 14 companions)
  L.push("\n  -- availability_slots");
  L.push("  delete from public.availability_slots");
  L.push(`    where companion_id in (${COMPANION_UUIDS.slice(0, count).map(sq).join(",")});`);

  const slotVals = [];
  for (let i = 0; i < count; i++) {
    for (const date of dates) {
      // Morning slot: 10:00–13:00
      slotVals.push(`    (gen_random_uuid(),v_c${i+1},${sq(date)},'10:00','13:00',false)`);
      // Evening slot: 18:00–21:00
      slotVals.push(`    (gen_random_uuid(),v_c${i+1},${sq(date)},'18:00','21:00',false)`);
    }
  }
  L.push("  insert into public.availability_slots (id,companion_id,date,time_start,time_end,is_booked)");
  L.push("  values");
  L.push(slotVals.join(",\n") + ";");

  L.push("\nend $seed$;");

  const sql      = L.join("\n");
  const seedPath = join(ROOT, "supabase", "seeds", "003_real_companions.sql");
  await writeFile(seedPath, sql, "utf8");

  console.log("\n" + "═".repeat(72));
  console.log("SQL saved to: supabase/seeds/003_real_companions.sql");
  console.log("═".repeat(72));
  console.log(sql);
  console.log("\n✅  Done. Paste the SQL above into the Supabase SQL Editor.");
}

main().catch((err) => {
  console.error("Fatal:", err.message);
  process.exit(1);
});
