# Roamly

Platform connecting foreign tourists with verified local guides in Romania.

**Live:** roamly.ro
**Local:** localhost:3000
**Stack:** Next.js 16 · TypeScript · Tailwind CSS v4 · Supabase · Stripe

## Quick Start

```bash
npm install
npm run dev
```

## Docs

| File | Content |
|---|---|
| `brand-identity.md` | Brand name, taglines, positioning, tone of voice |
| `docs/strategy.md` | Marketing strategy, ideas, future features |
| `docs/marketing-context.md` | Context for marketing/business discussions |
| `docs/agent-upload-photos.md` | Pending task: upload Poze/ to Supabase Storage |

## Architecture

- `/src/app/(public)` — landing page, guides browse
- `/src/app/(auth)` — login, register
- `/src/app/(tourist)` — tourist dashboard, bookings, chat
- `/src/app/(companion)` — guide dashboard, profile, availability
- `/src/lib/supabase` — browser + server + service role clients
- `/supabase/migrations` — database schema (001–007)
- `/supabase/seeds` — test data

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `STRIPE_SECRET_KEY` *(not yet configured)*
