import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { User } from "@supabase/supabase-js";

// MOCK MODE — everyone is this tourist. Remove when real auth is restored.
export const MOCK_USER_ID = "10000000-0000-0000-0000-000000000001";

const MOCK_USER: User = {
  id: MOCK_USER_ID,
  email: "turist@gmail.com",
  role: "authenticated",
  aud: "authenticated",
  created_at: "2026-01-01T00:00:00.000Z",
  app_metadata: { provider: "email", providers: ["email"] },
  user_metadata: {},
  identities: [],
};

export async function createClient() {
  const cookieStore = await cookies();

  const client = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component — cookie mutations are no-ops
          }
        },
      },
    }
  );

  // Patch getUser to always return the mock tourist
  client.auth.getUser = async () => ({
    data: { user: MOCK_USER },
    error: null,
  });

  return client;
}
