import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: companion, error } = await supabase
    .from("companions")
    .select("id, stripe_account_id")
    .eq("profile_id", user.id)
    .single();

  if (error || !companion) {
    return NextResponse.json({ error: "Companion profile not found" }, { status: 404 });
  }

  let accountId = companion.stripe_account_id as string | null;

  if (!accountId) {
    const account = await stripe.accounts.create({
      type: "express",
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    accountId = account.id;

    const service = createServiceClient();
    const { error: updateError } = await service
      .from("companions")
      .update({ stripe_account_id: accountId })
      .eq("id", companion.id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }
  }

  const origin =
    request.headers.get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${origin}/companion/profile?stripe=refresh`,
    return_url: `${origin}/companion/profile?stripe=success`,
    type: "account_onboarding",
  });

  return NextResponse.json({ url: accountLink.url });
}
