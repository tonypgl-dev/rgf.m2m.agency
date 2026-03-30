# Roamly — Executive PM Log (PM1 & PM2)
> Document strategic de coordonare. Nu ștergeți deciziile fără aprobarea utilizatorului.

---

## 🚀 Status & Direcții Rapide (TL;DR)

### 1. Priorități Actuale (Q1 2026)
- **Polish UI:** Optimizare pentru mobil (PWA), viteza de încărcare, touch targets.
- **Polish Backend:** Stabilitatea plăților Stripe și a sistemului de rezervări.
- **Supply Recruitment:** Atragerea primelor 10-20 ghizi (Local Guides) prin campanii targetate (Meta/TikTok).

### 2. Decizii Strategice (Titluri)
- ✅ **Branding:** "Local Guide / Local Host" în UI vs "Companion" în cod.
- ✅ **Onboarding:** KYC opțional post-înregistrare (nu blocker).
- ✅ **Booking Flow:** Fără chat pre-booking (adăugare câmp "Cerințe Speciale").
- ✅ **Public Profile:** Pagina `/guides/[id]` implementată (Hero Swipe, Sticky CTA, Booking Sheet).
- ✅ **Platformă:** Focus Mobile-First (PWA) cu Desktop Minimalist.

---

## 🧠 Log Decizii & Raționament ("De ce?")

### [2026-03-30] Pagina de Profil Public (/guides/[id])
- **Decizie:** Implementare layout complex: Hero Swipe Gallery (mobile full-bleed), Identity Section, Activity Tags colorate, Bio expandabil și 7-day Availability Strip.
- **De ce:** Este nucleul de conversie. Layout-ul și Sticky CTA-ul maximizează încrederea și ușurința rezervării pe mobil.

### [2026-03-30] Branding: Local Guide vs Companion
- **Decizie:** Folosim exclusiv "Local Guide" sau "Local Host" în interfața grafică.
- **De ce:** Elimină stigmatul social și ambiguitatea legală. Poziționează serviciul ca unul profesional de turism, nu de escortă. Intern (DB/Cod) păstrăm `companion` pentru a evita refactoring masiv și riscant în această etapă.

### [2026-03-30] Onboarding & KYC (Know Your Customer)
- **Decizie:** KYC-ul (buletin/ID) este un pas opțional pentru obținerea badge-ului de "Ghid Verificat".
- **De ce:** Conversia este critică la lansare. Fricțiunea cererii de documente la înregistrare ar duce la abandon masiv. Verificarea manuală a primelor 10-20 de profile de către owner este mai rapidă decât dezvoltarea unui sistem automatizat acum.

### [2026-03-30] Booking Flow & Chat
- **Decizie:** Păstrăm fluxul `Browse -> Profil -> Rezervare -> Plată`, fără chat pre-booking.
- **De ce:** Chat-ul înainte de plată favorizează "platform leakage". Soluția: Un câmp de "Cerințe Speciale" în formularul de booking (implementat în Booking Sheet).

### [2026-03-30] Clarificare Chat — Modelul cu Wallet rezolvă Leakage-ul
- **Clarificare:** Modelul de chat cu barieră financiară ($40 minim în wallet) este aprobat ca direcție post-lansare.
- **De ce:** Userul are deja bani blocați în platformă înainte de conversația extinsă.

---

## 🛠️ Task-uri Deschise pentru PM1/PM2
- [x] Implementare pagină Profil Public (`/guides/[id]`).
- [x] Implementare câmp "Special Requests" în fluxul de checkout (inclus în Booking Sheet).
- [ ] Audit vizual final pe dispozitive fizice (iOS/Android) pentru touch targets.
- [ ] Finalizarea înlocuirii tuturor termenilor "Companion" cu "Local Guide" în restul aplicației (Dashboard, Settings).

---

### [2026-03-30 11:00] PM1 (Gemini) — Confirmare Implementare Profil
Pagina de profil public este acum gata, integrând toate elementele de polish discutate. Următorul pas: auditul vizual mobil.

---

### [2026-03-30 11:30] PM2 (Claude) — Sistem de Prețuri & Booking (Specificații)

**Monedă:** RON exclusiv.

**Dashboard Ghid — Sistem de Prețuri:**
- Tarif de bază standard (setat o singură dată)
- Modificatori configurabili:
  - Extra pe tip activitate (ex: +80 RON pentru Dinner)
  - Reduceri la volum (ex: -10% la 3+ ore, -20% la full day)
  - Tarife diferențiate pe interval orar (dimineață / zi / seară)
- Template-uri de calup (ex: "City Tour 3h — 250 RON seara") — ghidul le creează, le editează sau adaugă oricâte vrea
- Tot configurat dintr-un calendar mobil, simplu

**Fluxul Turistului:**
1. Vede disponibilitatea + prețurile pe profilul ghidului (public)
2. Alege un calup predefinit → **booking instant** (fără confirmare necesară)
3. Vrea să modifice calupul (ex: 3h → 2h, altă oră) → **cerere de ofertă** → ghidul confirmă sau refuză

**Două tipuri de booking:**
| Tip | Declanșator | Plată |
|-----|-------------|-------|
| Instant Booking | Turist alege slot predefinit exact | Plătit imediat |
| Request Booking | Turist modifică slot / cere ofertă custom | Plătit după confirmare ghid |

**Întrebări deschise pentru utilizator:**
1. Câte ore are ghidul să confirme un Request Booking? (ex: 24h sau expiră automat?)
2. La Request Booking — se blochează suma în card înainte de confirmare sau se plătește doar după?
3. Poate ghidul să facă contra-ofertă (propune alt preț/oră) sau doar acceptă/refuză?

---
