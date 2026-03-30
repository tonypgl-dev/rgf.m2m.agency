import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

export async function PublicNav({ dark = false }: { dark?: boolean } = {}) {
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
          "sticky top-0 z-40 backdrop-blur-md",
          dark
            ? ""
            : "bg-background/80 border-b border-border"
        )}
        style={dark ? {
          backgroundColor: "rgba(17,14,31,0.88)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        } : undefined}
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
                className="absolute inline-flex h-4 w-4 animate-heartbeat-sonar rounded-full" 
                style={{ 
                  background: 'radial-gradient(circle, rgba(249,115,22,0.8) 0%, rgba(249,115,22,0) 70%)' 
                }}
              />
              {/* Core dot */}
              <span className="relative inline-flex rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.45)]" style={{ width: "4.2px", height: "4.2px" }} />
            </div>
          </div>
          <span style={{ fontFamily: "var(--font-comfortaa)" }}>
            <span style={{
              fontSize: "1.2rem",
              fontWeight: 700, /* Comfortaa max — renders as bold */
              color: "#A67CFF",
              letterSpacing: "-0.3px",
              filter: "drop-shadow(0 0 6px rgba(166,124,255,0.35))",
            }}>
              ROAM
            </span>
            <span style={{
              fontSize: "0.72rem",
              fontWeight: 400,
              color: "var(--foreground)",
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
              "text-muted-foreground hover:text-foreground"
            )}
          >
            Guides
          </Link>
          {dashboardHref ? (
            <Link
              href={dashboardHref}
              className={cn(buttonVariants({ size: "sm" }))}
            >
              Dashboard
            </Link>
          ) : (
            <Link href="/login" className={cn(buttonVariants({ size: "sm" }))}>
              Log in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
