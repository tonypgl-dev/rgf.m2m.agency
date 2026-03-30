import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

// One-time fix: resets test account passwords via service role so signInWithPassword works.
// Visit /fix-auth once, then delete this file.
export async function GET() {
  const service = createServiceClient();

  const accounts = [
    { email: "turist@gmail.com",   password: "1234" },
    { email: "companion@gmail.com", password: "1234" },
    { email: "admin@gmail.com",     password: "1234" },
  ];

  const roleByEmail: Record<string, "tourist" | "companion" | "admin"> = {
    "turist@gmail.com": "tourist",
    "companion@gmail.com": "companion",
    "admin@gmail.com": "admin",
  };

  const results: Record<string, string> = {};

  const { data: list } = await service.auth.admin.listUsers();
  const existingEmails = new Set(list?.users?.map((u) => u.email));

  for (const account of accounts) {
    if (existingEmails.has(account.email)) {
      // User exists — just reset password
      const user = list!.users.find((u) => u.email === account.email)!;
      const { error } = await service.auth.admin.updateUserById(user.id, {
        password: account.password,
        email_confirm: true,
      });
      if (error) {
        results[account.email] = `update error: ${error.message}`;
        continue;
      }

      const { error: profileError } = await service.from("profiles").upsert(
        {
          id: user.id,
          role: roleByEmail[account.email],
        },
        { onConflict: "id" }
      );
      results[account.email] = profileError
        ? `updated auth; profile error: ${profileError.message}`
        : "updated + profile upserted";
    } else {
      // User doesn't exist — create it
      const { data: created, error } = await service.auth.admin.createUser({
        email: account.email,
        password: account.password,
        email_confirm: true,
      });
      if (error) {
        results[account.email] = `create error: ${error.message}`;
        continue;
      }

      const userId = created.user?.id;
      if (!userId) {
        results[account.email] = "create error: missing created user id";
        continue;
      }

      const { error: profileError } = await service.from("profiles").upsert(
        {
          id: userId,
          role: roleByEmail[account.email],
        },
        { onConflict: "id" }
      );
      results[account.email] = profileError
        ? `created auth; profile error: ${profileError.message}`
        : "created + profile upserted";
    }
  }

  return NextResponse.json({ results });
}
