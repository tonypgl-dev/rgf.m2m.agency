import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

export async function PublicNav() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let dashboardHref: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    dashboardHref =
      profile?.role === "companion"
        ? "/companion/dashboard"
        : "/tourist/dashboard";
  }

  return (
    <header
        className={cn(
          "sticky top-0 z-40 backdrop-blur-[20px] border-b",
          "bg-[rgba(255,255,255,0.75)] border-[rgba(120,100,180,0.10)] shadow-[0_1px_24px_rgba(120,100,180,0.08)]",
          "dark:bg-[var(--bg-surface)] dark:border-border dark:shadow-none"
        )}
      >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 shrink-0"
        >
          {/* Logo hybrid: PNG + animated map-point dot */}
          <div className="relative" style={{ width: 34, height: 40 }}>
            <Image
              src="/logo3.png"
              alt="Roamly"
              width={54}
              height={63}
              className="h-10 w-auto"
              priority
            />
            {/* Heartbeat pulse — centrat în bucla superioară a R-ului */}
            <div className="absolute flex items-center justify-center pointer-events-none" style={{ top: "14.1px", left: "13.4px" }}>
              {/* Outer wave (Faded Pulse) */}
              <span 
                className="absolute inline-flex h-4 w-4 animate-heartbeat-sonar rounded-lg" 
                style={{ 
                  background: 'radial-gradient(circle, var(--accent-orange) 0%, transparent 70%)'
                }}
              />
              {/* Core dot */}
              <span className="relative inline-flex rounded-lg bg-[var(--accent-orange)] shadow-[0_0_8px_var(--accent-orange-glow)]" style={{ width: "4.2px", height: "4.2px" }} />
            </div>
          </div>
          <span style={{ fontFamily: "var(--font-comfortaa)" }}>
            <span style={{
              fontSize: "1.2rem",
              fontWeight: 700, /* Comfortaa max — renders as bold */
              color: "var(--accent-violet)",
              letterSpacing: "-0.3px",
              filter: "drop-shadow(0 0 6px var(--accent-violet-glow))",
            }}>
              ROAM
            </span>
            <span style={{
              fontSize: "0.72rem",
              fontWeight: 400,
              color: "var(--text-secondary)",
              opacity: 0.5,
              position: "relative",
              top: "1px",
            }}>
              ly
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          <ThemeToggle />
          <Link
            href="/companions"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "font-medium text-[var(--text-secondary)] hover:text-[var(--accent-violet)]"
            )}
          >
            Guides
          </Link>
          {dashboardHref ? (
            <Link
              href={dashboardHref}
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "font-medium text-[var(--text-secondary)] hover:text-[var(--accent-violet)]",
                "dark:[background-image:none] dark:bg-[var(--bg-elevated)] dark:text-[var(--accent-violet)] dark:border-[rgba(124,58,237,0.25)] dark:hover:border-[rgba(124,58,237,0.5)]"
              )}
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "font-medium text-[var(--text-secondary)] hover:text-[var(--accent-violet)]",
                "dark:[background-image:none] dark:bg-[var(--bg-elevated)] dark:text-[var(--accent-violet)] dark:border-[rgba(124,58,237,0.25)] dark:hover:border-[rgba(124,58,237,0.5)]"
              )}
            >
              Log in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
