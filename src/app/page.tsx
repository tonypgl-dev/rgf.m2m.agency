import Link from "next/link";
import { PublicNav } from "@/components/shared/public-nav";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    num: "01",
    title: "Browse verified local guides in your city",
    description:
      "See who’s available where you’re staying — languages, activities, and rates up front.",
  },
  {
    num: "02",
    title: "Book a few hours — dinner, tour, coffee, hiking",
    description:
      "Pick a time that works, choose what you want to do, and pay securely in the app.",
  },
  {
    num: "03",
    title: "Explore Romania like you actually live here",
    description:
      "Spend time with someone who knows the city — not a script, not a bus tour.",
  },
];

const TRUST = [
  {
    title: "Verified locals only",
    body: "Every guide is reviewed by Roamly before they go live.",
  },
  {
    title: "English & more",
    body: "English across the platform; many guides also speak Spanish and at least one other language.",
  },
  {
    title: "Safe & transparent",
    body: "Pay through the app and rate your experience after.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav dark />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="relative text-white flex flex-col items-center justify-center text-center px-4 py-28 sm:py-36 min-h-[88vh] overflow-hidden"
        style={{
          backgroundColor: "#0D0A1A",
        }}
      >
        {/* Layer 1 — Radial gradient colour wash */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: [
              "radial-gradient(ellipse 70% 55% at 50% 105%, rgba(249,115,22,0.06) 0%, transparent 70%)",
              "radial-gradient(ellipse 60% 70% at -5% 5%,  rgba(124,58,237,0.10) 0%, transparent 68%)",
            ].join(", "),
          }}
        />

        {/* Layer 2+3 — Street map bottom (recedes downward) */}
        <div
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            inset: "-40% -20%",
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='320'%3E%3Cline x1='80' y1='0' x2='200' y2='320' stroke='rgba(255,255,255,0.08)' stroke-width='1.5'/%3E%3Cline x1='0' y1='60' x2='320' y2='175' stroke='rgba(255,255,255,0.07)' stroke-width='1'/%3E%3Cline x1='0' y1='140' x2='320' y2='105' stroke='rgba(255,255,255,0.06)' stroke-width='1'/%3E%3Cline x1='155' y1='0' x2='265' y2='320' stroke='rgba(255,255,255,0.05)' stroke-width='0.5'/%3E%3Cline x1='0' y1='215' x2='185' y2='260' stroke='rgba(255,255,255,0.05)' stroke-width='0.5'/%3E%3Cline x1='105' y1='0' x2='35' y2='320' stroke='rgba(255,255,255,0.04)' stroke-width='0.5'/%3E%3Cline x1='255' y1='0' x2='295' y2='320' stroke='rgba(255,255,255,0.05)' stroke-width='0.5'/%3E%3Cline x1='0' y1='75' x2='115' y2='320' stroke='rgba(255,255,255,0.04)' stroke-width='0.5'/%3E%3Cline x1='0' y1='305' x2='320' y2='275' stroke='rgba(255,255,255,0.06)' stroke-width='1'/%3E%3Cline x1='0' y1='185' x2='320' y2='228' stroke='rgba(255,255,255,0.04)' stroke-width='0.5'/%3E%3Cpath d='M 60 120 Q 100 95 145 128 Q 185 160 225 138' stroke='rgba(255,255,255,0.05)' stroke-width='0.5' fill='none'/%3E%3Cpath d='M 5 248 Q 65 235 92 258 Q 132 282 162 262' stroke='rgba(255,255,255,0.04)' stroke-width='0.5' fill='none'/%3E%3Cpath d='M 112 82 L 128 122 L 165 118 C 178 116 182 122 185 132 L 178 162 C 172 178 182 186 174 200 L 158 222 C 150 240 158 250 150 268 L 142 285 C 136 298 148 306 155 318' stroke='rgba(249,115,22,0.32)' stroke-width='1.5' fill='none' stroke-dasharray='5 3'/%3E%3C/svg%3E")`,
            backgroundSize: "320px 320px",
            transform: "perspective(600px) rotateX(35deg)",
            transformOrigin: "center bottom",
          }}
        />

        {/* Layer — Street map mid-hero, below text, viewed from above, fades at edges */}
        <div
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            top: "calc(28% - 50px)",
            left: "-20%",
            right: "-20%",
            height: "55%",
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='320'%3E%3Cline x1='80' y1='0' x2='200' y2='320' stroke='rgba(255,255,255,0.08)' stroke-width='1.5'/%3E%3Cline x1='0' y1='60' x2='320' y2='175' stroke='rgba(255,255,255,0.07)' stroke-width='1'/%3E%3Cline x1='0' y1='140' x2='320' y2='105' stroke='rgba(255,255,255,0.06)' stroke-width='1'/%3E%3Cline x1='155' y1='0' x2='265' y2='320' stroke='rgba(255,255,255,0.05)' stroke-width='0.5'/%3E%3Cline x1='0' y1='215' x2='185' y2='260' stroke='rgba(255,255,255,0.05)' stroke-width='0.5'/%3E%3Cline x1='105' y1='0' x2='35' y2='320' stroke='rgba(255,255,255,0.04)' stroke-width='0.5'/%3E%3Cline x1='255' y1='0' x2='295' y2='320' stroke='rgba(255,255,255,0.05)' stroke-width='0.5'/%3E%3Cline x1='0' y1='75' x2='115' y2='320' stroke='rgba(255,255,255,0.04)' stroke-width='0.5'/%3E%3Cline x1='0' y1='305' x2='320' y2='275' stroke='rgba(255,255,255,0.06)' stroke-width='1'/%3E%3Cline x1='0' y1='185' x2='320' y2='228' stroke='rgba(255,255,255,0.04)' stroke-width='0.5'/%3E%3Cpath d='M 60 120 Q 100 95 145 128 Q 185 160 225 138' stroke='rgba(255,255,255,0.05)' stroke-width='0.5' fill='none'/%3E%3Cpath d='M 5 248 Q 65 235 92 258 Q 132 282 162 262' stroke='rgba(255,255,255,0.04)' stroke-width='0.5' fill='none'/%3E%3Cpath d='M 55 38 L 118 32 C 148 28 162 45 155 62 C 148 79 128 82 115 72 C 102 62 108 42 122 35 L 198 52 C 218 56 224 75 212 88 L 172 125 C 158 140 168 152 155 148 C 142 144 138 158 145 170 C 152 182 145 195 138 205 C 131 215 142 228 135 242' stroke='rgba(249,115,22,0.32)' stroke-width='1.5' fill='none' stroke-dasharray='5 3'/%3E%3C/svg%3E")`,
            backgroundSize: "320px 320px",
            transform: "perspective(700px) rotateX(55deg)",
            transformOrigin: "center top",
            maskImage: "linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)",
          }}
        />


        {/* Layer 5a — Vignette */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 75% 70% at 50% 50%, transparent 30%, rgba(0,0,0,0.55) 100%)",
          }}
        />

        {/* Layer 5b — Noise / grain texture */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            opacity: 0.03,
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/40 mb-8">
            Roamly · Romania
          </p>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.04]">
            Your local guide in Romania
            <span className="relative inline-block">
              .
              {/* Pulse dot sits over the period */}
              <span
                aria-hidden
                className="pointer-events-none absolute"
                style={{ top: "calc(0.15em + 26px)", width: 8, height: 8, left: "50%", transform: "translateX(calc(-50% + 0.5px))" }}
              >
                <span
                  className="hero-pulse absolute inset-0 rounded-full"
                  style={{
                    background: "rgba(249,115,22,0.5)",
                    boxShadow: "0 0 20px rgba(249,115,22,0.6), 0 0 50px rgba(249,115,22,0.25)",
                  }}
                />
                <span
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "#F97316",
                    boxShadow: "0 0 12px #F97316, 0 0 30px rgba(249,115,22,0.4)",
                  }}
                />
              </span>
            </span>
          </h1>

          <p className="mt-7 text-base sm:text-lg text-white/60 max-w-lg mx-auto leading-relaxed">
            Book a verified local for dinner, city tours, hiking, or a night out. Real
            people. Real experiences.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 items-center justify-center">
            <Link
              href="/companions"
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-lg",
                "bg-accent-warm text-white font-semibold text-base",
                "px-8 py-3 hover:bg-accent-warm/90 transition-colors",
                "shadow-[0_4px_24px_rgba(251,146,60,0.45)]"
              )}
            >
              Find a guide →
            </Link>
            <a
              href="#how-it-works"
              className={cn(
                "inline-flex items-center justify-center rounded-lg",
                "border border-white/20 text-white/70 hover:text-white hover:border-white/40",
                "font-medium text-sm px-7 py-3 transition-colors"
              )}
            >
              How it works
            </a>
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section id="how-it-works" className="bg-background border-t py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center mb-16">
            How it works
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8">
            {STEPS.map(({ num, title, description }) => (
              <div key={num} className="flex flex-col">
                <span
                  className="text-5xl font-bold tabular-nums leading-none mb-5 select-none"
                  style={{ color: "oklch(0.165 0.025 264 / 0.08)" }}
                >
                  {num}
                </span>
                <h3 className="font-semibold text-base mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust ────────────────────────────────────────────────────────── */}
      <section className="bg-muted/50 border-t py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold tracking-tight text-center mb-10">
            Why travelers choose Roamly
          </h2>
          <ul className="space-y-6">
            {TRUST.map((item) => (
              <li key={item.title} className="text-center sm:text-left">
                <p className="font-semibold text-foreground">{item.title}</p>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── What Roamly is NOT ───────────────────────────────────────────── */}
      <section className="bg-background border-t py-10 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Roamly is a social companionship and local guide platform. It is not a dating
            app, escort service, or traditional tour agency. All guides follow our{" "}
            <Link
              href="#"
              className="text-foreground/80 underline underline-offset-2 hover:text-foreground"
            >
              community guidelines
            </Link>
            .
          </p>
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────────────────── */}
      <section className="bg-muted/50 border-t py-16 px-4 text-center">
        <h2 className="text-2xl font-bold tracking-tight mb-3">
          Ready to see Romania with a local?
        </h2>
        <p className="text-muted-foreground mb-7 max-w-md mx-auto text-sm">
          Browse guides in Bucharest, Cluj, Brașov, and more — book when you&apos;re ready.
        </p>
        <Link
          href="/companions"
          className={cn(
            "inline-flex items-center justify-center rounded-lg",
            "bg-foreground text-primary-foreground font-semibold",
            "px-9 py-3 hover:bg-foreground/90 transition-colors"
          )}
        >
          Browse guides
        </Link>
      </section>

    </div>
  );
}
