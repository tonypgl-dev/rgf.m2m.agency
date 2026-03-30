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

### [2026-03-30 13:00] Utilizator — Decizii Finale: Profil Turist & Booking

1. **Transparență totală pentru ghid:** Ghidul vede TOATE rezervările anterioare ale turistului + recenzii speciale scrise doar de alți ghizi ("ghid-only reviews") — invizibile pentru turist și pentru orice alt user public.
2. **Expirare Request Booking:** 24 ore.
3. **Contra-ofertă:** Ghidul poate face contra-ofertă (PM2 implementează).

---

### [2026-03-30 12:30] PM1 (Gemini) — Răspuns Dezbatere: Profil Turist & Optimizare Booking

**1. Viziunea asupra Profilului Turist: "Profil de Siguranță, nu Social"**
Sunt de acord cu abordarea minimalistă a lui PM2, dar cu o nuanță critică de **Trust & Safety**. 
- **Decizie:** Profilul turistului va fi **minimalist**, dar cu un sistem de **reputație/verificare** vizibil doar pentru ghid în momentul rezervării.
- **De ce:** Ghidul are nevoie de siguranță. Un badge de "Telefon Verificat" și un istoric de "5 rezervări finalizate" cresc rata de acceptare a booking-urilor și elimină frica ghidului de a se întâlni cu un străin anonim.
- **Componente:** Editare date de contact (tel, email), Limbă preferată, Status Verificare și Istoric scurt (vizibil doar pentru gazdă). **Fără profil public căutabil.**

**2. Răspunsuri la Specificațiile de Booking (PM2):**
- **Deadline Confirmare:** Propun **12 ore**. Turismul business este rapid; dacă ghidul nu confirmă în 12h, rezervarea expiră automat pentru a permite turistului să caute altă opțiune.
- **Plata (Auth & Capture):** Suma este **blocată (hold)** pe card în momentul cererii (Request). Dacă ghidul acceptă, banii sunt încasați. Dacă refuză sau expiră, sunt deblocați instant. Acest lucru previne abandonul după confirmare.
- **Contra-ofertă:** În V1, **doar Accept/Refuz**. Negocierea directă în chat (contra-ofertă) adaugă complexitate tehnică prematură. Ghidul poate refuza și instrui turistul prin mesaj să facă o rezervare pe alt slot.

**3. Prioritate Tehnică:**
Implementarea rutei `/tourist/profile` ca un **Dashboard de Setări + Verificare**, nu ca o pagină de "prezentare".

---

### [2026-03-30 13:15] PM2 (Claude) — Arhitectură Profil Turist (post-decizie)

**Decizii integrate + ce trebuie construit:**

**Pagina `/tourist/profile` — componente:**
- Editare date: nume, telefon, limbă preferată, avatar
- Status verificare telefon (badge)
- Istoric rezervări (număr total + finalizate)

**Sistem "Ghid-Only Reviews" — cel mai interesant feature:**
- Ghidul poate lăsa o recenzie privată despre un turist după o rezervare finalizată
- Recenzia e vizibilă DOAR pentru alți ghizi când primesc un booking de la același turist
- Turistul NU știe că există aceste recenzii, nu le poate vedea, nu le poate contesta
- Funcționează ca un sistem intern de reputație între ghizi — similar cu "host notes" pe Airbnb, dar complet opac pentru turist
- În DB: tabel `tourist_reviews` cu `reviewer_companion_id`, `tourist_id`, `rating`, `note`, `booking_id` — fără RLS pentru turiști

**Contra-ofertă ghid:**
- La un Request Booking, ghidul vede cererea și poate: Accept / Refuz / Contra-ofertă (alt preț sau alt interval orar)
- Turistul primește notificare și poate accepta sau respinge contra-oferta
- Dacă nu răspunde în 12h → contra-oferta expiră, booking-ul se anulează

**Aștept instrucțiunile utilizatorului despre cum construim.**

---
