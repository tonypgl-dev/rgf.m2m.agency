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
      <PublicNav />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-foreground text-white flex flex-col items-center justify-center text-center px-4 py-28 sm:py-36 min-h-[88vh]">
        <div
          aria-hidden
          className="absolute inset-0 overflow-hidden pointer-events-none"
        >
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-accent/15 blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/40 mb-8">
            Roamly · Romania
          </p>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.04]">
            Your local guide in Romania.
          </h1>

          <p className="mt-7 text-base sm:text-lg text-white/60 max-w-lg mx-auto leading-relaxed">
            Book a verified local for dinner, city tours, hiking, or a night out. Real
            people. Real experiences.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 items-center justify-center">
            <Link
              href="/companions"
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-full",
                "bg-accent-warm text-white font-semibold text-base",
                "px-8 py-3.5 hover:bg-accent-warm/90 transition-colors",
                "shadow-[0_4px_24px_rgba(251,146,60,0.45)]"
              )}
            >
              Find a guide →
            </Link>
            <a
              href="#how-it-works"
              className={cn(
                "inline-flex items-center justify-center rounded-full",
                "border border-white/20 text-white/70 hover:text-white hover:border-white/40",
                "font-medium text-sm px-7 py-3.5 transition-colors"
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
            "inline-flex items-center justify-center rounded-full",
            "bg-foreground text-primary-foreground font-semibold",
            "px-9 py-3.5 hover:bg-foreground/90 transition-colors"
          )}
        >
          Browse guides
        </Link>
      </section>

    </div>
  );
}
