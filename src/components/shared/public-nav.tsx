import Link from "next/link";
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
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg tracking-tight">
          RentGF
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            href="/companions"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            Browse
          </Link>
          {dashboardHref ? (
            <Link
              href={dashboardHref}
              className={cn(buttonVariants({ size: "sm" }))}
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className={cn(buttonVariants({ size: "sm" }))}
            >
              Log in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
