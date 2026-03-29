import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";

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
    <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border/60">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 shrink-0"
        >
          <Image
            src="/logo.png"
            alt="Roamly"
            width={36}
            height={44}
            className="h-9 w-auto object-contain"
            priority
          />
          <span
            className="font-semibold text-lg tracking-[2.5px]"
            style={{ color: "#1F1F2E" }}
          >
            Roamly
          </span>
        </Link>

        <nav className="flex items-center gap-1">
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
