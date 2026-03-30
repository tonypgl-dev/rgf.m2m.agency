# Deploy — rgf.m2m.agency

Deploy-ul este complet automat prin **Vercel + GitHub**. Orice push pe `main` declanșează un nou build.

## Flux rapid

```bash
git add <fișiere>
git commit -m "descriere"
git push origin main
```

Vercel detectează push-ul și deployează în ~1-2 minute pe `rgf.m2m.agency`.

## Repo GitHub

`https://github.com/tonypgl-dev/rgf.m2m.agency`

## Verificare build

Dashboard Vercel → proiectul `rgf.m2m.agency` → tab **Deployments**.

---

## Note tehnice importante

### Next.js 16 — `proxy.ts` în loc de `middleware.ts`

Next.js 16 a redenumit conceptul de middleware în **proxy**:

| Aspect | Next.js ≤15 | Next.js 16 |
|--------|-------------|------------|
| Fișier | `src/middleware.ts` | `src/proxy.ts` |
| Export funcție | `export function middleware` | `export function proxy` |
| Export config | `export const config` | `export const config` (neschimbat) |

**Eroare dacă greșești:**
```
Proxy is missing expected function export name
```

Fișierul curent `src/proxy.ts` trebuie să exporte `proxy`, nu `middleware`.

### Mock auth (dev/prod temporar)

`src/lib/supabase/server.ts` patchuiește `auth.getUser` să returneze mereu un user de test (`MOCK_USER_ID = "10000000-0000-0000-0000-000000000001"`). `proxy.ts` este passthrough cât timp mock-ul e activ — nu face redirect la `/login`.

Când se dezactivează mock-ul, `proxy.ts` trebuie să recupereze logica de auth guard (redirect `/tourist/*` și `/companion/*` dacă nu e user).
