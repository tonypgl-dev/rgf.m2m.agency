import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { MOCK_USER_ID } from "@/lib/supabase/server";

// One-time setup: creates the mock tourist user with a fixed UUID.
// Visit /fix-auth once after deploy.
export async function GET() {
  const service = createServiceClient();

  // 1. Create or update auth user with fixed UUID
  const { data: existing } = await service.auth.admin.getUserById(MOCK_USER_ID);

  let authStatus: string;

  if (existing?.user) {
    const { error } = await service.auth.admin.updateUserById(MOCK_USER_ID, {
      password: "1234",
      email_confirm: true,
    });
    authStatus = error ? `update error: ${error.message}` : "auth updated";
  } else {
    const { error } = await service.auth.admin.createUser({
      id: MOCK_USER_ID,
      email: "turist@gmail.com",
      password: "1234",
      email_confirm: true,
    });
    authStatus = error ? `create error: ${error.message}` : "auth created";
  }

  // 2. Upsert profile row so dashboard queries work
  const { error: profileError } = await service.from("profiles").upsert(
    {
      id: MOCK_USER_ID,
      role: "tourist",
      full_name: "Test Tourist",
      city: "Bucharest",
    },
    { onConflict: "id" }
  );

  const profileStatus = profileError
    ? `profile error: ${profileError.message}`
    : "profile ok";

  return NextResponse.json({ authStatus, profileStatus, mockUserId: MOCK_USER_ID });
}
