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

  const cred = credentials[role];
  if (!cred) {
    console.error("[auto-login] Invalid role parameter", { role });
    return NextResponse.redirect(new URL("/", req.url));
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: cred.email,
    password: cred.password,
  });

  if (error) {
    console.error("[auto-login] signInWithPassword failed", {
      role,
      email: cred.email,
      error,
      errorJson:
        typeof (error as unknown as { toJSON?: () => unknown }).toJSON === "function"
          ? (error as unknown as { toJSON: () => unknown }).toJSON()
          : null,
    });
    return NextResponse.redirect(new URL("/", req.url));
  }

  const userId = data.user?.id;
  if (!userId) {
    console.error("[auto-login] Missing user in auth response", { role, email: cred.email, data });
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Prevent /login -> /auto-login -> protected route -> /login loops
  // when auth user exists but profiles row is missing or has wrong role.
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("id", userId)
    .maybeSingle();

  if (profileError) {
    console.error("[auto-login] Failed to fetch profile after login", {
      role,
      userId,
      profileError,
    });
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!profile) {
    console.error("[auto-login] Missing profile row for authenticated user", {
      role,
      userId,
      email: cred.email,
    });
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (profile.role !== role) {
    console.error("[auto-login] Profile role mismatch", {
      requestedRole: role,
      profileRole: profile.role,
      userId,
      email: cred.email,
    });
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.redirect(new URL(cred.redirect, req.url));
}
