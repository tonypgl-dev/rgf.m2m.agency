import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// DEV ONLY — auto-login for testing. Remove before production.
export async function GET(req: NextRequest) {
  const role = req.nextUrl.searchParams.get("role") ?? "tourist";

  const credentials: Record<string, { email: string; password: string; redirect: string }> = {
    tourist:   { email: "turist@gmail.com",    password: "1234", redirect: "/tourist/dashboard" },
    companion: { email: "companion@gmail.com",  password: "1234", redirect: "/companion/dashboard" },
    admin:     { email: "admin@gmail.com",       password: "1234", redirect: "/" },
  };

  const cred = credentials[role] ?? credentials.tourist;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email: cred.email, password: cred.password });

  // If login fails (e.g. test account doesn't exist on production), go home instead of looping
  if (error) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.redirect(new URL(cred.redirect, req.url));
}
