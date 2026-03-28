import Link from "next/link";
import { PublicNav } from "@/components/shared/public-nav";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";
import { Search, CalendarCheck, MapPin } from "lucide-react";

const HOW_IT_WORKS = [
  {
    icon: Search,
    step: "1",
    title: "Browse local companions",
    description:
      "Explore verified local guides across Romania. Filter by city, language, activity and price.",
  },
  {
    icon: CalendarCheck,
    step: "2",
    title: "Book a time slot",
    description:
      "Pick an available slot, choose your activity and meeting point, then pay securely online.",
  },
  {
    icon: MapPin,
    step: "3",
    title: "Explore together",
    description:
      "Your companion meets you and shows you the Romania that tourists never see.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 bg-gradient-to-b from-background to-muted/40">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">
          Local experiences · Romania
        </p>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight max-w-2xl">
          Meet a local.
          <br />
          <span className="text-primary">Explore Romania</span> together.
        </h1>

        <p className="mt-6 text-lg text-muted-foreground max-w-xl">
          Skip the tour buses. Book a verified local companion for a real, personal
          experience — city walks, dinners, cultural visits and more.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full max-w-xs sm:max-w-none sm:w-auto">
          <Link
            href="/companions"
            className={cn(
              buttonVariants({ size: "lg" }),
              "px-8 justify-center"
            )}
          >
            Find your companion
          </Link>
          <a
            href="#how-it-works"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "px-8 justify-center"
            )}
          >
            How it works
          </a>
        </div>

        {/* Trust line */}
        <p className="mt-8 text-xs text-muted-foreground">
          All companions are verified · Secure payments · Real reviews
        </p>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section
        id="how-it-works"
        className="bg-background border-t py-16 px-4"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center tracking-tight mb-2">
            How it works
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            Book a local experience in three simple steps.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map(({ icon: Icon, step, title, description }) => (
              <div key={step} className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-primary/10 mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
                  Step {step}
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

      {/* ── Bottom CTA ───────────────────────────────────────────────────── */}
      <section className="bg-muted/40 border-t py-14 px-4 text-center">
        <h2 className="text-2xl font-bold tracking-tight mb-3">
          Ready to explore Romania differently?
        </h2>
        <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
          Dozens of local companions waiting to show you their city.
        </p>
        <Link
          href="/companions"
          className={cn(
            buttonVariants({ size: "lg" }),
            "px-10 justify-center"
          )}
        >
          Browse companions
        </Link>
      </section>

      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} RentGF — Local companion experiences in Romania
      </footer>
    </div>
  );
}
