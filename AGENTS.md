<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

## Next.js 16 — Critical differences
- Middleware file is `src/proxy.ts`, NOT `src/middleware.ts`
- Exported function must be named `proxy`, NOT `middleware`
- Config export (`export const config`) is unchanged
<!-- END:nextjs-agent-rules -->

---

# Roamly — Agent Handoff Context (2026-04-05)

## Ce este proiectul
Platformă care conectează turiști străini cu ghizi locali verificați din România.
**Live:** `rgf.m2m.agency` (Vercel, auto-deploy din `main` pe GitHub `tonypgl-dev/rgf.m2m.agency`)
**Stack:** Next.js 16 · TypeScript · Tailwind CSS v4 · Supabase · Stripe

## Starea curentă — MOCK AUTH ACTIV

**Toată autentificarea este bypass-uită.** `src/lib/supabase/server.ts` patchuiește `client.auth.getUser` să returneze mereu un user fix:
```ts
MOCK_USER_ID = "10000000-0000-0000-0000-000000000001"
email: "turist@gmail.com", role: "tourist"
```
- `src/proxy.ts` este passthrough (nu face redirect la login)
- `/login` și `/register` redirecționează direct la `/tourist/dashboard`
- Dashboard-ul are fallback mock profile dacă profilul nu există în DB
- **Nu schimba mock-ul fără să discuți cu utilizatorul**

## Arhitectură fișiere cheie
```
src/proxy.ts                          — middleware passthrough (mock mode)
src/lib/supabase/server.ts            — mock auth patch
src/app/page.tsx                      — landing page + hero
src/app/(tourist)/tourist/dashboard/  — dashboard tourist
src/app/(tourist)/tourist/profile/    — profil tourist (page + form + actions)
src/app/(public)/companions/[id]/     — profil public ghid
src/components/shared/public-nav.tsx  — navbar public
src/components/shared/bottom-nav.tsx  — nav mobil (tourist/companion)
src/components/shared/splash-screen.tsx — splash la fiecare refresh
src/app/globals.css                   — CSS variables, keyframes, dark mode
```

## Teme/culori — convenții
- Dark bg: `#0D0A1A`, surface: `#13101F`, elevated: `#1A1628`
- Light bg: `#EDE8F8` (hero), `#F4F2F9` (app)
- Violet accent: `#A67CFF` (dark) / `#7C3AED` (light) — `var(--accent-violet)`
- Orange accent: `#F97316` — `var(--accent-orange)`
- Dark mode tokens (`--background`, `--primary` etc.) sunt setate atât în `.dark` cât și în `@media (prefers-color-scheme: dark)` din `globals.css`
- Butoanele `variant="outline"` din shadcn au gradient alb hardcodat — în dark mode trebuie override cu `dark:[background-image:none]`

## Hero (src/app/page.tsx)
- Light mode: bg `#EDE8F8`, linii grid mov închis `rgba(70,35,140,0.18)`
- Dark mode: bg `#0D0A1A`, linii grid albe `rgba(255,255,255,0.08)`
- SVG-uri separate per temă (4 div-uri grid: bottom-light, bottom-dark, mid-light, mid-dark)
- Serpentine portocalii `rgba(249,115,22,0.45)` light / `0.32` dark, `stroke-dasharray="5 3"`
- Buton CTA "Find a guide" folosește clasa `.btn-orange-glow` (definită în globals.css)

## Ce e de făcut (pending)
1. **Pagina `/tourist/profile`** — există deja (`page.tsx` + `profile-form.tsx` + `actions.ts`), funcțională
2. **Sistem "Ghid-Only Reviews"** — recenzii despre turiști vizibile DOAR pentru alți ghizi; tabel DB `tourist_reviews` (`reviewer_companion_id`, `tourist_id`, `rating`, `note`, `booking_id`); **neimplementat**
3. **Pricing system** — tarif bază + modificatori activitate/interval orar/volum + template-uri slot; **neimplementat** (spec completă în `gemini-claude.md`)
4. **Contra-ofertă ghid** la Request Booking — **neimplementat**
5. **RLS policies** pe tabele Supabase — **lipsesc complet** (risc de securitate)
6. **Înlocuire "Companion" → "Local Guide"** în UI (dashboard, settings) — parțial
7. **Audit mobil** — touch targets, PWA, iOS/Android

## Deploy rapid
```bash
git add <fișiere>
git commit -m "descriere"
git push origin main
# Vercel deployează automat în ~1-2 min pe rgf.m2m.agency
```
Vezi `deploy.md` pentru detalii complete.

## Fișiere de context suplimentar
- `gemini-claude.md` — log PM strategic, toate deciziile de produs
- `deploy.md` — instrucțiuni deploy + note Next.js 16
- `brand-identity.md` — branding, ton, taglines
